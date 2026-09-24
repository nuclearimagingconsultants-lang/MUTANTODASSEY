/* Neon-city art and cartography. Existing collision geometry and save coordinates stay intact. */
(function(root){'use strict';
 const A=root.OdysseyArt,D=root.OdysseyWorld,C=root.OdysseyCore;
 const styles={ashford:{ground:'#252044',road:'#191a34',walk:'#5a4678',front:'#71578d',side:'#372d5c',roof:'#ac79b6',neon:'#ff96db',window:'#ffd190',tree:'#9668ae'},helix:{ground:'#24324d',road:'#142039',walk:'#496b7e',front:'#607eaa',side:'#303866',roof:'#91b3d1',neon:'#91f4ed',window:'#fff0ac',tree:'#70a9a6'},newearth:{ground:'#3a254e',road:'#271e3a',walk:'#785571',front:'#96728f',side:'#4c325c',roof:'#d6a1ae',neon:'#ffca92',window:'#ffe4b8',tree:'#b38cad'},orrukel:{ground:'#27253d',road:'#40344b',walk:'#62516c',front:'#5f5075',side:'#332e4d',roof:'#9980b2',neon:'#c8b0fb',window:'#dacafc',tree:'#796b9b'},neworleans:{ground:'#21151f',road:'#130f1a',walk:'#5e3c4e',front:'#72404c',side:'#302035',roof:'#ad775d',neon:'#e0a363',window:'#ffd49a',tree:'#48695e'}};
 const streetNames={ashford:{v:['West Quay','Ferry Road','Market Street','Founders Way','Helix Avenue','Vault Lane','Spire Boulevard','Dawn Road'],h:['North Ring','Institute Walk','Old Mill Road','Gate Court','Canal Promenade','Harbor Drive','First House Lane']},helix:{v:['West Gate','Garden Walk','Student Way','Lumen Lane','Institute Way','Library Walk','Training Road','East Gate'],h:['North Walk','Sky Garden','Archive Avenue','Fountain Court','Practice Way','South Walk','Ashford Road']},orrukel:{v:['West Shore','Ferry Trail','Orchard Path','Rootwalk','Starheart Trail','Coil Path','Spine Trail','Glacier Way'],h:['North Ridge','High Canopy','Bloom Trail','Root Crossing','Vault Path','Host Walk','Quiet Grove']},newearth:{v:['West Reach','Gate Road','Supply Way','Echo Path','Beacon Way','Choir Walk','Frontier Road','East Reach'],h:['Dawn Ridge','Upper Reach','Warden Way','Beacon Court','Rebuilding Way','Choir Road','Shelter Walk']},neworleans:{v:['River Road','Chartres Street','Royal Street','Bourbon Street','Dauphine Street','Rampart Street','Bayou Road','St. Claude Avenue'],h:['Esplanade Avenue','St. Ann Street','Orleans Street','St. Peter Street','Toulouse Street','Bienville Street','Canal Street']}};
 const symbols={story:'★',campaign:'★',crime:'!',hunt:'◆',boss:'⚔',crypt:'▥',travel:'➜',rest:'+',training:'◎',shop:'$',npc:'●',job:'✓'};
 const buildingCache=new Map(),routeCache=new Map();
 function round(c,x,y,w,h,r,color){c.fillStyle=color;c.beginPath();c.roundRect(x,y,w,h,r);c.fill()}
 function stroke(c,points,color,width=2){A.line(c,points,color,width)}
 function makeBuilding(variant,zone,dpr){const s=styles[zone],cn=document.createElement('canvas');cn.width=320*dpr;cn.height=470*dpr;const c=cn.getContext('2d');c.scale(dpr,dpr);c.translate(42,180);const w=225,h=218,top=[-65,-8,-28,-92,5][variant];
 A.path(c,[[10,h+8],[w+36,h+8],[w+54,80],[22,30]],'#0b05274d');
 const g=c.createLinearGradient(0,top,0,h);g.addColorStop(0,s.front);g.addColorStop(1,s.side);A.path(c,[[0,top+24],[190,top+24],[190,h],[0,h]],g);A.path(c,[[190,top+24],[225,top],[225,h-20],[190,h]],s.side);A.path(c,[[0,top+24],[35,top],[225,top],[190,top+24]],s.roof);stroke(c,[[0,top+24],[190,top+24],[225,top]],s.neon+'99',2);stroke(c,[[190,top+25],[190,h]],'#cbaff355',2);
 for(let row=0;row<Math.floor((h-top-75)/24);row++)for(let col=0;col<7;col++){const x=12+col*24,y=top+44+row*24,on=(row*7+col*3+variant)%6!==0;round(c,x,y,12,15,2,on?s.window:'#332b55');if(on){c.fillStyle='#fff6cf55';c.fillRect(x+1,y+1,3,13);c.fillStyle='#251c5544';c.fillRect(x,y+7,12,1)}}for(let i=0;i<5;i++){c.fillStyle=s.window+'88';c.fillRect(201,top+44+i*31,7,15)}
 // Ground-floor storefronts, lit entry doors, awnings, and ornamental trim.
 for(let i=0;i<4;i++){const x=9+i*45;round(c,x,h-42,34,40,3,'#221b3f');round(c,x+3,h-36,28,28,2,i%2?s.window+'aa':s.neon+'88');stroke(c,[[x+17,h-37],[x+17,h-3]],'#352448',2)}
 A.path(c,[[-6,h-50],[196,h-50],[204,h-34],[-13,h-34]],s.neon);for(let i=0;i<10;i++)A.path(c,[[i*20,h-50],[i*20+9,h-50],[i*20+10,h-34],[i*20-3,h-34]],'#fff1e455');
 if(variant===0){for(let i=0;i<3;i++){const x=30+i*22,ww=132-i*44,yy=top-18-i*22;round(c,x,yy,ww,24,2,s.front);stroke(c,[[x,yy],[x+ww,yy]],s.neon,2)}stroke(c,[[96,top-61],[96,top-92]],s.window,2);A.ellipse(c,96,top-95,4,4,s.neon)}
 if(variant===1){round(c,19,top-27,154,45,6,'#36234f');stroke(c,[[24,top-22],[167,top-22]],s.neon,3);A.text(c,'LUMEN CINEMA',96,top+1,'#ffe7a5',13);for(let i=0;i<13;i++)A.ellipse(c,21+i*12,top+11,2,2,s.window);round(c,43,top+48,104,67,4,'#231d49');const sky=c.createLinearGradient(0,top+48,0,top+115);sky.addColorStop(0,'#ce73b1');sky.addColorStop(1,'#323667');c.fillStyle=sky;c.fillRect(47,top+52,96,59);A.ellipse(c,119,top+68,10,10,'#ffe1bd');A.path(c,[[47,top+112],[72,top+79],[89,top+96],[108,top+84],[143,top+112]],'#524182');A.text(c,'TONIGHT',96,top+132,s.window,10)}
 if(variant===2){c.fillStyle=s.roof;c.beginPath();c.ellipse(108,top+7,76,58,0,Math.PI,Math.PI*2);c.fill();for(let i=-2;i<=2;i++){c.strokeStyle='#ebd4ff66';c.lineWidth=2;c.beginPath();c.ellipse(108,top+7,Math.abs(i)*20+10,58,0,Math.PI,Math.PI*2);c.stroke()}stroke(c,[[25,top+8],[190,top+8]],s.neon,4);A.ellipse(c,108,top-55,6,6,s.window);round(c,72,h-66,48,65,22,'#201b40');round(c,80,h-57,32,55,15,'#93ddea99')}
 if(variant===3){for(const x of [20,133]){round(c,x,top-30,38,40,3,s.front);A.path(c,[[x-4,top-30],[x+19,top-74],[x+42,top-30]],s.roof);stroke(c,[[x+19,top-75],[x+19,top-93]],s.window,2)}round(c,63,top+38,70,68,32,'#33294e');A.ellipse(c,98,top+71,26,26,'#ffe5b5');A.ellipse(c,98,top+71,22,22,'#55416b');stroke(c,[[98,top+56],[98,top+71],[111,top+78]],'#ffdfa0',2);for(let i=0;i<4;i++){const a=i*Math.PI/2;A.ellipse(c,98+Math.cos(a)*18,top+71+Math.sin(a)*18,2,2,'#ffe5b5')}}
 if(variant===4){round(c,44,top-26,111,39,5,'#412750');A.text(c,zone==='helix'?'HELIX CAFE':'STARLIGHT',99,top-2,s.window,14);round(c,20,top+45,150,92,7,'#42244d');for(let i=0;i<4;i++){round(c,28+i*35,top+53,26,70,12,s.neon+'99');stroke(c,[[41+i*35,top+53],[41+i*35,top+123]],s.window+'aa',1)}for(const x of [22,78,138]){A.ellipse(c,x,h+10,13,6,'#b58aae');stroke(c,[[x,h+10],[x,h+24]],'#4f345f',2)}}
 stroke(c,[[0,h],[190,h],[225,h-20]],'#dfb9ee77',3);return cn}
 function building(c,b,zone,dpr){const res=Math.min(2,dpr),key=zone+':'+b.variant+':'+res;let art=buildingCache.get(key);if(!art){art=makeBuilding(b.variant,zone,res);buildingCache.set(key,art)}c.drawImage(art,b.x-42,b.y-180,320,470)}
 function car(c,x,y,vertical,color,time){c.save();c.translate(x,y);if(!vertical)c.rotate(-Math.PI/2);A.ellipse(c,4,7,19,36,'#06082066');round(c,-16,-31,32,65,8,color);round(c,-12,-14,24,33,5,'#26264e');round(c,-11,-12,22,12,3,'#acb9e066');for(const xx of [-10,10]){A.ellipse(c,xx,-29,4,3,'#fff3b8');A.glow(c,xx,-44,22,'#fff0bb17');A.ellipse(c,xx,31,3,2,'#ff8797')}c.restore()}
 function terrain(c,zone,z,time){const s=styles[zone];c.fillStyle=s.ground;c.fillRect(0,0,z.w,z.h);for(let x=0;x<=z.w;x+=400){c.fillStyle=s.walk;c.fillRect(x-80,0,160,z.h);c.fillStyle=s.road;c.fillRect(x-62,0,124,z.h)}for(let y=0;y<=z.h;y+=400){c.fillStyle=s.walk;c.fillRect(0,y-80,z.w,160);c.fillStyle=s.road;c.fillRect(0,y-62,z.w,124)}for(let x=400;x<z.w;x+=400)for(let y=400;y<z.h;y+=400){for(let i=-3;i<=3;i++){c.fillStyle='#e4c8ea40';c.fillRect(x+i*13,y+85,7,25)}A.ellipse(c,x,y,40,24,'#41345b22')}for(let x=0;x<z.w;x+=400)for(let y=125;y<z.h;y+=45){c.fillStyle='#e9c2dd35';c.fillRect(x-1,y,2,15)}for(let y=0;y<z.h;y+=400)for(let x=125;x<z.w;x+=45){c.fillStyle='#e9c2dd35';c.fillRect(x,y-1,15,2)}}
 function landmark(c,p,time){if(p.type==='rest'){A.ellipse(c,p.x,p.y,53,29,'#52476c');A.ellipse(c,p.x,p.y-5,43,23,'#8097c8');A.ellipse(c,p.x,p.y-8,36,17,'#4d8bb299');for(let i=0;i<7;i++){const a=time+i*Math.PI/3.5;stroke(c,[[p.x,p.y-40],[p.x+Math.cos(a)*30,p.y-10+Math.sin(a)*12]],'#b8edff99',2)}A.glow(c,p.x,p.y-15,60,'#a4ddff22')}else if(p.type==='crypt'){round(c,p.x-38,p.y-46,76,57,14,'#43334d');round(c,p.x-23,p.y-36,46,44,20,'#15152f');stroke(c,[[p.x-30,p.y+12],[p.x+30,p.y+12]],'#c7a8f3',3)}else if(p.type==='travel'){for(const dx of [-38,38]){round(c,p.x+dx-6,p.y-45,12,49,3,'#64809a');A.glow(c,p.x+dx,p.y-46,26,'#a3edff44')}stroke(c,[[p.x-38,p.y-45],[p.x+38,p.y-45]],'#c3edff',3)}}
 function drawWorld(c,o){const {view,zone,cam,player,trail,party,places,time,heroName,goal,sideGoal,heroStyle}=o,z=D.zones[zone],s=styles[zone],scale=view.w<800?.76:.95,ox=view.w*(view.w<800?.50:.55),oy=view.h*.60;c.fillStyle=s.ground;c.fillRect(0,0,view.w,view.h);c.save();c.translate(ox-cam.x*scale,oy-cam.y*scale);c.scale(scale,scale);terrain(c,zone,z,time);const inside=(x,y)=>Math.abs(x-cam.x)<view.w/scale*.8+350&&Math.abs(y-cam.y)<view.h/scale*.8+350;
 for(const b of D.buildings(zone))if(inside(b.x,b.y))building(c,b,zone,view.dpr);
 if(zone==='orrukel')for(let i=0;i<100;i++){const x=140+(i*387)%2900,y=150+(i*533)%2450;if(inside(x,y)){A.tree(c,x,y,s.tree,37+i%21);A.glow(c,x+12,y-45,26,'#a5bae933')}}
 for(let y=200;y<z.h;y+=400)for(let x=350;x<z.w;x+=400){if(!inside(x,y))continue;A.tree(c,x,y,s.tree,26);stroke(c,[[x-10,y+153],[x-10,y+100]],'#c6acc8',3);A.ellipse(c,x-10,y+98,7,4,'#fff0b7');A.glow(c,x-10,y+128,48,'#ffd8a822');const phase=(Math.sin(time*.7+x+y)+1)/2;A.glow(c,x+100,y-125,25,s.neon+(Math.round(10+phase*13).toString(16).padStart(2,'0')))}
 if(zone!=='orrukel')for(let i=0;i<13;i++){const vertical=i%2===0,lane=(i%6+1)*400+(i%3?31:-31),travel=(time*(30+i%5*4)+i*227)%(vertical?z.h:z.w),x=vertical?lane:travel,y=vertical?travel:lane;if(inside(x,y))car(c,x,y,vertical,['#eab482','#a095d0','#aee0d5','#dd9fc5'][i%4],time)}
 // Walkers stay on sidewalks and have independent trajectories.
 for(let i=0;i<32;i++){const vertical=i%2===0,lane=(i%7+1)*400+(i%3?72:-72),travel=(i*179+time*(10+i%5))%(vertical?z.h:z.w),x=vertical?lane:travel,y=vertical?travel:lane;if(inside(x,y))A.human(c,x,y,.29,{civilianIndex:i,time:time+i,walk:.65,face:i%3?1:-1,skin:i%3?'#cda180':'#865b48',color:['#ffcf96','#a2e1e7','#e3ace3','#aec499'][i%4]})}
 for(const p of places)if(inside(p.x,p.y)){if(p.type==='npc'){const a=C.allies[p.ally]||{};A.human(c,p.x,p.y,.43,{...a,time});A.text(c,p.name,p.x,p.y+22,'#eadbf1',11)}else if(!root.MonsterHD?.marker(c,p,time)){landmark(c,p,time);A.token(c,{...p,type:p.type==='campaign'?'story':p.type},time)}}
 if(goal){const route=streetRoute(zone,player,goal);c.setLineDash([8,12]);stroke(c,route.map(p=>[p.x,p.y]),'#ffdc89a8',3);c.setLineDash([])}
 if(sideGoal&&sideGoal.id!==goal?.id){const route=streetRoute(zone,player,sideGoal);c.setLineDash([5,9]);stroke(c,route.map(p=>[p.x,p.y]),'#ff4f64c8',4);c.setLineDash([]);A.glow(c,sideGoal.x,sideGoal.y,48,'#ff405533')}
 const people=party.map((id,i)=>{let pos=trail[Math.min(trail.length-1,(i+1)*10)]||player;if(Math.hypot(pos.x-player.x,pos.y-player.y)<25)pos=D.safePosition(player.x+(i-1)*34,player.y+44+i%2*20,zone);return{id,pos}}).concat([{id:'hero',pos:player}]);people.sort((a,b)=>a.pos.y-b.pos.y);for(const person of people){const a=C.allies[person.id]||(person.id==='hero'?{color:'#ffce8c',skin:'#ad7859',hair:'#282638',...heroStyle}:{color:'#ffce8c',skin:'#ad7859',hair:'#282638'});A.human(c,person.pos.x,person.pos.y,.48,{...a,time,walk:player.walk,face:person.pos.face||player.face});A.text(c,person.id==='hero'?heroName:a.name,person.pos.x,person.pos.y+22,person.id==='hero'?'#ffe4a8':a.color,12)}
 // Drifting motes, steam and slow rooftop searchlights provide gentle motion.
 for(let i=0;i<30;i++){const x=(i*211+time*6)%z.w,y=(i*367-time*9+z.h*100)%z.h;if(inside(x,y))A.ellipse(c,x,y,1+i%2,1+i%2,'#eedaf044')}
 c.restore();const veil=c.createLinearGradient(0,0,0,view.h);veil.addColorStop(0,'#17143226');veil.addColorStop(.6,'#1e193400');veil.addColorStop(1,'#13132d44');c.fillStyle=veil;c.fillRect(0,0,view.w,view.h)
 }
 function streetAt(zone,pos){const n=streetNames[zone],ix=C.clamp(Math.round(pos.x/400),0,7),iy=C.clamp(Math.round(pos.y/400),0,6);return Math.abs(pos.x-ix*400)<Math.abs(pos.y-iy*400)?n.v[ix]:n.h[iy]}
 function nearestGrid(zone,p){const step=40,start={x:Math.round(p.x/step),y:Math.round(p.y/step)};for(let r=0;r<12;r++)for(let dy=-r;dy<=r;dy++)for(let dx=-r;dx<=r;dx++){const x=(start.x+dx)*step,y=(start.y+dy)*step;if(D.passable(x,y,zone))return{x:x/step,y:y/step}}return{x:40,y:30}}
 function streetRoute(zone,from,to){if(!to)return[];const a=nearestGrid(zone,from),b=nearestGrid(zone,to),key=[zone,a.x,a.y,b.x,b.y].join(':');if(routeCache.has(key))return routeCache.get(key);const encode=(x,y)=>x+','+y,start=encode(a.x,a.y),end=encode(b.x,b.y),q=[a],previous=new Map([[start,null]]);for(let i=0;i<q.length;i++){const n=q[i],k=encode(n.x,n.y);if(k===end)break;for(const [dx,dy]of [[1,0],[0,1],[-1,0],[0,-1]]){const x=n.x+dx,y=n.y+dy,nk=encode(x,y);if(!previous.has(nk)&&D.passable(x*40,y*40,zone)){previous.set(nk,k);q.push({x,y})}}}if(!previous.has(end))return[];const result=[];for(let k=end;k;k=previous.get(k)){const [x,y]=k.split(',').map(Number);result.push({x:x*40,y:y*40})}result.reverse();if(routeCache.size>30)routeCache.clear();routeCache.set(key,result);return result}
 function mapBounds(zone,player,mode,w,h){const z=D.zones[zone];if(mode==='region'){const scale=Math.max(z.w/w,z.h/h),ww=w*scale,hh=h*scale;return{x:(z.w-ww)/2,y:(z.h-hh)/2,w:ww,h:hh}}const ww=1280,hh=ww*h/w;return{x:C.clamp(player.x-ww/2,0,z.w-ww),y:C.clamp(player.y-hh/2,0,z.h-hh),w:ww,h:hh}}
 function drawMap(c,{zone,player,places,target,sideTarget,time=0,mode='nearby',w=244,h=206}){const z=D.zones[zone],s=styles[zone],bounds=mapBounds(zone,player,mode,w,h),sx=w/bounds.w,sy=h/bounds.h,project=p=>({x:(p.x-bounds.x)*sx,y:(p.y-bounds.y)*sy});c.clearRect(0,0,w,h);c.fillStyle='#201a38';c.fillRect(0,0,w,h);c.save();c.beginPath();c.rect(0,0,w,h);c.clip();
 // Broad, named streets and building silhouettes replace the square-only map.
 for(let x=0;x<=z.w;x+=400){const p=project({x,y:0});c.fillStyle='#94739655';c.fillRect(p.x-78*sx,0,156*sx,h);c.fillStyle='#322a50';c.fillRect(p.x-58*sx,0,116*sx,h)}for(let y=0;y<=z.h;y+=400){const p=project({x:0,y});c.fillStyle='#94739655';c.fillRect(0,p.y-78*sy,w,156*sy);c.fillStyle='#322a50';c.fillRect(0,p.y-58*sy,w,116*sy)}
 for(const b of D.buildings(zone)){const p=project(b);c.fillStyle=['#8d6eaa','#a572a1','#668dab','#a489c1','#ae849a'][b.variant];if(b.variant===2){c.beginPath();c.ellipse(p.x+b.w*sx/2,p.y+b.h*sy/2,b.w*sx*.46,b.h*sy*.46,0,0,Math.PI*2);c.fill()}else{c.beginPath();c.roundRect(p.x+2,p.y+2,b.w*sx-4,b.h*sy-4,b.variant===1?5:2);c.fill();if(b.variant===3){c.fillStyle='#c5a8d9';c.fillRect(p.x+5,p.y+5,4,4)}}}
 if(zone==='orrukel')for(let i=0;i<40;i++){const p=project({x:150+i*317%2900,y:200+i*491%2300});A.ellipse(c,p.x,p.y,12,9,'#729b8033')}
 if(mode==='nearby'){const names=streetNames[zone];for(let y=400;y<z.h;y+=400){const p=project({x:0,y});if(p.y>18&&p.y<h-18)A.text(c,names.h[y/400],w*.52,p.y+3,'#e5cae57a',8)}for(let x=400;x<z.w;x+=400){const p=project({x,y:0});if(p.x>20&&p.x<w-20){c.save();c.translate(p.x+3,h*.68);c.rotate(-Math.PI/2);A.text(c,names.v[x/400],0,0,'#e5cae57a',8);c.restore()}}}
 if(target){const route=streetRoute(zone,player,target);c.setLineDash([4,3]);stroke(c,route.map(p=>{const pp=project(p);return[pp.x,pp.y]}),'#ffda80',2.3);c.setLineDash([])}
 if(sideTarget&&sideTarget.id!==target?.id){const route=streetRoute(zone,player,sideTarget);c.setLineDash([3,4]);stroke(c,route.map(p=>{const pp=project(p);return[pp.x,pp.y]}),'#ff4059',3.2);c.setLineDash([])}
 const pins=[];for(const p of places.filter(p=>p.type!=='npc')){const point=project(p);if(point.x<10||point.x>w-10||point.y<12||point.y>h-10)continue;const color=D.colors[p.type]||D.colors.story;if(!root.MonsterHD?.marker(c,{...p,px:point.x,py:point.y},time,true)){A.ellipse(c,point.x,point.y,mode==='region'?6:8,mode==='region'?6:8,'#191a34');A.text(c,symbols[p.type]||'◆',point.x,point.y+4,color,mode==='region'?10:13)}pins.push({...p,px:point.x,py:point.y})}
 const labels=pins.slice().sort((a,b)=>(a.id===target?.id?-1:b.id===target?.id?1:Math.hypot(a.x-player.x,a.y-player.y)-Math.hypot(b.x-player.x,b.y-player.y))).slice(0,mode==='region'?3:4),occupied=[];for(const p of labels){const label=p.name.replace(/^FIGHT · /,'').split(' · ')[0];c.font='600 9px Segoe UI';const tw=Math.min(w-20,c.measureText(label).width+8),xx=C.clamp(p.px-tw/2,4,w-tw-4),yy=p.py+12;if(yy>h-15||occupied.some(r=>xx<r.x+r.w&&xx+tw>r.x&&Math.abs(yy-r.y)<17))continue;round(c,xx,yy-1,tw,14,3,'#15182deb');A.text(c,label,xx+tw/2,yy+9,'#eee2ef',9);occupied.push({x:xx,y:yy,w:tw})}
 const p=project(player);c.save();c.translate(p.x,p.y);c.rotate(Math.atan2(player.vy||0,player.vx||player.face||1)+Math.PI/2);A.path(c,[[0,-8],[6,7],[0,4],[-6,7]],'#fff2c9','#52366d');c.restore();c.restore();A.text(c,'N',w-13,15,'#f3deab',10);stroke(c,[[w-13,19],[w-13,28]],'#f3deab',1.5);return{bounds,pins,street:streetAt(zone,player),target:target?.name||'Explore nearby landmarks'}
 }
 const baseMap=drawMap;
 drawMap=function(c,o){const state=baseMap(c,o),{bounds}=state,{w=244,h=206,player,target}=o,scale=w/bounds.w;
  // Exact collision footprints, rather than decorative roof silhouettes.
  c.save();c.strokeStyle='#eee0ff55';c.lineWidth=.7;for(const b of D.buildings(o.zone)){const x=(b.x-bounds.x)*scale,y=(b.y-bounds.y)*scale;if(x+b.w*scale>0&&x<w&&y+b.h*scale>0&&y<h)c.strokeRect(x,y,b.w*scale,b.h*scale)}
  const bar=200*scale;c.fillStyle='#13182de8';c.fillRect(5,h-20,bar+14,17);stroke(c,[[10,h-9],[10+bar,h-9]],'#eee0ba',2);A.text(c,'200 units',10+bar/2,h-12,'#eee0ba',8);
  if(target){const tx=(target.x-bounds.x)*scale,ty=(target.y-bounds.y)*scale,px=(player.x-bounds.x)*scale,py=(player.y-bounds.y)*scale;state.distance=Math.round(Math.hypot(target.x-player.x,target.y-player.y));if(tx<12||tx>w-12||ty<12||ty>h-24){const dx=tx-px,dy=ty-py,t=Math.min(dx>0?(w-14-px)/dx:dx<0?(14-px)/dx:Infinity,dy>0?(h-26-py)/dy:dy<0?(14-py)/dy:Infinity),x=px+dx*t,y=py+dy*t;c.save();c.translate(x,y);c.rotate(Math.atan2(dy,dx));A.path(c,[[8,0],[-5,-6],[-5,6]],'#ffe3a0','#281d3b');c.restore()}else{c.strokeStyle='#fff0b9';c.lineWidth=2;c.beginPath();c.arc(tx,ty,11,0,Math.PI*2);c.stroke()}}
 if(o.sideTarget){const st=o.sideTarget,tx=(st.x-bounds.x)*scale,ty=(st.y-bounds.y)*scale;state.sideDistance=Math.round(Math.hypot(st.x-player.x,st.y-player.y));if(tx>=10&&tx<=w-10&&ty>=12&&ty<=h-24){c.strokeStyle='#ff5369';c.lineWidth=2.5;c.beginPath();c.arc(tx,ty,13,0,Math.PI*2);c.stroke();c.fillStyle='#ff5369';c.beginPath();c.arc(tx,ty,3,0,Math.PI*2);c.fill()}}
 c.restore();return state;
 };
 root.CityHD={drawWorld,drawMap,streetRoute,streetAt,mapBounds,symbols,styles};
})(window);

