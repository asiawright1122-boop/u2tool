<script lang="ts">
  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['cookie-policy-generator'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.cookie-policy-generator.${key}`;
  }

  let config = $state({
    websiteName: '',
    websiteUrl: '',
    email: '',
    essentialCookies: true,
    analyticsCookies: true,
    marketingCookies: false,
    functionalCookies: true,
  });

  let output = $state('');

  // Functions
  function generate() {
    const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    
    let policy = `# Cookie Policy for ${config.websiteName || '[Website Name]'}

**Last Updated: ${date}**

## What Are Cookies?

Cookies are small text files that are stored on your device when you visit a website. They help websites remember your preferences and improve your browsing experience.

## How We Use Cookies

${config.websiteName || 'Our website'} uses cookies for various purposes:

`;

    if (config.essentialCookies) {
      policy += `### Essential Cookies
These cookies are necessary for the website to function properly. They enable basic features like page navigation and access to secure areas. The website cannot function properly without these cookies.

| Cookie Name | Purpose | Duration |
|-------------|---------|----------|
| session_id | Maintains user session | Session |
| csrf_token | Security protection | Session |

`;
    }

    if (config.functionalCookies) {
      policy += `### Functional Cookies
These cookies enable the website to provide enhanced functionality and personalization. They may be set by us or by third-party providers whose services we have added to our pages.

| Cookie Name | Purpose | Duration |
|-------------|---------|----------|
| language | Remembers language preference | 1 year |
| theme | Remembers display preferences | 1 year |

`;
    }

    if (config.analyticsCookies) {
      policy += `### Analytics Cookies
These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously. This helps us improve our website.

| Cookie Name | Purpose | Duration |
|-------------|---------|----------|
| _ga | Google Analytics - distinguishes users | 2 years |
| _gid | Google Analytics - distinguishes users | 24 hours |
| _gat | Google Analytics - throttles request rate | 1 minute |

`;
    }

    if (config.marketingCookies) {
      policy += `### Marketing Cookies
These cookies are used to track visitors across websites. The intention is to display ads that are relevant and engaging for the individual user.

| Cookie Name | Purpose | Duration |
|-------------|---------|----------|
| _fbp | Facebook Pixel | 3 months |
| ads_session | Advertising preferences | Session |

`;
    }

    policy += `## Managing Cookies

You can control and manage cookies in various ways:

### Browser Settings
Most browsers allow you to:
- View cookies stored on your device
- Delete all or specific cookies
- Block cookies from all or specific websites
- Block third-party cookies

### Cookie Consent
When you first visit our website, you will be shown a cookie consent banner. You can choose to:
- Accept all cookies
- Reject non-essential cookies
- Customize your cookie preferences

### Opt-Out Links
- [Google Analytics Opt-out](https://tools.google.com/dlpage/gaoptout)
${config.marketingCookies ? '- [Facebook Opt-out](https://www.facebook.com/policies/cookies/)' : ''}

## Impact of Disabling Cookies

If you disable cookies, some features of our website may not function properly:
- You may need to log in repeatedly
- Your preferences may not be saved
- Some interactive features may not work

## Updates to This Policy

We may update this Cookie Policy from time to time. Any changes will be posted on this page with an updated revision date.

## Contact Us

If you have questions about our use of cookies, please contact us:

${config.email ? `Email: ${config.email}` : ''}
${config.websiteUrl ? `Website: ${config.websiteUrl}` : ''}

---

*This cookie policy was generated as a template. Please customize it according to your specific needs.*
`;

    output = policy;
  }
  function copyOutput() {
    navigator.clipboard.writeText(output);
  }

</script>


    <div class="space-y-6">
      <div class="grid md:grid-cols-2 gap-6">
        <div class="space-y-4">
          <div>
            <label for="cookie-policy-generator-field-9" class="block text-sm text-gray-600 dark:text-gray-300 mb-2">{t('websiteName')}</label>
            <input
              type="text"
              value={config.websiteName}
              onchange={(e) => config = { ...config, websiteName: e.target.value }}
              class="w-full bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 text-gray-900 dark:text-white focus:outline-none focus:border-amber-500"
              placeholder="My Website" id="cookie-policy-generator-field-9" />
          </div>
          <div>
            <label for="cookie-policy-generator-field-8" class="block text-sm text-gray-600 dark:text-gray-300 mb-2">{t('websiteUrl')}</label>
            <input
              type="text"
              value={config.websiteUrl}
              onchange={(e) => config = { ...config, websiteUrl: e.target.value }}
              class="w-full bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 text-gray-900 dark:text-white focus:outline-none focus:border-amber-500"
              placeholder="https://example.com" id="cookie-policy-generator-field-8" />
          </div>
          <div>
            <label for="cookie-policy-generator-field-7" class="block text-sm text-gray-600 dark:text-gray-300 mb-2">{t('contactEmail')}</label>
            <input
              type="email"
              value={config.email}
              onchange={(e) => config = { ...config, email: e.target.value }}
              class="w-full bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 text-gray-900 dark:text-white focus:outline-none focus:border-amber-500"
              placeholder="privacy@example.com" id="cookie-policy-generator-field-7" />
          </div>
        </div>

        <div class="space-y-3">
          <div class="block text-sm text-gray-600 dark:text-gray-300 mb-2">{t('cookieTypes')}</div>
          {#each [
            { key: 'essentialCookies', label: t('essentialCookies') },
            { key: 'functionalCookies', label: t('functionalCookies') },
            { key: 'analyticsCookies', label: t('analyticsCookies') },
            { key: 'marketingCookies', label: t('marketingCookies') },
          ] as { key, label } (key)}
<label  class="flex items-center gap-3 cursor-pointer p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded">
              <input
                type="checkbox"
                checked={config[key as keyof typeof config] as boolean}
                onchange={(e) => config = { ...config, [key]: e.target.checked }}
                disabled={key === 'essentialCookies'}
                class="w-4 h-4 rounded disabled:opacity-50"
              />
              <span class={key === 'essentialCookies' ? 'text-gray-500 dark:text-gray-300' : 'text-gray-900 dark:text-white'}>{label}</span>
            </label>
{/each}
        </div>
      </div>

      <div class="flex gap-2">
        <button onclick={generate} class="btn-primary px-6 py-2 rounded-lg">
          {t('generate')}
        </button>
        <button
          onclick={copyOutput}
          disabled={!output}
          class="btn-secondary px-6 py-2 rounded-lg disabled:opacity-50"
        >
          {t('copy')}
        </button>
      </div>

      {#if output}
<div>
          <label for="cookie-policy-generator-field-6" class="block text-sm text-gray-600 dark:text-gray-300 mb-2">{t('output')}</label>
          <textarea
            value={output}
            readOnly
            class="w-full h-96 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 font-mono text-sm text-gray-900 dark:text-white focus:outline-none" id="cookie-policy-generator-field-6"></textarea>
        </div>
{/if}
    </div>
  
