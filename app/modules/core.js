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
            .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;").replace(/'/g, "&#039;");
    }
    function byId(items, id) {
        if (!Array.isArray(items) || !id) return null;
        for (const item of items) if (item && item.id === id) return item;
        return null;
    }
    function getQueryParam(name) { return new URLSearchParams(window.location.search).get(name); }
    function normalize(value) { return String(value || "").trim().toLowerCase(); }
    function websiteLink(id){ return "website.html?id=" + encodeURIComponent(id || ""); }
    function pageLink(id){ return "page.html?id=" + encodeURIComponent(id || ""); }
    function snapshotLink(id){ return "snapshot.html?id=" + encodeURIComponent(id || ""); }
    function snapshotPages(sid){ return getData().pages.filter(p => p && p.snapshot_id === sid); }
    function websiteSnapshots(wid){ return getData().snapshots.filter(s => s && s.website_id === wid); }
    function websitePages(wid){ return getData().pages.filter(p => p && p.website_id === wid); }
    function websiteImports(wid){ return getData().imports.filter(i => i && i.website_id === wid); }
    function renderLink(href, label, className){
        const safeHref = escapeHtml(href || "#");
        const safeLabel = escapeHtml(label || href || "Link");
        const cls = className ? ' class="' + escapeHtml(className) + '"' : "";
        return '<a href="' + safeHref + '"' + cls + '>' + safeLabel + '</a>';
    }
    function renderTags(tags){
        if (!Array.isArray(tags) || tags.length === 0) return '<span class="empty">No tags recorded.</span>';
        return tags.map(t => '<span class="tag">' + escapeHtml(t) + '</span>').join("");
    }
    function renderNotFound(title, message){
        return '<section class="panel"><h2>' + escapeHtml(title) + '</h2><p>' + escapeHtml(message) +
               '</p><p><a href="../../index.html">Return to Home</a></p></section>';
    }
    function normalizeLocalPath(path){ if (typeof path !== "string") return ""; return path.trim().replace(/\\/g, "/"); }
    function isSafeLocalPath(path){
        const p = normalizeLocalPath(path);
        if (!p) return false;
        if (p.startsWith("/") || p.startsWith("../") || p.includes("/../") || p.includes("://") || p.startsWith("//")) return false;
        return p.startsWith("records/") || p.startsWith("archives/");
    }
    function localArchiveLink(path){ return isSafeLocalPath(path) ? "../../archive/" + normalizeLocalPath(path) : ""; }
    function stripTrailingSlash(path){ return normalizeLocalPath(path).replace(/\/+$/, ""); }
    function snapshotIndexPath(snapshot){
        if (!snapshot || !snapshot.root_path) return "";
        return localArchiveLink(stripTrailingSlash(snapshot.root_path) + "/index.html");
    }
    function snapshotPreferredPage(snapshot, pages){
        if (!snapshot) return "";
        const list = Array.isArray(pages) ? pages : snapshotPages(snapshot.id);
        for (const page of list) {
            if (!page || !page.local_path) continue;
            const path = normalizeLocalPath(page.local_path).toLowerCase();
            if (path.endsWith("/index.html") || path.endsWith("/index.htm") ||
                path.endsWith("index.html") || path.endsWith("index.htm")) {
                return localArchiveLink(page.local_path);
            }
        }
        if (list.length > 0) return localArchiveLink(list[0].local_path);
        return snapshotIndexPath(snapshot);
    }
    function collectIds(items, recordType, errors){
        const ids = new Set();
        for (const item of items) {
            if (!item || typeof item.id !== "string" || !item.id.trim()) { errors.push("A " + recordType + " record is missing an ID."); continue; }
            if (ids.has(item.id)) errors.push("Duplicate " + recordType + " ID: " + item.id + ".");
            ids.add(item.id);
        }
        return ids;
    }
    function validateData(){
        const data = getData(); const errors = []; const warnings = [];
        const websiteIds = collectIds(data.websites, "website", errors);
        const snapshotIds = collectIds(data.snapshots, "snapshot", errors);
        const pageIds = collectIds(data.pages, "page", errors);
        collectIds(data.imports, "import", errors);
        for (const w of data.websites) { if (!w || !w.id) continue;
            if (Array.isArray(w.snapshot_ids)) for (const sid of w.snapshot_ids) if (!snapshotIds.has(sid)) errors.push("Website " + w.id + " references missing snapshot " + sid + "."); }
        for (const s of data.snapshots) { if (!s || !s.id) continue;
            if (!websiteIds.has(s.website_id)) errors.push("Snapshot " + s.id + " references missing website " + String(s.website_id || "") + ".");
            if (Array.isArray(s.page_ids)) for (const pid of s.page_ids) if (!pageIds.has(pid)) errors.push("Snapshot " + s.id + " references missing page " + pid + ".");
            if (!isSafeLocalPath(s.root_path)) warnings.push("Snapshot " + s.id + " has an invalid local root path."); }
        for (const p of data.pages) { if (!p || !p.id) continue;
            if (!websiteIds.has(p.website_id)) errors.push("Page " + p.id + " references missing website " + String(p.website_id || "") + ".");
            if (!snapshotIds.has(p.snapshot_id)) errors.push("Page " + p.id + " references missing snapshot " + String(p.snapshot_id || "") + ".");
            if (!isSafeLocalPath(p.local_path)) warnings.push("Page " + p.id + " has an invalid local path."); }
        for (const i of data.imports) { if (!i || !i.id) continue;
            if (!websiteIds.has(i.website_id)) errors.push("Import " + i.id + " references missing website " + String(i.website_id || "") + ".");
            if (!snapshotIds.has(i.snapshot_id)) errors.push("Import " + i.id + " references missing snapshot " + String(i.snapshot_id || "") + ".");
            if (!isSafeLocalPath(i.root_path)) warnings.push("Import " + i.id + " has an invalid local root path."); }
        return { valid: errors.length === 0, errors, warnings };
    }
    AGW.core = { getData, escapeHtml, byId, getQueryParam, normalize, websiteLink, pageLink, snapshotLink,
        snapshotPages, websiteSnapshots, websitePages, websiteImports, renderLink, renderTags, renderNotFound,
        normalizeLocalPath, isSafeLocalPath, localArchiveLink, snapshotIndexPath, snapshotPreferredPage, validateData };
})();
