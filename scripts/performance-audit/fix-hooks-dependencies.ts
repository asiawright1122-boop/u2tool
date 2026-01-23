#!/usr/bin/env tsx
/**
 * 批量修复 React Hooks 依赖问题
 * 
 * 问题：翻译函数 't' 被包含在 useEffect/useMemo/useCallback 的依赖数组中
 * 原因：useTranslations 返回的函数每次渲染都是新引用
 * 解决：从依赖数组中移除 't'，并添加 ESLint 注释说明原因
 */

import fs from 'fs';
import path from 'path';

interface HooksIssue {
  file: string;
  line: number;
  column: number;
  severity: string;
  category: string;
  message: string;
  suggestion: string;
}

interface FixResult {
  file: string;
  success: boolean;
  changes: string[];
  error?: string;
}

// 读取报告
const reportPath = path.join(process.cwd(), 'performance-audit-quick-report.json');
const report = JSON.parse(fs.readFileSync(reportPath, 'utf-8'));

// 过滤出 React Hooks 问题
const hooksIssues: HooksIssue[] = report.issues.filter(
  (issue: HooksIssue) => issue.category === 'React Hooks'
);

console.log(`\n🔍 发现 ${hooksIssues.length} 个 React Hooks 依赖问题\n`);

// 按文件分组
const issuesByFile = new Map<string, HooksIssue[]>();
hooksIssues.forEach(issue => {
  const issues = issuesByFile.get(issue.file) || [];
  issues.push(issue);
  issuesByFile.set(issue.file, issues);
});

console.log(`📁 涉及 ${issuesByFile.size} 个文件\n`);

const results: FixResult[] = [];

// 处理每个文件
for (const [filePath, issues] of issuesByFile) {
  console.log(`\n处理文件: ${filePath}`);
  console.log(`  问题数量: ${issues.length}`);
  
  try {
    const fullPath = path.join(process.cwd(), filePath);
    
    if (!fs.existsSync(fullPath)) {
      console.log(`  ⚠️  文件不存在，跳过`);
      results.push({
        file: filePath,
        success: false,
        changes: [],
        error: '文件不存在'
      });
      continue;
    }
    
    let content = fs.readFileSync(fullPath, 'utf-8');
    const lines = content.split('\n');
    const changes: string[] = [];
    
    // 按行号倒序处理（避免行号偏移）
    const sortedIssues = issues.sort((a, b) => b.line - a.line);
    
    for (const issue of sortedIssues) {
      const lineIndex = issue.line - 1;
      
      if (lineIndex < 0 || lineIndex >= lines.length) {
        console.log(`  ⚠️  行号 ${issue.line} 超出范围，跳过`);
        continue;
      }
      
      const line = lines[lineIndex];
      
      // 检查是否包含依赖数组
      if (!line.includes('[') || !line.includes(']')) {
        console.log(`  ⚠️  第 ${issue.line} 行不包含依赖数组，跳过`);
        continue;
      }
      
      // 检查是否包含 't'
      if (!line.includes(', t]') && !line.includes('[t,') && !line.includes('[t]')) {
        console.log(`  ⚠️  第 ${issue.line} 行不包含 't' 依赖，跳过`);
        continue;
      }
      
      // 移除 't' 依赖
      let newLine = line;
      
      // 处理各种情况
      if (line.includes(', t]')) {
        // [..., t] -> [...]
        newLine = line.replace(/, t\]/, ']');
      } else if (line.includes('[t,')) {
        // [t, ...] -> [...]
        newLine = line.replace(/\[t,\s*/, '[');
      } else if (line.includes('[t]')) {
        // [t] -> []
        newLine = line.replace(/\[t\]/, '[]');
      }
      
      if (newLine !== line) {
        // 添加 ESLint 注释
        const indent = line.match(/^\s*/)?.[0] || '';
        const eslintComment = `${indent}// eslint-disable-next-line react-hooks/exhaustive-deps`;
        
        // 检查上一行是否已经有注释
        const prevLineIndex = lineIndex - 1;
        const hasPrevComment = prevLineIndex >= 0 && 
          lines[prevLineIndex].includes('eslint-disable-next-line react-hooks/exhaustive-deps');
        
        if (!hasPrevComment) {
          lines.splice(lineIndex, 0, eslintComment);
        }
        
        // 更新当前行
        const currentLineIndex = hasPrevComment ? lineIndex : lineIndex + 1;
        lines[currentLineIndex] = newLine;
        
        const hookType = issue.message.includes('useEffect') ? 'useEffect' :
                        issue.message.includes('useMemo') ? 'useMemo' : 'useCallback';
        
        changes.push(`第 ${issue.line} 行: ${hookType} 依赖数组中移除 't'`);
        console.log(`  ✅ 修复第 ${issue.line} 行`);
      }
    }
    
    if (changes.length > 0) {
      // 写回文件
      const newContent = lines.join('\n');
      fs.writeFileSync(fullPath, newContent, 'utf-8');
      
      results.push({
        file: filePath,
        success: true,
        changes
      });
      
      console.log(`  ✅ 成功修复 ${changes.length} 处`);
    } else {
      console.log(`  ℹ️  无需修复`);
      results.push({
        file: filePath,
        success: true,
        changes: []
      });
    }
    
  } catch (error) {
    console.error(`  ❌ 处理失败: ${error}`);
    results.push({
      file: filePath,
      success: false,
      changes: [],
      error: String(error)
    });
  }
}

