<script lang="ts">
  import {
    calculateMacros,
  } from '../../lib/macro-helper';

  interface Props {
    locale?: string;
    translations?: Record<string, unknown>;
  }

  let { locale = 'en', translations = {} }: Props = $props();

  const I18N_BACKUP: Record<string, Record<string, string>> = {
    zh: {
      title: '宏量营养素计算器',
      subtitle: '根据您的日卡路里摄入目标进行碳水化合物、蛋白质和脂肪的科学配比',
      targetCalories: '目标每日热量摄入 (kcal)',
      ratioMode: '营养素配比方案',
      balanced: '均衡膳食 (碳50/蛋20/脂30)',
      lowCarb: '低碳高蛋白 (碳25/蛋35/脂40)',
      highProtein: '减脂塑形 (碳40/蛋30/脂30)',
      keto: '极度低碳生酮 (碳5/蛋25/脂70)',
      custom: '自定义配比 (需满足100%)',
      carb: '碳水化合物 (Carbs)',
      protein: '蛋白质 (Protein)',
      fat: '脂肪 (Fats)',
      grams: '克',
      calories: '卡路里',
      copied: '✓ 已复制!',
      copyResult: '复制结果',
      formula: '宏量转换常数',
      formulaText: '碳水 = 4 kcal/g，蛋白质 = 4 kcal/g，脂肪 = 9 kcal/g',
      disclaimer: '计算结果仅供健身及膳食搭配参考，不作为专业医疗指导或临床营养诊断。',
      placeholderText: '请输入每日目标热量，并选择配比方案来计算各项营养素指标。',
      customWarning: '⚠️ 自定义配比当前总和为 {total}%，系统已自动按比例等比缩放至 100% 以进行计算。',
    },
    en: {
      title: 'Macro Calculator',
      subtitle: 'Calculate your daily macronutrient split (carbs, protein, and fats) based on calorie targets',
      targetCalories: 'Daily Calorie Target (kcal)',
      ratioMode: 'Macro Ratio Preset',
      balanced: 'Balanced Diet (50/20/30)',
      lowCarb: 'Low Carb / High Protein (25/35/40)',
      highProtein: 'Fat Loss / Muscle Gain (40/30/30)',
      keto: 'Ketogenic / Low Carb (5/25/70)',
      custom: 'Custom Ratios (Must sum to 100%)',
      carb: 'Carbohydrates',
      protein: 'Protein',
      fat: 'Fats',
      grams: 'g',
      calories: 'kcal',
      copied: '✓ Copied!',
      copyResult: 'Copy Result',
      formula: 'Macro Conversion Constants',
      formulaText: 'Carbs = 4 kcal/g, Protein = 4 kcal/g, Fats = 9 kcal/g',
      disclaimer: 'For general fitness and wellness guidance only. Not medical or clinical nutrition advice.',
      placeholderText: 'Enter your daily calorie target and select a ratio preset to calculate macros.',
      customWarning: '⚠️ Custom split currently sums to {total}%. Values have been normalized to 100% for calculation.',
    },
    es: {
      title: 'Calculadora de Macronutrientes',
      subtitle: 'Calcule su distribución diaria de macros (carbohidratos, proteínas y grasas) según su objetivo calórico',
      targetCalories: 'Objetivo de Calorías Diarias (kcal)',
      ratioMode: 'Preajuste de Relación de Macros',
      balanced: 'Dieta Equilibrada (50/20/30)',
      lowCarb: 'Bajo en Carbohidratos / Alto en Proteínas (25/35/40)',
      highProtein: 'Pérdida de Grasa (40/30/30)',
      keto: 'Cetogénica / Muy Bajo en Carbohidratos (5/25/70)',
      custom: 'Relación Personalizada (Debe sumar 100%)',
      carb: 'Carbohidratos',
      protein: 'Proteínas',
      fat: 'Grasas',
      grams: 'g',
      calories: 'kcal',
      copied: '¡Copiado!',
      copyResult: 'Copiar Resultado',
      formula: 'Constantes de Conversión de Macros',
      formulaText: 'Carbohidratos = 4 kcal/g, Proteínas = 4 kcal/g, Grasas = 9 kcal/g',
      disclaimer: 'Solo para fines de acondicionamiento físico. No constituye asesoramiento médico.',
      placeholderText: 'Ingrese su objetivo calórico y seleccione una proporción para calcular sus macros.',
      customWarning: '⚠️ La distribución actual suma {total}%. Los valores se han normalizado al 100% para el cálculo.',
    },
    pt: {
      title: 'Calculadora de Macronutrientes',
      subtitle: 'Calcule a divisão diária de macros (carboidratos, proteínas e gorduras) com base na meta calórica',
      targetCalories: 'Meta de Calorias Diárias (kcal)',
      ratioMode: 'Predefinição de Macronutrientes',
      balanced: 'Dieta Equilibrada (50/20/30)',
      lowCarb: 'Baixo Carboidrato / Alta Proteína (25/35/40)',
      highProtein: 'Perda de Gordura / Ganho de Massa (40/30/30)',
      keto: 'Cetogênica / Muito Baixo Carboidrato (5/25/70)',
      custom: 'Proporção Personalizada (Deve somar 100%)',
      carb: 'Carboidratos',
      protein: 'Proteínas',
      fat: 'Gorduras',
      grams: 'g',
      calories: 'kcal',
      copied: 'Copiado!',
      copyResult: 'Copiar Resultado',
      formula: 'Constantes de Conversão de Macros',
      formulaText: 'Carboidratos = 4 kcal/g, Proteínas = 4 kcal/g, Gorduras = 9 kcal/g',
      disclaimer: 'Apenas para fins de condicionamento físico. Não substitui conselho médico profissional.',
      placeholderText: 'Insira sua meta de calorias diárias e selecione um plano para calcular as macros.',
      customWarning: '⚠️ A divisão atual soma {total}%. Os valores foram normalizados para 100% para o cálculo.',
    },
    ja: {
      title: 'マクロ栄養素計算シミュレーター',
      subtitle: '1日の目標総摂取カロリーに基づき、三大栄養素（炭水化物、タンパク質、脂質）の最適な配分を計算します',
      targetCalories: '1日の目標総摂取カロリー (kcal)',
      ratioMode: '栄養バランスのプリセット',
      balanced: 'バランス重視 (炭水化物50/タンパク質20/脂質30)',
      lowCarb: '低炭水化物・高タンパク (炭水化物25/タンパク質35/脂質40)',
      highProtein: '減量・バルクアップ (炭水化物40/タンパク質30/脂質30)',
      keto: 'ケトジェニック / 極低炭水化物 (炭水化物5/タンパク質25/脂質70)',
      custom: 'カスタム比率指定 (合計100%)',
      carb: '炭水化物',
      protein: 'タンパク質',
      fat: '脂質',
      grams: 'g',
      calories: 'kcal',
      copied: 'コピーしました！',
      copyResult: '結果をコピー',
      formula: 'マクロ栄養素の換算基準',
      formulaText: '炭水化物 = 4 kcal/g，タンパク質 = 4 kcal/g，脂質 = 9 kcal/g',
      disclaimer: '本シミュレーションは健康増進用の目安です。医療目的でのご使用はお控えください。',
      placeholderText: '1日の目標摂取カロリーを入力し、バランスを選択してマクロ栄養素を計算します。',
      customWarning: '⚠️ 比率の合計が {total}% になっています。計算のため、自動的に100%となるよう比率が補正されました。',
    },
    fr: {
      title: 'Calculateur de Macronutriments',
      subtitle: 'Calculez votre répartition quotidienne de macros (glucides, protéines et lipides) selon vos calories',
      targetCalories: 'Objectif de Calories Quotidiennes (kcal)',
      ratioMode: 'Préconfiguration des Macros',
      balanced: 'Régime Équilibré (50/20/30)',
      lowCarb: 'Faible en Glucides / Riche en Protéines (25/35/40)',
      highProtein: 'Sèche & Musculation (40/30/30)',
      keto: 'Cétogène / Très Faible en Glucides (5/25/70)',
      custom: 'Rapport Personnalisé (Doit totaliser 100%)',
      carb: 'Glucides',
      protein: 'Protéines',
      fat: 'Lipides',
      grams: 'g',
      calories: 'kcal',
      copied: 'Copié !',
      copyResult: 'Copier le Résultat',
      formula: 'Constantes de Conversion des Macros',
      formulaText: 'Glucides = 4 kcal/g, Protéines = 4 kcal/g, Lipides = 9 kcal/g',
      disclaimer: 'Uniquement pour la forme physique. Ne remplace pas un avis nutritionnel clinique.',
      placeholderText: 'Saisissez votre objectif calorique quotidien pour obtenir la répartition des macronutriments.',
      customWarning: '⚠️ Le total actuel est de {total}%. Les valeurs ont été normalisées à 100% pour le calcul.',
    },
    de: {
      title: 'Makronährstoff-Rechner',
      subtitle: 'Berechnen Sie die tägliche Verteilung von Kohlenhydraten, Eiweiß und Fett auf Basis Ihres Kalorienziels',
      targetCalories: 'Tägliches Kalorienziel (kcal)',
      ratioMode: 'Nährstoffverteilung (Preset)',
      balanced: 'Ausgewogene Ernährung (50/20/30)',
      lowCarb: 'Low Carb / High Protein (25/35/40)',
      highProtein: 'Fettabbau / Muskelaufbau (40/30/30)',
      keto: 'Ketogene Diät / Extrem Low Carb (5/25/70)',
      custom: 'Benutzerdefinierte Verteilung (Muss 100% ergeben)',
      carb: 'Kohlenhydrate',
      protein: 'Protein (Eiweiß)',
      fat: 'Fett',
      grams: 'g',
      calories: 'kcal',
      copied: 'Kopiert!',
      copyResult: 'Ergebnis kopieren',
      formula: 'Umrechnungsfaktoren',
      formulaText: 'Kohlenhydrate = 4 kcal/g, Eiweiß = 4 kcal/g, Fett = 9 kcal/g',
      disclaimer: 'Nur zu Fitnesszwecken. Keine medizinische Ernährungsberatung.',
      placeholderText: 'Geben Sie Ihr Kalorienziel ein und wählen Sie ein Preset zur Berechnung der Nährstoffverteilung.',
      customWarning: '⚠️ Das benutzerdefinierte Verhältnis ergibt derzeit {total}%. Die Werte wurden auf 100% normiert.',
    },
    ar: {
      title: 'حاسبة المغذيات الكبرى (Macros)',
      subtitle: 'احسب التوزيع اليومي للمغذيات الكبرى (الكربوهيدرات والبروتينات والدهون) بناءً على السعرات الحرارية المستهدفة',
      targetCalories: 'السعرات اليومية المستهدفة (سعرة)',
      ratioMode: 'خطة توزيع المغذيات الكبرى',
      balanced: 'غذائي متوازن (كربوهيدرات 50/بروتين 20/دهون 30)',
      lowCarb: 'منخفض الكربوهيدرات / عالي البروتين (25/35/40)',
      highProtein: 'بناء العضلات وخسارة الدهون (40/30/30)',
      keto: 'نظام الكيتو (كربوهيدرات 5/بروتين 25/دهون 70)',
      custom: 'نسب مخصصة (يجب أن يكون المجموع 100%)',
      carb: 'الكربوهيدرات',
      protein: 'البروتينات',
      fat: 'الدهون',
      grams: 'جم',
      calories: 'سعرة',
      copied: 'تم النسخ!',
      copyResult: 'نسخ النتيجة',
      formula: 'ثوابت تحويل المغذيات',
      formulaText: 'الكربوهيدرات = 4 سعرة/جم، البروتين = 4 سعرة/جم، الدهون = 9 سعرة/جم',
      disclaimer: 'لأغراض اللياقة البدنية العامة فقط. لا يعتبر نصيحة طبية أو سريرية.',
      placeholderText: 'أدخل السعرات الحرارية المستهدفة واختر خطة لحساب قيم المغذيات الكبرى.',
      customWarning: '⚠️ المجموع الحالي للنسب المخصصة هو {total}%. تم ضبط النسب تلقائياً لتساوي 100%.',
    },
    ko: {
      title: '영양소 (매크로) 계산기',
      subtitle: '일일 칼로리 목표치에 맞추어 탄수화물, 단백질, 지방의 이상적인 일일 섭취 무게를 계산합니다',
      targetCalories: '목표 일일 칼로리 (kcal)',
      ratioMode: '식단 유형 선택',
      balanced: '균형 잡힌 식단 (탄50/단20/지30)',
      lowCarb: '저탄수화물 고단백 (탄25/단35/지40)',
      highProtein: '근육량 증가 및 체지방 감량 (탄40/단30/지30)',
      keto: '키토제닉 / 저탄수화물 (탄5/단25/지70)',
      custom: '직접 설정 (합계 100% 필수)',
      carb: '탄수화물',
      protein: '단백질',
      fat: '지방',
      grams: 'g',
      calories: 'kcal',
      copied: '복사 완료!',
      copyResult: '결과 복사',
      formula: '영양소 열량 환산율',
      formulaText: '탄수화물 = 4 kcal/g，단백질 = 4 kcal/g，지방 = 9 kcal/g',
      disclaimer: '본 계산기는 일반적인 운동 및 웰니스 지침용이며, 임상적인 의학 조언을 대체하지 않습니다.',
      placeholderText: '목표 칼로리를 입력하고 식단 구성을 선택하면 영양소 비율을 계산합니다.',
      customWarning: '⚠️ 직접 설정한 비율의 합이 {total}%입니다. 100%에 맞춰 보정된 수치로 계산되었습니다.',
    },
    ru: {
      title: 'Калькулятор макронутриентов',
      subtitle: 'Расчет суточной нормы белков, жиров и углеводов (БЖУ) на основе вашей нормы калорий',
      targetCalories: 'Целевая калорийность (ккал)',
      ratioMode: 'Программа питания (БЖУ)',
      balanced: 'Сбалансированное питание (У50/Б20/Ж30)',
      lowCarb: 'Низкоуглеводное / Высокобелковое (У25/Б35/Ж40)',
      highProtein: 'Потеря жира / Рельеф (У40/Б30/Ж30)',
      keto: 'Кето-диета / Низкоуглеводная (У5/Б25/Ж70)',
      custom: 'Собственные пропорции (В сумме должно быть 100%)',
      carb: 'Углеводы',
      protein: 'Белки',
      fat: 'Жиры',
      grams: 'г',
      calories: 'ккал',
      copied: 'Скопировано!',
      copyResult: 'Скопировать результат',
      formula: 'Коэффициенты БЖУ',
      formulaText: 'Углеводы = 4 ккал/г, Белки = 4 ккал/г, Жиры = 9 ккал/г',
      disclaimer: 'Только для оздоровительных целей. Не является клиническим руководством по питанию.',
      placeholderText: 'Введите целевую калорийность и выберите пропорции для расчета БЖУ.',
      customWarning: '⚠️ Введенные пропорции дают в сумме {total}%. Значения приведены к 100% для расчета.',
    },
  };

  const l = $derived(I18N_BACKUP[locale] || I18N_BACKUP['en']);

  let targetCalories = $state('2000');
  let ratioMode = $state('balanced');

  // Custom inputs
  let customCarb = $state('40');
  let customProtein = $state('30');
  let customFat = $state('30');

  const result = $derived((() => {
    const tc = parseFloat(targetCalories) || 0;
    if (tc <= 0) return null;

    const calcInput: any = {
      targetCalories: tc,
      ratioMode,
    };

    if (ratioMode === 'custom') {
      calcInput.customCarbPercent = parseFloat(customCarb) || 0;
      calcInput.customProteinPercent = parseFloat(customProtein) || 0;
      calcInput.customFatPercent = parseFloat(customFat) || 0;
    }

    const res = calculateMacros(calcInput);
    const sumCustom = parseFloat(customCarb) + parseFloat(customProtein) + parseFloat(customFat);

    return {
      ...res,
      tc,
      sumCustom,
    };
  })());

  let copied = $state(false);
  function copyResult() {
    if (!result) return;
    let text = `${l.title}\n`;
    text += `${l.targetCalories.replace(' (kcal)', '')}: ${result.tc} kcal\n`;
    text += `${l.ratioMode}: ${l[ratioMode] || ratioMode}\n`;
    text += `-------------------\n`;
    text += `${l.carb}: ${result.carbPercent.toFixed(1)}% | ${result.carbGrams.toFixed(1)}${l.grams} | ${Math.round(result.carbKcal)} kcal\n`;
    text += `${l.protein}: ${result.proteinPercent.toFixed(1)}% | ${result.proteinGrams.toFixed(1)}${l.grams} | ${Math.round(result.proteinKcal)} kcal\n`;
    text += `${l.fat}: ${result.fatPercent.toFixed(1)}% | ${result.fatGrams.toFixed(1)}${l.grams} | ${Math.round(result.fatKcal)} kcal\n`;

    navigator.clipboard.writeText(text).then(() => {
      copied = true;
      setTimeout(() => (copied = false), 1800);
    });
  }
