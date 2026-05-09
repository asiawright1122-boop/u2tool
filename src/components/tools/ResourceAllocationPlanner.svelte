<script lang="ts">
  import { calculateSummary } from '@/lib/tool-stubs';

  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  function t(key: string): string {
    const scope = translations['tools']['resource-allocation-planner'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) value = (value as Record<string, unknown>)?.[k];
    return typeof value === 'string' ? value : `MISSING: tools.resource-allocation-planner.${key}`;
  }

  interface Resource {
    id: string;
    name: string;
    role: string;
    availability: number;
    cost: number;
  }

  interface Project {
    id: string;
    name: string;
    requiredHours: number;
    priority: 'high' | 'medium' | 'low';
    assignedResources: { resourceId: string; hours: number }[];
  }

  let resources = $state<Resource[]>([
    { id: '1', name: 'Alice', role: 'Developer', availability: 40, cost: 75 },
    { id: '2', name: 'Bob', role: 'Developer', availability: 40, cost: 70 },
    { id: '3', name: 'Carol', role: 'Designer', availability: 32, cost: 65 },
    { id: '4', name: 'David', role: 'QA', availability: 40, cost: 55 },
  ]);

  let projects = $state<Project[]>([
    { id: '1', name: 'Project Alpha', requiredHours: 80, priority: 'high', assignedResources: [{ resourceId: '1', hours: 30 }, { resourceId: '2', hours: 20 }] },
    { id: '2', name: 'Project Beta', requiredHours: 60, priority: 'medium', assignedResources: [{ resourceId: '2', hours: 15 }, { resourceId: '3', hours: 20 }] },
  ]);

  let summary = $derived(calculateSummary(resources, projects));

  function addResource() {
    resources = [...resources, {
      id: Date.now().toString(),
      name: `${t('resourceDefault')} ${resources.length + 1}`,
      role: 'Developer',
      availability: 40,
      cost: 60,
    }];
  }

  function updateResource(id: string, field: keyof Resource, value: string | number) {
    resources = resources.map(resource => resource.id === id ? { ...resource, [field]: value } : resource);
  }

  function removeResource(id: string) {
    resources = resources.filter(resource => resource.id !== id);
    projects = projects.map(project => ({
      ...project,
      assignedResources: project.assignedResources.filter(allocation => allocation.resourceId !== id),
    }));
  }

  function addProject() {
    projects = [...projects, {
      id: Date.now().toString(),
      name: `${t('projectDefault')} ${projects.length + 1}`,
      requiredHours: 40,
      priority: 'medium',
      assignedResources: [],
    }];
  }

  function updateProject(id: string, field: keyof Project, value: unknown) {
    projects = projects.map(project => project.id === id ? { ...project, [field]: value } : project);
  }

  function removeProject(id: string) {
    projects = projects.filter(project => project.id !== id);
  }

  function updateAllocation(projectId: string, resourceId: string, hours: number) {
    projects = projects.map(project => {
      if (project.id !== projectId) return project;
      const existing = project.assignedResources.find(allocation => allocation.resourceId === resourceId);
      if (hours <= 0) {
        return { ...project, assignedResources: project.assignedResources.filter(allocation => allocation.resourceId !== resourceId) };
      }
      if (existing) {
        return {
          ...project,
          assignedResources: project.assignedResources.map(allocation =>
            allocation.resourceId === resourceId ? { ...allocation, hours } : allocation
          ),
        };
      }
      return { ...project, assignedResources: [...project.assignedResources, { resourceId, hours }] };
    });
  }

  function getResourceAllocation(resourceId: string) {
    return projects.reduce((sum, project) => {
      const allocation = project.assignedResources.find(item => item.resourceId === resourceId);
      return sum + (allocation?.hours || 0);
    }, 0);
  }
</script>

