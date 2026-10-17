/* A+ Maths Hub: new home screen (course-page layout). Reads the live Hub home screen and draws a new view on top.
   Every button calls the original Hub button, so behaviour is unchanged. Remove the script tag in index.html to undo. */
(function(){
  /* Preview switch: open the Hub with ?newhome=1 to turn the new home screen on in this browser, ?newhome=0 to turn it off. */
  try{var u=location.search;if(/[?&]newhome=1/.test(u))localStorage.setItem('apx','1');if(/[?&]newhome=0/.test(u))localStorage.removeItem('apx')}catch(e){}
  var on=false;try{on=localStorage.getItem('apx')==='1'}catch(e){}
  if(!on)return;
  var CSS=[
  "#apx{position:absolute;top:0;left:0;right:0;z-index:50;min-height:100vh;background:#F1F5F9;color:#1E293B;font:15px/1.55 'IBM Plex Sans',system-ui,sans-serif}",
  "#apx *{box-sizing:border-box}#apx a{color:inherit;text-decoration:none}#apx button{font:inherit;cursor:pointer;border:0;background:none;color:inherit;padding:0}",
  "#apx .gut{padding-left:max(16px,env(safe-area-inset-left,0px));padding-right:max(16px,env(safe-area-inset-right,0px))}#apx .wrap{max-width:1180px;margin:0 auto}",
  "#apx .top{background:#fff;border-bottom:1px solid #E2E8F0}#apx .top .wrap{display:flex;align-items:center;flex-wrap:wrap;gap:12px 20px;padding-block:12px}",
  "#apx .logo{display:flex;align-items:center;gap:10px;font-weight:600;font-size:18px;color:#1E293B}#apx .logo b{width:36px;height:36px;border-radius:9px;background:#1D4ED8;color:#fff;display:grid;place-items:center;font-size:16px}",
  "#apx .search{flex:1;max-width:560px;margin:0 auto;min-width:220px;position:relative}#apx .search input{width:100%;border:1px solid #CBD5E1;background:#F8FAFC;border-radius:999px;padding:10px 16px 10px 40px;font:inherit;color:#1E293B}#apx .search input:focus{background:#fff;border-color:#1D4ED8;outline:none}",
  "#apx .search svg{position:absolute;left:14px;top:50%;transform:translateY(-50%);width:18px;height:18px;stroke:#94A3B8;fill:none;stroke-width:1.8;stroke-linecap:round}",
  "#apx .right{margin-left:auto;display:flex;align-items:center;gap:16px;font-size:14px;font-weight:500;color:#334155}#apx .right button:hover{color:#1D4ED8}",
  "#apx .me{display:flex;align-items:center;gap:8px}#apx .av{width:34px;height:34px;border-radius:50%;background:#E2E8F0;border:1px solid #CBD5E1;display:grid;place-items:center;font-size:13px;font-weight:600;color:#334155}",
  "#apx .crumb{background:rgba(226,232,240,.75);border-bottom:1px solid #CBD5E1}#apx .crumb .wrap{padding-block:9px;font-size:14px;color:#475569;white-space:nowrap;overflow-x:auto}#apx .crumb i{margin:0 8px;color:#94A3B8;font-style:normal}#apx .crumb b{color:#1E293B;font-weight:600}",
  "#apx .title{background:#fff;border-bottom:1px solid #E2E8F0}#apx .title .wrap{padding-block:30px 28px}",
  "#apx .eyebrow{margin:0;font-size:13px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:#1D4ED8}",
  "#apx h1{margin:8px 0 0;font-size:clamp(28px,4.5vw,40px);line-height:1.1;font-weight:700;letter-spacing:-.015em;color:#1E293B}",
  "#apx .sub{margin:8px 0 0;color:#475569;max-width:44em}",
  "#apx .meter{margin-top:20px;max-width:560px}#apx .meter div.row{display:flex;justify-content:space-between;gap:12px;font-size:14px;color:#334155}#apx .meter .bar{margin-top:8px;height:10px;border-radius:999px;background:#E2E8F0;overflow:hidden}#apx .meter .bar i{display:block;height:100%;background:#1D4ED8;border-radius:999px;min-width:6px}",
  "#apx .stats{display:flex;flex-wrap:wrap;gap:8px 28px;margin-top:18px;font-size:13px;color:#475569}#apx .stats b{font-size:18px;color:#1E293B;margin-right:6px;font-variant-numeric:tabular-nums}",
  "#apx .body .wrap{display:grid;grid-template-columns:minmax(0,1fr) 330px;gap:28px;padding-block:28px 56px;align-items:start}",
  "#apx h2{margin:0;font-size:20px;font-weight:700;color:#1E293B}",
  "#apx .card{background:#fff;border:1px solid #E2E8F0;border-radius:12px;box-shadow:0 1px 2px rgba(15,23,42,.06);padding:22px}#apx .tcard{border-top:4px solid #1D4ED8;margin-top:16px}",
  "#apx .tcard h3{margin:0;font-size:18px;font-weight:600;color:#1E293B}#apx .tcard .lv{margin:2px 0 0;font-size:13px;font-weight:600;color:#1D4ED8}#apx .tcard p.d{margin:6px 0 0;font-size:14px;color:#475569}",
  "#apx .pills{display:flex;flex-wrap:wrap;gap:10px;margin-top:16px}#apx .pill{display:inline-flex;align-items:center;gap:8px;border-radius:999px;padding:8px 14px;font-size:14px;font-weight:500;border:1px solid transparent;transition:transform .15s,box-shadow .15s}#apx .pill:hover{transform:translateY(-1px);box-shadow:0 2px 6px rgba(15,23,42,.1)}",
  "#apx .pq{background:#DCFCE7;color:#166534;border-color:#BBF7D0}#apx .pw{background:#E0F2FE;color:#075985;border-color:#BAE6FD}#apx .pe{background:#EDE9FE;color:#5B21B6;border-color:#DDD6FE}#apx .ps{background:#FEF3C7;color:#92400E;border-color:#FDE68A}",
  "#apx .side{position:sticky;top:20px;display:grid;gap:18px}#apx .side h2{font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:#64748B}",
  "#apx .lesson .t{margin:10px 0 0;font-size:19px;font-weight:600;color:#1E293B;line-height:1.3}#apx .lesson .b{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:14px}",
  "#apx .btn{border:1px solid #CBD5E1;border-radius:8px;padding:9px 10px;font-size:13px;font-weight:600;color:#1E293B;background:#fff;text-align:center;transition:border-color .15s,background .15s}#apx .btn:hover{border-color:#1D4ED8;background:#EFF6FF;color:#1D4ED8}",
  "#apx .ev{margin:14px 0 0;font-size:13px;color:#475569;border-top:1px solid #E2E8F0;padding-top:12px}",
  "#apx .links{display:grid;gap:2px;margin-top:10px}#apx .links button,#apx .links a{display:block;text-align:left;padding:8px 10px;border-radius:8px;font-size:14px;color:#334155;font-weight:500}#apx .links button:hover,#apx .links a:hover{background:#F1F5F9;color:#1D4ED8}",
  "#apx .rev{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:10px 0;border-top:1px solid #E2E8F0;font-size:14px}#apx .rev small{display:block;color:#64748B;font-size:12px}#apx .st{color:#B7791F;letter-spacing:2px;font-size:13px;white-space:nowrap}#apx .hide{font-size:12px;color:#B91C1C;font-weight:600;margin-left:8px}",
  "#apx :focus-visible{outline:2px solid #1D4ED8;outline-offset:2px}",
  "@media (max-width:900px){#apx .body .wrap{grid-template-columns:minmax(0,1fr)}#apx .side{position:static}}",
  "@media (prefers-reduced-motion:reduce){#apx .pill{transition:none}}",
  "[data-apx-hide]{position:fixed!important;left:-99999px!important;top:0!important;width:480px!important;max-width:480px!important;opacity:0!important;pointer-events:none!important}"
  ].join("\n");
  var st=document.createElement('style');st.id='apx-css';st.textContent=CSS;document.head.appendChild(st);

  function esc(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
  function strip(s){return String(s).replace(/^[^\p{L}\p{N}]+/u,'').trim()}
  function lines(el){return (el.innerText||'').split('\n').map(function(x){return x.trim()}).filter(Boolean)}
  var mount=null,lastSig='';

  function home(){var fi=document.querySelector('.fade-in');return fi&&fi.querySelector('.ap-home-card')?fi:null}
  function parse(fi){
    var kids=[].slice.call(fi.children),D={nav:[],cards:[],revs:[],stats:[],counts:[]};
    var head=kids[0];
    if(head){
      var pb=head.querySelector('button[title="My progress"]');
      if(pb){var pl=lines(pb);if(pl.length&&/^\d+$/.test(pl[0]))pl.shift();D.name=pl[0]||'';D.level=pl[1]||''}
      [].slice.call(head.querySelectorAll('a,button')).forEach(function(e){
        if(e.getAttribute('title')==='My progress')return;
        var t=strip(e.innerText||'');if(t&&!/^\d+$/.test(t)&&t!=='∞')D.nav.push({t:t,href:e.tagName==='A'?e.href:''})})
    }
    kids.forEach(function(k){
      var t=k.innerText||'';
      if(/^\s*Next lesson/.test(t)){var L=lines(k);D.lesson=L[1]||'';D.lbtn=[].slice.call(k.querySelectorAll('button')).map(function(b){return strip(b.innerText)});
        var ev=L.filter(function(x){return /^You earned/.test(x)})[0];D.ev=ev||''}
      else if(/What students say/.test(t)){var R=lines(k);D.rsum=(R.filter(function(x){return /reviews?$/.test(x)})[0])||'';
        for(var i=0;i<R.length;i++){if(/★/.test(R[i])&&!/\d\.\d/.test(R[i])){D.revs.push({n:R[i].replace(/[★☆\s]+$/,''),s:(R[i].match(/★/g)||[]).length,w:(R[i+1]||'').replace(/Hide$/,'')})}}
        D.hide=k.querySelectorAll('button').length}
      else if(/STUDENTS/.test(t)&&/QUESTIONS SOLVED/.test(t)){var S=lines(k);for(var j=0;j+1<S.length;j+=2)D.stats.push([S[j],S[j+1]])}
      else if(/MARK SCHEMES/.test(t)){var C=lines(k);for(var m=0;m+1<C.length;m+=2)D.counts.push([C[m],C[m+1]])}
      else if(/Created by/.test(t)){var B=lines(k);D.brandSub=B[3]||'';D.brandTag=B[1]||''}
    });
    [].slice.call(fi.querySelectorAll('.ap-home-card')).forEach(function(c){var C=lines(c);D.cards.push({t:C[0]||'',l:C[1]||'',d:C[2]||''})});
    return D}

  function navItem(D,name){for(var i=0;i<D.nav.length;i++)if(D.nav[i].t===name)return D.nav[i];return null}
  function render(){
    var fi=home();
    if(!fi){if(mount){mount.remove();mount=null;lastSig=''}var h=document.querySelector('[data-apx-hide]');if(h){h.removeAttribute('data-apx-hide');h.removeAttribute('aria-hidden')}return}
    var sig=(fi.innerText||'');if(mount&&sig===lastSig)return;lastSig=sig;
    var D=parse(fi);fi.setAttribute('data-apx-hide','1');fi.setAttribute('aria-hidden','true');
    var marked=0,total=0;D.counts.forEach(function(c){if(/QUESTIONS$/i.test(c[1]))total=parseInt(c[0],10)||total;if(/MARKED/i.test(c[1]))marked=parseInt(c[0],10)||0});
    var pct=total?Math.min(100,Math.round(marked/total*100)):0;
    var initials=(D.name||'?').split(/[\s.]+/).filter(Boolean).slice(0,2).map(function(x){return x[0]}).join('').toUpperCase();
    var ws=navItem(D,'Worksheets'),sl=navItem(D,'Slides'),ex=navItem(D,'Exam practice');
    var quick=D.nav.filter(function(n){return n.t!=='Sign out'&&n.t!=='My progress'&&n.t!=='Worksheets'&&n.t!=='Slides'});
    var h='';
    h+='<div class="top"><div class="wrap gut"><a class="logo" href="#" data-act="reload"><b>A+</b><span>Maths Hub</span></a>';
    h+='<form class="search" role="search" onsubmit="return false"><svg><circle cx="11" cy="11" r="7" fill="none"/><path d="M20 20l-4-4"/></svg><label class="sr" style="position:absolute;left:-9999px" for="apx-q">Search subjects</label><input id="apx-q" type="search" placeholder="Search subjects and topics"></form>';
    h+='<div class="right"><button data-nav="My progress">Dashboard</button><button class="me" data-nav="My progress" aria-label="My progress"><span class="av">'+esc(initials)+'</span></button></div></div></div>';
    h+='<div class="crumb"><div class="wrap gut"><span>Home</span><i>/</i><span>Edexcel</span><i>/</i><b>IGCSE &amp; IAL Mathematics</b></div></div>';
    h+='<div class="title"><div class="wrap gut"><p class="eyebrow">'+esc(D.brandTag||'Pearson Edexcel')+'</p><h1>A+ Maths Hub</h1><p class="sub">'+esc(D.brandSub||'Past-paper practice with mark schemes')+'</p>';
    h+='<div class="meter"><div class="row"><span>'+esc(D.name||'')+(D.level?' · '+esc(D.level):'')+'</span><span>'+marked+' of '+total+' questions marked</span></div><div class="bar" role="progressbar" aria-valuenow="'+pct+'" aria-valuemin="0" aria-valuemax="100" aria-label="Questions marked"><i style="width:'+pct+'%"></i></div></div>';
    h+='<div class="stats">'+D.stats.map(function(s){return '<span><b>'+esc(s[0])+'</b>'+esc(s[1].toLowerCase())+'</span>'}).join('')+'</div></div></div>';
    h+='<div class="body"><div class="wrap gut"><main><h2>Subjects</h2><div id="apx-cards">';
    D.cards.forEach(function(c,i){
      h+='<article class="card tcard" data-q="'+esc((c.t+' '+c.l+' '+c.d).toLowerCase())+'"><h3>'+esc(c.t)+'</h3><p class="lv">'+esc(c.l)+'</p><p class="d">'+esc(c.d)+'</p><div class="pills">';
      h+='<button class="pill pq" data-card="'+i+'">Topic Questions</button>';
      if(ws)h+='<button class="pill pw" data-nav="Worksheets">Worksheets</button>';
      if(ex&&i===0)h+='<button class="pill pe" data-nav="Exam practice">Exam practice</button>';
      if(sl)h+='<button class="pill ps" data-nav="Slides">Slides</button>';
      h+='</div></article>'});
    h+='<p id="apx-none" hidden style="color:#475569">No subject matches your search.</p></div></main><aside class="side">';
    if(D.lesson){h+='<section class="card lesson"><h2>Next lesson</h2><p class="t">'+esc(D.lesson)+'</p><div class="b">'+(D.lbtn||[]).map(function(b,i){return '<button class="btn" data-lb="'+i+'">'+esc(b)+'</button>'}).join('')+'</div>'+(D.ev?'<p class="ev">'+esc(D.ev)+'</p>':'')+'</section>'}
    if(quick.length){h+='<section class="card"><h2>Quick links</h2><div class="links">'+quick.map(function(n){return '<button data-nav="'+esc(n.t)+'">'+esc(n.t)+'</button>'}).join('')+'<button data-nav="Sign out">Sign out</button></div></section>'}
    if(D.revs.length){h+='<section class="card"><h2>What students say'+(D.rsum?' · '+esc(D.rsum.replace(/^★+\s*/,'')):'')+'</h2><div style="margin-top:8px">'+D.revs.map(function(r,i){return '<div class="rev"><div><b>'+esc(r.n)+'</b><small>'+esc(r.w)+'</small></div><span><span class="st" aria-label="'+r.s+' out of 5">'+'★'.repeat(r.s)+'</span>'+(D.hide>0?'<button class="hide" data-hide="'+i+'">Hide</button>':'')+'</span></div>'}).join('')+'</div></section>'}
    h+='</aside></div></div>';
    if(!mount){mount=document.createElement('div');mount.id='apx';document.body.appendChild(mount)}
    mount.innerHTML=h;
    var q=mount.querySelector('#apx-q');
    if(q)q.addEventListener('input',function(){var v=q.value.toLowerCase().trim(),n=0;mount.querySelectorAll('.tcard').forEach(function(c){var ok=!v||c.getAttribute('data-q').indexOf(v)>-1;c.hidden=!ok;if(ok)n++});mount.querySelector('#apx-none').hidden=n>0})
  }

  function findNav(fi,name){var all=fi.querySelectorAll('a,button');for(var i=0;i<all.length;i++){if(all[i].getAttribute('title')==='My progress'&&name==='My progress')return all[i];if(strip(all[i].innerText||'')===name&&all[i].getAttribute('title')!=='My progress')return all[i]}return null}
  document.addEventListener('click',function(e){
    var m=e.target.closest&&e.target.closest('#apx');if(!m)return;
    var fi=document.querySelector('[data-apx-hide]');if(!fi)return;
    var t=e.target.closest('[data-nav],[data-card],[data-lb],[data-hide],[data-act]');if(!t)return;
    e.preventDefault();
    var el=null;
    if(t.hasAttribute('data-nav')){el=findNav(fi,t.getAttribute('data-nav'));if(el&&el.tagName==='A'&&el.href){location.href=el.href;return}}
    else if(t.hasAttribute('data-card')){el=fi.querySelectorAll('.ap-home-card')[+t.getAttribute('data-card')]}
    else if(t.hasAttribute('data-lb')){var blocks=[].slice.call(fi.children).filter(function(k){return /^\s*Next lesson/.test(k.innerText||'')});el=blocks[0]&&blocks[0].querySelectorAll('button')[+t.getAttribute('data-lb')]}
    else if(t.hasAttribute('data-hide')){var rb=[].slice.call(fi.children).filter(function(k){return /What students say/.test(k.innerText||'')})[0];if(rb){var hs=[].slice.call(rb.querySelectorAll('button'));el=hs[+t.getAttribute('data-hide')]}}
    else if(t.getAttribute('data-act')==='reload'){location.href=location.pathname;return}
    if(el)el.click()
  },true);

  var timer=null;
  var obs=new MutationObserver(function(){clearTimeout(timer);timer=setTimeout(render,250)});
  function start(){obs.observe(document.getElementById('root')||document.body,{childList:true,subtree:true,characterData:true});render()}
  if(document.body)start();else document.addEventListener('DOMContentLoaded',start);
})();
