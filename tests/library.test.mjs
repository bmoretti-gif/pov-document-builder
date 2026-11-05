import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import ts from 'typescript';
const defaults = JSON.parse(readFileSync(new URL('../default-library.json', import.meta.url), 'utf8'));
assert.equal(Object.keys(defaults).length,66);
for (const item of Object.values(defaults)) {
  for (const field of ['category','label','title','content']) assert.equal(typeof item[field],'string');
}
const compiled = ts.transpileModule(readFileSync(new URL('../services/library.ts', import.meta.url),'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText;
const ctx=vm.createContext({exports:{},console});
vm.runInContext(compiled,ctx);
const load=ctx.exports.loadLibrary;
const values = new Map();
const storage={getItem:k=>values.get(k)??null,setItem:(k,v)=>values.set(k,v)};
assert.equal(Object.keys(load(storage,defaults)).length,66);
const key=Object.keys(defaults)[0];
const saved=JSON.parse(values.get('cribl_library_v6'));
delete saved[key];
values.set('cribl_library_v6',JSON.stringify(saved));
assert.ok(!(key in load(storage,defaults)),'deleted items must not return');
values.clear();
values.set('cribl_library_v6',JSON.stringify({[key]:{...defaults[key],title:'My edited title'},custom:defaults[key]}));
const merged=load(storage,defaults);
assert.equal(merged[key].title,'My edited title');
assert.ok(merged.custom);
console.log('PASS: 66 library items, existing edits preserved, one-time seed and deletions preserved.');
