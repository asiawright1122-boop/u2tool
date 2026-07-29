import { describe, expect, it } from "vitest";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { tmpdir } from "node:os";

import {
  assembleToolIndexReadinessInputs,
  buildToolIndexReadinessReport,
  parseGscPageRows,
  parseGscPageRowsForPeriod,
  parseGscQueryRows,
  parseToolIndexReadinessArgs,
  RECOMMENDATION_ONLY_NOTICE,
  renderToolIndexReadinessCsv,
  renderToolIndexReadinessJson,
  renderToolIndexReadinessMarkdown,
} from "./tool-index-readiness-report";
import type { IndexReadinessEvidence } from "../../src/lib/tool-index-readiness";

function evidence(
  overrides: Partial<IndexReadinessEvidence> = {},
): IndexReadinessEvidence {
  return {
    slug: "grammar-checker",
    locale: "en",
    priority: "pilot",
    hasCapabilityProfile: true,
    capabilityEnforcement: "release-blocking",
    localEngineSupportsLocale: true,
    capabilityClaimIssues: [],
    content: {
      hasIndependentSplitCopy: true,
      detailedDescriptionLength: 300,
      usageStepCount: 4,
      usageExampleCount: 3,
      faqCount: 3,
      duplicateContentKey: null,
      fallbackUsed: false,
    },
    technical: {
      routeExists: true,
      inSitemap: true,
      canonicalSelfReferences: true,
      hreflangPasses: true,
      renderedStatus: 200,
    },
    demand: {
      currentClicks: 2,
      currentImpressions: 20,
      historicalClicks: 0,
      historicalImpressions: 0,
      topQueryShare: 0.4,
    },
    overlap: {
      strongerSiblingSlug: null,
      samePrimaryIntent: false,
    },
    protectedControl: false,
    ...overrides,
  };
}

