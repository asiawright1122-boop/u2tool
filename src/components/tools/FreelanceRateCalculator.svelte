<script lang="ts">
  interface Props {
    locale?: string;
    translations?: Record<string, unknown>;
  }

  let { locale = 'en', translations = {} }: Props = $props();

  const I18N_BACKUP: Record<string, Record<string, string>> = {
    zh: {
      title: '自由职业时薪/日薪计算器',
      subtitle: '根据期望年收入、运营成本及税率，反推你的合理时薪与日薪报价',
      targetIncome: '期望年净收入 (税后/纯利)',
      businessExpenses: '年度运营成本 (软件、硬件等)',
      taxRate: '预估所得税税率 (%)',
      billableWeeks: '每年可计费工作周数 (除去休假)',
      billableHours: '每周可计费工时 (实际计费时间)',
      grossTarget: '年度总营业额目标 (含税费成本)',
      totalExpenses: '总成本支出 (成本+税)',
      hourlyRate: '推荐每小时收费报价 (时薪)',
      dailyRate: '推荐每日收费报价 (日薪)',
      expenseTax: '运营成本 & 所得税',
      billableTitle: '时间利用效率',
      calculatedRates: '推荐报价方案',
      weeklyBillable: '计费工时/周',
      daysPerWeek: '天/周',
      copied: '✓ 已复制!',
      copyResult: '复制结果',
      disclaimer: '仅供参考。自由职业定价还应结合市场竞争与个人资历经验，请勿作为唯一报价依据。'
    },
    en: {
      title: 'Freelance Rate Calculator',
      subtitle: 'Calculate target hourly and daily freelance rates based on income goals, expenses, and taxes',
      targetIncome: 'Desired Annual Net Income',
      businessExpenses: 'Annual Business Expenses',
      taxRate: 'Estimated Tax Rate (%)',
      billableWeeks: 'Billable Weeks per Year',
      billableHours: 'Billable Hours per Week',
      grossTarget: 'Annual Gross Income Target',
      totalExpenses: 'Total Expenses & Taxes',
      hourlyRate: 'Required Hourly Rate',
      dailyRate: 'Required Daily Rate',
      expenseTax: 'Expenses & Taxes',
      billableTitle: 'Time Allocation',
      calculatedRates: 'Recommended Target Rates',
      weeklyBillable: 'Hours/Week',
      daysPerWeek: 'days/week',
      copied: '✓ Copied!',
      copyResult: 'Copy Result',
      disclaimer: 'For informational purposes only. Rates do not guarantee contracts or match market value.'
    },
    es: {
      title: 'Calculadora de Tarifas para Freelance',
      subtitle: 'Calcule tarifas por hora y día en función de metas de ingresos, gastos e impuestos',
      targetIncome: 'Ingresos Netos Anuales Deseados',
      businessExpenses: 'Gastos Comerciales Anuales',
      taxRate: 'Tasa Impositiva Estimada (%)',
      billableWeeks: 'Semanas Facturables al Año',
      billableHours: 'Horas Facturables por Semana',
      grossTarget: 'Meta de Ingresos Brutos Anuales',
      totalExpenses: 'Gastos e Impuestos Totales',
      hourlyRate: 'Tarifa por Hora Requerida',
      dailyRate: 'Tarifa Diaria Requerida',
      expenseTax: 'Gastos e Impuestos',
      billableTitle: 'Asignación de Tiempo',
      calculatedRates: 'Tarifas Objetivo Recomendadas',
      weeklyBillable: 'Horas/Semana',
      daysPerWeek: 'días/semana',
      copied: '✓ ¡Copiado!',
      copyResult: 'Copiar Resultado',
      disclaimer: 'Solo para fines informativos. Las tarifas dependen de las condiciones del mercado.'
    },
    pt: {
      title: 'Calculadora de Tarifas para Freelancer',
      subtitle: 'Calcule suas taxas horárias e diárias ideais com base em metas, despesas e impostos',
      targetIncome: 'Renda Líquida Anual Desejada',
      businessExpenses: 'Despesas Anuais de Negócios',
      taxRate: 'Alíquota de Imposto Estimada (%)',
      billableWeeks: 'Semanas Faturáveis por Ano',
      billableHours: 'Horas Faturáveis por Semana',
      grossTarget: 'Meta de Renda Bruta Anual',
      totalExpenses: 'Despesas e Impostos Totais',
      hourlyRate: 'Tarifa Horária Necessária',
      dailyRate: 'Tarifa Diária Necessária',
      expenseTax: 'Despesas e Impostos',
      billableTitle: 'Alocação de Tempo',
      calculatedRates: 'Tarifas de Meta Recomendadas',
      weeklyBillable: 'Horas/Semana',
      daysPerWeek: 'dias/semana',
      copied: '✓ Copiado!',
      copyResult: 'Copiar Resultado',
      disclaimer: 'Apenas para fins informativos. As tarifas dependem do mercado e da sua experiência.'
    },
    ja: {
      title: 'フリーランス報酬単価計算ツール',
      subtitle: '希望の年収、経費、税金、および稼働時間から、目標とする時給と日給を逆算',
      targetIncome: '希望の年間手取り額（税後純利）',
      businessExpenses: '年間の事業運営経費（PC・ソフト・保険等）',
      taxRate: '想定所得税率 (%)',
      billableWeeks: '年間稼働可能週数（祝休日を除く）',
      billableHours: '週あたり請求可能（実働）時間',
      grossTarget: '必要年間総売上目標',
      totalExpenses: '総支出（経費＋税金）',
      hourlyRate: '推奨時間単価（時給）',
      dailyRate: '推奨日当単価（日給）',
      expenseTax: '運営経費 ＆ 所得税',
      billableTitle: '時間管理効率',
      calculatedRates: '推奨単価プラン',
      weeklyBillable: '実働時間/週',
      daysPerWeek: '日/週',
      copied: '✓ コピーしました!',
      copyResult: '結果をコピー',
      disclaimer: '情報提供のみを目的としています。実際の受注価格は市場水準や実績、競合関係を考慮して決定してください。'
    },
    fr: {
      title: 'Calculateur de Taux Freelance',
      subtitle: 'Calculez vos tarifs horaires et journaliers cibles selon vos objectifs, frais et taxes',
      targetIncome: 'Revenu Net Annuel Souhaité',
      businessExpenses: 'Frais Professionnels Annuels',
      taxRate: 'Taux d\'Imposition Estimé (%)',
      billableWeeks: 'Semaines Facturables par An',
      billableHours: 'Heures Facturables par Semaine',
      grossTarget: 'Objectif de Revenu Brut Annuel',
      totalExpenses: 'Total des Charges & Impôts',
      hourlyRate: 'Tarif Horaire Requis',
      dailyRate: 'Tarif Journalier Requis',
      expenseTax: 'Charges & Impôts',
      billableTitle: 'Allocation du Temps',
      calculatedRates: 'Tarifs Cibles Recommandés',
      weeklyBillable: 'Heures/Semaine',
      daysPerWeek: 'jours/semaine',
      copied: '✓ Copié !',
      copyResult: 'Copier le Résultat',
      disclaimer: 'À titre informatif uniquement. Les taux dépendent du marché et de l\'expérience.'
    },
    de: {
      title: 'Freelancer Stundensatz-Rechner',
      subtitle: 'Berechnen Sie Zielstunden- und Tagessätze basierend auf Einkommen, Ausgaben und Steuern',
      targetIncome: 'Gewünschtes Netto-Jahreseinkommen',
      businessExpenses: 'Jährliche Betriebsausgaben',
      taxRate: 'Geschätzter Steuersatz (%)',
      billableWeeks: 'Fakturierbare Wochen pro Jahr',
      billableHours: 'Fakturierbare Stunden pro Woche',
      grossTarget: 'Brutto-Jahresumsatz-Ziel',
      totalExpenses: 'Gesamtausgaben & Steuern',
      hourlyRate: 'Erforderlicher Stundensatz',
      dailyRate: 'Erforderlicher Tagessatz',
      expenseTax: 'Ausgaben & Steuern',
      billableTitle: 'Zeitaufteilung',
      calculatedRates: 'Empfohlene Tarifsätze',
      weeklyBillable: 'Stunden/Woche',
      daysPerWeek: 'Tage/Woche',
      copied: '✓ Kopiert!',
      copyResult: 'Ergebnis kopieren',
      disclaimer: 'Nur zu Informationszwecken. Tarife hängen von Markt und Erfahrung ab.'
    },
    ar: {
      title: 'حاسبة أسعار العمل الحر',
      subtitle: 'حساب سعر الساعة واليوم الموصى به للمستقلين بناءً على الدخل المصاريف والضرائب',
      targetIncome: 'صافي الدخل السنوي المرغوب فيه',
      businessExpenses: 'المصاريف التشغيلية السنوية',
      taxRate: 'نسبة ضريبة الدخل المقدرة (%)',
      billableWeeks: 'عدد أسابيع العمل الفعلية في السنة',
      billableHours: 'عدد الساعات القابلة للفوترة أسبوعياً',
      grossTarget: 'إجمالي الإيرادات السنوية المستهدفة',
      totalExpenses: 'إجمالي المصاريف والضرائب',
      hourlyRate: 'سعر الساعة المطلوب',
      dailyRate: 'سعر اليوم المطلوب',
      expenseTax: 'المصاريف والضرائب',
      billableTitle: 'تقسيم الوقت',
      calculatedRates: 'أسعار العقود المقترحة',
      weeklyBillable: 'ساعة/أسبوع',
      daysPerWeek: 'أيام/أسبوع',
      copied: '✓ تم النسخ!',
      copyResult: 'نسخ النتيجة',
      disclaimer: 'لأغراض إعلامية فقط. الأسعار تخضع لظروف السوق ومستوى الخبرة.'
    },
    ko: {
      title: '프리랜서 단가 계산기',
      subtitle: '목표 순수입, 연간 지출 경비 및 세율을 기준으로 권장 시급 및 일당 계산',
      targetIncome: '목표 연간 순수입 (세후/순이익)',
      businessExpenses: '연간 고정 운영 경비 (소프트웨어, 장비 등)',
      taxRate: '예상 소득세율 (%)',
      billableWeeks: '연간 근무 주수 (휴가 제외)',
      billableHours: '주당 청구 가능 시간 (실제 작업 시수)',
      grossTarget: '필요 연간 총 매출 목표',
      totalExpenses: '총 지출 경비 & 세금',
      hourlyRate: '권장 시간당 단가 (시급)',
      dailyRate: '권장 일일 단가 (일당)',
      expenseTax: '운영 경비 & 세금',
      billableTitle: '근무 시간 설정',
      calculatedRates: '권장 단가 가이드라인',
      weeklyBillable: '작업시간/주',
      daysPerWeek: '일/주',
      copied: '✓ 복사됨!',
      copyResult: '결과 복사',
      disclaimer: '단순 참고용입니다. 실제 견적은 프로젝트 난이도와 포트폴리오 수준을 반영하여 산정해야 합니다.'
    },
    ru: {
      title: 'Калькулятор ставки фрилансера',
      subtitle: 'Рассчитайте необходимую почасовую и дневную ставку на основе целей по доходу, расходов и налогов',
      targetIncome: 'Желаемый чистый доход в год',
      businessExpenses: 'Годовые бизнес-расходы',
      taxRate: 'Ожидаемая налоговая ставка (%)',
      billableWeeks: 'Оплачиваемые недели в году',
      billableHours: 'Оплачиваемые часы в неделю',
      grossTarget: 'Цель по валовому доходу в год',
      totalExpenses: 'Всего расходов и налогов',
      hourlyRate: 'Необходимая почасовая ставка',
      dailyRate: 'Необходимая дневная ставка',
      expenseTax: 'Расходы и налоги',
      billableTitle: 'Распределение времени',
      calculatedRates: 'Рекомендуемые целевые ставки',
      weeklyBillable: 'часов в неделю',
      daysPerWeek: 'дней в неделю',
      copied: '✓ Скопировано!',
      copyResult: 'Скопировать результат',
      disclaimer: 'Только для ознакомления. Ставки зависят от конъюнктуры рынка и опыта.'
    }
  };

  const l = $derived(I18N_BACKUP[locale] || I18N_BACKUP['en']);

  let targetNet = $state('50000');
  let expenses = $state('6000');
  let taxRate = $state('20');
  let weeks = $state('48');
  let hours = $state('25');
  let daysWeekly = $state('5');

  let currency = $state('USD');
  const currencies = ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY', 'CNY', 'CHF'];
  const symbols: Record<string, string> = { USD: '$', EUR: '€', GBP: '£', CAD: 'CA$', AUD: 'A$', JPY: '¥', CNY: '¥', CHF: 'CHF' };
  const sym = $derived(symbols[currency] ?? currency);

  const stats = $derived((() => {
    const netGoal = parseFloat(targetNet) || 0;
    const exp = parseFloat(expenses) || 0;
    const taxPct = (parseFloat(taxRate) || 0) / 100;
    const wk = parseFloat(weeks) || 0;
    const hr = parseFloat(hours) || 0;
    const dy = parseFloat(daysWeekly) || 5;

    // Gross target calculation
    // Gross = (NetGoal + Expenses) / (1 - taxRate)
    const divider = 1 - taxPct;
    const grossTarget = divider > 0 ? (netGoal + exp) / divider : netGoal + exp;
    const totalTaxes = grossTarget - netGoal - exp;
    const totalExpensesAndTaxes = exp + totalTaxes;

    // Billing calculation
    const totalHoursYearly = wk * hr;
    const requiredHourly = totalHoursYearly > 0 ? grossTarget / totalHoursYearly : 0;
    
    // Daily rate = Hourly Rate * (Hours per week / days per week)
    const hoursPerDay = dy > 0 ? hr / dy : 0;
    const requiredDaily = requiredHourly * hoursPerDay;

    return {
      grossTarget,
      totalTaxes,
      totalExpensesAndTaxes,
      totalHoursYearly,
      requiredHourly,
      requiredDaily
    };
  })());

  function fmt(v: number) {
    return sym + v.toLocaleString(locale, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  }

  let copied = $state(false);
  function copyResult() {
    const text = `${l.title}\n` +
      `${l.grossTarget}: ${fmt(stats.grossTarget)}/year\n` +
      `${l.hourlyRate}: ${fmt(stats.requiredHourly)}/hour\n` +
      `${l.dailyRate}: ${fmt(stats.requiredDaily)}/day\n` +
      `Based on ${weeks} billable weeks, ${hours} billable hours/week, and ${taxRate}% tax rate.`;

    navigator.clipboard.writeText(text).then(() => {
      copied = true;
      setTimeout(() => copied = false, 1800);
    });
  }
</script>

<div class="bg-stone-950 text-stone-100 p-5 rounded-2xl border border-stone-800 shadow-2xl font-sans min-h-[400px]">
  <!-- Header -->
  <div class="flex items-center gap-3 mb-6">
    <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-amber-700 flex items-center justify-center text-stone-950 font-black text-sm">F</div>
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
    <div class="space-y-3">
      <label class="block">
        <span class="text-xs text-stone-400 mb-1 block">{l.targetIncome}</span>
        <input type="number" bind:value={targetNet} min="0" step="1000"
          class="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-2 text-sm text-stone-100 focus:border-amber-500 focus:outline-none transition-colors" />
      </label>

      <div class="grid grid-cols-2 gap-3">
        <label class="block">
          <span class="text-xs text-stone-400 mb-1 block">{l.businessExpenses}</span>
          <input type="number" bind:value={expenses} min="0" step="100"
            class="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-2 text-sm text-stone-100 focus:border-amber-500 focus:outline-none transition-colors" />
        </label>
        <label class="block">
          <span class="text-xs text-stone-400 mb-1 block">{l.taxRate}</span>
          <input type="number" bind:value={taxRate} min="0" max="90" step="1"
            class="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-2 text-sm text-stone-100 focus:border-amber-500 focus:outline-none transition-colors" />
        </label>
      </div>

      <div class="border-t border-stone-800 pt-3">
        <span class="text-xs text-stone-500 font-bold block mb-2">{l.billableTitle}</span>
        <div class="grid grid-cols-3 gap-3">
          <label class="block col-span-2">
            <span class="text-[10px] text-stone-400 mb-1 block">{l.billableWeeks}</span>
            <input type="number" bind:value={weeks} min="1" max="52"
              class="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-1.5 text-xs text-stone-100 focus:border-amber-500 focus:outline-none transition-colors" />
          </label>
          <label class="block">
            <span class="text-[10px] text-stone-400 mb-1 block">{l.weeklyBillable}</span>
            <input type="number" bind:value={hours} min="1" max="168"
              class="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-1.5 text-xs text-stone-100 focus:border-amber-500 focus:outline-none transition-colors" />
          </label>
        </div>
        <div class="mt-3">
          <span class="text-[10px] text-stone-400 mb-1 block">Working Days per Week</span>
          <select bind:value={daysWeekly} class="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-1.5 text-xs text-stone-100 focus:border-amber-500 focus:outline-none transition-colors cursor-pointer">
            <option value="5">5 {l.daysPerWeek}</option>
            <option value="4">4 {l.daysPerWeek}</option>
            <option value="6">6 {l.daysPerWeek}</option>
            <option value="7">7 {l.daysPerWeek}</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Results -->
    <div class="space-y-4">
      <div class="rounded-xl p-4 bg-amber-950/30 border border-amber-800/50 text-center">
        <p class="text-xs text-stone-400 mb-1">{l.grossTarget}</p>
        <p class="text-3xl font-black text-amber-400">{fmt(stats.grossTarget)}</p>
        <p class="text-xs text-stone-500 mt-1">({l.expenseTax}: <span class="font-bold text-stone-300">{fmt(stats.totalExpensesAndTaxes)}</span>)</p>
      </div>

      <!-- Target Rates -->
      <div class="grid grid-cols-2 gap-3">
        <div class="bg-stone-900 rounded-xl p-4 border border-stone-800 text-center">
          <p class="text-xs text-stone-500">{l.hourlyRate}</p>
          <p class="text-2xl font-black text-emerald-400 mt-2">{fmt(stats.requiredHourly)}</p>
          <p class="text-[10px] text-stone-600 mt-1">/ hour</p>
        </div>
        <div class="bg-stone-900 rounded-xl p-4 border border-stone-800 text-center">
          <p class="text-xs text-stone-500">{l.dailyRate}</p>
          <p class="text-2xl font-black text-amber-300 mt-2">{fmt(stats.requiredDaily)}</p>
          <p class="text-[10px] text-stone-600 mt-1">/ day</p>
        </div>
      </div>

      <!-- Overview stats -->
      <div class="bg-stone-900 rounded-xl p-3 border border-stone-800 text-xs text-stone-400 space-y-1">
        <p>• Yearly Billable Hours: <strong>{stats.totalHoursYearly} hrs</strong>.</p>
        <p>• Desired Net Income: <strong>{fmt(parseFloat(targetNet) || 0)}</strong>.</p>
        <p>• Operating Expenses: <strong>{fmt(parseFloat(expenses) || 0)}</strong>.</p>
        <p>• Taxes Payable ({taxRate}%): <strong>{fmt(stats.totalTaxes)}</strong>.</p>
      </div>

      <button onclick={copyResult}
        class="w-full py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 {copied ? 'bg-emerald-700 text-white' : 'bg-amber-600 hover:bg-amber-500 text-stone-950'}">
        {copied ? l.copied : l.copyResult}
      </button>
    </div>
  </div>
  <p class="text-xs text-stone-600 mt-6 text-center">{l.disclaimer}</p>
</div>
