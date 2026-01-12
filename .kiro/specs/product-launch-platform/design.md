# Design Document: Product Launch Platform

## Overview

本设计文档描述 U2Tool 产品发布平台的技术架构和实现方案。该平台允许用户提交产品、浏览已发布产品、投票支持喜欢的产品，并为管理员提供审核和管理功能。

系统采用 Next.js 16 App Router 架构，复用现有的国际化基础设施（next-intl），使用 JSON 文件作为 MVP 阶段的数据存储方案，支持未来迁移到数据库。

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Frontend (Next.js)                        │
├─────────────────────────────────────────────────────────────────┤
│  Pages                                                           │
│  ├── /[locale]/launches           (产品列表页)                    │
│  ├── /[locale]/launches/[slug]    (产品详情页)                    │
│  ├── /[locale]/launches/submit    (产品提交页)                    │
│  ├── /[locale]/launches/category/[category] (分类页)             │
│  └── /admin/launches              (管理后台 - 简单密码保护)        │
├─────────────────────────────────────────────────────────────────┤
│  Components                                                      │
│  ├── ProductCard                  (产品卡片)                      │
│  ├── ProductList                  (产品列表)                      │
│  ├── ProductDetail                (产品详情)                      │
│  ├── SubmitForm                   (提交表单)                      │
│  ├── UpvoteButton                 (投票按钮)                      │
│  ├── CategoryFilter               (分类筛选)                      │
│  └── LaunchStats                  (统计数据)                      │
├─────────────────────────────────────────────────────────────────┤
│  API Routes                                                      │
│  ├── /api/launches                (获取产品列表)                   │
│  ├── /api/launches/[slug]         (获取单个产品)                   │
│  ├── /api/launches/submit         (提交产品)                      │
│  ├── /api/launches/upvote         (投票)                          │
│  └── /api/admin/launches          (管理接口)                      │
├─────────────────────────────────────────────────────────────────┤
│  Data Layer                                                      │
│  ├── content/launches/products.json    (已发布产品)               │
│  ├── content/launches/submissions.json (待审核提交)               │
│  └── public/launches/                  (产品图片)                 │
└─────────────────────────────────────────────────────────────────┘
```

## Components and Interfaces

### Data Types

```typescript
// src/types/launch.ts

export type LaunchCategory = 
  | 'ai-tools'
  | 'developer-tools'
  | 'design-tools'
  | 'productivity'
  | 'marketing'
  | 'finance'
  | 'education'
  | 'entertainment'
  | 'other';

export type LaunchStatus = 'pending' | 'approved' | 'rejected';

export interface Product {
  id: string;                    // UUID
  slug: string;                  // URL-friendly slug
  name: string;                  // 产品名称
  tagline: string;               // 简短描述 (max 60 chars)
  description: string;           // 详细描述
  websiteUrl: string;            // 产品网站
  logoUrl: string;               // Logo 图片路径
  screenshots: string[];         // 截图路径数组 (max 5)
  category: LaunchCategory;      // 分类
  upvotes: number;               // 投票数
  views: number;                 // 浏览数
  status: LaunchStatus;          // 状态
  featured: boolean;             // 是否精选
  makerName?: string;            // 创建者名称
  makerEmail?: string;           // 创建者邮箱 (不公开)
  socialLinks?: {                // 社交链接
    twitter?: string;
    github?: string;
    linkedin?: string;
  };
  createdAt: string;             // ISO 日期字符串
  updatedAt: string;             // ISO 日期字符串
  launchedAt?: string;           // 发布日期 (审核通过时设置)
}

export interface ProductSubmission extends Omit<Product, 'upvotes' | 'views' | 'status' | 'featured' | 'launchedAt'> {
  status: 'pending';
  submittedAt: string;
  rejectionReason?: string;
}

export interface LaunchStats {
  totalLaunches: number;
  totalUpvotes: number;
  totalViews: number;
  featuredCount: number;
}

export interface ProductListParams {
  category?: LaunchCategory;
  sort?: 'newest' | 'popular' | 'featured';
  page?: number;
  limit?: number;
}
```

### Component Interfaces

```typescript
// ProductCard Component
interface ProductCardProps {
  product: Product;
  onUpvote?: (productId: string) => void;
  isUpvoted?: boolean;
}

// ProductList Component
interface ProductListProps {
  products: Product[];
  loading?: boolean;
  onLoadMore?: () => void;
  hasMore?: boolean;
}

// SubmitForm Component
interface SubmitFormProps {
  onSubmit: (data: ProductSubmission) => Promise<void>;
  loading?: boolean;
}

// UpvoteButton Component
interface UpvoteButtonProps {
  productId: string;
  initialCount: number;
  initialUpvoted?: boolean;
  onUpvote?: (newCount: number) => void;
}

