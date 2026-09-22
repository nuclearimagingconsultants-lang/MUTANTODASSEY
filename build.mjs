import {mkdir,copyFile,readFile,writeFile} from 'node:fs/promises';
const root = new URL('.', import.meta.url);
const output = new URL('dist/', root);
const files=['index.html','odyssey.css','config.js','cesar-save.js','gift-roster.js','core.js','equipment.js','world-data.js','art.js','city-hd.js','battle-hd.js','crowd-hd.js','campaign-data.js','adventure.js'];
const fixture=await readFile(new URL('cesar-save.js',root),'utf8');
if(!/^\s*(?:\/\/[^\n]*\n)*window\.CESAR_FIXTURE\s*=\s*null;?\s*$/.test(fixture))throw Error('Public builds must not contain a personal save.');
await mkdir(new URL('assets/',output),{recursive:true});
for(const file of files)await copyFile(new URL(file,root),new URL(file,output));
await copyFile(new URL('ashford.png',root),new URL('assets/ashford.png',output));
await writeFile(new URL('404.html',output),'<!doctype html><title>Mutant Odyssey</title><p>This page is not available. <a href="/">Return to Mutant Odyssey</a>.</p>');
await copyFile(new URL('ashford-hd.png',root),new URL('assets/ashford-hd.png',output));
const monsterAssets=['sentinel-hd.png','cast-hd.png','bestiary-hd.png','civilians-hd.png','students-hd.png'];
for(const name of monsterAssets)await copyFile(new URL(name,root),new URL('assets/'+name,output));
const production=new URL('.vercel/output/',root),statics=new URL('static/',production);
await mkdir(new URL('assets/',statics),{recursive:true});
for(const file of [...files,'404.html','assets/ashford.png','assets/ashford-hd.png',...monsterAssets.map(name=>'assets/'+name)])await copyFile(new URL(file,output),new URL(file,statics));
for(const name of ['save','recover']){const directory=new URL('functions/api/'+name+'.func/',production);await mkdir(directory,{recursive:true});await copyFile(new URL('save-service.mjs',root),new URL('handler.mjs',directory));await writeFile(new URL('.vc-config.json',directory),JSON.stringify({runtime:'nodejs22.x',handler:'handler.mjs',launcherType:'Nodejs',maxDuration:30}));}
await writeFile(new URL('config.json',production),JSON.stringify({version:3,routes:[{src:'/(.*)',headers:{'X-Content-Type-Options':'nosniff','Cache-Control':'no-store'},continue:true},{src:'/',dest:'/index.html'},{handle:'filesystem'},{src:'/.*',status:404,dest:'/404.html'}]}));
console.log('HD public build and private save functions ready. Personal archives excluded.');
