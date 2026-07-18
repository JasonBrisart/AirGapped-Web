(function () {
    "use strict";
    window.AGW = window.AGW || {};
    const core = AGW.core;
    function renderOpenPageAction(page){
        const localHref = core.localArchiveLink(page.local_path);
        if (!localHref) return '<p class="empty">This page does not have a valid local path.</p>';
        return '<p>' + core.renderLink(localHref, 'Open Preserved Page', 'button') + '</p>';
    }
    function renderPageDetail(targetId){
        const target = document.getElementById(targetId); if (!target) return;
        const data = core.getData();
        const page = core.byId(data.pages, core.getQueryParam("id"));
        if (!page){ target.innerHTML = core.renderNotFound("Page not found.", "The selected page does not exist in this archive."); return; }
        const website = core.byId(data.websites, page.website_id);
        const snapshot = core.byId(data.snapshots, page.snapshot_id);
        const websiteTitle = website ? (website.title || website.id) : "Unknown Website";
        const snapshotLabel = snapshot ? (snapshot.label || snapshot.id) : "Unknown Snapshot";
        const backHref = website ? core.websiteLink(website.id) : "websites.html";
        target.innerHTML = `
            <section class="panel">
                <div class="card-meta">${core.escapeHtml(websiteTitle)}</div>
                <h2>${core.escapeHtml(page.title || page.id || "Unnamed Page")}</h2>
                <p>${core.escapeHtml(page.summary)}</p>
                <p><strong>Original URL:</strong> <code>${core.escapeHtml(page.original_url)}</code></p>
                <p><strong>Local path:</strong> <code>${core.escapeHtml(page.local_path)}</code></p>
                <p><strong>Captured:</strong> ${core.escapeHtml(page.captured)}</p>
                <p><strong>Snapshot:</strong> ${core.escapeHtml(snapshotLabel)}</p>
                <h3>Tags</h3>
                <div class="tag-row">${core.renderTags(page.tags)}</div>
                <hr>
                ${renderOpenPageAction(page)}
                <p>${core.renderLink(backHref, 'Back to Website')}</p>
            </section>
            <section class="panel">
                <h2>Searchable Text</h2>
                <p>${core.escapeHtml(page.text || "No searchable text recorded.")}</p>
            </section>`;
    }
    AGW.renderPageDetail = renderPageDetail;
})();
