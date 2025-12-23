'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

export default function CookiePolicyGenerator() {
  const t = useTranslations('tools.cookie-policy-generator');
  const [config, setConfig] = useState({
    websiteName: '',
    websiteUrl: '',
    email: '',
    essentialCookies: true,
    analyticsCookies: true,
    marketingCookies: false,
    functionalCookies: true,
  });
  const [output, setOutput] = useState('');

  const generate = () => {
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

    setOutput(policy);
  };

  const copyOutput = () => {
    navigator.clipboard.writeText(output);
  };

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-300 mb-2">{t('websiteName')}</label>
            <input
              type="text"
              value={config.websiteName}
              onChange={(e) => setConfig({ ...config, websiteName: e.target.value })}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
              placeholder="My Website"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-2">{t('websiteUrl')}</label>
            <input
              type="text"
              value={config.websiteUrl}
              onChange={(e) => setConfig({ ...config, websiteUrl: e.target.value })}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
              placeholder="https://example.com"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-2">{t('contactEmail')}</label>
            <input
              type="email"
              value={config.email}
              onChange={(e) => setConfig({ ...config, email: e.target.value })}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
              placeholder="privacy@example.com"
            />
          </div>
        </div>

        <div className="space-y-3">
          <label className="block text-sm text-gray-300 mb-2">{t('cookieTypes')}</label>
          {[
            { key: 'essentialCookies', label: t('essentialCookies') },
            { key: 'functionalCookies', label: t('functionalCookies') },
            { key: 'analyticsCookies', label: t('analyticsCookies') },
            { key: 'marketingCookies', label: t('marketingCookies') },
          ].map(({ key, label }) => (
            <label key={key} className="flex items-center gap-3 cursor-pointer p-2 hover:bg-gray-800 rounded">
              <input
                type="checkbox"
                checked={config[key as keyof typeof config] as boolean}
                onChange={(e) => setConfig({ ...config, [key]: e.target.checked })}
                disabled={key === 'essentialCookies'}
                className="w-4 h-4 rounded disabled:opacity-50"
              />
              <span className={key === 'essentialCookies' ? 'text-gray-300' : ''}>{label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="flex gap-2">
        <button onClick={generate} className="btn-primary px-6 py-2 rounded-lg">
          {t('generate')}
        </button>
        <button
          onClick={copyOutput}
          disabled={!output}
          className="btn-secondary px-6 py-2 rounded-lg disabled:opacity-50"
        >
          {t('copy')}
        </button>
      </div>

      {output && (
        <div>
          <label className="block text-sm text-gray-300 mb-2">{t('output')}</label>
          <textarea
            value={output}
            readOnly
            className="w-full h-96 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 font-mono text-sm focus:outline-none"
          />
        </div>
      )}
    </div>
  );
}
