(() => {
 'use strict';
 const cfg=window.TROPA_CONFIG, trips=window.TROPA_TRIPS, money=n=>new Intl.NumberFormat('ru-RU').format(n)+' ₽';
 const emit=(n,p)=>window.tropaEvent(n,p);
 const query=new URLSearchParams(location.search);
 for(const k of ['utm_source','utm_medium','utm_campaign','utm_content','utm_term']) {const v=query.get(k);if(v)try{sessionStorage.setItem(k,v.slice(0,200));}catch{}}
 const menu=document.querySelector('.menu');menu?.addEventListener('click',()=>{const open=document.querySelector('.nav').classList.toggle('open');menu.setAttribute('aria-expanded',String(open));});
 const grid=document.querySelector('#trip-grid'), difficulty=document.querySelector('#difficulty'), duration=document.querySelector('#duration');
 function renderTrips(){if(!grid)return;const found=trips.filter(t=>(!difficulty.value||t[2]===difficulty.value)&&(!duration.value||t[3]===Number(duration.value)));grid.replaceChildren();for(const t of found){const card=document.createElement('article');card.className='card';card.innerHTML=`<div class="card-art" role="img" aria-label="Фотография зимних гор"></div><div class="card-body"><div class="meta"><span class="tag">${t[2]}</span><span>${t[3]} ${t[3]===1?'день':'дня'}</span></div><h3><a href="contacts.html?trip=${t[0]}" data-event="trip_view" data-trip-id="${t[0]}" data-difficulty="${t[2]}">${t[1]}</a></h3><p>${t[5]}</p>${cfg.tripDetails?.[t[0]]?`<p>${cfg.tripDetails[t[0]].sights}</p><p class="muted">Учебные данные: ${cfg.tripDetails[t[0]].distanceKm} км · набор ${cfg.tripDetails[t[0]].ascentM} м</p>`:""}${t[0]==='newyear_hut'?'<p>31 декабря — 2 января</p>':''}<div class="card-bottom"><span class="price">${money(t[4])}</span><a class="text-link" href="contacts.html?trip=${t[0]}" data-event="cta_click" data-button-name="book_${t[0]}" data-page-section="trips">В поход ↗</a></div></div>`;grid.append(card);}document.querySelector('#result-count').textContent='Маршрутов: '+found.length;}
 if(grid){if(location.hash==='#easy')difficulty.value='легко';renderTrips();for(const el of [difficulty,duration])el.addEventListener('change',()=>{renderTrips();emit('trip_filter',{difficulty:difficulty.value||'all',duration_days:duration.value||'all'});});}
 for(const target of document.querySelectorAll('[data-departures]')) {
  const departures=cfg.departures.filter(d=>/^202[67]-\d{2}-\d{2}$/.test(d.date)).sort((a,b)=>a.date.localeCompare(b.date));
  const visible=target.dataset.limit?departures.slice(0,Number(target.dataset.limit)):departures;
  if(!visible.length){target.textContent='Расписание готовится.';continue;}
  if(cfg.demoData&&target.dataset.limit){const note=document.createElement('p');note.className='muted';note.textContent='Учебные даты и места. Реальные поездки не продаются.';target.append(note);}
  let month='';
  for(const d of visible){
   const trip=trips.find(t=>t[0]===d.tripId);if(!trip)continue;
   if(!target.dataset.limit&&month!==d.date.slice(0,7)){month=d.date.slice(0,7);const heading=document.createElement('h2');heading.textContent=month==='2026-12'?'Декабрь 2026':'Январь 2027';target.append(heading);}
   const row=document.createElement('div');row.className='departure';
   const text=document.createElement('div');text.textContent=new Date(d.date+'T12:00:00').toLocaleDateString('ru-RU',{day:'numeric',month:'long'})+' · '+trip[1]+' · '+(d.seats>0?d.seats+' '+new Intl.PluralRules('ru').select(d.seats).replace('one','место').replace('few','места').replace('many','мест').replace('other','мест'):'Мест нет');row.append(text);
   const next=d.seats>0?d:departures.find(n=>n.tripId===d.tripId&&n.seats>0&&n.date>d.date);
   if(next){const link=document.createElement('a');link.className='btn secondary';link.href='contacts.html?trip='+next.tripId+'&date='+next.date;link.textContent=d.seats>0?'Выбрать дату':'Другая дата: '+next.date;link.addEventListener('click',()=>emit('date_select',{trip_id:next.tripId,trip_date:next.date,seats_left:next.seats}));row.append(link);}
   target.append(row);
  }
 }
 for(const target of document.querySelectorAll('[data-guides]'))for(const guide of cfg.guides||[]) {
  const article=document.createElement('article');article.className='card guide-card';
  const body=document.createElement('div');body.className='card-body';
  const heading=document.createElement('h3');heading.textContent=guide.name;body.append(heading);
  const role=document.createElement('p');role.className='muted';role.textContent=guide.role;body.append(role);
  const details=document.createElement('details');details.id='guide-'+guide.id;
  const summary=document.createElement('summary');summary.textContent='Опыт и подготовка';summary.dataset.event='guide_view';summary.dataset.guideId=guide.id;details.append(summary);
  for(const text of [guide.experience,guide.qualification,guide.description]){const p=document.createElement('p');p.textContent=text;details.append(p);}
  body.append(details);article.append(body);target.append(article);
 }
 document.querySelectorAll('[data-item]').forEach(el=>el.addEventListener('change',()=>{if(el.checked)emit('checklist_check',{item_id:el.dataset.item});}));
 document.querySelector('#rental-calculate')?.addEventListener('click',()=>{const days=document.querySelector('#rental-days');if(!days.reportValidity())return;const chosen=[...document.querySelectorAll('[name=rental]:checked')];const price=chosen.reduce((s,e)=>s+Number(e.dataset.price),0)*Number(days.value);document.querySelector('#rental-total').textContent=money(price);emit('rental_calc',{items_count:chosen.length,days:Number(days.value),rental_price:price});});
 document.querySelector('#copy-promo')?.addEventListener('click',async()=>{try{await navigator.clipboard.writeText('SNOW300');document.querySelector('#copy-status').textContent=' Скопировано';emit('promo_copy',{promo_code:'SNOW300'});}catch{document.querySelector('#copy-status').textContent=' Выделите и скопируйте: SNOW300';}});
 for(const target of document.querySelectorAll('[data-social-links],[data-messenger-links]'))for(const [network,url] of Object.entries(cfg.socials)){if(!/^https:\/\//.test(url))continue;const messenger=['telegram','whatsapp'].includes(network);if(target.hasAttribute('data-messenger-links')&&!messenger)continue;const a=document.createElement('a');a.href=url;a.textContent=network;a.className='text-link';a.rel='noopener';a.dataset.event=target.hasAttribute('data-messenger-links')?'messenger_click':'social_click';a.dataset[messenger&&target.hasAttribute('data-messenger-links')?'messenger':'network']=network;a.dataset.pageSection='footer';target.append(a);}
 const number=document.querySelector('#booking-number');if(number)try{const id=sessionStorage.getItem('last_request_id');if(id)number.textContent=id;}catch{}
})();

// Motion is an enhancement: content remains visible if APIs or JS are unavailable.
(() => {
 'use strict';
 const reduced = matchMedia('(prefers-reduced-motion: reduce)');
 const header = document.querySelector('body > header');
 const menu = document.querySelector('.menu');
 const nav = document.querySelector('#main-nav');
 const closeMenu = () => {nav?.classList.remove('open');menu?.setAttribute('aria-expanded','false');};
 document.addEventListener('keydown', e => {if(e.key==='Escape' && nav?.classList.contains('open')){closeMenu();menu?.focus();}});
 nav?.addEventListener('click', e => {if(e.target.closest('a'))closeMenu();});
 document.addEventListener('click', e => {if(header && !header.contains(e.target))closeMenu();});

 const progress = document.createElement('div');
 progress.className='reading-progress';progress.setAttribute('aria-hidden','true');
 document.body.append(progress);
 const top = document.createElement('button');
 top.type='button';top.className='back-to-top';top.textContent='↑';
 top.setAttribute('aria-label','Вернуться к началу страницы');top.hidden=true;
 document.body.append(top);
 top.addEventListener('click',()=>{
  window.scrollTo({top:0,behavior:reduced.matches?'instant':'smooth'});
  // Return keyboard focus to a visible destination before the button disappears.
  header?.querySelector('a')?.focus({preventScroll:true});
 });
 let scheduled=false;
 const updateScroll=()=>{
  const max=document.documentElement.scrollHeight-document.documentElement.clientHeight;
  progress.style.transform=`scaleX(${max>0?Math.min(1,Math.max(0,scrollY/max)):0})`;
  header?.classList.toggle('is-scrolled',scrollY>16);
  top.hidden=scrollY<600;
  scheduled=false;
 };
 const schedule=()=>{if(!scheduled){scheduled=true;requestAnimationFrame(updateScroll);}};
 window.addEventListener('scroll',schedule,{passive:true});
 window.addEventListener('resize',schedule,{passive:true});
 updateScroll();

 if(!('IntersectionObserver' in window)||!Element.prototype.animate)return;
 const active=new Set();
 const animate=(el,delay=0)=>{
  if(reduced.matches)return;
  const animation=el.animate([{opacity:0,transform:'translateY(18px)'},{opacity:1,transform:'translateY(0)'}],{duration:650,delay,easing:'cubic-bezier(.22,1,.36,1)',fill:'backwards'});
  active.add(animation);animation.finished.then(()=>active.delete(animation),()=>active.delete(animation));
 };
 const observer=new IntersectionObserver(entries=>{
  for(const entry of entries)if(entry.isIntersecting){
   observer.unobserve(entry.target);
   const siblings=entry.target.parentElement?.children;
   const order=siblings?Math.max(0,[...siblings].indexOf(entry.target)):0;
   animate(entry.target,entry.target.matches('.card,.departure')?Math.min(order%3,2)*70:0);
  }
 },{threshold:.08});
 const seen=new WeakSet();
 const observe=el=>{if(!seen.has(el)){seen.add(el);observer.observe(el);}};
 document.querySelectorAll('.section-head,.section>.eyebrow,.section>h2,.card,.departure,.band,.panel').forEach(observe);
 document.querySelectorAll('.hero-copy>.eyebrow,.hero-copy>h1,.hero-copy>p,.hero-copy>.btn,.page-intro>h1,.page-intro>p').forEach((el,i)=>animate(el,Math.min(i,3)*70));
 const grid=document.querySelector('#trip-grid');
 if(grid)new MutationObserver(()=>{grid.querySelectorAll('.card').forEach(observe);schedule();}).observe(grid,{childList:true});
 reduced.addEventListener('change',()=>{if(reduced.matches){for(const animation of active)animation.cancel();active.clear();}});
})();
