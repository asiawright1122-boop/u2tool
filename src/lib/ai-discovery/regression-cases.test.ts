import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { runDiscoverySearch } from './search-service';
import type { DiscoveryCandidate, DiscoveryDecision } from './types';

interface RegressionCase {
  id: string;
  locale?: string;
  query: string;
  expectedTopSlug?: string;
  expectedAction?: DiscoveryDecision;
  minConfidence?: number;
  maxConfidence?: number;
}

const CASES_PATH = path.join(process.cwd(), 'docs/ai-discovery-regression-cases.json');
const rawCases = fs.readFileSync(CASES_PATH, 'utf-8');
const REGRESSION_CASES = JSON.parse(rawCases) as RegressionCase[];

const EN_REGRESSION_CANDIDATES: DiscoveryCandidate[] = [
  {
    slug: 'json-to-csv',
    name: 'JSON to CSV Converter',
    description: 'Convert JSON payloads to CSV files quickly.',
    seoTitle: 'Free Online JSON to CSV Converter',
    seoDescription: 'Convert JSON data to CSV format online.',
    category: 'converters',
    categoryName: 'Converters',
    aliases: ['json to csv', 'convert json to csv'],
  },
  {
    slug: 'cron-generator',
    name: 'Cron Generator',
    description: 'Build cron expressions for schedules.',
    seoTitle: 'Free Online Cron Generator',
    seoDescription: 'Build cron expressions for recurring schedules.',
    category: 'generators',
    categoryName: 'Generators',
    aliases: ['cron expression', 'crontab'],
  },
  {
    slug: 'choose-text-tool',
    href: '/en/compare/choose-text-tool',
    kind: 'comparison',
    name: 'Choose the Right Text Tool',
    description: 'Compare text metrics, cleanup, diff, and publishing-prep workflows.',
    seoTitle: 'Choose the Right Text Tool',
    seoDescription: 'Choose between word count, text cleanup, comparison, and publishing-prep routes.',
    category: 'comparison',
    categoryName: 'Comparison guide',
    aliases: ['choose text tool', 'word counter vs text cleaner'],
  },
  {
    slug: 'docker-compose-generator',
    name: 'Docker Compose Generator',
    description: 'Generate docker compose file templates.',
    seoTitle: 'Docker Compose Generator',
    seoDescription: 'Generate Docker Compose file templates.',
    category: 'development',
    categoryName: 'Development',
    aliases: ['docker compose', 'compose file'],
  },
  {
    slug: 'meta-tag-generator',
    name: 'Meta Tag Generator',
    description: 'Generate SEO meta tags for web pages.',
    seoTitle: 'SEO Meta Tag Generator',
    seoDescription: 'Generate SEO meta tags for web pages.',
    category: 'generators',
    categoryName: 'Generators',
    aliases: ['meta tags', 'seo title'],
  },
  {
    slug: 'gitignore-generator',
    name: 'Gitignore Generator',
    description: 'Create .gitignore files for common stacks.',
    seoTitle: 'Gitignore Generator',
    seoDescription: 'Create .gitignore files for common stacks.',
    category: 'development',
    categoryName: 'Development',
    aliases: ['gitignore', '.gitignore'],
  },
];

const ZH_REGRESSION_CANDIDATES: DiscoveryCandidate[] = [
  {
    slug: 'jwt-decoder',
    name: 'JWT 调试器',
    description: '调试和验证JWT令牌，支持签名验证',
    seoTitle: '免费在线 JWT 调试器与签名验证工具',
    seoDescription: '使用这款免费在线 JWT 调试器解析令牌结构、检查过期时间并验证签名，适合登录排错、认证调试和接口联调。',
    category: 'security',
    categoryName: '安全工具',
    aliases: ['jwt', '签名验证'],
  },
  {
    slug: 'html-encoder',
    name: 'HTML 编码器/解码器',
    description: '将特殊字符编码为 HTML 实体或将其解码回来。',
    seoTitle: '免费在线 HTML 实体编码解码工具',
    seoDescription: '使用这款免费在线 HTML 实体编码解码工具快速转换特殊字符与 HTML 实体，适合网页开发、XSS 防护和内容清洗。',
    category: 'encoding',
    categoryName: '编码解码',
    aliases: ['html 实体', 'xss 防护'],
  },
  {
    slug: 'sitemap-generator',
    name: '网站地图生成器',
    description: '为您的网站生成XML格式的网站地图。',
    seoTitle: '免费在线网站地图生成器 - 快速生成 XML 网站地图',
    seoDescription: '网站地图生成器可批量生成 XML 网站地图，设置网址优先级、更新频率和最后修改时间，帮助搜索引擎抓取与索引。',
    category: 'generators',
    categoryName: '生成器',
    aliases: ['xml 网站地图', '抓取与索引'],
  },
];

const JA_REGRESSION_CANDIDATES: DiscoveryCandidate[] = [
  {
    slug: 'sitemap-generator',
    name: 'サイトマップ生成ツール',
    description: 'XMLサイトマップを生成して検索エンジンのクロールを支援します。',
    seoTitle: '無料オンラインサイトマップ生成ツール',
    seoDescription: 'XMLサイトマップを生成し、URLの優先度、更新頻度、最終更新日を整理できます。',
    category: 'generators',
    categoryName: '生成ツール',
    aliases: ['xml サイトマップ'],
  },
];

const KO_REGRESSION_CANDIDATES: DiscoveryCandidate[] = [
  {
    slug: 'sitemap-generator',
    name: '사이트맵 생성기',
    description: '검색 엔진 크롤링과 색인을 돕는 XML 사이트맵을 생성합니다.',
    seoTitle: '무료 온라인 사이트맵 생성기',
    seoDescription: 'XML 사이트맵을 만들고 URL 우선순위, 업데이트 빈도, 마지막 수정일을 정리합니다.',
    category: 'generators',
    categoryName: '생성기',
    aliases: ['xml 사이트맵'],
  },
];

function getRegressionCandidates(locale: string): DiscoveryCandidate[] {
  if (locale === 'zh') {
    return ZH_REGRESSION_CANDIDATES;
  }
  if (locale === 'ja') {
    return JA_REGRESSION_CANDIDATES;
  }
  if (locale === 'ko') {
    return KO_REGRESSION_CANDIDATES;
  }
  return EN_REGRESSION_CANDIDATES;
}

describe('ai discovery regression cases', () => {
  it('has at least one regression case', () => {
    expect(REGRESSION_CASES.length).toBeGreaterThan(0);
  });

  for (const regressionCase of REGRESSION_CASES) {
    it(`passes: ${regressionCase.id}`, async () => {
      const result = await runDiscoverySearch({
        locale: regressionCase.locale ?? 'en',
        query: regressionCase.query,
        dependencies: {
          buildIndex: async () => getRegressionCandidates(regressionCase.locale ?? 'en'),
        },
      });

      if (regressionCase.expectedTopSlug) {
        expect(result.matches[0]?.slug).toBe(regressionCase.expectedTopSlug);
      }

      if (regressionCase.expectedAction) {
        expect(result.action).toBe(regressionCase.expectedAction);
      }

      if (typeof regressionCase.minConfidence === 'number') {
        expect(result.confidence).toBeGreaterThanOrEqual(regressionCase.minConfidence);
      }

      if (typeof regressionCase.maxConfidence === 'number') {
        expect(result.confidence).toBeLessThanOrEqual(regressionCase.maxConfidence);
      }
    });
  }
});
