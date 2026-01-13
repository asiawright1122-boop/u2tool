# JWT 令牌详解：JSON Web Token 完整指南

JSON Web Token（JWT）是安全认证和信息交换的行业标准。本指南涵盖 JWT 结构、工作原理、安全最佳实践和实际实现技巧。

## 什么是 JWT？

JWT（JSON Web Token）是一种开放标准（RFC 7519），用于在各方之间安全地传输 JSON 对象形式的信息。JWT 具有以下特点：

- **紧凑**：体积小，适合 URL 和 HTTP 头部
- **自包含**：包含所有必要的用户信息
- **可验证**：数字签名确保完整性

## JWT 结构

JWT 由三部分组成，用点号分隔：

```
xxxxx.yyyyy.zzzzz
Header.Payload.Signature
头部.载荷.签名
```

### 1. 头部（Header）

包含令牌类型和签名算法：

```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

常用算法：
- **HS256**：HMAC SHA-256（对称加密）
- **RS256**：RSA SHA-256（非对称加密）
- **ES256**：ECDSA SHA-256（非对称加密）

### 2. 载荷（Payload）

包含声明（关于用户的陈述）：

```json
{
  "sub": "1234567890",
  "name": "张三",
  "email": "zhangsan@example.com",
  "iat": 1516239022,
  "exp": 1516242622
}
```

#### 标准声明

| 声明 | 名称 | 描述 |
|------|------|------|
| `iss` | 签发者 | 谁签发的令牌 |
| `sub` | 主题 | 用户标识符 |
| `aud` | 受众 | 预期接收者 |
| `exp` | 过期时间 | 令牌何时过期 |
| `nbf` | 生效时间 | 令牌何时生效 |
| `iat` | 签发时间 | 令牌何时签发 |
| `jti` | JWT ID | 唯一令牌标识符 |

### 3. 签名（Signature）

确保令牌未被篡改：

```
HMACSHA256(
  base64UrlEncode(header) + "." +
  base64UrlEncode(payload),
  secret
)
```

## JWT 认证工作流程

### 1. 用户登录

```
客户端                          服务器
  |                               |
  |-- POST /login (凭据) -------->|
  |                               |
  |<---- JWT 令牌 ----------------|
  |                               |
```

### 2. 访问受保护资源

```
客户端                          服务器
  |                               |
  |-- GET /api/data ------------->|
  |   Authorization: Bearer JWT   |
  |                               |
  |<---- 受保护数据 --------------|
  |                               |
```

### 3. 令牌验证

服务器验证：
1. 签名是否有效
2. 令牌是否过期
3. 签发者和受众是否正确

## JWT vs 基于会话的认证

| 特性 | JWT | 会话 |
|------|-----|------|
| 存储位置 | 客户端 | 服务器端 |
| 可扩展性 | 优秀 | 需要会话存储 |
| 无状态 | 是 | 否 |
| 大小 | 较大 | 小（会话 ID） |
| 撤销 | 困难 | 容易 |
| 跨域 | 容易 | 需要 CORS 配置 |

## 安全最佳实践

### 1. 使用强密钥

对于 HS256，使用至少 256 位随机密钥：

```javascript
// 不好
const secret = "mysecret";

// 好
const secret = crypto.randomBytes(32).toString('hex');
```

### 2. 设置适当的过期时间

短期令牌降低风险：

```javascript
const token = jwt.sign(payload, secret, {
  expiresIn: '15m'  // 访问令牌 15 分钟
});
```

### 3. 仅使用 HTTPS

始终通过 HTTPS 传输 JWT 以防止拦截。

### 4. 不要存储敏感数据

JWT 载荷是 Base64 编码的，不是加密的：

```javascript
// 不好 - 载荷中有敏感数据
{
  "password": "secret123",
  "creditCard": "1234-5678-9012-3456"
}

