/**
 * 修复所有占位符翻译 - 直接使用预定义的翻译
 */

const fs = require('fs');
const path = require('path');

// 通用 UI 翻译映射
const translations = {
  // 通用按钮和标签
  info: { zh: '说明', ja: '情報', ko: '정보', es: 'Información', pt: 'Informação', fr: 'Info', de: 'Info', ru: 'Информация', ar: 'معلومات' },
  calculate: { zh: '计算', ja: '計算', ko: '계산', es: 'Calcular', pt: 'Calcular', fr: 'Calculer', de: 'Berechnen', ru: 'Рассчитать', ar: 'احسب' },
  swap: { zh: '交换', ja: '入れ替え', ko: '교환', es: 'Intercambiar', pt: 'Trocar', fr: 'Échanger', de: 'Tauschen', ru: 'Поменять', ar: 'تبديل' },
  encrypt: { zh: '加密', ja: '暗号化', ko: '암호화', es: 'Cifrar', pt: 'Criptografar', fr: 'Chiffrer', de: 'Verschlüsseln', ru: 'Зашифровать', ar: 'تشفير' },
  decrypt: { zh: '解密', ja: '復号化', ko: '복호화', es: 'Descifrar', pt: 'Descriptografar', fr: 'Déchiffrer', de: 'Entschlüsseln', ru: 'Расшифровать', ar: 'فك التشفير' },
  encode: { zh: '编码', ja: 'エンコード', ko: '인코딩', es: 'Codificar', pt: 'Codificar', fr: 'Encoder', de: 'Kodieren', ru: 'Кодировать', ar: 'ترميز' },
  keyword: { zh: '关键词', ja: 'キーワード', ko: '키워드', es: 'Palabra clave', pt: 'Palavra-chave', fr: 'Mot-clé', de: 'Schlüsselwort', ru: 'Ключевое слово', ar: 'كلمة مفتاحية' },
  formula: { zh: '公式', ja: '計算式', ko: '공식', es: 'Fórmula', pt: 'Fórmula', fr: 'Formule', de: 'Formel', ru: 'Формула', ar: 'صيغة' },
  original: { zh: '原始', ja: '元の値', ko: '원본', es: 'Original', pt: 'Original', fr: 'Original', de: 'Original', ru: 'Оригинал', ar: 'الأصلي' },
  encoded: { zh: '编码后', ja: 'エンコード後', ko: '인코딩됨', es: 'Codificado', pt: 'Codificado', fr: 'Encodé', de: 'Kodiert', ru: 'Закодировано', ar: 'مشفر' },
  match: { zh: '匹配', ja: '一致', ko: '일치', es: 'Coincide', pt: 'Corresponde', fr: 'Correspond', de: 'Übereinstimmung', ru: 'Совпадает', ar: 'مطابق' },
  none: { zh: '无', ja: 'なし', ko: '없음', es: 'Ninguno', pt: 'Nenhum', fr: 'Aucun', de: 'Keine', ru: 'Нет', ar: 'لا شيء' },
  
  // 占位符
  inputPlaceholder: { zh: '请输入内容...', ja: 'テキストを入力...', ko: '내용을 입력하세요...', es: 'Ingrese texto...', pt: 'Digite o texto...', fr: 'Entrez le texte...', de: 'Text eingeben...', ru: 'Введите текст...', ar: 'أدخل النص...' },
  outputPlaceholder: { zh: '结果将显示在这里...', ja: '結果がここに表示されます...', ko: '결과가 여기에 표시됩니다...', es: 'El resultado aparecerá aquí...', pt: 'O resultado aparecerá aqui...', fr: 'Le résultat apparaîtra ici...', de: 'Das Ergebnis wird hier angezeigt...', ru: 'Результат появится здесь...', ar: 'ستظهر النتيجة هنا...' },
  keywordPlaceholder: { zh: '输入关键词...', ja: 'キーワードを入力...', ko: '키워드 입력...', es: 'Ingrese palabra clave...', pt: 'Digite a palavra-chave...', fr: 'Entrez le mot-clé...', de: 'Schlüsselwort eingeben...', ru: 'Введите ключевое слово...', ar: 'أدخل الكلمة المفتاحية...' },
  topicPlaceholder: { zh: '输入主题...', ja: 'トピックを入力...', ko: '주제 입력...', es: 'Ingrese tema...', pt: 'Digite o tópico...', fr: 'Entrez le sujet...', de: 'Thema eingeben...', ru: 'Введите тему...', ar: 'أدخل الموضوع...' },
  expectedChecksumPlaceholder: { zh: '输入预期校验和进行验证...', ja: '検証用のチェックサムを入力...', ko: '검증할 체크섬 입력...', es: 'Ingrese checksum esperado...', pt: 'Digite o checksum esperado...', fr: 'Entrez le checksum attendu...', de: 'Erwartete Prüfsumme eingeben...', ru: 'Введите ожидаемую контрольную сумму...', ar: 'أدخل المجموع الاختباري المتوقع...' },

  // 时间相关
  readingTime: { zh: '阅读时间', ja: '読了時間', ko: '읽기 시간', es: 'Tiempo de lectura', pt: 'Tempo de leitura', fr: 'Temps de lecture', de: 'Lesezeit', ru: 'Время чтения', ar: 'وقت القراءة' },
  estimatedTime: { zh: '预计时间', ja: '推定時間', ko: '예상 시간', es: 'Tiempo estimado', pt: 'Tempo estimado', fr: 'Temps estimé', de: 'Geschätzte Zeit', ru: 'Расчетное время', ar: 'الوقت المقدر' },
  minutes: { zh: '分钟', ja: '分', ko: '분', es: 'minutos', pt: 'minutos', fr: 'minutes', de: 'Minuten', ru: 'минут', ar: 'دقائق' },
  minutesTotal: { zh: '总分钟数', ja: '合計分', ko: '총 분', es: 'Minutos totales', pt: 'Minutos totais', fr: 'Minutes totales', de: 'Gesamtminuten', ru: 'Всего минут', ar: 'إجمالي الدقائق' },
  days: { zh: '天', ja: '日', ko: '일', es: 'días', pt: 'dias', fr: 'jours', de: 'Tage', ru: 'дней', ar: 'أيام' },
  time: { zh: '时间', ja: '時間', ko: '시간', es: 'Tiempo', pt: 'Tempo', fr: 'Temps', de: 'Zeit', ru: 'Время', ar: 'الوقت' },
  year: { zh: '年', ja: '年', ko: '년', es: 'Año', pt: 'Ano', fr: 'Année', de: 'Jahr', ru: 'Год', ar: 'سنة' },
  date: { zh: '日期', ja: '日付', ko: '날짜', es: 'Fecha', pt: 'Data', fr: 'Date', de: 'Datum', ru: 'Дата', ar: 'التاريخ' },
  startYear: { zh: '起始年份', ja: '開始年', ko: '시작 연도', es: 'Año inicial', pt: 'Ano inicial', fr: 'Année de début', de: 'Startjahr', ru: 'Начальный год', ar: 'سنة البداية' },
  endYear: { zh: '结束年份', ja: '終了年', ko: '종료 연도', es: 'Año final', pt: 'Ano final', fr: 'Année de fin', de: 'Endjahr', ru: 'Конечный год', ar: 'سنة النهاية' },
  
  // 提示
  tip1: { zh: '提示 1', ja: 'ヒント 1', ko: '팁 1', es: 'Consejo 1', pt: 'Dica 1', fr: 'Conseil 1', de: 'Tipp 1', ru: 'Совет 1', ar: 'نصيحة 1' },
  tip2: { zh: '提示 2', ja: 'ヒント 2', ko: '팁 2', es: 'Consejo 2', pt: 'Dica 2', fr: 'Conseil 2', de: 'Tipp 2', ru: 'Совет 2', ar: 'نصيحة 2' },
  tip3: { zh: '提示 3', ja: 'ヒント 3', ko: '팁 3', es: 'Consejo 3', pt: 'Dica 3', fr: 'Conseil 3', de: 'Tipp 3', ru: 'Совет 3', ar: 'نصيحة 3' },
  tip4: { zh: '提示 4', ja: 'ヒント 4', ko: '팁 4', es: 'Consejo 4', pt: 'Dica 4', fr: 'Conseil 4', de: 'Tipp 4', ru: 'Совет 4', ar: 'نصيحة 4' },
  tips: { zh: '提示', ja: 'ヒント', ko: '팁', es: 'Consejos', pt: 'Dicas', fr: 'Conseils', de: 'Tipps', ru: 'Советы', ar: 'نصائح' },
  ergonomicTips: { zh: '人体工学提示', ja: '人間工学のヒント', ko: '인체공학 팁', es: 'Consejos ergonómicos', pt: 'Dicas ergonômicas', fr: 'Conseils ergonomiques', de: 'Ergonomische Tipps', ru: 'Эргономические советы', ar: 'نصائح مريحة' },
  
  // 步骤
  step1: { zh: '步骤 1', ja: 'ステップ 1', ko: '단계 1', es: 'Paso 1', pt: 'Passo 1', fr: 'Étape 1', de: 'Schritt 1', ru: 'Шаг 1', ar: 'الخطوة 1' },
  step2: { zh: '步骤 2', ja: 'ステップ 2', ko: '단계 2', es: 'Paso 2', pt: 'Passo 2', fr: 'Étape 2', de: 'Schritt 2', ru: 'Шаг 2', ar: 'الخطوة 2' },
  step3: { zh: '步骤 3', ja: 'ステップ 3', ko: '단계 3', es: 'Paso 3', pt: 'Passo 3', fr: 'Étape 3', de: 'Schritt 3', ru: 'Шаг 3', ar: 'الخطوة 3' },
  howToUse: { zh: '使用方法', ja: '使い方', ko: '사용 방법', es: 'Cómo usar', pt: 'Como usar', fr: 'Comment utiliser', de: 'Anleitung', ru: 'Как использовать', ar: 'كيفية الاستخدام' },

  // 样式和外观
  opacity: { zh: '不透明度', ja: '不透明度', ko: '불투명도', es: 'Opacidad', pt: 'Opacidade', fr: 'Opacité', de: 'Deckkraft', ru: 'Непрозрачность', ar: 'الشفافية' },
  fontSize: { zh: '字体大小', ja: 'フォントサイズ', ko: '글꼴 크기', es: 'Tamaño de fuente', pt: 'Tamanho da fonte', fr: 'Taille de police', de: 'Schriftgröße', ru: 'Размер шрифта', ar: 'حجم الخط' },
  textColor: { zh: '文字颜色', ja: 'テキスト色', ko: '텍스트 색상', es: 'Color de texto', pt: 'Cor do texto', fr: 'Couleur du texte', de: 'Textfarbe', ru: 'Цвет текста', ar: 'لون النص' },
  primaryColor: { zh: '主色调', ja: 'メインカラー', ko: '기본 색상', es: 'Color primario', pt: 'Cor primária', fr: 'Couleur principale', de: 'Primärfarbe', ru: 'Основной цвет', ar: 'اللون الأساسي' },
  
  // Prettier 配置
  printWidth: { zh: '行宽', ja: '行幅', ko: '줄 너비', es: 'Ancho de línea', pt: 'Largura da linha', fr: 'Largeur de ligne', de: 'Zeilenbreite', ru: 'Ширина строки', ar: 'عرض السطر' },
  tabWidth: { zh: '缩进宽度', ja: 'タブ幅', ko: '탭 너비', es: 'Ancho de tabulación', pt: 'Largura da tabulação', fr: 'Largeur de tabulation', de: 'Tab-Breite', ru: 'Ширина табуляции', ar: 'عرض التبويب' },
  trailingComma: { zh: '尾随逗号', ja: '末尾カンマ', ko: '후행 쉼표', es: 'Coma final', pt: 'Vírgula final', fr: 'Virgule finale', de: 'Abschließendes Komma', ru: 'Завершающая запятая', ar: 'فاصلة لاحقة' },
  arrowParens: { zh: '箭头函数括号', ja: 'アロー関数の括弧', ko: '화살표 함수 괄호', es: 'Paréntesis de flecha', pt: 'Parênteses de seta', fr: 'Parenthèses fléchées', de: 'Pfeil-Klammern', ru: 'Скобки стрелочных функций', ar: 'أقواس الدالة السهمية' },
  endOfLine: { zh: '行尾符', ja: '行末', ko: '줄 끝', es: 'Fin de línea', pt: 'Fim de linha', fr: 'Fin de ligne', de: 'Zeilenende', ru: 'Конец строки', ar: 'نهاية السطر' },
  proseWrap: { zh: '散文换行', ja: '散文の折り返し', ko: '산문 줄바꿈', es: 'Ajuste de prosa', pt: 'Quebra de prosa', fr: 'Retour à la ligne prose', de: 'Prosa-Umbruch', ru: 'Перенос прозы', ar: 'التفاف النثر' },
  useTabs: { zh: '使用制表符', ja: 'タブを使用', ko: '탭 사용', es: 'Usar tabulaciones', pt: 'Usar tabulações', fr: 'Utiliser les tabulations', de: 'Tabs verwenden', ru: 'Использовать табуляцию', ar: 'استخدام التبويب' },
  semi: { zh: '分号', ja: 'セミコロン', ko: '세미콜론', es: 'Punto y coma', pt: 'Ponto e vírgula', fr: 'Point-virgule', de: 'Semikolon', ru: 'Точка с запятой', ar: 'فاصلة منقوطة' },
  singleQuote: { zh: '单引号', ja: 'シングルクォート', ko: '작은따옴표', es: 'Comillas simples', pt: 'Aspas simples', fr: 'Guillemets simples', de: 'Einfache Anführungszeichen', ru: 'Одинарные кавычки', ar: 'علامات اقتباس مفردة' },
  bracketSpacing: { zh: '括号间距', ja: '括弧のスペース', ko: '괄호 간격', es: 'Espaciado de corchetes', pt: 'Espaçamento de colchetes', fr: 'Espacement des crochets', de: 'Klammerabstand', ru: 'Пробелы в скобках', ar: 'تباعد الأقواس' },
  bracketSameLine: { zh: '括号同行', ja: '括弧を同じ行に', ko: '같은 줄 괄호', es: 'Corchete en misma línea', pt: 'Colchete na mesma linha', fr: 'Crochet sur la même ligne', de: 'Klammer auf gleicher Zeile', ru: 'Скобка на той же строке', ar: 'القوس في نفس السطر' },

  // GitHub README 生成器
  projectName: { zh: '项目名称', ja: 'プロジェクト名', ko: '프로젝트 이름', es: 'Nombre del proyecto', pt: 'Nome do projeto', fr: 'Nom du projet', de: 'Projektname', ru: 'Название проекта', ar: 'اسم المشروع' },
  author: { zh: '作者', ja: '作者', ko: '작성자', es: 'Autor', pt: 'Autor', fr: 'Auteur', de: 'Autor', ru: 'Автор', ar: 'المؤلف' },
  authorGithub: { zh: '作者 GitHub', ja: '作者のGitHub', ko: '작성자 GitHub', es: 'GitHub del autor', pt: 'GitHub do autor', fr: 'GitHub de l\'auteur', de: 'Autor GitHub', ru: 'GitHub автора', ar: 'GitHub المؤلف' },
  badges: { zh: '徽章', ja: 'バッジ', ko: '배지', es: 'Insignias', pt: 'Emblemas', fr: 'Badges', de: 'Abzeichen', ru: 'Значки', ar: 'شارات' },
  features: { zh: '功能特性', ja: '機能', ko: '기능', es: 'Características', pt: 'Recursos', fr: 'Fonctionnalités', de: 'Funktionen', ru: 'Функции', ar: 'الميزات' },
  addFeature: { zh: '添加功能', ja: '機能を追加', ko: '기능 추가', es: 'Agregar característica', pt: 'Adicionar recurso', fr: 'Ajouter une fonctionnalité', de: 'Funktion hinzufügen', ru: 'Добавить функцию', ar: 'إضافة ميزة' },
  installation: { zh: '安装', ja: 'インストール', ko: '설치', es: 'Instalación', pt: 'Instalação', fr: 'Installation', de: 'Installation', ru: 'Установка', ar: 'التثبيت' },
  usage: { zh: '使用方法', ja: '使用方法', ko: '사용법', es: 'Uso', pt: 'Uso', fr: 'Utilisation', de: 'Verwendung', ru: 'Использование', ar: 'الاستخدام' },
  license: { zh: '许可证', ja: 'ライセンス', ko: '라이선스', es: 'Licencia', pt: 'Licença', fr: 'Licence', de: 'Lizenz', ru: 'Лицензия', ar: 'الترخيص' },
  includeTableOfContents: { zh: '包含目录', ja: '目次を含める', ko: '목차 포함', es: 'Incluir tabla de contenidos', pt: 'Incluir índice', fr: 'Inclure la table des matières', de: 'Inhaltsverzeichnis einschließen', ru: 'Включить оглавление', ar: 'تضمين جدول المحتويات' },
  
  // Changelog 生成器
  projectUrl: { zh: '项目 URL', ja: 'プロジェクトURL', ko: '프로젝트 URL', es: 'URL del proyecto', pt: 'URL do projeto', fr: 'URL du projet', de: 'Projekt-URL', ru: 'URL проекта', ar: 'رابط المشروع' },
  addVersion: { zh: '添加版本', ja: 'バージョンを追加', ko: '버전 추가', es: 'Agregar versión', pt: 'Adicionar versão', fr: 'Ajouter une version', de: 'Version hinzufügen', ru: 'Добавить версию', ar: 'إضافة إصدار' },
  version: { zh: '版本', ja: 'バージョン', ko: '버전', es: 'Versión', pt: 'Versão', fr: 'Version', de: 'Version', ru: 'Версия', ar: 'الإصدار' },
  removeVersion: { zh: '删除版本', ja: 'バージョンを削除', ko: '버전 삭제', es: 'Eliminar versión', pt: 'Remover versão', fr: 'Supprimer la version', de: 'Version entfernen', ru: 'Удалить версию', ar: 'إزالة الإصدار' },
  
  // License 生成器
  selectLicense: { zh: '选择许可证', ja: 'ライセンスを選択', ko: '라이선스 선택', es: 'Seleccionar licencia', pt: 'Selecionar licença', fr: 'Sélectionner la licence', de: 'Lizenz auswählen', ru: 'Выбрать лицензию', ar: 'اختر الترخيص' },
  permissions: { zh: '权限', ja: '許可', ko: '권한', es: 'Permisos', pt: 'Permissões', fr: 'Permissions', de: 'Berechtigungen', ru: 'Разрешения', ar: 'الأذونات' },
  conditions: { zh: '条件', ja: '条件', ko: '조건', es: 'Condiciones', pt: 'Condições', fr: 'Conditions', de: 'Bedingungen', ru: 'Условия', ar: 'الشروط' },
  limitations: { zh: '限制', ja: '制限', ko: '제한', es: 'Limitaciones', pt: 'Limitações', fr: 'Limitations', de: 'Einschränkungen', ru: 'Ограничения', ar: 'القيود' },

  // 校验和验证器
  selectFile: { zh: '选择文件', ja: 'ファイルを選択', ko: '파일 선택', es: 'Seleccionar archivo', pt: 'Selecionar arquivo', fr: 'Sélectionner un fichier', de: 'Datei auswählen', ru: 'Выбрать файл', ar: 'اختر ملف' },
  clickToUpload: { zh: '点击上传', ja: 'クリックしてアップロード', ko: '클릭하여 업로드', es: 'Haga clic para cargar', pt: 'Clique para enviar', fr: 'Cliquez pour télécharger', de: 'Klicken zum Hochladen', ru: 'Нажмите для загрузки', ar: 'انقر للتحميل' },
  maxSize: { zh: '最大大小', ja: '最大サイズ', ko: '최대 크기', es: 'Tamaño máximo', pt: 'Tamanho máximo', fr: 'Taille maximale', de: 'Maximale Größe', ru: 'Максимальный размер', ar: 'الحجم الأقصى' },
  expectedChecksum: { zh: '预期校验和', ja: '期待されるチェックサム', ko: '예상 체크섬', es: 'Checksum esperado', pt: 'Checksum esperado', fr: 'Checksum attendu', de: 'Erwartete Prüfsumme', ru: 'Ожидаемая контрольная сумма', ar: 'المجموع الاختباري المتوقع' },
  calculatedChecksums: { zh: '计算的校验和', ja: '計算されたチェックサム', ko: '계산된 체크섬', es: 'Checksums calculados', pt: 'Checksums calculados', fr: 'Checksums calculés', de: 'Berechnete Prüfsummen', ru: 'Вычисленные контрольные суммы', ar: 'المجاميع الاختبارية المحسوبة' },
  noMatch: { zh: '不匹配', ja: '不一致', ko: '불일치', es: 'No coincide', pt: 'Não corresponde', fr: 'Ne correspond pas', de: 'Keine Übereinstimmung', ru: 'Не совпадает', ar: 'غير مطابق' },
  
  // ROT13 和 Vigenere
  mappingTable: { zh: '映射表', ja: 'マッピングテーブル', ko: '매핑 테이블', es: 'Tabla de mapeo', pt: 'Tabela de mapeamento', fr: 'Table de correspondance', de: 'Zuordnungstabelle', ru: 'Таблица соответствия', ar: 'جدول التعيين' },
  mappingPreview: { zh: '映射预览', ja: 'マッピングプレビュー', ko: '매핑 미리보기', es: 'Vista previa del mapeo', pt: 'Pré-visualização do mapeamento', fr: 'Aperçu du mappage', de: 'Zuordnungsvorschau', ru: 'Предпросмотр соответствия', ar: 'معاينة التعيين' },
  effectiveKey: { zh: '有效密钥', ja: '有効なキー', ko: '유효 키', es: 'Clave efectiva', pt: 'Chave efetiva', fr: 'Clé effective', de: 'Effektiver Schlüssel', ru: 'Эффективный ключ', ar: 'المفتاح الفعال' },
  showTable: { zh: '显示表格', ja: 'テーブルを表示', ko: '테이블 표시', es: 'Mostrar tabla', pt: 'Mostrar tabela', fr: 'Afficher le tableau', de: 'Tabelle anzeigen', ru: 'Показать таблицу', ar: 'عرض الجدول' },
  shift: { zh: '偏移量', ja: 'シフト', ko: '시프트', es: 'Desplazamiento', pt: 'Deslocamento', fr: 'Décalage', de: 'Verschiebung', ru: 'Сдвиг', ar: 'الإزاحة' },

  // 通货膨胀计算器
  amount: { zh: '金额', ja: '金額', ko: '금액', es: 'Cantidad', pt: 'Valor', fr: 'Montant', de: 'Betrag', ru: 'Сумма', ar: 'المبلغ' },
  annualRate: { zh: '年利率', ja: '年率', ko: '연간 이율', es: 'Tasa anual', pt: 'Taxa anual', fr: 'Taux annuel', de: 'Jahreszins', ru: 'Годовая ставка', ar: 'المعدل السنوي' },
  commonRates: { zh: '常用利率', ja: '一般的な利率', ko: '일반 이율', es: 'Tasas comunes', pt: 'Taxas comuns', fr: 'Taux courants', de: 'Übliche Zinssätze', ru: 'Обычные ставки', ar: 'المعدلات الشائعة' },
  adjustedValue: { zh: '调整后价值', ja: '調整後の価値', ko: '조정된 가치', es: 'Valor ajustado', pt: 'Valor ajustado', fr: 'Valeur ajustée', de: 'Angepasster Wert', ru: 'Скорректированная стоимость', ar: 'القيمة المعدلة' },
  totalInflation: { zh: '总通胀率', ja: '総インフレ率', ko: '총 인플레이션', es: 'Inflación total', pt: 'Inflação total', fr: 'Inflation totale', de: 'Gesamtinflation', ru: 'Общая инфляция', ar: 'إجمالي التضخم' },
  purchasingPowerLoss: { zh: '购买力损失', ja: '購買力の損失', ko: '구매력 손실', es: 'Pérdida de poder adquisitivo', pt: 'Perda de poder de compra', fr: 'Perte de pouvoir d\'achat', de: 'Kaufkraftverlust', ru: 'Потеря покупательной способности', ar: 'فقدان القوة الشرائية' },
  yearlyBreakdown: { zh: '年度明细', ja: '年間内訳', ko: '연간 내역', es: 'Desglose anual', pt: 'Detalhamento anual', fr: 'Répartition annuelle', de: 'Jährliche Aufschlüsselung', ru: 'Годовая разбивка', ar: 'التفصيل السنوي' },
  cumulativeInflation: { zh: '累计通胀', ja: '累積インフレ', ko: '누적 인플레이션', es: 'Inflación acumulada', pt: 'Inflação acumulada', fr: 'Inflation cumulée', de: 'Kumulative Inflation', ru: 'Накопленная инфляция', ar: 'التضخم التراكمي' },
  formulaExplanation: { zh: '公式说明', ja: '計算式の説明', ko: '공식 설명', es: 'Explicación de la fórmula', pt: 'Explicação da fórmula', fr: 'Explication de la formule', de: 'Formelerklärung', ru: 'Объяснение формулы', ar: 'شرح الصيغة' },
  
  // 利润率计算器
  cost: { zh: '成本', ja: 'コスト', ko: '비용', es: 'Costo', pt: 'Custo', fr: 'Coût', de: 'Kosten', ru: 'Стоимость', ar: 'التكلفة' },
  sellingPrice: { zh: '售价', ja: '販売価格', ko: '판매가', es: 'Precio de venta', pt: 'Preço de venda', fr: 'Prix de vente', de: 'Verkaufspreis', ru: 'Цена продажи', ar: 'سعر البيع' },
  targetMargin: { zh: '目标利润率', ja: '目標利益率', ko: '목표 마진', es: 'Margen objetivo', pt: 'Margem alvo', fr: 'Marge cible', de: 'Zielmarge', ru: 'Целевая маржа', ar: 'الهامش المستهدف' },
  targetMarkup: { zh: '目标加价率', ja: '目標マークアップ', ko: '목표 마크업', es: 'Margen de beneficio objetivo', pt: 'Markup alvo', fr: 'Majoration cible', de: 'Zielaufschlag', ru: 'Целевая наценка', ar: 'هامش الربح المستهدف' },
  profit: { zh: '利润', ja: '利益', ko: '이익', es: 'Ganancia', pt: 'Lucro', fr: 'Profit', de: 'Gewinn', ru: 'Прибыль', ar: 'الربح' },
  profitMargin: { zh: '利润率', ja: '利益率', ko: '이익률', es: 'Margen de ganancia', pt: 'Margem de lucro', fr: 'Marge bénéficiaire', de: 'Gewinnmarge', ru: 'Маржа прибыли', ar: 'هامش الربح' },
  markup: { zh: '加价', ja: 'マークアップ', ko: '마크업', es: 'Margen', pt: 'Markup', fr: 'Majoration', de: 'Aufschlag', ru: 'Наценка', ar: 'هامش الربح' },
  markupPercentage: { zh: '加价百分比', ja: 'マークアップ率', ko: '마크업 비율', es: 'Porcentaje de margen', pt: 'Porcentagem de markup', fr: 'Pourcentage de majoration', de: 'Aufschlagsprozentsatz', ru: 'Процент наценки', ar: 'نسبة هامش الربح' },
  adjustMarkup: { zh: '调整加价', ja: 'マークアップを調整', ko: '마크업 조정', es: 'Ajustar margen', pt: 'Ajustar markup', fr: 'Ajuster la majoration', de: 'Aufschlag anpassen', ru: 'Настроить наценку', ar: 'تعديل هامش الربح' },
  commonMarkups: { zh: '常用加价率', ja: '一般的なマークアップ', ko: '일반 마크업', es: 'Márgenes comunes', pt: 'Markups comuns', fr: 'Majorations courantes', de: 'Übliche Aufschläge', ru: 'Обычные наценки', ar: 'هوامش الربح الشائعة' },
  marginVsMarkup: { zh: '利润率 vs 加价率', ja: '利益率 vs マークアップ', ko: '마진 vs 마크업', es: 'Margen vs Markup', pt: 'Margem vs Markup', fr: 'Marge vs Majoration', de: 'Marge vs Aufschlag', ru: 'Маржа vs Наценка', ar: 'الهامش مقابل هامش الربح' },
  marginVsMarkupExplanation: { zh: '利润率与加价率的区别说明', ja: '利益率とマークアップの違いの説明', ko: '마진과 마크업의 차이 설명', es: 'Explicación de margen vs markup', pt: 'Explicação de margem vs markup', fr: 'Explication marge vs majoration', de: 'Erklärung Marge vs Aufschlag', ru: 'Объяснение маржи и наценки', ar: 'شرح الفرق بين الهامش وهامش الربح' },
  formulas: { zh: '公式', ja: '計算式', ko: '공식', es: 'Fórmulas', pt: 'Fórmulas', fr: 'Formules', de: 'Formeln', ru: 'Формулы', ar: 'الصيغ' },

  // 盈亏平衡计算器
  fixedCosts: { zh: '固定成本', ja: '固定費', ko: '고정 비용', es: 'Costos fijos', pt: 'Custos fixos', fr: 'Coûts fixes', de: 'Fixkosten', ru: 'Постоянные затраты', ar: 'التكاليف الثابتة' },
  fixedCostsHint: { zh: '固定成本提示', ja: '固定費のヒント', ko: '고정 비용 힌트', es: 'Sugerencia de costos fijos', pt: 'Dica de custos fixos', fr: 'Conseil coûts fixes', de: 'Hinweis Fixkosten', ru: 'Подсказка по постоянным затратам', ar: 'تلميح التكاليف الثابتة' },
  variableCostPerUnit: { zh: '单位可变成本', ja: '単位当たり変動費', ko: '단위당 변동 비용', es: 'Costo variable por unidad', pt: 'Custo variável por unidade', fr: 'Coût variable par unité', de: 'Variable Kosten pro Einheit', ru: 'Переменные затраты на единицу', ar: 'التكلفة المتغيرة لكل وحدة' },
  variableCostHint: { zh: '可变成本提示', ja: '変動費のヒント', ko: '변동 비용 힌트', es: 'Sugerencia de costo variable', pt: 'Dica de custo variável', fr: 'Conseil coût variable', de: 'Hinweis variable Kosten', ru: 'Подсказка по переменным затратам', ar: 'تلميح التكلفة المتغيرة' },
  sellingPricePerUnit: { zh: '单位售价', ja: '単位当たり販売価格', ko: '단위당 판매가', es: 'Precio de venta por unidad', pt: 'Preço de venda por unidade', fr: 'Prix de vente par unité', de: 'Verkaufspreis pro Einheit', ru: 'Цена продажи за единицу', ar: 'سعر البيع لكل وحدة' },
  breakEven: { zh: '盈亏平衡', ja: '損益分岐点', ko: '손익분기점', es: 'Punto de equilibrio', pt: 'Ponto de equilíbrio', fr: 'Seuil de rentabilité', de: 'Break-Even', ru: 'Точка безубыточности', ar: 'نقطة التعادل' },
  breakEvenUnits: { zh: '盈亏平衡数量', ja: '損益分岐点数量', ko: '손익분기 수량', es: 'Unidades de equilibrio', pt: 'Unidades de equilíbrio', fr: 'Unités de rentabilité', de: 'Break-Even-Einheiten', ru: 'Единицы безубыточности', ar: 'وحدات التعادل' },
  breakEvenRevenue: { zh: '盈亏平衡收入', ja: '損益分岐点売上', ko: '손익분기 수익', es: 'Ingresos de equilibrio', pt: 'Receita de equilíbrio', fr: 'Chiffre d\'affaires de rentabilité', de: 'Break-Even-Umsatz', ru: 'Выручка безубыточности', ar: 'إيرادات التعادل' },
  contributionMargin: { zh: '边际贡献', ja: '貢献利益', ko: '공헌이익', es: 'Margen de contribución', pt: 'Margem de contribuição', fr: 'Marge de contribution', de: 'Deckungsbeitrag', ru: 'Маржинальная прибыль', ar: 'هامش المساهمة' },
  contributionMarginRatio: { zh: '边际贡献率', ja: '貢献利益率', ko: '공헌이익률', es: 'Ratio de margen de contribución', pt: 'Índice de margem de contribuição', fr: 'Ratio de marge de contribution', de: 'Deckungsbeitragsquote', ru: 'Коэффициент маржинальной прибыли', ar: 'نسبة هامش المساهمة' },
  profitLoss: { zh: '盈亏', ja: '損益', ko: '손익', es: 'Ganancia/Pérdida', pt: 'Lucro/Prejuízo', fr: 'Profit/Perte', de: 'Gewinn/Verlust', ru: 'Прибыль/Убыток', ar: 'الربح/الخسارة' },
  profitLossTable: { zh: '盈亏表', ja: '損益表', ko: '손익표', es: 'Tabla de ganancias/pérdidas', pt: 'Tabela de lucro/prejuízo', fr: 'Tableau profit/perte', de: 'Gewinn/Verlust-Tabelle', ru: 'Таблица прибыли/убытков', ar: 'جدول الربح/الخسارة' },
  units: { zh: '数量', ja: '数量', ko: '수량', es: 'Unidades', pt: 'Unidades', fr: 'Unités', de: 'Einheiten', ru: 'Единицы', ar: 'الوحدات' },
  revenue: { zh: '收入', ja: '収益', ko: '수익', es: 'Ingresos', pt: 'Receita', fr: 'Revenus', de: 'Umsatz', ru: 'Выручка', ar: 'الإيرادات' },
  totalCosts: { zh: '总成本', ja: '総コスト', ko: '총 비용', es: 'Costos totales', pt: 'Custos totais', fr: 'Coûts totaux', de: 'Gesamtkosten', ru: 'Общие затраты', ar: 'إجمالي التكاليف' },
  perUnit: { zh: '每单位', ja: '単位当たり', ko: '단위당', es: 'Por unidad', pt: 'Por unidade', fr: 'Par unité', de: 'Pro Einheit', ru: 'За единицу', ar: 'لكل وحدة' },
  grossProfit: { zh: '毛利润', ja: '粗利益', ko: '총이익', es: 'Ganancia bruta', pt: 'Lucro bruto', fr: 'Bénéfice brut', de: 'Bruttogewinn', ru: 'Валовая прибыль', ar: 'الربح الإجمالي' },
  priceBreakdown: { zh: '价格明细', ja: '価格内訳', ko: '가격 내역', es: 'Desglose de precio', pt: 'Detalhamento de preço', fr: 'Répartition du prix', de: 'Preisaufschlüsselung', ru: 'Разбивка цены', ar: 'تفصيل السعر' },
  breakdown: { zh: '明细', ja: '内訳', ko: '내역', es: 'Desglose', pt: 'Detalhamento', fr: 'Répartition', de: 'Aufschlüsselung', ru: 'Разбивка', ar: 'التفصيل' },
  comparisonTable: { zh: '对比表', ja: '比較表', ko: '비교표', es: 'Tabla de comparación', pt: 'Tabela de comparação', fr: 'Tableau de comparaison', de: 'Vergleichstabelle', ru: 'Сравнительная таблица', ar: 'جدول المقارنة' },

  // 标签生成器
  topic: { zh: '主题', ja: 'トピック', ko: '주제', es: 'Tema', pt: 'Tópico', fr: 'Sujet', de: 'Thema', ru: 'Тема', ar: 'الموضوع' },
  platform: { zh: '平台', ja: 'プラットフォーム', ko: '플랫폼', es: 'Plataforma', pt: 'Plataforma', fr: 'Plateforme', de: 'Plattform', ru: 'Платформа', ar: 'المنصة' },
  count: { zh: '数量', ja: '数', ko: '개수', es: 'Cantidad', pt: 'Quantidade', fr: 'Nombre', de: 'Anzahl', ru: 'Количество', ar: 'العدد' },
  quickTopics: { zh: '快速主题', ja: 'クイックトピック', ko: '빠른 주제', es: 'Temas rápidos', pt: 'Tópicos rápidos', fr: 'Sujets rapides', de: 'Schnelle Themen', ru: 'Быстрые темы', ar: 'مواضيع سريعة' },
  popularHashtags: { zh: '热门标签', ja: '人気のハッシュタグ', ko: '인기 해시태그', es: 'Hashtags populares', pt: 'Hashtags populares', fr: 'Hashtags populaires', de: 'Beliebte Hashtags', ru: 'Популярные хэштеги', ar: 'الهاشتاقات الشائعة' },
  nicheHashtags: { zh: '小众标签', ja: 'ニッチなハッシュタグ', ko: '니치 해시태그', es: 'Hashtags de nicho', pt: 'Hashtags de nicho', fr: 'Hashtags de niche', de: 'Nischen-Hashtags', ru: 'Нишевые хэштеги', ar: 'هاشتاقات متخصصة' },
  allHashtags: { zh: '所有标签', ja: 'すべてのハッシュタグ', ko: '모든 해시태그', es: 'Todos los hashtags', pt: 'Todos os hashtags', fr: 'Tous les hashtags', de: 'Alle Hashtags', ru: 'Все хэштеги', ar: 'جميع الهاشتاقات' },
  copyBox: { zh: '复制框', ja: 'コピーボックス', ko: '복사 상자', es: 'Cuadro de copia', pt: 'Caixa de cópia', fr: 'Zone de copie', de: 'Kopierfeld', ru: 'Поле копирования', ar: 'مربع النسخ' },
  
  // 联系信息
  email: { zh: '邮箱', ja: 'メール', ko: '이메일', es: 'Correo electrónico', pt: 'E-mail', fr: 'E-mail', de: 'E-Mail', ru: 'Электронная почта', ar: 'البريد الإلكتروني' },
  phone: { zh: '电话', ja: '電話', ko: '전화', es: 'Teléfono', pt: 'Telefone', fr: 'Téléphone', de: 'Telefon', ru: 'Телефон', ar: 'الهاتف' },
  website: { zh: '网站', ja: 'ウェブサイト', ko: '웹사이트', es: 'Sitio web', pt: 'Site', fr: 'Site web', de: 'Webseite', ru: 'Веб-сайт', ar: 'الموقع الإلكتروني' },
  company: { zh: '公司', ja: '会社', ko: '회사', es: 'Empresa', pt: 'Empresa', fr: 'Entreprise', de: 'Unternehmen', ru: 'Компания', ar: 'الشركة' },
};

