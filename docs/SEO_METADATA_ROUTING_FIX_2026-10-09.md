# SEO 第三阶段：元描述、无效工具路由与参数跳转

日期：2026-10-09。仅完成本地实现和验证，未提交、推送、部署或申请索引；没有修改现有索引名单或 sitemap 日期。

## 已确认的问题与修复

| 问题 | 修复前证据 | 本地修复结果 |
| --- | --- | --- |
| 元描述自动凑字/截断 | 564 个工具 × 10 语言的实际消息合并结果中，3,729 条短描述被添加通用句子，15 条长描述被截断，合计 3,744 条变化 | 渲染器只规范空白，保留原文；5,640 条语料通过一致性测试 |
| 不存在的工具 URL | 英文、中文不存在 slug 及无效语言 `/xx/tools/json-formatter/` 均返回 302 跳向工具目录 | 原地址返回 404 和 noindex 响应头，显示现有错误页；GET/HEAD 均验证 |
| 分类参数作用范围过宽 | `/en/tools/json-formatter/?category=math` 返回 301 到数学分类，任意分类值还能被拼进目标路径 | 仅工具目录 URL 且分类在现有目录中时跳转；工具详情/专题页不受分类参数劫持 |
| 非本地化工具跳转丢参数 | 中间件本地化 `/tools/<slug>/` 时不保留查询串 | 保留查询串；完整 SSR 流程验证通过 |

这些是本地可复现的技术与内容风险，不证明它们解释了全部流量下跌。语料数包含 noindex 页面，不是已收录页面数。

### 元描述策略

原逻辑将短描述补至至少 150 字，再硬截至 180 字。通用补句包含“浏览器内处理”等未逐工具核验的能力承诺；截断则可能丢失后半段的限制说明。

现在保持作者文案完整，缺失时仍使用现有标题兜底，但不再捏造能力。没有批量修改翻译文件，也没有修改标题的现有格式化规则。长度本身并不能证明文案优质：过短、过长、缺少用途或错误能力声明仍需要逐页编辑审核。

`validate:gsc-loss-metadata` 的固定字数拦截改为原文一致性检查；缺失描述、必需意图词、禁止片段和异常重复字符仍然阻断。其他源码文案校验器的编辑长度约束未改。

Google 没有规定元描述的固定长度上限；搜索结果会自行选择、截短摘要，应优先提供准确、具体的页面描述。[Google 官方说明](https://developers.google.com/search/docs/appearance/snippet)

实现决策见 [ADR 0003](./adr/0003-preserve-authored-meta-descriptions.md)。

### 路由与参数策略

- 未知工具和无效语言不再以临时跳转掩盖缺失内容。
- 404 复用现有 SSR catch-all 错误视图。最初尝试重写静态 `/404` 被实际 Cloudflare 构建测试发现不可用，因此最终改为内部 `/404/not-found/` 重写；浏览器地址不变，没有新增公开路由文件。
- 合法目录筛选继续 301 到同语言分类页，并保留其他查询参数。
- 无效分类值留在原工具目录，不再构造包含路径、查询或片段字符的分类跳转。
- 已批准的恢复跳转、尾斜杠规范化和下线 410 保持原策略。完整路由中 `/tools/world-cup-simulator/` 先 301 到英文地址，最终为 410；不能用仅测试中间件时的直接 410 代替真实路径契约。
- 参数页继续使用现有 noindex 策略，canonical 去掉查询串。已验证查询页不会改变干净工具 URL 的索引状态。

**尚未完成的参数策略优化：** 当前 SSR 布局将 UTM 等纯追踪参数与搜索/功能参数一律设为 noindex。Google 推荐用 canonical 合并重复页面，而不是依靠 noindex 来选择规范页。本轮未开放任何参数 URL；后续需单独梳理参数用途、静态/SSR 页面差异及缓存行为，再决定追踪参数的统一处理方式。[Google canonical 文档](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls)

## 验证

遵循 diagnose 的先复现、再修复流程：修改前 15 个元描述/参数行为断言失败；旧构建的实际 SSR 检查也复现了原文差异、302 缺失页和错误分类跳转。

- `npm run qa:seo-recovery`：173 项通过（12 个文件）。包含全量 5,640 条消息合并结果的元描述保留、幂等性，以及前两阶段的索引名单指纹和发现信号检查。
- 翻译、工具页翻译、AI 对比、discovery-surface、TDK drift、tool-page-render-contract：149 项兼容测试通过。TDK drift 的网络用例使用 mock，不是线上抓取。
- `npm run validate:gsc-loss-metadata`：66 个定向检查通过。
- `DISABLE_CLOUDFLARE_INSPECTOR=1 npm run build`：通过。
- 同环境 `npm run check`：0 errors、0 warnings、7 个既有 hints。
- 本地构建 SSR：114 个工具 URL 的 meta/OG/Twitter 描述与原文一致，robots、canonical、语言互链仍符合批准集合；5 个通用页面控制组通过。
- 新增实际路由控制组：8 个缺失路由 GET/HEAD 请求、6 个参数页面、6 个跳转、2 个下线页面全部通过。
- tools sitemap 全部 1,795 条及 priority sitemap 中的 1,645 个工具条目的语言集合通过；主 URL 集合未扩大。
- llms discovery 检查通过；97 个静态 HTML 的 hreflang 对称性检查通过。
- 最终独立检查结果保存在本地生成文件 `artifacts/validation/postbuild-results.json`，三个检查 exitCode 均为 0。该文件不提交。
- `git diff --check` 通过；suppression 生成文件和 sitemap-lastmod 配置没有差异。用户原有内容信任文档编辑未动。

完整 `verify:production` 未运行，不能将上述定向验证称为全站所有功能或所有生产检查通过。没有在本轮重新导出 GSC/Bing 数据，也没有观测上线后的排名或流量变化。

## 接下来的重点

1. 完整发布验收与高流量损失页面的功能/内容抽查，尤其是能力声明、语言质量、标题截断和正文是否满足搜索意图。
2. 单独评估追踪参数规范化策略，不批量开放未知查询组合。
3. 经确认发布后，用相同页面组的抓取日期、索引状态、展示与点击评估效果；Google 与 Bing 分开看。修复上线前，平台数据不会体现这些本地改动。

前两阶段：[第一阶段保护措施](./SEO_RECOVERY_GUARDRAILS.md)、[第二阶段语言发现信号](./SEO_DISCOVERY_FIX_2026-10-09.md)。

后续：[第四阶段发布前验收与重点工具抽查](./SEO_RELEASE_PREFLIGHT_2026-10-09.md)。
