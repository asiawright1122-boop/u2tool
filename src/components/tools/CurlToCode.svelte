<script lang="ts">
  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['curl-to-code'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.curl-to-code.${key}`;
  }

  // Types
  type Language = 'javascript' | 'python' | 'php' | 'go' | 'java' | 'csharp' | 'ruby' | 'rust';

  let curlCommand = $state('');

  let selectedLang = $state('javascript');

  let output = $state('');

  let error = $state('');

  // Functions
  const languages: { value: Language; label: string }[] = [
    { value: 'javascript', label: 'JavaScript (fetch)' },
    { value: 'python', label: 'Python (requests)' },
    { value: 'php', label: 'PHP (cURL)' },
    { value: 'go', label: 'Go (net/http)' },
    { value: 'java', label: 'Java (HttpClient)' },
    { value: 'csharp', label: 'C# (HttpClient)' },
    { value: 'ruby', label: 'Ruby (Net::HTTP)' },
    { value: 'rust', label: 'Rust (reqwest)' },
  ];
  const sampleCurl = `curl -X POST 'https://api.example.com/users' \\
  -H 'Content-Type: application/json' \\
  -H 'Authorization: Bearer token123' \\
  -d '{"name": "John", "email": "john@example.com"}'`;
  function parseCurl(curl: string) {
    const result: {
      method: string;
      url: string;
      headers: Record<string, string>;
      data: string | null;
    } = {
      method: 'GET',
      url: '',
      headers: {},
      data: null,
    };

    // Normalize the curl command
    const normalized = curl.replace(/\\\n\s*/g, ' ').trim();
    
    // Extract URL
    const urlMatch = normalized.match(/curl\s+(?:-[A-Za-z]+\s+[^\s]+\s+)*['"]?(https?:\/\/[^\s'"]+)['"]?/i) ||
                     normalized.match(/['"]?(https?:\/\/[^\s'"]+)['"]?/);
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
    const dataMatch = normalized.match(/-d\s+['"](.+?)['"]\s*(?:-|$)/) ||
                      normalized.match(/--data\s+['"](.+?)['"]\s*(?:-|$)/) ||
                      normalized.match(/-d\s+['"](.+)['"]$/);
    if (dataMatch) {
      result.data = dataMatch[1];
      if (result.method === 'GET') {
        result.method = 'POST';
      }
    }

    return result;
  }
  function generateCode(lang: Language, parsed: ReturnType<typeof parseCurl>): string {
    const { method, url, headers, data } = parsed;
    const headerEntries = Object.entries(headers);

    switch (lang) {
      case 'javascript':
        return `fetch('${url}', {
  method: '${method}',${headerEntries.length > 0 ? `
  headers: {
${headerEntries.map(([k, v]) => `    '${k}': '${v}'`).join(',\n')}
  },` : ''}${data ? `
  body: JSON.stringify(${data})` : ''}
})
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));`;

      case 'python':
        return `import requests

response = requests.${method.toLowerCase()}(
    '${url}',${headerEntries.length > 0 ? `
    headers={
${headerEntries.map(([k, v]) => `        '${k}': '${v}'`).join(',\n')}
    },` : ''}${data ? `
    json=${data}` : ''}
)

print(response.json())`;

      case 'php':
        return `<?php
$ch = curl_init();

curl_setopt($ch, CURLOPT_URL, '${url}');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, '${method}');${headerEntries.length > 0 ? `
curl_setopt($ch, CURLOPT_HTTPHEADER, [
${headerEntries.map(([k, v]) => `    '${k}: ${v}'`).join(',\n')}
]);` : ''}${data ? `
curl_setopt($ch, CURLOPT_POSTFIELDS, '${data.replace(/'/g, "\\'")}');` : ''}

$response = curl_exec($ch);
curl_close($ch);

echo $response;`;

      case 'go':
        return `package main

import (
    "fmt"
    "io"
    "net/http"${data ? `
    "strings"` : ''}
)

func main() {
    ${data ? `body := strings.NewReader(\`${data}\`)
    req, err := http.NewRequest("${method}", "${url}", body)` : `req, err := http.NewRequest("${method}", "${url}", nil)`}
    if err != nil {
        panic(err)
    }
${headerEntries.map(([k, v]) => `    req.Header.Set("${k}", "${v}")`).join('\n')}

    client := &http.Client{}
    resp, err := client.Do(req)
    if err != nil {
        panic(err)
    }
    defer resp.Body.Close()

    respBody, _ := io.ReadAll(resp.Body)
    fmt.Println(string(respBody))
}`;

      case 'java':
        return `import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

