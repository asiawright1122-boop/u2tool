<script lang="ts">
  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['email-signature-generator'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.email-signature-generator.${key}`;
  }
  function tCommon(key: string): string {
    const scope = translations['tools'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.${key}`;
  }

  // Types
  interface SignatureConfig {
  name: string;
  title: string;
  company: string;
  email: string;
  phone: string;
  website: string;
  linkedin: string;
  twitter: string;
  github: string;
  style: 'professional' | 'modern' | 'minimal';
  primaryColor: string;
}
  interface SignatureResult {
  html: string;
  plainText: string;
}

  let config = $state({
    name: '',
    title: '',
    company: '',
    email: '',
    phone: '',
    website: '',
    linkedin: '',
    twitter: '',
    github: '',
    style: 'professional',
    primaryColor: '#2563eb',
  });

  let result = $state(null);

  let copied = $state(null);

  let activeTab = $state('preview');

  function handleGenerate() {
    result = generateSignature(config);
  }

  // Functions
  async function copyToClipboard(text: string, type: string) {
    await navigator.clipboard.writeText(text);
    copied = type;
    setTimeout(() => copied = null, 2000);
  }
  function clearAll() {
    config = {
      name: '',
      title: '',
      company: '',
      email: '',
      phone: '',
      website: '',
      linkedin: '',
      twitter: '',
      github: '',
      style: 'professional',
      primaryColor: '#2563eb',
    };
    result = null;
  }
  const styles: { id: 'professional' | 'modern' | 'minimal'; name: string }[] = [
    { id: 'professional', name: t('styleProfessional') },
    { id: 'modern', name: t('styleModern') },
    { id: 'minimal', name: t('styleMinimal') },
  ];
  const colors = ['#2563eb', '#059669', '#dc2626', '#7c3aed', '#ea580c', '#0891b2', '#4f46e5', '#be185d'];

</script>


    <div class="space-y-6">
      <!-- Personal Info -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('name')}
          </label>
          <input
            type="text"
            value={config.name}
            onchange={(e) => config = ({ ...config, name: e.target.value })}
            placeholder={t('namePlaceholder')}
            class="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('title')}
          </label>
          <input
            type="text"
            value={config.title}
            onchange={(e) => config = ({ ...config, title: e.target.value })}
            placeholder={t('titlePlaceholder')}
            class="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('company')}
          </label>
          <input
            type="text"
            value={config.company}
            onchange={(e) => config = ({ ...config, company: e.target.value })}
            placeholder={t('companyPlaceholder')}
            class="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('email')}
          </label>
          <input
            type="email"
            value={config.email}
            onchange={(e) => config = ({ ...config, email: e.target.value })}
            placeholder={t('emailPlaceholder')}
            class="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('phone')}
          </label>
          <input
            type="tel"
            value={config.phone}
            onchange={(e) => config = ({ ...config, phone: e.target.value })}
            placeholder={t('phonePlaceholder')}
            class="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('website')}
          </label>
          <input
            type="text"
            value={config.website}
            onchange={(e) => config = ({ ...config, website: e.target.value })}
            placeholder={t('websitePlaceholder')}
            class="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <!-- Social Links -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            LinkedIn
          </label>
          <input
            type="text"
            value={config.linkedin}
            onchange={(e) => config = ({ ...config, linkedin: e.target.value })}
            placeholder={t('usernamePlaceholder')}
            class="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Twitter
          </label>
          <input
            type="text"
            value={config.twitter}
            onchange={(e) => config = ({ ...config, twitter: e.target.value })}
            placeholder={t('usernamePlaceholder')}
            class="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            GitHub
          </label>
          <input
            type="text"
            value={config.github}
            onchange={(e) => config = ({ ...config, github: e.target.value })}
            placeholder={t('usernamePlaceholder')}
            class="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <!-- Style Selection -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('style')}
        </label>
        <div class="flex flex-wrap gap-2">
          {#each styles as s (s.id)}
<button 
              onclick={() => config = ({ ...config, style: s.id })}
              class={`px-4 py-2 rounded-lg text-sm ${
                config.style === s.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {s.name}
            </button>
{/each}
        </div>
      </div>

      <!-- Color Selection -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('primaryColor')}
        </label>
        <div class="flex flex-wrap gap-2">
          {#each colors as color (color)}
<button 
              onclick={() => config = ({ ...config, primaryColor: color })}
              class={`w-8 h-8 rounded-full border-2 ${
                config.primaryColor === color ? 'border-gray-900 dark:border-white' : 'border-transparent'
              }`}
              style="background-color: {color}"
            />
{/each}
          <input
            type="color"
            value={config.primaryColor}
            onchange={(e) => config = ({ ...config, primaryColor: e.target.value })}
            class="w-8 h-8 rounded cursor-pointer"
          />
        </div>
      </div>

      <!-- Actions -->
      <div class="flex justify-center gap-4">
        <button
          onclick={handleGenerate}
          class="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium text-white"
        >
          {t('generate')}
        </button>
        <button
          onclick={clearAll}
          class="px-6 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg font-medium text-gray-900 dark:text-gray-100"
        >
          {tCommon('clear')}
        </button>
      </div>

      <!-- Results -->
      {#if result}
<div class="space-y-4">
          <!-- Tabs -->
          <div class="flex border-b border-gray-200 dark:border-gray-700">
            {#each (['preview', 'html', 'text'] as const) as tab (tab)}
<button 
                onclick={() => activeTab = tab}
                class={`px-4 py-2 text-sm font-medium ${
                  activeTab === tab
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                {t(tab)}
              </button>
{/each}
          </div>

          <!-- Tab Content -->
          {#if activeTab === 'preview'}
<div class="p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div>{@html result.html}</div>
            </div>
{/if}

          {#if activeTab === 'html'}
<div>
              <div class="flex justify-end mb-2">
                <button
                  onclick={() => copyToClipboard(result.html, 'html')}
                  class="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm text-white"
                >
                  {copied === 'html' ? tCommon('copied') : tCommon('copy')}
                </button>
              </div>
              <pre class="p-4 bg-gray-900 dark:bg-gray-950 border border-gray-700 rounded-lg font-mono text-xs text-green-400 overflow-x-auto whitespace-pre-wrap max-h-96 overflow-y-auto">
                {result.html}
              </pre>
            </div>
{/if}

          {#if activeTab === 'text'}
<div>
              <div class="flex justify-end mb-2">
                <button
                  onclick={() => copyToClipboard(result.plainText, 'text')}
                  class="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm text-white"
                >
                  {copied === 'text' ? tCommon('copied') : tCommon('copy')}
                </button>
              </div>
              <pre class="p-4 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg font-mono text-sm text-gray-900 dark:text-gray-100 whitespace-pre-wrap">
                {result.plainText}
              </pre>
            </div>
{/if}
        </div>
{/if}

      <!-- Instructions -->
      <div class="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <h3 class="text-sm font-medium text-blue-700 dark:text-blue-300 mb-2">{t('howToUse')}</h3>
        <ol class="text-sm text-blue-600 dark:text-blue-400 space-y-1 list-decimal list-inside">
          <li>{t('step1')}</li>
          <li>{t('step2')}</li>
          <li>{t('step3')}</li>
        </ol>
      </div>
    </div>
  
