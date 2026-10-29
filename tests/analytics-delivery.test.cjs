const assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs');
const code=fs.readFileSync(process.argv[2],'utf8');
function setup(mode='callback',enabled=true){
 const calls=[],timers=new Map();let seq=0;
 const context={window:{TROPA_CONFIG:{measurementId:enabled?'G-TEST':''},gtag:(...args)=>{calls.push(args);if(mode==='throw')throw Error('blocked');}},document:{addEventListener(){},dispatchEvent(){}},CustomEvent:class{},setTimeout:f=>{timers.set(++seq,f);return seq;},clearTimeout:id=>timers.delete(id)};
 vm.runInNewContext(code,context);return {calls,timers,event:context.window.tropaEvent};
}
(async()=>{
 let s=setup();let done=false;
 const p=s.event('generate_lead',{lead_source:'instagram',email:'private@example.invalid'},{waitForProcessing:true}).then(()=>done=true);
 await Promise.resolve();assert.equal(done,false);assert.equal(s.calls.length,1);assert.equal(s.calls[0][2].email,undefined);
 s.calls[0][2].event_callback();await p;assert.equal(done,true);assert.equal(s.timers.size,0);
 s=setup();const blocked=s.event('generate_lead',{}, {waitForProcessing:true});[...s.timers.values()][0]();await blocked;assert.equal(s.calls.length,1);s.calls[0][2].event_callback();assert.equal(s.calls.length,1);
 s=setup('throw');await s.event('generate_lead',{}, {waitForProcessing:true});assert.equal(s.timers.size,0);
 s=setup('callback',false);await s.event('generate_lead',{}, {waitForProcessing:true});assert.equal(s.calls.length,0);
 s=setup();assert.equal(s.event('social_click',{network:'instagram'}),undefined);assert.equal(s.calls[0][2].event_callback,undefined);
 console.log('5 delivery scenarios passed: callback, blocked timeout, exception, disabled analytics, ordinary event; private parameters filtered; no retries.');
})().catch(e=>{console.error(e);process.exitCode=1;});
