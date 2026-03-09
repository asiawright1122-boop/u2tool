# 实现计划: 全面项目清理和优化

## 概述

本实现计划将 u2tool 项目的清理和优化系统分解为可执行的编码任务。系统包含 9 个主要模块：文件清理、Spec 管理、类型修复、验证、构建优化、健康检查、性能监控、依赖审计和 Git Hooks。所有任务都基于设计文档中的详细实现方案。

## 任务

- [x] 1. 建立项目基础设施
  - 创建脚本目录结构
  - 安装必要的依赖包（ts-morph, glob, fs-extra, ignore, puppeteer, depcheck）
  - 配置 TypeScript 编译选项
  - _需求: 所有需求的基础_

- [x] 2. 实现文件清理模块
  - [x] 2.1 实现临时文件识别功能
    - 创建 `scripts/cleanup/identify-temp-files.ts`
    - 实现文件模式匹配（fix_*.sh, test_*.*, temp_*, 数字文件名等）
    - 集成 .gitignore 规则处理
    - _需求: 1.1, 1.5_
  
  - [ ]* 2.2 编写临时文件识别的属性测试
    - **属性 1: 临时文件识别完整性**
    - **验证需求: 1.1, 1.5**
  
  - [x] 2.3 实现文件归档功能
    - 创建 `scripts/cleanup/archive-files.ts`
    - 实现文件移动逻辑（支持 dry-run 模式）
    - 添加错误处理和重试机制
    - _需求: 1.2, 1.4_
  
  - [ ]* 2.4 编写文件归档的属性测试
    - **属性 2: 文件归档保持完整性**
    - **验证需求: 1.2, 1.4**
  
  - [x] 2.5 实现归档清单生成
    - 创建 `scripts/cleanup/generate-manifest.ts`
    - 生成 Markdown 格式的归档清单
    - 包含文件信息、归档时间和统计数据
    - _需求: 1.3_
  
  - [ ]* 2.6 编写归档清单的属性测试
    - **属性 3: 归档清单完整性**
    - **验证需求: 1.3**
  
  - [x] 2.7 创建清理主脚本
    - 创建 `scripts/cleanup/cleanup-temp-files.ts`
    - 整合识别、归档和清单生成功能
    - 添加命令行参数支持（--dry-run, --patterns）
    - _需求: 1.1, 1.2, 1.3, 1.4_

- [-] 3. 实现 Spec 管理模块
  - [x] 3.1 实现任务解析器
    - 创建 `scripts/spec-lifecycle/task-parser.ts`
    - 解析 tasks.md 文件格式
    - 计算任务完成进度
    - _需求: 3.6_
  
  - [x] 3.2 实现 Spec 状态检测
    - 创建 `scripts/spec-lifecycle/check-spec-status.ts`
    - 检查 spec 的任务完成状态
    - 返回详细的状态信息
    - _需求: 3.6_
  
  - [ ]* 3.3 编写 Spec 归档条件验证的属性测试
    - **属性 7: Spec 归档条件验证**
    - **验证需求: 3.6**
  
  - [x] 3.4 实现 Spec 归档功能
    - 创建 `scripts/spec-lifecycle/archive-spec.ts`
    - 实现归档操作（移动到 archive/{type}/{year}/）
    - 验证任务完成状态
    - 支持 --force 选项
    - _需求: 3.2, 3.6_
  
  - [ ]* 3.5 编写 Spec 归档路径的属性测试
    - **属性 8: Spec 归档路径正确性**
    - **验证需求: 3.2**
  
  - [x] 3.6 实现归档索引维护
    - 在 archive-spec.ts 中实现 updateArchiveIndex 函数
    - 生成和更新 ARCHIVE_INDEX.md
    - 按年份和类型组织条目
    - _需求: 3.3_
  
  - [ ]* 3.7 编写归档索引的属性测试
    - **属性 9: 归档索引一致性**
    - **验证需求: 3.3**
  
  - [x] 3.8 创建 Spec 列表脚本
    - 创建 `scripts/spec-lifecycle/list-active-specs.ts`
    - 列出所有活跃的 spec
    - 显示每个 spec 的完成进度
    - _需求: 3.5_

