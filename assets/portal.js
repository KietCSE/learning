/* Learning hub — portal page */
(function () {
  var D = window.LEARNING || { topics: [], studyLog: {} };
  var LH = window.LH;
  var GOAL = D.goalMinutes || 120;
  var log = D.studyLog || {};
  var WEEKDAYS = ["Chủ nhật", "Thứ hai", "Thứ ba", "Thứ tư", "Thứ năm", "Thứ sáu", "Thứ bảy"];
  var SHORT = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];
  var STATUS = { learning: "Đang học", done: "Hoàn thành", planned: "Dự định" };

  var today = new Date(); today.setHours(0, 0, 0, 0);
  // Giờ học = lớn hơn giữa số ghi trong data.js và số đếm/nhập trên trình duyệt này.
  var localSec = LH.study.all();
  function minutesOn(d) {
    var k = LH.isoDate(d);
    return Math.max(Number(log[k]) || 0, Math.floor((localSec[k] || 0) / 60));
  }
  function addDays(d, n) { var x = new Date(d); x.setDate(x.getDate() + n); return x; }
  function $(id) { return document.getElementById(id); }

  /* ---- greeting ---- */
  $("greeting").textContent = "Chào " + (D.owner || "bạn");
  var todayMin = minutesOn(today);
  var remain = Math.max(0, GOAL - todayMin);
  var dateText = WEEKDAYS[today.getDay()] + ", " + LH.viDate(LH.isoDate(today));
  $("greet-sub").textContent = dateText + (remain ? " · hôm nay còn " + LH.fmtMinutes(remain) + " để đạt mục tiêu." : " · đã đạt mục tiêu hôm nay.");

  /* ---- goal panel ---- */
  $("goal-label").textContent = LH.fmtMinutes(GOAL);
  $("today-time").textContent = LH.fmtMinutes(todayMin);
  $("today-of").textContent = "/ " + LH.fmtMinutes(GOAL) + " hôm nay";
  $("today-bar").style.width = Math.min(100, Math.round(todayMin / GOAL * 100)) + "%";

  // Sửa tay số phút hôm nay (thời gian học ngoài site: gõ lệnh, xem video…)
  var editInput = $("today-edit");
  editInput.value = todayMin || "";
  $("today-save").addEventListener("click", function () {
    var v = parseInt(editInput.value, 10);
    LH.study.setMinutes(LH.isoDate(today), isNaN(v) ? 0 : Math.max(0, Math.min(v, 24 * 60)));
    location.reload();
  });
  editInput.addEventListener("keydown", function (e) { if (e.key === "Enter") $("today-save").click(); });

  var streak = 0;
  for (var d = addDays(today, -1); minutesOn(d) >= GOAL; d = addDays(d, -1)) streak++;
  if (todayMin >= GOAL) streak++;
  $("streak").textContent = streak;

  var goal30 = 0;
  for (var i = 0; i < 30; i++) if (minutesOn(addDays(today, -i)) >= GOAL) goal30++;
  $("goal30").textContent = goal30 + "/30";

  var monthMin = 0;
  for (var md = new Date(today.getFullYear(), today.getMonth(), 1); md <= today; md = addDays(md, 1)) monthMin += minutesOn(md);
  $("month-hours").textContent = (Math.round(monthMin / 6) / 10) + "g";
  $("month-label").textContent = "đã học trong tháng " + (today.getMonth() + 1);

  /* ---- heatmap: Tuần / Tháng / 6 tháng ---- */
  function level(m) { return m === 0 ? "" : m < 60 ? " l1" : m < 120 ? " l2" : m < 180 ? " l3" : " l4"; }
  function same(a, b) { return a.getTime() === b.getTime(); }
  function tipFor(day, m) { return SHORT[(day.getDay() + 6) % 7] + " " + day.getDate() + "/" + (day.getMonth() + 1) + ": " + (m ? LH.fmtMinutes(m) : "không học"); }
  function summarize(from, to) {
    var total = 0, active = 0, hit = 0;
    for (var d = new Date(from); d <= to && d <= today; d = addDays(d, 1)) {
      var m = minutesOn(d); total += m; if (m > 0) active++; if (m >= GOAL) hit++;
    }
    return total ? LH.fmtMinutes(total) + " · " + active + " ngày có học · " + hit + " ngày đạt mục tiêu" : "Chưa có dữ liệu trong khoảng này";
  }
  var monday = addDays(today, -((today.getDay() + 6) % 7));

  function renderWeek() {
    var html = '<div class="heat-week">';
    for (var k = 0; k < 7; k++) {
      var day = addDays(monday, k), future = day > today, m = future ? 0 : minutesOn(day);
      html += '<div class="wd"><b>' + SHORT[k] + "</b><span>" + day.getDate() + "/" + (day.getMonth() + 1) + "</span>" +
        '<span class="cell' + (future ? " future" : level(m)) + (same(day, today) ? " today" : "") + '" title="' + (future ? "" : tipFor(day, m)) + '">' + (future ? "" : (m ? LH.fmtMinutes(m) : "–")) + "</span></div>";
    }
    return { title: "Lịch học tuần này", html: html + "</div>", summary: summarize(monday, addDays(monday, 6)) };
  }

  function renderMonth() {
    var first = new Date(today.getFullYear(), today.getMonth(), 1);
    var last = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    var html = '<div class="heat-month">';
    SHORT.forEach(function (s) { html += '<span class="dn">' + s + "</span>"; });
    for (var b = 0; b < (first.getDay() + 6) % 7; b++) html += '<span class="blank"></span>';
    for (var day = new Date(first); day <= last; day = addDays(day, 1)) {
      var future = day > today, m = future ? 0 : minutesOn(day);
      html += '<span class="cell' + (future ? " future" : level(m)) + (same(day, today) ? " today" : "") + '" title="' + (future ? "" : tipFor(day, m)) + '">' + day.getDate() + "</span>";
    }
    return { title: "Lịch học tháng " + (today.getMonth() + 1) + "/" + today.getFullYear(), html: html + "</div>", summary: summarize(first, last) };
  }

  function render6m() {
    var WEEKS = 26, start = addDays(monday, -(WEEKS - 1) * 7);
    var html = '<div class="heat-scroll"><div class="heat-grid"><span class="lbl"></span>';
    SHORT.forEach(function (s, idx) { html += '<span class="lbl">' + (idx % 2 === 0 || idx === 6 ? s : "") + "</span>"; });
    var lastMonth = -1;
    for (var w = 0; w < WEEKS; w++) {
      var first = addDays(start, w * 7), label = "";
      if (first.getMonth() !== lastMonth) { if (w > 0) label = "Th" + (first.getMonth() + 1); lastMonth = first.getMonth(); }
      html += '<span class="lbl">' + label + "</span>";
      for (var k = 0; k < 7; k++) {
        var day = addDays(first, k);
        if (day > today) { html += '<span class="cell future"></span>'; continue; }
        var m = minutesOn(day);
        html += '<span class="cell' + level(m) + (same(day, today) ? " today" : "") + '" title="' + tipFor(day, m) + '"></span>';
      }
    }
    return { title: "Lịch học 6 tháng qua", html: html + "</div></div>", summary: summarize(start, today) };
  }

  var RANGES = { week: renderWeek, month: renderMonth, "6m": render6m };
  var RKEY = "lh-heat-range";
  function showRange(r) {
    if (!RANGES[r]) r = "week";
    var out = RANGES[r]();
    $("heat-title").textContent = out.title;
    $("heat-view").innerHTML = out.html;
    $("heat-summary").textContent = out.summary;
    document.querySelectorAll(".seg [data-range]").forEach(function (b) { b.setAttribute("aria-pressed", b.getAttribute("data-range") === r); });
    var sc = document.querySelector("#heat-view .heat-scroll");
    if (sc) sc.scrollLeft = sc.scrollWidth; // newest weeks first on narrow screens
    try { localStorage.setItem(RKEY, r); } catch (e) {}
  }
  document.querySelectorAll(".seg [data-range]").forEach(function (b) {
    b.addEventListener("click", function () { showRange(b.getAttribute("data-range")); });
  });
  var savedRange = null;
  try { savedRange = localStorage.getItem(RKEY); } catch (e) {}
  showRange(savedRange || "week");

  /* ---- topics ---- */
  $("search-icon").outerHTML = LH.ICONS.search;
  var topics = D.topics || [];
  $("topic-count").textContent = topics.length + " topic · chọn một topic để đọc bài.";

  function card(t) {
    var total = t.lessons || 0, done = t.done || 0;
    // Tiến độ đánh dấu trên trình duyệt (trang topic ghi vào đây) — đã gồm cả bài đánh dấu trong file.
    try { var local = localStorage.getItem("lh-progress:" + t.id); if (local !== null) done = Math.max(done, +local); } catch (e) {}
    done = Math.min(done, total);
    var pct = total ? Math.round(done / total * 100) : 0;
    var tag = t.file ? "a" : "div";
    var href = t.file ? ' href="' + LH.esc(t.file) + '"' : "";
    return "<" + tag + ' class="topic-card"' + href + ">" +
      '<div class="top"><span class="title">' + LH.esc(t.title) + '</span><span class="pill ' + t.status + '">' + (STATUS[t.status] || "") + "</span></div>" +
      "<p>" + LH.esc(t.desc) + "</p>" +
      '<div class="foot"><span class="progress ' + t.status + '"><span style="width:' + pct + '%"></span></span>' +
      "<span>" + (total ? done + "/" + total + " bài" : "Chưa có bài") + (t.estimate ? " · " + LH.esc(t.estimate) : "") + "</span></div>" +
      "</" + tag + ">";
  }
  function render(q) {
    var needle = (q || "").trim().toLowerCase();
    var list = topics.filter(function (t) {
      return !needle || [t.title, t.desc, t.category].join(" ").toLowerCase().indexOf(needle) !== -1;
    });
    $("topics").innerHTML = list.map(card).join("");
    $("empty").hidden = list.length > 0;
    if (!topics.length) $("empty").textContent = "Chưa có topic nào.";
  }
  $("search").addEventListener("input", function (e) { render(e.target.value); });
  render("");

  var lastUpdate = topics.map(function (t) { return t.updated || ""; }).sort().pop();
  $("footer").textContent = "Learning hub" + (lastUpdate ? " · cập nhật " + LH.viDate(lastUpdate) : "");
})();
