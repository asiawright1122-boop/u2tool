import { getTranslations } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { tools } from '@/config/tools';
import ScrollToTop from '@/components/ScrollToTop';
import { SEO_CONFIG } from '@/lib/seo';

// 工具列表页的 SEO 元数据
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'site' });
  const baseUrl = SEO_CONFIG.siteUrl;

  return {
    title: `All ${tools.length}+ Developer Tools | ToolBox`,
    description: t('description'),
    alternates: {
      canonical: `${baseUrl}/${locale}/tools`,
      languages: Object.fromEntries(
        routing.locales.map((l) => [l, `${baseUrl}/${l}/tools`])
      ),
    },
    openGraph: {
      title: `All ${tools.length}+ Developer Tools | ToolBox`,
      description: t('description'),
      type: 'website',
      url: `${baseUrl}/${locale}/tools`,
    },
  };
}

export default function ToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <ScrollToTop />
      {children}
    </>
  );
}
