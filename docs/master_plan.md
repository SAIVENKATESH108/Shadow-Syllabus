# Open Student Learning Platform: Master Plan and Engineering Blueprint
**Working title. Version 0.1 (draft for review). 14 October 2026. Prepared for V.A. Sai Venkatesh.**

---

## 1. Executive Summary
The platform is an open-source, university-independent study platform for students anywhere. It combines a community question-paper bank, an AI study assistant, personalised learning roadmaps, deep research, a live coding console, an AI interview coach, a resume checker, a PDF toolkit, a legal open-books reader and student community tools. It ships as one web codebase and one mobile app. The project also builds and owns its own small language models, trained on community-verified data.

### Guiding principles
1. **Student-first and open**: no university integration is needed; community-managed data; open licence.
2. **Local-first AI**: open models run on our own servers by default; cloud providers are optional fallbacks.
3. **Honesty by design**: AI-reconstructed or guessed content is always labelled and never used for training until a human verifies it.
4. **Privacy by default**: IDs, marks, resumes and recordings are private and deletable.
5. **Modular monolith**: one repository and one deployable core, split into isolated modules, so a small team can ship it.

---

## 2. Scope and Goals

### 2.1 Goals
- Give students one place to study, practise, research and prepare for careers.
- Build a growing, verified, open dataset of academic material.
- Produce an in-house fine-tuned model and publish it with a model card.

### 2.2 Non-goals (for now)
- Official university records (attendance, fees, hall tickets, faculty grading).
- Training a large model from scratch.
- Hosting pirated books or copyrighted lectures.
- Video-based emotion or personality scoring.

### 2.3 Personas
| Persona | Needs |
| :--- | :--- |
| **Undergraduate student** | Past papers, notes, exam prep, roadmap to a career, placements |
| **Self-learner** | Structured path, videos, practice, AI explanations |
| **Job seeker** | Resume feedback, mock interviews, coding practice |
| **Contributor / moderator** | Upload and verify papers, fix OCR, earn reputation |
| **Admin** | Moderation, takedowns, model and system health |

### 2.4 Success metrics
Weekly active students; papers verified per week; RAG answer helpfulness rating; roadmap completion rate; resume score improvement between versions; median job latency; cost per active user.

---

## 3. Feature Catalogue
Priority uses MoSCoW (M must, S should, C could).

| Module | Key features | Priority |
| :--- | :--- | :---: |
| **Accounts and profile** | Signup; country, university, program, branch, semester; private optional university ID; email and university-email verification; reputation; roles | M |
| **Academic hierarchy** | Country, university, program, syllabus version, subject; aliases; community-add with moderation; per-university grading schemes (10-point, 4.0, percentage) | M |
| **Question paper bank** | Upload, deskew and denoise, OCR (Indic languages), question extraction, search by university, subject and year; duplicate detection; merge scans; gap flags; community verify and correct | M |
| **RAG study assistant** | Chat over papers, notes and syllabus with citations; metadata filters; important-question analysis | M |
| **Roadmap** | Inputs: goal, level, CGPA, hours; curated skill graph; draggable and editable graph with animation; per-node resources | M |
| **Video learning** | YouTube embed, ranked by level and language; pause and ask AI; captions-based explanation | M |
| **AI study tools** | Summaries, flashcards, quizzes, practice tests, text-to-speech (Indian and foreign voices), transcription of owned or open-licensed audio | S |
| **Deep research** | Multi-agent cited reports, fact-check confidence, PDF export, saved to personal library | S |
| **Live coding console** | Monaco editor, Python in browser, other languages via sandbox, AI hints, practice problems | S |
| **Books reader** | Open-licence technical books, page-flip view, highlights, notes, ask-AI-about-page, read aloud | S |
| **PDF toolkit** | PDF to Word, Word to PDF, merge, split, compress, rotate, protect, OCR scanned PDF, image to PDF | S |
| **Resume checker** | Readiness score (parseability, structure, job-description match, content quality); suggested rewrites | S |
| **AI interview coach** | Role-based voice or text interviews, follow-ups, rubric scoring, history | S |
| **Community** | Study groups, doubt forum, DMs, voice and video study rooms | C |
| **Personal tools** | Private attendance, marks and CGPA tracker, planner, exam countdown | C |
| **Sharing** | Short links and QR codes for roadmaps, reports and resumes, with view analytics | C |

