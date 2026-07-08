<script lang="ts">
  import { generateGo, generateJava, generateJavaScript, generatePhp, generatePython, generateRuby, parseCurlCommand } from '@/lib/tool-stubs';

  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.${key}`;
  }

  // Types
  interface ParsedCurl {
  method: string;
  url: string;
  headers: Record<string, string>;
  data?: string;
  dataType?: 'json' | 'form' | 'raw';
}

  let curlCommand = $state('');

  let language = $state('python');

  let output = $state('');

  let error = $state('');

  let copied = $state(false);

  function handleConvert() {
    try {
      if (!curlCommand.trim()) {
        error = t('errorInvalidInput');
        output = '';
        return;
      }

      const parsed = parseCurlCommand(curlCommand);
      
      if (!parsed.url) {
        error = t('errorInvalidInput');
        output = '';
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

      output = code;
      error = '';
    } catch (e) {
      error = (e as Error).message;
      output = '';
    }
  }

  function handleCopy() {
    navigator.clipboard.writeText(output);
    copied = true;
    setTimeout(() => copied = false, 2000);
  }

  function handleClear() {
    curlCommand = '';
    output = '';
    error = '';
  }

  // Functions
  const exampleCurl = `curl -X POST 'https://api.example.com/users' \\
  -H 'Content-Type: application/json' \\
  -H 'Authorization: Bearer token123' \\
  -d '{"name": "John", "email": "john@example.com"}'`;

</script>


    <div class="space-y-6">
      <div>
        <label for="curl-to-code-generator-field-5" class="tool-label">
          {t('convert')} → 
        </label>
        <select
          bind:value={language}
          class="w-full sm:w-auto px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white" id="curl-to-code-generator-field-5">
          <option value="python">Python (requests)</option>
          <option value="javascript">JavaScript (fetch)</option>
          <option value="go">Go (net/http)</option>
          <option value="java">Java (HttpClient)</option>
          <option value="php">PHP (cURL)</option>
          <option value="ruby">Ruby (Net::HTTP)</option>
        </select>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <div class="flex justify-between items-center mb-2">
            <div class="tool-label">
              cURL {t('input')}
            </div>
            <button
              onclick={() => curlCommand = exampleCurl}
              class="text-xs text-amber-600 hover:text-amber-700 dark:text-amber-400"
            >
              {t('sql.loadExample')}
            </button>
          </div>
          <textarea
            bind:value={curlCommand}
            placeholder="curl -X GET 'https://api.example.com/data' -H 'Authorization: Bearer token'"
            class="w-full h-64 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono text-sm resize-none"></textarea>
        </div>

        <div>
          <label for="curl-to-code-generator-field-4" class="tool-label">
            {language.charAt(0).toUpperCase() + language.slice(1)} {t('output')}
          </label>
          <textarea
            value={output}
            readOnly
            placeholder={t('outputPlaceholder')}
            class="w-full h-64 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white font-mono text-sm resize-none" id="curl-to-code-generator-field-4"></textarea>
        </div>
      </div>

      <div class="flex gap-3 flex-wrap">
        <button
          onclick={handleConvert}
          class="px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-medium"
        >
          {t('convert')}
        </button>
        {#if output}
<button
            onclick={handleCopy}
            class="px-6 py-2 btn-success rounded-lg hover:bg-green-700 transition-colors font-medium"
          >
            {copied ? t('copied') : t('copy')}
          </button>
{/if}
        <button
          onclick={handleClear}
          class="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
        >
          {t('clear')}
        </button>
      </div>

      {#if error}
<div class="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400">
          {error}
        </div>
{/if}
    </div>
  
