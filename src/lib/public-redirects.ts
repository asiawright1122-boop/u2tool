/**
 * Parser for public/_redirects.
 *
 * Cloudflare Workers Assets evaluates this file BEFORE the Worker runs (the
 * wrangler `run_worker_first` list is limited to /_next/* and /dist/*). A rule
 * that only partially canonicalizes a URL therefore shadows the Worker's
 * complete rule and costs an extra redirect hop, which crawlers charge against
 * crawl budget.
 *
 * Precedence is NOT plain first-match-wins, despite what the file's top-to-
 * bottom reading suggests. Measured against production:
 *
 *   - `/compare/<a>/<b>` (static, declared above every placeholder rule) beats
 *     the later `/compare/*` splat.
 *   - `/tools/ranking` (static, but declared *below* the first placeholder
 *     rule) loses to the later `/tools/:tool`.
 *   - `/:locale/tools/ranking` loses to the later `/:locale/tools/:tool`.
 *
 * So a rule reliably wins over a broader competitor only when it is static and
 * appears before the first rule containing a placeholder or splat. Adjacency to
 * the rule it must beat is irrelevant. Wrangler hints at this during deploy
 * ("could be made more performant by bringing it above any lines with splats or
 * placeholders") — in practice that placement is a correctness requirement, not
 * just an optimization.
 *
 * How Cloudflare breaks ties *within* the remainder is not pinned down here, so
 * `resolveRule` deliberately models only the part that production confirms.
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

/** True when a source contains a `:placeholder` or a `*` splat. */
export function isDynamicSource(source: string): boolean {
  return /(?::[A-Za-z]\w*|\*)/.test(source);
}

/**
 * Line of the first rule containing a placeholder or splat. Static rules above
 * this line take precedence over any broader rule; static rules below it do not.
 */
export function firstDynamicLine(rules: readonly RedirectRule[]): number {
  const dynamic = rules.filter((rule) => isDynamicSource(rule.source));
  return dynamic.length > 0 ? Math.min(...dynamic.map((rule) => rule.line)) : Number.POSITIVE_INFINITY;
}

/**
 * Rules that win outright: static, and declared above every dynamic rule.
 * These behave as an exact-path fast path.
 */
export function fastPathRules(rules: readonly RedirectRule[]): RedirectRule[] {
  const boundary = firstDynamicLine(rules);
  return rules.filter((rule) => !isDynamicSource(rule.source) && rule.line < boundary);
}

/**
 * Returns the rule Cloudflare applies to `path`.
 *
 * The exact-match fast path is consulted first (see module header). Only if it
 * misses do the remaining rules apply, and there we fall back to file order —
 * production does not confirm how ties among those are broken, so callers should
 * not depend on that case. `explainUnwinnable` is the guard that keeps rules
 * which must beat a broader competitor out of that ambiguous region.
 */
export function resolveRule(rules: readonly RedirectRule[], path: string): RedirectRule | null {
  const fastPath = fastPathRules(rules).find((rule) => rule.source === path);
  if (fastPath) {
    return fastPath;
  }

  return rules.find((rule) => ruleMatches(rule.source, path)) ?? null;
}

/**
 * Explains why `path` cannot be relied on to hit `expected`, or null if it can.
 *
 * A path is safe when the winning rule is in the fast path, or when no other
 * rule matches it at all.
 */
export function explainUnwinnable(rules: readonly RedirectRule[], path: string): string | null {
  const matches = rules.filter((rule) => ruleMatches(rule.source, path));
  if (matches.length === 0) {
    return `no rule matches ${path}`;
  }

  const fastPath = fastPathRules(rules).find((rule) => rule.source === path);
  if (fastPath) {
    return null;
  }

  const competitors = matches.filter((rule) => rule.destination !== matches[0].destination);
  if (competitors.length === 0) {
    return null;
  }

  const boundary = firstDynamicLine(rules);
  return `${path} is contested: ${matches
    .map((rule) => `L${rule.line} ${rule.source} -> ${rule.destination}`)
    .join(' | ')}. Declare it statically above line ${boundary} to win.`;
}
