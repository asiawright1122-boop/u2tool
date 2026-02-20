<script lang="ts">
  import { onDestroy } from 'svelte';

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
  function tr(key: string): string {
    const scope = translations['tools']['robots-txt-generator'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.robots-txt-generator.${key}`;
  }

  // Types
  interface Rule {
  userAgent: string;
  allow: string[];
  disallow: string[];
}

  let rules = $state([
    { userAgent: '*', allow: ['/'], disallow: ['/admin/', '/private/'] }
  ]);

  let sitemap = $state('');

  let crawlDelay = $state('');

  let copied = $state(false);

  let timerRef = $state(null);  onDestroy(() => {
    if (timerRef) clearTimeout(timerRef);
  });

  // Functions
  function addRule() {
    rules = [...rules, { userAgent: '*', allow: [], disallow: [] }];
  }
  function removeRule(index: number) {
    rules = rules.filter((_, i) => i !== index);
  }
  function updateRule(index: number, field: keyof Rule, value: string | string[]) {
    const newRules = [...rules];
    newRules[index] = { ...newRules[index], [field]: value };
    rules = newRules;
  }
  function generateRobotsTxt() {
    let output = '';
    
    rules.forEach((rule, index) => {
      if (index > 0) output += '\n';
      output += `User-agent: ${rule.userAgent}\n`;
      
      rule.allow.forEach(path => {
        if (path.trim()) output += `Allow: ${path.trim()}\n`;
      });
      
      rule.disallow.forEach(path => {
        if (path.trim()) output += `Disallow: ${path.trim()}\n`;
      });
      
      if (crawlDelay && rule.userAgent === '*') {
        output += `Crawl-delay: ${crawlDelay}\n`;
      }
    });
    
    if (sitemap) {
      output += `\nSitemap: ${sitemap}`;
    }
    
    return output;
  }
  const output = generateRobotsTxt();
  async function copyOutput() {
    await navigator.clipboard.writeText(output);
    copied = true;
    if (timerRef) clearTimeout(timerRef);
    timerRef = setTimeout(() => copied = false, 2000);
  }
  function loadPreset(preset: string) {
    switch (preset) {
      case 'allow-all':
        rules = [{ userAgent: '*', allow: ['/'], disallow: [] }];
        break;
      case 'block-all':
        rules = [{ userAgent: '*', allow: [], disallow: ['/'] }];
        break;
      case 'standard':
        rules = [{ userAgent: '*', allow: ['/'], disallow: ['/admin/', '/api/', '/private/', '/*.json$'] }];
        break;
      case 'wordpress':
        rules = [{ userAgent: '*', allow: ['/'], disallow: ['/wp-admin/', '/wp-includes/', '/wp-content/plugins/', '/trackback/', '/feed/', '/comments/'] }];
        break;
    }
  }

</script>


    <div class="space-y-6">
      <div class="flex flex-wrap gap-2">
        <button onclick={() => loadPreset('allow-all')} class="btn-secondary text-sm">{tr('allowAll')}</button>
        <button onclick={() => loadPreset('block-all')} class="btn-secondary text-sm">{tr('blockAll')}</button>
        <button onclick={() => loadPreset('standard')} class="btn-secondary text-sm">{tr('standard')}</button>
        <button onclick={() => loadPreset('wordpress')} class="btn-secondary text-sm">{tr('wordpress')}</button>
      </div>

      {#each rules as rule, index (index)}
<div  class="p-4 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg space-y-3">
          <div class="flex justify-between items-center">
            <h3 class="font-medium text-gray-900 dark:text-white">{tr('rule', { index: index + 1 })}</h3>
            {#if rules.length > 1}
<button onclick={() => removeRule(index)} class="text-red-400 hover:text-red-300 text-sm">
                {tr('remove')}
              </button>
{/if}
          </div>
          
          <div>
            <label class="block text-sm text-gray-600 dark:text-gray-300 mb-1">{tr('userAgent')}</label>
            <input
              type="text"
              value={rule.userAgent}
              onchange={(e) => updateRule(index, 'userAgent', e.target.value)}
              class="tool-input"
              placeholder="*"
            />
          </div>
          
          <div>
            <label class="block text-sm text-gray-600 dark:text-gray-300 mb-1">{tr('allow')}</label>
            <textarea
              value={rule.allow.join('\n')}
              onchange={(e) => updateRule(index, 'allow', e.target.value.split('\n'))}
              class="tool-input"
              rows={2}
              placeholder="/public/"
            />
          </div>
          
          <div>
            <label class="block text-sm text-gray-600 dark:text-gray-300 mb-1">{tr('disallow')}</label>
            <textarea
              value={rule.disallow.join('\n')}
              onchange={(e) => updateRule(index, 'disallow', e.target.value.split('\n'))}
              class="tool-input"
              rows={2}
              placeholder="/admin/&#10;/private/"
            />
          </div>
        </div>
{/each}

      <button onclick={addRule} class="btn-secondary">{tr('addRule')}</button>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium mb-2">{tr('sitemapUrl')}</label>
          <input
            type="text"
            bind:value={sitemap}
            class="tool-input"
            placeholder="https://example.com/sitemap.xml"
          />
        </div>
        <div>
          <label class="block text-sm font-medium mb-2">{tr('crawlDelay')}</label>
          <input
            type="number"
            bind:value={crawlDelay}
            class="tool-input"
            placeholder="10"
          />
        </div>
      </div>

      <div>
        <div class="flex justify-between items-center mb-2">
          <label class="text-sm font-medium">{tr('output')}</label>
          <button
            onclick={copyOutput}
            class={`text-sm px-3 py-1 rounded ${copied ? 'bg-green-600' : 'bg-gray-700 hover:bg-gray-600'}`}
          >
            {copied ? t('copied') : t('copy')}
          </button>
        </div>
        <pre class="tool-textarea font-mono text-sm whitespace-pre-wrap">{output}</pre>
      </div>
    </div>
  