</script>

<div class="bg-stone-950 text-stone-100 p-6 rounded-2xl border border-stone-800 shadow-2xl font-sans min-h-[400px]">
  <!-- Header -->
  <div class="flex items-center gap-3 mb-6">
    <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-700 flex items-center justify-center text-stone-950 font-black text-lg">
      🥗
    </div>
    <div>
      <h2 class="font-extrabold text-lg bg-gradient-to-r from-emerald-300 via-emerald-100 to-emerald-400 bg-clip-text text-transparent leading-tight">
        {l.title}
      </h2>
      <p class="text-stone-500 text-xs mt-0.5">{l.subtitle}</p>
    </div>
  </div>

  <!-- Content Split Grid -->
  <div class="grid grid-cols-1 md:grid-cols-12 gap-6">
    <!-- Left panel: Inputs (span 5) -->
    <div class="md:col-span-5 space-y-4">
      <label class="block">
        <span class="text-xs text-stone-400 mb-1.5 block">{l.targetCalories}</span>
        <input
          type="number"
          bind:value={targetCalories}
          min="100"
          max="10000"
          step="50"
          class="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-2.5 text-sm text-stone-100 focus:border-emerald-500 focus:outline-none transition-colors"
        />
      </label>

      <div>
        <span class="text-xs text-stone-400 mb-1.5 block">{l.ratioMode}</span>
        <div class="space-y-2">
          {#each ['balanced', 'low-carb', 'high-protein', 'keto', 'custom'] as m}
            <button
              type="button"
              onclick={() => (ratioMode = m)}
              class="w-full text-left px-3 py-2 text-xs font-semibold rounded-lg border transition-all flex items-center justify-between {ratioMode === m ? 'bg-emerald-950/40 border-emerald-600 text-emerald-400' : 'bg-stone-900 border-stone-800 text-stone-400 hover:border-stone-700'}"
            >
              <span>{l[m] || m}</span>
              {#if m !== 'custom'}
                <span class="text-xxs opacity-70">
                  {m === 'balanced' ? '50/20/30' : m === 'low-carb' ? '25/35/40' : m === 'high-protein' ? '40/30/30' : '5/25/70'}
                </span>
              {/if}
            </button>
          {/each}
        </div>
      </div>

      {#if ratioMode === 'custom'}
        <!-- Custom Input Sliders/Inputs -->
        <div class="border-t border-stone-850 pt-4 space-y-3 bg-stone-900/35 p-3 rounded-xl border border-stone-850">
          <div class="grid grid-cols-3 gap-2">
            <label class="block">
              <span class="text-xxs text-stone-400 mb-1 block">Carb (%)</span>
              <input
                type="number"
                bind:value={customCarb}
                min="0"
                max="100"
                class="w-full bg-stone-950 border border-stone-850 rounded-lg px-2 py-1.5 text-xs text-stone-100 focus:border-emerald-500 focus:outline-none"
              />
            </label>
            <label class="block">
              <span class="text-xxs text-stone-400 mb-1 block">Protein (%)</span>
              <input
                type="number"
                bind:value={customProtein}
                min="0"
                max="100"
                class="w-full bg-stone-950 border border-stone-850 rounded-lg px-2 py-1.5 text-xs text-stone-100 focus:border-emerald-500 focus:outline-none"
              />
            </label>
            <label class="block">
              <span class="text-xxs text-stone-400 mb-1 block">Fat (%)</span>
              <input
                type="number"
                bind:value={customFat}
                min="0"
                max="100"
                class="w-full bg-stone-950 border border-stone-850 rounded-lg px-2 py-1.5 text-xs text-stone-100 focus:border-emerald-500 focus:outline-none"
              />
            </label>
          </div>
          <div class="text-xxs text-stone-500 flex justify-between">
            <span>Total: {parseFloat(customCarb) + parseFloat(customProtein) + parseFloat(customFat)}%</span>
            {#if (parseFloat(customCarb) + parseFloat(customProtein) + parseFloat(customFat)) !== 100}
              <span class="text-amber-500">Not 100%</span>
            {:else}
              <span class="text-emerald-500">Perfect 100%</span>
            {/if}
          </div>
        </div>
      {/if}
    </div>

    <!-- Right panel: Results (span 7) -->
    <div class="md:col-span-7 flex flex-col justify-between space-y-4">
      {#if result}
        <div class="space-y-4">
          <!-- Custom Warning Alert -->
          {#if ratioMode === 'custom' && result.sumCustom !== 100 && result.sumCustom > 0}
            <div class="bg-amber-950/30 border border-amber-800/40 rounded-xl p-3 text-amber-400 text-xxs leading-relaxed">
              {l.customWarning.replace('{total}', String(result.sumCustom))}
            </div>
          {/if}

          <!-- Three core macro bars/KPI cards -->
          <div class="space-y-3">
            <!-- Carbohydrates -->
            <div class="bg-stone-900 border border-stone-800 rounded-xl p-4 flex items-center justify-between relative overflow-hidden">
              <div class="absolute left-0 top-0 bottom-0 bg-emerald-500/5" style="width: {result.carbPercent}%"></div>
              <div class="space-y-0.5 relative z-10">
                <span class="text-xs font-bold text-stone-200">{l.carb}</span>
                <p class="text-xxs text-stone-500">{result.carbPercent.toFixed(1)}% · {Math.round(result.carbKcal)} {l.calories}</p>
              </div>
              <div class="text-right relative z-10">
                <span class="text-xl font-black text-emerald-400">{result.carbGrams.toFixed(1)}</span>
                <span class="text-xxs text-stone-400 ml-0.5">{l.grams}</span>
              </div>
            </div>

            <!-- Protein -->
            <div class="bg-stone-900 border border-stone-800 rounded-xl p-4 flex items-center justify-between relative overflow-hidden">
              <div class="absolute left-0 top-0 bottom-0 bg-sky-500/5" style="width: {result.proteinPercent}%"></div>
              <div class="space-y-0.5 relative z-10">
                <span class="text-xs font-bold text-stone-200">{l.protein}</span>
                <p class="text-xxs text-stone-500">{result.proteinPercent.toFixed(1)}% · {Math.round(result.proteinKcal)} {l.calories}</p>
              </div>
              <div class="text-right relative z-10">
                <span class="text-xl font-black text-sky-400">{result.proteinGrams.toFixed(1)}</span>
                <span class="text-xxs text-stone-400 ml-0.5">{l.grams}</span>
              </div>
            </div>

            <!-- Fats -->
            <div class="bg-stone-900 border border-stone-800 rounded-xl p-4 flex items-center justify-between relative overflow-hidden">
              <div class="absolute left-0 top-0 bottom-0 bg-amber-500/5" style="width: {result.fatPercent}%"></div>
              <div class="space-y-0.5 relative z-10">
                <span class="text-xs font-bold text-stone-200">{l.fat}</span>
                <p class="text-xxs text-stone-500">{result.fatPercent.toFixed(1)}% · {Math.round(result.fatKcal)} {l.calories}</p>
              </div>
              <div class="text-right relative z-10">
                <span class="text-xl font-black text-amber-400">{result.fatGrams.toFixed(1)}</span>
                <span class="text-xxs text-stone-400 ml-0.5">{l.grams}</span>
              </div>
            </div>
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
              <span class="text-emerald-400">{l.copied}</span>
            {:else}
              <span>📋 {l.copyResult}</span>
            {/if}
          </button>
        </div>
      {:else}
        <!-- Empty / Error Placeholder -->
        <div class="h-full flex flex-col items-center justify-center text-center p-8 bg-stone-900/25 border border-dashed border-stone-850 rounded-xl">
          <div class="text-3xl mb-3">🥗</div>
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
