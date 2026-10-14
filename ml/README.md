# Machine Learning & AI Engineering Guidelines

This directory houses the offline data pipelines, embedding generators, and evaluation benchmarks used to support the platform's retrieval-augmented generation (RAG) and pedagogical coaching features.

---

## 1. Core Principles

1. **Synthetic Data Only for Training & Evaluation**:
   - Never ingest or store real student submissions, names, or contact data in evaluation datasets.
   - Use synthetic student question corpora generated via rule-based templates or verified synthetic fixtures.
2. **Pedagogical Alignment & Guardrails**:
   - Models must act as *coaches* (providing hints, leading questions, diagnostic feedback) rather than answering graded homework assignments directly.
   - Every embedding pipeline for curriculum documents must verify attribution and include source citations.
3. **pgvector Integration**:
   - Document chunks are embedded with standard dense vector representations (e.g. 1536-dimensional or 768-dimensional embeddings) and loaded into the `courses_courseknowledgevector` table in PostgreSQL.

---

## 2. Directory Layout
```
ml/
├── embeddings/        # Chunking and embedding generation scripts for course syllabi
├── benchmarks/        # Synthetic evaluation suites testing hint quality and refusal of cheating
├── datasets/          # Synthetic fixture datasets (curriculum QA pairs)
└── requirements.txt   # Offline ML/pipeline dependencies
```
