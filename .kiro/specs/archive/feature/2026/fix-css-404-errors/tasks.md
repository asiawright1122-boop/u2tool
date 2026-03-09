# Implementation Plan: Fix CSS 404 Errors

## Overview

本实现计划将修复由错误的 CSS 预加载代码导致的前端页面卡死问题。主要任务是删除 `src/app/[locale]/layout.tsx` 中指向不存在资源的预加载链接，并验证修改后页面功能正常。

## Tasks

- [x] 1. 删除错误的 CSS 预加载代码
  - 打开 `src/app/[locale]/layout.tsx` 文件
  - 定位到第 152 行左右的 `<link rel="preload" as="style" href="/globals.css" />` 代码
  - 删除该行代码
  - 可选：添加注释说明 Next.js 自动处理 CSS 加载
  - _Requirements: 1.1, 1.2, 1.3_

- [x] 1.1 编写单元测试验证预加载链接已移除
  - **Property 1: 错误的 CSS 预加载链接已移除**
  - **Validates: Requirements 1.1, 1.2**
  - 创建或更新测试文件测试 LocaleLayout 组件
  - 验证渲染输出不包含 `/globals.css` 预加载链接
  - 使用字符串匹配或 DOM 查询验证

- [x] 1.2 编写单元测试验证保留了必要资源
  - **Property 2: 保留必要的性能优化资源**
  - **Validates: Requirements 4.1, 4.2, 4.3**
  - 验证 DNS prefetch links 存在（fonts.googleapis.com 等）
  - 验证 preconnect links 存在
  - 验证 Apple startup images 存在

- [x] 2. 本地验证修改
  - 运行 `npm run dev` 启动开发服务器
  - 在浏览器中访问多个页面（首页、工具页、分类页）
  - 打开浏览器开发者工具 Network 面板
  - 确认没有 `/globals.css` 的 404 错误
  - 确认页面样式正常显示
  - _Requirements: 2.1, 2.2, 2.3_

- [x] 3. 构建验证
  - 运行 `npm run build` 构建生产版本
  - 确保构建成功，没有错误或警告
  - 运行 `npm run start` 启动生产服务器
  - 重复步骤 2 的验证流程
  - _Requirements: 2.1, 2.2, 2.3_

- [x] 4. 运行测试套件
  - 运行 `npm run test -- --run` 执行所有测试
  - 确保所有测试通过
  - 如果有测试失败，分析原因并修复
  - _Requirements: 1.1, 1.2, 4.1, 4.2, 4.3_

- [x] 5. Checkpoint - 确认本地验证通过
  - 确保所有测试通过，询问用户是否有问题

- [x] 6. 多语言验证
  - 测试所有 10 种语言的页面（en, zh, ja, ko, es, pt, fr, de, ru, ar）
  - 确认每种语言的页面样式都正常
  - 确认没有 404 错误
  - _Requirements: 2.1, 2.2, 2.3_

- [x] 7. 性能验证
  - 使用 Lighthouse 测试性能指标
  - 确认 LCP < 2.5s
  - 确认 CLS < 0.1
  - 确认 INP < 200ms
  - 对比修改前后的性能数据
  - _Requirements: 3.1, 3.2_

- [x] 8. 代码审查准备
  - 运行 `npm run lint` 检查代码规范
  - 确保没有 console.log 或 debugger 语句
  - 检查 Git 状态，确保只修改了必要的文件
  - 准备清晰的 commit message
  - _Requirements: 1.1, 1.2, 1.3_

- [x] 9. 创建 Pull Request
  - 提交代码到 Git 仓库
  - 创建 Pull Request
  - 在 PR 描述中说明修复的问题和验证结果
  - 等待 Vercel 预览部署完成
  - _Requirements: 1.1, 1.2, 1.3_

- [x] 10. Vercel 预览环境验证
  - 访问 Vercel 预览部署的 URL
  - 重复步骤 2 的验证流程
  - 检查 Vercel 日志，确认没有 `/globals.css` 的 404 错误
  - 使用 Vercel Analytics 检查错误率
  - _Requirements: 2.2, 3.3_

- [x] 11. Final Checkpoint - 准备合并
  - 确保所有验证通过，询问用户是否准备合并到主分支

## Notes

- 所有任务都是必需的，确保修复的完整性和质量
- 核心修改任务是步骤 1，其他任务用于验证和确保质量
- 测试任务（1.1, 1.2, 4）确保代码正确性
- 验证任务（2, 3, 6, 7, 10）确保修复在各种环境下都有效
- 每个任务都引用了具体的需求编号，便于追溯
- Checkpoint 任务确保在关键节点与用户确认

## Expected Outcome

修复完成后，预期结果：
- ✅ Vercel 日志中不再出现 `/globals.css` 的 404 错误
- ✅ 页面样式正常加载和显示
- ✅ 页面加载速度保持稳定或改善
- ✅ 用户不再遇到页面卡死或加载弹窗问题
- ✅ 所有性能优化资源（DNS prefetch、preconnect 等）继续正常工作
