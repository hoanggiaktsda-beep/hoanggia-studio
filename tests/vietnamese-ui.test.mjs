import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const app=readFileSync(new URL("../src/app.js",import.meta.url),"utf8");
const html=readFileSync(new URL("../index.html",import.meta.url),"utf8");
const sw=readFileSync(new URL("../sw.js",import.meta.url),"utf8");
test("Vietnamese-only navigation and document language",()=>{
 assert.match(html,/<html lang="vi">/);
 assert.match(html,/KHÔNG GIAN LÀM VIỆC/);
 assert.doesNotMatch(html,/>WORKSPACE</);
 assert.match(html,/Tư duy có cơ sở/);
});
test("localized dropdowns preserve stored machine values",()=>{
 assert.match(app,/const VI_OPTIONS=/);
 assert.match(app,/esc\(viOption\(o\)\)/);
 assert.match(app,/"create":"Tạo thiết kế mới"/);
 assert.match(app,/"yes":"Có"/);
 assert.match(app,/"no":"Không"/);
});
test("localized headings and refreshed offline cache",()=>{
 assert.match(app,/BỘ BIÊN SOẠN YÊU CẦU/);
 assert.doesNotMatch(app,/<h1>AI Tools<\/h1>/);
 assert.match(sw,/hoanggia-studio-v4\.7\.0/);
});