// CategoryFilter Component
interface CategoryFilterProps {
  categories: LaunchCategory[];
  selected?: LaunchCategory;
  onSelect: (category: LaunchCategory | undefined) => void;
  counts?: Record<LaunchCategory, number>;
}
```

## Data Models

### JSON File Structure

**content/launches/products.json**
```json
{
  "products": [
    {
      "id": "uuid-1",
      "slug": "product-name",
      "name": "Product Name",
      "tagline": "Short description",
      "description": "Full description...",
      "websiteUrl": "https://example.com",
      "logoUrl": "/launches/logos/product-name.png",
      "screenshots": ["/launches/screenshots/product-name-1.png"],
      "category": "ai-tools",
      "upvotes": 42,
      "views": 156,
      "status": "approved",
      "featured": true,
      "makerName": "John Doe",
      "createdAt": "2025-01-09T00:00:00Z",
      "updatedAt": "2025-01-09T00:00:00Z",
      "launchedAt": "2025-01-09T00:00:00Z"
    }
  ],
  "stats": {
    "totalLaunches": 1,
    "totalUpvotes": 42,
    "totalViews": 156,
    "featuredCount": 1
  }
}
```

**content/launches/submissions.json**
```json
{
  "submissions": [
    {
      "id": "uuid-2",
      "slug": "pending-product",
      "name": "Pending Product",
      "tagline": "Awaiting review",
      "description": "Description...",
      "websiteUrl": "https://pending.com",
      "logoUrl": "/launches/pending/pending-product.png",
      "screenshots": [],
      "category": "developer-tools",
      "status": "pending",
      "makerName": "Jane Doe",
      "makerEmail": "jane@example.com",
      "createdAt": "2025-01-09T00:00:00Z",
      "updatedAt": "2025-01-09T00:00:00Z",
      "submittedAt": "2025-01-09T00:00:00Z"
    }
  ]
}
```

### Slug Generation

```typescript
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')  // 移除特殊字符
    .replace(/\s+/g, '-')           // 空格转连字符
    .replace(/-+/g, '-')            // 合并多个连字符
    .substring(0, 50);              // 限制长度
}
```

### Upvote Storage (localStorage)

```typescript
// 存储格式
interface UpvoteStorage {
  [productId: string]: boolean;
}

