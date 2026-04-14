<script lang="ts">
  import { onDestroy } from "svelte";
  import { parseScatterCSV } from '@/lib/tool-stubs';

  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  import { createToolTranslator, createGeneralTranslator } from '@/lib/translation-helper';
  const t = createToolTranslator(translations, 'scatter-chart-generator');
  const tg = createGeneralTranslator(translations);

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

  // Types
  interface ScatterPoint {
    id: string;
    x: number;
    y: number;
  }
  interface ScatterSeries {
    id: string;
    name: string;
    data: ScatterPoint[];
  }

  let idCounter = $state(100);

  let isInitialized = $state(false);

  function getInitialData() {
    return [
      {
        id: "series-1",
        name: "Series 1",
        data: [
          { id: "p1", x: 10, y: 8.04 },
          { id: "p2", x: 8, y: 6.95 },
          { id: "p3", x: 13, y: 7.58 },
          { id: "p4", x: 9, y: 8.81 },
          { id: "p5", x: 11, y: 8.33 },
        ],
      },
    ];
  }

  let series = $state(getInitialData());

  let chartTitle = $state("");

  let colorTheme = $state("default");

  let showLegend = $state(true);

  let showGrid = $state(true);

  let symbolSize = $state(10);

  let xAxisName = $state("X");

  let yAxisName = $state("Y");

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
        trigger: "item" as const as const as const as const,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        formatter: (params: any) => {
          const data = params.data as number[];
          return `${params.seriesName}<br/>X: ${data[0]}<br/>Y: ${data[1]}`;
        },
      },
      legend: {
        show: showLegend,
        bottom: 10,
        textStyle: { color: chartTheme.legendText },
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: showLegend ? "15%" : "3%",
        top: "15%",
        containLabel: true,
      },
      xAxis: {
        type: "value" as const as const as const as const,
        name: xAxisName,
        nameTextStyle: { color: chartTheme.axisLabelColor },
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
        type: "value" as const as const as const as const,
        name: yAxisName,
        nameTextStyle: { color: chartTheme.axisLabelColor },
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
      color: colors,
      series: series.map((s, index) => ({
        name: s.name,
        type: "scatter" as const,
        symbolSize: symbolSize,
        data: s.data.map((p) => [p.x, p.y]),
        itemStyle: { color: colors[index % colors.length] },
      })),
    };
  }

  $effect(() => {
    if (!isInitialized) {
      chartTitle = t("defaultTitle");
      series = [
        {
          id: "series-1",
          name: t("sampleData.series1"),
          data: [
            { id: "p1", x: 10, y: 8.04 },
            { id: "p2", x: 8, y: 6.95 },
            { id: "p3", x: 13, y: 7.58 },
            { id: "p4", x: 9, y: 8.81 },
            { id: "p5", x: 11, y: 8.33 },
          ],
        },
      ];
      isInitialized = true;
    }
  });

  onDestroy(() => {
    if (timerRef) clearTimeout(timerRef);
  });

  // Functions
  function addPoint(seriesIndex: number) {
    const newSeries = [...series];
    const newId = generateId();
    newSeries[seriesIndex].data.push({ id: newId, x: 0, y: 0 });
    series = newSeries;
  }
  function deletePoint(seriesIndex: number, pointId: string) {
    const newSeries = [...series];
    if (newSeries[seriesIndex].data.length > 1) {
      newSeries[seriesIndex].data = newSeries[seriesIndex].data.filter(
        (p) => p.id !== pointId,
      );
      series = newSeries;
    }
  }
  function updatePoint(
    seriesIndex: number,
    pointId: string,
    field: "x" | "y",
    value: number,
  ) {
    const newSeries = [...series];
    newSeries[seriesIndex].data = newSeries[seriesIndex].data.map((p) =>
      p.id === pointId ? { ...p, [field]: value } : p,
    );
    series = newSeries;
  }
  function addSeries() {
    const newId = generateId();
    series = [
      ...series,
      {
        id: newId,
        name: `${t("series")}${series.length + 1}`,
        data: [{ id: generateId(), x: 0, y: 0 }],
      },
    ];
  }
  function deleteSeries(seriesId: string) {
    if (series.length > 1) {
      series = series.filter((s) => s.id !== seriesId);
    }
  }
  function updateSeriesName(seriesId: string, name: string) {
    series = series.map((s) => (s.id === seriesId ? { ...s, name } : s));
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
      type: format,
      pixelRatio: 2,
      backgroundColor: chartTheme.backgroundColor,
    });

    const link = document.createElement("a");
    link.href = url;
    link.download = `chart.${format}`;
    link.click();
  }
  function loadSampleData() {
    series = [
      {
        id: generateId(),
        name: t("sampleData.height"),
        data: [
          { id: generateId(), x: 161, y: 51 },
          { id: generateId(), x: 167, y: 59 },
          { id: generateId(), x: 159, y: 49 },
          { id: generateId(), x: 157, y: 63 },
          { id: generateId(), x: 155, y: 53 },
          { id: generateId(), x: 170, y: 59 },
          { id: generateId(), x: 159, y: 47 },
          { id: generateId(), x: 166, y: 69 },
        ],
      },
      {
        id: generateId(),
        name: t("sampleData.weight"),
        data: [
          { id: generateId(), x: 174, y: 65 },
          { id: generateId(), x: 172, y: 80 },
          { id: generateId(), x: 186, y: 72 },
          { id: generateId(), x: 176, y: 69 },
          { id: generateId(), x: 180, y: 76 },
          { id: generateId(), x: 177, y: 61 },
          { id: generateId(), x: 184, y: 79 },
        ],
      },
    ];
    chartTitle = t("sampleTitle");
    xAxisName = t("sampleData.heightLabel");
    yAxisName = t("sampleData.weightLabel");
  }
  function clearData() {
    if (confirm(t("confirmClear"))) {
      series = [
        {
          id: generateId(),
          name: `${t("series")}1`,
          data: [{ id: generateId(), x: 0, y: 0 }],
        },
      ];
      chartTitle = t("chartTitle");
    }
  }
  function handleCsvImport(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const csvText = e.target?.result as string;
      const parsed = parseScatterCSV(csvText);

      if (parsed && parsed.length > 0) {
        let counter = idCounter;
        const newSeries = parsed.map((s) => {
          const seriesId = `${baseId}-csv-${counter++}`;
          const data = s.data.map((p) => ({
            id: `${baseId}-csv-${counter++}`,
            x: p.x,
            y: p.y,
          }));
          return { id: seriesId, name: s.name, data };
        });
        series = newSeries;
        idCounter = counter;
        const totalPoints = parsed.reduce((sum, s) => sum + s.data.length, 0);
        alert(t("csvImportSuccess").replace("{count}", String(totalPoints)));
      } else {
        alert(t("csvImportError"));
      }
    };
    reader.readAsText(file);

    // 重置文件输入
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

          <div class="grid grid-cols-2 gap-2">
            <div>
              <label for={t("xAxisName")} class="block text-sm font-medium mb-1"
                >{t("xAxisName")}</label
              >
              <input type="text" bind:value={xAxisName} class="tool-input" />
            </div>
            <div>
              <label for={t("yAxisName")} class="block text-sm font-medium mb-1"
                >{t("yAxisName")}</label
              >
              <input type="text" bind:value={yAxisName} class="tool-input" />
            </div>
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
            <label
              for="{t('symbolSize')}: {symbolSize}"
              class="block text-sm font-medium mb-1"
              >{t("symbolSize")}: {symbolSize}</label
            >
            <input
              type="range"
              min="5"
              max="30"
              value={symbolSize}
              onchange={(e) =>
                (symbolSize = Number((e.target as HTMLInputElement).value))}
              class="w-full"
            />
          </div>

          <div class="flex flex-wrap gap-6 text-sm">
            <label
              class="flex items-center gap-2 cursor-pointer whitespace-nowrap"
            >
              <input
                type="checkbox"
                bind:checked={showLegend}
                class="w-4 h-4 accent-amber-500"
              />
              <span>{t("showLegend")}</span>
            </label>
            <label
              class="flex items-center gap-2 cursor-pointer whitespace-nowrap"
            >
              <input
                type="checkbox"
                bind:checked={showGrid}
                class="w-4 h-4 accent-amber-500"
              />
              <span>{t("showGrid")}</span>
            </label>
          </div>
        </div>
      </div>

      <!-- 数据系列编辑 -->
      <div>
        <div class="flex justify-between items-center mb-2">
          <label class="text-sm font-medium">{t("dataEditor")}</label>
          <button onclick={addSeries} class="btn-secondary btn-sm">
            + {t("addSeries")}
          </button>
        </div>

        <div class="space-y-3 max-h-80 overflow-y-auto">
          {#each series as s, sIndex (s.id)}
            <div
              class="bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-3"
            >
              <div class="flex items-center gap-2 mb-2">
                <input
                  type="text"
                  value={s.name}
                  onchange={(e) =>
                    updateSeriesName(
                      s.id,
                      (e.target as HTMLInputElement).value,
                    )}
                  class="flex-1 px-2 py-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-gray-100 text-sm"
                />
                <button
                  onclick={() => deleteSeries(s.id)}
                  class="text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 disabled:opacity-50"
                  disabled={series.length <= 1}
                >
                  ✕
                </button>
              </div>
              <table class="w-full text-sm">
                <thead>
                  <tr class="border-b border-gray-200 dark:border-gray-700">
                    <th class="text-left py-1 px-1 font-medium">X</th>
                    <th class="text-left py-1 px-1 font-medium">Y</th>
                    <th class="w-8"></th>
                  </tr>
                </thead>
                <tbody>
                  {#each s.data as p (p.id)}
                    <tr
                      class="border-b border-gray-200 dark:border-gray-800 last:border-b-0"
                    >
                      <td class="py-1 px-1">
                        <input
                          type="number"
                          value={p.x}
                          onchange={(e) =>
                            updatePoint(
                              sIndex,
                              p.id,
                              "x",
                              Number((e.target as HTMLInputElement).value) || 0,
                            )}
                          class="w-full px-2 py-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-gray-100 text-sm"
                        />
                      </td>
                      <td class="py-1 px-1">
                        <input
                          type="number"
                          value={p.y}
                          onchange={(e) =>
                            updatePoint(
                              sIndex,
                              p.id,
                              "y",
                              Number((e.target as HTMLInputElement).value) || 0,
                            )}
                          class="w-full px-2 py-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-gray-100 text-sm"
                        />
                      </td>
                      <td class="py-1 px-1">
                        <button
                          onclick={() => deletePoint(sIndex, p.id)}
                          class="text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 disabled:opacity-50 text-xs"
                          disabled={s.data.length <= 1}
                        >
                          ✕
                        </button>
                      </td>
                    </tr>
                  {/each}
                </tbody>
              </table>
              <button
                onclick={() => addPoint(sIndex)}
                class="mt-2 text-xs text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300"
              >
                + {t("addPoint")}
              </button>
            </div>
          {/each}
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
          option={getChartOption}
          style="height: 400px; width: 100%"
          notMerge={true}
          lazyUpdate={true}
        />
      </div>
    </div>
  </div>

  <!-- 使用说明 -->
  <div
    class="p-3 bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-700 rounded-lg text-sm text-amber-700 dark:text-amber-300"
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
    <ul class="space-y-0.5 text-amber-600 dark:text-amber-400">
      <li>• {t("tips.tip1")}</li>
      <li>• {t("tips.tip2")}</li>
      <li>• {t("tips.tip3")}</li>
      <li>• {t("tips.tip4")}</li>
      <li>• {t("tips.tip5")}</li>
      <li>• {t("tips.tip6")}</li>
    </ul>
  </div>
</div>
