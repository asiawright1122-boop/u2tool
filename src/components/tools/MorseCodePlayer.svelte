<script lang="ts">
  import { onDestroy } from 'svelte';

  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['morse-code-player'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.morse-code-player.${key}`;
  }
  function tc(key: string): string {
    const scope = translations['tools'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.${key}`;
  }

  // Imports
  import { textToMorse, morseToText } from '@/lib/calculator-utils';

  let inputText = $state('HELLO WORLD');

  let morseCode = $state('');

  let mode = $state('encode');

  let isPlaying = $state(false);

  let speed = $state(1);

  let frequency = $state(600);

  let audioContextRef = $state(null);

  let copied = $state(false);

  let timerRef = $state(null);

  function convert() {
    if (mode === 'encode') {
      const morse = textToMorse(inputText);
      morseCode = morse;
    } else {
      const text = morseToText(inputText);
      morseCode = text;
    }
  }  onDestroy(() => {
    if (timerRef) clearTimeout(timerRef);
  });

  // Functions
  async function playMorse() {
    if (isPlaying) return;

    const morse = mode === 'encode' ? textToMorse(inputText) : inputText;
    if (!morse) return;

    isPlaying = true;

    if (!audioContextRef) {
      audioContextRef = new AudioContext();
    }

    const ctx = audioContextRef;
    const dotDuration = 100 / speed;
    const dashDuration = dotDuration * 3;
    const pauseDuration = dotDuration;
    const letterPause = dotDuration * 3;
    const wordPause = dotDuration * 7;

    let currentTime = ctx.currentTime;

    for (const char of morse) {
      if (char === '.') {
        playTone(ctx, currentTime, dotDuration / 1000, frequency);
        currentTime += dotDuration / 1000 + pauseDuration / 1000;
      } else if (char === '-') {
        playTone(ctx, currentTime, dashDuration / 1000, frequency);
        currentTime += dashDuration / 1000 + pauseDuration / 1000;
      } else if (char === ' ') {
        currentTime += letterPause / 1000;
      } else if (char === '/') {
        currentTime += wordPause / 1000;
      }
    }

    setTimeout(() => {
      isPlaying = false;
    }, (currentTime - ctx.currentTime) * 1000);
  }
  function playTone(ctx: AudioContext, startTime: number, duration: number, freq: number) {
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.frequency.value = freq;
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0, startTime);
    gainNode.gain.linearRampToValueAtTime(0.5, startTime + 0.01);
    gainNode.gain.linearRampToValueAtTime(0, startTime + duration);

    oscillator.start(startTime);
    oscillator.stop(startTime + duration);
  }
  function copyToClipboard() {
    navigator.clipboard.writeText(morseCode);
    copied = true;
    if (timerRef) clearTimeout(timerRef);
    timerRef = setTimeout(() => copied = false, 2000);
  }

</script>


    <div class="space-y-6">
      <div class="flex gap-2">
        <button
          onclick={() => mode = 'encode'}
          class={`flex-1 px-4 py-2 rounded-lg transition-colors ${
            mode === 'encode'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
          }`}
        >
          {t('textToMorse')}
        </button>
        <button
          onclick={() => mode = 'decode'}
          class={`flex-1 px-4 py-2 rounded-lg transition-colors ${
            mode === 'decode'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
          }`}
        >
          {t('morseToText')}
        </button>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {mode === 'encode' ? t('inputText') : t('inputMorse')}
        </label>
        <textarea
          value={inputText}
          onchange={(e) => inputText = e.target.value.toUpperCase()}
          class="w-full h-24 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono resize-none"
          placeholder={mode === 'encode' ? 'HELLO WORLD' : '.... . .-.. .-.. ---'}
        />
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('speed')}: {speed}x
          </label>
          <input
            type="range"
            min="0.5"
            max="3"
            step="0.5"
            value={speed}
            onchange={(e) => speed = parseFloat(e.target.value)}
            class="w-full"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('frequency')}: {frequency}Hz
          </label>
          <input
            type="range"
            min="400"
            max="1000"
            step="50"
            value={frequency}
            onchange={(e) => frequency = parseInt(e.target.value)}
            class="w-full"
          />
        </div>
      </div>

      <div class="flex gap-2">
        <button
          onclick={convert}
          class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          {tc('convert')}
        </button>
        <button
          onclick={playMorse}
          disabled={isPlaying}
          class={`flex-1 px-4 py-2 rounded-lg transition-colors ${
            isPlaying
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-green-600 text-white hover:bg-green-700'
          }`}
        >
          {isPlaying ? t('playing') : t('play')} <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>
        </button>
      </div>

      {#if morseCode}
(
        <div class="space-y-4">
          <div>
            <div class="flex justify-between items-center mb-1">
              <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
                {mode === 'encode' ? t('morseOutput') : t('textOutput')}
              </label>
              <button
                onclick={copyToClipboard}
                class="text-sm text-blue-600 hover:text-blue-700"
              >
                {copied ? tc('copied') : tc('copy')}
              </button>
            </div>
            <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg font-mono text-lg break-all">
              {morseCode}
            </div>
          </div>

          {#if mode === 'encode'}
<div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div class="text-sm text-gray-600 dark:text-gray-400 mb-2">{t('visualization')}</div>
              <div class="flex flex-wrap gap-1">
                {#each morseCode.split('') as char, index (index)}
<span 
                    class={`inline-flex items-center justify-center ${
                      char === '.'
                        ? 'w-3 h-3 bg-blue-500 rounded-full'
                        : char === '-'
                        ? 'w-8 h-3 bg-blue-500 rounded'
                        : char === ' '
                        ? 'w-2'
                        : char === '/'
                        ? 'w-4'
                        : ''
                    }`}></span>
{/each}
              </div>
            </div>
{/if}

          <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div class="text-sm text-gray-600 dark:text-gray-400 mb-2">{t('legend')}</div>
            <div class="grid grid-cols-2 gap-2 text-sm">
              <div class="flex items-center gap-2">
                <span class="w-3 h-3 bg-blue-500 rounded-full"></span>
                <span>{t('dot')} (.)</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="w-8 h-3 bg-blue-500 rounded"></span>
                <span>{t('dash')} (-)</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="w-2 h-3 bg-gray-300 dark:bg-gray-600"></span>
                <span>{t('letterSpace')}</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="w-4 h-3 bg-gray-300 dark:bg-gray-600"></span>
                <span>{t('wordSpace')} (/)</span>
              </div>
            </div>
          </div>
        </div>
      )
{/if}
    </div>
  
