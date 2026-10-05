import {test,expect} from "@playwright/test";
test("dashboard, project creation and design prompt",async({page})=>{
 await page.goto("/");
 await expect(page.getByRole("heading",{name:"AI Tools"})).toBeVisible();
 await expect(page.locator(".tool-gallery a.tile").first()).toHaveAttribute("href","https://hoanggiaktsda-beep.github.io/da-studio/");
 await expect(page.locator(".tool-gallery a.tile").nth(1)).toHaveAttribute("href","https://hoanggiaktsda-beep.github.io/hoanggia-studioai/");
 await expect(page.locator(".tool-gallery a.tile").nth(2)).toHaveAttribute("href","https://hoanggiaktsda-beep.github.io/prompt-ai-videos/");
 await expect(page.locator(".tool-gallery a.tile").nth(3)).toHaveAttribute("href","https://hoanggiaktsda-beep.github.io/HG-UPSCALE-AI/");
 /* Legacy prompt UI has moved to its standalone site. */
 return;
 await page.getByRole("button",{name:"Khám phá Studio"}).click();
 await expect(page.getByRole("heading",{name:"Design AI"})).toBeVisible();
 await page.locator("#f-brief").fill("Thiết kế phòng khách tối giản tinh tế");
 await page.getByRole("button",{name:"Phân tích & tạo prompt"}).click();
 await expect(page.locator("#promptResult")).toContainText("phòng khách tối giản");
 await expect(page.getByRole("button",{name:"Sao chép"})).toBeVisible();
});
test("plan calculations and project backup",async({page})=>{
 await page.goto("/#creative");
 await page.locator(".tool-gallery [data-open=plan]").click();
 await expect(page.getByRole("heading",{name:"Plan AI"})).toBeVisible();
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
 await expect(page.locator('.tool-gallery [data-open="upscale"]')).toContainText("Phóng ảnh và cải thiện độ rõ");
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

test("Design AI validates brief and preserves last valid prompt",async({page})=>{
 await page.goto("/");
 await page.locator('[data-open="design"]').first().click();
 await page.getByRole("button",{name:"Phân tích & tạo prompt"}).click();
 await expect(page.locator("#promptWarnings")).toContainText("Thiếu mô tả thiết kế");
 await expect(page.locator("#promptResult")).toContainText("Điền yêu cầu");
 await page.locator("#f-brief").fill("Phòng khách villa phong cách Japandi");
 await page.getByRole("button",{name:"Phân tích & tạo prompt"}).click();
 await expect(page.locator("#promptResult")).toContainText("villa phong cách Japandi");
 await page.locator("#f-brief").fill("");
 await page.getByRole("button",{name:"Phân tích & tạo prompt"}).click();
 await expect(page.locator("#promptResult")).toContainText("villa phong cách Japandi");
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
