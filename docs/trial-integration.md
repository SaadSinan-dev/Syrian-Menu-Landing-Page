# Trial applications and local refinements

The bilingual form submits to `POST /api/v1/public/trial-applications` on the existing Nest API. It does not create users, restaurants, subscriptions or active trials. Its initial message is stored atomically in a Support conversation with no linked restaurant or sender account. Existing authenticated Admin Support inbox/history/read/reply routes display these applications without interface changes. Anonymous replies remain internal review notes; admins contact applicants via the submitted email or phone.

The API validates strict bounded fields, enforces existing allowed-Origin checks, limits attempts to five per minute per IP, serializes request IDs and content fingerprints with PostgreSQL transaction locks, and deduplicates equivalent applications. It returns only `{ received: true }` after commit; it exposes no application IDs or contacts. Personal information is sent only upon submission and is never written to browser storage. Inputs remain in the mounted form after failures. The same retry ID is reused for unchanged input; content deduplication also covers reloads/new IDs. Existing Support retention rules apply; no separate retention automation is added.

## Configuration

For local development, the form defaults to `/api/v1` and Vite proxies that path to `http://127.0.0.1:3001`. Set `MARKETING_API_PROXY_TARGET` in an ignored `.env.local` to use another local API. Add the exact browser origin (for example `http://127.0.0.1:5180`) to the API's local `CORS_ORIGINS`, preserving its existing entries. Restart Vite after environment changes.

For a static published build, set public `VITE_API_URL` to the existing real API base including `/api/v1`. Add only the approved marketing production/preview origins to backend `CORS_ORIGINS`. The default development proxy is not part of the production build. No backend secret, admin password, cookie or database configuration is required in the website.

The backend includes migration `202610160001_trial_applications`. It adds applicant metadata and nullable restaurant/sender relationships while preserving existing rows and all foreign keys. The origin check requires each conversation to be either restaurant-backed or an application. Only disposable local databases were migrated during this task. The existing deployment migration gate remains unchanged and intentionally blocks publishing this migration until a separately authorized review adds its exact checksum and approves the two targeted nullability relaxations. Do not bypass that gate.

## Verification

`npm run test:e2e` covers visual changes, form validation, failure/retry states, retained values, both languages/themes and 320/390/768/1440 layouts. Successful delivery is never mocked. The real-delivery test requires an owned disposable product runtime: set `TRIAL_RUNTIME_FILE` to its private runtime descriptor containing `site`, `admin`, `api` and a `settingsFile` with disposable seeded credentials, then run `npx playwright test tests/trial.spec.ts --workers=1`. The test submits through the actual website, retries after reload, authenticates as the disposable admin and opens the unchanged Support interface to verify delivery. No production credentials are used.

Product repository tests: `tests/unit/trial-application.test.ts` and `tests/integration/trial-applications.test.ts`; the latter also covers simultaneous first creations, retries, ID conflicts, unread counts, admin-only access, no provisioning and rate limits. Existing Support/live suites provide regression coverage. Integration tests require the existing guarded disposable PostgreSQL runner. Use `127.0.0.1` for local database connections to avoid Windows IPv6 localhost connection delays.
