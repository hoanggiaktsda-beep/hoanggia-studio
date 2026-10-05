import {test,expect} from "@playwright/test";
test("dashboard, project creation and design prompt",async({page})=>{
 await page.goto("/");
 await expect(page.getByRole("heading",{name:"AI Tools"})).toBeVisible();
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
