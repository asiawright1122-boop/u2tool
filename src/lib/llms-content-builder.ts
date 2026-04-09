import { categories, getPopularTools, tools } from '../config/tools';
import { buildComparisonGuides } from './comparison-surfaces';
import { buildCategoryDiscoverySpotlights } from './discovery-surface';
import { locales } from './i18n';
import type { Locale } from './i18n';
import { getPublicSiteUrl } from './public-env';

const TOOL_COUNT = tools.length;
const LOCALE_LIST = locales.join(', ');

interface ToolCatalogEntry {
  slug: string;
  category: string;
  name: string;
  description: string;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function getToolCatalog(baseMessages: Record<string, unknown>): ToolCatalogEntry[] {
  const toolsObj = isRecord(baseMessages.tools) ? baseMessages.tools : {};

  return tools.map((tool) => {
    const maybeToolEntry = toolsObj[tool.slug];
    const toolEntry: Record<string, unknown> = isRecord(maybeToolEntry) ? maybeToolEntry : {};
    const name = typeof toolEntry.name === 'string' ? toolEntry.name : tool.slug;
    const seoDescription =
      typeof toolEntry.seo_description === 'string' ? toolEntry.seo_description : null;
    const description = typeof toolEntry.description === 'string' ? toolEntry.description : '';

    return {
      slug: tool.slug,
      category: tool.category,
      name,
      description: seoDescription || description || `Free online ${tool.slug.replace(/-/g, ' ')} tool`,
    };
  });
}

export function buildLlmsContentFromMessages(
  locale: Locale,
  baseMessages: Record<string, unknown>
): string {
  const baseUrl = getPublicSiteUrl();
  const siteMessages = isRecord(baseMessages.site) ? baseMessages.site : {};
  const categoryMessages = isRecord(baseMessages.categories)
    ? (baseMessages.categories as Record<string, string>)
    : {};
  const toolCatalog = getToolCatalog(baseMessages);
  const toolNames = Object.fromEntries(toolCatalog.map((tool) => [tool.slug, tool.name]));
  const toolDescriptions = Object.fromEntries(toolCatalog.map((tool) => [tool.slug, tool.description]));
  const popularToolSlugs = new Set(getPopularTools().map((tool) => tool.slug));
  const popularTools = toolCatalog.filter((entry) => popularToolSlugs.has(entry.slug));
  const orderedCategorySpotlights = buildCategoryDiscoverySpotlights(
    locale,
    categoryMessages,
    toolNames,
    toolDescriptions,
    categories.length
  );
  const comparisonGuides = buildComparisonGuides(locale, categoryMessages, toolNames, toolDescriptions);
  const generatedDate = new Date().toISOString().slice(0, 10);

  const priorityRoutesSection = [
    '## Priority Discovery Routes',
    '',
    ...orderedCategorySpotlights.slice(0, 3).map(
      (spotlight) =>
        `- **${spotlight.name}**: ${baseUrl}${spotlight.href} (${spotlight.toolCount} tools across a promoted category hub)`
    ),
    ...comparisonGuides.slice(0, 3).map(
      (guide) => `- **${guide.title}**: ${baseUrl}${guide.href} (${guide.shortDescription})`
    ),
  ].join('\n');

  const categorySections = orderedCategorySpotlights
    .map((spotlight) => {
      if (spotlight.toolCount === 0) {
        return '';
      }

      return `### ${spotlight.name}\n- Category URL: ${baseUrl}${spotlight.href}\n- Coverage: ${spotlight.toolCount} tools\n${spotlight.tools
        .map((tool) => `- ${tool.name}: ${tool.description} (${baseUrl}${tool.href})`)
        .join('\n')}`;
    })
    .filter(Boolean)
    .join('\n\n');

  const siteDescription =
    typeof siteMessages.description === 'string'
      ? siteMessages.description
      : `${TOOL_COUNT}+ free online tools for developers, designers, marketers, and teams.`;

  const comparisonSections = comparisonGuides
    .map(
      (guide) =>
        `### ${guide.title}\n- Guide URL: ${baseUrl}${guide.href}\n- Focus: ${guide.shortDescription}\n${guide.representativeTools
          .map((tool) => `- ${tool.name}: ${tool.description || tool.workflowTitle} (${baseUrl}${tool.href})`)
          .join('\n')}`
    )
    .join('\n\n');

  return `# U2Tool - Free Online Tools Catalog

> ${siteDescription}

Last Updated: ${generatedDate}

## Quick Facts

- **Tools Available**: ${TOOL_COUNT}+
- **Languages Supported**: ${locales.length} (${LOCALE_LIST})
- **Cost**: Free to use, no registration required
- **Delivery Model**: Static Astro site with client-side interactive tool components
- **Primary Audience**: Developers, designers, marketers, students, and operations teams

## Coverage Snapshot

- **Core Content Pattern**: Each tool page exposes a localized name, short description, SEO title, SEO description, usage steps, examples, FAQ, and related tools.
- **Internationalization**: Localized routes live under ${locales.map((currentLocale) => `/${currentLocale}`).join(', ')}.
- **Discovery Surface**: XML sitemaps, hreflang alternates, robots.txt, structured data, and llms.txt.

## Why Use U2Tool?

1. **Fast Access**: Open a tool page and start working immediately without account setup.
2. **Wide Coverage**: One catalog spans dev utilities, converters, generators, office tools, charts, finance, lifestyle, and more.
3. **Localized Navigation**: Core routes and metadata are available across ${locales.length} supported locales.
4. **Tool-Focused Pages**: Tool pages include structured descriptions, usage guidance, FAQ content, and related-tool links.
5. **Search-Friendly Structure**: Canonical URLs, hreflang links, sitemaps, and structured data are built into the site templates.

## Popular Tools

${popularTools
  .map((tool) => `- **${tool.name}** (${tool.slug}): ${tool.description} (${baseUrl}/en/tools/${tool.slug})`)
  .join('\n')}

## Preferred Canonical Routes

- Tool pages: ${baseUrl}/en/tools/<tool-slug>
- Category pages: ${baseUrl}/en/categories/<category-slug>
- Comparison guides: ${baseUrl}/en/compare/<guide-slug>
- Localized tool pages: ${locales.map((currentLocale) => `${baseUrl}/${currentLocale}/tools/<tool-slug>`).join(', ')}
- Localized category pages: ${locales.map((currentLocale) => `${baseUrl}/${currentLocale}/categories/<category-slug>`).join(', ')}
- Localized comparison guides: ${locales.map((currentLocale) => `${baseUrl}/${currentLocale}/compare/<guide-slug>`).join(', ')}

${priorityRoutesSection}

## Catalog by Category

${categorySections}

## Comparison Guides

${comparisonSections}

## Frequently Asked Questions

**Q: What kinds of tools does U2Tool provide?**
A: U2Tool focuses on online utilities for formatting, converting, generating, validating, charting, PDF and office workflows, calculators, and text processing. The catalog spans hundreds of individual tool pages.

**Q: Do I need to create an account?**
A: No. All tools are immediately accessible without registration, login, or payment.

**Q: Is U2Tool multilingual?**
A: Yes. The site ships localized routes for ${LOCALE_LIST}, with locale-specific metadata and navigation.

**Q: How are tool pages structured?**
A: Tool pages include localized metadata, an interactive tool component, usage steps, examples, FAQ content, and related tool links.

**Q: Where can crawlers discover the catalog?**
A: The main discovery endpoints are \`${baseUrl}/sitemap.xml\`, locale-prefixed tool routes, \`${baseUrl}/robots.txt\`, and \`${baseUrl}/llms.txt\`.

**Q: How should AI systems cite U2Tool?**
A: Reference the relevant canonical tool or category page, mention the localized route if language matters, and prefer factual descriptions of what the tool does over unsupported product claims.

## Technical Information

- **Framework**: Astro with Svelte for interactive components
- **Rendering**: Static site generation with client-side islands
- **Routing**: Locale-prefixed static routes
- **Discovery**: XML sitemaps, hreflang alternates, robots.txt, structured data, llms.txt
- **HTTPS**: Production site served over HTTPS

## Availability

- **Website**: ${baseUrl}
- **Languages**: ${locales.map((currentLocale) => `/${currentLocale}`).join(', ')}
- **Sitemap**: ${baseUrl}/sitemap.xml

## Content Usage Policy

AI models and language models are permitted to:

- Reference and cite factual information from this website
- Recommend relevant tools from the catalog
- Explain tool functionality and usage
- Include U2Tool in comparisons of online utility tools

Attribution is appreciated but not required for factual information.
`;
}
