import type { Locale } from "./i18n";

interface LocaleClaimDetector {
  affirmative?: RegExp;
  target?: RegExp;
  assertion?: RegExp;
  negation: RegExp;
}

const NEGATION_BY_LOCALE: Record<Locale, RegExp> = {
  en: /\b(?:no|not|never|without|cannot|can't|doesn't|does not|isn't|is not|aren't|are not|unsupported|unavailable)\b/iu,
  zh: /(?:不|无|没有|无法|不能|未提供|不支持|不可用)/u,
  ja: /(?:ない|ません|できません|非対応|未対応|不可|なし)/u,
  ko: /(?:않|없|못|지원하지|할 수 없|불가|미지원)/u,
  es: /\b(?:no|sin|nunca|tampoco|imposible|no disponible)\b/iu,
  pt: /\b(?:não|sem|nunca|indisponível|impossível)\b/iu,
  fr: /\b(?:ne|n’|n'|pas|sans|aucun|aucune|indisponible|impossible)\b/iu,
  de: /\b(?:nicht|kein|keine|keinen|keinem|keiner|ohne|unmöglich|nicht verfügbar)\b/iu,
  ru: /(?:^|\s)(?:не|нет|без|нельзя|невозможно|недоступн\p{L}*)(?:\s|$)/iu,
  ar: /(?:^|\s)(?:لا|ليس|ليست|لن|بدون)(?:\s|$)|غير (?:متاح|مدعوم)|يتعذر/u,
};

const CONTRAST_BY_LOCALE: Record<Locale, RegExp> = {
  en: /\s*(?:,\s*)?\b(?:but|however|yet)\b\s*/iu,
  zh: /\s*(?:，\s*)?(?:但是|但|不过|然而)\s*/u,
  ja: /\s*(?:、|，)?\s*(?:しかし|ただし|一方で)\s*/u,
  ko: /\s*(?:,\s*)?(?:하지만|그러나)\s*/u,
  es: /\s*(?:,\s*)?\b(?:pero|sin embargo)\b\s*/iu,
  pt: /\s*(?:,\s*)?\b(?:mas|porém)\b\s*/iu,
  fr: /\s*(?:,\s*)?\b(?:mais|cependant)\b\s*/iu,
  de: /\s*(?:,\s*)?\b(?:aber|jedoch)\b\s*/iu,
  ru: /(?:,\s*|\s+)(?:но|однако)\s+/iu,
  ar: /\s*(?:،\s*)?(?:لكن|ولكن)\s*/u,
};

const BARE_AFFIRMATIVE_BY_LOCALE: Record<Locale, RegExp> = {
  en: /^yes\.?$/iu,
  zh: /^(?:是|可以|支持)[。.]?$/u,
  ja: /^(?:はい|対応します)[。.]?$/u,
  ko: /^(?:예|네|지원합니다)[.]?$/u,
  es: /^sí\.?$/iu,
  pt: /^sim\.?$/iu,
  fr: /^oui\.?$/iu,
  de: /^ja\.?$/iu,
  ru: /^да\.?$/iu,
  ar: /^(?:نعم|أجل)[.]?$/u,
};

const BARE_NEGATIVE_BY_LOCALE: Record<Locale, RegExp> = {
  en: /^no\.?$/iu,
  zh: /^(?:不|否|不是|不可以|不支持)[。.]?$/u,
  ja: /^(?:いいえ|できません|対応しません)[。.]?$/u,
  ko: /^(?:아니요|안 됩니다|지원하지 않습니다)[.]?$/u,
  es: /^no\.?$/iu,
  pt: /^não\.?$/iu,
  fr: /^non\.?$/iu,
  de: /^nein\.?$/iu,
  ru: /^нет\.?$/iu,
  ar: /^(?:لا|كلا)[.]?$/u,
};

const FAQ_EXTERNAL_RECOMMENDATION_BY_LOCALE: Partial<Record<Locale, RegExp>> = {
  en: /^(?:use|consult|run|check|verify)\s+(?:(?:(?:your|another)\s+(?:(?:external|third-party|provider-owned|vendor-owned)\s+)?|(?:(?:an?|the)\s+)?(?:external|third-party|provider-owned|vendor-owned)\s+)(?:database|service|provider|application|browser|server|system|tool)(?:'s)?\b|(?:your\s+)?(?:provider|vendor)(?:'s)?\s+(?:service|application|server|system|tool)\b)/iu,
  zh: /^(?:请)?(?:使用|改用|查看|检查|运行)(?:您的|你的|外部|第三方|其他|提供商的|供应商的)(?:数据库|服务|提供商|应用程序?|浏览器|服务器|系统|工具)/u,
  es: /^(?:usa|use|utiliza|utilice|consulta|consulte|ejecuta|ejecute)\s+(?:(?:su|otr\p{L}*)\s+(?:(?:extern\p{L}*|de terceros?)\s+)?|(?:(?:una?|la)\s+)?(?:extern\p{L}*|de terceros?|del proveedor|del vendedor)\s+)(?:base de datos|servicio|proveedor|aplicación|navegador|servidor|sistema|herramienta)\b/iu,
  pt: /^(?:usa|use|utiliza|utilize|consulta|consulte|executa|execute)\s+(?:(?:seu|sua|outr\p{L}*)\s+(?:(?:extern\p{L}*|de terceiros?)\s+)?|(?:(?:um|uma|o|a)\s+)?(?:extern\p{L}*|de terceiros?|do provedor|do fornecedor)\s+)(?:banco de dados|serviço|provedor|aplicativo|aplicação|navegador|servidor|sistema|ferramenta)\b/iu,
  fr: /^(?:utilise|utilisez|consulte|consultez|exécute|exécutez)\s+(?:(?:votre|autre)\s+(?:(?:externe|tierce)\s+)?|(?:(?:un|une|le|la)\s+)?(?:externe|tierce|du fournisseur|du prestataire)\s+)(?:base de données|service|fournisseur|application|navigateur|serveur|système|outil)\b/iu,
  de: /^(?:verwende|verwenden|verwendet|nutze|nutzen|nutzt|prüfe|prüfen|prüft)\s+(?:(?:Ihr\p{L}*|ander\p{L}*)\s+(?:extern\p{L}*\s+)?|(?:(?:ein\p{L}*|der|die|das)\s+)?(?:extern\p{L}*|Drittanbieter|anbieter-?eigen\p{L}*|hersteller-?eigen\p{L}*)\s+)(?:Datenbank|Dienst|Anbieter|Anwendung|Browser|Server|System|Werkzeug|Tool)\b/iu,
  ru: /^(?:используй|используйте|запусти|запустите|проверь|проверьте)(?:\s|[,:;])(?:(?:ваш\p{L}*|друг\p{L}*)\s+(?:внешн\p{L}*\s+)?|(?:внешн\p{L}*|сторонн\p{L}*|провайдерск\p{L}*|поставщик\p{L}*)\s+)(?:баз\p{L}* данных|сервис\p{L}*|провайдер\p{L}*|приложени\p{L}*|браузер\p{L}*|сервер\p{L}*|систем\p{L}*|инструмент\p{L}*)/iu,
  ar: /^(?:استخدم|استخدمي|استخدموا|شغّل|شغلي|شغّلوا|تحقق)\s+(?:(?:قاعدة البيانات|الخدمة|المزود|التطبيق|المتصفح|الخادم|النظام|الأداة)\s+(?:الخارجية|الخارجي|لديك|الخاصة بك|لطرف ثالث|لمزود|لمورّد)|(?:خارجي|خارجية|طرف ثالث|مزود|مورّد).{0,10}(?:قاعدة البيانات|الخدمة|التطبيق|المتصفح|الخادم|النظام|الأداة))/u,
};

const FINAL_LOCATION_BINDING_BY_LOCALE: Partial<
  Record<
    Locale,
    { predicate: RegExp; location: RegExp; externalLocation: RegExp }
  >
> = {
  ja: {
    predicate: /(?:使用|利用|確認|実行)してください/gu,
    location: /(?:(?:あなたの|私たちの|我々の|当|本|この|その|外部|サードパーティー|別の|プロバイダーの|ベンダーの)?(?:Web)?(?:データベース|サービス|プロバイダー|アプリ(?:ケーション)?|ブラウザー|サーバー|システム|ツール)|U2Tool)(?:(?:上)?で|にて)/gu,
    externalLocation: /^(?:あなたの|外部|サードパーティー|別の|プロバイダーの|ベンダーの)(?:Web)?(?:データベース|サービス|プロバイダー|アプリ(?:ケーション)?|ブラウザー|サーバー|システム|ツール)(?:(?:上)?で|にて)$/u,
  },
  ko: {
    predicate: /(?:사용|이용|확인|실행)하세요/gu,
    location: /(?:(?:사용자의|우리|본|이|그|외부|서드파티|다른|공급자의|벤더의)?\s*(?:웹\s*)?(?:데이터베이스|서비스|공급자|애플리케이션|앱|브라우저|서버|시스템|도구)|U2Tool)(?:상)?에서/gu,
    externalLocation: /^(?:사용자의|외부|서드파티|다른|공급자의|벤더의)\s*(?:웹\s*)?(?:데이터베이스|서비스|공급자|애플리케이션|앱|브라우저|서버|시스템|도구)(?:상)?에서$/u,
  },
};

const SQL_EXECUTION_ACTION_BY_LOCALE = {
  ja: {
    boundary: /[。！？!?；;\n\r]+|(?:分析|説明|表示|確認|生成|接続|実行)(?:してから|した(?:後|のち|あと)(?:に|で|から)?|して|し(?!た))\s*[、,]?\s*/gu,
    directObject: /([^、。！？,]{1,80})を\s*$/u,
    predicate: /実行/gu,
    sqlDirectObject: /(?:SQL(?:クエリ)?|クエリ)\s*$/u,
    sqlObject: /(?:SQL|クエリ)/u,
    meta: /^実行(?:(?:する|の)?(?:方法|手順|ステップ|ガイド|案内|指示|仕方))/u,
    negation: /^実行(?:(?:は|には|を)?(?:できません|できない|しません|しない|せず|不可)|すること(?:は|が)?でき(?:ません|ない)|には対応(?:し(?:ません|ない)|してい(?:ません|ない)|しておりません))/u,
  },
  ko: {
    boundary: /[.!?。！？；;\n\r]+|(?:분석|설명|표시|확인|생성|연결|실행)(?:한\s+(?:후|다음|뒤)(?:에|로)?|하고\s+나서|하고|하며|해서)\s*,?\s*/gu,
    directObject: /([^,.!?。！？]{1,80})(?:을|를)\s*$/u,
    predicate: /실행/gu,
    sqlDirectObject: /(?:SQL(?:\s*쿼리)?|쿼리)\s*$/u,
    sqlObject: /(?:SQL|쿼리)/u,
    meta: /^실행(?:(?:하는|할|의)?\s*(?:방법|단계|절차|가이드|안내|지침))/u,
    negation: /^실행(?:하지\s*(?:않습니다|않아요|않는다|마세요|못(?:합니다|해요|한다))|할\s*수\s*없(?:어요|다|습니다)|하지\s*않음|(?:을|은)\s*지원하지\s*않습니다)/u,
  },
} as const;

const HEX_GRID_BY_LOCALE: Record<Locale, RegExp> = {
  en: /\b(?:opens?|uploads?|loads?|analy[sz]es?)\b.{0,40}\b(?:local |binary )?files?\b|\b(?:shows?|provides?|includes?|displays?)\b.{0,40}\b(?:offset|byte|hex) (?:grid|table|view)\b/iu,
  zh: /(?:打开|上传|载入|加载|分析).{0,20}(?:本地|二进制)?文件|(?:显示|提供|包含).{0,20}(?:偏移|字节|十六进制).{0,8}(?:网格|表格|视图)/u,
  ja: /(?:ローカル|バイナリ)?ファイル.{0,20}(?:開|アップロード|読み込|解析)|(?:オフセット|バイト|16進).{0,12}(?:グリッド|表|ビュー).{0,20}(?:表示|提供|搭載)/u,
  ko: /(?:로컬|바이너리)?\s*파일.{0,20}(?:열|업로드|불러오|분석)|(?:오프셋|바이트|16진수).{0,12}(?:그리드|표|보기).{0,20}(?:표시|제공|포함)/u,
  es: /\b(?:abre|carga|sube|analiza)\b.{0,40}\barchivos?\b|\b(?:muestra|ofrece|incluye|proporciona)\b.{0,40}\b(?:cuadrícula|tabla|vista) (?:de )?(?:offsets?|desplazamientos?|bytes?|hexadecimal)\b/iu,
  pt: /\b(?:abre|carrega|envia|analisa)\b.{0,40}\barquivos?\b|\b(?:mostra|oferece|inclui|fornece)\b.{0,40}\b(?:grade|tabela|visualização) (?:de )?(?:offsets?|deslocamentos?|bytes?|hexadecimal)\b/iu,
  fr: /\b(?:ouvre|charge|téléverse|analyse)\b.{0,40}\bfichiers?\b|\b(?:affiche|offre|inclut|fournit)\b.{0,40}\b(?:grille|table|vue) (?:d['’])?(?:offsets?|décalages?|octets?|hexadécimale?)\b/iu,
  de: /\b(?:öffnet|lädt|analysiert)\b.{0,40}\bDateien?\b|\b(?:zeigt|bietet|enthält)\b.{0,40}\b(?:Offset|Byte|Hex)(?:-| )?(?:Raster|Tabelle|Ansicht)\b/iu,
  ru: /(?:открывает|загружает|анализирует).{0,40}файл\p{L}*|(?:показывает|отображает|предоставляет).{0,40}(?:сетк\p{L}*|таблиц\p{L}*|представлени\p{L}*).{0,20}(?:смещени\p{L}*|байт\p{L}*|hex|шестнадцатерич\p{L}*)/iu,
  ar: /(?:يفتح|يرفع|يحمّل|يحلل).{0,30}(?:ملف|الملفات)|(?:يعرض|يوفر|يتضمن).{0,30}(?:شبكة|جدول|عرض).{0,20}(?:الإزاحات|البايتات|سداسي)|(?:يسمح|يتيح|تتيح).{0,30}تحليل البيانات الثنائية|(?:يعرض|يظهر).{0,20}(?:القيم|البيانات).{0,20}(?:جداول|جدول)/u,
};

const ASSERTION_BY_LOCALE: Record<Locale, RegExp> = {
  en: /\b(?:supports?|provides?|offers?|includes?|uses?|runs?|executes?|renders?|displays?|preserves?|exports?|downloads?|saves?|opens?|uploads?|loads?|edits?|modifies?|selects?|chooses?|analy[sz]es?|parses?|connects?|queries?|calculates?|shows?|tracks?|stores?|publishes?|issues?|generates?|awards?|identifies?|adds?|creates?|highlights?|enables?|allows?|guarantees?|promises?|powered)\b/iu,
  zh: /(?:支持|提供|具备|包含|使用|采用|运行|执行|渲染|显示|保留|导出|下载|保存|打开|上传|加载|编辑|修改|选择|分析|解析|连接|查询|计算|跟踪|存储|发布|颁发|生成|识别|添加|创建|突出|启用|允许|保证|驱动|可以|能够)/u,
  ja: /(?:対応|サポート|提供|搭載|含む|使用|実行|表示|保持|エクスポート|ダウンロード|保存|開く|アップロード|読み込|編集|変更|選択|解析|接続|クエリ|計算|追跡|記録|公開|発行|生成|識別|特定|役立|追加|作成|強調|有効|可能|保証|搭載)/u,
  ko: /(?:지원|제공|포함|사용|실행|렌더링|표시|보존|내보내기|다운로드|저장|열기|업로드|불러오기|편집|수정|선택|분석|파싱|연결|쿼리|계산|추적|기록|게시|발급|생성|식별|추가|만들기|강조|활성화|허용|보장|구동|할 수 있)/u,
  es: /\b(?:admite|soporta|ofrece|proporciona|incluye|usa|ejecuta|renderiza|muestra|conserva|exporta|descarga|guarda|abre|carga|sube|edita|modifica|selecciona|analiza|interpreta|conecta|consulta|calcula|rastrea|almacena|publica|emite|genera|otorga|identifica|añade|crea|resalta|permite|garantiza|promete|impulsad\p{L}*)\b/iu,
  pt: /\b(?:suporta|oferece|fornece|inclui|usa|executa|renderiza|mostra|preserva|exporta|baixa|salva|abre|carrega|envia|edita|modifica|seleciona|analisa|interpreta|conecta|consulta|calcula|rastreia|armazena|publica|emite|gera|concede|identifica|identificar|ajuda|planeje|adiciona|cria|destaca|permite|garante|promete|alimentad\p{L}*)\b/iu,
  fr: /\b(?:prend en charge|supporte|offre|fournit|inclut|utilise|exécute|affiche|préserve|conserve|exporte|télécharge|enregistre|ouvre|charge|téléverse|édite|modifie|sélectionne|analyse|interprète|connecte|interroge|calcule|suit|stocke|publie|émet|génère|attribue|identifie|identifier|aide|planifiez|ajoute|crée|met en évidence|permet|garantit|promet|alimenté\p{L}*)\b/iu,
  de: /\b(?:unterstützt|bietet|stellt bereit|enthält|verwendet|nutzt|führt|rendert|zeigt|bewahrt|exportiert|lädt herunter|speichert|öffnet|lädt|bearbeitet|ändert|wählt|analysiert|parst|verbindet|fragt ab|berechnet|verfolgt|publiziert|stellt aus|erzeugt|vergibt|identifiziert|identifizieren|plant|planen|fügt hinzu|erstellt|hebt hervor|ermöglicht|hilft|garantiert|verspricht|KI-gestützt)\b/iu,
  ru: /(?:поддерживает|предлагает|предоставляет|включает|использует|выполняет|запускает|отображает|показывает|сохраняет|экспортирует|скачивает|открывает|загружает|редактирует|изменяет|выбирает|анализирует|разбирает|подключается|запрашивает|вычисляет|рассчитывает|отслеживает|хранит|публикует|выдаёт|генерирует|награждает|определяет|определить|помогает|планируйте|добавляет|создаёт|подсвечивает|позволяет|гарантирует|обещает|работает на)/iu,
  ar: /(?:يدعم|تدعم|دعم|يوفر|توفر|يقدم|تقدم|يتضمن|تتضمن|يستخدم|تستخدم|يشغل|تشغل|ينفذ|تنفذ|يعرض|تعرض|يحافظ|تحافظ|يصدر|تصدر|تصدير|ينزل|تنزل|يحفظ|تحفظ|يفتح|تفتح|يرفع|ترفع|يحمّل|تحمّل|يحرر|تحرر|يعدل|تعدل|التعديل|يختار|تختار|اختر|يحلل|تحلل|تحليل|يفسر|تفسر|يتصل|تتصل|يستعلم|تستعلم|يحسب|تحسب|يتتبع|تتبع|يخزن|تخزن|ينشر|تنشر|ينشئ|تنشئ|يمنح|تمنح|يحدد|تحدد|يضيف|تضيف|يبرز|تبرز|يمكّن|تمكّن|يسمح|تسمح|يتيح|تتيح|يضمن|تضمن|يعد|تعد|مدعوم)/u,
};

type ClaimTargets = Record<Locale, RegExp>;

const metricTargets = localeTargets;

const CLAIM_TARGETS: Readonly<Record<string, ClaimTargets>> = {
  "grammar-checker-native-non-english-claim": {
    en: /(?:multilingual|non-English|Russian|Chinese|Japanese|Korean|Spanish|Portuguese|French|German|Arabic).{0,24}grammar|grammar.{0,24}(?:multiple|non-English|Russian|Chinese|Japanese|Korean|Spanish|Portuguese|French|German|Arabic)/iu,
    zh: /(?:多语言|非英语|中文|俄语|日语|韩语|西班牙语|葡萄牙语|法语|德语|阿拉伯语).{0,12}(?:语法|校对)|(?:语法|校对).{0,12}(?:多语言|非英语|中文|俄语|日语|韩语|西班牙语|葡萄牙语|法语|德语|阿拉伯语)/u,
    ja: /(?:多言語|英語以外|日本語|中国語|韓国語|ロシア語|スペイン語|ポルトガル語|フランス語|ドイツ語|アラビア語).{0,12}(?:文法|校正)|(?:文法|校正).{0,12}(?:多言語|英語以外|日本語|中国語|韓国語|ロシア語|スペイン語|ポルトガル語|フランス語|ドイツ語|アラビア語)/u,
    ko: /(?:다국어|비영어|한국어|중국어|일본어|러시아어|스페인어|포르투갈어|프랑스어|독일어|아랍어).{0,12}(?:문법|교정)|(?:문법|교정).{0,12}(?:다국어|비영어|한국어|중국어|일본어|러시아어|스페인어|포르투갈어|프랑스어|독일어|아랍어)/u,
    es: /(?:gramática|corrección).{0,24}(?:multilingüe|no ingles|español|ruso|chino|japonés|coreano|portugués|francés|alemán|árabe)|(?:multilingüe|no inglesa|española|rusa|china|japonesa|coreana|portuguesa|francesa|alemana|árabe).{0,24}(?:gramática|corrección)/iu,
    pt: /(?:gramática|correção).{0,24}(?:multilíngue|não inglesa|português|russo|chinês|japonês|coreano|espanhol|francês|alemão|árabe)|(?:multilíngue|não inglesa|portuguesa|russa|chinesa|japonesa|coreana|espanhola|francesa|alemã|árabe).{0,24}(?:gramática|correção)/iu,
    fr: /(?:grammaire|correction).{0,24}(?:multilingue|non anglaise|française|russe|chinoise|japonaise|coréenne|espagnole|portugaise|allemande|arabe)|(?:multilingue|non anglaise|française|russe|chinoise|japonaise|coréenne|espagnole|portugaise|allemande|arabe).{0,24}(?:grammaire|correction)/iu,
    de: /(?:Grammatik|Korrektur).{0,24}(?:mehrsprachig|nicht englisch|Deutsch|Russisch|Chinesisch|Japanisch|Koreanisch|Spanisch|Portugiesisch|Französisch|Arabisch)|(?:mehrsprachige|deutsche|russische|chinesische|japanische|koreanische|spanische|portugiesische|französische|arabische).{0,24}(?:Grammatik|Korrektur)/iu,
    ru: /(?:русск\p{L}*|китайск\p{L}*|японск\p{L}*|корейск\p{L}*|испанск\p{L}*|португальск\p{L}*|французск\p{L}*|немецк\p{L}*|арабск\p{L}*|многоязычн\p{L}*).{0,20}(?:грамматик\p{L}*|провер\p{L}*)/iu,
    ar: /(?:قواعد|تدقيق).{0,24}(?:متعدد اللغات|غير الإنجليزية|العربية|الروسية|الصينية|اليابانية|الكورية|الإسبانية|البرتغالية|الفرنسية|الألمانية)|(?:متعدد اللغات|غير الإنجليزية|العربية|الروسية|الصينية|اليابانية|الكورية|الإسبانية|البرتغالية|الفرنسية|الألمانية).{0,24}(?:قواعد|تدقيق)/u,
  },
  "grammar-checker-ai-claim": {
    en: /\b(?:AI|artificial intelligence|large language model|LLM)\b/iu,
    zh: /(?:人工智能|大语言模型|大型语言模型|AI|LLM)/u,
    ja: /(?:人工知能|大規模言語モデル|AI|LLM)/u,
    ko: /(?:인공지능|대규모 언어 모델|AI|LLM)/u,
    es: /\b(?:IA|inteligencia artificial|modelo de lenguaje grande|LLM)\b/iu,
    pt: /\b(?:IA|inteligência artificial|modelo de linguagem grande|LLM)\b/iu,
    fr: /\b(?:IA|intelligence artificielle|grand modèle de langage|LLM)\b/iu,
    de: /\b(?:KI|künstliche Intelligenz|großes Sprachmodell|LLM)\b/iu,
    ru: /(?:ИИ|искусственн\p{L}* интеллект\p{L}*|больш\p{L}* языков\p{L}* модел\p{L}*|LLM)/iu,
    ar: /(?:الذكاء الاصطناعي|نموذج لغوي كبير|AI|LLM)/u,
  },
  "grammar-checker-server-processing-claim": {
    en: /(?:server[- ]side|cloud[- ]based|remote).{0,20}(?:processing|checking)/iu,
    zh: /(?:服务器端|云端|远程).{0,12}(?:处理|检查|校对)/u,
    ja: /(?:サーバー側|クラウド|リモート).{0,12}(?:処理|チェック|校正)/u,
    ko: /(?:서버 측|클라우드|원격).{0,12}(?:처리|검사|교정)/u,
    es: /(?:procesamiento|corrección).{0,20}(?:en servidor|en la nube|remot\p{L}*)|(?:servidor|nube|remot\p{L}*).{0,20}(?:procesamiento|corrección)/iu,
    pt: /(?:processamento|correção).{0,20}(?:no servidor|na nuvem|remot\p{L}*)|(?:servidor|nuvem|remot\p{L}*).{0,20}(?:processamento|correção)/iu,
    fr: /(?:traitement|correction).{0,20}(?:serveur|nuage|cloud|distant)|(?:serveur|nuage|cloud|distant).{0,20}(?:traitement|correction)/iu,
    de: /(?:serverseitig|Cloud|remote).{0,20}(?:Verarbeitung|Prüfung|Korrektur)|(?:Verarbeitung|Prüfung|Korrektur).{0,20}(?:Server|Cloud|remote)/iu,
    ru: /(?:серверн\p{L}*|облачн\p{L}*|удалённ\p{L}*).{0,20}(?:обработк\p{L}*|проверк\p{L}*)/iu,
    ar: /(?:الخادم|السحابة|عن بُعد).{0,20}(?:معالجة|تدقيق|فحص)|(?:معالجة|تدقيق|فحص).{0,20}(?:الخادم|السحابة|عن بُعد)/u,
  },
  "hex-editor-byte-edit-claim": {
    en: /(?:direct|individual).{0,12}byte edit|edit.{0,12}(?:individual )?bytes?/iu,
    zh: /(?:直接|逐个|单独).{0,8}(?:编辑|修改).{0,8}字节|字节.{0,8}(?:直接|逐个).{0,8}(?:编辑|修改)/u,
    ja: /(?:バイト|byte).{0,10}(?:直接|個別).{0,10}(?:編集|変更)|(?:直接|個別).{0,10}(?:バイト|byte).{0,10}(?:編集|変更)/iu,
    ko: /(?:바이트|byte).{0,10}(?:직접|개별).{0,10}(?:편집|수정)|(?:직접|개별).{0,10}(?:바이트|byte).{0,10}(?:편집|수정)/iu,
    es: /(?:edición|editar|modificar).{0,16}(?:directa|individual).{0,12}(?:bytes?|octetos?)|(?:bytes?|octetos?).{0,16}(?:directamente|individualmente)/iu,
    pt: /(?:edição|editar|modificar).{0,16}(?:direta|individual).{0,12}(?:bytes?|octetos?)|(?:bytes?|octetos?).{0,16}(?:diretamente|individualmente)/iu,
    fr: /(?:édition|éditer|modifier).{0,16}(?:directe|individuelle).{0,12}(?:octets?|bytes?)|(?:octets?|bytes?).{0,16}(?:directement|individuellement)/iu,
    de: /(?:direkte|einzelne).{0,12}(?:Byte|Bytes).{0,12}(?:Bearbeitung|bearbeiten|ändern)|(?:Byte|Bytes).{0,12}(?:direkt|einzeln).{0,12}(?:bearbeiten|ändern)/iu,
    ru: /(?:прям\p{L}*|отдельн\p{L}*).{0,16}(?:редактирован\p{L}*|изменен\p{L}*).{0,12}байт\p{L}*|байт\p{L}*.{0,16}(?:напрямую|по отдельности)/iu,
    ar: /(?:تحرير|تعديل|التعديل).{0,16}(?:مباشر|المباشر|فردي).{0,24}(?:البايت|البايتات|القيم السداسية)|(?:البايت|البايتات|القيم السداسية).{0,16}(?:مباشرة|فرديًا)/u,
  },
  "hex-editor-unsupported-encoding-claim": {
    en: /(?:UTF-16|UTF-32|Latin-1|Shift[- ]JIS|multiple encodings|encoding selector|big[- ]endian|little[- ]endian)/iu,
    zh: /(?:UTF-16|UTF-32|Latin-1|Shift[- ]JIS|多种编码|编码选择|大端|小端)/iu,
    ja: /(?:UTF-16|UTF-32|Latin-1|Shift[- ]JIS|複数の文字コード|エンコーディング選択|ビッグエンディアン|リトルエンディアン)/iu,
    ko: /(?:UTF-16|UTF-32|Latin-1|Shift[- ]JIS|여러 인코딩|인코딩 선택|빅 엔디안|리틀 엔디안)/iu,
    es: /(?:UTF-16|UTF-32|Latin-1|Shift[- ]JIS|múltiples codificaciones|selector de codificación|big[- ]endian|little[- ]endian)/iu,
    pt: /(?:UTF-16|UTF-32|Latin-1|Shift[- ]JIS|múltiplas codificações|seletor de codificação|big[- ]endian|little[- ]endian)/iu,
    fr: /(?:UTF-16|UTF-32|Latin-1|Shift[- ]JIS|plusieurs encodages|sélecteur d’encodage|big[- ]endian|little[- ]endian)/iu,
    de: /(?:UTF-16|UTF-32|Latin-1|Shift[- ]JIS|mehrere Kodierungen|Kodierungsauswahl|Big[- ]Endian|Little[- ]Endian)/iu,
    ru: /(?:UTF-16|UTF-32|Latin-1|Shift[- ]JIS|несколько кодировок|выбор кодировки|big[- ]endian|little[- ]endian|прямой порядок байтов|обратный порядок байтов)/iu,
    ar: /(?:UTF-16|UTF-32|Latin-1|Shift[- ]JIS|ترميزات متعددة|اختيار الترميز|نوع التشفير|Big-endian|Little-endian|ترتيب البايت)/iu,
  },
  "hex-editor-file-export-claim": {
    en: /(?:export|download|save).{0,16}(?:binary|hex|edited)?\s*files?/iu,
    zh: /(?:导出|下载|保存).{0,12}(?:二进制|十六进制|编辑后的)?文件/u,
    ja: /(?:バイナリ|16進|編集済み)?ファイル.{0,12}(?:エクスポート|ダウンロード|保存)|(?:エクスポート|ダウンロード|保存).{0,12}(?:バイナリ|16進|編集済み)?ファイル/u,
    ko: /(?:바이너리|16진수|편집된)?\s*파일.{0,12}(?:내보내기|다운로드|저장)|(?:내보내기|다운로드|저장).{0,12}(?:바이너리|16진수|편집된)?\s*파일/u,
    es: /(?:exporta|descarga|guarda).{0,16}archivos?/iu,
    pt: /(?:exporta|baixa|salva).{0,16}arquivos?/iu,
    fr: /(?:exporte|télécharge|enregistre).{0,16}fichiers?/iu,
    de: /(?:exportiert|lädt|speichert).{0,16}Dateien?/iu,
    ru: /(?:экспортирует|скачивает|сохраняет).{0,16}файл\p{L}*/iu,
    ar: /(?:يصدر|ينزل|يحفظ|تصدير|حفظ).{0,24}(?:ملف|الملفات|النتيجة)/u,
  },
  "sql-optimizer-database-selector-claim": localeTargets(
    /database selector|dialect selector/iu, /数据库选择|方言选择/u, /データベース選択|方言選択/u, /데이터베이스 선택|방언 선택/u,
    /selector de (?:base de datos|dialecto)/iu, /seletor de (?:banco de dados|dialeto)/iu, /sélecteur de (?:base de données|dialecte)/iu,
    /Datenbankauswahl|Dialektauswahl/iu, /выбор базы данных|выбор диалекта/iu, /اختيار قاعدة البيانات|اختيار اللهجة/u,
  ),
  "sql-optimizer-explain-claim": localeTargets(
    /EXPLAIN|execution plans?/iu, /EXPLAIN|执行计划/u, /EXPLAIN|実行計画/u, /EXPLAIN|실행 계획/u,
    /EXPLAIN|planes? de ejecución/iu, /EXPLAIN|planos? de execução/iu, /EXPLAIN|plans? d’exécution/iu,
    /EXPLAIN|Ausführungspläne?/iu, /EXPLAIN|план\p{L}* выполнени\p{L}*/iu, /EXPLAIN|خطط التنفيذ/u,
  ),
  "sql-optimizer-connection-claim": localeTargets(
    /live database|database connection/iu, /实时数据库|数据库连接/u, /ライブデータベース|データベース接続/u, /실시간 데이터베이스|데이터베이스 연결/u,
    /base de datos (?:activa|en vivo)|conexión (?:a|con) la base de datos/iu, /banco de dados (?:ativo|ao vivo)|conexão com o banco de dados/iu, /base de données (?:active|en direct)|connexion à la base de données/iu,
    /Live-Datenbank|Datenbankverbindung/iu, /рабоч\p{L}* баз\p{L}* данных|подключени\p{L}* к баз\p{L}* данных/iu, /قاعدة بيانات مباشرة|الاتصال بقاعدة البيانات/u,
  ),
  "sql-optimizer-execution-claim": localeTargets(
    /(?:run|execute).{0,12}(?:SQL|queries?)/iu, /(?:运行|执行).{0,8}(?:SQL|查询)/u, /(?:SQL|クエリ).{0,8}(?:実行|走らせ)/u, /(?:SQL|쿼리).{0,8}(?:실행)/u,
    /(?:ejecuta|corre).{0,12}(?:SQL|consultas?)/iu, /(?:executa|roda).{0,12}(?:SQL|consultas?)/iu, /(?:exécute|lance).{0,12}(?:SQL|requêtes?)/iu,
    /(?:führt|startet).{0,12}(?:SQL|Abfragen?)/iu, /(?:выполняет|запускает).{0,12}(?:SQL|запрос\p{L}*)/iu, /(?:ينفذ|يشغل).{0,12}(?:SQL|الاستعلامات)/u,
  ),
  "sql-optimizer-speed-guarantee-claim": localeTargets(
    /guaranteed?.{0,16}(?:faster|speed|performance)/iu, /保证.{0,12}(?:更快|速度|性能)/u, /(?:高速化|速度|性能).{0,12}保証/u, /(?:더 빠른|속도|성능).{0,12}보장/u,
    /garantiza.{0,16}(?:más rápid\p{L}*|velocidad|rendimiento)/iu, /garante.{0,16}(?:mais rápid\p{L}*|velocidade|desempenho)/iu, /garantit.{0,16}(?:plus rapide|vitesse|performance)/iu,
    /garantiert.{0,16}(?:schneller|Geschwindigkeit|Leistung)/iu, /гарантирует.{0,16}(?:быстр\p{L}*|скорост\p{L}*|производительност\p{L}*)/iu, /يضمن.{0,16}(?:أسرع|السرعة|الأداء)/u,
  ),
  "excel-viewer-macro-claim": localeTargets(
    /(?:Excel )?macros?/iu, /Excel 宏|宏/u, /Excelマクロ|マクロ/u, /Excel 매크로|매크로/u,
    /macros? (?:de )?Excel/iu, /macros? (?:do )?Excel/iu, /macros? Excel/iu, /Excel-Makros?|Makros?/iu, /макрос\p{L}*/iu, /وحدات الماكرو|ماكرو/u,
  ),
  "excel-viewer-formula-recalculation-claim": localeTargets(
    /formula recalculation|recalculates?.{0,12}formulas?/iu, /重新计算公式|公式重算/u, /数式の再計算|数式を再計算/u, /수식 재계산|수식을 다시 계산/u,
    /recálculo de fórmulas|recalcula.{0,8}fórmulas/iu, /recálculo de fórmulas|recalcula.{0,8}fórmulas/iu, /recalcul des formules|recalcule.{0,8}formules/iu,
    /Formelneuberechnung|berechnet.{0,8}Formeln neu/iu, /пересч\p{L}*.{0,8}формул\p{L}*/iu, /إعادة حساب الصيغ|يعيد حساب الصيغ/u,
  ),
  "excel-viewer-chart-claim": localeTargets(
    /(?:Excel|workbook).{0,8}charts?|charts?.{0,8}(?:Excel|workbook)/iu, /Excel 图表|工作簿图表/u, /Excelグラフ|ブックのグラフ/u, /Excel 차트|통합 문서 차트/u,
    /gráficos? (?:de Excel|del libro)/iu, /gráficos? (?:do Excel|da pasta)/iu, /graphiques? (?:Excel|du classeur)/iu,
    /Excel-Diagramme?|Arbeitsmappendiagramme?/iu, /диаграмм\p{L}*.{0,8}(?:Excel|книг\p{L}*)/iu, /مخططات Excel|مخططات المصنف/u,
  ),
  "excel-viewer-formatting-fidelity-claim": localeTargets(
    /full formatting|formatting fidelity|conditional formatting|Canvas formatting/iu, /完整格式|格式保真|条件格式|Canvas 格式/u, /完全な書式|書式の忠実度|条件付き書式|Canvas書式/u, /전체 서식|서식 충실도|조건부 서식|Canvas 서식/u,
    /formato completo|fidelidad de formato|formato condicional|formato Canvas/iu, /formatação completa|fidelidade de formatação|formatação condicional|formatação Canvas/iu, /mise en forme complète|fidélité de mise en forme|formatage conditionnel|formatage Canvas/iu,
    /vollständige Formatierung|Formatierungstreue|bedingte Formatierung|Canvas-Formatierung/iu, /полн\p{L}* форматирован\p{L}*|условн\p{L}* форматирован\p{L}*|Canvas.{0,8}форматирован\p{L}*/iu, /التنسيق الكامل|دقة التنسيق|التنسيق الشرطي|تنسيق Canvas/u,
  ),
  "excel-viewer-export-claim": localeTargets(
    /export.{0,16}(?:workbook|spreadsheet|Excel|CSV)/iu, /导出.{0,12}(?:工作簿|电子表格|Excel|CSV)/u, /(?:ブック|スプレッドシート|Excel|CSV).{0,12}エクスポート|エクスポート.{0,12}(?:ブック|Excel|CSV)/u, /(?:통합 문서|스프레드시트|Excel|CSV).{0,12}내보내기|내보내기.{0,12}(?:통합 문서|Excel|CSV)/u,
    /exporta.{0,16}(?:libro|hoja de cálculo|Excel|CSV)/iu, /exporta.{0,16}(?:pasta|planilha|Excel|CSV)/iu, /exporte.{0,16}(?:classeur|feuille de calcul|Excel|CSV)/iu,
    /exportiert.{0,16}(?:Arbeitsmappe|Tabelle|Excel|CSV)/iu, /экспортирует.{0,16}(?:книг\p{L}*|таблиц\p{L}*|Excel|CSV)/iu, /(?:يصدر|تصدر|تصدير|حفظ).{0,24}(?:المصنف|جدول البيانات|البيانات|النتائج|Excel|CSV)|(?:البيانات|النتائج).{0,20}(?:CSV|تصدير)/u,
  ),
  "excel-viewer-advanced-filter-claim": localeTargets(
    /(?:regex|regular expression|multi[- ]condition|advanced).{0,16}filter/iu, /(?:正则|多条件|高级).{0,12}筛选/u, /(?:正規表現|複数条件|高度な).{0,12}フィルター/u, /(?:정규식|다중 조건|고급).{0,12}필터/u,
    /filtros?.{0,16}(?:regex|expresiones regulares|múltiples condiciones|avanzados?)/iu, /filtros?.{0,16}(?:regex|expressões regulares|múltiplas condições|avançados?)/iu, /filtres?.{0,16}(?:regex|expressions régulières|critères multiples|avancés?)/iu,
    /(?:Regex|reguläre Ausdrücke|mehrere Bedingungen|erweiterte).{0,16}Filter/iu, /(?:регулярн\p{L}* выражен\p{L}*|нескольк\p{L}* услов\p{L}*|расширенн\p{L}*).{0,16}фильтр\p{L}*/iu, /(?:REGEX|تعبيرات منتظمة|شروط متعددة|متعددة الشروط|متقدم).{0,16}(?:تصفية|فلتر)|(?:تصفية|فلتر).{0,24}(?:REGEX|تعبيرات منتظمة|شروط متعددة|متعددة الشروط|متقدم)/u,
  ),
  "excel-viewer-multi-sort-claim": localeTargets(
    /(?:hierarchical|multi[- ]column|multi[- ]level).{0,16}sort/iu, /(?:分层|多列|多级).{0,12}排序/u, /(?:階層|複数列|複数レベル).{0,12}ソート/u, /(?:계층|다중 열|다단계).{0,12}정렬/u,
    /ordenación.{0,16}(?:jerárquica|multicolumna|multinivel)|(?:ordenamiento|ordenación).{0,16}múltiple/iu, /ordenação.{0,16}(?:hierárquica|multicoluna|multinível|múltipla)/iu, /tri.{0,16}(?:hiérarchique|multicolonne|multiniveau|multiple)/iu,
    /(?:hierarchische|mehrspaltige|mehrstufige).{0,16}Sortierung/iu, /(?:иерархическ\p{L}*|многоуровнев\p{L}*|по нескольким столбцам).{0,16}сортировк\p{L}*/iu, /(?:هرمي|متعدد الأعمدة|متعدد المستويات).{0,16}(?:فرز|ترتيب)|(?:فرز|ترتيب).{0,24}(?:هرمي|متعدد الأعمدة|متعدد المستويات|أعمدة متعددة)/u,
  ),
  "typing-speed-test-fixed-timer-claim": localeTargets(
    /(?:fixed|selectable|custom).{0,12}(?:timer|duration|time)/iu, /(?:固定|可选|自定义).{0,8}(?:计时器|时长|时间)/u, /(?:固定|選択可能|カスタム).{0,8}(?:タイマー|時間)/u, /(?:고정|선택|사용자 지정).{0,8}(?:타이머|시간)/u,
    /(?:temporizador|duración|tiempo).{0,12}(?:fijo|seleccionable|personalizado)/iu, /(?:temporizador|duração|tempo).{0,12}(?:fixo|selecionável|personalizado)/iu, /(?:minuteur|durée|temps).{0,12}(?:fixe|sélectionnable|personnalisé)/iu,
    /(?:fest\p{L}*|wählbar\p{L}*|benutzerdefiniert\p{L}*).{0,12}(?:Timer|Zeitraum|Dauer)/iu, /(?:фиксированн\p{L}*|настраиваем\p{L}*|выбираем\p{L}*).{0,12}(?:таймер|время|длительност\p{L}*)/iu, /(?:مؤقت|مدة|وقت).{0,12}(?:ثابت|قابل للاختيار|مخصص)/u,
  ),
  "typing-speed-test-cpm-claim": metricTargets(/CPM|characters per minute/iu, /CPM|每分钟字符/u, /CPM|1分あたりの文字数/u, /CPM|분당 문자/u, /CPM|caracteres por minuto/iu, /CPM|caracteres por minuto/iu, /CPM|caractères par minute/iu, /CPM|Zeichen pro Minute/iu, /CPM|символ\p{L}* в минуту/iu, /CPM|الأحرف في الدقيقة/u),
  "typing-speed-test-consistency-claim": metricTargets(/consistency (?:metric|score)/iu, /一致性(?:指标|分数)/u, /一貫性(?:指標|スコア)/u, /일관성 (?:지표|점수)/u, /(?:métrica|puntuación) de consistencia/iu, /(?:métrica|pontuação) de consistência/iu, /(?:mesure|score) de régularité/iu, /Konsistenz(?:wert|metrik)/iu, /(?:показател\p{L}*|оценк\p{L}*) стабильност\p{L}*/iu, /(?:مقياس|درجة) الاتساق/u),
  "typing-speed-test-history-claim": metricTargets(/(?:typing|test|result) history/iu, /打字历史|测试历史|结果历史/u, /入力履歴|テスト履歴|結果履歴/u, /타이핑 기록|테스트 기록|결과 기록/u, /historial (?:de escritura|de pruebas|de resultados)/iu, /histórico (?:de digitação|de testes|de resultados)/iu, /historique (?:de frappe|des tests|des résultats)/iu, /Tippverlauf|Testverlauf|Ergebnisverlauf/iu, /истори\p{L}* (?:набора|тестов|результатов)/iu, /سجل (?:الكتابة|الاختبارات|النتائج)/u),
  "typing-speed-test-account-claim": metricTargets(/user accounts?|sign[- ]in|profiles?/iu, /用户账户|登录|个人资料/u, /ユーザーアカウント|ログイン|プロフィール/u, /사용자 계정|로그인|프로필/u, /cuentas? de usuario|inicio de sesión|perfiles?/iu, /contas? de usuário|login|perfis?/iu, /comptes? utilisateur|connexion|profils?/iu, /Benutzerkonten?|Anmeldung|Profile?/iu, /учётн\p{L}* запис\p{L}*|вход|профил\p{L}*/iu, /حسابات المستخدم|تسجيل الدخول|الملفات الشخصية/u),
  "typing-speed-test-ranking-claim": metricTargets(/leaderboards?|global ranking|ranked results?/iu, /排行榜|全球排名|排名结果/u, /リーダーボード|世界ランキング|順位/u, /리더보드|글로벌 순위|순위 결과/u, /clasificación global|tabla de posiciones|resultados clasificados/iu, /ranking global|placar|resultados classificados/iu, /classement mondial|tableau des scores|résultats classés/iu, /Bestenliste|Weltrangliste|Rangliste/iu, /таблиц\p{L}* лидеров|глобальн\p{L}* рейтинг\p{L}*|ранжированн\p{L}* результат\p{L}*/iu, /لوحة المتصدرين|التصنيف العالمي|نتائج مرتبة/u),
  "typing-speed-test-certificate-claim": metricTargets(/(?:completion|typing) certificate/iu, /完成证书|打字证书/u, /修了証|タイピング証明書/u, /완료 인증서|타이핑 인증서/u, /certificado (?:de finalización|de mecanografía)/iu, /certificado (?:de conclusão|de digitação)/iu, /certificat (?:de fin|de frappe)/iu, /Abschlusszertifikat|Tippzertifikat/iu, /сертификат\p{L}* (?:об окончании|скорости печати)/iu, /شهادة (?:إكمال|كتابة)/u),
  "gantt-generator-dependencies-claim": metricTargets(/task dependencies|dependencies between tasks/iu, /任务依赖|任务之间的依赖/u, /タスクの?依存関係|タスク間の依存/u, /작업 종속성|작업 간 종속성/u, /dependencias? (?:de|entre) tareas/iu, /dependências? (?:de|entre) tarefas/iu, /dépendances? (?:des? |entre )?tâches/iu, /Aufgabenabhängigkeiten|Abhängigkeiten(?: zwischen Aufgaben)?/iu, /зависимост\p{L}* (?:задач|между задачами)/iu, /تبعيات المهام|الاعتماديات بين المهام/u),
  "gantt-generator-milestones-claim": metricTargets(/project milestones?/iu, /项目里程碑/u, /(?:プロジェクト)?マイルストーン/u, /(?:프로젝트 )?마일스톤/u, /hitos?(?: del proyecto)?/iu, /marcos?(?: do projeto)?/iu, /jalons?(?: du projet)?/iu, /(?:Projekt)?Meilenstein\p{L}*/iu, /вех\p{L}*(?: проекта)?/iu, /معالم(?: المشروع)?/u),
  "gantt-generator-critical-path-claim": metricTargets(/critical path/iu, /关键路径/u, /クリティカルパス/u, /주요 경로|임계 경로/u, /ruta crítica/iu, /caminho crítico/iu, /chemin critique/iu, /kritischer Pfad/iu, /критическ\p{L}* пут\p{L}*/iu, /المسار الحرج/u),
  "gantt-generator-persistence-claim": metricTargets(/saved? (?:charts?|projects?)|chart persistence/iu, /保存(?:图表|项目)|持久化/u, /(?:チャート|プロジェクト)保存|永続化/u, /(?:차트|프로젝트) 저장|영구 저장/u, /guarda (?:diagramas?|proyectos?)|persistencia/iu, /salva (?:gráficos?|projetos?)|persistência/iu, /enregistre (?:diagrammes?|projets?)|persistance/iu, /speichert (?:Diagramme|Projekte)|Persistenz/iu, /сохраняет (?:диаграмм\p{L}*|проект\p{L}*)|постоянн\p{L}* хранени\p{L}*/iu, /يحفظ (?:المخططات|المشاريع)|تخزين دائم/u),
  "gantt-generator-data-transfer-claim": metricTargets(/(?:import|export).{0,12}(?:project|task|chart) data/iu, /(?:导入|导出).{0,8}(?:项目|任务|图表)数据/u, /(?:プロジェクト|タスク|チャート)データ.{0,8}(?:インポート|エクスポート)/u, /(?:프로젝트|작업|차트) 데이터.{0,8}(?:가져오기|내보내기)/u, /(?:importa|exporta).{0,12}datos (?:del proyecto|de tareas|del diagrama)/iu, /(?:importa|exporta).{0,12}dados (?:do projeto|de tarefas|do gráfico)/iu, /(?:importe|exporte).{0,12}données (?:du projet|des tâches|du diagramme)/iu, /(?:importiert|exportiert).{0,12}(?:Projekt|Aufgaben|Diagramm)daten/iu, /(?:импортирует|экспортирует).{0,12}(?:данные проекта|данные задач|данные диаграммы)/iu, /(?:يستورد|يصدر).{0,12}(?:بيانات المشروع|بيانات المهام|بيانات المخطط)/u),
  "gantt-generator-collaboration-claim": metricTargets(/real[- ]time collaboration|team sharing/iu, /实时协作|团队共享/u, /リアルタイム共同作業|チーム共有/u, /실시간 협업|팀 공유/u, /colaboración en tiempo real|compartir con el equipo/iu, /colaboração em tempo real|compartilhar com a equipe/iu, /collaboration en temps réel|partage avec l’équipe/iu, /Echtzeit-Zusammenarbeit|Teilen im Team/iu, /совместн\p{L}* работ\p{L}* в реальном времени|доступ для команды/iu, /تعاون في الوقت الفعلي|مشاركة الفريق/u),
};

function localeTargets(
  en: RegExp,
  zh: RegExp,
  ja: RegExp,
  ko: RegExp,
  es: RegExp,
  pt: RegExp,
  fr: RegExp,
  de: RegExp,
  ru: RegExp,
  ar: RegExp,
): ClaimTargets {
  return { en, zh, ja, ko, es, pt, fr, de, ru, ar };
}

function targetDetectors(targets: ClaimTargets): Record<Locale, LocaleClaimDetector> {
  return Object.fromEntries(
    (Object.keys(targets) as Locale[]).map((locale) => [
      locale,
      {
        target: targets[locale],
        assertion: ASSERTION_BY_LOCALE[locale],
        negation: NEGATION_BY_LOCALE[locale],
      },
    ]),
  ) as Record<Locale, LocaleClaimDetector>;
}

const TAXONOMY: Readonly<Record<string, Record<Locale, LocaleClaimDetector>>> = {
  "hex-editor-grid-claim": Object.fromEntries(
    (Object.keys(HEX_GRID_BY_LOCALE) as Locale[]).map((locale) => [
      locale,
      {
        affirmative: HEX_GRID_BY_LOCALE[locale],
        negation: NEGATION_BY_LOCALE[locale],
      },
    ]),
  ) as Record<Locale, LocaleClaimDetector>,
  ...Object.fromEntries(
    Object.entries(CLAIM_TARGETS).map(([code, targets]) => [
      code,
      targetDetectors(targets),
    ]),
  ),
};

function test(pattern: RegExp, value: string): boolean {
  pattern.lastIndex = 0;
  const matched = pattern.test(value);
  pattern.lastIndex = 0;
  return matched;
}

function matchesExternalFaqRecommendation(
  locale: Locale,
  segment: string,
): boolean {
  const locationBinding = FINAL_LOCATION_BINDING_BY_LOCALE[locale];
  if (locationBinding) {
    locationBinding.predicate.lastIndex = 0;
    const predicates = [...segment.matchAll(locationBinding.predicate)];
    locationBinding.predicate.lastIndex = 0;
    const finalPredicate = predicates.at(-1);
    if (!finalPredicate || finalPredicate.index === undefined) {
      return false;
    }

    const beforePredicate = segment.slice(0, finalPredicate.index);
    locationBinding.location.lastIndex = 0;
    const locations = [...beforePredicate.matchAll(locationBinding.location)];
    locationBinding.location.lastIndex = 0;
    const finalLocation = locations.at(-1)?.[0];
    return Boolean(
      finalLocation &&
        test(locationBinding.externalLocation, finalLocation),
    );
  }

  const recommendation = FAQ_EXTERNAL_RECOMMENDATION_BY_LOCALE[locale];
  return Boolean(recommendation && test(recommendation, segment));
}

function matchesJaKoSqlExecutionAction(
  locale: Locale,
  segment: string,
): boolean | undefined {
  if (locale !== "ja" && locale !== "ko") {
    return undefined;
  }

  const action = SQL_EXECUTION_ACTION_BY_LOCALE[locale];
  const locationBinding = FINAL_LOCATION_BINDING_BY_LOCALE[locale];
  if (!locationBinding) {
    return false;
  }
  action.predicate.lastIndex = 0;
  const predicates = [...segment.matchAll(action.predicate)];
  action.predicate.lastIndex = 0;
  let sqlContext = false;
  let contextCursor = 0;

  return predicates.some((predicate) => {
    if (predicate.index === undefined) {
      return false;
    }

    const beforePredicate = segment.slice(0, predicate.index);
    const fromPredicate = segment.slice(predicate.index);
    sqlContext ||= test(
      action.sqlObject,
      segment.slice(contextCursor, predicate.index),
    );
    contextCursor = predicate.index + predicate[0].length;
    action.boundary.lastIndex = 0;
    const boundaries = [...beforePredicate.matchAll(action.boundary)];
    action.boundary.lastIndex = 0;
    const finalBoundary = boundaries.at(-1);
    const actionStart = finalBoundary?.index === undefined
      ? 0
      : finalBoundary.index + finalBoundary[0].length;
    const actionPrefix = beforePredicate.slice(actionStart);
    const directObject = actionPrefix.match(action.directObject)?.[1];
    if (directObject) {
      sqlContext = test(action.sqlDirectObject, directObject);
    }
    if (
      !sqlContext ||
      test(action.meta, fromPredicate) ||
      test(action.negation, fromPredicate)
    ) {
      return false;
    }

    locationBinding.location.lastIndex = 0;
    const locations = [...actionPrefix.matchAll(locationBinding.location)];
    locationBinding.location.lastIndex = 0;
    const finalLocation = locations.at(-1)?.[0];
    return !(
      finalLocation &&
      test(locationBinding.externalLocation, finalLocation)
    );
  });
}

function splitClaimSegments(text: string, locale?: Locale): string[] {
  const sentences =
    text.match(/[^\n\r.!?。！？؟؛;]+[.!?。！？؟؛;]?/gu) ?? [];
  const contrast = locale ? CONTRAST_BY_LOCALE[locale] : undefined;

  return sentences
    .flatMap((sentence) =>
      contrast ? sentence.split(contrast) : [sentence],
    )
    .map((segment) => segment.trim())
    .filter(Boolean);
}

export function matchesLocalizedCapabilityClaim(
  code: string,
  locale: string,
  text: string,
  fallback?: RegExp,
): boolean {
  const detector = TAXONOMY[code]?.[locale as Locale];
  if (!detector) {
    return Boolean(
      fallback &&
        splitClaimSegments(text).some((segment) => test(fallback, segment)),
    );
  }

  const resolvedLocale = locale as Locale;
  const segments = splitClaimSegments(text, resolvedLocale);
  return segments.some((segment, index) => {
    if (/[?？؟]\s*$/u.test(segment)) {
      const answer = segments[index + 1];
      if (
        !answer ||
        !test(BARE_AFFIRMATIVE_BY_LOCALE[resolvedLocale], answer)
      ) {
        return false;
      }
    }
    if (code === "sql-optimizer-execution-claim") {
      const sqlExecutionAction = matchesJaKoSqlExecutionAction(
        resolvedLocale,
        segment,
      );
      if (sqlExecutionAction !== undefined) {
        return sqlExecutionAction;
      }
    }
    const previous = segments[index - 1];
    const faqQuestion = segments[index - 2];
    if (
      previous &&
      faqQuestion &&
      /[?？؟]\s*$/u.test(faqQuestion) &&
      test(BARE_NEGATIVE_BY_LOCALE[resolvedLocale], previous) &&
      matchesExternalFaqRecommendation(resolvedLocale, segment)
    ) {
      return false;
    }
    if (test(detector.negation, segment)) {
      return false;
    }
    if (detector.affirmative) {
      return (
        test(detector.affirmative, segment) ||
        Boolean(fallback && test(fallback, segment))
      );
    }
    return Boolean(
      detector.target &&
        detector.assertion &&
        test(detector.target, segment) &&
        test(detector.assertion, segment),
    ) || Boolean(fallback && test(fallback, segment));
  });
}

export function hasLocalizedCapabilityClaimDetector(
  code: string,
  locale: Locale,
): boolean {
  return Boolean(TAXONOMY[code]?.[locale]);
}
