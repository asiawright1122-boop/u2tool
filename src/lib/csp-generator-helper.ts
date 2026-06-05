export interface CspConfig {
  [key: string]: string[] | boolean | undefined;
}

export function buildCspHeader(config: CspConfig): string {
  const parts: string[] = [];

  // Sort keys or iterate in defined standard directive order for prettier outputs
  const keys = Object.keys(config);
  for (const key of keys) {
    const val = config[key];
    if (typeof val === 'boolean') {
      if (val) {
        parts.push(key);
      }
    } else if (Array.isArray(val) && val.length > 0) {
      // Clean values, mapping special directives if not already quoted
      const cleanVals = val
        .map(v => v.trim())
        .filter(Boolean)
        .map(v => {
          const lower = v.toLowerCase();
          if (['self', 'unsafe-inline', 'unsafe-eval', 'none', 'strict-dynamic', 'unsafe-hashes', 'wasm-unsafe-eval'].includes(lower)) {
            return `'${lower}'`;
          }
          return v;
        });

      if (cleanVals.length > 0) {
        parts.push(`${key} ${cleanVals.join(' ')}`);
      }
    }
  }

  return parts.length > 0 ? parts.join('; ') + ';' : '';
}
