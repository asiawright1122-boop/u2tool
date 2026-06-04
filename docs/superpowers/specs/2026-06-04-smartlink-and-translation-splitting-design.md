# Design Spec - Performance Optimization & High-Performance Architecture (PERF-01, PERF-02 & GSC Compliance) 🚀 ⚡

---

## 1. 背景与目标 (Background & Goals)

### 1.1 背景
U2Tool 作为一个拥有 500+ 工具页面的大型多语言 Astro 6 + Svelte 5 项目，目前部署于 Cloudflare Workers 平台。随着页面规模的扩大和 10 国语言的深入本地化，全站整体的性能和响应速度面临新的挑战：
1. **多语言全量包极重与回环子请求限制**：主页与工具页目前加载了包含所有工具长篇说明的全量包。由于在 Workers 运行时无法读取磁盘文件，被迫使用 `fetch` 环回子请求（Sub-requests）拉取工具特定的翻译，增加了 TTFB 延迟且易触及 Workers CPU 计费和子请求次数上限。
2. **时区计算水合不一致 (Hydration Mismatch)**：时区敏感页面在 UTC 服务器端（Cloudflare）渲染，在客户端 Hydrate 时读取浏览器本地时区并重绘，产生累积布局偏移（CLS）及 Svelte 水合不一致警告。
3. **iCalendar 协议不合规**：部分工具产生 ICS 格式文件时，未严格处理 RFC 5545 规定的单行 75 字节折行（Line Folding）、`\r\n` (CRLF) 换行符以及特殊字符转义规范，在部分严格的日历客户端（如 Outlook、iOS 日历）中会被拒收或解析失败。

### 1.2 目标
在 `v0.0.12` 里程碑中，通过一整套针对 Astro + Svelte 5 + Cloudflare Workers 特性的高性能重构与 SEO 调优，达成极致体验：
1. **全局预取事件委托 (Prefetch Event Delegation)**：实现零 Svelte 实例开销的全局事件委托脚本，自动拦截 Hover 250ms 及 Touch 交互，在网络顺畅且非省流量模式下预加载目标页面。
2. **零网络开销动态翻译模块化加载**：利用 Vite `import.meta.glob` 将全部工具子翻译 (`tools/[slug].json`) 编入构建静态依赖图，让 Cloudflare Workers 在运行时直接通过 ES 动态 `import` 从内存加载，实现 0 次磁盘 IO，0 次回环 HTTP 网络请求。
3. **消除水合闪烁与协议不合规**：引入延迟水合策略，避免 SSR 时间与客户端本地时间差异导致的警告；将 ICS 折行与时区转义抽取为通用服务，统一生成标准合规 of 日历流。

---

## 2. 系统设计 (System Design)

### 2.1 整体架构与流程

```mermaid
graph TD
    User([用户浏览器]) -->|1. 访问 /en/tools/| Astro[Astro Server]
    Astro -->|内存加载 base.json| BaseUiMessages[loadBaseUiMessages via glob import]
    BaseUiMessages -->|零 HTTP 环回子请求| RenderedHTML[返回轻量 HTML]
    
    RenderedHTML -->|2. 加载全局事件代理| PrefetchManager[prefetch-delegation.ts]
    User -->|3. 鼠标 Hover 带有 data-prefetch 的链接 250ms| HoverCheck{Hover 时间过关?}
    HoverCheck -->|Yes| NetCheck{网络畅通且未开 saveData?}
    
    NetCheck -->|Yes| Prefetch[动态向 head 插入 link rel=prefetch]
    Prefetch -->|浏览器空闲下载| DiskCache[(浏览器 HTTP 缓存)]
    
    User -->|4. 点击跳转详情页 /en/tools/json-formatter| DetailPage[Astro [slug].astro]
    DetailPage -->|直接命中缓存/结合 ViewTransitions 实现秒开| DiskCache
```

---

## 3. 详细设计与实现 (Detailed Design)

### 3.1 全局预取事件委托 (`src/lib/prefetch-delegation.ts`)
为防产生 500+ 个 Svelte 组件实例造成的性能与内存开销，我们在 Layout层只挂载一个单例的全局事件代理：
* **运作原理**：
  * 在 `document.body` 挂载 `mouseover`、`mouseout` 和 `touchstart` 全局监听。
  * 寻找最近的 `<a>` 标签。若其具有 `data-prefetch` 标记，则启动 **250ms** 计时延迟。
  * 若发生 `mouseout` 且离开了当前的链接节点，则执行 `clearTimeout` 清除该任务，有效拦截鼠标快速划过的误触。
* **网络质量限制 (Network-Aware)**：
  * 安全读取 `navigator.connection` 状态，对不支持该 API 的浏览器（如 iOS/macOS Safari）进行兼容防御：
    ```typescript
    const conn = (navigator as any).connection;
    if (conn) {
      if (conn.saveData === true) return; // 开启了省流量
      if (['2g', '3g'].includes(conn.effectiveType)) return; // 慢速网络
    }
    ```
