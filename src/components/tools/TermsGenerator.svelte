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
    country: 'United States',
    allowsUserContent: false,
    hasSubscription: false,
    hasRefundPolicy: false,
  });

  let output = $state('');

  // Functions
  function generate() {
    const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    
    let terms = `# Terms of Service for ${config.websiteName || '[Website Name]'}

**Last Updated: ${date}**

## 1. Acceptance of Terms

By accessing and using ${config.websiteName || '[Website Name]'} (${config.websiteUrl || '[website URL]'}), you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our website.

## 2. Description of Service

${config.websiteName || '[Website Name]'} provides online tools and utilities for developers and users. Our services are provided "as is" without warranties of any kind.

## 3. User Responsibilities

By using our services, you agree to:
- Provide accurate information when required
- Use the services only for lawful purposes
- Not attempt to disrupt or compromise our systems
- Not use automated systems to access our services without permission
- Comply with all applicable laws and regulations

## 4. Intellectual Property

All content, features, and functionality of ${config.websiteName || '[Website Name]'} are owned by ${config.companyName || '[Company Name]'} and are protected by international copyright, trademark, and other intellectual property laws.

`;

    if (config.allowsUserContent) {
      terms += `## 5. User-Generated Content

By submitting content to our website, you:
- Grant us a non-exclusive, worldwide, royalty-free license to use, display, and distribute your content
- Represent that you own or have the right to share the content
- Agree not to submit content that is illegal, offensive, or infringes on others' rights

We reserve the right to remove any user content at our discretion.

`;
    }

    if (config.hasSubscription) {
      terms += `## ${config.allowsUserContent ? '6' : '5'}. Subscription and Payments

### Billing
- Subscription fees are billed in advance on a recurring basis
- You authorize us to charge your payment method for all fees

### Cancellation
- You may cancel your subscription at any time
- Cancellation takes effect at the end of the current billing period

${config.hasRefundPolicy ? `### Refunds
- Refund requests must be made within 30 days of purchase
- Refunds are processed within 5-10 business days
- Partial refunds may be issued for unused service periods
` : ''}
`;
    }

    terms += `## ${config.allowsUserContent && config.hasSubscription ? '7' : config.allowsUserContent || config.hasSubscription ? '6' : '5'}. Limitation of Liability

To the maximum extent permitted by law:
- We are not liable for any indirect, incidental, or consequential damages
- Our total liability shall not exceed the amount you paid us in the past 12 months
- We do not guarantee uninterrupted or error-free service

## ${config.allowsUserContent && config.hasSubscription ? '8' : config.allowsUserContent || config.hasSubscription ? '7' : '6'}. Disclaimer of Warranties

Our services are provided "AS IS" and "AS AVAILABLE" without warranties of any kind, either express or implied, including but not limited to:
- Merchantability
- Fitness for a particular purpose
- Non-infringement
- Accuracy or reliability of results

## ${config.allowsUserContent && config.hasSubscription ? '9' : config.allowsUserContent || config.hasSubscription ? '8' : '7'}. Indemnification

You agree to indemnify and hold harmless ${config.companyName || '[Company Name]'} and its officers, directors, employees, and agents from any claims, damages, or expenses arising from your use of our services or violation of these terms.

## ${config.allowsUserContent && config.hasSubscription ? '10' : config.allowsUserContent || config.hasSubscription ? '9' : '8'}. Governing Law

These Terms shall be governed by and construed in accordance with the laws of ${config.country}, without regard to its conflict of law provisions.

## ${config.allowsUserContent && config.hasSubscription ? '11' : config.allowsUserContent || config.hasSubscription ? '10' : '9'}. Changes to Terms

We reserve the right to modify these terms at any time. We will notify users of significant changes by:
- Posting a notice on our website
- Updating the "Last Updated" date
- Sending an email notification (for registered users)

Continued use of our services after changes constitutes acceptance of the new terms.

## ${config.allowsUserContent && config.hasSubscription ? '12' : config.allowsUserContent || config.hasSubscription ? '11' : '10'}. Termination

We may terminate or suspend your access to our services immediately, without prior notice, for any reason, including breach of these Terms.

## ${config.allowsUserContent && config.hasSubscription ? '13' : config.allowsUserContent || config.hasSubscription ? '12' : '11'}. Contact Information

For questions about these Terms of Service, please contact us:

${config.companyName ? `**${config.companyName}**\n` : ''}${config.email ? `Email: ${config.email}\n` : ''}${config.websiteUrl ? `Website: ${config.websiteUrl}` : ''}

---

*These terms of service were generated as a template. Please review and customize them according to your specific needs and consult with a legal professional.*
`;

    output = terms;
  }
  function copyOutput() {
    navigator.clipboard.writeText(output);
  }

