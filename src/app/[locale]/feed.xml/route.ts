/**
 * 多语言 RSS Feed 路由
 * 支持动态 locale 参数，生成翻译后的工具名称和描述
 */

import { tools } from '@/config/tools';
import { routing } from '@/i18n/routing';
import { generateRSSXml, generateRSSItem } from '@/lib/rss';
import { getTranslations } from 'next-intl/server';

// 生成静态参数（所有语言）
export function generateStaticParams() {
  return routing.locales.map(locale => ({ locale }));
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ locale: string }> }
) {
  const { locale } = await params;
  
  // 获取翻译函数
  const t = await getTranslations({ locale, namespace: 'tools' });
  const tSite = await getTranslations({ locale, namespace: 'site' });
  
  // 生成 RSS 项目（使用翻译后的名称和描述）
  const items = tools.slice(0, 50).map(tool => {
    const toolName = t(`${tool.slug}.name`);
    const toolDescription = t(`${tool.slug}.description`);
    return generateRSSItem(tool, locale, toolName, toolDescription);
  });
  
  // 生成 RSS XML
  const rssXml = generateRSSXml({
    locale,
    title: tSite('name'),
    description: tSite('description'),
  }, items);

  return new Response(rssXml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
