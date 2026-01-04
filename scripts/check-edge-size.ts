/**
 * Edge Function 大小检查脚本
 * 
 * 检查 .next/server/edge/chunks/ 目录中的文件：
 * 1. 验证不包含翻译文件
 * 2. 计算总大小并与限制比较
 * 
 * 使用方法：npx tsx scripts/check-edge-size.ts
 * 
 * @see Requirements 4.2, 4.3
 */

import * as fs from 'fs';
import * as path from 'path';

// 配置
const EDGE_CHUNKS_DIR = '.next/server/edge/chunks';
const SIZE_LIMIT_MB = 2; // Vercel Edge Function 大小限制
const WARNING_THRESHOLD_MB = 1.5; // 警告阈值

// 颜色输出
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
};

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

function checkEdgeSize(): void {
  console.log(`${colors.blue}=== Edge Function 大小检查 ===${colors.reset}\n`);

  // 检查目录是否存在
  if (!fs.existsSync(EDGE_CHUNKS_DIR)) {
    console.log(`${colors.yellow}警告: ${EDGE_CHUNKS_DIR} 目录不存在。请先运行 npm run build${colors.reset}`);
    process.exit(1);
  }

  // 获取所有文件
  const files = fs.readdirSync(EDGE_CHUNKS_DIR);
  const jsFiles = files.filter(f => f.endsWith('.js') && !f.endsWith('.map'));
  
  // 检查是否包含翻译文件
  const translationFiles = jsFiles.filter(f => f.includes('messages'));
  if (translationFiles.length > 0) {
    console.log(`${colors.red}❌ 错误: Edge chunks 中包含翻译文件:${colors.reset}`);
    translationFiles.forEach(f => console.log(`   - ${f}`));
    console.log(`\n${colors.yellow}这会导致 Edge Function 大小超限。请检查 middleware 和 i18n 配置。${colors.reset}`);
    process.exit(1);
  }
  console.log(`${colors.green}✓ Edge chunks 中没有翻译文件${colors.reset}`);

  // 计算总大小
  let totalSize = 0;
  const fileSizes: { name: string; size: number }[] = [];

  for (const file of jsFiles) {
    const filePath = path.join(EDGE_CHUNKS_DIR, file);
    const stats = fs.statSync(filePath);
    totalSize += stats.size;
    fileSizes.push({ name: file, size: stats.size });
  }

  // 按大小排序
  fileSizes.sort((a, b) => b.size - a.size);

  // 输出文件列表
  console.log(`\n${colors.blue}文件列表 (按大小排序):${colors.reset}`);
  fileSizes.slice(0, 10).forEach(({ name, size }) => {
    console.log(`   ${formatSize(size).padStart(10)} - ${name}`);
  });
  if (fileSizes.length > 10) {
    console.log(`   ... 还有 ${fileSizes.length - 10} 个文件`);
  }

  // 输出总大小
  const totalMB = totalSize / 1024 / 1024;
  console.log(`\n${colors.blue}总大小: ${formatSize(totalSize)}${colors.reset}`);
  console.log(`${colors.blue}限制: ${SIZE_LIMIT_MB} MB${colors.reset}`);

  // 检查是否超限
  if (totalMB > SIZE_LIMIT_MB) {
    console.log(`\n${colors.red}❌ 错误: Edge Function 大小 (${totalMB.toFixed(2)} MB) 超过限制 (${SIZE_LIMIT_MB} MB)${colors.reset}`);
    process.exit(1);
  } else if (totalMB > WARNING_THRESHOLD_MB) {
    console.log(`\n${colors.yellow}⚠ 警告: Edge Function 大小 (${totalMB.toFixed(2)} MB) 接近限制 (${SIZE_LIMIT_MB} MB)${colors.reset}`);
  } else {
    console.log(`\n${colors.green}✓ Edge Function 大小在限制范围内${colors.reset}`);
  }

  // 输出使用百分比
  const usagePercent = (totalMB / SIZE_LIMIT_MB * 100).toFixed(1);
  console.log(`${colors.blue}使用率: ${usagePercent}%${colors.reset}`);
}

// 运行检查
checkEdgeSize();
