import path from "node:path";
import { createHash, randomUUID } from "node:crypto";
import { existsSync } from "node:fs";
import {
  copyFile,
  mkdir,
  readFile,
  rename,
  rm,
  writeFile,
} from "node:fs/promises";
import { pathToFileURL } from "node:url";

import { tools as configuredTools, type Tool } from "../../src/config/tools";
import {
  getToolCapabilityProfile,
  PILOT_TOOL_SLUGS,
} from "../../src/config/tool-capabilities";
import {
  INDEX_READINESS_OVERRIDES,
  type IndexReadinessOverride,
} from "../../src/config/index-readiness-overrides";
import {
  evaluateToolIndexReadiness,
  type IndexReadinessDecision,
  type IndexReadinessEvidence,
} from "../../src/lib/tool-index-readiness";
import { locales as configuredLocales, type Locale } from "../../src/lib/i18n";
import { getPriorityTools } from "../../src/lib/seo-discovery";
import { buildToolsSitemapEntries } from "../../src/lib/sitemap-entry-builders";
import { assessToolCapabilityClaims } from "../../src/lib/tool-capability-claims";
import { loadToolPageMessages } from "../../src/lib/translations";
import { validateToolLocaleCapability } from "../validation/validate-tool-locale-capability";

export const RECOMMENDATION_ONLY_NOTICE =
  "RECOMMENDATIONS ONLY — THIS REPORT DOES NOT CHANGE INDEXATION";

export interface ToolIndexReadinessCliOptions {
  checkpointDate: string;
  currentPagesCsv: string;
  historicalPagesCsv: string;
  currentQueriesCsv: string;
  renderedContractsJson: string;
  outputDir: string;
}

export interface GscPageRow {
  url: string;
  clicks: number;
  impressions: number;
  position: number;
}

export interface GscQueryRow {
  query: string;
  clicks: number;
  impressions: number;
  position: number;
}

export interface ToolIndexReadinessInputProvenance {
  currentPages: {
    path: string;
    sha256: string;
    selectedHeaders: {
      page: string;
      clicks: string;
      impressions: string;
      position: string;
    };
  };
  historicalPages: {
    path: string;
    sha256: string;
    selectedHeaders: {
      page: string;
      clicks: string;
      impressions: string;
      position: string;
    };
  };
  currentQueries: {
    path: string;
    sha256: string;
    scope: "property-query-only";
    selectedHeaders: {
      query: string;
      clicks: string;
      impressions: string;
      position: string;
    };
  };
  renderedContracts: {
    path: string;
    sha256: string;
  };
}

export interface NormalizedReadinessRow {
  url: string;
  category: string;
  evidence: IndexReadinessEvidence;
  demandCoverage: {
    currentPageRow: boolean;
    historicalPageRow: boolean;
  };
  overrideReasons: string[];
  evidenceGaps?: string[];
  sourceEvidence?: {
    splitMessagePath: string;
    splitMessageObserved: boolean;
    contentHash: string;
    currentGsc: {
      url: string;
      observed: boolean;
      clicks: number | null;
      impressions: number | null;
      position: number | null;
    };
    historicalGsc: {
      url: string;
      observed: boolean;
      clicks: number | null;
      impressions: number | null;
      position: number | null;
    };
    renderedContractObserved: boolean;
    routeTemplatePath: string;
    sitemapPath: string;
    capabilityProfileVersion: string | null;
    localeFallbackFields: string[];
  };
}

export interface NormalizedReadinessInputs {
  checkpointDate: string;
  inputProvenance?: ToolIndexReadinessInputProvenance;
  queryEvidence: {
    scope: "property-query-only";
    rowCount: number;
    urlJoinAvailable: false;
  };
  rows: NormalizedReadinessRow[];
}

export interface ToolIndexReadinessReportRow extends Omit<
  NormalizedReadinessRow,
  "evidence"
> {
  evidence: Omit<IndexReadinessEvidence, "demand"> & {
    demand: {
      currentClicks: number | null;
      currentImpressions: number | null;
      historicalClicks: number | null;
      historicalImpressions: number | null;
      topQueryShare: number | null;
    };
  };
  decision: IndexReadinessDecision;
  implementationPlanRequired: boolean;
}

export interface ToolIndexReadinessReport {
  notice: typeof RECOMMENDATION_ONLY_NOTICE;
  checkpointDate: string;
  inputProvenance: ToolIndexReadinessInputProvenance | null;
  queryEvidence: NormalizedReadinessInputs["queryEvidence"];
  rows: ToolIndexReadinessReportRow[];
}

export interface ToolIndexReadinessAssemblyOptions {
  checkpointDate: string;
  currentPages: readonly GscPageRow[];
  historicalPages: readonly GscPageRow[];
  currentQueries: readonly GscQueryRow[];
  renderedContracts: unknown;
  inputProvenance?: ToolIndexReadinessInputProvenance;
  repositoryRoot?: string;
  toolCatalog?: readonly Tool[];
  localeCatalog?: readonly Locale[];
  loadMessages?: (
    locale: Locale,
    slug: string,
  ) => Promise<Record<string, unknown>>;
  loadLocaleSplitMessages?: (
    locale: Locale,
    slug: string,
  ) => Promise<Record<string, unknown> | null>;
  hasIndependentSplitCopy?: (
    locale: Locale,
    slug: string,
  ) => boolean | Promise<boolean>;
  overrides?: readonly IndexReadinessOverride[];
}

const RECOMMENDATION_ORDER = [
  "keep",
  "improve",
  "merge",
  "noindex-candidate",
  "manual-review",
] as const;
const PRIORITY_ORDER = ["pilot", "p1", "catalog"] as const;

function compareText(left: string, right: string): number {
  return left < right ? -1 : left > right ? 1 : 0;
}

function canonicalToolUrl(locale: string, slug: string): string {
  return `https://www.u2tool.com/${locale}/tools/${slug}/`;
}

function isCalendarDate(value: string): boolean {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/u.exec(value);
  if (!match) return false;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  if (year < 1 || month < 1 || month > 12 || day < 1) return false;
  const leapYear = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
  const daysInMonth = [
    31,
    leapYear ? 29 : 28,
    31,
    30,
    31,
    30,
    31,
    31,
    30,
    31,
    30,
    31,
  ];
  return day <= daysInMonth[month - 1];
}

function assertCalendarDate(value: string, label: string): void {
  if (!isCalendarDate(value)) {
    throw new Error(`${label} must be a valid YYYY-MM-DD calendar date`);
  }
}

function indexReadinessOverrides(
  overrides: readonly IndexReadinessOverride[],
  checkpointDate: string,
): Map<string, IndexReadinessOverride> {
  assertCalendarDate(checkpointDate, "checkpointDate");
  const byPair = new Map<string, IndexReadinessOverride>();
  for (const override of overrides) {
    if (
      typeof override.locale !== "string" ||
      !override.locale.trim() ||
      typeof override.slug !== "string" ||
      !override.slug.trim()
    ) {
      throw new Error("Index readiness override locale and slug are required");
    }
    if (typeof override.reason !== "string" || !override.reason.trim()) {
      throw new Error(
        `Index readiness override ${override.locale}/${override.slug} reason is required`,
      );
    }
    if (
      override.strongerSiblingSlug !== undefined &&
      override.samePrimaryIntent !== true
    ) {
      throw new Error(
        `Index readiness override ${override.locale}/${override.slug} with strongerSiblingSlug requires samePrimaryIntent:true`,
      );
    }
    if (override.expiresOn !== undefined) {
      if (
        typeof override.expiresOn !== "string" ||
        !isCalendarDate(override.expiresOn)
      ) {
        throw new Error(
          `Index readiness override ${override.locale}/${override.slug} expiresOn must be a valid YYYY-MM-DD calendar date`,
        );
      }
      if (checkpointDate > override.expiresOn) {
        throw new Error(
          `Index readiness override ${override.locale}/${override.slug} expired on ${override.expiresOn} before checkpoint ${checkpointDate}`,
        );
      }
    }
    const pair = `${override.locale}\0${override.slug}`;
    if (byPair.has(pair)) {
      throw new Error(
        `Index readiness override registry has duplicate ${override.locale}/${override.slug}`,
      );
    }
    byPair.set(pair, override);
  }
  return byPair;
}

