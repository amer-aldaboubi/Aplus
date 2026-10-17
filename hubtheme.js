/* A+ Maths Hub: clean academic recolour for the main Hub screen. Remove the script tag in index.html to undo. */
(function(){
  var LIGHT=window.matchMedia&&matchMedia('(prefers-color-scheme: dark)').matches?false:true;
  var P=LIGHT?{page:'#F6F8FC',card:'#FFFFFF',soft:'#E3ECFB',ink:'#0B2247',mut:'#4F6080',blue:'#1A4FB8',line:'#D5DDEB',onblue:'#FFFFFF',grid:'rgba(26,79,184,.06)',accent:'#B7791F'}
             :{page:'#0A1730',card:'#10213F',soft:'#17305C',ink:'#EAF0FB',mut:'#9FB0CE',blue:'#7FA8FF',line:'#233659',onblue:'#0A1730',grid:'rgba(127,168,255,.06)',accent:'#E3B35A'};
  var st=document.createElement('style');
  st.textContent="@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600&family=Source+Serif+4:opsz,wght@8..60,500;8..60,600&display=swap');"+
   "html,body{background-color:"+P.page+"!important}body,button,input,select,textarea{font-family:'IBM Plex Sans',system-ui,sans-serif}"+
   "h1,h2,h3{font-family:'Source Serif 4',Georgia,serif!important;letter-spacing:-.005em}#loading{color:"+P.blue+"!important}"+
   "body{background-image:radial-gradient(900px 380px at 50% -120px,"+(LIGHT?"rgba(26,79,184,.13)":"rgba(127,168,255,.12)")+",transparent),linear-gradient("+P.grid+" 1px,transparent 1px),linear-gradient(90deg,"+P.grid+" 1px,transparent 1px)!important;background-size:auto,34px 34px,34px 34px!important;background-attachment:fixed!important}"+
   ".ht-card{border:1px solid "+P.line+"!important;border-radius:14px!important;box-shadow:0 1px 2px rgba(11,34,71,"+(LIGHT?".07":".4")+"),0 16px 32px -20px "+(LIGHT?"rgba(26,79,184,.45)":"rgba(0,0,0,.8)")+"!important}"+
   "button{transition:transform .2s,box-shadow .2s,filter .2s}button:hover{transform:translateY(-2px);filter:brightness(1.04)}button:focus-visible,a:focus-visible,input:focus-visible,select:focus-visible{outline:3px solid "+P.accent+"!important;outline-offset:2px}"+
   "@keyframes htIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}.ht-in{animation:htIn .55s cubic-bezier(.2,.7,.2,1) both}"+
   "@media (prefers-reduced-motion:reduce){.ht-in{animation:none}button{transition:none}button:hover{transform:none}}";
  document.head.appendChild(st);
  function rgb(s){var m=/rgba?\(\s*(\d+)[ ,]+(\d+)[ ,]+(\d+)(?:[ ,/]+([\d.]+))?/.exec(s);return m?[+m[1],+m[2],+m[3],m[4]===undefined?1:+m[4]]:null}
  function lum(c){var f=function(v){v/=255;return v<=.03928?v/12.92:Math.pow((v+.055)/1.055,2.4)};return .2126*f(c[0])+.7152*f(c[1])+.0722*f(c[2])}
  function hsl(c){var r=c[0]/255,g=c[1]/255,b=c[2]/255,mx=Math.max(r,g,b),mn=Math.min(r,g,b),l=(mx+mn)/2,d=mx-mn,h=0,s=0;
    if(d){s=d/(1-Math.abs(2*l-1));if(mx===r)h=((g-b)/d)%6;else if(mx===g)h=(b-r)/d+2;else h=(r-g)/d+4;h*=60;if(h<0)h+=360}return [h,s,l]}
  function isGold(c){var q=hsl(c);return q[0]>=36&&q[0]<=56&&q[1]>.35}
  function isNavy(c){var q=hsl(c);return q[0]>=200&&q[0]<=250&&q[2]<.35}
  function cr(a,b){var x=lum(a),y=lum(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05)}
  function mapBg(c){
    if(c[3]<.5)return null;
    if(isNavy(c)){return lum(c)<.012?P.page:(lum(c)<.05?P.card:P.soft)}
    if(isGold(c)){return lum(c)>.5?P.soft:P.blue}
    return null}
  function effBg(el){while(el&&el!==document.documentElement){var c=rgb(getComputedStyle(el).backgroundColor);if(c&&c[3]>.5)return c;el=el.parentElement}return rgb(P.page)}
  function fix(el){
    if(el.nodeType!==1||el.tagName==='SCRIPT'||el.tagName==='STYLE'||el.tagName==='IMG'||el.tagName==='SVG'||el.tagName==='CANVAS')return;
    var cs=getComputedStyle(el);
    var bg=rgb(cs.backgroundColor),nb=bg&&mapBg(bg);
    if(nb){el.style.setProperty('background-color',nb,'important');
      if((nb===P.card||nb===P.soft)&&el.offsetWidth>120&&el.offsetHeight>44&&el.tagName!=='BUTTON'&&el.tagName!=='INPUT'&&!el.classList.contains('ht-card')){
        el.classList.add('ht-card');if(!el.hasAttribute('data-ht'))el.classList.add('ht-in')}}
    var bi=cs.backgroundImage;
    if(bi&&bi.indexOf('gradient')>-1&&el!==document.body){var cols=(bi.match(/rgba?\([^)]*\)/g)||[]).map(rgb).filter(Boolean);
      var g=cols.some(isGold),n=cols.some(isNavy);
      if(g){el.style.setProperty('background-image','none','important');el.style.setProperty('background-color',P.blue,'important')}
      else if(n){el.style.setProperty('background-image','none','important');el.style.setProperty('background-color',P.card,'important')}}
    var hasText=false;for(var i=0;i<el.childNodes.length;i++){if(el.childNodes[i].nodeType===3&&el.childNodes[i].nodeValue.trim()){hasText=true;break}}
    if(hasText){
      var tc=rgb(cs.color),under=effBg(el),bl=lum(under);
      if(tc){
        var q=hsl(tc),want=null,tl=lum(tc);
        if(bl>.45){ if(isGold(tc))want=P.blue; else if(tl>.45&&q[1]<.5)want=P.ink; else if(q[0]>=200&&q[0]<=250&&tl>.3&&q[1]>.1&&tl<.7)want=P.mut }
        else { if((tl<.25&&!isNavy(tc))||isNavy(tc))want=P.onblue }
        var fin=rgb(want||cs.color);
        if(fin&&cr(fin,under)<4.5){var blueish=q[0]>=190&&q[0]<=260;
          if(bl>.45)want=(blueish&&cr(rgb(P.blue),under)>=4.5)?P.blue:P.ink;else want='#FFFFFF'}
        if(want)el.style.setProperty('color',want,'important')}}
    el.setAttribute('data-ht','1')}
  var q=[],sched=false,obs;
  function run(){sched=false;obs.disconnect();var seen=new Set();
    while(q.length){var n=q.shift();if(n.nodeType!==1||seen.has(n))continue;seen.add(n);fix(n);
      var all=n.querySelectorAll('*');for(var i=0;i<all.length;i++){if(!seen.has(all[i])){seen.add(all[i]);fix(all[i])}}}
    start()}
  function push(n){q.push(n);if(!sched){sched=true;requestAnimationFrame(run)}}
  function start(){obs.observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['style','class']})}
  obs=new MutationObserver(function(ms){ms.forEach(function(m){if(m.type==='attributes')push(m.target);else m.addedNodes.forEach(function(a){push(a)})})});
  push(document.body);start();
})();
