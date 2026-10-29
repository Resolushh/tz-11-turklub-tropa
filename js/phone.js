(function (root, factory) {
 'use strict';
 const api=factory();
 if(typeof module==='object'&&module.exports)module.exports=api;
 else root.TROPA_PHONE=api;
})(typeof window!=='undefined'?window:globalThis,function () {
 'use strict';
 const allowed=/^[+\d\s().\-–—]*$/;
 function normalize(value){
  const raw=String(value||'').trim();
  if(!allowed.test(raw)||(raw.includes('+')&&!/^\+7/.test(raw)))return '';
  if((raw.match(/\+/g)||[]).length>1)return '';
  let digits=raw.replace(/\D/g,'');
  if(raw.includes('+')&&digits.length!==11)return '';
  if(digits.length===11&&/^[78]/.test(digits))digits=digits.slice(1);
  return digits.length===10?'+7'+digits:'';
 }
 function format(value){
  const raw=String(value||'');
  if(!allowed.test(raw)||(raw.includes('+')&&!/^\+7/.test(raw)))return raw;
  let digits=raw.replace(/\D/g,'');
  if(raw.includes('+')&&digits.length!==11)return raw;
  if(digits.length===11&&/^[78]/.test(digits))digits=digits.slice(1);
  if(digits.length>10)return raw;
  if(!digits)return '';
  let text='('+digits.slice(0,3);
  if(digits.length>3)text+=') '+digits.slice(3,6);
  if(digits.length>6)text+='-'+digits.slice(6,8);
  if(digits.length>8)text+='-'+digits.slice(8,10);
  return text;
 }
 function attach(input,errorNode){
  if(!input)return;
  function clearError(){input.classList.remove('invalid');input.removeAttribute('aria-invalid');if(errorNode)errorNode.textContent='';}
  function reformat(){
   const raw=input.value,position=input.selectionStart??raw.length;
   let before=(raw.slice(0,position).match(/\d/g)||[]).length;
   if(/^\s*[+]?\s*[78]/.test(raw)&&raw.replace(/\D/g,'').length===11)before=Math.max(0,before-1);
   input.value=format(raw);
   let caret=0,seen=0;
   while(caret<input.value.length&&seen<before){if(/\d/.test(input.value[caret]))seen++;caret++;}
   input.setSelectionRange(caret,caret);
   clearError();
  }
  input.addEventListener('input',event=>{if(!event.isComposing)reformat();});
  input.addEventListener('beforeinput',event=>{
   if(input.selectionStart!==input.selectionEnd)return;
   const pos=input.selectionStart??0,value=input.value;
   if(event.inputType==='deleteContentBackward'&&pos>0&&!/\d/.test(value[pos-1])){
    let start=pos-1;while(start>=0&&!/\d/.test(value[start]))start--;
    if(start>=0){event.preventDefault();input.setRangeText('',start,pos,'end');reformat();}
   }
   if(event.inputType==='deleteContentForward'&&pos<value.length&&!/\d/.test(value[pos])){
    let end=pos;while(end<value.length&&!/\d/.test(value[end]))end++;
    if(end<value.length){event.preventDefault();input.setRangeText('',pos,end+1,'start');reformat();}
   }
  });
  input.addEventListener('blur',()=>{
   input.value=format(input.value);
   if(!input.value||normalize(input.value))return;
   input.classList.add('invalid');input.setAttribute('aria-invalid','true');
   if(errorNode)errorNode.textContent='Укажите 10 цифр номера после +7.';
  });
  input.value=format(input.value);
 }
 return {normalize,format,attach};
});
