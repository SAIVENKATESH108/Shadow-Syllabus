# Product Requirements Document (PRD)

## 1. Executive Summary & Mission
The Open Student Learning Platform provides an accessible, secure, and personalized digital learning environment for students globally across multiple languages and socio-economic contexts.

## 2. Target Personas
- **Learner (Student)**: Often minors (ages 10-18) or adult learners seeking curriculum mastery. Requires safe, guided hints rather than automated answers.
- **Educator (Teacher / Instructor)**: Designs modules, reviews student submissions, provides human assessment, and monitors AI coach recommendations.
- **Guardian (Parent / Legal Guardian)**: Required for minor onboarding under GDPR and India DPDP Act; reviews and grants consent for platform participation.

## 3. Core Functional Requirements
1. **Curriculum & Lesson Delivery**: Structured content hierarchy (Courses -> Modules -> Lessons) with vector-backed semantic search.
2. **Pedagogical AI Coach**:
   - Offers scaffolded explanations, diagnostic questions, and hints.
   - Refuses to write complete homework solutions for graded tasks.
   - All AI responses are prominently badged with `Unverified AI guidance`.
3. **Submissions & Review**:
   - Secure document uploads (PDF, text) stored in S3/MinIO.
   - Educator feedback workflow with rubric scoring.
4. **Data Privacy & Guardian Portal**:
   - Verifiable parental consent capture prior to minor account usage.
   - One-click account & data erasure workflow with cascading deletions.

## 4. Non-Functional Requirements
- **Security**: Strict Appendix A.3 baseline, mandatory object permissions, zero code execution on host.
- **Compliance**: Zero behavioral profiling of minors; strict data minimization.
- **Performance**: API p95 response time < 250ms; real-time WebSocket latency < 100ms.
- **Supply Chain**: All dependencies scanned via pip-audit and npm audit; zero high/critical vulnerabilities.
