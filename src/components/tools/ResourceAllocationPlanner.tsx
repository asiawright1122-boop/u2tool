'use client';

import { useState, useCallback, useMemo } from 'react';
import { useTranslations } from 'next-intl';

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

function calculateSummary(resources: Resource[], projects: Project[]): AllocationSummary {
  const totalAvailable = resources.reduce((sum, r) => sum + r.availability, 0);
  
  const resourceAllocation: Record<string, number> = {};
  resources.forEach(r => { resourceAllocation[r.id] = 0; });
  
  let totalCost = 0;
  projects.forEach(project => {
    project.assignedResources.forEach(ar => {
      resourceAllocation[ar.resourceId] = (resourceAllocation[ar.resourceId] || 0) + ar.hours;
      const resource = resources.find(r => r.id === ar.resourceId);
      if (resource) {
        totalCost += ar.hours * resource.cost;
      }
    });
  });
  
  const totalAllocated = Object.values(resourceAllocation).reduce((a, b) => a + b, 0);
  
  const overallocated: string[] = [];
  const underutilized: string[] = [];
  
  resources.forEach(r => {
    const allocated = resourceAllocation[r.id] || 0;
    if (allocated > r.availability) {
      overallocated.push(r.name);
    } else if (allocated < r.availability * 0.5) {
      underutilized.push(r.name);
    }
  });
  
  return {
    totalAvailable,
    totalAllocated,
    utilizationRate: totalAvailable > 0 ? Math.round((totalAllocated / totalAvailable) * 100) : 0,
    totalCost,
    overallocated,
    underutilized,
  };
}