<div class="space-y-6">
  <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
    <div class="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
      <p class="text-xs text-gray-500">{t('available')}</p>
      <p class="text-xl font-bold text-gray-900 dark:text-white">{summary.totalAvailable}h</p>
    </div>
    <div class="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
      <p class="text-xs text-gray-500">{t('allocated')}</p>
      <p class="text-xl font-bold text-gray-900 dark:text-white">{summary.totalAllocated}h</p>
    </div>
    <div class="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
      <p class="text-xs text-gray-500">{t('utilization')}</p>
      <p class="text-xl font-bold text-gray-900 dark:text-white">{summary.utilizationRate}%</p>
    </div>
    <div class="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
      <p class="text-xs text-gray-500">{t('weeklyCost')}</p>
      <p class="text-xl font-bold text-gray-900 dark:text-white">${summary.totalCost.toLocaleString()}</p>
    </div>
  </div>

  <section class="space-y-3">
    <div class="flex items-center justify-between gap-3">
      <h3 class="font-medium text-gray-900 dark:text-white">{t('resources')}</h3>
      <button onclick={addResource} class="btn-secondary text-sm">{t('add')}</button>
    </div>

    <div class="space-y-2">
      {#each resources as resource (resource.id)}
        {@const allocated = getResourceAllocation(resource.id)}
        {@const overloaded = allocated > resource.availability}
        <div class={`grid grid-cols-1 md:grid-cols-[1fr_1fr_100px_100px_80px_32px] gap-2 items-center p-3 rounded-lg ${overloaded ? 'bg-red-50 dark:bg-red-900/20' : 'bg-gray-50 dark:bg-gray-900'}`}>
          <input
            aria-label={t('resources')}
            type="text"
            value={resource.name}
            onchange={(e) => updateResource(resource.id, 'name', e.currentTarget.value)}
            class="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
          <input
            aria-label="Role"
            type="text"
            value={resource.role}
            onchange={(e) => updateResource(resource.id, 'role', e.currentTarget.value)}
            class="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
          <input
            aria-label={t('avail')}
            type="number"
            value={resource.availability}
            onchange={(e) => updateResource(resource.id, 'availability', parseInt(e.currentTarget.value, 10) || 0)}
            class="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
          <input
            aria-label={t('perHour')}
            type="number"
            value={resource.cost}
            onchange={(e) => updateResource(resource.id, 'cost', parseFloat(e.currentTarget.value) || 0)}
            class="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
          <span class={`text-sm font-medium ${overloaded ? 'text-red-600' : 'text-gray-600 dark:text-gray-400'}`}>
            {allocated}/{resource.availability}h
          </span>
          <button onclick={() => removeResource(resource.id)} class="text-red-500 hover:text-red-700" aria-label={t('remove')}>x</button>
        </div>
      {/each}
    </div>
  </section>

  <section class="space-y-3">
    <div class="flex items-center justify-between gap-3">
      <h3 class="font-medium text-gray-900 dark:text-white">{t('projects')}</h3>
      <button onclick={addProject} class="btn-primary text-sm">{t('add')}</button>
    </div>

    <div class="space-y-4">
      {#each projects as project (project.id)}
        <div class="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg space-y-3">
          <div class="grid grid-cols-1 md:grid-cols-[1fr_120px_120px_32px] gap-2 items-center">
            <input
              aria-label={t('projects')}
              type="text"
              value={project.name}
              onchange={(e) => updateProject(project.id, 'name', e.currentTarget.value)}
              class="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
            <input
              aria-label={t('required')}
              type="number"
              value={project.requiredHours}
              onchange={(e) => updateProject(project.id, 'requiredHours', parseInt(e.currentTarget.value, 10) || 0)}
              class="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
            <select
              aria-label="Priority"
              value={project.priority}
              onchange={(e) => updateProject(project.id, 'priority', e.currentTarget.value)}
              class="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="high">{t('high')}</option>
              <option value="medium">{t('medium')}</option>
              <option value="low">{t('low')}</option>
            </select>
            <button onclick={() => removeProject(project.id)} class="text-red-500 hover:text-red-700" aria-label={t('remove')}>x</button>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
            {#each resources as resource (resource.id)}
              {@const allocation = project.assignedResources.find(item => item.resourceId === resource.id)}
              <label class="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                <span class="w-20 truncate">{resource.name}</span>
                <input
                  type="number"
                  value={allocation?.hours || 0}
                  onchange={(e) => updateAllocation(project.id, resource.id, parseInt(e.currentTarget.value, 10) || 0)}
                  min={0}
                  class="w-16 px-1 py-0.5 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
                <span>h</span>
              </label>
            {/each}
          </div>
        </div>
      {/each}
    </div>
  </section>
</div>
