const fs = require('fs');
const path = require('path');

const locales = ['en', 'zh', 'ja', 'ko', 'es', 'pt', 'fr', 'de', 'ru', 'ar'];

// Batch 54 UI translations - Part 7
const translations = {
  'database-migration-generator': {
    en: { tableName: 'Table Name', database: 'Database', framework: 'Framework', action: 'Action', columns: 'Columns', addColumn: '+ Add Column', generatedMigration: 'Generated Migration', createTable: 'Create Table', alterTable: 'Alter Table', rawSql: 'Raw SQL', pk: 'PK', nullable: 'Null', unique: 'Unique' },
    zh: { tableName: '表名', database: '数据库', framework: '框架', action: '操作', columns: '列', addColumn: '+ 添加列', generatedMigration: '生成的迁移', createTable: '创建表', alterTable: '修改表', rawSql: '原始 SQL', pk: '主键', nullable: '可空', unique: '唯一' },
    ja: { tableName: 'テーブル名', database: 'データベース', framework: 'フレームワーク', action: 'アクション', columns: 'カラム', addColumn: '+ カラム追加', generatedMigration: '生成されたマイグレーション', createTable: 'テーブル作成', alterTable: 'テーブル変更', rawSql: '生SQL', pk: 'PK', nullable: 'Null', unique: 'ユニーク' },
    ko: { tableName: '테이블 이름', database: '데이터베이스', framework: '프레임워크', action: '작업', columns: '컬럼', addColumn: '+ 컬럼 추가', generatedMigration: '생성된 마이그레이션', createTable: '테이블 생성', alterTable: '테이블 수정', rawSql: 'Raw SQL', pk: 'PK', nullable: 'Null', unique: '유니크' },
    es: { tableName: 'Nombre de tabla', database: 'Base de datos', framework: 'Framework', action: 'Acción', columns: 'Columnas', addColumn: '+ Agregar columna', generatedMigration: 'Migración generada', createTable: 'Crear tabla', alterTable: 'Modificar tabla', rawSql: 'SQL crudo', pk: 'PK', nullable: 'Nulo', unique: 'Único' },
    pt: { tableName: 'Nome da tabela', database: 'Banco de dados', framework: 'Framework', action: 'Ação', columns: 'Colunas', addColumn: '+ Adicionar coluna', generatedMigration: 'Migração gerada', createTable: 'Criar tabela', alterTable: 'Alterar tabela', rawSql: 'SQL bruto', pk: 'PK', nullable: 'Nulo', unique: 'Único' },
    fr: { tableName: 'Nom de la table', database: 'Base de données', framework: 'Framework', action: 'Action', columns: 'Colonnes', addColumn: '+ Ajouter colonne', generatedMigration: 'Migration générée', createTable: 'Créer table', alterTable: 'Modifier table', rawSql: 'SQL brut', pk: 'PK', nullable: 'Null', unique: 'Unique' },
    de: { tableName: 'Tabellenname', database: 'Datenbank', framework: 'Framework', action: 'Aktion', columns: 'Spalten', addColumn: '+ Spalte hinzufügen', generatedMigration: 'Generierte Migration', createTable: 'Tabelle erstellen', alterTable: 'Tabelle ändern', rawSql: 'Rohes SQL', pk: 'PK', nullable: 'Null', unique: 'Einzigartig' },
    ru: { tableName: 'Имя таблицы', database: 'База данных', framework: 'Фреймворк', action: 'Действие', columns: 'Колонки', addColumn: '+ Добавить колонку', generatedMigration: 'Сгенерированная миграция', createTable: 'Создать таблицу', alterTable: 'Изменить таблицу', rawSql: 'Сырой SQL', pk: 'PK', nullable: 'Null', unique: 'Уникальный' },
    ar: { tableName: 'اسم الجدول', database: 'قاعدة البيانات', framework: 'الإطار', action: 'الإجراء', columns: 'الأعمدة', addColumn: '+ إضافة عمود', generatedMigration: 'الترحيل المُنشأ', createTable: 'إنشاء جدول', alterTable: 'تعديل جدول', rawSql: 'SQL خام', pk: 'PK', nullable: 'فارغ', unique: 'فريد' }
  },
  'database-schema-visualizer': {
    en: { sqlSchema: 'SQL Schema (CREATE TABLE statements)', schemaVisualization: 'Schema Visualization', tables: 'tables', relationships: 'Relationships', primaryKey: 'Primary Key', foreignKey: 'FK' },
    zh: { sqlSchema: 'SQL 架构 (CREATE TABLE 语句)', schemaVisualization: '架构可视化', tables: '个表', relationships: '关系', primaryKey: '主键', foreignKey: '外键' },
    ja: { sqlSchema: 'SQLスキーマ (CREATE TABLE文)', schemaVisualization: 'スキーマ可視化', tables: 'テーブル', relationships: 'リレーションシップ', primaryKey: '主キー', foreignKey: 'FK' },
    ko: { sqlSchema: 'SQL 스키마 (CREATE TABLE 문)', schemaVisualization: '스키마 시각화', tables: '테이블', relationships: '관계', primaryKey: '기본 키', foreignKey: 'FK' },
    es: { sqlSchema: 'Esquema SQL (sentencias CREATE TABLE)', schemaVisualization: 'Visualización del esquema', tables: 'tablas', relationships: 'Relaciones', primaryKey: 'Clave primaria', foreignKey: 'FK' },
    pt: { sqlSchema: 'Esquema SQL (instruções CREATE TABLE)', schemaVisualization: 'Visualização do esquema', tables: 'tabelas', relationships: 'Relacionamentos', primaryKey: 'Chave primária', foreignKey: 'FK' },
    fr: { sqlSchema: 'Schéma SQL (instructions CREATE TABLE)', schemaVisualization: 'Visualisation du schéma', tables: 'tables', relationships: 'Relations', primaryKey: 'Clé primaire', foreignKey: 'FK' },
    de: { sqlSchema: 'SQL-Schema (CREATE TABLE-Anweisungen)', schemaVisualization: 'Schema-Visualisierung', tables: 'Tabellen', relationships: 'Beziehungen', primaryKey: 'Primärschlüssel', foreignKey: 'FK' },
    ru: { sqlSchema: 'SQL-схема (операторы CREATE TABLE)', schemaVisualization: 'Визуализация схемы', tables: 'таблиц', relationships: 'Связи', primaryKey: 'Первичный ключ', foreignKey: 'FK' },
    ar: { sqlSchema: 'مخطط SQL (عبارات CREATE TABLE)', schemaVisualization: 'تصور المخطط', tables: 'جداول', relationships: 'العلاقات', primaryKey: 'المفتاح الأساسي', foreignKey: 'FK' }
  },
  'dead-code-analyzer': {
    en: { deadCodeItemsFound: 'Dead Code Items Found', deadCodeAnalysis: 'Dead Code Analysis', line: 'Line', recommendations: 'Recommendations', tip1: 'Remove unused functions and variables to reduce bundle size', tip2: 'Delete commented-out code (use version control instead)', tip3: 'Fix unreachable code or remove it', tip4: 'Consider using ESLint with no-unused-vars rule', noDeadCodeDetected: 'No dead code detected!' },
    zh: { deadCodeItemsFound: '发现的死代码项', deadCodeAnalysis: '死代码分析', line: '行', recommendations: '建议', tip1: '删除未使用的函数和变量以减小包大小', tip2: '删除注释掉的代码（改用版本控制）', tip3: '修复或删除不可达代码', tip4: '考虑使用 ESLint 的 no-unused-vars 规则', noDeadCodeDetected: '未检测到死代码！' },
    ja: { deadCodeItemsFound: '検出されたデッドコード', deadCodeAnalysis: 'デッドコード分析', line: '行', recommendations: '推奨事項', tip1: '未使用の関数と変数を削除してバンドルサイズを削減', tip2: 'コメントアウトされたコードを削除（代わりにバージョン管理を使用）', tip3: '到達不能コードを修正または削除', tip4: 'ESLintのno-unused-varsルールの使用を検討', noDeadCodeDetected: 'デッドコードは検出されませんでした！' },
    ko: { deadCodeItemsFound: '발견된 데드 코드 항목', deadCodeAnalysis: '데드 코드 분석', line: '줄', recommendations: '권장 사항', tip1: '사용하지 않는 함수와 변수를 제거하여 번들 크기 줄이기', tip2: '주석 처리된 코드 삭제 (대신 버전 관리 사용)', tip3: '도달 불가능한 코드 수정 또는 제거', tip4: 'ESLint의 no-unused-vars 규칙 사용 고려', noDeadCodeDetected: '데드 코드가 감지되지 않았습니다!' },
    es: { deadCodeItemsFound: 'Elementos de código muerto encontrados', deadCodeAnalysis: 'Análisis de código muerto', line: 'Línea', recommendations: 'Recomendaciones', tip1: 'Eliminar funciones y variables no utilizadas para reducir el tamaño del bundle', tip2: 'Eliminar código comentado (usar control de versiones en su lugar)', tip3: 'Corregir o eliminar código inalcanzable', tip4: 'Considerar usar ESLint con la regla no-unused-vars', noDeadCodeDetected: '¡No se detectó código muerto!' },
    pt: { deadCodeItemsFound: 'Itens de código morto encontrados', deadCodeAnalysis: 'Análise de código morto', line: 'Linha', recommendations: 'Recomendações', tip1: 'Remover funções e variáveis não utilizadas para reduzir o tamanho do bundle', tip2: 'Excluir código comentado (usar controle de versão em vez disso)', tip3: 'Corrigir ou remover código inacessível', tip4: 'Considerar usar ESLint com a regra no-unused-vars', noDeadCodeDetected: 'Nenhum código morto detectado!' },
    fr: { deadCodeItemsFound: 'Éléments de code mort trouvés', deadCodeAnalysis: 'Analyse du code mort', line: 'Ligne', recommendations: 'Recommandations', tip1: 'Supprimer les fonctions et variables inutilisées pour réduire la taille du bundle', tip2: 'Supprimer le code commenté (utiliser le contrôle de version à la place)', tip3: 'Corriger ou supprimer le code inaccessible', tip4: 'Envisager d\'utiliser ESLint avec la règle no-unused-vars', noDeadCodeDetected: 'Aucun code mort détecté !' },
    de: { deadCodeItemsFound: 'Gefundene tote Code-Elemente', deadCodeAnalysis: 'Toter Code-Analyse', line: 'Zeile', recommendations: 'Empfehlungen', tip1: 'Unbenutzte Funktionen und Variablen entfernen, um die Bundle-Größe zu reduzieren', tip2: 'Auskommentierten Code löschen (stattdessen Versionskontrolle verwenden)', tip3: 'Unerreichbaren Code reparieren oder entfernen', tip4: 'ESLint mit der no-unused-vars-Regel in Betracht ziehen', noDeadCodeDetected: 'Kein toter Code erkannt!' },
    ru: { deadCodeItemsFound: 'Найдено элементов мёртвого кода', deadCodeAnalysis: 'Анализ мёртвого кода', line: 'Строка', recommendations: 'Рекомендации', tip1: 'Удалите неиспользуемые функции и переменные для уменьшения размера бандла', tip2: 'Удалите закомментированный код (используйте контроль версий)', tip3: 'Исправьте или удалите недостижимый код', tip4: 'Рассмотрите использование ESLint с правилом no-unused-vars', noDeadCodeDetected: 'Мёртвый код не обнаружен!' },
    ar: { deadCodeItemsFound: 'عناصر الكود الميت المكتشفة', deadCodeAnalysis: 'تحليل الكود الميت', line: 'السطر', recommendations: 'التوصيات', tip1: 'إزالة الدوال والمتغيرات غير المستخدمة لتقليل حجم الحزمة', tip2: 'حذف الكود المعلق (استخدم التحكم في الإصدار بدلاً من ذلك)', tip3: 'إصلاح أو إزالة الكود غير القابل للوصول', tip4: 'النظر في استخدام ESLint مع قاعدة no-unused-vars', noDeadCodeDetected: 'لم يتم اكتشاف كود ميت!' }
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
