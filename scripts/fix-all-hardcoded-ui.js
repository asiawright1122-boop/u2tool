/**
 * 批量修复所有工具组件的硬编码 UI 字符串
 * 
 * 策略：
 * 1. 分析每个有问题的组件
 * 2. 识别真正需要翻译的 UI 文本（排除示例数据和技术术语）
 * 3. 为每个工具添加翻译键到所有 10 种语言
 * 4. 更新组件使用翻译函数
 */

const fs = require('fs');
const path = require('path');

// 10 种支持的语言
const LOCALES = ['en', 'zh', 'ja', 'ko', 'es', 'pt', 'fr', 'de', 'ru', 'ar'];

// 需要翻译的工具及其 UI 文本
const toolsToFix = {
  'cost-benefit-analyzer': {
    keys: {
      recurring: { en: 'Recurring', zh: '周期性', ja: '定期', ko: '반복', es: 'Recurrente', pt: 'Recorrente', fr: 'Récurrent', de: 'Wiederkehrend', ru: 'Периодический', ar: 'متكرر' },
      monthly: { en: 'Monthly', zh: '每月', ja: '毎月', ko: '월간', es: 'Mensual', pt: 'Mensal', fr: 'Mensuel', de: 'Monatlich', ru: 'Ежемесячно', ar: 'شهري' },
      quarterly: { en: 'Quarterly', zh: '每季度', ja: '四半期', ko: '분기별', es: 'Trimestral', pt: 'Trimestral', fr: 'Trimestriel', de: 'Vierteljährlich', ru: 'Ежеквартально', ar: 'ربع سنوي' },
      yearly: { en: 'Yearly', zh: '每年', ja: '毎年', ko: '연간', es: 'Anual', pt: 'Anual', fr: 'Annuel', de: 'Jährlich', ru: 'Ежегодно', ar: 'سنوي' },
      oneTime: { en: 'One-time', zh: '一次性', ja: '一回限り', ko: '일회성', es: 'Único', pt: 'Único', fr: 'Unique', de: 'Einmalig', ru: 'Разовый', ar: 'مرة واحدة' },
      benefits: { en: 'Benefits', zh: '收益', ja: '利益', ko: '이익', es: 'Beneficios', pt: 'Benefícios', fr: 'Avantages', de: 'Vorteile', ru: 'Выгоды', ar: 'الفوائد' },
      costs: { en: 'Costs', zh: '成本', ja: 'コスト', ko: '비용', es: 'Costos', pt: 'Custos', fr: 'Coûts', de: 'Kosten', ru: 'Затраты', ar: 'التكاليف' },
      netBenefit: { en: 'Net Benefit', zh: '净收益', ja: '純利益', ko: '순이익', es: 'Beneficio Neto', pt: 'Benefício Líquido', fr: 'Bénéfice Net', de: 'Nettonutzen', ru: 'Чистая выгода', ar: 'صافي الفائدة' },
      roi: { en: 'ROI', zh: '投资回报率', ja: 'ROI', ko: 'ROI', es: 'ROI', pt: 'ROI', fr: 'ROI', de: 'ROI', ru: 'ROI', ar: 'العائد على الاستثمار' },
      paybackPeriod: { en: 'Payback Period', zh: '回收期', ja: '回収期間', ko: '회수 기간', es: 'Período de Recuperación', pt: 'Período de Retorno', fr: 'Période de Récupération', de: 'Amortisationszeit', ru: 'Срок окупаемости', ar: 'فترة الاسترداد' },
      addBenefit: { en: 'Add Benefit', zh: '添加收益', ja: '利益を追加', ko: '이익 추가', es: 'Agregar Beneficio', pt: 'Adicionar Benefício', fr: 'Ajouter un Avantage', de: 'Vorteil hinzufügen', ru: 'Добавить выгоду', ar: 'إضافة فائدة' },
      addCost: { en: 'Add Cost', zh: '添加成本', ja: 'コストを追加', ko: '비용 추가', es: 'Agregar Costo', pt: 'Adicionar Custo', fr: 'Ajouter un Coût', de: 'Kosten hinzufügen', ru: 'Добавить затраты', ar: 'إضافة تكلفة' },
    }
  },

  'invoice-template-generator': {
    keys: {
      from: { en: 'From', zh: '发件人', ja: '差出人', ko: '발신인', es: 'De', pt: 'De', fr: 'De', de: 'Von', ru: 'От', ar: 'من' },
      billTo: { en: 'Bill To', zh: '收款人', ja: '請求先', ko: '청구 대상', es: 'Facturar a', pt: 'Faturar para', fr: 'Facturer à', de: 'Rechnung an', ru: 'Счёт для', ar: 'فاتورة إلى' },
      invoiceDate: { en: 'Invoice Date', zh: '发票日期', ja: '請求日', ko: '청구서 날짜', es: 'Fecha de Factura', pt: 'Data da Fatura', fr: 'Date de Facture', de: 'Rechnungsdatum', ru: 'Дата счёта', ar: 'تاريخ الفاتورة' },
      dueDate: { en: 'Due Date', zh: '到期日', ja: '支払期限', ko: '만기일', es: 'Fecha de Vencimiento', pt: 'Data de Vencimento', fr: 'Date d\'Échéance', de: 'Fälligkeitsdatum', ru: 'Срок оплаты', ar: 'تاريخ الاستحقاق' },
      description: { en: 'Description', zh: '描述', ja: '説明', ko: '설명', es: 'Descripción', pt: 'Descrição', fr: 'Description', de: 'Beschreibung', ru: 'Описание', ar: 'الوصف' },
      quantity: { en: 'Quantity', zh: '数量', ja: '数量', ko: '수량', es: 'Cantidad', pt: 'Quantidade', fr: 'Quantité', de: 'Menge', ru: 'Количество', ar: 'الكمية' },
      unitPrice: { en: 'Unit Price', zh: '单价', ja: '単価', ko: '단가', es: 'Precio Unitario', pt: 'Preço Unitário', fr: 'Prix Unitaire', de: 'Stückpreis', ru: 'Цена за единицу', ar: 'سعر الوحدة' },
      total: { en: 'Total', zh: '总计', ja: '合計', ko: '합계', es: 'Total', pt: 'Total', fr: 'Total', de: 'Gesamt', ru: 'Итого', ar: 'المجموع' },
      subtotal: { en: 'Subtotal', zh: '小计', ja: '小計', ko: '소계', es: 'Subtotal', pt: 'Subtotal', fr: 'Sous-total', de: 'Zwischensumme', ru: 'Промежуточный итог', ar: 'المجموع الفرعي' },
      tax: { en: 'Tax', zh: '税', ja: '税金', ko: '세금', es: 'Impuesto', pt: 'Imposto', fr: 'Taxe', de: 'Steuer', ru: 'Налог', ar: 'الضريبة' },
    }
  },
  'meeting-minutes-generator': {
    keys: {
      attendees: { en: 'Attendees', zh: '出席者', ja: '出席者', ko: '참석자', es: 'Asistentes', pt: 'Participantes', fr: 'Participants', de: 'Teilnehmer', ru: 'Участники', ar: 'الحضور' },
      absent: { en: 'Absent', zh: '缺席', ja: '欠席', ko: '불참', es: 'Ausente', pt: 'Ausente', fr: 'Absent', de: 'Abwesend', ru: 'Отсутствует', ar: 'غائب' },
      agenda: { en: 'Agenda', zh: '议程', ja: '議題', ko: '안건', es: 'Agenda', pt: 'Agenda', fr: 'Ordre du jour', de: 'Tagesordnung', ru: 'Повестка дня', ar: 'جدول الأعمال' },
      discussion: { en: 'Discussion', zh: '讨论', ja: '議論', ko: '토론', es: 'Discusión', pt: 'Discussão', fr: 'Discussion', de: 'Diskussion', ru: 'Обсуждение', ar: 'المناقشة' },
      decisions: { en: 'Decisions', zh: '决定', ja: '決定事項', ko: '결정 사항', es: 'Decisiones', pt: 'Decisões', fr: 'Décisions', de: 'Entscheidungen', ru: 'Решения', ar: 'القرارات' },
      actionItems: { en: 'Action Items', zh: '行动项', ja: 'アクションアイテム', ko: '실행 항목', es: 'Acciones', pt: 'Itens de Ação', fr: 'Actions', de: 'Aktionspunkte', ru: 'Задачи', ar: 'بنود العمل' },
      nextMeeting: { en: 'Next Meeting', zh: '下次会议', ja: '次回会議', ko: '다음 회의', es: 'Próxima Reunión', pt: 'Próxima Reunião', fr: 'Prochaine Réunion', de: 'Nächstes Meeting', ru: 'Следующая встреча', ar: 'الاجتماع القادم' },
    }
  },
  'table-of-contents-generator': {
    keys: {
      style: { en: 'Style', zh: '样式', ja: 'スタイル', ko: '스타일', es: 'Estilo', pt: 'Estilo', fr: 'Style', de: 'Stil', ru: 'Стиль', ar: 'النمط' },
      dotted: { en: 'Dotted', zh: '点线', ja: '点線', ko: '점선', es: 'Punteado', pt: 'Pontilhado', fr: 'Pointillé', de: 'Gepunktet', ru: 'Пунктирный', ar: 'منقط' },
      lined: { en: 'Lined', zh: '线条', ja: '線', ko: '선', es: 'Línea', pt: 'Linha', fr: 'Ligne', de: 'Linie', ru: 'Линия', ar: 'خط' },
      simple: { en: 'Simple', zh: '简单', ja: 'シンプル', ko: '단순', es: 'Simple', pt: 'Simples', fr: 'Simple', de: 'Einfach', ru: 'Простой', ar: 'بسيط' },
      numbered: { en: 'Numbered', zh: '编号', ja: '番号付き', ko: '번호', es: 'Numerado', pt: 'Numerado', fr: 'Numéroté', de: 'Nummeriert', ru: 'Нумерованный', ar: 'مرقم' },
      maxDepth: { en: 'Max Depth', zh: '最大深度', ja: '最大深度', ko: '최대 깊이', es: 'Profundidad Máxima', pt: 'Profundidade Máxima', fr: 'Profondeur Max', de: 'Max. Tiefe', ru: 'Макс. глубина', ar: 'أقصى عمق' },
      includePageNumbers: { en: 'Include Page Numbers', zh: '包含页码', ja: 'ページ番号を含む', ko: '페이지 번호 포함', es: 'Incluir Números de Página', pt: 'Incluir Números de Página', fr: 'Inclure les Numéros de Page', de: 'Seitenzahlen einschließen', ru: 'Включить номера страниц', ar: 'تضمين أرقام الصفحات' },
    }
  },

  'prettier-config-generator': {
    keys: {
      none: { en: 'None', zh: '无', ja: 'なし', ko: '없음', es: 'Ninguno', pt: 'Nenhum', fr: 'Aucun', de: 'Keine', ru: 'Нет', ar: 'لا شيء' },
      all: { en: 'All', zh: '全部', ja: 'すべて', ko: '모두', es: 'Todos', pt: 'Todos', fr: 'Tous', de: 'Alle', ru: 'Все', ar: 'الكل' },
      always: { en: 'Always', zh: '总是', ja: '常に', ko: '항상', es: 'Siempre', pt: 'Sempre', fr: 'Toujours', de: 'Immer', ru: 'Всегда', ar: 'دائماً' },
      avoid: { en: 'Avoid', zh: '避免', ja: '避ける', ko: '피하기', es: 'Evitar', pt: 'Evitar', fr: 'Éviter', de: 'Vermeiden', ru: 'Избегать', ar: 'تجنب' },
      auto: { en: 'Auto', zh: '自动', ja: '自動', ko: '자동', es: 'Auto', pt: 'Auto', fr: 'Auto', de: 'Auto', ru: 'Авто', ar: 'تلقائي' },
      preserve: { en: 'Preserve', zh: '保留', ja: '保持', ko: '유지', es: 'Preservar', pt: 'Preservar', fr: 'Préserver', de: 'Beibehalten', ru: 'Сохранить', ar: 'الحفاظ' },
    }
  },
  'document-outline-generator': {
    keys: {
      format: { en: 'Format', zh: '格式', ja: 'フォーマット', ko: '형식', es: 'Formato', pt: 'Formato', fr: 'Format', de: 'Format', ru: 'Формат', ar: 'التنسيق' },
      markdown: { en: 'Markdown', zh: 'Markdown', ja: 'Markdown', ko: 'Markdown', es: 'Markdown', pt: 'Markdown', fr: 'Markdown', de: 'Markdown', ru: 'Markdown', ar: 'Markdown' },
      plainText: { en: 'Plain Text', zh: '纯文本', ja: 'プレーンテキスト', ko: '일반 텍스트', es: 'Texto Plano', pt: 'Texto Simples', fr: 'Texte Brut', de: 'Klartext', ru: 'Простой текст', ar: 'نص عادي' },
      maxDepth: { en: 'Max Depth', zh: '最大深度', ja: '最大深度', ko: '최대 깊이', es: 'Profundidad Máxima', pt: 'Profundidade Máxima', fr: 'Profondeur Max', de: 'Max. Tiefe', ru: 'Макс. глубина', ar: 'أقصى عمق' },
      numbered: { en: 'Numbered', zh: '编号', ja: '番号付き', ko: '번호', es: 'Numerado', pt: 'Numerado', fr: 'Numéroté', de: 'Nummeriert', ru: 'Нумерованный', ar: 'مرقم' },
    }
  },
  'git-history-visualizer': {
    keys: {
      hash: { en: 'Hash', zh: '哈希', ja: 'ハッシュ', ko: '해시', es: 'Hash', pt: 'Hash', fr: 'Hash', de: 'Hash', ru: 'Хеш', ar: 'التجزئة' },
      message: { en: 'Message', zh: '消息', ja: 'メッセージ', ko: '메시지', es: 'Mensaje', pt: 'Mensagem', fr: 'Message', de: 'Nachricht', ru: 'Сообщение', ar: 'الرسالة' },
      author: { en: 'Author', zh: '作者', ja: '作者', ko: '작성자', es: 'Autor', pt: 'Autor', fr: 'Auteur', de: 'Autor', ru: 'Автор', ar: 'المؤلف' },
      date: { en: 'Date', zh: '日期', ja: '日付', ko: '날짜', es: 'Fecha', pt: 'Data', fr: 'Date', de: 'Datum', ru: 'Дата', ar: 'التاريخ' },
      legend: { en: 'Legend', zh: '图例', ja: '凡例', ko: '범례', es: 'Leyenda', pt: 'Legenda', fr: 'Légende', de: 'Legende', ru: 'Легенда', ar: 'وسيلة الإيضاح' },
      branch: { en: 'Branch', zh: '分支', ja: 'ブランチ', ko: '브랜치', es: 'Rama', pt: 'Branch', fr: 'Branche', de: 'Branch', ru: 'Ветка', ar: 'الفرع' },
    }
  },
  'unused-imports-finder': {
    keys: {
      importStatements: { en: 'Import Statements', zh: '导入语句', ja: 'インポート文', ko: '가져오기 문', es: 'Declaraciones de Importación', pt: 'Declarações de Importação', fr: 'Déclarations d\'Import', de: 'Import-Anweisungen', ru: 'Операторы импорта', ar: 'عبارات الاستيراد' },
      unusedImports: { en: 'Unused Imports', zh: '未使用的导入', ja: '未使用のインポート', ko: '사용되지 않는 가져오기', es: 'Importaciones No Usadas', pt: 'Importações Não Utilizadas', fr: 'Imports Non Utilisés', de: 'Unbenutzte Imports', ru: 'Неиспользуемые импорты', ar: 'الاستيرادات غير المستخدمة' },
      usedImports: { en: 'Used Imports', zh: '已使用的导入', ja: '使用中のインポート', ko: '사용된 가져오기', es: 'Importaciones Usadas', pt: 'Importações Utilizadas', fr: 'Imports Utilisés', de: 'Benutzte Imports', ru: 'Используемые импорты', ar: 'الاستيرادات المستخدمة' },
    }
  },

  'dependency-vulnerability-checker': {
    keys: {
      dependencies: { en: 'Dependencies', zh: '依赖项', ja: '依存関係', ko: '의존성', es: 'Dependencias', pt: 'Dependências', fr: 'Dépendances', de: 'Abhängigkeiten', ru: 'Зависимости', ar: 'التبعيات' },
      vulnerabilities: { en: 'Vulnerabilities', zh: '漏洞', ja: '脆弱性', ko: '취약점', es: 'Vulnerabilidades', pt: 'Vulnerabilidades', fr: 'Vulnérabilités', de: 'Schwachstellen', ru: 'Уязвимости', ar: 'الثغرات' },
      critical: { en: 'Critical', zh: '严重', ja: '重大', ko: '심각', es: 'Crítico', pt: 'Crítico', fr: 'Critique', de: 'Kritisch', ru: 'Критический', ar: 'حرج' },
      high: { en: 'High', zh: '高', ja: '高', ko: '높음', es: 'Alto', pt: 'Alto', fr: 'Élevé', de: 'Hoch', ru: 'Высокий', ar: 'عالي' },
      medium: { en: 'Medium', zh: '中', ja: '中', ko: '중간', es: 'Medio', pt: 'Médio', fr: 'Moyen', de: 'Mittel', ru: 'Средний', ar: 'متوسط' },
      low: { en: 'Low', zh: '低', ja: '低', ko: '낮음', es: 'Bajo', pt: 'Baixo', fr: 'Faible', de: 'Niedrig', ru: 'Низкий', ar: 'منخفض' },
      foundVulnerabilities: { en: 'Found Vulnerabilities', zh: '发现的漏洞', ja: '発見された脆弱性', ko: '발견된 취약점', es: 'Vulnerabilidades Encontradas', pt: 'Vulnerabilidades Encontradas', fr: 'Vulnérabilités Trouvées', de: 'Gefundene Schwachstellen', ru: 'Найденные уязвимости', ar: 'الثغرات المكتشفة' },
    }
  },
  'git-tag-manager': {
    keys: {
      lightweight: { en: 'Lightweight', zh: '轻量级', ja: '軽量', ko: '경량', es: 'Ligero', pt: 'Leve', fr: 'Léger', de: 'Leichtgewichtig', ru: 'Легкий', ar: 'خفيف' },
      annotated: { en: 'Annotated', zh: '注释', ja: '注釈付き', ko: '주석', es: 'Anotado', pt: 'Anotado', fr: 'Annoté', de: 'Annotiert', ru: 'Аннотированный', ar: 'مشروح' },
      usefulCommands: { en: 'Useful Commands', zh: '有用的命令', ja: '便利なコマンド', ko: '유용한 명령어', es: 'Comandos Útiles', pt: 'Comandos Úteis', fr: 'Commandes Utiles', de: 'Nützliche Befehle', ru: 'Полезные команды', ar: 'أوامر مفيدة' },
      semverGuide: { en: 'Semver Guide', zh: '语义版本指南', ja: 'Semverガイド', ko: 'Semver 가이드', es: 'Guía Semver', pt: 'Guia Semver', fr: 'Guide Semver', de: 'Semver-Leitfaden', ru: 'Руководство Semver', ar: 'دليل Semver' },
      breakingChanges: { en: 'Breaking changes', zh: '破坏性更改', ja: '破壊的変更', ko: '주요 변경 사항', es: 'Cambios importantes', pt: 'Mudanças importantes', fr: 'Changements majeurs', de: 'Breaking Changes', ru: 'Критические изменения', ar: 'تغييرات جذرية' },
      bugFixes: { en: 'Bug fixes', zh: '错误修复', ja: 'バグ修正', ko: '버그 수정', es: 'Correcciones', pt: 'Correções', fr: 'Corrections', de: 'Fehlerbehebungen', ru: 'Исправления', ar: 'إصلاحات' },
    }
  },
  'html-to-pdf': {
    keys: {
      letter: { en: 'Letter', zh: '信纸', ja: 'レター', ko: '레터', es: 'Carta', pt: 'Carta', fr: 'Lettre', de: 'Letter', ru: 'Letter', ar: 'رسالة' },
      legal: { en: 'Legal', zh: '法律文书', ja: 'リーガル', ko: '리걸', es: 'Legal', pt: 'Legal', fr: 'Légal', de: 'Legal', ru: 'Legal', ar: 'قانوني' },
      a4: { en: 'A4', zh: 'A4', ja: 'A4', ko: 'A4', es: 'A4', pt: 'A4', fr: 'A4', de: 'A4', ru: 'A4', ar: 'A4' },
      htmlPreview: { en: 'HTML Preview', zh: 'HTML 预览', ja: 'HTMLプレビュー', ko: 'HTML 미리보기', es: 'Vista Previa HTML', pt: 'Pré-visualização HTML', fr: 'Aperçu HTML', de: 'HTML-Vorschau', ru: 'Предпросмотр HTML', ar: 'معاينة HTML' },
    }
  },
  'css-minifier': {
    keys: {
      originalSize: { en: 'Original Size', zh: '原始大小', ja: '元のサイズ', ko: '원본 크기', es: 'Tamaño Original', pt: 'Tamanho Original', fr: 'Taille Originale', de: 'Originalgröße', ru: 'Исходный размер', ar: 'الحجم الأصلي' },
      minifiedSize: { en: 'Minified Size', zh: '压缩后大小', ja: '圧縮後サイズ', ko: '압축 크기', es: 'Tamaño Minificado', pt: 'Tamanho Minificado', fr: 'Taille Minifiée', de: 'Minimierte Größe', ru: 'Сжатый размер', ar: 'الحجم المصغر' },
      sizeReduced: { en: 'Size Reduced', zh: '减少大小', ja: 'サイズ削減', ko: '크기 감소', es: 'Tamaño Reducido', pt: 'Tamanho Reduzido', fr: 'Taille Réduite', de: 'Größe reduziert', ru: 'Уменьшение размера', ar: 'تقليل الحجم' },
    }
  },

  'citation-formatter': {
    keys: {
      book: { en: 'Book', zh: '书籍', ja: '書籍', ko: '도서', es: 'Libro', pt: 'Livro', fr: 'Livre', de: 'Buch', ru: 'Книга', ar: 'كتاب' },
      journalArticle: { en: 'Journal Article', zh: '期刊文章', ja: '学術論文', ko: '학술 논문', es: 'Artículo de Revista', pt: 'Artigo de Revista', fr: 'Article de Journal', de: 'Zeitschriftenartikel', ru: 'Журнальная статья', ar: 'مقال صحفي' },
      article: { en: 'Article', zh: '文章', ja: '記事', ko: '기사', es: 'Artículo', pt: 'Artigo', fr: 'Article', de: 'Artikel', ru: 'Статья', ar: 'مقال' },
      website: { en: 'Website', zh: '网站', ja: 'ウェブサイト', ko: '웹사이트', es: 'Sitio Web', pt: 'Site', fr: 'Site Web', de: 'Webseite', ru: 'Веб-сайт', ar: 'موقع إلكتروني' },
    }
  },
  'eslint-config-generator': {
    keys: {
      browser: { en: 'Browser', zh: '浏览器', ja: 'ブラウザ', ko: '브라우저', es: 'Navegador', pt: 'Navegador', fr: 'Navigateur', de: 'Browser', ru: 'Браузер', ar: 'المتصفح' },
      off: { en: 'Off', zh: '关闭', ja: 'オフ', ko: '끄기', es: 'Desactivado', pt: 'Desligado', fr: 'Désactivé', de: 'Aus', ru: 'Выкл', ar: 'إيقاف' },
      warn: { en: 'Warn', zh: '警告', ja: '警告', ko: '경고', es: 'Advertencia', pt: 'Aviso', fr: 'Avertissement', de: 'Warnung', ru: 'Предупреждение', ar: 'تحذير' },
      error: { en: 'Error', zh: '错误', ja: 'エラー', ko: '오류', es: 'Error', pt: 'Erro', fr: 'Erreur', de: 'Fehler', ru: 'Ошибка', ar: 'خطأ' },
    }
  },
  'meeting-agenda-builder': {
    keys: {
      agenda: { en: 'Agenda', zh: '议程', ja: '議題', ko: '안건', es: 'Agenda', pt: 'Agenda', fr: 'Ordre du jour', de: 'Tagesordnung', ru: 'Повестка дня', ar: 'جدول الأعمال' },
      time: { en: 'Time', zh: '时间', ja: '時間', ko: '시간', es: 'Hora', pt: 'Hora', fr: 'Heure', de: 'Zeit', ru: 'Время', ar: 'الوقت' },
      topic: { en: 'Topic', zh: '主题', ja: 'トピック', ko: '주제', es: 'Tema', pt: 'Tópico', fr: 'Sujet', de: 'Thema', ru: 'Тема', ar: 'الموضوع' },
      duration: { en: 'Duration', zh: '时长', ja: '所要時間', ko: '기간', es: 'Duración', pt: 'Duração', fr: 'Durée', de: 'Dauer', ru: 'Продолжительность', ar: 'المدة' },
      presenter: { en: 'Presenter', zh: '主持人', ja: '発表者', ko: '발표자', es: 'Presentador', pt: 'Apresentador', fr: 'Présentateur', de: 'Präsentator', ru: 'Докладчик', ar: 'المقدم' },
    }
  },
  'memory-leak-detector': {
    keys: {
      memorySafetyScore: { en: 'Memory Safety Score', zh: '内存安全评分', ja: 'メモリ安全スコア', ko: '메모리 안전 점수', es: 'Puntuación de Seguridad de Memoria', pt: 'Pontuação de Segurança de Memória', fr: 'Score de Sécurité Mémoire', de: 'Speichersicherheitsbewertung', ru: 'Оценка безопасности памяти', ar: 'درجة أمان الذاكرة' },
      high: { en: 'High', zh: '高', ja: '高', ko: '높음', es: 'Alto', pt: 'Alto', fr: 'Élevé', de: 'Hoch', ru: 'Высокий', ar: 'عالي' },
      medium: { en: 'Medium', zh: '中', ja: '中', ko: '중간', es: 'Medio', pt: 'Médio', fr: 'Moyen', de: 'Mittel', ru: 'Средний', ar: 'متوسط' },
      low: { en: 'Low', zh: '低', ja: '低', ko: '낮음', es: 'Bajo', pt: 'Baixo', fr: 'Faible', de: 'Niedrig', ru: 'Низкий', ar: 'منخفض' },
      potentialMemoryLeaks: { en: 'Potential Memory Leaks', zh: '潜在内存泄漏', ja: '潜在的なメモリリーク', ko: '잠재적 메모리 누수', es: 'Posibles Fugas de Memoria', pt: 'Possíveis Vazamentos de Memória', fr: 'Fuites de Mémoire Potentielles', de: 'Potenzielle Speicherlecks', ru: 'Потенциальные утечки памяти', ar: 'تسربات الذاكرة المحتملة' },
    }
  },
  'text-to-pdf': {
    keys: {
      arial: { en: 'Arial', zh: 'Arial', ja: 'Arial', ko: 'Arial', es: 'Arial', pt: 'Arial', fr: 'Arial', de: 'Arial', ru: 'Arial', ar: 'Arial' },
      times: { en: 'Times', zh: 'Times', ja: 'Times', ko: 'Times', es: 'Times', pt: 'Times', fr: 'Times', de: 'Times', ru: 'Times', ar: 'Times' },
      courier: { en: 'Courier', zh: 'Courier', ja: 'Courier', ko: 'Courier', es: 'Courier', pt: 'Courier', fr: 'Courier', de: 'Courier', ru: 'Courier', ar: 'Courier' },
      letter: { en: 'Letter', zh: '信纸', ja: 'レター', ko: '레터', es: 'Carta', pt: 'Carta', fr: 'Lettre', de: 'Letter', ru: 'Letter', ar: 'رسالة' },
    }
  },

  'text-to-slug': {
    keys: {
      separator: { en: 'Separator', zh: '分隔符', ja: '区切り文字', ko: '구분자', es: 'Separador', pt: 'Separador', fr: 'Séparateur', de: 'Trennzeichen', ru: 'Разделитель', ar: 'الفاصل' },
      none: { en: 'None', zh: '无', ja: 'なし', ko: '없음', es: 'Ninguno', pt: 'Nenhum', fr: 'Aucun', de: 'Keine', ru: 'Нет', ar: 'لا شيء' },
      lowercase: { en: 'Lowercase', zh: '小写', ja: '小文字', ko: '소문자', es: 'Minúsculas', pt: 'Minúsculas', fr: 'Minuscules', de: 'Kleinbuchstaben', ru: 'Нижний регистр', ar: 'أحرف صغيرة' },
      slug: { en: 'Slug', zh: 'Slug', ja: 'スラッグ', ko: '슬러그', es: 'Slug', pt: 'Slug', fr: 'Slug', de: 'Slug', ru: 'Slug', ar: 'Slug' },
    }
  },
  'markdown-editor': {
    keys: {
      errorParsingMarkdown: { en: 'Error parsing markdown', zh: '解析 Markdown 出错', ja: 'Markdownの解析エラー', ko: 'Markdown 파싱 오류', es: 'Error al analizar markdown', pt: 'Erro ao analisar markdown', fr: 'Erreur d\'analyse markdown', de: 'Fehler beim Parsen von Markdown', ru: 'Ошибка разбора markdown', ar: 'خطأ في تحليل markdown' },
      list: { en: 'List', zh: '列表', ja: 'リスト', ko: '목록', es: 'Lista', pt: 'Lista', fr: 'Liste', de: 'Liste', ru: 'Список', ar: 'قائمة' },
      code: { en: 'Code', zh: '代码', ja: 'コード', ko: '코드', es: 'Código', pt: 'Código', fr: 'Code', de: 'Code', ru: 'Код', ar: 'كود' },
      link: { en: 'Link', zh: '链接', ja: 'リンク', ko: '링크', es: 'Enlace', pt: 'Link', fr: 'Lien', de: 'Link', ru: 'Ссылка', ar: 'رابط' },
      image: { en: 'Image', zh: '图片', ja: '画像', ko: '이미지', es: 'Imagen', pt: 'Imagem', fr: 'Image', de: 'Bild', ru: 'Изображение', ar: 'صورة' },
      quote: { en: 'Quote', zh: '引用', ja: '引用', ko: '인용', es: 'Cita', pt: 'Citação', fr: 'Citation', de: 'Zitat', ru: 'Цитата', ar: 'اقتباس' },
    }
  },
  'email-signature-generator': {
    keys: {
      linkedin: { en: 'LinkedIn', zh: 'LinkedIn', ja: 'LinkedIn', ko: 'LinkedIn', es: 'LinkedIn', pt: 'LinkedIn', fr: 'LinkedIn', de: 'LinkedIn', ru: 'LinkedIn', ar: 'LinkedIn' },
      twitter: { en: 'Twitter', zh: 'Twitter', ja: 'Twitter', ko: 'Twitter', es: 'Twitter', pt: 'Twitter', fr: 'Twitter', de: 'Twitter', ru: 'Twitter', ar: 'Twitter' },
      github: { en: 'GitHub', zh: 'GitHub', ja: 'GitHub', ko: 'GitHub', es: 'GitHub', pt: 'GitHub', fr: 'GitHub', de: 'GitHub', ru: 'GitHub', ar: 'GitHub' },
    }
  },
  'json-to-graphql': {
    keys: {
      string: { en: 'String', zh: '字符串', ja: '文字列', ko: '문자열', es: 'Cadena', pt: 'String', fr: 'Chaîne', de: 'String', ru: 'Строка', ar: 'نص' },
      int: { en: 'Int', zh: '整数', ja: '整数', ko: '정수', es: 'Entero', pt: 'Inteiro', fr: 'Entier', de: 'Integer', ru: 'Целое', ar: 'عدد صحيح' },
      float: { en: 'Float', zh: '浮点数', ja: '浮動小数点', ko: '부동소수점', es: 'Flotante', pt: 'Float', fr: 'Flottant', de: 'Float', ru: 'Дробное', ar: 'عدد عشري' },
      boolean: { en: 'Boolean', zh: '布尔值', ja: 'ブール値', ko: '불리언', es: 'Booleano', pt: 'Booleano', fr: 'Booléen', de: 'Boolean', ru: 'Логический', ar: 'منطقي' },
    }
  },
  'json-to-kotlin': {
    keys: {
      moshi: { en: 'Moshi', zh: 'Moshi', ja: 'Moshi', ko: 'Moshi', es: 'Moshi', pt: 'Moshi', fr: 'Moshi', de: 'Moshi', ru: 'Moshi', ar: 'Moshi' },
      gson: { en: 'Gson', zh: 'Gson', ja: 'Gson', ko: 'Gson', es: 'Gson', pt: 'Gson', fr: 'Gson', de: 'Gson', ru: 'Gson', ar: 'Gson' },
      kotlinxSerialization: { en: 'Kotlinx Serialization', zh: 'Kotlinx 序列化', ja: 'Kotlinx Serialization', ko: 'Kotlinx Serialization', es: 'Kotlinx Serialization', pt: 'Kotlinx Serialization', fr: 'Kotlinx Serialization', de: 'Kotlinx Serialization', ru: 'Kotlinx Serialization', ar: 'Kotlinx Serialization' },
    }
  },
  'json-to-python': {
    keys: {
      pydanticBaseModel: { en: 'Pydantic BaseModel', zh: 'Pydantic BaseModel', ja: 'Pydantic BaseModel', ko: 'Pydantic BaseModel', es: 'Pydantic BaseModel', pt: 'Pydantic BaseModel', fr: 'Pydantic BaseModel', de: 'Pydantic BaseModel', ru: 'Pydantic BaseModel', ar: 'Pydantic BaseModel' },
      typedDict: { en: 'TypedDict', zh: 'TypedDict', ja: 'TypedDict', ko: 'TypedDict', es: 'TypedDict', pt: 'TypedDict', fr: 'TypedDict', de: 'TypedDict', ru: 'TypedDict', ar: 'TypedDict' },
      plainClass: { en: 'Plain Class', zh: '普通类', ja: 'プレーンクラス', ko: '일반 클래스', es: 'Clase Simple', pt: 'Classe Simples', fr: 'Classe Simple', de: 'Einfache Klasse', ru: 'Простой класс', ar: 'فئة بسيطة' },
    }
  },
  'toml-json': {
    keys: {
      minified: { en: 'Minified', zh: '压缩', ja: '圧縮', ko: '압축', es: 'Minificado', pt: 'Minificado', fr: 'Minifié', de: 'Minimiert', ru: 'Сжатый', ar: 'مصغر' },
    }
  },
};


// 添加翻译到所有语言文件
function addTranslationsToAllLocales() {
  console.log('🔧 开始添加翻译到所有语言文件...\n');
  
  let totalAdded = 0;
  
  LOCALES.forEach(locale => {
    const filePath = path.join(__dirname, '..', 'src', 'messages', `${locale}.json`);
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    let addedCount = 0;
    
    Object.entries(toolsToFix).forEach(([toolSlug, toolData]) => {
      // 确保工具命名空间存在
      if (!data.tools[toolSlug]) {
        data.tools[toolSlug] = {};
      }
      
      // 添加每个翻译键
      Object.entries(toolData.keys).forEach(([key, translations]) => {
        if (!data.tools[toolSlug][key]) {
          data.tools[toolSlug][key] = translations[locale];
          addedCount++;
        }
      });
    });
    
    // 写回文件
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    console.log(`✓ ${locale}.json - 添加了 ${addedCount} 个翻译键`);
    totalAdded += addedCount;
  });
  
  console.log(`\n✅ 总共添加了 ${totalAdded} 个翻译键`);
}

// 运行
addTranslationsToAllLocales();

console.log('\n📝 下一步：运行 npx tsx scripts/split-translations.ts 更新拆分文件');
