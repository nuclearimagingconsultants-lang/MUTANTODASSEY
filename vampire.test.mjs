import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFile} from 'node:fs/promises';

class ImageStub { constructor(){this.complete=false;this.naturalWidth=0;this.naturalHeight=0} }
const w={Image:ImageStub};w.window=w;
for(const f of ['core.js','world-data.js'])vm.runInNewContext(await readFile(new URL(f,import.meta.url),'utf8'),w);
w.OdysseyArt={human(){},ellipse(){}};
vm.runInNewContext(await readFile(new URL('vampire-expansion.js',import.meta.url),'utf8'),w);
const C=w.OdysseyCore,V=w.VampireExpansion,D=w.OdysseyWorld;
function hero(){const s=C.fresh('Night Test').save;s.level=39;s.mp=s.maxMp=9999;return s}

test('New Orleans contains four complete parallel campaigns and five full trees',()=>{
 assert.equal(Object.values(V.quests).flat().length,120);
 assert.equal(new Set(Object.values(V.quests).flat().map(q=>q.id)).size,120);
 assert.equal(Object.values(V.skills).flat().length,240);
 assert.equal(V.skills.shadow.length,120);
 assert.equal(Object.values(V.treasures).flat().length,120);
 assert.equal(V.sideBosses.length,120);
 const s=hero();
 assert.deepEqual(JSON.parse(JSON.stringify(V.state(s).quests)),{elemental:0,brawn:0,steel:0,arcane:0});
 V.advanceQuest(s,'elemental');V.advanceQuest(s,'elemental');
 assert.equal(V.state(s).stages.elemental,2);
 assert.equal(V.state(s).stages.steel,0);
 assert.equal(V.questBattle(s,'elemental').vampireQuest,'elemental-1');
});

test('All 120 covenant missions unlock their matching skill and treasure rumor',()=>{
 const s=hero();
 for(const f of V.order.slice(0,4))for(let i=1;i<=30;i++){
  V.advanceQuest(s,f);V.advanceQuest(s,f);
  const spec=V.questBattle(s,f);assert.ok(spec);
  assert.equal(V.completeQuest(s,f,spec.vampireQuest),true);
  assert.equal(V.state(s).unlocked[f],i);
 }
 assert.equal(Object.values(V.state(s).quests).reduce((a,b)=>a+b,0),120);
 assert.equal(V.state(s).availableTreasures.length,120);
 assert.ok(V.order.slice(0,4).every(f=>V.quest(s,f)===null));
});

test('Every hunted boss yields one Shadow art and optional court recruit',()=>{
 const s=hero();
 for(let i=1;i<=120;i++){
  const spec=V.bossBattle(s);assert.equal(spec.vampireBoss,'blood-boss-'+i);
  assert.equal(V.markBossVictory(s,spec.vampireBoss),true);
  assert.equal(V.resolveBoss(s,i%2?'turn':'feed'),true);
  assert.equal(V.state(s).unlocked.shadow,i);
 }
 assert.equal(V.state(s).bosses,120);
 assert.equal(V.state(s).turned.length,60);
 assert.equal(V.bossBattle(s),null);
});

test('Treasure look and effect bindings survive a save round trip without changing legacy fields',()=>{
 const s=hero(),legacy=JSON.stringify(s.inventory);
 V.advanceQuest(s,'steel');V.advanceQuest(s,'steel');const spec=V.questBattle(s,'steel');V.completeQuest(s,'steel',spec.vampireQuest);
 const id=V.state(s).availableTreasures[0];assert.equal(V.findTreasure(s,id),true);
 assert.equal(V.bindTreasure(s,id,'look'),true);assert.equal(V.bindTreasure(s,id,'effect'),true);
 const restored=C.prepare(JSON.parse(JSON.stringify({game:'mutant-odyssey',save:s}))).save;
 assert.equal(V.state(restored).lookTreasure,id);assert.equal(V.state(restored).effectTreasure,id);
 assert.equal(JSON.stringify(restored.inventory),legacy);
});

test('Covenant skills use the existing turn economy and keep old controls independent',()=>{
 const s=hero(),v=V.state(s);v.unlocked.elemental=30;V.equip(s,'elemental',30);
 const b=C.newBattle(s,{name:'Regent',kind:'hulk',boss:true});b.atb=100;
 const before=b.enemies[0].hp,out=V.useSkill(s,b,'elemental');
 assert.ok(!out.error);assert.ok(b.enemies[0].hp<before);assert.equal(b.atb,50);
 assert.equal(s.equipped.length,9);assert.equal(D.places.ashford.some(p=>p.id==='night-line'),true);
 assert.equal(D.places.neworleans.filter(p=>p.covenant).length,4);
});
