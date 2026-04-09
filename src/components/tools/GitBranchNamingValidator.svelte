<script lang="ts">
  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  interface ValidationRule {
    name: string;
    pattern: RegExp;
    description: string;
    valid: boolean;
  }

  interface NamingConvention {
    name: string;
    pattern: RegExp;
    example: string;
    description: string;
    prefix: string;
  }

  interface ValidationResult {
    rules: ValidationRule[];
    matchesConvention: boolean;
  }

  let { locale, translations }: Props = $props();

  function t(key: string): string {
    const scope = (translations['tools']['git-branch-naming-validator'] as Record<string, unknown>) || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) value = (value as Record<string, unknown>)?.[k];
    return typeof value === 'string' ? value : `MISSING: tools.git-branch-naming-validator.${key}`;
  }

  function tCommon(key: string): string {
    const scope = (translations['tools'] as Record<string, unknown>) || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) value = (value as Record<string, unknown>)?.[k];
    return typeof value === 'string' ? value : `MISSING: tools.${key}`;
  }

  const NAMING_CONVENTIONS: NamingConvention[] = [
    {
      name: 'feature/*',
      prefix: 'feature/',
      pattern: /^feature\/[a-z0-9]+(?:-[a-z0-9]+)*$/,
      example: 'feature/add-login-flow',
      description: 'New features',
    },
    {
      name: 'bugfix/*',
      prefix: 'bugfix/',
      pattern: /^bugfix\/[a-z0-9]+(?:-[a-z0-9]+)*$/,
      example: 'bugfix/fix-timezone-bug',
      description: 'Bug fixes',
    },
    {
      name: 'hotfix/*',
      prefix: 'hotfix/',
      pattern: /^hotfix\/[a-z0-9]+(?:-[a-z0-9]+)*$/,
      example: 'hotfix/critical-auth-issue',
      description: 'Urgent fixes',
    },
  ];

  function sanitizeSlug(input: string): string {
    return input
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9/._-]+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^[-/]+|[-/]+$/g, '');
  }

  function buildValidation(branch: string, convention: NamingConvention): ValidationResult {
    const trimmed = branch.trim();
    const rules: ValidationRule[] = [
      {
        name: 'Use lowercase letters',
        pattern: /^[a-z0-9/._-]+$/,
        description: 'Branch names should stay lowercase and URL-safe',
        valid: /^[a-z0-9/._-]+$/.test(trimmed),
      },
      {
        name: 'No spaces',
        pattern: /^\S+$/,
        description: 'Whitespace is not allowed',
        valid: /^\S+$/.test(trimmed),
      },
      {
        name: 'No trailing slash',
        pattern: /[^/]$/,
        description: 'Branch names should not end with "/"',
        valid: /[^/]$/.test(trimmed),
      },
      {
        name: `Starts with ${convention.prefix}`,
        pattern: new RegExp(`^${convention.prefix.replace('/', '\\/')}`),
        description: `Use the ${convention.prefix} prefix`,
        valid: trimmed.startsWith(convention.prefix),
      },
    ];

    return {
      rules,
      matchesConvention: convention.pattern.test(trimmed),
    };
  }

  function suggestName(branch: string, convention: NamingConvention): string {
    const cleaned = sanitizeSlug(branch.replace(/^[a-z]+\/+/, ''));
    if (!cleaned) return convention.example;
    return `${convention.prefix}${cleaned}`;
  }

  let branchName = $state('');
  let selectedConvention = $state<NamingConvention>(NAMING_CONVENTIONS[0]);
  let copied = $state(false);

  let validation = $derived.by(() => {
    if (!branchName.trim()) return null;
    return buildValidation(branchName, selectedConvention);
  });

  let suggestion = $derived.by(() => {
    if (!branchName.trim()) return '';
    return suggestName(branchName, selectedConvention);
  });

  let isValid = $derived.by(() => {
    if (!validation) return false;
    return validation.rules.every((rule) => rule.valid) && validation.matchesConvention;
  });

  function handleCopy() {
    navigator.clipboard.writeText(suggestion);
    copied = true;
    setTimeout(() => {
      copied = false;
    }, 2000);
  }
