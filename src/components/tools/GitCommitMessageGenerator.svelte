<script lang="ts">
  import { K, generateCommitMessage } from '@/lib/tool-stubs';

  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['git-commit-message-generator'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.git-commit-message-generator.${key}`;
  }
  function tCommon(key: string): string {
    const scope = translations['tools'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.${key}`;
  }

  // Types
  interface CommitConfig {
  type: string;
  scope: string;
  subject: string;
  body: string;
  breaking: boolean;
  breakingDescription: string;
  issues: string;
}

  let config = $state({
    type: 'feat',
    scope: '',
    subject: '',
    body: '',
    breaking: false,
    breakingDescription: '',
    issues: '',
  });

  let copied = $state(false);

  function updateConfig(key: K, value: CommitConfig[K]) {
    config = ({ ...config, [key]: value });
  }

  let commitMessage = $derived(generateCommitMessage(config));

  function handleCopy() {
    navigator.clipboard.writeText(commitMessage);
    copied = true;
    setTimeout(() => copied = false, 2000);
  }

  // Functions
  const isValid = config.type && config.subject.length > 0 && config.subject.length <= 72;

</script>


    <div class="space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('commitType')} *
          </label>
          <select
            value={config.type}
            onchange={(e) => updateConfig('type', e.target.value)}
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            {#each COMMIT_TYPE_KEYS as type (type)}
<option  value={type}>
                {type} - {t(`types.${type}`)}
              </option>
{/each}
          </select>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('scope')}
          </label>
          <input
            type="text"
            value={config.scope}
            onchange={(e) => updateConfig('scope', e.target.value)}
            placeholder={t('scopePlaceholder')}
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('subject')} * <span class="text-xs text-gray-500">({config.subject.length}/72)</span>
        </label>
        <input
          type="text"
          value={config.subject}
          onchange={(e) => updateConfig('subject', e.target.value)}
          placeholder={t('subjectPlaceholder')}
          maxLength={72}
          class={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white ${
            config.subject.length > 72 ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
          }`}
        />
        <p class="text-xs text-gray-500 mt-1">{t('subjectHint')}</p>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('body')}
        </label>
        <textarea
          value={config.body}
          onchange={(e) => updateConfig('body', e.target.value)}
          placeholder={t('bodyPlaceholder')}
          rows={4}
          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-none"
        />
      </div>

      <div class="flex items-center gap-4">
        <label class="flex items-center gap-2">
          <input
            type="checkbox"
            checked={config.breaking}
            onchange={(e) => updateConfig('breaking', e.target.checked)}
            class="rounded"
          />
          <span class="text-sm text-gray-700 dark:text-gray-300">{t('breakingChange')}</span>
        </label>
      </div>

      {#if config.breaking}
<div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('breakingDescription')}
          </label>
          <textarea
            value={config.breakingDescription}
            onchange={(e) => updateConfig('breakingDescription', e.target.value)}
            placeholder={t('breakingPlaceholder')}
            rows={2}
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-none"
          />
        </div>
{/if}

      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('relatedIssues')}
        </label>
        <input
          type="text"
          value={config.issues}
          onchange={(e) => updateConfig('issues', e.target.value)}
          placeholder={t('issuesPlaceholder')}
          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        />
      </div>

      <div>
        <div class="flex justify-between items-center mb-2">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('generatedMessage')}
          </label>
          <button
            onclick={handleCopy}
            disabled={!isValid}
            class="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 disabled:opacity-50"
          >
            {copied ? tCommon('copied') : tCommon('copy')}
          </button>
        </div>
        <pre class={`p-4 rounded-lg overflow-x-auto text-sm font-mono whitespace-pre-wrap ${
          isValid 
            ? 'bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200' 
            : 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200'
        }`}>
          {commitMessage || t('emptyMessage')}
        </pre>
      </div>

      <div class="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <h3 class="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">{t('formatTitle')}</h3>
        <code class="text-xs text-blue-700 dark:text-blue-300">
          &lt;type&gt;[optional scope][!]: &lt;description&gt;<br/>
          [optional body]<br/>
          [optional footer(s)]
        </code>
      </div>
    </div>
  
