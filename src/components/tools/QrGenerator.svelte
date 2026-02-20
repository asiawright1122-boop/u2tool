<script lang="ts">
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

  // Imports
  import QRCode from 'qrcode';

  let input = $state('https://example.com');

  let qrDataUrl = $state('');

  $effect(() => {
    generateQR();
  });

  // Functions
  async function generateQR() {
    if (!input.trim()) return;
    
    try {
      // 生成二维码，设置颜色为黑色前景和白色背景
      const dataUrl = await QRCode.toDataURL(input, {
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#ffffff',
        },
      });
      qrDataUrl = dataUrl;
    } catch (_err) {
      console.error('Error generating QR code:', _err);
    }
  }
  function downloadQR() {
    if (!qrDataUrl) return;
    
    const link = document.createElement('a');
    link.download = 'qrcode.png';
    link.href = qrDataUrl;
    link.click();
  }

</script>


    <div class="space-y-4">
      <div>
        <label class="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">{t('input')}</label>
        <textarea
          class="tool-textarea h-24"
          bind:value={input}
          placeholder={t('inputPlaceholder')}></textarea>
      </div>

      <div class="flex gap-2">
        <button onclick={generateQR} class="btn-primary">
          {t('qr.generateQr')}
        </button>
        {#if qrDataUrl}
<button onclick={downloadQR} class="btn-secondary">
            {t('qr.downloadPng')}
          </button>
{/if}
      </div>

      {#if qrDataUrl}
<div class="flex justify-center p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <img 
            src={qrDataUrl} 
            alt="QR Code" 
            width={300}
            height={300}
            class="max-w-[300px]"
            style="aspect-ratio: 1/1"
          />
        </div>
{/if}
    </div>
  
