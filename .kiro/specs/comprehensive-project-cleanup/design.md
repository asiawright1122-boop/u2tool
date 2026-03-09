# 设计文档 - 全面项目清理和优化

## 概述

本设计文档描述了 u2tool 项目的全面清理和优化系统的技术实现。该系统旨在解决项目在多次迭代开发后积累的技术债务，包括临时文件清理、类型系统修复、spec 生命周期管理、历史修复验证、构建优化、文档更新、自动化健康检查、性能基准测试、依赖审计和代码质量门禁。

### 设计目标

1. **自动化清理**: 提供自动化工具清理临时文件和归档历史修复
2. **类型安全**: 修复所有 TypeScript 类型导出警告，确保类型系统完整性
3. **Spec 管理**: 建立完整的 spec 生命周期管理机制
4. **质量保证**: 验证历史修复的有效性，防止问题回归
5. **性能优化**: 优化构建产物大小，提升加载性能
6. **文档完整**: 更新开发规则文档，反映最新最佳实践
7. **持续监控**: 建立自动化健康检查和性能基准测试
8. **依赖安全**: 审计和更新项目依赖，确保安全性
9. **质量门禁**: 建立 Git hooks 防止低质量代码进入代码库

### 技术栈

- **运行时**: Node.js 18+
- **构建工具**: Astro 5.8.0, Vite
- **语言**: TypeScript 5.7.0
- **框架**: Svelte 5.0
- **工具库**: ts-morph (AST 解析), glob (文件匹配), fs-extra (文件操作)

## 架构

### 系统架构图

```
┌─────────────────────────────────────────────────────────────┐
│                    项目清理和优化系统                          │
└─────────────────────────────────────────────────────────────┘
                              │
                ┌─────────────┼─────────────┐
                │             │             │
        ┌───────▼──────┐ ┌───▼────┐ ┌─────▼──────┐
        │ 清理子系统    │ │ 验证   │ │ 优化子系统  │
        │              │ │ 子系统  │ │            │
        └───────┬──────┘ └───┬────┘ └─────┬──────┘
                │            │            │
    ┌───────────┼────────────┼────────────┼───────────┐
    │           │            │            │           │
┌───▼───┐  ┌───▼───┐   ┌───▼───┐   ┌───▼───┐  ┌───▼───┐
│ 文件  │  │ Spec  │   │ 类型  │   │ 构建  │  │ 性能  │
│ 清理  │  │ 管理  │   │ 修复  │   │ 优化  │  │ 监控  │
└───┬───┘  └───┬───┘   └───┬───┘   └───┬───┘  └───┬───┘
    │          │           │           │          │
    └──────────┴───────────┴───────────┴──────────┘
                          │
                    ┌─────▼─────┐
                    │ 报告生成器 │
                    └───────────┘
```

### 模块划分

1. **文件清理模块** (`scripts/cleanup/`)
   - 临时文件识别和归档
   - .gitignore 规则处理
   - 归档清单生成

2. **Spec 管理模块** (`scripts/spec-lifecycle/`)
   - Spec 状态检测
   - 归档操作
   - 索引维护

3. **类型修复模块** (`scripts/type-fixes/`)
   - 类型导出添加
   - JSDoc 注释生成
   - 类型兼容性验证

4. **验证模块** (`scripts/validation/`)
   - 历史修复验证
   - 代码模式检查
   - 翻译完整性测试

5. **构建优化模块** (`scripts/build-optimization/`)
   - 构建分析
   - 动态导入检查
   - 大小优化建议

6. **健康检查模块** (`scripts/maintenance/`)
   - 项目健康扫描
   - 问题检测
   - 报告生成

7. **性能监控模块** (`scripts/performance/`)
   - 基准测试
   - 性能指标收集
   - 对比分析

8. **依赖审计模块** (`scripts/dependency-audit/`)
   - 安全漏洞扫描
   - 过时依赖检查
   - 未使用依赖识别

9. **Git Hooks 模块** (`scripts/git-hooks/`)
   - Pre-commit 检查
   - 代码质量验证
   - 提交拦截

## 组件和接口

### 1. 文件清理组件

#### CleanupManager

```typescript
interface CleanupOptions {
  dryRun?: boolean;
  respectGitignore?: boolean;
  patterns?: string[];
  archivePath?: string;
}

interface CleanupResult {
  filesFound: string[];
  filesMoved: string[];
  filesSkipped: string[];
  manifestPath: string;
}

class CleanupManager {
  constructor(private options: CleanupOptions);
  
  // 识别临时文件
  async identifyTemporaryFiles(): Promise<string[]>;
  
  // 检查 gitignore 规则
  async isIgnored(filePath: string): Promise<boolean>;
  
  // 归档文件
  async archiveFiles(files: string[]): Promise<CleanupResult>;
  
  // 生成归档清单
  async generateManifest(files: string[]): Promise<void>;
}
```

#### FilePattern

```typescript
interface FilePattern {
  pattern: RegExp;
  description: string;
  category: 'temporary' | 'fix' | 'test' | 'backup';
}

const TEMPORARY_PATTERNS: FilePattern[] = [
  { pattern: /^fix_.*\.(sh|js|ts)$/, description: '临时修复脚本', category: 'fix' },
  { pattern: /^test_.*\.(sh|js|ts)$/, description: '临时测试脚本', category: 'test' },
  { pattern: /^temp_.*$/, description: '临时文件', category: 'temporary' },
  { pattern: /^\d+$/, description: '数字文件名', category: 'temporary' },
  { pattern: /.*\.bak$/, description: '备份文件', category: 'backup' },
];
```

### 2. Spec 管理组件

#### SpecManager

```typescript
interface SpecInfo {
  name: string;
  path: string;
  status: 'active' | 'completed' | 'deprecated' | 'cancelled';
  completedDate?: Date;
  tasksCompleted: number;
  tasksTotal: number;
}

interface ArchiveOptions {
  specName: string;
  archiveType: 'completed' | 'deprecated' | 'cancelled';
  reason?: string;
}

class SpecManager {
  // 列出所有 spec
  async listSpecs(): Promise<SpecInfo[]>;
  
  // 检查 spec 状态
  async checkSpecStatus(specName: string): Promise<SpecInfo>;
  
  // 归档 spec
  async archiveSpec(options: ArchiveOptions): Promise<void>;
  
  // 更新归档索引
  async updateArchiveIndex(spec: SpecInfo): Promise<void>;
  
  // 验证任务完成状态
  async validateTasksCompleted(specName: string): Promise<boolean>;
}
```

#### TaskParser

```typescript
interface Task {
  id: string;
  title: string;
  completed: boolean;
  subtasks?: Task[];
}

class TaskParser {
  // 解析 tasks.md 文件
  static parseTasksFile(content: string): Task[];
  
  // 检查所有任务是否完成
  static areAllTasksCompleted(tasks: Task[]): boolean;
  
  // 计算完成进度
  static calculateProgress(tasks: Task[]): { completed: number; total: number };
}
```

### 3. 类型修复组件

#### TypeExporter

```typescript
interface TypeExportInfo {
  name: string;
  kind: 'interface' | 'type' | 'enum';
  exported: boolean;
  hasJSDoc: boolean;
  location: { line: number; column: number };
}

interface TypeFixResult {
  typesAdded: string[];
  jsDocsAdded: string[];
  errors: string[];
}

class TypeExporter {
  constructor(private filePath: string);
  
  // 分析文件中的类型
  async analyzeTypes(): Promise<TypeExportInfo[]>;
  
  // 添加类型导出
  async addTypeExports(typeNames: string[]): Promise<void>;
  
  // 添加 JSDoc 注释
  async addJSDocComments(typeNames: string[]): Promise<void>;
  
  // 验证类型兼容性
  async validateCompatibility(): Promise<boolean>;
}
```

### 4. 验证组件

#### HistoricalFixValidator

```typescript
interface ValidationRule {
  name: string;
  description: string;
  validate: () => Promise<ValidationResult>;
}

interface ValidationResult {
  passed: boolean;
  message: string;
  details?: any;
}

interface ValidationReport {
  timestamp: Date;
  rules: ValidationRule[];
  results: ValidationResult[];
  summary: {
    total: number;
    passed: number;
    failed: number;
  };
}

class HistoricalFixValidator {
  private rules: ValidationRule[] = [];
  
  // 添加验证规则
  addRule(rule: ValidationRule): void;
  
  // 运行所有验证
  async runValidation(): Promise<ValidationReport>;
  
  // 生成验证报告
  async generateReport(report: ValidationReport): Promise<void>;
}
```

#### 预定义验证规则

