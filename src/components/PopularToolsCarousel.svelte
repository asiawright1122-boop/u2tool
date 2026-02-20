<script lang="ts">
  /**
   * PopularToolsCarousel.svelte
   *
   * Auto-rotating carousel of popular tools with pagination.
   * Matches the original Next.js PopularToolsCarousel design.
   */

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
                class="group p-5 bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50
                       rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800
                       hover:border-gray-300 dark:hover:border-gray-600
                       hover:shadow-xl hover:shadow-gray-200/50 dark:hover:shadow-black/20
                       transition-all"
              >
                <div class="flex items-start gap-4">
                  <span class="text-3xl group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                    {tool.icon}
                  </span>
                  <div class="flex-1 min-w-0">
                    <h3 class="font-semibold text-lg mb-1 text-gray-900 dark:text-white
                               group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {tool.name}
                    </h3>
                    <p class="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                      {tool.description}
                    </p>
                    <span class="inline-flex items-center gap-1 mt-3 text-xs text-gray-500 dark:text-gray-400">
                      <span class="px-2 py-0.5 bg-gray-100 dark:bg-gray-700/50 rounded">{tool.categoryName}</span>
                    </span>
                  </div>
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
        class="p-2 rounded-lg bg-gray-100 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50
               hover:bg-gray-200 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-600
               transition-colors text-gray-700 dark:text-white"
        aria-label="Previous"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <div class="flex items-center gap-2">
        {#each Array.from({ length: totalPages }) as _, index}
          <button
            onclick={() => goToPage(index)}
            class="h-2 rounded-full transition-all {currentPage === index ? 'w-6 bg-blue-500' : 'w-2 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'}"
            aria-label="Page {index + 1}"
          ></button>
        {/each}
      </div>

      <button
        onclick={goToNext}
        class="p-2 rounded-lg bg-gray-100 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50
               hover:bg-gray-200 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-600
               transition-colors text-gray-700 dark:text-white"
        aria-label="Next"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>

    <p class="text-center text-sm text-gray-500 dark:text-gray-400 mt-3">
      {currentPage + 1} / {totalPages}
    </p>
  {/if}
</div>
