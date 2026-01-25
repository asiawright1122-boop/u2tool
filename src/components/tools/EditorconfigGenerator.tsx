'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

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

const DEFAULT_FILE_TYPES: FileTypeConfig[] = [
  { pattern: '*', indentStyle: 'space', indentSize: 2, endOfLine: 'lf', charset: 'utf-8', trimTrailingWhitespace: true, insertFinalNewline: true },
];

const COMMON_PATTERNS = [
  { pattern: '*.md', label: 'Markdown' },
  { pattern: '*.py', label: 'Python' },
  { pattern: '*.go', label: 'Go' },
  { pattern: '*.java', label: 'Java' },
  { pattern: '*.{js,jsx,ts,tsx}', label: 'JavaScript/TypeScript' },
  { pattern: '*.{css,scss,less}', label: 'CSS' },
  { pattern: '*.{html,htm}', label: 'HTML' },
  { pattern: '*.{json,yaml,yml}', label: 'JSON/YAML' },
  { pattern: 'Makefile', label: 'Makefile' },
  { pattern: '*.{sh,bash}', label: 'Shell' },
];

export default function EditorconfigGenerator() {
  const t = useTranslations('tools.editorconfig-generator');
  const tCommon = useTranslations('tools');
  
  const [config, setConfig] = useState<EditorconfigOptions>({
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
  
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);

  const addFileType = (pattern: string) => {
    if (config.fileTypes.some(ft => ft.pattern === pattern)) return;
    
    setConfig(prev => ({
      ...prev,
      fileTypes: [...prev.fileTypes, {
        pattern,
        indentStyle: prev.defaultConfig.indentStyle,
        indentSize: prev.defaultConfig.indentSize,
        endOfLine: prev.defaultConfig.endOfLine,
        charset: prev.defaultConfig.charset,
        trimTrailingWhitespace: prev.defaultConfig.trimTrailingWhitespace,
        insertFinalNewline: prev.defaultConfig.insertFinalNewline,
      }],
    }));
  };

  const updateFileType = (index: number, updates: Partial<FileTypeConfig>) => {
    setConfig(prev => ({
      ...prev,
      fileTypes: prev.fileTypes.map((ft, i) => 
        i === index ? { ...ft, ...updates } : ft
      ),
    }));
  };

  const removeFileType = (index: number) => {
    setConfig(prev => ({
      ...prev,
      fileTypes: prev.fileTypes.filter((_, i) => i !== index),
    }));
  };

  const generateConfig = () => {
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
    
    setOutput(lines.join('\n'));
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadFile = () => {
    const blob = new Blob([output], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = '.editorconfig';
    link.click();
    URL.revokeObjectURL(url);
  };

  const clearAll = () => {
    setConfig({
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
    setOutput('');
  };

  return (
    <div className="space-y-6">
      {/* Root */}
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={config.root}
          onChange={(e) => setConfig(prev => ({ ...prev, root: e.target.checked }))}
          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
        />
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('root')}</span>
      </label>

      {/* Default Config */}
      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg space-y-4">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('defaultSettings')}</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">{t('indentStyle')}</label>
            <select
              value={config.defaultConfig.indentStyle}
              onChange={(e) => setConfig(prev => ({ 
                ...prev, 
                defaultConfig: { ...prev.defaultConfig, indentStyle: e.target.value as 'space' | 'tab' }
              }))}
              className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded text-sm text-gray-900 dark:text-gray-100"
            >
              <option value="space">Space</option>
              <option value="tab">Tab</option>
            </select>
          </div>

          <div>
            <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">{t('indentSize')}</label>
            <select
              value={config.defaultConfig.indentSize}
              onChange={(e) => setConfig(prev => ({ 
                ...prev, 
                defaultConfig: { ...prev.defaultConfig, indentSize: parseInt(e.target.value) }
              }))}
              className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded text-sm text-gray-900 dark:text-gray-100"
            >
              <option value="2">2</option>
              <option value="4">4</option>
              <option value="8">8</option>
            </select>
          </div>

          <div>
            <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">{t('endOfLine')}</label>
            <select
              value={config.defaultConfig.endOfLine}
              onChange={(e) => setConfig(prev => ({ 
                ...prev, 
                defaultConfig: { ...prev.defaultConfig, endOfLine: e.target.value as 'lf' | 'crlf' | 'cr' }
              }))}
              className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded text-sm text-gray-900 dark:text-gray-100"
            >
              <option value="lf">LF (Unix)</option>
              <option value="crlf">CRLF (Windows)</option>
              <option value="cr">CR</option>
            </select>
          </div>

          <div>
            <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">{t('charset')}</label>
            <select
              value={config.defaultConfig.charset}
              onChange={(e) => setConfig(prev => ({ 
                ...prev, 
                defaultConfig: { ...prev.defaultConfig, charset: e.target.value }
              }))}
              className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded text-sm text-gray-900 dark:text-gray-100"
            >
              <option value="utf-8">UTF-8</option>
              <option value="utf-8-bom">UTF-8 BOM</option>
              <option value="latin1">Latin1</option>
            </select>
          </div>
        </div>

        <div className="flex flex-wrap gap-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={config.defaultConfig.trimTrailingWhitespace}
              onChange={(e) => setConfig(prev => ({ 
                ...prev, 
                defaultConfig: { ...prev.defaultConfig, trimTrailingWhitespace: e.target.checked }
              }))}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-xs text-gray-700 dark:text-gray-300">{t('trimTrailingWhitespace')}</span>
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={config.defaultConfig.insertFinalNewline}
              onChange={(e) => setConfig(prev => ({ 
                ...prev, 
                defaultConfig: { ...prev.defaultConfig, insertFinalNewline: e.target.checked }
              }))}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-xs text-gray-700 dark:text-gray-300">{t('insertFinalNewline')}</span>
          </label>
        </div>
      </div>

      {/* Add File Types */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('addFileType')}
        </label>
        <div className="flex flex-wrap gap-2">
          {COMMON_PATTERNS.map(({ pattern, label }) => (
            <button
              key={pattern}
              onClick={() => addFileType(pattern)}
              disabled={config.fileTypes.some(ft => ft.pattern === pattern)}
              className={`px-3 py-1.5 rounded text-sm ${
                config.fileTypes.some(ft => ft.pattern === pattern)
                  ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* File Type Configs */}
      {config.fileTypes.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('fileTypeSettings')}</h3>
          {config.fileTypes.map((ft, index) => (
            <div key={ft.pattern} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg space-y-3">
              <div className="flex justify-between items-center">
                <code className="text-sm font-mono text-blue-600 dark:text-blue-400">{ft.pattern}</code>
                <button
                  onClick={() => removeFileType(index)}
                  className="px-2 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-xs"
                >
                  {t('remove')}
                </button>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">{t('indentStyle')}</label>
                  <select
                    value={ft.indentStyle}
                    onChange={(e) => updateFileType(index, { indentStyle: e.target.value as 'space' | 'tab' })}
                    className="w-full px-2 py-1 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded text-xs text-gray-900 dark:text-gray-100"
                  >
                    <option value="space">Space</option>
                    <option value="tab">Tab</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">{t('indentSize')}</label>
                  <select
                    value={ft.indentSize}
                    onChange={(e) => updateFileType(index, { indentSize: parseInt(e.target.value) })}
                    className="w-full px-2 py-1 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded text-xs text-gray-900 dark:text-gray-100"
                  >
                    <option value="2">2</option>
                    <option value="4">4</option>
                    <option value="8">8</option>
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-center gap-4">
        <button
          onClick={generateConfig}
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
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">.editorconfig</label>
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
          <pre className="w-full p-4 bg-gray-900 dark:bg-gray-950 border border-gray-700 rounded-lg font-mono text-sm text-green-400 overflow-x-auto whitespace-pre-wrap">
            {output}
          </pre>
        </div>
      )}
    </div>
  );
}
