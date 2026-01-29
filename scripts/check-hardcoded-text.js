const fs = require('fs');
const path = require('path');

// Batch54 工具组件列表
const batch54Components = [
  'CurlToCodeGenerator',
  'HttpStatusCodeReference',
  'JwtPayloadDecoder',
  'Base64ImageConverter',
  'UrlQueryStringParser',
  'RequestHeaderBuilder',
  'WebhookTester',
  'ApiResponseFormatter',
  'SqlToMongodbConverter',
  'JsonToProtobufConverter',
  'RegexToCodeGenerator',
  'SwaggerToCodeGenerator',
  'DatabaseMigrationGenerator',
  'EnvironmentVariablesGenerator',
  'DockerComposeGeneratorAdvanced',
  'KubernetesManifestGenerator',
  'CodeComplexityAnalyzer',
  'DependencyVulnerabilityChecker',
  'PerformanceProfiler',
  'MemoryLeakDetector',
  'CodeDuplicationFinder',
  'UnusedImportsFinder',
  'DeadCodeAnalyzer',
  'SqlQueryOptimizer',
  'DatabaseSchemaVisualizer',
  'SqlInjectionTester',
  'DatabaseConnectionTester',
  'QueryExecutionPlanner',
  'DatabaseBackupScheduler',
  'GitCommitMessageGenerator',
  'GitBranchNamingValidator',
  'MergeConflictResolver',
  'GitHistoryVisualizer',
  'ChangelogGeneratorAdvanced',
  'GitTagManager',
  'MarkdownToHtmlConverter',
  'DocumentOutlineGenerator',
  'TableOfContentsGenerator',
  'DocumentWordCounter',
  'DocumentFormatter',
  'CitationFormatter',
  'ProjectEstimationCalculator',
  'SprintVelocityCalculator',
  'ResourceAllocationPlanner',
  'ProjectRiskAnalyzer',
  'MilestoneTracker',
  'TeamCapacityPlanner',
  'MeetingMinutesGenerator',
  'TimezoneMeetingScheduler',
  'MeetingAgendaBuilder',
  'CalendarAvailabilityFinder',
  'MeetingRoomFinder',
  'InvoiceTemplateGenerator',
  'ExpenseReportGenerator',
  'BudgetVarianceAnalyzer',
  'CostBenefitAnalyzer',
  'FinancialForecastCalculator'
];

// 常见的硬编码英文文本模式
const hardcodedPatterns = [
  />\s*Add\s/,
  />\s*Remove\s/,
  />\s*Delete\s/,
  />\s*Edit\s/,
  />\s*Save\s/,
  />\s*Cancel\s/,
  />\s*Submit\s/,
  />\s*Generate\s/,
  />\s*Convert\s/,
  />\s*Copy\s/,
  />\s*Clear\s/,
  />\s*Download\s/,
  />\s*Upload\s/,
  />\s*Select\s/,
  />\s*Enter\s/,
  />\s*Input\s/,
  />\s*Output\s/,
  />\s*Result\s/,
  />\s*Error\s/,
  />\s*Success\s/,
  />\s*Warning\s/,
  />\s*Loading\s/,
  />\s*No\s+\w+\s+/,
  /placeholder=["'][A-Z]/,
  /label=["'][A-Z]/,
  /title=["'][A-Z]/,
];

const toolsDir = 'src/components/tools';
let totalIssues = 0;

console.log('=== Batch54 工具硬编码文本检查 ===\n');

batch54Components.forEach(component => {
  const filePath = path.join(toolsDir, component + '.tsx');
  if (!fs.existsSync(filePath)) {
    console.log(`✗ ${component}.tsx - 文件不存在`);
    return;
  }
  
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  const issues = [];
  
  lines.forEach((line, idx) => {
    // 跳过注释和导入
    if (line.trim().startsWith('//') || line.trim().startsWith('import')) return;
    
    // 检查硬编码文本
    hardcodedPatterns.forEach(pattern => {
      if (pattern.test(line)) {
        issues.push({ line: idx + 1, text: line.trim().substring(0, 60) });
      }
    });
  });
  
  if (issues.length > 0) {
    console.log(`✗ ${component}.tsx - ${issues.length} 处硬编码文本:`);
    issues.slice(0, 3).forEach(i => {
      console.log(`    L${i.line}: ${i.text}...`);
    });
    if (issues.length > 3) {
      console.log(`    ... 还有 ${issues.length - 3} 处`);
    }
    totalIssues += issues.length;
  } else {
    console.log(`✓ ${component}.tsx - OK`);
  }
});

console.log(`\n总计: ${totalIssues} 处硬编码文本需要翻译`);
