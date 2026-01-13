# Regular Expressions Complete Guide: From Beginner to Expert

Regular expressions (regex) are powerful pattern-matching tools used in programming, text processing, and data validation. This comprehensive guide covers everything from basic syntax to advanced techniques, with practical examples and recommended tools.

## What Are Regular Expressions?

A regular expression is a sequence of characters that defines a search pattern. It's used for:

- **Text searching**: Find specific patterns in strings
- **Validation**: Check if input matches expected format (emails, phones, etc.)
- **Text replacement**: Find and replace patterns
- **Data extraction**: Pull specific information from text

## Basic Regex Syntax

### Literal Characters

The simplest regex matches exact characters:

```
Pattern: hello
Matches: "hello" in "hello world"
```

### Metacharacters

Special characters with specific meanings:

| Character | Meaning | Example |
|-----------|---------|---------|
| `.` | Any single character | `h.t` matches "hat", "hot", "hit" |
| `^` | Start of string | `^Hello` matches "Hello world" |
| `$` | End of string | `world$` matches "Hello world" |
| `*` | Zero or more | `ab*c` matches "ac", "abc", "abbc" |
| `+` | One or more | `ab+c` matches "abc", "abbc" |
| `?` | Zero or one | `colou?r` matches "color", "colour" |
| `\|` | OR operator | `cat\|dog` matches "cat" or "dog" |

### Character Classes

Match specific sets of characters:

```
[abc]     - Matches a, b, or c
[a-z]     - Matches any lowercase letter
[A-Z]     - Matches any uppercase letter
[0-9]     - Matches any digit
[a-zA-Z]  - Matches any letter
[^abc]    - Matches anything except a, b, c
```

### Shorthand Character Classes

| Shorthand | Equivalent | Meaning |
|-----------|------------|---------|
| `\d` | `[0-9]` | Any digit |
| `\D` | `[^0-9]` | Any non-digit |
| `\w` | `[a-zA-Z0-9_]` | Word character |
| `\W` | `[^a-zA-Z0-9_]` | Non-word character |
| `\s` | `[ \t\n\r\f]` | Whitespace |
| `\S` | `[^ \t\n\r\f]` | Non-whitespace |

## Quantifiers

Control how many times a pattern matches:

```
{n}     - Exactly n times
{n,}    - n or more times
{n,m}   - Between n and m times
*       - Zero or more (same as {0,})
+       - One or more (same as {1,})
?       - Zero or one (same as {0,1})
```

### Examples

```
\d{3}       - Exactly 3 digits: "123"
\d{2,4}     - 2 to 4 digits: "12", "123", "1234"
[a-z]+      - One or more lowercase letters
\w*         - Zero or more word characters
```

## Groups and Capturing

### Basic Groups

Parentheses create groups:

```
(abc)+      - One or more "abc": "abc", "abcabc"
(cat|dog)   - Either "cat" or "dog"
```

### Capturing Groups

Groups capture matched text for later use:

```javascript
const regex = /(\d{4})-(\d{2})-(\d{2})/;
const match = "2025-01-13".match(regex);
// match[1] = "2025", match[2] = "01", match[3] = "13"
```

### Non-Capturing Groups

Use `(?:...)` when you don't need to capture:

```
(?:https?|ftp)://   - Matches protocol without capturing
```

## Common Regex Patterns

### Email Validation

```
^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$
```

Breakdown:
- `^[a-zA-Z0-9._%+-]+` - Username (letters, numbers, special chars)
- `@` - Literal @ symbol
- `[a-zA-Z0-9.-]+` - Domain name
- `\.[a-zA-Z]{2,}$` - TLD (at least 2 letters)

### Phone Number (US)

```
^\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})$
```

Matches: (123) 456-7890, 123-456-7890, 123.456.7890

### URL Validation

```
^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$
```

### Password Strength

Strong password (8+ chars, uppercase, lowercase, number, special):

