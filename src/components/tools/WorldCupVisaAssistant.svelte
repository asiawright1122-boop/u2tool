<script lang="ts">
  import { onMount } from 'svelte';
  import {
    Plus,
    Trash2,
    ArrowUp,
    ArrowDown,
    ShieldAlert,
    CheckSquare,
    Square,
    AlertTriangle,
    FileText,
    ChevronRight,
    Plane,
    Luggage,
    HelpCircle
  } from 'lucide-svelte';
  import { evaluateVisaRequirements, CITY_COUNTRY_MAP } from '../../lib/runtime-integrity/world-cup-visa-engine';
  import { createTranslator } from '../../lib/translations';

  interface Props {
    locale: string;
    translations: any;
  }
  let props: Props = $props();

  function t(key: string, fallback?: string): string {
    return createTranslator(props.translations, props.locale, 'tools.world-cup-visa-assistant')(key, fallback);
  }

  // IANA/ISO Country Names (10 Locales)
  const COUNTRIES: Record<string, Record<string, string>> = {
    CHN: { en: 'China', zh: '中国', es: 'China', pt: 'China', ja: '中国', ru: 'Китай', fr: 'Chine', ar: 'الصين', de: 'China', ko: '중국' },
    IND: { en: 'India', zh: '印度', es: 'India', pt: 'Índia', ja: 'インド', ru: 'Индия', fr: 'Inde', ar: 'الهند', de: 'Indien', ko: '인도' },
    USA: { en: 'United States', zh: '美国', es: 'Estados Unidos', pt: 'Estados Unidos', ja: 'アメリカ', ru: 'США', fr: 'États-Unis', ar: 'الولايات المتحدة', de: 'USA', ko: '미국' },
    CAN: { en: 'Canada', zh: '加拿大', es: 'Canadá', pt: 'Canadá', ja: 'カナダ', ru: 'Канада', fr: 'Canada', ar: 'كندا', de: 'Kanada', ko: '캐나다' },
    MEX: { en: 'Mexico', zh: '墨西哥', es: 'México', pt: 'México', ja: 'メキシコ', ru: 'Мексика', fr: 'Mexique', ar: 'المكسيك', de: 'Mexiko', ko: '멕시코' },
    GBR: { en: 'United Kingdom', zh: '英国', es: 'Reino Unido', pt: 'Reino Unido', ja: 'イギリス', ru: 'Великобритания', fr: 'Royaume-Uni', ar: 'المملكة المتحدة', de: 'Großbritannien', ko: '영국' },
    FRA: { en: 'France', zh: '法国', es: 'Francia', pt: 'França', ja: 'フランス', ru: 'Франция', fr: 'France', ar: 'فرنسا', de: 'Frankreich', ko: '프랑스' },
    DEU: { en: 'Germany', zh: '德国', es: 'Alemania', pt: 'Alemanha', ja: 'ドイツ', ru: 'Гermания', fr: 'Allemagne', ar: 'ألمانيا', de: 'Deutschland', ko: '독일' },
    JPN: { en: 'Japan', zh: '日本', es: 'Japón', pt: 'Japão', ja: '日本', ru: 'Япония', fr: 'Japon', ar: 'اليابان', de: 'Japan', ko: '일본' },
    KOR: { en: 'South Korea', zh: '韩国', es: 'Corea del Sur', pt: 'Coreia do Sul', ja: '韓国', ru: 'Южная Корея', fr: 'Corée du Sud', ar: 'كوريا الجنوبية', de: 'Südkorea', ko: '대한민국' },
    AUS: { en: 'Australia', zh: '澳大利亚', es: 'Australia', pt: 'Austrália', ja: 'オーストラリア', ru: 'Австралия', fr: 'Australie', ar: 'أستراليا', de: 'Australien', ko: '호주' },
    BRA: { en: 'Brazil', zh: '巴西', es: 'Brasil', pt: 'Brasil', ja: 'ブラジル', ru: 'Бразилия', fr: 'Brésil', ar: 'البرازيل', de: 'Brasilien', ko: '브라질' },
    ARG: { en: 'Argentina', zh: '阿根廷', es: 'Argentina', pt: 'Argentina', ja: 'アルゼンチン', ru: 'Аргентина', fr: 'Argentine', ar: 'الأرجنتين', de: 'Argentinien', ko: '아르헨티나' }
  };

  // Visas translation map
  const VISA_TYPES: Record<string, Record<string, string>> = {
    US_B1B2: {
      en: 'US B1/B2 Visa (Visitor)',
      zh: '美国 B1/B2 旅游签证',
      es: 'Visa de Turista EE. UU. B1/B2',
      pt: 'Visto Americano B1/B2',
      ja: '米国 B1/B2 ビザ（観光）',
      ru: 'Виза США B1/B2 (туристическая)',
      fr: 'Visa américain B1/B2 (visiteur)',
      ar: 'تأشيرة أمريكا B1/B2 (سياحية)',
      de: 'USA B1/B2 Visum (Besucher)',
      ko: '미국 B1/B2 방문 비자'
    },
    CA_VISA: {
      en: 'Canada Visitor Visa (TRV)',
      zh: '加拿大 TRV 旅游签证',
      es: 'Visa de Turista de Canadá',
      pt: 'Visto Canadense de Turista',
      ja: 'カナダ観光ビザ',
      ru: 'Виза Канады TRV (туристическая)',
      fr: 'Visa de visiteur du Canada (VRT)',
      ar: 'تأشيرة كندا (سياحية)',
      de: 'Kanada Besuchervisum (TRV)',
      ko: '캐나다 방문 비자 (TRV)'
    },
    SCHENGEN: {
      en: 'Schengen Visa (Multiple)',
      zh: '申根签证 (多次往返)',
      es: 'Visa Schengen (Múltiple)',
      pt: 'Visto Schengen (Múltiplo)',
      ja: 'シェンゲンビザ（数次）',
      ru: 'Шенгенская виза (многократная)',
      fr: 'Visa Schengen (multiples entrées)',
      ar: 'تأشيرة شينغن (دخول متعدد)',
      de: 'Schengen-Visum (Mehrfach)',
      ko: '쉥겐 비자 (복수 입국)'
    },
    UK_VISA: {
      en: 'UK Visitor Visa',
      zh: '英国旅游签证',
      es: 'Visa de Turista de Reino Unido',
      pt: 'Visto do Reino Unido',
      ja: '英国観光ビザ',
      ru: 'Виза Великобритании',
      fr: 'Visa de visiteur du Royaume-Uni',
      ar: 'تأشيرة بريطانيا',
      de: 'Großbritannien Besuchervisum',
      ko: '영국 방문 비자'
    },
    JP_VISA: {
      en: 'Japan Tourist Visa',
      zh: '日本旅游签证',
      es: 'Visa de Turista de Japón',
      pt: 'Visto de Turista do Japão',
      ja: '日本観光ビザ',
      ru: 'Виза Японии',
      fr: 'Visa de tourisme du Japon',
      ar: 'تأشيرة اليابان',
      de: 'Japan Touristenvisum',
      ko: '일본 관광 비자'
    },
    US_GREEN_CARD: {
      en: 'US Green Card (PR)',
      zh: '美国永久居民卡 (绿卡)',
      es: 'Tarjeta Verde de EE. UU. (RP)',
      pt: 'Green Card dos EUA (Residente)',
      ja: '米国グリーンカード（永住権）',
      ru: 'Грин-карта США (ВНЖ)',
      fr: 'Carte verte américaine (RP)',
      ar: 'البطاقة الخضراء الأمريكية (إقامة)',
      de: 'USA Green Card (PR)',
      ko: '미국 영주권 (그린카드)'
    },
    CA_PR: {
      en: 'Canada Maple Card (PR)',
      zh: '加拿大永久居民卡 (枫叶卡)',
      es: 'Residencia de Canadá (PR)',
      pt: 'Residência do Canadá (PR)',
      ja: 'カナダ PR カード（永住権）',
      ru: 'ПМЖ Канады (PR)',
      fr: 'Carte RP canadienne',
      ar: 'الإقامة الدائمة الكندية (PR)',
      de: 'Kanada PR-Karte (PR)',
      ko: '캐나다 영주권 (PR)'
    }
  };

  // Host cities details
  const HOST_CITIES: Record<string, { name: string; country: 'USA' | 'CAN' | 'MEX'; flag: string }> = {
    SEA: { name: 'Seattle', country: 'USA', flag: '🇺🇸' },
    YVR: { name: 'Vancouver', country: 'CAN', flag: '🇨🇦' },
    SFO: { name: 'San Francisco', country: 'USA', flag: '🇺🇸' },
    LAX: { name: 'Los Angeles', country: 'USA', flag: '🇺🇸' },
    GDL: { name: 'Guadalajara', country: 'MEX', flag: '🇲🇽' },
    MEX: { name: 'Mexico City', country: 'MEX', flag: '🇲🇽' },
    MTY: { name: 'Monterrey', country: 'MEX', flag: '🇲🇽' },
    HOU: { name: 'Houston', country: 'USA', flag: '🇺🇸' },
    DFW: { name: 'Dallas', country: 'USA', flag: '🇺🇸' },
    MCI: { name: 'Kansas City', country: 'USA', flag: '🇺🇸' },
    ATL: { name: 'Atlanta', country: 'USA', flag: '🇺🇸' },
    MIA: { name: 'Miami', country: 'USA', flag: '🇺🇸' },
    YYZ: { name: 'Toronto', country: 'CAN', flag: '🇨🇦' },
    BOS: { name: 'Boston', country: 'USA', flag: '🇺🇸' },
    PHL: { name: 'Philadelphia', country: 'USA', flag: '🇺🇸' },
    NYC: { name: 'New York', country: 'USA', flag: '🇺🇸' }
  };

  // General UI elements
  const uiTranslations: Record<string, Record<string, string>> = {
    en: {
      fanProfileTitle: '1. Passport & Visa Context',
      selectPassport: 'Passport Nationality',
      heldVisas: 'Valid Visas or PR Status you currently hold',
      itineraryTitle: '2. Your World Cup Itinerary',
      addCity: 'Add City to Route',
      selectCityPlaceholder: 'Select a city...',
      clearItinerary: 'Clear Route',
      noCities: 'Please add cities to build your cross-border itinerary.',
      transitReportsTitle: '3. Cross-Border Visa Evaluation',
      noTransitLegs: 'Your itinerary does not contain international crossings.',
      checklistTitle: '4. Dynamic Customs Packing Checklist',
      overallWarnings: 'Critical Itinerary Alerts',
      checklistProgress: 'Travel Materials Checklist',
      moveUp: 'Move Up',
      moveDown: 'Move Down',
      remove: 'Remove',
      visaHeldNone: 'No active visa from options',
      shortcutTitle: 'Recommended Routes',
      shortcutVanSeaMex: 'Vancouver ➔ Seattle ➔ Mexico City (Tri-nation Tour)',
      shortcutLaMex: 'Los Angeles ➔ Monterrey ➔ Dallas (West & Central)',
      from: 'From',
      to: 'To',
      legStatusOk: 'Visa Free',
      legStatusWarning: 'Electronic Authorization',
      legStatusRequired: 'Physical Visa Required',
      preparedText: 'Prepared'
    },
    zh: {
      fanProfileTitle: '1. 您的护照国籍与持签背景',
      selectPassport: '护照签发国 (国籍)',
      heldVisas: '您当前持有的有效签证或永久居留权 (PR)',
      itineraryTitle: '2. 规划您的世界杯观赛城市路线',
      addCity: '添加城市到行程',
      selectCityPlaceholder: '选择一个世界杯承办城市...',
      clearItinerary: '清空路线',
      noCities: '行程中暂无城市，请从上方选择城市并添加以开始跨国精算评估。',
      transitReportsTitle: '3. 跨国过境出入境签证报告',
      noTransitLegs: '当前行程为单国旅行或暂无跨国过境，不需要申请跨国签证。',
      checklistTitle: '4. 随身携带纸质与电子材料自检清单',
      overallWarnings: '世界杯出行总体风险警示',
      checklistProgress: '随身行李出行材料自检进度',
      moveUp: '上移',
      moveDown: '下移',
      remove: '删除',
      visaHeldNone: '未持有以上任何签证',
      shortcutTitle: '官方推荐观赛体验路线',
      shortcutVanSeaMex: '温哥华 ➔ 西雅图 ➔ 墨西哥城 (三国体验之旅)',
      shortcutLaMex: '洛杉矶 ➔ 蒙特雷 ➔ 达拉斯 (中西部大区穿梭)',
      from: '出发',
      to: '到达',
      legStatusOk: '免签证',
      legStatusWarning: '需电子旅行授权',
      legStatusRequired: '需申请实体签证',
      preparedText: '已准备'
    },
    es: {
      fanProfileTitle: '1. Pasaporte y Visados Activos',
      selectPassport: 'Nacionalidad de Pasaporte',
      heldVisas: 'Visados válidos o residencias que posee',
      itineraryTitle: '2. Itinerario del Mundial 2026',
      addCity: 'Añadir Ciudad a Ruta',
      selectCityPlaceholder: 'Seleccionar ciudad...',
      clearItinerary: 'Borrar Ruta',
      noCities: 'Por favor, añada ciudades para construir su itinerario.',
      transitReportsTitle: '3. Evaluación de Cruce de Fronteras',
      noTransitLegs: 'Su itinerario no contiene cruces internacionales de fronteras.',
      checklistTitle: '4. Lista de Control de Documentación de Aduanas',
      overallWarnings: 'Alertas Críticas de Viaje',
      checklistProgress: 'Estado de Preparación de Documentación',
      moveUp: 'Subir',
      moveDown: 'Bajar',
      remove: 'Quitar',
      visaHeldNone: 'Ninguno de los anteriores',
      shortcutTitle: 'Rutas Recomendadas',
      shortcutVanSeaMex: 'Vancouver ➔ Seattle ➔ Ciudad de México (Gira Trinacional)',
      shortcutLaMex: 'Los Ángeles ➔ Monterrey ➔ Dallas (Frontera Oeste-Centro)',
      from: 'Desde',
      to: 'A',
      legStatusOk: 'Exento de Visa',
      legStatusWarning: 'Autorización Electrónica',
      legStatusRequired: 'Requiere Visado Físico',
      preparedText: 'Listo'
    },
    pt: {
      fanProfileTitle: '1. Passaporte e Visto Atual',
      selectPassport: 'Nacionalidade do Passaporte',
      heldVisas: 'Vistos ou residências válidos que possui',
      itineraryTitle: '2. Roteiro da Copa do Mundo',
      addCity: 'Adicionar Cidade',
      selectCityPlaceholder: 'Selecionar cidade...',
      clearItinerary: 'Limpar Roteiro',
      noCities: 'Adicione cidades acima para avaliar o trânsito nas fronteiras.',
      transitReportsTitle: '3. Avaliação de Visto de Trânsito',
      noTransitLegs: 'Seu roteiro não contém passagens de fronteiras internacionais.',
      checklistTitle: '4. Lista de Verificação de Documentos Aduaneiros',
      overallWarnings: 'Alertas Críticos de Viagem',
      checklistProgress: 'Documentos e Materiais de Viagem',
      moveUp: 'Subir',
      moveDown: 'Descer',
      remove: 'Remover',
      visaHeldNone: 'Nenhum dos vistos acima',
      shortcutTitle: 'Roteiros Sugeridos',
      shortcutVanSeaMex: 'Vancouver ➔ Seattle ➔ Cidade do México (Tour Trinacional)',
      shortcutLaMex: 'Los Angeles ➔ Monterrey ➔ Dallas (Trânsito Oeste-Centro)',
      from: 'De',
      to: 'Para',
      legStatusOk: 'Isento',
      legStatusWarning: 'Autorização Eletrônica',
      legStatusRequired: 'Exige Visto Físico',
      preparedText: 'Preparado'
    },
    ja: {
      fanProfileTitle: '1. パスポートとビザの状況',
      selectPassport: 'パスポート国籍',
      heldVisas: '現在保有している有効なビザ・永住権',
      itineraryTitle: '2. 観戦ルートプランナー',
      addCity: '都市をルートに追加',
      selectCityPlaceholder: '都市を選択してください...',
      clearItinerary: 'ルートをクリア',
      noCities: '都市を追加して国境越えルートを構築してください。',
      transitReportsTitle: '3. 国境通過ビザ評価',
      noTransitLegs: '旅程に国際国境通過が含まれていません。',
      checklistTitle: '4. 税関提出書類セルフチェックリスト',
      overallWarnings: '旅程に関する重要な警告',
      checklistProgress: '必要書類の準備状況',
      moveUp: '上へ',
      moveDown: '下へ',
      remove: '削除',
      visaHeldNone: '上記のビザはいずれも持っていない',
      shortcutTitle: 'おすすめ観戦ルート',
      shortcutVanSeaMex: 'バンクーバー ➔ シアトル ➔ メキシコシティ（3カ国満喫ルート）',
      shortcutLaMex: 'ロサンゼルス ➔ モンテレイ ➔ ダラス（中西部横断ルート）',
      from: '出発',
      to: '到着',
      legStatusOk: 'ビザ免除',
      legStatusWarning: '電子渡航認証が必要',
      legStatusRequired: '物理ビザ申請が必要',
      preparedText: '準備完了'
    },
    ru: {
      fanProfileTitle: '1. Данные паспорта и виз',
      selectPassport: 'Гражданство паспорта',
      heldVisas: 'Действующие визы или ВНЖ, которые у вас есть',
      itineraryTitle: '2. Маршрут поездки на ЧМ-2026',
      addCity: 'Добавить город в маршрут',
      selectCityPlaceholder: 'Выберите город...',
      clearItinerary: 'Очистить маршрут',
      noCities: 'Добавьте города, чтобы построить маршрут пересечения границ.',
      transitReportsTitle: '3. Экспертиза визовых требований',
      noTransitLegs: 'Ваш маршрут не предусматривает пересечения международных границ.',
      checklistTitle: '4. Динамический чек-лист документов для таможни',
      overallWarnings: 'Критические предупреждения',
      checklistProgress: 'Готовность документов для поездки',
      moveUp: 'Вверх',
      moveDown: 'Вниз',
      remove: 'Удалить',
      visaHeldNone: 'Нет ни одной из этих виз',
      shortcutTitle: 'Рекомендуемые маршруты',
      shortcutVanSeaMex: 'Ванкувер ➔ Сиэтл ➔ Мехико (Турне по трем странам)',
      shortcutLaMex: 'Лос-Анджелес ➔ Монтеррей ➔ Даллас (Запад и Центр)',
      from: 'Из',
      to: 'В',
      legStatusOk: 'Безвизовый',
      legStatusWarning: 'Онлайн-разрешение',
      legStatusRequired: 'Нужна физическая виза',
      preparedText: 'Готово'
    },
    fr: {
      fanProfileTitle: '1. Nationalité et Visas Détenus',
      selectPassport: 'Nationalité du passeport',
      heldVisas: 'Visas ou permis de séjour en cours de validité',
      itineraryTitle: '2. Itinéraire de la Coupe du Monde',
      addCity: 'Ajouter une ville',
      selectCityPlaceholder: 'Choisir une ville...',
      clearItinerary: 'Effacer l’itinéraire',
      noCities: 'Ajoutez des villes pour concevoir votre parcours frontalier.',
      transitReportsTitle: '3. Évaluation du Passage des Frontières',
      noTransitLegs: 'Votre itinéraire ne comporte pas de passages frontaliers.',
      checklistTitle: '4. Checklist Dynamique des Formalités de Voyage',
      overallWarnings: 'Alertes de Voyage Importantes',
      checklistProgress: 'Documents de voyage préparés',
      moveUp: 'Monter',
      moveDown: 'Descendre',
      remove: 'Retirer',
      visaHeldNone: 'Aucun visa ci-dessus',
      shortcutTitle: 'Itinéraires Recommandés',
      shortcutVanSeaMex: 'Vancouver ➔ Seattle ➔ Mexico (Tour trinational)',
      shortcutLaMex: 'Los Angeles ➔ Monterrey ➔ Dallas (Jonction Ouest-Centre)',
      from: 'De',
      to: 'À',
      legStatusOk: 'Sans Visa',
      legStatusWarning: 'Autorisation Électronique',
      legStatusRequired: 'Visa Physique Requis',
      preparedText: 'Préparé'
    },
    ar: {
      fanProfileTitle: '١. جنسية الجواز والتأشيرات الحالية',
      selectPassport: 'جنسية جواز السفر',
      heldVisas: 'التأشيرات أو الإقامات الدائمة الصالحة التي تحملها حالياً',
      itineraryTitle: '٢. مخطط مسار رحلتك في كأس العالم',
      addCity: 'إضافة مدينة للمسار',
      selectCityPlaceholder: 'اختر مدينة...',
      clearItinerary: 'مسح المسار',
      noCities: 'يرجى إضافة مدن لبناء مسار رحلتك العابر للحدود.',
      transitReportsTitle: '٣. تقييم تأشيرات عبور الحدود',
      noTransitLegs: 'مسار رحلتك لا يتضمن أي عبور لحدود دولية.',
      checklistTitle: '٤. قائمة المستندات الجمركية المطلوبة للتفتيش',
      overallWarnings: 'تنبيهات السفر الهامة',
      checklistProgress: 'حالة تجهيز وثائق ومواد السفر',
      moveUp: 'تحريك لأعلى',
      moveDown: 'تحريك لأسفل',
      remove: 'إلغاء',
      visaHeldNone: 'لا أحمل أي تأشيرة مما ذكر',
      shortcutTitle: 'المسارات المقترحة',
      shortcutVanSeaMex: 'فانكوفر ➔ سياتل ➔ مكسيكو سيتي (جولة الدول الثلاث)',
      shortcutLaMex: 'لوس أنجلوس ➔ مونتيري ➔ دالاس (مسار الغرب والوسط)',
      from: 'من',
      to: 'إلى',
      legStatusOk: 'إعفاء من التأشيرة',
      legStatusWarning: 'تصريح إلكتروني مطلوب',
      legStatusRequired: 'تأشيرة ملموسة مطلوبة',
      preparedText: 'جاهز'
    },
    de: {
      fanProfileTitle: '1. Pass- & Visadetails',
      selectPassport: 'Pass-Staatsangehörigkeit',
      heldVisas: 'Gültige Visa oder Aufenthaltsrechte in Ihrem Besitz',
      itineraryTitle: '2. Reiseroute für die WM 2026',
      addCity: 'Stadt zur Route hinzufügen',
      selectCityPlaceholder: 'Austragungsort wählen...',
      clearItinerary: 'Route löschen',
      noCities: 'Fügen Sie Städte hinzu, um Ihre Reiseroute zu bewerten.',
      transitReportsTitle: '3. Grenztransit-Visumbewertung',
      noTransitLegs: 'Ihre Reiseroute enthält keine internationalen Grenzübertritte.',
      checklistTitle: '4. Dynamische Zoll-Packliste für Dokumente',
      overallWarnings: 'Wichtige Reisewarnungen',
      checklistProgress: 'Vorbereitete Reiseunterlagen',
      moveUp: 'Hoch',
      moveDown: 'Runter',
      remove: 'Entfernen',
      visaHeldNone: 'Keines der oben genannten Visa',
      shortcutTitle: 'Empfohlene WM-Routen',
      shortcutVanSeaMex: 'Vancouver ➔ Seattle ➔ Mexiko-Stadt (Drei-Länder-Reise)',
      shortcutLaMex: 'Los Angeles ➔ Monterrey ➔ Dallas (West-Mitte-Transit)',
      from: 'Von',
      to: 'Nach',
      legStatusOk: 'Visumfrei',
      legStatusWarning: 'Online-Genehmigung',
      legStatusRequired: 'Physisches Visum nötig',
      preparedText: 'Bereit'
    },
    ko: {
      fanProfileTitle: '1. 여권 국적 및 보유 비자',
      selectPassport: '여권 소지 국적',
      heldVisas: '현재 보유 중인 유효한 비자 및 영주권',
      itineraryTitle: '2. 월드컵 관람 경로 설계',
      addCity: '경로에 도시 추가',
      selectCityPlaceholder: '개최 도시 선택...',
      clearItinerary: '경로 초기화',
      noCities: '국경 통과를 평가하려면 관람 경로에 도시를 추가해 주세요.',
      transitReportsTitle: '3. 구간별 출입국 비자 평가 보고서',
      noTransitLegs: '경로 내에 국제 국경 통과 구간이 없습니다.',
      checklistTitle: '4. 휴대 물품 및 세관 제출 서류 체크리스트',
      overallWarnings: '주요 경로 경고 메시지',
      checklistProgress: '여행 준비 서류 진행률',
      moveUp: '위로',
      moveDown: '아래로',
      remove: '삭제',
      visaHeldNone: '보유 중인 비자 없음',
      shortcutTitle: '추천 관람 일정 경로',
      shortcutVanSeaMex: '밴쿠버 ➔ 시애틀 ➔ 멕시코시티 (3개국 대륙 투어)',
      shortcutLaMex: '로스앤젤레스 ➔ 몬테레이 ➔ 다라스 (서부-중부 횡단)',
      from: '출발',
      to: '도착',
      legStatusOk: '비자 면제',
      legStatusWarning: '전자 여행 허가 필요',
      legStatusRequired: '실물 비자 요구',
      preparedText: '준비 완료'
    }
  };

  const engineKeyMap: Record<string, string> = {
    // Visa Required statuses
    'None / Visa Free': 'status.visa_free',
    'None (US Citizen)': 'status.us_citizen',
    'None (US Green Card Holder)': 'status.us_green_card',
    'ESTA Required': 'status.esta_req',
    'US B1/B2 Visa (Held)': 'status.us_visa_held',
    'US B1/B2 Visa Required': 'status.us_visa_req',
    'None (Canada Citizen)': 'status.ca_citizen',
    'None (Canada PR Holder)': 'status.ca_pr',
    'eTA Required': 'status.eta_req',
    'eTA Required (via US Visa)': 'status.eta_us_visa',
    'Canada Visa (Held)': 'status.ca_visa_held',
    'Canada Visa Required': 'status.ca_visa_req',
    'None (Mexico Citizen)': 'status.mx_citizen',
    'None (Exempt via Held Visa)': 'status.mx_exempt',
    'Mexico Visa Required': 'status.mx_visa_req',

    // Descriptions
    'US passport holders can enter the United States freely without visa documents.': 'desc.us_citizen',
    'Permanent residents of the US can enter freely. Ensure you carry your physical Green Card.': 'desc.us_green_card',
    'Eligible for Visa Waiver Program (ESTA). You must apply for an online ESTA authorization at least 72 hours before departure.': 'desc.esta_req',
    'Carry your physical passport containing the valid US B1/B2 visa sticker. Ensure EVUS registration is active for Chinese passport holders.': 'desc.us_visa_held',
    'You must apply for a regular US B1/B2 Visitor Visa at a US Embassy or Consulate prior to your trip.': 'desc.us_visa_req',
    'Canadian passport holders can enter Canada freely without additional border authorizations.': 'desc.ca_citizen',
    'Canadian Permanent Residents can enter freely. Ensure you carry your physical PR Card.': 'desc.ca_pr',
    'US Citizens and Green Card holders do not require a visa or eTA to enter Canada. Carry proof of US status.': 'desc.us_gc_ca',
    'You require a Canadian eTA (Electronic Travel Authorization) if arriving by air. Apply online before your flight.': 'desc.ca_eta_req',
    'Eligible to apply for a Canadian eTA instead of a visitor visa because you hold an active US B1/B2 visa. Applicable for air travel.': 'desc.ca_eta_us_visa',
    'Carry your passport with the valid Canadian tourist visa sticker.': 'desc.ca_visa_held',
    'You must apply for a regular Canadian Temporary Resident Visa (TRV) before traveling to Canada.': 'desc.ca_visa_req',
    'Mexican passport holders can enter Mexico freely.': 'desc.mx_citizen',
    'Your passport qualifies for visa-free tourist entry into Mexico. Fill out the FMM form if required by your airline.': 'desc.mx_visafree',
    'Mexico exempts visa requirements for travelers holding valid, active visas or permanent residencies of the USA, Canada, Schengen Area, UK, or Japan. Carry the supporting document/visa sticker.': 'desc.mx_exempt',
    'You must apply for a Mexican Tourist Visa at a Mexican Consulate prior to travel.': 'desc.mx_visa_req',

    // Warnings
    'Your route requires one or more standard physical tourist visas. Embassy interviews and physical document submissions will be necessary. Book appointments early!': 'warning.physical_visa',
    'You require electronic travel authorizations (ESTA or eTA). Make sure to submit online applications at least 3-7 days before boarding flights.': 'warning.esta_eta',
    'Your itinerary involves multiple international border crossings. Ensure you have MULTIPLE-ENTRY permits to avoid being denied entry upon return.': 'warning.multiple_borders',

    // Checklist items
    'Valid Passport (must have at least 6 months validity left)': 'checklist.passport',
    'ESTA Travel Authorization (Approved)': 'checklist.esta',
    'US B1/B2 Visa Sticker': 'checklist.us_visa_sticker',
    'Canada eTA Authorization (Approved)': 'checklist.ca_eta',
    'Canada Tourist Visa Sticker': 'checklist.ca_visa_sticker',
    'Supporting Valid Visa (US/CA/Schengen/UK/JP)': 'checklist.supporting_visa',
    'US B1/B2 Visa (Exemption proof)': 'checklist.us_visa_exempt',
    'Canada Visa (Exemption proof)': 'checklist.ca_visa_exempt',
    'US Green Card (Exemption proof)': 'checklist.us_gc_exempt',
    'Canada PR Card (Exemption proof)': 'checklist.ca_pr_exempt',
    'Mexico Tourist Visa Sticker': 'checklist.mx_visa_sticker',
    'Proof of Multiple-Entry rights for visas': 'checklist.multiple_entry',
    'World Cup Match Tickets / FIFA Booking Confirmation': 'checklist.tickets',
    'Confirmed Return or Onward Flight Tickets': 'checklist.flights',
    'Proof of Accommodation (Hotel / Airbnb Bookings)': 'checklist.accommodation'
  };

  function translateEngineText(text: string): string {
    if (!text) return '';
    const key = engineKeyMap[text];
    if (!key) return text;
    const translated = t(`engine.${key}`, text);
    if (translated.startsWith('MISSING:')) {
      return text;
    }
    return translated;
  }

  // State Runes (Svelte 5)
  let passportCountry = $state('CHN');
  let heldVisas = $state<string[]>([]);
  let route = $state<string[]>(['SEA', 'YVR']);
  let selectedCityToAdd = $state('');
  let checkedItems = $state<Record<string, boolean>>({});

  // Derived Values
  let visaResult = $derived(
    evaluateVisaRequirements({
      passportCountry,
      heldVisas,
      route
    })
  );

  let checkedCount = $derived(
    visaResult.checklist.filter(item => checkedItems[item]).length
  );

  let totalItems = $derived(visaResult.checklist.length);

  let ui = $derived(uiTranslations[props.locale] || uiTranslations['en']);

  // Helpers
  function addCityToRoute() {
    if (selectedCityToAdd && HOST_CITIES[selectedCityToAdd]) {
      route = [...route, selectedCityToAdd];
      selectedCityToAdd = '';
    }
  }

  function removeCityFromRoute(index: number) {
    route = route.filter((_, idx) => idx !== index);
  }

  function moveCityInRoute(index: number, direction: 'up' | 'down') {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === route.length - 1) return;

    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const newRoute = [...route];
    const temp = newRoute[index];
    newRoute[index] = newRoute[targetIndex];
    newRoute[targetIndex] = temp;
    route = newRoute;
  }

  function clearRoute() {
    route = [];
  }

  function applyShortcut(cities: string[]) {
    route = [...cities];
  }

  function toggleVisa(visaId: string) {
    if (heldVisas.includes(visaId)) {
      heldVisas = heldVisas.filter(id => id !== visaId);
    } else {
      heldVisas = [...heldVisas, visaId];
    }
  }

  function toggleCheckItem(item: string) {
    checkedItems = {
      ...checkedItems,
      [item]: !checkedItems[item]
    };
  }

  // Pre-fill checklists and state sync checks
  $effect(() => {
    // Whenever checklist keys change, trim the unchecked keys to save memory
    const validKeys = new Set(visaResult.checklist);
    const rawChecked = $state.snapshot(checkedItems);
    const updatedChecked: Record<string, boolean> = {};
    let hasChanges = false;
    for (const key of Object.keys(rawChecked)) {
      if (validKeys.has(key)) {
        updatedChecked[key] = rawChecked[key];
      } else {
        hasChanges = true;
      }
    }
    if (hasChanges) {
      checkedItems = updatedChecked;
    }
  });
