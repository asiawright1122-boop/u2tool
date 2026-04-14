<script lang="ts">
  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['curl-converter'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.curl-converter.${key}`;
  }

  // Types
  type OutputLanguage = 'javascript' | 'python' | 'php' | 'go' | 'java';

  let curlCommand = $state(`curl -X POST https://api.example.com/users \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer token123" \\
  -d '{"name": "John", "email": "john@example.com"}'`);

  let language = $state('javascript');

  let output = $state('');

  // Functions
  function parseCurl(curl: string) {
    const result = {
      method: 'GET',
      url: '',
      headers: {} as Record<string, string>,
      data: '',
    };

    // Clean up the command
    const cleaned = curl.replace(/\\\n/g, ' ').replace(/\s+/g, ' ').trim();

    // Extract URL
    const urlMatch = cleaned.match(/curl\s+(?:-X\s+\w+\s+)?['"]?(https?:\/\/[^\s'"]+)['"]?/i) ||
                     cleaned.match(/['"]?(https?:\/\/[^\s'"]+)['"]?/);
    if (urlMatch) {
      result.url = urlMatch[1];
    }

    // Extract method
    const methodMatch = cleaned.match(/-X\s+(\w+)/i);
    if (methodMatch) {
      result.method = methodMatch[1].toUpperCase();
    }

    // Extract headers
    const headerRegex = /-H\s+['"]([^:]+):\s*([^'"]+)['"]/gi;
    let headerMatch;
    while ((headerMatch = headerRegex.exec(cleaned)) !== null) {
      result.headers[headerMatch[1].trim()] = headerMatch[2].trim();
    }

    // Extract data
    const dataMatch = cleaned.match(/-d\s+['"]([^'"]+)['"]\s*(?:-|$)/) ||
                      cleaned.match(/--data\s+['"]([^'"]+)['"]\s*(?:-|$)/) ||
                      cleaned.match(/-d\s+'([^']+)'/);
    if (dataMatch) {
      result.data = dataMatch[1];
    }

    return result;
  }
  function convert() {
    const parsed = parseCurl(curlCommand);
    let code = '';

    switch (language) {
      case 'javascript':
        code = generateJavaScript(parsed);
        break;
      case 'python':
        code = generatePython(parsed);
        break;
      case 'php':
        code = generatePhp(parsed);
        break;
      case 'go':
        code = generateGo(parsed);
        break;
      case 'java':
        code = generateJava(parsed);
        break;
    }

    output = code;
  }
  function generateJavaScript(parsed: ReturnType<typeof parseCurl>) {
    const headers = Object.entries(parsed.headers)
      .map(([k, v]) => `    '${k}': '${v}'`)
      .join(',\n');

    return `// Using fetch API
let response = await fetch('${parsed.url}', {
  method: '${parsed.method}',
  headers: {
${headers}
  }${parsed.data ? `,
  body: JSON.stringify(${parsed.data})` : ''}
});

let data = await response.json();
console.log(data);`;
  }
  function generatePython(parsed: ReturnType<typeof parseCurl>) {
    const headers = Object.entries(parsed.headers)
      .map(([k, v]) => `    '${k}': '${v}'`)
      .join(',\n');

    return `import requests

headers = {
${headers}
}
${parsed.data ? `
data = ${parsed.data}
` : ''}
response = requests.${parsed.method.toLowerCase()}(
    '${parsed.url}',
    headers=headers${parsed.data ? ',\n    json=data' : ''}
)

print(response.json())`;
  }
  function generatePhp(parsed: ReturnType<typeof parseCurl>) {
    const headers = Object.entries(parsed.headers)
      .map(([k, v]) => `    '${k}: ${v}'`)
      .join(',\n');

    return `<?php

$ch = curl_init();

curl_setopt_array($ch, [
    CURLOPT_URL => '${parsed.url}',
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_CUSTOMREQUEST => '${parsed.method}',
    CURLOPT_HTTPHEADER => [
${headers}
    ]${parsed.data ? `,
    CURLOPT_POSTFIELDS => '${parsed.data.replace(/'/g, "\\'")}'` : ''}
]);

$response = curl_exec($ch);
curl_close($ch);

$data = json_decode($response, true);
print_r($data);`;
  }
  function generateGo(parsed: ReturnType<typeof parseCurl>) {
    const headers = Object.entries(parsed.headers)
      .map(([k, v]) => `\treq.Header.Set("${k}", "${v}")`)
      .join('\n');

    return `package main

import (
\t"fmt"
\t"io"
\t"net/http"${parsed.data ? '\n\t"strings"' : ''}
)

func main() {
\t${parsed.data ? `body := strings.NewReader(\`${parsed.data}\`)
\treq, err := http.NewRequest("${parsed.method}", "${parsed.url}", body)` : `req, err := http.NewRequest("${parsed.method}", "${parsed.url}", nil)`}
\tif err != nil {
\t\tpanic(err)
\t}

${headers}

\tclient := &http.Client{}
\tresp, err := client.Do(req)
\tif err != nil {
\t\tpanic(err)
\t}
\tdefer resp.Body.Close()

\tdata, _ := io.ReadAll(resp.Body)
\tfmt.Println(string(data))
}`;
  }
  function generateJava(parsed: ReturnType<typeof parseCurl>) {
    const headers = Object.entries(parsed.headers)
      .map(([k, v]) => `        .header("${k}", "${v}")`)
      .join('\n');

    return `import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.net.URI;

public class Main {
    public static void main(String[] args) throws Exception {
        HttpClient client = HttpClient.newHttpClient();
        
        HttpRequest request = HttpRequest.newBuilder()
            .uri(URI.create("${parsed.url}"))
            .method("${parsed.method}", ${parsed.data ? `HttpRequest.BodyPublishers.ofString("${parsed.data.replace(/"/g, '\\"')}")` : 'HttpRequest.BodyPublishers.noBody()'})
${headers}
            .build();
        
        HttpResponse<String> response = client.send(request, 
            HttpResponse.BodyHandlers.ofString());
        
        System.out.println(response.body());
    }
}`;
  }
  function copyOutput() {
    navigator.clipboard.writeText(output);
  }

</script>


    <div class="space-y-6">
      <div>
        <label class="block text-sm text-gray-700 dark:text-gray-300 mb-2">{t('curlCommand')}</label>
        <textarea
          bind:value={curlCommand}
          class="w-full h-32 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-3 font-mono text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:border-amber-500"
          placeholder={t('placeholder')}></textarea>
      </div>

      <div class="flex flex-wrap gap-4 items-center">
        <div>
          <label class="block text-sm text-gray-700 dark:text-gray-300 mb-2">{t('outputLanguage')}</label>
          <select
            value={language}
            onchange={(e) => language = e.target.value as OutputLanguage}
            class="bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-amber-500"
          >
            <option value="javascript">{t('langJavaScript')}</option>
            <option value="python">{t('langPython')}</option>
            <option value="php">{t('langPhp')}</option>
            <option value="go">{t('langGo')}</option>
            <option value="java">{t('langJava')}</option>
          </select>
        </div>
        <button
          onclick={convert}
          class="btn-primary px-6 py-2 rounded-lg mt-6"
        >
          {t('convert')}
        </button>
        <button
          onclick={copyOutput}
          disabled={!output}
          class="btn-secondary px-6 py-2 rounded-lg mt-6 disabled:opacity-50"
        >
          {t('copyCode')}
        </button>
      </div>

      {#if output}
<div>
          <label class="block text-sm text-gray-700 dark:text-gray-300 mb-2">{t('generatedCode')}</label>
          <pre class="w-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-3 font-mono text-sm text-gray-900 dark:text-gray-100 overflow-x-auto">
            <code>{output}</code>
          </pre>
        </div>
{/if}
    </div>
  
