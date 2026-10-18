/* A+ Maths Hub: new home screen (Bento layout, welcome message). Reads the live Hub home screen and draws a new view on top.
   Every button calls the original Hub button, so behaviour is unchanged. Remove the script tag in index.html to undo. */
(function(){
  /* On by default. Open the Hub with ?newhome=0 to switch the new home screen off in this browser, ?newhome=1 to switch it back on. */
  try{var u=location.search;if(/[?&]newhome=1/.test(u))localStorage.removeItem('apx');if(/[?&]newhome=0/.test(u))localStorage.setItem('apx','0')}catch(e){}
  var on=true;try{on=localStorage.getItem('apx')!=='0'}catch(e){}
  if(!on)return;

  var CSS=[
  "#apx{position:absolute;top:0;left:0;right:0;z-index:50;min-height:100vh;background:#F3F4FB;color:#16213E;font:15px/1.55 'IBM Plex Sans',system-ui,sans-serif}",
  "#apx *{box-sizing:border-box}#apx a{color:inherit;text-decoration:none}#apx button{font:inherit;cursor:pointer;border:0;background:none;color:inherit;padding:0;text-align:left}",
  "#apx .gut{padding-left:max(16px,env(safe-area-inset-left,0px));padding-right:max(16px,env(safe-area-inset-right,0px))}#apx .wrap{max-width:1180px;margin:0 auto}",
  "#apx .bar{display:flex;align-items:center;justify-content:space-between;gap:12px;padding-block:16px}#apx .logo{display:flex;align-items:center;gap:10px;font-weight:700;font-size:18px}#apx .logo b{width:36px;height:36px;border-radius:12px;background:#4338CA;color:#fff;display:grid;place-items:center;font-size:15px}",
  "#apx .bar .out{font-size:14px;font-weight:600;color:#4B5680;padding:8px 14px;border-radius:999px;background:#fff}#apx .bar .out:hover{color:#4338CA}",
  "#apx .grid{display:grid;grid-template-columns:repeat(12,minmax(0,1fr));gap:16px;padding-bottom:56px}",
  "#apx .t{border-radius:28px;padding:24px;background:#fff;min-width:0;box-shadow:0 1px 0 rgba(22,33,62,.04)}",
  "#apx h2{margin:0 0 10px;font-size:13px;letter-spacing:.08em;text-transform:uppercase;color:#5B6690;font-weight:700}",
  "#apx .profile{grid-column:span 5;background:linear-gradient(150deg,#4338CA,#6D5BF0);color:#fff;display:flex;flex-direction:column;gap:18px}",
  "#apx .profile .gr{font-size:14px;font-weight:600;opacity:.9}#apx .profile h1{margin:2px 0 0;font-size:clamp(28px,4vw,36px);line-height:1.1;font-weight:700;letter-spacing:-.01em}#apx .profile p.msg{margin:10px 0 0;opacity:.95;max-width:27em}",
  "#apx .ring{display:flex;align-items:center;gap:18px}#apx .ring svg{flex:none}#apx .ring b{display:block;font-size:20px}#apx .ring span{opacity:.9;font-size:14px}",
  "#apx .chips{display:flex;gap:8px;flex-wrap:wrap}#apx .chip{background:rgba(255,255,255,.18);border-radius:999px;padding:6px 12px;font-size:13px;font-weight:600}",
  "#apx .lesson{grid-column:span 7;background:#FFE9A8;color:#3F3208}#apx .lesson h2{color:#6B520A}#apx .lesson .big{font-size:clamp(26px,3.5vw,34px);font-weight:700;line-height:1.15;margin:0}#apx .lesson .ev{margin:12px 0 0;font-size:14px}",
  "#apx .btns{display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:8px;margin-top:18px}#apx .btn{background:#fff;border-radius:14px;padding:11px 14px;font-weight:600;font-size:14px;transition:transform .15s;color:#16213E}#apx .btn:hover{transform:translateY(-2px)}",
  "#apx .sub{grid-column:span 4;display:flex;flex-direction:column;gap:6px}#apx .sub .g{font-size:54px;line-height:1;font-weight:700;opacity:.9}#apx .sub h3{margin:0;font-size:20px;line-height:1.2}#apx .sub small{opacity:.8;font-size:13px}#apx .sub .n{font-size:14px;margin-top:auto;padding-top:14px;font-weight:600}",
  "#apx .s0{background:#CFE3FF;color:#0B3A7A}#apx .s1{background:#E4D8FF;color:#3A1D86}#apx .s2{background:#C8F3DE;color:#0B5A3A}#apx .s3{background:#FFD9D2;color:#7A1F12}",
  "#apx .pl{display:flex;gap:6px;flex-wrap:wrap;margin-top:10px}#apx .pill{background:rgba(255,255,255,.75);border-radius:999px;padding:6px 12px;font-size:12px;font-weight:700;color:inherit;transition:transform .15s}#apx .pill:hover{transform:translateY(-1px);background:#fff}",
  "#apx .stats{grid-column:span 4;display:grid;gap:10px;align-content:start}#apx .stats div{display:flex;align-items:baseline;gap:10px}#apx .stats b{font-size:34px;font-variant-numeric:tabular-nums;line-height:1}#apx .stats span{color:#5B6690}",
  "#apx .revs{grid-column:span 5}#apx .rv{display:flex;justify-content:space-between;align-items:center;gap:10px;padding:10px 0;border-top:1px solid #EEF0F6}#apx .rv small{display:block;color:#6B7699}#apx .st{color:#B7791F;letter-spacing:2px;white-space:nowrap}#apx .hide{font-size:12px;color:#B91C1C;font-weight:700;margin-left:8px}",
  "#apx .links{grid-column:span 3}#apx .links a,#apx .links button{display:block;width:100%;padding:8px 12px;border-radius:12px;font-weight:600}#apx .links button:hover{background:#F0F2FA;color:#4338CA}",
  "#apx :focus-visible{outline:2px solid #4338CA;outline-offset:2px}",
  "@media (max-width:860px){#apx .t{grid-column:span 12!important}}",
  "@media (prefers-reduced-motion:reduce){#apx .btn,#apx .pill{transition:none}}",
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
    if(D.lesson){h+='<section class="t lesson"><h2>Next lesson</h2><p class="big">'+esc(D.lesson)+'</p>'+(D.ev?'<p class="ev">'+esc(D.ev.replace(/^You earned\s+/i,'Latest badge: '))+'</p>':'')+'<div class="btns">'+(D.lbtn||[]).map(function(b,i){return '<button class="btn" data-lb="'+i+'">'+esc(b)+'</button>'}).join('')+'</div></section>'}
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
    if(!mount){mount=document.createElement('div');mount.id='apx';document.body.appendChild(mount)}
    mount.innerHTML=h;
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