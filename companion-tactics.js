/* Direct companion commands, ally skill growth, and personal weapons. Additive schema-v2 state. */
(function(root){'use strict';
 const C=root.OdysseyCore;
 const weapons={
  goldie:[{id:'sun-staff',name:'Sun Staff',price:0,power:6,heal:6,ward:4},{id:'prism-rapier',name:'Prism Rapier',price:240,power:15,heal:3,ward:2},{id:'dawn-scepter',name:'Dawn Scepter',price:650,power:11,heal:20,ward:12}],
  juno:[{id:'signal-pistols',name:'Signal Pistols',price:0,power:8,stagger:8},{id:'arc-baton',name:'Arc Baton',price:250,power:17,stagger:14},{id:'drone-rig',name:'Drone Command Rig',price:700,power:13,stagger:27}],
  yara:[{id:'root-spear',name:'Ironwood Spear',price:0,power:10,guard:5},{id:'thornblade',name:'Thornblade',price:260,power:18,guard:8},{id:'ironwood-maul',name:'Ironwood Maul',price:720,power:25,guard:15}]
 };
 const skills={
  goldie:[{id:'radiant-strike',name:'Radiant Strike',kind:'damage',description:'A focused staff or blade strike.'},{id:'healing-light',name:'Healing Light',kind:'heal',description:'Restore the most wounded party member.'},{id:'prism-ward',name:'Prism Ward',kind:'guard',description:'Shield the entire party.'},{id:'solar-flare',name:'Solar Flare',kind:'aoe',description:'Radiant damage against every enemy.'}],
  juno:[{id:'pulse-shot',name:'Pulse Shot',kind:'damage',description:'Fire the equipped weapon at one target.'},{id:'machine-whisper',name:'Machine Whisper',kind:'stagger',description:'Disrupt armor and build heavy pressure.'},{id:'arc-snare',name:'Arc Snare',kind:'snare',description:'Delay the target’s next response.'},{id:'drone-barrage',name:'Drone Barrage',kind:'aoe',description:'Command drones against every target.'}],
  yara:[{id:'spear-thrust',name:'Spear Thrust',kind:'damage',description:'A powerful weapon strike.'},{id:'root-snare',name:'Root Snare',kind:'snare',description:'Bind an enemy and build stagger.'},{id:'ironwood-guard',name:'Ironwood Guard',kind:'guard',description:'Guard the party and draw pressure.'},{id:'earthbreaker',name:'Earthbreaker',kind:'aoe',description:'Break the ground beneath every enemy.'}]
 };
 function state(s){s.odyssey??={};const all=s.odyssey.companions??={version:1,builds:{}};for(const id of Object.keys(C.allies)){const base=weapons[id][0].id,b=all.builds[id]??={weapon:base,owned:[base],ranks:{}};b.weapon??=base;b.owned??=[base];if(!b.owned.includes(base))b.owned.unshift(base);b.ranks??={};for(const skill of skills[id])b.ranks[skill.id]=Math.max(0,Number(b.ranks[skill.id])||0)}return all}
 function level(s,id){return 1+Math.floor((Number(s.allyXp?.[id])||0)/180)}
 function spent(s,id){return Object.values(state(s).builds[id].ranks).reduce((a,b)=>a+b,0)}
 function points(s,id){return Math.max(0,level(s,id)-1-spent(s,id))}
 function weapon(s,id){const b=state(s).builds[id];return weapons[id].find(w=>w.id===b.weapon)||weapons[id][0]}
 function train(s,id,skillId){const b=state(s).builds[id],skill=skills[id]?.find(x=>x.id===skillId);if(!skill)return'Unknown companion skill.';if(points(s,id)<1)return C.allies[id].name+' needs more Ally XP.';if(b.ranks[skillId]>=10)return'That skill is already rank 10.';b.ranks[skillId]++;return''}
 function buy(s,id,weaponId){const w=weapons[id]?.find(x=>x.id===weaponId),b=state(s).builds[id];if(!w)return'Unknown weapon.';if(b.owned.includes(w.id))return'Weapon already owned.';if(s.money<w.price)return'Not enough money.';s.money-=w.price;b.owned.push(w.id);return''}
 function equip(s,id,weaponId){const b=state(s).builds[id];if(!b.owned.includes(weaponId)||!weapons[id].some(x=>x.id===weaponId))return'Buy that weapon first.';b.weapon=weaponId;return''}
 function manualEnabled(s,b){return !!b?.party?.length}
 function beginRound(b){b.allyPending=b.party.filter(a=>a.hp>0).map(a=>a.id);b.allySelected=b.allyPending[0]||null}
 function execute(s,b,id,skillId){if(!b||b.phase!=='ally')return{error:'It is not a companion command.'};if(!b.allyPending?.includes(id))return{error:'That companion already acted.'};const ally=b.party.find(a=>a.id===id&&a.hp>0),skill=skills[id]?.find(x=>x.id===skillId);if(!ally||!skill)return{error:'Choose an active companion and skill.'};const build=state(s).builds[id],rank=build.ranks[skill.id]||0,w=weapon(s,id),base=11+s.level*1.25+level(s,id)*1.8+w.power+rank*4,events=[];const living=b.enemies.filter(e=>e.hp>0),target=b.enemies[b.target]?.hp>0?b.enemies[b.target]:living[0];
  if(skill.kind==='heal'){const amount=Math.round(base*.8+w.heal*1.5),hurt=[{id:'hero',hp:s.hp,maxHp:s.maxHp},...b.party].filter(x=>x.hp>0).sort((a,z)=>a.hp/a.maxHp-z.hp/z.maxHp)[0];if(hurt.id==='hero')s.hp=Math.min(s.maxHp,s.hp+amount);else hurt.hp=Math.min(hurt.maxHp,hurt.hp+amount);events.push({kind:'heal',id,text:C.allies[id].name+' · '+skill.name+' +'+amount+' HP'})}
  else if(skill.kind==='guard'){b.guard=Math.max(b.guard,2);b.heroWard=Math.max(b.heroWard||0,12+(w.ward||w.guard||0)+rank*3);ally.guard=2;events.push({kind:'guard',id,text:C.allies[id].name+' · '+skill.name+' · party guarded'})}
  else {const targets=skill.kind==='aoe'?living:[target];for(const enemy of targets.filter(Boolean)){const damage=Math.round(base*(skill.kind==='aoe'?.72:skill.kind==='stagger'?.82:skill.kind==='snare'?.76:1));enemy.hp=Math.max(0,enemy.hp-damage);if(['stagger','snare'].includes(skill.kind)){enemy.stagger+=28+(w.stagger||0)+rank*5;if(enemy.stagger>=100){enemy.stagger=0;enemy.staggerTurns=2}}if(skill.kind==='snare')enemy.rooted=Math.max(enemy.rooted||0,1+Math.floor(rank/4));events.push({kind:'ally',id,damage,target:b.enemies.indexOf(enemy),text:C.allies[id].name+' · '+skill.name})}}
  b.allyPending=b.allyPending.filter(x=>x!==id);b.allySelected=b.allyPending[0]||null;b.done=b.enemies.every(e=>e.hp<=0);return{events,won:b.done,name:skill.name,element:id==='goldie'?'light':id==='juno'?'storm':'earth',done:!b.allyPending.length}
 }
 function defense(s,id){const w=weapon(s,id);return Math.floor((w.guard||w.ward||0)/3)}
 const originalNewBattle=C.newBattle;C.newBattle=function(s,spec){const b=originalNewBattle(s,spec);state(s);b.allyPending=[];b.allySelected=null;return b};
 root.OdysseyCompanions={weapons,skills,state,level,spent,points,weapon,train,buy,equip,manualEnabled,beginRound,execute,defense};
})(typeof window==='undefined'?globalThis:window);
