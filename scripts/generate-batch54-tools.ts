import fs from 'fs';
import path from 'path';

// 定义所有 57 个工具的配置
const tools = [
  // API and Network Tools (8)
  { slug: 'curl-to-code-generator', name: 'cURL to Code Generator', component: 'CurlToCodeGenerator' },
  { slug: 'http-status-code-reference', name: 'HTTP Status Code Reference', component: 'HttpStatusCodeReference' },
  { slug: 'jwt-payload-decoder', name: 'JWT Payload Decoder', component: 'JwtPayloadDecoder' },
  { slug: 'base64-image-converter', name: 'Base64 Image Converter', component: 'Base64ImageConverter' },
  { slug: 'url-query-string-parser', name: 'URL Query String Parser', component: 'UrlQueryStringParser' },
  { slug: 'request-header-builder', name: 'Request Header Builder', component: 'RequestHeaderBuilder' },
  { slug: 'webhook-tester', name: 'Webhook Tester', component: 'WebhookTester' },
  { slug: 'api-response-formatter', name: 'API Response Formatter', component: 'ApiResponseFormatter' },
  
  // Code Conversion and Generation (8)
  { slug: 'sql-to-mongodb-converter', name: 'SQL to MongoDB Converter', component: 'SqlToMongodbConverter' },
  { slug: 'json-to-protobuf-converter', name: 'JSON to Protobuf Converter', component: 'JsonToProtobufConverter' },
  { slug: 'regex-to-code-generator', name: 'Regex to Code Generator', component: 'RegexToCodeGenerator' },
  { slug: 'swagger-to-code-generator', name: 'Swagger to Code Generator', component: 'SwaggerToCodeGenerator' },
  { slug: 'database-migration-generator', name: 'Database Migration Generator', component: 'DatabaseMigrationGenerator' },
  { slug: 'environment-variables-generator', name: 'Environment Variables Generator', component: 'EnvironmentVariablesGenerator' },
  { slug: 'docker-compose-generator-advanced', name: 'Docker Compose Generator', component: 'DockerComposeGeneratorAdvanced' },
  { slug: 'kubernetes-manifest-generator', name: 'Kubernetes Manifest Generator', component: 'KubernetesManifestGenerator' },
  
  // Code Analysis and Optimization (7)
  { slug: 'code-complexity-analyzer', name: 'Code Complexity Analyzer', component: 'CodeComplexityAnalyzer' },
  { slug: 'dependency-vulnerability-checker', name: 'Dependency Vulnerability Checker', component: 'DependencyVulnerabilityChecker' },
  { slug: 'performance-profiler', name: 'Performance Profiler', component: 'PerformanceProfiler' },
  { slug: 'memory-leak-detector', name: 'Memory Leak Detector', component: 'MemoryLeakDetector' },
  { slug: 'code-duplication-finder', name: 'Code Duplication Finder', component: 'CodeDuplicationFinder' },
  { slug: 'unused-imports-finder', name: 'Unused Imports Finder', component: 'UnusedImportsFinder' },
  { slug: 'dead-code-analyzer', name: 'Dead Code Analyzer', component: 'DeadCodeAnalyzer' },
  
  // Database Tools (6)
  { slug: 'sql-query-optimizer', name: 'SQL Query Optimizer', component: 'SqlQueryOptimizer' },
  { slug: 'database-schema-visualizer', name: 'Database Schema Visualizer', component: 'DatabaseSchemaVisualizer' },
  { slug: 'sql-injection-tester', name: 'SQL Injection Tester', component: 'SqlInjectionTester' },
  { slug: 'database-connection-tester', name: 'Database Connection Tester', component: 'DatabaseConnectionTester' },
  { slug: 'query-execution-planner', name: 'Query Execution Planner', component: 'QueryExecutionPlanner' },
  { slug: 'database-backup-scheduler', name: 'Database Backup Scheduler', component: 'DatabaseBackupScheduler' },
  
  // Version Control Tools (6)
  { slug: 'git-commit-message-generator', name: 'Git Commit Message Generator', component: 'GitCommitMessageGenerator' },
  { slug: 'git-branch-naming-validator', name: 'Git Branch Naming Validator', component: 'GitBranchNamingValidator' },
  { slug: 'merge-conflict-resolver', name: 'Merge Conflict Resolver', component: 'MergeConflictResolver' },
  { slug: 'git-history-visualizer', name: 'Git History Visualizer', component: 'GitHistoryVisualizer' },
  { slug: 'changelog-generator-advanced', name: 'Changelog Generator', component: 'ChangelogGeneratorAdvanced' },
  { slug: 'git-tag-manager', name: 'Git Tag Manager', component: 'GitTagManager' },
  
  // Document and Content Management (6)
  { slug: 'markdown-to-html-converter', name: 'Markdown to HTML Converter', component: 'MarkdownToHtmlConverter' },
  { slug: 'document-outline-generator', name: 'Document Outline Generator', component: 'DocumentOutlineGenerator' },
  { slug: 'table-of-contents-generator', name: 'Table of Contents Generator', component: 'TableOfContentsGenerator' },
  { slug: 'document-word-counter', name: 'Document Word Counter', component: 'DocumentWordCounter' },
  { slug: 'document-formatter', name: 'Document Formatter', component: 'DocumentFormatter' },
  { slug: 'citation-formatter', name: 'Citation Formatter', component: 'CitationFormatter' },
  
  // Project Management Tools (6)
  { slug: 'project-estimation-calculator', name: 'Project Estimation Calculator', component: 'ProjectEstimationCalculator' },
  { slug: 'sprint-velocity-calculator', name: 'Sprint Velocity Calculator', component: 'SprintVelocityCalculator' },
  { slug: 'resource-allocation-planner', name: 'Resource Allocation Planner', component: 'ResourceAllocationPlanner' },
  { slug: 'project-risk-analyzer', name: 'Project Risk Analyzer', component: 'ProjectRiskAnalyzer' },
  { slug: 'milestone-tracker', name: 'Milestone Tracker', component: 'MilestoneTracker' },
  { slug: 'team-capacity-planner', name: 'Team Capacity Planner', component: 'TeamCapacityPlanner' },
  
  // Meeting and Schedule Tools (5)
  { slug: 'meeting-minutes-generator', name: 'Meeting Minutes Generator', component: 'MeetingMinutesGenerator' },
  { slug: 'timezone-meeting-scheduler', name: 'Timezone Meeting Scheduler', component: 'TimezoneMeetingScheduler' },
  { slug: 'meeting-agenda-builder', name: 'Meeting Agenda Builder', component: 'MeetingAgendaBuilder' },
  { slug: 'calendar-availability-finder', name: 'Calendar Availability Finder', component: 'CalendarAvailabilityFinder' },
  { slug: 'meeting-room-finder', name: 'Meeting Room Finder', component: 'MeetingRoomFinder' },
  
  // Finance and Budget Tools (5)
  { slug: 'invoice-template-generator', name: 'Invoice Template Generator', component: 'InvoiceTemplateGenerator' },
  { slug: 'expense-report-generator', name: 'Expense Report Generator', component: 'ExpenseReportGenerator' },
  { slug: 'budget-variance-analyzer', name: 'Budget Variance Analyzer', component: 'BudgetVarianceAnalyzer' },
  { slug: 'cost-benefit-analyzer', name: 'Cost Benefit Analyzer', component: 'CostBenefitAnalyzer' },
  { slug: 'financial-forecast-calculator', name: 'Financial Forecast Calculator', component: 'FinancialForecastCalculator' },
];

// 生成工具组件模板
function generateToolComponent(slug: string, name: string): string {
  return `'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

export default function ${slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('')}() {
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
        {/* Input */}
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

        {/* Output */}
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

      {/* Buttons */}
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

      {/* Error */}
      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400">
          {error}
        </div>
      )}
    </div>
  );
}
`;
}

// 创建所有工具组件
async function generateAllTools() {
  const toolsDir = path.join(process.cwd(), 'src/components/tools');
  
  for (const tool of tools) {
    const filePath = path.join(toolsDir, `${tool.component}.tsx`);
    
    // 检查文件是否已存在
    if (fs.existsSync(filePath)) {
      console.log(`✓ ${tool.component}.tsx 已存在`);
      continue;
    }
    
    const content = generateToolComponent(tool.slug, tool.name);
    fs.writeFileSync(filePath, content);
    console.log(`✓ 创建 ${tool.component}.tsx`);
  }
  
  console.log(`\n✓ 成功创建 ${tools.length} 个工具组件`);
}

generateAllTools().catch(console.error);
