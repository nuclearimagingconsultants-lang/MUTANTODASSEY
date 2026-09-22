(function(root){'use strict';
 const A=OdysseyArt;let gpu=null,failed=false;
 function init(){if(gpu||failed)return;const canvas=document.createElement('canvas');canvas.id='powerGlow';canvas.style.cssText='position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:1;mix-blend-mode:screen';document.querySelector('#game').prepend(canvas);try{const gl=canvas.getContext('webgl',{alpha:true,premultipliedAlpha:false,antialias:false,powerPreference:'high-performance'});if(!gl)throw Error('WebGL unavailable');const compile=(type,src)=>{const s=gl.createShader(type);gl.shaderSource(s,src);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw Error('Shader unsupported');return s};const program=gl.createProgram();gl.attachShader(program,compile(gl.VERTEX_SHADER,'attribute vec2 pos;void main(){gl_Position=vec4(pos,0.,1.);}'));gl.attachShader(program,compile(gl.FRAGMENT_SHADER,'precision mediump float;uniform vec2 resolution,center;uniform vec3 color;uniform float energy,time;void main(){vec2 p=(gl_FragCoord.xy-center)/resolution.y;float r=length(p);float a=atan(p.y,p.x);float halo=exp(-r*24.)*.4;float ring=exp(-abs(r-.075-energy*.04)*240.)*.3;float rays=pow(abs(sin(a*7.+time*2.)),18.)*exp(-r*19.)*.18;float v=(halo+ring+rays)*energy;gl_FragColor=vec4(color*v,v*.6);}'));gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw Error('Shader linking failed');gl.useProgram(program);const buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),gl.STATIC_DRAW);const pos=gl.getAttribLocation(program,'pos');gl.enableVertexAttribArray(pos);gl.vertexAttribPointer(pos,2,gl.FLOAT,false,0,0);gpu={canvas,gl,program,uniforms:Object.fromEntries(['resolution','center','color','energy','time'].map(k=>[k,gl.getUniformLocation(program,k)]))};canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();failed=true;gpu=null;canvas.remove()});}catch{canvas.remove();failed=true}}
 function clear(){if(gpu){gpu.gl.clearColor(0,0,0,0);gpu.gl.clear(gpu.gl.COLOR_BUFFER_BIT);gpu.canvas.hidden=true}}
 function glow(view,x,y,color,energy,time){init();if(!gpu)return;const{canvas,gl,uniforms:u}=gpu;canvas.hidden=false;const w=Math.round(view.w*view.dpr),h=Math.round(view.h*view.dpr);if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;gl.viewport(0,0,w,h)}gl.uniform2f(u.resolution,w,h);gl.uniform2f(u.center,x*view.dpr,(view.h-y)*view.dpr);gl.uniform3f(u.color,...[1,3,5].map(i=>parseInt(color.slice(i,i+2),16)/255));gl.uniform1f(u.energy,energy);gl.uniform1f(u.time,time);gl.drawArrays(gl.TRIANGLES,0,6)}
 function ring(c,x,y,r,col,width=2,squash=1){c.strokeStyle=col;c.lineWidth=width;c.beginPath();c.ellipse(x,y,r,r*squash,0,0,Math.PI*2);c.stroke()}
 function draw(c,o){const {view,battle:b,layout:l,time}=o;if(!b){clear();return}const {left,width,floor}=l,size=Math.max(.35,l.scale),hx=left+width*(.25+Math.max(0,b.party.length-1)*.075),ex=left+width*.68,anim=b.animation,p=anim?Math.min(1,anim.progress):0,amp=Math.sin(p*Math.PI),color=A.palettes[anim?.element]||'#ffd890';
 c.save();c.globalCompositeOperation='screen';for(let i=0;i<24;i++){const x=left+(i*139+time*7)%width,y=floor-((i*53+time*8)%Math.max(100,floor-90));A.ellipse(c,x,y,1.1,1.1,'#d6c5f033')}
 if(!anim){c.restore();clear();return}const hit=anim.events?.find(e=>e.kind==='hit'),tx=root.MonsterHD.position(l,hit?.target??b.target,b.enemies.length).x,yy=floor-90*size,sx=hx+35*size,element=anim.element;
 if(['gift','limit'].includes(anim.type)){
 glow(view,tx,yy,color,amp*.65,time);A.glow(c,sx,yy,60*size*amp,color+'88');ring(c,hx,floor,55*size,color+'99',2,.30);
 for(let i=0;i<48;i++){const u=(p*1.7+i/48)%1,angle=i*2.399,spread=(element==='fire'?45:25)*amp,x=sx+(tx-sx)*u,y=yy+Math.sin(angle+p*12)*spread;A.glow(c,x,y,5+i%5,color+'55');A.ellipse(c,x,y,1+i%3,element==='fire'?5+i%9:2+i%3,color)}
 if(element==='fire'){for(let i=0;i<15;i++){const x=tx+(i-7)*7*size,h=(35+Math.sin(i*4+p*9)*20)*amp*size;A.path(c,[[x-9,floor],[x-5,floor-h],[x+5,floor-h*2],[x+9,floor]],i%2?'#ffac5788':'#ffe5a6aa')}A.glow(c,tx,yy,100*amp*size,'#ff794866')}
 else if(element==='storm'){for(let j=0;j<4;j++){const pts=Array.from({length:18},(_,i)=>[sx+(tx-sx)*i/17,yy+Math.sin(i*19+j*7+Math.floor(p*15))*25*amp]);A.line(c,pts,'#aeadff',5*amp);A.line(c,pts,'#f4f2ff',1.8)}for(let j=0;j<3;j++)ring(c,tx,floor,(30+j*24)*amp*size,'#b3b3ffbb',2,.32)}
 else if(element==='earth'){for(let j=0;j<9;j++){const x=tx+(j-4)*17*size,h=(30+j%3*22)*amp*size;A.path(c,[[x-14,floor],[x-11,floor-h],[x+4,floor-h-15],[x+15,floor-h*.65],[x+17,floor]],'#bfa689cc','#f8d5ac');A.line(c,[[x,floor],[x+4,floor-h-15]],'#ffe0b7',2)}}
 else if(element==='water'){for(let j=0;j<7;j++)ring(c,tx,yy+j*12*size,(20+j*10)*amp*size,'#92edffd0',3,.45);A.line(c,Array.from({length:40},(_,i)=>[sx+(tx-sx)*i/39,yy+Math.sin(i*.45-p*15)*28*amp]),'#8cecff99',14*amp)}
 else if(element==='heal'||element==='guard'){for(let j=0;j<4;j++)ring(c,hx,floor-50*size,(30+j*10)*size,'#b8ffdf88',2,1.3)}
 else{for(let j=0;j<3;j++){ring(c,tx,yy,(20+j*24)*amp*size,color+'dd',2);for(let i=0;i<12;i++){const a=i*Math.PI/6+p*3;A.line(c,[[tx+Math.cos(a)*35*amp,yy+Math.sin(a)*35*amp],[tx+Math.cos(a)*95*amp,yy+Math.sin(a)*95*amp]],color+'aa',2)}}}
 }else{clear();if(['punch','kick'].includes(anim.type)){for(let j=0;j<5;j++){const a=-.8+j*.4;A.line(c,[[tx,yy],[tx+Math.cos(a)*60*amp,yy+Math.sin(a)*60*amp]],'#ffecc3aa',3)}ring(c,tx,yy,55*amp*size,'#fff0cacc',3);ring(c,tx,floor,85*amp*size,'#d6bdac88',2,.3)}}
 c.restore();
 }
 root.BattleHD={draw,clear,status:()=>gpu?'WebGL power lighting + high-DPI illustration':failed?'High-DPI illustration (WebGL unavailable)':'Automatic WebGL power lighting'};
})(window);

