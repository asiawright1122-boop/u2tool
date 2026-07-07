<script lang="ts">
  interface Props {
    locale?: string;
    translations?: Record<string, unknown>;
  }

  let { locale = 'en', translations = {} }: Props = $props();

  const I18N_BACKUP: Record<string, Record<string, string>> = {
    zh: {
      title: 'Midjourney Prompt 生成器',
      subtitle: '构建完整的 Midjourney 提示词，含风格、构图、光线、参数等所有要素',
      subject: '主题描述',
      subjectPlaceholder: '例如：一位坐在雨中咖啡馆窗边的年轻女性',
      style: '艺术风格',
      photo: '摄影写实',
      illustration: '插画',
      threeD: '3D 渲染',
      watercolor: '水彩画',
      cyberpunk: '赛博朋克',
      anime: '动漫风',
      oil: '油画',
      sketch: '素描',
      composition: '构图',
      portrait: '人像特写',
      wide: '宽景/环境',
      aerial: '鸟瞰视角',
      macro: '微距近摄',
      dynamic: '动感视角',
      lighting: '光线',
      golden: '黄金时刻',
      studio: '摄影棚灯光',
      neon: '霓虹氛围',
      moody: '暗调戏剧',
      natural: '自然光',
      atmosphere: '氛围',
      dreamy: '梦幻浪漫',
      epic: '史诗宏大',
      peaceful: '宁静祥和',
      mysterious: '神秘诡异',
      version: 'Midjourney 版本',
      aspectRatio: '宽高比',
      quality: '质量',
      stylize: '风格化强度',
      presets: '快速预设',
      presetCinema: '电影感人像',
      presetDream: '梦幻风景',
      presetConcept: '概念艺术',
      presetNeon: '霓虹城市',
      presetNature: '自然写真',
      generate: '生成 Prompt',
      copy: '复制 Prompt',
      copied: '✓ 已复制',
      disclaimer: '生成的 Prompt 为模板格式，建议根据实际创作需求调整关键词和参数。',
      placeholderText: '填写主题和参数后点击生成，输出可直接用于 Midjourney 的完整提示词。',
    },
    en: {
      title: 'Midjourney Prompt Generator',
      subtitle: 'Build complete Midjourney prompts with style, composition, lighting, and all parameters',
      subject: 'Subject Description',
      subjectPlaceholder: 'e.g. A young woman sitting by a cafe window in the rain',
      style: 'Art Style',
      photo: 'Photorealistic',
      illustration: 'Illustration',
      threeD: '3D Render',
      watercolor: 'Watercolor',
      cyberpunk: 'Cyberpunk',
      anime: 'Anime',
      oil: 'Oil Painting',
      sketch: 'Sketch',
      composition: 'Composition',
      portrait: 'Close-up Portrait',
      wide: 'Wide / Environmental',
      aerial: 'Aerial / Bird\'s Eye',
      macro: 'Macro Close-up',
      dynamic: 'Dynamic Angle',
      lighting: 'Lighting',
      golden: 'Golden Hour',
      studio: 'Studio Lighting',
      neon: 'Neon Glow',
      moody: 'Moody / Dramatic',
      natural: 'Natural Light',
      atmosphere: 'Atmosphere',
      dreamy: 'Dreamy / Romantic',
      epic: 'Epic / Cinematic',
      peaceful: 'Peaceful / Serene',
      mysterious: 'Mysterious / Eerie',
      version: 'Midjourney Version',
      aspectRatio: 'Aspect Ratio',
      quality: 'Quality',
      stylize: 'Stylize',
      presets: 'Quick Presets',
      presetCinema: 'Cinematic Portrait',
      presetDream: 'Dream Landscape',
      presetConcept: 'Concept Art',
      presetNeon: 'Neon City',
      presetNature: 'Nature Photo',
      generate: 'Generate Prompt',
      copy: 'Copy Prompt',
      copied: '✓ Copied',
      disclaimer: 'Generated prompts are template-based. Adjust keywords and parameters for best results.',
      placeholderText: 'Fill in the subject and parameters, then click Generate to get a complete Midjourney prompt.',
    },
    es: {
      title: 'Generador de Prompts para Midjourney',
      subtitle: 'Construye prompts completos con estilo, composición, iluminación y todos los parámetros',
      subject: 'Descripción del Tema',
      subjectPlaceholder: 'ej. Una joven sentada junto a la ventana de un café bajo la lluvia',
      style: 'Estilo Artístico',
      photo: 'Fotorrealista',
      illustration: 'Ilustración',
      threeD: 'Renderizado 3D',
      watercolor: 'Acuarela',
      cyberpunk: 'Cyberpunk',
      anime: 'Anime',
      oil: 'Pintura al Óleo',
      sketch: 'Boceto',
      composition: 'Composición',
      portrait: 'Retrato Close-up',
      wide: 'Paisaje Amplio',
      aerial: 'Vista Aérea',
      macro: 'Macro',
      dynamic: 'Ángulo Dinámico',
      lighting: 'Iluminación',
      golden: 'Hora Dorada',
      studio: 'Iluminación de Estudio',
      neon: 'Brillo de Neón',
      moody: 'Dramático / Oscuro',
      natural: 'Luz Natural',
      atmosphere: 'Atmósfera',
      dreamy: 'Soñador / Romántico',
      epic: 'Épico / Cinemático',
      peaceful: 'Tranquilo / Sereno',
      mysterious: 'Misterioso / Inquietante',
      version: 'Versión de Midjourney',
      aspectRatio: 'Relación de Aspecto',
      quality: 'Calidad',
      stylize: 'Estilizar',
      presets: 'Presets Rápidos',
      presetCinema: 'Retrato Cinemático',
      presetDream: 'Paisaje Onírico',
      presetConcept: 'Arte Conceptual',
      presetNeon: 'Ciudad Neón',
      presetNature: 'Foto de Naturaleza',
      generate: 'Generar Prompt',
      copy: 'Copiar Prompt',
      copied: '✓ Copiado',
      disclaimer: 'Los prompts generados son basados en plantillas. Ajusta palabras clave y parámetros.',
      placeholderText: 'Completa el tema y parámetros, luego haz clic en Generar.',
    },
    pt: {
      title: 'Gerador de Prompts para Midjourney',
      subtitle: 'Construa prompts completos com estilo, composição, iluminação e todos os parâmetros',
      subject: 'Descrição do Tema',
      subjectPlaceholder: 'ex. Uma jovem sentada à janela de um café na chuva',
      style: 'Estilo Artístico',
      photo: 'Fotorrealista',
      illustration: 'Ilustração',
      threeD: 'Renderização 3D',
      watercolor: 'Aquarela',
      cyberpunk: 'Cyberpunk',
      anime: 'Anime',
      oil: 'Pintura a Óleo',
      sketch: 'Esboço',
      composition: 'Composição',
      portrait: 'Retrato Close-up',
      wide: 'Paisagem Ampla',
      aerial: 'Vista Aérea',
      macro: 'Macro',
      dynamic: 'Ângulo Dinâmico',
      lighting: 'Iluminação',
      golden: 'Hora Dourada',
      studio: 'Iluminação de Estúdio',
      neon: 'Brilho Neon',
      moody: 'Dramático / Sombrio',
      natural: 'Luz Natural',
      atmosphere: 'Atmosfera',
      dreamy: 'Sonhador / Romântico',
      epic: 'Épico / Cinematográfico',
      peaceful: 'Tranquilo / Sereno',
      mysterious: 'Misterioso / Sombrio',
      version: 'Versão do Midjourney',
      aspectRatio: 'Proporção',
      quality: 'Qualidade',
      stylize: 'Estilizar',
      presets: 'Presets Rápidos',
      presetCinema: 'Retrato Cinematográfico',
      presetDream: 'Paisagem dos Sonhos',
      presetConcept: 'Arte Conceitual',
      presetNeon: 'Cidade Neon',
      presetNature: 'Foto de Natureza',
      generate: 'Gerar Prompt',
      copy: 'Copiar Prompt',
      copied: '✓ Copiado',
      disclaimer: 'Os prompts gerados são baseados em modelos. Ajuste palavras-chave e parâmetros.',
      placeholderText: 'Preencha o tema e parâmetros, depois clique em Gerar.',
    },
    ja: {
      title: 'Midjourney プロンプトジェネレーター',
      subtitle: 'スタイル・構図・ライティング・パラメータを含む完全な Midjourney プロンプトを生成',
      subject: '被写体の説明',
      subjectPlaceholder: '例：雨の日のカフェの窓際に座る若い女性',
      style: 'アートスタイル',
      photo: 'フォトリアル',
      illustration: 'イラスト',
      threeD: '3Dレンダリング',
      watercolor: '水彩画',
      cyberpunk: 'サイバーパンク',
      anime: 'アニメ',
      oil: '油彩画',
      sketch: 'スケッチ',
      composition: '構図',
      portrait: 'クローズアップポートレート',
      wide: 'ワイド/環境',
      aerial: '航空撮影/俯瞰',
      macro: 'マクロクローズアップ',
      dynamic: 'ダイナミックアングル',
      lighting: 'ライティング',
      golden: 'ゴールデンアワー',
      studio: 'スタジオ照明',
      neon: 'ネオングロー',
      moody: 'ドラマティック/陰影',
      natural: '自然光',
      atmosphere: '雰囲気',
      dreamy: 'ドリーミー/ロマンチック',
      epic: 'エピック/シネマティック',
      peaceful: '穏やか/静寂',
      mysterious: '神秘的/不気味',
      version: 'Midjourney バージョン',
      aspectRatio: 'アスペクト比',
      quality: '品質',
      stylize: 'スタイライズ',
      presets: 'クイックプリセット',
      presetCinema: 'シネマティックポートレート',
      presetDream: '幻想的な風景',
      presetConcept: 'コンセプトアート',
      presetNeon: 'ネオン都市',
      presetNature: '自然写真',
      generate: 'プロンプトを生成',
      copy: 'プロンプトをコピー',
      copied: '✓ コピー済み',
      disclaimer: '生成されたプロンプトはテンプレートベースです。キーワードとパラメータをご調整ください。',
      placeholderText: '被写体とパラメータを入力して「プロンプトを生成」をクリックしてください。',
    },
    fr: {
      title: 'Générateur de Prompts Midjourney',
      subtitle: 'Créez des prompts complets avec style, composition, éclairage et tous les paramètres',
      subject: 'Description du Sujet',
      subjectPlaceholder: 'ex. Une jeune femme assise près de la fenêtre d\'un café sous la pluie',
      style: 'Style Artistique',
      photo: 'Photoréaliste',
      illustration: 'Illustration',
      threeD: 'Rendu 3D',
      watercolor: 'Aquarelle',
      cyberpunk: 'Cyberpunk',
      anime: 'Anime',
      oil: 'Peinture à l\'huile',
      sketch: 'Esquisse',
      composition: 'Composition',
      portrait: 'Portrait en gros plan',
      wide: 'Grand angle / Environnement',
      aerial: 'Vue aérienne',
      macro: 'Macro gros plan',
      dynamic: 'Angle dynamique',
      lighting: 'Éclairage',
      golden: 'Heure dorée',
      studio: 'Éclairage studio',
      neon: 'Lueur néon',
      moody: 'Sombre / Dramatique',
      natural: 'Lumière naturelle',
      atmosphere: 'Atmosphère',
      dreamy: 'Onirique / Romantique',
      epic: 'Épique / Cinématique',
      peaceful: 'Paisible / Serein',
      mysterious: 'Mystérieux / Inquiétant',
      version: 'Version Midjourney',
      aspectRatio: 'Format d\'image',
      quality: 'Qualité',
      stylize: 'Styliser',
      presets: 'Préréglages Rapides',
      presetCinema: 'Portrait Cinématique',
      presetDream: 'Paysage Onirique',
      presetConcept: 'Art Conceptuel',
      presetNeon: 'Ville Néon',
      presetNature: 'Photo Nature',
      generate: 'Générer le Prompt',
      copy: 'Copier le Prompt',
      copied: '✓ Copié',
      disclaimer: 'Les prompts générés sont basés sur des modèles. Adaptez les mots-clés et paramètres.',
      placeholderText: 'Remplissez le sujet et les paramètres, puis cliquez sur Générer.',
    },
    de: {
      title: 'Midjourney-Prompt-Generator',
      subtitle: 'Erstellen Sie vollständige Midjourney-Prompts mit Stil, Komposition, Beleuchtung und allen Parametern',
      subject: 'Motivbeschreibung',
      subjectPlaceholder: 'z.B. Eine junge Frau sitzt im Regen an einem Café-Fenster',
      style: 'Kunststil',
      photo: 'Fotorealistisch',
      illustration: 'Illustration',
      threeD: '3D-Render',
      watercolor: 'Aquarell',
      cyberpunk: 'Cyberpunk',
      anime: 'Anime',
      oil: 'Ölgemälde',
      sketch: 'Skizze',
      composition: 'Komposition',
      portrait: 'Nahaufnahme-Porträt',
      wide: 'Weitwinkel / Umgebung',
      aerial: 'Vogelperspektive',
      macro: 'Makro-Nahaufnahme',
      dynamic: 'Dynamischer Winkel',
      lighting: 'Beleuchtung',
      golden: 'Goldene Stunde',
      studio: 'Studiolicht',
      neon: 'Neon-Glühen',
      moody: 'Dramatisch / Düster',
      natural: 'Natürliches Licht',
      atmosphere: 'Atmosphäre',
      dreamy: 'Verträumt / Romantisch',
      epic: 'Episch / Filmisch',
      peaceful: 'Friedlich / Ruhig',
      mysterious: 'Geheimnisvoll / Unheimlich',
      version: 'Midjourney-Version',
      aspectRatio: 'Seitenverhältnis',
      quality: 'Qualität',
      stylize: 'Stilisieren',
      presets: 'Schnellvorlagen',
      presetCinema: 'Filmisches Porträt',
      presetDream: 'Traumlandschaft',
      presetConcept: 'Konzeptkunst',
      presetNeon: 'Neon-Stadt',
      presetNature: 'Naturfoto',
      generate: 'Prompt Generieren',
      copy: 'Prompt Kopieren',
      copied: '✓ Kopiert',
      disclaimer: 'Generierte Prompts basieren auf Vorlagen. Passen Sie Schlüsselwörter und Parameter an.',
      placeholderText: 'Füllen Sie Motiv und Parameter aus und klicken Sie auf Generieren.',
    },
    ar: {
      title: 'مولّد Prompts لـ Midjourney',
      subtitle: 'أنشئ Prompts كاملة تتضمن الأسلوب والتكوين والإضاءة وجميع المعاملات',
      subject: 'وصف الموضوع',
      subjectPlaceholder: 'مثال: شابة جالسة بجانب نافذة مقهى في يوم ممطر',
      style: 'الأسلوب الفني',
      photo: 'فوتوريالستي',
      illustration: 'رسوم توضيحية',
      threeD: 'ثلاثي الأبعاد',
      watercolor: 'ألوان مائية',
      cyberpunk: 'سايبربانك',
      anime: 'أنمي',
      oil: 'زيتي',
      sketch: 'رسم تخطيطي',
      composition: 'التكوين',
      portrait: 'بورتريه مقرّب',
      wide: 'زاوية واسعة/بيئية',
      aerial: 'منظر جوي',
      macro: 'ماكرو مقرّب',
      dynamic: 'زاوية ديناميكية',
      lighting: 'الإضاءة',
      golden: 'الساعة الذهبية',
      studio: 'إضاءة استوديو',
      neon: 'توهج نيون',
      moody: 'درامي / داكن',
      natural: 'ضوء طبيعي',
      atmosphere: 'الأجواء',
      dreamy: 'حالم / رومانسي',
      epic: 'ملحمي / سينمائي',
      peaceful: 'هادئ / مسالم',
      mysterious: 'غامض / مرعب',
      version: 'إصدار Midjourney',
      aspectRatio: 'نسبة الأبعاد',
      quality: 'الجودة',
      stylize: 'التنسيق',
      presets: 'إعدادات سريعة',
      presetCinema: 'بورتريه سينمائي',
      presetDream: 'مشهد طبيعي حالم',
      presetConcept: 'فن مفاهيمي',
      presetNeon: 'مدينة النيون',
      presetNature: 'تصوير طبيعي',
      generate: 'توليد Prompt',
      copy: 'نسخ Prompt',
      copied: '✓ تم النسخ',
      disclaimer: 'الـ Prompts المولّدة مستندة إلى قوالب. عدّل الكلمات المفتاحية والمعاملات للحصول على أفضل نتيجة.',
      placeholderText: 'أدخل الموضوع والمعاملات ثم اضغط على توليد.',
    },
    ko: {
      title: 'Midjourney 프롬프트 생성기',
      subtitle: '스타일, 구도, 조명, 파라미터를 포함한 완전한 Midjourney 프롬프트 생성',
      subject: '주제 설명',
      subjectPlaceholder: '예: 비 오는 날 카페 창가에 앉은 젊은 여성',
      style: '아트 스타일',
      photo: '포토리얼리스틱',
      illustration: '일러스트레이션',
      threeD: '3D 렌더링',
      watercolor: '수채화',
      cyberpunk: '사이버펑크',
      anime: '애니메이션',
      oil: '유화',
      sketch: '스케치',
      composition: '구도',
      portrait: '클로즈업 인물',
      wide: '와이드/환경',
      aerial: '항공/조감도',
      macro: '접사/매크로',
      dynamic: '다이나믹 앵글',
      lighting: '조명',
      golden: '골든 아워',
      studio: '스튜디오 조명',
      neon: '네온 글로우',
      moody: '무디/드라마틱',
      natural: '자연광',
      atmosphere: '분위기',
      dreamy: '몽환적/로맨틱',
      epic: '서사적/시네마틱',
      peaceful: '평화롭고 고요한',
      mysterious: '신비롭고 으스스한',
      version: 'Midjourney 버전',
      aspectRatio: '화면 비율',
      quality: '품질',
      stylize: '스타일화',
      presets: '빠른 프리셋',
      presetCinema: '시네마틱 인물',
      presetDream: '꿈결 풍경',
      presetConcept: '콘셉트 아트',
      presetNeon: '네온 도시',
      presetNature: '자연 사진',
      generate: '프롬프트 생성',
      copy: '프롬프트 복사',
      copied: '✓ 복사됨',
      disclaimer: '생성된 프롬프트는 템플릿 기반입니다. 키워드와 파라미터를 조정하세요.',
      placeholderText: '주제와 파라미터를 입력한 후 생성 버튼을 클릭하세요.',
    },
    ru: {
      title: 'Генератор Промптов для Midjourney',
      subtitle: 'Создавайте полные промпты со стилем, композицией, освещением и всеми параметрами',
      subject: 'Описание Темы',
      subjectPlaceholder: 'напр. Молодая женщина сидит у окна кафе в дождливый день',
      style: 'Художественный Стиль',
      photo: 'Фотореалистичный',
      illustration: 'Иллюстрация',
      threeD: '3D Рендер',
      watercolor: 'Акварель',
      cyberpunk: 'Киберпанк',
      anime: 'Аниме',
      oil: 'Масляная Живопись',
      sketch: 'Эскиз',
      composition: 'Композиция',
      portrait: 'Портрет крупным планом',
      wide: 'Широкий / Среда',
      aerial: 'Воздушная / Птичий полёт',
      macro: 'Макро крупный план',
      dynamic: 'Динамичный ракурс',
      lighting: 'Освещение',
      golden: 'Золотой Час',
      studio: 'Студийное Освещение',
      neon: 'Неоновое Свечение',
      moody: 'Мрачный / Драматичный',
      natural: 'Естественный Свет',
      atmosphere: 'Атмосфера',
      dreamy: 'Мечтательный / Романтичный',
      epic: 'Эпический / Кинематографический',
      peaceful: 'Спокойный / Умиротворённый',
      mysterious: 'Таинственный / Жуткий',
      version: 'Версия Midjourney',
      aspectRatio: 'Соотношение Сторон',
      quality: 'Качество',
      stylize: 'Стилизация',
      presets: 'Быстрые Пресеты',
      presetCinema: 'Кинематографический Портрет',
      presetDream: 'Волшебный Пейзаж',
      presetConcept: 'Концепт-арт',
      presetNeon: 'Неоновый Город',
      presetNature: 'Фото Природы',
      generate: 'Сгенерировать Промпт',
      copy: 'Копировать Промпт',
      copied: '✓ Скопировано',
      disclaimer: 'Сгенерированные промпты основаны на шаблонах. Настройте ключевые слова и параметры.',
      placeholderText: 'Заполните тему и параметры, затем нажмите «Сгенерировать».',
    },
  };

  const l = $derived(I18N_BACKUP[locale] || I18N_BACKUP['en']);

  let subject = $state('');
  let style = $state('photo');
  let composition = $state('portrait');
  let lighting = $state('golden');
  let atmosphere = $state('dreamy');
  let version = $state('6.1');
  let aspectRatio = $state('1:1');
  let quality = $state('1');
  let stylize = $state('100');

  let generatedPrompt = $state('');
  let copied = $state(false);

  const STYLE_KEYWORDS: Record<string, string> = {
    photo: 'photorealistic, ultra-detailed photograph, DSLR, 8K resolution',
    illustration: 'digital illustration, vibrant colors, detailed artwork, concept art style',
    threeD: '3D render, octane render, unreal engine 5, hyperrealistic materials, volumetric lighting',
    watercolor: 'watercolor painting, soft washes, delicate brushstrokes, artistic watercolor',
    cyberpunk: 'cyberpunk aesthetic, neon lights, futuristic dystopia, blade runner style',
    anime: 'anime art style, studio ghibli inspired, detailed anime illustration',
    oil: 'oil painting, classical technique, rich textures, impasto, museum quality',
    sketch: 'pencil sketch, detailed linework, hatching, artistic drawing',
  };

  const COMPOSITION_KEYWORDS: Record<string, string> = {
    portrait: 'close-up portrait, face focus, shallow depth of field, bokeh background',
    wide: 'wide establishing shot, environmental storytelling, full scene',
    aerial: 'aerial view, bird\'s eye perspective, top-down composition',
    macro: 'macro photography, extreme close-up, intricate details visible',
    dynamic: 'dynamic camera angle, dutch angle, dramatic perspective',
  };

  const LIGHTING_KEYWORDS: Record<string, string> = {
    golden: 'golden hour lighting, warm sunlight, long shadows, magic hour',
    studio: 'professional studio lighting, three-point lighting, rim light, catchlight',
    neon: 'neon lighting, colorful glow, cyberpunk lights, vibrant color cast',
    moody: 'moody dramatic lighting, chiaroscuro, deep shadows, high contrast',
    natural: 'natural daylight, soft diffused light, overcast lighting, realistic illumination',
  };

  const ATMOSPHERE_KEYWORDS: Record<string, string> = {
    dreamy: 'dreamy romantic atmosphere, soft hazy glow, ethereal mood',
    epic: 'epic cinematic atmosphere, grand scale, breathtaking, awe-inspiring',
    peaceful: 'peaceful serene atmosphere, tranquil, calm, zen-like',
    mysterious: 'mysterious eerie atmosphere, dark ambient, unsettling, enigmatic',
  };

  interface Preset {
    subject: string;
    style: string;
    composition: string;
    lighting: string;
    atmosphere: string;
    ar: string;
    s: string;
  }

  const PRESETS: Record<string, Preset> = {
    presetCinema: {
      subject: 'A powerful cinematic portrait of a weathered explorer',
      style: 'photo',
      composition: 'portrait',
      lighting: 'moody',
      atmosphere: 'epic',
      ar: '2:3',
      s: '200',
    },
    presetDream: {
      subject: 'A magical enchanted forest with glowing fireflies',
      style: 'watercolor',
      composition: 'wide',
      lighting: 'golden',
      atmosphere: 'dreamy',
      ar: '16:9',
      s: '300',
    },
    presetConcept: {
      subject: 'A futuristic space station orbiting a gas giant',
      style: 'threeD',
      composition: 'wide',
      lighting: 'natural',
      atmosphere: 'epic',
      ar: '16:9',
      s: '250',
    },
    presetNeon: {
      subject: 'A rain-soaked alley in a futuristic city at night',
      style: 'cyberpunk',
      composition: 'dynamic',
      lighting: 'neon',
      atmosphere: 'mysterious',
      ar: '9:16',
      s: '400',
    },
    presetNature: {
      subject: 'Pristine mountain lake at sunrise with reflection',
      style: 'photo',
      composition: 'wide',
      lighting: 'golden',
      atmosphere: 'peaceful',
      ar: '16:9',
      s: '100',
    },
  };

  function applyPreset(presetKey: string) {
    const p = PRESETS[presetKey];
    if (!p) return;
    subject = p.subject;
    style = p.style;
    composition = p.composition;
    lighting = p.lighting;
    atmosphere = p.atmosphere;
    aspectRatio = p.ar;
    stylize = p.s;
    generate();
  }

  function generate() {
    if (!subject.trim()) return;
    const parts = [
      subject.trim(),
      STYLE_KEYWORDS[style] || '',
      COMPOSITION_KEYWORDS[composition] || '',
      LIGHTING_KEYWORDS[lighting] || '',
      ATMOSPHERE_KEYWORDS[atmosphere] || '',
      'masterpiece, best quality',
    ].filter(Boolean);
    const params = `--v ${version} --ar ${aspectRatio} --q ${quality} --s ${stylize}`;
    generatedPrompt = parts.join(', ') + ' ' + params;
  }

  function copyPrompt() {
    if (!generatedPrompt) return;
    navigator.clipboard.writeText(generatedPrompt).then(() => {
      copied = true;
      setTimeout(() => (copied = false), 1800);
    });
  }
