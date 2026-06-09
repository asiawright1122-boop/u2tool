import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { tools } from '@/config/tools';
import { getCategorySupportContent, phaseSixPriorityClusters } from './category-support';
import { phaseEightPriorityClusters } from './category-support-phase8';
import { phaseElevenPriorityClusters } from './category-support-phase11';
import { phaseTwentyPriorityClusters } from './category-support-phase20';
import { phaseThirtyFourPriorityClusters } from './category-support-phase34';
import { v13PriorityClusters } from './category-support-v13';

const allPriorityClusters = [
  ...phaseSixPriorityClusters,
  ...phaseEightPriorityClusters,
  ...phaseElevenPriorityClusters,
  ...phaseTwentyPriorityClusters,
  ...phaseThirtyFourPriorityClusters,
  ...v13PriorityClusters,
];

function isMergeableRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function mergeMessageRecords(
  base: Record<string, any>,
  override: Record<string, any>
): Record<string, any> {
  const merged = { ...base };

  for (const [key, value] of Object.entries(override)) {
    const baseValue = merged[key];
    if (isMergeableRecord(baseValue) && isMergeableRecord(value)) {
      merged[key] = mergeMessageRecords(baseValue, value);
      continue;
    }

    merged[key] = value;
  }

  return merged;
}

const localeCache = new Map<string, Record<string, any>>();

function loadMergedLocaleMessages(locale: string): Record<string, any> {
  if (localeCache.has(locale)) {
    return localeCache.get(locale)!;
  }
  const basePath = path.join(process.cwd(), 'src/messages', locale, 'base.json');
  const rootPath = path.join(process.cwd(), 'src/messages', `${locale}.json`);
  const baseMessages = fs.existsSync(basePath)
    ? (JSON.parse(fs.readFileSync(basePath, 'utf8')) as Record<string, any>)
    : {};
  const rootMessages = fs.existsSync(rootPath)
    ? (JSON.parse(fs.readFileSync(rootPath, 'utf8')) as Record<string, any>)
    : {};

  const merged = mergeMessageRecords(baseMessages, rootMessages);
  localeCache.set(locale, merged);
  return merged;
}

describe('category support governance', () => {
  it('covers every priority cluster with reusable support content', () => {
    for (const cluster of allPriorityClusters) {
      const content = getCategorySupportContent(cluster.locale, cluster.category);
      expect(content, `${cluster.locale}/${cluster.category}`).not.toBeNull();
      expect(content?.highlights.length).toBeGreaterThanOrEqual(3);
      expect(content?.workflows.length).toBeGreaterThanOrEqual(3);
    }
  });

  it('only references tools that belong to the intended category', () => {
    for (const cluster of allPriorityClusters) {
      const content = getCategorySupportContent(cluster.locale, cluster.category);
      expect(content, `${cluster.locale}/${cluster.category}`).not.toBeNull();

      for (const workflow of content?.workflows ?? []) {
        for (const slug of workflow.toolSlugs) {
          const tool = tools.find((candidate) => candidate.slug === slug);
          expect(tool, `${cluster.locale}/${cluster.category}:${slug}`).toBeTruthy();
          expect(tool?.category, `${cluster.locale}/${cluster.category}:${slug}`).toBe(cluster.category);
        }
      }
    }
  });

  it('keeps selected long-tail category SEO copy pinned to concrete intents', () => {
    const expectations: Record<string, string[]> = {
      'ar/finance': ['العملات', 'roi', 'الفواتير', 'الميزانية'],
      'ar/network': ['dns', 'ssl', 'ip'],
      'de/charts': ['balken', 'heatmap', 'gantt', 'sankey'],
      'de/converters': ['json', 'pdf', 'timezone'],
      'de/development': ['regex', 'json', 'api'],
      'de/finance': ['roi', 'rechnungen', 'budget'],
      'de/image': ['komprimieren', 'konvertieren', 'qr'],
      'de/network': ['dns', 'ssl', 'ip'],
      'de/office': ['pdf', 'lebenslauf', 'meetings'],
      'de/security': ['passwort', 'jwt', 'hmac', 'checksum'],
      'en/charts': ['bar', 'heatmap', 'gantt', 'sankey'],
      'en/encoding': ['json', 'base64', 'hex', 'html'],
      'en/finance': ['currency', 'loan', 'roi', 'tax'],
      'en/generators': ['uuid', 'lorem', 'cron', 'qr'],
      'en/lifestyle': ['calorie', 'sleep', 'water', 'health'],
      'en/security': ['password', 'jwt', 'hmac', 'checksum'],
      'en/text': ['word', 'case', 'line', 'text'],
      'es/charts': ['barras', 'heatmap', 'gantt', 'sankey'],
      'es/converters': ['json', 'pdf', 'unidades'],
      'es/development': ['regex', 'json', 'api'],
      'es/finance': ['divisas', 'roi', 'facturas'],
      'es/image': ['comprimir', 'convertir', 'qr'],
      'es/security': ['contrasenas', 'jwt', 'hmac', 'checksum'],
      'es/text': ['palabras', 'mayúsculas', 'líneas', 'texto'],
      'es/office': ['pdf', 'cv', 'excel'],
      'ja/charts': ['棒グラフ', 'ヒートマップ', 'ガント', 'sankey'],
      'ja/text': ['文字数', '大文字小文字', '行数', 'テキスト'],
      'fr/development': ['regex', 'json', 'api'],
      'fr/finance': ['devises', 'roi', 'factures'],
      'fr/network': ['dns', 'ssl', 'ip'],
      'fr/office': ['pdf', 'cv', 'reunions'],
      'ja/converters': ['json', 'pdf', '単位'],
      'ja/image': ['画像圧縮', 'qr', 'svg'],
      'ja/office': ['pdf', '履歴書', 'excel'],
      'ja/security': ['パスワード', 'jwt', 'hmac', 'チェックサム'],
      'ko/charts': ['막대', '히트맵', '간트', 'sankey'],
      'ko/converters': ['json', 'pdf', '단위'],
      'ko/image': ['압축', '변환', 'qr'],
      'ko/security': ['비밀번호', 'jwt', 'hmac', '체크섬'],
      'ko/text': ['글자 수', '대소문자', '줄 수', '텍스트'],
      'pt/finance': ['cambio', 'roi', 'faturas'],
      'pt/network': ['dns', 'ssl', 'ip'],
      'pt/office': ['pdf', 'curriculo', 'planilhas'],
      'ru/encoding': ['json', 'base64', 'hex', 'html'],
      'zh/charts': ['柱状图', '热力图', '甘特', 'sankey'],
      'zh/security': ['密码', 'jwt', 'hmac', '校验'],
      'zh/text': ['字数', '大小写', '行数', '文本'],
      'de/text': ['wortzähler', 'groß', 'zeilenzähler', 'text'],
    };

    for (const [cluster, keywords] of Object.entries(expectations)) {
      const [locale, category] = cluster.split('/');
      const messages = loadMergedLocaleMessages(locale);
      const seo = messages.categories_seo?.[category] ?? {};
      const combined = `${seo.seo_title || ''} ${seo.seo_description || ''}`.toLowerCase();

      for (const keyword of keywords) {
        expect(combined, `${cluster}:${keyword}`).toContain(keyword.toLowerCase());
      }
    }
  });
}, 15000);
