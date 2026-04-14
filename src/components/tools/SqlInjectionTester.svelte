<script lang="ts">
  import { EXAMPLE_CODE, testForInjection } from '@/lib/tool-stubs';

  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['sql-injection-tester'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.sql-injection-tester.${key}`;
  }
  function tCommon(key: string): string {
    const scope = translations['tools'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.${key}`;
  }

  // Types
  interface TestResult {
  vulnerable: boolean;
  issues: Array<{ severity: 'high' | 'medium' | 'low'; type: string; description: string; fix: string }>;
  score: number;
}

  let code = $state('');

  let result = $derived.by(() => {
    if (!code.trim()) return null;
    return testForInjection(code);
  });

  function handleClear() { return code = ''; }

  function loadExample() { return code = EXAMPLE_CODE; }

</script>


    <div class="space-y-6">
      <div>
        <div class="flex justify-between items-center mb-2">
          <label class="tool-label">Code to Analyze</label>
          <button onclick={loadExample} class="text-xs text-amber-600 hover:text-amber-700 dark:text-amber-400">{t('loadExample')}</button>
        </div>
        <textarea bind:value={code} placeholder={t("inputPlaceholder")}
          class="w-full h-48 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono text-sm resize-none"></textarea>
      </div>

      <button onclick={handleClear} class="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 font-medium">{tCommon('clear')}</button>

      {#if result}
<div class="space-y-6">
          <div class={`p-6 rounded-lg text-center ${result.vulnerable ? 'bg-red-50 dark:bg-red-900/20' : 'bg-green-50 dark:bg-green-900/20'}`}>
            <div class={`text-4xl font-bold ${result.vulnerable ? 'text-red-600' : 'text-green-600'}`}>
              {result.vulnerable ? '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg> VULNERABLE' : '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg> SAFE'}
            </div>
            <div class="text-sm text-gray-500 mt-2">Security Score: {result.score}/100</div>
          </div>

          {#if result.issues.length > 0}
<div class="space-y-3">
              <h3 class="text-lg font-medium text-gray-900 dark:text-white">Vulnerabilities Found</h3>
              {#each result.issues as issue, idx (idx)}
<div  class={`p-4 rounded-lg border-l-4 ${
                  issue.severity === 'high' ? 'border-red-500 bg-red-50 dark:bg-red-900/20' :
                  issue.severity === 'medium' ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20' :
                  'border-amber-500 bg-amber-50 dark:bg-amber-900/20'
                }`}>
                  <div class="flex items-center gap-2 mb-1">
                    <span class={`px-2 py-0.5 text-xs font-medium rounded ${
                      issue.severity === 'high' ? 'bg-red-100 text-red-700' :
                      issue.severity === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-amber-100 text-amber-700'
                    }`}>{issue.severity.toUpperCase()}</span>
                    <span class="font-medium text-gray-900 dark:text-white">{issue.type}</span>
                  </div>
                  <p class="text-sm text-gray-600 dark:text-gray-400">{issue.description}</p>
                  <p class="text-sm text-green-600 dark:text-green-400 mt-2"><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg> {issue.fix}</p>
                </div>
{/each}
            </div>
{/if}

          <div class="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
            <h4 class="text-sm font-medium text-amber-800 dark:text-amber-300 mb-2">Safe Query Examples</h4>
            <pre class="text-xs font-mono text-amber-700 dark:text-amber-400 whitespace-pre-wrap">
{`// Parameterized query (Node.js)
db.query('SELECT * FROM users WHERE id = ?', [userId]);


$stmt = $pdo->prepare('SELECT * FROM users WHERE id = :id');
$stmt->execute(['id' => $userId]);


prisma.user.findUnique({ where: { id: userId } });`}
            </pre>
          </div>
        </div>
{/if}
    </div>
  
