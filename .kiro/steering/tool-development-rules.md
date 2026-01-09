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

### 4. 翻译文件

翻译文件采用模块化结构，分为基础翻译和工具详细翻译：

#### 文件结构
```
src/messages/
├── {locale}.json          # 原始完整翻译文件（保留用于兼容）
├── {locale}/
│   ├── base.json          # 基础翻译（包含工具的 name, description, seo_* 等）
│   └── tools/
│       └── {slug}.json    # 工具详细翻译（detailed_description, usage_steps, usage_examples）
```

#### 添加新工具翻译（推荐使用 AI 自动翻译）

**推荐流程**：只需编写英文翻译，然后使用 AI 自动翻译到其他 9 种语言。

##### 步骤 1：添加英文翻译

在 `src/messages/en.json` 中添加完整的英文翻译：

```json
{
  "tools": {
    "your-tool-slug": {
      "name": "Tool Name",
      "description": "Brief description of the tool",
      "seo_title": "Free Tool Name Online - Feature Keywords",
      "seo_description": "Use our free online tool to... Include benefits and keywords.",
      "detailed_description": "Detailed description about the tool...",
      "usage_steps": [
        "Step 1: Open the tool",
        "Step 2: Enter your data",
        "Step 3: Configure options",
        "Step 4: Click process",
        "Step 5: Copy or download results"
      ],
      "usage_examples": [
        "Example use case 1",
        "Example use case 2"
      ]
    }
  }
}
```

##### 步骤 2：运行 AI 翻译脚本

```bash
# 自动翻译到其他 9 种语言（zh, ja, ko, es, pt, fr, de, ru, ar）
npx tsx scripts/ai-translate-tool.ts your-tool-slug
```

AI 翻译会自动：
- 使用本土化表达（非直译）
- 优化 SEO 标题和描述
- 包含各语言的搜索关键词（如中文的"免费"、"在线"）

##### 步骤 3：更新拆分文件

```bash
npx tsx scripts/split-translations.ts
```

##### 环境配置

AI 翻译需要 SiliconFlow API Key，在 `.env.local` 中配置：

```
SILICONFLOW_API_KEY=sk-your-api-key
```

获取地址：https://cloud.siliconflow.cn/

##### 模型选择

脚本支持两种翻译模型：

| 模型 | 说明 | 使用场景 |
|------|------|----------|
| `Qwen/Qwen2.5-7B-Instruct` | 通用大模型（默认） | 含 SEO 优化，适合工具翻译 |
| `tencent/Hunyuan-MT-7B` | 腾讯混元翻译模型 | 专业翻译，质量更高 |

使用混元翻译模型：
```bash
USE_HUNYUAN=true npx tsx scripts/ai-translate-tool.ts your-tool-slug
```

##### 备选方案：手动翻译

如果不使用 AI 翻译，需要手动在所有 10 种语言文件中添加翻译：
- `en.json`, `zh.json`, `ja.json`, `ko.json`, `es.json`, `pt.json`, `fr.json`, `de.json`, `ru.json`, `ar.json`

#### 翻译内容说明

- **base.json 包含**：name, description, seo_title, seo_description, inputPlaceholder 等（所有页面需要）
- **tools/{slug}.json 包含**：detailed_description, usage_steps, usage_examples（仅工具详情页按需加载）

### 4.1 工具介绍和使用方法 ⭐ 必须添加

**每个新工具必须包含以下三个字段**，用于工具详情页展示：

1. **`detailed_description`** - 工具详细介绍（一段完整的描述文字）
2. **`usage_steps`** - 使用步骤（数组，5-6 个步骤）
3. **`usage_examples`** - 使用示例（数组，2-3 个示例）

#### 翻译键格式

```json
{
  "tools": {
    "your-tool-slug": {
      "name": "工具名称",
      "description": "简短描述",
      "seo_title": "SEO 标题",
      "seo_description": "SEO 描述",
      "detailed_description": "详细的工具介绍，说明工具的功能、用途和特点...",
      "usage_steps": [
        "打开工具页面",
        "输入或粘贴内容",
        "调整选项设置",
        "点击处理按钮",
        "复制或下载结果"
      ],
      "usage_examples": [
        "使用场景示例 1",
        "使用场景示例 2"
      ]
    }
  }
}
```

#### 多语言要求

- **英文 (en.json)**：必须提供准确、专业的英文描述
- **其他语言**：可以使用模板化翻译，但必须确保所有 10 种语言都有对应内容

#### 示例（以 Loan Calculator 为例）

**英文版本**：
```json
{
  "loan-calculator": {
    "detailed_description": "Loan Calculator is a comprehensive financial tool that helps you calculate loan payments, total interest, and view detailed amortization schedules...",
    "usage_steps": [
      "Enter the loan amount (principal)",
      "Input the annual interest rate",
      "Specify the loan term in months",
      "Select your preferred payment frequency",
      "View the calculated payment amount and total interest"
    ],
    "usage_examples": [
      "Calculate monthly mortgage payments for a home purchase",
      "Compare different loan terms to find the best option"
    ]
  }
}
```

