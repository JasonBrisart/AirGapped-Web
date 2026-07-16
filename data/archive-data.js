window.AGW_DATA = {
    archive: {
        id: "airgapped-web",
        name: "AirGapped-Web",
        version: "0.2.0",
        mode: "offline-website-archive",
        description: "A portable offline website archive that stores websites, pages, snapshots, import records, and searchable metadata using local files only.",
        created: "2026-07-16",
        maintainer: "Jason Brisart"
    },

    imports: [
        {
            id: "import-example-site-2026-07-16",
            site_id: "site-example",
            snapshot_id: "snapshot-example-2026-07-16",
            label: "Example Website Initial Import",
            imported: "2026-07-16",
            source_type: "manual-folder-import",
            source_note: "Example archived website manually placed into the archives folder.",
            root_path: "archives/example-site/2026-07-16/",
            status: "active"
        }
    ],

    websites: [
        {
            id: "site-example",
            title: "Example Archived Website",
            original_url: "https://example.com",
            domain: "example.com",
            description: "A sample archived website used to demonstrate AirGapped-Web website preservation.",
            tags: [
                "example",
                "website",
                "archive",
                "offline"
            ],
            snapshot_ids: [
                "snapshot-example-2026-07-16"
            ]
        }
    ],

    pages: [
        {
            id: "page-example-home",
            site_id: "site-example",
            snapshot_id: "snapshot-example-2026-07-16",
            title: "Example Website Home Page",
            original_url: "https://example.com/",
            local_path: "archives/example-site/2026-07-16/index.html",
            summary: "The preserved home page for the example website.",
            captured: "2026-07-16",
            tags: [
                "home",
                "example",
                "snapshot"
            ],
            text: "This is a sample offline page preserved inside AirGapped-Web."
        }
    ],

    snapshots: [
        {
            id: "snapshot-example-2026-07-16",
            site_id: "site-example",
            label: "Initial Example Website Snapshot",
            captured: "2026-07-16",
            root_path: "archives/example-site/2026-07-16/",
            description: "Initial preserved copy of the example website.",
            page_ids: [
                "page-example-home"
            ]
        }
    ]
};