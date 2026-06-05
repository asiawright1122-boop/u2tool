<script lang="ts">
  interface Props {
    locale?: string;
    translations?: Record<string, unknown>;
  }

  let { locale = 'en', translations = {} }: Props = $props();

  const I18N_BACKUP: Record<string, Record<string, string>> = {
    zh: {
      title: '债务雪球与雪崩理财计算器',
      subtitle: '制定科学的还债计划。支持雪球法（优先偿还小额）与雪崩法（优先偿还高息）对比分析',
      addDebt: '添加债务',
      debtName: '债务名称',
      balance: '债务余额',
      interestRate: '年利率 (%)',
      minPayment: '每月最低还款额',
      extraPayment: '每月额外还款预算',
      strategy: '还款策略',
      snowball: '债务雪球法 (余额从小到大)',
      avalanche: '债务雪崩法 (利率从高到低)',
      resultsTitle: '还款预测分析',
      totalDebt: '债务总额',
      monthsToPayoff: '全部清偿所需时间',
      totalInterest: '累计支付利息',
      monthlyBudget: '每月总还款预算',
      debtListTitle: '我的债务列表',
      payoffTimeline: '清偿时间轴',
      monthsLabel: '个月',
      copied: '✓ 已复制!',
      copyResult: '复制结果',
      disclaimer: '仅供参考。还款模拟未考虑各家银行罚息、复利周期和其它违约条款，实际请以银行对账单为准。'
    },
    en: {
      title: 'Debt Snowball & Avalanche Calculator',
      subtitle: 'Create a plan to pay off debt. Compare Debt Snowball (lowest balance first) and Debt Avalanche (highest interest first)',
      addDebt: 'Add Debt',
      debtName: 'Debt Name',
      balance: 'Balance',
      interestRate: 'Interest Rate (%)',
      minPayment: 'Min Payment',
      extraPayment: 'Extra Monthly Budget',
      strategy: 'Payment Strategy',
      snowball: 'Debt Snowball (Lowest Balance First)',
      avalanche: 'Debt Avalanche (Highest Interest First)',
      resultsTitle: 'Payoff Projections',
      totalDebt: 'Total Debt',
      monthsToPayoff: 'Time to Pay Off',
      totalInterest: 'Total Interest Paid',
      monthlyBudget: 'Total Monthly Budget',
      debtListTitle: 'Debts List',
      payoffTimeline: 'Payoff Timeline',
      monthsLabel: 'months',
      copied: '✓ Copied!',
      copyResult: 'Copy Result',
      disclaimer: 'For informational purposes only. Calculation does not account for compounding details or penalties.'
    },
    es: {
      title: 'Calculadora de Bola de Nieve y Avalancha de Deudas',
      subtitle: 'Cree un plan para pagar sus deudas. Compare Bola de Nieve (saldo más bajo) y Avalancha (interés más alto)',
      addDebt: 'Añadir Deuda',
      debtName: 'Nombre de la Deuda',
      balance: 'Saldo',
      interestRate: 'Tasa de Interés (%)',
      minPayment: 'Pago Mínimo',
      extraPayment: 'Presupuesto Mensual Extra',
      strategy: 'Estrategia de Pago',
      snowball: 'Bola de Nieve (Saldo más bajo primero)',
      avalanche: 'Avalancha de Deuda (Interés más alto primero)',
      resultsTitle: 'Proyecciones de Pago',
      totalDebt: 'Deuda Total',
      monthsToPayoff: 'Tiempo de Pago',
      totalInterest: 'Total de Intereses Pagados',
      monthlyBudget: 'Presupuesto Mensual Total',
      debtListTitle: 'Lista de Deudas',
      payoffTimeline: 'Línea de Tiempo de Pago',
      monthsLabel: 'meses',
      copied: '✓ ¡Copiado!',
      copyResult: 'Copiar Resultado',
      disclaimer: 'Solo para fines informativos. La simulación puede no considerar todas las penalizaciones.'
    },
    pt: {
      title: 'Calculadora de Bola de Neve e Avalanche de Dívidas',
      subtitle: 'Crie um plano de pagamento. Compare Bola de Neve (menor saldo) e Avalanche (maior juro)',
      addDebt: 'Adicionar Dívida',
      debtName: 'Nome da Dívida',
      balance: 'Saldo',
      interestRate: 'Taxa de Juros (%)',
      minPayment: 'Pagamento Mínimo',
      extraPayment: 'Orçamento Mensal Extra',
      strategy: 'Estratégia de Pagamento',
      snowball: 'Bola de Neve (Menor saldo primeiro)',
      avalanche: 'Avalanche de Dívida (Maior juro primeiro)',
      resultsTitle: 'Projeções de Pagamento',
      totalDebt: 'Dívida Total',
      monthsToPayoff: 'Tempo de Pagamento',
      totalInterest: 'Total de Juros Pagos',
      monthlyBudget: 'Orçamento Mensal Total',
      debtListTitle: 'Lista de Dívidas',
      payoffTimeline: 'Linha de Tempo de Pagamento',
      monthsLabel: 'meses',
      copied: '✓ Copiado!',
      copyResult: 'Copiar Resultado',
      disclaimer: 'Apenas para fins informativos. A simulação pode variar de acordo com as taxas reais.'
    },
    ja: {
      title: '債務返済シミュレーター (雪だるま式 vs アバランチ式)',
      subtitle: '最適な債務返済計画を作成。雪だるま式（残高最小優先）とアバランチ式（金利最高優先）の比較',
      addDebt: '債務を追加',
      debtName: '債務の名前',
      balance: '残高',
      interestRate: '年利 (%)',
      minPayment: '最低返済額/月',
      extraPayment: '追加返済予算/月',
      strategy: '返済戦略',
      snowball: 'スノーボール法 (残高の少ない順)',
      avalanche: 'アバランチ法 (金利の高い順)',
      resultsTitle: '返済推計値',
      totalDebt: '負債総額',
      monthsToPayoff: '完済までの期間',
      totalInterest: '支払利息合計',
      monthlyBudget: '返済総予算/月',
      debtListTitle: '債務一覧',
      payoffTimeline: '完済タイムライン',
      monthsLabel: 'ヶ月',
      copied: '✓ コピーしました!',
      copyResult: '結果をコピー',
      disclaimer: '情報提供のみを目的としています。実際の返済は各金融機関の約定に基づきます。'
    },
    fr: {
      title: 'Calculateur de Remboursement de Dettes',
      subtitle: 'Comparez la méthode Boule de Neige (solde plus bas d\'abord) et Avalanche (intérêt plus élevé)',
      addDebt: 'Ajouter une Dette',
      debtName: 'Nom de la Dette',
      balance: 'Solde',
      interestRate: 'Taux d\'Intérêt (%)',
      minPayment: 'Paiement Minimum',
      extraPayment: 'Budget Mensuel Supplémentaire',
      strategy: 'Stratégie de Paiement',
      snowball: 'Boule de Neige (Solde le plus bas en premier)',
      avalanche: 'Avalanche de Dette (Intérêt le plus élevé en premier)',
      resultsTitle: 'Projections de Remboursement',
      totalDebt: 'Dette Totale',
      monthsToPayoff: 'Temps pour Tout Rembourser',
      totalInterest: 'Total des Intérêts Payés',
      monthlyBudget: 'Budget Mensuel Total',
      debtListTitle: 'Liste des Dettes',
      payoffTimeline: 'Chronologie des Remboursements',
      monthsLabel: 'mois',
      copied: '✓ Copié !',
      copyResult: 'Copier le Résultat',
      disclaimer: 'À titre informatif uniquement. Les calculs ne tiennent pas compte de toutes les pénalités.'
    },
    de: {
      title: 'Schuldenschneeball- & Lawinenrechner',
      subtitle: 'Erstellen Sie einen Tilgungsplan. Vergleichen Sie Schneeball (kleinste Schuld zuerst) und Lawine (höchste Zinsen zuerst)',
      addDebt: 'Schuld hinzufügen',
      debtName: 'Bezeichnung',
      balance: 'Restschuld',
      interestRate: 'Zinssatz (%)',
      minPayment: 'Mindestrate',
      extraPayment: 'Zusätzliches Monatsbudget',
      strategy: 'Tilgungsstrategie',
      snowball: 'Schneeball-Methode (Kleinster Betrag zuerst)',
      avalanche: 'Lawinen-Methode (Höchster Zinssatz zuerst)',
      resultsTitle: 'Tilgungsprognosen',
      totalDebt: 'Gesamtschulden',
      monthsToPayoff: 'Zeit bis zur Schuldenfreiheit',
      totalInterest: 'Gezahlte Zinsen gesamt',
      monthlyBudget: 'Monatliches Gesamtbudget',
      debtListTitle: 'Schuldenliste',
      payoffTimeline: 'Tilgungsverlauf',
      monthsLabel: 'Monate',
      copied: '✓ Kopiert!',
      copyResult: 'Ergebnis kopieren',
      disclaimer: 'Nur zu Informationszwecken. Zinseszinsen oder Strafgebühren werden nicht voll abgebildet.'
    },
    ar: {
      title: 'حاسبة كرة الثلج والانهيار لسداد الديون',
      subtitle: 'خطط لسداد الديون وقارن بين طريقة كرة الثلج (الرصيد الأصغر أولاً) وطريقة الانهيار (الفائدة الأعلى أولاً)',
      addDebt: 'إضافة دين',
      debtName: 'اسم الدين',
      balance: 'الرصيد المستحق',
      interestRate: 'نسبة الفائدة (%)',
      minPayment: 'الحد الأدنى للدفع',
      extraPayment: 'ميزانية دفع إضافية شهرياً',
      strategy: 'استراتيجية السداد',
      snowball: 'كرة ثلج الديون (الرصيد الأصغر أولاً)',
      avalanche: 'انهيار الديون (الفائدة الأعلى أولاً)',
      resultsTitle: 'توقعات السداد',
      totalDebt: 'إجمالي الديون',
      monthsToPayoff: 'الوقت اللازم لل完済',
      totalInterest: 'إجمالي الفوائد المدفوعة',
      monthlyBudget: 'الميزانية الشهرية الإجمالية',
      debtListTitle: 'قائمة الديون',
      payoffTimeline: 'الجدول الزمني للسداد',
      monthsLabel: 'أشهر',
      copied: '✓ تم النسخ!',
      copyResult: 'نسخ النتيجة',
      disclaimer: 'لأغراض إعلامية فقط. قد لا تشمل التوقعات كافة الغرامات أو جداول تراكم الفوائد.'
    },
    ko: {
      title: '빚 탕감 계획 계산기 (눈굴리기 vs 산사태)',
      subtitle: '체계적인 부채 상환 계획 수립. 눈굴리기(잔액 최소 우선) 및 산사태(이율 최고 우선) 방법 비교',
      addDebt: '부채 추가',
      debtName: '부채 명칭',
      balance: '남은 잔액',
      interestRate: '연 이자율 (%)',
      minPayment: '월 최소 상환액',
      extraPayment: '월 추가 상환 예산',
      strategy: '상환 전략',
      snowball: '눈굴리기법 (부채 잔액이 작은 것부터 상환)',
      avalanche: '산사태법 (이자율이 높은 것부터 상환)',
      resultsTitle: '부채 상환 예측',
      totalDebt: '총 부채액',
      monthsToPayoff: '완제까지 소요 기간',
      totalInterest: '총 지출 이자',
      monthlyBudget: '월 총 상환 예산',
      debtListTitle: '내 부채 내역',
      payoffTimeline: '부채 청산 타임라인',
      monthsLabel: '개월',
      copied: '✓ 복사됨!',
      copyResult: '결과 복사',
      disclaimer: '단순 참고용입니다. 연체 이자율이나 은행별 상환 수수료 조건은 고려하지 않은 모의 예측치입니다.'
    },
    ru: {
      title: 'Долговой калькулятор (Снежный ком vs Лавина)',
      subtitle: 'Создайте план выплаты долгов. Сравните методы "Снежного кома" (меньший баланс) и "Лавины" (высокий процент)',
      addDebt: 'Добавить долг',
      debtName: 'Название долга',
      balance: 'Остаток долга',
      interestRate: 'Процентная ставка (%)',
      minPayment: 'Мин. платеж',
      extraPayment: 'Дополнительный бюджет в месяц',
      strategy: 'Стратегия выплаты',
      snowball: 'Снежный ком (Сначала меньший баланс)',
      avalanche: 'Лавина (Сначала высокий процент)',
      resultsTitle: 'Прогноз выплаты',
      totalDebt: 'Сумма всех долгов',
      monthsToPayoff: 'Срок выплаты',
      totalInterest: 'Всего переплаты по процентам',
      monthlyBudget: 'Общий бюджет в месяц',
      debtListTitle: 'Список долгов',
      payoffTimeline: 'Временная шкала выплаты',
      monthsLabel: 'месяцев',
      copied: '✓ Скопировано!',
      copyResult: 'Скопировать результат',
      disclaimer: 'Только для ознакомления. Симуляция может не учитывать все пени или особенности начисления.'
    }
  };

  const l = $derived(I18N_BACKUP[locale] || I18N_BACKUP['en']);

  interface DebtItem {
    id: string;
    name: string;
    balance: string;
    rate: string;
    minPay: string;
  }

  let debts = $state<DebtItem[]>([
    { id: '1', name: 'Credit Card A', balance: '3000', rate: '18', minPay: '90' },
    { id: '2', name: 'Student Loan', balance: '12000', rate: '6', minPay: '150' },
    { id: '3', name: 'Car Loan', balance: '8000', rate: '8', minPay: '200' }
  ]);

  let extraBudget = $state('200');
  let selectedStrategy = $state('snowball'); // snowball | avalanche
  let currency = $state('USD');

  const currencies = ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY', 'CNY', 'CHF'];
  const symbols: Record<string, string> = { USD: '$', EUR: '€', GBP: '£', CAD: 'CA$', AUD: 'A$', JPY: '¥', CNY: '¥', CHF: 'CHF' };
  const sym = $derived(symbols[currency] ?? currency);

  function addDebtRow() {
    debts = [...debts, {
      id: Date.now().toString(),
      name: `Debt ${debts.length + 1}`,
      balance: '1000',
      rate: '10',
      minPay: '50'
    }];
  }

  function removeDebtRow(id: string) {
    debts = debts.filter(item => item.id !== id);
  }

  // Calculate Amortization loop
  const simulation = $derived((() => {
    // Validate inputs
    const activeDebts = debts.map(d => {
      const bal = parseFloat(d.balance) || 0;
      const rate = parseFloat(d.rate) || 0;
      const min = parseFloat(d.minPay) || 0;
      return {
        id: d.id,
        name: d.name || 'Unnamed Debt',
        balance: bal,
        rate: rate,
        min: min,
        monthlyInterest: (rate / 100) / 12
      };
    }).filter(d => d.balance > 0);

    if (activeDebts.length === 0) return null;

    const totalMinPay = activeDebts.reduce((sum, d) => sum + d.min, 0);
    const extra = parseFloat(extraBudget) || 0;
    const totalMonthlyBudget = totalMinPay + extra;

    const totalDebtAmount = activeDebts.reduce((sum, d) => sum + d.balance, 0);

    // Amortize copy
    let workingDebts = activeDebts.map(d => ({ ...d }));
    let months = 0;
    let accumulatedInterest = 0;
    const timelineEvents: Array<{ month: number; debtId: string; debtName: string; remainingDebtsCount: number }> = [];
    
    // Sort logic depending on strategy
    const sortDebts = () => {
      if (selectedStrategy === 'snowball') {
        // Sort lowest balance first
        workingDebts.sort((a, b) => a.balance - b.balance);
      } else {
        // Avalanche: highest interest rate first
        workingDebts.sort((a, b) => b.rate - a.rate);
      }
    };

    // Cap loop to prevent infinite loops (e.g. if interest exceeds payments)
    const MAX_MONTHS = 600; // 50 years

    while (workingDebts.some(d => d.balance > 0) && months < MAX_MONTHS) {
      months++;
      sortDebts();

      // 1. Accumulate interest & check if payment is sufficient
      let monthlyInterestCharges = 0;
      for (const d of workingDebts) {
        if (d.balance > 0) {
          const interest = d.balance * d.monthlyInterest;
          d.balance += interest;
          accumulatedInterest += interest;
          monthlyInterestCharges += interest;
        }
      }

      if (monthlyInterestCharges >= totalMonthlyBudget) {
        // Interest charges exceed total payment. Debt will never be paid off.
        return { infinite: true, totalDebt: totalDebtAmount, totalMonthlyBudget };
      }

      // 2. Pay minimums
      let extraSnowballPool = extra;
      for (const d of workingDebts) {
        if (d.balance > 0) {
          const minPay = Math.min(d.balance, d.min);
          d.balance -= minPay;
          if (d.balance === 0) {
            // Debt cleared!
            extraSnowballPool += (d.min - minPay);
            timelineEvents.push({ month: months, debtId: d.id, debtName: d.name, remainingDebtsCount: workingDebts.filter(item => item.balance > 0).length });
          }
        }
      }

      // 3. Roll extra budget & snowball pool into the target debt according to strategy
      if (extraSnowballPool > 0) {
        for (const d of workingDebts) {
          if (d.balance > 0) {
            const pay = Math.min(d.balance, extraSnowballPool);
            d.balance -= pay;
            extraSnowballPool -= pay;
            if (d.balance === 0) {
              timelineEvents.push({ month: months, debtId: d.id, debtName: d.name, remainingDebtsCount: workingDebts.filter(item => item.balance > 0).length });
            }
            if (extraSnowballPool <= 0) break;
          }
        }
      }
    }

    return {
      infinite: false,
      totalDebt: totalDebtAmount,
      totalMonthlyBudget,
      months,
      totalInterest: accumulatedInterest,
      timelineEvents: timelineEvents.filter((event, index, self) =>
        self.findIndex(e => e.debtId === event.debtId) === index // De-duplicate payoff events
      )
    };
  })());

  function fmt(v: number) {
    return sym + v.toLocaleString(locale, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  }

  let copied = $state(false);
  function copyResult() {
    if (!simulation) return;
    let text = `${l.title}\n` +
      `${l.totalDebt}: ${fmt(simulation.totalDebt)}\n` +
      `${l.monthlyBudget}: ${fmt(simulation.totalMonthlyBudget)}\n`;

    if (simulation.infinite) {
      text += `Calculation Error: Interest charges exceed monthly budget payment. Please increase payment budget.`;
    } else {
      text += `${l.monthsToPayoff}: ${simulation.months} ${l.monthsLabel}\n` +
        `${l.totalInterest}: ${fmt(simulation.totalInterest)}`;
    }

    navigator.clipboard.writeText(text).then(() => {
      copied = true;
      setTimeout(() => copied = false, 1800);
    });
  }
</script>

<div class="bg-stone-950 text-stone-100 p-5 rounded-2xl border border-stone-800 shadow-2xl font-sans min-h-[400px] select-none">
  <!-- Header -->
  <div class="flex items-center gap-3 mb-6">
    <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-amber-700 flex items-center justify-center text-stone-950 font-black text-sm">D</div>
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

  <div class="grid grid-cols-1 lg:grid-cols-12 gap-5">
    <!-- Debts Input Panel -->
    <div class="lg:col-span-7 space-y-4">
      <div class="flex justify-between items-center">
        <h3 class="text-sm font-bold text-amber-300">{l.debtListTitle}</h3>
        <button onclick={addDebtRow} class="px-3 py-1 bg-amber-600 hover:bg-amber-500 text-stone-950 rounded-lg text-xs font-semibold transition-all">
          + {l.addDebt}
        </button>
      </div>

      <!-- Scrollable container for debts list -->
      <div class="space-y-2 max-h-[300px] overflow-y-auto pr-1">
        {#each debts as debt (debt.id)}
          <div class="grid grid-cols-12 gap-2 bg-stone-900/50 p-2.5 rounded-xl border border-stone-800/80 items-center">
            <div class="col-span-3">
              <input type="text" bind:value={debt.name} placeholder="Debt name"
                class="w-full bg-stone-900 border border-stone-800 rounded-lg px-2 py-1 text-xs text-stone-100 focus:border-amber-500 focus:outline-none" />
            </div>
            <div class="col-span-3 relative">
              <span class="absolute left-1.5 top-1.5 text-stone-600 text-[10px]">{sym}</span>
              <input type="number" bind:value={debt.balance} placeholder="Balance" min="0"
                class="w-full bg-stone-900 border border-stone-800 rounded-lg pl-5 pr-1 py-1 text-xs text-stone-100 focus:border-amber-500 focus:outline-none" />
            </div>
            <div class="col-span-2">
              <input type="number" bind:value={debt.rate} placeholder="APY%" min="0" max="100" step="0.1"
                class="w-full bg-stone-900 border border-stone-800 rounded-lg px-1.5 py-1 text-xs text-stone-100 focus:border-amber-500 focus:outline-none text-center" />
            </div>
            <div class="col-span-3 relative">
              <span class="absolute left-1.5 top-1.5 text-stone-600 text-[10px]">{sym}</span>
              <input type="number" bind:value={debt.minPay} placeholder="Min payment" min="0"
                class="w-full bg-stone-900 border border-stone-800 rounded-lg pl-5 pr-1 py-1 text-xs text-stone-100 focus:border-amber-500 focus:outline-none" />
            </div>
            <div class="col-span-1 text-center">
              <button onclick={() => removeDebtRow(debt.id)} class="text-red-500 hover:text-red-400 font-bold text-sm">
                ✕
              </button>
            </div>
          </div>
        {/each}
      </div>

      <div class="grid grid-cols-2 gap-3 border-t border-stone-900 pt-3">
        <label class="block">
          <span class="text-xs text-stone-400 mb-1 block">{l.extraPayment}</span>
          <div class="relative">
            <span class="absolute left-3 top-2.5 text-stone-500 text-sm">{sym}</span>
            <input type="number" bind:value={extraBudget} min="0" step="10"
              class="w-full bg-stone-900 border border-stone-700 rounded-lg pl-8 pr-3 py-2 text-sm text-stone-100 focus:border-amber-500 focus:outline-none" />
          </div>
        </label>
        <div>
          <span class="text-xs text-stone-400 mb-1.5 block">{l.strategy}</span>
          <select bind:value={selectedStrategy} class="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-2 text-sm text-stone-100 focus:border-amber-500 focus:outline-none cursor-pointer">
            <option value="snowball">{l.snowball.split(' ')[0]}</option>
            <option value="avalanche">{l.avalanche.split(' ')[0]}</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Results Panel -->
    <div class="lg:col-span-5 space-y-4">
      {#if simulation}
        {#if simulation.infinite}
          <div class="rounded-xl p-4 bg-red-950/30 border border-red-800/50 text-center text-xs text-red-400">
            <p class="font-bold mb-1">Payment is too low!</p>
            <p>Your monthly budget payout cannot cover the accruing monthly interest charges. Please increase your extra payment budget.</p>
          </div>
        {:else}
          <h3 class="text-sm font-bold text-amber-300">{l.resultsTitle}</h3>
          
          <div class="rounded-xl p-4 bg-amber-950/30 border border-amber-800/50 text-center">
            <p class="text-xs text-stone-400 mb-1">{l.monthsToPayoff}</p>
            <p class="text-4xl font-black text-amber-400">
              {Math.floor(simulation.months / 12) > 0 ? `${Math.floor(simulation.months / 12)}年` : ''}
              {simulation.months % 12} {l.monthsLabel}
            </p>
            <p class="text-[10px] text-stone-500 mt-1">Total: {simulation.months} months</p>
          </div>

          <div class="grid grid-cols-2 gap-2 text-center text-xs">
            <div class="bg-stone-900 rounded-xl p-3 border border-stone-800">
              <p class="text-stone-500">{l.totalDebt}</p>
              <p class="text-amber-300 font-extrabold text-sm mt-1">{fmt(simulation.totalDebt)}</p>
            </div>
            <div class="bg-stone-900 rounded-xl p-3 border border-stone-800">
              <p class="text-stone-500">{l.totalInterest}</p>
              <p class="text-red-400 font-extrabold text-sm mt-1">{fmt(simulation.totalInterest)}</p>
            </div>
          </div>

          <!-- Timeline schedule -->
          {#if simulation.timelineEvents.length > 0}
            <div class="bg-stone-900 rounded-xl p-3 border border-stone-800 space-y-2">
              <p class="text-xs text-stone-500 font-bold">{l.payoffTimeline}</p>
              <div class="max-h-[120px] overflow-y-auto space-y-1.5 pr-1">
                {#each simulation.timelineEvents as e}
                  <div class="flex justify-between items-center text-[10px] py-1 border-b border-stone-850 last:border-0">
                    <span class="text-stone-400">Month {e.month} ({e.debtName})</span>
                    <span class="font-bold text-emerald-400">PAID OFF</span>
                  </div>
                {/each}
              </div>
            </div>
          {/if}

          <button onclick={copyResult}
            class="w-full py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 {copied ? 'bg-emerald-700 text-white' : 'bg-amber-600 hover:bg-amber-500 text-stone-950'}">
            {copied ? l.copied : l.copyResult}
          </button>
        {/if}
      {:else}
        <div class="flex flex-col items-center justify-center h-48 text-stone-500">
          <span class="text-4xl mb-3">🏔️</span>
          <p class="text-sm">Add one or more debts to generate your payment strategy timeline</p>
        </div>
      {/if}
    </div>
  </div>
  <p class="text-xs text-stone-600 mt-6 text-center">{l.disclaimer}</p>
</div>