```typescript
// React Hooks 依赖验证
const hooksDepend
encyValidation: ValidationRule = {
  name: 'React Hooks Dependency Check',
  description: '检查所有组件的 React Hooks 依赖配置',
  validate: async () => {
    // 实现逻辑：扫描所有 .svelte 文件，检查 useEffect/useMemo/useCallback 依赖
    return { passed: true, message: 'All hooks dependencies are correct' };
  }
};

// ECharts 懒加载验证
const echartsLazyLoadValidation: ValidationRule = {
  name: 'ECharts Lazy Loading Check',
  description: '确认 ECharts 组件使用 EChartsWrapper',
  validate: async () => {
    // 实现逻辑：检查图表组件是否使用 EChartsWrapper
    return { passed: true, message: 'All ECharts components use lazy loading' };
  }
};

// 防御性编程验证
const defensiveProgrammingValidation: ValidationRule = {
  name: 'Defensive Programming Check',
  description: '检查 exportChart 函数的防御性检查',
  validate: async () => {
    // 实现逻辑：检查所有 exportChart 函数是否有 null 检查
    return { passed: true, message: 'All exportChart functions have defensive checks' };
  }
};
```

### 5. 构建优化组件

#### BuildAnalyzer

```typescript
interface BundleInfo {
  name: string;
  size: number;
  gzipSize: number;
  modules: ModuleInfo[];
}

interface ModuleInfo {
  name: string;
  size: number;
  imported: boolean;
  dynamic: boolean;
}

interface OptimizationSuggestion {
  type: 'dynamic-import' | 'code-splitting' | 'tree-shaking' | 'lazy-loading';
  target: string;
  currentSize: number;
  estimatedSaving: number;
  priority: 'high' | 'medium' | 'low';
}

class BuildAnalyzer {
  // 分析构建产物
  async analyzeBuild(): Promise<BundleInfo[]>;
  
  // 识别大型依赖
  async identifyLargeDependencies(threshold: number): Promise<ModuleInfo[]>;
  
  // 生成优化建议
  async generateSuggestions(): Promise<OptimizationSuggestion[]>;
  
  // 验证动态导入
  async validateDynamicImports(): Promise<ValidationResult>;
  
  // 计算大小减少百分比
  calculateSizeReduction(before: number, after: number): number;
}
```

### 6. 健康检查组件

#### ProjectHealthChecker

```typescript
interface HealthCheckResult {
  category: string;
  status: 'healthy' | 'warning' | 'critical';
  issues: HealthIssue[];
}

interface HealthIssue {
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  location?: string;
  suggestion?: string;
}

interface HealthReport {
  timestamp: Date;
  overallStatus: 'healthy' | 'warning' | 'critical';
  checks: HealthCheckResult[];
  summary: {
    total: number;
    healthy: number;
    warnings: number;
    critical: number;
  };
}

class ProjectHealthChecker {
  // 检查临时文件
  async checkTemporaryFiles(): Promise<HealthCheckResult>;
  
  // 检查未归档的 spec
  async checkUnarchived Specs(): Promise<HealthCheckResult>;
  
  // 检查构建警告
  async checkBuildWarnings(): Promise<HealthCheckResult>;
  
  // 检查未使用的依赖
  async checkUnusedDependencies(): Promise<HealthCheckResult>;
  
  // 运行所有检查
  async runAllChecks(): Promise<HealthReport>;
  
  // 生成报告
  async generateReport(report: HealthReport): Promise<void>;
}
```

### 7. 性能监控组件

#### PerformanceBenchmark

```typescript
interface BenchmarkMetrics {
  lcp: number; // Largest Contentful Paint
  fcp: number; // First Contentful Paint
  tti: number; // Time to Interactive
  buildTime: number;
  buildSize: number;
}

interface BenchmarkResult {
  timestamp: Date;
  homepage: BenchmarkMetrics;
  toolPages: {
    toolName: string;
    metrics: BenchmarkMetrics;
  }[];
  build: {
    time: number;
    size: number;
  };
}

interface BenchmarkComparison {
  metric: string;
  baseline: number;
  current: number;
  change: number;
  changePercent: number;
  status: 'improved' | 'degraded' | 'unchanged';
}

class PerformanceBenchmark {
  // 运行基准测试
  async runBenchmark(): Promise<BenchmarkResult>;
  
  // 保存基准数据
  async saveBaseline(result: BenchmarkResult): Promise<void>;
  
  // 加载基准数据
  async loadBaseline(): Promise<BenchmarkResult | null>;
  
  // 比较性能
  async compareWithBaseline(current: BenchmarkResult): Promise<BenchmarkComparison[]>;
  
  // 测量页面加载时间
  async measurePageLoad(url: string): Promise<BenchmarkMetrics>;
}
```

### 8. 依赖审计组件

#### DependencyAuditor

```typescript
interface SecurityVulnerability {
  package: string;
  version: string;
  severity: 'low' | 'moderate' | 'high' | 'critical';
  title: string;
  description: string;
  recommendation: string;
}

interface OutdatedDependency {
  package: string;
  current: string;
  wanted: string;
  latest: string;
  type: 'dependencies' | 'devDependencies';
}

interface UnusedDependency {
  package: string;
  type: 'dependencies' | 'devDependencies';
  reason: string;
}

interface AuditReport {
  timestamp: Date;
  vulnerabilities: SecurityVulnerability[];
  outdated: OutdatedDependency[];
  unused: UnusedDependency[];
  summary: {
    totalVulnerabilities: number;
    criticalVulnerabilities: number;
    outdatedCount: number;
    unusedCount: number;
  };
}

class DependencyAuditor {
  // 运行安全审计
  async runSecurityAudit(): Promise<SecurityVulnerability[]>;
  
  // 检查过时依赖
  async checkOutdated(): Promise<OutdatedDependency[]>;
  
  // 识别未使用依赖
  async findUnused(): Promise<UnusedDependency[]>;
  
  // 生成审计报告
  async generateReport(): Promise<AuditReport>;
}
```

### 9. Git Hooks 组件

#### PreCommitChecker

```typescript
interface CommitCheckResult {
  passed: boolean;
  errors: CommitError[];
  warnings: CommitWarning[];
}

interface CommitError {
  file: string;
  line?: number;
  message: string;
  type: 'console-log' | 'debugger' | 'temporary-file' | 'lint-error';
}

interface CommitWarning {
  file: string;
  message: string;
}

class PreCommitChecker {
  // 获取暂存文件
  async getStagedFiles(): Promise<string[]>;
  
  // 检查 console.log 和 debugger
  async checkDebugStatements(files: string[]): Promise<CommitError[]>;
  
  // 检查临时文件
  async checkTemporaryFiles(files: string[]): Promise<CommitError[]>;
  
  // 运行 ESLint
  async runLint(files: string[]): Promise<CommitError[]>;
  
  // 执行所有检查
  async runAllChecks(): Promise<CommitCheckResult>;
  
  // 显示错误信息
  displayErrors(result: CommitCheckResult): void;
}
```

## 数据模型

### 归档清单格式

```markdown
# 归档清单

归档时间: 2026-01-23

## 归档文件

| 文件名 | 原始路径 | 归档时间 | 用途说明 |
|--------|---------|---------|---------|
| fix_chart_errors.sh | /fix_chart_errors.sh | 2026-01-23 10:30:00 | 修复图表组件错误的临时脚本 |
| fix_accessibility_issues.js | /fix_accessibility_issues.js | 2026-01-23 10:30:00 | 修复可访问性问题的临时脚本 |

## 统计

- 总文件数: 2
- 脚本文件: 2
- 备份文件: 0
```

### Spec 归档索引格式

```markdown
# Spec 归档索引

最后更新: 2026-01-23

## 2026 年已完成 Spec

| Spec 名称 | 完成日期 | 主要成果 | 相关文件 |
|----------|---------|---------|---------|
| fix-chart-tools-loading | 2026-01-23 | 修复 42 个图表工具的懒加载问题 | EChartsWrapper.tsx |
| comprehensive-project-cleanup | 2026-01-23 | 建立项目清理和优化系统 | 多个脚本和文档 |

## 统计

- 2026 年完成: 2
- 总计完成: 2
```

### 健康检查报告格式

