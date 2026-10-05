import test from "node:test";
import assert from "node:assert/strict";
import {designReview} from "../src/design-brain.js";
import {compilePrompt} from "../src/core.js";
test("Design AI separates four domains",()=>{
 const spaces=["Nội thất","Kiến trúc","Quy hoạch","Cảnh quan"];
 const outputs=spaces.map(space=>designReview({space}));
 assert.equal(new Set(outputs.map(x=>x.checks.join("|"))).size,4);
 for(const x of outputs)assert.equal(x.checks.length,3);
});
test("Design AI labels unverified measurements and site",()=>{
 const p=compilePrompt({mode:"design",task:"create",space:"Nội thất",brief:"Phòng khách"});
 assert.match(p,/Chưa xác minh kích thước/);
 assert.match(p,/quy chuẩn áp dụng cần được kiểm chứng/);
 assert.match(p,/Công năng và lưu thông/);
});
test("Design AI leaves video workflow independent",()=>{
 const p=compilePrompt({mode:"video",space:"Nội thất",brief:"Phim nội thất",shots:3});
 assert.doesNotMatch(p,/Kiểm định chuyên ngành/);
});
