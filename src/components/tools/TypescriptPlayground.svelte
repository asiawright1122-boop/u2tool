<script lang="ts">
  import { onDestroy } from 'svelte';

  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['typescript-playground'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.typescript-playground.${key}`;
  }
  function tg(key: string): string {
    const scope = translations['tools'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.${key}`;
  }

  let input = $state(`// TypeScript Example
interface User {
  name: string;
  age: number;
}

function greet(user: User): string {
  return \`Hello, \${user.name}!\`;
}

const user: User = { name: "World", age: 25 };
console.log(greet(user));`);

  let output = $state('');

  let error = $state('');

  let target = $state('ES2020');

  let copied = $state(false);

  let timerRef = $state(null);

  async function compile() {
    if (!input.trim()) {
      output = '';
      error = '';
      return;
    }

    try {
      // 简单的 TypeScript 到 JavaScript 转换（移除类型注解）
      let result = input;
      
      // 移除接口定义
      result = result.replace(/interface\s+\w+\s*\{[^}]*\}/g, '');
      
      // 移除类型注解
      result = result.replace(/:\s*\w+(\[\])?(\s*\|\s*\w+(\[\])?)*(?=\s*[=,)\]}])/g, '');
      result = result.replace(/:\s*\w+(\[\])?(\s*\|\s*\w+(\[\])?)*(?=\s*\{)/g, '');
      
      // 移除泛型
      result = result.replace(/<[^>]+>/g, '');
      
      // 移除 as 类型断言
      result = result.replace(/\s+as\s+\w+/g, '');
      
      // 清理多余空行
      result = result.replace(/\n\s*\n\s*\n/g, '\n\n');
      result = result.trim();

      output = result;
      error = '';
    } catch (e) {
      error = (e as Error).message;
      output = '';
    }
  }  onDestroy(() => {
    if (timerRef) clearTimeout(timerRef);
  });

  // Functions
  async function copyOutput() {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    copied = true;
    if (timerRef) clearTimeout(timerRef);
    timerRef = setTimeout(() => copied = false, 2000);
  }

</script>


    <div class="space-y-4">
      <div class="flex flex-wrap gap-4 items-center">
        <div>
          <label for="typescript-playground-field-6" class="block text-sm text-gray-600 dark:text-gray-300 mb-1">{t('target')}</label>
          <select
            bind:value={target}
            class="px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-900 dark:text-white" id="typescript-playground-field-6">
            <option value="ES5">ES5</option>
            <option value="ES2015">ES2015</option>
            <option value="ES2020">ES2020</option>
            <option value="ESNext">ESNext</option>
          </select>
        </div>
      </div>

      <div class="flex flex-wrap gap-2">
        <button onclick={compile} class="btn-primary">
          {t('compile')}
        </button>
        <button onclick={copyOutput} disabled={!output} class="btn-secondary">
          {copied ? tg('copied') : tg('copy')}
        </button>
      </div>

      {#if error}
<div class="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg p-3 text-sm">
          {error}
        </div>
{/if}

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <label for="typescript-playground-field-5" class="block text-sm text-gray-600 dark:text-gray-300 mb-2">TypeScript</label>
          <textarea
            bind:value={input}
            class="w-full h-80 bg-gray-100 dark:bg-gray-700 rounded-lg px-4 py-3 text-gray-900 dark:text-white font-mono text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none resize-none"
            placeholder={t('inputPlaceholder')} id="typescript-playground-field-5"></textarea>
        </div>
        <div>
          <label for="typescript-playground-field-4" class="block text-sm text-gray-600 dark:text-gray-300 mb-2">JavaScript</label>
          <textarea
            value={output}
            readOnly
            class="w-full h-80 bg-gray-100 dark:bg-gray-700 rounded-lg px-4 py-3 text-gray-900 dark:text-white font-mono text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none resize-none" id="typescript-playground-field-4"></textarea>
        </div>
      </div>
    </div>
  
