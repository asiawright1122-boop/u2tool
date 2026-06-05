<script lang="ts">
  interface Props {
    locale?: string;
    translations?: Record<string, unknown>;
  }

  let { locale = 'en', translations = {} }: Props = $props();

  const I18N_BACKUP: Record<string, Record<string, string>> = {
    zh: {
      title: '股票投资损益计算器',
      subtitle: '计算股票交易的利润、亏损、投资回报率（ROI）及手续费',
      buyPrice: '买入价格 / 股',
      sellPrice: '卖出价格 / 股',
      shares: '持股数量',
      buyFee: '买入手续费',
      sellFee: '卖出手续费',
      totalFees: '总手续费',
      netProfitLoss: '净利润 / 亏损',
      roi: '投资回报率 (ROI)',
      costBasis: '成本基础',
      costBasisSub: '购买总额 + 手续费',
      proceeds: '销售所得',
      proceedsSub: '销售总额 − 手续费',
      breakEven: '保本价格',
      breakEvenSub: '每股保本价',
      return: '收益率',
      returnSub: '占成本比例',
      roiGauge: 'ROI 指示器',
      copyResult: '复制结果',
      copied: '✓ 已复制!',
      disclaimer: '仅供参考，不构成任何投资建议。'
    },
    en: {
      title: 'Stock Profit Calculator',
      subtitle: 'Calculate stock trade profit, loss, ROI, and fees',
      buyPrice: 'Buy Price / Share',
      sellPrice: 'Sell Price / Share',
      shares: 'Number of Shares',
      buyFee: 'Buy Commission',
      sellFee: 'Sell Commission',
      totalFees: 'Total Fees',
      netProfitLoss: 'Net Profit / Loss',
      roi: 'ROI',
      costBasis: 'Cost Basis',
      costBasisSub: 'total buy + fees',
      proceeds: 'Proceeds',
      proceedsSub: 'total sell − fees',
      breakEven: 'Break-even',
      breakEvenSub: 'per share',
      return: 'Return',
      returnSub: 'on cost basis',
      roiGauge: 'ROI gauge',
      copyResult: 'Copy Result',
      copied: '✓ Copied!',
      disclaimer: 'For informational purposes only. Not financial advice.'
    },
    es: {
      title: 'Calculadora de Beneficios en Acciones',
      subtitle: 'Calcule ganancias, pérdidas, ROI y comisiones de acciones',
      buyPrice: 'Precio Compra / Acción',
      sellPrice: 'Precio Venta / Acción',
      shares: 'Número de Acciones',
      buyFee: 'Comisión de Compra',
      sellFee: 'Comisión de Venta',
      totalFees: 'Comisiones Totales',
      netProfitLoss: 'Ganancia / Pérdida Neta',
      roi: 'ROI',
      costBasis: 'Base de Costo',
      costBasisSub: 'compra total + comisiones',
      proceeds: 'Ingresos',
      proceedsSub: 'venta total − comisiones',
      breakEven: 'Punto de Equilibrio',
      breakEvenSub: 'por acción',
      return: 'Retorno',
      returnSub: 'sobre base de costo',
      roiGauge: 'Indicador de ROI',
      copyResult: 'Copiar Resultado',
      copied: '✓ ¡Copiado!',
      disclaimer: 'Solo para fines informativos. No es asesoramiento financiero.'
    },
    pt: {
      title: 'Calculadora de Lucro de Ações',
      subtitle: 'Calcule lucro, prejuízo, ROI e taxas de negociação de ações',
      buyPrice: 'Preço de Compra / Ação',
      sellPrice: 'Preço de Venda / Ação',
      shares: 'Número de Ações',
      buyFee: 'Taxa de Compra',
      sellFee: 'Taxa de Venda',
      totalFees: 'Taxas Totais',
      netProfitLoss: 'Lucro / Prejuízo Líquido',
      roi: 'ROI',
      costBasis: 'Base de Custo',
      costBasisSub: 'compra total + taxas',
      proceeds: 'Receita',
      proceedsSub: 'venda total − taxas',
      breakEven: 'Ponto de Equilíbrio',
      breakEvenSub: 'por ação',
      return: 'Retorno',
      returnSub: 'sobre base de custo',
      roiGauge: 'Indicador de ROI',
      copyResult: 'Copiar Resultado',
      copied: '✓ Copiado!',
      disclaimer: 'Apenas para fins informativos. Não é conselho financeiro.'
    },
    ja: {
      title: '株式利益計算シミュレーター',
      subtitle: '株式取引の利益、損失、投資収益率（ROI）、および手数料を計算',
      buyPrice: '購入単価 / 株',
      sellPrice: '売却単価 / 株',
      shares: '株数',
      buyFee: '購入手数料',
      sellFee: '売却手数料',
      totalFees: '手数料合計',
      netProfitLoss: '純損益',
      roi: 'ROI',
      costBasis: '投資元本（購入総額）',
      costBasisSub: '購入額 + 手数料',
      proceeds: '売却受取額',
      proceedsSub: '売却所得 − 手数料',
      breakEven: '損益分岐点',
      breakEvenSub: '1株あたり',
      return: '収益率',
      returnSub: '元本に対する割合',
      roiGauge: 'ROI ゲージ',
      copyResult: '結果をコピー',
      copied: '✓ コピーしました!',
      disclaimer: '情報提供のみを目的としています。投資勧誘ではありません。'
    },
    fr: {
      title: 'Calculateur de Profit Actions',
      subtitle: 'Calculez le profit, la perte, le ROI et les frais d\'une transaction',
      buyPrice: 'Prix d\'achat / Action',
      sellPrice: 'Prix de vente / Action',
      shares: 'Nombre d\'actions',
      buyFee: 'Frais d\'achat',
      sellFee: 'Frais de vente',
      totalFees: 'Frais Totaux',
      netProfitLoss: 'Gain / Perte Net',
      roi: 'ROI',
      costBasis: 'Base de Coût',
      costBasisSub: 'achat total + frais',
      proceeds: 'Produits',
      proceedsSub: 'vente totale − frais',
      breakEven: 'Seuil de Rentabilité',
      breakEvenSub: 'par action',
      return: 'Rendement',
      returnSub: 'sur base de coût',
      roiGauge: 'Indicateur de ROI',
      copyResult: 'Copier le Résultat',
      copied: '✓ Copié !',
      disclaimer: 'À titre informatif uniquement. Pas de conseil financier.'
    },
    de: {
      title: 'Aktien-Rendite-Rechner',
      subtitle: 'Berechnen Sie Gewinn, Verlust, ROI und Gebühren für Aktiengeschäfte',
      buyPrice: 'Kaufpreis / Aktie',
      sellPrice: 'Verkaufspreis / Aktie',
      shares: 'Anzahl der Aktien',
      buyFee: 'Kaufgebühr',
      sellFee: 'Verkaufsgebühr',
      totalFees: 'Gebühren Gesamt',
      netProfitLoss: 'Nettogewinn / Verlust',
      roi: 'ROI',
      costBasis: 'Anschaffungskosten',
      costBasisSub: 'Kaufsumme + Gebühren',
      proceeds: 'Verkaufserlös',
      proceedsSub: 'Verkaufssumme − Gebühren',
      breakEven: 'Break-Even-Kurs',
      breakEvenSub: 'pro Aktie',
      return: 'Rendite',
      returnSub: 'bezogen auf Kosten',
      roiGauge: 'ROI-Anzeige',
      copyResult: 'Ergebnis kopieren',
      copied: '✓ Kopiert!',
      disclaimer: 'Nur zu Informationszwecken. Keine Finanzberatung.'
    },
    ar: {
      title: 'حاسبة أرباح الأسهم',
      subtitle: 'حساب أرباح وخسائر تداول الأسهم، العائد على الاستثمار، والرسوم',
      buyPrice: 'سعر الشراء / السهم',
      sellPrice: 'سعر البيع / السهم',
      shares: 'عدد الأسهم',
      buyFee: 'عمولة الشراء',
      sellFee: 'عمولة البيع',
      totalFees: 'إجمالي الرسوم',
      netProfitLoss: 'صافي الربح / الخسارة',
      roi: 'العائد على الاستثمار',
      costBasis: 'تكلفة الاستثمار',
      costBasisSub: 'إجمالي الشراء + الرسوم',
      proceeds: 'متحصلات البيع',
      proceedsSub: 'إجمالي البيع − الرسوم',
      breakEven: 'نقطة التعادل',
      breakEvenSub: 'لكل سهم',
      return: 'العائد',
      returnSub: 'على تكلفة الاستثمار',
      roiGauge: 'مقياس العائد',
      copyResult: 'نسخ النتيجة',
      copied: '✓ تم النسخ!',
      disclaimer: 'لأغراض إعلامية فقط. لا يعتبر نصيحة مالية.'
    },
    ko: {
      title: '주식 수익률 계산기',
      subtitle: '주식 거래 손익, ROI 및 수수료 계산',
      buyPrice: '매수 가격 / 주',
      sellPrice: '매도 가격 / 주',
      shares: '주식 수',
      buyFee: '매수 수수료',
      sellFee: '매도 수수료',
      totalFees: '총 수수료',
      netProfitLoss: '순손익',
      roi: 'ROI',
      costBasis: '총 매수 비용',
      costBasisSub: '매수 총액 + 수수료',
      proceeds: '총 매도 수령액',
      proceedsSub: '매도 총액 − 수수료',
      breakEven: '손익분기 가격',
      breakEvenSub: '주당',
      return: '수익률',
      returnSub: '투자금 대비',
      roiGauge: 'ROI 게이지',
      copyResult: '결과 복사',
      copied: '✓ 복사됨!',
      disclaimer: '단순 참고용입니다. 투자 권유가 아닙니다.'
    },
    ru: {
      title: 'Калькулятор прибыли от акций',
      subtitle: 'Рассчитайте прибыль, убыток, ROI и комиссии от сделки с акциями',
      buyPrice: 'Цена покупки / акция',
      sellPrice: 'Цена продажи / акция',
      shares: 'Количество акций',
      buyFee: 'Комиссия на покупку',
      sellFee: 'Комиссия на продажу',
      totalFees: 'Всего комиссий',
      netProfitLoss: 'Чистая прибыль / убыток',
      roi: 'ROI',
      costBasis: 'Затраты (База стоимости)',
      costBasisSub: 'покупка + комиссии',
      proceeds: 'Выручка от продажи',
      proceedsSub: 'продажа − комиссии',
      breakEven: 'Точка безубыточности',
      breakEvenSub: 'на акцию',
      return: 'Доходность',
      returnSub: 'к затратам',
      roiGauge: 'Шкала ROI',
      copyResult: 'Скопировать результат',
      copied: '✓ Скопировано!',
      disclaimer: 'Только для ознакомления. Не является финансовой рекомендацией.'
    }
  };

  const l = $derived(I18N_BACKUP[locale] || I18N_BACKUP['en']);

  // ── inputs ──────────────────────────────────────────────────────────────
  let buyPrice   = $state('50');
  let sellPrice  = $state('75');
  let quantity   = $state('100');
  let buyFee     = $state('9.99');
  let sellFee    = $state('9.99');
  let currency   = $state('USD');

  const currencies = ['USD', 'EUR', 'GBP', 'JPY', 'CNY', 'CAD', 'AUD', 'CHF'];
  const symbols: Record<string, string> = {
    USD: '$', EUR: '€', GBP: '£', JPY: '¥', CNY: '¥', CAD: 'CA$', AUD: 'A$', CHF: 'CHF'
  };

  // ── calculations ─────────────────────────────────────────────────────────
  const result = $derived((() => {
    const bp  = parseFloat(buyPrice)  || 0;
    const sp  = parseFloat(sellPrice) || 0;
    const qty = parseFloat(quantity)  || 0;
    const bf  = parseFloat(buyFee)    || 0;
    const sf  = parseFloat(sellFee)   || 0;

    const costBasis = bp * qty + bf;
    const proceeds  = sp * qty - sf;
    const profit    = proceeds - costBasis;
    const roi       = costBasis > 0 ? (profit / costBasis) * 100 : 0;
    const totalFees = bf + sf;
    const breakEven = qty > 0 ? (costBasis + sf) / qty : 0;
    const isGain    = profit >= 0;

    return { costBasis, proceeds, profit, roi, totalFees, breakEven, isGain };
  })());

  const sym = $derived(symbols[currency] ?? currency);

  function fmt(v: number, dec = 2) {
    return sym + v.toLocaleString(locale, { minimumFractionDigits: dec, maximumFractionDigits: dec });
  }
  function fmtPct(v: number) {
    return (v >= 0 ? '+' : '') + v.toFixed(2) + '%';
  }

  let copied = $state(false);
  function copyResult() {
    const text = `${l.title}\n${l.costBasis}: ${fmt(result.costBasis)}\n${l.proceeds}: ${fmt(result.proceeds)}\n${l.netProfitLoss}: ${fmt(result.profit)}\n${l.roi}: ${fmtPct(result.roi)}\n${l.breakEven}: ${fmt(result.breakEven)}/${l.breakEvenSub}`;
    navigator.clipboard.writeText(text).then(() => { copied = true; setTimeout(() => copied = false, 1800); });
  }
