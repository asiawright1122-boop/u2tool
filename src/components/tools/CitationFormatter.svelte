<script lang="ts">
  import { K, formatCitation } from '@/lib/tool-stubs';

  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['citation-formatter'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.citation-formatter.${key}`;
  }
  function tCommon(key: string): string {
    const scope = translations['tools'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.${key}`;
  }

  // Types
  type CitationStyle = 'apa' | 'mla' | 'chicago' | 'harvard' | 'ieee';
  interface Citation {
  type: 'book' | 'article' | 'website' | 'journal';
  authors: string;
  title: string;
  year: string;
  publisher?: string;
  journal?: string;
  volume?: string;
  issue?: string;
  pages?: string;
  url?: string;
  accessDate?: string;
  doi?: string;
}

  let citation = $state({
    type: 'book',
    authors: 'John Smith, Jane Doe',
    title: 'Introduction to Computer Science',
    year: '2024',
    publisher: 'Academic Press',
    journal: '',
    volume: '',
    issue: '',
    pages: '',
    url: '',
    accessDate: '',
    doi: '',
  });

  let style = $state('apa');

  let copied = $state(false);

  let formattedCitation = $derived(formatCitation(citation, style));

  function updateCitation(key: K, value: Citation[K]) {
    citation = ({ ...citation, [key]: value });
  }

  function handleCopy() {
    navigator.clipboard.writeText(formattedCitation.replace(/\*/g, ''));
    copied = true;
    setTimeout(() => copied = false, 2000);
  }

</script>


    <div class="space-y-6">
      <div class="flex flex-wrap gap-2">
        {#each (['apa', 'mla', 'chicago', 'harvard', 'ieee'] as const) as s (s)}
<button 
            onclick={() => style = s}
            class={`px-4 py-2 text-sm rounded-lg ${
              style === s
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            {s.toUpperCase()}
          </button>
{/each}
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-xs text-gray-500 dark:text-gray-400 mb-1">{t('sourceType')}</label>
          <select
            value={citation.type}
            onchange={(e) => updateCitation('type', e.target.value as Citation['type'])}
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value="book">Book</option>
            <option value="journal">Journal Article</option>
            <option value="article">Article</option>
            <option value="website">Website</option>
          </select>
        </div>
        <div>
          <label class="block text-xs text-gray-500 dark:text-gray-400 mb-1">{t('year')}</label>
          <input
            type="text"
            value={citation.year}
            onchange={(e) => updateCitation('year', e.target.value)}
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        </div>
        <div class="md:col-span-2">
          <label class="block text-xs text-gray-500 dark:text-gray-400 mb-1">{t('authors')} ({t('authorsHint')})</label>
          <input
            type="text"
            value={citation.authors}
            onchange={(e) => updateCitation('authors', e.target.value)}
            placeholder={t("authorsPlaceholder")}
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        </div>
        <div class="md:col-span-2">
          <label class="block text-xs text-gray-500 dark:text-gray-400 mb-1">{t('title')}</label>
          <input
            type="text"
            value={citation.title}
            onchange={(e) => updateCitation('title', e.target.value)}
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        </div>
        
        {#if citation.type === 'book' || citation.type === 'website'}
<div class="md:col-span-2">
            <label class="block text-xs text-gray-500 dark:text-gray-400 mb-1">{t('publisher')}</label>
            <input
              type="text"
              value={citation.publisher}
              onchange={(e) => updateCitation('publisher', e.target.value)}
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
          </div>
{/if}
        
        {#if citation.type === 'journal' || citation.type === 'article'}

            <div class="md:col-span-2">
              <label class="block text-xs text-gray-500 dark:text-gray-400 mb-1">{t('journalName')}</label>
              <input
                type="text"
                value={citation.journal}
                onchange={(e) => updateCitation('journal', e.target.value)}
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label class="block text-xs text-gray-500 dark:text-gray-400 mb-1">{t('volume')}</label>
              <input
                type="text"
                value={citation.volume}
                onchange={(e) => updateCitation('volume', e.target.value)}
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label class="block text-xs text-gray-500 dark:text-gray-400 mb-1">{t('issue')}</label>
              <input
                type="text"
                value={citation.issue}
                onchange={(e) => updateCitation('issue', e.target.value)}
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label class="block text-xs text-gray-500 dark:text-gray-400 mb-1">{t('pages')}</label>
              <input
                type="text"
                value={citation.pages}
                onchange={(e) => updateCitation('pages', e.target.value)}
                placeholder={t("pagesPlaceholder")}
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label class="block text-xs text-gray-500 dark:text-gray-400 mb-1">{t('doi')}</label>
              <input
                type="text"
                value={citation.doi}
                onchange={(e) => updateCitation('doi', e.target.value)}
                placeholder={t("doiPlaceholder")}
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>
          
{/if}
        
        {#if citation.type === 'website'}

            <div>
              <label class="block text-xs text-gray-500 dark:text-gray-400 mb-1">{t('url')}</label>
              <input
                type="text"
                value={citation.url}
                onchange={(e) => updateCitation('url', e.target.value)}
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label class="block text-xs text-gray-500 dark:text-gray-400 mb-1">{t('accessDate')}</label>
              <input
                type="text"
                value={citation.accessDate}
                onchange={(e) => updateCitation('accessDate', e.target.value)}
                placeholder={t("datePlaceholder")}
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>
          
{/if}
      </div>

      <div>
        <div class="flex justify-between items-center mb-2">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('formattedCitation')} ({style.toUpperCase()})
          </label>
          <button
            onclick={handleCopy}
            class="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
          >
            {copied ? tCommon('copied') : tCommon('copy')}
          </button>
        </div>
        <div class="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
          <p class="text-sm text-gray-800 dark:text-gray-200">{@html formattedCitation.replace(/\*([^*]+)\*/g, '<em>$1</em>')}</p>
        </div>
      </div>
    </div>
  