// localStorage key: 'u2tool_upvotes'
```



## API Design

### GET /api/launches

获取产品列表

**Query Parameters:**
- `category`: LaunchCategory (optional)
- `sort`: 'newest' | 'popular' | 'featured' (default: 'newest')
- `page`: number (default: 1)
- `limit`: number (default: 20, max: 50)

**Response:**
```json
{
  "products": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  },
  "stats": {
    "totalLaunches": 100,
    "totalUpvotes": 5000,
    "totalViews": 20000,
    "featuredCount": 10
  }
}
```

### GET /api/launches/[slug]

获取单个产品详情

**Response:**
```json
{
  "product": {...},
  "relatedProducts": [...]
}
```

### POST /api/launches/submit

提交新产品

**Request Body:**
```json
{
  "name": "Product Name",
  "tagline": "Short description",
  "description": "Full description",
  "websiteUrl": "https://example.com",
  "logoUrl": "data:image/png;base64,...",
  "screenshots": ["data:image/png;base64,..."],
  "category": "ai-tools",
  "makerName": "John Doe",
  "makerEmail": "john@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Product submitted for review",
  "submissionId": "uuid"
}
```

### POST /api/launches/upvote

投票

**Request Body:**
```json
{
  "productId": "uuid",
  "action": "upvote" | "remove"
}
```

**Response:**
```json
{
  "success": true,
  "newCount": 43
}
```

### Admin API (需要密码验证)

**POST /api/admin/launches/approve**
```json
{
  "submissionId": "uuid",
  "password": "admin_password"
}
```

**POST /api/admin/launches/reject**
```json
{
  "submissionId": "uuid",
  "password": "admin_password",
  "reason": "Optional rejection reason"
}
```

**POST /api/admin/launches/add**
```json
{
  "password": "admin_password",
  "product": {...}
}
```

## Page Structure

### /[locale]/launches (产品列表页)

```
┌─────────────────────────────────────────────────────────────┐
│  Header: "Product Launches"                                  │
│  Subtitle: "Discover the latest tools and applications"     │
├─────────────────────────────────────────────────────────────┤
│  Stats Bar                                                   │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐       │
│  │ 46+      │ │ 46+      │ │ 6.5K+    │ │ 10+      │       │
│  │ Launches │ │ Products │ │ Views    │ │ Featured │       │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘       │
├─────────────────────────────────────────────────────────────┤
│  [+ Submit Your Product]                                     │
├─────────────────────────────────────────────────────────────┤
│  Filters: [All] [AI] [Dev] [Design] [Productivity] ...      │
│  Sort: [Newest ▼] [Popular] [Featured]                      │
├─────────────────────────────────────────────────────────────┤
│  Product Cards Grid                                          │
│  ┌─────────────────────────────────────────────────────────┐│
│  │ [Logo] Product Name                    [▲ 42]           ││
│  │        Tagline description here...                      ││
│  │        [AI Tools] • Jan 9, 2025                         ││
│  └─────────────────────────────────────────────────────────┘│
│  ... more cards ...                                          │
├─────────────────────────────────────────────────────────────┤
│  [Load More] or Pagination                                   │
└─────────────────────────────────────────────────────────────┘
```

### /[locale]/launches/[slug] (产品详情页)

```
┌─────────────────────────────────────────────────────────────┐
│  Breadcrumb: Home > Launches > Product Name                  │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────┐                                                │
│  │  [Logo]  │  Product Name                    [▲ 42]       │
│  │          │  Tagline description here                      │
│  └──────────┘  [Visit Website →]                            │
├─────────────────────────────────────────────────────────────┤
│  Screenshots Gallery                                         │
│  ┌─────┐ ┌─────┐ ┌─────┐                                    │
│  │     │ │     │ │     │                                    │
│  └─────┘ └─────┘ └─────┘                                    │
├─────────────────────────────────────────────────────────────┤
│  About                                                       │
│  Full description text here...                               │
├─────────────────────────────────────────────────────────────┤
│  Details                                                     │
│  Category: AI Tools                                          │
│  Launched: January 9, 2025                                   │
│  Maker: John Doe                                             │
├─────────────────────────────────────────────────────────────┤
│  Related Products                                            │
│  [Card] [Card] [Card]                                        │
└─────────────────────────────────────────────────────────────┘
```

## File Structure

```
src/
├── app/
│   ├── [locale]/
│   │   └── launches/
│   │       ├── page.tsx                 # 产品列表页
│   │       ├── submit/
│   │       │   └── page.tsx             # 提交页面
│   │       ├── category/
│   │       │   └── [category]/
│   │       │       └── page.tsx         # 分类页面
│   │       └── [slug]/
│   │           └── page.tsx             # 产品详情页
│   └── api/
│       ├── launches/
│       │   ├── route.ts                 # GET 产品列表
│       │   ├── [slug]/
│       │   │   └── route.ts             # GET 单个产品
│       │   ├── submit/
│       │   │   └── route.ts             # POST 提交产品
│       │   └── upvote/
│       │       └── route.ts             # POST 投票
│       └── admin/
│           └── launches/
│               └── route.ts             # 管理接口
├── components/
│   └── launches/
│       ├── ProductCard.tsx
│       ├── ProductList.tsx
│       ├── ProductDetail.tsx
│       ├── SubmitForm.tsx
│       ├── UpvoteButton.tsx
│       ├── CategoryFilter.tsx
│       ├── LaunchStats.tsx
│       └── index.ts
├── lib/
│   └── launches/
│       ├── data.ts                      # 数据读写函数
│       ├── validation.ts                # 表单验证
│       └── utils.ts                     # 工具函数
├── types/
│   └── launch.ts                        # 类型定义
└── config/
    └── launches.ts                      # 分类配置等

content/
└── launches/
    ├── products.json                    # 已发布产品数据
    └── submissions.json                 # 待审核提交

public/
└── launches/
    ├── logos/                           # 产品 Logo
    ├── screenshots/                     # 产品截图
    └── pending/                         # 待审核图片
```

## Error Handling

### Validation Errors

```typescript
interface ValidationError {
  field: string;
  message: string;
}

