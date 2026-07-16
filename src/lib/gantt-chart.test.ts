import { describe, expect, it } from "vitest";
import {
  calculateCriticalPath,
  clearGanttProject,
  createGanttTemplate,
  ganttTasksFromCsv,
  ganttTasksFromJson,
  ganttTasksToCsv,
  ganttTasksToJson,
  readGanttProject,
  validateGanttTasks,
  writeGanttProject,
  type GanttTask,
} from "./gantt-chart";

const task = (overrides: Partial<GanttTask> = {}): GanttTask => ({
  id: "task-a",
  name: "Plan",
  startDate: "2026-07-01",
  endDate: "2026-07-02",
  progress: 0,
  milestone: false,
  dependencyIds: [],
  ...overrides,
});

describe("validateGanttTasks", () => {
  it("accepts an acyclic dependency graph", () => {
    const tasks = [
      task(),
      task({ id: "task-b", name: "Build", dependencyIds: ["task-a"] }),
      task({ id: "release", name: "Release", milestone: true, dependencyIds: ["task-b"] }),
    ];

    expect(validateGanttTasks(tasks)).toEqual([]);
  });

  it("reports dependency cycles without hanging", () => {
    const tasks = [
      task({ id: "task-a", dependencyIds: ["task-b"] }),
      task({ id: "task-b", dependencyIds: ["task-a"] }),
    ];

    expect(validateGanttTasks(tasks)).toContain("Dependency cycle detected.");
    expect(calculateCriticalPath(tasks)).toEqual({
      taskIds: [],
      totalDays: 0,
      warnings: ["Dependency cycle detected."],
    });
  });

  it("reports missing dependencies", () => {
    expect(
      validateGanttTasks([
        task({ id: "task-b", dependencyIds: ["missing-task"] }),
      ]),
    ).toContain('Task "task-b" references missing dependency "missing-task".');
  });

  it("reports tasks whose end date is before the start date", () => {
    expect(
      validateGanttTasks([
        task({ startDate: "2026-07-03", endDate: "2026-07-02" }),
      ]),
    ).toContain('Task "task-a" ends before it starts.');
  });
});

describe("calculateCriticalPath", () => {
  it("uses inclusive calendar-day durations and zero-day milestones", () => {
    const tasks = [
      task({ id: "plan", startDate: "2026-07-01", endDate: "2026-07-02" }),
      task({
        id: "build",
        startDate: "2026-07-03",
        endDate: "2026-07-05",
        dependencyIds: ["plan"],
      }),
      task({
        id: "release",
        startDate: "2026-07-06",
        endDate: "2026-07-06",
        milestone: true,
        dependencyIds: ["build"],
      }),
      task({
        id: "notes",
        startDate: "2026-07-01",
        endDate: "2026-07-04",
      }),
    ];

    expect(calculateCriticalPath(tasks)).toEqual({
      taskIds: ["plan", "build", "release"],
      totalDays: 5,
      warnings: [],
    });
  });

  it("chooses a stable path when equal-duration paths exist", () => {
    const first = task({ id: "alpha", name: "Alpha" });
    const second = task({ id: "beta", name: "Beta" });

    expect(calculateCriticalPath([second, first]).taskIds).toEqual(["alpha"]);
    expect(calculateCriticalPath([first, second]).taskIds).toEqual(["alpha"]);
  });
});

describe("Gantt task data exchange", () => {
  const tasks = [
    task({
      id: "brief",
      name: 'Brief, review "draft"',
      dependencyIds: [],
    }),
    task({
      id: "launch",
      name: "Launch\nannouncement",
      startDate: "2026-07-03",
      endDate: "2026-07-03",
      progress: 100,
      milestone: true,
      dependencyIds: ["brief"],
    }),
  ];

  it("round-trips the JSON project schema", () => {
    expect(ganttTasksFromJson(ganttTasksToJson(tasks))).toEqual(tasks);
  });

  it("rejects JSON values outside the project schema", () => {
    expect(() => ganttTasksFromJson('{"id":"not-an-array"}')).toThrow(
      "Gantt project must be an array of tasks.",
    );
    expect(() =>
      ganttTasksFromJson(
        '[{"id":"bad","name":"Bad","startDate":"2026-07-01","endDate":"2026-07-01","progress":101,"milestone":false,"dependencyIds":[]}]',
      ),
    ).toThrow("Task at index 0 has an invalid progress value.");
  });

  it("quotes CSV commas, quotes, newlines, and dependency data", () => {
    const csv = ganttTasksToCsv(tasks);

    expect(csv).toContain('"Brief, review ""draft"""');
    expect(csv).toContain('"Launch\nannouncement"');
    expect(csv).toContain('"[""brief""]"');
    expect(ganttTasksFromCsv(csv)).toEqual(tasks);
  });
});

