<script lang="ts">
  import { Trophy, Check } from 'lucide-svelte';
  import type { WorldCupCalcState } from '@/lib/runtime-integrity/world-cup-calc-state.svelte';

  interface Props {
    calcState: WorldCupCalcState;
    t: (key: string) => string;
  }

  let { calcState, t }: Props = $props();

  const r32List = ['M73', 'M74', 'M75', 'M76', 'M77', 'M78', 'M79', 'M80', 'M81', 'M82', 'M83', 'M84', 'M85', 'M86', 'M87', 'M88'];
  const r16List = ['M89', 'M90', 'M91', 'M92', 'M93', 'M94', 'M95', 'M96'];
  const qfList = ['M97', 'M98', 'M99', 'M100'];
  const sfList = ['M101', 'M102'];

  function handleTeamClick(matchId: string, teamId: string) {
    if (!teamId || teamId.startsWith('TBA_') || teamId.startsWith('3rd_')) return;
    if (calcState.predictedWinners[matchId] === teamId) {
      calcState.predictWinner(matchId, null);
    } else {
      calcState.predictWinner(matchId, teamId);
    }
  }

  function getDisplayInfo(teamId: string, placeholder: string) {
    if (!teamId || teamId.startsWith('TBA_') || teamId.startsWith('3rd_')) {
      return {
        id: '',
        name: placeholder || 'TBA',
        isTba: true
      };
    }
    return {
      id: teamId,
      name: t(`teams.${teamId}`) || teamId,
      isTba: false
    };
  }
</script>

