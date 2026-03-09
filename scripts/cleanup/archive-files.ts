import fs from 'fs-extra';
import * as path from 'path';
import type { TempFile } from './identify-temp-files.js';

export interface ArchiveOptions {
  rootDir?: string;
  archiveDir?: string;
  dryRun?: boolean;
  maxRetries?: number;
}

export interface ArchiveResult {
  success: boolean;
  archivedFiles: string[];
  failedFiles: Array<{ file: string; error: string }>;
  totalSize: number;
}

/**
 * 生成归档目录路径
 */
function getArchiveDir(rootDir: string, archiveDir?: string): string {
  if (archiveDir) {
    return path.isAbsolute(archiveDir) ? archiveDir : path.join(rootDir, archiveDir);
  }
  
  const timestamp = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  return path.join(rootDir, 'archive', 'temp-files', timestamp);
}

/**
 * 重试函数
 */
async function retry<T>(
  fn: () => Promise<T>,
  maxRetries: number,
  delay: number = 100
): Promise<T> {
  let lastError: Error | undefined;
  
  for (let i = 0; i <= maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      if (i < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
      }
    }
  }
  
  throw lastError;
}

/**
 * 归档单个文件
 */
async function archiveFile(
  sourcePath: string,
  archiveDir: string,
  rootDir: string,
  dryRun: boolean,
  maxRetries: number
): Promise<void> {
  const relativePath = path.relative(rootDir, sourcePath);
  const targetPath = path.join(archiveDir, relativePath);
  
  if (dryRun) {
    console.log(`[DRY RUN] 将归档: ${relativePath} -> ${path.relative(rootDir, targetPath)}`);
    return;
  }
  
  await retry(async () => {
    // 确保目标目录存在
    await fs.ensureDir(path.dirname(targetPath));
    
    // 移动文件
    await fs.move(sourcePath, targetPath, { overwrite: false });
    
    console.log(`✓ 已归档: ${relativePath}`);
  }, maxRetries);
}

/**
 * 归档临时文件
 */
export async function archiveFiles(
  files: TempFile[],
  options: ArchiveOptions = {}
): Promise<ArchiveResult> {
  const {
    rootDir = process.cwd(),
    archiveDir,
    dryRun = false,
    maxRetries = 3,
  } = options;

  const result: ArchiveResult = {
    success: true,
    archivedFiles: [],
    failedFiles: [],
    totalSize: 0,
  };

  if (files.length === 0) {
    console.log('没有文件需要归档');
    return result;
  }

  const targetArchiveDir = getArchiveDir(rootDir, archiveDir);
  
  console.log(`\n归档目录: ${path.relative(rootDir, targetArchiveDir)}`);
  console.log(`归档模式: ${dryRun ? 'DRY RUN (不实际移动文件)' : '实际归档'}`);
  console.log(`文件数量: ${files.length}\n`);

  // 创建归档目录
  if (!dryRun) {
    await fs.ensureDir(targetArchiveDir);
  }

  // 归档每个文件
  for (const file of files) {
    const fullPath = path.join(rootDir, file.path);
    
    try {
      // 检查文件是否存在
      if (!(await fs.pathExists(fullPath))) {
        result.failedFiles.push({
          file: file.path,
          error: '文件不存在',
        });
        continue;
      }

      // 归档文件
      await archiveFile(fullPath, targetArchiveDir, rootDir, dryRun, maxRetries);
      
      result.archivedFiles.push(file.path);
      result.totalSize += file.size;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      result.failedFiles.push({
        file: file.path,
        error: errorMessage,
      });
      result.success = false;
      console.error(`✗ 归档失败: ${file.path} - ${errorMessage}`);
    }
  }

  return result;
}

/**
 * 打印归档结果
 */
export function printArchiveResult(result: ArchiveResult): void {
  console.log('\n归档结果:');
  console.log(`  成功: ${result.archivedFiles.length} 个文件`);
  console.log(`  失败: ${result.failedFiles.length} 个文件`);
  console.log(`  总大小: ${formatFileSize(result.totalSize)}`);
  
  if (result.failedFiles.length > 0) {
    console.log('\n失败的文件:');
    for (const { file, error } of result.failedFiles) {
      console.log(`  ${file}: ${error}`);
    }
  }
  
  console.log(`\n状态: ${result.success ? '✅ 成功' : '❌ 部分失败'}`);
}

/**
 * 格式化文件大小
 */
function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
}
