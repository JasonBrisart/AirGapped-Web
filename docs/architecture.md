# AirGapped-Web Architecture Reference

Technical reference for AirGapped-Web v0.3.1.

This document explains how the system is engineered: its layers, data model, module contracts, rendering pipeline, path resolution, validation, and security boundaries.

For project purpose and startup instructions, see ../README.md.

For the content registration procedure, see import-workflow.md.

---

## 1. Design Constraints

Every architectural decision supports these constraints:

| Constraint | Consequence |
|---|---|
| Runs from file:// | No server-side application layer is required |
| No dependencies | Pure browser HTML, CSS, and JavaScript |
| Fully auditable | Small, readable, single-purpose modules |
| Portable | Catalog paths are archive-relative, never machine-specific |
| Long-lived | Open standards and local files remain the foundation |

The only runtime requirement is a modern web browser.

---

## 2. Layered Structure

AirGapped-Web separates the application from the archive.

```text
app/       application code and presentation
archive/   metadata and preserved website files
```

The application reads and renders the archive. The archive remains a distinct local payload.

```text
AirGapped-Web/
├── index.html
├── README.md
├── app/
│   ├── assets/
│   │   └── style.css
│   ├── components/
│   ├── modules/
│   │   ├── archive-summary.js
│   │   ├── core.js
│   │   ├── import-registry.js
│   │   ├── page-detail.js
│   │   ├── search.js
│   │   ├── sitemap.js
│   │   ├── snapshot-viewer.js
│   │   ├── website-detail.js
│   │   └── website-list.js
│   └── pages/
│       ├── imports.html
│       ├── page.html
│       ├── search.html
│       ├── sitemap.html
│       ├── snapshot.html
│       ├── website.html
│       └── websites.html
├── archive/
│   ├── catalog/
│   │   └── archive-data.js
│   └── records/
│       └── <site-id>/
│           └── <date>/
└── docs/
    ├── architecture.md
    └── import-workflow.md
```

### Layer Responsibilities

| Layer | Responsibility |
|---|---|
| index.html | Root launcher and archive summary |
| app/assets/ | Shared presentation assets |
| app/components/ | Reserved location for reusable interface elements |
| app/modules/ | Shared logic and view renderers |
| app/pages/ | User-facing HTML views |
| archive/catalog/ | Structured archive metadata |
| archive/records/ | Preserved website files |
| docs/ | Technical and procedural documentation |

---

## 3. Data Model

The catalog is stored in:

```text
archive/catalog/archive-data.js
```

It exposes one global object:

```javascript
window.AGW_DATA
```

The catalog contains four collections:

```text
Website
├── Snapshot
│   └── Page
└── Import
```

### Website Record

A website record describes one preserved website.

Fields:

- id
- title
- original_url
- domain
- description
- tags
- snapshot_ids

### Snapshot Record

A snapshot record describes one captured version of a website.

Fields:

- id
- website_id
- label
- captured
- root_path
- description
- page_ids

### Page Record

A page record describes one preserved page.

Fields:

- id
- website_id
- snapshot_id
- title
- original_url
- local_path
- summary
- captured
- tags
- text

### Import Record

An import record documents how preserved content entered the archive.

Fields:

- id
- website_id
- snapshot_id
- label
- imported
- source_type
- source_note
- root_path
- status

### Relationship Rules

- website.snapshot_ids references snapshot records.
- snapshot.website_id references one website record.
- snapshot.page_ids references page records.
- page.website_id references one website record.
- page.snapshot_id references one snapshot record.
- import.website_id references one website record.
- import.snapshot_id references one snapshot record.

---

## 4. Module System

All browser-side logic lives in:

```text
app/modules/
```

There is one shared kernel and one module per view.

### core.js

core.js exposes the AGW.core namespace.

Its responsibilities are grouped as follows:

| Responsibility | Functions |
|---|---|
| Data access | getData(), byId(), getQueryParam() |
| Relationships | websiteSnapshots(), snapshotPages(), websitePages(), websiteImports() |
| Internal links | websiteLink(), pageLink(), snapshotLink() |
| Archive paths | normalizeLocalPath(), isSafeLocalPath(), localArchiveLink() |
| Snapshot selection | snapshotIndexPath(), snapshotPreferredPage() |
| Rendering helpers | escapeHtml(), renderLink(), renderTags(), renderNotFound() |
| Validation | validateData() |

Path construction and catalog validation remain centralized in core.js so view modules do not duplicate that logic.

### View Modules

| Module | Responsibility | Public Entry Point |
|---|---|---|
| archive-summary.js | Home summary and validation output | renderArchiveSummary() |
| website-list.js | Website listing | renderAllWebsites() |
| website-detail.js | Website detail view | renderWebsiteDetail() |
| page-detail.js | Page detail view | renderPageDetail() |
| snapshot-viewer.js | Snapshot detail and preserved-page viewer | renderSnapshotViewer() |
| search.js | Local metadata search | renderSearch() |
| sitemap.js | Local application index | renderSitemap() |
| import-registry.js | Import record listing | renderImports() |

