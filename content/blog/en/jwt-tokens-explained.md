# JWT Tokens Explained: Complete Guide to JSON Web Tokens

JSON Web Tokens (JWT) are the industry standard for secure authentication and information exchange. This guide covers JWT structure, how they work, security best practices, and practical implementation tips.

## What is JWT?

JWT (JSON Web Token) is an open standard (RFC 7519) for securely transmitting information between parties as a JSON object. JWTs are:

- **Compact**: Small size, suitable for URLs and HTTP headers
- **Self-contained**: Contains all necessary user information
- **Verifiable**: Digitally signed to ensure integrity

## JWT Structure

A JWT consists of three parts separated by dots:

```
xxxxx.yyyyy.zzzzz
Header.Payload.Signature
```

### 1. Header

Contains token type and signing algorithm:

```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

Common algorithms:
- **HS256**: HMAC with SHA-256 (symmetric)
- **RS256**: RSA with SHA-256 (asymmetric)
- **ES256**: ECDSA with SHA-256 (asymmetric)

### 2. Payload

Contains claims (statements about the user):

```json
{
  "sub": "1234567890",
  "name": "John Doe",
  "email": "john@example.com",
  "iat": 1516239022,
  "exp": 1516242622
}
```

#### Standard Claims

| Claim | Name | Description |
|-------|------|-------------|
| `iss` | Issuer | Who issued the token |
| `sub` | Subject | User identifier |
| `aud` | Audience | Intended recipient |
| `exp` | Expiration | When token expires |
| `nbf` | Not Before | When token becomes valid |
| `iat` | Issued At | When token was issued |
| `jti` | JWT ID | Unique token identifier |

### 3. Signature

Ensures token hasn't been tampered with:

```
HMACSHA256(
  base64UrlEncode(header) + "." +
  base64UrlEncode(payload),
  secret
)
```

## How JWT Authentication Works

### 1. User Login

```
Client                          Server
  |                               |
  |-- POST /login (credentials) ->|
  |                               |
  |<---- JWT Token ---------------|
  |                               |
```

### 2. Accessing Protected Resources

```
Client                          Server
  |                               |
  |-- GET /api/data ------------->|
  |   Authorization: Bearer JWT   |
  |                               |
  |<---- Protected Data ----------|
  |                               |
```

### 3. Token Verification

Server verifies:
1. Signature is valid
2. Token hasn't expired
3. Issuer and audience are correct

## JWT vs Session-Based Auth

| Feature | JWT | Session |
|---------|-----|---------|
| Storage | Client-side | Server-side |
| Scalability | Excellent | Requires session store |
| Stateless | Yes | No |
| Size | Larger | Small session ID |
| Revocation | Difficult | Easy |
| Cross-domain | Easy | Requires CORS setup |

## Security Best Practices

### 1. Use Strong Secrets

For HS256, use at least 256-bit random secrets:

```javascript
// Bad
const secret = "mysecret";

// Good
const secret = crypto.randomBytes(32).toString('hex');
```

### 2. Set Appropriate Expiration

Short-lived tokens reduce risk:

```javascript
const token = jwt.sign(payload, secret, {
  expiresIn: '15m'  // 15 minutes for access tokens
});
```

### 3. Use HTTPS Only

Always transmit JWTs over HTTPS to prevent interception.

### 4. Don't Store Sensitive Data

JWT payload is Base64 encoded, not encrypted:

```javascript
// Bad - sensitive data in payload
{
  "password": "secret123",
  "creditCard": "1234-5678-9012-3456"
}

