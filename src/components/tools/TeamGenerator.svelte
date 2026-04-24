<script lang="ts">
  import { generateTeams as buildTeams, type Team } from '@/lib/popular-tools-batch3-remaining';

  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['team-generator'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.team-generator.${key}`;
  }
  function tc(key: string): string {
    const scope = translations['tools'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.${key}`;
  }

  let input = $state('');

  let teamCount = $state('2');

  let teamNames = $state('');

  let teams = $state([]);

  // Functions
  function generateTeams() {
    teams = buildTeams(
      input.split('\n'),
      parseInt(teamCount) || 2,
      teamNames.split(','),
      t('team')
    );
  }
  function shuffleTeams() {
    if (teams.length === 0) return;
    
    const allMembers = teams.flatMap(t => t.members);
    teams = buildTeams(
      allMembers,
      teams.length,
      teams.map((team) => team.name),
      t('team')
    );
  }
  async function copyTeams() {
    const text = teams
      .map(team => `${team.name}:\n${team.members.map(m => `  - ${m}`).join('\n')}`)
      .join('\n\n');
    await navigator.clipboard.writeText(text);
  }

</script>


    <div class="space-y-6">
      <!-- Input -->
      <div>
        <label class="tool-label">
          {t('enterMembers')}
        </label>
        <textarea
          bind:value={input}
          placeholder={t('membersPlaceholder')}
          rows={6}
          class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"></textarea>
      </div>

      <!-- Settings -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label class="tool-label">
            {t('numberOfTeams')}
          </label>
          <input
            type="number"
            bind:value={teamCount}
            min="2"
            max="20"
            class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
          />
        </div>
        <div>
          <label class="tool-label">
            {t('teamNames')} ({t('optional')})
          </label>
          <input
            type="text"
            bind:value={teamNames}
            placeholder={t('teamNamesPlaceholder')}
            class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
          />
        </div>
      </div>

      <!-- Buttons -->
      <div class="flex gap-3">
        <button
          onclick={generateTeams}
          disabled={!input.trim()}
          class="flex-1 py-3 btn-success rounded-lg font-medium hover:bg-green-700 disabled:opacity-50"
        >
          {tc('generate')}
        </button>
        {#if teams.length > 0}
<div>

            <button
              onclick={shuffleTeams}
              class="px-6 py-3 bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="inline"><path d="m21 16-4 4-4-4"/><path d="M17 20V4"/><path d="m3 8 4-4 4 4"/><path d="M7 4v16"/></svg> {t('shuffle')}
            </button>
            <button
              onclick={copyTeams}
              class="px-6 py-3 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700"
            >
              {tc('copy')}
            </button>
          
</div>
{/if}
      </div>

      <!-- Teams Display -->
      {#if teams.length > 0}
<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {#each teams as team, idx (idx)}
<div 
              class="bg-gray-50 dark:bg-gray-800 rounded-xl p-4"
            >
              <h3 class="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <span class="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center text-sm">
                  {team.members.length}
                </span>
                {team.name}
              </h3>
              <ul class="space-y-2">
                {#each team.members as member, mIdx (mIdx)}
<li 
                    class="px-3 py-2 bg-white dark:bg-gray-700 rounded-lg text-gray-700 dark:text-gray-300"
                  >
                    {member}
                  </li>
{/each}
              </ul>
            </div>
{/each}
        </div>
{/if}
    </div>
  
