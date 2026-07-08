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

  let config = $state({
    websiteName: '',
    websiteUrl: '',
    companyName: '',
    email: '',
    collectsPersonalData: true,
    usesCookies: true,
    usesAnalytics: true,
    usesAds: false,
    allowsUserAccounts: false,
    sellsData: false,
  });

  let output = $state('');

  // Functions
  function generate() {
    const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    
    let policy = `# Privacy Policy for ${config.websiteName || '[Website Name]'}

**Last Updated: ${date}**

## Introduction

Welcome to ${config.websiteName || '[Website Name]'} ("we," "our," or "us"). We are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website ${config.websiteUrl || '[website URL]'}.

## Information We Collect

`;

    if (config.collectsPersonalData) {
      policy += `### Personal Information
We may collect personal information that you voluntarily provide to us when you:
- Contact us through our website
- Subscribe to our newsletter
- Fill out forms on our website
${config.allowsUserAccounts ? '- Create an account\n- Make a purchase' : ''}

This information may include:
- Name
- Email address
- Phone number
- Any other information you choose to provide

`;
    }

    if (config.usesCookies) {
      policy += `### Cookies and Tracking Technologies
We use cookies and similar tracking technologies to:
- Remember your preferences
- Understand how you use our website
- Improve your experience
${config.usesAnalytics ? '- Analyze website traffic and usage patterns' : ''}
${config.usesAds ? '- Deliver targeted advertisements' : ''}

You can control cookies through your browser settings. However, disabling cookies may affect your experience on our website.

`;
    }

    if (config.usesAnalytics) {
      policy += `### Analytics
We use analytics services (such as Google Analytics) to collect information about how visitors use our website. This helps us understand user behavior and improve our services. The information collected is aggregated and anonymous.

`;
    }

    policy += `## How We Use Your Information

We use the information we collect to:
- Provide and maintain our services
- Respond to your inquiries and requests
- Send you updates and marketing communications (with your consent)
- Improve our website and services
- Comply with legal obligations

## Data Sharing and Disclosure

${config.sellsData ? 'We may share your information with third parties for marketing purposes.' : 'We do not sell your personal information to third parties.'} We may share your information with:
- Service providers who assist us in operating our website
- Legal authorities when required by law
- Business partners with your consent

## Your Rights

You have the right to:
- Access your personal information
- Correct inaccurate information
- Request deletion of your information
- Opt-out of marketing communications
- Withdraw consent at any time

## Data Security

We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.

## Children's Privacy

Our website is not intended for children under 13 years of age. We do not knowingly collect personal information from children.

## Changes to This Policy

We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.

## Contact Us

If you have any questions about this Privacy Policy, please contact us at:

${config.companyName ? `**${config.companyName}**\n` : ''}${config.email ? `Email: ${config.email}\n` : ''}${config.websiteUrl ? `Website: ${config.websiteUrl}` : ''}

---

*This privacy policy was generated as a template. Please review and customize it according to your specific needs and consult with a legal professional to ensure compliance with applicable laws.*
`;

    output = policy;
  }
  function copyOutput() {
    navigator.clipboard.writeText(output);
  }

</script>


    <div class="space-y-6">
      <div class="grid md:grid-cols-2 gap-4">
        <div class="space-y-4">
          <div>
            <label for="privacy-policy-generator-field-11" class="block text-sm text-gray-600 dark:text-gray-300 mb-2">{t('privacyPolicyGenerator.websiteName')}</label>
            <input
              type="text"
              value={config.websiteName}
              onchange={(e) => config = { ...config, websiteName: e.target.value }}
              class="w-full bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 text-gray-900 dark:text-white focus:outline-none focus:border-amber-500"
              placeholder={t('privacyPolicyGenerator.websiteNamePlaceholder')} id="privacy-policy-generator-field-11" />
          </div>
          <div>
            <label for="privacy-policy-generator-field-10" class="block text-sm text-gray-600 dark:text-gray-300 mb-2">{t('privacyPolicyGenerator.websiteUrl')}</label>
            <input
              type="text"
              value={config.websiteUrl}
              onchange={(e) => config = { ...config, websiteUrl: e.target.value }}
              class="w-full bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 text-gray-900 dark:text-white focus:outline-none focus:border-amber-500"
              placeholder={t('privacyPolicyGenerator.websiteUrlPlaceholder')} id="privacy-policy-generator-field-10" />
          </div>
          <div>
            <label for="privacy-policy-generator-field-9" class="block text-sm text-gray-600 dark:text-gray-300 mb-2">{t('privacyPolicyGenerator.companyName')}</label>
            <input
              type="text"
              value={config.companyName}
              onchange={(e) => config = { ...config, companyName: e.target.value }}
              class="w-full bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 text-gray-900 dark:text-white focus:outline-none focus:border-amber-500"
              placeholder={t('privacyPolicyGenerator.companyNamePlaceholder')} id="privacy-policy-generator-field-9" />
          </div>
          <div>
            <label for="privacy-policy-generator-field-8" class="block text-sm text-gray-600 dark:text-gray-300 mb-2">{t('privacyPolicyGenerator.contactEmail')}</label>
            <input
              type="email"
              value={config.email}
              onchange={(e) => config = { ...config, email: e.target.value }}
              class="w-full bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 text-gray-900 dark:text-white focus:outline-none focus:border-amber-500"
              placeholder={t('privacyPolicyGenerator.contactEmailPlaceholder')} id="privacy-policy-generator-field-8" />
          </div>
        </div>

        <div class="space-y-3">
          <div class="block text-sm text-gray-600 dark:text-gray-300 mb-2">{t('privacyPolicyGenerator.featuresTitle')}</div>
          {#each [
            { key: 'collectsPersonalData', label: t('privacyPolicyGenerator.features.collectsPersonalData') },
            { key: 'usesCookies', label: t('privacyPolicyGenerator.features.usesCookies') },
            { key: 'usesAnalytics', label: t('privacyPolicyGenerator.features.usesAnalytics') },
            { key: 'usesAds', label: t('privacyPolicyGenerator.features.usesAds') },
            { key: 'allowsUserAccounts', label: t('privacyPolicyGenerator.features.allowsUserAccounts') },
            { key: 'sellsData', label: t('privacyPolicyGenerator.features.sellsData') },
          ] as { key, label } (key)}
<label  class="flex items-center gap-3 cursor-pointer p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded">
              <input
                type="checkbox"
                checked={config[key as keyof typeof config] as boolean}
                onchange={(e) => config = { ...config, [key]: e.target.checked }}
                class="w-4 h-4 rounded"
              />
              <span class="text-gray-900 dark:text-white">{label}</span>
            </label>
{/each}
        </div>
      </div>

      <div class="flex gap-2">
        <button onclick={generate} class="btn-primary px-6 py-2 rounded-lg">
          {t('privacyPolicyGenerator.generate')}
        </button>
        <button
          onclick={copyOutput}
          disabled={!output}
          class="btn-secondary px-6 py-2 rounded-lg disabled:opacity-50"
        >
          {t('privacyPolicyGenerator.copyToClipboard')}
        </button>
      </div>

      {#if output}
<div>
          <label for="privacy-policy-generator-field-7" class="block text-sm text-gray-600 dark:text-gray-300 mb-2">{t('privacyPolicyGenerator.generatedOutput')}</label>
          <textarea
            value={output}
            readOnly
            class="w-full h-96 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 font-mono text-sm text-gray-900 dark:text-gray-100 focus:outline-none" id="privacy-policy-generator-field-7"></textarea>
        </div>
{/if}
    </div>
  