interface SubmitResponse {
  success: boolean;
  message?: string;
  errors?: ValidationError[];
  submissionId?: string;
}
```

### Error Cases

1. **重复提交**: 检查 websiteUrl 是否已存在
2. **无效图片**: 验证图片格式和大小
3. **必填字段缺失**: 返回具体缺失字段
4. **Slug 冲突**: 自动添加数字后缀 (product-name-2)
5. **投票失败**: 返回当前计数，前端回滚

## Testing Strategy

### Unit Tests

使用 Vitest 进行单元测试：

1. **数据验证测试**
   - 测试 slug 生成函数
   - 测试表单验证逻辑
   - 测试分类过滤逻辑

2. **组件测试**
   - ProductCard 渲染测试
   - UpvoteButton 交互测试
   - SubmitForm 验证测试

### Property-Based Tests

使用 fast-check 进行属性测试：

1. **Slug 生成属性测试**
   - 任意产品名称生成的 slug 都是 URL 安全的
   - Slug 长度不超过 50 字符

2. **数据完整性测试**
   - 产品数据序列化/反序列化保持一致



## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

Based on the prework analysis, the following correctness properties have been identified for property-based testing:

### Property 1: Category Filtering Correctness

*For any* list of products and any selected category, filtering the list by that category SHALL return only products where `product.category === selectedCategory`.

**Validates: Requirements 1.4, 6.2**

### Property 2: Product Sorting Correctness

*For any* list of products:
- Sorting by "newest" SHALL return products ordered by `launchedAt` descending
- Sorting by "popular" SHALL return products ordered by `upvotes` descending
- Sorting by "featured" SHALL return featured products first, then by `launchedAt` descending

**Validates: Requirements 1.5**

### Property 3: Statistics Calculation Accuracy

*For any* list of approved products, the calculated statistics SHALL satisfy:
- `totalLaunches === products.length`
- `totalUpvotes === sum(products.map(p => p.upvotes))`
- `totalViews === sum(products.map(p => p.views))`
- `featuredCount === products.filter(p => p.featured).length`

**Validates: Requirements 1.6, 6.5**

### Property 4: Product Card Rendering Completeness

*For any* valid product object, the rendered ProductCard component SHALL contain:
- Product name
- Product logo (or placeholder)
- Tagline
- Category label
- Upvote count
- Launch date

**Validates: Requirements 1.2**

### Property 5: Related Products Category Matching

*For any* product detail page, all related products displayed SHALL have the same category as the current product.

**Validates: Requirements 2.3**

### Property 6: SEO Metadata Generation

*For any* product, the generated metadata SHALL:
- Have a title containing the product name
- Have a description containing the product tagline
- Have Open Graph tags (og:title, og:description, og:image)
- Have Twitter Card tags (twitter:card, twitter:title, twitter:description)

**Validates: Requirements 2.4, 9.1, 9.2**

### Property 7: Structured Data Validity

*For any* product page, the generated JSON-LD structured data SHALL:
- Be valid JSON
- Have `@type` of "SoftwareApplication"
- Contain the product name and description

**Validates: Requirements 2.5, 9.3**

### Property 8: Form Validation - Required Fields

*For any* submission data missing any required field (name, tagline, description, websiteUrl, logoUrl, category), validation SHALL return an error specifying the missing field.

**Validates: Requirements 3.2, 3.5**

### Property 9: Form Validation - Tagline Length

*For any* submission with a tagline longer than 60 characters, validation SHALL return a tagline length error.

**Validates: Requirements 3.2**

### Property 10: Duplicate URL Detection

*For any* submission where the websiteUrl already exists in the products or submissions list, the system SHALL reject the submission with a duplicate error.

**Validates: Requirements 3.6**

### Property 11: Image Validation

*For any* file submitted as a logo:
- If the file is not PNG, JPG, or WebP format, validation SHALL return a format error
- If the file is larger than 2MB, validation SHALL return a size error

**Validates: Requirements 3.7**

### Property 12: Upvote Toggle Correctness

*For any* product with initial upvote count N:
- Upvoting SHALL result in count N+1
- Removing an upvote SHALL result in count N-1
- The count SHALL never go below 0

**Validates: Requirements 4.1, 4.4**

### Property 13: Admin Status Change

*For any* pending submission:
- Approving SHALL change status to "approved" and set `launchedAt`
- Rejecting SHALL change status to "rejected"

*For any* approved product:
- Marking as featured SHALL set `featured` to true
- Deleting SHALL remove it from the products list

**Validates: Requirements 5.2, 5.3, 5.5, 5.7**

### Property 14: Slug Generation - URL Safety

*For any* product name string, the generated slug SHALL:
- Contain only lowercase letters, numbers, and hyphens
- Not start or end with a hyphen
- Not contain consecutive hyphens
- Have length ≤ 50 characters

**Validates: Requirements 7.5**

### Property 15: Slug Generation - Uniqueness

*For any* two different product names that would generate the same base slug, the system SHALL generate unique slugs by appending numeric suffixes.

**Validates: Requirements 7.5**

### Property 16: Product Data Serialization Round-Trip

*For any* valid Product object, serializing to JSON and deserializing back SHALL produce an equivalent object.

**Validates: Requirements 7.4**

### Property 17: Translation Key Completeness

*For any* of the 10 supported languages, all UI translation keys used in the launches module SHALL have corresponding translations.

**Validates: Requirements 8.2**

### Property 18: Hreflang Tag Generation

*For any* product page, the generated hreflang tags SHALL include all 10 supported languages plus x-default.

**Validates: Requirements 8.4**

### Property 19: Sitemap Inclusion

*For any* approved product, the sitemap.xml SHALL include the product's URL.

**Validates: Requirements 9.4**

### Property 20: Pagination Correctness

*For any* list of N products and page size of 20:
- Page 1 SHALL return min(N, 20) products
- Total pages SHALL equal ceil(N / 20)
- Each page SHALL return products in the correct order slice

**Validates: Requirements 10.3**

