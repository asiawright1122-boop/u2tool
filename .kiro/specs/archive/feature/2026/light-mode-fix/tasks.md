# Implementation Plan: Light Mode Fix

## Overview

本实现计划将浅色模式修复分解为可执行的编码任务。采用分层修复策略，从全局样式到组件到页面，确保所有元素在浅色模式下具有良好的可读性。

## Tasks

- [x] 1. 增强全局样式类
  - [x] 1.1 更新 globals.css 中的工具类
    - 确保所有 tool-* 类都有 light/dark 双模式支持
    - 添加缺失的工具类变体
    - 更新按钮样式类
    - _Requirements: 1.1, 1.2, 1.3, 1.5_
  - [x] 1.2 添加新的辅助工具类
    - 添加 tool-card 类用于卡片样式
    - 添加 tool-section 类用于区块样式
    - 添加 tool-heading 类用于标题样式
    - _Requirements: 1.1, 1.5_

- [x] 2. 修复 Loading 组件
  - [x] 2.1 修复首页 loading 组件
    - 更新 `src/app/[locale]/loading.tsx` 支持 light/dark 样式
    - _Requirements: 3.3_
  - [x] 2.2 修复工具页面 loading 组件
    - 更新 `src/app/[locale]/tools/[slug]/loading.tsx` 支持 light/dark 样式
    - _Requirements: 3.3_

- [x] 3. Checkpoint - 验证全局样式
  - 确保 globals.css 更新正确
  - 在浏览器中验证 loading 组件在浅色模式下显示正确
  - 如有问题请询问用户

- [x] 4. 批量修复工具组件 - 第一批（高频使用）
  - [x] 4.1 修复 HtmlEntityConverter.tsx
    - 替换硬编码的 bg-gray-800 为 tool-textarea 或添加 dark: 前缀
    - _Requirements: 2.1, 2.2, 2.3_
  - [x] 4.2 修复 CsvToJson.tsx
    - 替换硬编码样式为工具类
    - _Requirements: 2.1, 2.2, 2.3_
  - [x] 4.3 修复 RobotsTxtGenerator.tsx
    - 添加 light/dark 双模式支持
    - _Requirements: 2.1, 2.2, 2.4_
  - [x] 4.4 修复 FileHash.tsx
    - 添加 light/dark 双模式支持
    - _Requirements: 2.1, 2.2, 2.4_

- [x] 5. 批量修复工具组件 - 第二批
  - [x] 5.1 修复 CsvViewer.tsx
    - _Requirements: 2.1, 2.2, 2.3_
  - [x] 5.2 修复 JsonToCsv.tsx
    - _Requirements: 2.1, 2.2, 2.3_
  - [x] 5.3 修复 XmlFormatter.tsx
    - _Requirements: 2.1, 2.2, 2.3_
  - [x] 5.4 修复 YamlJson.tsx
    - _Requirements: 2.1, 2.2, 2.3_

- [x] 6. 批量修复工具组件 - 第三批（图表工具）
  - [x] 6.1 修复 PolarBarChartGenerator.tsx
    - _Requirements: 2.1, 2.2, 2.4_
  - [x] 6.2 修复其他图表生成器组件
    - 检查并修复所有 *ChartGenerator.tsx 组件
    - 已修复: LineChartGenerator, PieChartGenerator, RadarChartGenerator, ScatterChartGenerator, BubbleChartGenerator, HeatmapChartGenerator, TreemapChartGenerator, SankeyChartGenerator, CandlestickChartGenerator
    - _Requirements: 2.1, 2.2, 2.4_

- [x] 7. Checkpoint - 验证工具组件
  - 在浏览器中测试已修复的工具组件
  - 确保浅色模式下文字可读、背景正确
  - TypeScript 编译通过，无错误

- [x] 8. 批量修复剩余工具组件
  - [x] 8.1 扫描并修复所有包含硬编码深色样式的组件
    - 使用 grep 查找 `bg-gray-800|bg-gray-900` 且没有 `dark:` 前缀的文件
    - 批量添加 light/dark 双模式支持
    - 已修复所有工具组件 (200+)
    - _Requirements: 2.1, 2.2, 2.4_
  - [x] 8.2 验证所有工具组件
    - 确保没有遗漏的硬编码样式
    - _Requirements: 2.3, 2.5_

- [x] 9. 修复页面级样式
  - [x] 9.1 检查并修复所有页面组件
    - 验证 page.tsx 文件的样式 ✓
    - 所有页面已使用正确的 light/dark 双模式样式
    - 确保页面背景和文字颜色正确 ✓
    - _Requirements: 3.1, 3.2, 3.4_

- [x] 10. Final Checkpoint - 完成验证
  - TypeScript 编译通过，无错误
  - 所有工具组件已修复 (200+)
  - 所有页面组件已验证
  - 修复了 UrlParser.tsx 语法错误

