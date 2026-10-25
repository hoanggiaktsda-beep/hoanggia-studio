/* Add category 05 to the native AI Intelligence prompt selectors without changing core app. */
(()=>{
"use strict";
function refresh(){
 const cat=document.getElementById("promptCategorySelect");
 const select=document.getElementById("promptTemplateSelect");
 if(!cat||!select||cat.value!=="4")return;
 const items=window.HOANGGIA_PROMPT_05;
 if(!Array.isArray(items)||items.length!==7)return;
 select.replaceChildren();
 items.forEach(([label],i)=>{const option=document.createElement("option");option.value=String(i);option.textContent=String(i+1).padStart(2,"0")+" · "+label;select.append(option)});
 select.disabled=false;
 const editor=document.getElementById("promptTemplateText");
 const actions=document.getElementById("promptTemplateActions");
 const hint=document.getElementById("promptTemplateHint");
 if(editor){editor.disabled=false;editor.value=items[0][1]}
 if(actions)actions.hidden=false;
 if(hint)hint.textContent="7 mẫu đã được cập nhật. Chọn mẫu để xem nội dung.";
}
document.addEventListener("change",e=>{
 if(e.target.id==="promptCategorySelect"){queueMicrotask(refresh)}
 if(e.target.id==="promptTemplateSelect"){
  const cat=document.getElementById("promptCategorySelect");
  if(cat?.value!=="4")return;
  queueMicrotask(()=>{
   const choice=Number(e.target.value);
   const prompt=window.HOANGGIA_PROMPT_05?.[choice];
   const editor=document.getElementById("promptTemplateText");
   if(prompt&&editor)editor.value=prompt[1];
  });
 }
},true);
document.addEventListener("click",e=>{
 if(!e.target.closest("#resetTemplate"))return;
 const cat=document.getElementById("promptCategorySelect");
 if(cat?.value!=="4")return;
 queueMicrotask(()=>{
  const i=Number(document.getElementById("promptTemplateSelect")?.value||0);
  const editor=document.getElementById("promptTemplateText");
  if(editor&&window.HOANGGIA_PROMPT_05?.[i])editor.value=window.HOANGGIA_PROMPT_05[i][1];
 });
},true);
})();