</script>

<div class="tool-theme-shell p-6 rounded-2xl font-sans min-h-[400px]">
  <!-- Header -->
  <div class="flex items-center gap-3 mb-6">
    <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-fuchsia-400 to-fuchsia-700 flex items-center justify-center text-stone-950 font-black text-lg">
      🎨
    </div>
    <div>
      <h2 class="font-extrabold text-lg text-fuchsia-700 dark:bg-gradient-to-r dark:from-fuchsia-300 dark:via-fuchsia-100 dark:to-fuchsia-400 dark:bg-clip-text dark:text-transparent leading-tight">
        {l.title}
      </h2>
      <p class="text-stone-500 text-xs mt-0.5">{l.subtitle}</p>
    </div>
  </div>

  <!-- Quick Presets -->
  <div class="mb-5">
    <p class="text-xs text-stone-400 mb-2">{l.presets}</p>
    <div class="flex flex-wrap gap-2">
      {#each ['presetCinema','presetDream','presetConcept','presetNeon','presetNature'] as pk}
        <button
          type="button"
          onclick={() => applyPreset(pk)}
          class="py-1 px-3 text-xs font-semibold rounded-full border border-stone-700 bg-stone-900 text-stone-300 hover:border-fuchsia-600 hover:text-fuchsia-300 transition-all"
        >
          {(l as any)[pk]}
        </button>
      {/each}
    </div>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-12 gap-5">
    <!-- Left: Params -->
    <div class="md:col-span-5 space-y-4">
      <label class="block">
        <span class="text-xs text-stone-400 mb-1.5 block">{l.subject} <span class="text-fuchsia-400">*</span></span>
        <textarea
          bind:value={subject}
          placeholder={l.subjectPlaceholder}
          rows="3"
          class="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-2 text-sm text-stone-100 focus:border-fuchsia-500 focus:outline-none transition-colors resize-none"
        ></textarea>
      </label>

      <div>
        <span class="text-xs text-stone-400 mb-1.5 block">{l.style}</span>
        <div class="grid grid-cols-4 gap-1">
          {#each ['photo','illustration','threeD','watercolor','cyberpunk','anime','oil','sketch'] as s}
            <button
              type="button"
              onclick={() => (style = s)}
              class="py-1 text-xxs font-semibold rounded-lg border transition-all {style === s ? 'bg-fuchsia-950/40 border-fuchsia-600 text-fuchsia-300' : 'bg-stone-900 border-stone-800 text-stone-400 hover:border-stone-700'}"
            >
              {(l as any)[s]}
            </button>
          {/each}
        </div>
      </div>

      <div>
        <span class="text-xs text-stone-400 mb-1.5 block">{l.composition}</span>
        <div class="grid grid-cols-3 gap-1">
          {#each ['portrait','wide','aerial','macro','dynamic'] as c}
            <button
              type="button"
              onclick={() => (composition = c)}
              class="py-1 text-xxs font-semibold rounded-lg border transition-all {composition === c ? 'bg-fuchsia-950/40 border-fuchsia-600 text-fuchsia-300' : 'bg-stone-900 border-stone-800 text-stone-400 hover:border-stone-700'}"
            >
              {(l as any)[c]}
            </button>
          {/each}
        </div>
      </div>

      <div class="grid grid-cols-2 gap-3">
        <div>
          <span class="text-xs text-stone-400 mb-1.5 block">{l.lighting}</span>
          <div class="space-y-1">
            {#each ['golden','studio','neon','moody','natural'] as li}
              <button
                type="button"
                onclick={() => (lighting = li)}
                class="w-full py-1 text-xxs font-semibold rounded-lg border transition-all text-left px-2 {lighting === li ? 'bg-fuchsia-950/40 border-fuchsia-600 text-fuchsia-300' : 'bg-stone-900 border-stone-800 text-stone-400 hover:border-stone-700'}"
              >
                {(l as any)[li]}
              </button>
            {/each}
          </div>
        </div>
        <div>
          <span class="text-xs text-stone-400 mb-1.5 block">{l.atmosphere}</span>
          <div class="space-y-1">
            {#each ['dreamy','epic','peaceful','mysterious'] as at}
              <button
                type="button"
                onclick={() => (atmosphere = at)}
                class="w-full py-1 text-xxs font-semibold rounded-lg border transition-all text-left px-2 {atmosphere === at ? 'bg-fuchsia-950/40 border-fuchsia-600 text-fuchsia-300' : 'bg-stone-900 border-stone-800 text-stone-400 hover:border-stone-700'}"
              >
                {(l as any)[at]}
              </button>
            {/each}
          </div>
        </div>
      </div>

      <!-- Parameters -->
      <div class="grid grid-cols-2 gap-3">
        <label class="block">
          <span class="text-xs text-stone-400 mb-1.5 block">{l.version}</span>
          <select
            bind:value={version}
            class="w-full bg-stone-900 border border-stone-700 rounded-lg px-2.5 py-2 text-sm text-stone-200 focus:border-fuchsia-500 focus:outline-none transition-colors"
          >
            {#each ['7','6.1','6','5.2','niji 6'] as v}
              <option value={v}>v{v}</option>
            {/each}
          </select>
        </label>

        <label class="block">
          <span class="text-xs text-stone-400 mb-1.5 block">{l.aspectRatio}</span>
          <select
            bind:value={aspectRatio}
            class="w-full bg-stone-900 border border-stone-700 rounded-lg px-2.5 py-2 text-sm text-stone-200 focus:border-fuchsia-500 focus:outline-none transition-colors"
          >
            {#each ['1:1','16:9','9:16','4:3','3:4','2:3','3:2','21:9'] as ar}
              <option value={ar}>{ar}</option>
            {/each}
          </select>
        </label>
      </div>

      <div class="grid grid-cols-2 gap-3">
        <label class="block">
          <span class="text-xs text-stone-400 mb-1.5 block">{l.quality} (--q)</span>
          <select
            bind:value={quality}
            class="w-full bg-stone-900 border border-stone-700 rounded-lg px-2.5 py-2 text-sm text-stone-200 focus:border-fuchsia-500 focus:outline-none transition-colors"
          >
            {#each ['.25','.5','1'] as q}
              <option value={q}>{q}</option>
            {/each}
          </select>
        </label>

        <label class="block">
          <span class="text-xs text-stone-400 mb-1.5 block">{l.stylize} (--s)</span>
          <input
            type="number"
            bind:value={stylize}
            min="0"
            max="1000"
            step="50"
            class="w-full bg-stone-900 border border-stone-700 rounded-lg px-2.5 py-2 text-sm text-stone-100 focus:border-fuchsia-500 focus:outline-none transition-colors"
          />
        </label>
      </div>

      <button
        type="button"
        onclick={generate}
        class="w-full bg-gradient-to-r from-fuchsia-500 to-fuchsia-700 hover:from-fuchsia-400 hover:to-fuchsia-600 text-white text-sm font-bold py-3 px-4 rounded-xl transition-all shadow-lg"
      >
        ✨ {l.generate}
      </button>
    </div>

    <!-- Right: Output -->
    <div class="md:col-span-7 flex flex-col gap-4">
      {#if generatedPrompt}
        <div class="bg-stone-900 border border-stone-800 rounded-xl p-4 flex-1">
          <p class="text-xs font-bold text-fuchsia-400 mb-3">Generated Prompt</p>
          <p class="text-sm text-stone-200 leading-relaxed font-mono break-all">{generatedPrompt}</p>
        </div>
        <button
          type="button"
          onclick={copyPrompt}
          class="w-full bg-gradient-to-r from-fuchsia-700 to-purple-700 hover:from-fuchsia-600 hover:to-purple-600 text-white text-sm font-bold py-3 px-4 rounded-xl transition-all"
        >
          {copied ? l.copied : `📋 ${l.copy}`}
        </button>
      {:else}
        <div class="flex flex-col items-center justify-center text-center p-8 bg-stone-900/25 border border-dashed border-stone-800 rounded-xl min-h-[300px]">
          <div class="text-4xl mb-3">🎨</div>
          <p class="text-xs text-stone-400 max-w-xs leading-relaxed">{l.placeholderText}</p>
        </div>
      {/if}
      <p class="text-xxs text-stone-600 leading-relaxed text-center">{l.disclaimer}</p>
    </div>
  </div>
</div>

<style>
  .text-xxs { font-size: 0.65rem; }
</style>
