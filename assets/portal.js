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
  function minutesOn(d) { return Number(log[LH.isoDate(d)]) || 0; }
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

  /* ---- heatmap: 26 weeks, Monday-first, ending this week ---- */
  var WEEKS = 26;
  var dow = (today.getDay() + 6) % 7;
  var start = addDays(today, -dow - (WEEKS - 1) * 7);
  var grid = $("heatmap");
  var html = '<span class="lbl day-lbl"></span>';
  SHORT.forEach(function (s, idx) { html += '<span class="lbl day-lbl">' + (idx % 2 === 0 || idx === 6 ? s : "") + "</span>"; });
  var lastMonth = -1, totalMin = 0, activeDays = 0;
  for (var w = 0; w < WEEKS; w++) {
    var first = addDays(start, w * 7);
    var label = "";
    if (first.getMonth() !== lastMonth) { if (w > 0) label = "Th" + (first.getMonth() + 1); lastMonth = first.getMonth(); }
    html += '<span class="lbl">' + label + "</span>";
    for (var k = 0; k < 7; k++) {
      var day = addDays(first, k);
      if (day > today) { html += '<span class="cell future"></span>'; continue; }
      var m = minutesOn(day);
      totalMin += m; if (m > 0) activeDays++;
      var lvl = m === 0 ? "" : m < 60 ? " l1" : m < 120 ? " l2" : m < 180 ? " l3" : " l4";
      var isToday = day.getTime() === today.getTime() ? " today" : "";
      var tip = SHORT[k] + " " + day.getDate() + "/" + (day.getMonth() + 1) + ": " + (m ? LH.fmtMinutes(m) : "không học");
      html += '<span class="cell' + lvl + isToday + '" title="' + tip + '"></span>';
    }
  }
  grid.innerHTML = html;
  $("heat-summary").textContent = activeDays ? (Math.round(totalMin / 6) / 10) + " giờ · " + activeDays + " ngày có học" : "Chưa có dữ liệu";
  // Show the most recent weeks first on narrow screens.
  var scroller = grid.parentElement; scroller.scrollLeft = scroller.scrollWidth;

  /* ---- topics ---- */
  $("search-icon").outerHTML = LH.ICONS.search;
  var topics = D.topics || [];
  $("topic-count").textContent = topics.length + " topic · chọn một topic để đọc bài.";

  function card(t) {
    var total = t.lessons || 0, done = Math.min(t.done || 0, total);
    var pct = total ? Math.round(done / total * 100) : 0;
    var tag = t.file ? "a" : "div";
    var href = t.file ? ' href="' + LH.esc(t.file) + '"' : "";
    return "<" + tag + ' class="topic-card"' + href + ">" +
      '<div class="top"><span class="title">' + LH.esc(t.title) + '</span><span class="pill ' + t.status + '">' + (STATUS[t.status] || "") + "</span></div>" +
      "<p>" + LH.esc(t.desc) + "</p>" +
      '<div class="foot"><span class="progress ' + t.status + '"><span style="width:' + pct + '%"></span></span>' +
      "<span>" + (total ? done + "/" + total + " bài" : "Chưa có bài") + "</span></div>" +
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
