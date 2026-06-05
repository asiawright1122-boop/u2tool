<script lang="ts">
  interface Props {
    locale?: string;
    translations?: Record<string, unknown>;
  }

  let { locale = 'en', translations = {} }: Props = $props();

  const I18N_BACKUP: Record<string, Record<string, string>> = {
    zh: {
      title: 'PayPal 手续费计算器',
      subtitle: '快速计算 PayPal 交易手续费，支持买家/卖家双向换算',
      amount: '金额',
      rate: '费率百分比 (%)',
      fixedFee: '固定费用 ($)',
      calculateMode: '计算方向',
      toReceive: '我要实收该金额 (买家应付)',
      toSend: '我将发送该金额 (卖家实收)',
      totalFees: '总手续费',
      netAmount: '实收金额',
      amountToSend: '应付总额',
      feeRate: 'PayPal 费率预设',
      customRate: '自定义费率',
      copied: '✓ 已复制!',
      copyResult: '复制结果',
      disclaimer: '仅供参考。实际费率以 PayPal 官方最终结算为准。'
    },
    en: {
      title: 'PayPal Fee Calculator',
      subtitle: 'Calculate PayPal transaction fees and net payouts for sending & receiving',
      amount: 'Amount',
      rate: 'Fee Rate (%)',
      fixedFee: 'Fixed Fee ($)',
      calculateMode: 'Calculation Mode',
      toReceive: 'I want to receive (Buyer Pays)',
      toSend: 'I am sending (Seller Receives)',
      totalFees: 'Total Fees',
      netAmount: 'Net Received',
      amountToSend: 'Total to Send',
      feeRate: 'PayPal Rate Preset',
      customRate: 'Custom Rate',
      copied: '✓ Copied!',
      copyResult: 'Copy Result',
      disclaimer: 'For informational purposes only. Actual PayPal fees may vary.'
    },
    es: {
      title: 'Calculadora de Comisiones de PayPal',
      subtitle: 'Calcule tarifas netas y de envío para transacciones de PayPal',
      amount: 'Cantidad',
      rate: 'Tasa de Comisión (%)',
      fixedFee: 'Comisión Fija ($)',
      calculateMode: 'Modo de Cálculo',
      toReceive: 'Quiero recibir (El comprador paga)',
      toSend: 'Estoy enviando (El vendedor recibe)',
      totalFees: 'Comisiones Totales',
      netAmount: 'Neto Recibido',
      amountToSend: 'Total a Enviar',
      feeRate: 'Ajuste de Tarifa PayPal',
      customRate: 'Tarifa Personalizada',
      copied: '✓ ¡Copiado!',
      copyResult: 'Copiar Resultado',
      disclaimer: 'Solo para fines informativos. Las tarifas reales de PayPal pueden variar.'
    },
    pt: {
      title: 'Calculadora de Taxas do PayPal',
      subtitle: 'Calcule taxas e valor líquido a receber ou enviar no PayPal',
      amount: 'Valor',
      rate: 'Taxa (%)',
      fixedFee: 'Taxa Fixa ($)',
      calculateMode: 'Modo de Cálculo',
      toReceive: 'Quero receber (Comprador Paga)',
      toSend: 'Estou enviando (Vendedor Recebe)',
      totalFees: 'Taxas Totais',
      netAmount: 'Líquido Recebido',
      amountToSend: 'Total a Enviar',
      feeRate: 'Predefinição do PayPal',
      customRate: 'Taxa Personalizada',
      copied: '✓ Copiado!',
      copyResult: 'Copiar Resultado',
      disclaimer: 'Apenas para fins informativos. As taxas reais do PayPal podem variar.'
    },
    ja: {
      title: 'PayPal手数料計算シミュレーター',
      subtitle: 'ペイパル取引の手数料、受取金額、および支払金額をすばやく計算',
      amount: '金額',
      rate: '手数料率 (%)',
      fixedFee: '固定手数料 ($)',
      calculateMode: '計算モード',
      toReceive: '指定額を受け取りたい（支払人に請求）',
      toSend: '指定額を送金したい（受取人の実受取）',
      totalFees: '手数料合計',
      netAmount: '実受取額',
      amountToSend: '必要支払額',
      feeRate: 'PayPal手数料プリセット',
      customRate: 'カスタム手数料率',
      copied: '✓ コピーしました!',
      copyResult: '結果をコピー',
      disclaimer: '情報提供のみを目的としています。実際のPayPal手数料と異なる場合があります。'
    },
    fr: {
      title: 'Calculateur de Frais PayPal',
      subtitle: 'Calculez les frais de transaction PayPal et les montants nets à envoyer ou recevoir',
      amount: 'Montant',
      rate: 'Taux des Frais (%)',
      fixedFee: 'Frais Fixes ($)',
      calculateMode: 'Mode de Calcul',
      toReceive: 'Je veux recevoir (L\'acheteur paie)',
      toSend: 'J\'envoie (Le vendeur reçoit)',
      totalFees: 'Frais Totaux',
      netAmount: 'Montant Net Reçu',
      amountToSend: 'Total à Envoyer',
      feeRate: 'Tarification PayPal',
      customRate: 'Taux Personnalisé',
      copied: '✓ Copié !',
      copyResult: 'Copier le Résultat',
      disclaimer: 'À titre informatif uniquement. Les frais réels de PayPal peuvent différer.'
    },
    de: {
      title: 'PayPal Gebührenrechner',
      subtitle: 'Berechnen Sie Gebühren und Auszahlungen beim Senden oder Empfangen',
      amount: 'Betrag',
      rate: 'Gebührensatz (%)',
      fixedFee: 'Festgebühr ($)',
      calculateMode: 'Berechnungsmodus',
      toReceive: 'Ich möchte erhalten (Käufer zahlt)',
      toSend: 'Ich sende (Verkäufer erhält)',
      totalFees: 'Gebühren Gesamt',
      netAmount: 'Nettobetrag erhalten',
      amountToSend: 'Gesamt zu senden',
      feeRate: 'PayPal-Gebühren-Preset',
      customRate: 'Eigene Gebühr',
      copied: '✓ Kopiert!',
      copyResult: 'Ergebnis kopieren',
      disclaimer: 'Nur zu Informationszwecken. Tatsächliche PayPal-Gebühren können abweichen.'
    },
    ar: {
      title: 'حاسبة رسوم PayPal',
      subtitle: 'حساب رسوم باي بال والمبلغ الصافي المستلم أو المطلوب إرساله',
      amount: 'المبلغ',
      rate: 'نسبة الرسوم (%)',
      fixedFee: 'الرسوم الثابتة ($)',
      calculateMode: 'طريقة الحساب',
      toReceive: 'أريد استلام (المشتري يدفع)',
      toSend: 'أنا أقوم بالإرسال (البائع يستلم)',
      totalFees: 'إجمالي الرسوم',
      netAmount: 'الصافي المستلم',
      amountToSend: 'المبلغ الإجمالي للإرسال',
      feeRate: 'خيارات رسوم PayPal',
      customRate: 'رسوم مخصصة',
      copied: '✓ تم النسخ!',
      copyResult: 'نسخ النتيجة',
      disclaimer: 'لأغراض إعلامية فقط. قد تختلف رسوم PayPal الفعلية.'
    },
    ko: {
      title: 'PayPal 수수료 계산기',
      subtitle: 'PayPal 송금/수취 거래 수수료와 최종 정산 금액 계산',
      amount: '금액',
      rate: '수수료율 (%)',
      fixedFee: '고정 수수료 ($)',
      calculateMode: '계산 방식',
      toReceive: '실수령액 기준 (구매자 지불)',
      toSend: '송금액 기준 (판매자 실수령)',
      totalFees: '총 수수료',
      netAmount: '최종 실수령액',
      amountToSend: '총 송금/청구액',
      feeRate: 'PayPal 수수료 설정',
      customRate: '직접 입력',
      copied: '✓ 복사됨!',
      copyResult: '결과 복사',
      disclaimer: '단순 참고용입니다. 실제 PayPal 수수료와는 차이가 있을 수 있습니다.'
    },
    ru: {
      title: 'Калькулятор комиссии PayPal',
      subtitle: 'Рассчитайте комиссию PayPal и чистую сумму при отправке или получении',
      amount: 'Сумма',
      rate: 'Процент комиссии (%)',
      fixedFee: 'Фиксированная часть ($)',
      calculateMode: 'Режим расчета',
      toReceive: 'Я хочу получить (Покупатель платит)',
      toSend: 'Я отправляю (Продавец получит)',
      totalFees: 'Всего комиссий',
      netAmount: 'Чистыми к получению',
      amountToSend: 'Итого к отправке',
      feeRate: 'Шаблоны комиссий PayPal',
      customRate: 'Своя комиссия',
      copied: '✓ Скопировано!',
      copyResult: 'Скопировать результат',
      disclaimer: 'Только для ознакомления. Фактические комиссии PayPal могут отличаться.'
    }
  };

  const l = $derived(I18N_BACKUP[locale] || I18N_BACKUP['en']);

  // Presets mapping: label & rates
  const presets = [
    { id: 'us-standard', name: 'US Domestic (2.99% + $0.49)', r: 2.99, f: 0.49 },
    { id: 'us-checkout', name: 'US Online Checkout (3.49% + $0.49)', r: 3.49, f: 0.49 },
    { id: 'intl', name: 'International Sales (4.49% + $0.49)', r: 4.49, f: 0.49 },
    { id: 'custom', name: 'Custom Rate', r: 2.99, f: 0.49 }
  ];

  let selectedPreset = $state('us-standard');
  let mode = $state('toReceive'); // toReceive | toSend
  let inputAmount = $state('100');
  let customRate = $state('2.99');
  let customFixed = $state('0.49');
  let currency = $state('USD');

  const currencies = ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY', 'CNY', 'CHF'];
  const symbols: Record<string, string> = { USD: '$', EUR: '€', GBP: '£', CAD: 'CA$', AUD: 'A$', JPY: '¥', CNY: '¥', CHF: 'CHF' };
  const sym = $derived(symbols[currency] ?? currency);

  // Sync custom inputs when preset changes
  $effect(() => {
    const p = presets.find(item => item.id === selectedPreset);
    if (p && selectedPreset !== 'custom') {
      customRate = p.r.toString();
      customFixed = p.f.toString();
    }
  });

  const result = $derived((() => {
    const amt = parseFloat(inputAmount) || 0;
    const rPct = (parseFloat(customRate) || 0) / 100;
    const fixed = parseFloat(customFixed) || 0;

    if (amt <= 0) return null;

    if (mode === 'toReceive') {
      // Net Amount (desired) = (Total to Send - fixed) / (1 + rPct) -> No, standard formula:
      // To get 'amt' net, buyer pays: (amt + fixed) / (1 - rPct)
      const divider = 1 - rPct;
      const amountToSend = divider > 0 ? (amt + fixed) / divider : 0;
      const totalFees = amountToSend - amt;
      return { totalFees, netAmount: amt, amountToSend };
    } else {
      // Sent amount = amt. Recipient gets: amt - (amt * rPct + fixed)
      const totalFees = amt * rPct + fixed;
      const netAmount = Math.max(0, amt - totalFees);
      return { totalFees, netAmount, amountToSend: amt };
    }
  })());

  function fmt(v: number) {
    return sym + v.toLocaleString(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  let copied = $state(false);
  function copyResult() {
    if (!result) return;
    const text = `${l.title}\n` +
      `${mode === 'toReceive' ? l.toReceive : l.toSend}\n` +
      `${l.amount}: ${fmt(parseFloat(inputAmount) || 0)}\n` +
      `${l.totalFees}: ${fmt(result.totalFees)}\n` +
      `${l.netAmount}: ${fmt(result.netAmount)}\n` +
      `${l.amountToSend}: ${fmt(result.amountToSend)}`;

    navigator.clipboard.writeText(text).then(() => {
      copied = true;
      setTimeout(() => copied = false, 1800);
    });
  }
</script>

<div class="bg-stone-950 text-stone-100 p-5 rounded-2xl border border-stone-800 shadow-2xl font-sans min-h-[400px]">
  <!-- Header -->
  <div class="flex items-center gap-3 mb-6">
    <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-amber-700 flex items-center justify-center text-stone-950 font-black text-sm">%</div>
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
        <span class="text-xs text-stone-400 mb-2 block">{l.calculateMode}</span>
        <div class="grid grid-cols-2 gap-2 bg-stone-900 p-1 rounded-xl border border-stone-800">
          <button
            onclick={() => mode = 'toReceive'}
            class="py-2 text-xs font-semibold rounded-lg transition-all {mode === 'toReceive' ? 'bg-amber-600 text-stone-950 shadow-md' : 'text-stone-400 hover:text-stone-200'}">
            {l.toReceive.split('(')[0]}
          </button>
          <button
            onclick={() => mode = 'toSend'}
            class="py-2 text-xs font-semibold rounded-lg transition-all {mode === 'toSend' ? 'bg-amber-600 text-stone-950 shadow-md' : 'text-stone-400 hover:text-stone-200'}">
            {l.toSend.split('(')[0]}
          </button>
        </div>
      </div>

      <!-- Rate preset -->
      <label class="block">
        <span class="text-xs text-stone-400 mb-1 block">{l.feeRate}</span>
        <select bind:value={selectedPreset} class="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-2 text-sm text-stone-100 focus:border-amber-500 focus:outline-none transition-colors">
          {#each presets as p}
            <option value={p.id}>{p.id === 'custom' ? l.customRate : p.name}</option>
          {/each}
        </select>
      </label>

      <!-- Amount Input -->
      <label class="block">
        <span class="text-xs text-stone-400 mb-1 block">{l.amount}</span>
        <div class="relative">
          <span class="absolute left-3 top-2.5 text-stone-500 text-sm">{sym}</span>
          <input type="number" bind:value={inputAmount} min="0.01" step="0.01"
            class="w-full bg-stone-900 border border-stone-700 rounded-lg pl-8 pr-3 py-2 text-sm text-stone-100 focus:border-amber-500 focus:outline-none transition-colors" />
        </div>
      </label>

      <!-- Custom values -->
      <div class="grid grid-cols-2 gap-3">
        <label class="block">
          <span class="text-xs text-stone-400 mb-1 block">{l.rate}</span>
          <input type="number" bind:value={customRate} disabled={selectedPreset !== 'custom'} min="0" step="0.01"
            class="w-full bg-stone-900 border border-stone-700 disabled:opacity-50 rounded-lg px-3 py-2 text-sm text-stone-100 focus:border-amber-500 focus:outline-none transition-colors" />
        </label>
        <label class="block">
          <span class="text-xs text-stone-400 mb-1 block">{l.fixedFee}</span>
          <input type="number" bind:value={customFixed} disabled={selectedPreset !== 'custom'} min="0" step="0.01"
            class="w-full bg-stone-900 border border-stone-700 disabled:opacity-50 rounded-lg px-3 py-2 text-sm text-stone-100 focus:border-amber-500 focus:outline-none transition-colors" />
        </label>
      </div>
    </div>

    <!-- Results -->
    <div class="space-y-4">
      {#if result}
        <div class="rounded-xl p-4 bg-amber-950/30 border border-amber-800/50 text-center">
          <p class="text-xs text-stone-400 mb-1">{l.totalFees}</p>
          <p class="text-4xl font-black text-amber-400">{fmt(result.totalFees)}</p>
          <p class="text-xs text-stone-500 mt-1">({customRate}% + {sym}{customFixed})</p>
        </div>

        <div class="grid grid-cols-2 gap-2">
          <div class="bg-stone-900 rounded-xl p-3 border border-stone-800 text-center">
            <p class="text-xs text-stone-500">{l.netAmount}</p>
            <p class="text-emerald-400 font-extrabold text-lg mt-1">{fmt(result.netAmount)}</p>
          </div>
          <div class="bg-stone-900 rounded-xl p-3 border border-stone-800 text-center">
            <p class="text-xs text-stone-500">{l.amountToSend}</p>
            <p class="text-amber-300 font-extrabold text-lg mt-1">{fmt(result.amountToSend)}</p>
          </div>
        </div>

        <!-- Mode-specific guidance -->
        <div class="bg-stone-900 rounded-xl p-3 border border-stone-800 text-xs text-stone-400 space-y-1">
          {#if mode === 'toReceive'}
            <p>• Buyer pays <strong>{fmt(result.amountToSend)}</strong>.</p>
            <p>• PayPal charges <strong>{fmt(result.totalFees)}</strong> in fees.</p>
            <p>• You receive exactly <strong>{fmt(result.netAmount)}</strong>.</p>
          {:else}
            <p>• You send <strong>{fmt(result.amountToSend)}</strong>.</p>
            <p>• PayPal charges <strong>{fmt(result.totalFees)}</strong> in fees.</p>
            <p>• Recipient gets <strong>{fmt(result.netAmount)}</strong>.</p>
          {/if}
        </div>

        <button onclick={copyResult}
          class="w-full py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 {copied ? 'bg-emerald-700 text-white' : 'bg-amber-600 hover:bg-amber-500 text-stone-950'}">
          {copied ? l.copied : l.copyResult}
        </button>
      {:else}
        <div class="flex flex-col items-center justify-center h-48 text-stone-500">
          <span class="text-4xl mb-3">💵</span>
          <p class="text-sm">Enter transaction amount to calculate fees</p>
        </div>
      {/if}
    </div>
  </div>
  <p class="text-xs text-stone-600 mt-6 text-center">{l.disclaimer}</p>
</div>
