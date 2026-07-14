import { locales } from '@/lib/i18n';
import { defineToolCapabilityProfile } from '../define-profile';

const workbookViewEvidence = {
  file: 'src/components/tools/ExcelViewer.test.ts',
  testName:
    'opens a local two-sheet workbook with addresses, cached values, formulas, merges, and no network request [capability:excel-viewer:profile:release-readiness] [capability:excel-viewer:mode:local-workbook-viewing] [capability:excel-viewer:accepted-input:xlsx-workbook] [capability:excel-viewer:produced-output:worksheet-data-view] [capability:excel-viewer:browser-feature:sheet-tabs] [capability:excel-viewer:browser-feature:cell-addresses] [capability:excel-viewer:browser-feature:formula-toggle] [capability:excel-viewer:browser-feature:merged-ranges] [capability:excel-viewer:limit:local-files-only] [capability:excel-viewer:limit:no-formula-recalculation] [capability:excel-viewer:engine:language-support]',
};

const csvEvidence = {
  file: 'src/components/tools/ExcelViewer.test.ts',
  testName:
    'sorts and filters one selected column stably and downloads only the selected sheet CSV [capability:excel-viewer:produced-output:selected-sheet-csv] [capability:excel-viewer:browser-feature:single-column-sort] [capability:excel-viewer:browser-feature:single-column-filter] [capability:excel-viewer:browser-feature:csv-download]',
};

const fileLimitEvidence = {
  file: 'src/components/tools/ExcelViewer.test.ts',
  testName:
    'accepts an exact 10 MiB workbook and rejects 10 MiB plus one byte before parsing [capability:excel-viewer:limit:ten-mib-files]',
};

const workbookFormatEvidence = {
  file: 'src/components/tools/ExcelViewer.test.ts',
  testName:
    'opens XLS and macro-enabled XLSM files while warning that macros, charts, and complex formatting are not executed or reproduced [capability:excel-viewer:accepted-input:xls-workbook] [capability:excel-viewer:accepted-input:xlsm-workbook] [capability:excel-viewer:limit:no-macro-execution] [capability:excel-viewer:limit:no-chart-rendering] [capability:excel-viewer:limit:limited-formatting-fidelity]',
};

const catalogParityEvidence = {
  file: 'src/messages/excel-viewer-catalog.test.ts',
  testName:
    'keeps every root aggregate Excel entry identical to its truthful base entry [capability:excel-viewer:profile:release-readiness]',
};

const catalogSafetyEvidence = {
  file: 'src/messages/excel-viewer-catalog.test.ts',
  testName:
    'states the 10 MiB local-only and non-executing workbook boundary in every aggregate, base, and split catalog [capability:excel-viewer:profile:release-readiness] [capability:excel-viewer:limit:ten-mib-files] [capability:excel-viewer:limit:local-files-only] [capability:excel-viewer:limit:no-macro-execution] [capability:excel-viewer:limit:no-formula-recalculation] [capability:excel-viewer:limit:no-chart-rendering] [capability:excel-viewer:limit:limited-formatting-fidelity]',
};

