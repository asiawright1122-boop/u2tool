const fs = require('fs');
const en = JSON.parse(fs.readFileSync('src/messages/en.json', 'utf8'));
const slugs = [
  'api-tester', 'area-chart-generator', 'changelog-generator',
  'color-contrast-checker', 'data-uri', 'email-signature-generator',
  'gauge-chart-generator', 'json-to-form', 'json-to-proto',
  'json-to-table', 'json-to-zod', 'password-generator',
  'sri-hash-generator', 'tsconfig-generator', 'typescript-to-json',
  'unit-converter', 'xml-validator', 'yaml-validator'
];
for (const slug of slugs) {
  const tool = en.tools[slug];
  if (!tool) { console.log(`\n=== ${slug}: NOT FOUND ===`); continue; }
  // Show only non-standard keys (not name/description/seo/usage)
  const skip = ['name','description','seo_title','seo_description','detailed_description','usage_steps','usage_examples'];
  const keys = Object.keys(tool).filter(k => !skip.includes(k));
  console.log(`\n=== ${slug} ===`);
  for (const k of keys) {
    const v = tool[k];
    if (typeof v === 'string') console.log(`  ${k}: "${v.substring(0,60)}"`);
    else if (typeof v === 'object') console.log(`  ${k}: ${JSON.stringify(v).substring(0,100)}`);
  }
}
