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

Upload the contents of `dist/` to a static host at the domain root. Hash routing means the demo does not need server rewrites. No database, environment variables, authentication or API is required.

The QR codes are generated locally from the current website URL and point to its demo. On a public deployment they use the public URL automatically. A QR generated while using localhost points to localhost and is only usable on that computer. No analytics or external requests are made by the application itself.

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

The six unit tests cover safe contact configuration, combined bilingual filtering, size prices and Arabic numeral formatting. The eight Chromium tests exercise navigation, menu controls, history, focus, safe contacts, reduced motion and layouts at 320, 390, 768 and 1440 pixels.

With the development server running on port 5180, `node scripts/capture.mjs` saves desktop, mobile and dish-detail previews in `artifacts/`.

## Product references and assets

The original application in `../syrian-menu` was inspected, including its public `MenuExperience`, `MenuRenderer`, `MenuSpotlight`, image treatment, dish details, Arabic/English language conventions and branding. This site adapts those conventions into local components without importing its API, router, authentication or database code. The existing Admin, Dashboard, Menu and API applications were not changed.

Logo, food images and fonts were copied from that project's `apps/menu/public/` assets. The WebP images were optimized; dish cards use dedicated 480-pixel thumbnails. Brand assets remain separate from the fictional restaurant identity. Everything needed at runtime is included under `public/`; no third-party image or font hosts are needed.