export function normalizeToolPageUrl(input: string): string | null {
  try {
    const url = new URL(input.trim());
    if (
      !["http:", "https:"].includes(url.protocol) ||
      !["u2tool.com", "www.u2tool.com"].includes(url.hostname.toLowerCase()) ||
      url.username !== "" ||
      url.password !== "" ||
      url.port !== ""
    ) {
      return null;
    }
    const pathname = url.pathname.replace(/\/{2,}/gu, "/");
    const withSlash = pathname.endsWith("/") ? pathname : `${pathname}/`;
    return `https://www.u2tool.com${withSlash}`;
  } catch {
    return null;
  }
}

interface AggregatedGscRow extends GscPageRow {
  url: string;
}

function indexGscPageRows(
  rows: readonly GscPageRow[],
): Map<string, AggregatedGscRow> {
  const accumulated = new Map<
    string,
    {
      clicks: number;
      impressions: number;
      weightedPosition: number;
      positions: number[];
    }
  >();

  for (const row of rows) {
    assertGscMetrics(row, "GSC page row");
    const url = normalizeToolPageUrl(row.url);
    if (!url) continue;
    const value = accumulated.get(url) ?? {
      clicks: 0,
      impressions: 0,
      weightedPosition: 0,
      positions: [],
    };
    value.clicks += row.clicks;
    value.impressions += row.impressions;
    value.weightedPosition += row.position * row.impressions;
    value.positions.push(row.position);
    accumulated.set(url, value);
  }

  return new Map(
    [...accumulated].map(([url, value]) => [
      url,
      {
        url,
        clicks: value.clicks,
        impressions: value.impressions,
        position:
          value.impressions > 0
            ? value.weightedPosition / value.impressions
            : value.positions.reduce((sum, position) => sum + position, 0) /
              value.positions.length,
      },
    ]),
  );
}

function flattenStrings(value: unknown): string[] {
  if (typeof value === "string") return value.trim() ? [value.trim()] : [];
  if (Array.isArray(value)) return value.flatMap(flattenStrings);
  if (value && typeof value === "object") {
    return Object.values(value).flatMap(flattenStrings);
  }
  return [];
}

function normalizeSupportStructure(value: unknown): unknown {
  if (typeof value === "string") {
    return value.replace(/\s+/gu, " ").trim();
  }
  if (Array.isArray(value)) return value.map(normalizeSupportStructure);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.keys(value)
        .sort(compareText)
        .map((key) => [
          key,
          normalizeSupportStructure((value as Record<string, unknown>)[key]),
        ]),
    );
  }
  return value;
}

function normalizedSupportBlock(messages: Record<string, unknown>): string {
  return JSON.stringify(
    normalizeSupportStructure({
      detailed_description: messages.detailed_description,
      usage_steps: messages.usage_steps,
      usage_examples: messages.usage_examples,
      faqs: messages.faqs,
    }),
  );
}

function supportContentHash(messages: Record<string, unknown>): string {
  return createHash("sha256")
    .update(normalizedSupportBlock(messages))
    .digest("hex");
}

const DECISION_CONTENT_FIELDS = [
  "detailed_description",
  "usage_steps",
  "usage_examples",
  "faqs",
] as const;

function localeFallbackFields(
  locale: Locale,
  mergedMessages: Record<string, unknown>,
  localeSplitMessages: Record<string, unknown> | null,
): string[] {
  if (locale === "en") return [];
  return DECISION_CONTENT_FIELDS.filter(
    (field) =>
      Object.hasOwn(mergedMessages, field) &&
      !Object.hasOwn(localeSplitMessages ?? {}, field),
  );
}

function countNonEmptyStrings(value: unknown): number {
  return Array.isArray(value)
    ? value.filter((item) => typeof item === "string" && item.trim()).length
    : 0;
}

function countCompleteFaqs(value: unknown): number {
  return Array.isArray(value)
    ? value.filter(
        (item) =>
          item !== null &&
          typeof item === "object" &&
          typeof (item as Record<string, unknown>).question === "string" &&
          Boolean(
            (item as Record<string, string>).question.trim() &&
            typeof (item as Record<string, unknown>).answer === "string" &&
            (item as Record<string, string>).answer.trim(),
          ),
      ).length
    : 0;
}

interface RenderedEvidence {
  status: number | null;
  canonicalSelfReferences: boolean | null;
  hreflangPasses: boolean | null;
}

