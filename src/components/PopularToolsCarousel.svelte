<script lang="ts">
  /**
   * PopularToolsCarousel.svelte
   *
   * Auto-rotating carousel of popular tools with pagination.
   * Matches the original Next.js PopularToolsCarousel design.
   */

  import { getIconSvg } from '@/lib/icon-svg';

  interface ToolItem {
    slug: string;
    icon: string;
    category: string;
    name: string;
    description: string;
    categoryName: string;
  }

  interface Props {
    tools: ToolItem[];
    displayCount?: number;
    rotateInterval?: number;
    basePath: string;
  }

  let { tools, displayCount = 12, rotateInterval = 10000, basePath }: Props = $props();

  let currentPage = $state(0);
  let intervalId: ReturnType<typeof setInterval> | null = null;

  const totalPages = $derived(Math.ceil(tools.length / displayCount));
  const pages = $derived(
    Array.from({ length: totalPages }, (_, i) =>
      tools.slice(i * displayCount, (i + 1) * displayCount)
    )
  );

  function goToNext() {
    currentPage = (currentPage + 1) % totalPages;
  }
  function goToPrev() {
    currentPage = (currentPage - 1 + totalPages) % totalPages;
  }
  function goToPage(index: number) {
    currentPage = index;
  }

  $effect(() => {
    if (totalPages <= 1) return;
    intervalId = setInterval(goToNext, rotateInterval);
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  });
</script>

<div class="relative">
  <!-- Sliding Window -->
  <div class="overflow-hidden">
    <div
      class="flex transition-transform duration-700 ease-in-out"
      style="transform: translateX(-{currentPage * 100}%)"
    >
      {#each pages as pageTools, pageIndex}
        <div class="w-full flex-shrink-0" style="min-width: 100%">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {#each pageTools as tool}
              <a
                href="{basePath}/tools/{tool.slug}"
                class="glass-card flex items-center gap-4 p-5 group/card relative overflow-hidden"
              >
                <div class="absolute inset-0 bg-gradient-to-br from-transparent to-amber-500/5 dark:to-amber-500/10 opacity-0 group-hover/card:opacity-100 transition-opacity duration-500"></div>
                <div class="relative z-10 flex items-center gap-4 w-full">
                  <span class="text-slate-400 dark:text-slate-500 flex-shrink-0 inline-flex transition-all duration-500 group-hover/card:text-amber-500 group-hover/card:scale-110 group-hover/card:drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]">
                    {@html getIconSvg(tool.icon, 24)}
                  </span>
                  <div class="flex-1 min-w-0">
                    <h3 class="font-bold text-sm text-slate-900 dark:text-white truncate group-hover/card:text-amber-600 dark:group-hover/card:text-amber-400 transition-colors">
                      {tool.name}
                    </h3>
                    <p class="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-1.5 leading-relaxed">
                      {tool.description}
                    </p>
                  </div>
                  <span class="inline-flex items-center px-2 py-0.5 text-[9px] font-black rounded-full bg-slate-100 text-slate-500 dark:bg-white/5 dark:text-slate-500 flex-shrink-0 border border-slate-200 dark:border-white/10 tracking-widest uppercase shadow-sm">
                    {tool.categoryName}
                  </span>
                </div>
              </a>
            {/each}
          </div>
        </div>
      {/each}
    </div>
  </div>

  <!-- Pagination Controls -->
  {#if totalPages > 1}
    <div class="flex items-center justify-center gap-4 mt-8">
      <button
        onclick={goToPrev}
        class="p-2 rounded-lg bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50
               hover:bg-slate-200 dark:hover:bg-slate-700 hover:border-slate-300 dark:hover:border-slate-600
               hover:text-amber-500 dark:hover:text-amber-400 active:scale-95
               transition-all duration-300 text-slate-700 dark:text-slate-300"
        aria-label="Previous"
      >
        <svg class="w-5 h-5 transition-transform group-active:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <div class="flex items-center gap-2">
        {#each Array.from({ length: totalPages }) as _, index}
          <button
            onclick={() => goToPage(index)}
            class="h-2 rounded-full transition-all duration-300 {currentPage === index ? 'w-6 bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]' : 'w-2 bg-slate-300 dark:bg-slate-700 hover:bg-slate-400 dark:hover:bg-slate-600'}"
            aria-label="Page {index + 1}"
          ></button>
        {/each}
      </div>

      <button
        onclick={goToNext}
        class="p-2 rounded-lg bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50
               hover:bg-slate-200 dark:hover:bg-slate-700 hover:border-slate-300 dark:hover:border-slate-600
               hover:text-amber-500 dark:hover:text-amber-400 active:scale-95
               transition-all duration-300 text-slate-700 dark:text-slate-300"
        aria-label="Next"
      >
        <svg class="w-5 h-5 transition-transform group-active:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>

    <p class="text-center text-sm font-black tracking-widest text-slate-400 dark:text-slate-500 mt-4 opacity-50 uppercase">
      {currentPage + 1} / {totalPages}
    </p>
  {/if}
</div>
