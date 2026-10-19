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
| Environment variables | Optional `VITE_API_URL` override for both forms; defaults to `https://syrian-menu-api.onrender.com/api/v1` |
| Preview branches and pull requests | Enabled |
| Ignored Build Step | None |

`vercel.json` pins the framework/build settings and enables Git deployments for all branches. The connected project determines which branch is Production; other eligible Git pushes produce Previews. No GitHub Actions publishing workflow or deploy hook is required.

The interactive menu uses `#demo`, so it needs no server rewrite. Both forms use the existing product API. Production builds default to `https://syrian-menu-api.onrender.com/api/v1` and reject relative `/api/v1`, HTTP, credentials, and malformed API overrides: a plain static host does not supply the development proxy. Remove any old Vercel `VITE_API_URL=/api/v1` override before rebuilding.

The API's `CORS_ORIGINS` must include the exact origin `https://syrianmenu.vercel.app`, preserving the existing Admin, Dashboard and Menu entries. The product's existing environment-generation paths now include this origin. Apply that environment configuration and deploy the website through the normal release workflow; local source changes do not update either hosted service. Preview/custom domains need their own exact allowed origin. Do not allow wildcard Vercel origins.

## Verification record

Cloud project identity, final URL, deployment ID and source commit will be recorded after an authenticated Git integration deployment reaches READY and the live site has been tested. Configuration alone is not proof that automatic deployments work.
