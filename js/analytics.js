(() => {
 'use strict';
 const config = window.TROPA_CONFIG || {};
 window.dataLayer = window.dataLayer || [];
 window.gtag = function(){window.dataLayer.push(arguments);};
 if (/^G-[A-Z0-9]+$/.test(config.measurementId || '')) {
   const script=document.createElement('script'); script.async=true;
   script.src='https://www.googletagmanager.com/gtag/js?id='+config.measurementId;
   document.head.append(script); window.gtag('js',new Date()); window.gtag('config',config.measurementId);
 }
 window.tropaEvent = (name, parameters={}) => {
   // Only allow explicitly listed, non-personal parameters.
   const allowed=['lead_trip_id','participants','lead_source','button_name','page_section','difficulty','duration_days','trip_id','trip_date','seats_left','guide_id','items_count','days','rental_price','item_id','contact_type','messenger','network','field_name','error_type','promo_code','map_service'];
   const clean={}; for(const [key,value] of Object.entries(parameters)) if(allowed.includes(key)) clean[key]=typeof value==='string'?value.slice(0,100):value;
   if(config.measurementId) window.gtag('event',name,clean);
   document.dispatchEvent(new CustomEvent('tropa:event',{detail:{name,parameters:clean}}));
 };
 document.addEventListener('click',e=>{const el=e.target.closest('[data-event]');if(!el)return;const p={};for(const [k,v] of Object.entries(el.dataset))if(k!=='event')p[k.replace(/[A-Z]/g,m=>'_'+m.toLowerCase())]=v;window.tropaEvent(el.dataset.event,p);});
})();