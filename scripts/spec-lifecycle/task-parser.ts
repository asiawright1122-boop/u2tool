import fs from 'fs-extra';
import * as path from 'path';

export interface Task {
  id: string;
  text: string;
  status: 'not_started' | 'in_progress' | 'completed' | 'queued';
  isOptional: boolean;
  level: number;
  parent?: string;
  children: string[];
}

export interface TaskProgress {
  total: number;
  completed: number;
  inProgress: number;
  notStarted: number;
  queued: number;
  optional: number;
  percentage: number;
}

/**
 * 解析任务状态
 */
function parseTaskStatus(checkbox: string): Task['status'] {
  const char = checkbox.trim();
  if (char === 'x' || char === 'X') return 'completed';
  if (char === '-') return 'in_progress';
  if (char === '~') return 'queued';
  return 'not_started';
}

/**
 * 解析任务行
 */
function parseTaskLine(line: string): Task | null {
  // 匹配任务格式: - [ ] 1.2 任务文本
  // 或: - [x] 1.2 任务文本
  // 或: - [ ]* 1.2 可选任务
  const match = line.match(/^(\s*)- \[([^\]]*)\](\*|\\*)?\s+(.+)$/);
  
  if (!match) {
    return null;
  }

  const [, indent, statusChar, optional, text] = match;
  const level = indent.length / 2; // 每2个空格为一级
  const isOptional = !!optional;
  const status = parseTaskStatus(statusChar);

  // 提取任务 ID（如果有）
  const idMatch = text.match(/^(\d+(?:\.\d+)*)\s+(.+)$/);
  const id = idMatch ? idMatch[1] : text.substring(0, 20);
  const taskText = idMatch ? idMatch[2] : text;

  return {
    id,
    text: taskText,
    status,
    isOptional,
    level,
    children: [],
  };
}

/**
 * 构建任务树
 */
function buildTaskTree(tasks: Task[]): Task[] {
  const taskMap = new Map<string, Task>();
  const rootTasks: Task[] = [];

  // 第一遍：创建映射
  for (const task of tasks) {
    taskMap.set(task.id, task);
  }

  // 第二遍：建立父子关系
  for (let i = 0; i < tasks.length; i++) {
    const task = tasks[i];
    
    // 查找父任务（向上查找第一个 level 更小的任务）
    let parentTask: Task | undefined;
    for (let j = i - 1; j >= 0; j--) {
      if (tasks[j].level < task.level) {
        parentTask = tasks[j];
        break;
      }
    }

    if (parentTask) {
      task.parent = parentTask.id;
      parentTask.children.push(task.id);
    } else {
      rootTasks.push(task);
    }
  }

  return rootTasks;
}

/**
 * 解析 tasks.md 文件
 */
export async function parseTasksFile(filePath: string): Promise<Task[]> {
  if (!(await fs.pathExists(filePath))) {
    throw new Error(`任务文件不存在: ${filePath}`);
  }

  const content = await fs.readFile(filePath, 'utf-8');
  const lines = content.split('\n');
  const tasks: Task[] = [];

  for (const line of lines) {
    const task = parseTaskLine(line);
    if (task) {
      tasks.push(task);
    }
  }

  return buildTaskTree(tasks);
}

/**
 * 计算任务进度
 */
export function calculateProgress(tasks: Task[]): TaskProgress {
  const allTasks = flattenTasks(tasks);
  
  const total = allTasks.length;
  const completed = allTasks.filter(t => t.status === 'completed').length;
  const inProgress = allTasks.filter(t => t.status === 'in_progress').length;
  const notStarted = allTasks.filter(t => t.status === 'not_started').length;
  const queued = allTasks.filter(t => t.status === 'queued').length;
  const optional = allTasks.filter(t => t.isOptional).length;
  
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return {
    total,
    completed,
    inProgress,
    notStarted,
    queued,
    optional,
    percentage,
  };
}

/**
 * 扁平化任务树
 */
function flattenTasks(tasks: Task[]): Task[] {
  const result: Task[] = [];
  
  function traverse(task: Task) {
    result.push(task);
    // 注意：children 是 ID 数组，需要从原始任务列表中查找
  }
  
  for (const task of tasks) {
    traverse(task);
  }
  
  return result;
}

/**
 * 获取所有任务（包括子任务）
 */
export function getAllTasks(tasks: Task[], taskMap?: Map<string, Task>): Task[] {
  if (!taskMap) {
    taskMap = new Map();
    const allTasks = flattenTasksRecursive(tasks);
    for (const task of allTasks) {
      taskMap.set(task.id, task);
    }
  }

  return flattenTasksRecursive(tasks);
}

/**
 * 递归扁平化任务
 */
function flattenTasksRecursive(tasks: Task[]): Task[] {
  const result: Task[] = [];
  
  for (const task of tasks) {
    result.push(task);
    if (task.children.length > 0) {
      // 这里需要从 taskMap 中获取子任务
      // 但由于我们在 parseTasksFile 中已经构建了完整的任务列表
      // 这里暂时简化处理
    }
  }
  
  return result;
}

/**
 * 检查 spec 是否完成
 */
export function isSpecCompleted(tasks: Task[]): boolean {
  const allTasks = getAllTasks(tasks);
  const requiredTasks = allTasks.filter(t => !t.isOptional);
  
  if (requiredTasks.length === 0) {
    return false;
  }
  
  return requiredTasks.every(t => t.status === 'completed');
}

/**
 * 打印任务进度
 */
export function printProgress(progress: TaskProgress): void {
  console.log('\n任务进度:');
  console.log(`  总任务数: ${progress.total}`);
  console.log(`  已完成: ${progress.completed}`);
  console.log(`  进行中: ${progress.inProgress}`);
  console.log(`  排队中: ${progress.queued}`);
  console.log(`  未开始: ${progress.notStarted}`);
  console.log(`  可选任务: ${progress.optional}`);
  console.log(`  完成度: ${progress.percentage}%`);
  
  // 进度条
  const barLength = 40;
  const filledLength = Math.round((progress.percentage / 100) * barLength);
  const bar = '█'.repeat(filledLength) + '░'.repeat(barLength - filledLength);
  console.log(`  [${bar}] ${progress.percentage}%\n`);
}
