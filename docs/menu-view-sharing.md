# Shared interactive menu

`src/components/menu/` is the canonical implementation of the original landing demo. `src/components/MenuExperience.tsx` supplies its fictional restaurant data and existing language/theme preferences.

The production repository consumes a byte-verified snapshot of this view in `packages/menu-renderer/src/landing/`. Its adapter supplies real API data and keeps independent deployment possible. After changing the canonical files, run `node scripts/sync-landing-menu.mjs` in the sibling product repository and publish both verified source revisions. `--check` detects drift; `--verify-snapshot` verifies an independently checked-out product snapshot.

Keep restaurant content out of the shared view. The shared props accept optional production-only logos, covers, contacts, availability/allergens, navigation configuration and real dish URLs. Sample-only sizes/ingredients remain optional data supplied by this landing page. Existing menu appearance is preserved; no marketing sections enter the public menu.
