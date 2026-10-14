# ADR 0003: Fail-Closed External Robots.txt Enforcement

## Status
Accepted

## Context
The research agent pipeline retrieves academic literature and public web metadata to summarize research queries. Historically, in `backend/apps/research/web_safety.py`, if a target domain's `robots.txt` could not be fetched due to network timeouts, DNS errors, HTTP errors (e.g. 5xx/4xx), or malformed response contents, the system defaulted to a fail-open posture (`allowed = True`).

Allowing retrieval when `robots.txt` cannot be inspected risks crawling restricted or sensitive endpoints against webmaster directives, violating lawful ingestion commitments and ethical data harvesting requirements.

## Decision
We enforce a strict **fail-closed** policy for all external web retrievals:
1. **Deny on Error**: If `robots.txt` cannot be fetched, parsed, or returns an error (HTTP 4xx/5xx, connection timeout, DNS resolution failure, malformed format), `RobotsTxtValidator.is_allowed()` immediately returns `False`.
2. **Structured Ephemeral Negative Caching**:
   - Negative decisions resulting from transient failures are cached in Redis with a bounded TTL of **300 seconds** (5 minutes). This prevents repeated hammering of struggling external endpoints while ensuring transient network blips do not permanently blacklist an origin.
   - The cache key includes the normalized origin (`robots_txt_status:<origin>`).
   - The cached payload is structured JSON containing:
     - `allowed`: `False`
     - `reason`: Standardized reason code (`NETWORK_ERROR`, `TIMEOUT`, `HTTP_ERROR`, `PARSE_ERROR`, `DISALLOWED_BY_RULE`)
     - `cached_at`: ISO 8601 timestamp
     - `ttl_seconds`: 300
3. **Structured Non-Personal Logging**: Any blocked request emits a structured warning (`robots_txt_fetch_blocked`) with the target host and reason code, without storing query strings, authorization tokens, or student personal data.
4. **Recovery**: Once the 300-second negative cache expires, subsequent requests attempt to re-fetch `robots.txt`, allowing automated recovery as soon as the target host resolves its outage.

## Consequences
- **Positive**: Strict adherence to external access restrictions; no accidental crawler boundary violations during upstream outages; transparent structured audit trail.
- **Negative**: Temporary upstream network glitches at third-party servers will cause research queries targeting those hosts to fail or abstain until network connectivity is restored.
