# Changelog
All notable changes to AirGapped-Web are documented here.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

---
## [0.4.0] - 2026-08-23
A large release that turns AirGapped-Web from a passive, file-backed viewer
(0.3.1) into an active offline web archiver: it can crawl a live site, inline
its assets, store everything in an offline database, browse it with no internet,
and export a crawled site back out to real repository files. Everything below
landed in this single 0.4.0 cycle on top of 0.3.1.

### Added — Website Archiver (offline crawler)
- **New module `app/modules/archiver.js` and page `app/pages/archiver.html`.**
  An in-browser crawler that captures a website into the offline database —
  conceptually an offline-first Wayback Machine.
  - Breadth-first crawl using the browser's built-in `fetch` + `DOMParser`
    (zero dependencies). Follows same-domain links from each captured page.
  - Configurable **maximum page count (1–100)** and a **"stay on the same
    domain"** toggle.
  - Extracts **title**, **meta description**, **visible text** (for search),
    and **outbound links** (for the crawl frontier) from every page.
  - **Live crawl log** panel that streams each fetch, capture, link count,
    asset-inlining result, and any CORS/skip messages.
  - **Manual Capture fallback** for CORS-blocked public sites: paste a page URL
    and its HTML source and archive that single page offline.
  - **Stored Archives manager**: list every crawled site with page counts, and
    Open / Export / Delete / Clear-all controls.

- **Base64 asset inlining (offline rendering fidelity).**
  - New **"Inline images & CSS as base64"** option (on by default).
  - During capture, `<img src>` assets are fetched and rewritten as `data:` URIs
    via `FileReader`, and `<link rel="stylesheet">` files are fetched and inlined
    as `<style>` blocks, so captured pages **look right offline**, not just read
    as text.
  - Inlining is best-effort and CORS-aware: assets that can't be fetched are
    skipped and counted in the log rather than breaking the capture.

- **Export a crawled site back to real repository files.**
  - New **"Export to Files (.zip)"** action on both the Archiver's Stored
    Archives list and the Website detail page.
  - Produces a downloadable `.zip` containing `records/<site>/<date>/*.html`
    (rebuilt from the captured HTML) plus a `catalog-snippet.js` with the
    website/snapshot/page/import objects (in **file-backed form**, without the
    inline HTML) ready to paste into `archive/catalog/archive-data.js`, and a
    `README-EXPORT.txt` with step-by-step instructions.
  - This bridges the automatic overlay database and the permanent, file-backed
    manual import workflow.

- **New module `app/modules/zip.js`** — a tiny, dependency-free ZIP writer
  (STORE method, CRC-32, UTF-8 filenames, correct local + central directory
  records and EOCD) used to build the export download entirely in the browser.

- **Offline database overlay in `core.js`.**
  - Crawled sites are persisted to browser `localStorage` under
    `agw_archive_overlay_v1` and **merged** into `core.getData()`, so they
    appear immediately under Websites, Search, and the Snapshot Viewer with no
    file editing and no page reload logic elsewhere.
  - New storage API: `readOverlay()`, `saveArchivedSite()` (quota-safe, returns
    success), `deleteArchivedWebsite()`, `clearOverlay()`, `isArchivedWebsite()`.

- **Inline content rendering across viewers.**
  - `snapshot-viewer.js` now prefers a captured inline home page and renders it
    with `<iframe srcdoc>`; it falls back to the original local-file iframe for
    file-backed snapshots.
  - `page-detail.js` renders a page's captured `inline_html` the same way when
    present.
  - Both inline frames use a locked-down sandbox (**no** `allow-scripts`, **no**
    `allow-same-origin`) so archived pages can't execute scripts or reach the
    host app.

### Changed
- **`core.getData()`** merges the base file catalog (`window.AGW_DATA`) with the
  localStorage overlay database on every read.
- **`validateData()`** now understands inline records: a page is valid if it has
  `inline_html` **or** a safe `local_path`; crawler snapshots/imports carry an
  `inline` flag that suppresses the "invalid local root path" warning (they are
  database-backed, not file-backed).
- **New `core.pageHasContent()`** helper centralizes the "is this page
  renderable?" check.
- **Navigation** — an **Archiver** link was added to the nav bar on every page
  and on `index.html`, plus a Start-Here entry on the home page. Imports and
  Site Map now reference the Archiver.
- **`website-list.js` / `website-detail.js`** — crawled sites show a
  **"crawled"** badge; the detail page gains **Export to Files** and
  **Delete This Crawled Site** actions.
- **`import-registry.js`** — the Import Workflow panel now documents both the
  automatic (Archiver) and manual (file-backed) paths.
- **Catalog version** bumped from `0.3.1` to `0.4.0` in
  `archive/catalog/archive-data.js`, with an updated archive description.
- **Docs rewritten** — `README.md`, `docs/architecture.md`, and
  `docs/import-workflow.md` now cover the Archiver, the overlay database,
  inline assets, export, and the honest browser limits.

### Fixed
- **Duplicate page filenames.** `buildBundle()` now de-duplicates generated
  page filenames (e.g. two pages with the same title no longer collide on
  `index.html` / `<title>.html`); each gets a unique `-N` suffix.
- **Silent storage failures.** `saveArchivedSite()`/`writeOverlay()` now catch
  `localStorage` quota (and other write) errors and return a success flag; the
  Archiver reports "storage quota exceeded" and suggests fewer pages or turning
  off image inlining, instead of failing silently.
- **Home-page selection for snapshots.** The Snapshot Viewer now explicitly
  picks the first inline page as the offline home view rather than relying on a
  file-path heuristic that never matched crawled records.
- **Page-record links in the Snapshot Viewer** no longer render a broken
  "Open Preserved File" link for inline (database-backed) pages that have no
  on-disk file.
- **Metadata escaping** is applied consistently to all crawled titles,
  descriptions, URLs, and tags before they are inserted into the DOM.

### Security
- Captured HTML is rendered only in a sandboxed iframe **without** script
  execution and **without** same-origin access to the host application.
- The ZIP export is generated fully client-side; nothing is uploaded anywhere.

### Notes / Known limits (browser reality)
- **CORS:** browsers block cross-origin `fetch` for many public sites, so a
  from-`file://` crawler cannot silently crawl arbitrary public sites the way a
  server-side archiver can. The **Manual Capture** panel covers those cases.
- **Asset inlining** is likewise subject to CORS; images/CSS that refuse
  cross-origin fetches are skipped (text, structure, and metadata always
  persist).
- **Storage size:** base64 inlining increases the stored size; very large crawls
  can hit the browser's `localStorage` quota. Use **Export to Files** for
  permanent, unbounded storage in the repo.
- Crawling and inlining touch the network **once** (during capture); all
  browsing afterward is fully offline.
- Fully backward compatible with the existing file-backed manual import workflow
  and the original record schema. Zero dependencies, no build step, still runs
  directly from `file://`.
