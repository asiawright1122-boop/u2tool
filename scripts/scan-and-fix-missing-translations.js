/**
 * 扫描所有工具组件，找出缺失的翻译键并添加
 */

const fs = require('fs');
const path = require('path');

const LOCALES = ['en', 'zh', 'ja', 'ko', 'es', 'pt', 'fr', 'de', 'ru', 'ar'];
const toolsDir = path.join(__dirname, '..', 'src', 'components', 'tools');

// 从文件名提取工具 slug
function getToolSlug(filename) {
  return filename.replace('.tsx', '')
    .replace(/([A-Z])/g, '-$1')
    .toLowerCase()
    .replace(/^-/, '')
    .replace(/--/g, '-');
}

// 从组件中提取使用的翻译键
function extractTranslationKeys(content) {
  const keys = new Set();
  const regex = /\{t\('([a-zA-Z][a-zA-Z0-9_]*)'\)\}/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    keys.add(match[1]);
  }
  return Array.from(keys);
}

// 检查组件是否使用工具特定翻译
function usesToolSpecificTranslation(content, toolSlug) {
  return content.includes(`useTranslations('tools.${toolSlug}')`);
}

// 通用翻译映射
const commonTranslations = {
  // 基础操作
  generate: { en: 'Generate', zh: '生成', ja: '生成', ko: '생성', es: 'Generar', pt: 'Gerar', fr: 'Générer', de: 'Generieren', ru: 'Сгенерировать', ar: 'إنشاء' },
  download: { en: 'Download', zh: '下载', ja: 'ダウンロード', ko: '다운로드', es: 'Descargar', pt: 'Baixar', fr: 'Télécharger', de: 'Herunterladen', ru: 'Скачать', ar: 'تحميل' },
  copy: { en: 'Copy', zh: '复制', ja: 'コピー', ko: '복사', es: 'Copiar', pt: 'Copiar', fr: 'Copier', de: 'Kopieren', ru: 'Копировать', ar: 'نسخ' },
  preview: { en: 'Preview', zh: '预览', ja: 'プレビュー', ko: '미리보기', es: 'Vista previa', pt: 'Pré-visualização', fr: 'Aperçu', de: 'Vorschau', ru: 'Предпросмотр', ar: 'معاينة' },
  clear: { en: 'Clear', zh: '清空', ja: 'クリア', ko: '지우기', es: 'Limpiar', pt: 'Limpar', fr: 'Effacer', de: 'Löschen', ru: 'Очистить', ar: 'مسح' },
  reset: { en: 'Reset', zh: '重置', ja: 'リセット', ko: '초기화', es: 'Restablecer', pt: 'Redefinir', fr: 'Réinitialiser', de: 'Zurücksetzen', ru: 'Сбросить', ar: 'إعادة تعيين' },
  
  // 表单相关
  framework: { en: 'Framework', zh: '框架', ja: 'フレームワーク', ko: '프레임워크', es: 'Framework', pt: 'Framework', fr: 'Framework', de: 'Framework', ru: 'Фреймворк', ar: 'إطار العمل' },
  styleGuide: { en: 'Style Guide', zh: '样式指南', ja: 'スタイルガイド', ko: '스타일 가이드', es: 'Guía de estilo', pt: 'Guia de estilo', fr: 'Guide de style', de: 'Stilrichtlinie', ru: 'Руководство по стилю', ar: 'دليل الأسلوب' },
  typescript: { en: 'TypeScript', zh: 'TypeScript', ja: 'TypeScript', ko: 'TypeScript', es: 'TypeScript', pt: 'TypeScript', fr: 'TypeScript', de: 'TypeScript', ru: 'TypeScript', ar: 'TypeScript' },
  environment: { en: 'Environment', zh: '环境', ja: '環境', ko: '환경', es: 'Entorno', pt: 'Ambiente', fr: 'Environnement', de: 'Umgebung', ru: 'Окружение', ar: 'البيئة' },
  rules: { en: 'Rules', zh: '规则', ja: 'ルール', ko: '규칙', es: 'Reglas', pt: 'Regras', fr: 'Règles', de: 'Regeln', ru: 'Правила', ar: 'القواعد' },

  // Docker 相关
  baseImage: { en: 'Base Image', zh: '基础镜像', ja: 'ベースイメージ', ko: '베이스 이미지', es: 'Imagen base', pt: 'Imagem base', fr: 'Image de base', de: 'Basis-Image', ru: 'Базовый образ', ar: 'الصورة الأساسية' },
  workdir: { en: 'Working Directory', zh: '工作目录', ja: '作業ディレクトリ', ko: '작업 디렉토리', es: 'Directorio de trabajo', pt: 'Diretório de trabalho', fr: 'Répertoire de travail', de: 'Arbeitsverzeichnis', ru: 'Рабочая директория', ar: 'دليل العمل' },
  envVars: { en: 'Environment Variables', zh: '环境变量', ja: '環境変数', ko: '환경 변수', es: 'Variables de entorno', pt: 'Variáveis de ambiente', fr: 'Variables d\'environnement', de: 'Umgebungsvariablen', ru: 'Переменные окружения', ar: 'متغيرات البيئة' },
  addEnvVar: { en: 'Add Environment Variable', zh: '添加环境变量', ja: '環境変数を追加', ko: '환경 변수 추가', es: 'Agregar variable', pt: 'Adicionar variável', fr: 'Ajouter une variable', de: 'Variable hinzufügen', ru: 'Добавить переменную', ar: 'إضافة متغير' },
  copyCommands: { en: 'Copy Commands', zh: '复制命令', ja: 'コピーコマンド', ko: '복사 명령', es: 'Comandos de copia', pt: 'Comandos de cópia', fr: 'Commandes de copie', de: 'Kopierbefehle', ru: 'Команды копирования', ar: 'أوامر النسخ' },
  addCopy: { en: 'Add Copy', zh: '添加复制', ja: 'コピーを追加', ko: '복사 추가', es: 'Agregar copia', pt: 'Adicionar cópia', fr: 'Ajouter une copie', de: 'Kopie hinzufügen', ru: 'Добавить копирование', ar: 'إضافة نسخ' },
  runCommands: { en: 'Run Commands', zh: '运行命令', ja: '実行コマンド', ko: '실행 명령', es: 'Comandos de ejecución', pt: 'Comandos de execução', fr: 'Commandes d\'exécution', de: 'Ausführungsbefehle', ru: 'Команды выполнения', ar: 'أوامر التشغيل' },
  addRun: { en: 'Add Run', zh: '添加运行', ja: '実行を追加', ko: '실행 추가', es: 'Agregar ejecución', pt: 'Adicionar execução', fr: 'Ajouter une exécution', de: 'Ausführung hinzufügen', ru: 'Добавить выполнение', ar: 'إضافة تشغيل' },
  exposePort: { en: 'Expose Port', zh: '暴露端口', ja: 'ポートを公開', ko: '포트 노출', es: 'Exponer puerto', pt: 'Expor porta', fr: 'Exposer le port', de: 'Port freigeben', ru: 'Открыть порт', ar: 'كشف المنفذ' },
  cmd: { en: 'CMD', zh: 'CMD 命令', ja: 'CMD', ko: 'CMD', es: 'CMD', pt: 'CMD', fr: 'CMD', de: 'CMD', ru: 'CMD', ar: 'CMD' },
  entrypoint: { en: 'Entrypoint', zh: '入口点', ja: 'エントリーポイント', ko: '엔트리포인트', es: 'Punto de entrada', pt: 'Ponto de entrada', fr: 'Point d\'entrée', de: 'Einstiegspunkt', ru: 'Точка входа', ar: 'نقطة الدخول' },
  envKey: { en: 'Key', zh: '键', ja: 'キー', ko: '키', es: 'Clave', pt: 'Chave', fr: 'Clé', de: 'Schlüssel', ru: 'Ключ', ar: 'المفتاح' },
  envValue: { en: 'Value', zh: '值', ja: '値', ko: '값', es: 'Valor', pt: 'Valor', fr: 'Valeur', de: 'Wert', ru: 'Значение', ar: 'القيمة' },
  
  // TSConfig 相关
  presets: { en: 'Presets', zh: '预设', ja: 'プリセット', ko: '프리셋', es: 'Preajustes', pt: 'Predefinições', fr: 'Préréglages', de: 'Voreinstellungen', ru: 'Пресеты', ar: 'الإعدادات المسبقة' },
  target: { en: 'Target', zh: '目标', ja: 'ターゲット', ko: '대상', es: 'Objetivo', pt: 'Alvo', fr: 'Cible', de: 'Ziel', ru: 'Цель', ar: 'الهدف' },
  module: { en: 'Module', zh: '模块', ja: 'モジュール', ko: '모듈', es: 'Módulo', pt: 'Módulo', fr: 'Module', de: 'Modul', ru: 'Модуль', ar: 'الوحدة' },
  moduleResolution: { en: 'Module Resolution', zh: '模块解析', ja: 'モジュール解決', ko: '모듈 해석', es: 'Resolución de módulos', pt: 'Resolução de módulos', fr: 'Résolution de modules', de: 'Modulauflösung', ru: 'Разрешение модулей', ar: 'حل الوحدات' },
  outDir: { en: 'Output Directory', zh: '输出目录', ja: '出力ディレクトリ', ko: '출력 디렉토리', es: 'Directorio de salida', pt: 'Diretório de saída', fr: 'Répertoire de sortie', de: 'Ausgabeverzeichnis', ru: 'Выходная директория', ar: 'دليل الإخراج' },
  rootDir: { en: 'Root Directory', zh: '根目录', ja: 'ルートディレクトリ', ko: '루트 디렉토리', es: 'Directorio raíz', pt: 'Diretório raiz', fr: 'Répertoire racine', de: 'Stammverzeichnis', ru: 'Корневая директория', ar: 'الدليل الجذر' },
  lib: { en: 'Libraries', zh: '库', ja: 'ライブラリ', ko: '라이브러리', es: 'Bibliotecas', pt: 'Bibliotecas', fr: 'Bibliothèques', de: 'Bibliotheken', ru: 'Библиотеки', ar: 'المكتبات' },
  strict: { en: 'Strict', zh: '严格模式', ja: '厳格モード', ko: '엄격 모드', es: 'Estricto', pt: 'Estrito', fr: 'Strict', de: 'Strikt', ru: 'Строгий режим', ar: 'صارم' },
  declaration: { en: 'Declaration', zh: '声明文件', ja: '宣言ファイル', ko: '선언 파일', es: 'Declaración', pt: 'Declaração', fr: 'Déclaration', de: 'Deklaration', ru: 'Декларация', ar: 'الإعلان' },
  declarationMap: { en: 'Declaration Map', zh: '声明映射', ja: '宣言マップ', ko: '선언 맵', es: 'Mapa de declaración', pt: 'Mapa de declaração', fr: 'Carte de déclaration', de: 'Deklarationskarte', ru: 'Карта деклараций', ar: 'خريطة الإعلان' },
  sourceMap: { en: 'Source Map', zh: '源映射', ja: 'ソースマップ', ko: '소스 맵', es: 'Mapa de origen', pt: 'Mapa de origem', fr: 'Carte source', de: 'Quellkarte', ru: 'Карта исходников', ar: 'خريطة المصدر' },

  // 更多通用键
  input: { en: 'Input', zh: '输入', ja: '入力', ko: '입력', es: 'Entrada', pt: 'Entrada', fr: 'Entrée', de: 'Eingabe', ru: 'Ввод', ar: 'الإدخال' },
  output: { en: 'Output', zh: '输出', ja: '出力', ko: '출력', es: 'Salida', pt: 'Saída', fr: 'Sortie', de: 'Ausgabe', ru: 'Вывод', ar: 'الإخراج' },
  options: { en: 'Options', zh: '选项', ja: 'オプション', ko: '옵션', es: 'Opciones', pt: 'Opções', fr: 'Options', de: 'Optionen', ru: 'Опции', ar: 'الخيارات' },
  settings: { en: 'Settings', zh: '设置', ja: '設定', ko: '설정', es: 'Configuración', pt: 'Configurações', fr: 'Paramètres', de: 'Einstellungen', ru: 'Настройки', ar: 'الإعدادات' },
  format: { en: 'Format', zh: '格式', ja: 'フォーマット', ko: '형식', es: 'Formato', pt: 'Formato', fr: 'Format', de: 'Format', ru: 'Формат', ar: 'التنسيق' },
  type: { en: 'Type', zh: '类型', ja: 'タイプ', ko: '유형', es: 'Tipo', pt: 'Tipo', fr: 'Type', de: 'Typ', ru: 'Тип', ar: 'النوع' },
  name: { en: 'Name', zh: '名称', ja: '名前', ko: '이름', es: 'Nombre', pt: 'Nome', fr: 'Nom', de: 'Name', ru: 'Имя', ar: 'الاسم' },
  value: { en: 'Value', zh: '值', ja: '値', ko: '값', es: 'Valor', pt: 'Valor', fr: 'Valeur', de: 'Wert', ru: 'Значение', ar: 'القيمة' },
  add: { en: 'Add', zh: '添加', ja: '追加', ko: '추가', es: 'Agregar', pt: 'Adicionar', fr: 'Ajouter', de: 'Hinzufügen', ru: 'Добавить', ar: 'إضافة' },
  remove: { en: 'Remove', zh: '移除', ja: '削除', ko: '제거', es: 'Eliminar', pt: 'Remover', fr: 'Supprimer', de: 'Entfernen', ru: 'Удалить', ar: 'إزالة' },
  edit: { en: 'Edit', zh: '编辑', ja: '編集', ko: '편집', es: 'Editar', pt: 'Editar', fr: 'Modifier', de: 'Bearbeiten', ru: 'Редактировать', ar: 'تحرير' },
  save: { en: 'Save', zh: '保存', ja: '保存', ko: '저장', es: 'Guardar', pt: 'Salvar', fr: 'Enregistrer', de: 'Speichern', ru: 'Сохранить', ar: 'حفظ' },
  cancel: { en: 'Cancel', zh: '取消', ja: 'キャンセル', ko: '취소', es: 'Cancelar', pt: 'Cancelar', fr: 'Annuler', de: 'Abbrechen', ru: 'Отмена', ar: 'إلغاء' },
  submit: { en: 'Submit', zh: '提交', ja: '送信', ko: '제출', es: 'Enviar', pt: 'Enviar', fr: 'Soumettre', de: 'Absenden', ru: 'Отправить', ar: 'إرسال' },
  result: { en: 'Result', zh: '结果', ja: '結果', ko: '결과', es: 'Resultado', pt: 'Resultado', fr: 'Résultat', de: 'Ergebnis', ru: 'Результат', ar: 'النتيجة' },
  results: { en: 'Results', zh: '结果', ja: '結果', ko: '결과', es: 'Resultados', pt: 'Resultados', fr: 'Résultats', de: 'Ergebnisse', ru: 'Результаты', ar: 'النتائج' },
  error: { en: 'Error', zh: '错误', ja: 'エラー', ko: '오류', es: 'Error', pt: 'Erro', fr: 'Erreur', de: 'Fehler', ru: 'Ошибка', ar: 'خطأ' },
  success: { en: 'Success', zh: '成功', ja: '成功', ko: '성공', es: 'Éxito', pt: 'Sucesso', fr: 'Succès', de: 'Erfolg', ru: 'Успех', ar: 'نجاح' },
  loading: { en: 'Loading...', zh: '加载中...', ja: '読み込み中...', ko: '로딩 중...', es: 'Cargando...', pt: 'Carregando...', fr: 'Chargement...', de: 'Laden...', ru: 'Загрузка...', ar: 'جاري التحميل...' },
  noData: { en: 'No data', zh: '无数据', ja: 'データなし', ko: '데이터 없음', es: 'Sin datos', pt: 'Sem dados', fr: 'Pas de données', de: 'Keine Daten', ru: 'Нет данных', ar: 'لا توجد بيانات' },
  
  // 更多常用键
  title: { en: 'Title', zh: '标题', ja: 'タイトル', ko: '제목', es: 'Título', pt: 'Título', fr: 'Titre', de: 'Titel', ru: 'Заголовок', ar: 'العنوان' },
  description: { en: 'Description', zh: '描述', ja: '説明', ko: '설명', es: 'Descripción', pt: 'Descrição', fr: 'Description', de: 'Beschreibung', ru: 'Описание', ar: 'الوصف' },
  content: { en: 'Content', zh: '内容', ja: 'コンテンツ', ko: '콘텐츠', es: 'Contenido', pt: 'Conteúdo', fr: 'Contenu', de: 'Inhalt', ru: 'Содержимое', ar: 'المحتوى' },
  text: { en: 'Text', zh: '文本', ja: 'テキスト', ko: '텍스트', es: 'Texto', pt: 'Texto', fr: 'Texte', de: 'Text', ru: 'Текст', ar: 'النص' },
  file: { en: 'File', zh: '文件', ja: 'ファイル', ko: '파일', es: 'Archivo', pt: 'Arquivo', fr: 'Fichier', de: 'Datei', ru: 'Файл', ar: 'ملف' },
  size: { en: 'Size', zh: '大小', ja: 'サイズ', ko: '크기', es: 'Tamaño', pt: 'Tamanho', fr: 'Taille', de: 'Größe', ru: 'Размер', ar: 'الحجم' },
  width: { en: 'Width', zh: '宽度', ja: '幅', ko: '너비', es: 'Ancho', pt: 'Largura', fr: 'Largeur', de: 'Breite', ru: 'Ширина', ar: 'العرض' },
  height: { en: 'Height', zh: '高度', ja: '高さ', ko: '높이', es: 'Alto', pt: 'Altura', fr: 'Hauteur', de: 'Höhe', ru: 'Высота', ar: 'الارتفاع' },
  color: { en: 'Color', zh: '颜色', ja: '色', ko: '색상', es: 'Color', pt: 'Cor', fr: 'Couleur', de: 'Farbe', ru: 'Цвет', ar: 'اللون' },
  style: { en: 'Style', zh: '样式', ja: 'スタイル', ko: '스타일', es: 'Estilo', pt: 'Estilo', fr: 'Style', de: 'Stil', ru: 'Стиль', ar: 'النمط' },
};


