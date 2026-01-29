'use client';

import { useState, useCallback, useMemo } from 'react';
import { useTranslations } from 'next-intl';

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

const CATEGORIES = [
  { value: 'technical', label: 'technical', color: 'blue' },
  { value: 'schedule', label: 'schedule', color: 'orange' },
  { value: 'resource', label: 'resource', color: 'purple' },
  { value: 'external', label: 'external', color: 'red' },
  { value: 'budget', label: 'budget', color: 'green' },
];

function getRiskScore(probability: number, impact: number): number {
  return probability * impact;
}

function getRiskLevel(score: number): { level: string; color: string } {
  if (score >= 15) return { level: 'Critical', color: 'red' };
  if (score >= 10) return { level: 'High', color: 'orange' };
  if (score >= 5) return { level: 'Medium', color: 'yellow' };
  return { level: 'Low', color: 'green' };
}

export default function ProjectRiskAnalyzer() {
  const t = useTranslations('tools.project-risk-analyzer');
  const tCommon = useTranslations('tools');
  const [risks, setRisks] = useState<Risk[]>([
    { id: '1', name: 'Technology stack complexity', category: 'technical', probability: 3, impact: 4, mitigation: 'Conduct technical spikes early', owner: 'Tech Lead', status: 'open' },
    { id: '2', name: 'Key resource unavailability', category: 'resource', probability: 2, impact: 5, mitigation: 'Cross-train team members', owner: 'PM', status: 'open' },
    { id: '3', name: 'Scope creep', category: 'schedule', probability: 4, impact: 3, mitigation: 'Strict change control process', owner: 'PM', status: 'mitigated' },
    { id: '4', name: 'Third-party API changes', category: 'external', probability: 2, impact: 4, mitigation: 'Abstract API layer', owner: 'Architect', status: 'open' },
  ]);
  const [copied, setCopied] = useState(false);

  const addRisk = useCallback(() => {
    setRisks(prev => [...prev, {
      id: Date.now().toString(),
      name: 'New Risk',
      category: 'technical',
      probability: 3,
      impact: 3,
      mitigation: '',
      owner: '',
      status: 'open',
    }]);
  }, []);

  const updateRisk = useCallback((id: string, field: keyof Risk, value: unknown) => {
    setRisks(prev => prev.map(r => r.id === id ? { ...r, [field]: value } : r));
  }, []);

  const removeRisk = useCallback((id: string) => {
    setRisks(prev => prev.filter(r => r.id !== id));
  }, []);

  const sortedRisks = useMemo(() => {
    return [...risks].sort((a, b) => getRiskScore(b.probability, b.impact) - getRiskScore(a.probability, a.impact));
  }, [risks]);

  const summary = useMemo(() => {
    const open = risks.filter(r => r.status === 'open');
    const critical = open.filter(r => getRiskScore(r.probability, r.impact) >= 15).length;
    const high = open.filter(r => { const s = getRiskScore(r.probability, r.impact); return s >= 10 && s < 15; }).length;
    const avgScore = open.length > 0 ? open.reduce((sum, r) => sum + getRiskScore(r.probability, r.impact), 0) / open.length : 0;
    return { total: risks.length, open: open.length, critical, high, avgScore: Math.round(avgScore * 10) / 10 };
  }, [risks]);

  const exportReport = useCallback(() => {
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
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [sortedRisks, summary]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg text-center">
          <div className="text-2xl font-bold text-gray-700 dark:text-gray-300">{summary.total}</div>
          <div className="text-xs text-gray-500">{t('totalRisks')}</div>
        </div>
        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-center">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{summary.open}</div>
          <div className="text-xs text-blue-700 dark:text-blue-300">{t('open')}</div>
        </div>
        <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg text-center">
          <div className="text-2xl font-bold text-red-600 dark:text-red-400">{summary.critical}</div>
          <div className="text-xs text-red-700 dark:text-red-300">{t('critical')}</div>
        </div>
        <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg text-center">
          <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{summary.high}</div>
          <div className="text-xs text-orange-700 dark:text-orange-300">{t('high')}</div>
        </div>
        <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-center">
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{summary.avgScore}</div>
          <div className="text-xs text-purple-700 dark:text-purple-300">{t('avgScore')}</div>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('riskRegister')}</h3>
        <div className="flex gap-2">
          <button onClick={exportReport} className="text-xs px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200">
            {copied ? tCommon('copied') : t('exportReport')}
          </button>
          <button onClick={addRisk} className="text-xs px-3 py-1.5 bg-green-600 text-white rounded hover:bg-green-700">
            {t('addRisk')}
          </button>
        </div>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {sortedRisks.map(risk => {
          const score = getRiskScore(risk.probability, risk.impact);
          const { level, color } = getRiskLevel(score);
          return (
            <div key={risk.id} className={`p-4 border-l-4 rounded-lg bg-gray-50 dark:bg-gray-900 ${
              color === 'red' ? 'border-red-500' : color === 'orange' ? 'border-orange-500' : color === 'yellow' ? 'border-yellow-500' : 'border-green-500'
            }`}>
              <div className="flex gap-3 mb-3">
                <input
                  type="text"
                  value={risk.name}
                  onChange={(e) => updateRisk(risk.id, 'name', e.target.value)}
                  className="flex-1 px-2 py-1 text-sm font-medium border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
                <select
                  value={risk.category}
                  onChange={(e) => updateRisk(risk.id, 'category', e.target.value)}
                  className="w-28 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  {CATEGORIES.map(c => <option key={c.value} value={c.value}>{t(c.label)}</option>)}
                </select>
                <select
                  value={risk.status}
                  onChange={(e) => updateRisk(risk.id, 'status', e.target.value)}
                  className="w-28 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  <option value="open">{t('open')}</option>
                  <option value="mitigated">{t('mitigated')}</option>
                  <option value="closed">{t('closed')}</option>
                </select>
                <button onClick={() => removeRisk(risk.id)} className="text-red-500 hover:text-red-700">✕</button>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">{t('probability')}</label>
                  <input
                    type="range"
                    min={1}
                    max={5}
                    value={risk.probability}
                    onChange={(e) => updateRisk(risk.id, 'probability', parseInt(e.target.value) as Risk['probability'])}
                    className="w-full"
                  />
                  <span className="text-xs text-gray-600 dark:text-gray-400">{risk.probability}/5</span>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">{t('impact')}</label>
                  <input
                    type="range"
                    min={1}
                    max={5}
                    value={risk.impact}
                    onChange={(e) => updateRisk(risk.id, 'impact', parseInt(e.target.value) as Risk['impact'])}
                    className="w-full"
                  />
                  <span className="text-xs text-gray-600 dark:text-gray-400">{risk.impact}/5</span>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">{t('score')}</label>
                  <span className={`text-lg font-bold ${
                    color === 'red' ? 'text-red-600' : color === 'orange' ? 'text-orange-600' : color === 'yellow' ? 'text-yellow-600' : 'text-green-600'
                  }`}>
                    {score} ({level})
                  </span>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">{t('owner')}</label>
                  <input
                    type="text"
                    value={risk.owner}
                    onChange={(e) => updateRisk(risk.id, 'owner', e.target.value)}
                    placeholder={t("ownerPlaceholder")}
                    className="w-full px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-xs text-gray-500 mb-1">{t('mitigationStrategy')}</label>
                <input
                  type="text"
                  value={risk.mitigation}
                  onChange={(e) => updateRisk(risk.id, 'mitigation', e.target.value)}
                  placeholder={t("mitigationPlaceholder")}
                  className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
        <h4 className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">{t('riskMatrix')}</h4>
        <div className="text-xs text-gray-600 dark:text-gray-400">
          <p>{t('score')} = {t('probability')} × {t('impact')}</p>
          <p>{t('critical')}: 15-25 | {t('high')}: 10-14 | Medium: 5-9 | Low: 1-4</p>
        </div>
      </div>
    </div>
  );
}
