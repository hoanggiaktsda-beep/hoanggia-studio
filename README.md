# HOANGGIA STUDIO V3.0

**Kiến trúc · Nội thất · Quy hoạch · Cảnh quan · Hình ảnh · Video**

Nền tảng local-first cho HOANGGIA AI.

## Đã triển khai
- Giao diện Dark Luxury tiếng Việt, responsive desktop / tablet / mobile.
- Dashboard và đăng ký phân hệ, đường dẫn GitHub và Edit AI hiện tại.
- Quản lý dự án trên trình duyệt, xuất/nhập JSON, nhân bản và sao lưu.
- Trình biên soạn Design/Edit/Video prompt và kiểm tra xung đột cơ bản.
- Thư viện vật liệu tham khảo, diện tích thủ công, BOQ theo đơn giá nhập.
- Thống kê kích thước, độ sáng, RGB ảnh bằng Canvas, không phải AI ngữ nghĩa.
- Nội suy Upscale PNG 2–4×, không phải AI siêu phân giải.
- Kiểm tra tài nguyên, service worker, PWA, kiểm thử Node.js, GitHub Actions.

## Giới hạn
Studio không tự tạo ảnh hay video bằng mô hình AI; không nhận diện đối tượng ảnh, không đọc DWG/Revit/3ds Max, không tìm báo giá thị trường; chưa có đồng bộ đám mây hoặc bộ máy vá các website khác. Visual AI chưa có nguồn xác minh.

## Chạy / thử nghiệm
Chạy Python HTTP server trên thư mục gốc ở cổng 8000 hoặc dùng GitHub Pages.
Kiểm thử: node --test tests/core.test.mjs
Kiểm tra cú pháp: node --check src/app.js
GitHub Pages: Settings → Pages → Source: GitHub Actions. Theo dõi deployment trên Actions để xác minh.

## Quy tắc phát triển
- Không để API key trong public source.
- Không gọi bộ xử lý cục bộ là mô hình AI khi chưa có model thật.
- Không thay thế các website AI độc lập khi chưa kiểm chứng tính năng.
- Sao lưu JSON và giữ rollback khi lên phiên bản.
- Tránh lưu dữ liệu nhạy cảm vào localStorage; dữ liệu trình duyệt không phải lưu trữ vĩnh viễn.

Xem docs/ARCHITECTURE.md.
