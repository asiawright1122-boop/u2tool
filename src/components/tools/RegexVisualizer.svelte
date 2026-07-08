<script lang="ts">
  import { generateSvg, tokenizeRegex } from '@/lib/tool-stubs';
  import { sanitizeSvg } from '@/lib/sanitize';
  import { collectRegexMatches } from '@/lib/regex-matching';

  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['regex-visualizer'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.regex-visualizer.${key}`;
  }
  function tg(key: string): string {
    const scope = translations['tools'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.${key}`;
  }

  // Types
  interface MatchResult {
  match: string;
  index: number;
  groups: string[];
}
  interface RegexToken {
  type: 'literal' | 'group' | 'charset' | 'quantifier' | 'anchor' | 'alternation' | 'special';
  value: string;
  children?: RegexToken[];
}

  let pattern = $state('');

  let testString = $state('');

  let matches = $state([]);

  let error = $state('');

  let svg = $state('');

  let svgRef = $state(null);

  function handleVisualize() {
    if (!pattern.trim()) {
      svg = '';
      matches = [];
      error = '';
      return;
    }

    try {
      // Validate regex
      const regex = new RegExp(pattern, 'g');
      
      // Generate visualization
      const tokens = tokenizeRegex(pattern);
      const svgContent = generateSvg(tokens);
      svg = svgContent;
      
      // Find matches
      if (testString) {
        matches = collectRegexMatches(regex, testString).matches.map((match) => ({
          match: match.match,
          index: match.index,
          groups: match.captures,
        }));
      } else {
        matches = [];
      }
      
      error = '';
    } catch (e) {
      error = t('invalidRegex') + ': ' + (e as Error).message;
      svg = '';
      matches = [];
    }
  }

  // Functions
  function handleClear() {
    pattern = '';
    testString = '';
    matches = [];
    svg = '';
    error = '';
  }
  function exportSvg() {
    if (!svg) return;
    const safeSvg = sanitizeSvg(svg);
    if (!safeSvg.trim()) return;

    const blob = new Blob([safeSvg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'regex-diagram.svg';
    a.click();
    URL.revokeObjectURL(url);
  }
  async function exportPng() {
    if (!svg || !svgRef) return;
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const safeSvg = sanitizeSvg(svg);
    if (!safeSvg.trim()) return;

    const img = new Image();
    const svgBlob = new Blob([safeSvg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(svgBlob);
    
    img.onload = () => {
      canvas.width = img.width * 2;
      canvas.height = img.height * 2;
      ctx.scale(2, 2);
      ctx.drawImage(img, 0, 0);
      
      const pngUrl = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = pngUrl;
      a.download = 'regex-diagram.png';
      a.click();
      
      URL.revokeObjectURL(url);
    };
    
    img.src = url;
  }
  const highlightedString = testString && matches.length > 0 ? (() => {
    const result: Array<{type: string; text: string; key: string}> = [];
    let lastIndex = 0;
    
    for (const match of matches) {
      if (match.index > lastIndex) {
        result.push({ type: "text", text: testString.slice(lastIndex, match.index), key: `text-${lastIndex}` });
      }
      result.push({ type: "match", text: match.match, key: `match-${match.index}` });
      lastIndex = match.index + match.match.length;
    }
    
    if (lastIndex < testString.length) {
      result.push({ type: "text", text: testString.slice(lastIndex), key: `text-${lastIndex}` });
    }
    
    return result;
  })() : null;

</script>


    <div class="space-y-4">
      <!-- Pattern Input -->
      <div>
        <label for="regex-visualizer-field-6" class="tool-label">
          {t('pattern')}
        </label>
        <input
          type="text"
          class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 font-mono"
          bind:value={pattern}
          placeholder={t('patternPlaceholder')} id="regex-visualizer-field-6" />
      </div>

      <!-- Test String Input -->
      <div>
        <label for="regex-visualizer-field-5" class="tool-label">
          {t('testString')}
        </label>
        <textarea
          class="tool-textarea font-mono"
          bind:value={testString}
          placeholder={t('testStringPlaceholder')}
          rows={3} id="regex-visualizer-field-5"></textarea>
      </div>

      <!-- Action Buttons -->
      <div class="flex flex-wrap gap-2">
        <button onclick={handleVisualize} class="btn-primary">
          {t('visualize')}
        </button>
        <button onclick={handleClear} class="btn-secondary">
          {tg('clear')}
        </button>
      </div>

      <!-- Error Section -->
      {#if error}
<div class="tool-error">
          {error}
        </div>
{/if}

      <!-- Diagram Section -->
      {#if svg}
<div>
          <div class="flex justify-between items-center mb-2">
            <div class="text-sm font-medium text-gray-700 dark:text-gray-300">
              {t('diagram')}
            </div>
            <div class="flex gap-2">
              <button
                onclick={exportSvg}
                class="text-sm px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100"
              >
                {t('exportSvg')}
              </button>
              <button
                onclick={exportPng}
                class="text-sm px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100"
              >
                {t('exportPng')}
              </button>
            </div>
          </div>
          <div 
            bind:this={svgRef}
            class="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-x-auto">{@html sanitizeSvg(svg)}</div>
        </div>
{/if}

      <!-- Matches Section -->
      {#if testString}
<div>
          <div class="tool-label">
            {t('matches')} ({matches.length})
          </div>
          <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            {#if matches.length > 0}

                <div class="font-mono text-gray-900 dark:text-gray-100 mb-4 whitespace-pre-wrap">
                  {highlightedString}
                </div>
                <div class="space-y-2">
                  {#each matches as match, index (index)}
<div  class="text-sm">
                      <span class="text-gray-500 dark:text-gray-400">Match {index + 1}:</span>{' '}
                      <span class="font-mono bg-yellow-100 dark:bg-yellow-900/30 px-1 rounded">
                        {match.match}
                      </span>
                      <span class="text-gray-500 dark:text-gray-400 ml-2">
                        (index: {match.index})
                      </span>
                    </div>
{/each}
                </div>
              
{:else}
<div class="text-gray-500 dark:text-gray-400">
                {t('noMatches')}
              </div>
{/if}
          </div>
        </div>
{/if}
    </div>
  