/* Transparent painted sprites; atlas crops preserve the generated alpha channel. */
(function(root){'use strict';
 const designs={
  sentinel:{file:'sentinel-hd.png',crop:[0,0,1,1],color:'#e89af7'},
  stag:{file:'bestiary-hd.png',crop:[0,0,1/3,.5],color:'#99ddff'},
  ashbound:{file:'bestiary-hd.png',crop:[1/3,0,1/3,.5],color:'#ffb16b'},
  hound:{file:'bestiary-hd.png',crop:[2/3,0,1/3,.5],color:'#ace6a0'},
  mantis:{file:'bestiary-hd.png',crop:[0,.5,1/3,.5],color:'#d299f2'},
  regent:{file:'bestiary-hd.png',crop:[1/3,.5,1/3,.5],color:'#e5c38d'},
  glacier:{file:'bestiary-hd.png',crop:[2/3,.5,1/3,.5],color:'#b1e9ff'}
 };
 const images=new Map();
 function key(e){const name=e.enemy||e.name||'';return /glacier/i.test(name)?'glacier':e.type==='training'||e.kind==='sentinel'?'sentinel':e.kind==='stag'?'stag':e.kind==='hound'?'hound':e.kind==='mantis'?'mantis':/ashbound/i.test(name)?'ashbound':e.kind==='hulk'?'regent':null}
 function source(file){if(images.has(file))return images.get(file);const image=new Image();image.decoding='async';const entry={image,failed:false};image.onerror=()=>{entry.failed=true};image.src='assets/'+file;images.set(file,entry);return entry}
 function position(layout,index,count){return{x:layout.left+layout.width*(count===1?.72:.55+index*.17),y:layout.floor}}
 function bounds(layout,index,count){const at=position(layout,index,count),scale=Math.max(.35,layout.scale),maxHeight=Math.max(65,layout.floor-(layout.mobile?212:layout.floor<350?205:270));const w=Math.max(28,Math.min(240*scale,layout.width*(count===1?.32:.15),maxHeight*.70));return{x:at.x-w/2,y:at.y-w/0.70,w,h:w/0.70}}
 function draw(c,e,index,battle,layout,time){const design=designs[key(e)];if(!design)return false;const entry=source(design.file),img=entry.image;if(entry.failed||!img.complete||!img.naturalWidth)return false;
  const box=bounds(layout,index,battle.enemies.length),anim=battle.animation,p=Math.max(0,Math.min(1,anim?.progress||0)),hit=anim?.events?.some(v=>v.kind==='hit'&&v.target===index),attack=anim?.type==='enemy'&&e.hp>0&&!e.staggerTurns,arc=Math.sin(p*Math.PI),selected=battle.target===index;
  const reduced=typeof matchMedia==='function'&&matchMedia('(prefers-reduced-motion: reduce)').matches;
  const dx=reduced?0:attack?-arc*18:hit?Math.sin(p*32)*arc*5:0,dy=reduced||e.hp<=0?0:Math.sin(time*1.6+index)*2;
  c.save();c.translate(dx,dy);c.globalAlpha*=e.hp<=0?.40:1;root.OdysseyArt.ellipse(c,box.x+box.w/2,box.y+box.h,box.w*.45,9,'#03071388');
  c.save();c.beginPath();c.rect(box.x,box.y,box.w,box.h);c.clip();const [rx,ry,rw,rh]=design.crop,sw=img.naturalWidth*rw,sh=img.naturalHeight*rh;const z=Math.min(box.w/sw,box.h/sh),dw=sw*z,dh=sh*z;
  c.imageSmoothingEnabled=true;c.imageSmoothingQuality='high';if(hit&&p>.15&&p<.65)c.filter='brightness(1.5)';c.drawImage(img,img.naturalWidth*rx,img.naturalHeight*ry,sw,sh,box.x+(box.w-dw)/2,box.y+box.h-dh,dw,dh);
  c.restore();if(selected&&e.hp>0){c.strokeStyle='#fff1c1';c.lineWidth=2;c.beginPath();c.ellipse(box.x+box.w/2,box.y+box.h,box.w*.47,11,0,0,Math.PI*2);c.stroke()}
  if(e.hp>0){c.fillStyle='#071120';c.fillRect(box.x,box.y+box.h+7,box.w,4);c.fillStyle=design.color;c.fillRect(box.x,box.y+box.h+7,box.w*Math.max(0,Math.min(1,e.hp/e.maxHp)),4)}
  c.restore();return true;
 }
 function marker(c,p,time=0,mini=false){const kind=key(p),design=designs[kind];if(!design)return false;const A=root.OdysseyArt,entry=mini?null:source(design.file),img=entry?.image,ready=img?.complete&&img.naturalWidth&&!entry.failed,r=mini?8:ready?12:24,x=p.px??p.x,y=(p.py??p.y)-(mini?0:ready?105:35);c.save();
  if(!mini){A.ellipse(c,p.x,p.y,31,12,'#07132399');c.strokeStyle=design.color+'99';c.lineWidth=1.5;c.beginPath();c.ellipse(p.x,p.y,33+Math.sin(time*2)*2,13,0,0,Math.PI*2);c.stroke();for(const direction of [-1,1]){const xx=p.x+direction*40;if(kind==='stag')A.path(c,[[xx-7,p.y+3],[xx-3,p.y-21],[xx+5,p.y-28],[xx+9,p.y+3]],'#7aa2d8',design.color);if(kind==='ashbound')A.path(c,[[xx-11,p.y+4],[xx-8,p.y-10],[xx+2,p.y-16],[xx+12,p.y+4]],'#634d54',design.color)}}
  if(ready){const [rx,ry,rw,rh]=design.crop,sw=img.naturalWidth*rw,sh=img.naturalHeight*rh,z=Math.min(100/sw,105/sh),w=sw*z,h=sh*z;c.imageSmoothingEnabled=true;c.imageSmoothingQuality='high';c.drawImage(img,img.naturalWidth*rx,img.naturalHeight*ry,sw,sh,p.x-w/2,p.y-h,w,h)}
  A.ellipse(c,x,y,r+2,r+2,'#10162d');c.strokeStyle=design.color;c.lineWidth=mini?1:2;c.beginPath();c.arc(x,y,r+2,0,Math.PI*2);c.stroke();c.translate(x,y);c.scale(r/12,r/12);
  if(kind==='sentinel'){A.path(c,[[-7,-8],[7,-8],[9,3],[4,9],[-4,9],[-9,3]],'#8358a1',design.color);A.line(c,[[-6,-1],[-2,0]],'#fff1fb',2);A.line(c,[[2,0],[6,-1]],'#fff1fb',2);A.line(c,[[-3,5],[3,5]],design.color,1)}
  if(kind==='stag'){for(const d of [-1,1]){A.line(c,[[d*2,-1],[d*7,-5],[d*8,-11]],design.color,1.6);A.line(c,[[d*7,-5],[d*11,-7]],design.color,1.4)}A.path(c,[[-4,-2],[4,-2],[3,5],[0,9],[-3,5]],'#d5f4ff',design.color)}
  if(kind==='ashbound'){A.path(c,[[-9,-3],[-5,-10],[0,-6],[5,-10],[9,-3],[6,8],[-6,8]],'#6f5255',design.color);A.line(c,[[-5,-1],[-2,1],[0,5],[3,1],[5,-1]],'#ffcf86',2)}
  if(kind==='hound')A.path(c,[[-9,-8],[-2,-4],[7,-8],[5,1],[10,5],[0,9],[-7,3]],'#75a96b',design.color);
  if(kind==='mantis'){A.path(c,[[0,-8],[5,0],[0,8],[-5,0]],'#a86abc',design.color);for(const d of [-1,1])A.line(c,[[d*3,-3],[d*10,-8],[d*8,6]],design.color,1.5)}
  if(kind==='regent'){A.line(c,[[0,9],[0,-9],[-7,-5],[-9,-10]],design.color,2);A.line(c,[[0,0],[8,-4],[9,-9]],design.color,2)}
  if(kind==='glacier'){for(let i=0;i<3;i++){const a=i*Math.PI/3;A.line(c,[[Math.cos(a)*-9,Math.sin(a)*-9],[Math.cos(a)*9,Math.sin(a)*9]],design.color,1.5)}}c.restore();
  if(!mini){A.text(c,p.type==='training'?'TRAINING':p.type==='campaign'?'STORY':p.type==='boss'?'BOSS':'HUNT',p.x,p.y-(ready?127:76),design.color,9);A.text(c,p.name,p.x,p.y+26,'#f2e5d9',11)}return true;
 }
 root.MonsterHD={draw,key,bounds,position,designs,marker};
})(window);