**中文版本**：
```json
{
  "loan-calculator": {
    "detailed_description": "贷款计算器是一款实用的在线工具，帮助您快速计算贷款还款额、总利息和查看详细的还款计划...",
    "usage_steps": [
      "打开贷款计算器工具页面",
      "在输入框中输入贷款金额",
      "设置年利率和贷款期限",
      "选择还款频率",
      "查看计算结果"
    ],
    "usage_examples": [
      "使用贷款计算器计算房贷月供",
      "比较不同贷款方案"
    ]
  }
}
```

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
   - **MISSING_MESSAGE 错误**：切换语言时出现 `Could not resolve 'tools.xxx.inputPlaceholder'` 等错误

3. **翻译键不完整导致的语言切换错误** ⚠️ 重要：
   - 如果组件使用了 `t('inputPlaceholder')` 等翻译键，必须在所有 10 种语言的翻译文件中添加对应的键
   - 常见需要添加的翻译键包括：
     - `inputPlaceholder` - 输入框占位符
     - `copy`, `copied` - 复制按钮
     - `clear` - 清空按钮
     - `input`, `output` - 输入/输出标签
     - `convert`, `generate`, `format` - 操作按钮
   - 如果工具有自定义 UI 命名空间（如 `stopwatchUI`），必须在所有语言中添加完整的键

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

# 运行迁移脚本更新拆分文件
npx tsx scripts/split-translations.ts

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
- [ ] 5. 在所有 10 个语言文件 `src/messages/{locale}.json` 中添加翻译
- [ ] 6. **添加 `detailed_description`、`usage_steps`、`usage_examples`** ⭐ 必须
- [ ] 7. **检查组件使用的所有翻译键是否在所有语言中存在**
- [ ] 8. 运行 `npx tsx scripts/split-translations.ts` 更新拆分文件
- [ ] 9. 更新 `docs/TOOLS_CATALOG.md` 工具目录文档
- [ ] 10. 运行 `npm run test` 验证翻译完整性
- [ ] 11. 运行检查脚本验证配置正确

---

## 🔍 翻译键完整性检查 ⚠️ 重要

### 问题背景

2025-01-04 修复了一个严重问题：多个工具缺少 `inputPlaceholder` 等翻译键，导致切换语言时出现 `MISSING_MESSAGE` 错误。

### 必须检查的翻译键

如果组件中使用了以下翻译调用，必须确保所有 10 种语言都有对应的翻译：

```typescript
// 常见的翻译键使用方式
t('inputPlaceholder')      // 输入框占位符
t('copy')                  // 复制按钮
t('copied')                // 已复制提示
t('clear')                 // 清空按钮
t('input')                 // 输入标签
t('output')                // 输出标签
t('convert')               // 转换按钮
t('generate')              // 生成按钮
t('format')                // 格式化按钮
t('download')              // 下载按钮
```

### 自定义 UI 命名空间

如果工具有自定义 UI 命名空间（如 `stopwatchUI`、`countdownTimer`），必须：

1. 在 `tools` 对象下创建对应的命名空间
2. 在所有 10 种语言中添加完整的键
3. 确保键名与组件中使用的完全一致

### 检查脚本

添加新工具后，运行以下命令检查翻译键是否完整：

```bash
# 运行测试检查翻译完整性
npm run test -- --run src/messages/translations.test.ts

# 如果测试输出 "Missing X keys in Y.json"，需要补充缺失的翻译
```

### 修复缺失翻译的步骤

1. 确定缺失的翻译键和语言
2. 在对应的 `src/messages/{locale}.json` 文件中添加翻译
3. 运行 `npx tsx scripts/split-translations.ts` 更新拆分文件
4. 再次运行测试确认修复成功

---

## 📖 工具介绍完整性检查 ⭐ 重要

### 问题背景

2025-01-07 发现新添加的工具缺少 `detailed_description`、`usage_steps` 和 `usage_examples` 字段，导致工具详情页显示不完整。

### 必须包含的字段

每个工具在所有 10 种语言中都必须包含：

| 字段 | 类型 | 说明 |
|------|------|------|
| `detailed_description` | string | 工具详细介绍（100-300 字） |
| `usage_steps` | string[] | 使用步骤（5-6 个步骤） |
| `usage_examples` | string[] | 使用示例（2-3 个示例） |

### 检查脚本

添加新工具后，运行以下命令检查工具介绍是否完整：

```bash
# 检查工具介绍是否完整
node -e "
const fs = require('fs');
const toolSlug = 'your-tool-slug';
const requiredFields = ['detailed_description', 'usage_steps', 'usage_examples'];
['en', 'zh', 'ja', 'ko', 'es', 'pt', 'fr', 'de', 'ru', 'ar'].forEach(lang => {
  const data = JSON.parse(fs.readFileSync('src/messages/' + lang + '.json', 'utf8'));
  const tool = data.tools && data.tools[toolSlug];
  if (!tool) {
    console.log('✗', lang, '- Tool not found');
    return;
  }
  const missing = requiredFields.filter(f => !tool[f]);
  if (missing.length === 0) {
    console.log('✓', lang, '- Complete');
  } else {
    console.log('✗', lang, '- Missing:', missing.join(', '));
  }
});
"
```

### 批量添加工具介绍

如果需要为多个工具批量添加介绍，可以参考 `scripts/add-tool-descriptions.js` 脚本模板（已删除，但可按需重新创建）。
