'use client';

import { useState, useRef } from 'react';
import { useTranslations } from 'next-intl';

interface DetectionResult {
  encoding: string;
  confidence: number;
  details: string;
}

export default function EncodingDetector() {
  const t = useTranslations('tools.encoding-detector');
  const [input, setInput] = useState('');
  const [results, setResults] = useState<DetectionResult[]>([]);
  const [fileInfo, setFileInfo] = useState<{ name: string; size: number } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const detectEncoding = (bytes: Uint8Array): DetectionResult[] => {
    const detections: DetectionResult[] = [];
    
    // Check for BOM
    if (bytes[0] === 0xEF && bytes[1] === 0xBB && bytes[2] === 0xBF) {
      detections.push({ encoding: 'UTF-8 (with BOM)', confidence: 100, details: 'BOM detected: EF BB BF' });
    } else if (bytes[0] === 0xFF && bytes[1] === 0xFE) {
      if (bytes[2] === 0x00 && bytes[3] === 0x00) {
        detections.push({ encoding: 'UTF-32 LE', confidence: 100, details: 'BOM detected: FF FE 00 00' });
      } else {
        detections.push({ encoding: 'UTF-16 LE', confidence: 100, details: 'BOM detected: FF FE' });
      }
    } else if (bytes[0] === 0xFE && bytes[1] === 0xFF) {
      detections.push({ encoding: 'UTF-16 BE', confidence: 100, details: 'BOM detected: FE FF' });
    } else if (bytes[0] === 0x00 && bytes[1] === 0x00 && bytes[2] === 0xFE && bytes[3] === 0xFF) {
      detections.push({ encoding: 'UTF-32 BE', confidence: 100, details: 'BOM detected: 00 00 FE FF' });
    }
    
    // Check for valid UTF-8
    let isValidUtf8 = true;
    let utf8Score = 0;
    for (let i = 0; i < bytes.length; i++) {
      if (bytes[i] < 0x80) {
        utf8Score++;
      } else if ((bytes[i] & 0xE0) === 0xC0) {
        if (i + 1 < bytes.length && (bytes[i + 1] & 0xC0) === 0x80) {
          utf8Score += 2; i++;
        } else { isValidUtf8 = false; break; }
      } else if ((bytes[i] & 0xF0) === 0xE0) {
        if (i + 2 < bytes.length && (bytes[i + 1] & 0xC0) === 0x80 && (bytes[i + 2] & 0xC0) === 0x80) {
          utf8Score += 3; i += 2;
        } else { isValidUtf8 = false; break; }
      } else if ((bytes[i] & 0xF8) === 0xF0) {
        if (i + 3 < bytes.length && (bytes[i + 1] & 0xC0) === 0x80 && (bytes[i + 2] & 0xC0) === 0x80 && (bytes[i + 3] & 0xC0) === 0x80) {
          utf8Score += 4; i += 3;
        } else { isValidUtf8 = false; break; }
      } else if (bytes[i] >= 0x80) { isValidUtf8 = false; break; }
    }

    if (isValidUtf8 && detections.length === 0) {
      const confidence = Math.min(95, 70 + (utf8Score / bytes.length) * 25);
      detections.push({ encoding: 'UTF-8 (no BOM)', confidence, details: 'Valid UTF-8 sequence detected' });
    }
    
    // Check for ASCII
    const asciiCount = bytes.filter(b => b < 128).length;
    if (asciiCount === bytes.length) {
      detections.push({ encoding: 'ASCII', confidence: 90, details: 'All bytes are in ASCII range (0-127)' });
    }
    
    // Check for ISO-8859-1 (Latin-1)
    const latin1Count = bytes.filter(b => b < 256).length;
    if (latin1Count === bytes.length && !isValidUtf8) {
      detections.push({ encoding: 'ISO-8859-1 (Latin-1)', confidence: 60, details: 'All bytes valid for Latin-1' });
    }
    
    return detections.sort((a, b) => b.confidence - a.confidence);
  };

  const analyzeText = () => {
    const encoder = new TextEncoder();
    const bytes = encoder.encode(input);
    setResults(detectEncoding(bytes));
    setFileInfo(null);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const arrayBuffer = event.target?.result as ArrayBuffer;
        const bytes = new Uint8Array(arrayBuffer);
        setResults(detectEncoding(bytes));
        setFileInfo({ name: file.name, size: file.size });
      };
      reader.readAsArrayBuffer(file);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">{t('input')}</label>
        <textarea value={input} onChange={(e) => setInput(e.target.value)}
          className="w-full h-40 px-4 py-3 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white font-mono text-sm"
          placeholder={t('placeholder')} />
      </div>

      <div className="flex gap-4">
        <button onClick={analyzeText}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
          {t('analyzeText')}
        </button>
        <button onClick={() => fileInputRef.current?.click()}
          className="px-6 py-2 bg-gray-200 dark:bg-gray-600 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-500 rounded-lg font-medium transition-colors">
          {t('uploadFile')}
        </button>
        <input ref={fileInputRef} type="file" onChange={handleFileUpload} className="hidden" />
      </div>

      {fileInfo && (
        <div className="bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg p-4">
          <div className="text-gray-700 dark:text-gray-300">{t('file')}: {fileInfo.name}</div>
          <div className="text-gray-600 dark:text-gray-300 text-sm">{t('size')}: {fileInfo.size} bytes</div>
        </div>
      )}

      {results.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">{t('results')}</label>
          <div className="space-y-2">
            {results.map((result, index) => (
              <div key={index} className="bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-900 dark:text-white">{result.encoding}</span>
                  <span className={`px-2 py-1 rounded text-sm text-white ${
                    result.confidence >= 90 ? 'bg-green-600' : result.confidence >= 70 ? 'bg-yellow-600' : 'bg-gray-500 dark:bg-gray-600'
                  }`}>{result.confidence}% {t('confidence')}</span>
                </div>
                <div className="text-gray-600 dark:text-gray-300 text-sm mt-1">{result.details}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
