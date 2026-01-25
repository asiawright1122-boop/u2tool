'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

interface Badge {
  type: string;
  enabled: boolean;
}

interface ReadmeConfig {
  projectName: string;
  description: string;
  badges: Badge[];
  features: string[];
  installation: string;
  usage: string;
  contributing: string;
  license: string;
  author: string;
  authorGithub: string;
  includeTableOfContents: boolean;
  includeLogo: boolean;
  logoUrl: string;
}

const BADGE_TYPES = [
  { type: 'npm', label: 'NPM Version', template: (name: string) => `[![npm version](https://badge.fury.io/js/${name}.svg)](https://badge.fury.io/js/${name})` },
  { type: 'license', label: 'License', template: (name: string, license: string) => `[![License: ${license}](https://img.shields.io/badge/License-${license}-yellow.svg)](https://opensource.org/licenses/${license})` },
  { type: 'build', label: 'Build Status', template: (name: string, author: string) => `[![Build Status](https://github.com/${author}/${name}/workflows/CI/badge.svg)](https://github.com/${author}/${name}/actions)` },
  { type: 'coverage', label: 'Coverage', template: (name: string, author: string) => `[![Coverage Status](https://coveralls.io/repos/github/${author}/${name}/badge.svg?branch=main)](https://coveralls.io/github/${author}/${name}?branch=main)` },
  { type: 'downloads', label: 'Downloads', template: (name: string) => `[![npm downloads](https://img.shields.io/npm/dm/${name}.svg)](https://www.npmjs.com/package/${name})` },
  { type: 'stars', label: 'GitHub Stars', template: (name: string, author: string) => `[![GitHub stars](https://img.shields.io/github/stars/${author}/${name}.svg?style=social)](https://github.com/${author}/${name}/stargazers)` },
];

