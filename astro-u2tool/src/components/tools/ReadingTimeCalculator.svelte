<script lang="ts">
  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['reading-time-calculator'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.reading-time-calculator.${key}`;
  }

  let text = $state('');

  let wordsPerMinute = $state(200);

  let stats = $state({
    words: 0,
    characters: 0,
    sentences: 0,
    paragraphs: 0,
    readingTime: 0,
    speakingTime: 0,
  });

  $effect(() => {
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const characters = text.length;
    const sentences = text.split(/[.!?]+/).filter(s => s.trim()).length;
    const paragraphs = text.split(/\n\n+/).filter(p => p.trim()).length;
    const readingTime = Math.ceil(words / wordsPerMinute);
    const speakingTime = Math.ceil(words / 150); // Average speaking rate

    stats = {
      words,
      characters,
      sentences,
      paragraphs,
      readingTime,
      speakingTime,
    };
  });

  // Functions
  function formatTime(minutes: number): string {
    if (minutes < 1) return t('lessThanMinute');
    if (minutes === 1) return t('minute');
    if (minutes < 60) return t('minutes', { n: minutes });
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (mins === 0) return t('hours', { n: hours });
    return `${t('hour', { n: hours })} ${t('minutes', { n: mins })}`;
  }

</script>


    <div class="space-y-6">
      <div>
        <label class="block text-sm text-gray-600 dark:text-gray-300 mb-2">{t('pasteText')}</label>
        <textarea
          bind:value={text}
          class="w-full h-64 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500"
          placeholder={t('placeholder')}></textarea>
      </div>

      <div class="flex items-center gap-4">
        <label class="text-sm text-gray-600 dark:text-gray-300">{t('readingSpeed')}</label>
        <input
          type="range"
          min="100"
          max="400"
          value={wordsPerMinute}
          onchange={(e) => wordsPerMinute = parseInt(e.target.value)}
          class="flex-1 max-w-xs"
        />
        <span class="text-sm font-mono w-24 text-gray-900 dark:text-white">{wordsPerMinute} {t('wpm')}</span>
      </div>

      <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div class="p-4 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-center">
          <div class="text-3xl font-bold text-blue-600 dark:text-blue-400">{stats.words}</div>
          <div class="text-sm text-gray-600 dark:text-gray-300 mt-1">{t('words')}</div>
        </div>
        <div class="p-4 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-center">
          <div class="text-3xl font-bold text-green-600 dark:text-green-400">{stats.characters}</div>
          <div class="text-sm text-gray-600 dark:text-gray-300 mt-1">{t('characters')}</div>
        </div>
        <div class="p-4 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-center">
          <div class="text-3xl font-bold text-purple-600 dark:text-purple-400">{stats.sentences}</div>
          <div class="text-sm text-gray-600 dark:text-gray-300 mt-1">{t('sentences')}</div>
        </div>
        <div class="p-4 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-center">
          <div class="text-3xl font-bold text-yellow-600 dark:text-yellow-400">{stats.paragraphs}</div>
          <div class="text-sm text-gray-600 dark:text-gray-300 mt-1">{t('paragraphs')}</div>
        </div>
        <div class="p-4 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-lg text-center">
          <div class="text-3xl font-bold text-blue-600 dark:text-blue-400">{formatTime(stats.readingTime)}</div>
          <div class="text-sm text-gray-600 dark:text-gray-300 mt-1">{t('readingTime')}</div>
        </div>
        <div class="p-4 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 rounded-lg text-center">
          <div class="text-3xl font-bold text-green-600 dark:text-green-400">{formatTime(stats.speakingTime)}</div>
          <div class="text-sm text-gray-600 dark:text-gray-300 mt-1">{t('speakingTime')}</div>
        </div>
      </div>

      <div class="p-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg">
        <h4 class="font-semibold mb-3 text-gray-900 dark:text-white">{t('reference')}</h4>
        <div class="grid md:grid-cols-3 gap-4 text-sm">
          <div>
            <span class="text-blue-600 dark:text-blue-400">{t('slow')}</span>
            <span class="text-gray-600 dark:text-gray-300 ml-2">100-150 {t('wpm')}</span>
          </div>
          <div>
            <span class="text-green-600 dark:text-green-400">{t('average')}</span>
            <span class="text-gray-600 dark:text-gray-300 ml-2">200-250 {t('wpm')}</span>
          </div>
          <div>
            <span class="text-purple-600 dark:text-purple-400">{t('fast')}</span>
            <span class="text-gray-600 dark:text-gray-300 ml-2">300-400 {t('wpm')}</span>
          </div>
        </div>
      </div>

      <div class="p-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-600 dark:text-gray-300">
        <p>{t('tip')}</p>
      </div>
    </div>
  
