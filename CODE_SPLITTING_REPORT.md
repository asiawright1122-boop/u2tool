# 代码分割检查报告

**检查时间**: 2026/1/23 15:14:22

## 📊 导入统计

| 指标 | 数值 |
|------|------|
| 扫描文件 | 562 |
| 总导入数 | 2120 |
| 静态导入 | 1674 |
| 动态导入 | 443 |
| 动态导入率 | 20.9% |

## 🔍 问题统计

| 严重程度 | 数量 |
|----------|------|
| 🚨 Critical | 0 |
| ⚠️ Warning | 13 |
| ℹ️ Info | 0 |
| **总计** | **13** |

## 📦 按模块分组

| 模块 | 大小 | 问题数 | 严重程度 |
|------|------|--------|----------|
| lucide-react | 200KB | 13 | ⚠️ Warning |

## 📋 问题详情

### ⚠️ lucide-react (200KB)

发现 13 处静态导入：

#### 📍 `src/components/tools/CalorieCalculator.tsx:5:1`

**建议**:
```
✅ 组件已通过 ToolRegistry 动态加载
   但内部仍有大型库的静态导入，考虑进一步优化
   使用按需导入单个图标: import { IconName } from 'lucide-react'
```

#### 📍 `src/components/tools/CountdownDaysCalculator.tsx:5:1`

**建议**:
```
✅ 组件已通过 ToolRegistry 动态加载
   但内部仍有大型库的静态导入，考虑进一步优化
   使用按需导入单个图标: import { IconName } from 'lucide-react'
```

#### 📍 `src/components/tools/DecisionWheel.tsx:5:1`

**建议**:
```
✅ 组件已通过 ToolRegistry 动态加载
   但内部仍有大型库的静态导入，考虑进一步优化
   使用按需导入单个图标: import { IconName } from 'lucide-react'
```

#### 📍 `src/components/tools/DueDateCalculator.tsx:5:1`

**建议**:
```
✅ 组件已通过 ToolRegistry 动态加载
   但内部仍有大型库的静态导入，考虑进一步优化
   使用按需导入单个图标: import { IconName } from 'lucide-react'
```

#### 📍 `src/components/tools/ElectricityCostCalculator.tsx:5:1`

**建议**:
```
✅ 组件已通过 ToolRegistry 动态加载
   但内部仍有大型库的静态导入，考虑进一步优化
   使用按需导入单个图标: import { IconName } from 'lucide-react'
```

#### 📍 `src/components/tools/FuelCostCalculator.tsx:5:1`

**建议**:
```
✅ 组件已通过 ToolRegistry 动态加载
   但内部仍有大型库的静态导入，考虑进一步优化
   使用按需导入单个图标: import { IconName } from 'lucide-react'
```

#### 📍 `src/components/tools/GpaCalculator.tsx:5:1`

**建议**:
```
✅ 组件已通过 ToolRegistry 动态加载
   但内部仍有大型库的静态导入，考虑进一步优化
   使用按需导入单个图标: import { IconName } from 'lucide-react'
```

#### 📍 `src/components/tools/LoveCalculator.tsx:5:1`

**建议**:
```
✅ 组件已通过 ToolRegistry 动态加载
   但内部仍有大型库的静态导入，考虑进一步优化
   使用按需导入单个图标: import { IconName } from 'lucide-react'
```

#### 📍 `src/components/tools/NameGenerator.tsx:5:1`

**建议**:
```
✅ 组件已通过 ToolRegistry 动态加载
   但内部仍有大型库的静态导入，考虑进一步优化
   使用按需导入单个图标: import { IconName } from 'lucide-react'
```

#### 📍 `src/components/tools/PaceCalculator.tsx:5:1`

**建议**:
```
✅ 组件已通过 ToolRegistry 动态加载
   但内部仍有大型库的静态导入，考虑进一步优化
   使用按需导入单个图标: import { IconName } from 'lucide-react'
```

#### 📍 `src/components/tools/SleepCalculator.tsx:5:1`

**建议**:
```
✅ 组件已通过 ToolRegistry 动态加载
   但内部仍有大型库的静态导入，考虑进一步优化
   使用按需导入单个图标: import { IconName } from 'lucide-react'
```

#### 📍 `src/components/tools/WaterIntakeCalculator.tsx:5:1`

**建议**:
```
✅ 组件已通过 ToolRegistry 动态加载
   但内部仍有大型库的静态导入，考虑进一步优化
   使用按需导入单个图标: import { IconName } from 'lucide-react'
```

#### 📍 `src/config/iconRegistry.tsx:1:1`

**建议**:
```
使用动态导入减少初始 bundle 大小
   使用按需导入单个图标: import { IconName } from 'lucide-react'
```

## 💡 优化建议

## ⚠️ Warning 问题 (13 个)

这些库（100-300KB）建议使用动态导入：

- **lucide-react** (200KB): 13 处静态导入

## 💡 通用优化建议

### 1. 使用 Next.js dynamic()
```typescript
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  ssr: false, // 禁用服务端渲染（如果不需要）
  loading: () => <div>Loading...</div> // 加载状态
});
```

### 2. 使用 React.lazy()
```typescript
import { lazy, Suspense } from 'react';

const HeavyComponent = lazy(() => import('./HeavyComponent'));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HeavyComponent />
    </Suspense>
  );
}
```

### 3. 按需导入
```typescript
// ❌ 不好：导入整个库
import * as echarts from 'echarts';

// ✅ 好：按需导入
import { BarChart } from 'echarts/charts';
import { GridComponent } from 'echarts/components';
```

### 4. 使用 CDN
对于某些大型库，考虑使用 CDN 加载：
- PDF.js
- ECharts（如果不需要服务端渲染）
- 其他第三方可视化库

### 5. 代码分割最佳实践
- 路由级别分割：每个页面是独立的 chunk
- 组件级别分割：大型组件使用 dynamic() 或 lazy()
- 库级别分割：大型第三方库动态导入
- 按需加载：用户交互时再加载（如点击按钮）