```markdown
# 项目健康检查报告

生成时间: 2026-01-23 10:30:00
总体状态: ⚠️ 警告

## 检查结果

### 1. 临时文件检查 ⚠️ 警告

发现 5 个临时文件:
- fix_chart_errors.sh (根目录)
- fix_accessibility_issues.js (根目录)
- temp_test.js (根目录)

建议: 运行 `npm run cleanup:temp-files` 清理临时文件

### 2. Spec 归档检查 ✅ 健康

所有已完成的 spec 都已归档

### 3. 构建警告检查 ⚠️ 警告

发现 3 个构建警告:
- Type export warning in calculator-utils.ts
- Unused import in Header.svelte

建议: 运行 `npm run fix:types` 修复类型问题

### 4. 未使用依赖检查 ✅ 健康

未发现未使用的依赖

## 统计

- 总检查项: 4
- 健康: 2
- 警告: 2
- 严重: 0
```

### 性能基准数据格式

```json
{
  "timestamp": "2026-01-23T10:30:00.000Z",
  "homepage": {
    "lcp": 1200,
    "fcp": 800,
    "tti": 1500,
    "buildTime": 45000,
    "buildSize": 2500000
  },
  "toolPages": [
    {
      "toolName": "loan-calculator",
      "metrics": {
        "lcp": 1000,
        "fcp": 600,
        "tti": 1200,
        "buildTime": 0,
        "buildSize": 150000
      }
    }
  ],
  "build": {
    "time": 45000,
    "size": 2500000
  }
}
```

### 依赖审计报告格式

```markdown
# 依赖审计报告

生成时间: 2026-01-23 10:30:00

## 安全漏洞

### 🔴 严重 (0)

无严重漏洞

### 🟠 高危 (0)

无高危漏洞

### 🟡 中危 (1)

- **package-name** v1.2.3
  - 描述: XSS vulnerability in package
  - 建议: 升级到 v1.2.4

## 过时依赖

| 包名 | 当前版本 | 最新版本 | 类型 |
|------|---------|---------|------|
| astro | 5.8.0 | 5.9.0 | dependencies |
| typescript | 5.7.0 | 5.8.0 | devDependencies |

## 未使用依赖

| 包名 | 类型 | 原因 |
|------|------|------|
| unused-package | devDependencies | 未在代码中引用 |

## 统计

- 总漏洞: 1 (严重: 0, 高危: 0, 中危: 1, 低危: 0)
- 过时依赖: 2
- 未使用依赖: 1
```

## 正确性属性

*属性是一个特征或行为，应该在系统的所有有效执行中保持为真——本质上是关于系统应该做什么的正式陈述。属性作为人类可读规范和机器可验证正确性保证之间的桥梁。*


### 属性 1: 临时文件识别完整性

*对于任何*根目录中的文件，如果文件名匹配 `fix_*.sh`、`fix_*.js`、`test_*.*` 或纯数字模式，则清理系统应该将其识别为临时文件（除非在 .gitignore 中明确排除）

**验证需求: 1.1, 1.5**

### 属性 2: 文件归档保持完整性

*对于任何*被识别的临时文件集合，归档操作后，所有文件应该存在于归档目录中，且根目录中不再存在这些文件

**验证需求: 1.2, 1.4**

### 属性 3: 归档清单完整性

*对于任何*归档操作，生成的清单文件应该包含所有被归档文件的完整信息（文件名、原始路径、归档时间、用途说明）

**验证需求: 1.3**

### 属性 4: 类型导出完整性

*对于任何*在 calculator-utils.ts 中定义的接口类型，如果它被其他文件引用，则它必须被导出并包含 JSDoc 注释

**验证需求: 2.1, 2.4**

### 属性 5: 构建无警告

*对于任何*成功的构建，不应该产生任何 TypeScript 类型导出相关的警告

**验证需求: 2.2**

### 属性 6: 类型兼容性保持

*对于任何*现有组件，在添加类型导出后，其类型检查应该继续通过，不产生新的类型错误

**验证需求: 2.3**

### 属性 7: Spec 归档条件验证

*对于任何* spec，只有当其 tasks.md 中所有任务都标记为完成时，才能被归档到 completed 目录

**验证需求: 3.6**

### 属性 8: Spec 归档路径正确性

*对于任何*已完成的 spec，归档后应该位于 `.kiro/specs/archive/completed/{year}/` 目录，其中 year 是完成年份

**验证需求: 3.2**

### 属性 9: 归档索引一致性

*对于任何*归档操作，ARCHIVE_INDEX.md 文件应该包含该 spec 的条目，且条目信息与 spec 实际状态一致

**验证需求: 3.3**

### 属性 10: React Hooks 依赖正确性

*对于任何*使用 useEffect/useMemo/useCallback 的组件，其依赖数组不应该包含翻译函数 `t`（因为它每次渲染都是新引用）

**验证需求: 4.1**

### 属性 11: ECharts 懒加载一致性

*对于任何*使用 ECharts 的图表组件，应该使用 EChartsWrapper 进行懒加载，而不是直接导入 echarts 模块

**验证需求: 4.2**

### 属性 12: 防御性编程完整性

*对于任何*图表组件的 exportChart 函数，在调用 echartInstance 方法前，必须检查 chartRef.current 和 echartInstance 是否存在

**验证需求: 4.3**

### 属性 13: 翻译完整性

*对于任何*支持的语言（10 种），所有工具的翻译键应该完整存在，不应该有 MISSING_MESSAGE 错误

**验证需求: 4.4**

### 属性 14: 大型依赖标记

*对于任何*构建产物中大小超过 100KB 的模块，构建分析报告应该标记它并提供优化建议

**验证需求: 5.2**

### 属性 15: 动态导入一致性

*对于任何*工具组件，应该使用动态导入（dynamic import）而不是静态导入，以实现代码分割

**验证需求: 5.3**

### 属性 16: 大型库懒加载

*对于任何*大型库（ECharts, XLSX, PDF），应该使用懒加载机制，不在模块级别同步导入

**验证需求: 5.4**

### 属性 17: 临时文件检测

*对于任何*根目录中的文件，如果匹配临时文件模式（fix_*, test_*, temp_*, 纯数字），健康检查应该检测并报告它

**验证需求: 7.2**

### 属性 18: 未归档 Spec 检测

*对于任何* spec，如果其 tasks.md 中所有任务都已完成但未归档，健康检查应该检测并报告它

**验证需求: 7.3**

### 属性 19: 构建警告检测

*对于任何*构建过程，如果产生警告或错误，健康检查应该检测并在报告中列出

**验证需求: 7.4**

### 属性 20: 未使用依赖检测

*对于任何* package.json 中声明的依赖，如果在代码中未被引用，依赖审计应该识别并报告它

**验证需求: 7.5, 9.3**

### 属性 21: 健康检查报告生成

*对于任何*健康检查执行，应该生成包含所有检查结果的 PROJECT_HEALTH_REPORT.md 文件

**验证需求: 7.6**

### 属性 22: 性能基准数据持久化

*对于任何*基准测试执行，结果应该保存到 benchmarks/baseline.json 文件，且格式符合 BenchmarkResult 接口

**验证需求: 8.5**

### 属性 23: 性能对比准确性

*对于任何*两次基准测试结果，对比功能应该准确计算每个指标的变化量和变化百分比

**验证需求: 8.6**

### 属性 24: 安全漏洞优先级标记

*对于任何*依赖审计发现的安全漏洞，如果严重程度为 critical 或 high，应该在报告中标记为高优先级

**验证需求: 9.5**

### 属性 25: Pre-commit 拦截

*对于任何*包含 console.log、debugger 语句或临时文件的提交，pre-commit hook 应该阻止提交并显示错误信息

**验证需求: 10.2, 10.3, 10.5**

### 属性 26: ESLint 集成

*对于任何*暂存的 TypeScript/JavaScript 文件，pre-commit hook 应该运行 ESLint 检查，如果有错误则阻止提交

**验证需求: 10.4, 10.5**


## 错误处理

### 错误类型

1. **文件系统错误**
   - 文件不存在
   - 权限不足
   - 磁盘空间不足
   - 处理: 记录错误日志，跳过该文件，继续处理其他文件

2. **解析错误**
   - tasks.md 格式错误
   - package.json 格式错误
   - TypeScript 解析失败
   - 处理: 记录详细错误信息，提供修复建议，终止当前操作

3. **验证错误**
   - Spec 任务未完成
   - 类型兼容性检查失败
   - 构建失败
   - 处理: 显示详细错误信息，阻止操作继续，要求用户修复

4. **网络错误**
   - npm audit 失败
   - 依赖下载失败
   - 处理: 重试 3 次，失败后记录错误，继续其他检查

5. **Git 操作错误**
   - 无法获取暂存文件
   - Git 命令执行失败
   - 处理: 显示错误信息，提供手动操作建议

### 错误恢复策略

