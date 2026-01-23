'use client';

import { useState, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';

// Basic pinyin mapping for common characters
const pinyinMap: Record<string, string> = {
  '啊': 'ā', '阿': 'ā', '爱': 'ài', '安': 'ān', '八': 'bā', '把': 'bǎ', '爸': 'bà',
  '白': 'bái', '百': 'bǎi', '班': 'bān', '半': 'bàn', '帮': 'bāng', '包': 'bāo',
  '北': 'běi', '被': 'bèi', '本': 'běn', '比': 'bǐ', '边': 'biān', '表': 'biǎo',
  '别': 'bié', '病': 'bìng', '不': 'bù', '才': 'cái', '菜': 'cài', '茶': 'chá',
  '长': 'cháng', '常': 'cháng', '场': 'chǎng', '唱': 'chàng', '车': 'chē', '城': 'chéng',
  '吃': 'chī', '出': 'chū', '穿': 'chuān', '船': 'chuán', '春': 'chūn', '词': 'cí',
  '次': 'cì', '从': 'cóng', '错': 'cuò', '打': 'dǎ', '大': 'dà', '带': 'dài',
  '但': 'dàn', '当': 'dāng', '到': 'dào', '道': 'dào', '的': 'de', '得': 'de',
  '等': 'děng', '地': 'dì', '弟': 'dì', '第': 'dì', '点': 'diǎn', '电': 'diàn',
  '店': 'diàn', '东': 'dōng', '冬': 'dōng', '懂': 'dǒng', '动': 'dòng', '都': 'dōu',
  '读': 'dú', '短': 'duǎn', '对': 'duì', '多': 'duō', '饿': 'è', '儿': 'ér',
  '二': 'èr', '发': 'fā', '法': 'fǎ', '饭': 'fàn', '方': 'fāng', '房': 'fáng',
  '放': 'fàng', '非': 'fēi', '飞': 'fēi', '分': 'fēn', '风': 'fēng', '服': 'fú',
  '父': 'fù', '该': 'gāi', '干': 'gàn', '感': 'gǎn', '刚': 'gāng', '高': 'gāo',
  '告': 'gào', '哥': 'gē', '歌': 'gē', '个': 'gè', '给': 'gěi', '跟': 'gēn',
  '更': 'gèng', '工': 'gōng', '公': 'gōng', '共': 'gòng', '狗': 'gǒu', '够': 'gòu',
  '古': 'gǔ', '故': 'gù', '瓜': 'guā', '关': 'guān', '馆': 'guǎn', '广': 'guǎng',
  '贵': 'guì', '国': 'guó', '果': 'guǒ', '过': 'guò', '还': 'hái', '孩': 'hái',
  '海': 'hǎi', '汉': 'hàn', '好': 'hǎo', '号': 'hào', '喝': 'hē', '和': 'hé',
  '河': 'hé', '黑': 'hēi', '很': 'hěn', '红': 'hóng', '后': 'hòu', '花': 'huā',
  '话': 'huà', '画': 'huà', '坏': 'huài', '欢': 'huān', '黄': 'huáng',
  '回': 'huí', '会': 'huì', '火': 'huǒ', '或': 'huò', '机': 'jī', '鸡': 'jī',
  '几': 'jǐ', '己': 'jǐ', '记': 'jì', '家': 'jiā', '间': 'jiān', '见': 'jiàn',
  '件': 'jiàn', '江': 'jiāng', '讲': 'jiǎng', '教': 'jiāo', '叫': 'jiào', '接': 'jiē',
  '街': 'jiē', '姐': 'jiě', '介': 'jiè', '今': 'jīn', '金': 'jīn', '进': 'jìn',
  '近': 'jìn', '京': 'jīng', '经': 'jīng', '九': 'jiǔ', '酒': 'jiǔ', '久': 'jiǔ',
  '就': 'jiù', '旧': 'jiù', '觉': 'jué', '开': 'kāi', '看': 'kàn', '考': 'kǎo',
  '可': 'kě', '课': 'kè', '客': 'kè', '空': 'kōng', '口': 'kǒu', '哭': 'kū',
  '快': 'kuài', '块': 'kuài', '来': 'lái', '蓝': 'lán', '老': 'lǎo', '了': 'le',
  '累': 'lèi', '冷': 'lěng', '离': 'lí', '里': 'lǐ', '理': 'lǐ', '力': 'lì',
  '历': 'lì', '两': 'liǎng', '亮': 'liàng', '零': 'líng', '六': 'liù', '龙': 'lóng',
  '楼': 'lóu', '路': 'lù', '绿': 'lǜ', '妈': 'mā', '马': 'mǎ', '吗': 'ma',
  '买': 'mǎi', '卖': 'mài', '慢': 'màn', '忙': 'máng', '猫': 'māo', '没': 'méi',
  '每': 'měi', '美': 'měi', '妹': 'mèi', '门': 'mén', '们': 'men', '米': 'mǐ',
  '面': 'miàn', '民': 'mín', '明': 'míng', '名': 'míng', '母': 'mǔ', '木': 'mù',
  '目': 'mù', '拿': 'ná', '哪': 'nǎ', '那': 'nà', '男': 'nán', '南': 'nán',
  '难': 'nán', '呢': 'ne', '能': 'néng', '你': 'nǐ', '年': 'nián', '念': 'niàn',
  '鸟': 'niǎo', '您': 'nín', '牛': 'niú', '女': 'nǚ', '怕': 'pà', '旁': 'páng',
  '跑': 'pǎo', '朋': 'péng', '皮': 'pí', '片': 'piàn', '票': 'piào', '漂': 'piào',
  '平': 'píng', '苹': 'píng', '七': 'qī', '期': 'qī', '骑': 'qí', '起': 'qǐ',
  '气': 'qì', '汽': 'qì', '千': 'qiān', '前': 'qián', '钱': 'qián', '亲': 'qīn',
  '青': 'qīng', '清': 'qīng', '请': 'qǐng', '秋': 'qiū', '球': 'qiú', '去': 'qù',
  '全': 'quán', '然': 'rán', '让': 'ràng', '热': 'rè', '人': 'rén', '认': 'rèn',
  '日': 'rì', '肉': 'ròu', '如': 'rú', '三': 'sān', '色': 'sè', '山': 'shān',
  '上': 'shàng', '少': 'shǎo', '谁': 'shéi', '身': 'shēn', '什': 'shén', '生': 'shēng',
  '声': 'shēng', '师': 'shī', '十': 'shí', '时': 'shí', '识': 'shí', '实': 'shí',
  '食': 'shí', '史': 'shǐ', '使': 'shǐ', '始': 'shǐ', '是': 'shì', '事': 'shì',
  '市': 'shì', '室': 'shì', '试': 'shì', '视': 'shì', '手': 'shǒu', '书': 'shū',
  '树': 'shù', '数': 'shù', '双': 'shuāng', '水': 'shuǐ', '睡': 'shuì', '说': 'shuō',
  '思': 'sī', '四': 'sì', '送': 'sòng', '虽': 'suī', '岁': 'suì', '所': 'suǒ',
  '他': 'tā', '她': 'tā', '它': 'tā', '太': 'tài', '谈': 'tán', '特': 'tè',
  '题': 'tí', '体': 'tǐ', '天': 'tiān', '条': 'tiáo', '听': 'tīng', '同': 'tóng',
  '头': 'tóu', '图': 'tú', '外': 'wài', '完': 'wán', '玩': 'wán', '晚': 'wǎn',
  '万': 'wàn', '王': 'wáng', '网': 'wǎng', '往': 'wǎng', '忘': 'wàng', '为': 'wèi',
  '位': 'wèi', '文': 'wén', '问': 'wèn', '我': 'wǒ', '五': 'wǔ', '午': 'wǔ',
  '西': 'xī', '希': 'xī', '习': 'xí', '洗': 'xǐ', '喜': 'xǐ', '系': 'xì',
  '下': 'xià', '夏': 'xià', '先': 'xiān', '现': 'xiàn', '想': 'xiǎng', '向': 'xiàng',
  '像': 'xiàng', '小': 'xiǎo', '笑': 'xiào', '校': 'xiào', '些': 'xiē', '写': 'xiě',
  '谢': 'xiè', '新': 'xīn', '心': 'xīn', '信': 'xìn', '星': 'xīng', '行': 'xíng',
  '姓': 'xìng', '兴': 'xìng', '休': 'xiū', '学': 'xué', '雪': 'xuě', '呀': 'ya',
  '眼': 'yǎn', '样': 'yàng', '要': 'yào', '药': 'yào', '也': 'yě', '夜': 'yè',
  '一': 'yī', '衣': 'yī', '医': 'yī', '以': 'yǐ', '已': 'yǐ', '意': 'yì',
  '因': 'yīn', '音': 'yīn', '应': 'yīng', '英': 'yīng', '影': 'yǐng', '用': 'yòng',
  '友': 'yǒu', '有': 'yǒu', '又': 'yòu', '右': 'yòu', '鱼': 'yú', '雨': 'yǔ',
  '语': 'yǔ', '元': 'yuán', '园': 'yuán', '远': 'yuǎn', '院': 'yuàn', '月': 'yuè',
  '越': 'yuè', '云': 'yún', '运': 'yùn', '在': 'zài', '再': 'zài', '早': 'zǎo',
  '怎': 'zěn', '站': 'zhàn', '张': 'zhāng', '找': 'zhǎo', '着': 'zhe',
  '这': 'zhè', '真': 'zhēn', '正': 'zhèng', '知': 'zhī', '只': 'zhǐ', '纸': 'zhǐ',
  '中': 'zhōng', '钟': 'zhōng', '种': 'zhǒng', '重': 'zhòng', '周': 'zhōu', '主': 'zhǔ',
  '住': 'zhù', '祝': 'zhù', '准': 'zhǔn', '子': 'zǐ', '字': 'zì', '自': 'zì',
  '走': 'zǒu', '最': 'zuì', '昨': 'zuó', '左': 'zuǒ', '作': 'zuò', '做': 'zuò',
  '坐': 'zuò', '世': 'shì', '界': 'jiè'
};

function toPinyin(text: string, withTone: boolean = true): string {
  const result: string[] = [];
  
  for (const char of text) {
    if (pinyinMap[char]) {
      let pinyin = pinyinMap[char];
      if (!withTone) {
        pinyin = pinyin
          .replace(/[āáǎà]/g, 'a')
          .replace(/[ēéěè]/g, 'e')
          .replace(/[īíǐì]/g, 'i')
          .replace(/[ōóǒò]/g, 'o')
          .replace(/[ūúǔù]/g, 'u')
          .replace(/[ǖǘǚǜ]/g, 'v');
      }
      result.push(pinyin);
    } else if (/[\u4e00-\u9fa5]/.test(char)) {
      result.push(char); // Unknown Chinese character
    } else {
      result.push(char);
    }
  }
  
  return result.join(' ').replace(/\s+/g, ' ').trim();
}

export default function PinyinConverter() {
  const t = useTranslations('tools');
  const [input, setInput] = useState('');
  const [withTone, setWithTone] = useState(true);
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const convert = () => {
    if (!input.trim()) {
      setOutput('');
      return;
    }
    setOutput(toPinyin(input, withTone));
  };

  const copyOutput = async () => {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {

    return () => {

      if (timerRef.current) clearTimeout(timerRef.current);

    };

  }, []);


  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">{t('input')}</label>
        <textarea
          className="tool-textarea"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t('pinyin.placeholder')}
          rows={4}
        />
      </div>

      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={withTone}
            onChange={(e) => setWithTone(e.target.checked)}
            className="w-4 h-4 rounded"
          />
          <span className="text-sm">{t('pinyin.withTone')}</span>
        </label>
      </div>

      <div className="flex flex-wrap gap-2">
        <button onClick={convert} className="btn-primary">
          {t('convert')}
        </button>
        <button onClick={() => { setInput(''); setOutput(''); }} className="btn-secondary">
          {t('clear')}
        </button>
      </div>

      {output && (
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium">{t('output')}</label>
            <button
              onClick={copyOutput}
              className={`text-sm px-3 py-1 rounded text-white ${copied ? 'bg-green-600' : 'bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600'}`}
            >
              {copied ? t('copied') : t('copy')}
            </button>
          </div>
          <textarea
            className="tool-textarea"
            value={output}
            readOnly
            rows={4}
          />
        </div>
      )}

      <div className="text-xs text-gray-600 dark:text-gray-300">
        {t('pinyin.note')}
      </div>
    </div>
  );
}
