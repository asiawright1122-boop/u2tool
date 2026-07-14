import { locales } from "@/lib/i18n";
import { defineToolCapabilityProfile } from "../define-profile";

export const grammarCheckerCapabilityProfile = defineToolCapabilityProfile({
  slug: "grammar-checker",
  version: "1.1.0",
  enforcement: "release-blocking",
  modes: [
    {
      id: "local-english-rules",
      labelKey: "tools.grammar-checker.capabilities.modes.localEnglishRules",
      runtime: "browser",
      evidence: {
        file: "src/lib/grammar-rules.test.ts",
        testName:
          "checks English text with local static rules [capability:grammar-checker:mode:local-english-rules]",
      },
    },
  ],
  acceptedInputs: [
    {
      id: "plain-text",
      labelKey: "tools.grammar-checker.capabilities.inputs.plainText",
      evidence: {
        file: "src/lib/grammar-rules.test.ts",
        testName:
          "accepts empty and boundary-length plain-text input [capability:grammar-checker:accepted-input:plain-text]",
      },
    },
  ],
  producedOutputs: [
    {
      id: "highlighted-issues",
      labelKey: "tools.grammar-checker.capabilities.outputs.highlightedIssues",
      evidence: {
        file: "src/lib/grammar-rules.test.ts",
        testName:
          "returns issue details for highlighted output [capability:grammar-checker:produced-output:highlighted-issues]",
      },
    },
    {
      id: "corrected-text",
      labelKey: "tools.grammar-checker.capabilities.outputs.correctedText",
      evidence: {
        file: "src/lib/grammar-rules.test.ts",
        testName:
          "produces corrected text from public suggestions [capability:grammar-checker:produced-output:corrected-text]",
      },
    },
  ],
  supportedLocales: {
    ui: locales,
    engine: {
      kind: "engine-limited",
      local: ["en"],
      optionalServer: [],
      evidence: {
        file: "src/lib/grammar-language-support.test.ts",
        testName:
          "declares English as the only local checking language [capability:grammar-checker:engine:language-support]",
      },
    },
  },
  browserOnlyFeatures: [
    {
      id: "english-local-rules",
      labelKey: "tools.grammar-checker.capabilities.features.englishLocalRules",
      evidence: {
        file: "src/lib/grammar-rules.test.ts",
        testName:
          "detects representative English spelling, grammar, and punctuation rules [capability:grammar-checker:browser-feature:english-local-rules]",
      },
    },
    {
      id: "issue-highlights",
      labelKey: "tools.grammar-checker.capabilities.features.issueHighlights",
      evidence: {
        file: "src/lib/grammar-rules.test.ts",
        testName:
          "returns sorted source ranges that identify each issue [capability:grammar-checker:browser-feature:issue-highlights]",
      },
    },
    {
      id: "individual-fixes",
      labelKey: "tools.grammar-checker.capabilities.features.individualFixes",
      evidence: {
        file: "src/lib/grammar-rules.test.ts",
        testName:
          "applies one selected suggestion without changing other issues [capability:grammar-checker:browser-feature:individual-fixes]",
      },
    },
    {
      id: "all-fixes",
      labelKey: "tools.grammar-checker.capabilities.features.allFixes",
      evidence: {
        file: "src/lib/grammar-rules.test.ts",
        testName:
          "applies all available suggestions without position drift [capability:grammar-checker:browser-feature:all-fixes]",
      },
    },
  ],
  optionalServerFeatures: [],
  limits: [
    {
      id: "english-only-engine",
      labelKey: "tools.grammar-checker.capabilities.limits.englishOnlyEngine",
      evidence: {
        file: "src/lib/grammar-rules.test.ts",
        testName:
          "does not present Cyrillic input as native Russian checking [capability:grammar-checker:limit:english-only-engine]",
      },
    },
    {
      id: "no-ai",
      labelKey: "tools.grammar-checker.capabilities.limits.noAi",
      evidence: {
        file: "src/lib/grammar-rules.test.ts",
        testName:
          "exposes the finite static-rule boundary rather than AI inference [capability:grammar-checker:limit:no-ai]",
      },
    },
    {
      id: "no-server-processing",
      labelKey: "tools.grammar-checker.capabilities.limits.noServerProcessing",
      evidence: {
        file: "src/lib/grammar-rules.test.ts",
        testName:
          "checks text synchronously without server requests [capability:grammar-checker:limit:no-server-processing]",
      },
    },
  ],
  forbiddenClaims: [
    {
      code: "grammar-checker-native-non-english-claim",
      pattern:
        /(?<!not )(?<!n't )\b(?:checks?|corrects?|supports?) grammar (?:in|for) (?:multiple|non-English|all) languages?\b|(?<!not )(?<!n't )\b(?:offers?|provides?|supports?) multilingual (?:grammar )?checking\b|(?<!not )(?<!n't )\b(?:checks?|corrects?|supports?) (?:Russian|Chinese|Japanese|Korean|Spanish|Portuguese|French|German|Arabic) grammar\b|(?<!не )(?:проверяет|исправляет|поддерживает)\s+русскую\s+грамматику/i,
      reason: "The local grammar engine only checks English text.",
    },
    {
      code: "grammar-checker-ai-claim",
      pattern:
        /(?<!not )(?<!n't )\b(?:uses?|offers?|provides?) (?:AI[- ]powered|artificial intelligence|a large language model|an LLM)(?: grammar)? checking\b|\bis AI[- ]powered\b/i,
      reason: "The browser checker uses local static rules, not AI.",
    },
    {
      code: "grammar-checker-server-processing-claim",
      pattern:
        /(?<!not )(?<!n't )\b(?:uses?|offers?|provides?) (?:server[- ]side|cloud[- ]based|remote) (?:processing|checking)\b/i,
      reason: "The current tool has no server-processing mode.",
    },
  ],
  targetSearchIntents: ["grammar-checker.local-english-review"],
  evidenceTests: [
    {
      file: "src/lib/grammar-language-support.test.ts",
      testName:
        "keeps every localized interface on the English checker [capability:grammar-checker:profile:release-readiness]",
    },
    {
      file: "src/lib/grammar-rules.test.ts",
      testName:
        "covers the shipped English checker behavior and non-target boundary [capability:grammar-checker:profile:release-readiness]",
    },
  ],
});
