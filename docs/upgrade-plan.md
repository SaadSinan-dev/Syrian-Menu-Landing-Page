# Bilingual themes and cloud CTA upgrade

Preserve the existing React application, section layouts, public assets, local data and #demo route. No backend or unrelated project changes.

1. **Shared preferences and translation dictionaries** — Add typed English/Arabic copy for every visible and accessible label, shared React preferences, safe localStorage persistence, document lang/dir, and early theme bootstrap. Keep a single language across marketing and both menu instances. Test missing/invalid preferences, dictionary parity and initial system theme.
2. **Integrate controls and semantic styles** — Localize existing components without duplicated pages. Keep the animated SVG cloud CTA outside the collapsed mobile links. Share theme/language controls with the demo header. Apply semantic light/dark tokens to the complete site and menu, logical positioning for RTL and responsive Arabic typography. Animate only the cloud artwork inside a stable link, pause on focus/hover, disable with reduced motion.
3. **Verify and deliver** — Preserve current functional tests, add all four language/theme combinations, preference reload/navigation, system theme, unavailable storage, keyboard, mobile CTA and no-overflow checks. Inspect desktop/mobile images in both themes and languages. Build, lint, review and refresh the production preview.

## Additional motion scope

The user's follow-up adds premium motion while preserving the design: coordinated hero text/photo/phone entrances, five distinct once-only reveal variants, interactive hover/press feedback, natural bounded cloud drift, refined menu category/card/detail/photo entrances, and subtle preference-change feedback. Use CSS and one IntersectionObserver; add no animation dependencies. Keep every target usable during animation and show all content under reduced motion.

Acceptance: every marketing and menu label localized (proper names/contact handles preserved), no unintended mixed content, correct document and menu directions, preferences consistent across navigation and reload, no theme flash from late initialization, cloud link stable and visible at 320px+, and no new browser errors.

## Completed verification

- 9 unit tests and 20 Chromium browser tests pass.
- TypeScript/Vite production build and lint pass.
- English/Arabic × light/dark inspected on desktop and mobile; 20 captured previews, no browser errors.
- Responsive checks cover 320, 390, 768 and 1440 pixels; independent review also checked intermediate widths.
- Semantic text-pair contrast checked in both palettes: minimum 5.15:1 light and 6.64:1 dark across the sampled pairs.
- Independent review found one mobile keyboard-order issue; fixed with initial link focus and a passing regression test. Escape still restores the toggle.
- Built production preview tested at 390px with Arabic/dark persistence after reload; no overflow, browser errors or external requests.