```typescript
interface ErrorRecoveryStrategy {
  maxRetries: number;
  retryDelay: number;
  fallbackAction?: () => Promise<void>;
  skipOnError: boolean;
}

class ErrorHandler {
  async handleWithRetry<T>(
    operation: () => Promise<T>,
    strategy: ErrorRecoveryStrategy
  ): Promise<T | null> {
    let lastError: Error | null = null;
    
    for (let i = 0; i < strategy.maxRetries; i++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error as Error;
        if (i < strategy.maxRetries - 1) {
          await this.delay(strategy.retryDelay);
        }
      }
    }
    
    // 所有重试都失败
    if (strategy.fallbackAction) {
      await strategy.fallbackAction();
    }
    
    if (strategy.skipOnError) {
      console.warn(`Operation failed after ${strategy.maxRetries} retries:`, lastError);
      return null;
    }
    
    throw lastError;
  }
  
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
```

### 日志记录

```typescript
enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
}

interface LogEntry {
  timestamp: Date;
  level: LogLevel;
  category: string;
  message: string;
  details?: any;
}

class Logger {
  private logs: LogEntry[] = [];
  
  log(level: LogLevel, category: string, message: string, details?: any): void {
    const entry: LogEntry = {
      timestamp: new Date(),
      level,
      category,
      message,
      details,
    };
    
    this.logs.push(entry);
    
    // 控制台输出
    const color = this.getColor(level);
    console.log(`[${entry.timestamp.toISOString()}] ${color}${level.toUpperCase()}${this.resetColor()} [${category}] ${message}`);
    
    if (details) {
      console.log(details);
    }
  }
  
  async saveToFile(filePath: string): Promise<void> {
    const content = this.logs.map(entry => 
      `[${entry.timestamp.toISOString()}] ${entry.level.toUpperCase()} [${entry.category}] ${entry.message}${entry.details ? '\n' + JSON.stringify(entry.details, null, 2) : ''}`
    ).join('\n\n');
    
    await fs.writeFile(filePath, content, 'utf-8');
  }
  
  private getColor(level: LogLevel): string {
    switch (level) {
      case LogLevel.DEBUG: return '\x1b[36m'; // Cyan
      case LogLevel.INFO: return '\x1b[32m';  // Green
      case LogLevel.WARN: return '\x1b[33m';  // Yellow
      case LogLevel.ERROR: return '\x1b[31m'; // Red
    }
  }
  
  private resetColor(): string {
    return '\x1b[0m';
  }
}
```


## 测试策略

### 测试方法

本项目采用**双重测试方法**：

1. **单元测试**: 验证特定示例、边缘情况和错误条件
2. **属性测试**: 验证跨所有输入的通用属性

两者是互补的，对于全面覆盖都是必要的。

### 单元测试重点

单元测试应该专注于:
- 特定示例，展示正确行为
- 组件之间的集成点
- 边缘情况和错误条件

避免编写过多单元测试 - 基于属性的测试处理大量输入的覆盖。

### 属性测试配置

- **测试库**: 使用 Vitest + fast-check (JavaScript/TypeScript 的属性测试库)
- **最小迭代次数**: 每个属性测试 100 次迭代（由于随机化）
- **标记格式**: `// Feature: comprehensive-project-cleanup, Property {number}: {property_text}`
- **要求**: 每个正确性属性必须由单个属性测试实现

### 测试用例示例

#### 单元测试示例

```typescript
import { describe, it, expect } from 'vitest';
import { CleanupManager } from '../scripts/cleanup/CleanupManager';

describe('CleanupManager', () => {
  it('should identify fix_*.sh files as temporary', async () => {
    const manager = new CleanupManager({ dryRun: true });
    const files = await manager.identifyTemporaryFiles();
    
    expect(files).toContain('fix_chart_errors.sh');
    expect(files).toContain('fix_accessibility_issues.sh');
  });
  
  it('should respect .gitignore rules', async () => {
    const manager = new CleanupManager({ respectGitignore: true });
    const isIgnored = await manager.isIgnored('node_modules/test.js');
    
    expect(isIgnored).toBe(true);
  });
  
  it('should handle missing archive directory', async () => {
    const manager = new CleanupManager({ archivePath: '/nonexistent' });
    
    await expect(manager.archiveFiles(['test.sh']))
      .rejects.toThrow('Archive directory does not exist');
  });
});
```

#### 属性测试示例

```typescript
import { describe, it } from 'vitest';
import * as fc from 'fast-check';
import { CleanupManager } from '../scripts/cleanup/CleanupManager';

describe('CleanupManager Property Tests', () => {
  // Feature: comprehensive-project-cleanup, Property 1: 临时文件识别完整性
  it('should identify all files matching temporary patterns', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.array(fc.string({ minLength: 1, maxLength: 50 })),
        async (filenames) => {
          const manager = new CleanupManager({ dryRun: true });
          
          // 创建测试文件
          const tempFiles = filenames.filter(name => 
            /^fix_.*\.(sh|js)$/.test(name) || 
            /^test_.*$/.test(name) ||
            /^\d+$/.test(name)
          );
          
          const identified = await manager.identifyTemporaryFiles();
          
          // 所有匹配模式的文件都应该被识别
          tempFiles.forEach(file => {
            expect(identified).toContain(file);
          });
        }
      ),
      { numRuns: 100 }
    );
  });
  
  // Feature: comprehensive-project-cleanup, Property 2: 文件归档保持完整性
  it('should move all identified files to archive', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.array(fc.string({ minLength: 5, maxLength: 20 }), { minLength: 1, maxLength: 10 }),
        async (files) => {
          const manager = new CleanupManager({ dryRun: false });
          
          const result = await manager.archiveFiles(files);
          
          // 所有文件都应该被移动
          expect(result.filesMoved.length).toBe(files.length);
          
          // 根目录不应该再有这些文件
          for (const file of files) {
            const exists = await fs.pathExists(file);
            expect(exists).toBe(false);
          }
          
          // 归档目录应该有这些文件
          for (const file of files) {
            const archivePath = path.join(manager.options.archivePath!, file);
            const exists = await fs.pathExists(archivePath);
            expect(exists).toBe(true);
          }
        }
      ),
      { numRuns: 100 }
    );
  });
});
```

### 集成测试

```typescript
describe('End-to-End Cleanup Flow', () => {
  it('should complete full cleanup workflow', async () => {
    // 1. 创建临时文件
    await createTestFiles([
      'fix_test1.sh',
      'fix_test2.js',
      'temp_file.txt',
    ]);
    
    // 2. 运行清理
    const manager = new CleanupManager({
      respectGitignore: true,
      archivePath: 'scripts/archive/legacy-fixes',
    });
    
    const result = await manager.archiveFiles(
      await manager.identifyTemporaryFiles()
    );
    
    // 3. 验证结果
    expect(result.filesMoved.length).toBe(3);
    expect(await fs.pathExists('fix_test1.sh')).toBe(false);
    expect(await fs.pathExists('scripts/archive/legacy-fixes/ARCHIVE_MANIFEST.md')).toBe(true);
    
    // 4. 验证清单内容
    const manifest = await fs.readFile('scripts/archive/legacy-fixes/ARCHIVE_MANIFEST.md', 'utf-8');
    expect(manifest).toContain('fix_test1.sh');
    expect(manifest).toContain('fix_test2.js');
    expect(manifest).toContain('temp_file.txt');
  });
});
```

### 测试覆盖率目标

- **语句覆盖率**: > 80%
- **分支覆盖率**: > 75%
- **函数覆盖率**: > 85%
- **行覆盖率**: > 80%

### 持续集成

```yaml
# .github/workflows/test.yml
name: Test

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run test:coverage
      - uses: codecov/codecov-action@v3
        with:
          files: ./coverage/coverage-final.json
```


## 实现细节

### 文件清理实现

#### 1. 临时文件识别

```typescript
// scripts/cleanup/identify-temp-files.ts
import * as glob from 'glob';
import * as path from 'path';
import * as fs from 'fs-extra';
import ignore from 'ignore';

export async function identifyTemporaryFiles(rootDir: string): Promise<string[]> {
  const patterns = [
    'fix_*.sh',
    'fix_*.js',
    'fix_*.ts',
    'test_*.*',
    'temp_*',
    '[0-9]', // 单个数字文件
    '[0-9][0-9]', // 两位数字文件
    '*.bak',
  ];
  
  // 读取 .gitignore
  const gitignorePath = path.join(rootDir, '.gitignore');
  const ig = ignore();
  
  if (await fs.pathExists(gitignorePath)) {
    const gitignoreContent = await fs.readFile(gitignorePath, 'utf-8');
    ig.add(gitignoreContent);
  }
  
  const tempFiles: string[] = [];
  
  for (const pattern of patterns) {
    const files = glob.sync(pattern, { cwd: rootDir, absolute: false });
    
    for (const file of files) {
      // 检查是否在 gitignore 中
      if (!ig.ignores(file)) {
        tempFiles.push(file);
      }
    }
  }
  
  return tempFiles;
}
```

