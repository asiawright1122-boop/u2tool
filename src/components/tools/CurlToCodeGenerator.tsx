'use client';

import { useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';

interface ParsedCurl {
  method: string;
  url: string;
  headers: Record<string, string>;
  data?: string;
  dataType?: 'json' | 'form' | 'raw';
}

function parseCurlCommand(curl: string): ParsedCurl {
  const result: ParsedCurl = {
    method: 'GET',
    url: '',
    headers: {},
  };

  // Remove line continuations and normalize whitespace
  const normalized = curl
    .replace(/\\\n/g, ' ')
    .replace(/\\\r\n/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  // Extract URL (first quoted string after curl or unquoted URL)
  const urlMatch = normalized.match(/curl\s+(?:-[^\s]+\s+)*['"]?([^'">\s]+)['"]?/) ||
                   normalized.match(/curl\s+['"]([^'"]+)['"]/);
  if (urlMatch) {
    result.url = urlMatch[1];
  }

  // Extract method
  const methodMatch = normalized.match(/-X\s+['"]?(\w+)['"]?/i);
  if (methodMatch) {
    result.method = methodMatch[1].toUpperCase();
  }

  // Extract headers
  const headerRegex = /-H\s+['"]([^'"]+)['"]/gi;
  let headerMatch;
  while ((headerMatch = headerRegex.exec(normalized)) !== null) {
    const [key, ...valueParts] = headerMatch[1].split(':');
    if (key && valueParts.length > 0) {
      result.headers[key.trim()] = valueParts.join(':').trim();
    }
  }

  // Extract data
  const dataMatch = normalized.match(/(?:-d|--data|--data-raw|--data-binary)\s+['"]([^'"]+)['"]/i) ||
                    normalized.match(/(?:-d|--data|--data-raw|--data-binary)\s+([^\s]+)/i);
  if (dataMatch) {
    result.data = dataMatch[1];
    result.method = result.method === 'GET' ? 'POST' : result.method;
    
    // Detect data type
    try {
      JSON.parse(result.data);
      result.dataType = 'json';
    } catch {
      if (result.data.includes('=') && !result.data.includes('{')) {
        result.dataType = 'form';
      } else {
        result.dataType = 'raw';
      }
    }
  }

  return result;
}

function generatePython(parsed: ParsedCurl): string {
  const lines: string[] = ['import requests', ''];
  
  const hasHeaders = Object.keys(parsed.headers).length > 0;
  const hasData = !!parsed.data;

  if (hasHeaders) {
    lines.push('headers = {');
    Object.entries(parsed.headers).forEach(([key, value]) => {
      lines.push(`    "${key}": "${value}",`);
    });
    lines.push('}');
    lines.push('');
  }

  if (hasData) {
    if (parsed.dataType === 'json') {
      lines.push(`data = ${parsed.data}`);
    } else {
      lines.push(`data = "${parsed.data}"`);
    }
    lines.push('');
  }

  const args: string[] = [`"${parsed.url}"`];
  if (hasHeaders) args.push('headers=headers');
  if (hasData) {
    args.push(parsed.dataType === 'json' ? 'json=data' : 'data=data');
  }

  lines.push(`response = requests.${parsed.method.toLowerCase()}(`);
  lines.push(`    ${args.join(',\n    ')}`);
  lines.push(')');
  lines.push('');
  lines.push('print(response.status_code)');
  lines.push('print(response.text)');

  return lines.join('\n');
}

function generateJavaScript(parsed: ParsedCurl): string {
  const lines: string[] = [];
  
  const hasHeaders = Object.keys(parsed.headers).length > 0;
  const hasData = !!parsed.data;

  lines.push('const options = {');
  lines.push(`  method: '${parsed.method}',`);
  
  if (hasHeaders) {
    lines.push('  headers: {');
    Object.entries(parsed.headers).forEach(([key, value]) => {
      lines.push(`    '${key}': '${value}',`);
    });
    lines.push('  },');
  }

  if (hasData) {
    if (parsed.dataType === 'json') {
      lines.push(`  body: JSON.stringify(${parsed.data}),`);
    } else {
      lines.push(`  body: '${parsed.data}',`);
    }
  }

  lines.push('};');
  lines.push('');
  lines.push(`fetch('${parsed.url}', options)`);
  lines.push('  .then(response => response.json())');
  lines.push('  .then(data => console.log(data))');
  lines.push('  .catch(error => console.error(error));');

  return lines.join('\n');
}

function generateGo(parsed: ParsedCurl): string {
  const lines: string[] = [
    'package main',
    '',
    'import (',
    '    "fmt"',
    '    "io"',
    '    "net/http"',
  ];

  if (parsed.data) {
    lines.push('    "strings"');
  }

  lines.push(')');
  lines.push('');
  lines.push('func main() {');

  if (parsed.data) {
    lines.push(`    body := strings.NewReader(\`${parsed.data}\`)`);
    lines.push(`    req, err := http.NewRequest("${parsed.method}", "${parsed.url}", body)`);
  } else {
    lines.push(`    req, err := http.NewRequest("${parsed.method}", "${parsed.url}", nil)`);
  }

  lines.push('    if err != nil {');
  lines.push('        panic(err)');
  lines.push('    }');
  lines.push('');

  Object.entries(parsed.headers).forEach(([key, value]) => {
    lines.push(`    req.Header.Set("${key}", "${value}")`);
  });

  if (Object.keys(parsed.headers).length > 0) {
    lines.push('');
  }

  lines.push('    client := &http.Client{}');
  lines.push('    resp, err := client.Do(req)');
  lines.push('    if err != nil {');
  lines.push('        panic(err)');
  lines.push('    }');
  lines.push('    defer resp.Body.Close()');
  lines.push('');
  lines.push('    respBody, _ := io.ReadAll(resp.Body)');
  lines.push('    fmt.Println(string(respBody))');
  lines.push('}');

  return lines.join('\n');
}

function generateJava(parsed: ParsedCurl): string {
  const lines: string[] = [
    'import java.net.http.HttpClient;',
    'import java.net.http.HttpRequest;',
    'import java.net.http.HttpResponse;',
    'import java.net.URI;',
    '',
    'public class Main {',
    '    public static void main(String[] args) throws Exception {',
    '        HttpClient client = HttpClient.newHttpClient();',
    '',
  ];

  lines.push('        HttpRequest request = HttpRequest.newBuilder()');
  lines.push(`            .uri(URI.create("${parsed.url}"))`);

  Object.entries(parsed.headers).forEach(([key, value]) => {
    lines.push(`            .header("${key}", "${value}")`);
  });

  if (parsed.data) {
    lines.push(`            .${parsed.method}(HttpRequest.BodyPublishers.ofString("${parsed.data.replace(/"/g, '\\"')}"))`);
  } else {
    lines.push(`            .${parsed.method}(HttpRequest.BodyPublishers.noBody())`);
  }

  lines.push('            .build();');
  lines.push('');
  lines.push('        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());');
  lines.push('        System.out.println(response.body());');
  lines.push('    }');
  lines.push('}');

  return lines.join('\n');
}

function generatePhp(parsed: ParsedCurl): string {
  const lines: string[] = ['<?php', ''];
  
  lines.push('$ch = curl_init();');
  lines.push('');
  lines.push(`curl_setopt($ch, CURLOPT_URL, "${parsed.url}");`);
  lines.push('curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);');

  if (parsed.method !== 'GET') {
    lines.push(`curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "${parsed.method}");`);
  }

  if (Object.keys(parsed.headers).length > 0) {
    lines.push('curl_setopt($ch, CURLOPT_HTTPHEADER, [');
    Object.entries(parsed.headers).forEach(([key, value]) => {
      lines.push(`    "${key}: ${value}",`);
    });
    lines.push(']);');
  }

  if (parsed.data) {
    lines.push(`curl_setopt($ch, CURLOPT_POSTFIELDS, '${parsed.data}');`);
  }

  lines.push('');
  lines.push('$response = curl_exec($ch);');
  lines.push('curl_close($ch);');
  lines.push('');
  lines.push('echo $response;');

  return lines.join('\n');
}

function generateRuby(parsed: ParsedCurl): string {
  const lines: string[] = [
    "require 'net/http'",
    "require 'uri'",
    "require 'json'",
    '',
  ];

  lines.push(`uri = URI.parse("${parsed.url}")`);
  lines.push('http = Net::HTTP.new(uri.host, uri.port)');
  lines.push('http.use_ssl = uri.scheme == "https"');
  lines.push('');

  const methodClass = parsed.method.charAt(0) + parsed.method.slice(1).toLowerCase();
  lines.push(`request = Net::HTTP::${methodClass}.new(uri.request_uri)`);

  Object.entries(parsed.headers).forEach(([key, value]) => {
    lines.push(`request["${key}"] = "${value}"`);
  });

  if (parsed.data) {
    lines.push(`request.body = '${parsed.data}'`);
  }

  lines.push('');
  lines.push('response = http.request(request)');
  lines.push('puts response.body');

  return lines.join('\n');
}

export default function CurlToCodeGenerator() {
  const t = useTranslations('tools');
  const [curlCommand, setCurlCommand] = useState('');
  const [language, setLanguage] = useState('python');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleConvert = useCallback(() => {
    try {
      if (!curlCommand.trim()) {
        setError(t('errorInvalidInput'));
        setOutput('');
        return;
      }

      const parsed = parseCurlCommand(curlCommand);
      
      if (!parsed.url) {
        setError(t('errorInvalidInput'));
        setOutput('');
        return;
      }

      let code = '';
      switch (language) {
        case 'python':
          code = generatePython(parsed);
          break;
        case 'javascript':
          code = generateJavaScript(parsed);
          break;
        case 'go':
          code = generateGo(parsed);
          break;
        case 'java':
          code = generateJava(parsed);
          break;
        case 'php':
          code = generatePhp(parsed);
          break;
        case 'ruby':
          code = generateRuby(parsed);
          break;
        default:
          code = generatePython(parsed);
      }

      setOutput(code);
      setError('');
    } catch (e) {
      setError((e as Error).message);
      setOutput('');
    }
  }, [curlCommand, language, t]);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [output]);

  const handleClear = useCallback(() => {
    setCurlCommand('');
    setOutput('');
    setError('');
  }, []);

  const exampleCurl = `curl -X POST 'https://api.example.com/users' \\
  -H 'Content-Type: application/json' \\
  -H 'Authorization: Bearer token123' \\
  -d '{"name": "John", "email": "john@example.com"}'`;

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('convert')} → 
        </label>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="w-full sm:w-auto px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        >
          <option value="python">Python (requests)</option>
          <option value="javascript">JavaScript (fetch)</option>
          <option value="go">Go (net/http)</option>
          <option value="java">Java (HttpClient)</option>
          <option value="php">PHP (cURL)</option>
          <option value="ruby">Ruby (Net::HTTP)</option>
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              cURL {t('input')}
            </label>
            <button
              onClick={() => setCurlCommand(exampleCurl)}
              className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400"
            >
              {t('sql.loadExample')}
            </button>
          </div>
          <textarea
            value={curlCommand}
            onChange={(e) => setCurlCommand(e.target.value)}
            placeholder="curl -X GET 'https://api.example.com/data' -H 'Authorization: Bearer token'"
            className="w-full h-64 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono text-sm resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {language.charAt(0).toUpperCase() + language.slice(1)} {t('output')}
          </label>
          <textarea
            value={output}
            readOnly
            placeholder={t('outputPlaceholder')}
            className="w-full h-64 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white font-mono text-sm resize-none"
          />
        </div>
      </div>

      <div className="flex gap-3 flex-wrap">
        <button
          onClick={handleConvert}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          {t('convert')}
        </button>
        {output && (
          <button
            onClick={handleCopy}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
          >
            {copied ? t('copied') : t('copy')}
          </button>
        )}
        <button
          onClick={handleClear}
          className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
        >
          {t('clear')}
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400">
          {error}
        </div>
      )}
    </div>
  );
}
