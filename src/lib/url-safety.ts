type UrlValidationResult =
  | { ok: true; url: string }
  | { ok: false; error: string };

const URL_WITH_SCHEME = /^[a-z][a-z0-9+.-]*:/i;
const CONTROL_CHARS = /[\u0000-\u001f\u007f]/;

function normalizeCandidate(input: string, defaultProtocol: 'http:' | 'https:' | 'ws:' | 'wss:'): string {
  const trimmed = String(input || '').trim();
  if (URL_WITH_SCHEME.test(trimmed)) {
    return trimmed;
  }

  if (trimmed.startsWith('//')) {
    return `${defaultProtocol}${trimmed}`;
  }

  return `${defaultProtocol}//${trimmed}`;
}

function normalizeUrl(
  input: string,
  allowedProtocols: string[],
  defaultProtocol: 'http:' | 'https:' | 'ws:' | 'wss:',
  protocolLabel: string
): UrlValidationResult {
  const trimmed = String(input || '').trim();
  if (!trimmed) {
    return { ok: false, error: 'Please enter a URL' };
  }

  if (CONTROL_CHARS.test(trimmed)) {
    return { ok: false, error: `Enter a valid ${protocolLabel} URL` };
  }

  let parsed: URL;
  try {
    parsed = new URL(normalizeCandidate(trimmed, defaultProtocol));
  } catch {
    return { ok: false, error: `Enter a valid ${protocolLabel} URL` };
  }

  if (!allowedProtocols.includes(parsed.protocol)) {
    return { ok: false, error: `Only ${protocolLabel} URLs are supported` };
  }

  if (!parsed.hostname) {
    return { ok: false, error: `Enter a valid ${protocolLabel} URL` };
  }

  if (parsed.username || parsed.password) {
    return { ok: false, error: 'URLs with embedded credentials are not supported' };
  }

  return { ok: true, url: parsed.href };
}

export function normalizeHttpUrl(input: string): UrlValidationResult {
  return normalizeUrl(input, ['http:', 'https:'], 'https:', 'http(s)');
}

export function normalizeWebSocketUrl(input: string): UrlValidationResult {
  return normalizeUrl(input, ['ws:', 'wss:'], 'wss:', 'ws(s)');
}

export function resolveHttpUrl(input: string, baseUrl: string): string {
  try {
    const absoluteUrl = new URL(input, baseUrl).href;
    const normalized = normalizeHttpUrl(absoluteUrl);
    return normalized.ok ? normalized.url : '';
  } catch {
    return '';
  }
}
