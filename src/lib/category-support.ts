import type { ToolCategory } from '@/config/tools';
import type { Locale } from './i18n';
import { phaseEightSupportContent } from './category-support-phase8';
import { phaseElevenSupportContent } from './category-support-phase11';
import { phaseTwentySupportContent } from './category-support-phase20';
import { phaseThirtyFourSupportContent } from './category-support-phase34';
import { v13SupportContent } from './category-support-v13';

export interface CategorySupportWorkflow {
  description: string;
  title: string;
  toolSlugs: string[];
}

export interface CategorySupportContent {
  eyebrow: string;
  intro: string;
  note: string;
  noteTitle: string;
  title: string;
  highlights: string[];
  highlightsTitle: string;
  workflows: CategorySupportWorkflow[];
  workflowsTitle: string;
}

type SupportedCategory =
  | 'charts'
  | 'converters'
  | 'development'
  | 'encoding'
  | 'finance'
  | 'generators'
  | 'image'
  | 'lifestyle'
  | 'network'
  | 'office'
  | 'security'
  | 'text';
type SupportedLocale = 'ar' | 'de' | 'en' | 'es' | 'fr' | 'ja' | 'ko' | 'pt' | 'ru' | 'zh';
type SupportMap = Partial<Record<SupportedLocale, Partial<Record<SupportedCategory, CategorySupportContent>>>>;

export const phaseSixPriorityClusters: Array<{ category: SupportedCategory; locale: SupportedLocale }> = [
  { locale: 'de', category: 'office' },
  { locale: 'fr', category: 'office' },
  { locale: 'es', category: 'office' },
  { locale: 'pt', category: 'office' },
  { locale: 'ja', category: 'office' },
  { locale: 'de', category: 'image' },
  { locale: 'es', category: 'image' },
  { locale: 'ja', category: 'image' },
  { locale: 'ko', category: 'image' },
  { locale: 'de', category: 'finance' },
  { locale: 'fr', category: 'finance' },
  { locale: 'es', category: 'finance' },
  { locale: 'pt', category: 'finance' },
  { locale: 'ar', category: 'finance' },
];

