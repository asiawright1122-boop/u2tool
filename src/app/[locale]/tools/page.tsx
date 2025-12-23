import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { 
  SEO_CONFIG, 
  generateAlternates, 
  generateOgImageUrl,
  generateItemListJsonLd,
  jsonLdToString,
} from '@/lib/seo';
import { tools } from '@/config/tools';
import ToolsPageClient from './ToolsPageClient';

/**
 * 生成工具列表页面的 SEO 元数据
 * @see Requirements 8.3
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  
  const title = t('nav.tools');
  // 使用 site.description 作为工具列表页面的描述
  const description = t('site.description');
  
  return {
    title,
    description,
    alternates: generateAlternates(locale, '/tools'),
    openGraph: {
      title: `${title} | ${SEO_CONFIG.siteName}`,
      description,
      url: `/${locale}/tools`,
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
 * 工具列表页面（服务端组件）
 * 包含 ItemList JSON-LD 结构化数据，提升搜索引擎理解
 */
export default async function ToolsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  
  // 生成工具列表的 ItemList JSON-LD
  // 使用翻译后的工具名称
  const toolItems = tools.map(tool => ({
    name: t(`tools.${tool.slug}.name`),
    slug: tool.slug,
  }));
  
  const itemListJsonLd = generateItemListJsonLd(toolItems, locale);
  
  return (
    <>
      {/* ItemList JSON-LD 结构化数据 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdToString(itemListJsonLd) }}
      />
      <ToolsPageClient />
    </>
  );
}
