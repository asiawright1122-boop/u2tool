#!/usr/bin/env node

import fs from 'fs-extra';
import { glob } from 'glob';

/**
 * 修复 Svelte 组件中的类型导入
 * 将 `import { Foo, Bar }` 改为 `import { type Foo, type Bar }`
 */

const TYPE_NAMES = [
  'LoanResult',
  'BmiResult',
  'AgeResult',
  'TipResult',
  'DiscountResult',
  'CompoundInterestResult',
  'BinaryResult',
  'HexResult',
  'SubnetResult',
  'AspectRatioResult',
  'TypingTestResult',
];

async function fixTypeImports() {
  const files = await glob('src/components/tools/*.svelte');
  
  let fixedCount = 0;
  
  for (const file of files) {
    let content = await fs.readFile(file, 'utf-8');
    let modified = false;
    
    // 查找从 calculator-utils 导入的行
    const importRegex = /import\s+\{([^}]+)\}\s+from\s+['"]@\/lib\/calculator-utils['"]/g;
    
    content = content.replace(importRegex, (match, imports) => {
      const importList = imports.split(',').map((s: string) => s.trim());
      const newImports: string[] = [];
      
      for (const imp of importList) {
        // 检查是否是类型名
        if (TYPE_NAMES.some(typeName => imp.includes(typeName))) {
          // 如果还没有 type 关键字，添加它
          if (!imp.startsWith('type ')) {
            newImports.push(`type ${imp}`);
            modified = true;
          } else {
            newImports.push(imp);
          }
        } else {
          newImports.push(imp);
        }
      }
      
      return `import { ${newImports.join(', ')} } from '@/lib/calculator-utils'`;
    });
    
    if (modified) {
      await fs.writeFile(file, content, 'utf-8');
      console.log(`✓ 修复: ${file}`);
      fixedCount++;
    }
  }
  
  console.log(`\n总共修复了 ${fixedCount} 个文件`);
}

fixTypeImports().catch(error => {
  console.error('错误:', error);
  process.exit(1);
});
