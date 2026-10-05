import test from "node:test";
import assert from "node:assert/strict";
import {DEPARTMENTS,resolveDepartment,validateHandoff} from "../src/intelligence-core.js";
test("eight distinct departments",()=>{
 assert.equal(Object.keys(DEPARTMENTS).length,8);
 for(const id of Object.keys(DEPARTMENTS)){const d=resolveDepartment(id);assert.equal(d.id,id);assert.ok(d.lead);assert.ok(d.locks.length);assert.equal(d.modelInference,false);}
});
test("architectural video vs cinema",()=>{
 assert.equal(resolveDepartment("video","interior").lead,"architecture-interior");
 assert.equal(resolveDepartment("video","cinema").lead,"film-directing");
 assert.equal(resolveDepartment("video","architecture").lead,"architecture-design");
});
test("safe lookup and isolated arrays",()=>{
 assert.equal(resolveDepartment("__proto__"),null);
 const d=resolveDepartment("edit");d.locks.push("test");
 assert.equal(resolveDepartment("edit").locks.includes("test"),false);
});
test("handoff requires known tools and project data",()=>{
 assert.equal(validateHandoff({from:"plan",to:"boq",projectId:"p1",payload:{area:20}}).ok,true);
 assert.equal(validateHandoff({from:"other",to:"boq",projectId:"p1",payload:{}}).ok,false);
 assert.equal(validateHandoff({from:"plan",to:"boq",projectId:"",payload:{}}).ok,false);
});
