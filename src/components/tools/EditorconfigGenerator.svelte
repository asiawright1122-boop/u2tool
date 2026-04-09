<script lang="ts">
  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['editorconfig-generator'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.editorconfig-generator.${key}`;
  }
  function tCommon(key: string): string {
    const scope = translations['tools'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.${key}`;
  }

  // Types
  interface FileTypeConfig {
  pattern: string;
  indentStyle: 'space' | 'tab';
  indentSize: number;
  endOfLine: 'lf' | 'crlf' | 'cr';
  charset: string;
  trimTrailingWhitespace: boolean;
  insertFinalNewline: boolean;
  maxLineLength?: number;
}
  interface EditorconfigOptions {
  root: boolean;
  defaultConfig: FileTypeConfig;
  fileTypes: FileTypeConfig[];
}

  const COMMON_PATTERNS = [
    { pattern: '*.js', label: 'JavaScript' },
    { pattern: '*.ts', label: 'TypeScript' },
    { pattern: '*.tsx', label: 'TypeScript React' },
    { pattern: '*.py', label: 'Python' },
    { pattern: '*.md', label: 'Markdown' },
    { pattern: '*.{yml,yaml}', label: 'YAML' },
    { pattern: '*.json', label: 'JSON' },
    { pattern: '*.{html,css}', label: 'HTML/CSS' },
  ] as const;

  let config = $state({
    root: true,
    defaultConfig: {
      pattern: '*',
      indentStyle: 'space',
      indentSize: 2,
      endOfLine: 'lf',
      charset: 'utf-8',
      trimTrailingWhitespace: true,
      insertFinalNewline: true,
    },
    fileTypes: [],
  });

  let output = $state('');

  let copied = $state(false);

  // Functions
  function addFileType(pattern: string) {
    if (config.fileTypes.some(ft => ft.pattern === pattern)) return;
    
    config = ({
      ...config,
      fileTypes: [...config.fileTypes, {
        pattern,
        indentStyle: config.defaultConfig.indentStyle,
        indentSize: config.defaultConfig.indentSize,
        endOfLine: config.defaultConfig.endOfLine,
        charset: config.defaultConfig.charset,
        trimTrailingWhitespace: config.defaultConfig.trimTrailingWhitespace,
        insertFinalNewline: config.defaultConfig.insertFinalNewline,
      }],
    });
  }
  function updateFileType(index: number, updates: Partial<FileTypeConfig>) {
    config = ({
      ...config,
      fileTypes: config.fileTypes.map((ft, i) => 
        i === index ? { ...ft, ...updates } : ft
      ),
    });
  }
  function removeFileType(index: number) {
    config = ({
      ...config,
      fileTypes: config.fileTypes.filter((_, i) => i !== index),
    });
  }
  function generateConfig() {
    const lines: string[] = [];
    
    // Root
    if (config.root) {
      lines.push('root = true');
      lines.push('');
    }
    
    // Default config
    lines.push('[*]');
    lines.push(`indent_style = ${config.defaultConfig.indentStyle}`);
    lines.push(`indent_size = ${config.defaultConfig.indentSize}`);
    lines.push(`end_of_line = ${config.defaultConfig.endOfLine}`);
    lines.push(`charset = ${config.defaultConfig.charset}`);
    lines.push(`trim_trailing_whitespace = ${config.defaultConfig.trimTrailingWhitespace}`);
    lines.push(`insert_final_newline = ${config.defaultConfig.insertFinalNewline}`);
    if (config.defaultConfig.maxLineLength) {
      lines.push(`max_line_length = ${config.defaultConfig.maxLineLength}`);
    }
    
    // File type specific configs
    for (const ft of config.fileTypes) {
      lines.push('');
      lines.push(`[${ft.pattern}]`);
      
      if (ft.indentStyle !== config.defaultConfig.indentStyle) {
        lines.push(`indent_style = ${ft.indentStyle}`);
      }
      if (ft.indentSize !== config.defaultConfig.indentSize) {
        lines.push(`indent_size = ${ft.indentSize}`);
      }
      if (ft.endOfLine !== config.defaultConfig.endOfLine) {
        lines.push(`end_of_line = ${ft.endOfLine}`);
      }
      if (ft.charset !== config.defaultConfig.charset) {
        lines.push(`charset = ${ft.charset}`);
      }
      if (ft.trimTrailingWhitespace !== config.defaultConfig.trimTrailingWhitespace) {
        lines.push(`trim_trailing_whitespace = ${ft.trimTrailingWhitespace}`);
      }
      if (ft.insertFinalNewline !== config.defaultConfig.insertFinalNewline) {
        lines.push(`insert_final_newline = ${ft.insertFinalNewline}`);
      }
      if (ft.maxLineLength) {
        lines.push(`max_line_length = ${ft.maxLineLength}`);
      }
    }
    
    output = lines.join('\n');
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
    link.download = '.editorconfig';
    link.click();
    URL.revokeObjectURL(url);
  }
  function clearAll() {
    config = {
      root: true,
      defaultConfig: {
        pattern: '*',
        indentStyle: 'space',
        indentSize: 2,
        endOfLine: 'lf',
        charset: 'utf-8',
        trimTrailingWhitespace: true,
        insertFinalNewline: true,
      },
      fileTypes: [],
    };
    output = '';
  }

