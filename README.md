# AirGapped-Web

### Build Connected Knowledge Without Connectivity

AirGapped-Web is a lightweight HTML, CSS, and JavaScript project for browsing preserved website records entirely from local files.

If information matters, you should be able to browse it without the Internet.

---

## Why AirGapped-Web Exists

Most websites assume internet access, cloud hosting, web servers, databases, and continuous connectivity. AirGapped-Web explores a different idea: useful website records can exist entirely from local files.

Rather than relying on online infrastructure, AirGapped-Web focuses on creating portable, inspectable, searchable website records that can be copied, archived, and used anywhere.

---

## Core Philosophy

### Offline First

Everything should function without internet access.

### Open Standards

AirGapped-Web is built using:

- HTML
- CSS
- JavaScript

No proprietary runtime formats are required.

### Portable

Entire record systems should be movable between computers, USB drives, external storage, research archives, and air-gapped environments.

### Human Readable

Information should remain visible, understandable, and maintainable.

### Preservation Friendly

Knowledge should remain accessible long after software platforms disappear.

---

## Features

- Static HTML pages
- Offline navigation
- Local metadata search
- Website records
- Snapshot records
- Page records
- Import records
- Local preserved page links
- No backend requirements
- No internet required

---

## How To Run

Open this file in a modern browser:

```text
index.html
```

No installation required. No server required. No database required. No internet required.

---

## Current Folder Layout

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
├── data/
├── modules/
├── records/
└── docs/
```

---

## Manual Import Workflow

1. Put preserved website files inside `records/<site-id>/<date>/`.
2. Add metadata records to `data/archive-data.js`.
3. Open `index.html`.
4. Use Websites, Search, Imports, and Site Map to browse the local records.

---

## Status

Experimental project. The goal is simple, auditable, dependency-free offline browsing of website records.
