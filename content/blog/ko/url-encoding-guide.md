# URL 인코딩 가이드: 알아야 할 모든 것

URL 인코딩(퍼센트 인코딩이라고도 함)은 웹 개발에 필수적입니다. 이 가이드는 URL에 인코딩이 필요한 이유, 작동 방식 및 피해야 할 일반적인 함정을 설명합니다.

## URL 인코딩이 존재하는 이유

URL은 ASCII 문자 집합의 제한된 문자만 포함할 수 있습니다. URL에 특수 문자, 공백 또는 비ASCII 문자를 포함해야 할 때 인코딩해야 합니다.

### 예약 문자

이 문자들은 URL에서 특별한 의미를 가집니다:

| 문자 | 용도 | 인코딩 |
|------|------|--------|
| : | 프로토콜 구분자 | %3A |
| / | 경로 구분자 | %2F |
| ? | 쿼리 문자열 시작 | %3F |
| # | 프래그먼트 식별자 | %23 |
| & | 매개변수 구분자 | %26 |
| = | 키-값 구분자 | %3D |
| @ | 사용자 정보 구분자 | %40 |
| + | 공백 (폼에서) | %2B |

### 안전하지 않은 문자

이 문자들은 항상 인코딩해야 합니다:

| 문자 | 인코딩 | 이유 |
|------|--------|------|
| 공백 | %20 또는 + | URL에서 허용되지 않음 |
| " | %22 | 구분자 |
| < | %3C | 안전하지 않음 |
| > | %3E | 안전하지 않음 |

## URL 인코딩 작동 방식

URL 인코딩은 문자를 퍼센트 기호가 앞에 붙은 16진수 ASCII 값으로 변환합니다:

```
문자 → ASCII 코드 → 16진수 값 → %16진수값

공백 → 32 → 20 → %20
! → 33 → 21 → %21
@ → 64 → 40 → %40
```


### 비ASCII 문자 인코딩

비ASCII 문자(중국어, 아랍어, 이모지 등)는 먼저 UTF-8 바이트로 변환된 다음 각 바이트가 퍼센트 인코딩됩니다:

```
中 → UTF-8: E4 B8 AD → %E4%B8%AD
🎉 → UTF-8: F0 9F 8E 89 → %F0%9F%8E%89
```

## JavaScript 인코딩 함수

### encodeURI vs encodeURIComponent

```javascript
const url = 'https://example.com/path?name=John Doe&city=서울';

// encodeURI - 전체 URL 인코딩, URL 구조 유지
encodeURI(url);

// encodeURIComponent - 모든 것 인코딩, URL 부분용
encodeURIComponent(url);
```

### 각각 언제 사용할지

| 함수 | 사용 사례 |
|------|-----------|
| `encodeURI` | 전체 URL 인코딩 |
| `encodeURIComponent` | URL 매개변수 인코딩 |
| `URLSearchParams` | 쿼리 문자열 구축 |

## 일반적인 실수

### 1. 이중 인코딩

```javascript
// 잘못됨 - 두 번 인코딩
const param = encodeURIComponent('hello world');
const url = encodeURI(`https://example.com?q=${param}`);

// 올바름
const url = `https://example.com?q=${encodeURIComponent('hello world')}`;
```

### 2. 사용자 입력 인코딩 안 함

```javascript
// 위험 - XSS 취약점
const url = `https://example.com/search?q=${userInput}`;

// 안전
const url = `https://example.com/search?q=${encodeURIComponent(userInput)}`;
```

## 모범 사례

1. **항상 사용자 입력 인코딩** URL에 포함하기 전에
2. **쿼리 매개변수에 `encodeURIComponent` 사용**
3. **전체 URL에만 `encodeURI` 사용**
4. **쿼리 문자열 구축에 `URLSearchParams` 선호**
5. **처리 전 서버에서 디코딩**

## 결론

URL 인코딩은 모든 개발자가 이해해야 하는 기본적인 웹 개념입니다. 적절한 인코딩은 버그, 보안 취약점을 방지하고 애플리케이션이 국제 문자와 올바르게 작동하도록 보장합니다.
