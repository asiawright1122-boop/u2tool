<script lang="ts">
  import { onDestroy } from 'svelte';

  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['gdpr-consent-generator'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.gdpr-consent-generator.${key}`;
  }

  // Types
  interface ConsentConfig {
  websiteName: string;
  websiteUrl: string;
  companyName: string;
  email: string;
  cookieTypes: {
    necessary: boolean;
    analytics: boolean;
    marketing: boolean;
    preferences: boolean;
  };
  style: 'banner' | 'popup' | 'floating';
  position: 'top' | 'bottom';
  theme: 'light' | 'dark';
  language: string;
}

  let config = $state({
    websiteName: 'My Website',
    websiteUrl: 'https://example.com',
    companyName: 'My Company',
    email: 'privacy@example.com',
    cookieTypes: {
      necessary: true,
      analytics: true,
      marketing: true,
      preferences: true,
    },
    style: 'banner',
    position: 'bottom',
    theme: 'light',
    language: 'en',
  });

  let copied = $state(null);

  let timerRef = $state(null);  onDestroy(() => {
    if (timerRef) clearTimeout(timerRef);
  });

  // Functions
  function generateHtmlCode(): string {
    const bgColor = config.theme === 'light' ? '#ffffff' : '#1f2937';
    const textColor = config.theme === 'light' ? '#374151' : '#f3f4f6';
    const borderColor = config.theme === 'light' ? '#e5e7eb' : '#374151';
    const btnBgColor = '#2563eb';

    return `<!-- GDPR Cookie Consent Banner -->
<div id="gdpr-consent-banner" style="
  display: none;
  position: fixed;
  ${config.position}: 0;
  left: 0;
  right: 0;
  background: ${bgColor};
  border-${config.position === 'bottom' ? 'top' : 'bottom'}: 1px solid ${borderColor};
  padding: 20px;
  z-index: 9999;
  box-shadow: 0 -2px 10px rgba(0,0,0,0.1);
">
  <div style="max-width: 1200px; margin: 0 auto;">
    <div style="display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 20px;">
      <div style="flex: 1; min-width: 300px;">
        <h3 style="margin: 0 0 10px 0; color: ${textColor}; font-size: 18px;"><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5"/><path d="M8.5 8.5v.01"/><path d="M16 15.5v.01"/><path d="M12 12v.01"/><path d="M11 17v.01"/><path d="M7 14v.01"/></svg> ${t('bannerTitle')}</h3>
        <p style="margin: 0; color: ${textColor}; font-size: 14px; line-height: 1.5;">
          ${config.websiteName} uses cookies to enhance your browsing experience, analyze site traffic, and personalize content.
          By clicking "Accept All", you consent to our use of cookies.
          <a href="${config.websiteUrl}/privacy-policy" style="color: ${btnBgColor};">Learn more</a>
        </p>
      </div>
      <div style="display: flex; gap: 10px; flex-wrap: wrap;">
        <button onclick="gdprDecline()" style="
          padding: 10px 20px;
          border: 1px solid ${borderColor};
          background: transparent;
          color: ${textColor};
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
        ">${t('decline')}</button>
        <button onclick="gdprShowSettings()" style="
          padding: 10px 20px;
          border: 1px solid ${borderColor};
          background: transparent;
          color: ${textColor};
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
        ">${t('customize')}</button>
        <button onclick="gdprAcceptAll()" style="
          padding: 10px 20px;
          border: none;
          background: ${btnBgColor};
          color: white;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
        ">${t('acceptAll')}</button>
      </div>
    </div>
  </div>
</div>

<script>
(function() {
  const CONSENT_KEY = 'gdpr_consent';
  const banner = document.getElementById('gdpr-consent-banner');
  
  function getConsent() {
    try {
      return JSON.parse(localStorage.getItem(CONSENT_KEY) || 'null');
    } catch { return null; }
  }
  
  function setConsent(consent) {
    localStorage.setItem(CONSENT_KEY, JSON.stringify({
      ...consent,
      timestamp: new Date().toISOString()
    }));
    banner.style.display = 'none';
    applyConsent(consent);
  }
  
  function applyConsent(consent) {
    if (consent.analytics) {
      // Enable analytics cookies
      console.log('Analytics enabled');
    }
    if (consent.marketing) {
      // Enable marketing cookies
      console.log('Marketing enabled');
    }
  }
  
  window.gdprAcceptAll = function() {
    setConsent({ necessary: true, analytics: true, marketing: true, preferences: true });
  };
  
  window.gdprDecline = function() {
    setConsent({ necessary: true, analytics: false, marketing: false, preferences: false });
  };
  
  window.gdprShowSettings = function() {
    // Implement settings modal
    alert('Cookie settings - implement your custom modal here');
  };
  
  // Check if consent already given
  const existingConsent = getConsent();
  if (!existingConsent) {
    banner.style.display = 'block';
  } else {
    applyConsent(existingConsent);
  }
})();
<\/script>`;
  }
  function generateCssCode(): string {
    return `/* GDPR Consent Banner Styles */
#gdpr-consent-banner {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

#gdpr-consent-banner button:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

#gdpr-consent-banner button:active {
  transform: translateY(0);
}

