import { getLocalizedPath } from '@/lib/i18n';
import type { Locale } from '@/lib/i18n';

export function buildAiDiscoveryLink(locale: Locale, query: string): string {
  const basePath = getLocalizedPath(locale, '/ai');
  const trimmed = query.trim();

  if (!trimmed) {
    return basePath;
  }

  return `${basePath}?q=${encodeURIComponent(trimmed)}`;
}
