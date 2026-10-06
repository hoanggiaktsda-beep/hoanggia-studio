import {test,expect} from "@playwright/test";
test("dashboard standalone AI links",async({page})=>{
 await page.goto("/");
 await expect(page.locator(".tool-gallery a.tile")).toHaveCount(4);
 const urls=["https://hoanggiaktsda-beep.github.io/da-studio/","https://hoanggiaktsda-beep.github.io/hoanggia-studioai/","https://hoanggiaktsda-beep.github.io/prompt-ai-videos/","https://hoanggiaktsda-beep.github.io/HG-UPSCALE-AI/"];
 for(let i=0;i<4;i++)await expect(page.locator(".tool-gallery a.tile").nth(i)).toHaveAttribute("href",urls[i]);
});
test("plan calculations and project backup",async({page})=>{
 await page.goto("/#creative");
 await page.locator(".tool-gallery [data-open=plan]").click();
 await expect(page.getByRole("heading",{name:"Bản vẽ & mặt bằng"})).toBeVisible();
 await page.locator("#widthM").fill("5");
 await page.locator("#heightM").fill("6");
 await page.getByRole("button",{name:"Tính diện tích"}).click();
 await expect(page.locator("#areaResult")).toContainText("30 m²");
 await page.locator(".side [data-route=projects]").click();
 await expect(page.getByRole("button",{name:"Sao lưu toàn bộ"})).toBeVisible();
});
test("mobile navigation",async({page})=>{
 await page.setViewportSize({width:390,height:844});
 await page.goto("/");
 await expect(page.locator(".mobile-nav")).toBeVisible();
 await page.locator(".mobile-nav").getByRole("button",{name:"Sáng tạo"}).click();
 await expect(page.getByRole("heading",{name:"Xưởng sáng tạo"})).toBeVisible();
});

test("tool artwork matches its purpose and is available",async({page,request})=>{
 await page.goto("/");
 for(const id of ["design","edit","video","upscale","visual","plan","material","boq","vision","expert"]){
   const res=await request.get("/assets/tools/"+id+".svg");
   expect(res.ok()).toBeTruthy();
   const xml=await res.text();
   expect(xml).toContain("<svg");
   expect(xml).toContain("</svg>");
 }
 await expect(page.locator('.tool-gallery [data-open="plan"]')).toContainText("Mặt bằng, công năng và diện tích");
 await expect(page.locator('.tool-gallery [data-open="boq"]')).toContainText("Bảng vật tư, khối lượng, chi phí");
 await expect(page.locator('.tool-gallery a[href*="HG-UPSCALE-AI"]')).toContainText("Phóng ảnh và cải thiện độ rõ");
});


test("Thư ký AI companion supports free local chat and Google handoff",async({page})=>{
 await page.goto("/");
 await page.getByRole("button",{name:"Mở trò chuyện với Thư ký AI"}).click();
 await expect(page.getByText("Trợ lý hướng dẫn theo kịch bản")).toBeVisible();
 await page.locator("#moInput").fill("cách tạo dự án");
 await page.locator("#moForm button").click();
 await expect(page.locator("#moMessages")).toContainText("Dự án mới");
 await page.reload();
 await page.getByRole("button",{name:"Mở trò chuyện với Thư ký AI"}).click();
 await expect(page.locator("#moMessages")).toContainText("cách tạo dự án");
 await page.locator("#moInput").fill("Tìm kiếm trên Google");
 await page.locator("#moForm button").click();
 await expect(page.locator("#moMessages")).toContainText("tìm");
 await page.getByRole("button",{name:"Xóa lịch sử chat"}).click();
 await expect(page.locator("#moMessages")).not.toContainText("cách tạo dự án");
});
test("Thư ký AI companion stays usable on mobile",async({page})=>{
 await page.setViewportSize({width:390,height:844});
 await page.goto("/");
 await page.getByRole("button",{name:"Mở trò chuyện với Thư ký AI"}).click();
 await expect(page.locator("#moInput")).toBeVisible();
 await page.keyboard.press("Escape");
 await expect(page.locator("#moPanel")).toBeHidden();
});

test("Public chat uses the HOANGGIA AI logo for sender avatar",async({page})=>{await page.goto("/");await page.getByRole("button",{name:"Mở trò chuyện với Thư ký AI"}).click();await page.locator("#moInput").fill("Xin chào");await page.locator("#moForm button").click();await expect(page.locator(".mo-user-avatar")).toHaveAttribute("src","./assets/icon.svg");await expect(page.locator(".mo-heading")).toContainText("Thư ký AI");});

