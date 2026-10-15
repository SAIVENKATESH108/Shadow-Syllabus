# ADR-005: Environment-Specific Content Security Policy (CSP) & Style Inlining Rationale

**Status**: Accepted with Conditions  
**Date**: October 14, 2026  
**Context**: Open Student Learning Platform (Frontend Web Client)

---

## 1. Context & Problem Statement
The frontend client requires a strict Content Security Policy (CSP) to mitigate Cross-Site Scripting (XSS), data exfiltration, and unauthorized network calls. During early local development, localhost HTTP (`http://localhost:*`, `http://127.0.0.1:*`) and WebSocket (`ws://localhost:*`, `ws://127.0.0.1:*`) connections were allowed to facilitate Vite Hot Module Replacement (HMR). Shipping these development origins to production creates severe security vulnerabilities, including potential local loopback hijacking.

Furthermore, overly broad wildcards (such as `connect-src 'self' https:`) undermine CSP guarantees by allowing connections to arbitrary untrusted external HTTPS endpoints. Similarly, `style-src 'unsafe-inline'` weakens CSP if not strictly bounded and phased out.

---

## 2. Decision

### A. Environment-Specific CSP Transformation
We implement an automated build-time Vite HTML transformation plugin (`frontend/src/utils/csp.ts` & `frontend/vite.config.ts`) that enforces distinct policies between development and production builds:

1. **Development Policy (`mode === 'development'`)**:
   ```
   default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; font-src 'self' data:; img-src 'self' data: https:; connect-src 'self' http://localhost:* http://127.0.0.1:* ws://localhost:* ws://127.0.0.1:*; base-uri 'self'; form-action 'self';
   ```
   Allows local Vite development server HMR and local Django API ports (`http://localhost:*`, `http://127.0.0.1:*`, `ws://localhost:*`, `ws://127.0.0.1:*`).

2. **Production Policy (`mode === 'production'`)**:
   - **Same-Origin (Default / Recommended)**:
     ```
     default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; font-src 'self' data:; img-src 'self' data: https:; connect-src 'self'; base-uri 'self'; form-action 'self';
     ```
     If the frontend and backend share an origin (reverse-proxied via Nginx/Caddy), `connect-src 'self'` alone is permitted.
   - **Separate Dedicated API Origin (Environment Variable Driven)**:
     If a distinct API domain is configured via `VITE_API_BASE_URL` (e.g., `https://api.example.com`), the build system injects *only* that exact HTTPS origin and its corresponding WebSocket origin:
     ```
     connect-src 'self' https://api.example.com wss://api.example.com
     ```
   - **Strict Zero-Wildcard Rule**:
     - **NO** broad `https:` wildcard in `connect-src`.
     - **NO** `localhost`, `127.0.0.1`, plain `http://`, or plain `ws://` schemes in production.
     - Origins must be provided strictly via deployment configuration / environment variables, never hard-coded.

### B. Time-Boxed Exception for `style-src 'unsafe-inline'`
- **Technical Constraint**: Dynamic theme toggles (light/dark mode CSS variables), SVG rendering, and component transitions in React/Tailwind dynamically attach inline style attributes.
- **Risk Mitigation**: `script-src` strictly enforces `'self'` with **NO** `'unsafe-inline'` and **NO** `'unsafe-eval'`. Script execution through script injection remains blocked; style attributes cannot execute script code or exfiltrate DOM tokens under modern evergreen browsers.
- **Ownership & Target Milestone**:
  - **Accountable Owner**: Frontend Architecture & Security Lead (`sec-frontend-lead`)
  - **Target Milestone**: Milestone 3.2: Static Asset Hardening
  - **Hard Target Date**: December 15, 2026
- **Acceptance Criteria for Removal**:
  1. Full migration to CSP Level 3 style hash digests (`sha256-...`) or CSP nonces injected via edge reverse proxy headers.
  2. Complete removal of `'unsafe-inline'` from `style-src` in `frontend/src/utils/csp.ts` and generated `dist/index.html`.
  3. 100% pass rate across automated visual regression, theme switching, and accessibility audits.

---

## 3. Automated Verification & Regression Guards
A regression test (`frontend/src/test/csp.test.ts`) runs on every CI/local test invocation and enforces:
1. Development CSP permits local HMR and Django endpoints.
2. Production CSP built in `dist/index.html` contains **0 occurrences** of `localhost`, `127.0.0.1`, plain `ws:`, or plain `http:`.
3. Production CSP contains **0 occurrences** of broad `https:` in `connect-src` (rejects wildcards).
4. Production CSP with custom `VITE_API_BASE_URL` produces exact origin and wss origin pair without wildcard fallback.
5. `script-src` contains no `'unsafe-inline'` and no `'unsafe-eval'`.
6. Any violation immediately fails the build and test pipeline.
