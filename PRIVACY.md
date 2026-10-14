# Privacy & Data Governance Policy

## 1. Regulatory Framework & Protections for Minors

The platform serves students globally, including minors, and is engineered for compliance with:
- **EU General Data Protection Regulation (GDPR)** (Articles 5, 8, 17).
- **India's Digital Personal Data Protection (DPDP) Act, 2023** (Section 9: Duties regarding children's data; verifiable parental consent; prohibitions on behavioral tracking and targeted advertising).

## 2. Core Privacy Tenets

1. **Data Minimization**:
   - Collect only what is strictly necessary to deliver personalized educational guidance.
   - Never collect government ID numbers, biometrics, or precise geolocation.
   - Scores and automated suggestions serve as educational guidance only—never as automated judgments or character profiling.
2. **Explicit Consent & Minors**:
   - For minors (under 18 under DPDP Act; under 16/13 under GDPR member states), verifiable parental/guardian consent is mandatory prior to account activation.
   - Tracking, behavioral profiling, and targeted advertising directed at children are completely prohibited.
3. **No Sensitive PII in Model Context**:
   - Student prompts are scrubbed of identifying information before passing to `apps/ai_gateway/`.
   - AI outputs are stamped with an `unverified` flag in both data structures and UI representations.

## 3. Data Inventory, Purpose, and Retention Periods

| Data Category | Purpose | Retention Period | Storage Location |
| :--- | :--- | :--- | :--- |
| **Account Credentials** (Username, argon2 hashed password, email) | Authentication and service communications | Duration of active account + 30 days grace period | PostgreSQL (`users_user`) |
| **Guardian Linkage & Consent Records** | DPDP / GDPR legal compliance verification | Audit duration as mandated by law (max 3 years) | PostgreSQL (`users_consent_record`) |
| **Course Submissions & Assignments** | Learning progression & educator feedback | Active academic term + 1 year | MinIO S3 Object Storage (`platform-dev-media`) & PostgreSQL metadata |
| **RAG Embeddings (Course Content only)** | Semantic search & context retrieval | Lifetime of course material | PostgreSQL `pgvector` index |
| **Ephemeral Session & Cache** | Session state and real-time Channels coordination | 24 hours (TTL enforced) | Redis Cache & Message Store |
| **System & Access Logs** | Security monitoring and breach prevention | 30 days (PII-scrubbed) | Ephemeral log volume / rotating log sink |

## 4. End-to-End Erasure Architecture (Right to be Forgotten)

Every new personal data field introduced into the codebase must have a documented erasure path. When an erasure request is confirmed, an asynchronous Celery task executes atomic purging across all platform layers:

```
[Erasure Request Triggered]
          │
          ├──> 1. PostgreSQL: Soft-delete/hard-purge user records & cascade to child tables.
          ├──> 2. pgvector: Delete all vector embeddings linked to the user's submissions.
          ├──> 3. MinIO: Delete uploaded files, PDFs, and assignment artifacts in bucket prefix.
          ├──> 4. Redis: Purge all session keys, WebSocket channel groups, and token caches.
          └──> 5. Logs/Analytics: Ensure user identifier is anonymized or purged in compliance with retention caps.
```

## 5. Synthetic Fixtures Mandate

Developers and CI systems must never use real student personal data. All local databases, unit tests, and integration tests must use synthetic data factories.