// 好 - 只有必要的标识符
{
  "sub": "user123",
  "role": "admin"
}
```

### 5. 验证所有声明

始终验证：
- 签名
- 过期时间（`exp`）
- 签发者（`iss`）
- 受众（`aud`）

### 6. 使用刷新令牌

实现令牌刷新以提高安全性：

```
访问令牌：短期（15 分钟）
刷新令牌：长期（7 天），安全存储
```

## 常见 JWT 漏洞

### 1. 算法混淆攻击

攻击：将算法从 RS256 改为 HS256

防御：始终指定允许的算法：

```javascript
jwt.verify(token, secret, { algorithms: ['RS256'] });
```

### 2. None 算法攻击

攻击：将算法设置为 "none"

防御：永不接受 "none" 算法：

```javascript
jwt.verify(token, secret, { algorithms: ['HS256'] });
```

### 3. 弱密钥

攻击：暴力破解弱密钥

防御：使用加密强度高的密钥

### 4. 令牌泄露

攻击：从 localStorage 窃取令牌

防御：使用 httpOnly cookie 或安全存储

## 解码 JWT 令牌

### 使用 U2Tool JWT 解码器

[U2Tool JWT 解码器](https://www.u2tool.com/zh/tools/jwt-decoder) 提供：

- ✅ 即时 JWT 解码
- ✅ 头部和载荷可视化
- ✅ 过期时间显示
- ✅ 声明解释
- ✅ 数据不发送到服务器

### 使用方法

1. 访问 [JWT 解码器](https://www.u2tool.com/zh/tools/jwt-decoder)
2. 粘贴 JWT 令牌
3. 查看解码后的头部和载荷
4. 检查过期时间和其他声明

### 解码示例

输入：
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IuW8oOS4iSIsImlhdCI6MTUxNjIzOTAyMn0.xxx
```

解码后的头部：
```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

解码后的载荷：
```json
{
  "sub": "1234567890",
  "name": "张三",
  "iat": 1516239022
}
```

## 实现示例

### Node.js (jsonwebtoken)

```javascript
const jwt = require('jsonwebtoken');

// 创建令牌
const token = jwt.sign(
  { userId: '123', role: 'admin' },
  process.env.JWT_SECRET,
  { expiresIn: '1h' }
);

// 验证令牌
try {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  console.log(decoded);
} catch (err) {
  console.error('无效令牌');
}
```

### Python (PyJWT)

```python
import jwt
from datetime import datetime, timedelta

# 创建令牌
payload = {
    'user_id': '123',
    'exp': datetime.utcnow() + timedelta(hours=1)
}
token = jwt.encode(payload, 'secret', algorithm='HS256')

# 验证令牌
try:
    decoded = jwt.decode(token, 'secret', algorithms=['HS256'])
    print(decoded)
except jwt.ExpiredSignatureError:
    print('令牌已过期')
```

## 常见问题

### 没有密钥可以解码 JWT 吗？

可以，头部和载荷只是 Base64 编码，不是加密的。任何人都可以解码和读取它们。密钥只用于验证签名，不是用于加密内容。永远不要在 JWT 载荷中放置敏感数据。

### 如何使 JWT 失效？

JWT 是无状态的，所以不能直接使其失效。选项包括：
- 短过期时间
- 令牌黑名单（需要服务器端存储）
- 刷新令牌轮换
- 更改签名密钥（使所有令牌失效）

### 应该将 JWT 存储在 localStorage 还是 cookie 中？

两者都有权衡：
- **localStorage**：容易受到 XSS 攻击
- **Cookies**：容易受到 CSRF 攻击（使用 httpOnly 和 SameSite 标志）

对于大多数应用程序，建议使用带有适当 CSRF 保护的 httpOnly cookie。

### JWT 过期后会发生什么？

服务器将以 401 未授权响应拒绝令牌。客户端应该：
1. 使用刷新令牌获取新的访问令牌
2. 或将用户重定向到登录页面

### JWT 适合所有应用程序吗？

JWT 适合：
- 无状态 API
- 微服务
- 单点登录（SSO）
- 移动应用程序

考虑基于会话的认证：
- 需要立即撤销令牌的应用程序
- 简单的服务器渲染应用程序
- 令牌大小是问题时

## 总结

JWT 是认证和授权的强大工具。在开发过程中使用 [U2Tool JWT 解码器](https://www.u2tool.com/zh/tools/jwt-decoder) 检查和调试令牌。始终遵循安全最佳实践以保护用户。

关键要点：
- 保持令牌短期有效
- 永远不要在载荷中存储敏感数据
- 始终验证签名和声明
- 所有令牌传输使用 HTTPS
- 实现适当的令牌刷新机制
