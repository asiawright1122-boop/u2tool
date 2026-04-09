<script lang="ts">
  import { BADGE_TYPES } from '@/lib/tool-stubs';

  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['github-readme-generator'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.github-readme-generator.${key}`;
  }
  function tCommon(key: string): string {
    const scope = translations['tools'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.${key}`;
  }

  // Types
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

  let config = $state({
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

  let output = $state('');

  let copied = $state(false);

  // Functions
  function addFeature() {
    config = ({
      ...config,
      features: [...config.features, ''],
    });
  }
  function updateFeature(index: number, value: string) {
    config = ({
      ...config,
      features: config.features.map((f, i) => i === index ? value : f),
    });
  }
  function removeFeature(index: number) {
    config = ({
      ...config,
      features: config.features.filter((_, i) => i !== index),
    });
  }
  function toggleBadge(type: string) {
    config = ({
      ...config,
      badges: config.badges.map(b => 
        b.type === type ? { ...b, enabled: !b.enabled } : b
      ),
    });
  }
  function generateReadme() {
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
    
    output = lines.join('\n');
  }
  async function copyToClipboard() {
    await navigator.clipboard.writeText(output);
    copied = true;
    setTimeout(() => copied = false, 2000);
  }
  function downloadFile() {
    const blob = new Blob([output], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'README.md';
    link.click();
    URL.revokeObjectURL(url);
  }
  function clearAll() {
    config = {
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
    };
    output = '';
  }

</script>


    <div class="space-y-6">
      <!-- Project Name -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('projectName')}
        </label>
        <input
          type="text"
          value={config.projectName}
          onchange={(e) => config = ({ ...config, projectName: e.target.value })}
          placeholder={t('projectNamePlaceholder')}
          class="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <!-- Description -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('description')}
        </label>
        <textarea
          value={config.description}
          onchange={(e) => config = ({ ...config, description: e.target.value })}
          placeholder={t('descriptionPlaceholder')}
          rows={3}
          class="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
        />
      </div>

      <!-- Author Info -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('author')}
          </label>
          <input
            type="text"
            value={config.author}
            onchange={(e) => config = ({ ...config, author: e.target.value })}
            placeholder={t('authorPlaceholder')}
            class="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('authorGithub')}
          </label>
          <input
            type="text"
            value={config.authorGithub}
            onchange={(e) => config = ({ ...config, authorGithub: e.target.value })}
            placeholder={t('authorGithubPlaceholder')}
            class="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <!-- Badges -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('badges')}
        </label>
        <div class="flex flex-wrap gap-2">
          {#each BADGE_TYPES as badge (badge.type)}
<button 
              onclick={() => toggleBadge(badge.type)}
              class={`px-3 py-1.5 rounded text-sm ${
                config.badges.find(b => b.type === badge.type)?.enabled
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {badge.label}
            </button>
{/each}
        </div>
      </div>

      <!-- Features -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('features')}
        </label>
        <div class="space-y-2">
          {#each config.features as feature, index (index)}
<div  class="flex gap-2">
              <input
                type="text"
                value={feature}
                onchange={(e) => updateFeature(index, e.target.value)}
                placeholder={t('featurePlaceholder')}
                class="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onclick={() => removeFeature(index)}
                class="px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg"
              >
                ✕
              </button>
            </div>
{/each}
          <button
            onclick={addFeature}
            class="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg text-gray-900 dark:text-gray-100 text-sm"
          >
            + {t('addFeature')}
          </button>
        </div>
      </div>

      <!-- Installation -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('installation')}
        </label>
        <textarea
          value={config.installation}
          onchange={(e) => config = ({ ...config, installation: e.target.value })}
          placeholder={t('installationPlaceholder')}
          rows={2}
          class="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
        />
      </div>

      <!-- Usage -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('usage')}
        </label>
        <textarea
          value={config.usage}
          onchange={(e) => config = ({ ...config, usage: e.target.value })}
          placeholder={t('usagePlaceholder')}
          rows={4}
          class="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
        />
      </div>

      <!-- License -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('license')}
        </label>
        <select
          value={config.license}
          onchange={(e) => config = ({ ...config, license: e.target.value })}
          class="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="MIT">MIT</option>
          <option value="Apache-2.0">Apache 2.0</option>
          <option value="GPL-3.0">GPL 3.0</option>
          <option value="BSD-3-Clause">BSD 3-Clause</option>
          <option value="ISC">ISC</option>
        </select>
      </div>

      <!-- Options -->
      <div class="flex flex-wrap gap-4">
        <label class="flex items-center gap-2">
          <input
            type="checkbox"
            checked={config.includeTableOfContents}
            onchange={(e) => config = ({ ...config, includeTableOfContents: e.target.checked })}
            class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
          />
          <span class="text-sm text-gray-700 dark:text-gray-300">{t('includeTableOfContents')}</span>
        </label>
      </div>

      <!-- Actions -->
      <div class="flex justify-center gap-4">
        <button
          onclick={generateReadme}
          class="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium text-white"
        >
          {t('generate')}
        </button>
        <button
          onclick={clearAll}
          class="px-6 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg font-medium text-gray-900 dark:text-gray-100"
        >
          {tCommon('clear')}
        </button>
      </div>

      <!-- Output -->
      {#if output}
<div>
          <div class="flex justify-between items-center mb-2">
            <label class="text-sm font-medium text-gray-700 dark:text-gray-300">README.md</label>
            <div class="flex gap-2">
              <button
                onclick={copyToClipboard}
                class="px-3 py-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded text-sm text-gray-900 dark:text-gray-100"
              >
                {copied ? tCommon('copied') : tCommon('copy')}
              </button>
              <button
                onclick={downloadFile}
                class="px-3 py-1 bg-green-600 hover:bg-green-700 rounded text-sm text-white"
              >
                {t('download')}
              </button>
            </div>
          </div>
          <pre class="w-full p-4 bg-gray-900 dark:bg-gray-950 border border-gray-700 rounded-lg font-mono text-sm text-green-400 overflow-x-auto whitespace-pre-wrap max-h-96 overflow-y-auto">
            {output}
          </pre>
        </div>
{/if}
    </div>
  
