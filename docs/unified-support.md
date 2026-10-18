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
