import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

import { locales, type Locale } from '../lib/i18n';

const EXCEL_SLUG = 'excel-viewer';
const messagesRoot = fileURLToPath(new URL('.', import.meta.url));

const localPrivacyPatterns: Record<Locale, RegExp> = {
  en: /browser|never uploaded/iu,
  zh: /浏览器|不会上传/u,
  ja: /ブラウザー|アップロードされません/u,
  ko: /브라우저|업로드되지/u,
  es: /navegador|no se sube/iu,
  pt: /navegador|não é enviado/iu,
  fr: /navigateur|n'est pas téléversé|n’est pas téléversé/iu,
  de: /Browser|nicht hochgeladen/iu,
  ru: /браузер|не загружается/iu,
  ar: /المتصفح|لا يتم رفع/u,
};

const warningPatterns: Record<Locale, RegExp[]> = {
  en: [/macros?.+not executed/isu, /charts?.+not reproduced/isu, /formatting.+not.+reproduced/isu, /formulas?.+not recalculated/isu],
  zh: [/宏.+不.{0,8}执行/us, /图表.+不.{0,8}(?:重现|显示)/us, /格式.+(?:无法|不).{0,12}(?:完整|完全)/us, /公式.+不重新计算/us],
  ja: [/マクロ.+実行されません/us, /グラフ.+再現されません/us, /書式.+完全には再現されない/us, /数式.+再計算されません/us],
  ko: [/매크로.+실행되지/us, /차트.+재현되지/us, /서식.+완전히 재현되지/us, /수식.+다시 계산되지/us],
  es: [/macros?.+no se ejecutan/isu, /gráficos?.+no se reproducen/isu, /formato.+no reproducirse por completo/isu, /fórmulas?.+no se vuelven a calcular/isu],
  pt: [/macros?.+não são executadas/isu, /gráficos?.+não são reproduzidos/isu, /formatação.+não ser totalmente reproduzida/isu, /fórmulas?.+não são recalculadas/isu],
  fr: [/macros?.+ne sont pas exécutées/isu, /graphiques?.+ne sont pas reproduits/isu, /mise en forme.+ne pas être entièrement reproduite/isu, /formules?.+ne sont pas recalculées/isu],
  de: [/Makros?.+nicht ausgeführt/isu, /Diagramme?.+nicht wiedergegeben/isu, /Formatierung.+nicht vollständig wiedergegeben/isu, /Formeln?.+nicht neu berechnet/isu],
  ru: [/макросы?.+не выполняются/isu, /диаграммы?.+не воспроизводятся/isu, /форматирование.+не полностью/isu, /формулы?.+не пересчитываются/isu],
  ar: [/وحدات الماكرو.+لا يتم تنفيذها/su, /المخططات.+لا يتم عرضها/su, /لا يتم عرض.+التنسيق.+بالكامل/su, /الصيغ.+لا تتم إعادة حسابها/su],
};

function readCatalog(relativePath: string): Record<string, unknown> {
  return JSON.parse(
    readFileSync(`${messagesRoot}/${relativePath}`, 'utf8'),
  ) as Record<string, unknown>;
}

function excelEntry(catalog: Record<string, unknown>): Record<string, unknown> {
  const tools = catalog.tools as Record<string, unknown>;
  return tools[EXCEL_SLUG] as Record<string, unknown>;
}

describe('Excel viewer message catalogs', () => {
  it('keeps every root aggregate Excel entry identical to its truthful base entry [capability:excel-viewer:profile:release-readiness]', () => {
    for (const locale of locales) {
      expect(excelEntry(readCatalog(`${locale}.json`)), locale).toEqual(
        excelEntry(readCatalog(`${locale}/base.json`)),
      );
    }
  });

  it('states the 10 MiB local-only and non-executing workbook boundary in every aggregate, base, and split catalog [capability:excel-viewer:profile:release-readiness] [capability:excel-viewer:limit:ten-mib-files] [capability:excel-viewer:limit:local-files-only] [capability:excel-viewer:limit:no-macro-execution] [capability:excel-viewer:limit:no-formula-recalculation] [capability:excel-viewer:limit:no-chart-rendering] [capability:excel-viewer:limit:limited-formatting-fidelity]', () => {
    for (const locale of locales) {
      const catalogs = {
        aggregate: excelEntry(readCatalog(`${locale}.json`)),
        base: excelEntry(readCatalog(`${locale}/base.json`)),
        split: readCatalog(`${locale}/tools/${EXCEL_SLUG}.json`),
      };

      for (const [name, catalog] of Object.entries(catalogs)) {
        const copy = JSON.stringify(catalog);
        expect(copy, `${locale} ${name} 10 MiB`).toMatch(/10\s*MiB/iu);
        expect(copy, `${locale} ${name} local privacy`).toMatch(localPrivacyPatterns[locale]);
        for (const pattern of warningPatterns[locale]) {
          expect(copy, `${locale} ${name} warning ${pattern}`).toMatch(pattern);
        }
        expect(copy, `${locale} ${name} no cloud workflow claims`).not.toMatch(
          /cloud sync|collaboration/iu,
        );
      }
    }
  });

  it('keeps the complete release-blocking Excel UI and capability vocabulary in every catalog', () => {
    const uiKeys = [
      'invalidFileType',
      'fileTooLarge',
      'parseError',
      'readError',
      'localNotice',
      'fileLimit',
      'displayValues',
      'displayFormulas',
      'mergedRanges',
      'downloadCsv',
      'downloadError',
      'warningMacros',
      'warningCharts',
      'warningFormatting',
      'warningFormulas',
    ] as const;
    const capabilityKeys = [
      ['modes', 'localWorkbookViewing'],
      ['inputs', 'xlsWorkbook'],
      ['inputs', 'xlsxWorkbook'],
      ['inputs', 'xlsmWorkbook'],
      ['outputs', 'worksheetDataView'],
      ['outputs', 'selectedSheetCsv'],
      ['features', 'sheetTabs'],
      ['features', 'cellAddresses'],
      ['features', 'formulaToggle'],
      ['features', 'mergedRanges'],
      ['features', 'singleColumnSort'],
      ['features', 'singleColumnFilter'],
      ['features', 'csvDownload'],
      ['limits', 'tenMibFiles'],
      ['limits', 'localFilesOnly'],
      ['limits', 'noMacroExecution'],
      ['limits', 'noFormulaRecalculation'],
      ['limits', 'noChartRendering'],
      ['limits', 'limitedFormattingFidelity'],
    ] as const;

    for (const locale of locales) {
      const aggregate = excelEntry(readCatalog(`${locale}.json`));
      const base = excelEntry(readCatalog(`${locale}/base.json`));
      const split = readCatalog(`${locale}/tools/${EXCEL_SLUG}.json`);

      for (const [name, catalog] of Object.entries({ aggregate, base, split })) {
        const ui = catalog.excelViewer as Record<string, unknown>;
        for (const key of uiKeys) {
          expect(ui?.[key], `${locale} ${name} excelViewer.${key}`).toEqual(expect.any(String));
        }
      }

      const capabilities = split.capabilities as Record<string, Record<string, unknown>>;
      for (const [section, key] of capabilityKeys) {
        expect(
          capabilities?.[section]?.[key],
          `${locale} capabilities.${section}.${key}`,
        ).toEqual(expect.any(String));
      }
    }
  });
});
