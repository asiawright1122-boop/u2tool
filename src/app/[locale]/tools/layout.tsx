import { getTranslations } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { tools } from '@/config/tools';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://toolbox.example.com';

// 工具列表页的 SEO 元数据
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'site' });

  return {
    title: `All ${tools.length}+ Developer Tools | ToolBox`,
    description: t('description'),
    alternates: {
      canonical: `/${locale}/tools`,
      languages: Object.fromEntries(
        routing.locales.map((l) => [l, `/${l}/tools`])
      ),
    },
    openGraph: {
      title: `All ${tools.length}+ Developer Tools | ToolBox`,
      description: t('description'),
      type: 'website',
      url: `${BASE_URL}/${locale}/tools`,
    },
  };
}

export default function ToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
