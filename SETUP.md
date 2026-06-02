# Rukn — Setup Guide

This document covers two ways to run Rukn on your machine. The fast path uses our one-click launcher; the alternative is the traditional XAMPP / Apache / htdocs setup that you may already know.

---

## What you'll need either way

- **Windows 10 or 11**
- **XAMPP** with PHP 8 + MySQL/MariaDB (the default XAMPP bundle is fine).
  Install from <https://www.apachefriends.org/>. Common install paths the launcher detects: `C:\xampp\`, `C:\xampp1\`, `C:\xampp7\`, `C:\xampp8\`, `D:\xampp\`, `C:\Program Files\xampp\`.
- **A web browser** (Chrome, Edge, or Firefox — anything modern)

No Composer, no npm, no PHP version manager, no Node, no build step.

---

# Path A — One-click launch (recommended)

The simplest way. PHP's built-in server runs the app; you don't touch Apache or htdocs at all.

### First-time setup

1. **Unzip / clone the project** anywhere you like — Desktop, Documents, D:\projects, wherever has space.
2. **Open the unzipped folder**.
3. **Double-click `start.bat`**.

That single click will:

| Step | What `start.bat` does |
|---|---|
| 1 | Auto-detect your XAMPP install (checks the common paths) |
| 2 | Start MySQL in a minimized window if it isn't already running (waits up to 15 s for it to come online) |
| 3 | Import `database/schema.sql` into a fresh `rukn` database **only if the database doesn't already exist** (so daily runs skip this) |
| 4 | Start PHP's built-in web server on `http://localhost:8000` from the project root |
| 5 | Open your default browser at **`http://localhost:8000/RUKN/Homepage.html`** |

You'll see a PHP server log window. **Keep that window open while you use the app** — closing it stops the server.

### Logging in

The schema seeds one demo user so the app has data on day one:

| Email | Password |
|---|---|
| `layla@example.com` | `rukn12345` |

Or click **Create account** to register a fresh one.

### Daily use (after that first run)

Just double-click `start.bat`. The schema import is skipped automatically. Browser opens. Ready.

### Stopping

- Press **`Ctrl + C`** in the PHP server window, **or**
- Double-click **`stop.bat`** (also shuts down MySQL).

---

# Path B — Traditional XAMPP + Apache + htdocs

For graders or developers who'd rather serve the app through Apache the classic way. Slightly more steps, but you get everything that comes with Apache (`.htaccess`, virtual hosts, etc.).

### Step 1 — Start XAMPP services

Open the XAMPP Control Panel (`xampp-control.exe`) and click **Start** next to:

- **Apache** — serves the frontend HTML + the PHP backend
- **MySQL** — serves the `rukn` database

Wait for both to turn green.

### Step 2 — Place the project under `htdocs`

Apache by default serves files from `C:\xampp\htdocs\` (or wherever your XAMPP lives — substitute that path everywhere below).

You have two options:

**Option B1 — Copy the project**

Simplest. Copy the entire unzipped project folder into htdocs:

```powershell
Copy-Item -Path "<wherever you unzipped>\Group02_RUKN_CMPE372_CE_Final_Project" `
          -Destination "C:\xampp\htdocs\rukn" `
          -Recurse
```

You now have `C:\xampp\htdocs\rukn\RUKN\Homepage.html`, etc.

> **Note:** the htdocs and source-edit folders are now separate copies. If you edit a file in your source folder, you'll need to re-copy it for Apache to see the change. Use option B2 if you want a single source of truth.

**Option B2 — Symlink / junction (edit-in-place)**

This makes htdocs/rukn a *link* to your project folder, so edits in the project folder show up immediately. Run **as administrator** (right-click PowerShell → Run as administrator):

```powershell
New-Item -ItemType Junction `
         -Path "C:\xampp\htdocs\rukn" `
         -Target "<full path to your project folder>"