public class Main {
    public static void main(String[] args) throws Exception {
        HttpClient client = HttpClient.newHttpClient();
        
        HttpRequest request = HttpRequest.newBuilder()
            .uri(URI.create("${url}"))
            .method("${method}", ${data ? `HttpRequest.BodyPublishers.ofString("${data.replace(/"/g, '\\"')}")` : 'HttpRequest.BodyPublishers.noBody()'})${headerEntries.map(([k, v]) => `
            .header("${k}", "${v}")`).join('')}
            .build();

        HttpResponse<String> response = client.send(request, 
            HttpResponse.BodyHandlers.ofString());
        
        System.out.println(response.body());
    }
}`;

      case 'csharp':
        return `using System;
using System.Net.Http;
using System.Threading.Tasks;

class Program
{
    static async Task Main()
    {
        using var client = new HttpClient();
        
        var request = new HttpRequestMessage(HttpMethod.${method.charAt(0) + method.slice(1).toLowerCase()}, "${url}");${headerEntries.map(([k, v]) => `
        request.Headers.Add("${k}", "${v}");`).join('')}${data ? `
        request.Content = new StringContent("${data.replace(/"/g, '\\"')}", System.Text.Encoding.UTF8, "application/json");` : ''}

        var response = await client.SendAsync(request);
        var content = await response.Content.ReadAsStringAsync();
        
        Console.WriteLine(content);
    }
}`;

      case 'ruby':
        return `require 'net/http'
require 'uri'
require 'json'

uri = URI.parse('${url}')
http = Net::HTTP.new(uri.host, uri.port)
http.use_ssl = uri.scheme == 'https'

request = Net::HTTP::${method.charAt(0) + method.slice(1).toLowerCase()}.new(uri.request_uri)${headerEntries.map(([k, v]) => `
request['${k}'] = '${v}'`).join('')}${data ? `
request.body = '${data}'` : ''}

response = http.request(request)
puts response.body`;

      case 'rust':
        return `use reqwest::header::{HeaderMap, HeaderValue};

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let client = reqwest::Client::new();
    
    let mut headers = HeaderMap::new();${headerEntries.map(([k, v]) => `
    headers.insert("${k}", HeaderValue::from_static("${v}"));`).join('')}

    let response = client
        .${method.toLowerCase()}("${url}")
        .headers(headers)${data ? `
        .body(r#"${data}"#)` : ''}
        .send()
        .await?;

    println!("{}", response.text().await?);
    Ok(())
}`;

      default:
        return '';
    }
  }
  function handleConvert() {
    error = '';
    if (!curlCommand.trim()) {
      error = t('errorEmpty');
      return;
    }

    if (!curlCommand.toLowerCase().includes('curl')) {
      error = t('errorInvalid');
      return;
    }

    try {
      const parsed = parseCurl(curlCommand);
      if (!parsed.url) {
        error = t('errorNoUrl');
        return;
      }
      const code = generateCode(selectedLang, parsed);
      output = code;
    } catch {
      error = t('errorParsing');
    }
  }
  function handleCopy() {
    navigator.clipboard.writeText(output);
  }

</script>


    <div class="space-y-6">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <label class="tool-label mb-0">
              {t('curlInput')}
            </label>
            <button
              onclick={() => curlCommand = sampleCurl}
              class="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
            >
              {t('loadSample')}
            </button>
          </div>
          <textarea
            bind:value={curlCommand}
            placeholder={t('placeholder')}
            class="tool-textarea"></textarea>
          
          <div class="space-y-2">
            <label class="tool-label">
              {t('targetLanguage')}
            </label>
            <select
              value={selectedLang}
              onchange={(e) => selectedLang = e.target.value as Language}
              class="tool-input"
            >
              {#each languages as lang (lang.value)}
<option  value={lang.value}>
                  {lang.label}
                </option>
{/each}
            </select>
          </div>

          <button
            onclick={handleConvert}
            class="btn-primary w-full"
          >
            {t('convert')}
          </button>

          {#if error}
<div class="tool-error">
              {error}
            </div>
{/if}
        </div>

        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <label class="tool-label mb-0">
              {t('codeOutput')}
            </label>
            {#if output}
<button
                onclick={handleCopy}
                class="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
              >
                {t('copy')}
              </button>
{/if}
          </div>
          <pre class="w-full h-96 p-3 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-mono text-sm overflow-auto whitespace-pre-wrap">
            {output || t('outputPlaceholder')}
          </pre>
        </div>
      </div>

      <div class="p-4 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-lg">
        <h3 class="font-medium text-blue-800 dark:text-blue-300 mb-2">{t('supportedFeatures')}</h3>
        <ul class="text-sm text-blue-700 dark:text-blue-400 space-y-1">
          <li>• {t('feature1')}</li>
          <li>• {t('feature2')}</li>
          <li>• {t('feature3')}</li>
          <li>• {t('feature4')}</li>
        </ul>
      </div>
    </div>
  
