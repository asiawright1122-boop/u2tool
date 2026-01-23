'use client';

import { useState, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';

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

export default function GdprConsentGenerator() {
  const t = useTranslations('tools.gdpr-consent-generator');

  const [config, setConfig] = useState<ConsentConfig>({
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

  const [copied, setCopied] = useState<string | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const generateHtmlCode = (): string => {
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
        <h3 style="margin: 0 0 10px 0; color: ${textColor}; font-size: 18px;">🍪 ${t('bannerTitle')}</h3>
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
</script>`;
  };

  const generateCssCode = (): string => {
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
  };

  const generatePrivacyPolicy = (): string => {
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
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  useEffect(() => {

    return () => {

      if (timerRef.current) clearTimeout(timerRef.current);

    };

  }, []);


  return (
    <div className="space-y-6">
      {/* Configuration */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('websiteName')}
          </label>
          <input
            type="text"
            value={config.websiteName}
            onChange={(e) => setConfig({ ...config, websiteName: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('websiteUrl')}
          </label>
          <input
            type="url"
            value={config.websiteUrl}
            onChange={(e) => setConfig({ ...config, websiteUrl: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('companyName')}
          </label>
          <input
            type="text"
            value={config.companyName}
            onChange={(e) => setConfig({ ...config, companyName: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('privacyEmail')}
          </label>
          <input
            type="email"
            value={config.email}
            onChange={(e) => setConfig({ ...config, email: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        </div>
      </div>

      {/* Cookie Types */}
      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          {t('cookieTypes')}
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(config.cookieTypes).map(([key, value]) => (
            <label key={key} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={value}
                disabled={key === 'necessary'}
                onChange={(e) => setConfig({
                  ...config,
                  cookieTypes: { ...config.cookieTypes, [key]: e.target.checked }
                })}
                className="w-4 h-4 rounded"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {t(`cookies.${key}`)}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Style Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('position')}
          </label>
          <select
            value={config.position}
            onChange={(e) => setConfig({ ...config, position: e.target.value as 'top' | 'bottom' })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value="top">{t('positionTop')}</option>
            <option value="bottom">{t('positionBottom')}</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('theme')}
          </label>
          <select
            value={config.theme}
            onChange={(e) => setConfig({ ...config, theme: e.target.value as 'light' | 'dark' })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value="light">{t('themeLight')}</option>
            <option value="dark">{t('themeDark')}</option>
          </select>
        </div>
      </div>

      {/* Generated Code */}
      <div className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              {t('htmlCode')}
            </h3>
            <button
              onClick={() => copyToClipboard(generateHtmlCode(), 'html')}
              className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {copied === 'html' ? t('copied') : t('copy')}
            </button>
          </div>
          <pre className="p-4 bg-gray-900 text-gray-100 rounded-lg overflow-x-auto text-sm max-h-64">
            <code>{generateHtmlCode()}</code>
          </pre>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              {t('cssCode')}
            </h3>
            <button
              onClick={() => copyToClipboard(generateCssCode(), 'css')}
              className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {copied === 'css' ? t('copied') : t('copy')}
            </button>
          </div>
          <pre className="p-4 bg-gray-900 text-gray-100 rounded-lg overflow-x-auto text-sm max-h-48">
            <code>{generateCssCode()}</code>
          </pre>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              {t('privacyPolicy')}
            </h3>
            <button
              onClick={() => copyToClipboard(generatePrivacyPolicy(), 'policy')}
              className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {copied === 'policy' ? t('copied') : t('copy')}
            </button>
          </div>
          <pre className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg overflow-x-auto text-sm max-h-64 whitespace-pre-wrap">
            {generatePrivacyPolicy()}
          </pre>
        </div>
      </div>

      <p className="text-xs text-gray-500 dark:text-gray-400">
        {t('disclaimer')}
      </p>
    </div>
  );
}