describe("tool index readiness evidence report", () => {
  it("parses the checkpoint date and supplies the stable baseline input paths", () => {
    expect(
      parseToolIndexReadinessArgs(["--checkpoint-date", "2026-07-13"]),
    ).toEqual({
      checkpointDate: "2026-07-13",
      currentPagesCsv: "exports/gsc/checkpoints/2026-07-13/raw/网页.csv",
      historicalPagesCsv:
        "exports/gsc/checkpoints/2026-07-13/raw/网页-previous.csv",
      currentQueriesCsv: "exports/gsc/checkpoints/2026-07-13/raw/查询数.csv",
      renderedContractsJson:
        "exports/seo/tool-index-readiness/2026-07-13/rendered-contracts.json",
      outputDir: "exports/seo/tool-index-readiness/2026-07-13",
    });
  });

  it("registers the evidence reporter package script", async () => {
    const packageJson = JSON.parse(
      await readFile(path.join(process.cwd(), "package.json"), "utf8"),
    ) as { scripts: Record<string, string> };

    expect(packageJson.scripts["report:tool-index-readiness"]).toBe(
      "node --import tsx/esm scripts/seo/tool-index-readiness-report.ts",
    );
  });

  it("parses an English GSC page export through the public parser", () => {
    expect(
      parseGscPageRows(
        [
          "Top pages,Clicks,Impressions,Position",
          "https://www.u2tool.com/en/tools/grammar-checker/,2,41,12.5",
        ].join("\n"),
      ),
    ).toEqual([
      {
        url: "https://www.u2tool.com/en/tools/grammar-checker/",
        clicks: 2,
        impressions: 41,
        position: 12.5,
      },
    ]);
  });

  it("parses current metrics from Chinese GSC comparison headers", () => {
    expect(
      parseGscPageRows(
        [
          "排名靠前的网页,2026/7/4 - 2026/7/10 点击次数,2026/6/27 - 2026/7/3 点击次数,2026/7/4 - 2026/7/10 展示,2026/6/27 - 2026/7/3 展示,2026/7/4 - 2026/7/10 排名,2026/6/27 - 2026/7/3 排名",
          "https://www.u2tool.com/ru/tools/grammar-checker/,1,2,116,264,87.54,86.78",
        ].join("\n"),
      ),
    ).toEqual([
      {
        url: "https://www.u2tool.com/ru/tools/grammar-checker/",
        clicks: 1,
        impressions: 116,
        position: 87.54,
      },
    ]);
  });

  it("selects previous-period columns when the same wide export has the historical role", () => {
    const wideCsv = [
      "排名靠前的网页,2026/7/4 - 2026/7/10 点击次数,2026/6/27 - 2026/7/3 点击次数,2026/7/4 - 2026/7/10 展示,2026/6/27 - 2026/7/3 展示,2026/7/4 - 2026/7/10 排名,2026/6/27 - 2026/7/3 排名",
      "https://www.u2tool.com/ru/tools/grammar-checker/,1,2,116,264,87.54,86.78",
    ].join("\n");

    expect(parseGscPageRowsForPeriod(wideCsv, "historical")).toEqual([
      {
        url: "https://www.u2tool.com/ru/tools/grammar-checker/",
        clicks: 2,
        impressions: 264,
        position: 86.78,
      },
    ]);
  });

  it("selects semantic current and previous columns even when wide headers are reversed", () => {
    const reversedWideCsv = [
      "Top pages,Previous Clicks,Current Clicks,Previous Impressions,Current Impressions,Previous Position,Current Position",
      "https://www.u2tool.com/en/tools/grammar-checker/,2,1,264,116,86.78,87.54",
    ].join("\n");

    expect(
      parseGscPageRowsForPeriod(reversedWideCsv, "current")[0],
    ).toMatchObject({
      clicks: 1,
      impressions: 116,
      position: 87.54,
    });
    expect(
      parseGscPageRowsForPeriod(reversedWideCsv, "historical")[0],
    ).toMatchObject({
      clicks: 2,
      impressions: 264,
      position: 86.78,
    });
  });

  it("preserves comma-containing query text without inventing a URL association", () => {
    expect(
      parseGscQueryRows(
        [
          "Top queries,Clicks,Impressions,Position",
          '"grammar checker, online",3,20,8.5',
        ].join("\n"),
      ),
    ).toEqual([
      {
        query: "grammar checker, online",
        clicks: 3,
        impressions: 20,
        position: 8.5,
      },
    ]);
  });

  it("keeps a missing historical URL row as missing evidence instead of zero demand", () => {
    const report = buildToolIndexReadinessReport({
      checkpointDate: "2026-07-13",
      queryEvidence: {
        scope: "property-query-only",
        rowCount: 1,
        urlJoinAvailable: false,
      },
      rows: [
        {
          url: "https://www.u2tool.com/en/tools/grammar-checker/",
          category: "text",
          evidence: evidence(),
          demandCoverage: {
            currentPageRow: true,
            historicalPageRow: false,
          },
          overrideReasons: [],
        },
      ],
    });

    expect(report.rows[0].decision).toMatchObject({
      recommendation: "manual-review",
      reviewRequired: true,
      missingEvidence: ["demand.historicalPageRow"],
    });
    expect(report.rows[0].decision.reasons).toContain(
      "gsc-historical-page-row-missing",
    );
  });

  it("never leaks a zero-demand reason from numeric placeholders for missing GSC rows", () => {
    const report = buildToolIndexReadinessReport({
      checkpointDate: "2026-07-13",
      queryEvidence: {
        scope: "property-query-only",
        rowCount: 0,
        urlJoinAvailable: false,
      },
      rows: [
        {
          url: "https://www.u2tool.com/ar/tools/missing-demand/",
          category: "text",
          evidence: evidence({
            slug: "missing-demand",
            locale: "ar",
            priority: "catalog",
            hasCapabilityProfile: false,
            capabilityEnforcement: "unprofiled",
            localEngineSupportsLocale: false,
            content: {
              hasIndependentSplitCopy: false,
              detailedDescriptionLength: 0,
              usageStepCount: 0,
              usageExampleCount: 0,
              faqCount: 0,
              duplicateContentKey: "duplicate",
              fallbackUsed: true,
            },
            demand: {
              currentClicks: 0,
              currentImpressions: 0,
              historicalClicks: 0,
              historicalImpressions: 0,
              topQueryShare: null,
            },
          }),
          demandCoverage: {
            currentPageRow: false,
            historicalPageRow: false,
          },
          overrideReasons: [],
        },
      ],
    });

    expect(report.rows[0].decision.recommendation).toBe("manual-review");
    expect(report.rows[0].decision.reasons).not.toContain("zero-demand");
  });

  it("serializes missing GSC period metrics as null in JSON and empty CSV cells", async () => {
    const input = await assembleToolIndexReadinessInputs({
      checkpointDate: "2026-07-13",
      currentPages: [],
      historicalPages: [],
      currentQueries: [],
      renderedContracts: { results: [] },
      toolCatalog: [
        {
          slug: "grammar-checker",
          category: "text",
          icon: "spell-check",
          component: "GrammarChecker",
        },
      ],
      localeCatalog: ["en"],
      loadMessages: async () => ({}),
      hasIndependentSplitCopy: async () => true,
    });
    const report = buildToolIndexReadinessReport(input);
    const parsedJson = JSON.parse(
      renderToolIndexReadinessJson(report),
    ) as typeof report;
    const csvLines = renderToolIndexReadinessCsv(report).trim().split("\n");
    const headers = csvLines[1].split(",");
    const values = csvLines[2].split(",");

    expect(parsedJson.rows[0].sourceEvidence).toMatchObject({
      currentGsc: {
        observed: false,
        clicks: null,
        impressions: null,
        position: null,
      },
      historicalGsc: {
        observed: false,
        clicks: null,
        impressions: null,
        position: null,
      },
    });
    expect(parsedJson.rows[0].evidence.demand).toMatchObject({
      currentClicks: null,
      currentImpressions: null,
      historicalClicks: null,
      historicalImpressions: null,
    });
    for (const header of [
      "current_clicks",
      "current_impressions",
      "historical_clicks",
      "historical_impressions",
    ]) {
      expect(values[headers.indexOf(header)]).toBe("");
    }
  });

  it("sorts deterministically by recommendation, priority, locale, then slug", () => {
    const completeCoverage = {
      currentPageRow: true,
      historicalPageRow: true,
    };
    const makeRow = (rowEvidence: IndexReadinessEvidence) => ({
      url: `https://www.u2tool.com/${rowEvidence.locale}/tools/${rowEvidence.slug}/`,
      category: "text",
      evidence: rowEvidence,
      demandCoverage: completeCoverage,
      overrideReasons: [],
    });
    const rows = [
      makeRow(evidence({ slug: "manual", protectedControl: true })),
      makeRow(
        evidence({
          slug: "zero",
          priority: "catalog",
          hasCapabilityProfile: false,
          capabilityEnforcement: "unprofiled",
          localEngineSupportsLocale: false,
          content: {
            hasIndependentSplitCopy: false,
            detailedDescriptionLength: 0,
            usageStepCount: 0,
            usageExampleCount: 0,
            faqCount: 0,
            duplicateContentKey: "duplicate",
            fallbackUsed: true,
          },
          demand: {
            currentClicks: 0,
            currentImpressions: 0,
            historicalClicks: 0,
            historicalImpressions: 0,
            topQueryShare: null,
          },
        }),
      ),
      makeRow(
        evidence({
          slug: "merge",
          overlap: {
            strongerSiblingSlug: "stronger",
            samePrimaryIntent: true,
          },
        }),
      ),
      makeRow(
        evidence({
          slug: "improve",
          priority: "p1",
          technical: {
            routeExists: false,
            inSitemap: true,
            canonicalSelfReferences: true,
            hreflangPasses: true,
            renderedStatus: 200,
          },
        }),
      ),
      makeRow(evidence({ slug: "zulu", locale: "en", priority: "pilot" })),
      makeRow(evidence({ slug: "beta", locale: "zh", priority: "pilot" })),
      makeRow(evidence({ slug: "alpha", locale: "zh", priority: "catalog" })),
    ];

    const report = buildToolIndexReadinessReport({
      checkpointDate: "2026-07-13",
      queryEvidence: {
        scope: "property-query-only",
        rowCount: 0,
        urlJoinAvailable: false,
      },
      rows,
    });

    expect(
      report.rows.map((row) => [
        row.decision.recommendation,
        row.evidence.priority,
        row.evidence.locale,
        row.evidence.slug,
      ]),
    ).toEqual([
      ["keep", "pilot", "en", "zulu"],
      ["keep", "pilot", "zh", "beta"],
      ["keep", "catalog", "zh", "alpha"],
      ["improve", "p1", "en", "improve"],
      ["merge", "pilot", "en", "merge"],
      ["noindex-candidate", "catalog", "en", "zero"],
      ["manual-review", "pilot", "en", "manual"],
    ]);
  });

  it("normalizes slash and host variants and aggregates duplicate canonical rows", async () => {
    const input = await assembleToolIndexReadinessInputs({
      checkpointDate: "2026-07-13",
      currentPages: [
        {
          url: "https://u2tool.com/en/tools/grammar-checker",
          clicks: 1,
          impressions: 10,
          position: 10,
        },
        {
          url: "http://www.u2tool.com/en/tools/grammar-checker/",
          clicks: 2,
          impressions: 30,
          position: 20,
        },
      ],
      historicalPages: [
        {
          url: "https://www.u2tool.com/en/tools/grammar-checker/",
          clicks: 4,
          impressions: 50,
          position: 15,
        },
      ],
      currentQueries: [],
      renderedContracts: { results: [] },
      toolCatalog: [
        {
          slug: "grammar-checker",
          category: "text",
          icon: "spell-check",
          component: "GrammarChecker",
        },
      ],
      localeCatalog: ["en"],
      loadMessages: async () => ({
        detailed_description: "A".repeat(240),
        usage_steps: ["one", "two", "three"],
        usage_examples: ["one", "two"],
        faqs: [{ question: "q", answer: "a" }],
      }),
      hasIndependentSplitCopy: async () => true,
    });

    expect(input.rows).toHaveLength(1);
    expect(input.rows[0]).toMatchObject({
      url: "https://www.u2tool.com/en/tools/grammar-checker/",
      demandCoverage: {
        currentPageRow: true,
        historicalPageRow: true,
      },
      evidence: {
        demand: {
          currentClicks: 3,
          currentImpressions: 40,
          historicalClicks: 4,
          historicalImpressions: 50,
          topQueryShare: null,
        },
      },
      sourceEvidence: {
        splitMessagePath: "src/messages/en/tools/grammar-checker.json",
        currentGsc: {
          observed: true,
          position: 17.5,
        },
        historicalGsc: {
          observed: true,
          position: 15,
        },
        renderedContractObserved: false,
        routeTemplatePath: "src/pages/[locale]/tools/[slug].astro",
        sitemapPath: "/en/tools/grammar-checker",
      },
    });
  });

  it("carries locale capability validator issues into the assembled evidence", async () => {
    const input = await assembleToolIndexReadinessInputs({
      checkpointDate: "2026-07-13",
      currentPages: [],
      historicalPages: [],
      currentQueries: [],
      renderedContracts: { results: [] },
      toolCatalog: [
        {
          slug: "grammar-checker",
          category: "text",
          icon: "spell-check",
          component: "GrammarChecker",
        },
      ],
      localeCatalog: ["es"],
      loadMessages: async () => ({
        detailed_description: "Contenido sin aviso del límite del motor.",
      }),
      hasIndependentSplitCopy: async () => true,
    });

    expect(input.rows[0].evidence.capabilityClaimIssues).toContain(
      "locale:missing-disclosure",
    );
    expect(input.rows[0].evidence.localEngineSupportsLocale).toBe(false);
  });

  it("keeps unprofiled locale support as missing evidence instead of inferring unsupported", async () => {
    const slug = "unprofiled-tool";
    const url = `https://www.u2tool.com/en/tools/${slug}/`;
    const input = await assembleToolIndexReadinessInputs({
      checkpointDate: "2026-07-13",
      currentPages: [{ url, clicks: 0, impressions: 0, position: 0 }],
      historicalPages: [{ url, clicks: 0, impressions: 0, position: 0 }],
      currentQueries: [],
      renderedContracts: {
        results: [
          {
            locale: "en",
            slug,
            status: 200,
            canonicalSelfReferences: true,
            hreflangPasses: true,
          },
        ],
      },
      toolCatalog: [
        {
          slug,
          category: "text",
          icon: "file",
          component: "UnprofiledTool",
        },
      ],
      localeCatalog: ["en"],
      loadMessages: async () => ({}),
      hasIndependentSplitCopy: async () => false,
    });
    const report = buildToolIndexReadinessReport(input);

    expect(report.rows[0].decision).toMatchObject({
      recommendation: "manual-review",
      missingEvidence: ["localEngineSupportsLocale"],
      reviewRequired: true,
    });
  });

  it("flags only whitespace-normalized exact duplicate support blocks", async () => {
    const sharedSupport = {
      detailed_description: "Same detailed support copy.",
      usage_steps: ["One", "Two"],
      usage_examples: ["Example"],
      faqs: [{ question: "Question", answer: "Answer" }],
    };
    const input = await assembleToolIndexReadinessInputs({
      checkpointDate: "2026-07-13",
      currentPages: [],
      historicalPages: [],
      currentQueries: [],
      renderedContracts: { results: [] },
      toolCatalog: [
        {
          slug: "duplicate-a",
          category: "text",
          icon: "a",
          component: "DuplicateA",
        },
        {
          slug: "duplicate-b",
          category: "text",
          icon: "b",
          component: "DuplicateB",
        },
      ],
      localeCatalog: ["en"],
      loadMessages: async (_locale, slug) =>
        slug === "duplicate-a"
          ? { ...sharedSupport, custom_label: "A" }
          : {
              ...sharedSupport,
              detailed_description: "  Same   detailed support copy.  ",
              custom_label: "B",
            },
      hasIndependentSplitCopy: async () => true,
    });

    const duplicateKeys = input.rows.map(
      ({ evidence: rowEvidence }) => rowEvidence.content.duplicateContentKey,
    );
    expect(duplicateKeys[0]).toMatch(/^[a-f0-9]{64}$/u);
    expect(duplicateKeys[1]).toBe(duplicateKeys[0]);
  });

  it("counts only non-empty steps and examples and complete FAQ entries", async () => {
    const input = await assembleToolIndexReadinessInputs({
      checkpointDate: "2026-07-13",
      currentPages: [],
      historicalPages: [],
      currentQueries: [],
      renderedContracts: { results: [] },
      toolCatalog: [
        {
          slug: "invalid-support-items",
          category: "text",
          icon: "file",
          component: "InvalidSupportItems",
        },
      ],
      localeCatalog: ["en"],
      loadMessages: async () => ({
        detailed_description: "Description",
        usage_steps: ["", null, "valid"],
        usage_examples: [null, ""],
        faqs: [
          1,
          { question: "Question only", answer: "" },
          { question: "", answer: "Answer only" },
        ],
      }),
      hasIndependentSplitCopy: async () => true,
    });

    expect(input.rows[0].evidence.content).toMatchObject({
      usageStepCount: 1,
      usageExampleCount: 0,
      faqCount: 0,
    });
  });

  it("assembles route, sitemap, rendered contract, content, and protected override evidence", async () => {
    const url = "https://www.u2tool.com/es/tools/timeline-chart-generator/";
    const input = await assembleToolIndexReadinessInputs({
      checkpointDate: "2026-07-13",
      currentPages: [{ url, clicks: 0, impressions: 146, position: 81.09 }],
      historicalPages: [{ url, clicks: 0, impressions: 20, position: 78.4 }],
      currentQueries: [],
      renderedContracts: {
        results: [
          {
            locale: "es",
            slug: "timeline-chart-generator",
            status: 200,
            hreflangPasses: true,
            contract: {
              canonical: "/es/tools/timeline-chart-generator/",
            },
          },
        ],
      },
      toolCatalog: [
        {
          slug: "timeline-chart-generator",
          category: "charts",
          icon: "timeline",
          component: "TimelineChartGenerator",
        },
      ],
      localeCatalog: ["es"],
      loadMessages: async () => ({
        detailed_description: "D".repeat(240),
        usage_steps: ["one", "two", "three"],
        usage_examples: ["one", "two"],
        faqs: [
          { question: "Q1", answer: "A1" },
          { question: "Q2", answer: "A2" },
          { question: "Q3", answer: "A3" },
        ],
      }),
      hasIndependentSplitCopy: async () => true,
    });

    expect(input.rows[0]).toMatchObject({
      overrideReasons: [
        expect.stringContaining("Spanish chart recovery comparison cohort"),
      ],
      sourceEvidence: {
        renderedContractObserved: true,
      },
      evidence: {
        protectedControl: true,
        content: {
          hasIndependentSplitCopy: true,
          detailedDescriptionLength: 240,
          usageStepCount: 3,
          usageExampleCount: 2,
          faqCount: 3,
          fallbackUsed: false,
        },
        technical: {
          routeExists: true,
          inSitemap: true,
          canonicalSelfReferences: true,
          hreflangPasses: true,
          renderedStatus: 200,
        },
      },
    });
  });

  it("rejects a rendered canonical on a foreign origin", async () => {
    const input = await assembleToolIndexReadinessInputs({
      checkpointDate: "2026-07-13",
      currentPages: [],
      historicalPages: [],
      currentQueries: [],
      renderedContracts: {
        results: [
          {
            locale: "en",
            slug: "grammar-checker",
            status: 200,
            hreflangPasses: true,
            contract: {
              canonical: "https://example.com/en/tools/grammar-checker/",
            },
          },
        ],
      },
      toolCatalog: [
        {
          slug: "grammar-checker",
          category: "text",
          icon: "spell-check",
          component: "GrammarChecker",
        },
      ],
      localeCatalog: ["en"],
      loadMessages: async () => ({}),
      hasIndependentSplitCopy: async () => true,
    });

    expect(input.rows[0].evidence.technical.canonicalSelfReferences).toBe(
      false,
    );
  });

  it("assembles every one of the 5,700 repository tool-locale pairs without treating absent rendered evidence as passing", async () => {
    const input = await assembleToolIndexReadinessInputs({
      checkpointDate: "2026-07-13",
      currentPages: [],
      historicalPages: [],
      currentQueries: [],
      renderedContracts: { results: [] },
    });

    expect(input.rows).toHaveLength(5_700);
    expect(
      new Set(
        input.rows.map(
          ({ evidence: rowEvidence }) =>
            `${rowEvidence.locale}/${rowEvidence.slug}`,
        ),
      ).size,
    ).toBe(5_700);
    expect(
      input.rows.filter(
        ({ evidence: rowEvidence }) => rowEvidence.priority === "pilot",
      ),
    ).toHaveLength(60);
    expect(
      input.rows.filter(
        ({ evidence: rowEvidence }) => rowEvidence.priority === "p1",
      ),
    ).toHaveLength(1_470);
    expect(
      input.rows.every(
        ({ evidence: rowEvidence }) =>
          rowEvidence.content.hasIndependentSplitCopy &&
          rowEvidence.technical.routeExists &&
          rowEvidence.technical.inSitemap &&
          rowEvidence.technical.canonicalSelfReferences === null &&
          rowEvidence.technical.hreflangPasses === null &&
          rowEvidence.technical.renderedStatus === null,
      ),
    ).toBe(true);
    expect(
      input.rows.filter(
        ({ evidence: rowEvidence }) => rowEvidence.protectedControl,
      ),
    ).toHaveLength(5);
  }, 60_000);

  it("renders recommendation-only JSON, CSV, and Markdown with complete review queues", () => {
    const completeCoverage = {
      currentPageRow: true,
      historicalPageRow: true,
    };
    const report = buildToolIndexReadinessReport({
      checkpointDate: "2026-07-13",
      queryEvidence: {
        scope: "property-query-only",
        rowCount: 2,
        urlJoinAvailable: false,
      },
      rows: [
        {
          url: "https://www.u2tool.com/en/tools/merge-me/",
          category: "text",
          evidence: evidence({
            slug: "merge-me",
            overlap: {
              strongerSiblingSlug: "stronger",
              samePrimaryIntent: true,
            },
          }),
          demandCoverage: completeCoverage,
          overrideReasons: [],
        },
        {
          url: "https://www.u2tool.com/es/tools/protected/",
          category: "charts",
          evidence: evidence({
            slug: "protected",
            locale: "es",
            protectedControl: true,
          }),
          demandCoverage: completeCoverage,
          overrideReasons: ["Spanish chart recovery control"],
        },
        {
          url: "https://www.u2tool.com/ar/tools/zero/",
          category: "text",
          evidence: evidence({
            slug: "zero",
            locale: "ar",
            priority: "catalog",
            hasCapabilityProfile: false,
            capabilityEnforcement: "unprofiled",
            localEngineSupportsLocale: false,
            content: {
              hasIndependentSplitCopy: false,
              detailedDescriptionLength: 0,
              usageStepCount: 0,
              usageExampleCount: 0,
              faqCount: 0,
              duplicateContentKey: "duplicate",
              fallbackUsed: true,
            },
            demand: {
              currentClicks: 0,
              currentImpressions: 0,
              historicalClicks: 0,
              historicalImpressions: 0,
              topQueryShare: null,
            },
          }),
          demandCoverage: completeCoverage,
          overrideReasons: [],
        },
      ],
    });

    const json = renderToolIndexReadinessJson(report);
    const csv = renderToolIndexReadinessCsv(report);
    const markdown = renderToolIndexReadinessMarkdown(report);

    expect(JSON.parse(json)).toMatchObject({
      notice: RECOMMENDATION_ONLY_NOTICE,
      checkpointDate: "2026-07-13",
      rows: expect.arrayContaining([
        expect.objectContaining({
          url: "https://www.u2tool.com/en/tools/merge-me/",
          implementationPlanRequired: true,
          decision: expect.objectContaining({
            reviewRequired: true,
          }),
        }),
      ]),
    });
    expect(csv.startsWith(`${RECOMMENDATION_ONLY_NOTICE}\n`)).toBe(true);
    expect(csv.trim().split("\n")).toHaveLength(report.rows.length + 2);
    expect(markdown.startsWith(`${RECOMMENDATION_ONLY_NOTICE}\n`)).toBe(true);
    expect(markdown).toContain("## Totals");
    expect(markdown).toContain("## Locale summaries");
    expect(markdown).toContain("## Category summaries");
    expect(markdown).toContain("## Pilot and P1");
    expect(markdown).toContain("## Protected controls");
    expect(markdown).toContain("## Missing evidence");
    expect(markdown).toContain("## Merge and noindex-candidate review queue");
    expect(markdown).toContain("https://www.u2tool.com/en/tools/merge-me/");
    expect(markdown).toContain("https://www.u2tool.com/ar/tools/zero/");
    expect(markdown).toContain("separate implementation plan");
  });

  it("runs the executable CLI against temporary evidence inputs and writes all three report files", async () => {
    const temporaryRoot = await mkdtemp(
      path.join(tmpdir(), "tool-index-readiness-"),
    );
    const currentPagesCsv = path.join(temporaryRoot, "pages-current.csv");
    const historicalPagesCsv = path.join(temporaryRoot, "pages-previous.csv");
    const currentQueriesCsv = path.join(temporaryRoot, "queries.csv");
    const renderedContractsJson = path.join(
      temporaryRoot,
      "rendered-contracts.json",
    );
    const outputDir = path.join(temporaryRoot, "output");
    const pageHeader = "Top pages,Clicks,Impressions,Position";
    const pageUrl = "https://www.u2tool.com/en/tools/grammar-checker/";

    try {
      await Promise.all([
        writeFile(currentPagesCsv, `${pageHeader}\n${pageUrl},1,10,12\n`),
        writeFile(historicalPagesCsv, `${pageHeader}\n${pageUrl},0,5,20\n`),
        writeFile(
          currentQueriesCsv,
          'Top queries,Clicks,Impressions,Position\n"grammar checker, online",1,10,12\n',
        ),
        writeFile(
          renderedContractsJson,
          JSON.stringify({
            results: [
              {
                locale: "en",
                slug: "grammar-checker",
                status: 200,
                canonicalSelfReferences: true,
                hreflangPasses: true,
              },
            ],
          }),
        ),
      ]);

      const result = spawnSync(
        process.execPath,
        [
          "--import",
          "tsx/esm",
          "scripts/seo/tool-index-readiness-report.ts",
          "--checkpoint-date",
          "2026-07-13",
          "--current-pages-csv",
          currentPagesCsv,
          "--historical-pages-csv",
          historicalPagesCsv,
          "--current-queries-csv",
          currentQueriesCsv,
          "--rendered-contracts-json",
          renderedContractsJson,
          "--output-dir",
          outputDir,
        ],
        {
          cwd: process.cwd(),
          encoding: "utf8",
          timeout: 60_000,
        },
      );

      expect(result.status, result.stderr).toBe(0);
      const [json, csv, markdown] = await Promise.all([
        readFile(
          path.join(outputDir, "tool-index-readiness-report.json"),
          "utf8",
        ),
        readFile(
          path.join(outputDir, "tool-index-readiness-report.csv"),
          "utf8",
        ),
        readFile(
          path.join(outputDir, "tool-index-readiness-report.md"),
          "utf8",
        ),
      ]);
      expect(JSON.parse(json).notice).toBe(RECOMMENDATION_ONLY_NOTICE);
      expect(csv.startsWith(`${RECOMMENDATION_ONLY_NOTICE}\n`)).toBe(true);
      expect(markdown.startsWith(`${RECOMMENDATION_ONLY_NOTICE}\n`)).toBe(true);
    } finally {
      await rm(temporaryRoot, { recursive: true, force: true });
    }
  }, 70_000);
});
