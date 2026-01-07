import { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Link } from '@/i18n/routing';
import { 
  SEO_CONFIG, 
  generateAlternates, 
  generateOgImageUrl,
  generateItemListJsonLd,
  jsonLdToString,
} from '@/lib/seo';
import { tools } from '@/config/tools';

/**
 * 最新发布的工具 slugs（按发布时间倒序，15个）
 */
const NEWEST_TOOLS = [
  'excel-merger',
  'excel-viewer',
  'json-to-excel',
  'excel-to-json',
  'salary-calculator',
  'business-days-calculator',
  'meeting-notes',
  'pomodoro-timer',
  'signature-pad',
  'resume-builder',
  'invoice-generator',
  'color-extractor',
  'exif-viewer',
  'image-to-webp',
  'gif-compressor',
];

/**
 * 热度最高的工具 slugs（按使用量排序，15个）
 */
const HOTTEST_TOOLS = [
  'json-formatter',
  'base64',
  'qr-generator',
  'word-counter',
  'color-converter',
  'timestamp-converter',
  'uuid-generator',
  'password-generator',
  'diff-checker',
  'image-compressor',
  'code-minifier',
  'hash-generator',
  'jwt-decoder',
  'url-encoder',
  'chinese-converter',
];

type RankingType = 'newest' | 'popular';

const RANKING_CONFIG: Record<RankingType, { icon: string; tools: string[] }> = {
  newest: { icon: '🆕', tools: NEWEST_TOOLS },
  popular: { icon: '🔥', tools: HOTTEST_TOOLS },
};

/**
 * 生成静态参数
 */
export function generateStaticParams() {
  return [{ type: 'newest' }, { type: 'popular' }];
}

/**
 * 生成排行榜页面的 SEO 元数据
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; type: string }>;
}): Promise<Metadata> {
  const { locale, type } = await params;
  const t = await getTranslations({ locale });
  
  if (!['newest', 'popular'].includes(type)) {
    return { title: 'Not Found' };
  }
  
  const rankingName = type === 'newest' ? t('nav.newest') : t('nav.hottest');
  const rankingType = type as 'newest' | 'popular';
  const title = t(`ranking_seo.${rankingType}.seo_title`);
  const description = t(`ranking_seo.${rankingType}.seo_description`);
  const config = RANKING_CONFIG[type as RankingType];
  
  return {
    title,
    description,
    alternates: generateAlternates(locale, `/tools/ranking/${type}`),
    openGraph: {
      title: `${title} | ${SEO_CONFIG.siteName}`,
      description,
      url: `/${locale}/tools/ranking/${type}`,
      siteName: SEO_CONFIG.siteName,
      locale,
      type: 'website',
      images: [
        {
          url: generateOgImageUrl({ title: rankingName, locale, icon: config.icon }),
          width: 1200,
          height: 630,
          alt: rankingName,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | ${SEO_CONFIG.siteName}`,
      description,
      images: [generateOgImageUrl({ title: rankingName, locale, icon: config.icon })],
    },
  };
}

/**
 * 排行榜页面组件
 */
export default async function RankingPage({
  params,
}: {
  params: Promise<{ locale: string; type: string }>;
}) {
  const { locale, type } = await params;
  
  if (!['newest', 'popular'].includes(type)) {
    notFound();
  }
  
  setRequestLocale(locale);
  const t = await getTranslations({ locale });
  
  const config = RANKING_CONFIG[type as RankingType];
  const rankingName = type === 'newest' ? t('nav.newest') : t('nav.hottest');
  
  // 获取排行榜工具
  const rankingTools = config.tools
    .map(slug => tools.find(t => t.slug === slug))
    .filter(Boolean);
  
  // 生成 ItemList JSON-LD
  const toolItems = rankingTools.map(tool => ({
    name: t(`tools.${tool!.slug}.name`),
    slug: tool!.slug,
  }));
  const itemListJsonLd = generateItemListJsonLd(toolItems, locale);
  
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdToString(itemListJsonLd) }}
      />
      
      <div className="min-h-screen py-12 px-4 bg-white dark:bg-transparent">
        <div className="max-w-6xl mx-auto">
          {/* 页面标题 */}
          <h1 className="text-4xl font-bold mb-8 flex items-center gap-3 text-gray-900 dark:text-white">
            {type === 'newest' ? (
              <span className="px-3 py-1 text-sm font-bold bg-green-500 text-white rounded">NEW</span>
            ) : (
              <span className="px-3 py-1 text-sm font-bold bg-orange-500 text-white rounded">HOT</span>
            )}
            {rankingName}
          </h1>
          
          {/* 工具网格 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {rankingTools.map((tool) => (
              <Link
                key={tool!.slug}
                href={`/tools/${tool!.slug}`}
                className="tool-card p-4 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-750 hover:border-gray-300 dark:hover:border-gray-600 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{tool!.icon}</span>
                  <div>
                    <h2 className="font-medium text-gray-900 dark:text-white">
                      {t(`tools.${tool!.slug}.name`)}
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                      {t(`tools.${tool!.slug}.description`)}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          
          {/* 返回所有工具链接 */}
          <div className="mt-16 text-center">
            <Link
              href="/tools"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg transition-colors"
            >
              ← {t('nav.viewAllTools')}
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
