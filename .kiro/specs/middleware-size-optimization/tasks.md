# 实现计划：Middleware 大小优化

## 概述

将 middleware 从 2.85 MB 优化到 ~50 KB，通过移除 `next-intl` 插件包装并创建轻量级自定义 middleware。

## 任务

- [x] 1. 更新 Next.js 配置
  - [x] 1.1 修改 `next.config.js` 移除 `next-intl` 插件包装
    - 移除 `createNextIntlPlugin` 导入和调用
    - 保留其他配置不变
    - _Requirements: 1.1, 1.2_

- [x] 2. 重写 Middleware
  - [x] 2.1 重写 `src/middleware.ts` 为轻量级版本
    - 硬编码 locales 列表和 countryToLocale 映射
    - 实现 `detectLocale` 函数（cookie、IP、Accept-Language）
    - 实现 `shouldSkip` 函数跳过静态文件
    - 不导入任何翻译相关模块
    - _Requirements: 1.1, 1.2, 1.4, 3.1, 3.2_

- [x] 3. 更新 i18n 配置
  - [x] 3.1 修改 `src/i18n/request.ts` 返回空 messages
    - 移除翻译加载逻辑
    - 返回空对象作为 messages
    - _Requirements: 2.2_

- [x] 4. 更新布局层翻译加载
  - [x] 4.1 修改 `src/app/[locale]/layout.tsx` 加载基础翻译
    - 导入 `loadBaseMessages` 函数
    - 在布局层加载翻译并传递给 `NextIntlClientProvider`
    - _Requirements: 2.1, 2.3, 2.4_

- [x] 5. Checkpoint - 验证构建
  - 运行 `npm run build` 确保构建成功
  - 检查 Edge Function 大小是否减小
  - 确保所有测试通过

- [x] 6. 创建构建大小检查脚本
  - [x] 6.1 创建 `scripts/check-edge-size.ts` 脚本
    - 检查 `.next/server/edge/chunks/` 目录
    - 验证不包含翻译文件
    - 计算总大小并与限制比较
    - _Requirements: 4.2, 4.3_

- [x] 7. 编写属性测试
  - [x] 7.1 编写 middleware 不包含翻译的属性测试
    - **Property 1: Middleware 不包含翻译导入**
    - **Validates: Requirements 1.1, 1.2, 2.2**

  - [x] 7.2 编写 Edge Function 大小检查测试
    - **Property 2: Edge Function 大小限制**
    - **Validates: Requirements 1.3, 4.2**

- [x] 8. Final checkpoint - 完整验证
  - 确保所有测试通过
  - 验证构建成功
  - 验证 Edge Function 大小 < 1.5 MB
  - 验证开发服务器正常运行
  - 验证 locale 检测和重定向功能正常

## 注意事项

- 所有任务都是必须执行的
- 修改 middleware 后需要重新构建才能看到大小变化
- 保留现有的翻译文件结构，只改变加载方式
- 确保搜索引擎爬虫的特殊处理逻辑保留

## 优化结果

Edge Function 大小变化：
- 优化前: 2.85 MB (超过 2 MB 限制)
- 优化后: 771 KB (使用率 37.7%)

关键改动：
1. `next.config.js` - 保留 next-intl 插件（需要配置文件路径）
2. `src/middleware.ts` - 轻量级版本，不导入任何翻译模块
3. `src/i18n/request.ts` - 返回空 messages，翻译在布局层加载
4. `src/app/[locale]/layout.tsx` - 使用 loadBaseMessages 加载翻译

验证工具：
- `scripts/check-edge-size.ts` - 检查 Edge Function 大小
- `src/lib/edge-size.test.ts` - 属性测试
