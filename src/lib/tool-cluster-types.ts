/**
 * Shared types for tool cluster modules.
 *
 * Every cluster (chart, creator-seo, developer-data, image, online-calculator,
 * pdf-document, security, text-writing) follows the same structural shape.
 * These interfaces define that shared contract so that individual cluster
 * data files only need to supply their own GroupId union and locale data.
 */

/** A single tool entry inside a cluster group. */
export interface ToolClusterItem {
  category: string;
  categoryName: string;
  description: string;
  href: string;
  icon: string;
  name: string;
  slug: string;
}

/** A sub-group within a cluster (e.g. "password-identity" inside security). */
export interface ToolClusterGroup<GroupId extends string = string> {
  description: string;
  id: GroupId;
  title: string;
  tools: ToolClusterItem[];
}

/** Locale-aware copy bundle for a cluster hub page. */
export interface ToolClusterCopy {
  ctaLabel: string;
  description: string;
  eyebrow: string;
  h1: string;
  intro: string;
  relatedLinksTitle: string;
  seoDescription: string;
  seoTitle: string;
  summary: string;
  title: string;
  toolCountLabel: string;
  workflow: {
    title: string;
    items: Array<{
      label: string;
      text: string;
      slugs: string[];
    }>;
  };
}

/** Minimal copy needed by per-tool cluster cards. */
export interface ToolClusterCardCopy {
  ctaLabel: string;
  eyebrow: string;
}

/** A group definition mapping a group ID to its member slugs. */
export interface ToolClusterGroupDef<GroupId extends string> {
  id: GroupId;
  slugs: string[];
}

/** Color theme used by ClusterCard and ClusterSection components. */
export type ClusterColorTheme = 'amber' | 'cyan' | 'emerald' | 'rose' | 'sky';

/**
 * A single entry in the CLUSTER_BLOCKS configuration array used by the
 * tool detail page ([slug].astro).  Each block maps one tool cluster to the
 * resolved sub-group (if any), its copy bundle, color theme, hub path, and
 * a short data-attribute prefix for analytics.
 */
export interface ToolClusterBlock {
  /** The resolved sub-group containing the current tool's slug, or null. */
  group: ToolClusterGroup | null;
  /** URL path to the cluster's hub page (e.g. `/tools/security-tools`). */
  clusterPath: string;
  /** Locale-aware labels used by the per-tool cluster card. */
  copy: ToolClusterCardCopy;
  /** Visual theme for the card component. */
  theme: ClusterColorTheme;
  /** Short data-attribute prefix for analytics/tracking (e.g. `'security'`). */
  dataPrefix: string;
}
