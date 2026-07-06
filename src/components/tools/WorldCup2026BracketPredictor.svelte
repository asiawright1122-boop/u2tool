<script lang="ts">
  import { Check, Copy, RefreshCw, Trophy } from 'lucide-svelte';
  import { onDestroy } from 'svelte';
  import {
    advanceBracket,
    buildDefaultBracket,
    type WorldCupMatch,
  } from '../../lib/world-cup-2026-bracket';

  interface Props {
    locale?: string;
    translations?: Record<string, unknown>;
  }

  let { translations = {} }: Props = $props();

  const COPY = {
    title: 'World Cup 2026 Bracket Predictor',
    subtitle: 'Pick winners through a simplified 2026 knockout bracket and copy your champion path.',
    champion: 'Champion',
    copy: 'Copy prediction',
    copied: 'Copied',
    reset: 'Reset picks',
    note: 'Simplified predictor. It does not fetch live FIFA results.',
  };

  const bracketSeed = buildDefaultBracket();

  let picks = $state<Record<string, string>>({});
  let copied = $state(false);
  let copyTimer: ReturnType<typeof setTimeout> | null = null;

  const result = $derived(advanceBracket(bracketSeed, picks));

  function toolMessage(key: string, fallback: string) {
    const toolsScope = translations.tools as Record<string, unknown> | undefined;
    const toolScope = toolsScope?.['world-cup-2026-bracket-predictor'] as Record<string, unknown> | undefined;
    const value = toolScope?.[key];
    return typeof value === 'string' ? value : fallback;
  }

  function selectedWinner(match: WorldCupMatch) {
    return picks[match.id] || match.winner || match.home;
  }

  function pick(matchId: string, team: string) {
    picks = { ...picks, [matchId]: team };
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(result.summary);
    copied = true;
    if (copyTimer) {
      clearTimeout(copyTimer);
    }
    copyTimer = setTimeout(() => {
      copied = false;
    }, 1600);
  }

  function resetPicks() {
    picks = {};
  }

  onDestroy(() => {
    if (copyTimer) {
      clearTimeout(copyTimer);
    }
  });
</script>

<div class="space-y-6">
  <div>
    <h2 class="text-xl font-bold text-slate-900 dark:text-white">{toolMessage('name', COPY.title)}</h2>
    <p class="mt-2 text-sm text-slate-600 dark:text-slate-400">{toolMessage('description', COPY.subtitle)}</p>
  </div>

  <div class="rounded-lg border border-amber-200 bg-amber-50 p-5 dark:border-amber-900 dark:bg-amber-950/30">
    <div class="flex items-center gap-3">
      <div class="rounded-full bg-amber-600 p-2 text-white">
        <Trophy class="h-5 w-5" aria-hidden="true" />
      </div>
      <div>
        <div class="text-xs font-semibold uppercase text-amber-800 dark:text-amber-300">{COPY.champion}</div>
        <div class="text-2xl font-bold text-slate-900 dark:text-white">{result.champion}</div>
      </div>
    </div>
  </div>

  <div class="space-y-6">
    {#each result.rounds as round (round.name)}
      <section>
        <h3 class="mb-3 text-sm font-semibold uppercase text-slate-500 dark:text-slate-400">{round.name}</h3>
        <div class="grid grid-cols-1 gap-3 md:grid-cols-2">
          {#each round.matches as match (match.id)}
            <div class="rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-900">
              <div class="mb-2 text-xs font-semibold text-slate-500 dark:text-slate-400">{match.id}</div>
              <div class="grid grid-cols-1 gap-2">
                <button
                  type="button"
                  class:selected={selectedWinner(match) === match.home}
                  class="rounded-lg border border-slate-200 px-3 py-2 text-left text-sm font-medium text-slate-700 transition hover:border-amber-400 hover:bg-amber-50 dark:border-slate-700 dark:text-slate-200 dark:hover:border-amber-500 dark:hover:bg-amber-950/30"
                  onclick={() => pick(match.id, match.home)}
                >
                  {match.home}
                </button>
                <button
                  type="button"
                  class:selected={selectedWinner(match) === match.away}
                  class="rounded-lg border border-slate-200 px-3 py-2 text-left text-sm font-medium text-slate-700 transition hover:border-amber-400 hover:bg-amber-50 dark:border-slate-700 dark:text-slate-200 dark:hover:border-amber-500 dark:hover:bg-amber-950/30"
                  onclick={() => pick(match.id, match.away)}
                >
                  {match.away}
                </button>
              </div>
            </div>
          {/each}
        </div>
      </section>
    {/each}
  </div>

  <div class="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-950">
    <pre class="whitespace-pre-wrap break-words text-sm text-slate-700 dark:text-slate-200">{result.summary}</pre>
  </div>

  <div class="flex flex-wrap gap-3">
    <button type="button" class="btn-primary inline-flex items-center gap-2" onclick={handleCopy}>
      {#if copied}
        <Check class="h-4 w-4" aria-hidden="true" />
        {COPY.copied}
      {:else}
        <Copy class="h-4 w-4" aria-hidden="true" />
        {COPY.copy}
      {/if}
    </button>
    <button type="button" class="btn-secondary inline-flex items-center gap-2" onclick={resetPicks}>
      <RefreshCw class="h-4 w-4" aria-hidden="true" />
      {COPY.reset}
    </button>
  </div>

  <p class="text-xs font-medium text-slate-500 dark:text-slate-400">{COPY.note}</p>
</div>

<style>
  .selected {
    border-color: rgb(217 119 6);
    background: rgb(255 251 235);
    color: rgb(120 53 15);
  }

  :global(.dark) .selected {
    border-color: rgb(245 158 11);
    background: rgba(120, 53, 15, 0.28);
    color: rgb(253 230 138);
  }
</style>