// 语言列表
const LOCALES = ['zh', 'ja', 'ko', 'es', 'pt', 'fr', 'de', 'ru', 'ar'];


// 递归查找并修复占位符
function findAndFixPlaceholders(obj, path = '', locale, stats) {
  for (const [key, value] of Object.entries(obj)) {
    const fullPath = path ? `${path}.${key}` : key;
    
    if (typeof value === 'string') {
      // 检查是否是占位符格式 [xxx]
      if (value.startsWith('[') && value.endsWith(']')) {
        // 从占位符中提取键名
        let placeholderKey = value.slice(1, -1).trim();
        // 转换为 camelCase
        placeholderKey = placeholderKey.replace(/\s+(.)/g, (_, c) => c.toUpperCase());
        placeholderKey = placeholderKey.charAt(0).toLowerCase() + placeholderKey.slice(1);
        
        // 查找翻译
        if (translations[placeholderKey] && translations[placeholderKey][locale]) {
          obj[key] = translations[placeholderKey][locale];
          stats.fixed++;
        } else {
          stats.notFound.push({ path: fullPath, placeholder: value, key: placeholderKey });
        }
      }
    } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      findAndFixPlaceholders(value, fullPath, locale, stats);
    }
  }
}

// 主函数
function main() {
  console.log('🔧 修复所有占位符翻译...\n');
  
  for (const locale of LOCALES) {
    const filePath = path.join(__dirname, '..', 'src', 'messages', `${locale}.json`);
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    const stats = { fixed: 0, notFound: [] };
    findAndFixPlaceholders(data, '', locale, stats);
    
    // 保存文件
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    
    console.log(`📂 ${locale}: 修复了 ${stats.fixed} 个占位符`);
    if (stats.notFound.length > 0) {
      console.log(`   ⚠️ 未找到翻译的占位符: ${stats.notFound.length} 个`);
      stats.notFound.slice(0, 5).forEach(item => {
        console.log(`      - ${item.path}: ${item.placeholder} (key: ${item.key})`);
      });
      if (stats.notFound.length > 5) {
        console.log(`      ... 还有 ${stats.notFound.length - 5} 个`);
      }
    }
  }
  
  console.log('\n✅ 完成！');
}

main();
