import { glob } from 'glob';
import fs from 'fs-extra';
import * as path from 'path';
import ignore from 'ignore';

export interface TempFilePattern {
  pattern: string;
  description: string;
}

export interface TempFile {
  path: string;
  size: number;
  matchedPattern: string;
  reason: string;
}

export interface IdentifyOptions {
  rootDir?: string;
  customPatterns?: TempFilePattern[];
  respectGitignore?: boolean;
}

/**
 * 默认的临时文件模式
 */
export const DEFAULT_TEMP_PATTERNS: TempFilePattern[] = [
  { pattern: 'fix_*.sh', description: '临时修复脚本' },
  { pattern: 'fix_*.js', description: '临时修复脚本' },
  { pattern: 'fix_*.ts', description: '临时修复脚本' },
  { pattern: 'test_*.*', description: '临时测试文件' },
  { pattern: 'temp_*.*', description: '临时文件' },
  { pattern: 'tmp_*.*', description: '临时文件' },
  { pattern: '[0-9]', description: '数字文件名' },
  { pattern: '[0-9][0-9]', description: '数字文件名' },
  { pattern: '*.tmp', description: '临时文件扩展名' },
  { pattern: '*.bak', description: '备份文件' },
  { pattern: '*.old', description: '旧文件' },
  { pattern: '*.backup', description: '备份文件' },
  { pattern: '*~', description: '编辑器备份文件' },
  { pattern: '.DS_Store', description: 'macOS 系统文件' },
  { pattern: 'Thumbs.db', description: 'Windows 系统文件' },
];

/**
 * 加载 .gitignore 规则
 */
async function loadGitignoreRules(rootDir: string): Promise<ReturnType<typeof ignore>> {
  const ig = ignore();
  const gitignorePath = path.join(rootDir, '.gitignore');
  
  if (await fs.pathExists(gitignorePath)) {
    const content = await fs.readFile(gitignorePath, 'utf-8');
    ig.add(content);
  }
  
  return ig;
}

/**
 * 检查文件是否匹配数字文件名模式
 */
function isNumericFilename(filename: string): boolean {
  const basename = path.basename(filename, path.extname(filename));
  return /^\d+$/.test(basename);
}

/**
 * 识别临时文件
 */
export async function identifyTempFiles(options: IdentifyOptions = {}): Promise<TempFile[]> {
  const {
    rootDir = process.cwd(),
    customPatterns = [],
    respectGitignore = true,
  } = options;

  const patterns = [...DEFAULT_TEMP_PATTERNS, ...customPatterns];
  const tempFiles: TempFile[] = [];
  
  // 加载 .gitignore 规则
  const ig = respectGitignore ? await loadGitignoreRules(rootDir) : null;

  // 遍历每个模式
  for (const { pattern, description } of patterns) {
    try {
      const files = await glob(pattern, {
        cwd: rootDir,
        absolute: false,
        dot: true,
        ignore: [
          'node_modules/**',
          '.git/**',
          'dist/**',
          '.astro/**',
          '.kiro/specs/**', // 不扫描 spec 目录
        ],
      });

      for (const file of files) {
        const fullPath = path.join(rootDir, file);
        
        // 检查 .gitignore
        if (ig && ig.ignores(file)) {
          continue;
        }

        // 检查文件是否存在
        if (!(await fs.pathExists(fullPath))) {
          continue;
        }

        // 获取文件信息
        const stats = await fs.stat(fullPath);
        
        // 跳过目录
        if (stats.isDirectory()) {
          continue;
        }

        // 检查是否已经添加
        if (tempFiles.some(f => f.path === file)) {
          continue;
        }

        tempFiles.push({
          path: file,
          size: stats.size,
          matchedPattern: pattern,
          reason: description,
        });
      }
    } catch (error) {
      console.warn(`警告: 处理模式 "${pattern}" 时出错:`, error);
    }
  }

  // 额外检查数字文件名（不在根目录的 glob 模式中）
  const allFiles = await glob('*', {
    cwd: rootDir,
    absolute: false,
    dot: false,
    ignore: [
      'node_modules/**',
      '.git/**',
      'dist/**',
      '.astro/**',
      '.kiro/specs/**',
    ],
  });

  for (const file of allFiles) {
    if (isNumericFilename(file) && !tempFiles.some(f => f.path === file)) {
      const fullPath = path.join(rootDir, file);
      
      if (await fs.pathExists(fullPath)) {
        const stats = await fs.stat(fullPath);
        
        if (!stats.isDirectory()) {
          tempFiles.push({
            path: file,
            size: stats.size,
            matchedPattern: '[数字文件名]',
            reason: '数字文件名',
          });
        }
      }
    }
  }

  // 按文件名排序
  tempFiles.sort((a, b) => a.path.localeCompare(b.path));

  return tempFiles;
}

/**
 * 格式化文件大小
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
}

/**
 * 打印临时文件列表
 */
export function printTempFiles(files: TempFile[]): void {
  if (files.length === 0) {
    console.log('✅ 未发现临时文件');
    return;
  }

  console.log(`\n发现 ${files.length} 个临时文件:\n`);
  
  const totalSize = files.reduce((sum, f) => sum + f.size, 0);
  
  for (const file of files) {
    console.log(`  ${file.path}`);
    console.log(`    大小: ${formatFileSize(file.size)}`);
    console.log(`    原因: ${file.reason}`);
    console.log(`    模式: ${file.matchedPattern}`);
    console.log();
  }
  
  console.log(`总大小: ${formatFileSize(totalSize)}`);
}

// CLI 入口
if (import.meta.url === `file://${process.argv[1]}`) {
  identifyTempFiles()
    .then(files => {
      printTempFiles(files);
      process.exit(files.length > 0 ? 1 : 0);
    })
    .catch(error => {
      console.error('错误:', error);
      process.exit(1);
    });
}
