/* Optional version-2 save extension. Original inventory entries and gift slots remain untouched. */
(function(root){'use strict';
 const catalog={
  wraps:{name:'Student Hand Wraps',slot:'gloves',price:35,punch:3,description:'Padded practice wraps. A steady first improvement to J attacks.'},
  knuckles:{name:'Helix Alloy Gloves',slot:'gloves',price:180,punch:9,description:'Reinforced knuckles channel your physical strength.'},
  omega:{name:'Omega Impact Gauntlets',slot:'gloves',price:780,punch:24,description:'Heat-resistant gauntlets forged for heavy punches.'},
  trainers:{name:'Street Training Boots',slot:'boots',price:60,kick:4,description:'Firm soles give K attacks more impact.'},
  impact:{name:'Impact Greaves',slot:'boots',price:220,kick:11,description:'Balanced armored boots for rising kicks.'},
  comet:{name:'Comet Step Boots',slot:'boots',price:900,kick:28,description:'A high-end kinetic sole made in New Earth.'},
  vest:{name:'Institute Guard Vest',slot:'armor',price:150,defense:3,description:'Reduces damage received by your hero.'},
  aegis:{name:'Helix Aegis Jacket',slot:'armor',price:400,defense:8,description:'Layered protective fabric for dangerous assignments.'},
  charm:{name:'Pulse Resonator',slot:'accessory',price:350,punch:4,kick:4,description:'A tuned accessory that boosts both physical attacks.'}
 };
 const slots=['gloves','boots','armor','accessory'];
 const item=id=>Object.hasOwn(catalog,id)?catalog[id]:null;
 function state(s){s.odyssey=s.odyssey||{};const o=s.odyssey;o.equipment=o.equipment||{version:1,owned:[],slots:{}};const e=o.equipment;if(!Array.isArray(e.owned))e.owned=[];if(!e.slots||typeof e.slots!=='object')e.slots={};return e}
 function bonuses(s,override){const e=override||s.odyssey?.equipment,out={punch:0,kick:0,defense:0};for(const slot of slots){const id=e?.slots?.[slot],g=item(id);if(g&&g.slot===slot&&e.owned?.includes(id))for(const stat of Object.keys(out))out[stat]+=g[stat]||0}return out}
 function buy(s,id){const g=item(id);if(!g)return'Unknown equipment.';const e=state(s);if(e.owned.includes(id))return'You already own this equipment.';if(!Number.isFinite(s.money)||s.money<g.price)return'Not enough money.';s.money-=g.price;e.owned.push(id);return''}
 function equip(s,id){const g=item(id),e=state(s);if(!g||!e.owned.includes(id))return'Buy this equipment first.';e.slots[g.slot]=id;return''}
 function unequip(s,slot){if(!slots.includes(slot))return'Unknown slot.';delete state(s).slots[slot];return''}
 function preview(s,id){const g=item(id),e=state(s),copy={owned:[...e.owned],slots:{...e.slots}};if(!g)return bonuses(s);if(!copy.owned.includes(id))copy.owned.push(id);copy.slots[g.slot]=id;return bonuses(s,copy)}
 root.OdysseyEquipment={catalog,slots,item,state,bonuses,buy,equip,unequip,preview};
})(typeof window==='undefined'?globalThis:window);
