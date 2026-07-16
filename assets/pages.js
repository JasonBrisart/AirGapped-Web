(function () {
    "use strict";
    window.AGW = window.AGW || {};
    const core = AGW.core;
    function renderPageDetail(targetId) {
        const target = document.getElementById(targetId);
        if (!target) {
            return;
        }
        const data = core.getData();
        const pageId = core.getQueryParam("id");
        const page = core.byId(data.pages, pageId);
        if (!page) {
            target.innerHTML = core.renderNotFound(
                "Page not found.",
                "The selected page does not exist in this archive."
            );
            return;
        }
        const site = core.byId(data.websites, page.site_id);
        const snapshot = core.byId(data.snapshots, page.snapshot_id);
        const siteTitle = site ? site.title : "Unknown Website";
        const snapshotLabel = snapshot ? snapshot.label : "Unknown Snapshot";
        const backHref = site ? core.siteLink(site.id) : "websites.html";
        target.innerHTML = `
            <section class="panel">
                <div class="card-meta">${core.escapeHtml(siteTitle)}</div>
                <h2>${core.escapeHtml(page.title)}</h2>
                <p>${core.escapeHtml(page.summary)}</p>
                <p>
                    <strong>Original URL:</strong>
                    <code>${core.escapeHtml(page.original_url)}</code>
                </p>
                <p>
                    <strong>Local path:</strong>
                    <code>${core.escapeHtml(page.local_path)}</code>
                </p>
                <p>
                    <strong>Captured:</strong>
                    ${core.escapeHtml(page.captured)}
                </p>
                <p>
                    <strong>Snapshot:</strong>
                    ${core.escapeHtml(snapshotLabel)}
                </p>
                <h3>Tags</h3>
                <div class="tag-row">${core.renderTags(page.tags)}</div>
                <hr>
                <p>
                    <a class="button" href="${core.escapeHtml(backHref)}">
                        Back to Website
                    </a>
                </p>
            </section>
            <section class="panel">
                <h2>Searchable Text</h2>
                <p>${core.escapeHtml(page.text)}</p>
            </section>
        `;
    }
    AGW.renderPageDetail = renderPageDetail;
})();