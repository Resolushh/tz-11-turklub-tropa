// Set Script Property SPREADSHEET_ID in Project Settings before deployment.
const HEADERS = ['request_id','created_at','name','phone','email','trip_id','trip_date','participants','utm_source','utm_medium','utm_campaign','utm_content','status','promo_code'];
function setup() {
 const ss=SpreadsheetApp.openById(PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID'));
 const sheet=ss.getSheetByName('leads')||ss.insertSheet('leads');
 if(sheet.getLastRow()===0)sheet.appendRow(HEADERS);
 // Append N only; existing A:M columns and their order remain unchanged.
 const promoHeader=sheet.getRange(1,14).getValue();
 if(promoHeader==='')sheet.getRange(1,14).setValue('promo_code');
 else if(promoHeader!=='promo_code')throw Error('Столбец N занят. Проверьте структуру таблицы.');
 sheet.setFrozenRows(1);sheet.getRange('A:A').setNumberFormat('@');sheet.getRange('D:D').setNumberFormat('@');
 sheet.getRange('M2:M').setDataValidation(SpreadsheetApp.newDataValidation().requireValueInList(['new','contacted','prepaid','went','lost'],true).setAllowInvalid(false).build());
 sheet.getRange('F2:F').setDataValidation(SpreadsheetApp.newDataValidation().requireValueInList(['icefalls','snowshoes','sunrise','plateau','traverse','newyear_hut'],true).setAllowInvalid(false).build());
 const rules=[SpreadsheetApp.newConditionalFormatRule().whenFormulaSatisfied('=AND($A2<>"",COUNTIF($A$2:$A,$A2)>1)').setBackground('#ffcccc').setRanges([sheet.getRange('A2:M')]).build(),SpreadsheetApp.newConditionalFormatRule().whenFormulaSatisfied('=AND(COUNTA($A2:$M2)>0,OR($A2="",$B2="",$C2="",$D2="",$F2="",$G2="",$H2="",$I2="",$J2="",$K2="",$L2="",$M2=""))').setBackground('#fff0cc').setRanges([sheet.getRange('A2:M')]).build()];
 sheet.setConditionalFormatRules(rules);
}
function doPost(e) {
 const respond=o=>ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
 const lock=LockService.getScriptLock();let acquired=false;
 try {
 const p=e&&e.parameter||{};
 for(const key of Object.keys(p))if(String(p[key]).length>200)throw Error('Слишком длинное поле');
 if(!/^REQ-[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(p.request_id||''))throw Error('Неверный номер заявки');
 const name=(p.name||'').trim();if(name.length<2||name.length>60)throw Error('Проверьте имя');
 if(!/^\+7\d{10}$/.test(p.phone||''))throw Error('Проверьте телефон');
 if(p.email&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(p.email))throw Error('Проверьте e-mail');
 if(!['icefalls','snowshoes','sunrise','plateau','traverse','newyear_hut'].includes(p.trip_id))throw Error('Неверный маршрут');
 if(!/^202[67]-\d{2}-\d{2}$/.test(p.trip_date||'')||p.trip_date<'2026-12-01'||p.trip_date>'2027-01-31'||isNaN(Date.parse(p.trip_date))||new Date(p.trip_date).toISOString().slice(0,10)!==p.trip_date)throw Error('Неверная дата');
 const count=Number(p.participants);if(!Number.isInteger(count)||count<1||count>6)throw Error('От 1 до 6 участников');
 if(p.consent!=='on'||p.age!=='on')throw Error('Не подтверждены согласия');
 for(const key of ['utm_source','utm_medium','utm_campaign','utm_content'])if(p[key]&&!/^[a-z0-9_]+$/.test(p[key]))throw Error('Неверные метки');
 const promo=String(p.promo_code||'').trim().toUpperCase();if(promo&&promo!=='SNOW300')throw Error('Неизвестный промокод');
 lock.waitLock(20000);acquired=true;
 const ss=SpreadsheetApp.openById(PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID')),sheet=ss.getSheetByName('leads');
 if(!sheet||HEADERS.some((h,i)=>sheet.getRange(1,i+1).getValue()!==h))throw Error('Таблица не подготовлена');
 if(sheet.getLastRow()>1&&sheet.getRange(2,1,sheet.getLastRow()-1,1).createTextFinder(p.request_id).matchEntireCell(true).findNext())throw Error('Заявка с этим номером уже записана');
 const safe=v=>/^[=+@-]/.test(String(v))?"'"+v:v;
 sheet.appendRow([p.request_id,new Date(),safe(name),safe(p.phone),safe(p.email||''),p.trip_id,p.trip_date,count,p.utm_source||'direct',p.utm_medium||'none',p.utm_campaign||'not_set',p.utm_content||'not_set','new',promo]);
 return respond({ok:true,request_id:p.request_id});
 }catch(err){return respond({ok:false,error:String(err.message)});}finally{if(acquired)lock.releaseLock();}
}
