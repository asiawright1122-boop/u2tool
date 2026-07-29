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
      "hex-editor": { version: "2.0.0", enforcement: "release-blocking" },
      "sql-query-optimizer": {
        version: "2.0.0",
        enforcement: "release-blocking",
      },
      "excel-viewer": { version: "2.0.0", enforcement: "release-blocking" },
      "typing-speed-test": {
        version: "2.0.0",
        enforcement: "release-blocking",
      },
      "gantt-chart-generator": {
        version: "2.0.0",
        enforcement: "release-blocking",
      },
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
    expect(
      getToolCapabilityProfile("gantt-chart-generator")?.supportedLocales
        .engine,
    ).toMatchObject({
      kind: "language-neutral",
      evidence: { file: "src/lib/gantt-chart.test.ts" },
    });

    expect(
      getToolCapabilityProfile("hex-editor")?.supportedLocales.engine,
    ).toEqual({
      kind: "language-neutral",
      evidence: {
        file: "src/lib/hex-editor.test.ts",
        testName:
          "round-trips Unicode text through UTF-8 bytes without locale-specific processing [capability:hex-editor:engine:language-support]",
      },
    });

    expect(
      getToolCapabilityProfile("excel-viewer")?.supportedLocales.engine,
    ).toEqual({
      kind: "language-neutral",
      evidence: {
        file: "src/components/tools/ExcelViewer.test.ts",
        testName:
          "opens a local two-sheet workbook with addresses, cached values, formulas, merges, and no network request [capability:excel-viewer:profile:release-readiness] [capability:excel-viewer:mode:local-workbook-viewing] [capability:excel-viewer:accepted-input:xlsx-workbook] [capability:excel-viewer:produced-output:worksheet-data-view] [capability:excel-viewer:browser-feature:cell-addresses] [capability:excel-viewer:browser-feature:formula-toggle] [capability:excel-viewer:browser-feature:merged-ranges] [capability:excel-viewer:limit:local-files-only] [capability:excel-viewer:limit:no-formula-recalculation] [capability:excel-viewer:engine:language-support]",
      },
    });

    expect(
      getToolCapabilityProfile("grammar-checker")?.supportedLocales.engine,
    ).toEqual({
      kind: "engine-limited",
      local: ["en"],
      optionalServer: [],
      evidence: {
        file: "src/lib/grammar-rules.test.ts",
        testName:
          "exercises non-empty English grammar fixtures [capability:grammar-checker:engine:language-support]",
      },
      localeEvidence: [
        {
          locale: "en",
          runtime: "local",
          evidence: {
            file: "src/lib/grammar-rules.test.ts",
            testName:
              "exercises non-empty English grammar fixtures [capability:grammar-checker:engine:language-support]",
          },
          data: {
            kind: "fixture-object",
            file: "src/lib/fixtures/grammar-checker/en.ts",
            exportName: "grammarCheckerEnglishFixtures",
            minimumNonEmptyValues: 6,
          },
        },
      ],
      disclosure: {
        labelKey: "tools.grammar-checker.capabilities.limits.englishOnlyEngine",
        unsupportedLocaleClaimCodes: [
          "grammar-checker-native-non-english-claim",
        ],
      },
    });
    expect(
      getToolCapabilityProfile("sql-query-optimizer")?.supportedLocales.engine,
    ).toMatchObject({
      kind: "engine-limited",
      local: ["en"],
      optionalServer: [],
      evidence: {
        file: "src/lib/sql-query-optimizer.test.ts",
        testName:
          "formats SQL without changing the submitted text and keeps local diagnostics in English [capability:sql-query-optimizer:produced-output:formatted-sql] [capability:sql-query-optimizer:browser-feature:sql-formatting] [capability:sql-query-optimizer:engine:language-support]",
      },
    });
    expect(
      getToolCapabilityProfile("typing-speed-test")?.supportedLocales.engine,
    ).toMatchObject({
      kind: "engine-limited",
      local: locales,
      optionalServer: [],
      evidence: {
        file: "src/lib/typing-speed-test.test.ts",
        testName:
          "provides native prompt fixtures and timed UI messages in all ten locales [capability:typing-speed-test:engine:language-support] [capability:typing-speed-test:browser-feature:difficulty-prompt-banks]",
      },
    });
  });

  it("Grammar engine locale evidence is backed by English fixtures", () => {
    expect(
      getToolCapabilityProfile("grammar-checker")?.supportedLocales.engine,
    ).toMatchObject({
      kind: "engine-limited",
      local: ["en"],
      optionalServer: [],
      localeEvidence: [
        {
          locale: "en",
          runtime: "local",
          data: {
            kind: "fixture-object",
            file: "src/lib/fixtures/grammar-checker/en.ts",
            exportName: "grammarCheckerEnglishFixtures",
            minimumNonEmptyValues: 6,
          },
        },
      ],
      disclosure: {
        labelKey: "tools.grammar-checker.capabilities.limits.englishOnlyEngine",
        unsupportedLocaleClaimCodes: [
          "grammar-checker-native-non-english-claim",
        ],
      },
    });
  });

  it("SQL and Typing engine locale evidence", () => {
    expect(
      getToolCapabilityProfile("sql-query-optimizer")?.supportedLocales.engine,
    ).toMatchObject({
      kind: "engine-limited",
      localeEvidence: [
        { locale: "en", runtime: "local", data: { kind: "behavior-test" } },
      ],
      disclosure: {
        labelKey:
          "tools.sql-query-optimizer.capabilities.limits.englishDiagnostics",
        unsupportedLocaleClaimCodes: [
          "sql-query-optimizer-native-non-english-diagnostics-claim",
        ],
      },
    });

    const typingEngine =
      getToolCapabilityProfile("typing-speed-test")?.supportedLocales.engine;
    expect(typingEngine).toMatchObject({ kind: "engine-limited" });
    if (typingEngine?.kind === "engine-limited") {
      expect(typingEngine.localeEvidence.map(({ locale }) => locale)).toEqual(
        locales,
      );
      for (const contract of typingEngine.localeEvidence) {
        expect(contract).toMatchObject({
          runtime: "local",
          data: {
            kind: "message-prompt-bank",
            fileTemplate: "src/messages/{locale}.json",
            messagePath: ["tools", "typing-speed-test", "sampleTexts"],
            minimumNonEmptyEntries: 6,
          },
        });
      }
    }
  });

  it("promotes release-blocking profiles only after matching behavior evidence exists", () => {
    const grammarProfile = getToolCapabilityProfile("grammar-checker")!;
    const hexProfile = getToolCapabilityProfile("hex-editor")!;
    const sqlProfile = getToolCapabilityProfile("sql-query-optimizer")!;
    const excelProfile = getToolCapabilityProfile("excel-viewer")!;
    const typingProfile = getToolCapabilityProfile("typing-speed-test")!;
    const ganttProfile = getToolCapabilityProfile("gantt-chart-generator")!;
    expect(grammarProfile.enforcement).toBe("release-blocking");
    expect(grammarProfile.evidenceTests).toHaveLength(2);
    expect(hexProfile.enforcement).toBe("release-blocking");
    expect(hexProfile.evidenceTests).toHaveLength(1);
    expect(sqlProfile.enforcement).toBe("release-blocking");
    expect(sqlProfile.evidenceTests).toHaveLength(4);
    expect(excelProfile.enforcement).toBe("release-blocking");
    expect(excelProfile.evidenceTests).toHaveLength(4);
    expect(excelProfile.evidenceTests).toContainEqual({
      file: "src/lib/excel-data-viewer.test.ts",
      testName:
        "derives worksheet bounds from actual cells instead of a hostile declared range [capability:excel-viewer:profile:release-readiness]",
    });
    expect(typingProfile.enforcement).toBe("release-blocking");
    expect(typingProfile.evidenceTests).toEqual([
      {
        file: "src/lib/typing-speed-test.test.ts",
        testName:
          "calculates Unicode-aware timed metrics and character errors [capability:typing-speed-test:profile:release-readiness] [capability:typing-speed-test:produced-output:wpm] [capability:typing-speed-test:produced-output:cpm] [capability:typing-speed-test:produced-output:accuracy] [capability:typing-speed-test:produced-output:consistency] [capability:typing-speed-test:produced-output:elapsed-duration]",
      },
    ]);
    expect(ganttProfile.enforcement).toBe("release-blocking");
    expect(ganttProfile.evidenceTests).toEqual([
      {
        file: "src/lib/gantt-chart.test.ts",
        testName:
          "round-trips a dependency project through local planning formats and storage [capability:gantt-chart-generator:profile:release-readiness] [capability:gantt-chart-generator:accepted-input:json-project] [capability:gantt-chart-generator:accepted-input:csv-project] [capability:gantt-chart-generator:produced-output:critical-path] [capability:gantt-chart-generator:engine:language-support]",
      },
      {
        file: "src/components/tools/GanttChartGenerator.test.ts",
        testName:
          "downloads a real PNG and vector SVG chart payload [capability:gantt-chart-generator:profile:release-readiness] [capability:gantt-chart-generator:produced-output:png-chart] [capability:gantt-chart-generator:produced-output:svg-chart] [capability:gantt-chart-generator:browser-feature:png-export] [capability:gantt-chart-generator:browser-feature:svg-export]",
      },
      {
        file: "src/components/tools/GanttChartGenerator.test.ts",
        testName:
          "applies every template and keeps task fields dependencies milestones theme and critical highlighting editable [capability:gantt-chart-generator:profile:release-readiness] [capability:gantt-chart-generator:mode:local-project-planning] [capability:gantt-chart-generator:accepted-input:task-fields] [capability:gantt-chart-generator:produced-output:critical-path] [capability:gantt-chart-generator:browser-feature:task-name-dates-progress] [capability:gantt-chart-generator:browser-feature:dependencies] [capability:gantt-chart-generator:browser-feature:milestones] [capability:gantt-chart-generator:browser-feature:critical-path-highlighting] [capability:gantt-chart-generator:browser-feature:project-templates] [capability:gantt-chart-generator:browser-feature:theme]",
      },
      {
        file: "src/components/tools/GanttChartGenerator.test.ts",
        testName:
          "imports valid JSON and CSV then rejects duplicate IDs without replacing the valid editor state [capability:gantt-chart-generator:profile:release-readiness] [capability:gantt-chart-generator:accepted-input:json-project] [capability:gantt-chart-generator:accepted-input:csv-project] [capability:gantt-chart-generator:browser-feature:project-data-exchange]",
      },
      {
        file: "src/components/tools/GanttChartGenerator.test.ts",
        testName:
          "renders imported task markup as escaped tooltip text [capability:gantt-chart-generator:profile:release-readiness]",
      },
      {
        file: "src/components/tools/GanttChartGenerator.test.ts",
        testName:
          "exports JSON and CSV and restores edits from browser-local storage [capability:gantt-chart-generator:profile:release-readiness] [capability:gantt-chart-generator:produced-output:json-project] [capability:gantt-chart-generator:produced-output:csv-project] [capability:gantt-chart-generator:browser-feature:local-persistence] [capability:gantt-chart-generator:browser-feature:project-data-exchange]",
      },
      {
        file: "src/components/tools/GanttChartGenerator.test.ts",
        testName:
          "discloses local-only service limits and performs project workflows without network requests [capability:gantt-chart-generator:profile:release-readiness] [capability:gantt-chart-generator:limit:no-collaboration] [capability:gantt-chart-generator:limit:no-cloud-sync] [capability:gantt-chart-generator:limit:no-resource-management] [capability:gantt-chart-generator:limit:no-enterprise-workflow] [capability:gantt-chart-generator:limit:no-live-multi-user]",
      },
    ]);
    expect(grammarProfile.optionalServerFeatures).toEqual([]);
    expect(sqlProfile.optionalServerFeatures).toEqual([]);
    expect(typingProfile.optionalServerFeatures).toEqual([]);

    for (const profile of getPilotToolCapabilityProfiles()) {
      if (
        ![
          "grammar-checker",
          "hex-editor",
          "sql-query-optimizer",
          "excel-viewer",
          "typing-speed-test",
          "gantt-chart-generator",
        ].includes(profile.slug)
      ) {
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

  it("binds every Typing negative limit to the strengthened completed-flow evidence", () => {
    const typingProfile = getToolCapabilityProfile("typing-speed-test")!;
    const strengthenedTestName =
      "completes locally without network navigation download account ranking certificate or cloud-history side effects [capability:typing-speed-test:limit:no-account] [capability:typing-speed-test:limit:no-ranking] [capability:typing-speed-test:limit:no-certificate] [capability:typing-speed-test:limit:no-cloud-history]";

    for (const limitId of [
      "no-account",
      "no-ranking",
      "no-certificate",
      "no-cloud-history",
    ]) {
      expect(
        typingProfile.limits.find(({ id }) => id === limitId)?.evidence,
        limitId,
      ).toEqual({
        file: "src/components/tools/TypingSpeedTest.test.ts",
        testName: strengthenedTestName,
      });
      expect(strengthenedTestName).toContain(
        `[capability:typing-speed-test:limit:${limitId}]`,
      );
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
        features: [
          "editable-byte-grid",
          "byte-editing",
          "hex-ascii-search",
          "reset-changes",
          "download",
          "text-conversion",
        ],
        limits: ["two-mib-files", "local-files-only", "utf8-text-converter"],
      },
      "sql-query-optimizer": {
        features: [
          "dialect-selector",
          "static-heuristics",
          "sql-formatting",
          "composite-index-candidates",
          "explain-token-analysis",
          "copy-controls",
        ],
        limits: [
          "english-diagnostics",
          "no-database-connection",
          "no-query-execution",
          "no-automatic-rewrite",
          "unverified-indexes",
          "no-speed-guarantee",
        ],
      },
      "excel-viewer": {
        features: [
          "sheet-tabs",
          "cell-addresses",
          "formula-toggle",
          "merged-ranges",
          "single-column-sort",
          "single-column-filter",
          "row-pagination",
          "csv-download",
        ],
        limits: [
          "ten-mib-files",
          "worksheet-data-limits",
          "local-files-only",
          "no-macro-execution",
          "no-formula-recalculation",
          "no-chart-rendering",
          "limited-formatting-fidelity",
        ],
      },
      "typing-speed-test": {
        features: [
          "difficulty-prompt-banks",
          "selectable-timed-modes",
          "automatic-finish",
          "character-errors",
          "local-history",
        ],
        limits: [
          "no-account",
          "no-ranking",
          "no-certificate",
          "no-cloud-history",
        ],
      },
      "gantt-chart-generator": {
        features: [
          "task-name-dates-progress",
          "dependencies",
          "milestones",
          "critical-path-highlighting",
          "local-persistence",
          "project-templates",
          "project-data-exchange",
          "theme",
          "png-export",
          "svg-export",
        ],
        limits: [
          "no-collaboration",
          "no-cloud-sync",
          "no-resource-management",
          "no-enterprise-workflow",
          "no-live-multi-user",
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
      "hex-editor-disassembly-claim",
      "hex-editor-remote-file-claim",
      "hex-editor-executable-analysis-claim",
      "hex-editor-professional-reverse-engineering-claim",
    ]);
  });

  it("flags unsupported Gantt service claims without blocking local planning features", () => {
    const profile = getToolCapabilityProfile("gantt-chart-generator")!;
    const examples = {
      "gantt-generator-collaboration-claim": {
        positive: "Supports real-time collaboration.",
        negative: "No collaboration is available.",
      },
      "gantt-generator-cloud-sync-claim": {
        positive: "Synchronizes projects through the cloud.",
        negative: "No cloud synchronization is available.",
      },
      "gantt-generator-resource-management-claim": {
        positive: "Allocates resources across tasks.",
        negative: "Does not allocate project resources.",
      },
      "gantt-generator-enterprise-workflow-claim": {
        positive: "Supports enterprise approval workflows.",
        negative: "No enterprise workflow is available.",
      },
      "gantt-generator-live-multi-user-claim": {
        positive: "Shows live multi-user project status.",
        negative: "Does not show live multi-user status.",
      },
    } as const;

    for (const claim of profile.forbiddenClaims) {
      const example = examples[claim.code as keyof typeof examples];
      expect(example, claim.code).toBeDefined();
      expect(claim.pattern.test(example.positive), claim.code).toBe(true);
      expect(claim.pattern.test(example.negative), claim.code).toBe(false);
    }

    expect(
      profile.forbiddenClaims.some((claim) =>
        claim.pattern.test(
          "Supports task dependencies and highlights the critical path.",
        ),
      ),
    ).toBe(false);
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
      "hex-editor-disassembly-claim": {
        positive: "Provides assembly instructions from executable files.",
        negative:
          "Does not provide assembly instructions from executable files.",
      },
      "hex-editor-remote-file-claim": {
        positive: "Your file is uploaded to our server for processing.",
        negative: "Your file is not uploaded to any server.",
      },
      "hex-editor-executable-analysis-claim": {
        positive: "Supports scanning malware samples.",
        negative: "Does not scan malware samples.",
      },
      "hex-editor-professional-reverse-engineering-claim": {
        positive:
          "Provides daily workflows for professional reverse engineers.",
        negative:
          "Does not provide workflows for professional reverse engineers.",
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
      "sql-query-optimizer-native-non-english-diagnostics-claim": {
        positive: "Provides native Chinese diagnostics.",
        negative: "Local SQL diagnostics are currently English.",
      },
      "sql-optimizer-connection-claim": {
        positive: "Connects to a live database.",
        negative: "Does not connect to a database.",
      },
      "sql-optimizer-execution-claim": {
        positive: "Runs SQL queries.",
        negative: "Does not run SQL queries.",
      },
      "sql-optimizer-automatic-rewrite-claim": {
        positive: "Automatically rewrites the SQL.",
        negative: "Does not automatically rewrite the SQL.",
      },
      "sql-optimizer-verified-index-claim": {
        positive: "Verifies whether suggested indexes exist.",
        negative: "Does not verify whether suggested indexes exist.",
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

  it("records SQL local analysis, pasted plan review, and empty optional-server support", () => {
    const profile = getToolCapabilityProfile("sql-query-optimizer")!;

    expect(profile.modes.map(({ id }) => id)).toEqual([
      "local-static-analysis",
      "pasted-explain-analysis",
    ]);
    expect(profile.acceptedInputs.map(({ id }) => id)).toEqual([
      "sql-text",
      "sql-dialect",
      "explain-text",
    ]);
    expect(profile.producedOutputs.map(({ id }) => id)).toEqual([
      "analysis-score",
      "formatted-sql",
      "diagnostic-findings",
      "index-candidates",
      "explain-findings",
    ]);
    expect(profile.optionalServerFeatures).toEqual([]);
    expect(profile.supportedLocales.engine.kind).toBe("engine-limited");
    if (profile.supportedLocales.engine.kind === "engine-limited") {
      expect(profile.supportedLocales.engine.optionalServer).toEqual([]);
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
      "typing-speed-test-cloud-history-claim": {
        positive: "Offers cloud typing history.",
        negative: "No cloud typing history is available.",
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

describe("engine locale evidence contract", () => {
  const evidence = {
    file: "src/lib/example-language-support.test.ts",
    testName: "proves the example locale capability",
  };
  const claimCode = "example-native-language-claim";

  function createProfile(overrides: Record<string, unknown> = {}) {
    return {
      slug: "example",
      version: "1.0.0",
      enforcement: "release-blocking",
      modes: [],
      acceptedInputs: [],
      producedOutputs: [],
      supportedLocales: {
        ui: ["en", "ru"],
        engine: {
          kind: "engine-limited",
          local: ["en"],
          optionalServer: [],
          evidence,
          localeEvidence: [
            {
              locale: "en",
              runtime: "local",
              evidence,
              data: { kind: "behavior-test" },
            },
          ],
          disclosure: {
            labelKey: "tools.example.capabilities.limits.englishOnly",
            unsupportedLocaleClaimCodes: [claimCode],
          },
        },
      },
      browserOnlyFeatures: [],
      optionalServerFeatures: [],
      limits: [],
      forbiddenClaims: [
        { code: claimCode, pattern: /example/, reason: "test" },
      ],
      targetSearchIntents: ["example.language-support"],
      evidenceTests: [evidence],
      ...overrides,
    } as any;
  }

  function createEngineProfile(engine: Record<string, unknown>) {
    return createProfile({
      supportedLocales: { ui: ["en", "ru"], engine },
    });
  }

  it("requires exactly one contract for every declared engine locale", () => {
    const profile = createProfile();
    expect(() =>
      defineToolCapabilityProfile({
        ...profile,
        supportedLocales: {
          ...profile.supportedLocales,
          engine: {
            ...profile.supportedLocales.engine,
            localeEvidence: [],
          },
        },
      }),
    ).toThrow(
      "example: engine locale en requires exactly one locale evidence contract",
    );
  });

  it("rejects duplicate locale contracts", () => {
    const profile = createProfile();
    expect(() =>
      defineToolCapabilityProfile({
        ...profile,
        supportedLocales: {
          ...profile.supportedLocales,
          engine: {
            ...profile.supportedLocales.engine,
            localeEvidence: [
              ...profile.supportedLocales.engine.localeEvidence,
              ...profile.supportedLocales.engine.localeEvidence,
            ],
          },
        },
      }),
    ).toThrow(
      "example: engine locale en requires exactly one locale evidence contract",
    );
  });

  it("rejects contracts for undeclared locales", () => {
    const profile = createProfile();
    expect(() =>
      defineToolCapabilityProfile({
        ...profile,
        supportedLocales: {
          ...profile.supportedLocales,
          engine: {
            ...profile.supportedLocales.engine,
            localeEvidence: [
              ...profile.supportedLocales.engine.localeEvidence,
              {
                ...profile.supportedLocales.engine.localeEvidence[0],
                locale: "ru",
              },
            ],
          },
        },
      }),
    ).toThrow("example: locale evidence declares unsupported locale ru");
  });

  it("rejects a locale contract with the wrong runtime", () => {
    const profile = createProfile();
    expect(() =>
      defineToolCapabilityProfile({
        ...profile,
        supportedLocales: {
          ...profile.supportedLocales,
          engine: {
            ...profile.supportedLocales.engine,
            localeEvidence: [
              {
                ...profile.supportedLocales.engine.localeEvidence[0],
                runtime: "optional-server",
              },
            ],
          },
        },
      }),
    ).toThrow("example: engine locale en has an invalid runtime");
  });

  it("rejects an empty disclosure key", () => {
    const profile = createProfile();
    expect(() =>
      defineToolCapabilityProfile({
        ...profile,
        supportedLocales: {
          ...profile.supportedLocales,
          engine: {
            ...profile.supportedLocales.engine,
            disclosure: {
              ...profile.supportedLocales.engine.disclosure,
              labelKey: "  ",
            },
          },
        },
      }),
    ).toThrow("example: engine language disclosure label is required");
  });

  it("rejects locale evidence without a disclosure contract", () => {
    const profile = createProfile();
    const { disclosure: _disclosure, ...engineWithoutDisclosure } =
      profile.supportedLocales.engine;

    expect(() =>
      defineToolCapabilityProfile({
        ...profile,
        supportedLocales: {
          ...profile.supportedLocales,
          engine: engineWithoutDisclosure,
        },
      }),
    ).toThrow("example: engine language disclosure is required");
  });

  it("rejects a disclosure contract without locale evidence", () => {
    const profile = createProfile();
    const { localeEvidence: _localeEvidence, ...engineWithoutLocaleEvidence } =
      profile.supportedLocales.engine;

    expect(() =>
      defineToolCapabilityProfile({
        ...profile,
        supportedLocales: {
          ...profile.supportedLocales,
          engine: engineWithoutLocaleEvidence,
        },
      }),
    ).toThrow("example: engine locale evidence is required");
  });

  it("rejects an engine-limited profile without locale evidence or disclosure", () => {
    const profile = createProfile();
    const {
      localeEvidence: _localeEvidence,
      disclosure: _disclosure,
      ...engineWithoutLocaleContracts
    } = profile.supportedLocales.engine;

    expect(() =>
      defineToolCapabilityProfile({
        ...profile,
        supportedLocales: {
          ...profile.supportedLocales,
          engine: engineWithoutLocaleContracts,
        },
      }),
    ).toThrow("example: engine locale evidence is required");
  });

  it("rejects a disclosure key outside the tool namespace", () => {
    const profile = createProfile();
    expect(() =>
      defineToolCapabilityProfile({
        ...profile,
        supportedLocales: {
          ...profile.supportedLocales,
          engine: {
            ...profile.supportedLocales.engine,
            disclosure: {
              ...profile.supportedLocales.engine.disclosure,
              labelKey: "tools.other.capabilities.limits.englishOnly",
            },
          },
        },
      }),
    ).toThrow(
      "example: engine language disclosure label must use tools.example.*",
    );
  });

  it("rejects empty, duplicate, and unknown disclosure claim codes", () => {
    const profile = createProfile();
    expect(() =>
      defineToolCapabilityProfile({
        ...profile,
        supportedLocales: {
          ...profile.supportedLocales,
          engine: {
            ...profile.supportedLocales.engine,
            disclosure: {
              ...profile.supportedLocales.engine.disclosure,
              unsupportedLocaleClaimCodes: [""],
            },
          },
        },
      }),
    ).toThrow("example: engine language disclosure claim code is required");
    expect(() =>
      defineToolCapabilityProfile({
        ...profile,
        supportedLocales: {
          ...profile.supportedLocales,
          engine: {
            ...profile.supportedLocales.engine,
            disclosure: {
              ...profile.supportedLocales.engine.disclosure,
              unsupportedLocaleClaimCodes: [claimCode, claimCode],
            },
          },
        },
      }),
    ).toThrow(
      "example: engine language disclosure claim code example-native-language-claim must be unique",
    );
    expect(() =>
      defineToolCapabilityProfile({
        ...profile,
        supportedLocales: {
          ...profile.supportedLocales,
          engine: {
            ...profile.supportedLocales.engine,
            disclosure: {
              ...profile.supportedLocales.engine.disclosure,
              unsupportedLocaleClaimCodes: ["unknown-claim"],
            },
          },
        },
      }),
    ).toThrow(
      "example: engine language disclosure claim code unknown-claim is not forbidden",
    );
  });

  it("rejects invalid and traversal data paths", () => {
    const profile = createProfile();
    for (const file of ["/fixtures/example.ts", "../fixtures/example.ts"]) {
      expect(() =>
        defineToolCapabilityProfile({
          ...profile,
          supportedLocales: {
            ...profile.supportedLocales,
            engine: {
              ...profile.supportedLocales.engine,
              localeEvidence: [
                {
                  ...profile.supportedLocales.engine.localeEvidence[0],
                  data: {
                    kind: "fixture-object",
                    file,
                    exportName: "prompts",
                    minimumNonEmptyValues: 1,
                  },
                },
              ],
            },
          },
        }),
      ).toThrow(
        "example: engine locale en data path must be a relative repository path",
      );
    }
  });

  it("rejects URI schemes in fixture-object data paths", () => {
    const profile = createProfile();
    for (const file of [
      "https://example.test/fixture.ts",
      "file:///tmp/fixture.ts",
    ]) {
      expect(() =>
        defineToolCapabilityProfile({
          ...profile,
          supportedLocales: {
            ...profile.supportedLocales,
            engine: {
              ...profile.supportedLocales.engine,
              localeEvidence: [
                {
                  ...profile.supportedLocales.engine.localeEvidence[0],
                  data: {
                    kind: "fixture-object",
                    file,
                    exportName: "prompts",
                    minimumNonEmptyValues: 1,
                  },
                },
              ],
            },
          },
        }),
      ).toThrow(
        "example: engine locale en data path must be a relative repository path",
      );
    }
  });

  it("rejects non-positive and non-integer evidence minimums", () => {
    const profile = createProfile();
    for (const minimumNonEmptyValues of [0, 1.5]) {
      expect(() =>
        defineToolCapabilityProfile({
          ...profile,
          supportedLocales: {
            ...profile.supportedLocales,
            engine: {
              ...profile.supportedLocales.engine,
              localeEvidence: [
                {
                  ...profile.supportedLocales.engine.localeEvidence[0],
                  data: {
                    kind: "fixture-object",
                    file: "src/fixtures/example.ts",
                    exportName: "prompts",
                    minimumNonEmptyValues,
                  },
                },
              ],
            },
          },
        }),
      ).toThrow(
        "example: engine locale en evidence minimum must be a positive integer",
      );
    }
  });

  it("rejects an empty message path", () => {
    const profile = createProfile();
    expect(() =>
      defineToolCapabilityProfile({
        ...profile,
        supportedLocales: {
          ...profile.supportedLocales,
          engine: {
            ...profile.supportedLocales.engine,
            localeEvidence: [
              {
                ...profile.supportedLocales.engine.localeEvidence[0],
                data: {
                  kind: "message-prompt-bank",
                  fileTemplate: "src/messages/{locale}/tools/example.json",
                  messagePath: [""],
                  minimumNonEmptyEntries: 1,
                },
              },
            ],
          },
        },
      }),
    ).toThrow("example: engine locale en message path segments are required");
  });

  it("requires exactly one locale token in a prompt template", () => {
    const profile = createProfile();
    for (const fileTemplate of [
      "src/messages/en/tools/example.json",
      "src/messages/{locale}/{locale}/example.json",
    ]) {
      expect(() =>
        defineToolCapabilityProfile({
          ...profile,
          supportedLocales: {
            ...profile.supportedLocales,
            engine: {
              ...profile.supportedLocales.engine,
              localeEvidence: [
                {
                  ...profile.supportedLocales.engine.localeEvidence[0],
                  data: {
                    kind: "message-prompt-bank",
                    fileTemplate,
                    messagePath: ["prompts"],
                    minimumNonEmptyEntries: 1,
                  },
                },
              ],
            },
          },
        }),
      ).toThrow(
        "example: engine locale en prompt template requires exactly one {locale} token",
      );
    }
  });

  it("rejects locale-only fields on a language-neutral profile", () => {
    expect(() =>
      defineToolCapabilityProfile(
        createEngineProfile({
          kind: "language-neutral",
          evidence,
          localeEvidence: [],
          disclosure: {
            labelKey: "tools.example.capabilities.limits.englishOnly",
            unsupportedLocaleClaimCodes: [claimCode],
          },
        }),
      ),
    ).toThrow(
      "example: language-neutral engines cannot declare locale evidence or disclosure",
    );
  });

  it("copies and freezes locale evidence arrays and nested values", () => {
    const profile = createProfile();
    const defined = defineToolCapabilityProfile(profile);
    const engine = defined.supportedLocales.engine as any;

    expect(engine.localeEvidence).not.toBe(
      profile.supportedLocales.engine.localeEvidence,
    );
    expect(engine.disclosure).not.toBe(
      profile.supportedLocales.engine.disclosure,
    );
    expect(Object.isFrozen(engine.localeEvidence)).toBe(true);
    expect(Object.isFrozen(engine.localeEvidence[0])).toBe(true);
    expect(Object.isFrozen(engine.localeEvidence[0].evidence)).toBe(true);
    expect(Object.isFrozen(engine.localeEvidence[0].data)).toBe(true);
    expect(Object.isFrozen(engine.disclosure)).toBe(true);
    expect(Object.isFrozen(engine.disclosure.unsupportedLocaleClaimCodes)).toBe(
      true,
    );
  });
});
