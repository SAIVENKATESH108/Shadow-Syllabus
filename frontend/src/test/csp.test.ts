import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";
import { transformCspHtml, DEV_CSP, getProductionCsp } from "../utils/csp";

describe("Content Security Policy (CSP) Regression & Invariant Tests", () => {
  it("generates development CSP with localhost and websocket support for HMR", () => {
    const rawHtml = '<meta http-equiv="Content-Security-Policy" content="__CSP_POLICY__" />';
    const transformed = transformCspHtml(rawHtml, "development");

    expect(transformed).toContain("http://localhost:*");
    expect(transformed).toContain("ws://localhost:*");
    expect(transformed).toContain("http://127.0.0.1:*");
    expect(DEV_CSP).toContain("http://localhost:*");
  });

  it("generates same-origin production CSP with ZERO wildcards, zero localhost, and zero ws:", () => {
    const rawHtml = '<meta http-equiv="Content-Security-Policy" content="__CSP_POLICY__" />';
    const transformed = transformCspHtml(rawHtml, "production");

    // Must be strictly same-origin connect-src
    expect(transformed).toContain("connect-src 'self';");

    // Regression guards mandated by QA:
    // 1. Must NOT contain broad https: in connect-src
    expect(transformed).not.toContain("connect-src 'self' https:");
    expect(transformed).not.toContain("connect-src https:");
    
    // 2. Must NOT contain localhost, loopback, or plain ws
    expect(transformed).not.toContain("localhost");
    expect(transformed).not.toContain("127.0.0.1");
    expect(transformed).not.toContain("ws://");
    expect(transformed).not.toContain("http://");

    // 3. Must NOT contain unsafe-inline or unsafe-eval in script-src
    expect(transformed).toContain("script-src 'self'");
    expect(transformed).not.toContain("script-src 'self' 'unsafe-inline'");
    expect(transformed).not.toContain("'unsafe-eval'");
  });

  it("generates environment-specific production CSP with explicit API and WSS origin when VITE_API_BASE_URL is set", () => {
    const rawHtml = '<meta http-equiv="Content-Security-Policy" content="__CSP_POLICY__" />';
    const transformed = transformCspHtml(rawHtml, "production", "https://api.siksha.learn.org");

    expect(transformed).toContain("connect-src 'self' https://api.siksha.learn.org wss://api.siksha.learn.org;");
    expect(transformed).not.toContain("connect-src 'self' https:;");
    expect(transformed).not.toContain("localhost");
    expect(transformed).not.toContain("127.0.0.1");
  });

  it("rejects non-https API base URLs in production and falls back safely to same-origin", () => {
    const policy = getProductionCsp("http://insecure-api.com");
    expect(policy).toContain("connect-src 'self';");
    expect(policy).not.toContain("http://insecure-api.com");
  });

  it("proves compiled dist/index.html enforces production CSP with zero localhost and zero broad https: connect-src", () => {
    const distPath = path.resolve(__dirname, "../../dist/index.html");
    if (!fs.existsSync(distPath)) {
      return;
    }
    const distHtml = fs.readFileSync(distPath, "utf-8");

    // Must not leak development placeholder
    expect(distHtml).not.toContain("__CSP_POLICY__");

    // Must not contain any localhost connections in production bundle
    expect(distHtml).not.toContain("localhost");
    expect(distHtml).not.toContain("127.0.0.1");
    expect(distHtml).not.toContain("ws://");

    // Regression: must not contain broad https: in connect-src
    expect(distHtml).not.toContain("connect-src 'self' https:");
    expect(distHtml).toContain("connect-src 'self'");
  });
});

