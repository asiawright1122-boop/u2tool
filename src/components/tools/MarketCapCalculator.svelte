<script lang="ts">
  import {
    calculateMarketCap,
    classifyMarketCap,
  } from '../../lib/market-cap-helper';

  interface Props {
    locale?: string;
    translations?: Record<string, unknown>;
  }

  let { locale = 'en', translations = {} }: Props = $props();

  const I18N_BACKUP: Record<string, Record<string, string>> = {
    zh: {
      title: '市值计算器',
      subtitle: '计算公司市值、市值等级划分，并基于市盈率进行净利润与估值反推',
      sharePrice: '股票价格',
      outstandingShares: '已发行股数',
      peRatio: '市盈率 (P/E Ratio - 可选)',
      marketCap: '公司市值 (Market Cap)',
      classification: '市值等级划分',
      netIncome: '推算年净利润',
      mega: '超大型企业 (Mega Cap)',
      large: '大型企业 (Large Cap)',
      mid: '中型企业 (Mid Cap)',
      small: '小型企业 (Small Cap)',
      micro: '微型企业 (Micro Cap)',
      currency: '货币',
      copied: '✓ 已复制!',
      copyResult: '复制结果',
      formula: '计算公式',
      formulaText: '市值 = 股票价格 × 已发行股数',
      disclaimer: '仅供参考，不构成任何投资建议。',
      placeholderText: '请输入股票价格和已发行股数以计算公司市值。',
    },
    en: {
      title: 'Market Cap Calculator',
      subtitle: 'Calculate market capitalization, company size classification, and net income via P/E',
      sharePrice: 'Share Price',
      outstandingShares: 'Outstanding Shares',
      peRatio: 'P/E Ratio (Optional)',
      marketCap: 'Market Capitalization',
      classification: 'Company Size',
      netIncome: 'Implied Net Income',
      mega: 'Mega Cap',
      large: 'Large Cap',
      mid: 'Mid Cap',
      small: 'Small Cap',
      micro: 'Micro Cap',
      currency: 'Currency',
      copied: '✓ Copied!',
      copyResult: 'Copy Result',
      formula: 'Formula',
      formulaText: 'Market Cap = Share Price × Outstanding Shares',
      disclaimer: 'For informational purposes only. Not financial advice.',
      placeholderText: 'Enter share price and outstanding shares to calculate market cap',
    },
    es: {
      title: 'Calculadora de Capitalización de Mercado',
      subtitle: 'Calcule la capitalización de mercado, la clasificación de tamaño y los ingresos implícitos',
      sharePrice: 'Precio de la Acción',
      outstandingShares: 'Acciones en Circulación',
      peRatio: 'Relación P/E (Opcional)',
      marketCap: 'Capitalización de Mercado',
      classification: 'Clasificación de Tamaño',
      netIncome: 'Ingreso Neto Implícito',
      mega: 'Mega Cap',
      large: 'Large Cap',
      mid: 'Mid Cap',
      small: 'Small Cap',
      micro: 'Micro Cap',
      currency: 'Moneda',
      copied: '¡Copiado!',
      copyResult: 'Copiar Resultado',
      formula: 'Fórmula',
      formulaText: 'Capitalización = Precio de Acción × Acciones en Circulación',
      disclaimer: 'Solo para fines informativos. No es asesoramiento financiero.',
      placeholderText: 'Ingrese el precio y las acciones en circulación para calcular la capitalización',
    },
    pt: {
      title: 'Calculadora de Capitalização de Mercado',
      subtitle: 'Calcule o valor de mercado da empresa, a classificação do tamanho e o lucro presumido',
      sharePrice: 'Preço da Ação',
      outstandingShares: 'Ações em Circulação',
      peRatio: 'Relação P/L (Opcional)',
      marketCap: 'Capitalização de Mercado',
      classification: 'Tamanho da Empresa',
      netIncome: 'Lucro Líquido Implícito',
      mega: 'Mega Cap',
      large: 'Large Cap',
      mid: 'Mid Cap',
      small: 'Small Cap',
      micro: 'Micro Cap',
      currency: 'Moeda',
      copied: 'Copiado!',
      copyResult: 'Copiar Resultado',
      formula: 'Fórmula',
      formulaText: 'Valor de Mercado = Preço da Ação × Ações em Circulação',
      disclaimer: 'Apenas para fins informativos. Não é conselho financeiro.',
      placeholderText: 'Insira o preço e as ações em circulação para calcular o valor de mercado',
    },
    ja: {
      title: '時価総額計算シミュレーター',
      subtitle: '企業の時価総額、企業規模分類、およびPERに基づく純利益の逆算を行います',
      sharePrice: '株価',
      outstandingShares: '発行済株式数',
      peRatio: '株価収益率 (PER - 任意)',
      marketCap: '時価総額 (Market Cap)',
      classification: '企業規模分類',
      netIncome: '推算純利益',
      mega: 'メガキャップ (超大型株)',
      large: 'ラージキャップ (大型株)',
      mid: 'ミッドキャップ (中型株)',
      small: 'スモールキャップ (小型株)',
      micro: 'マイクロキャップ (極小型株)',
      currency: '通貨',
      copied: 'コピーしました！',
      copyResult: '結果をコピー',
      formula: '計算式',
      formulaText: '時価総額 = 株価 × 发行済株式数',
      disclaimer: '情報提供のみを目的としています。投資勧誘ではありません。',
      placeholderText: '株価と発行済株式数を入力して、時価総額を計算します',
    },
    fr: {
      title: 'Calculateur de Capitalisation Boursière',
      subtitle: 'Calculez la capitalisation boursière, la classification de taille et le résultat net via P/E',
      sharePrice: 'Prix de l\'Action',
      outstandingShares: 'Actions en Circulation',
      peRatio: 'Ratio P/E (Optionnel)',
      marketCap: 'Capitalisation Boursière',
      classification: 'Taille de l\'Entreprise',
      netIncome: 'Bénéfice Net Impliqué',
      mega: 'Mega Cap',
      large: 'Large Cap',
      mid: 'Mid Cap',
      small: 'Small Cap',
      micro: 'Micro Cap',
      currency: 'Devise',
      copied: 'Copié !',
      copyResult: 'Copiar le Résultat',
      formula: 'Formule',
      formulaText: 'Capitalisation = Prix de l\'Action × Actions en Circulation',
      disclaimer: 'À titre informatif uniquement. Pas de conseil financier.',
      placeholderText: 'Saisissez le prix et les actions en circulation pour calculer la capitalisation',
    },
    de: {
      title: 'Marktkapitalisierungs-Rechner',
      subtitle: 'Berechnen Sie den Börsenwert, die Größenklassifizierung und den implizierten Reingewinn',
      sharePrice: 'Aktienpreis',
      outstandingShares: 'Ausstehende Aktien',
      peRatio: 'KGV (Optional)',
      marketCap: 'Marktkapitalisierung',
      classification: 'Unternehmensgröße',
      netIncome: 'Implizierter Reingewinn',
      mega: 'Mega Cap',
      large: 'Large Cap',
      mid: 'Mid Cap',
      small: 'Small Cap',
      micro: 'Micro Cap',
      currency: 'Währung',
      copied: 'Kopiert!',
      copyResult: 'Ergebnis kopieren',
      formula: 'Formel',
      formulaText: 'Marktkapitalisierung = Aktienpreis × Ausstehende Aktien',
      disclaimer: 'Nur zu Informationszwecken. Keine Finanzberatung.',
      placeholderText: 'Geben Sie Aktienpreis und ausstehende Aktien ein, um den Börsenwert zu berechnen',
    },
    ar: {
      title: 'حاسبة القيمة السوقية',
      subtitle: 'احسب القيمة السوقية للشركة، وتصنيف حجمها، وصافي الدخل الضمني عبر مكرر الأرباح',
      sharePrice: 'سعر السهم',
      outstandingShares: 'الأسهم المصدرة',
      peRatio: 'مكرر الأرباح P/E (اختياري)',
      marketCap: 'القيمة السوقية (Market Cap)',
      classification: 'حجم الشركة',
      netIncome: 'صافي الدخل الضمني',
      mega: 'شركة عملاقة (Mega Cap)',
      large: 'شركة كبيرة (Large Cap)',
      mid: 'شركة متوسطة (Mid Cap)',
      small: 'شركة صغيرة (Small Cap)',
      micro: 'شركة متناهية الصغر (Micro Cap)',
      currency: 'العملة',
      copied: 'تم النسخ!',
      copyResult: 'نسخ النتيجة',
      formula: 'المعادلة',
      formulaText: 'القيمة السوقية = سعر السهم × عدد الأسهم المصدرة',
      disclaimer: 'لأغراض إعلامية فقط. لا يعتبر نصيحة مالية.',
      placeholderText: 'أدخل سعر السهم وعدد الأسهم لتوزيع القيمة السوقية',
    },
    ko: {
      title: '시가총액 계산기',
      subtitle: '기업의 시가총액과 기업 규모 분류를 계산하고, PER을 활용해 예상 순이익을 추산합니다',
      sharePrice: '주식 가격',
      outstandingShares: '발행 주식 수',
      peRatio: '주가수익비율 (PER - 선택)',
      marketCap: '시가총액 (Market Cap)',
      classification: '기업 규모 분류',
      netIncome: '추산 연간 순이익',
      mega: '메가캡 (초대형주)',
      large: '라지캡 (대형주)',
      mid: '미드캡 (중형주)',
      small: '스몰캡 (소형주)',
      micro: '마이크로캡 (초소형주)',
      currency: '화폐',
      copied: '복사 완료!',
      copyResult: '결과 복사',
      formula: '수식',
      formulaText: '시가총액 = 주식 가격 × 발행 주식 수',
      disclaimer: '단순 참고용입니다. 투자 권유가 아닙니다.',
      placeholderText: '주식 가격과 발행 주식 수를 입력하여 시가총액을 계산하세요',
    },
    ru: {
      title: 'Калькулятор рыночной капитализации',
      subtitle: 'Расчет рыночной стоимости компании, классификация масштаба бизнеса и чистой прибыли',
      sharePrice: 'Цена акции',
      outstandingShares: 'Акции в обращении',
      peRatio: 'Коэффициент P/E (опционально)',
      marketCap: 'Рыночная капитализация',
      classification: 'Размер компании',
      netIncome: 'Подразумеваемая чистая прибыль',
      mega: 'Мега-капитализация',
      large: 'Крупная капитализация',
      mid: 'Средняя капитализация',
      small: 'Малая капитализация',
      micro: 'Микро-капитализация',
      currency: 'Валюта',
      copied: 'Скопировано!',
      copyResult: 'Скопировать результат',
      formula: 'Формула',
      formulaText: 'Капитализация = Цена акции × Акции в обращении',
      disclaimer: 'Только для ознакомления. Не является финансовой рекомендацией.',
      placeholderText: 'Введите цену акции и количество акций для расчета капитализации',
    },
  };

  const l = $derived(I18N_BACKUP[locale] || I18N_BACKUP['en']);

  let sharePrice = $state('150');
  let outstandingShares = $state('100000000'); // 100M shares
  let peRatio = $state('');
  let currency = $state('USD');

  const symbols: Record<string, string> = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    JPY: '¥',
    CNY: '¥',
    CAD: 'CA$',
    AUD: 'A$',
    CHF: 'CHF',
  };

  const result = $derived((() => {
    const sp = parseFloat(sharePrice) || 0;
    const os = parseFloat(outstandingShares) || 0;
    const pe = peRatio !== '' ? (parseFloat(peRatio) || 0) : undefined;

    if (sp <= 0 || os <= 0) return null;

    const res = calculateMarketCap({
      sharePrice: sp,
      outstandingShares: os,
      peRatio: pe,
    });

    return {
      ...res,
      sp,
      os,
      pe,
    };
  })());

  const sym = $derived(symbols[currency] ?? currency);

  function formatNumber(v: number) {
    if (v >= 1e12) {
      return (v / 1e12).toLocaleString(locale, { maximumFractionDigits: 2 }) + 'T';
    }
    if (v >= 1e9) {
      return (v / 1e9).toLocaleString(locale, { maximumFractionDigits: 2 }) + 'B';
    }
    if (v >= 1e6) {
      return (v / 1e6).toLocaleString(locale, { maximumFractionDigits: 2 }) + 'M';
    }
    return v.toLocaleString(locale, { maximumFractionDigits: 0 });
  }

  function fmtFull(v: number) {
    return sym + v.toLocaleString(locale, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  }

  const sizeStyles = {
    mega: {
      text: () => l.mega,
      classes: 'text-purple-400 bg-purple-950/30 border-purple-800/50',
    },
    large: {
      text: () => l.large,
      classes: 'text-sky-400 bg-sky-950/30 border-sky-800/50',
    },
    mid: {
      text: () => l.mid,
      classes: 'text-emerald-400 bg-emerald-950/30 border-emerald-800/50',
    },
    small: {
      text: () => l.small,
      classes: 'text-amber-400 bg-amber-950/30 border-amber-800/50',
    },
    micro: {
      text: () => l.micro,
      classes: 'text-stone-400 bg-stone-900 border-stone-850',
    },
  };

  let copied = $state(false);
  function copyResult() {
    if (!result) return;
    let text = `${l.title}\n`;
    text += `${l.sharePrice}: ${sym}${result.sp}\n`;
    text += `${l.outstandingShares}: ${result.os.toLocaleString(locale)}\n`;
    text += `${l.marketCap}: ${fmtFull(result.marketCap)} (${formatNumber(result.marketCap)})\n`;
    text += `${l.classification}: ${sizeStyles[result.category].text()}\n`;

    if (result.pe !== undefined) {
      text += `${l.peRatio.replace(' (可选)', '')}: ${result.pe}\n`;
      text += `${l.netIncome}: ${fmtFull(result.netIncome ?? 0)}\n`;
    }

    navigator.clipboard.writeText(text).then(() => {
      copied = true;
      setTimeout(() => (copied = false), 1800);
    });
  }
</script>

<div class="bg-stone-950 text-stone-100 p-6 rounded-2xl border border-stone-800 shadow-2xl font-sans min-h-[400px]">
  <!-- Header -->
  <div class="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
    <div class="flex items-center gap-3">
      <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-400 to-sky-700 flex items-center justify-center text-stone-950 font-black text-lg">
        🏢
      </div>
      <div>
        <h2 class="font-extrabold text-lg bg-gradient-to-r from-sky-300 via-sky-100 to-sky-400 bg-clip-text text-transparent leading-tight">
          {l.title}
        </h2>
        <p class="text-stone-500 text-xs mt-0.5">{l.subtitle}</p>
      </div>
    </div>
    <div class="sm:ml-auto">
      <select bind:value={currency} class="bg-stone-900 border border-stone-700 text-stone-200 text-xs rounded-lg px-2.5 py-1.5 cursor-pointer focus:border-sky-500 focus:outline-none transition-colors">
        {#each Object.keys(symbols) as c}
          <option value={c}>{c}</option>
        {/each}
      </select>
    </div>
  </div>

  <!-- Content Split Grid -->
  <div class="grid grid-cols-1 md:grid-cols-12 gap-6">
    <!-- Left panel: Inputs (span 5) -->
    <div class="md:col-span-5 space-y-4">
      <label class="block">
        <span class="text-xs text-stone-400 mb-1.5 block">{l.sharePrice} ({sym})</span>
        <input
          type="number"
          bind:value={sharePrice}
          min="0.001"
          step="1"
          class="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-2.5 text-sm text-stone-100 focus:border-sky-500 focus:outline-none transition-colors"
        />
      </label>

      <label class="block">
        <span class="text-xs text-stone-400 mb-1.5 block">{l.outstandingShares}</span>
        <input
          type="number"
          bind:value={outstandingShares}
          min="1"
          step="100000"
          class="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-2.5 text-sm text-stone-100 focus:border-sky-500 focus:outline-none transition-colors"
        />
        {#if outstandingShares}
          <span class="text-xxs text-stone-500 mt-1 block">
            ≈ {formatNumber(parseFloat(outstandingShares) || 0)} shares
          </span>
        {/if}
      </label>

      <label class="block">
        <span class="text-xs text-stone-400 mb-1.5 block">{l.peRatio}</span>
        <input
          type="number"
          bind:value={peRatio}
          min="0.1"
          step="0.5"
          placeholder="e.g. 25"
          class="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-2.5 text-sm text-stone-100 focus:border-sky-500 focus:outline-none transition-colors"
        />
      </label>
    </div>

    <!-- Right panel: Results (span 7) -->
    <div class="md:col-span-7 flex flex-col justify-between space-y-4">
      {#if result}
        <div class="space-y-4">
          <!-- Big Market Cap Display -->
          <div class="rounded-xl p-5 bg-sky-950/20 border border-sky-800/30 text-center relative overflow-hidden">
            <div class="absolute -right-6 -bottom-6 text-7xl opacity-5 select-none">🏢</div>
            <p class="text-xs text-stone-400 mb-1">{l.marketCap}</p>
            <p class="text-4xl font-black text-sky-400 tracking-tight">
              {sym}{formatNumber(result.marketCap)}
            </p>
            <p class="text-xs text-stone-500 mt-2">
              {fmtFull(result.marketCap)}
            </p>
          </div>

          <!-- Classification Badge -->
          <div class="flex items-center justify-between bg-stone-900 border border-stone-800 rounded-xl p-3.5">
            <span class="text-xs text-stone-400 font-medium">{l.classification}</span>
            <span class="text-xs font-bold px-3 py-1 rounded-full border {sizeStyles[result.category].classes}">
              {sizeStyles[result.category].text()}
            </span>
          </div>

          <!-- Implied Calculations Grid (Net Income via PE) -->
          {#if result.pe !== undefined && result.pe > 0}
            <div class="bg-stone-900/60 border border-stone-850 rounded-xl p-4 space-y-2">
              <div class="text-xs text-stone-500">
                P/E Ratio: <span class="text-stone-300 font-semibold">{result.pe}</span>
              </div>
              <div>
                <div class="text-xxs text-stone-500 uppercase tracking-wider">{l.netIncome}</div>
                <div class="text-xl font-bold text-sky-400">
                  {fmtFull(result.netIncome ?? 0)}
                </div>
                <div class="text-xxs text-stone-500 mt-0.5">
                  ≈ {sym}{formatNumber(result.netIncome ?? 0)} / year
                </div>
              </div>
            </div>
          {/if}
        </div>

        <!-- Copy / Action Buttons -->
        <div class="flex items-center gap-3 pt-4 border-t border-stone-900">
          <button
            type="button"
            onclick={copyResult}
            class="flex-1 bg-stone-900 hover:bg-stone-850 border border-stone-800 text-stone-200 hover:text-stone-100 text-xs font-semibold py-2.5 px-4 rounded-lg transition-all flex items-center justify-center gap-2"
          >
            {#if copied}
              <span class="text-sky-400">{l.copied}</span>
            {:else}
              <span>📋 {l.copyResult}</span>
            {/if}
          </button>
        </div>
      {:else}
        <!-- Empty Placeholder -->
        <div class="h-full flex flex-col items-center justify-center text-center p-8 bg-stone-900/25 border border-dashed border-stone-850 rounded-xl">
          <div class="text-3xl mb-3">🏢</div>
          <p class="text-xs text-stone-400 max-w-xs leading-relaxed">
            {l.placeholderText}
          </p>
        </div>
      {/if}

      <!-- Formula & Disclaimer Footer -->
      <div class="space-y-2 text-xxs text-stone-600 mt-auto pt-4">
        <div class="bg-stone-950 p-2.5 rounded-lg border border-stone-900/80">
          <span class="font-bold text-stone-500">{l.formula}: </span>
          <span class="font-mono text-stone-400">{l.formulaText}</span>
        </div>
        <p class="text-center">{l.disclaimer}</p>
      </div>
    </div>
  </div>
</div>

<style>
  .text-xxs {
    font-size: 0.65rem;
  }
</style>
