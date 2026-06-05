<script lang="ts">
  import {
    calculateOneRepMax,
    generateLoadTable,
  } from '../../lib/one-rep-max-helper';

  interface Props {
    locale?: string;
    translations?: Record<string, unknown>;
  }

  let { locale = 'en', translations = {} }: Props = $props();

  const I18N_BACKUP: Record<string, Record<string, string>> = {
    zh: {
      title: '1RM 最大力量估算器',
      subtitle: '根据您在抗阻训练中举起的重量和重复次数，估算单次最大负重 (1RM) 及各强度区间',
      weight: '举起重量',
      reps: '重复次数 (Reps)',
      oneRepMax: '最大单次起重量 (1RM)',
      epley: 'Epley 公式估算',
      brzycki: 'Brzycki 公式估算',
      loadTable: '不同比例负荷强度对照表',
      percentage: '负荷强度 (%)',
      targetWeight: '配重重量',
      recommendedReps: '建议重复次数',
      copied: '✓ 已复制!',
      copyResult: '复制结果',
      formula: '计算公式',
      formulaText: '1RM = 重理 × (1 + 次数/30) [Epley] | 1RM = 重量 / (1.0278 - 0.0278×次数) [Brzycki]',
      disclaimer: '计算结果为经验性估算。极限力量训练极具风险，请务必在专业保护员或安全架看护下进行，防止受伤。',
      placeholderText: '请输入重量和重复次数以推算您的力量上限与负荷表格。',
      unitKg: '公斤 (kg)',
      unitLbs: '磅 (lbs)',
      unitSelect: '单位',
    },
    en: {
      title: '1RM One Rep Max Calculator',
      subtitle: 'Estimate your single-rep maximum lifting capacity and intensity zones based on weight and reps',
      weight: 'Weight Lifted',
      reps: 'Reps Completed',
      oneRepMax: 'Estimated 1 Rep Max (1RM)',
      epley: 'Epley Formula',
      brzycki: 'Brzycki Formula',
      loadTable: 'Percentage Training Load Table',
      percentage: 'Intensity (%)',
      targetWeight: 'Training Weight',
      recommendedReps: 'Recommended Reps',
      copied: '✓ Copied!',
      copyResult: 'Copy Result',
      formula: 'Formulas Used',
      formulaText: '1RM = W × (1 + R/30) [Epley] | 1RM = W / (1.0278 - 0.0278×R) [Brzycki]',
      disclaimer: 'Calculated values are empirical estimates. Heavy lifting has inherent risks, always use a spotter and safety bars.',
      placeholderText: 'Enter weight and reps completed to calculate your strength limits and loading matrix.',
      unitKg: 'kg',
      unitLbs: 'lbs',
      unitSelect: 'Unit',
    },
    es: {
      title: 'Calculadora de 1RM (Una Repetición Máxima)',
      subtitle: 'Estime su capacidad de levantamiento máximo de una sola repetición y las zonas de intensidad',
      weight: 'Peso Levantado',
      reps: 'Repeticiones Completadas',
      oneRepMax: '1 Repetición Máxima Estimada (1RM)',
      epley: 'Fórmula Epley',
      brzycki: 'Fórmula Brzycki',
      loadTable: 'Tabla de Carga de Entrenamiento por Porcentaje',
      percentage: 'Intensidad (%)',
      targetWeight: 'Peso de Entrenamiento',
      recommendedReps: 'Repeticiones Recomendadas',
      copied: '¡Copiado!',
      copyResult: 'Copiar Resultado',
      formula: 'Fórmulas Utilizadas',
      formulaText: '1RM = W × (1 + R/30) [Epley] | 1RM = W / (1.0278 - 0.0278×R) [Brzycki]',
      disclaimer: 'Los valores calculados son estimaciones empíricas. Use soportes de seguridad y asistente siempre.',
      placeholderText: 'Ingrese el peso y las repeticiones para calcular sus límites de fuerza y la matriz de carga.',
      unitKg: 'kg',
      unitLbs: 'lbs',
      unitSelect: 'Unidad',
    },
    pt: {
      title: 'Calculadora de 1RM (Uma Repetição Máxima)',
      subtitle: 'Estime sua capacidade máxima de levantamento de uma repetição e zonas de intensidade',
      weight: 'Peso Levantado',
      reps: 'Repetições Concluídas',
      oneRepMax: '1 Repetição Máxima Estimada (1RM)',
      epley: 'Fórmula Epley',
      brzycki: 'Fórmula Brzycki',
      loadTable: 'Tabela de Carga de Treinamento por Porcentagem',
      percentage: 'Intensidade (%)',
      targetWeight: 'Peso de Treino',
      recommendedReps: 'Repetições Recomendadas',
      copied: 'Copiado!',
      copyResult: 'Copiar Resultado',
      formula: 'Fórmulas Utilizadas',
      formulaText: '1RM = W × (1 + R/30) [Epley] | 1RM = W / (1.0278 - 0.0278×R) [Brzycki]',
      disclaimer: 'Valores estimados empiricamente. Treinos de força pesados possuem riscos, use travas de segurança.',
      placeholderText: 'Insira o peso e as repetições para calcular os limites de força e matriz de carga.',
      unitKg: 'kg',
      unitLbs: 'lbs',
      unitSelect: 'Unidade',
    },
    ja: {
      title: '1RM 最大挙上重量計算シミュレーター',
      subtitle: '挙上重量と反復回数（レップ数）から、1回だけ持ち上げられる最大重量 (1RM) および強度別テーブルを算出します',
      weight: '挙上重量',
      reps: '反復回数 (Reps)',
      oneRepMax: '推定最大挙上重量 (1RM)',
      epley: 'Epley 法による推定',
      brzycki: 'Brzycki 法による推定',
      loadTable: '強度別（％）トレーニング負荷表',
      percentage: 'トレーニング強度 (%)',
      targetWeight: '設定重量',
      recommendedReps: '目安レップ数',
      copied: 'コピーしました！',
      copyResult: '結果をコピー',
      formula: '使用される計算式',
      formulaText: '1RM = W × (1 + R/30) [Epley] | 1RM = W / (1.0278 - 0.0278×R) [Brzycki]',
      disclaimer: '計算結果は経験的な推定値です。限界重量に挑む際は、必ずセーフティバーを使用し、補助者をつけて行ってください。',
      placeholderText: '重量と回数を入力して、最大筋力および負荷マトリクスを計算します。',
      unitKg: 'kg',
      unitLbs: 'lbs',
      unitSelect: '単位',
    },
    fr: {
      title: 'Calculateur de 1RM (Une Répétition Maximale)',
      subtitle: 'Estimez votre capacité de charge maximale théorique sur une répétition et vos zones d\'intensité',
      weight: 'Poids Soulevé',
      reps: 'Répétitions Effectuées',
      oneRepMax: 'Estimation du 1 Rep Max (1RM)',
      epley: 'Formule d\'Epley',
      brzycki: 'Formule de Brzycki',
      loadTable: 'Tableau de Charge d\'Entraînement en Pourcentages',
      percentage: 'Intensité (%)',
      targetWeight: 'Poids d\'Entraînement',
      recommendedReps: 'Répétitions Recommandées',
      copied: 'Copié !',
      copyResult: 'Copier le Résultat',
      formula: 'Formules Utilisées',
      formulaText: '1RM = W × (1 + R/30) [Epley] | 1RM = W / (1.0278 - 0.0278×R) [Brzycki]',
      disclaimer: 'Les valeurs calculées sont empiriques. L\'entraînement lourd comporte des risques, utilisez des barres de sécurité.',
      placeholderText: 'Saisissez le poids et les répétitions pour calculer votre force maximale théorique.',
      unitKg: 'kg',
      unitLbs: 'lbs',
      unitSelect: 'Unité',
    },
    de: {
      title: '1RM-Rechner (Maximalkraft)',
      subtitle: 'Schätzen Sie Ihre maximale Tragfähigkeit für eine Wiederholung und Ihre Trainingszonen',
      weight: 'Gewicht',
      reps: 'Wiederholungen',
      oneRepMax: 'Geschätztes Maximalgewicht (1RM)',
      epley: 'Epley-Formel',
      brzycki: 'Brzycki-Formel',
      loadTable: 'Prozentuale Trainingsbelastungs-Tabelle',
      percentage: 'Intensität (%)',
      targetWeight: 'Trainingsgewicht',
      recommendedReps: 'Empfohlene Wiederholungen',
      copied: 'Kopiert!',
      copyResult: 'Ergebnis kopieren',
      formula: 'Verwendete Formeln',
      formulaText: '1RM = W × (1 + R/30) [Epley] | 1RM = W / (1.0278 - 0.0278×R) [Brzycki]',
      disclaimer: 'Berechnete Werte sind Schätzungen. Verwenden Sie bei Maximalkraftversuchen immer Sicherheitsablagen.',
      placeholderText: 'Geben Sie Gewicht und Wiederholungen ein, um Ihre Maximalkraft und die Lastverteilung zu berechnen.',
      unitKg: 'kg',
      unitLbs: 'lbs',
      unitSelect: 'Einheit',
    },
    ar: {
      title: 'حاسبة الوزن الأقصى لصفقة واحدة (1RM)',
      subtitle: 'قدر أقصى وزن يمكنك رفعه لمرة واحدة ومناطق الشدة التدريبية بناءً على الوزن والتكرارات',
      weight: 'الوزن المرفوع',
      reps: 'التكرارات المنجزة',
      oneRepMax: 'أقصى وزن تقديري لرفعة واحدة (1RM)',
      epley: 'معادلة إيبلي',
      brzycki: 'معادلة برزيكي',
      loadTable: 'جدول نسب الحمل التدريبي المئوية',
      percentage: 'الشدة (%)',
      targetWeight: 'الوزن التدريبي',
      recommendedReps: 'التكرارات الموصى بها',
      copied: 'تم النسخ!',
      copyResult: 'نسخ النتيجة',
      formula: 'المعادلات المستخدمة',
      formulaText: '1RM = W × (1 + R/30) [Epley] | 1RM = W / (1.0278 - 0.0278×R) [Brzycki]',
      disclaimer: 'القيم المحسوبة هي تقديرات تجريبية. احرص دائماً على وجود مرافق واستخدم حوامل الأمان أثناء الرفع الثقيل.',
      placeholderText: 'أدخل الوزن والتكرارات لحساب حدود قوتك القصوى ومصفوفة الأحمال.',
      unitKg: 'كجم',
      unitLbs: 'رطل',
      unitSelect: 'الوحدة',
    },
    ko: {
      title: '1RM 최대 근력 계산기',
      subtitle: '운동 시 수행한 중량과 반복 횟수를 통해 1회당 낼 수 있는 최대 무게(1RM)와 훈련 강도 테이블을 산출합니다',
      weight: '수행 중량',
      reps: '반복 횟수 (Reps)',
      oneRepMax: '추정 일회 최대 중량 (1RM)',
      epley: 'Epley 수식 기준',
      brzycki: 'Brzycki 수식 기준',
      loadTable: '운동 강도 비율별 훈련 중량 표',
      percentage: '훈련 강도 (%)',
      targetWeight: '목표 훈련 중량',
      recommendedReps: '권장 반복 횟수',
      copied: '복사 완료!',
      copyResult: '결과 복사',
      formula: '중량 환산 공식',
      formulaText: '1RM = W × (1 + R/30) [Epley] | 1RM = W / (1.0278 - 0.0278×R) [Brzycki]',
      disclaimer: '본 결과는 경험적 추정값입니다. 고중량 훈련 시 부상 방지를 위해 반드시 안전바를 설정하고 보조자와 함께하십시오.',
      placeholderText: '수행 무게와 반복 횟수를 입력하여 최대 근력 추정치와 구간별 훈련 중량을 알아보세요.',
      unitKg: 'kg',
      unitLbs: 'lbs',
      unitSelect: '단위',
    },
    ru: {
      title: 'Калькулятор одного повторного максимума (1RM)',
      subtitle: 'Оценка максимального веса на одно повторение и тренировочных зон на основе поднятого веса и количества повторений',
      weight: 'Поднятый вес',
      reps: 'Повторения',
      oneRepMax: 'Расчетный повторный максимум (1RM)',
      epley: 'Формула Эпли (Epley)',
      brzycki: 'Формула Бржицки (Brzycki)',
      loadTable: 'Процентная таблица тренировочных весов',
      percentage: 'Интенсивность (%)',
      targetWeight: 'Тренировочный вес',
      recommendedReps: 'Рекомендуемые повторы',
      copied: 'Скопировано!',
      copyResult: 'Скопировать результат',
      formula: 'Используемые формулы',
      formulaText: '1RM = W × (1 + R/30) [Epley] | 1RM = W / (1.0278 - 0.0278×R) [Brzycki]',
      disclaimer: 'Рассчитанные значения являются эмпирическими оценками. Тренировки с максимальными весами опасны, используйте страховку.',
      placeholderText: 'Введите вес и количество повторений для расчета повторного максимума и матрицы нагрузок.',
      unitKg: 'кг',
      unitLbs: 'фунты (lbs)',
      unitSelect: 'Единица',
    },
  };

  const l = $derived(I18N_BACKUP[locale] || I18N_BACKUP['en']);

  let weight = $state('80');
  let reps = $state('5');
  let unit = $state('kg'); // kg | lbs

  const result = $derived((() => {
    const w = parseFloat(weight) || 0;
    const r = parseInt(reps, 10) || 0;

    if (w <= 0 || r <= 0) return null;

    const maxes = calculateOneRepMax({ weight: w, reps: r });
    const loadTable = generateLoadTable(maxes.averageMax);

    return {
      ...maxes,
      loadTable,
      w,
      r,
    };
  })());

  let copied = $state(false);
  function copyResult() {
    if (!result) return;
    const unitText = unit === 'kg' ? 'kg' : 'lbs';
    let text = `${l.title}\n`;
    text += `${l.weight}: ${result.w} ${unitText}\n`;
    text += `${l.reps}: ${result.r}\n`;
    text += `-------------------\n`;
    text += `${l.oneRepMax}: ${result.averageMax.toFixed(1)} ${unitText}\n`;
    text += `${l.epley}: ${result.epleyMax.toFixed(1)} ${unitText}\n`;
    text += `${l.brzycki}: ${result.brzyckiMax.toFixed(1)} ${unitText}\n`;

    navigator.clipboard.writeText(text).then(() => {
      copied = true;
      setTimeout(() => (copied = false), 1800);
    });
  }
