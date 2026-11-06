import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
import {normalizeOfficialMarkdown,translateOfficialMarkdown} from '../services/official-document.mjs';
const sample='# Configure {#configure}\n[Settings](settings#auth)\n```json\n[example](do-not-change)\n{"port":9514}\n```\n\n| Field | Value |\n| --- | --- |\n| Port | `9514` |';
const normalized=normalizeOfficialMarkdown(sample,'https://docs.cribl.io/stream/sources-trellix/');
assert.ok(normalized.includes('https://docs.cribl.io/stream/settings#auth'));
assert.ok(normalized.includes('[example](do-not-change)'),'commands in fenced code must remain unchanged');
assert.ok(!normalized.includes('{#configure}'));
const translated=await translateOfficialMarkdown(normalized,'pt',async text=>text.replace('Configure','Configurar'));
assert.ok(translated.includes('{"port":9514}'));assert.ok(translated.includes('`9514`'));
const compiled=ts.transpileModule(readFileSync(new URL('../services/formatter.ts',import.meta.url),'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText;
const ctx=vm.createContext({exports:{}});vm.runInContext(compiled,ctx);
const html=ctx.exports.formatContent(normalized);
assert.ok(html.includes('<h2'));assert.ok(html.includes('<table'));assert.ok(html.includes('<code>'));assert.ok(html.includes('9514'));
assert.ok(!ctx.exports.formatContent('```html\n<script>alert(1)</script>\n```').includes('<script>'));
const catalog=JSON.parse(readFileSync(new URL('../public/source-catalog.json',import.meta.url),'utf8'));
for(const key of Object.keys(catalog.entries)) {
 const document=JSON.parse(readFileSync(new URL(`../public/official-docs/${key}.json`,import.meta.url),'utf8'));
 assert.ok(document.contents?.en,`Missing official page: ${key}`);
 assert.ok(!document.contents.en.includes('This is a configuration checklist, not a complete POV runbook.'));
}
const trellix=JSON.parse(readFileSync(new URL('../public/official-docs/official_sources_trellix.json',import.meta.url),'utf8'));
assert.ok(trellix.contents.en.includes('## Configure a Trellix Source'));
for(const lang of ['pt','es']) {
 assert.ok(trellix.contents[lang].includes('Auth Tokens'));
 assert.ok(trellix.contents[lang].includes('/services/collector/event'));
 assert.ok(trellix.contents[lang].includes('Commit & Deploy'));
 assert.equal(trellix.translationScope[lang],'configuration');
}
console.log('PASS: 162 real official pages, Trellix configuration translations, headings/tables/code rendering and safety');
