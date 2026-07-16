import { locales } from "@/lib/i18n";
import { defineToolCapabilityProfile } from "../define-profile";

const RELEASE_READINESS_TEST =
  "round-trips a dependency project through local planning formats and storage [capability:gantt-chart-generator:profile:release-readiness] [capability:gantt-chart-generator:mode:local-project-planning] [capability:gantt-chart-generator:accepted-input:task-fields] [capability:gantt-chart-generator:accepted-input:json-project] [capability:gantt-chart-generator:accepted-input:csv-project] [capability:gantt-chart-generator:produced-output:critical-path] [capability:gantt-chart-generator:produced-output:json-project] [capability:gantt-chart-generator:produced-output:csv-project] [capability:gantt-chart-generator:produced-output:png-chart] [capability:gantt-chart-generator:produced-output:svg-chart] [capability:gantt-chart-generator:browser-feature:task-name-dates-progress] [capability:gantt-chart-generator:browser-feature:dependencies] [capability:gantt-chart-generator:browser-feature:milestones] [capability:gantt-chart-generator:browser-feature:critical-path-highlighting] [capability:gantt-chart-generator:browser-feature:local-persistence] [capability:gantt-chart-generator:browser-feature:project-templates] [capability:gantt-chart-generator:browser-feature:project-data-exchange] [capability:gantt-chart-generator:browser-feature:theme] [capability:gantt-chart-generator:browser-feature:png-export] [capability:gantt-chart-generator:browser-feature:svg-export] [capability:gantt-chart-generator:limit:no-collaboration] [capability:gantt-chart-generator:limit:no-cloud-sync] [capability:gantt-chart-generator:limit:no-resource-management] [capability:gantt-chart-generator:limit:no-enterprise-workflow] [capability:gantt-chart-generator:limit:no-live-multi-user] [capability:gantt-chart-generator:engine:language-support]";

const releaseReadinessEvidence = {
  file: "src/lib/gantt-chart.test.ts",
  testName: RELEASE_READINESS_TEST,
};

