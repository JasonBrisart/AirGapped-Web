(function () {
    "use strict";
    window.AGW = window.AGW || {};
    const core = AGW.core;

    function renderSnapshotList(snapshots) {
        if (!Array.isArray(snapshots) || snapshots.length === 0) return '<li>No snapshots recorded.</li>';
        let html = "";
        for (const snapshot of snapshots) {
            const pages = core.snapshotPages(snapshot.id);
            html += `
                <li>
                    <strong>${core.escapeHtml(snapshot.label || snapshot.id || "Unnamed Snapshot")}</strong><br>
                    Captured: ${core.escapeHtml(snapshot.captured)}<br>
                    Root path: <code>${core.escapeHtml(snapshot.root_path)}</code><br>
                    Registered pages: ${pages.length}
                    <p>${core.escapeHtml(snapshot.description)}</p>
                </li>
            `;
        }
        return html;
    }

    function renderImportList(imports) {
        if (!Array.isArray(imports) || imports.length === 0) return '<li>No imports recorded.</li>';
        let html = "";
        for (const importRecord of imports) {
            html += `
                <li>
                    <strong>${core.escapeHtml(importRecord.label || importRecord.id || "Unnamed Import")}</strong><br>
                    Imported: ${core.escapeHtml(importRecord.imported)}<br>
                    Source type: ${core.escapeHtml(importRecord.source_type)}<br>
                    Status: ${core.escapeHtml(importRecord.status)}<br>
                    Root path: <code>${core.escapeHtml(importRecord.root_path)}</code>
                </li>
            `;
        }
        return html;
    }

    function renderPageList(pages) {
        if (!Array.isArray(pages) || pages.length === 0) return '<li>No pages recorded.</li>';
        let html = "";
        for (const page of pages) {
            html += `
                <li>
                    ${core.renderLink(core.pageLink(page.id), page.title || page.id || "Unnamed Page")}<br>
                    <span>${core.escapeHtml(page.summary)}</span><br>
                    <code>${core.escapeHtml(page.local_path)}</code>
                </li>
            `;
        }
        return html;
    }

    function renderWebsiteDetail(targetId) {
        const target = document.getElementById(targetId);
        if (!target) return;
        const data = core.getData();
        const website = core.byId(data.websites, core.getQueryParam("id"));
        if (!website) {
            target.innerHTML = core.renderNotFound("Website not found.", "The selected website does not exist in this archive.");
            return;
        }
        const snapshots = core.websiteSnapshots(website.id);
        const imports = core.websiteImports(website.id);
        const pages = core.websitePages(website.id);
        target.innerHTML = `
            <section class="panel">
                <div class="card-meta">${core.escapeHtml(website.domain || "Unknown domain")}</div>
                <h2>${core.escapeHtml(website.title || website.id || "Unnamed Website")}</h2>
                <p>${core.escapeHtml(website.description)}</p>
                <p><strong>Original URL:</strong> <code>${core.escapeHtml(website.original_url)}</code></p>
                <p><strong>Website ID:</strong> <code>${core.escapeHtml(website.id)}</code></p>
                <h3>Tags</h3>
                <div class="tag-row">${core.renderTags(website.tags)}</div>
            </section>
            <section class="panel"><h2>Imports</h2><ul class="record-list">${renderImportList(imports)}</ul></section>
            <section class="panel"><h2>Snapshots</h2><ul class="record-list">${renderSnapshotList(snapshots)}</ul></section>
            <section class="panel"><h2>Pages</h2><ul class="record-list">${renderPageList(pages)}</ul></section>
            <p><a href="websites.html">Back to All Websites</a></p>
        `;
    }

    AGW.renderWebsiteDetail = renderWebsiteDetail;
})();
