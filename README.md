# AirGapped-Web

**Build connected knowledge without connectivity.**

AirGapped-Web is a tiny HTML/CSS/JavaScript app for browsing preserved website records entirely from local files. No server. No database. No internet. Just open a file.

> If information matters, you should be able to browse it without the Internet.

---

## What it does

- Preserves websites as local files you can keep forever
- Browses them through a clean, searchable interface
- Records metadata (websites, snapshots, pages, imports)
- Validates its own catalog every time you open it
- Runs from a `file://` path — no install, no build step

---

## Quick start

1. Download or clone the folder.
2. Double-click **`index.html`**.
3. That's it — you're running AirGapped-Web.

No installation. No server. No database. No internet.

> **Browser note:** Under `file://`, Chrome and Edge may block the embedded snapshot iframe. Firefox shows it inline, and the **Open Snapshot in Full Page** button works in every browser.

---

## A 60-second tour

| Page | What you'll see |
|------|-----------------|
| **Home** | Archive summary + live catalog validation |
| **Websites** | Every preserved website as a card |
| **Website** | One site's snapshots, pages, and imports |
| **Snapshot** | The actual preserved website, viewable inline |
| **Page** | A single preserved page + its metadata |
| **Search** | Instant local search across all metadata |
| **Imports** | A record of how each site entered the archive |
| **Site Map** | A flat index of everything in the archive |

---

## Where things live

```text
index.html      →  launch here
app/            →  the application (styles, code, pages)
archive/        →  your content (metadata + preserved sites)
docs/           →  the deeper docs
```

Want to add your own website? See **docs/import-workflow.md**.

Want to understand how it's built? See **docs/architecture.md**.

---

## Design goals

AirGapped-Web is meant to stay **offline, portable, auditable, human-readable, and dependency-free**. It deliberately avoids servers, databases, build tools, package managers, and cloud services — so an archive you make today still opens decades from now.

---

## Status

Experimental. The goal is simple, auditable, dependency-free offline browsing of preserved website records. Expect frequent iteration.