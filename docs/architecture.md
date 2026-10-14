# System Architecture: Open Student Learning Platform

## 1. Architectural Philosophy: Secure Modular Monolith

The platform is designed as a **modular monolith** running within a unified Django 5.x backend, communicating with a modern React 18 TypeScript frontend via REST APIs and WebSockets.

### Why a Modular Monolith?
- **Small Team Velocity**: Eliminates distributed systems operational overhead, complex network failures, and premature microservice fragmentation.
- **Strict Boundary Enforcement**: Domain boundaries are maintained via isolated Django app modules. Inter-app dependencies must use explicit public service functions or events.
- **Unified Security & Compliance Perimeter**: Simplifies GDPR and India DPDP compliance enforcement, atomic erasure workflows, and object-level permission checking.

---

## 2. Django Apps Topology

The Django backend is decomposed into distinct, cohesive domain apps under `backend/apps/`:

### 1. `apps/common`
- **Purpose**: Platform-wide foundations, base models, permission primitives, and security filters.
- **Key Responsibilities**:
  - `BaseModel`: Abstract model providing UUID primary keys, `created_at`, `updated_at`, and soft-delete semantics (`deleted_at`).
  - `IsOwnerOrReadOnly` / `IsTeacherOrGuardianOrSelf`: Object-level DRF permissions enforcing row-level access control across all models.
  - `UnverifiedContentMixin`: Serializer and model mixin ensuring AI-generated/inferred content is labeled with `is_unverified: True`.
  - Global exception handlers, sanitization helpers, and audit logging hooks.

### 2. `apps/users`
- **Purpose**: Identity, authentication, role-based access, and statutory minor protection.
- **Key Responsibilities**:
  - Custom `User` model using email as username and Argon2 password hashing.
  - Role management: `Student`, `Educator`, `Guardian`, `Admin`.
  - **Minor Protection & DPDP Compliance**:
    - `is_minor`: Flag derived from birth month/year.
    - `ParentalConsentRecord`: Stores verifiable guardian consent tokens, verification timestamps, and parental identity linkage required under India's DPDP Act (Section 9) and EU GDPR (Article 8).
    - Prohibits tracking, profiling, or targeted advertising for minors.
  - Synthetic test data factories for privacy-safe test execution.

### 3. `apps/courses`
- **Purpose**: Course curriculum, modules, lessons, and learning material indexing.
- **Key Responsibilities**:
  - Hierarchical courses, chapters, and lessons.
  - `CourseKnowledgeVector`: Vector embeddings of educational materials using PostgreSQL `pgvector` for semantic search and retrieval-augmented generation (RAG).
  - Strict read permissions honoring course enrollment.

### 4. `apps/assessments`
- **Purpose**: Exercises, assignments, submissions, and pedagogical coaching.
- **Key Responsibilities**:
  - `Submission`: Student answers and assignment uploads (stored safely in MinIO S3).
  - `Feedback`: Pedagogical coaching hints and explanations.
  - **Coaching Mandate**: The system enforces hints and formative guidance. Automated high-stakes grading without educator review is disallowed.
  - Object-level permissions ensuring students can only view their own submissions.

### 5. `apps/ai_gateway`
- **Purpose**: Secure proxy and single point of entry for all generative AI and LLM model interactions.
- **Key Responsibilities**:
  - Centralized routing to AI providers (local mock, Anthropic, Gemini, OpenAI) via unified adapter interfaces.
  - **PII Scrubbing**: Strips student names, emails, and phone numbers from prompts before dispatch.
  - **Untrusted Input Defense**: Injects system instructions enforcing that student inputs are untrusted data and cannot override platform policies.
  - **Mandatory Unverified Stamping**: Every model response returned is enriched with `is_unverified: True` and confidence metrics.
  - Telemetry and token usage quotas without logging raw prompt PII.

---

## 3. Data Storage & Persistence Strategy

1. **Relational Database (`PostgreSQL 16` with `pgvector`)**:
   - Primary system of record for accounts, courses, enrollments, and submissions.
   - Vector indexes (`ivfflat` or `hnsw`) on `vector(1536)` columns for course RAG embeddings.
2. **In-Memory Cache & Message Broker (`Redis 7 Alpine`)**:
   - Celery async task queue (e.g. video processing, email dispatch, atomic data erasure).
   - Real-time Django Channels WebSocket layer backend (`channels_redis`).
   - Short-lived query and session caching (strict TTLs, no PII persisted).
3. **Object Storage (`MinIO S3 Compatible`)**:
   - Encrypted at rest storage for assignment attachments, lecture notes, and syllabus PDFs.
   - Strict pre-signed URLs with short expiration periods for downloads.

---

## 4. Asynchronous & Real-Time Processing

```
Client (Browser / React 18)
        │
        ├── [HTTP REST] ───────> Daphne / Django ASGI (Gunicorn / Uvicorn)
        │                                 │
        └── [WebSocket (ws://)] ─────────> Channels Consumer (Real-time tutoring & hints)
                                                  │
                                                  ▼
                                      Redis (Broker & Channels Layer)
                                                  │
                                                  ▼
                                        Celery Workers
                                  ├── AI Gateway Model Calls
                                  ├── MinIO Document Ingestion & pgvector Embedding
                                  └── GDPR / DPDP Atomic Erasure Orchestration
```

---

## 5. Sandboxing & Code Execution Boundary

**CRITICAL RULE: User-submitted code is NEVER executed on the application server.**
Any programming lab or code execution environment is decoupled completely from the web backend:
- The backend delegates code evaluation to an isolated external sandbox agent (e.g., gVisor, Firecracker microVM, or isolated runner with network disabled, non-root user, read-only rootfs, and strict memory/CPU limits).
- The web application communicates with the sandbox solely via an ephemeral task contract.
