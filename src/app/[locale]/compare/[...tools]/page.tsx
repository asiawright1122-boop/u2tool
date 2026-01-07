import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { getToolBySlug, categories } from '@/config/tools';
import Breadcrumb from '@/components/Breadcrumb';
import {
  SEO_CONFIG,
  generateAlternates,
  jsonLdToString,
  generateOrganizationJsonLd,
} from '@/lib/seo';
import {
  generateComparison,
  getComparisonPageData,
  getPopularComparisons,
  type ToolComparison,
} from '@/lib/tool-comparison';
import { loadToolMessages, type SupportedLocale } from '@/lib/translations';

// 生成静态参数（预渲染热门对比页面）
export function generateStaticParams() {
  const params: { locale: string; tools: string[] }[] = [];
  const popularComparisons = getPopularComparisons(20);
  
  for (const locale of routing.locales) {
    for (const comparison of popularComparisons) {
      params.push({ locale, tools: comparison });
    }
  }
  return params;
}

// 允许非预渲染的对比页面按需生成
export const dynamicParams = true;

// 生成 SEO 元数据
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; tools: string[] }>;
}) {
  const { locale, tools: toolSlugs } = await params;
  
  // 验证工具存在
  const validTools = toolSlugs.filter(slug => getToolBySlug(slug));
  if (validTools.length < 2) return {};

  // 加载工具名称
  const toolNames: string[] = [];
  for (const slug of validTools) {
    const toolMessages = await loadToolMessages(locale as SupportedLocale, slug);
    const name = (toolMessages as Record<string, string>).name || slug;
    toolNames.push(name);
  }

  const t = await getTranslations({ locale, namespace: 'compare' });
  
  const title = t('pageTitle', { tools: toolNames.join(' vs ') });
  const description = t('pageDescription', { tools: toolNames.join(', ') });

  // 生成对比页面数据
  const pageData = getComparisonPageData(validTools, locale);

  // 生成组织 JSON-LD
  const organizationJsonLd = generateOrganizationJsonLd(locale);

  // 生成动态 OG 图片 URL
  const ogImageUrl = `${SEO_CONFIG.siteUrl}/api/og?title=${encodeURIComponent(title)}&locale=${locale}`;

  return {
    title,
    description,
    alternates: generateAlternates(locale, `/compare/${validTools.join('/')}`),
    openGraph: {
      title: `${title} | ${SEO_CONFIG.siteName}`,
      description,
      type: 'website',
      url: `/${locale}/compare/${validTools.join('/')}`,
      siteName: SEO_CONFIG.siteName,
      locale,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | ${SEO_CONFIG.siteName}`,
      description,
      site: SEO_CONFIG.twitterHandle,
      images: [ogImageUrl],
    },
    other: {
      'script:ld+json': jsonLdToString([pageData.jsonLd, organizationJsonLd]),
    },
  };
}

// 对比特性行组件
function FeatureRow({
  feature,
  toolSlugs,
}: {
  feature: ToolComparison['features'][0];
  toolSlugs: string[];
}) {
  return (
    <tr className="border-b border-gray-200 dark:border-gray-700">
      <td className="py-3 px-4 font-medium text-gray-900 dark:text-white">
        {feature.description}
      </td>
      {toolSlugs.map(slug => {
        const support = feature.toolSupport[slug];
        return (
          <td key={slug} className="py-3 px-4 text-center">
            {typeof support === 'boolean' ? (
              support ? (
                <span className="text-green-600 dark:text-green-400">✓</span>
              ) : (
                <span className="text-gray-400">-</span>
              )
            ) : (
              <span className="text-gray-700 dark:text-gray-300">{support}</span>
            )}
          </td>
        );
      })}
    </tr>
  );
}

export default async function ComparePage({
  params,
}: {
  params: Promise<{ locale: string; tools: string[] }>;
}) {
  const { locale, tools: toolSlugs } = await params;
  
  // 验证工具存在
  const validTools = toolSlugs.filter(slug => getToolBySlug(slug));
  if (validTools.length < 2) {
    notFound();
  }

  // 设置请求 locale
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'compare' });
  const tNav = await getTranslations({ locale, namespace: 'nav' });
  const tCategories = await getTranslations({ locale, namespace: 'categories' });

  // 加载工具信息
  const toolInfos: Array<{
    slug: string;
    name: string;
    description: string;
    icon: string;
    category: string;
    categoryName: string;
  }> = [];

  for (const slug of validTools) {
    const tool = getToolBySlug(slug);
    if (!tool) continue;
    
    const toolMessages = await loadToolMessages(locale as SupportedLocale, slug);
    const name = (toolMessages as Record<string, string>).name || slug;
    const description = (toolMessages as Record<string, string>).description || '';
    const category = categories.find(c => c.id === tool.category);
    
    toolInfos.push({
      slug,
      name,
      description,
      icon: tool.icon,
      category: tool.category,
      categoryName: tCategories(tool.category),
    });
  }

  // 生成对比数据
  const comparison = generateComparison(validTools);
  const toolNames = toolInfos.map(t => t.name);

  // 生成面包屑导航
  const breadcrumbItems = [
    { name: tNav('home'), path: '/' },
    { name: tNav('tools'), path: '/tools' },
    { name: t('compare') },
  ];

  return (
    <div className="py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* 面包屑导航 */}
        <Breadcrumb
          items={breadcrumbItems}
          locale={locale}
          className="mb-6"
        />

        {/* 页面标题 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
            {toolNames.join(' vs ')}
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            {t('pageDescription', { tools: toolNames.join(', ') })}
          </p>
        </div>

        {/* 工具卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {toolInfos.map(tool => (
            <a
              key={tool.slug}
              href={`/${locale}/tools/${tool.slug}`}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="text-4xl mb-3">{tool.icon}</div>
              <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
                {tool.name}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                {tool.categoryName}
              </p>
              <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2">
                {tool.description}
              </p>
            </a>
          ))}
        </div>

        {/* 特性对比表格 */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm overflow-hidden mb-8">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {t('featureComparison')}
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th className="py-3 px-4 text-left font-semibold text-gray-900 dark:text-white">
                    {t('feature')}
                  </th>
                  {toolInfos.map(tool => (
                    <th
                      key={tool.slug}
                      className="py-3 px-4 text-center font-semibold text-gray-900 dark:text-white"
                    >
                      {tool.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {comparison.features.map((feature, index) => (
                  <FeatureRow
                    key={index}
                    feature={feature}
                    toolSlugs={validTools}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 相似点 */}
        {comparison.similarities.length > 0 && (
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-sm mb-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
              {t('similarities')}
            </h2>
            <ul className="space-y-2">
              {comparison.similarities.map((item, index) => (
                <li
                  key={index}
                  className="flex items-start text-gray-700 dark:text-gray-300"
                >
                  <span className="text-green-600 dark:text-green-400 mr-2">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* 差异点 */}
        {comparison.differences.length > 0 && (
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-sm mb-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
              {t('differences')}
            </h2>
            <ul className="space-y-2">
              {comparison.differences.map((item, index) => (
                <li
                  key={index}
                  className="flex items-start text-gray-700 dark:text-gray-300"
                >
                  <span className="text-blue-600 dark:text-blue-400 mr-2">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* 推荐 */}
        {comparison.recommendation && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 shadow-sm">
            <h2 className="text-2xl font-bold mb-4 text-blue-900 dark:text-blue-100">
              {t('recommendation')}
            </h2>
            <p className="text-blue-800 dark:text-blue-200">
              {comparison.recommendation}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
