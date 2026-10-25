/* HOANGGIA Studio - Categories 05, 06 & 07 native prompt selectors */
(()=>{
"use strict";
const groups={"4":"HOANGGIA_PROMPT_05","5":"HOANGGIA_PROMPT_06","6":"HOANGGIA_PROMPT_07"};
const el=id=>document.getElementById(id);
function data(){return window[groups[el("promptCategorySelect")?.value]]}
function choose(){const list=data(),i=Number(el("promptTemplateSelect")?.value||0),editor=el("promptTemplateText");if(editor&&list?.[i])editor.value=list[i][1]}
function populate(){
 const key=el("promptCategorySelect")?.value,select=el("promptTemplateSelect");
 if(!select||!(key in groups))return;
 const list=data();if(!Array.isArray(list)||list.length!==7)return;
 select.replaceChildren();
 list.forEach(([title],i)=>{const option=document.createElement("option");option.value=String(i);option.textContent=String(i+1).padStart(2,"0")+" · "+title;select.append(option)});
 select.disabled=false;
 const editor=el("promptTemplateText"),actions=el("promptTemplateActions"),hint=el("promptTemplateHint");
 if(editor)editor.disabled=false;
 if(actions)actions.hidden=false;
 if(hint)hint.textContent="7 mẫu đã cập nhật. Có thể sửa nội dung rồi sao chép hoặc tải TXT.";
 choose();
}
document.addEventListener("change",e=>{
 if(e.target.id==="promptCategorySelect")queueMicrotask(populate);
 if(e.target.id==="promptTemplateSelect"&&data())queueMicrotask(choose);
},true);
document.addEventListener("click",e=>{
 if(e.target.closest("#resetTemplate")&&data())queueMicrotask(choose);
},true);
})();
