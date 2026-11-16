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
      desc: "9 bài cốt lõi học kỹ từng bước (Pod, Deployment, Service, ConfigMap, Ingress, debug, dựng app) và 6 bài nâng cao (lưu trữ, autoscaling, Helm/GitOps, bảo mật, monitoring).",
      file: "topics/kubernetes.html",
      lessons: 15,
      done: 0,
      estimate: "≈ 14 giờ",
      updated: "2026-11-16"
    },
    {
      id: "langgraph",
      title: "LangGraph",
      category: "AI/ML",
      status: "learning",
      desc: "Dựng agent LLM bằng graph: State, Node, Edge, tool, bộ nhớ và bước duyệt của người — làm trợ lý CSKH từ số 0; nâng cao: production, web API, song song, multi-agent, test và deploy.",
      file: "topics/langgraph.html",
      lessons: 17,
      done: 0,
      estimate: "≈ 14 giờ",
      updated: "2026-11-16"
    },
    {
      id: "elasticsearch",
      title: "Elasticsearch",
      category: "Database",
      status: "learning",
      desc: "Search engine từ inverted index tới bool query, aggregation và tìm không dấu — dựng ô tìm kiếm sản phẩm bằng Python; nâng cao: semantic/hybrid, đồng bộ dữ liệu, log, vận hành.",
      file: "topics/elasticsearch.html",
      lessons: 16,
      done: 0,
      estimate: "≈ 12 giờ",
      updated: "2026-11-16"
    }
  ]
};
