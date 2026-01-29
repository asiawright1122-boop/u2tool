'use client';

import { useState, useCallback, useMemo } from 'react';
import { useTranslations } from 'next-intl';

interface ConflictBlock {
  id: number;
  ours: string;
  theirs: string;
  resolved: string;
  resolution: 'ours' | 'theirs' | 'both' | 'custom' | null;
}

function parseConflicts(content: string): { blocks: ConflictBlock[]; nonConflict: string[] } {
  const blocks: ConflictBlock[] = [];
  const nonConflict: string[] = [];
  
  const conflictRegex = /<<<<<<< .*?\n([\s\S]*?)=======\n([\s\S]*?)>>>>>>> .*?(?:\n|$)/g;
  let lastIndex = 0;
  let match;
  let id = 0;
  
  while ((match = conflictRegex.exec(content)) !== null) {
    if (match.index > lastIndex) {
      nonConflict.push(content.slice(lastIndex, match.index));
    }
    
    blocks.push({
      id: id++,
      ours: match[1].trimEnd(),
      theirs: match[2].trimEnd(),
      resolved: '',
      resolution: null,
    });
    
    lastIndex = match.index + match[0].length;
  }
  
  if (lastIndex < content.length) {
    nonConflict.push(content.slice(lastIndex));
  }
  
  return { blocks, nonConflict };
}

function generateResolved(blocks: ConflictBlock[], nonConflict: string[]): string {
  let result = '';
  
  for (let i = 0; i < blocks.length; i++) {
    if (nonConflict[i]) {
      result += nonConflict[i];
    }
    
    const block = blocks[i];
    if (block.resolution) {
      switch (block.resolution) {
        case 'ours':
          result += block.ours;
          break;
        case 'theirs':
          result += block.theirs;
          break;
        case 'both':
          result += block.ours + '\n' + block.theirs;
          break;
        case 'custom':
          result += block.resolved;
          break;
      }
      result += '\n';
    } else {
      result += `<<<<<<< HEAD\n${block.ours}\n=======\n${block.theirs}\n>>>>>>> branch\n`;
    }
  }
  
  if (nonConflict[blocks.length]) {
    result += nonConflict[blocks.length];
  }
  
  return result;
}

const SAMPLE_CONFLICT = `function greet(name) {
<<<<<<< HEAD
  console.log("Hello, " + name + "!");
  return "Hello, " + name;
=======
  console.log(\`Welcome, \${name}!\`);
  return \`Welcome, \${name}\`;
>>>>>>> feature-branch
}

<<<<<<< HEAD
const DEFAULT_NAME = "World";
=======
const DEFAULT_NAME = "User";
const GREETING_PREFIX = "Hi";
>>>>>>> feature-branch

greet(DEFAULT_NAME);`;

