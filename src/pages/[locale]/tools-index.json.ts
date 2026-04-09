import type { APIRoute } from 'astro';
import { tools } from '@/config/tools';
import { discoveryCategoryPriority } from '@/lib/discovery-surface';
import { getLocalizedPath, locales } from '@/lib/i18n';
import type { Locale } from '@/lib/i18n';
import { loadBaseMessages } from '@/lib/translations';

export const prerender = true;

export const GET: APIRoute = async ({ params }) => {
  const locale = params.locale as Locale;
  const baseMessages = await loadBaseMessages(locale);
  const toolsObj = (baseMessages.tools as Record<string, unknown>) ?? {};
  const categories = (baseMessages.categories as Record<string, unknown>) ?? {};
  const categoryPriority = new Map(
    discoveryCategoryPriority.map((category, index) => [category, index])
  );

  const toolsIndex = [...tools]
    .sort((left, right) => {
      const leftPriority = categoryPriority.get(left.category) ?? Number.MAX_SAFE_INTEGER;
      const rightPriority = categoryPriority.get(right.category) ?? Number.MAX_SAFE_INTEGER;

      if (leftPriority !== rightPriority) {
        return leftPriority - rightPriority;
      }

      if ((left.popular ?? false) !== (right.popular ?? false)) {
        return Number(right.popular ?? false) - Number(left.popular ?? false);
      }

      return left.slug.localeCompare(right.slug);
    })
    .map((tool) => {
      const toolData = (toolsObj[tool.slug] as Record<string, unknown>) ?? {};
      return {
        slug: tool.slug,
        name: (toolData.name as string) || tool.slug,
        description: (toolData.seo_description as string) || (toolData.description as string) || '',
        category: tool.category,
        categoryName: (categories[tool.category] as string) || tool.category,
        href: getLocalizedPath(locale, `/tools/${tool.slug}`),
        categoryHref: getLocalizedPath(locale, `/categories/${tool.category}`),
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
