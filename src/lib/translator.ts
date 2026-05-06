/**
 * Create a translator function from a flat translations record.
 * Supports dot-notation keys for nested access.
 */
export function createTranslator(translations: Record<string, unknown>) {
  return function t(key: string, fallback?: string): string {
    const keys = key.split('.');
    let value: unknown = translations;

    for (const k of keys) {
      if (value === null || value === undefined || typeof value !== 'object') {
        return fallback ?? `MISSING: ${key}`;
      }
      value = (value as Record<string, unknown>)[k];
    }

    if (value === undefined || value === null) {
      return fallback ?? `MISSING: ${key}`;
    }

    if (typeof value === 'string') {
      return value;
    }

    return fallback ?? `MISSING: ${key}`;
  };
}
