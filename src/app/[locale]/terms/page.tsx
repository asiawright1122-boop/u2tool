import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { SEO_CONFIG, generateAlternates, generateOgImageUrl } from '@/lib/seo';
import TermsPageClient from './TermsPageClient';

/**
 * 生成 Terms 页面的 SEO 元数据
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'terms' });
  
  const title = t('title');
  const description = t('intro');
  
  return {
    title,
    description,
    alternates: generateAlternates(locale, '/terms'),
    openGraph: {
      title: `${title} | ${SEO_CONFIG.siteName}`,
      description,
      url: `/${locale}/terms`,
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
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default function TermsPage() {
  return <TermsPageClient />;
}
