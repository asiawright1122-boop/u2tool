# Design Document: Sidebar Category Navigation

## Overview

本设计文档描述了左侧分类导航布局的技术实现方案。采用现代化的侧边栏导航模式，参考即时工具（67tool.com）的设计风格，为用户提供清晰、高效的工具分类导航体验。

## Architecture

### 整体布局结构

```
┌─────────────────────────────────────────────────────────────────┐
│                         Header (固定顶部)                         │
├──────────┬──────────────────────────────────────────────────────┤
│          │                                                       │
│  Sidebar │              Main Content Area                        │
│  (固定)   │                                                       │
│          │  ┌─────────────────────┬─────────────────────────┐   │
│  📝 文本  │  │   Stats Panel       │   Recent Tools          │   │
│  🔐 编码  │  │   (工具数量统计)      │   (最新发布)             │   │
│  ⚡ 生成  │  ├─────────────────────┴─────────────────────────┤   │
│  🔄 转换  │  │                                               │   │
│  💻 开发  │  │   Featured Banner / Promotion                 │   │
│  🔒 安全  │  │                                               │   │
│  🌐 网络  │  ├───────────────────────────────────────────────┤   │
│  🖼️ 图片  │  │                                               │   │
│  🔢 数学  │  │   Tool Categories Grid                        │   │
│  📈 图表  │  │   (分类工具网格)                                │   │
│  📄 办公  │  │                                               │   │
│          │  └───────────────────────────────────────────────┘   │
└──────────┴──────────────────────────────────────────────────────┘
```

### 响应式断点

- **Desktop (≥1024px)**: 完整侧边栏 + 主内容区
- **Tablet (768px-1023px)**: 折叠侧边栏（仅图标）+ 主内容区
- **Mobile (<768px)**: 隐藏侧边栏 + 底部导航栏

## Components and Interfaces

### 1. SidebarNavigation 组件

```typescript
// src/components/layout/SidebarNavigation.tsx

interface SidebarNavigationProps {
  activeCategory?: string;
  collapsed?: boolean;
  onCategoryClick?: (categoryId: string) => void;
}

interface CategoryItemProps {
  id: string;
  icon: string;
  name: string;
  isActive: boolean;
  collapsed: boolean;
  toolCount: number;
  onClick: () => void;
}
```

**功能说明**:
- 固定定位在页面左侧
- 支持展开/折叠状态
- 显示分类图标、名称和工具数量
- 高亮当前活动分类
- 支持键盘导航

### 2. HomePageLayout 组件

```typescript
// src/components/layout/HomePageLayout.tsx

interface HomePageLayoutProps {
  children: React.ReactNode;
  sidebar?: React.ReactNode;
  rightSidebar?: React.ReactNode;
}
```

**功能说明**:
- 三栏布局容器
- 管理侧边栏和主内容区的响应式行为
- 处理滚动同步

### 3. StatsPanel 组件

```typescript
// src/components/StatsPanel.tsx

interface StatsPanelProps {
  toolCount: number;
  visitorCount?: number;
}

interface StatItemProps {
  icon: React.ReactNode;
  value: number | string;
  label: string;
}
```

**功能说明**:
- 显示工具总数
- 显示访问统计（可选）
- 数字动画效果

### 4. FeaturedToolsGrid 组件

```typescript
// src/components/FeaturedToolsGrid.tsx

interface FeaturedToolsGridProps {
  tools: Tool[];
  category?: string;
  maxItems?: number;
  showViewMore?: boolean;
}
```

**功能说明**:
- 网格布局展示工具
- 支持按分类筛选
- 显示"查看更多"链接

### 5. RecentToolsList 组件

```typescript
// src/components/RecentToolsList.tsx

interface RecentToolsListProps {
  tools: Tool[];
  maxItems?: number;
}
```

**功能说明**:
- 列表形式展示最新工具
- 显示工具图标、名称和简介

### 6. ToolCard 组件（增强版）

```typescript
// src/components/ToolCard.tsx

interface ToolCardProps {
  tool: Tool;
  variant?: 'grid' | 'list' | 'compact';
  showBadge?: boolean;
  showDescription?: boolean;
}
```

**功能说明**:
- 支持多种展示变体
- 显示热门标签
- 悬停动画效果

### 7. MobileBottomNav 组件

```typescript
// src/components/layout/MobileBottomNav.tsx

interface MobileBottomNavProps {
  activeCategory?: string;
  onCategorySelect: (categoryId: string) => void;
}
```

**功能说明**:
- 移动端底部导航栏
- 显示主要分类快捷入口
- 支持展开完整分类列表

## Data Models

### 工具分类数据结构

```typescript
interface CategoryWithCount {
  id: ToolCategory;
  icon: string;
  name: string;        // 翻译后的名称
  toolCount: number;   // 该分类下的工具数量
}
```

### 首页数据结构

