(function () {
    "use strict";
    window.AGW = window.AGW || {};
    const core = AGW.core;

    function renderWebsiteCard(website) {
        const snapshots = core.websiteSnapshots(website.id);
        const pages = core.websitePages(website.id);
        const imports = core.websiteImports(website.id);
        return `
            <article class="card">
                <div class="card-meta">${core.escapeHtml(website.domain || "Unknown domain")}</div>
                <h2>${core.renderLink(core.websiteLink(website.id), website.title || website.id || "Unnamed Website")}</h2>
                <p>${core.escapeHtml(website.description)}</p>
                <p><strong>Original URL:</strong> <code>${core.escapeHtml(website.original_url)}</code></p>
                <p><strong>Snapshots:</strong> ${snapshots.length}</p>
                <p><strong>Registered pages:</strong> ${pages.length}</p>
                <p><strong>Imports:</strong> ${imports.length}</p>
                <div class="tag-row">${core.renderTags(website.tags)}</div>
            </article>
        `;
    }

    function renderWebsiteList(targetId, websites) {
        const target = document.getElementById(targetId);
        if (!target) return;
        if (!Array.isArray(websites) || websites.length === 0) {
            target.innerHTML = '<section class="panel"><p class="empty">No websites found.</p></section>';
            return;
        }
        let html = "";
        for (const website of websites) html += renderWebsiteCard(website);
        target.innerHTML = html;
    }

    function renderAllWebsites(targetId) {
        renderWebsiteList(targetId, core.getData().websites);
    }

    AGW.renderWebsiteList = renderWebsiteList;
    AGW.renderAllWebsites = renderAllWebsites;
})();
