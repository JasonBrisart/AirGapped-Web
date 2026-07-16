(function () {
    "use strict";

    window.AGW = window.AGW || {};

    const core = AGW.core;

    function pageMatchesQuery(page, query) {
        const data = core.getData();

        const site = core.byId(
            data.websites,
            page.site_id
        );

        const snapshot = core.byId(
            data.snapshots,
            page.snapshot_id
        );

        const searchableText = [
            page.id,
            page.title,
            page.original_url,
            page.local_path,
            page.summary,
            page.text,
            Array.isArray(page.tags)
                ? page.tags.join(" ")
                : "",
            site ? site.title : "",
            site ? site.domain : "",
            site ? site.description : "",
            snapshot ? snapshot.label : "",
            snapshot ? snapshot.description : ""
        ].join(" ");

        return core
            .normalize(searchableText)
            .includes(core.normalize(query));
    }

    function renderSearchResult(page, site) {
        const domain = site
            ? site.domain
            : "Unknown Website";

        return `
            <article class="card">
                <div class="card-meta">
                    ${core.escapeHtml(domain)}
                </div>

                <h2>
                    ${core.renderLink(
                        core.pageLink(page.id),
                        page.title
                    )}
                </h2>

                <p>
                    ${core.escapeHtml(page.summary)}
                </p>

                <p>
                    <strong>Original URL:</strong>

                    <code>
                        ${core.escapeHtml(
                            page.original_url
                        )}
                    </code>
                </p>

                <p>
                    <strong>Captured:</strong>
                    ${core.escapeHtml(page.captured)}
                </p>

                <div class="tag-row">
                    ${core.renderTags(page.tags)}
                </div>
            </article>
        `;
    }

    function renderSearch(inputId, resultsId) {
        const input = document.getElementById(inputId);

        const results = document.getElementById(
            resultsId
        );

        if (!input || !results) {
            return;
        }

        const data = core.getData();

        function runSearch() {
            const query = input.value.trim();

            let matches = data.pages;

            if (query) {
                matches = data.pages.filter(
                    function (page) {
                        return pageMatchesQuery(
                            page,
                            query
                        );
                    }
                );
            }

            if (matches.length === 0) {
                results.innerHTML = `
                    <p class="empty">
                        No archived pages found.
                    </p>
                `;
                return;
            }

            let html = `
                <p class="result-count">
                    ${matches.length}
                    archived page(s) found.
                </p>
            `;

            for (const page of matches) {
                const site = core.byId(
                    data.websites,
                    page.site_id
                );

                html += renderSearchResult(
                    page,
                    site
                );
            }

            results.innerHTML = html;
        }

        input.addEventListener(
            "input",
            runSearch
        );

        runSearch();
    }

    AGW.pageMatchesQuery = pageMatchesQuery;
    AGW.renderSearch = renderSearch;
})();