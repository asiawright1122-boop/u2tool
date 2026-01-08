'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

const chineseWords = [
  '天地', '玄黄', '宇宙', '洪荒', '日月', '盈昃', '辰宿', '列张', '寒来', '暑往',
  '秋收', '冬藏', '闰余', '成岁', '律吕', '调阳', '云腾', '致雨', '露结', '为霜',
  '金生', '丽水', '玉出', '昆冈', '剑号', '巨阙', '珠称', '夜光', '果珍', '李柰',
  '菜重', '芥姜', '海咸', '河淡', '鳞潜', '羽翔', '龙师', '火帝', '鸟官', '人皇',
  '始制', '文字', '乃服', '衣裳', '推位', '让国', '有虞', '陶唐', '吊民', '伐罪',
  '周发', '殷汤', '坐朝', '问道', '垂拱', '平章', '爱育', '黎首', '臣伏', '戎羌',
  '遐迩', '一体', '率宾', '归王', '鸣凤', '在竹', '白驹', '食场', '化被', '草木',
  '赖及', '万方', '盖此', '身发', '四大', '五常', '恭惟', '鞠养', '岂敢', '毁伤',
];

const chineseSentences = [
  '天地玄黄，宇宙洪荒。',
  '日月盈昃，辰宿列张。',
  '寒来暑往，秋收冬藏。',
  '闰余成岁，律吕调阳。',
  '云腾致雨，露结为霜。',
  '金生丽水，玉出昆冈。',
  '剑号巨阙，珠称夜光。',
  '果珍李柰，菜重芥姜。',
  '海咸河淡，鳞潜羽翔。',
  '龙师火帝，鸟官人皇。',
  '始制文字，乃服衣裳。',
  '推位让国，有虞陶唐。',
  '吊民伐罪，周发殷汤。',
  '坐朝问道，垂拱平章。',
  '爱育黎首，臣伏戎羌。',
];

export default function ChineseLoremIpsum() {
  const t = useTranslations('tools.chinese-lorem-ipsum');
  const tc = useTranslations('tools');

  const [outputType, setOutputType] = useState<'paragraphs' | 'sentences' | 'words'>('paragraphs');
  const [count, setCount] = useState<string>('3');
  const [output, setOutput] = useState<string>('');
  const [copied, setCopied] = useState(false);

  const generateWords = (num: number): string => {
    const result: string[] = [];
    for (let i = 0; i < num; i++) {
      result.push(chineseWords[Math.floor(Math.random() * chineseWords.length)]);
    }
    return result.join('');
  };

  const generateSentences = (num: number): string => {
    const result: string[] = [];
    for (let i = 0; i < num; i++) {
      result.push(chineseSentences[Math.floor(Math.random() * chineseSentences.length)]);
    }
    return result.join('');
  };

  const generateParagraphs = (num: number): string => {
    const result: string[] = [];
    for (let i = 0; i < num; i++) {
      const sentenceCount = 4 + Math.floor(Math.random() * 4);
      const paragraph = generateSentences(sentenceCount);
      result.push(paragraph);
    }
    return result.join('\n\n');
  };

  const generate = () => {
    const num = parseInt(count) || 1;
    let result = '';

    switch (outputType) {
      case 'paragraphs':
        result = generateParagraphs(num);
        break;
      case 'sentences':
        result = generateSentences(num);
        break;
      case 'words':
        result = generateWords(num);
        break;
    }

    setOutput(result);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        {(['paragraphs', 'sentences', 'words'] as const).map((type) => (
          <button
            key={type}
            onClick={() => setOutputType(type)}
            className={`flex-1 px-4 py-2 rounded-lg transition-colors ${
              outputType === type
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            {t(type)}
          </button>
        ))}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {t('count')}
        </label>
        <input
          type="number"
          value={count}
          onChange={(e) => setCount(e.target.value)}
          min="1"
          max="100"
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        />
      </div>

      <button
        onClick={generate}
        className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        {tc('generate')}
      </button>

      {output && (
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {t('output')}
            </label>
            <div className="flex gap-2">
              <span className="text-sm text-gray-500">
                {output.length} {t('characters')}
              </span>
              <button
                onClick={copyToClipboard}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                {copied ? tc('copied') : tc('copy')}
              </button>
            </div>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg max-h-96 overflow-y-auto">
            <p className="whitespace-pre-wrap text-gray-900 dark:text-white leading-relaxed">
              {output}
            </p>
          </div>
        </div>
      )}

      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <h3 className="font-semibold mb-2">{t('about')}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {t('aboutText')}
        </p>
      </div>
    </div>
  );
}
