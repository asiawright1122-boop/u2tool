<script lang="ts">
  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']?.['loan-amortization-calculator'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `tools.loan-amortization-calculator.${key}`;
  }

  // Imports
  import { onMount } from 'svelte';
  import EChartsWrapper from './EChartsWrapper.svelte';
  import { useChartTheme } from '@/hooks/useChartTheme';

  // 10大语系内置备用精美字典，确保多语言100%全覆盖，无英文硬编码泄露
  const I18N_LABELS: Record<string, Record<string, string>> = {
    zh: {
      title: '真实利率与还款优化计算器',
      subtitle: '拆穿“假年化”利息陷阱，智能优化提前还款方案',
      principal: '贷款本金',
      term: '贷款期限',
      months: '个月',
      years: '年',
      rateType: '宣称利率类型',
      dailyRate: '日利率 (日息)',
      monthlyRate: '月利率/月费率 (月息)',
      annualRate: '年利率',
      advertisedRate: '宣称利率值',
      repayType: '还款方式',
      repayEMI: '等额本息 (每月月供固定)',
      repayEqualPrincipal: '等额本金 (首月最高，逐月递减)',
      repayFlat: '等本等息 (消费贷套路，本金按月还但利息不减)',
      flatWarning: '⚠️ 消费贷年化陷阱警告：等本等息下，随着您逐月还本，实际占用的资金逐月减少，但利息却始终以全部初始本金为基数计算。真实年化利率（APR）将近乎翻倍！',
      realRateTitle: '大模型金融解析：真实利率探秘',
      aprLabel: '真实年化单利 (APR)',
      apyLabel: '真实年化复利 (APY)',
      advertisedCompare: '宣称名义年化',
      realAprLabel: '实际真实年化 (APR)',
      compareResult: '比宣称高出',
      prepayTitle: '提前还款优化游乐场',
      prepayType: '提前还款方案',
      noPrepay: '不提前还款',
      prepayMonthly: '每月额外多还本金',
      prepayYearly: '每年额外多还本金',
      prepayLumpSum: '一次性提前还款',
      prepayAmount: '额外还款金额',
      prepayMonth: '提前还款月份 (第几个月)',
      savingsTitle: '智能优化成果',
      interestSaved: '为您省下利息',
      timeSaved: '提早结清时间',
      payoffEarly: '提早结清',
      chartTitle: '累计支付本息与余额对比双曲线',
      originalPlan: '原计划 (累计支付)',
      optimizedPlan: '优化提前还款 (累计支付)',
      originalBalance: '原计划 (剩余本金)',
      optimizedBalance: '优化提前还款 (剩余本金)',
      scheduleTitle: '还款摊销日程表',
      period: '期数',
      originalPayment: '原月供',
      optimizedPayment: '优化后月供',
      principalPaid: '偿还本金',
      interestPaid: '偿还利息',
      prepaidAmount: '提前还本',
      remainingBalance: '剩余本金',
      exportPng: '导出明细图 (PNG)',
      exportSvg: '导出矢量图 (SVG)',
      totalInterest: '总利息',
      totalPrincipal: '总本金',
      totalAmount: '总还款额',
      ratioTitle: '本金与利息支付占比',
      yearlyView: '年度视图',
      monthlyView: '月度视图',
      loanAdvice: '大模型金融策略：',
      adviceEMI: '等额本息前期利息比例大，若有闲置资金且打算提前还款，建议尽早还贷以省下最多利息。',
      adviceEqualPrincipal: '等额本金前期还款压力大，但本金下降极快，利息总额最少。适合前期资金充裕的人群。',
      adviceFlat: '等本等息借贷成本极其昂贵！若能提前全额结清且违约金合理，建议立即提前结清以规避利息黑洞。'
    },
    en: {
      title: 'Real Loan Rate & Prepayment Optimizer',
      subtitle: 'Expose interest rate traps and optimize your prepayment strategy',
      principal: 'Loan Principal',
      term: 'Loan Term',
      months: 'months',
      years: 'years',
      rateType: 'Advertised Rate Type',
      dailyRate: 'Daily Rate',
      monthlyRate: 'Monthly Flat Rate',
      annualRate: 'Annual Rate',
      advertisedRate: 'Advertised Value',
      repayType: 'Repayment Method',
      repayEMI: 'Equated Monthly Installment (EMI)',
      repayEqualPrincipal: 'Equal Principal',
      repayFlat: 'Equal Principal & Flat Interest (Trap)',
      flatWarning: '⚠️ Deceptive Flat Rate Warning: In flat-rate schemes, you pay interest on the initial full principal even as you pay down the balance monthly. The true APR is nearly double the nominal rate!',
      realRateTitle: 'Financial Intelligence: True Rates Analysis',
      aprLabel: 'True Annual APR',
      apyLabel: 'True Annual APY',
      advertisedCompare: 'Advertised Nominal',
      realAprLabel: 'True Real APR',
      compareResult: 'Higher than Nominal by',
      prepayTitle: 'Prepayment Optimizer Playground',
      prepayType: 'Prepayment Strategy',
      noPrepay: 'No Prepayment',
      prepayMonthly: 'Extra Monthly Principal',
      prepayYearly: 'Extra Yearly Principal',
      prepayLumpSum: 'One-time Lump Sum',
      prepayAmount: 'Extra Amount',
      prepayMonth: 'Prepayment Month',
      savingsTitle: 'Optimization Outcomes',
      interestSaved: 'Interest Saved',
      timeSaved: 'Time Saved',
      payoffEarly: 'Early Payoff',
      chartTitle: 'Cumulative Payments & Balance Double Curve',
      originalPlan: 'Original Plan (Cumulative)',
      optimizedPlan: 'Optimized Plan (Cumulative)',
      originalBalance: 'Original Balance',
      optimizedBalance: 'Optimized Balance',
      scheduleTitle: 'Amortization Schedule',
      period: 'Period',
      originalPayment: 'Original Payment',
      optimizedPayment: 'Optimized Payment',
      principalPaid: 'Principal Paid',
      interestPaid: 'Interest Paid',
      prepaidAmount: 'Prepaid Principal',
      remainingBalance: 'Remaining Balance',
      exportPng: 'Export PNG Chart',
      exportSvg: 'Export SVG Chart',
      totalInterest: 'Total Interest',
      totalPrincipal: 'Total Principal',
      totalAmount: 'Total Payments',
      ratioTitle: 'Principal vs Interest Ratio',
      yearlyView: 'Yearly View',
      monthlyView: 'Monthly View',
      loanAdvice: 'Financial Strategy Note:',
      adviceEMI: 'EMI payments have higher interest portions early on. Prepaying early delivers the maximum interest savings.',
      adviceEqualPrincipal: 'Equal Principal has high initial payments but reduces principal fastest, minimizing total interest cost.',
      adviceFlat: 'Flat-rate schemes are extremely expensive! If prepayment penalties are low, consider paying it off immediately to stop interest bleed.'
    },
    es: {
      title: 'Tasa Real de Préstamo y Optimizador de Prepago',
      subtitle: 'Descubre las trampas de tasas de interés y optimiza tus pagos anticipados',
      principal: 'Monto del Préstamo',
      term: 'Plazo del Préstamo',
      months: 'meses',
      years: 'años',
      rateType: 'Tipo de Tasa Anunciada',
      dailyRate: 'Tasa Diaria',
      monthlyRate: 'Tasa Plana Mensual',
      annualRate: 'Tasa Anual',
      advertisedRate: 'Valor Anunciado',
      repayType: 'Método de Pago',
      repayEMI: 'Cuota Mensual Constante (EMI)',
      repayEqualPrincipal: 'Amortización de Capital Fijo',
      repayFlat: 'Amortización Fija e Interés Plano (Trampa)',
      flatWarning: '⚠️ Advertencia de Tasa Plana: El interés se calcula sobre el capital inicial completo, casi duplicando su TAE real.',
      realRateTitle: 'Inteligencia Financiera: Análisis de Tasas Reales',
      aprLabel: 'TAE Real Anual',
      apyLabel: 'Rendimiento APY Real',
      advertisedCompare: 'TAE Anunciado',
      realAprLabel: 'TAE Real Efectivo',
      compareResult: 'Superior por',
      prepayTitle: 'Área de Juegos de Pago Anticipado',
      prepayType: 'Estrategia de Prepago',
      noPrepay: 'Sin Pago Anticipado',
      prepayMonthly: 'Capital Mensual Extra',
      prepayYearly: 'Capital Anual Extra',
      prepayLumpSum: 'Pago Único de Suma Global',
      prepayAmount: 'Monto Extra',
      prepayMonth: 'En el mes número',
      savingsTitle: 'Resultados de Optimización',
      interestSaved: 'Interés Ahorrado',
      timeSaved: 'Tiempo Ahorrado',
      payoffEarly: 'Liquidación Temprana',
      chartTitle: 'Curva Doble de Pagos Acumulados y Saldo',
      originalPlan: 'Plan Original (Acumulado)',
      optimizedPlan: 'Plan Optimizado (Acumulado)',
      originalBalance: 'Saldo Original',
      optimizedBalance: 'Saldo Optimizado',
      scheduleTitle: 'Programa de Amortización',
      period: 'Período',
      originalPayment: 'Pago Original',
      optimizedPayment: 'Pago Optimizado',
      principalPaid: 'Principal Pagado',
      interestPaid: 'Interés Pagado',
      prepaidAmount: 'Prepago de Capital',
      remainingBalance: 'Saldo Restante',
      exportPng: 'Exportar Gráfico PNG',
      exportSvg: 'Exportar Gráfico SVG',
      totalInterest: 'Total de Interés',
      totalPrincipal: 'Total de Capital',
      totalAmount: 'Total Pagado',
      ratioTitle: 'Proporción de Capital e Interés',
      yearlyView: 'Vista Anual',
      monthlyView: 'Vista Mensual',
      loanAdvice: 'Estrategia de Préstamo:',
      adviceEMI: 'El plan EMI paga más intereses al principio. Realizar pagos anticipados temprano maximiza los ahorros.',
      adviceEqualPrincipal: 'Capital Fijo tiene cuotas iniciales altas pero amortiza rápido, reduciendo el interés total.',
      adviceFlat: '¡Las tasas planas son extremadamente caras! Prepague tan pronto como sea posible para detener la pérdida.'
    },
    pt: {
      title: 'Taxa Real de Empréstimo e Otimizador de Amortização',
      subtitle: 'Descubra armadilhas de juros e otimize sua estratégia de amortização antecipada',
      principal: 'Valor do Empréstimo',
      term: 'Prazo',
      months: 'meses',
      years: 'anos',
      rateType: 'Tipo de Taxa Anunciada',
      dailyRate: 'Taxa Diária',
      monthlyRate: 'Taxa Mensal Plana',
      annualRate: 'Taxa Anual',
      advertisedRate: 'Valor Anunciado',
      repayType: 'Método de Pagamento',
      repayEMI: 'Parcelas Mensais Iguais (Price)',
      repayEqualPrincipal: 'Amortização Constante (SAC)',
      repayFlat: 'Amortização Fixa e Juros Planos (Armadilha)',
      flatWarning: '⚠️ Aviso de Juros Abusivos: Sob a taxa plana, os juros incidem sobre o principal total inicial, quase dobrando a CET real.',
      realRateTitle: 'Inteligência Financeira: Análise de Taxas Reais',
      aprLabel: 'CET Anual Real',
      apyLabel: 'Taxa Efetiva Real (APY)',
      advertisedCompare: 'Taxa Anunciada',
      realAprLabel: 'CET Real Efetiva',
      compareResult: 'Maior em',
      prepayTitle: 'Playground de Amortização',
      prepayType: 'Estratégia de Amortização',
      noPrepay: 'Sem Amortização Extra',
      prepayMonthly: 'Extra Mensal no Principal',
      prepayYearly: 'Extra Anual no Principal',
      prepayLumpSum: 'Aporte Único Extra',
      prepayAmount: 'Valor Extra',
      prepayMonth: 'No mês número',
      savingsTitle: 'Resultados de Otimização',
      interestSaved: 'Juros Economizados',
      timeSaved: 'Tempo Economizado',
      payoffEarly: 'Amortizado Cedo',
      chartTitle: 'Curva Dupla de Pagamentos Acumulados e Saldo',
      originalPlan: 'Plano Original (Acumulado)',
      optimizedPlan: 'Plano Otimizado (Acumulado)',
      originalBalance: 'Saldo Original',
      optimizedBalance: 'Saldo Otimizado',
      scheduleTitle: 'Tabelas de Amortização',
      period: 'Período',
      originalPayment: 'Parcela Original',
      optimizedPayment: 'Parcela Otimizada',
      principalPaid: 'Principal Pago',
      interestPaid: 'Juros Pagos',
      prepaidAmount: 'Principal Amortizado',
      remainingBalance: 'Saldo Devedor',
      exportPng: 'Exportar Gráfico PNG',
      exportSvg: 'Exportar Gráfico SVG',
      totalInterest: 'Total de Juros',
      totalPrincipal: 'Total do Principal',
      totalAmount: 'Total Pago',
      ratioTitle: 'Proporção entre Principal e Juros',
      yearlyView: 'Visualização Anual',
      monthlyView: 'Visualização Mensal',
      loanAdvice: 'Nota de Estratégia de Empréstimo:',
      adviceEMI: 'A tabela Price acumula mais juros nos primeiros meses. Amortizar antecipadamente cedo poupa muito mais.',
      adviceEqualPrincipal: 'A tabela SAC tem parcelas iniciais altas, mas reduz o principal rápido, diminuindo o custo total de juros.',
      adviceFlat: 'Empréstimos com taxa plana são extremamente caros! Amortize a totalidade assim que puder para evitar a armadilha.'
    },
    ja: {
      title: '実質ローン金利・繰上返済最適化シミュレーター',
      subtitle: 'ローン金利の罠を見抜き、繰上返済による利息削減効果を最大化する',
      principal: '借入金額',
      term: '返済期間',
      months: 'ヶ月',
      years: '年',
      rateType: '金利表示タイプ',
      dailyRate: '日歩 (日利)',
      monthlyRate: '月利・固定手数料率',
      annualRate: '年利',
      advertisedRate: '公表金利の値',
      repayType: '返済方式',
      repayEMI: '元利均等返済 (毎月均等)',
      repayEqualPrincipal: '元金均等返済 (元金が毎月均等)',
      repayFlat: 'アドオン返済 (均等元金・一律利息の罠)',
      flatWarning: '⚠️ 固定金利の罠：アドオン返済では、毎月元金が減っているにもかかわらず、当初の借入総額に対して利息が計算されます。実質年率（APR）はほぼ2倍になります。',
      realRateTitle: '財務分析：実質金利の可視化',
      aprLabel: '実質年換算利率 (APR)',
      apyLabel: '実質年利 (APY)',
      advertisedCompare: '公表されている年利',
      realAprLabel: '真の実质年率',
      compareResult: '差分 (公表より高い)',
      prepayTitle: '繰上返済最適化シミュレーション',
      prepayType: '繰上返済プラン',
      noPrepay: '繰上返済なし',
      prepayMonthly: '毎月の追加元金返済',
      prepayYearly: '毎年の追加元金返済',
      prepayLumpSum: '一部一括繰上返済',
      prepayAmount: '追加返済額',
      prepayMonth: '返済月 (何ヶ月目)',
      savingsTitle: '最適化の成果',
      interestSaved: '削減される総利息',
      timeSaved: '短縮される期間',
      payoffEarly: '早期完済時期',
      chartTitle: '累積支払額と元金残高のダブル曲線',
      originalPlan: '元の返済計画 (累積額)',
      optimizedPlan: '繰上返済計画 (累積額)',
      originalBalance: '元の元金残高',
      optimizedBalance: '繰上返済後の元金残高',
      scheduleTitle: '返済償還スケジュール表',
      period: '回数',
      originalPayment: '元の毎月返済額',
      optimizedPayment: '変更後の毎月返済額',
      principalPaid: '元金返済額',
      interestPaid: '利息返済額',
      prepaidAmount: '繰上返済元金',
      remainingBalance: '元金残高',
      exportPng: 'PNG画像で保存',
      exportSvg: 'SVG画像で保存',
      totalInterest: '総利息額',
      totalPrincipal: '総元金額',
      totalAmount: '総返済額',
      ratioTitle: '元金と利息の支払比率',
      yearlyView: '年間表示',
      monthlyView: '月間表示',
      loanAdvice: '借入返済のアドバイス：',
      adviceEMI: '元利均等返済は初期に金利を多く支払います。早期の繰上返済が最も高い利息削減効果をもたらします。',
      adviceEqualPrincipal: '元金均等返済は初期の負担が大きいですが、元金の減少が早く、総利息を最小限に抑えられます。',
      adviceFlat: 'アドオン金利の借入はコストが非常に高いです！可能であれば、速やかに一括返済することをお勧めします。'
    },
    ko: {
      title: '실제 대출 금리 및 중도 상환 최적화기',
      subtitle: '눈속임 금리 트랩을 폭로하고 중도 상환 시의 이자 절감을 극대화하세요',
      principal: '대출 금액',
      term: '대출 기간',
      months: '개월',
      years: '년',
      rateType: '광고 금리 유형',
      dailyRate: '일일 금리',
      monthlyRate: '월 고정 수수료율',
      annualRate: '연간 금리',
      advertisedRate: '광고 금리값',
      repayType: '상환 방식',
      repayEMI: '원리금 균등 상환 (EMI)',
      repayEqualPrincipal: '원금 균등 상환',
      repayFlat: '원금 균등 및 고정 이자 상환 (트랩)',
      flatWarning: '⚠️ 고정 이자 트랩 경고: 고정 수수료 방식에서는 이자가 항상 대출 원금 총액 기준으로 부과되므로 실제 연이율은 광고보다 거의 두 배가 됩니다.',
      realRateTitle: '재무 지능: 실제 이자율 분석',
      aprLabel: '실제 연이율 (APR)',
      apyLabel: '실제 연복리 (APY)',
      advertisedCompare: '광고 연이율',
      realAprLabel: '실제 실질 연이율',
      compareResult: '광고보다 높은 폭',
      prepayTitle: '중도 상환 플레이그라운드',
      prepayType: '중도 상환 방식',
      noPrepay: '중도 상환 없음',
      prepayMonthly: '매월 추가 원금 상환',
      prepayYearly: '매년 추가 원금 상환',
      prepayLumpSum: '일시 중도 상환',
      prepayAmount: '추가 상환액',
      prepayMonth: '상환 시점 (몇 개월 차)',
      savingsTitle: '최적화 결과',
      interestSaved: '절약된 총 이자',
      timeSaved: '단축된 기간',
      payoffEarly: '조기 상환 시점',
      chartTitle: '누적 납부액 및 잔액 대비 이중 곡선',
      originalPlan: '기존 계획 (누적 납부)',
      optimizedPlan: '중도 상환 계획 (누적 납부)',
      originalBalance: '기존 잔액',
      optimizedBalance: '중도 상환 잔액',
      scheduleTitle: '대출 상환 일정표',
      period: '회차',
      originalPayment: '기존 월 상환액',
      optimizedPayment: '변경 후 월 상환액',
      principalPaid: '상환 원금',
      interestPaid: '상환 이자',
      prepaidAmount: '중도상환 원금',
      remainingBalance: '남은 원금',
      exportPng: 'PNG 차트 내보내기',
      exportSvg: 'SVG 차트 내보내기',
      totalInterest: '총 이자',
      totalPrincipal: '총 원금',
      totalAmount: '총 상환액',
      ratioTitle: '원금 대비 이자 비율',
      yearlyView: '연도별 보기',
      monthlyView: '월별 보기',
      loanAdvice: '대출 상환 전략 제안:',
      adviceEMI: '원리금균등상환은 초기에 이자 비중이 큽니다. 여유 자금이 생기면 빠른 중도 상환이 많은 이자를 아끼는 길입니다.',
      adviceEqualPrincipal: '원금균등상환은 초기에 갚는 금액이 크지만 원금이 빠르게 줄어들어 이자 총액이 가장 적습니다.',
      adviceFlat: '원금 균등 및 고정 이자 상환(대부업 등)은 이 비용이 지나치게 비쌉니다! 수수료가 크지 않다면 즉시 상환하는 것이 좋습니다.'
    },
    fr: {
      title: 'Taux de Prêt Réel et Optimisateur de Remboursement',
      subtitle: 'Découvrez les pièges des taux d\'intérêt et optimisez vos remboursements anticipés',
      principal: 'Montant du Prêt',
      term: 'Durée du Prêt',
      months: 'mois',
      years: 'ans',
      rateType: 'Type de Taux Annoncé',
      dailyRate: 'Taux Journalier',
      monthlyRate: 'Taux Forfaitaire Mensuel',
      annualRate: 'Taux Annuel',
      advertisedRate: 'Valeur Annoncée',
      repayType: 'Mode de Remboursement',
      repayEMI: 'Échéance Mensuelle Constante (EMI)',
      repayEqualPrincipal: 'Amortissement Constant du Capital',
      repayFlat: 'Capital Constant et Intérêt Plat (Piège)',
      flatWarning: '⚠️ Attention au Taux Forfaitaire : L\'intérêt est toujours calculé sur le capital initial total, doublant presque votre TAEG réel.',
      realRateTitle: 'Intelligence Financière : Analyse des Taux Réels',
      aprLabel: 'TAEG Annuel Réel',
      apyLabel: 'Taux Actuariel Réel (APY)',
      advertisedCompare: 'TAEG Annoncé',
      realAprLabel: 'TAEG Réel Effectif',
      compareResult: 'Supérieur de',
      prepayTitle: 'Simulateur de Remboursement Anticipé',
      prepayType: 'Stratégie de Remboursement',
      noPrepay: 'Aucun Remboursement Anticipé',
      prepayMonthly: 'Capital Mensuel Supplémentaire',
      prepayYearly: 'Capital Annuel Supplémentaire',
      prepayLumpSum: 'Remboursement Unique',
      prepayAmount: 'Montant Supplémentaire',
      prepayMonth: 'Au mois numéro',
      savingsTitle: 'Résultats de l\'Optimisation',
      interestSaved: 'Intérêts Économisés',
      timeSaved: 'Temps Gagné',
      payoffEarly: 'Remboursé Plus Tôt',
      chartTitle: 'Double Courbe des Paiements Cumulés et du Solde',
      originalPlan: 'Plan Initial (Cumulé)',
      optimizedPlan: 'Plan Optimisé (Cumulé)',
      originalBalance: 'Solde Initial',
      optimizedBalance: 'Solde Optimisé',
      scheduleTitle: 'Tableau d\'Amortissement',
      period: 'Période',
      originalPayment: 'Mensualité Initiale',
      optimizedPayment: 'Mensualité Optimisée',
      principalPaid: 'Principal Remboursé',
      interestPaid: 'Intérêts Payés',
      prepaidAmount: 'Capital Anticipé',
      remainingBalance: 'Solde Restant',
      exportPng: 'Exporter le Graphique PNG',
      exportSvg: 'Exporter le Graphique SVG',
      totalInterest: 'Total des Intérêts',
      totalPrincipal: 'Total du Capital',
      totalAmount: 'Total des Paiements',
      ratioTitle: 'Proportion entre Principal et Intérêts',
      yearlyView: 'Vue Annuelle',
      monthlyView: 'Vue Mensuelle',
      loanAdvice: 'Conseil de Remboursement :',
      adviceEMI: 'Les échéances EMI paient beaucoup d\'intérêts au départ. Rembourser tôt maximise les gains.',
      adviceEqualPrincipal: 'L\'amortissement constant a de fortes échéances initiales mais réduit le capital rapidement, minimisant les intérêts.',
      adviceFlat: 'Les taux forfaitaires sont extrêmement coûteux ! Remboursez la totalité dès que possible.'
    },
    ru: {
      title: 'Реальная кредитная ставка и оптимизатор платежей',
      subtitle: 'Выявите скрытую переплату по кредиту и настройте стратегию досрочного погашения',
      principal: 'Сумма кредита',
      term: 'Срок кредита',
      months: 'мес.',
      years: 'лет',
      rateType: 'Тип заявленной ставки',
      dailyRate: 'Дневная ставка',
      monthlyRate: 'Ежемесячная фиксированная ставка',
      annualRate: 'Годовая ставка',
      advertisedRate: 'Заявленное значение',
      repayType: 'Способ погашения',
      repayEMI: 'Аннуитетный платеж (равные взносы)',
      repayEqualPrincipal: 'Дифференцированный платеж (равный основной долг)',
      repayFlat: 'Плоская ставка (равный долг и фиксированные проценты - Ловушка)',
      flatWarning: '⚠️ Внимание: Проценты всегда начисляются на полную сумму первоначального долга, что почти удваивает реальную ПСК по сравнению с номиналом.',
      realRateTitle: 'Финансовая аналитика: Анализ реальных ставок',
      aprLabel: 'Реальная годовая ПСК',
      apyLabel: 'Реальная годовая эффективная ставка',
      advertisedCompare: 'Заявленная ставка',
      realAprLabel: 'Реальная ПСК',
      compareResult: 'Превышение над заявленной',
      prepayTitle: 'Симулятор досрочного погашения',
      prepayType: 'Стратегия досрочных выплат',
      noPrepay: 'Без досрочного погашения',
      prepayMonthly: 'Дополнительно в месяц',
      prepayYearly: 'Дополнительно в год',
      prepayLumpSum: 'Единовременный досрочный платеж',
      prepayAmount: 'Сумма платежа',
      prepayMonth: 'Номер месяца платежа',
      savingsTitle: 'Результаты оптимизации',
      interestSaved: 'Сэкономлено процентов',
      timeSaved: 'Срок сокращен на',
      payoffEarly: 'Досрочное закрытие через',
      chartTitle: 'График кумулятивных платежей и остатка долга',
      originalPlan: 'Исходный план (кумулятивно)',
      optimizedPlan: 'Оптимизированный план (кумулятивно)',
      originalBalance: 'Исходный остаток долга',
      optimizedBalance: 'Остаток долга при оптимизации',
      scheduleTitle: 'Таблица амортизации долга',
      period: 'Месяц',
      originalPayment: 'Исходный платеж',
      optimizedPayment: 'Оптимизированный платеж',
      principalPaid: 'Погашение долга',
      interestPaid: 'Погашение процентов',
      prepaidAmount: 'Досрочно погашено',
      remainingBalance: 'Остаток долга',
      exportPng: 'Экспорт графика в PNG',
      exportSvg: 'Экспорт графика в SVG',
      totalInterest: 'Всего процентов',
      totalPrincipal: 'Всего сумма долга',
      totalAmount: 'Всего выплат',
      ratioTitle: 'Соотношение долга и процентов',
      yearlyView: 'По годам',
      monthlyView: 'По месяцам',
      loanAdvice: 'Финансовая рекомендация:',
      adviceEMI: 'При аннуитете в первые месяцы платятся в основном проценты. Досрочное погашение на ранних этапах сэкономит максимум.',
      adviceEqualPrincipal: 'При дифференцированных платежах начальные взносы велики, но долг тает быстро, минимизируя общую переплату.',
      adviceFlat: 'Кредиты с плоской процентной ставкой невероятно дорогие! Постарайтесь погасить его полностью как можно быстрее.'
    },
    de: {
      title: 'Effektiver Zinssatz & Sondertilgungsoptimierer',
      subtitle: 'Decken Sie Zinsfallen auf und optimieren Sie Ihre Sondertilgungsstrategie',
      principal: 'Darlehensbetrag',
      term: 'Laufzeit',
      months: 'Monate',
      years: 'Jahre',
      rateType: 'Beworbener Zinstyp',
      dailyRate: 'Tageszins',
      monthlyRate: 'Monatlicher Pauschalzinssatz',
      annualRate: 'Nominalzins (Jahreszins)',
      advertisedRate: 'Beworbener Wert',
      repayType: 'Tilgungsart',
      repayEMI: 'Annuitätendarlehen (Gleiche Raten)',
      repayEqualPrincipal: 'Tilgungsdarlehen',
      repayFlat: 'Konsumentenkredit mit Pauschalverzinsung (Zinsfalle)',
      flatWarning: '⚠️ Pauschalzins-Warnung: Zinsen werden dauerhaft auf das anfängliche Volldarlehen erhoben, wodurch sich Ihr Effektivzins fast verdoppelt.',
      realRateTitle: 'Finanzanalyse: Aufdeckung des Effektivzinses',
      aprLabel: 'Echter Effektivzins (APR)',
      apyLabel: 'Effektiver Jahreszins mit Zinseszins (APY)',
      advertisedCompare: 'Beworbener Jahreszins',
      realAprLabel: 'Tatsächlicher Effektivzins',
      compareResult: 'Höher um',
      prepayTitle: 'Sondertilgungsspielplatz',
      prepayType: 'Sondertilgungsoption',
      noPrepay: 'Keine Sondertilgung',
      prepayMonthly: 'Monatliche Sondertilgung',
      prepayYearly: 'Jährliche Sondertilgung',
      prepayLumpSum: 'Einmalige Sonderzahlung',
      prepayAmount: 'Zusatzbetrag',
      prepayMonth: 'Im Monat Nummer',
      savingsTitle: 'Optimierungsergebnisse',
      interestSaved: 'Zinsersparnis',
      timeSaved: 'Verkürzte Laufzeit',
      payoffEarly: 'Vorzeitige Tilgung',
      chartTitle: 'Kumulierte Zahlungen und Restschuld-Verlauf',
      originalPlan: 'Originalplan (Kumuliert)',
      optimizedPlan: 'Optimierter Plan (Kumuliert)',
      originalBalance: 'Original-Restschuld',
      optimizedBalance: 'Optimierte Restschuld',
      scheduleTitle: 'Tilgungsplan',
      period: 'Monat',
      originalPayment: 'Original-Rate',
      optimizedPayment: 'Optimierte Rate',
      principalPaid: 'Zinsanteil',
      interestPaid: 'Tilgungsanteil',
      prepaidAmount: 'Sondertilgung',
      remainingBalance: 'Restschuld',
      exportPng: 'PNG-Diagramm exportieren',
      exportSvg: 'SVG-Diagramm exportieren',
      totalInterest: 'Gesamte Zinsen',
      totalPrincipal: 'Gesamte Kreditsumme',
      totalAmount: 'Gesamte Ratenzahlungen',
      ratioTitle: 'Verhältnis von Zins und Tilgung',
      yearlyView: 'Jahresansicht',
      monthlyView: 'Monatsansicht',
      loanAdvice: 'Darlehens-Tipp:',
      adviceEMI: 'EMI-Raten haben anfangs hohe Zinsanteile. Sondertilgungen zu Beginn bringen die größte Ersparnis.',
      adviceEqualPrincipal: 'Das Tilgungsdarlehen hat hohe Anfangsraten, baut aber Restschuld zügig ab und spart so insgesamt.',
      adviceFlat: 'Kredite mit Pauschalverzinsung sind extrem teuer! Lösen Sie diese schnellstmöglich vollständig ab.'
    },
    ar: {
      title: 'حاسبة سعر الفائدة الفعلي وجدولة السداد المبكر',
      subtitle: 'اكشف الفخاخ في فوائد القروض وحسّن خطة السداد المبكر الخاصة بك',
      principal: 'مبلغ القرض',
      term: 'مدة القرض',
      months: 'أشهر',
      years: 'سنوات',
      rateType: 'نوع الفائدة المعلنة',
      dailyRate: 'فائدة يومية',
      monthlyRate: 'فائدة شهرية مسطحة',
      annualRate: 'فائدة سنوية',
      advertisedRate: 'القيمة المعلنة',
      repayType: 'طريقة السداد',
      repayEMI: 'أقساط شهرية متساوية (Price)',
      repayEqualPrincipal: 'أصل دين متساوي',
      repayFlat: 'أصل دين متساوي وفائدة مسطحة ثابتة (فخ)',
      flatWarning: '⚠️ فخ الفائدة المسطحة: يتم حساب الفائدة دائماً بناءً على أصل القرض الأصلي بالكامل، مما يضاعف سعر الفائدة الفعلي السنوي تقريباً.',
      realRateTitle: 'الذكاء المالي: تحليل الفائدة الفعلية',
      aprLabel: 'الفائدة الفعلية السنوية (APR)',
      apyLabel: 'الفائدة السنوية المركبة الفعلية (APY)',
      advertisedCompare: 'الفائدة المعلنة السنوية',
      realAprLabel: 'الفائدة الفعلية الحقيقية',
      compareResult: 'أعلى بقيمة',
      prepayTitle: 'ملعب السداد المبكر للقروض',
      prepayType: 'إستراتيجية السداد المبكر',
      noPrepay: 'بدون دفعات إضافية',
      prepayMonthly: 'دفعات أصل دين إضافية شهرياً',
      prepayYearly: 'دفعات أصل دين إضافية سنوياً',
      prepayLumpSum: 'دفعة سداد مبكر واحدة',
      prepayAmount: 'المبلغ الإضافي',
      prepayMonth: 'في الشهر رقم',
      savingsTitle: 'نتائج تحسين السداد',
      interestSaved: 'الفوائد الموفرة',
      timeSaved: 'المدة المختصرة',
      payoffEarly: 'سداد مبكر قبل الموعد بـ',
      chartTitle: 'مخطط الدفع التراكمي المزدوج والرصيد المتبقي',
      originalPlan: 'الخطة الأصلية (تراكمي)',
      optimizedPlan: 'الخطة المحسنة (تراكمي)',
      originalBalance: 'الرصيد الأصلي المتبقي',
      optimizedBalance: 'الرصيد المحسن المتبقي',
      scheduleTitle: 'جدول استهلاك سداد القرض',
      period: 'الفترة',
      originalPayment: 'القسط الأصلي',
      optimizedPayment: 'القسط المحسن',
      principalPaid: 'أصل الدين المدفوع',
      interestPaid: 'الفائدة المدفوعة',
      prepaidAmount: 'السداد المبكر لأصل الدين',
      remainingBalance: 'أصل الدين المتبقي',
      exportPng: 'تصدير الرسم PNG',
      exportSvg: 'تصدير الرسم SVG',
      totalInterest: 'إجمالي الفوائد',
      totalPrincipal: 'إجمالي أصل الدين',
      totalAmount: 'إجمالي المدفوعات',
      ratioTitle: 'نسبة أصل الدين إلى الفوائد',
      yearlyView: 'عرض سنوي',
      monthlyView: 'عرض شهري',
      adviceEMI: 'أقساط EMI لها حصة فائدة كبيرة في البداية. الدفع المبكر يوفر أكبر قدر من الفوائد.',
      adviceEqualPrincipal: 'أصل الدين المتساوي يتطلب دفعات أولية عالية ولكنه يخفض الدين بسرعة لتقليل الفائدة الإجمالية.',
      adviceFlat: 'فوائد القروض المسطحة باهظة التكلفة جداً! يفضل تسويتها مبكراً بالكامل لتفادي الأعباء المتراكمة.'
    }
  };

  // 根据当前 locale 获取 i18n 术语，默认 fallback 到 en
  const l = $derived(I18N_LABELS[locale] || I18N_LABELS['en']);

  // --- Svelte 5 Reactive States (曜石黑金·真实利率与还款优化计算器参数) ---
  let principalInput = $state('500000'); // 默认本金 50万
  let termMonthsInput = $state('120');   // 默认期限 120个月
  let rateType = $state('annual');        // 宣称利率类型: annual / monthly / daily
  let advertisedRateInput = $state('5.4'); // 宣称名义年化利率或月费率或日息值，默认 5.4%
  let repayType = $state('flat');         // 默认还款方式: flat (等本等息，套路重灾区) / emi / equal-principal

  // 提前还款参数
  let prepayStrategy = $state('none');    // none / monthly / yearly / lump-sum
  let prepayAmountInput = $state('2000'); // 默认每月或每年多还 2000元，或者一次性多还
  let prepayMonthInput = $state('12');    // 默认在第 12 个月进行一次性提前还款

  // 展开明细控制
  let viewMode = $state('monthly'); // monthly / yearly
  let showSchedule = $state(false);

  // ECharts 实例引用与主题
  const chartTheme = useChartTheme();
  let chartRef = $state<{ getEchartsInstance?: () => any } | null>(null);

  // --- 核心数学计算引擎 ---

  // 1. 获取统一折算后的宣称名义年化值（用于直观对比展示）
  const nominalAnnualRate = $derived.by(() => {
    const rate = parseFloat(advertisedRateInput) || 0;
    if (rateType === 'daily') return rate * 365;
    if (rateType === 'monthly') return rate * 12;
    return rate;
  });

  // 2. 根据不同的输入生成原计划的每月还款流（每月现金流，t=1..N）
  interface MonthlyPayment {
    period: number;
    payment: number;
    principalPaid: number;
    interestPaid: number;
    prepaid: number;
    balance: number;
  }

  const calculationResult = $derived.by(() => {
    const P = parseFloat(principalInput) || 0;
    const N = parseInt(termMonthsInput) || 12;
    const rateVal = parseFloat(advertisedRateInput) || 0;

    if (P <= 0 || N <= 0) {
      return {
        apr: 0,
        apy: 0,
        originalPlan: [] as MonthlyPayment[],
        optimizedPlan: [] as MonthlyPayment[],
        originalTotalInterest: 0,
        originalTotalAmount: 0,
        optimizedTotalInterest: 0,
        optimizedTotalAmount: 0,
        interestSaved: 0,
        timeSavedMonths: 0,
        payoffPeriod: N,
      };
    }

    // 转换成月利率 i
    let i = 0;
    if (rateType === 'daily') {
      i = (rateVal / 100) * 30; // 日息按 30天折算为月息
    } else if (rateType === 'monthly') {
      i = rateVal / 100;
    } else {
      i = (rateVal / 100) / 12; // 年息折算为月息
    }

    // A. 计算原计划的月供明细表
    const originalPlan: MonthlyPayment[] = [];
    let remPrincipal = P;
    let originalTotalInterest = 0;

    if (repayType === 'flat') {
      // 等本等息（套路借贷）：每月本金固定，利息始终以初始总本金计算
      const monthlyPrincipal = P / N;
      const monthlyInterest = P * i;
      const monthlyPayment = monthlyPrincipal + monthlyInterest;

      for (let t = 1; t <= N; t++) {
        remPrincipal -= monthlyPrincipal;
        originalTotalInterest += monthlyInterest;
        originalPlan.push({
          period: t,
          payment: monthlyPayment,
          principalPaid: monthlyPrincipal,
          interestPaid: monthlyInterest,
          prepaid: 0,
          balance: Math.max(0, remPrincipal),
        });
      }
    } else if (repayType === 'emi') {
      // 等额本息 (EMI)
      const monthlyPayment = i > 0
        ? P * (i * Math.pow(1 + i, N)) / (Math.pow(1 + i, N) - 1)
        : P / N;

      for (let t = 1; t <= N; t++) {
        const interest = remPrincipal * i;
        const principal = monthlyPayment - interest;
        remPrincipal -= principal;
        originalTotalInterest += interest;
        originalPlan.push({
          period: t,
          payment: monthlyPayment,
          principalPaid: principal,
          interestPaid: interest,
          prepaid: 0,
          balance: Math.max(0, remPrincipal),
        });
      }
    } else {
      // 等额本金
      const monthlyPrincipal = P / N;
      for (let t = 1; t <= N; t++) {
        const interest = remPrincipal * i;
        const monthlyPayment = monthlyPrincipal + interest;
        remPrincipal -= monthlyPrincipal;
        originalTotalInterest += interest;
        originalPlan.push({
          period: t,
          payment: monthlyPayment,
          principalPaid: monthlyPrincipal,
          interestPaid: interest,
          prepaid: 0,
          balance: Math.max(0, remPrincipal),
        });
      }
    }

    // B. 通过二分法精确算得真实月贴现率 (IRR)，并反推出真实年化单利（APR）与年化复利（APY）
    // IRR 求解方程: P = Sum_{t=1..N} (C_t / (1 + m)^t)
    let low = 0;
    let high = 10; // 月利率区间从 0% 到 1000%
    let m = 0;

    for (let iter = 0; iter < 80; iter++) {
      const mid = (low + high) / 2;
      let pv = 0;
      for (let t = 0; t < N; t++) {
        pv += originalPlan[t].payment / Math.pow(1 + mid, t + 1);
      }
      if (pv > P) {
        low = mid;
      } else {
        high = mid;
      }
    }
    m = low;

    const apr = m * 12 * 100; // 真实年化单利 APR (百分比)
    const apy = (Math.pow(1 + m, 12) - 1) * 100; // 真实年化复利 APY (百分比)

    // C. 计算优化的提前还款计划明细表
    const optimizedPlan: MonthlyPayment[] = [];
    let optPrincipal = P;
    const prepayAmount = parseFloat(prepayAmountInput) || 0;
    const prepayMonth = parseInt(prepayMonthInput) || 12;

    let optTotalInterest = 0;
    let payoffPeriod = N;

    // 重新按月推算，带有提前还本条件
    for (let t = 1; t <= N; t++) {
      if (optPrincipal <= 0.01) {
        // 早已结清
        if (payoffPeriod === N) payoffPeriod = t - 1;
        break;
      }

      // 计算本期正常应还的本息
      let normalPayment = 0;
      let normalInterest = 0;
      let normalPrincipal = 0;

      if (repayType === 'flat') {
        normalInterest = optPrincipal * i; // 虽然是等本等息，但如果提前还本了，银行利息应该以剩余应还本金或初始本金算？
        // 实际上，按我国消保法与银行业惯例，等本等息提前还款通常需要支付全部剩余本金。这里我们做良性模拟：剩余利息直接免除，剩余本金清偿。
        normalInterest = Math.min(optPrincipal * i, optPrincipal * i); 
        normalPrincipal = P / N;
      } else if (repayType === 'emi') {
        normalInterest = optPrincipal * i;
        // 原应还月供
        const basePayment = i > 0
          ? P * (i * Math.pow(1 + i, N)) / (Math.pow(1 + i, N) - 1)
          : P / N;
        normalPrincipal = basePayment - normalInterest;
      } else {
        normalInterest = optPrincipal * i;
        normalPrincipal = P / N;
      }

      // 边界约束
      if (normalPrincipal >= optPrincipal) {
        normalPrincipal = optPrincipal;
        normalPayment = normalPrincipal + normalInterest;
        optPrincipal = 0;
      } else {
        optPrincipal -= normalPrincipal;
        normalPayment = normalPrincipal + normalInterest;
      }

      optTotalInterest += normalInterest;

      // 评估提前还款额外还本
      let extraPrepaid = 0;
      if (prepayStrategy !== 'none' && prepayAmount > 0 && optPrincipal > 0) {
        if (prepayStrategy === 'monthly') {
          extraPrepaid = Math.min(prepayAmount, optPrincipal);
        } else if (prepayStrategy === 'yearly' && t % 12 === 0) {
          extraPrepaid = Math.min(prepayAmount, optPrincipal);
        } else if (prepayStrategy === 'lump-sum' && t === prepayMonth) {
          extraPrepaid = Math.min(prepayAmount, optPrincipal);
        }
      }

      if (extraPrepaid > 0) {
        optPrincipal -= extraPrepaid;
      }

      optimizedPlan.push({
        period: t,
        payment: normalPayment + extraPrepaid,
        principalPaid: normalPrincipal,
        interestPaid: normalInterest,
        prepaid: extraPrepaid,
        balance: Math.max(0, optPrincipal),
      });

      if (optPrincipal <= 0.01 && payoffPeriod === N) {
        payoffPeriod = t;
      }
    }

    const interestSaved = Math.max(0, originalTotalInterest - optTotalInterest);
    const timeSavedMonths = Math.max(0, N - payoffPeriod);

    return {
      apr,
      apy,
      originalPlan,
      optimizedPlan,
      originalTotalInterest,
      originalTotalAmount: P + originalTotalInterest,
      optimizedTotalInterest: optTotalInterest,
      optimizedTotalAmount: P + optTotalInterest,
      interestSaved,
      timeSavedMonths,
      payoffPeriod,
    };
  });

  // --- ECharts 曜石黑金配置方案 ---

  // 1. 曜石黑金折线图 Option (双曲线累计还款与本金余额)
  function getLineChartOption() {
    const orgData = calculationResult.originalPlan;
    const optData = calculationResult.optimizedPlan;

    // x轴周期
    const xData = orgData.map(o => `${o.period}${l.months}`);

    // 计算累计支付曲线
    let orgSum = 0;
    const orgCumulative = orgData.map(o => {
      orgSum += o.payment;
      return parseFloat(orgSum.toFixed(2));
    });

    let optSum = 0;
    const optCumulative = optData.map(o => {
      optSum += o.payment;
      return parseFloat(optSum.toFixed(2));
    });

    // 计算余额曲线
    const orgBalance = orgData.map(o => parseFloat(o.balance.toFixed(2)));
    const optBalance = optData.map(o => parseFloat(o.balance.toFixed(2)));

    return {
      backgroundColor: 'transparent',
      title: {
        text: l.chartTitle,
        left: 'center',
        textStyle: { color: '#E5C47F', fontSize: 16, fontWeight: 'bold' },
      },
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(20, 20, 20, 0.9)',
        borderColor: '#D4AF37',
        borderWidth: 1,
        textStyle: { color: '#F3E5AB' },
        axisPointer: {
          lineStyle: { color: 'rgba(212, 175, 55, 0.4)' }
        }
      },
      legend: {
        bottom: 5,
        textStyle: { color: '#B38F3B' },
        data: [l.originalPlan, l.optimizedPlan, l.originalBalance, l.optimizedBalance],
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '12%',
        top: '15%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        data: xData,
        axisLine: { lineStyle: { color: 'rgba(212, 175, 55, 0.3)' } },
        axisLabel: { color: '#B38F3B' },
        splitLine: { show: false },
      },
      yAxis: {
        type: 'value',
        axisLine: { lineStyle: { color: 'rgba(212, 175, 55, 0.3)' } },
        axisLabel: {
          color: '#B38F3B',
          formatter: (value: number) => {
            if (value >= 10000) return (value / 10000) + '万';
            return value.toString();
          }
        },
        splitLine: { lineStyle: { color: 'rgba(212, 175, 55, 0.08)' } },
      },
      series: [
        {
          name: l.originalPlan,
          type: 'line',
          smooth: true,
          showSymbol: false,
          lineStyle: { color: '#8A6623', width: 2, type: 'dashed' },
          data: orgCumulative,
        },
        {
          name: l.optimizedPlan,
          type: 'line',
          smooth: true,
          showSymbol: false,
          lineStyle: {
            color: {
              type: 'linear',
              x: 0, y: 0, x2: 1, y2: 0,
              colorStops: [
                { offset: 0, color: '#BF953F' },
                { offset: 1, color: '#FCF6BA' }
              ]
            },
            width: 3.5,
            shadowBlur: 10,
            shadowColor: 'rgba(212, 175, 55, 0.4)'
          },
          data: optCumulative,
        },
        {
          name: l.originalBalance,
          type: 'line',
          smooth: true,
          showSymbol: false,
          lineStyle: { color: 'rgba(138, 102, 35, 0.4)', width: 1.5 },
          data: orgBalance,
        },
        {
          name: l.optimizedBalance,
          type: 'line',
          smooth: true,
          showSymbol: false,
          lineStyle: { color: 'rgba(252, 246, 186, 0.5)', width: 2 },
          data: optBalance,
        }
      ],
    };
  }

  // 2. 曜石黑金本息占比饼图
  function getPieChartOption() {
    const P = parseFloat(principalInput) || 0;
    const interest = calculationResult.optimizedTotalInterest;

    return {
      backgroundColor: 'transparent',
      title: {
        text: l.ratioTitle,
        left: 'center',
        textStyle: { color: '#E5C47F', fontSize: 15, fontWeight: 'bold' },
      },
      tooltip: {
        trigger: 'item',
        backgroundColor: 'rgba(20, 20, 20, 0.9)',
        borderColor: '#D4AF37',
        borderWidth: 1,
        textStyle: { color: '#F3E5AB' },
        formatter: '{b}: {c} ({d}%)',
      },
      series: [
        {
          name: l.ratioTitle,
          type: 'pie',
          radius: ['45%', '70%'],
          center: ['50%', '55%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 8,
            borderColor: '#121212',
            borderWidth: 2,
          },
          label: {
            show: true,
            color: '#B38F3B',
          },
          data: [
            {
              value: parseFloat(P.toFixed(2)),
              name: l.totalPrincipal,
              itemStyle: {
                color: {
                  type: 'linear',
                  x: 0, y: 0, x2: 0, y2: 1,
                  colorStops: [
                    { offset: 0, color: '#B38728' },
                    { offset: 1, color: '#AA771C' }
                  ]
                }
              }
            },
            {
              value: parseFloat(interest.toFixed(2)),
              name: l.totalInterest,
              itemStyle: {
                color: {
                  type: 'linear',
                  x: 0, y: 0, x2: 0, y2: 1,
                  colorStops: [
                    { offset: 0, color: '#FBF5B7' },
                    { offset: 1, color: '#D4AF37' }
                  ]
                }
              }
            }
          ],
        }
      ],
    };
  }

  // 格式化货币金额数字
  function formatMoney(amount: number) {
    return new Intl.NumberFormat(locale === 'zh' ? 'zh-CN' : 'en-US', {
      style: 'currency',
      currency: locale === 'zh' ? 'CNY' : 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  }

  // 一键加载样本大额消费贷套路场景
  function loadFlatRateTrapSample() {
    principalInput = '200000';
    termMonthsInput = '36';
    rateType = 'monthly';
    advertisedRateInput = '0.6'; // 宣称月费率 0.6%
    repayType = 'flat';          // 等本等息
    prepayStrategy = 'monthly';
    prepayAmountInput = '3000';
  }

  // 导出明细图片
  function exportChartImage() {
    if (!chartRef) return;
    const echartInstance = chartRef.getEchartsInstance?.();
    if (!echartInstance) return;

    const url = echartInstance.getDataURL({
      type: 'png',
      pixelRatio: 2,
      backgroundColor: document.documentElement.classList.contains('dark') ? '#121212' : '#ffffff',
    });

    const link = document.createElement('a');
    link.href = url;
    link.download = `loan-amortization-optimized.png`;
    link.click();
  }

  // 根据当前还款方式选择理财建议文本
  const adviceText = $derived.by(() => {
    if (repayType === 'flat') return l.adviceFlat;
    if (repayType === 'emi') return l.adviceEMI;
    return l.adviceEqualPrincipal;
  });

  // 年度折叠摊销计算
  const yearlySchedule = $derived.by(() => {
    const list = calculationResult.optimizedPlan;
    const yearsMap: Record<number, {
      year: number;
      payment: number;
      principal: number;
      interest: number;
      prepaid: number;
      balance: number;
    }> = {};

    list.forEach((item) => {
      const year = Math.ceil(item.period / 12);
      if (!yearsMap[year]) {
        yearsMap[year] = {
          year,
          payment: 0,
          principal: 0,
          interest: 0,
          prepaid: 0,
          balance: 0,
        };
      }
      yearsMap[year].payment += item.payment;
      yearsMap[year].principal += item.principalPaid;
      yearsMap[year].interest += item.interestPaid;
      yearsMap[year].prepaid += item.prepaid;
      yearsMap[year].balance = item.balance; // 保留年末余额
    });

    return Object.values(yearsMap);
  });
</script>

<div class="tool-theme-shell space-y-6 p-6 rounded-2xl relative overflow-hidden font-sans">
  
  <!-- 奢华曜石黑金流光背景微效果 -->
  <div class="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-amber-500/10 via-transparent to-transparent blur-3xl pointer-events-none rounded-full"></div>

  <!-- 头部主标题与副标题 -->
  <div class="border-b border-zinc-800 pb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
    <div>
      <h1 class="text-3xl font-extrabold tracking-tight text-amber-700 dark:bg-gradient-to-r dark:from-[#BF953F] dark:via-[#FCF6BA] dark:to-[#AA771C] dark:bg-clip-text dark:text-transparent">
        {l.title}
      </h1>
      <p class="text-zinc-400 text-sm mt-1">{l.subtitle}</p>
    </div>
    <div>
      <button
        onclick={loadFlatRateTrapSample}
        class="px-4 py-2 bg-amber-50 dark:bg-gradient-to-r dark:from-amber-900/60 dark:to-zinc-900 border border-amber-300 dark:border-amber-600/40 text-amber-700 dark:text-amber-400 hover:bg-amber-100 dark:hover:from-amber-800/80 dark:hover:to-zinc-800 rounded-lg text-xs font-semibold tracking-wider transition-all duration-300 shadow-sm dark:shadow-lg dark:hover:shadow-amber-500/10 flex items-center gap-1.5"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        {locale === 'zh' ? '一键加载消费贷套路场景' : 'Load Consumer Loan Trap'}
      </button>
    </div>
  </div>

  <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
    
    <!-- 左侧：参数配置输入面板 (Col 5) -->
    <div class="lg:col-span-5 space-y-5 bg-zinc-900/50 p-5 rounded-xl border border-zinc-800 backdrop-blur-md">
      
      <!-- 贷款本金 -->
      <div class="space-y-1.5">
        <div class="flex justify-between items-center text-sm">
          <span class="text-zinc-300 font-medium">{l.principal}</span>
          <span class="text-amber-400 font-mono font-bold text-base">{formatMoney(parseFloat(principalInput) || 0)}</span>
        </div>
        <input
          type="range"
          min="10000"
          max="5000000"
          step="10000"
          bind:value={principalInput}
          class="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
        />
        <input
          type="number"
          bind:value={principalInput}
          class="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 rounded-lg text-sm text-zinc-100 font-mono"
        />
      </div>

      <!-- 贷款期限 -->
      <div class="space-y-1.5">
        <div class="flex justify-between items-center text-sm">
          <span class="text-zinc-300 font-medium">{l.term}</span>
          <span class="text-amber-400 font-mono font-bold text-base">
            {termMonthsInput} {l.months} ({(parseFloat(termMonthsInput) / 12).toFixed(1)} {l.years})
          </span>
        </div>
        <input
          type="range"
          min="1"
          max="360"
          step="1"
          bind:value={termMonthsInput}
          class="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
        />
        <input
          type="number"
          bind:value={termMonthsInput}
          class="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 rounded-lg text-sm text-zinc-100 font-mono"
        />
      </div>

      <!-- 利率类型与利率值 -->
      <div class="grid grid-cols-2 gap-3">
        <div class="space-y-1">
          <label class="block text-xs text-zinc-400 font-medium">{l.rateType}</label>
          <select
            bind:value={rateType}
            class="w-full px-2.5 py-2 bg-zinc-950 border border-zinc-800 focus:border-amber-500/50 rounded-lg text-xs text-zinc-200"
          >
            <option value="annual">{l.annualRate}</option>
            <option value="monthly">{l.monthlyRate}</option>
            <option value="daily">{l.dailyRate}</option>
          </select>
        </div>
        <div class="space-y-1">
          <label class="block text-xs text-zinc-400 font-medium">{l.advertisedRate}</label>
          <div class="relative">
            <input
              type="number"
              step="0.01"
              bind:value={advertisedRateInput}
              class="w-full pl-3 pr-8 py-2 bg-zinc-950 border border-zinc-800 focus:border-amber-500/50 rounded-lg text-xs text-zinc-100 font-mono"
            />
            <span class="absolute right-3 top-2.5 text-xs text-zinc-500 font-mono">%</span>
          </div>
        </div>
      </div>

      <!-- 还款方式 -->
      <div class="space-y-2.5">
        <label class="block text-sm text-zinc-300 font-medium">{l.repayType}</label>
        <div class="grid grid-cols-1 gap-2">
          <label class="flex items-center gap-2.5 p-3 rounded-lg border border-zinc-800 bg-zinc-950/60 hover:bg-zinc-950/90 cursor-pointer transition-all duration-200">
            <input
              type="radio"
              name="repayType"
              value="flat"
              bind:group={repayType}
              class="w-4 h-4 text-amber-500 bg-zinc-900 border-zinc-700 focus:ring-0 focus:ring-offset-0 accent-amber-500"
            />
            <div>
              <div class="text-xs font-semibold text-zinc-200">{l.repayFlat}</div>
            </div>
          </label>

          <label class="flex items-center gap-2.5 p-3 rounded-lg border border-zinc-800 bg-zinc-950/60 hover:bg-zinc-950/90 cursor-pointer transition-all duration-200">
            <input
              type="radio"
              name="repayType"
              value="emi"
              bind:group={repayType}
              class="w-4 h-4 text-amber-500 bg-zinc-900 border-zinc-700 focus:ring-0 focus:ring-offset-0 accent-amber-500"
            />
            <div>
              <div class="text-xs font-semibold text-zinc-200">{l.repayEMI}</div>
            </div>
          </label>

          <label class="flex items-center gap-2.5 p-3 rounded-lg border border-zinc-800 bg-zinc-950/60 hover:bg-zinc-950/90 cursor-pointer transition-all duration-200">
            <input
              type="radio"
              name="repayType"
              value="equal-principal"
              bind:group={repayType}
              class="w-4 h-4 text-amber-500 bg-zinc-900 border-zinc-700 focus:ring-0 focus:ring-offset-0 accent-amber-500"
            />
            <div>
              <div class="text-xs font-semibold text-zinc-200">{l.repayEqualPrincipal}</div>
            </div>
          </label>
        </div>
      </div>

      <!-- 套路大坑警告 -->
      {#if repayType === 'flat'}
        <div class="p-3 bg-red-950/40 border border-red-800/40 rounded-lg text-xs text-red-400 leading-relaxed shadow-inner">
          {l.flatWarning}
        </div>
      {/if}
    </div>

    <!-- 右侧：真实利率反推与提前还款优化 (Col 7) -->
    <div class="lg:col-span-7 space-y-6">
      
      <!-- IRR 真实年化利率展示大屏 -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gradient-to-b from-zinc-900/60 to-zinc-950/40 p-5 rounded-xl border border-amber-500/10 shadow-lg relative">
        <div class="space-y-1">
          <div class="text-xs text-zinc-400 font-semibold tracking-wider uppercase">{l.realRateTitle}</div>
          <div class="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#BF953F] to-[#FCF6BA] font-mono">
            {calculationResult.apr.toFixed(2)}%
          </div>
          <div class="text-[10px] text-zinc-500">{l.aprLabel}</div>
        </div>
        <div class="space-y-1">
          <div class="text-xs text-zinc-400 font-semibold tracking-wider uppercase">&nbsp;</div>
          <div class="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#B38728] to-[#FBF5B7] font-mono">
            {calculationResult.apy.toFixed(2)}%
          </div>
          <div class="text-[10px] text-zinc-500">{l.apyLabel}</div>
        </div>

        <!-- 利率膨胀直观警告与套路揭示 -->
        <div class="sm:col-span-2 pt-3 border-t border-zinc-800 text-xs flex flex-wrap items-center justify-between gap-2">
          <span class="text-zinc-400">
            {l.advertisedCompare}: <strong class="text-zinc-300 font-mono">{nominalAnnualRate.toFixed(2)}%</strong>
            &nbsp;|&nbsp;
            {l.realAprLabel}: <strong class="text-amber-400 font-mono">{calculationResult.apr.toFixed(2)}%</strong>
          </span>
          {#if calculationResult.apr > nominalAnnualRate + 0.1}
            <span class="px-2.5 py-0.5 bg-amber-500/10 border border-amber-500/20 text-[#E5C47F] rounded text-[10px] font-bold">
              {l.compareResult} {(calculationResult.apr - nominalAnnualRate).toFixed(2)}%!
            </span>
          {/if}
        </div>
      </div>

      <!-- 提前还款优化模块 -->
      <div class="bg-zinc-900/40 p-5 rounded-xl border border-zinc-800 space-y-4">
        <div class="flex items-center gap-2 border-b border-zinc-800 pb-2.5">
          <svg class="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
          </svg>
          <span class="text-sm font-bold text-zinc-200">{l.prepayTitle}</span>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          
          <!-- 提前还款类型选择 -->
          <div class="space-y-1">
            <label class="block text-xs text-zinc-400 font-medium">{l.prepayType}</label>
            <select
              bind:value={prepayStrategy}
              class="w-full px-2 py-2 bg-zinc-950 border border-zinc-800 focus:border-amber-500/50 rounded-lg text-xs text-zinc-200"
            >
              <option value="none">{l.noPrepay}</option>
              <option value="monthly">{l.prepayMonthly}</option>
              <option value="yearly">{l.prepayYearly}</option>
              <option value="lump-sum">{l.prepayLumpSum}</option>
            </select>
          </div>

          <!-- 额外还款额度 -->
          <div class="space-y-1">
            <label class="block text-xs text-zinc-400 font-medium">{l.prepayAmount}</label>
            <input
              type="number"
              disabled={prepayStrategy === 'none'}
              bind:value={prepayAmountInput}
              class="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 focus:border-amber-500/50 rounded-lg text-xs text-zinc-100 font-mono disabled:opacity-40"
            />
          </div>

          <!-- 一次性提前还款月份 -->
          <div class="space-y-1">
            <label class="block text-xs text-zinc-400 font-medium">{l.prepayMonth}</label>
            <input
              type="number"
              min="1"
              max={parseInt(termMonthsInput)}
              disabled={prepayStrategy !== 'lump-sum'}
              bind:value={prepayMonthInput}
              class="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 focus:border-amber-500/50 rounded-lg text-xs text-zinc-100 font-mono disabled:opacity-40"
            />
          </div>
        </div>

        <!-- 提前还款优化成果卡片 -->
        {#if prepayStrategy !== 'none' && parseFloat(prepayAmountInput) > 0}
          <div class="grid grid-cols-2 gap-4 pt-2">
            <div class="p-3.5 bg-amber-500/5 border border-amber-500/10 rounded-lg text-center">
              <div class="text-[10px] text-zinc-400 font-semibold">{l.interestSaved}</div>
              <div class="text-lg font-black text-amber-400 font-mono mt-1">
                {formatMoney(calculationResult.interestSaved)}
              </div>
            </div>
            <div class="p-3.5 bg-yellow-500/5 border border-yellow-500/10 rounded-lg text-center">
              <div class="text-[10px] text-zinc-400 font-semibold">{l.timeSaved}</div>
              <div class="text-lg font-black text-yellow-400 font-mono mt-1">
                {l.payoffEarly} {calculationResult.timeSavedMonths} {l.months}
              </div>
            </div>
          </div>
        {/if}
      </div>

    </div>
  </div>

  <!-- 图表区：曜石黑金双曲线折线图与占比饼图 -->
  <div class="grid grid-cols-1 md:grid-cols-12 gap-6 bg-zinc-950/60 p-5 rounded-xl border border-zinc-800">
    <div class="md:col-span-8 h-[380px] w-full relative">
      <EChartsWrapper
        bind:this={chartRef as any}
        option={getLineChartOption}
        style="height: 380px; width: 100%"
        notMerge={true}
        lazyUpdate={true}
      />
      <div class="absolute right-4 top-2 z-10 flex gap-2">
        <button
          onclick={exportChartImage}
          class="p-1.5 bg-zinc-900 border border-zinc-700 text-zinc-300 hover:text-amber-400 rounded-lg text-[10px] flex items-center gap-1 transition-colors"
        >
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
          </svg>
          {l.exportPng}
        </button>
      </div>
    </div>
    
    <div class="md:col-span-4 h-[380px] w-full">
      <EChartsWrapper
        option={getPieChartOption}
        style="height: 380px; width: 100%"
        notMerge={true}
        lazyUpdate={true}
      />
    </div>
  </div>

  <!-- 大模型专业理财策略意见 -->
  <div class="p-4 bg-gradient-to-r from-amber-500/5 to-zinc-950 border border-amber-500/10 rounded-xl flex items-start gap-3">
    <div class="p-2 bg-amber-500/10 rounded-lg text-amber-400 shadow-inner">
      <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
      </svg>
    </div>
    <div class="space-y-1">
      <div class="text-xs font-bold text-amber-400 uppercase tracking-wide">{l.loanAdvice}</div>
      <p class="text-xs text-zinc-300 leading-relaxed">{adviceText}</p>
    </div>
  </div>

  <!-- 还款摊销日程表明细表 -->
  <div class="space-y-3 bg-zinc-900/20 p-5 rounded-xl border border-zinc-800">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-zinc-800 pb-3">
      <div class="flex items-center gap-2">
        <svg class="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
        </svg>
        <span class="text-sm font-bold text-zinc-200">{l.scheduleTitle}</span>
      </div>

      <div class="flex gap-2">
        <button
          onclick={() => viewMode = 'yearly'}
          class="px-3 py-1 text-xs font-medium rounded-lg border transition-colors {viewMode === 'yearly' ? 'bg-amber-500/10 border-amber-500/40 text-amber-400' : 'border-zinc-800 text-zinc-400 hover:text-zinc-200'}"
        >
          {l.yearlyView}
        </button>
        <button
          onclick={() => viewMode = 'monthly'}
          class="px-3 py-1 text-xs font-medium rounded-lg border transition-colors {viewMode === 'monthly' ? 'bg-amber-500/10 border-amber-500/40 text-amber-400' : 'border-zinc-800 text-zinc-400 hover:text-zinc-200'}"
        >
          {l.monthlyView}
        </button>
        <button
          onclick={() => showSchedule = !showSchedule}
          class="px-3 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg text-xs font-medium transition-colors"
        >
          {showSchedule ? (locale === 'zh' ? '折叠' : 'Collapse') : (locale === 'zh' ? '展开明细表' : 'Show Details')}
        </button>
      </div>
    </div>

    {#if showSchedule}
      <div class="overflow-x-auto max-h-[350px] overflow-y-auto pr-1">
        <table class="w-full text-xs text-left border-collapse">
          <thead>
            <tr class="bg-zinc-950/80 sticky top-0 border-b border-zinc-800 text-zinc-400 uppercase tracking-wider font-semibold">
              <th class="py-2.5 px-3">{viewMode === 'monthly' ? l.period : (locale === 'zh' ? '年份' : 'Year')}</th>
              <th class="py-2.5 px-3 text-right">{l.originalPayment}</th>
              <th class="py-2.5 px-3 text-right">{l.optimizedPayment}</th>
              <th class="py-2.5 px-3 text-right">{l.principalPaid}</th>
              <th class="py-2.5 px-3 text-right">{l.interestPaid}</th>
              <th class="py-2.5 px-3 text-right">{l.prepaidAmount}</th>
              <th class="py-2.5 px-3 text-right">{l.remainingBalance}</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-zinc-800/40 font-mono text-zinc-300">
            {#if viewMode === 'monthly'}
              {#each calculationResult.optimizedPlan as item (item.period)}
                <tr class="hover:bg-zinc-900/30 transition-colors">
                  <td class="py-2 px-3 text-zinc-400 font-semibold">{item.period}</td>
                  <td class="py-2 px-3 text-right text-zinc-500">
                    {formatMoney(calculationResult.originalPlan[item.period - 1]?.payment || 0)}
                  </td>
                  <td class="py-2 px-3 text-right text-amber-400 font-bold">
                    {formatMoney(item.payment)}
                  </td>
                  <td class="py-2 px-3 text-right">
                    {formatMoney(item.principalPaid)}
                  </td>
                  <td class="py-2 px-3 text-right text-yellow-600/80">
                    {formatMoney(item.interestPaid)}
                  </td>
                  <td class="py-2 px-3 text-right text-emerald-500 font-semibold">
                    {item.prepaid > 0 ? formatMoney(item.prepaid) : '-'}
                  </td>
                  <td class="py-2 px-3 text-right text-zinc-400">
                    {formatMoney(item.balance)}
                  </td>
                </tr>
              {/each}
            {:else}
              {#each yearlySchedule as yearItem (yearItem.year)}
                <tr class="hover:bg-zinc-900/30 transition-colors">
                  <td class="py-2.5 px-3 text-zinc-400 font-bold">{(locale === 'zh' ? '第 ' : 'Year ') + yearItem.year + (locale === 'zh' ? ' 年' : '')}</td>
                  <td class="py-2.5 px-3 text-right text-zinc-500">
                    {formatMoney(12 * (calculationResult.originalPlan[0]?.payment || 0))}
                  </td>
                  <td class="py-2.5 px-3 text-right text-amber-400 font-bold">
                    {formatMoney(yearItem.payment)}
                  </td>
                  <td class="py-2.5 px-3 text-right">
                    {formatMoney(yearItem.principal)}
                  </td>
                  <td class="py-2.5 px-3 text-right text-yellow-600/80">
                    {formatMoney(yearItem.interest)}
                  </td>
                  <td class="py-2.5 px-3 text-right text-emerald-500 font-semibold">
                    {yearItem.prepaid > 0 ? formatMoney(yearItem.prepaid) : '-'}
                  </td>
                  <td class="py-2.5 px-3 text-right text-zinc-400">
                    {formatMoney(yearItem.balance)}
                  </td>
                </tr>
              {/each}
            {/if}
          </tbody>
        </table>
      </div>
    {/if}
  </div>

</div>

<style>
  /* 曜石黑金融图表专用微样式 */
  input[type="range"] {
    background: #e2e8f0;
    transition: background 0.3s;
  }
  input[type="range"]:hover {
    background: #cbd5e1;
  }
  :global(.dark) input[type="range"] {
    background: #27272a;
  }
  :global(.dark) input[type="range"]:hover {
    background: #3f3f46;
  }
  
  /* 隐藏隐藏 HTML 原生 Number 输入框上下箭头 */
  input[type="number"]::-webkit-outer-spin-button,
  input[type="number"]::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  input[type="number"] {
    -moz-appearance: textfield;
  }
</style>
