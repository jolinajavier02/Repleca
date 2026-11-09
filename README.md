# Repleca Studio

A flat, illustrated creative workspace built with React, TypeScript, and Vite. The design uses warm paper surfaces, terracotta accents, sage and lavender palettes, and original SVG artwork.

## Local preview

```sh
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

Projects save to this browser's local storage when Save is clicked or the editor's back button is used. Download a `.repleca.json` project file to back it up or import it on another browser. Local media uploads support images, video, and audio up to 3 MB; available browser storage limits the total saved media.

Artwork downloads as SVG and scripts as plain text. Video/audio rendering and server authentication are not implemented by this redesign. The existing Cloudflare API files are retained; the new local workspace doesn't depend on them.

## Validation

```sh
npm run build
```

Desktop and mobile browser checks cover studio navigation, templates, uploads, text properties, undo/redo, splitting, playback, local save/reopen, project import/export, SVG export, and mobile drawers.
