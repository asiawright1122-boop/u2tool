'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import ReactECharts from 'echarts-for-react';
import type { EChartsOption } from 'echarts';
import 'echarts-wordcloud';

// 颜色主题预设
const colorThemes = {
  default: ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4'],
  ocean: ['#0077b6', '#00b4d8', '#90e0ef', '#48cae4', '#023e8a', '#0096c7'],
  sunset: ['#ff6b6b', '#feca57', '#ff9ff3', '#54a0ff', '#5f27cd', '#00d2d3'],
  rainbow: ['#e74c3c', '#e67e22', '#f1c40f', '#2ecc71', '#3498db', '#9b59b6'],
};

interface WordItem {
  name: string;
  value: number;
}

export default function WordCloudGenerator() {
  const t = useTranslations('tools.wordcloud-generator');
  const tg = useTranslations('tools');

  // 初始化状态
  const [isInitialized, setIsInitialized] = useState(false);

  // 图表配置 - 使用空字符串初始化，在 useEffect 中设置翻译值
  const [chartTitle, setChartTitle] = useState('');
  const [colorTheme, setColorTheme] = useState<keyof typeof colorThemes>('default');

  // 初始化翻译值（只在组件挂载时执行一次）
  useEffect(() => {
    if (!isInitialized) {
      setChartTitle(t('defaultTitle'));
      setIsInitialized(true);
    }
  }, [t, isInitialized]);
  const [shape, setShape] = useState<'circle' | 'cardioid' | 'diamond' | 'triangle' | 'star'>('circle');
  const [minFontSize, setMinFontSize] = useState(12);
  const [maxFontSize, setMaxFontSize] = useState(60);
  const [rotationRange, setRotationRange] = useState(45);

  // 文本输入
  const [textInput, setTextInput] = useState('');
  const [words, setWords] = useState<WordItem[]>([
    { name: 'JavaScript', value: 100 },
    { name: 'React', value: 90 },
    { name: 'TypeScript', value: 85 },
    { name: 'Node.js', value: 80 },
    { name: 'Python', value: 75 },
    { name: 'CSS', value: 70 },
    { name: 'HTML', value: 65 },
    { name: 'Vue', value: 60 },
    { name: 'Angular', value: 55 },
    { name: 'Next.js', value: 50 },
  ]);

  const chartRef = useRef<ReactECharts>(null);

  // 从文本生成词频
  const generateFromText = useCallback(() => {
    if (!textInput.trim()) return;
    
    // 简单的词频统计
    const wordMap = new Map<string, number>();
    const words = textInput
      .toLowerCase()
      .replace(/[^\w\s\u4e00-\u9fa5]/g, ' ')
      .split(/\s+/)
      .filter(w => w.length > 1);
    
    words.forEach(word => {
      wordMap.set(word, (wordMap.get(word) || 0) + 1);
    });
    
    // 转换为数组并排序
    const wordArray = Array.from(wordMap.entries())
      .map(([name, value]) => ({ name, value: value * 10 }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 100); // 最多100个词
    
    if (wordArray.length > 0) {
      setWords(wordArray);
    }
  }, [textInput]);

  // 生成 ECharts 配置
  const getChartOption = useCallback((): EChartsOption => {
    const colors = colorThemes[colorTheme];

    return {
      backgroundColor: '#1f2937',
      title: {
        text: chartTitle,
        left: 'center',
        top: 10,
        textStyle: { fontSize: 16, fontWeight: 'bold', color: '#fff' },
      },
      tooltip: {
        show: true,
        backgroundColor: 'rgba(31, 41, 55, 0.9)',
        borderColor: '#374151',
        textStyle: { color: '#e5e7eb' },
      },
      series: [
        {
          type: 'wordCloud',
          shape: shape,
          left: 'center',
          top: 'center',
          width: '90%',
          height: '80%',
          right: undefined,
          bottom: undefined,
          sizeRange: [minFontSize, maxFontSize],
          rotationRange: [-rotationRange, rotationRange],
          rotationStep: 15,
          gridSize: 8,
          drawOutOfBound: false,
          layoutAnimation: true,
          textStyle: {
            fontFamily: 'sans-serif',
            fontWeight: 'bold',
            color: () => colors[Math.floor(Math.random() * colors.length)],
          },
          emphasis: {
            focus: 'self',
            textStyle: {
              textShadowBlur: 10,
              textShadowColor: '#333',
            },
          },
          data: words,
        },
      ],
    };
  }, [chartTitle, colorTheme, shape, minFontSize, maxFontSize, rotationRange, words]);

  // 导出图表
  const exportChart = (format: 'png' | 'svg') => {
    if (chartRef.current) {
      const echartInstance = chartRef.current.getEchartsInstance();
      const url = echartInstance.getDataURL({
        type: format === 'svg' ? 'svg' : 'png',
        pixelRatio: 2,
        backgroundColor: '#1f2937',
      });
      const link = document.createElement('a');
      link.download = `wordcloud-${Date.now()}.${format}`;
      link.href = url;
      link.click();
    }
  };

  // 更新词项
  const updateWordItem = (index: number, field: 'name' | 'value', value: string | number) => {
    const newWords = [...words];
    if (field === 'name') {
      newWords[index].name = value as string;
    } else {
      newWords[index].value = Number(value) || 0;
    }
    setWords(newWords);
  };

  // 添加词项
  const addWordItem = () => {
    setWords([...words, { name: `${t('word')} ${words.length + 1}`, value: 50 }]);
  };

  // 删除词项
  const removeWordItem = (index: number) => {
    if (words.length > 1) {
      setWords(words.filter((_, i) => i !== index));
    }
  };

  // 加载示例数据
  const loadSampleData = () => {
    setWords([
      { name: 'Innovation', value: 100 },
      { name: 'Technology', value: 95 },
      { name: 'Design', value: 90 },
      { name: 'Development', value: 85 },
      { name: 'Creativity', value: 80 },
      { name: 'Solution', value: 75 },
      { name: 'Efficiency', value: 70 },
      { name: 'Quality', value: 65 },
      { name: 'Teamwork', value: 60 },
      { name: 'Growth', value: 55 },
      { name: 'Success', value: 50 },
      { name: 'Future', value: 45 },
    ]);
    setChartTitle(t('sampleTitle'));
  };

  // 清空数据
  const clearData = () => {
    if (confirm(t('confirmClear'))) {
      setWords([{ name: `${t('word')} 1`, value: 100 }]);
      setTextInput('');
      setChartTitle(t('defaultTitle'));
    }
  };

  return (
    <div className="space-y-4">
      {/* 工具栏 */}
      <div className="flex flex-wrap gap-2">
        <button onClick={loadSampleData} className="btn-primary">
          📊 {t('loadSample')}
        </button>
        <button onClick={() => exportChart('png')} className="btn-secondary">
          📥 {t('downloadPng')}
        </button>
        <button onClick={() => exportChart('svg')} className="btn-secondary">
          📥 {t('downloadSvg')}
        </button>
        <button onClick={clearData} className="btn-secondary">
          🗑️ {tg('clear')}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 左侧：数据编辑器 */}
        <div className="space-y-4">
          {/* 图表设置 */}
          <div>
            <label className="block text-sm font-medium mb-2">{t('chartSettings')}</label>
            <div className="space-y-3 p-4 bg-gray-900 border border-gray-700 rounded-lg">
              <div>
                <label className="block text-sm font-medium mb-1">{t('chartTitle')}</label>
                <input
                  type="text"
                  value={chartTitle}
                  onChange={(e) => setChartTitle(e.target.value)}
                  className="tool-input"
                  placeholder={t('chartTitlePlaceholder')}
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm font-medium mb-1">{t('colorTheme')}</label>
                  <select
                    value={colorTheme}
                    onChange={(e) => setColorTheme(e.target.value as keyof typeof colorThemes)}
                    className="tool-input"
                  >
                    <option value="default">{t('themeDefault')}</option>
                    <option value="ocean">{t('themeOcean')}</option>
                    <option value="sunset">{t('themeSunset')}</option>
                    <option value="rainbow">{t('themeRainbow')}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">{t('shape')}</label>
                  <select
                    value={shape}
                    onChange={(e) => setShape(e.target.value as typeof shape)}
                    className="tool-input"
                  >
                    <option value="circle">{t('shapeCircle')}</option>
                    <option value="cardioid">{t('shapeCardioid')}</option>
                    <option value="diamond">{t('shapeDiamond')}</option>
                    <option value="triangle">{t('shapeTriangle')}</option>
                    <option value="star">{t('shapeStar')}</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-sm font-medium mb-1">{t('minFontSize')}: {minFontSize}</label>
                  <input
                    type="range"
                    min={8}
                    max={30}
                    value={minFontSize}
                    onChange={(e) => setMinFontSize(Number(e.target.value))}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">{t('maxFontSize')}: {maxFontSize}</label>
                  <input
                    type="range"
                    min={40}
                    max={100}
                    value={maxFontSize}
                    onChange={(e) => setMaxFontSize(Number(e.target.value))}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">{t('rotation')}: ±{rotationRange}°</label>
                  <input
                    type="range"
                    min={0}
                    max={90}
                    value={rotationRange}
                    onChange={(e) => setRotationRange(Number(e.target.value))}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 文本输入 */}
          <div>
            <label className="block text-sm font-medium mb-2">{t('textInput')}</label>
            <div className="space-y-2">
              <textarea
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                className="tool-input h-24"
                placeholder={t('textInputPlaceholder')}
              />
              <button onClick={generateFromText} className="btn-secondary btn-sm w-full">
                {t('generateFromText')}
              </button>
            </div>
          </div>

          {/* 词项编辑 */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium">{t('dataEditor')}</label>
              <button onClick={addWordItem} className="btn-secondary btn-sm">
                + {t('addWord')}
              </button>
            </div>
            <div className="space-y-2 max-h-48 overflow-y-auto p-2 bg-gray-900 border border-gray-700 rounded-lg">
              {words.map((word, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={word.name}
                    onChange={(e) => updateWordItem(index, 'name', e.target.value)}
                    className="tool-input flex-1 min-w-[120px]"
                    placeholder={t('word')}
                  />
                  <input
                    type="number"
                    value={word.value}
                    onChange={(e) => updateWordItem(index, 'value', e.target.value)}
                    className="tool-input w-24"
                    placeholder={t('weight')}
                  />
                  <button
                    onClick={() => removeWordItem(index)}
                    className="btn-secondary btn-sm text-red-400 hover:text-red-300"
                    disabled={words.length <= 1}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 右侧：图表预览 */}
        <div>
          <label className="block text-sm font-medium mb-2">{t('chartPreview')}</label>
          <div className="rounded-lg border border-gray-700 overflow-hidden" style={{ minHeight: '400px' }}>
            <ReactECharts
              ref={chartRef}
              option={getChartOption()}
              style={{ height: '400px', width: '100%' }}
              notMerge={true}
            />
          </div>
        </div>
      </div>

      {/* 使用说明 */}
      <div className="p-3 bg-blue-900/30 border border-blue-700 rounded-lg text-sm text-blue-300">
        <p className="font-medium mb-1">💡 {t('tips.title')}</p>
        <ul className="space-y-0.5 text-blue-400">
          <li>• {t('tips.tip1')}</li>
          <li>• {t('tips.tip2')}</li>
          <li>• {t('tips.tip3')}</li>
          <li>• {t('tips.tip4')}</li>
        </ul>
      </div>
    </div>
  );
}
