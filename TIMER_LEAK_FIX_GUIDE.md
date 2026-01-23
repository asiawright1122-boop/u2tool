# 定时器内存泄漏修复指南

**问题**: 125 个组件使用 `setTimeout` 但没有清理，导致内存泄漏和页面无响应

**影响**: 这是导致你报告的"页面无响应"问题的主要原因

---

## 🎯 修复方案

### 标准修复模式

对于使用 `setTimeout(() => setCopied(false), 2000)` 模式的组件：

#### 修复前
```typescript
'use client';

import { useState } from 'react';

export default function MyTool() {
  const [copied, setCopied] = useState(false);

  const copyOutput = async () => {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // ❌ 没有清理
  };

  return (
    // JSX...
  );
}
```

#### 修复后
```typescript
'use client';

import { useState, useRef, useEffect } from 'react'; // ✅ 添加 useRef, useEffect

export default function MyTool() {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null); // ✅ 添加 ref

  const copyOutput = async () => {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    // ✅ 清理旧定时器（防止快速点击）
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    // ✅ 保存定时器 ID
    timerRef.current = setTimeout(() => setCopied(false), 2000);
  };

  // ✅ 组件卸载时清理
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return (
    // JSX...
  );
}
```

---

## 📝 修复步骤

### 步骤 1: 添加导入
```typescript
// 修改前
import { useState } from 'react';

// 修改后
import { useState, useRef, useEffect } from 'react';
```

### 步骤 2: 添加 timerRef
在组件的 state 声明后添加：
```typescript
const timerRef = useRef<NodeJS.Timeout | null>(null);
```

### 步骤 3: 修改 setTimeout 调用
```typescript
// 修改前
setTimeout(() => setCopied(false), 2000);

// 修改后
if (timerRef.current) {
  clearTimeout(timerRef.current);
}
timerRef.current = setTimeout(() => setCopied(false), 2000);
```

### 步骤 4: 添加清理 useEffect
在组件的 return 语句**之前**添加：
```typescript
useEffect(() => {
  return () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
  };
}, []);
```

---

## ✅ 已修复的文件

- `src/components/tools/Base64.tsx` ✅

---

## ⏳ 待修复的文件（124 个）

<details>
<summary>点击展开完整列表</summary>

