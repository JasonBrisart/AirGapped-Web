(function () {
    "use strict";
    window.AGW = window.AGW || {};

    function getData() {
        const source = window.AGW_DATA || {};
        return {
            archive: source.archive && typeof source.archive === "object" ? source.archive : {},
            websites: Array.isArray(source.websites) ? source.websites : [],
            snapshots: Array.isArray(source.snapshots) ? source.snapshots : [],
            pages: Array.isArray(source.pages) ? source.pages : [],
            imports: Array.isArray(source.imports) ? source.imports : []
        };
    }

    function escapeHtml(value) {
        if (value === null || value === undefined) return "";
        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    function byId(items, id) {
        if (!Array.isArray(items) || !id) return null;
        for (const item of items) {
            if (item && item.id === id) return item;
        }
        return null;
    }

    function getQueryParam(name) {
        return new URLSearchParams(window.location.search).get(name);
    }

    function normalize(value) {
        return String(value || "").trim().toLowerCase();
    }

    function websiteLink(websiteId) {
        return "website.html?id=" + encodeURIComponent(websiteId || "");
    }

    function pageLink(pageId) {
        return "page.html?id=" + encodeURIComponent(pageId || "");
    }

    function snapshotPages(snapshotId) {
        return getData().pages.filter(function (page) {
            return page && page.snapshot_id === snapshotId;
        });
    }

    function websiteSnapshots(websiteId) {
        return getData().snapshots.filter(function (snapshot) {
            return snapshot && snapshot.website_id === websiteId;
        });
    }

    function websitePages(websiteId) {
        return getData().pages.filter(function (page) {
            return page && page.website_id === websiteId;
        });
    }

    function websiteImports(websiteId) {
        return getData().imports.filter(function (importRecord) {
            return importRecord && importRecord.website_id === websiteId;
        });
    }

    function renderLink(href, label, className) {
        const safeHref = escapeHtml(href || "#");
        const safeLabel = escapeHtml(label || href || "Link");
        const classAttribute = className ? ' class="' + escapeHtml(className) + '"' : "";
        return '<a href="' + safeHref + '"' + classAttribute + '>' + safeLabel + '</a>';
    }

    function renderTags(tags) {
        if (!Array.isArray(tags) || tags.length === 0) {
            return '<span class="empty">No tags recorded.</span>';
        }
        return tags.map(function (tag) {
            return '<span class="tag">' + escapeHtml(tag) + '</span>';
        }).join("");
    }

    function renderNotFound(title, message) {
        return `
            <section class="panel">
                <h2>${escapeHtml(title)}</h2>
                <p>${escapeHtml(message)}</p>
                <p><a href="index.html">Return to Home</a></p>
            </section>
        `;
    }

    function normalizeLocalPath(path) {
        if (typeof path !== "string") return "";
        return path.trim().replace(/\\/g, "/");
    }

    function isSafeLocalPath(path) {
        const normalizedPath = normalizeLocalPath(path);
        if (!normalizedPath) return false;
        if (
            normalizedPath.startsWith("/") ||
            normalizedPath.startsWith("../") ||
            normalizedPath.includes("/../") ||
            normalizedPath.includes("://") ||
            normalizedPath.startsWith("//")
        ) {
            return false;
        }
        return normalizedPath.startsWith("records/") || normalizedPath.startsWith("archives/");
    }

    function localArchiveLink(path) {
        return isSafeLocalPath(path) ? normalizeLocalPath(path) : "";
    }

    function collectIds(items, recordType, errors) {
        const ids = new Set();
        for (const item of items) {
            if (!item || typeof item.id !== "string" || !item.id.trim()) {
                errors.push("A " + recordType + " record is missing an ID.");
                continue;
            }
            if (ids.has(item.id)) {
                errors.push("Duplicate " + recordType + " ID: " + item.id + ".");
            }
            ids.add(item.id);
        }
        return ids;
    }

    function validateData() {
        const data = getData();
        const errors = [];
        const warnings = [];
        const websiteIds = collectIds(data.websites, "website", errors);
        const snapshotIds = collectIds(data.snapshots, "snapshot", errors);
        const pageIds = collectIds(data.pages, "page", errors);
        collectIds(data.imports, "import", errors);

        for (const website of data.websites) {
            if (!website || !website.id) continue;
            if (Array.isArray(website.snapshot_ids)) {
                for (const snapshotId of website.snapshot_ids) {
                    if (!snapshotIds.has(snapshotId)) {
                        errors.push("Website " + website.id + " references missing snapshot " + snapshotId + ".");
                    }
                }
            }
        }

        for (const snapshot of data.snapshots) {
            if (!snapshot || !snapshot.id) continue;
            if (!websiteIds.has(snapshot.website_id)) {
                errors.push("Snapshot " + snapshot.id + " references missing website " + String(snapshot.website_id || "") + ".");
            }
            if (Array.isArray(snapshot.page_ids)) {
                for (const pageId of snapshot.page_ids) {
                    if (!pageIds.has(pageId)) {
                        errors.push("Snapshot " + snapshot.id + " references missing page " + pageId + ".");
                    }
                }
            }
            if (!isSafeLocalPath(snapshot.root_path)) {
                warnings.push("Snapshot " + snapshot.id + " has an invalid local root path.");
            }
        }

        for (const page of data.pages) {
            if (!page || !page.id) continue;
            if (!websiteIds.has(page.website_id)) {
                errors.push("Page " + page.id + " references missing website " + String(page.website_id || "") + ".");
            }
            if (!snapshotIds.has(page.snapshot_id)) {
                errors.push("Page " + page.id + " references missing snapshot " + String(page.snapshot_id || "") + ".");
            }
            if (!isSafeLocalPath(page.local_path)) {
                warnings.push("Page " + page.id + " has an invalid local path.");
            }
        }

        for (const importRecord of data.imports) {
            if (!importRecord || !importRecord.id) continue;
            if (!websiteIds.has(importRecord.website_id)) {
                errors.push("Import " + importRecord.id + " references missing website " + String(importRecord.website_id || "") + ".");
            }
            if (!snapshotIds.has(importRecord.snapshot_id)) {
                errors.push("Import " + importRecord.id + " references missing snapshot " + String(importRecord.snapshot_id || "") + ".");
            }
            if (!isSafeLocalPath(importRecord.root_path)) {
                warnings.push("Import " + importRecord.id + " has an invalid local root path.");
            }
        }

        return { valid: errors.length === 0, errors: errors, warnings: warnings };
    }

    AGW.core = {
        getData,
        escapeHtml,
        byId,
        getQueryParam,
        normalize,
        websiteLink,
        pageLink,
        snapshotPages,
        websiteSnapshots,
        websitePages,
        websiteImports,
        renderLink,
        renderTags,
        renderNotFound,
        normalizeLocalPath,
        isSafeLocalPath,
        localArchiveLink,
        validateData
    };
})();
