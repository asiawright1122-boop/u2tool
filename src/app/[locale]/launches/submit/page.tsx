/**
 * Product Submit Page
 * 产品提交页面
 */

import { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'launches' });
  const baseUrl = 'https://www.u2tool.com';
  const url = `${baseUrl}/${locale}/launches/submit`;

  return {
    title: t('submit.pageTitle'),
    description: t('submit.pageDescription'),
    alternates: {
      canonical: url,
      languages: {
        'en': `${baseUrl}/en/launches/submit`,
        'zh': `${baseUrl}/zh/launches/submit`,
        'ja': `${baseUrl}/ja/launches/submit`,
        'ko': `${baseUrl}/ko/launches/submit`,
        'es': `${baseUrl}/es/launches/submit`,
        'pt': `${baseUrl}/pt/launches/submit`,
        'fr': `${baseUrl}/fr/launches/submit`,
        'de': `${baseUrl}/de/launches/submit`,
        'ru': `${baseUrl}/ru/launches/submit`,
        'ar': `${baseUrl}/ar/launches/submit`,
        'x-default': `${baseUrl}/en/launches/submit`,
      },
    },
    robots: {
      index: false,
      follow: true,
    },
  };
}

export default async function SubmitPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <h1>Submit Page Test</h1>
        <p>Locale: {locale}</p>
      </div>
    </div>
  );
}