function renderedCanonicalSelfReferences(
  canonical: string,
  expectedUrl: string,
): boolean {
  try {
    const expected = new URL(expectedUrl);
    const candidate = new URL(canonical, expected);
    const candidatePath = candidate.pathname.endsWith("/")
      ? candidate.pathname
      : `${candidate.pathname}/`;
    return (
      candidate.origin === expected.origin &&
      candidatePath === expected.pathname &&
      candidate.search === "" &&
      candidate.hash === ""
    );
  } catch {
    return false;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function isNonNegativeInteger(value: unknown): value is number {
  return (
    typeof value === "number" &&
    Number.isFinite(value) &&
    Number.isInteger(value) &&
    value >= 0
  );
}

function isStringArray(value: unknown): value is string[] {
  return (
    Array.isArray(value) && value.every((item) => typeof item === "string")
  );
}

function hasRenderedProducerContractSchema(
  contract: Record<string, unknown>,
): boolean {
  return (
    isNonNegativeInteger(contract.status) &&
    typeof contract.title === "string" &&
    typeof contract.description === "string" &&
    typeof contract.canonical === "string" &&
    typeof contract.h1 === "string" &&
    isStringArray(contract.jsonLdTypes) &&
    isStringArray(contract.toolClusters) &&
    isStringArray(contract.toolClusterGroups) &&
    isStringArray(contract.siblingToolHrefs) &&
    isNonNegativeInteger(contract.faqQuestionCount) &&
    isStringArray(contract.bodyTextSentinels) &&
    isNonNegativeInteger(contract.capabilityDisclosureCount) &&
    isNonNegativeInteger(contract.grammarLanguageNoticeCount)
  );
}

function assertRenderedProducerSchema(input: unknown): asserts input is Record<
  string,
  unknown
> & {
  results: Record<string, unknown>[];
} {
  if (!isRecord(input)) {
    throw new Error(
      "Rendered evidence does not match the producer report schema",
    );
  }
  const summary = input.summary;
  const results = input.results;
  let baseUrlValid = false;
  try {
    baseUrlValid =
      typeof input.baseUrl === "string" && Boolean(new URL(input.baseUrl));
  } catch {
    baseUrlValid = false;
  }
  if (
    typeof input.generatedAt !== "string" ||
    !Number.isFinite(Date.parse(input.generatedAt)) ||
    !baseUrlValid ||
    !isRecord(summary) ||
    !isNonNegativeInteger(summary.total) ||
    !isNonNegativeInteger(summary.passed) ||
    !isNonNegativeInteger(summary.failed) ||
    !Array.isArray(results) ||
    summary.total !== results.length ||
    summary.passed + summary.failed !== summary.total
  ) {
    throw new Error(
      "Rendered evidence does not match the producer report schema",
    );
  }

  let observedFailed = 0;
  for (const candidate of results) {
    if (!isRecord(candidate)) {
      throw new Error(
        "Rendered evidence does not match the producer report schema",
      );
    }
    const { locale, slug, failures, contract, error } = candidate;
    if (
      typeof locale !== "string" ||
      !locale ||
      typeof slug !== "string" ||
      !slug ||
      candidate.path !== `/${locale}/tools/${slug}/` ||
      !isNonNegativeInteger(candidate.status) ||
      !isStringArray(failures) ||
      (error !== undefined && typeof error !== "string") ||
      (contract !== undefined &&
        (!isRecord(contract) ||
          !hasRenderedProducerContractSchema(contract) ||
          contract.status !== candidate.status)) ||
      (contract === undefined && typeof error !== "string")
    ) {
      throw new Error(
        "Rendered evidence does not match the producer report schema",
      );
    }
    if (failures.length > 0 || error !== undefined) observedFailed += 1;
  }
  if (
    summary.failed !== observedFailed ||
    summary.passed !== results.length - observedFailed
  ) {
    throw new Error(
      "Rendered evidence does not match the producer report schema",
    );
  }
}

function indexRenderedContracts(
  input: unknown,
): Map<string, Record<string, unknown>> {
  assertRenderedProducerSchema(input);
  const candidateRows = input.results;
  const entries: Array<[string, Record<string, unknown>]> = [];
  const seenPairs = new Set<string>();
  for (const candidate of candidateRows) {
    if (!candidate || typeof candidate !== "object") continue;
    const row = candidate as Record<string, unknown>;
    const locale = typeof row.locale === "string" ? row.locale : "";
    const slug = typeof row.slug === "string" ? row.slug : "";
    if (locale && slug) {
      const pair = `${locale}\0${slug}`;
      if (seenPairs.has(pair)) {
        throw new Error(
          `Duplicate rendered producer evidence for ${locale}/${slug}`,
        );
      }
      seenPairs.add(pair);
      entries.push([pair, row]);
    }
  }
  return new Map(entries);
}

function renderedEvidenceFor(
  row: Record<string, unknown> | undefined,
  expectedUrl: string,
): RenderedEvidence {
  if (!row) {
    return {
      status: null,
      canonicalSelfReferences: null,
      hreflangPasses: null,
    };
  }
  const contract =
    row.contract && typeof row.contract === "object"
      ? (row.contract as Record<string, unknown>)
      : {};
  const rawStatus = row.status;
  const canonical = contract.canonical;

  return {
    status:
      typeof rawStatus === "number" && Number.isFinite(rawStatus)
        ? rawStatus
        : null,
    canonicalSelfReferences:
      typeof canonical === "string"
        ? renderedCanonicalSelfReferences(canonical, expectedUrl)
        : null,
    hreflangPasses: null,
  };
}

function capabilitySupportsLocale(slug: string, locale: Locale): boolean {
  const profile = getToolCapabilityProfile(slug);
  if (!profile) return false;
  const engine = profile.supportedLocales.engine;
  return engine.kind === "language-neutral" || engine.local.includes(locale);
}

async function mapWithConcurrency<Input, Output>(
  inputs: readonly Input[],
  concurrency: number,
  map: (input: Input) => Promise<Output>,
): Promise<Output[]> {
  const outputs = new Array<Output>(inputs.length);
  let nextIndex = 0;
  const workers = Array.from(
    { length: Math.min(concurrency, inputs.length) },
    async () => {
      while (nextIndex < inputs.length) {
        const index = nextIndex;
        nextIndex += 1;
        outputs[index] = await map(inputs[index]);
      }
    },
  );
  await Promise.all(workers);
  return outputs;
}

export async function assembleToolIndexReadinessInputs(
  options: ToolIndexReadinessAssemblyOptions,
): Promise<NormalizedReadinessInputs> {
  const overridesByPair = indexReadinessOverrides(
    options.overrides ?? INDEX_READINESS_OVERRIDES,
    options.checkpointDate,
  );
  for (const query of options.currentQueries) {
    assertGscMetrics(query, "GSC query row");
  }
  const repositoryRoot = options.repositoryRoot ?? process.cwd();
  const toolCatalog = options.toolCatalog ?? configuredTools;
  const localeCatalog = options.localeCatalog ?? configuredLocales;
  const loadMessages = options.loadMessages ?? loadToolPageMessages;
  const loadLocaleSplitMessages =
    options.loadLocaleSplitMessages ??
    (options.loadMessages
      ? async (locale: Locale, slug: string) => loadMessages(locale, slug)
      : async (locale: Locale, slug: string) => {
          try {
            return JSON.parse(
              await readFile(
                path.join(
                  repositoryRoot,
                  "src/messages",
                  locale,
                  "tools",
                  `${slug}.json`,
                ),
                "utf8",
              ),
            ) as Record<string, unknown>;
          } catch {
            return null;
          }
        });
  const hasIndependentSplitCopy =
    options.hasIndependentSplitCopy ??
    ((locale: Locale, slug: string) =>
      existsSync(
        path.join(
          repositoryRoot,
          "src/messages",
          locale,
          "tools",
          `${slug}.json`,
        ),
      ));
  const currentByUrl = indexGscPageRows(options.currentPages);
  const historicalByUrl = indexGscPageRows(options.historicalPages);
  const renderedByPair = indexRenderedContracts(options.renderedContracts);
  const pilotSlugs = new Set<string>(PILOT_TOOL_SLUGS);
  const prioritySlugs = new Set(getPriorityTools().map(({ slug }) => slug));
  const sitemapPaths = new Set(
    buildToolsSitemapEntries().map(({ path: sitemapPath }) => sitemapPath),
  );
  const routeTemplateExists = existsSync(
    path.join(repositoryRoot, "src/pages/[locale]/tools/[slug].astro"),
  );
  const pairs = localeCatalog.flatMap((locale) =>
    toolCatalog.map((tool) => ({ locale, tool })),
  );
  const drafts = await mapWithConcurrency(
    pairs,
    32,
    async ({ locale, tool }) => {
      const url = canonicalToolUrl(locale, tool.slug);
      const current = currentByUrl.get(url);
      const historical = historicalByUrl.get(url);
      const messages = await loadMessages(locale, tool.slug);
      const localeSplitMessages = await loadLocaleSplitMessages(
        locale,
        tool.slug,
      );
      const inheritedContentFields = localeFallbackFields(
        locale,
        messages,
        localeSplitMessages,
      );
      const independentSplitCopy = await hasIndependentSplitCopy(
        locale,
        tool.slug,
      );
      const profile = getToolCapabilityProfile(tool.slug);
      const override = overridesByPair.get(`${locale}\0${tool.slug}`);
      const rendered = renderedEvidenceFor(
        renderedByPair.get(`${locale}\0${tool.slug}`),
        url,
      );
      const claimReport = assessToolCapabilityClaims({
        slug: tool.slug,
        locale,
        text: flattenStrings(messages).join("\n"),
      });
      const localeCapabilityIssues = validateToolLocaleCapability({
        locale,
        slug: tool.slug,
        mergedMessages: messages,
        evidenceTests: [],
      });

      return {
        tool,
        locale,
        url,
        current,
        historical,
        messages,
        inheritedContentFields,
        contentHash: supportContentHash(messages),
        independentSplitCopy,
        profile,
        override,
        rendered,
        claimIssues: [
          ...claimReport.issues.map(({ code }) => code),
          ...localeCapabilityIssues.map(({ code }) => `locale:${code}`),
        ],
        priority: pilotSlugs.has(tool.slug)
          ? ("pilot" as const)
          : prioritySlugs.has(tool.slug)
            ? ("p1" as const)
            : ("catalog" as const),
      };
    },
  );
  const hashCounts = new Map<string, number>();
  for (const draft of drafts) {
    hashCounts.set(
      draft.contentHash,
      (hashCounts.get(draft.contentHash) ?? 0) + 1,
    );
  }

  return {
    checkpointDate: options.checkpointDate,
    inputProvenance: options.inputProvenance,
    queryEvidence: {
      scope: "property-query-only",
      rowCount: options.currentQueries.length,
      urlJoinAvailable: false,
    },
    rows: drafts.map((draft) => ({
      url: draft.url,
      category: draft.tool.category,
      sourceEvidence: {
        splitMessagePath: path.posix.join(
          "src/messages",
          draft.locale,
          "tools",
          `${draft.tool.slug}.json`,
        ),
        splitMessageObserved: draft.independentSplitCopy,
        contentHash: draft.contentHash,
        currentGsc: {
          url: draft.url,
          observed: draft.current !== undefined,
          clicks: draft.current?.clicks ?? null,
          impressions: draft.current?.impressions ?? null,
          position: draft.current?.position ?? null,
        },
        historicalGsc: {
          url: draft.url,
          observed: draft.historical !== undefined,
          clicks: draft.historical?.clicks ?? null,
          impressions: draft.historical?.impressions ?? null,
          position: draft.historical?.position ?? null,
        },
        renderedContractObserved: renderedByPair.has(
          `${draft.locale}\0${draft.tool.slug}`,
        ),
        routeTemplatePath: "src/pages/[locale]/tools/[slug].astro",
        sitemapPath: new URL(draft.url).pathname.replace(/\/$/u, ""),
        capabilityProfileVersion: draft.profile?.version ?? null,
        localeFallbackFields: draft.inheritedContentFields,
      },
      demandCoverage: {
        currentPageRow: draft.current !== undefined,
        historicalPageRow: draft.historical !== undefined,
      },
      overrideReasons: draft.override ? [draft.override.reason] : [],
      evidenceGaps: draft.profile ? [] : ["localEngineSupportsLocale"],
      evidence: {
        slug: draft.tool.slug,
        locale: draft.locale,
        priority: draft.priority,
        hasCapabilityProfile: draft.profile !== undefined,
        capabilityEnforcement: draft.profile?.enforcement ?? "unprofiled",
        localEngineSupportsLocale: capabilitySupportsLocale(
          draft.tool.slug,
          draft.locale,
        ),
        capabilityClaimIssues: draft.claimIssues,
        content: {
          hasIndependentSplitCopy: draft.independentSplitCopy,
          detailedDescriptionLength:
            typeof draft.messages.detailed_description === "string"
              ? draft.messages.detailed_description.replace(/\s+/gu, " ").trim()
                  .length
              : 0,
          usageStepCount: countNonEmptyStrings(draft.messages.usage_steps),
          usageExampleCount: countNonEmptyStrings(
            draft.messages.usage_examples,
          ),
          faqCount: countCompleteFaqs(draft.messages.faqs),
          duplicateContentKey:
            (hashCounts.get(draft.contentHash) ?? 0) > 1
              ? draft.contentHash
              : null,
          fallbackUsed:
            !draft.independentSplitCopy ||
            draft.inheritedContentFields.length > 0,
        },
        technical: {
          routeExists: routeTemplateExists,
          inSitemap:
            sitemapPaths.has(new URL(draft.url).pathname.replace(/\/$/u, "")) ||
            sitemapPaths.has(new URL(draft.url).pathname),
          canonicalSelfReferences: draft.rendered.canonicalSelfReferences,
          hreflangPasses: draft.rendered.hreflangPasses,
          renderedStatus: draft.rendered.status,
        },
        demand: {
          currentClicks: draft.current?.clicks ?? 0,
          currentImpressions: draft.current?.impressions ?? 0,
          historicalClicks: draft.historical?.clicks ?? 0,
          historicalImpressions: draft.historical?.impressions ?? 0,
          topQueryShare: null,
        },
        overlap: {
          strongerSiblingSlug: draft.override?.strongerSiblingSlug ?? null,
          samePrimaryIntent: draft.override?.samePrimaryIntent ?? false,
        },
        protectedControl: draft.override?.protectedControl ?? false,
      },
    })),
  };
}

function parseCsv(csv: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let quoted = false;
  const input = csv.replace(/^\uFEFF/u, "");

  for (let index = 0; index < input.length; index += 1) {
    const character = input[index];
    if (quoted) {
      if (character === '"' && input[index + 1] === '"') {
        field += '"';
        index += 1;
      } else if (character === '"') {
        quoted = false;
      } else {
        field += character;
      }
      continue;
    }

    if (character === '"') {
      quoted = true;
    } else if (character === ",") {
      row.push(field);
      field = "";
    } else if (character === "\n") {
      row.push(field.replace(/\r$/u, ""));
      rows.push(row);
      row = [];
      field = "";
    } else {
      field += character;
    }
  }

  if (quoted) {
    throw new Error("Malformed CSV: unterminated quoted field");
  }
  if (field.length > 0 || row.length > 0) {
    row.push(field.replace(/\r$/u, ""));
    rows.push(row);
  }

  return rows.filter((candidate) => candidate.some((value) => value.trim()));
}

function parseRequiredMetric(value: string | undefined, label: string): number {
  const normalized = value?.trim().replace(/,/gu, "");
  if (!normalized) {
    throw new Error(`GSC CSV row is missing ${label}`);
  }
  const parsed = Number(normalized);
  if (!Number.isFinite(parsed)) {
    throw new Error(`GSC CSV ${label} is not numeric: ${value}`);
  }
  assertGscMetric(parsed, label);
  return parsed;
}

function assertGscMetric(value: number, label: string): void {
  if (label === "clicks" || label === "impressions") {
    if (!Number.isFinite(value) || !Number.isInteger(value) || value < 0) {
      throw new Error(`GSC ${label} must be a finite non-negative integer`);
    }
    return;
  }
  if (!Number.isFinite(value) || value < 0) {
    throw new Error(`GSC ${label} must be a finite non-negative number`);
  }
}

function assertGscMetrics(
  row: Pick<GscPageRow, "clicks" | "impressions" | "position">,
  context: string,
): void {
  for (const label of ["clicks", "impressions", "position"] as const) {
    try {
      assertGscMetric(row[label], label);
    } catch (error) {
      const details = error instanceof Error ? error.message : String(error);
      throw new Error(`${context}: ${details}`);
    }
  }
}

function requiredHeaderIndex(
  headers: readonly string[],
  label: string,
  matches: (header: string) => boolean,
): number {
  const index = headers.findIndex((header) =>
    matches(header.trim().toLowerCase()),
  );
  if (index < 0) {
    throw new Error(`GSC CSV is missing ${label} header`);
  }
  return index;
}

function requiredMetricHeaderIndex(
  headers: readonly string[],
  label: string,
  period: "current" | "historical",
  matches: (header: string) => boolean,
): number {
  const matchesIndexes = headers.flatMap((header, index) =>
    matches(header.trim().toLowerCase()) ? [index] : [],
  );
  if (matchesIndexes.length === 0) {
    throw new Error(`GSC CSV is missing ${label} header`);
  }
  if (matchesIndexes.length === 1) return matchesIndexes[0];

  const semanticPeriod = (header: string): "current" | "historical" | null => {
    if (/\b(?:previous|prior)\b|(?:上一|前一|历史|前期)/u.test(header)) {
      return "historical";
    }
    if (/\b(?:current|last)\b|(?:当前|本期)/u.test(header)) {
      return "current";
    }
    return null;
  };
  const semanticMatches = matchesIndexes.filter(
    (index) => semanticPeriod(headers[index].toLowerCase()) === period,
  );
  if (semanticMatches.length === 1) return semanticMatches[0];
  if (period === "current" && matchesIndexes.length === 2) {
    const historicalMatches = matchesIndexes.filter(
      (index) => semanticPeriod(headers[index].toLowerCase()) === "historical",
    );
    if (historicalMatches.length === 1) {
      return matchesIndexes.find((index) => index !== historicalMatches[0])!;
    }
  }

  const dated = matchesIndexes.map((index) => {
    const match = headers[index].match(/(\d{4})[/-](\d{1,2})[/-](\d{1,2})/u);
    return {
      index,
      timestamp: match
        ? Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3]))
        : Number.NaN,
    };
  });
  if (dated.every(({ timestamp }) => Number.isFinite(timestamp))) {
    dated.sort((left, right) => right.timestamp - left.timestamp);
    return dated[period === "current" ? 0 : 1].index;
  }

  throw new Error(
    `GSC CSV has ambiguous ${label} period headers; label columns as Current/Previous or include date ranges`,
  );
}

