# Data Protection Impact Assessment (DPIA)

**Version 1.0 • 15 October 2026**  
*Compliance Mapping: India DPDP Act 2023 & EU GDPR (Regulation 2016/679)*  
*Prepared for V.A. Sai Venkatesh*

---

## 1. Statutory Context & Processing Inventory

| Statutory Requirement | Legal Basis (GDPR / DPDP) | Implementation in Siksha OpenLearn |
| :--- | :--- | :--- |
| **Lawful Basis & Specific Consent** | GDPR Art 6, 7 &bull; DPDP Sec 6 | Granular, unbundled consent toggles (AI Training, Cloud Sync, Diagnostics). Default is OFF. No feature gating or degradation when opting out. |
| **Data Minimisation** | GDPR Art 5(1)(c) &bull; DPDP Sec 4(1) | University Roll Numbers and Student IDs are strictly optional and stored encrypted at rest. No biometrics or location telemetry collected. |
| **Protection of Children & Minors** | GDPR Art 8 &bull; DPDP Sec 9 | Age verification at signup. Minors (<18) require verifiable parental consent (`ParentalConsentRecord`). **Zero behavioral profiling, tracking, or targeted advertising of minors**. |
| **Right to Erasure ("Be Forgotten")** | GDPR Art 17 &bull; DPDP Sec 12(3) | Self-service one-click account deletion with a 30-day reversible grace period. Cascading purge reaches relational records, vector embeddings, files, and server memory caches. |
| **Right to Data Portability** | GDPR Art 20 &bull; DPDP Sec 12(1) | Students can export their complete study history as machine-readable JSON or formatted PDF dossiers via `/api/v1/users/export/`. |
| **Automated Decisions Non-Verdict** | GDPR Art 22 | AI resume readiness scores and interview coaching rubrics are strictly formative aids. They never make legal or hiring determinations. |
| **Data Protection Officer & Redressal** | DPDP Sec 10 &bull; GDPR Art 37-39 | Statutory escalation channel to designated Data Protection Officer (dpo@siksha-openlearn.org) with legally binding 72-hour SLA response. |

---

## 2. Retention Schedules & Purge Lifecycles

| Data Classification | Storage Location | Retention Window | Purge Enforcement |
| :--- | :--- | :--- | :--- |
| **AI Study Chats & Inquiries** | PostgreSQL `apps/rag` | 90 days rolling | Automated Celery cron hard-delete; early purge button available in Privacy Centre. |
| **Curriculum Roadmaps & Notes** | PostgreSQL `apps/courses` | Account Lifetime | Retained while active; permanently erased upon account deletion. |
| **OCR Text Corrections** | PostgreSQL `apps/syllabus` | Permanent Public (CC BY-NC 4.0) | PII scrubbed prior to commit; preserved as open educational commons. |
| **Server Diagnostic Logs** | Redis / Salted Logs | 14 calendar days | Automated rotating cron zeroing; zero student PII or raw IP addresses persisted. |

---

## 3. High-Risk Processing & Mitigation

1. **AI Model Fine-Tuning**: Student queries are never included in training corpuses without explicit, opt-in consent. The AI Training Corpus Verification Log (`UID-IND-99420-SK`) allows students to audit cryptographic checkpoints proving 0 tokens contributed.
2. **Audio Mock Interviews**: Voice recordings are stored in transient RAM buffers and wiped permanently on demand or session close.
3. **Resume Analysis**: Resumes are parsed in memory, scrubbed of demographic identifiers, and never shared with commercial recruitment databases.
