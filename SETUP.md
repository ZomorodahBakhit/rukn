# Rukn — How to run this project

The interactive prototype lives in **`RUKN/`**. It's the React/JSX high-fidelity prototype, served straight from disk via Babel-standalone, talking to a PHP+MySQL backend that sits inside `RUKN/api/`.

## What you need

- **Windows** (the launcher is a `.bat` file)
- **XAMPP** installed at any of: `C:\xampp\`, `C:\xampp1\`, `D:\xampp\`, `C:\xampp7\`, `C:\xampp8\`, or `C:\Program Files\xampp\`. Grab it from <https://www.apachefriends.org/> if you don't already have it.

Nothing else. No Composer, no npm, no React build step — the prototype uses Babel standalone from a CDN.

## First-time setup

1. Unzip the project anywhere — Desktop, Documents, D:\projects, wherever.
2. Open the unzipped folder.
3. Double-click **`start.bat`**.

That's it. The script will:

1. Find your XAMPP install automatically.
2. Start MySQL if it isn't already running.
3. Create the `rukn` database and import `database/schema.sql` (only on first run).
4. Start a PHP server on `http://localhost:8000`.
5. Open the app in your default browser at **`http://localhost:8000/RUKN/Homepage.html`**.

A terminal window will stay open showing PHP server logs. **Keep it open while you use the app** — closing it stops the server.

## Logging in

The schema seeds one demo user:

- **Email:** `layla@example.com`
- **Password:** `rukn12345`

Or click **Create account** to register a fresh one. Username is derived automatically from your name — lowercase, underscores instead of spaces.

## Daily use (after first-time setup)

Just double-click `start.bat`. The schema import is skipped automatically. Browser opens. Ready to go.

## Stopping everything

Either:
- Press **Ctrl+C** in the PHP server window, **or**
- Double-click **`stop.bat`** (also shuts down MySQL).

## Project structure

```
Group02_RUKN_finalproject/
├── start.bat                 ← double-click to run
├── stop.bat
├── SETUP.md                  ← (this file)
├── BOOT.md                   ← detailed flows + troubleshooting
├── README.md                 ← submission overview
│
├── RUKN/                     ← the interactive prototype (THIS is what runs)
│   ├── Homepage.html         ← entry point — guest landing
│   ├── Login.html            ← log in / create account
│   ├── Dashboard.html        ← signed-in home, widgets, ambience
│   ├── Library.html          ← personal bookshelf
│   ├── Journal.html          ← reflections list + detail
│   ├── Settings.html         ← account, preferences, plan, data
│   ├── Reader.html           ← passage reader (Premium feature)
│   ├── styles.css            ← 3,300-line design system
│   ├── *.jsx                 ← React components (auth, dashboard, library, …)
│   └── api/                  ← PHP backend
│       ├── db.php            ← PDO connection to MySQL
│       ├── auth.php          ← me / register / login / logout (JSON)
│       ├── api.php           ← dashboard / library / journal /
│       │                       settings / upgrade / export / delete
│       └── client.js         ← tiny fetch wrapper, used by the JSX
│
├── database/schema.sql       ← MySQL 3NF schema + seed data
├── prototype/                ← earlier copy of the JSX (reference only)
├── docs/                     ← Assignment 2 + 3 reports
├── figma/                    ← Figma file URL
└── screenshots/              ← high-res renders of all 7 screens
```

The whole prototype is served from `RUKN/`. Apache or PHP's built-in server can be pointed at the project root — the launcher uses the built-in server on port 8000.

## What works end-to-end

| Flow | What persists in MySQL |
|---|---|
| **Register** new account | `users` + `free_users` + `user_preferences` + `journals` (atomic transaction) |
| **Log in** as existing user | session cookie set; `last_login` updated |
| **Log out** | session destroyed |
| **Save journal entry** from the Today's Journal widget | `journal_entries` + `tags` + `journal_entry_tags` (atomic) |
| **Change palette / sound / volume / font** in Settings → Save preferences | `user_preferences` row updated |
| **Upgrade to Premium** in Settings → Plan | row moved from `free_users` to `paid_users` |
| **Cancel subscription** | reverse — row moved back to `free_users` |
| **Export account data** | full JSON dump of every row tied to your user |
| **Delete account** | `DELETE FROM users` cascades to every dependent table |

## Troubleshooting

| Error | What to do |
|---|---|
| `Could not find XAMPP on this machine` | Install XAMPP from <https://www.apachefriends.org/> and rerun. |
| `MySQL did not come online within 15 seconds` | Open the XAMPP Control Panel (`xampp-control.exe`) and click **Start** next to MySQL. Then rerun. |
| `Port 8000 is in use` | Something else is on port 8000 (another XAMPP, IIS, Skype). Edit the last line of `start.bat` to use port 8080, then visit `http://localhost:8080/RUKN/Homepage.html`. |
| Login as Layla fails | The schema may have been imported before the password fix. Drop the DB in phpMyAdmin (`DROP DATABASE rukn;`) and rerun `start.bat`. |
| `Access denied for user 'root'` | Your XAMPP root user has a password. Edit `RUKN/api/db.php` line 13 (`$pass = '';`) and set it. |
| Page loads but spins forever on Dashboard | Check DevTools → Network. Failing call to `api/api.php?action=dashboard` will have its error in the JSON body. |

## Note on the visual prototype

The HTML/CSS/JSX in `RUKN/` is the original Claude Design high-fidelity prototype — Desert Dusk palette, Cormorant Garamond display type, glassmorphic surfaces, drifting motes, animated scenes. It hasn't been visually changed. What's been added is:

- `RUKN/api/` — the PHP+MySQL backend
- `RUKN/api/client.js` — a tiny fetch wrapper exposed as `window.RuknAPI`
- Minimal patches in `auth.jsx`, `dashboard-widgets.jsx`, `settings.jsx` to wire real fetch() calls to those endpoints

The visual fidelity is preserved.
