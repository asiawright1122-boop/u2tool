<script lang="ts">
  import { calculateSummary } from '@/lib/tool-stubs';

  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['resource-allocation-planner'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.resource-allocation-planner.${key}`;
  }

  // Types
  interface Resource {
  id: string;
  name: string;
  role: string;
  availability: number; // hours per week
  cost: number; // per hour
}
  interface Project {
  id: string;
  name: string;
  requiredHours: number;
  priority: 'high' | 'medium' | 'low';
  assignedResources: { resourceId: string; hours: number }[];
}
  interface AllocationSummary {
  totalAvailable: number;
  totalAllocated: number;
  utilizationRate: number;
  totalCost: number;
  overallocated: string[];
  underutilized: string[];
}

  let resources = $state([
    { id: '1', name: 'Alice', role: 'Developer', availability: 40, cost: 75 },
    { id: '2', name: 'Bob', role: 'Developer', availability: 40, cost: 70 },
    { id: '3', name: 'Carol', role: 'Designer', availability: 32, cost: 65 },
    { id: '4', name: 'David', role: 'QA', availability: 40, cost: 55 },
  ]);

  let projects = $state([
    { id: '1', name: 'Project Alpha', requiredHours: 80, priority: 'high', assignedResources: [{ resourceId: '1', hours: 30 }, { resourceId: '2', hours: 20 }] },
    { id: '2', name: 'Project Beta', requiredHours: 60, priority: 'medium', assignedResources: [{ resourceId: '2', hours: 15 }, { resourceId: '3', hours: 20 }] },
  ]);

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
    resources = resources.map(r => r.id === id ? { ...r, [field]: value } : r);
  }

  function removeResource(id: string) {
    resources = resources.filter(r => r.id !== id);
    projects = projects.map(p => ({
      ...p,
      assignedResources: p.assignedResources.filter(ar => ar.resourceId !== id),
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
    projects = projects.map(p => p.id === id ? { ...p, [field]: value } : p);
  }

  function updateAllocation(projectId: string, resourceId: string, hours: number) {
    projects = projects.map(p => {
      if (p.id !== projectId) return p;
      const existing = p.assignedResources.find(ar => ar.resourceId === resourceId);
      if (hours === 0) {
        return { ...p, assignedResources: p.assignedResources.filter(ar => ar.resourceId !== resourceId) };
      }
      if (existing) {
        return { ...p, assignedResources: p.assignedResources.map(ar => ar.resourceId === resourceId ? { ...ar, hours } : ar) };
      }
      return { ...p, assignedResources: [...p.assignedResources, { resourceId, hours }] };
    });
  }

  let summary = $derived(calculateSummary(resources, projects));

  function getResourceAllocation(resourceId: string) {
    return projects.reduce((sum, p) => {
      const ar = p.assignedResources.find(a => a.resourceId === resourceId);
      return sum + (ar?.hours || 0);
    }, 0);
  }

</script>


                        <div class="flex items-center gap-1 text-xs">
                          <span class="w-16 truncate text-gray-600 dark:text-gray-400">{resource.name}</span>
                          <input
                            type="number"
                            value={ar?.hours || 0}
                            onchange={(e) => updateAllocation(project.id, resource.id, parseInt(e.target.value) || 0)}
                            min={0}
                            class="w-12 px-1 py-0.5 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                          />
                          <span class="text-gray-400">h</span>
                        </div>
                      
