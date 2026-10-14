# Security Policy

## 1. Security Baseline & Architecture Principles

This project is an open-source student learning platform serving users worldwide, including minors. Security is paramount. All development must adhere to the **Appendix A.3 Security Baseline**:

- **Authentication & Authorization**: Strict authentication on all non-public endpoints. Mandatory object-level permission checks (row-level access control) on every DRF viewset and API endpoint.
- **Data Protection**: Zero storage of plain-text credentials or API secrets. Encryption in transit (TLS 1.3) and encryption at rest.
- **Untrusted Input & Injections**: All incoming user data, files, web hooks, and AI responses are treated as untrusted. AI output must never be executed or directly trusted.
- **No User Code Execution**: Under no circumstances shall arbitrary student code or scripts be executed on the application server. Any future code evaluation must use isolated, dedicated sandbox runners with no host filesystem access and restricted egress.
- **AI Gateway Mediation**: All interactions with Large Language Models and AI services must strictly route through the `apps/ai_gateway/` application. Direct third-party model API calls from other apps or the frontend are strictly prohibited.
- **Vulnerability Fail-Safe**: Automated CI scans (`pip-audit`, `npm audit`, `Bandit`, `Trivy`) run on every pull request and will fail builds on any high- or critical-severity finding.

## 2. Reporting a Vulnerability

If you discover a security vulnerability within this repository:

1. **Do not create a public GitHub issue.**
2. Send a detailed report to the security team at: `security@learning-platform.example.org` (or contact repository administrators directly via private security advisory).
3. Include:
   - Description of the vulnerability.
   - Proof of Concept (PoC) or reproducible steps using synthetic/mock data only.
   - Potential impact assessment.
4. The security response team will acknowledge your report within 48 hours and coordinate remediation.
