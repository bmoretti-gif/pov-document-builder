import {mkdir,writeFile} from 'node:fs/promises';
import {buildSourceCatalog} from '../services/source-catalog.mjs';
const response=await fetch('https://docs.cribl.io/stream/sources.md',{signal:AbortSignal.timeout(30000),redirect:'error'});
if(!response.ok) throw new Error(`Official Sources HTTP ${response.status}`);
const catalog=buildSourceCatalog(await response.text());
await mkdir(new URL('../public/',import.meta.url),{recursive:true});
await writeFile(new URL('../public/source-catalog.json',import.meta.url),JSON.stringify(catalog,null,2)+'\n');
console.log(`Official catalog: ${Object.values(catalog.entries).filter(e=>e.sourceKind!=='collector').length} Sources, ${Object.values(catalog.entries).filter(e=>e.sourceKind==='collector').length} Collectors (${catalog.checkedAt})`);