test("Luxury secretary exposes responsive actions and accessible close",async({page})=>{
 await page.goto("/");
 await page.getByRole("button",{name:"Mở trò chuyện với Thư ký AI"}).click();
 await expect(page.locator(".mo-head-photo")).toBeVisible();
 await expect(page.locator(".mo-intro")).toBeVisible();
 await expect(page.locator(".mo-chips button")).toHaveCount(5);
 await page.getByRole("button",{name:"Thu nhỏ chat"}).click();
 await expect(page.locator("#moPanel")).toBeHidden();
 await page.getByRole("button",{name:"Mở trò chuyện với Thư ký AI"}).click();
 await page.locator("#moInput").fill("Gợi ý phong cách");
 await page.locator("#moForm button").click();
 await expect(page.locator("#moMessages")).toContainText("Japandi");
});

test("legacy design entry redirects to DA Studio",async({page})=>{
 await page.goto("/design-ai/");
 await expect(page).toHaveURL("https://hoanggiaktsda-beep.github.io/da-studio/",{timeout:15000});
});

test("material library links external CC0 sources without local texture files",async({page})=>{
 await page.goto("/#library");
 await expect(page.getByRole("heading",{name:"Thư viện vật liệu"})).toBeVisible();
 await expect(page.locator(".mat-card")).toHaveCount(8);
 await expect(page.locator('a[href="https://polyhaven.com/textures"]').first()).toBeVisible();
 await expect(page.locator('a[href="https://ambientcg.com/list"]')).toBeVisible();
 await page.locator('[data-material="0"]').click();
 await expect(page.getByText("Travertine",{exact:false}).first()).toBeVisible();
});

test("material card links to matching asset or filtered category",async({page})=>{
 await page.route("https://api.polyhaven.com/assets?t=textures",route=>route.fulfill({status:200,contentType:"application/json",body:JSON.stringify({travertine_floor:{name:"Travertine Floor",tags:["travertine"]},calacatta_marble:{name:"Calacatta Marble",tags:["calacatta","marble"]},oak_wood:{name:"Oak Wood",tags:["oak"]}})}));
 await page.goto("/#library");
 await expect(page.locator('[data-material-link="0"]')).toHaveAttribute("href","https://polyhaven.com/a/travertine_floor");
 await expect(page.locator('[data-material-link="1"]')).toHaveAttribute("href","https://polyhaven.com/a/calacatta_marble");
 await expect(page.locator('[data-material-link="3"]')).toHaveAttribute("href",/textures\?q=walnut/);
});

test("material specificity rejects generic category lookalikes",async({page})=>{
 await page.route("https://api.polyhaven.com/assets?t=textures",route=>route.fulfill({status:200,contentType:"application/json",body:JSON.stringify({white_marble:{name:"White Marble",tags:["marble"]},generic_glass:{name:"Glass",tags:["glass"]},polished_brass:{name:"Brass Metal",tags:["brass"]},brown_leather:{name:"Brown Leather",tags:["leather"]}})}));
 await page.goto("/#library");
 await expect(page.locator('[data-material-link="1"]')).toHaveAttribute("href",/textures\?q=calacatta/);
 await expect(page.locator('[data-material-link="4"]')).toHaveAttribute("href",/textures\?q=brushed/);
 await expect(page.locator('[data-material-link="5"]')).toHaveAttribute("href",/textures\?q=saddle/);
 await expect(page.locator('[data-material-link="7"]')).toHaveAttribute("href",/textures\?q=smoked/);
 await expect(page.locator('.mat-card').nth(7)).toContainText("Chưa có mẫu xác thực");
 await expect(page.locator('.mat-card').nth(7).getByRole("link",{name:"Nguồn khác"})).toHaveAttribute("href",/ambientcg.com\/list\?search=smoked/);
});

test("material library shows clearly labeled editorial imagery when exact texture is unavailable",async({page})=>{
 await page.route("https://api.polyhaven.com/assets?t=textures",route=>route.fulfill({status:200,contentType:"application/json",body:"{}"}));
 await page.goto("/#library");
 await expect(page.locator(".material-preview")).toHaveCount(8);
 await expect(page.locator(".material-preview-note").first()).toContainText("Mô phỏng 3D");
 await expect(page.locator(".mat-card").first()).toContainText("Chưa có mẫu xác thực");
 await expect(page.locator('[data-material-link="0"]')).toHaveAttribute("href",/polyhaven.com\/textures\?q=travertine/);
});

test("material descriptions identify the actual material and installation concerns",async({page})=>{
 await page.route("https://api.polyhaven.com/assets?t=textures",route=>route.fulfill({status:200,contentType:"application/json",body:"{}"}));
 await page.goto("/#library");
 await expect(page.locator(".mat-card")).toHaveCount(8);
 await expect(page.locator(".mat-card").nth(0)).toContainText("Đá vôi tự nhiên");
 await expect(page.locator(".mat-card").nth(1)).toContainText("không phải mọi marble trắng");
 await expect(page.locator(".mat-card").nth(2)).toContainText("cốt ván");
 await expect(page.locator(".mat-card").nth(4)).toContainText("PVD");
 await expect(page.locator(".mat-card").nth(7)).toContainText("kính cường lực");
 await expect(page.locator(".material-application")).toHaveCount(8);
 await expect(page.locator(".material-caution")).toHaveCount(8);
});

