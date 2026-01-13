# URL 编码指南：你需要知道的一切

URL 编码（也称为百分号编码）对 Web 开发至关重要。本指南解释为什么 URL 需要编码、它是如何工作的，以及常见的陷阱。

## 为什么需要 URL 编码

URL 只能包含 ASCII 字符集中的有限字符。当你需要在 URL 中包含特殊字符、空格或非 ASCII 字符时，必须对它们进行编码。

### 保留字符

这些字符在 URL 中有特殊含义：

| 字符 | 用途 | 编码后 |
|------|------|--------|
| : | 协议分隔符 | %3A |
| / | 路径分隔符 | %2F |
| ? | 查询字符串开始 | %3F |
| # | 片段标识符 | %23 |
| & | 参数分隔符 | %26 |
| = | 键值分隔符 | %3D |
| @ | 用户信息分隔符 | %40 |
| + | 空格（在表单中）| %2B |

### 不安全字符

这些字符必须始终编码：

| 字符 | 编码后 | 原因 |
|------|--------|------|
| 空格 | %20 或 + | URL 中不允许 |
| " | %22 | 分隔符 |
| < | %3C | 不安全 |
| > | %3E | 不安全 |
| { | %7B | 不安全 |
| } | %7D | 不安全 |

## URL 编码工作原理

URL 编码将字符转换为其十六进制 ASCII 值，前面加上百分号：

```
字符 → ASCII 码 → 十六进制值 → %十六进制值

空格 → 32 → 20 → %20
! → 33 → 21 → %21
@ → 64 → 40 → %40
```

### 编码非 ASCII 字符

非 ASCII 字符（如中文、阿拉伯文、表情符号）首先转换为 UTF-8 字节，然后每个字节进行百分号编码：

```
中 → UTF-8: E4 B8 AD → %E4%B8%AD
🎉 → UTF-8: F0 9F 8E 89 → %F0%9F%8E%89
```

## URL 组件和编码

URL 的不同部分有不同的编码规则：

```
https://user:pass@example.com:8080/path/to/page?query=value#section
└─┬──┘ └───┬───┘ └────┬────┘└─┬─┘└────┬─────┘└────┬─────┘└──┬───┘
协议    用户信息     主机    端口     路径        查询      片段
```

### 路径编码

```javascript
// JavaScript
encodeURIComponent('hello world/file.txt')
// 结果："hello%20world%2Ffile.txt"
```

### 查询字符串编码

```javascript
// 编码查询参数
const params = new URLSearchParams({
  name: '张三',
  city: '北京',
  emoji: '🎉'
});
console.log(params.toString());
// 结果："name=%E5%BC%A0%E4%B8%89&city=%E5%8C%97%E4%BA%AC&emoji=%F0%9F%8E%89"
```

## JavaScript 编码函数

### encodeURI vs encodeURIComponent

```javascript
const url = 'https://example.com/path?name=张三&city=北京';

// encodeURI - 编码完整 URL，保留 URL 结构
encodeURI(url);
// "https://example.com/path?name=%E5%BC%A0%E4%B8%89&city=%E5%8C%97%E4%BA%AC"

// encodeURIComponent - 编码所有内容，用于 URL 部分
encodeURIComponent(url);
// "https%3A%2F%2Fexample.com%2Fpath%3Fname%3D%E5%BC%A0%E4%B8%89%26city%3D%E5%8C%97%E4%BA%AC"
```

### 何时使用

| 函数 | 用例 |
|------|------|
| `encodeURI` | 编码完整 URL |
| `encodeURIComponent` | 编码 URL 参数 |
| `URLSearchParams` | 构建查询字符串 |

## 常见错误

### 1. 双重编码

```javascript
// 错误 - 编码两次
const param = encodeURIComponent('hello world');
const url = encodeURI(`https://example.com?q=${param}`);
// 结果是 %2520 而不是 %20

// 正确
const url = `https://example.com?q=${encodeURIComponent('hello world')}`;
```

### 2. 不编码用户输入

```javascript
// 危险 - XSS 漏洞
const url = `https://example.com/search?q=${userInput}`;

// 安全
const url = `https://example.com/search?q=${encodeURIComponent(userInput)}`;
```

### 3. 编码整个 URL

```javascript
// 错误
const fullUrl = encodeURIComponent('https://example.com/path?q=test');

// 正确 - 只编码动态部分
const baseUrl = 'https://example.com/path';
const query = encodeURIComponent('test');
const fullUrl = `${baseUrl}?q=${query}`;
```

## 解码 URL

```javascript
// 解码 URI 组件
decodeURIComponent('%E5%8C%97%E4%BA%AC'); // "北京"

// 解码完整 URI
decodeURI('https://example.com/path%20name'); // "https://example.com/path name"
```

## 服务端编码

### Python

```python
from urllib.parse import quote, quote_plus, urlencode

# 编码路径组件
quote('hello world')  # 'hello%20world'

# 编码查询参数（空格为 +）
quote_plus('hello world')  # 'hello+world'

# 构建查询字符串
urlencode({'name': '张三', 'city': '北京'})
# 'name=%E5%BC%A0%E4%B8%89&city=%E5%8C%97%E4%BA%AC'
```

### PHP

```php
// 编码 URL 组件
urlencode('hello world');  // "hello+world"
rawurlencode('hello world');  // "hello%20world"

// 构建查询字符串
http_build_query(['name' => '张三', 'city' => '北京']);
```

## 最佳实践

1. **始终编码用户输入** 再包含到 URL 中
2. **使用 `encodeURIComponent`** 处理查询参数
3. **仅对完整 URL 使用 `encodeURI`**
4. **优先使用 `URLSearchParams`** 构建查询字符串
5. **在服务器端解码** 再处理
6. **使用特殊字符测试** 包括 Unicode 和表情符号

## 总结

URL 编码是每个开发者都应该理解的基本 Web 概念。正确的编码可以防止 bug、安全漏洞，并确保你的应用程序能正确处理国际字符。针对每种情况使用正确的编码函数，并始终编码用户提供的数据。