#### 2. 文件归档

```typescript
// scripts/cleanup/archive-files.ts
import * as fs from 'fs-extra';
import * as path from 'path';

export interface ArchiveOptions {
  sourceDir: string;
  archiveDir: string;
  files: string[];
  dryRun?: boolean;
}

export interface ArchiveResult {
  filesMoved: string[];
  filesSkipped: string[];
  errors: Array<{ file: string; error: string }>;
}

export async function archiveFiles(options: ArchiveOptions): Promise<ArchiveResult> {
  const { sourceDir, archiveDir, files, dryRun = false } = options;
  const result: ArchiveResult = {
    filesMoved: [],
    filesSkipped: [],
    errors: [],
  };
  
  // 确保归档目录存在
  if (!dryRun) {
    await fs.ensureDir(archiveDir);
  }
  
  for (const file of files) {
    const sourcePath = path.join(sourceDir, file);
    const destPath = path.join(archiveDir, file);
    
    try {
      // 检查源文件是否存在
      if (!(await fs.pathExists(sourcePath))) {
        result.filesSkipped.push(file);
        continue;
      }
      
      if (dryRun) {
        console.log(`[DRY RUN] Would move: ${sourcePath} -> ${destPath}`);
        result.filesMoved.push(file);
      } else {
        // 移动文件
        await fs.move(sourcePath, destPath, { overwrite: false });
        result.filesMoved.push(file);
        console.log(`Moved: ${file}`);
      }
    } catch (error) {
      result.errors.push({
        file,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }
  
  return result;
}
```

#### 3. 归档清单生成

```typescript
// scripts/cleanup/generate-manifest.ts
import * as fs from 'fs-extra';
import * as path from 'path';

export interface ManifestEntry {
  filename: string;
  originalPath: string;
  archivedAt: Date;
  description: string;
}

export async function generateManifest(
  archiveDir: string,
  entries: ManifestEntry[]
): Promise<void> {
  const manifestPath = path.join(archiveDir, 'ARCHIVE_MANIFEST.md');
  
  let content = '# 归档清单\n\n';
  content += `归档时间: ${new Date().toISOString()}\n\n`;
  content += '## 归档文件\n\n';
  content += '| 文件名 | 原始路径 | 归档时间 | 用途说明 |\n';
  content += '|--------|---------|---------|----------|\n';
  
  for (const entry of entries) {
    content += `| ${entry.filename} | ${entry.originalPath} | ${entry.archivedAt.toISOString()} | ${entry.description} |\n`;
  }
  
  content += '\n## 统计\n\n';
  content += `- 总文件数: ${entries.length}\n`;
  
  const scriptCount = entries.filter(e => e.filename.match(/\.(sh|js|ts)$/)).length;
  const backupCount = entries.filter(e => e.filename.endsWith('.bak')).length;
  
  content += `- 脚本文件: ${scriptCount}\n`;
  content += `- 备份文件: ${backupCount}\n`;
  
  await fs.writeFile(manifestPath, content, 'utf-8');
}
```

### Spec 管理实现

#### 1. Spec 状态检测

```typescript
// scripts/spec-lifecycle/check-spec-status.ts
import * as fs from 'fs-extra';
import * as path from 'path';

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  subtasks?: Task[];
}

export interface SpecStatus {
  name: string;
  path: string;
  tasksCompleted: number;
  tasksTotal: number;
  allCompleted: boolean;
}

export async function checkSpecStatus(specPath: string): Promise<SpecStatus> {
  const tasksPath = path.join(specPath, 'tasks.md');
  
  if (!(await fs.pathExists(tasksPath))) {
    throw new Error(`tasks.md not found in ${specPath}`);
  }
  
  const content = await fs.readFile(tasksPath, 'utf-8');
  const tasks = parseTasksMarkdown(content);
  
  const { completed, total } = countTasks(tasks);
  
  return {
    name: path.basename(specPath),
    path: specPath,
    tasksCompleted: completed,
    tasksTotal: total,
    allCompleted: completed === total && total > 0,
  };
}

function parseTasksMarkdown(content: string): Task[] {
  const lines = content.split('\n');
  const tasks: Task[] = [];
  const stack: Array<{ task: Task; indent: number }> = [];
  
  for (const line of lines) {
    const match = line.match(/^(\s*)- \[([ x])\] (.+)$/);
    if (!match) continue;
    
    const indent = match[1].length;
    const completed = match[2] === 'x';
    const title = match[3];
    
    const task: Task = {
      id: title.split(' ')[0],
      title,
      completed,
      subtasks: [],
    };
    
    // 处理嵌套
    while (stack.length > 0 && stack[stack.length - 1].indent >= indent) {
      stack.pop();
    }
    
    if (stack.length === 0) {
      tasks.push(task);
    } else {
      const parent = stack[stack.length - 1].task;
      if (!parent.subtasks) parent.subtasks = [];
      parent.subtasks.push(task);
    }
    
    stack.push({ task, indent });
  }
  
  return tasks;
}

function countTasks(tasks: Task[]): { completed: number; total: number } {
  let completed = 0;
  let total = 0;
  
  for (const task of tasks) {
    total++;
    if (task.completed) completed++;
    
    if (task.subtasks && task.subtasks.length > 0) {
      const subtaskCount = countTasks(task.subtasks);
      completed += subtaskCount.completed;
      total += subtaskCount.total;
    }
  }
  
  return { completed, total };
}
```


#### 2. Spec 归档

```typescript
// scripts/spec-lifecycle/archive-spec.ts
import * as fs from 'fs-extra';
import * as path from 'path';
import { checkSpecStatus } from './check-spec-status';

export interface ArchiveSpecOptions {
  specName: string;
  archiveType: 'completed' | 'deprecated' | 'cancelled';
  reason?: string;
  force?: boolean;
}

export async function archiveSpec(options: ArchiveSpecOptions): Promise<void> {
  const { specName, archiveType, reason, force = false } = options;
  
  const specPath = path.join('.kiro/specs', specName);
  
  // 检查 spec 是否存在
  if (!(await fs.pathExists(specPath))) {
    throw new Error(`Spec not found: ${specName}`);
  }
  
  // 检查任务完成状态
  if (archiveType === 'completed' && !force) {
    const status = await checkSpecStatus(specPath);
    if (!status.allCompleted) {
      throw new Error(
        `Cannot archive incomplete spec. ${status.tasksCompleted}/${status.tasksTotal} tasks completed. Use --force to override.`
      );
    }
  }
  
  // 确定归档目录
  const year = new Date().getFullYear();
  const archiveDir = path.join('.kiro/specs/archive', archiveType, year.toString());
  await fs.ensureDir(archiveDir);
  
  // 移动 spec
  const destPath = path.join(archiveDir, specName);
  await fs.move(specPath, destPath);
  
  console.log(`✓ Archived ${specName} to ${archiveDir}`);
  
  // 更新归档索引
  await updateArchiveIndex({
    specName,
    archiveType,
    year,
    reason,
  });
}

interface IndexEntry {
  specName: string;
  archiveType: string;
  year: number;
  reason?: string;
}

async function updateArchiveIndex(entry: IndexEntry): Promise<void> {
  const indexPath = path.join('.kiro/specs/archive', 'ARCHIVE_INDEX.md');
  
  let content: string;
  if (await fs.pathExists(indexPath)) {
    content = await fs.readFile(indexPath, 'utf-8');
  } else {
    content = '# Spec 归档索引\n\n';
    content += `最后更新: ${new Date().toISOString()}\n\n`;
  }
  
  // 更新最后更新时间
  content = content.replace(
    /最后更新: .+/,
    `最后更新: ${new Date().toISOString()}`
  );
  
  // 添加新条目
  const yearSection = `## ${entry.year} 年${entry.archiveType === 'completed' ? '已完成' : entry.archiveType === 'deprecated' ? '已废弃' : '已取消'} Spec`;
  
  if (!content.includes(yearSection)) {
    content += `\n${yearSection}\n\n`;
    content += '| Spec 名称 | 完成日期 | 主要成果 | 相关文件 |\n';
    content += '|----------|---------|---------|----------|\n';
  }
  
  // 在对应年份部分添加条目
  const newRow = `| ${entry.specName} | ${new Date().toISOString().split('T')[0]} | ${entry.reason || 'N/A'} | - |\n`;
  
  // 找到年份部分并插入
  const sectionIndex = content.indexOf(yearSection);
  const tableEndIndex = content.indexOf('\n\n', sectionIndex + yearSection.length);
  
  if (tableEndIndex === -1) {
    content += newRow;
  } else {
    content = content.slice(0, tableEndIndex) + newRow + content.slice(tableEndIndex);
  }
  
  await fs.writeFile(indexPath, content, 'utf-8');
}
```

### 类型修复实现

#### 1. 类型导出添加

```typescript
// scripts/type-fixes/add-type-exports.ts
import { Project, SourceFile, InterfaceDeclaration, TypeAliasDeclaration } from 'ts-morph';