```typescript
interface HomePageData {
  stats: {
    totalTools: number;
    totalCategories: number;
    popularToolsCount: number;
  };
  featuredTools: Tool[];
  recentTools: Tool[];
  categoriesWithTools: {
    category: CategoryWithCount;
    tools: Tool[];
  }[];
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: 分类导航完整性与数据正确性

*For any* rendered SidebarNavigation component, all 11 tool categories defined in the configuration SHALL be displayed with their correct icon and translated name.

**Validates: Requirements 1.1, 1.6**

### Property 2: 分类工具数量一致性

*For any* category displayed in the sidebar or category section, the tool count shown SHALL equal the actual number of tools in that category from the tools configuration.

**Validates: Requirements 7.2**

### Property 3: 响应式布局断点正确性

*For any* viewport width value, the layout mode calculation function SHALL return the correct mode: 'desktop' for width ≥ 1024px, 'tablet' for 768px ≤ width < 1024px, and 'mobile' for width < 768px.

**Validates: Requirements 4.1, 4.2, 4.3**

### Property 4: 活动状态指示准确性

*For any* category ID passed as the active category prop, the corresponding Category_Item in the sidebar SHALL have the active CSS class applied.

**Validates: Requirements 8.1**

### Property 5: 工具卡片数据完整性

*For any* Tool object passed to the ToolCard component, the rendered output SHALL contain the tool's icon, translated name, and translated description.

**Validates: Requirements 3.1**

### Property 6: 工具卡片导航链接正确性

*For any* Tool object rendered as a ToolCard, the link href SHALL point to `/tools/{tool.slug}`.

**Validates: Requirements 3.3**

### Property 7: 热门工具标签显示

*For any* Tool object with `popular: true`, the ToolCard SHALL display a "热门" badge; for tools with `popular: false` or undefined, no badge SHALL be displayed.

**Validates: Requirements 3.5**

### Property 8: 最新工具列表数据完整性

*For any* tool displayed in the RecentToolsList, the rendered item SHALL contain the tool's icon, name, and description, and the link SHALL navigate to the correct tool page.

**Validates: Requirements 6.2, 6.4**

### Property 9: 查看更多链接条件显示

*For any* category section where the total tool count exceeds the display limit, a "查看更多" link SHALL be rendered; for categories within the limit, no such link SHALL appear.

**Validates: Requirements 7.4**

### Property 10: 统计面板工具数量准确性

*For any* rendered StatsPanel, the displayed tool count SHALL equal the total number of tools in the tools configuration array.

**Validates: Requirements 5.1**

## Error Handling

### 翻译缺失处理

```typescript
// 使用 fallback 机制处理翻译缺失
const categoryName = t(`categories.${category.id}`, { 
  defaultValue: category.id 
});
```

### 空分类处理

```typescript
// 过滤掉没有工具的分类
const categoriesWithTools = categories.filter(
  cat => getToolsByCategory(cat.id).length > 0
);
```

### 响应式状态同步

```typescript
// 使用 ResizeObserver 监听视口变化
useEffect(() => {
  const observer = new ResizeObserver(entries => {
    const width = entries[0].contentRect.width;
    setLayoutMode(getLayoutMode(width));
  });
  observer.observe(document.body);
  return () => observer.disconnect();
}, []);
```

## Testing Strategy

### 单元测试

1. **SidebarNavigation 组件测试**
   - 验证所有分类正确渲染
   - 验证活动状态正确显示
   - 验证折叠/展开状态切换

2. **StatsPanel 组件测试**
   - 验证统计数据正确显示
   - 验证数字格式化

3. **ToolCard 组件测试**
   - 验证不同变体正确渲染
   - 验证热门标签显示逻辑

### 属性测试

1. **分类完整性属性测试**
   - 生成随机分类配置，验证导航完整性

2. **响应式布局属性测试**
   - 生成随机视口宽度，验证布局模式正确

### 集成测试

1. **页面导航测试**
   - 验证点击分类正确导航
   - 验证 URL 和活动状态同步

2. **响应式行为测试**
   - 验证不同设备尺寸下的布局

### E2E 测试

1. **用户流程测试**
   - 从首页导航到分类页面
   - 验证工具卡片点击跳转

## 视觉设计规范

### 颜色方案

```css
/* 侧边栏 */
--sidebar-bg: #ffffff;
--sidebar-bg-dark: #1a1a1a;
--sidebar-border: #e5e7eb;
--sidebar-border-dark: #374151;

/* 活动状态 */
--active-bg: #eff6ff;
--active-bg-dark: #1e3a5f;
--active-border: #3b82f6;
--active-text: #1d4ed8;
--active-text-dark: #60a5fa;

/* 悬停状态 */
--hover-bg: #f3f4f6;
--hover-bg-dark: #374151;
```

### 尺寸规范

```css
/* 侧边栏 */
--sidebar-width: 200px;
--sidebar-collapsed-width: 64px;

/* 间距 */
--category-item-padding: 12px 16px;
--category-item-gap: 8px;

/* 工具卡片 */
--tool-card-padding: 16px;
--tool-card-gap: 16px;
```

### 动画效果

```css
/* 过渡动画 */
--transition-fast: 150ms ease;
--transition-normal: 200ms ease;
--transition-slow: 300ms ease;

/* 悬停效果 */
.category-item:hover {
  transform: translateX(4px);
  transition: var(--transition-fast);
}

/* 侧边栏折叠 */
.sidebar {
  transition: width var(--transition-normal);
}
```

## 文件结构

```
src/
├── components/
│   ├── layout/
│   │   ├── SidebarNavigation.tsx    # 侧边栏导航组件
│   │   ├── HomePageLayout.tsx       # 首页布局容器
│   │   └── MobileBottomNav.tsx      # 移动端底部导航
│   ├── StatsPanel.tsx               # 统计面板
│   ├── FeaturedToolsGrid.tsx        # 精选工具网格
│   ├── RecentToolsList.tsx          # 最新工具列表
│   └── ToolCard.tsx                 # 工具卡片（增强版）
├── app/
│   └── [locale]/
│       └── page.tsx                 # 首页（更新布局）
└── styles/
    └── sidebar.css                  # 侧边栏样式（可选）
```
