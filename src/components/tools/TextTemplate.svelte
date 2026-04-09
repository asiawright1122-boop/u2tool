<script lang="ts">
  import { extractVariables, processTemplate } from '@/lib/tool-stubs';

  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['text-template'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.text-template.${key}`;
  }

  let template = $state('Hello, {{ name }}!\n\nWelcome to {{ company }}.\nYour role is {{ role }}.');

  let variables = $state({
    name: 'John',
    company: 'Acme Inc',
    role: 'Developer'
  });

  let output = $state('');

  // Functions
  const detectedVars = extractVariables(template);
  function handleProcess() {
    output = processTemplate(template, variables);
  }
  function handleVariableChange(key: string, value: string) {
    variables = ({ ...variables, [key]: value });
  }
  function handleCopy() {
    navigator.clipboard.writeText(output);
  }

</script>


    <div class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('template')}
        </label>
        <textarea
          bind:value={template}
          class="w-full h-32 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-4 py-2 text-gray-900 dark:text-white font-mono text-sm focus:outline-none focus:border-blue-500"
          placeholder={t('templatePlaceholder')}></textarea>
        <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">{t('syntaxHint')}</p>
      </div>

      {#if detectedVars.length > 0}
<div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('variables')} ({detectedVars.length})
          </label>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            {#each detectedVars as varName (varName)}
<div  class="flex items-center gap-2">
                <span class="text-sm text-blue-600 dark:text-blue-400 font-mono min-w-[100px]">
                  {`{{ ${varName} }}`}
                </span>
                <input
                  type="text"
                  value={variables[varName] || ''}
                  onchange={(e) => handleVariableChange(varName, e.target.value)}
                  class="flex-1 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded px-3 py-1 text-gray-900 dark:text-white text-sm focus:outline-none focus:border-blue-500"
                  placeholder={t('valuePlaceholder')}
                />
              </div>
{/each}
          </div>
        </div>
{/if}

      <button
        onclick={handleProcess}
        class="w-full px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        {t('process')}
      </button>

      {#if output}
<div>
          <div class="flex justify-between items-center mb-2">
            <label class="text-sm font-medium text-gray-700 dark:text-gray-300">{t('result')}</label>
            <button
              onclick={handleCopy}
              class="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300"
            >
              {t('copy')}
            </button>
          </div>
          <pre class="w-full bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-4 py-3 text-green-600 dark:text-green-400 font-mono text-sm whitespace-pre-wrap">
            {output}
          </pre>
        </div>
{/if}
    </div>
  
