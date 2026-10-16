# Company website deployment

This configuration applies only to `SaadSinan-dev/Syrian-Menu-Landing-Page`, the standalone company marketing website. The other SYRIAN MENU repository and its Cloudflare/API workflows are separate and must not be changed.

## Required Vercel project settings

| Setting | Value |
| --- | --- |
| Git provider | Official Vercel GitHub integration |
| Repository | `SaadSinan-dev/Syrian-Menu-Landing-Page` |
| Production branch | `main` |
| Root Directory | Repository root (`.`; blank/default in Vercel) |
| Framework | Vite |
| Node.js | 24.x |
| Install | `npm ci` |
| Build | `npm run build` |
| Output | `dist` |
| Environment variables | None required |
| Preview branches and pull requests | Enabled |
| Ignored Build Step | None |

`vercel.json` pins the framework/build settings and enables Git deployments for all branches. The connected project determines which branch is Production; other eligible Git pushes produce Previews. No GitHub Actions publishing workflow or deploy hook is required.

The interactive menu uses `#demo`, so no server rewrite is necessary. Images, fonts, translations, themes and demo data are local; the website has no API or database dependency.

## Verification record

Cloud project identity, final URL, deployment ID and source commit will be recorded after an authenticated Git integration deployment reaches READY and the live site has been tested. Configuration alone is not proof that automatic deployments work.
