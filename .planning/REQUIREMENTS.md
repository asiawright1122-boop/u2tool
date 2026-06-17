# Requirements: v0.0.18 - GSC Recovery Checkpoint & Content Optimization

## Milestone Goal

执行 2026-06-09 恢复版发布后的 7-Day GSC 数据指标比对与收敛分析，彻底完成低优先级 Cohort C 队列中 13 个工具的多语言 TDK/Snippet 深度优化与审核以确保具备优秀的索引收录品质，并设计评估 GEO-03 自动化 GSC 恢复管线。

## Requirements

### Traffic Performance & Analysis (TSEO)
- [ ] **TSEO-04** - **7-Day Checkpoint GSC Performance Analysis**: 导入 2026-06-09 至 2026-06-16 期间的 GSC Performance 数据，运行比对脚本，生成 `docs/GSC_COHORT_CHECKPOINT_2026-06-16.md` 表现分析报告，详细汇总 Cohort A 与 Cohort B 的点击量及曝光量回升情况。

### Translation & Metadata Quality (HTDK)
- [ ] **HTDK-03** - **Cohort C Metadata Content Optimization**: 对 Cohort C 队列中的 13 个工具进行多语言（10个Locale）元数据（Title/Description）深度人工/程序化审计。修复任何可能导致被 Google 视作低品质内容的自动翻译腔、语义不通顺或 placeholder 残留问题，全面优化 snippet，做好索引提交准备。
  - **覆盖工具清单**：
    1. `typing-speed-test`
    2. `pixel-density-calculator`
    3. `document-word-counter`
    4. `screen-recorder`
    5. `calorie-calculator`
    6. `gantt-chart-generator` (西班牙语版等非英版本)
    7. `ascii-table`
    8. `dice-roller`
    9. `credit-card-validator`
    10. `timeline-chart-generator`
    11. `mortgage-calculator` (法语版等非英版本)
    12. `bra-size-calculator`
    13. `random-color-generator`

### Automated Recovery Infrastructure (GEO)
- [ ] **GEO-03** - **Automated GSC Recovery Pipeline Design**: 进行技术选型与概要设计。程序化设计一套轻量化的 GSC 404/Exclude 报错日志拉取管线，并能够在边缘层 (edge middleware) 自动化按需生成动态的 301 重定向映射表，以便能动态收复因为旧链接未配置重定向而丢失的流量分值。

## Future Requirements (Deferred)

- **GEO-04** - **Automated GSC Recovery Pipeline Implementation**: 实现并部署前述管线到生产环境 Workers/R2 架构中（延后至 v0.0.19+ 解决）。

## Out of Scope

- 对 Cohort C 之外的其他低流量工具进行本轮的元数据重构（本轮资源需集中用于收复有曝光流失信号 of Cohort C 页面）。
- 直接在大版本中上线未经验证的全自动 GSC 动态重定向写入逻辑（以防污染 edge routing 表导致崩溃，需先在 v0.0.18 进行方案与沙盒设计）。

## Traceability

| Requirement ID | Description | Assigned Phase | Status | Plan/Summary Evidence |
| :--- | :--- | :--- | :--- | :--- |
| **TSEO-04** | 7-Day Checkpoint GSC Performance Analysis | Phase 66 | Proposed | |
| **HTDK-03** | Cohort C Metadata Content Optimization | Phase 67 | Proposed | |
| **GEO-03** | Automated GSC Recovery Pipeline Design | Phase 68 | Proposed | |
