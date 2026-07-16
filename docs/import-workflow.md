# AirGapped-Web Imports

AirGapped-Web imports are manual local record registrations.

The browser-based version does not crawl websites, download remote content, or write files automatically. Instead, an import means:

1. Preserved website files were placed into the `records/` folder.
2. Metadata was added to `data/archive-data.js`.
3. The website became searchable and browsable through AirGapped-Web.

## Example Folder

```text
records/
└── example-site/
    └── 2026-07-16/
        └── index.html
```

## Minimal Metadata Flow

1. Add a website record.
2. Add a snapshot record for that website.
3. Add one or more page records for the snapshot.
4. Add an import record documenting where the local files came from.
