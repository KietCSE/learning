/* Learning hub — shared helpers: theme, icons, formatting */
(function () {
  var KEY = "lh-theme";

  function stored() {
    try { return localStorage.getItem(KEY); } catch (e) { return null; }
  }
  function apply(theme) {
    document.documentElement.setAttribute("data-theme", theme);
  }
  // Apply as early as possible (this script is loaded in <head>).
  var initial = stored() || (window.matchMedia && matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  apply(initial);

  function toggleTheme() {
    var next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
    apply(next);
    try { localStorage.setItem(KEY, next); } catch (e) {}
    updateThemeButtons();
  }
  function updateThemeButtons() {
    var dark = document.documentElement.getAttribute("data-theme") === "dark";
    document.querySelectorAll("[data-theme-toggle]").forEach(function (b) {
      b.setAttribute("aria-label", dark ? "Chuyển sang giao diện sáng" : "Chuyển sang giao diện tối");
      b.innerHTML = dark ? ICONS.sun : ICONS.moon;
    });
  }

  var svg = function (body, extra) {
    return '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"' + (extra || "") + ">" + body + "</svg>";
  };
  var ICONS = {
    moon: svg('<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>'),
    sun: svg('<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2m-7.07-17.07 1.41 1.41m11.32 11.32 1.41 1.41M2 12h2m16 0h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>'),
    search: svg('<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>'),
    filter: svg('<path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z"/>'),
    chevron: svg('<path d="m9 18 6-6-6-6"/>'),
    check: svg('<path d="M20 6 9 17l-5-5"/>', ' stroke-width="2.5"'),
    copy: svg('<rect width="14" height="14" x="8" y="8" rx="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>'),
    clock: svg('<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>'),
    calendar: svg('<rect width="18" height="18" x="3" y="4" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>'),
    arrow: svg('<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>'),
    info: svg('<circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>'),
    bulb: svg('<path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6M10 22h4"/>'),
    alert: svg('<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4M12 17h.01"/>'),
    list: svg('<path d="M3 12h18M3 6h18M3 18h18"/>'),
    terminal: svg('<path d="m4 17 6-6-6-6"/><path d="M12 19h8"/>')
  };

  function fmtMinutes(min) {
    var h = Math.floor(min / 60), m = min % 60;
    if (!h) return m + "p";
    return m ? h + "g " + m + "p" : h + "g";
  }
  function isoDate(d) {
    var mm = String(d.getMonth() + 1).padStart(2, "0"), dd = String(d.getDate()).padStart(2, "0");
    return d.getFullYear() + "-" + mm + "-" + dd;
  }
  function viDate(iso) {
    if (!iso) return "";
    var p = iso.split("-");
    return p.length === 3 ? p[2] + "/" + p[1] + "/" + p[0] : iso;
  }
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  // Delegated, so buttons created later by page scripts work too.
  document.addEventListener("click", function (e) {
    if (e.target.closest && e.target.closest("[data-theme-toggle]")) toggleTheme();
  });
  document.addEventListener("DOMContentLoaded", function () {
    // Run after page scripts have built their chrome.
    setTimeout(updateThemeButtons, 0);
  });

  window.LH = { ICONS: ICONS, fmtMinutes: fmtMinutes, isoDate: isoDate, viDate: viDate, esc: esc, refreshTheme: updateThemeButtons };
})();
