import { locales } from "@/lib/i18n";
import { defineToolCapabilityProfile } from "../define-profile";

export const typingSpeedTestCapabilityProfile = defineToolCapabilityProfile({
  slug: "typing-speed-test",
  version: "1.0.0",
  enforcement: "inventory",
  modes: [
    {
      id: "easy",
      labelKey: "tools.typing-speed-test.easy",
      runtime: "browser",
    },
    {
      id: "medium",
      labelKey: "tools.typing-speed-test.medium",
      runtime: "browser",
    },
    {
      id: "hard",
      labelKey: "tools.typing-speed-test.hard",
      runtime: "browser",
    },
  ],
  acceptedInputs: [
    {
      id: "prompt-keystrokes",
      labelKey: "tools.typing-speed-test.capabilities.inputs.promptKeystrokes",
    },
  ],
  producedOutputs: [
    {
      id: "wpm",
      labelKey: "tools.typing-speed-test.wpm",
    },
    {
      id: "accuracy",
      labelKey: "tools.typing-speed-test.accuracy",
    },
    {
      id: "duration",
      labelKey: "tools.typing-speed-test.duration",
    },
  ],
  supportedLocales: {
    ui: locales,
    engine: {
      kind: "engine-limited",
      local: locales,
      optionalServer: [],
    },
  },
  browserOnlyFeatures: [
    {
      id: "difficulty-prompt-banks",
      labelKey:
        "tools.typing-speed-test.capabilities.features.difficultyPromptBanks",
      evidenceTest: "",
    },
    {
      id: "completion-wpm",
      labelKey: "tools.typing-speed-test.wpm",
      evidenceTest: "",
    },
    {
      id: "completion-accuracy",
      labelKey: "tools.typing-speed-test.accuracy",
      evidenceTest: "",
    },
    {
      id: "completion-duration",
      labelKey: "tools.typing-speed-test.duration",
      evidenceTest: "",
    },
  ],
  optionalServerFeatures: [],
  limits: [
    {
      id: "no-fixed-timer",
      labelKey: "tools.typing-speed-test.capabilities.limits.noFixedTimer",
    },
    {
      id: "no-cpm",
      labelKey: "tools.typing-speed-test.capabilities.limits.noCpm",
    },
    {
      id: "no-consistency-score",
      labelKey:
        "tools.typing-speed-test.capabilities.limits.noConsistencyScore",
    },
    {
      id: "no-history",
      labelKey: "tools.typing-speed-test.capabilities.limits.noHistory",
    },
    {
      id: "no-account",
      labelKey: "tools.typing-speed-test.capabilities.limits.noAccount",
    },
    {
      id: "no-ranking",
      labelKey: "tools.typing-speed-test.capabilities.limits.noRanking",
    },
  ],
  forbiddenClaims: [
    {
      code: "typing-speed-test-fixed-timer-claim",
      pattern: /\b(?:fixed|selectable|custom) (?:time|timer|duration)\b/i,
      reason:
        "The test ends when the prompt is completed, not after a fixed timer.",
    },
    {
      code: "typing-speed-test-cpm-claim",
      pattern: /\b(?:CPM|characters per minute)\b/i,
      reason: "The completion summary does not calculate CPM.",
    },
    {
      code: "typing-speed-test-consistency-claim",
      pattern: /\bconsistency (?:metric|score|tracking)\b/i,
      reason: "The completion summary does not calculate typing consistency.",
    },
    {
      code: "typing-speed-test-history-claim",
      pattern: /\b(?:test|result|typing) history\b/i,
      reason: "The tool does not persist previous results.",
    },
    {
      code: "typing-speed-test-account-claim",
      pattern: /\b(?:user )?accounts?|sign[- ]in|profiles?\b/i,
      reason: "The tool has no account or profile system.",
    },
    {
      code: "typing-speed-test-ranking-claim",
      pattern: /\b(?:leaderboards?|global ranking|ranked results?)\b/i,
      reason: "The tool does not rank users or publish a leaderboard.",
    },
  ],
  targetSearchIntents: ["typing-speed-test.localized-completion-metrics"],
  evidenceTests: [],
});
