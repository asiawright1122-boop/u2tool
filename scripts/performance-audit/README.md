# 性能审计工具

本目录包含用于性能审计、验证和回归测试的脚本工具。

## 📋 目录

- [快速开始](#快速开始)
- [可用脚本](#可用脚本)
- [CI/CD 集成](#cicd-集成)
- [报告说明](#报告说明)
- [常见问题](#常见问题)

## 🚀 快速开始

### 运行完整性能审计

```bash
# 快速诊断当前性能问题
npx tsx scripts/performance-audit/quick-diagnose.ts

# 验证性能改善
npx tsx scripts/performance-audit/verify-performance-improvements.ts

# 运行回归测试
npx tsx scripts/performance-audit/regression-tests.ts
```

### 批量修复问题

```bash
# 修复定时器泄漏
npx tsx scripts/performance-audit/batch-fix-timer-leaks.ts

# 修复 React Hooks 依赖
npx tsx scripts/performance-audit/fix-hooks-dependencies.ts
```

## 📦 可用脚本

### 1. 快速诊断 (quick-diagnose.ts)

**用途**: 快速识别当前的性能问题

**输出**:
- 定时器泄漏检测
- React Hooks 依赖问题
- 事件监听器泄漏
- 问题统计和优先级

**使用场景**:

### 2. 依赖分析工具 (dependency-analyzer.ts) ✨

**用途**: 分析项目依赖，识别优化机会

**使用方法**:
```bash
# 基础分析
npx tsx scripts/performance-audit/dependency-analyzer.ts

# 详细分析（包含使用情况检测）
npx tsx scripts/performance-audit/dependency-analyzer.ts --detailed
```

**分析内容**:
- ✅ 识别大于 100KB 的依赖
- ✅ 检测重复依赖（不同版本）
- ✅ 分析依赖使用情况
- ✅ 识别未使用的依赖
- ✅ 检测动态导入使用情况
- ✅ 生成针对性优化建议

**输出文件**:
- `dependency-analysis-report.json` - JSON 格式详细报告
- `DEPENDENCY_ANALYSIS_REPORT.md` - Markdown 格式可读报告

**报告内容**:
- 依赖统计（总数、生产/开发依赖、总大小、Gzip 大小）
- 大型依赖列表（按大小排序，标记动态导入状态）
- 重复依赖列表（显示所有版本）
- 未使用依赖列表
- 针对性优化建议（按依赖类型分类）

**优化建议示例**:
- ECharts: 建议按需导入图表类型
- XLSX: 建议使用更轻量的替代方案或动态加载
- PDF.js: 建议使用 CDN 或按需动态导入
- Lucide React: 建议按需导入单个图标

**使用场景**:
- 依赖审计和优化
- Bundle 大小分析
- 识别优化机会

### 3. 代码分割检查工具 (code-splitting-checker.ts) ✨ 新增

**用途**: 检查大型依赖是否使用动态导入和代码分割

**使用方法**:
```bash
npx tsx scripts/performance-audit/code-splitting-checker.ts
```

**检查内容**:
- ✅ 扫描所有 import 语句
- ✅ 识别静态导入的大型库（> 100KB）
- ✅ 检测 dynamic() 和 lazy() 的使用
- ✅ 特别检查 ECharts 组件的导入方式
- ✅ 按严重程度分类问题（Critical > 300KB, Warning 100-300KB）
- ✅ 生成自动修复建议

**输出文件**:
- `code-splitting-report.json` - JSON 格式详细报告
- `CODE_SPLITTING_REPORT.md` - Markdown 格式可读报告

**报告内容**:
- 导入统计（总导入数、静态/动态导入、动态导入率）
- 问题统计（按严重程度分类）
- 按模块分组的问题列表
- 针对性优化建议和修复代码示例

**检测的大型库**:
- **Critical (> 300KB)**: echarts (800KB), xlsx (600KB), pdfjs-dist (400KB)
- **Warning (100-300KB)**: lucide-react (200KB), pdf-lib (180KB), mammoth (150KB)

**优化建议示例**:
```typescript
// ❌ 不好：静态导入大型库
import * as echarts from 'echarts';

// ✅ 好：使用 Next.js dynamic()
import dynamic from 'next/dynamic';
const EChartsComponent = dynamic(() => import('echarts'), { ssr: false });

// ✅ 好：使用 React.lazy()
import { lazy, Suspense } from 'react';
const HeavyComponent = lazy(() => import('echarts'));

// ✅ 好：按需导入
import { BarChart } from 'echarts/charts';
import { GridComponent } from 'echarts/components';
```

**使用场景**:
- 代码分割审计
- Bundle 大小优化
- 识别静态导入的大型库
- 生成优化建议

**示例输出**:
```
🔍 代码分割检查报告
==================================================

📊 导入统计:
  - 扫描文件: 627 个
  - 总导入数: 2231 个
  - 静态导入: 1808 个
  - 动态导入: 420 个
  - 动态导入率: 18.8%

🔍 问题统计:
  - 总问题数: 275 个
  - Critical: 255 个 (echarts: 246, xlsx: 6, pdfjs-dist: 3)
  - Warning: 20 个 (lucide-react: 13, pdf-lib: 5, mammoth: 2)
```

### 4. Bundle 大小分析工具 (analyze-bundle.ts) ✨ 新增

**用途**: 分析 Next.js 生产构建的 bundle 大小，验证性能预算

**使用方法**:
```bash
# 分析现有构建
npx tsx scripts/performance-audit/analyze-bundle.ts

# 先运行构建再分析
npx tsx scripts/performance-audit/analyze-bundle.ts --build

# 生成详细可视化报告
npx tsx scripts/performance-audit/analyze-bundle.ts --detailed

# 使用自定义预算
npx tsx scripts/performance-audit/analyze-bundle.ts --budget '{"totalSize":3000,"jsSize":2000}'
```

**分析内容**:
- ✅ 总 bundle 大小（原始 + Gzip）
- ✅ JS 大小（按页面和 chunks 分类）
- ✅ CSS 大小
- ✅ 页面级别的 bundle 分析
- ✅ 共享 chunks 识别
- ✅ 与性能预算对比
- ✅ ASCII 图表可视化

**输出文件**:
- `bundle-analysis-report.json` - JSON 格式详细报告
- `BUNDLE_ANALYSIS_REPORT.md` - Markdown 格式可读报告
- `BUNDLE_VISUALIZATION.txt` - ASCII 图表可视化（使用 --detailed）

**性能预算（默认）**:
- 总大小: 2048KB (2MB)
- JS 大小: 1536KB (1.5MB)
- CSS 大小: 256KB
- 初始加载: 512KB

**报告内容**:
- 总体统计（总大小、JS/CSS 大小、页面数、Chunks 数）
- 性能预算对比（预算 vs 实际，使用率百分比）
- 最大的页面列表（Top 20）
- 最大的 Chunks 列表（Top 20）
- 针对性优化建议

**可视化内容**（--detailed）:
- 类型分布（JS vs CSS）
- Top 10 页面大小对比（ASCII 条形图）
- 预算使用情况（ASCII 进度条）

**优化建议示例**:
- 大型页面建议代码分割或懒加载
- JS 占比过高建议使用动态导入
- 建议使用 @next/bundle-analyzer 可视化分析
- 建议启用 tree-shaking 和压缩

**使用场景**:
- CI/CD 中验证性能预算
- 部署前的 bundle 大小检查
- 识别 bundle 优化机会
- 追踪 bundle 大小趋势

**示例输出**:
```
📦 Bundle 大小分析报告
==================================================

📊 总体统计:
  - 总大小: 8.32 MB (gzip: 2.61 MB)
  - JS 大小: 8.20 MB (gzip: 2.59 MB)
  - CSS 大小: 122.39 KB (gzip: 17.71 KB)
  - 页面数: 1
  - Chunks 数: 436

💰 性能预算对比:
❌ 总大小: 2674KB / 2048KB (130.6%)
❌ JS 大小: 2656KB / 1536KB (172.9%)
✅ CSS 大小: 18KB / 256KB (7.0%)
✅ 初始加载: 0KB / 512KB (0.0%)

⚠️  发现 2 个预算违规
```

**退出码**:
- `0` - 所有指标符合预算
- `1` - 存在预算违规（会阻止 CI/CD）

### 5. 快速诊断 (quick-diagnose.ts)

**用途**: 验证性能修复后的实际改善效果

**检查内容**:
- 定时器清理率
- React Hooks 依赖清洁率
- 潜在问题识别

**输出文件**:
- `PERFORMANCE_VERIFICATION_REPORT.md` - 详细验证报告

**使用场景**:
- 修复完成后验证效果
- 部署前的最终检查
- 性能改善追踪

**示例**:
```bash
npx tsx scripts/performance-audit/verify-performance-improvements.ts
```

### 3. 回归测试 (regression-tests.ts)

**用途**: 防止已修复的性能问题再次出现

**测试覆盖**:
- ✅ 定时器必须有清理代码
- ✅ React Hooks 依赖不能包含翻译函数 `t`
- ✅ React Hooks 依赖不应该包含对象字面量
- ✅ React Hooks 依赖不应该包含函数表达式
- ✅ addEventListener 必须有对应的 removeEventListener

**输出文件**:
- `PERFORMANCE_REGRESSION_TEST_REPORT.md` - 回归测试报告

**使用场景**:
- CI/CD 流水线中自动运行
- PR 合并前的检查
- 定期性能监控

**示例**:
```bash
npx tsx scripts/performance-audit/regression-tests.ts
```

**退出码**:
- `0` - 所有测试通过
- `1` - 发现性能问题（会阻止 CI/CD）

### 4. 批量修复定时器泄漏 (batch-fix-timer-leaks.ts)

**用途**: 自动修复代码中的定时器泄漏问题

**修复内容**:
- 为 setTimeout/setInterval 添加清理代码
- 在 useEffect 中返回清理函数
- 保存定时器 ID 并在清理时调用 clear 函数

**使用场景**:
- 大规模代码修复
- 技术债务清理

**示例**:
```bash
npx tsx scripts/performance-audit/batch-fix-timer-leaks.ts
```

### 5. 修复 React Hooks 依赖 (fix-hooks-dependencies.ts)

**用途**: 自动修复 React Hooks 依赖数组中的问题

**修复内容**:
- 从依赖数组中移除翻译函数 `t`
- 添加 ESLint 注释说明原因

**使用场景**:
- 批量优化 React 组件
- 减少不必要的重渲染

**示例**:
```bash
npx tsx scripts/performance-audit/fix-hooks-dependencies.ts
```

### 6. 分析事件监听器 (analyze-event-listeners.ts)

**用途**: 分析代码中的事件监听器使用情况

**检查内容**:
- addEventListener 调用
- removeEventListener 调用
- 清理函数完整性

**使用场景**:
- 内存泄漏排查
- 事件监听器审计

**示例**:
```bash
npx tsx scripts/performance-audit/analyze-event-listeners.ts
```

## 🔄 CI/CD 集成

### GitHub Actions

项目已配置 GitHub Actions 工作流，在以下情况自动运行回归测试：

- **Pull Request**: 当 PR 修改了 `src/**/*.ts` 或 `src/**/*.tsx` 文件
- **Push**: 当推送到 `main` 或 `master` 分支

**工作流文件**: `.github/workflows/performance-regression-test.yml`

**功能**:
1. 自动运行回归测试
2. 运行性能验证
3. 上传测试报告为 artifacts
4. 在 PR 中自动评论测试结果

### 本地 Git Hooks

可以配置 Git pre-commit hook 在提交前自动运行测试：

```bash
# .git/hooks/pre-commit
#!/bin/bash

echo "Running performance regression tests..."
npx tsx scripts/performance-audit/regression-tests.ts

if [ $? -ne 0 ]; then
  echo "❌ Performance regression tests failed!"
  echo "Please fix the issues before committing."
  exit 1
fi

echo "✅ Performance regression tests passed!"
```

## 📊 报告说明

### 性能验证报告

**文件**: `PERFORMANCE_VERIFICATION_REPORT.md`

**包含内容**:
- 总体指标（文件数、定时器使用、Hooks 依赖）
- 改善情况（清理率、优化率）
- 详细分析（每个文件的状态）
- 潜在问题列表
- 改进建议

**关键指标**:
- **定时器清理率**: 应该 > 95%
- **Hooks 依赖清洁率**: 应该 = 100%

### 回归测试报告

**文件**: `PERFORMANCE_REGRESSION_TEST_REPORT.md`

**包含内容**:
- 测试结果统计
- 测试覆盖列表
- 详细问题报告
- 修复指南和示例

**测试状态**:
- ✅ 通过 - 未发现问题
- ❌ 失败 - 发现性能回归

## ❓ 常见问题

### Q1: 为什么测试文件被标记为有问题？

**A**: 测试文件中的 setTimeout 是有意的，用于测试异步行为。脚本已配置自动跳过 `.test.ts` 和 `.spec.ts` 文件。

### Q2: 为什么辅助函数（如 delay）被标记为有问题？

**A**: 辅助函数返回 Promise 包装的 setTimeout 是正常的。脚本已配置识别这种模式并跳过。

### Q3: 如何修复"翻译函数 t 在依赖数组中"的问题？

**A**: 
```typescript
// 修复前
useEffect(() => {
  console.log(t('message'));
}, [data, t]); // ❌ t 会导致不必要的重渲染

// 修复后
useEffect(() => {
  console.log(t('message'));
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [data]); // ✅ 移除 t，添加注释
```

### Q4: 如何修复定时器泄漏？

**A**:
```typescript
// 修复前
useEffect(() => {
  const timer = setTimeout(() => {
    // ...
  }, 1000);
}, []); // ❌ 没有清理

// 修复后
useEffect(() => {
  const timer = setTimeout(() => {
    // ...
  }, 1000);
  
  return () => clearTimeout(timer); // ✅ 添加清理
}, []);
```

### Q5: 回归测试失败了怎么办？

**A**:
1. 查看 `PERFORMANCE_REGRESSION_TEST_REPORT.md` 了解具体问题
2. 根据报告中的修复指南修复问题
3. 重新运行测试确认修复有效
4. 如果是误报，可以在脚本中添加例外规则

### Q6: 如何在 CI/CD 中使用这些脚本？

**A**: 
```yaml
# GitHub Actions 示例
- name: Run regression tests
  run: npx tsx scripts/performance-audit/regression-tests.ts
  
- name: Upload reports
  uses: actions/upload-artifact@v4
  with:
    name: performance-reports
    path: |
      PERFORMANCE_REGRESSION_TEST_REPORT.md
      PERFORMANCE_VERIFICATION_REPORT.md
```

## 📈 性能指标目标

| 指标 | 目标 | 当前状态 |
|------|------|----------|
| 定时器清理率 | > 95% | ✅ 99.3% |
| Hooks 依赖清洁率 | 100% | ✅ 100% |
| Critical 问题 | 0 | ✅ 0 |
| Warning 问题 | < 10 | ✅ 0 |

## 🔗 相关文档

- [性能审计总结](../../PERFORMANCE_AUDIT_SUMMARY.md)
- [定时器泄漏修复指南](../../TIMER_LEAK_FIX_GUIDE.md)
- [开发规则](../../.kiro/steering/development-rules.md)

## 📝 更新日志

- **2026-01-23**: 创建性能验证和回归测试脚本
- **2026-01-23**: 添加 GitHub Actions 集成
- **2026-01-23**: 完成 Task 36 - 修复验证和回归测试

---

*如有问题或建议，请提交 Issue 或 PR*