@media (max-width: 768px) {
  #gdpr-consent-banner > div > div {
    flex-direction: column;
    text-align: center;
  }
  
  #gdpr-consent-banner button {
    width: 100%;
  }
}`;
  }
  function generatePrivacyPolicy(): string {
    return `# Privacy Policy for ${config.websiteName}

Last updated: ${new Date().toLocaleDateString()}

## Introduction

${config.companyName} ("we", "our", or "us") operates ${config.websiteName} (${config.websiteUrl}). This Privacy Policy explains how we collect, use, and protect your personal information in compliance with the General Data Protection Regulation (GDPR).

## Data Controller

${config.companyName}
Email: ${config.email}

## Types of Cookies We Use

${config.cookieTypes.necessary ? `### Necessary Cookies
These cookies are essential for the website to function properly. They cannot be disabled.` : ''}

${config.cookieTypes.analytics ? `### Analytics Cookies
We use analytics cookies to understand how visitors interact with our website. This helps us improve our services.` : ''}

${config.cookieTypes.marketing ? `### Marketing Cookies
Marketing cookies are used to track visitors across websites to display relevant advertisements.` : ''}

${config.cookieTypes.preferences ? `### Preference Cookies
These cookies remember your preferences and settings to enhance your experience.` : ''}

## Your Rights Under GDPR

You have the following rights:
- Right to access your personal data
- Right to rectification of inaccurate data
- Right to erasure ("right to be forgotten")
- Right to restrict processing
- Right to data portability
- Right to object to processing
- Right to withdraw consent

## Contact Us

For any privacy-related questions, please contact us at:
Email: ${config.email}

## Changes to This Policy

