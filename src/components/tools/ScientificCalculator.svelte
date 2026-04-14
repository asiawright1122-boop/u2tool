<script lang="ts">
  import { onDestroy } from 'svelte';

  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.${key}`;
  }

  let display = $state('0');

  let expression = $state('');

  let isRadians = $state(true);

  let memory = $state(0);

  let error = $state(null);

  let copied = $state(false);

  let timerRef = $state(null);

  function appendToExpression(value: string) {
    error = null;
    if (display === '0' && !['.','+','-','*','/'].includes(value)) {
      display = value;
      expression = value;
    } else {
      display = display + value;
      expression = expression + value;
    }
  }

  function appendFunction(func: string) {
    error = null;
    display = display === '0' ? `${func}(` : display + `${func}(`;
    expression = expression + `${func}(`;
  }

  function calculate() {
    try {
      let expr = expression;
      // 处理角度/弧度转换
      if (!isRadians) {
        expr = expr
          .replace(/sin\(([^)]+)\)/g, (_, arg) => `sin(${degreesToRadians(parseFloat(arg))})`)
          .replace(/cos\(([^)]+)\)/g, (_, arg) => `cos(${degreesToRadians(parseFloat(arg))})`)
          .replace(/tan\(([^)]+)\)/g, (_, arg) => `tan(${degreesToRadians(parseFloat(arg))})`);
      }
      const result = evaluateExpression(expr);
      const formatted = Number.isInteger(result) ? result.toString() : result.toPrecision(10).replace(/\.?0+$/, '');
      display = formatted;
      expression = formatted;
    } catch {
      error = t('sci.error');
      display = 'Error';
    }
  }

  function clear() {
    display = '0';
    expression = '';
    error = null;
  }

  function backspace() {
    if (display.length === 1 || display === 'Error') {
      display = '0';
      expression = '';
    } else {
      display = display.slice(0, -1);
      expression = expression.slice(0, -1);
    }
    error = null;
  }

  function handleFactorial() {
    try {
      const num = parseFloat(display);
      const result = factorial(num);
      display = result.toString();
      expression = result.toString();
    } catch {
      error = t('sci.error');
      display = 'Error';
    }
  }  onDestroy(() => {
    if (timerRef) clearTimeout(timerRef);
  });

  // Functions
  export function evaluateExpression(expr: string): number {
  // 预处理：替换科学函数
  const processed = expr
    .replace(/π/g, String(Math.PI))
    .replace(/e(?![0-9])/g, String(Math.E))
    .replace(/sin\(/g, 'Math.sin(')
    .replace(/cos\(/g, 'Math.cos(')
    .replace(/tan\(/g, 'Math.tan(')
    .replace(/asin\(/g, 'Math.asin(')
    .replace(/acos\(/g, 'Math.acos(')
    .replace(/atan\(/g, 'Math.atan(')
    .replace(/log\(/g, 'Math.log10(')
    .replace(/ln\(/g, 'Math.log(')
    .replace(/sqrt\(/g, 'Math.sqrt(')
    .replace(/abs\(/g, 'Math.abs(')
    .replace(/exp\(/g, 'Math.exp(')
    .replace(/pow\(/g, 'Math.pow(')
    .replace(/\^/g, '**')
    .replace(/×/g, '*')
    .replace(/÷/g, '/')
    .replace(/mod/g, '%');

  // 安全检查：只允许数字、运算符和 Math 函数
  const safePattern = /^[0-9+\-*/().%\s,Math.sincotaglqrtbexpow]+$/;
  if (!safePattern.test(processed)) {
    throw new Error('Invalid expression');
  }

  // 使用 Function 构造器计算（比 eval 更安全）
  let result = new Function(`return ${processed}`)();
  if (typeof result !== 'number' || !isFinite(result)) {
    throw new Error('Invalid result');
  }
  return result;
}
  export function factorial(n: number): number {
  if (n < 0 || !Number.isInteger(n)) throw new Error('Invalid input');
  if (n > 170) throw new Error('Number too large');
  if (n === 0 || n === 1) return 1;
  let result = 1;
  for (let i = 2; i <= n; i++) result *= i;
  return result;
}
  export function degreesToRadians(deg: number): number {
  return (deg * Math.PI) / 180;
}
  export function radiansToDegrees(rad: number): number {
  return (rad * 180) / Math.PI;
}
  function memoryStore() { return memory = parseFloat(display) || 0; }
  function memoryRecall() { display = memory.toString(); expression = memory.toString(); }
  function memoryClear() { return memory = 0; }
  function memoryAdd() { return memory = memory + (parseFloat(display) || 0); }
  async function copyResult() {
    await navigator.clipboard.writeText(display);
    copied = true;
    if (timerRef) clearTimeout(timerRef);
    timerRef = setTimeout(() => copied = false, 2000);
  }

</script>

{#snippet Button(value, onClick, className)}
<button
      onclick={onClick}
      class={`p-3 rounded-lg font-mono text-sm transition-colors text-gray-900 dark:text-white ${className}`}
    >
      {value}
    </button>
{/snippet}


    <div class="max-w-md mx-auto space-y-4">
      <!-- 显示屏 -->
      <div class="p-4 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
        <div class="text-xs text-gray-500 dark:text-gray-300 h-5 overflow-hidden">{expression || '0'}</div>
        <div class="flex items-center justify-between">
          <div class={`text-2xl font-mono truncate ${error ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
            {display}
          </div>
          <button
            onclick={copyResult}
            class={`px-2 py-1 text-xs rounded ${copied ? 'btn-success' : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600'}`}
          >
            {copied ? '✓' : t('copy')}
          </button>
        </div>
      </div>

      <!-- 模式切换 -->
      <div class="flex items-center justify-between px-2">
        <div class="flex items-center gap-2">
          <span class="text-xs text-gray-600 dark:text-gray-300">{t('sci.angleMode')}:</span>
          <button
            onclick={() => isRadians = true}
            class={`px-2 py-1 text-xs rounded ${isRadians ? 'bg-amber-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white'}`}
          >
            RAD
          </button>
          <button
            onclick={() => isRadians = false}
            class={`px-2 py-1 text-xs rounded ${!isRadians ? 'bg-amber-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white'}`}
          >
            DEG
          </button>
        </div>
        <div class="text-xs text-gray-600 dark:text-gray-300">M: {memory}</div>
      </div>

      <!-- 按钮区域 -->
      <div class="grid grid-cols-5 gap-2">
        <!-- 第一行：内存和清除 -->
        {@render Button("MC", undefined /* missing: onClick */, undefined /* missing: className */)}
        {@render Button("MR", undefined /* missing: onClick */, undefined /* missing: className */)}
        {@render Button("M+", undefined /* missing: onClick */, undefined /* missing: className */)}
        {@render Button("MS", undefined /* missing: onClick */, undefined /* missing: className */)}
        {@render Button("C", undefined /* missing: onClick */, undefined /* missing: className */)}

        <!-- 第二行：科学函数 -->
        {@render Button("sin", undefined /* missing: onClick */, undefined /* missing: className */)}
        {@render Button("cos", undefined /* missing: onClick */, undefined /* missing: className */)}
        {@render Button("tan", undefined /* missing: onClick */, undefined /* missing: className */)}
        {@render Button("(", undefined /* missing: onClick */, undefined /* missing: className */)}
        {@render Button(")", undefined /* missing: onClick */, undefined /* missing: className */)}

        <!-- 第三行：更多函数 -->
        {@render Button("ln", undefined /* missing: onClick */, undefined /* missing: className */)}
        {@render Button("log", undefined /* missing: onClick */, undefined /* missing: className */)}
        {@render Button("√", undefined /* missing: onClick */, undefined /* missing: className */)}
        {@render Button("xʸ", undefined /* missing: onClick */, undefined /* missing: className */)}
        {@render Button("⌫", undefined /* missing: onClick */, undefined /* missing: className */)}

        <!-- 第四行：常数和阶乘 -->
        {@render Button("π", undefined /* missing: onClick */, undefined /* missing: className */)}
        {@render Button("e", undefined /* missing: onClick */, undefined /* missing: className */)}
        {@render Button("n!", undefined /* missing: onClick */, undefined /* missing: className */)}
        {@render Button("%", undefined /* missing: onClick */, undefined /* missing: className */)}
        {@render Button("÷", undefined /* missing: onClick */, undefined /* missing: className */)}

        <!-- 数字键盘 -->
        {@render Button("7", undefined /* missing: onClick */, undefined /* missing: className */)}
        {@render Button("8", undefined /* missing: onClick */, undefined /* missing: className */)}
        {@render Button("9", undefined /* missing: onClick */, undefined /* missing: className */)}
        {@render Button("×", undefined /* missing: onClick */, undefined /* missing: className */)}
        {@render Button("−", undefined /* missing: onClick */, undefined /* missing: className */)}

        {@render Button("4", undefined /* missing: onClick */, undefined /* missing: className */)}
        {@render Button("5", undefined /* missing: onClick */, undefined /* missing: className */)}
        {@render Button("6", undefined /* missing: onClick */, undefined /* missing: className */)}
        {@render Button("+", undefined /* missing: onClick */, undefined /* missing: className */)}
        {@render Button("=", undefined /* missing: onClick */, undefined /* missing: className */)}

        {@render Button("1", undefined /* missing: onClick */, undefined /* missing: className */)}
        {@render Button("2", undefined /* missing: onClick */, undefined /* missing: className */)}
        {@render Button("3", undefined /* missing: onClick */, undefined /* missing: className */)}
        {@render Button(".", undefined /* missing: onClick */, undefined /* missing: className */)}

        {@render Button("0", undefined /* missing: onClick */, undefined /* missing: className */)}
        {@render Button("00", undefined /* missing: onClick */, undefined /* missing: className */)}
        {@render Button({ value: "±", onclick: () => {
          const num = parseFloat(display);
          if (!isNaN(num)) {
            const negated = (-num).toString();
            display = negated;
            expression = negated;
          }
        }, class: "bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700" })}
      </div>

      <!-- 快捷公式 -->
      <div class="p-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg">
        <div class="text-xs text-gray-600 dark:text-gray-300 mb-2">{t('sci.quickFormulas')}</div>
        <div class="flex flex-wrap gap-2">
          {#each ['sin(π/6)', 'cos(π/4)', 'sqrt(2)', 'log(100)', 'e^2'] as formula (formula)}
<button 
              onclick={() => { display = formula; expression = formula; }}
              class="px-2 py-1 text-xs bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 rounded font-mono"
            >
              {formula}
            </button>
{/each}
        </div>
      </div>
    </div>
  
