const assert=require('node:assert/strict');
const {normalize,format}=require('../js/phone.js');
const cases=[
 ['9001234567','+79001234567'],['79001234567','+79001234567'],['89001234567','+79001234567'],
 ['+7 (900) 123-45-67','+79001234567'],['8 (900) 123 45 67','+79001234567'],
 ['900\u00a0123–45–67','+79001234567'],['+70000000000','+70000000000'],
 ['', ''],['+7',''],['+7900123456',''],['900123456',''],['790012345678',''],
 ['+12025550123',''],['+49001234567',''],['900abc4567',''],['++79001234567',''],
 ['9001234567 ext 1',''],
];
for(const [input,expected] of cases)assert.equal(normalize(input),expected,input);
for(const value of ['9001234567','79001234567','89001234567','+7 (900) 123-45-67'])assert.equal(format(value),'(900) 123-45-67');
assert.equal(format(''),'');assert.equal(format('9'),'(9');assert.equal(format('9001'),'(900) 1');
assert.equal(format('90012345678'),'90012345678','Long pasted numbers must not be silently truncated');
assert.equal(normalize(format('90012345678')),'');
assert.equal(format('+12025550123'),'+12025550123');
console.log('27 phone normalization/format cases passed.');
