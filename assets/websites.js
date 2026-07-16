(function () {
    "use strict";

    window.AGW = window.AGW || {};

    const core = AGW.core;

    function renderWebsiteList(targetId, websites) {
        const target = document.getElementById(targetId);

        if (!target) {
            return;
        }

        if (!Array.isArray(websites) ||
            websites.length === 0) {
            target.innerHTML = `
                <p class="empty">
                    No websites found.
                </p>
            `;
            return;
        }

        let html = "";

        for (const site of websites) {
            html += `
                <article class="card">
                    <div class="card-meta">
                        ${core.escapeHtml(site.domain)}
                    </div>

                    <h2>
                        ${core.renderLink(
                            core.siteLink(site.id),
                            site.title
                        )}
                    </h2>

                    <p>
                        ${core.escapeHtml(site.description)}
                    </p>

                    <p>
                        <strong>Original URL:</strong>

                        <code>
                            ${core.escapeHtml(
                                site.original_url
                            )}
                        </code>
                    </p>

                    <p>
                        <strong>Snapshots:</strong>
                        ${core.siteSnapshots(site.id).length}
                    </p>

                    <p>
                        <strong>Registered pages:</strong>
                        ${core.sitePages(site.id).length}
                    </p>

                    <div class="tag-row">
                        ${core.renderTags(site.tags)}
                    </div>
                </article>
            `;
        }

        target.innerHTML = html;
    }

    function renderAllWebsites(targetId) {
        const data = core.getData();

        renderWebsiteList(
            targetId,
            data.websites
        );
    }

    function renderSnapshotList(snapshots) {
        if (snapshots.length === 0) {
            return "<li>No snapshots recorded.</li>";
        }

        let html = "";

        for (const snapshot of snapshots) {
            const pages =
                core.snapshotPages(snapshot.id);

            html += `
                <li>
                    <strong>
                        ${core.escapeHtml(snapshot.label)}
                    </strong>

                    <br>

                    Captured:
                    ${core.escapeHtml(snapshot.captured)}

                    <br>

                    Root path:
                    <code>
                        ${core.escapeHtml(
                            snapshot.root_path
                        )}
                    </code>

                    <br>

                    Registered pages:
                    ${pages.length}

                    <p>
                        ${core.escapeHtml(
                            snapshot.description
                        )}
                    </p>
                </li>
            `;
        }

        return html;
    }

    function renderImportList(imports) {
        if (imports.length === 0) {
            return "<li>No imports recorded.</li>";
        }

        let html = "";

        for (const importRecord of imports) {
            html += `
                <li>
                    <strong>
                        ${core.escapeHtml(
                            importRecord.label
                        )}
                    </strong>

                    <br>

                    Imported:
                    ${core.escapeHtml(
                        importRecord.imported
                    )}

                    <br>

                    Source type:
                    ${core.escapeHtml(
                        importRecord.source_type
                    )}

                    <br>

                    Status:
                    ${core.escapeHtml(
                        importRecord.status
                    )}

                    <br>

                    Root path:
                    <code>
                        ${core.escapeHtml(
                            importRecord.root_path
                        )}
                    </code>
                </li>
            `;
        }

        return html;
    }

    function renderPageList(pages) {
        if (pages.length === 0) {
            return "<li>No pages recorded.</li>";
        }

        let html = "";

        for (const page of pages) {
            html += `
                <li>
                    ${core.renderLink(
                        core.pageLink(page.id),
                        page.title
                    )}

                    <br>

                    <span>
                        ${core.escapeHtml(page.summary)}
                    </span>
                </li>
            `;
        }

        return html;
    }

    function renderSiteDetail(targetId) {
        const target = document.getElementById(targetId);

        if (!target) {
            return;
        }

        const data = core.getData();
        const siteId = core.getQueryParam("id");

        const site = core.byId(
            data.websites,
            siteId
        );

        if (!site) {
            target.innerHTML = core.renderNotFound(
                "Website not found.",
                "The selected website does not exist " +
                "in this archive."
            );
            return;
        }

        const snapshots =
            core.siteSnapshots(site.id);

        const imports =
            core.siteImports(site.id);

        const pages =
            core.sitePages(site.id);

        target.innerHTML = `
            <section class="panel">
                <div class="card-meta">
                    ${core.escapeHtml(site.domain)}
                </div>

                <h2>
                    ${core.escapeHtml(site.title)}
                </h2>

                <p>
                    ${core.escapeHtml(site.description)}
                </p>

                <p>
                    <strong>Original URL:</strong>

                    <code>
                        ${core.escapeHtml(
                            site.original_url
                        )}
                    </code>
                </p>

                <h3>Tags</h3>

                <div class="tag-row">
                    ${core.renderTags(site.tags)}
                </div>
            </section>

            <section class="panel">
                <h2>Imports</h2>

                <ul class="record-list">
                    ${renderImportList(imports)}
                </ul>
            </section>

            <section class="panel">
                <h2>Snapshots</h2>

                <ul class="record-list">
                    ${renderSnapshotList(snapshots)}
                </ul>
            </section>

            <section class="panel">
                <h2>Archived Pages</h2>

                <ul class="record-list">
                    ${renderPageList(pages)}
                </ul>
            </section>
        `;
    }

    AGW.renderWebsiteList = renderWebsiteList;
    AGW.renderAllWebsites = renderAllWebsites;
    AGW.renderSiteDetail = renderSiteDetail;
})();