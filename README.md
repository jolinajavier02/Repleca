# Repleca Studio

A flat, illustrated creative workspace built with React, TypeScript, and Vite. The design uses warm paper surfaces, terracotta accents, sage and lavender palettes, and six distinct original SVG compositions.

## Local preview

```sh
# Node.js 24 or newer
npm install
npm run dev -- --host 127.0.0.1 --port 3000
```

Open http://localhost:3000/Repleca/. The configured base path is `/Repleca/`.

## Screens

- Landing page with studio tabs, workflow, and template previews.
- Workspace with searchable projects, templates, grid/list views, and project import.
- Shared video, design, slide, audio, and script editing layouts.
- Existing media library, brand kit, analytics, export, account, and settings screens with the updated visual theme.

The editor supports scene selection, splitting and duplication, editable text, color palettes, scale/opacity, aspect ratios, media uploads, playback preview, and undo/redo. On mobile, tool and property panels open as drawers.

## Project storage and export

Projects save to an account-specific list in this browser's local storage when Save is clicked or the editor's back button is used. Download a `.repleca.json` project file to back it up or import it on another browser. Local media uploads support images, video, and audio up to 3 MB; available browser storage limits the total saved media.

Artwork downloads as SVG and scripts as plain text. Video/audio rendering is not implemented. Local project storage is browser-based; signing in on another device does not synchronize those projects.

## Accounts

All workspace and editor routes require login. Creating an account returns to the login form with the email prefilled; signup does not create a session. A successful email/password login opens the requested editor (video by default).

In `npm run dev` and `npm run preview`, the Vite server runs the account API with a persistent SQLite database at `.repleca/auth.sqlite`. This directory is ignored by Git and blocked from browser asset requests. Passwords are stored as salted scrypt hashes. Sessions use opaque HttpOnly, SameSite cookies, with Secure enabled on HTTPS; session tokens are stored hashed on the server. Signup and login enforce server-side validation and rate limits. Logout revokes the session, and saved projects are scoped by account ID. The original unassigned `repleca-projects` browser data is retained but isn't automatically assigned to a new account.

For a live deployment, use the existing Cloudflare Pages Functions and D1 configuration; apply migrations before serving signups:

```sh
npx wrangler d1 migrations apply repleca-db --remote
```

`wrangler.toml` enables Node.js compatibility for the password hashing implementation. Build with `npm run build -- --base=/` for a Cloudflare root-domain deployment, then deploy `functions/` with the built frontend. The existing GitHub Pages deployment script only publishes static files and cannot run this login service. This task does not deploy or modify the remote database. Email verification, password recovery, and third-party sign-in are not included.

## Validation

```sh
npm run build
npm run test:auth
```

Desktop and mobile browser checks cover studio navigation, templates, uploads, text properties, undo/redo, splitting, playback, local save/reopen, project import/export, SVG export, and mobile drawers.

Account tests cover signup validation, duplicate emails, password verification, cookie sessions, session rotation/expiry, logout, CSRF rejection, throttling, and persistence. Browser verification covers signup → login → editor, protected deep links, incorrect passwords, mobile forms, account-specific project lists, and distinct display artwork.
