# JWT 토큰 완벽 해설: JSON Web Token 가이드

JSON Web Token(JWT)은 안전한 인증과 정보 교환을 위한 업계 표준입니다. 이 가이드에서는 JWT 구조, 작동 방식, 보안 모범 사례, 구현 팁을 설명합니다.

## JWT란?

JWT(JSON Web Token)는 당사자 간에 정보를 JSON 객체로 안전하게 전송하기 위한 개방형 표준(RFC 7519)입니다. JWT의 특징:

- **컴팩트**: 작은 크기, URL과 HTTP 헤더에 적합
- **자체 포함**: 필요한 모든 사용자 정보 포함
- **검증 가능**: 디지털 서명으로 무결성 보장

## JWT 구조

JWT는 점으로 구분된 세 부분으로 구성됩니다:

```
xxxxx.yyyyy.zzzzz
헤더.페이로드.서명
```

### 1. 헤더

토큰 유형과 서명 알고리즘 포함:

```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

### 2. 페이로드

클레임(사용자에 대한 진술) 포함:

```json
{
  "sub": "1234567890",
  "name": "홍길동",
  "email": "hong@example.com",
  "iat": 1516239022,
  "exp": 1516242622
}
```

### 3. 서명

토큰이 변조되지 않았음을 보장:

```
HMACSHA256(
  base64UrlEncode(header) + "." +
  base64UrlEncode(payload),
  secret
)
```

## 보안 모범 사례

### 1. 강력한 시크릿 사용

HS256의 경우 최소 256비트 랜덤 시크릿 사용:

```javascript
// 나쁜 예
const secret = "mysecret";

// 좋은 예
const secret = crypto.randomBytes(32).toString('hex');
```

### 2. 적절한 만료 시간 설정

짧은 수명의 토큰으로 위험 감소:

```javascript
const token = jwt.sign(payload, secret, {
  expiresIn: '15m'  // 액세스 토큰은 15분
});
```


### 3. HTTPS만 사용

가로채기를 방지하기 위해 항상 HTTPS를 통해 JWT 전송.

### 4. 민감한 데이터 저장 금지

JWT 페이로드는 Base64 인코딩만 되어 있고 암호화되지 않음:

```javascript
// 나쁜 예 - 페이로드에 민감한 데이터
{
  "password": "secret123",
  "creditCard": "1234-5678-9012-3456"
}

// 좋은 예 - 필요한 식별자만
{
  "sub": "user123",
  "role": "admin"
}
```

### 5. 리프레시 토큰 사용

더 나은 보안을 위해 토큰 리프레시 구현:

```
액세스 토큰: 짧은 수명(15분)
리프레시 토큰: 긴 수명(7일), 안전하게 저장
```

## JWT 디코딩

### U2Tool JWT 디코더 사용

[U2Tool JWT 디코더](https://www.u2tool.com/ko/tools/jwt-decoder)의 특징:

- ✅ 즉시 JWT 디코딩
- ✅ 헤더와 페이로드 시각화
- ✅ 만료 시간 표시
- ✅ 클레임 설명
- ✅ 서버에 데이터 전송 안 함

### 사용 방법

1. [JWT 디코더](https://www.u2tool.com/ko/tools/jwt-decoder) 방문
2. JWT 토큰 붙여넣기
3. 디코딩된 헤더와 페이로드 확인
4. 만료 및 기타 클레임 확인

## 구현 예제

### Node.js (jsonwebtoken)

```javascript
const jwt = require('jsonwebtoken');

// 토큰 생성
const token = jwt.sign(
  { userId: '123', role: 'admin' },
  process.env.JWT_SECRET,
  { expiresIn: '1h' }
);

// 토큰 검증
try {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  console.log(decoded);
} catch (err) {
  console.error('유효하지 않은 토큰');
}
```

## FAQ

### 시크릿 없이 JWT를 디코딩할 수 있나요?

예, 헤더와 페이로드는 Base64 인코딩만 되어 있고 암호화되지 않습니다. 누구나 디코딩하여 읽을 수 있습니다. 시크릿은 서명 검증에만 사용되며 콘텐츠 암호화에는 사용되지 않습니다. JWT 페이로드에 민감한 데이터를 넣지 마세요.

### JWT를 무효화하려면?

JWT는 상태 비저장이므로 직접 무효화할 수 없습니다. 옵션:
- 짧은 만료 시간
- 토큰 블랙리스트(서버 측 저장소 필요)
- 리프레시 토큰 로테이션
- 서명 시크릿 변경(모든 토큰 무효화)

### JWT는 localStorage와 Cookie 중 어디에 저장해야 하나요?

둘 다 트레이드오프가 있습니다:
- **localStorage**: XSS 공격에 취약
- **Cookie**: CSRF 공격에 취약(httpOnly와 SameSite 플래그 사용)

대부분의 애플리케이션에서는 적절한 CSRF 보호가 있는 httpOnly Cookie가 권장됩니다.

## 결론

JWT는 인증과 권한 부여를 위한 강력한 도구입니다. 개발 중 토큰을 검사하고 디버그하려면 [U2Tool JWT 디코더](https://www.u2tool.com/ko/tools/jwt-decoder)를 사용하세요. 사용자를 보호하기 위해 항상 보안 모범 사례를 따르세요.

핵심 포인트:
- 토큰은 짧은 수명으로 유지
- 페이로드에 민감한 데이터 저장 금지
- 항상 서명과 클레임 검증
- 모든 토큰 전송에 HTTPS 사용
- 적절한 토큰 리프레시 메커니즘 구현