export default function ResourceAllocationPlanner() {
  const t = useTranslations('tools.resource-allocation-planner');
  const [resources, setResources] = useState<Resource[]>([
    { id: '1', name: 'Alice', role: 'Developer', availability: 40, cost: 75 },
    { id: '2', name: 'Bob', role: 'Developer', availability: 40, cost: 70 },
    { id: '3', name: 'Carol', role: 'Designer', availability: 32, cost: 65 },
    { id: '4', name: 'David', role: 'QA', availability: 40, cost: 55 },
  ]);
  
  const [projects, setProjects] = useState<Project[]>([
    { id: '1', name: 'Project Alpha', requiredHours: 80, priority: 'high', assignedResources: [{ resourceId: '1', hours: 30 }, { resourceId: '2', hours: 20 }] },
    { id: '2', name: 'Project Beta', requiredHours: 60, priority: 'medium', assignedResources: [{ resourceId: '2', hours: 15 }, { resourceId: '3', hours: 20 }] },
  ]);

  const addResource = useCallback(() => {
    setResources(prev => [...prev, {
      id: Date.now().toString(),
      name: `${t('resourceDefault')} ${prev.length + 1}`,
      role: 'Developer',
      availability: 40,
      cost: 60,
    }]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateResource = useCallback((id: string, field: keyof Resource, value: string | number) => {
    setResources(prev => prev.map(r => r.id === id ? { ...r, [field]: value } : r));
  }, []);

  const removeResource = useCallback((id: string) => {
    setResources(prev => prev.filter(r => r.id !== id));
    setProjects(prev => prev.map(p => ({
      ...p,
      assignedResources: p.assignedResources.filter(ar => ar.resourceId !== id),
    })));
  }, []);

  const addProject = useCallback(() => {
    setProjects(prev => [...prev, {
      id: Date.now().toString(),
      name: `${t('projectDefault')} ${prev.length + 1}`,
      requiredHours: 40,
      priority: 'medium',
      assignedResources: [],
    }]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateProject = useCallback((id: string, field: keyof Project, value: unknown) => {
    setProjects(prev => prev.map(p => p.id === id ? { ...p, [field]: value } : p));
  }, []);

  const updateAllocation = useCallback((projectId: string, resourceId: string, hours: number) => {
    setProjects(prev => prev.map(p => {
      if (p.id !== projectId) return p;
      const existing = p.assignedResources.find(ar => ar.resourceId === resourceId);
      if (hours === 0) {
        return { ...p, assignedResources: p.assignedResources.filter(ar => ar.resourceId !== resourceId) };
      }
      if (existing) {
        return { ...p, assignedResources: p.assignedResources.map(ar => ar.resourceId === resourceId ? { ...ar, hours } : ar) };
      }
      return { ...p, assignedResources: [...p.assignedResources, { resourceId, hours }] };
    }));
  }, []);

  const summary = useMemo(() => calculateSummary(resources, projects), [resources, projects]);

  const getResourceAllocation = useCallback((resourceId: string) => {
    return projects.reduce((sum, p) => {
      const ar = p.assignedResources.find(a => a.resourceId === resourceId);
      return sum + (ar?.hours || 0);
    }, 0);
  }, [projects]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-center">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{summary.totalAvailable}h</div>
          <div className="text-sm text-blue-700 dark:text-blue-300">{t('available')}</div>
        </div>
        <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg text-center">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">{summary.totalAllocated}h</div>
          <div className="text-sm text-green-700 dark:text-green-300">{t('allocated')}</div>
        </div>
        <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-center">
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{summary.utilizationRate}%</div>
          <div className="text-sm text-purple-700 dark:text-purple-300">{t('utilization')}</div>
        </div>
        <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg text-center">
          <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">${summary.totalCost.toLocaleString()}</div>
          <div className="text-sm text-orange-700 dark:text-orange-300">{t('weeklyCost')}</div>
        </div>
      </div>

      {(summary.overallocated.length > 0 || summary.underutilized.length > 0) && (
        <div className="flex gap-4">
          {summary.overallocated.length > 0 && (
            <div className="flex-1 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <span className="text-sm text-red-700 dark:text-red-300">⚠️ {t('overallocated')}: {summary.overallocated.join(', ')}</span>
            </div>
          )}
          {summary.underutilized.length > 0 && (
            <div className="flex-1 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <span className="text-sm text-yellow-700 dark:text-yellow-300">💡 {t('underutilized')}: {summary.underutilized.join(', ')}</span>
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('resources')}</h3>
            <button onClick={addResource} className="text-xs px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700">{t('add')}</button>
          </div>
          <div className="space-y-2">
            {resources.map(resource => {
              const allocated = getResourceAllocation(resource.id);
              const utilization = Math.round((allocated / resource.availability) * 100);
              return (
                <div key={resource.id} className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={resource.name}
                      onChange={(e) => updateResource(resource.id, 'name', e.target.value)}
                      className="flex-1 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                    <input
                      type="text"
                      value={resource.role}
                      onChange={(e) => updateResource(resource.id, 'role', e.target.value)}
                      className="w-24 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                    <button onClick={() => removeResource(resource.id)} className="text-red-500 hover:text-red-700">✕</button>
                  </div>
                  <div className="flex gap-2 items-center text-xs">
                    <span className="text-gray-500">{t('avail')}:</span>
                    <input
                      type="number"
                      value={resource.availability}
                      onChange={(e) => updateResource(resource.id, 'availability', parseInt(e.target.value) || 0)}
                      className="w-14 px-1 py-0.5 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                    <span className="text-gray-500">{t('perHour')}:</span>
                    <input
                      type="number"
                      value={resource.cost}
                      onChange={(e) => updateResource(resource.id, 'cost', parseInt(e.target.value) || 0)}
                      className="w-14 px-1 py-0.5 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                    <span className={`ml-auto font-medium ${utilization > 100 ? 'text-red-600' : utilization > 80 ? 'text-yellow-600' : 'text-green-600'}`}>
                      {allocated}/{resource.availability}h ({utilization}%)
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('projects')}</h3>
            <button onClick={addProject} className="text-xs px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700">{t('add')}</button>
          </div>
          <div className="space-y-3">
            {projects.map(project => {
              const allocated = project.assignedResources.reduce((sum, ar) => sum + ar.hours, 0);
              return (
                <div key={project.id} className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={project.name}
                      onChange={(e) => updateProject(project.id, 'name', e.target.value)}
                      className="flex-1 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                    <select
                      value={project.priority}
                      onChange={(e) => updateProject(project.id, 'priority', e.target.value)}
                      className="w-24 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    >
                      <option value="high">{t('high')}</option>
                      <option value="medium">{t('medium')}</option>
                      <option value="low">{t('low')}</option>
                    </select>
                  </div>
                  <div className="text-xs text-gray-500 mb-2">
                    {t('required')}: {project.requiredHours}h | {t('allocated')}: {allocated}h
                  </div>
                  <div className="grid grid-cols-2 gap-1">
                    {resources.map(resource => {
                      const ar = project.assignedResources.find(a => a.resourceId === resource.id);
                      return (
                        <div key={resource.id} className="flex items-center gap-1 text-xs">
                          <span className="w-16 truncate text-gray-600 dark:text-gray-400">{resource.name}</span>
                          <input
                            type="number"
                            value={ar?.hours || 0}
                            onChange={(e) => updateAllocation(project.id, resource.id, parseInt(e.target.value) || 0)}
                            min={0}
                            className="w-12 px-1 py-0.5 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                          />
                          <span className="text-gray-400">h</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
