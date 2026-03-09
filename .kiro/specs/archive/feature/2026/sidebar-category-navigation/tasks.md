# Implementation Plan: Sidebar Category Navigation

## Overview

本实现计划将左侧分类导航布局功能分解为可执行的编码任务。采用增量开发方式，先构建核心组件，再集成到页面布局中。

## Tasks

- [x] 1. 创建布局工具函数和类型定义
  - [x] 1.1 创建响应式布局模式计算函数
    - 在 `src/lib/layout.ts` 中创建 `getLayoutMode` 函数
    - 定义 `LayoutMode` 类型: 'desktop' | 'tablet' | 'mobile'
    - 实现断点判断逻辑: desktop(≥1024px), tablet(768-1023px), mobile(<768px)
    - _Requirements: 4.1, 4.2, 4.3_
  - [x] 1.2 编写响应式布局属性测试
    - **Property 3: 响应式布局断点正确性**
    - **Validates: Requirements 4.1, 4.2, 4.3**

- [x] 2. 创建 SidebarNavigation 组件
  - [x] 2.1 实现基础侧边栏导航组件
    - 创建 `src/components/layout/SidebarNavigation.tsx`
    - 显示所有 11 个分类，包含图标和翻译名称
    - 支持 `activeCategory` prop 高亮当前分类
    - 支持 `collapsed` prop 控制展开/折叠状态
    - 使用 `position: fixed` 固定定位
    - _Requirements: 1.1, 1.2, 1.4, 1.6, 8.1, 8.2_
  - [x] 2.2 编写分类导航完整性属性测试
    - **Property 1: 分类导航完整性与数据正确性**
    - **Validates: Requirements 1.1, 1.6**
  - [x] 2.3 编写活动状态指示属性测试
    - **Property 4: 活动状态指示准确性**
    - **Validates: Requirements 8.1**

- [x] 3. 创建 ToolCard 增强组件
  - [x] 3.1 实现增强版工具卡片组件
    - 创建 `src/components/ToolCard.tsx`
    - 支持 `variant` prop: 'grid' | 'list' | 'compact'
    - 显示工具图标、名称、描述
    - 显示热门标签（当 `tool.popular` 为 true）
    - 添加悬停动画效果
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_
  - [x] 3.2 编写工具卡片数据完整性属性测试
    - **Property 5: 工具卡片数据完整性**
    - **Validates: Requirements 3.1**
  - [x] 3.3 编写工具卡片导航链接属性测试
    - **Property 6: 工具卡片导航链接正确性**
    - **Validates: Requirements 3.3**
  - [x] 3.4 编写热门工具标签属性测试
    - **Property 7: 热门工具标签显示**
    - **Validates: Requirements 3.5**

- [x] 4. 创建 StatsPanel 组件
  - [x] 4.1 实现统计面板组件
    - 创建 `src/components/StatsPanel.tsx`
    - 显示工具总数（从 tools 配置获取）
    - 显示访问统计占位符
    - 使用图标和格式化数字
    - _Requirements: 5.1, 5.2, 5.4_
  - [x] 4.2 编写统计面板工具数量属性测试
    - **Property 10: 统计面板工具数量准确性**
    - **Validates: Requirements 5.1**

- [x] 5. Checkpoint - 核心组件完成
  - 确保所有测试通过，如有问题请询问用户

- [x] 6. 创建 FeaturedToolsGrid 组件
  - [x] 6.1 实现精选工具网格组件
    - 创建 `src/components/FeaturedToolsGrid.tsx`
    - 按分类显示工具网格
    - 显示分类图标、名称和工具数量
    - 每个分类显示 4-6 个工具
    - 当工具数量超过限制时显示"查看更多"链接
    - _Requirements: 2.4, 7.1, 7.2, 7.3, 7.4_
  - [x] 6.2 编写分类工具数量属性测试
    - **Property 2: 分类工具数量一致性**
    - **Validates: Requirements 7.2**
  - [x] 6.3 编写查看更多链接属性测试
    - **Property 9: 查看更多链接条件显示**
    - **Validates: Requirements 7.4**

- [x] 7. 创建 RecentToolsList 组件
  - [x] 7.1 实现最新工具列表组件
    - 创建 `src/components/RecentToolsList.tsx`
    - 显示 3-5 个最新添加的工具
    - 显示工具图标、名称和简介
    - 点击跳转到工具页面
    - _Requirements: 6.1, 6.2, 6.3, 6.4_
  - [x] 7.2 编写最新工具列表属性测试
    - **Property 8: 最新工具列表数据完整性**
    - **Validates: Requirements 6.2, 6.4**

- [x] 8. 创建 MobileBottomNav 组件
  - [x] 8.1 实现移动端底部导航组件
    - 创建 `src/components/layout/MobileBottomNav.tsx`
    - 显示主要分类快捷入口
    - 支持展开完整分类列表
    - 仅在移动端视口显示
    - _Requirements: 1.5, 4.3_