</script>


    <div class="space-y-6">
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('namingConvention')}
        </label>
        <select
          value={selectedConvention.name}
          onchange={(e) => selectedConvention = NAMING_CONVENTIONS.find(c => c.name === e.target.value) || NAMING_CONVENTIONS[0]}
          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        >
          {#each NAMING_CONVENTIONS as conv (conv.name)}
<option  value={conv.name}>
              {conv.name} - {conv.description}
            </option>
{/each}
        </select>
        <p class="text-xs text-gray-500 mt-1">Example: <code class="bg-gray-100 dark:bg-gray-700 px-1 rounded">{selectedConvention.example}</code></p>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('branchName')}
        </label>
        <input
          type="text"
          bind:value={branchName}
          placeholder={t("inputPlaceholder")}
          class={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white ${
            branchName && !isValid ? 'border-red-500' : branchName && isValid ? 'border-green-500' : 'border-gray-300 dark:border-gray-600'
          }`}
        />
      </div>

      {#if validation}
<div>

          <div class="p-4 rounded-lg bg-gray-50 dark:bg-gray-900">
            <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">{t('gitRules')}</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
              {#each validation.rules as rule (rule.name)}
<div  class="flex items-center gap-2 text-sm">
                  <span class={rule.valid ? 'text-green-500' : 'text-red-500'}>
                    {rule.valid ? '✓' : '✗'}
                  </span>
                  <span class={rule.valid ? 'text-gray-600 dark:text-gray-400' : 'text-red-600 dark:text-red-400'}>
                    {rule.name}
                  </span>
                </div>
{/each}
            </div>
          </div>

          <div class={`p-4 rounded-lg ${validation.matchesConvention ? 'bg-green-50 dark:bg-green-900/20' : 'bg-yellow-50 dark:bg-yellow-900/20'}`}>
            <div class="flex items-center gap-2">
              <span class={validation.matchesConvention ? 'text-green-500' : 'text-yellow-500'}>
                {validation.matchesConvention ? '✓' : '⚠'}
              </span>
              <span class={validation.matchesConvention ? 'text-green-700 dark:text-green-300' : 'text-yellow-700 dark:text-yellow-300'}>
                {validation.matchesConvention 
                  ? `Matches ${selectedConvention.name} convention` 
                  : `Does not match ${selectedConvention.name} convention`}
              </span>
            </div>
          </div>

          {#if !isValid}
{#if suggestion && suggestion !== branchName}
            <div class="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div class="flex justify-between items-center mb-2">
                <h3 class="text-sm font-medium text-blue-800 dark:text-blue-200">{t('suggestedName')}</h3>
                <button
                  onclick={handleCopy}
                  class="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
                >
                  {copied ? tCommon('copied') : tCommon('copy')}
                </button>
              </div>
              <code class="text-sm text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-800/30 px-2 py-1 rounded">
                {suggestion}
              </code>
            </div>
          {/if}
{/if}
        
</div>
{/if}

      <div class="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
        <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('commonBranchPrefixes')}</h3>
        <div class="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
          <div><code class="bg-gray-200 dark:bg-gray-700 px-1 rounded">feature/</code> {t('newFeatures')}</div>
          <div><code class="bg-gray-200 dark:bg-gray-700 px-1 rounded">bugfix/</code> {t('bugFixes')}</div>
          <div><code class="bg-gray-200 dark:bg-gray-700 px-1 rounded">hotfix/</code> {t('urgentFixes')}</div>
          <div><code class="bg-gray-200 dark:bg-gray-700 px-1 rounded">release/</code> {t('releasePrep')}</div>
          <div><code class="bg-gray-200 dark:bg-gray-700 px-1 rounded">docs/</code> {t('documentation')}</div>
          <div><code class="bg-gray-200 dark:bg-gray-700 px-1 rounded">test/</code> {t('testing')}</div>
        </div>
      </div>
    </div>
  
