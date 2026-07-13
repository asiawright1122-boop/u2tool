import { locales } from "@/lib/i18n";
import { defineToolCapabilityProfile } from "../define-profile";

export const grammarCheckerCapabilityProfile = defineToolCapabilityProfile({
  slug: "grammar-checker",
  version: "1.0.0",
  enforcement: "inventory",
  modes: [
    {
      id: "local-english-rules",
      labelKey: "tools.grammar-checker.capabilities.modes.localEnglishRules",
      runtime: "browser",
    },
  ],
  acceptedInputs: [
    {
      id: "plain-text",
      labelKey: "tools.grammar-checker.capabilities.inputs.plainText",
    },
  ],
  producedOutputs: [
    {
      id: "highlighted-issues",
      labelKey: "tools.grammar-checker.capabilities.outputs.highlightedIssues",
    },
    {
      id: "corrected-text",
      labelKey: "tools.grammar-checker.capabilities.outputs.correctedText",
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
      id: "english-local-rules",
      labelKey: "tools.grammar-checker.capabilities.features.englishLocalRules",
      evidenceTest: "",
    },
    {
      id: "issue-highlights",
      labelKey: "tools.grammar-checker.capabilities.features.issueHighlights",
      evidenceTest: "",
    },
    {
      id: "individual-fixes",
      labelKey: "tools.grammar-checker.capabilities.features.individualFixes",
      evidenceTest: "",
    },
    {
      id: "all-fixes",
      labelKey: "tools.grammar-checker.capabilities.features.allFixes",
      evidenceTest: "",
    },
  ],
  optionalServerFeatures: [],
  limits: [
    {
      id: "english-only-engine",
      labelKey: "tools.grammar-checker.capabilities.limits.englishOnlyEngine",
    },
    {
      id: "no-ai",
      labelKey: "tools.grammar-checker.capabilities.limits.noAi",
    },
    {
      id: "no-server-processing",
      labelKey: "tools.grammar-checker.capabilities.limits.noServerProcessing",
    },
  ],
  forbiddenClaims: [
    {
      code: "grammar-checker-multilingual-claim",
      pattern: /\b(?:multilingual|non-English grammar|all languages)\b/i,
      reason: "The local grammar engine only checks English text.",
    },
    {
      code: "grammar-checker-ai-claim",
      pattern:
        /\b(?:AI[- ]powered|artificial intelligence|large language model|LLM)\b/i,
      reason: "The browser checker uses local static rules, not AI.",
    },
    {
      code: "grammar-checker-server-processing-claim",
      pattern: /\b(?:server[- ]side|cloud[- ]based|remote processing)\b/i,
      reason: "The current tool has no server-processing mode.",
    },
  ],
  targetSearchIntents: ["grammar-checker.local-english-review"],
  evidenceTests: [],
});