const supportContent: SupportMap = {
  ar: {
    finance: {
      eyebrow: 'للتخطيط المالي العملي',
      title: 'أدوات مالية للاحتياجات اليومية والعمل الحر والتخطيط التجاري',
      intro:
        'تجمع هذه المجموعة بين تحويل العملات، التحقق من بيانات الدفع، التخطيط المالي، وإنشاء مستندات الأعمال حتى تتمكن من الانتقال من الحساب السريع إلى القرار العملي في مكان واحد.',
      highlightsTitle: 'المهام الأكثر شيوعاً في هذه الفئة',
      highlights: [
        'مقارنة تكاليف القروض والضرائب والعائد على الاستثمار قبل اتخاذ القرار.',
        'التحقق من IBAN وBIC/SWIFT وبيانات البطاقات عند العمل مع مدفوعات دولية.',
        'إعداد الفواتير وتقارير المصروفات ونماذج التوقعات بدون رفع ملفات حساسة.',
      ],
      workflowsTitle: 'مسارات عمل مقترحة',
      workflows: [
        {
          title: 'الحسابات الاستثمارية والربحية',
          description: 'استخدم أدوات الربحية والعائد والتنبؤ عندما تحتاج إلى تقييم مشروع أو تسعير أو خطة نمو.',
          toolSlugs: ['roi-calculator', 'break-even-calculator', 'financial-forecast-calculator'],
        },
        {
          title: 'المدفوعات والتحقق المالي',
          description: 'راجع بيانات الحسابات البنكية والتحويلات والبطاقات قبل الإرسال أو المشاركة مع فريقك.',
          toolSlugs: ['currency-converter', 'iban-validator', 'bic-swift-lookup'],
        },
        {
          title: 'الفواتير والمصروفات والتقارير',
          description: 'أنشئ مستندات تشغيلية واضحة وتابع الميزانية والتكاليف في سير عمل واحد.',
          toolSlugs: ['invoice-template-generator', 'expense-report-generator', 'budget-variance-analyzer'],
        },
      ],
      noteTitle: 'ملاحظة الثقة',
      note:
        'جميع الأدوات تعمل داخل المتصفح، وهو مهم خصوصاً عند التعامل مع أرقام مالية أو مسودات فواتير أو بيانات دفع.',
    },
  },
  de: {
    finance: {
      eyebrow: 'Fur Planung und Controlling',
      title: 'Finanz-Tools fur Wechselkurse, Kalkulationen und betriebliche Dokumente',
      intro:
        'Diese Kategorie deckt nicht nur Taschenrechner fur Zahlen ab, sondern typische Finanzjobs wie Budgetkontrolle, Margenplanung, Rechnungen und internationale Zahlungsdaten.',
      highlightsTitle: 'Wofur diese Kategorie stark ist',
      highlights: [
        'Wechselkurse, Hypotheken, Steuern und ROI in einem konsistenten Browser-Workflow vergleichen.',
        'IBAN-, BIC/SWIFT- und Kreditkartendaten vor Versand oder Freigabe prufen.',
        'Rechnungs-, Forecast- und Budget-Workflows ohne Export in fremde SaaS-Tools vorbereiten.',
      ],
      workflowsTitle: 'Empfohlene Workflows',
      workflows: [
        {
          title: 'Investition, Marge und Forecast',
          description: 'Bewerte Rentabilitat, Break-even und Preislogik, bevor du Angebote oder interne Budgets freigibst.',
          toolSlugs: ['roi-calculator', 'break-even-calculator', 'margin-calculator'],
        },
        {
          title: 'Internationale Zahlungen validieren',
          description: 'Prufe Kontodaten und Währungsannahmen, bevor sie in Rechnungen oder Vertragen landen.',
          toolSlugs: ['currency-converter', 'iban-validator', 'bic-swift-lookup'],
        },
        {
          title: 'Belege und Kostensteuerung',
          description: 'Erstelle Vorlagen fur Rechnungen und verknupfe sie mit Ausgaben- und Budgetkontrolle.',
          toolSlugs: ['invoice-template-generator', 'expense-report-generator', 'budget-variance-analyzer'],
        },
      ],
      noteTitle: 'Warum das hilft',
      note:
        'Fur Finance-Seiten zahlt Vertrauen: klare Begriffe, browserlokale Verarbeitung und erkennbare Arbeitsablaufe sind wichtiger als generische Tool-Listen.',
    },
    image: {
      eyebrow: 'Fur visuelle Produktionsjobs',
      title: 'Bild-Tools fur Konvertierung, Optimierung und schnelle Social-Media-Ausgabe',
      intro:
        'Die Bild-Kategorie ist am wertvollsten, wenn Besucher sofort erkennen, welche Tools sie fur Komprimierung, Formatwechsel, Wasserzeichen, QR-Codes oder Exportformate kombinieren konnen.',
      highlightsTitle: 'Haufige Bildaufgaben',
      highlights: [
        'Bilder komprimieren, konvertieren oder fur Web und Messenger in kleinere Formate exportieren.',
        'QR-Codes, Favicons, Wasserzeichen und Social-Media-Grafiken ohne Design-Software erstellen.',
        'SVG-, PNG-, WebP- und Base64-Workflows fur Produktseiten, Dokus und Marketingmaterial verbinden.',
      ],
      workflowsTitle: 'Sinnvolle Tool-Kombinationen',
      workflows: [
        {
          title: 'Dateien fur Web und Performance aufbereiten',
          description: 'Reduziere Dateigrosse und passe Formate an, bevor Assets in Seiten, Blogs oder Shops eingebunden werden.',
          toolSlugs: ['image-compressor', 'image-converter', 'image-to-webp'],
        },
        {
          title: 'Grafiken fur Marken und Kampagnen exportieren',
          description: 'Nutze Generatoren und Exporter fur QR, Favicons, Social-Assets und markierte Bilder.',
          toolSlugs: ['qr-generator', 'favicon-generator', 'image-watermark'],
        },
        {
          title: 'Technische Bildformate uberbrucken',
          description: 'Wechsle gezielt zwischen SVG, PNG und Base64, wenn du Bilder in Code, E-Mails oder CMS einbindest.',
          toolSlugs: ['svg-to-png', 'svg-to-image', 'base64-image-converter'],
        },
      ],
      noteTitle: 'SEO-Hinweis',
      note:
        'Diese Kategorie soll Suchintents wie Bild konvertieren, Bild komprimieren, QR Code erstellen und SVG in PNG umwandeln direkt abdecken, statt nur generische Bild-Tools zu nennen.',
    },
    office: {
      eyebrow: 'Fur Dokumente und Team-Operations',
      title: 'Office-Tools fur PDF-Workflows, Dokumentkonvertierung und Meeting-Organisation',
      intro:
        'Office-Traffic kommt selten uber das Wort Produktivitat allein. Relevanter sind konkrete Jobs wie PDF zusammenfugen, Lebenslauf erstellen, Excel konvertieren oder Meeting-Ablaufe strukturieren.',
      highlightsTitle: 'Jobs, die Besucher hier losen',
      highlights: [
        'PDF-Dateien zusammenfugen, teilen, komprimieren oder in Bild- und Textformate uberfuhren.',
        'Lebenslaufe, Signaturen, Notizen und andere Dokumente ohne lokale Software vorbereiten.',
        'Meetings, Kapazitatsplanung und Terminabstimmung mit klaren Einzeltools strukturieren.',
      ],
      workflowsTitle: 'Empfohlene Office-Workflows',
      workflows: [
        {
          title: 'PDF und Dokumentkonvertierung',
          description: 'Bearbeite PDFs und tausche Inhalte mit Text-, Bild- und Tabellenformaten aus.',
          toolSlugs: ['pdf-merger', 'pdf-splitter', 'pdf-to-text'],
        },
        {
          title: 'Lebenslauf und formale Unterlagen',
          description: 'Erstelle berufliche Dokumente und exportiere sie fur Bewerbungen oder interne Freigaben.',
          toolSlugs: ['invoice-generator', 'resume-builder', 'signature-pad'],
        },
        {
          title: 'Meetings, Planung und Team-Taktung',
          description: 'Halte Aufgaben, Verfugbarkeit und Agenda in einem schlanken Browser-Workflow zusammen.',
          toolSlugs: ['meeting-notes', 'meeting-agenda-builder', 'pomodoro-timer'],
        },
      ],
      noteTitle: 'Warum das wichtig ist',
      note:
        'Die Office-Kategorie soll Suchanfragen rund um PDF-Tools, Dokumentkonvertierung, Resume Builder und Meeting-Organisation klar beantworten, damit die Seite nicht in generischer Sammelnavigation untergeht.',
    },
  },
  es: {
    finance: {
      eyebrow: 'Para decisiones y operaciones',
      title: 'Herramientas financieras para divisas, rentabilidad, impuestos y documentos de negocio',
      intro:
        'Esta categoria funciona mejor cuando conecta calculos financieros con tareas reales: validar datos bancarios, medir ROI, preparar facturas y controlar presupuestos sin salir del navegador.',
      highlightsTitle: 'Intenciones que cubre esta categoria',
      highlights: [
        'Comparar tipo de cambio, margen, impuestos y retorno antes de tomar una decision.',
        'Revisar IBAN, BIC/SWIFT y datos de tarjeta para operaciones y pagos internacionales.',
        'Crear plantillas de factura, reportes de gastos y previsiones financieras con privacidad local.',
      ],
      workflowsTitle: 'Flujos sugeridos',
      workflows: [
        {
          title: 'Rentabilidad y escenarios de negocio',
          description: 'Calcula retorno, punto de equilibrio y margen cuando preparas precios, inversiones o planes de ventas.',
          toolSlugs: ['roi-calculator', 'break-even-calculator', 'margin-calculator'],
        },
        {
          title: 'Pagos y validacion internacional',
          description: 'Comprueba datos bancarios y monedas antes de compartirlos con clientes o proveedores.',
          toolSlugs: ['currency-converter', 'iban-validator', 'bic-swift-lookup'],
        },
        {
          title: 'Facturacion y control interno',
          description: 'Relaciona documentos de cobro con seguimiento de gastos y desviaciones presupuestarias.',
          toolSlugs: ['invoice-template-generator', 'expense-report-generator', 'budget-variance-analyzer'],
        },
      ],
      noteTitle: 'Nota de confianza',
      note:
        'Las paginas de finanzas necesitan mas precision que una lista generica de calculadoras: por eso esta categoria prioriza casos de uso concretos y procesamiento local.',
    },
    image: {
      eyebrow: 'Para creadores y equipos web',
      title: 'Herramientas de imagen para convertir, comprimir, redimensionar y exportar graficos',
      intro:
        'La categoria de imagen debe responder a tareas claras como convertir PNG a SVG, comprimir imagenes para web, preparar favicons o generar QR para campañas y documentos.',
      highlightsTitle: 'Lo que puedes resolver aqui',
      highlights: [
        'Optimizar imagenes para sitios web, ecommerce, blogs y mensajeria.',
        'Crear recursos de marca como QR, favicons, marcas de agua y tamaños para redes sociales.',
        'Mover imagenes entre SVG, PNG, WebP y Base64 sin abrir software pesado.',
      ],
      workflowsTitle: 'Combinaciones utiles',
      workflows: [
        {
          title: 'Optimizar archivos para web',
          description: 'Reduce peso y cambia formato antes de publicar imagenes en paginas o apps.',
          toolSlugs: ['image-compressor', 'image-converter', 'image-to-webp'],
        },
        {
          title: 'Crear recursos listos para publicar',
          description: 'Genera activos visuales rapidos para branding, social media y materiales compartibles.',
          toolSlugs: ['qr-generator', 'social-media-size-guide', 'image-watermark'],
        },
        {
          title: 'Pasar entre formatos tecnicos',
          description: 'Convierte recursos entre vectores, mapas de bits y cadenas incrustables.',
          toolSlugs: ['svg-to-png', 'png-to-svg', 'base64-image-converter'],
        },
      ],
      noteTitle: 'Enfoque SEO',
      note:
        'Este bloque refuerza intenciones como comprimir imagen, convertir imagen, SVG a PNG y crear QR, que suelen generar trafico mas natural que una categoria visual demasiado amplia.',
    },
    office: {
      eyebrow: 'Para documentos y productividad real',
      title: 'Herramientas de oficina para PDF, curriculos, hojas de calculo y reuniones',
      intro:
        'La categoria de oficina gana relevancia cuando agrupa trabajos concretos: editar PDF, convertir Excel, preparar curriculos, capturar notas y organizar reuniones sin depender de suites pesadas.',
      highlightsTitle: 'Casos de uso frecuentes',
      highlights: [
        'Unir, dividir, comprimir o extraer texto de PDF para flujos documentales diarios.',
        'Preparar CV, firmas, notas y documentos listos para compartir o exportar.',
        'Planificar reuniones, agendas y disponibilidad con herramientas ligeras para equipos.',
      ],
      workflowsTitle: 'Rutas de trabajo recomendadas',
      workflows: [
        {
          title: 'PDF y conversion de documentos',
          description: 'Pasa de PDF a texto, imagen o formatos de hoja de calculo segun la tarea.',
          toolSlugs: ['pdf-merger', 'pdf-splitter', 'pdf-to-text'],
        },
        {
          title: 'Curriculos y documentos personales',
          description: 'Crea documentos formales y prepara exportaciones para postulaciones o entregas.',
          toolSlugs: ['invoice-generator', 'resume-builder', 'signature-pad'],
        },
        {
          title: 'Reuniones y coordinacion',
          description: 'Mantén agendas, notas y horarios conectados en un flujo simple desde el navegador.',
          toolSlugs: ['meeting-notes', 'meeting-agenda-builder', 'pomodoro-timer'],
        },
      ],
      noteTitle: 'Por que ayuda',
      note:
        'Asi la categoria deja de depender de la palabra productividad y empieza a cubrir intenciones utiles como herramientas PDF, creador de CV, convertir Excel o notas de reunion.',
    },
  },
  fr: {
    finance: {
      eyebrow: 'Pour pilotage et operations',
      title: 'Outils financiers pour devises, calculs de rentabilite et documents de gestion',
      intro:
        'Cette categorie est plus utile quand elle relie les calculs financiers a des situations concretes: valider des coordonnees de paiement, estimer un ROI, gerer des ecarts budgetaires ou produire une facture.',
      highlightsTitle: 'Intentions couvertes',
      highlights: [
        'Comparer devises, marges, taxes et retour sur investissement avant une decision.',
        'Verifier IBAN, BIC/SWIFT et donnees de carte pour des operations plus fiables.',
        'Assembler factures, notes de frais et previsions sans envoyer de donnees sensibles ailleurs.',
      ],
      workflowsTitle: 'Parcours recommandes',
      workflows: [
        {
          title: 'ROI, marge et prevision',
          description: 'Mesurez la rentabilite d une offre, d un projet ou d un scenario commercial.',
          toolSlugs: ['roi-calculator', 'margin-calculator', 'financial-forecast-calculator'],
        },
        {
          title: 'Paiements et controles',
          description: 'Validez monnaies et coordonnees bancaires avant envoi a un client ou a un partenaire.',
          toolSlugs: ['currency-converter', 'iban-validator', 'bic-swift-lookup'],
        },
        {
          title: 'Factures et suivi des depenses',
          description: 'Reliez la preparation de documents de gestion a un suivi plus propre des couts.',
          toolSlugs: ['invoice-template-generator', 'expense-report-generator', 'cost-benefit-analyzer'],
        },
      ],
      noteTitle: 'Signal de confiance',
      note:
        'Pour une categorie finance, la clarte du vocabulaire et le traitement local dans le navigateur comptent fortement pour la confiance et le trafic de qualite.',
    },
    office: {
      eyebrow: 'Pour documents et coordination',
      title: 'Outils de bureau pour PDF, CV, feuilles de calcul et organisation de reunion',
      intro:
        'Le trafic bureau arrive surtout via des taches explicites: fusion PDF, conversion Excel, creation de CV, compte rendu de reunion ou gestion d agenda. La page doit donc parler metier, pas seulement productivite.',
      highlightsTitle: 'Taches les plus frequentes',
      highlights: [
        'Fusionner, compresser, convertir et extraire du texte de fichiers PDF.',
        'Creer des CV, signatures et documents prets a partager ou exporter.',
        'Structurer agendas, disponibilites et notes pour les equipes distribuees.',
      ],
      workflowsTitle: 'Workflows utiles',
      workflows: [
        {
          title: 'PDF et echanges documentaires',
          description: 'Gerez les transformations les plus courantes autour des PDF et du texte.',
          toolSlugs: ['pdf-merger', 'pdf-compressor', 'pdf-to-text'],
        },
        {
          title: 'CV et documents de presentation',
          description: 'Preparez des supports professionnels sans logiciel desktop lourd.',
          toolSlugs: ['invoice-generator', 'resume-builder', 'signature-pad'],
        },
        {
          title: 'Reunions et organisation',
          description: 'Centralisez agenda, notes et disponibilites dans des outils simples et rapides.',
          toolSlugs: ['meeting-notes', 'meeting-agenda-builder', 'pomodoro-timer'],
        },
      ],
      noteTitle: 'Pourquoi cette couche compte',
      note:
        'Elle permet a la categorie de mieux couvrir des recherches plus precises comme outil PDF, createur de CV, notes de reunion et convertisseur Excel.',
    },
  },
  ja: {
    image: {
      eyebrow: '画像制作と公開向け',
      title: '画像変換、圧縮、書き出しをまとめて進められる画像ツール群',
      intro:
        '画像カテゴリは、単に画像ツールを並べるだけでは弱く、画像を圧縮したい、PNG と SVG を変換したい、QR や favicon を作りたいといった具体的な作業意図を示す必要があります。',
      highlightsTitle: 'このカテゴリで解決しやすい作業',
      highlights: [
        'Web 公開向けに画像サイズや形式を最適化する。',
        'QR コード、favicon、ウォーターマークなど配布用アセットを素早く作る。',
        'SVG、PNG、WebP、Base64 を行き来して開発や運用に組み込む。',
      ],
      workflowsTitle: '代表的な使い方',
      workflows: [
        {
          title: 'Web 向け軽量化と形式変換',
          description: 'ページ速度や配信容量を意識して、画像の圧縮と形式変換をまとめて進めます。',
          toolSlugs: ['image-compressor', 'image-converter', 'image-to-webp'],
        },
        {
          title: '公開用ビジュアルの作成',
          description: 'ブランド、配布資料、SNS 投稿で使う画像素材をブラウザ上で用意できます。',
          toolSlugs: ['qr-generator', 'favicon-generator', 'image-watermark'],
        },
        {
          title: '技術用途の画像変換',
          description: '埋め込みやフロントエンド実装向けに、ベクター画像とビットマップ画像を調整します。',
          toolSlugs: ['svg-to-png', 'png-to-svg', 'base64-image-converter'],
        },
      ],
      noteTitle: '補足',
      note:
        'この補助コンテンツは、画像圧縮、画像変換、SVG 変換、QR 作成といった長尾検索意図をカテゴリページ側でも明確に受け止めるためのものです。',
    },
    office: {
      eyebrow: '文書作業とチーム運用向け',
      title: 'PDF、履歴書、表計算、会議運営までカバーするオフィスツール',
      intro:
        'オフィスカテゴリは生産性向上という広い言葉だけでは弱く、PDF 編集、履歴書作成、Excel 変換、会議メモ整理といった仕事単位の意図を見せた方が自然流入に強くなります。',
      highlightsTitle: 'このカテゴリの主な用途',
      highlights: [
        'PDF の結合、分割、圧縮、テキスト化など文書まわりの作業をまとめて進める。',
        '履歴書、署名、ノート、共有資料などの業務文書をすばやく作成する。',
        '会議メモ、議題、参加者調整、時間帯調整などチーム運用を支援する。',
      ],
      workflowsTitle: 'おすすめのワークフロー',
      workflows: [
        {
          title: 'PDF と文書変換',
          description: 'PDF を中心に、テキスト化や分割など日常業務で多い処理をまとめて実行します。',
          toolSlugs: ['pdf-merger', 'pdf-splitter', 'pdf-to-text'],
        },
        {
          title: '履歴書と提出書類',
          description: '応募や社内提出で使う書類を、ブラウザだけで整えて書き出せます。',
          toolSlugs: ['invoice-generator', 'resume-builder', 'signature-pad'],
        },
        {
          title: '会議準備と記録',
          description: '議題、メモ、参加可能時間をつなげて、会議運営の手戻りを減らします。',
          toolSlugs: ['meeting-notes', 'meeting-agenda-builder', 'pomodoro-timer'],
        },
      ],
      noteTitle: '狙い',
      note:
        'カテゴリページ側で PDF ツール、履歴書作成、会議メモ、Excel 変換といった実務キーワードを補強し、一覧ページの意図をより明確にします。',
    },
  },
  ko: {
    image: {
      eyebrow: '이미지 작업과 배포를 위한 묶음',
      title: '이미지 변환, 압축, 내보내기를 빠르게 연결하는 이미지 도구',
      intro:
        '이미지 카테고리는 단순히 도구를 나열하는 것보다 이미지 압축, 형식 변환, QR 생성, SVG 내보내기처럼 실제 작업 흐름을 보여줄 때 더 강한 검색 신호를 만듭니다.',
      highlightsTitle: '이 카테고리에서 자주 하는 일',
      highlights: [
        '웹용 이미지 용량을 줄이고 PNG, WebP, SVG 같은 형식으로 변환하기.',
        'QR 코드, 파비콘, 워터마크, SNS용 비주얼을 빠르게 만들기.',
        '개발과 문서 작업에서 Base64, SVG, PNG 자산을 서로 변환하기.',
      ],
      workflowsTitle: '추천 조합',
      workflows: [
        {
          title: '웹 최적화와 형식 변환',
          description: '사이트 성능과 배포 효율을 위해 이미지 크기와 포맷을 먼저 정리합니다.',
          toolSlugs: ['image-compressor', 'image-converter', 'image-to-webp'],
        },
        {
          title: '브랜딩과 공유용 자산 만들기',
          description: '배포용 비주얼, QR, 파비콘, 워터마크를 브라우저에서 바로 생성합니다.',
          toolSlugs: ['qr-generator', 'favicon-generator', 'image-watermark'],
        },
        {
          title: '기술용 이미지 포맷 브리지',
          description: '프론트엔드나 문서 삽입용으로 SVG, PNG, Base64 자산을 오가며 정리합니다.',
          toolSlugs: ['svg-to-png', 'svg-to-image', 'base64-image-converter'],
        },
      ],
      noteTitle: '의도 강화',
      note:
        '이 섹션은 이미지 압축, 이미지 변환, SVG PNG 변환, QR 코드 생성 같은 롱테일 검색 의도를 카테고리 수준에서 더 분명하게 받쳐 줍니다.',
    },
  },
  pt: {
    finance: {
      eyebrow: 'Para planejar e validar',
      title: 'Ferramentas financeiras para cambio, rentabilidade, impostos e documentos',
      intro:
        'Esta categoria fica mais forte quando conecta calculos a tarefas reais: validar dados bancarios, montar previsoes, acompanhar despesas e preparar documentos financeiros sem sair do navegador.',
      highlightsTitle: 'Demandas comuns desta categoria',
      highlights: [
        'Comparar cambio, margem, impostos e retorno antes de decidir.',
        'Validar IBAN, BIC/SWIFT e dados de cartao para operacoes mais seguras.',
        'Criar faturas, relatorios de despesas e previsoes com processamento local.',
      ],
      workflowsTitle: 'Fluxos recomendados',
      workflows: [
        {
          title: 'Rentabilidade e cenarios',
          description: 'Calcule retorno, ponto de equilibrio e margem para precificacao, vendas e novos projetos.',
          toolSlugs: ['roi-calculator', 'break-even-calculator', 'margin-calculator'],
        },
        {
          title: 'Pagamentos e validacao internacional',
          description: 'Confirme moedas e identificadores bancarios antes de compartilhar ou cobrar.',
          toolSlugs: ['currency-converter', 'iban-validator', 'bic-swift-lookup'],
        },
        {
          title: 'Faturas e controle operacional',
          description: 'Conecte documentos financeiros com acompanhamento de gastos e desvios de orcamento.',
          toolSlugs: ['invoice-template-generator', 'expense-report-generator', 'budget-variance-analyzer'],
        },
      ],
      noteTitle: 'Nota',
      note:
        'Para trafego de financas, clareza e confianca importam mais do que uma lista generica de calculadoras. Por isso esta categoria destaca jobs concretos.',
    },
    office: {
      eyebrow: 'Para documentos e operacao de equipe',
      title: 'Ferramentas de escritorio para PDF, curriculo, planilhas e reunioes',
      intro:
        'A categoria de escritorio ganha mais alcance quando fala de trabalhos especificos como unir PDF, converter planilhas, criar curriculos e organizar reunioes, em vez de depender so da palavra produtividade.',
      highlightsTitle: 'O que voce consegue fazer aqui',
      highlights: [
        'Mesclar, dividir, comprimir e extrair texto de PDFs em tarefas recorrentes.',
        'Criar curriculos, assinaturas e documentos prontos para envio ou exportacao.',
        'Estruturar agenda, disponibilidade e notas para reunioes e planejamento.',
      ],
      workflowsTitle: 'Fluxos recomendados',
      workflows: [
        {
          title: 'PDF e conversao de documentos',
          description: 'Resolva as transformacoes mais frequentes em documentos sem depender de software instalado.',
          toolSlugs: ['pdf-merger', 'pdf-splitter', 'pdf-to-text'],
        },
        {
          title: 'Curriculos e documentos pessoais',
          description: 'Monte arquivos formais e exporte materiais para candidatura ou entrega profissional.',
          toolSlugs: ['invoice-generator', 'resume-builder', 'signature-pad'],
        },
        {
          title: 'Reunioes e coordenacao',
          description: 'Mantenha pauta, notas e disponibilidade em um fluxo leve para times distribuidos.',
          toolSlugs: ['meeting-notes', 'meeting-agenda-builder', 'pomodoro-timer'],
        },
      ],
      noteTitle: 'Por que isso ajuda',
      note:
        'Assim a pagina passa a cobrir melhor buscas como ferramentas PDF, criador de curriculo, notas de reuniao e conversao de Excel.',
    },
  },
};

