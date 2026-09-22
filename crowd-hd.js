/* Civilians never use companion sprites. Stable indices preserve each resident's identity. */
(function(root){'use strict';
 const A=root.OdysseyArt,castHuman=A.human,cache=new Map();
 const sheets={civilian:{file:'civilians-hd.png',columns:8,rows:4,count:32},student:{file:'students-hd.png',columns:4,rows:2,count:8}};
 function identity(opts={}){const group=Number.isInteger(opts.studentIndex)?'student':Number.isInteger(opts.civilianIndex)?'civilian':null;if(!group)return null;const s=sheets[group],raw=group==='student'?opts.studentIndex:opts.civilianIndex;return{...s,group,index:((raw%s.count)+s.count)%s.count}}
 function source(file){if(!cache.has(file)){const image=new Image(),entry={image,failed:false};image.decoding='async';image.onerror=()=>{entry.failed=true};image.src='assets/'+file;cache.set(file,entry)}return cache.get(file)}
 A.human=function(c,x,y,scale,opts={}){const id=identity(opts);if(!id)return castHuman(c,x,y,scale,opts);const entry=source(id.file),img=entry.image;if(entry.failed||!img.complete||!img.naturalWidth){if(root.CastHD?.fallback)return root.CastHD.fallback(c,x,y,scale,opts);return}const sw=img.naturalWidth/id.columns,sh=img.naturalHeight/id.rows,h=190*scale,w=h*sw/sh,reduced=typeof matchMedia==='function'&&matchMedia('(prefers-reduced-motion: reduce)').matches,bob=reduced?0:Math.sin((opts.time||0)*(opts.walk?10:2))*scale*(opts.walk?2:1);c.save();A.ellipse(c,x,y,w*.25,5*scale,'#03071366');c.translate(x,y+bob);c.scale(opts.face||1,1);c.imageSmoothingEnabled=true;c.imageSmoothingQuality='high';c.drawImage(img,id.index%id.columns*sw,Math.floor(id.index/id.columns)*sh,sw,sh,-w/2,-h,w,h);c.restore()};
 root.CrowdHD={identity,sheets};
})(window);
