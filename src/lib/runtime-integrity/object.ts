export interface ParsedResponse {
  status?: number;
  statusText?: string;
  headers?: Record<string, string>;
  body?: unknown;
  contentType?: string;
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return Object.prototype.toString.call(value) === '[object Object]';
}

function sortEntries(
  entries: Array<[string, unknown]>,
  order: 'asc' | 'desc'
): Array<[string, unknown]> {
  return entries.sort(([left], [right]) =>
    order === 'desc' ? right.localeCompare(left) : left.localeCompare(right)
  );
}

function normalizeContentType(value?: string): string | undefined {
  return value?.split(';', 1)[0]?.trim().toLowerCase() || undefined;
}

function parseBody(body: string, contentType?: string): unknown {
  const trimmed = body.trim();
  if (!trimmed) {
    return '';
  }

  if (contentType?.includes('json') || /^[\[{]/.test(trimmed)) {
    return JSON.parse(trimmed);
  }

  if (contentType?.includes('xml') || trimmed.startsWith('<')) {
    return trimmed;
  }

  return trimmed;
}

export function sortObject<T>(value: T, order: 'asc' | 'desc' = 'asc'): T {
  if (Array.isArray(value)) {
    return value.map((item) => sortObject(item, order)) as T;
  }

  if (!isPlainObject(value)) {
    return value;
  }

  const sorted = Object.fromEntries(
    sortEntries(Object.entries(value), order).map(([key, nestedValue]) => [
      key,
      sortObject(nestedValue, order),
    ])
  );

  return sorted as T;
}

export function formatJson(value: unknown, indentSize = 2): string {
  const indent = Math.max(0, Math.min(8, Math.floor(indentSize)));
  return JSON.stringify(value, null, indent);
}

export function parseResponse(input: string): ParsedResponse | null {
  const trimmed = input.trim();
  if (!trimmed) {
    return null;
  }

  if (trimmed.startsWith('HTTP/')) {
    const [head, ...bodyParts] = input.split(/\r?\n\r?\n/);
    const [statusLine, ...headerLines] = head.split(/\r?\n/);
    const statusMatch = statusLine.match(/^HTTP\/[\d.]+\s+(\d{3})(?:\s+(.*))?$/i);
    if (!statusMatch) {
      return null;
    }

    const headers: Record<string, string> = {};
    for (const line of headerLines) {
      const separatorIndex = line.indexOf(':');
      if (separatorIndex === -1) continue;
      const key = line.slice(0, separatorIndex).trim();
      const value = line.slice(separatorIndex + 1).trim();
      headers[key] = value;
    }

    const contentType = normalizeContentType(headers['Content-Type'] || headers['content-type']);
    const bodyText = bodyParts.join('\n\n');

    return {
      status: Number.parseInt(statusMatch[1], 10),
      statusText: statusMatch[2] || '',
      headers,
      body: parseBody(bodyText, contentType),
      contentType,
    };
  }

  try {
    if (/^[\[{]/.test(trimmed)) {
      return {
        body: JSON.parse(trimmed),
        contentType: 'application/json',
      };
    }

    if (trimmed.startsWith('<')) {
      return {
        body: trimmed,
        contentType: 'application/xml',
      };
    }

    return {
      body: trimmed,
      contentType: 'text/plain',
    };
  } catch {
    return null;
  }
}
