<script lang="ts">
  import { parseCurlCommand, generateJavaScript, generatePython, generatePhp, generateGo, generateJava } from '@/lib/runtime-integrity/curl';
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
  function convert() {
    const parsed = parseCurlCommand(curlCommand);
    const generators = { javascript: generateJavaScript, python: generatePython, php: generatePhp, go: generateGo, java: generateJava };
    output = generators[language as OutputLanguage](parsed);
  }
  function copyOutput() {
    navigator.clipboard.writeText(output);
  }

</script>


    <div class="space-y-6">
      <div>
        <label for="curl-converter-field-5" class="block text-sm text-gray-700 dark:text-gray-300 mb-2">{t('curlCommand')}</label>
        <textarea
          bind:value={curlCommand}
          class="w-full h-32 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-3 font-mono text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:border-amber-500"
          placeholder={t('placeholder')} id="curl-converter-field-5"></textarea>
      </div>

      <div class="flex flex-wrap gap-4 items-center">
        <div>
          <label for="curl-converter-field-4" class="block text-sm text-gray-700 dark:text-gray-300 mb-2">{t('outputLanguage')}</label>
          <select
            value={language}
            onchange={(e) => language = e.target.value as OutputLanguage}
            class="bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-amber-500" id="curl-converter-field-4">
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
          <div class="block text-sm text-gray-700 dark:text-gray-300 mb-2">{t('generatedCode')}</div>
          <pre class="w-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-3 font-mono text-sm text-gray-900 dark:text-gray-100 overflow-x-auto">
            <code>{output}</code>
          </pre>
        </div>
{/if}
    </div>
  