export interface TypeExportOptions {
  filePath: string;
  typeNames: string[];
  addJSDoc?: boolean;
}

export async function addTypeExports(options: TypeExportOptions): Promise<void> {
  const { filePath, typeNames, addJSDoc = true } = options;
  
  const project = new Project();
  const sourceFile = project.addSourceFileAtPath(filePath);
  
  for (const typeName of typeNames) {
    // 查找类型声明
    const interfaceDecl = sourceFile.getInterface(typeName);
    const typeAliasDecl = sourceFile.getTypeAlias(typeName);
    
    const decl = interfaceDecl || typeAliasDecl;
    
    if (!decl) {
      console.warn(`Type ${typeName} not found in ${filePath}`);
      continue;
    }
    
    // 检查是否已导出
    if (decl.isExported()) {
      console.log(`Type ${typeName} is already exported`);
      continue;
    }
    
    // 添加 export 关键字
    decl.setIsExported(true);
    
    // 添加 JSDoc 注释
    if (addJSDoc && !decl.getJsDocs().length) {
      const jsDoc = generateJSDoc(typeName, decl);
      decl.insertJsDoc(0, jsDoc);
    }
    
    console.log(`✓ Exported type: ${typeName}`);
  }
  
  await sourceFile.save();
}

function generateJSDoc(
  typeName: string,
  decl: InterfaceDeclaration | TypeAliasDeclaration
): string {
  // 根据类型名称生成合适的 JSDoc 注释
  const descriptions: Record<string, string> = {
    LoanResult: '贷款计算结果',
    BmiResult: 'BMI 计算结果',
    AgeResult: '年龄计算结果',
    TipResult: '小费计算结果',
    DiscountResult: '折扣计算结果',
    CompoundInterestResult: '复利计算结果',
    BinaryResult: '二进制计算结果',
    HexResult: '十六进制计算结果',
    SubnetResult: '子网计算结果',
    AspectRatioResult: '宽高比计算结果',
    TypingTestResult: '打字测试结果',
  };
  
  const description = descriptions[typeName] || `${typeName} 类型定义`;
  
  return `/**\n * ${description}\n */`;
}
```

### 验证实现

#### 1. React Hooks 依赖验证

```typescript
// scripts/validation/validate-hooks-dependencies.ts
import * as fs from 'fs-extra';
import * as path from 'path';
import * as glob from 'glob';

export interface HooksDependencyIssue {
  file: string;
  line: number;
  hookType: 'useEffect' | 'useMemo' | 'useCallback';
  issue: string;
}

export async function validateHooksDependencies(): Promise<HooksDependencyIssue[]> {
  const issues: HooksDependencyIssue[] = [];
  
  // 查找所有 Svelte 组件
  const files = glob.sync('src/components/**/*.svelte');
  
  for (const file of files) {
    const content = await fs.readFile(file, 'utf-8');
    const lines = content.split('\n');
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // 检查 useEffect/useMemo/useCallback
      const hookMatch = line.match(/(useEffect|useMemo|useCallback)\s*\(/);
      if (!hookMatch) continue;
      
      const hookType = hookMatch[1] as 'useEffect' | 'useMemo' | 'useCallback';
      
      // 查找依赖数组
      let bracketCount = 0;
      let inDependencies = false;
      let dependencies = '';
      
      for (let j = i; j < Math.min(i + 20, lines.length); j++) {
        const currentLine = lines[j];
        
        if (currentLine.includes('[') && !inDependencies) {
          inDependencies = true;
        }
        
        if (inDependencies) {
          dependencies += currentLine;
          
          if (currentLine.includes(']')) {
            break;
          }
        }
      }
      
      // 检查是否包含翻译函数 t
      if (dependencies.includes(', t') || dependencies.includes('[t') || dependencies.includes(' t]')) {
        issues.push({
          file,
          line: i + 1,
          hookType,
          issue: 'Translation function "t" should not be in dependencies array',
        });
      }
    }
  }
  
  return issues;
}
```


### 构建优化实现

#### 1. 构建分析

```typescript
// scripts/build-optimization/analyze-build.ts
import * as fs from 'fs-extra';
import * as path from 'path';
import { build } from 'vite';

export interface BuildAnalysisResult {
  totalSize: number;
  gzipSize: number;
  bundles: BundleInfo[];
  largeDependencies: ModuleInfo[];
  suggestions: OptimizationSuggestion[];
}

export async function analyzeBuild(): Promise<BuildAnalysisResult> {
  // 运行构建并生成分析报告
  const buildResult = await build({
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            // 分析模块依赖
            if (id.includes('node_modules')) {
              return 'vendor';
            }
          },
        },
      },
    },
    plugins: [
      {
        name: 'size-analyzer',
        generateBundle(options, bundle) {
          // 收集 bundle 信息
          for (const [fileName, chunk] of Object.entries(bundle)) {
            if (chunk.type === 'chunk') {
              console.log(`${fileName}: ${chunk.code.length} bytes`);
            }
          }
        },
      },
    ],
  });
  
  // 分析构建产物
  const distPath = path.join(process.cwd(), 'dist');
  const bundles = await analyzeBundles(distPath);
  const largeDeps = bundles
    .flatMap(b => b.modules)
    .filter(m => m.size > 100 * 1024) // > 100KB
    .sort((a, b) => b.size - a.size);
  
  const suggestions = generateOptimizationSuggestions(largeDeps);
  
  const totalSize = bundles.reduce((sum, b) => sum + b.size, 0);
  
  return {
    totalSize,
    gzipSize: 0, // TODO: 计算 gzip 大小
    bundles,
    largeDependencies: largeDeps,
    suggestions,
  };
}

async function analyzeBundles(distPath: string): Promise<BundleInfo[]> {
  const bundles: BundleInfo[] = [];
  
  const files = await fs.readdir(distPath, { recursive: true });
  
  for (const file of files) {
    if (typeof file !== 'string') continue;
    if (!file.endsWith('.js')) continue;
    
    const filePath = path.join(distPath, file);
    const stats = await fs.stat(filePath);
    
    bundles.push({
      name: file,
      size: stats.size,
      gzipSize: 0, // TODO
      modules: [], // TODO: 解析模块
    });
  }
  
  return bundles;
}

function generateOptimizationSuggestions(
  largeDeps: ModuleInfo[]
): OptimizationSuggestion[] {
  const suggestions: OptimizationSuggestion[] = [];
  
  for (const dep of largeDeps) {
    if (dep.name.includes('echarts')) {
      suggestions.push({
        type: 'lazy-loading',
        target: dep.name,
        currentSize: dep.size,
        estimatedSaving: dep.size * 0.8, // 估计可节省 80%
        priority: 'high',
      });
    } else if (dep.name.includes('xlsx') || dep.name.includes('pdf')) {
      suggestions.push({
        type: 'lazy-loading',
        target: dep.name,
        currentSize: dep.size,
        estimatedSaving: dep.size * 0.9,
        priority: 'high',
      });
    } else if (!dep.dynamic) {
      suggestions.push({
        type: 'dynamic-import',
        target: dep.name,
        currentSize: dep.size,
        estimatedSaving: dep.size * 0.5,
        priority: 'medium',
      });
    }
  }
  
  return suggestions;
}
```

### 健康检查实现

#### 1. 项目健康检查

```typescript
// scripts/maintenance/check-project-health.ts
import { identifyTemporaryFiles } from '../cleanup/identify-temp-files';
import { checkSpecStatus } from '../spec-lifecycle/check-spec-status';
import { validateHooksDependencies } from '../validation/validate-hooks-dependencies';
import * as fs from 'fs-extra';
import * as path from 'path';
import * as glob from 'glob';

