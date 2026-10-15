# Full-Stack Integration & Engineering Audit Plan
**Project**: Open Student Learning Platform — Hackathon Vertical Slice (**Shadow Syllabus**)  
**Document Reference**: `AUDIT-PLAN-2026-10-15-V1`  
**Status**: READ-ONLY AUDIT PROPOSAL (Awaiting Human Reviewer Approval)  
**Author**: Antigravity Full-Stack QA & Engineering Agent  
**Auditor / Reviewer**: V.A. Sai Venkatesh  

---

## 1. Scope & Guiding Objectives
This audit plan establishes an evidence-based, read-only protocol to verify every page, route, component, API endpoint, lifecycle state, performance metric, security control, and evaluation claim of the **Shadow Syllabus** vertical slice and its integration with the platform core (Research, Users, AI Gateway).

### Core Audit Principles:
1. **Zero Production Risk**: Local PostgreSQL 16 and Redis 7 in WSL only. Mocked AI Gateway and CrossRef providers. No cloud calls, no real PII, no copyrighted text.
2. **Honest Scientific Evaluation**: Formal adherence to measured findings:
   - Embeddings-only baseline (95.24% Top-1, 0.9555 Macro-F1) outclassed the hybrid model layer (91.43% Top-1, 0.9298 Macro-F1).
   - Recency-decay backtest advantage (54.91% vs 53.18% no-decay) is within measured standard deviation ($\pm 4.24\%$) and is statistically inconclusive.
3. **Plan-First Discipline**: No code modification, package installation, or service alteration will take place until the human reviewer approves this document.

---

## 2. Page-by-Page Functional & Visual Integration Matrix

| Page / Screen | Component Path | States to Test | Viewports & Themes | Key Assertions / Acceptance Criteria |
| :--- | :--- | :--- | :--- | :--- |
| **Platform Shell & Navigation** | `frontend/src/App.tsx`, `Sidebar` | Initial load, Active route highlights, Collapsed mobile drawer | 375px (Mobile), 768px (Tablet), 1280px (Desktop); Light & Dark | Clean routing, zero console errors, visible focus outlines on all nav items. |
| **Shadow Syllabus Dashboard** | `frontend/src/components/screens/ShadowSyllabusScreen.tsx` | Scope banner, Top stats cards, Mandatory academic caution notice | Mobile, Tablet, Desktop; Light & Dark; English & Hindi | Displays Delhi University CS-204 scope; caution notice highlights historical exam-pattern risk. |
| **Topic Weightage Heatmap & Ranking** | `ShadowSyllabusScreen.tsx` (Tab 1) | Half-life toggle ($H=2.0y, 3.0y, 5.0y$), Yield tier filtering, Empty topics state | Mobile & Desktop; Light & Dark | Dynamic re-ranking when half-life changes; High Yield ($\ge 10\%$), Medium Yield ($4\text{--}10\%$), Low Yield ($<4\%$) color tokens render cleanly. |
| **Topic Evidence Modal Drawer** | `ShadowSyllabusScreen.tsx` (Modal) | Open drawer, Close drawer, Multiple papers, Unasked topic (0 questions), Screen scroll lock | Mobile drawer & Desktop centered modal; Light & Dark | Traps keyboard focus; shows question ID, marks, exam year/session, OCR excerpt; 0 questions displays unexamined message. |
| **Time-Budget Knapsack Planner** | `ShadowSyllabusScreen.tsx` (Tab 2) | Slider drag ($D \in [1, 30]$, $H \in [1, 8]$), 15% reserve calculation, Zero budget warning, Schedule day accordion | Mobile & Desktop; Light & Dark | Mathematical invariant: $\text{Study Budget} + \text{Revision Reserve} \equiv \text{Total Hours}$; revision day appears on Day $D$; zero/negative values trigger validation warning. |
| **Curriculum Blind-Spot & Dormant Hub** | `ShadowSyllabusScreen.tsx` (Tab 3) | Unexamined topic card, Dormant topic card, Active modules list | Mobile & Desktop; Light & Dark | Flagged Unit 4.4 (0 questions, high surprise risk) and Unit 4.3 (dormant $\ge 3$ years); recommended buffer action displayed. |
| **Measured Accuracy & Backtest Proof** | `ShadowSyllabusScreen.tsx` (Tab 4) | 105-question benchmark table, Walk-forward backtest table, Uncertainty disclosure notes | Mobile & Desktop; Light & Dark | Accurately reports Embeddings-only (95.24%) outperforming Hybrid (91.43%); reports walk-forward mean (54.91% vs 53.18%) with explicit disclaimer that difference is within standard deviation (4.24%). |
| **Research Inquiry & Reporting** | `ResearchView.tsx`, `ResearchInquiryForm.tsx` | Idle, Typing, Validation error ($<10$ chars), Submitting, Rate-limited (429 modal) | Mobile & Desktop; Light & Dark | Input validation stops empty topics; 429 modal displays daily quota limit without app crash. |
| **Research Live Execution & Progress** | `ResearchLiveProgress.tsx`, `ResearchReportView.tsx` | Active polling, Progress bar (0–100%), Step progression, Terminal completed state, Abstain banner | Mobile & Desktop; Light & Dark | Polling halts on `COMPLETED`, `FAILED`, `ABSTAINED`; verified claims ratio rendered with source citations. |
| **Artifact History & Versioning** | `ArtifactVersionHistoryModal.tsx` | Version list, Diff view, Rollback/view prior report, Close modal | Desktop modal; Light & Dark | Displays audit trail and timestamped hash of prior research iterations. |
| **Career Prep & Mock Interview** | `CareerPrepScreen.tsx` | Readiness score (82/100), Coaching rubric, STAR breakdown, Bias-free notice | Mobile & Desktop; Light & Dark | Displays non-judgmental guidance notice; audio player handles missing stream gracefully. |
| **Privacy Center & Data Sovereignty** | `PrivacyCenterScreen.tsx` | Consent toggles, Export request, Erasure modal, DPO escalation modal (72h SLA) | Mobile & Desktop; Light & Dark | Unticked consents by default; clear explanation of processing purpose for each field. |
| **Study Coach Dual Workspace** | `StudyCoach.tsx` | Chat stream, Source inspector right-drawer, Citation [1] click, Page excerpt view | Dual-column desktop; Light & Dark | Right column expands with Tanenbaum Ch. 6 Page 248 citation, SHA-256 checksum, and curriculum health indicator. |

