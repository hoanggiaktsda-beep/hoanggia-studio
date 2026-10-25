import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import vm from 'node:vm';
const expected=[8,7,7,7,7,7,7];
test('all 7 prompt categories have correct content and scripts load',()=>{
 const app=fs.readFileSync('src/app.js','utf8');const match=app.match(/const PROMPT_TEMPLATES=(\[[\s\S]*?\]);\s*const PROMPT_CATEGORIES=/);assert.ok(match);
 const main=JSON.parse(match[1]);assert.equal(main.slice(0,29).length,29);
 const ctx={window:{}};for(const n of [5,6,7])vm.runInNewContext(fs.readFileSync('src/prompts-category-0'+n+'.js','utf8'),ctx);
 for(const n of [5,6,7]){const arr=ctx.window['HOANGGIA_PROMPT_0'+n];assert.equal(arr.length,expected[n-1]);for(const [name,prompt] of arr){assert.ok(name.length>4);assert.ok(prompt.startsWith('Hãy '))}}
 const html=fs.readFileSync('index.html','utf8');for(const n of [5,6,7])assert.match(html,new RegExp('src/prompts-category-0'+n+'\\.js'));
 assert.match(html,/src\/prompts-category-05-adapter\.js/);
 const adapter=fs.readFileSync('src/prompts-category-05-adapter.js','utf8');for(const n of [5,6,7])assert.ok(adapter.includes('HOANGGIA_PROMPT_0'+n));
});
test('standalone prompt javascript has valid syntax',()=>{for(const path of ['src/prompts-category-05.js','src/prompts-category-06.js','src/prompts-category-07.js','src/prompts-category-05-adapter.js'])new Function(fs.readFileSync(path,'utf8'));});