export async function checkProjectHealth(): Promise<HealthReport> {
  const checks: HealthCheckResult[] = [];
  
  // 1. 检查临时文件
  checks.push(await checkTemporaryFiles());
  
  // 2. 检查未归档的 spec
  checks.push(await checkUnarchivedSpecs());
  
  // 3. 检查构建警告
  checks.push(await checkBuildWarnings());
  
  // 4. 检查未使用的依赖
  checks.push(await checkUnusedDependencies());
  
  // 计算总体状态
  const criticalCount = checks.filter(c => c.status === 'critical').length;
  const warningCount = checks.filter(c => c.status === 'warning').length;
  
  const overallStatus = criticalCount > 0 ? 'critical' : warningCount > 0 ? 'warning' : 'healthy';
  
  const report: HealthReport = {
    timestamp: new Date(),
    overallStatus,
    checks,
    summary: {
      total: checks.length,
      healthy: checks.filter(c => c.status === 'healthy').length,
      warnings: warningCount,
      critical: criticalCount,
    },
  };
  
  // 生成报告
  await generateHealthReport(report);
  
  return report;
}

async function checkTemporaryFiles(): Promise<HealthCheckResult> {
  const tempFiles = await identifyTemporaryFiles(process.cwd());
  
  if (tempFiles.length === 0) {
    return {
      category: '临时文件检查',
      status: 'healthy',
      issues: [],
    };
  }
  
  return {
    category: '临时文件检查',
    status: 'warning',
    issues: tempFiles.map(file => ({
      severity: 'medium',
      description: `发现临时文件: ${file}`,
      location: file,
      suggestion: '运行 npm run cleanup:temp-files 清理临时文件',
    })),
  };
}

async function checkUnarchivedSpecs(): Promise<HealthCheckResult> {
  const specsDir = path.join('.kiro/specs');
  const specs = await fs.readdir(specsDir);
  
  const unarchivedCompleted: string[] = [];
  
  for (const spec of specs) {
    if (spec === 'archive') continue;
    
    const specPath = path.join(specsDir, spec);
    const stat = await fs.stat(specPath);
    
    if (!stat.isDirectory()) continue;
    
    try {
      const status = await checkSpecStatus(specPath);
      if (status.allCompleted) {
        unarchivedCompleted.push(spec);
      }
    } catch (error) {
      // Spec 没有 tasks.md，跳过
    }
  }
  
  if (unarchivedCompleted.length === 0) {
    return {
      category: 'Spec 归档检查',
      status: 'healthy',
      issues: [],
    };
  }
  
  return {
    category: 'Spec 归档检查',
    status: 'warning',
    issues: unarchivedCompleted.map(spec => ({
      severity: 'low',
      description: `Spec ${spec} 已完成但未归档`,
      location: path.join('.kiro/specs', spec),
      suggestion: `运行 npm run spec:archive ${spec} completed`,
    })),
  };
}

async function checkBuildWarnings(): Promise<HealthCheckResult> {
  // 运行构建并捕获输出
  const { exec } = require('child_process');
  const { promisify } = require('util');
  const execAsync = promisify(exec);
  
  try {
    const { stdout, stderr } = await execAsync('npm run build');
    const output = stdout + stderr;
    
    // 解析警告
    const warnings = output.match(/warning:.+/gi) || [];
    
    if (warnings.length === 0) {
      return {
        category: '构建警告检查',
        status: 'healthy',
        issues: [],
      };
    }
    
    return {
      category: '构建警告检查',
      status: 'warning',
      issues: warnings.map(warning => ({
        severity: 'medium',
        description: warning,
        suggestion: '修复构建警告以提高代码质量',
      })),
    };
  } catch (error) {
    return {
      category: '构建警告检查',
      status: 'critical',
      issues: [{
        severity: 'critical',
        description: '构建失败',
        suggestion: '修复构建错误',
      }],
    };
  }
}

async function checkUnusedDependencies(): Promise<HealthCheckResult> {
  // 使用 depcheck 检查未使用的依赖
  const depcheck = require('depcheck');
  
  return new Promise((resolve) => {
    depcheck(process.cwd(), {}, (unused: any) => {
      const unusedDeps = [
        ...unused.dependencies,
        ...unused.devDependencies,
      ];
      
      if (unusedDeps.length === 0) {
        resolve({
          category: '未使用依赖检查',
          status: 'healthy',
          issues: [],
        });
      } else {
        resolve({
          category: '未使用依赖检查',
          status: 'warning',
          issues: unusedDeps.map(dep => ({
            severity: 'low',
            description: `未使用的依赖: ${dep}`,
            suggestion: `考虑移除未使用的依赖以减小包大小`,
          })),
        });
      }
    });
  });
}

async function generateHealthReport(report: HealthReport): Promise<void> {
  let content = '# 项目健康检查报告\n\n';
  content += `生成时间: ${report.timestamp.toISOString()}\n`;
  content += `总体状态: ${getStatusEmoji(report.overallStatus)} ${report.overallStatus.toUpperCase()}\n\n`;
  content += '## 检查结果\n\n';
  
  for (const check of report.checks) {
    content += `### ${check.category} ${getStatusEmoji(check.status)} ${check.status.toUpperCase()}\n\n`;
    
    if (check.issues.length === 0) {
      content += '✅ 无问题\n\n';
    } else {
      for (const issue of check.issues) {
        content += `- **${issue.severity.toUpperCase()}**: ${issue.description}\n`;
        if (issue.location) {
          content += `  - 位置: ${issue.location}\n`;
        }
        if (issue.suggestion) {
          content += `  - 建议: ${issue.suggestion}\n`;
        }
        content += '\n';
      }
    }
  }
  
  content += '## 统计\n\n';
  content += `- 总检查项: ${report.summary.total}\n`;
  content += `- 健康: ${report.summary.healthy}\n`;
  content += `- 警告: ${report.summary.warnings}\n`;
  content += `- 严重: ${report.summary.critical}\n`;
  
  await fs.writeFile('PROJECT_HEALTH_REPORT.md', content, 'utf-8');
}

function getStatusEmoji(status: string): string {
  switch (status) {
    case 'healthy': return '✅';
    case 'warning': return '⚠️';
    case 'critical': return '🔴';
    default: return '❓';
  }
}
```


### 性能监控实现

#### 1. 性能基准测试

```typescript
// scripts/performance/benchmark.ts
import puppeteer from 'puppeteer';
import * as fs from 'fs-extra';
import * as path from 'path';

export async function runBenchmark(): Promise<BenchmarkResult> {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  // 测量首页性能
  const homepage = await measurePageLoad(page, 'http://localhost:4321');
  
  // 测量工具页面性能（随机选择 10 个工具）
  const tools = await getRandomTools(10);
  const toolPages = [];
  
  for (const tool of tools) {
    const metrics = await measurePageLoad(page, `http://localhost:4321/en/tools/${tool}`);
    toolPages.push({
      toolName: tool,
      metrics,
    });
  }
  
  await browser.close();
  
  // 测量构建性能
  const buildMetrics = await measureBuildPerformance();
  
  const result: BenchmarkResult = {
    timestamp: new Date(),
    homepage,
    toolPages,
    build: buildMetrics,
  };
  
  return result;
}

async function measurePageLoad(page: any, url: string): Promise<BenchmarkMetrics> {
  await page.goto(url, { waitUntil: 'networkidle2' });
  
  const metrics = await page.evaluate(() => {
    const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    const paintEntries = performance.getEntriesByType('paint');
    
    const fcp = paintEntries.find(e => e.name === 'first-contentful-paint')?.startTime || 0;
    const lcp = (performance.getEntriesByType('largest-contentful-paint')[0] as any)?.renderTime || 0;
    
    return {
      lcp,
      fcp,
      tti: perfData.domInteractive,
      buildTime: 0,
      buildSize: 0,
    };
  });
  
  return metrics;
}