export default function GithubReadmeGenerator() {
  const t = useTranslations('tools.github-readme-generator');
  const tCommon = useTranslations('tools');
  
  const [config, setConfig] = useState<ReadmeConfig>({
    projectName: '',
    description: '',
    badges: BADGE_TYPES.map(b => ({ type: b.type, enabled: false })),
    features: [''],
    installation: 'npm install your-package',
    usage: '',
    contributing: '',
    license: 'MIT',
    author: '',
    authorGithub: '',
    includeTableOfContents: true,
    includeLogo: false,
    logoUrl: '',
  });
  
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);

  const addFeature = () => {
    setConfig(prev => ({
      ...prev,
      features: [...prev.features, ''],
    }));
  };

  const updateFeature = (index: number, value: string) => {
    setConfig(prev => ({
      ...prev,
      features: prev.features.map((f, i) => i === index ? value : f),
    }));
  };

  const removeFeature = (index: number) => {
    setConfig(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  };

  const toggleBadge = (type: string) => {
    setConfig(prev => ({
      ...prev,
      badges: prev.badges.map(b => 
        b.type === type ? { ...b, enabled: !b.enabled } : b
      ),
    }));
  };

  const generateReadme = () => {
    const lines: string[] = [];
    const slug = config.projectName.toLowerCase().replace(/\s+/g, '-');
    
    // Logo
    if (config.includeLogo && config.logoUrl) {
      lines.push(`<p align="center">`);
      lines.push(`  <img src="${config.logoUrl}" alt="${config.projectName} Logo" width="200">`);
      lines.push(`</p>`);
      lines.push('');
    }
    
    // Title
    lines.push(`# ${config.projectName || 'Project Name'}`);
    lines.push('');
    
    // Badges
    const enabledBadges = config.badges.filter(b => b.enabled);
    if (enabledBadges.length > 0) {
      const badgeLines: string[] = [];
      for (const badge of enabledBadges) {
        const badgeType = BADGE_TYPES.find(bt => bt.type === badge.type);
        if (badgeType) {
          badgeLines.push(badgeType.template(slug, config.authorGithub || 'username'));
        }
      }
      lines.push(badgeLines.join(' '));
      lines.push('');
    }
    
    // Description
    if (config.description) {
      lines.push(config.description);
      lines.push('');
    }
    
    // Table of Contents
    if (config.includeTableOfContents) {
      lines.push('## Table of Contents');
      lines.push('');
      lines.push('- [Features](#features)');
      lines.push('- [Installation](#installation)');
      lines.push('- [Usage](#usage)');
      if (config.contributing) {
        lines.push('- [Contributing](#contributing)');
      }
      lines.push('- [License](#license)');
      lines.push('');
    }
    
    // Features
    const validFeatures = config.features.filter(f => f.trim());
    if (validFeatures.length > 0) {
      lines.push('## Features');
      lines.push('');
      for (const feature of validFeatures) {
        lines.push(`- ${feature}`);
      }
      lines.push('');
    }
    
    // Installation
    if (config.installation) {
      lines.push('## Installation');
      lines.push('');
      lines.push('```bash');
      lines.push(config.installation);
      lines.push('```');
      lines.push('');
    }
    
    // Usage
    if (config.usage) {
      lines.push('## Usage');
      lines.push('');
      lines.push('```javascript');
      lines.push(config.usage);
      lines.push('```');
      lines.push('');
    }
    
    // Contributing
    if (config.contributing) {
      lines.push('## Contributing');
      lines.push('');
      lines.push(config.contributing);
      lines.push('');
    }
    
    // License
    lines.push('## License');
    lines.push('');
    lines.push(`This project is licensed under the ${config.license} License - see the [LICENSE](LICENSE) file for details.`);
    lines.push('');
    
    // Author
    if (config.author) {
      lines.push('## Author');
      lines.push('');
      if (config.authorGithub) {
        lines.push(`**${config.author}** - [@${config.authorGithub}](https://github.com/${config.authorGithub})`);
      } else {
        lines.push(`**${config.author}**`);
      }
      lines.push('');
    }
    
    setOutput(lines.join('\n'));
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadFile = () => {
    const blob = new Blob([output], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'README.md';
    link.click();
    URL.revokeObjectURL(url);
  };

  const clearAll = () => {
    setConfig({
      projectName: '',
      description: '',
      badges: BADGE_TYPES.map(b => ({ type: b.type, enabled: false })),
      features: [''],
      installation: 'npm install your-package',
      usage: '',
      contributing: '',
      license: 'MIT',
      author: '',
      authorGithub: '',
      includeTableOfContents: true,
      includeLogo: false,
      logoUrl: '',
    });
    setOutput('');
  };

  return (
    <div className="space-y-6">
      {/* Project Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('projectName')}
        </label>
        <input
          type="text"
          value={config.projectName}
          onChange={(e) => setConfig(prev => ({ ...prev, projectName: e.target.value }))}
          placeholder={t('projectNamePlaceholder')}
          className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('description')}
        </label>
        <textarea
          value={config.description}
          onChange={(e) => setConfig(prev => ({ ...prev, description: e.target.value }))}
          placeholder={t('descriptionPlaceholder')}
          rows={3}
          className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
        />
      </div>

      {/* Author Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('author')}
          </label>
          <input
            type="text"
            value={config.author}
            onChange={(e) => setConfig(prev => ({ ...prev, author: e.target.value }))}
            placeholder={t('authorPlaceholder')}
            className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('authorGithub')}
          </label>
          <input
            type="text"
            value={config.authorGithub}
            onChange={(e) => setConfig(prev => ({ ...prev, authorGithub: e.target.value }))}
            placeholder={t('authorGithubPlaceholder')}
            className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Badges */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('badges')}
        </label>
        <div className="flex flex-wrap gap-2">
          {BADGE_TYPES.map(badge => (
            <button
              key={badge.type}
              onClick={() => toggleBadge(badge.type)}
              className={`px-3 py-1.5 rounded text-sm ${
                config.badges.find(b => b.type === badge.type)?.enabled
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {badge.label}
            </button>
          ))}
        </div>
      </div>

      {/* Features */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('features')}
        </label>
        <div className="space-y-2">
          {config.features.map((feature, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={feature}
                onChange={(e) => updateFeature(index, e.target.value)}
                placeholder={t('featurePlaceholder')}
                className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={() => removeFeature(index)}
                className="px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg"
              >
                ✕
              </button>
            </div>
          ))}
          <button
            onClick={addFeature}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg text-gray-900 dark:text-gray-100 text-sm"
          >
            + {t('addFeature')}
          </button>
        </div>
      </div>

      {/* Installation */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('installation')}
        </label>
        <textarea
          value={config.installation}
          onChange={(e) => setConfig(prev => ({ ...prev, installation: e.target.value }))}
          placeholder={t('installationPlaceholder')}
          rows={2}
          className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
        />
      </div>

      {/* Usage */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('usage')}
        </label>
        <textarea
          value={config.usage}
          onChange={(e) => setConfig(prev => ({ ...prev, usage: e.target.value }))}
          placeholder={t('usagePlaceholder')}
          rows={4}
          className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
        />
      </div>

      {/* License */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('license')}
        </label>
        <select
          value={config.license}
          onChange={(e) => setConfig(prev => ({ ...prev, license: e.target.value }))}
          className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="MIT">MIT</option>
          <option value="Apache-2.0">Apache 2.0</option>
          <option value="GPL-3.0">GPL 3.0</option>
          <option value="BSD-3-Clause">BSD 3-Clause</option>
          <option value="ISC">ISC</option>
        </select>
      </div>

      {/* Options */}
      <div className="flex flex-wrap gap-4">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={config.includeTableOfContents}
            onChange={(e) => setConfig(prev => ({ ...prev, includeTableOfContents: e.target.checked }))}
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
          />
          <span className="text-sm text-gray-700 dark:text-gray-300">{t('includeTableOfContents')}</span>
        </label>
      </div>

      {/* Actions */}
      <div className="flex justify-center gap-4">
        <button
          onClick={generateReadme}
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

      {/* Output */}
      {output && (
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">README.md</label>
            <div className="flex gap-2">
              <button
                onClick={copyToClipboard}
                className="px-3 py-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded text-sm text-gray-900 dark:text-gray-100"
              >
                {copied ? tCommon('copied') : tCommon('copy')}
              </button>
              <button
                onClick={downloadFile}
                className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded text-sm text-white"
              >
                {t('download')}
              </button>
            </div>
          </div>
          <pre className="w-full p-4 bg-gray-900 dark:bg-gray-950 border border-gray-700 rounded-lg font-mono text-sm text-green-400 overflow-x-auto whitespace-pre-wrap max-h-96 overflow-y-auto">
            {output}
          </pre>
        </div>
      )}
    </div>
  );
}
