# CodeDrill

[简体中文](README.md) | English

[![Tests](https://github.com/anyuer678/codedrill/actions/workflows/test.yml/badge.svg)](https://github.com/anyuer678/codedrill/actions/workflows/test.yml)

> **Status**: `portfolio` · Offline programming training system · **Platform completeness varies** (local/Windows builds are primary)
> Known issues and scope are tracked in the rest of this README and in Issues; the training core (transcription / fill-in / bug-fix + SRS) runs locally.
> The online Pages preview has limited functionality (see note below).


[![GitHub Pages](https://img.shields.io/badge/%F0%9F%8C%90-Live_Preview-2ea44f)](https://anyuer678.github.io/codedrill/)
> ⚠️ **Limited online preview**: some interactions (offline training-data persistence, TTS speech synthesis, Android/iOS native features) are unavailable on GitHub Pages static hosting. Download the installer for the full experience.

**Offline programming training system** — final edition

Runs on Web, Windows, and Android. Build programming muscle memory through code transcription, fill-in-the-blank, and bug-fix exercises.

<p align="center"><img src="preview.png" alt="CodeDrill training UI preview" width="800"></p>


## Features

### Training modes
- **Code transcription** — copy code as shown to internalize syntax structure and style
- **Fill in the blank** — complete missing code fragments to strengthen recall
- **Bug fixing** — find and fix broken code to sharpen debugging skills

### Languages
Java, Python, C++, JavaScript, TypeScript, Linux Shell, SQL

### Training modules
Loops, conditionals, array operations, string processing, function calls

### UI & themes
- 22 light themes (solid / gradient / paper texture / ink-wash styles)
- Responsive design for desktop and mobile

### Learning system
- **Training history** — local localStorage: list / clear / export JSON (capped at 500 records, no cloud sync)
- **Achievements** — unlock achievements by hitting goals
- **Skill tree** — visual progress of skill mastery
- **Spaced repetition** — Ebbinghaus-curve-based smart review

## Quick start

### Requirements
- Node.js >= 18.0.0
- npm or yarn

### Install & run
```bash
# clone the project
git clone <repository-url>
cd codedrill

# install dependencies
npm install

# start the dev server
npm run dev
# or use the PowerShell script
.\start.ps1
```

Open http://localhost:3000 to view the app

## Building

### Interactive build
```bash
.\build.ps1    # interactively pick a build target
```

### CLI build
```bash
npm run build:www    # build the web version → dist/web/
npm run build:apk    # build the Android APK
npm run build:exe    # build the Windows portable EXE
npm run build:all    # build all platforms
```

### Build outputs
- **Web**: `dist/web/` — deployable to any static server
- **Windows**: `dist/electron-build/CodeDrill-便携版.exe` — no install needed, double-click to run
- **Android**: `android/app/build/outputs/apk/` — sign before installing

## Tech stack

| Layer | Technology |
|------|------|
| Frontend | Vue 3 |
| State | Pinia |
| Routing | Vue Router |
| Build | Vite |
| Desktop | Electron + electron-builder |
| Mobile | Capacitor (Android) |
| Testing | Vitest |

## Platform support

| Platform | Format | Status |
|------|------|------|
| Web | HTML/CSS/JS | ✅ Fully supported |
| Windows | EXE portable | ✅ Fully supported |
| Android | APK | ✅ Fully supported |

## Project structure

```
codedrill/
├── src/                    # Vue 3 frontend source
│   ├── views/              # page components (home, training, stats, etc.)
│   ├── stores/             # Pinia stores (questions, progress, settings)
│   ├── components/         # shared components (cards, buttons, dialogs, etc.)
│   ├── design-system/      # design system (themes, colors, fonts)
│   ├── router/             # route config
│   ├── data/               # static data
│   └── lib/                # utility functions
├── core/                   # question bank data
│   ├── questions/          # 635 built-in questions (35 JSON banks)
│   └── bosses/             # boss-level data
├── public/                 # static assets (theme art, icons)
├── electron/               # Electron main process
│   ├── main.js             # main process entry
│   └── preload.js          # preload script
├── android/                # Android project (Capacitor)
├── dist/                   # build output
│   ├── web/                # web build
│   └── electron-build/     # Windows build
├── scripts/                # helper scripts
├── docs/                   # project docs
├── index.html              # entry HTML
├── vite.config.js          # Vite config
├── electron-builder.config.mjs  # Electron packaging config
├── package.json            # project config
├── start.ps1               # dev startup script
└── build.ps1               # build script
```

## Development status

> **Training history (shipped)**: a **minimal stable storage** is live (localStorage + list/clear/export JSON) with unit tests.
> The **full UI/architecture "complete rewrite" is frozen** — out of scope; if it ever happens it will get a new Issue and does not block existing features.

### History capabilities & limits (honest statement)

| Capability | Status | Notes |
|------|------|------|
| List / filter / pagination | ✅ | `/history` page; filter by mode and language |
| Export JSON | ✅ | History or Settings page; includes schemaVersion and limits |
| Export CSV / full JSON backup | ✅ | Settings → "Data management" |
| Import JSON backup | ✅ | Settings page |
| Clear history / wipe all data | ✅ | History → "Clear history"; Settings → "Erase all data" |
| Persistence backend | localStorage | `codedrill_history` / `codedrill_stats`, capped at **500** records |
| Cloud sync / accounts | ❌ Not implemented | Data is lost if you switch browsers or clear site data; export backups yourself |
| IndexedDB / SQLite | ❌ Not implemented | Architecture frozen; no promises |
| Electron/Android native file storage | ❌ Not implemented | Currently shares WebView localStorage with Web |

## Platform completeness matrix (honest statement)

| Platform | Status | Training core | History | Notes |
|------|------|----------|----------|------|
| Web / local browser | Main path | ✅ | ✅ localStorage | Vite build; previewable on GitHub Pages, history follows browser storage |
| Windows (Electron) | Buildable | ✅ | ✅ same Web localStorage | `electron/` + `electron-builder`; portable; icon see Issue #3 |
| Android (Capacitor) | Skeleton/partial | ⚠️ verify locally | ⚠️ WebView localStorage | `android/` and Capacitor config exist; **no promise** of store-grade APK |
| iOS | Not promised | ❌ | ❌ | This README claims nothing for iOS |
| Cloud sync / multi-device | Not implemented | — | ❌ | No backend account system |

> Matrix principle: only claim what is reproducible locally/CI; avoid "✅ fully supported" style over-claiming.

## Known issues (tracked in Issues)

- Theme asset build parsing → Issue #2 (closed)
- Electron app icon → Issue #3 (closed)
- SRS/scoring core tests → Issue #4 (closed)
- History "complete rewrite" → **frozen**; current minimal stable storage above (scope & honesty tracked in Issue #1)


## Disclaimer

This project is for learning, exchange, and demonstration purposes only; it is not a commercial service and carries no technical guarantees. The software is provided "AS IS" with no express or implied warranties. Defects and issues found during use may be reported via [GitHub Issues](https://github.com/anyuer678/codedrill/issues), but the author accepts no liability for any loss arising directly or indirectly from using this software.

## License

Licensed under the [GNU General Public License v3.0](LICENSE).

### License highlights
- ✅ Free to use, modify, and distribute
- ⚠️ Derivative works must be licensed under the same license (GPL v3)
- ❌ Closed-source commercialization prohibited
