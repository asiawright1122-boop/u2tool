import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { tools, getToolBySlug, categories } from '@/config/tools';
import { routing } from '@/i18n/routing';
import ToolWrapper from '@/components/tools/ToolWrapper';
import Breadcrumb from '@/components/Breadcrumb';
import RelatedTools from '@/components/RelatedTools';
import ToolFAQ from '@/components/ToolFAQ';
import {
  SEO_CONFIG,
  generateAlternates,
  generateSoftwareApplicationJsonLd,
  generateHowToJsonLd,
  generateSpeakableJsonLd,
  getToolHowToSteps,
  getToolHowToTotalTime,
  getToolKeywords,
  getCategoryKeywords,
  truncateText,
  jsonLdToString,
  generateOrganizationJsonLd,
  type ExtendedJsonLdData,
} from '@/lib/seo';
import { getToolFAQs, generateFAQJsonLd } from '@/lib/faq';
import { loadToolMessages, type SupportedLocale } from '@/lib/translations';
import {
  getToolAuthor,
  generateExpertJsonLd,
} from '@/lib/eeat';
import { getToolMetadata } from '@/config/tool-metadata';
import { extendTitle } from '@/lib/seo-title';

// 生成静态参数（仅预渲染热门工具，减少构建日志大小）
// 非热门工具将在首次访问时按需生成并缓存
// @see https://vercel.link/build-log-size-limit
export function generateStaticParams() {
  const params: { locale: string; slug: string }[] = [];
  // 仅预渲染热门工具，减少构建时间和日志大小
  // 其他工具将通过 dynamicParams = true 按需生成
  const popularTools = tools.filter(t => t.popular);
  for (const locale of routing.locales) {
    for (const tool of popularTools) {
      params.push({ locale, slug: tool.slug });
    }
  }
  return params;
}

// 允许非预渲染的工具页面按需生成
export const dynamicParams = true;

