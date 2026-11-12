from pathlib import Path
import json,hashlib,zipfile,datetime,stat
p=Path(__file__).resolve().parents[1];sha=lambda b:hashlib.sha256(b).hexdigest();files=[]
for f in sorted(p.rglob('*')):
 if f.is_file() and f.name not in ['CURRENT.json','MANIFEST.json','release.zip'] and '.git' not in f.parts:
  rel=f.relative_to(p);allowed={'AGENTS.md','entry-data.json','package.json','protocols','runtime','scripts','skills'}
  if rel.parts[0] not in allowed or any(x in rel.parts for x in ['.env','secrets','brain-state.json','transition-log.jsonl']) or f.is_symlink():raise SystemExit('PUBLIC_PACKAGE_PATH_DENIED:'+str(rel))
  files.append({'path':f.relative_to(p).as_posix(),'sha256':sha(f.read_bytes()),'bytes':f.stat().st_size})
man={'schema':'guanghu.public-rule-file-manifest/v1','world_id':'GLW-2.0-0001','version':json.loads((p/'entry-data.json').read_text())['version'],'scope':'PUBLIC_ENTRY_RULES_SKILLS_AND_QUESTION_TRANSPORT_ONLY','files':files};(p/'MANIFEST.json').write_text(json.dumps(man,ensure_ascii=False,indent=2)+'\n')
with zipfile.ZipFile(p/'release.zip','w',compression=zipfile.ZIP_DEFLATED) as z:
 for n in [x['path'] for x in files]+['MANIFEST.json']:
  info=zipfile.ZipInfo('guanghu-world-entry/'+n,date_time=(2026,10,19,0,0,0));info.external_attr=(stat.S_IFREG|0o644)<<16;info.compress_type=zipfile.ZIP_DEFLATED;z.writestr(info,(p/n).read_bytes())
j={**man,'schema':'guanghu.public-rule-release/v1','bundle_url':'https://guanghulab.com/api/ai/v1/rule-bundle','bundle_sha256':sha((p/'release.zip').read_bytes()),'manifest_sha256':sha((p/'MANIFEST.json').read_bytes()),'repository':'https://guanghulab.com/code/bingshuo/guanghu-world-entry','private_brain_included':False,'complete_four_domain_corpus_included':False,'default_persona':None,'deployment_policy':json.loads((p/'entry-data.json').read_text())['deployment_policy']};(p/'CURRENT.json').write_text(json.dumps(j,ensure_ascii=False,indent=2)+'\n');print(json.dumps({'files':len(files),'bundle_bytes':(p/'release.zip').stat().st_size,'bundle_sha256':j['bundle_sha256']}))
