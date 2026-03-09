# 项目清理和优化系统使用指南

本指南介绍如何使用项目清理和优化系统的各个功能。

## 快速开始

### 1. 清理临时文件

```bash
# 查看将要清理的文件（不实际移动）
npm run cleanup:dry-run

# 执行实际清理
npm run cleanup:temp-files
```

### 2. 管理 Spec

```bash
# 列出所有活跃的 Spec
npm run spec:list

# 列出详细信息
npm run spec:list --verbose

# 归档已完成的 Spec
npm run spec:archive .kiro/specs/my-feature

# 强制归档（即使未完成）
npm run spec:archive --force .kiro/specs/my-feature
```

### 3. 修复类型导出

```bash
# 修复 Svelte 组件中的类型导入
npm run fix:types
```

### 4. 验证历史修复

```bash
# 运行所有验证检查
npm run validate:fixes
```

验证内容包括：
- React Hooks 依赖问题
- ECharts 懒加载问题
- 防御性编程问题
- 翻译完整性问题

### 5. 项目健康检查

```bash
# 执行完整的健康检查
npm run health:check
```

检查内容包括：
- 临时文件数量
- 未归档的 Spec
- 构建警告
- 未使用的依赖

## 详细功能说明

### 文件清理模块

**功能**：识别和归档临时文件

**支持的文件模式**：
- `fix_*.sh`, `fix_*.js`, `fix_*.ts` - 临时修复脚本
- `test_*.*` - 临时测试文件
- `temp_*.*`, `tmp_*.*` - 临时文件
- 数字文件名（如 `0`, `1`, `123`）
- `*.tmp`, `*.bak`, `*.old`, `*.backup` - 备份文件
- `.DS_Store`, `Thumbs.db` - 系统文件

**归档位置**：`archive/temp-files/YYYY-MM-DD/`

**清单文件**：归档后会生成 `MANIFEST.md` 记录所有归档的文件

### Spec 管理模块

**功能**：管理 Spec 的生命周期

**Spec 状态**：
- 未开始：任务列表中有未开始的任务
- 进行中：有任务正在进行
- 已完成：所有必需任务都已完成
- 可归档：已完成且满足归档条件

**归档条件**：
- 有 requirements.md 或 bugfix.md
- 有 design.md
- 有 tasks.md
- 所有必需任务都已完成

**归档位置**：`.kiro/specs/archive/{type}/{year}/{spec-name}/`

**归档索引**：`.kiro/specs/archive/ARCHIVE_INDEX.md`

### 类型修复模块

**功能**：修复 Vite 构建警告

**修复内容**：
- 将 `import { LoanResult }` 改为 `import { type LoanResult }`
- 解决 Vite 对类型导入的静态分析警告

**影响文件**：所有使用 calculator-utils.ts 类型的 Svelte 组件

### 验证模块

**功能**：验证历史修复是否正确应用

**验证项目**：

1. **React Hooks 依赖**
   - 检查 useEffect/useMemo/useCallback 的依赖数组
   - 识别翻译函数 `t` 的错误使用

2. **ECharts 懒加载**
   - 检查是否使用 EChartsWrapper
   - 识别直接导入 echarts 的组件

3. **防御性编程**
   - 检查 exportChart 函数的 null 检查
   - 识别缺少防御性检查的代码

4. **翻译完整性**
   - 检查所有 10 种语言的翻译键
   - 识别缺失的翻译

**报告位置**：`docs/HISTORICAL_FIXES_VALIDATION.md`

### 健康检查模块

**功能**：全面检查项目健康状态

**检查项目**：
- 临时文件数量和大小
- 未归档的 Spec 数量
- 构建警告数量
- 未使用的依赖

**健康等级**：
- 🟢 Excellent (90-100 分)
- 🟡 Good (70-89 分)
- 🟠 Fair (50-69 分)
- 🔴 Poor (<50 分)

**报告位置**：`docs/PROJECT_HEALTH_REPORT.md`

## 常见问题

### Q: 清理临时文件会删除重要文件吗？

A: 不会。清理脚本会：
1. 遵守 .gitignore 规则
2. 不扫描 node_modules、.git、dist 等目录
3. 不扫描 .kiro/specs 目录
4. 提供 dry-run 模式预览

### Q: 如何恢复已归档的文件？

A: 归档的文件保存在 `archive/` 目录中，可以手动复制回原位置。归档清单 `MANIFEST.md` 记录了所有文件的原始位置。

### Q: Spec 归档后还能访问吗？

A: 可以。归档的 Spec 保存在 `.kiro/specs/archive/` 目录中，可以随时查看。归档索引 `ARCHIVE_INDEX.md` 提供了快速导航。

### Q: 验证失败怎么办？

A: 验证失败说明代码中存在需要修复的问题。查看生成的报告 `docs/HISTORICAL_FIXES_VALIDATION.md` 了解详细信息，然后根据建议进行修复。

### Q: 健康检查失败怎么办？

A: 健康检查失败说明项目存在一些问题。查看报告 `docs/PROJECT_HEALTH_REPORT.md` 了解具体问题，然后：
- 运行 `npm run cleanup:temp-files` 清理临时文件
- 运行 `npm run spec:archive` 归档已完成的 Spec
- 修复构建警告
- 移除未使用的依赖

## 最佳实践

1. **定期清理**：每周运行一次 `npm run cleanup:dry-run` 检查临时文件

2. **及时归档**：完成 Spec 后立即归档，保持工作目录整洁

3. **持续验证**：在提交代码前运行 `npm run validate:fixes` 确保代码质量

4. **健康监控**：每月运行一次 `npm run health:check` 了解项目健康状态

5. **自动化**：考虑将这些检查集成到 CI/CD 流程中

## 脚本命令总结

| 命令 | 功能 | 说明 |
|------|------|------|
| `npm run cleanup:dry-run` | 模拟清理 | 查看将要清理的文件 |
| `npm run cleanup:temp-files` | 清理临时文件 | 实际执行清理操作 |
| `npm run spec:list` | 列出 Spec | 显示所有活跃的 Spec |
| `npm run spec:archive` | 归档 Spec | 归档已完成的 Spec |
| `npm run fix:types` | 修复类型导入 | 修复 Vite 构建警告 |
| `npm run validate:fixes` | 验证历史修复 | 运行所有验证检查 |
| `npm run health:check` | 健康检查 | 全面检查项目健康状态 |

## 技术支持

如有问题或建议，请查看：
- 设计文档：`.kiro/specs/comprehensive-project-cleanup/design.md`
- 需求文档：`.kiro/specs/comprehensive-project-cleanup/requirements.md`
- 任务列表：`.kiro/specs/comprehensive-project-cleanup/tasks.md`
