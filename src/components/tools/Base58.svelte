<script lang="ts">
  import { onDestroy } from 'svelte';

  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  const BASE58_ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
  const BASE58_BASE = 58n;
  const BASE58_LOOKUP = new Map(
    Array.from(BASE58_ALPHABET).map((char, index) => [char, BigInt(index)])
  );

  function bytesToBigInt(bytes: Uint8Array): bigint {
    let value = 0n;
    for (const byte of bytes) {
      value = (value << 8n) + BigInt(byte);
    }
    return value;
  }

  function bigIntToBytes(value: bigint): Uint8Array {
    if (value === 0n) {
      return new Uint8Array();
    }

    const bytes: number[] = [];
    let remaining = value;

    while (remaining > 0n) {
      bytes.unshift(Number(remaining & 0xffn));
      remaining >>= 8n;
    }

    return Uint8Array.from(bytes);
  }

  function encodeBase58Value(input: string): string {
    const bytes = new TextEncoder().encode(input);
    if (bytes.length === 0) {
      return '';
    }

    let leadingZeroBytes = 0;
    while (leadingZeroBytes < bytes.length && bytes[leadingZeroBytes] === 0) {
      leadingZeroBytes += 1;
    }

    let value = bytesToBigInt(bytes);
    let encoded = '';

    while (value > 0n) {
      const remainder = Number(value % BASE58_BASE);
      encoded = `${BASE58_ALPHABET[remainder]}${encoded}`;
      value /= BASE58_BASE;
    }

    return `${'1'.repeat(leadingZeroBytes)}${encoded}`;
  }

  function decodeBase58Value(input: string): string {
    const trimmed = input.trim();
    if (!trimmed) {
      return '';
    }

    let leadingOnes = 0;
    while (leadingOnes < trimmed.length && trimmed[leadingOnes] === '1') {
      leadingOnes += 1;
    }

    let value = 0n;
    for (const char of trimmed) {
      const digit = BASE58_LOOKUP.get(char);
      if (digit === undefined) {
        throw new Error(`Invalid Base58 character: ${char}`);
      }

      value = value * BASE58_BASE + digit;
    }

    const decoded = bigIntToBytes(value);
    const prefix = new Uint8Array(leadingOnes);
    const merged = new Uint8Array(prefix.length + decoded.length);
    merged.set(prefix);
    merged.set(decoded, prefix.length);

    return new TextDecoder().decode(merged);
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
  function tb(key: string): string {
    const scope = translations['tools']['base58'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.base58.${key}`;
  }

  let input = $state('');

  let output = $state('');

  let error = $state('');

  let copied = $state(false);

  let timerRef = $state<ReturnType<typeof setTimeout> | null>(null);

  onDestroy(() => {
    if (timerRef) clearTimeout(timerRef);
  });

  // Functions
  function encode() {
    if (!input.trim()) {
      output = '';
      error = '';
      return;
    }
    try {
      output = encodeBase58Value(input);
      error = '';
    } catch (_e) {
      error = t('errorEncoding');
      output = '';
    }
  }
  function decode() {
    if (!input.trim()) {
      output = '';
      error = '';
      return;
    }
    try {
      output = decodeBase58Value(input);
      error = '';
    } catch (e: unknown) {
      error = e instanceof Error ? e.message : t('errorInvalidInput');
      output = '';
    }
  }
  async function copyOutput() {
    await navigator.clipboard.writeText(output);
    copied = true;
    if (timerRef) clearTimeout(timerRef);
    timerRef = setTimeout(() => copied = false, 2000);
  }

</script>


    <div class="space-y-4">
      <div>
        <label for="base58-input" class="block text-sm font-medium mb-2">{t('input')}</label>
        <textarea
          id="base58-input"
          name="inputValue"
          class="tool-textarea"
          bind:value={input}
          placeholder={tb('placeholder')}
          rows={4}></textarea>
      </div>

      {#if error}
<div class="text-red-400 text-sm bg-red-900/20 p-2 rounded">{error}</div>
{/if}

      <div class="flex flex-wrap gap-2">
        <button onclick={encode} class="btn-primary">
          {tb('encodeBtn')}
        </button>
        <button onclick={decode} class="btn-secondary">
          {tb('decodeBtn')}
        </button>
        <button onclick={() => { input = ''; output = ''; error = ''; }} class="btn-secondary">
          {t('clear')}
        </button>
      </div>

      <div>
        <div class="flex justify-between items-center mb-2">
          <label for="base58-output" class="text-sm font-medium">{t('output')}</label>
          {#if output}
<button
              onclick={copyOutput}
              class={`text-sm px-3 py-1 rounded ${copied ? 'bg-green-600' : 'bg-gray-700 hover:bg-gray-600'}`}
            >
              {copied ? t('copied') : t('copy')}
            </button>
{/if}
        </div>
        <textarea
          id="base58-output"
          name="outputValue"
          class="tool-textarea"
          value={output}
          readOnly
          placeholder={tb('resultPlaceholder')}
          rows={4}></textarea>
      </div>

      <div class="p-4 bg-gray-100 dark:bg-gray-800/50 rounded-lg text-sm text-gray-600 dark:text-gray-300">
        <h3 class="font-medium text-gray-900 dark:text-white mb-2">{tb('aboutTitle')}</h3>
        <p class="mb-2">
          {tb('aboutText')}
        </p>
        <p class="font-mono text-xs">
          Alphabet: {BASE58_ALPHABET}
        </p>
      </div>
    </div>
  
