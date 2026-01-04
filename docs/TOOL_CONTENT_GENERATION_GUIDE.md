# 工具内容生成指南

## 📋 概述

本指南说明如何使用内容生成脚本为每个工具生成独特、详细的内容，以改善 Bing 内容质量评估。

## 🎯 目标

为每个工具页面生成：
- **详细描述**（300-500字）
- **使用说明**（步骤和示例）
- **常见问题**（FAQ）
- **SEO 优化内容**（标题和描述）

## 🚀 使用方法

### 1. 生成单个工具内容

```bash
npx ts-node scripts/generate-tool-content.ts --tool=json-formatter
```

### 2. 生成某个分类的所有工具

```bash
npx ts-node scripts/generate-tool-content.ts --category=encoding
```

### 3. 生成所有工具内容

```bash
npx ts-node scripts/generate-tool-content.ts --all
```

## 📁 输出格式

生成的内容保存在 `content/tools/` 目录下，每个工具一个 JSON 文件：

```json
{
  "name": "Json Formatter",
  "description": "简短描述（50-100字）",
  "detailedDescription": "详细描述（300-500字）",
  "seoTitle": "SEO 标题",
  "seoDescription": "SEO 描述（120-160字符）",
  "usage": {
    "steps": ["步骤1", "步骤2", ...],
    "examples": ["示例1", "示例2", ...]
  },
  "faqs": [
    {
      "question": "问题",
      "answer": "答案"
    }
  ],
  "relatedTools": []
}
```

## 📝 内容结构

### 详细描述（300-500字）

包含：
1. 工具分类介绍
2. 工具功能特点（3-5点）
3. 使用场景
4. 安全性和隐私说明
5. 总结

### 使用说明

- **步骤**：清晰的操作步骤（3-5步）
- **示例**：实际使用示例（2-3个）

### 常见问题（FAQ）

每个工具至少包含 5-6 个常见问题：
1. 是否免费？
2. 是否安全？
3. 需要安装软件吗？
4. 处理速度如何？
5. 工具特定问题（根据工具类型）

## 🔧 集成到网站

生成的内容需要集成到网站中：

### 1. 更新翻译文件

将生成的内容添加到 `src/messages/{locale}.json`：

```json
{
  "tools": {
    "json-formatter": {
      "name": "JSON 格式化器",
      "description": "简短描述",
      "seo_title": "SEO 标题",
      "seo_description": "SEO 描述"
    }
  }
}
```

### 2. 添加详细描述组件

在工具页面添加详细描述区域：

```tsx
<div className="tool-description">
  {t(`${slug}.detailed_description`)}
</div>
```

### 3. 添加使用说明组件

```tsx
<div className="tool-usage">
  <h3>使用说明</h3>
  <ol>
    {usageSteps.map((step, i) => (
      <li key={i}>{step}</li>
    ))}
  </ol>
</div>
```

### 4. FAQ 已集成

FAQ 组件已存在，会自动使用生成的内容。

## 📊 内容质量检查

生成内容后，检查：

1. ✅ **描述长度**：详细描述应在 300-500 字之间
2. ✅ **SEO 描述**：应在 120-160 字符之间
3. ✅ **FAQ 数量**：至少 5-6 个问题
4. ✅ **内容独特性**：每个工具的描述应该不同
5. ✅ **可读性**：内容应该清晰、易懂

## 🎨 内容优化建议

### 1. 增加原创性

- 为每个工具添加独特的使用场景
- 添加实际案例和示例
- 说明工具的技术原理（如适用）

### 2. 改善可读性

- 使用短句和段落
- 添加小标题和列表
- 使用示例和截图（如适用）

### 3. 增加价值

- 说明工具的实际用途
- 提供最佳实践建议
- 添加相关工具推荐

## 📈 效果评估

生成内容后，监控：

1. **Bing Webmaster Tools**
   - 内容质量警告是否减少
   - 索引覆盖率是否提高

2. **用户行为**
   - 页面停留时间
   - 跳出率
   - 用户互动

3. **SEO 指标**
   - 搜索排名
   - 点击率
   - 自然流量

## 🔄 持续优化

1. **定期更新**
   - 每季度检查内容质量
   - 根据用户反馈更新内容
   - 添加新的使用示例

2. **A/B 测试**
   - 测试不同的描述方式
   - 优化 FAQ 内容
   - 改善使用说明

3. **数据分析**
   - 分析用户行为数据
   - 识别需要改进的工具
   - 优化低质量页面

## 📝 注意事项

1. **内容独特性**
   - 每个工具的描述应该不同
   - 避免重复或相似的内容
   - 根据工具特点定制内容

2. **SEO 优化**
   - 不要过度优化关键词
   - 内容应该对用户有价值
   - 遵循搜索引擎指南

3. **用户体验**
   - 内容应该易于理解
   - 提供清晰的使用指导
   - 回答用户的常见问题

## 🔗 相关文档

- [Bing 内容质量改善指南](./BING_CONTENT_QUALITY_IMPROVEMENT.md)
- [SEO 设置指南](./SEO_SETUP_GUIDE.md)
- [工具配置](./../src/config/tools.ts)

---

## 📝 更新记录

- 2026-01-04: 创建工具内容生成指南
- 脚本位置: `scripts/generate-tool-content.ts`
- 输出目录: `content/tools/`

