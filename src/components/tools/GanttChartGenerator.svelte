<script lang="ts">
  import type { EChartsOption } from 'echarts';

  import { useChartTheme } from '@/hooks/useChartTheme';
  import {
    calculateCriticalPath,
    clearGanttProject,
    createGanttTemplate,
    ganttTasksFromCsv,
    ganttTasksFromJson,
    ganttTasksToCsv,
    ganttTasksToJson,
    readGanttProject,
    writeGanttProject,
    type GanttTask,
    type GanttTemplateId,
  } from '@/lib/gantt-chart';
  import { createGeneralTranslator, createToolTranslator } from '@/lib/translation-helper';

  import EChartsWrapper, { type EChartsWrapperRef } from './EChartsWrapper.svelte';

  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { translations }: Props = $props();

  const t = createToolTranslator(translations, 'gantt-chart-generator');
  const tg = createGeneralTranslator(translations);
  const chartTheme = useChartTheme();
  const dayMs = 24 * 60 * 60 * 1000;
  const colorThemes = {
    default: ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de'],
    ocean: ['#0077b6', '#00b4d8', '#90e0ef', '#48cae4', '#023e8a'],
    sunset: ['#ff6b6b', '#feca57', '#ff9ff3', '#54a0ff', '#5f27cd'],
    forest: ['#2d6a4f', '#40916c', '#52b788', '#74c69d', '#95d5b2'],
  } as const;

  let tasks = $state<GanttTask[]>([]);
  let chartTitle = $state('');
  let colorTheme = $state<keyof typeof colorThemes>('default');
  let selectedTemplate = $state<GanttTemplateId>('software-release');
  let isInitialized = $state(false);
  let idCounter = $state(100);
  let feedback = $state('');
  let errorMessage = $state('');
  let chartRef = $state<EChartsWrapperRef | null>(null);
  let jsonInput = $state<HTMLInputElement | null>(null);
  let csvInput = $state<HTMLInputElement | null>(null);

  const criticalPath = $derived(calculateCriticalPath(tasks));
  const criticalTaskIds = $derived(new Set(criticalPath.taskIds));

  function formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  function addDays(date: Date, days: number): Date {
    const next = new Date(date);
    next.setDate(next.getDate() + days);
    return next;
  }

  function templateNames(): Record<string, string> {
    return {
      'release-plan': t('templateTaskReleasePlan'),
      'release-build': t('templateTaskReleaseBuild'),
      'release-test': t('templateTaskReleaseTest'),
      'release-launch': t('templateTaskReleaseLaunch'),
      'campaign-brief': t('templateTaskCampaignBrief'),
      'campaign-create': t('templateTaskCampaignCreate'),
      'campaign-launch': t('templateTaskCampaignLaunch'),
      'event-scope': t('templateTaskEventScope'),
      'event-logistics': t('templateTaskEventLogistics'),
      'event-rehearsal': t('templateTaskEventRehearsal'),
      'event-day': t('templateTaskEventDay'),
    };
  }

  $effect(() => {
    if (isInitialized) return;
    chartTitle = t('defaultTitle');
    tasks = createGanttTemplate('software-release', formatDate(new Date()), templateNames());
    isInitialized = true;
  });

  function generateId(): string {
    idCounter += 1;
    return `gantt-task-${Date.now().toString(36)}-${idCounter}`;
  }

  function parseDate(date: string): number {
    return new Date(`${date}T00:00:00Z`).getTime();
  }

  function getChartOption(): EChartsOption {
    const colors = colorThemes[colorTheme];
    const chartTasks = [...tasks].reverse();
    const categories = chartTasks.map((task) => task.name);
    const data = chartTasks.map((task, index) => {
      const start = parseDate(task.startDate);
      const end = task.milestone ? start : parseDate(task.endDate) + dayMs;
      const isCritical = criticalTaskIds.has(task.id);

      return {
        name: task.name,
        value: [index, start, end, task.progress, task.milestone ? 1 : 0],
        itemStyle: {
          color: isCritical ? '#dc2626' : colors[index % colors.length],
          borderColor: isCritical ? '#991b1b' : 'transparent',
          borderWidth: isCritical ? 2 : 0,
        },
      };
    });
    const timestamps = chartTasks
      .flatMap((task) => [parseDate(task.startDate), parseDate(task.endDate)])
      .filter(Number.isFinite);
    const now = Date.now();
    const axisMin = (timestamps.length ? Math.min(...timestamps) : now) - dayMs * 2;
    const axisMax = (timestamps.length ? Math.max(...timestamps) : now + dayMs) + dayMs * 3;

    function renderItem(_params: unknown, api: any) {
      const categoryIndex = api.value(0);
      const startPoint = api.coord([api.value(1), categoryIndex]);
      const endPoint = api.coord([api.value(2), categoryIndex]);
      if (!startPoint || !endPoint || !Number.isFinite(startPoint[0]) || !Number.isFinite(endPoint[0])) {
        return undefined;
      }

      const height = api.size([0, 1])[1] * 0.58;
      const style = api.style();
      if (api.value(4) === 1) {
        const radius = Math.max(7, Math.min(13, height * 0.42));
        return {
          type: 'polygon',
          shape: {
            points: [
              [startPoint[0], startPoint[1] - radius],
              [startPoint[0] + radius, startPoint[1]],
              [startPoint[0], startPoint[1] + radius],
              [startPoint[0] - radius, startPoint[1]],
            ],
          },
          style,
        };
      }

      const width = Math.max(endPoint[0] - startPoint[0], 12);
      const progressWidth = width * (Math.max(0, Math.min(100, api.value(3))) / 100);
      const y = startPoint[1] - height / 2;
      return {
        type: 'group',
        children: [
          {
            type: 'rect',
            shape: { x: startPoint[0], y, width, height, r: 4 },
            style: { ...style, opacity: 0.25 },
          },
          {
            type: 'rect',
            shape: { x: startPoint[0], y, width: progressWidth, height, r: 4 },
            style,
          },
        ],
      };
    }

    return {
      backgroundColor: chartTheme.backgroundColor,
      title: {
        text: chartTitle,
        left: 'center',
        textStyle: { color: chartTheme.textColor, fontSize: 18, fontWeight: 'bold' },
      },
      tooltip: {
        formatter: (params: any) => {
          const task = chartTasks[params.dataIndex];
          if (!task) return '';
          const dependencyNames = task.dependencyIds
            .map((id) => tasks.find((candidate) => candidate.id === id)?.name ?? id)
            .join(', ');
          return [
            `${params.marker} <b>${task.name}</b>`,
            `${t('start')}: ${task.startDate}`,
            `${t('end')}: ${task.endDate}`,
            `${t('progress')}: ${task.progress}%`,
            task.milestone ? t('milestone') : '',
            dependencyNames ? `${t('dependencies')}: ${dependencyNames}` : '',
          ].filter(Boolean).join('<br/>');
        },
      },
      grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
      xAxis: {
        type: 'value',
        min: axisMin,
        max: axisMax,
        axisLabel: {
          color: chartTheme.axisLabelColor,
          formatter: (value: number) => new Date(value).toISOString().slice(0, 10),
          hideOverlap: true,
        },
        splitLine: {
          show: true,
          lineStyle: { color: chartTheme.splitLineColor, type: 'dashed', opacity: 0.3 },
        },
      },
      yAxis: {
        type: 'category',
        data: categories,
        axisLabel: { color: chartTheme.axisLabelColor },
        axisLine: { show: true, lineStyle: { color: chartTheme.axisLineColor } },
      },
      series: [{ type: 'custom', renderItem, encode: { x: [1, 2], y: 0 }, data }],
    };
  }

  function addTask(): void {
    const today = new Date();
    tasks = [
      ...tasks,
      {
        id: generateId(),
        name: `${t('newTask')} ${tasks.length + 1}`,
        startDate: formatDate(today),
        endDate: formatDate(addDays(today, 5)),
        progress: 0,
        milestone: false,
        dependencyIds: [],
      },
    ];
    clearMessages();
  }

  function removeTask(taskId: string): void {
    tasks = tasks
      .filter((task) => task.id !== taskId)
      .map((task) => ({
        ...task,
        dependencyIds: task.dependencyIds.filter((id) => id !== taskId),
      }));
    clearMessages();
  }

  function updateTask<K extends keyof GanttTask>(taskId: string, field: K, value: GanttTask[K]): void {
    tasks = tasks.map((task) => task.id === taskId ? { ...task, [field]: value } : task);
    clearMessages();
  }

  function updateDependencies(taskId: string, select: HTMLSelectElement): void {
    updateTask(
      taskId,
      'dependencyIds',
      Array.from(select.selectedOptions, (option) => option.value),
    );
  }

  function clearMessages(): void {
    feedback = '';
    errorMessage = '';
  }

  function exportChart(format: 'png' | 'svg'): void {
    const chart = chartRef?.getEchartsInstance?.();
    if (!chart) {
      errorMessage = t('chartNotReady');
      return;
    }
    const link = document.createElement('a');
    link.href = chart.getDataURL({ type: format, pixelRatio: 2, backgroundColor: chartTheme.backgroundColor });
    link.download = `gantt-chart.${format}`;
    link.click();
  }

  function downloadProject(format: 'json' | 'csv'): void {
    const contents = format === 'json' ? ganttTasksToJson(tasks) : ganttTasksToCsv(tasks);
    const blob = new Blob([contents], { type: format === 'json' ? 'application/json' : 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `gantt-project.${format}`;
    link.click();
    URL.revokeObjectURL(url);
    feedback = t('projectExported');
    errorMessage = '';
  }

  async function importProject(file: File | undefined, format: 'json' | 'csv'): Promise<void> {
    if (!file) return;
    try {
      const input = await file.text();
      tasks = format === 'json' ? ganttTasksFromJson(input) : ganttTasksFromCsv(input);
      feedback = t('projectImported');
      errorMessage = '';
    } catch (error) {
      errorMessage = `${t('importError')} ${error instanceof Error ? error.message : ''}`.trim();
      feedback = '';
    } finally {
      if (format === 'json' && jsonInput) jsonInput.value = '';
      if (format === 'csv' && csvInput) csvInput.value = '';
    }
  }

  function saveProject(): void {
    writeGanttProject(window.localStorage, tasks);
    feedback = t('projectSaved');
    errorMessage = '';
  }

  function restoreProject(): void {
    const restored = readGanttProject(window.localStorage);
    if (restored.length === 0) {
      errorMessage = t('noSavedProject');
      feedback = '';
      return;
    }
    tasks = restored;
    feedback = t('projectRestored');
    errorMessage = '';
  }

  function clearSavedProject(): void {
    clearGanttProject(window.localStorage);
    feedback = t('savedProjectCleared');
    errorMessage = '';
  }

  function applyTemplate(): void {
    tasks = createGanttTemplate(selectedTemplate, formatDate(new Date()), templateNames());
    feedback = t('templateApplied');
    errorMessage = '';
  }

  function clearCurrentProject(): void {
    if (window.confirm(t('confirmClear'))) {
      tasks = [];
      feedback = t('projectCleared');
      errorMessage = '';
    }
  }
</script>

<div class="space-y-5" data-gantt-project-editor>
  <section class="toolbar" aria-label={t('projectActions')}>
    <div class="toolbar-group">
      <button type="button" onclick={() => exportChart('png')} class="btn-secondary">{t('downloadPng')}</button>
      <button type="button" onclick={() => exportChart('svg')} class="btn-secondary">{t('downloadSvg')}</button>
    </div>
    <div class="toolbar-group">
      <button type="button" onclick={() => downloadProject('json')} class="btn-secondary">{t('exportJson')}</button>
      <button type="button" onclick={() => downloadProject('csv')} class="btn-secondary">{t('exportCsv')}</button>
      <button type="button" onclick={() => jsonInput?.click()} class="btn-secondary">{t('importJson')}</button>
      <button type="button" onclick={() => csvInput?.click()} class="btn-secondary">{t('importCsv')}</button>
      <input bind:this={jsonInput} type="file" accept=".json,application/json" class="sr-only" aria-label={t('importJson')} onchange={(event) => importProject(event.currentTarget.files?.[0], 'json')} />
      <input bind:this={csvInput} type="file" accept=".csv,text/csv" class="sr-only" aria-label={t('importCsv')} onchange={(event) => importProject(event.currentTarget.files?.[0], 'csv')} />
    </div>
    <div class="toolbar-group">
      <button type="button" onclick={saveProject} class="btn-secondary">{t('saveLocal')}</button>
      <button type="button" onclick={restoreProject} class="btn-secondary">{t('restoreLocal')}</button>
      <button type="button" onclick={clearSavedProject} class="btn-secondary">{t('clearSaved')}</button>
      <button type="button" onclick={clearCurrentProject} class="btn-secondary danger-button">{tg('clear')}</button>
    </div>
  </section>

  {#if feedback}
    <p class="status-message" role="status">{feedback}</p>
  {/if}
  {#if errorMessage}
    <p class="error-message" role="alert">{errorMessage}</p>
  {/if}

  <div class="grid grid-cols-1 gap-6 xl:grid-cols-2">
    <div class="space-y-5">
      <section aria-labelledby="gantt-settings-heading">
        <h2 id="gantt-settings-heading" class="section-heading">{t('chartSettings')}</h2>
        <div class="settings-panel">
          <div>
            <label for="gantt-chart-title" class="control-label">{t('chartTitle')}</label>
            <input id="gantt-chart-title" type="text" bind:value={chartTitle} class="tool-input" placeholder={t('chartTitlePlaceholder')} />
          </div>
          <div>
            <label for="gantt-color-theme" class="control-label">{t('colorTheme')}</label>
            <select id="gantt-color-theme" bind:value={colorTheme} class="tool-input">
              <option value="default">{t('themeDefault')}</option>
              <option value="ocean">{t('themeOcean')}</option>
              <option value="sunset">{t('themeSunset')}</option>
              <option value="forest">{t('themeForest')}</option>
            </select>
          </div>
          <div>
            <label for="gantt-template" class="control-label">{t('projectTemplate')}</label>
            <div class="template-controls">
              <select id="gantt-template" bind:value={selectedTemplate} class="tool-input">
                <option value="software-release">{t('templateSoftwareRelease')}</option>
                <option value="marketing-campaign">{t('templateMarketingCampaign')}</option>
                <option value="event-preparation">{t('templateEventPreparation')}</option>
              </select>
              <button type="button" onclick={applyTemplate} class="btn-secondary">{t('applyTemplate')}</button>
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="gantt-tasks-heading">
        <div class="section-title-row">
          <h2 id="gantt-tasks-heading" class="section-heading">{t('dataEditor')}</h2>
          <button type="button" onclick={addTask} class="btn-secondary btn-sm">+ {t('addTask')}</button>
        </div>

        <div class="task-editor">
          <div class="task-table" role="table" aria-label={t('dataEditor')}>
            <div class="task-row task-header" role="row">
              <span role="columnheader">{t('taskName')}</span>
              <span role="columnheader">{t('start')}</span>
              <span role="columnheader">{t('end')}</span>
              <span role="columnheader">{t('progress')} %</span>
              <span role="columnheader">{t('milestone')}</span>
              <span role="columnheader">{t('dependencies')}</span>
              <span role="columnheader" class="sr-only">{t('removeTask')}</span>
            </div>
            {#each tasks as task (task.id)}
              <div class:critical-task={criticalTaskIds.has(task.id)} class="task-row" role="row" data-critical-task={criticalTaskIds.has(task.id) ? 'true' : 'false'}>
                <input aria-label={`${t('taskName')}: ${task.name}`} type="text" value={task.name} onchange={(event) => updateTask(task.id, 'name', event.currentTarget.value)} class="compact-input" />
                <input aria-label={`${t('start')}: ${task.name}`} type="date" value={task.startDate} onchange={(event) => updateTask(task.id, 'startDate', event.currentTarget.value)} class="compact-input" />
                <input aria-label={`${t('end')}: ${task.name}`} type="date" value={task.endDate} onchange={(event) => updateTask(task.id, 'endDate', event.currentTarget.value)} class="compact-input" />
                <input aria-label={`${t('progress')}: ${task.name}`} type="number" min="0" max="100" value={task.progress} onchange={(event) => updateTask(task.id, 'progress', Number(event.currentTarget.value) || 0)} class="compact-input" />
                <label class="milestone-control">
                  <input type="checkbox" checked={task.milestone} onchange={(event) => updateTask(task.id, 'milestone', event.currentTarget.checked)} />
                  <span>{t('milestone')}</span>
                </label>
                <select multiple value={task.dependencyIds} aria-label={`${t('dependencies')}: ${task.name}`} onchange={(event) => updateDependencies(task.id, event.currentTarget)} class="compact-input dependency-select">
                  {#each tasks.filter((candidate) => candidate.id !== task.id) as candidate (candidate.id)}
                    <option value={candidate.id}>{candidate.name}</option>
                  {/each}
                </select>
                <button type="button" onclick={() => removeTask(task.id)} class="remove-button" aria-label={`${t('removeTask')}: ${task.name}`}>×</button>
              </div>
            {:else}
              <div class="empty-state" role="row">{t('noTasks')}</div>
            {/each}
          </div>
        </div>
      </section>
    </div>

    <section aria-labelledby="gantt-preview-heading">
      <div class="section-title-row">
        <h2 id="gantt-preview-heading" class="section-heading">{t('chartPreview')}</h2>
        {#if criticalPath.taskIds.length > 0}
          <span class="critical-summary" data-critical-path-summary>{t('criticalPath')}: {criticalPath.totalDays} {t('days')}</span>
        {/if}
      </div>
      {#if criticalPath.warnings.length > 0}
        <div class="warning-message" role="alert">
          <strong>{t('projectWarnings')}</strong>
          <ul>
            {#each criticalPath.warnings as warning}
              <li>{warning}</li>
            {/each}
          </ul>
        </div>
      {/if}
      <div class="chart-frame">
        <EChartsWrapper bind:this={chartRef} option={getChartOption} style="height: 500px; width: 100%" notMerge={true} lazyUpdate={true} />
      </div>
      <p class="critical-note"><span aria-hidden="true" class="critical-swatch"></span>{t('criticalPathHelp')}</p>
    </section>
  </div>

  <aside class="privacy-note">
    <strong>{t('localOnlyTitle')}</strong>
    <span>{t('localOnlyDescription')}</span>
  </aside>
</div>

<style>
  .toolbar,
  .toolbar-group,
  .section-title-row,
  .template-controls,
  .milestone-control,
  .critical-note,
  .privacy-note {
    display: flex;
    align-items: center;
  }

  .toolbar {
    flex-wrap: wrap;
    gap: 0.75rem 1rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid rgb(209 213 219);
  }

  :global(.dark) .toolbar { border-color: rgb(55 65 81); }
  .toolbar-group { flex-wrap: wrap; gap: 0.5rem; }
  .danger-button { color: rgb(185 28 28); }
  :global(.dark) .danger-button { color: rgb(252 165 165); }

  .section-heading {
    margin: 0 0 0.5rem;
    font-size: 0.875rem;
    font-weight: 650;
    color: rgb(31 41 55);
  }

  :global(.dark) .section-heading { color: rgb(243 244 246); }
  .section-title-row { justify-content: space-between; gap: 1rem; margin-bottom: 0.5rem; }
  .section-title-row .section-heading { margin: 0; }

  .settings-panel,
  .task-editor {
    border: 1px solid rgb(209 213 219);
    border-radius: 0.75rem;
    background: rgb(249 250 251);
  }

  :global(.dark) .settings-panel,
  :global(.dark) .task-editor {
    border-color: rgb(55 65 81);
    background: rgb(17 24 39);
  }

  .settings-panel { display: grid; gap: 0.85rem; padding: 1rem; }
  .control-label { display: block; margin-bottom: 0.3rem; font-size: 0.8125rem; font-weight: 600; }
  .template-controls { align-items: stretch; gap: 0.5rem; }
  .template-controls select { flex: 1; }
  .task-editor { max-height: 620px; overflow: auto; padding: 0.75rem; }
  .task-table { min-width: 900px; }
  .task-row {
    display: grid;
    grid-template-columns: minmax(150px, 1.4fr) 130px 130px 86px 100px minmax(180px, 1.2fr) 38px;
    align-items: center;
    gap: 0.5rem;
    padding: 0.35rem;
    border-radius: 0.5rem;
  }

  .task-row + .task-row { margin-top: 0.35rem; }
  .task-header { color: rgb(75 85 99); font-size: 0.75rem; font-weight: 600; }
  :global(.dark) .task-header { color: rgb(209 213 219); }
  .task-row.critical-task { background: rgb(254 242 242); }
  :global(.dark) .task-row.critical-task { background: rgb(69 10 10 / 0.45); }

  .compact-input {
    width: 100%;
    min-height: 2.25rem;
    border: 1px solid rgb(209 213 219);
    border-radius: 0.375rem;
    background: white;
    padding: 0.35rem 0.5rem;
    color: rgb(17 24 39);
    font-size: 0.8125rem;
  }

  .compact-input:focus-visible,
  .remove-button:focus-visible {
    outline: 2px solid rgb(37 99 235);
    outline-offset: 2px;
  }

  :global(.dark) .compact-input {
    border-color: rgb(75 85 99);
    background: rgb(31 41 55);
    color: rgb(243 244 246);
  }

  .dependency-select { min-height: 3.4rem; }
  .milestone-control { gap: 0.4rem; font-size: 0.75rem; }
  .milestone-control input { width: 1rem; height: 1rem; }
  .remove-button { color: rgb(185 28 28); font-size: 1.35rem; line-height: 1; border-radius: 0.25rem; }
  :global(.dark) .remove-button { color: rgb(252 165 165); }
  .empty-state { padding: 2rem; color: rgb(75 85 99); text-align: center; }
  :global(.dark) .empty-state { color: rgb(209 213 219); }

  .chart-frame {
    min-height: 500px;
    overflow: hidden;
    border: 1px solid rgb(209 213 219);
    border-radius: 0.75rem;
  }

  :global(.dark) .chart-frame { border-color: rgb(55 65 81); }
  .critical-summary { color: rgb(185 28 28); font-size: 0.8125rem; font-weight: 650; }
  :global(.dark) .critical-summary { color: rgb(252 165 165); }
  .critical-note { gap: 0.45rem; margin-top: 0.65rem; color: rgb(75 85 99); font-size: 0.8125rem; }
  :global(.dark) .critical-note { color: rgb(209 213 219); }
  .critical-swatch { width: 0.85rem; height: 0.85rem; border-radius: 0.2rem; background: rgb(220 38 38); }

  .status-message,
  .error-message,
  .warning-message,
  .privacy-note {
    border-radius: 0.5rem;
    padding: 0.75rem 0.9rem;
    font-size: 0.875rem;
  }

  .status-message { background: rgb(240 253 244); color: rgb(22 101 52); }
  .error-message,
  .warning-message { background: rgb(254 242 242); color: rgb(153 27 27); }
  .warning-message { margin-bottom: 0.75rem; }
  .warning-message ul { margin: 0.35rem 0 0; padding-inline-start: 1.25rem; list-style: disc; }
  :global(.dark) .status-message { background: rgb(20 83 45 / 0.45); color: rgb(187 247 208); }
  :global(.dark) .error-message,
  :global(.dark) .warning-message { background: rgb(69 10 10 / 0.55); color: rgb(254 202 202); }

  .privacy-note {
    align-items: flex-start;
    gap: 0.45rem 0.8rem;
    flex-wrap: wrap;
    background: rgb(239 246 255);
    color: rgb(30 64 175);
  }

  :global(.dark) .privacy-note { background: rgb(30 58 138 / 0.35); color: rgb(191 219 254); }

  @media (max-width: 640px) {
    .toolbar { align-items: stretch; }
    .toolbar-group { width: 100%; }
    .toolbar-group :global(button) { flex: 1 1 auto; }
    .template-controls { flex-direction: column; }
    .section-title-row { align-items: flex-start; flex-direction: column; gap: 0.4rem; }
  }
</style>
