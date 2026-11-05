import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
import {officialUrl,criblDocsPlugin} from '../services/cribl-docs.mjs';
const compiled=ts.transpileModule(readFileSync(new URL('../services/languages.ts',import.meta.url),'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText;
const context=vm.createContext({exports:{}});vm.runInContext(compiled,context);
const {documentLabel,translationKey,translateMarkup}=context.exports;
assert.equal(documentLabel('Source','pt'),'Origem');assert.equal(documentLabel('Source','es'),'Origen');
assert.notEqual(translationKey('text','pt'),translationKey('text','es'));
const markup='- Check `tcp:9997` at https://docs.cribl.io/stream/\nCODE:\ncurl -X POST\nCODE:\nTABLE:\nsource,destination,port\na,b,443';
const translated=await translateMarkup(markup,async text=>text.replace('Check','Verifique'));
assert.ok(translated.includes('`tcp:9997`'));assert.ok(translated.includes('curl -X POST'));assert.ok(translated.includes('a,b,443'));
await assert.rejects(translateMarkup('Use `command`',async()=> 'lost token'));
for(const url of ['http://docs.cribl.io/a','https://evil.example/a','https://docs.cribl.io@evil.example/a','https://docs.cribl.io:444/a']) assert.throws(()=>officialUrl(url));
assert.equal(officialUrl('https://docs.cribl.io/stream/#x'),'https://docs.cribl.io/stream/');
let handler;criblDocsPlugin().configureServer({middlewares:{use:(_path,fn)=>handler=fn}});
const originalFetch=globalThis.fetch;let calls=0;
globalThis.fetch=async()=>{calls++;return {ok:true,text:async()=> '# Current documentation'};};
try {
 for(let i=0;i<2;i++) {
  const req={method:'POST',async *[Symbol.asyncIterator](){yield JSON.stringify({urls:['https://docs.cribl.io/stream/']});}};
  const res={setHeader(){},end(body){const data=JSON.parse(body);assert.ok(data.checkedAt);assert.equal(data.pages.length,2);}};
  await handler(req,res);
 }
 assert.equal(calls,6,'each check must fetch fresh documentation');
} finally {globalThis.fetch=originalFetch;}
console.log('PASS: language selection, technical preservation, official URL validation, fresh documentation checks');

let requestedLanguage;
context.Translator={create:async options=>{requestedLanguage=options.targetLanguage;return {translate:async text=>'Traduzido: '+text,destroy(){}};}};
const translator=await context.exports.createLocalTranslator('pt');
assert.equal(requestedLanguage,'pt');
assert.equal(await translator.translate('Selected content'),'Traduzido: Selected content');
await context.exports.createLocalTranslator('es');assert.equal(requestedLanguage,'es');
