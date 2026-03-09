# 需求文档 - 全面项目清理和优化

## 介绍

u2tool 是一个包含 500 个在线工具的 Astro v5 + Svelte 5 项目，经过多次迭代开发后积累了技术债务和优化机会。本需求文档定义了系统性清理和优化项目的功能需求，包括文件清理、类型修复、spec 管理、代码审计和性能优化。

## 术语表

- **Project_Root**: 项目根目录
- **Cleanup_System**: 负责清理临时文件和归档的系统
- **Type_System**: TypeScript 类型系统
- **Spec_Manager**: Spec 生命周期管理系统
- **Build_Pipeline**: 构建流程
- **Performance_Monitor**: 性能监控系统
- **Archive_Directory**: 归档目录，用于存储历史文件

## 需求

### 需求 1: 临时文件清理

**用户故事**: 作为开发者，我希望清理根目录的临时修复脚本，以便保持项目结构整洁。

#### 验收标准

1. WHEN 清理执行时，THE Cleanup_System SHALL 识别根目录下所有 `fix_*.sh` 和 `fix_*.js` 临时脚本文件
2. WHEN 临时脚本被识别时，THE Cleanup_System SHALL 将这些文件移动到 `scripts/archive/legacy-fixes/` 目录
3. WHEN 归档完成时，THE Cleanup_System SHALL 创建归档清单文件 `scripts/archive/legacy-fixes/ARCHIVE_MANIFEST.md`，记录每个文件的原始路径、归档时间和用途说明
4. WHEN 清理完成时，THE Project_Root SHALL 不包含任何 `fix_*.sh` 或 `fix_*.js` 文件
5. THE Cleanup_System SHALL 保留 `.gitignore` 中明确排除的文件

### 需求 2: TypeScript 类型导出修复

**用户故事**: 作为开发者，我希望修复所有 TypeScript 类型导出警告，以便构建过程无警告。

#### 验收标准

1. WHEN 类型修复执行时，THE Type_System SHALL 在 `src/lib/calculator-utils.ts` 中导出以下类型：`LoanResult`, `BmiResult`, `AgeResult`, `TipResult`, `DiscountResult`, `CompoundInterestResult`, `BinaryResult`, `HexResult`, `SubnetResult`, `AspectRatioResult`, `TypingTestResult`
2. WHEN 构建执行时，THE Build_Pipeline SHALL 不产生任何类型导出相关的警告
3. WHEN 类型导出后，THE Type_System SHALL 保持所有现有组件的类型兼容性
4. THE Type_System SHALL 为每个导出的类型添加 JSDoc 注释说明其用途

### 需求 3: Spec 生命周期管理

**用户故事**: 作为开发者，我希望建立 spec 生命周期管理机制，以便清晰地组织和归档 spec。

#### 验收标准

1. WHEN Spec 管理系统初始化时，THE Spec_Manager SHALL 创建 `.kiro/specs/archive/` 目录结构，包含子目录：`completed/`, `deprecated/`, `cancelled/`
2. WHEN Spec 状态为已完成时，THE Spec_Manager SHALL 将 spec 目录移动到 `.kiro/specs/archive/completed/{year}/` 目录
3. WHEN Spec 被归档时，THE Spec_Manager SHALL 在归档目录创建 `ARCHIVE_INDEX.md` 文件，记录所有归档 spec 的名称、完成日期、主要成果和相关文件
4. THE Spec_Manager SHALL 提供脚本 `scripts/spec-lifecycle/archive-spec.ts`，接受 spec 名称和归档类型参数
5. THE Spec_Manager SHALL 提供脚本 `scripts/spec-lifecycle/list-active-specs.ts`，列出所有活跃的 spec
6. WHEN 归档操作执行时，THE Spec_Manager SHALL 验证 spec 的 tasks.md 中所有任务都已完成

### 需求 4: 历史修复验证

**用户故事**: 作为开发者，我希望验证历史修复的有效性，以便确保问题已真正解决。

#### 验收标准

1. WHEN 验证执行时，THE Performance_Monitor SHALL 检查所有图表组件的 React Hooks 依赖配置是否正确
2. WHEN 验证执行时，THE Performance_Monitor SHALL 确认 ECharts 组件使用 `EChartsWrapper` 进行懒加载
3. WHEN 验证执行时，THE Performance_Monitor SHALL 检查所有组件的 `exportChart` 函数是否包含防御性检查
4. WHEN 验证执行时，THE Performance_Monitor SHALL 运行翻译完整性测试，确保所有 10 种语言的翻译键完整
5. THE Performance_Monitor SHALL 生成验证报告 `docs/HISTORICAL_FIXES_VALIDATION.md`，记录每个修复的验证状态

### 需求 5: 构建产物优化

**用户故事**: 作为开发者，我希望优化构建产物大小，以便提升加载性能。

#### 验收标准

1. WHEN 构建分析执行时，THE Build_Pipeline SHALL 生成构建产物大小报告，包含每个工具组件的打包大小
2. WHEN 大型依赖被识别时（>100KB），THE Build_Pipeline SHALL 在报告中标记并建议优化方案
3. WHEN 优化执行时，THE Build_Pipeline SHALL 确保所有工具组件使用动态导入
4. WHEN 优化执行时，THE Build_Pipeline SHALL 确保大型库（ECharts, XLSX, PDF）使用懒加载
5. THE Build_Pipeline SHALL 将构建产物总大小减少至少 15%

