(function () {
    "use strict";
    window.AGW = window.AGW || {};
    function getData() {
        const source = window.AGW_DATA || {};
        return {
            archive: source.archive || {},
            imports: Array.isArray(source.imports) ? source.imports : [],
            websites: Array.isArray(source.websites) ? source.websites : [],
            pages: Array.isArray(source.pages) ? source.pages : [],
            snapshots: Array.isArray(source.snapshots) ? source.snapshots : []
        };
    }
    function escapeHtml(value) {
        if (value === null || value === undefined) {
            return "";
        }
        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
    function byId(items, id) {
        if (!Array.isArray(items) || !id) {
            return null;
        }
        for (const item of items) {
            if (item && item.id === id) {
                return item;
            }
        }
        return null;
    }
    function getQueryParam(name) {
        const parameters = new URLSearchParams(window.location.search);
        return parameters.get(name);
    }
    function normalize(value) {
        return String(value || "").trim().toLowerCase();
    }
    function siteLink(siteId) {
        return "site.html?id=" + encodeURIComponent(siteId);
    }
    function pageLink(pageId) {
        return "page.html?id=" + encodeURIComponent(pageId);
    }
    function snapshotPages(snapshotId) {
        const data = getData();
        return data.pages.filter(function (page) {
            return page.snapshot_id === snapshotId;
        });
    }
    function siteSnapshots(siteId) {
        const data = getData();
        return data.snapshots.filter(function (snapshot) {
            return snapshot.site_id === siteId;
        });
    }
    function sitePages(siteId) {
        const data = getData();
        return data.pages.filter(function (page) {
            return page.site_id === siteId;
        });
    }
    function siteImports(siteId) {
        const data = getData();
        return data.imports.filter(function (importRecord) {
            return importRecord.site_id === siteId;
        });
    }
    function renderLink(href, label, className) {
        const safeHref = escapeHtml(href);
        const safeLabel = escapeHtml(label);
        const classAttribute = className
            ? ' class="' + escapeHtml(className) + '"'
            : "";
        return (
            '<a href="' +
            safeHref +
            '"' +
            classAttribute +
            '>' +
            safeLabel +
            "</a>"
        );
    }
    function renderTags(tags) {
        if (!Array.isArray(tags) || tags.length === 0) {
            return '<span class="empty">No tags recorded.</span>';
        }
        return tags.map(function (tag) {
            return '<span class="tag">' + escapeHtml(tag) + "</span>";
        }).join("");
    }
    function renderNotFound(title, message) {
        return `
            <section class="panel">
                <h2>${escapeHtml(title)}</h2>
                <p>${escapeHtml(message)}</p>
            </section>
        `;
    }
    AGW.core = {
        getData: getData,
        escapeHtml: escapeHtml,
        byId: byId,
        getQueryParam: getQueryParam,
        normalize: normalize,
        siteLink: siteLink,
        pageLink: pageLink,
        snapshotPages: snapshotPages,
        siteSnapshots: siteSnapshots,
        sitePages: sitePages,
        siteImports: siteImports,
        renderLink: renderLink,
        renderTags: renderTags,
        renderNotFound: renderNotFound
    };
})();