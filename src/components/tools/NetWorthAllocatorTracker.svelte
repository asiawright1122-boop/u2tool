<script lang="ts">
  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helper
  function t(key: string): string {
    const scope = translations['tools']?.['net-worth-allocator-tracker'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `tools.net-worth-allocator-tracker.${key}`;
  }

  import { onMount } from 'svelte';
  import { tweened } from 'svelte/motion';
  import { cubicOut } from 'svelte/easing';
  import EChartsWrapper from './EChartsWrapper.svelte';
  import { useChartTheme } from '@/hooks/useChartTheme';

  // Comprehensive 10-Language backup dictionaries ensuring 0% English leaks on EChart labels & backup bindings
  const I18N_BACKUP: Record<string, Record<string, string>> = {
    zh: {
      title: '多币种家庭净资产与资产配置追踪器',
      subtitle: '瑞士私银级哑光暗金面板 • 多币种折水与资产敏感性压力测试',
      liquidAssets: '流动资产',
      nonLiquidAssets: '非流动资产',
      investmentAssets: '投资性资产',
      liabilities: '负债',
      netWorth: '净资产',
      totalAssets: '总资产',
      totalLiabilities: '总负债',
      baseCurrency: '主计价币种',
      currencyUnit: '元',
      stockVolatility: '股票市场波动模拟',
      propertyVolatility: '房产市场波动模拟',
      debtRatio: '资产负债率',
      liquidityRatio: '流动性比率',
      assetHealth: '财务杠杆与健康度诊断',
      statusSecure: '极度稳健 (Secure)',
      statusHealthy: '健康合理 (Healthy)',
      statusLeveraged: '杠杆偏高 (Leveraged)',
      statusRisky: '风险警示 (Risky)',
      adviceSecure: '极度稳健：您的负债比例极低，流动资产充裕，财务护城河极深，抗御外部金融风险能力极强。',
      adviceHealthy: '结构健康：负债处于黄金比例。杠杆适度，资金利用率高，建议保持当前的资产配置比例。',
      adviceLeveraged: '杠杆过高：房贷或消费贷比例偏大，流动资产较为吃紧。一旦收入波动，可能面临较大的短期偿债压力。',
      adviceRisky: '财务预警：总负债比例过高或净资产已缩水为负。请务必立刻收缩杠杆、增加储蓄、削减非必要开支！',
      chartTitle: '资产与负债结构占比环形图',
      assetList: '家庭资产分布明细表',
      liabilityList: '家庭负债明细表',
      assetName: '资产项目',
      liabilityName: '负债项目',
      amount: '数额',
      currency: '币种',
      addAsset: '添加资产项目',
      addLiability: '添加负债项目',
      delete: '删除',
      stockSens: '股市波动敏感性',
      propertySens: '房产价格敏感性',
      originalWorth: '原始净资产',
      simulatedWorth: '模拟压力测试净资产',
      healthReport: '精算诊断与压力测试报告',
      financialSafety: '财务安全指数',
      deposit: '银行存款',
      cash: '紧急准备金',
      house: '自住房产',
      stocks: '美股投资',
      ashares: 'A股组合',
      gold: '实物黄金',
      mortgage: '商业房贷',
      creditcard: '短期信用卡欠款',
      customItem: '自定义项目',
      currencyUSD: '美元 (USD)',
      currencyEUR: '欧元 (EUR)',
      currencyCNY: '人民币 (CNY)'
    },
    en: {
      title: 'Multi-Currency Net Worth & Asset Allocation Tracker',
      subtitle: 'Swiss private banking minimal dark gold dashboard • Multi-currency and price sensitivity stress tests',
      liquidAssets: 'Liquid Assets',
      nonLiquidAssets: 'Non-Liquid Assets',
      investmentAssets: 'Investment Assets',
      liabilities: 'Liabilities',
      netWorth: 'Net Worth',
      totalAssets: 'Total Assets',
      totalLiabilities: 'Total Liabilities',
      baseCurrency: 'Base Currency',
      currencyUnit: 'units',
      stockVolatility: 'Stock Market Volatility Simulation',
      propertyVolatility: 'Real Estate Volatility Simulation',
      debtRatio: 'Debt-to-Asset Ratio',
      liquidityRatio: 'Liquidity Ratio',
      assetHealth: 'Asset Leverage & Health Diagnosis',
      statusSecure: 'Conservatively Secure',
      statusHealthy: 'Healthy & Balanced',
      statusLeveraged: 'Highly Leveraged',
      statusRisky: 'Critical Alert / Risky',
      adviceSecure: 'Exceptionally robust. Your debt is minimal, cash reserves are abundant, and your financial moat is deep.',
      adviceHealthy: 'Balanced structural design. Safe leverage, efficient usage of assets. Keep your current pace.',
      adviceLeveraged: 'Elevated leverage. Mortgages or short-term debt are large. Income fluctuations could trigger liquidity issues.',
      adviceRisky: 'Critical risk. Assets are heavily outstripped by debts, or net worth is negative. Deleverage immediately.',
      chartTitle: 'Asset & Liability Distribution (ECharts Donut)',
      assetList: 'Asset Allocation Breakdown',
      liabilityList: 'Liability Breakdown',
      assetName: 'Asset Item',
      liabilityName: 'Liability Item',
      amount: 'Amount',
      currency: 'Currency',
      addAsset: 'Add Asset Item',
      addLiability: 'Add Liability Item',
      delete: 'Delete',
      stockSens: 'Stock Market Sensitivity',
      propertySens: 'Real Estate Sensitivity',
      originalWorth: 'Original Net Worth',
      simulatedWorth: 'Simulated Net Worth',
      healthReport: 'Actuarial Analysis & Stress Test Report',
      financialSafety: 'Financial Safety Index',
      deposit: 'Bank Savings',
      cash: 'Emergency Reserves',
      house: 'Primary Residence',
      stocks: 'US Equities',
      ashares: 'A-Share Portfolio',
      gold: 'Physical Gold',
      mortgage: 'Home Mortgage',
      creditcard: 'Short-term Credit Cards',
      customItem: 'Custom Item',
      currencyUSD: 'US Dollar (USD)',
      currencyEUR: 'Euro (EUR)',
      currencyCNY: 'Yuan (CNY)'
    },
    es: {
      title: 'Rastreador de Patrimonio Neto y Asignación de Activos Multidivisa',
      subtitle: 'Banca privada suiza • Pruebas de estrés y conversión multidivisa',
      liquidAssets: 'Activos Líquidos',
      nonLiquidAssets: 'Activos No Líquidos',
      investmentAssets: 'Activos de Inversión',
      liabilities: 'Pasivos / Deudas',
      netWorth: 'Patrimonio Neto',
      totalAssets: 'Total Activos',
      totalLiabilities: 'Total Pasivos',
      baseCurrency: 'Moneda Base',
      currencyUnit: 'unidades',
      stockVolatility: 'Simulación de Volatilidad de Acciones',
      propertyVolatility: 'Simulación de Volatilidad de Propiedades',
      debtRatio: 'Relación Deuda/Activo',
      liquidityRatio: 'Ratio de Liquidez',
      assetHealth: 'Diagnóstico de Salud Financiera',
      statusSecure: 'Extremadamente Seguro',
      statusHealthy: 'Saludable y Equilibrado',
      statusLeveraged: 'Apalancamiento Alto',
      statusRisky: 'Riesgo / Alerta Crítica',
      adviceSecure: 'Estructura extremadamente segura. Deuda mínima, abundantes reservas líquidas y gran defensa contra riesgos.',
      adviceHealthy: 'Estructura equilibrada. Nivel de deuda óptimo con alta eficiencia de capital.',
      adviceLeveraged: 'Apalancamiento alto. La hipoteca es pesada. Variaciones de ingresos podrían causar riesgos de liquidez.',
      adviceRisky: 'Riesgo financiero crítico. Los pasivos superan a los activos. Reduzca deuda y recorte gastos urgentemente.',
      chartTitle: 'Distribución de Activos y Pasivos',
      assetList: 'Detalle de Activos del Hogar',
      liabilityList: 'Detalle de Pasivos del Hogar',
      assetName: 'Nombre del Activo',
      liabilityName: 'Nombre del Pasivo',
      amount: 'Monto',
      currency: 'Moneda',
      addAsset: 'Añadir Activo',
      addLiability: 'Añadir Pasivo',
      delete: 'Eliminar',
      stockSens: 'Sensibilidad de Bolsa',
      propertySens: 'Sensibilidad de Propiedad',
      originalWorth: 'Patrimonio Neto Original',
      simulatedWorth: 'Patrimonio Neto Simulado',
      healthReport: 'Informe de Diagnóstico Actuarial',
      financialSafety: 'Índice de Seguridad Financiera',
      deposit: 'Depósitos Bancarios',
      cash: 'Reservas de Emergencia',
      house: 'Residencia Principal',
      stocks: 'Acciones de EE. UU.',
      ashares: 'Portafolio de Acciones A',
      gold: 'Oro Físico',
      mortgage: 'Hipoteca de Hogar',
      creditcard: 'Tarjetas de Crédito',
      customItem: 'Elemento Personalizado',
      currencyUSD: 'Dólar (USD)',
      currencyEUR: 'Euro (EUR)',
      currencyCNY: 'Yuan (CNY)'
    },
    pt: {
      title: 'Otimizador de Patrimônio Líquido e Alocação de Ativos Multimoedas',
      subtitle: 'Private banking suíço • Conversão multimoedas e simulação de estresse',
      liquidAssets: 'Ativos Líquidos',
      nonLiquidAssets: 'Ativos Não Líquidos',
      investmentAssets: 'Ativos de Investimento',
      liabilities: 'Passivos / Dívidas',
      netWorth: 'Patrimônio Líquido',
      totalAssets: 'Total de Ativos',
      totalLiabilities: 'Total de Passivos',
      baseCurrency: 'Moeda Base',
      currencyUnit: 'unidades',
      stockVolatility: 'Volatilidade de Ações',
      propertyVolatility: 'Volatilidade de Imóveis',
      debtRatio: 'Relação Dívida/Ativos',
      liquidityRatio: 'Índice de Liquidez',
      assetHealth: 'Diagnóstico de Alavancagem e Saúde',
      statusSecure: 'Extremamente Seguro',
      statusHealthy: 'Saudável e Equilibrado',
      statusLeveraged: 'Alavancagem Elevada',
      statusRisky: 'Alerta Crítico / Risco',
      adviceSecure: 'Estrutura extremamente robusta. Dívida mínima, reservas abundantes e forte proteção financeira.',
      adviceHealthy: 'Design estrutural equilibrado. Nível seguro de alavancagem com alta eficiência.',
      adviceLeveraged: 'Alavancagem alta. Hipotecas pesadas. Flutuações de renda podem gerar pressões de liquidez.',
      adviceRisky: 'Alerta crítico. As dívidas superam os ativos ou patrimônio líquido negativo. Reduza despesas imediatamente.',
      chartTitle: 'Distribuição de Ativos e Passivos',
      assetList: 'Distribuição de Ativos',
      liabilityList: 'Distribuição de Passivos',
      assetName: 'Nome do Ativo',
      liabilityName: 'Nome da Dívida',
      amount: 'Valor',
      currency: 'Moeda',
      addAsset: 'Adicionar Ativo',
      addLiability: 'Adicionar Passivo',
      delete: 'Excluir',
      stockSens: 'Sensibilidade de Ações',
      propertySens: 'Sensibilidade de Imóveis',
      originalWorth: 'Patrimônio Original',
      simulatedWorth: 'Patrimônio Simulado',
      healthReport: 'Relatório de Saúde Financeira',
      financialSafety: 'Índice de Segurança Financeira',
      deposit: 'Depósito Bancário',
      cash: 'Reservas de Emergência',
      house: 'Residência Principal',
      stocks: 'Ações Globais',
      ashares: 'Portfólio de Ações A',
      gold: 'Ouro Físico',
      mortgage: 'Financiamento Imobiliário',
      creditcard: 'Cartões de Crédito',
      customItem: 'Item Personalizado',
      currencyUSD: 'Dólar (USD)',
      currencyEUR: 'Euro (EUR)',
      currencyCNY: 'Yuan (CNY)'
    },
    ja: {
      title: '多通貨対応個人純資産・資産配分シミュレーター',
      subtitle: 'スイスプライベートバンク仕様 • リアルタイム為替換算＆資産価格ストレステスト',
      liquidAssets: '流動資産',
      nonLiquidAssets: '非流動資産',
      investmentAssets: '投資資産',
      liabilities: '負債',
      netWorth: '純資産',
      totalAssets: '総資産',
      totalLiabilities: '総負债',
      baseCurrency: '基本表示通貨',
      currencyUnit: '円',
      stockVolatility: '株式市場の価格変動シミュレート',
      propertyVolatility: '不動産市場の価格変動シミュレート',
      debtRatio: '自己資本・負債比率',
      liquidityRatio: '流動性比率',
      assetHealth: '財務レバレッジ＆健全性診断',
      statusSecure: '極めて強固 (Secure)',
      statusHealthy: '健全・バランス (Healthy)',
      statusLeveraged: 'レバレッジ過多 (Leveraged)',
      statusRisky: '債務超過リスク (Risky)',
      adviceSecure: '極めて強固です。負債は最小限で、十分な流動性資産を保有しており、外部リスクへの耐性は抜群です。',
      adviceHealthy: 'バランスの取れた健全な構造です。適度なレバレッジを活用し、資産が効率的に運用されています。',
      adviceLeveraged: 'レバレッジが過多傾向にあります。住宅ローン等の比率が大きく、収入が途絶えると返済リスクが高まります。',
      adviceRisky: '重大な警告水域です。負債額が資産額を上回っているか、純資産がマイナスです。早急なレバレッジ縮小が必要です。',
      chartTitle: '資産・負債構成比率ドーナツチャート',
      assetList: '保有資産内訳表',
      liabilityList: '負債内訳表',
      assetName: '資産項目',
      liabilityName: '負債項目',
      amount: '金額',
      currency: '通貨',
      addAsset: '資産項目の追加',
      addLiability: '負債項目の追加',
      delete: '削除',
      stockSens: '株式市場の価格感応度',
      propertySens: '不動産価格の感応度',
      originalWorth: '当初の純資産',
      simulatedWorth: 'シミュレート後の純資産',
      healthReport: '精算診断＆ストレステスト報告書',
      financialSafety: '財務安全評価指数',
      deposit: '銀行預金',
      cash: '緊急用予備資金',
      house: '保有不動産（自宅）',
      stocks: '米国株式',
      ashares: '国内株式ポートフォリオ',
      gold: '純金地金',
      mortgage: '住宅ローン借入金',
      creditcard: 'クレジットカード未払金',
      customItem: 'カスタム項目',
      currencyUSD: '米ドル (USD)',
      currencyEUR: 'ユーロ (EUR)',
      currencyCNY: '人民元 (CNY)'
    },
    ru: {
      title: 'Мультивалютный трекер чистых активов и капитала',
      subtitle: 'Швейцарский private banking • Конвертация валют и стресс-тесты цен',
      liquidAssets: 'Ликвидные активы',
      nonLiquidAssets: 'Неликвидные активы',
      investmentAssets: 'Инвестиционные активы',
      liabilities: 'Обязательства / Долги',
      netWorth: 'Чистые активы',
      totalAssets: 'Всего активов',
      totalLiabilities: 'Всего обязательств',
      baseCurrency: 'Основная валюта',
      currencyUnit: 'ед.',
      stockVolatility: 'Симуляция волатильности акций',
      propertyVolatility: 'Симуляция цен на недвижимость',
      debtRatio: 'Отношение долга к активам',
      liquidityRatio: 'Коэффициент ликвидности',
      assetHealth: 'Оценка левериджа и здоровья капитала',
      statusSecure: 'Исключительно стабильно',
      statusHealthy: 'Здоровый баланс',
      statusLeveraged: 'Высокий леверидж',
      statusRisky: 'Критический риск',
      adviceSecure: 'Исключительно надежно. У вас минимальный долг, большие ликвидные резервы и глубокий финансовый ров.',
      adviceHealthy: 'Сбалансированная структура. Оптимальный уровень долга с высокой эффективностью использования капитала.',
      adviceLeveraged: 'Высокий долг. Ипотечные обязательства велики. Перебои в доходах могут вызвать проблемы с ликвидностью.',
      adviceRisky: 'Критический риск. Ваши обязательства превышают активы, или капитал отрицательный. Срочно сокращайте долги.',
      chartTitle: 'Круговая диаграмма распределения капитала',
      assetList: 'Расшифровка активов домохозяйства',
      liabilityList: 'Расшифровка пассивов и долгов',
      assetName: 'Статья активов',
      liabilityName: 'Статья пассивов',
      amount: 'Сумма',
      currency: 'Валюта',
      addAsset: 'Добавить актив',
      addLiability: 'Добавить долг',
      delete: 'Удалить',
      stockSens: 'Чувствительность акций',
      propertySens: 'Чувствительность недвижимости',
      originalWorth: 'Исходные чистые активы',
      simulatedWorth: 'Оценочные чистые активы',
      healthReport: 'Отчет об актуализации стресс-тестов',
      financialSafety: 'Индекс безопасности капитала',
      deposit: 'Банковские вклады',
      cash: 'Резервы на случай ЧС',
      house: 'Основное жилье',
      stocks: 'Акции США',
      ashares: 'Портфель акций А',
      gold: 'Физическое золото',
      mortgage: 'Ипотечный кредит',
      creditcard: 'Карточные долги',
      customItem: 'Пользовательская статья',
      currencyUSD: 'Доллар США (USD)',
      currencyEUR: 'Евро (EUR)',
      currencyCNY: 'Юань (CNY)'
    },
    fr: {
      title: "Suivi du Patrimoine Net et de l'Allocation d'Actifs Multidevises",
      subtitle: 'Style banque privée suisse • Suivi actif-passif et stress-tests boursier / immobilier',
      liquidAssets: 'Actifs Liquides',
      nonLiquidAssets: 'Actifs Non Liquides',
      investmentAssets: "Actifs d'Investissement",
      liabilities: 'Passifs / Dettes',
      netWorth: 'Patrimoine Net',
      totalAssets: 'Total Actifs',
      totalLiabilities: 'Total Passifs',
      baseCurrency: 'Devise Principale',
      currencyUnit: 'unités',
      stockVolatility: 'Volatilité des Actions',
      propertyVolatility: "Volatilité de l'Immobilier",
      debtRatio: 'Ratio Dette / Actifs',
      liquidityRatio: 'Ratio de Liquidité',
      assetHealth: 'Diagnostic de Santé et de Levier',
      statusSecure: 'Extremement Stable',
      statusHealthy: 'Sain et Équilibré',
      statusLeveraged: 'Levier Élevé',
      statusRisky: 'Risque Majeur',
      adviceSecure: 'Situation de grande sécurité. Vos dettes sont minimales et vos liquidités abondantes pour parer les crises.',
      adviceHealthy: 'Structure saine et équilibrée. Utilisation intelligente du capital avec un levier modéré.',
      adviceLeveraged: "Levier trop élevé. Les mensualités de crédit pèsent lourd. Attention en cas de baisse de revenus.",
      adviceRisky: "Danger financier critique. Le passif surpasse l'actif ou patrimoine négatif. Désendettez-vous d'urgence.",
      chartTitle: 'Répartition Actif-Passif (ECharts)',
      assetList: 'Détail des Actifs',
      liabilityList: 'Détail des Dettes',
      assetName: "Nom de l'Actif",
      liabilityName: 'Nom de la Dette',
      amount: 'Montant',
      currency: 'Devise',
      addAsset: 'Ajouter un Actif',
      addLiability: 'Ajouter une Dette',
      delete: 'Supprimer',
      stockSens: 'Sensibilité Actions',
      propertySens: 'Sensibilité Immobilier',
      originalWorth: 'Fortune Initiale',
      simulatedWorth: 'Fortune Estimée (Stress)',
      healthReport: 'Rapport Financier Actuariel',
      financialSafety: 'Indice de Sécurité Financière',
      deposit: 'Dépôts Bancaires',
      cash: 'Épargne de Précaution',
      house: 'Résidence Principale',
      stocks: 'Actions Globales',
      ashares: 'Portefeuille Actions A',
      gold: 'Or Physique',
      mortgage: 'Prêt Immobilier',
      creditcard: 'Crédits Renouvelables',
      customItem: 'Élément Personnalisé',
      currencyUSD: 'Dollar (USD)',
      currencyEUR: 'Euro (EUR)',
      currencyCNY: 'Yuan (CNY)'
    },
    ar: {
      title: 'أداة تتبع صافي الثروة وتوزيع الأصول متعددة العملات',
      subtitle: 'أسلوب المصارف السويسرية الخاصة • تحويل متعدد العملات واختبار الجهد العقاري والمالي',
      liquidAssets: 'الأصول السائلة',
      nonLiquidAssets: 'الأصول غير السائلة',
      investmentAssets: 'الأصول الاستثمارية',
      liabilities: 'الالتزامات والديون',
      netWorth: 'صافي الثروة',
      totalAssets: 'إجمالي الأصول',
      totalLiabilities: 'إجمالي الالتزامات',
      baseCurrency: 'العملة الأساسية',
      currencyUnit: 'وحدة',
      stockVolatility: 'محاكاة تقلبات سوق الأسهم',
      propertyVolatility: 'محاكاة تقلبات أسعار العقارات',
      debtRatio: 'نسبة الدين إلى الأصول',
      liquidityRatio: 'نسبة السيولة',
      assetHealth: 'تشخيص الرافعة المالية والصحة المالية',
      statusSecure: 'مستقر ومتين للغاية',
      statusHealthy: 'صحي ومتوازن',
      statusLeveraged: 'رافعة مالية مرتفعة',
      statusRisky: 'خطر مالي حرج',
      adviceSecure: 'بنية مالية متينة للغاية. ديونك في حدها الأدنى والسيولة وفيرة جداً لحمايتك من الأزمات.',
      adviceHealthy: 'تصميم هيكلي متوازن. رافعة مالية آمنة واستخدام فعال لرأس المال.',
      adviceLeveraged: 'رافعة مالية عالية. ديون الرهن العقاري كبيرة. تقلب الدخل قد يمثل ضغطاً على السيولة.',
      adviceRisky: 'خطر مالي حرج. التزاماتك تفوق أصولك أو صافي ثروتك سالب. يرجى خفض الديون فوراً.',
      chartTitle: 'مخطط دائري لتوزيع الثروة',
      assetList: 'تفاصيل الأصول العائلية',
      liabilityList: 'تفاصيل الالتزامات العائلية',
      assetName: 'اسم الأصل',
      liabilityName: 'اسم الالتزام',
      amount: 'المبلغ',
      currency: 'العملة',
      addAsset: 'إضافة أصل',
      addLiability: 'إضافة التزام',
      delete: 'حذف',
      stockSens: 'حساسية الأسهم',
      propertySens: 'حساسية العقارات',
      originalWorth: 'صافي الثروة الأصلي',
      simulatedWorth: 'صافي الثروة المحاكي',
      healthReport: 'تقرير التشخيص المالي واختبار الجهد',
      financialSafety: 'مؤشر الأمان المالي',
      deposit: 'ودائع بنكية',
      cash: 'احتياطي الطوارئ',
      house: 'المسكن الرئيسي',
      stocks: 'أسهم عالمية',
      ashares: 'محفظة الأسهم أ',
      gold: 'ذهب مادي',
      mortgage: 'قرض تمويل عقاري',
      creditcard: 'ديون بطاقات الائتمان',
      customItem: 'عنصر مخصص',
      currencyUSD: 'دولار أمريكي (USD)',
      currencyEUR: 'يورو (EUR)',
      currencyCNY: 'يوان صيني (CNY)'
    },
    de: {
      title: 'Tracker für Haushalts-Nettovermögen und Asset Allocation',
      subtitle: 'Schweizer Private-Banking-Stil • Stresstests für Vermögenspreise und Devisen',
      liquidAssets: 'Liquides Vermögen',
      nonLiquidAssets: 'Illiquides Vermögen',
      investmentAssets: 'Anlagevermögen',
      liabilities: 'Verbindlichkeiten / Schulden',
      netWorth: 'Nettovermögen',
      totalAssets: 'Gesamtvermögen',
      totalLiabilities: 'Gesamtverbindlichkeiten',
      baseCurrency: 'Hauptwährung',
      currencyUnit: 'Einheiten',
      stockVolatility: 'Aktienmarkt-Volatilitätssimulation',
      propertyVolatility: 'Immobilienmarkt-Volatilitätssimulation',
      debtRatio: 'Schuldenquote',
      liquidityRatio: 'Liquiditätsquote',
      assetHealth: 'Finanzhebel- & Gesundheitsdiagnose',
      statusSecure: 'Äußerst Stabil',
      statusHealthy: 'Ausgewogen & Gesund',
      statusLeveraged: 'Hoher Finanzhebel',
      statusRisky: 'Kritisches Risiko',
      adviceSecure: 'Hervorragend abgesichert. Ihre Schulden sind minimal, Barreserven reichlich und Ihre Finanzfestung ist stark.',
      adviceHealthy: 'Ausgewogenes Design. Sichere Hebelwirkung, effiziente Kapitalnutzung.',
      adviceLeveraged: 'Erhöhter Hebel. Große Hypotheken oder Kredite. Einkommensschwankungen könnten Liquiditätsprobleme verursachen.',
      adviceRisky: 'Kritisches Risiko. Ihre Schulden übersteigen Ihr Vermögen oder negatives Nettovermögen. Entschulden Sie sich sofort.',
      chartTitle: 'Asset & Liability Donut-Diagramm (ECharts)',
      assetList: 'Aufschlüsselung des Vermögens',
      liabilityList: 'Aufschlüsselung der Schulden',
      assetName: 'Vermögenswert',
      liabilityName: 'Schuldposten',
      amount: 'Betrag',
      currency: 'Währung',
      addAsset: 'Vermögenswert hinzufügen',
      addLiability: 'Schuld hinzufügen',
      delete: 'Löschen',
      stockSens: 'Aktien-Sensitivität',
      propertySens: 'Immobilien-Sensitivität',
      originalWorth: 'Ursprüngliches Nettovermögen',
      simulatedWorth: 'Simuliertes Nettovermögen',
      healthReport: 'Finanzdiagnose und Stresstest-Bericht',
      financialSafety: 'Finanzsicherheitsindex',
      deposit: 'Bankguthaben',
      cash: 'Notfallreserven',
      house: 'Hauptwohnsitz',
      stocks: 'US-Aktien',
      ashares: 'A-Aktien-Portfolio',
      gold: 'Physisches Gold',
      mortgage: 'Immobilienkredit',
      creditcard: 'Kreditkartenschulden',
      customItem: 'Benutzerdefiniertes Element',
      currencyUSD: 'US-Dollar (USD)',
      currencyEUR: 'Euro (EUR)',
      currencyCNY: 'Yuan (CNY)'
    },
    ko: {
      title: '다통화 가계 순자산 및 자산 배분 시뮬레이터',
      subtitle: '스위스 프라이빗 뱅킹 스타일 • 다통화 실시간 환산 및 주식·부동산 스트레스 테스트',
      liquidAssets: '유동자산',
      nonLiquidAssets: '비유동자산',
      investmentAssets: '투자자산',
      liabilities: '부채',
      netWorth: '순자산',
      totalAssets: '총자산',
      totalLiabilities: '총부채',
      baseCurrency: '기준 표시 통화',
      currencyUnit: '원',
      stockVolatility: '주식 가격 변동 시뮬레이션',
      propertyVolatility: '부동산 가격 변동 시뮬레이션',
      debtRatio: '자산부채비율',
      liquidityRatio: '유동성 비율',
      assetHealth: '재무 레버리지 및 건강도 진단',
      statusSecure: '극도로 견고 (Secure)',
      statusHealthy: '건강하고 균형적 (Healthy)',
      statusLeveraged: '레버리지 부담 (Leveraged)',
      statusRisky: '자산 구조 위험 (Risky)',
      adviceSecure: '극도로 견고합니다. 부채가 매우 적고 비상 유동성이 풍부하여 외부 재무 위기에 견디는 방어력이 매우 뛰어납니다.',
      adviceHealthy: '균형 잡힌 안전한 가계 자산 구조입니다. 적절한 레버리지를 활용하며 자산을 효율적으로 굴리고 있습니다.',
      adviceLeveraged: '레버리지 비율이 다소 높습니다. 주택 담보 대출 비중이 커 소득이 흔들릴 때 일시적 유동성 압박이 발생할 수 있습니다.',
      adviceRisky: '가계 재무구조가 매우 취약합니다. 부채가 자산을 초과하거나 순자산이 마이너스입니다. 긴급한 부채 정리가 필요합니다.',
      chartTitle: '가계 자산-부채 구성비 도넛 차트',
      assetList: '세부 자산 항목 일람',
      liabilityList: '세부 부채 항목 일람',
      assetName: '자산 항목명',
      liabilityName: '부채 항목명',
      amount: '금액',
      currency: '통화',
      addAsset: '자산 항목 추가',
      addLiability: '부채 항목 추가',
      delete: '삭제',
      stockSens: '주식 가격 민감도',
      propertySens: '부동산 가격 민감도',
      originalWorth: '기존 순자산',
      simulatedWorth: '시뮬레이션 순자산',
      healthReport: '정밀 진단 및 스트레스 테스트 보고서',
      financialSafety: '가계 재무 안전 평가 지수',
      deposit: '은행 예금',
      cash: '비상 유동 자금',
      house: '자가 소유 주택',
      stocks: '미국 주식',
      ashares: '국내 주식 포트폴리오',
      gold: '실물 금 지분',
      mortgage: '은행 담보 대출',
      creditcard: '신용카드 결제 대금',
      customItem: '사용자 지정 항목',
      currencyUSD: '미국 달러 (USD)',
      currencyEUR: '유로화 (EUR)',
      currencyCNY: '위안화 (CNY)'
    }
  };

  // Safe dictionary access fallback
  const l = $derived(I18N_BACKUP[locale] || I18N_BACKUP['zh']);

  // Rates in terms of 1 Unit CNY (e.g. 1 USD = 7.2 CNY, 1 EUR = 7.8 CNY)
  const RATES: Record<string, number> = {
    CNY: 1.0,
    USD: 7.2,
    EUR: 7.8
  };

  // Svelte 5 Runes for states
  let baseCurrency = $state<'CNY' | 'USD' | 'EUR'>('CNY');
  let stockVolatility = $state<number>(0);      // Stock shock range [-50%, 50%]
  let propertyVolatility = $state<number>(0);   // Real Estate shock range [-30%, 30%]

  // Portfolios structure using $state
  let assets = $state([
    { id: 1, type: 'liquid', labelKey: 'deposit', name: '', amount: 300000, currency: 'CNY' },
    { id: 2, type: 'liquid', labelKey: 'cash', name: '', amount: 10000, currency: 'USD' },
    { id: 3, type: 'nonliquid', labelKey: 'house', name: '', amount: 3500000, currency: 'CNY' },
    { id: 4, type: 'investment', labelKey: 'stocks', name: '', amount: 50000, currency: 'USD' },
    { id: 5, type: 'investment', labelKey: 'ashares', name: '', amount: 150000, currency: 'CNY' },
    { id: 6, type: 'investment', labelKey: 'gold', name: '', amount: 100000, currency: 'CNY' }
  ]);

  let liabilities = $state([
    { id: 1, labelKey: 'mortgage', name: '', amount: 1800000, currency: 'CNY' },
    { id: 2, labelKey: 'creditcard', name: '', amount: 15000, currency: 'CNY' }
  ]);

  // Form states
  let newAssetType = $state<'liquid' | 'nonliquid' | 'investment'>('liquid');
  let newAssetName = $state('');
  let newAssetAmount = $state<number | null>(null);
  let newAssetCurrency = $state<string>('CNY');

  let newLiabilityName = $state('');
  let newLiabilityAmount = $state<number | null>(null);
  let newLiabilityCurrency = $state<string>('CNY');

  // Dynamic currency helper
  function toBase(amount: number, fromCurrency: string, targetCurrency: string): number {
    // 1. Convert to CNY
    const amtCNY = amount * (RATES[fromCurrency] || 1.0);
    // 2. Convert to Target Currency
    return amtCNY / (RATES[targetCurrency] || 1.0);
  }

  // Get item label (checks key fallback)
  function getItemLabel(item: { labelKey?: string, name?: string }): string {
    if (item.labelKey && l[item.labelKey]) {
      return l[item.labelKey];
    }
    return item.name || l.customItem;
  }

  // Derived states using $derived for reactive calculation of simulated values
  const simulatedPortfolio = $derived.by(() => {
    // Simulated Assets list
    const assetsSim = assets.map(item => {
      let amountFactor = 1.0;
      if (item.type === 'investment') {
        amountFactor = 1.0 + (stockVolatility / 100);
      } else if (item.type === 'nonliquid') {
        amountFactor = 1.0 + (propertyVolatility / 100);
      }
      const simVal = item.amount * amountFactor;
      const simValBase = toBase(simVal, item.currency, baseCurrency);
      const origValBase = toBase(item.amount, item.currency, baseCurrency);

      return {
        ...item,
        simVal,
        simValBase,
        origValBase
      };
    });

    // Simulated Liabilities list
    const liabilitiesSim = liabilities.map(item => {
      const valBase = toBase(item.amount, item.currency, baseCurrency);
      return {
        ...item,
        simVal: item.amount,
        simValBase: valBase,
        origValBase: valBase
      };
    });

    // Summing aggregates
    let totalAssetsOriginal = 0;
    let totalAssetsSimulated = 0;
    let liquidSimulated = 0;
    let nonLiquidSimulated = 0;
    let investmentSimulated = 0;

    assetsSim.forEach(a => {
      totalAssetsOriginal += a.origValBase;
      totalAssetsSimulated += a.simValBase;
      if (a.type === 'liquid') liquidSimulated += a.simValBase;
      if (a.type === 'nonliquid') nonLiquidSimulated += a.simValBase;
      if (a.type === 'investment') investmentSimulated += a.simValBase;
    });

    let totalLiabilitiesOriginal = 0;
    let totalLiabilitiesSimulated = 0;
    liabilitiesSim.forEach(l => {
      totalLiabilitiesOriginal += l.origValBase;
      totalLiabilitiesSimulated += l.simValBase;
    });

    const netWorthOriginal = totalAssetsOriginal - totalLiabilitiesOriginal;
    const netWorthSimulated = totalAssetsSimulated - totalLiabilitiesSimulated;

    const debtRatio = totalAssetsSimulated > 0 ? (totalLiabilitiesSimulated / totalAssetsSimulated) * 100 : 0;
    const liquidityRatio = totalLiabilitiesSimulated > 0 ? (liquidSimulated / totalLiabilitiesSimulated) * 100 : 999;

    // Health Rating
    let statusClass = 'status-secure';
    let statusLabel = l.statusSecure;
    let advice = l.adviceSecure;

    if (netWorthSimulated <= 0 || debtRatio >= 75) {
      statusClass = 'status-risky';
      statusLabel = l.statusRisky;
      advice = l.adviceRisky;
    } else if (debtRatio >= 50) {
      statusClass = 'status-leveraged';
      statusLabel = l.statusLeveraged;
      advice = l.adviceLeveraged;
    } else if (debtRatio >= 20) {
      statusClass = 'status-healthy';
      statusLabel = l.statusHealthy;
      advice = l.adviceHealthy;
    }

    return {
      assetsSim,
      liabilitiesSim,
      originalWorth: netWorthOriginal,
      simulatedWorth: netWorthSimulated,
      totalAssetsSimulated,
      totalLiabilitiesSimulated,
      liquidSimulated,
      nonLiquidSimulated,
      investmentSimulated,
      debtRatio,
      liquidityRatio,
      statusClass,
      statusLabel,
      advice
    };
  });

  // Numeric animation using Svelte 5 $effect with Svelte's tweened motion
  const animNetWorth = tweened(0, { duration: 350, easing: cubicOut });
  const animTotalAssets = tweened(0, { duration: 350, easing: cubicOut });
  const animTotalLiabilities = tweened(0, { duration: 350, easing: cubicOut });

  $effect(() => {
    animNetWorth.set(simulatedPortfolio.simulatedWorth);
    animTotalAssets.set(simulatedPortfolio.totalAssetsSimulated);
    animTotalLiabilities.set(simulatedPortfolio.totalLiabilitiesSimulated);
  });

  // Action methods
  function addAssetItem(e: Event) {
    e.preventDefault();
    if (!newAssetAmount || newAssetAmount <= 0) return;
    const name = newAssetName.trim();
    assets.push({
      id: Date.now(),
      type: newAssetType,
      labelKey: '',
      name: name || l.customItem,
      amount: newAssetAmount,
      currency: newAssetCurrency
    });
    newAssetName = '';
    newAssetAmount = null;
  }

  function addLiabilityItem(e: Event) {
    e.preventDefault();
    if (!newLiabilityAmount || newLiabilityAmount <= 0) return;
    const name = newLiabilityName.trim();
    liabilities.push({
      id: Date.now(),
      labelKey: '',
      name: name || l.customItem,
      amount: newLiabilityAmount,
      currency: newLiabilityCurrency
    });
    newLiabilityName = '';
    newLiabilityAmount = null;
  }

  function deleteAsset(id: number) {
    assets = assets.filter(item => item.id !== id);
  }

  function deleteLiability(id: number) {
    liabilities = liabilities.filter(item => item.id !== id);
  }

  // Currency toggler helper
  const currencySymbols: Record<string, string> = {
    CNY: '¥',
    USD: '$',
    EUR: '€'
  };

  // ECharts reactive options for Swiss private banking style donut pie
  const chartTheme = useChartTheme();
  let chartRef = $state<{ getEchartsInstance?: () => any } | null>(null);

  const chartOption = $derived.by(() => {
    const liquid = simulatedPortfolio.liquidSimulated;
    const nonLiquid = simulatedPortfolio.nonLiquidSimulated;
    const investment = simulatedPortfolio.investmentSimulated;
    const debts = simulatedPortfolio.totalLiabilitiesSimulated;

    return {
      backgroundColor: 'transparent',
      title: {
        text: l.chartTitle || '资产与负债结构',
        left: 'center',
        textStyle: { color: '#C5A059', fontSize: 13, fontWeight: 'bold' }
      },
      tooltip: {
        trigger: 'item',
        backgroundColor: 'rgba(15, 15, 15, 0.95)',
        borderColor: '#8A6623',
        borderWidth: 1,
        textStyle: { color: '#E5C47F', fontSize: 12 },
        formatter: (params: any) => {
          return `<div style="padding:4px 8px;">
            <div style="font-weight:bold;margin-bottom:4px;color:#FFF;">${params.name}</div>
            <div style="display:flex;justify-content:space-between;gap:12px;">
              <span>${l.amount}:</span>
              <span style="font-weight:bold;color:#C5A059;">${currencySymbols[baseCurrency]}${Math.round(params.value).toLocaleString()}</span>
            </div>
            <div style="display:flex;justify-content:space-between;gap:12px;font-size:11px;color:#B5B5B5;">
              <span>占比:</span>
              <span>${params.percent}%</span>
            </div>
          </div>`;
        }
      },
      legend: {
        orient: 'horizontal',
        bottom: 0,
        data: [l.liquidAssets, l.nonLiquidAssets, l.investmentAssets, l.liabilities],
        textStyle: { color: '#B5B5B5', fontSize: 11 }
      },
      series: [
        {
          name: 'Allocation',
          type: 'pie',
          radius: ['45%', '70%'],
          center: ['50%', '45%'],
          avoidLabelOverlap: false,
          label: { show: false },
          emphasis: {
            label: { show: false }
          },
          labelLine: { show: false },
          itemStyle: {
            borderColor: '#121212',
            borderWidth: 2
          },
          color: [
            '#C5A059', // Liquid Assets - Champagne gold
            '#8A6623', // Non-Liquid Assets - Deep bronze gold
            '#E5C47F', // Investment Assets - Bright warm gold
            '#333333'  // Liabilities - Dark gray (de-emphasized)
          ],
          data: [
            { value: liquid, name: l.liquidAssets },
            { value: nonLiquid, name: l.nonLiquidAssets },
            { value: investment, name: l.investmentAssets },
            { value: debts, name: l.liabilities }
          ]
        }
      ]
    };
  });
</script>

<div class="luxury-calculator obsidian-theme">
  <!-- Header 流光渐变 -->
  <header class="calc-header">
    <div class="logo-area">
      <span class="metallic-gold-text tracking-wider">{l.title}</span>
      <p class="subtitle">{l.subtitle}</p>
    </div>
    <!-- 币种切换胶囊 -->
    <div class="currency-toggle-capsule">
      <span class="currency-label">{l.baseCurrency}</span>
      <div class="toggle-buttons">
        {#each ['CNY', 'USD', 'EUR'] as cur}
          <button
            class="currency-btn"
            class:active={baseCurrency === cur}
            onclick={() => baseCurrency = cur as any}
          >
            {cur}
          </button>
        {/each}
      </div>
    </div>
  </header>

  <!-- 主栅格结构 -->
  <div class="calc-grid">
    <!-- 左栏: 参数录入与列表配置 -->
    <section class="left-panel grid-column">
      <!-- 敏感性压力测试 -->
      <div class="calc-card stress-test-card">
        <h3 class="card-title text-gold flex items-center gap-2">
          <span>⚖️</span> {l.stockVolatility}
        </h3>
        <div class="slider-group">
          <div class="slider-header">
            <span>{l.stockSens}</span>
            <span class="gold-badge">{stockVolatility > 0 ? '+' : ''}{stockVolatility}%</span>
          </div>
          <input
            type="range"
            min="-50"
            max="50"
            step="5"
            bind:value={stockVolatility}
            class="gold-range-slider"
          />
          <div class="slider-markers">
            <span>-50%</span>
            <span>0%</span>
            <span>+50%</span>
          </div>
        </div>

        <div class="slider-group mt-6">
          <div class="slider-header">
            <span>{l.propertySens}</span>
            <span class="gold-badge">{propertyVolatility > 0 ? '+' : ''}{propertyVolatility}%</span>
          </div>
          <input
            type="range"
            min="-30"
            max="30"
            step="5"
            bind:value={propertyVolatility}
            class="gold-range-slider"
          />
          <div class="slider-markers">
            <span>-30%</span>
            <span>0%</span>
            <span>+30%</span>
          </div>
        </div>
      </div>

      <!-- 资产项目 -->
      <div class="calc-card item-list-card">
        <h3 class="card-title text-gold flex items-center justify-between">
          <span>💰 {l.assetList}</span>
        </h3>
        
        <div class="custom-scrollable-table">
          <table class="item-table">
            <thead>
              <tr>
                <th>{l.assetName}</th>
                <th>分类</th>
                <th class="text-right">{l.amount}</th>
                <th class="text-center">操作</th>
              </tr>
            </thead>
            <tbody>
              {#each simulatedPortfolio.assetsSim as item}
                <tr class="item-row">
                  <td class="item-label-cell">{getItemLabel(item)}</td>
                  <td>
                    <span class="type-pill pill-{item.type}">
                      {item.type === 'liquid' ? l.liquidAssets : item.type === 'nonliquid' ? l.nonLiquidAssets : l.investmentAssets}
                    </span>
                  </td>
                  <td class="text-right font-mono text-gold-light">
                    {#if item.type === 'investment' && stockVolatility !== 0}
                      <span class="original-strike text-xs block text-gray-500 opacity-60">
                        {item.currency} {item.amount.toLocaleString()}
                      </span>
                    {:else if item.type === 'nonliquid' && propertyVolatility !== 0}
                      <span class="original-strike text-xs block text-gray-500 opacity-60">
                        {item.currency} {item.amount.toLocaleString()}
                      </span>
                    {/if}
                    {item.currency} {Math.round(item.simVal).toLocaleString()}
                  </td>
                  <td class="text-center">
                    <button class="delete-btn" onclick={() => deleteAsset(item.id)}>
                      {l.delete}
                    </button>
                  </td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>

        <form class="add-item-form" onsubmit={addAssetItem}>
          <div class="form-row">
            <select bind:value={newAssetType} class="form-select">
              <option value="liquid">{l.liquidAssets}</option>
              <option value="nonliquid">{l.nonLiquidAssets}</option>
              <option value="investment">{l.investmentAssets}</option>
            </select>
            <input
              type="text"
              placeholder={l.assetName}
              bind:value={newAssetName}
              class="form-input"
            />
          </div>
          <div class="form-row mt-2">
            <input
              type="number"
              placeholder={l.amount}
              bind:value={newAssetAmount}
              class="form-input font-mono"
              required
            />
            <select bind:value={newAssetCurrency} class="form-select w-24">
              <option value="CNY">CNY</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
            </select>
            <button type="submit" class="submit-add-btn">＋</button>
          </div>
        </form>
      </div>

      <!-- 负债项目 -->
      <div class="calc-card item-list-card">
        <h3 class="card-title text-gold">📉 {l.liabilityList}</h3>
        
        <div class="custom-scrollable-table">
          <table class="item-table">
            <thead>
              <tr>
                <th>{l.liabilityName}</th>
                <th class="text-right">{l.amount}</th>
                <th class="text-center">操作</th>
              </tr>
            </thead>
            <tbody>
              {#each simulatedPortfolio.liabilitiesSim as item}
                <tr class="item-row">
                  <td class="item-label-cell">{getItemLabel(item)}</td>
                  <td class="text-right font-mono text-gray-300">
                    {item.currency} {item.amount.toLocaleString()}
                  </td>
                  <td class="text-center">
                    <button class="delete-btn" onclick={() => deleteLiability(item.id)}>
                      {l.delete}
                    </button>
                  </td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>

        <form class="add-item-form" onsubmit={addLiabilityItem}>
          <div class="form-row">
            <input
              type="text"
              placeholder={l.liabilityName}
              bind:value={newLiabilityName}
              class="form-input"
            />
            <input
              type="number"
              placeholder={l.amount}
              bind:value={newLiabilityAmount}
              class="form-input font-mono"
              required
            />
            <select bind:value={newLiabilityCurrency} class="form-select w-24">
              <option value="CNY">CNY</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
            </select>
            <button type="submit" class="submit-add-btn">＋</button>
          </div>
        </form>
      </div>
    </section>

    <!-- 右栏: 资产大屏、ECharts 占比图与诊断评估 -->
    <section class="right-panel grid-column">
      <!-- 瑞士私银级总值呈现大屏 -->
      <div class="calc-card premium-worth-display border-gold-fine">
        <div class="worth-header text-center">
          <span class="worth-label text-gray-500 uppercase tracking-widest text-xs block mb-1">{l.netWorth} ({baseCurrency})</span>
          <h2 class="net-worth-number font-mono text-gold flex items-center justify-center gap-1">
            <span class="currency-symbol text-2xl">{currencySymbols[baseCurrency]}</span>
            <span class="animated-digits text-4xl font-extrabold">{Math.round($animNetWorth).toLocaleString()}</span>
          </h2>
          {#if stockVolatility !== 0 || propertyVolatility !== 0}
            <div class="orig-worth-sub text-xs text-gray-500 opacity-60 mt-1">
              {l.originalWorth}: {currencySymbols[baseCurrency]} {Math.round(simulatedPortfolio.originalWorth).toLocaleString()}
            </div>
          {/if}
        </div>

        <div class="worth-breakdown mt-6 border-t border-gray-900 pt-6">
          <div class="breakdown-row">
            <span class="label text-gray-400">{l.totalAssets}</span>
            <span class="value font-mono text-gold-light">
              {currencySymbols[baseCurrency]} {Math.round($animTotalAssets).toLocaleString()}
            </span>
          </div>
          <div class="breakdown-row mt-2">
            <span class="label text-gray-400">{l.totalLiabilities}</span>
            <span class="value font-mono text-gray-400">
              {currencySymbols[baseCurrency]} {Math.round($animTotalLiabilities).toLocaleString()}
            </span>
          </div>
        </div>

        <!-- 关键精算指标 -->
        <div class="actuarial-indicators mt-6 grid grid-cols-2 gap-4">
          <div class="actuarial-item text-center">
            <span class="label text-xs text-gray-500 block mb-1">{l.debtRatio}</span>
            <span class="value font-mono text-base font-bold text-gold">
              {simulatedPortfolio.debtRatio.toFixed(1)}%
            </span>
          </div>
          <div class="actuarial-item text-center">
            <span class="label text-xs text-gray-500 block mb-1">{l.liquidityRatio}</span>
            <span class="value font-mono text-base font-bold text-gray-300">
              {simulatedPortfolio.liquidityRatio > 900 ? '∞' : simulatedPortfolio.liquidityRatio.toFixed(0) + '%'}
            </span>
          </div>
        </div>
      </div>

      <!-- ECharts 哑光环占比图 -->
      <div class="calc-card echarts-card">
        <EChartsWrapper bind:this={chartRef} options={chartOption} />
      </div>

      <!-- 精算意见报告 -->
      <div class="calc-card health-report-card">
        <h3 class="card-title text-gold flex items-center gap-2">
          <span>📜</span> {l.healthReport}
        </h3>
        <div class="health-diagnosis-panel">
          <div class="diagnosis-header flex items-center justify-between mb-4">
            <span class="label text-gray-400">{l.financialSafety}</span>
            <span class="status-capsule {simulatedPortfolio.statusClass}">
              {simulatedPortfolio.statusLabel}
            </span>
          </div>
          <p class="advice-content text-sm text-gray-300 leading-relaxed">
            {simulatedPortfolio.advice}
          </p>
        </div>
      </div>
    </section>
  </div>
</div>

<style>
  /* Global CSS Tokens - Obsidian Minimalist Swiss Gold Theme */
  .obsidian-theme {
    --bg-dark: #0a0a0a;
    --card-bg: #121212;
    --gold-bronze: #8a6623;
    --gold-champagne: #c5a059;
    --gold-bright: #e5c47f;
    --border-color: #222222;
    --input-bg: #181818;
    --text-muted: #b5b5b5;
    
    background-color: var(--bg-dark);
    color: #eaeaea;
    font-family: 'Outfit', 'Inter', -apple-system, sans-serif;
    padding: 1.5rem;
    border-radius: 12px;
    border: 1px solid var(--border-color);
  }

  /* Shimmer /流光 Effects strictly avoided for cold Swiss private banking theme */
  .border-gold-fine {
    border: 1px solid var(--gold-bronze);
  }

  .text-gold {
    color: var(--gold-champagne);
  }
  .text-gold-light {
    color: var(--gold-bright);
  }

  .calc-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid var(--border-color);
    padding-bottom: 1.25rem;
    margin-bottom: 2rem;
  }

  .metallic-gold-text {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--gold-bright);
  }

  .subtitle {
    font-size: 0.85rem;
    color: var(--text-muted);
    margin-top: 0.25rem;
  }

  /* Currency Toggle Pill */
  .currency-toggle-capsule {
    display: flex;
    align-items: center;
    gap: 10px;
    background: var(--input-bg);
    border: 1px solid var(--border-color);
    border-radius: 20px;
    padding: 2px 6px 2px 12px;
  }

  .currency-label {
    font-size: 0.75rem;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .toggle-buttons {
    display: flex;
    gap: 4px;
  }

  .currency-btn {
    background: transparent;
    border: none;
    color: #888888;
    font-family: monospace;
    font-size: 0.8rem;
    font-weight: bold;
    padding: 6px 12px;
    border-radius: 16px;
    cursor: pointer;
    transition: all 0.25s ease;
  }

  .currency-btn.active {
    background: var(--gold-champagne);
    color: #121212;
  }

  /* Grids & Cards */
  .calc-grid {
    display: grid;
    grid-template-columns: 1.1fr 0.9fr;
    gap: 1.75rem;
  }

  .calc-card {
    background: var(--card-bg);
    border: 1px solid var(--border-color);
    border-radius: 8px;
    padding: 1.5rem;
    margin-bottom: 1.5rem;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
  }

  .card-title {
    font-size: 1rem;
    font-weight: bold;
    margin-bottom: 1.25rem;
    border-bottom: 1px solid #1a1a1a;
    padding-bottom: 0.5rem;
  }

  /* Stress Test Card */
  .slider-group {
    margin-bottom: 1.25rem;
  }

  .slider-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.85rem;
    color: #999;
    margin-bottom: 0.5rem;
  }

  .gold-badge {
    background: rgba(197, 160, 89, 0.15);
    color: var(--gold-bright);
    font-weight: bold;
    font-family: monospace;
    font-size: 0.8rem;
    padding: 2px 8px;
    border-radius: 4px;
    border: 1px solid rgba(197, 160, 89, 0.3);
  }

  .gold-range-slider {
    -webkit-appearance: none;
    appearance: none;
    width: 100%;
    height: 4px;
    background: #2a2a2a;
    border-radius: 2px;
    outline: none;
  }

  .gold-range-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: var(--gold-champagne);
    cursor: pointer;
    transition: transform 0.15s ease;
  }

  .gold-range-slider::-webkit-slider-thumb:hover {
    transform: scale(1.2);
  }

  .slider-markers {
    display: flex;
    justify-content: space-between;
    font-size: 0.7rem;
    color: #555;
    margin-top: 0.25rem;
    font-family: monospace;
  }

  /* Scrollable Item Tables */
  .custom-scrollable-table {
    max-height: 240px;
    overflow-y: auto;
    border: 1px solid #1a1a1a;
    border-radius: 4px;
    margin-bottom: 1rem;
  }

  .custom-scrollable-table::-webkit-scrollbar {
    width: 6px;
  }
  .custom-scrollable-table::-webkit-scrollbar-track {
    background: #121212;
  }
  .custom-scrollable-table::-webkit-scrollbar-thumb {
    background: #2a2a2a;
    border-radius: 3px;
  }
  .custom-scrollable-table::-webkit-scrollbar-thumb:hover {
    background: var(--gold-bronze);
  }

  .item-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.85rem;
  }

  .item-table th {
    background: #181818;
    color: #888;
    text-transform: uppercase;
    font-size: 0.75rem;
    letter-spacing: 0.05em;
    padding: 8px 12px;
    text-align: left;
    position: sticky;
    top: 0;
    border-bottom: 1px solid #222;
  }

  .item-table td {
    padding: 10px 12px;
    border-bottom: 1px solid #161616;
  }

  .item-row:hover {
    background: #151515;
  }

  .item-label-cell {
    font-weight: 500;
  }

  .original-strike {
    text-decoration: line-through;
  }

  /* Type Pilleen */
  .type-pill {
    font-size: 0.7rem;
    padding: 1px 6px;
    border-radius: 4px;
    font-weight: bold;
    display: inline-block;
  }
  .pill-liquid {
    background: rgba(197, 160, 89, 0.15);
    color: var(--gold-champagne);
  }
  .pill-nonliquid {
    background: rgba(138, 102, 35, 0.15);
    color: #a38144;
  }
  .pill-investment {
    background: rgba(229, 196, 127, 0.1);
    color: var(--gold-bright);
  }

  .delete-btn {
    background: transparent;
    border: none;
    color: #e54c4c;
    cursor: pointer;
    font-size: 0.75rem;
    padding: 2px 6px;
    border-radius: 4px;
    opacity: 0.6;
    transition: opacity 0.2s;
  }
  .delete-btn:hover {
    opacity: 1;
    background: rgba(229, 76, 76, 0.1);
  }

  /* Form UI */
  .add-item-form {
    background: #161616;
    padding: 1rem;
    border-radius: 6px;
    border: 1px solid #222;
  }

  .form-row {
    display: flex;
    gap: 8px;
  }

  .form-select, .form-input {
    background: var(--input-bg);
    border: 1px solid var(--border-color);
    color: #eaeaea;
    border-radius: 4px;
    padding: 8px 12px;
    font-size: 0.8rem;
    outline: none;
    box-sizing: border-box;
  }

  .form-select {
    cursor: pointer;
  }
  .form-input {
    flex-grow: 1;
  }
  .form-input:focus, .form-select:focus {
    border-color: var(--gold-champagne);
  }

  .submit-add-btn {
    background: var(--gold-champagne);
    color: #121212;
    border: none;
    border-radius: 4px;
    padding: 8px 16px;
    font-size: 1rem;
    font-weight: bold;
    cursor: pointer;
    transition: opacity 0.2s;
  }
  .submit-add-btn:hover {
    opacity: 0.9;
  }

  /* Premium Display worth block */
  .premium-worth-display {
    background: radial-gradient(circle at top, #1a1a1a, var(--card-bg));
    border-radius: 8px;
    padding: 2rem;
    box-shadow: inset 0 0 15px rgba(138, 102, 35, 0.15);
  }

  .net-worth-number {
    margin-top: 0.5rem;
  }

  .animated-digits {
    letter-spacing: -0.02em;
  }

  .worth-breakdown {
    font-size: 0.9rem;
  }

  .breakdown-row {
    display: flex;
    justify-content: space-between;
  }

  /* Actuarial indicators */
  .actuarial-item {
    background: #161616;
    border: 1px solid #222;
    border-radius: 6px;
    padding: 0.75rem;
  }

  /* ECharts height wrapper */
  .echarts-card {
    height: 300px;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  /* Actuarial diagnosis advice */
  .health-diagnosis-panel {
    background: #161616;
    border: 1px solid #222;
    padding: 1.25rem;
    border-radius: 6px;
  }

  .status-capsule {
    font-size: 0.75rem;
    font-weight: bold;
    text-transform: uppercase;
    padding: 4px 10px;
    border-radius: 12px;
    border: 1px solid currentColor;
  }

  /* Matte, professional status classes strictly avoiding neon glow */
  .status-secure {
    color: #4ebf7a;
    background: rgba(78, 191, 122, 0.1);
  }
  .status-healthy {
    color: var(--gold-bright);
    background: rgba(229, 196, 127, 0.1);
  }
  .status-leveraged {
    color: #dca03e;
    background: rgba(220, 160, 62, 0.1);
  }
  .status-risky {
    color: #e25858;
    background: rgba(226, 88, 88, 0.1);
  }

  /* Responsive Grid collapses to vertical single column strictly placing chart at the top */
  @media (max-width: 768px) {
    .calc-grid {
      grid-template-columns: 1fr;
      gap: 1.5rem;
    }

    .right-panel {
      grid-row: 1; /* Places the chart and premium display at the absolute top */
    }

    .left-panel {
      grid-row: 2;
    }

    .currency-toggle-capsule {
      margin-top: 1rem;
    }

    .calc-header {
      flex-direction: column;
      align-items: flex-start;
    }
  }
</style>
