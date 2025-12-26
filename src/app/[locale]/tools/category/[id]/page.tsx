import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Link } from '@/i18n/routing';
import { 
  SEO_CONFIG, 
  generateAlternates, 
  generateOgImageUrl,
  generateItemListJsonLd,
  getCategoryKeywords,
  jsonLdToString,
} from '@/lib/seo';
import { categories, getToolsByCategory, ToolCategory } from '@/config/tools';

/**
 * 生成静态参数，为每个分类生成页面
 */
export function generateStaticParams() {
  return categories.map((cat) => ({ id: cat.id }));
}

/**
 * 生成分类页面的 SEO 元数据
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}): Promise<Metadata> {
  const { locale, id } = await params;
  const t = await getTranslations({ locale });
  
  // 验证分类是否存在
  const category = categories.find(c => c.id === id);
  if (!category) {
    return { title: 'Not Found' };
  }
  
  const categoryName = t(`categories.${id}`);
  const title = `${categoryName} - ${t('nav.tools')}`;
  const description = t('site.description');
  
  // 获取分类关键词
  const keywords = getCategoryKeywords(id, locale);
  
  return {
    title,
    description,
    keywords: keywords.length > 0 ? keywords : [categoryName, 'online tools', 'free tools'],
    alternates: generateAlternates(locale, `/tools/category/${id}`),
    openGraph: {
      title: `${title} | ${SEO_CONFIG.siteName}`,
      description,
      url: `/${locale}/tools/category/${id}`,
      siteName: SEO_CONFIG.siteName,
      locale,
      type: 'website',
      images: [
        {
          url: generateOgImageUrl({ title: categoryName, locale, icon: category.icon }),
          width: 1200,
          height: 630,
          alt: categoryName,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | ${SEO_CONFIG.siteName}`,
      description,
      images: [generateOgImageUrl({ title: categoryName, locale, icon: category.icon })],
    },
  };
}

/**
 * 分类页面组件
 * 显示特定分类下的所有工具，包含 ItemList JSON-LD
 */
export default async function CategoryPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const t = await getTranslations({ locale });
  
  // 验证分类是否存在
  const category = categories.find(c => c.id === id);
  if (!category) {
    notFound();
  }
  
  const categoryTools = getToolsByCategory(id as ToolCategory);
  const categoryName = t(`categories.${id}`);
  
  // 生成 ItemList JSON-LD
  const toolItems = categoryTools.map(tool => ({
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
      
      <div className="min-h-screen py-12 px-4">
        <div className="max-w-6xl mx-auto">
          {/* 面包屑导航 */}
          <nav className="mb-6 text-sm text-gray-400">
            <Link href="/" className="hover:text-white transition-colors">
              {t('nav.home')}
            </Link>
            <span className="mx-2">/</span>
            <Link href="/tools" className="hover:text-white transition-colors">
              {t('nav.tools')}
            </Link>
            <span className="mx-2">/</span>
            <span className="text-white">{categoryName}</span>
          </nav>
          
          {/* 页面标题 */}
          <h1 className="text-4xl font-bold mb-4 flex items-center gap-3">
            <span className="text-5xl">{category.icon}</span>
            {categoryName}
          </h1>
          
          <p className="text-gray-400 mb-8">
            {categoryTools.length} {t('home.toolsCount')}
          </p>
          
          {/* 工具网格 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categoryTools.map((tool) => (
              <Link
                key={tool.slug}
                href={`/tools/${tool.slug}`}
                className="tool-card p-4 bg-gray-800 border border-gray-700 rounded-lg hover:bg-gray-750 hover:border-gray-600 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{tool.icon}</span>
                  <div>
                    <h2 className="font-medium text-white">
                      {t(`tools.${tool.slug}.name`)}
                    </h2>
                    <p className="text-sm text-gray-300 line-clamp-2">
                      {t(`tools.${tool.slug}.description`)}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          
          {/* 返回所有工具链接 - 增加顶部间距 */}
          <div className="mt-16 text-center">
            <Link
              href="/tools"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
            >
              ← {t('nav.viewAllTools')}
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
