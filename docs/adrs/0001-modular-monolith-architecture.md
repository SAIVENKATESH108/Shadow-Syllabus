# ADR 0001: Adoption of Modular Monolith Architecture

## Status
Accepted

## Context
The platform is in its initial build phase, developed by a small team. The platform requires high developer velocity, clear domain boundaries, and strong security and privacy invariants (GDPR and India DPDP Act 2023 compliance).

## Decision
We adopt a **modular monolith** architecture using Django 5, DRF, Channels, and Celery, with a React 18 TypeScript frontend.
- Domain boundaries are enforced via separate Django applications (`users`, `courses`, `assessments`, `ai_gateway`, `common`).
- Cross-module calls must occur via clean service boundaries or domain signals, never raw foreign database mutations.
- The entire application shares a single transactional database (PostgreSQL with `pgvector`), eliminating distributed transaction complexities and simplifying atomic GDPR data erasure.

## Consequences
- **Positive**: Simplified local development via single Docker Compose file; trivial atomic transactions across domain models; zero network latency between modules; simplified CI/CD pipeline.
- **Negative**: Requires discipline to prevent tight coupling across Django models; scaling is done horizontally as a unified unit.