```

The junction doesn't need admin if you're on the same drive, but it never hurts.

### Step 3 — Import the database

Open **phpMyAdmin** at <http://localhost/phpmyadmin>.

1. Click **Import** in the top tab bar.
2. Choose file → `database/schema.sql` from your project folder.
3. Scroll down → **Import**.

This creates the `rukn` database, all 15 tables, and the seed data (Layla user, three books, two journal entries, four tags).

Alternatively, from the terminal:

```powershell
& "C:\xampp\mysql\bin\mysql.exe" -u root < "<full path>\database\schema.sql"
```

### Step 4 — Open the app

Visit <http://localhost/rukn/RUKN/Homepage.html>.

Sign in with `layla@example.com` / `rukn12345` or create a new account.

### Step 5 — Stopping

- Open the XAMPP Control Panel and click **Stop** next to Apache and MySQL, **or**
- Run `stop.bat` from the project folder (auto-detects XAMPP and stops both)

---

## Troubleshooting

| Symptom | What to do |
|---|---|
| `Could not find XAMPP on this machine` | Install XAMPP from <https://www.apachefriends.org/> and re-run `start.bat`. |
| `MySQL did not come online within 15 seconds` | Open the XAMPP Control Panel and click **Start** next to MySQL. Then re-run. |
| `Port 8000 is in use` (Path A) | Edit the last line of `start.bat` and change `-S localhost:8000` to `-S localhost:8080`, then open `http://localhost:8080/RUKN/Homepage.html` instead. |
| `Port 80 is in use` (Path B) | Skype/IIS/another Apache is holding it. Open XAMPP Control Panel → Apache → **Config → httpd.conf** → change `Listen 80` to `Listen 8080`. Then visit `http://localhost:8080/rukn/RUKN/Homepage.html`. |
| Login as Layla fails with "incorrect password" | The schema may have been imported from an older copy. Drop the DB in phpMyAdmin (`DROP DATABASE rukn;`) and re-import. |
| `Database error: Access denied for user 'root'` | Your XAMPP root user has a password. Edit `RUKN/api/db.php` line 13 (`$pass = '';`) and put your password there. |
| Pages load but spin forever | Check DevTools → Network → click the failing `api.php` request → look at the JSON body for the error message (we surface PDO errors verbatim). |
| Highlights don't save | You're not logged in. The auto-guard should bounce you to Login.html — if it doesn't, hard-refresh and try again. |

---

## What's in the package

```
Group02_RUKN_CMPE372_CE_Final_Project/
├── start.bat / stop.bat              ← one-click launcher (Path A)
├── README.md                         ← project overview
├── SETUP.md                          ← (this file)
│
├── RUKN/                             ← the interactive prototype
│   ├── Homepage.html                 ← public landing
│   ├── Login.html                    ← log in / create account
│   ├── Forgot.html / Reset.html      ← password reset flow
│   ├── Dashboard.html                ← signed-in home
│   ├── Library.html                  ← book grid
│   ├── Journal.html                  ← reflections list + detail
│   ├── Reader.html                   ← passage view with highlights
│   ├── Settings.html                 ← account, preferences, plan, export
│   ├── styles.css                    ← 3,300-line design system
│   ├── *.jsx                         ← React components (Babel-standalone)
│   ├── api/                          ← PHP+MySQL backend (JSON API)
│   ├── audio/                        ← optional MP3 drop folder
│   └── uploads/                      ← (gitignored runtime folder)
│
├── database/schema.sql               ← 15-table 3NF schema + seed data
├── docs/                             ← Assignment 2 + 3 reports (md + pdf)
├── figma/                            ← Figma file URL
├── screenshots/                      ← high-res renders of all 7 screens
├── Group02_CMPE_FinalProject.md      ← the final-submission report
├── Group02_RUKN_Assignment3.md/.pdf  ← Assignment 3 (already submitted)
└── RUKN_Presentation.pptx            ← demo slides
```

For an architectural map of the JSX components + which PHP endpoint backs each UI action, see [`RUKN/STRUCTURE.md`](RUKN/STRUCTURE.md).

---

## Demo script (90-second tour)

1. **`start.bat`** → browser opens at Homepage.
2. Click **Begin** → register account → land on the Dashboard with the warm Maghrib scene and three glass widgets.
3. Click a sound chip in the dock — real audio plays (procedural by default; drop an `.mp3` into `RUKN/audio/` to override).
4. Type something into the "Today's journal" widget, pick a mood, add a tag, **Save entry** → row goes into `journal_entries`.
5. Sidebar → **Library** → click a book → Reader opens to *The Prophet*, "On Love".
6. Drag-select any phrase → amber/rose/olive/sky popover appears → click a color → toast confirms → check phpMyAdmin: row appears in `highlights`.
7. Drag-select again → **Add note** → write a reflection → Save → cross-creates a journal entry AND a highlight.
8. Sidebar → **Journal** → your saved entry is on the left with the passage cited.
9. Sidebar → **Settings** → change the palette → instantly updates everywhere → **Log out** → back at Homepage.
10. **`stop.bat`** when done.

---

## License

Course-submission code. The Claude Design React/JSX prototype originated from Anthropic's design tool; the PHP+MySQL backend, real authentication, schema, file plumbing, and bilingual scaffolding were authored by the student. *The Prophet* excerpts in `RUKN/reader.jsx` are public domain.
