import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {normalizeOfficialMarkdown,translateOfficialMarkdown} from '../services/official-document.mjs';
import {reviewedTranslations} from '../services/reviewed-doc-translations.mjs';
const folder=new URL('../public/official-docs/',import.meta.url);
await mkdir(folder,{recursive:true});
const catalog=JSON.parse(await readFile(new URL('../public/source-catalog.json',import.meta.url),'utf8'));
const entries=Object.entries(catalog.entries);
let offset=0,completed=0,failed=0;
async function translate(text,language){
 if(!text.trim())return text;
 const url=new URL('https://translate.googleapis.com/translate_a/single');
 for(const [key,value] of Object.entries({client:'gtx',sl:'en',tl:language,dt:'t',q:text}))url.searchParams.set(key,value);
 for(let attempt=0;attempt<4;attempt++){
  try{const response=await fetch(url,{signal:AbortSignal.timeout(30000)});if(!response.ok)throw Error(`Translation HTTP ${response.status}`);return (await response.json())[0].map(part=>part[0]).join('');}
  catch(error){if(attempt===3)throw error;await new Promise(r=>setTimeout(r,(attempt+1)*2000));}
 }
}
async function worker(){while(offset<entries.length){
 const [key,item]=entries[offset++],path=new URL(key+'.json',folder);
 let previous;try{previous=JSON.parse(await readFile(path,'utf8'));}catch{}
 try{
  const response=await fetch(item.documentationUrl.replace(/\/$/,'.md'),{signal:AbortSignal.timeout(30000)});
  if(!response.ok)throw Error(`Documentation HTTP ${response.status}`);
  if(new URL(response.url).hostname!=='docs.cribl.io')throw Error('Unexpected documentation host');
  const raw=await response.text();if(!raw.trim().startsWith('#'))throw Error('Expected official Markdown');
  const en=normalizeOfficialMarkdown(raw,item.documentationUrl);
  const hash=createHash('sha256').update(en).digest('hex');
  let contents=previous?.hash===hash?previous.contents:{en};
  if(process.argv.includes('--translate')) {
    if(!contents.pt) contents.pt=await translateOfficialMarkdown(en,'pt',translate);
    if(!contents.es) contents.es=await translateOfficialMarkdown(en,'es',translate);
  }
  const reviewed=reviewedTranslations[key];
  const translationScope={};
  if(reviewed?.sourceHash===hash) { contents.pt=reviewed.pt;contents.es=reviewed.es;translationScope.pt=translationScope.es=reviewed.scope; }
  await writeFile(path,JSON.stringify({url:item.documentationUrl,checkedAt:new Date().toISOString(),hash,contents,translationScope},null,2)+'\n');
  console.log(`Official documentation ${++completed}/${entries.length}: ${item.label}`);
 }catch(error){
  failed++;console.log(`Documentation unavailable: ${item.label}: ${error.message}`);
  if(!previous?.contents?.en)await writeFile(path,JSON.stringify({url:item.documentationUrl,checkedAt:new Date().toISOString(),error:error.message}));
 }
}}
await Promise.all([worker(),worker(),worker(),worker()]);
console.log(`Official documents: ${completed} available, ${failed} unavailable`);