// The same distinct cast is used in the city and in combat, with procedural fallback on load failure.
(function(root){'use strict';const A=root.OdysseyArt,original=A.human;let image=null,failed=false;
 function actor(opts={}){const name=(opts.name||opts.portrait||'').toLowerCase();if(name==='goldie')return 1;if(name==='juno')return 2;if(name==='yara')return 3;if(name==='oren')return 4;if(opts.enemyName){if(/marshal|crowe|pell|compact|board|keeper|collector/i.test(opts.enemyName))return 7;return (opts.variant||0)%2?6:5}if(opts.color==='#caa890')return 6;if(!opts.color)return 4;if(opts.color==='#ffcf96')return 4;if(opts.color==='#a2e1e7')return 2;if(opts.color==='#e3ace3')return 1;if(opts.color==='#aec499')return 3;return 0}
 A.human=function(c,x,y,scale,opts={}){if(!image){image=new Image();image.decoding='async';image.onerror=()=>{failed=true};image.src='assets/cast-hd.png'}if(failed||!image.complete||!image.naturalWidth)return original(c,x,y,scale,opts);const index=actor(opts),sw=image.naturalWidth/4,sh=image.naturalHeight/2,h=190*scale,w=h*sw/sh,p=Math.min(1,opts.progress||0),arc=Math.sin(p*Math.PI),reduced=typeof matchMedia==='function'&&matchMedia('(prefers-reduced-motion: reduce)').matches;const dy=reduced?0:Math.sin((opts.time||0)*(opts.walk?11:2))*scale*(opts.walk?3:1);c.save();A.ellipse(c,x,y,w*.28,6*scale,'#03071388');c.translate(x,y+dy);c.scale(opts.face||1,1);if(opts.down){c.globalAlpha*=.4;c.rotate(-.7)}else if(!reduced&&opts.action==='kick')c.rotate(-arc*.12);else if(!reduced&&opts.action==='punch')c.rotate(arc*.05);c.imageSmoothingEnabled=true;c.imageSmoothingQuality='high';c.drawImage(image,(index%4)*sw,Math.floor(index/4)*sh,sw,sh,-w/2,-h,w,h);c.restore()};root.CastHD={actor,fallback:original};
})(window);
