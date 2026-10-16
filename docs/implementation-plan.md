# SYRIAN MENU website implementation plan

**Goal:** A standalone, deployable React marketing site and immediate interactive restaurant demo, based on the supplied brief and UI references.

**Architecture:** Retain React 19, TypeScript and Vite. Use plain scoped CSS and local images/fonts from the existing product. Adapt its public-menu presentation conventions into independent local components; do not import its router, API, authentication or database dependencies. Use a hash route (`#demo`) so static hosts need no route rewrites.

**Design:** Ivory #F7F4ED, deep forest green, restrained gold, the supplied official symbol, Lora editorial headings, Inter UI and IBM Plex Sans Arabic menu text. Large food photography, an interactive HTML/CSS phone, generous spacing. English marketing and an Arabic-first bilingual fictional Dar Al Yasmin menu. No fabricated social proof or unsupported features.

**Constraints:** Work only in syrian-menu-website. All fonts, photography and menu data local; no backend or external requests at runtime. Official email and Instagram exact. WhatsApp placeholder must never become a chat link; centralized visibility/real-number configuration. Visible focus, semantic navigation, reduced motion, keyboard use and correct lang/dir. No horizontal page overflow at 320px and up.

## Task 1: Assets and safe local data
- [x] Copy official symbol, local WebP photography and self-hosted fonts; document provenance.
- [x] Add typed bilingual menu data and contact configuration.
- [x] Test placeholder rejection, hidden/coming-soon/verified contact modes, URL message encoding and category/search/size price behavior with Node's test runner.

## Task 2: Marketing and interactive menu
- [x] Build Header, Brand, QR, PhoneFrame and marketing sections (hero, steps, features, experience, contact, footer).
- [x] Build shared interactive MenuExperience with categories, search, language, manual featured selection, dish detail and size prices; preserve filter/scroll on returning.
- [x] Implement hash-route demo, browser back and obvious site return. Mobile nav supports Escape and closes on navigation.
- [x] Style desktop, tablet and mobile layouts with visible focus and reduced-motion support.

## Task 3: Verify and hand over
- [x] Run typecheck/production build, lint and unit tests.
- [x] Browser checks: all navigation, category/search combinations and empty state, details/size/back, language, featured controls, contact safety, direct demo and history navigation.
- [x] Visually inspect desktop and mobile screenshots; check 320/390/768/1440 widths, images, console errors, keyboard and reduced motion.
- [x] Document run/build/test/deploy and WhatsApp configuration in README; open the running site.

## Review focus
1. Placeholder/invalid phone values must never produce wa.me links, including punctuation or mixed letters.
2. Category plus search must combine; clearing filters must recover from no results.
3. Arabic and English details must preserve correct reading direction, price isolation and selected size.
4. Returning from details must preserve the user's browsing context; route changes must preserve browser history.
5. Mobile phone presentation and navigation must remain readable, keyboard accessible, and free of clipped content.

**Execution:** Native implementation in the user-specified separate React folder. No Git repository exists in that folder; no Git setup or commits are needed. Verification uses unit tests and a real Chromium browser.

## Verification results
- Production build: passed (TypeScript and Vite).
- Lint: passed with no warnings.
- Unit tests: 6 passed.
- Chromium end-to-end tests: 8 passed, including keyboard regression checks.
- Desktop/mobile captures: no browser errors; visual inspection completed.
- Independent read-only review: two keyboard findings fixed and regression-tested.

