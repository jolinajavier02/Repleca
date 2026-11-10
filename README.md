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
- Video, design, slides, printing, photo editing, documents, Excel-compatible spreadsheets, and websites. Audio, Script/Transcript, and Social are removed from workspace creation choices; saved legacy projects are retained.
- A file-first Media library, account menu inside the sidebar creative-space card, exports, and settings. Analytics and Brand Kit are removed from navigation.

The editor supports scene selection, splitting and duplication, editable text, color palettes, scale/opacity, aspect ratios, media uploads, playback preview, and undo/redo. On mobile, tool and property panels open as drawers.

## Project storage and export

All new projects and template drafts appear in Projects. Projects save to an account-specific list in this browser's local storage, with automatic saving, manual Save, and saving on editor exit. Download a `.repleca.json` project file to back it up or import it on another browser. Imported photos, videos, audio, documents, and other files are stored as Blobs in account-scoped IndexedDB. Uploads from both Media and the editors appear in Media. Browser storage availability limits the total saved media. Library-backed files are referenced by ID; temporary preview URLs are never persisted, and project downloads embed their referenced media.

Artwork downloads as SVG and scripts as plain text. Video/audio rendering is not implemented. Local project storage is browser-based; signing in on another device does not synchronize those projects.

## Accounts

Open Studio opens a public workspace preview. Visitors can browse the screen; workspace action buttons show a reminder to log in or create an account. Editor and private workspace routes still require authentication. Creating an account returns to the login form with the email prefilled; signup does not create a session. A successful email/password login always opens the signed-in workspace. Passwords require at least 6 characters on both the signup form and server.

New Project opens a setup dialog for the project name, type, and canvas format. Creating it immediately saves the project to the signed-in account’s local list and opens its editor using the saved ID. Cancel leaves the list unchanged. The creation shortcuts use the same flow. The workspace has no top header or website-back link. The creative-space card opens the account dropdown; Sign out revokes the session and returns to the landing page. The sidebar logo goes to the workspace.

In `npm run dev` and `npm run preview`, the Vite server runs the account API with a persistent SQLite database at `.repleca/auth.sqlite`. This directory is ignored by Git and blocked from browser asset requests. Passwords are stored as salted scrypt hashes. Sessions use opaque HttpOnly, SameSite cookies, with Secure enabled on HTTPS; session tokens are stored hashed on the server. Signup and login enforce server-side validation and rate limits. Logout revokes the session, and saved projects are scoped by account ID. The original unassigned `repleca-projects` browser data is retained but isn't automatically assigned to a new account.

For a live deployment, use the existing Cloudflare Pages Functions and D1 configuration; apply migrations before serving signups:

```sh
npx wrangler d1 migrations apply repleca-db --remote
```

`wrangler.toml` enables Node.js compatibility for the password hashing implementation. Build with `npm run build -- --base=/` for a Cloudflare root-domain deployment, then deploy `functions/` with the built frontend. The existing GitHub Pages deployment script only publishes static files and cannot run this login service. This task does not deploy or modify the remote database. Email verification, password recovery, and third-party sign-in are not included.

## Validation

```sh
npm run build
npm test
```

Desktop and mobile browser checks cover studio navigation, templates, uploads, text properties, undo/redo, splitting, playback, local save/reopen, project import/export, SVG export, and mobile drawers.

Account tests cover signup validation, duplicate emails, password verification, cookie sessions, session rotation/expiry, logout, CSRF rejection, throttling, and persistence. Browser verification covers guest workspace actions and login reminders, signup → login → workspace, project creation and reopening, protected deep links, incorrect passwords, mobile forms, account-specific project lists, and distinct display artwork.

## Media and the added studios

Media defaults to a flat file grid with no sample folders. It supports multi-file upload and drag/drop, name/type search, file-type filters, newest/oldest/name/size/type sorting, and grid/list views. Per-file options offer preview, supported-file editing, rename, copy, move, download, and confirmed deletion. Create folders only when needed and use the folder filter to organize files; removing a folder keeps its files. A legacy project’s embedded media is migrated into the library without duplicating it on refresh. Deleting a referenced file keeps the project and asks for replacement media.

Printing uses the visual editor with browser printing. Photo editing uses the visual canvas and imported images. Documents support text editing, import/export, and browser printing. Excel is an editable CSV-compatible grid with SUM/AVERAGE range formulas, up to 500 rows and 50 columns; XLSX import/export is not implemented. Website supports HTML/CSS editing, an isolated live preview, and HTML export; hosting is separate. The original imported files remain in Media when an edited project is created.

Project options support opening, renaming, copying, exporting with assets, and deleting saved projects. Projects and files stay in this browser; account login does not provide cross-device storage synchronization.

## Category templates and sizes

The workspace now shares one category-aware template catalog across Templates, New Project, and the editors. Every offered format has a matching original template. The browser can filter by category, type/platform, and exact size. Choosing a template creates real editable content, not a preview-only card.

- Video: TikTok, Facebook feed/square/Reels, Instagram feed/Stories/Reels, YouTube landscape/Shorts, and X/Twitter. Presets include 1080 × 1920, 1080 × 1350, 1080 × 1080, and 1920 × 1080. Original multi-scene starters suggest a hook, main story, and closing prompt for the user's own footage.
- Design: geometric logos, wordmarks, art prints, frames, invitations, business cards, and greeting cards. Templates use actual vector layouts with editable text.
- Slides: business pitch decks, classroom lessons, project reports, and portrait stories, with coordinated, individually editable slides in widescreen, standard, or portrait formats.
- Printing: A4/Letter flyers, 12 × 18-inch posters, and 3.5 × 2-inch business cards. Print canvas pixel sizes use a 300-pixels-per-inch design convention; browser printing uses the selected paper format.
- Photo editing: square, portrait, landscape, 4 × 6-inch print, and vertical-story layouts. Applying a photo template preserves the uploaded image; mat templates add editable-layout borders.
- Documents: A4/Letter resumes, reports, letters, and a Legal-paper affidavit drafting outline. The affidavit is a general placeholder outline, not a jurisdiction-specific filing form; it includes a visible reminder to verify local wording and witnessing/notarization requirements.
- Excel: budget, invoice, inventory, and project-tracker worksheets in A4 portrait/landscape or Letter layouts, with prefilled headers and starter formulas.
- Website: desktop portfolio/business pages and a mobile profile page, with HTML/CSS content and a preview rendered at the selected viewport dimensions.

Format identity, width, height, and template metadata persist with projects. Visual exports use the selected pixel dimensions. Paper formats affect document/worksheet printing. CSV and plain-text downloads do not carry page-layout metadata. Editor template changes can be undone. These are creative canvas presets, not a validation guarantee for platform uploads; video encoding/rendering remains outside this local workspace.

Platform reference checks: [YouTube resolution guidance](https://support.google.com/youtube/answer/6375112) and [TikTok vertical-video guidance](https://ads.us.tiktok.com/resources/help/article/tiktok-ads-policy-ad-format-and-functionality). Meta's live Ads Guide required login during verification, so no current codec/duration or ad-acceptance claims are made. The affidavit outline is original, generic draft content rather than a reproduced official court form.
