import { locales } from "@/lib/i18n";
import { defineToolCapabilityProfile } from "../define-profile";

const TIMED_UI_TEST =
  "runs every selectable timed mode through a local result and history [capability:typing-speed-test:mode:duration-15] [capability:typing-speed-test:mode:duration-30] [capability:typing-speed-test:mode:duration-60] [capability:typing-speed-test:mode:duration-120] [capability:typing-speed-test:accepted-input:prompt-keystrokes] [capability:typing-speed-test:browser-feature:selectable-timed-modes] [capability:typing-speed-test:browser-feature:automatic-finish] [capability:typing-speed-test:browser-feature:character-errors] [capability:typing-speed-test:browser-feature:local-history]";
const RESULT_ENGINE_TEST =
  "calculates Unicode-aware timed metrics and character errors [capability:typing-speed-test:profile:release-readiness] [capability:typing-speed-test:produced-output:wpm] [capability:typing-speed-test:produced-output:cpm] [capability:typing-speed-test:produced-output:accuracy] [capability:typing-speed-test:produced-output:consistency] [capability:typing-speed-test:produced-output:elapsed-duration]";
const PROMPT_LOCALE_TEST =
  "provides native prompt fixtures and timed UI messages in all ten locales [capability:typing-speed-test:engine:language-support] [capability:typing-speed-test:browser-feature:difficulty-prompt-banks]";
const NEGATIVE_LIMITS_TEST =
  "completes locally without network navigation download account ranking certificate or cloud-history side effects [capability:typing-speed-test:limit:no-account] [capability:typing-speed-test:limit:no-ranking] [capability:typing-speed-test:limit:no-certificate] [capability:typing-speed-test:limit:no-cloud-history]";

const timedUiEvidence = {
  file: "src/components/tools/TypingSpeedTest.test.ts",
  testName: TIMED_UI_TEST,
};
const resultEngineEvidence = {
  file: "src/lib/typing-speed-test.test.ts",
  testName: RESULT_ENGINE_TEST,
};
const promptLocaleEvidence = {
  file: "src/lib/typing-speed-test.test.ts",
  testName: PROMPT_LOCALE_TEST,
};
const negativeLimitsEvidence = {
  file: "src/components/tools/TypingSpeedTest.test.ts",
  testName: NEGATIVE_LIMITS_TEST,
};

export const typingSpeedTestCapabilityProfile = defineToolCapabilityProfile({
  slug: "typing-speed-test",
  version: "2.0.0",
  enforcement: "release-blocking",
  modes: [
    {
      id: "duration-15",
      labelKey: "tools.typing-speed-test.duration15",
      runtime: "browser",
      evidence: timedUiEvidence,
    },
    {
      id: "duration-30",
      labelKey: "tools.typing-speed-test.duration30",
      runtime: "browser",
      evidence: timedUiEvidence,
    },
    {
      id: "duration-60",
      labelKey: "tools.typing-speed-test.duration60",
      runtime: "browser",
      evidence: timedUiEvidence,
    },
    {
      id: "duration-120",
      labelKey: "tools.typing-speed-test.duration120",
      runtime: "browser",
      evidence: timedUiEvidence,
    },
  ],
  acceptedInputs: [
    {
      id: "prompt-keystrokes",
      labelKey: "tools.typing-speed-test.capabilities.inputs.promptKeystrokes",
      evidence: timedUiEvidence,
    },
  ],
  producedOutputs: [
    { id: "wpm", labelKey: "tools.typing-speed-test.wpm", evidence: resultEngineEvidence },
    { id: "cpm", labelKey: "tools.typing-speed-test.cpm", evidence: resultEngineEvidence },
    { id: "accuracy", labelKey: "tools.typing-speed-test.accuracy", evidence: resultEngineEvidence },
    { id: "consistency", labelKey: "tools.typing-speed-test.consistency", evidence: resultEngineEvidence },
    { id: "elapsed-duration", labelKey: "tools.typing-speed-test.duration", evidence: resultEngineEvidence },
  ],
  supportedLocales: {
    ui: locales,
    engine: {
      kind: "engine-limited",
      local: locales,
      optionalServer: [],
      evidence: promptLocaleEvidence,
    },
  },
  browserOnlyFeatures: [
    {
      id: "difficulty-prompt-banks",
      labelKey: "tools.typing-speed-test.capabilities.features.difficultyPromptBanks",
      evidence: promptLocaleEvidence,
    },
    {
      id: "selectable-timed-modes",
      labelKey: "tools.typing-speed-test.capabilities.features.selectableTimedModes",
      evidence: timedUiEvidence,
    },
    {
      id: "automatic-finish",
      labelKey: "tools.typing-speed-test.capabilities.features.automaticFinish",
      evidence: timedUiEvidence,
    },
    {
      id: "character-errors",
      labelKey: "tools.typing-speed-test.capabilities.features.characterErrors",
      evidence: timedUiEvidence,
    },
    {
      id: "local-history",
      labelKey: "tools.typing-speed-test.capabilities.features.localHistory",
      evidence: timedUiEvidence,
    },
  ],
  optionalServerFeatures: [],
  limits: [
    {
      id: "no-account",
      labelKey: "tools.typing-speed-test.capabilities.limits.noAccount",
      evidence: negativeLimitsEvidence,
    },
    {
      id: "no-ranking",
      labelKey: "tools.typing-speed-test.capabilities.limits.noRanking",
      evidence: negativeLimitsEvidence,
    },
    {
      id: "no-certificate",
      labelKey: "tools.typing-speed-test.capabilities.limits.noCertificate",
      evidence: negativeLimitsEvidence,
    },
    {
      id: "no-cloud-history",
      labelKey: "tools.typing-speed-test.capabilities.limits.noCloudHistory",
      evidence: negativeLimitsEvidence,
    },
  ],
  forbiddenClaims: [
    {
      code: "typing-speed-test-account-claim",
      pattern:
        /(?<!not )(?<!n't )\b(?:offers?|supports?|requires?) (?:user )?(?:accounts?|sign[- ]in|profiles?)\b/i,
      reason: "The tool has no account or profile system.",
    },
    {
      code: "typing-speed-test-ranking-claim",
      pattern:
        /(?<!not )(?<!n't )\b(?:offers?|shows?|publishes?|tracks?) (?:a )?(?:leaderboards?|global ranking|ranked results?)\b/i,
      reason: "The tool does not rank users or publish a leaderboard.",
    },
    {
      code: "typing-speed-test-certificate-claim",
      pattern:
        /(?<!not )(?<!n't )\b(?:awards?|issues?|provides?|generates?) (?:an? )?(?:completion |typing )?certificates?\b/i,
      reason: "The tool does not issue typing or completion certificates.",
    },
    {
      code: "typing-speed-test-cloud-history-claim",
      pattern:
        /(?<!no )\b(?:cloud|online) (?:result |typing )?history\b/i,
      reason: "Typing history is stored only in the current browser.",
    },
  ],
  targetSearchIntents: ["typing-speed-test.localized-completion-metrics"],
  evidenceTests: [resultEngineEvidence],
});
