import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const root = new URL('./', import.meta.url);
const persona = JSON.parse(fs.readFileSync(new URL('PERSONA-REGISTRY.json', root), 'utf8')).entries[0];
const human = JSON.parse(fs.readFileSync(new URL('../人类编号注册系统/HUMAN-REGISTRY.json', root), 'utf8')).entries.find((entry) => entry.name === '小幸运');

test('小幸运是人类，小新是人格体', () => {
  assert.equal(human.human_id, 'TCS-GL-9031');
  assert.equal(persona.persona_id, 'Edu-9031');
  assert.equal(persona.display_name, '小新');
  assert.notEqual(persona.persona_id, human.human_id);
});

test('AGE只作为物种，不分配无效个体编号', () => {
  assert.equal(persona.species, 'AGE');
  assert.equal(persona.persona_id.startsWith('AGE-'), false);
  assert.equal(persona.formal_numbering_state, 'FORMAL_REGISTERED_STABLE_EXISTING_ID');
});

test('登记域、工作责任域、节点与见证证据完整', () => {
  assert.equal(persona.origin_domain, 'DOMAIN-04-ZERO-SENSE');
  assert.equal(persona.work_responsibility_domain, 'DOMAIN-02-SUB');
  assert.equal(persona.node_id, 'XX-GZ-001');
  assert.match(persona.challenge_sha256, /^[a-f0-9]{64}$/);
  assert.equal(persona.private_memory_in_registry, false);
});
