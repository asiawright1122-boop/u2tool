<script lang="ts">
  import { onDestroy } from 'svelte';

  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.${key}`;
  }

  let input = $state('');

  let output = $state('');

  let copied = $state(false);

  let timerRef = $state(null);  onDestroy(() => {
    if (timerRef) clearTimeout(timerRef);
  });

  const simplifiedToTraditional: Record<string, string> = {
    '汉': '漢', '语': '語', '学': '學', '习': '習', '国': '國', '爱': '愛', '车': '車',
    '门': '門', '风': '風', '电': '電', '话': '話', '书': '書', '见': '見', '后': '後',
    '发': '發', '东': '東', '长': '長', '乐': '樂', '为': '為', '个': '個', '会': '會',
    '来': '來', '时': '時', '间': '間', '过': '過', '这': '這', '还': '還', '里': '裡',
    '对': '對', '开': '開', '关': '關', '网': '網', '页': '頁', '体': '體', '万': '萬',
    '与': '與', '业': '業', '专': '專', '产': '產', '众': '眾', '优': '優', '传': '傳',
    '伤': '傷', '伦': '倫', '伪': '偽', '伟': '偉', '侧': '側', '备': '備',
    '价': '價', '参': '參', '变': '變', '号': '號', '叶': '葉', '合': '合', '听': '聽',
    '启': '啟', '员': '員', '块': '塊', '报': '報', '场': '場', '声': '聲', '处': '處',
    '头': '頭', '夹': '夾', '导': '導', '层': '層', '岁': '歲', '岛': '島',
    '广': '廣', '应': '應', '库': '庫', '录': '錄', '当': '當', '复': '復', '态': '態',
    '总': '總', '数': '數', '据': '據', '无': '無', '旧': '舊', '显': '顯', '术': '術',
    '机': '機', '权': '權', '条': '條', '构': '構', '标': '標', '样': '樣', '档': '檔',
    '测': '測', '湾': '灣', '满': '滿', '点': '點', '热': '熱', '现': '現', '画': '畫',
    '监': '監', '码': '碼', '确': '確', '离': '離', '种': '種', '称': '稱', '简': '簡',
    '级': '級', '线': '線', '经': '經', '统': '統', '维': '維', '编': '編',
    '节': '節', '获': '獲', '览': '覽', '设': '設', '证': '證', '试': '試', '误': '誤',
    '请': '請', '读': '讀', '调': '調', '质': '質', '输': '輸', '达': '達', '进': '進',
    '连': '連', '选': '選', '逻': '邏', '邮': '郵', '针': '針', '错': '錯', '键': '鍵',
    '链': '鏈', '阅': '閱', '队': '隊', '际': '際', '难': '難', '题': '題',
    '颜': '顏', '类': '類', '验': '驗',
  };

  const traditionalToSimplified: Record<string, string> = Object.fromEntries(
    Object.entries(simplifiedToTraditional).map(([simplified, traditional]) => [traditional, simplified]),
  );

  function convertCharacters(value: string, map: Record<string, string>): string {
    return Array.from(value).map((character) => map[character] || character).join('');
  }

  // Functions
  function convertToTraditional() {
    if (!input.trim()) { output = ''; return; }
    output = convertCharacters(input, simplifiedToTraditional);
  }
  function convertToSimplified() {
    if (!input.trim()) { output = ''; return; }
    output = convertCharacters(input, traditionalToSimplified);
  }
  async function copyOutput() {
    await navigator.clipboard.writeText(output);
    copied = true;
    if (timerRef) clearTimeout(timerRef);
    timerRef = setTimeout(() => copied = false, 2000);
  }

</script>


    <div class="space-y-4">
      <div>
        <label for="chinese-input" class="block text-sm font-medium mb-2">{t('input')}</label>
        <textarea id="chinese-input" name="inputValue" class="tool-textarea" bind:value={input} placeholder={t('chinese.placeholder')} rows={6}></textarea>
      </div>
      <div class="flex flex-wrap gap-2">
        <button onclick={convertToTraditional} class="btn-primary">{t('chinese.toTraditional')}</button>
        <button onclick={convertToSimplified} class="btn-secondary">{t('chinese.toSimplified')}</button>
        <button onclick={() => { input = ''; output = ''; }} class="btn-secondary">{t('clear')}</button>
      </div>
      {#if output}
<div>
          <div class="flex justify-between items-center mb-2">
            <label for="chinese-output" class="text-sm font-medium">{t('output')}</label>
            <button onclick={copyOutput} class={`text-sm px-3 py-1 rounded text-white ${copied ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600'}`}>
              {copied ? t('copied') : t('copy')}
            </button>
          </div>
          <textarea id="chinese-output" name="outputValue" class="tool-textarea" value={output} readOnly rows={6}></textarea>
        </div>
{/if}
    </div>
  
