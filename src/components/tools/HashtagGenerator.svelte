<script lang="ts">
  import { generateHashtags } from '@/lib/tool-stubs';

  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['hashtag-generator'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.hashtag-generator.${key}`;
  }
  function tCommon(key: string): string {
    const scope = translations['tools'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.${key}`;
  }

  // Types
  interface HashtagResult {
  hashtags: string[];
  popular: string[];
  niche: string[];
}

  let topic = $state('');

  let platform = $state('instagram');

  let count = $state(20);

  let result = $state(null);

  let copied = $state(false);

  function handleGenerate() {
    if (!topic.trim()) return;
    result = generateHashtags(topic, platform, count);
  }

  // Functions
  async function copyToClipboard(text: string) {
    await navigator.clipboard.writeText(text);
    copied = true;
    setTimeout(() => copied = false, 2000);
  }
  function copyAll() {
    if (result) {
      copyToClipboard(result.hashtags.join(' '));
    }
  }
  function clearAll() {
    topic = '';
    result = null;
  }
  const PLATFORM_LIMITS: Record<string, number> = {
    instagram: 30,
    twitter: 10,
    tiktok: 5,
    linkedin: 5,
    all: 30,
  };
  const platforms = [
    { id: 'instagram', name: 'Instagram', limit: 30 },
    { id: 'twitter', name: 'Twitter/X', limit: 10 },
    { id: 'tiktok', name: 'TikTok', limit: 5 },
    { id: 'linkedin', name: 'LinkedIn', limit: 5 },
    { id: 'all', name: t('allPlatforms'), limit: 30 },
  ];

</script>


    <div class="space-y-6">
      <!-- Topic Input -->
      <div>
        <label class="tool-label">
          {t('topic')}
        </label>
        <input
          type="text"
          bind:value={topic}
          placeholder={t('topicPlaceholder')}
          class="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          onkeydown={(e) => e.key === 'Enter' && handleGenerate()}
        />
      </div>

      <!-- Platform Selection -->
      <div>
        <label class="tool-label">
          {t('platform')}
        </label>
        <div class="flex flex-wrap gap-2">
          {#each platforms as p (p.id)}
<button 
              onclick={() => {
                platform = p.id;
                count = Math.min(count, p.limit);
              }}
              class={`px-4 py-2 rounded-lg text-sm ${
                platform === p.id
                  ? 'bg-amber-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {p.name}
              <span class="ml-1 text-xs opacity-75">({p.limit})</span>
            </button>
{/each}
        </div>
      </div>

      <!-- Count Slider -->
      <div>
        <label class="tool-label">
          {t('count')}: {count}
        </label>
        <input
          type="range"
          min="5"
          max={PLATFORM_LIMITS[platform]}
          value={count}
          onchange={(e) => count = parseInt(e.target.value)}
          class="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
        />
      </div>

      <!-- Quick Topics -->
      <div>
        <label class="tool-label">
          {t('quickTopics')}
        </label>
        <div class="flex flex-wrap gap-2">
          {#each ['travel', 'food', 'fitness', 'fashion', 'tech', 'business', 'photography', 'art', 'music'] as quickTopic (quickTopic)}
<button 
              onclick={() => topic = quickTopic}
              class="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 rounded text-sm capitalize"
            >
              {quickTopic}
            </button>
{/each}
        </div>
      </div>

      <!-- Actions -->
      <div class="flex justify-center gap-4">
        <button
          onclick={handleGenerate}
          disabled={!topic.trim()}
          class="px-6 py-2 bg-amber-600 hover:bg-amber-700 disabled:bg-gray-400 disabled:cursor-not-allowed rounded-lg font-medium text-white"
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
<div class="space-y-6">
          <!-- All Hashtags -->
          <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div class="flex justify-between items-center mb-3">
              <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('allHashtags')} ({result.hashtags.length})
              </h3>
              <button
                onclick={copyAll}
                class="px-3 py-1 bg-amber-600 hover:bg-amber-700 rounded text-sm text-white"
              >
                {copied ? tCommon('copied') : t('copyAll')}
              </button>
            </div>
            <div class="flex flex-wrap gap-2">
              {#each result.hashtags as tag (tag)}
<button 
                  onclick={() => copyToClipboard(tag)}
                  class="px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded-full text-sm hover:bg-amber-200 dark:hover:bg-amber-900/50"
                >
                  {tag}
                </button>
{/each}
            </div>
          </div>

          <!-- Popular Hashtags -->
          <div class="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <div class="flex justify-between items-center mb-3">
              <h3 class="text-sm font-medium text-green-700 dark:text-green-300">
                {t('popularHashtags')} ({result.popular.length})
              </h3>
              <button
                onclick={() => copyToClipboard(result.popular.join(' '))}
                class="px-3 py-1 bg-emerald-500 hover:bg-green-700 rounded text-sm text-white"
              >
                {tCommon('copy')}
              </button>
            </div>
            <div class="flex flex-wrap gap-2">
              {#each result.popular as tag (tag)}
<span 
                  class="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-sm"
                >
                  {tag}
                </span>
{/each}
            </div>
          </div>

          <!-- Niche Hashtags -->
          <div class="p-4 bg-slate-50 dark:bg-slate-900/20 border border-slate-200 dark:border-slate-800 rounded-lg">
            <div class="flex justify-between items-center mb-3">
              <h3 class="text-sm font-medium text-slate-700 dark:text-slate-300">
                {t('nicheHashtags')} ({result.niche.length})
              </h3>
              <button
                onclick={() => copyToClipboard(result.niche.join(' '))}
                class="px-3 py-1 bg-slate-600 hover:bg-slate-700 rounded text-sm text-white"
              >
                {tCommon('copy')}
              </button>
            </div>
            <div class="flex flex-wrap gap-2">
              {#each result.niche as tag (tag)}
<span 
                  class="px-3 py-1 bg-slate-100 dark:bg-slate-900/30 text-slate-700 dark:text-slate-300 rounded-full text-sm"
                >
                  {tag}
                </span>
{/each}
            </div>
          </div>

          <!-- Copy Box -->
          <div>
            <label class="tool-label">
              {t('copyBox')}
            </label>
            <textarea
              value={result.hashtags.join(' ')}
              readOnly
              rows={4}
              class="w-full px-4 py-3 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 text-sm resize-none"></textarea>
          </div>
        </div>
{/if}

      <!-- Tips -->
      <div class="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
        <h3 class="text-sm font-medium text-yellow-700 dark:text-yellow-300 mb-2">{t('tips')}</h3>
        <ul class="text-sm text-yellow-600 dark:text-yellow-400 space-y-1 list-disc list-inside">
          <li>{t('tip1')}</li>
          <li>{t('tip2')}</li>
          <li>{t('tip3')}</li>
        </ul>
      </div>
    </div>
  
