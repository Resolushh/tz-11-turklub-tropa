const assert=require('node:assert/strict');
const vm=require('node:vm');
const fs=require('node:fs');
const path=require('node:path');
const code=fs.readFileSync(path.join(__dirname,'../apps-script/Code.gs'),'utf8');
const originalHeaders=['request_id','created_at','name','phone','email','trip_id','trip_date','participants','utm_source','utm_medium','utm_campaign','utm_content','status'];
const base={request_id:'REQ-11111111-2222-4333-8444-555555555555',name:'Учебный тест',phone:'+79000000000',trip_id:'icefalls',trip_date:'2026-12-13',participants:'1',consent:'on',age:'on'};
function backend(headers=[...originalHeaders,'promo_code']){
 const rows=[];const state={headers:[...headers],rows};
 const chain=new Proxy({},{get:(_,key)=>key==='build'?()=>({}):()=>chain});
 const sheet={getLastRow:()=>1,appendRow:r=>rows.push(r),setFrozenRows(){},setConditionalFormatRules(){},getRange:(r,c)=>typeof r==='number'?{getValue:()=>state.headers[c-1]??'',setValue:v=>{state.headers[c-1]=v;}}:chain};
 const context=vm.createContext({SpreadsheetApp:{openById:()=>({getSheetByName:()=>sheet}),newDataValidation:()=>chain,newConditionalFormatRule:()=>chain},PropertiesService:{getScriptProperties:()=>({getProperty:()=> 'test-sheet'})},LockService:{getScriptLock:()=>({waitLock(){},releaseLock(){}})},ContentService:{MimeType:{JSON:'json'},createTextOutput:text=>({setMimeType:()=>JSON.parse(text)})}});
 vm.runInContext(code,context);
 return {state,setup:()=>context.setup(),post:promo=>context.doPost({parameter:{...base,...promo}})};
}
let b=backend(originalHeaders);b.setup();assert.deepEqual(b.state.headers,[...originalHeaders,'promo_code']);
b=backend([...originalHeaders,'occupied']);assert.throws(()=>b.setup(),/Столбец N занят/);assert.equal(b.state.headers[13],'occupied');
b=backend();assert.equal(b.post({promo_code:' snow300 '}).ok,true);assert.equal(b.state.rows[0][13],'SNOW300');assert.equal(b.state.rows[0][12],'new');
b=backend();assert.equal(b.post({}).ok,true);assert.equal(b.state.rows[0][13],'');
b=backend();assert.equal(b.post({promo_code:'OTHER'}).ok,false);assert.equal(b.state.rows.length,0);

const formCode=fs.readFileSync(path.join(__dirname,'../js/form.js'),'utf8');
function frontend(value,search=''){
 const handlers={},nodes={},stored=new Map(),requests=[];
 function node(value=''){
  const classes=new Set();return {value,checked:true,textContent:'',disabled:false,attrs:{},classList:{add:x=>classes.add(x),remove:x=>classes.delete(x),contains:x=>classes.has(x)},setAttribute(k,v){this.attrs[k]=v;},removeAttribute(k){delete this.attrs[k];},focus(){},checkValidity:()=>true,addEventListener(k,f){this[k]=f;}};
 }
 const values={...base,email:'',promo_code:value,request_id:'',utm_source:'direct',utm_medium:'none',utm_campaign:'not_set',utm_content:'not_set'};
 const elements=Object.fromEntries(Object.entries(values).map(([k,v])=>[k,node(v)]));
 for(const k of Object.keys(elements))nodes['#error-'+k]=node();
 for(const k of ['#form-status','#promo-feedback','#promo-check'])nodes[k]=node();
 const button=node();
 const form={elements,addEventListener:(k,f)=>handlers[k]=f,querySelectorAll:()=>[],querySelector:s=>s==='[type=submit]'?button:Object.values(elements).find(e=>e.classList.contains('invalid'))};
 Object.defineProperty(elements,Symbol.iterator,{value:function*(){yield* Object.values(this);}});
 form.requestSubmit=()=>{let cancelled=false;handlers.submit({preventDefault(){cancelled=true;}});if(!cancelled){assert.ok(Object.values(elements).every(e=>e.disabled),'No personal fields in native confirmation navigation');location.href='thanks.html';}};
 nodes['#booking-form']=form;
 const location={search,href:''};
 class FormData{constructor(form){this.form=form;}*[Symbol.iterator](){for(const [k,v] of Object.entries(this.form.elements))yield[k,v.value];}}
 const context=vm.createContext({window:{TROPA_TRIPS:[['icefalls']],TROPA_CONFIG:{bookingEndpoint:'https://example.invalid/test',departures:[{tripId:'icefalls',date:'2026-12-13',seats:8}]},tropaEvent(){}},document:{querySelector:s=>nodes[s]},location,URLSearchParams,FormData,crypto:{randomUUID:()=> '11111111-2222-4333-8444-555555555555'},sessionStorage:{getItem:k=>stored.get(k)||null,setItem:(k,v)=>stored.set(k,v)},AbortSignal:{timeout:()=>undefined},fetch:async(url,options)=>{requests.push(options.body);return {ok:true,json:async()=>({ok:true})};}});
 vm.runInContext(fs.readFileSync(path.join(__dirname,'../js/phone.js'),'utf8'),context);
 vm.runInContext(formCode,context);
 return {elements,nodes,requests,location,submit:()=>handlers.submit({preventDefault(){}})};
}
(async()=>{
 let f=frontend('');await f.submit();assert.equal(f.requests.length,1);assert.equal(f.requests[0].get('promo_code'),'');
 f=frontend(' snow300 ');await f.submit();assert.equal(f.requests[0].get('promo_code'),'SNOW300');assert.equal(f.location.href,'thanks.html');
 f=frontend('OTHER');await f.submit();assert.equal(f.requests.length,0);assert.match(f.nodes['#error-promo_code'].textContent,/Код не найден/);
 f=frontend('','?promo=SNOW300');assert.equal(f.elements.promo_code.value,'SNOW300');assert.match(f.nodes['#promo-feedback'].textContent,/будет передан/);
 for(const value of ['9001234567','79001234567','89001234567','+7 (900) 123-45-67','8 (900) 123 45 67','+70000000000']){f=frontend('');f.elements.phone.value=value;await f.submit();assert.equal(f.requests.length,1,value);assert.match(f.requests[0].get('phone'),/^\+7\d{10}$/);}
 for(const value of ['900123','790012345678','+12025550123','900abc4567']){f=frontend('');f.elements.phone.value=value;await f.submit();assert.equal(f.requests.length,0,value);assert.match(f.nodes['#error-phone'].textContent,/10 цифр/);}
 console.log('10 phone form integration checks passed; no live requests.');
 console.log('9 checks passed: migration, occupied column, valid/blank/unknown server codes, valid/blank/unknown form submission, prefill. Network and Sheets mocked; no live requests.');
})().catch(e=>{console.error(e);process.exitCode=1;});
