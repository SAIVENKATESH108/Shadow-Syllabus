# ADR 0004: Dependency Upgrade to Django 5.2 LTS and Pip Security Remediation

## Status
Accepted

## Context
During QA security audit of the backend application, `pip-audit` flagged 21 known security vulnerabilities across `Django 5.1.15` and `pip 25.2.0` (including high-severity advisories affecting denial of service, memory exhaustion, and URL handling). Furthermore, OpenAPI contract verification was blocked because DRF's built-in schema generation lacked an active schema generator dependency.

Per the master plan (Section 4, Appendix A.3), third-party dependencies must be pinned, audited in CI without known vulnerabilities, and reviewed for license compatibility and stability.

## Decision
1. **Upgrade Django to Long Term Support (LTS)**:
   - Upgraded `Django` from `5.1.15` to `5.2.18` (the latest patched release within the Django 5.2 LTS release stream).
   - Constrained in `pyproject.toml` as `Django>=5.2.18,<5.3.0` to preserve LTS stability without premature adoption of major Django 6.x breaking changes.
2. **Upgrade Pip**:
   - Upgraded virtual environment `pip` from `25.2.0` to `26.2.1`.
3. **Add OpenAPI Specification Dependencies**:
   - Integrated `drf-spectacular>=0.28.0` (installed `0.30.0`, BSD-3-Clause) and `uritemplate>=4.1.3` (installed `4.2.0`, Apache-2.0 / BSD-3-Clause).
   - Configured `DEFAULT_SCHEMA_CLASS = "drf_spectacular.openapi.AutoSchema"` in `config/settings/base.py` and connected management command `spectacular` to automatically generate `docs/openapi_research.yaml`.
4. **Declare HTTP Client Dependency**:
   - Explicitly pinned `requests>=2.32.0` in `pyproject.toml` for CrossRef academic search and robots.txt fetching.

## Compatibility Checks & Verification
- **DRF**: Django REST Framework 3.17.2 functions seamlessly with Django 5.2.18.
- **Celery & Channels**: Celery 5.6.3 and Channels 4.2.0 (ASGI via Daphne) pass initialization and execution without deprecation warnings.
- **Database Backend**: PostgreSQL 18.6 with `psycopg` 3.3.6 and `pgvector` 0.5.1 successfully applied all migrations (`admin`, `auth`, `contenttypes`, `research`, `sessions`, `users`).
- **Audit Verification**: `pip-audit` reports `No known vulnerabilities found` (Exit Code 0).
- **Test Suite**: 33 of 33 tests pass in full backend suite (29 research tests + 4 security baseline tests).
- **Static Analysis**: `ruff check apps/research/` reports 0 errors; `bandit -r apps/research/` reports 0 issues.

## Rollback Plan
If regressions occur in staging:
1. Revert `pyproject.toml` to prior package pins.
2. Downgrade environment packages via `pip install "Django==5.1.15" "pip==25.2"`.
3. Re-run `pytest` and `makemigrations --check --dry-run` to ensure database schema compatibility.
