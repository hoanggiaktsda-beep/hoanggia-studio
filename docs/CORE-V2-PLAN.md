# HOANGGIA Core V2 — kế hoạch triển khai

Trạng thái: Đặc tả kiến trúc, chưa tích hợp chạy thật.

## CEO và 8 phòng ban
HOANGGIA Core quản lý tri thức chung, phiên bản và hợp đồng dữ liệu. Design AI, Edit AI, Video AI, Upscale AI, Visual AI, Plan AI, Material AI, BOQ AI giữ logic nghiệp vụ riêng, không phụ thuộc vào tình trạng hoạt động của phòng ban khác.

## Quyền quyết định
- Design: công năng, hình học và tỷ lệ ưu tiên hơn bố cục camera.
- Edit: chỉ thay phạm vi được phép; bảo toàn ảnh tham chiếu, kiến trúc và camera.
- Video: với nội thất/kiến trúc, ưu tiên tính đúng của không gian trước thủ pháp điện ảnh; video điện ảnh độc lập ưu tiên đạo diễn và kể chuyện.
- Upscale: phục hồi hình ảnh, không tự ý đổi thiết kế.
- Visual: diễn họa đúng hình học, vật liệu và tỷ lệ.
- Plan: kích thước và thang đo phải có căn cứ.
- Material: thông số, nguồn gốc và mẫu vật liệu phải kiểm chứng.
- BOQ: không tự tạo khối lượng hay đơn giá khi thiếu dữ liệu.

## Điều kiện tích hợp
Chuẩn hóa id, version, capabilities, inputSchema, outputSchema, trạng thái thật; dữ liệu chuyển giao theo mã dự án và phiên bản. Có kiểm thử độc lập, kiểm thử liên thông, kiểm thử mất kết nối, sao lưu và khả năng quay lại phiên bản cũ. Không gọi quy tắc tĩnh là mô hình AI thực.
