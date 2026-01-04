# 翻译维护规则 (Translation Maintenance Rules)

## 📋 概述

本项目支持 10 种语言：en, zh, ja, ko, es, pt, fr, de, ru, ar

翻译文件采用模块化结构，需要特别注意翻译键的完整性。

---

## ⚠️ 历史问题记录

### 2025-01-04 翻译键缺失修复

**问题描述**：
- 切换语言时出现 `MISSING_MESSAGE: Could not resolve 'tools.xxx.inputPlaceholder'` 错误
- 多个工具缺少必要的翻译键

**修复内容**：

1. **添加 `inputPlaceholder` 到 10 个工具**（所有 10 种语言）：
   - hash-generator
   - hex-editor
   - html-encoder
   - json-minifier
   - markdown-preview
   - number-base-converter
   - qr-generator
   - text-to-slug
   - url-encoder
   - word-counter

2. **修复 `stopwatchUI` 命名空间**（6 种语言）：
   - es, pt, fr, de, ru, ar 缺少完整的 stopwatchUI 键
   - 添加了：start, stop, reset, lap, laps, lapNumber, lapTime, totalTime, lapLabel

**根本原因**：
- 组件使用了 `t('inputPlaceholder')` 但翻译文件中没有对应的键
- 自定义 UI 命名空间（如 stopwatchUI）在部分语言中为空或不完整

---

## 🔧 翻译键检查流程

### 添加新工具时

1. **检查组件中使用的所有翻译键**：
   ```bash
   grep -o "t('[^']*')" src/components/tools/YourComponent.tsx
   ```

2. **确认这些键在所有语言中存在**：
   - 通用键（如 `inputPlaceholder`）应该在 `tools` 对象的根级别
   - 工具特定键应该在 `tools.{tool-slug}` 下
   - 自定义 UI 命名空间应该在 `tools.{namespace}` 下

3. **运行测试验证**：
   ```bash
   npm run test -- --run src/messages/translations.test.ts
   ```

### 常见翻译键参考

```json
{
  "tools": {
    "inputPlaceholder": "在此输入文本...",
    "outputPlaceholder": "结果将显示在这里...",
    "copy": "复制",
    "copied": "已复制！",
    "clear": "清空",
    "input": "输入",
    "output": "输出",
    "convert": "转换",
    "generate": "生成",
    "format": "格式化",
    "download": "下载",
    "error": "错误"
  }
}
```

### 自定义 UI 命名空间示例

```json
{
  "tools": {
    "stopwatchUI": {
      "start": "开始",
      "stop": "停止",
      "reset": "重置",
      "lap": "计圈",
      "laps": "圈数",
      "lapNumber": "圈",
      "lapTime": "圈时",
      "totalTime": "总计",
      "lapLabel": "第"
    }
  }
}
```

---

## 📝 翻译文件结构

```
src/messages/
├── {locale}.json          # 主翻译文件（必须完整）
├── {locale}/
│   ├── base.json          # 基础翻译（自动生成）
│   └── tools/
│       └── {slug}.json    # 工具详细翻译（自动生成）
```

### 更新流程

1. 修改 `src/messages/{locale}.json` 主文件
2. 运行 `npx tsx scripts/split-translations.ts` 更新拆分文件
3. 运行测试确认无错误

---

## 🚨 注意事项

1. **永远不要只更新部分语言** - 必须同时更新所有 10 种语言
2. **检查组件使用的翻译键** - 确保所有使用的键都有对应翻译
3. **自定义命名空间要完整** - 如果创建了新的 UI 命名空间，必须在所有语言中添加完整的键
4. **运行测试验证** - 每次修改翻译后都要运行测试确认
