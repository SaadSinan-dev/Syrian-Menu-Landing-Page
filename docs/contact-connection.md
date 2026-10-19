# Contact connection verification — 19 October 2026

## Root cause

The published landing-page JavaScript used `/api/v1` as its API base, but Vercel serves a static site without that proxy. A read-only OPTIONS request to the product API with `Origin: https://syrianmenu.vercel.app` returned 204 without `Access-Control-Allow-Origin`, confirming the hosted allowlist also needs the marketing origin.

## Changes

- `scripts/api-config.ts` and `vite.config.ts`: default production builds to `https://syrian-menu-api.onrender.com/api/v1`. Reject relative, insecure or malformed production API overrides. Development retains its local proxy. No new endpoint, inbox or database model was introduced.
- `tests/api-config.test.mjs`: regression tests first reproduced the bad static-host fallback and missing configuration validation; both now pass.
- `tests/contact.spec.ts`: verify CORS preflight, exact Contact payload, direct API destination for a static test build, committed contact details, duplicate prevention and Admin Support status persistence.
- `.env.example`, `README.md`, `docs/vercel-deployment.md`: document the actual API default, correct migration/status information and exact origin requirements.
- Sibling product repository: `scripts/deployment/api-origin.mjs` and `scripts/deployment/orchestration.mjs` now include `https://syrianmenu.vercel.app` alongside all three existing product origins when generating API environment settings. `tests/unit/api-origin-sync.test.ts` covers that list. Backend handlers and database schema are unchanged.

The existing Contact form already sends bounded normalized name/email/phone/subject/message fields, a retry UUID and honeypot. It disables duplicate pending submissions, retains input after failures and only shows success when the real server returns `{ received: true }` after committing. Those behaviors were reused unchanged.

## Actual verification

- Website `npm run build`: passed, including TypeScript. The compiled Contact request was inspected and targets the actual product API URL.
- Website `npm run lint`: passed.
- Website `npm test`: 11 passed.
- Contact Playwright suite: 4 passed in 20.8 seconds. Its real-delivery test used a compiled static site with an explicit cross-origin local product API, actual PostgreSQL and authenticated Admin Support. No success response was mocked. Exact payload/details, single persisted submission after a reload/retry, and status after reload were verified.
- Product deployment regression tests: 37 passed. Targeted lint of changed deployment files passed.
- Full product suite (`npm test -- --maxWorkers=1`): 351 passed, 72 opt-in integration tests skipped. Real Contact persistence was exercised separately by the browser test above.

## Hosted activation

No website deployment, production database write, or hosted environment mutation was performed. The source fix is verified against the real product stack locally; the current public site is not yet claimed fixed.

Publish the website through its normal release workflow, removing any old `VITE_API_URL=/api/v1` override. Apply the updated API `CORS_ORIGINS`, preserving existing entries and adding exactly `https://syrianmenu.vercel.app`, then verify the hosted preflight and a real submission. Custom/preview origins require separate explicit allowlist entries.

The pre-existing staged `docs/unified-support.md` was preserved.
