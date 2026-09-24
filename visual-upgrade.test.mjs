import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const adventure=fs.readFileSync(new URL('./adventure.js',import.meta.url),'utf8');
const battle=fs.readFileSync(new URL('./battle-hd.js',import.meta.url),'utf8');
const city=fs.readFileSync(new URL('./city-hd.js',import.meta.url),'utf8');

test('companion commands carry distinct animation identity and skill kind',()=>{
 assert.match(adventure,/allyId:id,action:/);
 assert.match(adventure,/skillId,skillKind:/);
 assert.match(battle,/anim\.allyId==='goldie'/);
 assert.match(battle,/anim\.allyId==='juno'/);
 assert.match(battle,/anim\.allyId==='yara'/);
});

test('hero gifts carry names and ranks into the HD effects renderer',()=>{
 assert.match(adventure,/giftId:gift\?\.id/);
 assert.match(adventure,/rank:type==='gift'/);
 assert.match(battle,/anim\.name/);
});

test('gold story and red side routes render simultaneously',()=>{
 assert.match(adventure,/sideNavigationTarget/);
 assert.match(adventure,/Gold: /);
 assert.match(adventure,/Red: /);
 assert.match(city,/sideGoal/);
 assert.match(city,/sideTarget/);
 assert.match(city,/#ff4059/);
});
