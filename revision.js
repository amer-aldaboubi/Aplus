/* Revision sets: a teacher-chosen list of question codes that students open from the home page.
   Add a set by appending to window.APREV. keys = question codes (same codes as the class-activity links). */
window.APREV=[
 {id:"y10-ch6-9",title:"Year 10 Revision",sub:"Chapters 6-9: speed & density, indices & surds, angles & Pythagoras, area & perimeter",subject:"m",label:"Maths A (4MA1)",
  keys:["m06-June2018-Paper2HR-5", "m06-January2019-Paper1HR-5", "m06-June2024-Paper2H-3", "m06-January2023-Paper2H-2", "m06-June2025-Paper2HR-7", "m06-June2018-Paper2HR-2", "m06-January2022-Paper1HR-7", "m06-June2019-Paper1H-6", "m06-November2020-Paper1HR-9", "m06-November2020-Paper1HR-7", "m06-June2019-Paper2H-8", "m06-November2021-Paper1H-10", "m06-January2020-Paper1H-13", "m02-January2020-Paper2H-1", "m02-November2021-Paper2H-1", "m02-January2023-Paper1H-12", "m02-June2025-Paper1H-4", "m02-June2018-Paper2H-10", "m02-June2018-Paper2HR-14", "m02-June2021-Paper1H-11", "m02-November2024-Paper1H-17", "m02-November2021-Paper2H-17", "m02-January2022-Paper2HR-13", "m02-January2019-Paper1HR-18", "m02-June2018-Paper2H-21", "m02-November2020-Paper1H-19", "m02-January2023-Paper1HR-18", "m17-January2019-Paper1H-5", "m17-November2020-Paper2H-3", "m18-June2018-Paper2HR-8", "m18-January2019-Paper1HR-3", "m18-November2021-Paper1H-2", "m18-January2022-Paper1HR-3", "m17-January2019-Paper1HR-6", "m17-June2021-Paper2H-5", "m18-June2023-Paper1H-5", "m18-June2024-Paper1H-11", "m18-June2022-Paper1HR-18", "m18-June2025-Paper1HR-20", "m26-November2025-Paper2F-15", "m26-June2023-Paper1F-7", "m17-June2023-Paper2H-3", "m26-January2022-Paper2FR-6", "m26-January2022-Paper2FR-9", "m26-November2024-Paper2F-14", "m26-June2022-Paper1F-15", "m26-June2023-Paper1F-13", "m26-June2026-Paper1F-17", "m26-June2025-Paper1F-17", "m26-June2026-Paper2F-14"]}
];
(function(){
  function find(id){for(var i=0;i<window.APREV.length;i++)if(window.APREV[i].id===id)return window.APREV[i];return null}
  window.apStartRevision=function(id){try{sessionStorage.removeItem("aplus-task");sessionStorage.setItem("aplus-rev",id)}catch(e){}location.reload()};
  try{var id=sessionStorage.getItem("aplus-rev"),r=id&&find(id);
    if(r){window.APT={keys:r.keys.slice(),sid:r.subject,ch:1,title:r.title+" ("+r.keys.length+" questions)",rev:r.id}}
    else if(id)sessionStorage.removeItem("aplus-rev")}catch(e){}
  var css=document.createElement("style");css.textContent=
   "#apx .rev{grid-column:span 12;display:flex;gap:16px;align-items:center;flex-wrap:wrap;border-left:5px solid #E8B923}"+
   "#apx .rev .ic{flex:none;width:52px;height:52px;border-radius:14px;background:#FFF4CC;display:flex;align-items:center;justify-content:center;color:#8A6D12}"+
   "#apx .rev h2{margin:0;font-size:12px;letter-spacing:.07em;text-transform:uppercase;color:#8A6D12}"+
   "#apx .rev .rl{flex:1 1 220px;min-width:0}#apx .rev h3{margin:2px 0 2px;font-family:inherit;font-size:19px;color:#0F2347}"+
   "#apx .rev small{color:#5A6D8F;font-size:14px;display:block}"+
   "#apx .rev .rb{display:flex;gap:8px;flex-wrap:wrap}#apx .rev button{background:#E8B923;color:#1B2A4A;border-radius:999px;padding:10px 18px;font-weight:800;font-size:14px}"+
   "@media(max-width:700px){#apx .rev{grid-column:span 12}}";
  (document.head||document.documentElement).appendChild(css);
})();