function parseGscPageRowsWithHeaders(
  csv: string,
  period: "current" | "historical",
): {
  rows: GscPageRow[];
  selectedHeaders: ToolIndexReadinessInputProvenance["currentPages"]["selectedHeaders"];
} {
  const [headers, ...records] = parseCsv(csv);
  if (!headers) {
    throw new Error("GSC page CSV is empty");
  }

  const urlIndex = requiredHeaderIndex(headers, "page", (header) =>
    ["top pages", "pages", "page", "排名靠前的网页", "网页"].includes(header),
  );
  const clicksIndex = requiredMetricHeaderIndex(
    headers,
    "clicks",
    period,
    (header) => header.includes("clicks") || header.includes("点击次数"),
  );
  const impressionsIndex = requiredMetricHeaderIndex(
    headers,
    "impressions",
    period,
    (header) => header.includes("impressions") || header.includes("展示"),
  );
  const positionIndex = requiredMetricHeaderIndex(
    headers,
    "position",
    period,
    (header) =>
      header.includes("position") ||
      (header.includes("排名") && !header.includes("网页")),
  );

  return {
    rows: records.map((record) => ({
      url: record[urlIndex]?.trim() ?? "",
      clicks: parseRequiredMetric(record[clicksIndex], "clicks"),
      impressions: parseRequiredMetric(record[impressionsIndex], "impressions"),
      position: parseRequiredMetric(record[positionIndex], "position"),
    })),
    selectedHeaders: {
      page: headers[urlIndex].trim(),
      clicks: headers[clicksIndex].trim(),
      impressions: headers[impressionsIndex].trim(),
      position: headers[positionIndex].trim(),
    },
  };
}