export const ganttChartGeneratorCapabilityProfile = defineToolCapabilityProfile({
  slug: "gantt-chart-generator",
  version: "2.0.0",
  enforcement: "release-blocking",
  modes: [
    {
      id: "local-project-planning",
      labelKey: "tools.gantt-chart-generator.capabilities.modes.localProjectPlanning",
      runtime: "browser",
      evidence: releaseReadinessEvidence,
    },
  ],
  acceptedInputs: [
    {
      id: "task-fields",
      labelKey: "tools.gantt-chart-generator.capabilities.inputs.taskFields",
      evidence: releaseReadinessEvidence,
    },
    {
      id: "json-project",
      labelKey: "tools.gantt-chart-generator.capabilities.inputs.jsonProject",
      evidence: releaseReadinessEvidence,
    },
    {
      id: "csv-project",
      labelKey: "tools.gantt-chart-generator.capabilities.inputs.csvProject",
      evidence: releaseReadinessEvidence,
    },
  ],
  producedOutputs: [
    {
      id: "critical-path",
      labelKey: "tools.gantt-chart-generator.capabilities.outputs.criticalPath",
      evidence: releaseReadinessEvidence,
    },
    {
      id: "json-project",
      labelKey: "tools.gantt-chart-generator.capabilities.outputs.jsonProject",
      evidence: releaseReadinessEvidence,
    },
    {
      id: "csv-project",
      labelKey: "tools.gantt-chart-generator.capabilities.outputs.csvProject",
      evidence: releaseReadinessEvidence,
    },
    {
      id: "png-chart",
      labelKey: "tools.gantt-chart-generator.png",
      evidence: releaseReadinessEvidence,
    },
    {
      id: "svg-chart",
      labelKey: "tools.gantt-chart-generator.svg",
      evidence: releaseReadinessEvidence,
    },
  ],
  supportedLocales: {
    ui: locales,
    engine: { kind: "language-neutral", evidence: releaseReadinessEvidence },
  },
  browserOnlyFeatures: [
    {
      id: "task-name-dates-progress",
      labelKey: "tools.gantt-chart-generator.capabilities.features.taskNameDatesProgress",
      evidence: releaseReadinessEvidence,
    },
    {
      id: "dependencies",
      labelKey: "tools.gantt-chart-generator.capabilities.features.dependencies",
      evidence: releaseReadinessEvidence,
    },
    {
      id: "milestones",
      labelKey: "tools.gantt-chart-generator.capabilities.features.milestones",
      evidence: releaseReadinessEvidence,
    },
    {
      id: "critical-path-highlighting",
      labelKey: "tools.gantt-chart-generator.capabilities.features.criticalPathHighlighting",
      evidence: releaseReadinessEvidence,
    },
    {
      id: "local-persistence",
      labelKey: "tools.gantt-chart-generator.capabilities.features.localPersistence",
      evidence: releaseReadinessEvidence,
    },
    {
      id: "project-templates",
      labelKey: "tools.gantt-chart-generator.capabilities.features.projectTemplates",
      evidence: releaseReadinessEvidence,
    },
    {
      id: "project-data-exchange",
      labelKey: "tools.gantt-chart-generator.capabilities.features.projectDataExchange",
      evidence: releaseReadinessEvidence,
    },
    {
      id: "theme",
      labelKey: "tools.gantt-chart-generator.colorTheme",
      evidence: releaseReadinessEvidence,
    },
    {
      id: "png-export",
      labelKey: "tools.gantt-chart-generator.downloadPng",
      evidence: releaseReadinessEvidence,
    },
    {
      id: "svg-export",
      labelKey: "tools.gantt-chart-generator.downloadSvg",
      evidence: releaseReadinessEvidence,
    },
  ],
  optionalServerFeatures: [],
  limits: [
    {
      id: "no-collaboration",
      labelKey: "tools.gantt-chart-generator.capabilities.limits.noCollaboration",
      evidence: releaseReadinessEvidence,
    },
    {
      id: "no-cloud-sync",
      labelKey: "tools.gantt-chart-generator.capabilities.limits.noCloudSync",
      evidence: releaseReadinessEvidence,
    },
    {
      id: "no-resource-management",
      labelKey: "tools.gantt-chart-generator.capabilities.limits.noResourceManagement",
      evidence: releaseReadinessEvidence,
    },
    {
      id: "no-enterprise-workflow",
      labelKey: "tools.gantt-chart-generator.capabilities.limits.noEnterpriseWorkflow",
      evidence: releaseReadinessEvidence,
    },
    {
      id: "no-live-multi-user",
      labelKey: "tools.gantt-chart-generator.capabilities.limits.noLiveMultiUser",
      evidence: releaseReadinessEvidence,
    },
  ],
  forbiddenClaims: [
    {
      code: "gantt-generator-collaboration-claim",
      pattern: /(?<!no )(?<!not )(?<!without )\b(?:supports?|offers?|enables?) (?:real[- ]time )?collaboration\b|(?<!no )(?<!not )\bteam sharing\b/i,
      reason: "The tool has no collaboration or sharing service.",
    },
    {
      code: "gantt-generator-cloud-sync-claim",
      pattern: /(?<!no )(?<!not )(?<!without )\b(?:synchroni[sz]es?|syncs?)\b.{0,24}\bcloud\b|(?<!no )(?<!not )\bcloud sync(?:hronization)?\b/i,
      reason: "Projects are stored only in the current browser, not synchronized through a cloud service.",
    },
    {
      code: "gantt-generator-resource-management-claim",
      pattern: /(?<!does not )(?<!doesn't )(?<!no )(?<!not )\b(?:allocates?|manages?|balances?)\b.{0,24}\b(?:project )?resources?\b/i,
      reason: "The tool does not allocate or manage project resources.",
    },
    {
      code: "gantt-generator-enterprise-workflow-claim",
      pattern: /(?<!no )(?<!not )(?<!without )\b(?:supports?|offers?|provides?)\b.{0,24}\benterprise (?:approval )?workflows?\b/i,
      reason: "The tool has no enterprise workflow or approval system.",
    },
    {
      code: "gantt-generator-live-multi-user-claim",
      pattern: /(?<!does not )(?<!doesn't )(?<!no )(?<!not )\b(?:shows?|tracks?|updates?)\b.{0,24}\blive multi[- ]user (?:project )?status\b/i,
      reason: "The tool has no live team or multi-user project status.",
    },
  ],
  targetSearchIntents: ["gantt-chart-generator.local-project-planning"],
  evidenceTests: [releaseReadinessEvidence],
});