- [ ] 4. 检查点 - 验证文件清理和 Spec 管理
  - 运行文件清理脚本（dry-run 模式）
  - 测试 Spec 归档功能
  - 确保所有测试通过
  - 询问用户是否有问题

- [-] 5. 实现类型修复模块
  - [ ] 5.1 实现类型分析器
    - 创建 `scripts/type-fixes/analyze-types.ts`
    - 使用 ts-morph 解析 TypeScript 文件
    - 识别未导出的类型定义
    - _需求: 2.1_
  
  - [ ] 5.2 实现类型导出添加
    - 创建 `scripts/type-fixes/add-type-exports.ts`
    - 自动添加 export 关键字
    - 生成 JSDoc 注释
    - _需求: 2.1, 2.4_
  
  - [ ]* 5.3 编写类型导出的属性测试
    - **属性 4: 类型导出完整性**
    - **验证需求: 2.1, 2.4**
  
  - [ ] 5.4 实现类型兼容性验证
    - 在 add-type-exports.ts 中添加验证功能
    - 运行 TypeScript 编译检查
    - 确保无新增类型错误
    - _需求: 2.3_
  
  - [ ]* 5.5 编写类型兼容性的属性测试
    - **属性 6: 类型兼容性保持**
    - **验证需求: 2.3**
  
  - [x] 5.6 修复 calculator-utils.ts 类型导出
    - 导出所有必需的类型（LoanResult, BmiResult 等 11 个类型）
    - 为每个类型添加 JSDoc 注释
    - 验证构建无警告
    - _需求: 2.1, 2.2, 2.4_

- [-] 6. 实现验证模块
  - [x] 6.1 实现 React Hooks 依赖验证
    - 创建 `scripts/validation/validate-hooks-dependencies.ts`
    - 扫描所有 Svelte 组件
    - 检查 useEffect/useMemo/useCallback 依赖数组
    - 识别翻译函数 t 的错误使用
    - _需求: 4.1_
  
  - [ ]* 6.2 编写 Hooks 依赖的属性测试
    - **属性 10: React Hooks 依赖正确性**
    - **验证需求: 4.1**
  
  - [x] 6.3 实现 ECharts 懒加载验证
    - 创建 `scripts/validation/validate-echarts-lazy-loading.ts`
    - 检查图表组件是否使用 EChartsWrapper
    - 识别直接导入 echarts 的组件
    - _需求: 4.2_
  
  - [ ]* 6.4 编写 ECharts 懒加载的属性测试
    - **属性 11: ECharts 懒加载一致性**
    - **验证需求: 4.2**
  
  - [x] 6.5 实现防御性编程验证
    - 创建 `scripts/validation/validate-defensive-programming.ts`
    - 检查 exportChart 函数的 null 检查
    - 识别缺少防御性检查的代码
    - _需求: 4.3_
  
  - [ ]* 6.6 编写防御性编程的属性测试
    - **属性 12: 防御性编程完整性**
    - **验证需求: 4.3**
  
  - [x] 6.7 实现翻译完整性验证
    - 创建 `scripts/validation/validate-translations.ts`
    - 检查所有 10 种语言的翻译键
    - 识别缺失的翻译
    - _需求: 4.4_
  
  - [ ]* 6.8 编写翻译完整性的属性测试
    - **属性 13: 翻译完整性**
    - **验证需求: 4.4**
  
  - [x] 6.9 创建历史修复验证主脚本
    - 创建 `scripts/validation/validate-historical-fixes.ts`
    - 整合所有验证规则
    - 生成验证报告 `docs/HISTORICAL_FIXES_VALIDATION.md`
    - _需求: 4.1, 4.2, 4.3, 4.4, 4.5_

