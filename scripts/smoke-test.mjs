/**
 * Minimal HTTP smoke test for the deployed Next.js shell.
 * Run with the app already listening:
 *   npm run dev -- --hostname 127.0.0.1
 *   npm run smoke
 */

import assert from "node:assert/strict";

const baseUrl = (process.env.SMOKE_BASE_URL || "http://127.0.0.1:3000").replace(/\/$/, "");

async function get(path, options = {}) {
  return fetch(`${baseUrl}${path}`, { redirect: "manual", ...options });
}

const root = await get("/");
assert.equal(root.status, 200, `GET / expected 200, received ${root.status}`);

const player = await get("/player");
assert.equal(player.status, 200, `GET /player expected 200, received ${player.status}`);

const admin = await get("/admin");
assert.equal(admin.status, 307, `GET /admin expected 307, received ${admin.status}`);
assert.equal(admin.headers.get("location"), "/admin/login", "Unauthenticated admin must redirect to login");

const login = await get("/admin/login");
assert.equal(login.status, 200, `GET /admin/login expected 200, received ${login.status}`);

for (const [header, expected] of [
  ["x-frame-options", "DENY"],
  ["x-content-type-options", "nosniff"],
  ["referrer-policy", "strict-origin-when-cross-origin"],
]) {
  assert.equal((root.headers.get(header) || "").toLowerCase(), expected.toLowerCase(), `${header} is missing or incorrect`);
}

const csp = root.headers.get("content-security-policy") || "";
assert.match(csp, /frame-ancestors 'none'/, "CSP must deny framing");
assert.match(csp, /https:\/\/firebaseappcheck\.googleapis\.com/, "CSP must allow Firebase App Check");

console.log(`Smoke tests passed for ${baseUrl}`);