<div class="w-full overflow-x-auto pb-8 pt-4 select-none scrollbar-thin scrollbar-thumb-amber-900/30 scrollbar-track-transparent">
  <div class="flex gap-8 min-w-[1300px] h-[960px] px-4">
    
    <!-- Column 1: Round of 32 -->
    <div class="flex flex-col justify-around h-full w-[240px] shrink-0">
      <div class="text-center font-bold text-amber-600 dark:text-amber-500 uppercase tracking-widest border-b border-amber-900/10 dark:border-amber-900/20 pb-2 mb-2 shrink-0">
        {t('r32_title')}
      </div>
      {#each r32List as mId}
        {@const match = calcState.knockoutBracket.matchesMap[mId]}
        {#if match}
          {@const home = getDisplayInfo(match.homeTeam, match.placeholderHome)}
          {@const away = getDisplayInfo(match.awayTeam, match.placeholderAway)}
          <div class="bg-white/95 dark:bg-zinc-950/80 border border-slate-200 dark:border-zinc-800/80 rounded-lg p-2.5 shadow-lg space-y-1.5 hover:border-amber-500/30 transition-all">
            <div class="text-[9px] font-mono text-zinc-500 flex justify-between">
              <span>{match.id}</span>
              <span>{t('r32_match')}</span>
            </div>
            
            <div class="space-y-1">
              <!-- Home -->
              <button
                onclick={() => handleTeamClick(match.id, match.homeTeam)}
                disabled={home.isTba}
                class={`w-full flex items-center justify-between px-2 py-1.5 rounded transition-all text-left ${
                  home.isTba ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:bg-slate-100 dark:hover:bg-zinc-800/50'
                } ${match.winner === match.homeTeam ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 font-semibold' : 'text-slate-700 dark:text-zinc-300'}`}
              >
                <div class="flex items-center gap-1.5 truncate">
                  {#if !home.isTba}
                    <span class="font-mono text-xs text-zinc-500 shrink-0">{home.id}</span>
                  {/if}
                  <span class="text-xs truncate">{home.name}</span>
                </div>
                {#if match.winner === match.homeTeam}
                  <Check size={12} class="text-amber-600 dark:text-amber-400 shrink-0" />
                {/if}
              </button>

              <!-- Away -->
              <button
                onclick={() => handleTeamClick(match.id, match.awayTeam)}
                disabled={away.isTba}
                class={`w-full flex items-center justify-between px-2 py-1.5 rounded transition-all text-left ${
                  away.isTba ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:bg-slate-100 dark:hover:bg-zinc-800/50'
                } ${match.winner === match.awayTeam ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 font-semibold' : 'text-slate-700 dark:text-zinc-300'}`}
              >
                <div class="flex items-center gap-1.5 truncate">
                  {#if !away.isTba}
                    <span class="font-mono text-xs text-zinc-500 shrink-0">{away.id}</span>
                  {/if}
                  <span class="text-xs truncate">{away.name}</span>
                </div>
                {#if match.winner === match.awayTeam}
                  <Check size={12} class="text-amber-600 dark:text-amber-400 shrink-0" />
                {/if}
              </button>
            </div>
          </div>
        {/if}
      {/each}
    </div>

    <!-- Column 2: Round of 16 -->
    <div class="flex flex-col justify-around h-full w-[240px] shrink-0">
      <div class="text-center font-bold text-amber-600 dark:text-amber-500 uppercase tracking-widest border-b border-amber-900/10 dark:border-amber-900/20 pb-2 mb-2 shrink-0">
        {t('r16_title')}
      </div>
      {#each r16List as mId}
        {@const match = calcState.knockoutBracket.matchesMap[mId]}
        {#if match}
          {@const home = getDisplayInfo(match.homeTeam, t('winner_m') + mId.replace('M', ' '))}
          {@const away = getDisplayInfo(match.awayTeam, t('winner_m') + mId.replace('M', ' '))}
          <div class="bg-white/95 dark:bg-zinc-950/80 border border-slate-200 dark:border-zinc-800/80 rounded-lg p-2.5 shadow-lg space-y-1.5 hover:border-amber-500/30 transition-all">
            <div class="text-[9px] font-mono text-zinc-500 flex justify-between">
              <span>{match.id}</span>
              <span>{t('r16_match')}</span>
            </div>
            
            <div class="space-y-1">
              <button
                onclick={() => handleTeamClick(match.id, match.homeTeam)}
                disabled={home.isTba}
                class={`w-full flex items-center justify-between px-2 py-1.5 rounded transition-all text-left ${
                  home.isTba ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:bg-slate-100 dark:hover:bg-zinc-800/50'
                } ${match.winner === match.homeTeam ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 font-semibold' : 'text-slate-700 dark:text-zinc-300'}`}
              >
                <div class="flex items-center gap-1.5 truncate">
                  {#if !home.isTba}
                    <span class="font-mono text-xs text-zinc-500 shrink-0">{home.id}</span>
                  {/if}
                  <span class="text-xs truncate">{match.homeTeam ? home.name : match.placeholderHome}</span>
                </div>
                {#if match.winner === match.homeTeam}
                  <Check size={12} class="text-amber-600 dark:text-amber-400 shrink-0" />
                {/if}
              </button>

              <button
                onclick={() => handleTeamClick(match.id, match.awayTeam)}
                disabled={away.isTba}
                class={`w-full flex items-center justify-between px-2 py-1.5 rounded transition-all text-left ${
                  away.isTba ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:bg-slate-100 dark:hover:bg-zinc-800/50'
                } ${match.winner === match.awayTeam ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 font-semibold' : 'text-slate-700 dark:text-zinc-300'}`}
              >
                <div class="flex items-center gap-1.5 truncate">
                  {#if !away.isTba}
                    <span class="font-mono text-xs text-zinc-500 shrink-0">{away.id}</span>
                  {/if}
                  <span class="text-xs truncate">{match.awayTeam ? away.name : match.placeholderAway}</span>
                </div>
                {#if match.winner === match.awayTeam}
                  <Check size={12} class="text-amber-600 dark:text-amber-400 shrink-0" />
                {/if}
              </button>
            </div>
          </div>
        {/if}
      {/each}
    </div>

    <!-- Column 3: Quarter-Finals -->
    <div class="flex flex-col justify-around h-full w-[240px] shrink-0">
      <div class="text-center font-bold text-amber-600 dark:text-amber-500 uppercase tracking-widest border-b border-amber-900/10 dark:border-amber-900/20 pb-2 mb-2 shrink-0">
        {t('qf_title')}
      </div>
      {#each qfList as mId}
        {@const match = calcState.knockoutBracket.matchesMap[mId]}
        {#if match}
          {@const home = getDisplayInfo(match.homeTeam, match.placeholderHome)}
          {@const away = getDisplayInfo(match.awayTeam, match.placeholderAway)}
          <div class="bg-white/95 dark:bg-zinc-950/80 border border-slate-200 dark:border-zinc-800/80 rounded-lg p-2.5 shadow-lg space-y-1.5 hover:border-amber-500/30 transition-all">
            <div class="text-[9px] font-mono text-zinc-500 flex justify-between">
              <span>{match.id}</span>
              <span>{t('qf_match')}</span>
            </div>
            
            <div class="space-y-1">
              <button
                onclick={() => handleTeamClick(match.id, match.homeTeam)}
                disabled={home.isTba}
                class={`w-full flex items-center justify-between px-2 py-1.5 rounded transition-all text-left ${
                  home.isTba ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:bg-slate-100 dark:hover:bg-zinc-800/50'
                } ${match.winner === match.homeTeam ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 font-semibold' : 'text-slate-700 dark:text-zinc-300'}`}
              >
                <div class="flex items-center gap-1.5 truncate">
                  {#if !home.isTba}
                    <span class="font-mono text-xs text-zinc-500 shrink-0">{home.id}</span>
                  {/if}
                  <span class="text-xs truncate">{match.homeTeam ? home.name : match.placeholderHome}</span>
                </div>
                {#if match.winner === match.homeTeam}
                  <Check size={12} class="text-amber-600 dark:text-amber-400 shrink-0" />
                {/if}
              </button>

              <button
                onclick={() => handleTeamClick(match.id, match.awayTeam)}
                disabled={away.isTba}
                class={`w-full flex items-center justify-between px-2 py-1.5 rounded transition-all text-left ${
                  away.isTba ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:bg-slate-100 dark:hover:bg-zinc-800/50'
                } ${match.winner === match.awayTeam ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 font-semibold' : 'text-slate-700 dark:text-zinc-300'}`}
              >
                <div class="flex items-center gap-1.5 truncate">
                  {#if !away.isTba}
                    <span class="font-mono text-xs text-zinc-500 shrink-0">{away.id}</span>
                  {/if}
                  <span class="text-xs truncate">{match.awayTeam ? away.name : match.placeholderAway}</span>
                </div>
                {#if match.winner === match.awayTeam}
                  <Check size={12} class="text-amber-600 dark:text-amber-400 shrink-0" />
                {/if}
              </button>
            </div>
          </div>
        {/if}
      {/each}
    </div>

    <!-- Column 4: Semi-Finals -->
    <div class="flex flex-col justify-around h-full w-[240px] shrink-0">
      <div class="text-center font-bold text-amber-600 dark:text-amber-500 uppercase tracking-widest border-b border-amber-900/10 dark:border-amber-900/20 pb-2 mb-2 shrink-0">
        {t('sf_title')}
      </div>
      {#each sfList as mId}
        {@const match = calcState.knockoutBracket.matchesMap[mId]}
        {#if match}
          {@const home = getDisplayInfo(match.homeTeam, match.placeholderHome)}
          {@const away = getDisplayInfo(match.awayTeam, match.placeholderAway)}
          <div class="bg-white/95 dark:bg-zinc-950/80 border border-slate-200 dark:border-zinc-800/80 rounded-lg p-2.5 shadow-lg space-y-1.5 hover:border-amber-500/30 transition-all">
            <div class="text-[9px] font-mono text-zinc-500 flex justify-between">
              <span>{match.id}</span>
              <span>{t('sf_match')}</span>
            </div>
            
            <div class="space-y-1">
              <button
                onclick={() => handleTeamClick(match.id, match.homeTeam)}
                disabled={home.isTba}
                class={`w-full flex items-center justify-between px-2 py-1.5 rounded transition-all text-left ${
                  home.isTba ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:bg-slate-100 dark:hover:bg-zinc-800/50'
                } ${match.winner === match.homeTeam ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 font-semibold' : 'text-slate-700 dark:text-zinc-300'}`}
              >
                <div class="flex items-center gap-1.5 truncate">
                  {#if !home.isTba}
                    <span class="font-mono text-xs text-zinc-500 shrink-0">{home.id}</span>
                  {/if}
                  <span class="text-xs truncate">{match.homeTeam ? home.name : match.placeholderHome}</span>
                </div>
                {#if match.winner === match.homeTeam}
                  <Check size={12} class="text-amber-600 dark:text-amber-400 shrink-0" />
                {/if}
              </button>

              <button
                onclick={() => handleTeamClick(match.id, match.awayTeam)}
                disabled={away.isTba}
                class={`w-full flex items-center justify-between px-2 py-1.5 rounded transition-all text-left ${
                  away.isTba ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:bg-slate-100 dark:hover:bg-zinc-800/50'
                } ${match.winner === match.awayTeam ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 font-semibold' : 'text-slate-700 dark:text-zinc-300'}`}
              >
                <div class="flex items-center gap-1.5 truncate">
                  {#if !away.isTba}
                    <span class="font-mono text-xs text-zinc-500 shrink-0">{away.id}</span>
                  {/if}
                  <span class="text-xs truncate">{match.awayTeam ? away.name : match.placeholderAway}</span>
                </div>
                {#if match.winner === match.awayTeam}
                  <Check size={12} class="text-amber-600 dark:text-amber-400 shrink-0" />
                {/if}
              </button>
            </div>
          </div>
        {/if}
      {/each}
    </div>

    <!-- Column 5: Finals & Champion -->
    <div class="flex flex-col justify-around h-full w-[260px] shrink-0">
      <div class="text-center font-bold text-amber-600 dark:text-amber-500 uppercase tracking-widest border-b border-amber-900/10 dark:border-amber-900/20 pb-2 mb-2 shrink-0">
        {t('finals_title')}
      </div>
      
      <!-- Final (M104) -->
      {#if calcState.knockoutBracket.matchesMap['M104']}
        {@const finalMatch = calcState.knockoutBracket.matchesMap['M104']}
        {@const home = getDisplayInfo(finalMatch.homeTeam, finalMatch.placeholderHome)}
        {@const away = getDisplayInfo(finalMatch.awayTeam, finalMatch.placeholderAway)}
        
        <div class="space-y-4">
          <div class="text-xs text-center font-bold text-amber-600 dark:text-amber-550 uppercase tracking-wider">{t('final_title')}</div>
          <div class="bg-white dark:bg-zinc-950 border-2 border-amber-500/40 rounded-xl p-4 shadow-2xl space-y-3 relative overflow-hidden bg-gradient-to-b from-slate-50 dark:from-zinc-900 to-white dark:to-black">
            <div class="absolute top-0 right-0 p-1.5 bg-amber-500/10 border-b border-l border-amber-500/20 rounded-bl text-[8px] font-mono text-amber-600 dark:text-amber-400 font-bold">
              {finalMatch.id}
            </div>

            <div class="space-y-2">
              <button
                onclick={() => handleTeamClick(finalMatch.id, finalMatch.homeTeam)}
                disabled={home.isTba}
                class={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all text-left ${
                  home.isTba ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:bg-slate-100 dark:hover:bg-zinc-800/80'
                } ${finalMatch.winner === finalMatch.homeTeam ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-505/60 font-bold' : 'text-slate-700 dark:text-zinc-300'}`}
              >
                <div class="flex items-center gap-2 truncate">
                  {#if !home.isTba}
                    <span class="font-mono text-xs text-zinc-500 shrink-0">{home.id}</span>
                  {/if}
                  <span class="text-sm truncate">{finalMatch.homeTeam ? home.name : finalMatch.placeholderHome}</span>
                </div>
                {#if finalMatch.winner === finalMatch.homeTeam}
                  <Check size={14} class="text-amber-600 dark:text-amber-400 shrink-0" />
                {/if}
              </button>

              <button
                onclick={() => handleTeamClick(finalMatch.id, finalMatch.awayTeam)}
                disabled={away.isTba}
                class={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all text-left ${
                  away.isTba ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:bg-slate-100 dark:hover:bg-zinc-800/80'
                } ${finalMatch.winner === finalMatch.awayTeam ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-505/60 font-bold' : 'text-slate-700 dark:text-zinc-300'}`}
              >
                <div class="flex items-center gap-2 truncate">
                  {#if !away.isTba}
                    <span class="font-mono text-xs text-zinc-500 shrink-0">{away.id}</span>
                  {/if}
                  <span class="text-sm truncate">{finalMatch.awayTeam ? away.name : finalMatch.placeholderAway}</span>
                </div>
                {#if finalMatch.winner === finalMatch.awayTeam}
                  <Check size={14} class="text-amber-600 dark:text-amber-400 shrink-0" />
                {/if}
              </button>
            </div>
          </div>
        </div>
      {/if}

      <!-- Champion Display Panel -->
      {#if calcState.knockoutBracket.matchesMap['M104']}
        {@const finalM = calcState.knockoutBracket.matchesMap['M104']}
        <div class="bg-white dark:bg-zinc-950/80 border border-amber-900/10 dark:border-amber-900/30 rounded-xl p-4 flex flex-col items-center justify-center text-center space-y-2 py-6 bg-gradient-to-b from-white dark:from-black to-slate-50 dark:to-zinc-900 shadow-lg">
          <Trophy class={`h-12 w-12 ${finalM?.winner ? 'text-amber-600 dark:text-amber-400 animate-bounce' : 'text-zinc-300 dark:text-zinc-700'}`} />
          <div class="text-[10px] text-zinc-500 uppercase tracking-widest font-semibold">{t('champion')}</div>
          <div class="text-lg font-bold text-amber-600 dark:text-amber-400 min-h-[28px]">
            {#if finalM?.winner}
              {t(`teams.${finalM.winner}`)}
            {:else}
              <span class="text-zinc-400 dark:text-zinc-600 text-xs italic font-normal">{t('tbd')}</span>
            {/if}
          </div>
        </div>
      {/if}

      <!-- Third Place Playoff (M103) -->
      {#if calcState.knockoutBracket.matchesMap['M103']}
        {@const thirdMatch = calcState.knockoutBracket.matchesMap['M103']}
        {@const home = getDisplayInfo(thirdMatch.homeTeam, thirdMatch.placeholderHome)}
        {@const away = getDisplayInfo(thirdMatch.awayTeam, thirdMatch.placeholderAway)}
        
        <div class="space-y-2">
          <div class="text-[10px] text-center font-semibold text-zinc-500 uppercase tracking-wider">{t('third_place_playoff')}</div>
          <div class="bg-white/95 dark:bg-zinc-950/80 border border-slate-200 dark:border-zinc-800/80 rounded-lg p-2.5 shadow-lg space-y-1.5 relative">
            <div class="text-[8px] font-mono text-zinc-400 dark:text-zinc-500 absolute top-1 right-1.5">
              {thirdMatch.id}
            </div>

            <div class="space-y-1">
              <button
                onclick={() => handleTeamClick(thirdMatch.id, thirdMatch.homeTeam)}
                disabled={home.isTba}
                class={`w-full flex items-center justify-between px-2 py-1 rounded transition-all text-left ${
                  home.isTba ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:bg-slate-100 dark:hover:bg-zinc-800/50'
                } ${thirdMatch.winner === thirdMatch.homeTeam ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 font-semibold' : 'text-slate-700 dark:text-zinc-300'}`}
              >
                <div class="flex items-center gap-1.5 truncate">
                  {#if !home.isTba}
                    <span class="font-mono text-xs text-zinc-500 shrink-0">{home.id}</span>
                  {/if}
                  <span class="text-xs truncate">{thirdMatch.homeTeam ? home.name : thirdMatch.placeholderHome}</span>
                </div>
                {#if thirdMatch.winner === thirdMatch.homeTeam}
                  <Check size={12} class="text-amber-600 dark:text-amber-400 shrink-0" />
                {/if}
              </button>

              <button
                onclick={() => handleTeamClick(thirdMatch.id, thirdMatch.awayTeam)}
                disabled={away.isTba}
                class={`w-full flex items-center justify-between px-2 py-1 rounded transition-all text-left ${
                  away.isTba ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:bg-slate-100 dark:hover:bg-zinc-800/50'
                } ${thirdMatch.winner === thirdMatch.awayTeam ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 font-semibold' : 'text-slate-700 dark:text-zinc-300'}`}
              >
                <div class="flex items-center gap-1.5 truncate">
                  {#if !away.isTba}
                    <span class="font-mono text-xs text-zinc-500 shrink-0">{away.id}</span>
                  {/if}
                  <span class="text-xs truncate">{thirdMatch.awayTeam ? away.name : thirdMatch.placeholderAway}</span>
                </div>
                {#if thirdMatch.winner === thirdMatch.awayTeam}
                  <Check size={12} class="text-amber-600 dark:text-amber-400 shrink-0" />
                {/if}
              </button>
            </div>
          </div>
        </div>
      {/if}
      
    </div>

  </div>
</div>
