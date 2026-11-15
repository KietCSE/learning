/*
 * Learning hub — dữ liệu duy nhất cho portal.
 * Claude cập nhật file này khi thêm topic, đổi tiến độ hoặc ghi giờ học.
 * Mở trực tiếp bằng file:// nên dữ liệu nằm trong JS, không dùng fetch().
 */
window.LEARNING = {
  owner: "Kiệt",
  goalMinutes: 120, // mục tiêu mỗi ngày: 2 giờ

  // Số phút học theo ngày, khóa dạng "YYYY-MM-DD".
  // Ví dụ: "2026-11-15": 95
  studyLog: {
  },

  // status: "learning" | "done" | "planned"
  // file: đường dẫn trang topic (bỏ trống nếu chưa có bài nào)
  // lessons: tổng số bài trong topic · done: số bài đã học
  topics: [
    {
      id: "kubernetes",
      title: "Kubernetes",
      category: "DevOps",
      status: "learning",
      desc: "Pod, Deployment, Service và cách cluster điều phối container.",
      file: "topics/kubernetes.html",
      lessons: 2,
      done: 0,
      updated: "2026-11-15"
    }
  ]
};
