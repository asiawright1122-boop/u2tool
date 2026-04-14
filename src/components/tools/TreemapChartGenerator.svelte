<script lang="ts">
  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  import { createToolTranslator, createGeneralTranslator } from '@/lib/translation-helper';
  const t = createToolTranslator(translations, 'treemap-chart-generator');
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
  interface TreemapNode {
    id: string;
    name: string;
    value: number;
    children?: TreemapNode[];
  }

  let idCounter = $state(100);

  let isInitialized = $state(false);

  function getInitialData() {
    return [
      { id: "node-1", name: "Category A", value: 100 },
      { id: "node-2", name: "Category B", value: 80 },
      { id: "node-3", name: "Category C", value: 60 },
      { id: "node-4", name: "Category D", value: 40 },
    ];
  }

  let data = $state(getInitialData());

  let chartTitle = $state("");

  let colorTheme = $state("default");

  let showLabels = $state(true);

  let showBreadcrumb = $state(true);

  let leafDepth = $state(1);

  let chartRef = $state<{ getEchartsInstance?: () => any } | null>(null);

  function generateId() {
    const newId = `${baseId}-${idCounter}`;
    idCounter = idCounter + 1;
    return newId;
  }

  function getChartOption() {
    const colors = colorThemes[colorTheme as keyof typeof colorThemes];
    const _textColor = "#e5e7eb"; // 保留以备将来使用

    // 转换数据格式
    const convertData = (nodes: TreemapNode[]): object[] => {
      return nodes.map((node, index) => ({
        name: node.name,
        value:
          node.children && node.children.length > 0 ? undefined : node.value,
        children: node.children ? convertData(node.children) : undefined,
        itemStyle: { color: colors[index % colors.length] },
      }));
    };

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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        formatter: (info: any) => {
          let value = info.value;
          const treePathInfo = info.treePathInfo || [];
          const treePath = treePathInfo
            .map((item: { name: string }) => item.name)
            .join(" / ");
          return `${treePath}<br/>${t("value")}: ${value}`;
        },
      },
      series: [
        {
          name: chartTitle,
          type: "treemap",
          visibleMin: 300,
          leafDepth: leafDepth,
          label: {
            show: showLabels,
            formatter: "{b}",
            color: chartTheme.labelColor,
            fontSize: 12,
          },
          upperLabel: {
            show: true,
            height: 30,
            color: chartTheme.labelColor,
          },
          itemStyle: {
            borderColor: chartTheme.backgroundColor,
            borderWidth: 2,
            gapWidth: 2,
          },
          levels: [
            {
              itemStyle: {
                borderColor: chartTheme.backgroundColor,
                borderWidth: 0,
                gapWidth: 5,
              },
              upperLabel: { show: false },
            },
            {
              itemStyle: {
                borderColor: chartTheme.splitLineColor,
                borderWidth: 5,
                gapWidth: 1,
              },
              emphasis: {
                itemStyle: { borderColor: chartTheme.axisLineColor },
              },
            },
            {
              colorSaturation: [0.35, 0.5],
              itemStyle: {
                borderWidth: 5,
                gapWidth: 1,
                borderColorSaturation: 0.6,
              },
            },
          ],
          breadcrumb: {
            show: showBreadcrumb,
            left: "center",
            top: "bottom",
            itemStyle: {
              color: chartTheme.splitLineColor,
              borderColor: chartTheme.axisLineColor,
            },
            emphasis: { itemStyle: { color: chartTheme.axisLineColor } },
          },
          data: convertData(data),
        },
      ],
    };
  }

  $effect(() => {
    if (!isInitialized) {
      chartTitle = t("defaultTitle");
      data = [
        { id: "node-1", name: t("sampleData.categoryA"), value: 100 },
        { id: "node-2", name: t("sampleData.categoryB"), value: 80 },
        { id: "node-3", name: t("sampleData.categoryC"), value: 60 },
        { id: "node-4", name: t("sampleData.categoryD"), value: 40 },
      ];
      isInitialized = true;
    }
  });

  // Functions
  function addNode(parentId?: string) {
    const newNode: TreemapNode = {
      id: generateId(),
      name: `${t("item")}${data.length + 1}`,
      value: 50,
    };

    if (!parentId) {
      data = [...data, newNode];
    } else {
      const addToParent = (nodes: TreemapNode[]): TreemapNode[] => {
        return nodes.map((node) => {
          if (node.id === parentId) {
            return {
              ...node,
              children: [...(node.children || []), newNode],
            };
          }
          if (node.children) {
            return { ...node, children: addToParent(node.children) };
          }
          return node;
        });
      };
      data = addToParent(data);
    }
  }
  function deleteNode(nodeId: string) {
    const removeNode = (nodes: TreemapNode[]): TreemapNode[] => {
      return nodes
        .filter((node) => node.id !== nodeId)
        .map((node) => ({
          ...node,
          children: node.children ? removeNode(node.children) : undefined,
        }));
    };
    const newData = removeNode(data);
    if (newData.length > 0) {
      data = newData;
    }
  }
  function updateNode(
    nodeId: string,
    field: "name" | "value",
    value: string | number,
  ) {
    const update = (nodes: TreemapNode[]): TreemapNode[] => {
      return nodes.map((node) => {
        if (node.id === nodeId) {
          return {
            ...node,
            [field]: field === "value" ? Number(value) || 0 : value,
          };
        }
        if (node.children) {
          return { ...node, children: update(node.children) };
        }
        return node;
      });
    };
    data = update(data);
  }
  function calculateTotal(nodes: TreemapNode[]): number {
    return nodes.reduce((sum, node) => {
      if (node.children && node.children.length > 0) {
        return sum + calculateTotal(node.children);
      }
      return sum + node.value;
    }, 0);
  }
  const total = calculateTotal(data);
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
    data = [
      {
        id: generateId(),
        name: t("sampleData.tech"),
        value: 0,
        children: [
          { id: generateId(), name: t("sampleData.software"), value: 150 },
          { id: generateId(), name: t("sampleData.hardware"), value: 100 },
          { id: generateId(), name: t("sampleData.services"), value: 80 },
        ],
      },
      {
        id: generateId(),
        name: t("sampleData.finance"),
        value: 0,
        children: [
          { id: generateId(), name: t("sampleData.banking"), value: 120 },
          { id: generateId(), name: t("sampleData.insurance"), value: 90 },
        ],
      },
      {
        id: generateId(),
        name: t("sampleData.healthcare"),
        value: 0,
        children: [
          { id: generateId(), name: t("sampleData.pharma"), value: 110 },
          { id: generateId(), name: t("sampleData.medical"), value: 70 },
        ],
      },
      { id: generateId(), name: t("sampleData.energy"), value: 130 },
    ];
    chartTitle = t("sampleTitle");
    leafDepth = 2;
  }
  function clearData() {
    if (confirm(t("confirmClear"))) {
      data = [{ id: generateId(), name: `${t("item")}1`, value: 100 }];
      chartTitle = t("chartTitle");
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
            <label
              for="{t('leafDepth')}: {leafDepth}"
              class="block text-sm font-medium mb-1"
              >{t("leafDepth")}: {leafDepth}</label
            >
            <input
              type="range"
              min="1"
              max="3"
              value={leafDepth}
              onchange={(e) =>
                (leafDepth = Number((e.target as HTMLInputElement).value))}
              class="w-full"
            />
          </div>

          <div class="flex flex-wrap gap-6 text-sm">
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
            <label
              class="flex items-center gap-2 cursor-pointer whitespace-nowrap"
            >
              <input
                type="checkbox"
                bind:checked={showBreadcrumb}
                class="w-4 h-4 accent-amber-500"
              />
              <span>{t("showBreadcrumb")}</span>
            </label>
          </div>
        </div>
      </div>

      <!-- 数据编辑 -->
      <div>
        <div class="flex justify-between items-center mb-2">
          <label class="text-sm font-medium">{t("dataEditor")}</label>
          <button onclick={() => addNode()} class="btn-secondary btn-sm">
            + {t("addNode")}
          </button>
        </div>

        <div
          class="bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-3 max-h-80 overflow-y-auto"
        >
          <div
            class="flex items-center gap-2 py-1 border-b border-gray-200 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400 font-medium"
          >
            <span class="flex-1">{t("nodeName")}</span>
            <span class="w-20">{t("value")}</span>
            <span class="w-12">%</span>
            <span class="w-12"></span>
          </div>
          {renderNodeList(data)}
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
    </ul>
  </div>
</div>
