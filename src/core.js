/* HOANGGIA STUDIO — reusable deterministic intelligence layer. No external API or fake model inference. */
export const VERSION="3.0.0";
export const MODULES=[
{id:"design",label:"Design AI",vi:"Thiết kế không gian",group:"creative",icon:"◈",status:"local",repo:"https://github.com/hoanggiaktsda-beep/hoanggia-ai-studio",detail:"Biên soạn định hướng kiến trúc, nội thất, quy hoạch, cảnh quan"},
{id:"edit",label:"Edit AI",vi:"Chỉnh sửa & đồng bộ",group:"creative",icon:"▧",status:"local",repo:"https://github.com/hoanggiaktsda-beep/hoanggia-studioai",live:"https://hoanggiaktsda-beep.github.io/hoanggia-studioai/",detail:"ReferenceReplica, SpaceSync, khóa kiến trúc và góc máy"},
{id:"video",label:"Video AI",vi:"Kịch bản & camera",group:"creative",icon:"▷",status:"local",repo:"https://github.com/hoanggiaktsda-beep/prompt-ai-videos",detail:"Shot sequence, nhân vật, ánh sáng và chuyển động"},
{id:"upscale",label:"Upscale AI",vi:"Nâng cấp ảnh",group:"creative",icon:"⬡",status:"local",repo:"https://github.com/hoanggiaktsda-beep/HG-UPSCALE-AI",detail:"Phóng ảnh trên trình duyệt, không tự nhận là AI siêu phân giải"},
{id:"visual",label:"Visual AI",vi:"Trực quan hóa",group:"creative",icon:"◇",status:"planned",detail:"Chưa xác minh ứng dụng nguồn để kết nối"},
{id:"plan",label:"Plan AI",vi:"Phân tích diện tích",group:"technical",icon:"▤",status:"local",detail:"Dữ liệu đo nhập thủ công, tính diện tích cơ bản"},
{id:"material",label:"Material AI",vi:"Thư viện vật liệu",group:"technical",icon:"▦",status:"local",detail:"Bảng vật liệu tham chiếu, không phải dữ liệu nhà cung cấp"},
{id:"boq",label:"BOQ AI",vi:"Khối lượng & dự toán",group:"technical",icon:"≡",status:"local",detail:"Dự toán theo số liệu và đơn giá do người dùng nhập"},
{id:"vision",label:"HG Vision",vi:"Đọc thông số ảnh",group:"intelligence",icon:"◎",status:"limited",detail:"Phân tích điểm ảnh và màu sắc, chưa có nhận diện đối tượng bằng mô hình thị giác"},
{id:"expert",label:"HG Expert Brain",vi:"Bộ não chuyên gia",group:"intelligence",icon:"✳",status:"local",detail:"Quy tắc thiết kế và kiểm soát mâu thuẫn điều kiện"}];
export const SPACES=["Nội thất","Kiến trúc","Quy hoạch","Cảnh quan"];
export const STYLES=["Minimal Luxury","Contemporary","Modern","Neo Classic","Wabi-Sabi","Japandi","Luxury","Bauhaus","Biophilic","Tropical Coastal","Industrial","Classic"];
export const EXPERTS=["Furniture / Citterio","Material / Zumthor","Lighting / Ingo Maurer","Camera / Iwan Baan","Removal","AspectRatio","ReferenceReplica","SpaceSync","Storyboard"];
export const MATERIALS=[
{name:"Travertine",type:"Đá tự nhiên",color:"#b9ab91",properties:"Vân rỗng đặc trưng; cân nhắc chống thấm và hoàn thiện bề mặt."},
{name:"Calacatta",type:"Đá marble",color:"#e2ddd0",properties:"Vân biến thiên theo từng tấm; kiểm tra mẫu thực."},
{name:"Oak Veneer",type:"Gỗ veneer",color:"#a78761",properties:"Kiểm soát chiều vân, lớp phủ và độ ẩm."},
{name:"Walnut",type:"Gỗ veneer",color:"#634736",properties:"Sắc nâu trầm; cần mẫu đồng nhất theo lô."},
{name:"Brushed Brass",type:"Kim loại",color:"#ae9568",properties:"Cần chỉ định lớp phủ, chống oxy hóa và vết tay."},
{name:"Saddle Leather",type:"Da",color:"#795743",properties:"Xác minh nguồn da, cách bảo dưỡng và chống ẩm."},
{name:"Linen",type:"Vải",color:"#c9c0aa",properties:"Kiểm tra độ bền mài mòn và chống bám bẩn."},
{name:"Smoked Glass",type:"Kính",color:"#66716a",properties:"Cân nhắc độ truyền sáng, an toàn và độ dày."}];
export function newProject(name="Dự án không tên"){return {schemaVersion:1,id:"hg-"+Date.now()+"-"+Math.random().toString(36).slice(2,7),name,space:"Nội thất",created:new Date().toISOString(),updated:new Date().toISOString(),notes:"",data:{},history:[]};}
export function safeText(s,max=5000){return String(s??"").replace(/[\u0000-\u001f\u007f]/g," ").trim().slice(0,max);}
export function validateProject(p){return !!p&&typeof p==="object"&&p.schemaVersion===1&&typeof p.id==="string"&&p.id.length<=100&&typeof p.name==="string"&&p.name.length<=200&&!!p.data&&typeof p.data==="object"&&!Array.isArray(p.data)&&Array.isArray(p.history)&&p.history.length<=200;}
export function area(w,h){let a=Number(w),b=Number(h);if(!Number.isFinite(a)||!Number.isFinite(b)||a<=0||b<=0||a>100000||b>100000)return null;return Math.round(a*b*100)/100;}
export function boq(rows){let out=[],total=0;for(const x of rows){let q=Number(x.qty),p=Number(x.price);if(!x.name||!Number.isFinite(q)||!Number.isFinite(p)||q<0||p<0||q>1e9||p>1e15)continue;let cost=q*p;if(!Number.isFinite(cost))continue;total+=cost;out.push({...x,qty:q,price:p,cost});}return{rows:out,total};}
export function promptQuality(c){let warnings=[];if(!safeText(c.brief))warnings.push("Thiếu mô tả thiết kế.");if(c.preserve==="yes"&&c.task==="create")warnings.push("Tạo mới và giữ nguyên kiến trúc: cần làm rõ ảnh gốc hoặc đổi nhiệm vụ.");if(c.reference==="yes"&&!c.referenceProvided)warnings.push("Đang yêu cầu tham chiếu nhưng chưa xác nhận có ảnh tham chiếu.");if(c.mode==="video"&&!c.shots)warnings.push("Chưa định nghĩa số cảnh quay.");return{ok:warnings.length===0,warnings};}
export function compilePrompt(c){const v=x=>safeText(x,1200);const lines=["HOANGGIA STUDIO V3.0 — "+(c.mode==="video"?"VIDEO DIRECTOR":c.mode==="edit"?"IMAGE EDIT":"DESIGN INTELLIGENCE"),"Nhiệm vụ: "+(c.task==="create"?"Tạo phương án thiết kế":c.mode==="video"?"Lập chuỗi cảnh":"Chỉnh sửa / đồng bộ")+".","Không gian: "+v(c.space||"Nội thất")+(c.zone?" — "+v(c.zone):"")+".","Phong cách: "+v(c.style||"Contemporary")+"."];if(c.place)lines.push("Địa điểm / bối cảnh: "+v(c.place)+".");if(c.time)lines.push("Thời gian: "+v(c.time)+".");if(c.brief)lines.push("Ý định thiết kế: "+v(c.brief)+".");if(c.material)lines.push("Vật liệu: "+v(c.material)+".");if(c.light)lines.push("Ánh sáng: "+v(c.light)+".");if(c.camera)lines.push("Camera: "+v(c.camera)+".");if(c.mode==="edit"||c.preserve==="yes")lines.push("Ràng buộc: giữ nguyên hình học kiến trúc, bố cục mặt bằng, vị trí camera và phối cảnh; chỉ thay đổi phạm vi được chỉ định.");if(c.mode==="edit"&&c.expert)lines.push("Quyết định chuyên gia: "+v(c.expert)+".");if(c.mode==="video"){lines.push("Số cảnh: "+v(c.shots||"3")+".");lines.push("Chuyển động: "+v(c.motion||"Chậm, ổn định")+".");lines.push("Giữ liên tục nhận diện không gian, sản phẩm, nhân vật và ánh sáng giữa các shot.");}lines.push("Yêu cầu: nhất quán tỷ lệ, công năng, vật liệu, ánh sáng vật lý, phối cảnh; không tự tạo chi tiết kiến trúc không được cung cấp.","Chỉ mô tả theo dữ liệu đầu vào; thông số chưa xác minh phải đánh dấu giả định.");return lines.join("\n");}
export function csv(rows){return rows.map(row=>row.map(v=>'"'+String(v??"").replace(/"/g,'""')+'"').join(",")).join("\r\n");}
export function formatVnd(n){return Number(n||0).toLocaleString("vi-VN")+" ₫";}
