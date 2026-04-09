function toSerializableRecord(value: unknown): Record<string, unknown> {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return {};
  }

  return JSON.parse(JSON.stringify(value)) as Record<string, unknown>;
}

function pickStringEntries(
  source: Record<string, unknown>,
  keys: string[]
): Record<string, string> {
  const next: Record<string, string> = {};

  for (const key of keys) {
    const value = source[key];
    if (typeof value === 'string' && value.trim().length > 0) {
      next[key] = value;
    }
  }

  return next;
}

export function buildHeaderTranslations(
  baseMessages: Record<string, unknown>
): Record<string, unknown> {
  const nav = toSerializableRecord(baseMessages.nav);
  const search = toSerializableRecord(baseMessages.search);
  const common = toSerializableRecord(baseMessages.common);
  const aiDiscovery = toSerializableRecord(baseMessages.aiDiscovery);

  return {
    nav: pickStringEntries(nav, ['searchPlaceholder', 'noResults']),
    search: pickStringEntries(search, ['placeholder', 'noResults']),
    common: pickStringEntries(common, ['search', 'loading']),
    aiDiscovery: pickStringEntries(aiDiscovery, ['globalSearchCta']),
  };
}

export function buildDiscoveryTranslations(
  baseMessages: Record<string, unknown>
): Record<string, unknown> {
  return {
    aiDiscovery: toSerializableRecord(baseMessages.aiDiscovery),
  };
}

export function buildMobileNavMessages(
  navMessages: Record<string, string>
): Record<string, string> {
  return {
    home: navMessages.home || 'Home',
    tools: navMessages.tools || 'Tools',
    categories: navMessages.categories || 'Categories',
  };
}
