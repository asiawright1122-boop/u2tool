# Implementation Plan: Chart Tools

## Overview

本实现计划将完成图表工具分类的剩余功能，包括折线图生成器、饼图生成器和雷达图生成器。柱状图生成器已经实现，将作为参考模板。

## Tasks

- [x] 1. 实现折线图生成器
  - [x] 1.1 创建 LineChartGenerator.tsx 组件
    - 参考 BarChartGenerator.tsx 的结构
    - 实现多系列数据支持
    - 实现线条样式选项（实线、虚线、点线）
    - 实现平滑曲线选项
    - 实现区域填充选项
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6_
  - [x] 1.2 在 tools.ts 中注册折线图工具
    - 添加 line-chart-generator 到 tools 数组
    - _Requirements: 1.2_
  - [x] 1.3 添加折线图工具的国际化翻译
    - 在 en.json, zh.json, es.json, pt.json, ja.json 中添加翻译
    - _Requirements: 9.1, 9.2_

- [x] 2. 实现饼图生成器
  - [x] 2.1 创建 PieChartGenerator.tsx 组件
    - 实现饼图数据编辑器（名称-数值对）
    - 实现百分比标签显示
    - 实现环形图变体选项
    - 实现自定义扇区颜色
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6_
  - [x] 2.2 在 tools.ts 中注册饼图工具
    - 添加 pie-chart-generator 到 tools 数组
    - _Requirements: 1.2_
  - [x] 2.3 添加饼图工具的国际化翻译
    - 在所有 5 种语言文件中添加翻译
    - _Requirements: 9.1, 9.2_

- [x] 3. 实现雷达图生成器
  - [x] 3.1 创建 RadarChartGenerator.tsx 组件
    - 实现指标编辑器（名称和最大值）
    - 实现多系列数据支持
    - 实现填充透明度调节
    - 实现形状选项（多边形/圆形）
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_
  - [x] 3.2 在 tools.ts 中注册雷达图工具
    - 添加 radar-chart-generator 到 tools 数组
    - _Requirements: 1.2_
  - [x] 3.3 添加雷达图工具的国际化翻译
    - 在所有 5 种语言文件中添加翻译
    - _Requirements: 9.1, 9.2_

- [x] 4. Checkpoint - 确保所有图表工具正常工作
  - 确保所有测试通过，如有问题请询问用户

- [x] 5. 添加 CSV 导入功能（可选增强）
  - [x] 5.1 为所有图表工具添加 CSV 导入按钮
    - 实现 CSV 解析函数
    - 添加导入按钮到工具栏
    - _Requirements: 6.6_

- [x] 6. Final Checkpoint - 最终验证
  - 确保所有测试通过，如有问题请询问用户

## Notes

- 柱状图生成器 (BarChartGenerator.tsx) 已实现，可作为其他图表的参考模板
- 所有图表工具共享相同的颜色主题预设
- 导出功能使用 ECharts 内置的 getDataURL 方法
- 国际化翻译需要覆盖所有 UI 元素和提示信息