### 需求 6: 开发规则文档更新

**用户故事**: 作为开发者，我希望更新开发规则文档，以便反映最新的最佳实践。

#### 验收标准

1. WHEN 文档更新时，THE Cleanup_System SHALL 在 `.kiro/steering/development-rules.md` 中添加"文件管理规范"章节
2. WHEN 文档更新时，THE Cleanup_System SHALL 在开发规则中添加"Spec 生命周期管理"章节
3. WHEN 文档更新时，THE Cleanup_System SHALL 更新"检查清单"章节，包含清理和归档步骤
4. THE Cleanup_System SHALL 在文档中添加"临时文件处理原则"：一次性脚本执行后必须归档或删除
5. THE Cleanup_System SHALL 在文档中添加"Spec 归档时机"：所有任务完成后 7 天内必须归档

### 需求 7: 自动化清理脚本

**用户故事**: 作为开发者，我希望有自动化脚本定期检查和清理项目，以便保持项目整洁。

#### 验收标准

1. THE Cleanup_System SHALL 提供脚本 `scripts/maintenance/check-project-health.ts`，检查项目健康状况
2. WHEN 健康检查执行时，THE Cleanup_System SHALL 检测根目录的临时文件（`fix_*`, `test_*`, `temp_*`, 数字文件名等）
3. WHEN 健康检查执行时，THE Cleanup_System SHALL 检测未归档的已完成 spec（tasks.md 中所有任务都标记为完成）
4. WHEN 健康检查执行时，THE Cleanup_System SHALL 检测构建警告和错误
5. WHEN 健康检查执行时，THE Cleanup_System SHALL 检测未使用的依赖和导入
6. THE Cleanup_System SHALL 生成健康检查报告 `PROJECT_HEALTH_REPORT.md`，包含发现的问题和建议的修复操作

### 需求 8: 性能基准测试

**用户故事**: 作为开发者，我希望建立性能基准测试，以便监控优化效果。

#### 验收标准

1. THE Performance_Monitor SHALL 提供脚本 `scripts/performance/benchmark.ts`，执行性能基准测试
2. WHEN 基准测试执行时，THE Performance_Monitor SHALL 测量首页加载时间（LCP, FCP, TTI）
3. WHEN 基准测试执行时，THE Performance_Monitor SHALL 测量工具页面加载时间（10 个随机工具的平均值）
4. WHEN 基准测试执行时，THE Performance_Monitor SHALL 测量构建时间和构建产物大小
5. THE Performance_Monitor SHALL 将基准测试结果保存到 `benchmarks/baseline.json`
6. THE Performance_Monitor SHALL 提供比较功能，对比当前性能与基准值的差异

### 需求 9: 依赖审计和更新

**用户故事**: 作为开发者，我希望审计和更新项目依赖，以便保持依赖的安全性和最新性。

#### 验收标准

1. WHEN 依赖审计执行时，THE Build_Pipeline SHALL 运行 `npm audit` 检查安全漏洞
2. WHEN 依赖审计执行时，THE Build_Pipeline SHALL 检查过时的依赖（使用 `npm outdated`）
3. WHEN 依赖审计执行时，THE Build_Pipeline SHALL 识别未使用的依赖（使用 `depcheck`）
4. THE Build_Pipeline SHALL 生成依赖审计报告 `docs/DEPENDENCY_AUDIT.md`
5. WHEN 安全漏洞被发现时，THE Build_Pipeline SHALL 在报告中标记为高优先级

### 需求 10: 代码质量门禁

**用户故事**: 作为开发者，我希望建立代码质量门禁，以便防止低质量代码进入代码库。

#### 验收标准

1. THE Build_Pipeline SHALL 提供 Git pre-commit hook 脚本 `scripts/git-hooks/pre-commit.sh`
2. WHEN 代码提交时，THE Build_Pipeline SHALL 检查暂存文件中是否包含 `console.log` 或 `debugger` 语句
3. WHEN 代码提交时，THE Build_Pipeline SHALL 检查暂存文件中是否包含临时文件（`fix_*`, `test_*`, `temp_*`）
4. WHEN 代码提交时，THE Build_Pipeline SHALL 运行 ESLint 检查暂存的 TypeScript/JavaScript 文件
5. WHEN 检查失败时，THE Build_Pipeline SHALL 阻止提交并显示详细的错误信息
6. THE Build_Pipeline SHALL 提供 `--no-verify` 选项允许在紧急情况下跳过检查

## 成功标准

1. 根目录不包含任何临时修复脚本
2. 构建过程无 TypeScript 警告
3. 所有已完成的 spec 已归档
4. 所有历史修复经过验证
5. 构建产物大小减少至少 15%
6. 项目健康检查报告无严重问题
7. 性能基准测试建立并记录
8. 依赖审计无高危漏洞
9. Git pre-commit hook 正常工作
10. 开发规则文档完整更新

## 非功能需求

1. **向后兼容性**: 所有优化不能破坏现有功能
2. **性能**: 清理和优化操作不能影响开发体验
3. **可维护性**: 所有脚本必须有清晰的注释和使用说明
4. **可测试性**: 所有修复必须有验证方法
5. **文档完整性**: 所有变更必须更新相关文档
