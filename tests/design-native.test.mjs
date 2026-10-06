import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const read=p=>readFileSync(new URL("../"+p,import.meta.url),"utf8");
test("Design AI opens standalone website without iframe",()=>{
 const app=read("src/app.js");
 const legacy=read("design-ai/index.html");
 assert.match(app,/"design":"https:\/\/hoanggiaktsda-beep\.github\.io\/da-studio\/"/);
 assert.match(app,/location\.assign\(EXTERNAL_TOOLS\[id\]\)/);
 assert.match(legacy,/location\.replace\("https:\/\/hoanggiaktsda-beep\.github\.io\/da-studio\/"\)/);
 assert.doesNotMatch(legacy,/<iframe\b/i);
});
test("DA creator is limited to create and shares active project",()=>{
 const app=read("design-ai/app.mjs");
 assert.match(app,/function syncHostDesign\(/);
 assert.match(app,/function restoreHostDesign\(/);
 assert.match(app,/v="create";state\.mode=v/);
 assert.match(app,/import \{designReview\}/);
 assert.match(app,/HOST_ACTIVE="hg-studio-active-v1"/);
});
test("native modules included in PWA",()=>{
 const sw=read("sw.js");
 assert.match(sw,/\.\/design-ai\/index\.html/);
 assert.match(sw,/\.\/design-ai\/app\.mjs/);
});
