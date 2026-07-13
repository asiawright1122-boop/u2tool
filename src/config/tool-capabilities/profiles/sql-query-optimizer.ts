import { locales } from "@/lib/i18n";
import { defineToolCapabilityProfile } from "../define-profile";

export const sqlQueryOptimizerCapabilityProfile = defineToolCapabilityProfile({
  slug: "sql-query-optimizer",
  version: "1.0.0",
  enforcement: "inventory",
  modes: [
    {
      id: "static-analysis",
      labelKey: "tools.sql-query-optimizer.capabilities.modes.staticAnalysis",
      runtime: "browser",
    },
  ],
  acceptedInputs: [
    {
      id: "sql-text",
      labelKey: "tools.sql-query-optimizer.capabilities.inputs.sqlText",
    },
  ],
  producedOutputs: [
    {
      id: "performance-score",
      labelKey:
        "tools.sql-query-optimizer.capabilities.outputs.performanceScore",
    },
    {
      id: "formatted-sql",
      labelKey: "tools.sql-query-optimizer.capabilities.outputs.formattedSql",
    },
    {
      id: "optimization-suggestions",
      labelKey:
        "tools.sql-query-optimizer.capabilities.outputs.optimizationSuggestions",
    },
    {
      id: "general-index-candidates",
      labelKey:
        "tools.sql-query-optimizer.capabilities.outputs.generalIndexCandidates",
    },
  ],
  supportedLocales: {
    ui: locales,
    engine: {
      kind: "engine-limited",
      local: ["en"],
      optionalServer: [],
    },
  },
  browserOnlyFeatures: [
    {
      id: "static-heuristics",
      labelKey:
        "tools.sql-query-optimizer.capabilities.features.staticHeuristics",
      evidenceTest: "",
    },
    {
      id: "performance-score",
      labelKey:
        "tools.sql-query-optimizer.capabilities.features.performanceScore",
      evidenceTest: "",
    },
    {
      id: "sql-formatting",
      labelKey: "tools.sql-query-optimizer.capabilities.features.sqlFormatting",
      evidenceTest: "",
    },
    {
      id: "general-index-candidates",
      labelKey:
        "tools.sql-query-optimizer.capabilities.features.generalIndexCandidates",
      evidenceTest: "",
    },
  ],
  optionalServerFeatures: [],
  limits: [
    {
      id: "no-database-selector",
      labelKey:
        "tools.sql-query-optimizer.capabilities.limits.noDatabaseSelector",
    },
    {
      id: "no-explain-parser",
      labelKey: "tools.sql-query-optimizer.capabilities.limits.noExplainParser",
    },
    {
      id: "no-database-connection",
      labelKey:
        "tools.sql-query-optimizer.capabilities.limits.noDatabaseConnection",
    },
    {
      id: "no-query-execution",
      labelKey:
        "tools.sql-query-optimizer.capabilities.limits.noQueryExecution",
    },
    {
      id: "no-speed-guarantee",
      labelKey:
        "tools.sql-query-optimizer.capabilities.limits.noSpeedGuarantee",
    },
  ],
  forbiddenClaims: [
    {
      code: "sql-optimizer-database-selector-claim",
      pattern: /\b(?:database|dialect) selector\b/i,
      reason:
        "The current static analyzer has no database or dialect selector.",
    },
    {
      code: "sql-optimizer-explain-claim",
      pattern: /\b(?:EXPLAIN|execution plan) (?:parser|analysis|analyzer)\b/i,
      reason: "The tool does not parse database execution plans.",
    },
    {
      code: "sql-optimizer-connection-claim",
      pattern: /\b(?:connects? to|database connection|live database)\b/i,
      reason: "The browser tool does not connect to a database.",
    },
    {
      code: "sql-optimizer-execution-claim",
      pattern: /\b(?:executes?|runs?) (?:the )?(?:SQL|query|queries)\b/i,
      reason: "The tool analyzes SQL text without executing it.",
    },
    {
      code: "sql-optimizer-speed-guarantee-claim",
      pattern:
        /\b(?:guaranteed?|guarantees?) (?:faster|speed|performance|improvement)\b/i,
      reason: "Static suggestions cannot guarantee database performance gains.",
    },
  ],
  targetSearchIntents: ["sql-query-optimizer.static-query-review"],
  evidenceTests: [],
});