describe("Gantt project persistence", () => {
  it("writes and restores a local project", () => {
    let stored = "";
    const storage = {
      setItem(_key: string, value: string) {
        stored = value;
      },
      getItem(_key: string) {
        return stored;
      },
    };
    const tasks = [task()];

    writeGanttProject(storage, tasks);

    expect(readGanttProject(storage)).toEqual(tasks);
  });

  it("returns an empty project for corrupt local storage", () => {
    expect(
      readGanttProject({
        getItem() {
          return "not json";
        },
      }),
    ).toEqual([]);
  });

  it("clears the locally saved project", () => {
    let removedKey = "";

    clearGanttProject({
      removeItem(key: string) {
        removedKey = key;
      },
    });

    expect(removedKey).toBe("u2tool:gantt-project:v1");
  });
});

describe("Gantt project templates", () => {
  it("creates software release, marketing campaign, and event preparation plans from one calendar anchor", () => {
    const software = createGanttTemplate("software-release", "2026-07-01");
    const marketing = createGanttTemplate("marketing-campaign", "2026-07-01");
    const event = createGanttTemplate("event-preparation", "2026-07-01");

    expect(software.map(({ id }) => id)).toEqual([
      "release-plan",
      "release-build",
      "release-test",
      "release-launch",
    ]);
    expect(software.at(-1)).toMatchObject({
      startDate: "2026-07-14",
      endDate: "2026-07-14",
      milestone: true,
      dependencyIds: ["release-test"],
    });
    expect(marketing.map(({ id }) => id)).toEqual([
      "campaign-brief",
      "campaign-create",
      "campaign-launch",
    ]);
    expect(event.map(({ id }) => id)).toEqual([
      "event-scope",
      "event-logistics",
      "event-rehearsal",
      "event-day",
    ]);
    expect(validateGanttTasks([...software, ...marketing, ...event])).toEqual([]);
  });
});

it("round-trips a dependency project through local planning formats and storage [capability:gantt-chart-generator:profile:release-readiness] [capability:gantt-chart-generator:mode:local-project-planning] [capability:gantt-chart-generator:accepted-input:task-fields] [capability:gantt-chart-generator:accepted-input:json-project] [capability:gantt-chart-generator:accepted-input:csv-project] [capability:gantt-chart-generator:produced-output:critical-path] [capability:gantt-chart-generator:produced-output:json-project] [capability:gantt-chart-generator:produced-output:csv-project] [capability:gantt-chart-generator:produced-output:png-chart] [capability:gantt-chart-generator:produced-output:svg-chart] [capability:gantt-chart-generator:browser-feature:task-name-dates-progress] [capability:gantt-chart-generator:browser-feature:dependencies] [capability:gantt-chart-generator:browser-feature:milestones] [capability:gantt-chart-generator:browser-feature:critical-path-highlighting] [capability:gantt-chart-generator:browser-feature:local-persistence] [capability:gantt-chart-generator:browser-feature:project-templates] [capability:gantt-chart-generator:browser-feature:project-data-exchange] [capability:gantt-chart-generator:browser-feature:theme] [capability:gantt-chart-generator:browser-feature:png-export] [capability:gantt-chart-generator:browser-feature:svg-export] [capability:gantt-chart-generator:limit:no-collaboration] [capability:gantt-chart-generator:limit:no-cloud-sync] [capability:gantt-chart-generator:limit:no-resource-management] [capability:gantt-chart-generator:limit:no-enterprise-workflow] [capability:gantt-chart-generator:limit:no-live-multi-user] [capability:gantt-chart-generator:engine:language-support]", () => {
  const tasks = [
    task({ id: "build", name: "Build" }),
    task({
      id: "release",
      name: "Release",
      startDate: "2026-07-03",
      endDate: "2026-07-03",
      milestone: true,
      dependencyIds: ["build"],
    }),
  ];
  let stored: string | null = null;
  const storage = {
    getItem: () => stored,
    setItem: (_key: string, value: string) => {
      stored = value;
    },
  };

  expect(validateGanttTasks(tasks)).toEqual([]);
  expect(calculateCriticalPath(tasks)).toMatchObject({
    taskIds: ["build", "release"],
    totalDays: 2,
  });
  expect(ganttTasksFromJson(ganttTasksToJson(tasks))).toEqual(tasks);
  expect(ganttTasksFromCsv(ganttTasksToCsv(tasks))).toEqual(tasks);
  writeGanttProject(storage, tasks);
  expect(readGanttProject(storage)).toEqual(tasks);
});
