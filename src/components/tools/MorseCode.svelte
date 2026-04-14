<script lang="ts">
  import { MORSE_CODE, REVERSE_MORSE } from '@/lib/tool-stubs';

  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['morseCode'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.morseCode.${key}`;
  }

  let text = $state('');

  let morse = $state('');

  // Functions
  function textToMorse() {
    if (!text.trim()) {
      morse = '';
      return;
    }
    
    const result = text
      .toUpperCase()
      .split('')
      .map(char => MORSE_CODE[char] || char)
      .join(' ');
    morse = result;
  }
  function morseToText() {
    if (!morse.trim()) {
      text = '';
      return;
    }
    
    const result = morse
      .split(' ')
      .map(code => {
        if (code === '/') return ' ';
        return REVERSE_MORSE[code] || code;
      })
      .join('');
    text = result;
  }
  function playMorse() {
    if (!morse.trim()) return;
    
    const audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    const dotDuration = 0.1;
    const dashDuration = 0.3;
    const pauseDuration = 0.1;
    const letterPause = 0.3;
    const wordPause = 0.7;
    
    let time = audioContext.currentTime;
    
    for (const char of morse) {
      if (char === '.') {
        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();
        osc.connect(gain);
        gain.connect(audioContext.destination);
        osc.frequency.value = 600;
        gain.gain.value = 0.5;
        osc.start(time);
        osc.stop(time + dotDuration);
        time += dotDuration + pauseDuration;
      } else if (char === '-') {
        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();
        osc.connect(gain);
        gain.connect(audioContext.destination);
        osc.frequency.value = 600;
        gain.gain.value = 0.5;
        osc.start(time);
        osc.stop(time + dashDuration);
        time += dashDuration + pauseDuration;
      } else if (char === ' ') {
        time += letterPause;
      } else if (char === '/') {
        time += wordPause;
      }
    }
  }
  function copyMorse() {
    navigator.clipboard.writeText(morse);
  }
  function copyText() {
    navigator.clipboard.writeText(text);
  }

</script>


    <div class="space-y-4">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <div class="flex justify-between items-center mb-2">
            <label class="text-sm text-gray-600 dark:text-gray-300">{t('text')}</label>
            <div class="flex gap-2">
              <button
                onclick={copyText}
                disabled={!text}
                class="px-3 py-1 text-sm bg-gray-200 dark:bg-gray-600 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-700 disabled:opacity-50 rounded transition-colors"
              >
                {t('copy')}
              </button>
              <button
                onclick={textToMorse}
                class="px-3 py-1 text-sm bg-amber-600 hover:bg-amber-700 rounded transition-colors"
              >
                {t('toMorse')} →
              </button>
            </div>
          </div>
          <textarea
            bind:value={text}
            class="w-full h-48 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-4 py-3 text-gray-900 dark:text-white font-mono focus:ring-2 focus:ring-amber-500 focus:outline-none resize-none"
            placeholder={t('textPlaceholder')}></textarea>
        </div>

        <div>
          <div class="flex justify-between items-center mb-2">
            <label class="text-sm text-gray-600 dark:text-gray-300">{t('morse')}</label>
            <div class="flex gap-2">
              <button
                onclick={morseToText}
                class="px-3 py-1 text-sm bg-emerald-500 hover:bg-green-700 rounded transition-colors"
              >
                ← {t('toText')}
              </button>
              <button
                onclick={copyMorse}
                disabled={!morse}
                class="px-3 py-1 text-sm bg-gray-200 dark:bg-gray-600 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-700 disabled:opacity-50 rounded transition-colors"
              >
                {t('copy')}
              </button>
              <button
                onclick={playMorse}
                disabled={!morse}
                class="px-3 py-1 text-sm bg-orange-600 hover:bg-orange-700 disabled:opacity-50 rounded transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg> {t('play')}
              </button>
            </div>
          </div>
          <textarea
            bind:value={morse}
            class="w-full h-48 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-4 py-3 text-gray-900 dark:text-white font-mono focus:ring-2 focus:ring-amber-500 focus:outline-none resize-none"
            placeholder={t('morsePlaceholder')}></textarea>
        </div>
      </div>

      <div class="bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
        <h3 class="text-sm text-gray-700 dark:text-gray-300 mb-2">{t('reference')}</h3>
        <div class="grid grid-cols-6 sm:grid-cols-9 md:grid-cols-12 gap-2 text-xs font-mono">
          {#each Object.entries(MORSE_CODE).slice(0, 36) as [char, code] (char)}
<div  class="text-center">
              <div class="text-gray-900 dark:text-white">{char === ' ' ? '␣' : char}</div>
              <div class="text-gray-600 dark:text-gray-300">{code}</div>
            </div>
{/each}
        </div>
      </div>
    </div>
  