async function getRandomTools(count: number): Promise<string[]> {
  const toolsConfig = await import('../../src/config/tools');
  const allTools = toolsConfig.tools.map(t => t.slug);
  
  // 随机选择
  const shuffled = allTools.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

async function measureBuildPerformance(): Promise<{ time: number; size: number }> {
  const startTime = Date.now();
  
  // 运行构建
  const { exec } = require('child_process');
  const { promisify } = require('util');
  const execAsync = promisify(exec);
  
  await execAsync('npm run build');
  
  const buildTime = Date.now() - startTime;
  
  // 计算构建产物大小
  const distPath = path.join(process.cwd(), 'dist');
  const size = await calculateDirectorySize(distPath);
  
  return { time: buildTime, size };
}

async function calculateDirectorySize(dirPath: string): Promise<number> {
  let totalSize = 0;
  
  const files = await fs.readdir(dirPath, { recursive: true });
  
  for (const file of files) {
    if (typeof file !== 'string') continue;
    
    const filePath = path.join(dirPath, file);
    const stats = await fs.stat(filePath);
    
    if (stats.isFile()) {
      totalSize += stats.size;
    }
  }
  
  return totalSize;
}

export async function saveBaseline(result: BenchmarkResult): Promise<void> {
  const baselinePath = path.join('benchmarks', 'baseline.json');
  await fs.ensureDir('benchmarks');
  await fs.writeJSON(baselinePath, result, { spaces: 2 });
  console.log(`✓ Baseline saved to ${baselinePath}`);
}

export async function loadBaseline(): Promise<BenchmarkResult | null> {
  const baselinePath = path.join('benchmarks', 'baseline.json');
  
  if (!(await fs.pathExists(baselinePath))) {
    return null;
  }
  
  return await fs.readJSON(baselinePath);
}

export async function compareWithBaseline(
  current: BenchmarkResult
): Promise<BenchmarkComparison[]> {
  const baseline = await loadBaseline();
  
  if (!baseline) {
    throw new Error('No baseline found. Run benchmark with --save-baseline first.');
  }
  
  const comparisons: BenchmarkComparison[] = [];
  
  // 比较首页指标
  comparisons.push(
    compareMetric('Homepage LCP', baseline.homepage.lcp, current.homepage.lcp),
    compareMetric('Homepage FCP', baseline.homepage.fcp, current.homepage.fcp),
    compareMetric('Homepage TTI', baseline.homepage.tti, current.homepage.tti)
  );
  
  // 比较构建指标
  comparisons.push(
    compareMetric('Build Time', baseline.build.time, current.build.time),
    compareMetric('Build Size', baseline.build.size, current.build.size)
  );
  
  return comparisons;
}

function compareMetric(
  metric: string,
  baseline: number,
  current: number
): BenchmarkComparison {
  const change = current - baseline;
  const changePercent = (change / baseline) * 100;
  
  let status: 'improved' | 'degraded' | 'unchanged';
  if (Math.abs(changePercent) < 5) {
    status = 'unchanged';
  } else if (change < 0) {
    status = 'improved';
  } else {
    status = 'degraded';
  }
  
  return {
    metric,
    baseline,
    current,
    change,
    changePercent,
    status,
  };
}
```

### Git Hooks 实现

#### 1. Pre-commit Hook

```bash
#!/bin/bash
# scripts/git-hooks/pre-commit.sh

echo "Running pre-commit checks..."

# 获取暂存文件
STAGED_FILES=$(git diff --cached --name-only --diff-filter=ACM)

if [ -z "$STAGED_FILES" ]; then
  echo "No files to check"
  exit 0
fi

# 检查 console.log 和 debugger
echo "Checking for console.log and debugger statements..."
CONSOLE_LOG_FILES=$(echo "$STAGED_FILES" | xargs grep -l "console\.log" 2>/dev/null || true)
DEBUGGER_FILES=$(echo "$STAGED_FILES" | xargs grep -l "debugger" 2>/dev/null || true)

if [ -n "$CONSOLE_LOG_FILES" ] || [ -n "$DEBUGGER_FILES" ]; then
  echo "❌ Error: Found debug statements in staged files:"
  
  if [ -n "$CONSOLE_LOG_FILES" ]; then
    echo "Files with console.log:"
    echo "$CONSOLE_LOG_FILES"
  fi
  
  if [ -n "$DEBUGGER_FILES" ]; then
    echo "Files with debugger:"
    echo "$DEBUGGER_FILES"
  fi
  
  echo ""
  echo "Please remove debug statements before committing."
  echo "Use 'git commit --no-verify' to bypass this check if necessary."
  exit 1
fi

# 检查临时文件
echo "Checking for temporary files..."
TEMP_FILES=$(echo "$STAGED_FILES" | grep -E "(^fix_|^test_|^temp_|^[0-9]+$)" || true)

if [ -n "$TEMP_FILES" ]; then
  echo "❌ Error: Found temporary files in staged files:"
  echo "$TEMP_FILES"
  echo ""
  echo "Please remove temporary files before committing."
  echo "Use 'git commit --no-verify' to bypass this check if necessary."
  exit 1
fi

# 运行 ESLint
echo "Running ESLint..."
TS_FILES=$(echo "$STAGED_FILES" | grep -E "\.(ts|tsx|js|jsx)$" || true)

if [ -n "$TS_FILES" ]; then
  npx eslint $TS_FILES
  
  if [ $? -ne 0 ]; then
    echo "❌ Error: ESLint found errors"
    echo "Please fix linting errors before committing."
    echo "Use 'git commit --no-verify' to bypass this check if necessary."
    exit 1
  fi
fi

echo "✅ All pre-commit checks passed"
exit 0
```

#### 2. Hook 安装脚本

```typescript
// scripts/git-hooks/install-hooks.ts
import * as fs from 'fs-extra';
import * as path from 'path';

export async function installGitHooks(): Promise<void> {
  const hooksDir = path.join('.git', 'hooks');
  
  // 确保 hooks 目录存在
  await fs.ensureDir(hooksDir);
  
  // 复制 pre-commit hook
  const sourceHook = path.join('scripts', 'git-hooks', 'pre-commit.sh');
  const destHook = path.join(hooksDir, 'pre-commit');
  
  await fs.copy(sourceHook, destHook);
  
  // 设置执行权限
  await fs.chmod(destHook, 0o755);
  
  console.log('✓ Git hooks installed successfully');
}

// 运行安装
if (require.main === module) {
  installGitHooks().catch(console.error);
}
```

## 部署和运维

### 脚本命令

在 package.json 中添加以下脚本命令:

```json
{
  "scripts": {
    "cleanup:temp-files": "tsx scripts/cleanup/cleanup-temp-files.ts",
    "cleanup:dry-run": "tsx scripts/cleanup/cleanup-temp-files.ts --dry-run",
    "spec:list": "tsx scripts/spec-lifecycle/list-active-specs.ts",
    "spec:archive": "tsx scripts/spec-lifecycle/archive-spec.ts",
    "fix:types": "tsx scripts/type-fixes/add-type-exports.ts",
    "validate:fixes": "tsx scripts/validation/validate-historical-fixes.ts",
    "build:analyze": "tsx scripts/build-optimization/analyze-build.ts",
    "health:check": "tsx scripts/maintenance/check-project-health.ts",
    "perf:benchmark": "tsx scripts/performance/benchmark.ts",
    "perf:compare": "tsx scripts/performance/benchmark.ts --compare",
    "deps:audit": "tsx scripts/dependency-audit/audit-dependencies.ts",
    "hooks:install": "tsx scripts/git-hooks/install-hooks.ts"
  }
}
```

### 使用示例

```bash
# 清理临时文件（预览模式）
npm run cleanup:dry-run

# 清理临时文件（实际执行）
npm run cleanup:temp-files

# 列出所有活跃的 spec
npm run spec:list

# 归档已完成的 spec
npm run spec:archive fix-chart-tools-loading completed

# 修复类型导出
npm run fix:types

# 验证历史修复
npm run validate:fixes

# 分析构建产物
npm run build:analyze

# 运行健康检查
npm run health:check

# 运行性能基准测试
npm run perf:benchmark --save-baseline

# 与基准对比
npm run perf:compare

# 运行依赖审计
npm run deps:audit

# 安装 Git hooks
npm run hooks:install
```

### 持续集成配置

```yaml
# .github/workflows/project-health.yml
name: Project Health Check

on:
  schedule:
    - cron: '0 0 * * 0' # 每周日运行
  workflow_dispatch:

jobs:
  health-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run health:check
      - uses: actions/upload-artifact@v3
        with:
          name: health-report
          path: PROJECT_HEALTH_REPORT.md
```

## 总结

本设计文档详细描述了 u2tool 项目全面清理和优化系统的技术实现，包括:

1. **文件清理系统**: 自动识别和归档临时文件
2. **Spec 管理系统**: 完整的 spec 生命周期管理
3. **类型修复系统**: 自动添加类型导出和 JSDoc 注释
4. **验证系统**: 验证历史修复的有效性
5. **构建优化系统**: 分析和优化构建产物
6. **健康检查系统**: 自动检测项目问题
7. **性能监控系统**: 基准测试和性能对比
8. **依赖审计系统**: 安全漏洞和依赖管理
9. **Git Hooks 系统**: 代码质量门禁

所有系统都经过精心设计，具有完整的错误处理、日志记录和测试策略，确保项目的长期可维护性和代码质量。
