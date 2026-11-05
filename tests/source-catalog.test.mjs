import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import ts from 'typescript';
import {parseSourceCatalog,buildSourceCatalog} from '../services/source-catalog.mjs';
const fixture=`# Sources Overview
### Collector Sources
- [Database](collectors-database)
For background and instructions:
- [High-availability](collectors-ha)
### Push Sources {#push}
- [Syslog](sources-syslog) (TCP or UDP)
#### Comparison
- [Do not include](sources-other)
### Pull Sources
- [Kafka](sources-kafka) (TCP)
- [OpenAI](sources-openai) (HTTPS only) - requires active Leader for job management
### System Sources
- [Exec](sources-exec) (on-prem only)
### Internal Sources
- [Cribl HTTP](sources-cribl-http) (HTTP/S)
## Preconfigured Sources
- [Syslog](sources-syslog) - Port 9514`;
const parsed=parseSourceCatalog(fixture);
assert.equal(parsed.length,6);
assert.ok(!parsed.some(p=>p.slug==='collectors-ha'||p.slug==='sources-other'));
assert.throws(()=>parseSourceCatalog('# Invalid response'));
const built=buildSourceCatalog(fixture,'2026-11-05T00:00:00Z');
assert.equal(built.entries.official_collectors_database.category,'CRIBL COLLECTOR CONFIGS');
const openai=built.entries.official_sources_openai;
for(const lang of ['pt','es']) assert.ok(built.translations[JSON.stringify([lang,openai.content])].includes('Leader'));
const live=JSON.parse(readFileSync(new URL('../public/source-catalog.json',import.meta.url),'utf8'));
assert.ok(Object.values(live.entries).filter(e=>e.sourceKind!=='collector').length>=74);
assert.ok(Object.values(live.entries).filter(e=>e.sourceKind==='collector').length>=10);
for(const item of Object.values(live.entries)) {
  assert.ok(item.documentationUrl.startsWith('https://docs.cribl.io/stream/'));
  for(const lang of ['pt','es']) for(const field of ['title','content']) assert.ok(live.translations[JSON.stringify([lang,item[field]])]);
}
const compiled=ts.transpileModule(readFileSync(new URL('../services/library.ts',import.meta.url),'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText;
const ctx=vm.createContext({exports:{},console});vm.runInContext(compiled,ctx);
const values=new Map(),storage={getItem:k=>values.get(k)??null,setItem:(k,v)=>values.set(k,v)};
const custom={category:'CRIBL SOURCE CONFIGS',label:'Syslog POV',title:'Customer Syslog',content:'https://docs.cribl.io/edge/sources-syslog/'};
const compliance={...custom,content:'https://docs.cribl.io/stream/sources-openai-compliance/'};
let merged=ctx.exports.syncOfficialCatalog(storage,{custom,compliance},built.entries);
assert.ok(!merged.official_sources_syslog,'existing source runbooks must not be duplicated');
assert.ok(merged.official_sources_openai,'similar URL prefixes must not hide distinct Sources');
const kafka=merged.official_sources_kafka;
delete merged.official_sources_kafka;
merged.official_sources_openai={...merged.official_sources_openai,content:'Customer edited instructions'};
const next={...built.entries,official_sources_openai:{...openai,content:'Updated official instructions'}};
merged=ctx.exports.syncOfficialCatalog(storage,merged,next);
assert.ok(!merged.official_sources_kafka,'deleted entries must not return');
assert.equal(merged.official_sources_openai.content,'Customer edited instructions');
const added={...kafka,title:'New Source',documentationUrl:'https://docs.cribl.io/stream/sources-new/'};
merged=ctx.exports.syncOfficialCatalog(storage,merged,{...next,official_sources_new:added});
assert.ok(merged.official_sources_new,'future additions must reach existing sessions');
console.log('PASS: 74 Sources and 10 Collectors, translations, parser boundaries, incremental additions, edit/deletion preservation');
