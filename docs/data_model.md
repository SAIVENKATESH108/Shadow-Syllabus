# Data Model & Entity Relationship Specification

**Version 1.0 • 15 October 2026**  
*Part of Open Student Learning Platform (Master Plan Section 6)*  
*Prepared for V.A. Sai Venkatesh*

---

## 1. Domain Topology Overview

The database runs on **PostgreSQL 16 with `pgvector`** as a unified relational and vector store. All models inherit from `apps.common.models.BaseModel`, providing:
- UUIDv4 primary keys (`id`)
- `created_at` and `updated_at` timestamps
- Soft-delete timestamp (`deleted_at`) for GDPR/DPDP audit trails

---

## 2. Entities & Schema Definitions

### 2.1 Identity & Privacy Sovereignty (`apps/users`)

```mermaid
erDiagram
    User ||--o{ ParentalConsentRecord : "has consent records"
    User {
        uuid id PK
        string email UK
        string role "STUDENT, EDUCATOR, GUARDIAN, ADMIN"
        boolean is_minor
        date date_of_birth "Minimal retention"
        boolean data_erasure_requested
        timestamp erasure_requested_at
    }
    ParentalConsentRecord {
        uuid id PK
        uuid student_id FK
        string guardian_email
        string consent_token UK
        boolean is_verified
        timestamp verified_at
        string consent_method
    }
```

### 2.2 Academic Hierarchy & Shadow Syllabus (`apps/syllabus`)

```mermaid
erDiagram
    University ||--o{ Subject : "accredits"
    Subject ||--o{ SyllabusVersion : "prescribes"
    SyllabusVersion ||--o{ Topic : "contains"
    Topic ||--o{ Topic : "subtopics"
    Subject ||--o{ Paper : "archives"
    SyllabusVersion ||--o{ Paper : "tested under"
    Paper ||--o{ Question : "contains"
    Question ||--o{ QuestionTopicMapping : "mapped to"
    Topic ||--o{ QuestionTopicMapping : "has mapped"
    Topic ||--o{ WeightSnapshot : "has weight history"

    University {
        uuid id PK
        string name UK
        string code
        string slug UK
    }
    Subject {
        uuid id PK
        uuid university_id FK
        string code
        string name
        string slug
    }
    SyllabusVersion {
        uuid id PK
        uuid subject_id FK
        string label
        int year
        int total_marks
    }
    Topic {
        uuid id PK
        uuid syllabus_version_id FK
        uuid parent_id FK "nullable"
        string name
        int unit_no
        int position
        float estimated_hours
    }
    Paper {
        uuid id PK
        uuid subject_id FK
        uuid syllabus_version_id FK
        int year
        string session
        int max_marks
        string source_url
        string licence_tag
    }
    Question {
        uuid id PK
        uuid paper_id FK
        string number
        float marks
        string section
        text text_excerpt
        string text_hash
    }
    QuestionTopicMapping {
        uuid id PK
        uuid question_id FK
        uuid topic_id FK
        float confidence
        string method "model, embedding, human_verified"
        text rationale
        string verified_by
    }
    WeightSnapshot {
        uuid id PK
        uuid topic_id FK
        int as_of_year
        float half_life
        float score
        float weight
        int appearances
        int last_year
        int rank
    }
```

### 2.3 Deep Research Multi-Agent Pipeline (`apps/research`)

```mermaid
erDiagram
    ResearchSession ||--o{ ResearchSource : "identifies"
    ResearchSession ||--o{ ResearchClaim : "synthesizes"
    ResearchSession ||--o{ ResearchReport : "produces"
    ResearchReport ||--o{ ResearchSection : "divided into"

    ResearchSession {
        uuid id PK
        uuid user_id FK
        text query
        string status "PENDING, RETRIEVING, FACT_CHECKING, COMPLETED, ABSTAINED"
        string idempotency_key UK
        float confidence_score
        boolean is_unverified
    }
    ResearchSource {
        uuid id PK
        uuid session_id FK
        string title
        string url
        string doi
        string container
        boolean is_peer_reviewed_doi
    }
    ResearchClaim {
        uuid id PK
        uuid session_id FK
        text claim_text
        string status "VERIFIED, UNVERIFIED, CONFLICTING"
        float confidence
    }
    ResearchReport {
        uuid id PK
        uuid session_id FK
        string title
        text summary
        string pdf_artifact_path
    }
    ResearchSection {
        uuid id PK
        uuid report_id FK
        int order_index
        string title
        text content
        json citations
        boolean is_superseded
    }
```

---

## 3. Storage & Partitioning Strategy

1. **Relational Storage**: Standard B-Tree indexes on `(subject_id, year)`, `(paper_id, number)`, and `(topic_id, as_of_year)`.
2. **Vector Embeddings**: Stored in `pgvector` columns (`vector(1536)` or `vector(768)`). Indexed using HNSW (`m=16`, `ef_construction=64`) with cosine distance metric (`vector_cosine_ops`).
3. **Cascading Deletions**: In compliance with GDPR Art 17 / DPDP Sec 12, user account deletion triggers an atomic cascading purge across sessions, private notes, embeddings, and transient caches with a 30-day reversible grace window.
