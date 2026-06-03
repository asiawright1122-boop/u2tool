# 2026美加墨世界杯小组晋级与对决推演器 Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 开发一个高奢曜石暗金 Obsidian 风格的世界杯小组晋级与淘汰赛对决推演器。支持 72 场小组赛录入、H2H 相互比赛小联赛规则、一键交换同分微调、横向提取 8 个最好第三名（带 FIFA 世界排名与微调）、495 种淘汰赛对战官方对照映射以及淘汰赛预测的级联重置（防止幽灵队伍）。

**Architecture:** 前端采用 UI 与状态管理相分离的架构，新建 `world-cup-calc-state.svelte.ts` 状态类，使用 Svelte 5 的 `$state` 和 `$derived` 实现全量比分、同分 override 覆盖、大排名和级联失效的集中式状态管控。UI 拆分为 `GroupStagePanel.svelte` (小组赛及各组榜单)、`ThirdPlaceRankingTable.svelte` (第三名表格) 和 `KnockoutBracketTree.svelte` (淘汰赛对决树) 三个子组件，最终在 `WorldCupGroupCalculator.svelte` 主容器中通过 client:only 形式挂载；构建阶段运行 cheerio 爬虫脚本，抓取维基百科官方 combinations 表格，并生成静态对决映射 JSON 以达成 100% 官方匹配准确度；i18n 本地化统一采用主站 `src/messages/[locale]` 本地化框架，并加入 10 国语言 tools JSON 及 base.json SEO 信息注册，规避 SSR 运行时冲突。

**Tech Stack:** Svelte 5, Astro SSR, Lucide Icons, Vitest (单元测试), Cheerio/Node-Fetch (离线与在线表格解析)

---

## Chunk 1: Scraper & Standings Mapping Data

### Task 1: Scraper for Wikipedia WC 3rd Combinations

**Files:**
- Create: `scripts/scrape-wc-combinations.ts`
- Create: `src/lib/data/world-cup-3rd-combinations.json` (Scraping output)
- Create: `scripts/test-combinations-integrity.ts` (Validation script)
- Create: `scripts/offline-wc-combinations-backup.html` (Local fallback HTML)

- [ ] **Step 1: 创建本地离线维基百科表格备用 HTML 资源**
  在 `scripts/offline-wc-combinations-backup.html` 中存储 Wikipedia “Combinations of matches in the round of 32” 表格对应的原始 HTML 片段，供在线 Fetch 失败/截断时作为无缝降级读取。

- [ ] **Step 2: 编写 Wikipedia 3rd combinations 抓取爬虫脚本**
  通过遍历所有 `table.wikitable`，精确匹配首行包含 `Winner Group C` 或 `3rd DEF/GHI` 等特征的表格进行解析。解析时必须对单元格数量进行合法性校验 `tds.length >= 9`。
  *注意：为了与项目现有数据源 `world-cup-schedule.json` 对齐以渲染正确举办城市/时间，我们将维基百科表格的 8 列 Slot 逻辑同构映射至我们现有的 8 个小组第三占位槽：M75 (Winner C 的对手), M76 (Winner D 的对手), M81 (Winner I 的对手), M82 (Winner J 的对手), M87 主队 (3rd DEF), M87 客队 (3rd GHI), M88 主队 (3rd ABC), M88 客队 (3rd JKL)*。
  *采用 ESM 路径解析，弃用 CommonJS `__dirname`*。

  ```typescript
  // scripts/scrape-wc-combinations.ts 核心解析逻辑
  import fetch from 'node-fetch';
  import * as cheerio from 'cheerio';
  import * as fs from 'fs';
  import * as path from 'path';
  import { fileURLToPath } from 'url';

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  async function run() {
    const url = 'https://en.wikipedia.org/wiki/2026_FIFA_World_Cup_knockout_stage';
    let html = '';
    
    try {
      console.log('Fetching online bracket combinations...');
      const res = await fetch(url, { timeout: 10000 });
      if (res.status === 200) {
        html = await res.text();
      }
    } catch (err) {
      console.warn('Online fetch failed or timed out. Falling back to local offline backup...');
    }

    if (!html || !html.includes('Combinations of matches in the round of 32')) {
      const backupPath = path.join(__dirname, 'offline-wc-combinations-backup.html');
      html = fs.readFileSync(backupPath, 'utf-8');
    }

    const $ = cheerio.load(html);
    const combinations: Record<string, Record<string, string>> = {};
    
    // 定位包含 "Combinations of matches" 标题特征或表头特定对阵槽的表格
    let targetTable: any = null;
    $('table.wikitable').each((_, el) => {
      const text = $(el).text();
      if (text.includes('Winner Group C') && text.includes('3rd DEF/GHI') && text.includes('3rd ABC/JKL')) {
        targetTable = $(el);
        return false; // break loop
      }
    });

    if (!targetTable) {
      console.error('Target combinations table not found!');
      process.exit(1);
    }

    targetTable.find('tr').each((i: number, row: any) => {
      if (i === 0) return; // 跳过表头
      const tds = $(row).find('td');
      if (tds.length < 9) return; // 单元格数量防溢出校验
      
      const key = $(tds[0]).text().replace(/\s+/g, '').toUpperCase(); // 比如 "ABCDEFGH"
      if (key.length !== 8) return;
      
      combinations[key] = {
        M75: '3' + $(tds[1]).text().trim().toUpperCase(),
        M76: '3' + $(tds[2]).text().trim().toUpperCase(),
        M81: '3' + $(tds[3]).text().trim().toUpperCase(),
        M82: '3' + $(tds[4]).text().trim().toUpperCase(),
        M87_H: '3' + $(tds[5]).text().trim().toUpperCase(),
        M87_A: '3' + $(tds[6]).text().trim().toUpperCase(),
        M88_H: '3' + $(tds[7]).text().trim().toUpperCase(),
        M88_A: '3' + $(tds[8]).text().trim().toUpperCase()
      };
    });

    const outPath = path.join(__dirname, '../src/lib/data/world-cup-3rd-combinations.json');
    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    fs.writeFileSync(outPath, JSON.stringify(combinations, null, 2));
    console.log(`Successfully generated combinations JSON. Total entries: ${Object.keys(combinations).length}`);
  }
  run();
  ```

