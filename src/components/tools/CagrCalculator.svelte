<script lang="ts">
  interface Props {
    locale?: string;
    translations?: Record<string, unknown>;
  }

  let { locale = 'en', translations = {} }: Props = $props();

  const I18N_BACKUP: Record<string, Record<string, string>> = {
    zh: {
      title: 'CAGR (复合年增长率) 计算器',
      subtitle: '计算投资的复合年增长率、总回报及增长倍数推演',
      startValue: '初始价值 (本金)',
      endValue: '最终价值 (期末)',
      years: '投资年数',
      currency: '货币',
      formula: '计算公式',
      cagr: '复合年增长率 (CAGR)',
      compoundedPerYear: '年化复合增长率',
      totalReturn: '总回报率',
      avgAnnualGain: '平均年收益额',
      projectionsTitle: '增长预测推演 (以相同 CAGR 计)',
      inYears: '{years}年后',
      copyResult: '复制结果',
      copied: '✓ 已复制!',
      placeholderText: '请输入初始值、终值和投资年数以计算复合年增长率。',
      disclaimer: '仅供参考，不构成任何投资建议。'
    },
    en: {
      title: 'CAGR Calculator',
      subtitle: 'Compound Annual Growth Rate · Total Return · Projections',
      startValue: 'Starting Value',
      endValue: 'Ending Value',
      years: 'Number of Years',
      currency: 'Currency',
      formula: 'Formula',
      cagr: 'CAGR',
      compoundedPerYear: 'per year, compounded',
      totalReturn: 'Total Return',
      avgAnnualGain: 'Avg Annual Gain',
      projectionsTitle: 'Growth Projections (at same CAGR)',
      inYears: 'In {years} years',
      copyResult: 'Copy Result',
      copied: '✓ Copied!',
      placeholderText: 'Enter start value, end value, and years to calculate CAGR',
      disclaimer: 'For informational purposes only. Not financial advice.'
    },
    es: {
      title: 'Calculadora de CAGR',
      subtitle: 'Tasa de Crecimiento Anual Compuesto · Retorno Total · Proyecciones',
      startValue: 'Valor Inicial',
      endValue: 'Valor Final',
      years: 'Número de Años',
      currency: 'Moneda',
      formula: 'Fórmula',
      cagr: 'CAGR (TCAC)',
      compoundedPerYear: 'por año, compuesto',
      totalReturn: 'Retorno Total',
      avgAnnualGain: 'Ganancia Anual Promedio',
      projectionsTitle: 'Proyecciones de Crecimiento (al mismo CAGR)',
      inYears: 'En {years} años',
      copyResult: 'Copiar Resultado',
      copied: '✓ ¡Copiado!',
      placeholderText: 'Ingrese el valor inicial, el valor final y los años para calcular CAGR',
      disclaimer: 'Solo para fines informativos. No es asesoramiento financiero.'
    },
    pt: {
      title: 'Calculadora de CAGR',
      subtitle: 'Taxa de Crescimento Anual Composta · Retorno Total · Projeções',
      startValue: 'Valor Inicial',
      endValue: 'Valor Final',
      years: 'Número de Anos',
      currency: 'Moeda',
      formula: 'Fórmula',
      cagr: 'CAGR',
      compoundedPerYear: 'por ano, composto',
      totalReturn: 'Retorno Total',
      avgAnnualGain: 'Ganho Anual Médio',
      projectionsTitle: 'Projeções de Crescimento (no mesmo CAGR)',
      inYears: 'Em {years} anos',
      copyResult: 'Copiar Resultado',
      copied: '✓ Copiado!',
      placeholderText: 'Insira o valor inicial, o valor final e os anos para calcular o CAGR',
      disclaimer: 'Apenas para fins informativos. Não é conselho financeiro.'
    },
    ja: {
      title: 'CAGR (年平均成長率) 計算シミュレーター',
      subtitle: '年平均成長率（複利）、総リターン、および将来成長のシミュレーション',
      startValue: '初期投資額 (元本)',
      endValue: '最終評価額 (期末)',
      years: '投資期間 (年数)',
      currency: '通貨',
      formula: '計算式',
      cagr: '年平均成長率 (CAGR)',
      compoundedPerYear: '年利 (複利)',
      totalReturn: '総リターン',
      avgAnnualGain: '平均年間増加額',
      projectionsTitle: '成長予測推移 (同CAGRで運用した場合)',
      inYears: '{years}年後',
      copyResult: '結果をコピー',
      copied: '✓ コピーしました!',
      placeholderText: '初期値、最終値、および年数を入力して年平均成長率を計算します。',
      disclaimer: '情報提供のみを目的としています。投資勧誘ではありません。'
    },
    fr: {
      title: 'Calculateur de CAGR',
      subtitle: 'Taux de Croissance Annuel Composé · Rendement Total · Projections',
      startValue: 'Valeur Initiale',
      endValue: 'Valeur Finale',
      years: 'Nombre d\'Années',
      currency: 'Devise',
      formula: 'Formule',
      cagr: 'CAGR (TCAC)',
      compoundedPerYear: 'par an, composé',
      totalReturn: 'Retour Total',
      avgAnnualGain: 'Gain Annuel Moyen',
      projectionsTitle: 'Projections de Croissance (au même CAGR)',
      inYears: 'Dans {years} ans',
      copyResult: 'Copier le Résultat',
      copied: '✓ Copié !',
      placeholderText: 'Entrez la valeur de départ, la valeur finale et le nombre d\'années pour calculer le CAGR',
      disclaimer: 'À titre informatif uniquement. Pas de conseil financier.'
    },
    de: {
      title: 'CAGR-Rechner',
      subtitle: 'Jährliche Wachstumsrate (Zinseszins) · Gesamtrendite · Prognosen',
      startValue: 'Anfangswert',
      endValue: 'Endwert',
      years: 'Anzahl der Jahre',
      currency: 'Währung',
      formula: 'Formel',
      cagr: 'CAGR',
      compoundedPerYear: 'pro Jahr, aufgezinst',
      totalReturn: 'Gesamtrendite',
      avgAnnualGain: 'Durchschn. Jahresgewinn',
      projectionsTitle: 'Wachstumsprognosen (bei gleichem CAGR)',
      inYears: 'In {years} Jahren',
      copyResult: 'Ergebnis kopieren',
      copied: '✓ Kopiert!',
      placeholderText: 'Geben Sie Anfangswert, Endwert und Jahre ein, um CAGR zu berechnen',
      disclaimer: 'Nur zu Informationszwecken. Keine Finanzberatung.'
    },
    ar: {
      title: 'حاسبة معدل النمو السنوي المركب (CAGR)',
      subtitle: 'معدل النمو السنوي المركب · العائد الإجمالي · التوقعات المستقبلية',
      startValue: 'القيمة الأولية',
      endValue: 'القيمة النهائية',
      years: 'عدد السنوات',
      currency: 'العملة',
      formula: 'المعادلة الرياضية',
      cagr: 'معدل النمو المركب (CAGR)',
      compoundedPerYear: 'سنوياً، بشكل مركب',
      totalReturn: 'إجمالي العائد',
      avgAnnualGain: 'متوسط الربح السنوي',
      projectionsTitle: 'توقعات النمو (بنفس معدل النمو المركب)',
      inYears: 'خلال {years} سنوات',
      copyResult: 'نسخ النتيجة',
      copied: '✓ تم النسخ!',
      placeholderText: 'أدخل القيمة الأولية والنهائية وعدد السنوات لحساب معدل النمو المركب',
      disclaimer: 'لأغراض إعلامية فقط. لا يعتبر نصيحة مالية.'
    },
    ko: {
      title: 'CAGR (연평균 성장률) 계산기',
      subtitle: '연평균 복리 성장률 · 총수익률 · 미래 자산 전망 시뮬레이션',
      startValue: '초기 가치 (원금)',
      endValue: '최종 가치 (평가액)',
      years: '투자 기간 (년)',
      currency: '화폐',
      formula: '수식',
      cagr: '연평균 성장률 (CAGR)',
      compoundedPerYear: '연 복리 기준',
      totalReturn: '총 수익률',
      avgAnnualGain: '평균 연간 수익액',
      projectionsTitle: '자산 성장 전망 (동일 CAGR 가정)',
      inYears: '{years}년 후',
      copyResult: '결과 복사',
      copied: '✓ 복사됨!',
      placeholderText: '초기값, 최종값, 기간을 입력하여 연평균 성장률을 계산해보세요.',
      disclaimer: '단순 참고용입니다. 투자 권유가 아닙니다.'
    },
    ru: {
      title: 'Калькулятор CAGR',
      subtitle: 'Среднегодовой темп роста с учетом сложного процента · Общая доходность',
      startValue: 'Начальная стоимость',
      endValue: 'Конечная стоимость',
      years: 'Количество лет',
      currency: 'Валюта',
      formula: 'Формула',
      cagr: 'CAGR',
      compoundedPerYear: 'в год, сложный процент',
      totalReturn: 'Общая доходность',
      avgAnnualGain: 'Средняя годовая прибыль',
      projectionsTitle: 'Прогноз роста (при том же уровне CAGR)',
      inYears: 'Через {years} лет',
      copyResult: 'Скопировать результат',
      copied: '✓ Скопировано!',
      placeholderText: 'Введите начальное значение, конечное значение и количество лет для расчета CAGR',
      disclaimer: 'Только для ознакомления. Не является финансовой рекомендацией.'
    }
  };

  const l = $derived(I18N_BACKUP[locale] || I18N_BACKUP['en']);

  let startValue = $state('10000');
  let endValue   = $state('25000');
  let years      = $state('7');
  let currency   = $state('USD');

  const symbols: Record<string, string> = { USD: '$', EUR: '€', GBP: '£', JPY: '¥', CNY: '¥', CAD: 'CA$', AUD: 'A$', CHF: 'CHF' };

  const result = $derived((() => {
    const sv = parseFloat(startValue) || 0;
    const ev = parseFloat(endValue)   || 0;
    const yr = parseFloat(years)      || 0;

    if (sv <= 0 || ev <= 0 || yr <= 0) return null;

    const cagr        = (Math.pow(ev / sv, 1 / yr) - 1) * 100;
    const totalReturn = ((ev - sv) / sv) * 100;
    const annualGain  = (ev - sv) / yr;

    // Projection table: 1x, 2x, 3x duration
    const projections = [1, 2, 3].map(mult => ({
      years: yr * mult,
      value: sv * Math.pow(1 + cagr / 100, yr * mult),
    }));

    return { cagr, totalReturn, annualGain, projections, sv, ev };
  })());

  const sym = $derived(symbols[currency] ?? currency);
  function fmt(v: number) { return sym + v.toLocaleString(locale, { minimumFractionDigits: 0, maximumFractionDigits: 0 }); }

  let copied = $state(false);
  function copyResult() {
    if (!result) return;
    const text = `${l.title}\n${l.cagr}: ${result.cagr.toFixed(2)}%\n${l.totalReturn}: ${result.totalReturn.toFixed(2)}%\n${l.avgAnnualGain}: ${fmt(result.annualGain)}\n${l.startValue}: ${fmt(result.sv)} → ${l.endValue}: ${fmt(result.ev)} over ${years} years`;
    navigator.clipboard.writeText(text).then(() => { copied = true; setTimeout(() => copied = false, 1800); });
  }
