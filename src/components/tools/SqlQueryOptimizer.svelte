<script lang="ts">
  import {
    analyzeSql,
    EXAMPLE_SQL,
    type ExplainFinding,
    type SqlAnalysisResult,
    type SqlDialect,
    type SqlSuggestion,
  } from '@/lib/sql-query-optimizer';

  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  let dialect = $state<SqlDialect>('generic');
  let sql = $state('');
  let explainText = $state('');
  let result = $state<SqlAnalysisResult | null>(null);
  let error = $state('');
  let copied = $state<'formatted' | 'findings' | null>(null);
  let copyError = $state('');

  $effect(() => {
    void dialect;
    void sql;
    void explainText;
    result = null;
    error = '';
    copied = null;
    copyError = '';
  });

  function t(key: string): string {
    const tools = translations.tools as Record<string, unknown> | undefined;
    const scope = tools?.['sql-query-optimizer'] as
      | Record<string, unknown>
      | undefined;
    let value: unknown = scope;
    for (const segment of key.split('.')) {
      if (typeof value !== 'object' || value === null || Array.isArray(value)) {
        return `MISSING: tools.sql-query-optimizer.${key}`;
      }
      value = (value as Record<string, unknown>)[segment];
    }
    return typeof value === 'string'
      ? value
      : `MISSING: tools.sql-query-optimizer.${key}`;
  }

  function tCommon(key: string): string {
    const tools = translations.tools as Record<string, unknown> | undefined;
    const value = tools?.[key];
    return typeof value === 'string' ? value : `MISSING: tools.${key}`;
  }

  function loadExample() {
    sql = EXAMPLE_SQL;
    explainText = '';
    result = null;
    error = '';
    copyError = '';
  }

  function handleClear() {
    sql = '';
    explainText = '';
    result = null;
    error = '';
    copied = null;
    copyError = '';
  }

  function handleAnalyze() {
    if (!sql.trim()) {
      result = null;
      error = t('emptySql');
      return;
    }

    error = '';
    result = analyzeSql({ sql, dialect, explainText });
  }

  async function copyText(kind: 'formatted' | 'findings') {
    if (!result) return;
    const text =
      kind === 'formatted'
        ? result.formattedSql
        : formatFindings(result.suggestions, result.explainFindings);
    try {
      if (!navigator.clipboard?.writeText) {
        throw new Error('Clipboard API unavailable');
      }
      await navigator.clipboard.writeText(text);
      copyError = '';
      copied = kind;
      setTimeout(() => {
        if (copied === kind) copied = null;
      }, 1800);
    } catch {
      copied = null;
      copyError = t('copyFailed');
    }
  }

  function formatFindings(
    suggestions: SqlSuggestion[],
    explainFindings: ExplainFinding[],
  ): string {
    return [...suggestions, ...explainFindings]
      .map((finding) => {
        const candidates =
          'indexCandidates' in finding && finding.indexCandidates.length > 0
            ? `\nIndex candidates: ${finding.indexCandidates.join('; ')}`
            : '';
        return `[${finding.severity.toUpperCase()}] ${finding.message}\nEvidence: ${finding.evidence}${candidates}`;
      })
      .join('\n\n');
  }

  function scoreTone(score: number): string {
    if (score >= 80) return 'text-emerald-700 dark:text-emerald-300';
    if (score >= 55) return 'text-amber-700 dark:text-amber-300';
    return 'text-red-700 dark:text-red-300';
  }

  function findingTone(severity: SqlSuggestion['severity'] | ExplainFinding['severity']): string {
    if (severity === 'warning') {
      return 'border-red-200 bg-red-50/70 dark:border-red-900 dark:bg-red-950/30';
    }
    if (severity === 'improvement') {
      return 'border-amber-200 bg-amber-50/70 dark:border-amber-900 dark:bg-amber-950/30';
    }
    return 'border-sky-200 bg-sky-50/70 dark:border-sky-900 dark:bg-sky-950/30';
  }
</script>

