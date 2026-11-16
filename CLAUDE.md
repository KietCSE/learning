# Learning hub

Bộ tài liệu học công nghệ mới của Kiệt, dạng HTML tĩnh: mở trực tiếp bằng trình duyệt hoặc host như file tĩnh (không cần build, không cần backend).
Người xem chỉ đọc. Mọi thay đổi nội dung do Claude làm theo yêu cầu, rồi deploy lại.

## Cấu trúc

- `index.html` — portal: lời chào, mục tiêu học mỗi ngày, biểu đồ nhiệt lịch học, lưới topic.
- `assets/data.js` — **nguồn dữ liệu duy nhất của portal**: `owner`, `goalMinutes`, `studyLog`, `topics`.
- `assets/style.css` — toàn bộ style (sáng/tối qua `html[data-theme]`).
- `assets/common.js` — theme, icon, helper định dạng. `assets/portal.js` — dựng portal. `assets/topic.js` — dựng trang topic.
- `topics/<id>.html` — mỗi topic một file; `topics/_template.html` là mẫu.

Không dùng `fetch()` (bị chặn trên `file://`): dữ liệu nằm trong `window.LEARNING` ở `data.js`.

## Thêm topic mới

1. Copy `topics/_template.html` → `topics/<id>.html`, đặt `<body data-topic="<id>">`.
2. Viết mỗi bài là một `<section class="lesson">` với `id`, `data-part`, `data-title`, `data-minutes` (đọc), `data-practice` (thực hành), `data-updated` (YYYY-MM-DD), `data-done`, `data-summary`.
   Trong bài: `h2` = mục (hiện ở "Trong bài này"), `h3` = mục con, `.callout.note|tip|warning` (đổi tiêu đề bằng `data-title`), `<pre data-file="..." data-add="3,5-7"><code class="language-xxx">` (data-add tô các dòng mới thêm), `<div class="term" data-title="..."><pre>$ lệnh\noutput</pre></div>` cho khung terminal, `<figure class="diagram"><svg class="dg">` cho sơ đồ, `<table>`, `.qa-list > details` cho câu hỏi tự kiểm tra.
3. Thêm entry vào `topics` trong `assets/data.js`: `id`, `title`, `category`, `status` (`learning|done|planned`), `desc`, `file`, `lessons`, `done`, `updated`.
   Topic chỉ dự định, chưa có bài: bỏ `file`, `lessons: 0`.

## Cập nhật tiến độ

- Kiệt tự bấm **"Đánh dấu đã học"** cuối mỗi bài: lưu trong localStorage của trình duyệt (`lh-done:<topicId>` = danh sách id bài, `lh-progress:<topicId>` = số bài cho portal). Chỉ có trên trình duyệt đó, không đồng bộ.
- Khi Kiệt nhờ ghi cố định (để mọi thiết bị đều thấy): đặt `data-done="true"` trên section **và** tăng `done` của topic trong `data.js` (hai chỗ phải khớp).
- Thêm bài: thêm section và tăng `lessons` trong `data.js`.
- Giờ học trên trình duyệt: trang bài học tự đếm (tab đang hiện + có thao tác trong 5 phút), portal có ô sửa số phút hôm nay. Lưu ở localStorage `lh-study-sec` = `{ "YYYY-MM-DD": số giây }`.
- Giờ học cố định (mọi thiết bị đều thấy): Kiệt nhờ thì thêm `studyLog["YYYY-MM-DD"] = <số phút>` trong `data.js`. Portal lấy **giá trị lớn hơn** giữa hai nguồn cho mỗi ngày. Mục tiêu mặc định 120 phút/ngày.

## Cache

Các file trong `assets/` được nhúng kèm `?v=YYYYMMDD` (trong `index.html` và mọi `topics/*.html`).
Mỗi lần sửa `assets/*` (nhất là `data.js`), đổi số version ở **tất cả** các file HTML để người xem không bị dính bản cũ.

## Quy ước nội dung

- Viết tiếng Việt, đúng kỹ thuật; thuật ngữ giữ tiếng Anh khi đó là tên gọi chuẩn.
- Không bịa số liệu học tập: chỉ ghi giờ học và trạng thái bài khi Kiệt báo.

