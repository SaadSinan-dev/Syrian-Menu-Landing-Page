# SYRIAN MENU website

A standalone marketing website with a working bilingual digital restaurant menu, built with React 19, TypeScript, Vite and plain CSS.

## Run locally

Use Node.js 24 or newer (tested with 24.19.0).

```powershell
cd C:\Users\saads\Desktop\syrian-menu-website
npm install
npm run dev -- --port 5180
```

Open http://localhost:5180. Select **Try the Experience** to open the demo directly at `/#demo`.

## Build and deploy

```powershell
npm run build
npm run preview -- --port 5180
```

Upload the contents of `dist/` to a static host at the domain root. Hash routing means the demo does not need server rewrites. The pages and demo remain self-contained; the trial application form requires the existing SYRIAN MENU API and its Support migration. See [trial integration](docs/trial-integration.md). No credentials belong in this frontend.

Vercel settings for this repository are pinned in `vercel.json`: Vite, `npm ci`, `npm run build`, `dist`, Node.js 24. The company website repository is `SaadSinan-dev/Syrian-Menu-Landing-Page`; its production branch is `main`. Cloud connection and verification details are recorded in [docs/vercel-deployment.md](docs/vercel-deployment.md). The local configuration does not establish or prove the GitHub integration by itself.

The QR codes are generated locally from the current website URL and point to its demo. On a public deployment they use the public URL automatically. A QR generated while using localhost points to localhost and is only usable on that computer. No analytics are used. Trial applications are sent to the configured API only when submitted.

## WhatsApp configuration

Edit **`src/config/contact.ts`**. The single `contact.whatsapp` setting controls the whole section:

| Mode | Behavior |
| --- | --- |
| `'placeholder'` | Shows `+963 9XX XXX XXX` clearly marked as temporary. Never creates a chat link. |
| `'coming-soon'` | Shows “WhatsApp contact coming soon” without displaying a number. |
| `'hidden'` | Hides the complete WhatsApp section. |
| `'live'` | Opens a chat only when `number` is a valid international number. |

After purchasing the official number, replace `number` with the full number starting with `+` and country code, set `mode: 'live'`, and review the professional prefilled `message`. Spaces, parentheses and hyphens are accepted; placeholder letters and invalid lengths are rejected. The application validates formatting, not ownership, so only configure the company's confirmed number.

Official email and Instagram are centralized in the same file.

## Main files

| File | Purpose |
| --- | --- |
| `src/App.tsx` | Landing-page sections, mobile navigation and demo route. |
| `src/App.css`, `src/base.css` | Responsive layouts, brand tokens and local fonts. |
| `src/components/MenuExperience.tsx`, `menu.css` | Shared interactive menu for the hero and full demo. |
| `src/data/menu.ts` | Fictional bilingual dishes, categories, size prices and filtering. |
| `src/config/contact.ts` | Official contacts and WhatsApp launch settings. |

`PhoneFrame.tsx` is an HTML/CSS phone, and `QR.tsx` creates actual scannable QR codes without a remote service. Dar Al Yasmin and the menu prices are illustrative. The demo supports browsing, filtering, search, dish details, size selection and language switching. It does not place orders.

## Verification

```powershell
npm test
npm run lint
npm run build
npx playwright install chromium
npm run test:e2e
```

The nine unit tests cover safe contact configuration, bilingual filtering, size prices, Arabic numerals, preference defaults and complete matching translation dictionaries. The 33 Chromium tests cover original menu behavior, all four language/theme combinations, persistent preferences, Arabic/light defaults before React, unavailable storage, stable cloud targets, focus, reduced motion and layouts at 320, 390, 768 and 1440 pixels.

## Language, themes and motion

Use the navbar language and sun/moon controls. Preferences apply to the whole website and menu demo and persist between visits. First-time visitors get Arabic and white/light mode regardless of device preference; explicit saved language and theme choices take priority. The small script in `index.html` applies the theme and direction before the application loads. Blocked localStorage gracefully falls back to preferences for the current visit.

- Copy is centralized in `src/i18n/messages.ts`; English and Arabic have matching typed dictionaries. Dish data remains in `src/data/menu.ts`. Arabic uses the locally hosted Cairo font, logical layouts and mirrored directional icons.
- Semantic light/dark palettes are in `src/tokens.css`. Shared preferences live under `src/preferences/`, and `src/preferences.css` handles the controls and direction-specific presentation.
- The cloud CTA opens the existing `#demo` route. Only its SVG artwork moves; the clickable link stays fixed. Hover and keyboard focus pause the drift.
- `src/motion.css` coordinates the hero sequence, varied scroll reveals, button/image feedback, and menu transitions. `src/motion/useReveals.ts` uses a single observer and reveals each element once. Motion uses CSS transforms/opacity; no animation dependency was added.
- Reduced-motion preferences disable entrances, drifting and transitions, and leave all content visible and all controls usable. No animation delays interaction.

With the server on port 5180, `node scripts/capture-upgrade.mjs` captures desktop and mobile previews of both themes and languages in `artifacts/upgrade/`. The original capture script remains available. Arabic WhatsApp prefill copy is in the translation dictionary; English continues to use the central contact configuration.

With the development server running on port 5180, `node scripts/capture.mjs` saves desktop, mobile and dish-detail previews in `artifacts/`.

## Product references and assets

The original application in `../syrian-menu` was inspected, including its public `MenuExperience`, `MenuRenderer`, `MenuSpotlight`, image treatment, dish details, Arabic/English language conventions and branding. This site adapts those conventions into local components without importing its router, authentication or database code. The trial form calls a small backend Support extension; it requires no changes to the Admin, Dashboard or Public Menu interfaces.

Logo, food images and fonts were copied from that project's `apps/menu/public/` assets. The WebP images were optimized; dish cards use dedicated 480-pixel thumbnails. Brand assets remain separate from the fictional restaurant identity. Everything needed at runtime is included under `public/`; no third-party image or font hosts are needed.

## Website contact delivery

The Contact form posts to the existing product API at `/api/v1/public/contact-messages`, using the same `VITE_API_URL` configuration as trial applications. Fields are name, email, optional phone, subject and message. Success requires a confirmed committed response; errors preserve input and reuse the submission ID for a retry. Personal information is not stored in localStorage.

The product backend requires the reviewed `202610180001_website_contact_messages` migration. Admin Support has website-message filters, sender details and audited New/In progress/Resolved/Spam statuses. Admin notes are internal, not email replies. Deploy the API/schema and confirm the website origin is allowed before announcing availability. This standalone site is separate from the three product Pages targets.

Verification: build/typecheck, lint, nine unit tests and 33 browser tests passed on 2026-10-18, including real delivery and Admin status persistence on an isolated local database. `tests/contact.spec.ts` uses `TRIAL_RUNTIME_FILE` for the owned local API/Admin fixture; it never substitutes fake success for the real-delivery test.
