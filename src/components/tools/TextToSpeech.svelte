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

  let text = $state('');

  let rate = $state(1);

  let pitch = $state(1);

  let voice = $state(0);

  let voices = $state([]);

  let speaking = $state(false);

  $effect(() => {
    const loadVoices = () => {
      const v = speechSynthesis.getVoices();
      if (v.length > 0) voices = v;
    };
    loadVoices();
    speechSynthesis.onvoiceschanged = loadVoices;
  });

  // Functions
  function speak() {
    if (!text) return;
    speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = rate;
    utterance.pitch = pitch;
    if (voices[voice]) utterance.voice = voices[voice];
    utterance.onstart = () => speaking = true;
    utterance.onend = () => speaking = false;
    speechSynthesis.speak(utterance);
  }
  function stop() {
    speechSynthesis.cancel();
    speaking = false;
  }

</script>


    <div class="space-y-4">
      <textarea bind:value={text} class="w-full h-40 p-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white" placeholder={t('tts.placeholder')}></textarea>
      <div class="grid md:grid-cols-3 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-white mb-2">{t('tts.voice')}</label>
          <select bind:value={voice} class="w-full p-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white">
            {#each voices as v, i (i)}
<option  value={i}>{v.name} ({v.lang})</option>
{/each}
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-white mb-2">{t('tts.rate')}: {rate}</label>
          <input type="range" min="0.5" max="2" step="0.1" bind:value={rate} class="w-full" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-white mb-2">{t('tts.pitch')}: {pitch}</label>
          <input type="range" min="0.5" max="2" step="0.1" bind:value={pitch} class="w-full" />
        </div>
      </div>
      <div class="flex gap-2">
        <button onclick={speak} disabled={speaking || !text} class="px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700 disabled:opacity-50">{t('tts.speak')}</button>
        <button onclick={stop} disabled={!speaking} class="px-4 py-2 bg-rose-500 text-white rounded hover:bg-red-700 disabled:opacity-50">{t('tts.stop')}</button>
      </div>
    </div>
  