### Reuse from existing repositories
| Repository | Reuse |
| :--- | :--- |
| **Quorum** | Research agent pipeline (orchestrator, researchers, fact-checker, writer), provider strategy with circuit breaker, Ollama mode, DOI citation checks, repo ingestion, live progress events |
| **ChitChatHireAI** | Interview personas, rubric scoring, question generator, skill list, resume parsing ideas, Monaco console setup |
| **Real-Time-Chat-App** | Chat, channels, roles and WebRTC feature design (backend rebuilt on Django Channels) |
| **URL-Shortener-with-Analytics** | Base62 codes, cache-aside redirects, async click analytics, QR codes |

---

## 4. System Architecture

### 4.1 Architectural style
A **modular monolith**: one Django codebase organised into bounded-context apps with explicit interfaces, deployed as a few processes. Heavy AI work never runs in the web process. Modules may be extracted into services later only if measured load demands it.

### 4.2 Logical architecture
```text
Clients: React PWA (web) + Capacitor wrapper (Android, iOS)
            | HTTPS REST (OpenAPI) | WebSocket (Channels)
Edge:      Reverse proxy (TLS, rate limits, static files)
Core:      Django + DRF + Channels (modular monolith)
             accounts | academics | papers | rag | roadmap | learning
             tools_pdf | resume | interview | research | codelab
             community | planner | sharing | moderation | ai_gateway
Async:     Celery workers + Redis (OCR, embeddings, PDF jobs,
           transcription, research agents, training prep)
AI tier:   Model server (Ollama or vLLM), embeddings, Whisper, TTS
Data:      PostgreSQL + pgvector | Redis | S3-compatible object store
Sidecars:  SearXNG (search) | Judge0 or Piston (code sandbox, isolated host)
           coturn + LiveKit (calls) | ClamAV (upload scanning)
Ops:       Prometheus, Grafana, Sentry, OpenTelemetry, MLflow
```

### 4.3 Django App Responsibilities
- **`accounts`**: Custom user, auth, verification, roles, reputation
- **`academics`**: Country, university, program, syllabus, subject, aliases, grading schemes
- **`papers`**: Uploads, pages, OCR results, extracted questions, edit history
- **`rag`**: Chunking, embeddings, retrieval, chat sessions, citations
- **`roadmap`**: Skill graph, generated roadmaps, user layouts, node resources
- **`learning`**: Videos, books, reading progress, highlights
- **`tools_pdf`**: Conversion jobs, expiry and cleanup
- **`resume`**: Parsing, scoring, rewrite suggestions
- **`interview`**: Sessions, questions, answers, rubric feedback
- **`research`**: Agent pipeline, sources, reports
- **`codelab`**: Problems, submissions, sandbox client
- **`community`**: Groups, posts, chat, rooms
- **`planner`**: Private marks, attendance, tasks
- **`sharing`**: Short links, QR, analytics
- **`moderation`**: Reports, takedowns, review queues, audit log
- **`ai_gateway`**: Single entry point for all model calls

### 4.4 AI Gateway
Every module calls models only through `ai_gateway`. It provides provider strategy (local model first, optional cloud fallback, fine-tuned models as they mature), a circuit breaker with jittered retry, per-user quotas, prompt and response logging with PII redaction, caching, and an evaluation hook.

### 4.5 Key data flows
- **Paper ingestion**: upload, virus scan, duplicate hash check, image clean-up, OCR with per-line confidence, gap detection, optional AI suggestions marked unverified, structured question extraction, community verification, chunking and embedding, indexed for retrieval.
- **RAG answer**: question, retrieve top-k with metadata filters, rerank, build prompt with citations, generate, return answer with source page links.
- **Roadmap**: profile and goal, select and order nodes from the curated skill graph, personalise pace using CGPA and hours, store as JSON layout, attach ranked resources.
- **Research**: orchestrator splits the question, researchers search and read in parallel (web content treated as untrusted), fact-checker scores claims, writer produces a cited report, progress streamed over WebSocket.
- **Code execution**: browser sends code to the codelab service, which submits to the isolated sandbox with CPU, memory, time and no-network limits.

---

## 5. Technology Stack
- **Backend**: Python 3.12, Django, Django REST Framework, Channels, OpenAPI via `drf-spectacular`
- **Database**: PostgreSQL 16 with `pgvector`
- **Queue & Cache**: Celery, Redis
- **Object Storage**: S3-compatible (MinIO for self-hosting)
- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, TanStack Query, Zustand, React Flow, Framer Motion, Monaco
- **Mobile**: Capacitor wrapper around the PWA
- **LLM Serving**: Ollama (dev), vLLM (production)
- **OCR**: OpenCV, Tesseract, PaddleOCR or docTR
- **Speech**: faster-whisper, Piper / Indic Parler-TTS
- **Code Sandbox**: Pyodide (client), Judge0 or Piston (server, isolated host)

