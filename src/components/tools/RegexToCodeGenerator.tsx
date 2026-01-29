'use client';

import { useState, useCallback, useMemo } from 'react';
import { useTranslations } from 'next-intl';

type Language = 'javascript' | 'python' | 'java' | 'csharp' | 'go' | 'php' | 'ruby' | 'rust';
type Operation = 'match' | 'matchAll' | 'replace' | 'split' | 'test';

interface CodeTemplate {
  match: string;
  matchAll: string;
  replace: string;
  split: string;
  test: string;
}

const CODE_TEMPLATES: Record<Language, CodeTemplate> = {
  javascript: {
    match: `const regex = /{PATTERN}/{FLAGS};
const text = "{TEST_STRING}";
const match = text.match(regex);
console.log(match);`,
    matchAll: `const regex = /{PATTERN}/{FLAGS}g;
const text = "{TEST_STRING}";
const matches = [...text.matchAll(regex)];
console.log(matches);`,
    replace: `const regex = /{PATTERN}/{FLAGS}g;
const text = "{TEST_STRING}";
const result = text.replace(regex, "{REPLACEMENT}");
console.log(result);`,
    split: `const regex = /{PATTERN}/{FLAGS};
const text = "{TEST_STRING}";
const parts = text.split(regex);
console.log(parts);`,
    test: `const regex = /{PATTERN}/{FLAGS};
const text = "{TEST_STRING}";
const isMatch = regex.test(text);
console.log(isMatch);`,
  },
  python: {
    match: `import re

pattern = r"{PATTERN}"
text = "{TEST_STRING}"
match = re.search(pattern, text{PY_FLAGS})
if match:
    print(match.group())`,
    matchAll: `import re

pattern = r"{PATTERN}"
text = "{TEST_STRING}"
matches = re.findall(pattern, text{PY_FLAGS})
print(matches)`,
    replace: `import re

pattern = r"{PATTERN}"
text = "{TEST_STRING}"
result = re.sub(pattern, "{REPLACEMENT}", text{PY_FLAGS})
print(result)`,
    split: `import re

pattern = r"{PATTERN}"
text = "{TEST_STRING}"
parts = re.split(pattern, text{PY_FLAGS})
print(parts)`,
    test: `import re

pattern = r"{PATTERN}"
text = "{TEST_STRING}"
is_match = bool(re.search(pattern, text{PY_FLAGS}))
print(is_match)`,
  },
  java: {
    match: `import java.util.regex.*;

public class RegexExample {
    public static void main(String[] args) {
        Pattern pattern = Pattern.compile("{PATTERN}"{JAVA_FLAGS});
        String text = "{TEST_STRING}";
        Matcher matcher = pattern.matcher(text);
        if (matcher.find()) {
            System.out.println(matcher.group());
        }
    }
}`,
    matchAll: `import java.util.regex.*;

public class RegexExample {
    public static void main(String[] args) {
        Pattern pattern = Pattern.compile("{PATTERN}"{JAVA_FLAGS});
        String text = "{TEST_STRING}";
        Matcher matcher = pattern.matcher(text);
        while (matcher.find()) {
            System.out.println(matcher.group());
        }
    }
}`,
    replace: `import java.util.regex.*;

public class RegexExample {
    public static void main(String[] args) {
        Pattern pattern = Pattern.compile("{PATTERN}"{JAVA_FLAGS});
        String text = "{TEST_STRING}";
        String result = pattern.matcher(text).replaceAll("{REPLACEMENT}");
        System.out.println(result);
    }
}`,
    split: `import java.util.regex.*;

public class RegexExample {
    public static void main(String[] args) {
        Pattern pattern = Pattern.compile("{PATTERN}"{JAVA_FLAGS});
        String text = "{TEST_STRING}";
        String[] parts = pattern.split(text);
        for (String part : parts) {
            System.out.println(part);
        }
    }
}`,
    test: `import java.util.regex.*;

public class RegexExample {
    public static void main(String[] args) {
        Pattern pattern = Pattern.compile("{PATTERN}"{JAVA_FLAGS});
        String text = "{TEST_STRING}";
        boolean isMatch = pattern.matcher(text).find();
        System.out.println(isMatch);
    }
}`,
  },
  csharp: {
    match: `using System;
using System.Text.RegularExpressions;

class Program {
    static void Main() {
        var regex = new Regex(@"{PATTERN}"{CS_FLAGS});
        string text = "{TEST_STRING}";
        var match = regex.Match(text);
        if (match.Success) {
            Console.WriteLine(match.Value);
        }
    }
}`,
    matchAll: `using System;
using System.Text.RegularExpressions;

class Program {
    static void Main() {
        var regex = new Regex(@"{PATTERN}"{CS_FLAGS});
        string text = "{TEST_STRING}";
        var matches = regex.Matches(text);
        foreach (Match match in matches) {
            Console.WriteLine(match.Value);
        }
    }
}`,
    replace: `using System;
using System.Text.RegularExpressions;

class Program {
    static void Main() {
        var regex = new Regex(@"{PATTERN}"{CS_FLAGS});
        string text = "{TEST_STRING}";
        string result = regex.Replace(text, "{REPLACEMENT}");
        Console.WriteLine(result);
    }
}`,
    split: `using System;
using System.Text.RegularExpressions;

class Program {
    static void Main() {
        var regex = new Regex(@"{PATTERN}"{CS_FLAGS});
        string text = "{TEST_STRING}";
        string[] parts = regex.Split(text);
        foreach (string part in parts) {
            Console.WriteLine(part);
        }
    }
}`,
    test: `using System;
using System.Text.RegularExpressions;

class Program {
    static void Main() {
        var regex = new Regex(@"{PATTERN}"{CS_FLAGS});
        string text = "{TEST_STRING}";
        bool isMatch = regex.IsMatch(text);
        Console.WriteLine(isMatch);
    }
}`,
  },
  go: {
    match: `package main

import (
    "fmt"
    "regexp"
)

func main() {
    pattern := regexp.MustCompile(\`{PATTERN}\`)
    text := "{TEST_STRING}"
    match := pattern.FindString(text)
    fmt.Println(match)
}`,
    matchAll: `package main

import (
    "fmt"
    "regexp"
)

func main() {
    pattern := regexp.MustCompile(\`{PATTERN}\`)
    text := "{TEST_STRING}"
    matches := pattern.FindAllString(text, -1)
    fmt.Println(matches)
}`,
    replace: `package main

import (
    "fmt"
    "regexp"
)

func main() {
    pattern := regexp.MustCompile(\`{PATTERN}\`)
    text := "{TEST_STRING}"
    result := pattern.ReplaceAllString(text, "{REPLACEMENT}")
    fmt.Println(result)
}`,
    split: `package main

import (
    "fmt"
    "regexp"
)

func main() {
    pattern := regexp.MustCompile(\`{PATTERN}\`)
    text := "{TEST_STRING}"
    parts := pattern.Split(text, -1)
    fmt.Println(parts)
}`,
    test: `package main

import (
    "fmt"
    "regexp"
)

func main() {
    pattern := regexp.MustCompile(\`{PATTERN}\`)
    text := "{TEST_STRING}"
    isMatch := pattern.MatchString(text)
    fmt.Println(isMatch)
}`,
  },
  php: {
    match: `<?php
$pattern = '/{PATTERN}/{FLAGS}';
$text = "{TEST_STRING}";
if (preg_match($pattern, $text, $match)) {
    print_r($match);
}`,
    matchAll: `<?php
$pattern = '/{PATTERN}/{FLAGS}';
$text = "{TEST_STRING}";
preg_match_all($pattern, $text, $matches);
print_r($matches);`,
    replace: `<?php
$pattern = '/{PATTERN}/{FLAGS}';
$text = "{TEST_STRING}";
$result = preg_replace($pattern, "{REPLACEMENT}", $text);
echo $result;`,
    split: `<?php
$pattern = '/{PATTERN}/{FLAGS}';
$text = "{TEST_STRING}";
$parts = preg_split($pattern, $text);
print_r($parts);`,
    test: `<?php
$pattern = '/{PATTERN}/{FLAGS}';
$text = "{TEST_STRING}";
$isMatch = preg_match($pattern, $text) === 1;
var_dump($isMatch);`,
  },
  ruby: {
    match: `pattern = /{PATTERN}/{FLAGS}
text = "{TEST_STRING}"
match = text.match(pattern)
puts match`,
    matchAll: `pattern = /{PATTERN}/{FLAGS}
text = "{TEST_STRING}"
matches = text.scan(pattern)
puts matches`,
    replace: `pattern = /{PATTERN}/{FLAGS}
text = "{TEST_STRING}"
result = text.gsub(pattern, "{REPLACEMENT}")
puts result`,
    split: `pattern = /{PATTERN}/{FLAGS}
text = "{TEST_STRING}"
parts = text.split(pattern)
puts parts`,
    test: `pattern = /{PATTERN}/{FLAGS}
text = "{TEST_STRING}"
is_match = pattern.match?(text)
puts is_match`,
  },
  rust: {
    match: `use regex::Regex;

fn main() {
    let pattern = Regex::new(r"{PATTERN}").unwrap();
    let text = "{TEST_STRING}";
    if let Some(m) = pattern.find(text) {
        println!("{}", m.as_str());
    }
}`,
    matchAll: `use regex::Regex;

fn main() {
    let pattern = Regex::new(r"{PATTERN}").unwrap();
    let text = "{TEST_STRING}";
    for m in pattern.find_iter(text) {
        println!("{}", m.as_str());
    }
}`,
    replace: `use regex::Regex;

fn main() {
    let pattern = Regex::new(r"{PATTERN}").unwrap();
    let text = "{TEST_STRING}";
    let result = pattern.replace_all(text, "{REPLACEMENT}");
    println!("{}", result);
}`,
    split: `use regex::Regex;

fn main() {
    let pattern = Regex::new(r"{PATTERN}").unwrap();
    let text = "{TEST_STRING}";
    let parts: Vec<&str> = pattern.split(text).collect();
    println!("{:?}", parts);
}`,
    test: `use regex::Regex;

fn main() {
    let pattern = Regex::new(r"{PATTERN}").unwrap();
    let text = "{TEST_STRING}";
    let is_match = pattern.is_match(text);
    println!("{}", is_match);
}`,
  },
};

