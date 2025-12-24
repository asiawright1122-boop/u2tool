import { MetadataRoute } from 'next';
import { tools, categories } from '@/config/tools';
import { SEO_CONFIG, SEO_LOCALES } from '@/lib/seo';

const BASE_URL = SEO_CONFIG.siteUrl;

// 生成多语言 alternates 对象（用于 sitemap）
function generateSitemapAlternates(path: string) {
  return {
    languages: Object.fromEntries(
      SEO_LOCALES.map(locale => [locale, `${BASE_URL}/${locale}${path}`])
    )
  };
}

// 生成工具的 OG 图片 URL（用于图片 sitemap）
function generateToolImageUrl(toolName: string, locale: string, icon: string): string {
  return `${BASE_URL}/api/og?title=${encodeURIComponent(toolName)}&locale=${locale}&icon=${encodeURIComponent(icon)}`;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const routes: MetadataRoute.Sitemap = [];
  const now = new Date();

  // 添加首页（每个语言版本）
  for (const locale of SEO_LOCALES) {
    routes.push({
      url: `${BASE_URL}/${locale}`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1.0,
      alternates: generateSitemapAlternates(''),
    });

    // 添加工具列表页
    routes.push({
      url: `${BASE_URL}/${locale}/tools`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
      alternates: generateSitemapAlternates('/tools'),
    });

    // 添加分类页面
    for (const category of categories) {
      routes.push({
        url: `${BASE_URL}/${locale}/tools/category/${category.id}`,
        lastModified: now,
        changeFrequency: 'weekly',
        priority: 0.85,
        alternates: generateSitemapAlternates(`/tools/category/${category.id}`),
      });
    }

    // 添加每个工具页面（包含图片信息）
    for (const tool of tools) {
      // 热门工具优先级更高
      const priority = tool.popular ? 0.8 : 0.7;
      
      // 生成工具名称（简化版，实际应使用翻译）
      const toolName = tool.slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      
      routes.push({
        url: `${BASE_URL}/${locale}/tools/${tool.slug}`,
        lastModified: now,
        changeFrequency: 'monthly',
        priority,
        alternates: generateSitemapAlternates(`/tools/${tool.slug}`),
        // 图片 sitemap 信息（Next.js 15 支持）
        images: [generateToolImageUrl(toolName, locale, tool.icon)],
      });
    }
  }

  return routes;
}
