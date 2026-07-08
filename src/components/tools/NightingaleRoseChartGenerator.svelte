<script lang="ts">
  import { onDestroy } from "svelte";

  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  import { createToolTranslator, createGeneralTranslator } from '@/lib/translation-helper';
  const t = createToolTranslator(translations, 'nightingale-rose-chart-generator');
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

  // Default data
  const defaultDataValues = [
    { id: "def-1", nameKey: "categoryA", value: 335 },
    { id: "def-2", nameKey: "categoryB", value: 310 },
    { id: "def-3", nameKey: "categoryC", value: 234 },
    { id: "def-4", nameKey: "categoryD", value: 135 },
    { id: "def-5", nameKey: "categoryE", value: 148 },
  ];

  function parseCSV(csvText: string): { name: string; value: number }[] {
    const lines = csvText.trim().split("\n");
    if (lines.length < 2) return [];
    const result: { name: string; value: number }[] = [];
    for (let i = 1; i < lines.length; i++) {
      const cols = lines[i].split(",").map((c) => c.trim());
      if (cols.length >= 2)
        result.push({ name: cols[0], value: Number(cols[1]) || 0 });
    }
    return result;
  }

  // Types
  interface DataRow {
    id: string;
    name: string;
    value: number;
  }

  let idCounter = $state(100);

  let isInitialized = $state(false);

  let data = $state(
    defaultDataValues.map((item) => ({
      id: item.id,
      name: item.nameKey,
      value: item.value,
    })),
  );

  let chartTitle = $state("");

  let colorTheme = $state("default");

  let showLegend = $state(true);

  let showLabels = $state(true);

  let roseType = $state("area");

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
        formatter: "{b}: {c} ({d}%)",
      },
      legend: {
        show: showLegend,
        bottom: 10,
        textStyle: { color: chartTheme.legendText },
      },
      color: colors,
      series: [
        {
          name: chartTitle,
          type: "pie",
          roseType: roseType,
          radius: ["20%", "70%"],
          center: ["50%", "50%"],
          itemStyle: {
            borderRadius: 5,
          },
          label: {
            show: showLabels,
            color: chartTheme.labelColor,
          },
          data: data.map((d) => ({
            name: d.name,
            value: d.value,
          })),
        },
      ],
    };
  }

  $effect(() => {
    if (!isInitialized) {
      chartTitle = t("defaultTitle");
      data = defaultDataValues.map((item) => ({
        id: item.id,
        name: t(`sampleData.${item.nameKey}`),
        value: item.value,
      }));
      isInitialized = true;
    }
  });
  onDestroy(() => {
    if (timerRef) clearTimeout(timerRef);
  });

  // Functions
  function addRow() {
    const newId = generateId();
    data = [
      ...data,
      { id: newId, name: `${t("item")}${data.length + 1}`, value: 20 },
    ];
  }
  function deleteRow(id: string) {
    if (data.length > 1) {
      data = data.filter((row) => row.id !== id);
    }
  }
  function updateRow(
    id: string,
    field: "name" | "value",
    value: string | number,
  ) {
    data = data.map((row) =>
      row.id === id
        ? { ...row, [field]: field === "value" ? Number(value) || 0 : value }
        : row,
    );
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
    const newCounter = idCounter + 6;
    data = [
      {
        id: `${baseId}-${idCounter}`,
        name: t("sampleData.productA"),
        value: 45,
      },
      {
        id: `${baseId}-${idCounter + 1}`,
        name: t("sampleData.productB"),
        value: 38,
      },
      {
        id: `${baseId}-${idCounter + 2}`,
        name: t("sampleData.productC"),
        value: 32,
      },
      {
        id: `${baseId}-${idCounter + 3}`,
        name: t("sampleData.productD"),
        value: 28,
      },
      {
        id: `${baseId}-${idCounter + 4}`,
        name: t("sampleData.productE"),
        value: 24,
      },
      {
        id: `${baseId}-${idCounter + 5}`,
        name: t("sampleData.productF"),
        value: 20,
      },
    ];
    idCounter = newCounter;
    chartTitle = t("sampleTitle");
  }
  function clearData() {
    if (confirm(t("confirmClear"))) {
      const newId = `${baseId}-${idCounter}`;
      idCounter = idCounter + 1;
      data = [{ id: newId, name: `${t("item")}1`, value: 20 }];
      chartTitle = t("chartTitle");
    }
  }
  function handleCsvImport(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const csvText = e.target?.result as string;
      const parsedData = parseCSV(csvText);

      if (parsedData.length > 0) {
        const newData = parsedData.map((item, index) => ({
          id: `${baseId}-csv-${idCounter + index}`,
          name: item.name,
          value: item.value,
        }));
        data = newData;
        idCounter = idCounter + parsedData.length;
        alert(t("csvImportSuccess", { count: parsedData.length }));
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
    <div class="space-y-4">
      <div>
        <label
          for="chart-settings"
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
            <label for={t("roseType")} class="block text-sm font-medium mb-1"
              >{t("roseType")}</label
            >
            <select
              value={roseType}
              onchange={(e) =>
                (roseType = (e.target as HTMLInputElement).value as
                  | "area"
                  | "radius")}
              class="tool-input"
            >
              <option value="area">{t("roseTypeArea")}</option>
              <option value="radius">{t("roseTypeRadius")}</option>
            </select>
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
                bind:checked={showLabels}
                class="w-4 h-4 accent-amber-500"
              />
              <span>{t("showLabels")}</span>
            </label>
          </div>
        </div>
      </div>

      <div>
        <div class="flex justify-between items-center mb-2">
          <div class="text-sm font-medium">{t("dataEditor")}</div>
          <button onclick={addRow} class="btn-secondary btn-sm">
            + {t("addRow")}
          </button>
        </div>

        <div
          class="bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-3 overflow-x-auto"
        >
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b border-gray-200 dark:border-gray-700">
                <th class="text-left py-2 px-2 font-medium"
                  >{t("columnName")}</th
                >
                <th class="text-left py-2 px-2 font-medium">{t("value")}</th>
                <th class="w-10"></th>
              </tr>
            </thead>
            <tbody>
              {#each data as row (row.id)}
                <tr
                  class="border-b border-gray-100 dark:border-gray-800 last:border-b-0"
                >
                  <td class="py-2 px-2">
                    <input
                      type="text"
                      value={row.name}
                      onchange={(e) =>
                        updateRow(
                          row.id,
                          "name",
                          (e.target as HTMLInputElement).value,
                        )}
                      class="w-full px-2 py-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded text-gray-900 dark:text-gray-100 text-sm"
                    />
                  </td>
                  <td class="py-2 px-2">
                    <input
                      type="number"
                      value={row.value}
                      onchange={(e) =>
                        updateRow(
                          row.id,
                          "value",
                          (e.target as HTMLInputElement).value,
                        )}
                      class="w-full px-2 py-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded text-gray-900 dark:text-gray-100 text-sm"
                    />
                  </td>
                  <td class="py-2 px-2">
                    <button
                      onclick={() => deleteRow(row.id)}
                      class="text-red-400 hover:text-red-300 disabled:opacity-50"
                      disabled={data.length <= 1}
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

    <div>
      <label
        for="chart-preview"
        class="block text-sm font-medium mb-2">{t("chartPreview")}</label
      >
      <div
        class="rounded-lg border border-gray-300 dark:border-gray-700 overflow-hidden bg-gray-100 dark:bg-gray-800"
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
    </ul>
  </div>
</div>
