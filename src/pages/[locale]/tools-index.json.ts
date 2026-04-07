import type { APIRoute } from 'astro';
import { tools } from '@/config/tools';
import { locales } from '@/lib/i18n';
import type { Locale } from '@/lib/i18n';
import { loadBaseMessages } from '@/lib/translations';

export const prerender = true;

export const GET: APIRoute = async ({ params }) => {
  const locale = params.locale as Locale;
  const baseMessages = await loadBaseMessages(locale);
  const toolsObj = (baseMessages.tools as Record<string, unknown>) ?? {};
  const categories = (baseMessages.categories as Record<string, unknown>) ?? {};

  const toolsIndex = tools.map(tool => {
    const toolData = (toolsObj[tool.slug] as Record<string, unknown>) ?? {};
    return {
      slug: tool.slug,
      name: (toolData.name as string) || tool.slug,
      description: (toolData.description as string) || '',
      category: tool.category,
      categoryName: (categories[tool.category] as string) || tool.category
    };
  });

  return new Response(JSON.stringify(toolsIndex), {
    headers: {
      'Content-Type': 'application/json'
    }
  });
};

export function getStaticPaths() {
  return locales.map((locale) => ({
    params: { locale },
  }));
}
