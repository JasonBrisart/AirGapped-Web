(function () {
    "use strict";
    window.AGW = window.AGW || {};
    const core = AGW.core;

    function renderImportCard(importRecord, website, snapshot) {
        const pages = snapshot ? core.snapshotPages(snapshot.id) : [];
        const websiteDisplay = website
            ? core.renderLink(core.websiteLink(website.id), website.title || website.id)
            : "Unknown Website";
        const snapshotDisplay = snapshot ? (snapshot.label || snapshot.id) : "Unknown Snapshot";

        return `
            <article class="card">
                <div class="card-meta">${core.escapeHtml(importRecord.status || "unknown")} · ${core.escapeHtml(importRecord.source_type || "unspecified")}</div>
                <h2>${core.escapeHtml(importRecord.label || importRecord.id || "Unnamed Import")}</h2>
                <p><strong>Website:</strong> ${websiteDisplay}</p>
                <p><strong>Snapshot:</strong> ${core.escapeHtml(snapshotDisplay)}</p>
                <p><strong>Imported:</strong> ${core.escapeHtml(importRecord.imported)}</p>
                <p><strong>Root path:</strong> <code>${core.escapeHtml(importRecord.root_path)}</code></p>
                <p><strong>Registered pages:</strong> ${pages.length}</p>
                <p>${core.escapeHtml(importRecord.source_note)}</p>
            </article>
        `;
    }

    function renderImports(targetId) {
        const target = document.getElementById(targetId);
        if (!target) return;
        const data = core.getData();
        let importHtml = "";
        for (const importRecord of data.imports) {
            importHtml += renderImportCard(
                importRecord,
                core.byId(data.websites, importRecord.website_id),
                core.byId(data.snapshots, importRecord.snapshot_id)
            );
        }

        target.innerHTML = `
            <section class="panel">
                <h2>Import Workflow</h2>
                <p>AirGapped-Web does not crawl or write website files by itself. A website import is registered by placing preserved files inside the <code>records/</code> folder and adding records to <code>data/archive-data.js</code>.</p>
                <ol>
                    <li>Create a website folder under <code>records/</code>.</li>
                    <li>Create a dated snapshot folder.</li>
                    <li>Place the preserved website files inside the snapshot folder.</li>
                    <li>Add a website record.</li>
                    <li>Add a snapshot record.</li>
                    <li>Add records for searchable pages.</li>
                    <li>Add an import record documenting the source and local path.</li>
                </ol>
            </section>
            <section class="panel"><h2>Registered Imports</h2><p>${data.imports.length} import record(s) registered.</p></section>
            ${importHtml || '<section class="panel"><p class="empty">No imports recorded.</p></section>'}
        `;
    }

    AGW.renderImports = renderImports;
})();
