# Open Student Learning Platform

# Shadow-Syllabus

A secure, modular learning platform designed for global students, built with **Django 5**, **DRF**, **Channels**, **Celery**, **PostgreSQL with pgvector**, **Redis**, **MinIO**, and a **React 18 + TypeScript + Vite + Tailwind** frontend.

---

## 1. Monorepo Structure

```
├── backend/          # Django 5.x REST API, Channels (WebSocket), Celery tasks
│   ├── apps/
│   │   ├── ai_gateway/    # Centralized LLM gateway, sanitization & unverified stamping
│   │   ├── assessments/   # Submissions, rubric evaluations & coach guidance
│   │   ├── common/        # Base models, object-level permissions, audit mixins
│   │   ├── courses/       # Curriculum, modules, lessons & pgvector knowledge stores
│   │   └── users/         # Custom User, parental consent (DPDP/GDPR), synthetic fixtures
│   └── config/       # Modular settings (base, local, production), URLs, ASGI, Celery
├── frontend/         # React 18, TypeScript, Vite, Tailwind CSS, Lucide Icons, Vitest
├── docs/             # PRD, Architecture, ADRs, OpenAPI specs, Appendix A security baseline
├── infra/            # Docker Compose, Dockerfiles, MinIO setup scripts
├── ml/               # RAG embedding pipelines, benchmark datasets, evaluation harnesses
├── .github/          # CI/CD workflows (linting, tests, SAST, dependency audits)
├── .env.example      # Safe placeholder environment configuration
├── SECURITY.md       # Security baseline & vulnerability disclosure policy
└── PRIVACY.md        # GDPR and India DPDP compliance, retention & erasure paths
```

---

## 2. Quickstart & Local Run Commands

### Prerequisites
- [Docker](https://docs.docker.com/get-docker/) & [Docker Compose](https://docs.docker.com/compose/)
- Python 3.12+
- Node.js 20+ & npm

### A. Environment Configuration
Create your local environment file from the template:
```bash
cp .env.example .env
```

### B. Launch Infrastructure with Docker Compose
Starts PostgreSQL (with `pgvector`), Redis 7, and MinIO S3 storage:
```bash
# Start all backing services in detached mode
docker compose -f infra/docker-compose.yml up -d postgres redis minio minio-init

# Verify services are healthy
docker compose -f infra/docker-compose.yml ps
```

### C. Backend Setup & Run Commands

```bash
cd backend

# 1. Create and activate a virtual environment
python -m venv .venv
# On Linux/macOS:
source .venv/bin/activate
# On Windows (PowerShell):
.venv\Scripts\Activate.ps1

# 2. Install dependencies (including dev and security auditing tools)
pip install -e ".[dev]"

# 3. Run database migrations (applies pgvector extension and core schemas)
python manage.py migrate

# 4. Start the Django ASGI development server (supports REST & WebSockets)
python manage.py runserver 0.0.0.0:8000

# 5. Start Celery worker in a separate terminal:
celery -A config worker -l info
```

### D. Frontend Setup & Run Commands

```bash
cd frontend

# 1. Install dependencies
npm install

# 2. Run the Vite development server with Hot Module Replacement
npm run dev

# 3. Build for production preview
npm run build
```

---

## 3. Running Tests, Linters & Security Audits

### Backend Checks
```bash
cd backend

# Run Ruff linter and formatter checks
ruff check .
ruff format --check .

# Run static type checks with Mypy
mypy apps config

# Run test suite with pytest
pytest

# Run security SAST analysis with Bandit (fails on high severity)
bandit -r apps/ config/ -ll -ii

# Run dependency vulnerability audit
pip-audit
```

### Frontend Checks
```bash
cd frontend

# Run ESLint
npm run lint

# Run TypeScript type check
npm run typecheck

# Run Vitest unit tests
npm run test

# Run npm dependency security audit
npm audit --audit-level=high
```

### Container / Filesystem Security Scan
```bash
# Scan repository for high/critical vulnerabilities with Trivy
trivy fs --severity HIGH,CRITICAL --exit-code 1 .
```

---

## 4. Key Architectural Safeguards

- **Strict Object-Level Permissions**: Every endpoint validates resource ownership or educator/guardian authorization.
- **AI Gateway Mediation**: All model requests flow through `backend/apps/ai_gateway/`. Any inferred or AI-generated response is labelled with `is_unverified: true`.
- **Zero Host Code Execution**: Student code is never run on the application host.
- **Privacy by Design**: Fully compliant with GDPR and India's DPDP Act 2023 for minors.
