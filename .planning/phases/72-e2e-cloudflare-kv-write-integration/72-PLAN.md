---
requirements:
  - GEO-06
files_modified:
  - src/lib/gsc-recovery-redirects.ts
  - scripts/gsc-recovery/publish-mappings.ts
  - package.json
---

# Phase 72: E2E Cloudflare KV Write Integration - Plan

## Goal
实现自动化将本地生成的 `gsc-redirects.json` 重定向规则表同步写入到 Cloudflare KV Namespace 中的部署管线，并重构本地边缘层读取整表重定向的匹配逻辑。

## Tasks

### Wave 1

<task id="72.1">
<read_first>
- src/lib/gsc-recovery-redirects.ts
</read_first>
<action>
重构 `src/lib/gsc-recovery-redirects.ts` 中的 `resolveGscRecoveryRedirect` 逻辑，以对齐“单 Key 存整表”设计：
1. 原本通过 `await kv.get(lookupKey)` 逐条 Key 读取的逻辑，修改为从统一的主键 `gsc-recovery-rules` 中读取整张 JSON 表：
   ```typescript
   const rulesStr = await kv.get('gsc-recovery-rules');
   ```
2. 对读取到的字符串使用 `JSON.parse` 进行解析，并在解析后的规则对象中以 `lookupKey` 作为 Key 匹配出目标 URL。
3. 增加健壮的异常保护：在解析 JSON 字符串时包裹 `try/catch` 逻辑。如果 KV 发生异常或拿回的字符串为空、损坏，直接降级走后面的本地静态 JSON 匹配（即 `STATIC_REDIRECTS`）。
4. 确保在本地 `MEMORY_CACHE` 中缓存整个规则表，或者缓存 `lookupKey` 的具体匹配解析结果，继续保证 60 秒的本地 TTL，防止频繁读取。
</action>
<acceptance_criteria>
- `src/lib/gsc-recovery-redirects.ts` 不再包含 `await kv.get(lookupKey)`。
- `src/lib/gsc-recovery-redirects.ts` 内含有对主键 `'gsc-recovery-rules'` 的获取逻辑，且包含 JSON 解析和相应的 try/catch 保护。
- 单元测试运行通过。
</acceptance_criteria>
</task>

### Wave 2

<task id="72.2">
<read_first>
- package.json
</read_first>
<action>
开发并编写本地 KV 同步发布脚本 `scripts/gsc-recovery/publish-mappings.ts`：
1. 脚本需要读取本地的 `src/config/gsc-redirects.json` 规则映射表。
2. 校验文件合规性：如果文件内容为空、格式不为 JSON 对象，或者规则条目数小于等于 0，则脚本应报错、拦截并抛出非零 exit code，拒绝发布。
3. 读取环境变量 `CLOUDFLARE_API_TOKEN`、`CLOUDFLARE_ACCOUNT_ID` 以及 `CLOUDFLARE_KV_NAMESPACE_ID`。
4. 如果鉴权环境变量缺失，打印出明确的错误指示并以 Exit Code 1 退出。
5. 环境变量齐全时，使用 `fetch` 接口向 Cloudflare REST API 发起请求：
   - 写入接口：`PUT /accounts/{account_id}/storage/kv/namespaces/{namespace_id}/values/gsc-recovery-rules`
   - 将整表 JSON 压缩后的字符串作为 Body 进行提交上传，并在 Header 中带上 `Authorization: Bearer {CLOUDFLARE_API_TOKEN}`。
6. 发布成功后在控制台打印友好输出，指示重定向条目数已全部发布。
</action>
<acceptance_criteria>
- 创建了新文件 `scripts/gsc-recovery/publish-mappings.ts`。
- 该文件内具备对环境变量的检查逻辑，格式错误时阻断发布的机制，以及通过 REST API 向 `gsc-recovery-rules` 执行写入的 `fetch` 调用。
</acceptance_criteria>
</task>

<task id="72.3">
<read_first>
- package.json
</read_first>
<action>
在 `package.json` 的 `scripts` 部分注册重定向同步发布命令：
- 增加命令：`"gsc-recovery:publish": "tsx scripts/gsc-recovery/publish-mappings.ts"`
</action>
<acceptance_criteria>
- `package.json` 中的 `scripts` 包含 `"gsc-recovery:publish": "tsx scripts/gsc-recovery/publish-mappings.ts"`。
</acceptance_criteria>
</task>

## Verification

### Automated Tests
- 执行本地编译与单元测试确保中间件读取代码无语法错误：
  ```bash
  npm run build
  npm run test
  ```

### Manual Verification
- 检查 `scripts/gsc-recovery/publish-mappings.ts` 结构，确保没有硬编码 API 凭证，且能够妥善捕获 API 错误返回。