// 生成报告
console.log('\n\n' + '='.repeat(80));
console.log('修复报告');
console.log('='.repeat(80) + '\n');

const successCount = results.filter(r => r.success).length;
const failCount = results.filter(r => !r.success).length;
const totalChanges = results.reduce((sum, r) => sum + r.changes.length, 0);

console.log(`✅ 成功: ${successCount} 个文件`);
console.log(`❌ 失败: ${failCount} 个文件`);
console.log(`📝 总修复数: ${totalChanges} 处\n`);

// 详细报告
const detailedReport = {
  timestamp: new Date().toISOString(),
  summary: {
    totalFiles: issuesByFile.size,
    successFiles: successCount,
    failedFiles: failCount,
    totalChanges
  },
  results: results.map(r => ({
    file: r.file,
    success: r.success,
    changesCount: r.changes.length,
    changes: r.changes,
    error: r.error
  }))
};

// 保存详细报告
const reportOutputPath = path.join(process.cwd(), 'HOOKS_FIX_REPORT.md');
let reportContent = `# React Hooks 依赖问题修复报告

**生成时间**: ${new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })}

## 📊 修复统计

- **总文件数**: ${issuesByFile.size}
- **成功修复**: ${successCount} 个文件
- **修复失败**: ${failCount} 个文件
- **总修复数**: ${totalChanges} 处

## 🔧 修复内容

### 问题描述

翻译函数 \`t\` 被包含在 useEffect/useMemo/useCallback 的依赖数组中，导致不必要的重渲染。

### 修复方案

1. 从依赖数组中移除 \`t\`
2. 添加 ESLint 注释说明原因：\`// eslint-disable-next-line react-hooks/exhaustive-deps\`

### 原因说明

\`useTranslations\` 返回的函数每次渲染都是新引用，将其作为依赖会导致 Hook 在每次渲染时都重新执行。

## 📝 详细修复记录

`;

// 成功修复的文件
const successResults = results.filter(r => r.success && r.changes.length > 0);
if (successResults.length > 0) {
  reportContent += `### ✅ 成功修复 (${successResults.length} 个文件)\n\n`;
  
  successResults.forEach(result => {
    reportContent += `#### ${result.file}\n\n`;
    reportContent += `修复数量: ${result.changes.length}\n\n`;
    result.changes.forEach(change => {
      reportContent += `- ${change}\n`;
    });
    reportContent += '\n';
  });
}

// 无需修复的文件
const noChangeResults = results.filter(r => r.success && r.changes.length === 0);
if (noChangeResults.length > 0) {
  reportContent += `### ℹ️ 无需修复 (${noChangeResults.length} 个文件)\n\n`;
  noChangeResults.forEach(result => {
    reportContent += `- ${result.file}\n`;
  });
  reportContent += '\n';
}

// 失败的文件
const failedResults = results.filter(r => !r.success);
if (failedResults.length > 0) {
  reportContent += `### ❌ 修复失败 (${failedResults.length} 个文件)\n\n`;
  
  failedResults.forEach(result => {
    reportContent += `#### ${result.file}\n\n`;
    reportContent += `错误: ${result.error}\n\n`;
  });
}

// 添加验证建议
reportContent += `## 🧪 验证步骤

1. **运行 TypeScript 检查**:
   \`\`\`bash
   npm run type-check
   \`\`\`

2. **运行 ESLint 检查**:
   \`\`\`bash
   npm run lint
   \`\`\`

3. **运行测试**:
   \`\`\`bash
   npm run test
   \`\`\`

4. **本地测试**:
   \`\`\`bash
   npm run dev
   \`\`\`
   
   访问修复的组件，确认功能正常。

## 📚 相关文档

- [React Hooks 规则](https://react.dev/reference/rules/rules-of-hooks)
- [useTranslations 文档](https://next-intl-docs.vercel.app/docs/usage/messages)

## 🎯 下一步

1. 验证所有修复是否正确
2. 检查是否有遗漏的问题
3. 更新开发规则文档
4. 提交代码变更
`;

fs.writeFileSync(reportOutputPath, reportContent, 'utf-8');

console.log(`\n📄 详细报告已保存到: ${reportOutputPath}\n`);

// 保存 JSON 格式报告
const jsonReportPath = path.join(process.cwd(), 'hooks-fix-report.json');
fs.writeFileSync(jsonReportPath, JSON.stringify(detailedReport, null, 2), 'utf-8');

console.log(`📄 JSON 报告已保存到: ${jsonReportPath}\n`);

// 退出码
process.exit(failCount > 0 ? 1 : 0);
