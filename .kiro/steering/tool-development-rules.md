# 工具开发规则 (Tool Development Rules)

## 添加新工具时的必要步骤

当添加新工具到项目中时，**必须**完成以下所有步骤，否则会导致 "Tool not found" 错误：

### 1. 工具配置 (src/config/tools.ts)
- 在 `tools` 数组中添加工具配置
- 包含：`slug`, `category`, `icon`, `component`, `popular`（可选）

### 2. 动态导入注册 (src/components/tools/ToolWrapper.tsx)
- 在 `toolComponents` 对象中添加动态导入
- 格式：`'tool-slug': dynamic(() => import('./ToolComponent'))`
- **关键**：slug 必须与 tools.ts 中的 slug 完全一致

### 3. 组件文件 (src/components/tools/[ComponentName].tsx)
- 创建工具组件文件
- 使用 `export default` 导出组件
- 组件名称必须与 ToolWrapper.tsx 中的导入路径一致

### 4. 翻译文件 (src/messages/*.json)
- **必须**在所有语言文件中添加翻译：
  - `en.json` (英文)
  - `zh.json` (中文)
  - `ja.json` (日文)
  - `es.json` (西班牙文)
  - `pt.json` (葡萄牙文)
- 翻译键格式：`tools.{tool-slug}.name`, `tools.{tool-slug}.description`, `tools.{tool-slug}.seo_title`, `tools.{tool-slug}.seo_description`

## 常见错误原因

1. **"Tool not found" 错误**：
   - ToolWrapper.tsx 中缺少动态导入
   - slug 不匹配（tools.ts vs ToolWrapper.tsx）
   - 组件文件不存在或导出方式错误

2. **翻译缺失导致的问题**：
   - 某些语言环境下工具名称显示为翻译键
   - 页面渲染错误

## 检查清单

添加新工具后，运行以下检查：

```bash
# 检查所有语言的翻译是否存在
node -e "
const fs = require('fs');
const toolSlug = 'your-tool-slug';
['en', 'zh', 'ja', 'es', 'pt'].forEach(lang => {
  const data = JSON.parse(fs.readFileSync('src/messages/' + lang + '.json', 'utf8'));
  if (data.tools[toolSlug]) {
    console.log('✓', lang, '- OK');
  } else {
    console.log('✗', lang, '- MISSING');
  }
});
"
```

## 重要提醒

⚠️ **每次添加新工具时，必须同时更新所有 5 个语言文件的翻译，否则会导致部分用户看到 "Tool not found" 错误。**
