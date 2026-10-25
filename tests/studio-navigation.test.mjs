import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const read = path => readFileSync(new URL("../"+path, import.meta.url), "utf8");

test("Script AI is discoverable from desktop, mobile and tool registry", () => {
 const html=read("index.html"), app=read("src/app.js"), core=read("src/core.js");
 assert.match(html, /class="script-direct-link"/);
 assert.match(html, /href="\.\/script-ai\.html"/);
 assert.match(app, /"script":"https:\/\/hoanggiaktsda-beep\.github\.io\/hoanggia-studio\/script-ai\.html"/);
 assert.match(core, /id:"script"/);
});

test("Script AI retains product input fields and four-step prompt flow",()=>{
 const html=read("script-ai.html");
 for(const id of ["ten","loai","khach","van_de","loi_ich","khac_biet","gia","cta"]){
   assert.match(html,new RegExp('id="p_'+id+'"'));
 }
 for(const id of ["sourceUrl","sourceVideo","source","visualAnalysis","analyzeDirect"]){
   assert.match(html,new RegExp('id="'+id+'"'));
 }
 assert.match(html,/function makePrompt\(i\)/);
 assert.match(html,/function build\(\)/);
});

test("PWA caches each navigation separately instead of overwriting home",()=>{
 const sw=read("sw.js");
 assert.match(sw, /"\.\/script-ai\.html"/);
 assert.match(sw, /c\.put\(request,copy\)/);
 assert.doesNotMatch(sw,/c\.put\("\.\/index\.html",copy\)/);
 assert.match(sw, /caches\.match\(request\)/);
});
