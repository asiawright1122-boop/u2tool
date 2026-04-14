<script lang="ts">
  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['commit-message-generator'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.commit-message-generator.${key}`;
  }
  function common(key: string): string {
    const scope = translations['tools'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.${key}`;
  }

  let type = $state('feat');

  let scope = $state('');

  let subject = $state('');

  let body = $state('');

  let footer = $state('');

  let isBreaking = $state(false);

  let copied = $state(false);

  let commitMessage = $derived.by(() => {
    let message = type;
    
    if (scope) {
      message += `(${scope})`;
    }
    
    if (isBreaking) {
      message += '!';
    }
    
    message += `: ${subject}`;
    
    if (body) {
      message += `\n\n${body}`;
    }
    
    if (isBreaking && !footer.includes('BREAKING CHANGE')) {
      message += `\n\nBREAKING CHANGE: ${subject}`;
    }
    
    if (footer) {
      message += `\n\n${footer}`;
    }
    
    return message;
  });

  // Functions
  async function handleCopy() {
    await navigator.clipboard.writeText(commitMessage);
    copied = true;
    setTimeout(() => copied = false, 2000);
  }
  const subjectLength = subject.length;
  const isSubjectTooLong = subjectLength > 50;

</script>


    <div class="space-y-6">
      <!-- Type Selection -->
      <div>
        <label class="tool-label">
          {t('type')} *
        </label>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-2">
          {#each COMMIT_TYPES as ct (ct.value)}
<button 
              onclick={() => type = ct.value}
              class={`px-3 py-2 text-sm rounded-lg border transition-colors text-left ${
                type === ct.value
                  ? 'bg-amber-500 text-white border-amber-500'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-amber-400'
              }`}
              title={ct.description}
            >
              <span class="font-mono">{ct.label}</span>
            </button>
{/each}
        </div>
        <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
          {COMMIT_TYPES.find(ct => ct.value === type)?.description}
        </p>
      </div>

      <!-- Scope -->
      <div>
        <label class="tool-label">
          {t('scope')} ({t('optional')})
        </label>
        <input
          type="text"
          bind:value={scope}
          placeholder={t('scopePlaceholder')}
          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400"
        />
      </div>

      <!-- Subject -->
      <div>
        <label class="tool-label">
          {t('subject')} *
        </label>
        <input
          type="text"
          bind:value={subject}
          placeholder={t('subjectPlaceholder')}
          class={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 ${
            isSubjectTooLong 
              ? 'border-yellow-500 dark:border-yellow-500' 
              : 'border-gray-300 dark:border-gray-600'
          }`}
        />
        <p class={`mt-1 text-xs ${isSubjectTooLong ? 'text-yellow-500' : 'text-gray-500 dark:text-gray-400'}`}>
          {subjectLength}/50 {t('characters')} {#if isSubjectTooLong}
`(${t('recommended50')})`
{/if}
        </p>
      </div>

      <!-- Breaking Change -->
      <div class="flex items-center gap-2">
        <input
          type="checkbox"
          id="breaking"
          bind:checked={isBreaking}
          class="w-4 h-4 text-amber-500 rounded border-gray-300 focus:ring-amber-500"
        />
        <label for="breaking" class="text-sm text-gray-700 dark:text-gray-300">
          {t('breakingChange')}
        </label>
      </div>

      <!-- Body -->
      <div>
        <label class="tool-label">
          {t('body')} ({t('optional')})
        </label>
        <textarea
          bind:value={body}
          placeholder={t('bodyPlaceholder')}
          rows={3}
          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 resize-y"></textarea>
      </div>

      <!-- Footer -->
      <div>
        <label class="tool-label">
          {t('footer')} ({t('optional')})
        </label>
        <textarea
          bind:value={footer}
          placeholder={t('footerPlaceholder')}
          rows={2}
          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 resize-y"></textarea>
      </div>

      <!-- Output -->
      <div>
        <div class="flex items-center justify-between mb-2">
          <label class="tool-label">
            {t('commitMessage')}
          </label>
          <button
            onclick={handleCopy}
            disabled={!subject}
            class="px-3 py-1 text-sm bg-amber-500 text-white rounded hover:bg-amber-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {copied ? common('copied') : common('copy')}
          </button>
        </div>
        <pre class="p-4 bg-gray-900 text-green-400 rounded-lg overflow-x-auto text-sm font-mono whitespace-pre-wrap">
          {commitMessage || t('preview')}
        </pre>
      </div>

      <!-- Tips -->
      <div class="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
        <h4 class="text-sm font-medium text-amber-800 dark:text-amber-300 mb-2">
          {t('tips')}
        </h4>
        <ul class="text-xs text-amber-700 dark:text-amber-400 space-y-1 list-disc list-inside">
          <li>{t('tip1')}</li>
          <li>{t('tip2')}</li>
          <li>{t('tip3')}</li>
        </ul>
      </div>
    </div>
  