- [ ] 7. 实现构建优化模块
  - [ ] 7.1 实现构建分析器
    - 创建 `scripts/build-optimization/analyze-build.ts`
    - 分析构建产物大小
    - 识别大型依赖（>100KB）
    - _需求: 5.1, 5.2_
  
  - [ ]* 7.2 编写大型依赖标记的属性测试
    - **属性 14: 大型依赖标记**
    - **验证需求: 5.2**
  
  - [ ] 7.3 实现动态导入检查
    - 在 analyze-build.ts 中添加动态导入检查
    - 识别静态导入的工具组件
    - _需求: 5.3_
  
  - [ ]* 7.4 编写动态导入的属性测试
    - **属性 15: 动态导入一致性**
    - **验证需求: 5.3**
  
  - [ ] 7.5 实现大型库懒加载检查
    - 检查 ECharts, XLSX, PDF 库的加载方式
    - 识别模块级别的同步导入
    - _需求: 5.4_
  
  - [ ]* 7.6 编写大型库懒加载的属性测试
    - **属性 16: 大型库懒加载**
    - **验证需求: 5.4**
  
  - [ ] 7.7 实现优化建议生成
    - 在 analyze-build.ts 中生成优化建议
    - 根据依赖大小和类型提供建议
    - 估算优化收益
    - _需求: 5.2, 5.3, 5.4_
  
  - [ ] 7.8 生成构建分析报告
    - 创建详细的构建分析报告
    - 包含大小统计、大型依赖列表和优化建议
    - _需求: 5.1, 5.2_

- [ ] 8. 检查点 - 验证类型修复、验证和构建优化
  - 运行类型修复脚本
  - 执行所有验证检查
  - 分析构建产物
  - 确保所有测试通过
  - 询问用户是否有问题

- [x] 9. 实现健康检查模块
  - [x] 9.1 实现临时文件检查
    - 创建 `scripts/maintenance/check-project-health.ts`
    - 实现 checkTemporaryFiles 函数
    - 复用文件清理模块的识别功能
    - _需求: 7.2_
  
  - [ ]* 9.2 编写临时文件检测的属性测试
    - **属性 17: 临时文件检测**
    - **验证需求: 7.2**
  
  - [x] 9.3 实现未归档 Spec 检查
    - 实现 checkUnarchivedSpecs 函数
    - 识别已完成但未归档的 spec
    - _需求: 7.3_
  
  - [ ]* 9.4 编写未归档 Spec 检测的属性测试
    - **属性 18: 未归档 Spec 检测**
    - **验证需求: 7.3**
  
  - [x] 9.5 实现构建警告检查
    - 实现 checkBuildWarnings 函数
    - 运行构建并捕获输出
    - 解析警告和错误
    - _需求: 7.4_
  
  - [ ]* 9.6 编写构建警告检测的属性测试
    - **属性 19: 构建警告检测**
    - **验证需求: 7.4**
  
  - [x] 9.7 实现未使用依赖检查
    - 实现 checkUnusedDependencies 函数
    - 集成 depcheck 库
    - _需求: 7.5_
  
  - [ ]* 9.8 编写未使用依赖检测的属性测试
    - **属性 20: 未使用依赖检测**
    - **验证需求: 7.5**
  
  - [x] 9.9 实现健康检查主函数
    - 实现 checkProjectHealth 函数
    - 整合所有检查功能
    - 计算总体健康状态
    - _需求: 7.1, 7.2, 7.3, 7.4, 7.5_
  
  - [x] 9.10 实现健康报告生成
    - 实现 generateHealthReport 函数
    - 生成 Markdown 格式的报告
    - 包含详细的问题列表和修复建议
    - _需求: 7.6_
  
  - [ ]* 9.11 编写健康报告生成的属性测试
    - **属性 21: 健康检查报告生成**
    - **验证需求: 7.6**