---

## 6. Core Data Model Summary
- `Country` 1-* `University` 1-* `Program` 1-* `Branch`
- `Program` 1-* `SyllabusVersion` 1-* `Term` 1-* `Subject` (`SubjectAlias`)
- `User` 1-1 `StudentProfile` (university, program, branch, term, language)
- `QuestionPaper` (university, subject, year, term, status, licence_tag, uploader, content_hash)
  - 1-* `DocumentPage` (image, ocr_text, confidence)
  - 1-* `Chunk` (text, page, embedding)
  - 1-* `ExtractedQuestion` (text, marks, topic, verified_by)
  - 1-* `Edit` (editor, before, after)
- `Roadmap` 1-* `RoadmapNode` *-* `RoadmapEdge` ; `UserRoadmap` (layout_json)
- `ResearchSession` 1-* `ResearchSource` ; `Report`
- `Resume` 1-* `ResumeAnalysis` ; `JobDescription`
- `InterviewSession` 1-* `InterviewQuestion` 1-* `InterviewAnswer` 1-1 `FeedbackScore`

---

## 7. AI & ML Plan
- **Stage 1**: Open model plus RAG behind `ai_gateway` (Answers cite sources; evaluation set built).
- **Stage 2**: Evaluation harness: retrieval hit rate, answer faithfulness, human ratings.
- **Stage 3**: Fine-tune embeddings on verified question-chunk pairs.
- **Stage 4**: LoRA or QLoRA fine-tune of a 1 to 3B model on verified Q&A, explanations, roadmap and interview feedback.
- **Stage 5**: Small specialist models: topic classifier, difficulty estimator, roadmap ranker.
- **Stage 6**: Continued pretraining or distillation.

---

## 8. Non-Functional Requirements & Security Baseline
- **Performance**: API p95 under 300 ms for non-AI calls; chat first token under 3 s on target hardware; long jobs always asynchronous with progress.
- **Security**: Target OWASP ASVS Level 2; MFA option; RBAC; audit log; encrypted storage; signed URLs.
- **Privacy (GDPR & DPDP Act)**: Consent, export, deletion with grace period, minimal retention, parental consent for minors under 18.
- **Code Execution**: Never run user code on the application server. Sandbox on separate host with no network and strict memory/CPU limits.

---

## Appendix A: Responsible AI, Privacy and Security Charter
- **A.1 Principles**: Human responsibility, accuracy & hallucinations, fairness & bias, transparency, avoiding overreliance, privacy & confidentiality.
- **A.2 GDPR & DPDP Rules**: Lawful basis, minimisation, privacy by design, data subject rights (access, export, erasure), retention, children/minors.
- **A.3 Security Baseline**: Target OWASP ASVS Level 2, no secrets in code, object-level permissions, Argon2 password hashing, isolated sandbox, dependency audits.
- **A.4 Data Hygiene**: Never paste real student records, API keys, or proprietary data in prompts. Synthetic data only.

---

## Appendix C: Shadow Syllabus (The Hackathon Slice)
**The first working vertical slice combining three Must-have modules:**
1. Academic hierarchy (`university`, `subject`, `syllabus_version`)
2. Question paper bank
3. Important-question analysis from the RAG module

### Core Distinctive Features & Algorithmic Method
1. **Syllabus-to-Paper Mapping**: Every past question mapped to a unit and topic of the real syllabus.
2. **Recency-Weighted Weightage**:
   $$\text{decay}(\text{year}) = 0.5^{(\text{current\_year} - \text{year}) / H} \quad (H = \text{half-life in years})$$
   $$\text{score}(t) = \sum_{q \in \text{mapped}(t)} \text{conf}(q,t) \times \text{marks}(q) \times \text{decay}(\text{year}(q))$$
   $$\text{weight}(t) = \frac{\text{score}(t)}{\sum_{t'} \text{score}(t')}$$
   $$\text{expected\_marks}(t) = \text{weight}(t) \times \text{total\_marks}$$
3. **Blind-Spot & Dormant Detection**:
   - *Blind spot*: topic in the syllabus with zero mapped questions in $N$ papers.
   - *Dormant*: topic not asked in the last $K$ years.
4. **Time-Budget Planner (0/1 Knapsack)**:
   - Maximizes $\sum \text{expected\_marks}(t)$ subject to $\sum \text{study\_hours}(t) \le \text{days} \times \text{hours\_per\_day}$.
   - Reserves 15% of time for blind spots and revision; orders by unit and prerequisites.
5. **Explainable Evidence**: Every weight links directly to the questions, years, and marks behind it.