- [x] 9. 创建 HomePageLayout 布局组件
  - [x] 9.1 实现首页布局容器组件
    - 创建 `src/components/layout/HomePageLayout.tsx`
    - 三栏布局：左侧导航 + 主内容 + 右侧边栏
    - 响应式行为：桌面/平板/移动端
    - 使用 CSS Grid 或 Flexbox 布局
    - _Requirements: 2.1, 4.1, 4.2, 4.3, 4.4, 4.5_

- [x] 10. Checkpoint - 所有组件完成
  - 确保所有测试通过，如有问题请询问用户

- [x] 11. 更新首页使用新布局
  - [x] 11.1 重构首页使用新布局组件
    - 修改 `src/app/[locale]/page.tsx`
    - 创建 `src/app/[locale]/HomePageClient.tsx`
    - 集成 HomePageLayout 组件
    - 集成 SidebarNavigation 组件
    - 集成 StatsPanel 组件
    - 集成 FeaturedToolsGrid 组件
    - 集成 RecentToolsList 组件
    - 保留现有的 SEO 结构化数据
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6_

- [x] 12. 添加翻译键
  - [x] 12.1 添加新组件所需的翻译键
    - 在所有 10 种语言文件中添加翻译
    - 添加 "viewMore", "recentTools", "featuredTools", "myTools" 等键
    - 添加 "nav.more", "nav.categories" 翻译键
    - 运行 `npx tsx scripts/split-translations.ts` 更新拆分文件
    - _Requirements: 1.6, 5.1, 6.1, 7.4_

- [x] 13. 更新工具列表页面布局
  - [x] 13.1 重构工具列表页面使用侧边栏布局
    - 修改 `src/app/[locale]/tools/ToolsPageClient.tsx`
    - 集成 SidebarNavigation 组件
    - 集成 MobileBottomNav 组件
    - 添加滚动监听更新活动分类
    - 保持现有的分类工具展示逻辑
    - _Requirements: 1.1, 1.3, 8.1, 8.3_

- [x] 14. 添加响应式样式
  - [x] 14.1 添加侧边栏和布局的响应式样式
    - 更新 `src/app/globals.css` 添加侧边栏、移动端导航、工具卡片等样式
    - 添加侧边栏展开/折叠动画
    - 添加移动端底部导航样式
    - 确保暗色模式兼容
    - _Requirements: 1.2, 1.4, 1.5, 4.1, 4.2, 4.3, 4.4, 4.5_

- [x] 15. Final Checkpoint - 功能完成
  - 所有组件已创建并集成
  - 构建成功通过
  - 响应式布局在不同设备上正常工作
  - 翻译键已添加到所有 10 种语言

- [x] 16. 实现分类点击不跳转功能
  - [x] 16.1 修改 SidebarNavigation 组件支持无跳转模式
    - 将 CategoryItem 的 Link 改为 button 或可配置的行为
    - 添加 `preventNavigation` prop 控制是否阻止页面跳转
    - 点击分类时调用 `onCategoryClick` 回调而不是导航
    - _Requirements: 1.3, 1.7_
  - [x] 16.2 修改 HomePageClient 组件支持分类筛选
    - 添加 `selectedCategory` 状态管理当前选中的分类
    - 根据选中分类筛选显示的工具
    - 显示分类标题和工具数量
    - 提供"返回全部"或"清除筛选"功能
    - _Requirements: 1.3, 1.7_
  - [x] 16.3 更新 FeaturedToolsGrid 组件支持单分类模式
    - 添加 `singleCategory` prop 支持只显示单个分类
    - 当选中分类时显示该分类的所有工具
    - _Requirements: 1.7, 7.1_

- [x] 17. Checkpoint - 分类筛选功能完成
  - 确保点击分类不跳转页面
  - 中栏正确显示选中分类的工具
  - 可以返回查看全部工具

- [x] 18. 优化布局：将右侧边栏合并到 Hero 区域
  - [x] 18.1 移除独立的右侧边栏
    - 从 HomePageLayout 中移除 rightSidebar prop 的使用
    - 移除 StatsPanel 组件的独立导入
  - [x] 18.2 在 Hero 区域集成统计和最新工具
    - 使用两栏布局：左边标题+按钮，右边统计+最新工具
    - 桌面端显示紧凑版统计面板和最新工具列表
    - 移动端在标题下方显示简化的统计信息
  - [x] 18.3 为 RecentToolsList 添加 compact prop
    - 支持紧凑模式（无边框和标题）
    - 在 Hero 区域使用紧凑模式显示

- [x] 19. Final Checkpoint - 布局优化完成
  - 右侧边栏已合并到 Hero 区域
  - 构建成功通过
  - 页面布局更加紧凑

## Notes

- 所有任务都必须完成，包括属性测试
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties
- Unit tests validate specific examples and edge cases
- 所有翻译必须同时更新 10 种语言文件
