import { locales } from "@/lib/i18n";
import { defineToolCapabilityProfile } from "../define-profile";

export const ganttChartGeneratorCapabilityProfile = defineToolCapabilityProfile(
  {
    slug: "gantt-chart-generator",
    version: "1.0.0",
    enforcement: "inventory",
    modes: [
      {
        id: "local-chart-editor",
        labelKey:
          "tools.gantt-chart-generator.capabilities.modes.localChartEditor",
        runtime: "browser",
      },
    ],
    acceptedInputs: [
      {
        id: "task-name",
        labelKey: "tools.gantt-chart-generator.taskName",
      },
      {
        id: "task-dates",
        labelKey: "tools.gantt-chart-generator.capabilities.inputs.taskDates",
      },
      {
        id: "task-progress",
        labelKey: "tools.gantt-chart-generator.progress",
      },
      {
        id: "theme",
        labelKey: "tools.gantt-chart-generator.colorTheme",
      },
    ],
    producedOutputs: [
      {
        id: "png",
        labelKey: "tools.gantt-chart-generator.png",
      },
      {
        id: "svg",
        labelKey: "tools.gantt-chart-generator.svg",
      },
    ],
    supportedLocales: {
      ui: locales,
      engine: { kind: "language-neutral" },
    },
    browserOnlyFeatures: [
      {
        id: "task-name-dates-progress",
        labelKey:
          "tools.gantt-chart-generator.capabilities.features.taskNameDatesProgress",
        evidenceTest: "",
      },
      {
        id: "theme",
        labelKey: "tools.gantt-chart-generator.colorTheme",
        evidenceTest: "",
      },
      {
        id: "png-export",
        labelKey: "tools.gantt-chart-generator.downloadPng",
        evidenceTest: "",
      },
      {
        id: "svg-export",
        labelKey: "tools.gantt-chart-generator.downloadSvg",
        evidenceTest: "",
      },
    ],
    optionalServerFeatures: [],
    limits: [
      {
        id: "no-dependencies",
        labelKey:
          "tools.gantt-chart-generator.capabilities.limits.noDependencies",
      },
      {
        id: "no-milestones",
        labelKey:
          "tools.gantt-chart-generator.capabilities.limits.noMilestones",
      },
      {
        id: "no-critical-path",
        labelKey:
          "tools.gantt-chart-generator.capabilities.limits.noCriticalPath",
      },
      {
        id: "no-persistence",
        labelKey:
          "tools.gantt-chart-generator.capabilities.limits.noPersistence",
      },
      {
        id: "no-data-import-export",
        labelKey:
          "tools.gantt-chart-generator.capabilities.limits.noDataImportExport",
      },
      {
        id: "no-collaboration",
        labelKey:
          "tools.gantt-chart-generator.capabilities.limits.noCollaboration",
      },
    ],
    forbiddenClaims: [
      {
        code: "gantt-generator-dependencies-claim",
        pattern: /\b(?:task )?dependenc(?:y|ies)\b/i,
        reason: "The editor does not model dependencies between tasks.",
      },
      {
        code: "gantt-generator-milestones-claim",
        pattern: /\bmilestones?\b/i,
        reason: "The current chart model has no milestone type.",
      },
      {
        code: "gantt-generator-critical-path-claim",
        pattern: /\bcritical path\b/i,
        reason: "The current chart does not calculate a critical path.",
      },
      {
        code: "gantt-generator-persistence-claim",
        pattern:
          /\b(?:autosave|saved projects?|persistent storage|stores? your charts?)\b/i,
        reason: "The chart state is not persisted.",
      },
      {
        code: "gantt-generator-data-transfer-claim",
        pattern: /\b(?:imports?|exports?) (?:project|task|chart) data\b/i,
        reason:
          "Only image export is supported; project data import and export are not.",
      },
      {
        code: "gantt-generator-collaboration-claim",
        pattern:
          /\b(?:real[- ]time )?collaboration|share with (?:your )?team\b/i,
        reason: "The tool has no collaboration or sharing service.",
      },
    ],
    targetSearchIntents: ["gantt-chart-generator.local-chart-export"],
    evidenceTests: [],
  },
);
