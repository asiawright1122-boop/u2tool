export interface ParsedCurlRequest {
  method: string;
  url: string;
  headers: Record<string, string>;
  data?: string;
  dataType?: 'json' | 'form' | 'raw';
}

const DATA_FLAGS = new Set([
  '-d',
  '--data',
  '--data-raw',
  '--data-binary',
  '--data-urlencode',
]);

function normalizeCurlInput(input: string): string {
  return input.replace(/\\\r?\n\s*/g, ' ').trim();
}

function tokenizeShellLike(input: string): string[] {
  const tokens: string[] = [];
  let current = '';
  let quote: '"' | "'" | null = null;
  let escaping = false;

  for (const char of input) {
    if (escaping) {
      current += char;
      escaping = false;
      continue;
    }

    if (char === '\\' && quote !== "'") {
      escaping = true;
      continue;
    }

    if (quote) {
      if (char === quote) {
        quote = null;
      } else {
        current += char;
      }
      continue;
    }

    if (char === '"' || char === "'") {
      quote = char;
      continue;
    }

    if (/\s/.test(char)) {
      if (current) {
        tokens.push(current);
        current = '';
      }
      continue;
    }

    current += char;
  }

  if (escaping) {
    current += '\\';
  }

  if (current) {
    tokens.push(current);
  }

  return tokens;
}

function isUrlToken(token: string): boolean {
  return /^[a-z][a-z0-9+.-]*:\/\/\S+$/i.test(token);
}

function addHeader(headers: Record<string, string>, value: string): void {
  const separatorIndex = value.indexOf(':');
  if (separatorIndex === -1) {
    return;
  }

  const key = value.slice(0, separatorIndex).trim();
  const headerValue = value.slice(separatorIndex + 1).trim();

  if (key) {
    headers[key] = headerValue;
  }
}

function getHeaderValue(headers: Record<string, string>, name: string): string | undefined {
  const target = name.toLowerCase();
  for (const [key, value] of Object.entries(headers)) {
    if (key.toLowerCase() === target) {
      return value;
    }
  }
  return undefined;
}