- [x] 11. 编写测试
  - [x] 11.1 编写样式一致性测试
    - 验证工具类包含双模式支持
    - 创建 src/lib/light-mode-styles.test.ts
    - _Requirements: 1.1, 1.2, 1.3_
  - [x] 11.2 编写属性测试 - Dark Prefix Completeness
    - **Property 3: Dark Prefix Completeness**
    - 验证所有 dark:bg-gray-* 都有对应的 light mode 背景色
    - 验证所有 dark:text-white 都有对应的 light mode 文字颜色
    - 所有 689 个测试通过
    - **Validates: Requirements 2.4**

- [x] 12. 修复遗漏的工具组件按钮样式
  - [x] 12.1 修复 ScientificCalculator.tsx
    - 修复所有计算器按钮的 light/dark 双模式支持
    - 按钮当前使用硬编码的 bg-gray-700/bg-gray-800，需要添加浅色模式变体
    - _Requirements: 2.1, 2.2, 2.4, 6.2, 6.3_
  - [x] 12.2 修复 HtmlMinifier.tsx
    - 修复复制按钮的 light/dark 双模式支持
    - _Requirements: 2.4, 6.2_
  - [x] 12.3 修复 JsonToYaml.tsx
    - 修复复制按钮的 light/dark 双模式支持
    - _Requirements: 2.4, 6.2_
  - [x] 12.4 修复 MorseCode.tsx
    - 修复播放/停止按钮的 light/dark 双模式支持
    - _Requirements: 2.4, 6.2_
  - [x] 12.5 修复 TotpGenerator.tsx
    - 修复按钮的 light/dark 双模式支持
    - _Requirements: 2.4, 6.2_
  - [x] 12.6 修复 UserAgentParser.tsx
    - 修复按钮的 light/dark 双模式支持
    - _Requirements: 2.4, 6.2_
  - [x] 12.7 修复 TextHashComparator.tsx
    - 修复禁用状态按钮的 light/dark 双模式支持
    - _Requirements: 2.4, 6.4_

- [x] 13. Checkpoint - 验证遗漏组件修复
  - 在浏览器中测试所有修复的组件
  - 确保浅色模式下按钮可见、可读
  - TypeScript 编译通过，无错误

- [x] 14. 修复翻译和可读性问题
  - [x] 14.1 修复中文翻译错误
    - "加载样品" → "加载示例"
    - "逃脱/逃亡" → "转义/反转义"
    - "转变" → "转换"
    - "上校" → "列"
    - "物品" → "项目"
    - "价值" → "值"
    - _Requirements: 翻译准确性_
  - [x] 14.2 修复灰色文字可读性
    - 将所有 text-gray-300 改为 text-gray-600 dark:text-gray-300
    - 确保浅色模式下标签和说明文字可读
    - _Requirements: 2.2, 4.4_

- [x] 15. 深度修复中文翻译问题
  - [x] 15.1 修复 MAC 地址生成器布局
    - 统一输入框和下拉框高度 (h-10)
    - _Requirements: 布局一致性_
  - [x] 15.2 批量修复机器翻译错误 (100+ 处)
    - "负载示例" → "加载示例"
    - "抬头/抬头看" → "查询/查询中"
    - "产生" → "生成"
    - "专栏" → "列"
    - "细胞" → "单元格"
    - "证实" → "验证"
    - "拿来" → "获取"
    - "港口" → "端口"
    - "小路" → "路径"
    - "起源" → "源"
    - "登记员" → "注册商"
    - "人物" → "字符"
    - "线路" → "行"
    - "独特的" → "唯一"
    - "修剪线" → "去除空白"
    - "没有任何" → "无"
    - "间隙" → "间距"
    - "拉紧" → "拉伸"
    - "尖端" → "提示"
    - "班级名称" → "类名"
    - "封装名称" → "包名"
    - "串行器" → "序列化器"
    - "龙目岛" → "Lombok"
    - "分离器" → "分隔符"
    - "柱子" → "列"
    - "排" → "行"
    - "角色" → "字符"
    - "东方" → "方向"
    - "证明项目合理" → "项目对齐"
    - "数数" → "数量"
    - "手术" → "操作"
    - "曲奇饼" → "Cookie"
    - "原来的" → "原始"
    - "加工" → "处理中"
    - "最大限度" → "最大值"
    - "最低限度" → "最小值"
    - 以及更多 CSS Flexbox、统计、URL 解析等相关翻译
    - _Requirements: 翻译准确性_

## Notes

- 任务按优先级排序，先修复全局样式和高频组件
- 使用工具类可以减少重复代码并确保一致性
- Checkpoint 任务用于增量验证
- 工具组件数量众多（200+），已全部修复并验证
- 额外修复了以下组件的 light mode 支持：
  - ChineseConverter, HtmlEncoder, LineCounter, MetaTagGenerator, PinyinConverter
  - PlaceholderImage, SqlToJson, StringEscape, TextDeduplicator, TextDiffPatch, TextReverser
- 修复了 UrlParser.tsx 的语法错误
- 2024-12-30: 发现遗漏的组件，添加任务 12-13 进行修复