- [ ] **Step 3: 编写验证脚本**
  编写 `scripts/test-combinations-integrity.ts`，验证输出 JSON 的 Key 数等于 495（$_12C_8$），且对对局槽的键值有效性进行强断言，确保没有 undefined 产生。

- [ ] **Step 4: 运行爬虫脚本**
  运行: `npx tsx scripts/scrape-wc-combinations.ts`
  预期: 顺利生成 `src/lib/data/world-cup-3rd-combinations.json`，且打印总记录数为 495。

- [ ] **Step 5: 运行完整性测试**
  运行: `npx tsx scripts/test-combinations-integrity.ts`
  预期: 测试 PASS。

- [ ] **Step 6: Git Commit**
  ```bash
  git add scripts/scrape-wc-combinations.ts scripts/offline-wc-combinations-backup.html scripts/test-combinations-integrity.ts src/lib/data/world-cup-3rd-combinations.json
  git commit -m "feat: implement Wikipedia combinations scraper with fallback HTML and cells validation"
  ```

---

## Chunk 2: Standings & Ranking Engine

### Task 2: Implement Standings Engine with H2H rules & Rankings data

**Files:**
- Create: `src/lib/data/fifa-rankings.json` (48 teams FIFA rankings)
- Create: `src/lib/runtime-integrity/world-cup-calculator-engine.ts`
- Create: `src/lib/runtime-integrity/world-cup-calculator-engine.test.ts`

- [ ] **Step 1: 编写 FIFA 48 强最新世界排名静态 JSON 资源**
  在 `src/lib/data/fifa-rankings.json` 中配置 48 强球队的静态 FIFA World Ranking 数据库。
  数据格式：
  ```json
  {
    "ARG": 1,
    "FRA": 2,
    "BEL": 3,
    "BRA": 4,
    "USA": 11,
    "MEX": 15,
    "CAN": 49
  }
  ```

- [ ] **Step 2: 编写计算引擎测试用例**
  使用 Vitest 测试：小组赛正常排名、H2H 决胜排名（2队同分，3队及以上同分时小联赛递归提取）、大排名世界排名自动决胜以及一键覆盖覆写排序逻辑。

- [ ] **Step 3: 运行测试验证其失败**
  运行: `npx vitest run src/lib/runtime-integrity/world-cup-calculator-engine.test.ts`
  预期: 报错。

- [ ] **Step 4: 编写计算引擎代码**
  在 `src/lib/runtime-integrity/world-cup-calculator-engine.ts` 中实现：
  * **小组赛积分榜排序核心算法**：
    1. 根据赛程计算所有球队的 Points, Total GD, Total GS。
    2. **安全防御快速通道**：如果没有任何比赛输入或所有比赛均未录入/全为平局且完全同分，直接退化为按照 FIFA World Ranking 结合 `customTiesOverride` 进行初始排序，退出递归以防同分小联赛产生死循环。
    3. 如果有局部同分球队且产生了相互战绩，在同分区间建立相互战绩的“小联赛（Mini-league）”：
       - `type Match = { home: string; away: string; homeScore: number | null; awayScore: number | null }`
       - 过滤出仅这几个同分球队之间的相互比赛，重新计算小联赛内的 Points_H2H, GD_H2H, GS_H2H。
       - 按小联赛指标再次排序。若有局部解套（部分解开，部分仍并列），对仍并列的球队重复此步骤。
    4. 若小联赛指标仍相同，比较总净胜球 (GD)、总进球数 (GS)。
    5. 若仍相同，降级为应用 `customTiesOverride` 手动干预。
  * **第三名大排名排序算法**：
    比较 Points ➔ GD ➔ GS ➔ FIFA World Ranking ➔ `customTiesOverride`。

- [ ] **Step 5: 再次运行测试，验证其通过**
  运行: `npx vitest run src/lib/runtime-integrity/world-cup-calculator-engine.test.ts`
  预期: 测试用例 PASS。

