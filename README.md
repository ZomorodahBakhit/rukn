# Rukn (رُكن)

> *Your cozy bilingual reading & journaling corner.*

A bilingual web application that unites three usually-separate activities — reading e-books, writing reflective notes linked to passages, and shaping an ambient workspace — into one quiet space. Built for CMPE 372 (User Interface Design, Final Project) at İstanbul Aydın University.

![screen — Maghrib dashboard](screenshots/dashboard.png)

## Features

- **Full sign-up / login / forgot-password flow** — atomic-transaction account creation, bcrypt password hashes, one-hour password-reset tokens.
- **High-fidelity glassmorphic UI** — 3,300-line design system, Desert Dusk palette, four selectable color themes, animated SVG scenes (Maghrib, Olive Grove, Library Hour), drifting dust motes, film-grain overlay.
- **Journal** with passage-linked + freeform entries, hashtag filtering, mood glyphs. Tags auto-clean when their last entry is deleted.
- **Library** with hand-drawn book covers (7 designs) + procedural fallback covers, search, filter, drag-and-drop **PDF/EPUB upload** (20 MB cap).
- **Reader** with chapter pagination through embedded public-domain text (Khalil Gibran's *The Prophet*, three chapters) **and inline PDF rendering** via PDF.js for uploaded books. Drag-select any passage → color popover → highlight saved to DB. Add a note → cross-links to a Journal entry.
- **Ambient audio** — procedural Web Audio synthesis for rain, fireplace, café, forest, lofi. Drop your own MP3 files into `RUKN/audio/` to override any sound with a real recording.
- **Focus timer** with 10 / 25 / 50 / 60-minute presets.
- **Settings** — palette, sound, volume, font, font-size, plan upgrade/downgrade, full account-data export as JSON, account deletion.
- **Bilingual EN ↔ AR** — language toggle persists per-account, flips `dir="rtl"` for Arabic-native typography (Amiri / Noto Kufi Arabic).
- **Full-stack persistence** — every action above is backed by a 15-table 3NF MySQL schema, accessed via PDO prepared statements.

## Stack

- **Frontend** — React 18 (via Babel-standalone, no build step), vanilla JSX served straight from disk, PDF.js, Web Audio API
- **Backend** — PHP 8 + PDO + MySQL/MariaDB, session cookies
- **Local dev** — XAMPP (Apache optional; PHP's built-in server is enough)
- **Auth** — bcrypt (`password_hash` / `password_verify`), one-time SHA-256 reset tokens

## Getting started

**Requirements:** XAMPP installed somewhere standard (`C:\xampp`, `C:\xampp1`, `D:\xampp`, etc.). That gives you PHP + MySQL.

1. Clone this repo.
2. Open **XAMPP Control Panel** → click **Start** next to **MySQL**.
3. Double-click `start.bat`.

The launcher auto-detects XAMPP, imports the schema if needed, starts a PHP server on `localhost:8000`, and opens the app in your default browser.

Stop everything with `stop.bat` (or `Ctrl+C` in the PHP terminal).

Full setup details with troubleshooting are in [`SETUP.md`](SETUP.md). The architectural map is in [`RUKN/STRUCTURE.md`](RUKN/STRUCTURE.md).

### Demo credentials

| Email | Password |
|---|---|
| `layla@example.com` | `rukn12345` |

Or click **Create account** on the login page for a fresh user.

## Project layout

```
.
├── start.bat / stop.bat            ← one-click launcher
├── RUKN/                            ← the running prototype
│   ├── *.html                       ← pages
│   ├── *.jsx                        ← React components (Babel-standalone)
│   ├── *.css                        ← design system
│   ├── api/                         ← PHP + MySQL backend (JSON API)
│   ├── audio/                       ← drop MP3s here (rain.mp3, fireplace.mp3, ...)
│   └── uploads/                     ← runtime upload destination (gitignored)
├── database/schema.sql              ← 15-table 3NF schema + seed data
├── docs/                            ← assignment reports
├── figma/                           ← Figma file URL
├── prototype/                       ← original JSX prototype (reference)
└── screenshots/                     ← high-res renders
```

## Database

```
users ── free_users / paid_users (ISA)
   │  ── user_preferences (1:1)
   │  ── password_resets (1:N, expiring tokens)
   │  ── journals (1:N) ── journal_entries (1:N) ── journal_entry_tags (M:N) ── tags
   │  ── reading_progress (1:N) ─┐
   │  ── highlights ─────────────┼── books
   │  ── bookmarks ──────────────┘
   └  ── collections (1:N) ── collection_books (M:N) ── books
```

Full schema with constraints, indexes, and seed inserts is in [`database/schema.sql`](database/schema.sql).

## License

Code in this repo is provided as a course submission. The high-fidelity React prototype originated from Anthropic's Claude Design tool (HTML/CSS/JSX) and was extended with a PHP+MySQL backend, real authentication, file upload, PDF rendering, and bilingual support. The Prophet text excerpts in `RUKN/reader.jsx` are public-domain.

## Author

**Zomorodah Bakhit** ([@ZomorodahBakhit](https://github.com/ZomorodahBakhit))
CMPE 372 — Section 02 (Computer Engineering) — Spring 2026
