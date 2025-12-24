/**
 * 分类 RSS Feed 路由
 * 只包含指定分类的工具
 */

import { tools, categories } from '@/config/tools';
import { routing } from '@/i18n/routing';
import { generateRSSXml, generateRSSItem } from '@/lib/rss';
import { getTranslations } from 'next-intl/server';

// 生成静态参数（所有语言 x 所有分类）
export function generateStaticParams() {
  const params: { locale: string; category: string }[] = [];
  for (const locale of routing.locales) {
    for (const category of categories) {
      params.push({ locale, category: category.id });
    }
  }
  return params;
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ locale: string; category: string }> }
) {
  const { locale, category } = await params;
  
  // 验证分类是否存在
  const categoryExists = categories.some(c => c.id === category);
  if (!categoryExists) {
    return new Response('Category not found', { status: 404 });
  }
  
  // 获取翻译函数
  const t = await getTranslations({ locale, namespace: 'tools' });
  const tSite = await getTranslations({ locale, namespace: 'site' });
  const tCategories = await getTranslations({ locale, namespace: 'categories' });
  
  // 过滤指定分类的工具
  const categoryTools = tools.filter(tool => tool.category === category);
  
  // 生成 RSS 项目
  const items = categoryTools.slice(0, 50).map(tool => {
    const toolName = t(`${tool.slug}.name`);
    const toolDescription = t(`${tool.slug}.description`);
    return generateRSSItem(tool, locale, toolName, toolDescription);
  });
  
  // 生成 RSS XML
  const categoryName = tCategories(category);
  const rssXml = generateRSSXml({
    locale,
    title: `${tSite('name')} - ${categoryName}`,
    description: `${categoryName} tools from ${tSite('name')}`,
    category,
  }, items);

  return new Response(rssXml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