1. src/components/tools/AnagramSolver.tsx
2. src/components/tools/AspectRatioCalculator.tsx
3. src/components/tools/Base32.tsx
4. src/components/tools/Base58.tsx
5. src/components/tools/BatchTimestampConverter.tsx
6. src/components/tools/BinaryToText.tsx
7. src/components/tools/BionicReadingConverter.tsx
8. src/components/tools/CaseConverter.tsx
9. src/components/tools/CharacterMap.tsx
10. src/components/tools/ChineseConverter.tsx
11. src/components/tools/ChineseLoremIpsum.tsx
12. src/components/tools/ChmodCalculator.tsx
13. src/components/tools/CodeMinifier.tsx
14. src/components/tools/CoinFlipper.tsx
15. src/components/tools/ColorConverter.tsx
16. src/components/tools/ColorExtractor.tsx
17. src/components/tools/ColorPalette.tsx
18. src/components/tools/ColorPicker.tsx
19. src/components/tools/CronGenerator.tsx
20. src/components/tools/CspGenerator.tsx
21. src/components/tools/CssAnimationGenerator.tsx
22. src/components/tools/CssClipPathGenerator.tsx
23. src/components/tools/CssFlexboxGenerator.tsx
24. src/components/tools/CssGridGenerator.tsx
25. src/components/tools/CssToTailwind.tsx
26. src/components/tools/CsvToJson.tsx
27. src/components/tools/DataUri.tsx
28. src/components/tools/DiceRoller.tsx
29. src/components/tools/EmojiPicker.tsx
30. src/components/tools/EnvParser.tsx
31. src/components/tools/ExcelToJson.tsx
32. src/components/tools/FakeDataGenerator.tsx
33. src/components/tools/FakeNameGenerator.tsx
34. src/components/tools/FaviconGenerator.tsx
35. src/components/tools/FlipText.tsx
36. src/components/tools/FractionCalculator.tsx
37. src/components/tools/GdprConsentGenerator.tsx
38. src/components/tools/GradientGenerator.tsx
39. src/components/tools/GraphqlFormatter.tsx
40. src/components/tools/HashGenerator.tsx
41. src/components/tools/HexBase64Converter.tsx
42. src/components/tools/HexEditor.tsx
43. src/components/tools/HmacGenerator.tsx
44. src/components/tools/HtaccessToNginx.tsx
45. src/components/tools/HtmlEncoder.tsx
46. src/components/tools/HtmlEntityConverter.tsx
47. src/components/tools/HtmlMinifier.tsx
48. src/components/tools/HtmlTableGenerator.tsx
49. src/components/tools/HtmlToJsx.tsx
50. src/components/tools/HtmlToPdf.tsx
51. src/components/tools/ImageToBase64.tsx
52. src/components/tools/InstagramFontGenerator.tsx
53. src/components/tools/InvisibleCharacterGenerator.tsx
54. src/components/tools/JsObfuscator.tsx
55. src/components/tools/JsonEscape.tsx
56. src/components/tools/JsonFormatter.tsx
57. src/components/tools/JsonMinifier.tsx
58. src/components/tools/JsonPathFinder.tsx
59. src/components/tools/JsonPathTester.tsx
60. src/components/tools/JsonSchemaGenerator.tsx
61. src/components/tools/JsonToCsv.tsx
62. src/components/tools/JsonToForm.tsx
63. src/components/tools/JsonToGo.tsx
64. src/components/tools/JsonToGraphql.tsx
65. src/components/tools/JsonToProto.tsx
66. src/components/tools/JsonToSql.tsx
67. src/components/tools/JsonToTable.tsx
68. src/components/tools/JsonToTypescript.tsx
69. src/components/tools/JsonToXml.tsx
70. src/components/tools/JsonToYaml.tsx
71. src/components/tools/JsonToZod.tsx
72. src/components/tools/JwtDebugger.tsx
73. src/components/tools/JwtDecoder.tsx
74. src/components/tools/JwtGenerator.tsx
75. src/components/tools/LoremIpsum.tsx
76. src/components/tools/LoveCalculator.tsx
77. src/components/tools/MarkdownPreview.tsx
78. src/components/tools/MarkdownTableGenerator.tsx
79. src/components/tools/MarkdownToHtml.tsx
80. src/components/tools/MarkdownToPdf.tsx
81. src/components/tools/MetaTagGenerator.tsx
82. src/components/tools/MorseCodePlayer.tsx
83. src/components/tools/NameGenerator.tsx
84. src/components/tools/NumberBaseConverter.tsx
85. src/components/tools/NumberFormatter.tsx
86. src/components/tools/OpenGraphPreview.tsx
87. src/components/tools/ParaphraseTool.tsx
88. src/components/tools/PasswordGenerator.tsx
89. src/components/tools/PercentageCalculator.tsx
90. src/components/tools/PercentageChangeCalculator.tsx
91. src/components/tools/PinyinConverter.tsx
92. src/components/tools/PngToSvg.tsx
93. src/components/tools/RandomColorGenerator.tsx
94. src/components/tools/RegexPatterns.tsx
95. src/components/tools/ResumeBuilder 2.tsx
96. src/components/tools/RobotsTxtGenerator.tsx
97. src/components/tools/RomanNumeralConverter.tsx
98. src/components/tools/ScientificCalculator.tsx
99. src/components/tools/SmallTextGenerator.tsx
100. src/components/tools/SqlFormatter.tsx
101. src/components/tools/SqlToMongo.tsx
102. src/components/tools/SriHashGenerator.tsx
103. src/components/tools/StatisticsCalculator.tsx
104. src/components/tools/StrikethroughText.tsx
105. src/components/tools/SvgEditor.tsx
106. src/components/tools/SvgOptimizer.tsx
107. src/components/tools/TailwindToCss.tsx
108. src/components/tools/TextExtractor.tsx
109. src/components/tools/TextRepeater.tsx
110. src/components/tools/TextSorter.tsx
111. src/components/tools/TextSummarizer.tsx
112. src/components/tools/TextToBinary.tsx
113. src/components/tools/TextToSlug.tsx
114. src/components/tools/TextWrapper.tsx
115. src/components/tools/TimeCalculator.tsx
116. src/components/tools/TimezoneConverter.tsx
117. src/components/tools/TypescriptToJson.tsx
118. src/components/tools/UnicodeConverter.tsx
119. src/components/tools/UnitConverter.tsx
120. src/components/tools/UrlEncoder.tsx
121. src/components/tools/UrlParser.tsx
122. src/components/tools/UuidGenerator.tsx
123. src/components/tools/WordUnscrambler.tsx
124. src/components/tools/XmlFormatter.tsx

</details>

---

## 🤖 自动化选项

### 选项 A: 使用 AI 辅助（推荐）

使用 AI 编辑器（如 Cursor、GitHub Copilot）批量修复：

1. 打开一个文件
2. 选择包含 `setTimeout` 的函数
3. 提示 AI: "Add timer cleanup using useRef and useEffect"
4. 验证修复
5. 重复

### 选项 B: 使用查找替换

虽然不能完全自动化，但可以加速：

1. 全局查找: `import { useState } from 'react';`
2. 替换为: `import { useState, useRef, useEffect } from 'react';`
3. 手动添加 timerRef 和 useEffect

### 选项 C: 手动修复

按照上面的步骤，逐个文件修复。

---

## ⚠️ 注意事项

1. **useEffect 位置**: 必须在 return 语句**之前**
2. **依赖数组**: 使用空数组 `[]` 表示只在挂载/卸载时执行
3. **TypeScript 类型**: `useRef<NodeJS.Timeout | null>(null)`
4. **测试**: 修复后测试复制功能是否正常

---

## 🧪 验证修复

修复后运行：

```bash
# 检查编译错误
npm run build

# 运行开发服务器测试
npm run dev

# 再次运行诊断
npx tsx scripts/performance-audit/quick-diagnose.ts
```

---

## 📊 预期效果

修复所有 125 个文件后：

- ✅ 页面无响应警告消失
- ✅ 内存使用稳定
- ✅ 长时间使用不会变慢
- ✅ 复制按钮响应更快

---

## 💡 建议

鉴于自动化脚本的复杂性，我建议：

1. **短期方案**: 手动修复最常用的 10-20 个工具
2. **中期方案**: 使用 AI 辅助批量修复
3. **长期方案**: 创建 ESLint 规则防止未来出现类似问题

---

## 📞 需要帮助？

如果需要帮助修复特定文件，请告诉我文件名，我可以提供具体的修复代码。

---

**创建时间**: 2026-01-23  
**状态**: 1/125 已修复
