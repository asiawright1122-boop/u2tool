<script lang="ts">
  interface Props {
    locale?: string;
    translations?: Record<string, unknown>;
  }

  let { locale = 'en', translations = {} }: Props = $props();

  const I18N_BACKUP: Record<string, Record<string, string>> = {
    zh: {
      title: 'Etsy 卖家手续费计算器',
      subtitle: '全面计算 Etsy 卖家的各项手续费、运营成本、净利润及利润率',
      salePrice: '售价',
      shippingCharged: '向买家收取的运费',
      itemCost: '产品成本',
      shippingCost: '实际运费成本',
      listingFee: '刊登费 ($)',
      transactionFee: '交易服务费 (%)',
      paymentFee: '支付处理费 (%)',
      paymentFixed: '支付固定费用 ($)',
      offsiteAds: '站外广告费 (%)',
      renewListing: '自动更新刊登',
      totalRevenue: '总收入',
      totalCosts: '总成本/费用',
      etsyFees: 'Etsy 总手续费',
      profit: '净利润',
      margin: '利润率',
      roi: '投资回报率 (ROI)',
      listingFeeLabel: '刊登费',
      transFeeLabel: '交易手续费 (6.5%)',
      payProcFeeLabel: '支付处理费',
      adsFeeLabel: '站外广告费',
      copied: '✓ 已复制!',
      copyResult: '复制结果',
      disclaimer: '仅供参考。Etsy 各国/地区的支付手续费标准不同，实际账单请以 Etsy 卖家中心为准。'
    },
    en: {
      title: 'Etsy Fee Calculator',
      subtitle: 'Calculate Etsy seller fees, listings, transaction costs, net profit, and profit margins',
      salePrice: 'Item Sale Price',
      shippingCharged: 'Shipping Charged to Buyer',
      itemCost: 'Item Cost to Make/Buy',
      shippingCost: 'Actual Shipping Cost',
      listingFee: 'Listing Fee ($)',
      transactionFee: 'Transaction Fee (%)',
      paymentFee: 'Payment Processing (%)',
      paymentFixed: 'Payment Fixed Fee ($)',
      offsiteAds: 'Offsite Ads Fee (%)',
      renewListing: 'Renew Listing ($0.20)',
      totalRevenue: 'Total Revenue',
      totalCosts: 'Total Costs & Fees',
      etsyFees: 'Total Etsy Fees',
      profit: 'Net Profit',
      margin: 'Profit Margin',
      roi: 'Return on Investment (ROI)',
      listingFeeLabel: 'Listing Fee',
      transFeeLabel: 'Transaction Fee (6.5%)',
      payProcFeeLabel: 'Payment Processing',
      adsFeeLabel: 'Offsite Ads',
      copied: '✓ Copied!',
      copyResult: 'Copy Result',
      disclaimer: 'For informational purposes only. Etsy payment fees vary by country.'
    },
    es: {
      title: 'Calculadora de Tarifas de Etsy',
      subtitle: 'Calcule tarifas de vendedor, costos de transacción, beneficio neto y márgenes en Etsy',
      salePrice: 'Precio de Venta',
      shippingCharged: 'Envío Cobrado al Comprador',
      itemCost: 'Costo del Artículo',
      shippingCost: 'Costo de Envío Real',
      listingFee: 'Tarifa de Anuncio ($)',
      transactionFee: 'Tarifa de Transacción (%)',
      paymentFee: 'Procesamiento de Pago (%)',
      paymentFixed: 'Tarifa Fija de Pago ($)',
      offsiteAds: 'Tarifa de Anuncios Externos (%)',
      renewListing: 'Renovar Anuncio ($0.20)',
      totalRevenue: 'Ingresos Totales',
      totalCosts: 'Costos y Tarifas Totales',
      etsyFees: 'Tarifas Totales de Etsy',
      profit: 'Beneficio Neto',
      margin: 'Margen de Beneficio',
      roi: 'ROI',
      listingFeeLabel: 'Tarifa de Anuncio',
      transFeeLabel: 'Tarifa de Transacción (6.5%)',
      payProcFeeLabel: 'Procesamiento de Pago',
      adsFeeLabel: 'Anuncios Externos',
      copied: '✓ ¡Copiado!',
      copyResult: 'Copiar Resultado',
      disclaimer: 'Solo para fines informativos. Las tarifas de Etsy varían según el país.'
    },
    pt: {
      title: 'Calculadora de Taxas do Etsy',
      subtitle: 'Calcule taxas de vendedor do Etsy, custos de transação, lucro líquido e margem',
      salePrice: 'Preço de Venda do Item',
      shippingCharged: 'Frete Cobrado do Comprador',
      itemCost: 'Custo do Item',
      shippingCost: 'Custo de Frete Real',
      listingFee: 'Taxa de Anúncio ($)',
      transactionFee: 'Taxa de Transação (%)',
      paymentFee: 'Processamento de Pagamento (%)',
      paymentFixed: 'Taxa Fixa de Pagamento ($)',
      offsiteAds: 'Taxa de Anúncios Externos (%)',
      renewListing: 'Renovar Anúncio ($0.20)',
      totalRevenue: 'Receita Total',
      totalCosts: 'Custos e Taxas Totais',
      etsyFees: 'Taxas Totais do Etsy',
      profit: 'Lucro Líquido',
      margin: 'Margem de Lucro',
      roi: 'Retorno sobre Investimento (ROI)',
      listingFeeLabel: 'Taxa de Anúncio',
      transFeeLabel: 'Taxa de Transação (6.5%)',
      payProcFeeLabel: 'Processamento de Pagamento',
      adsFeeLabel: 'Anúncios Externos',
      copied: '✓ Copiado!',
      copyResult: 'Copiar Resultado',
      disclaimer: 'Apenas para fins informativos. As taxas do Etsy variam conforme o país.'
    },
    ja: {
      title: 'Etsy手数料計算シミュレーター',
      subtitle: 'Etsy出品者の手数料、製作コスト、配送費、純利益、および利益率を計算',
      salePrice: '商品の販売価格',
      shippingCharged: '購入者から受け取る配送料',
      itemCost: '商品の仕入れ・制作コスト',
      shippingCost: '実際の配送費用',
      listingFee: '出品料 ($)',
      transactionFee: '取引手数料 (%)',
      paymentFee: '決済処理手数料 (%)',
      paymentFixed: '決済固定手数料 ($)',
      offsiteAds: 'オフサイト広告手数料 (%)',
      renewListing: '出品の自動更新 ($0.20)',
      totalRevenue: '総売上（総収入）',
      totalCosts: '総コスト（手数料含む）',
      etsyFees: 'Etsy手数料合計',
      profit: '純利益',
      margin: '利益率',
      roi: '投資収益率 (ROI)',
      listingFeeLabel: '出品料',
      transFeeLabel: '取引手数料 (6.5%)',
      payProcFeeLabel: '決済処理手数料',
      adsFeeLabel: 'オフサイト広告',
      copied: '✓ コピーしました!',
      copyResult: '結果をコピー',
      disclaimer: '情報提供のみを目的としています。国によって決済手数料等が異なる場合があります。'
    },
    fr: {
      title: 'Calculateur de Frais Etsy',
      subtitle: 'Calculez les frais de vente Etsy, les coûts de transaction, le bénéfice net et les marges',
      salePrice: 'Prix de Vente de l\'Article',
      shippingCharged: 'Frais de Port Facturés à l\'Acheteur',
      itemCost: 'Coût de Fabrication / Achat',
      shippingCost: 'Frais de Port Réels',
      listingFee: 'Frais de Fiche ($)',
      transactionFee: 'Frais de Transaction (%)',
      paymentFee: 'Traitement du Paiement (%)',
      paymentFixed: 'Frais de Paiement Fixes ($)',
      offsiteAds: 'Frais de Publicité Externe (%)',
      renewListing: 'Renouveler la Fiche ($0.20)',
      totalRevenue: 'Revenu Total',
      totalCosts: 'Coûts & Frais Totaux',
      etsyFees: 'Frais Etsy Totaux',
      profit: 'Bénéfice Net',
      margin: 'Marge Bénéficiaire',
      roi: 'Retour sur Investissement (ROI)',
      listingFeeLabel: 'Frais de Fiche',
      transFeeLabel: 'Frais de Transaction (6.5%)',
      payProcFeeLabel: 'Traitement du Paiement',
      adsFeeLabel: 'Publicité Externe',
      copied: '✓ Copié !',
      copyResult: 'Copier le Résultat',
      disclaimer: 'À titre informatif uniquement. Les frais Etsy varient selon les pays.'
    },
    de: {
      title: 'Etsy Gebührenrechner',
      subtitle: 'Berechnen Sie Etsy-Verkäufergebühren, Einstellungskosten, Nettogewinn und Margen',
      salePrice: 'Artikel-Verkaufspreis',
      shippingCharged: 'Versandkosten (Käufer)',
      itemCost: 'Artikel-Herstellungskosten',
      shippingCost: 'Tatsächliche Versandkosten',
      listingFee: 'Einstellgebühr ($)',
      transactionFee: 'Transaktionsgebühr (%)',
      paymentFee: 'Zahlungsabwicklung (%)',
      paymentFixed: 'Zahlung Festgebühr ($)',
      offsiteAds: 'Offsite-Ads-Gebühr (%)',
      renewListing: 'Einstellung erneuern ($0.20)',
      totalRevenue: 'Gesamtumsatz',
      totalCosts: 'Gesamtkosten & Gebühren',
      etsyFees: 'Etsy-Gebühren Gesamt',
      profit: 'Nettogewinn',
      margin: 'Gewinnmarge',
      roi: 'ROI',
      listingFeeLabel: 'Einstellgebühr',
      transFeeLabel: 'Transaktionsgebühr (6.5%)',
      payProcFeeLabel: 'Zahlungsabwicklung',
      adsFeeLabel: 'Offsite-Ads',
      copied: '✓ Kopiert!',
      copyResult: 'Ergebnis kopieren',
      disclaimer: 'Nur zu Informationszwecken. Etsy-Zahlungsgebühren variieren je nach Land.'
    },
    ar: {
      title: 'حاسبة رسوم Etsy للبالع',
      subtitle: 'حساب رسوم إتسي وتكلفة المعاملات وصافي الربح وهامش أرباح المتجر',
      salePrice: 'سعر بيع السلعة',
      shippingCharged: 'الشحن المدفوع من المشتري',
      itemCost: 'تكلفة صنع السلعة',
      shippingCost: 'تكلفة الشحن الفعلية',
      listingFee: 'رسوم الإدراج ($)',
      transactionFee: 'رسوم المعاملة (%)',
      paymentFee: 'رسوم معالجة الدفع (%)',
      paymentFixed: 'الرسوم الثابتة للدفع ($)',
      offsiteAds: 'رسوم الإعلانات الخارجية (%)',
      renewListing: 'تجديد الإدراج ($0.20)',
      totalRevenue: 'إجمالي الإيرادات',
      totalCosts: 'إجمالي التكاليف والرسوم',
      etsyFees: 'إجمالي رسوم Etsy',
      profit: 'صافي الربح',
      margin: 'هامش الربح',
      roi: 'العائد على الاستثمار (ROI)',
      listingFeeLabel: 'رسوم الإدراج',
      transFeeLabel: 'رسوم المعاملة (6.5%)',
      payProcFeeLabel: 'معالجة الدفع',
      adsFeeLabel: 'الإعلانات الخارجية',
      copied: '✓ تم النسخ!',
      copyResult: 'نسخ النتيجة',
      disclaimer: 'لأغراض إعلامية فقط. تختلف رسوم معالجة الدفع في إتسي بحسب البلد.'
    },
    ko: {
      title: 'Etsy 셀러 수수료 계산기',
      subtitle: 'Etsy 셀러의 리스팅 수수료, 거래 수수료, 마진 및 최종 순수익 계산',
      salePrice: '상품 판매가',
      shippingCharged: '구매자 지불 배송비',
      itemCost: '원가 / 제작비',
      shippingCost: '실제 배송비 지출',
      listingFee: '리스팅 등록비 ($)',
      transactionFee: '거래 수수료 (%)',
      paymentFee: '결제 대행 수수료 (%)',
      paymentFixed: '결제 건당 수수료 ($)',
      offsiteAds: '오프사이트 광고 수수료 (%)',
      renewListing: '등록 자동 갱신 ($0.20)',
      totalRevenue: '총 매출액',
      totalCosts: '총 비용 (수수료 포함)',
      etsyFees: 'Etsy 총 수수료',
      profit: '순수익',
      margin: '순이익률',
      roi: 'ROI',
      listingFeeLabel: '리스팅비',
      transFeeLabel: '거래 수수료 (6.5%)',
      payProcFeeLabel: '결제 대행 수수료',
      adsFeeLabel: '오프사이트 광고',
      copied: '✓ 복사됨!',
      copyResult: '결과 복사',
      disclaimer: '단순 참고용입니다. Etsy 결제 처리 수수료는 셀러 국가별로 다릅니다.'
    },
    ru: {
      title: 'Калькулятор комиссий Etsy',
      subtitle: 'Рассчитайте комиссии Etsy, затраты на доставку, чистую прибыль и маржу магазина',
      salePrice: 'Цена товара',
      shippingCharged: 'Доставка оплачена покупателем',
      itemCost: 'Себестоимость товара',
      shippingCost: 'Фактические расходы на доставку',
      listingFee: 'Комиссия за размещение ($)',
      transactionFee: 'Комиссия за транзакцию (%)',
      paymentFee: 'Обработка платежей (%)',
      paymentFixed: 'Фиксированный платеж ($)',
      offsiteAds: 'Внешняя реклама (%)',
      renewListing: 'Автопродление объявления ($0.20)',
      totalRevenue: 'Общая выручка',
      totalCosts: 'Всего расходов и комиссий',
      etsyFees: 'Всего комиссий Etsy',
      profit: 'Чистая прибыль',
      margin: 'Маржинальность',
      roi: 'ROI',
      listingFeeLabel: 'Размещение',
      transFeeLabel: 'Комиссия за продажу (6.5%)',
      payProcFeeLabel: 'Обработка платежа',
      adsFeeLabel: 'Внешняя реклама',
      copied: '✓ Скопировано!',
      copyResult: 'Скопировать результат',
      disclaimer: 'Только для ознакомления. Комиссии Etsy могут отличаться в зависимости от страны продавца.'
    }
  };

  const l = $derived(I18N_BACKUP[locale] || I18N_BACKUP['en']);

  // ETSY standard values
  // Listing: $0.20, Transaction: 6.5%
  // Processing: US standard is 3% + $0.25, UK is 4% + £0.20, etc. Let's make it customizable.
  let price = $state('25');
  let shippingIn = $state('5'); // Charged to buyer
  let cost = $state('8'); // Item cost
  let shippingOut = $state('6'); // Real shipping cost

  let listingFee = $state('0.20');
  let transactionFeePct = $state('6.5');
  let processingFeePct = $state('3.0');
  let processingFeeFixed = $state('0.25');

  // Ads Options
  // 0%, 12%, 15%
  let adsType = $state('0'); // '0' | '12' | '15'

  let currency = $state('USD');
  const currencies = ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY', 'CNY', 'CHF'];
  const symbols: Record<string, string> = { USD: '$', EUR: '€', GBP: '£', CAD: 'CA$', AUD: 'A$', JPY: '¥', CNY: '¥', CHF: 'CHF' };
  const sym = $derived(symbols[currency] ?? currency);

  const stats = $derived((() => {
    const pr = parseFloat(price) || 0;
    const sIn = parseFloat(shippingIn) || 0;
    const co = parseFloat(cost) || 0;
    const sOut = parseFloat(shippingOut) || 0;

    const listFee = parseFloat(listingFee) || 0;
    const transPct = (parseFloat(transactionFeePct) || 0) / 100;
    const procPct = (parseFloat(processingFeePct) || 0) / 100;
    const procFixed = parseFloat(processingFeeFixed) || 0;
    const adsPct = (parseFloat(adsType) || 0) / 100;

    const revenue = pr + sIn;
    
    // Fees calculation
    // Transaction fee: 6.5% of total order (price + shipping)
    const tFee = revenue * transPct;
    // Payment processing fee: % of (price + shipping) + fixed
    const pFee = revenue * procPct + procFixed;
    // Offsite ads fee: % of total order if order made through ads
    const aFee = revenue * adsPct;
    
    const totalEtsyFees = listFee + tFee + pFee + aFee;
    const totalCostOfProduct = co + sOut;
    const totalExpenses = totalEtsyFees + totalCostOfProduct;

    const netProfit = revenue - totalExpenses;
    const margin = revenue > 0 ? (netProfit / revenue) * 100 : 0;
    const roi = totalExpenses > 0 ? (netProfit / totalExpenses) * 100 : 0;

    return {
      revenue,
      tFee,
      pFee,
      aFee,
      listFee,
      totalEtsyFees,
      totalCostOfProduct,
      totalExpenses,
      netProfit,
      margin,
      roi
    };
  })());

  function fmt(v: number) {
    return sym + v.toLocaleString(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  let copied = $state(false);
  function copyResult() {
    const text = `${l.title}\n` +
      `${l.totalRevenue}: ${fmt(stats.revenue)}\n` +
      `${l.etsyFees}: ${fmt(stats.totalEtsyFees)}\n` +
      `${l.totalCosts}: ${fmt(stats.totalExpenses)}\n` +
      `${l.profit}: ${fmt(stats.netProfit)}\n` +
      `${l.margin}: ${stats.margin.toFixed(1)}%\n` +
      `${l.roi}: ${stats.roi.toFixed(1)}%`;

    navigator.clipboard.writeText(text).then(() => {
      copied = true;
      setTimeout(() => copied = false, 1800);
    });
  }
</script>

<div class="bg-stone-950 text-stone-100 p-5 rounded-2xl border border-stone-800 shadow-2xl font-sans min-h-[400px]">
  <!-- Header -->
  <div class="flex items-center gap-3 mb-6">
    <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-amber-700 flex items-center justify-center text-stone-950 font-black text-sm">E</div>
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
          <span class="text-xs text-stone-400 mb-1 block">{l.salePrice}</span>
          <input type="number" bind:value={price} min="0" step="0.01"
            class="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-2 text-sm text-stone-100 focus:border-amber-500 focus:outline-none transition-colors" />
        </label>
        <label class="block">
          <span class="text-xs text-stone-400 mb-1 block">{l.shippingCharged}</span>
          <input type="number" bind:value={shippingIn} min="0" step="0.01"
            class="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-2 text-sm text-stone-100 focus:border-amber-500 focus:outline-none transition-colors" />
        </label>
      </div>

      <div class="grid grid-cols-2 gap-3">
        <label class="block">
          <span class="text-xs text-stone-400 mb-1 block">{l.itemCost}</span>
          <input type="number" bind:value={cost} min="0" step="0.01"
            class="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-2 text-sm text-stone-100 focus:border-amber-500 focus:outline-none transition-colors" />
        </label>
        <label class="block">
          <span class="text-xs text-stone-400 mb-1 block">{l.shippingCost}</span>
          <input type="number" bind:value={shippingOut} min="0" step="0.01"
            class="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-2 text-sm text-stone-100 focus:border-amber-500 focus:outline-none transition-colors" />
        </label>
      </div>

      <div class="border-t border-stone-800 pt-3">
        <span class="text-xs text-stone-500 font-bold block mb-2">Etsy Fee Options</span>
        <div class="grid grid-cols-2 gap-3">
          <label class="block">
            <span class="text-[10px] text-stone-400 mb-1 block">{l.paymentFee}</span>
            <input type="number" bind:value={processingFeePct} min="0" step="0.1"
              class="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-1.5 text-xs text-stone-100 focus:border-amber-500 focus:outline-none transition-colors" />
          </label>
          <label class="block">
            <span class="text-[10px] text-stone-400 mb-1 block">{l.paymentFixed}</span>
            <input type="number" bind:value={processingFeeFixed} min="0" step="0.01"
              class="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-1.5 text-xs text-stone-100 focus:border-amber-500 focus:outline-none transition-colors" />
          </label>
        </div>
      </div>

      <div>
        <span class="text-xs text-stone-400 mb-1.5 block">{l.offsiteAds}</span>
        <div class="grid grid-cols-3 gap-2 bg-stone-900 p-1 rounded-xl border border-stone-800">
          {#each ['0', '12', '15'] as val}
            <button
              onclick={() => adsType = val}
              class="py-1.5 text-xs font-semibold rounded-lg transition-all {adsType === val ? 'bg-amber-600 text-stone-950 shadow-sm' : 'text-stone-400 hover:text-stone-200'}">
              {val === '0' ? 'None' : `${val}%`}
            </button>
          {/each}
        </div>
      </div>
    </div>

    <!-- Results -->
    <div class="space-y-4">
      <div class="rounded-xl p-4 bg-amber-950/30 border border-amber-800/50 text-center">
        <p class="text-xs text-stone-400 mb-1">{l.profit}</p>
        <p class="text-4xl font-black {stats.netProfit >= 0 ? 'text-emerald-400' : 'text-red-400'}">{fmt(stats.netProfit)}</p>
        <p class="text-xs text-stone-500 mt-1">{l.margin}: <span class="font-bold text-stone-300">{stats.margin.toFixed(1)}%</span></p>
      </div>

      <!-- Costs Breakdown -->
      <div class="bg-stone-900 rounded-xl p-3 border border-stone-800 space-y-2 text-xs">
        <div class="flex justify-between border-b border-stone-800 pb-1.5">
          <span class="text-stone-500">{l.totalRevenue}</span>
          <span class="font-bold text-stone-200">{fmt(stats.revenue)}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-stone-500">{l.listingFeeLabel}</span>
          <span class="text-stone-300">{fmt(stats.listFee)}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-stone-500">{l.transFeeLabel}</span>
          <span class="text-stone-300">{fmt(stats.tFee)}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-stone-500">{l.payProcFeeLabel}</span>
          <span class="text-stone-300">{fmt(stats.pFee)}</span>
        </div>
        {#if parseFloat(adsType) > 0}
          <div class="flex justify-between">
            <span class="text-stone-500">{l.adsFeeLabel} ({adsType}%)</span>
            <span class="text-stone-300">{fmt(stats.aFee)}</span>
          </div>
        {/if}
        <div class="flex justify-between border-t border-stone-800 pt-1.5 font-bold">
          <span class="text-stone-400">{l.etsyFees}</span>
          <span class="text-amber-400">{fmt(stats.totalEtsyFees)}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-stone-500">{l.itemCost} + {l.shippingCost}</span>
          <span class="text-stone-300">{fmt(stats.totalCostOfProduct)}</span>
        </div>
        <div class="flex justify-between border-t border-stone-800 pt-1.5 font-bold">
          <span class="text-stone-400">{l.roi}</span>
          <span class={stats.roi >= 0 ? 'text-emerald-400' : 'text-red-400'}>{stats.roi.toFixed(1)}%</span>
        </div>
      </div>

      <button onclick={copyResult}
        class="w-full py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 {copied ? 'bg-emerald-700 text-white' : 'bg-amber-600 hover:bg-amber-500 text-stone-950'}">
        {copied ? l.copied : l.copyResult}
      </button>
    </div>
  </div>
  <p class="text-xs text-stone-600 mt-6 text-center">{l.disclaimer}</p>
</div>
