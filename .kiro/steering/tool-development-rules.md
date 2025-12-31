# 工具开发规则 (Tool Development Rules)

## ⚠️ 重要：添加新工具前必须先查阅工具目录

在添加任何新工具之前，**必须**先查阅 `docs/TOOLS_CATALOG.md` 文件：

1. **检查是否已存在相同或类似功能的工具**
2. **确认工具 slug 不会与现有工具冲突**
3. **参考现有工具的分类，选择合适的 category**

```bash
# 快速搜索是否存在类似工具
grep -i "your-keyword" docs/TOOLS_CATALOG.md
```

---

## 添加新工具时的必要步骤

当添加新工具到项目中时，**必须**完成以下所有步骤，否则会导致 "Tool not found" 错误：

### 0. 查阅工具目录 (docs/TOOLS_CATALOG.md) ⭐ 新增
- **必须**先阅读 `docs/TOOLS_CATALOG.md` 确认工具不重复
- 检查是否有功能相似的现有工具
- 确认 slug 命名不冲突

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
  - `ko.json` (韩文)
  - `es.json` (西班牙文)
  - `pt.json` (葡萄牙文)
  - `fr.json` (法文)
  - `de.json` (德文)
  - `ru.json` (俄文)
  - `ar.json` (阿拉伯文)
- 翻译键格式：`tools.{tool-slug}.name`, `tools.{tool-slug}.description`, `tools.{tool-slug}.seo_title`, `tools.{tool-slug}.seo_description`

### 5. 更新工具目录 (docs/TOOLS_CATALOG.md) ⭐ 新增
- **必须**在完成工具添加后更新工具目录文档
- 在对应分类表格中添加新工具
- 更新工具统计数量
- 更新文档日期和更新日志

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
['en', 'zh', 'ja', 'ko', 'es', 'pt', 'fr', 'de', 'ru', 'ar'].forEach(lang => {
  const data = JSON.parse(fs.readFileSync('src/messages/' + lang + '.json', 'utf8'));
  if (data.tools && data.tools[toolSlug]) {
    console.log('✓', lang, '- OK');
  } else {
    console.log('✗', lang, '- MISSING');
  }
});
"

# 检查工具目录是否已更新
grep -q 'your-tool-slug' docs/TOOLS_CATALOG.md && echo '✓ 工具目录已更新' || echo '✗ 工具目录未更新'
```

## 重要提醒

⚠️ **每次添加新工具时，必须同时更新所有 10 个语言文件的翻译，否则会导致部分用户看到 "Tool not found" 错误。**

---

## 📝 添加完工具后必须更新工具目录

完成新工具添加后，**必须**更新 `docs/TOOLS_CATALOG.md` 文件：

### 更新内容

1. **在对应分类表格中添加新工具条目**
   - 按照现有格式添加：`| # | slug | 图标 | 组件名 | 热门 |`
   - 更新该分类的"小计"数量

2. **如果是热门工具，添加到热门工具列表**
   - 在对应分类的热门工具部分添加

3. **更新工具统计表格**
   - 更新对应分类的数量
   - 更新总计数量

4. **更新文档头部信息**
   - 更新"最后更新"日期
   - 更新"工具总数"

### 更新示例

```markdown
## 更新日志

- **YYYY-MM-DD**: 添加 [工具名称] 工具
```

### 自动化检查

添加新工具后，可运行以下命令验证工具目录是否需要更新：

```bash
# 统计 tools.ts 中的工具数量
node -e "
const tools = require('./src/config/tools.ts');
console.log('tools.ts 中工具数量:', tools.tools.length);
"

# 对比目录文档中记录的数量
grep '工具总数' docs/TOOLS_CATALOG.md
```

---

## 完整检查清单

添加新工具时，按顺序完成以下步骤：

- [ ] 1. 查阅 `docs/TOOLS_CATALOG.md` 确认工具不重复
- [ ] 2. 在 `src/config/tools.ts` 添加工具配置
- [ ] 3. 在 `src/components/tools/ToolWrapper.tsx` 添加动态导入
- [ ] 4. 创建 `src/components/tools/[ComponentName].tsx` 组件文件
- [ ] 5. 在所有 10 个语言文件中添加翻译
- [ ] 6. 更新 `docs/TOOLS_CATALOG.md` 工具目录文档
- [ ] 7. 运行检查脚本验证配置正确