- [ ] **Step 6: Git Commit**
  ```bash
  git add src/lib/data/fifa-rankings.json src/lib/runtime-integrity/world-cup-calculator-engine.ts src/lib/runtime-integrity/world-cup-calculator-engine.test.ts
  git commit -m "feat: complete standing engine with Mini-League H2H algorithm and static FIFA World Rankings data"
  ```

---

## Chunk 3: Frontend Calculator Architecture & Components

### Task 3: State Class & UI Split Components

**Files:**
- Create: `src/lib/runtime-integrity/world-cup-calc-state.svelte.ts` (Svelte 5 State Class)
- Create: `src/components/tools/world-cup-group-calc/GroupStagePanel.svelte` (Child UI)
- Create: `src/components/tools/world-cup-group-calc/ThirdPlaceRankingTable.svelte` (Child UI)
- Create: `src/components/tools/world-cup-group-calc/KnockoutBracketTree.svelte` (Child UI)
- Create: `src/components/tools/WorldCupGroupCalculator.svelte` (Container)

- [ ] **Step 1: 编写核心状态控制器类 (State Class)**
  在 `world-cup-calc-state.svelte.ts` 中封装所有 `$state` 数据和 `$derived` 属性。把输入比分、小榜排序、大榜排序、H2H 算路、级联失效逻辑完全从 Svelte 架构中解耦出来。
  级联置空规则：当淘汰赛节点（R32 到 Final）的 `homeTeam` 或 `awayTeam` 改变，且已预测的胜者不等于这二者之一时，级联将下游所有对决的 `predictedWinner` 置为 `null`。

- [ ] **Step 2: 编写小组赛面板子组件**
  在 `world-cup-group-calc/GroupStagePanel.svelte` 中渲染 12 个小组的垂直比分输入格子和各组积分榜，只负责渲染及交互，修改数据时调用 `state.updateScore()`。高亮出线名次，对完全同分的行显示 ⇅ 按钮以修改 state 的 override。

- [ ] **Step 3: 编写大排名及对阵树子组件**
  * `world-cup-group-calc/ThirdPlaceRankingTable.svelte`：渲染 12 个第三名排序及出线线（金色前8）。
  * `world-cup-group-calc/KnockoutBracketTree.svelte`：渲染 32 强至决赛对战树，胜者节点可点击以模拟晋级并重置失效下游。

- [ ] **Step 4: 编写主容器组件**
  在 `WorldCupGroupCalculator.svelte` 中将上述三个子组件组装在一起。在 `onMount` 中从 LocalStorage 恢复 state 数据，提供一键预设与随机按钮。

- [ ] **Step 5: Git Commit**
  ```bash
  git add src/lib/runtime-integrity/world-cup-calc-state.svelte.ts src/components/tools/world-cup-group-calc/
  git commit -m "feat: split group calculator into State class and atomic UI components for better maintainability"
  ```

---

## Chunk 4: Localization & Registration

### Task 4: Multi-Language SEO & Router Integration

**Files:**
- Create: `src/messages/[locale]/tools/world-cup-group-calculator.json` (for all 10 locales: `ar`, `de`, `en`, `es`, `fr`, `ja`, `ko`, `pt`, `ru`, `zh`)
- Modify: `src/messages/[locale]/base.json` (for all 10 locales)
- Modify: `src/config/tools/fun.ts`
- Run: `npx tsx scripts/generate-tool-import-map.ts`

- [ ] **Step 1: 写入 10 国语言的工具多语言 JSON 资源**
  在 `src/messages/` 每一个语言的 `tools/` 目录下创建 `world-cup-group-calculator.json`。配置正确的 `detailed_description`, `usage_steps`, `usage_examples`, `faqs`。并在其中集中加入 48 强的国家名字本地化对照表 `"teams"`。

- [ ] **Step 2: 注册 10 国语言 base.json 中的 SEO Metadata**
  在每个语言子目录的 `base.json` 的 `tools` 属性下注册 `"world-cup-group-calculator"` 对象，并填写该语言版本的 `name`、`description`、`seo_title` 与 `seo_description`。

- [ ] **Step 3: 在前端路由中注册工具配置**
  在 `src/config/tools/fun.ts` 中注册 `world-cup-group-calculator`，设置 slug、category 为 fun、icon 为 calculator、component 为 `WorldCupGroupCalculator`。

- [ ] **Step 4: 运行工具导入生成脚本**
  运行: `npx tsx scripts/generate-tool-import-map.ts`
  预期: 顺利更新 `src/components/tools/ToolImportMap.ts`。

- [ ] **Step 5: E2E 集成与 Hydration 检验**
  在 Astro 页面中使用 `client:only="svelte"` 挂载该组件。运行本地服务进行 10 国语言无缝切换、LocalStorage 读写及无 Hydration 报错校验，同时确认没有 console.error 的异常产生。

- [ ] **Step 6: Git Commit**
  ```bash
  git add src/messages/ src/config/tools/fun.ts
  git commit -m "feat: complete 10 locales integration and register SEO metadata"
  ```
