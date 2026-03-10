<script lang="ts">
  import { onDestroy } from "svelte";

  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string, vars?: Record<string, string | number>): string {
    const tools = (translations["tools"] as Record<string, unknown>) || {};
    const scope =
      (tools["line-chart-generator"] as Record<string, unknown>) || {};
    const keys = key.split(".");
    let value: unknown = scope;
    for (const k of keys) {
      value = (value as Record<string, unknown>)?.[k];
    }
    if (typeof value !== "string")
      return `MISSING: tools.line-chart-generator.${key}`;
    if (!vars) return value;
    let result = value;
    for (const [vKey, vVal] of Object.entries(vars)) {
      result = result.replace(`{${vKey}}`, String(vVal));
    }
    return result;
  }
  function tg(key: string): string {
    const scope = (translations["tools"] as Record<string, unknown>) || {};
    const keys = key.split(".");
    let value: unknown = scope;
    for (const k of keys) {
      value = (value as Record<string, unknown>)?.[k];
    }
    return typeof value === "string" ? value : `MISSING: tools.${key}`;
  }

  // Imports
  import EChartsWrapper, {
    type EChartsWrapperRef,
  } from "./EChartsWrapper.svelte";
  import type { EChartsOption } from "echarts";
  import { useChartTheme } from "@/hooks/useChartTheme";

  const baseId = "id-" + Math.random().toString(36).slice(2, 9);
  const chartTheme = useChartTheme();

  const colorThemes = {
    default: [
      "#5470c6",
      "#91cc75",
      "#fac858",
      "#ee6666",
      "#73c0de",
      "#3ba272",
      "#fc8452",
      "#9a60b4",
    ],
    ocean: [
      "#0077b6",
      "#00b4d8",
      "#90e0ef",
      "#48cae4",
      "#023e8a",
      "#0096c7",
      "#caf0f8",
      "#03045e",
    ],
    sunset: [
      "#ff6b6b",
      "#feca57",
      "#ff9ff3",
      "#54a0ff",
      "#5f27cd",
      "#00d2d3",
      "#ff9f43",
      "#ee5a24",
    ],
    forest: [
      "#2d6a4f",
      "#40916c",
      "#52b788",
      "#74c69d",
      "#95d5b2",
      "#b7e4c7",
      "#d8f3dc",
      "#1b4332",
    ],
  };

  // Default data
  const defaultCategories = ["jan", "feb", "mar", "apr", "may", "jun"];
  const defaultSeriesData = [
    { id: "def-1", nameKey: "sales", data: [150, 230, 224, 218, 135, 147] },
    { id: "def-2", nameKey: "profit", data: [80, 120, 110, 95, 70, 85] },
  ];

  function parseMultiSeriesCSV(csvText: string): {
    categories: string[];
    seriesData: { name: string; data: number[] }[];
  } | null {
    const lines = csvText.trim().split("\n");
    if (lines.length < 2) return null;
    const headers = lines[0].split(",").map((h) => h.trim());
    if (headers.length < 2) return null;
    const categories: string[] = [];
    const seriesMap: Record<string, number[]> = {};
    for (let i = 1; i < headers.length; i++) {
      seriesMap[headers[i]] = [];
    }
    for (let i = 1; i < lines.length; i++) {
      const cols = lines[i].split(",").map((c) => c.trim());
      if (cols.length < 2) continue;
      categories.push(cols[0]);
      for (let j = 1; j < headers.length; j++) {
        seriesMap[headers[j]].push(Number(cols[j]) || 0);
      }
    }
    const seriesData = Object.entries(seriesMap).map(([name, data]) => ({
      name,
      data,
    }));
    return { categories, seriesData };
  }

  // Types
  type LineStyleType = "solid" | "dashed" | "dotted";
  interface DataSeries {
    id: string;
    name: string;
    data: number[];
  }

  let idCounter = $state(100);

  let isInitialized = $state(false);

  let categories = $state(defaultCategories.map((key) => key));

  let series = $state(
    defaultSeriesData.map((item) => ({
      id: item.id,
      name: item.nameKey,
      data: item.data,
    })),
  );

  let chartTitle = $state("");

  let colorTheme = $state("default");

  let showLegend = $state(true);

  let showGrid = $state(true);

  let smooth = $state(false);

  let areaFill = $state(false);

  let lineStyle = $state("solid");

  let timerRef = $state(null);

  let chartRef = $state<{ getEchartsInstance?: () => any } | null>(null);

  let fileInputRef = $state<HTMLInputElement | null>(null);

  function generateId() {
    const newId = `${baseId}-${idCounter}`;
    idCounter = idCounter + 1;
    return newId;
  }

  function getChartOption() {
    const colors = colorThemes[colorTheme as keyof typeof colorThemes];

    return {
      backgroundColor: chartTheme.backgroundColor,
      title: {
        text: chartTitle,
        left: "center",
        textStyle: {
          fontSize: 18,
          fontWeight: "bold" as const,
          color: chartTheme.textColor,
        },
      },
      tooltip: {
        trigger: "axis" as const,
      },
      legend: {
        show: showLegend,
        bottom: 10,
        textStyle: { color: chartTheme.legendText },
        data: series.map((s) => s.name),
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: showLegend ? "15%" : "3%",
        top: "15%",
        containLabel: true,
      },
      xAxis: {
        type: "category" as const,
        data: categories,
        boundaryGap: false,
        splitLine: {
          show: showGrid,
          lineStyle: { color: chartTheme.splitLineColor },
        },
        axisLine: {
          show: true,
          lineStyle: { color: chartTheme.axisLineColor },
        },
        axisLabel: { color: chartTheme.axisLabelColor },
      },
      yAxis: {
        type: "value" as const,
        splitLine: {
          show: showGrid,
          lineStyle: { color: chartTheme.splitLineColor },
        },
        axisLine: {
          show: true,
          lineStyle: { color: chartTheme.axisLineColor },
        },
        axisLabel: { color: chartTheme.axisLabelColor },
      },
      series: series.map((s, index) => ({
        name: s.name,
        type: "line" as const,
        data: s.data,
        smooth: smooth,
        lineStyle: {
          type: lineStyle,
          width: 2,
        },
        areaStyle: areaFill ? { opacity: 0.3 } : undefined,
        itemStyle: {
          color: colors[index % colors.length],
        },
      })),
    };
  }

  $effect(() => {
    if (!isInitialized) {
      chartTitle = t("defaultTitle");
      categories = defaultCategories.map((key) => t(`sampleData.${key}`));
      series = defaultSeriesData.map((item) => ({
        id: item.id,
        name: t(`sampleData.${item.nameKey}`),
        data: item.data,
      }));
      isInitialized = true;
    }
  });
  onDestroy(() => {
    if (timerRef) clearTimeout(timerRef);
  });

  // Functions
  function addCategory() {
    const newIndex = categories.length + 1;
    categories = [...categories, `${t("category")}${newIndex}`];
    // 为每个系列添加新数据点
    series = series.map((s) => ({
      ...s,
      data: [...s.data, 100],
    }));
  }
  function deleteCategory(index: number) {
    if (categories.length > 2) {
      categories = categories.filter((_, i) => i !== index);
      series = series.map((s) => ({
        ...s,
        data: s.data.filter((_, i) => i !== index),
      }));
    }
  }
  function updateCategory(index: number, value: string) {
    const newCategories = [...categories];
    newCategories[index] = value;
    categories = newCategories;
  }
  function addSeries() {
    const newId = generateId();
    const newIndex = series.length + 1;
    series = [
      ...series,
      {
        id: newId,
        name: `${t("series")}${newIndex}`,
        data: categories.map(() => 100),
      },
    ];
  }
  function deleteSeries(id: string) {
    if (series.length > 1) {
      series = series.filter((s) => s.id !== id);
    }
  }
  function updateSeriesName(id: string, name: string) {
    series = series.map((s) => (s.id === id ? { ...s, name } : s));
  }
  function updateSeriesData(id: string, index: number, value: number) {
    series = series.map((s) => {
      if (s.id === id) {
        const newData = [...s.data];
        newData[index] = value;
        return { ...s, data: newData };
      }
      return s;
    });
  }
  function exportChart(format: "png" | "svg") {
    if (!chartRef) {
      console.warn("Chart ref not available");
      return;
    }

    const echartInstance = chartRef?.getEchartsInstance?.();
    if (!echartInstance) {
      console.warn("ECharts instance not ready");
      return;
    }

    const url = echartInstance.getDataURL({
      type: format === "svg" ? "svg" : "png",
      pixelRatio: 2,
      backgroundColor: chartTheme.backgroundColor,
    });

    const link = document.createElement("a");
    link.download = `line-chart-${Date.now()}.${format}`;
    link.href = url;
    link.click();
  }
  function loadSampleData() {
    categories = [
      t("sampleData.jan"),
      t("sampleData.feb"),
      t("sampleData.mar"),
      t("sampleData.apr"),
      t("sampleData.may"),
      t("sampleData.jun"),
    ];
    const newCounter = idCounter + 2;
    series = [
      {
        id: `${baseId}-${idCounter}`,
        name: t("sampleData.sales"),
        data: [150, 230, 224, 218, 135, 147],
      },
      {
        id: `${baseId}-${idCounter + 1}`,
        name: t("sampleData.profit"),
        data: [80, 120, 110, 95, 70, 85],
      },
    ];
    idCounter = newCounter;
    chartTitle = t("sampleTitle");
  }
  function clearData() {
    if (confirm(t("confirmClear"))) {
      const newId = generateId();
      categories = [`${t("category")}1`, `${t("category")}2`];
      series = [{ id: newId, name: `${t("series")}1`, data: [100, 100] }];
      chartTitle = t("chartTitle");
    }
  }
  function handleCsvImport(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const csvText = e.target?.result as string;
      const parsed = parseMultiSeriesCSV(csvText);

      if (
        parsed &&
        parsed.categories.length > 0 &&
        parsed.seriesData.length > 0
      ) {
        categories = parsed.categories;
        const newSeries = parsed.seriesData.map((s, index) => ({
          id: `${baseId}-csv-${idCounter + index}`,
          name: s.name,
          data: s.data,
        }));
        series = newSeries;
        idCounter = idCounter + parsed.seriesData.length;
        alert(t("csvImportSuccess", { count: parsed.categories.length }));
      } else {
        alert(t("csvImportError"));
      }
    };
    reader.readAsText(file);

    if (fileInputRef) {
      fileInputRef.value = "";
    }
  }
