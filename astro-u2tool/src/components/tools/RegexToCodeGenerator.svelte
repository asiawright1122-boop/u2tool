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
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Regex Pattern
        </label>
        <input
          type="text"
          bind:value={pattern}
          placeholder={t("patternPlaceholder")}
          class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono"
        />
      </div>

      <!-- Test String -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Test String
        </label>
        <input
          type="text"
          bind:value={testString}
          placeholder={t("testTextPlaceholder")}
          class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        />
      </div>

      <!-- Replacement (for replace operation) -->
      {#if operation === 'replace'}
<div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Replacement
          </label>
          <input
            type="text"
            bind:value={replacement}
            placeholder={t("replacementPlaceholder")}
            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        </div>
{/if}

      <!-- Options -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Language
          </label>
          <select
            value={language}
            onchange={(e) => language = e.target.value as Language}
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            {#each LANGUAGES as lang (lang.value)}
<option  value={lang.value}>{lang.label}</option>
{/each}
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Operation
          </label>
          <select
            value={operation}
            onchange={(e) => operation = e.target.value as Operation}
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            {#each OPERATIONS as op (op.value)}
<option  value={op.value}>{op.label}</option>
{/each}
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Flags
          </label>
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
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Generated Code ({LANGUAGES.find(l => l.value === language)?.label})
          </label>
          <button
            onclick={handleCopy}
            class="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
          >
            {copied ? tCommon('copied') : tCommon('copy')}
          </button>
        </div>
        <pre class="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg overflow-x-auto text-sm font-mono text-gray-800 dark:text-gray-200">
          {code}
        </pre>
      </div>
    </div>
  
