/**
 * Content negotiation utilities for RFC 7231 Accept headers.
 * Supports Markdown negotiation (acceptmarkdown.com), JSON, and HTML.
 */

export interface ParsedMediaType {
  mediaType: string;
  q: number;
}

export function parseAcceptHeader(acceptHeader: string | null): ParsedMediaType[] {
  if (!acceptHeader || typeof acceptHeader !== 'string') {
    return [];
  }

  return acceptHeader
    .split(',')
    .map((entry) => {
      const parts = entry.trim().split(';');
      const mediaType = (parts[0] || '').trim().toLowerCase();
      let q = 1.0;

      for (let i = 1; i < parts.length; i++) {
        const param = parts[i].trim();
        const match = param.match(/^q=([\d.]+)/i);
        if (match) {
          const parsed = parseFloat(match[1]);
          if (!Number.isNaN(parsed)) {
            q = Math.max(0, Math.min(1, parsed));
          }
        }
      }

      return { mediaType, q };
    })
    .filter((item) => item.mediaType.length > 0)
    .sort((a, b) => b.q - a.q);
}

/**
 * Returns true if the client requests Markdown (text/markdown) and it is
 * not subordinated to text/html by a lower quality factor.
 */
export function prefersMarkdown(acceptHeader: string | null): boolean {
  if (!acceptHeader || !acceptHeader.includes('text/markdown')) {
    return false;
  }

  const parsed = parseAcceptHeader(acceptHeader);
  const markdownEntry = parsed.find((p) => p.mediaType === 'text/markdown');
  if (!markdownEntry || markdownEntry.q <= 0) {
    return false;
  }

  const htmlEntry = parsed.find((p) => p.mediaType === 'text/html');
  if (!htmlEntry) {
    return true;
  }

  return markdownEntry.q >= htmlEntry.q;
}

/**
 * Returns true if the client requests JSON (application/json) and it is
 * not subordinated to text/html by a lower quality factor.
 */
export function prefersJson(acceptHeader: string | null): boolean {
  if (!acceptHeader || !acceptHeader.includes('application/json')) {
    return false;
  }

  const parsed = parseAcceptHeader(acceptHeader);
  const jsonEntry = parsed.find((p) => p.mediaType === 'application/json');
  if (!jsonEntry || jsonEntry.q <= 0) {
    return false;
  }

  const htmlEntry = parsed.find((p) => p.mediaType === 'text/html');
  if (!htmlEntry) {
    return true;
  }

  return jsonEntry.q >= htmlEntry.q;
}

/**
 * Appends a header name (e.g. 'Accept') to an existing or new Vary header.
 */
export function appendVaryHeader(headers: Headers, headerName: string): void {
  const current = headers.get('vary');
  if (!current) {
    headers.set('vary', headerName);
    return;
  }

  const existingTokens = current
    .split(',')
    .map((token) => token.trim().toLowerCase());

  if (!existingTokens.includes(headerName.toLowerCase())) {
    headers.set('vary', `${current}, ${headerName}`);
  }
}
