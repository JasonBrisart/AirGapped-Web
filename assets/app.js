window.AGW_DATA = {
    archive: {
        id: "airgapped-web",
        name: "AirGapped-Web",
        version: "0.1.0",
        description: "A portable offline knowledge archive built from local HTML, CSS, JavaScript, and readable data records.",
        created: "2026-07-16",
        maintainer: "Jason Brisart"
    },

    identities: [
        {
            id: "identity-jason-brisart",
            name: "Jason Brisart",
            type: "person",
            description: "Creator and maintainer of the AirGapped-Web archive."
        },
        {
            id: "identity-research-lab",
            name: "Example Research Lab",
            type: "organization",
            description: "Example organization identity used for archive testing."
        }
    ],

    artifacts: [
        {
            id: "artifact-0001",
            title: "AirGapped-Web Project Overview",
            type: "document",
            status: "active",
            created: "2026-07-16",
            updated: "2026-07-16",
            author_id: "identity-jason-brisart",
            summary: "The core overview document for AirGapped-Web.",
            body: "AirGapped-Web is a portable offline knowledge archive designed to work from local files without requiring a server, internet connection, cloud service, database, or external dependency.",
            tags: [
                "airgapped",
                "archive",
                "offline",
                "preservation",
                "html"
            ],
            local_path: "docs/architecture.md"
        },
        {
            id: "artifact-0002",
            title: "Example Preserved Research Note",
            type: "research-note",
            status: "active",
            created: "2026-07-16",
            updated: "2026-07-16",
            author_id: "identity-jason-brisart",
            summary: "A sample research note showing how text artifacts are preserved.",
            body: "This artifact demonstrates how research notes can be stored as readable records and browsed through local HTML pages.",
            tags: [
                "research",
                "note",
                "example"
            ],
            local_path: ""
        },
        {
            id: "artifact-0003",
            title: "Example Offline Media Record",
            type: "media-record",
            status: "active",
            created: "2026-07-16",
            updated: "2026-07-16",
            author_id: "identity-research-lab",
            summary: "A sample media artifact that can point to a local video, image, audio file, or other preserved media.",
            body: "This record demonstrates how AirGapped-Web can track offline media while keeping metadata readable and searchable.",
            tags: [
                "media",
                "video",
                "example",
                "preservation"
            ],
            local_path: "media/example-video.mp4"
        }
    ],

    relationships: [
        {
            id: "relationship-0001",
            source_id: "artifact-0001",
            target_id: "artifact-0002",
            type: "explains",
            description: "The project overview explains the purpose of the preserved research note."
        },
        {
            id: "relationship-0002",
            source_id: "artifact-0002",
            target_id: "artifact-0003",
            type: "references",
            description: "The research note references the example media record."
        }
    ],

    snapshots: [
        {
            id: "snapshot-2026-07-16",
            label: "Initial Functional Architecture Snapshot",
            created: "2026-07-16",
            description: "First functional AirGapped-Web archive structure using local data records and static HTML views.",
            artifact_ids: [
                "artifact-0001",
                "artifact-0002",
                "artifact-0003"
            ]
        }
    ]
};