// 生成 SEO 元数据
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const tool = getToolBySlug(slug);
  if (!tool) return {};

  const category = categories.find(c => c.id === tool.category);

  // 加载工具特定翻译
  const toolMessages = await loadToolMessages(locale as SupportedLocale, slug);
  
  // 获取翻译文本（直接从工具翻译中获取）
  const toolName = (toolMessages as Record<string, string>).name || slug;
  const toolDescription = (toolMessages as Record<string, string>).description || '';
  
  // 获取翻译文件中的 SEO 数据
  const rawSeoTitle = (toolMessages as Record<string, string>).seo_title;
  const rawSeoDescription = (toolMessages as Record<string, string>).seo_description;
  
  // SEO 标题模板（仅在翻译文件中没有 seo_title 时使用）
  const seoTitleTemplates: Record<string, string> = {
    en: `Free ${toolName} Online | U2Tool`,
    zh: `${toolName} - 免费在线工具 | U2Tool`,
    ja: `${toolName} - 無料オンラインツール | U2Tool`,
    ko: `${toolName} - 무료 온라인 도구 | U2Tool`,
    es: `${toolName} Gratis Online | U2Tool`,
    pt: `${toolName} Grátis Online | U2Tool`,
    fr: `${toolName} Gratuit en Ligne | U2Tool`,
    de: `${toolName} Kostenlos Online | U2Tool`,
    ru: `${toolName} - Бесплатный Онлайн | U2Tool`,
    ar: `${toolName} - أداة مجانية عبر الإنترنت | U2Tool`,
  };
  
  // SEO 描述模板（仅在翻译文件中没有 seo_description 时使用）
  const seoDescTemplates: Record<string, string> = {
    en: `Use ${toolName} online for free. ${toolDescription} No registration required, instant results in your browser.`,
    zh: `免费在线使用${toolName}。${toolDescription} 无需注册，浏览器即时获取结果。`,
    ja: `${toolName}を無料でオンライン使用。${toolDescription} 登録不要、ブラウザで即座に結果を取得。`,
    ko: `${toolName}을(를) 무료로 온라인에서 사용하세요. ${toolDescription} 등록 불필요, 브라우저에서 즉시 결과 확인.`,
    es: `Use ${toolName} en línea gratis. ${toolDescription} Sin registro, resultados instantáneos en su navegador.`,
    pt: `Use ${toolName} online gratuitamente. ${toolDescription} Sem registro, resultados instantâneos no navegador.`,
    fr: `Utilisez ${toolName} en ligne gratuitement. ${toolDescription} Sans inscription, résultats instantanés.`,
    de: `Verwenden Sie ${toolName} kostenlos online. ${toolDescription} Keine Registrierung, sofortige Ergebnisse.`,
    ru: `Используйте ${toolName} онлайн бесплатно. ${toolDescription} Без регистрации, мгновенные результаты.`,
    ar: `استخدم ${toolName} مجانًا عبر الإنترنت. ${toolDescription} بدون تسجيل، نتائج فورية.`,
  };
  
  // 直接使用翻译文件中的 SEO 数据，仅在缺失时回退到模板
  // 注意：不再使用 ASCII 字符检测，因为拉丁语系语言（es, pt, fr, de）的翻译也是有效的
  const seoTitle = rawSeoTitle || (seoTitleTemplates[locale] || seoTitleTemplates.en);
  const seoDescription = rawSeoDescription || (seoDescTemplates[locale] || seoDescTemplates.en);

  // 使用 extendTitle 确保标题长度在 50-60 字符之间
  const extendedTitleResult = extendTitle(seoTitle, locale);
  
  // 确保 title 长度在目标范围内（50-60 字符）
  // extendTitle 已经处理了长度约束，但仍需确保不超过 SEO 最大长度
  const title = extendedTitleResult.finalLength <= SEO_CONFIG.titleMaxLength 
    ? extendedTitleResult.extended 
    : truncateText(extendedTitleResult.extended, SEO_CONFIG.titleMaxLength);

  // 确保 description 长度在 120-160 字符之间
  let description = seoDescription;
  if (description.length > SEO_CONFIG.descriptionMaxLength) {
    description = truncateText(description, SEO_CONFIG.descriptionMaxLength);
  }

  // 获取工具元数据（发布日期、版本、功能列表等）
  const toolMetadata = getToolMetadata(slug);
  
  // 获取作者信息
  const author = getToolAuthor(slug);

  // 生成 SoftwareApplication JSON-LD（增强版）
  const softwareJsonLd = generateSoftwareApplicationJsonLd({
    name: toolName,
    description: seoDescription,
    category: category?.id || 'DeveloperApplication',
    locale,
    slug,
    datePublished: toolMetadata.datePublished,
    dateModified: toolMetadata.dateModified,
    softwareVersion: toolMetadata.softwareVersion,
    featureList: toolMetadata.featureList,
    author: {
      name: author.name,
      url: SEO_CONFIG.siteUrl,
      type: 'Organization',
    },
  });

  // 生成 HowTo JSON-LD（工具使用说明）
  const howToSteps = getToolHowToSteps(toolName, locale, slug);
  const howToTotalTime = getToolHowToTotalTime(slug);
  const howToJsonLd = generateHowToJsonLd({
    name: `How to use ${toolName}`,
    description: seoDescription,
    steps: howToSteps,
    totalTime: howToTotalTime,
  });

  // 生成 FAQ JSON-LD（常见问题）
  const faqs = getToolFAQs(slug, locale, category?.id);
  const faqJsonLd = generateFAQJsonLd(faqs);

  // 生成 Speakable JSON-LD（语音搜索优化）
  const speakableJsonLd = generateSpeakableJsonLd({
    name: toolName,
    description: seoDescription,
    locale,
    path: `/tools/${slug}`,
    cssSelectors: ['h1', '.tool-description', '.faq-answer'],
  });

  // 生成作者/专家 JSON-LD（E-E-A-T 信号）
  const authorJsonLd = generateExpertJsonLd(author);

  // 生成组织 JSON-LD
  const organizationJsonLd = generateOrganizationJsonLd(locale);

  // 合并多个 JSON-LD
  const jsonLd: ExtendedJsonLdData[] = [softwareJsonLd, howToJsonLd, faqJsonLd, speakableJsonLd, authorJsonLd, organizationJsonLd];

  // 生成动态 OG 图片 URL
  const ogImageUrl = `${SEO_CONFIG.siteUrl}/api/og?title=${encodeURIComponent(toolName)}&locale=${locale}&icon=${encodeURIComponent(tool.icon)}`;

  // 获取工具特定关键词，回退到分类关键词
  const toolKeywords = getToolKeywords(slug, locale);
  const categoryKeywords = getCategoryKeywords(category?.id || '', locale);
  // 合并关键词：工具关键词 + 分类关键词（去重）
  const keywords = toolKeywords.length > 0
    ? [...new Set([...toolKeywords, ...categoryKeywords.slice(0, 3)])]
    : [...categoryKeywords, toolName, 'online tool', 'free'];

  return {
    title,
    description,
    keywords,
    // hreflang alternates
    alternates: generateAlternates(locale, `/tools/${slug}`),
    // Open Graph 标签
    openGraph: {
      title: `${title} | ${SEO_CONFIG.siteName}`,
      description,
      type: 'website',
      url: `/${locale}/tools/${slug}`,
      siteName: SEO_CONFIG.siteName,
      locale,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: toolName,
        },
      ],
    },
    // Twitter Card 标签
    twitter: {
      card: 'summary_large_image',
      title: `${title} | ${SEO_CONFIG.siteName}`,
      description,
      site: SEO_CONFIG.twitterHandle,
      images: [ogImageUrl],
    },
    other: {
      'script:ld+json': jsonLdToString(jsonLd),
    },
  };
}

