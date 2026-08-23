(function () {
    "use strict";
    window.AGW = window.AGW || {};

    // ---- Storage overlay -------------------------------------------------
    // Crawled sites are written here so they appear in the app immediately,
    // with zero file editing and zero dependencies. This is the offline
    // "database" that the Archiver writes into.
    const STORAGE_KEY = "agw_archive_overlay_v1";

    function emptyOverlay(){ return { websites: [], snapshots: [], pages: [], imports: [] }; }

    function readOverlay(){
        try {
            const raw = window.localStorage.getItem(STORAGE_KEY);
            if (!raw) return emptyOverlay();
            const parsed = JSON.parse(raw);
            return {
                websites: Array.isArray(parsed.websites) ? parsed.websites : [],
                snapshots: Array.isArray(parsed.snapshots) ? parsed.snapshots : [],
                pages: Array.isArray(parsed.pages) ? parsed.pages : [],
                imports: Array.isArray(parsed.imports) ? parsed.imports : []
            };
        } catch (e) { return emptyOverlay(); }
    }

    // Returns true on success, false if storage failed (e.g. quota exceeded).
    function writeOverlay(overlay){
        try {
            window.localStorage.setItem(STORAGE_KEY, JSON.stringify(overlay));
            return true;
        } catch (e) {
            return false;
        }
    }

    // Merge a fully-formed archived site (website + snapshot + pages + import)
    // into the overlay database. Returns true on success, false on failure.
    function saveArchivedSite(bundle){
        const overlay = readOverlay();
        if (bundle.website) overlay.websites.push(bundle.website);
        if (bundle.snapshot) overlay.snapshots.push(bundle.snapshot);
        if (Array.isArray(bundle.pages)) for (const p of bundle.pages) overlay.pages.push(p);
        if (bundle.import) overlay.imports.push(bundle.import);
        return writeOverlay(overlay);
    }

    function deleteArchivedWebsite(websiteId){
        const overlay = readOverlay();
        overlay.pages = overlay.pages.filter(p => p && p.website_id !== websiteId);
        overlay.snapshots = overlay.snapshots.filter(s => s && s.website_id !== websiteId);
        overlay.imports = overlay.imports.filter(i => i && i.website_id !== websiteId);
        overlay.websites = overlay.websites.filter(w => w && w.id !== websiteId);
        writeOverlay(overlay);
    }

    function clearOverlay(){ writeOverlay(emptyOverlay()); }

    function isArchivedWebsite(id){
        return readOverlay().websites.some(w => w && w.id === id);
    }

    // ---- Data access (base catalog + overlay merged) ---------------------
    function getData() {
        const source = window.AGW_DATA || {};
        const base = {
            archive: source.archive && typeof source.archive === "object" ? source.archive : {},
            websites: Array.isArray(source.websites) ? source.websites : [],
            snapshots: Array.isArray(source.snapshots) ? source.snapshots : [],
            pages: Array.isArray(source.pages) ? source.pages : [],
            imports: Array.isArray(source.imports) ? source.imports : []
        };
        const overlay = readOverlay();
        return {
            archive: base.archive,
            websites: base.websites.concat(overlay.websites),
            snapshots: base.snapshots.concat(overlay.snapshots),
            pages: base.pages.concat(overlay.pages),
            imports: base.imports.concat(overlay.imports)
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
    function renderLink(href, label, className, target){
        const safeHref = escapeHtml(href || "#");
        const safeLabel = escapeHtml(label || href || "Link");
        const cls = className ? ' class="' + escapeHtml(className) + '"' : "";
        const tgt = target ? ' target="' + escapeHtml(target) + '" rel="noopener noreferrer"' : "";
        return '<a href="' + safeHref + '"' + cls + tgt + '>' + safeLabel + '</a>';
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

    // A page is "renderable" if it has inline captured HTML OR a safe local path.
    function pageHasContent(page){
        return !!(page && (page.inline_html || isSafeLocalPath(page.local_path)));
    }

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
            if (!isSafeLocalPath(s.root_path) && !s.inline) warnings.push("Snapshot " + s.id + " has an invalid local root path."); }
        for (const p of data.pages) { if (!p || !p.id) continue;
            if (!websiteIds.has(p.website_id)) errors.push("Page " + p.id + " references missing website " + String(p.website_id || "") + ".");
            if (!snapshotIds.has(p.snapshot_id)) errors.push("Page " + p.id + " references missing snapshot " + String(p.snapshot_id || "") + ".");
            if (!pageHasContent(p)) warnings.push("Page " + p.id + " has no inline content and no valid local path."); }
        for (const i of data.imports) { if (!i || !i.id) continue;
            if (!websiteIds.has(i.website_id)) errors.push("Import " + i.id + " references missing website " + String(i.website_id || "") + ".");
            if (!snapshotIds.has(i.snapshot_id)) errors.push("Import " + i.id + " references missing snapshot " + String(i.snapshot_id || "") + ".");
            if (!isSafeLocalPath(i.root_path) && !i.inline) warnings.push("Import " + i.id + " has an invalid local root path."); }
        return { valid: errors.length === 0, errors, warnings };
    }

    AGW.core = {
        getData, escapeHtml, byId, getQueryParam, normalize, websiteLink, pageLink, snapshotLink,
        snapshotPages, websiteSnapshots, websitePages, websiteImports, renderLink, renderTags, renderNotFound,
        normalizeLocalPath, isSafeLocalPath, localArchiveLink, pageHasContent,
        snapshotIndexPath, snapshotPreferredPage, validateData,
        // storage overlay API
        readOverlay, saveArchivedSite, deleteArchivedWebsite, clearOverlay, isArchivedWebsite
    };
})();