// 扫描所有组件并收集缺失的翻译键
function scanAllComponents() {
  const files = fs.readdirSync(toolsDir).filter(f => 
    f.endsWith('.tsx') && 
    !f.includes('Wrapper') && 
    !f.includes('index') &&
    !f.includes('ECharts')
  );
  
  const missingByTool = {};
  let totalMissing = 0;
  
  // 加载英文翻译文件
  const enPath = path.join(__dirname, '..', 'src', 'messages', 'en.json');
  const enData = JSON.parse(fs.readFileSync(enPath, 'utf8'));
  
  files.forEach(file => {
    const filePath = path.join(toolsDir, file);
    const content = fs.readFileSync(filePath, 'utf8');
    const toolSlug = getToolSlug(file);
    
    // 只处理使用工具特定翻译的组件
    if (!usesToolSpecificTranslation(content, toolSlug)) {
      return;
    }
    
    const usedKeys = extractTranslationKeys(content);
    const existingKeys = enData.tools[toolSlug] ? Object.keys(enData.tools[toolSlug]) : [];
    
    const missing = usedKeys.filter(key => !existingKeys.includes(key));
    
    if (missing.length > 0) {
      missingByTool[toolSlug] = {
        file,
        missing,
        existing: existingKeys
      };
      totalMissing += missing.length;
    }
  });
  
  return { missingByTool, totalMissing };
}

