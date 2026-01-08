# Implementation Plan: Currency Rate Update System

## Overview

本实现计划将货币转换器从静态汇率升级为动态汇率系统。实现将分为以下几个阶段：基础设施搭建、API 集成、客户端集成、测试和优化。每个任务都会引用相关的需求条款。

## Tasks

- [x] 1. 创建服务端缓存系统
  - 实现内存缓存类，支持 TTL 和过期检查
  - 支持按基础货币存储和检索汇率
  - 实现缓存清除和验证方法
  - _Requirements: 5.1, 5.2, 5.3_

- [x] 1.1 编写缓存系统的单元测试
  - 测试缓存存储和检索
  - 测试 TTL 过期逻辑
  - 测试缓存清除功能
  - _Requirements: 5.1, 5.2, 5.3_

- [x] 1.2 编写缓存一致性属性测试
  - **Property 1: 缓存一致性**
  - **Validates: Requirements 1.5**

- [x] 2. 创建汇率服务模块
  - 实现 CurrencyService 类
  - 实现汇率验证逻辑（正数检查、范围检查）
  - 实现货币转换计算
  - 实现汇率数据合并功能
  - _Requirements: 6.1, 6.2, 6.3, 6.4_

- [x] 2.1 编写汇率服务的单元测试
  - 测试汇率验证逻辑
  - 测试货币转换计算
  - 测试数据合并功能
  - _Requirements: 6.1, 6.2, 6.3_

- [x] 2.2 编写数据验证属性测试
  - **Property 3: 数据验证**
  - **Validates: Requirements 6.1, 6.2**

- [x] 2.3 编写转换对称性属性测试
  - **Property 7: 转换对称性**
  - **Validates: Requirements 1.1**

- [x] 2.4 编写汇率传递性属性测试
  - **Property 8: 汇率传递性**
  - **Validates: Requirements 1.1**

- [x] 3. 创建 API 路由
  - 创建 `/api/exchange-rates` 路由文件
  - 实现 GET 请求处理器
  - 集成服务端缓存检查
  - 实现 Frankfurter API 调用
  - 实现数据验证和错误处理
  - 实现降级到 fallback 汇率
  - 返回汇率数据和元数据（timestamp, source）
  - _Requirements: 1.1, 1.2, 3.1, 3.2, 4.1, 4.2, 4.4, 5.1_

- [x] 3.1 编写 API 路由的单元测试
  - 测试成功响应
  - 测试缓存命中场景
  - 测试 API 失败降级
  - 测试数据验证
  - _Requirements: 1.1, 3.1, 3.2_

- [x] 3.2 编写降级保证属性测试
  - **Property 2: 降级保证**
  - **Validates: Requirements 3.1, 3.2**

- [ ] 4. Checkpoint - 验证服务端功能
  - 确保所有测试通过
  - 手动测试 API 路由
  - 验证缓存行为
  - 询问用户是否有问题

- [x] 5. 创建客户端 Hook
  - 创建 `useCurrencyRates` Hook
  - 实现从 API 路由获取汇率
  - 实现加载和错误状态管理
  - 实现客户端内存缓存（1小时）
  - 实现手动刷新功能
  - _Requirements: 1.1, 1.3, 1.4, 8.2, 8.3_

- [x] 5.1 编写 Hook 的单元测试
  - 测试数据获取
  - 测试加载状态
  - 测试错误状态
  - 测试缓存行为
  - 测试刷新功能
  - _Requirements: 1.1, 1.3, 1.4_

- [x] 6. 更新货币转换器组件
  - 集成 `useCurrencyRates` Hook
  - 显示加载状态（spinner 或骨架屏）
  - 显示汇率更新时间戳
  - 显示汇率来源（API/缓存/fallback）
  - 添加手动刷新按钮
  - 显示错误/警告消息
  - 使用动态汇率或 fallback 汇率
  - _Requirements: 1.1, 1.3, 2.1, 2.2, 2.3, 2.4, 3.2_

- [x] 6.1 编写组件的集成测试
  - 测试完整的汇率获取流程
  - 测试 UI 更新
  - 测试错误显示
  - 测试加载状态
  - _Requirements: 1.1, 1.3, 2.1_

- [x] 7. 添加多语言翻译
  - 在所有 10 种语言文件中添加新的翻译键
  - 翻译键包括：lastUpdated, updatedAgo, updating, updateFailed, usingStaticRates, refresh, rateSource, sourceApi, sourceCache, sourceFallback
  - 运行 `npx tsx scripts/split-translations.ts` 更新拆分文件
  - _Requirements: 7.1, 7.2, 7.3, 7.4_

- [x] 7.1 验证翻译完整性
  - 运行翻译测试
  - 检查所有语言的翻译键
  - _Requirements: 7.1, 7.2, 7.3_

- [ ] 8. Checkpoint - 验证客户端功能
  - 确保所有测试通过
  - 手动测试组件 UI
  - 验证多语言显示
  - 测试不同网络条件
  - 询问用户是否有问题

- [ ] 9. 性能优化
  - 实现 USD 汇率预加载
  - 优化 API 请求（只请求需要的货币）
  - 添加请求去重（防止重复请求）
  - 实现并行请求支持
  - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_

- [ ] 9.1 编写性能测试
  - 测试缓存响应时间
  - 测试并发请求处理
  - 测试预加载功能
  - _Requirements: 8.1, 8.2, 8.3_

- [ ] 10. 添加监控和日志
  - 记录 API 调用成功/失败
  - 记录缓存命中/未命中
  - 记录数据验证失败
  - 记录降级事件
  - 使用 console.error 记录错误（开发环境）
  - _Requirements: 3.3, 6.4_

- [ ] 10.1 验证日志输出
  - 测试各种错误场景的日志
  - 确保敏感信息不被记录
  - _Requirements: 3.3_

- [x] 11. 更新 fallback 汇率数据
  - 更新 `src/lib/data/currencies.ts` 中的静态汇率
  - 添加注释说明这些是 fallback 汇率
  - 标注最后更新日期
  - _Requirements: 1.2, 3.1_

- [ ] 12. 添加用户文档
  - 在组件中添加汇率来源说明
  - 添加免责声明（汇率仅供参考）
  - 说明更新频率（每日更新）
  - _Requirements: 2.1, 2.3_

- [ ] 13. Final Checkpoint - 完整测试
  - 运行所有单元测试和属性测试
  - 运行集成测试
  - 手动测试完整流程
  - 测试所有 10 种语言
  - 测试各种网络条件（正常、慢速、离线）
  - 验证错误处理和降级
  - 确认性能指标
  - 询问用户是否满意

## Notes

- 所有测试任务都是必需的，确保从一开始就有全面的测试覆盖
- 每个任务都引用了相关的需求条款以确保可追溯性
- Checkpoint 任务用于在关键节点验证功能和收集反馈
- 属性测试使用 fast-check 库，每个测试至少运行 100 次迭代
- 所有翻译必须同时更新 10 种语言（en, zh, ja, ko, es, pt, fr, de, ru, ar）
- Frankfurter API 无需 API key，可直接使用
- 服务端缓存使用内存存储，重启后会清空（这是可接受的）
- Next.js API Routes 会自动部署为无服务器函数，无需单独的后端服务器
