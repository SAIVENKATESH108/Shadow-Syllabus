# Contributor Guide

Welcome to the Open Student Learning Platform! Because this platform serves students and minors, code quality, security, and data privacy are enforced rigorously.

## 1. Golden Rules of Development

1. **One Task, One Branch**: Work on dedicated, descriptive feature branches (`feat/issue-123-description`, `fix/security-patch`). Keep changes minimal and cohesive.
2. **Never Touch Unrelated Code**: Limit changes to files directly relevant to your assigned task.
3. **No Hardcoded Secrets or Real PII**:
   - Never commit API keys, tokens, or personal identifiers.
   - All tests and seed scripts must use synthetic data generated via factories or mock fixtures.
4. **Enforce Object-Level Permissions**: Every DRF viewset and endpoint must check object permissions (`has_object_permission`).
5. **Route All AI Calls Through `ai_gateway`**: Never make direct external API calls to OpenAI, Anthropic, Gemini, etc. from views or tasks. Always use `apps/ai_gateway/`.
6. **Label AI-Reconstructed Content**: Any AI-generated or inferred content must include `is_unverified: True` metadata.
7. **No Code Execution**: Never evaluate student code on the application server.

## 2. Local Setup & Pre-Commit

1. Install pre-commit:
   ```bash
   pip install pre-commit
   pre-commit install
   ```
2. Run pre-commit checks manually across all files:
   ```bash
   pre-commit run --all-files
   ```

## 3. Pull Request Requirements

Every pull request must:
- Pass all CI checks (Ruff, Mypy, Pytest, ESLint, Vitest, pip-audit, npm-audit, Bandit, Trivy).
- Include tests demonstrating functionality and permission enforcement.
- Document any AI assistance utilized in producing the changes.
- Highlight any areas requiring human review (migrations, auth changes, uploads, sandboxing, legal/privacy).
