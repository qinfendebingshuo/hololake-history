// Mechanical transport policy: private persona services are local by default.
export function questionTarget({localUrl,remoteUrl}={}) {
 if(localUrl&&remoteUrl)throw Error('QUESTION_TARGET_CONFLICT');
 if(!localUrl&&!remoteUrl)throw Error('LOCAL_PERSONA_SERVICE_NOT_CONFIGURED');
 let u;try{u=new URL(remoteUrl||localUrl);}catch{throw Error('QUESTION_TARGET_INVALID');}
 if(u.username||u.password||u.hash||u.search||!u.pathname.endsWith('/v1/ask'))throw Error('QUESTION_TARGET_INVALID');
 const loopback=['127.0.0.1','[::1]'].includes(u.hostname);
 if(remoteUrl){if(u.protocol!=='https:'||loopback)throw Error('EXPLICIT_REMOTE_HTTPS_REQUIRED');}
 else if(!loopback||!['http:','https:'].includes(u.protocol))throw Error('LOCAL_LOOPBACK_REQUIRED');
 return {url:u.href,remote:!!remoteUrl,origin:u.origin};
}
