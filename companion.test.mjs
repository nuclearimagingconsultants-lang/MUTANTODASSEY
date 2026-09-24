import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFile} from 'node:fs/promises';
const w={};w.window=w;
for(const f of ['core.js','equipment.js','companion-tactics.js'])vm.runInNewContext(await readFile(new URL(f,import.meta.url),'utf8'),w);
const C=w.OdysseyCore,P=w.OdysseyCompanions;
function hero(){const s=C.fresh('Party Test').save;s.level=20;s.hp=s.maxHp=400;s.party=['goldie','juno','yara'];s.recruited=[...s.party];s.allyXp={goldie:1800,juno:1800,yara:1800};s.money=5000;return s}

test('hero and every living companion receive separate commands',()=>{const s=hero(),b=C.newBattle(s,{name:'Training Wall',kind:'hulk',boss:true});const before=b.enemies[0].hp;C.execute(s,b,'punch');const afterHero=b.enemies[0].hp;assert.ok(afterHero<before);assert.ok(before-afterHero<100);P.beginRound(b);b.phase='ally';assert.deepEqual(b.allyPending,['goldie','juno','yara']);for(const [id,skill] of [['juno','pulse-shot'],['goldie','radiant-strike'],['yara','spear-thrust']]){const out=P.execute(s,b,id,skill);assert.ok(!out.error);assert.ok(out.events.some(e=>e.id===id))}assert.equal(b.allyPending.length,0);assert.ok(b.enemies[0].hp<afterHero)});

test('allies can heal, guard, stagger, snare and attack groups',()=>{const s=hero(),b=C.newBattle(s,{name:'Pack',kind:'human',count:3});s.hp=100;P.beginRound(b);b.phase='ally';assert.ok(P.execute(s,b,'goldie','healing-light').events[0].kind==='heal');assert.ok(s.hp>100);const stagger=P.execute(s,b,'juno','machine-whisper');assert.ok(stagger.events[0].damage>0);const guard=P.execute(s,b,'yara','ironwood-guard');assert.equal(guard.events[0].kind,'guard');assert.ok(b.guard>0)});

test('ally XP grants spendable ranks and weapons change the actual loadout',()=>{const s=hero();assert.equal(P.level(s,'juno'),11);assert.equal(P.points(s,'juno'),10);assert.equal(P.train(s,'juno','drone-barrage'),'');assert.equal(P.points(s,'juno'),9);assert.equal(P.buy(s,'juno','drone-rig'),'');assert.equal(P.equip(s,'juno','drone-rig'),'');assert.equal(P.weapon(s,'juno').name,'Drone Command Rig');assert.equal(s.money,4300);const restored=C.prepare(JSON.parse(JSON.stringify({game:'mutant-odyssey',save:s}))).save;assert.equal(P.weapon(restored,'juno').id,'drone-rig');assert.equal(P.state(restored).builds.juno.ranks['drone-barrage'],1)});

test('companion defense comes from their selected weapon',()=>{const s=hero();P.buy(s,'yara','ironwood-maul');P.equip(s,'yara','ironwood-maul');assert.equal(P.defense(s,'yara'),5);const b=C.newBattle(s,{name:'Attacker',boss:true});b.party=[b.party.find(a=>a.id==='yara')];b.turn=1;const hp=b.party[0].hp;C.enemyResponse(s,b);assert.ok(b.party[0].hp<hp);assert.ok(hp-b.party[0].hp<b.enemies[0].attack*2)});
