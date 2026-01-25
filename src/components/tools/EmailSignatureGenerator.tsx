'use client';

import { useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';

interface SignatureConfig {
  name: string;
  title: string;
  company: string;
  email: string;
  phone: string;
  website: string;
  linkedin: string;
  twitter: string;
  github: string;
  style: 'professional' | 'modern' | 'minimal';
  primaryColor: string;
}

interface SignatureResult {
  html: string;
  plainText: string;
}

function generateSignature(config: SignatureConfig): SignatureResult {
  const { name, title, company, email, phone, website, linkedin, twitter, github, style, primaryColor } = config;
  
  // Generate plain text version
  const plainTextLines: string[] = [];
  if (name) plainTextLines.push(name);
  if (title) plainTextLines.push(title);
  if (company) plainTextLines.push(company);
  plainTextLines.push('');
  if (email) plainTextLines.push(`Email: ${email}`);
  if (phone) plainTextLines.push(`Phone: ${phone}`);
  if (website) plainTextLines.push(`Website: ${website}`);
  if (linkedin) plainTextLines.push(`LinkedIn: ${linkedin}`);
  if (twitter) plainTextLines.push(`Twitter: ${twitter}`);
  if (github) plainTextLines.push(`GitHub: ${github}`);
  
  const plainText = plainTextLines.join('\n');
  
  // Generate HTML version based on style
  let html = '';
  
  if (style === 'professional') {
    html = `<table cellpadding="0" cellspacing="0" border="0" style="font-family: Arial, sans-serif; font-size: 14px; color: #333333;">
  <tr>
    <td style="padding-right: 15px; border-right: 3px solid ${primaryColor};">
      <table cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td style="font-size: 18px; font-weight: bold; color: ${primaryColor};">${name || 'Your Name'}</td>
        </tr>
        ${title ? `<tr><td style="font-size: 14px; color: #666666; padding-top: 2px;">${title}</td></tr>` : ''}
        ${company ? `<tr><td style="font-size: 14px; color: #666666;">${company}</td></tr>` : ''}
      </table>
    </td>
    <td style="padding-left: 15px;">
      <table cellpadding="0" cellspacing="0" border="0">
        ${email ? `<tr><td style="padding: 2px 0;"><a href="mailto:${email}" style="color: #333333; text-decoration: none;">📧 ${email}</a></td></tr>` : ''}
        ${phone ? `<tr><td style="padding: 2px 0;">📱 ${phone}</td></tr>` : ''}
        ${website ? `<tr><td style="padding: 2px 0;"><a href="${website.startsWith('http') ? website : 'https://' + website}" style="color: ${primaryColor}; text-decoration: none;">🌐 ${website}</a></td></tr>` : ''}
      </table>
      ${(linkedin || twitter || github) ? `
      <table cellpadding="0" cellspacing="0" border="0" style="margin-top: 8px;">
        <tr>
          ${linkedin ? `<td style="padding-right: 8px;"><a href="${linkedin.startsWith('http') ? linkedin : 'https://linkedin.com/in/' + linkedin}" style="color: #0077B5; text-decoration: none;">LinkedIn</a></td>` : ''}
          ${twitter ? `<td style="padding-right: 8px;"><a href="${twitter.startsWith('http') ? twitter : 'https://twitter.com/' + twitter}" style="color: #1DA1F2; text-decoration: none;">Twitter</a></td>` : ''}
          ${github ? `<td><a href="${github.startsWith('http') ? github : 'https://github.com/' + github}" style="color: #333333; text-decoration: none;">GitHub</a></td>` : ''}
        </tr>
      </table>` : ''}
    </td>
  </tr>
</table>`;
  } else if (style === 'modern') {
    html = `<table cellpadding="0" cellspacing="0" border="0" style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; font-size: 14px; color: #333333;">
  <tr>
    <td style="background: linear-gradient(135deg, ${primaryColor}, ${primaryColor}dd); padding: 15px; border-radius: 8px;">
      <table cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td style="font-size: 20px; font-weight: 600; color: #ffffff;">${name || 'Your Name'}</td>
        </tr>
        ${title ? `<tr><td style="font-size: 14px; color: #ffffffcc; padding-top: 4px;">${title}${company ? ` @ ${company}` : ''}</td></tr>` : ''}
      </table>
    </td>
  </tr>
  <tr>
    <td style="padding: 12px 0;">
      <table cellpadding="0" cellspacing="0" border="0">
        ${email ? `<tr><td style="padding: 4px 0;"><a href="mailto:${email}" style="color: ${primaryColor}; text-decoration: none; font-weight: 500;">${email}</a></td></tr>` : ''}
        ${phone ? `<tr><td style="padding: 4px 0; color: #666666;">${phone}</td></tr>` : ''}
        ${website ? `<tr><td style="padding: 4px 0;"><a href="${website.startsWith('http') ? website : 'https://' + website}" style="color: ${primaryColor}; text-decoration: none;">${website}</a></td></tr>` : ''}
      </table>
    </td>
  </tr>
  ${(linkedin || twitter || github) ? `
  <tr>
    <td>
      <table cellpadding="0" cellspacing="0" border="0">
        <tr>
          ${linkedin ? `<td style="padding-right: 12px;"><a href="${linkedin.startsWith('http') ? linkedin : 'https://linkedin.com/in/' + linkedin}" style="display: inline-block; padding: 6px 12px; background: #0077B5; color: #ffffff; text-decoration: none; border-radius: 4px; font-size: 12px;">LinkedIn</a></td>` : ''}
          ${twitter ? `<td style="padding-right: 12px;"><a href="${twitter.startsWith('http') ? twitter : 'https://twitter.com/' + twitter}" style="display: inline-block; padding: 6px 12px; background: #1DA1F2; color: #ffffff; text-decoration: none; border-radius: 4px; font-size: 12px;">Twitter</a></td>` : ''}
          ${github ? `<td><a href="${github.startsWith('http') ? github : 'https://github.com/' + github}" style="display: inline-block; padding: 6px 12px; background: #333333; color: #ffffff; text-decoration: none; border-radius: 4px; font-size: 12px;">GitHub</a></td>` : ''}
        </tr>
      </table>
    </td>
  </tr>` : ''}
</table>`;
  } else {
    // Minimal style
    html = `<table cellpadding="0" cellspacing="0" border="0" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 13px; color: #333333;">
  <tr>
    <td>
      <p style="margin: 0; font-weight: 600; color: ${primaryColor};">${name || 'Your Name'}</p>
      ${title || company ? `<p style="margin: 2px 0 0 0; color: #666666;">${[title, company].filter(Boolean).join(' | ')}</p>` : ''}
      <p style="margin: 8px 0 0 0; font-size: 12px; color: #888888;">
        ${[email, phone, website].filter(Boolean).join(' • ')}
      </p>
    </td>
  </tr>
</table>`;
  }
  
  return { html, plainText };
}

export default function EmailSignatureGenerator() {
  const t = useTranslations('tools.email-signature-generator');
  const tCommon = useTranslations('tools');
  
  const [config, setConfig] = useState<SignatureConfig>({
    name: '',
    title: '',
    company: '',
    email: '',
    phone: '',
    website: '',
    linkedin: '',
    twitter: '',
    github: '',
    style: 'professional',
    primaryColor: '#2563eb',
  });
  
  const [result, setResult] = useState<SignatureResult | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'preview' | 'html' | 'text'>('preview');

  const handleGenerate = useCallback(() => {
    setResult(generateSignature(config));
  }, [config]);

  const copyToClipboard = async (text: string, type: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  const clearAll = () => {
    setConfig({
      name: '',
      title: '',
      company: '',
      email: '',
      phone: '',
      website: '',
      linkedin: '',
      twitter: '',
      github: '',
      style: 'professional',
      primaryColor: '#2563eb',
    });
    setResult(null);
  };

  const styles: { id: 'professional' | 'modern' | 'minimal'; name: string }[] = [
    { id: 'professional', name: t('styleProfessional') },
    { id: 'modern', name: t('styleModern') },
    { id: 'minimal', name: t('styleMinimal') },
  ];

  const colors = ['#2563eb', '#059669', '#dc2626', '#7c3aed', '#ea580c', '#0891b2', '#4f46e5', '#be185d'];

  return (
    <div className="space-y-6">
      {/* Personal Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('name')}
          </label>
          <input
            type="text"
            value={config.name}
            onChange={(e) => setConfig(prev => ({ ...prev, name: e.target.value }))}
            placeholder={t('namePlaceholder')}
            className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('title')}
          </label>
          <input
            type="text"
            value={config.title}
            onChange={(e) => setConfig(prev => ({ ...prev, title: e.target.value }))}
            placeholder={t('titlePlaceholder')}
            className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('company')}
          </label>
          <input
            type="text"
            value={config.company}
            onChange={(e) => setConfig(prev => ({ ...prev, company: e.target.value }))}
            placeholder={t('companyPlaceholder')}
            className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('email')}
          </label>
          <input
            type="email"
            value={config.email}
            onChange={(e) => setConfig(prev => ({ ...prev, email: e.target.value }))}
            placeholder={t('emailPlaceholder')}
            className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('phone')}
          </label>
          <input
            type="tel"
            value={config.phone}
            onChange={(e) => setConfig(prev => ({ ...prev, phone: e.target.value }))}
            placeholder={t('phonePlaceholder')}
            className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('website')}
          </label>
          <input
            type="text"
            value={config.website}
            onChange={(e) => setConfig(prev => ({ ...prev, website: e.target.value }))}
            placeholder={t('websitePlaceholder')}
            className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Social Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            LinkedIn
          </label>
          <input
            type="text"
            value={config.linkedin}
            onChange={(e) => setConfig(prev => ({ ...prev, linkedin: e.target.value }))}
            placeholder={t('usernamePlaceholder')}
            className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Twitter
          </label>
          <input
            type="text"
            value={config.twitter}
            onChange={(e) => setConfig(prev => ({ ...prev, twitter: e.target.value }))}
            placeholder={t('usernamePlaceholder')}
            className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            GitHub
          </label>
          <input
            type="text"
            value={config.github}
            onChange={(e) => setConfig(prev => ({ ...prev, github: e.target.value }))}
            placeholder={t('usernamePlaceholder')}
            className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Style Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('style')}
        </label>
        <div className="flex flex-wrap gap-2">
          {styles.map(s => (
            <button
              key={s.id}
              onClick={() => setConfig(prev => ({ ...prev, style: s.id }))}
              className={`px-4 py-2 rounded-lg text-sm ${
                config.style === s.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {s.name}
            </button>
          ))}
        </div>
      </div>

      {/* Color Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('primaryColor')}
        </label>
        <div className="flex flex-wrap gap-2">
          {colors.map(color => (
            <button
              key={color}
              onClick={() => setConfig(prev => ({ ...prev, primaryColor: color }))}
              className={`w-8 h-8 rounded-full border-2 ${
                config.primaryColor === color ? 'border-gray-900 dark:border-white' : 'border-transparent'
              }`}
              style={{ backgroundColor: color }}
            />
          ))}
          <input
            type="color"
            value={config.primaryColor}
            onChange={(e) => setConfig(prev => ({ ...prev, primaryColor: e.target.value }))}
            className="w-8 h-8 rounded cursor-pointer"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-center gap-4">
        <button
          onClick={handleGenerate}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium text-white"
        >
          {t('generate')}
        </button>
        <button
          onClick={clearAll}
          className="px-6 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg font-medium text-gray-900 dark:text-gray-100"
        >
          {tCommon('clear')}
        </button>
      </div>

      {/* Results */}
      {result && (
        <div className="space-y-4">
          {/* Tabs */}
          <div className="flex border-b border-gray-200 dark:border-gray-700">
            {(['preview', 'html', 'text'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-sm font-medium ${
                  activeTab === tab
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                {t(tab)}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === 'preview' && (
            <div className="p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div dangerouslySetInnerHTML={{ __html: result.html }} />
            </div>
          )}

          {activeTab === 'html' && (
            <div>
              <div className="flex justify-end mb-2">
                <button
                  onClick={() => copyToClipboard(result.html, 'html')}
                  className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm text-white"
                >
                  {copied === 'html' ? tCommon('copied') : tCommon('copy')}
                </button>
              </div>
              <pre className="p-4 bg-gray-900 dark:bg-gray-950 border border-gray-700 rounded-lg font-mono text-xs text-green-400 overflow-x-auto whitespace-pre-wrap max-h-96 overflow-y-auto">
                {result.html}
              </pre>
            </div>
          )}

          {activeTab === 'text' && (
            <div>
              <div className="flex justify-end mb-2">
                <button
                  onClick={() => copyToClipboard(result.plainText, 'text')}
                  className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm text-white"
                >
                  {copied === 'text' ? tCommon('copied') : tCommon('copy')}
                </button>
              </div>
              <pre className="p-4 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg font-mono text-sm text-gray-900 dark:text-gray-100 whitespace-pre-wrap">
                {result.plainText}
              </pre>
            </div>
          )}
        </div>
      )}

      {/* Instructions */}
      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <h3 className="text-sm font-medium text-blue-700 dark:text-blue-300 mb-2">{t('howToUse')}</h3>
        <ol className="text-sm text-blue-600 dark:text-blue-400 space-y-1 list-decimal list-inside">
          <li>{t('step1')}</li>
          <li>{t('step2')}</li>
          <li>{t('step3')}</li>
        </ol>
      </div>
    </div>
  );
}