export default async function ToolPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const tool = getToolBySlug(slug);
  if (!tool) {
    notFound();
  }

  // 设置请求 locale
  setRequestLocale(locale);

  // 加载工具特定翻译
  const toolMessages = await loadToolMessages(locale as SupportedLocale, slug);
  const toolData = toolMessages as Record<string, unknown>;

  const tCategories = await getTranslations({ locale, namespace: 'categories' });
  const tNav = await getTranslations({ locale, namespace: 'nav' });
  const tCommon = await getTranslations({ locale });

  // 获取工具名称和分类名称
  const toolName = (toolData.name as string) || slug;
  const toolDescription = (toolData.description as string) || '';
  const detailedDescription = (toolData.detailed_description as string) || '';
  const usageSteps = toolData.usage_steps as string[] | undefined;
  const usageExamples = toolData.usage_examples as string[] | undefined;
  const categoryName = tCategories(tool.category);

  // 获取工具 FAQ（优先使用分类特定 FAQ，回退到通用 FAQ）
  const faqs = getToolFAQs(slug, locale, tool.category);

  // 生成面包屑导航项目（首页 > 分类 > 工具名称）
  const breadcrumbItems = [
    { name: tNav('home'), path: '/' },
    { name: categoryName, path: `/tools/category/${tool.category}` },
    { name: toolName },
  ];

  return (
    <div className="py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* 面包屑导航 */}
        <Breadcrumb
          items={breadcrumbItems}
          locale={locale}
          className="mb-6"
        />

        {/* Tool Header */}
        <div className="text-center mb-8">
          {/* 工具图标容器 - 固定尺寸防止 CLS */}
          <div className="tool-icon-container mx-auto mb-4">
            <span 
              className="text-5xl"
              aria-label={toolName}
              role="img"
            >
              {tool.icon}
            </span>
          </div>
          <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">{toolName}</h1>
          <p className="text-gray-600 dark:text-gray-300 tool-description">{toolDescription}</p>
        </div>

        {/* 详细描述 */}
        {detailedDescription && (
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 mb-6 shadow-sm">
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">{tCommon('tools.toolIntroduction')}</h2>
            <div 
              className="text-gray-700 dark:text-gray-300 leading-relaxed tool-detailed-description"
              dangerouslySetInnerHTML={{ 
                __html: detailedDescription.replace(/\n/g, '<br />')
              }}
            />
          </div>
        )}

        {/* Tool Component */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-sm mb-6">
          <ToolWrapper slug={slug} />
        </div>

        {/* 使用说明 */}
        {(usageSteps || usageExamples) && (
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 mb-6 shadow-sm">
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">{tCommon('tools.usageInstructions')}</h2>
            
            {usageSteps && Array.isArray(usageSteps) && (
              <>
                <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">{tCommon('tools.usageSteps')}</h3>
                <ol className="list-decimal list-inside space-y-2 mb-6">
                  {usageSteps.map((step: string, i: number) => (
                    <li key={i} className="text-gray-700 dark:text-gray-300">{step}</li>
                  ))}
                </ol>
              </>
            )}
            
            {usageExamples && Array.isArray(usageExamples) && (
              <>
                <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">{tCommon('tools.usageExamples')}</h3>
                <div className="space-y-3">
                  {usageExamples.map((example: string, i: number) => (
                    <div key={i} className="bg-gray-100 dark:bg-gray-900 p-3 rounded border border-gray-200 dark:border-gray-700">
                      <code className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap break-words">{example}</code>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* FAQ 区块 */}
        <ToolFAQ
          faqs={faqs}
          toolName={toolName}
        />

        {/* 相关工具 */}
        <RelatedTools
          currentSlug={slug}
          category={tool.category}
          maxCount={6}
        />
      </div>
    </div>
  );
}