```
^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$
```

### IP Address (IPv4)

```
^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$
```

### Date Format (YYYY-MM-DD)

```
^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$
```

## Lookahead and Lookbehind

### Positive Lookahead `(?=...)`

Match only if followed by pattern:

```
\d+(?=px)   - Matches digits followed by "px": "100" in "100px"
```

### Negative Lookahead `(?!...)`

Match only if NOT followed by pattern:

```
\d+(?!px)   - Matches digits NOT followed by "px"
```

### Positive Lookbehind `(?<=...)`

Match only if preceded by pattern:

```
(?<=\$)\d+  - Matches digits preceded by "$": "100" in "$100"
```

### Negative Lookbehind `(?<!...)`

Match only if NOT preceded by pattern:

```
(?<!\$)\d+  - Matches digits NOT preceded by "$"
```

## Regex Flags

Modify how regex behaves:

| Flag | Name | Description |
|------|------|-------------|
| `g` | Global | Find all matches, not just first |
| `i` | Case-insensitive | Ignore case |
| `m` | Multiline | ^ and $ match line boundaries |
| `s` | Dotall | `.` matches newlines |
| `u` | Unicode | Enable Unicode support |

### Example

```javascript
const regex = /hello/gi;  // Global, case-insensitive
"Hello HELLO hello".match(regex);  // ["Hello", "HELLO", "hello"]
```

## Performance Tips

### 1. Avoid Catastrophic Backtracking

Bad pattern (exponential time):
```
(a+)+b
```

Better pattern:
```
a+b
```

### 2. Use Specific Patterns

Bad (too greedy):
```
.*
```

Better (more specific):
```
[^<]*
```

### 3. Anchor When Possible

Use `^` and `$` to limit search scope:
```
^pattern$
```

### 4. Use Non-Capturing Groups

When you don't need captured text:
```
(?:pattern)  instead of  (pattern)
```

## Recommended Tools

### U2Tool Regex Tester

[U2Tool Regex Tester](https://www.u2tool.com/en/tools/regex-tester) offers:

- ✅ Real-time pattern matching
- ✅ Match highlighting
- ✅ Regex explanation
- ✅ Common pattern library
- ✅ Multiple flag support
- ✅ Runs in browser, data stays private

### How to Use

1. Visit [Regex Tester](https://www.u2tool.com/en/tools/regex-tester)
2. Enter your regex pattern
3. Input test string
4. See matches highlighted in real-time
5. Adjust pattern as needed

## FAQ

### What is the difference between `*` and `+`?

`*` matches zero or more occurrences, while `+` matches one or more. For example, `ab*c` matches "ac" (zero b's), but `ab+c` requires at least one "b", so it won't match "ac".

### How do I match a literal special character?

Escape it with a backslash. To match a literal period, use `\.`. To match a literal backslash, use `\\`.

### Why isn't my regex matching?

Common issues:
- Forgetting to escape special characters
- Missing anchors (^ and $)
- Wrong flags (case sensitivity)
- Greedy vs lazy quantifiers

### What is greedy vs lazy matching?

Greedy (`*`, `+`) matches as much as possible. Lazy (`*?`, `+?`) matches as little as possible. For `<.*>` on `<a>b</a>`, greedy matches the whole string, lazy matches just `<a>`.

### How do I test regex performance?

Use tools like [U2Tool Regex Tester](https://www.u2tool.com/en/tools/regex-tester) to test patterns with various inputs. Watch for patterns that take too long on certain inputs (catastrophic backtracking).

## Conclusion

Regular expressions are essential tools for developers. Start with basic patterns and gradually learn advanced features. Practice with [U2Tool Regex Tester](https://www.u2tool.com/en/tools/regex-tester) to improve your regex skills.

Remember: A well-crafted regex can save hours of manual text processing, but an overly complex one can be a maintenance nightmare. Keep patterns as simple as possible while meeting your requirements.