- [ ] 10. 实现性能监控模块
  - [ ] 10.1 实现页面加载测量
    - 创建 `scripts/performance/benchmark.ts`
    - 使用 Puppeteer 测量页面性能
    - 收集 LCP, FCP, TTI 指标
    - _需求: 8.2, 8.3_
  
  - [ ] 10.2 实现构建性能测量
    - 实现 measureBuildPerformance 函数
    - 测量构建时间和产物大小
    - _需求: 8.4_
  
  - [ ] 10.3 实现基准测试主函数
    - 实现 runBenchmark 函数
    - 测量首页和工具页面性能
    - 整合构建性能测量
    - _需求: 8.1, 8.2, 8.3, 8.4_
  
  - [ ] 10.4 实现基准数据持久化
    - 实现 saveBaseline 和 loadBaseline 函数
    - 保存到 benchmarks/baseline.json
    - _需求: 8.5_
  
  - [ ]* 10.5 编写基准数据持久化的属性测试
    - **属性 22: 性能基准数据持久化**
    - **验证需求: 8.5**
  
  - [ ] 10.6 实现性能对比功能
    - 实现 compareWithBaseline 函数
    - 计算变化量和变化百分比
    - 判断性能改善或退化
    - _需求: 8.6_
  
  - [ ]* 10.7 编写性能对比的属性测试
    - **属性 23: 性能对比准确性**
    - **验证需求: 8.6**

- [ ] 11. 实现依赖审计模块
  - [ ] 11.1 实现安全审计
    - 创建 `scripts/dependency-audit/audit-dependencies.ts`
    - 运行 npm audit
    - 解析安全漏洞信息
    - _需求: 9.1_
  
  - [ ] 11.2 实现过时依赖检查
    - 运行 npm outdated
    - 解析过时依赖信息
    - _需求: 9.2_
  
  - [ ] 11.3 实现未使用依赖识别
    - 使用 depcheck 识别未使用依赖
    - _需求: 9.3_
  
  - [ ]* 11.4 编写未使用依赖识别的属性测试
    - **属性 20: 未使用依赖检测**（与健康检查共享）
    - **验证需求: 9.3**
  
  - [ ] 11.5 实现审计报告生成
    - 实现 generateReport 函数
    - 生成 Markdown 格式的审计报告
    - 按严重程度分类漏洞
    - _需求: 9.4_
  
  - [ ]* 11.6 编写安全漏洞优先级的属性测试
    - **属性 24: 安全漏洞优先级标记**
    - **验证需求: 9.5**

- [ ] 12. 检查点 - 验证健康检查、性能监控和依赖审计
  - 运行健康检查脚本
  - 执行性能基准测试
  - 运行依赖审计
  - 确保所有测试通过
  - 询问用户是否有问题

- [ ] 13. 实现 Git Hooks 模块
  - [ ] 13.1 创建 pre-commit hook 脚本
    - 创建 `scripts/git-hooks/pre-commit.sh`
    - 实现暂存文件获取
    - 检查 console.log 和 debugger
    - 检查临时文件
    - _需求: 10.2, 10.3_
  
  - [ ]* 13.2 编写 pre-commit 拦截的属性测试
    - **属性 25: Pre-commit 拦截**
    - **验证需求: 10.2, 10.3, 10.5**
  
  - [ ] 13.3 集成 ESLint 检查
    - 在 pre-commit.sh 中添加 ESLint 检查
    - 只检查暂存的 TypeScript/JavaScript 文件
    - _需求: 10.4_
  
  - [ ]* 13.4 编写 ESLint 集成的属性测试
    - **属性 26: ESLint 集成**
    - **验证需求: 10.4, 10.5**
  
  - [ ] 13.5 实现 hook 安装脚本
    - 创建 `scripts/git-hooks/install-hooks.ts`
    - 复制 hook 脚本到 .git/hooks/
    - 设置执行权限
    - _需求: 10.1_
  
  - [ ] 13.6 添加 --no-verify 支持
    - 在 pre-commit.sh 中添加说明
    - 提供紧急情况下的跳过选项
    - _需求: 10.6_