---

## 3. Backend Endpoint, Serializer, and Service Matrix

| Endpoint | Method | Service / Handler | Serializer | Boundary & Negative Scenarios to Test |
| :--- | :---: | :--- | :--- | :--- |
| `/api/v1/syllabus/subjects/` | `GET` | `Subject.objects.all()` | `SubjectSerializer` | Empty database; multiple universities; active vs inactive subjects. |
| `/api/v1/syllabus/topics/` | `GET` | `compute_recency_weights` | `TopicWeightSerializer` | Missing `subject_code` (default fallback); non-existent subject code (404); half-life $H \le 0$ (validation fallback); zero questions mapped. |
| `/api/v1/syllabus/blind-spots/` | `GET` | `detect_blind_spots_and_dormant` | `BlindSpotReportSerializer` | Subject with 0 blind spots; subject with 100% blind spots; configurable `dormant_years` threshold. |
| `/api/v1/syllabus/evidence/<id>/` | `GET` | `QuestionTopicMapping` filter | `MappingEvidenceSerializer` | Invalid UUID (404); topic with 0 mapped questions (empty list); verified vs unverified mappings. |
| `/api/v1/syllabus/planner/` | `POST` | `solve_time_budget_planner` | `StudyPlannerSerializer` | $D \le 0$ (400 Bad Request); $U \le 0$ (400 Bad Request); extreme budgets ($D=365, U=24$); parent topic double-count prevention (leaf nodes only); rate-limiting abuse check. |
| `/api/v1/syllabus/accuracy-report/` | `GET` | `get_accuracy_and_backtest_report` | `AccuracyReportSerializer` | Artifact existence check (`evaluation_results.json`, `backtest_results.json`); baseline comparisons; sample size integrity. |
| `/api/v1/research/reports/` | `POST` | `OrchestratorAgent.run` | `ResearchReportCreateSerializer` | Prompt injection attack payloads in inquiry text; user concurrency quota exceeded (429); invalid JSON body. |
| `/api/v1/research/reports/{id}/` | `GET` | `ResearchReport.objects.get` | `ResearchReportDetailSerializer` | Polling lifecycle checks; object-level permission (cross-user access prevention); terminal status headers. |
| `/api/v1/research/reports/{id}/rerun/` | `POST` | `rerun_research_report` | `ResearchReportRerunSerializer` | Rerun on already running report; duplicate task suppression; quota deduction. |

---

## 4. Performance, Latency, and Bundle Optimization Protocol

### 4.1 Backend Performance & Latency Audit
- **Measurement Tool**: Python timing harness + Django `connection.queries` profiling via local PostgreSQL.
- **Metrics to Capture**:
  - Response latency ($p50, p95$) over 50 iterations for each syllabus endpoint.
  - Number of SQL queries executed per endpoint (detecting N+1 queries in topic mappings and paper relations).
  - Database index coverage verification for `Question(paper, number)`, `QuestionTopicMapping(question, topic)`, and `Topic(syllabus_version, unit_no)`.

### 4.2 Frontend Bundle Size & Code-Splitting Audit
- **Current Baseline**: Total JS bundle is $567.29\text{ kB}$ ($139.14\text{ kB}$ gzip), built as a single monolithic chunk.
- **Investigation Steps**:
  1. Run Vite build analysis (`npx vite-bundle-visualizer` or Rollup chunk inspection).
  2. Identify top chunk contributors (e.g., Lucide icons, date libraries, heavy UI components).
  3. Formulate code-splitting strategy:
     - Route-level lazy loading via `React.lazy()` and `Suspense` for `ShadowSyllabusScreen`, `ResearchView`, `CareerPrepScreen`, `PrivacyCenterScreen`, and `StudyCoach`.
     - Evaluate dynamic imports for heavy third-party modules when integrated (Monaco, PDF.js, React Flow).

