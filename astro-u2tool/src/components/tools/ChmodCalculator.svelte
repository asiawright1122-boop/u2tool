<script lang="ts">
  import { onDestroy } from 'svelte';

  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.${key}`;
  }

  let perms = $state({ owner: { r: true, w: true, x: false }, group: { r: true, w: false, x: false }, other: { r: true, w: false, x: false } });

  let octal = $state('644');

  let copied = $state(false);

  let timerRef = $state(null);  onDestroy(() => {
    if (timerRef) clearTimeout(timerRef);
  });

  // Functions
  function calcOctal(p: typeof perms) {
    const calc = (o: { r: boolean; w: boolean; x: boolean }) => (o.r ? 4 : 0) + (o.w ? 2 : 0) + (o.x ? 1 : 0);
    return `${calc(p.owner)}${calc(p.group)}${calc(p.other)}`;
  }
  function calcSymbolic(p: typeof perms) {
    const sym = (o: { r: boolean; w: boolean; x: boolean }) => `${o.r ? 'r' : '-'}${o.w ? 'w' : '-'}${o.x ? 'x' : '-'}`;
    return `-${sym(p.owner)}${sym(p.group)}${sym(p.other)}`;
  }
  function toggle(who: 'owner' | 'group' | 'other', perm: 'r' | 'w' | 'x') {
    const newPerms = { ...perms, [who]: { ...perms[who], [perm]: !perms[who][perm] } };
    perms = newPerms;
    octal = calcOctal(newPerms);
  }
  function handleOctal(val: string) {
    octal = val;
    if (/^[0-7]{3}$/.test(val)) {
      const parse = (n: string) => ({ r: (parseInt(n) & 4) > 0, w: (parseInt(n) & 2) > 0, x: (parseInt(n) & 1) > 0 });
      perms = { owner: parse(val[0]), group: parse(val[1]), other: parse(val[2]) };
    }
  }
  async function copy(text: string) {
    await navigator.clipboard.writeText(text);
    copied = true;
    if (timerRef) clearTimeout(timerRef);
    timerRef = setTimeout(() => copied = false, 2000);
  }

</script>

{#snippet Checkbox(who, perm, label)}
<label class="flex items-center gap-2 cursor-pointer">
      <input type="checkbox" checked={perms[who][perm]} onchange={() => toggle(who, perm)} class="w-5 h-5 rounded" />
      <span>{label}</span>
    </label>
{/snippet}


    <div class="space-y-6">
      <div class="flex items-center gap-4">
        <label class="text-sm font-medium text-gray-900 dark:text-white">{t('chmod.octal')}:</label>
        <input type="text" value={octal} onchange={(e) => handleOctal(e.target.value)} maxLength={3} class="w-24 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded font-mono text-xl text-center text-gray-900 dark:text-white" />
        <button onclick={() => copy(`chmod ${octal}`)} class="px-3 py-2 bg-gray-200 dark:bg-gray-600 text-gray-900 dark:text-white rounded hover:bg-gray-300 dark:hover:bg-gray-700">{copied ? '✓' : t('copy')}</button>
      </div>
      <div class="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
        <p class="text-sm text-gray-600 dark:text-gray-300 mb-2">{t('chmod.symbolic')}:</p>
        <p class="font-mono text-xl text-gray-900 dark:text-white">{calcSymbolic(perms)}</p>
      </div>
      <div class="grid md:grid-cols-3 gap-4">
        {#each (['owner', 'group', 'other'] as const) as who (who)}
<div  class="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
            <h3 class="font-medium mb-3 capitalize text-gray-900 dark:text-white">{t(`chmod.${who}`)}</h3>
            <div class="space-y-2 text-gray-900 dark:text-white">
              {@render Checkbox(who, "r", t('chmod.read'))}
              {@render Checkbox(who, "w", t('chmod.write'))}
              {@render Checkbox(who, "x", t('chmod.execute'))}
            </div>
          </div>
{/each}
      </div>
      <div class="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
        <p class="text-sm text-gray-600 dark:text-gray-300 mb-2">{t('chmod.command')}:</p>
        <code class="font-mono text-gray-900 dark:text-white">chmod {octal} filename</code>
      </div>
    </div>
  
