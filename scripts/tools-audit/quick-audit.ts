#!/usr/bin/env tsx

/**
 * 快速审计 - 只审计前 10 个工具用于测试
 */

import { runFullAudit, generateReadableReport, saveAuditReport } from './audit-engine';
import fs from 'fs';
import path from 'path';

(async () => {
  console.log('🚀 运行快速审计（前 10 个工具）...\n');

  // 临时修改 loadTools 函数只返回前 10 个工具
  const toolsConfigPath = path.join(process.cwd(), 'src', 'config', 'tools.ts');
  const content = fs.readFileSync(toolsConfigPath, 'utf-8');
  
  const toolsMatch = content.match(/export const tools: Tool\[\] = \[([\s\S]*?)\];/);
  if (!toolsMatch) {
    throw new Error('无法解析 tools.ts');
  }
  
  const toolsStr = toolsMatch[1];
  const toolRegex = /\{\s*slug:\s*['"]([^'"]+)['"]\s*,\s*category:\s*['"]([^'"]+)['"]\s*,[\s\S]*?component:\s*['"]([^'"]+)['"]/g;
  
  const tools = [];
  let match;
  let count = 0;
  
  while ((match = toolRegex.exec(toolsStr)) !== null && count < 10) {
    tools.push({
      slug: match[1],
      category: match[2],
      component: match[3],
    });
    count++;
  }

  console.log(`📊 将审计 ${tools.length} 个工具：`);
  tools.forEach(t => console.log(`  - ${t.slug}`));
  console.log();

  const startTime = Date.now();

  const report = await runFullAudit({
    parallel: false,
    onProgress: (current, total, tool) => {
      console.log(`[${current}/${total}] 审计: ${tool}`);
    },
  });

  console.log(generateReadableReport(report));

  const outputPath = path.join(process.cwd(), 'quick-audit-report.json');
  saveAuditReport(report, outputPath);

  const duration = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`\n⏱️  审计耗时: ${duration}秒`);
})();
