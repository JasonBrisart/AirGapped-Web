(function () {
    "use strict";
    window.AGW = window.AGW || {};
    const core = AGW.core;
    function renderImportCard(importRecord, site, snapshot) {
        const pages = snapshot ? core.snapshotPages(snapshot.id) : [];
        let siteDisplay = "Unknown Website";
        if (site) {
            const siteUrl = core.siteLink(site.id);
            siteDisplay = `
                <a href="${core.escapeHtml(siteUrl)}">
                    ${core.escapeHtml(site.title)}
                </a>
            `;
        }
        const snapshotDisplay = snapshot
            ? core.escapeHtml(snapshot.label)
            : "Unknown Snapshot";
        return `
            <article class="card">
                <div class="card-meta">
                    ${core.escapeHtml(importRecord.status)}
                    ·
                    ${core.escapeHtml(importRecord.source_type)}
                </div>
                <h2>${core.escapeHtml(importRecord.label)}</h2>
                <p>
                    <strong>Website:</strong>
                    ${siteDisplay}
                </p>
                <p>
                    <strong>Snapshot:</strong>
                    ${snapshotDisplay}
                </p>
                <p>
                    <strong>Imported:</strong>
                    ${core.escapeHtml(importRecord.imported)}
                </p>
                <p>
                    <strong>Root path:</strong>
                    <code>${core.escapeHtml(importRecord.root_path)}</code>
                </p>
                <p>
                    <strong>Registered pages:</strong>
                    ${pages.length}
                </p>
                <p>${core.escapeHtml(importRecord.source_note)}</p>
            </article>
        `;
    }
    function renderImports(targetId) {
        const target = document.getElementById(targetId);
        if (!target) {
            return;
        }
        const data = core.getData();
        let importHtml = "";
        for (const importRecord of data.imports) {
            const site = core.byId(data.websites, importRecord.site_id);
            const snapshot = core.byId(data.snapshots, importRecord.snapshot_id);
            importHtml += renderImportCard(importRecord, site, snapshot);
        }
        target.innerHTML = `
            <section class="panel">
                <h2>Import Workflow</h2>
                <p>
                    AirGapped-Web does not crawl or write website files by
                    itself. A website import is registered by placing preserved
                    files inside the archives folder and adding records to
                    <code>data/archive-data.js</code>.
                </p>
                <ol>
                    <li>Create a site folder under <code>archives/</code>.</li>
                    <li>Create a dated snapshot folder.</li>
                    <li>Place the preserved website files inside that snapshot folder.</li>
                    <li>Add a website record.</li>
                    <li>Add a snapshot record.</li>
                    <li>Add records for searchable pages.</li>
                    <li>Add an import record documenting the source and archive path.</li>
                </ol>
            </section>
            <section class="panel">
                <h2>Registered Imports</h2>
                <p>${data.imports.length} import record(s) registered.</p>
            </section>
            ${importHtml || `<p class="empty">No imports recorded.</p>`}
        `;
    }
    AGW.renderImports = renderImports;
})();