#!/usr/bin/env tsx

/**
 * 诊断图表工具无响应问题
 */

import * as fs from 'fs';
import * as path from 'path';
import * as ts from 'typescript';

const CHART_COMPONENTS_DIR = 'src/components/tools';

interface DiagnosticResult {
  file: string;
  issues: string[];
}

function analyzeChartComponent(filePath: string): DiagnosticResult {
  const issues: string[] = [];
  const content = fs.readFileSync(filePath, 'utf-8');
  
  // 检查是否是图表组件
  if (!filePath.includes('ChartGenerator')) {
    return { file: filePath, issues: [] };
  }
  
  // 检查常见问题
  
  // 1. 检查是否有 chartTheme 对象作为依赖项
  if (content.match(/\[.*chartTheme[,\]]/)) {
    issues.push('❌ 使用了 chartTheme 对象作为依赖项（应该使用具体属性）');
  }
  
  // 2. 检查是否有翻译函数 t 作为依赖项
  if (content.match(/\[.*[,\s]t[,\]]/)) {
    issues.push('❌ 使用了翻译函数 t 作为依赖项');
  }
  
  // 3. 检查是否有 useEffect 的无限循环风险
  const useEffectMatches = content.matchAll(/useEffect\s*\(\s*\(\s*\)\s*=>\s*\{[\s\S]*?\},\s*\[([\s\S]*?)\]\)/g);
  for (const match of useEffectMatches) {
    const deps = match[1];
    if (deps && deps.includes('chartTheme') && !deps.includes('chartTheme.')) {
      issues.push('⚠️ useEffect 依赖项中包含 chartTheme 对象');
    }
  }
  
  // 4. 检查是否有 useMemo/useCallback 的问题
  const useMemoMatches = content.matchAll(/use(?:Memo|Callback)\s*\([\s\S]*?,\s*\[([\s\S]*?)\]\)/g);
  for (const match of useMemoMatches) {
    const deps = match[1];
    if (deps && deps.includes('chartTheme') && !deps.includes('chartTheme.')) {
      issues.push('⚠️ useMemo/useCallback 依赖项中包含 chartTheme 对象');
    }
  }
  
  // 5. 检查是否缺少 'use client' 指令
  if (!content.startsWith("'use client'")) {
    issues.push('❌ 缺少 "use client" 指令');
  }
  
  // 6. 检查是否正确导入 ReactEChartsCore
  if (!content.includes("import ReactEChartsCore from 'echarts-for-react/lib/core'")) {
    issues.push('⚠️ 可能没有正确导入 ReactEChartsCore');
  }
  
  return { file: path.basename(filePath), issues };
}

function main() {
  console.log('🔍 诊断图表工具无响应问题...\n');
  
  const files = fs.readdirSync(CHART_COMPONENTS_DIR)
    .filter(f => f.endsWith('ChartGenerator.tsx'))
    .map(f => path.join(CHART_COMPONENTS_DIR, f));
  
  console.log(`📊 找到 ${files.length} 个图表组件\n`);
  
  const results: DiagnosticResult[] = [];
  let totalIssues = 0;
  
  for (const file of files) {
    const result = analyzeChartComponent(file);
    if (result.issues.length > 0) {
      results.push(result);
      totalIssues += result.issues.length;
    }
  }
  
  if (results.length === 0) {
    console.log('✅ 所有图表组件看起来都正常！\n');
    console.log('💡 建议检查：');
    console.log('1. 浏览器控制台是否有 JavaScript 错误');
    console.log('2. 网络请求是否正常');
    console.log('3. 是否有其他运行时错误');
    console.log('4. 尝试清除浏览器缓存和重新构建');
  } else {
    console.log(`❌ 发现 ${totalIssues} 个潜在问题：\n`);
    
    for (const result of results) {
      console.log(`📄 ${result.file}`);
      for (const issue of result.issues) {
        console.log(`   ${issue}`);
      }
      console.log('');
    }
    
    console.log('\n💡 修复建议：');
    console.log('1. 将 chartTheme 对象依赖替换为具体属性（如 chartTheme.backgroundColor）');
    console.log('2. 从依赖项中移除翻译函数 t');
    console.log('3. 添加 ESLint 注释说明为什么禁用依赖检查');
    console.log('4. 确保所有图表组件都有 "use client" 指令');
  }
  
  console.log('\n📝 详细检查：');
  console.log('运行以下命令查看具体的代码：');
  console.log('grep -A 5 "useMemo\\|useCallback\\|useEffect" src/components/tools/*ChartGenerator.tsx | grep -A 3 "\\["');
}

main();
