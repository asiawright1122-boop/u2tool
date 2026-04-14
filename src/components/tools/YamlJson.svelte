<script lang="ts">
  import { jsonToYaml, parseYaml } from '@/lib/tool-stubs';

  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['yamlJson'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.yamlJson.${key}`;
  }
  function tg(key: string): string {
    const scope = translations['tools'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.${key}`;
  }

  let yaml = $state(`name: John Doe
age: 30
active: true
skills:
  - JavaScript
  - TypeScript
  - React
address:
  city: New York
  country: USA`);

  let json = $state('');

  let error = $state('');

  // Functions
  function yamlToJson() {
    error = '';
    try {
      const parsed = parseYaml(yaml);
      json = JSON.stringify(parsed, null, 2);
    } catch (_e) {
      error = t('invalidYaml');
    }
  }
  function jsonToYamlConvert() {
    error = '';
    try {
      const parsed = JSON.parse(json);
      yaml = jsonToYaml(parsed);
    } catch (_e) {
      error = t('invalidJson');
    }
  }
  function copyYaml() { return navigator.clipboard.writeText(yaml); }
  function copyJson() { return navigator.clipboard.writeText(json); }

</script>


    <div class="space-y-4">
      {#if error}
<div class="tool-error">
          {error}
        </div>
{/if}

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <div class="flex justify-between items-center mb-2">
            <label class="text-sm text-gray-600 dark:text-gray-300">YAML</label>
            <div class="flex gap-2">
              <button
                onclick={copyYaml}
                class="px-3 py-1 text-sm bg-gray-200 dark:bg-gray-600 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-700 rounded transition-colors"
              >
                {tg('copy')}
              </button>
              <button
                onclick={yamlToJson}
                class="px-3 py-1 text-sm bg-amber-600 hover:bg-amber-700 text-white rounded transition-colors"
              >
                → JSON
              </button>
            </div>
          </div>
          <textarea
            bind:value={yaml}
            class="tool-textarea-tall"
            placeholder={t('yamlPlaceholder')}
            spellCheck={false}></textarea>
        </div>

        <div>
          <div class="flex justify-between items-center mb-2">
            <label class="text-sm text-gray-600 dark:text-gray-300">JSON</label>
            <div class="flex gap-2">
              <button
                onclick={jsonToYamlConvert}
                class="px-3 py-1 text-sm bg-emerald-500 hover:bg-green-700 text-white rounded transition-colors"
              >
                ← YAML
              </button>
              <button
                onclick={copyJson}
                class="px-3 py-1 text-sm bg-gray-200 dark:bg-gray-600 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-700 rounded transition-colors"
              >
                {tg('copy')}
              </button>
            </div>
          </div>
          <textarea
            bind:value={json}
            class="tool-textarea-tall"
            placeholder={t('jsonPlaceholder')}
            spellCheck={false}></textarea>
        </div>
      </div>
    </div>
  