- [ ] 14. 更新开发规则文档
  - [ ] 14.1 添加文件管理规范章节
    - 在 `.kiro/steering/development-rules.md` 中添加新章节
    - 说明临时文件处理原则
    - _需求: 6.1, 6.4_
  
  - [ ] 14.2 添加 Spec 生命周期管理章节
    - 说明 Spec 归档时机和流程
    - 提供归档命令示例
    - _需求: 6.2, 6.5_
  
  - [ ] 14.3 更新检查清单章节
    - 添加清理和归档步骤
    - 更新代码提交前检查清单
    - _需求: 6.3_

- [-] 15. 配置 package.json 脚本
  - [x] 15.1 添加清理脚本命令
    - cleanup:temp-files, cleanup:dry-run
    - _需求: 1.1, 1.2, 1.3_
  
  - [x] 15.2 添加 Spec 管理脚本命令
    - spec:list, spec:archive
    - _需求: 3.2, 3.3, 3.5_
  
  - [x] 15.3 添加类型修复脚本命令
    - fix:types
    - _需求: 2.1, 2.2, 2.4_
  
  - [x] 15.4 添加验证脚本命令
    - validate:fixes
    - _需求: 4.1, 4.2, 4.3, 4.4, 4.5_
  
  - [ ] 15.5 添加构建优化脚本命令
    - build:analyze
    - _需求: 5.1, 5.2_
  
  - [x] 15.6 添加健康检查脚本命令
    - health:check
    - _需求: 7.1, 7.6_
  
  - [ ] 15.7 添加性能监控脚本命令
    - perf:benchmark, perf:compare
    - _需求: 8.1, 8.6_
  
  - [ ] 15.8 添加依赖审计脚本命令
    - deps:audit
    - _需求: 9.1, 9.4_
  
  - [ ] 15.9 添加 Git hooks 脚本命令
    - hooks:install
    - _需求: 10.1_

- [ ] 16. 配置持续集成
  - [ ] 16.1 创建健康检查 workflow
    - 创建 `.github/workflows/project-health.yml`
    - 配置每周自动运行
    - 上传健康报告为 artifact
    - _需求: 7.1, 7.6_
  
  - [ ] 16.2 创建性能监控 workflow
    - 创建 `.github/workflows/performance.yml`
    - 在 PR 时运行性能对比
    - 评论性能变化到 PR
    - _需求: 8.1, 8.6_

- [ ] 17. 最终检查点 - 完整系统测试
  - 运行所有脚本命令验证功能
  - 执行完整的测试套件
  - 生成所有报告文档
  - 验证 Git hooks 正常工作
  - 确认所有需求都已满足
  - 询问用户是否有问题

- [-] 18. 文档和清理
  - [x] 18.1 创建使用文档
    - 创建 `docs/CLEANUP_SYSTEM_GUIDE.md`
    - 说明每个脚本的用途和使用方法
    - 提供常见问题解答
  
  - [x] 18.2 更新 README
    - 添加清理和优化系统的说明
    - 更新脚本命令列表
  
  - [x] 18.3 执行首次清理
    - 运行 cleanup:temp-files 清理现有临时文件
    - 归档已完成的 spec
    - 生成初始健康报告和性能基准
  
  - [x] 18.4 安装 Git hooks
    - 运行 hooks:install 安装 pre-commit hook
    - 测试 hook 功能

## 注意事项

- 所有标记 `*` 的任务为可选的属性测试任务，可以跳过以加快 MVP 开发
- 每个任务都引用了具体的需求编号，确保可追溯性
- 检查点任务确保增量验证，及时发现问题
- 属性测试使用 Vitest + fast-check，每个测试至少 100 次迭代
- 所有脚本都应该有详细的错误处理和日志记录
- 优先实现核心功能，测试任务可以在后期补充
