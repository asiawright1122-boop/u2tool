/**
 * 多语言 Atom Feed 路由
 * 实现 Atom 1.0 格式
 */

import { tools } from '@/config/tools';
import { routing } from '@/i18n/routing';
import { generateAtomXml, generateRSSItem } from '@/lib/rss';
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
  
  // 生成 Atom 项目（复用 RSS Item 结构）
  const items = tools.slice(0, 50).map(tool => {
    const toolName = t(`${tool.slug}.name`);
    const toolDescription = t(`${tool.slug}.description`);
    return generateRSSItem(tool, locale, toolName, toolDescription);
  });
  
  // 生成 Atom XML
  const atomXml = generateAtomXml({
    locale,
    title: tSite('name'),
    description: tSite('description'),
  }, items);

  return new Response(atomXml, {
    headers: {
      'Content-Type': 'application/atom+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
