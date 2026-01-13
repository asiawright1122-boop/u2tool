# URL Encoding Guide: Everything You Need to Know

URL encoding (also called percent-encoding) is essential for web development. This guide explains why URLs need encoding, how it works, and common pitfalls to avoid.

## Why URL Encoding Exists

URLs can only contain a limited set of characters from the ASCII character set. When you need to include special characters, spaces, or non-ASCII characters in a URL, they must be encoded.

### Reserved Characters

These characters have special meaning in URLs:

| Character | Purpose | Encoded |
|-----------|---------|---------|
| : | Protocol separator | %3A |
| / | Path separator | %2F |
| ? | Query string start | %3F |
| # | Fragment identifier | %23 |
| & | Parameter separator | %26 |
| = | Key-value separator | %3D |
| @ | User info separator | %40 |
| + | Space (in forms) | %2B |

### Unsafe Characters

These characters must always be encoded:

| Character | Encoded | Reason |
|-----------|---------|--------|
| Space | %20 or + | Not allowed in URLs |
| " | %22 | Delimiter |
| < | %3C | Unsafe |
| > | %3E | Unsafe |
| { | %7B | Unsafe |
| } | %7D | Unsafe |
| | | %7C | Unsafe |
| \ | %5C | Unsafe |
| ^ | %5E | Unsafe |

## How URL Encoding Works

URL encoding converts characters to their hexadecimal ASCII values preceded by a percent sign:

```
Character → ASCII Code → Hex Value → %HexValue

Space → 32 → 20 → %20
! → 33 → 21 → %21
@ → 64 → 40 → %40
```

### Encoding Non-ASCII Characters

Non-ASCII characters (like Chinese, Arabic, emoji) are first converted to UTF-8 bytes, then each byte is percent-encoded:

```
中 → UTF-8: E4 B8 AD → %E4%B8%AD
🎉 → UTF-8: F0 9F 8E 89 → %F0%9F%8E%89
```

## URL Components and Encoding

Different parts of a URL have different encoding rules:

```
https://user:pass@example.com:8080/path/to/page?query=value#section
└─┬──┘ └───┬───┘ └────┬────┘└─┬─┘└────┬─────┘└────┬─────┘└──┬───┘
scheme  userinfo    host    port    path       query     fragment
```

### Path Encoding

```javascript
// JavaScript
encodeURIComponent('hello world/file.txt')
// Result: "hello%20world%2Ffile.txt"
```

### Query String Encoding

```javascript
// Encoding query parameters
const params = new URLSearchParams({
  name: 'John Doe',
  city: '北京',
  emoji: '🎉'
});
console.log(params.toString());
// Result: "name=John+Doe&city=%E5%8C%97%E4%BA%AC&emoji=%F0%9F%8E%89"
```

## JavaScript Encoding Functions

### encodeURI vs encodeURIComponent

```javascript
const url = 'https://example.com/path?name=John Doe&city=北京';

// encodeURI - encodes full URL, preserves URL structure
encodeURI(url);
// "https://example.com/path?name=John%20Doe&city=%E5%8C%97%E4%BA%AC"

// encodeURIComponent - encodes everything, for URL parts
encodeURIComponent(url);
// "https%3A%2F%2Fexample.com%2Fpath%3Fname%3DJohn%20Doe%26city%3D%E5%8C%97%E4%BA%AC"
```

### When to Use Each

| Function | Use Case |
|----------|----------|
| `encodeURI` | Encoding a complete URL |
| `encodeURIComponent` | Encoding URL parameters |
| `URLSearchParams` | Building query strings |

## Common Mistakes

### 1. Double Encoding

```javascript
// Wrong - encoding twice
const param = encodeURIComponent('hello world');
const url = encodeURI(`https://example.com?q=${param}`);
// Results in %2520 instead of %20

// Correct
const url = `https://example.com?q=${encodeURIComponent('hello world')}`;
```

### 2. Not Encoding User Input

```javascript
// Dangerous - XSS vulnerability
const url = `https://example.com/search?q=${userInput}`;

// Safe
const url = `https://example.com/search?q=${encodeURIComponent(userInput)}`;
```

### 3. Encoding the Entire URL

```javascript
// Wrong
const fullUrl = encodeURIComponent('https://example.com/path?q=test');

// Correct - only encode the dynamic parts
const baseUrl = 'https://example.com/path';
const query = encodeURIComponent('test');
const fullUrl = `${baseUrl}?q=${query}`;
```

## Decoding URLs

```javascript
// Decode URI component
decodeURIComponent('%E5%8C%97%E4%BA%AC'); // "北京"

// Decode full URI
decodeURI('https://example.com/path%20name'); // "https://example.com/path name"
```

## Server-Side Encoding

### Python

```python
from urllib.parse import quote, quote_plus, urlencode

# Encode path component
quote('hello world')  # 'hello%20world'

# Encode query parameter (space as +)
quote_plus('hello world')  # 'hello+world'

# Build query string
urlencode({'name': 'John', 'city': '北京'})
# 'name=John&city=%E5%8C%97%E4%BA%AC'
```

### PHP

```php
// Encode URL component
urlencode('hello world');  // "hello+world"
rawurlencode('hello world');  // "hello%20world"

// Build query string
http_build_query(['name' => 'John', 'city' => '北京']);
```

## Best Practices

1. **Always encode user input** before including in URLs
2. **Use `encodeURIComponent`** for query parameters
3. **Use `encodeURI`** only for complete URLs
4. **Prefer `URLSearchParams`** for building query strings
5. **Decode on the server** before processing
6. **Test with special characters** including Unicode and emoji

## Conclusion

URL encoding is a fundamental web concept that every developer should understand. Proper encoding prevents bugs, security vulnerabilities, and ensures your applications work correctly with international characters. Use the right encoding function for each situation, and always encode user-provided data.
