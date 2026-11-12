import test from 'node:test';import assert from 'node:assert/strict';import {questionTarget} from '../scripts/question-target.mjs';
test('no configuration never implies a public persona endpoint',()=>{assert.throws(()=>questionTarget(),/LOCAL_PERSONA_SERVICE_NOT_CONFIGURED/);});
test('local service requires literal loopback and refuses credentials in URL',()=>{
 assert.equal(questionTarget({localUrl:'http://127.0.0.1:31313/v1/ask'}).remote,false);
 assert.equal(questionTarget({localUrl:'http://[::1]:31313/v1/ask'}).remote,false);
 for(const localUrl of ['https://guanghulab.com/api/ai/v1/ask','http://192.168.1.1/v1/ask','http://user:secret@127.0.0.1/v1/ask','http://127.0.0.1/v1/ask?token=secret'])assert.throws(()=>questionTarget({localUrl}));
});
test('remote service must be explicit, secure, and cannot silently replace local',()=>{
 assert.equal(questionTarget({remoteUrl:'https://owner.example/v1/ask'}).remote,true);
 assert.equal(questionTarget({remoteUrl:'https://guanghulab.com/api/ai/v1/ask'}).remote,true);
 assert.throws(()=>questionTarget({remoteUrl:'http://owner.example/v1/ask'}),/EXPLICIT_REMOTE_HTTPS_REQUIRED/);
 assert.throws(()=>questionTarget({remoteUrl:'https://owner.example/v1/ask',localUrl:'http://127.0.0.1/v1/ask'}),/QUESTION_TARGET_CONFLICT/);
});
