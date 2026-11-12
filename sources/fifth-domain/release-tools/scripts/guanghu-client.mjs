#!/usr/bin/env node
// HOST_NEUTRAL_TRANSPORT: verifies released files, reads status or asks with independent user credentials.
import {spawnSync} from 'node:child_process';import fs from 'node:fs';import path from 'node:path';import crypto from 'node:crypto';import {fileURLToPath} from 'node:url';
import {questionTarget} from './question-target.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..'),sha=x=>crypto.createHash('sha256').update(x).digest('hex'),manifest=JSON.parse(fs.readFileSync(path.join(root,'MANIFEST.json')));
const fail=c=>{throw Error(c)};
for(const x of manifest.files){if(path.isAbsolute(x.path)||x.path.split('/').includes('..'))fail('RELEASE_PATH_INVALID');const p=path.join(root,x.path);if(fs.realpathSync(p)!==p||!fs.statSync(p).isFile()||sha(fs.readFileSync(p))!==x.sha256)fail('RELEASE_FILE_HASH_MISMATCH');}
const args=process.argv.slice(2),cmd=args.shift()||'status',flag=k=>{const n=args.indexOf(k);if(n<0)return null;const v=args[n+1];if(!v)fail('ARGUMENT_REQUIRED');args.splice(n,2);return v;};
try{
 if(cmd==='verify'){console.log(JSON.stringify({state:'PUBLIC_RELEASE_FILES_VERIFIED',version:manifest.version,files:manifest.files.length}));}
 else if(cmd==='rules-status'){if(args.length)fail('ARGUMENT_NOT_SUPPORTED');const r=await fetch('https://guanghulab.com/api/ai/v1/status',{redirect:'error',signal:AbortSignal.timeout(10000)});console.log(JSON.stringify(await r.json(),null,2));if(!r.ok)process.exitCode=2;}
 else if(cmd==='status'){const localUrl=flag('--local-url'),remoteUrl=flag('--remote-url');if(args.length)fail('ARGUMENT_NOT_SUPPORTED');const t=questionTarget({localUrl:localUrl||(!remoteUrl?process.env.GUANGHU_LOCAL_ASK_URL:null),remoteUrl});const u=new URL(t.url);u.pathname=u.pathname.slice(0,-3)+'status';const r=await fetch(u,{redirect:'error',signal:AbortSignal.timeout(10000)});console.log(JSON.stringify(await r.json(),null,2));if(!r.ok)process.exitCode=2;}
 else if(cmd==='ask'){
  const persona=flag('--persona'),host=flag('--host'),session=flag('--session'),file=flag('--question-file');if(!persona||!host||!session||!file)fail('EXPLICIT_PERSONA_HOST_SESSION_AND_QUESTION_REQUIRED');
  const localUrl=flag('--local-url'),remoteUrl=flag('--remote-url');if(args.length)fail('ARGUMENT_NOT_SUPPORTED');const target=questionTarget({localUrl:localUrl||(!remoteUrl?process.env.GUANGHU_LOCAL_ASK_URL:null),remoteUrl});
  let token=target.remote?process.env.GUANGHU_ASK_TOKEN:process.env.GUANGHU_LOCAL_ASK_TOKEN;
  if(!token&&target.remote&&target.url==='https://guanghulab.com/api/ai/v1/ask'&&process.platform==='darwin'){const r=spawnSync('/usr/bin/security',['find-generic-password','-s','guanghu-persona-question','-a','owner','-w'],{encoding:'utf8',timeout:3000});if(r.status===0)token=r.stdout.trim();}
  if(target.remote&&!token)fail('PRIVATE_QUESTION_CREDENTIAL_REQUIRED');const question=fs.readFileSync(file,'utf8');const body={persona_id:persona,tool_host:host,session_id:session,request_id:crypto.randomUUID(),question};
  const r=await fetch(target.url,{method:'POST',redirect:'error',headers:{'content-type':'application/json',...(token?{authorization:'Bearer '+token}:{})},body:JSON.stringify(body),signal:AbortSignal.timeout(55000)});const reply=await r.json();if(r.ok&&reply.persona_id!==persona)fail('PERSONA_REPLY_IDENTITY_MISMATCH');console.log(JSON.stringify(reply,null,2));if(!r.ok)process.exitCode=2;
 }else fail('COMMAND_NOT_SUPPORTED');
}catch(e){console.log(JSON.stringify({state:'QUESTION_OR_RELEASE_UNAVAILABLE',code:/^[A-Z_]+$/.test(e.message)?e.message:'TRANSPORT_FAILED',no_execution_authority:true}));process.exitCode=2;}
