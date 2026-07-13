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

    for (const slug of PILOT_TOOL_SLUGS) {
      const profile = getToolCapabilityProfile(slug);
      expect(profile?.slug).toBe(slug);
      expect(profile?.version).toBe("1.0.0");
      expect(profile?.version).toMatch(/^\d+\.\d+\.\d+$/);
      expect(profile?.enforcement).toBe("inventory");
      expect(profile?.forbiddenClaims.length).toBeGreaterThan(0);
      expect(profile?.supportedLocales.ui).toEqual(locales);
      expect(Object.isFrozen(profile)).toBe(true);
    }
  });

  it("does not invent a blocking profile for unrelated legacy tools", () => {
    expect(getToolCapabilityProfile("json-formatter")).toBeUndefined();
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

  it("keeps every pilot as browser-only inventory until behavior evidence exists", () => {
    for (const profile of getPilotToolCapabilityProfiles()) {
      expect(profile.enforcement).toBe("inventory");
      expect(profile.evidenceTests).toEqual([]);
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
});

describe("capability profile definition", () => {
  const inventoryProfile = getToolCapabilityProfile("grammar-checker")!;

  it("rejects a missing slug or non-semantic version", () => {
    expect(() =>
      defineToolCapabilityProfile({
        ...inventoryProfile,
        slug: "",
        version: "1.0",
      }),
    ).toThrow("Invalid capability profile identity: @1.0");
  });

  it("rejects release blocking without behavior evidence", () => {
    expect(() =>
      defineToolCapabilityProfile({
        ...inventoryProfile,
        enforcement: "release-blocking",
        evidenceTests: [],
      }),
    ).toThrow(
      "grammar-checker: release-blocking profiles require behavior evidence",
    );
  });

  it("rejects profiles that cannot constrain unsupported claims", () => {
    expect(() =>
      defineToolCapabilityProfile({ ...inventoryProfile, forbiddenClaims: [] }),
    ).toThrow("grammar-checker: at least one forbidden claim is required");
  });
});
