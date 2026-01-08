# Design Document: Currency Rate Update System

## Overview

本设计文档描述了货币转换器的动态汇率更新系统。系统将使用 [Frankfurter API](https://frankfurter.dev/)（一个免费、开源的汇率 API）来获取实时汇率数据，并通过服务端缓存和客户端优化来提供快速、可靠的货币转换服务。

Frankfurter API 的优势：
- 完全免费，无需 API key
- 无使用限制
- 数据来源于欧洲中央银行等权威机构
- 支持 30+ 种货币
- 每日更新（工作日 16:00 CET）
- 支持历史汇率查询

## Architecture

### 系统架构图

```
┌─────────────────────────────────────────────────────────────┐
│                     Client Browser                          │
│  ┌──────────────────────────────────────────────────────┐  │
│  │         CurrencyConverter Component                   │  │
│  │  - Display UI                                         │  │
│  │  - Show loading states                                │  │
│  │  - Display rate timestamp                             │  │
│  └──────────────────────────────────────────────────────┘  │
│                           │                                  │
│                           ▼                                  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │         useCurrencyRates Hook                         │  │
│  │  - Fetch rates from API route                        │  │
│  │  - Handle loading/error states                       │  │
│  │  - Cache rates in memory                             │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                           │
                           │ HTTP Request
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                     Next.js Server                          │
│  ┌──────────────────────────────────────────────────────┐  │
│  │         /api/exchange-rates Route                     │  │
│  │  - Validate request                                   │  │
│  │  - Check server cache                                 │  │
│  │  - Fetch from Frankfurter if needed                  │  │
│  │  - Validate response data                             │  │
│  │  - Return rates with timestamp                        │  │
│  └──────────────────────────────────────────────────────┘  │
│                           │                                  │
│                           ▼                                  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │         Server-side Cache (Memory)                    │  │
│  │  - Store rates for 1 hour                            │  │
│  │  - Store timestamp                                    │  │
│  │  - Automatic expiration                               │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                           │
                           │ HTTP Request (if cache miss)
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                  Frankfurter API                            │
│              https://api.frankfurter.dev                    │
│  - Provides latest exchange rates                          │
│  - Updated daily around 16:00 CET                          │
│  - No API key required                                      │
└─────────────────────────────────────────────────────────────┘
```

### 数据流

1. **初始加载**：组件使用静态 fallback 汇率立即渲染
2. **后台获取**：同时发起 API 请求获取最新汇率
3. **缓存检查**：服务端检查缓存，如果有效则直接返回
4. **API 调用**：缓存过期时调用 Frankfurter API
5. **数据验证**：验证 API 返回的数据合理性
6. **更新 UI**：客户端接收新汇率并更新显示

## Components and Interfaces

### 1. API Route: `/api/exchange-rates`

服务端 API 路由，负责获取和缓存汇率数据。

```typescript
// src/app/api/exchange-rates/route.ts

interface ExchangeRatesResponse {
  rates: Record<string, number>;
  base: string;
  timestamp: string;
  source: 'api' | 'cache' | 'fallback';
}

interface FrankfurterResponse {
  base: string;
  date: string;
  rates: Record<string, number>;
}

// GET /api/exchange-rates
// Query params: base (optional, default: USD)
// Returns: ExchangeRatesResponse
```

**功能**：
- 检查服务端缓存
- 调用 Frankfurter API
- 验证数据
- 返回汇率和元数据

### 2. Currency Rates Hook: `useCurrencyRates`

客户端 React Hook，管理汇率数据的获取和状态。

```typescript
// src/hooks/useCurrencyRates.ts

interface UseCurrencyRatesResult {
  rates: Record<string, number> | null;
  loading: boolean;
  error: Error | null;
  timestamp: Date | null;
  source: 'api' | 'cache' | 'fallback';
  refetch: () => Promise<void>;
}

function useCurrencyRates(baseCurrency: string = 'USD'): UseCurrencyRatesResult
```

**功能**：
- 从 API 路由获取汇率
- 管理加载和错误状态
- 内存缓存（1小时）
- 提供手动刷新功能

### 3. Currency Service: `currencyService`

汇率数据处理和转换的核心服务。

```typescript
// src/lib/currency-service.ts

interface CurrencyRate {
  code: string;
  name: string;
  symbol: string;
  rate: number;
}

class CurrencyService {
  // 获取汇率（带缓存）
  async getRates(base: string): Promise<Record<string, number>>;
  
  // 转换货币
  convert(amount: number, from: string, to: string, rates: Record<string, number>): number;
  
  // 验证汇率数据
  validateRates(rates: Record<string, number>): boolean;
  
  // 合并 API 汇率和静态数据
  mergeRates(apiRates: Record<string, number>, staticRates: Currency[]): Currency[];
}
```

### 4. Server Cache: `rateCache`

服务端内存缓存实现。

```typescript
// src/lib/rate-cache.ts

interface CacheEntry {
  rates: Record<string, number>;
  timestamp: Date;
  base: string;
}

class RateCache {
  private cache: Map<string, CacheEntry>;
  private ttl: number; // 1 hour in milliseconds
  
  get(base: string): CacheEntry | null;
  set(base: string, rates: Record<string, number>): void;
  isValid(entry: CacheEntry): boolean;
  clear(): void;
}
```

### 5. Updated CurrencyConverter Component

更新后的货币转换器组件，集成动态汇率。

```typescript
// src/components/tools/CurrencyConverter.tsx

export default function CurrencyConverter() {
  const { rates, loading, error, timestamp, source, refetch } = useCurrencyRates('USD');
  
  // 使用动态汇率或 fallback
  const effectiveRates = rates || getFallbackRates();
  
  // 显示更新时间和来源
  // 提供手动刷新按钮
  // 显示错误提示（如果有）
}
```

## Data Models

### Currency Interface

```typescript
interface Currency {
  code: string;        // ISO 4217 currency code (e.g., "USD")
  name: string;        // Full currency name (e.g., "US Dollar")
  symbol: string;      // Currency symbol (e.g., "$")
  rate: number;        // Exchange rate relative to base currency
}
```

### Exchange Rate Response

```typescript
interface ExchangeRatesResponse {
  rates: Record<string, number>;  // Currency code -> rate mapping
  base: string;                   // Base currency (e.g., "USD")
  timestamp: string;              // ISO 8601 timestamp
  source: 'api' | 'cache' | 'fallback';  // Data source
}
```

### Frankfurter API Response

```typescript
interface FrankfurterResponse {
  base: string;                   // Base currency
  date: string;                   // Date in YYYY-MM-DD format
  rates: Record<string, number>;  // Currency rates
}
```

### Cache Entry

```typescript
interface CacheEntry {
  rates: Record<string, number>;  // Cached rates
  timestamp: Date;                // Cache creation time
  base: string;                   // Base currency
}
```

## Correctness Properties

*属性（Property）是关于系统行为的形式化陈述，应该在所有有效执行中保持为真。属性是人类可读规范和机器可验证正确性保证之间的桥梁。*

### Property 1: 缓存一致性

*对于任何*基础货币和时间窗口，如果缓存条目有效（未过期），则系统应返回缓存的汇率而不调用外部 API。

**Validates: Requirements 1.5**

### Property 2: 降级保证

*对于任何* API 请求失败的情况，系统应始终返回有效的汇率数据（使用 fallback 汇率）。

**Validates: Requirements 3.1, 3.2**

### Property 3: 数据验证

*对于任何*从 Frankfurter API 接收的汇率数据，所有汇率值必须是正数，且与 fallback 汇率的差异不超过 50%。

**Validates: Requirements 6.1, 6.2**

### Property 4: 时间戳准确性

*对于任何*返回的汇率数据，时间戳必须反映数据的实际获取或缓存时间。

**Validates: Requirements 2.1**

### Property 5: 缓存过期

*对于任何*缓存条目，如果其年龄超过 1 小时，系统应将其视为过期并获取新数据。

**Validates: Requirements 5.2, 5.3**

### Property 6: 货币代码完整性

*对于任何*汇率响应，必须包含所有在 fallback 数据中定义的货币代码。

**Validates: Requirements 6.5**

### Property 7: 转换对称性

*对于任何*两种货币 A 和 B，以及任何金额 X，将 X 从 A 转换到 B 再转换回 A 应该得到原始金额（在浮点精度范围内）。

**Validates: Requirements 1.1**

### Property 8: 汇率传递性

*对于任何*三种货币 A、B、C，通过 A→B→C 的转换结果应该等于直接 A→C 的转换结果（在浮点精度范围内）。

**Validates: Requirements 1.1**

## Error Handling

### 错误类型

1. **Network Errors**: Frankfurter API 不可达
   - 使用 fallback 汇率
   - 显示警告消息
   - 记录错误日志

2. **Invalid Response**: API 返回无效数据
   - 验证失败时使用 fallback
   - 记录验证错误
   - 显示数据来源警告

3. **Rate Limit**: API 请求过于频繁（理论上不会发生，因为有缓存）
   - 使用缓存数据
   - 延长缓存时间
   - 记录限流事件

4. **Validation Errors**: 汇率数据不合理
   - 拒绝异常数据
   - 使用 fallback 汇率
   - 记录验证失败详情

### 错误处理策略

```typescript
async function fetchRates(base: string): Promise<ExchangeRatesResponse> {
  try {
    // 1. 检查缓存
    const cached = rateCache.get(base);
    if (cached && rateCache.isValid(cached)) {
      return {
        rates: cached.rates,
        base: cached.base,
        timestamp: cached.timestamp.toISOString(),
        source: 'cache'
      };
    }
    
    // 2. 调用 API
    const response = await fetch(`https://api.frankfurter.dev/v1/latest?base=${base}`);
    if (!response.ok) {
      throw new Error(`API returned ${response.status}`);
    }
    
    const data: FrankfurterResponse = await response.json();
    
    // 3. 验证数据
    if (!validateRates(data.rates)) {
      throw new Error('Invalid rate data');
    }
    
    // 4. 缓存并返回
    rateCache.set(base, data.rates);
    return {
      rates: data.rates,
      base: data.base,
      timestamp: new Date().toISOString(),
      source: 'api'
    };
    
  } catch (error) {
    // 5. 降级到 fallback
    console.error('Failed to fetch rates:', error);
    return {
      rates: getFallbackRates(base),
      base,
      timestamp: new Date().toISOString(),
      source: 'fallback'
    };
  }
}
```

### 用户反馈

- **加载状态**: 显示 spinner 或骨架屏
- **成功状态**: 显示"已更新"和时间戳
- **错误状态**: 显示警告横幅，说明使用的是静态汇率
- **Fallback 状态**: 显示信息提示，说明汇率可能不是最新的

## Testing Strategy

### Unit Tests

1. **Currency Service Tests**
   - 测试货币转换计算
   - 测试汇率验证逻辑
   - 测试数据合并功能

2. **Rate Cache Tests**
   - 测试缓存存储和检索
   - 测试缓存过期逻辑
   - 测试缓存清除功能

3. **API Route Tests**
   - 测试成功响应
   - 测试错误处理
   - 测试缓存行为

4. **Hook Tests**
   - 测试数据获取
   - 测试加载状态
   - 测试错误状态
   - 测试刷新功能

### Property-Based Tests

每个测试运行至少 100 次迭代，使用随机生成的输入。

1. **Property 1: 缓存一致性**
   ```typescript
   // Feature: currency-rate-update, Property 1: 缓存一致性
   test('cached rates are returned without API call', () => {
     fc.assert(
       fc.property(
         fc.string(), // base currency
         fc.record({ rates: fc.dictionary(fc.string(), fc.double()) }),
         (base, rateData) => {
           // 设置缓存
           rateCache.set(base, rateData.rates);
           
           // 获取汇率（不应调用 API）
           const result = await getRates(base);
           
           // 验证返回缓存数据
           expect(result.source).toBe('cache');
           expect(result.rates).toEqual(rateData.rates);
         }
       ),
       { numRuns: 100 }
     );
   });
   ```

2. **Property 2: 降级保证**
   ```typescript
   // Feature: currency-rate-update, Property 2: 降级保证
   test('always returns valid rates even on API failure', () => {
     fc.assert(
       fc.property(
         fc.string(), // base currency
         async (base) => {
           // 模拟 API 失败
           mockApiFail();
           
           // 获取汇率
           const result = await getRates(base);
           
           // 验证返回 fallback 数据
           expect(result.source).toBe('fallback');
           expect(result.rates).toBeDefined();
           expect(Object.keys(result.rates).length).toBeGreaterThan(0);
         }
       ),
       { numRuns: 100 }
     );
   });
   ```

3. **Property 3: 数据验证**
   ```typescript
   // Feature: currency-rate-update, Property 3: 数据验证
   test('rejects invalid rate data', () => {
     fc.assert(
       fc.property(
         fc.dictionary(fc.string(), fc.double()), // random rates
         (rates) => {
           // 如果包含负数或零
           const hasInvalid = Object.values(rates).some(r => r <= 0);
           
           // 验证函数应该拒绝
           const isValid = validateRates(rates);
           
           if (hasInvalid) {
             expect(isValid).toBe(false);
           }
         }
       ),
       { numRuns: 100 }
     );
   });
   ```

4. **Property 7: 转换对称性**
   ```typescript
   // Feature: currency-rate-update, Property 7: 转换对称性
   test('currency conversion is symmetric', () => {
     fc.assert(
       fc.property(
         fc.double({ min: 0.01, max: 1000000 }), // amount
         fc.string(), // currency A
         fc.string(), // currency B
         fc.record({ rates: fc.dictionary(fc.string(), fc.double({ min: 0.01 })) }),
         (amount, currA, currB, rateData) => {
           // A -> B -> A
           const toB = convert(amount, currA, currB, rateData.rates);
           const backToA = convert(toB, currB, currA, rateData.rates);
           
           // 应该接近原始金额（浮点精度）
           expect(backToA).toBeCloseTo(amount, 2);
         }
       ),
       { numRuns: 100 }
     );
   });
   ```

5. **Property 8: 汇率传递性**
   ```typescript
   // Feature: currency-rate-update, Property 8: 汇率传递性
   test('currency conversion is transitive', () => {
     fc.assert(
       fc.property(
         fc.double({ min: 0.01, max: 1000000 }), // amount
         fc.string(), // currency A
         fc.string(), // currency B
         fc.string(), // currency C
         fc.record({ rates: fc.dictionary(fc.string(), fc.double({ min: 0.01 })) }),
         (amount, currA, currB, currC, rateData) => {
           // A -> B -> C
           const toB = convert(amount, currA, currB, rateData.rates);
           const toC = convert(toB, currB, currC, rateData.rates);
           
           // A -> C (direct)
           const directToC = convert(amount, currA, currC, rateData.rates);
           
           // 应该相等（浮点精度）
           expect(toC).toBeCloseTo(directToC, 2);
         }
       ),
       { numRuns: 100 }
     );
   });
   ```

### Integration Tests

1. **End-to-End Flow**
   - 测试完整的汇率获取流程
   - 测试 UI 更新
   - 测试错误显示

2. **API Integration**
   - 测试真实 Frankfurter API 调用（少量）
   - 验证响应格式
   - 测试错误场景

### Manual Testing

1. **网络条件测试**
   - 慢速网络
   - 离线模式
   - 间歇性连接

2. **用户体验测试**
   - 加载状态是否清晰
   - 错误消息是否有帮助
   - 时间戳显示是否准确

3. **多语言测试**
   - 验证所有 10 种语言的 UI 文本
   - 验证时间戳本地化

## Implementation Notes

### Frankfurter API 限制

- 每日更新一次（工作日 16:00 CET）
- 支持约 30 种货币（主要是欧洲和主要国际货币）
- 不支持加密货币

### 处理不支持的货币

对于 Frankfurter 不支持的货币（如某些加密货币、小众货币），我们将：
1. 保留在 fallback 数据中
2. 使用静态汇率
3. 在 UI 中标注为"估算值"

### 缓存策略

- **服务端缓存**: 1 小时 TTL，存储在内存中
- **客户端缓存**: 1 小时 TTL，存储在组件状态中
- **缓存键**: 基础货币代码（如 "USD"）

### 性能优化

1. **预加载**: 在页面加载时预取 USD 基础汇率
2. **并行请求**: 如果需要多个基础货币，并行请求
3. **响应压缩**: API 响应自动 gzip 压缩
4. **最小化数据**: 只请求需要的货币对

### 多语言支持

需要添加的翻译键：

```json
{
  "tools": {
    "currency-converter": {
      "lastUpdated": "最后更新",
      "updatedAgo": "{time} 前更新",
      "updating": "正在更新汇率...",
      "updateFailed": "无法获取最新汇率，使用静态汇率",
      "usingStaticRates": "使用静态汇率（可能不是最新）",
      "refresh": "刷新汇率",
      "rateSource": "汇率来源",
      "sourceApi": "实时 API",
      "sourceCache": "缓存",
      "sourceFallback": "静态数据"
    }
  }
}
```

### 监控和日志

记录以下事件：
- API 调用成功/失败
- 缓存命中/未命中
- 数据验证失败
- 降级到 fallback

### 未来改进

1. **支持更多货币**: 集成其他 API 补充 Frankfurter
2. **历史汇率**: 显示汇率趋势图
3. **汇率提醒**: 用户设置目标汇率，到达时通知
4. **离线支持**: Service Worker 缓存最近的汇率