---

## 5. Security, Privacy, and Responsible AI Audit

### 5.1 Content Security Policy (CSP) Audit
- Verify production headers in `backend/config/settings/production.py` and `frontend/index.html`.
- Confirm `connect-src` contains exact backend API origins (`http://127.0.0.1:8000`, `ws://127.0.0.1:8000`) and **no wildcard `https:`**.
- Audit status of `style-src 'unsafe-inline'` as an OPEN, time-boxed exception tracked in [ADR-005](file:///d:/TCS/zetahackthon/docs/adrs/ADR-005-content-security-policy-inline-styles.md).

### 5.2 Public Endpoint Rate Limiting & Abuse Protection
- Test `/api/v1/syllabus/planner/` against high-frequency automated POST requests to confirm anonymous throttling (`AnonRateThrottle` / 60 requests/minute).
- Verify that no sensitive internal debug tracebacks, environment variables, or database credentials are leaked in error responses.

### 5.3 Academic Fair Dealing & License Audit
- Audit question excerpts returned by `/api/v1/syllabus/evidence/<id>/`.
- Confirm excerpts are limited to minimal necessary quotations for examination preparation under fair dealing principles, with full attribution to the university examination session.

---

## 6. Evaluation Integrity & Failure Root Cause Analysis

### 6.1 Model Layer Underperformance Investigation (Why 91.43% < 95.24%)
- **Identified Phenomenon**:
  - Embeddings-Only Cosine Similarity: **95.24% Top-1** (100/105 correct), **100.0% Top-3**, **0.9555 Macro-F1**.
  - Hybrid (Embeddings + Model Rationale): **91.43% Top-1** (96/105 correct), **98.10% Top-3**, **0.9298 Macro-F1**.
- **Diagnostic Plan**:
  1. Inspect the 4 specific questions where the hybrid model altered a correct embedding prediction to an incorrect classification.
  2. Isolate whether candidate re-ranking weights ($0.65 \times \text{vector} + 0.35 \times \text{keyword}$) diluted clean semantic vector matches.
  3. Document the failure modes in a dedicated evaluation note: *Over-reliance on lexical keywords when technical terminology spans multiple units.*

### 6.2 Backtest Uncertainty & Variance Quantification
- **Identified Phenomenon**:
  - Shadow Syllabus ($H=3.0$): **54.91%** mean marks capture ($\sigma = 4.24\%$).
  - No-Decay Marks Weighting: **53.18%** mean marks capture ($\sigma = 6.15\%$).
  - Delta: **+1.73 percentage points** (within standard error).
- **Diagnostic Plan**:
  1. Compute per-year spread and confidence bounds.
  2. Clearly highlight in all reports that 4 historical years is a small sample size and that recency decay provides a directional hypothesis rather than a statistically proven guarantee.

---

## 7. Execution Commands to be Run (Upon Approval)

```bash
# 1. Full Backend Test Suite & Profiling
wsl bash -c "cd /mnt/d/TCS/zetahackthon/backend && /var/backend_venv/bin/pytest -v"

# 2. Database Migration & Integrity Checks
wsl bash -c "cd /mnt/d/TCS/zetahackthon/backend && /var/backend_venv/bin/python manage.py makemigrations --check --dry-run"

# 3. Model Evaluation Benchmark & Failure Trace
wsl bash -c "cd /mnt/d/TCS/zetahackthon/backend && /var/backend_venv/bin/python apps/syllabus/evaluation/evaluate_mapping.py"

# 4. Walk-Forward Backtest Verification
wsl bash -c "cd /mnt/d/TCS/zetahackthon/backend && /var/backend_venv/bin/python apps/syllabus/evaluation/backtest_engine.py"

# 5. Frontend Typecheck, Lint, and Vitest Test Suite
npm run typecheck
npm run lint
npm test

# 6. Frontend Production Bundle Analysis
npm run build
```

---

## 8. Potential Remediation Backlog (To Address Following Audit)
1. **Frontend Code-Splitting**: Split `ShadowSyllabusScreen` and other secondary screens into lazy-loaded chunks to bring initial bundle under $350\text{ kB}$.
2. **Rate Limiting on Planner Endpoint**: Add DRF throttling class `AnonRateThrottle` specifically to `StudyPlannerView`.
3. **Model Layer Refinement**: Provide an ablation mode toggle allowing students to choose between "Pure Semantic Embeddings" (fast & 95.2% accurate) and "Hybrid Taxonomy Alignment".
4. **Statistical Disclaimer Banner**: Update UI backtest tab with clear uncertainty bounds ($\Delta = +1.73\%, \sigma = 4.24\%$).