export const excelViewerCapabilityProfile = defineToolCapabilityProfile({
  slug: 'excel-viewer',
  version: '2.0.0',
  enforcement: 'release-blocking',
  modes: [
    {
      id: 'local-workbook-viewing',
      labelKey: 'tools.excel-viewer.capabilities.modes.localWorkbookViewing',
      runtime: 'browser',
      evidence: workbookViewEvidence,
    },
  ],
  acceptedInputs: [
    {
      id: 'xls-workbook',
      labelKey: 'tools.excel-viewer.capabilities.inputs.xlsWorkbook',
      evidence: workbookFormatEvidence,
    },
    {
      id: 'xlsx-workbook',
      labelKey: 'tools.excel-viewer.capabilities.inputs.xlsxWorkbook',
      evidence: workbookViewEvidence,
    },
    {
      id: 'xlsm-workbook',
      labelKey: 'tools.excel-viewer.capabilities.inputs.xlsmWorkbook',
      evidence: workbookFormatEvidence,
    },
  ],
  producedOutputs: [
    {
      id: 'worksheet-data-view',
      labelKey: 'tools.excel-viewer.capabilities.outputs.worksheetDataView',
      evidence: workbookViewEvidence,
    },
    {
      id: 'selected-sheet-csv',
      labelKey: 'tools.excel-viewer.capabilities.outputs.selectedSheetCsv',
      evidence: csvEvidence,
    },
  ],
  supportedLocales: {
    ui: locales,
    engine: {
      kind: 'language-neutral',
      evidence: workbookViewEvidence,
    },
  },
  browserOnlyFeatures: [
    {
      id: 'sheet-tabs',
      labelKey: 'tools.excel-viewer.capabilities.features.sheetTabs',
      evidence: workbookViewEvidence,
    },
    {
      id: 'cell-addresses',
      labelKey: 'tools.excel-viewer.capabilities.features.cellAddresses',
      evidence: workbookViewEvidence,
    },
    {
      id: 'formula-toggle',
      labelKey: 'tools.excel-viewer.capabilities.features.formulaToggle',
      evidence: workbookViewEvidence,
    },
    {
      id: 'merged-ranges',
      labelKey: 'tools.excel-viewer.capabilities.features.mergedRanges',
      evidence: workbookViewEvidence,
    },
    {
      id: 'single-column-sort',
      labelKey: 'tools.excel-viewer.capabilities.features.singleColumnSort',
      evidence: csvEvidence,
    },
    {
      id: 'single-column-filter',
      labelKey: 'tools.excel-viewer.capabilities.features.singleColumnFilter',
      evidence: csvEvidence,
    },
    {
      id: 'csv-download',
      labelKey: 'tools.excel-viewer.capabilities.features.csvDownload',
      evidence: csvEvidence,
    },
  ],
  optionalServerFeatures: [],
  limits: [
    {
      id: 'ten-mib-files',
      labelKey: 'tools.excel-viewer.capabilities.limits.tenMibFiles',
      evidence: fileLimitEvidence,
    },
    {
      id: 'local-files-only',
      labelKey: 'tools.excel-viewer.capabilities.limits.localFilesOnly',
      evidence: workbookViewEvidence,
    },
    {
      id: 'no-macro-execution',
      labelKey: 'tools.excel-viewer.capabilities.limits.noMacroExecution',
      evidence: workbookFormatEvidence,
    },
    {
      id: 'no-formula-recalculation',
      labelKey: 'tools.excel-viewer.capabilities.limits.noFormulaRecalculation',
      evidence: workbookViewEvidence,
    },
    {
      id: 'no-chart-rendering',
      labelKey: 'tools.excel-viewer.capabilities.limits.noChartRendering',
      evidence: workbookFormatEvidence,
    },
    {
      id: 'limited-formatting-fidelity',
      labelKey: 'tools.excel-viewer.capabilities.limits.limitedFormattingFidelity',
      evidence: workbookFormatEvidence,
    },
  ],
  forbiddenClaims: [
    {
      code: 'excel-viewer-macro-claim',
      pattern:
        /(?<!not )(?<!never )(?<!n't )\b(?:runs?|executes?|supports?) (?:Excel )?macros?\b/i,
      reason: 'The viewer detects macro metadata but never executes workbook macros.',
    },
    {
      code: 'excel-viewer-formula-recalculation-claim',
      pattern:
        /(?<!not )(?<!never )(?<!n't )\b(?:recalculates?|evaluates?) (?:Excel )?formulas?\b/i,
      reason: 'The viewer displays formula text and cached values without recalculation.',
    },
    {
      code: 'excel-viewer-chart-claim',
      pattern:
        /(?<!not )(?<!n't )\b(?:renders?|displays?|supports?) (?:Excel |workbook )?charts?\b/i,
      reason: 'The worksheet data view does not reproduce workbook charts.',
    },
    {
      code: 'excel-viewer-formatting-fidelity-claim',
      pattern:
        /(?<!not )(?<!n't )\b(?:preserves?|renders?|supports?) (?:full|complete|pixel-perfect) (?:workbook )?(?:formatting )?fidelity\b/i,
      reason: 'The data view does not preserve full workbook formatting.',
    },
    {
      code: 'excel-viewer-export-claim',
      pattern:
        /(?<!not )(?<!n't )\b(?:exports?|downloads?|saves?) (?:the )?(?:edited |converted )?(?:workbook|spreadsheet|Excel file)\b/i,
      reason: 'The viewer exports selected-sheet CSV data, not an Excel workbook.',
    },
    {
      code: 'excel-viewer-advanced-filter-claim',
      pattern:
        /(?<!not )(?<!n't )\b(?:supports?|offers?|provides?) (?:advanced |multi[- ]condition )?(?:regex|regular-expression) filters?\b/i,
      reason: 'The viewer provides one case-insensitive text filter at a time.',
    },
    {
      code: 'excel-viewer-multi-sort-claim',
      pattern:
        /(?<!not )(?<!n't )\b(?:supports?|offers?|provides?) (?:hierarchical|multi[- ]column|multi[- ]level) sort(?:ing)?\b/i,
      reason: 'The viewer provides stable single-column sorting.',
    },
  ],
  targetSearchIntents: [
    'excel-viewer.local-workbook-viewing',
    'excel-viewer.selected-sheet-csv-export',
  ],
  evidenceTests: [
    workbookViewEvidence,
    catalogParityEvidence,
    catalogSafetyEvidence,
  ],
});
