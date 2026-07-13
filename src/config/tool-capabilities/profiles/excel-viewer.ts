import { locales } from "@/lib/i18n";
import { defineToolCapabilityProfile } from "../define-profile";

export const excelViewerCapabilityProfile = defineToolCapabilityProfile({
  slug: "excel-viewer",
  version: "1.0.0",
  enforcement: "inventory",
  modes: [
    {
      id: "local-workbook-viewing",
      labelKey: "tools.excel-viewer.capabilities.modes.localWorkbookViewing",
      runtime: "browser",
    },
  ],
  acceptedInputs: [
    {
      id: "xls-workbook",
      labelKey: "tools.excel-viewer.capabilities.inputs.xlsWorkbook",
    },
    {
      id: "xlsx-workbook",
      labelKey: "tools.excel-viewer.capabilities.inputs.xlsxWorkbook",
    },
  ],
  producedOutputs: [
    {
      id: "sheet-table",
      labelKey: "tools.excel-viewer.capabilities.outputs.sheetTable",
    },
  ],
  supportedLocales: {
    ui: locales,
    engine: { kind: "language-neutral" },
  },
  browserOnlyFeatures: [
    {
      id: "xls-xlsx-open",
      labelKey: "tools.excel-viewer.capabilities.features.xlsXlsxOpen",
      evidence: undefined,
    },
    {
      id: "sheet-tabs",
      labelKey: "tools.excel-viewer.capabilities.features.sheetTabs",
      evidence: undefined,
    },
    {
      id: "row-table",
      labelKey: "tools.excel-viewer.capabilities.features.rowTable",
      evidence: undefined,
    },
    {
      id: "sort",
      labelKey: "tools.excel-viewer.capabilities.features.sort",
      evidence: undefined,
    },
    {
      id: "filter",
      labelKey: "tools.excel-viewer.capabilities.features.filter",
      evidence: undefined,
    },
  ],
  optionalServerFeatures: [],
  limits: [
    {
      id: "no-macros",
      labelKey: "tools.excel-viewer.capabilities.limits.noMacros",
    },
    {
      id: "no-formula-recalculation",
      labelKey: "tools.excel-viewer.capabilities.limits.noFormulaRecalculation",
    },
    {
      id: "no-charts",
      labelKey: "tools.excel-viewer.capabilities.limits.noCharts",
    },
    {
      id: "no-full-formatting-fidelity",
      labelKey:
        "tools.excel-viewer.capabilities.limits.noFullFormattingFidelity",
    },
    {
      id: "no-export",
      labelKey: "tools.excel-viewer.capabilities.limits.noExport",
    },
  ],
  forbiddenClaims: [
    {
      code: "excel-viewer-macro-claim",
      pattern:
        /(?<!not )(?<!n't )\b(?:runs?|executes?|supports?) (?:Excel )?macros?\b/i,
      reason: "The viewer does not execute workbook macros.",
    },
    {
      code: "excel-viewer-formula-recalculation-claim",
      pattern:
        /(?<!not )(?<!n't )\b(?:recalculates?|evaluates?) (?:Excel )?formulas?\b/i,
      reason: "The viewer does not recalculate formula results.",
    },
    {
      code: "excel-viewer-chart-claim",
      pattern:
        /(?<!not )(?<!n't )\b(?:renders?|displays?|supports?) (?:Excel )?charts?\b/i,
      reason: "The row-table view does not render workbook charts.",
    },
    {
      code: "excel-viewer-formatting-fidelity-claim",
      pattern:
        /(?<!not )(?<!n't )\b(?:preserves?|renders?|supports?) (?:full|complete|pixel-perfect) (?:formatting )?fidelity\b/i,
      reason: "The table view does not preserve full workbook formatting.",
    },
    {
      code: "excel-viewer-export-claim",
      pattern:
        /(?<!not )(?<!n't )\b(?:exports?|downloads?|saves?) (?:the )?(?:edited |converted )?(?:workbook|spreadsheet|Excel file)\b/i,
      reason: "The current viewer does not export workbooks.",
    },
    {
      code: "excel-viewer-advanced-filter-claim",
      pattern:
        /(?<!not )(?<!n't )\b(?:supports?|offers?|provides?) (?:advanced |multi[- ]condition )?(?:regex|regular-expression) filters?\b/i,
      reason:
        "The current viewer only provides the implemented basic row filter.",
    },
    {
      code: "excel-viewer-multi-sort-claim",
      pattern:
        /(?<!not )(?<!n't )\b(?:supports?|offers?|provides?) (?:hierarchical|multi[- ]column|multi[- ]level) sort(?:ing)?\b/i,
      reason:
        "The current viewer only provides the implemented single-column row sort.",
    },
  ],
  targetSearchIntents: ["excel-viewer.local-workbook-viewing"],
  evidenceTests: [],
});
