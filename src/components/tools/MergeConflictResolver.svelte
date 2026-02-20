<script lang="ts">
  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['merge-conflict-resolver'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.merge-conflict-resolver.${key}`;
  }
  function tCommon(key: string): string {
    const scope = translations['tools'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.${key}`;
  }

  // Types
  interface ConflictBlock {
  id: number;
  ours: string;
  theirs: string;
  resolved: string;
  resolution: 'ours' | 'theirs' | 'both' | 'custom' | null;
}

  let input = $state(SAMPLE_CONFLICT);

  let copied = $state(false);

  let { blocks, nonConflict } = $derived(parseConflicts(input));

  let resolvedBlocks = $state(blocks);

  function handleInputChange(value: string) {
    input = value;
    const parsed = parseConflicts(value);
    resolvedBlocks = parsed.blocks;
  }

  function handleResolve(id: number, resolution: ConflictBlock['resolution'], customValue?: string) {
    resolvedBlocks = resolvedBlocks.map(block => {
      if (block.id === id) {
        return {
          ...block,
          resolution,
          resolved: customValue ?? (resolution === 'ours' ? block.ours : resolution === 'theirs' ? block.theirs : resolution === 'both' ? block.ours + '\n' + block.theirs : block.resolved),
        };
      }
      return block;
    });
  }

  let resolvedContent = $derived(generateResolved(resolvedBlocks, nonConflict));

  function handleCopy() {
    navigator.clipboard.writeText(resolvedContent);
    copied = true;
    setTimeout(() => copied = false, 2000);
  }

  // Functions
  const allResolved = resolvedBlocks.every(b => b.resolution !== null);
  const hasConflicts = blocks.length > 0;

</script>


    <div class="space-y-6">
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Paste Content with Merge Conflicts
        </label>
        <textarea
          value={input}
          onchange={(e) => handleInputChange(e.target.value)}
          placeholder={t("inputPlaceholder")}
          rows={10}
          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono text-sm resize-none"
        />
      </div>

      {#if hasConflicts}

          <div class="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            <p class="text-sm text-yellow-700 dark:text-yellow-300">
              Found {blocks.length} conflict{blocks.length > 1 ? 's' : ''} • 
              {resolvedBlocks.filter(b => b.resolution).length} resolved
            </p>
          </div>

          <div class="space-y-4">
            {#each resolvedBlocks as block, idx (block.id)}
<div  class="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
                <div class="bg-gray-100 dark:bg-gray-800 px-4 py-2 flex justify-between items-center">
                  <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Conflict #{idx + 1}
                  </span>
                  {#if block.resolution}
<span class="text-xs px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded">
                      Resolved: {block.resolution}
                    </span>
{/if}
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-300 dark:divide-gray-600">
                  <div class="p-3">
                    <div class="flex justify-between items-center mb-2">
                      <span class="text-xs font-medium text-blue-600 dark:text-blue-400">HEAD (Ours)</span>
                      <button
                        onclick={() => handleResolve(block.id, 'ours')}
                        class={`text-xs px-2 py-1 rounded ${block.resolution === 'ours' ? 'bg-blue-600 text-white' : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 hover:bg-blue-200'}`}
                      >
                        Use This
                      </button>
                    </div>
                    <pre class="text-xs bg-blue-50 dark:bg-blue-900/20 p-2 rounded overflow-x-auto whitespace-pre-wrap">
                      {block.ours}
                    </pre>
                  </div>
                  
                  <div class="p-3">
                    <div class="flex justify-between items-center mb-2">
                      <span class="text-xs font-medium text-purple-600 dark:text-purple-400">Incoming (Theirs)</span>
                      <button
                        onclick={() => handleResolve(block.id, 'theirs')}
                        class={`text-xs px-2 py-1 rounded ${block.resolution === 'theirs' ? 'bg-purple-600 text-white' : 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 hover:bg-purple-200'}`}
                      >
                        Use This
                      </button>
                    </div>
                    <pre class="text-xs bg-purple-50 dark:bg-purple-900/20 p-2 rounded overflow-x-auto whitespace-pre-wrap">
                      {block.theirs}
                    </pre>
                  </div>
                </div>
                
                <div class="p-3 bg-gray-50 dark:bg-gray-900 border-t border-gray-300 dark:border-gray-600">
                  <div class="flex gap-2 mb-2">
                    <button
                      onclick={() => handleResolve(block.id, 'both')}
                      class={`text-xs px-2 py-1 rounded ${block.resolution === 'both' ? 'bg-green-600 text-white' : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 hover:bg-green-200'}`}
                    >
                      Keep Both
                    </button>
                    <button
                      onclick={() => handleResolve(block.id, 'custom', block.resolved || block.ours)}
                      class={`text-xs px-2 py-1 rounded ${block.resolution === 'custom' ? 'bg-orange-600 text-white' : 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 hover:bg-orange-200'}`}
                    >
                      Custom Edit
                    </button>
                  </div>
                  
                  {#if block.resolution === 'custom'}
<textarea
                      value={block.resolved}
                      onchange={(e) => handleResolve(block.id, 'custom', e.target.value)}
                      rows={4}
                      class="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono text-xs resize-none"
                    />
{/if}
                </div>
              </div>
{/each}
          </div>

          <div>
            <div class="flex justify-between items-center mb-2">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Resolved Content {#if allResolved}
<span class="text-green-500">✓</span>
{/if}
              </label>
              <button
                onclick={handleCopy}
                class="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
              >
                {copied ? tCommon('copied') : tCommon('copy')}
              </button>
            </div>
            <pre class="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg overflow-x-auto text-xs font-mono text-gray-800 dark:text-gray-200 max-h-64 whitespace-pre-wrap">
              {resolvedContent}
            </pre>
          </div>
        
{:else}
<div class="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg text-center">
          <p class="text-green-700 dark:text-green-300">No merge conflicts detected in the input.</p>
        </div>
{/if}
    </div>
  