test("materials render simple 3D specimens, not unrelated interior photos",async({page})=>{
 await page.route("https://api.polyhaven.com/assets?t=textures",route=>route.fulfill({status:200,contentType:"application/json",body:"{}"}));
 await page.goto("/#library");
 await expect(page.locator(".material-tile")).toHaveCount(8);
 await expect(page.locator(".material-preview img")).toHaveCount(0);
 await expect(page.locator(".material-sample-0")).toBeVisible();
 await expect(page.locator(".material-sample-7")).toBeVisible();
});

test("material library stays functional when external API is down",async({page})=>{
 await page.route("https://api.polyhaven.com/assets?t=textures",route=>route.abort());
 await page.goto("/#library");
 await expect(page.locator(".material-tile")).toHaveCount(8);
 await expect(page.locator(".material-source").first()).toContainText("Không tải được kho trực tuyến");
 await expect(page.locator('[data-material-link="0"]')).toHaveAttribute("href",/travertine/);
 await page.locator('[data-material="0"]').click();
 await expect(page.getByText("Travertine",{exact:false}).first()).toBeVisible();
});
test("material library ignores delayed results after navigating away",async({page})=>{
 let finish;await page.route("https://api.polyhaven.com/assets?t=textures",async route=>{await new Promise(resolve=>{finish=resolve});await route.fulfill({status:200,contentType:"application/json",body:"{}"});});
 await page.goto("/#library");await expect(page.locator(".material-tile")).toHaveCount(8);
 await page.locator('.side [data-route="projects"]').click();
 finish?.();await expect(page.getByRole("heading",{name:"Quản lý dự án"})).toBeVisible();
});

test("Visual AI opens external image platforms without changing other tools",async({page})=>{
 await page.goto("/#creative");
 await page.locator('.tool-gallery [data-open="visual"]').click();
 for(const url of ["https://www.lovart.ai/","https://chatgpt.com/","https://labs.google/fx/tools/flow"]){
  await expect(page.locator('a[href="'+url+'"]')).toHaveAttribute("target","_blank");
 }
 await page.getByRole("button",{name:/Tất cả công cụ/}).click();
 for(const id of ["plan","material","boq"])await expect(page.locator('.tool-gallery [data-open="'+id+'"]')).toHaveCount(1);
});

test("responsive navigation and layout across screen widths",async({page})=>{
 for(const width of [320,375,430,768,1024,1366,1920]){
  await page.setViewportSize({width,height:900});
  await page.goto("/#creative");
  await expect(page.locator(".tool-gallery")).toBeVisible();
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+2);
  expect(overflow,"unexpected horizontal overflow at "+width).toBe(false);
  if(width<=760)await expect(page.locator(".mobile-nav")).toBeVisible();
  else await expect(page.locator(".side")).toBeVisible();
 }
});

test("mobile workspace keeps all six destinations accessible",async({page})=>{
 for(const width of [320,375,390,430,600,760]){
  await page.setViewportSize({width,height:844});
  await page.goto("/#home");
  const nav=page.locator(".mobile-nav");
  await expect(nav.locator("button")).toHaveCount(6);
  await nav.locator('[data-route="library"]').click();
  await expect(page.locator("#view")).toBeVisible();
  await nav.locator('[data-route="creative"]').click();
  await expect(page.locator(".tool-gallery")).toBeVisible();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+2)).toBe(true);
 }
});

test("mobile dashboard never starts off-screen or permits sideways scrolling",async({page})=>{
 for(const width of [320,375,390,393,430,600,760]){
  await page.setViewportSize({width,height:844});
  await page.goto("/#home");
  await expect(page.locator(".frame")).toBeVisible();
  const positions=await page.evaluate(()=>{
   const selectors=[".frame","#view",".content",".mobile-nav"];
   const boxes=selectors.map(s=>{const e=document.querySelector(s);if(!e)return null;const r=e.getBoundingClientRect();return {selector:s,left:r.left,right:r.right,width:r.width};}).filter(Boolean);
   window.scrollTo(9999,0);
   return {boxes,scrollX:window.scrollX,viewport:innerWidth,documentWidth:document.documentElement.scrollWidth};
  });
  for(const box of positions.boxes){
   expect(box.left,box.selector+" starts offscreen at "+width).toBeGreaterThanOrEqual(-2);
   expect(box.right,box.selector+" extends beyond "+width).toBeLessThanOrEqual(width+2);
  }
  expect(positions.scrollX,"horizontal pan at "+width).toBe(0);
 }
});

