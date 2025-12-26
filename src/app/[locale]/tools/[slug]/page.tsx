import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
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
  getToolKeywords,
  getCategoryKeywords,
  truncateText,
  jsonLdToString,
} from '@/lib/seo';
import { getToolFAQs, generateFAQJsonLd } from '@/lib/faq';

// 生成静态参数（所有工具和语言组合）
export function generateStaticParams() {
  const params: { locale: string; slug: string }[] = [];
  for (const locale of routing.locales) {
    for (const tool of tools) {
      params.push({ locale, slug: tool.slug });
    }
  }
  return params;
}

// 生成 SEO 元数据
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const tool = getToolBySlug(slug);
  if (!tool) return {};

  const t = await getTranslations({ locale, namespace: 'tools' });
  const category = categories.find(c => c.id === tool.category);

  // 获取翻译文本
  const toolName = t(`${slug}.name`);
  const seoTitle = t(`${slug}.seo_title`);
  const seoDescription = t(`${slug}.seo_description`);

  // 确保 title 长度 < 60 字符
  const title = truncateText(seoTitle, SEO_CONFIG.titleMaxLength);
  
  // 确保 description 长度在 120-160 字符之间
  let description = seoDescription;
  if (description.length > SEO_CONFIG.descriptionMaxLength) {
    description = truncateText(description, SEO_CONFIG.descriptionMaxLength);
  }

  // 生成 SoftwareApplication JSON-LD
  const softwareJsonLd = generateSoftwareApplicationJsonLd({
    name: toolName,
    description: seoDescription,
    category: category?.id || 'DeveloperApplication',
    locale,
    slug,
  });

  // 生成 HowTo JSON-LD（工具使用说明）
  const howToSteps = getToolHowToSteps(toolName, locale);
  const howToJsonLd = generateHowToJsonLd({
    name: `How to use ${toolName}`,
    description: seoDescription,
    steps: howToSteps,
    totalTime: 'PT2M', // 预计 2 分钟
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

  // 合并多个 JSON-LD
  const jsonLd = [softwareJsonLd, howToJsonLd, faqJsonLd, speakableJsonLd];

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

  const t = await getTranslations({ locale, namespace: 'tools' });
  const tCategories = await getTranslations({ locale, namespace: 'categories' });
  const tSite = await getTranslations({ locale, namespace: 'site' });

  // 获取工具名称和分类名称
  const toolName = t(`${slug}.name`);
  const categoryName = tCategories(tool.category);
  
  // 获取工具 FAQ（优先使用分类特定 FAQ，回退到通用 FAQ）
  const faqs = getToolFAQs(slug, locale, tool.category);
  
  // 生成面包屑导航项目（首页 > 分类 > 工具名称）
  const breadcrumbItems = [
    { name: tSite('name'), path: '' },
    { name: categoryName, path: `/tools/category/${tool.category}` },
    { name: toolName },
  ];

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* 面包屑导航 */}
        <Breadcrumb 
          items={breadcrumbItems} 
          locale={locale} 
          className="mb-6"
        />

        {/* Tool Header */}
        <div className="text-center mb-8">
          <span className="text-5xl mb-4 block">{tool.icon}</span>
          <h1 className="text-3xl font-bold mb-2">{toolName}</h1>
          <p className="text-gray-300 tool-description">{t(`${slug}.description`)}</p>
        </div>

        {/* Tool Component */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <ToolWrapper slug={slug} />
        </div>

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
