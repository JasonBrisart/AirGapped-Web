(function () {
    "use strict";

    function getData() {
        if (!window.AGW_DATA) {
            return {
                archive: {},
                websites: [],
                pages: [],
                snapshots: []
            };
        }

        return window.AGW_DATA;
    }

    function escapeHtml(value) {
        if (value === null || value === undefined) {
            return "";
        }

        return String(value)
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#039;");
    }

    function byId(items, id) {
        for (const item of items) {
            if (item.id === id) {
                return item;
            }
        }

        return null;
    }

    function getQueryParam(name) {
        const params = new URLSearchParams(window.location.search);
        return params.get(name);
    }

    function normalize(value) {
        return String(value || "").toLowerCase();
    }

    function siteLink(siteId) {
        return "site.html?id=" + encodeURIComponent(siteId);
    }

    function pageLink(pageId) {
        return "page.html?id=" + encodeURIComponent(pageId);
    }

    function renderArchiveSummary(targetId) {
        const data = getData();
        const target = document.getElementById(targetId);

        if (!target) {
            return;
        }

        target.innerHTML = `
            <section class="panel">
                <h2>${escapeHtml(data.archive.name)}</h2>
                <p>${escapeHtml(data.archive.description)}</p>

                <div class="stats">
                    <div>
                        <strong>${data.websites.length}</strong>
                        <span>Websites</span>
                    </div>
                    <div>
                        <strong>${data.pages.length}</strong>
                        <span>Pages</span>
                    </div>
                    <div>
                        <strong>${data.snapshots.length}</strong>
                        <span>Snapshots</span>
                    </div>
                    <div>
                        <strong>${escapeHtml(data.archive.version)}</strong>
                        <span>Version</span>
                    </div>
                </div>
            </section>
        `;
    }

    function renderWebsiteList(targetId, websites) {
        const target = document.getElementById(targetId);

        if (!target) {
            return;
        }

        if (!websites || websites.length === 0) {
            target.innerHTML = `<p class="empty">No websites found.</p>`;
            return;
        }

        let html = "";

        for (const site of websites) {
            html += `
                <article class="card">
                    <div class="card-meta">
                        ${escapeHtml(site.domain)}
                    </div>

                    <h2>
                        ">${escapeHtml(site.title)}</a>
                    </h2>

                    <p>${escapeHtml(site.description)}</p>

                    <p>
                        <strong>Original URL:</strong>
                        <code>${escapeHtml(site.original_url)}</code>
                    </p>

                    <div class="tag-row">
                        ${(site.tags || []).map(function (tag) {
                            return `<span class="tag">${escapeHtml(tag)}</span>`;
                        }).join("")}
                    </div>
                </article>
            `;
        }

        target.innerHTML = html;
    }

    function renderAllWebsites(targetId) {
        const data = getData();
        renderWebsiteList(targetId, data.websites);
    }

    function renderSiteDetail(targetId) {
        const data = getData();
        const target = document.getElementById(targetId);

        if (!target) {
            return;
        }

        const siteId = getQueryParam("id");
        const site = byId(data.websites, siteId);

        if (!site) {
            target.innerHTML = `
                <section class="panel">
                    <h2>Website not found.</h2>
                    <p>The selected website does not exist in this archive.</p>
                </section>
            `;
            return;
        }

        const snapshots = data.snapshots.filter(function (snapshot) {
            return snapshot.site_id === site.id;
        });

        const pages = data.pages.filter(function (page) {
            return page.site_id === site.id;
        });

        let snapshotHtml = "";

        for (const snapshot of snapshots) {
            snapshotHtml += `
                <li>
                    <strong>${escapeHtml(snapshot.label)}</strong><br>
                    Captured: ${escapeHtml(snapshot.captured)}<br>
                    Root Path: <code>${escapeHtml(snapshot.root_path)}</code>
                </li>
            `;
        }

        let pageHtml = "";

        for (const page of pages) {
            pageHtml += `
                <li>
                    ">${escapeHtml(page.title)}</a><br>
                    <span>${escapeHtml(page.summary)}</span>
                </li>
            `;
        }

        target.innerHTML = `
            <section class="panel">
                <div class="card-meta">${escapeHtml(site.domain)}</div>

                <h2>${escapeHtml(site.title)}</h2>

                <p>${escapeHtml(site.description)}</p>

                <p>
                    <strong>Original URL:</strong>
                    <code>${escapeHtml(site.original_url)}</code>
                </p>

                <h3>Tags</h3>
                <div class="tag-row">
                    ${(site.tags || []).map(function (tag) {
                        return `<span class="tag">${escapeHtml(tag)}</span>`;
                    }).join("")}
                </div>
            </section>

            <section class="panel">
                <h2>Snapshots</h2>
                <ul>
                    ${snapshotHtml || "<li>No snapshots recorded.</li>"}
                </ul>
            </section>

            <section class="panel">
                <h2>Archived Pages</h2>
                <ul>
                    ${pageHtml || "<li>No pages recorded.</li>"}
                </ul>
            </section>
        `;
    }

    function renderPageDetail(targetId) {
        const data = getData();
        const target = document.getElementById(targetId);

        if (!target) {
            return;
        }

        const pageId = getQueryParam("id");
        const page = byId(data.pages, pageId);

        if (!page) {
            target.innerHTML = `
                <section class="panel">
                    <h2>Page not found.</h2>
                    <p>The selected page does not exist in this archive.</p>
                </section>
            `;
            return;
        }

        const site = byId(data.websites, page.site_id);
        const snapshot = byId(data.snapshots, page.snapshot_id);

        target.innerHTML = `
            <section class="panel">
                <div class="card-meta">
                    ${site ? escapeHtml(site.title) : "Unknown Site"}
                </div>

                <h2>${escapeHtml(page.title)}</h2>

                <p>${escapeHtml(page.summary)}</p>

                <p>
                    <strong>Original URL:</strong>
                    <code>${escapeHtml(page.original_url)}</code>
                </p>

                <p>
                    <strong>Local Path:</strong>
                    <code>${escapeHtml(page.local_path)}</code>
                </p>

                <p>
                    <strong>Captured:</strong>
                    ${escapeHtml(page.captured)}
                </p>

                <p>
                    <strong>Snapshot:</strong>
                    ${snapshot ? escapeHtml(snapshot.label) : "Unknown Snapshot"}
                </p>

                <div class="tag-row">
                    ${(page.tags || []).map(function (tag) {
                        return `<span class="tag">${escapeHtml(tag)}</span>`;
                    }).join("")}
                </div>

                <hr>

                <p>
                    ">Open Archived Page</a>
                </p>
            </section>

            <section class="panel">
                <h2>Searchable Text</h2>
                <p>${escapeHtml(page.text)}</p>
            </section>
        `;
    }

    function pageMatchesQuery(page, query) {
        const data = getData();
        const site = byId(data.websites, page.site_id);

        const haystack = [
            page.id,
            page.title,
            page.original_url,
            page.local_path,
            page.summary,
            page.text,
            page.tags ? page.tags.join(" ") : "",
            site ? site.title : "",
            site ? site.domain : "",
            site ? site.description : ""
        ].join(" ");

        return normalize(haystack).includes(normalize(query));
    }

    function renderSearch(inputId, resultsId) {
        const data = getData();
        const input = document.getElementById(inputId);
        const results = document.getElementById(resultsId);

        if (!input || !results) {
            return;
        }

        function runSearch() {
            const query = input.value.trim();

            let matches = data.pages;

            if (query) {
                matches = data.pages.filter(function (page) {
                    return pageMatchesQuery(page, query);
                });
            }

            if (matches.length === 0) {
                results.innerHTML = `<p class="empty">No archived pages found.</p>`;
                return;
            }

            let html = "";

            for (const page of matches) {
                const site = byId(data.websites, page.site_id);

                html += `
                    <article class="card">
                        <div class="card-meta">
                            ${site ? escapeHtml(site.domain) : "Unknown Site"}
                        </div>

                        <h2>
                            ">${escapeHtml(page.title)}</a>
                        </h2>

                        <p>${escapeHtml(page.summary)}</p>

                        <p>
                            <strong>Original URL:</strong>
                            <code>${escapeHtml(page.original_url)}</code>
                        </p>

                        <div class="tag-row">
                            ${(page.tags || []).map(function (tag) {
                                return `<span class="tag">${escapeHtml(tag)}</span>`;
                            }).join("")}
                        </div>
                    </article>
                `;
            }

            results.innerHTML = html;
        }

        input.addEventListener("input", runSearch);
        runSearch();
    }

    function renderSitemap(targetId) {
        const data = getData();
        const target = document.getElementById(targetId);

        if (!target) {
            return;
        }

        let websiteHtml = "";

        for (const site of data.websites) {
            websiteHtml += `
                <li>
                    ">${escapeHtml(site.title)}</a>
                </li>
            `;
        }

        let pageHtml = "";

        for (const page of data.pages) {
            pageHtml += `
                <li>
                    ">${escapeHtml(page.title)}</a>
                </li>
            `;
        }

        target.innerHTML = `
            <section class="panel">
                <h2>Core Pages</h2>
                <ul>
                    <li><a href="home.html">Home</a></li>
                    <li>websites.htmlWebsites</a></li>
                    <li><a href="search.html">Search</a></li>
                    <li><a href="sitemap.html">Site Map</a></li>
                </ul>
            </section>

            <section class="panel">
                <h2>Archived Websites</h2>
                <ul>
                    ${websiteHtml || "<li>No websites recorded.</li>"}
                </ul>
            </section>

            <section class="panel">
                <h2>Archived Pages</h2>
                <ul>
                    ${pageHtml || "<li>No pages recorded.</li>"}
                </ul>
            </section>
        `;
    }

    window.AGW = {
        renderArchiveSummary: renderArchiveSummary,
        renderAllWebsites: renderAllWebsites,
        renderSiteDetail: renderSiteDetail,
        renderPageDetail: renderPageDetail,
        renderSearch: renderSearch,
        renderSitemap: renderSitemap
    };
})();