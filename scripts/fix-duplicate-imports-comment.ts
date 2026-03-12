#!/usr/bin/env tsx

import { readFileSync, writeFileSync } from 'fs';
import { glob } from 'glob';

async function main() {
  const files = await glob('src/components/tools/*ChartGenerator.svelte');
  
  let fixedCount = 0;
  
  for (const file of files) {
    const content = readFileSync(file, 'utf-8');
    
    if (content.includes('// Imports// Imports')) {
      const fixed = content.replace(/\/\/ Imports\/\/ Imports/g, '// Imports');
      writeFileSync(file, fixed, 'utf-8');
      console.log(`✅ 修复 ${file}`);
      fixedCount++;
    }
  }
  
  console.log(`\n📊 修复完成: ${fixedCount} 个文件`);
}

main().catch(console.error);
