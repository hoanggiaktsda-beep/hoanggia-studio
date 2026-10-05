import {test,expect} from "@playwright/test";
test("dashboard, project creation and design prompt",async({page})=>{
 await page.goto("/");
 await expect(page.getByRole("heading",{name:"AI Tools"})).toBeVisible();
 await page.getByRole("button",{name:"Bắt đầu thiết kế"}).click();
 await expect(page.getByRole("heading",{name:"Design AI"})).toBeVisible();
 await page.locator("#f-brief").fill("Thiết kế phòng khách tối giản tinh tế");
 await page.getByRole("button",{name:"Phân tích & tạo prompt"}).click();
 await expect(page.locator("#promptResult")).toContainText("phòng khách tối giản");
 await expect(page.getByRole("button",{name:"Sao chép"})).toBeVisible();
});
test("plan calculations and project backup",async({page})=>{
 await page.goto("/#creative");
 await page.getByRole("button",{name:"Mở Workspace"}).nth(5).click();
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