* **预取实现方式**：
  * 仅在客户端（`onMount`）运行此逻辑，以防 SSR 报错。
  * 动态在 `<head>` 中插入 `<link rel="prefetch" href="...">`。
  * 与 Astro 的 `ViewTransitions` 整合，利用浏览器 HTTP 缓存实现页面的 SPA 级秒开跳转。
  * 使用全局 Set (`prefetchedUrls`) 保证每个链接在生命周期内仅预加载一次。

### 3.2 动态翻译模块化加载 (Vite Glob Imports)
为规避在 Cloudflare Workers 中运行时通过 `fetch` 请求本地资源的 Loopback 回环网络请求开销，重构 `src/lib/translations.ts`：
1. **预加载定义**：
   ```typescript
   const bundledToolMessageModules: Record<string, () => Promise<MessagesRecord>> =
     typeof import.meta.glob === 'function'
       ? import.meta.glob<MessagesRecord>('../messages/*/tools/*.json', {
           import: 'default',
         })
       : {};
   ```
2. **零 IO 加载逻辑**：
   在 `loadDetailedToolMessages` 中，优先通过匹配 `bundledToolMessageModules` 的 key，使用 ES Dynamic Import 直接从内存中载入对应的工具 JSON，彻底消除 Cloudflare Workers 下的回环 HTTP 请求。
3. **打包策略与体积管控**：
   在 `astro.config.mjs` 中配合 Vite 的 Rollup 配置，使这批工具子 JSON 在打包时作为独立的 chunks 进行输出，避免合并入 Worker 主包引发冷启动延迟；同时采用 Vite 的 `json.stringify` 优化降低解析内存消耗。
4. **包体积限制降级策略**：
   当翻译包的总模块体积逼近 Cloudflare 免费版（1MB）或付费版（10MB）上限时，将在架构上无缝迁移至 **Cloudflare Workers KV / R2**。在 Astro 服务端路由中使用 `Astro.locals.runtime.env.TRANSLATION_KV` 获取绑定的 KV/R2，不产生任何回环网络请求开销。

### 3.3 延迟水合 (Deferred Hydration) 与时区安全性
* **时间计算时区规范**：
  * 为避免夏令时（DST）带来的时差错乱并免除复杂的 `VTIMEZONE` 脚本维护，**统一在 iCalendar/ICS 发生器中强制使用 UTC 时间格式（以大写字母 `Z` 结尾）**，交由日历客户端自行进行本地时差换算，如：
    `DTSTART:20260611T203000Z`
  * 时区换算细节：在 Astro/Workers 服务端，读取赛事的当地时间并结合该球馆的 IANA 时区（如 `America/New_York`），利用原生的 `Intl.DateTimeFormat` 进行两步迭代差值换算，求出精确的绝对 UTC 零时区时间戳，并格式化为 `YYYYMMDDTHHMMSSZ` 输出。具体实现参见 4.2 节算法。
* **客户端水合控制**：
  * 所有与本地时间换算有关的 Svelte 交互元素，使用客户端延迟水合逻辑防范 CLS 和水合冲突：
    ```typescript
    let mounted = $state(false);
    onMount(() => mounted = true);
    ```
  * 在组件模板中使用 `{#if mounted}` 条件渲染时区敏感及本地折算内容，在此之前渲染一致的静态占位骨架（设定固定宽度、高度或最小高度等样式），确保水合前后 DOM 排版稳定，避免 CLS 抖动。

### 3.4 统一合规的 ICS 发生器服务 (`src/lib/ics-helper.ts`)
* **换行符规范化与行折叠 (Line Folding)**：
  * 在进行折行和拼接前，必须先对属性数据进行预处理：优先进行转义，再进行行折叠拼接。
  * 根据 RFC 5545 3.1 节，`foldLine` 必须应用于**拼接好键名、参数和冒号的完整行内容**。单行物理行宽必须限制在 **75 字节（Octet-based）** 以内。为了兼容新行前必须插入一个空格（1 字节）的折叠行规范，**首行切分上限为 75 字节，而后续的所有折叠行内容切分上限必须动态调整为 74 字节**，每行换行必须统一使用 `\r\n` (CRLF)。
* **字符转义**：
  * 转义规则**仅适用于 `TEXT` 类型**的属性值（如 `SUMMARY`、`DESCRIPTION`、`LOCATION`）。对于 `URL`、`UID`、`DTSTART` 以及属性参数，**绝不能**转义逗号和分号。
  * 转义时，必须**严格遵守转义顺序**，以防止由于先规范化换行再转义反斜杠导致的 `\\n` 文本字符未换行问题：
    1. 优先对反斜杠本身进行转义：`\` -> `\\`
    2. 对逗号、分号进行转义：`,` -> `\,`，`;` -> `\;`
    3. 最后将真实的换行符转义为字面量 `\n` 文本字符：`\r?\n` -> `\n`
* **动态占位符与国家名映射**：
  * API 端接收 `?locale=[locale]` 参数，以加载特定语系的词汇。
  * 淘汰赛国家队名称的多语言翻译字典统一保存在各语系的 `world-cup-group-calculator.json` 的 `teams` 字典中，同时新增 `placeholders` 字典（例如 `"1A": "A组第一"`）作为淘汰赛出线前的翻译源。当无法检索到具体出线队伍代码时，优先解析该 placeholders 字典。

---

## 4. 算法设计 (Algorithm Implementation)

### 4.1 安全字节折行算法 (iCalendar Safe Line Folding)
在 `src/lib/ics-helper.ts` 中实现的多字节字符安全折行算法。定义 `TextEncoder` 和 `TextDecoder` 为静态全局单例，避免频繁 GC 实例化开销：

```typescript
const encoder = new TextEncoder();
const decoder = new TextDecoder();

