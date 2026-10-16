# Refinements verification — 2026-10-16

## Verified locally

- Requested hero/features photos removed; phone, demo, caption and other images preserved. Four bilingual product previews, invoice-only hover, original complete logo and reduced-motion/touch behavior verified at mobile/tablet/desktop widths.
- Website build and lint pass. Nine website unit tests pass. Twenty-eight browser checks pass, covering existing functionality plus new visual/form behavior.
- Real delivery test passed end to end: browser form → actual Nest API → PostgreSQL commit → existing authenticated Admin Support inbox/conversation. Reloaded resubmission produced one conversation. Screenshot: `artifacts/refinements/real-trial-admin-support.png` (local disposable fixture only).
- Backend build/type-check pass. Twenty-five existing backend tests, four new trial unit tests and fifteen PostgreSQL/HTTP Support/trial/live integration tests pass. Simultaneous first submissions with the same request ID and different IDs sharing content persist once. Invalid input, untrusted origins, forbidden owner access, rate limits, owner unread isolation, Admin read/reply and no account/restaurant creation are covered. Failed transactions never return successful acknowledgement.
- Migration tested on fresh disposable databases and an upgrade database with an existing sentinel user preserved. No existing local or hosted application database was migrated.

## Current external blockers

The final full browser rerun has 28 passing checks and one failing real-Admin screen check: concurrently edited `apps/admin/src/admin.css` returns HTTP 500 from Tailwind with `Missing opening (`. The same real-delivery browser test passed earlier and produced the screenshot above. API delivery, durable persistence and Admin authorization/inbox/history integration continue to pass. No Admin interface source was modified for this task.

The broader product frontend type-check also reported errors in concurrently edited `apps/menu/src/MenuExperience.tsx` (`colorMode`) and `packages/menu-renderer/src/index.tsx` (theme type). These are outside the requested scope; the targeted API type-check and marketing build pass.

The existing migration gate intentionally rejects the new migration until an authorized migration review updates its exact checksum whitelist and approves the two nullability relaxations. Its rejection was verified. The gate and deployment workflows were not weakened or changed for these refinements. Public deployment additionally needs the actual `VITE_API_URL` and explicit marketing origins in API `CORS_ORIGINS`; see `trial-integration.md`.

No commit, push, merge or deployment was performed. Unrelated concurrent edits in the product repository were preserved.
