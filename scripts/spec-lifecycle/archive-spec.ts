#!/usr/bin/env node

import fs from 'fs-extra';
import * as path from 'path';
import { checkSpecStatus, type SpecStatus } from './check-spec-status.js';
import { parseArgs } from 'node:util';

export interface ArchiveOptions {
  force?: boolean;
  dryRun?: boolean;
  archiveRoot?: string;
}

export interface ArchiveResult {
  success: boolean;
  specName: string;
  sourcePath: string;
  targetPath?: string;
  error?: string;
}

/**
 * 读取 spec 配置
 */
async function readSpecConfig(specPath: string): Promise<{ specType?: string; workflowType?: string }> {
  const configPath = path.join(specPath, '.config.kiro');
  
  if (!(await fs.pathExists(configPath))) {
    return {};
  }

  try {
    const content = await fs.readFile(configPath, 'utf-8');
    const config = JSON.parse(content);
    return {
      specType: config.specType,
      workflowType: config.workflowType,
    };
  } catch (error) {
    console.warn(`警告: 读取配置文件失败:`, error);
    return {};
  }
}

/**
 * 生成归档路径
 */
function getArchivePath(
  specName: string,
  specType: string = 'feature',
  archiveRoot: string = '.kiro/specs/archive'
): string {
  const year = new Date().getFullYear();
  return path.join(archiveRoot, specType, String(year), specName);
}

/**
 * 归档单个 spec
 */
export async function archiveSpec(
  specPath: string,
  options: ArchiveOptions = {}
): Promise<ArchiveResult> {
  const {
    force = false,
    dryRun = false,
    archiveRoot = '.kiro/specs/archive',
  } = options;

  const specName = path.basename(specPath);
  const result: ArchiveResult = {
    success: false,
    specName,
    sourcePath: specPath,
  };

  try {
    // 1. 检查 spec 状态
    const status = await checkSpecStatus(specPath);

    if (!force && !status.canArchive) {
      result.error = 'Spec 未完成，无法归档（使用 --force 强制归档）';
      return result;
    }

    // 2. 读取配置确定类型
    const config = await readSpecConfig(specPath);
    const specType = config.specType || 'feature';

    // 3. 生成目标路径
    const targetPath = getArchivePath(specName, specType, archiveRoot);
    result.targetPath = targetPath;

    // 4. 检查目标是否已存在
    if (await fs.pathExists(targetPath)) {
      result.error = `归档目标已存在: ${targetPath}`;
      return result;
    }

    if (dryRun) {
      console.log(`[DRY RUN] 将归档: ${specPath} -> ${targetPath}`);
      result.success = true;
      return result;
    }

    // 5. 创建归档目录
    await fs.ensureDir(path.dirname(targetPath));

    // 6. 移动 spec 目录
    await fs.move(specPath, targetPath);

    console.log(`✓ 已归档: ${specName} -> ${path.relative(process.cwd(), targetPath)}`);
    result.success = true;

    // 7. 更新归档索引
    await updateArchiveIndex(archiveRoot, specName, specType, status);

  } catch (error) {
    result.error = error instanceof Error ? error.message : String(error);
    console.error(`✗ 归档失败: ${specName} - ${result.error}`);
  }

  return result;
}

/**
 * 更新归档索引
 */