</script>

<div class="tool-theme-shell p-5 rounded-2xl font-sans min-h-[400px]">
  <div class="flex items-center gap-3 mb-6">
    <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-amber-700 flex items-center justify-center text-stone-950 font-black text-sm">%</div>
    <div>
      <h2 class="font-extrabold text-lg text-amber-700 dark:bg-gradient-to-r dark:from-amber-300 dark:via-amber-100 dark:to-amber-400 dark:bg-clip-text dark:text-transparent leading-tight">{l.title}</h2>
      <p class="text-stone-500 text-xs">{l.subtitle}</p>
    </div>
    <div class="ml-auto">
      <select bind:value={currency} class="bg-stone-800 border border-stone-700 text-stone-200 text-xs rounded-lg px-2 py-1.5 cursor-pointer">
        {#each Object.keys(symbols) as c}<option value={c}>{c}</option>{/each}
      </select>
    </div>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
    <!-- Inputs -->
    <div class="space-y-3">
      <label class="block">
        <span class="text-xs text-stone-400 mb-1 block">{l.startValue}</span>
        <input type="number" bind:value={startValue} min="0" step="100"
          class="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-2.5 text-sm text-stone-100 focus:border-amber-500 focus:outline-none transition-colors" />
      </label>
      <label class="block">
        <span class="text-xs text-stone-400 mb-1 block">{l.endValue}</span>
        <input type="number" bind:value={endValue} min="0" step="100"
          class="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-2.5 text-sm text-stone-100 focus:border-amber-500 focus:outline-none transition-colors" />
      </label>
      <label class="block">
        <span class="text-xs text-stone-400 mb-1 block">{l.years}</span>
        <input type="number" bind:value={years} min="0.1" max="100" step="0.5"
          class="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-2.5 text-sm text-stone-100 focus:border-amber-500 focus:outline-none transition-colors" />
      </label>

      <!-- Formula reference -->
      <div class="bg-stone-900 rounded-xl p-3 border border-stone-800">
        <p class="text-xs text-stone-500 mb-1">{l.formula}</p>
        <p class="text-xs text-stone-400 font-mono">CAGR = (End/Start)^(1/Years) − 1</p>
      </div>
    </div>

    <!-- Results -->
    <div class="space-y-3">
      {#if result}
        <div class="rounded-xl p-4 bg-amber-950/30 border border-amber-800/50 text-center">
          <p class="text-xs text-stone-400 mb-1">{l.cagr}</p>
          <p class="text-4xl font-black text-amber-400">{result.cagr.toFixed(2)}%</p>
          <p class="text-sm text-stone-400 mt-1">{l.compoundedPerYear}</p>
        </div>

        <div class="grid grid-cols-2 gap-2">
          <div class="bg-stone-900 rounded-xl p-3 border border-stone-800">
            <p class="text-xs text-stone-500">{l.totalReturn}</p>
            <p class="text-amber-300 font-bold">{result.totalReturn >= 0 ? '+' : ''}{result.totalReturn.toFixed(1)}%</p>
          </div>
          <div class="bg-stone-900 rounded-xl p-3 border border-stone-800">
            <p class="text-xs text-stone-500">{l.avgAnnualGain}</p>
            <p class="text-amber-300 font-bold">{fmt(result.annualGain)}</p>
          </div>
        </div>

        <!-- Projection table -->
        <div class="bg-stone-900 rounded-xl p-3 border border-stone-800">
          <p class="text-xs text-stone-500 mb-2">{l.projectionsTitle}</p>
          {#each result.projections as p}
            <div class="flex justify-between items-center py-1 border-b border-stone-800 last:border-0">
              <span class="text-xs text-stone-400">{l.inYears.replace('{years}', p.years.toFixed(0))}</span>
              <span class="text-sm font-bold text-amber-300">{fmt(p.value)}</span>
            </div>
          {/each}
        </div>

        <button onclick={copyResult}
          class="w-full py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 {copied ? 'bg-emerald-700 text-white' : 'bg-amber-600 hover:bg-amber-500 text-stone-950'}">
          {copied ? l.copied : l.copyResult}
        </button>
      {:else}
        <div class="flex flex-col items-center justify-center h-48 text-stone-500">
          <span class="text-4xl mb-3">📈</span>
          <p class="text-sm">{l.placeholderText}</p>
        </div>
      {/if}
    </div>
  </div>
  <p class="text-xs text-stone-600 mt-4 text-center">{l.disclaimer}</p>
</div>

