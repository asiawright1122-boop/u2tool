'use client';

import { useState, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';

// Simplified to Traditional mapping (common characters - deduplicated)
const s2tMap: Record<string, string> = {
  '国': '國', '学': '學', '发': '發', '会': '會', '为': '為', '这': '這',
  '来': '來', '时': '時', '个': '個', '们': '們', '说': '說', '对': '對',
  '出': '齣', '过': '過', '后': '後', '动': '動', '进': '進', '开': '開',
  '关': '關', '问': '問', '头': '頭', '长': '長', '东': '東', '车': '車',
  '见': '見', '书': '書', '电': '電', '话': '話', '马': '馬', '鸟': '鳥',
  '鱼': '魚', '龙': '龍', '风': '風', '云': '雲', '门': '門', '飞': '飛',
  '机': '機', '场': '場', '边': '邊', '远': '遠', '运': '運', '还': '還',
  '连': '連', '达': '達', '选': '選', '里': '裡', '面': '麵', '点': '點',
  '种': '種', '钟': '鐘', '钱': '錢', '银': '銀', '铁': '鐵', '锁': '鎖',
  '错': '錯', '镜': '鏡', '闻': '聞', '间': '間', '阳': '陽', '阴': '陰',
  '队': '隊', '难': '難', '页': '頁', '顺': '順', '须': '須', '领': '領',
  '题': '題', '饭': '飯', '馆': '館', '验': '驗', '麦': '麥', '黄': '黃',
  '齐': '齊', '龄': '齡', '龟': '龜', '亚': '亞', '产': '產', '亲': '親',
  '仅': '僅', '从': '從', '众': '眾', '优': '優', '传': '傳', '伤': '傷',
  '价': '價', '华': '華', '单': '單', '卖': '賣', '厂': '廠', '历': '歷',
  '县': '縣', '参': '參', '双': '雙', '变': '變', '号': '號', '台': '臺',
  '叶': '葉', '听': '聽', '员': '員', '园': '園', '图': '圖', '团': '團',
  '圣': '聖', '坏': '壞', '块': '塊', '声': '聲', '处': '處', '备': '備',
  '复': '復', '够': '夠', '夹': '夾', '奋': '奮', '妇': '婦', '妈': '媽',
  '婴': '嬰', '实': '實', '宝': '寶', '审': '審', '宪': '憲', '宫': '宮',
  '宽': '寬', '宾': '賓', '导': '導', '层': '層', '属': '屬', '岁': '歲',
  '岛': '島', '币': '幣', '师': '師', '带': '帶', '帮': '幫', '广': '廣',
  '庆': '慶', '应': '應', '废': '廢', '异': '異', '弯': '彎', '张': '張',
  '强': '強', '归': '歸', '当': '當', '录': '錄', '总': '總', '惊': '驚',
  '战': '戰', '户': '戶', '护': '護', '报': '報', '担': '擔', '拥': '擁',
  '择': '擇', '挂': '掛', '损': '損', '换': '換', '据': '據', '掷': '擲',
  '摄': '攝', '摆': '擺', '摇': '搖', '撑': '撐', '数': '數', '斗': '鬥',
  '断': '斷', '无': '無', '旧': '舊', '显': '顯', '晋': '晉', '晒': '曬',
  '暂': '暫', '术': '術', '杀': '殺', '杂': '雜', '权': '權', '条': '條',
  '极': '極', '构': '構', '标': '標', '样': '樣', '树': '樹', '桥': '橋',
  '档': '檔', '检': '檢', '业': '業', '楼': '樓', '乐': '樂', '横': '橫',
  '欢': '歡', '残': '殘', '殴': '毆', '毕': '畢', '气': '氣', '汇': '匯',
  '汉': '漢', '沟': '溝', '没': '沒', '沪': '滬', '济': '濟', '浅': '淺',
  '测': '測', '浏': '瀏', '浓': '濃', '涂': '塗', '涛': '濤', '润': '潤',
  '涨': '漲', '温': '溫', '湾': '灣', '满': '滿', '滚': '滾', '滩': '灘',
  '灯': '燈', '灵': '靈', '灾': '災', '热': '熱', '爱': '愛', '牺': '犧',
  '状': '狀', '独': '獨', '狮': '獅', '献': '獻', '环': '環', '现': '現',
  '玛': '瑪', '画': '畫', '畅': '暢', '疗': '療', '盖': '蓋', '监': '監',
  '盘': '盤', '盐': '鹽', '睁': '睜', '矿': '礦', '码': '碼', '础': '礎',
  '确': '確', '礼': '禮', '离': '離', '积': '積', '称': '稱', '税': '稅',
  '稳': '穩', '穷': '窮', '窃': '竊', '竞': '競', '笔': '筆', '签': '簽',
  '简': '簡', '类': '類', '粮': '糧', '纠': '糾', '红': '紅', '纪': '紀',
  '约': '約', '级': '級', '纯': '純', '纲': '綱', '纳': '納', '纵': '縱',
  '纷': '紛', '纸': '紙', '纹': '紋', '线': '線', '练': '練', '组': '組',
  '细': '細', '织': '織', '终': '終', '绍': '紹', '经': '經', '结': '結',
  '绕': '繞', '绘': '繪', '给': '給', '络': '絡', '绝': '絕', '统': '統',
  '继': '繼', '绩': '績', '绪': '緒', '续': '續', '维': '維', '绿': '綠'
};

// Create reverse mapping
const t2sMap: Record<string, string> = {};
Object.entries(s2tMap).forEach(([s, t]) => {
  t2sMap[t] = s;
});

function toTraditional(text: string): string {
  return text.split('').map(char => s2tMap[char] || char).join('');
}

function toSimplified(text: string): string {
  return text.split('').map(char => t2sMap[char] || char).join('');
}

export default function ChineseConverter() {
  const t = useTranslations('tools');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const convertToTraditional = () => {
    if (!input.trim()) { setOutput(''); return; }
    setOutput(toTraditional(input));
  };

  const convertToSimplified = () => {
    if (!input.trim()) { setOutput(''); return; }
    setOutput(toSimplified(input));
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
        <textarea className="tool-textarea" value={input} onChange={(e) => setInput(e.target.value)} placeholder={t('chinese.placeholder')} rows={6} />
      </div>
      <div className="flex flex-wrap gap-2">
        <button onClick={convertToTraditional} className="btn-primary">{t('chinese.toTraditional')}</button>
        <button onClick={convertToSimplified} className="btn-secondary">{t('chinese.toSimplified')}</button>
        <button onClick={() => { setInput(''); setOutput(''); }} className="btn-secondary">{t('clear')}</button>
      </div>
      {output && (
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium">{t('output')}</label>
            <button onClick={copyOutput} className={`text-sm px-3 py-1 rounded text-white ${copied ? 'bg-green-600' : 'bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600'}`}>
              {copied ? t('copied') : t('copy')}
            </button>
          </div>
          <textarea className="tool-textarea" value={output} readOnly rows={6} />
        </div>
      )}
    </div>
  );
}
