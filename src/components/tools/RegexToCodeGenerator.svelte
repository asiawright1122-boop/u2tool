<script lang="ts">
  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['regex-to-code-generator'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.regex-to-code-generator.${key}`;
  }
  function tCommon(key: string): string {
    const scope = translations['tools'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.${key}`;
  }

  // Types
  type Language = 'javascript' | 'python' | 'java' | 'csharp' | 'go' | 'php' | 'ruby' | 'rust';
  type Operation = 'match' | 'matchAll' | 'replace' | 'split' | 'test';
  interface CodeTemplate {
  match: string;
  matchAll: string;
  replace: string;
  split: string;
  test: string;
}

  const LANGUAGES = [
    { value: 'javascript', label: 'JavaScript' },
    { value: 'python', label: 'Python' },
    { value: 'java', label: 'Java' },
    { value: 'csharp', label: 'C#' },
    { value: 'go', label: 'Go' },
    { value: 'php', label: 'PHP' },
    { value: 'ruby', label: 'Ruby' },
    { value: 'rust', label: 'Rust' },
  ] as const;

  const OPERATIONS = [
    { value: 'match', label: 'Match first' },
    { value: 'matchAll', label: 'Match all' },
    { value: 'replace', label: 'Replace' },
    { value: 'split', label: 'Split' },
    { value: 'test', label: 'Test only' },
  ] as const;

  const CODE_TEMPLATES: Record<Language, CodeTemplate> = {
    javascript: {
      match: 'const regex = /{PATTERN}/{FLAGS};\nconst result = "{TEST_STRING}".match(regex);',
      matchAll:
        'const regex = /{PATTERN}/{FLAGS};\nconst results = Array.from("{TEST_STRING}".matchAll(regex));',
      replace:
        'const regex = /{PATTERN}/{FLAGS};\nconst result = "{TEST_STRING}".replace(regex, "{REPLACEMENT}");',
      split: 'const regex = /{PATTERN}/{FLAGS};\nconst result = "{TEST_STRING}".split(regex);',
      test: 'const regex = /{PATTERN}/{FLAGS};\nconst isMatch = regex.test("{TEST_STRING}");',
    },
    python: {
      match:
        'import re\npattern = r"{PATTERN}"\ntext = "{TEST_STRING}"\nresult = re.search(pattern, text{PY_FLAGS})',
      matchAll:
        'import re\npattern = r"{PATTERN}"\ntext = "{TEST_STRING}"\nresults = re.findall(pattern, text{PY_FLAGS})',
      replace:
        'import re\npattern = r"{PATTERN}"\ntext = "{TEST_STRING}"\nresult = re.sub(pattern, "{REPLACEMENT}", text{PY_FLAGS})',
      split:
        'import re\npattern = r"{PATTERN}"\ntext = "{TEST_STRING}"\nresult = re.split(pattern, text{PY_FLAGS})',
      test:
        'import re\npattern = r"{PATTERN}"\ntext = "{TEST_STRING}"\nis_match = bool(re.search(pattern, text{PY_FLAGS}))',
    },
    java: {
      match:
        'Pattern pattern = Pattern.compile("{PATTERN}"{JAVA_FLAGS});\nMatcher matcher = pattern.matcher("{TEST_STRING}");\nboolean found = matcher.find();',
      matchAll:
        'Pattern pattern = Pattern.compile("{PATTERN}"{JAVA_FLAGS});\nMatcher matcher = pattern.matcher("{TEST_STRING}");\nwhile (matcher.find()) {\n  System.out.println(matcher.group());\n}',
      replace:
        'Pattern pattern = Pattern.compile("{PATTERN}"{JAVA_FLAGS});\nString result = pattern.matcher("{TEST_STRING}").replaceAll("{REPLACEMENT}");',
      split:
        'Pattern pattern = Pattern.compile("{PATTERN}"{JAVA_FLAGS});\nString[] result = pattern.split("{TEST_STRING}");',
      test:
        'Pattern pattern = Pattern.compile("{PATTERN}"{JAVA_FLAGS});\nboolean isMatch = pattern.matcher("{TEST_STRING}").find();',
    },
    csharp: {
      match:
        'var regex = new Regex(@"{PATTERN}"{CS_FLAGS});\nvar result = regex.Match("{TEST_STRING}");',
      matchAll:
        'var regex = new Regex(@"{PATTERN}"{CS_FLAGS});\nvar results = regex.Matches("{TEST_STRING}");',
      replace:
        'var regex = new Regex(@"{PATTERN}"{CS_FLAGS});\nvar result = regex.Replace("{TEST_STRING}", "{REPLACEMENT}");',
      split:
        'var regex = new Regex(@"{PATTERN}"{CS_FLAGS});\nvar result = regex.Split("{TEST_STRING}");',
      test:
        'var regex = new Regex(@"{PATTERN}"{CS_FLAGS});\nvar isMatch = regex.IsMatch("{TEST_STRING}");',
    },
    go: {
      match:
        're := regexp.MustCompile(`{PATTERN}`)\nresult := re.FindString("{TEST_STRING}")',
      matchAll:
        're := regexp.MustCompile(`{PATTERN}`)\nresults := re.FindAllString("{TEST_STRING}", -1)',
      replace:
        're := regexp.MustCompile(`{PATTERN}`)\nresult := re.ReplaceAllString("{TEST_STRING}", "{REPLACEMENT}")',
      split:
        're := regexp.MustCompile(`{PATTERN}`)\nresult := re.Split("{TEST_STRING}", -1)',
      test:
        're := regexp.MustCompile(`{PATTERN}`)\nisMatch := re.MatchString("{TEST_STRING}")',
    },
    php: {
      match:
        '$pattern = "/{PATTERN}/{FLAGS}";\npreg_match($pattern, "{TEST_STRING}", $matches);',
      matchAll:
        '$pattern = "/{PATTERN}/{FLAGS}";\npreg_match_all($pattern, "{TEST_STRING}", $matches);',
      replace:
        '$pattern = "/{PATTERN}/{FLAGS}";\n$result = preg_replace($pattern, "{REPLACEMENT}", "{TEST_STRING}");',
      split:
        '$pattern = "/{PATTERN}/{FLAGS}";\n$result = preg_split($pattern, "{TEST_STRING}");',
      test:
        '$pattern = "/{PATTERN}/{FLAGS}";\n$isMatch = preg_match($pattern, "{TEST_STRING}") === 1;',
    },
    ruby: {
      match: 'regex = /{PATTERN}/{FLAGS}\nresult = "{TEST_STRING}".match(regex)',
      matchAll: 'regex = /{PATTERN}/{FLAGS}\nresults = "{TEST_STRING}".scan(regex)',
      replace:
        'regex = /{PATTERN}/{FLAGS}\nresult = "{TEST_STRING}".gsub(regex, "{REPLACEMENT}")',
      split: 'regex = /{PATTERN}/{FLAGS}\nresult = "{TEST_STRING}".split(regex)',
      test: 'regex = /{PATTERN}/{FLAGS}\nis_match = regex.match?("{TEST_STRING}")',
    },
    rust: {
      match:
        'let re = Regex::new(r"{PATTERN}").unwrap();\nlet result = re.find("{TEST_STRING}");',
      matchAll:
        'let re = Regex::new(r"{PATTERN}").unwrap();\nlet results: Vec<_> = re.find_iter("{TEST_STRING}").collect();',
      replace:
        'let re = Regex::new(r"{PATTERN}").unwrap();\nlet result = re.replace_all("{TEST_STRING}", "{REPLACEMENT}");',
      split:
        'let re = Regex::new(r"{PATTERN}").unwrap();\nlet result: Vec<_> = re.split("{TEST_STRING}").collect();',
      test: 'let re = Regex::new(r"{PATTERN}").unwrap();\nlet is_match = re.is_match("{TEST_STRING}");',
    },
  };

  let pattern = $state('\\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Z|a-z]{2,}\\b');

  let testString = $state('Contact us at hello@example.com or support@test.org');

  let replacement = $state('[EMAIL]');

  let language = $state('javascript');

  let operation = $state('match');

  let flags = $state({ i: true, g: false, m: false });

  let copied = $state(false);

  let code = $derived.by(() => {
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
  });

  function handleCopy() {
    navigator.clipboard.writeText(code);
    copied = true;
    setTimeout(() => copied = false, 2000);
  }

