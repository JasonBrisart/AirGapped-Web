(function () {
    "use strict";

    window.AGW = window.AGW || {};

    const core = AGW.core;

    function renderArchiveSummary(targetId) {
        const target = document.getElementById(targetId);

        if (!target) {
            return;
        }

        const data = core.getData();
        const archiveName =
            data.archive.name || "AirGapped-Web";
        const archiveDescription =
            data.archive.description ||
            "Portable offline website archive.";

        target.innerHTML = `
            <section class="panel">
                <h2>
                    ${core.escapeHtml(archiveName)}
                </h2>

                <p>
                    ${core.escapeHtml(archiveDescription)}
                </p>

                <div class="stats">
                    <div>
                        <strong>
                            ${data.websites.length}
                        </strong>
                        <span>Websites</span>
                    </div>

                    <div>
                        <strong>
                            ${data.pages.length}
                        </strong>
                        <span>Pages</span>
                    </div>

                    <div>
                        <strong>
                            ${data.snapshots.length}
                        </strong>
                        <span>Snapshots</span>
                    </div>

                    <div>
                        <strong>
                            ${data.imports.length}
                        </strong>
                        <span>Imports</span>
                    </div>
                </div>
            </section>
        `;
    }

    AGW.renderArchiveSummary = renderArchiveSummary;
})();