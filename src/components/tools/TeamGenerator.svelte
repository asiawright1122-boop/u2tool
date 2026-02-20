<script lang="ts">
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

  // Types
  interface Team {
  name: string;
  members: string[];
}

  let input = $state('');

  let teamCount = $state('2');

  let teamNames = $state('');

  let teams = $state([]);

  // Functions
  function generateTeams() {
    const members = input
      .split('\n')
      .map(m => m.trim())
      .filter(m => m.length > 0);

    if (members.length === 0) return;

    const count = parseInt(teamCount) || 2;
    const names = teamNames
      .split(',')
      .map(n => n.trim())
      .filter(n => n.length > 0);

    // Shuffle members
    const shuffled = [...members].sort(() => Math.random() - 0.5);

    // Distribute to teams
    const result: Team[] = [];
    for (let i = 0; i < count; i++) {
      result.push({
        name: names[i] || `${t('team')} ${i + 1}`,
        members: [],
      });
    }

    shuffled.forEach((member, idx) => {
      result[idx % count].members.push(member);
    });

    teams = result;
  }
  function shuffleTeams() {
    if (teams.length === 0) return;
    
    const allMembers = teams.flatMap(t => t.members);
    const shuffled = [...allMembers].sort(() => Math.random() - 0.5);
    
    const result = teams.map((team, idx) => ({
      ...team,
      members: [] as string[],
    }));

    shuffled.forEach((member, idx) => {
      result[idx % result.length].members.push(member);
    });

    teams = result;
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
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
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
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
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
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
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
          class="flex-1 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50"
        >
          {tc('generate')}
        </button>
        {#if teams.length > 0}
<div>

            <button
              onclick={shuffleTeams}
              class="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
            >
              🔀 {t('shuffle')}
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
  
