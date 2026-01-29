const fs = require('fs');
const path = require('path');

const locales = ['en', 'zh', 'ja', 'ko', 'es', 'pt', 'fr', 'de', 'ru', 'ar'];

// Translations for project-estimation-calculator
const translations = {
  'project-estimation-calculator': {
    en: { 
      hours: 'Hours', 
      days: 'Days', 
      weeks: 'Weeks', 
      addTask: '+ Add Task', 
      taskName: 'Task Name', 
      optimistic: 'Optimistic', 
      mostLikely: 'Most Likely', 
      pessimistic: 'Pessimistic', 
      expected: 'Expected', 
      expectedDuration: 'Expected Duration', 
      confidence68: '68% Confidence', 
      confidence95: '95% Confidence', 
      pertFormula: 'PERT Formula', 
      standardDeviation: 'Standard Deviation',
      hrs: 'hrs',
      wks: 'wks',
      taskDefault: 'Task'
    },
    zh: { 
      hours: '小时', 
      days: '天', 
      weeks: '周', 
      addTask: '+ 添加任务', 
      taskName: '任务名称', 
      optimistic: '乐观估计', 
      mostLikely: '最可能', 
      pessimistic: '悲观估计', 
      expected: '预期', 
      expectedDuration: '预期工期', 
      confidence68: '68% 置信区间', 
      confidence95: '95% 置信区间', 
      pertFormula: 'PERT 公式', 
      standardDeviation: '标准差',
      hrs: '小时',
      wks: '周',
      taskDefault: '任务'
    },
    ja: { 
      hours: '時間', 
      days: '日', 
      weeks: '週', 
      addTask: '+ タスク追加', 
      taskName: 'タスク名', 
      optimistic: '楽観的', 
      mostLikely: '最も可能性が高い', 
      pessimistic: '悲観的', 
      expected: '予想', 
      expectedDuration: '予想期間', 
      confidence68: '68% 信頼区間', 
      confidence95: '95% 信頼区間', 
      pertFormula: 'PERT 公式', 
      standardDeviation: '標準偏差',
      hrs: '時間',
      wks: '週',
      taskDefault: 'タスク'
    },
    ko: { 
      hours: '시간', 
      days: '일', 
      weeks: '주', 
      addTask: '+ 작업 추가', 
      taskName: '작업명', 
      optimistic: '낙관적', 
      mostLikely: '가장 가능성 높음', 
      pessimistic: '비관적', 
      expected: '예상', 
      expectedDuration: '예상 기간', 
      confidence68: '68% 신뢰 구간', 
      confidence95: '95% 신뢰 구간', 
      pertFormula: 'PERT 공식', 
      standardDeviation: '표준 편차',
      hrs: '시간',
      wks: '주',
      taskDefault: '작업'
    },
    es: { 
      hours: 'Horas', 
      days: 'Días', 
      weeks: 'Semanas', 
      addTask: '+ Agregar tarea', 
      taskName: 'Nombre de tarea', 
      optimistic: 'Optimista', 
      mostLikely: 'Más probable', 
      pessimistic: 'Pesimista', 
      expected: 'Esperado', 
      expectedDuration: 'Duración esperada', 
      confidence68: '68% de confianza', 
      confidence95: '95% de confianza', 
      pertFormula: 'Fórmula PERT', 
      standardDeviation: 'Desviación estándar',
      hrs: 'hrs',
      wks: 'sem',
      taskDefault: 'Tarea'
    },
    pt: { 
      hours: 'Horas', 
      days: 'Dias', 
      weeks: 'Semanas', 
      addTask: '+ Adicionar tarefa', 
      taskName: 'Nome da tarefa', 
      optimistic: 'Otimista', 
      mostLikely: 'Mais provável', 
      pessimistic: 'Pessimista', 
      expected: 'Esperado', 
      expectedDuration: 'Duração esperada', 
      confidence68: '68% de confiança', 
      confidence95: '95% de confiança', 
      pertFormula: 'Fórmula PERT', 
      standardDeviation: 'Desvio padrão',
      hrs: 'hrs',
      wks: 'sem',
      taskDefault: 'Tarefa'
    },
    fr: { 
      hours: 'Heures', 
      days: 'Jours', 
      weeks: 'Semaines', 
      addTask: '+ Ajouter tâche', 
      taskName: 'Nom de la tâche', 
      optimistic: 'Optimiste', 
      mostLikely: 'Plus probable', 
      pessimistic: 'Pessimiste', 
      expected: 'Attendu', 
      expectedDuration: 'Durée prévue', 
      confidence68: '68% de confiance', 
      confidence95: '95% de confiance', 
      pertFormula: 'Formule PERT', 
      standardDeviation: 'Écart-type',
      hrs: 'hrs',
      wks: 'sem',
      taskDefault: 'Tâche'
    },
    de: { 
      hours: 'Stunden', 
      days: 'Tage', 
      weeks: 'Wochen', 
      addTask: '+ Aufgabe hinzufügen', 
      taskName: 'Aufgabenname', 
      optimistic: 'Optimistisch', 
      mostLikely: 'Wahrscheinlichste', 
      pessimistic: 'Pessimistisch', 
      expected: 'Erwartet', 
      expectedDuration: 'Erwartete Dauer', 
      confidence68: '68% Konfidenz', 
      confidence95: '95% Konfidenz', 
      pertFormula: 'PERT-Formel', 
      standardDeviation: 'Standardabweichung',
      hrs: 'Std',
      wks: 'Wo',
      taskDefault: 'Aufgabe'
    },
    ru: { 
      hours: 'Часы', 
      days: 'Дни', 
      weeks: 'Недели', 
      addTask: '+ Добавить задачу', 
      taskName: 'Название задачи', 
      optimistic: 'Оптимистичная', 
      mostLikely: 'Наиболее вероятная', 
      pessimistic: 'Пессимистичная', 
      expected: 'Ожидаемая', 
      expectedDuration: 'Ожидаемая длительность', 
      confidence68: '68% доверительный интервал', 
      confidence95: '95% доверительный интервал', 
      pertFormula: 'Формула PERT', 
      standardDeviation: 'Стандартное отклонение',
      hrs: 'ч',
      wks: 'нед',
      taskDefault: 'Задача'
    },
    ar: { 
      hours: 'ساعات', 
      days: 'أيام', 
      weeks: 'أسابيع', 
      addTask: '+ إضافة مهمة', 
      taskName: 'اسم المهمة', 
      optimistic: 'متفائل', 
      mostLikely: 'الأكثر احتمالاً', 
      pessimistic: 'متشائم', 
      expected: 'المتوقع', 
      expectedDuration: 'المدة المتوقعة', 
      confidence68: '68% ثقة', 
      confidence95: '95% ثقة', 
      pertFormula: 'صيغة PERT', 
      standardDeviation: 'الانحراف المعياري',
      hrs: 'س',
      wks: 'أ',
      taskDefault: 'مهمة'
    }
  }
};

// Update all locale files
locales.forEach(locale => {
  const filePath = path.join(__dirname, '..', 'src', 'messages', `${locale}.json`);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  
  Object.entries(translations).forEach(([toolSlug, localeTranslations]) => {
    if (!data.tools[toolSlug]) {
      data.tools[toolSlug] = {};
    }
    Object.assign(data.tools[toolSlug], localeTranslations[locale]);
  });
  
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log(`Updated ${locale}.json`);
});

console.log('Done!');
