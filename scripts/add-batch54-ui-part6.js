const fs = require('fs');
const path = require('path');

const locales = ['en', 'zh', 'ja', 'ko', 'es', 'pt', 'fr', 'de', 'ru', 'ar'];

// Batch 54 UI translations - Part 6
const translations = {
  'changelog-generator-advanced': {
    en: { addRelease: '+ Add Release', noEntriesYet: 'No entries yet', addEntry: '+ Add Entry', generatedChangelog: 'Generated Changelog', keepAChangelog: 'Keep a Changelog', conventional: 'Conventional', simple: 'Simple' },
    zh: { addRelease: '+ 添加版本', noEntriesYet: '暂无条目', addEntry: '+ 添加条目', generatedChangelog: '生成的更新日志', keepAChangelog: 'Keep a Changelog', conventional: '约定式', simple: '简单' },
    ja: { addRelease: '+ リリース追加', noEntriesYet: 'エントリーなし', addEntry: '+ エントリー追加', generatedChangelog: '生成された変更履歴', keepAChangelog: 'Keep a Changelog', conventional: 'Conventional', simple: 'シンプル' },
    ko: { addRelease: '+ 릴리스 추가', noEntriesYet: '항목 없음', addEntry: '+ 항목 추가', generatedChangelog: '생성된 변경 로그', keepAChangelog: 'Keep a Changelog', conventional: 'Conventional', simple: '간단' },
    es: { addRelease: '+ Agregar versión', noEntriesYet: 'Sin entradas aún', addEntry: '+ Agregar entrada', generatedChangelog: 'Changelog generado', keepAChangelog: 'Keep a Changelog', conventional: 'Convencional', simple: 'Simple' },
    pt: { addRelease: '+ Adicionar versão', noEntriesYet: 'Sem entradas ainda', addEntry: '+ Adicionar entrada', generatedChangelog: 'Changelog gerado', keepAChangelog: 'Keep a Changelog', conventional: 'Convencional', simple: 'Simples' },
    fr: { addRelease: '+ Ajouter version', noEntriesYet: 'Aucune entrée', addEntry: '+ Ajouter entrée', generatedChangelog: 'Changelog généré', keepAChangelog: 'Keep a Changelog', conventional: 'Conventionnel', simple: 'Simple' },
    de: { addRelease: '+ Release hinzufügen', noEntriesYet: 'Noch keine Einträge', addEntry: '+ Eintrag hinzufügen', generatedChangelog: 'Generiertes Changelog', keepAChangelog: 'Keep a Changelog', conventional: 'Konventionell', simple: 'Einfach' },
    ru: { addRelease: '+ Добавить релиз', noEntriesYet: 'Пока нет записей', addEntry: '+ Добавить запись', generatedChangelog: 'Сгенерированный changelog', keepAChangelog: 'Keep a Changelog', conventional: 'Conventional', simple: 'Простой' },
    ar: { addRelease: '+ إضافة إصدار', noEntriesYet: 'لا توجد إدخالات بعد', addEntry: '+ إضافة إدخال', generatedChangelog: 'سجل التغييرات المُنشأ', keepAChangelog: 'Keep a Changelog', conventional: 'تقليدي', simple: 'بسيط' }
  },
  'citation-formatter': {
    en: { formattedCitation: 'Formatted Citation' },
    zh: { formattedCitation: '格式化引用' },
    ja: { formattedCitation: 'フォーマット済み引用' },
    ko: { formattedCitation: '포맷된 인용' },
    es: { formattedCitation: 'Cita formateada' },
    pt: { formattedCitation: 'Citação formatada' },
    fr: { formattedCitation: 'Citation formatée' },
    de: { formattedCitation: 'Formatiertes Zitat' },
    ru: { formattedCitation: 'Отформатированная цитата' },
    ar: { formattedCitation: 'الاقتباس المنسق' }
  },
  'code-duplication-finder': {
    en: { minLines: 'Min lines', totalLines: 'Total Lines', duplicateLines: 'Duplicate Lines', duplication: 'Duplication', foundDuplicateBlocks: 'Found {count} Duplicate Block(s)', lines: 'lines', occurrences: 'occurrences', linesLabel: 'Lines', refactoringSuggestions: 'Refactoring Suggestions', tip1: 'Extract duplicate code into reusable functions', tip2: 'Consider using higher-order functions or composition', tip3: 'Create utility modules for common patterns', noDuplicationFound: 'No significant code duplication found!' },
    zh: { minLines: '最小行数', totalLines: '总行数', duplicateLines: '重复行数', duplication: '重复率', foundDuplicateBlocks: '发现 {count} 个重复代码块', lines: '行', occurrences: '次出现', linesLabel: '行', refactoringSuggestions: '重构建议', tip1: '将重复代码提取为可复用函数', tip2: '考虑使用高阶函数或组合', tip3: '为常见模式创建工具模块', noDuplicationFound: '未发现明显的代码重复！' },
    ja: { minLines: '最小行数', totalLines: '総行数', duplicateLines: '重複行数', duplication: '重複率', foundDuplicateBlocks: '{count}個の重複ブロックを発見', lines: '行', occurrences: '回出現', linesLabel: '行', refactoringSuggestions: 'リファクタリング提案', tip1: '重複コードを再利用可能な関数に抽出', tip2: '高階関数やコンポジションの使用を検討', tip3: '共通パターン用のユーティリティモジュールを作成', noDuplicationFound: '重大なコード重複は見つかりませんでした！' },
    ko: { minLines: '최소 줄 수', totalLines: '총 줄 수', duplicateLines: '중복 줄 수', duplication: '중복률', foundDuplicateBlocks: '{count}개의 중복 블록 발견', lines: '줄', occurrences: '회 발생', linesLabel: '줄', refactoringSuggestions: '리팩토링 제안', tip1: '중복 코드를 재사용 가능한 함수로 추출', tip2: '고차 함수나 컴포지션 사용 고려', tip3: '공통 패턴을 위한 유틸리티 모듈 생성', noDuplicationFound: '중요한 코드 중복이 발견되지 않았습니다!' },
    es: { minLines: 'Líneas mín', totalLines: 'Líneas totales', duplicateLines: 'Líneas duplicadas', duplication: 'Duplicación', foundDuplicateBlocks: 'Se encontraron {count} bloque(s) duplicado(s)', lines: 'líneas', occurrences: 'ocurrencias', linesLabel: 'Líneas', refactoringSuggestions: 'Sugerencias de refactorización', tip1: 'Extraer código duplicado en funciones reutilizables', tip2: 'Considerar usar funciones de orden superior o composición', tip3: 'Crear módulos de utilidad para patrones comunes', noDuplicationFound: '¡No se encontró duplicación de código significativa!' },
    pt: { minLines: 'Linhas mín', totalLines: 'Linhas totais', duplicateLines: 'Linhas duplicadas', duplication: 'Duplicação', foundDuplicateBlocks: 'Encontrado(s) {count} bloco(s) duplicado(s)', lines: 'linhas', occurrences: 'ocorrências', linesLabel: 'Linhas', refactoringSuggestions: 'Sugestões de refatoração', tip1: 'Extrair código duplicado em funções reutilizáveis', tip2: 'Considerar usar funções de ordem superior ou composição', tip3: 'Criar módulos utilitários para padrões comuns', noDuplicationFound: 'Nenhuma duplicação de código significativa encontrada!' },
    fr: { minLines: 'Lignes min', totalLines: 'Lignes totales', duplicateLines: 'Lignes dupliquées', duplication: 'Duplication', foundDuplicateBlocks: '{count} bloc(s) dupliqué(s) trouvé(s)', lines: 'lignes', occurrences: 'occurrences', linesLabel: 'Lignes', refactoringSuggestions: 'Suggestions de refactorisation', tip1: 'Extraire le code dupliqué en fonctions réutilisables', tip2: 'Envisager d\'utiliser des fonctions d\'ordre supérieur ou la composition', tip3: 'Créer des modules utilitaires pour les patterns communs', noDuplicationFound: 'Aucune duplication de code significative trouvée !' },
    de: { minLines: 'Min Zeilen', totalLines: 'Gesamtzeilen', duplicateLines: 'Doppelte Zeilen', duplication: 'Duplizierung', foundDuplicateBlocks: '{count} doppelte(r) Block/Blöcke gefunden', lines: 'Zeilen', occurrences: 'Vorkommen', linesLabel: 'Zeilen', refactoringSuggestions: 'Refactoring-Vorschläge', tip1: 'Doppelten Code in wiederverwendbare Funktionen extrahieren', tip2: 'Höhere Funktionen oder Komposition in Betracht ziehen', tip3: 'Utility-Module für häufige Muster erstellen', noDuplicationFound: 'Keine signifikante Code-Duplizierung gefunden!' },
    ru: { minLines: 'Мин строк', totalLines: 'Всего строк', duplicateLines: 'Дублирующихся строк', duplication: 'Дублирование', foundDuplicateBlocks: 'Найдено {count} дублирующихся блоков', lines: 'строк', occurrences: 'вхождений', linesLabel: 'Строки', refactoringSuggestions: 'Предложения по рефакторингу', tip1: 'Извлечь дублирующийся код в переиспользуемые функции', tip2: 'Рассмотреть использование функций высшего порядка или композиции', tip3: 'Создать утилитарные модули для общих паттернов', noDuplicationFound: 'Значительного дублирования кода не обнаружено!' },
    ar: { minLines: 'الحد الأدنى للأسطر', totalLines: 'إجمالي الأسطر', duplicateLines: 'الأسطر المكررة', duplication: 'التكرار', foundDuplicateBlocks: 'تم العثور على {count} كتلة مكررة', lines: 'أسطر', occurrences: 'تكرارات', linesLabel: 'الأسطر', refactoringSuggestions: 'اقتراحات إعادة الهيكلة', tip1: 'استخراج الكود المكرر إلى دوال قابلة لإعادة الاستخدام', tip2: 'النظر في استخدام الدوال عالية الترتيب أو التركيب', tip3: 'إنشاء وحدات مساعدة للأنماط الشائعة', noDuplicationFound: 'لم يتم العثور على تكرار كود مهم!' }
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