</script>


    <div class="space-y-6">
      <div class="grid md:grid-cols-2 gap-6">
        <div class="space-y-4">
          <div>
            <label class="block text-sm text-gray-600 dark:text-gray-300 mb-2">{t('termsGenerator.websiteName')}</label>
            <input
              type="text"
              value={config.websiteName}
              onchange={(e) => config = { ...config, websiteName: e.target.value }}
              class="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 text-gray-900 dark:text-white focus:outline-none focus:border-amber-500"
              placeholder={t('termsGenerator.websiteNamePlaceholder')}
            />
          </div>
          <div>
            <label class="block text-sm text-gray-600 dark:text-gray-300 mb-2">{t('termsGenerator.websiteUrl')}</label>
            <input
              type="text"
              value={config.websiteUrl}
              onchange={(e) => config = { ...config, websiteUrl: e.target.value }}
              class="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 text-gray-900 dark:text-white focus:outline-none focus:border-amber-500"
              placeholder={t('termsGenerator.websiteUrlPlaceholder')}
            />
          </div>
          <div>
            <label class="block text-sm text-gray-600 dark:text-gray-300 mb-2">{t('termsGenerator.companyName')}</label>
            <input
              type="text"
              value={config.companyName}
              onchange={(e) => config = { ...config, companyName: e.target.value }}
              class="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 text-gray-900 dark:text-white focus:outline-none focus:border-amber-500"
              placeholder={t('termsGenerator.companyNamePlaceholder')}
            />
          </div>
          <div>
            <label class="block text-sm text-gray-600 dark:text-gray-300 mb-2">{t('termsGenerator.contactEmail')}</label>
            <input
              type="email"
              value={config.email}
              onchange={(e) => config = { ...config, email: e.target.value }}
              class="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 text-gray-900 dark:text-white focus:outline-none focus:border-amber-500"
              placeholder={t('termsGenerator.contactEmailPlaceholder')}
            />
          </div>
          <div>
            <label class="block text-sm text-gray-600 dark:text-gray-300 mb-2">{t('termsGenerator.governingLawCountry')}</label>
            <input
              type="text"
              value={config.country}
              onchange={(e) => config = { ...config, country: e.target.value }}
              class="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 text-gray-900 dark:text-white focus:outline-none focus:border-amber-500"
              placeholder={t('termsGenerator.governingLawCountryPlaceholder')}
            />
          </div>
        </div>

        <div class="space-y-3">
          <label class="block text-sm text-gray-600 dark:text-gray-300 mb-2">{t('termsGenerator.featuresTitle')}</label>
          {#each [
            { key: 'allowsUserContent', label: t('termsGenerator.features.allowsUserContent') },
            { key: 'hasSubscription', label: t('termsGenerator.features.hasSubscription') },
            { key: 'hasRefundPolicy', label: t('termsGenerator.features.hasRefundPolicy') },
          ] as { key, label } (key)}
<label  class="flex items-center gap-3 cursor-pointer p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded text-gray-700 dark:text-white">
              <input
                type="checkbox"
                checked={config[key as keyof typeof config] as boolean}
                onchange={(e) => config = { ...config, [key]: e.target.checked }}
                class="w-4 h-4 rounded"
              />
              <span>{label}</span>
            </label>
{/each}
        </div>
      </div>

      <div class="flex gap-2">
        <button onclick={generate} class="btn-primary px-6 py-2 rounded-lg">
          {t('termsGenerator.generate')}
        </button>
        <button
          onclick={copyOutput}
          disabled={!output}
          class="btn-secondary px-6 py-2 rounded-lg disabled:opacity-50"
        >
          {t('termsGenerator.copyToClipboard')}
        </button>
      </div>

      {#if output}
<div>
          <label class="block text-sm text-gray-600 dark:text-gray-300 mb-2">{t('termsGenerator.generatedOutput')}</label>
          <textarea
            value={output}
            readOnly
            class="w-full h-96 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 font-mono text-sm text-gray-900 dark:text-white focus:outline-none"></textarea>
        </div>
{/if}
    </div>
  
