# AirGapped-Web Architecture

AirGapped-Web v0.2.1 is an offline website record system. It preserves website files locally and provides browsable, searchable metadata without requiring internet access, servers, package managers, or external dependencies.

## Runtime Requirements

AirGapped-Web requires only:

- A modern web browser

It does not require:

- Internet access
- Python
- Node
- npm
- pip
- Docker
- A web server
- A database
- A package manager
- External dependencies

## Core Objects

### Record System

The record system describes the whole local collection.

### Website

A website record describes a preserved website.

Fields:

- `id`
- `title`
- `original_url`
- `domain`
- `description`
- `tags`
- `snapshot_ids`

### Snapshot

A snapshot describes a captured version of a website at a specific time.

Fields:

- `id`
- `website_id`
- `label`
- `captured`
- `root_path`
- `description`
- `page_ids`

### Page

A page record describes one preserved page from a website.

Fields:

- `id`
- `website_id`
- `snapshot_id`
- `title`
- `original_url`
- `local_path`
- `summary`
- `captured`
- `tags`
- `text`

### Import

An import record documents how a preserved website entered the local record system.

Fields:

- `id`
- `website_id`
- `snapshot_id`
- `label`
- `imported`
- `source_type`
- `source_note`
- `root_path`
- `status`

## Current File Structure

```text
AirGapped-Web/
├── index.html
├── websites.html
├── website.html
├── page.html
├── imports.html
├── search.html
├── sitemap.html
├── assets/
│   └── style.css
├── data/
│   └── archive-data.js
├── modules/
│   ├── archive-summary.js
│   ├── core.js
│   ├── import-registry.js
│   ├── page-detail.js
│   ├── search.js
│   ├── sitemap.js
│   ├── website-detail.js
│   └── website-list.js
├── records/
│   └── example-site/
│       └── 2026-07-16/
│           └── index.html
└── docs/
    ├── architecture.md
    └── import-workflow.md
```

## Design Principle

Keep the root folder simple: double-click `index.html`, browse records, open local preserved pages, and search metadata. All behavior is plain browser JavaScript. All records are stored in `data/archive-data.js`.

## Import Workflow

1. Place preserved website files under `records/<site-id>/<date>/`.
2. Add or update the matching website record in `data/archive-data.js`.
3. Add a snapshot record with `root_path` pointing to the dated folder.
4. Add page records with `local_path` pointing to local files.
5. Add an import record documenting the source and registration status.
6. Open `index.html` in a browser and confirm the validation panel is clean.

## Safety Boundaries

Local page links are intentionally limited to relative paths under `records/` or `archives/`. This keeps page links local and prevents accidental remote or absolute-path links.
