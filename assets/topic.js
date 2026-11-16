/*
 * Learning hub — topic page.
 * A topic file only holds <main id="lessons"> with one <section class="lesson"> per lesson.
 * This script builds the header, lesson menu (left), article chrome and "Trong bài này" (right).
 */
(function () {
  var LH = window.LH, I = LH.ICONS, esc = LH.esc;
  var LANG = { yaml: "YAML", yml: "YAML", bash: "Bash", sh: "Bash", shell: "Bash", console: "Terminal", json: "JSON", js: "JavaScript", javascript: "JavaScript", ts: "TypeScript", typescript: "TypeScript", python: "Python", py: "Python", go: "Go", rust: "Rust", sql: "SQL", html: "HTML", xml: "XML", css: "CSS", dockerfile: "Dockerfile", java: "Java", kotlin: "Kotlin", text: "Text", plaintext: "Text" };
  var CALLOUT = { note: ["Ghi chú", I.info], tip: ["Mẹo", I.bulb], warning: ["Quan trọng", I.alert] };

  document.addEventListener("DOMContentLoaded", function () {
    var src = document.getElementById("lessons");
    if (!src) return;
    var topicId = document.body.getAttribute("data-topic");
    var topic = ((window.LEARNING || {}).topics || []).filter(function (t) { return t.id === topicId; })[0] || {};
    var topicTitle = topic.title || document.title;
    var lessons = Array.prototype.slice.call(src.querySelectorAll("section.lesson"));
    lessons.forEach(function (s, i) {
      s.dataset.n = i + 1;
      if (!s.id) s.id = "bai-" + (i + 1);
    });
    var total = lessons.length;

    /* ---------- trạng thái đã học: data-done trong file HOẶC đánh dấu trong trình duyệt ---------- */
    var STORE = "lh-done:" + topicId;
    var localDone = [];
    try { localDone = JSON.parse(localStorage.getItem(STORE)) || []; } catch (e) {}
    function isDone(s) { return s.dataset.done === "true" || localDone.indexOf(s.id) !== -1; }
    function countDone() { return lessons.filter(isDone).length; }
    function setDone(s, done) {
      var i = localDone.indexOf(s.id);
      if (done && i === -1) localDone.push(s.id);
      if (!done && i !== -1) localDone.splice(i, 1);
      try {
        localStorage.setItem(STORE, JSON.stringify(localDone));
        localStorage.setItem("lh-progress:" + topicId, String(countDone()));   // portal đọc số này
      } catch (e) {}
    }
    try { localStorage.setItem("lh-progress:" + topicId, String(countDone())); } catch (e) {}
    var totalMin = lessons.reduce(function (a, s) { return a + (+s.dataset.minutes || 0) + (+s.dataset.practice || 0); }, 0);
    var hoursLabel = totalMin ? " · ≈ " + Math.round(totalMin / 60) + " giờ học" : "";

    /* ---------- page chrome ---------- */
    var shell = document.createElement("div");
    shell.innerHTML =
      '<header class="site-header"><div class="inner">' +
        '<a class="brand" href="../index.html"><span class="brand-mark"><svg class="icon" style="width:17px;height:17px" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg></span>Learning hub</a>' +
        '<button type="button" class="icon-btn" data-theme-toggle></button>' +
      "</div></header>" +
      '<div class="subbar"><div class="inner">' +
        '<div class="name"><button type="button" class="nav-toggle" aria-expanded="false" aria-controls="lesson-nav">' + I.list + "Bài học</button><b>" + esc(topicTitle) + "</b><span>" + esc(topic.category ? topic.category + " · " : "") + total + " bài" + hoursLabel + "</span></div>" +
        '<div class="prog"><span id="prog-text"></span><span class="progress"><span id="prog-bar"></span></span></div>' +
      "</div></div>" +
      '<div class="layout">' +
        '<nav class="lesson-nav" id="lesson-nav" aria-label="Danh sách bài">' +
          '<label class="field">' + I.filter + '<span class="sr-only">Lọc theo tiêu đề</span><input type="search" id="nav-filter" placeholder="Lọc theo tiêu đề" autocomplete="off"></label>' +
          '<div id="nav-groups"></div><div class="nav-empty" id="nav-empty" hidden>Không có bài nào khớp.</div>' +
        "</nav>" +
        '<div class="content">' +
          '<article class="article">' +
            '<ol class="crumbs" id="crumbs"></ol>' +
            '<h1 id="lesson-title"></h1>' +
            '<div class="meta" id="lesson-meta"></div>' +
            '<div id="lesson-body"></div>' +
            '<div id="done-slot"></div>' +
            '<div id="next-slot"></div>' +
            '<nav class="pager" id="pager" aria-label="Chuyển bài"></nav>' +
          "</article>" +
          '<aside class="toc" id="toc" aria-label="Trong bài này"></aside>' +
        "</div>" +
      "</div>" +
      '<footer class="site-footer"><div class="inner" style="max-width:none">Learning hub · ' + esc(topicTitle) + "</div></footer>";
    while (shell.firstChild) document.body.insertBefore(shell.firstChild, src);
    var body = document.getElementById("lesson-body");
    lessons.forEach(function (s) { body.appendChild(s); });
    src.remove();

    /* ---------- enhance content ---------- */
    lessons.forEach(function (s) {
      s.querySelectorAll("pre > code").forEach(function (code) {
        var pre = code.parentElement;
        var m = (code.className.match(/language-([\w-]+)/) || [])[1] || "";
        var file = pre.getAttribute("data-file") || code.getAttribute("data-file") || "";
        var wrap = document.createElement("div");
        wrap.className = "codeblock";
        wrap.innerHTML = '<div class="bar"><span><span class="lang">' + esc(LANG[m.toLowerCase()] || m || "Code") + "</span>" + (file ? '<span class="file">' + esc(file) + "</span>" : "") + '</span><button type="button" class="copy">' + I.copy + "<span>Copy</span></button></div>";
        pre.parentNode.insertBefore(wrap, pre);
        wrap.appendChild(pre);
        var btn = wrap.querySelector(".copy"), label = btn.querySelector("span");
        btn.addEventListener("click", function () {
          var text = code.textContent;
          var done = function () { label.textContent = "Đã copy"; setTimeout(function () { label.textContent = "Copy"; }, 1500); };
          if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done, fallback); else fallback();
          function fallback() {
            var ta = document.createElement("textarea"); ta.value = text; ta.style.position = "fixed"; ta.style.opacity = "0";
            document.body.appendChild(ta); ta.select();
            try { document.execCommand("copy"); done(); } catch (e) {}
            ta.remove();
          }
        });
        if (window.hljs && m && m !== "text" && m !== "plaintext") {
          try { window.hljs.highlightElement(code); } catch (e) {}
        }
        // data-add="3,5-7": highlight lines that were just added in this step.
        var add = pre.getAttribute("data-add");
        if (add) {
          var set = {};
          add.split(",").forEach(function (part) {
            var r = part.trim().split("-"), a = parseInt(r[0], 10), b = parseInt(r[1] || r[0], 10);
            for (var i = a; i <= b; i++) set[i] = true;
          });
          code.innerHTML = code.innerHTML.replace(/\n$/, "").split("\n").map(function (line, i) {
            return '<span class="ln' + (set[i + 1] ? " add" : "") + '">' + (line || "​") + "</span>";
          }).join("");
          var tag = document.createElement("span"); tag.className = "added"; tag.textContent = "■ dòng mới thêm";
          wrap.querySelector(".bar > span").appendChild(tag);
        }
      });
      s.querySelectorAll(".term").forEach(function (t) {
        var pre = t.querySelector("pre");
        if (!pre) return;
        pre.innerHTML = pre.innerHTML.replace(/^\n/, "").split("\n").map(function (line) {
          if (/^\$ /.test(line)) return '<span class="p">$</span> <span class="cmd">' + line.slice(2) + "</span>";
          if (/^# /.test(line)) return '<span class="cm">' + line + "</span>";
          return line;
        }).join("\n");
        var bar = document.createElement("div"); bar.className = "term-bar";
        bar.innerHTML = "<i></i><i></i><i></i><span>" + esc(t.getAttribute("data-title") || "Terminal") + "</span><em>ví dụ output</em>";
        t.insertBefore(bar, pre);
      });
      s.querySelectorAll("table").forEach(function (t) {
        if (t.parentElement.classList.contains("table-wrap")) return;
        var w = document.createElement("div"); w.className = "table-wrap";
        t.parentNode.insertBefore(w, t); w.appendChild(t);
      });
      s.querySelectorAll(".callout").forEach(function (c) {
        var kind = c.classList.contains("tip") ? "tip" : c.classList.contains("warning") ? "warning" : "note";
        var title = c.getAttribute("data-title") || CALLOUT[kind][0];
        var h = document.createElement("div"); h.className = "callout-title";
        h.innerHTML = CALLOUT[kind][1] + esc(title);
        c.insertBefore(h, c.firstChild);
      });
      s.querySelectorAll("h2").forEach(function (h, i) {
        if (!h.id) h.id = s.id + "-" + (i + 1);
      });
    });

    /* ---------- lesson menu ---------- */
    var groupsEl = document.getElementById("nav-groups");
    var parts = [];
    lessons.forEach(function (s) {
      var p = s.dataset.part || "Bài học";
      var g = parts.filter(function (x) { return x.name === p; })[0];
      if (!g) { g = { name: p, items: [] }; parts.push(g); }
      g.items.push(s);
    });
    groupsEl.innerHTML = parts.map(function (g) {
      return '<div class="nav-group" data-open="true"><button type="button" aria-expanded="true">' + I.chevron + esc(g.name) + "</button><ul>" +
        g.items.map(function (s) {
          return '<li><a href="#' + s.id + '" data-lesson="' + s.id + '"><span class="n">' + s.dataset.n + '</span><span class="t">' + esc(s.dataset.title || "") + "</span>" + '<span class="done-mark" title="Đã học">' + I.check + "</span></a></li>";
        }).join("") + "</ul></div>";
    }).join("");
    groupsEl.querySelectorAll(".nav-group > button").forEach(function (b) {
      b.addEventListener("click", function () {
        var g = b.parentElement, open = g.getAttribute("data-open") !== "true";
        g.setAttribute("data-open", open); b.setAttribute("aria-expanded", open);
      });
    });
    document.getElementById("nav-filter").addEventListener("input", function (e) {
      var q = e.target.value.trim().toLowerCase(), any = false;
      groupsEl.querySelectorAll(".nav-group").forEach(function (g) {
        var visible = 0;
        g.querySelectorAll("li").forEach(function (li) {
          var show = !q || li.textContent.toLowerCase().indexOf(q) !== -1;
          li.hidden = !show; if (show) visible++;
        });
        g.hidden = !visible;
        if (q && visible) g.setAttribute("data-open", "true");
        if (visible) any = true;
      });
      document.getElementById("nav-empty").hidden = any;
    });
    var nav = document.getElementById("lesson-nav");
    var toggle = document.querySelector(".nav-toggle");
    toggle.addEventListener("click", function () {
      var open = !nav.classList.contains("open");
      nav.classList.toggle("open", open); toggle.setAttribute("aria-expanded", open);
    });

    /* ---------- cập nhật mọi chỗ hiển thị tiến độ ---------- */
    var currentIdx = -1;
    function refreshProgress() {
      var n = countDone();
      document.getElementById("prog-text").textContent = "Đã học " + n + "/" + total;
      document.getElementById("prog-bar").style.width = (total ? Math.round(n / total * 100) : 0) + "%";
      groupsEl.querySelectorAll("a[data-lesson]").forEach(function (a) {
        var s = document.getElementById(a.getAttribute("data-lesson"));
        a.classList.toggle("is-done", !!s && isDone(s));
      });
      if (currentIdx < 0) return;
      var s = lessons[currentIdx], done = isDone(s);
      var pill = document.getElementById("lesson-pill");
      if (pill) {
        pill.className = "pill" + (done ? " done" : "");
        pill.textContent = "Bài " + (currentIdx + 1) + " / " + total + (done ? " · đã học" : "");
      }
      var slot = document.getElementById("done-slot");
      if (s.dataset.done === "true") {
        slot.innerHTML = '<div class="done-box is-done">' + I.check + "<span><b>Đã học xong bài này.</b></span></div>";
      } else if (done) {
        slot.innerHTML = '<div class="done-box is-done">' + I.check + '<span><b>Đã học xong bài này.</b> <span class="muted">Đánh dấu lưu trên trình duyệt này.</span></span>' +
          '<button type="button" class="btn-link" data-undo>Bỏ đánh dấu</button></div>';
      } else {
        slot.innerHTML = '<div class="done-box"><span><b>Học xong bài này?</b> <span class="muted">Đã chạy lại các lệnh và trả lời được phần Tự kiểm tra.</span></span>' +
          '<button type="button" class="btn-done" data-mark>' + I.check + "Đánh dấu đã học</button></div>";
      }
    }
    document.getElementById("done-slot").addEventListener("click", function (e) {
      if (currentIdx < 0) return;
      var s = lessons[currentIdx];
      if (e.target.closest("[data-mark]")) setDone(s, true);
      else if (e.target.closest("[data-undo]")) setDone(s, false);
      else return;
      refreshProgress();
    });

    /* ---------- show a lesson ---------- */
    // Highlight the section being read in "Trong bài này".
    var activeHeads = [], ticking = false;
    function spy() {
      ticking = false;
      if (!activeHeads.length) return;
      var current = activeHeads[0];
      activeHeads.forEach(function (h) { if (h.getBoundingClientRect().top < 140) current = h; });
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) current = activeHeads[activeHeads.length - 1];
      document.querySelectorAll("#toc a").forEach(function (a) { a.classList.toggle("active", a.getAttribute("data-target") === current.id); });
    }
    window.addEventListener("scroll", function () {
      if (!ticking) { ticking = true; requestAnimationFrame(spy); }
    }, { passive: true });

    function show(id, keepScroll) {
      var idx = -1;
      lessons.forEach(function (s, i) { if (s.id === id) idx = i; });
      if (idx < 0) return false;
      var s = lessons[idx];
      lessons.forEach(function (x) { x.classList.toggle("active", x === s); });

      groupsEl.querySelectorAll("a[data-lesson]").forEach(function (a) {
        var cur = a.getAttribute("data-lesson") === id;
        a.classList.toggle("current", cur);
        if (cur) {
          a.setAttribute("aria-current", "page");
          var r = a.getBoundingClientRect(), nr = nav.getBoundingClientRect();
          if (r.top < nr.top || r.bottom > nr.bottom) nav.scrollTop += r.top - nr.top - nr.height / 3;
        } else a.removeAttribute("aria-current");
      });

      var title = s.dataset.title || "";
      document.title = title + " — " + topicTitle;
      document.getElementById("lesson-title").textContent = title;
      document.getElementById("crumbs").innerHTML =
        '<li><a href="../index.html">Learning hub</a></li><li aria-hidden="true">/</li>' +
        "<li><a href=\"#" + lessons[0].id + "\">" + esc(topicTitle) + "</a></li>" +
        (s.dataset.part ? '<li aria-hidden="true">/</li><li>' + esc(s.dataset.part) + "</li>" : "");
      currentIdx = idx;
      var meta = '<span class="pill" id="lesson-pill"></span>';
      if (s.dataset.minutes) meta += "<span>" + I.clock + "Đọc " + s.dataset.minutes + " phút</span>";
      if (+s.dataset.practice > 0) meta += "<span>" + I.terminal + "Thực hành " + s.dataset.practice + " phút</span>";
      if (s.dataset.updated) meta += "<span>" + I.calendar + "Cập nhật " + esc(LH.viDate(s.dataset.updated)) + "</span>";
      document.getElementById("lesson-meta").innerHTML = meta;

      var prev = lessons[idx - 1], next = lessons[idx + 1];
      document.getElementById("next-slot").innerHTML = next
        ? '<a class="next-card" href="#' + next.id + '"><span class="ic">' + I.arrow + "</span><span><small>Bước tiếp theo · Bài " + (idx + 2) + "</small><b>" + esc(next.dataset.title || "") + "</b>" + (next.dataset.summary ? '<small style="margin-top:2px">' + esc(next.dataset.summary) + "</small>" : "") + "</span></a>"
        : "";
      document.getElementById("pager").innerHTML =
        (prev ? '<a href="#' + prev.id + '"><small>← Bài trước</small>' + (idx) + ". " + esc(prev.dataset.title || "") + "</a>" : "") +
        (next ? '<a class="next" href="#' + next.id + '"><small>Bài sau →</small>' + (idx + 2) + ". " + esc(next.dataset.title || "") + "</a>" : "");

      // "Trong bài này"
      var heads = Array.prototype.slice.call(s.querySelectorAll("h2"));
      var toc = document.getElementById("toc");
      toc.innerHTML = heads.length ? "<b>Trong bài này</b><ul>" + heads.map(function (h) {
        return '<li><a href="#' + h.id + '" data-target="' + h.id + '">' + esc(h.textContent) + "</a></li>";
      }).join("") + "</ul>" : "";
      toc.querySelectorAll("a").forEach(function (a) {
        a.addEventListener("click", function (e) {
          e.preventDefault();
          var t = document.getElementById(a.getAttribute("data-target"));
          if (t) t.scrollIntoView({ behavior: "smooth", block: "start" });
        });
      });
      activeHeads = heads;
      spy();
      refreshProgress();

      nav.classList.remove("open"); toggle.setAttribute("aria-expanded", "false");
      if (!keepScroll) window.scrollTo(0, 0);
      return true;
    }

    function route(initial) {
      var id = decodeURIComponent(location.hash.slice(1));
      if (id && show(id, initial && false)) return;
      // A hash pointing at a heading inside a lesson: open that lesson, then scroll.
      var el = id && document.getElementById(id);
      var owner = el && el.closest && el.closest("section.lesson");
      if (owner) { show(owner.id, true); el.scrollIntoView(); return; }
      var firstTodo = lessons.filter(function (s) { return !isDone(s); })[0] || lessons[0];
      if (firstTodo) show(firstTodo.id, true);
    }
    window.addEventListener("hashchange", function () { route(false); });
    route(true);

    /* ---------- tự đếm giờ học ----------
       Cứ 15 giây cộng 15 giây vào hôm nay, nếu: tab đang hiện và có thao tác trong 5 phút gần nhất. */
    var TICK = 15, IDLE = 5 * 60 * 1000, lastActive = Date.now();
    ["scroll", "mousemove", "keydown", "click", "touchstart"].forEach(function (ev) {
      window.addEventListener(ev, function () { lastActive = Date.now(); }, { passive: true });
    });
    setInterval(function () {
      if (document.visibilityState === "visible" && Date.now() - lastActive < IDLE) LH.study.add(TICK);
    }, TICK * 1000);
  });
})();
