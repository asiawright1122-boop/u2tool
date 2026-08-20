import { describe, expect, it } from "vitest";
import {
  mkdtemp,
  readFile,
  readdir,
  rename,
  rm,
  writeFile,
} from "node:fs/promises";
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import path from "node:path";
import { tmpdir } from "node:os";

import {
  assembleToolIndexReadinessInputs,
  buildToolIndexReadinessReport,
  normalizeToolPageUrl,
  parseGscPageRows,
  parseGscPageRowsForPeriod,
  parseGscQueryRows,
  parseToolIndexReadinessArgs,
  RECOMMENDATION_ONLY_NOTICE,
  renderToolIndexReadinessCsv,
  renderToolIndexReadinessJson,
  renderToolIndexReadinessMarkdown,
  writeToolIndexReadinessArtifacts,
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

function renderedProducerResult(
  locale: string,
  slug: string,
  overrides: Record<string, unknown> = {},
): Record<string, unknown> {
  return {
    locale,
    slug,
    path: `/${locale}/tools/${slug}/`,
    status: 200,
    failures: [],
    contract: {
      status: 200,
      title: "Tool title",
      description: "Tool description",
      canonical: `https://www.u2tool.com/${locale}/tools/${slug}/`,
      h1: "Tool heading",
      jsonLdTypes: [],
      toolClusters: [],
      toolClusterGroups: [],
      siblingToolHrefs: [],
      faqQuestionCount: 0,
      bodyTextSentinels: [],
      capabilityDisclosureCount: 0,
      grammarLanguageNoticeCount: 0,
    },
    ...overrides,
  };
}

function renderedProducerReport(
  results: readonly Record<string, unknown>[] = [],
): Record<string, unknown> {
  const failed = results.filter((result) => {
    const failures = result.failures;
    return (
      result.error !== undefined ||
      (Array.isArray(failures) && failures.length > 0)
    );
  }).length;
  return {
    generatedAt: "2026-07-13T00:00:00.000Z",
    baseUrl: "http://127.0.0.1:4321",
    summary: {
      total: results.length,
      passed: results.length - failed,
      failed,
    },
    results,
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

  it.each([
    [
      "unknown flag",
      ["--checkpoint-date", "2026-07-13", "--current-page-csv", "typo.csv"],
      /unknown.*--current-page-csv/iu,
    ],
    [
      "duplicate flag",
      ["--checkpoint-date", "2026-07-13", "--checkpoint-date", "2026-07-14"],
      /duplicate.*--checkpoint-date/iu,
    ],
    [
      "missing value",
      ["--checkpoint-date"],
      /missing value.*--checkpoint-date/iu,
    ],
    [
      "non-calendar checkpoint",
      ["--checkpoint-date", "2026-02-30"],
      /valid YYYY-MM-DD calendar date/iu,
    ],
  ])("rejects strict CLI args with %s", (_caseName, args, error) => {
    expect(() => parseToolIndexReadinessArgs(args)).toThrow(error);
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

  it("parses real English Last 3 months and Previous 3 months wide headers", () => {
    const englishWideCsv = [
      "Top pages,Last 3 months Clicks,Previous 3 months Clicks,Last 3 months Impressions,Previous 3 months Impressions,Last 3 months Position,Previous 3 months Position",
      "https://www.u2tool.com/en/tools/grammar-checker/,7,3,140,90,14.5,20.25",
    ].join("\n");

    expect(
      parseGscPageRowsForPeriod(englishWideCsv, "current")[0],
    ).toMatchObject({
      clicks: 7,
      impressions: 140,
      position: 14.5,
    });
    expect(
      parseGscPageRowsForPeriod(englishWideCsv, "historical")[0],
    ).toMatchObject({
      clicks: 3,
      impressions: 90,
      position: 20.25,
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

  it.each([
    ["negative clicks", "-1,10,1", /clicks.*non-negative integer/iu],
    [
      "fractional impressions",
      "1,10.5,1",
      /impressions.*non-negative integer/iu,
    ],
    ["negative position", "1,10,-0.1", /position.*non-negative/iu],
  ])("rejects GSC page rows with %s", (_caseName, metrics, error) => {
    expect(() =>
      parseGscPageRows(
        [
          "Top pages,Clicks,Impressions,Position",
          `https://www.u2tool.com/en/tools/grammar-checker/,${metrics}`,
        ].join("\n"),
      ),
    ).toThrow(error);
  });

  it("accepts GSC position zero as a no-data export value", () => {
    expect(
      parseGscQueryRows(
        ["Top queries,Clicks,Impressions,Position", "query,0,0,0"].join("\n"),
      )[0],
    ).toMatchObject({ clicks: 0, impressions: 0, position: 0 });
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

  it("preserves a known canonical failure when historical GSC evidence is missing", () => {
    const report = buildToolIndexReadinessReport({
      checkpointDate: "2026-07-13",
      queryEvidence: {
        scope: "property-query-only",
        rowCount: 0,
        urlJoinAvailable: false,
      },
      rows: [
        {
          url: "https://www.u2tool.com/en/tools/grammar-checker/",
          category: "text",
          evidence: evidence({
            technical: {
              routeExists: true,
              inSitemap: true,
              canonicalSelfReferences: false,
              hreflangPasses: true,
              renderedStatus: 200,
            },
          }),
          demandCoverage: {
            currentPageRow: true,
            historicalPageRow: false,
          },
          overrideReasons: [],
        },
      ],
    });
    const json = renderToolIndexReadinessJson(report);
    const csv = renderToolIndexReadinessCsv(report);
    const markdown = renderToolIndexReadinessMarkdown(report);

    expect(report.rows[0].decision).toMatchObject({
      recommendation: "manual-review",
      reasons: expect.arrayContaining([
        "technical-canonical-failed",
        "gsc-historical-page-row-missing",
      ]),
      missingEvidence: ["demand.historicalPageRow"],
    });
    for (const output of [json, csv, markdown]) {
      expect(output).toContain("technical-canonical-failed");
      expect(output).toContain("demand.historicalPageRow");
    }
  });

  it("preserves independent technical, capability, content, and overlap facts across source gaps", () => {
    const report = buildToolIndexReadinessReport({
      checkpointDate: "2026-07-13",
      queryEvidence: {
        scope: "property-query-only",
        rowCount: 0,
        urlJoinAvailable: false,
      },
      rows: [
        {
          url: "https://www.u2tool.com/en/tools/weak-overlap/",
          category: "text",
          evidence: evidence({
            slug: "weak-overlap",
            localEngineSupportsLocale: false,
            capabilityClaimIssues: ["claim-drift"],
            content: {
              hasIndependentSplitCopy: false,
              detailedDescriptionLength: 0,
              usageStepCount: 0,
              usageExampleCount: 0,
              faqCount: 0,
              duplicateContentKey: "duplicate",
              fallbackUsed: true,
            },
            technical: {
              routeExists: false,
              inSitemap: false,
              canonicalSelfReferences: null,
              hreflangPasses: false,
              renderedStatus: 500,
            },
            overlap: {
              strongerSiblingSlug: "stronger",
              samePrimaryIntent: true,
            },
          }),
          demandCoverage: {
            currentPageRow: true,
            historicalPageRow: false,
          },
          overrideReasons: [],
        },
      ],
    });

    expect(report.rows[0].decision.reasons).toEqual(
      expect.arrayContaining([
        "technical-route-missing",
        "technical-sitemap-missing",
        "technical-hreflang-failed",
        "technical-rendered-status-failed",
        "capability-claim-issue",
        "locale-engine-unsupported",
        "independent-split-copy-missing",
        "content-detailed-description-thin",
        "content-usage-steps-thin",
        "content-usage-examples-thin",
        "content-faqs-thin",
        "duplicate-content-detected",
        "fallback-content-used",
        "stronger-sibling-overlap",
      ]),
    );
    expect(report.rows[0].decision.reasons).not.toContain("zero-demand");
  });

  it("preserves the P1 capability-profile gate when technical evidence is missing", () => {
    const report = buildToolIndexReadinessReport({
      checkpointDate: "2026-07-13",
      queryEvidence: {
        scope: "property-query-only",
        rowCount: 0,
        urlJoinAvailable: false,
      },
      rows: [
        {
          url: "https://www.u2tool.com/en/tools/unprofiled-p1/",
          category: "text",
          evidence: evidence({
            slug: "unprofiled-p1",
            priority: "p1",
            hasCapabilityProfile: false,
            capabilityEnforcement: "unprofiled",
            technical: {
              routeExists: true,
              inSitemap: true,
              canonicalSelfReferences: null,
              hreflangPasses: null,
              renderedStatus: null,
            },
          }),
          demandCoverage: {
            currentPageRow: true,
            historicalPageRow: true,
          },
          overrideReasons: [],
        },
      ],
    });
    const outputs = [
      renderToolIndexReadinessJson(report),
      renderToolIndexReadinessCsv(report),
      renderToolIndexReadinessMarkdown(report),
    ];

    expect(report.rows[0].decision).toMatchObject({
      recommendation: "manual-review",
      reasons: expect.arrayContaining(["capability-profile-missing"]),
      missingEvidence: expect.arrayContaining(["hasCapabilityProfile"]),
      reviewRequired: true,
    });
    for (const output of outputs) {
      expect(output).toContain("capability-profile-missing");
      expect(output).toContain("hasCapabilityProfile");
    }
  });

  it("preserves the P1 capability-enforcement gate when technical evidence is missing", () => {
    const report = buildToolIndexReadinessReport({
      checkpointDate: "2026-07-13",
      queryEvidence: {
        scope: "property-query-only",
        rowCount: 0,
        urlJoinAvailable: false,
      },
      rows: [
        {
          url: "https://www.u2tool.com/en/tools/inventory-p1/",
          category: "text",
          evidence: evidence({
            slug: "inventory-p1",
            priority: "p1",
            hasCapabilityProfile: true,
            capabilityEnforcement: "inventory",
            technical: {
              routeExists: true,
              inSitemap: true,
              canonicalSelfReferences: null,
              hreflangPasses: null,
              renderedStatus: null,
            },
          }),
          demandCoverage: {
            currentPageRow: true,
            historicalPageRow: true,
          },
          overrideReasons: [],
        },
      ],
    });
    const outputs = [
      renderToolIndexReadinessJson(report),
      renderToolIndexReadinessCsv(report),
      renderToolIndexReadinessMarkdown(report),
    ];

    expect(report.rows[0].decision).toMatchObject({
      recommendation: "manual-review",
      reasons: expect.arrayContaining([
        "capability-enforcement-not-release-blocking",
      ]),
      missingEvidence: expect.arrayContaining(["capabilityEnforcement"]),
      reviewRequired: true,
    });
    for (const output of outputs) {
      expect(output).toContain("capability-enforcement-not-release-blocking");
      expect(output).toContain("capabilityEnforcement");
    }
  });

  it("serializes missing GSC period metrics as null in JSON and empty CSV cells", async () => {
    const input = await assembleToolIndexReadinessInputs({
      checkpointDate: "2026-07-13",
      currentPages: [],
      historicalPages: [],
      currentQueries: [],
      renderedContracts: renderedProducerReport(),
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
      renderedContracts: renderedProducerReport(),
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
        splitMessageObserved: true,
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

  it.each([
    "https://example.com/en/tools/grammar-checker/",
    "https://user:secret@www.u2tool.com/en/tools/grammar-checker/",
    "https://www.u2tool.com:8443/en/tools/grammar-checker/",
    "https://preview.u2tool.com/en/tools/grammar-checker/",
  ])("rejects non-property GSC URL %s", (url) => {
    expect(normalizeToolPageUrl(url)).toBeNull();
  });

  it("carries locale capability validator issues into the assembled evidence", async () => {
    const input = await assembleToolIndexReadinessInputs({
      checkpointDate: "2026-07-13",
      currentPages: [],
      historicalPages: [],
      currentQueries: [],
      renderedContracts: renderedProducerReport(),
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

  it("marks English support fields inherited into a partial locale split as fallback", async () => {
    const input = await assembleToolIndexReadinessInputs({
      checkpointDate: "2026-07-13",
      currentPages: [],
      historicalPages: [],
      currentQueries: [],
      renderedContracts: renderedProducerReport(),
      toolCatalog: [
        {
          slug: "api-tester",
          category: "development",
          icon: "api",
          component: "ApiTester",
        },
      ],
      localeCatalog: ["es"],
    });

    expect(input.rows[0].evidence.content).toMatchObject({
      hasIndependentSplitCopy: true,
      faqCount: 4,
      fallbackUsed: true,
    });
    expect(input.rows[0].sourceEvidence).toMatchObject({
      localeFallbackFields: ["faqs"],
    });
  });

  it("keeps unprofiled locale support as missing evidence instead of inferring unsupported", async () => {
    const slug = "unprofiled-tool";
    const url = `https://www.u2tool.com/en/tools/${slug}/`;
    const input = await assembleToolIndexReadinessInputs({
      checkpointDate: "2026-07-13",
      currentPages: [{ url, clicks: 0, impressions: 0, position: 0 }],
      historicalPages: [{ url, clicks: 0, impressions: 0, position: 0 }],
      currentQueries: [],
      renderedContracts: renderedProducerReport([
        renderedProducerResult("en", slug),
      ]),
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
      reviewRequired: true,
    });
    expect(report.rows[0].decision.missingEvidence).toContain(
      "localEngineSupportsLocale",
    );
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
      renderedContracts: renderedProducerReport(),
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

  it("does not collide support hashes when leaf strings match but structure differs", async () => {
    const input = await assembleToolIndexReadinessInputs({
      checkpointDate: "2026-07-13",
      currentPages: [],
      historicalPages: [],
      currentQueries: [],
      renderedContracts: renderedProducerReport(),
      toolCatalog: [
        {
          slug: "structured-a",
          category: "text",
          icon: "a",
          component: "StructuredA",
        },
        {
          slug: "structured-b",
          category: "text",
          icon: "b",
          component: "StructuredB",
        },
      ],
      localeCatalog: ["en"],
      loadMessages: async (_locale, slug) => ({
        detailed_description: "Same description",
        usage_steps: ["Same step"],
        usage_examples: ["Same example"],
        faqs:
          slug === "structured-a"
            ? [{ question: "Same question", answer: "Same answer" }]
            : [{ prompt: "Same question", response: "Same answer" }],
      }),
      hasIndependentSplitCopy: async () => true,
    });

    expect(
      input.rows.map(
        ({ evidence: rowEvidence }) => rowEvidence.content.duplicateContentKey,
      ),
    ).toEqual([null, null]);
  });

  it("counts only non-empty steps and examples and complete FAQ entries", async () => {
    const input = await assembleToolIndexReadinessInputs({
      checkpointDate: "2026-07-13",
      currentPages: [],
      historicalPages: [],
      currentQueries: [],
      renderedContracts: renderedProducerReport(),
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

  it("rejects duplicate locale and slug pairs in the override registry", async () => {
    const duplicateOverride = {
      locale: "es",
      slug: "grammar-checker",
      protectedControl: true,
      reason: "Temporary protected control",
      expiresOn: "2026-08-24",
    };

    await expect(
      assembleToolIndexReadinessInputs({
        checkpointDate: "2026-07-13",
        currentPages: [],
        historicalPages: [],
        currentQueries: [],
        renderedContracts: renderedProducerReport(),
        toolCatalog: [],
        localeCatalog: [],
        overrides: [duplicateOverride, duplicateOverride],
      } as Parameters<typeof assembleToolIndexReadinessInputs>[0]),
    ).rejects.toThrow(/duplicate.*es\/grammar-checker/iu);
  });

  it.each([
    [
      "blank reason",
      {
        locale: "es",
        slug: "grammar-checker",
        reason: "   ",
      },
      /reason/iu,
    ],
    [
      "missing reason",
      {
        locale: "es",
        slug: "grammar-checker",
      },
      /reason/iu,
    ],
    [
      "stronger sibling without confirmed matching intent",
      {
        locale: "es",
        slug: "grammar-checker",
        reason: "Possible overlap",
        strongerSiblingSlug: "spell-checker",
        samePrimaryIntent: false,
      },
      /samePrimaryIntent.*true/iu,
    ],
    [
      "invalid expiry date",
      {
        locale: "es",
        slug: "grammar-checker",
        reason: "Temporary control",
        expiresOn: "2026-02-30",
      },
      /expiresOn.*valid.*YYYY-MM-DD/iu,
    ],
  ])("rejects an override with %s", async (_caseName, override, error) => {
    await expect(
      assembleToolIndexReadinessInputs({
        checkpointDate: "2026-07-13",
        currentPages: [],
        historicalPages: [],
        currentQueries: [],
        renderedContracts: renderedProducerReport(),
        toolCatalog: [],
        localeCatalog: [],
        overrides: [override],
      } as Parameters<typeof assembleToolIndexReadinessInputs>[0]),
    ).rejects.toThrow(error);
  });

  it("rejects the real Spanish controls after their 2026-08-24 expiry", async () => {
    await expect(
      assembleToolIndexReadinessInputs({
        checkpointDate: "2026-09-01",
        currentPages: [],
        historicalPages: [],
        currentQueries: [],
        renderedContracts: renderedProducerReport(),
        toolCatalog: [],
        localeCatalog: [],
      }),
    ).rejects.toThrow(/expired.*2026-08-24.*2026-09-01/iu);
  });

  it("keeps all five real Spanish controls protected and manual during their validity window", async () => {
    const protectedSlugs = [
      "timeline-chart-generator",
      "graph-chart-generator",
      "sankey-chart-generator",
      "gantt-chart-generator",
      "tree-chart-generator",
    ];
    const input = await assembleToolIndexReadinessInputs({
      checkpointDate: "2026-07-13",
      currentPages: [],
      historicalPages: [],
      currentQueries: [],
      renderedContracts: renderedProducerReport(),
      toolCatalog: protectedSlugs.map((slug) => ({
        slug,
        category: "charts",
        icon: "chart",
        component: "ChartGenerator",
      })),
      localeCatalog: ["es"],
      loadMessages: async () => ({}),
      hasIndependentSplitCopy: async () => true,
    });
    const report = buildToolIndexReadinessReport(input);

    expect(input.rows.map((row) => row.evidence.slug).sort()).toEqual(
      protectedSlugs.sort(),
    );
    expect(input.rows.every((row) => row.evidence.protectedControl)).toBe(true);
    expect(
      report.rows.every(
        (row) =>
          row.decision.recommendation === "manual-review" &&
          row.decision.reasons.includes("protected-control"),
      ),
    ).toBe(true);
  });

  it("rejects duplicate locale and slug pairs from rendered producer evidence", async () => {
    const duplicate = renderedProducerResult("en", "grammar-checker");

    await expect(
      assembleToolIndexReadinessInputs({
        checkpointDate: "2026-07-13",
        currentPages: [],
        historicalPages: [],
        currentQueries: [],
        renderedContracts: renderedProducerReport([duplicate, duplicate]),
        toolCatalog: [],
        localeCatalog: [],
      }),
    ).rejects.toThrow(/duplicate rendered.*en\/grammar-checker/iu);
  });

  it("rejects rendered evidence that does not match the real producer report schema", async () => {
    await expect(
      assembleToolIndexReadinessInputs({
        checkpointDate: "2026-07-13",
        currentPages: [],
        historicalPages: [],
        currentQueries: [],
        renderedContracts: { results: [] },
        toolCatalog: [],
        localeCatalog: [],
      }),
    ).rejects.toThrow(/rendered.*producer.*schema/iu);
  });

  it("keeps hreflang null for an 18/18 passing real rendered-producer schema", async () => {
    const url = "https://www.u2tool.com/es/tools/timeline-chart-generator/";
    const renderedRows = [
      renderedProducerResult("es", "timeline-chart-generator"),
      ...Array.from({ length: 17 }, (_, index) =>
        renderedProducerResult("en", `producer-fixture-${index}`),
      ),
    ];
    const input = await assembleToolIndexReadinessInputs({
      checkpointDate: "2026-07-13",
      currentPages: [{ url, clicks: 0, impressions: 146, position: 81.09 }],
      historicalPages: [{ url, clicks: 0, impressions: 20, position: 78.4 }],
      currentQueries: [],
      renderedContracts: renderedProducerReport(renderedRows),
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
          hreflangPasses: null,
          renderedStatus: 200,
        },
      },
    });
  });

  it("rejects a foreign rendered canonical even when a non-producer boolean claims true", async () => {
    const renderedRow = renderedProducerResult("en", "grammar-checker");
    renderedRow.canonicalSelfReferences = true;
    renderedRow.hreflangPasses = true;
    renderedRow.contract = {
      ...(renderedRow.contract as Record<string, unknown>),
      canonical: "https://example.com/en/tools/grammar-checker/",
    };
    const input = await assembleToolIndexReadinessInputs({
      checkpointDate: "2026-07-13",
      currentPages: [],
      historicalPages: [],
      currentQueries: [],
      renderedContracts: renderedProducerReport([renderedRow]),
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
    expect(input.rows[0].evidence.technical.hreflangPasses).toBeNull();
  });

  it("assembles every one of the 5,700 repository tool-locale pairs without treating absent rendered evidence as passing", async () => {
    const input = await assembleToolIndexReadinessInputs({
      checkpointDate: "2026-07-13",
      currentPages: [],
      historicalPages: [],
      currentQueries: [],
      renderedContracts: renderedProducerReport(),
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
    // Priority counts follow getPriorityTools()/PILOT_TOOL_SLUGS at the time
    // the report runs: 6 pilot tools × 10 locales = 60 and 148 p1 tools × 10
    // locales = 1480. Keep in sync when the priority or pilot registry grows.
    expect(
      input.rows.filter(
        ({ evidence: rowEvidence }) => rowEvidence.priority === "pilot",
      ),
    ).toHaveLength(60);
    expect(
      input.rows.filter(
        ({ evidence: rowEvidence }) => rowEvidence.priority === "p1",
      ),
    ).toHaveLength(1_480);
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
    // protectedControl cohorts: 5 ES chart tools (es) + jwt-debugger across
    // all 10 locales. Keep in sync with index-readiness-overrides.ts.
    expect(
      input.rows.filter(
        ({ evidence: rowEvidence }) => rowEvidence.protectedControl,
      ),
    ).toHaveLength(15);
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

  it("keeps an existing artifact set intact when a sibling temp write fails", async () => {
    const temporaryRoot = await mkdtemp(
      path.join(tmpdir(), "tool-index-artifacts-"),
    );
    const finalPaths = {
      json: path.join(temporaryRoot, "tool-index-readiness.json"),
      csv: path.join(temporaryRoot, "tool-index-readiness.csv"),
      markdown: path.join(temporaryRoot, "tool-index-readiness.md"),
    };
    const previous = {
      json: "previous-json\n",
      csv: "previous-csv\n",
      markdown: "previous-markdown\n",
    };
    const report = buildToolIndexReadinessReport({
      checkpointDate: "2026-07-13",
      queryEvidence: {
        scope: "property-query-only",
        rowCount: 0,
        urlJoinAvailable: false,
      },
      rows: [
        {
          url: "https://www.u2tool.com/en/tools/grammar-checker/",
          category: "text",
          evidence: evidence(),
          demandCoverage: {
            currentPageRow: true,
            historicalPageRow: true,
          },
          overrideReasons: [],
        },
      ],
    });

    try {
      await Promise.all([
        writeFile(finalPaths.json, previous.json),
        writeFile(finalPaths.csv, previous.csv),
        writeFile(finalPaths.markdown, previous.markdown),
      ]);

      await expect(
        writeToolIndexReadinessArtifacts(report, temporaryRoot, {
          writeFile: async (filePath, content) => {
            if (
              filePath.includes("tool-index-readiness.csv.") &&
              filePath.endsWith(".tmp")
            ) {
              throw new Error("injected temp write failure");
            }
            await writeFile(filePath, content, "utf8");
          },
        }),
      ).rejects.toThrow("injected temp write failure");

      await expect(
        Promise.all([
          readFile(finalPaths.json, "utf8"),
          readFile(finalPaths.csv, "utf8"),
          readFile(finalPaths.markdown, "utf8"),
        ]),
      ).resolves.toEqual([previous.json, previous.csv, previous.markdown]);
      expect((await readdir(temporaryRoot)).sort()).toEqual(
        Object.values(finalPaths)
          .map((filePath) => path.basename(filePath))
          .sort(),
      );
    } finally {
      await rm(temporaryRoot, { recursive: true, force: true });
    }
  });

  it("preserves a recoverable backup and surfaces publication plus rollback errors", async () => {
    const temporaryRoot = await mkdtemp(
      path.join(tmpdir(), "tool-index-artifact-rollback-"),
    );
    const finalPaths = {
      json: path.join(temporaryRoot, "tool-index-readiness.json"),
      csv: path.join(temporaryRoot, "tool-index-readiness.csv"),
      markdown: path.join(temporaryRoot, "tool-index-readiness.md"),
    };
    const previous = {
      json: "previous-json\n",
      csv: "previous-csv\n",
      markdown: "previous-markdown\n",
    };
    const publicationError = new Error("injected CSV publication failure");
    const rollbackError = new Error("injected JSON backup restore failure");
    const report = buildToolIndexReadinessReport({
      checkpointDate: "2026-07-13",
      queryEvidence: {
        scope: "property-query-only",
        rowCount: 0,
        urlJoinAvailable: false,
      },
      rows: [
        {
          url: "https://www.u2tool.com/en/tools/grammar-checker/",
          category: "text",
          evidence: evidence(),
          demandCoverage: {
            currentPageRow: true,
            historicalPageRow: true,
          },
          overrideReasons: [],
        },
      ],
    });

    try {
      await Promise.all([
        writeFile(finalPaths.json, previous.json),
        writeFile(finalPaths.csv, previous.csv),
        writeFile(finalPaths.markdown, previous.markdown),
      ]);

      let caught: unknown;
      try {
        await writeToolIndexReadinessArtifacts(report, temporaryRoot, {
          rename: async (source, destination) => {
            if (source.endsWith(".tmp") && destination === finalPaths.csv) {
              throw publicationError;
            }
            if (source.endsWith(".backup") && destination === finalPaths.json) {
              throw rollbackError;
            }
            await rename(source, destination);
          },
        });
      } catch (error) {
        caught = error;
      }

      expect(caught).toBeInstanceOf(AggregateError);
      expect((caught as AggregateError).errors).toEqual([
        publicationError,
        rollbackError,
      ]);
      await expect(readFile(finalPaths.json, "utf8")).rejects.toThrow(
        /ENOENT/u,
      );
      await expect(
        Promise.all([
          readFile(finalPaths.csv, "utf8"),
          readFile(finalPaths.markdown, "utf8"),
        ]),
      ).resolves.toEqual([previous.csv, previous.markdown]);

      const remainingFiles = (await readdir(temporaryRoot)).sort();
      const backups = remainingFiles.filter((fileName) =>
        fileName.endsWith(".backup"),
      );
      expect(remainingFiles.some((fileName) => fileName.endsWith(".tmp"))).toBe(
        false,
      );
      expect(backups).toHaveLength(1);
      expect(backups[0]).toMatch(/^tool-index-readiness\.json\..+\.backup$/u);
      await expect(
        readFile(path.join(temporaryRoot, backups[0]), "utf8"),
      ).resolves.toBe(previous.json);
    } finally {
      await rm(temporaryRoot, { recursive: true, force: true });
    }
  });

  it("preserves unpublished temps when first publication rollback cannot remove a new final", async () => {
    const temporaryRoot = await mkdtemp(
      path.join(tmpdir(), "tool-index-artifact-first-publication-rollback-"),
    );
    const finalPaths = {
      json: path.join(temporaryRoot, "tool-index-readiness.json"),
      csv: path.join(temporaryRoot, "tool-index-readiness.csv"),
      markdown: path.join(temporaryRoot, "tool-index-readiness.md"),
    };
    const publicationError = new Error("injected CSV publication failure");
    const rollbackError = new Error("injected JSON rollback remove failure");
    const report = buildToolIndexReadinessReport({
      checkpointDate: "2026-07-13",
      queryEvidence: {
        scope: "property-query-only",
        rowCount: 0,
        urlJoinAvailable: false,
      },
      rows: [
        {
          url: "https://www.u2tool.com/en/tools/grammar-checker/",
          category: "text",
          evidence: evidence(),
          demandCoverage: {
            currentPageRow: true,
            historicalPageRow: true,
          },
          overrideReasons: [],
        },
      ],
    });

    try {
      let caught: unknown;
      try {
        await writeToolIndexReadinessArtifacts(report, temporaryRoot, {
          rename: async (source, destination) => {
            if (source.endsWith(".tmp") && destination === finalPaths.csv) {
              throw publicationError;
            }
            await rename(source, destination);
          },
          remove: async (filePath) => {
            if (filePath === finalPaths.json) {
              throw rollbackError;
            }
            await rm(filePath, { force: true });
          },
        });
      } catch (error) {
        caught = error;
      }

      expect(caught).toBeInstanceOf(AggregateError);
      expect((caught as AggregateError).errors).toEqual([
        publicationError,
        rollbackError,
      ]);
      await expect(readFile(finalPaths.json, "utf8")).resolves.toBe(
        renderToolIndexReadinessJson(report),
      );

      const remainingFiles = (await readdir(temporaryRoot)).sort();
      const recoveryTemps = remainingFiles.filter((fileName) =>
        fileName.endsWith(".tmp"),
      );
      expect(recoveryTemps).toHaveLength(2);
      expect(recoveryTemps).toEqual([
        expect.stringMatching(/^tool-index-readiness\.csv\..+\.tmp$/u),
        expect.stringMatching(/^tool-index-readiness\.md\..+\.tmp$/u),
      ]);
      await expect(
        Promise.all(
          recoveryTemps.map((fileName) =>
            readFile(path.join(temporaryRoot, fileName), "utf8"),
          ),
        ),
      ).resolves.toEqual([
        renderToolIndexReadinessCsv(report),
        renderToolIndexReadinessMarkdown(report),
      ]);
    } finally {
      await rm(temporaryRoot, { recursive: true, force: true });
    }
  });

  it("preserves a complete new-generation recovery set after mixed third-publication rollback", async () => {
    const temporaryRoot = await mkdtemp(
      path.join(tmpdir(), "tool-index-artifact-third-publication-rollback-"),
    );
    const finalPaths = {
      json: path.join(temporaryRoot, "tool-index-readiness.json"),
      csv: path.join(temporaryRoot, "tool-index-readiness.csv"),
      markdown: path.join(temporaryRoot, "tool-index-readiness.md"),
    };
    const publicationError = new Error("injected Markdown publication failure");
    const rollbackError = new Error("injected JSON rollback remove failure");
    const report = buildToolIndexReadinessReport({
      checkpointDate: "2026-07-13",
      queryEvidence: {
        scope: "property-query-only",
        rowCount: 0,
        urlJoinAvailable: false,
      },
      rows: [
        {
          url: "https://www.u2tool.com/en/tools/grammar-checker/",
          category: "text",
          evidence: evidence(),
          demandCoverage: {
            currentPageRow: true,
            historicalPageRow: true,
          },
          overrideReasons: [],
        },
      ],
    });

    try {
      let caught: unknown;
      try {
        await writeToolIndexReadinessArtifacts(report, temporaryRoot, {
          rename: async (source, destination) => {
            if (
              source.endsWith(".tmp") &&
              destination === finalPaths.markdown
            ) {
              throw publicationError;
            }
            await rename(source, destination);
          },
          remove: async (filePath) => {
            if (filePath === finalPaths.json) {
              throw rollbackError;
            }
            await rm(filePath, { force: true });
          },
        });
      } catch (error) {
        caught = error;
      }

      expect(caught).toBeInstanceOf(AggregateError);
      expect((caught as AggregateError).errors).toEqual([
        publicationError,
        rollbackError,
      ]);
      const remainingFiles = (await readdir(temporaryRoot)).sort();
      const recoveryFiles = remainingFiles.filter((fileName) =>
        fileName.endsWith(".recovery"),
      );
      expect(recoveryFiles).toHaveLength(3);
      expect(recoveryFiles).toEqual([
        expect.stringMatching(/^tool-index-readiness\.csv\..+\.recovery$/u),
        expect.stringMatching(/^tool-index-readiness\.json\..+\.recovery$/u),
        expect.stringMatching(/^tool-index-readiness\.md\..+\.recovery$/u),
      ]);
      await expect(
        Promise.all(
          recoveryFiles.map((fileName) =>
            readFile(path.join(temporaryRoot, fileName), "utf8"),
          ),
        ),
      ).resolves.toEqual([
        renderToolIndexReadinessCsv(report),
        renderToolIndexReadinessJson(report),
        renderToolIndexReadinessMarkdown(report),
      ]);
      for (const recoveryFile of recoveryFiles) {
        expect((caught as AggregateError).message).toContain(
          path.join(temporaryRoot, recoveryFile),
        );
      }
      expect((caught as AggregateError).message).toContain(
        publicationError.message,
      );
      expect((caught as AggregateError).message).toContain(
        rollbackError.message,
      );
      await expect(readFile(finalPaths.json, "utf8")).resolves.toBe(
        renderToolIndexReadinessJson(report),
      );
      await expect(readFile(finalPaths.csv, "utf8")).rejects.toThrow(/ENOENT/u);
    } finally {
      await rm(temporaryRoot, { recursive: true, force: true });
    }
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
    const pageHeader =
      "Top pages,Last 3 months Clicks,Previous 3 months Clicks,Last 3 months Impressions,Previous 3 months Impressions,Last 3 months Position,Previous 3 months Position";
    const pageUrl = "https://www.u2tool.com/en/tools/grammar-checker/";
    const currentPagesBytes = `\uFEFF${pageHeader}\r\n${pageUrl},1,0,10,5,12,20\r\n`;
    const historicalPagesBytes = `${pageHeader}\n${pageUrl},1,0,10,5,12,20\n`;
    const currentQueriesBytes =
      'Top queries,Clicks,Impressions,Position\n"grammar checker, online",1,10,12\n';
    const renderedContractsBytes = JSON.stringify(
      renderedProducerReport([renderedProducerResult("en", "grammar-checker")]),
    );
    const sha256 = (content: string) =>
      createHash("sha256").update(Buffer.from(content)).digest("hex");

    try {
      await Promise.all([
        writeFile(currentPagesCsv, currentPagesBytes),
        writeFile(historicalPagesCsv, historicalPagesBytes),
        writeFile(currentQueriesCsv, currentQueriesBytes),
        writeFile(renderedContractsJson, renderedContractsBytes),
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
        readFile(path.join(outputDir, "tool-index-readiness.json"), "utf8"),
        readFile(path.join(outputDir, "tool-index-readiness.csv"), "utf8"),
        readFile(path.join(outputDir, "tool-index-readiness.md"), "utf8"),
      ]);
      const parsedJson = JSON.parse(json) as Record<string, unknown>;
      expect(parsedJson.notice).toBe(RECOMMENDATION_ONLY_NOTICE);
      expect(parsedJson.inputProvenance).toEqual({
        currentPages: {
          path: currentPagesCsv,
          sha256: sha256(currentPagesBytes),
          selectedHeaders: {
            page: "Top pages",
            clicks: "Last 3 months Clicks",
            impressions: "Last 3 months Impressions",
            position: "Last 3 months Position",
          },
        },
        historicalPages: {
          path: historicalPagesCsv,
          sha256: sha256(historicalPagesBytes),
          selectedHeaders: {
            page: "Top pages",
            clicks: "Previous 3 months Clicks",
            impressions: "Previous 3 months Impressions",
            position: "Previous 3 months Position",
          },
        },
        currentQueries: {
          path: currentQueriesCsv,
          sha256: sha256(currentQueriesBytes),
          scope: "property-query-only",
          selectedHeaders: {
            query: "Top queries",
            clicks: "Clicks",
            impressions: "Impressions",
            position: "Position",
          },
        },
        renderedContracts: {
          path: renderedContractsJson,
          sha256: sha256(renderedContractsBytes),
        },
      });
      expect(csv.startsWith(`${RECOMMENDATION_ONLY_NOTICE}\n`)).toBe(true);
      expect(markdown.startsWith(`${RECOMMENDATION_ONLY_NOTICE}\n`)).toBe(true);
      expect(markdown).toContain("## Input provenance");
      for (const expected of [
        currentPagesCsv,
        historicalPagesCsv,
        currentQueriesCsv,
        renderedContractsJson,
        sha256(currentPagesBytes),
        "Last 3 months Clicks",
        "Previous 3 months Clicks",
        "property-query-only",
      ]) {
        expect(markdown).toContain(expected);
      }
    } finally {
      await rm(temporaryRoot, { recursive: true, force: true });
    }
  }, 70_000);
});
