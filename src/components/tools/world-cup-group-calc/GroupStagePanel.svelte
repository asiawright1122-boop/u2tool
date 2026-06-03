<script lang="ts">
  import { ArrowUpDown } from 'lucide-svelte';
  import type { WorldCupCalcState } from '@/lib/runtime-integrity/world-cup-calc-state.svelte';
  import type { TeamStanding, Match } from '@/lib/runtime-integrity/world-cup-calculator-engine';

  interface Props {
    state: WorldCupCalcState;
    t: (key: string) => string;
  }

  let { state, t }: Props = $props();

  function handleScoreChange(matchId: string, isHome: boolean, valStr: string) {
    const match = state.matches.find(m => m.id === matchId);
    if (!match) return;
    const val = valStr === '' ? null : parseInt(valStr, 10);
    const finalVal = isNaN(val as number) ? null : val;
    if (isHome) {
      state.updateScore(matchId, finalVal, match.awayScore);
    } else {
      state.updateScore(matchId, match.homeScore, finalVal);
    }
  }

  function canSwap(a: TeamStanding, b: TeamStanding) {
    return a.points === b.points && a.gd === b.gd && a.gf === b.gf;
  }
</script>

<div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
  {#each state.groups as groupLetter}
    {@const groupMatches = state.matches.filter(m => m.stage === 'group' && m.group === groupLetter)}
    {@const standings = state.groupStandings[groupLetter] || []}
    
    <div class="bg-zinc-900/90 border border-amber-900/30 rounded-xl p-5 shadow-2xl space-y-5">
      <!-- Group Title -->
      <div class="flex items-center justify-between border-b border-amber-900/20 pb-2">
        <h3 class="text-lg font-bold text-amber-400 tracking-wider">
          {t('group')} {groupLetter}
        </h3>
      </div>

      <!-- Matches Inputs List -->
      <div class="space-y-2">
        {#each groupMatches as match}
          <div class="flex items-center justify-between bg-zinc-950/60 p-2 rounded-lg border border-zinc-800/40 text-xs">
            <!-- Home Team -->
            <div class="flex items-center gap-2 w-[40%]">
              <span class="font-mono text-zinc-400 w-8">{match.homeTeam}</span>
              <span class="font-medium text-zinc-200 truncate" title={t(`teams.${match.homeTeam}`)}>
                {t(`teams.${match.homeTeam}`)}
              </span>
            </div>

            <!-- Score Inputs -->
            <div class="flex items-center gap-1">
              <input
                type="number"
                min="0"
                placeholder="-"
                value={match.homeScore ?? ''}
                oninput={(e) => handleScoreChange(match.id, true, (e.currentTarget as HTMLInputElement).value)}
                class="w-10 text-center bg-black border border-zinc-800 focus:border-amber-500 text-white rounded py-1 text-xs font-semibold"
              />
              <span class="text-zinc-600">:</span>
              <input
                type="number"
                min="0"
                placeholder="-"
                value={match.awayScore ?? ''}
                oninput={(e) => handleScoreChange(match.id, false, (e.currentTarget as HTMLInputElement).value)}
                class="w-10 text-center bg-black border border-zinc-800 focus:border-amber-500 text-white rounded py-1 text-xs font-semibold"
              />
            </div>

            <!-- Away Team -->
            <div class="flex items-center justify-end gap-2 w-[40%] text-right">
              <span class="font-medium text-zinc-200 truncate" title={t(`teams.${match.awayTeam}`)}>
                {t(`teams.${match.awayTeam}`)}
              </span>
              <span class="font-mono text-zinc-400 w-8">{match.awayTeam}</span>
            </div>
          </div>
        {/each}
      </div>

      <!-- Standings Table -->
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse text-xs">
          <thead>
            <tr class="border-b border-amber-900/20 text-zinc-400 font-semibold">
              <th class="py-1.5 w-8 text-center">#</th>
              <th class="py-1.5">{t('team')}</th>
              <th class="py-1.5 text-center w-8">{t('played_short')}</th>
              <th class="py-1.5 text-center w-10">{t('gd_short')}</th>
              <th class="py-1.5 text-center w-10">{t('pts_short')}</th>
              <th class="py-1.5 text-center w-8">⇅</th>
            </tr>
          </thead>
          <tbody>
            {#each standings as team, i}
              {@const isTop2 = i < 2}
              {@const is3rd = i === 2}
              {@const best3rdRankings = state.thirdPlaceRankings}
              {@const isBest3rdQualified = is3rd && best3rdRankings.slice(0, 8).some(x => x.id === team.id)}
              
              <tr class="border-b border-zinc-800/40 hover:bg-zinc-800/20 transition-colors">
                <!-- Rank # -->
                <td class="py-2 text-center font-semibold">
                  <span class={`inline-flex items-center justify-center w-5 h-5 rounded-full ${
                    isTop2
                      ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                      : isBest3rdQualified
                        ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30'
                        : 'text-zinc-500'
                  }`}>
                    {i + 1}
                  </span>
                </td>

                <!-- Team Name -->
                <td class="py-2 font-medium">
                  <div class="flex items-center gap-1.5">
                    <span class="font-mono text-zinc-400">{team.id}</span>
                    <span class="text-zinc-200 truncate max-w-[80px]" title={t(`teams.${team.id}`)}>
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

                <!-- Points -->
                <td class="py-2 text-center text-zinc-200 font-mono font-bold">{team.points}</td>

                <!-- Swap action -->
                <td class="py-2 text-center">
                  {#if i < standings.length - 1 && canSwap(team, standings[i + 1])}
                    <button
                      onclick={() => state.swapStandings(groupLetter, i, i + 1)}
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
  {/each}
</div>
