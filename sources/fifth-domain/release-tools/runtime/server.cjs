'use strict';
// WORLD_RUNTIME mechanical projection of protocols/ENTRY.hldp. Runtime credentials are private.
const http=require('node:http'),fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),{pathToFileURL}=require('node:url');
const sha=x=>crypto.createHash('sha256').update(x).digest('hex');
const json=(res,status,value,privateReply=false)=>{res.writeHead(status,{'content-type':'application/json; charset=utf-8','cache-control':privateReply?'no-store':'public, max-age=30','x-content-type-options':'nosniff',...(privateReply?{}:{'access-control-allow-origin':'*'})});res.end(JSON.stringify(value));};
function authClient(req,config){const raw=req.headers.authorization||'';if(!raw.startsWith('Bearer '))return null;const digest=sha(raw.slice(7));return (config.clients||[]).find(c=>typeof c.key_sha256==='string'&&/^[a-f0-9]{64}$/.test(c.key_sha256)&&crypto.timingSafeEqual(Buffer.from(c.key_sha256,'hex'),Buffer.from(digest,'hex'))&&Date.parse(c.expires_at)>Date.now())||null;}
function publicStatus(route,status){return {persona_id:route.persona_id,name:route.name,brain_id:status.brain_id,revision:status.revision,state:status.state||'NATIVE_SOURCE_SERVICE_AVAILABLE',node_role:status.node_role||null,execution_authority_granted:false};}
function createServer({root=path.resolve(__dirname,'..'),configPath=process.env.GUANGHU_PUBLIC_ENTRY_CONFIG||'/etc/guanghu/public-entry/config.json',questionHandler=null}={}){
 const data=JSON.parse(fs.readFileSync(path.join(root,'entry-data.json'))),manifest=JSON.parse(fs.readFileSync(path.join(root,'CURRENT.json'))),buckets=new Map(),inflight=new Map(),completed=new Map();
 const config=()=>JSON.parse(fs.readFileSync(configPath));
 const routes=()=>config().personas||[];
 const glossaryPath=path.join(root,'protocols','GLOSSARY.json');
 const officialSources=data.official_sources
  ? {...data.official_sources,glossary_api_url:'https://guanghulab.com/api/ai/v1/glossary'}
  : null;
 const receipt={world_id:data.world_id,release_version:data.version,source_mode:'CURATED_CURRENT_WORLD_PUBLIC_ENTRY',private_brain_included:false,deployment_policy:data.deployment_policy,authorization_granted:false,...(officialSources?{official_sources:officialSources}:{})};
 const allRoutes=['/v1/anchor','/v1/repositories','/v1/nodes','/v1/subjects','/v1/navigation','/v1/lighthouse','/v1/host-skills','/v1/identity-authority','/v1/manifest','/v1/glossary','/v1/rule-bundle','/v1/public-world-release','/v1/public-world-bundle','/v1/host-navigate','/v1/entry','/v1/navigate','/v1/search','/v1/resolve','/v1/status','/v1/ask'];
 async function statusFor(pid){const route=routes().find(x=>x.persona_id===pid);if(!route)return {http:404,value:{error:'PERSONA_ROUTE_NOT_REGISTERED',persona_id:pid,...receipt}};try{const r=await fetch(route.status_url,{signal:AbortSignal.timeout(5000)});if(!r.ok)throw Error();const s=await r.json();if(s.brain_id!==route.brain_id)throw Error();return {http:200,value:{schema:'guanghu.persona-warm-entry/v2',status:'REGISTERED_PERSONA_SERVICE_REACHABLE',whole_body_wake_claimed:false,...publicStatus(route,s),...receipt}};}catch{return {http:503,value:{error:'PERSONA_SOURCE_UNAVAILABLE',persona_id:pid,...receipt}};}}
 const server=http.createServer(async(req,res)=>{try{
  const u=new URL(req.url,'http://localhost');
  if(req.method==='GET'){
   const p=u.pathname;
   if(p==='/'||p==='/index.html'){res.writeHead(200,{'content-type':'text/html; charset=utf-8','cache-control':'no-store','content-security-policy':"default-src 'none'; style-src 'unsafe-inline'; frame-ancestors 'none'"});return res.end('<!doctype html><html lang="zh-CN"><meta charset="utf-8"><title>光湖 · 当前世界入口</title><h1>光湖语言世界</h1><p>人格脑默认在各自用户本地；自有服务器由用户显性选择。软件提供运输和工具。</p><p><a href="v1/manifest">当前发行清单</a> · <a href="'+data.repository_url+'">规则与技能发行仓</a> · <a href="openapi.json">API接口</a></p><p>问脑需要独立授权；公开规则不授予执行权。</p></html>');}
   if(p==='/openapi.json'){const paths={};for(const x of allRoutes)paths[x.slice(3)]={get:{summary:'Current world public metadata'}};delete paths['/ask'].get;paths['/ask'].post={summary:'Authorized read-only persona question',security:[{bearerAuth:[]}],responses:{200:{description:'Verified persona reply'},401:{description:'Authorization required'},429:{description:'Capacity limit'}}};return json(res,200,{openapi:'3.1.0',info:{title:'光湖当前世界与受控问脑接口',version:data.version},servers:[{url:'https://guanghulab.com/api/ai/v1'}],paths,components:{securitySchemes:{bearerAuth:{type:'http',scheme:'bearer'}}}});}
   if(p==='/v1/entry'){const pid=u.searchParams.get('subject');if(!pid)return json(res,200,{schema:'guanghu.neutral-world-entry/v1',state:'EXPLICIT_PERSONA_SELECTION_REQUIRED',default_persona:null,...receipt});const s=await statusFor(pid);return json(res,s.http,s.value);}
   if(p==='/v1/status')return json(res,200,{schema:'guanghu.public-entry-health/v1',state:'PUBLIC_ENTRY_RUNNING',personas:routes().map(r=>({persona_id:r.persona_id,name:r.name,deployment_scope:'OPERATOR_CONFIGURED_OPTIONAL_REMOTE_INSTANCE_NOT_USER_DEFAULT'})),...receipt});
   if(p==='/v1/manifest')return json(res,200,manifest);
   if(p==='/v1/glossary'){
    if(!officialSources||!fs.existsSync(glossaryPath))return json(res,404,{error:'PUBLIC_GLOSSARY_NOT_AVAILABLE',...receipt});
    const glossary=JSON.parse(fs.readFileSync(glossaryPath));
    return json(res,200,{...glossary,release_version:data.version});
   }
   if(p==='/v1/public-world-release'){const file=config().public_world_descriptor;if(!file||!fs.existsSync(file))return json(res,503,{error:'PUBLIC_WORLD_RELEASE_UNAVAILABLE'});return json(res,200,{...JSON.parse(fs.readFileSync(file)),entry_rule_release:manifest.version});}
   if(p==='/v1/public-world-bundle'||p==='/v1/rule-bundle'){const file=p==='/v1/rule-bundle'?path.join(root,'release.zip'):config().public_world_bundle;if(!file||!fs.existsSync(file))return json(res,503,{error:'RELEASE_BUNDLE_NOT_READY'});res.writeHead(200,{'content-type':'application/zip','content-length':fs.statSync(file).size,'cache-control':'public, max-age=30','x-content-type-options':'nosniff'});return fs.createReadStream(file).pipe(res);}
   if(p==='/v1/anchor')return json(res,200,{schema:'guanghu.public-navigation-anchor/v2',anchor_id:'GLW2-CURRENT-PUBLIC-ENTRY-001',default_persona:null,current_repository:data.repository_url,world:data.topology,...receipt});
   if(p==='/v1/repositories')return json(res,200,{schema:'guanghu.repository-route-map/v2',default_repository:'GLW2-PUBLIC-ENTRY',repositories:data.repositories,...receipt});
   if(p==='/v1/host-skills')return json(res,200,{schema:'guanghu.host-skill-navigation-map/v2',primary_host:null,software_grants_authority:false,skill:data.skill_url,host_selection:'CURRENT_NATIVE_TRANSPORT_NOT_DEFAULT_PERSONA',...receipt});
   if(p==='/v1/subjects')return json(res,200,{schema:'guanghu.public-persona-entry-registry/v1',source_registered_persona_count:data.source_registered_persona_count,personas:routes().map(r=>({persona_id:r.persona_id,name:r.name,layer:r.layer,question_access:'OWNER_EXPLICIT_REMOTE_AUTHENTICATED_READ_ONLY',deployment_scope:'OPERATOR_CONFIGURED_OPTIONAL_REMOTE_INSTANCE_NOT_USER_DEFAULT',runtime_wake_claimed:false})),...receipt});
   if(p==='/v1/nodes')return json(res,200,{schema:'guanghu.public-node-map/v2',nodes:[{node_id:'JD-FD-PRIMARY',role:'FIFTH_DOMAIN_SYSTEM_CONTROL_AND_RULE_DISTRIBUTION',persona_brain_default:'USER_LOCAL',zero_core_primary_write_claimed:false}],...receipt});
   if(p==='/v1/identity-authority')return json(res,200,{schema:'guanghu.public-authority-boundary/v1',owner_language:'CURRENT_DIRECT_HUMAN_LANGUAGE_IN_CURRENT_TASK',repository_read_is_execution_authority:false,external_questions_are_human_food:false,brain_external_edit:false,...receipt});
   if(['/v1/navigation','/v1/lighthouse'].includes(p))return json(res,200,{schema:'guanghu.current-world-navigation/v1',topology:data.topology,entry:'https://guanghulab.com/api/ai/v1/manifest',default_question:null,owner_configured_remote_question:'https://guanghulab.com/api/ai/v1/ask',...receipt});
   if(['/v1/navigate','/v1/host-navigate'].includes(p)){const pid=u.searchParams.get('subject');if(pid&&!routes().some(x=>x.persona_id===pid))return json(res,404,{error:'PERSONA_ROUTE_NOT_REGISTERED',...receipt});return json(res,200,{schema:'guanghu.world-transport-route/v1',persona_id:pid||null,selection_required:!pid,default_persona:null,manifest:'https://guanghulab.com/api/ai/v1/manifest',skill:data.skill_url,real_execution_authority:false,...receipt});}
   if(p==='/v1/search'){const q=(u.searchParams.get('q')||'').slice(0,160).toLowerCase();return json(res,200,{results:data.repositories.filter(x=>JSON.stringify(x).toLowerCase().includes(q)),...receipt});}
   if(p==='/v1/resolve'){const id=u.searchParams.get('id'),repo=data.repositories.find(x=>x.code===id);return json(res,repo?200:404,repo?{repository:repo,...receipt}:{error:'NUMBER_NOT_REGISTERED',...receipt});}
   return json(res,404,{error:'ROUTE_NOT_REGISTERED',...receipt});
  }
  if(req.method!=='POST'||u.pathname!=='/v1/ask')return json(res,405,{error:'METHOD_NOT_ALLOWED'},true);
  const cfg=config(),client=authClient(req,cfg);if(!client)return json(res,401,{error:'QUESTION_AUTHORIZATION_REQUIRED'},true);
  const now=Date.now(),b=buckets.get(client.id)||{start:now,count:0};if(now-b.start>=60000){b.start=now;b.count=0;}b.count++;buckets.set(client.id,b);if(b.count>(cfg.requests_per_minute||12)||(inflight.get(client.id)||0)>=(cfg.concurrent_questions||2))return json(res,429,{error:'QUESTION_CAPACITY_LIMIT'},true);
  let raw='';for await(const c of req){raw+=c;if(Buffer.byteLength(raw)>16000)return json(res,413,{error:'QUESTION_BODY_TOO_LARGE'},true);}
  let input;try{input=JSON.parse(raw);}catch{return json(res,400,{error:'JSON_REQUIRED'},true);}
  if(!input||Array.isArray(input)||Object.keys(input).some(k=>!['persona_id','question','tool_host','session_id','request_id'].includes(k))||typeof input.question!=='string'||!input.question.trim()||Buffer.byteLength(input.question)>12000||!['tool_host','session_id','request_id'].every(k=>typeof input[k]==='string'&&/^[-A-Za-z0-9._:]{1,160}$/.test(input[k])))return json(res,400,{error:'EXPLICIT_QUESTION_COORDINATES_REQUIRED'},true);
  if(!client.personas.includes(input.persona_id))return json(res,403,{error:'PERSONA_OUTSIDE_QUESTION_SCOPE'},true);
  const route=cfg.personas.find(x=>x.persona_id===input.persona_id);if(!route)return json(res,404,{error:'PERSONA_ROUTE_NOT_REGISTERED'},true);
  const cacheKey=client.id+':'+input.request_id,inputHash=sha(raw),old=completed.get(cacheKey);if(old){if(old.inputHash!==inputHash)return json(res,409,{error:'REQUEST_ID_CONTENT_MISMATCH'},true);return json(res,200,old.result,true);}
  inflight.set(client.id,(inflight.get(client.id)||0)+1);
  try{const handler=questionHandler||(await import(pathToFileURL(path.join(__dirname,'question.mjs')).href)).askQuestion;const result=await handler(route,input,cfg.fuel);completed.set(cacheKey,{inputHash,result});if(completed.size>1000)completed.delete(completed.keys().next().value);return json(res,200,result,true);}finally{inflight.set(client.id,(inflight.get(client.id)||1)-1);}
 }catch(e){if(!res.headersSent)json(res,503,{error:/^[A-Z_]+$/.test(e.message)?e.message:'QUESTION_SERVICE_UNAVAILABLE',reply_withheld:true,no_execution_authority:true},true);else res.destroy();}});
 server.requestTimeout=60000;server.headersTimeout=10000;return server;
}
function start(){const root=path.resolve(__dirname,'..'),m=JSON.parse(fs.readFileSync(path.join(root,'MANIFEST.json')));for(const x of m.files){if(typeof x.path!=='string'||path.isAbsolute(x.path)||x.path.split('/').includes('..'))throw Error('RELEASE_PATH_INVALID');const f=path.join(root,x.path);if(fs.realpathSync(f)!==f||sha(fs.readFileSync(f))!==x.sha256)throw Error('RELEASE_FILE_HASH_MISMATCH');}createServer({root}).listen(Number(process.env.GUANGHU_AI_PORT||3922),'127.0.0.1',()=>console.log(JSON.stringify({state:'CURRENT_PUBLIC_ENTRY_LISTENING',port:Number(process.env.GUANGHU_AI_PORT||3922)})));}
if(require.main===module)start();module.exports={createServer,start,authClient};