### Module Contract

Each module uses an isolated browser wrapper, reads shared helpers from AGW.core, and publishes only its intended entry point.

```javascript
(function () {
    "use strict";

    window.AGW = window.AGW || {};
    const core = AGW.core;

    function renderView(targetId) {
        // View-specific rendering logic.
    }

    AGW.renderView = renderView;
})();
```

This keeps module boundaries visible and auditable.

---

## 5. HTML Page Contract

Each page in app/pages/ follows the same load order:

1. Load ../assets/style.css.
2. Load ../../archive/catalog/archive-data.js.
3. Load ../modules/core.js.
4. Load the page-specific view module.
5. Invoke the view renderer.

Example:

```html
<link rel="stylesheet" href="../assets/style.css">

<script src="../../archive/catalog/archive-data.js"></script>
<script src="../modules/core.js"></script>
<script src="../modules/website-list.js"></script>
<script>
    AGW.renderAllWebsites("website-list");
</script>
```

The catalog must load before core.js. core.js must load before the view module. The view module must load before its renderer is invoked.

---

## 6. Rendering Pipeline

```text
HTML page
    ↓
archive-data.js defines AGW_DATA
    ↓
core.js defines AGW.core
    ↓
view module defines its renderer
    ↓
inline page script invokes the renderer
    ↓
renderer reads catalog records
    ↓
renderer writes the generated interface into its target element
```

Pages do not independently parse the catalog. Relationship lookup and path handling are delegated to core.js.

---

## 7. Path Resolution

Pages run from:

```text
app/pages/
```

Preserved files live under:

```text
archive/records/
```

Catalog paths are stored relative to the archive directory.

Example stored path:

```text
records/example-site/2026-07-16/index.html
```

When a page is rendered, localArchiveLink() prefixes the stored value with:

```text
../../archive/
```

The resulting link is:

```text
../../archive/records/example-site/2026-07-16/index.html
```

This keeps catalog records independent from the location of app/pages/.

### Path Safety

isSafeLocalPath() normalizes directory separators and rejects:

- Empty paths
- Absolute paths
- Parent-directory traversal
- Remote URLs
- Protocol-relative URLs

The current catalog uses paths beginning with:

```text
records/
```

---

## 8. Validation

validateData() checks the logical integrity of catalog records.

It reports:

- Missing IDs
- Duplicate IDs
- Missing website references
- Missing snapshot references
- Missing page references
- Invalid snapshot root paths
- Invalid page local paths
- Invalid import root paths

The home view calls validateData() and displays the result through archive-summary.js.

A catalog can be structurally valid even when browser restrictions prevent an iframe from displaying a local page. Catalog validation and browser rendering are separate concerns.

---

## 9. Snapshot Selection

snapshotPreferredPage() selects the initial page for a snapshot viewer.

Selection order:

1. A registered page ending in index.html or index.htm.
2. The first registered page in the snapshot.
3. The snapshot root path combined with index.html.

The selected archive-relative path is converted by localArchiveLink() before it is rendered.

---

## 10. Security Model

Preserved content is treated as untrusted content.

### Escaping

Metadata inserted into generated HTML is passed through escapeHtml().

### Archive Path Restrictions

Only approved local archive-relative paths are converted into clickable preserved-content links.

### Sandboxed Viewer

The snapshot iframe uses:

```html
sandbox="allow-same-origin allow-forms allow-popups"
```

Scripts are not enabled in the iframe sandbox configuration.

---

## 11. Extension Points

### app/components/

This folder is reserved for reusable interface elements once repeated behavior justifies extraction.

Possible future uses include:

- Shared navigation
- Reusable record cards
- Search controls
- Viewer controls
- Shared metadata panels

The folder may remain empty while each view is still small and self-contained.

### Adding a View

1. Create app/modules/<view-name>.js.
2. Follow the module contract.
3. Create app/pages/<view-name>.html.
4. Load catalog, core, and the view module in the required order.
5. Add navigation or a link helper when the view needs to be reachable.

### Expanding the Catalog

When a new record type is introduced:

1. Add its collection to archive-data.js.
2. Expose it through core.getData().
3. Add relationship helpers where needed.
4. Extend validateData().
5. Add a focused renderer only if the record requires a user-facing view.

---

## 12. Architectural Boundary

AirGapped-Web is currently a static browser application.

The archive catalog is loaded as JavaScript. Preserved records are local files. The application reads and renders those records without a server, database, build system, or package manager.

The architecture favors explicit files, centralized path logic, small modules, and inspectable metadata over hidden automation.