// Good - only necessary identifiers
{
  "sub": "user123",
  "role": "admin"
}
```

### 5. Validate All Claims

Always verify:
- Signature
- Expiration (`exp`)
- Issuer (`iss`)
- Audience (`aud`)

### 6. Use Refresh Tokens

Implement token refresh for better security:

```
Access Token:  Short-lived (15 min)
Refresh Token: Long-lived (7 days), stored securely
```

## Common JWT Vulnerabilities

### 1. Algorithm Confusion

Attack: Changing algorithm from RS256 to HS256

Prevention: Always specify allowed algorithms:

```javascript
jwt.verify(token, secret, { algorithms: ['RS256'] });
```

### 2. None Algorithm

Attack: Setting algorithm to "none"

Prevention: Never accept "none" algorithm:

```javascript
jwt.verify(token, secret, { algorithms: ['HS256'] });
```

### 3. Weak Secrets

Attack: Brute-forcing weak secrets

Prevention: Use cryptographically strong secrets

### 4. Token Leakage

Attack: Stealing tokens from localStorage

Prevention: Use httpOnly cookies or secure storage

## Decoding JWT Tokens

### Using U2Tool JWT Decoder

[U2Tool JWT Decoder](https://www.u2tool.com/en/tools/jwt-decoder) offers:

- ✅ Instant JWT decoding
- ✅ Header and payload visualization
- ✅ Expiration time display
- ✅ Claim explanation
- ✅ No data sent to servers

### How to Use

1. Visit [JWT Decoder](https://www.u2tool.com/en/tools/jwt-decoder)
2. Paste your JWT token
3. View decoded header and payload
4. Check expiration and other claims

### Example Decoded Token

Input:
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```

Decoded Header:
```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

Decoded Payload:
```json
{
  "sub": "1234567890",
  "name": "John Doe",
  "iat": 1516239022
}
```

## Implementation Examples

### Node.js (jsonwebtoken)

```javascript
const jwt = require('jsonwebtoken');

// Create token
const token = jwt.sign(
  { userId: '123', role: 'admin' },
  process.env.JWT_SECRET,
  { expiresIn: '1h' }
);

// Verify token
try {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  console.log(decoded);
} catch (err) {
  console.error('Invalid token');
}
```

### Python (PyJWT)

```python
import jwt
from datetime import datetime, timedelta

# Create token
payload = {
    'user_id': '123',
    'exp': datetime.utcnow() + timedelta(hours=1)
}
token = jwt.encode(payload, 'secret', algorithm='HS256')

# Verify token
try:
    decoded = jwt.decode(token, 'secret', algorithms=['HS256'])
    print(decoded)
except jwt.ExpiredSignatureError:
    print('Token expired')
```

## FAQ

### Can JWT be decoded without the secret?

Yes, the header and payload are only Base64 encoded, not encrypted. Anyone can decode and read them. The secret is only used to verify the signature, not to encrypt the content. Never put sensitive data in JWT payload.

### How do I invalidate a JWT?

JWTs are stateless, so you can't directly invalidate them. Options include:
- Short expiration times
- Token blacklist (requires server-side storage)
- Refresh token rotation
- Changing the signing secret (invalidates all tokens)

### Should I store JWT in localStorage or cookies?

Both have trade-offs:
- **localStorage**: Vulnerable to XSS attacks
- **Cookies**: Vulnerable to CSRF attacks (use httpOnly and SameSite flags)

For most applications, httpOnly cookies with proper CSRF protection are recommended.

### What happens when a JWT expires?

The server will reject the token with a 401 Unauthorized response. The client should:
1. Use a refresh token to get a new access token
2. Or redirect the user to login again

### Is JWT suitable for all applications?

JWT works well for:
- Stateless APIs
- Microservices
- Single Sign-On (SSO)
- Mobile applications

Consider session-based auth for:
- Applications requiring immediate token revocation
- Simple server-rendered applications
- When token size is a concern

## Conclusion

JWT is a powerful tool for authentication and authorization. Use [U2Tool JWT Decoder](https://www.u2tool.com/en/tools/jwt-decoder) to inspect and debug your tokens during development. Always follow security best practices to protect your users.

Key takeaways:
- Keep tokens short-lived
- Never store sensitive data in payload
- Always validate signatures and claims
- Use HTTPS for all token transmission
- Implement proper token refresh mechanisms