test("mobile dashboard shows only one create project action",async({page})=>{
 await page.setViewportSize({width:390,height:844});
 await page.goto("/#home");
 await expect(page.locator("#newProject")).toBeVisible();
 await expect(page.locator("#projectCreate")).toBeHidden();
 await page.setViewportSize({width:1366,height:900});
 await expect(page.locator("#projectCreate")).toBeVisible();
});

test("Plan AI V1 exposes reconstruction experts, 2D sheets and independent checker",async({page})=>{
 await page.goto("/#creative");
 await page.locator('.tool-gallery [data-open="plan"]').click();
 await expect(page.getByRole("heading",{name:"Bản vẽ & mặt bằng"})).toBeVisible();
 await expect(page.getByText("CAD Technical Architect",{exact:true})).toBeVisible();
 await expect(page.getByText("3D Reconstruction Architect",{exact:true})).toBeVisible();
 await expect(page.getByText("CAD Checker",{exact:true})).toBeVisible();
 await expect(page.getByText("Drawing Coordinator",{exact:true})).toBeVisible();
 await expect(page.locator(".plan-sheet")).toHaveCount(11);
 await page.locator("#knownDimension").fill("cửa 900 mm");
 await page.locator("#planBrief").fill("Thêm tủ rượu 2400 × 450, giữ lối đi 900 mm");
 await page.getByRole("button",{name:"Tạo đặc tả tái dựng"}).click();
 await expect(page.locator("#planSpec")).toContainText("mô hình hình học trung gian");
 await page.getByRole("button",{name:"Tạo prompt CAD 2D"}).click();
 await expect(page.locator("#planPromptResult")).toContainText("CAD TECHNICAL ARCHITECT");
 await page.getByRole("button",{name:"Chạy kiểm tra hồ sơ"}).click();
 await expect(page.locator("#planCheckResult")).toContainText("SRC-01");
});
test("Plan AI V1 remains contained on mobile",async({page})=>{
 await page.setViewportSize({width:390,height:844});await page.goto("/#creative");
 await page.locator('.tool-gallery [data-open="plan"]').click();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+2)).toBe(true);
 await expect(page.locator(".plan-flow")).toBeVisible();
});

test("Plan AI prompt supports AI đối ứng",async({page})=>{
 await page.goto("/#creative");await page.locator('.tool-gallery [data-open="plan"]').click();
 await expect(page.locator("#planTargetAI")).toBeVisible();
 await page.locator("#planTargetAI").selectOption("Gemini");
 await page.getByRole("button",{name:"Tạo prompt CAD 2D"}).click();
 await expect(page.locator("#planPromptResult")).toContainText("AI ĐỐI ỨNG: Gemini");
});

test("BOQ AI V1 calculates allowances and audits duplicate rows",async({page})=>{
 await page.goto("/#creative");await page.locator('.tool-gallery [data-open="boq"]').click();
 await expect(page.getByText("Chuyên gia dự toán kiến trúc",{exact:true})).toBeVisible();
 await page.locator('[data-k="name"]').first().fill("Trần thạch cao");
 await page.locator('[data-k="unit"]').first().fill("m²");
 await page.locator('[data-k="qty"]').first().fill("10");
 await page.locator('[data-k="price"]').first().fill("100000");
 await page.locator("#boqWaste").fill("10");
 await page.locator("#boqContingency").fill("5");
 await page.locator("#boqTax").fill("0");
 await page.locator("#boqPriceSource").fill("Báo giá NCC 06/10/2026");
 await page.getByRole("button",{name:"Kiểm tra BOQ"}).click();
 await expect(page.locator("#boqAuditResult")).toContainText("ĐẠT KIỂM TRA DỮ LIỆU");
 await expect(page.locator("#boqSummary")).toContainText("1.155.000");
 await page.getByRole("button",{name:"Tính & lưu"}).click();
 await expect(page.locator("#boqSummary")).toContainText("1.155.000");
});

test("BOQ accountant checks missing price provenance",async({page})=>{
 await page.goto("/#creative");await page.locator('.tool-gallery [data-open="boq"]').click();
 await expect(page.getByText("Kế toán công trình",{exact:true})).toBeVisible();
 await expect(page.getByText("Chuyên gia dự toán kiến trúc",{exact:true})).toBeVisible();
 await page.locator('[data-k="name"]').first().fill("Sơn tường");
 await page.locator('[data-k="qty"]').first().fill("12");
 await page.locator('[data-k="price"]').first().fill("100000");
 await page.getByRole("button",{name:"Kiểm tra BOQ"}).click();
 await expect(page.locator("#boqAuditResult")).toContainText("PRICE-01");
});
