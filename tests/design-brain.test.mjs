import test from "node:test";
import assert from "node:assert/strict";
import {designReview,designAudit} from "../src/design-brain.js";
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

test("Design dimensions and evidence checks",()=>{
 assert.equal(designAudit({space:"Nội thất",width:"5",depth:"6"}).area,30);
 assert.equal(designAudit({space:"Nội thất",width:"5",depth:""}).area,null);
 assert.equal(designAudit({space:"Nội thất",width:"abc",depth:"6"}).area,null);
 assert.ok(designAudit({space:"Nội thất"}).warnings.length>=2);
});
test("Design prompt includes new verified-input labels",()=>{
 const s=compilePrompt({mode:"design",space:"Nội thất",brief:"Phòng khách",width:"5",depth:"6",furniture:"Sofa 3.2 m",constraints:"Cột giữa nhà"});
 assert.match(s,/30 m²/);
 assert.match(s,/Sofa 3.2 m/);
 assert.match(s,/Cột giữa nhà/);
 assert.match(s,/chưa xác minh hiện trạng/);
});
