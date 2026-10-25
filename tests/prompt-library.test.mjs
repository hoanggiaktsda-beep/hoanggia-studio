import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const app=fs.readFileSync('src/app.js','utf8');
const match=app.match(/const PROMPT_TEMPLATES=(\[[\s\S]*?\]);\s*const PROMPT_CATEGORIES=/);
test('50 prompts in 7 native categories',()=>{
 assert.ok(match,'Prompt source exists');
 const templates=JSON.parse(match[1]);
 assert.equal(templates.length,50);
 const counts=[8,7,7,7,7,7,7];
 let offset=0;
 for(const count of counts){
  const group=templates.slice(offset,offset+count);
  assert.equal(group.length,count);
  assert.ok(group.every(p=>p.title&&p.content.startsWith('Hãy ')));
  offset+=count;
 }
 assert.match(app,/cat===4\?PROMPT_TEMPLATES\.slice\(29,36\)/);
 assert.match(app,/cat===5\?PROMPT_TEMPLATES\.slice\(36,43\)/);
 assert.match(app,/cat===6\?PROMPT_TEMPLATES\.slice\(43,50\)/);
 assert.match(app,/\[0,8,15,22,29,36,43\]\[c\]\+i/);
});
test('single source of truth with no conflicting prompt adapter scripts',()=>{
 const html=fs.readFileSync('index.html','utf8');
 assert.match(html,/src\/app\.js\?v=4\.9\.14/);
 assert.doesNotMatch(html,/prompts-category-05-adapter\.js/);
});