export function parseGscPageRowsForPeriod(
  csv: string,
  period: "current" | "historical",
): GscPageRow[] {
  return parseGscPageRowsWithHeaders(csv, period).rows;
}

export function parseGscPageRows(csv: string): GscPageRow[] {
  return parseGscPageRowsForPeriod(csv, "current");
}

function parseGscQueryRowsWithHeaders(csv: string): {
  rows: GscQueryRow[];
  selectedHeaders: ToolIndexReadinessInputProvenance["currentQueries"]["selectedHeaders"];
} {
  const [headers, ...records] = parseCsv(csv);
  if (!headers) {
    throw new Error("GSC query CSV is empty");
  }

  const queryIndex = requiredHeaderIndex(headers, "query", (header) =>
    ["top queries", "queries", "query", "热门查询", "查询数", "查询"].includes(
      header,
    ),
  );
  const clicksIndex = requiredMetricHeaderIndex(
    headers,
    "clicks",
    "current",
    (header) => header.includes("clicks") || header.includes("点击次数"),
  );
  const impressionsIndex = requiredMetricHeaderIndex(
    headers,
    "impressions",
    "current",
    (header) => header.includes("impressions") || header.includes("展示"),
  );
  const positionIndex = requiredMetricHeaderIndex(
    headers,
    "position",
    "current",
    (header) => header.includes("position") || header.includes("排名"),
  );

  return {
    rows: records.map((record) => ({
      query: record[queryIndex]?.trim() ?? "",
      clicks: parseRequiredMetric(record[clicksIndex], "clicks"),
      impressions: parseRequiredMetric(record[impressionsIndex], "impressions"),
      position: parseRequiredMetric(record[positionIndex], "position"),
    })),
    selectedHeaders: {
      query: headers[queryIndex].trim(),
      clicks: headers[clicksIndex].trim(),
      impressions: headers[impressionsIndex].trim(),
      position: headers[positionIndex].trim(),
    },
  };
}

export function parseGscQueryRows(csv: string): GscQueryRow[] {
  return parseGscQueryRowsWithHeaders(csv).rows;
}

function knownEvidenceReasons(row: NormalizedReadinessRow): string[] {
  const reasons: string[] = [];
  const { evidence } = row;
  const { content, technical } = evidence;
  const evidenceGaps = new Set(row.evidenceGaps ?? []);

  if (!technical.routeExists) reasons.push("technical-route-missing");
  if (!technical.inSitemap) reasons.push("technical-sitemap-missing");
  if (technical.canonicalSelfReferences === false) {
    reasons.push("technical-canonical-failed");
  }
  if (technical.hreflangPasses === false) {
    reasons.push("technical-hreflang-failed");
  }
  if (technical.renderedStatus !== null && technical.renderedStatus !== 200) {
    reasons.push("technical-rendered-status-failed");
  }
  if (evidence.capabilityClaimIssues.length > 0) {
    reasons.push("capability-claim-issue");
  }
  if (
    !evidence.localEngineSupportsLocale &&
    !evidenceGaps.has("localEngineSupportsLocale")
  ) {
    reasons.push("locale-engine-unsupported");
  }
  if (!content.hasIndependentSplitCopy) {
    reasons.push("independent-split-copy-missing");
  }
  if (content.detailedDescriptionLength < 220) {
    reasons.push("content-detailed-description-thin");
  }
  if (content.usageStepCount < 3) reasons.push("content-usage-steps-thin");
  if (content.usageExampleCount < 2) {
    reasons.push("content-usage-examples-thin");
  }
  if (content.faqCount < 3) reasons.push("content-faqs-thin");
  if (content.duplicateContentKey !== null) {
    reasons.push("duplicate-content-detected");
  }
  if (content.fallbackUsed) reasons.push("fallback-content-used");
  if (
    evidence.overlap.strongerSiblingSlug !== null &&
    evidence.overlap.samePrimaryIntent
  ) {
    reasons.push("stronger-sibling-overlap");
  }
  if (
    row.demandCoverage.currentPageRow &&
    (evidence.demand.currentClicks > 0 ||
      evidence.demand.currentImpressions > 0)
  ) {
    reasons.push("current-demand-present");
  }
  if (
    row.demandCoverage.historicalPageRow &&
    (evidence.demand.historicalClicks > 0 ||
      evidence.demand.historicalImpressions > 0)
  ) {
    reasons.push("historical-demand-present");
  }
  if (
    evidence.demand.topQueryShare !== null &&
    evidence.demand.topQueryShare > 0.8
  ) {
    reasons.push("one-query-dominance");
  }
  if (evidence.protectedControl) reasons.push("protected-control");

  return reasons;
}

