<script lang="ts">
  import { Check, Copy, ExternalLink, RefreshCw } from 'lucide-svelte';
  import { onDestroy } from 'svelte';

  interface Props {
    locale?: string;
    translations?: Record<string, unknown>;
  }

  let { locale = 'en', translations = {} }: Props = $props();

  const COPY = {
    title: 'YouTube Thumbnail Generator',
    subtitle: 'Paste a YouTube URL or 11-character video ID to preview public thumbnail variants.',
    video: 'YouTube video URL or ID',
    videoId: 'Video ID',
    variants: 'Thumbnail variants',
    maxResolution: 'Max resolution',
    highQuality: 'High quality',
    mediumQuality: 'Medium quality',
    defaultQuality: 'Default quality',
    copyUrl: 'Copy URL',
    copied: 'Copied',
    open: 'Open',
    reset: 'Reset',
    invalid: 'Enter a valid YouTube video URL or video ID.',
    localNote: 'This tool generates public YouTube thumbnail URLs. It does not proxy or upload images.',
  };

  let video = $state('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
  let copiedUrl = $state('');
  let copyTimer: ReturnType<typeof setTimeout> | null = null;

  const videoId = $derived(extractYouTubeId(video));
  const variants = $derived(videoId ? [
    { label: COPY.maxResolution, file: 'maxresdefault.jpg', url: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` },
    { label: COPY.highQuality, file: 'hqdefault.jpg', url: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` },
    { label: COPY.mediumQuality, file: 'mqdefault.jpg', url: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg` },
    { label: COPY.defaultQuality, file: 'default.jpg', url: `https://img.youtube.com/vi/${videoId}/default.jpg` },
  ] : []);

  onDestroy(() => {
    if (copyTimer) {
      clearTimeout(copyTimer);
    }
  });

  function extractYouTubeId(value: string) {
    const trimmed = value.trim();
    if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
      return trimmed;
    }

    const patterns = [
      /youtube\.com\/watch\?[^#]*v=([a-zA-Z0-9_-]{11})/,
      /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
      /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
      /youtu\.be\/([a-zA-Z0-9_-]{11})/,
    ];

    for (const pattern of patterns) {
      const match = trimmed.match(pattern);
      if (match?.[1]) {
        return match[1];
      }
    }

    return '';
  }

  async function copyThumbnailUrl(url: string) {
    await navigator.clipboard.writeText(url);
    copiedUrl = url;
    if (copyTimer) {
      clearTimeout(copyTimer);
    }
    copyTimer = setTimeout(() => {
      copiedUrl = '';
    }, 1800);
  }

  function resetForm() {
    video = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
  }
</script>

<div class="space-y-6">
  <div>
    <h2 class="text-xl font-bold text-slate-900 dark:text-white">{COPY.title}</h2>
    <p class="mt-2 text-sm text-slate-600 dark:text-slate-400">{COPY.subtitle}</p>
  </div>

  <div>
    <label for="youtube-thumbnail-video" class="tool-label">{COPY.video}</label>
    <input
      id="youtube-thumbnail-video"
      class="tool-input"
      type="text"
      bind:value={video}
      placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
    />
  </div>

  <div class="flex flex-wrap items-center gap-3">
    <div class="rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200">
      <span class="font-semibold">{COPY.videoId}:</span>
      <span class={videoId ? 'font-mono' : 'text-red-600 dark:text-red-300'}>{videoId || COPY.invalid}</span>
    </div>
    <button type="button" class="btn-secondary inline-flex items-center gap-2" onclick={resetForm}>
      <RefreshCw class="h-4 w-4" aria-hidden="true" />
      {COPY.reset}
    </button>
  </div>

  {#if variants.length}
    <div>
      <h3 class="mb-4 text-base font-bold text-slate-900 dark:text-white">{COPY.variants}</h3>
      <div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {#each variants as variant (variant.file)}
          <article class="overflow-hidden rounded-lg border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-950">
            <img
              src={variant.url}
              alt={`${variant.label} YouTube thumbnail preview`}
              class="aspect-video w-full bg-slate-100 object-cover dark:bg-slate-900"
              loading="lazy"
            />
            <div class="space-y-3 p-4">
              <div class="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h4 class="text-sm font-bold text-slate-900 dark:text-white">{variant.label}</h4>
                  <p class="mt-1 text-xs font-mono text-slate-500 dark:text-slate-400">{variant.file}</p>
                </div>
                <a
                  class="btn-secondary inline-flex items-center gap-2 !px-3 !py-2 !text-xs"
                  href={variant.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  <ExternalLink class="h-4 w-4" aria-hidden="true" />
                  {COPY.open}
                </a>
              </div>
              <div class="flex items-center gap-2">
                <code class="min-w-0 flex-1 truncate rounded-md bg-slate-100 px-3 py-2 text-xs text-slate-700 dark:bg-slate-900 dark:text-slate-200">{variant.url}</code>
                <button
                  type="button"
                  class="btn-primary inline-flex items-center gap-2 !px-3 !py-2 !text-xs"
                  onclick={() => copyThumbnailUrl(variant.url)}
                >
                  {#if copiedUrl === variant.url}
                    <Check class="h-4 w-4" aria-hidden="true" />
                    {COPY.copied}
                  {:else}
                    <Copy class="h-4 w-4" aria-hidden="true" />
                    {COPY.copyUrl}
                  {/if}
                </button>
              </div>
            </div>
          </article>
        {/each}
      </div>
      <p class="mt-4 text-xs font-medium text-slate-500 dark:text-slate-400">{COPY.localNote}</p>
    </div>
  {:else}
    <div class="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-200">
      {COPY.invalid}
    </div>
  {/if}
</div>
