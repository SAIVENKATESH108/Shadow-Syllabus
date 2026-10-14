# Appendix A: Security & Compliance Specification

## Appendix A.3: Security Baseline

This document specifies the non-negotiable security requirements for all code and infrastructure in the Open Student Learning Platform.

### 1. Authentication & Session Hygiene
- All non-public endpoints require authentication (`IsAuthenticated` DRF permission).
- Passwords must be hashed using Argon2 (`django.contrib.auth.hashers.Argon2PasswordHasher`).
- Session cookies must enforce `Secure=True`, `HttpOnly=True`, and `SameSite='Lax'`.
- JWT/Bearer tokens (if used) must have short lifetimes (maximum 15 minutes access, 7 days refresh) and reside in memory or secure storage.

### 2. Authorization & Object-Level Permissions
- Every DRF viewset and API endpoint must implement and enforce **object-level permissions** (`has_object_permission`).
- A user must only read or mutate records they own, or records explicitly shared with them (e.g., an educator reviewing a student's assigned submission).
- Global `IsAdminUser` must not bypass object-level scoping in tenant-partitioned models.

### 3. Untrusted Input & Defense in Depth
- **Zero Host Code Execution**: Student code must never run on the host application server. Any execution must be dispatched to isolated sandboxes (read-only filesystem, network disconnected, unprivileged user, strict ulimits).
- **Prompt Injection Defense**: All user inputs passed to the AI gateway are wrapped in untrusted data delimiters and accompanied by system-level guardrails.
- **Upload Sanitization**: Uploaded files must have strict MIME-type validation, file extension checks, randomized storage keys, and size caps (< 10 MB default).

### 4. Personal Data Protection (Minors, GDPR & DPDP)
- **Minors Protection**: Minors cannot have their data tracked, profiled, or monetized (India DPDP Act 2023 Section 9). Verifiable parental consent records must be maintained.
- **Minimization**: Do not collect national IDs, phone numbers, or unnecessary personal attributes.
- **Atomic Erasure**: Deletion requests must cascade across PostgreSQL, `pgvector` tables, MinIO S3 buckets, Redis caches, and log sinks within 30 days.

### 5. Automated CI/CD Quality & Security Gates
CI must execute and enforce failure on high/critical findings for:
1. `ruff check` and `ruff format --check`
2. `mypy` strict static type analysis
3. `pytest` unit, integration, and permission tests
4. `bandit -r backend/ -ll -ii` (AST security analysis)
5. `pip-audit` (PyPI dependency CVE scanner)
6. `npm audit --audit-level=high` (Node dependency scanner)
7. `trivy fs --severity HIGH,CRITICAL --exit-code 1 .` (Container & filesystem scanner)
