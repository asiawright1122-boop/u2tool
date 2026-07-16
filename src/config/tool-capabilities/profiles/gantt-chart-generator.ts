import { locales } from "@/lib/i18n";
import { defineToolCapabilityProfile } from "../define-profile";

const modelEvidence = {
  file: "src/lib/gantt-chart.test.ts",
  testName:
    "round-trips a dependency project through local planning formats and storage [capability:gantt-chart-generator:profile:release-readiness] [capability:gantt-chart-generator:accepted-input:json-project] [capability:gantt-chart-generator:accepted-input:csv-project] [capability:gantt-chart-generator:produced-output:critical-path] [capability:gantt-chart-generator:engine:language-support]",
};
const exportEvidence = {
  file: "src/components/tools/GanttChartGenerator.test.ts",
  testName:
    "downloads a real PNG and vector SVG chart payload [capability:gantt-chart-generator:profile:release-readiness] [capability:gantt-chart-generator:produced-output:png-chart] [capability:gantt-chart-generator:produced-output:svg-chart] [capability:gantt-chart-generator:browser-feature:png-export] [capability:gantt-chart-generator:browser-feature:svg-export]",
};
const editorEvidence = {
  file: "src/components/tools/GanttChartGenerator.test.ts",
  testName:
    "applies every template and keeps task fields dependencies milestones theme and critical highlighting editable [capability:gantt-chart-generator:profile:release-readiness] [capability:gantt-chart-generator:mode:local-project-planning] [capability:gantt-chart-generator:accepted-input:task-fields] [capability:gantt-chart-generator:produced-output:critical-path] [capability:gantt-chart-generator:browser-feature:task-name-dates-progress] [capability:gantt-chart-generator:browser-feature:dependencies] [capability:gantt-chart-generator:browser-feature:milestones] [capability:gantt-chart-generator:browser-feature:critical-path-highlighting] [capability:gantt-chart-generator:browser-feature:project-templates] [capability:gantt-chart-generator:browser-feature:theme]",
};
const importEvidence = {
  file: "src/components/tools/GanttChartGenerator.test.ts",
  testName:
    "rejects duplicate JSON and CSV IDs without replacing the valid editor state [capability:gantt-chart-generator:profile:release-readiness] [capability:gantt-chart-generator:accepted-input:json-project] [capability:gantt-chart-generator:accepted-input:csv-project] [capability:gantt-chart-generator:browser-feature:project-data-exchange]",
};
const exchangeEvidence = {
  file: "src/components/tools/GanttChartGenerator.test.ts",
  testName:
    "exports JSON and CSV and restores edits from browser-local storage [capability:gantt-chart-generator:profile:release-readiness] [capability:gantt-chart-generator:produced-output:json-project] [capability:gantt-chart-generator:produced-output:csv-project] [capability:gantt-chart-generator:browser-feature:local-persistence] [capability:gantt-chart-generator:browser-feature:project-data-exchange]",
};
const limitsEvidence = {
  file: "src/components/tools/GanttChartGenerator.test.ts",
  testName:
    "discloses local-only service limits and performs project workflows without network requests [capability:gantt-chart-generator:profile:release-readiness] [capability:gantt-chart-generator:limit:no-collaboration] [capability:gantt-chart-generator:limit:no-cloud-sync] [capability:gantt-chart-generator:limit:no-resource-management] [capability:gantt-chart-generator:limit:no-enterprise-workflow] [capability:gantt-chart-generator:limit:no-live-multi-user]",
};