const LANGUAGES: { value: Language; label: string }[] = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'csharp', label: 'C#' },
  { value: 'go', label: 'Go' },
  { value: 'php', label: 'PHP' },
  { value: 'ruby', label: 'Ruby' },
  { value: 'rust', label: 'Rust' },
];

const OPERATIONS: { value: Operation; label: string }[] = [
  { value: 'match', label: 'Match First' },
  { value: 'matchAll', label: 'Match All' },
  { value: 'replace', label: 'Replace' },
  { value: 'split', label: 'Split' },
  { value: 'test', label: 'Test' },
];

export default function RegexToCodeGenerator() {
  const t = useTranslations('tools.regex-to-code-generator');
  const tCommon = useTranslations('tools');
  const [pattern, setPattern] = useState('\\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Z|a-z]{2,}\\b');
  const [testString, setTestString] = useState('Contact us at hello@example.com or support@test.org');
  const [replacement, setReplacement] = useState('[EMAIL]');
  const [language, setLanguage] = useState<Language>('javascript');
  const [operation, setOperation] = useState<Operation>('match');
  const [flags, setFlags] = useState({ i: true, g: false, m: false });
  const [copied, setCopied] = useState(false);

  const code = useMemo(() => {
    const template = CODE_TEMPLATES[language][operation];
    const flagStr = Object.entries(flags).filter(([, v]) => v).map(([k]) => k).join('');
    
    // Python flags
    const pyFlags = [];
    if (flags.i) pyFlags.push('re.IGNORECASE');
    if (flags.m) pyFlags.push('re.MULTILINE');
    const pyFlagStr = pyFlags.length > 0 ? ', ' + pyFlags.join(' | ') : '';
    
    // Java flags
    const javaFlags = [];
    if (flags.i) javaFlags.push('Pattern.CASE_INSENSITIVE');
    if (flags.m) javaFlags.push('Pattern.MULTILINE');
    const javaFlagStr = javaFlags.length > 0 ? ', ' + javaFlags.join(' | ') : '';
    
    // C# flags
    const csFlags = [];
    if (flags.i) csFlags.push('RegexOptions.IgnoreCase');
    if (flags.m) csFlags.push('RegexOptions.Multiline');
    const csFlagStr = csFlags.length > 0 ? ', ' + csFlags.join(' | ') : '';

    return template
      .replace(/{PATTERN}/g, pattern.replace(/\\/g, language === 'java' || language === 'csharp' ? '\\\\' : '\\'))
      .replace(/{FLAGS}/g, flagStr)
      .replace(/{PY_FLAGS}/g, pyFlagStr)
      .replace(/{JAVA_FLAGS}/g, javaFlagStr)
      .replace(/{CS_FLAGS}/g, csFlagStr)
      .replace(/{TEST_STRING}/g, testString.replace(/"/g, '\\"'))
      .replace(/{REPLACEMENT}/g, replacement);
  }, [pattern, testString, replacement, language, operation, flags]);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [code]);

  return (
    <div className="space-y-6">
      {/* Pattern Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Regex Pattern
        </label>
        <input
          type="text"
          value={pattern}
          onChange={(e) => setPattern(e.target.value)}
          placeholder={t("patternPlaceholder")}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono"
        />
      </div>

      {/* Test String */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Test String
        </label>
        <input
          type="text"
          value={testString}
          onChange={(e) => setTestString(e.target.value)}
          placeholder={t("testTextPlaceholder")}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        />
      </div>

      {/* Replacement (for replace operation) */}
      {operation === 'replace' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Replacement
          </label>
          <input
            type="text"
            value={replacement}
            onChange={(e) => setReplacement(e.target.value)}
            placeholder={t("replacementPlaceholder")}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        </div>
      )}

      {/* Options */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Language
          </label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as Language)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            {LANGUAGES.map(lang => (
              <option key={lang.value} value={lang.value}>{lang.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Operation
          </label>
          <select
            value={operation}
            onChange={(e) => setOperation(e.target.value as Operation)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            {OPERATIONS.map(op => (
              <option key={op.value} value={op.value}>{op.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Flags
          </label>
          <div className="flex gap-4">
            {[
              { key: 'i', label: 'Case Insensitive' },
              { key: 'g', label: 'Global' },
              { key: 'm', label: 'Multiline' },
            ].map(flag => (
              <label key={flag.key} className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                <input
                  type="checkbox"
                  checked={flags[flag.key as keyof typeof flags]}
                  onChange={(e) => setFlags(prev => ({ ...prev, [flag.key]: e.target.checked }))}
                  className="rounded border-gray-300 dark:border-gray-600"
                />
                {flag.key}
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Generated Code */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Generated Code ({LANGUAGES.find(l => l.value === language)?.label})
          </label>
          <button
            onClick={handleCopy}
            className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
          >
            {copied ? tCommon('copied') : tCommon('copy')}
          </button>
        </div>
        <pre className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg overflow-x-auto text-sm font-mono text-gray-800 dark:text-gray-200">
          {code}
        </pre>
      </div>
    </div>
  );
}