function tryParseJson(value?: string): unknown | null {
  if (!value?.trim()) {
    return null;
  }

  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

function inferDataType(headers: Record<string, string>, data?: string): ParsedCurlRequest['dataType'] {
  if (!data?.trim()) {
    return undefined;
  }

  const contentType = getHeaderValue(headers, 'content-type')?.toLowerCase() || '';
  if (contentType.includes('json')) {
    return 'json';
  }

  if (contentType.includes('x-www-form-urlencoded')) {
    return 'form';
  }

  if (tryParseJson(data) !== null) {
    return 'json';
  }

  if (/^[^=&\s]+=[^=&]*(?:&[^=&\s]+=[^=&]*)*$/.test(data.trim())) {
    return 'form';
  }

  return 'raw';
}

function isOpenApiLike(value: unknown): boolean {
  return Boolean(
    value &&
      typeof value === 'object' &&
      ('openapi' in value || 'swagger' in value || 'paths' in value)
  );
}

export function isParsedCurlRequest(value: unknown): value is ParsedCurlRequest {
  return Boolean(
    value &&
      typeof value === 'object' &&
      typeof (value as ParsedCurlRequest).method === 'string' &&
      typeof (value as ParsedCurlRequest).url === 'string' &&
      (value as ParsedCurlRequest).headers &&
      typeof (value as ParsedCurlRequest).headers === 'object' &&
      !Array.isArray((value as ParsedCurlRequest).headers)
  );
}

export function parseCurlCommand(input: string): ParsedCurlRequest {
  const result: ParsedCurlRequest = {
    method: 'GET',
    url: '',
    headers: {},
  };

  const normalized = normalizeCurlInput(input);
  if (!normalized) {
    return result;
  }

  const tokens = tokenizeShellLike(normalized);
  if (tokens.length === 0) {
    return result;
  }

  const dataParts: string[] = [];
  let explicitMethod = false;

  for (let index = 0; index < tokens.length; index += 1) {
    const token = tokens[index];

    if (index === 0 && token === 'curl') {
      continue;
    }

    if (token === '-X' || token === '--request') {
      const value = tokens[index + 1];
      if (value) {
        result.method = value.toUpperCase();
        explicitMethod = true;
        index += 1;
      }
      continue;
    }

    if (/^-X[A-Za-z]+$/.test(token)) {
      result.method = token.slice(2).toUpperCase();
      explicitMethod = true;
      continue;
    }

    if (token.startsWith('--request=')) {
      result.method = token.slice('--request='.length).toUpperCase();
      explicitMethod = true;
      continue;
    }

    if (token === '-I' || token === '--head') {
      result.method = 'HEAD';
      explicitMethod = true;
      continue;
    }

    if (token === '-G' || token === '--get') {
      result.method = 'GET';
      explicitMethod = true;
      continue;
    }

    if (token === '-H' || token === '--header') {
      const value = tokens[index + 1];
      if (value) {
        addHeader(result.headers, value);
        index += 1;
      }
      continue;
    }

    if (token.startsWith('--header=')) {
      addHeader(result.headers, token.slice('--header='.length));
      continue;
    }

    if (DATA_FLAGS.has(token)) {
      const value = tokens[index + 1];
      if (value) {
        dataParts.push(value);
        index += 1;
      }
      continue;
    }

    if (/^--data(?:-raw|-binary|-urlencode)?=/.test(token)) {
      dataParts.push(token.slice(token.indexOf('=') + 1));
      continue;
    }

    if (token === '--url') {
      const value = tokens[index + 1];
      if (value) {
        result.url = value;
        index += 1;
      }
      continue;
    }

    if (token.startsWith('--url=')) {
      result.url = token.slice('--url='.length);
      continue;
    }

    if (isUrlToken(token) && !result.url) {
      result.url = token;
    }
  }

  if (dataParts.length > 0) {
    result.data = dataParts.join('&');
  }

  if (!explicitMethod && result.data) {
    result.method = 'POST';
  }

  result.dataType = inferDataType(result.headers, result.data);

  return result;
}

function toDoubleQuotedString(value: string): string {
  return JSON.stringify(value);
}

function toSingleQuotedString(value: string): string {
  return `'${value.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;
}

function renderJavaScriptHeaders(headers: Record<string, string>): string {
  const entries = Object.entries(headers);
  if (entries.length === 0) {
    return '    // Add request headers here when needed';
  }

  return entries
    .map(([key, value]) => `    ${toSingleQuotedString(key)}: ${toSingleQuotedString(value)}`)
    .join(',\n');
}

function renderBodyLiteral(parsed: ParsedCurlRequest): { literal: string } | null {
  if (!parsed.data) {
    return null;
  }

  if (parsed.dataType === 'json') {
    const jsonValue = tryParseJson(parsed.data);
    if (jsonValue !== null) {
      return {
        literal: `JSON.stringify(${JSON.stringify(jsonValue, null, 2)})`,
      };
    }
  }

  return {
    literal: toDoubleQuotedString(parsed.data),
  };
}

function renderPythonValue(value: unknown, depth = 0): string {
  const padding = ' '.repeat(depth * 4);
  const innerPadding = ' '.repeat((depth + 1) * 4);

  if (value === null) {
    return 'None';
  }

  if (typeof value === 'boolean') {
    return value ? 'True' : 'False';
  }

  if (typeof value === 'number') {
    return Number.isFinite(value) ? String(value) : '0';
  }

  if (typeof value === 'string') {
    return toDoubleQuotedString(value);
  }

  if (Array.isArray(value)) {
    if (value.length === 0) {
      return '[]';
    }

    const items = value.map((item) => `${innerPadding}${renderPythonValue(item, depth + 1)}`);
    return `[\n${items.join(',\n')}\n${padding}]`;
  }

  if (value && typeof value === 'object') {
    const entries = Object.entries(value);
    if (entries.length === 0) {
      return '{}';
    }

    const items = entries.map(
      ([key, nestedValue]) =>
        `${innerPadding}${toDoubleQuotedString(key)}: ${renderPythonValue(nestedValue, depth + 1)}`
    );
    return `{\n${items.join(',\n')}\n${padding}}`;
  }

  return 'None';
}

function renderPythonRequestBody(parsed: ParsedCurlRequest): { prelude: string; argument: string } {
  if (!parsed.data) {
    return { prelude: '', argument: '' };
  }

  if (parsed.dataType === 'json') {
    const jsonValue = tryParseJson(parsed.data);
    if (jsonValue !== null) {
      return {
        prelude: `json_data = ${renderPythonValue(jsonValue)}`,
        argument: ',\n    json=json_data',
      };
    }
  }

  if (parsed.dataType === 'form') {
    const formData = Object.fromEntries(new URLSearchParams(parsed.data).entries());
    return {
      prelude: `data = ${renderPythonValue(formData)}`,
      argument: ',\n    data=data',
    };
  }

  return {
    prelude: `data = ${toDoubleQuotedString(parsed.data)}`,
    argument: ',\n    data=data',
  };
}

function renderGoHeaders(headers: Record<string, string>): string {
  return Object.entries(headers)
    .map(([key, value]) => `\treq.Header.Set(${toDoubleQuotedString(key)}, ${toDoubleQuotedString(value)})`)
    .join('\n');
}

function renderJavaHeaders(headers: Record<string, string>): string {
  return Object.entries(headers)
    .map(([key, value]) => `            .header(${toDoubleQuotedString(key)}, ${toDoubleQuotedString(value)})`)
    .join('\n');
}

function getRubyRequestClass(method: string): string {
  switch (method.toUpperCase()) {
    case 'POST':
      return 'Net::HTTP::Post';
    case 'PUT':
      return 'Net::HTTP::Put';
    case 'PATCH':
      return 'Net::HTTP::Patch';
    case 'DELETE':
      return 'Net::HTTP::Delete';
    case 'HEAD':
      return 'Net::HTTP::Head';
    default:
      return 'Net::HTTP::Get';
  }
}

export function generateJavaScript(input: unknown): string {
  if (!isParsedCurlRequest(input) || !input.url) {
    return '';
  }

  const body = renderBodyLiteral(input);
  return `// Using fetch API
const response = await fetch(${toSingleQuotedString(input.url)}, {
  method: ${toSingleQuotedString(input.method)},
  headers: {
${renderJavaScriptHeaders(input.headers)}
  }${body ? `,
  body: ${body.literal}` : ''}
});

const data = await response.json();
return data;`;
}

export function generatePython(input: unknown): string {
  if (!isParsedCurlRequest(input)) {
    return isOpenApiLike(input) ? '' : '';
  }

  if (!input.url) {
    return '';
  }

  const body = renderPythonRequestBody(input);
  const headerEntries = Object.entries(input.headers);
  const headersBlock =
    headerEntries.length === 0
      ? ''
      : headerEntries
          .map(([key, value]) => `    ${toDoubleQuotedString(key)}: ${toDoubleQuotedString(value)}`)
          .join(',\n');

  return `import requests

headers = {
${headersBlock}
}
${body.prelude ? `
${body.prelude}
` : ''}
response = requests.request(
    ${toDoubleQuotedString(input.method)},
    ${toDoubleQuotedString(input.url)},
    headers=headers${body.argument}
)

print(response.text)`;
}

export function generateGo(input: unknown): string {
  if (!isParsedCurlRequest(input)) {
    return isOpenApiLike(input) ? '' : '';
  }

  if (!input.url) {
    return '';
  }

  const bodyLiteral = input.data ? toDoubleQuotedString(input.data) : '';
  const headerBlock = renderGoHeaders(input.headers);

  return `package main

import (
\t"fmt"
\t"io"
\t"net/http"${input.data ? '\n\t"strings"' : ''}
)

func main() {
\t${input.data ? `body := strings.NewReader(${bodyLiteral})
\treq, err := http.NewRequest(${toDoubleQuotedString(input.method)}, ${toDoubleQuotedString(input.url)}, body)` : `req, err := http.NewRequest(${toDoubleQuotedString(input.method)}, ${toDoubleQuotedString(input.url)}, nil)`}
\tif err != nil {
\t\tpanic(err)
\t}
${headerBlock ? `

${headerBlock}` : ''}

\tclient := &http.Client{}
\tresp, err := client.Do(req)
\tif err != nil {
\t\tpanic(err)
\t}
\tdefer resp.Body.Close()

\tresponseBody, err := io.ReadAll(resp.Body)
\tif err != nil {
\t\tpanic(err)
\t}

\tfmt.Println(string(responseBody))
}`;
}

export function generateJava(input: unknown): string {
  if (!isParsedCurlRequest(input) || !input.url) {
    return '';
  }

  const bodyPublisher = input.data
    ? `HttpRequest.BodyPublishers.ofString(${toDoubleQuotedString(input.data)})`
    : 'HttpRequest.BodyPublishers.noBody()';

  const headerBlock = renderJavaHeaders(input.headers);

  return `import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

public class Main {
    public static void main(String[] args) throws Exception {
        HttpClient client = HttpClient.newHttpClient();

        HttpRequest request = HttpRequest.newBuilder()
            .uri(URI.create(${toDoubleQuotedString(input.url)}))
            .method(${toDoubleQuotedString(input.method)}, ${bodyPublisher})${headerBlock ? `
${headerBlock}` : ''}
            .build();

        HttpResponse<String> response =
            client.send(request, HttpResponse.BodyHandlers.ofString());

        System.out.println(response.body());
    }
}`;
}

export function generatePhp(input: unknown): string {
  if (!isParsedCurlRequest(input) || !input.url) {
    return '';
  }

  const headers = Object.entries(input.headers)
    .map(([key, value]) => `        ${toSingleQuotedString(`${key}: ${value}`)}`)
    .join(',\n');

  return `<?php

$ch = curl_init();

curl_setopt_array($ch, [
    CURLOPT_URL => ${toSingleQuotedString(input.url)},
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_CUSTOMREQUEST => ${toSingleQuotedString(input.method)},
    CURLOPT_HTTPHEADER => [
${headers}
    ]${input.data ? `,
    CURLOPT_POSTFIELDS => ${toSingleQuotedString(input.data)}` : ''}
]);

$response = curl_exec($ch);
curl_close($ch);

echo $response;`;
}

export function generateRuby(input: unknown): string {
  if (!isParsedCurlRequest(input) || !input.url) {
    return '';
  }

  const requestClass = getRubyRequestClass(input.method);
  const headerLines = Object.entries(input.headers)
    .map(([key, value]) => `request[${toSingleQuotedString(key)}] = ${toSingleQuotedString(value)}`)
    .join('\n');

  return `require 'net/http'
require 'uri'

uri = URI.parse(${toSingleQuotedString(input.url)})
http = Net::HTTP.new(uri.host, uri.port)
http.use_ssl = uri.scheme == 'https'

request = ${requestClass}.new(uri.request_uri)
${headerLines}${input.data ? `
request.body = ${toSingleQuotedString(input.data)}` : ''}

response = http.request(request)
puts response.body`;
}
