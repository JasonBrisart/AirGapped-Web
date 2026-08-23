# AirGapped-Web Import Workflow
There are now two ways to add a website to AirGapped-Web.

---
## Option A — Automatic (Archiver)
1. Open **Archiver** (`app/pages/archiver.html`).
2. Enter a start URL, a page limit, and whether to stay on the same domain.
3. Click **Start Crawl & Archive**. Captured pages are written into the offline database (browser localStorage) and appear instantly under Websites, Search, and the Snapshot Viewer.
4. If a public site is CORS-blocked, use **Manual Capture**: open the page in your browser, copy its source, paste it with the URL, and archive that single page.

Crawled sites can be removed from the Website page ("Delete This Crawled Site") or from the Archiver's "Stored Archives" list.

---
## Option B — Manual file-backed import
For permanent, file-backed archives that live in the repo itself:
1. Place preserved files under `archive/records/<site-id>/<date>/`.
2. Add website, snapshot, page, and import records to `archive/catalog/archive-data.js`.
3. Open `index.html` and confirm **Catalog status: Valid**.

### Catalog path rule
Stored paths are archive-relative and must begin with `records/`. Do not store `archive/...`, parent-directory traversal, absolute machine paths, or remote URLs.

### Record schema
- **website**: id, title, original_url, domain, description, tags, snapshot_ids
- **snapshot**: id, website_id, label, captured, root_path, description, page_ids
- **page**: id, website_id, snapshot_id, title, original_url, local_path, summary, captured, tags, text
- **import**: id, website_id, snapshot_id, label, imported, source_type, source_note, root_path, status

Crawler records additionally use `page.inline_html` (offline bytes) and an `inline` flag on snapshots/imports.
