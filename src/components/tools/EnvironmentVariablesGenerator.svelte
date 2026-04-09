<script lang="ts">
  import { PRESETS, generateExampleFile, generateOutput } from '@/lib/tool-stubs';

  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['environment-variables-generator'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.environment-variables-generator.${key}`;
  }
  function tCommon(key: string): string {
    const scope = translations['tools'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.${key}`;
  }

  // Types
  type OutputFormat = 'env' | 'json' | 'yaml' | 'docker' | 'shell';
  interface EnvVar {
  id: string;
  key: string;
  value: string;
  description: string;
  required: boolean;
  secret: boolean;
}

  let vars = $state([
    { id: '1', key: 'NODE_ENV', value: 'development', description: 'Node environment', required: true, secret: false },
    { id: '2', key: 'PORT', value: '3000', description: 'Server port', required: true, secret: false },
  ]);

  let format = $state('env');

  let copied = $state(null);

  function addVar() {
    vars = [...vars, { id: Date.now().toString(), key: '', value: '', description: '', required: false, secret: false }];
  }

  function removeVar(id: string) {
    vars = vars.filter(v => v.id !== id);
  }

  function updateVar(id: string, field: keyof EnvVar, value: string | boolean) {
    vars = vars.map(v => v.id === id ? { ...v, [field]: value } : v);
  }

  function applyPreset(preset: keyof typeof PRESETS) {
    vars = PRESETS[preset].map((v, i) => ({ ...v, id: Date.now().toString() + i }));
  }

  let output = $derived(generateOutput(vars, format));

  let exampleOutput = $derived(generateExampleFile(vars));

  function handleCopy(text: string, key: string) {
    navigator.clipboard.writeText(text);
    copied = key;
    setTimeout(() => copied = null, 2000);
  }

</script>


    <div class="space-y-6">
      <!-- Presets -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Quick Presets</label>
        <div class="flex flex-wrap gap-2">
          {#each Object.keys(PRESETS) as preset (preset)}
<button 
              onclick={() => applyPreset(preset as keyof typeof PRESETS)}
              class="px-3 py-1.5 text-sm bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50"
            >
              {preset.charAt(0).toUpperCase() + preset.slice(1)}
            </button>
{/each}
        </div>
      </div>

      <!-- Variables -->
      <div>
        <div class="flex justify-between items-center mb-2">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Environment Variables</label>
          <button onclick={addVar} class="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400">+ Add Variable</button>
        </div>
        <div class="space-y-2 max-h-64 overflow-y-auto">
          {#each vars as v (v.id)}
<div  class="flex items-start gap-2 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div class="flex-1 grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={v.key}
                  onchange={(e) => updateVar(v.id, 'key', e.target.value.toUpperCase().replace(/[^A-Z0-9_]/g, '_'))}
                  placeholder={t("keyNamePlaceholder")}
                  class="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm font-mono"
                />
                <input
                  type={v.secret ? 'password' : 'text'}
                  value={v.value}
                  onchange={(e) => updateVar(v.id, 'value', e.target.value)}
                  placeholder={t("valuePlaceholder")}
                  class="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                />
              </div>
              <input
                type="text"
                value={v.description}
                onchange={(e) => updateVar(v.id, 'description', e.target.value)}
                placeholder={t("descriptionPlaceholder")}
                class="w-32 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-xs"
              />
              <label class="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
                <input type="checkbox" checked={v.required} onchange={(e) => updateVar(v.id, 'required', e.target.checked)} class="rounded" />
                Req
              </label>
              <label class="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
                <input type="checkbox" checked={v.secret} onchange={(e) => updateVar(v.id, 'secret', e.target.checked)} class="rounded" />
                Secret
              </label>
              <button onclick={() => removeVar(v.id)} class="text-red-500 hover:text-red-600">✕</button>
            </div>
{/each}
        </div>
      </div>

      <!-- Format Selection -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{tCommon('output')} Format</label>
        <div class="flex flex-wrap gap-2">
          {#each (['env', 'json', 'yaml', 'docker', 'shell'] as const) as fmt (fmt)}
<button 
              onclick={() => format = fmt}
              class={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                format === fmt
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {fmt === 'env' ? '.env' : fmt.toUpperCase()}
            </button>
{/each}
        </div>
      </div>

      <!-- Output -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <div class="flex justify-between items-center mb-2">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">{tCommon('output')}</label>
            <button onclick={() => handleCopy(output, 'output')} class="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400">
              {copied === 'output' ? tCommon('copied') : tCommon('copy')}
            </button>
          </div>
          <pre class="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg overflow-x-auto text-sm font-mono text-gray-800 dark:text-gray-200 h-48">
            {output}
          </pre>
        </div>
        <div>
          <div class="flex justify-between items-center mb-2">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">.env.example</label>
            <button onclick={() => handleCopy(exampleOutput, 'example')} class="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400">
              {copied === 'example' ? tCommon('copied') : tCommon('copy')}
            </button>
          </div>
          <pre class="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg overflow-x-auto text-sm font-mono text-gray-800 dark:text-gray-200 h-48">
            {exampleOutput}
          </pre>
        </div>
      </div>
    </div>
  
