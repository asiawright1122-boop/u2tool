<script lang="ts">
  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['swagger-to-code-generator'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.swagger-to-code-generator.${key}`;
  }
  function tCommon(key: string): string {
    const scope = translations['tools'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.${key}`;
  }

  // Types
  type Language = 'typescript' | 'javascript' | 'python' | 'go' | 'java';
  interface OpenAPIPath {
  [method: string]: {
    operationId?: string;
    summary?: string;
    parameters?: Array<{
      name: string;
      in: string;
      required?: boolean;
      schema?: { type: string };
    }>;
    requestBody?: {
      content?: {
        [contentType: string]: {
          schema?: { $ref?: string; type?: string };
        };
      };
    };
    responses?: {
      [code: string]: {
        description?: string;
        content?: {
          [contentType: string]: {
            schema?: { $ref?: string; type?: string };
          };
        };
      };
    };
  };
}
  interface OpenAPISpec {
  openapi?: string;
  swagger?: string;
  info?: { title?: string; version?: string };
  servers?: Array<{ url: string }>;
  paths?: { [path: string]: OpenAPIPath };
  components?: {
    schemas?: { [name: string]: unknown };
  };
}

  let input = $state('');

  let language = $state('typescript');

  let copied = $state(false);

  let result = $derived.by(() => {
    if (!input.trim()) return null;
    try {
      const spec = JSON.parse(input) as OpenAPISpec;
      switch (language) {
        case 'typescript':
        case 'javascript':
          return generateTypeScript(spec);
        case 'python':
          return generatePython(spec);
        case 'go':
          return generateGo(spec);
        default:
          return generateTypeScript(spec);
      }
    } catch {
      return null;
    }
  });

  function handleCopy() {
    if (result) {
      navigator.clipboard.writeText(result);
      copied = true;
      setTimeout(() => copied = false, 2000);
    }
  }

  function loadExample() {
    input = JSON.stringify(EXAMPLE_SPEC, null, 2);
  }

</script>


    <div class="space-y-6">
      <!-- Input -->
      <div>
        <div class="flex justify-between items-center mb-2">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
            OpenAPI/Swagger Spec (JSON)
          </label>
          <button
            onclick={loadExample}
            class="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400"
          >
            {t('loadExample')}
          </button>
        </div>
        <textarea
          bind:value={input}
          placeholder={t("inputPlaceholder")}
          class="w-full h-64 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono text-sm resize-none"></textarea>
      </div>

      <!-- Language Selection -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Target Language
        </label>
        <div class="flex flex-wrap gap-2">
          {#each (['typescript', 'python', 'go'] as const) as lang (lang)}
<button 
              onclick={() => language = lang}
              class={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                language === lang
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {lang === 'typescript' ? 'TypeScript' : lang === 'python' ? 'Python' : 'Go'}
            </button>
{/each}
        </div>
      </div>

      <!-- Error -->
      {#if input.trim()}
!result && (
        <div class="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400">
          Invalid OpenAPI/Swagger spec. Please check the JSON format.
        </div>
      )
{/if}

      <!-- Result -->
      {#if result}
<div>
          <div class="flex justify-between items-center mb-2">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Generated API Client
            </label>
            <button
              onclick={handleCopy}
              class="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
            >
              {copied ? tCommon('copied') : tCommon('copy')}
            </button>
          </div>
          <pre class="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg overflow-x-auto text-sm font-mono text-gray-800 dark:text-gray-200 max-h-96">
            {result}
          </pre>
        </div>
{/if}

      <!-- Info -->
      <div class="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <h4 class="text-sm font-medium text-blue-800 dark:text-blue-300 mb-2">Supported Features</h4>
        <ul class="text-sm text-blue-700 dark:text-blue-400 space-y-1">
          <li>• OpenAPI 3.0 and Swagger 2.0 specs</li>
          <li>• Path parameters and query parameters</li>
          <li>• Request body for POST/PUT/PATCH</li>
          <li>• Generates typed API client functions</li>
        </ul>
      </div>
    </div>
  
