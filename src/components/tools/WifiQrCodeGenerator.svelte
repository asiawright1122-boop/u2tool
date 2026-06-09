<script lang="ts">
  import { Check, Copy, Download, RefreshCw } from 'lucide-svelte';
  import QRCode from 'qrcode';
  import { onDestroy } from 'svelte';

  interface Props {
    locale?: string;
    translations?: Record<string, unknown>;
  }

  let { locale = 'en', translations = {} }: Props = $props();

  const COPY = {
    title: 'WiFi QR Code Generator',
    subtitle: 'Create a standard WiFi QR payload and a scannable PNG preview in your browser.',
    ssid: 'Network name (SSID)',
    password: 'Password',
    encryption: 'Encryption',
    hidden: 'Hidden network',
    noPassword: 'No password',
    yes: 'Yes',
    no: 'No',
    payload: 'WiFi payload',
    preview: 'QR preview',
    copy: 'Copy payload',
    copied: 'Copied',
    download: 'Download QR Code',
    reset: 'Reset',
    empty: 'Enter a network name to generate a WiFi QR code.',
    localNote: 'Generated locally. Passwords are not uploaded.',
  };

  let ssid = $state('Guest WiFi');
  let password = $state('welcome-2026');
  let encryption = $state('WPA');
  let hidden = $state(false);
  let qrDataUrl = $state('');
  let copied = $state(false);
  let copyTimer: ReturnType<typeof setTimeout> | null = null;

  const wifiPayload = $derived(buildWifiPayload(ssid, password, encryption, hidden));

  $effect(() => {
    if (!wifiPayload) {
      qrDataUrl = '';
      return;
    }

    const currentPayload = wifiPayload;
    QRCode.toDataURL(currentPayload, {
      width: 320,
      margin: 2,
      color: { dark: '#111827', light: '#ffffff' },
    })
      .then((dataUrl) => {
        if (wifiPayload === currentPayload) {
          qrDataUrl = dataUrl;
        }
      })
      .catch(() => {
        if (wifiPayload === currentPayload) {
          qrDataUrl = '';
        }
      });
  });

  onDestroy(() => {
    if (copyTimer) {
      clearTimeout(copyTimer);
    }
  });

  function buildWifiPayload(networkName: string, networkPassword: string, networkEncryption: string, isHidden: boolean) {
    const trimmedSsid = networkName.trim();
    if (!trimmedSsid) {
      return '';
    }

    const normalizedEncryption = networkEncryption === 'nopass' ? 'nopass' : networkEncryption;
    const normalizedPassword = normalizedEncryption === 'nopass' ? '' : networkPassword;
    return `WIFI:T:${normalizedEncryption};S:${escapeWifi(trimmedSsid)};P:${escapeWifi(normalizedPassword)};H:${isHidden ? 'true' : 'false'};;`;
  }

  function escapeWifi(value: string) {
    return value.replace(/([\\;,":])/g, '\\$1');
  }

  async function copyPayload() {
    if (!wifiPayload) {
      return;
    }

    await navigator.clipboard.writeText(wifiPayload);
    copied = true;
    if (copyTimer) {
      clearTimeout(copyTimer);
    }
    copyTimer = setTimeout(() => {
      copied = false;
    }, 1800);
  }

  function downloadQr() {
    if (!qrDataUrl) {
      return;
    }

    const link = document.createElement('a');
    link.href = qrDataUrl;
    link.download = 'wifi-qr-code.png';
    link.click();
  }

  function resetForm() {
    ssid = 'Guest WiFi';
    password = 'welcome-2026';
    encryption = 'WPA';
    hidden = false;
  }
</script>

<div class="space-y-6">
  <div>
    <h2 class="text-xl font-bold text-slate-900 dark:text-white">{COPY.title}</h2>
    <p class="mt-2 text-sm text-slate-600 dark:text-slate-400">{COPY.subtitle}</p>
  </div>

  <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
    <div>
      <label for="wifi-ssid" class="tool-label">{COPY.ssid}</label>
      <input
        id="wifi-ssid"
        class="tool-input"
        type="text"
        bind:value={ssid}
        autocomplete="off"
        placeholder="Guest WiFi"
      />
    </div>

    <div>
      <label for="wifi-password" class="tool-label">{COPY.password}</label>
      <input
        id="wifi-password"
        class="tool-input"
        type="text"
        bind:value={password}
        autocomplete="off"
        disabled={encryption === 'nopass'}
        placeholder="welcome-2026"
      />
    </div>

    <div>
      <label for="wifi-encryption" class="tool-label">{COPY.encryption}</label>
      <select id="wifi-encryption" class="tool-input" bind:value={encryption}>
        <option value="WPA">WPA/WPA2/WPA3</option>
        <option value="WEP">WEP</option>
        <option value="nopass">{COPY.noPassword}</option>
      </select>
    </div>

    <div>
      <label for="wifi-hidden" class="tool-label">{COPY.hidden}</label>
      <select id="wifi-hidden" class="tool-input" bind:value={hidden}>
        <option value={false}>{COPY.no}</option>
        <option value={true}>{COPY.yes}</option>
      </select>
    </div>
  </div>

  <div class="flex flex-wrap gap-3">
    <button type="button" class="btn-primary inline-flex items-center gap-2" onclick={copyPayload} disabled={!wifiPayload}>
      {#if copied}
        <Check class="h-4 w-4" aria-hidden="true" />
        {COPY.copied}
      {:else}
        <Copy class="h-4 w-4" aria-hidden="true" />
        {COPY.copy}
      {/if}
    </button>
    <button type="button" class="btn-secondary inline-flex items-center gap-2" onclick={downloadQr} disabled={!qrDataUrl}>
      <Download class="h-4 w-4" aria-hidden="true" />
      {COPY.download}
    </button>
    <button type="button" class="btn-secondary inline-flex items-center gap-2" onclick={resetForm}>
      <RefreshCw class="h-4 w-4" aria-hidden="true" />
      {COPY.reset}
    </button>
  </div>

  <div class="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
    <div>
      <div class="tool-label">{COPY.payload}</div>
      {#if wifiPayload}
        <pre class="min-h-32 overflow-x-auto rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-800 whitespace-pre-wrap break-words dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200">{wifiPayload}</pre>
      {:else}
        <div class="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-200">
          {COPY.empty}
        </div>
      {/if}
      <p class="mt-3 text-xs font-medium text-slate-500 dark:text-slate-400">{COPY.localNote}</p>
    </div>

    <div>
      <div class="tool-label">{COPY.preview}</div>
      <div class="flex min-h-[320px] items-center justify-center rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-950">
        {#if qrDataUrl}
          <img
            src={qrDataUrl}
            alt="Scannable WiFi QR code"
            width="320"
            height="320"
            class="h-auto w-full max-w-[320px]"
          />
        {:else}
          <span class="text-sm text-slate-500 dark:text-slate-400">{COPY.empty}</span>
        {/if}
      </div>
    </div>
  </div>
</div>
