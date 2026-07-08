<script lang="ts">
  import { SAMPLE_LOG, parseGitLog } from '@/lib/tool-stubs';

  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['git-history-visualizer'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.git-history-visualizer.${key}`;
  }
  function tCommon(key: string): string {
    const scope = translations['tools'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.${key}`;
  }

  // Types
  interface Commit {
  hash: string;
  shortHash: string;
  message: string;
  author: string;
  date: string;
  branch?: string;
  parents: string[];
  isMerge: boolean;
}

  let input = $state(SAMPLE_LOG);

  let selectedCommit = $state(null);

  let copied = $state(false);

  let commits = $derived(parseGitLog(input));

  function handleCopy() {
    const command = 'git log --pretty=format:"%H|%P|%an|%ad|%s" --date=short';
    navigator.clipboard.writeText(command);
    copied = true;
    setTimeout(() => copied = false, 2000);
  }

  function getCommitColor(message: string) {
    if (/^feat\b/i.test(message)) return 'bg-green-500';
    if (/^fix\b/i.test(message)) return 'bg-red-500';
    if (/^docs\b/i.test(message)) return 'bg-amber-500';
    if (/^refactor\b/i.test(message)) return 'bg-yellow-500';
    if (/^merge\b/i.test(message)) return 'bg-slate-500';
    return 'bg-gray-500';
  }

</script>


    <div class="space-y-6">
      <div>
        <div class="flex justify-between items-center mb-2">
          <div class="tool-label">
            Git Log Output
          </div>
          <button
            onclick={handleCopy}
            class="text-xs text-amber-600 hover:text-amber-700 dark:text-amber-400"
          >
            {copied ? tCommon('copied') : 'Copy git log command'}
          </button>
        </div>
        <textarea
          bind:value={input}
          placeholder={t("inputPlaceholder")}
          rows={6}
          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono text-xs resize-none"></textarea>
        <p class="text-xs text-gray-500 mt-1">
          Run: <code class="bg-gray-100 dark:bg-gray-700 px-1 rounded">git log --pretty=format:&quot;%H|%P|%an|%ad|%s&quot; --date=short</code>
        </p>
      </div>

      {#if commits.length > 0}
<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div class="lg:col-span-2">
            <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Commit Graph ({commits.length} commits)
            </h3>
            <div class="relative border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
              <div class="max-h-96 overflow-y-auto">
                {#each commits as commit, idx (commit.hash)}
<div role="button" tabindex="0" onkeydown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); event.currentTarget.click(); } }}
                    onclick={() => selectedCommit = commit}
                    class={`flex items-start gap-3 p-3 border-b border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 ${
                      selectedCommit?.hash === commit.hash ? 'bg-amber-50 dark:bg-amber-900/20' : ''
                    }`}
                  >
                    <div class="flex flex-col items-center">
                      <div class={`w-3 h-3 rounded-full ${getCommitColor(commit.message)} ${commit.isMerge ? 'ring-2 ring-slate-300' : ''}`}></div>
                      {#if idx < commits.length - 1}
<div class="w-0.5 h-8 bg-gray-300 dark:bg-gray-600"></div>
{/if}
                    </div>
                    <div class="flex-1 min-w-0">
                      <div class="flex items-center gap-2 mb-1">
                        <code class="text-xs bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded text-gray-700 dark:text-gray-300">
                          {commit.shortHash}
                        </code>
                        {#if commit.isMerge}
<span class="text-xs px-1.5 py-0.5 bg-slate-100 dark:bg-slate-900/30 text-slate-700 dark:text-slate-300 rounded">
                            merge
                          </span>
{/if}
                      </div>
                      <p class="text-sm text-gray-900 dark:text-white truncate">
                        {commit.message}
                      </p>
                      <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {commit.author} • {commit.date}
                      </p>
                    </div>
                  </div>
{/each}
              </div>
            </div>
          </div>

          <div>
            <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Commit Details
            </h3>
            {#if selectedCommit}
<div class="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg space-y-3">
                <div>
                  <div class="text-xs text-gray-500 dark:text-gray-400">Hash</div>
                  <p class="text-sm font-mono text-gray-900 dark:text-white break-all">
                    {selectedCommit.hash}
                  </p>
                </div>
                <div>
                  <div class="text-xs text-gray-500 dark:text-gray-400">Message</div>
                  <p class="text-sm text-gray-900 dark:text-white">
                    {selectedCommit.message}
                  </p>
                </div>
                <div>
                  <div class="text-xs text-gray-500 dark:text-gray-400">Author</div>
                  <p class="text-sm text-gray-900 dark:text-white">
                    {selectedCommit.author}
                  </p>
                </div>
                <div>
                  <div class="text-xs text-gray-500 dark:text-gray-400">Date</div>
                  <p class="text-sm text-gray-900 dark:text-white">
                    {selectedCommit.date}
                  </p>
                </div>
                {#if selectedCommit.parents.length > 0}
<div>
                    <div class="text-xs text-gray-500 dark:text-gray-400">
                      Parent{selectedCommit.parents.length > 1 ? 's' : ''}
                    </div>
                    <div class="space-y-1">
                      {#each selectedCommit.parents as p (p)}
<p  class="text-xs font-mono text-gray-700 dark:text-gray-300">
                          {p.substring(0, 7)}
                        </p>
{/each}
                    </div>
                  </div>
{/if}
                {#if selectedCommit.isMerge}
<div class="pt-2 border-t border-gray-200 dark:border-gray-700">
                    <span class="text-xs px-2 py-1 bg-slate-100 dark:bg-slate-900/30 text-slate-700 dark:text-slate-300 rounded">
                      Merge Commit
                    </span>
                  </div>
{/if}
              </div>
{:else}
<div class="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg text-center text-sm text-gray-500">
                Click a commit to view details
              </div>
{/if}

            <div class="mt-4 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <h4 class="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">Legend</h4>
              <div class="space-y-1 text-xs">
                <div class="flex items-center gap-2">
                  <div class="w-2 h-2 rounded-full bg-green-500"></div>
                  <span class="text-gray-600 dark:text-gray-400">feat: Feature</span>
                </div>
                <div class="flex items-center gap-2">
                  <div class="w-2 h-2 rounded-full bg-red-500"></div>
                  <span class="text-gray-600 dark:text-gray-400">fix: Bug fix</span>
                </div>
                <div class="flex items-center gap-2">
                  <div class="w-2 h-2 rounded-full bg-amber-500"></div>
                  <span class="text-gray-600 dark:text-gray-400">docs: Documentation</span>
                </div>
                <div class="flex items-center gap-2">
                  <div class="w-2 h-2 rounded-full bg-yellow-500"></div>
                  <span class="text-gray-600 dark:text-gray-400">refactor: Refactoring</span>
                </div>
                <div class="flex items-center gap-2">
                  <div class="w-2 h-2 rounded-full bg-slate-500"></div>
                  <span class="text-gray-600 dark:text-gray-400">Merge commit</span>
                </div>
              </div>
            </div>
          </div>
        </div>
{/if}
    </div>