We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.`;
  }
  function copyToClipboard(text: string, type: string) {
    navigator.clipboard.writeText(text);
    copied = type;
    setTimeout(() => copied = null, 2000);
  }

</script>


    <div class="space-y-6">
      <!-- Configuration -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label for="gdpr-consent-generator-field-12" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('websiteName')}
          </label>
          <input
            type="text"
            value={config.websiteName}
            onchange={(e) => config = { ...config, websiteName: e.target.value }}
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white" id="gdpr-consent-generator-field-12" />
        </div>
        <div>
          <label for="gdpr-consent-generator-field-11" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('websiteUrl')}
          </label>
          <input
            type="url"
            value={config.websiteUrl}
            onchange={(e) => config = { ...config, websiteUrl: e.target.value }}
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white" id="gdpr-consent-generator-field-11" />
        </div>
        <div>
          <label for="gdpr-consent-generator-field-10" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('companyName')}
          </label>
          <input
            type="text"
            value={config.companyName}
            onchange={(e) => config = { ...config, companyName: e.target.value }}
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white" id="gdpr-consent-generator-field-10" />
        </div>
        <div>
          <label for="gdpr-consent-generator-field-9" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('privacyEmail')}
          </label>
          <input
            type="email"
            value={config.email}
            onchange={(e) => config = { ...config, email: e.target.value }}
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white" id="gdpr-consent-generator-field-9" />
        </div>
      </div>

      <!-- Cookie Types -->
      <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          {t('cookieTypes')}
        </h3>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          {#each Object.entries(config.cookieTypes) as [key, value] (key)}
<label  class="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={value}
                disabled={key === 'necessary'}
                onchange={(e) => config = {
                  ...config,
                  cookieTypes: { ...config.cookieTypes, [key]: e.target.checked }
                }}
                class="w-4 h-4 rounded"
              />
              <span class="text-sm text-gray-700 dark:text-gray-300">
                {t(`cookies.${key}`)}
              </span>
            </label>
{/each}
        </div>
      </div>

      <!-- Style Options -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label for="gdpr-consent-generator-field-8" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('position')}
          </label>
          <select
            value={config.position}
            onchange={(e) => config = { ...config, position: e.target.value as 'top' | 'bottom' }}
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white" id="gdpr-consent-generator-field-8">
            <option value="top">{t('positionTop')}</option>
            <option value="bottom">{t('positionBottom')}</option>
          </select>
        </div>
        <div>
          <label for="gdpr-consent-generator-field-7" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('theme')}
          </label>
          <select
            value={config.theme}
            onchange={(e) => config = { ...config, theme: e.target.value as 'light' | 'dark' }}
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white" id="gdpr-consent-generator-field-7">
            <option value="light">{t('themeLight')}</option>
            <option value="dark">{t('themeDark')}</option>
          </select>
        </div>
      </div>

      <!-- Generated Code -->
      <div class="space-y-4">
        <div>
          <div class="flex items-center justify-between mb-2">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">
              {t('htmlCode')}
            </h3>
            <button
              onclick={() => copyToClipboard(generateHtmlCode(), 'html')}
              class="px-3 py-1 text-sm bg-amber-600 text-white rounded hover:bg-amber-700"
            >
              {copied === 'html' ? t('copied') : t('copy')}
            </button>
          </div>
          <pre class="p-4 bg-gray-900 text-gray-100 rounded-lg overflow-x-auto text-sm max-h-64">
            <code>{generateHtmlCode()}</code>
          </pre>
        </div>

        <div>
          <div class="flex items-center justify-between mb-2">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">
              {t('cssCode')}
            </h3>
            <button
              onclick={() => copyToClipboard(generateCssCode(), 'css')}
              class="px-3 py-1 text-sm bg-amber-600 text-white rounded hover:bg-amber-700"
            >
              {copied === 'css' ? t('copied') : t('copy')}
            </button>
          </div>
          <pre class="p-4 bg-gray-900 text-gray-100 rounded-lg overflow-x-auto text-sm max-h-48">
            <code>{generateCssCode()}</code>
          </pre>
        </div>

        <div>
          <div class="flex items-center justify-between mb-2">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">
              {t('privacyPolicy')}
            </h3>
            <button
              onclick={() => copyToClipboard(generatePrivacyPolicy(), 'policy')}
              class="px-3 py-1 text-sm bg-amber-600 text-white rounded hover:bg-amber-700"
            >
              {copied === 'policy' ? t('copied') : t('copy')}
            </button>
          </div>
          <pre class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg overflow-x-auto text-sm max-h-64 whitespace-pre-wrap">
            {generatePrivacyPolicy()}
          </pre>
        </div>
      </div>

      <p class="text-xs text-gray-500 dark:text-gray-400">
        {t('disclaimer')}
      </p>
    </div>
  
