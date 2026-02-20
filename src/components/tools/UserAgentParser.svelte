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

  // Types
  interface ParsedUA {
  browser: { name: string; version: string };
  os: { name: string; version: string };
  device: { type: string; vendor: string; model: string };
  engine: { name: string; version: string };
}

  let userAgent = $state('');

  let parsed = $state(null);

  $effect(() => {
    if (typeof navigator !== 'undefined') {
      userAgent = navigator.userAgent;
    }
  });

  $effect(() => {
    if (userAgent) {
      parsed = parseUserAgent(userAgent);
    } else {
      parsed = null;
    }
  });

  // Functions
  export function parseUserAgent(ua: string): ParsedUA {
  const result: ParsedUA = {
    browser: { name: 'Unknown', version: '' },
    os: { name: 'Unknown', version: '' },
    device: { type: 'Desktop', vendor: '', model: '' },
    engine: { name: 'Unknown', version: '' },
  };

  if (!ua) return result;

  // Browser detection
  if (/Edg\/(\d+[.\d]*)/.test(ua)) {
    result.browser = { name: 'Edge', version: RegExp.$1 };
  } else if (/OPR\/(\d+[.\d]*)/.test(ua) || /Opera\/(\d+[.\d]*)/.test(ua)) {
    result.browser = { name: 'Opera', version: RegExp.$1 };
  } else if (/Chrome\/(\d+[.\d]*)/.test(ua)) {
    result.browser = { name: 'Chrome', version: RegExp.$1 };
  } else if (/Firefox\/(\d+[.\d]*)/.test(ua)) {
    result.browser = { name: 'Firefox', version: RegExp.$1 };
  } else if (/Safari\/(\d+[.\d]*)/.test(ua) && /Version\/(\d+[.\d]*)/.test(ua)) {
    result.browser = { name: 'Safari', version: RegExp.$1 };
  } else if (/MSIE (\d+[.\d]*)/.test(ua) || /Trident.*rv:(\d+[.\d]*)/.test(ua)) {
    result.browser = { name: 'Internet Explorer', version: RegExp.$1 };
  }

  // OS detection
  if (/Windows NT (\d+[.\d]*)/.test(ua)) {
    const version = RegExp.$1;
    const winVersions: Record<string, string> = {
      '10.0': '10/11', '6.3': '8.1', '6.2': '8', '6.1': '7', '6.0': 'Vista', '5.1': 'XP'
    };
    result.os = { name: 'Windows', version: winVersions[version] || version };
  } else if (/Mac OS X (\d+[_.\d]*)/.test(ua)) {
    result.os = { name: 'macOS', version: RegExp.$1.replace(/_/g, '.') };
  } else if (/Android (\d+[.\d]*)/.test(ua)) {
    result.os = { name: 'Android', version: RegExp.$1 };
    result.device.type = 'Mobile';
  } else if (/iPhone|iPad|iPod/.test(ua)) {
    result.os.name = 'iOS';
    if (/OS (\d+[_\d]*)/.test(ua)) {
      result.os.version = RegExp.$1.replace(/_/g, '.');
    }
    result.device.type = /iPad/.test(ua) ? 'Tablet' : 'Mobile';
    result.device.vendor = 'Apple';
  } else if (/Linux/.test(ua)) {
    result.os = { name: 'Linux', version: '' };
  }

  // Engine detection
  if (/AppleWebKit\/(\d+[.\d]*)/.test(ua)) {
    result.engine = { name: 'WebKit', version: RegExp.$1 };
  } else if (/Gecko\/(\d+)/.test(ua)) {
    result.engine = { name: 'Gecko', version: RegExp.$1 };
  } else if (/Trident\/(\d+[.\d]*)/.test(ua)) {
    result.engine = { name: 'Trident', version: RegExp.$1 };
  }

  // Device detection
  if (/Mobile|Android/.test(ua) && !/iPad/.test(ua)) {
    result.device.type = 'Mobile';
  } else if (/Tablet|iPad/.test(ua)) {
    result.device.type = 'Tablet';
  }

  return result;
}
  function useCurrentUA() {
    if (typeof navigator !== 'undefined') {
      userAgent = navigator.userAgent;
    }
  }

</script>


    <div class="space-y-6">
      <div>
        <label class="block text-sm font-medium mb-2">{t('uaParser.userAgent')}</label>
        <div class="flex gap-2">
          <textarea
            bind:value={userAgent}
            placeholder={t('uaParser.placeholder')}
            class="flex-1 h-24 p-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg font-mono text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-gray-100"></textarea>
        </div>
        <button
          onclick={useCurrentUA}
          class="mt-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg text-sm"
        >
          {t('uaParser.useCurrent')}
        </button>
      </div>

      {#if parsed}
<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="p-4 bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg">
            <div class="text-sm text-gray-600 dark:text-gray-300 mb-2">{t('uaParser.browser')}</div>
            <div class="text-lg font-medium">{parsed.browser.name}</div>
            {#if parsed.browser.version}
<div class="text-sm text-gray-600 dark:text-gray-300">{t('uaParser.version')}: {parsed.browser.version}</div>
{/if}
          </div>

          <div class="p-4 bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg">
            <div class="text-sm text-gray-600 dark:text-gray-300 mb-2">{t('uaParser.os')}</div>
            <div class="text-lg font-medium">{parsed.os.name}</div>
            {#if parsed.os.version}
<div class="text-sm text-gray-600 dark:text-gray-300">{t('uaParser.version')}: {parsed.os.version}</div>
{/if}
          </div>

          <div class="p-4 bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg">
            <div class="text-sm text-gray-600 dark:text-gray-300 mb-2">{t('uaParser.device')}</div>
            <div class="text-lg font-medium">{parsed.device.type}</div>
            {#if parsed.device.vendor}
<div class="text-sm text-gray-600 dark:text-gray-300">{parsed.device.vendor} {parsed.device.model}</div>
{/if}
          </div>

          <div class="p-4 bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg">
            <div class="text-sm text-gray-600 dark:text-gray-300 mb-2">{t('uaParser.engine')}</div>
            <div class="text-lg font-medium">{parsed.engine.name}</div>
            {#if parsed.engine.version}
<div class="text-sm text-gray-600 dark:text-gray-300">{t('uaParser.version')}: {parsed.engine.version}</div>
{/if}
          </div>
        </div>
{/if}
    </div>
  
