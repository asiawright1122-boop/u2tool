# Unix 时间戳指南：使用 Epoch 时间

Unix 时间戳是计算中表示时间的通用方式。本指南涵盖从基本概念到实际应用以及 2038 年问题的所有内容。

## 什么是 Unix 时间戳？

Unix 时间戳（也称为 Epoch 时间或 POSIX 时间）是自 1970 年 1 月 1 日 00:00:00 UTC 以来经过的秒数。这一时刻被称为"Unix 纪元"。

```
Unix 纪元：1970 年 1 月 1 日 00:00:00 UTC
时间戳：0

当前时间示例：
2025 年 1 月 13 日 12:00:00 UTC
时间戳：1736769600
```

## 为什么使用 Unix 时间戳？

1. **通用性**：无论时区如何，值都相同
2. **简单**：只是一个数字，易于存储和比较
3. **紧凑**：比日期字符串占用更少存储空间
4. **可排序**：数值比较自然有效
5. **语言无关**：在任何编程语言中都能工作

## 转换时间戳

### JavaScript

```javascript
// 当前时间戳（秒）
const timestamp = Math.floor(Date.now() / 1000);

// 时间戳转日期
const date = new Date(timestamp * 1000);

// 日期转时间戳
const ts = Math.floor(new Date('2025-01-13').getTime() / 1000);

// 格式化
date.toISOString();  // "2025-01-13T00:00:00.000Z"
date.toLocaleString('zh-CN');  // 本地化格式
```

### Python

```python
import time
from datetime import datetime

# 当前时间戳
timestamp = int(time.time())

# 时间戳转 datetime
dt = datetime.fromtimestamp(timestamp)

# datetime 转时间戳
ts = int(datetime(2025, 1, 13).timestamp())

# 格式化
dt.strftime('%Y-%m-%d %H:%M:%S')
```

### PHP

```php
// 当前时间戳
$timestamp = time();

// 时间戳转日期
$date = date('Y-m-d H:i:s', $timestamp);

// 日期转时间戳
$ts = strtotime('2025-01-13');

// DateTime 对象
$dt = new DateTime('@' . $timestamp);
```

### Bash

```bash
# 当前时间戳
date +%s

# 时间戳转日期
date -d @1736769600

# 日期转时间戳
date -d "2025-01-13" +%s
```

## 毫秒时间戳

某些系统使用毫秒而不是秒：

```javascript
// JavaScript 使用毫秒
Date.now();  // 1736769600000

// 转换为秒
Math.floor(Date.now() / 1000);

// 秒转换为毫秒
timestamp * 1000;
```

## 时区考虑

Unix 时间戳始终是 UTC。显示时转换为本地时间：

```javascript
const timestamp = 1736769600;
const date = new Date(timestamp * 1000);

// UTC 时间
date.toUTCString();  // "Mon, 13 Jan 2025 12:00:00 GMT"

// 本地时间（取决于系统时区）
date.toLocaleString('zh-CN');  // "2025/1/13 20:00:00"（北京时间）

// 指定时区
date.toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' });
```

## 常见操作

### 计算时间差

```javascript
const start = 1736769600;
const end = 1736856000;

const diffSeconds = end - start;
const diffMinutes = diffSeconds / 60;
const diffHours = diffMinutes / 60;
const diffDays = diffHours / 24;
```

### 加减时间

```javascript
const timestamp = 1736769600;

// 加 1 小时
const plusHour = timestamp + 3600;

// 加 1 天
const plusDay = timestamp + 86400;

// 加 1 周
const plusWeek = timestamp + 604800;
```

### 时间常量

| 单位 | 秒数 |
|------|------|
| 分钟 | 60 |
| 小时 | 3,600 |
| 天 | 86,400 |
| 周 | 604,800 |
| 月（30 天）| 2,592,000 |
| 年（365 天）| 31,536,000 |

## 2038 年问题

32 位系统将时间戳存储为有符号整数，最大值为 2,147,483,647。这对应于：

```
2038 年 1 月 19 日 03:14:07 UTC
```

在此时刻之后，32 位时间戳将溢出并变为负数，可能导致系统故障。

### 解决方案

1. **使用 64 位时间戳**：现代系统使用 64 位整数
2. **更新遗留系统**：在 2038 年之前迁移
3. **使用替代格式**：长期存储使用 ISO 8601 字符串

## 最佳实践

### 存储

```sql
-- 数据库：使用适当的整数类型
CREATE TABLE events (
    id INT PRIMARY KEY,
    created_at BIGINT,  -- 64 位以面向未来
    event_name VARCHAR(255)
);
```

### API 设计

```json
{
  "created_at": 1736769600,
  "created_at_iso": "2025-01-13T12:00:00Z"
}
```

同时提供两种格式以增加灵活性。

### 验证

```javascript
function isValidTimestamp(ts) {
  // 检查合理范围（1970 到 2100）
  return ts >= 0 && ts <= 4102444800;
}
```

## 调试技巧

### 识别时间戳格式

```javascript
const value = 1736769600000;

if (value > 1e12) {
  console.log('毫秒');
} else if (value > 1e9) {
  console.log('秒');
} else {
  console.log('未知格式');
}
```

### 快速参考时间戳

| 日期 | 时间戳 |
|------|--------|
| 2000-01-01 | 946684800 |
| 2010-01-01 | 1262304000 |
| 2020-01-01 | 1577836800 |
| 2025-01-01 | 1735689600 |
| 2030-01-01 | 1893456000 |

## 总结

Unix 时间戳对于任何处理日期和时间的开发者都是必不可少的。它们提供了一种简单、通用的方式来表示时间点。记住在向用户显示时考虑时区，使用 64 位整数以面向未来，并始终验证应用程序中的时间戳输入。