</script>

<div class="space-y-4">
  <!-- 工具栏 -->
  <div class="flex flex-wrap gap-2">
    <button onclick={loadSampleData} class="btn-primary">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="1em"
        height="1em"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        ><path d="M3 3v18h18" /><path d="M18 17V9" /><path d="M13 17V5" /><path
          d="M8 17v-3"
        /></svg
      >
      {t("loadSample")}
    </button>
    <button onclick={() => fileInputRef?.click()} class="btn-secondary">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="1em"
        height="1em"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        ><path
          d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"
        /></svg
      >
      {t("importCsv")}
    </button>
    <input
      bind:this={fileInputRef}
      type="file"
      accept=".csv,.txt"
      onchange={handleCsvImport}
      class="hidden"
    />
    <button onclick={() => exportChart("png")} class="btn-secondary">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="1em"
        height="1em"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        ><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline
          points="7 10 12 15 17 10"
        /><line x1="12" x2="12" y1="15" y2="3" /></svg
      >
      {t("downloadPng")}
    </button>
    <button onclick={() => exportChart("svg")} class="btn-secondary">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="1em"
        height="1em"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        ><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline
          points="7 10 12 15 17 10"
        /><line x1="12" x2="12" y1="15" y2="3" /></svg
      >
      {t("downloadSvg")}
    </button>
    <button onclick={clearData} class="btn-secondary">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="1em"
        height="1em"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        ><path d="M3 6h18" /><path
          d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"
        /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg
      >
      {tg("clear")}
    </button>
  </div>

  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <!-- 左侧：数据编辑器 -->
    <div class="space-y-4">
      <!-- 图表设置 -->
      <div>
        <label
          for="label-{t('chartsettings')}"
          class="block text-sm font-medium mb-2">{t("chartSettings")}</label
        >
        <div
          class="space-y-3 p-4 bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg"
        >
          <div>
            <label for={t("chartTitle")} class="block text-sm font-medium mb-1"
              >{t("chartTitle")}</label
            >
            <input
              type="text"
              bind:value={chartTitle}
              class="tool-input"
              placeholder={t("chartTitlePlaceholder")}
            />
          </div>

          <div>
            <label for={t("colorTheme")} class="block text-sm font-medium mb-1"
              >{t("colorTheme")}</label
            >
            <select
              value={colorTheme}
              onchange={(e) =>
                (colorTheme = (e.target as HTMLInputElement)
                  .value as keyof typeof colorThemes)}
              class="tool-input"
            >
              <option value="default">{t("themeDefault")}</option>
              <option value="ocean">{t("themeOcean")}</option>
              <option value="sunset">{t("themeSunset")}</option>
              <option value="forest">{t("themeForest")}</option>
            </select>
          </div>

          <div>
            <label for={t("lineStyle")} class="block text-sm font-medium mb-1"
              >{t("lineStyle")}</label
            >
            <select
              value={lineStyle}
              onchange={(e) =>
                (lineStyle = (e.target as HTMLInputElement)
                  .value as LineStyleType)}
              class="tool-input"
            >
              <option value="solid">{t("styleSolid")}</option>
              <option value="dashed">{t("styleDashed")}</option>
              <option value="dotted">{t("styleDotted")}</option>
            </select>
          </div>

          <div class="flex flex-wrap gap-6 text-sm">
            <label
              class="flex items-center gap-2 cursor-pointer whitespace-nowrap"
            >
              <input
                type="checkbox"
                bind:checked={showLegend}
                class="w-4 h-4 accent-blue-500"
              />
              <span>{t("showLegend")}</span>
            </label>
            <label
              class="flex items-center gap-2 cursor-pointer whitespace-nowrap"
            >
              <input
                type="checkbox"
                bind:checked={showGrid}
                class="w-4 h-4 accent-blue-500"
              />
              <span>{t("showGrid")}</span>
            </label>
            <label
              class="flex items-center gap-2 cursor-pointer whitespace-nowrap"
            >
              <input
                type="checkbox"
                bind:checked={smooth}
                class="w-4 h-4 accent-blue-500"
              />
              <span>{t("smooth")}</span>
            </label>
            <label
              class="flex items-center gap-2 cursor-pointer whitespace-nowrap"
            >
              <input
                type="checkbox"
                bind:checked={areaFill}
                class="w-4 h-4 accent-blue-500"
              />
              <span>{t("areaFill")}</span>
            </label>
          </div>
        </div>
      </div>

      <!-- 数据表格 -->
      <div>
        <div class="flex justify-between items-center mb-2">
          <span class="text-sm font-medium">{t("dataEditor")}</span>
          <div class="flex gap-2">
            <button onclick={addCategory} class="btn-secondary btn-sm">
              + {t("addCategory")}
            </button>
            <button onclick={addSeries} class="btn-secondary btn-sm">
              + {t("addSeries")}
            </button>
          </div>
        </div>

        <div
          class="bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-3 overflow-x-auto"
        >
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b border-gray-200 dark:border-gray-700">
                <th class="text-left py-2 px-2 font-medium">{t("category")}</th>
                {#each series as s (s.id)}
                  <th class="text-left py-2 px-2 font-medium">
                    <div class="flex items-center gap-1">
                      <input
                        type="text"
                        value={s.name}
                        onchange={(e) =>
                          updateSeriesName(
                            s.id,
                            (e.target as HTMLInputElement).value,
                          )}
                        class="w-20 px-1 py-0.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-gray-100 text-xs"
                      />
                      <button
                        onclick={() => deleteSeries(s.id)}
                        class="text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 disabled:opacity-50"
                        disabled={series.length <= 1}
                      >
                        ✕
                      </button>
                    </div>
                  </th>
                {/each}
                <th class="w-10"></th>
              </tr>
            </thead>
            <tbody>
              {#each categories as cat, catIndex (catIndex)}
                <tr
                  class="border-b border-gray-200 dark:border-gray-800 last:border-b-0"
                >
                  <td class="py-2 px-2">
                    <input
                      type="text"
                      value={cat}
                      onchange={(e) =>
                        updateCategory(
                          catIndex,
                          (e.target as HTMLInputElement).value,
                        )}
                      class="w-full px-2 py-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-gray-100 text-sm"
                    />
                  </td>
                  {#each series as s (s.id)}
                    <td class="py-2 px-2">
                      <input
                        type="number"
                        value={s.data[catIndex]}
                        onchange={(e) =>
                          updateSeriesData(
                            s.id,
                            catIndex,
                            Number((e.target as HTMLInputElement).value) || 0,
                          )}
                        class="w-full px-2 py-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-gray-100 text-sm"
                      />
                    </td>
                  {/each}
                  <td class="py-2 px-2">
                    <button
                      onclick={() => deleteCategory(catIndex)}
                      class="text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 disabled:opacity-50"
                      disabled={categories.length <= 2}
                    >
                      ✕
                    </button>
                  </td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- 右侧：图表预览 -->
    <div>
      <label
        for="label-{t('chartpreview')}"
        class="block text-sm font-medium mb-2">{t("chartPreview")}</label
      >
      <div
        class="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
        style="min-height: 400px"
      >
        <EChartsWrapper
          bind:this={chartRef as any}
          option={getChartOption()}
          style="height: 400px; width: 100%"
          notMerge={true}
          lazyUpdate={true}
        />
      </div>
    </div>
  </div>

  <!-- 使用说明 -->
  <div
    class="p-3 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-lg text-sm text-blue-700 dark:text-blue-300"
  >
    <p class="font-medium mb-1">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="1em"
        height="1em"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        ><path
          d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"
        /><path d="M9 18h6" /><path d="M10 22h4" /></svg
      >
      {t("tips.title")}
    </p>
    <ul class="space-y-0.5 text-blue-600 dark:text-blue-400">
      <li>• {t("tips.tip1")}</li>
      <li>• {t("tips.tip2")}</li>
      <li>• {t("tips.tip3")}</li>
      <li>• {t("tips.tip4")}</li>
      <li>• {t("tips.tip5")}</li>
      <li>• {t("tips.tip6")}</li>
    </ul>
  </div>
</div>
