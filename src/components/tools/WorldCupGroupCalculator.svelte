<script lang="ts">
  import { onMount } from 'svelte';
  import { RefreshCw, Zap, Table, GitMerge, RotateCcw } from 'lucide-svelte';
  import { WorldCupCalcState } from '@/lib/runtime-integrity/world-cup-calc-state.svelte';
  import GroupStagePanel from './world-cup-group-calc/GroupStagePanel.svelte';
  import ThirdPlaceRankingTable from './world-cup-group-calc/ThirdPlaceRankingTable.svelte';
  import KnockoutBracketTree from './world-cup-group-calc/KnockoutBracketTree.svelte';
  import fifaRankingsData from '@/lib/data/fifa-rankings.json';

  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Initialize state
  const state = new WorldCupCalcState();
  let activeTab = $state('groups'); // 'groups' | 'knockout'

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']?.[ 'world-cup-group-calculator' ] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) {
      value = (value as Record<string, unknown>)?.[k];
    }
    if (typeof value === 'string') return value;
    
    // Fallback search in general tools scope
    const generalScope = translations['tools'] as Record<string, unknown> || {};
    let fallbackVal: unknown = generalScope;
    for (const k of keys) {
      fallbackVal = (fallbackVal as Record<string, unknown>)?.[k];
    }
    if (typeof fallbackVal === 'string') return fallbackVal;

    return `MISSING: ${key}`;
  }

  function handleReset() {
    if (confirm(t('confirm_reset'))) {
      state.reset();
    }
  }

  function handleFillFavorites() {
    state.reset();
    const fifa = fifaRankingsData as Record<string, number>;
    state.matches.forEach(m => {
      if (m.stage === 'group') {
        const rHome = fifa[m.homeTeam] || 999;
        const rAway = fifa[m.awayTeam] || 999;
        if (rHome < rAway) {
          m.homeScore = 2;
          m.awayScore = 0;
        } else if (rHome > rAway) {
          m.homeScore = 0;
          m.awayScore = 2;
        } else {
          m.homeScore = 1;
          m.awayScore = 1;
        }
      }
    });
    state.cleanupGhostPredictions();
  }

  // Load from localStorage on mount
  onMount(() => {
    const cached = localStorage.getItem('world_cup_group_calc_state');
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        state.loadFromState(parsed);
      } catch (e) {
        console.error('Failed to load world cup calculator state', e);
      }
    }
  });

  // Save to localStorage on state changes
  $effect(() => {
    // Reference variables to trigger reactivity in Svelte 5 $effect
    const matches = state.matches;
    const overrides = state.customTiesOverride;
    const predictions = state.predictedWinners;

    const data = state.saveState();
    localStorage.setItem('world_cup_group_calc_state', JSON.stringify(data));
  });
</script>

<div class="obsidian-calculator-theme min-h-screen bg-zinc-950 text-zinc-100 font-sans antialiased p-4 md:p-6 lg:p-8 space-y-6">
  
  <!-- Tool Header -->
  <div class="flex flex-col md:flex-row md:items-center justify-between border-b border-amber-900/30 pb-5 gap-4">
    <div>
      <h1 class="text-2xl md:text-3xl font-extrabold text-amber-500 tracking-wide font-serif">
        {t('title')}
      </h1>
      <p class="text-zinc-400 text-xs md:text-sm mt-1 max-w-2xl">
        {t('description')}
      </p>
    </div>

    <!-- Quick Action Controls -->
    <div class="flex items-center gap-2">
      <button
        onclick={handleFillFavorites}
        class="flex items-center gap-1.5 px-3 py-1.5 bg-amber-600/10 hover:bg-amber-600/20 border border-amber-500/30 text-amber-400 rounded-lg text-xs font-semibold transition-all shadow-md active:scale-95"
        title={t('fill_favorites_tooltip')}
      >
        <Zap size={13} />
        {t('fill_favorites')}
      </button>
      <button
        onclick={handleReset}
        class="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 rounded-lg text-xs font-semibold transition-all active:scale-95"
      >
        <RotateCcw size={13} />
        {t('reset')}
      </button>
    </div>
  </div>

  <!-- Tabs Navigation -->
  <div class="flex border-b border-zinc-800">
    <button
      onclick={() => activeTab = 'groups'}
      class={`flex items-center gap-2 px-5 py-3 text-xs md:text-sm font-semibold tracking-wider transition-all border-b-2 ${
        activeTab === 'groups'
          ? 'border-amber-500 text-amber-500 bg-amber-500/[0.02]'
          : 'border-transparent text-zinc-400 hover:text-zinc-200'
      }`}
    >
      <Table size={15} />
      {t('tab_groups')}
    </button>
    <button
      onclick={() => activeTab = 'knockout'}
      class={`flex items-center gap-2 px-5 py-3 text-xs md:text-sm font-semibold tracking-wider transition-all border-b-2 ${
        activeTab === 'knockout'
          ? 'border-amber-500 text-amber-500 bg-amber-500/[0.02]'
          : 'border-transparent text-zinc-400 hover:text-zinc-200'
      }`}
    >
      <GitMerge size={15} class="rotate-90" />
      {t('tab_knockout')}
    </button>
  </div>

  <!-- Tab Contents -->
  <div class="space-y-6 pt-2">
    {#if activeTab === 'groups'}
      <!-- Group Stage Panels -->
      <div class="space-y-4">
        <GroupStagePanel {state} {t} />
      </div>

      <!-- Third Place Ranking Table -->
      <div class="max-w-4xl mx-auto pt-6">
        <ThirdPlaceRankingTable {state} {t} />
      </div>
    {:else if activeTab === 'knockout'}
      <!-- Knockout Bracket -->
      <div class="bg-zinc-900/40 border border-zinc-800/80 rounded-xl p-3 md:p-6 shadow-2xl">
        <div class="border-b border-amber-900/20 pb-3 mb-4 flex items-center justify-between">
          <div>
            <h3 class="text-lg font-bold text-amber-400 tracking-wider">
              {t('knockout_stage')}
            </h3>
            <p class="text-zinc-500 text-xs mt-0.5">
              {t('knockout_stage_desc')}
            </p>
          </div>
        </div>
        <KnockoutBracketTree {state} {t} />
      </div>
    {/if}
  </div>

</div>

<style>
  /* Strict style isolation and scrollbar styling under gold obsidian calculator theme */
  :global(.obsidian-calculator-theme) {
    --tw-ring-color: rgba(245, 158, 11, 0.4);
  }

  /* Custom input number spinners removal */
  input[type="number"]::-webkit-inner-spin-button,
  input[type="number"]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  input[type="number"] {
    -moz-appearance: textfield;
  }
</style>
