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
  function tp(key: string): string {
    const scope = translations['tools']['password-generator'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.password-generator.${key}`;
  }

  let password = $state('');

  let length = $state(16);

  let options = $state({
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
  });

  let copied = $state(false);

  let timerRef = $state(null);

  $effect(() => {
    generatePassword();
  });  onDestroy(() => {
    if (timerRef) clearTimeout(timerRef);
  });

  // Functions
  function generatePassword() {
    let chars = '';
    if (options.uppercase) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (options.lowercase) chars += 'abcdefghijklmnopqrstuvwxyz';
    if (options.numbers) chars += '0123456789';
    if (options.symbols) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';

    if (!chars) {
      password = tp('selectOption');
      return;
    }

    let result = '';
    const array = new Uint32Array(length);
    crypto.getRandomValues(array);
    for (let i = 0; i < length; i++) {
      result += chars[array[i] % chars.length];
    }
    password = result;
  }
  async function copyPassword() {
    await navigator.clipboard.writeText(password);
    copied = true;
    if (timerRef) clearTimeout(timerRef);
    timerRef = setTimeout(() => copied = false, 2000);
  }
  function toggleOption(key: keyof typeof options) {
    options = ({ ...options, [key]: !options[key] });
  }

</script>


    <div class="space-y-6">
      <!-- Password Display -->
      <div class="p-4 bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg">
        <div class="flex items-center justify-between">
          <span class="font-mono text-lg break-all select-all text-gray-900 dark:text-gray-100">{password}</span>
          <button
            onclick={copyPassword}
            class={`ml-4 px-4 py-2 rounded text-white ${copied ? 'bg-green-600' : 'bg-blue-600 hover:bg-blue-700'}`}
          >
            {copied ? t('copied') : t('copy')}
          </button>
        </div>
      </div>

      <!-- Length Slider -->
      <div>
        <label for="password-length" class="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
          {t('length')}: {length}
        </label>
        <input
          id="password-length"
          name="passwordLength"
          type="range"
          min="8"
          max="64"
          value={length}
          onchange={(e) => length = parseInt(e.target.value)}
          class="w-full"
        />
      </div>

      <!-- Options -->
      <div class="grid grid-cols-2 gap-4">
        {#each [
          { key: 'uppercase', label: 'Uppercase (A-Z)' },
          { key: 'lowercase', label: 'Lowercase (a-z)' },
          { key: 'numbers', label: 'Numbers (0-9)' },
          { key: 'symbols', label: 'Symbols (!@#$)' },
        ] as { key, label } (key)}
<label  class="flex items-center gap-2 cursor-pointer text-gray-700 dark:text-gray-300">
            <input
              id={`password-option-${key}`}
              name={`option-${key}`}
              type="checkbox"
              checked={options[key as keyof typeof options]}
              onchange={() => toggleOption(key as keyof typeof options)}
              class="w-4 h-4"
            />
            <span>{label}</span>
          </label>
{/each}
      </div>

      <!-- Generate Button -->
      <button onclick={generatePassword} class="btn-primary w-full">
        {t('generate')}
      </button>
    </div>
  
