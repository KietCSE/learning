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
2. Viết mỗi bài là một `<section class="lesson">` với `id`, `data-part`, `data-title`, `data-minutes`, `data-updated` (YYYY-MM-DD), `data-done`, `data-summary`.
   Trong bài: `h2` = mục (hiện ở "Trong bài này"), `h3` = mục con, `.callout.note|tip|warning`, `<pre data-file="..."><code class="language-xxx">`, `<table>`, `.qa-list > details` cho câu hỏi tự kiểm tra.
3. Thêm entry vào `topics` trong `assets/data.js`: `id`, `title`, `category`, `status` (`learning|done|planned`), `desc`, `file`, `lessons`, `done`, `updated`.
   Topic chỉ dự định, chưa có bài: bỏ `file`, `lessons: 0`.

## Cập nhật tiến độ

- Học xong một bài: đặt `data-done="true"` trên section **và** tăng `done` của topic trong `data.js` (hai chỗ phải khớp).
- Thêm bài: thêm section và tăng `lessons` trong `data.js`.
- Ghi giờ học: thêm/cập nhật `studyLog["YYYY-MM-DD"] = <số phút>` trong `data.js`. Mục tiêu mặc định 120 phút/ngày.

## Cache

Các file trong `assets/` được nhúng kèm `?v=YYYYMMDD` (trong `index.html` và mọi `topics/*.html`).
Mỗi lần sửa `assets/*` (nhất là `data.js`), đổi số version ở **tất cả** các file HTML để người xem không bị dính bản cũ.

## Quy ước nội dung

- Viết tiếng Việt, giọng ngắn gọn, đúng kỹ thuật; thuật ngữ giữ tiếng Anh khi đó là tên gọi chuẩn.
- Không bịa số liệu học tập: chỉ ghi giờ học và trạng thái bài khi Kiệt báo.
