#!/usr/bin/env node

import { identifyTempFiles, printTempFiles, type TempFilePattern } from './identify-temp-files.js';
import { archiveFiles, printArchiveResult } from './archive-files.js';
import { generateManifest } from './generate-manifest.js';
import { parseArgs } from 'node:util';

interface CliOptions {
  dryRun: boolean;
  patterns?: string;
  archiveDir?: string;
  help: boolean;
}

/**
 * 解析命令行参数
 */
function parseCliArgs(): CliOptions {
  const { values } = parseArgs({
    options: {
      'dry-run': {
        type: 'boolean',
        short: 'd',
        default: false,
      },
      patterns: {
        type: 'string',
        short: 'p',
      },
      'archive-dir': {
        type: 'string',
        short: 'a',
      },
      help: {
        type: 'boolean',
        short: 'h',
        default: false,
      },
    },
    allowPositionals: false,
  });

  return {
    dryRun: values['dry-run'] as boolean,
    patterns: values.patterns as string | undefined,
    archiveDir: values['archive-dir'] as string | undefined,
    help: values.help as boolean,
  };
}

/**
 * 打印帮助信息
 */
function printHelp(): void {
  console.log(`
临时文件清理工具

用法:
  npx tsx scripts/cleanup/cleanup-temp-files.ts [选项]

选项:
  -d, --dry-run          模拟运行，不实际移动文件
  -p, --patterns <list>  自定义文件模式（逗号分隔）
  -a, --archive-dir <dir> 指定归档目录
  -h, --help             显示帮助信息

示例:
  # 模拟运行
  npx tsx scripts/cleanup/cleanup-temp-files.ts --dry-run

  # 使用自定义模式
  npx tsx scripts/cleanup/cleanup-temp-files.ts --patterns "*.log,*.cache"

  # 指定归档目录
  npx tsx scripts/cleanup/cleanup-temp-files.ts --archive-dir ./my-archive

默认临时文件模式:
  - fix_*.sh, fix_*.js, fix_*.ts  临时修复脚本
  - test_*.*                      临时测试文件
  - temp_*.*, tmp_*.*             临时文件
  - [0-9], [0-9][0-9]             数字文件名
  - *.tmp, *.bak, *.old, *.backup 临时/备份文件
  - *~                            编辑器备份文件
  - .DS_Store, Thumbs.db          系统文件
`);
}

/**
 * 解析自定义模式
 */
function parseCustomPatterns(patternsStr: string): TempFilePattern[] {
  return patternsStr.split(',').map(pattern => ({
    pattern: pattern.trim(),
    description: '自定义模式',
  }));
}

/**
 * 主函数
 */
async function main(): Promise<void> {
  const options = parseCliArgs();

  if (options.help) {
    printHelp();
    process.exit(0);
  }

  console.log('🧹 临时文件清理工具\n');
  console.log('正在扫描临时文件...\n');

  // 1. 识别临时文件
  const customPatterns = options.patterns ? parseCustomPatterns(options.patterns) : [];
  const tempFiles = await identifyTempFiles({
    customPatterns,
    respectGitignore: true,
  });

  printTempFiles(tempFiles);

  if (tempFiles.length === 0) {
    console.log('\n✨ 项目很干净，没有临时文件需要清理！');
    process.exit(0);
  }

  // 2. 确认操作
  if (!options.dryRun) {
    console.log('\n⚠️  即将归档这些文件到 archive/temp-files/ 目录');
    console.log('提示: 使用 --dry-run 选项可以模拟运行而不实际移动文件\n');
  }

  // 3. 归档文件
  const archiveResult = await archiveFiles(tempFiles, {
    dryRun: options.dryRun,
    archiveDir: options.archiveDir,
    maxRetries: 3,
  });

  printArchiveResult(archiveResult);

  // 4. 生成清单
  if (!options.dryRun && archiveResult.archivedFiles.length > 0) {
    const archiveDir = options.archiveDir || `archive/temp-files/${new Date().toISOString().split('T')[0]}`;
    await generateManifest(tempFiles, archiveResult, {
      archiveDir,
    });
  }

  // 5. 退出
  if (options.dryRun) {
    console.log('\n💡 这是模拟运行，没有文件被实际移动');
    console.log('   移除 --dry-run 选项以执行实际归档操作');
  } else if (archiveResult.success) {
    console.log('\n✅ 清理完成！');
  } else {
    console.log('\n⚠️  清理完成，但有部分文件归档失败');
    process.exit(1);
  }
}

// 运行主函数
main().catch(error => {
  console.error('\n❌ 错误:', error);
  process.exit(1);
});