// 添加缺失的翻译
function addMissingTranslations(missingByTool) {
  console.log('🔧 添加缺失的翻译键...\n');
  
  let totalAdded = 0;
  
  LOCALES.forEach(locale => {
    const filePath = path.join(__dirname, '..', 'src', 'messages', `${locale}.json`);
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    let addedCount = 0;
    
    Object.entries(missingByTool).forEach(([toolSlug, info]) => {
      if (!data.tools[toolSlug]) {
        data.tools[toolSlug] = {};
      }
      
      info.missing.forEach(key => {
        if (!data.tools[toolSlug][key]) {
          // 使用通用翻译或生成占位符
          if (commonTranslations[key]) {
            data.tools[toolSlug][key] = commonTranslations[key][locale];
          } else {
            // 生成占位符 - 使用英文作为基础
            const enValue = key.replace(/([A-Z])/g, ' $1').trim();
            data.tools[toolSlug][key] = locale === 'en' ? enValue : `[${enValue}]`;
          }
          addedCount++;
        }
      });
    });
    
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    console.log(`✓ ${locale}.json - 添加了 ${addedCount} 个翻译键`);
    totalAdded += addedCount;
  });
  
  return totalAdded;
}

// 主函数
function main() {
  console.log('🔍 扫描所有工具组件...\n');
  
  const { missingByTool, totalMissing } = scanAllComponents();
  
  console.log('=' .repeat(60));
  console.log('📊 扫描结果');
  console.log('=' .repeat(60));
  console.log(`有缺失翻译的工具: ${Object.keys(missingByTool).length}`);
  console.log(`总缺失翻译键数: ${totalMissing}`);
  console.log('');
  
  if (totalMissing > 0) {
    console.log('\n⚠️  缺失翻译的工具:\n');
    Object.entries(missingByTool).forEach(([toolSlug, info]) => {
      console.log(`📁 ${info.file}`);
      console.log(`   工具: ${toolSlug}`);
      console.log(`   缺失: ${info.missing.join(', ')}`);
      console.log('');
    });
    
    // 添加翻译
    const totalAdded = addMissingTranslations(missingByTool);
    console.log(`\n✅ 总共添加了 ${totalAdded} 个翻译键`);
  } else {
    console.log('\n✅ 所有翻译键都已存在！');
  }
}

main();
