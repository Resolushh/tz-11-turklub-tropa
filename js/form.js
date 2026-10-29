(() => {
 'use strict';
 const form=document.querySelector('#booking-form'),status=document.querySelector('#form-status'),q=new URLSearchParams(location.search);
 if(window.TROPA_TRIPS.some(t=>t[0]===q.get('trip')))form.elements.trip_id.value=q.get('trip');
 if(/^202[67]-\d{2}-\d{2}$/.test(q.get('date')||''))form.elements.trip_date.value=q.get('date');

 const promo=form.elements.promo_code, promoFeedback=document.querySelector('#promo-feedback');
 const normalizePromo=v=>String(v||'').trim().toUpperCase();
 if(promo&&normalizePromo(q.get('promo'))==='SNOW300')promo.value='SNOW300';
 const checkPromo=()=>{
  if(!promo)return;
  promo.value=normalizePromo(promo.value);
  promo.classList.remove('invalid');promo.removeAttribute('aria-invalid');
  document.querySelector('#error-promo_code').textContent='';
  if(!promo.value){promoFeedback.textContent='Можно оставить пустым. Укажите код, если он у вас есть.';return;}
  if(promo.value==='SNOW300'){promoFeedback.textContent='Код SNOW300 указан и будет передан с заявкой. Условия подтвердит сотрудник клуба.';return;}
  promoFeedback.textContent='';promo.classList.add('invalid');promo.setAttribute('aria-invalid','true');
  document.querySelector('#error-promo_code').textContent='Код не найден. Проверьте написание или оставьте поле пустым.';
 };
 document.querySelector('#promo-check')?.addEventListener('click',checkPromo);
 promo?.addEventListener('input',()=>{promo.classList.remove('invalid');promo.removeAttribute('aria-invalid');document.querySelector('#error-promo_code').textContent='';promoFeedback.textContent='Нажмите «Проверить» или отправьте заявку.';});
 if(promo?.value)checkPromo();

 const requestId='REQ-'+crypto.randomUUID();
 form.elements.request_id.value=requestId;
 const attributionDefaults={utm_source:'direct',utm_medium:'none',utm_campaign:'not_set',utm_content:'not_set'};
 for(const [key,fallback] of Object.entries(attributionDefaults)) {
   let value=fallback;
   try { value=sessionStorage.getItem(key)||fallback; } catch {}
   form.elements[key].value=value;
 }
 function error(field,text,type='validation'){const node=document.querySelector('#error-'+field);if(node)node.textContent=text;form.elements[field]?.classList.add('invalid');form.elements[field]?.setAttribute('aria-invalid','true');window.tropaEvent('form_error',{field_name:field,error_type:type});}
 form.addEventListener('submit',async e=>{
 e.preventDefault();status.textContent='';form.querySelectorAll('.error').forEach(n=>n.textContent='');form.querySelectorAll('.invalid').forEach(n=>{n.classList.remove('invalid');n.removeAttribute('aria-invalid');});
 const data=Object.fromEntries(new FormData(form));data.name=(data.name||'').trim();data.phone=(data.phone||'').replace(/[^+0-9]/g,'');if(data.phone.startsWith('8'))data.phone='+7'+data.phone.slice(1);data.email=(data.email||'').trim();data.participants=Number(data.participants);let invalid=false;const fail=(k,m)=>{invalid=true;error(k,m);};
 if(data.name.length<2||data.name.length>60)fail('name','Введите имя от 2 до 60 символов.');
 if(!/^\+7\d{10}$/.test(data.phone))fail('phone','Введите телефон: +7 и 10 цифр.');
 if(data.email&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))fail('email','Проверьте адрес e-mail.');
 data.promo_code=normalizePromo(data.promo_code);if(data.promo_code&&data.promo_code!=='SNOW300')fail('promo_code','Код не найден. Проверьте написание или оставьте поле пустым.');
 if(!window.TROPA_TRIPS.some(t=>t[0]===data.trip_id))fail('trip_id','Выберите маршрут.');
 if(!form.elements.trip_date.checkValidity()||!data.trip_date)fail('trip_date','Выберите дату декабря 2026 или января 2027.');
 if(!Number.isInteger(data.participants)||data.participants<1||data.participants>6)fail('participants','От 1 до 6 участников.');
 const departure=window.TROPA_CONFIG.departures.find(d=>d.tripId===data.trip_id&&d.date===data.trip_date);
 if(data.trip_id&&data.trip_date&&form.elements.trip_date.checkValidity()&&window.TROPA_CONFIG.departures.length&&!departure)fail('trip_date','Для этого маршрута нет выезда в выбранную дату. Проверьте календарь.');
 if(departure&&departure.seats<data.participants)fail('participants',departure.seats===0?'На эту дату мест нет. Выберите другую дату.':'Осталось мест: '+departure.seats+'. Уменьшите число участников или выберите другую дату.');
 if(!form.elements.age.checked)fail('age','Подтвердите возрастное условие.');if(!form.elements.consent.checked)fail('consent','Для отправки необходимо согласие.');
 if(invalid){form.querySelector('.invalid')?.focus();return;}
 if(!window.TROPA_CONFIG.bookingEndpoint){status.textContent='Приём заявок ещё не подключён. Заявка не отправлена.';window.tropaEvent('form_error',{field_name:'server',error_type:'server'});return;}
 data.request_id=requestId;const defaults={utm_source:'direct',utm_medium:'none',utm_campaign:'not_set',utm_content:'not_set'};for(const [k,v] of Object.entries(defaults)){try{data[k]=sessionStorage.getItem(k)||v;}catch{data[k]=v;}}
 const button=form.querySelector('[type=submit]');button.disabled=true;status.textContent='Отправляем заявку…';
 try {const response=await fetch(window.TROPA_CONFIG.bookingEndpoint,{method:'POST',body:new URLSearchParams(data),signal:AbortSignal.timeout(25000)});if(!response.ok)throw Error('server');const result=await response.json();if(result.ok!==true)throw Error(result.error||'server');window.tropaEvent('generate_lead',{lead_trip_id:data.trip_id,participants:data.participants,lead_source:data.utm_source});try{sessionStorage.setItem('last_request_id',requestId);}catch{}location.href='thanks.html';}
 catch{status.textContent='Не удалось подтвердить запись. Повторите отправку: повторная заявка с тем же номером не будет создана.';window.tropaEvent('form_error',{field_name:'server',error_type:'server'});}finally{button.disabled=false;}
 });
})();