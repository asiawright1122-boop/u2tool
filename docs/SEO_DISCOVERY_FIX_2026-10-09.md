# SEO 第二阶段：工具页语言发现信号修复

后续进展见 [第三阶段：元描述和路由修复](./SEO_METADATA_ROUTING_FIX_2026-10-09.md)。下文保留第二阶段当时的范围与验证记录。

本轮只修改本地代码和检查，不部署、不推送、不提交索引，不改变现有 index/noindex 名单。

## 结果

| 本地生成结果 | 修复前 | 修复后 |
| --- | ---: | ---: |
| tools sitemap 指向 noindex 工具页的 hreflang/x-default 链接次数 | 1,796 | 0 |
| priority sitemap 同类链接次数 | 796 | 0 |
| tools sitemap 主 URL 数 | 1,795 | 1,795 |
| priority sitemap 全部主 URL 数（含普通页） | 1,915 | 1,915 |

上述是链接出现次数，不是独立页面数；两个地图可能重复引用同一 URL。修复前 tools 地图涉及 1,235 个不同的 noindex 目标，priority 地图涉及 465 个。本轮消除的是索引信号冲突，不代表已确认它解释了全部流量下降，也不保证排名恢复。

## 改动

- `src/lib/tool-indexability.ts` 根据当前工具目录和批准的 suppression 名单，提供可参与搜索发现的语言集合。这里的“可索引”不等于搜索引擎已经收录。
- `src/lib/seo.ts` 为 HTML 和 XML 共用同一套 hreflang/x-default 构造逻辑，去重并保持稳定顺序。
- 工具页的 robots、语言集合与公开工具 sitemap 使用同一份状态；每个可索引版本保留自身和其他可索引版本的互链。
- x-default 优先英文；英文被抑制时，在同一工具的可索引语言中按站点固定顺序选择，不指向 noindex 英文页，也不把英文页强行开放。例如 encoding-detector 的回退页为中文版。
- 被抑制的工具页仍保持原有 robots、自引用 canonical 和可访问性，但不参与 hreflang 集合。没有可索引版本时不输出语言标签。
- 首页、工具目录、分类页的 10 语言集合，以及 AI 对比页的英中双语集合保持不变。没有修改用户的语言切换入口。
- 内部 readiness 全目录仍保留 5,640 条，不按 suppression 过滤，避免让审核输入依赖其自身产出的索引名单。
- 更新旧 rendered SEO 检查：工具页不再要求“一律至少 10 个语言标签”，改为校验准确的批准集合。

Google 的语言版本文档要求参与版本包含自身并双向关联，HTML 和 XML 是等价的声明方式。选择有效 x-default 的具体回退顺序是本项目策略，不是 Google 保证排名的要求。[Google 官方文档](https://developers.google.com/search/docs/specialty/international/localized-versions)

## 验证方法

按 diagnose / TDD 流程先复现：新 XML 回归测试在旧实现中失败；增强后的 SSR 检查对第一阶段构建产物也失败，捕获中文词云、编码检测、关系图、便签，以及 noindex 语言页等错误。修复后重建并验证最终 HTML，不只检查源码文本。

- `npm run qa:seo-recovery`：90 项通过，包括全部工具主 URL 集合、XML 互链、自引用、x-default、未知工具、全抑制工具、非英文回退及第一阶段防回退测试。
- 翻译、工具页翻译、AI 对比和 discovery-surface：39 项兼容测试通过。
- `DISABLE_CLOUDFLARE_INSPECTOR=1 npm run build`：通过。
- 同环境 `npm run check`：0 errors、0 warnings、7 个既有 hints。
- 本地 SSR：114 个工具 URL（候选页及全部可索引语言兄弟页），逐页检查 200、robots、canonical、语言集合和回链；同时核验 tools 地图全部 1,795 条、priority 地图中的 1,645 个工具条目的语言集合。
- 通用页面 SSR 控制组：5 页通过，覆盖首页、工具目录、分类页、AI 模型目录及英中双语 AI 对比页，确认 canonical、索引状态和原有语言集合不变。
- 旧 rendered SEO 检查仅筛选 JSON Formatter 工具页执行，结果通过；未运行该检查的全部历史用例。
- 静态 hreflang 检查：97 个构建 HTML 扫描通过；它不能替代上述 SSR 检查。
- llms discovery 检查通过。
- suppression 生成文件与 sitemap-lastmod 配置均未修改，没有批量刷新日期。

发布前源码 gate 已纳入新增测试；本地 SSR gate 已扩展语言兄弟页和通用页面控制组。完整 `verify:production` 尚未执行，不能把本轮通过称为所有历史生产检查都通过。

## 仍需后续处理

尚未处理全站元描述凑字/截断、未知工具路由状态、带参数 URL 策略、所有工具功能验收，也未重新导出 GSC/Bing 数据。上线需单独确认；上线后再按同一批 URL 的新抓取、索引状态和非品牌展示评估结果，而不是仅看代码测试通过。

第一阶段详见 [SEO_RECOVERY_GUARDRAILS.md](./SEO_RECOVERY_GUARDRAILS.md)。用户原有的内容信任审查文档修改保持不动。
