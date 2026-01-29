const fs = require('fs');
const path = require('path');

const tools = [
  { slug: 'http-status-code-reference', component: 'HttpStatusCodeReference' },
  { slug: 'jwt-payload-decoder', component: 'JwtPayloadDecoder' },
  { slug: 'base64-image-converter', component: 'Base64ImageConverter' },
  { slug: 'url-query-string-parser', component: 'UrlQueryStringParser' },
  { slug: 'request-header-builder', component: 'RequestHeaderBuilder' },
  { slug: 'webhook-tester', component: 'WebhookTester' },
  { slug: 'api-response-formatter', component: 'ApiResponseFormatter' },
  { slug: 'sql-to-mongodb-converter', component: 'SqlToMongodbConverter' },
  { slug: 'json-to-protobuf-converter', component: 'JsonToProtobufConverter' },
  { slug: 'regex-to-code-generator', component: 'RegexToCodeGenerator' },
  { slug: 'swagger-to-code-generator', component: 'SwaggerToCodeGenerator' },
  { slug: 'database-migration-generator', component: 'DatabaseMigrationGenerator' },
  { slug: 'environment-variables-generator', component: 'EnvironmentVariablesGenerator' },
  { slug: 'docker-compose-generator-advanced', component: 'DockerComposeGeneratorAdvanced' },
  { slug: 'kubernetes-manifest-generator', component: 'KubernetesManifestGenerator' },
  { slug: 'code-complexity-analyzer', component: 'CodeComplexityAnalyzer' },
  { slug: 'dependency-vulnerability-checker', component: 'DependencyVulnerabilityChecker' },
  { slug: 'performance-profiler', component: 'PerformanceProfiler' },
  { slug: 'memory-leak-detector', component: 'MemoryLeakDetector' },
  { slug: 'code-duplication-finder', component: 'CodeDuplicationFinder' },
  { slug: 'unused-imports-finder', component: 'UnusedImportsFinder' },
  { slug: 'dead-code-analyzer', component: 'DeadCodeAnalyzer' },
  { slug: 'sql-query-optimizer', component: 'SqlQueryOptimizer' },
  { slug: 'database-schema-visualizer', component: 'DatabaseSchemaVisualizer' },
  { slug: 'sql-injection-tester', component: 'SqlInjectionTester' },
  { slug: 'database-connection-tester', component: 'DatabaseConnectionTester' },
  { slug: 'query-execution-planner', component: 'QueryExecutionPlanner' },
  { slug: 'database-backup-scheduler', component: 'DatabaseBackupScheduler' },
  { slug: 'git-commit-message-generator', component: 'GitCommitMessageGenerator' },
  { slug: 'git-branch-naming-validator', component: 'GitBranchNamingValidator' },
  { slug: 'merge-conflict-resolver', component: 'MergeConflictResolver' },
  { slug: 'git-history-visualizer', component: 'GitHistoryVisualizer' },
  { slug: 'changelog-generator-advanced', component: 'ChangelogGeneratorAdvanced' },
  { slug: 'git-tag-manager', component: 'GitTagManager' },
  { slug: 'markdown-to-html-converter', component: 'MarkdownToHtmlConverter' },
  { slug: 'document-outline-generator', component: 'DocumentOutlineGenerator' },
  { slug: 'table-of-contents-generator', component: 'TableOfContentsGenerator' },
  { slug: 'document-word-counter', component: 'DocumentWordCounter' },
  { slug: 'document-formatter', component: 'DocumentFormatter' },
  { slug: 'citation-formatter', component: 'CitationFormatter' },
  { slug: 'project-estimation-calculator', component: 'ProjectEstimationCalculator' },
  { slug: 'sprint-velocity-calculator', component: 'SprintVelocityCalculator' },
  { slug: 'resource-allocation-planner', component: 'ResourceAllocationPlanner' },
  { slug: 'project-risk-analyzer', component: 'ProjectRiskAnalyzer' },
  { slug: 'milestone-tracker', component: 'MilestoneTracker' },
  { slug: 'team-capacity-planner', component: 'TeamCapacityPlanner' },
  { slug: 'meeting-minutes-generator', component: 'MeetingMinutesGenerator' },
  { slug: 'timezone-meeting-scheduler', component: 'TimezoneMeetingScheduler' },
  { slug: 'meeting-agenda-builder', component: 'MeetingAgendaBuilder' },
  { slug: 'calendar-availability-finder', component: 'CalendarAvailabilityFinder' },
  { slug: 'meeting-room-finder', component: 'MeetingRoomFinder' },
  { slug: 'invoice-template-generator', component: 'InvoiceTemplateGenerator' },
  { slug: 'expense-report-generator', component: 'ExpenseReportGenerator' },
  { slug: 'budget-variance-analyzer', component: 'BudgetVarianceAnalyzer' },
  { slug: 'cost-benefit-analyzer', component: 'CostBenefitAnalyzer' },
  { slug: 'financial-forecast-calculator', component: 'FinancialForecastCalculator' },
];

const template = (slug, component) => `'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

export default function ${component}() {
  const t = useTranslations('tools.${slug}');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const handleProcess = () => {
    try {
      if (!input.trim()) {
        setError(t('errors.emptyInput'));
        return;
      }
      
      // TODO: 实现工具逻辑
      setOutput('');
      setError('');
    } catch (e) {
      setError((e as Error).message);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
    setError('');
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('input')}
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t('inputPlaceholder')}
            className="w-full h-64 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono text-sm resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('output')}
          </label>
          <textarea
            value={output}
            readOnly
            placeholder={t('outputPlaceholder')}
            className="w-full h-64 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white font-mono text-sm resize-none"
          />
        </div>
      </div>

      <div className="flex gap-3 flex-wrap">
        <button
          onClick={handleProcess}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          {t('process')}
        </button>
        {output && (
          <button
            onClick={handleCopy}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
          >
            {t('copy')}
          </button>
        )}
        <button
          onClick={handleClear}
          className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
        >
          {t('clear')}
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400">
          {error}
        </div>
      )}
    </div>
  );
}
`;

const toolsDir = path.join(__dirname, '../src/components/tools');

tools.forEach(tool => {
  const filePath = path.join(toolsDir, `${tool.component}.tsx`);
  
  if (fs.existsSync(filePath)) {
    console.log(`✓ ${tool.component}.tsx 已存在`);
    return;
  }
  
  fs.writeFileSync(filePath, template(tool.slug, tool.component));
  console.log(`✓ 创建 ${tool.component}.tsx`);
});

console.log(`\n✓ 成功创建 ${tools.length} 个工具组件`);
