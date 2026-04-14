<script lang="ts">
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

  let epoch = $state('');

  let date = $state('');

  let currentEpoch = $state(0);

  let copied = $state(false);

  $effect(() => {
    const timer = setInterval(() => currentEpoch = Math.floor(Date.now() / 1000), 1000);
    return () => clearInterval(timer);
  });

  // Functions
  function epochToDate() {
    const ts = parseInt(epoch);
    if (isNaN(ts)) return;
    const d = new Date(ts > 9999999999 ? ts : ts * 1000);
    date = d.toISOString().slice(0, 19).replace('T', ' ');
  }
  function dateToEpoch() {
    const d = new Date(date);
    if (isNaN(d.getTime())) return;
    epoch = Math.floor(d.getTime() / 1000).toString();
  }
  function useNow() {
    const now = new Date();
    epoch = Math.floor(now.getTime() / 1000).toString();
    date = now.toISOString().slice(0, 19).replace('T', ' ');
  }
  async function copy(text: string) {
    await navigator.clipboard.writeText(text);
    copied = true;
    setTimeout(() => copied = false, 2000);
  }

</script>


    <div class="space-y-6">
      <div class="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 text-center">
        <p class="text-sm text-gray-600 dark:text-gray-300 mb-1">{t('epoch.current')}</p>
        <p class="text-3xl font-mono text-amber-600 dark:text-amber-400 cursor-pointer" onclick={() => copy(currentEpoch.toString())}>{currentEpoch}</p>
      </div>
      <div class="grid md:grid-cols-2 gap-6">
        <div class="space-y-3">
          <label for="epoch-timestamp" class="block text-sm font-medium text-gray-900 dark:text-white">{t('epoch.timestamp')}</label>
          <input type="text" id="epoch-timestamp" name="epochValue" bind:value={epoch} class="w-full p-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg font-mono text-gray-900 dark:text-white" placeholder="1702400000" />
          <button onclick={epochToDate} class="w-full px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700">{t('epoch.toDate')}</button>
        </div>
        <div class="space-y-3">
          <label for="epoch-datetime" class="block text-sm font-medium text-gray-900 dark:text-white">{t('epoch.datetime')}</label>
          <input type="text" id="epoch-datetime" name="datetimeValue" bind:value={date} class="w-full p-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg font-mono text-gray-900 dark:text-white" placeholder="2024-12-12 12:00:00" />
          <button onclick={dateToEpoch} class="w-full px-4 py-2 btn-success rounded hover:bg-green-700">{t('epoch.toEpoch')}</button>
        </div>
      </div>
      <div class="flex gap-2">
        <button onclick={useNow} class="px-4 py-2 bg-gray-500 dark:bg-gray-600 text-white rounded hover:bg-gray-600 dark:hover:bg-gray-700">{t('epoch.useNow')}</button>
        <button onclick={() => copy(epoch || date)} class="px-4 py-2 bg-gray-500 dark:bg-gray-600 text-white rounded hover:bg-gray-600 dark:hover:bg-gray-700">{copied ? t('copied') : t('copy')}</button>
      </div>
    </div>
  