<div class="space-y-6" data-sql-optimizer data-locale={locale}>
  <div class="rounded-xl bg-gray-50 p-4 dark:bg-gray-900/70">
    <p id="sql-local-safety" class="text-sm font-medium text-gray-800 dark:text-gray-100" data-sql-safety>
      {t('localSafety')}
    </p>
    <p id="sql-diagnostics-language" class="mt-2 text-sm text-gray-600 dark:text-gray-300" data-sql-diagnostics-language>
      {t('diagnosticsLanguageNotice')}
    </p>
  </div>

  <div class="space-y-2">
    <label class="tool-label" for="sql-dialect">{t('databaseDialect')}</label>
    <select
      id="sql-dialect"
      bind:value={dialect}
      data-sql-dialect
      class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-gray-900 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
    >
      <option value="generic">{t('dialects.generic')}</option>
      <option value="postgresql">{t('dialects.postgresql')}</option>
      <option value="mysql">{t('dialects.mysql')}</option>
      <option value="sqlite">{t('dialects.sqlite')}</option>
      <option value="sql-server">{t('dialects.sqlServer')}</option>
    </select>
  </div>

  <div class="space-y-2">
    <div class="flex items-center justify-between gap-4">
      <label class="tool-label" for="sql-query-input">{t('sqlQuery')}</label>
      <button
        type="button"
        onclick={loadExample}
        class="text-sm font-medium text-amber-700 hover:text-amber-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 dark:text-amber-300 dark:hover:text-amber-200"
      >
        {t('loadExample')}
      </button>
    </div>
    <textarea
      id="sql-query-input"
      bind:value={sql}
      data-sql-input
      aria-describedby="sql-local-safety sql-diagnostics-language"
      placeholder={t('inputPlaceholder')}
      spellcheck="false"
      class="min-h-44 w-full resize-y rounded-lg border border-gray-300 bg-white px-4 py-3 font-mono text-sm text-gray-900 outline-none transition placeholder:text-gray-500 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-400"
    ></textarea>
  </div>

  <div class="space-y-2">
    <label class="tool-label" for="sql-explain-input">{t('explainText')}</label>
    <textarea
      id="sql-explain-input"
      bind:value={explainText}
      data-sql-explain-input
      placeholder={t('explainPlaceholder')}
      spellcheck="false"
      class="min-h-28 w-full resize-y rounded-lg border border-gray-300 bg-white px-4 py-3 font-mono text-sm text-gray-900 outline-none transition placeholder:text-gray-500 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-400"
    ></textarea>
  </div>

  {#if error}
    <p class="text-sm font-medium text-red-700 dark:text-red-300" role="alert" data-sql-error>{error}</p>
  {/if}
  {#if copyError}
    <p class="text-sm font-medium text-red-700 dark:text-red-300" role="alert" aria-live="assertive" data-sql-copy-error>{copyError}</p>
  {/if}

  <div class="flex flex-wrap gap-3">
    <button
      type="button"
      onclick={handleAnalyze}
      data-sql-analyze
      class="rounded-lg bg-amber-600 px-5 py-2.5 font-medium text-white transition hover:bg-amber-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 active:bg-amber-800 dark:ring-offset-gray-900"
    >
      {t('analyzeLocally')}
    </button>
    <button
      type="button"
      onclick={handleClear}
      class="rounded-lg bg-gray-600 px-5 py-2.5 font-medium text-white transition hover:bg-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2 active:bg-gray-800 dark:ring-offset-gray-900"
    >
      {tCommon('clear')}
    </button>
  </div>

  {#if result}
    <section class="space-y-6" data-sql-analysis aria-live="polite">
      <div class="flex flex-wrap items-end justify-between gap-4 border-b border-gray-200 pb-4 dark:border-gray-700">
        <div>
          <h3 class="text-base font-semibold text-gray-900 dark:text-white">{t('analysisScore')}</h3>
          <p class={`mt-1 text-3xl font-bold tabular-nums ${scoreTone(result.score)}`} data-sql-score>
            {result.score}/100
          </p>
        </div>
        <button
          type="button"
          onclick={() => copyText('findings')}
          data-sql-copy-findings
          class="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800"
        >
          {copied === 'findings' ? tCommon('copied') : t('copyFindings')}
        </button>
      </div>

      <div class="space-y-3">
        <h3 class="text-base font-semibold text-gray-900 dark:text-white">{t('findings')}</h3>
        {#if result.suggestions.length === 0}
          <p class="text-sm text-gray-600 dark:text-gray-300">{t('noFindings')}</p>
        {:else}
          {#each result.suggestions as finding, index (`${finding.code}-${index}`)}
            <article class={`rounded-xl border p-4 ${findingTone(finding.severity)}`} data-sql-finding={finding.code}>
              <div class="flex flex-wrap items-start justify-between gap-3">
                <p class="font-medium text-gray-900 dark:text-white">{finding.message}</p>
                <span class="rounded-full bg-white/80 px-2.5 py-1 text-xs font-semibold text-gray-700 dark:bg-gray-900/70 dark:text-gray-200" data-sql-severity>
                  {finding.severity}
                </span>
              </div>
              <p class="mt-3 text-sm text-gray-700 dark:text-gray-300">
                <span class="font-semibold">{t('evidence')}:</span>
                <code class="ml-1 break-words" data-sql-evidence>{finding.evidence}</code>
              </p>
              {#if finding.indexCandidates.length > 0}
                <div class="mt-3">
                  <p class="text-sm font-semibold text-gray-800 dark:text-gray-200">{t('indexCandidates')}</p>
                  <ul class="mt-1 space-y-1">
                    {#each finding.indexCandidates as candidate}
                      <li class="font-mono text-sm text-gray-700 dark:text-gray-300" data-sql-index-candidate>{candidate}</li>
                    {/each}
                  </ul>
                </div>
              {/if}
            </article>
          {/each}
        {/if}
      </div>

      {#if result.explainFindings.length > 0}
        <div class="space-y-3" data-sql-explain-findings>
          <h3 class="text-base font-semibold text-gray-900 dark:text-white">{t('explainFindings')}</h3>
          {#each result.explainFindings as finding, index (`${finding.code}-${index}`)}
            <article class={`rounded-xl border p-4 ${findingTone(finding.severity)}`} data-sql-explain-finding={finding.code}>
              <div class="flex flex-wrap items-start justify-between gap-3">
                <p class="font-medium text-gray-900 dark:text-white">{finding.message}</p>
                <span class="rounded-full bg-white/80 px-2.5 py-1 text-xs font-semibold text-gray-700 dark:bg-gray-900/70 dark:text-gray-200" data-sql-severity>
                  {finding.severity}
                </span>
              </div>
              <p class="mt-3 text-sm text-gray-700 dark:text-gray-300">
                <span class="font-semibold">{t('evidence')}:</span>
                <code class="ml-1 break-words" data-sql-evidence>{finding.evidence}</code>
              </p>
            </article>
          {/each}
        </div>
      {/if}

      <div class="space-y-2">
        <div class="flex flex-wrap items-center justify-between gap-3">
          <h3 class="text-base font-semibold text-gray-900 dark:text-white">{t('formattedSql')}</h3>
          <button
            type="button"
            onclick={() => copyText('formatted')}
            data-sql-copy-formatted
            class="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800"
          >
            {copied === 'formatted' ? tCommon('copied') : t('copyFormattedSql')}
          </button>
        </div>
        <pre class="overflow-x-auto rounded-xl bg-gray-950 p-4 text-sm text-gray-100" data-sql-formatted><code>{result.formattedSql}</code></pre>
      </div>

      <div class="space-y-2">
        <h3 class="text-base font-semibold text-gray-900 dark:text-white">{t('limitations')}</h3>
        <ul class="list-disc space-y-1 pl-5 text-sm text-gray-700 dark:text-gray-300">
          {#each result.limitations as limitation}
            <li data-sql-limitation>{limitation}</li>
          {/each}
        </ul>
      </div>
    </section>
  {/if}
</div>
