/* YouTube links are untrusted: only recognized video/playlist identifiers reach youtube-nocookie.com. */
(()=>{"use strict";
const toggle=document.getElementById("musicToggle"),panel=document.getElementById("musicPanel"),input=document.getElementById("musicUrl"),frame=document.getElementById("musicFrame"),message=document.getElementById("musicMessage"),external=document.getElementById("musicExternal");
const parse=(raw)=>{let url;try{url=new URL(raw.trim());}catch{return null;}
if(url.protocol!=="https:"&&url.protocol!=="http:")return null;
const host=url.hostname.toLowerCase(),allowed=["youtube.com","www.youtube.com","m.youtube.com","music.youtube.com","youtu.be","www.youtu.be","youtube-nocookie.com","www.youtube-nocookie.com"];
if(!allowed.includes(host))return null;
const parts=url.pathname.split("/").filter(Boolean);
let id=host.endsWith("youtu.be")?parts[0]:parts[0]==="shorts"||parts[0]==="embed"||parts[0]==="live"?parts[1]:url.searchParams.get("v");
let list=url.searchParams.get("list");
if(id&&!/^[A-Za-z0-9_-]{11}$/.test(id))id=null;
if(list&&!/^[A-Za-z0-9_-]{10,64}$/.test(list))list=null;
if(!id&&!list)return null;
const src=id?"https://www.youtube-nocookie.com/embed/"+id+(list?"?list="+encodeURIComponent(list):""):"https://www.youtube-nocookie.com/embed/videoseries?list="+encodeURIComponent(list);
return {src,external:url.href};
};
toggle.addEventListener("click",()=>{panel.hidden=!panel.hidden;toggle.setAttribute("aria-expanded",String(!panel.hidden));});
document.getElementById("musicPlay").addEventListener("click",()=>{const parsed=parse(input.value);if(!parsed){message.textContent="Liên kết không hợp lệ. Hãy dán video hoặc playlist YouTube.";return;}
frame.replaceChildren();const iframe=document.createElement("iframe");iframe.src=parsed.src;iframe.title="Trình phát nhạc YouTube";iframe.allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture";iframe.referrerPolicy="strict-origin-when-cross-origin";iframe.allowFullscreen=true;frame.append(iframe);external.href=parsed.external;message.textContent="Nhấn phát trong video nếu trình duyệt yêu cầu. Một số video không cho phép nhúng.";});
document.getElementById("musicStop").addEventListener("click",()=>{frame.replaceChildren();message.textContent="Đã dừng nhạc.";});
})();
