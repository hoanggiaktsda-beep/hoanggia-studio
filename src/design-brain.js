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

export function designAudit(c={}){
 const warnings=[],width=String(c.width||"").trim(),depth=String(c.depth||"").trim();
 const w=Number(width),d=Number(depth);
 const complete=width!==""&&depth!=="";
 const valid=complete&&Number.isFinite(w)&&Number.isFinite(d)&&w>0&&d>0&&w<=100000&&d<=100000;
 if(width||depth){if(!valid)warnings.push("Chiều rộng và chiều sâu phải là số dương hợp lệ (m).");}
 else warnings.push("Chưa có kích thước mặt bằng để kiểm tra bố trí.");
 if(!String(c.constraints||"").trim())warnings.push("Chưa khai báo điều kiện hiện trạng và ràng buộc kỹ thuật.");
 if(!String(c.furniture||"").trim()&&c.space==="Nội thất")warnings.push("Chưa có danh sách và kích thước sản phẩm nội thất.");
 return {area:valid?Math.round(w*d*100)/100:null,warnings,verified:false};
}
