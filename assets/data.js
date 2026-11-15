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
      desc: "9 bài cốt lõi học kỹ từng bước (Pod, Deployment, Service, ConfigMap, Ingress, debug, dựng app) và 6 bài tra cứu khi cần.",
      file: "topics/kubernetes.html",
      lessons: 15,
      done: 0,
      estimate: "≈ 10 giờ",
      updated: "2026-11-15"
    }
  ]
};
