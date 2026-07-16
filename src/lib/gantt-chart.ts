export interface GanttTask {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  progress: number;
  milestone: boolean;
  dependencyIds: string[];
}

export interface CriticalPathResult {
  taskIds: string[];
  totalDays: number;
  warnings: string[];
}

export type GanttTemplateId =
  | "software-release"
  | "marketing-campaign"
  | "event-preparation";

interface GanttTemplateTask {
  id: string;
  name: string;
  startOffset: number;
  endOffset: number;
  milestone?: boolean;
  dependencyIds?: string[];
}

const STORAGE_KEY = "u2tool:gantt-project:v1";
const CSV_HEADERS = [
  "id",
  "name",
  "startDate",
  "endDate",
  "progress",
  "milestone",
  "dependencyIds",
] as const;
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const DAY_MS = 24 * 60 * 60 * 1000;

const GANTT_TEMPLATES: Record<GanttTemplateId, readonly GanttTemplateTask[]> = {
  "software-release": [
    { id: "release-plan", name: "Plan release", startOffset: 0, endOffset: 2 },
    { id: "release-build", name: "Build features", startOffset: 3, endOffset: 8, dependencyIds: ["release-plan"] },
    { id: "release-test", name: "Test release", startOffset: 9, endOffset: 12, dependencyIds: ["release-build"] },
    { id: "release-launch", name: "Release", startOffset: 13, endOffset: 13, milestone: true, dependencyIds: ["release-test"] },
  ],
  "marketing-campaign": [
    { id: "campaign-brief", name: "Campaign brief", startOffset: 0, endOffset: 2 },
    { id: "campaign-create", name: "Create campaign", startOffset: 3, endOffset: 8, dependencyIds: ["campaign-brief"] },
    { id: "campaign-launch", name: "Launch campaign", startOffset: 9, endOffset: 9, milestone: true, dependencyIds: ["campaign-create"] },
  ],
  "event-preparation": [
    { id: "event-scope", name: "Define event", startOffset: 0, endOffset: 2 },
    { id: "event-logistics", name: "Arrange logistics", startOffset: 3, endOffset: 9, dependencyIds: ["event-scope"] },
    { id: "event-rehearsal", name: "Run rehearsal", startOffset: 10, endOffset: 11, dependencyIds: ["event-logistics"] },
    { id: "event-day", name: "Event day", startOffset: 12, endOffset: 12, milestone: true, dependencyIds: ["event-rehearsal"] },
  ],
};

function parseCalendarDate(value: string): number | null {
  if (!DATE_PATTERN.test(value)) return null;
  const [year, month, day] = value.split("-").map(Number);
  const timestamp = Date.UTC(year, month - 1, day);
  const date = new Date(timestamp);
  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return null;
  }
  return timestamp;
}

function formatCalendarDate(timestamp: number): string {
  return new Date(timestamp).toISOString().slice(0, 10);
}

export function createGanttTemplate(
  templateId: GanttTemplateId,
  startDate: string,
  names: Readonly<Record<string, string>> = {},
): GanttTask[] {
  const anchor = parseCalendarDate(startDate);
  if (anchor === null) throw new Error("Gantt template requires a valid start date.");

  return GANTT_TEMPLATES[templateId].map((templateTask) => ({
    id: templateTask.id,
    name: names[templateTask.id] ?? templateTask.name,
    startDate: formatCalendarDate(anchor + templateTask.startOffset * DAY_MS),
    endDate: formatCalendarDate(anchor + templateTask.endOffset * DAY_MS),
    progress: 0,
    milestone: templateTask.milestone ?? false,
    dependencyIds: [...(templateTask.dependencyIds ?? [])],
  }));
}

function detectDependencyCycle(tasks: GanttTask[], knownIds: Set<string>): boolean {
  const indegree = new Map(tasks.map((task) => [task.id, 0]));
  const dependents = new Map<string, string[]>();

  for (const task of tasks) {
    for (const dependencyId of new Set(task.dependencyIds)) {
      if (!knownIds.has(dependencyId)) continue;
      indegree.set(task.id, (indegree.get(task.id) ?? 0) + 1);
      dependents.set(dependencyId, [
        ...(dependents.get(dependencyId) ?? []),
        task.id,
      ]);
    }
  }

  const ready = [...indegree.entries()]
    .filter(([, count]) => count === 0)
    .map(([id]) => id)
    .sort();
  let visited = 0;

  while (ready.length > 0) {
    const id = ready.shift()!;
    visited += 1;
    for (const dependentId of (dependents.get(id) ?? []).sort()) {
      const nextCount = (indegree.get(dependentId) ?? 0) - 1;
      indegree.set(dependentId, nextCount);
      if (nextCount === 0) {
        ready.push(dependentId);
        ready.sort();
      }
    }
  }

  return visited !== tasks.length;
}