export const ganttChartGeneratorCapabilityProfile = defineToolCapabilityProfile(
  {
    slug: "gantt-chart-generator",
    version: "2.0.0",
    enforcement: "release-blocking",
    modes: [
      {
        id: "local-project-planning",
        labelKey:
          "tools.gantt-chart-generator.capabilities.modes.localProjectPlanning",
        runtime: "browser",
        evidence: editorEvidence,
      },
    ],
    acceptedInputs: [
      {
        id: "task-fields",
        labelKey: "tools.gantt-chart-generator.capabilities.inputs.taskFields",
        evidence: editorEvidence,
      },
      {
        id: "json-project",
        labelKey: "tools.gantt-chart-generator.capabilities.inputs.jsonProject",
        evidence: importEvidence,
      },
      {
        id: "csv-project",
        labelKey: "tools.gantt-chart-generator.capabilities.inputs.csvProject",
        evidence: importEvidence,
      },
    ],
    producedOutputs: [
      {
        id: "critical-path",
        labelKey:
          "tools.gantt-chart-generator.capabilities.outputs.criticalPath",
        evidence: editorEvidence,
      },
      {
        id: "json-project",
        labelKey:
          "tools.gantt-chart-generator.capabilities.outputs.jsonProject",
        evidence: exchangeEvidence,
      },
      {
        id: "csv-project",
        labelKey: "tools.gantt-chart-generator.capabilities.outputs.csvProject",
        evidence: exchangeEvidence,
      },
      {
        id: "png-chart",
        labelKey: "tools.gantt-chart-generator.png",
        evidence: exportEvidence,
      },
      {
        id: "svg-chart",
        labelKey: "tools.gantt-chart-generator.svg",
        evidence: exportEvidence,
      },
    ],
    supportedLocales: {
      ui: locales,
      engine: { kind: "language-neutral", evidence: modelEvidence },
    },
    browserOnlyFeatures: [
      {
        id: "task-name-dates-progress",
        labelKey:
          "tools.gantt-chart-generator.capabilities.features.taskNameDatesProgress",
        evidence: editorEvidence,
      },
      {
        id: "dependencies",
        labelKey:
          "tools.gantt-chart-generator.capabilities.features.dependencies",
        evidence: editorEvidence,
      },
      {
        id: "milestones",
        labelKey:
          "tools.gantt-chart-generator.capabilities.features.milestones",
        evidence: editorEvidence,
      },
      {
        id: "critical-path-highlighting",
        labelKey:
          "tools.gantt-chart-generator.capabilities.features.criticalPathHighlighting",
        evidence: editorEvidence,
      },
      {
        id: "local-persistence",
        labelKey:
          "tools.gantt-chart-generator.capabilities.features.localPersistence",
        evidence: exchangeEvidence,
      },
      {
        id: "project-templates",
        labelKey:
          "tools.gantt-chart-generator.capabilities.features.projectTemplates",
        evidence: editorEvidence,
      },
      {
        id: "project-data-exchange",
        labelKey:
          "tools.gantt-chart-generator.capabilities.features.projectDataExchange",
        evidence: exchangeEvidence,
      },
      {
        id: "theme",
        labelKey: "tools.gantt-chart-generator.colorTheme",
        evidence: editorEvidence,
      },
      {
        id: "png-export",
        labelKey: "tools.gantt-chart-generator.downloadPng",
        evidence: exportEvidence,
      },
      {
        id: "svg-export",
        labelKey: "tools.gantt-chart-generator.downloadSvg",
        evidence: exportEvidence,
      },
    ],
    optionalServerFeatures: [],
    limits: [
      {
        id: "no-collaboration",
        labelKey:
          "tools.gantt-chart-generator.capabilities.limits.noCollaboration",
        evidence: limitsEvidence,
      },
      {
        id: "no-cloud-sync",
        labelKey: "tools.gantt-chart-generator.capabilities.limits.noCloudSync",
        evidence: limitsEvidence,
      },
      {
        id: "no-resource-management",
        labelKey:
          "tools.gantt-chart-generator.capabilities.limits.noResourceManagement",
        evidence: limitsEvidence,
      },
      {
        id: "no-enterprise-workflow",
        labelKey:
          "tools.gantt-chart-generator.capabilities.limits.noEnterpriseWorkflow",
        evidence: limitsEvidence,
      },
      {
        id: "no-live-multi-user",
        labelKey:
          "tools.gantt-chart-generator.capabilities.limits.noLiveMultiUser",
        evidence: limitsEvidence,
      },
    ],
    forbiddenClaims: [
      {
        code: "gantt-generator-collaboration-claim",
        pattern:
          /(?<!no )(?<!not )(?<!without )\b(?:supports?|offers?|enables?) (?:real[- ]time )?collaboration\b|(?<!no )(?<!not )\bteam sharing\b/i,
        reason: "The tool has no collaboration or sharing service.",
      },
      {
        code: "gantt-generator-cloud-sync-claim",
        pattern:
          /(?<!no )(?<!not )(?<!without )\b(?:synchroni[sz]es?|syncs?)\b.{0,24}\bcloud\b|(?<!no )(?<!not )\bcloud sync(?:hronization)?\b/i,
        reason:
          "Projects are stored only in the current browser, not synchronized through a cloud service.",
      },
      {
        code: "gantt-generator-resource-management-claim",
        pattern:
          /(?<!does not )(?<!doesn't )(?<!no )(?<!not )\b(?:allocates?|manages?|balances?)\b.{0,24}\b(?:project )?resources?\b/i,
        reason: "The tool does not allocate or manage project resources.",
      },
      {
        code: "gantt-generator-enterprise-workflow-claim",
        pattern:
          /(?<!no )(?<!not )(?<!without )\b(?:supports?|offers?|provides?)\b.{0,24}\benterprise (?:approval )?workflows?\b/i,
        reason: "The tool has no enterprise workflow or approval system.",
      },
      {
        code: "gantt-generator-live-multi-user-claim",
        pattern:
          /(?<!does not )(?<!doesn't )(?<!no )(?<!not )\b(?:shows?|tracks?|updates?)\b.{0,24}\blive multi[- ]user (?:project )?status\b/i,
        reason: "The tool has no live team or multi-user project status.",
      },
    ],
    targetSearchIntents: ["gantt-chart-generator.local-project-planning"],
    evidenceTests: [
      modelEvidence,
      exportEvidence,
      editorEvidence,
      importEvidence,
      exchangeEvidence,
      limitsEvidence,
    ],
  },
);
