import assert from 'node:assert/strict';
import {loadDocsSnapshot} from '../services/docs-client.mjs';
let requested;
const data={checkedAt:'2026-11-05T12:00:00Z',pages:[{url:'https://docs.cribl.io/stream/',content:'Requirements'}]};
assert.deepEqual(await loadDocsSnapshot('/pov-document-builder/',async(url,options)=>{requested=url;assert.equal(options.cache,'no-store');return {ok:true,json:async()=>data};}),data);
assert.equal(requested,'/pov-document-builder/cribl-docs-snapshot.json');
await assert.rejects(loadDocsSnapshot('/',async()=>({ok:false})));
await assert.rejects(loadDocsSnapshot('/',async()=>({ok:true,json:async()=>({})})));
console.log('PASS: Pages subpath, documentation snapshot loading and failure handling');
