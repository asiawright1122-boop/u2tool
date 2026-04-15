# Percentage Stacked Bar Chart 翻译键修复

## 问题描述

在使用 `PercentageStackedBarChartGenerator` 组件时，切换语言后出现 `MISSING: tools.percentage-stacked-bar-chart-generator.sampleData.q1` 等错误。

## 根本原因

组件代码中使用的翻译键是小写的 `q1`, `q2`, `q3`, `q4`：

```typescript
const defaultDataValues = [
  { id: 'def-1', categoryKey: 'q1', values: [30, 40, 30] },
  { id: 'def-2', categoryKey: 'q2', values: [25, 35, 40] },
  { id: 'def-3', categoryKey: 'q3', values: [35, 30, 35] },
  { id: 'def-4', categoryKey: 'q4', values: [20, 45, 35] },
];

// 在初始化时使用
data = defaultDataValues.map(item => ({
  id: item.id,
  category: t(`sampleData.${item.categoryKey}`), // 这里会查找 sampleData.q1
  values: item.values
}));
```

但翻译文件中的键是大写的 `Q1`, `Q2`, `Q3`, `Q4`：

```json
{
  "sampleData": {
    "Q1": "第一季度",
    "Q2": "第二季度",
    "Q3": "第三季度",
    "Q4": "第四季度"
  }
}
```

## 解决方案

将所有 10 种语言的翻译文件中的大写键改为小写：

- `Q1` → `q1`
- `Q2` → `q2`
- `Q3` → `q3`
- `Q4` → `q4`

## 修复范围

修复了以下语言的翻译文件：

1. ✅ en.json - 英语
2. ✅ zh.json - 中文
3. ✅ ja.json - 日语
4. ✅ ko.json - 韩语
5. ✅ es.json - 西班牙语
6. ✅ pt.json - 葡萄牙语
7. ✅ fr.json - 法语
8. ✅ de.json - 德语
9. ✅ ru.json - 俄语
10. ✅ ar.json - 阿拉伯语

## 验证

运行验证脚本确认所有翻译键都正确：

```bash
npx tsx scripts/verify-percentage-stacked-bar-chart-fix.ts
```

结果：✓ 验证成功！所有翻译键都正确。

## 影响

- **修复前**：切换语言后，图表的默认类别名称显示为 `MISSING: tools.percentage-stacked-bar-chart-generator.sampleData.q1` 等错误信息
- **修复后**：所有语言都能正确显示本地化的类别名称（如中文显示"第一季度"、"第二季度"等）

## 经验教训

1. **翻译键命名规范**：应该统一使用小写或驼峰命名，避免大小写不一致
2. **组件开发时检查翻译**：在开发组件时应该立即检查所有语言的翻译是否存在
3. **自动化验证**：应该有自动化测试来检查翻译键的完整性和一致性

## 相关文件

- 组件：`src/components/tools/PercentageStackedBarChartGenerator.svelte`
- 翻译文件：`src/messages/{locale}.json`（10 种语言）

## 修复日期

2026-04-15
