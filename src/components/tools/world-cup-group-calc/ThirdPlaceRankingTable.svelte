<script lang="ts">
  import { ArrowUpDown } from 'lucide-svelte';
  import type { WorldCupCalcState } from '@/lib/runtime-integrity/world-cup-calc-state.svelte';
  import type { TeamStanding } from '@/lib/runtime-integrity/world-cup-calculator-engine';

  interface Props {
    state: WorldCupCalcState;
    t: (key: string) => string;
  }

  let { state, t }: Props = $props();

  function canSwap(a: TeamStanding, b: TeamStanding) {
    return a.points === b.points && a.gd === b.gd && a.gf === b.gf;
  }
</script>

<div class="bg-zinc-900/90 border border-amber-900/30 rounded-xl p-5 shadow-2xl space-y-4">
  <div class="border-b border-amber-900/20 pb-2">
    <h3 class="text-lg font-bold text-amber-400 tracking-wider">
      {t('third_place_ranking')}
    </h3>
    <p class="text-zinc-500 text-xs mt-1">
      {t('third_place_desc')}
    </p>
  </div>

  <div class="overflow-x-auto">
    <table class="w-full text-left border-collapse text-xs">
      <thead>
        <tr class="border-b border-amber-900/20 text-zinc-400 font-semibold">
          <th class="py-2 w-8 text-center">#</th>
          <th class="py-2 w-12 text-center">{t('group_short')}</th>
          <th class="py-2">{t('team')}</th>
          <th class="py-2 text-center w-12">{t('played_short')}</th>
          <th class="py-2 text-center w-12">{t('gd_short')}</th>
          <th class="py-2 text-center w-12">{t('gf_short')}</th>
          <th class="py-2 text-center w-14">{t('pts_short')}</th>
          <th class="py-2 text-center w-12">⇅</th>
        </tr>
      </thead>
      <tbody>
        {#each state.thirdPlaceRankings as team, i}
          {@const isQualified = i < 8}
          {@const groupTeams = state.groupTeamsMap}
          {@const teamGroup = Object.keys(groupTeams).find(k => groupTeams[k].includes(team.id)) || ''}
          
          <!-- Border separating qualified and eliminated -->
          {#if i === 8}
            <tr class="bg-amber-950/20 border-y border-amber-900/30">
              <td colspan="8" class="py-1.5 px-3 text-center text-[10px] uppercase tracking-wider font-semibold text-amber-500/80">
                --- {t('elimination_boundary')} ---
              </td>
            </tr>
          {/if}

          <tr class={`border-b border-zinc-800/40 hover:bg-zinc-800/20 transition-colors ${
            isQualified ? 'bg-amber-500/[0.02]' : 'opacity-60'
          }`}>
            <!-- Rank # -->
            <td class="py-2 text-center font-semibold">
              <span class={`inline-flex items-center justify-center w-5 h-5 rounded-full ${
                isQualified
                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                  : 'bg-zinc-800 text-zinc-500'
              }`}>
                {i + 1}
              </span>
            </td>

            <!-- Group -->
            <td class="py-2 text-center font-bold text-zinc-400 font-mono">
              {teamGroup}
            </td>

            <!-- Team Name -->
            <td class="py-2 font-medium">
              <div class="flex items-center gap-1.5">
                <span class="font-mono text-zinc-400">{team.id}</span>
                <span class="text-zinc-200 truncate max-w-[120px]" title={t(`teams.${team.id}`)}>
                  {t(`teams.${team.id}`)}
                </span>
              </div>
            </td>

            <!-- Played -->
            <td class="py-2 text-center text-zinc-400 font-mono">{team.played}</td>

            <!-- GD -->
            <td class={`py-2 text-center font-mono font-semibold ${
              team.gd > 0 ? 'text-green-500' : team.gd < 0 ? 'text-red-500' : 'text-zinc-400'
            }`}>
              {team.gd > 0 ? '+' : ''}{team.gd}
            </td>

            <!-- GF -->
            <td class="py-2 text-center text-zinc-400 font-mono">{team.gf}</td>

            <!-- Points -->
            <td class={`py-2 text-center font-mono font-bold ${isQualified ? 'text-amber-400' : 'text-zinc-300'}`}>
              {team.points}
            </td>

            <!-- Swap action -->
            <td class="py-2 text-center">
              {#if i < state.thirdPlaceRankings.length - 1 && canSwap(team, state.thirdPlaceRankings[i + 1])}
                <button
                  onclick={() => state.swapThirdPlace(i, i + 1)}
                  class="text-amber-500 hover:text-amber-400 p-1 hover:bg-zinc-800 rounded transition-colors"
                  title={t('adjust_tiebreaker')}
                >
                  <ArrowUpDown size={12} />
                </button>
              {:else}
                <span class="text-zinc-800 font-mono">-</span>
              {/if}
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>
