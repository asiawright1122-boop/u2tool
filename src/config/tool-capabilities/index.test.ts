import { describe, expect, it } from "vitest";
import { locales } from "@/lib/i18n";
import { defineToolCapabilityProfile } from "./define-profile";
import {
  getPilotToolCapabilityProfiles,
  getToolCapabilityProfile,
  PILOT_TOOL_SLUGS,
} from "./index";

describe("pilot tool capability registry", () => {
  it("resolves exactly the six approved pilot profiles", () => {
    expect(PILOT_TOOL_SLUGS).toEqual([
      "grammar-checker",
      "hex-editor",
      "sql-query-optimizer",
      "excel-viewer",
      "typing-speed-test",
      "gantt-chart-generator",
    ]);

    const expectedStates = {
      "grammar-checker": { version: "1.1.0", enforcement: "release-blocking" },
      "hex-editor": { version: "1.0.0", enforcement: "inventory" },
      "sql-query-optimizer": { version: "1.0.0", enforcement: "inventory" },
      "excel-viewer": { version: "1.0.0", enforcement: "inventory" },
      "typing-speed-test": { version: "1.0.0", enforcement: "inventory" },
      "gantt-chart-generator": { version: "1.0.0", enforcement: "inventory" },
    } as const;

    for (const slug of PILOT_TOOL_SLUGS) {
      const profile = getToolCapabilityProfile(slug);
      expect(profile?.slug).toBe(slug);
      expect(profile?.version).toBe(expectedStates[slug].version);
      expect(profile?.version).toMatch(/^\d+\.\d+\.\d+$/);
      expect(profile?.enforcement).toBe(expectedStates[slug].enforcement);
      expect(profile?.forbiddenClaims.length).toBeGreaterThan(0);
      expect(profile?.supportedLocales.ui).toEqual(locales);
      expect(Object.isFrozen(profile)).toBe(true);
    }
  });

  it("does not invent a blocking profile for unrelated legacy tools", () => {
    expect(getToolCapabilityProfile("json-formatter")).toBeUndefined();
  });

  it("does not resolve inherited object keys as tool profiles", () => {
    for (const slug of ["toString", "constructor", "__proto__"]) {
      expect(getToolCapabilityProfile(slug)).toBeUndefined();
    }
  });

  it("keeps visible capability fields as localized message keys", () => {
    for (const profile of getPilotToolCapabilityProfiles()) {
      const visibleFields = [
        ...profile.modes,
        ...profile.acceptedInputs,
        ...profile.producedOutputs,
        ...profile.browserOnlyFeatures,
        ...profile.optionalServerFeatures,
        ...profile.limits,
      ];

      for (const field of visibleFields) {
        expect(field.labelKey).toMatch(
          new RegExp(`^tools\\.${profile.slug}\\.[A-Za-z0-9.-]+$`),
        );
        expect(field.labelKey).not.toMatch(/\s/);
      }
    }
  });

  it("declares engine locales only for language-dependent tools", () => {
    for (const slug of [
      "hex-editor",
      "excel-viewer",
      "gantt-chart-generator",
    ]) {
      expect(getToolCapabilityProfile(slug)?.supportedLocales.engine).toEqual({
        kind: "language-neutral",
      });
    }

    expect(
      getToolCapabilityProfile("grammar-checker")?.supportedLocales.engine,
    ).toEqual({
      kind: "engine-limited",
      local: ["en"],
      optionalServer: [],
      evidence: {
        file: "src/lib/grammar-language-support.test.ts",
        testName:
          "declares English as the only local checking language [capability:grammar-checker:engine:language-support]",
      },
    });
    expect(
      getToolCapabilityProfile("sql-query-optimizer")?.supportedLocales.engine,
    ).toEqual({
      kind: "engine-limited",
      local: ["en"],
      optionalServer: [],
    });
    expect(
      getToolCapabilityProfile("typing-speed-test")?.supportedLocales.engine,
    ).toEqual({
      kind: "engine-limited",
      local: locales,
      optionalServer: [],
    });
  });

  it("promotes only Grammar after matching behavior evidence exists", () => {
    const grammarProfile = getToolCapabilityProfile("grammar-checker")!;
    expect(grammarProfile.enforcement).toBe("release-blocking");
    expect(grammarProfile.evidenceTests).toHaveLength(2);
    expect(grammarProfile.optionalServerFeatures).toEqual([]);

    for (const profile of getPilotToolCapabilityProfiles()) {
      if (profile.slug !== "grammar-checker") {
        expect(profile.enforcement).toBe("inventory");
        expect(profile.evidenceTests).toEqual([]);
      }
      expect(profile.optionalServerFeatures).toEqual([]);
      expect(profile.modes.every((mode) => mode.runtime === "browser")).toBe(
        true,
      );
      expect(profile.targetSearchIntents.length).toBeGreaterThan(0);
      for (const intentId of profile.targetSearchIntents) {
        expect(intentId).toMatch(new RegExp(`^${profile.slug}\\.[a-z0-9-]+$`));
      }
    }
  });

  it("ties the local English rules mode to exact-highlight browser evidence", () => {
    const grammarProfile = getToolCapabilityProfile("grammar-checker")!;
    const exactHighlightEvidence = {
      file: "src/components/tools/GrammarChecker.test.ts",
      testName:
        "renders exact highlighted issue ranges from the visible English preview [capability:grammar-checker:mode:local-english-rules] [capability:grammar-checker:produced-output:highlighted-issues] [capability:grammar-checker:browser-feature:english-local-rules] [capability:grammar-checker:browser-feature:issue-highlights]",
    };

    expect(
      grammarProfile.modes.find(({ id }) => id === "local-english-rules")
        ?.evidence,
    ).toEqual(exactHighlightEvidence);
  });

  it("records the approved current browser features and limits", () => {
    const expectedInventory = {
      "grammar-checker": {
        features: [
          "english-local-rules",
          "issue-highlights",
          "individual-fixes",
          "all-fixes",
        ],
        limits: ["english-only-engine", "no-ai", "no-server-processing"],
      },
      "hex-editor": {
        features: ["text-to-hex", "hex-to-text", "clipboard-copy"],
        limits: [
          "no-file-open",
          "no-offset-grid",
          "no-direct-byte-editing",
          "utf8-only",
          "no-file-export",
        ],
      },
      "sql-query-optimizer": {
        features: [
          "static-heuristics",
          "performance-score",
          "sql-formatting",
          "general-index-candidates",
        ],
        limits: [
          "no-database-selector",
          "no-explain-parser",
          "no-database-connection",
          "no-query-execution",
          "no-speed-guarantee",
        ],
      },
      "excel-viewer": {
        features: [
          "xls-xlsx-open",
          "sheet-tabs",
          "row-table",
          "sort",
          "filter",
        ],
        limits: [
          "no-macros",
          "no-formula-recalculation",
          "no-charts",
          "no-full-formatting-fidelity",
          "no-export",
        ],
      },
      "typing-speed-test": {
        features: [
          "difficulty-prompt-banks",
          "completion-wpm",
          "completion-accuracy",
          "completion-duration",
        ],
        limits: [
          "no-fixed-timer",
          "no-cpm",
          "no-consistency-score",
          "no-history",
          "no-account",
          "no-ranking",
        ],
      },
      "gantt-chart-generator": {
        features: [
          "task-name-dates-progress",
          "theme",
          "png-export",
          "svg-export",
        ],
        limits: [
          "no-dependencies",
          "no-milestones",
          "no-critical-path",
          "no-persistence",
          "no-data-import-export",
          "no-collaboration",
        ],
      },
    } as const;

    for (const slug of PILOT_TOOL_SLUGS) {
      const profile = getToolCapabilityProfile(slug);
      expect(profile?.browserOnlyFeatures.map((feature) => feature.id)).toEqual(
        expectedInventory[slug].features,
      );
      expect(profile?.limits.map((limit) => limit.id)).toEqual(
        expectedInventory[slug].limits,
      );
    }

    expect(
      getToolCapabilityProfile("hex-editor")?.forbiddenClaims.map(
        (claim) => claim.code,
      ),
    ).toEqual([
      "hex-editor-grid-claim",
      "hex-editor-byte-edit-claim",
      "hex-editor-unsupported-encoding-claim",
      "hex-editor-file-export-claim",
    ]);
  });

  it("flags affirmative Gantt capability claims without flagging honest limits", () => {
    const profile = getToolCapabilityProfile("gantt-chart-generator")!;
    const examples = {
      "gantt-generator-dependencies-claim": {
        positive: "Supports task dependencies between rows.",
        negative: "No task dependencies are supported.",
      },
      "gantt-generator-milestones-claim": {
        positive: "Adds project milestones to the chart.",
        negative: "No milestones are available.",
      },
      "gantt-generator-critical-path-claim": {
        positive: "Calculates the critical path automatically.",
        negative: "Does not calculate a critical path.",
      },
      "gantt-generator-persistence-claim": {
        positive: "Automatically saves your charts.",
        negative: "Charts are not saved.",
      },
      "gantt-generator-data-transfer-claim": {
        positive: "Imports project data from another tool.",
        negative: "Does not import or export project data.",
      },
      "gantt-generator-collaboration-claim": {
        positive: "Supports real-time collaboration.",
        negative: "No collaboration is available.",
      },
    } as const;

    for (const claim of profile.forbiddenClaims) {
      const example = examples[claim.code as keyof typeof examples];
      expect(example, claim.code).toBeDefined();
      expect(claim.pattern.test(example.positive), claim.code).toBe(true);
      expect(claim.pattern.test(example.negative), claim.code).toBe(false);
    }
  });

  it("flags affirmative grammar capability claims without flagging honest limits", () => {
    const profile = getToolCapabilityProfile("grammar-checker")!;
    const examples = {
      "grammar-checker-native-non-english-claim": {
        positive: "Проверяет русскую грамматику, орфографию и пунктуацию.",
        negative:
          "Интерфейс переведен на русский язык, но локальная проверка предназначена для английского текста.",
      },
      "grammar-checker-ai-claim": {
        positive: "Uses AI-powered grammar checking.",
        negative: "Not AI-powered.",
      },
      "grammar-checker-server-processing-claim": {
        positive: "Uses cloud-based processing for grammar checks.",
        negative: "No server-side processing is used.",
      },
    } as const;

    for (const claim of profile.forbiddenClaims) {
      const example = examples[claim.code as keyof typeof examples];
      expect(example, claim.code).toBeDefined();
      expect(claim.pattern.test(example.positive), claim.code).toBe(true);
      expect(claim.pattern.test(example.negative), claim.code).toBe(false);
    }
  });

  it("flags affirmative Hex capability claims without flagging honest limits", () => {
    const profile = getToolCapabilityProfile("hex-editor")!;
    const examples = {
      "hex-editor-grid-claim": {
        positive: "Opens local files and shows an offset grid.",
        negative: "No file upload or offset grid is available.",
      },
      "hex-editor-byte-edit-claim": {
        positive: "Edits individual bytes directly.",
        negative: "No direct byte editing is available.",
      },
      "hex-editor-unsupported-encoding-claim": {
        positive: "Supports UTF-16 encoding.",
        negative: "Does not support UTF-16 encoding.",
      },
      "hex-editor-file-export-claim": {
        positive: "Exports edited files.",
        negative: "Does not export files.",
      },
    } as const;

    for (const claim of profile.forbiddenClaims) {
      const example = examples[claim.code as keyof typeof examples];
      expect(example, claim.code).toBeDefined();
      expect(claim.pattern.test(example.positive), claim.code).toBe(true);
      expect(claim.pattern.test(example.negative), claim.code).toBe(false);
    }
  });

  it("flags affirmative SQL capability claims without flagging honest limits", () => {
    const profile = getToolCapabilityProfile("sql-query-optimizer")!;
    const examples = {
      "sql-optimizer-database-selector-claim": {
        positive: "Includes a database selector.",
        negative: "No database selector is available.",
      },
      "sql-optimizer-explain-claim": {
        positive: "Parses EXPLAIN output.",
        negative: "Does not parse EXPLAIN output.",
      },
      "sql-optimizer-connection-claim": {
        positive: "Connects to a live database.",
        negative: "Does not connect to a database.",
      },
      "sql-optimizer-execution-claim": {
        positive: "Runs SQL queries.",
        negative: "Does not run SQL queries.",
      },
      "sql-optimizer-speed-guarantee-claim": {
        positive: "Guarantees faster query performance.",
        negative: "Does not guarantee faster query performance.",
      },
    } as const;

    for (const claim of profile.forbiddenClaims) {
      const example = examples[claim.code as keyof typeof examples];
      expect(example, claim.code).toBeDefined();
      expect(claim.pattern.test(example.positive), claim.code).toBe(true);
      expect(claim.pattern.test(example.negative), claim.code).toBe(false);
    }
  });

  it("flags affirmative Excel capability claims without flagging honest limits", () => {
    const profile = getToolCapabilityProfile("excel-viewer")!;
    const examples = {
      "excel-viewer-macro-claim": {
        positive: "Supports Excel macros.",
        negative: "Does not support Excel macros.",
      },
      "excel-viewer-formula-recalculation-claim": {
        positive: "Recalculates Excel formulas.",
        negative: "Does not recalculate Excel formulas.",
      },
      "excel-viewer-chart-claim": {
        positive: "Displays Excel charts.",
        negative: "Does not display Excel charts.",
      },
      "excel-viewer-formatting-fidelity-claim": {
        positive: "Preserves full formatting fidelity.",
        negative: "Does not preserve full formatting fidelity.",
      },
      "excel-viewer-export-claim": {
        positive: "Exports the workbook.",
        negative: "Does not export the workbook.",
      },
      "excel-viewer-advanced-filter-claim": {
        positive: "Provides advanced regex filters.",
        negative: "Does not provide advanced regex filters.",
      },
      "excel-viewer-multi-sort-claim": {
        positive: "Supports hierarchical sorting.",
        negative: "Does not support hierarchical sorting.",
      },
    } as const;

    for (const claim of profile.forbiddenClaims) {
      const example = examples[claim.code as keyof typeof examples];
      expect(example, claim.code).toBeDefined();
      expect(claim.pattern.test(example.positive), claim.code).toBe(true);
      expect(claim.pattern.test(example.negative), claim.code).toBe(false);
    }
  });

  it("flags affirmative Typing capability claims without flagging honest limits", () => {
    const profile = getToolCapabilityProfile("typing-speed-test")!;
    const examples = {
      "typing-speed-test-fixed-timer-claim": {
        positive: "Offers a fixed timer.",
        negative: "No fixed timer is available.",
      },
      "typing-speed-test-cpm-claim": {
        positive: "Reports CPM at completion.",
        negative: "Does not report CPM.",
      },
      "typing-speed-test-consistency-claim": {
        positive: "Tracks a consistency score.",
        negative: "Does not track a consistency score.",
      },
      "typing-speed-test-history-claim": {
        positive: "Saves typing history.",
        negative: "Does not save typing history.",
      },
      "typing-speed-test-account-claim": {
        positive: "Supports user accounts.",
        negative: "Does not support user accounts.",
      },
      "typing-speed-test-ranking-claim": {
        positive: "Publishes a leaderboard.",
        negative: "No leaderboard is available.",
      },
      "typing-speed-test-certificate-claim": {
        positive: "Awards a completion certificate.",
        negative: "Does not issue a certificate.",
      },
    } as const;

    for (const claim of profile.forbiddenClaims) {
      const example = examples[claim.code as keyof typeof examples];
      expect(example, claim.code).toBeDefined();
      expect(claim.pattern.test(example.positive), claim.code).toBe(true);
      expect(claim.pattern.test(example.negative), claim.code).toBe(false);
    }
  });
});

describe("capability profile definition", () => {
  const grammarProfile = getToolCapabilityProfile("grammar-checker")!;

  it("rejects a missing slug or non-semantic version", () => {
    expect(() =>
      defineToolCapabilityProfile({
        ...grammarProfile,
        slug: "",
        version: "1.0",
      }),
    ).toThrow("Invalid capability profile identity: @1.0");
  });

  it("rejects release blocking without behavior evidence", () => {
    expect(() =>
      defineToolCapabilityProfile({
        ...grammarProfile,
        enforcement: "release-blocking",
        evidenceTests: [],
      }),
    ).toThrow(
      "grammar-checker: release-blocking profiles require behavior evidence",
    );
  });

  it("rejects profiles that cannot constrain unsupported claims", () => {
    expect(() =>
      defineToolCapabilityProfile({ ...grammarProfile, forbiddenClaims: [] }),
    ).toThrow("grammar-checker: at least one forbidden claim is required");
  });
});
