# AirGapped-Web Import Workflow

This document is the operational procedure for manually registering a preserved website in AirGapped-Web.

For the data model and path design, see architecture.md.

---

## 1. What an Import Means

An import is a manual archive registration.

The current workflow consists of three actions:

1. Place preserved website files under archive/records/.
2. Add matching metadata to archive/catalog/archive-data.js.
3. Open AirGapped-Web and validate the catalog.

The website becomes browsable and searchable after its records are connected correctly.

---

## 2. Required Information

Before starting, prepare:

- The preserved website files
- A site identifier
- A capture date
- The original website URL
- A title and short description
- Searchable text for each registered page
- A note describing how the files entered the archive

Use a lowercase, hyphenated site folder name.

Example:

```text
example-site
```

Use a capture date in this form:

```text
2026-07-16
```

---

## 3. Create the Record Folder

Create this directory pattern:

```text
archive/records/<site-id>/<date>/
```

Example:

```text
archive/records/example-site/2026-07-16/
```

Place the preserved website files inside the dated folder.

```text
archive/records/example-site/2026-07-16/
├── index.html
├── about.html
├── assets/
├── images/
└── styles/
```

Keep the preserved website self-contained inside its dated snapshot folder.

---

## 4. Apply the Catalog Path Rule

Catalog paths are stored relative to the archive directory.

Correct root path:

```text
records/example-site/2026-07-16/
```

Correct page path:

```text
records/example-site/2026-07-16/index.html
```

Do not store this:

```text
archive/records/example-site/2026-07-16/index.html
```

Do not store machine-specific or remote locations:

```text
C:/Users/Name/example-site/index.html
../example-site/index.html
https://example.com/index.html
```

---

## 5. Add the Website Record

Open:

```text
archive/catalog/archive-data.js
```

Add a website object to the websites collection.

```javascript
{
    id: "website-example",
    title: "Example Preserved Website",
    original_url: "https://example.com",
    domain: "example.com",
    description: "A preserved example website.",
    tags: ["example", "offline"],
    snapshot_ids: ["snapshot-example-2026-07-16"]
}
```

Check that:

- id is unique in the websites collection.
- snapshot_ids contains the ID of the snapshot added in the next section.
- original_url records the original online location.

---

## 6. Add the Snapshot Record

Add a snapshot object to the snapshots collection.

```javascript
{
    id: "snapshot-example-2026-07-16",
    website_id: "website-example",
    label: "Initial Example Website Snapshot",
    captured: "2026-07-16",
    root_path: "records/example-site/2026-07-16/",
    description: "Initial preserved copy.",
    page_ids: ["page-example-home"]
}
```

Check that:

- id is unique in the snapshots collection.
- website_id matches the website record.
- root_path begins with records/.
- page_ids contains the IDs of all pages registered for this snapshot.

---

## 7. Add Page Records

Add one page object for each page that should appear in the catalog and search interface.

```javascript
{
    id: "page-example-home",
    website_id: "website-example",
    snapshot_id: "snapshot-example-2026-07-16",
    title: "Example Website Home Page",
    original_url: "https://example.com/",
    local_path: "records/example-site/2026-07-16/index.html",
    summary: "The preserved home page.",
    captured: "2026-07-16",
    tags: ["home", "example"],
    text: "Searchable text extracted from the preserved page."
}
```

Check that:

- id is unique in the pages collection.
- website_id matches the website record.
- snapshot_id matches the snapshot record.
- local_path points to an existing preserved file.
- local_path begins with records/.
- text contains useful content for local search.

Repeat this record for additional registered pages.

---

## 8. Add the Import Record

Add an import object to the imports collection.

```javascript
{
    id: "import-example-site-2026-07-16",
    website_id: "website-example",
    snapshot_id: "snapshot-example-2026-07-16",
    label: "Example Website Initial Import",
    imported: "2026-07-16",
    source_type: "manual-folder-import",
    source_note: "Placed manually into the archive records directory.",
    root_path: "records/example-site/2026-07-16/",
    status: "active"
}
```

Check that:

- id is unique in the imports collection.
- website_id matches the website record.
- snapshot_id matches the snapshot record.
- root_path matches the snapshot root path.
- source_note provides useful provenance information.

---

## 9. Verify the Catalog

Open:

```text
index.html
```

Review the home-page catalog status.

Expected result:

```text
Catalog status: Valid
```

If validation reports errors or warnings, correct the catalog before relying on the record.

---

## 10. Verify the Website View

After catalog validation succeeds:

1. Open Websites.
2. Select the newly registered website.
3. Confirm the website metadata is displayed.
4. Confirm the snapshot appears.
5. Open the snapshot.
6. Confirm the registered page list is correct.
7. Use Open Snapshot in Full Page if the inline iframe is restricted by the browser.

---

## 11. Verification Checklist

Before considering the import complete, confirm:

- [ ] The dated record folder exists.
- [ ] The preserved files are inside the dated folder.
- [ ] The website ID is unique.
- [ ] The snapshot ID is unique.
- [ ] Every page ID is unique.
- [ ] The import ID is unique.
- [ ] website.snapshot_ids references the snapshot.
- [ ] snapshot.website_id references the website.
- [ ] snapshot.page_ids references the registered pages.
- [ ] Every page references the correct website and snapshot.
- [ ] The import references the correct website and snapshot.
- [ ] Every root_path begins with records/.
- [ ] Every local_path begins with records/.
- [ ] No archive path contains parent-directory traversal.
- [ ] No archive path is an absolute machine path.
- [ ] No archive path is a remote URL.
- [ ] The home page reports a valid catalog.
- [ ] The preserved page opens successfully.

---

## 12. Troubleshooting

### Missing Website Reference

Message pattern:

```text
references missing website
```

Check website_id on the snapshot, page, or import record. It must exactly match an existing website ID.

### Missing Snapshot Reference

Message pattern:

```text
references missing snapshot
```

Check snapshot_id on the page or import record. It must exactly match an existing snapshot ID.

### Missing Page Reference

Message pattern:

```text
references missing page
```

Check page_ids on the snapshot record. Every listed ID must exist in the pages collection.

### Duplicate ID

Message pattern:

```text
Duplicate record ID
```

Assign a unique ID within that collection and update every reference to it.

### Invalid Local Path

Message pattern:

```text
invalid local path
```

Confirm that the stored value:

- Begins with records/
- Does not begin with archive/
- Does not begin with ../
- Does not contain /../
- Does not contain a remote protocol

### Snapshot Does Not Display Inline

The browser may restrict local iframe content under file://.

Use Open Snapshot in Full Page to open the preserved page directly.

### Page Is Blank

Check the script order in the associated HTML page:

1. archive-data.js
2. core.js
3. The page-specific view module
4. The renderer invocation

---

## 13. Minimal Import Sequence

```text
1. Copy files into archive/records/<site-id>/<date>/
2. Add website metadata
3. Add snapshot metadata
4. Add page metadata
5. Add import metadata
6. Open index.html
7. Resolve validation messages
8. Open and inspect the preserved snapshot
```