export function buildToolIndexReadinessReport(
  input: NormalizedReadinessInputs,
): ToolIndexReadinessReport {
  const rows = input.rows
    .map<ToolIndexReadinessReportRow>((row) => {
      const decision = evaluateToolIndexReadiness(row.evidence);
      const missingEvidence: string[] = [...(row.evidenceGaps ?? [])];
      const reasons: string[] = [];

      if ((row.evidenceGaps?.length ?? 0) > 0) {
        reasons.push("assembled-evidence-missing");
      }

      if (!row.demandCoverage.currentPageRow) {
        missingEvidence.push("demand.currentPageRow");
        reasons.push("gsc-current-page-row-missing");
      }
      if (!row.demandCoverage.historicalPageRow) {
        missingEvidence.push("demand.historicalPageRow");
        reasons.push("gsc-historical-page-row-missing");
      }

      const hasSourceGap =
        missingEvidence.length > 0 || decision.missingEvidence.length > 0;
      const finalDecision: IndexReadinessDecision = !hasSourceGap
        ? decision
        : {
            recommendation: "manual-review",
            reasons: [
              ...new Set([
                ...reasons,
                ...decision.reasons.filter(
                  (reason) => reason !== "zero-demand",
                ),
                ...knownEvidenceReasons(row),
              ]),
            ],
            missingEvidence: [
              ...new Set([...missingEvidence, ...decision.missingEvidence]),
            ],
            reviewRequired: true,
          };

      return {
        ...row,
        evidence: {
          ...row.evidence,
          demand: {
            currentClicks: row.demandCoverage.currentPageRow
              ? row.evidence.demand.currentClicks
              : null,
            currentImpressions: row.demandCoverage.currentPageRow
              ? row.evidence.demand.currentImpressions
              : null,
            historicalClicks: row.demandCoverage.historicalPageRow
              ? row.evidence.demand.historicalClicks
              : null,
            historicalImpressions: row.demandCoverage.historicalPageRow
              ? row.evidence.demand.historicalImpressions
              : null,
            topQueryShare: row.evidence.demand.topQueryShare,
          },
        },
        decision: finalDecision,
        implementationPlanRequired:
          finalDecision.recommendation === "merge" ||
          finalDecision.recommendation === "noindex-candidate",
      };
    })
    .sort(
      (left, right) =>
        RECOMMENDATION_ORDER.indexOf(left.decision.recommendation) -
          RECOMMENDATION_ORDER.indexOf(right.decision.recommendation) ||
        PRIORITY_ORDER.indexOf(left.evidence.priority) -
          PRIORITY_ORDER.indexOf(right.evidence.priority) ||
        compareText(left.evidence.locale, right.evidence.locale) ||
        compareText(left.evidence.slug, right.evidence.slug),
    );

  return {
    notice: RECOMMENDATION_ONLY_NOTICE,
    checkpointDate: input.checkpointDate,
    inputProvenance: input.inputProvenance ?? null,
    queryEvidence: input.queryEvidence,
    rows,
  };
}

export function renderToolIndexReadinessJson(
  report: ToolIndexReadinessReport,
): string {
  return `${JSON.stringify(report, null, 2)}\n`;
}

