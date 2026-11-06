import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
import {parseDestinationCatalog,buildDestinationCatalog} from '../services/destination-catalog.mjs';
const fixture=`# Destinations
## Destination Categories
| [Ignore](destinations-other) | TCP | Streaming
## Available Destinations
| Destination | Protocol | Streaming | Filesystem-Based | Load-Balanced
| --- | --- | --- | --- | --- |
| [Amazon S3 Compatible Stores](destinations-s3) | HTTP/S | Non-streaming | ✓ |
| [Splunk HEC](destinations-splunk-hec) | HTTP/S | Streaming | | ✓
| [Amazon SQS](sources-sqs) | HTTP/S | Streaming
| [Azure Data Explorer](destinations-azure-data-explorer) | HTTPS only | Streaming or non-streaming
| [Syslog](destinations-syslog) | TCP or UDP | Streaming | | ✓ (TCP only)
### Internal Destinations
- [Default](destinations-default): Default output.
- **SpaceOut**: Experimental and undocumented.
## Byte Calculations
| [Do not include](destinations-extra) | TCP | Streaming`;
const parsed=parseDestinationCatalog(fixture);
assert.equal(parsed.length,6);
assert.equal(parsed.find(d=>d.name==='Amazon SQS').url,'https://docs.cribl.io/stream/destinations-sqs/');
assert.equal(parsed.find(d=>d.slug==='destinations-syslog').loadBalanced,'✓ (TCP only)');
assert.equal(parsed.find(d=>d.slug==='destinations-default').kind,'internal-destination');
assert.ok(!parsed.some(d=>d.name==='SpaceOut'||d.slug==='destinations-extra'));
assert.throws(()=>parseDestinationCatalog('invalid index'));
const catalog=buildDestinationCatalog(fixture);
const splunk=catalog.entries.official_destinations_splunk_hec;
assert.ok(splunk.content.includes('Load-balanced: ✓'));
assert.ok(splunk.content.includes('Filesystem-based: Not marked'));
const live=JSON.parse(readFileSync(new URL('../public/source-catalog.json',import.meta.url),'utf8'));
const destinations=Object.values(live.entries).filter(e=>e.category==='CRIBL DESTINATION CONFIGS');
assert.ok(destinations.length>=78);
assert.equal(destinations.filter(e=>e.sourceKind==='internal-destination').length,6);
for(const item of destinations) {
 assert.ok(item.documentationUrl.includes('/destinations-'));
 for(const lang of ['pt','es']) for(const field of ['title','content']) assert.ok(live.translations[JSON.stringify([lang,item[field]])]);
}
const compiled=ts.transpileModule(readFileSync(new URL('../services/library.ts',import.meta.url),'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText;
const ctx=vm.createContext({exports:{},console});vm.runInContext(compiled,ctx);
const values=new Map(),storage={getItem:k=>values.get(k)??null,setItem:(k,v)=>values.set(k,v)};
const runbook={...splunk,title:'Customer Splunk runbook',content:'https://docs.cribl.io/stream/destinations-splunk-hec/'};
let merged=ctx.exports.syncOfficialCatalog(storage,{runbook},catalog.entries);
assert.ok(!merged.official_destinations_splunk_hec,'existing Destination runbooks must not be duplicated');
delete merged.official_destinations_s3;
merged.official_destinations_sqs={...merged.official_destinations_sqs,content:'Customer edits'};
merged=ctx.exports.syncOfficialCatalog(storage,merged,catalog.entries);
assert.ok(!merged.official_destinations_s3);
assert.equal(merged.official_destinations_sqs.content,'Customer edits');
console.log('PASS: 78 Destinations, delivery attributes, SQS correction, translations, runbook deduplication and edit/deletion preservation');
