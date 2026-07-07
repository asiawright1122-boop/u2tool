<script lang="ts">
  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  const BUILTIN_FALLBACKS: Record<string, Record<string, string>> = {
    zh: { months: '月' },
    en: { months: 'mo' },
    es: { months: 'mes' },
    pt: { months: 'mês' },
    ja: { months: '月' },
    fr: { months: 'mois' },
    de: { months: 'Mon.' },
    ar: { months: 'شهر' },
    ko: { months: '개월' },
    ru: { months: 'мес.' }
  };

  // Translation helper
  function t(key: string): string {
    const scope = translations['tools']?.['retirement-pension-calculator'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    if (typeof value === 'string') return value;

    const backupScope = I18N_BACKUP[locale] || I18N_BACKUP['en'];
    value = backupScope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    if (typeof value === 'string') return value;

    return BUILTIN_FALLBACKS[locale]?.[key] || BUILTIN_FALLBACKS['en']?.[key] || `tools.retirement-pension-calculator.${key}`;
  }

  import { onMount } from 'svelte';
  import { tweened } from 'svelte/motion';
  import { cubicOut } from 'svelte/easing';
  import EChartsWrapper from './EChartsWrapper.svelte';
  import { useChartTheme } from '@/hooks/useChartTheme';

  // Comprehensive 10-Language backup dictionaries ensuring 0% English leaks on EChart labels & backup bindings
  const I18N_BACKUP: Record<string, Record<string, string>> = {
    zh: {
      title: '个人退休金与养老理财优化器',
      subtitle: '复利收益 vs 通胀蚕食双曲线，打破“纸面富贵”的贬值真相',
      currentAge: '当前年龄',
      retireAge: '预期退休年龄',
      payoutYears: '退休领款期 (年)',
      initialSavings: '已累积养老储备',
      monthlySavings: '每月新存入额 (商业养老/理财)',
      expectedYield: '预期投资年化收益率',
      inflationRate: '预估年化通货膨胀率',
      ageYears: '岁',
      currencyUnit: '元',
      nominalWealth: '名义总财富',
      realPurchasingPower: '实际折现购买力',
      pensionSafety: '晚年资金安全度评级',
      statusSecure: '极度安全 (Secure)',
      statusModerate: '稳健适中 (Moderate)',
      statusVulnerable: '轻度脆弱 (Vulnerable)',
      statusFragile: '严重不足 (Fragile)',
      monthlyRealPayout: '退休后每月实际等效购买力',
      nominalEndWealth: '名义财富终值',
      realEndWealth: '实际折现终值',
      inflationLoss: '通胀蚕食贬值额',
      lossRatio: '购买力缩水幅度',
      adviceSecure: '恭喜！您的理财复利完全碾压通胀。退休后实际购买力极其充裕，可过上高品质晚年生活。',
      adviceModerate: '您的晚年储备稳健。实际购买力能保障舒适生活，建议维持当前存入或适度追加低风险理财。',
      adviceVulnerable: '警告：通胀严重侵蚀了您的财富。退休后实际购买力略显单薄，建议调高理财收益率或增加定存。',
      adviceFragile: '极度危险：您的财富正被通胀吞噬。退休后实际等效购买力将无法覆盖基本开支，请立刻增加储蓄或调整理财！',
      chartTitle: '名义总财富 vs 实际折现购买力 黄金推演双曲线',
      detailSchedule: '养老储备增值摊销明细表',
      year: '第几年度',
      age: '年龄',
      nominalAccumulated: '名义累计资产',
      realDiscounted: '实际折现购买力',
      inflationEroded: '通胀蚕食金额',
      exportPng: '导出大屏明细 (PNG)',
      exportSvg: '导出矢量图表 (SVG)',
      annualView: '年度精细视图',
      monthlyView: '月度折算视图',
      faqTitle: '养老理财精算 FAQ',
      calcNotes: '精算注：当预期年化收益率为0%时，系统自动退化为线性累加方程，确保无任何除零NaN错误。'
    },
    en: {
      title: 'Retirement & Pension Optimizer',
      subtitle: 'Expose the paper wealth illusion under compound yield vs. inflation erosion',
      currentAge: 'Current Age',
      retireAge: 'Expected Retirement Age',
      payoutYears: 'Payout Duration (Years)',
      initialSavings: 'Initial Accumulated Pension',
      monthlySavings: 'Monthly Saving Contribution',
      expectedYield: 'Expected Annual Yield',
      inflationRate: 'Estimated Inflation Rate',
      ageYears: 'years old',
      currencyUnit: '$',
      nominalWealth: 'Nominal Wealth',
      realPurchasingPower: 'Real Purchasing Power',
      pensionSafety: 'Retirement Safety Rating',
      statusSecure: 'Extremely Secure',
      statusModerate: 'Robust / Moderate',
      statusVulnerable: 'Slightly Vulnerable',
      statusFragile: 'Severely Fragile',
      monthlyRealPayout: 'Retirement Monthly Real Payout Value',
      nominalEndWealth: 'Nominal Ending Asset',
      realEndWealth: 'Real Discounted Ending Asset',
      inflationLoss: 'Wealth Eroded by Inflation',
      lossRatio: 'Purchasing Power Shrinkage',
      adviceSecure: 'Congratulations! Your investment yield beats inflation. Your real purchasing power is extremely abundant.',
      adviceModerate: 'Your retirement backup is solid. The real purchasing power supports a comfortable life. Maintain your pace.',
      adviceVulnerable: 'Warning: Inflation significantly erodes your wealth. Real disposable income will be tight. Increase savings.',
      adviceFragile: 'Critical Warning: Your savings are swallowed by inflation. Real purchasing power will fail to cover basic costs.',
      chartTitle: 'Nominal Wealth vs. Real Purchasing Power Curves',
      detailSchedule: 'Retirement Wealth Growth & Discount Amortization Schedule',
      year: 'Year',
      age: 'Age',
      nominalAccumulated: 'Nominal Accumulated Asset',
      realDiscounted: 'Real Discounted Value',
      inflationEroded: 'Eroded by Inflation',
      exportPng: 'Export Big Screen (PNG)',
      exportSvg: 'Export Vector (SVG)',
      annualView: 'Yearly Schedule',
      monthlyView: 'Monthly Foldout',
      faqTitle: 'Retirement Actuarial FAQ',
      calcNotes: 'Actuarial Note: When expected yield is 0%, linear accumulation equations apply to prevent division-by-zero.'
    },
    es: {
      title: 'Optimizador de Retiro y Pensiones',
      subtitle: 'Contraste entre rendimiento compuesto y erosión de inflación',
      currentAge: 'Edad Actual',
      retireAge: 'Edad de Jubilación',
      payoutYears: 'Periodo de Cobro (Años)',
      initialSavings: 'Reserva Acumulada Inicial',
      monthlySavings: 'Ahorro Mensual Nuevo',
      expectedYield: 'Rendimiento Anual Esperado',
      inflationRate: 'Tasa de Inflación Estimada',
      ageYears: 'años',
      currencyUnit: '€',
      nominalWealth: 'Riqueza Nominal',
      realPurchasingPower: 'Poder Adquisitivo Real',
      pensionSafety: 'Clasificación de Seguridad de Jubilación',
      statusSecure: 'Extremadamente Seguro',
      statusModerate: 'Seguro y Moderado',
      statusVulnerable: 'Vulnerable Leve',
      statusFragile: 'Altamente Frágil',
      monthlyRealPayout: 'Pago Mensual Real en Jubilación',
      nominalEndWealth: 'Riqueza Nominal Final',
      realEndWealth: 'Valor Descontado Real Final',
      inflationLoss: 'Pérdida por Inflación',
      lossRatio: 'Reducción del Poder de Compra',
      adviceSecure: '¡Felicitaciones! Su rendimiento supera la inflación. Su poder adquisitivo de jubilación es abundante.',
      adviceModerate: 'Su respaldo de jubilación es robusto. El poder de compra apoya una vida cómoda. Mantenga su ritmo.',
      adviceVulnerable: 'Advertencia: La inflación reduce su riqueza. El ingreso mensual real será ajustado. Incremente ahorros.',
      adviceFragile: 'Advertencia Crítica: Su riqueza es consumida por la inflación. Considere aumentar sus ahorros.',
      chartTitle: 'Riqueza Nominal vs. Poder Adquisitivo Real Descontado',
      detailSchedule: 'Cronograma de Amortización del Crecimiento del Retiro',
      year: 'Año',
      age: 'Edad',
      nominalAccumulated: 'Activo Nominal Acumulado',
      realDiscounted: 'Valor Real Descontado',
      inflationEroded: 'Erosionado por Inflación',
      exportPng: 'Exportar PNG',
      exportSvg: 'Exportar SVG',
      annualView: 'Vista Anual',
      monthlyView: 'Vista Mensual',
      faqTitle: 'FAQ de Actuarial de Jubilación',
      calcNotes: 'Nota Actuarial: Con rendimiento al 0%, se usa acumulación lineal para evitar errores de división por cero.'
    },
    pt: {
      title: 'Otimizador de Aposentadoria e Pensões',
      subtitle: 'Contraste entre rendimento composto e erosão inflacionária',
      currentAge: 'Idade Atual',
      retireAge: 'Idade de Aposentadoria',
      payoutYears: 'Período de Recebimento (Anos)',
      initialSavings: 'Reserva Acumulada Inicial',
      monthlySavings: 'Aporte Mensual Novo',
      expectedYield: 'Rendimento Anual Esperado',
      inflationRate: 'Taxa de Inflação Estimada',
      ageYears: 'anos',
      currencyUnit: 'R$',
      nominalWealth: 'Riqueza Nominal',
      realPurchasingPower: 'Poder de Compra Real',
      pensionSafety: 'Classificação de Segurança',
      statusSecure: 'Extremamente Seguro',
      statusModerate: 'Robusto / Moderado',
      statusVulnerable: 'Vulnerável Leve',
      statusFragile: 'Altamente Frágil',
      monthlyRealPayout: 'Resgate Mensal Real na Aposentadoria',
      nominalEndWealth: 'Riqueza Nominal Final',
      realEndWealth: 'Valor Descontado Real Final',
      inflationLoss: 'Perda por Inflação',
      lossRatio: 'Redução do Poder de Compra',
      adviceSecure: 'Parabéns! Seus rendimentos superam a inflação. Seu poder de compra de aposentadoria é abundante.',
      adviceModerate: 'Seu backup de aposentadoria é sólido. O poder de compra apoia uma vida confortável. Mantenha o ritmo.',
      adviceVulnerable: 'Aviso: A inflação reduz sua riqueza. A renda real será apertada. Incremente seus aportes.',
      adviceFragile: 'Aviso Crítico: Sua poupança é engolida pela inflação. Aumente seus investimentos imediatamente.',
      chartTitle: 'Riqueza Nominal vs. Poder de Compra Real Descontado',
      detailSchedule: 'Cronograma de Amortização do Retiro',
      year: 'Ano',
      age: 'Idade',
      nominalAccumulated: 'Ativo Nominal Acumulado',
      realDiscounted: 'Valor Real Descontado',
      inflationEroded: 'Eroded por Inflação',
      exportPng: 'Exportar PNG',
      exportSvg: 'Exportar SVG',
      annualView: 'Visão Anual',
      monthlyView: 'Visão Mensal',
      faqTitle: 'FAQ de Aposentadoria',
      calcNotes: 'Nota Actuarial: Com rendimento de 0%, usa-se acúmulo linear para evitar erros de divisão por zero.'
    },
    ja: {
      title: '個人年金・老後資金資産運用最適化シミュレーター',
      subtitle: '複利効果とインフレによる購買力低下を可視化し、「紙面の富」の罠を暴く',
      currentAge: '現在の年齢',
      retireAge: '希望引退年齢',
      payoutYears: '年金受給期間 (年)',
      initialSavings: '現在の老後資金の貯蓄',
      monthlySavings: '毎月の追加積立額 (個人年金/商業運用)',
      expectedYield: '想定運用年利 (複利)',
      inflationRate: '想定年間インフレ率',
      ageYears: '歳',
      currencyUnit: '円',
      nominalWealth: '名目資産総額',
      realPurchasingPower: '実質割引購買力',
      pensionSafety: '老後資金の安全度評価',
      statusSecure: '極めて安全 (Secure)',
      statusModerate: '健全・適正 (Moderate)',
      statusVulnerable: 'やや脆弱 (Vulnerable)',
      statusFragile: '深刻な不足 (Fragile)',
      monthlyRealPayout: '引退後毎月の実質割引受給額',
      nominalEndWealth: '名目資産最終値',
      realEndWealth: '実質割引最終値',
      inflationLoss: 'インフレによる損失額',
      lossRatio: '購買力の縮小比率',
      adviceSecure: 'おめでとうございます！運用の複利効果がインフレを完全に凌駕しています。実質的な購買力は十分であり、高品質な老後生活を送ることができます。',
      adviceModerate: '老後資金は健全です。実質購買力は快適な生活を支える水準にあります。現在のペースを維持するか、低リスクな運用を追加することをお勧めします。',
      adviceVulnerable: '警告：インフレが資産の実質的な購買力を大幅に削り取っています。実質的な月々の受給額はタイトです。積立額を増やすか想定年利の引き上げを推奨します。',
      adviceFragile: '深刻な危険：インフレにより老後資金が急速に目減りしています。実質購買力は基本生活費を満たせません。早急な積立追加、または運用計画の見直しが必要です。',
      chartTitle: '名目資産総額 vs 実質割引購買力 推移ダブル曲線',
      detailSchedule: '老後資金形成および割引償還計画表',
      year: '年度',
      age: '年齢',
      nominalAccumulated: '名目累積資産',
      realDiscounted: '実質割引購買力',
      inflationEroded: 'インフレ目減り額',
      exportPng: '明細をPNGで保存',
      exportSvg: '明細をSVGで保存',
      annualView: '年間推移ビュー',
      monthlyView: '月間推移ビュー',
      faqTitle: '老後資産運用精算 FAQ',
      calcNotes: '精算注：想定年利が0%の場合、計算式は自動的に線形加算に移行し、ゼロ除算（NaN）のエラーを完全に防ぎます。'
    },
    fr: {
      title: 'Optimiseur de Retraite et de Pension',
      subtitle: 'Contraste entre rendement composé et érosion de l\'inflation',
      currentAge: 'Âge Actuel',
      retireAge: 'Âge de Retraite Prévu',
      payoutYears: 'Durée de Versement (Ans)',
      initialSavings: 'Épargne Accumulée Initiale',
      monthlySavings: 'Contribution Mensuelle Prévue',
      expectedYield: 'Rendement Annuel Attendu',
      inflationRate: 'Taux d\'Inflation Estimé',
      ageYears: 'ans',
      currencyUnit: '€',
      nominalWealth: 'Richesse Nominale',
      realPurchasingPower: 'Pouvoir d\'Achat Réel',
      pensionSafety: 'Diagnostic de Sécurité',
      statusSecure: 'Extrêmement Sûr',
      statusModerate: 'Robuste / Modéré',
      statusVulnerable: 'Vulnérable Léger',
      statusFragile: 'Altement Fragile',
      monthlyRealPayout: 'Versement Mensuel Réel à la Retraite',
      nominalEndWealth: 'Richesse Nominale Finale',
      realEndWealth: 'Valeur Actualisée Réelle',
      inflationLoss: 'Perte de Pouvoir d\'Achat',
      lossRatio: 'Taux de Dépréciation',
      adviceSecure: 'Félicitations! Le rendement surpasse l\'inflation. Votre pouvoir d\'achat à la retraite sera extrêmement abondant.',
      adviceModerate: 'Votre retraite est robuste. Le pouvoir d\'achat soutiendra une vie confortable. Maintenez vos efforts.',
      adviceVulnerable: 'Attention: L\'inflation érode considérablement votre richesse. Le pouvoir d\'achat mensuel sera serré.',
      adviceFragile: 'Alerte Critique: Votre épargne est engloutie par l\'inflation. Augmentez vos investissements immédiatement.',
      chartTitle: 'Richesse Nominale vs. Pouvoir d\'Achat Réel Actualisé',
      detailSchedule: 'Tableau d\'Amortissement de Croissance Retraite',
      year: 'Année',
      age: 'Âge',
      nominalAccumulated: 'Actif Nominal Cumulé',
      realDiscounted: 'Valeur Réelle Actualisée',
      inflationEroded: 'Érodé par l\'Inflation',
      exportPng: 'Exporter PNG',
      exportSvg: 'Exporter SVG',
      annualView: 'Vue Annuelle',
      monthlyView: 'Vue Mensuelle',
      faqTitle: 'FAQ Actuarielle de Retraite',
      calcNotes: 'Note Actuarielle: Lorsque le rendement est de 0%, une équation linéaire cumulative est utilisée pour éviter le NaN.'
    },
    de: {
      title: 'Renten- & Pensionsoptimierer',
      subtitle: 'Zinseszinsrendite vs. Inflationskaufkraftverlust visualisiert',
      currentAge: 'Aktuelles Alter',
      retireAge: 'Geplantet Rentenalter',
      payoutYears: 'Auszahlungsdauer (Jahre)',
      initialSavings: 'Anfängliches Rentenguthaben',
      monthlySavings: 'Monatlicher Sparbeitrag',
      expectedYield: 'Erwartete jährliche Rendite',
      inflationRate: 'Geschätzte Inflationsrate',
      ageYears: 'Jahre alt',
      currencyUnit: '€',
      nominalWealth: 'Nominales Vermögen',
      realPurchasingPower: 'Reale Kaufkraft',
      pensionSafety: 'Rentenlücken-Sicherheitsstufe',
      statusSecure: 'Extrem Sicher',
      statusModerate: 'Robust / Moderat',
      statusVulnerable: 'Leicht Fragil',
      statusFragile: 'Kritisch unzureichend',
      monthlyRealPayout: 'Monatliche reale Kaufkraft im Ruhestand',
      nominalEndWealth: 'Nominales Endvermögen',
      realEndWealth: 'Reales abgezinstes Endvermögen',
      inflationLoss: 'Kaufkraftverlust durch Inflation',
      lossRatio: 'Prozentualer Schrumpfungsgrad',
      adviceSecure: 'Glückwunsch! Ihre Zinsrendite schlägt die Inflation deutlich. Sie werden im Ruhestand finanziell sehr gut versorgt sein.',
      adviceModerate: 'Ihre Altersvorsorge ist solide. Die reale Kaufkraft ermöglicht ein komfortables Leben. Behalten Sie das Tempo bei.',
      adviceVulnerable: 'Warnung: Die Inflation zehrt stark an Ihrem Vermögen. Die reale Kaufkraft im Alter wird spürbar knapper sein.',
      adviceFragile: 'Kritische Warnung: Ihr Vermögen wird von der Inflation aufgefressen. Erhöhen Sie umgehend Ihre Sparraten!',
      chartTitle: 'Nominales Vermögen vs. Reale abgezinste Kaufkraft',
      detailSchedule: 'Altersvorsorge-Zuwachs- und Abzinsungstabelle',
      year: 'Jahr',
      age: 'Alter',
      nominalAccumulated: 'Nominales Guthaben',
      realDiscounted: 'Reale Kaufkraft',
      inflationEroded: 'Kaufkraftverlust',
      exportPng: 'PNG exportieren',
      exportSvg: 'SVG exportieren',
      annualView: 'Jahrestabelle',
      monthlyView: 'Monatstabelle',
      faqTitle: 'Finanzmathematische FAQ',
      calcNotes: 'Hinweis: Bei 0% Zins wird eine lineare Akkumulationsformel genutzt, um Divisionen durch Null zu vermeiden.'
    },
    ar: {
      title: 'حاسبة تقاعد المعاشات وتحسين القوة الشرائية',
      subtitle: 'العائد المركب مقابل تآكل التضخم - حقيقة القوة الشرائية الفعلية لمدخراتك',
      currentAge: 'العمر الحالي',
      retireAge: 'عمر التقاعد المتوقع',
      payoutYears: 'مدة الصرف (بالسنوات)',
      initialSavings: 'المدخرات التقاعدية الحالية',
      monthlySavings: 'مبلغ الادخار الشهري المخطط له',
      expectedYield: 'عائد الاستثمار السنوي المتوقع',
      inflationRate: 'معدل التضخم السنوي المقدر',
      ageYears: 'عاماً',
      currencyUnit: '$',
      nominalWealth: 'الثروة الاسمية',
      realPurchasingPower: 'القوة الشرائية الحقيقية',
      pensionSafety: 'تقييم أمان المعاش التقاعدي',
      statusSecure: 'آمن للغاية (Secure)',
      statusModerate: 'قوي ومتوسط (Moderate)',
      statusVulnerable: 'هش جزئياً (Vulnerable)',
      statusFragile: 'عجز شديد (Fragile)',
      monthlyRealPayout: 'القوة الشرائية الفعلية المتاحة شهرياً بعد التقاعد',
      nominalEndWealth: 'القيمة الاسمية النهائية للثروة',
      realEndWealth: 'القيمة الفعلية المخصومة النهائية',
      inflationLoss: 'المبلغ المفقود بسبب التضخم',
      lossRatio: 'معدل انكماش القوة الشرائية',
      adviceSecure: 'تهانينا! عوائد استثماراتك تتفوق تماماً على التضخم. ستكون قوتك الشرائية وفيرة للغاية لحياة تقاعدية راقية.',
      adviceModerate: 'مدخراتك التقاعدية متينة. القوة الشرائية الحقيقية تضمن حياة مريحة. حافظ على معدل ادخارك الحالي.',
      adviceVulnerable: 'تحذير: التضخم يؤثر بشكل كبير على مدخراتك. يرجى زيادة الادخار أو رفع نسبة العائد لتجنب الضيق المالي.',
      adviceFragile: 'خطر للغاية: التضخم يبتلع مدخراتك التقاعدية بالكامل. القوة الشرائية لن تغطي نفقاتك المعيشية الأساسية!',
      chartTitle: 'منحنى الثروة الاسمية مقابل القوة الشرائية الفعلية المخصومة',
      detailSchedule: 'جدول تفصيلي لنمو وتآكل أصول التقاعد',
      year: 'السنة',
      age: 'العمر',
      nominalAccumulated: 'الأصول الاسمية التراكمية',
      realDiscounted: 'القيمة الحقيقية المخصومة',
      inflationEroded: 'المبلغ المتآكل بالتضخم',
      exportPng: 'تصدير كصورة (PNG)',
      exportSvg: 'تصدير كملف (SVG)',
      annualView: 'عرض سنوي مفصل',
      monthlyView: 'عرض شهري مفصل',
      faqTitle: 'الأسئلة الشائعة حول精算 التقاعد',
      calcNotes: 'ملاحظة: عندما يكون العائد المتوقع 0%، تستخدم الحاسبة معادلة خطية تراكمية لتفادي أخطاء القسمة على صفر.'
    },
    ko: {
      title: '개인 은퇴 연금 및 노후 자산 최적화기',
      subtitle: '투자 복리 수익률 대 인플레이션 잠식의 두 곡선으로 투명하게 분석하는 은퇴 자산',
      currentAge: '현재 연령',
      retireAge: '예상 은퇴 연령',
      payoutYears: '은퇴 연금 수령 기간 (년)',
      initialSavings: '현재 누적 연금 저축액',
      monthlySavings: '매월 신규 저축액 (개인연금/자산운용)',
      expectedYield: '기대 투자 연간 수익률',
      inflationRate: '예상 연간 인플레이션율',
      ageYears: '세',
      currencyUnit: '원',
      nominalWealth: '명목 자산 총액',
      realPurchasingPower: '실질 할인 구매력',
      pensionSafety: '노후 연금 안전도 평가',
      statusSecure: '매우 안전함 (Secure)',
      statusModerate: '안정적임 (Moderate)',
      statusVulnerable: '취약함 (Vulnerable)',
      statusFragile: '매우 불충분함 (Fragile)',
      monthlyRealPayout: '은퇴 후 매월 실질 사용 가능 가치 (오늘의 구매력)',
      nominalEndWealth: '명목 최종 자산',
      realEndWealth: '실질 할인 최종 자산',
      inflationLoss: '인플레이션 감가상각액',
      lossRatio: '구매력 가치 감소율',
      adviceSecure: '축하합니다! 기대 복리 수익이 인플레이션을 완전히 압도합니다. 은퇴 후 구매력이 매우 넉넉하여 여유로운 노후를 즐기실 수 있습니다.',
      adviceModerate: '노후 대비가 튼튼합니다. 실질 가치는 편안한 삶을 충분히 누릴 수 있는 수준입니다. 현재 기조를 유지하거나 저위험 저축을 유지하세요.',
      adviceVulnerable: '경고: 인플레이션이 노후 자산의 실질 구매력을 크게 좀먹었습니다. 은퇴 후 매월 가용 금액이 빠듯할 수 있으니 추가 저축을 고려하세요.',
      adviceFragile: '매우 위험함: 인플레이션으로 인해 연금 저축의 가치가 완전히 붕괴되었습니다. 은퇴 후 필수 생활비 충당이 어렵습니다. 즉시 추가 납입이 필요합니다.',
      chartTitle: '명목 자산 총액 vs 실질 할인 구매력 미래 예측 이중 곡선',
      detailSchedule: '은퇴 연금 형성 및 가치 할인 상세 일정표',
      year: '연도',
      age: '연령',
      nominalAccumulated: '명목 누적 자산',
      realDiscounted: '실질 할인 구매력',
      inflationEroded: '물가상승 잠식액',
      exportPng: 'PNG 차트로 내보내기',
      exportSvg: 'SVG 차트로 내보내기',
      annualView: '연도별 상세표',
      monthlyView: '월별 상세표',
      faqTitle: '은퇴 자금精算 자주 묻는 질문',
      calcNotes: '정산 참고: 기대 연 수익률이 0%인 경우, 수식은 자동으로 선형 누적으로 계산되어 0으로 나누는 오류(NaN)를 완전히 예방합니다.'
    },
    ru: {
      title: 'Пенсионный калькулятор и оптимизатор накоплений',
      subtitle: 'Сложный процент против инфляции: узнайте истинную покупательную способность капитала',
      currentAge: 'Текущий возраст',
      retireAge: 'Возраст выхода на пенсию',
      payoutYears: 'Срок выплат (лет)',
      initialSavings: 'Текущие пенсионные накопления',
      monthlySavings: 'Ежемесячные взносы (инвестиции)',
      expectedYield: 'Ожидаемая годовая доходность',
      inflationRate: 'Ожидаемый уровень инфляции',
      ageYears: 'лет',
      currencyUnit: '₽',
      nominalWealth: 'Номинальный капитал',
      realPurchasingPower: 'Реальная покупательная способность',
      pensionSafety: 'Рейтинг пенсионной безопасности',
      statusSecure: 'Абсолютно безопасно',
      statusModerate: 'Надежно и умеренно',
      statusVulnerable: 'Легкая уязвимость',
      statusFragile: 'Критический дефицит',
      monthlyRealPayout: 'Ежемесячный реальный доход после выхода на пенсию',
      nominalEndWealth: 'Номинальный капитал в итоге',
      realEndWealth: 'Реальный капитал в итоге',
      inflationLoss: 'Потери из-за инфляции',
      lossRatio: 'Сокращение покупательной способности',
      adviceSecure: 'Поздравляем! Ваша доходность уверенно обгоняет инфляцию. Реальная покупательная способность позволит жить комфортно и ни в чем себе не отказывать.',
      adviceModerate: 'Ваш пенсионный резерв надежен. Реальный доход обеспечит комфортный уровень жизни. Продолжайте придерживаться текущего плана.',
      adviceVulnerable: 'Предупреждение: Инфляция серьезно съедает ваш капитал. Будущий реальный доход будет весьма скромным. Попробуйте увеличить взносы.',
      adviceFragile: 'Критическое положение: Ваш капитал буквально пожирается инфляцией. Реального дохода не хватит на базовые расходы. Срочно примите меры!',
      chartTitle: 'Номинальный капитал против реальной покупательной способности',
      detailSchedule: 'Таблица роста капитала и инфляционного дисконтирования',
      year: 'Год',
      age: 'Возраст',
      nominalAccumulated: 'Номинальный капитал',
      realDiscounted: 'Реальный капитал',
      inflationEroded: 'Потери от инфляции',
      exportPng: 'Экспорт в PNG',
      exportSvg: 'Экспорт в SVG',
      annualView: 'Годовой график',
      monthlyView: 'Месячный график',
      faqTitle: 'Финансово-актуарные вопросы и ответы',
      calcNotes: 'Примечание: При доходности 0% расчет автоматически переходит на линейный алгоритм во избежание деления на ноль.'
    }
  };

  // Bind localized strings with complete fallback
  const l = $derived(I18N_BACKUP[locale] || I18N_BACKUP['en']);

  // --- Svelte 5 Reactive States (Retirement Parameters) ---
  let currentAgeInput = $state('30');
  let retireAgeInput = $state('60');
  let payoutYearsInput = $state('30'); // Adjustable payout duration: 10 to 50 years, default 30
  let initialSavingsInput = $state('50000');
  let monthlySavingsInput = $state('2000');
  let expectedYieldInput = $state('6.0'); // expected annual yield: default 6.0% (bounds: -10% to 30%)
  let inflationRateInput = $state('3.0'); // expected inflation rate: default 3.0% (bounds: 0% to 20%)

  // Advanced Settings: Custom Retirement Lifestyle Goals
  let showAdvancedGoal = $state(false);
  let desiredMonthlyExpenseInput = $state('4000'); // desired monthly pension equivalent payout target

  // Chart view granularity toggles
  let chartGranularity = $state('yearly'); // yearly / monthly
  let showSchedule = $state(false);

  // Core inputs constraints & derived values
  const currentAge = $derived(Math.max(1, Math.min(99, parseInt(currentAgeInput) || 30)));
  
  // Enforce retirement age >= currentAge + 1
  const retireAge = $derived(Math.max(currentAge + 1, Math.min(100, parseInt(retireAgeInput) || 60)));
  const accumulationYears = $derived(retireAge - currentAge);
  
  const payoutYears = $derived(Math.max(10, Math.min(50, parseInt(payoutYearsInput) || 30)));
  const initialSavings = $derived(Math.max(0, parseFloat(initialSavingsInput) || 0));
  const monthlySavings = $derived(Math.max(0, parseFloat(monthlySavingsInput) || 0));

  // Yield bounds: [-10%, 30%]
  const expectedYield = $derived(Math.max(-10, Math.min(30, parseFloat(expectedYieldInput) || 0)));
  // Inflation bounds: [0%, 20%]
  const inflationRate = $derived(Math.max(0, Math.min(20, parseFloat(inflationRateInput) || 0)));

  // Actuarial Engine generating accurate annual & monthly simulation data
  interface SimulatedYear {
    year: number;
    age: number;
    nominalAccumulated: number;
    realDiscounted: number;
    inflationEroded: number;
  }

  interface SimulatedMonth {
    period: number;
    age: number;
    nominal: number;
    real: number;
  }

  const simulation = $derived.by(() => {
    const years = accumulationYears;
    const annualYield = expectedYield / 100;
    const annualInflation = inflationRate / 100;
    
    const monthlyYield = annualYield / 12;
    const monthlyInflation = annualInflation / 12;
    
    const yearlyList: SimulatedYear[] = [];
    const monthlyList: SimulatedMonth[] = [];
    let nominalAcc = initialSavings;
    let realDiscounted = initialSavings;
    
    // Add Year 0 / Month 0 (Current state)
    yearlyList.push({
      year: 0,
      age: currentAge,
      nominalAccumulated: Math.round(nominalAcc),
      realDiscounted: Math.round(realDiscounted),
      inflationEroded: 0
    });
    monthlyList.push({
      period: 0,
      age: currentAge,
      nominal: Math.round(nominalAcc),
      real: Math.round(realDiscounted)
    });

    for (let y = 1; y <= years; y++) {
      // Simulate monthly accumulation within each year for strict accuracy
      for (let m = 1; m <= 12; m++) {
        // Nominal calculations
        if (Math.abs(monthlyYield) < 1e-9) {
          // Degenerate linear equations when yield is 0% to prevent NaN errors
          nominalAcc += monthlySavings;
        } else {
          // Standard compound equations: P_t = P_{t-1} * (1+r) + M
          nominalAcc = nominalAcc * (1 + monthlyYield) + monthlySavings;
        }

        // Real calculations: Discount monthly using inflation
        if (Math.abs(monthlyYield - monthlyInflation) < 1e-9) {
          realDiscounted += monthlySavings / Math.pow(1 + monthlyInflation, (y - 1) * 12 + m);
        } else {
          // We compound the yield, then discount it back using inflation
          // Equivalent to compounding at the net real rate: r_real = (1 + y) / (1 + i) - 1
          const realGrowthRate = (1 + monthlyYield) / (1 + monthlyInflation) - 1;
          const discountedContribution = monthlySavings / Math.pow(1 + monthlyInflation, (y - 1) * 12 + m);
          realDiscounted = realDiscounted * (1 + realGrowthRate) + discountedContribution;
        }

        // Save each monthly step for the granular chart
        const currentMonthAge = currentAge + (y - 1) + m / 12;
        monthlyList.push({
          period: (y - 1) * 12 + m,
          age: parseFloat(currentMonthAge.toFixed(2)),
          nominal: Math.round(nominalAcc),
          real: Math.round(realDiscounted)
        });
      }
      
      const eroded = Math.max(0, nominalAcc - realDiscounted);

      yearlyList.push({
        year: y,
        age: currentAge + y,
        nominalAccumulated: Math.round(nominalAcc),
        realDiscounted: Math.round(realDiscounted),
        inflationEroded: Math.round(eroded)
      });
    }

    const nominalEndWealth = nominalAcc;
    const realEndWealth = realDiscounted;
    const inflationLoss = Math.max(0, nominalEndWealth - realEndWealth);
    const lossRatio = nominalEndWealth > 0 ? (inflationLoss / nominalEndWealth) * 100 : 0;

    // Monthly real equivalent payout = Real Discounted Value at retirement / (Payout Years * 12)
    const monthlyRealPayout = realEndWealth / (payoutYears * 12);

    // Dynamic Pension Safety Diagnosis (4 levels)
    // Secure: payout >= 2.5x custom desired monthly expense target
    // Moderate: payout >= 1.5x custom desired monthly expense target
    // Vulnerable: payout >= 1.0x custom desired monthly expense target
    // Fragile: payout < 1.0x custom desired monthly expense target
    let safetyLevel: 'secure' | 'moderate' | 'vulnerable' | 'fragile' = 'fragile';
    const desiredExpense = parseFloat(desiredMonthlyExpenseInput) || 4000;
    const safetyRatio = monthlyRealPayout / desiredExpense;
    
    if (safetyRatio >= 2.5) {
      safetyLevel = 'secure';
    } else if (safetyRatio >= 1.5) {
      safetyLevel = 'moderate';
    } else if (safetyRatio >= 1.0) {
      safetyLevel = 'vulnerable';
    } else {
      safetyLevel = 'fragile';
    }

    return {
      yearlyData: yearlyList,
      monthlyData: monthlyList,
      nominalEndWealth,
      realEndWealth,
      inflationLoss,
      lossRatio,
      monthlyRealPayout,
      safetyLevel
    };
  });

  // Flat values for layout and animations
  const endingNominal = $derived(simulation.nominalEndWealth);
  const endingReal = $derived(simulation.realEndWealth);
  const totalLoss = $derived(simulation.inflationLoss);
  const lossPct = $derived(simulation.lossRatio);
  const monthlyRealPayout = $derived(simulation.monthlyRealPayout);
  const safetyStatus = $derived(simulation.safetyLevel);

  // Animated running numbers
  const tweenedNominal = tweened(0, { duration: 800, easing: cubicOut });
  const tweenedReal = tweened(0, { duration: 800, easing: cubicOut });
  const tweenedPayout = tweened(0, { duration: 800, easing: cubicOut });

  $effect(() => {
    tweenedNominal.set(endingNominal);
    tweenedReal.set(endingReal);
    tweenedPayout.set(monthlyRealPayout);
  });

  // ECharts Config Wrapper
  const chartTheme = useChartTheme();
  let chartRef = $state<{ getEchartsInstance?: () => any } | null>(null);

  const chartOption = $derived.by(() => {
    const isYearly = chartGranularity === 'yearly';
    
    if (isYearly) {
      const list = simulation.yearlyData;
      const xAxisData = list.map(item => `${t('year')} ${item.year} (${item.age}${l.ageYears || '岁'})`);
      const nominalData = list.map(item => item.nominalAccumulated);
      const realData = list.map(item => item.realDiscounted);

      return {
        backgroundColor: 'transparent',
        title: {
          text: l.chartTitle || '名义总财富 vs 实际折现购买力',
          left: 'center',
          textStyle: { color: '#C5A059', fontSize: 13, fontWeight: 'bold' }
        },
        tooltip: {
          trigger: 'axis',
          backgroundColor: 'rgba(20, 20, 20, 0.9)',
          borderColor: '#C5A059',
          borderWidth: 1,
          textStyle: { color: '#EAEAEA' },
          formatter: (params: any) => {
            let str = `<div style="font-weight:bold;color:#C5A059;margin-bottom:6px;">${params[0].name}</div>`;
            params.forEach((item: any) => {
              str += `<div style="display:flex;justify-content:space-between;gap:12px;margin:2px 0;">
                <span><span style="display:inline-block;width:8px;height:8px;border-radius:50%;background-color:${item.color};margin-right:6px;"></span>${item.seriesName}</span>
                <span style="font-weight:bold;color:#FFF">${Math.round(item.value).toLocaleString()}${l.currencyUnit}</span>
              </div>`;
            });
            return str;
          }
        },
        legend: {
          data: [l.nominalWealth || '名义总财富', l.realPurchasingPower || '实际折现购买力'],
          bottom: 0,
          textStyle: { color: '#B5B5B5', fontSize: 11 }
        },
        grid: {
          top: '15%',
          left: '3%',
          right: '4%',
          bottom: '12%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: xAxisData,
          axisLine: { lineStyle: { color: '#3A3A3A' } },
          axisLabel: { color: '#B5B5B5', fontSize: 10, interval: Math.max(1, Math.ceil(list.length / 8)) }
        },
        yAxis: {
          type: 'value',
          axisLine: { lineStyle: { color: '#3A3A3A' } },
          splitLine: { lineStyle: { color: '#222222' } },
          axisLabel: { color: '#B5B5B5', formatter: (value: number) => value.toLocaleString() }
        },
        series: [
          {
            name: l.nominalWealth || '名义总财富',
            type: 'line',
            smooth: true,
            symbol: 'none',
            lineStyle: { color: '#C5A059', width: 3 },
            areaStyle: {
              color: {
                type: 'linear',
                x: 0, y: 0, x2: 0, y2: 1,
                colorStops: [
                  { offset: 0, color: 'rgba(197, 160, 89, 0.35)' },
                  { offset: 1, color: 'rgba(197, 160, 89, 0.01)' }
                ]
              }
            },
            data: nominalData
          },
          {
            name: l.realPurchasingPower || '实际折现购买力',
            type: 'line',
            smooth: true,
            symbol: 'none',
            lineStyle: { color: '#EAEAEA', width: 2, type: 'dashed' },
            data: realData
          }
        ]
      };
    } else {
      // Monthly trajectory (High granularity)
      const list = simulation.monthlyData;
      const xAxisData = list.map(item => `${item.age}${l.ageYears || '岁'}`);
      const nominalData = list.map(item => item.nominal);
      const realData = list.map(item => item.real);

      return {
        backgroundColor: 'transparent',
        title: {
          text: l.chartTitle || '名义总财富 vs 实际折现购买力',
          left: 'center',
          textStyle: { color: '#C5A059', fontSize: 13, fontWeight: 'bold' }
        },
        tooltip: {
          trigger: 'axis',
          backgroundColor: 'rgba(20, 20, 20, 0.9)',
          borderColor: '#C5A059',
          borderWidth: 1,
          textStyle: { color: '#EAEAEA' },
          formatter: (params: any) => {
            let str = `<div style="font-weight:bold;color:#C5A059;margin-bottom:6px;">${params[0].name}</div>`;
            params.forEach((item: any) => {
              str += `<div style="display:flex;justify-content:space-between;gap:12px;margin:2px 0;">
                <span><span style="display:inline-block;width:8px;height:8px;border-radius:50%;background-color:${item.color};margin-right:6px;"></span>${item.seriesName}</span>
                <span style="font-weight:bold;color:#FFF">${Math.round(item.value).toLocaleString()}${l.currencyUnit}</span>
              </div>`;
            });
            return str;
          }
        },
        legend: {
          data: [l.nominalWealth || '名义总财富', l.realPurchasingPower || '实际折现购买力'],
          bottom: 0,
          textStyle: { color: '#B5B5B5', fontSize: 11 }
        },
        grid: {
          top: '15%',
          left: '3%',
          right: '4%',
          bottom: '12%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: xAxisData,
          axisLine: { lineStyle: { color: '#3A3A3A' } },
          axisLabel: { color: '#B5B5B5', fontSize: 9, interval: Math.max(1, Math.ceil(list.length / 8)) }
        },
        yAxis: {
          type: 'value',
          axisLine: { lineStyle: { color: '#3A3A3A' } },
          splitLine: { lineStyle: { color: '#222222' } },
          axisLabel: { color: '#B5B5B5', formatter: (value: number) => value.toLocaleString() }
        },
        series: [
          {
            name: l.nominalWealth || '名义总财富',
            type: 'line',
            smooth: true,
            symbol: 'none',
            lineStyle: { color: '#C5A059', width: 3 },
            areaStyle: {
              color: {
                type: 'linear',
                x: 0, y: 0, x2: 0, y2: 1,
                colorStops: [
                  { offset: 0, color: 'rgba(197, 160, 89, 0.35)' },
                  { offset: 1, color: 'rgba(197, 160, 89, 0.01)' }
                ]
              }
            },
            data: nominalData
          },
          {
            name: l.realPurchasingPower || '实际折现购买力',
            type: 'line',
            smooth: true,
            symbol: 'none',
            lineStyle: { color: '#EAEAEA', width: 2, type: 'dashed' },
            data: realData
          }
        ]
      };
    }
  });
</script>

<div class="tool-theme-shell retirement-optimizer-wrapper py-6 px-4 md:px-8 rounded-3xl relative overflow-hidden">
  
  <!-- Flowing Gold Header Background Effect -->
  <div class="absolute top-0 left-1/4 w-96 h-1 bg-[#C5A059] blur-3xl opacity-35 animate-pulse"></div>

  <!-- Header -->
  <div class="header-section text-center mb-8 relative z-10">
    <h1 class="text-3xl md:text-4xl font-extrabold tracking-tight text-amber-700 dark:bg-gradient-to-r dark:from-yellow-100 dark:via-[#C5A059] dark:to-yellow-100 dark:bg-clip-text dark:text-transparent mb-2">
      {t('title')}
    </h1>
    <p class="text-sm md:text-base text-neutral-400 max-w-2xl mx-auto font-light">
      {t('subtitle')}
    </p>
  </div>

  <!-- Main Grid Layout -->
  <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative z-10">
    
    <!-- Left Column: Inputs Form (5 columns) -->
    <div class="lg:col-span-5 bg-neutral-900/60 backdrop-blur-xl border border-neutral-800/80 p-6 rounded-2xl space-y-6">
      
      <!-- Current Age & Expected Retirement Age Grid -->
      <div class="grid grid-cols-2 gap-4">
        <div class="space-y-2">
          <label for="current-age-slider" class="text-xs text-neutral-400 font-semibold uppercase tracking-wider block">
            {t('currentAge')}: <span class="text-yellow-100 text-sm font-bold">{currentAge}</span> {l.ageYears || '岁'}
          </label>
          <input
            id="current-age-slider"
            type="range"
            min="18"
            max="80"
            bind:value={currentAgeInput}
            class="w-full accent-[#C5A059] bg-neutral-800 h-1.5 rounded-lg cursor-pointer"
          />
        </div>

        <div class="space-y-2">
          <label for="retire-age-slider" class="text-xs text-neutral-400 font-semibold uppercase tracking-wider block">
            {t('retireAge')}: <span class="text-yellow-100 text-sm font-bold">{retireAge}</span> {l.ageYears || '岁'}
          </label>
          <input
            id="retire-age-slider"
            type="range"
            min={currentAge + 1}
            max="95"
            bind:value={retireAgeInput}
            class="w-full accent-[#C5A059] bg-neutral-800 h-1.5 rounded-lg cursor-pointer"
          />
        </div>
      </div>

      <!-- Payout Years Slider -->
      <div class="space-y-2">
        <label for="payout-years-slider" class="text-xs text-neutral-400 font-semibold uppercase tracking-wider flex justify-between">
          <span>{t('payoutYears')}</span>
          <span class="text-yellow-100 font-bold">{payoutYears} {l.years || '年'}</span>
        </label>
        <input
          id="payout-years-slider"
          type="range"
          min="10"
          max="50"
          bind:value={payoutYearsInput}
          class="w-full accent-[#C5A059] bg-neutral-800 h-1.5 rounded-lg cursor-pointer"
        />
      </div>

      <hr class="border-neutral-800 my-4" />

      <!-- Initial Savings and Monthly Savings Inputs -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="space-y-2">
          <label for="initial-savings-input" class="text-xs text-neutral-400 font-semibold tracking-wide block">{t('initialSavings')}</label>
          <div class="relative">
            <input
              id="initial-savings-input"
              type="number"
              bind:value={initialSavingsInput}
              min="0"
              placeholder="0"
              class="w-full bg-neutral-950/80 border border-neutral-800 focus:border-[#C5A059] rounded-xl py-2.5 pl-3 pr-8 text-sm focus:outline-none text-white font-medium transition-colors"
            />
            <span class="absolute right-3 top-2.5 text-xs text-neutral-500 font-bold">{l.currencyUnit}</span>
          </div>
        </div>

        <div class="space-y-2">
          <label for="monthly-savings-input" class="text-xs text-neutral-400 font-semibold tracking-wide block">{t('monthlySavings')}</label>
          <div class="relative">
            <input
              id="monthly-savings-input"
              type="number"
              bind:value={monthlySavingsInput}
              min="0"
              placeholder="0"
              class="w-full bg-neutral-950/80 border border-neutral-800 focus:border-[#C5A059] rounded-xl py-2.5 pl-3 pr-8 text-sm focus:outline-none text-white font-medium transition-colors"
            />
            <span class="absolute right-3 top-2.5 text-xs text-neutral-500 font-bold">{l.currencyUnit}</span>
          </div>
        </div>
      </div>

      <!-- Yield & Inflation Sliders -->
      <div class="space-y-4">
        <!-- Yield Rate -->
        <div class="space-y-2">
          <label for="expected-yield-slider" class="text-xs text-neutral-400 font-semibold uppercase tracking-wider flex justify-between">
            <span>{t('expectedYield')}</span>
            <span class="text-yellow-100 font-bold">{expectedYield}%</span>
          </label>
          <input
            id="expected-yield-slider"
            type="range"
            min="-5"
            max="25"
            step="0.5"
            bind:value={expectedYieldInput}
            class="w-full accent-[#C5A059] bg-neutral-800 h-1.5 rounded-lg cursor-pointer"
          />
        </div>

        <!-- Inflation Rate -->
        <div class="space-y-2">
          <label for="inflation-rate-slider" class="text-xs text-neutral-400 font-semibold uppercase tracking-wider flex justify-between">
            <span>{t('inflationRate')}</span>
            <span class="text-[#C5A059] font-bold">{inflationRate}%</span>
          </label>
          <input
            id="inflation-rate-slider"
            type="range"
            min="0"
            max="15"
            step="0.5"
            bind:value={inflationRateInput}
            class="w-full accent-[#C5A059] bg-neutral-800 h-1.5 rounded-lg cursor-pointer"
          />
        </div>
      </div>

      <!-- Advanced Collapsible Goals Settings -->
      <div class="border border-neutral-800/80 rounded-xl overflow-hidden bg-neutral-950/20">
        <button
          onclick={() => showAdvancedGoal = !showAdvancedGoal}
          class="w-full bg-neutral-950/60 hover:bg-neutral-950 text-neutral-300 text-[11px] px-4 py-3 flex justify-between items-center font-bold tracking-wide focus:outline-none transition-colors border-b border-neutral-800/80"
        >
          <span>⚙️ {l.advancedSettings || '高级精算开支设置'}</span>
          <span class="text-neutral-500">{showAdvancedGoal ? '▼' : '►'}</span>
        </button>
        
        {#if showAdvancedGoal}
          <div class="p-4 bg-neutral-950/40 space-y-3">
            <div class="space-y-2">
              <label for="desired-expense-slider" class="text-[10px] text-neutral-400 font-semibold tracking-wide flex justify-between">
                <span>{l.desiredExpense || '退休后预期每月等效开支'}</span>
                <span class="text-[#C5A059] font-bold">{parseInt(desiredMonthlyExpenseInput).toLocaleString()} {l.currencyUnit}</span>
              </label>
              <input
                id="desired-expense-slider"
                type="range"
                min="1000"
                max="30000"
                step="500"
                bind:value={desiredMonthlyExpenseInput}
                class="w-full accent-[#C5A059] bg-neutral-800 h-1 rounded-lg cursor-pointer"
              />
              <span class="text-[9px] text-neutral-500 block leading-normal">
                * 该期望值将动态重新校准晚年资金安全评级（绿黄橙红）的诊断判定边界。
              </span>
            </div>
          </div>
        {/if}
      </div>

      <!-- Actuarial Linear Fallback Alert -->
      <p class="text-[10px] text-neutral-500 leading-normal bg-neutral-950/40 p-2.5 rounded-lg border border-neutral-800/40">
        {l.calcNotes || '当预期收益为0%时，系统自动退化为线性计算，保障无 NaN 崩溃发生。'}
      </p>

    </div>

    <!-- Right Column: Visual Dashboard & Charts (7 columns) -->
    <div class="lg:col-span-7 space-y-6">
      
      <!-- Primary Summary Card (Obsidian glass with Gold border) -->
      <div class="bg-gradient-to-b from-neutral-900 to-neutral-950/90 border border-[#C5A059]/20 p-6 rounded-2xl relative overflow-hidden shadow-lg">
        
        <!-- Safety Status Neon Capsule Glass indicator -->
        <div class="flex justify-between items-center mb-6">
          <span class="text-xs text-neutral-400 font-bold uppercase tracking-wider">{t('pensionSafety')}</span>
          <div class="flex items-center gap-2 bg-black/40 px-3 py-1.5 rounded-full border border-neutral-800">
            {#if safetyStatus === 'secure'}
              <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
              <span class="text-xs font-semibold text-emerald-400">{l.statusSecure}</span>
            {:else if safetyStatus === 'moderate'}
              <span class="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></span>
              <span class="text-xs font-semibold text-amber-400">{l.statusModerate}</span>
            {:else if safetyStatus === 'vulnerable'}
              <span class="w-2.5 h-2.5 rounded-full bg-orange-500"></span>
              <span class="text-xs font-semibold text-orange-400">{l.statusVulnerable}</span>
            {:else}
              <span class="w-2.5 h-2.5 rounded-full bg-rose-600 animate-pulse"></span>
              <span class="text-xs font-semibold text-rose-400">{l.statusFragile}</span>
            {/if}
          </div>
        </div>

        <!-- Big Payout Value Display -->
        <div class="space-y-1 mb-4">
          <span class="text-xs text-neutral-400 font-semibold">{t('monthlyRealPayout')}</span>
          <div class="flex items-baseline gap-2">
            <span class="text-4xl md:text-5xl font-black text-yellow-100 tracking-tight">
              {Math.round($tweenedPayout).toLocaleString()}
            </span>
            <span class="text-sm font-semibold text-neutral-400">{l.currencyUnit || '元'}/{t('months') || '月'}</span>
          </div>
        </div>

        <!-- Metric grid comparing nominal and real values -->
        <div class="grid grid-cols-2 gap-4 bg-black/30 p-4 rounded-xl border border-neutral-900 mb-4 text-xs">
          <div class="space-y-1">
            <span class="text-neutral-500 block">{t('nominalEndWealth')}</span>
            <span class="text-sm font-bold text-yellow-100">{Math.round($tweenedNominal).toLocaleString()} {l.currencyUnit}</span>
          </div>
          <div class="space-y-1">
            <span class="text-neutral-500 block">{t('realEndWealth')}</span>
            <span class="text-sm font-bold text-neutral-100">{Math.round($tweenedReal).toLocaleString()} {l.currencyUnit}</span>
          </div>
          <div class="space-y-1 col-span-2 pt-2 border-t border-neutral-900 flex justify-between items-center text-[11px]">
            <span class="text-neutral-400">{t('inflationLoss')}: <strong class="text-neutral-200">{Math.round(totalLoss).toLocaleString()} {l.currencyUnit}</strong></span>
            <span class="text-rose-400/90 font-medium">-{lossPct.toFixed(1)}% {t('lossRatio')}</span>
          </div>
        </div>

        <!-- Personalized actuarial strategy block -->
        <div class="text-xs leading-relaxed text-neutral-300 p-3 rounded-lg bg-[#C5A059]/5 border border-[#C5A059]/15">
          <span class="font-bold text-[#C5A059] block mb-1">💡 {t('pensionSafety')}:</span>
          {#if safetyStatus === 'secure'}
            {l.adviceSecure}
          {:else if safetyStatus === 'moderate'}
            {l.adviceModerate}
          {:else if safetyStatus === 'vulnerable'}
            {l.adviceVulnerable}
          {:else}
            {l.adviceFragile}
          {/if}
        </div>

      </div>

      <!-- Chart Panel -->
      <div class="bg-neutral-950/60 p-4 rounded-2xl border border-neutral-800/80 shadow-lg relative min-h-[340px]">
        <!-- Granularity Switch capsule -->
        <div class="flex justify-end mb-2 relative z-20">
          <div class="inline-flex bg-black/60 p-1 rounded-full border border-neutral-800/80 text-[10px]">
            <button
              onclick={() => chartGranularity = 'yearly'}
              class="px-3 py-1 rounded-full font-bold transition-all focus:outline-none {chartGranularity === 'yearly' ? 'bg-[#C5A059] text-neutral-950 shadow-md' : 'text-neutral-400 hover:text-neutral-200'}"
            >
              {l.annualView || '年度视图'}
            </button>
            <button
              onclick={() => chartGranularity = 'monthly'}
              class="px-3 py-1 rounded-full font-bold transition-all focus:outline-none {chartGranularity === 'monthly' ? 'bg-[#C5A059] text-neutral-950 shadow-md' : 'text-neutral-400 hover:text-neutral-200'}"
            >
              {l.monthlyView || '月度视图'}
            </button>
          </div>
        </div>
        <EChartsWrapper bind:this={chartRef} option={chartOption} />
      </div>

    </div>

  </div>

  <!-- Collapsible Amortization Table Block (Full Width) -->
  <div class="mt-8 relative z-10 border-t border-neutral-800 pt-6">
    <div class="flex justify-between items-center mb-4">
      <h3 class="text-lg font-bold text-yellow-100 flex items-center gap-2">
        📊 {t('detailSchedule')}
      </h3>
      
      <button
        onclick={() => showSchedule = !showSchedule}
        class="bg-neutral-800 hover:bg-[#C5A059] hover:text-neutral-950 text-neutral-200 text-xs px-4 py-2 rounded-xl transition-all font-semibold flex items-center gap-1 shadow-md border border-neutral-700/60 focus:outline-none"
      >
        {showSchedule ? '▼ 收起明细' : '► 展开明细'}
      </button>
    </div>

    {#if showSchedule}
      <div class="overflow-x-auto max-h-96 rounded-xl border border-neutral-800 bg-neutral-950/80 backdrop-blur-md shadow-inner text-xs">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-neutral-900 text-neutral-400 border-b border-neutral-800 uppercase tracking-wider font-semibold">
              <th class="py-3 px-4 font-bold">{t('year')}</th>
              <th class="py-3 px-4 font-bold">{t('age')}</th>
              <th class="py-3 px-4 font-bold">{t('nominalAccumulated')}</th>
              <th class="py-3 px-4 font-bold">{t('realDiscounted')}</th>
              <th class="py-3 px-4 font-bold">{t('inflationEroded')}</th>
            </tr>
          </thead>
          <tbody>
            {#each simulation.yearlyData as row (row.year)}
              <tr class="border-b border-neutral-900 hover:bg-[#C5A059]/5 transition-colors font-medium text-neutral-300">
                <td class="py-2.5 px-4 text-neutral-400 font-bold">{row.year === 0 ? 'Start' : `${t('year')} ${row.year}`}</td>
                <td class="py-2.5 px-4 font-bold text-[#C5A059]">{row.age} {l.ageYears}</td>
                <td class="py-2.5 px-4 text-yellow-100">{row.nominalAccumulated.toLocaleString()} {l.currencyUnit}</td>
                <td class="py-2.5 px-4 text-neutral-100">{row.realDiscounted.toLocaleString()} {l.currencyUnit}</td>
                <td class="py-2.5 px-4 text-rose-400/90 font-medium">
                  {row.inflationEroded > 0 ? `-${row.inflationEroded.toLocaleString()}` : '0'} {l.currencyUnit}
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    {/if}
  </div>

  <!-- Bottom QA/FAQ Panel -->
  <div class="mt-8 pt-6 border-t border-neutral-800 bg-neutral-950/40 p-6 rounded-2xl">
    <h3 class="text-sm font-bold text-[#C5A059] mb-4 uppercase tracking-wider flex items-center gap-1.5">
      💡 {t('faqTitle') || '养老理财精算 FAQ'}
    </h3>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-neutral-400">
      <div class="space-y-2">
        <h4 class="font-bold text-yellow-100 text-xs">Q: 为什么一定要区分名义总资产与实际等效购买力？</h4>
        <p class="leading-relaxed">
          A: 三十年后的1000万在通胀下购买力会大幅缩水。实际购买力将未来金额按通胀折现回今天，让您知道几十年后的钱等效于今天的多少元，规避纸面富贵的幻觉。
        </p>
      </div>

      <div class="space-y-2">
        <h4 class="font-bold text-yellow-100 text-xs">Q: 退休领取年限对我的月支配金额有什么影响？</h4>
        <p class="leading-relaxed">
          A: 领取年限越长，资金需要覆盖的时间越久，每月折现后等效可支配金额就会越少。本工具允许您在 10-50 年之间自由滑动配置，贴合个人寿命期望值。
        </p>
      </div>
    </div>
  </div>

</div>

<style>
  /* Custom modern range styling */
  input[type='range'] {
    -webkit-appearance: none;
    appearance: none;
  }
  input[type='range']::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: #C5A059;
    border: 2px solid #FFF;
    cursor: pointer;
    box-shadow: 0 0 10px rgba(197, 160, 89, 0.8);
    transition: transform 0.15s ease-in-out;
  }
  input[type='range']::-webkit-slider-thumb:hover {
    transform: scale(1.25);
  }
</style>
