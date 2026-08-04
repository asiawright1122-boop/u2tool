import { categories } from '@/config/tools';
import {
  aiModelComparisonIndexPath,
  aiModelComparisonLocales,
  aiModelComparisonSlugs,
  isPublishedAiModelComparisonLocale,
} from '@/lib/ai-model-comparisons';
import { aiToolTopicSlugs, getAiToolTopicPath } from '@/lib/ai-tool-topics';
import { chartToolClusterPath } from '@/lib/chart-tool-cluster';
import { guideSlugsForLocale } from '@/lib/guides';
import { comparisonSurfaceSlugs } from '@/lib/comparison-surfaces';
import { creatorSeoClusterPath } from '@/lib/creator-seo-cluster';
import { developerDataToolClusterPath } from '@/lib/developer-data-tool-cluster';
import { imageToolClusterPath } from '@/lib/image-tool-cluster';
import { locales } from '@/lib/i18n';
import { onlineCalculatorClusterPath } from '@/lib/online-calculator-cluster';
import { pdfDocumentToolClusterPath } from '@/lib/pdf-document-tool-cluster';
import { securityToolClusterPath } from '@/lib/security-tool-cluster';
import { getDiscoverableTools, getPriorityTools } from '@/lib/seo-discovery';
import { siteInfoPageSlugs } from '@/lib/site-info-pages';
import { textWritingToolClusterPath } from '@/lib/text-writing-tool-cluster';
import { buildUrl, buildUrlForLocales, type SitemapUrlEntry } from '@/lib/sitemap-utils';
import { INDEX_SUPPRESSION } from '@/config/index-suppression.generated';

/**
 * Full tool sitemap (pre-M2 view): every discoverable tool in every locale.
 * Used by index-readiness evaluation to answer "should this page be
 * indexable?" independently of the suppression list, avoiding a circular
 * dependency (suppression derives FROM evaluation output).
 */
export function buildToolsSitemapEntries(): SitemapUrlEntry[] {
  const entries: SitemapUrlEntry[] = [];
  const discoverableTools = getDiscoverableTools();

  for (const locale of locales) {
    for (const tool of discoverableTools) {
      entries.push(buildUrl(`/${locale}/tools/${tool.slug}`, '0.7', 'weekly', 'tools'));
    }
  }

  return entries;
}

/**
 * M2 index-hygiene view of the tool sitemap: suppressed (zero GSC demand,
 * unprotected) pages stay live but are excluded so crawl budget concentrates
 * on demand-bearing pages. This is what sitemap-tools.xml publishes.
 */
export function buildIndexableToolsSitemapEntries(): SitemapUrlEntry[] {
  const entries: SitemapUrlEntry[] = [];
  const discoverableTools = getDiscoverableTools();

  for (const locale of locales) {
    for (const tool of discoverableTools) {
      if (INDEX_SUPPRESSION[`${locale}/${tool.slug}`] === true) {
        continue;
      }
      entries.push(buildUrl(`/${locale}/tools/${tool.slug}`, '0.7', 'weekly', 'tools'));
    }
  }

  return entries;
}

export function buildPrioritySitemapEntries(): SitemapUrlEntry[] {
  const entries: SitemapUrlEntry[] = [];
  const priorityTools = getPriorityTools();

  for (const locale of locales) {
    entries.push(buildUrl(`/${locale}`, '1.0', 'daily', 'pages'));

    entries.push(buildUrl(`/${locale}/ai`, '0.8', 'daily', 'ai'));
    for (const topicSlug of aiToolTopicSlugs) {
      entries.push(buildUrl(`/${locale}${getAiToolTopicPath(topicSlug)}`, '0.8', 'weekly', 'ai'));
    }

    entries.push(buildUrl(`/${locale}/tools`, '0.9', 'daily', 'pages'));
    entries.push(buildUrl(`/${locale}/compare`, '0.8', 'weekly', 'pages'));

    for (const slug of comparisonSurfaceSlugs) {
      entries.push(buildUrl(`/${locale}/compare/${slug}`, '0.8', 'weekly', 'pages'));
    }

    for (const category of categories) {
      entries.push(buildUrl(`/${locale}/categories/${category.id}`, '0.8', 'weekly', 'pages'));
    }

    for (const tool of priorityTools) {
      entries.push(buildUrl(`/${locale}/tools/${tool.slug}`, '0.9', 'daily', 'tools'));
    }
  }

  return entries;
}

export function buildPagesSitemapEntries(): SitemapUrlEntry[] {
  const entries: SitemapUrlEntry[] = [];

  for (const locale of locales) {
    entries.push(buildUrl(`/${locale}`, '1.0', 'daily', 'pages'));

    entries.push(buildUrl(`/${locale}/ai`, '0.6', 'weekly', 'ai'));
    for (const topicSlug of aiToolTopicSlugs) {
      entries.push(buildUrl(`/${locale}${getAiToolTopicPath(topicSlug)}`, '0.7', 'weekly', 'ai'));
    }

    if (isPublishedAiModelComparisonLocale(locale)) {
      entries.push(buildUrlForLocales(
        `/${locale}${aiModelComparisonIndexPath}`,
        '0.7',
        'weekly',
        aiModelComparisonLocales,
        'ai'
      ));

      for (const slug of aiModelComparisonSlugs) {
        entries.push(buildUrlForLocales(
          `/${locale}${aiModelComparisonIndexPath}/${slug}`,
          '0.6',
          'weekly',
          aiModelComparisonLocales,
          'ai'
        ));
      }
    }

    entries.push(buildUrl(`/${locale}/tools`, '0.9', 'daily', 'pages'));
    entries.push(buildUrl(`/${locale}${creatorSeoClusterPath}`, '0.8', 'weekly', 'pages'));
    entries.push(buildUrl(`/${locale}${developerDataToolClusterPath}`, '0.8', 'weekly', 'pages'));
    entries.push(buildUrl(`/${locale}${imageToolClusterPath}`, '0.8', 'weekly', 'pages'));
    entries.push(buildUrl(`/${locale}${onlineCalculatorClusterPath}`, '0.8', 'weekly', 'pages'));
    entries.push(buildUrl(`/${locale}${pdfDocumentToolClusterPath}`, '0.8', 'weekly', 'pages'));
    entries.push(buildUrl(`/${locale}${securityToolClusterPath}`, '0.8', 'weekly', 'pages'));
    entries.push(buildUrl(`/${locale}${textWritingToolClusterPath}`, '0.8', 'weekly', 'pages'));
    entries.push(buildUrl(`/${locale}${chartToolClusterPath}`, '0.8', 'weekly', 'pages'));

    entries.push(buildUrl(`/${locale}/compare`, '0.8', 'weekly', 'pages'));
    for (const slug of comparisonSurfaceSlugs) {
      entries.push(buildUrl(`/${locale}/compare/${slug}`, '0.7', 'weekly', 'pages'));
    }

    entries.push(buildUrl(`/${locale}/guides`, '0.6', 'weekly', 'pages'));
    for (const guideSlug of guideSlugsForLocale(locale)) {
      entries.push(buildUrl(`/${locale}/guides/${guideSlug}`, '0.6', 'weekly', 'pages'));
    }

    for (const slug of siteInfoPageSlugs) {
      entries.push(buildUrl(`/${locale}/${slug}`, '0.3', 'monthly', 'pages'));
    }

    for (const category of categories) {
      entries.push(buildUrl(`/${locale}/categories/${category.id}`, '0.8', 'weekly', 'pages'));
    }
  }

  return entries;
}