</script>

<div class="world-cup-visa-assistant-container w-full max-w-5xl mx-auto p-4 md:p-6 bg-transparent text-neutral-800 dark:text-neutral-200 rounded-2xl relative overflow-hidden font-sans">
  <!-- Glowing Ambient Header Line -->
  <div class="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600"></div>

  <!-- Header -->
  <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200 dark:border-neutral-800/60 pb-6 mb-6">
    <div>
      <div class="flex items-center gap-2 mb-1">
        <span class="px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded bg-amber-550/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 font-outfit">
          FIFA World Cup 2026
        </span>
        <span class="px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded bg-slate-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400">
          BORDER RUNES
        </span>
      </div>
      <h1 class="text-2xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 dark:from-amber-200 dark:via-amber-400 dark:to-amber-200 font-outfit uppercase tracking-tight">
        {t('name') || ui.name || 'Border & Visa Assistant'}
      </h1>
      <p class="text-xs text-neutral-500 dark:text-neutral-400 mt-1 max-w-xl">
        {t('description') || ui.description || 'Smart border compliance evaluator for tri-country World Cup journeys.'}
      </p>
    </div>
    <div class="flex items-center gap-3">
      <div class="text-right hidden md:block">
        <div class="text-[10px] text-neutral-450 dark:text-neutral-500 uppercase tracking-widest">Border Engine</div>
        <div class="text-xs text-amber-650 dark:text-amber-400 font-mono font-bold">v1.2.6 (Live Evals)</div>
      </div>
      <div class="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20 text-amber-600 dark:text-amber-400">
        <ShieldAlert size={20} />
      </div>
    </div>
  </div>

  <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
    <!-- Left Column: inputs -->
    <div class="lg:col-span-5 space-y-6">
      
      <!-- Card 1: Fan Profile -->
      <div class="p-5 bg-white/70 dark:bg-neutral-900/40 rounded-xl border border-slate-200 dark:border-neutral-800/80 backdrop-blur-md relative">
        <h3 class="text-sm font-bold text-amber-400 mb-4 flex items-center gap-2 border-b border-slate-200 dark:border-neutral-800/40 pb-2 uppercase tracking-wider font-outfit">
          <Plane size={15} />
          {ui.fanProfileTitle}
        </h3>
        
        <!-- Passport Dropdown -->
        <div class="space-y-2 mb-4">
          <label for="passport-select" class="text-xs text-neutral-500 dark:text-neutral-400 font-semibold block">{ui.selectPassport}</label>
          <div class="relative">
            <select
              id="passport-select"
              class="w-full bg-white dark:bg-[#121212] border border-slate-200 dark:border-neutral-800 text-neutral-800 dark:text-[#e5e5e5] px-3 py-2 rounded-lg text-sm focus:border-amber-400 focus:outline-none transition-all"
              bind:value={passportCountry}
            >
              {#each Object.keys(COUNTRIES) as code}
                <option value={code}>
                  {COUNTRIES[code][props.locale] || COUNTRIES[code]['en']} ({code})
                </option>
              {/each}
            </select>
          </div>
        </div>

        <!-- Held Visas Checkboxes -->
        <div class="space-y-2">
          <span class="text-xs text-neutral-500 dark:text-neutral-400 font-semibold block">{ui.heldVisas}</span>
          <div class="space-y-2 max-h-56 overflow-y-auto pr-1 scrollbar-thin">
            {#each Object.keys(VISA_TYPES) as visaId}
              <button
                type="button"
                onclick={() => toggleVisa(visaId)}
                class="w-full flex items-center gap-3 p-2 rounded-lg text-left text-xs transition-all border {heldVisas.includes(visaId) ? 'bg-amber-500/10 border-amber-500/30 text-amber-300' : 'bg-slate-100/50 dark:bg-[#121212]/30 border-slate-200 dark:border-neutral-800 text-neutral-500 dark:text-neutral-400 hover:border-slate-300 dark:hover:border-neutral-700'}"
              >
                <div class="flex-shrink-0 text-amber-450 dark:text-amber-400">
                  {#if heldVisas.includes(visaId)}
                    <CheckSquare size={14} />
                  {:else}
                    <Square size={14} />
                  {/if}
                </div>
                 <span class="truncate">{VISA_TYPES[visaId][props.locale] || VISA_TYPES[visaId]['en']}</span>
              </button>
            {/each}
          </div>
        </div>
      </div>

      <!-- Card 2: Itinerary Builder -->
      <div class="p-5 bg-white/70 dark:bg-neutral-900/40 rounded-xl border border-slate-200 dark:border-neutral-800/80 backdrop-blur-md">
        <h3 class="text-sm font-bold text-amber-400 mb-4 flex items-center gap-2 border-b border-slate-200 dark:border-neutral-800/40 pb-2 uppercase tracking-wider font-outfit">
          <Luggage size={15} />
          {ui.itineraryTitle}
        </h3>

        <!-- Preset Shortcuts -->
        <div class="mb-4 space-y-1.5">
          <span class="text-[10px] text-neutral-500 uppercase tracking-wider block font-semibold">{ui.shortcutTitle}</span>
          <div class="grid grid-cols-1 gap-1.5">
            <button
              type="button"
              onclick={() => applyShortcut(['YVR', 'SEA', 'MEX'])}
              class="w-full text-left text-[11px] px-2.5 py-1.5 rounded bg-slate-100 hover:bg-slate-200 dark:bg-neutral-800/40 dark:hover:bg-neutral-800 border border-slate-200 dark:border-neutral-800 hover:border-slate-300 dark:hover:border-neutral-700 transition-all text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-[#e5e5e5]"
            >
              {ui.shortcutVanSeaMex}
            </button>
            <button
              type="button"
              onclick={() => applyShortcut(['LAX', 'MTY', 'DFW'])}
              class="w-full text-left text-[11px] px-2.5 py-1.5 rounded bg-slate-100 hover:bg-slate-200 dark:bg-neutral-800/40 dark:hover:bg-neutral-800 border border-slate-200 dark:border-neutral-800 hover:border-slate-300 dark:hover:border-neutral-700 transition-all text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-[#e5e5e5]"
            >
              {ui.shortcutLaMex}
            </button>
          </div>
        </div>

        <!-- Add City Form -->
        <div class="flex gap-2 mb-4">
          <div class="flex-grow">
            <select
              aria-label={ui.selectCityPlaceholder}
              class="w-full bg-white dark:bg-[#121212] border border-slate-200 dark:border-neutral-800 text-neutral-800 dark:text-[#e5e5e5] px-3 py-2 rounded-lg text-sm focus:border-amber-400 focus:outline-none transition-all"
              bind:value={selectedCityToAdd}
            >
              <option value="" disabled selected>{ui.selectCityPlaceholder}</option>
              {#each Object.keys(HOST_CITIES) as cityId}
                <option value={cityId} disabled={route.includes(cityId)}>
                  {HOST_CITIES[cityId].flag} {HOST_CITIES[cityId].name} ({HOST_CITIES[cityId].country})
                </option>
              {/each}
            </select>
          </div>
          <button
            type="button"
            onclick={addCityToRoute}
            disabled={!selectedCityToAdd}
            class="px-3 bg-amber-500 text-[#0d0d0d] font-bold rounded-lg hover:bg-amber-400 transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus size={16} />
          </button>
        </div>

        <!-- Route Nodes List -->
        <div class="space-y-2 max-h-64 overflow-y-auto pr-1 scrollbar-thin">
          {#if route.length === 0}
            <div class="p-6 text-center border border-dashed border-slate-200 dark:border-neutral-800 rounded-lg text-xs text-neutral-500">
              {ui.noCities}
            </div>
          {:else}
            {#each route as cityId, idx}
              <div class="flex items-center justify-between p-2.5 bg-slate-55 dark:bg-[#121212]/60 rounded-lg border border-slate-200 dark:border-neutral-800 text-xs">
                <div class="flex items-center gap-2 min-w-0">
                  <span class="w-5 h-5 rounded-full bg-slate-100 dark:bg-neutral-800 border border-slate-200 dark:border-neutral-700 flex items-center justify-center font-bold text-[10px] text-neutral-500 dark:text-neutral-400">
                    {idx + 1}
                  </span>
                  <span class="text-base flex-shrink-0">{HOST_CITIES[cityId].flag}</span>
                  <div class="truncate">
                    <span class="font-bold text-neutral-850 dark:text-[#e5e5e5] font-mono">{cityId}</span>
                    <span class="text-neutral-500 dark:text-neutral-400 ml-1 text-[11px]">{HOST_CITIES[cityId].name}</span>
                  </div>
                </div>
                
                <div class="flex items-center gap-1 flex-shrink-0">
                  <button
                    type="button"
                    onclick={() => moveCityInRoute(idx, 'up')}
                    disabled={idx === 0}
                    class="p-1 hover:bg-slate-100 dark:hover:bg-neutral-800 rounded text-neutral-400 hover:text-[#e5e5e5] disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <ArrowUp size={12} />
                  </button>
                  <button
                    type="button"
                    onclick={() => moveCityInRoute(idx, 'down')}
                    disabled={idx === route.length - 1}
                    class="p-1 hover:bg-slate-100 dark:hover:bg-neutral-800 rounded text-neutral-400 hover:text-[#e5e5e5] disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <ArrowDown size={12} />
                  </button>
                  <button
                    type="button"
                    onclick={() => removeCityFromRoute(idx)}
                    class="p-1 hover:bg-red-500/20 rounded text-neutral-400 hover:text-red-400"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            {/each}
          {/if}
        </div>

        {#if route.length > 0}
          <div class="mt-4 flex justify-end">
            <button
              type="button"
              onclick={clearRoute}
              class="px-2.5 py-1 text-[11px] rounded bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 hover:border-red-500/30 text-red-400 font-semibold transition-all"
            >
              {ui.clearItinerary}
            </button>
          </div>
        {/if}
      </div>

    </div>

    <!-- Right Column: Outputs -->
    <div class="lg:col-span-7 space-y-6">
      
      <!-- Overall Warnings Panel -->
      {#if visaResult.overallWarnings.length > 0}
        <div class="p-5 bg-amber-500/5 border border-amber-500/20 rounded-xl relative overflow-hidden">
          <div class="absolute top-0 right-0 p-3 text-amber-500/10">
            <AlertTriangle size={80} />
          </div>
          <h4 class="text-xs uppercase tracking-wider font-extrabold text-amber-500 dark:text-amber-400 mb-3 flex items-center gap-1.5 font-outfit">
            <AlertTriangle size={14} />
            {ui.overallWarnings}
          </h4>
          <ul class="space-y-2">
            {#each visaResult.overallWarnings as warning}
              <li class="text-xs text-amber-700 dark:text-amber-200/90 pl-4 relative before:content-[''] before:absolute before:left-0 before:top-1.5 before:w-1.5 before:h-1.5 before:bg-amber-500 dark:before:bg-amber-400 before:rounded-full leading-relaxed">
                {translateEngineText(warning)}
              </li>
            {/each}
          </ul>
        </div>
      {/if}

      <!-- Card 3: Transit Evaluation Reports -->
      <div class="p-5 bg-white/70 dark:bg-neutral-900/40 rounded-xl border border-slate-200 dark:border-neutral-800/80 backdrop-blur-md">
        <h3 class="text-sm font-bold text-amber-400 mb-4 flex items-center gap-2 border-b border-slate-200 dark:border-neutral-800/40 pb-2 uppercase tracking-wider font-outfit">
          <FileText size={15} />
          {ui.transitReportsTitle}
        </h3>

        {#if visaResult.legs.length === 0}
          <div class="p-8 text-center text-xs text-neutral-500 leading-relaxed border border-dashed border-slate-200 dark:border-neutral-800 rounded-lg">
            {ui.noTransitLegs}
          </div>
        {:else}
          <div class="space-y-4">
            {#each visaResult.legs as leg, idx}
              <div class="p-4 bg-slate-50/50 dark:bg-[#121212]/50 border rounded-xl flex flex-col gap-2 relative transition-all hover:bg-slate-100/50 dark:hover:bg-[#121212]/80 {leg.status === 'required' ? 'border-red-500/20 hover:border-red-500/40' : leg.status === 'warning' ? 'border-amber-500/20 hover:border-amber-500/40' : 'border-emerald-500/10 hover:border-emerald-500/30'}">
                
                <!-- Status Badge -->
                <div class="absolute top-4 right-4 flex items-center gap-1.5">
                  <span class="px-2 py-0.5 text-[9px] uppercase font-bold tracking-wider rounded font-mono border {leg.status === 'required' ? 'bg-red-500/10 text-red-500 dark:text-red-400 border-red-500/20' : leg.status === 'warning' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20' : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'}">
                    {#if leg.status === 'required'}
                      {ui.legStatusRequired}
                    {:else}
                      {leg.status === 'warning' ? ui.legStatusWarning : ui.legStatusOk}
                    {/if}
                  </span>
                </div>

                <!-- Leg Routing Info -->
                <div class="flex items-center gap-2 text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                  <span class="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-neutral-800 font-mono tracking-wider font-bold text-[10px] text-neutral-500 dark:text-neutral-400">LEG {idx + 1}</span>
                  <div class="flex items-center gap-1.5 min-w-0">
                    <span class="truncate font-mono">{leg.from === 'ORIGIN' ? 'Home' : leg.from}</span>
                    <ChevronRight size={12} class="text-neutral-400 dark:text-neutral-600 flex-shrink-0" />
                    <span class="truncate font-mono text-neutral-850 dark:text-[#e5e5e5]">{leg.to}</span>
                  </div>
                </div>

                <!-- Requirement Title -->
                <div class="text-xs font-bold font-outfit mt-1 flex items-center gap-1 {leg.status === 'required' ? 'text-red-650 dark:text-red-400' : leg.status === 'warning' ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'}">
                  {#if leg.status === 'required'}
                    🔴
                  {:else}
                    {leg.status === 'warning' ? '🟡' : '🟢'}
                  {/if}
                  {translateEngineText(leg.visaRequired)}
                </div>

                <!-- Detailed Explanation -->
                <p class="text-[11px] text-neutral-500 dark:text-neutral-400 leading-relaxed max-w-[90%] mt-0.5">
                  {translateEngineText(leg.description)}
                </p>
              </div>
            {/each}
          </div>
        {/if}
      </div>

      <!-- Card 4: Packing Customs Checklist -->
      <div class="p-5 bg-white/70 dark:bg-neutral-900/40 rounded-xl border border-slate-200 dark:border-neutral-800/80 backdrop-blur-md">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 border-b border-slate-200 dark:border-neutral-800/40 pb-2">
          <h3 class="text-sm font-bold text-amber-400 flex items-center gap-2 uppercase tracking-wider font-outfit">
            <CheckSquare size={15} />
            {ui.checklistTitle}
          </h3>
          <span class="text-[11px] text-neutral-500 dark:text-neutral-400 font-bold font-mono">
            {ui.checklistProgress}: {checkedCount} / {totalItems}
          </span>
        </div>

        <!-- Progress Bar -->
        <div class="w-full bg-slate-100 dark:bg-neutral-800/50 rounded-full h-1.5 mb-4 overflow-hidden border border-slate-200 dark:border-neutral-800">
          <div
            class="bg-gradient-to-r from-amber-500 to-yellow-400 h-1.5 rounded-full transition-all duration-300"
            style="width: {totalItems > 0 ? (checkedCount / totalItems) * 100 : 0}%"
          ></div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {#each visaResult.checklist as item}
            <button
              type="button"
              onclick={() => toggleCheckItem(item)}
              class="flex items-start gap-3 p-3 rounded-xl border text-left text-xs transition-all hover:bg-slate-100 dark:hover:bg-neutral-800/30 {checkedItems[item] ? 'bg-amber-50/50 dark:bg-amber-500/5 border-amber-500/25 text-amber-800 dark:text-amber-200/90' : 'bg-slate-100/50 dark:bg-[#121212]/30 border-slate-200 dark:border-neutral-800 text-neutral-500 dark:text-neutral-400'}"
            >
              <div class="flex-shrink-0 mt-0.5 text-amber-550 dark:text-amber-400">
                {#if checkedItems[item]}
                  <CheckSquare size={15} />
                {:else}
                  <Square size={15} />
                {/if}
              </div>
              <div class="flex flex-col min-w-0">
                <span class="leading-snug break-words">{translateEngineText(item)}</span>
                {#if checkedItems[item]}
                  <span class="text-[9px] text-amber-600 dark:text-amber-500 font-semibold uppercase tracking-wider font-mono mt-0.5">✓ {ui.preparedText}</span>
                {/if}
              </div>
            </button>
          {/each}
        </div>
      </div>

    </div>
  </div>

  <!-- Disclaimer Footer -->
  <div class="mt-6 border-t border-slate-200 dark:border-neutral-800/60 pt-4 flex flex-col md:flex-row justify-between items-center gap-3 text-neutral-500 text-[10px]">
    <div class="flex items-center gap-1.5">
      <span class="text-amber-600 dark:text-amber-500 font-bold uppercase tracking-wider">Disclaimer</span>
      <span>|</span>
      <span class="text-neutral-600 dark:text-neutral-400 max-w-lg leading-snug">
        This toolkit evaluates mock and consolidated immigration policies of 2026 hosts. Official policies may change dynamically. Confirm visa statuses directly via official consulate interfaces.
      </span>
    </div>
    <div class="flex items-center gap-1 font-mono text-neutral-600">
      <span>SECURE OFFLINE RUNTIME</span>
    </div>
  </div>
</div>

<style>
  /* Premium Dark-Gold Obsidian Styling rules isolation */
  .world-cup-visa-assistant-container :global(button),
  .world-cup-visa-assistant-container :global(select),
  .world-cup-visa-assistant-container :global(input),
  .world-cup-visa-assistant-container :global(option) {
    font-family: inherit;
  }

  .world-cup-visa-assistant-container :global(button) {
    box-shadow: none !important;
  }

  /* ================= 浅色模式 (Light Theme) ================= */
  .world-cup-visa-assistant-container :global(select) {
    background-color: #ffffff !important;
    color: #1e293b !important;
    border-color: #e2e8f0 !important;
  }

  .world-cup-visa-assistant-container :global(select:focus) {
    border-color: #d97706 !important;
    outline: none !important;
    box-shadow: 0 0 0 1px rgba(217, 119, 6, 0.4) !important;
  }

  .world-cup-visa-assistant-container :global(option) {
    background-color: #ffffff !important;
    color: #1e293b !important;
  }

  /* ================= 深色模式 (Dark Theme - 曜石暗金) ================= */
  :global(.dark) .world-cup-visa-assistant-container :global(select) {
    background-color: #0d0d0d !important;
    color: #e5e5e5 !important;
    border-color: #262626 !important;
  }

  :global(.dark) .world-cup-visa-assistant-container :global(select:focus) {
    border-color: #e5c158 !important;
    outline: none !important;
    box-shadow: 0 0 0 1px rgba(229, 193, 88, 0.4) !important;
  }

  :global(.dark) .world-cup-visa-assistant-container :global(option) {
    background-color: #0d0d0d !important;
    color: #e5e5e5 !important;
  }

  /* Custom scrollbar layout styling */
  .scrollbar-thin::-webkit-scrollbar {
    width: 4px;
    height: 4px;
  }
  .scrollbar-thin::-webkit-scrollbar-track {
    background: transparent;
  }
  .scrollbar-thin::-webkit-scrollbar-thumb {
    background: #e2e8f0;
    border-radius: 2px;
  }
  :global(.dark) .scrollbar-thin::-webkit-scrollbar-thumb {
    background: #262626;
  }
  .scrollbar-thin::-webkit-scrollbar-thumb:hover {
    background: #d97706;
  }
  :global(.dark) .scrollbar-thin::-webkit-scrollbar-thumb:hover {
    background: #e5c158;
  }
</style>
