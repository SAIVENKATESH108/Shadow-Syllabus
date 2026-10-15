export const DEV_CSP =
  "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; font-src 'self' data:; img-src 'self' data: https:; connect-src 'self' http://localhost:* http://127.0.0.1:* ws://localhost:* ws://127.0.0.1:*; base-uri 'self'; form-action 'self';";

/**
 * Generates least-privilege production CSP.
 * Rules:
 * - If apiBaseUrl is specified and HTTPS, allows ONLY that exact origin (and wss:).
 * - If same-origin (default), strictly permits connect-src 'self' with ZERO wildcards.
 * - Under NO circumstances allows broad https:, plain http:, localhost, or plain ws:.
 */
export function getProductionCsp(apiBaseUrl?: string): string {
  let connectSrc = "connect-src 'self'";

  if (apiBaseUrl && apiBaseUrl.trim()) {
    try {
      const url = new URL(apiBaseUrl.trim());
      if (url.protocol === "https:") {
        const origin = url.origin;
        const wssOrigin = `wss://${url.host}`;
        connectSrc = `connect-src 'self' ${origin} ${wssOrigin}`;
      }
    } catch {
      // Invalid URL fallback strictly to same-origin
      connectSrc = "connect-src 'self'";
    }
  }

  return `default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; font-src 'self' data:; img-src 'self' data: https:; ${connectSrc}; base-uri 'self'; form-action 'self';`;
}

export function getCspPolicy(mode: string, apiBaseUrl?: string): string {
  return mode === "development" ? DEV_CSP : getProductionCsp(apiBaseUrl);
}

export function transformCspHtml(html: string, mode: string, apiBaseUrl?: string): string {
  const policy = getCspPolicy(mode, apiBaseUrl);
  return html.replace(/__CSP_POLICY__/g, policy);
}