</script>

<div class="bg-stone-950 text-stone-100 p-6 rounded-2xl border border-stone-800 shadow-2xl font-sans min-h-[400px]">
  <!-- Header -->
  <div class="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
    <div class="flex items-center gap-3">
      <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-red-800 flex items-center justify-center text-stone-950 font-black text-lg">
        🏋️
      </div>
      <div>
        <h2 class="font-extrabold text-lg bg-gradient-to-r from-red-400 via-red-100 to-red-500 bg-clip-text text-transparent leading-tight">
          {l.title}
        </h2>
        <p class="text-stone-500 text-xs mt-0.5">{l.subtitle}</p>
      </div>
    </div>
    <div class="sm:ml-auto flex items-center gap-2">
      <span class="text-xxs text-stone-500">{l.unitSelect}:</span>
      <select
        bind:value={unit}
        class="bg-stone-900 border border-stone-700 text-stone-200 text-xs rounded-lg px-2 py-1 cursor-pointer focus:border-red-500 focus:outline-none transition-colors"
      >
        <option value="kg">{l.unitKg}</option>
        <option value="lbs">{l.unitLbs}</option>
      </select>
    </div>
  </div>

  <!-- Content Split Grid -->
  <div class="grid grid-cols-1 md:grid-cols-12 gap-6">
    <!-- Left Panel: Inputs (span 5) -->
    <div class="md:col-span-5 space-y-4">
      <label class="block">
        <span class="text-xs text-stone-400 mb-1.5 block">{l.weight} ({unit === 'kg' ? 'kg' : 'lbs'})</span>
        <input
          type="number"
          bind:value={weight}
          min="1"
          step="2.5"
          class="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-2.5 text-sm text-stone-100 focus:border-red-500 focus:outline-none transition-colors"
        />
      </label>

      <label class="block">
        <span class="text-xs text-stone-400 mb-1.5 block">{l.reps}</span>
        <input
          type="number"
          bind:value={reps}
          min="1"
          max="30"
          step="1"
          class="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-2.5 text-sm text-stone-100 focus:border-red-500 focus:outline-none transition-colors"
        />
      </label>

      <!-- BMR/Formulas description card -->
      <div class="bg-stone-900/40 rounded-xl p-3 border border-stone-850 space-y-2">
        <p class="text-xxs text-stone-500 uppercase tracking-wider">{l.formula}</p>
        <p class="text-xxs text-stone-400 leading-relaxed font-mono">
          {l.formulaText}
        </p>
      </div>
    </div>

    <!-- Right Panel: Results (span 7) -->
    <div class="md:col-span-7 flex flex-col justify-between space-y-4">
      {#if result}
        <div class="space-y-4">
          <!-- Big 1RM Display -->
          <div class="rounded-xl p-5 bg-red-950/20 border border-red-800/30 text-center relative overflow-hidden">
            <div class="absolute -right-6 -bottom-6 text-7xl opacity-5 select-none">🏋️</div>
            <p class="text-xs text-stone-400 mb-1">{l.oneRepMax}</p>
            <p class="text-5xl font-black text-red-550 tracking-tight">
              {result.averageMax.toFixed(1)} <span class="text-lg font-bold">{unit === 'kg' ? 'kg' : 'lbs'}</span>
            </p>
            <div class="grid grid-cols-2 gap-2 mt-3 text-xxs text-stone-500">
              <div>{l.epley}: <span class="text-stone-300 font-semibold">{result.epleyMax.toFixed(1)}</span></div>
              <div>{l.brzycki}: <span class="text-stone-300 font-semibold">{result.brzyckiMax.toFixed(1)}</span></div>
            </div>
          </div>

          <!-- Loading table -->
          <div class="bg-stone-900 border border-stone-800 rounded-xl overflow-hidden">
            <div class="px-4 py-2 border-b border-stone-800 bg-stone-900/60 text-xxs font-bold uppercase tracking-wider text-stone-400">
              {l.loadTable}
            </div>
            <div class="max-h-[180px] overflow-y-auto divide-y divide-stone-850">
              {#each result.loadTable as row}
                <div class="flex items-center justify-between px-4 py-2 text-xs">
                  <div class="w-16 text-stone-400">{row.percentage}%</div>
                  <div class="font-bold text-stone-200">
                    {row.weight.toFixed(1)} {unit === 'kg' ? 'kg' : 'lbs'}
                  </div>
                  <div class="w-24 text-right text-stone-500">
                    ~ {row.recommendedReps} reps
                  </div>
                </div>
              {/each}
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
              <span class="text-red-400">{l.copied}</span>
            {:else}
              <span>📋 {l.copyResult}</span>
            {/if}
          </button>
        </div>
      {:else}
        <!-- Empty Placeholder -->
        <div class="h-full flex flex-col items-center justify-center text-center p-8 bg-stone-900/25 border border-dashed border-stone-850 rounded-xl">
          <div class="text-3xl mb-3">🏋️</div>
          <p class="text-xs text-stone-400 max-w-xs leading-relaxed">
            {l.placeholderText}
          </p>
        </div>
      {/if}

      <!-- Disclaimer Footer -->
      <div class="text-xxs text-stone-600 pt-4 leading-relaxed text-center">
        {l.disclaimer}
      </div>
    </div>
  </div>
</div>

<style>
  .text-xxs {
    font-size: 0.65rem;
  }
</style>
