# ADR 0002: AI Gateway Mediation and Unverified Content Labelling

## Status
Accepted

## Context
Generative AI models can produce hallucinations, leak sensitive personal data if prompts are unscrubbed, or fail to adhere to child safety policies. Direct invocation of LLMs across different frontend components or backend views introduces significant security vulnerabilities, privacy leaks, and inconsistent guardrails.

## Decision
All interactions with generative models must be mediated solely through the internal `apps/ai_gateway/` Django app.
1. **PII Scrubbing**: Student names, contact details, and unnecessary personal identifiers are redacted before prompt construction.
2. **Untrusted Framing**: User input is strictly demarcated as untrusted content to prevent prompt injection attacks.
3. **Mandatory Unverified Flag**: Every response returned by the AI Gateway carries `is_unverified: True` metadata. Both API serializers and frontend components must prominently render this disclaimer to end users.
4. **Pedagogical Guardrails**: The gateway injects system prompts instructing the model to act as a coach (providing hints and guided inquiry) rather than solving homework or assessments directly.

## Consequences
- **Positive**: Single point of audit, telemetry, rate limiting, and privacy sanitization; prevents accidental data leaks to external model vendors.
- **Negative**: Adds an internal abstraction layer; requires all new AI capabilities to extend the gateway adapter interface.