export function validateGanttTasks(tasks: GanttTask[]): string[] {
  const warnings: string[] = [];
  const ids = new Set<string>();

  for (const task of tasks) {
    if (ids.has(task.id)) {
      warnings.push(`Duplicate task ID "${task.id}".`);
    }
    ids.add(task.id);
  }

  for (const task of tasks) {
    const start = parseCalendarDate(task.startDate);
    const end = parseCalendarDate(task.endDate);
    if (start === null) {
      warnings.push(`Task "${task.id}" has an invalid start date.`);
    }
    if (end === null) {
      warnings.push(`Task "${task.id}" has an invalid end date.`);
    }
    if (start !== null && end !== null && end < start) {
      warnings.push(`Task "${task.id}" ends before it starts.`);
    }
    if (!Number.isFinite(task.progress) || task.progress < 0 || task.progress > 100) {
      warnings.push(`Task "${task.id}" has progress outside 0 to 100.`);
    }
    for (const dependencyId of task.dependencyIds) {
      if (!ids.has(dependencyId)) {
        warnings.push(
          `Task "${task.id}" references missing dependency "${dependencyId}".`,
        );
      }
    }
  }

  if (ids.size === tasks.length && detectDependencyCycle(tasks, ids)) {
    warnings.push("Dependency cycle detected.");
  }

  return warnings;
}

function taskDuration(task: GanttTask): number {
  if (task.milestone) return 0;
  const start = parseCalendarDate(task.startDate)!;
  const end = parseCalendarDate(task.endDate)!;
  return Math.floor((end - start) / DAY_MS) + 1;
}

function comparePaths(left: string[], right: string[]): number {
  if (left.length !== right.length) return right.length - left.length;
  return left.join("\u0000").localeCompare(right.join("\u0000"), "en");
}

export function calculateCriticalPath(tasks: GanttTask[]): CriticalPathResult {
  const warnings = validateGanttTasks(tasks);
  if (warnings.length > 0 || tasks.length === 0) {
    return { taskIds: [], totalDays: 0, warnings };
  }

  const taskById = new Map(tasks.map((task) => [task.id, task]));
  const indegree = new Map(tasks.map((task) => [task.id, task.dependencyIds.length]));
  const dependents = new Map<string, string[]>();
  for (const task of tasks) {
    for (const dependencyId of task.dependencyIds) {
      dependents.set(dependencyId, [
        ...(dependents.get(dependencyId) ?? []),
        task.id,
      ]);
    }
  }

  const ready = tasks
    .filter((task) => task.dependencyIds.length === 0)
    .map((task) => task.id)
    .sort();
  const totals = new Map<string, number>();
  const paths = new Map<string, string[]>();

  while (ready.length > 0) {
    const id = ready.shift()!;
    const currentTask = taskById.get(id)!;
    const duration = taskDuration(currentTask);
    let bestTotal = duration;
    let bestPath = [id];

    for (const dependencyId of [...currentTask.dependencyIds].sort()) {
      const candidateTotal = (totals.get(dependencyId) ?? 0) + duration;
      const candidatePath = [...(paths.get(dependencyId) ?? []), id];
      if (
        candidateTotal > bestTotal ||
        (candidateTotal === bestTotal && comparePaths(candidatePath, bestPath) < 0)
      ) {
        bestTotal = candidateTotal;
        bestPath = candidatePath;
      }
    }

    totals.set(id, bestTotal);
    paths.set(id, bestPath);

    for (const dependentId of (dependents.get(id) ?? []).sort()) {
      const nextCount = (indegree.get(dependentId) ?? 0) - 1;
      indegree.set(dependentId, nextCount);
      if (nextCount === 0) {
        ready.push(dependentId);
        ready.sort();
      }
    }
  }

  let criticalTaskIds: string[] = [];
  let totalDays = 0;
  for (const id of [...taskById.keys()].sort()) {
    const candidateTotal = totals.get(id) ?? 0;
    const candidatePath = paths.get(id) ?? [];
    if (
      candidateTotal > totalDays ||
      (candidateTotal === totalDays &&
        comparePaths(candidatePath, criticalTaskIds) < 0)
    ) {
      totalDays = candidateTotal;
      criticalTaskIds = candidatePath;
    }
  }

  return { taskIds: criticalTaskIds, totalDays, warnings: [] };
}

