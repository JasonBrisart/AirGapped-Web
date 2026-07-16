# AirGapped-Web Architecture

AirGapped-Web v0.1.0 is an offline website archive.

The first goal is simple:

Preserve websites as local files and make them browsable, searchable, and inspectable without internet access.

## Requirements

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

### Archive

The archive object describes the whole local archive.

### Website

A website record describes a preserved website.

A website has:

- ID
- title
- original URL
- domain
- description
- tags
- snapshots

### Page

A page record describes one preserved page from a website.

A page has:

- ID
- website ID
- snapshot ID
- title
- original URL
- local path
- summary
- captured date
- tags
- searchable text

### Snapshot

A snapshot describes a captured version of a website at a specific time.

A snapshot has:

- ID
- website ID
- label
- captured date
- root path
- description
- page list

## Design Principle

Functionality first.

The first version should prove that AirGapped-Web can:

- list archived websites
- open website records
- list snapshots
- list archived pages
- open preserved local pages
- search archive records
- run from local files only

The UI can be improved later.

## File Structure

```text
AirGapped-Web/
├── home.html
├── websites.html
├── site.html
├── page.html
├── search.html
├── sitemap.html
│
├── assets/
│   ├── style.css
│   └── app.js
│
├── data/
│   └── archive-data.js
│
├── archives/
│   └── example-site/
│       └── 2026-07-16/
│           └── index.html
│
└── docs/
    └── architecture.md