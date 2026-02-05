import { getTranslations } from 'next-intl/server';
import {
  SEO_CONFIG,
  generateAlternates,
  generateWebSiteJsonLd,
  generateOrganizationJsonLd,
  generateFAQJsonLd,
  getKeywords,
  getHomepageFAQs,
  jsonLdToString
} from '@/lib/seo';
import { routing } from '@/i18n/routing';
import HomePageClient from './HomePageClient';

/**
 * ISR 配置 - 30 天重新验证
 * 
 * 首页内容相对稳定，设置 30 天的 revalidate 时间
 * 
 * @see Requirements 1.3 - 优化 ISR 配置减少 Fast Origin Transfer
 */
export const revalidate = 2592000; // 30 天 = 30 * 24 * 60 * 60

/**
 * 生成静态参数，为每个语言生成首页
 * 
 * 预生成所有 10 种语言的首页
 * 
 * @see Requirements 2.3 - 增加静态生成页面数量
 */
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'site' });

  const title = t('tagline');
  const description = t('description');
  const keywords = getKeywords(locale);

  return {
    title,
    description,
    // 关键词（针对百度等搜索引擎）
    keywords: keywords.join(', '),
    // Open Graph 标签
    openGraph: {
      title: `${title} | ${SEO_CONFIG.siteName}`,
      description,
      url: `/${locale}`,
      siteName: SEO_CONFIG.siteName,
      locale: locale,
      type: 'website',
      images: [
        {
          url: `${SEO_CONFIG.siteUrl}/api/og?title=${encodeURIComponent(SEO_CONFIG.siteName)}&locale=${locale}`,
          width: 1200,
          height: 630,
          alt: SEO_CONFIG.siteName,
        },
      ],
    },
    // Twitter Card 标签
    twitter: {
      card: 'summary_large_image',
      title: `${title} | ${SEO_CONFIG.siteName}`,
      description,
      site: SEO_CONFIG.twitterHandle,
      images: [`${SEO_CONFIG.siteUrl}/api/og?title=${encodeURIComponent(SEO_CONFIG.siteName)}&locale=${locale}`],
    },
    // hreflang alternates
    alternates: generateAlternates(locale, ''),
  };
}

// WebSite + Organization + FAQ JSON-LD 结构化数据组件
function StructuredData({ locale }: { locale: string }) {
  const webSiteJsonLd = generateWebSiteJsonLd(locale);
  const organizationJsonLd = generateOrganizationJsonLd(locale);
  const faqs = getHomepageFAQs(locale);
  const faqJsonLd = generateFAQJsonLd(faqs);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdToString(webSiteJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdToString(organizationJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdToString(faqJsonLd) }}
      />
    </>
  );
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <>
      {/* WebSite + Organization JSON-LD 结构化数据 */}
      <StructuredData locale={locale} />
      
      {/* 客户端首页组件 */}
      <HomePageClient />
    </>
  );
}
