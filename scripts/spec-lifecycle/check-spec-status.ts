import fs from 'fs-extra';
import * as path from 'path';
import { parseTasksFile, calculateProgress, isSpecCompleted, printProgress, type Task, type TaskProgress } from './task-parser.js';

export interface SpecStatus {
  name: string;
  path: string;
  hasRequirements: boolean;
  hasDesign: boolean;
  hasTasks: boolean;
  hasConfig: boolean;
  tasks?: Task[];
  progress?: TaskProgress;
  isCompleted: boolean;
  canArchive: boolean;
}

/**
 * 检查 spec 状态
 */
export async function checkSpecStatus(specPath: string): Promise<SpecStatus> {
  const specName = path.basename(specPath);
  
  // 检查必需文件
  const requirementsPath = path.join(specPath, 'requirements.md');
  const designPath = path.join(specPath, 'design.md');
  const tasksPath = path.join(specPath, 'tasks.md');
  const configPath = path.join(specPath, '.config.kiro');
  const bugfixPath = path.join(specPath, 'bugfix.md');

  const hasRequirements = await fs.pathExists(requirementsPath) || await fs.pathExists(bugfixPath);
  const hasDesign = await fs.pathExists(designPath);
  const hasTasks = await fs.pathExists(tasksPath);
  const hasConfig = await fs.pathExists(configPath);

  let tasks: Task[] | undefined;
  let progress: TaskProgress | undefined;
  let isCompleted = false;

  // 解析任务文件
  if (hasTasks) {
    try {
      tasks = await parseTasksFile(tasksPath);
      progress = calculateProgress(tasks);
      isCompleted = isSpecCompleted(tasks);
    } catch (error) {
      console.warn(`警告: 解析任务文件失败 (${specName}):`, error);
    }
  }

  // 判断是否可以归档
  const canArchive = hasRequirements && hasDesign && hasTasks && isCompleted;

  return {
    name: specName,
    path: specPath,
    hasRequirements,
    hasDesign,
    hasTasks,
    hasConfig,
    tasks,
    progress,
    isCompleted,
    canArchive,
  };
}

/**
 * 检查所有 spec 的状态
 */
export async function checkAllSpecs(specsDir: string): Promise<SpecStatus[]> {
  if (!(await fs.pathExists(specsDir))) {
    throw new Error(`Spec 目录不存在: ${specsDir}`);
  }

  const entries = await fs.readdir(specsDir, { withFileTypes: true });
  const specDirs = entries.filter(e => e.isDirectory()).map(e => path.join(specsDir, e.name));

  const statuses: SpecStatus[] = [];

  for (const specDir of specDirs) {
    try {
      const status = await checkSpecStatus(specDir);
      statuses.push(status);
    } catch (error) {
      console.warn(`警告: 检查 spec 状态失败 (${path.basename(specDir)}):`, error);
    }
  }

  return statuses;
}

/**
 * 打印 spec 状态
 */
export function printSpecStatus(status: SpecStatus): void {
  console.log(`\nSpec: ${status.name}`);
  console.log(`  路径: ${status.path}`);
  console.log(`  需求文档: ${status.hasRequirements ? '✓' : '✗'}`);
  console.log(`  设计文档: ${status.hasDesign ? '✓' : '✗'}`);
  console.log(`  任务列表: ${status.hasTasks ? '✓' : '✗'}`);
  console.log(`  配置文件: ${status.hasConfig ? '✓' : '✗'}`);
  
  if (status.progress) {
    console.log(`  任务进度: ${status.progress.completed}/${status.progress.total} (${status.progress.percentage}%)`);
  }
  
  console.log(`  已完成: ${status.isCompleted ? '✓' : '✗'}`);
  console.log(`  可归档: ${status.canArchive ? '✓' : '✗'}`);
}

/**
 * 打印所有 spec 的状态摘要
 */
export function printSpecsSummary(statuses: SpecStatus[]): void {
  console.log('\n=== Spec 状态摘要 ===\n');
  
  const total = statuses.length;
  const completed = statuses.filter(s => s.isCompleted).length;
  const canArchive = statuses.filter(s => s.canArchive).length;
  const inProgress = statuses.filter(s => !s.isCompleted && s.progress && s.progress.inProgress > 0).length;
  
  console.log(`总 Spec 数: ${total}`);
  console.log(`已完成: ${completed}`);
  console.log(`可归档: ${canArchive}`);
  console.log(`进行中: ${inProgress}`);
  console.log(`未开始: ${total - completed - inProgress}\n`);

  if (canArchive > 0) {
    console.log('可归档的 Spec:');
    for (const status of statuses.filter(s => s.canArchive)) {
      console.log(`  - ${status.name} (${status.progress?.percentage}%)`);
    }
    console.log();
  }

  if (inProgress > 0) {
    console.log('进行中的 Spec:');
    for (const status of statuses.filter(s => !s.isCompleted && s.progress && s.progress.inProgress > 0)) {
      console.log(`  - ${status.name} (${status.progress?.percentage}%)`);
    }
    console.log();
  }
}

// CLI 入口
if (import.meta.url === `file://${process.argv[1]}`) {
  const specsDir = process.argv[2] || '.kiro/specs';
  
  checkAllSpecs(specsDir)
    .then(statuses => {
      printSpecsSummary(statuses);
      
      if (process.argv.includes('--verbose')) {
        for (const status of statuses) {
          printSpecStatus(status);
        }
      }
    })
    .catch(error => {
      console.error('错误:', error);
      process.exit(1);
    });
}
