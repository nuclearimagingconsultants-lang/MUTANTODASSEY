import {randomBytes,createHmac,createCipheriv,createDecipheriv} from 'node:crypto';
export function createSaveService({redis,now=()=>new Date()}={}){
 let masterPromise;
 async function master(){if(!masterPromise)masterPromise=(async()=>{const candidate=randomBytes(32).toString('hex');await redis(['SET','mo:v1:master',candidate,'NX']);const key=await redis(['GET','mo:v1:master']);if(!/^[a-f0-9]{64}$/.test(key||''))throw Error('Storage unavailable');return Buffer.from(key,'hex')})().catch(e=>{masterPromise=null;throw e});return masterPromise}
 const hash=(key,value)=>createHmac('sha256',key).update(value).digest('hex');
 const rateScript="local n=redis.call('INCR',KEYS[1]);if n==1 then redis.call('EXPIRE',KEYS[1],ARGV[1]) end;return n";
 const saveScript="local owner=redis.call('GET',KEYS[1]);if owner and owner~=ARGV[1] then return 0 end;redis.call('SET',KEYS[1],ARGV[1]);redis.call('LPUSH',KEYS[2],ARGV[2]);redis.call('LTRIM',KEYS[2],0,23);return 1";
 const seal=(data,key)=>{const iv=randomBytes(12),c=createCipheriv('aes-256-gcm',key,iv),encrypted=Buffer.concat([c.update(JSON.stringify(data)),c.final()]);return Buffer.concat([iv,c.getAuthTag(),encrypted]).toString('base64')};
 const open=(data,key)=>{const bytes=Buffer.from(data,'base64'),d=createDecipheriv('aes-256-gcm',key,bytes.subarray(0,12));d.setAuthTag(bytes.subarray(12,28));return JSON.parse(Buffer.concat([d.update(bytes.subarray(28)),d.final()]).toString())};
 return async function handle(action,data,ip='unknown'){
 const key=await master(),attempts=await redis(['EVAL',rateScript,'1','mo:v1:rate:'+hash(key,ip),'600']);if(attempts>30)return{status:429,body:{error:'Too many attempts. Wait ten minutes before trying again.'}};
 if(!/^\d{8,12}$/.test(data?.pin||''))return{status:400,body:{error:'For online saves, use a private PIN of 8–12 digits. Shorter old PINs still work for device saves.'}};
 const id=hash(key,'pin:'+data.pin),prefix='mo:v1:save:'+id;
 if(action==='recover'){const packed=await redis(['LRANGE',prefix,0,23]);return{status:200,body:{snapshots:(packed||[]).map(x=>open(x,key))}}}
 if(action!=='save')return{status:404,body:{error:'Unknown save action.'}};
 const snapshot=data.snapshot,s=snapshot?.data?.save,profile=s?.odyssey?.profileId;
 if(!s||s.version!==2||typeof s.name!=='string'||s.name.length>100||!Number.isInteger(s.level)||s.level<1||!Array.isArray(s.equipped)||s.equipped.length>100||typeof profile!=='string'||profile.length>100||JSON.stringify(snapshot).length>500000)return{status:400,body:{error:'Invalid save. Your existing recovery points were not changed.'}};
 const at=now().toISOString(),record={at,name:s.name,level:s.level,profile,data:snapshot.data};
 const result=await redis(['EVAL',saveScript,'2',prefix+':owner',prefix,hash(key,profile),seal(record,key)]);
 if(result!==1)return{status:409,body:{error:'That PIN belongs to a different adventure. Recover that adventure or choose a new PIN; nothing was overwritten.'}};
 return{status:201,body:{saved:true,at,name:s.name,level:s.level}};
 }
}
let service;
export default async function handler(req,res){
 const send=(status,body)=>{res.statusCode=status;res.setHeader('Content-Type','application/json');res.setHeader('Cache-Control','no-store');res.setHeader('X-Content-Type-Options','nosniff');res.end(JSON.stringify(body))};
 if(req.method!=='POST')return send(405,{error:'Use POST.'});
 if(req.headers.origin){try{if(new URL(req.headers.origin).host!==req.headers.host)return send(403,{error:'Open the game website to use recovery.'})}catch{return send(403,{error:'Invalid origin.'})}}
 const url=process.env.UPSTASH_REDIS_REST_URL||process.env.KV_REST_API_URL,token=process.env.UPSTASH_REDIS_REST_TOKEN||process.env.KV_REST_API_TOKEN;
 if(!url||!token)return send(503,{error:'Online saves are being connected. Keep your exported backup.'});
 try{let data=req.body;if(!data){let text='',size=0;for await(const chunk of req){size+=chunk.length;if(size>550000)return send(413,{error:'Save is too large.'});text+=chunk}data=JSON.parse(text)}else if(typeof data==='string')data=JSON.parse(data);
 service??=createSaveService({redis:async command=>{const r=await fetch(url,{method:'POST',headers:{Authorization:'Bearer '+token,'Content-Type':'application/json'},body:JSON.stringify(command),signal:AbortSignal.timeout(8000)});if(!r.ok)throw Error('Storage unavailable');const out=await r.json();if(out.error)throw Error('Storage unavailable');return out.result}});
 const action=new URL(req.url,'https://game.local').pathname.split('/').pop(),result=await service(action,data,req.headers['x-vercel-forwarded-for']||req.headers['x-forwarded-for']||'unknown');send(result.status,result.body);
 }catch{send(503,{error:'Online save did not complete. Your device backup is safe; try again before leaving.'})}
}
