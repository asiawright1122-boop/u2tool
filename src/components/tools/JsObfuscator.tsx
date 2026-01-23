'use client';

import { useState, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';

export default function JsObfuscator() {
  const t = useTranslations('tools.js-obfuscator');
  const tg = useTranslations('tools');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);
  const [options, setOptions] = useState({
    renameVariables: true,
    stringEncoding: true,
    deadCodeInjection: false,
    controlFlowFlattening: false,
    unicodeEscape: true,
  });
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const obfuscate = () => {
    if (!input.trim()) {
      setOutput('');
      return;
    }

    let result = input;

    // String encoding - convert strings to hex/unicode
    if (options.stringEncoding) {
      result = result.replace(/'([^'\\]|\\.)*'/g, (match) => {
        const str = match.slice(1, -1);
        const encoded = str.split('').map(c => '\\x' + c.charCodeAt(0).toString(16).padStart(2, '0')).join('');
        return `'${encoded}'`;
      });
      result = result.replace(/"([^"\\]|\\.)*"/g, (match) => {
        const str = match.slice(1, -1);
        const encoded = str.split('').map(c => '\\x' + c.charCodeAt(0).toString(16).padStart(2, '0')).join('');
        return `"${encoded}"`;
      });
    }

    // Unicode escape for identifiers
    if (options.unicodeEscape) {
      // 保留关键字列表供未来使用
      const _keywords = ['function', 'var', 'let', 'const', 'if', 'else', 'for', 'while', 'return', 'class', 'new', 'this', 'true', 'false', 'null', 'undefined', 'typeof', 'instanceof', 'try', 'catch', 'throw', 'finally', 'switch', 'case', 'break', 'continue', 'default', 'do', 'in', 'of', 'async', 'await', 'export', 'import', 'from', 'as', 'extends', 'super', 'static', 'get', 'set', 'yield', 'delete', 'void', 'with', 'debugger'];
      
      // Add wrapper function
      result = `(function(){${result}})();`;
    }

    // Variable renaming
    if (options.renameVariables) {
      const varNames = new Map<string, string>();
      let counter = 0;
      
      const generateName = () => {
        const chars = '_$';
        let name = '';
        let n = counter++;
        do {
          name = chars[n % 2] + name;
          n = Math.floor(n / 2);
        } while (n > 0);
        return '_' + name + Math.random().toString(36).substring(2, 5);
      };

      // Find variable declarations
      const varPattern = /\b(var|let|const)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/g;
      let match;
      while ((match = varPattern.exec(input)) !== null) {
        const varName = match[2];
        if (!varNames.has(varName)) {
          varNames.set(varName, generateName());
        }
      }

      // Find function declarations
      const funcPattern = /\bfunction\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/g;
      while ((match = funcPattern.exec(input)) !== null) {
        const funcName = match[1];
        if (!varNames.has(funcName)) {
          varNames.set(funcName, generateName());
        }
      }

      // Replace variables (simple approach)
      varNames.forEach((newName, oldName) => {
        const regex = new RegExp(`\\b${oldName}\\b`, 'g');
        result = result.replace(regex, newName);
      });
    }

    // Dead code injection
    if (options.deadCodeInjection) {
      const deadCode = [
        'if(false){console.log(Math.random());}',
        'var _0x' + Math.random().toString(16).slice(2, 6) + '=function(){return null;};',
        'while(false){break;}',
      ];
      const randomDead = deadCode[Math.floor(Math.random() * deadCode.length)];
      result = randomDead + result;
    }

    // Control flow flattening (simplified)
    if (options.controlFlowFlattening) {
      result = `var _0xstate=0;while(true){switch(_0xstate){case 0:${result}_0xstate=-1;break;default:return;}}`;
    }

    // Minify - remove extra whitespace
    result = result
      .replace(/\s+/g, ' ')
      .replace(/\s*([{};,:])\s*/g, '$1')
      .replace(/\s*([=+\-*/<>!&|])\s*/g, '$1');

    setOutput(result);
  };

  const copyOutput = async () => {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setCopied(false), 2000);
  };

  const loadSample = () => {
    setInput(`function greetUser(name) {
  const greeting = "Hello, " + name + "!";
  console.log(greeting);
  return greeting;
}

function calculateSum(a, b) {
  let result = a + b;
  return result;
}

const userName = "World";
greetUser(userName);
console.log(calculateSum(5, 10));`);
  };

  useEffect(() => {

    return () => {

      if (timerRef.current) clearTimeout(timerRef.current);

    };

  }, []);


  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={options.renameVariables}
            onChange={(e) => setOptions({ ...options, renameVariables: e.target.checked })}
            className="w-4 h-4"
          />
          <span className="text-sm text-gray-700 dark:text-white">{t('renameVariables')}</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={options.stringEncoding}
            onChange={(e) => setOptions({ ...options, stringEncoding: e.target.checked })}
            className="w-4 h-4"
          />
          <span className="text-sm text-gray-700 dark:text-white">{t('stringEncoding')}</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={options.unicodeEscape}
            onChange={(e) => setOptions({ ...options, unicodeEscape: e.target.checked })}
            className="w-4 h-4"
          />
          <span className="text-sm text-gray-700 dark:text-white">{t('unicodeEscape')}</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={options.deadCodeInjection}
            onChange={(e) => setOptions({ ...options, deadCodeInjection: e.target.checked })}
            className="w-4 h-4"
          />
          <span className="text-sm text-gray-700 dark:text-white">{t('deadCodeInjection')}</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={options.controlFlowFlattening}
            onChange={(e) => setOptions({ ...options, controlFlowFlattening: e.target.checked })}
            className="w-4 h-4"
          />
          <span className="text-sm text-gray-700 dark:text-white">{t('controlFlowFlattening')}</span>
        </label>
      </div>

      <div className="flex gap-2">
        <button
          onClick={loadSample}
          className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg text-sm"
        >
          {t('loadSample')}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-2">{t('inputCode')}</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="tool-textarea h-72 font-mono text-sm"
            placeholder={t('placeholder')}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">{t('obfuscatedCode')}</label>
          <textarea
            value={output}
            readOnly
            className="tool-textarea h-72 font-mono text-sm bg-gray-100 dark:bg-gray-800"
          />
        </div>
      </div>

      <div className="flex justify-center gap-3">
        <button
          onClick={obfuscate}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
        >
          {t('obfuscate')}
        </button>
        <button
          onClick={copyOutput}
          className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg"
          disabled={!output}
        >
          {copied ? tg('copied') : tg('copy')}
        </button>
      </div>

      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg text-sm">
        <p className="text-blue-700 dark:text-blue-400 font-medium mb-2">{t('info')}</p>
        <p className="text-blue-600 dark:text-gray-300">{t('infoText')}</p>
      </div>
    </div>
  );
}
