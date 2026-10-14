"""Web safety utilities: robots.txt compliance and lawful caching."""

import hashlib
import json
import logging
import time
import urllib.parse
import urllib.robotparser
from typing import Any

import redis
import requests

try:
    from django.conf import settings

    _redis_url = getattr(settings, "REDIS_URL", "redis://localhost:6379/0")
except Exception:
    _redis_url = "redis://localhost:6379/0"

logger = logging.getLogger(__name__)

# Connect to redis for lawful ephemeral caching
try:
    _redis_client = redis.Redis.from_url(_redis_url, socket_connect_timeout=0.1, socket_timeout=0.1)
    _redis_client.ping()
except Exception:
    _redis_client = None  # type: ignore

# In-memory fallback cache if Redis is unavailable in local testing
_in_memory_robots_cache: dict[str, dict[str, Any]] = {}


class RobotsTxtValidator:
    """Verifies that external URLs comply with site-specific robots.txt (Fail-Closed)."""

    USER_AGENT = (
        "OpenStudentLearningPlatformResearchBot/1.0 (+https://learning-platform.example.org/bot)"
    )
    NEGATIVE_CACHE_TTL_SECONDS = 300  # 5 minutes for transient failure recovery (ADR 0003)
    POSITIVE_CACHE_TTL_SECONDS = 86400  # 24 hours for successful verification
    TIMEOUT_SECONDS = 5.0

    @classmethod
    def _get_cache(cls, cache_key: str) -> dict[str, Any] | None:
        """Retrieve cached decision from Redis or in-memory fallback."""
        now = time.time()
        if _redis_client:
            try:
                raw = _redis_client.get(cache_key)
                if raw:
                    text = raw.decode("utf-8") if isinstance(raw, bytes) else raw
                    return json.loads(text)
            except Exception as e:
                logger.warning(f"Redis cache lookup error: {e}")

        # In-memory fallback
        entry = _in_memory_robots_cache.get(cache_key)
        if entry:
            if now < entry.get("expires_at", 0):
                return entry.get("payload")
            else:
                _in_memory_robots_cache.pop(cache_key, None)
        return None

    @classmethod
    def _set_cache(cls, cache_key: str, payload: dict[str, Any], ttl_seconds: int) -> None:
        """Store decision in Redis or in-memory fallback with bounded TTL."""
        now = time.time()
        if _redis_client:
            try:
                _redis_client.setex(cache_key, ttl_seconds, json.dumps(payload))
            except Exception as e:
                logger.warning(f"Redis cache write error: {e}")

        # In-memory fallback
        _in_memory_robots_cache[cache_key] = {
            "expires_at": now + ttl_seconds,
            "payload": payload,
        }

    @classmethod
    def clear_cache(cls) -> None:
        """Helper for test suites to clear cached decisions."""
        _in_memory_robots_cache.clear()

    @classmethod
    def is_allowed(cls, url: str) -> bool:
        """Check if URL fetching is allowed under robots.txt (Fail-Closed)."""
        parsed = urllib.parse.urlparse(url.strip())
        scheme = parsed.scheme.lower()
        if scheme not in ("http", "https"):
            logger.warning(
                "robots_txt_fetch_blocked", extra={"domain": "", "reason": "UNSUPPORTED_SCHEME"}
            )
            return False

        netloc = parsed.netloc.lower()
        if not netloc:
            logger.warning(
                "robots_txt_fetch_blocked", extra={"domain": "", "reason": "MALFORMED_URL"}
            )
            return False

        origin = f"{scheme}://{netloc}"
        robots_url = f"{origin}/robots.txt"
        normalized_target = f"{origin}{parsed.path}"
        if parsed.query:
            normalized_target += f"?{parsed.query}"
        cache_key = f"robots_txt_status:{origin}:{hashlib.sha256(normalized_target.encode('utf-8')).hexdigest()}"

        # 1. Inspect Cache
        cached_data = cls._get_cache(cache_key)
        if cached_data is not None:
            return bool(cached_data.get("allowed", False))

        # 2. Evaluate robots.txt with Fail-Closed Error Handling
        allowed = False
        reason = "DISALLOWED_DEFAULT"

        try:
            resp = requests.get(
                robots_url,
                headers={"User-Agent": cls.USER_AGENT},
                timeout=cls.TIMEOUT_SECONDS,
            )
            if resp.status_code == 200:
                rp = urllib.robotparser.RobotFileParser()
                rp.parse(resp.text.splitlines())
                allowed = rp.can_fetch(cls.USER_AGENT, url)
                reason = "ALLOWED_BY_RULE" if allowed else "DISALLOWED_BY_RULE"
            elif resp.status_code in (404, 410):
                # Standard convention: missing robots.txt allows crawl
                allowed = True
                reason = f"ROBOTS_ABSENT_HTTP_{resp.status_code}"
            else:
                # HTTP 401, 403, 5xx errors -> FAIL CLOSED
                allowed = False
                reason = f"HTTP_{resp.status_code}"
                logger.warning(
                    "robots_txt_fetch_blocked",
                    extra={"domain": parsed.netloc, "reason": reason},
                )
        except requests.exceptions.Timeout:
            allowed = False
            reason = "TIMEOUT"
            logger.warning(
                "robots_txt_fetch_blocked",
                extra={"domain": parsed.netloc, "reason": reason},
            )
        except requests.exceptions.RequestException as req_exc:
            allowed = False
            reason = f"NETWORK_ERROR_{req_exc.__class__.__name__}"
            logger.warning(
                "robots_txt_fetch_blocked",
                extra={"domain": parsed.netloc, "reason": reason},
            )
        except Exception as exc:
            allowed = False
            reason = f"PARSING_ERROR_{exc.__class__.__name__}"
            logger.warning(
                "robots_txt_fetch_blocked",
                extra={"domain": parsed.netloc, "reason": reason},
            )

        # 3. Store in cache with reason and bounded TTL (300s for negative, 24h for positive)
        ttl = cls.POSITIVE_CACHE_TTL_SECONDS if allowed else cls.NEGATIVE_CACHE_TTL_SECONDS
        payload = {
            "allowed": allowed,
            "reason": reason,
            "origin": origin,
            "cached_at": time.time(),
            "ttl_seconds": ttl,
        }
        cls._set_cache(cache_key, payload, ttl)

        return allowed


class WebCacheService:
    """Lawfully caches external search responses (abstracts/metadata only, no full texts)."""

    _in_memory_data_cache: dict[str, Any] = {}

    @classmethod
    def get_cached_abstracts(cls, query: str) -> Any | None:
        cache_key = f"research_cache:{hashlib.sha256(query.strip().lower().encode()).hexdigest()}"
        if _redis_client:
            try:
                val = _redis_client.get(cache_key)
                if val:
                    val_text = val.decode("utf-8") if isinstance(val, bytes) else val
                    return json.loads(val_text)
            except Exception as exc:
                logger.debug(f"Redis get cache failed: {exc}")
        return cls._in_memory_data_cache.get(cache_key)

    @classmethod
    def set_cached_abstracts(cls, query: str, data: Any, ttl_seconds: int = 86400) -> None:
        cache_key = f"research_cache:{hashlib.sha256(query.strip().lower().encode()).hexdigest()}"
        if _redis_client:
            try:
                _redis_client.setex(cache_key, ttl_seconds, json.dumps(data))
            except Exception as e:
                logger.warning(f"Could not cache research data: {e}")
        cls._in_memory_data_cache[cache_key] = data

    @classmethod
    def clear_cache(cls) -> None:
        cls._in_memory_data_cache.clear()
