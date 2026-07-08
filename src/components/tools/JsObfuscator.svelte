<script lang="ts">
  import { onDestroy } from 'svelte';

  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['js-obfuscator'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.js-obfuscator.${key}`;
  }
  function tg(key: string): string {
    const scope = translations['tools'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.${key}`;
  }

  let input = $state('');

  let output = $state('');

  let copied = $state(false);

  let options = $state({
    renameVariables: true,
    stringEncoding: true,
    deadCodeInjection: false,
    controlFlowFlattening: false,
    unicodeEscape: true,
  });

  let timerRef = $state(null);  onDestroy(() => {
    if (timerRef) clearTimeout(timerRef);
  });

  // Functions
  function obfuscate() {
    if (!input.trim()) {
      output = '';
      return;
    }

    let result = input;

    // String encoding - convert strings to hex/unicode
    if (options.stringEncoding) {
      result = result.replace(/'([^'\\]|\\.)*'/g, (match) => {
        const str = match.slice(1, -1);
        const encoded = str.split('').map(c => '\\x' + c.charCodeAt(0).toString(16).padStart(2, '0')).join('');
        return `'${encoded}'`;
      });
      result = result.replace(/"([^"\\]|\\.)*"/g, (match) => {
        const str = match.slice(1, -1);
        const encoded = str.split('').map(c => '\\x' + c.charCodeAt(0).toString(16).padStart(2, '0')).join('');
        return `"${encoded}"`;
      });
    }

    // Unicode escape for identifiers
    if (options.unicodeEscape) {
      // 保留关键字列表供未来使用
      const _keywords = ['function', 'var', 'let', 'const', 'if', 'else', 'for', 'while', 'return', 'class', 'new', 'this', 'true', 'false', 'null', 'undefined', 'typeof', 'instanceof', 'try', 'catch', 'throw', 'finally', 'switch', 'case', 'break', 'continue', 'default', 'do', 'in', 'of', 'async', 'await', 'export', 'import', 'from', 'as', 'extends', 'super', 'static', 'get', 'set', 'yield', 'delete', 'void', 'with', 'debugger'];
      
      // Add wrapper function
      result = `(function(){${result}})();`;
    }

    // Variable renaming
    if (options.renameVariables) {
      const varNames = new Map<string, string>();
      let counter = 0;
      
      const generateName = () => {
        const chars = '_$';
        let name = '';
        let n = counter++;
        do {
          name = chars[n % 2] + name;
          n = Math.floor(n / 2);
        } while (n > 0);
        return '_' + name + Math.random().toString(36).substring(2, 5);
      };

      // Find variable declarations
      const varPattern = /\b(var|let|const)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/g;
      let match;
      while ((match = varPattern.exec(input)) !== null) {
        const varName = match[2];
        if (!varNames.has(varName)) {
          varNames.set(varName, generateName());
        }
      }

      // Find function declarations
      const funcPattern = /\bfunction\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/g;
      while ((match = funcPattern.exec(input)) !== null) {
        const funcName = match[1];
        if (!varNames.has(funcName)) {
          varNames.set(funcName, generateName());
        }
      }

      // Replace variables (simple approach)
      varNames.forEach((newName, oldName) => {
        const regex = new RegExp(`\\b${oldName}\\b`, 'g');
        result = result.replace(regex, newName);
      });
    }

    // Dead code injection
    if (options.deadCodeInjection) {
      const deadCode = [
        'if(false){console.log(Math.random());}',
        'var _0x' + Math.random().toString(16).slice(2, 6) + '=function(){return null;};',
        'while(false){break;}',
      ];
      const randomDead = deadCode[Math.floor(Math.random() * deadCode.length)];
      result = randomDead + result;
    }

    // Control flow flattening (simplified)
    if (options.controlFlowFlattening) {
      result = `var _0xstate=0;while(true){switch(_0xstate){case 0:${result}_0xstate=-1;break;default:return;}}`;
    }

    // Minify - remove extra whitespace
    result = result
      .replace(/\s+/g, ' ')
      .replace(/\s*([{};,:])\s*/g, '$1')
      .replace(/\s*([=+\-*/<>!&|])\s*/g, '$1');

    output = result;
  }
  async function copyOutput() {
    await navigator.clipboard.writeText(output);
    copied = true;
    if (timerRef) clearTimeout(timerRef);
    timerRef = setTimeout(() => copied = false, 2000);
  }
  function loadSample() {
    input = `function greetUser(name) {
  const greeting = "Hello, " + name + "!";
  console.log(greeting);
  return greeting;
}

function calculateSum(a, b) {
  let result = a + b;
  return result;
}

const userName = "World";
greetUser(userName);
console.log(calculateSum(5, 10));`;
  }

</script>


    <div class="space-y-6">
      <div class="flex flex-wrap gap-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <label class="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={options.renameVariables}
            onchange={(e) => options = { ...options, renameVariables: e.target.checked }}
            class="w-4 h-4"
          />
          <span class="text-sm text-gray-700 dark:text-white">{t('renameVariables')}</span>
        </label>
        <label class="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={options.stringEncoding}
            onchange={(e) => options = { ...options, stringEncoding: e.target.checked }}
            class="w-4 h-4"
          />
          <span class="text-sm text-gray-700 dark:text-white">{t('stringEncoding')}</span>
        </label>
        <label class="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={options.unicodeEscape}
            onchange={(e) => options = { ...options, unicodeEscape: e.target.checked }}
            class="w-4 h-4"
          />
          <span class="text-sm text-gray-700 dark:text-white">{t('unicodeEscape')}</span>
        </label>
        <label class="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={options.deadCodeInjection}
            onchange={(e) => options = { ...options, deadCodeInjection: e.target.checked }}
            class="w-4 h-4"
          />
          <span class="text-sm text-gray-700 dark:text-white">{t('deadCodeInjection')}</span>
        </label>
        <label class="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={options.controlFlowFlattening}
            onchange={(e) => options = { ...options, controlFlowFlattening: e.target.checked }}
            class="w-4 h-4"
          />
          <span class="text-sm text-gray-700 dark:text-white">{t('controlFlowFlattening')}</span>
        </label>
      </div>

      <div class="flex gap-2">
        <button
          onclick={loadSample}
          class="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg text-sm"
        >
          {t('loadSample')}
        </button>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <label for="js-obfuscator-field-4" class="block text-sm font-medium mb-2">{t('inputCode')}</label>
          <textarea
            bind:value={input}
            class="tool-textarea h-72 font-mono text-sm"
            placeholder={t('placeholder')} id="js-obfuscator-field-4"></textarea>
        </div>

        <div>
          <label for="js-obfuscator-field-3" class="block text-sm font-medium mb-2">{t('obfuscatedCode')}</label>
          <textarea
            value={output}
            readOnly
            class="tool-textarea h-72 font-mono text-sm bg-gray-100 dark:bg-gray-800" id="js-obfuscator-field-3"></textarea>
        </div>
      </div>

      <div class="flex justify-center gap-3">
        <button
          onclick={obfuscate}
          class="px-6 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg"
        >
          {t('obfuscate')}
        </button>
        <button
          onclick={copyOutput}
          class="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg"
          disabled={!output}
        >
          {copied ? tg('copied') : tg('copy')}
        </button>
      </div>

      <div class="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg text-sm">
        <p class="text-amber-700 dark:text-amber-400 font-medium mb-2">{t('info')}</p>
        <p class="text-amber-600 dark:text-gray-300">{t('infoText')}</p>
      </div>
    </div>
  
