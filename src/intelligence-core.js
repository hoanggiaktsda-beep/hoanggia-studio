/* HOANGGIA Core V2: rules-based policy registry, not generative model inference. */
export const CORE_VERSION="2.0.0";
export const DEPARTMENTS=Object.freeze({
design:{lead:"architecture-design",supports:["material","lighting","camera"],locks:["function","geometry","scale"]},
edit:{lead:"image-editing",supports:["architecture-design","material","camera"],locks:["reference","geometry","camera"]},
video:{lead:"architectural-film",supports:["architecture-design","cinematography","editing"],locks:["continuity","geometry","materials"]},
upscale:{lead:"image-restoration",supports:["material","lighting"],locks:["identity","composition","geometry"]},
visual:{lead:"archviz",supports:["architecture-design","material","lighting"],locks:["geometry","scale"]},
plan:{lead:"technical-architecture",supports:["ergonomics","structure","mep"],locks:["measurements","scale"]},
material:{lead:"material-science",supports:["construction","color"],locks:["specification","provenance"]},
boq:{lead:"quantity-surveying",supports:["construction","material-science"],locks:["units","measurements","price-source"]}
});
const VIDEO_LEADS={interior:"architecture-interior",architecture:"architecture-design",urban:"urban-planning",landscape:"landscape-design",cinema:"film-directing"};
export function resolveDepartment(id,domain="interior"){
 if(!Object.hasOwn(DEPARTMENTS,id))return null;
 const d=DEPARTMENTS[id],scope=Object.hasOwn(VIDEO_LEADS,domain)?domain:"interior";
 return {id,domain:scope,lead:id==="video"?VIDEO_LEADS[scope]:d.lead,supports:[...d.supports],locks:[...d.locks],coreVersion:CORE_VERSION,modelInference:false};
}
export function validateHandoff(h){
 if(!h||typeof h!=="object"||Array.isArray(h))return {ok:false};
 return {ok:Object.hasOwn(DEPARTMENTS,h.from)&&Object.hasOwn(DEPARTMENTS,h.to)&&typeof h.projectId==="string"&&h.projectId.trim().length>0&&h.projectId.length<=100&&!!h.payload&&typeof h.payload==="object"&&!Array.isArray(h.payload)};
}
