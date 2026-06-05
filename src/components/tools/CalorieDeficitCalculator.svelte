<script lang="ts">
  import {
    calculateCalorieDeficit,
    ACTIVITY_MULTIPLIERS,
  } from '../../lib/calorie-deficit-helper';

  interface Props {
    locale?: string;
    translations?: Record<string, unknown>;
  }

  let { locale = 'en', translations = {} }: Props = $props();

  const I18N_BACKUP: Record<string, Record<string, string>> = {
    zh: {
      title: '热量缺口计算器',
      subtitle: '计算您的基础代谢率 (BMR)、每日总消耗 (TDEE) 及实现减重所需的目标卡路里摄入',
      gender: '性别',
      male: '男',
      female: '女',
      age: '年龄 (岁)',
      height: '身高 (厘米)',
      weight: '体重 (公斤)',
      bodyFat: '体脂率 (% - 可选)',
      activityLevel: '日常活动水平',
      deficitMode: '热量缺口设定方式',
      byValue: '固定卡路里缺口',
      byPercent: '比例缺口 (TDEE%)',
      byRate: '按目标减重速率',
      deficitKcal: '每日缺口卡路里 (kcal)',
      deficitPercent: '缺口比例 (%)',
      lossGoal: '每周减重目标',
      bmr: '基础代谢率 (BMR)',
      tdee: '每日总消耗 (TDEE)',
      targetIntake: '目标每日热量摄入',
      weeklyLoss: '预计每周减重',
      safetyWarning: '⚠️ 安全警告：目标摄入量低于 {limit} kcal 安全红线！已自动修正为安全临界值。过度节食有害健康。',
      sedentary: '久坐 (几乎不运动)',
      light: '轻度活跃 (每周运动 1-3 天)',
      moderate: '中度活跃 (每周运动 3-5 天)',
      active: '活跃 (每周运动 6-7 天)',
      extreme: '极度活跃 (重体力活/运动员)',
      copied: '✓ 已复制!',
      copyResult: '复制结果',
      formula: '计算公式',
      formulaText: 'BMR = 10×体重 + 6.25×身高 - 5×年龄 + 偏移',
      disclaimer: '本计算器提供估算数据，仅供参考，不构成任何医疗或专业营养建议。',
      placeholderText: '请输入您的身体指标与活动水平以计算每日热量缺口。',
      unitWeight: '公斤',
      unitHeight: '厘米',
    },
    en: {
      title: 'Calorie Deficit Calculator',
      subtitle: 'Calculate your BMR, TDEE, and target calorie intake for healthy weight loss',
      gender: 'Gender',
      male: 'Male',
      female: 'Female',
      age: 'Age (years)',
      height: 'Height (cm)',
      weight: 'Weight (kg)',
      bodyFat: 'Body Fat (% - Optional)',
      activityLevel: 'Daily Activity Level',
      deficitMode: 'Deficit Settings',
      byValue: 'Fixed Calories Deficit',
      byPercent: 'Percentage of TDEE',
      byRate: 'Weekly Loss Goal',
      deficitKcal: 'Daily Calorie Deficit (kcal)',
      deficitPercent: 'Deficit Percentage (%)',
      lossGoal: 'Weekly Loss Goal',
      bmr: 'Basal Metabolic Rate (BMR)',
      tdee: 'Total Daily Energy Expenditure (TDEE)',
      targetIntake: 'Target Daily Intake',
      weeklyLoss: 'Est. Weekly Weight Loss',
      safetyWarning: '⚠️ Safety Warning: Target intake falls below the {limit} kcal safety limit! Clamped to safe limit for health.',
      sedentary: 'Sedentary (Little or no exercise)',
      light: 'Lightly Active (Exercise 1-3 days/week)',
      moderate: 'Moderately Active (Exercise 3-5 days/week)',
      active: 'Very Active (Exercise 6-7 days/week)',
      extreme: 'Extra Active (Hard labor / Athlete)',
      copied: '✓ Copied!',
      copyResult: 'Copy Result',
      formula: 'Formula',
      formulaText: 'BMR = 10×Wt + 6.25×Ht - 5×Age + offset',
      disclaimer: 'For informational purposes only. Consult a healthcare provider before starting any diet program.',
      placeholderText: 'Enter your biometric data and activity level to compute deficit targets',
      unitWeight: 'kg',
      unitHeight: 'cm',
    },
    es: {
      title: 'Calculadora de Déficit Calórico',
      subtitle: 'Calcule su BMR, TDEE e ingesta calórica ideal para una pérdida de peso saludable',
      gender: 'Género',
      male: 'Masculino',
      female: 'Femenino',
      age: 'Edad (años)',
      height: 'Altura (cm)',
      weight: 'Peso (kg)',
      bodyFat: 'Grasa Corporal (% - Opcional)',
      activityLevel: 'Nivel de Actividad',
      deficitMode: 'Ajuste de Déficit',
      byValue: 'Déficit Calórico Fijo',
      byPercent: 'Porcentaje de TDEE',
      byRate: 'Pérdida Semanal Objetivo',
      deficitKcal: 'Déficit Calórico Diario (kcal)',
      deficitPercent: 'Porcentaje de Déficit (%)',
      lossGoal: 'Pérdida Semanal',
      bmr: 'Tasa Metabólica Basal (BMR)',
      tdee: 'Gasto Energético Diario (TDEE)',
      targetIntake: 'Ingesta Diaria Objetivo',
      weeklyLoss: 'Pérdida Semanal Estimada',
      safetyWarning: '⚠️ Alerta de Seguridad: ¡La ingesta objetivo es inferior a {limit} kcal! Ajustada al límite seguro.',
      sedentary: 'Sedentario (Poco o ningún ejercicio)',
      light: 'Ligeramente Activo (1-3 días/semana)',
      moderate: 'Moderadamente Activo (3-5 días/semana)',
      active: 'Muy Activo (6-7 días/semana)',
      extreme: 'Hiperactivo (Trabajo pesado / Atleta)',
      copied: '¡Copiado!',
      copyResult: 'Copiar Resultado',
      formula: 'Fórmula',
      formulaText: 'BMR = 10×Peso + 6.25×Altura - 5×Edad + ajuste',
      disclaimer: 'Solo para fines informativos. Consulte a un médico antes de cualquier cambio de dieta.',
      placeholderText: 'Ingrese sus datos biométricos para calcular su déficit calórico diario.',
      unitWeight: 'kg',
      unitHeight: 'cm',
    },
    pt: {
      title: 'Calculadora de Déficit Calórico',
      subtitle: 'Calcule sua BMR, TDEE e ingestão diária ideal para perda de peso saudável',
      gender: 'Gênero',
      male: 'Masculino',
      female: 'Feminino',
      age: 'Idade (anos)',
      height: 'Altura (cm)',
      weight: 'Peso (kg)',
      bodyFat: 'Gordura Corporal (% - Opcional)',
      activityLevel: 'Nível de Atividade',
      deficitMode: 'Configuração do Déficit',
      byValue: 'Déficit Calórico Fixo',
      byPercent: 'Porcentagem de TDEE',
      byRate: 'Meta de Perda Semanal',
      deficitKcal: 'Déficit Calórico Diário (kcal)',
      deficitPercent: 'Porcentagem do Déficit (%)',
      lossGoal: 'Perda Semanal',
      bmr: 'Taxa Metabólica Basal (BMR)',
      tdee: 'Gasto Energético Diário (TDEE)',
      targetIntake: 'Ingestão Diária Meta',
      weeklyLoss: 'Perda Semanal Estimada',
      safetyWarning: '⚠️ Alerta de Segurança: A ingestão caiu abaixo do limite de {limit} kcal! Ajustado ao mínimo seguro.',
      sedentary: 'Sedentário (Pouco ou nenhum exercício)',
      light: 'Levemente Ativo (Exercício 1-3 dias/semana)',
      moderate: 'Moderadamente Ativo (Exercício 3-5 dias/semana)',
      active: 'Muito Ativo (Exercício 6-7 dias/semana)',
      extreme: 'Super Ativo (Trabalho pesado / Atleta)',
      copied: 'Copiado!',
      copyResult: 'Copiar Resultado',
      formula: 'Fórmula',
      formulaText: 'BMR = 10×Peso + 6.25×Altura - 5×Idade + ajuste',
      disclaimer: 'Apenas para fins informativos. Consulte um nutricionista antes de alterar sua dieta.',
      placeholderText: 'Insira seus dados biométricos e nível de atividade para calcular seu déficit.',
      unitWeight: 'kg',
      unitHeight: 'cm',
    },
    ja: {
      title: 'カロリー赤字計算シミュレーター',
      subtitle: '基礎代謝量 (BMR)、1日の総消費カロリー (TDEE)、および健康的な減量のための摂取目標を計算します',
      gender: '性別',
      male: '男性',
      female: '女性',
      age: '年齢 (歳)',
      height: '身長 (cm)',
      weight: '体重 (kg)',
      bodyFat: '体脂肪率 (% - 任意)',
      activityLevel: '日常の活動レベル',
      deficitMode: 'カロリー赤字設定',
      byValue: '固定カロリー赤字',
      byPercent: 'TDEEの割合 (%)',
      byRate: '週の減量目標から算出',
      deficitKcal: '1日のカロリー赤字 (kcal)',
      deficitPercent: '赤字比率 (%)',
      lossGoal: '週の減量ペース',
      bmr: '基礎代謝量 (BMR)',
      tdee: '1日の総消費カロリー (TDEE)',
      targetIntake: '1日の摂取目標カロリー',
      weeklyLoss: '予想される週の減量幅',
      safetyWarning: '⚠️ 安全上の警告：摂取カロリー目標が安全基準の {limit} kcal を下回っています！健康のため安全値に調整されました。',
      sedentary: 'ほぼ運動しない (デスクワーク)',
      light: '軽い活動 (週に1〜3日程度の運動)',
      moderate: '中程度の活動 (週に3〜5日程度の運動)',
      active: '活発な活動 (週に6〜7日程度のハードな運動)',
      extreme: '非常に活発 (重労働またはプロのアスリート)',
      copied: 'コピーしました！',
      copyResult: '結果をコピー',
      formula: '計算式',
      formulaText: 'BMR = 10×体重 + 6.25×身長 - 5×年齢 + 調整値',
      disclaimer: '本ツールは推定値のみを提供します。食事療法を開始する前に医師に相談してください。',
      placeholderText: '身体データと活動レベルを入力して、カロリー目標を計算します。',
      unitWeight: 'kg',
      unitHeight: 'cm',
    },
    fr: {
      title: 'Calculateur de Déficit Calorique',
      subtitle: 'Calculez votre BMR, TDEE et l\'apport calorique ciblé pour une perte de poids saine',
      gender: 'Genre',
      male: 'Homme',
      female: 'Femme',
      age: 'Âge (ans)',
      height: 'Taille (cm)',
      weight: 'Poids (kg)',
      bodyFat: 'Masse Grasse (% - Optionnel)',
      activityLevel: 'Activité Quotidienne',
      deficitMode: 'Réglage du Déficit',
      byValue: 'Déficit Calorique Fixe',
      byPercent: 'Pourcentage du TDEE',
      byRate: 'Objectif de Perte Hebdomadaire',
      deficitKcal: 'Déficit Calorique Quotidien (kcal)',
      deficitPercent: 'Pourcentage de Déficit (%)',
      lossGoal: 'Perte Hebdomadaire',
      bmr: 'Taux Métabolique Basal (BMR)',
      tdee: 'Dépense Énergétique Journalière (TDEE)',
      targetIntake: 'Apport Journalier Ciblé',
      weeklyLoss: 'Perte Hebdomadaire Estimée',
      safetyWarning: '⚠️ Alerte de Sécurité: L\'apport ciblé est inférieur à la limite de {limit} kcal! Ajusté au minimum requis.',
      sedentary: 'Sédentaire (Peu ou pas d\'exercice)',
      light: 'Légèrement Actif (Exercice 1-3 jours/semaine)',
      moderate: 'Modérément Actif (Exercice 3-5 jours/semaine)',
      active: 'Très Actif (Exercice 6-7 jours/semaine)',
      extreme: 'Extrêmement Actif (Travail physique / Athlète)',
      copied: 'Copié !',
      copyResult: 'Copier le Résultat',
      formula: 'Formule',
      formulaText: 'BMR = 10×Poids + 6.25×Taille - 5×Âge + décalage',
      disclaimer: 'Données indicatives. Consultez un médecin avant d\'entreprendre un changement de régime alimentaire.',
      placeholderText: 'Saisissez vos données pour calculer votre déficit calorique quotidien.',
      unitWeight: 'kg',
      unitHeight: 'cm',
    },
    de: {
      title: 'Kaloriendefizit-Rechner',
      subtitle: 'Berechnen Sie BMR, TDEE und die optimale tägliche Kalorienzufuhr für gesundes Abnehmen',
      gender: 'Geschlecht',
      male: 'Männlich',
      female: 'Weiblich',
      age: 'Alter (Jahre)',
      height: 'Größe (cm)',
      weight: 'Gewicht (kg)',
      bodyFat: 'Körperfettanteil (% - Optional)',
      activityLevel: 'Aktivitätslevel',
      deficitMode: 'Defizit-Einstellung',
      byValue: 'Festes Kaloriendefizit',
      byPercent: 'Prozentual von TDEE',
      byRate: 'Gewichtsverlust pro Woche',
      deficitKcal: 'Tägliches Kaloriendefizit (kcal)',
      deficitPercent: 'Defizitanteil (%)',
      lossGoal: 'Wöchentliches Ziel',
      bmr: 'Grundumsatz (BMR)',
      tdee: 'Gesamtenergieumsatz (TDEE)',
      targetIntake: 'Tägliche Zielzufuhr',
      weeklyLoss: 'Geschätzter Gewichtsverlust/Woche',
      safetyWarning: '⚠️ Warnung: Die Zielzufuhr liegt unter der Sicherheitsgrenze von {limit} kcal! Auf Mindestwert begrenzt.',
      sedentary: 'Sitzend (Kaum oder kein Sport)',
      light: 'Leicht Aktiv (Sport 1-3 Tage/Woche)',
      moderate: 'Moderat Aktiv (Sport 3-5 Tage/Woche)',
      active: 'Sehr Aktiv (Sport 6-7 Tage/Woche)',
      extreme: 'Extrem Aktiv (Schwere Arbeit / Leistungssport)',
      copied: 'Kopiert!',
      copyResult: 'Ergebnis kopieren',
      formula: 'Formel',
      formulaText: 'BMR = 10×Gewicht + 6.25×Größe - 5×Alter + Differenz',
      disclaimer: 'Nur zu Informationszwecken. Konsultieren Sie vor Diäten qualifizierte Fachkräfte.',
      placeholderText: 'Geben Sie Ihre biometrischen Daten ein, um Ihr Defizit zu berechnen.',
      unitWeight: 'kg',
      unitHeight: 'cm',
    },
    ar: {
      title: 'حاسبة عجز السعرات الحرارية',
      subtitle: 'احسب معدل الأيض الأساسي (BMR)، وإجمالي حرق الطاقة (TDEE)، والسعرات المستهدفة لخسارة وزن صحية',
      gender: 'الجنس',
      male: 'ذكر',
      female: 'أنثى',
      age: 'العمر (بالسنوات)',
      height: 'الطول (سم)',
      weight: 'الوزن (كجم)',
      bodyFat: 'نسبة الدهون (% - اختياري)',
      activityLevel: 'مستوى النشاط اليومي',
      deficitMode: 'إعداد العجز',
      byValue: 'عجز سعرات ثابت',
      byPercent: 'نسبة من TDEE',
      byRate: 'معدل خسارة الوزن الأسبوعي',
      deficitKcal: 'عجز السعرات اليومي (سعرة)',
      deficitPercent: 'نسبة العجز (%)',
      lossGoal: 'الهدف الأسبوعي',
      bmr: 'معدل الأيض الأساسي (BMR)',
      tdee: 'إجمالي الطاقة اليومية (TDEE)',
      targetIntake: 'السعرات اليومية المستهدفة',
      weeklyLoss: 'معدل الخسارة الأسبوعي المتوقع',
      safetyWarning: '⚠️ تحذير سلامة: السعرات المستهدفة تقل عن الحد الآمن {limit} سعرة! تم تعديلها للحد الأدنى لحمايتك.',
      sedentary: 'خامل (نشاط بسيط أو بدون رياضة)',
      light: 'نشاط خفيف (رياضة 1-3 أيام/أسبوع)',
      moderate: 'نشاط متوسط (رياضة 3-5 أيام/أسبوع)',
      active: 'نشط جداً (رياضة 6-7 أيام/أسبوع)',
      extreme: 'نشاط فائق (عمل شاق / رياضي محترف)',
      copied: 'تم النسخ!',
      copyResult: 'نسخ النتيجة',
      formula: 'المعادلة',
      formulaText: 'BMR = 10×الوزن + 6.25×الطول - 5×العمر + الفارق',
      disclaimer: 'لأغراض إرشادية فقط. استشر خبيراً قبل تطبيق نظام غذائي شديد.',
      placeholderText: 'أدخل قياساتك الحيوية ومستوى نشاطك لحساب عجز السعرات اليومي.',
      unitWeight: 'كجم',
      unitHeight: 'سم',
    },
    ko: {
      title: '칼로리 적자 계산기',
      subtitle: '기초대사량 (BMR), 일일 총에너지소비량 (TDEE) 및 감량을 위한 목표 일일 칼로리 섭취량을 계산합니다',
      gender: '성별',
      male: '남성',
      female: '여성',
      age: '나이 (세)',
      height: '신장 (cm)',
      weight: '체중 (kg)',
      bodyFat: '체지방률 (% - 선택)',
      activityLevel: '일일 활동 수준',
      deficitMode: '적자 설정 방식',
      byValue: '고정 칼로리 적자',
      byPercent: 'TDEE 비율 (%)',
      byRate: '주당 감량 목표치 기준',
      deficitKcal: '일일 칼로리 적자 (kcal)',
      deficitPercent: '적자 비율 (%)',
      lossGoal: '주당 감량 목표',
      bmr: '기초대사량 (BMR)',
      tdee: '일일 총에너지소비량 (TDEE)',
      targetIntake: '목표 일일 섭취량',
      weeklyLoss: '예상 주당 체중 감량',
      safetyWarning: '⚠️ 안전 경고: 목표 섭취량이 안전 한계인 {limit} kcal 미만입니다! 안전을 위해 최소 기준치로 보정되었습니다.',
      sedentary: '활동량 적음 (운동 안 함)',
      light: '가벼운 활동 (주 1~3일 운동)',
      moderate: '보통 활동 (주 3~5일 운동)',
      active: '많은 활동 (주 6~7일 하드 트레이닝)',
      extreme: '매우 많은 활동 (운동선수 / 격한 노동)',
      copied: '복사 완료!',
      copyResult: '결과 복사',
      formula: '수식',
      formulaText: 'BMR = 10×체중 + 6.25×신장 - 5×나이 + 성별 편차',
      disclaimer: '추정치 정보입니다. 다이어트를 본격 시작하기 전 의사 등 전문가와 상의하십시오.',
      placeholderText: '신체 정보와 활동량 데이터를 입력하여 칼로리 목표를 알아보세요.',
      unitWeight: 'kg',
      unitHeight: 'cm',
    },
    ru: {
      title: 'Калькулятор дефицита калорий',
      subtitle: 'Расчет BMR, TDEE и целевого суточного потребления для здорового снижения веса',
      gender: 'Пол',
      male: 'Мужской',
      female: 'Женский',
      age: 'Возраст (лет)',
      height: 'Рост (см)',
      weight: 'Вес (кг)',
      bodyFat: 'Процент жира (% - опционально)',
      activityLevel: 'Физическая активность',
      deficitMode: 'Режим дефицита',
      byValue: 'Фиксированный дефицит',
      byPercent: 'Процент от TDEE',
      byRate: 'Целевая потеря веса в неделю',
      deficitKcal: 'Дневной дефицит калорий (ккал)',
      deficitPercent: 'Процент дефицита (%)',
      lossGoal: 'Снижение веса в неделю',
      bmr: 'Базальный метаболизм (BMR)',
      tdee: 'Общий расход энергии (TDEE)',
      targetIntake: 'Целевое суточное потребление',
      weeklyLoss: 'Ожидаемая потеря веса в неделю',
      safetyWarning: '⚠️ Предупреждение: Целевое потребление ниже безопасного предела в {limit} ккал! Ограничено минимумом.',
      sedentary: 'Сидячий (Нет физических нагрузок)',
      light: 'Легкий (Занятия спортом 1-3 дня в неделю)',
      moderate: 'Умеренный (Занятия спортом 3-5 дней в неделю)',
      active: 'Активный (Занятия спортом 6-7 дней в неделю)',
      extreme: 'Экстремальный (Тяжелый труд / Проф. спортсмен)',
      copied: 'Скопировано!',
      copyResult: 'Скопировать результат',
      formula: 'Формула',
      formulaText: 'BMR = 10×Вес + 6.25×Рост - 5×Возраст + коэффициент',
      disclaimer: 'Данные носят ориентировочный характер. Проконсультируйтесь с врачом перед началом диеты.',
      placeholderText: 'Введите ваши биометрические данные и уровень активности для расчета дефицита.',
      unitWeight: 'кг',
      unitHeight: 'см',
    },
  };

  const l = $derived(I18N_BACKUP[locale] || I18N_BACKUP['en']);

  let gender = $state('male');
  let weight = $state('70');
  let height = $state('175');
  let age = $state('30');
  let bodyFat = $state('');
  let activityLevel = $state('moderate');
  let deficitMode = $state('value'); // value | percent | rate
  let deficitValue = $state('500');
  let deficitPercent = $state('20');
  let weeklyLossGoal = $state('0.5'); // in kg

  let currency = $state('USD');

  const result = $derived((() => {
    const w = parseFloat(weight) || 0;
    const h = parseFloat(height) || 0;
    const a = parseFloat(age) || 0;
    const bf = bodyFat !== '' ? (parseFloat(bodyFat) || 0) : undefined;
    const dv = parseFloat(deficitValue) || 0;
    const dp = parseFloat(deficitPercent) || 0;
    const wg = parseFloat(weeklyLossGoal) || 0;

    if (w <= 0 || h <= 0 || a <= 0) return null;

    const calcInput: any = {
      gender,
      weightKg: w,
      heightCm: h,
      ageYears: a,
      activityLevel,
      deficitMode,
    };

    if (bf !== undefined) calcInput.bodyFatPercent = bf;

    if (deficitMode === 'value') {
      calcInput.deficitValue = dv;
    } else if (deficitMode === 'percent') {
      calcInput.deficitPercent = dp;
    } else if (deficitMode === 'rate') {
      // Treat goal as kg
      calcInput.weeklyRateGoalKg = wg;
    }

    const res = calculateCalorieDeficit(calcInput);

    return {
      ...res,
      w,
      h,
      a,
      bf,
      dv,
      dp,
      wg,
    };
  })());

  let copied = $state(false);
  function copyResult() {
    if (!result) return;
    let text = `${l.title}\n`;
    text += `${l.gender}: ${l[gender]}\n`;
    text += `${l.weight}: ${result.w} ${l.unitWeight}\n`;
    text += `${l.height}: ${result.h} ${l.unitHeight}\n`;
    text += `${l.age}: ${result.a}\n`;
    if (result.bf !== undefined) text += `${l.bodyFat}: ${result.bf}%\n`;
    text += `${l.activityLevel}: ${l[activityLevel]}\n`;
    text += `-------------------\n`;
    text += `${l.bmr}: ${Math.round(result.bmr)} kcal\n`;
    text += `${l.tdee}: ${Math.round(result.tdee)} kcal\n`;
    text += `${l.deficitKcal.replace(' (kcal)', '')}: ${Math.round(result.deficit)} kcal\n`;
    text += `${l.targetIntake}: ${Math.round(result.targetIntake)} kcal\n`;
    text += `${l.weeklyLoss}: ${result.weeklyWeightLossKg.toFixed(2)} ${l.unitWeight}\n`;

    navigator.clipboard.writeText(text).then(() => {
      copied = true;
      setTimeout(() => (copied = false), 1800);
    });
  }