</script>


    <div class="space-y-6">
      <!-- Pattern Input -->
      <div>
        <label for="regex-to-code-generator-field-12" class="tool-label">
          Regex Pattern
        </label>
        <input
          type="text"
          bind:value={pattern}
          placeholder={t("patternPlaceholder")}
          class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono" id="regex-to-code-generator-field-12" />
      </div>

      <!-- Test String -->
      <div>
        <label for="regex-to-code-generator-field-11" class="tool-label">
          Test String
        </label>
        <input
          type="text"
          bind:value={testString}
          placeholder={t("testTextPlaceholder")}
          class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white" id="regex-to-code-generator-field-11" />
      </div>

      <!-- Replacement (for replace operation) -->
      {#if operation === 'replace'}
<div>
          <label for="regex-to-code-generator-field-10" class="tool-label">
            Replacement
          </label>
          <input
            type="text"
            bind:value={replacement}
            placeholder={t("replacementPlaceholder")}
            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white" id="regex-to-code-generator-field-10" />
        </div>
{/if}

      <!-- Options -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label for="regex-to-code-generator-field-9" class="tool-label">
            Language
          </label>
          <select
            value={language}
            onchange={(e) => language = e.target.value as Language}
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white" id="regex-to-code-generator-field-9">
            {#each LANGUAGES as lang (lang.value)}
<option  value={lang.value}>{lang.label}</option>
{/each}
          </select>
        </div>
        <div>
          <label for="regex-to-code-generator-field-8" class="tool-label">
            Operation
          </label>
          <select
            value={operation}
            onchange={(e) => operation = e.target.value as Operation}
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white" id="regex-to-code-generator-field-8">
            {#each OPERATIONS as op (op.value)}
<option  value={op.value}>{op.label}</option>
{/each}
          </select>
        </div>
        <div>
          <div class="tool-label">
            Flags
          </div>
          <div class="flex gap-4">
            {#each [
              { key: 'i', label: 'Case Insensitive' },
              { key: 'g', label: 'Global' },
              { key: 'm', label: 'Multiline' },
            ] as flag (flag.key)}
<label  class="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                <input
                  type="checkbox"
                  checked={flags[flag.key as keyof typeof flags]}
                  onchange={(e) => flags = ({ ...flags, [flag.key]: e.target.checked })}
                  class="rounded border-gray-300 dark:border-gray-600"
                />
                {flag.key}
              </label>
{/each}
          </div>
        </div>
      </div>

      <!-- Generated Code -->
      <div>
        <div class="flex justify-between items-center mb-2">
          <div class="tool-label">
            Generated Code ({LANGUAGES.find(l => l.value === language)?.label})
          </div>
          <button
            onclick={handleCopy}
            class="text-sm text-amber-600 hover:text-amber-700 dark:text-amber-400"
          >
            {copied ? tCommon('copied') : tCommon('copy')}
          </button>
        </div>
        <pre class="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg overflow-x-auto text-sm font-mono text-gray-800 dark:text-gray-200">
          {code}
        </pre>
      </div>
    </div>
  