for (const [locale, localeContent] of Object.entries(phaseEightSupportContent)) {
  supportContent[locale as SupportedLocale] = {
    ...(supportContent[locale as SupportedLocale] ?? {}),
    ...(localeContent as Partial<Record<SupportedCategory, CategorySupportContent>>),
  };
}

for (const [locale, localeContent] of Object.entries(phaseElevenSupportContent)) {
  supportContent[locale as SupportedLocale] = {
    ...(supportContent[locale as SupportedLocale] ?? {}),
    ...(localeContent as Partial<Record<SupportedCategory, CategorySupportContent>>),
  };
}

for (const [locale, localeContent] of Object.entries(phaseTwentySupportContent)) {
  supportContent[locale as SupportedLocale] = {
    ...(supportContent[locale as SupportedLocale] ?? {}),
    ...(localeContent as Partial<Record<SupportedCategory, CategorySupportContent>>),
  };
}

for (const [locale, localeContent] of Object.entries(phaseThirtyFourSupportContent)) {
  supportContent[locale as SupportedLocale] = {
    ...(supportContent[locale as SupportedLocale] ?? {}),
    ...(localeContent as Partial<Record<SupportedCategory, CategorySupportContent>>),
  };
}

for (const [locale, localeContent] of Object.entries(v13SupportContent)) {
  supportContent[locale as SupportedLocale] = {
    ...(supportContent[locale as SupportedLocale] ?? {}),
    ...(localeContent as Partial<Record<SupportedCategory, CategorySupportContent>>),
  };
}

export function getCategorySupportContent(
  locale: Locale,
  category: ToolCategory
): CategorySupportContent | null {
  const localeSupport = supportContent[locale as SupportedLocale];
  if (!localeSupport) {
    return null;
  }

  return localeSupport[category as SupportedCategory] ?? null;
}
