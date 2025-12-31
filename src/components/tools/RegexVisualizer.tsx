'use client';

import { useState, useCallback, useRef } from 'react';
import { useTranslations } from 'next-intl';

interface MatchResult {
  match: string;
  index: number;
  groups: string[];
}

// Simple regex parser for visualization
interface RegexToken {
  type: 'literal' | 'group' | 'charset' | 'quantifier' | 'anchor' | 'alternation' | 'special';
  value: string;
  children?: RegexToken[];
}

function tokenizeRegex(pattern: string): RegexToken[] {
  const tokens: RegexToken[] = [];
  let i = 0;
  
  while (i < pattern.length) {
    const char = pattern[i];
    
    // Anchors
    if (char === '^' || char === '$') {
      tokens.push({ type: 'anchor', value: char });
      i++;
      continue;
    }
    
    // Escape sequences
    if (char === '\\' && i + 1 < pattern.length) {
      const next = pattern[i + 1];
      tokens.push({ type: 'special', value: '\\' + next });
      i += 2;
      continue;
    }
    
    // Character class
    if (char === '[') {
      let end = i + 1;
      while (end < pattern.length && pattern[end] !== ']') {
        if (pattern[end] === '\\') end++;
        end++;
      }
      tokens.push({ type: 'charset', value: pattern.slice(i, end + 1) });
      i = end + 1;
      continue;
    }
    
    // Groups
    if (char === '(') {
      let depth = 1;
      let end = i + 1;
      while (end < pattern.length && depth > 0) {
        if (pattern[end] === '(' && pattern[end - 1] !== '\\') depth++;
        if (pattern[end] === ')' && pattern[end - 1] !== '\\') depth--;
        end++;
      }
      const groupContent = pattern.slice(i + 1, end - 1);
      tokens.push({ 
        type: 'group', 
        value: pattern.slice(i, end),
        children: tokenizeRegex(groupContent)
      });
      i = end;
      continue;
    }
    
    // Quantifiers
    if (char === '*' || char === '+' || char === '?' || char === '{') {
      if (char === '{') {
        let end = i + 1;
        while (end < pattern.length && pattern[end] !== '}') end++;
        tokens.push({ type: 'quantifier', value: pattern.slice(i, end + 1) });
        i = end + 1;
      } else {
        tokens.push({ type: 'quantifier', value: char });
        i++;
      }
      continue;
    }
    
    // Alternation
    if (char === '|') {
      tokens.push({ type: 'alternation', value: '|' });
      i++;
      continue;
    }
    
    // Dot (any character)
    if (char === '.') {
      tokens.push({ type: 'special', value: '.' });
      i++;
      continue;
    }
    
    // Literal character
    tokens.push({ type: 'literal', value: char });
    i++;
  }
  
  return tokens;
}

