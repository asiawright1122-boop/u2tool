<script lang="ts">
  interface Props {
    locale?: string;
    translations?: Record<string, unknown>;
  }

  let { locale = 'en', translations = {} }: Props = $props();

  const I18N_BACKUP: Record<string, Record<string, string>> = {
    zh: {
      title: '储蓄目标理财计算器',
      subtitle: '计算达成理财目标所需的每月存入额或达成时间，支持复利增值推演',
      targetAmount: '目标储蓄金额',
      initialSavings: '初始资金 (当前存款)',
      interestRate: '年化利率 (APY %)',
      calcMode: '计算模式',
      modeMonthly: '计算每月需要存多少钱',
      modeDuration: '计算需要多少个月能攒够',
      monthlyContribution: '每月计划存入额',
      timeToGoal: '预计达成时间 (月)',
      totalSaved: '累计存入本金',
      totalInterest: '累计利息收益',
      monthlyRateRequired: '每月需存入',
      monthsToGoal: '所需时间',
      yearsLabel: '年',
      monthsLabel: '个月',
      timeSaved: '时间跨度 (月)',
      projectionTitle: '储蓄增长推演表',
      year: '年份',
      balance: '账户余额',
      copied: '✓ 已复制!',
      copyResult: '复制结果',
      disclaimer: '仅供参考。实际复利可能受存款时间、利率波动等因素影响，请以银行实际结算为准。'
    },
    en: {
      title: 'Savings Goal Calculator',
      subtitle: 'Calculate how much to save monthly or how long to reach your target savings goal with compound interest',
      targetAmount: 'Target Savings Goal',
      initialSavings: 'Initial Balance',
      interestRate: 'Interest Rate (APY %)',
      calcMode: 'Calculation Mode',
      modeMonthly: 'Find Monthly Savings Needed',
      modeDuration: 'Find Time Needed to Reach Goal',
      monthlyContribution: 'Planned Monthly Savings',
      timeToGoal: 'Target Duration (Months)',
      totalSaved: 'Total Principal Saved',
      totalInterest: 'Total Interest Earned',
      monthlyRateRequired: 'Required Monthly Deposit',
      monthsToGoal: 'Time Needed',
      yearsLabel: 'years',
      monthsLabel: 'months',
      timeSaved: 'Duration (Months)',
      projectionTitle: 'Growth Projection Schedule',
      year: 'Year',
      balance: 'Balance',
      copied: '✓ Copied!',
      copyResult: 'Copy Result',
      disclaimer: 'For informational purposes only. Actual compound schedules may vary by bank.'
    },
    es: {
      title: 'Calculadora de Metas de Ahorro',
      subtitle: 'Calcule depósitos mensuales o el tiempo necesario para alcanzar su meta de ahorro con interés compuesto',
      targetAmount: 'Meta de Ahorro',
      initialSavings: 'Saldo Inicial',
      interestRate: 'Tasa de Interés (APY %)',
      calcMode: 'Modo de Cálculo',
      modeMonthly: 'Calcular Depósito Mensual',
      modeDuration: 'Calcular Tiempo Requerido',
      monthlyContribution: 'Ahorro Mensual Planificado',
      timeToGoal: 'Duración Objetivo (Meses)',
      totalSaved: 'Total Principal Ahorrado',
      totalInterest: 'Total Interés Ganado',
      monthlyRateRequired: 'Depósito Mensual Requerido',
      monthsToGoal: 'Tiempo Necesario',
      yearsLabel: 'años',
      monthsLabel: 'meses',
      timeSaved: 'Duración (Meses)',
      projectionTitle: 'Cronograma de Proyección de Crecimiento',
      year: 'Año',
      balance: 'Saldo',
      copied: '✓ ¡Copiado!',
      copyResult: 'Copiar Resultado',
      disclaimer: 'Solo para fines informativos. El cálculo real de interés compuesto puede variar.'
    },
    pt: {
      title: 'Calculadora de Metas de Poupança',
      subtitle: 'Calcule o depósito mensal ou o tempo necessário para alcançar seu objetivo de poupança com juros compostos',
      targetAmount: 'Meta de Poupança',
      initialSavings: 'Saldo Inicial',
      interestRate: 'Taxa de Juros (APY %)',
      calcMode: 'Modo de Cálculo',
      modeMonthly: 'Calcular Aporte Mensal Necessário',
      modeDuration: 'Calcular Tempo para Atingir a Meta',
      monthlyContribution: 'Aporte Mensal Planejado',
      timeToGoal: 'Prazo Alvo (Meses)',
      totalSaved: 'Total de Principal Poupado',
      totalInterest: 'Total de Juros Ganhos',
      monthlyRateRequired: 'Aporte Mensal Requerido',
      monthsToGoal: 'Tempo Necessário',
      yearsLabel: 'anos',
      monthsLabel: 'meses',
      timeSaved: 'Prazo (Meses)',
      projectionTitle: 'Cronograma de Projeção de Crescimento',
      year: 'Ano',
      balance: 'Saldo',
      copied: '✓ Copiado!',
      copyResult: 'Copiar Resultado',
      disclaimer: 'Apenas para fins informativos. As taxas reais de juros compostos podem variar conforme o banco.'
    },
    ja: {
      title: '貯蓄目標管理シミュレーター',
      subtitle: '目標金額を達成するための毎月の積立額や必要な期間を、複利効果を含めて計算',
      targetAmount: '目標貯蓄金額',
      initialSavings: '初期残高 (現在の貯蓄)',
      interestRate: '年利率 (APY %)',
      calcMode: '計算モード',
      modeMonthly: '必要な毎月の積立額を計算',
      modeDuration: '目標達成に必要な期間を計算',
      monthlyContribution: '予定している毎月の積立額',
      timeToGoal: '目標期間 (ヶ月)',
      totalSaved: '積立元本合計',
      totalInterest: '複利獲得利息合計',
      monthlyRateRequired: '必要な毎月の積立額',
      monthsToGoal: '必要な期間',
      yearsLabel: '年',
      monthsLabel: 'ヶ月',
      timeSaved: '期間 (ヶ月)',
      projectionTitle: '貯蓄成長推移表',
      year: '年目',
      balance: '口座残高',
      copied: '✓ コピーしました!',
      copyResult: '結果をコピー',
      disclaimer: '情報提供のみを目的としています。実際の複利計算や金利は銀行により異なる場合があります。'
    },
    fr: {
      title: 'Calculateur d\'Épargne Cible',
      subtitle: 'Calculez l\'épargne mensuelle nécessaire ou le temps requis pour atteindre votre objectif avec intérêts composés',
      targetAmount: 'Objectif d\'Épargne',
      initialSavings: 'Solde Initial',
      interestRate: 'Taux d\'Intérêt (APY %)',
      calcMode: 'Mode de Calcul',
      modeMonthly: 'Trouver l\'Épargne Mensuelle Requise',
      modeDuration: 'Trouver le Temps Requis',
      monthlyContribution: 'Épargne Mensuelle Prévue',
      timeToGoal: 'Durée Cible (Mois)',
      totalSaved: 'Total Épargné (Principal)',
      totalInterest: 'Total Intérêts Gagnés',
      monthlyRateRequired: 'Dépôt Mensuel Requis',
      monthsToGoal: 'Temps Nécessaire',
      yearsLabel: 'ans',
      monthsLabel: 'mois',
      timeSaved: 'Durée (Mois)',
      projectionTitle: 'Calendrier de Projection de Croissance',
      year: 'Année',
      balance: 'Solde',
      copied: '✓ Copié !',
      copyResult: 'Copier le Résultat',
      disclaimer: 'À titre informatif uniquement. Les calculs d\'intérêts peuvent varier selon les établissements.'
    },
    de: {
      title: 'Sparziel-Rechner',
      subtitle: 'Berechnen Sie die monatliche Sparrate oder Zeitdauer zum Erreichen Ihres Sparziels mit Zinseszins',
      targetAmount: 'Sparziel (Betrag)',
      initialSavings: 'Anfangsguthaben',
      interestRate: 'Zinssatz (APY %)',
      calcMode: 'Berechnungsmodus',
      modeMonthly: 'Erforderliche Sparrate berechnen',
      modeDuration: 'Erforderliche Zeitspanne berechnen',
      monthlyContribution: 'Geplante monatliche Sparrate',
      timeToGoal: 'Zielzeitraum (Monate)',
      totalSaved: 'Eingezahltes Eigenkapital',
      totalInterest: 'Erzielter Zinsertrag',
      monthlyRateRequired: 'Erforderliche monatl. Sparrate',
      monthsToGoal: 'Erforderliche Zeit',
      yearsLabel: 'Jahre',
      monthsLabel: 'Monate',
      timeSaved: 'Zeitraum (Monate)',
      projectionTitle: 'Entwicklungsprognose',
      year: 'Jahr',
      balance: 'Kontostand',
      copied: '✓ Kopiert!',
      copyResult: 'Ergebnis kopieren',
      disclaimer: 'Nur zu Informationszwecken. Tatsächliche Zinseszinspläne können bankabhängig abweichen.'
    },
    ar: {
      title: 'حاسبة تحقيق هدف الادخار',
      subtitle: 'حساب مبالغ الادخار الشهري أو الوقت اللازم للوصول إلى هدفك المالي مع الفائدة المركبة',
      targetAmount: 'الهدف المالي للادخار',
      initialSavings: 'الرصيد الأولي الحالي',
      interestRate: 'معدل الفائدة السنوي (APY %)',
      calcMode: 'طريقة الحساب',
      modeMonthly: 'حساب مبلغ الادخار الشهري المطلوب',
      modeDuration: 'حساب الوقت اللازم للوصول للهدف',
      monthlyContribution: 'الادخار الشهري المخطط له',
      timeToGoal: 'المدة المستهدفة للادخار (بالأشهر)',
      totalSaved: 'إجمالي أصل المبلغ المدخر',
      totalInterest: 'إجمالي الأرباح من الفائدة',
      monthlyRateRequired: 'الإيداع الشهري المطلوب',
      monthsToGoal: 'الوقت المطلوب',
      yearsLabel: 'سنوات',
      monthsLabel: 'أشهر',
      timeSaved: 'المدة (أشهر)',
      projectionTitle: 'جدول نمو وتراكم المدخرات',
      year: 'السنة',
      balance: 'رصيد الحساب',
      copied: '✓ تم النسخ!',
      copyResult: 'نسخ النتيجة',
      disclaimer: 'لأغراض إعلامية فقط. قد تختلف جداول الفوائد المركبة الفعلية حسب البنك.'
    },
    ko: {
      title: '목표 저축 계산기',
      subtitle: '목표 금액 달성을 위한 매월 필요 적립액 또는 소요 기간을 복리 이자율을 반영하여 계산',
      targetAmount: '목표 저축 금액',
      initialSavings: '현재 예치금 (시작 금액)',
      interestRate: '연 이자율 (APY %)',
      calcMode: '계산 목표',
      modeMonthly: '필요한 매월 저축액 계산',
      modeDuration: '달성까지 소요 기간 계산',
      monthlyContribution: '계획 중인 매월 저축액',
      timeToGoal: '목표 기간 (개월)',
      totalSaved: '누적 저축 원금',
      totalInterest: '누적 복리 이자 수익',
      monthlyRateRequired: '필요한 매월 저축액',
      monthsToGoal: '소요 기간',
      yearsLabel: '년',
      monthsLabel: '개월',
      timeSaved: '기간 (개월)',
      projectionTitle: '자산 형성 예측표',
      year: '년차',
      balance: '적립 잔액',
      copied: '✓ 복사됨!',
      copyResult: '결과 복사',
      disclaimer: '단순 참고용입니다. 실제 복리 이자는 적립 방식이나 은행의 복리 주기 기준에 따라 다를 수 있습니다.'
    },
    ru: {
      title: 'Калькулятор накоплений и целей',
      subtitle: 'Рассчитайте необходимый ежемесячный взнос или срок для достижения финансовой цели с учетом процентов',
      targetAmount: 'Цель накопления (Сумма)',
      initialSavings: 'Начальный баланс',
      interestRate: 'Процентная ставка (APY %)',
      calcMode: 'Режим расчета',
      modeMonthly: 'Рассчитать ежемесячный взнос',
      modeDuration: 'Рассчитать необходимое время',
      monthlyContribution: 'Планируемый ежемесячный взнос',
      timeToGoal: 'Срок до цели (в месяцах)',
      totalSaved: 'Всего отложено (Основной капитал)',
      totalInterest: 'Всего заработано на процентах',
      monthlyRateRequired: 'Необходимый ежемесячный платеж',
      monthsToGoal: 'Необходимое время',
      yearsLabel: 'лет',
      monthsLabel: 'месяцев',
      timeSaved: 'Срок (в месяцах)',
      projectionTitle: 'Таблица роста накоплений',
      year: 'Год',
      balance: 'Баланс счета',
      copied: '✓ Скопировано!',
      copyResult: 'Скопировать результат',
      disclaimer: 'Только для ознакомления. Фактические схемы начисления процентов могут отличаться.'
    }
  };

  const l = $derived(I18N_BACKUP[locale] || I18N_BACKUP['en']);

  let target = $state('10000');
  let initial = $state('1000');
  let rate = $state('4.5');
  
  let mode = $state('modeMonthly'); // modeMonthly | modeDuration
  let timeMonths = $state('36'); // For modeMonthly: find monthly fee needed
  let monthlyDeposit = $state('250'); // For modeDuration: find months needed

  let currency = $state('USD');
  const currencies = ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY', 'CNY', 'CHF'];
  const symbols: Record<string, string> = { USD: '$', EUR: '€', GBP: '£', CAD: 'CA$', AUD: 'A$', JPY: '¥', CNY: '¥', CHF: 'CHF' };
  const sym = $derived(symbols[currency] ?? currency);

  const stats = $derived((() => {
    const tgt = parseFloat(target) || 0;
    const init = parseFloat(initial) || 0;
    const apr = (parseFloat(rate) || 0) / 100;
    const rMonthly = apr / 12;

    if (tgt <= init || tgt <= 0) return null;

    if (mode === 'modeMonthly') {
      const n = parseInt(timeMonths) || 12;
      if (n <= 0) return null;

      let monthlyRequired = 0;
      if (Math.abs(rMonthly) < 1e-9) {
        monthlyRequired = (tgt - init) / n;
      } else {
        // Standard compound savings formula:
        // Future Value = Initial * (1+r)^n + Monthly * (((1+r)^n - 1) / r) * (1+r)  -- assuming deposit at beginning of month
        // Or if assuming deposit at end of month:
        // Future Value = Initial * (1+r)^n + Monthly * (((1+r)^n - 1) / r)
        // Let's assume deposit at end of month for standard conservative calculation:
        // Monthly = (Target - Initial * (1+r)^n) / (((1+r)^n - 1) / r)
        const compoundFactor = Math.pow(1 + rMonthly, n);
        const annuityFactor = (Math.pow(1 + rMonthly, n) - 1) / rMonthly;
        monthlyRequired = annuityFactor > 0 ? (tgt - init * compoundFactor) / annuityFactor : 0;
      }

      const totalSaved = init + Math.max(0, monthlyRequired) * n;
      const totalInterest = Math.max(0, tgt - totalSaved);

      // Create simple annual projection data
      const projections = [];
      let balance = init;
      for (let i = 1; i <= n; i++) {
        balance = balance * (1 + rMonthly) + Math.max(0, monthlyRequired);
        if (i % 12 === 0 || i === n) {
          projections.push({
            year: Math.ceil(i / 12),
            balance: Math.round(balance)
          });
        }
      }

      return {
        monthlyDeposit: Math.max(0, monthlyRequired),
        duration: n,
        totalSaved,
        totalInterest,
        projections
      };
    } else {
      const dep = parseFloat(monthlyDeposit) || 0;
      if (dep <= 0) return null;

      let n = 0;
      if (Math.abs(rMonthly) < 1e-9) {
        n = (tgt - init) / dep;
      } else {
        // Target = Initial * (1+r)^n + Dep * (((1+r)^n - 1) / r)
        // Target = Initial * (1+r)^n + Dep/r * (1+r)^n - Dep/r
        // Target + Dep/r = (Initial + Dep/r) * (1+r)^n
        // (Target + Dep/r) / (Initial + Dep/r) = (1+r)^n
        // n = ln((Target + Dep/r) / (Initial + Dep/r)) / ln(1+r)
        const numerator = tgt + dep / rMonthly;
        const denominator = init + dep / rMonthly;
        if (denominator > 0 && numerator > denominator) {
          n = Math.log(numerator / denominator) / Math.log(1 + rMonthly);
        } else {
          return null;
        }
      }

      const nRounded = Math.ceil(n);
      const totalSaved = init + dep * nRounded;
      
      // Calculate final actual balance at nRounded months
      let finalBalance = init;
      const projections = [];
      for (let i = 1; i <= nRounded; i++) {
        finalBalance = finalBalance * (1 + rMonthly) + dep;
        if (i % 12 === 0 || i === nRounded) {
          projections.push({
            year: Math.ceil(i / 12),
            balance: Math.round(finalBalance)
          });
        }
      }

      const totalInterest = Math.max(0, finalBalance - totalSaved);

      return {
        monthlyDeposit: dep,
        duration: nRounded,
        totalSaved,
        totalInterest,
        projections
      };
    }
  })());

  function fmt(v: number) {
    return sym + v.toLocaleString(locale, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  }

  let copied = $state(false);
  function copyResult() {
    if (!stats) return;
    const text = `${l.title}\n` +
      `${l.targetAmount}: ${fmt(parseFloat(target) || 0)}\n` +
      `${l.initialSavings}: ${fmt(parseFloat(initial) || 0)}\n` +
      `${l.interestRate}: ${rate}%\n` +
      `${l.monthlyRateRequired}: ${fmt(stats.monthlyDeposit)}/month\n` +
      `${l.monthsToGoal}: ${stats.duration} months (${(stats.duration / 12).toFixed(1)} years)`;

    navigator.clipboard.writeText(text).then(() => {
      copied = true;
      setTimeout(() => copied = false, 1800);
    });
  }
</script>

<div class="bg-stone-950 text-stone-100 p-5 rounded-2xl border border-stone-800 shadow-2xl font-sans min-h-[400px]">
  <!-- Header -->
  <div class="flex items-center gap-3 mb-6">
    <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-amber-700 flex items-center justify-center text-stone-950 font-black text-sm">S</div>
    <div>
      <h2 class="font-extrabold text-lg bg-gradient-to-r from-amber-300 via-amber-100 to-amber-400 bg-clip-text text-transparent leading-tight">{l.title}</h2>
      <p class="text-stone-500 text-xs">{l.subtitle}</p>
    </div>
    <div class="ml-auto">
      <select bind:value={currency} class="bg-stone-800 border border-stone-700 text-stone-200 text-xs rounded-lg px-2 py-1.5 cursor-pointer">
        {#each currencies as c}<option value={c}>{c}</option>{/each}
      </select>
    </div>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
    <!-- Inputs -->
    <div class="space-y-4">
      <!-- Mode select -->
      <div>
        <span class="text-xs text-stone-400 mb-2 block">{l.calcMode}</span>
        <div class="grid grid-cols-2 gap-2 bg-stone-900 p-1 rounded-xl border border-stone-800">
          <button
            onclick={() => mode = 'modeMonthly'}
            class="py-2 text-[10px] md:text-xs font-semibold rounded-lg transition-all {mode === 'modeMonthly' ? 'bg-amber-600 text-stone-950 shadow-md' : 'text-stone-400 hover:text-stone-200'}">
            {l.modeMonthly.split(' ')[1] || 'Deposit'}
          </button>
          <button
            onclick={() => mode = 'modeDuration'}
            class="py-2 text-[10px] md:text-xs font-semibold rounded-lg transition-all {mode === 'modeDuration' ? 'bg-amber-600 text-stone-950 shadow-md' : 'text-stone-400 hover:text-stone-200'}">
            {l.modeDuration.split(' ')[1] || 'Duration'}
          </button>
        </div>
      </div>

      <!-- Target and Initial -->
      <div class="grid grid-cols-2 gap-3">
        <label class="block">
          <span class="text-xs text-stone-400 mb-1 block">{l.targetAmount}</span>
          <input type="number" bind:value={target} min="1" step="1000"
            class="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-2 text-sm text-stone-100 focus:border-amber-500 focus:outline-none transition-colors" />
        </label>
        <label class="block">
          <span class="text-xs text-stone-400 mb-1 block">{l.initialSavings}</span>
          <input type="number" bind:value={initial} min="0" step="100"
            class="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-2 text-sm text-stone-100 focus:border-amber-500 focus:outline-none transition-colors" />
        </label>
      </div>

      <!-- APY and mode-specific input -->
      <div class="grid grid-cols-2 gap-3">
        <label class="block">
          <span class="text-xs text-stone-400 mb-1 block">{l.interestRate}</span>
          <input type="number" bind:value={rate} min="0" max="50" step="0.1"
            class="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-2 text-sm text-stone-100 focus:border-amber-500 focus:outline-none transition-colors" />
        </label>

        {#if mode === 'modeMonthly'}
          <label class="block">
            <span class="text-xs text-stone-400 mb-1 block">{l.timeToGoal}</span>
            <input type="number" bind:value={timeMonths} min="1" step="1"
              class="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-2 text-sm text-stone-100 focus:border-amber-500 focus:outline-none transition-colors" />
          </label>
        {:else}
          <label class="block">
            <span class="text-xs text-stone-400 mb-1 block">{l.monthlyContribution}</span>
            <input type="number" bind:value={monthlyDeposit} min="1" step="10"
              class="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-2 text-sm text-stone-100 focus:border-amber-500 focus:outline-none transition-colors" />
          </label>
        {/if}
      </div>
    </div>

    <!-- Results -->
    <div class="space-y-4">
      {#if stats}
        <div class="rounded-xl p-4 bg-amber-950/30 border border-amber-800/50 text-center">
          {#if mode === 'modeMonthly'}
            <p class="text-xs text-stone-400 mb-1">{l.monthlyRateRequired}</p>
            <p class="text-4xl font-black text-amber-400">{fmt(stats.monthlyDeposit)}</p>
            <p class="text-xs text-stone-500 mt-1">/ month for {stats.duration} months</p>
          {:else}
            <p class="text-xs text-stone-400 mb-1">{l.monthsToGoal}</p>
            <p class="text-4xl font-black text-amber-400">
              {Math.floor(stats.duration / 12) > 0 ? `${Math.floor(stats.duration / 12)} ${l.yearsLabel} ` : ''}
              {stats.duration % 12} {l.monthsLabel}
            </p>
            <p class="text-xs text-stone-500 mt-1">Total: {stats.duration} months</p>
          {/if}
        </div>

        <div class="grid grid-cols-2 gap-2 text-center">
          <div class="bg-stone-900 rounded-xl p-3 border border-stone-800">
            <p class="text-xs text-stone-500">{l.totalSaved}</p>
            <p class="text-amber-300 font-extrabold text-lg mt-1">{fmt(stats.totalSaved)}</p>
          </div>
          <div class="bg-stone-900 rounded-xl p-3 border border-stone-800">
            <p class="text-xs text-stone-500">{l.totalInterest}</p>
            <p class="text-emerald-400 font-extrabold text-lg mt-1">{fmt(stats.totalInterest)}</p>
          </div>
        </div>

        <!-- Projections table -->
        {#if stats.projections.length > 0}
          <div class="bg-stone-900 rounded-xl p-3 border border-stone-800">
            <p class="text-xs text-stone-500 mb-2">{l.projectionTitle}</p>
            <div class="max-h-[120px] overflow-y-auto space-y-1 pr-1">
              {#each stats.projections as p}
                <div class="flex justify-between items-center text-xs py-1 border-b border-stone-800/50 last:border-0">
                  <span class="text-stone-400">{l.year} {p.year}</span>
                  <span class="font-bold text-amber-300">{fmt(p.balance)}</span>
                </div>
              {/each}
            </div>
          </div>
        {/if}

        <button onclick={copyResult}
          class="w-full py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 {copied ? 'bg-emerald-700 text-white' : 'bg-amber-600 hover:bg-amber-500 text-stone-950'}">
          {copied ? l.copied : l.copyResult}
        </button>
      {:else}
        <div class="flex flex-col items-center justify-center h-48 text-stone-500">
          <span class="text-4xl mb-3">🎯</span>
          <p class="text-sm">Enter details and target savings goal to calculate</p>
        </div>
      {/if}
    </div>
  </div>
  <p class="text-xs text-stone-600 mt-6 text-center">{l.disclaimer}</p>
</div>