// Walkable Institute interior. Geometry is shared by rendering, navigation and collision.
(function(root){'use strict';
 const D=root.OdysseyWorld,H=root.CityHD,A=root.OdysseyArt,C=root.OdysseyCore;
 const rooms=[
 {name:'Entrance Hall',x:1320,y:1800,w:560,h:760},
 {name:'Great Hall',x:400,y:1450,w:850,h:550},
 {name:'Student Dormitory',x:1950,y:1450,w:850,h:550},
 {name:'Library',x:400,y:650,w:850,h:550},
 {name:'Gift Classroom',x:1950,y:650,w:850,h:550},
 {name:'Danger Room',x:1250,y:200,w:700,h:400},
 {name:'Gallery',x:1400,y:500,w:400,h:1450},
 {name:'North Cloister',x:1100,y:850,w:1000,h:180},
 {name:'South Cloister',x:1100,y:1650,w:1000,h:180}];
 const contains=(r,x,y)=>x>=r.x&&x<=r.x+r.w&&y>=r.y&&y<=r.y+r.h;
 const floor=(x,y)=>rooms.some(r=>contains(r,x,y));
 const walkable=(x,y)=>[[0,0],[-14,-14],[14,-14],[-14,14],[14,14]].every(([dx,dy])=>floor(x+dx,y+dy));
 D.zones.institute={name:'Institute Castle',subtitle:'A home for the gifted',color:'#d4bbec',ground:'#191c30',w:3200,h:2800};
 D.places.institute=[
 {id:'exit',name:'Exit to campus',x:1600,y:2400,type:'travel',to:'helix',toId:'castle'},
 {id:'commons',name:'Great Hall · companions',x:800,y:1730,type:'rest',campus:true},
 {id:'dorm',name:'Your dorm · rest',x:2350,y:1730,type:'rest',campus:true},
 {id:'library',name:'Library · field journal',x:800,y:930,type:'job',library:true},
 {id:'classroom',name:'Gift Control · attend class',x:2350,y:930,type:'rest',campus:true},
 {id:'interior-danger',name:'Danger Room',x:1600,y:400,type:'training'}];
 D.places.helix.push({id:'castle',name:'Enter Institute Castle',x:1600,y:600,type:'travel',to:'institute',toId:'exit'});
 const oldPass=D.passable,oldSafe=D.safePosition,oldBuildings=D.buildings;
 D.passable=(x,y,z)=>z==='institute'?walkable(x,y):oldPass(x,y,z);
 D.safePosition=(x,y,z)=>z==='institute'?(walkable(x,y)?{x,y}:{x:1600,y:2250}):oldSafe(x,y,z);
 D.buildings=z=>z==='institute'?[]:oldBuildings(z);
 // All destination centers join the central gallery through the two cloisters.
 function route(from,to){const path=[from];if(from.x<1400||from.x>1800)path.push({x:from.x,y:from.y<1300?940:1740});const source=path[path.length-1];path.push({x:1600,y:source.y});const row=to.x<1400||to.x>1800?(to.y<1300?940:1740):to.y;path.push({x:1600,y:row},{x:to.x,y:row},to);return path;}
 const oldRoute=H.streetRoute;H.streetRoute=(z,a,b)=>z==='institute'?route(a,b):oldRoute(z,a,b);
 const roomAt=p=>rooms.find(r=>contains(r,p.x,p.y))?.name||'Gallery';
 const oldWorld=H.drawWorld;
 H.drawWorld=function(c,o){if(o.zone!=='institute')return oldWorld(c,o);const {view,cam,player,time,places,party,trail,heroName,goal}=o,scale=view.w<800?.70:.9;
 c.fillStyle='#101626';c.fillRect(0,0,view.w,view.h);c.save();c.translate(view.w*.5-cam.x*scale,view.h*.58-cam.y*scale);c.scale(scale,scale);
 for(const r of rooms){c.fillStyle='#61536e';c.fillRect(r.x-12,r.y-12,r.w+24,r.h+24)}
 for(const r of rooms){c.fillStyle='#303149';c.fillRect(r.x,r.y,r.w,r.h)}
 // Stone tiles stop at the same boundaries as movement.
 c.strokeStyle='#aba0b51c';c.lineWidth=1;for(let y=220;y<2560;y+=50)for(let x=410;x<2800;x+=50)if(floor(x,y)&&floor(x+45,y+45))c.strokeRect(x,y,45,45);
 for(const r of rooms.slice(0,6)){A.text(c,r.name.toUpperCase(),r.x+r.w/2,r.y+48,'#f1d69f',21);for(let x=r.x+70;x<r.x+r.w;x+=150){A.glow(c,x,r.y+100,75,'#ffbf6633');A.ellipse(c,x,r.y+68,5,9+Math.sin(time*4+x)*2,'#ffe4a6')} }
 // Furnishings sit at room edges, leaving the center routes unobstructed.
 for(const r of rooms.slice(1,5))for(let i=0;i<5;i++){const x=r.x+60+i*145,y=r.y+120;
 c.fillStyle='#10131d77';c.fillRect(x+7,y+9,100,65);
 c.fillStyle=r.name==='Library'?'#906344':'#795879';c.fillRect(x,y,95,50);c.fillStyle='#e1be82';c.fillRect(x+5,y+5,85,5);
 if(r.name==='Student Dormitory'){c.fillStyle='#a4b7d7';c.fillRect(x+6,y+12,83,62);c.fillStyle='#eaded0';c.fillRect(x+12,y+13,70,18);c.fillStyle='#4e658e';c.fillRect(x+6,y+38,83,36);c.strokeStyle='#c8ad80';c.strokeRect(x+6,y+12,83,62)}
 if(r.name==='Library')for(let j=0;j<9;j++){c.fillStyle=['#bac9db','#b591b8','#e9b874'][j%3];c.fillRect(x+8+j*9,y+15,6,28)}
 if(r.name==='Gift Classroom'){c.fillStyle='#e6ddc7';c.fillRect(x+20,y+18,34,21);A.line(c,[[x+37,y+18],[x+37,y+39]],'#938976',1);A.ellipse(c,x+73,y+29,9,9,'#9ce2d2')}
 if(r.name==='Great Hall'){A.ellipse(c,x+24,y+28,13,8,'#d3d5de');A.ellipse(c,x+70,y+28,13,8,'#d3d5de');c.fillStyle='#e5b877';c.fillRect(x+45,y+14,5,15)}
 }
 // Arched windows, banners and inlaid carpets create a readable castle atmosphere.
 for(const r of rooms.slice(0,6)){for(const side of [-1,1]){const x=side<0?r.x+26:r.x+r.w-55,y=r.y+210;c.fillStyle='#18203c';c.beginPath();c.roundRect(x,y,30,100,[15,15,0,0]);c.fill();c.strokeStyle='#bda787';c.lineWidth=3;c.stroke();A.line(c,[[x+15,y+6],[x+15,y+96]],'#83b6d7',3);A.line(c,[[x+3,y+42],[x+27,y+42]],'#83b6d7',3);A.glow(c,x+15,y+50,65,'#8bbbe022')}
 const cx=r.x+r.w/2;c.fillStyle='#6c426277';c.fillRect(cx-70,r.y+130,140,Math.max(60,r.h-250));c.strokeStyle='#bda06d66';c.strokeRect(cx-62,r.y+138,124,Math.max(44,r.h-266));
 A.path(c,[[cx-140,r.y+65],[cx-100,r.y+65],[cx-100,r.y+140],[cx-120,r.y+158],[cx-140,r.y+140]],'#535c8c','#c3ab82');A.text(c,'X',cx-120,r.y+121,'#e8d49c',25);
 }
 for(let i=0;i<8;i++){const x=1450+(i%2)*290,y=700+Math.floor(i/2)*300;A.human(c,x,y+Math.sin(time+i)*15,.4,{studentIndex:i,time,walk:.2,color:i%2?'#a4bde0':'#c99ac6'});}
 if(goal){c.setLineDash([9,10]);A.line(c,route(player,goal).map(p=>[p.x,p.y]),'#e8cb8877',3);c.setLineDash([])}
 for(const p of places)if(!root.MonsterHD?.marker(c,p,time))A.token(c,p,time);
 party.forEach((id,i)=>{const p=trail[Math.min(trail.length-1,(i+1)*10)]||player;A.human(c,p.x,p.y,.48,{...C.allies[id],time,walk:player.walk,face:player.face})});A.human(c,player.x,player.y,.48,{time,walk:player.walk,face:player.face,color:'#ffce8c',skin:'#ad7859'});A.text(c,heroName,player.x,player.y+24,'#ffe4a8',12);c.restore();};
 const oldMap=H.drawMap;H.drawMap=function(c,o){if(o.zone!=='institute')return oldMap(c,o);const {w,h,player,target,places}=o,bounds=H.mapBounds('institute',player,'region',w,h),project=p=>({x:(p.x-bounds.x)*w/bounds.w,y:(p.y-bounds.y)*h/bounds.h});c.fillStyle='#141b2c';c.fillRect(0,0,w,h);for(const r of rooms){const p=project(r);c.fillStyle='#706180';c.fillRect(p.x,p.y,r.w*w/bounds.w,r.h*h/bounds.h)}if(target)A.line(c,route(player,target).map(p=>{const q=project(p);return[q.x,q.y]}),'#ffe2a1',2);const pins=places.map(p=>{const q=project(p);A.ellipse(c,q.x,q.y,4,4,D.colors[p.type]);A.text(c,p.id==='interior-danger'?'TRAIN':p.id.toUpperCase(),q.x,q.y-7,'#f0e4cf',8);return{...p,px:q.x,py:q.y}});const p=project(player);A.ellipse(c,p.x,p.y,4,4,'#fff');A.text(c,'N ↑ · INSTITUTE FLOOR PLAN',w/2,13,'#f0e4cf',9);return{bounds,pins,street:roomAt(player),distance:target?Math.round(Math.hypot(target.x-player.x,target.y-player.y)):0};};
 root.InstituteLayout={rooms,route,roomAt};
})(window);
