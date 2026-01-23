#!/usr/bin/env tsx

/**
 * 批量修复定时器内存泄漏
 * 
 * 修复模式：
 * 1. 添加 useRef 和 useEffect 导入
 * 2. 添加 timerRef
 * 3. 修改 setTimeout 调用
 * 4. 添加清理 useEffect
 */

import * as fs from 'fs';
import * as path from 'path';

interface FixResult {
  file: string;
  status: 'success' | 'skipped' | 'error';
  reason?: string;
}

const results: FixResult[] = [];

// 从诊断报告读取需要修复的文件列表
const reportPath = 'performance-audit-quick-report.json';
const report = JSON.parse(fs.readFileSync(reportPath, 'utf-8'));

const filesToFix = Array.from(
  new Set(
    report.issues
      .filter((issue: any) => issue.category === '内存泄漏')
      .map((issue: any) => issue.file)
  )
).sort();

console.log(`📋 找到 ${filesToFix.length} 个需要修复的文件\n`);

// 已经修复的文件（跳过）
const fixedFiles = ['src/components/tools/Base64.tsx'];

function fixFile(filePath: string): FixResult {
  // 跳过已修复的文件
  if (fixedFiles.includes(filePath)) {
    return { file: filePath, status: 'skipped', reason: '已手动修复' };
  }

  // 检查文件是否存在
  if (!fs.existsSync(filePath)) {
    return { file: filePath, status: 'error', reason: '文件不存在' };
  }

  let content = fs.readFileSync(filePath, 'utf-8');
  const originalContent = content;

  try {
    // 步骤 1: 检查是否已经有 timerRef（避免重复修复）
    if (content.includes('timerRef')) {
      return { file: filePath, status: 'skipped', reason: '已包含 timerRef' };
    }

    // 步骤 2: 更新导入语句
    const importPatterns = [
      // Pattern 1: import { useState } from 'react';
      {
        regex: /import\s+{\s*useState\s*}\s+from\s+['"]react['"]/,
        replacement: "import { useState, useRef, useEffect } from 'react'"
      },
      // Pattern 2: import { useState, ... } from 'react';
      {
        regex: /import\s+{\s*useState,([^}]+)}\s+from\s+['"]react['"]/,
        replacement: (match: string, rest: string) => {
          const imports = ['useState', ...rest.split(',').map(s => s.trim())];
          if (!imports.includes('useRef')) imports.push('useRef');
          if (!imports.includes('useEffect')) imports.push('useEffect');
          return `import { ${imports.join(', ')} } from 'react'`;
        }
      }
    ];

    let importUpdated = false;
    for (const pattern of importPatterns) {
      if (typeof pattern.replacement === 'string') {
        if (pattern.regex.test(content)) {
          content = content.replace(pattern.regex, pattern.replacement);
          importUpdated = true;
          break;
        }
      } else {
        const match = content.match(pattern.regex);
        if (match) {
          content = content.replace(pattern.regex, pattern.replacement);
          importUpdated = true;
          break;
        }
      }
    }

    if (!importUpdated) {
      return { file: filePath, status: 'skipped', reason: '无法找到 React 导入语句' };
    }

    // 步骤 3: 找到最后一个 useState 声明，在其后添加 timerRef
    const lastUseStateMatch = content.match(/const\s+\[[^\]]+\]\s*=\s*useState[^;]+;(?![\s\S]*useState)/);
    if (!lastUseStateMatch) {
      return { file: filePath, status: 'skipped', reason: '无法找到 useState 声明' };
    }

    const insertPosition = content.indexOf(lastUseStateMatch[0]) + lastUseStateMatch[0].length;
    content = content.slice(0, insertPosition) + '\n  const timerRef = useRef<NodeJS.Timeout | null>(null);' + content.slice(insertPosition);

    // 步骤 4: 修改所有 setTimeout 调用
    // 查找 setTimeout(() => setCopied(false), 2000) 模式
    const setTimeoutPattern = /setTimeout\(\(\)\s*=>\s*set(\w+)\(false\),\s*(\d+)\)/g;
    content = content.replace(setTimeoutPattern, (match, stateName, delay) => {
      return `if (timerRef.current) clearTimeout(timerRef.current);\n    timerRef.current = setTimeout(() => set${stateName}(false), ${delay})`;
    });

    // 步骤 5: 在 return 语句之前添加清理 useEffect
    // 找到组件的 return 语句
    const returnMatch = content.match(/\n(\s+)return\s+\(/);
    if (!returnMatch) {
      return { file: filePath, status: 'skipped', reason: '无法找到 return 语句' };
    }

    const indent = returnMatch[1];
    const returnPosition = content.indexOf(returnMatch[0]);
    
    const cleanupEffect = `\n${indent}useEffect(() => {\n${indent}  return () => {\n${indent}    if (timerRef.current) clearTimeout(timerRef.current);\n${indent}  };\n${indent}}, []);\n`;
    
    content = content.slice(0, returnPosition) + cleanupEffect + content.slice(returnPosition);

    // 步骤 6: 写回文件
    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf-8');
      return { file: filePath, status: 'success' };
    } else {
      return { file: filePath, status: 'skipped', reason: '没有需要修改的内容' };
    }

  } catch (error) {
    return { 
      file: filePath, 
      status: 'error', 
      reason: error instanceof Error ? error.message : String(error) 
    };
  }
}

// 批量处理文件
let successCount = 0;
let skippedCount = 0;
let errorCount = 0;

for (let i = 0; i < filesToFix.length; i++) {
  const file = filesToFix[i] as string;
  const result = fixFile(file);
  results.push(result);

  if (result.status === 'success') {
    successCount++;
    console.log(`✅ [${i + 1}/${filesToFix.length}] ${file}`);
  } else if (result.status === 'skipped') {
    skippedCount++;
    console.log(`⏭️  [${i + 1}/${filesToFix.length}] ${file} - ${result.reason}`);
  } else {
    errorCount++;
    console.log(`❌ [${i + 1}/${filesToFix.length}] ${file} - ${result.reason}`);
  }

  // 每修复 10 个文件后暂停一下
  if ((i + 1) % 10 === 0) {
    console.log(`\n📊 进度: ${i + 1}/${filesToFix.length} (成功: ${successCount}, 跳过: ${skippedCount}, 错误: ${errorCount})\n`);
  }
}

// 生成修复报告
console.log('\n' + '='.repeat(80));
console.log('📊 修复完成统计');
console.log('='.repeat(80));
console.log(`✅ 成功修复: ${successCount} 个文件`);
console.log(`⏭️  跳过: ${skippedCount} 个文件`);
console.log(`❌ 失败: ${errorCount} 个文件`);
console.log('='.repeat(80));

// 保存详细报告
const reportOutput = {
  timestamp: new Date().toISOString(),
  summary: {
    total: filesToFix.length,
    success: successCount,
    skipped: skippedCount,
    error: errorCount
  },
  results: results
};

fs.writeFileSync(
  'timer-leak-fix-report.json',
  JSON.stringify(reportOutput, null, 2),
  'utf-8'
);

console.log('\n📄 详细报告已保存到: timer-leak-fix-report.json');

// 如果有错误，列出错误文件
if (errorCount > 0) {
  console.log('\n❌ 以下文件修复失败:');
  results
    .filter(r => r.status === 'error')
    .forEach(r => console.log(`  - ${r.file}: ${r.reason}`));
}

process.exit(errorCount > 0 ? 1 : 0);
