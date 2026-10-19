# Unified landing-page Support inbox

The website's existing Contact and Free Trial forms now deliver to the product backend in the sibling `syrian-menu` repository. Both save into `SupportConversation` and `SupportMessage`; neither provisions accounts, restaurants, trials, or subscriptions.

- `POST /api/v1/public/contact-messages` validates bounded contact fields, optional phone and the honeypot, and atomically saves a Contact conversation and initial message.
- `POST /api/v1/public/trial-applications` retains its existing validation/deduplication and now saves structured details and the Trial type.
- `GET /api/v1/admin/support` supports `q`, `kind` (`CONTACT`, `TRIAL`, `SUPPORT`), and `status` (`NEW`, `IN_PROGRESS`, `RESOLVED`) with server-side pagination.
- `PATCH /api/v1/admin/support/:id/status` validates status and rechecks active administrator authorization inside the write transaction.

Both public endpoints retain origin protection and five requests/minute throttling. Retry IDs and content fingerprints prevent duplicate records. Public responses acknowledge persistence only after transaction commit. The forms already enforce this acknowledgement, retain input after errors, and disable submission while pending.

Admin Support has bilingual type/status labels, search, filters, structured contact details and persisted status controls. Anonymous conversation replies are explicitly identified as internal notes. Existing tenant-scoped Support access is reused; anonymous submissions have no restaurant association.

## Database and release

The additive `202610190001_unified_support` migration introduces metadata/status, classifies historical trial conversations and extends the origin integrity constraint. Historical trial details remain readable in their original messages. No existing rows or columns are removed. The exact migration hash is registered in the existing release guard. Apply this migration through the normal product release workflow before deploying the API. This task only migrated guarded local disposable databases; it did not deploy production.

Website production configuration remains `VITE_API_URL` pointing to the actual product API, with the marketing origin allowed in backend `CORS_ORIGINS`. No frontend secrets are required.

## Verification commands

Website: `npm run build`, `npm run lint`, `npm test`. Real browser coverage: set `TRIAL_RUNTIME_FILE` to an owned disposable runtime descriptor, then run `npx playwright test tests/contact.spec.ts tests/trial.spec.ts tests/unified-support.spec.ts --workers=1`.

Product: `npm run typecheck`, `npm run lint`, `npm test`, `npm run test:backend`, and `npm run build` with `VITE_API_URL=/api/v1`. The build correctly refuses a localhost production API URL.

The guarded product integration runner now includes `tests/integration/support-submissions.test.ts`; it checks both types, real database persistence, filtering, search, status changes, admin access, validation, duplicate prevention, and no provisioning. Existing Support, trial and live-notification integration suites cover tenant isolation and regressions.

## Changed files for this task

Website: `tests/contact.spec.ts`, `tests/unified-support.spec.ts`, and this document. The existing production forms already submit to the correct endpoints and check the server acknowledgement, so they were reused unchanged.

Product backend: `apps/api/src/app.module.ts`, `apps/api/src/support/contact-submission.ts`, `apps/api/src/support/support.controller.ts`, `apps/api/src/support/support.service.ts`.

Product UI/contracts: `apps/admin/src/Support.tsx`, `apps/admin/src/support-submissions.css`, `packages/contracts/src/index.ts`.

Database/release: `prisma/schema.prisma`, `prisma/migrations/202610190001_unified_support/migration.sql`, `deployment/approved-migrations.json`, `scripts/deployment/migrations.mjs`, `scripts/deployment/integration-runner.mjs`.

Product tests: `tests/integration/support-submissions.test.ts`, `tests/unit/contact-submission.test.ts`, `tests/unit/support-migration.test.ts`, `tests/unit/support-submission-failure.test.ts`.

## Actual results — 19 October 2026

- Website build (including TypeScript), lint and all 9 unit tests passed.
- Product TypeScript checks passed. Full API/Admin/Dashboard/Menu production build passed with `VITE_API_URL=/api/v1`; Admin was rebuilt successfully after the final accessibility fix. An initial build using the workstation's localhost API setting was correctly rejected by the production configuration guard.
- Product lint completed with existing warnings outside the changed files. Targeted lint of the changed API, Admin and test files was clean.
- Full product suite: 351 passed, 72 skipped using `npm test -- --maxWorkers=1`. Integration tests are opt-in and were exercised separately below. The initial run identified the required migration-manifest registration; after that fix, a parallel rerun had four timing-sensitive failures in `admin-skeleton.test.tsx` and `design-lifecycle.test.tsx`. All passed in the final single-worker run without changes to those tests or application features.
- Backend suite: 25 passed.
- Guarded real PostgreSQL/HTTP integration: 16 passed across unified submissions, trial applications, Support and live Support. Both empty and upgrade migration checks passed with the existing sentinel preserved. Persistence failure tests also confirm that neither form receives acknowledgement or triggers notifications after transaction failure.
- Browser tests: 9 Contact/Trial tests passed, plus 1 combined unified-inbox test passed. These use the actual API and disposable PostgreSQL, including both form submissions, duplicate prevention, search, type/status filters, structured details and status persistence after reload. The combined test initially timed out, exposed ambiguous accessible filter names, and passed after explicit names were added. Its final run took 10.9 seconds.
- Contact and Trial layouts were checked across languages, themes and screen sizes. The combined inbox passed a 390px overflow check and its screenshot was visually reviewed: `artifacts/contact/unified-support-mobile.png`.

No production deployment or production database migration was performed. Existing unrelated working-tree changes were preserved.
