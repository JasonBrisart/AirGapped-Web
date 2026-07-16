# AirGapped-Web Architecture

AirGapped-Web is a portable offline archive system built from local files.

The system is designed to work without:

- Internet access
- Cloud services
- Databases
- Backend servers
- Python runtime
- Package managers
- External dependencies

## Core Idea

AirGapped-Web separates archive data from archive views.

Data is stored as readable JavaScript records.

Views are rendered through local HTML pages.

This allows the archive to remain portable, inspectable, editable, and usable from a USB drive or air-gapped workstation.

## Core Objects

### Archive

The archive object describes the whole local archive.

It contains:

- archive ID
- archive name
- version
- description
- maintainer
- creation date

### Artifact

An artifact is anything preserved by the archive.

An artifact may represent:

- a document
- a research note
- a media file
- a source code package
- a website snapshot
- an image
- an audio file
- a report
- a framework record

Artifacts contain:

- ID
- title
- type
- status
- created date
- updated date
- author identity
- summary
- body text
- tags
- local file path

### Identity

An identity represents a person, organization, lab, group, or source.

Identities prevent duplicated author/source information across many records.

### Relationship

A relationship links one artifact to another.

Examples:

- references
- explains
- depends-on
- replaces
- updates
- cites
- preserves
- mirrors

Relationships turn the archive from a folder of files into a knowledge graph.

### Snapshot

A snapshot records the state of selected artifacts at a point in time.

Snapshots are useful for preservation because archives should not only track the latest version.

They should preserve history.

## File Structure

```text
AirGapped-Web/
├── home.html
├── search.html
├── artifact.html
├── sitemap.html
│
├── assets/
│   ├── style.css
│   └── app.js
│
├── data/
│   └── archive-data.js
│
├── docs/
│   └── architecture.md
│
├── artifacts/
├── media/
├── snapshots/
└── imports/