function parseTask(value: unknown, index: number): GanttTask {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    throw new Error(`Task at index ${index} must be an object.`);
  }
  const record = value as Record<string, unknown>;
  if (typeof record.id !== "string" || record.id.length === 0) {
    throw new Error(`Task at index ${index} has an invalid ID.`);
  }
  if (typeof record.name !== "string") {
    throw new Error(`Task at index ${index} has an invalid name.`);
  }
  if (typeof record.startDate !== "string" || parseCalendarDate(record.startDate) === null) {
    throw new Error(`Task at index ${index} has an invalid start date.`);
  }
  if (typeof record.endDate !== "string" || parseCalendarDate(record.endDate) === null) {
    throw new Error(`Task at index ${index} has an invalid end date.`);
  }
  if (
    typeof record.progress !== "number" ||
    !Number.isFinite(record.progress) ||
    record.progress < 0 ||
    record.progress > 100
  ) {
    throw new Error(`Task at index ${index} has an invalid progress value.`);
  }
  if (typeof record.milestone !== "boolean") {
    throw new Error(`Task at index ${index} has an invalid milestone value.`);
  }
  if (
    !Array.isArray(record.dependencyIds) ||
    record.dependencyIds.some((id) => typeof id !== "string")
  ) {
    throw new Error(`Task at index ${index} has invalid dependency IDs.`);
  }

  return {
    id: record.id,
    name: record.name,
    startDate: record.startDate,
    endDate: record.endDate,
    progress: record.progress,
    milestone: record.milestone,
    dependencyIds: [...record.dependencyIds] as string[],
  };
}

function parseTaskArray(value: unknown): GanttTask[] {
  if (!Array.isArray(value)) {
    throw new Error("Gantt project must be an array of tasks.");
  }
  return value.map(parseTask);
}

export function ganttTasksToJson(tasks: GanttTask[]): string {
  return JSON.stringify(tasks, null, 2);
}

export function ganttTasksFromJson(input: string): GanttTask[] {
  let value: unknown;
  try {
    value = JSON.parse(input);
  } catch {
    throw new Error("Gantt project is not valid JSON.");
  }
  return parseTaskArray(value);
}

function quoteCsvCell(value: string): string {
  if (!/[",\r\n]/.test(value)) return value;
  return `"${value.replaceAll('"', '""')}"`;
}

export function ganttTasksToCsv(tasks: GanttTask[]): string {
  const rows = tasks.map((task) => [
    task.id,
    task.name,
    task.startDate,
    task.endDate,
    String(task.progress),
    String(task.milestone),
    JSON.stringify(task.dependencyIds),
  ]);
  return [CSV_HEADERS, ...rows]
    .map((row) => row.map((cell) => quoteCsvCell(cell)).join(","))
    .join("\n");
}

function parseCsvRows(input: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let quoted = false;

  for (let index = 0; index < input.length; index += 1) {
    const character = input[index];
    if (quoted) {
      if (character === '"' && input[index + 1] === '"') {
        field += '"';
        index += 1;
      } else if (character === '"') {
        quoted = false;
      } else {
        field += character;
      }
      continue;
    }

    if (character === '"' && field.length === 0) {
      quoted = true;
    } else if (character === ",") {
      row.push(field);
      field = "";
    } else if (character === "\n" || character === "\r") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
      if (character === "\r" && input[index + 1] === "\n") index += 1;
    } else {
      field += character;
    }
  }

  if (quoted) throw new Error("Gantt CSV contains an unterminated quoted field.");
  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  return rows;
}

export function ganttTasksFromCsv(input: string): GanttTask[] {
  const rows = parseCsvRows(input);
  if (rows.length === 0) throw new Error("Gantt CSV is empty.");
  if (
    rows[0].length !== CSV_HEADERS.length ||
    rows[0].some((header, index) => header !== CSV_HEADERS[index])
  ) {
    throw new Error(`Gantt CSV must use headers: ${CSV_HEADERS.join(",")}.`);
  }

  const values = rows.slice(1).map((row, index) => {
    if (row.length !== CSV_HEADERS.length) {
      throw new Error(`CSV row ${index + 2} has the wrong number of columns.`);
    }
    let dependencyIds: unknown;
    try {
      dependencyIds = JSON.parse(row[6]);
    } catch {
      throw new Error(`CSV row ${index + 2} has invalid dependency IDs.`);
    }
    return {
      id: row[0],
      name: row[1],
      startDate: row[2],
      endDate: row[3],
      progress: Number(row[4]),
      milestone: row[5] === "true" ? true : row[5] === "false" ? false : row[5],
      dependencyIds,
    };
  });

  return parseTaskArray(values);
}

export function readGanttProject(
  storage: Pick<Storage, "getItem">,
): GanttTask[] {
  const stored = storage.getItem(STORAGE_KEY);
  if (stored === null || stored === "") return [];
  try {
    return ganttTasksFromJson(stored);
  } catch {
    return [];
  }
}

export function writeGanttProject(
  storage: Pick<Storage, "setItem">,
  tasks: GanttTask[],
): void {
  storage.setItem(STORAGE_KEY, ganttTasksToJson(tasks));
}

export function clearGanttProject(
  storage: Pick<Storage, "removeItem">,
): void {
  storage.removeItem(STORAGE_KEY);
}
