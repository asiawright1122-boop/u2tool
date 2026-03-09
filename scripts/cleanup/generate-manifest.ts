import fs from 'fs-extra';
import * as path from 'path';
import type { TempFile } from './identify-temp-files.js';
import type { ArchiveResult } from './archive-files.js';

export interface ManifestOptions {
  rootDir?: string;
  archiveDir: string;
  outputPath?: string;
}

export interface ManifestData {
  timestamp: string;
  archiveDir: string;
  files: TempFile[];
  result: ArchiveResult;
  statistics: {
    totalFiles: number;
    successfulFiles: number;
    failedFiles: number;
    totalSize: number;
  };
}

/**
 * 生成归档清单
 */
export async function generateManifest(
  files: TempFile[],
  result: ArchiveResult,
  options: ManifestOptions
): Promise<string> {
  const {
    rootDir = process.cwd(),
    archiveDir,
    outputPath,
  } = options;

  const manifestData: ManifestData = {
    timestamp: new Date().toISOString(),
    archiveDir: path.relative(rootDir, archiveDir),
    files,
    result,
    statistics: {
      totalFiles: files.length,
      successfulFiles: result.archivedFiles.length,
      failedFiles: result.failedFiles.length,
      totalSize: result.totalSize,
    },
  };

  const markdown = generateMarkdown(manifestData);

  // 保存清单文件
  const manifestPath = outputPath || path.join(archiveDir, 'MANIFEST.md');
  await fs.ensureDir(path.dirname(manifestPath));
  await fs.writeFile(manifestPath, markdown, 'utf-8');

  console.log(`\n✓ 归档清单已生成: ${path.relative(rootDir, manifestPath)}`);

  return manifestPath;
}

/**
 * 生成 Markdown 格式的清单
 */
function generateMarkdown(data: ManifestData): string {
  const lines: string[] = [];

  // 标题
  lines.push('# 临时文件归档清单\n');

  // 基本信息
  lines.push('## 归档信息\n');
  lines.push(`- **归档时间**: ${new Date(data.timestamp).toLocaleString('zh-CN')}`);
  lines.push(`- **归档目录**: \`${data.archiveDir}\``);
  lines.push(`- **文件总数**: ${data.statistics.totalFiles}`);
  lines.push(`- **成功归档**: ${data.statistics.successfulFiles}`);
  lines.push(`- **归档失败**: ${data.statistics.failedFiles}`);
  lines.push(`- **总大小**: ${formatFileSize(data.statistics.totalSize)}\n`);

  // 成功归档的文件
  if (data.result.archivedFiles.length > 0) {
    lines.push('## 已归档文件\n');
    lines.push('| 文件路径 | 大小 | 原因 | 匹配模式 |');
    lines.push('|---------|------|------|----------|');

    for (const filePath of data.result.archivedFiles) {
      const file = data.files.find(f => f.path === filePath);
      if (file) {
        lines.push(
          `| \`${file.path}\` | ${formatFileSize(file.size)} | ${file.reason} | \`${file.matchedPattern}\` |`
        );
      }
    }
    lines.push('');
  }

  // 失败的文件
  if (data.result.failedFiles.length > 0) {
    lines.push('## 归档失败的文件\n');
    lines.push('| 文件路径 | 错误信息 |');
    lines.push('|---------|----------|');

    for (const { file, error } of data.result.failedFiles) {
      lines.push(`| \`${file}\` | ${error} |`);
    }
    lines.push('');
  }

  // 按原因分组统计
  lines.push('## 文件分类统计\n');
  const groupedByReason = groupFilesByReason(data.files, data.result.archivedFiles);
  lines.push('| 类别 | 数量 | 总大小 |');
  lines.push('|------|------|--------|');

  for (const [reason, { count, size }] of Object.entries(groupedByReason)) {
    lines.push(`| ${reason} | ${count} | ${formatFileSize(size)} |`);
  }
  lines.push('');

  // 按模式分组统计
  lines.push('## 匹配模式统计\n');
  const groupedByPattern = groupFilesByPattern(data.files, data.result.archivedFiles);
  lines.push('| 模式 | 数量 | 总大小 |');
  lines.push('|------|------|--------|');

  for (const [pattern, { count, size }] of Object.entries(groupedByPattern)) {
    lines.push(`| \`${pattern}\` | ${count} | ${formatFileSize(size)} |`);
  }
  lines.push('');

  // 注意事项
  lines.push('## 注意事项\n');
  lines.push('- 归档的文件已从原位置移动到归档目录');
  lines.push('- 如需恢复文件，请从归档目录复制回原位置');
  lines.push('- 建议定期清理旧的归档文件以节省空间');
  lines.push('- 归档目录结构保持与原目录结构一致\n');

  return lines.join('\n');
}

/**
 * 按原因分组文件
 */
function groupFilesByReason(
  files: TempFile[],
  archivedFiles: string[]
): Record<string, { count: number; size: number }> {
  const groups: Record<string, { count: number; size: number }> = {};

  for (const file of files) {
    if (!archivedFiles.includes(file.path)) {
      continue;
    }

    if (!groups[file.reason]) {
      groups[file.reason] = { count: 0, size: 0 };
    }

    groups[file.reason].count++;
    groups[file.reason].size += file.size;
  }

  return groups;
}

/**
 * 按模式分组文件
 */
function groupFilesByPattern(
  files: TempFile[],
  archivedFiles: string[]
): Record<string, { count: number; size: number }> {
  const groups: Record<string, { count: number; size: number }> = {};

  for (const file of files) {
    if (!archivedFiles.includes(file.path)) {
      continue;
    }

    if (!groups[file.matchedPattern]) {
      groups[file.matchedPattern] = { count: 0, size: 0 };
    }

    groups[file.matchedPattern].count++;
    groups[file.matchedPattern].size += file.size;
  }

  return groups;
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