export default function MergeConflictResolver() {
  const t = useTranslations('tools.merge-conflict-resolver');
  const tCommon = useTranslations('tools');
  const [input, setInput] = useState(SAMPLE_CONFLICT);
  const [copied, setCopied] = useState(false);

  const { blocks, nonConflict } = useMemo(() => parseConflicts(input), [input]);
  const [resolvedBlocks, setResolvedBlocks] = useState<ConflictBlock[]>(blocks);

  const handleInputChange = useCallback((value: string) => {
    setInput(value);
    const parsed = parseConflicts(value);
    setResolvedBlocks(parsed.blocks);
  }, []);

  const handleResolve = useCallback((id: number, resolution: ConflictBlock['resolution'], customValue?: string) => {
    setResolvedBlocks(prev => prev.map(block => {
      if (block.id === id) {
        return {
          ...block,
          resolution,
          resolved: customValue ?? (resolution === 'ours' ? block.ours : resolution === 'theirs' ? block.theirs : resolution === 'both' ? block.ours + '\n' + block.theirs : block.resolved),
        };
      }
      return block;
    }));
  }, []);

  const resolvedContent = useMemo(() => generateResolved(resolvedBlocks, nonConflict), [resolvedBlocks, nonConflict]);
  const allResolved = resolvedBlocks.every(b => b.resolution !== null);
  const hasConflicts = blocks.length > 0;

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(resolvedContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [resolvedContent]);

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Paste Content with Merge Conflicts
        </label>
        <textarea
          value={input}
          onChange={(e) => handleInputChange(e.target.value)}
          placeholder={t("inputPlaceholder")}
          rows={10}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono text-sm resize-none"
        />
      </div>

      {hasConflicts ? (
        <>
          <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            <p className="text-sm text-yellow-700 dark:text-yellow-300">
              Found {blocks.length} conflict{blocks.length > 1 ? 's' : ''} • 
              {resolvedBlocks.filter(b => b.resolution).length} resolved
            </p>
          </div>

          <div className="space-y-4">
            {resolvedBlocks.map((block, idx) => (
              <div key={block.id} className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
                <div className="bg-gray-100 dark:bg-gray-800 px-4 py-2 flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Conflict #{idx + 1}
                  </span>
                  {block.resolution && (
                    <span className="text-xs px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded">
                      Resolved: {block.resolution}
                    </span>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-300 dark:divide-gray-600">
                  <div className="p-3">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-medium text-blue-600 dark:text-blue-400">HEAD (Ours)</span>
                      <button
                        onClick={() => handleResolve(block.id, 'ours')}
                        className={`text-xs px-2 py-1 rounded ${block.resolution === 'ours' ? 'bg-blue-600 text-white' : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 hover:bg-blue-200'}`}
                      >
                        Use This
                      </button>
                    </div>
                    <pre className="text-xs bg-blue-50 dark:bg-blue-900/20 p-2 rounded overflow-x-auto whitespace-pre-wrap">
                      {block.ours}
                    </pre>
                  </div>
                  
                  <div className="p-3">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-medium text-purple-600 dark:text-purple-400">Incoming (Theirs)</span>
                      <button
                        onClick={() => handleResolve(block.id, 'theirs')}
                        className={`text-xs px-2 py-1 rounded ${block.resolution === 'theirs' ? 'bg-purple-600 text-white' : 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 hover:bg-purple-200'}`}
                      >
                        Use This
                      </button>
                    </div>
                    <pre className="text-xs bg-purple-50 dark:bg-purple-900/20 p-2 rounded overflow-x-auto whitespace-pre-wrap">
                      {block.theirs}
                    </pre>
                  </div>
                </div>
                
                <div className="p-3 bg-gray-50 dark:bg-gray-900 border-t border-gray-300 dark:border-gray-600">
                  <div className="flex gap-2 mb-2">
                    <button
                      onClick={() => handleResolve(block.id, 'both')}
                      className={`text-xs px-2 py-1 rounded ${block.resolution === 'both' ? 'bg-green-600 text-white' : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 hover:bg-green-200'}`}
                    >
                      Keep Both
                    </button>
                    <button
                      onClick={() => handleResolve(block.id, 'custom', block.resolved || block.ours)}
                      className={`text-xs px-2 py-1 rounded ${block.resolution === 'custom' ? 'bg-orange-600 text-white' : 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 hover:bg-orange-200'}`}
                    >
                      Custom Edit
                    </button>
                  </div>
                  
                  {block.resolution === 'custom' && (
                    <textarea
                      value={block.resolved}
                      onChange={(e) => handleResolve(block.id, 'custom', e.target.value)}
                      rows={4}
                      className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono text-xs resize-none"
                    />
                  )}
                </div>
              </div>
            ))}
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Resolved Content {allResolved && <span className="text-green-500">✓</span>}
              </label>
              <button
                onClick={handleCopy}
                className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
              >
                {copied ? tCommon('copied') : tCommon('copy')}
              </button>
            </div>
            <pre className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg overflow-x-auto text-xs font-mono text-gray-800 dark:text-gray-200 max-h-64 whitespace-pre-wrap">
              {resolvedContent}
            </pre>
          </div>
        </>
      ) : (
        <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg text-center">
          <p className="text-green-700 dark:text-green-300">No merge conflicts detected in the input.</p>
        </div>
      )}
    </div>
  );
}
