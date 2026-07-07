<script lang="ts">
  import {
    calculatePositionSize,
  } from '../../lib/position-size-helper';

  interface Props {
    locale?: string;
    translations?: Record<string, unknown>;
  }

  let { locale = 'en', translations = {} }: Props = $props();

  const I18N_BACKUP: Record<string, Record<string, string>> = {
    zh: {
      title: '仓位大小计算器',
      subtitle: '计算每笔交易所需的最佳股数、风险资金规模及占用仓位，确保账户回撤可控',
      accountSize: '账户总资金',
      riskPercent: '每笔交易风险比例',
      entryPrice: '入场价格',
      stopLossPrice: '止损价格',
      stopLossPercent: '止损比例',
      leverage: '杠杆倍数',
      stopLossMode: '止损确定方式',
      byPrice: '指定价格止损',
      byPercent: '百分比比例止损',
      shares: '需买入数量 (股)',
      totalCost: '仓位总价值',
      leverageCost: '保证金 (杠杆占用)',
      riskAmount: '预计最大风险金额',
      riskPerShare: '单股亏损风险',
      capitalPercent: '账户占用资金比例',
      copied: '✓ 已复制!',
      copyResult: '复制结果',
      formula: '计算公式',
      formulaText: '股数 = (总资金 × 风险比例) / (入场价 - 止损价)',
      disclaimer: '仅供参考，不构成任何投资建议。',
      placeholderText: '请输入账户资金、风险比例及买卖点以计算最佳仓位。',
      currency: '货币',
    },
    en: {
      title: 'Position Size Calculator',
      subtitle: 'Manage portfolio risk by calculating shares to buy, risk exposure, and capital requirements',
      accountSize: 'Account Balance',
      riskPercent: 'Account Risk',
      entryPrice: 'Entry Price',
      stopLossPrice: 'Stop Loss Price',
      stopLossPercent: 'Stop Loss',
      leverage: 'Leverage',
      stopLossMode: 'Stop Loss Mode',
      byPrice: 'By Stop Price',
      byPercent: 'By Percentage',
      shares: 'Position Size (shares)',
      totalCost: 'Position Value',
      leverageCost: 'Margin Required',
      riskAmount: 'Total Amount at Risk',
      riskPerShare: 'Risk per Share',
      capitalPercent: 'Account Allocated',
      copied: '✓ Copied!',
      copyResult: 'Copy Result',
      formula: 'Formula',
      formulaText: 'Shares = (Balance × Risk%) / (Entry Price - Stop Loss)',
      disclaimer: 'For informational purposes only. Not financial advice.',
      placeholderText: 'Enter account balance, risk, and price targets to calculate position size',
      currency: 'Currency',
    },
    es: {
      title: 'Calculadora de Tamaño de Posición',
      subtitle: 'Gestione el riesgo de su cartera calculando las acciones a comprar y la exposición al riesgo',
      accountSize: 'Saldo de Cuenta',
      riskPercent: 'Riesgo de Cuenta',
      entryPrice: 'Precio de Entrada',
      stopLossPrice: 'Precio de Stop Loss',
      stopLossPercent: 'Stop Loss',
      leverage: 'Apalancamiento',
      stopLossMode: 'Modo de Stop Loss',
      byPrice: 'Por Precio de Stop',
      byPercent: 'Por Porcentaje',
      shares: 'Tamaño de Posición (acciones)',
      totalCost: 'Valor de la Posición',
      leverageCost: 'Margen Requerido',
      riskAmount: 'Cantidad Total en Riesgo',
      riskPerShare: 'Riesgo por Acción',
      capitalPercent: 'Cuenta Asignada',
      copied: '¡Copiado!',
      copyResult: 'Copiar Resultado',
      formula: 'Fórmula',
      formulaText: 'Acciones = (Saldo × Riesgo%) / (Precio de Entrada - Stop)',
      disclaimer: 'Solo para fines informativos. No es asesoramiento financiero.',
      placeholderText: 'Ingrese el saldo, el riesgo y los precios objetivo para calcular el tamaño',
      currency: 'Moneda',
    },
    pt: {
      title: 'Calculadora de Tamanho de Posição',
      subtitle: 'Gerencie o risco do portfólio calculando as ações a comprar e a exposição ao risco',
      accountSize: 'Saldo da Conta',
      riskPercent: 'Risco da Conta',
      entryPrice: 'Preço de Entrada',
      stopLossPrice: 'Preço de Stop Loss',
      stopLossPercent: 'Stop Loss',
      leverage: 'Alavancagem',
      stopLossMode: 'Modo de Stop Loss',
      byPrice: 'Por Preço de Stop',
      byPercent: 'Por Porcentagem',
      shares: 'Tamanho da Posição (ações)',
      totalCost: 'Valor da Posição',
      leverageCost: 'Margem Necessária',
      riskAmount: 'Quantidade Total em Risco',
      riskPerShare: 'Risco por Ação',
      capitalPercent: 'Alocação da Conta',
      copied: 'Copiado!',
      copyResult: 'Copiar Resultado',
      formula: 'Fórmula',
      formulaText: 'Ações = (Saldo × Risco%) / (Preço de Entrada - Stop)',
      disclaimer: 'Apenas para fins informativos. Não é conselho financeiro.',
      placeholderText: 'Insira o saldo da conta, risco e metas de preço para calcular o tamanho',
      currency: 'Moeda',
    },
    ja: {
      title: 'ポジションサイズ計算シミュレーター',
      subtitle: '口座残高、リスク許容度、エントリー/ロスカット幅から最適な購入株数を算出します',
      accountSize: '口座資金',
      riskPercent: 'リスク許容度 (口座に対する%)',
      entryPrice: 'エントリー価格',
      stopLossPrice: 'ロスカット価格 (損切り値)',
      stopLossPercent: 'ロスカット幅',
      leverage: 'レバレッジ倍数',
      stopLossMode: 'ロスカット指定方法',
      byPrice: '損切り価格で指定',
      byPercent: '損切り割合で指定',
      shares: 'ポジションサイズ (推奨購入株数)',
      totalCost: '想定保有額 (総購入金額)',
      leverageCost: '必要証拠金 (レバレッジ適用)',
      riskAmount: '許容損失金額 (合計リスク)',
      riskPerShare: '1株あたり損失額',
      capitalPercent: '口座占有率',
      copied: 'コピーしました！',
      copyResult: '結果をコピー',
      formula: '計算式',
      formulaText: '株数 = (口座資金 × リスク%) / (エントリー価格 - ロスカット価格)',
      disclaimer: '情報提供のみを目的としています。投資勧誘ではありません。',
      placeholderText: '口座資金、リスク許容度、買い値、損切り幅を入力して適正購入株数を計算します',
      currency: '通貨',
    },
    fr: {
      title: 'Calculateur de Taille de Position',
      subtitle: 'Gérez le risque du portefeuille en calculant les actions à acheter et l\'exposition',
      accountSize: 'Solde du Compte',
      riskPercent: 'Risque du Compte',
      entryPrice: 'Prix d\'Entrée',
      stopLossPrice: 'Prix de Stop Loss',
      stopLossPercent: 'Stop Loss',
      leverage: 'Levier',
      stopLossMode: 'Mode de Stop Loss',
      byPrice: 'Par Prix de Stop',
      byPercent: 'Par Pourcentage',
      shares: 'Taille de Position (actions)',
      totalCost: 'Valeur de la Position',
      leverageCost: 'Marge Requise',
      riskAmount: 'Montant Total à Risque',
      riskPerShare: 'Risque par Action',
      capitalPercent: 'Allocation du Compte',
      copied: 'Copié !',
      copyResult: 'Copiar le Résultat',
      formula: 'Formule',
      formulaText: 'Actions = (Solde × Risque%) / (Prix d\'Entrée - Stop)',
      disclaimer: 'À titre informatif uniquement. Pas de conseil financier.',
      placeholderText: 'Saisissez le solde du compte, le risque et les prix pour calculer la taille',
      currency: 'Devise',
    },
    de: {
      title: 'Positionsgrößen-Rechner',
      subtitle: 'Verwalten Sie das Portfoliorisiko durch Berechnung der zu kaufenden Aktien und des Risikos',
      accountSize: 'Kontostand',
      riskPercent: 'Kontorisiko',
      entryPrice: 'Einstiegspreis',
      stopLossPrice: 'Stop-Loss-Preis',
      stopLossPercent: 'Stop-Loss',
      leverage: 'Hebel (Leverage)',
      stopLossMode: 'Stop-Loss-Modus',
      byPrice: 'Nach Stop-Preis',
      byPercent: 'Nach Prozentsatz',
      shares: 'Positionsgröße (Aktien)',
      totalCost: 'Positionswert',
      leverageCost: 'Benötigte Margin',
      riskAmount: 'Gesamtes Risiko',
      riskPerShare: 'Risiko pro Aktie',
      capitalPercent: 'Kontoallokation',
      copied: 'Kopiert!',
      copyResult: 'Ergebnis kopieren',
      formula: 'Formel',
      formulaText: 'Aktien = (Kontostand × Risiko%) / (Einstiegspreis - Stop-Loss)',
      disclaimer: 'Nur zu Informationszwecken. Keine Finanzberatung.',
      placeholderText: 'Geben Sie Kontostand, Risiko und Preisziele ein, um die Positionsgröße zu berechnen',
      currency: 'Währung',
    },
    ar: {
      title: 'حاسبة حجم الصفقة',
      subtitle: 'إدارة مخاطر محفظتك عن طريق حساب عدد الأسهم المطلوب شراؤها ومستوى المخاطرة',
      accountSize: 'رصيد الحساب',
      riskPercent: 'مخاطرة الحساب',
      entryPrice: 'سعر الدخول',
      stopLossPrice: 'سعر وقف الخسارة',
      stopLossPercent: 'وقف الخسارة',
      leverage: 'الرافعة المالية',
      stopLossMode: 'طريقة وقف الخسارة',
      byPrice: 'حسب سعر الوقف',
      byPercent: 'حسب النسبة المئوية',
      shares: 'حجم الصفقة (عدد الأسهم)',
      totalCost: 'قيمة الصفقة الإجمالية',
      leverageCost: 'الهامش المطلوب (الضمان)',
      riskAmount: 'إجمالي مبلغ المخاطرة',
      riskPerShare: 'المخاطرة لكل سهم',
      capitalPercent: 'تخصيص الحساب',
      copied: 'تم النسخ!',
      copyResult: 'نسخ النتيجة',
      formula: 'المعادلة',
      formulaText: 'الأسهم = (الرصيد × المخاطرة%) / (سعر الدخول - وقف الخسارة)',
      disclaimer: 'لأغراض إعلامية فقط. لا يعتبر نصيحة مالية.',
      placeholderText: 'أدخل رصيد الحساب والمخاطرة وأهداف الأسعار لحساب حجم الصفقة',
      currency: 'العملة',
    },
    ko: {
      title: '포지션 사이즈 계산기',
      subtitle: '진입가, 손절가, 리스크 비율을 설정하여 최적의 매수 주식 수와 위험 금액을 계산합니다',
      accountSize: '계좌 총 자산',
      riskPercent: '거래당 허용 리스크 비율',
      entryPrice: '진입 가격',
      stopLossPrice: '손절 가격 (스톱로스)',
      stopLossPercent: '손절 비율',
      leverage: '레버리지 배수',
      stopLossMode: '손절 설정 방식',
      byPrice: '손절 가격 지정',
      byPercent: '손절 비율 지정',
      shares: '진입 수량 (주)',
      totalCost: '포지션 평가 가치',
      leverageCost: '필요 증거금 (레버리지 적용)',
      riskAmount: '예상 최대 손실 자산',
      riskPerShare: '주당 리스크 금액',
      capitalPercent: '자산 대비 진입 비율',
      copied: '복사 완료!',
      copyResult: '결과 복사',
      formula: '수식',
      formulaText: '수량 = (총 자산 × 리스크%) / (진입가 - 손절가)',
      disclaimer: '단순 참고용입니다. 투자 권유가 아닙니다.',
      placeholderText: '계좌 자산, 리스크 비율, 매수가 및 손절폭을 입력하여 적정 포지션 수량을 계산해보세요',
      currency: '화폐',
    },
    ru: {
      title: 'Калькулятор размера позиции',
      subtitle: 'Управление рисками портфеля путем расчета количества акций к покупке и общей суммы риска',
      accountSize: 'Баланс счета',
      riskPercent: 'Риск на сделку',
      entryPrice: 'Цена входа',
      stopLossPrice: 'Цена стоп-лосса',
      stopLossPercent: 'Стоп-лосс',
      leverage: 'Кредитное плечо',
      stopLossMode: 'Режим стоп-лосса',
      byPrice: 'По цене стопа',
      byPercent: 'В процентах',
      shares: 'Размер позиции (акций)',
      totalCost: 'Общая стоимость позиции',
      leverageCost: 'Требуемая маржа',
      riskAmount: 'Общая сумма под риском',
      riskPerShare: 'Риск на одну акцию',
      capitalPercent: 'Доля счета в позиции',
      copied: 'Скопировано!',
      copyResult: 'Скопировать результат',
      formula: 'Формула',
      formulaText: 'Акции = (Баланс × Риск%) / (Цена входа - Стоп-лосс)',
      disclaimer: 'Только для ознакомления. Не является финансовой рекомендацией.',
      placeholderText: 'Введите баланс счета, риск и ценовые уровни для расчета размера позиции',
      currency: 'Валюта',
    },
  };

  const l = $derived(I18N_BACKUP[locale] || I18N_BACKUP['en']);

  let accountSize = $state('10000');
  let riskPercent = $state('2');
  let entryPrice = $state('50');
  let mode = $state('price'); // price | percent
  let stopLossPrice = $state('45');
  let stopLossPercent = $state('10');
  let leverage = $state('1');
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
    const as = parseFloat(accountSize) || 0;
    const rp = parseFloat(riskPercent) || 0;
    const ep = parseFloat(entryPrice) || 0;
    const lev = parseFloat(leverage) || 1;

    if (as <= 0 || rp <= 0 || ep <= 0) return null;

    const calcInput: any = {
      accountSize: as,
      riskPercent: rp,
      entryPrice: ep,
      leverage: lev,
    };

    if (mode === 'price') {
      calcInput.stopLossPrice = parseFloat(stopLossPrice) || 0;
    } else {
      calcInput.stopLossPercent = parseFloat(stopLossPercent) || 0;
    }

    const res = calculatePositionSize(calcInput);

    return {
      ...res,
      as,
      rp,
      ep,
      lev,
    };
  })());

  const sym = $derived(symbols[currency] ?? currency);
  function fmt(v: number) {
    return sym + v.toLocaleString(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
  function fmtWhole(v: number) {
    return v.toLocaleString(locale, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  }

  let copied = $state(false);
  function copyResult() {
    if (!result) return;
    let text = `${l.title}\n`;
    text += `${l.accountSize}: ${fmtWhole(result.as)}\n`;
    text += `${l.riskPercent}: ${result.rp}%\n`;
    text += `${l.entryPrice}: ${sym}${result.ep}\n`;
    text += `${l.stopLossPrice}: ${sym}${result.stopLossPrice.toFixed(2)}\n`;
    text += `${l.shares}: ${fmtWhole(result.shares)}\n`;
    text += `${l.totalCost}: ${fmt(result.totalCost)}\n`;

    if (result.lev > 1) {
      text += `${l.leverage}: ${result.lev}x\n`;
      text += `${l.leverageCost}: ${fmt(result.leverageCost)}\n`;
    }

    text += `${l.riskAmount}: ${fmt(result.riskAmount)}\n`;
    text += `${l.riskPerShare}: ${sym}${result.riskPerShare.toFixed(2)}\n`;
    text += `${l.capitalPercent}: ${result.capitalPercent.toFixed(1)}%\n`;

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
      <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-700 flex items-center justify-center text-stone-950 font-black text-lg">
        🛡️
      </div>
      <div>
        <h2 class="font-extrabold text-lg text-amber-700 dark:bg-gradient-to-r dark:from-amber-300 dark:via-amber-100 dark:to-amber-400 dark:bg-clip-text dark:text-transparent leading-tight">
          {l.title}
        </h2>
        <p class="text-stone-500 text-xs mt-0.5">{l.subtitle}</p>
      </div>
    </div>
    <div class="sm:ml-auto">
      <select bind:value={currency} class="bg-stone-900 border border-stone-700 text-stone-200 text-xs rounded-lg px-2.5 py-1.5 cursor-pointer focus:border-amber-500 focus:outline-none transition-colors">
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
        <span class="text-xs text-stone-400 mb-1.5 block">{l.accountSize} ({sym})</span>
        <input
          type="number"
          bind:value={accountSize}
          min="1"
          step="100"
          class="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-2.5 text-sm text-stone-100 focus:border-amber-500 focus:outline-none transition-colors"
        />
      </label>

      <div class="grid grid-cols-2 gap-3">
        <label class="block">
          <span class="text-xs text-stone-400 mb-1.5 block">{l.riskPercent} (%)</span>
          <input
            type="number"
            bind:value={riskPercent}
            min="0.1"
            max="100"
            step="0.5"
            class="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-2.5 text-sm text-stone-100 focus:border-amber-500 focus:outline-none transition-colors"
          />
        </label>

        <label class="block">
          <span class="text-xs text-stone-400 mb-1.5 block">{l.leverage} (x)</span>
          <input
            type="number"
            bind:value={leverage}
            min="1"
            max="100"
            step="1"
            class="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-2.5 text-sm text-stone-100 focus:border-amber-500 focus:outline-none transition-colors"
          />
        </label>
      </div>

      <label class="block">
        <span class="text-xs text-stone-400 mb-1.5 block">{l.entryPrice} ({sym})</span>
        <input
          type="number"
          bind:value={entryPrice}
          min="0.001"
          step="0.5"
          class="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-2.5 text-sm text-stone-100 focus:border-amber-500 focus:outline-none transition-colors"
        />
      </label>

      <!-- Mode selection and conditional input -->
      <div class="border-t border-stone-800/80 pt-4 space-y-4">
        <div>
          <span class="text-xs text-stone-400 mb-1.5 block">{l.stopLossMode}</span>
          <div class="grid grid-cols-2 gap-2">
            <button
              type="button"
              onclick={() => (mode = 'price')}
              class="py-2 text-xs font-semibold rounded-lg border transition-all {mode === 'price' ? 'bg-amber-950/40 border-amber-600 text-amber-400' : 'bg-stone-900 border-stone-800 text-stone-400 hover:border-stone-700'}"
            >
              {l.byPrice}
            </button>
            <button
              type="button"
              onclick={() => (mode = 'percent')}
              class="py-2 text-xs font-semibold rounded-lg border transition-all {mode === 'percent' ? 'bg-amber-950/40 border-amber-600 text-amber-400' : 'bg-stone-900 border-stone-800 text-stone-400 hover:border-stone-700'}"
            >
              {l.byPercent}
            </button>
          </div>
        </div>

        {#if mode === 'price'}
          <label class="block">
            <span class="text-xs text-stone-400 mb-1.5 block">{l.stopLossPrice} ({sym})</span>
            <input
              type="number"
              bind:value={stopLossPrice}
              min="0.001"
              step="0.5"
              class="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-2.5 text-sm text-stone-100 focus:border-amber-500 focus:outline-none transition-colors"
            />
          </label>
        {:else}
          <label class="block">
            <span class="text-xs text-stone-400 mb-1.5 block">{l.stopLossPercent} (%)</span>
            <input
              type="number"
              bind:value={stopLossPercent}
              min="0.1"
              max="99.9"
              step="1"
              class="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-2.5 text-sm text-stone-100 focus:border-amber-500 focus:outline-none transition-colors"
            />
          </label>
        {/if}
      </div>
    </div>

    <!-- Right panel: Results (span 7) -->
    <div class="md:col-span-7 flex flex-col justify-between space-y-4">
      {#if result && result.shares > 0}
        <div class="space-y-4">
          <!-- Big Shares Display -->
          <div class="rounded-xl p-5 bg-amber-950/20 border border-amber-800/30 text-center relative overflow-hidden">
            <div class="absolute -right-6 -bottom-6 text-7xl opacity-5 select-none">🛡️</div>
            <p class="text-xs text-stone-400 mb-1">{l.shares}</p>
            <p class="text-5xl font-black text-amber-400 tracking-tight">
              {fmtWhole(result.shares)}
            </p>
            <p class="text-xs text-stone-500 mt-2">
              {l.totalCost}: <span class="text-amber-300 font-semibold">{fmt(result.totalCost)}</span>
            </p>
          </div>

          <!-- Risk Info Card -->
          <div class="bg-stone-900 border border-stone-800 rounded-xl p-4 space-y-3">
            <div class="flex items-center justify-between text-xs">
              <span class="text-stone-400">{l.riskAmount}</span>
              <span class="text-red-400 font-bold">{fmt(result.riskAmount)}</span>
            </div>
            <div class="flex items-center justify-between text-xs">
              <span class="text-stone-400">{l.riskPerShare}</span>
              <span class="text-stone-300 font-semibold">{sym}{result.riskPerShare.toFixed(2)} / share</span>
            </div>
            <div class="flex items-center justify-between text-xs">
              <span class="text-stone-400">{l.capitalPercent}</span>
              <span class="text-stone-300 font-semibold">{result.capitalPercent.toFixed(1)}%</span>
            </div>
            {#if result.lev > 1}
              <div class="border-t border-stone-850 pt-2 flex items-center justify-between text-xs">
                <span class="text-stone-450">{l.leverageCost}</span>
                <span class="text-amber-400 font-bold">{fmt(result.leverageCost)}</span>
              </div>
            {/if}
          </div>
        </div>

        <!-- Copy / Action Buttons -->
        <div class="flex items-center gap-3 pt-4 border-t border-stone-900">
          <button
            type="button"
            onclick={copyResult}
            class="flex-1 bg-stone-900 hover:bg-stone-850 border border-stone-800 text-stone-200 hover:text-stone-100 text-xs font-semibold py-2.5 px-4 rounded-lg transition-all flex items-center justify-center gap-2"
          >
            {#if copied}
              <span class="text-amber-400">{l.copied}</span>
            {:else}
              <span>📋 {l.copyResult}</span>
            {/if}
          </button>
        </div>
      {:else}
        <!-- Empty / Error Placeholder -->
        <div class="h-full flex flex-col items-center justify-center text-center p-8 bg-stone-900/25 border border-dashed border-stone-850 rounded-xl">
          <div class="text-3xl mb-3">🛡️</div>
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
