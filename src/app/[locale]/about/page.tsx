import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { 
  SEO_CONFIG, 
  generateAlternates, 
  generateOgImageUrl,
  jsonLdToString,
  type ExtendedJsonLdData,
} from '@/lib/seo';
import {
  generateEnhancedOrganizationJsonLd,
  getOrganizationInfo,
  getTrustSignals,
} from '@/lib/eeat';
import AboutPageClient from './AboutPageClient';

/**
 * 生成 About 页面的 SEO 元数据
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'about' });
  
  const title = t('title');
  const description = t('intro');
  
  return {
    title,
    description,
    alternates: generateAlternates(locale, '/about'),
    openGraph: {
      title: `${title} | ${SEO_CONFIG.siteName}`,
      description,
      url: `/${locale}/about`,
      siteName: SEO_CONFIG.siteName,
      locale,
      type: 'website',
      images: [
        {
          url: generateOgImageUrl({ title, locale }),
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
      images: [generateOgImageUrl({ title, locale })],
    },
  };
}

/**
 * About 页面（服务端组件）
 * 包含增强的 Organization JSON-LD 结构化数据和信任信号
 */
export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  
  // 获取组织信息和信任信号
  const organizationInfo = getOrganizationInfo();
  const trustSignals = getTrustSignals(locale);
  
  // 生成增强的 Organization JSON-LD
  const organizationJsonLd = generateEnhancedOrganizationJsonLd(organizationInfo, locale);
  
  return (
    <>
      {/* Organization JSON-LD 结构化数据 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdToString(organizationJsonLd as ExtendedJsonLdData) }}
      />
      <AboutPageClient trustSignals={trustSignals} />
    </>
  );
}
