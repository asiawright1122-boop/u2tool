const fs = require('fs');
const path = require('path');

const en = JSON.parse(fs.readFileSync('src/messages/en.json', 'utf8'));
const toolDir = 'src/components/tools';
const files = fs.readdirSync(toolDir).filter(f => f.endsWith('.svelte') && !['ToolWrapper.svelte', 'ToolsGrid.svelte'].includes(f));

// False positive patterns - these are not translation calls
const falsePositives = new Set(['a', 'T', 'div', 'canvas', 'json', 'html2pdf.js', 'gif.js', 'jspdf', 'exifreader', 'png', 'svg', 'none']);

let mismatchCount = 0;
let totalWithCustomT = 0;
const mismatches = [];

for (const file of files) {
  const content = fs.readFileSync(path.join(toolDir, file), 'utf8');
  
  // Only check components with custom t() that produces MISSING
  const slugMatch = content.match(/MISSING: tools\.([a-z0-9-]+)\./);
  if (!slugMatch) continue;
  
  totalWithCustomT++;
  const slug = slugMatch[1];
  const toolTrans = en.tools && en.tools[slug];
  if (!toolTrans || typeof toolTrans !== 'object') {
    mismatchCount++;
    mismatches.push({ file, slug, missing: ['ENTIRE TOOL MISSING'] });
    continue;
  }
  
  // Extract t('key') calls - only from translation function context
  // Look for patterns like {t('key')} or t('key') in template/script
  const tCallRegex = /\bt\('([a-zA-Z][a-zA-Z0-9_.]*?)'\)/g;
  const tCalls = [];
  let match;
  while ((match = tCallRegex.exec(content)) !== null) {
    tCalls.push(match[1]);
  }
  const uniqueKeys = [...new Set(tCalls)].filter(k => !falsePositives.has(k));
  
  const missing = uniqueKeys.filter(key => {
    // Check top-level key
    if (toolTrans[key] !== undefined) return false;
    // Check nested key
    const parts = key.split('.');
    let val = toolTrans;
    for (const p of parts) {
      if (val && typeof val === 'object') val = val[p];
      else return true;
    }
    return val === undefined;
  });
  
  if (missing.length > 0) {
    mismatchCount++;
    mismatches.push({ file, slug, missing });
  }
}

console.log('Total components with custom t():', totalWithCustomT);
console.log('Components with REAL key mismatches:', mismatchCount);
console.log('\nDetails:');
for (const m of mismatches) {
  console.log(`  ${m.file} (${m.slug}): ${m.missing.join(', ')}`);
}