export async function updateArchiveIndex(
  archiveRoot: string,
  specName: string,
  specType: string,
  status: SpecStatus
): Promise<void> {
  const indexPath = path.join(archiveRoot, 'ARCHIVE_INDEX.md');
  const year = new Date().getFullYear();
  const date = new Date().toISOString().split('T')[0];

  // 读取现有索引
  let content = '';
  if (await fs.pathExists(indexPath)) {
    content = await fs.readFile(indexPath, 'utf-8');
  } else {
    content = `# Spec 归档索引\n\n本文件记录所有已归档的 spec。\n\n`;
  }

  // 查找或创建年份章节
  const yearHeader = `## ${year}`;
  if (!content.includes(yearHeader)) {
    content += `\n${yearHeader}\n\n`;
  }

  // 查找或创建类型章节
  const typeHeader = `### ${specType}`;
  const yearIndex = content.indexOf(yearHeader);
  const nextYearIndex = content.indexOf('\n## ', yearIndex + 1);
  const yearSection = nextYearIndex > 0 
    ? content.substring(yearIndex, nextYearIndex)
    : content.substring(yearIndex);

  if (!yearSection.includes(typeHeader)) {
    const insertPos = nextYearIndex > 0 ? nextYearIndex : content.length;
    content = content.substring(0, insertPos) + `\n${typeHeader}\n\n` + content.substring(insertPos);
  }

  // 添加 spec 条目
  const entry = `- **${specName}** (${date}) - ${status.progress?.percentage || 0}% 完成\n`;
  const typeIndex = content.indexOf(typeHeader);
  const nextTypeIndex = content.indexOf('\n### ', typeIndex + 1);
  const insertPos = nextTypeIndex > 0 ? nextTypeIndex : content.length;

  content = content.substring(0, insertPos) + `  ${entry}` + content.substring(insertPos);

  // 写入索引文件
  await fs.writeFile(indexPath, content, 'utf-8');
}

/**
 * 批量归档 spec
 */
export async function archiveMultipleSpecs(
  specPaths: string[],
  options: ArchiveOptions = {}
): Promise<ArchiveResult[]> {
  const results: ArchiveResult[] = [];

  for (const specPath of specPaths) {
    const result = await archiveSpec(specPath, options);
    results.push(result);
  }

  return results;
}

/**
 * 打印归档结果
 */
export function printArchiveResults(results: ArchiveResult[]): void {
  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);

  console.log(`\n归档结果:`);
  console.log(`  成功: ${successful.length}`);
  console.log(`  失败: ${failed.length}`);

  if (failed.length > 0) {
    console.log(`\n失败的 spec:`);
    for (const result of failed) {
      console.log(`  ${result.specName}: ${result.error}`);
    }
  }
}

// CLI 入口
if (import.meta.url === `file://${process.argv[1]}`) {
  const { values, positionals } = parseArgs({
    options: {
      force: {
        type: 'boolean',
        short: 'f',
        default: false,
      },
      'dry-run': {
        type: 'boolean',
        short: 'd',
        default: false,
      },
      'archive-root': {
        type: 'string',
        short: 'a',
      },
      help: {
        type: 'boolean',
        short: 'h',
        default: false,
      },
    },
    allowPositionals: true,
  });

  if (values.help) {
    console.log(`
Spec 归档工具

用法:
  npx tsx scripts/spec-lifecycle/archive-spec.ts [选项] <spec-path>

选项:
  -f, --force            强制归档（即使未完成）
  -d, --dry-run          模拟运行
  -a, --archive-root <dir> 指定归档根目录
  -h, --help             显示帮助信息

示例:
  # 归档单个 spec
  npx tsx scripts/spec-lifecycle/archive-spec.ts .kiro/specs/my-feature

  # 模拟运行
  npx tsx scripts/spec-lifecycle/archive-spec.ts --dry-run .kiro/specs/my-feature

  # 强制归档未完成的 spec
  npx tsx scripts/spec-lifecycle/archive-spec.ts --force .kiro/specs/my-feature
`);
    process.exit(0);
  }

  if (positionals.length === 0) {
    console.error('错误: 请指定要归档的 spec 路径');
    process.exit(1);
  }

  const specPath = positionals[0];
  const options: ArchiveOptions = {
    force: values.force as boolean,
    dryRun: values['dry-run'] as boolean,
    archiveRoot: values['archive-root'] as string | undefined,
  };

  archiveSpec(specPath, options)
    .then(result => {
      if (!result.success) {
        console.error(`\n归档失败: ${result.error}`);
        process.exit(1);
      }
      console.log(`\n✅ 归档成功`);
    })
    .catch(error => {
      console.error('\n错误:', error);
      process.exit(1);
    });
}