</script>

<div class="bg-stone-950 text-stone-100 p-5 rounded-2xl border border-stone-800 shadow-2xl font-sans select-none min-h-[400px]">
  <!-- Header -->
  <div class="flex items-center gap-3 mb-6">
    <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-amber-700 flex items-center justify-center text-stone-950 font-black text-sm">$</div>
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
      <div class="grid grid-cols-2 gap-3">
        <label class="block">
          <span class="text-xs text-stone-400 mb-1 block">{l.buyPrice}</span>
          <input type="number" bind:value={buyPrice} min="0" step="0.01"
            class="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-2 text-sm text-stone-100 focus:border-amber-500 focus:outline-none transition-colors" />
        </label>
        <label class="block">
          <span class="text-xs text-stone-400 mb-1 block">{l.sellPrice}</span>
          <input type="number" bind:value={sellPrice} min="0" step="0.01"
            class="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-2 text-sm text-stone-100 focus:border-amber-500 focus:outline-none transition-colors" />
        </label>
      </div>

      <label class="block">
        <span class="text-xs text-stone-400 mb-1 block">{l.shares}</span>
        <input type="number" bind:value={quantity} min="0" step="1"
          class="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-2 text-sm text-stone-100 focus:border-amber-500 focus:outline-none transition-colors" />
      </label>

      <div class="grid grid-cols-2 gap-3">
        <label class="block">
          <span class="text-xs text-stone-400 mb-1 block">{l.buyFee}</span>
          <input type="number" bind:value={buyFee} min="0" step="0.01"
            class="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-2 text-sm text-stone-100 focus:border-amber-500 focus:outline-none transition-colors" />
        </label>
        <label class="block">
          <span class="text-xs text-stone-400 mb-1 block">{l.sellFee}</span>
          <input type="number" bind:value={sellFee} min="0" step="0.01"
            class="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-2 text-sm text-stone-100 focus:border-amber-500 focus:outline-none transition-colors" />
        </label>
      </div>

      <div class="bg-stone-900 rounded-xl p-3 border border-stone-800">
        <p class="text-xs text-stone-500">{l.totalFees}</p>
        <p class="text-amber-400 font-bold text-lg">{fmt(result.totalFees)}</p>
      </div>
    </div>

    <!-- Results -->
    <div class="space-y-3">
      <!-- P&L Hero -->
      <div class="rounded-xl p-4 border {result.isGain ? 'bg-emerald-950/40 border-emerald-800/60' : 'bg-red-950/40 border-red-800/60'} text-center">
        <p class="text-xs text-stone-400 mb-1">{l.netProfitLoss}</p>
        <p class="text-3xl font-black {result.isGain ? 'text-emerald-400' : 'text-red-400'}">{fmt(result.profit)}</p>
        <p class="text-sm font-semibold {result.isGain ? 'text-emerald-500' : 'text-red-500'} mt-1">{fmtPct(result.roi)} {l.roi}</p>
      </div>

      <!-- Details grid -->
      <div class="grid grid-cols-2 gap-2">
        {#each [
          { label: l.costBasis, val: fmt(result.costBasis), sub: l.costBasisSub },
          { label: l.proceeds,   val: fmt(result.proceeds),  sub: l.proceedsSub },
          { label: l.breakEven, val: fmt(result.breakEven), sub: l.breakEvenSub },
          { label: l.return,     val: fmtPct(result.roi),    sub: l.returnSub },
        ] as item}
          <div class="bg-stone-900 rounded-xl p-3 border border-stone-800">
            <p class="text-xs text-stone-500">{item.label}</p>
            <p class="text-amber-300 font-bold">{item.val}</p>
            <p class="text-xs text-stone-600">{item.sub}</p>
          </div>
        {/each}
      </div>

      <!-- ROI bar -->
      <div>
        <div class="flex justify-between text-xs text-stone-500 mb-1">
          <span>{l.roiGauge}</span><span>{fmtPct(result.roi)}</span>
        </div>
        <div class="bg-stone-800 rounded-full h-2 overflow-hidden">
          <div class="h-full rounded-full transition-all duration-500 {result.isGain ? 'bg-emerald-500' : 'bg-red-500'}"
            style="width: {Math.min(Math.abs(result.roi), 100)}%"></div>
        </div>
      </div>

      <button onclick={copyResult}
        class="w-full py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 {copied ? 'bg-emerald-700 text-white' : 'bg-amber-600 hover:bg-amber-500 text-stone-950'}">
        {copied ? l.copied : l.copyResult}
      </button>
    </div>
  </div>

</div>
