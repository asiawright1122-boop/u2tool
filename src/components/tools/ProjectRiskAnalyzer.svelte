<script lang="ts">
  import { getRiskLevel, getRiskScore } from '@/lib/tool-stubs';

  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  function t(key: string): string {
    const scope = translations['tools']['project-risk-analyzer'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) value = (value as Record<string, unknown>)?.[k];
    return typeof value === 'string' ? value : `MISSING: tools.project-risk-analyzer.${key}`;
  }

  interface Risk {
    id: string;
    name: string;
    category: 'technical' | 'schedule' | 'resource' | 'external' | 'budget';
    probability: 1 | 2 | 3 | 4 | 5;
    impact: 1 | 2 | 3 | 4 | 5;
    mitigation: string;
    owner: string;
    status: 'open' | 'mitigated' | 'closed';
  }

  const CATEGORIES: { value: Risk['category']; label: string }[] = [
    { value: 'technical', label: 'technical' },
    { value: 'schedule', label: 'schedule' },
    { value: 'resource', label: 'resource' },
    { value: 'external', label: 'external' },
    { value: 'budget', label: 'budget' },
  ];

  let risks = $state<Risk[]>([
    { id: '1', name: 'Technology stack complexity', category: 'technical', probability: 3, impact: 4, mitigation: 'Conduct technical spikes early', owner: 'Tech Lead', status: 'open' },
    { id: '2', name: 'Key resource unavailability', category: 'resource', probability: 2, impact: 5, mitigation: 'Cross-train team members', owner: 'PM', status: 'open' },
    { id: '3', name: 'Scope creep', category: 'schedule', probability: 4, impact: 3, mitigation: 'Strict change control process', owner: 'PM', status: 'mitigated' },
    { id: '4', name: 'Third-party API changes', category: 'external', probability: 2, impact: 4, mitigation: 'Abstract API layer', owner: 'Architect', status: 'open' },
  ]);

  let copied = $state(false);

  let sortedRisks = $derived.by(() => {
    return [...risks].sort((a, b) => getRiskScore(b.probability, b.impact) - getRiskScore(a.probability, a.impact));
  });

  let summary = $derived.by(() => {
    const open = risks.filter(risk => risk.status === 'open');
    const critical = open.filter(risk => getRiskScore(risk.probability, risk.impact) >= 15).length;
    const high = open.filter(risk => {
      const score = getRiskScore(risk.probability, risk.impact);
      return score >= 10 && score < 15;
    }).length;
    const avgScore = open.length > 0
      ? open.reduce((sum, risk) => sum + getRiskScore(risk.probability, risk.impact), 0) / open.length
      : 0;
    return { total: risks.length, open: open.length, critical, high, avgScore: Math.round(avgScore * 10) / 10 };
  });

  function addRisk() {
    risks = [...risks, {
      id: Date.now().toString(),
      name: 'New Risk',
      category: 'technical',
      probability: 3,
      impact: 3,
      mitigation: '',
      owner: '',
      status: 'open',
    }];
  }

  function updateRisk(id: string, field: keyof Risk, value: unknown) {
    risks = risks.map(risk => risk.id === id ? { ...risk, [field]: value } : risk);
  }

  function removeRisk(id: string) {
    risks = risks.filter(risk => risk.id !== id);
  }

  function exportReport() {
    let report = '# Risk Assessment Report\n\n';
    report += `Total Risks: ${summary.total} | Open: ${summary.open} | Critical: ${summary.critical} | High: ${summary.high}\n\n`;
    report += '## Risk Register\n\n';
    sortedRisks.forEach((risk, idx) => {
      const score = getRiskScore(risk.probability, risk.impact);
      const { level } = getRiskLevel(score);
      report += `### ${idx + 1}. ${risk.name}\n`;
      report += `- Category: ${risk.category}\n`;
      report += `- Probability: ${risk.probability}/5 | Impact: ${risk.impact}/5 | Score: ${score} (${level})\n`;
      report += `- Status: ${risk.status}\n`;
      report += `- Owner: ${risk.owner || 'Unassigned'}\n`;
      report += `- Mitigation: ${risk.mitigation || 'None defined'}\n\n`;
    });
    navigator.clipboard.writeText(report);
    copied = true;
    setTimeout(() => copied = false, 2000);
  }
</script>

