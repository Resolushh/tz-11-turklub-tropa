(() => {
 'use strict';
 const config = window.TROPA_CONFIG || {};
 window.dataLayer = window.dataLayer || [];
 window.gtag = window.gtag || function(){window.dataLayer.push(arguments);};
 window.tropaEvent = (name, parameters={}, options={}) => {
   // Only allow explicitly listed, non-personal parameters.
   const allowed=['lead_trip_id','participants','lead_source','button_name','page_section','difficulty','duration_days','trip_id','trip_date','seats_left','guide_id','items_count','days','rental_price','item_id','contact_type','messenger','network','field_name','error_type','promo_code','map_service'];
   const clean={}; for(const [key,value] of Object.entries(parameters)) if(allowed.includes(key)) clean[key]=typeof value==='string'?value.slice(0,100):value;
   document.dispatchEvent(new CustomEvent('tropa:event',{detail:{name,parameters:clean}}));
   if(!config.measurementId)return options.waitForProcessing?Promise.resolve():undefined;
   if(!options.waitForProcessing){window.gtag('event',name,clean);return;}
   // A callback confirms tag processing, not receipt by Analytics servers.
   // The independent timer also works when gtag is blocked or only queues calls.
   return new Promise(resolve=>{
     let settled=false;
     const finish=()=>{if(settled)return;settled=true;clearTimeout(timer);resolve();};
     const timer=setTimeout(finish,2500);
     try{window.gtag('event',name,{...clean,event_callback:finish,event_timeout:2000});}
     catch{finish();}
   });
 };
 document.addEventListener('click',e=>{const el=e.target.closest('[data-event]');if(!el)return;const p={};for(const [k,v] of Object.entries(el.dataset))if(k!=='event')p[k.replace(/[A-Z]/g,m=>'_'+m.toLowerCase())]=v;window.tropaEvent(el.dataset.event,p);});
})();