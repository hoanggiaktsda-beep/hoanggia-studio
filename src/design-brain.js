export const DESIGN_DOMAINS=Object.freeze({
"Nội thất":["Công năng và lưu thông","Kích thước đồ nội thất","Vật liệu và ánh sáng"],
"Kiến trúc":["Hình khối và tiếp cận","Kết cấu cần kiểm chứng","Quy chuẩn địa phương"],
"Quy hoạch":["Sử dụng đất","Giao thông và hạ tầng","Chỉ tiêu pháp lý cần kiểm chứng"],
"Cảnh quan":["Địa hình và khí hậu","Thoát nước và cây trồng","Lối đi và bảo trì"]
});
export function designReview(input={}){
 const space=Object.hasOwn(DESIGN_DOMAINS,input.space)?input.space:"Nội thất";
 return {space,checks:[...DESIGN_DOMAINS[space]],requiresMeasurements:!input.measurementsVerified,requiresSiteVerification:!input.siteVerified};
}
