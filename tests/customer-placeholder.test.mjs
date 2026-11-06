import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
const source=readFileSync(new URL('../services/formatter.ts',import.meta.url),'utf8');
const context=vm.createContext({exports:{}});
vm.runInContext(ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText,context);
const {replaceCustomerPlaceholder,formatCustomerContent}=context.exports;
const library=JSON.parse(readFileSync(new URL('../default-library.json',import.meta.url),'utf8'));
const title=library.item_1765040147287.title;
for(const lang of ['en','pt','es']){
 const translations=lang==='en'?{}:JSON.parse(readFileSync(new URL(`../default-translations-${lang}.json`,import.meta.url),'utf8'));
 const translated=translations[JSON.stringify([lang,title])]||title;
 assert.ok(translated.includes('[CUSTOMER]'));
 const personalized=replaceCustomerPlaceholder(translated,'  Banco do Brasil  ');
 assert.ok(personalized.endsWith('Banco do Brasil'));
 assert.ok(!personalized.includes('[CUSTOMER]'));
 assert.equal(replaceCustomerPlaceholder(translated,'EMS'),translated.replace('[CUSTOMER]','EMS'));
 assert.ok(translated.includes('[CUSTOMER]'),'Keep translation keys and templates unchanged');
 for(const item of Object.values(library))for(const field of ['title','content']) {
  const original=item[field];
  const localized=translations[JSON.stringify([lang,original])]||original;
  if(!localized.includes('[CUSTOMER'))continue;
  assert.ok(!/\[CUSTOMER\b/.test(replaceCustomerPlaceholder(localized,'Banco do Brasil')),`Unresolved ${lang} ${field}: ${item.label}`);
  assert.ok(!/\[CUSTOMER\b/.test(formatCustomerContent(localized,'Banco do Brasil')),`Unresolved HTML ${lang} ${field}: ${item.label}`);
 }
}
assert.equal(replaceCustomerPlaceholder('Implantar [CUSTOMER + CRIBL]','EMS'),'Implantar EMS + CRIBL');
assert.equal(replaceCustomerPlaceholder('Configurar [CUSTOMER & CRIBL]','EMS'),'Configurar EMS & CRIBL');
assert.equal(replaceCustomerPlaceholder('[CUSTOMER+CRIBL] / [CUSTOMER&CRIBL]','A $&'), 'A $&+CRIBL / A $&&CRIBL');
assert.ok(formatCustomerContent('Configurar [CUSTOMER & CRIBL]','A&B').includes('Configurar A&amp;B &amp; CRIBL'));
assert.equal(replaceCustomerPlaceholder('[CUSTOMER + CRIBL]',''), '[CUSTOMER + CRIBL]');
assert.equal(replaceCustomerPlaceholder('[CUSTOMER] / [CUSTOMER]','A $& $1'), 'A $& $1 / A $& $1');
assert.equal(replaceCustomerPlaceholder('[CUSTOMER] [LEADER]','Acme'),'Acme [LEADER]');
assert.equal(replaceCustomerPlaceholder('[CUSTOMER]','   '),'[CUSTOMER]');
const markup='# Setup [CUSTOMER]\n- [ ] Invite [CUSTOMER]\n\nTABLE:\nCustomer,Task\n[CUSTOMER],Test\n\nCODE:\necho [CUSTOMER]\nCODE:';
const html=formatCustomerContent(markup,'A&B <img src=x onerror=alert(1)> **Bank** $&');
assert.ok(!html.includes('[CUSTOMER]'));
assert.ok(html.includes('A&amp;B &lt;img'));
assert.ok(!html.includes('<img'));
assert.ok(!html.includes('<strong>Bank</strong>'),'Do not interpret customer name as Markdown');
assert.ok(html.includes('**Bank** $&'));
const app=readFileSync(new URL('../App.tsx',import.meta.url),'utf8');
assert.ok(app.includes('customerText(allContent[k].title)'));
assert.ok(app.includes('formatCustomerContent(t(contentFor(k)), povInfo.customerName)'));
assert.ok(app.includes('contentElement.cloneNode(true)'), 'Word export must reuse personalized preview');
console.log('PASS: all library customer placeholder variants in EN/PT-BR/ES, joint ownership, HTML encoding, literal names and shared export preview');