export function foldLine(input: string): string {
  const bytes = encoder.encode(input);
  let result = '';
  let start = 0;
  
  while (start < bytes.length) {
    // 首行限制为 75 字节，折叠行开头需加 1 字节空格，内容上限动态减小至 74 字节
    const limit = start === 0 ? 75 : 74;
    
    // 剩余字节不足 limit 字节，直接输出并以 CRLF 结束
    if (bytes.length - start <= limit) {
      result += decoder.decode(bytes.subarray(start)) + '\r\n';
      break;
    }
    
    // 尝试在 limit 字节处截断
    let end = start + limit;
    
    // 确保不会切断多字节 UTF-8 字符的字节序列 (即 byte & 0xC0 === 0x80)
    while (end > start && (bytes[end] & 0xC0) === 0x80) {
      end--;
    }
    
    // 极端情况：如果单个字符就超限，强行在边界截断
    if (end === start) {
      end = start + limit;
    }
    
    // 写入当前切分块，并插入 CRLF + 空格 (Space)
    result += decoder.decode(bytes.subarray(start, end)) + '\r\n ';
    start = end;
  }
  
  return result;
}
```

### 4.2 本地时间安全转换为 UTC 算法 (Intl-based DST Safe localToUtc)
在 Cloudflare Workers/Node.js 环境下运行，引入两步迭代修正，无需任何第三方依赖，确保 DST 时区跃迁边缘的转换精度，且使用 `hourCycle: 'h23'` 规避午夜 24 点异常：

```typescript
export function localToUtc(localDateStr: string, timeZone: string): Date {
  const parts = localDateStr.split(/[-T:]/);
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const day = parseInt(parts[2], 10);
  const hour = parseInt(parts[3], 10);
  const minute = parseInt(parts[4], 10);
  const second = parts[5] ? parseInt(parts[5], 10) : 0;

  const utcDate = new Date(Date.UTC(year, month, day, hour, minute, second));
  
  const getLocalFields = (date: Date): number => {
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone,
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', second: '2-digit',
      hour12: false,
      hourCycle: 'h23' // 避免午夜格式化为 24:00 导致的时间溢出
    });
    
    const p = formatter.formatToParts(date);
    const map: Record<string, number> = {};
    p.forEach(part => {
      if (part.type !== 'literal') map[part.type] = parseInt(part.value, 10);
    });
    
    return Date.UTC(
      map.year, 
      map.month - 1, 
      map.day, 
      map.hour, 
      map.minute, 
      map.second
    );
  };

  // 第一步：近似计算候选时间
  const formattedLocalTime1 = getLocalFields(utcDate);
  const diff1 = utcDate.getTime() - formattedLocalTime1;
  const candidate1 = new Date(utcDate.getTime() + diff1);

  // 第二步：利用候选时间真实的时差偏移量进行迭代修正
  const formattedLocalTime2 = getLocalFields(candidate1);
  if (formattedLocalTime2 === utcDate.getTime()) {
    return candidate1;
  }
  
  const offset2 = candidate1.getTime() - formattedLocalTime2;
  return new Date(utcDate.getTime() + offset2);
}
```

---

## 5. 验证与测试计划 (Verification Plan)

### 5.1 自动化测试 (Automated Tests)
在 `src/lib/translations-optimized.test.ts` 中编写测试：
* **模块化映射覆盖测试**：断言 `bundledToolMessageModules` 能够正确检索出所有支持语系的工具 json 文件数量。
* **ICS 发生器一致性测试**：验证 `foldLine` 在首行以外每行首部是否正确添加了空格，且折叠行的总物理宽度（包括行首空格）在任何多字节字符截断下均不超过 75 字节，行尾以 `\r\n` 结尾。
* **时区转换临界精度测试**：对夏令时跳跃边界（如纽约春季时间跃迁）的时间点进行换算，断言 `localToUtc` 两步转换得到的毫秒数无偏差。
* **转义顺序与精度测试**：验证多行文本转义后 `\` 和 `\n` 没有发生二次折行转义，且换行解析依然合规。

### 5.2 手动验证与性能基准 (Manual Verification)
1. **网络调试观察**：Hover 具有 `data-prefetch` 属性的链接，在 Chrome 控制台 Network 中确认对应的页面 HTML 请求在 250ms 延迟后正确发出，且 Priority 为 `Lowest`。
2. **GSC 与 HTTP 缓存头校验**：本地测试及构建时使用 `npm run verify:production`，保证所有爬虫及 SEO 合规检查依然 100% 通过。