## Cách viết một topic (Kiệt đã duyệt — giữ nguyên phong cách này, mẫu chuẩn: `topics/kubernetes.html`)

**Phạm vi theo 80/20.** Chia topic làm hai phần:
- **Phần 1 · Cốt lõi** — chỉ những khái niệm và lệnh dùng trong phần lớn công việc thật. Học kỹ.
- **Phần 2 · Nâng cao** — các chủ đề nâng cao, **độ dài vừa phải: khoảng 10 phút đọc mỗi bài** (Kiệt chốt 2026-11-16: ngắn kiểu “tra cứu” thì quá sơ sài, dài như sách thì quá dài). Mỗi bài: Cần nhớ → vấn đề ngắn + ví von 1–2 câu → **một** sơ đồ → **một** ví dụ làm từng bước có `data-add` + terminal kèm cách đọc → một khung cái bẫy → tự kiểm tra 2–3 câu → **“Hỏi AI để đi sâu hơn”** (3 câu). `data-part="2 · Nâng cao"`.

**Phần 1 viết như sổ ghi chép của người đang học, không phải trang code mẫu.** Mỗi bài:
1. Khung **"Cần nhớ"** 3–4 ý ở đầu bài (`callout note` + `data-title="Cần nhớ"`).
2. **Vấn đề trước, giải pháp sau**: vì sao cần thứ này, bắt đầu từ thứ đã biết.
3. **Giải thích bằng ví dụ đời thường** (vd: Pod như căn phòng, label như bảng tên) rồi mới tới định nghĩa.
4. **Sơ đồ SVG tự vẽ** cho mỗi khái niệm có cấu trúc/luồng — đổi màu theo theme, dùng đúng tên trong ví dụ, không chép hình có bản quyền.
5. **Làm từng bước**: YAML/code viết dần từng khối, mỗi bước tô dòng mới thêm bằng `data-add` và giải thích từng dòng. Thêm chức năng thì chỉ ra thêm dòng nào.
6. **Khung terminal sau mỗi lệnh**: output ví dụ thực tế + giải thích cách đọc từng cột/dòng; tô chỗ đáng chú ý (`<span class="hl|ok|err">`).
7. **Thí nghiệm** để tự thấy cơ chế (xóa Pod xem nó sống lại, đưa bản lỗi rồi rollback, “cái bẫy” hay gặp…).
8. Khung ghi chép cá nhân giọng người học: “Mình hiểu sai lúc đầu”, “Mình ghi nhớ thế này”.
9. Kết bài: **Tự kiểm tra** (đáp án ẩn trong `details`).
- **Giải thích cả các khái niệm lớn xung quanh, không chỉ cú pháp của công cụ.** Mỗi kiến thức đặt vào bức tranh chung: nó thuộc pattern/kiến trúc nào, tên gọi chuẩn trong ngành là gì, liên quan gì tới khái niệm khác.
  - Khi học xong một cơ chế, gọi đúng tên pattern của nó (vd: vòng lặp agent chính là **ReAct**; conditional edge là **routing**).
  - Có một bài dạng **bản đồ pattern/khái niệm** của lĩnh vực: tên chuẩn · là gì · khi nào dùng / không dùng · nối về bài đã học · bảng “gặp bài toán X thì chọn gì”.
  - Mục tiêu: Kiệt nắm *từ vựng* của ngành để đọc tài liệu, phỏng vấn, bàn thiết kế với team — và tự tra/hỏi AI chi tiết khi cần.
- Dùng **một app ví dụ xuyên suốt** cả topic, bài cuối Phần 1 ghép mọi thứ thành một dự án từ số 0.
- Bài 1 có bảng **thời gian học** và **lộ trình theo buổi 2 giờ**; mỗi bài có `data-minutes` + `data-practice`.
- Tránh: bài chỉ có vài dòng rồi đưa code; liệt kê lệnh dài dòng cần thuộc lòng; nhồi kiến thức hiếm dùng vào Phần 1.

**Quy trình:** viết và cho Kiệt xem local trước (`python3 -m http.server 5500` trong thư mục repo) — **không commit/push** cho tới khi Kiệt duyệt.