</script>


    <div class="space-y-6">
      <!-- Root -->
      <label class="flex items-center gap-2">
        <input
          type="checkbox"
          checked={config.root}
          onchange={(e) => config = ({ ...config, root: e.target.checked })}
          class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
        />
        <span class="text-sm font-medium text-gray-700 dark:text-gray-300">{t('root')}</span>
      </label>

      <!-- Default Config -->
      <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg space-y-4">
        <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300">{t('defaultSettings')}</h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs text-gray-500 dark:text-gray-400 mb-1">{t('indentStyle')}</label>
            <select
              value={config.defaultConfig.indentStyle}
              onchange={(e) => config = ({ 
                ...config, 
                defaultConfig: { ...config.defaultConfig, indentStyle: e.target.value as 'space' | 'tab' }
              })}
              class="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded text-sm text-gray-900 dark:text-gray-100"
            >
              <option value="space">Space</option>
              <option value="tab">Tab</option>
            </select>
          </div>

          <div>
            <label class="block text-xs text-gray-500 dark:text-gray-400 mb-1">{t('indentSize')}</label>
            <select
              value={config.defaultConfig.indentSize}
              onchange={(e) => config = ({ 
                ...config, 
                defaultConfig: { ...config.defaultConfig, indentSize: parseInt(e.target.value) }
              })}
              class="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded text-sm text-gray-900 dark:text-gray-100"
            >
              <option value="2">2</option>
              <option value="4">4</option>
              <option value="8">8</option>
            </select>
          </div>

          <div>
            <label class="block text-xs text-gray-500 dark:text-gray-400 mb-1">{t('endOfLine')}</label>
            <select
              value={config.defaultConfig.endOfLine}
              onchange={(e) => config = ({ 
                ...config, 
                defaultConfig: { ...config.defaultConfig, endOfLine: e.target.value as 'lf' | 'crlf' | 'cr' }
              })}
              class="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded text-sm text-gray-900 dark:text-gray-100"
            >
              <option value="lf">LF (Unix)</option>
              <option value="crlf">CRLF (Windows)</option>
              <option value="cr">CR</option>
            </select>
          </div>

          <div>
            <label class="block text-xs text-gray-500 dark:text-gray-400 mb-1">{t('charset')}</label>
            <select
              value={config.defaultConfig.charset}
              onchange={(e) => config = ({ 
                ...config, 
                defaultConfig: { ...config.defaultConfig, charset: e.target.value }
              })}
              class="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded text-sm text-gray-900 dark:text-gray-100"
            >
              <option value="utf-8">UTF-8</option>
              <option value="utf-8-bom">UTF-8 BOM</option>
              <option value="latin1">Latin1</option>
            </select>
          </div>
        </div>

        <div class="flex flex-wrap gap-4">
          <label class="flex items-center gap-2">
            <input
              type="checkbox"
              checked={config.defaultConfig.trimTrailingWhitespace}
              onchange={(e) => config = ({ 
                ...config, 
                defaultConfig: { ...config.defaultConfig, trimTrailingWhitespace: e.target.checked }
              })}
              class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
            />
            <span class="text-xs text-gray-700 dark:text-gray-300">{t('trimTrailingWhitespace')}</span>
          </label>

          <label class="flex items-center gap-2">
            <input
              type="checkbox"
              checked={config.defaultConfig.insertFinalNewline}
              onchange={(e) => config = ({ 
                ...config, 
                defaultConfig: { ...config.defaultConfig, insertFinalNewline: e.target.checked }
              })}
              class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
            />
            <span class="text-xs text-gray-700 dark:text-gray-300">{t('insertFinalNewline')}</span>
          </label>
        </div>
      </div>

      <!-- Add File Types -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('addFileType')}
        </label>
        <div class="flex flex-wrap gap-2">
          {#each COMMON_PATTERNS as { pattern, label } (pattern)}
<button 
              onclick={() => addFileType(pattern)}
              disabled={config.fileTypes.some(ft => ft.pattern === pattern)}
              class={`px-3 py-1.5 rounded text-sm ${
                config.fileTypes.some(ft => ft.pattern === pattern)
                  ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {label}
            </button>
{/each}
        </div>
      </div>

      <!-- File Type Configs -->
      {#if config.fileTypes.length > 0}
<div class="space-y-4">
          <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300">{t('fileTypeSettings')}</h3>
          {#each config.fileTypes as ft, index (ft.pattern)}
<div  class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg space-y-3">
              <div class="flex justify-between items-center">
                <code class="text-sm font-mono text-blue-600 dark:text-blue-400">{ft.pattern}</code>
                <button
                  onclick={() => removeFileType(index)}
                  class="px-2 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-xs"
                >
                  {t('remove')}
                </button>
              </div>
              
              <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div>
                  <label class="block text-xs text-gray-500 dark:text-gray-400 mb-1">{t('indentStyle')}</label>
                  <select
                    value={ft.indentStyle}
                    onchange={(e) => updateFileType(index, { indentStyle: e.target.value as 'space' | 'tab' })}
                    class="w-full px-2 py-1 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded text-xs text-gray-900 dark:text-gray-100"
                  >
                    <option value="space">Space</option>
                    <option value="tab">Tab</option>
                  </select>
                </div>

                <div>
                  <label class="block text-xs text-gray-500 dark:text-gray-400 mb-1">{t('indentSize')}</label>
                  <select
                    value={ft.indentSize}
                    onchange={(e) => updateFileType(index, { indentSize: parseInt(e.target.value) })}
                    class="w-full px-2 py-1 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded text-xs text-gray-900 dark:text-gray-100"
                  >
                    <option value="2">2</option>
                    <option value="4">4</option>
                    <option value="8">8</option>
                  </select>
                </div>
              </div>
            </div>
{/each}
        </div>
{/if}

      <!-- Actions -->
      <div class="flex justify-center gap-4">
        <button
          onclick={generateConfig}
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
            <label class="text-sm font-medium text-gray-700 dark:text-gray-300">.editorconfig</label>
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
          <pre class="w-full p-4 bg-gray-900 dark:bg-gray-950 border border-gray-700 rounded-lg font-mono text-sm text-green-400 overflow-x-auto whitespace-pre-wrap">
            {output}
          </pre>
        </div>
{/if}
    </div>
  
