/* eslint-disable @typescript-eslint/no-require-imports */
const en = require('../src/messages/en.json');
const zh = require('../src/messages/zh.json');
const es = require('../src/messages/es.json');
const pt = require('../src/messages/pt.json');
const ja = require('../src/messages/ja.json');

const enToolKeys = Object.keys(en.tool || {});
const zhToolKeys = Object.keys(zh.tool || {});
const esToolKeys = Object.keys(es.tool || {});
const ptToolKeys = Object.keys(pt.tool || {});
const jaToolKeys = Object.keys(ja.tool || {});

console.log('EN tools:', enToolKeys.length);
console.log('ZH tools:', zhToolKeys.length);
console.log('ES tools:', esToolKeys.length);
console.log('PT tools:', ptToolKeys.length);
console.log('JA tools:', jaToolKeys.length);

const missingInZh = enToolKeys.filter(k => !zhToolKeys.includes(k));
const missingInEs = enToolKeys.filter(k => !esToolKeys.includes(k));
const missingInPt = enToolKeys.filter(k => !ptToolKeys.includes(k));
const missingInJa = enToolKeys.filter(k => !jaToolKeys.includes(k));

if (missingInZh.length) console.log('Missing in ZH:', missingInZh);
if (missingInEs.length) console.log('Missing in ES:', missingInEs);
if (missingInPt.length) console.log('Missing in PT:', missingInPt);
if (missingInJa.length) console.log('Missing in JA:', missingInJa);

// Check tools namespace
const enToolsKeys = Object.keys(en.tools || {});
const zhToolsKeys = Object.keys(zh.tools || {});
const esToolsKeys = Object.keys(es.tools || {});
const ptToolsKeys = Object.keys(pt.tools || {});
const jaToolsKeys = Object.keys(ja.tools || {});

console.log('\nEN tools namespace:', enToolsKeys.length);
console.log('ZH tools namespace:', zhToolsKeys.length);
console.log('ES tools namespace:', esToolsKeys.length);
console.log('PT tools namespace:', ptToolsKeys.length);
console.log('JA tools namespace:', jaToolsKeys.length);

const missingToolsInZh = enToolsKeys.filter(k => !zhToolsKeys.includes(k));
const missingToolsInEs = enToolsKeys.filter(k => !esToolsKeys.includes(k));
const missingToolsInPt = enToolsKeys.filter(k => !ptToolsKeys.includes(k));
const missingToolsInJa = enToolsKeys.filter(k => !jaToolsKeys.includes(k));

if (missingToolsInZh.length) console.log('Missing tools in ZH:', missingToolsInZh);
if (missingToolsInEs.length) console.log('Missing tools in ES:', missingToolsInEs);
if (missingToolsInPt.length) console.log('Missing tools in PT:', missingToolsInPt);
if (missingToolsInJa.length) console.log('Missing tools in JA:', missingToolsInJa);
