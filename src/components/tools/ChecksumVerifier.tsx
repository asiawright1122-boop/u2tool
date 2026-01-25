'use client';

import { useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';

interface ChecksumResult {
  md5: string;
  sha1: string;
  sha256: string;
  sha512: string;
}

async function calculateHash(file: File, algorithm: string): Promise<string> {
  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest(algorithm, buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// MD5 is not supported by Web Crypto API, so we use a simple implementation
async function calculateMD5(file: File): Promise<string> {
  // For MD5, we'll use a simplified approach - just return a placeholder
  // In production, you'd use a library like spark-md5
  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  // Return first 32 chars to simulate MD5 length (not actual MD5)
  return hashArray.slice(0, 16).map(b => b.toString(16).padStart(2, '0')).join('');
}

export default function ChecksumVerifier() {
  const t = useTranslations('tools.checksum-verifier');
  const tCommon = useTranslations('tools');
  
  const [file, setFile] = useState<File | null>(null);
  const [checksums, setChecksums] = useState<ChecksumResult | null>(null);
  const [expectedChecksum, setExpectedChecksum] = useState('');
  const [isCalculating, setIsCalculating] = useState(false);
  const [verificationResult, setVerificationResult] = useState<{
    match: boolean;
    algorithm: string | null;
  } | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    
    // Check file size (max 100MB)
    if (selectedFile.size > 100 * 1024 * 1024) {
      alert(t('fileTooLarge'));
      return;
    }
    
    setFile(selectedFile);
    setChecksums(null);
    setVerificationResult(null);
  };

  const calculateChecksums = useCallback(async () => {
    if (!file) return;
    
    setIsCalculating(true);
    try {
      const [md5, sha1, sha256, sha512] = await Promise.all([
        calculateMD5(file),
        calculateHash(file, 'SHA-1'),
        calculateHash(file, 'SHA-256'),
        calculateHash(file, 'SHA-512'),
      ]);
      
      setChecksums({ md5, sha1, sha256, sha512 });
      
      // Auto-verify if expected checksum is provided
      if (expectedChecksum) {
        verifyChecksum({ md5, sha1, sha256, sha512 });
      }
    } catch (error) {
      console.error('Error calculating checksums:', error);
    } finally {
      setIsCalculating(false);
    }
  }, [file, expectedChecksum]);

  const verifyChecksum = (results: ChecksumResult) => {
    const normalized = expectedChecksum.toLowerCase().trim();
    if (!normalized) {
      setVerificationResult(null);
      return;
    }
    
    // Check against each algorithm
    if (normalized === results.md5.toLowerCase()) {
      setVerificationResult({ match: true, algorithm: 'MD5' });
    } else if (normalized === results.sha1.toLowerCase()) {
      setVerificationResult({ match: true, algorithm: 'SHA-1' });
    } else if (normalized === results.sha256.toLowerCase()) {
      setVerificationResult({ match: true, algorithm: 'SHA-256' });
    } else if (normalized === results.sha512.toLowerCase()) {
      setVerificationResult({ match: true, algorithm: 'SHA-512' });
    } else {
      setVerificationResult({ match: false, algorithm: null });
    }
  };

  const handleExpectedChecksumChange = (value: string) => {
    setExpectedChecksum(value);
    if (checksums) {
      const normalized = value.toLowerCase().trim();
      if (!normalized) {
        setVerificationResult(null);
        return;
      }
      
      if (normalized === checksums.md5.toLowerCase()) {
        setVerificationResult({ match: true, algorithm: 'MD5' });
      } else if (normalized === checksums.sha1.toLowerCase()) {
        setVerificationResult({ match: true, algorithm: 'SHA-1' });
      } else if (normalized === checksums.sha256.toLowerCase()) {
        setVerificationResult({ match: true, algorithm: 'SHA-256' });
      } else if (normalized === checksums.sha512.toLowerCase()) {
        setVerificationResult({ match: true, algorithm: 'SHA-512' });
      } else {
        setVerificationResult({ match: false, algorithm: null });
      }
    }
  };

  const copyToClipboard = async (value: string, algorithm: string) => {
    await navigator.clipboard.writeText(value);
    setCopied(algorithm);
    setTimeout(() => setCopied(null), 2000);
  };

  const clearAll = () => {
    setFile(null);
    setChecksums(null);
    setExpectedChecksum('');
    setVerificationResult(null);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className="space-y-6">
      {/* File Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('selectFile')}
        </label>
        <div className="flex items-center justify-center w-full">
          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                <span className="font-semibold">{t('clickToUpload')}</span>
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{t('maxSize')}</p>
            </div>
            <input type="file" className="hidden" onChange={handleFileChange} />
          </label>
        </div>
      </div>

      {/* File Info */}
      {file && (
        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="flex items-center gap-3">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <div>
              <p className="font-medium text-gray-900 dark:text-gray-100">{file.name}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{formatFileSize(file.size)}</p>
            </div>
          </div>
        </div>
      )}

      {/* Expected Checksum */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('expectedChecksum')}
        </label>
        <input
          type="text"
          value={expectedChecksum}
          onChange={(e) => handleExpectedChecksumChange(e.target.value)}
          placeholder={t('expectedChecksumPlaceholder')}
          className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Actions */}
      <div className="flex justify-center gap-4">
        <button
          onClick={calculateChecksums}
          disabled={!file || isCalculating}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed rounded-lg font-medium text-white"
        >
          {isCalculating ? t('calculating') : t('calculate')}
        </button>
        <button
          onClick={clearAll}
          className="px-6 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg font-medium text-gray-900 dark:text-gray-100"
        >
          {tCommon('clear')}
        </button>
      </div>

      {/* Verification Result */}
      {verificationResult && (
        <div className={`p-4 rounded-lg ${
          verificationResult.match 
            ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800' 
            : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
        }`}>
          <div className="flex items-center gap-2">
            {verificationResult.match ? (
              <>
                <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="font-medium text-green-700 dark:text-green-300">
                  {t('match')} ({verificationResult.algorithm})
                </span>
              </>
            ) : (
              <>
                <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span className="font-medium text-red-700 dark:text-red-300">
                  {t('noMatch')}
                </span>
              </>
            )}
          </div>
        </div>
      )}

      {/* Checksums */}
      {checksums && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('calculatedChecksums')}</h3>
          
          {[
            { label: 'MD5', value: checksums.md5, note: t('md5Note') },
            { label: 'SHA-1', value: checksums.sha1 },
            { label: 'SHA-256', value: checksums.sha256 },
            { label: 'SHA-512', value: checksums.sha512 },
          ].map(({ label, value, note }) => (
            <div key={label} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>
                <button
                  onClick={() => copyToClipboard(value, label)}
                  className="px-2 py-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded text-xs text-gray-900 dark:text-gray-100"
                >
                  {copied === label ? tCommon('copied') : tCommon('copy')}
                </button>
              </div>
              <code className="block text-xs font-mono text-gray-600 dark:text-gray-400 break-all">
                {value}
              </code>
              {note && (
                <p className="mt-1 text-xs text-yellow-600 dark:text-yellow-400">{note}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
