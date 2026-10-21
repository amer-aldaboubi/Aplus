/* A+ Maths Hub: new home screen (Bento layout, welcome message). Reads the live Hub home screen and draws a new view on top.
   Every button calls the original Hub button, so behaviour is unchanged. Remove the script tag in index.html to undo. */
(function(){
  /* On by default. Open the Hub with ?newhome=0 to switch the new home screen off in this browser, ?newhome=1 to switch it back on. */
  try{var u=location.search;if(/[?&]newhome=1/.test(u))localStorage.removeItem('apx');if(/[?&]newhome=0/.test(u))localStorage.setItem('apx','0')}catch(e){}
  var on=true;try{on=localStorage.getItem('apx')!=='0'}catch(e){}
  if(!on)return;

  var CSS=[
  "#apx{position:absolute;top:0;left:0;right:0;z-index:50;min-height:100vh;overflow-x:clip;background:#F7F9FC;color:#0F2347;font:16px/1.55 'IBM Plex Sans',system-ui,sans-serif}",
  "#apx *{box-sizing:border-box}#apx a{color:inherit;text-decoration:none}#apx button{font:inherit;cursor:pointer;border:0;background:none;color:inherit;padding:0;text-align:left}",
  "#apx .gut{padding-left:max(16px,env(safe-area-inset-left,0px));padding-right:max(16px,env(safe-area-inset-right,0px))}#apx .wrap{max-width:1180px;margin:0 auto}",
  "#apx .bar{position:relative;z-index:0;display:flex;align-items:center;justify-content:space-between;gap:12px;padding-block:14px;margin-bottom:18px;color:#fff}",
  "#apx .bar::before{content:'';position:absolute;inset:0 -100vmax;background:#173A82;z-index:-1;box-shadow:0 2px 12px rgba(15,35,71,.18)}",
  "#apx .logo{display:flex;align-items:center;gap:10px;font-weight:700;font-size:19px;color:#fff}#apx .logo b{width:38px;height:38px;border-radius:10px;background:#2E92D8;color:#fff;display:grid;place-items:center;font-size:16px}",
  "#apx .bar .out{font-size:14px;font-weight:600;color:#fff;padding:9px 18px;border-radius:999px;background:#2E92D8}#apx .bar .out:hover{background:#4AA4E4}",
  "#apx .grid{display:grid;grid-template-columns:repeat(12,minmax(0,1fr));gap:16px;padding-bottom:56px}",
  "#apx .t{border-radius:18px;padding:22px;background:#fff;min-width:0;border:1px solid #E1E8F3;box-shadow:0 1px 2px rgba(15,35,71,.05)}",
  "#apx h2{margin:0 0 10px;font-size:12.5px;letter-spacing:.09em;text-transform:uppercase;color:#5A6D8F;font-weight:700}",
  "#apx .profile{grid-column:span 12;background:linear-gradient(135deg,#173A82,#2A6CC4);border:0;color:#fff;display:flex;flex-direction:row;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:20px;position:relative;overflow:hidden}",
  "#apx .profile::after{content:'';position:absolute;right:-60px;bottom:-90px;width:300px;height:300px;border-radius:50%;background:rgba(255,255,255,.07);pointer-events:none}",
  "#apx .profile>div{position:relative;z-index:1}",
  "#apx .profile .gr{font-size:14px;font-weight:600;opacity:.9}#apx .profile h1{margin:2px 0 0;font-family:inherit;font-size:clamp(26px,4vw,36px);line-height:1.15;font-weight:700}#apx .profile p.msg{margin:10px 0 0;opacity:.95;max-width:30em}",
  "#apx .ring{display:flex;align-items:center;gap:16px}#apx .ring svg{flex:none}#apx .ring b{display:block;font-size:20px}#apx .ring span{opacity:.9;font-size:14px}",
  "#apx .chips{display:flex;gap:8px;flex-wrap:wrap}#apx .chip{background:#2E92D8;border-radius:999px;padding:9px 16px;font-size:14px;font-weight:600}",
  "#apx .lesson{display:none}",
  "#apx .btns{display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:8px;margin-top:18px}#apx .btn{background:#fff;border-radius:12px;padding:11px 14px;font-weight:600;font-size:14px;color:#0F2347}",
  "#apx .sub{grid-column:span 4;display:flex;flex-direction:column;gap:6px;border-top:5px solid var(--c,#2E92D8);transition:transform .15s,box-shadow .15s}#apx .sub:hover{transform:translateY(-3px);box-shadow:0 12px 26px -14px rgba(15,35,71,.35)}",
  "#apx .sub h2{color:var(--c,#2E92D8)!important;opacity:1!important}#apx .sub h3{margin:0;font-family:inherit;font-size:21px;line-height:1.25;font-weight:700;color:#0F2347}#apx .sub small{color:#5A6D8F;font-size:14px}",
  "#apx .s0{--c:#2E92D8}#apx .s1{--c:#5B5FD6}#apx .s2{--c:#1FA37A}#apx .s3{--c:#E0702F}",
  "#apx .pl{display:flex;gap:8px;flex-wrap:wrap;margin-top:12px}#apx .pill{background:#EAF3FC;border-radius:999px;padding:8px 14px;font-size:13px;font-weight:700;color:#173A82;transition:background .15s}#apx .pill:hover{background:#D3E7FA}#apx .pill:first-child{background:#173A82;color:#fff}#apx .pill:first-child:hover{background:#244F9E}",
  "#apx .stats{grid-column:span 4;display:grid;gap:10px;align-content:start}#apx .stats div{display:flex;align-items:baseline;gap:10px}#apx .stats b{font-size:32px;font-variant-numeric:tabular-nums;line-height:1;color:#173A82}#apx .stats span{color:#5A6D8F}",
  "#apx .revs{grid-column:span 5}#apx .rv{display:flex;justify-content:space-between;align-items:center;gap:10px;padding:10px 0;border-top:1px solid #E8EEF7}#apx .rv small{display:block;color:#5A6D8F}#apx .st{color:#E0A02F;letter-spacing:2px;white-space:nowrap}#apx .hide{font-size:12px;color:#B91C1C;font-weight:700;margin-left:8px}",
  "#apx .links{grid-column:span 3}#apx .links a,#apx .links button{display:block;width:100%;padding:9px 12px;border-radius:10px;font-weight:600}#apx .links button:hover{background:#EAF3FC;color:#173A82}",
  "#apx :focus-visible{outline:3px solid #2E92D8;outline-offset:2px}",
  "#apx .tabs{display:none}",
  "@media (max-width:860px){#apx .t{grid-column:span 12!important}#apx .grid{padding-bottom:104px}#apx .profile{flex-direction:column;align-items:flex-start}",
  "#apx .tabs{display:flex;position:fixed;left:10px;right:10px;bottom:max(10px,env(safe-area-inset-bottom,0px));z-index:60;background:#fff;border:1px solid #DCE5F2;border-radius:22px;box-shadow:0 10px 30px -8px rgba(15,35,71,.35);padding:6px;gap:4px}",
  "#apx .tabs button{flex:1;display:flex;flex-direction:column;align-items:center;gap:3px;padding:8px 4px;border-radius:16px;font-size:11.5px;font-weight:700;color:#5A6D8F;text-align:center}#apx .tabs button svg{width:22px;height:22px}#apx .tabs button.on{background:#E4F0FC;color:#173A82}}",
  "@media (max-width:860px){body:has(#apx) #apc-fab{bottom:92px!important}body:has(#apx) #apc{bottom:160px!important}}",
  "#apx h1,#apx h2,#apx h3{font-family:'IBM Plex Sans',system-ui,sans-serif!important;letter-spacing:0!important}",
  "@media (prefers-reduced-motion:reduce){#apx .sub{transition:none}#apx .sub:hover{transform:none}}",
  "#apx .news{grid-column:span 12;padding:10px 14px}#apx .news>div{box-shadow:none!important;background:transparent!important;border:0!important;margin:0!important;padding:0!important;max-width:none!important;width:auto!important}",
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
      if(pb){var pl=lines(pb);if(pl.length&&/^\d+$/.test(pl[0]))D.no=pl.shift();D.name=pl[0]||'';D.level=pl[1]||''}
      [].slice.call(head.querySelectorAll('a,button')).forEach(function(e){
        if(e.getAttribute('title')==='My progress')return;
        var t=strip(e.innerText||'');if(t&&!/^\d+$/.test(t)&&t!=='∞')D.nav.push({t:t,href:e.tagName==='A'?e.href:''})})
    }
    kids.forEach(function(k){
      var t=k.innerText||'';
      if(/^\s*Next lesson/.test(t)){var L=lines(k);D.lesson=L[1]||'';D.lbtn=[].slice.call(k.querySelectorAll('button')).map(function(b){return strip(b.innerText)});
        var ev=L.filter(function(x){return /^You earned/.test(x)})[0];D.ev=ev||'';if(/From your teacher|Class activity|Maths timetable/.test(t)&&k.querySelectorAll('button').length>=2&&!D.news){D.news=k;D.lbtn=[];D.newsHasLesson=1}}
      else if(/What students say/.test(t)){var R=lines(k);D.rsum=(R.filter(function(x){return /reviews?$/.test(x)})[0])||'';
        for(var i=0;i<R.length;i++){if(/★/.test(R[i])&&!/\d\.\d/.test(R[i])){D.revs.push({n:R[i].replace(/[★☆\s]+$/,''),s:(R[i].match(/★/g)||[]).length,w:(R[i+1]||'').replace(/Hide$/,'')})}}
        D.hide=k.querySelectorAll('button').length}
      else if(/STUDENTS/.test(t)&&/QUESTIONS SOLVED/.test(t)){var S=lines(k);for(var j=0;j+1<S.length;j+=2)D.stats.push([S[j],S[j+1]])}
      else if(/MARK SCHEMES/.test(t)){var C=lines(k);for(var m=0;m+1<C.length;m+=2)D.counts.push([C[m],C[m+1]])}
      else if(/From your teacher|Class activity/.test(t)&&k.querySelectorAll('button').length&&!D.news){D.news=k}
      else if(/Created by/.test(t)){var B=lines(k);D.brandSub=B[3]||'';D.brandTag=B[1]||''}
    });
    [].slice.call(fi.querySelectorAll('.ap-home-card')).forEach(function(c){var C=lines(c);D.cards.push({t:C[0]||'',l:C[1]||'',d:C[2]||''})});
    return D}

  function navItem(D,name){for(var i=0;i<D.nav.length;i++)if(D.nav[i].t===name)return D.nav[i];return null}

  function greet(){var h=new Date().getHours();return h<12?'Good morning':h<18?'Good afternoon':'Good evening'}
  function render(){
    var fi=home();
    if(!fi){if(mount){mount.remove();mount=null;lastSig=''}var h0=document.querySelector('[data-apx-hide]');if(h0)h0.removeAttribute('data-apx-hide');return}
    var sig=(fi.innerText||'');if(mount&&sig===lastSig)return;lastSig=sig;
    var D=parse(fi);fi.setAttribute('data-apx-hide','1');fi.setAttribute('aria-hidden','true');
    var all=fi.innerText||'';
    var first=(D.name||'').replace(/^\d+/,'').split(/[\s.]+/)[0]||'';
    var lvNo=D.no||'1';
    var nx=all.match(/(\d+)\s*points?\s*to\s*([A-Za-z]+)/i);
    var pts=(all.match(/(\d+)\s*pts/i)||[])[1]||'0';
    var when=(D.lesson||'').split(/\s*[·|]\s*/)[0];
    var msg=(nx?'You are '+nx[1]+' points from '+nx[2]+'. ':'')+(when?'Your next lesson is '+when.toLowerCase()+', and ':'')+(when?'ten':'Ten')+' minutes of practice today is a good start.';
    var pct=nx?Math.max(4,Math.min(96,100-Math.round(+nx[1]/(+nx[1]+ +pts||1)*100))):10;
    var circ=214,off=Math.round(circ*(1-pct/100));
    var ring='<svg width="84" height="84" viewBox="0 0 84 84" aria-hidden="true"><circle cx="42" cy="42" r="34" fill="none" stroke="rgba(255,255,255,.25)" stroke-width="9"/><circle cx="42" cy="42" r="34" fill="none" stroke="#FFE9A8" stroke-width="9" stroke-linecap="round" stroke-dasharray="214" stroke-dashoffset="'+off+'" transform="rotate(-90 42 42)"/><text x="42" y="49" text-anchor="middle" fill="#fff" font-size="22" font-weight="700">'+esc(lvNo)+'</text></svg>';
    var ws=navItem(D,'Worksheets'),sl=navItem(D,'Slides'),ex=navItem(D,'Exam practice');
    var quick=D.nav.filter(function(n){return n.t!=='Sign out'&&n.t!=='My progress'});
    var h='';
    h+='<div class="wrap gut"><div class="bar"><a class="logo" href="#" data-act="reload"><b>A+</b><span>Maths Hub</span></a><button class="out" data-nav="Sign out">Sign out</button></div>';
    h+='<div class="grid">';
    h+='<section class="t profile"><div><div class="gr">'+greet()+'</div><h1>Welcome back'+(first?', '+esc(first):'')+'</h1><p class="msg">'+esc(msg)+'</p></div>';
    h+='<div class="ring">'+ring+'<div><b>'+esc(D.level||'')+'</b>'+(nx?'<span>'+esc(nx[1])+' points to '+esc(nx[2])+'</span>':'')+'</div></div>';
    h+='<div class="chips"><button class="chip" data-nav="My progress">My progress</button></div></section>';
    if(D.news)h+='<section class="t news"></section>';
    D.cards.forEach(function(c,i){
      h+='<section class="t sub s'+(i%4)+'"><h2 style="color:inherit;opacity:.7">Subject</h2><h3>'+esc(c.t)+'</h3><small>'+esc(c.l)+'</small><small>'+esc(c.d)+'</small><div class="pl"><button class="pill" data-card="'+i+'">Topic Questions</button>';
      if(ws)h+='<button class="pill" data-nav="Worksheets">Worksheets</button>';
      if(ex&&i===0)h+='<button class="pill" data-nav="Exam practice">Exam practice</button>';
      if(sl)h+='<button class="pill" data-nav="Slides">Slides</button>';
      h+='</div></section>'});
    if(D.stats.length){h+='<section class="t stats"><h2>Across the Hub</h2>'+D.stats.map(function(s){return '<div><b>'+esc(s[0])+'</b><span>'+esc(s[1].toLowerCase())+'</span></div>'}).join('')+'</section>'}
    if(D.revs.length){h+='<section class="t revs"><h2>What students say'+(D.rsum?' · '+esc(D.rsum.replace(/^★+\s*/,'')):'')+'</h2>'+D.revs.map(function(r,i){return '<div class="rv"><div><b>'+esc(r.n)+'</b><small>'+esc(r.w)+'</small></div><span><span class="st" aria-label="'+r.s+' out of 5">'+'★'.repeat(r.s)+'</span>'+(D.hide>0?'<button class="hide" data-hide="'+i+'">Hide</button>':'')+'</span></div>'}).join('')+'</section>'}
    if(quick.length){h+='<section class="t links"><h2>Quick links</h2>'+quick.map(function(n){return '<button data-nav="'+esc(n.t)+'">'+esc(n.t)+'</button>'}).join('')+'</section>'}
    h+='</div></div>';
    h+='<nav class="tabs" aria-label="Main"><button class="on" data-scroll="top"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/></svg>Home</button><button data-scroll="sub"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>Subjects</button>'+(ws?'<button data-nav="Worksheets"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3h9l4 4v14H6z"/><path d="M9 12h7M9 16h7"/></svg>Worksheets</button>':'')+'<button data-nav="My progress"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20V10M10 20V4M16 20v-8M22 20H2"/></svg>Progress</button></nav>';
    if(!mount){mount=document.createElement('div');mount.id='apx';document.body.appendChild(mount)}
    mount.innerHTML=h;
    if(D.news){var ns=mount.querySelector('.news');if(ns){var cl=D.news.cloneNode(true);cl.removeAttribute('data-apx-hide');if(D.newsHasLesson){var best=null,bn=1e9;[].slice.call(cl.querySelectorAll('div')).forEach(function(d){if(/^\s*(Next lesson|Lesson on now)/.test(d.innerText||'')&&d.querySelector('svg')){var c=d.querySelectorAll('*').length;if(c<bn){bn=c;best=d}}});if(best&&best.parentNode)best.parentNode.removeChild(best)}ns.appendChild(cl)}}
  }

  function findNav(fi,name){var all=fi.querySelectorAll('a,button');for(var i=0;i<all.length;i++){if(all[i].getAttribute('title')==='My progress'&&name==='My progress')return all[i];if(strip(all[i].innerText||'')===name&&all[i].getAttribute('title')!=='My progress')return all[i]}return null}
  document.addEventListener('click',function(e){
    var m=e.target.closest&&e.target.closest('#apx');if(!m)return;
    var fi=document.querySelector('[data-apx-hide]');if(!fi)return;
    var nsec=e.target.closest('#apx .news');
    if(nsec){var nb=e.target.closest('button,a');if(!nb)return;var orig=null;for(var q=0;q<fi.children.length&&!orig;q++){if(/From your teacher|Class activity/.test(fi.children[q].innerText||'')&&fi.children[q].querySelectorAll('button').length)orig=fi.children[q]}
      if(orig){var cs=[].slice.call(nsec.querySelectorAll('button,a')),os=[].slice.call(orig.querySelectorAll('button,a')),ix=cs.indexOf(nb);if(ix>-1&&os[ix]){e.preventDefault();if(nb.tagName==='A'&&nb.href&&!/^#/.test(nb.getAttribute('href')||'#')&&nb.target==='_blank'){window.open(nb.href,'_blank');return}os[ix].click()}}
      return}
    var t=e.target.closest('[data-nav],[data-card],[data-lb],[data-hide],[data-act],[data-scroll]');if(!t)return;
    e.preventDefault();
    if(t.hasAttribute('data-scroll')){var tg=t.getAttribute('data-scroll')==='top'?null:m.querySelector('.sub');window.scrollTo({top:tg?tg.getBoundingClientRect().top+window.scrollY-12:0,behavior:'smooth'});[].slice.call(m.querySelectorAll('.tabs button')).forEach(function(b){b.classList.toggle('on',b===t)});return}
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