// Generate SVG for regex visualization
function generateSvg(tokens: RegexToken[]): string {
  const boxHeight = 30;
  const boxPadding = 10;
  const spacing = 10;
  let x = 20;
  const y = 20;
  
  const elements: string[] = [];
  
  // Start circle
  elements.push(`<circle cx="${x}" cy="${y + boxHeight/2}" r="8" fill="#4CAF50"/>`);
  x += 20;
  
  for (const token of tokens) {
    // Connection line
    elements.push(`<line x1="${x - 10}" y1="${y + boxHeight/2}" x2="${x}" y2="${y + boxHeight/2}" stroke="#666" stroke-width="2"/>`);
    
    const text = token.value;
    const textWidth = Math.max(text.length * 8 + boxPadding * 2, 40);
    
    let fillColor = '#E3F2FD';
    let strokeColor = '#2196F3';
    
    switch (token.type) {
      case 'anchor':
        fillColor = '#FFF3E0';
        strokeColor = '#FF9800';
        break;
      case 'charset':
        fillColor = '#E8F5E9';
        strokeColor = '#4CAF50';
        break;
      case 'group':
        fillColor = '#F3E5F5';
        strokeColor = '#9C27B0';
        break;
      case 'quantifier':
        fillColor = '#FFEBEE';
        strokeColor = '#F44336';
        break;
      case 'special':
        fillColor = '#E0F7FA';
        strokeColor = '#00BCD4';
        break;
      case 'alternation':
        fillColor = '#FFF8E1';
        strokeColor = '#FFC107';
        break;
    }
    
    elements.push(`<rect x="${x}" y="${y}" width="${textWidth}" height="${boxHeight}" rx="5" fill="${fillColor}" stroke="${strokeColor}" stroke-width="2"/>`);
    elements.push(`<text x="${x + textWidth/2}" y="${y + boxHeight/2 + 5}" text-anchor="middle" font-family="monospace" font-size="12" fill="#333">${escapeHtml(text)}</text>`);
    
    x += textWidth + spacing;
  }
  
  // End circle
  elements.push(`<line x1="${x - 10}" y1="${y + boxHeight/2}" x2="${x}" y2="${y + boxHeight/2}" stroke="#666" stroke-width="2"/>`);
  elements.push(`<circle cx="${x + 8}" cy="${y + boxHeight/2}" r="8" fill="#F44336"/>`);
  
  const width = x + 40;
  const height = boxHeight + 40;
  
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
    <rect width="100%" height="100%" fill="#fff"/>
    ${elements.join('\n    ')}
  </svg>`;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export default function RegexVisualizer() {
  const t = useTranslations('tools.regex-visualizer');
  const tg = useTranslations('tools');
  
  const [pattern, setPattern] = useState('');
  const [testString, setTestString] = useState('');
  const [matches, setMatches] = useState<MatchResult[]>([]);
  const [error, setError] = useState('');
  const [svg, setSvg] = useState('');
  const svgRef = useRef<HTMLDivElement>(null);

  const handleVisualize = useCallback(() => {
    if (!pattern.trim()) {
      setSvg('');
      setMatches([]);
      setError('');
      return;
    }

    try {
      // Validate regex
      const regex = new RegExp(pattern, 'g');
      
      // Generate visualization
      const tokens = tokenizeRegex(pattern);
      const svgContent = generateSvg(tokens);
      setSvg(svgContent);
      
      // Find matches
      if (testString) {
        const results: MatchResult[] = [];
        let match;
        while ((match = regex.exec(testString)) !== null) {
          results.push({
            match: match[0],
            index: match.index,
            groups: match.slice(1),
          });
          if (match[0].length === 0) break; // Prevent infinite loop
        }
        setMatches(results);
      } else {
        setMatches([]);
      }
      
      setError('');
    } catch (e) {
      setError(t('invalidRegex') + ': ' + (e as Error).message);
      setSvg('');
      setMatches([]);
    }
  }, [pattern, testString, t]);

  const handleClear = () => {
    setPattern('');
    setTestString('');
    setMatches([]);
    setSvg('');
    setError('');
  };

  const exportSvg = () => {
    if (!svg) return;
    const blob = new Blob([svg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'regex-diagram.svg';
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportPng = async () => {
    if (!svg || !svgRef.current) return;
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const img = new Image();
    const svgBlob = new Blob([svg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(svgBlob);
    
    img.onload = () => {
      canvas.width = img.width * 2;
      canvas.height = img.height * 2;
      ctx.scale(2, 2);
      ctx.drawImage(img, 0, 0);
      
      const pngUrl = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = pngUrl;
      a.download = 'regex-diagram.png';
      a.click();
      
      URL.revokeObjectURL(url);
    };
    
    img.src = url;
  };

  // Highlight matches in test string
  const highlightedString = testString && matches.length > 0 ? (() => {
    let result = [];
    let lastIndex = 0;
    
    for (const match of matches) {
      if (match.index > lastIndex) {
        result.push(<span key={`text-${lastIndex}`}>{testString.slice(lastIndex, match.index)}</span>);
      }
      result.push(
        <span key={`match-${match.index}`} className="bg-yellow-300 dark:bg-yellow-600 px-0.5 rounded">
          {match.match}
        </span>
      );
      lastIndex = match.index + match.match.length;
    }
    
    if (lastIndex < testString.length) {
      result.push(<span key={`text-${lastIndex}`}>{testString.slice(lastIndex)}</span>);
    }
    
    return result;
  })() : testString;

  return (
    <div className="space-y-4">
      {/* Pattern Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('pattern')}
        </label>
        <input
          type="text"
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 font-mono"
          value={pattern}
          onChange={(e) => setPattern(e.target.value)}
          placeholder={t('patternPlaceholder')}
        />
      </div>

      {/* Test String Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('testString')}
        </label>
        <textarea
          className="tool-textarea font-mono"
          value={testString}
          onChange={(e) => setTestString(e.target.value)}
          placeholder={t('testStringPlaceholder')}
          rows={3}
        />
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2">
        <button onClick={handleVisualize} className="btn-primary">
          {t('visualize')}
        </button>
        <button onClick={handleClear} className="btn-secondary">
          {tg('clear')}
        </button>
      </div>

      {/* Error Section */}
      {error && (
        <div className="tool-error">
          {error}
        </div>
      )}

      {/* Diagram Section */}
      {svg && (
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {t('diagram')}
            </label>
            <div className="flex gap-2">
              <button
                onClick={exportSvg}
                className="text-sm px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100"
              >
                {t('exportSvg')}
              </button>
              <button
                onClick={exportPng}
                className="text-sm px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100"
              >
                {t('exportPng')}
              </button>
            </div>
          </div>
          <div 
            ref={svgRef}
            className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-x-auto"
            dangerouslySetInnerHTML={{ __html: svg }}
          />
        </div>
      )}

      {/* Matches Section */}
      {testString && (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('matches')} ({matches.length})
          </label>
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            {matches.length > 0 ? (
              <>
                <div className="font-mono text-gray-900 dark:text-gray-100 mb-4 whitespace-pre-wrap">
                  {highlightedString}
                </div>
                <div className="space-y-2">
                  {matches.map((match, index) => (
                    <div key={index} className="text-sm">
                      <span className="text-gray-500 dark:text-gray-400">Match {index + 1}:</span>{' '}
                      <span className="font-mono bg-yellow-100 dark:bg-yellow-900/30 px-1 rounded">
                        {match.match}
                      </span>
                      <span className="text-gray-500 dark:text-gray-400 ml-2">
                        (index: {match.index})
                      </span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-gray-500 dark:text-gray-400">
                {t('noMatches')}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