<div class="space-y-6">
  <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
    <div class="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
      <p class="text-xs text-gray-500">{t('totalRisks')}</p>
      <p class="text-2xl font-bold text-gray-900 dark:text-white">{summary.total}</p>
    </div>
    <div class="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
      <p class="text-xs text-gray-500">{t('open')}</p>
      <p class="text-2xl font-bold text-gray-900 dark:text-white">{summary.open}</p>
    </div>
    <div class="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
      <p class="text-xs text-red-600 dark:text-red-400">{t('critical')}</p>
      <p class="text-2xl font-bold text-red-700 dark:text-red-300">{summary.critical}</p>
    </div>
    <div class="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
      <p class="text-xs text-amber-600 dark:text-amber-400">{t('avgScore')}</p>
      <p class="text-2xl font-bold text-amber-700 dark:text-amber-300">{summary.avgScore}</p>
    </div>
  </div>

  <div class="flex flex-wrap justify-between gap-3">
    <h3 class="font-medium text-gray-900 dark:text-white">{t('riskRegister')}</h3>
    <div class="flex gap-2">
      <button onclick={exportReport} class="btn-secondary text-sm">{copied ? t('copied') : t('exportReport')}</button>
      <button onclick={addRisk} class="btn-primary text-sm">{t('addRisk')}</button>
    </div>
  </div>

  <div class="space-y-4">
    {#each sortedRisks as risk (risk.id)}
      {@const score = getRiskScore(risk.probability, risk.impact)}
      {@const riskLevel = getRiskLevel(score)}
      {@const color = riskLevel.color}
      {@const level = riskLevel.level}
      <div class={`p-4 border-l-4 rounded-lg bg-gray-50 dark:bg-gray-900 ${
        color === 'red' ? 'border-red-500' : color === 'orange' ? 'border-orange-500' : color === 'yellow' ? 'border-yellow-500' : 'border-green-500'
      }`}>
        <div class="flex flex-col lg:flex-row gap-3 mb-3">
          <input
            aria-label={t('riskRegister')}
            type="text"
            value={risk.name}
            onchange={(e) => updateRisk(risk.id, 'name', e.currentTarget.value)}
            class="flex-1 px-2 py-1 text-sm font-medium border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
          <select
            aria-label="Category"
            value={risk.category}
            onchange={(e) => updateRisk(risk.id, 'category', e.currentTarget.value)}
            class="lg:w-32 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            {#each CATEGORIES as category (category.value)}
              <option value={category.value}>{t(category.label)}</option>
            {/each}
          </select>
          <select
            aria-label="Status"
            value={risk.status}
            onchange={(e) => updateRisk(risk.id, 'status', e.currentTarget.value)}
            class="lg:w-32 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value="open">{t('open')}</option>
            <option value="mitigated">{t('mitigated')}</option>
            <option value="closed">{t('closed')}</option>
          </select>
          <button onclick={() => removeRisk(risk.id)} class="text-red-500 hover:text-red-700" aria-label={t('remove')}>x</button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-4 gap-3 mb-3">
          <div>
            <label class="block text-xs text-gray-500 mb-1">{t('probability')}</label>
            <input
              type="range"
              min={1}
              max={5}
              value={risk.probability}
              onchange={(e) => updateRisk(risk.id, 'probability', parseInt(e.currentTarget.value, 10) as Risk['probability'])}
              class="w-full"
            />
            <span class="text-xs text-gray-600 dark:text-gray-400">{risk.probability}/5</span>
          </div>
          <div>
            <label class="block text-xs text-gray-500 mb-1">{t('impact')}</label>
            <input
              type="range"
              min={1}
              max={5}
              value={risk.impact}
              onchange={(e) => updateRisk(risk.id, 'impact', parseInt(e.currentTarget.value, 10) as Risk['impact'])}
              class="w-full"
            />
            <span class="text-xs text-gray-600 dark:text-gray-400">{risk.impact}/5</span>
          </div>
          <div>
            <p class="block text-xs text-gray-500 mb-1">{t('score')}</p>
            <span class={`text-lg font-bold ${
              color === 'red' ? 'text-red-600' : color === 'orange' ? 'text-orange-600' : color === 'yellow' ? 'text-yellow-600' : 'text-green-600'
            }`}>
              {score} ({level})
            </span>
          </div>
          <div>
            <label class="block text-xs text-gray-500 mb-1">{t('owner')}</label>
            <input
              type="text"
              value={risk.owner}
              onchange={(e) => updateRisk(risk.id, 'owner', e.currentTarget.value)}
              placeholder={t('ownerPlaceholder')}
              class="w-full px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
          </div>
        </div>

        <div>
          <label class="block text-xs text-gray-500 mb-1">{t('mitigationStrategy')}</label>
          <input
            type="text"
            value={risk.mitigation}
            onchange={(e) => updateRisk(risk.id, 'mitigation', e.currentTarget.value)}
            placeholder={t('mitigationPlaceholder')}
            class="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        </div>
      </div>
    {/each}
  </div>
</div>
