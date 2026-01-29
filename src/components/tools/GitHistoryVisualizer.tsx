'use client';

import { useState, useCallback, useMemo } from 'react';
import { useTranslations } from 'next-intl';

interface Commit {
  hash: string;
  shortHash: string;
  message: string;
  author: string;
  date: string;
  branch?: string;
  parents: string[];
  isMerge: boolean;
}

function parseGitLog(log: string): Commit[] {
  const commits: Commit[] = [];
  const lines = log.trim().split('\n').filter(Boolean);
  
  for (const line of lines) {
    // Format: hash|parents|author|date|message
    const parts = line.split('|');
    if (parts.length >= 5) {
      const [hash, parents, author, date, ...messageParts] = parts;
      const parentList = parents.split(' ').filter(Boolean);
      commits.push({
        hash: hash.trim(),
        shortHash: hash.trim().substring(0, 7),
        message: messageParts.join('|').trim(),
        author: author.trim(),
        date: date.trim(),
        parents: parentList,
        isMerge: parentList.length > 1,
      });
    }
  }
  
  return commits;
}

const SAMPLE_LOG = `a1b2c3d4e5f6|f7g8h9i0j1k2|John Doe|2024-01-15 10:30|feat: Add user authentication
f7g8h9i0j1k2|l3m4n5o6p7q8 r9s0t1u2v3w4|Jane Smith|2024-01-14 16:45|Merge branch 'feature/login' into main
l3m4n5o6p7q8|x5y6z7a8b9c0|John Doe|2024-01-14 14:20|fix: Resolve login redirect issue
r9s0t1u2v3w4|x5y6z7a8b9c0|Jane Smith|2024-01-14 11:00|docs: Update API documentation
x5y6z7a8b9c0|d1e2f3g4h5i6|John Doe|2024-01-13 09:15|refactor: Clean up auth module
d1e2f3g4h5i6|j7k8l9m0n1o2|Jane Smith|2024-01-12 17:30|feat: Add password reset
j7k8l9m0n1o2|p3q4r5s6t7u8|John Doe|2024-01-11 14:00|chore: Update dependencies
p3q4r5s6t7u8||Jane Smith|2024-01-10 10:00|Initial commit`;

function getCommitColor(message: string): string {
  if (message.startsWith('feat')) return 'bg-green-500';
  if (message.startsWith('fix')) return 'bg-red-500';
  if (message.startsWith('docs')) return 'bg-blue-500';
  if (message.startsWith('refactor')) return 'bg-yellow-500';
  if (message.startsWith('chore')) return 'bg-gray-500';
  if (message.startsWith('Merge')) return 'bg-purple-500';
  return 'bg-gray-400';
}

export default function GitHistoryVisualizer() {
  const t = useTranslations('tools.git-history-visualizer');
  const tCommon = useTranslations('tools');
  const [input, setInput] = useState(SAMPLE_LOG);
  const [selectedCommit, setSelectedCommit] = useState<Commit | null>(null);
  const [copied, setCopied] = useState(false);

  const commits = useMemo(() => parseGitLog(input), [input]);

  const handleCopy = useCallback(() => {
    const command = 'git log --pretty=format:"%H|%P|%an|%ad|%s" --date=short';
    navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Git Log Output
          </label>
          <button
            onClick={handleCopy}
            className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400"
          >
            {copied ? tCommon('copied') : 'Copy git log command'}
          </button>
        </div>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t("inputPlaceholder")}
          rows={6}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono text-xs resize-none"
        />
        <p className="text-xs text-gray-500 mt-1">
          Run: <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">git log --pretty=format:&quot;%H|%P|%an|%ad|%s&quot; --date=short</code>
        </p>
      </div>

      {commits.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Commit Graph ({commits.length} commits)
            </h3>
            <div className="relative border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
              <div className="max-h-96 overflow-y-auto">
                {commits.map((commit, idx) => (
                  <div
                    key={commit.hash}
                    onClick={() => setSelectedCommit(commit)}
                    className={`flex items-start gap-3 p-3 border-b border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 ${
                      selectedCommit?.hash === commit.hash ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                    }`}
                  >
                    <div className="flex flex-col items-center">
                      <div className={`w-3 h-3 rounded-full ${getCommitColor(commit.message)} ${commit.isMerge ? 'ring-2 ring-purple-300' : ''}`} />
                      {idx < commits.length - 1 && (
                        <div className="w-0.5 h-8 bg-gray-300 dark:bg-gray-600" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <code className="text-xs bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded text-gray-700 dark:text-gray-300">
                          {commit.shortHash}
                        </code>
                        {commit.isMerge && (
                          <span className="text-xs px-1.5 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded">
                            merge
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-900 dark:text-white truncate">
                        {commit.message}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {commit.author} • {commit.date}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Commit Details
            </h3>
            {selectedCommit ? (
              <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg space-y-3">
                <div>
                  <label className="text-xs text-gray-500 dark:text-gray-400">Hash</label>
                  <p className="text-sm font-mono text-gray-900 dark:text-white break-all">
                    {selectedCommit.hash}
                  </p>
                </div>
                <div>
                  <label className="text-xs text-gray-500 dark:text-gray-400">Message</label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedCommit.message}
                  </p>
                </div>
                <div>
                  <label className="text-xs text-gray-500 dark:text-gray-400">Author</label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedCommit.author}
                  </p>
                </div>
                <div>
                  <label className="text-xs text-gray-500 dark:text-gray-400">Date</label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedCommit.date}
                  </p>
                </div>
                {selectedCommit.parents.length > 0 && (
                  <div>
                    <label className="text-xs text-gray-500 dark:text-gray-400">
                      Parent{selectedCommit.parents.length > 1 ? 's' : ''}
                    </label>
                    <div className="space-y-1">
                      {selectedCommit.parents.map(p => (
                        <p key={p} className="text-xs font-mono text-gray-700 dark:text-gray-300">
                          {p.substring(0, 7)}
                        </p>
                      ))}
                    </div>
                  </div>
                )}
                {selectedCommit.isMerge && (
                  <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                    <span className="text-xs px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded">
                      Merge Commit
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg text-center text-sm text-gray-500">
                Click a commit to view details
              </div>
            )}

            <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <h4 className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">Legend</h4>
              <div className="space-y-1 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span className="text-gray-600 dark:text-gray-400">feat: Feature</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-500" />
                  <span className="text-gray-600 dark:text-gray-400">fix: Bug fix</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                  <span className="text-gray-600 dark:text-gray-400">docs: Documentation</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-yellow-500" />
                  <span className="text-gray-600 dark:text-gray-400">refactor: Refactoring</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-purple-500" />
                  <span className="text-gray-600 dark:text-gray-400">Merge commit</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
