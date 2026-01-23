#!/usr/bin/env tsx

/**
 * 检查重型库导入
 * 
 * 检测可能导致性能问题的大型库导入
 */

import fs from 'fs';
import path from 'path';

// 已知的大型库
const heavyLibraries = [
  'xlsx',
  'mammoth',
  'pdf-lib',
  'pdfjs-dist',
  'echarts',
  'react-echarts',
  'gifshot',
  '@ffmpeg/ffmpeg',
  'tesseract.js',
  'sharp',
];

interface ImportIssue {
  file: string;
  library: string;
  line: number;
  isDynamic: boolean;
  code: string;
}

const issues: ImportIssue[] = [];

function analyzeFile(filePath: string) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  
  lines.forEach((line, index) => {
    heavyLibraries.forEach(lib => {
      // 检查静态导入
      const staticImportRegex = new RegExp(`^import .+ from ['"]${lib}['"]`, 'i');
      if (staticImportRegex.test(line.trim())) {
        issues.push({
          file: filePath,
          library: lib,
          line: index + 1,
          isDynamic: false,
          code: line.trim(),
        });
      }
      
      // 检查 require
      const requireRegex = new RegExp(`require\\(['"]${lib}['"]\\)`, 'i');
      if (requireRegex.test(line)) {
        issues.push({
          file: filePath,
          library: lib,
          line: index + 1,
          isDynamic: false,
          code: line.trim(),
        });
      }
    });
  });
}

function main() {
  console.log('🔍 检查重型库导入...\n');
  
  const toolsDir = 'src/components/tools';
  const files = fs.readdirSync(toolsDir)
    .filter(f => f.endsWith('.tsx'))
    .map(f => path.join(toolsDir, f));
  
  console.log(`📁 扫描 ${files.length} 个文件...\n`);
  
  files.forEach(analyzeFile);
  
  console.log('='.repeat(60));
  console.log('📊 重型库导入报告');
  console.log('='.repeat(60));
  console.log(`🔴 静态导入: ${issues.length} 个\n`);
  
  if (issues.length > 0) {
    console.log('🔴 发现静态导入大型库的问题:\n');
    
    // 按库分组
    const byLibrary = issues.reduce((acc, issue) => {
      if (!acc[issue.library]) acc[issue.library] = [];
      acc[issue.library].push(issue);
      return acc;
    }, {} as Record<string, ImportIssue[]>);
    
    Object.entries(byLibrary).forEach(([lib, libIssues]) => {
      console.log(`📦 ${lib} (${libIssues.length} 个文件):`);
      libIssues.slice(0, 5).forEach(issue => {
        console.log(`   - ${path.basename(issue.file)}:${issue.line}`);
        console.log(`     ${issue.code}`);
      });
      if (libIssues.length > 5) {
        console.log(`   ... 还有 ${libIssues.length - 5} 个文件`);
      }
      console.log('');
    });
    
    console.log('\n💡 建议:');
    console.log('   这些大型库应该使用动态导入 (await import(...))');
    console.log('   以避免阻塞主线程和增加初始加载时间。\n');
  } else {
    console.log('✅ 没有发现静态导入大型库的问题！\n');
  }
  
  // 保存报告
  fs.writeFileSync(
    'heavy-imports-report.json',
    JSON.stringify({ issues, timestamp: new Date().toISOString() }, null, 2)
  );
  
  console.log('📄 详细报告已保存到: heavy-imports-report.json\n');
}

main();
