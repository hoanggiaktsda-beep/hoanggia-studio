# HOANGGIA STUDIO V3.0 — Unified Architecture
Đây là kiến trúc mục tiêu; không phải cam kết tất cả đã được triển khai.

## Six navigation groups
Tổng quan; Xưởng sáng tạo; Trí tuệ AI; Thư viện; Dự án; Hệ thống.

## Five original systems
Design, Edit, Video, Upscale, Visual. Nguồn Visual AI và deployment URL chưa xác minh đầy đủ. Design/Edit/Video có prompt composer nội bộ tại Studio, chưa có đồng bộ mã hoặc file hai chiều. Upscale là nội suy Canvas. Các công cụ AI cũ được giữ tách biệt.

## Technical and intelligence expansions
Plan parser PDF/DWG cần thư viện, thang đo, xác minh kích thước; Material AI cần catalog, PBR và provenance; BOQ AI cần khảo sát đơn giá, thuế, hao hụt và dữ liệu đo; CAD/BIM Bridge cần kiểm thử từng định dạng. Vision semantic segmentation đòi model inference và đánh giá độ chính xác.

## Module contract
id, label, version, capabilities, inputSchema, outputSchema, status, sourceRepo, deployedUrl, tests. Mỗi module phải có tình trạng triển khai trung thực.

## Project schema v1
schemaVersion:1; id; name; space; created; updated; notes; data; history.
Trước khi thêm cloud phải có schema migration, xác thực, quyền, upload asset và xóa dữ liệu.

## Safety and test gates
Local-first; không tracking; chống XSS; kiểm tra kích thước upload và bộ nhớ; backup; PWA cache version; no API keys; CI syntax/regression; browser E2E và manual UX trên desktop, tablet, mobile. Cần thử lỗi network/offline, service worker update, Safari/iOS PWA.

## Release stages
A. Kiểm kê và sao lưu nền cũ, CI cơ bản.
B. Studio shell, project storage, prompt, BOQ/Plan.
C. Bổ sung adapters import/export qua nguồn thực.
D. Nhận diện ảnh, đa góc nhìn, render adapters bằng model thật có kiểm tra quyền riêng tư.
E. Cloud và quan trắc theo yêu cầu, phân quyền, giá thành và rollback.
