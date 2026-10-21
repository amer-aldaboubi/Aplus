// Ads are OFF until a publisher id is set. Set ADS_CLIENT to "ca-pub-XXXXXXXXXXXXXXXX" and ADS_SLOT to your ad unit id.
(function(){
  var ADS_CLIENT="",ADS_SLOT="";
  if(!ADS_CLIENT||!ADS_SLOT)return;
  window.adsbygoogle=window.adsbygoogle||[];
  // Students are minors: request child-directed treatment (no personalised ads).
  window.adsbygoogle.requestNonPersonalizedAds=1;
  window.adsbygoogle.push({google_ad_client:ADS_CLIENT,tag_for_child_directed_treatment:1});
  var s=document.createElement("script");s.async=true;
  s.src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client="+ADS_CLIENT;s.crossOrigin="anonymous";document.head.appendChild(s);
  var box=document.createElement("div");box.style.cssText="text-align:center;padding:8px;min-height:60px";
  box.innerHTML='<ins class="adsbygoogle" style="display:block" data-ad-client="'+ADS_CLIENT+'" data-ad-slot="'+ADS_SLOT+'" data-ad-format="auto" data-full-width-responsive="true"></ins>';
  document.body.appendChild(box);(window.adsbygoogle=window.adsbygoogle||[]).push({});
})();