</script>

<div class="bg-stone-950 text-stone-100 p-6 rounded-2xl border border-stone-800 shadow-2xl font-sans min-h-[400px]">
  <!-- Header -->
  <div class="flex items-center gap-3 mb-6">
    <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-400 to-orange-700 flex items-center justify-center text-stone-950 font-black text-lg">
      🔥
    </div>
    <div>
      <h2 class="font-extrabold text-lg bg-gradient-to-r from-orange-300 via-orange-100 to-orange-400 bg-clip-text text-transparent leading-tight">
        {l.title}
      </h2>
      <p class="text-stone-500 text-xs mt-0.5">{l.subtitle}</p>
    </div>
  </div>

  <!-- Content Grid -->
  <div class="grid grid-cols-1 md:grid-cols-12 gap-6">
    <!-- Left Panel: Inputs (span 5) -->
    <div class="md:col-span-5 space-y-4">
      <div>
        <span class="text-xs text-stone-400 mb-1.5 block">{l.gender}</span>
        <div class="grid grid-cols-2 gap-2">
          <button
            type="button"
            onclick={() => (gender = 'male')}
            class="py-2 text-xs font-semibold rounded-lg border transition-all {gender === 'male' ? 'bg-orange-950/40 border-orange-600 text-orange-400' : 'bg-stone-900 border-stone-800 text-stone-400 hover:border-stone-700'}"
          >
            {l.male}
          </button>
          <button
            type="button"
            onclick={() => (gender = 'female')}
            class="py-2 text-xs font-semibold rounded-lg border transition-all {gender === 'female' ? 'bg-orange-950/40 border-orange-600 text-orange-400' : 'bg-stone-900 border-stone-800 text-stone-400 hover:border-stone-700'}"
          >
            {l.female}
          </button>
        </div>
      </div>

      <div class="grid grid-cols-3 gap-2">
        <label class="block">
          <span class="text-xs text-stone-400 mb-1.5 block">{l.age}</span>
          <input
            type="number"
            bind:value={age}
            min="1"
            max="120"
            class="w-full bg-stone-900 border border-stone-700 rounded-lg px-2.5 py-2 text-sm text-stone-100 focus:border-orange-500 focus:outline-none transition-colors"
          />
        </label>

        <label class="block">
          <span class="text-xs text-stone-400 mb-1.5 block">{l.height}</span>
          <input
            type="number"
            bind:value={height}
            min="50"
            max="250"
            class="w-full bg-stone-900 border border-stone-700 rounded-lg px-2.5 py-2 text-sm text-stone-100 focus:border-orange-500 focus:outline-none transition-colors"
          />
        </label>

        <label class="block">
          <span class="text-xs text-stone-400 mb-1.5 block">{l.weight}</span>
          <input
            type="number"
            bind:value={weight}
            min="10"
            max="300"
            class="w-full bg-stone-900 border border-stone-700 rounded-lg px-2.5 py-2 text-sm text-stone-100 focus:border-orange-500 focus:outline-none transition-colors"
          />
        </label>
      </div>

      <div class="grid grid-cols-2 gap-3">
        <label class="block">
          <span class="text-xs text-stone-400 mb-1.5 block">{l.bodyFat}</span>
          <input
            type="number"
            bind:value={bodyFat}
            min="2"
            max="70"
            placeholder="e.g. 15"
            class="w-full bg-stone-900 border border-stone-700 rounded-lg px-2.5 py-2 text-sm text-stone-100 focus:border-orange-500 focus:outline-none transition-colors"
          />
        </label>

        <label class="block">
          <span class="text-xs text-stone-400 mb-1.5 block">{l.activityLevel}</span>
          <select
            bind:value={activityLevel}
            class="w-full bg-stone-900 border border-stone-700 rounded-lg px-2.5 py-2.5 text-xs text-stone-200 cursor-pointer focus:border-orange-500 focus:outline-none transition-colors"
          >
            <option value="sedentary">{l.sedentary}</option>
            <option value="light">{l.light}</option>
            <option value="moderate">{l.moderate}</option>
            <option value="active">{l.active}</option>
            <option value="extreme">{l.extreme}</option>
          </select>
        </label>
      </div>

      <!-- Deficit Setting -->
      <div class="border-t border-stone-850 pt-4 space-y-3">
        <span class="text-xs text-stone-400 mb-1.5 block">{l.deficitMode}</span>
        <div class="grid grid-cols-3 gap-1.5">
          {#each ['value', 'percent', 'rate'] as m}
            <button
              type="button"
              onclick={() => (deficitMode = m)}
              class="py-1.5 text-xxs font-bold rounded-lg border transition-all {deficitMode === m ? 'bg-orange-950/40 border-orange-600 text-orange-400' : 'bg-stone-900 border-stone-800 text-stone-400 hover:border-stone-700'}"
            >
              {#if m === 'value'}{l.byValue}{:else if m === 'percent'}{l.byPercent}{:else}{l.byRate}{/if}
            </button>
          {/each}
        </div>

        {#if deficitMode === 'value'}
          <label class="block">
            <span class="text-xs text-stone-400 mb-1 block">{l.deficitKcal}</span>
            <input
              type="number"
              bind:value={deficitValue}
              min="0"
              max="2000"
              step="50"
              class="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-2 text-sm text-stone-100 focus:border-orange-500 focus:outline-none transition-colors"
            />
          </label>
        {:else if deficitMode === 'percent'}
          <label class="block">
            <span class="text-xs text-stone-400 mb-1 block">{l.deficitPercent}</span>
            <input
              type="number"
              bind:value={deficitPercent}
              min="0"
              max="50"
              step="1"
              class="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-2 text-sm text-stone-100 focus:border-orange-500 focus:outline-none transition-colors"
            />
          </label>
        {:else}
          <label class="block">
            <span class="text-xs text-stone-400 mb-1 block">{l.lossGoal} ({l.unitWeight}/week)</span>
            <input
              type="number"
              bind:value={weeklyLossGoal}
              min="0.1"
              max="2"
              step="0.05"
              class="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-2 text-sm text-stone-100 focus:border-orange-500 focus:outline-none transition-colors"
            />
          </label>
        {/if}
      </div>
    </div>

    <!-- Right Panel: Results (span 7) -->
    <div class="md:col-span-7 flex flex-col justify-between space-y-4">
      {#if result}
        <div class="space-y-4">
          <!-- Big Target Intake Display -->
          <div class="rounded-xl p-5 bg-orange-950/20 border border-orange-850/30 text-center relative overflow-hidden">
            <div class="absolute -right-6 -bottom-6 text-7xl opacity-5 select-none">🔥</div>
            <p class="text-xs text-stone-450 mb-1">{l.targetIntake}</p>
            <p class="text-5xl font-black text-orange-400 tracking-tight">
              {Math.round(result.targetIntake)} <span class="text-lg font-bold">kcal/day</span>
            </p>
            <p class="text-xs text-stone-500 mt-2">
              {l.weeklyLoss}: <span class="text-orange-350 font-semibold">{result.weeklyWeightLossKg.toFixed(2)} {l.unitWeight}</span> ({result.weeklyWeightLossLbs.toFixed(2)} lbs)
            </p>
          </div>

          <!-- Unsafe Diet warning -->
          {#if !result.isSafe}
            <div class="bg-red-950/40 border border-red-800/40 rounded-xl p-3 text-red-400 text-xs leading-relaxed">
              {l.safetyWarning.replace('{limit}', String(result.safeLimit))}
            </div>
          {/if}

          <!-- Detailed metrics list -->
          <div class="bg-stone-900 border border-stone-800 rounded-xl p-4 space-y-3">
            <div class="flex items-center justify-between text-xs">
              <span class="text-stone-400">{l.bmr}</span>
              <span class="text-stone-200 font-bold">{Math.round(result.bmr)} kcal</span>
            </div>
            <div class="flex items-center justify-between text-xs">
              <span class="text-stone-400">{l.tdee}</span>
              <span class="text-stone-200 font-bold">{Math.round(result.tdee)} kcal</span>
            </div>
            <div class="flex items-center justify-between text-xs border-t border-stone-850 pt-2">
              <span class="text-stone-400">{l.deficitKcal.replace(' (kcal)', '')}</span>
              <span class="text-orange-400 font-bold">-{Math.round(result.deficit)} kcal</span>
            </div>
          </div>
        </div>

        <!-- Copy button -->
        <div class="flex items-center gap-3 pt-4 border-t border-stone-900">
          <button
            type="button"
            onclick={copyResult}
            class="flex-1 bg-stone-900 hover:bg-stone-850 border border-stone-800 text-stone-200 hover:text-stone-100 text-xs font-semibold py-2.5 px-4 rounded-lg transition-all flex items-center justify-center gap-2"
          >
            {#if copied}
              <span class="text-orange-400">{l.copied}</span>
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
      <div class="space-y-2 text-xxs text-stone-650 mt-auto pt-4">
        <div class="bg-stone-950 p-2.5 rounded-lg border border-stone-900/80">
          <span class="font-bold text-stone-500">{l.formula}: </span>
          <span class="font-mono text-stone-450">{l.formulaText}</span>
        </div>
        <p class="text-center leading-relaxed">{l.disclaimer}</p>
      </div>
    </div>
  </div>
</div>

<style>
  .text-xxs {
    font-size: 0.65rem;
  }
</style>