function csvCell(value: unknown): string {
  const text = Array.isArray(value) ? value.join("|") : String(value ?? "");
  const normalized = text.replace(/\r?\n/gu, " ");
  return /[",\r\n]/u.test(normalized)
    ? `"${normalized.replace(/"/gu, '""')}"`
    : normalized;
}

export function renderToolIndexReadinessCsv(
  report: ToolIndexReadinessReport,
): string {
  const headers = [
    "url",
    "locale",
    "slug",
    "category",
    "priority",
    "recommendation",
    "review_required",
    "implementation_plan_required",
    "reasons",
    "missing_evidence",
    "current_row_observed",
    "historical_row_observed",
    "current_clicks",
    "current_impressions",
    "historical_clicks",
    "historical_impressions",
    "top_query_share",
    "split_message_path",
    "split_message_observed",
    "independent_split_copy",
    "detailed_description_length",
    "usage_step_count",
    "usage_example_count",
    "faq_count",
    "duplicate_content_key",
    "fallback_used",
    "route_exists",
    "in_sitemap",
    "canonical_self_references",
    "hreflang_passes",
    "rendered_status",
    "has_capability_profile",
    "capability_enforcement",
    "local_engine_supports_locale",
    "capability_claim_issues",
    "protected_control",
    "override_reasons",
  ];
  const rows = report.rows.map((row) => {
    const { content, technical, demand } = row.evidence;
    return [
      row.url,
      row.evidence.locale,
      row.evidence.slug,
      row.category,
      row.evidence.priority,
      row.decision.recommendation,
      row.decision.reviewRequired,
      row.implementationPlanRequired,
      row.decision.reasons,
      row.decision.missingEvidence,
      row.demandCoverage.currentPageRow,
      row.demandCoverage.historicalPageRow,
      demand.currentClicks,
      demand.currentImpressions,
      demand.historicalClicks,
      demand.historicalImpressions,
      demand.topQueryShare,
      row.sourceEvidence?.splitMessagePath,
      row.sourceEvidence?.splitMessageObserved,
      content.hasIndependentSplitCopy,
      content.detailedDescriptionLength,
      content.usageStepCount,
      content.usageExampleCount,
      content.faqCount,
      content.duplicateContentKey,
      content.fallbackUsed,
      technical.routeExists,
      technical.inSitemap,
      technical.canonicalSelfReferences,
      technical.hreflangPasses,
      technical.renderedStatus,
      row.evidence.hasCapabilityProfile,
      row.evidence.capabilityEnforcement,
      row.evidence.localEngineSupportsLocale,
      row.evidence.capabilityClaimIssues,
      row.evidence.protectedControl,
      row.overrideReasons,
    ]
      .map(csvCell)
      .join(",");
  });

  return (
    [RECOMMENDATION_ONLY_NOTICE, headers.join(","), ...rows].join("\n") + "\n"
  );
}

function recommendationCounts(
  rows: readonly ToolIndexReadinessReportRow[],
): Record<(typeof RECOMMENDATION_ORDER)[number], number> {
  const counts = Object.fromEntries(
    RECOMMENDATION_ORDER.map((recommendation) => [recommendation, 0]),
  ) as Record<(typeof RECOMMENDATION_ORDER)[number], number>;
  for (const row of rows) counts[row.decision.recommendation] += 1;
  return counts;
}

function summaryTable(
  rows: readonly ToolIndexReadinessReportRow[],
  group: (row: ToolIndexReadinessReportRow) => string,
): string {
  const groups = new Map<string, ToolIndexReadinessReportRow[]>();
  for (const row of rows) {
    const key = group(row);
    groups.set(key, [...(groups.get(key) ?? []), row]);
  }
  const lines = [
    `| Group | Total | ${RECOMMENDATION_ORDER.join(" | ")} |`,
    `| --- | ---: | ${RECOMMENDATION_ORDER.map(() => "---:").join(" | ")} |`,
  ];
  for (const [key, groupRows] of [...groups].sort(([left], [right]) =>
    compareText(left, right),
  )) {
    const counts = recommendationCounts(groupRows);
    lines.push(
      `| ${key} | ${groupRows.length} | ${RECOMMENDATION_ORDER.map((recommendation) => counts[recommendation]).join(" | ")} |`,
    );
  }
  return lines.join("\n");
}

function priorityDetailTable(
  rows: readonly ToolIndexReadinessReportRow[],
  priority: "pilot" | "p1",
): string {
  const selected = rows.filter((row) => row.evidence.priority === priority);
  if (selected.length === 0) return "_No rows._";
  return [
    "| Locale | Slug | Recommendation | Reasons | Missing evidence |",
    "| --- | --- | --- | --- | --- |",
    ...selected.map(
      (row) =>
        `| ${row.evidence.locale} | ${row.evidence.slug} | ${row.decision.recommendation} | ${row.decision.reasons.join(", ")} | ${row.decision.missingEvidence.join(", ")} |`,
    ),
  ].join("\n");
}

export function renderToolIndexReadinessMarkdown(
  report: ToolIndexReadinessReport,
): string {
  const totals = recommendationCounts(report.rows);
  const protectedRows = report.rows.filter(
    ({ evidence }) => evidence.protectedControl,
  );
  const missingFieldCounts = new Map<string, number>();
  for (const row of report.rows) {
    for (const field of row.decision.missingEvidence) {
      missingFieldCounts.set(field, (missingFieldCounts.get(field) ?? 0) + 1);
    }
  }
  const reviewQueue = report.rows.filter(
    ({ decision }) =>
      decision.recommendation === "merge" ||
      decision.recommendation === "noindex-candidate",
  );
  const provenance = report.inputProvenance;
  const provenanceLines = provenance
    ? [
        `- Current GSC pages: path \`${provenance.currentPages.path}\`; SHA-256 \`${provenance.currentPages.sha256}\`; headers page=\`${provenance.currentPages.selectedHeaders.page}\`, clicks=\`${provenance.currentPages.selectedHeaders.clicks}\`, impressions=\`${provenance.currentPages.selectedHeaders.impressions}\`, position=\`${provenance.currentPages.selectedHeaders.position}\`.`,
        `- Historical GSC pages: path \`${provenance.historicalPages.path}\`; SHA-256 \`${provenance.historicalPages.sha256}\`; headers page=\`${provenance.historicalPages.selectedHeaders.page}\`, clicks=\`${provenance.historicalPages.selectedHeaders.clicks}\`, impressions=\`${provenance.historicalPages.selectedHeaders.impressions}\`, position=\`${provenance.historicalPages.selectedHeaders.position}\`.`,
        `- Current GSC queries: path \`${provenance.currentQueries.path}\`; SHA-256 \`${provenance.currentQueries.sha256}\`; scope \`${provenance.currentQueries.scope}\`; headers query=\`${provenance.currentQueries.selectedHeaders.query}\`, clicks=\`${provenance.currentQueries.selectedHeaders.clicks}\`, impressions=\`${provenance.currentQueries.selectedHeaders.impressions}\`, position=\`${provenance.currentQueries.selectedHeaders.position}\`.`,
        `- Rendered contracts: path \`${provenance.renderedContracts.path}\`; SHA-256 \`${provenance.renderedContracts.sha256}\`.`,
      ]
    : ["_Input provenance unavailable for this in-memory report._"];
  const lines = [
    RECOMMENDATION_ONLY_NOTICE,
    "",
    `# Tool Index Readiness Evidence — ${report.checkpointDate}`,
    "",
    "This is evidence and recommendation output only. It does not write robots.txt, meta robots, canonical, hreflang, redirects, or sitemap files.",
    "",
    "The query export is property-level query-only data and has no URL-query joint dimension. `topQueryShare` therefore remains `null`; no query is associated with a URL.",
    "",
    "## Input provenance",
    "",
    ...provenanceLines,
    "",
    "The CSV sibling remains a row-only projection; the JSON and Markdown siblings are authoritative for input provenance.",
    "",
    "## Totals",
    "",
    `- URLs: ${report.rows.length}`,
    ...RECOMMENDATION_ORDER.map(
      (recommendation) => `- ${recommendation}: ${totals[recommendation]}`,
    ),
    "",
    "## Locale summaries",
    "",
    summaryTable(report.rows, (row) => row.evidence.locale),
    "",
    "## Category summaries",
    "",
    summaryTable(report.rows, (row) => row.category),
    "",
    "## Pilot and P1",
    "",
    "### Pilot",
    "",
    priorityDetailTable(report.rows, "pilot"),
    "",
    "### P1",
    "",
    priorityDetailTable(report.rows, "p1"),
    "",
    "## Protected controls",
    "",
    ...(protectedRows.length > 0
      ? protectedRows.map(
          (row) =>
            `- ${row.url} — ${row.overrideReasons.join("; ") || "protected control"}`,
        )
      : ["_No protected controls._"]),
    "",
    "## Missing evidence",
    "",
    ...(missingFieldCounts.size > 0
      ? [...missingFieldCounts]
          .sort(([left], [right]) => compareText(left, right))
          .map(([field, count]) => `- ${field}: ${count} URL(s)`)
      : ["_No missing decision-critical evidence._"]),
    "",
    "## Merge and noindex-candidate review queue",
    "",
    "Every row below requires explicit human review and a separate implementation plan before any indexation change.",
    "",
    ...(reviewQueue.length > 0
      ? reviewQueue.map(
          (row) =>
            `- ${row.decision.recommendation}: ${row.url} — ${row.decision.reasons.join(", ")}`,
        )
      : ["_No merge or noindex-candidate rows._"]),
    "",
  ];
  return lines.join("\n");
}

export interface ToolIndexReadinessCliResult {
  report: ToolIndexReadinessReport;
  outputPaths: {
    json: string;
    csv: string;
    markdown: string;
  };
}

export interface ArtifactWriteOperations {
  mkdir: (directory: string) => Promise<void>;
  writeFile: (filePath: string, content: string) => Promise<void>;
  copyFile: (source: string, destination: string) => Promise<void>;
  rename: (source: string, destination: string) => Promise<void>;
  remove: (filePath: string) => Promise<void>;
}

export async function writeToolIndexReadinessArtifacts(
  report: ToolIndexReadinessReport,
  outputDir: string,
  overrides: Partial<ArtifactWriteOperations> = {},
): Promise<ToolIndexReadinessCliResult["outputPaths"]> {
  const operations: ArtifactWriteOperations = {
    mkdir: async (directory) => {
      await mkdir(directory, { recursive: true });
    },
    writeFile: async (filePath, content) => {
      await writeFile(filePath, content, "utf8");
    },
    copyFile: async (source, destination) => {
      await copyFile(source, destination);
    },
    rename: async (source, destination) => {
      await rename(source, destination);
    },
    remove: async (filePath) => {
      await rm(filePath, { force: true });
    },
    ...overrides,
  };
  const outputPaths = {
    json: path.join(outputDir, "tool-index-readiness.json"),
    csv: path.join(outputDir, "tool-index-readiness.csv"),
    markdown: path.join(outputDir, "tool-index-readiness.md"),
  };
  const token = `${process.pid}-${randomUUID()}`;
  const entries = [
    {
      finalPath: outputPaths.json,
      content: renderToolIndexReadinessJson(report),
    },
    {
      finalPath: outputPaths.csv,
      content: renderToolIndexReadinessCsv(report),
    },
    {
      finalPath: outputPaths.markdown,
      content: renderToolIndexReadinessMarkdown(report),
    },
  ].map((entry) => ({
    ...entry,
    tempPath: `${entry.finalPath}.${token}.tmp`,
    backupPath: `${entry.finalPath}.${token}.backup`,
    hadOriginal: false,
    published: false,
    backupRestored: false,
    rollbackRemovalFailed: false,
  }));

  await operations.mkdir(outputDir);
  let publicationFailed = false;
  let publicationError: unknown;
  const rollbackErrors: unknown[] = [];
  try {
    const writeResults = await Promise.allSettled(
      entries.map((entry) =>
        operations.writeFile(entry.tempPath, entry.content),
      ),
    );
    const failedWrite = writeResults.find(
      (result): result is PromiseRejectedResult => result.status === "rejected",
    );
    if (failedWrite) throw failedWrite.reason;

    for (const entry of entries) {
      if (existsSync(entry.finalPath)) {
        await operations.copyFile(entry.finalPath, entry.backupPath);
        entry.hadOriginal = true;
      }
    }
    for (const entry of entries) {
      await operations.rename(entry.tempPath, entry.finalPath);
      entry.published = true;
    }
  } catch (error) {
    publicationFailed = true;
    publicationError = error;
    for (const entry of [...entries].reverse()) {
      if (!entry.published) continue;
      try {
        await operations.remove(entry.finalPath);
      } catch (rollbackError) {
        entry.rollbackRemovalFailed = true;
        rollbackErrors.push(rollbackError);
      }
      if (entry.hadOriginal) {
        try {
          await operations.rename(entry.backupPath, entry.finalPath);
          entry.backupRestored = true;
        } catch (rollbackError) {
          rollbackErrors.push(rollbackError);
        }
      }
    }
  }

  const cleanupErrors: unknown[] = [];
  const newPublicationRecoveryRequired = entries.some(
    (entry) =>
      entry.published && !entry.hadOriginal && entry.rollbackRemovalFailed,
  );
  await Promise.all(
    entries.flatMap((entry) => {
      const safePaths = newPublicationRecoveryRequired ? [] : [entry.tempPath];
      if (
        !publicationFailed ||
        !entry.hadOriginal ||
        !entry.published ||
        entry.backupRestored
      ) {
        safePaths.push(entry.backupPath);
      }
      return safePaths.map(async (filePath) => {
        try {
          await operations.remove(filePath);
        } catch (cleanupError) {
          cleanupErrors.push(cleanupError);
        }
      });
    }),
  );

  if (publicationFailed) {
    const errors = [publicationError, ...rollbackErrors, ...cleanupErrors];
    if (errors.length > 1) {
      throw new AggregateError(
        errors,
        "Tool index readiness artifact publication failed and rollback was incomplete",
      );
    }
    throw publicationError;
  }
  if (cleanupErrors.length > 0) {
    throw new AggregateError(
      cleanupErrors,
      "Tool index readiness artifacts were published but cleanup failed",
    );
  }

  return outputPaths;
}

async function readRequiredInput(
  filePath: string,
  label: string,
): Promise<{ text: string; sha256: string }> {
  try {
    const bytes = await readFile(filePath);
    return {
      text: bytes.toString("utf8"),
      sha256: createHash("sha256").update(bytes).digest("hex"),
    };
  } catch (error) {
    const details = error instanceof Error ? error.message : String(error);
    throw new Error(`${label} input unavailable: ${filePath} (${details})`);
  }
}

export async function runToolIndexReadinessCli(
  options = parseToolIndexReadinessArgs(process.argv.slice(2)),
): Promise<ToolIndexReadinessCliResult> {
  const [currentPagesCsv, historicalPagesCsv, currentQueriesCsv, renderedJson] =
    await Promise.all([
      readRequiredInput(options.currentPagesCsv, "Current GSC pages"),
      readRequiredInput(options.historicalPagesCsv, "Historical GSC pages"),
      readRequiredInput(options.currentQueriesCsv, "Current GSC queries"),
      readRequiredInput(options.renderedContractsJson, "Rendered contracts"),
    ]);
  let renderedContracts: unknown;
  try {
    renderedContracts = JSON.parse(renderedJson.text) as unknown;
  } catch (error) {
    throw new Error(
      `Rendered contracts JSON is invalid: ${options.renderedContractsJson} (${error instanceof Error ? error.message : String(error)})`,
    );
  }

  const currentPages = parseGscPageRowsWithHeaders(
    currentPagesCsv.text,
    "current",
  );
  const historicalPages = parseGscPageRowsWithHeaders(
    historicalPagesCsv.text,
    "historical",
  );
  const currentQueries = parseGscQueryRowsWithHeaders(currentQueriesCsv.text);

  const normalized = await assembleToolIndexReadinessInputs({
    checkpointDate: options.checkpointDate,
    currentPages: currentPages.rows,
    historicalPages: historicalPages.rows,
    currentQueries: currentQueries.rows,
    renderedContracts,
    inputProvenance: {
      currentPages: {
        path: options.currentPagesCsv,
        sha256: currentPagesCsv.sha256,
        selectedHeaders: currentPages.selectedHeaders,
      },
      historicalPages: {
        path: options.historicalPagesCsv,
        sha256: historicalPagesCsv.sha256,
        selectedHeaders: historicalPages.selectedHeaders,
      },
      currentQueries: {
        path: options.currentQueriesCsv,
        sha256: currentQueriesCsv.sha256,
        scope: "property-query-only",
        selectedHeaders: currentQueries.selectedHeaders,
      },
      renderedContracts: {
        path: options.renderedContractsJson,
        sha256: renderedJson.sha256,
      },
    },
  });
  const report = buildToolIndexReadinessReport(normalized);
  const outputPaths = await writeToolIndexReadinessArtifacts(
    report,
    options.outputDir,
  );

  return { report, outputPaths };
}

async function main(): Promise<void> {
  const { report, outputPaths } = await runToolIndexReadinessCli();
  process.stdout.write(`${RECOMMENDATION_ONLY_NOTICE}\n`);
  process.stdout.write(`URLs: ${report.rows.length}\n`);
  process.stdout.write(`JSON: ${outputPaths.json}\n`);
  process.stdout.write(`CSV: ${outputPaths.csv}\n`);
  process.stdout.write(`Markdown: ${outputPaths.markdown}\n`);
}

const invokedPath = process.argv[1]
  ? pathToFileURL(path.resolve(process.argv[1])).href
  : "";
if (import.meta.url === invokedPath) {
  main().catch((error) => {
    process.stderr.write(
      `${error instanceof Error ? error.message : String(error)}\n`,
    );
    process.exitCode = 1;
  });
}

function baselinePaths(
  checkpointDate: string,
): Omit<ToolIndexReadinessCliOptions, "checkpointDate"> {
  const rawDir = path.posix.join(
    "exports/gsc/checkpoints",
    checkpointDate,
    "raw",
  );
  const outputDir = path.posix.join(
    "exports/seo/tool-index-readiness",
    checkpointDate,
  );

  return {
    currentPagesCsv: path.posix.join(rawDir, "网页.csv"),
    historicalPagesCsv: path.posix.join(rawDir, "网页-previous.csv"),
    currentQueriesCsv: path.posix.join(rawDir, "查询数.csv"),
    renderedContractsJson: path.posix.join(
      outputDir,
      "rendered-contracts.json",
    ),
    outputDir,
  };
}

export function parseToolIndexReadinessArgs(
  args: string[],
): ToolIndexReadinessCliOptions {
  const allowedFlags = new Set([
    "--checkpoint-date",
    "--current-pages-csv",
    "--historical-pages-csv",
    "--current-queries-csv",
    "--rendered-contracts-json",
    "--output-dir",
  ]);
  const values = new Map<string, string>();
  for (let index = 0; index < args.length; index += 2) {
    const flag = args[index];
    const value = args[index + 1];
    if (!flag?.startsWith("--")) {
      throw new Error(`Invalid argument near ${flag ?? "<end>"}`);
    }
    if (!allowedFlags.has(flag)) {
      throw new Error(`Unknown argument flag ${flag}`);
    }
    if (values.has(flag)) {
      throw new Error(`Duplicate argument flag ${flag}`);
    }
    if (value === undefined || value.startsWith("--")) {
      throw new Error(`Missing value for ${flag}`);
    }
    values.set(flag, value);
  }

  const checkpointDate = values.get("--checkpoint-date");
  if (!checkpointDate) {
    throw new Error("Required: --checkpoint-date YYYY-MM-DD");
  }
  assertCalendarDate(checkpointDate, "checkpoint date");

  const defaults = baselinePaths(checkpointDate);
  return {
    checkpointDate,
    currentPagesCsv:
      values.get("--current-pages-csv") ?? defaults.currentPagesCsv,
    historicalPagesCsv:
      values.get("--historical-pages-csv") ?? defaults.historicalPagesCsv,
    currentQueriesCsv:
      values.get("--current-queries-csv") ?? defaults.currentQueriesCsv,
    renderedContractsJson:
      values.get("--rendered-contracts-json") ?? defaults.renderedContractsJson,
    outputDir: values.get("--output-dir") ?? defaults.outputDir,
  };
}
