<script lang="ts">
  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['license-generator'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.license-generator.${key}`;
  }
  function tCommon(key: string): string {
    const scope = translations['tools'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.${key}`;
  }

  // Types
  interface LicenseTemplate {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  conditions: string[];
  limitations: string[];
  template: string;
}

  const LICENSES: LicenseTemplate[] = [
    {
      id: 'mit',
      name: 'MIT License',
      description: 'A short, permissive license suitable for open source projects.',
      permissions: ['Commercial use', 'Modification', 'Distribution', 'Private use'],
      conditions: ['Include copyright notice', 'Include license text'],
      limitations: ['No liability', 'No warranty'],
      template: 'MIT License\n\nCopyright (c) {{year}} {{author}}\n\nPermission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the \"Software\"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software.\n\nTHE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED.',
    },
    {
      id: 'apache-2.0',
      name: 'Apache License 2.0',
      description: 'A permissive license with explicit patent grants.',
      permissions: ['Commercial use', 'Modification', 'Distribution', 'Patent use', 'Private use'],
      conditions: ['Include copyright notice', 'Include license text', 'State changes'],
      limitations: ['No trademark use', 'No liability', 'No warranty'],
      template: 'Apache License\nVersion 2.0, January 2004\n\nCopyright {{year}} {{author}}\n\nLicensed under the Apache License, Version 2.0 (the \"License\"); you may not use this file except in compliance with the License.',
    },
    {
      id: 'gpl-3.0',
      name: 'GNU GPLv3',
      description: 'A strong copyleft license requiring derivative works to use the same license.',
      permissions: ['Commercial use', 'Modification', 'Distribution', 'Patent use', 'Private use'],
      conditions: ['Disclose source', 'Use same license', 'Include copyright notice', 'State changes'],
      limitations: ['No liability', 'No warranty'],
      template: 'GNU GENERAL PUBLIC LICENSE\nVersion 3, 29 June 2007\n\nCopyright (C) {{year}} {{author}}\n\nThis program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License.',
    },
    {
      id: 'bsd-3-clause',
      name: 'BSD 3-Clause',
      description: 'A permissive license with a non-endorsement clause.',
      permissions: ['Commercial use', 'Modification', 'Distribution', 'Private use'],
      conditions: ['Include copyright notice', 'Include license text'],
      limitations: ['No liability', 'No warranty', 'No endorsement'],
      template: 'BSD 3-Clause License\n\nCopyright (c) {{year}}, {{author}}\nAll rights reserved.\n\nRedistribution and use in source and binary forms, with or without modification, are permitted provided that the license conditions are met.',
    },
  ];

  let selectedLicense = $state('mit');

  let author = $state('');

  let year = $state(new Date().getFullYear().toString());

  let output = $state('');

  let copied = $state(false);

  // Functions
  let currentLicense = $derived(LICENSES.find(l => l.id === selectedLicense));
  function generateLicense() {
    if (!currentLicense) return;
    
    let licenseText = currentLicense.template;
    licenseText = licenseText.replace(/\{\{year\}\}/g, year);
    licenseText = licenseText.replace(/\{\{author\}\}/g, author || '[Author Name]');
    
    output = licenseText;
  }
  async function copyToClipboard() {
    await navigator.clipboard.writeText(output);
    copied = true;
    setTimeout(() => copied = false, 2000);
  }
  function downloadFile() {
    const blob = new Blob([output], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'LICENSE';
    link.click();
    URL.revokeObjectURL(url);
  }
  function clearAll() {
    selectedLicense = 'mit';
    author = '';
    year = new Date().getFullYear().toString();
    output = '';
  }

</script>


    <div class="space-y-6">
      <!-- License Selection -->
      <div>
        <label class="tool-label">
          {t('selectLicense')}
        </label>
        <div class="grid grid-cols-2 md:grid-cols-3 gap-2">
          {#each LICENSES as license (license.id)}
<button 
              onclick={() => selectedLicense = license.id}
              class={`p-3 rounded-lg text-left ${
                selectedLicense === license.id
                  ? 'bg-amber-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              <div class="font-medium text-sm">{license.name}</div>
            </button>
{/each}
        </div>
      </div>

      <!-- License Info -->
      {#if currentLicense}
<div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg space-y-3">
          <h3 class="font-medium text-gray-900 dark:text-gray-100">{currentLicense.name}</h3>
          <p class="text-sm text-gray-600 dark:text-gray-400">{currentLicense.description}</p>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div>
              <h4 class="font-medium text-green-600 dark:text-green-400 mb-1">{t('permissions')}</h4>
              <ul class="space-y-1">
                {#each currentLicense.permissions as p (p)}
<li  class="text-gray-600 dark:text-gray-400">✓ {p}</li>
{/each}
              </ul>
            </div>
            <div>
              <h4 class="font-medium text-amber-600 dark:text-amber-400 mb-1">{t('conditions')}</h4>
              <ul class="space-y-1">
                {#if currentLicense.conditions.length > 0}
{#each currentLicense.conditions as c (c)}
<li  class="text-gray-600 dark:text-gray-400">• {c}</li>
{/each}
{:else}
<li class="text-gray-400 dark:text-gray-500">{t('none')}</li>
{/if}
              </ul>
            </div>
            <div>
              <h4 class="font-medium text-red-600 dark:text-red-400 mb-1">{t('limitations')}</h4>
              <ul class="space-y-1">
                {#each currentLicense.limitations as l (l)}
<li  class="text-gray-600 dark:text-gray-400">✕ {l}</li>
{/each}
              </ul>
            </div>
          </div>
        </div>
{/if}

      <!-- Author Info -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="tool-label">
            {t('author')}
          </label>
          <input
            type="text"
            bind:value={author}
            placeholder={t('authorPlaceholder')}
            class="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          />
        </div>
        <div>
          <label class="tool-label">
            {t('year')}
          </label>
          <input
            type="text"
            bind:value={year}
            placeholder={t('yearPlaceholder')}
            class="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          />
        </div>
      </div>

      <!-- Actions -->
      <div class="flex justify-center gap-4">
        <button
          onclick={generateLicense}
          class="px-6 py-2 bg-amber-600 hover:bg-amber-700 rounded-lg font-medium text-white"
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
            <label class="text-sm font-medium text-gray-700 dark:text-gray-300">LICENSE</label>
            <div class="flex gap-2">
              <button
                onclick={copyToClipboard}
                class="px-3 py-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded text-sm text-gray-900 dark:text-gray-100"
              >
                {copied ? tCommon('copied') : tCommon('copy')}
              </button>
              <button
                onclick={downloadFile}
                class="px-3 py-1 bg-emerald-500 hover:bg-green-700 rounded text-sm text-white"
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
  
