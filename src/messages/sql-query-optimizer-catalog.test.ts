import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

import { locales, type Locale } from '../lib/i18n';

const SQL_SLUG = 'sql-query-optimizer';
const messagesRoot = fileURLToPath(new URL('.', import.meta.url));

const englishDiagnosticPatterns: Record<Locale, RegExp> = {
  en: /English/i,
  zh: /英语|英文/u,
  ja: /英語/u,
  ko: /영어/u,
  es: /inglés/iu,
  pt: /inglês/iu,
  fr: /anglais/iu,
  de: /Englisch/iu,
  ru: /англий/iu,
  ar: /الإنجليزية|الإنجليزي/u,
};

const localSafetyPatterns: Record<Locale, RegExp> = {
  en: /does not connect.+does not execute|does not connect.+execute SQL/iu,
  zh: /不连接.{0,24}不执行/u,
  ja: /接続しません.{0,30}実行しません/u,
  ko: /연결하지.{0,30}실행하지/u,
  es: /no se conecta.{0,40}no ejecuta/iu,
  pt: /não se conecta.{0,40}não executa/iu,
  fr: /ne se connecte.{0,40}n[’']exécute/iu,
  de: /verbindet sich nicht.{0,50}führt.+nicht aus/iu,
  ru: /не подключается.{0,40}не выполняет/iu,
  ar: /لا تتصل.{0,40}لا تنفذ/u,
};

function readCatalog(relativePath: string): Record<string, unknown> {
  return JSON.parse(
    readFileSync(`${messagesRoot}/${relativePath}`, 'utf8'),
  ) as Record<string, unknown>;
}

function sqlEntry(catalog: Record<string, unknown>): Record<string, unknown> {
  const tools = catalog.tools as Record<string, unknown>;
  return tools[SQL_SLUG] as Record<string, unknown>;
}

describe('SQL query optimizer message catalogs', () => {
  it('keeps every root aggregate SQL entry identical to its truthful base entry [capability:sql-query-optimizer:profile:release-readiness]', () => {
    for (const locale of locales) {
      expect(sqlEntry(readCatalog(`${locale}.json`)), locale).toEqual(
        sqlEntry(readCatalog(`${locale}/base.json`)),
      );
    }
  });

  it('states the English-diagnostic boundary in every aggregate, base, and split SQL catalog [capability:sql-query-optimizer:profile:release-readiness] [capability:sql-query-optimizer:engine:language-support] [capability:sql-query-optimizer:limit:english-diagnostics]', () => {
    for (const locale of locales) {
      const aggregate = sqlEntry(readCatalog(`${locale}.json`));
      const base = sqlEntry(readCatalog(`${locale}/base.json`));
      const split = readCatalog(`${locale}/tools/${SQL_SLUG}.json`);
      const pattern = englishDiagnosticPatterns[locale];

      for (const [name, catalog] of Object.entries({ aggregate, base, split })) {
        expect(
          String(catalog.diagnosticsLanguageNotice),
          `${locale} ${name} diagnostics language`,
        ).toMatch(pattern);
      }
      expect(split.diagnosticsLanguageNotice).toBe(
        base.diagnosticsLanguageNotice,
      );
    }
  });

  it('keeps local-only safety copy and the full release-blocking capability vocabulary in all catalogs [capability:sql-query-optimizer:profile:release-readiness] [capability:sql-query-optimizer:limit:no-database-connection] [capability:sql-query-optimizer:limit:no-query-execution] [capability:sql-query-optimizer:limit:no-automatic-rewrite] [capability:sql-query-optimizer:limit:unverified-indexes] [capability:sql-query-optimizer:limit:no-speed-guarantee]', () => {
    const capabilityKeys = [
      ['modes', 'localStaticAnalysis'],
      ['modes', 'pastedExplainAnalysis'],
      ['inputs', 'sqlText'],
      ['inputs', 'sqlDialect'],
      ['inputs', 'explainText'],
      ['outputs', 'analysisScore'],
      ['outputs', 'formattedSql'],
      ['outputs', 'diagnosticFindings'],
      ['outputs', 'indexCandidates'],
      ['outputs', 'explainFindings'],
      ['features', 'dialectSelector'],
      ['features', 'staticHeuristics'],
      ['features', 'sqlFormatting'],
      ['features', 'compositeIndexCandidates'],
      ['features', 'explainTokenAnalysis'],
      ['features', 'copyControls'],
      ['limits', 'englishDiagnostics'],
      ['limits', 'noDatabaseConnection'],
      ['limits', 'noQueryExecution'],
      ['limits', 'noAutomaticRewrite'],
      ['limits', 'unverifiedIndexes'],
      ['limits', 'noSpeedGuarantee'],
    ] as const;

    for (const locale of locales) {
      const aggregate = sqlEntry(readCatalog(`${locale}.json`));
      const base = sqlEntry(readCatalog(`${locale}/base.json`));
      const split = readCatalog(`${locale}/tools/${SQL_SLUG}.json`);

      for (const [name, catalog] of Object.entries({ aggregate, base, split })) {
        expect(String(catalog.localSafety), `${locale} ${name} safety`).toMatch(
          localSafetyPatterns[locale],
        );
        expect(JSON.stringify(catalog), `${locale} ${name} no server assist`).not.toMatch(
          /AI assist|server assist|Workers AI|Cloudflare AI/iu,
        );
        expect(
          String(catalog.copyFailed),
          `${locale} ${name} localized clipboard failure`,
        ).not.toMatch(/^$|^undefined$/);
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
