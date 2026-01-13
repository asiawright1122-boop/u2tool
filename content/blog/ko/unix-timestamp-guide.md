# Unix 타임스탬프 가이드: Epoch 시간 다루기

Unix 타임스탬프는 컴퓨팅에서 시간을 나타내는 보편적인 방법입니다. 이 가이드는 기본 개념부터 실용적인 응용 프로그램 및 2038년 문제까지 모든 것을 다룹니다.

## Unix 타임스탬프란?

Unix 타임스탬프(Epoch 시간 또는 POSIX 시간이라고도 함)는 1970년 1월 1일 00:00:00 UTC 이후 경과한 초 수입니다. 이 순간을 "Unix Epoch"라고 합니다.

```
Unix Epoch: 1970년 1월 1일 00:00:00 UTC
타임스탬프: 0

현재 시간 예시:
2025년 1월 13일 12:00:00 UTC
타임스탬프: 1736769600
```

## Unix 타임스탬프를 사용하는 이유

1. **보편적**: 시간대에 관계없이 동일한 값
2. **단순함**: 숫자일 뿐, 저장 및 비교가 쉬움
3. **컴팩트**: 날짜 문자열보다 적은 저장 공간
4. **정렬 가능**: 숫자 비교가 자연스럽게 작동
5. **언어 독립적**: 모든 프로그래밍 언어에서 작동

## 타임스탬프 변환

### JavaScript

```javascript
// 현재 타임스탬프 (초)
const timestamp = Math.floor(Date.now() / 1000);

// 타임스탬프를 Date로
const date = new Date(timestamp * 1000);

// Date를 타임스탬프로
const ts = Math.floor(new Date('2025-01-13').getTime() / 1000);

// 포맷팅
date.toISOString();  // "2025-01-13T00:00:00.000Z"
date.toLocaleString();  // 지역화된 형식
```

### Python

```python
import time
from datetime import datetime

# 현재 타임스탬프
timestamp = int(time.time())

# 타임스탬프를 datetime으로
dt = datetime.fromtimestamp(timestamp)

# datetime을 타임스탬프로
ts = int(datetime(2025, 1, 13).timestamp())

# 포맷팅
dt.strftime('%Y-%m-%d %H:%M:%S')
```


### PHP

```php
// 현재 타임스탬프
$timestamp = time();

// 타임스탬프를 날짜로
$date = date('Y-m-d H:i:s', $timestamp);

// 날짜를 타임스탬프로
$ts = strtotime('2025-01-13');
```

## 밀리초 타임스탬프

일부 시스템은 초 대신 밀리초를 사용합니다:

```javascript
// JavaScript는 밀리초를 사용
Date.now();  // 1736769600000

// 초로 변환
Math.floor(Date.now() / 1000);
```

## 시간대 고려사항

Unix 타임스탬프는 항상 UTC입니다. 표시를 위해 현지 시간으로 변환하세요.

## 일반적인 작업

### 시간 차이 계산

```javascript
const start = 1736769600;
const end = 1736856000;

const diffSeconds = end - start;
const diffMinutes = diffSeconds / 60;
const diffHours = diffMinutes / 60;
const diffDays = diffHours / 24;
```

### 시간 상수

| 단위 | 초 |
|------|-----|
| 분 | 60 |
| 시간 | 3,600 |
| 일 | 86,400 |
| 주 | 604,800 |

## 2038년 문제

32비트 시스템은 타임스탬프를 부호 있는 정수로 저장하며 최대값은 2,147,483,647입니다. 이는 2038년 1월 19일 03:14:07 UTC에 해당합니다.

### 해결책

1. **64비트 타임스탬프 사용**: 현대 시스템은 64비트 정수 사용
2. **레거시 시스템 업데이트**: 2038년 전에 마이그레이션
3. **대체 형식 사용**: 장기 저장을 위한 ISO 8601 문자열

## 결론

Unix 타임스탬프는 날짜와 시간을 다루는 모든 개발자에게 필수적입니다. 사용자에게 표시할 때 시간대를 고려하고, 미래 대비를 위해 64비트 정수를 사용하며, 항상 애플리케이션에서 타임스탬프 입력을 검증하세요.
