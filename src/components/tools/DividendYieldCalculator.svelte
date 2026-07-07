<script lang="ts">
  import {
    calculateDividendYield,
    calculateAnnualDividend,
    classifyYield,
  } from '../../lib/dividend-yield-helper';

  interface Props {
    locale?: string;
    translations?: Record<string, unknown>;
  }

  let { locale = 'en', translations = {} }: Props = $props();

  const I18N_BACKUP: Record<string, Record<string, string>> = {
    zh: {
      title: '股息率计算器',
      subtitle: '计算股票的股息率、年度红利收益及实现目标收益所需的投资规模',
      sharePrice: '股票价格',
      dividendFrequency: '派息频率',
      dividendAmount: '股息金额 (单期)',
      annual: '按年派息',
      quarterly: '按季派息',
      monthly: '按月派息',
      sharesHeld: '持有股数 (可选)',
      targetAnnualIncome: '目标年度股息收入 (可选)',
      yieldPercent: '股息率 (Dividend Yield)',
      annualDividend: '年化每股股息',
      annualIncome: '预计年股息收入',
      monthlyIncome: '预计月均股息收入',
      sharesNeeded: '所需股票数量',
      capitalNeeded: '所需投资本金',
      classification: '股息率评级',
      veryLow: '极低股息',
      low: '低股息',
      moderate: '中等股息',
      high: '高股息',
      veryHigh: '极高股息 (高风险)',
      currency: '货币',
      copied: '✓ 已复制!',
      copyResult: '复制结果',
      formula: '计算公式',
      formulaText: '股息率 = (单股年化股息 / 股票价格) × 100%',
      disclaimer: '仅供参考，不构成任何投资建议。',
      placeholderText: '请输入股票价格和股息金额以计算股息率。',
    },
    en: {
      title: 'Dividend Yield Calculator',
      subtitle: 'Calculate dividend yield, annual income, and target requirements',
      sharePrice: 'Share Price',
      dividendFrequency: 'Dividend Frequency',
      dividendAmount: 'Dividend Amount (per period)',
      annual: 'Annually',
      quarterly: 'Quarterly',
      monthly: 'Monthly',
      sharesHeld: 'Shares Held (Optional)',
      targetAnnualIncome: 'Target Annual Income (Optional)',
      yieldPercent: 'Dividend Yield',
      annualDividend: 'Annual Dividend per Share',
      annualIncome: 'Est. Annual Income',
      monthlyIncome: 'Est. Monthly Income',
      sharesNeeded: 'Shares Needed',
      capitalNeeded: 'Capital Required',
      classification: 'Yield Category',
      veryLow: 'Very Low Yield',
      low: 'Low Yield',
      moderate: 'Moderate Yield',
      high: 'High Yield',
      veryHigh: 'Very High Yield (Risky)',
      currency: 'Currency',
      copied: '✓ Copied!',
      copyResult: 'Copy Result',
      formula: 'Formula',
      formulaText: 'Dividend Yield = (Annual Dividend per Share / Share Price) × 100%',
      disclaimer: 'For informational purposes only. Not financial advice.',
      placeholderText: 'Enter share price and dividend amount to calculate yield',
    },
    es: {
      title: 'Calculadora de Rendimiento de Dividendos',
      subtitle: 'Calcule el rendimiento, los ingresos anuales y los requisitos para alcanzar sus objetivos',
      sharePrice: 'Precio de la Acción',
      dividendFrequency: 'Frecuencia del Dividendo',
      dividendAmount: 'Monto del Dividendo (por período)',
      annual: 'Anual',
      quarterly: 'Trimestral',
      monthly: 'Mensual',
      sharesHeld: 'Acciones Poseídas (Opcional)',
      targetAnnualIncome: 'Ingreso Anual Objetivo (Opcional)',
      yieldPercent: 'Rendimiento de Dividendos',
      annualDividend: 'Dividendo Anual por Acción',
      annualIncome: 'Ingreso Anual Estimado',
      monthlyIncome: 'Ingreso Mensual Estimado',
      sharesNeeded: 'Acciones Necesarias',
      capitalNeeded: 'Capital Requerido',
      classification: 'Categoría de Rendimiento',
      veryLow: 'Rendimiento Muy Bajo',
      low: 'Rendimiento Bajo',
      moderate: 'Rendimiento Moderado',
      high: 'Rendimiento Alto',
      veryHigh: 'Rendimiento Muy Alto (Riesgoso)',
      currency: 'Moneda',
      copied: '¡Copiado!',
      copyResult: 'Copiar Resultado',
      formula: 'Fórmula',
      formulaText: 'Rendimiento = (Dividendo Anual / Precio de Acción) × 100%',
      disclaimer: 'Solo para fines informativos. No es asesoramiento financiero.',
      placeholderText: 'Ingrese el precio y el monto para calcular el rendimiento',
    },
    pt: {
      title: 'Calculadora de Dividend Yield',
      subtitle: 'Calcule o rendimento de dividendos, renda anual e requisitos do objetivo',
      sharePrice: 'Preço da Ação',
      dividendFrequency: 'Frequência dos Dividendos',
      dividendAmount: 'Valor do Dividendo (por período)',
      annual: 'Anual',
      quarterly: 'Trimestral',
      monthly: 'Mensal',
      sharesHeld: 'Ações Detidas (Opcional)',
      targetAnnualIncome: 'Renda Anual Meta (Opcional)',
      yieldPercent: 'Dividend Yield',
      annualDividend: 'Dividendo Anual por Ação',
      annualIncome: 'Renda Anual Estimada',
      monthlyIncome: 'Renda Mensal Estimada',
      sharesNeeded: 'Ações Necessárias',
      capitalNeeded: 'Capital Necessário',
      classification: 'Categoria de Rendimento',
      veryLow: 'Rendimento Muito Baixo',
      low: 'Rendimento Baixo',
      moderate: 'Rendimento Moderado',
      high: 'Rendimento Alto',
      veryHigh: 'Rendimento Muito Alto (Arriscado)',
      currency: 'Moeda',
      copied: 'Copiado!',
      copyResult: 'Copiar Resultado',
      formula: 'Fórmula',
      formulaText: 'Yield = (Dividendo Anual / Preço da Ação) × 100%',
      disclaimer: 'Apenas para fins informativos. Não é conselho financeiro.',
      placeholderText: 'Insira o preço da ação e o dividendo para calcular o yield',
    },
    ja: {
      title: '配当利回り計算シミュレーター',
      subtitle: '配当利回り、年間受取配当金、目標達成に必要な資金額を計算します',
      sharePrice: '株価',
      dividendFrequency: '配当頻度',
      dividendAmount: '配当金 (1回あたり)',
      annual: '年1回',
      quarterly: '年4回 (四半期)',
      monthly: '年12回 (毎月)',
      sharesHeld: '保有株数 (任意)',
      targetAnnualIncome: '目標年間配当金 (任意)',
      yieldPercent: '配当利回り',
      annualDividend: '1株当たり年間配当金',
      annualIncome: '予想年間配当金',
      monthlyIncome: '予想月間配当金',
      sharesNeeded: '必要な株数',
      capitalNeeded: '必要な投資元本',
      classification: '配当利回り判定',
      veryLow: '極めて低い',
      low: '低い',
      moderate: '標準',
      high: '高い',
      veryHigh: '極めて高い (高リスク)',
      currency: '通貨',
      copied: 'コピーしました！',
      copyResult: '結果をコピー',
      formula: '計算式',
      formulaText: '配当利回り = (1株当たり年間配当金 / 株価) × 100%',
      disclaimer: '情報提供のみを目的としています。投資勧誘ではありません。',
      placeholderText: '株価と配当金額を入力して、配当利回りを計算します',
    },
    fr: {
      title: 'Calculateur de Rendement des Dividendes',
      subtitle: 'Calculez le rendement des dividendes, le revenu annuel et le capital requis',
      sharePrice: 'Prix de l\'Action',
      dividendFrequency: 'Fréquence des Dividendes',
      dividendAmount: 'Montant du Dividende (par période)',
      annual: 'Annuel',
      quarterly: 'Trimestriel',
      monthly: 'Mensuel',
      sharesHeld: 'Actions Détenues (Optionnel)',
      targetAnnualIncome: 'Revenu Annuel Ciblé (Optionnel)',
      yieldPercent: 'Rendement des Dividendes',
      annualDividend: 'Dividende Annuel par Action',
      annualIncome: 'Revenu Annuel Estimé',
      monthlyIncome: 'Revenu Mensuel Estimé',
      sharesNeeded: 'Actions Requises',
      capitalNeeded: 'Capital Requis',
      classification: 'Catégorie de Rendement',
      veryLow: 'Rendement Très Faible',
      low: 'Rendement Faible',
      moderate: 'Rendement Modéré',
      high: 'Rendement Élevé',
      veryHigh: 'Rendement Très Élevé (Risqué)',
      currency: 'Devise',
      copied: 'Copié !',
      copyResult: 'Copier le Résultat',
      formula: 'Formule',
      formulaText: 'Rendement = (Dividende Annuel / Prix de l\'Action) × 100%',
      disclaimer: 'À titre informatif uniquement. Pas de conseil financier.',
      placeholderText: 'Saisissez le prix et le dividende pour calculer le rendement',
    },
    de: {
      title: 'Dividendenrendite-Rechner',
      subtitle: 'Berechnen Sie die Dividendenrendite, das jährliche Einkommen und das benötigte Kapital',
      sharePrice: 'Aktienpreis',
      dividendFrequency: 'Dividendenintervall',
      dividendAmount: 'Dividende pro Periode',
      annual: 'Jährlich',
      quarterly: 'Quartalsweise',
      monthly: 'Monatlich',
      sharesHeld: 'Gehaltene Aktien (Optional)',
      targetAnnualIncome: 'Jährliches Dividendenziel (Optional)',
      yieldPercent: 'Dividendenrendite',
      annualDividend: 'Jährliche Dividende pro Aktie',
      annualIncome: 'Geschätztes Jahreseinkommen',
      monthlyIncome: 'Geschätztes Monatseinkommen',
      sharesNeeded: 'Benötigte Aktien',
      capitalNeeded: 'Benötigtes Kapital',
      classification: 'Renditeklassifizierung',
      veryLow: 'Sehr niedrige Rendite',
      low: 'Niedrige Rendite',
      moderate: 'Moderate Rendite',
      high: 'Hohe Rendite',
      veryHigh: 'Sehr hohe Rendite (Risikoreich)',
      currency: 'Währung',
      copied: 'Kopiert!',
      copyResult: 'Ergebnis kopieren',
      formula: 'Formel',
      formulaText: 'Dividendenrendite = (Jährliche Dividende / Aktienpreis) × 100%',
      disclaimer: 'Nur zu Informationszwecken. Keine Finanzberatung.',
      placeholderText: 'Geben Sie Aktienpreis und Dividendenbetrag ein, um die Rendite zu berechnen',
    },
    ar: {
      title: 'حاسبة عائد توزيعات الأرباح',
      subtitle: 'احسب عائد التوزيعات، الدخل السنوي، والمتطلبات لتحقيق أهدافك',
      sharePrice: 'سعر السهم',
      dividendFrequency: 'تكرار توزيع الأرباح',
      dividendAmount: 'مبلغ التوزيع (لكل فترة)',
      annual: 'سنوياً',
      quarterly: 'ربع سنوي',
      monthly: 'شهرياً',
      sharesHeld: 'الأسهم المملوكة (اختياري)',
      targetAnnualIncome: 'الدخل السنوي المستهدف (اختياري)',
      yieldPercent: 'عائد توزيعات الأرباح',
      annualDividend: 'التوزيع السنوي لكل سهم',
      annualIncome: 'الدخل السنوي المتوقع',
      monthlyIncome: 'الدخل الشهري المتوقع',
      sharesNeeded: 'الأسهم المطلوبة',
      capitalNeeded: 'رأس المال المطلوب',
      classification: 'فئة العائد',
      veryLow: 'عائد منخفض جداً',
      low: 'عائد منخفض',
      moderate: 'عائد متوسط',
      high: 'عائد مرتفع',
      veryHigh: 'عائد مرتفع جداً (عالي المخاطر)',
      currency: 'العملة',
      copied: 'تم النسخ!',
      copyResult: 'نسخ النتيجة',
      formula: 'المعادلة',
      formulaText: 'عائد التوزيعات = (التوزيع السنوي للسهم / سعر السهم) × 100%',
      disclaimer: 'لأغراض إعلامية فقط. لا يعتبر نصيحة مالية.',
      placeholderText: 'أدخل سعر السهم ومبلغ توزيع الأرباح لحساب العائد',
    },
    ko: {
      title: '배당수익률 계산기',
      subtitle: '배당수익률, 연간 예상 배당금, 목표 배당 달성 요건을 계산합니다',
      sharePrice: '주식 가격',
      dividendFrequency: '배당 주기',
      dividendAmount: '배당금 (1회당)',
      annual: '연간',
      quarterly: '분기별',
      monthly: '월간',
      sharesHeld: '보유 주식 수 (선택)',
      targetAnnualIncome: '목표 연간 배당 소득 (선택)',
      yieldPercent: '배당수익률',
      annualDividend: '주당 연간 배당금',
      annualIncome: '예상 연간 배당 소득',
      monthlyIncome: '예상 월평균 배당 소득',
      sharesNeeded: '필요한 주식 수',
      capitalNeeded: '필요한 투자 원금',
      classification: '배당 등급',
      veryLow: '매우 낮음',
      low: '낮음',
      moderate: '보통',
      high: '높음',
      veryHigh: '매우 높음 (고위험)',
      currency: '화폐',
      copied: '복사 완료!',
      copyResult: '결과 복사',
      formula: '수식',
      formulaText: '배당수익률 = (주당 연간 배당금 / 주식 가격) × 100%',
      disclaimer: '단순 참고용입니다. 투자 권유가 아닙니다.',
      placeholderText: '주식 가격과 배당금을 입력하여 배당수익률을 계산하세요',
    },
    ru: {
      title: 'Калькулятор дивидендной доходности',
      subtitle: 'Расчет дивидендной доходности, годового дохода и капитала для достижения целей',
      sharePrice: 'Цена акции',
      dividendFrequency: 'Частота выплат',
      dividendAmount: 'Размер дивиденда (за период)',
      annual: 'Раз в год',
      quarterly: 'Раз в квартал',
      monthly: 'Раз в месяц',
      sharesHeld: 'Количество акций (опционально)',
      targetAnnualIncome: 'Целевой годовой доход (опционально)',
      yieldPercent: 'Дивидендная доходность',
      annualDividend: 'Годовой дивиденд на акцию',
      annualIncome: 'Ожидаемый годовой доход',
      monthlyIncome: 'Ожидаемый месячный доход',
      sharesNeeded: 'Необходимо акций',
      capitalNeeded: 'Необходимый капитал',
      classification: 'Категория доходности',
      veryLow: 'Очень низкая',
      low: 'Низкая',
      moderate: 'Умеренная',
      high: 'Высокая',
      veryHigh: 'Очень высокая (рискованная)',
      currency: 'Валюта',
      copied: 'Скопировано!',
      copyResult: 'Скопировать результат',
      formula: 'Формула',
      formulaText: 'Дивидендная доходность = (Годовой дивиденд на акцию / Цена акции) × 100%',
      disclaimer: 'Только для ознакомления. Не является финансовой рекомендацией.',
      placeholderText: 'Введите цену акции и размер дивидендов для расчета доходности',
    },
  };

  const l = $derived(I18N_BACKUP[locale] || I18N_BACKUP['en']);

  let sharePrice = $state('50');
  let frequency = $state('quarterly'); // annual | quarterly | monthly
  let dividendAmount = $state('0.5');
  let sharesHeld = $state('');
  let targetAnnualIncome = $state('');
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
    const da = parseFloat(dividendAmount) || 0;
    const sh = sharesHeld !== '' ? (parseInt(sharesHeld, 10) || 0) : undefined;
    const tai = targetAnnualIncome !== '' ? (parseFloat(targetAnnualIncome) || 0) : undefined;

    if (sp <= 0 || da <= 0) return null;

    // Calculate options
    const calcInput: any = { sharePrice: sp };
    if (frequency === 'annual') {
      calcInput.annualDividend = da;
    } else if (frequency === 'quarterly') {
      calcInput.quarterlyDividend = da;
    } else if (frequency === 'monthly') {
      calcInput.monthlyDividend = da;
    }

    if (sh !== undefined) calcInput.sharesHeld = sh;
    if (tai !== undefined) calcInput.targetAnnualIncome = tai;

    const res = calculateDividendYield(calcInput);
    const rating = classifyYield(res.yieldPercent);

    return {
      ...res,
      rating,
      sp,
      da,
      sh,
      tai,
    };
  })());

  const sym = $derived(symbols[currency] ?? currency);
  function fmt(v: number) {
    return sym + v.toLocaleString(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
  function fmtWhole(v: number) {
    return v.toLocaleString(locale, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  }

  const ratingStyles = {
    'very-low': {
      text: () => l.veryLow,
      classes: 'text-stone-400 bg-stone-900 border-stone-800',
    },
    low: {
      text: () => l.low,
      classes: 'text-sky-400 bg-sky-950/30 border-sky-800/50',
    },
    moderate: {
      text: () => l.moderate,
      classes: 'text-emerald-400 bg-emerald-950/30 border-emerald-800/50',
    },
    high: {
      text: () => l.high,
      classes: 'text-amber-400 bg-amber-950/30 border-amber-800/50',
    },
    'very-high': {
      text: () => l.veryHigh,
      classes: 'text-red-400 bg-red-950/30 border-red-800/50',
    },
  };

  let copied = $state(false);
  function copyResult() {
    if (!result) return;
    let text = `${l.title}\n`;
    text += `${l.sharePrice}: ${sym}${result.sp}\n`;
    text += `${l.dividendAmount}: ${sym}${result.da} (${l[frequency]})\n`;
    text += `${l.yieldPercent}: ${result.yieldPercent.toFixed(2)}%\n`;
    text += `${l.annualDividend}: ${sym}${result.annualDividend.toFixed(2)}\n`;
    text += `${l.classification}: ${ratingStyles[result.rating].text()}\n`;

    if (result.sh !== undefined) {
      text += `${l.sharesHeld}: ${fmtWhole(result.sh)}\n`;
      text += `${l.annualIncome}: ${fmt(result.annualIncome ?? 0)}\n`;
    }
    if (result.tai !== undefined) {
      text += `${l.targetAnnualIncome}: ${fmt(result.tai)}\n`;
      text += `${l.sharesNeeded}: ${fmtWhole(result.sharesNeeded ?? 0)}\n`;
      text += `${l.capitalNeeded}: ${fmt(result.capitalNeeded ?? 0)}\n`;
    }

    navigator.clipboard.writeText(text).then(() => {
      copied = true;
      setTimeout(() => (copied = false), 1800);
    });
  }
</script>

<div class="tool-theme-shell p-6 rounded-2xl font-sans min-h-[400px]">
  <!-- Header -->
  <div class="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
    <div class="flex items-center gap-3">
      <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-700 flex items-center justify-center text-stone-950 font-black text-lg">
        💰
      </div>
      <div>
        <h2 class="font-extrabold text-lg text-emerald-700 dark:bg-gradient-to-r dark:from-emerald-300 dark:via-emerald-100 dark:to-emerald-400 dark:bg-clip-text dark:text-transparent leading-tight">
          {l.title}
        </h2>
        <p class="text-stone-500 text-xs mt-0.5">{l.subtitle}</p>
      </div>
    </div>
    <div class="sm:ml-auto">
      <select bind:value={currency} class="bg-stone-900 border border-stone-700 text-stone-200 text-xs rounded-lg px-2.5 py-1.5 cursor-pointer focus:border-emerald-500 focus:outline-none transition-colors">
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
          min="0.01"
          step="1"
          class="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-2.5 text-sm text-stone-100 focus:border-emerald-500 focus:outline-none transition-colors"
        />
      </label>

      <div>
        <span class="text-xs text-stone-400 mb-1.5 block">{l.dividendFrequency}</span>
        <div class="grid grid-cols-3 gap-2">
          {#each ['annual', 'quarterly', 'monthly'] as freq}
            <button
              type="button"
              onclick={() => (frequency = freq)}
              class="py-2 text-xs font-semibold rounded-lg border transition-all {frequency === freq ? 'bg-emerald-950/40 border-emerald-600 text-emerald-400' : 'bg-stone-900 border-stone-800 text-stone-400 hover:border-stone-700'}"
            >
              {l[freq]}
            </button>
          {/each}
        </div>
      </div>

      <label class="block">
        <span class="text-xs text-stone-400 mb-1.5 block">{l.dividendAmount} ({sym})</span>
        <input
          type="number"
          bind:value={dividendAmount}
          min="0"
          step="0.05"
          class="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-2.5 text-sm text-stone-100 focus:border-emerald-500 focus:outline-none transition-colors"
        />
      </label>

      <div class="border-t border-stone-800/80 pt-4 space-y-4">
        <label class="block">
          <span class="text-xs text-stone-400 mb-1.5 block">{l.sharesHeld}</span>
          <input
            type="number"
            bind:value={sharesHeld}
            min="0"
            placeholder="e.g. 100"
            class="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-2.5 text-sm text-stone-100 focus:border-emerald-500 focus:outline-none transition-colors"
          />
        </label>

        <label class="block">
          <span class="text-xs text-stone-400 mb-1.5 block">{l.targetAnnualIncome} ({sym})</span>
          <input
            type="number"
            bind:value={targetAnnualIncome}
            min="0"
            placeholder="e.g. 1000"
            class="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-2.5 text-sm text-stone-100 focus:border-emerald-500 focus:outline-none transition-colors"
          />
        </label>
      </div>
    </div>

    <!-- Right panel: Results (span 7) -->
    <div class="md:col-span-7 flex flex-col justify-between space-y-4">
      {#if result}
        <div class="space-y-4">
          <!-- Big Yield Display -->
          <div class="rounded-xl p-5 bg-emerald-950/20 border border-emerald-800/30 text-center relative overflow-hidden">
            <div class="absolute -right-6 -bottom-6 text-7xl opacity-5 select-none">📈</div>
            <p class="text-xs text-stone-400 mb-1">{l.yieldPercent}</p>
            <p class="text-5xl font-black text-emerald-400 tracking-tight">
              {result.yieldPercent.toFixed(2)}%
            </p>
            <p class="text-xs text-stone-500 mt-2">
              {l.annualDividend}: <span class="text-emerald-300 font-semibold">{sym}{result.annualDividend.toFixed(2)}</span> / share
            </p>
          </div>

          <!-- Classification Badge -->
          <div class="flex items-center justify-between bg-stone-900 border border-stone-800 rounded-xl p-3.5">
            <span class="text-xs text-stone-400 font-medium">{l.classification}</span>
            <span class="text-xs font-bold px-3 py-1 rounded-full border {ratingStyles[result.rating].classes}">
              {ratingStyles[result.rating].text()}
            </span>
          </div>

          <!-- Optional Calculations Grid -->
          {#if result.sh !== undefined || result.tai !== undefined}
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {#if result.sh !== undefined}
                <div class="bg-stone-900/60 border border-stone-850 rounded-xl p-4 space-y-2">
                  <div class="text-xs text-stone-500">{l.sharesHeld}: <span class="text-stone-300 font-semibold">{fmtWhole(result.sh)}</span></div>
                  <div>
                    <div class="text-xxs text-stone-500 uppercase tracking-wider">{l.annualIncome}</div>
                    <div class="text-base font-bold text-emerald-400">{fmt(result.annualIncome ?? 0)}</div>
                  </div>
                  <div>
                    <div class="text-xxs text-stone-500 uppercase tracking-wider">{l.monthlyIncome}</div>
                    <div class="text-xs font-semibold text-stone-300">{fmt(result.monthlyIncome ?? 0)} / month</div>
                  </div>
                </div>
              {/if}

              {#if result.tai !== undefined}
                <div class="bg-stone-900/60 border border-stone-850 rounded-xl p-4 space-y-2">
                  <div class="text-xs text-stone-500">{l.targetAnnualIncome}: <span class="text-stone-300 font-semibold">{fmt(result.tai)}</span></div>
                  <div>
                    <div class="text-xxs text-stone-500 uppercase tracking-wider">{l.sharesNeeded}</div>
                    <div class="text-base font-bold text-emerald-400">{fmtWhole(result.sharesNeeded ?? 0)}</div>
                  </div>
                  <div>
                    <div class="text-xxs text-stone-500 uppercase tracking-wider">{l.capitalNeeded}</div>
                    <div class="text-xs font-semibold text-stone-300">{fmt(result.capitalNeeded ?? 0)}</div>
                  </div>
                </div>
              {/if}
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
              <span class="text-emerald-400">{l.copied}</span>
            {:else}
              <span>📋 {l.copyResult}</span>
            {/if}
          </button>
        </div>
      {:else}
        <!-- Empty Placeholder -->
        <div class="h-full flex flex-col items-center justify-center text-center p-8 bg-stone-900/25 border border-dashed border-stone-850 rounded-xl">
          <div class="text-3xl mb-3">💵</div>
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
  /* Custom micro classes */
  .text-xxs {
    font-size: 0.65rem;
  }
</style>
