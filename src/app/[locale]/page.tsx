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
import HomePageClient from './HomePageClient';

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
