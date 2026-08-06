/**
 * Parser for public/_redirects.
 *
 * Cloudflare Workers Assets evaluates this file BEFORE the Worker runs (the
 * wrangler `run_worker_first` list is limited to /_next/* and /dist/*), and it
 * applies the first matching rule. A rule that only partially canonicalizes a
 * URL therefore shadows the Worker's complete rule and costs an extra redirect
 * hop, which crawlers charge against crawl budget.
 *
 * This module exists so tests can assert ordering invariants over the file. It
 * is not used at runtime — Cloudflare reads the file directly.
 */

export interface RedirectRule {
  /** 1-based line number in public/_redirects */
  line: number;
  source: string;
  destination: string;
  status: number;
}

/** Parses the file body, skipping blank lines and `#` comments. */
export function parseRedirects(content: string): RedirectRule[] {
  const rules: RedirectRule[] = [];

  content.split(/\r?\n/).forEach((rawLine, index) => {
    const trimmed = rawLine.trim();
    if (!trimmed || trimmed.startsWith('#')) {
      return;
    }

    const [source, destination, status] = trimmed.split(/\s+/);
    if (!source || !destination) {
      return;
    }

    rules.push({
      line: index + 1,
      source,
      destination,
      status: status ? Number(status) : 301,
    });
  });

  return rules;
}

/**
 * Converts a rule source into a matcher.
 *
 * `:param` matches exactly one path segment; `*` matches one or more segments.
 * Trailing slashes are significant, mirroring Cloudflare's own matching.
 */
export function ruleMatches(source: string, path: string): boolean {
  const pattern = source
    .split('/')
    .map((segment) => {
      if (segment.startsWith(':')) {
        return '[^/]+';
      }
      if (segment === '*') {
        return '.+';
      }
      return segment.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    })
    .join('/');

  return new RegExp(`^${pattern}$`).test(path);
}

/**
 * Returns the rule Cloudflare would apply to `path` — the first match wins.
 */
export function resolveRule(rules: readonly RedirectRule[], path: string): RedirectRule | null {
  for (const rule of rules) {
    if (ruleMatches(rule.source, path)) {
      return rule;
    }
  }
  return null;
}
