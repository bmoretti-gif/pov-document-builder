import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const original=JSON.parse(readFileSync(new URL('../default-library.json',import.meta.url),'utf8'));
const translations=JSON.parse(readFileSync(new URL('../default-translations-pt.json',import.meta.url),'utf8'));
for(const item of Object.values(original)) {
 for(const field of ['title','content']) {
  const source=item[field],translated=translations[JSON.stringify(['pt',source])];
  assert.equal(typeof translated,'string',`Missing Portuguese ${field}: ${item.title}`);
  assert.ok(translated.trim());
  assert.ok(!translated.includes('POVTOKEN'),'Protected placeholders must be restored');
  for(const token of source.match(/`[^`]*`|(?:https?:\/\/|docs\.cribl\.io\/)[^\s)]+|\[[A-Z][A-Z_ +&-]*\]/g)??[]) assert.ok(translated.includes(token),`Technical token changed: ${token}`);
 }
}
const first=Object.values(original)[0];
assert.ok(translations[JSON.stringify(['pt',first.title])].includes('organização'));
assert.notEqual(translations[JSON.stringify(['pt',first.content])],first.content);
console.log('PASS: all 66 Portuguese snippets available, technical tokens preserved, no browser translation needed');
