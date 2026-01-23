#!/usr/bin/env tsx

/**
 * XLSX 动态导入优化脚本
 * 
 * 将静态导入 `import * as XLSX from 'xlsx'` 改为动态导入
 * 只在用户实际使用导出/转换功能时加载 XLSX 库（600KB）
 */

import * as fs from 'fs';
import * as path from 'path';

interface FileOptimization {
  file: string;
  functions: string[];
  status: 'success' | 'failed' | 'skipped';
  error?: string;
}

const FILES_TO_OPTIMIZE = [
  'src/components/tools/CsvToExcel.tsx',
  'src/components/tools/ExcelMerger.tsx',
  'src/components/tools/ExcelToCsv.tsx',
  'src/components/tools/ExcelToJson.tsx',
  'src/components/tools/ExcelViewer.tsx',
  'src/components/tools/JsonToExcel.tsx',
];

const results: FileOptimization[] = [];

function optimizeFile(filePath: string): FileOptimization {
  const result: FileOptimization = {
    file: filePath,
    functions: [],
    status: 'skipped',
  };

  try {
    const fullPath = path.join(process.cwd(), filePath);
    let content = fs.readFileSync(fullPath, 'utf-8');

    // 检查是否已经优化过
    if (!content.includes("import * as XLSX from 'xlsx';")) {
      result.status = 'skipped';
      result.error = 'Already optimized or no XLSX import found';
      return result;
    }

    // 移除静态导入
    content = content.replace(/import \* as XLSX from 'xlsx';\n/g, '');

    // 根据不同文件的特点进行优化
    const fileName = path.basename(filePath);

    switch (fileName) {
      case 'CsvToExcel.tsx':
        content = optimizeCsvToExcel(content);
        result.functions.push('downloadExcel');
        break;

      case 'ExcelMerger.tsx':
        content = optimizeExcelMerger(content);
        result.functions.push('handleFileUpload', 'handleMerge');
        break;

      case 'ExcelToCsv.tsx':
        content = optimizeExcelToCsv(content);
        result.functions.push('loadExcel', 'handleSheetChange');
        break;

      case 'ExcelToJson.tsx':
        content = optimizeExcelToJson(content);
        result.functions.push('handleFileUpload', 'handleSheetChange');
        break;

      case 'ExcelViewer.tsx':
        content = optimizeExcelViewer(content);
        result.functions.push('handleFileUpload');
        break;

      case 'JsonToExcel.tsx':
        content = optimizeJsonToExcel(content);
        result.functions.push('handleDownload');
        break;

      default:
        result.status = 'failed';
        result.error = 'Unknown file type';
        return result;
    }

    // 写回文件
    fs.writeFileSync(fullPath, content, 'utf-8');
    result.status = 'success';

  } catch (error) {
    result.status = 'failed';
    result.error = error instanceof Error ? error.message : String(error);
  }

  return result;
}

function optimizeCsvToExcel(content: string): string {
  // downloadExcel 函数改为 async
  content = content.replace(
    /const downloadExcel = \(\) => \{/,
    `const downloadExcel = async () => {
    try {
      const XLSX = await import('xlsx');`
  );

  // 在函数末尾添加 catch
  content = content.replace(
    /XLSX\.writeFile\(wb, fileName\.replace\('\.csv', '\.xlsx'\)\);/,
    `XLSX.writeFile(wb, fileName.replace('.csv', '.xlsx'));
    } catch (error) {
      console.error('Failed to export Excel:', error);
      setError(t('errorExport'));
    }`
  );

  return content;
}

function optimizeExcelMerger(content: string): string {
  // handleFileUpload 中的 XLSX.read
  content = content.replace(
    /const workbook = XLSX\.read\(data, \{ type: 'array' \}\);/,
    `const XLSX = await import('xlsx');
          const workbook = XLSX.read(data, { type: 'array' });`
  );

  // handleMerge 函数改为 async
  content = content.replace(
    /const handleMerge = \(\) => \{/,
    `const handleMerge = async () => {`
  );

  // handleMerge 中的 XLSX 使用
  content = content.replace(
    /const worksheet = XLSX\.utils\.json_to_sheet\(mergedData\);/,
    `const XLSX = await import('xlsx');
      const worksheet = XLSX.utils.json_to_sheet(mergedData);`
  );

  return content;
}

function optimizeExcelToCsv(content: string): string {
  // loadExcel 中的 XLSX.read
  content = content.replace(
    /const wb = XLSX\.read\(arrayBuffer, \{ type: 'array' \}\);/,
    `const XLSX = await import('xlsx');
      const wb = XLSX.read(arrayBuffer, { type: 'array' });`
  );

  // handleSheetChange 改为 async
  content = content.replace(
    /const handleSheetChange = \(sheetName: string\) => \{/,
    `const handleSheetChange = async (sheetName: string) => {`
  );

  // handleSheetChange 中的 XLSX 使用
  content = content.replace(
    /const csvData = XLSX\.utils\.sheet_to_csv\(workbook\.Sheets\[sheetName\]\);/,
    `const XLSX = await import('xlsx');
      const csvData = XLSX.utils.sheet_to_csv(workbook.Sheets[sheetName]);`
  );

  return content;
}

function optimizeExcelToJson(content: string): string {
  // handleFileUpload 中的 XLSX.read
  content = content.replace(
    /const workbook = XLSX\.read\(data, \{ type: 'array' \}\);/,
    `const XLSX = await import('xlsx');
        const workbook = XLSX.read(data, { type: 'array' });`
  );

  // handleSheetChange 改为 async
  content = content.replace(
    /const handleSheetChange = \(sheetName: string\) => \{/,
    `const handleSheetChange = async (sheetName: string) => {`
  );

  return content;
}

function optimizeExcelViewer(content: string): string {
  // handleFileUpload 中的 XLSX.read
  content = content.replace(
    /const workbook = XLSX\.read\(data, \{ type: 'array' \}\);/,
    `const XLSX = await import('xlsx');
        const workbook = XLSX.read(data, { type: 'array' });`
  );

  return content;
}

function optimizeJsonToExcel(content: string): string {
  // handleDownload 改为 async
  content = content.replace(
    /const handleDownload = \(\) => \{/,
    `const handleDownload = async () => {`
  );

  // handleDownload 中的 XLSX 使用
  content = content.replace(
    /const worksheet = XLSX\.utils\.json_to_sheet\(data\);/,
    `const XLSX = await import('xlsx');
      const worksheet = XLSX.utils.json_to_sheet(data);`
  );

  return content;
}

function generateReport() {
  console.log('\n' + '='.repeat(80));
  console.log('XLSX 动态导入优化报告');
  console.log('='.repeat(80) + '\n');

  const successful = results.filter(r => r.status === 'success');
  const failed = results.filter(r => r.status === 'failed');
  const skipped = results.filter(r => r.status === 'skipped');

  console.log(`📊 总计: ${results.length} 个文件`);
  console.log(`✅ 成功: ${successful.length} 个`);
  console.log(`❌ 失败: ${failed.length} 个`);
  console.log(`⏭️  跳过: ${skipped.length} 个\n`);

  if (successful.length > 0) {
    console.log('✅ 成功优化的文件:\n');
    successful.forEach(r => {
      console.log(`  ${r.file}`);
      console.log(`    优化的函数: ${r.functions.join(', ')}\n`);
    });
  }

  if (failed.length > 0) {
    console.log('❌ 失败的文件:\n');
    failed.forEach(r => {
      console.log(`  ${r.file}`);
      console.log(`    错误: ${r.error}\n`);
    });
  }

  if (skipped.length > 0) {
    console.log('⏭️  跳过的文件:\n');
    skipped.forEach(r => {
      console.log(`  ${r.file}`);
      console.log(`    原因: ${r.error}\n`);
    });
  }

  console.log('='.repeat(80));
  console.log('\n📝 优化说明:');
  console.log('  - 移除了静态导入 `import * as XLSX from \'xlsx\'`');
  console.log('  - 将 XLSX 使用改为动态导入 `await import(\'xlsx\')`');
  console.log('  - 只在用户实际使用功能时加载 XLSX 库（600KB）');
  console.log('  - 预期减少每个工具页面初始 bundle 大小 600KB\n');

  console.log('🔍 下一步:');
  console.log('  1. 运行 `npm run build` 验证构建成功');
  console.log('  2. 测试每个工具的功能是否正常');
  console.log('  3. 运行 `npx tsx scripts/performance-audit/code-splitting-checker.ts` 验证优化效果\n');
}

// 主函数
function main() {
  console.log('🚀 开始优化 XLSX 导入...\n');

  FILES_TO_OPTIMIZE.forEach(file => {
    console.log(`处理: ${file}`);
    const result = optimizeFile(file);
    results.push(result);
    console.log(`  状态: ${result.status}\n`);
  });

  generateReport();
}

main();
