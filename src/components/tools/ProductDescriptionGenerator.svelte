<script lang="ts">
  interface Props {
    locale?: string;
    translations?: Record<string, unknown>;
  }

  let { locale = 'en', translations = {} }: Props = $props();

  const I18N_BACKUP: Record<string, Record<string, string>> = {
    zh: {
      title: '产品描述生成器',
      subtitle: '快速生成短/中/长三种版本的专业产品描述，适配不同营销场景',
      productName: '产品名称',
      productNamePlaceholder: '例如：EcoBreeze 智能空气净化器',
      productType: '产品类型',
      electronics: '电子产品',
      clothing: '服装配饰',
      food: '食品饮料',
      service: '服务/软件',
      beauty: '美妆护肤',
      home: '家居用品',
      other: '其他',
      features: '核心特性（每行一条，3-5 个）',
      featuresPlaceholder: 'HEPA过滤\n静音运行\n智能感应\nAPP控制',
      audience: '目标受众',
      audiencePlaceholder: '例如：关注健康的都市白领',
      tone: '语气风格',
      professional: '专业正式',
      friendly: '亲切友好',
      exciting: '激情活力',
      luxury: '高端奢华',
      minimal: '简约现代',
      generate: '生成产品描述',
      shortDesc: '短版（社媒/标题）',
      medDesc: '中版（产品页摘要）',
      longDesc: '长版（完整描述）',
      bullets: '卖点亮点',
      chars: '字符',
      words: '词',
      copy: '复制',
      copied: '✓ 已复制',
      copyAll: '复制全部',
      disclaimer: '生成内容仅供参考，请根据实际产品情况调整后使用。',
      placeholderText: '填写产品信息后点击生成，将自动输出三个版本的专业描述。',
    },
    en: {
      title: 'Product Description Generator',
      subtitle: 'Generate short, medium, and long professional product descriptions for any marketing scenario',
      productName: 'Product Name',
      productNamePlaceholder: 'e.g. EcoBreeze Smart Air Purifier',
      productType: 'Product Type',
      electronics: 'Electronics',
      clothing: 'Clothing & Accessories',
      food: 'Food & Beverage',
      service: 'Service / Software',
      beauty: 'Beauty & Skincare',
      home: 'Home & Living',
      other: 'Other',
      features: 'Key Features (one per line, 3-5)',
      featuresPlaceholder: 'HEPA Filtration\nUltra-quiet motor\nSmart air sensing\nApp control',
      audience: 'Target Audience',
      audiencePlaceholder: 'e.g. Health-conscious urban professionals',
      tone: 'Tone & Style',
      professional: 'Professional',
      friendly: 'Friendly & Warm',
      exciting: 'Exciting & Energetic',
      luxury: 'Luxury & Premium',
      minimal: 'Minimal & Modern',
      generate: 'Generate Descriptions',
      shortDesc: 'Short (Social / Headline)',
      medDesc: 'Medium (Product Page)',
      longDesc: 'Long (Full Description)',
      bullets: 'Key Selling Points',
      chars: 'chars',
      words: 'words',
      copy: 'Copy',
      copied: '✓ Copied',
      copyAll: 'Copy All',
      disclaimer: 'Generated content is for reference only. Please review and adjust to match your actual product.',
      placeholderText: 'Fill in the product details above and click Generate to produce three professional versions.',
    },
    es: {
      title: 'Generador de Descripciones de Producto',
      subtitle: 'Genera descripciones cortas, medianas y largas para cualquier escenario de marketing',
      productName: 'Nombre del Producto',
      productNamePlaceholder: 'ej. Purificador de Aire EcoBreeze',
      productType: 'Tipo de Producto',
      electronics: 'Electrónica',
      clothing: 'Ropa y Accesorios',
      food: 'Alimentos y Bebidas',
      service: 'Servicio / Software',
      beauty: 'Belleza y Cuidado',
      home: 'Hogar',
      other: 'Otro',
      features: 'Características Clave (una por línea, 3-5)',
      featuresPlaceholder: 'Filtración HEPA\nMotor silencioso\nSensor inteligente\nControl por app',
      audience: 'Público Objetivo',
      audiencePlaceholder: 'ej. Profesionales urbanos preocupados por la salud',
      tone: 'Tono y Estilo',
      professional: 'Profesional',
      friendly: 'Amigable y Cálido',
      exciting: 'Emocionante y Energético',
      luxury: 'Lujo y Premium',
      minimal: 'Minimalista y Moderno',
      generate: 'Generar Descripciones',
      shortDesc: 'Corta (Redes Sociales)',
      medDesc: 'Media (Página de Producto)',
      longDesc: 'Larga (Descripción Completa)',
      bullets: 'Puntos de Venta Clave',
      chars: 'caracteres',
      words: 'palabras',
      copy: 'Copiar',
      copied: '✓ Copiado',
      copyAll: 'Copiar Todo',
      disclaimer: 'El contenido generado es solo de referencia. Revísalo y ajústalo a tu producto real.',
      placeholderText: 'Completa los detalles del producto y haz clic en Generar.',
    },
    pt: {
      title: 'Gerador de Descrições de Produto',
      subtitle: 'Gere descrições curtas, médias e longas para qualquer cenário de marketing',
      productName: 'Nome do Produto',
      productNamePlaceholder: 'ex. Purificador de Ar EcoBreeze',
      productType: 'Tipo de Produto',
      electronics: 'Eletrônicos',
      clothing: 'Roupas e Acessórios',
      food: 'Alimentos e Bebidas',
      service: 'Serviço / Software',
      beauty: 'Beleza e Cuidados',
      home: 'Casa e Decoração',
      other: 'Outro',
      features: 'Características Principais (uma por linha, 3-5)',
      featuresPlaceholder: 'Filtração HEPA\nMotor silencioso\nSensor inteligente\nControle por app',
      audience: 'Público-Alvo',
      audiencePlaceholder: 'ex. Profissionais urbanos preocupados com saúde',
      tone: 'Tom e Estilo',
      professional: 'Profissional',
      friendly: 'Amigável e Caloroso',
      exciting: 'Empolgante e Energético',
      luxury: 'Luxo e Premium',
      minimal: 'Minimalista e Moderno',
      generate: 'Gerar Descrições',
      shortDesc: 'Curta (Redes Sociais)',
      medDesc: 'Média (Página de Produto)',
      longDesc: 'Longa (Descrição Completa)',
      bullets: 'Pontos de Venda',
      chars: 'caracteres',
      words: 'palavras',
      copy: 'Copiar',
      copied: '✓ Copiado',
      copyAll: 'Copiar Tudo',
      disclaimer: 'O conteúdo gerado é apenas referência. Revise e ajuste conforme seu produto real.',
      placeholderText: 'Preencha os dados do produto e clique em Gerar.',
    },
    ja: {
      title: '商品説明ジェネレーター',
      subtitle: 'あらゆるマーケティングシーンに対応した短・中・長の商品説明を自動生成',
      productName: '商品名',
      productNamePlaceholder: '例：EcoBreeze スマート空気清浄機',
      productType: '商品カテゴリ',
      electronics: '電子機器',
      clothing: 'ファッション・アクセサリー',
      food: '食品・飲料',
      service: 'サービス・ソフトウェア',
      beauty: '美容・スキンケア',
      home: 'インテリア・家具',
      other: 'その他',
      features: '主な特徴（1行1項目、3〜5個）',
      featuresPlaceholder: 'HEPAフィルター\n超静音モーター\nスマートセンサー\nアプリ操作',
      audience: 'ターゲット層',
      audiencePlaceholder: '例：健康意識の高い都市部の会社員',
      tone: 'トーン・スタイル',
      professional: 'プロフェッショナル',
      friendly: 'フレンドリー・温かみ',
      exciting: 'エキサイティング・活力',
      luxury: 'ラグジュアリー・高級感',
      minimal: 'シンプル・モダン',
      generate: '説明文を生成',
      shortDesc: '短版（SNS・見出し）',
      medDesc: '中版（商品ページ）',
      longDesc: '長版（詳細説明）',
      bullets: 'セールスポイント',
      chars: '文字',
      words: '語',
      copy: 'コピー',
      copied: '✓ コピー済み',
      copyAll: 'すべてコピー',
      disclaimer: '生成内容はあくまで参考です。実際の商品に合わせてご調整ください。',
      placeholderText: '商品情報を入力して「説明文を生成」をクリックしてください。',
    },
    fr: {
      title: 'Générateur de Descriptions Produit',
      subtitle: 'Créez des descriptions courtes, moyennes et longues pour tout scénario marketing',
      productName: 'Nom du Produit',
      productNamePlaceholder: 'ex. Purificateur d\'air EcoBreeze',
      productType: 'Type de Produit',
      electronics: 'Électronique',
      clothing: 'Vêtements et Accessoires',
      food: 'Alimentation et Boissons',
      service: 'Service / Logiciel',
      beauty: 'Beauté et Soins',
      home: 'Maison et Décoration',
      other: 'Autre',
      features: 'Caractéristiques Clés (une par ligne, 3-5)',
      featuresPlaceholder: 'Filtration HEPA\nMoteur ultra-silencieux\nCapteur intelligent\nContrôle via app',
      audience: 'Public Cible',
      audiencePlaceholder: 'ex. Professionnels urbains soucieux de leur santé',
      tone: 'Ton et Style',
      professional: 'Professionnel',
      friendly: 'Amical et Chaleureux',
      exciting: 'Dynamique et Énergique',
      luxury: 'Luxe et Premium',
      minimal: 'Minimaliste et Moderne',
      generate: 'Générer les Descriptions',
      shortDesc: 'Courte (Réseaux Sociaux)',
      medDesc: 'Moyenne (Page Produit)',
      longDesc: 'Longue (Description Complète)',
      bullets: 'Points de Vente Clés',
      chars: 'caractères',
      words: 'mots',
      copy: 'Copier',
      copied: '✓ Copié',
      copyAll: 'Tout Copier',
      disclaimer: 'Le contenu généré est fourni à titre indicatif. Adaptez-le à votre produit réel.',
      placeholderText: 'Remplissez les détails du produit et cliquez sur Générer.',
    },
    de: {
      title: 'Produktbeschreibungs-Generator',
      subtitle: 'Generieren Sie kurze, mittlere und lange Produktbeschreibungen für jedes Marketingszenario',
      productName: 'Produktname',
      productNamePlaceholder: 'z.B. EcoBreeze Smarter Luftreiniger',
      productType: 'Produkttyp',
      electronics: 'Elektronik',
      clothing: 'Kleidung & Accessoires',
      food: 'Lebensmittel & Getränke',
      service: 'Service / Software',
      beauty: 'Beauty & Pflege',
      home: 'Wohnen & Leben',
      other: 'Sonstige',
      features: 'Hauptmerkmale (eines pro Zeile, 3-5)',
      featuresPlaceholder: 'HEPA-Filterung\nUltraleiser Motor\nIntelligenter Sensor\nApp-Steuerung',
      audience: 'Zielgruppe',
      audiencePlaceholder: 'z.B. Gesundheitsbewusste Stadtbewohner',
      tone: 'Ton & Stil',
      professional: 'Professionell',
      friendly: 'Freundlich & Warm',
      exciting: 'Spannend & Energetisch',
      luxury: 'Luxus & Premium',
      minimal: 'Minimalistisch & Modern',
      generate: 'Beschreibungen Generieren',
      shortDesc: 'Kurz (Social Media)',
      medDesc: 'Mittel (Produktseite)',
      longDesc: 'Lang (Vollständige Beschreibung)',
      bullets: 'Verkaufsargumente',
      chars: 'Zeichen',
      words: 'Wörter',
      copy: 'Kopieren',
      copied: '✓ Kopiert',
      copyAll: 'Alles Kopieren',
      disclaimer: 'Der generierte Inhalt dient nur als Referenz. Bitte anpassen.',
      placeholderText: 'Füllen Sie die Produktdetails aus und klicken Sie auf Generieren.',
    },
    ar: {
      title: 'مولّد وصف المنتجات',
      subtitle: 'أنشئ أوصافاً قصيرة ومتوسطة وطويلة لأي سيناريو تسويقي',
      productName: 'اسم المنتج',
      productNamePlaceholder: 'مثال: منقي الهواء الذكي EcoBreeze',
      productType: 'نوع المنتج',
      electronics: 'إلكترونيات',
      clothing: 'ملابس وإكسسوارات',
      food: 'مواد غذائية ومشروبات',
      service: 'خدمة / برمجيات',
      beauty: 'جمال وعناية',
      home: 'منزل وديكور',
      other: 'أخرى',
      features: 'الميزات الرئيسية (ميزة لكل سطر، 3-5 ميزات)',
      featuresPlaceholder: 'تصفية HEPA\nمحرك صامت\nاستشعار ذكي\nتحكم عبر التطبيق',
      audience: 'الجمهور المستهدف',
      audiencePlaceholder: 'مثال: موظفو المدن المهتمون بالصحة',
      tone: 'النبرة والأسلوب',
      professional: 'احترافي ورسمي',
      friendly: 'ودي ودافئ',
      exciting: 'مثير وحيوي',
      luxury: 'فاخر وراقي',
      minimal: 'بسيط وعصري',
      generate: 'توليد الأوصاف',
      shortDesc: 'قصير (وسائل التواصل)',
      medDesc: 'متوسط (صفحة المنتج)',
      longDesc: 'طويل (وصف كامل)',
      bullets: 'نقاط البيع الرئيسية',
      chars: 'حرف',
      words: 'كلمة',
      copy: 'نسخ',
      copied: '✓ تم النسخ',
      copyAll: 'نسخ الكل',
      disclaimer: 'المحتوى المولّد للاسترشاد فقط. يرجى مراجعته وتعديله وفق منتجك الفعلي.',
      placeholderText: 'أدخل بيانات المنتج ثم اضغط على توليد الأوصاف.',
    },
    ko: {
      title: '상품 설명 생성기',
      subtitle: '다양한 마케팅 시나리오에 맞는 단문/중문/장문 상품 설명을 자동 생성합니다',
      productName: '상품명',
      productNamePlaceholder: '예: EcoBreeze 스마트 공기청정기',
      productType: '상품 유형',
      electronics: '전자제품',
      clothing: '의류 및 액세서리',
      food: '식품 및 음료',
      service: '서비스 / 소프트웨어',
      beauty: '뷰티 & 스킨케어',
      home: '홈 & 인테리어',
      other: '기타',
      features: '핵심 특징 (한 줄에 하나씩, 3-5개)',
      featuresPlaceholder: 'HEPA 필터\n초저소음 모터\n스마트 센서\n앱 컨트롤',
      audience: '타겟 고객',
      audiencePlaceholder: '예: 건강에 관심 많은 도시 직장인',
      tone: '톤 & 스타일',
      professional: '전문적/공식',
      friendly: '친근하고 따뜻한',
      exciting: '활기차고 역동적인',
      luxury: '럭셔리/프리미엄',
      minimal: '미니멀/현대적',
      generate: '설명 생성',
      shortDesc: '단문 (SNS/헤드라인)',
      medDesc: '중문 (상품 페이지)',
      longDesc: '장문 (상세 설명)',
      bullets: '핵심 셀링 포인트',
      chars: '자',
      words: '단어',
      copy: '복사',
      copied: '✓ 복사됨',
      copyAll: '전체 복사',
      disclaimer: '생성된 내용은 참고용입니다. 실제 상품에 맞게 검토 후 사용하세요.',
      placeholderText: '상품 정보를 입력하고 생성 버튼을 클릭하세요.',
    },
    ru: {
      title: 'Генератор Описаний Товаров',
      subtitle: 'Создавайте краткие, средние и подробные описания для любого маркетингового сценария',
      productName: 'Название Товара',
      productNamePlaceholder: 'напр. Умный очиститель воздуха EcoBreeze',
      productType: 'Тип Товара',
      electronics: 'Электроника',
      clothing: 'Одежда и Аксессуары',
      food: 'Продукты и Напитки',
      service: 'Сервис / Программное обеспечение',
      beauty: 'Красота и Уход',
      home: 'Дом и Интерьер',
      other: 'Другое',
      features: 'Ключевые Характеристики (одна на строку, 3-5)',
      featuresPlaceholder: 'HEPA-фильтрация\nУльтратихий мотор\nУмный датчик\nУправление через приложение',
      audience: 'Целевая Аудитория',
      audiencePlaceholder: 'напр. Горожане, заботящиеся о здоровье',
      tone: 'Тон и Стиль',
      professional: 'Профессиональный',
      friendly: 'Дружелюбный и Тёплый',
      exciting: 'Динамичный и Энергичный',
      luxury: 'Роскошный и Премиум',
      minimal: 'Минималистичный и Современный',
      generate: 'Сгенерировать Описания',
      shortDesc: 'Краткое (Соцсети)',
      medDesc: 'Среднее (Страница Товара)',
      longDesc: 'Подробное (Полное Описание)',
      bullets: 'Ключевые Преимущества',
      chars: 'символов',
      words: 'слов',
      copy: 'Копировать',
      copied: '✓ Скопировано',
      copyAll: 'Копировать Всё',
      disclaimer: 'Сгенерированный контент носит справочный характер. Адаптируйте его под реальный товар.',
      placeholderText: 'Заполните данные о товаре и нажмите «Сгенерировать».',
    },
  };

  const l = $derived(I18N_BACKUP[locale] || I18N_BACKUP['en']);

  let productName = $state('');
  let productType = $state('electronics');
  let features = $state('');
  let audience = $state('');
  let tone = $state('professional');

  interface GeneratedDesc {
    short: string;
    medium: string;
    long: string;
    bullets: string[];
  }

  let generated = $state<GeneratedDesc | null>(null);
  let copiedKey = $state('');

  const toneAdverbs: Record<string, string> = {
    professional: 'precisely engineered',
    friendly: 'thoughtfully crafted',
    exciting: 'brilliantly designed',
    luxury: 'exquisitely crafted',
    minimal: 'elegantly designed',
  };

  const typeEmojis: Record<string, string> = {
    electronics: '⚡',
    clothing: '👗',
    food: '🍃',
    service: '💡',
    beauty: '✨',
    home: '🏠',
    other: '📦',
  };

  function generate() {
    const name = productName.trim();
    if (!name) return;
    const featureList = features
      .split('\n')
      .map((f) => f.trim())
      .filter(Boolean)
      .slice(0, 5);
    if (featureList.length === 0) return;

    const adverb = toneAdverbs[tone] || 'carefully designed';
    const audienceStr = audience.trim() || 'everyday users';
    const feat1 = featureList[0] || '';
    const feat2 = featureList[1] || feat1;
    const featAll = featureList.join(', ');

    const short = `${name} — ${adverb} for ${audienceStr}. Featuring ${feat1} and ${feat2}, it redefines what's possible.`;

    const medium = `Introducing ${name}, ${adverb} to meet the needs of ${audienceStr}. Equipped with ${featAll}, ${name} delivers an unparalleled experience that seamlessly combines performance and elegance. Whether at home or on the go, it adapts to your lifestyle.`;

    const long = `${name} represents a new standard in ${(l as any)[productType] || productType}. ${adverb.charAt(0).toUpperCase() + adverb.slice(1)} with ${audienceStr} in mind, every detail has been considered to provide maximum value and satisfaction.\n\nAt its core, ${name} features ${featAll}. These innovations work together to deliver a product experience unlike anything you've encountered before. The result is a seamless blend of form and function that empowers ${audienceStr} to achieve more.\n\nExperience the difference that thoughtful engineering makes. ${name} isn't just a product — it's an upgrade to your daily life.`;

    const bullets = featureList.map((f) => `✓ ${f}`);

    generated = { short, medium, long, bullets };
  }

  function countStats(text: string) {
    return {
      chars: text.length,
      words: text
        .trim()
        .split(/\s+/)
        .filter(Boolean).length,
    };
  }

  function copyText(text: string, key: string) {
    navigator.clipboard.writeText(text).then(() => {
      copiedKey = key;
      setTimeout(() => (copiedKey = ''), 1800);
    });
  }

  function copyAll() {
    if (!generated) return;
    const all = `=== ${l.shortDesc} ===\n${generated.short}\n\n=== ${l.medDesc} ===\n${generated.medium}\n\n=== ${l.longDesc} ===\n${generated.long}\n\n=== ${l.bullets} ===\n${generated.bullets.join('\n')}`;
    copyText(all, 'all');
  }
</script>

<div class="tool-theme-shell p-6 rounded-2xl font-sans min-h-[400px]">
  <!-- Header -->
  <div class="flex items-center gap-3 mb-6">
    <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-400 to-violet-700 flex items-center justify-center text-stone-950 font-black text-lg">
      📝
    </div>
    <div>
      <h2 class="font-extrabold text-lg text-violet-700 dark:bg-gradient-to-r dark:from-violet-300 dark:via-violet-100 dark:to-violet-400 dark:bg-clip-text dark:text-transparent leading-tight">
        {l.title}
      </h2>
      <p class="text-stone-500 text-xs mt-0.5">{l.subtitle}</p>
    </div>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-12 gap-6">
    <!-- Left: Inputs -->
    <div class="md:col-span-5 space-y-4">
      <label class="block">
        <span class="text-xs text-stone-400 mb-1.5 block">{l.productName} <span class="text-violet-400">*</span></span>
        <input
          type="text"
          bind:value={productName}
          placeholder={l.productNamePlaceholder}
          class="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-2 text-sm text-stone-100 focus:border-violet-500 focus:outline-none transition-colors"
        />
      </label>

      <label class="block">
        <span class="text-xs text-stone-400 mb-1.5 block">{l.productType}</span>
        <select
          bind:value={productType}
          class="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-2.5 text-sm text-stone-200 cursor-pointer focus:border-violet-500 focus:outline-none transition-colors"
        >
          {#each ['electronics','clothing','food','service','beauty','home','other'] as t}
            <option value={t}>{typeEmojis[t]} {(l as any)[t]}</option>
          {/each}
        </select>
      </label>

      <label class="block">
        <span class="text-xs text-stone-400 mb-1.5 block">{l.features} <span class="text-violet-400">*</span></span>
        <textarea
          bind:value={features}
          placeholder={l.featuresPlaceholder}
          rows="5"
          class="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-2 text-sm text-stone-100 focus:border-violet-500 focus:outline-none transition-colors resize-none"
        ></textarea>
      </label>

      <label class="block">
        <span class="text-xs text-stone-400 mb-1.5 block">{l.audience}</span>
        <input
          type="text"
          bind:value={audience}
          placeholder={l.audiencePlaceholder}
          class="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-2 text-sm text-stone-100 focus:border-violet-500 focus:outline-none transition-colors"
        />
      </label>

      <div>
        <span class="text-xs text-stone-400 mb-1.5 block">{l.tone}</span>
        <div class="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {#each ['professional','friendly','exciting','luxury','minimal'] as t}
            <button
              type="button"
              onclick={() => (tone = t)}
              class="py-1.5 px-2 text-xs font-semibold rounded-lg border transition-all {tone === t ? 'bg-violet-950/40 border-violet-600 text-violet-300' : 'bg-stone-900 border-stone-800 text-stone-400 hover:border-stone-700'}"
            >
              {(l as any)[t]}
            </button>
          {/each}
        </div>
      </div>

      <button
        type="button"
        onclick={generate}
        class="w-full bg-gradient-to-r from-violet-500 to-violet-700 hover:from-violet-400 hover:to-violet-600 text-white text-sm font-bold py-3 px-4 rounded-xl transition-all shadow-lg mt-2"
      >
        ✨ {l.generate}
      </button>
    </div>

    <!-- Right: Output -->
    <div class="md:col-span-7 space-y-4">
      {#if generated}
        <!-- Bullets -->
        <div class="bg-stone-900 border border-stone-800 rounded-xl p-4">
          <p class="text-xs font-bold text-violet-400 mb-2">🎯 {l.bullets}</p>
          <ul class="space-y-1">
            {#each generated.bullets as b}
              <li class="text-sm text-stone-300">{b}</li>
            {/each}
          </ul>
        </div>

        <!-- Short -->
        {#each [
          { key: 'short', label: l.shortDesc, text: generated.short },
          { key: 'medium', label: l.medDesc, text: generated.medium },
          { key: 'long', label: l.longDesc, text: generated.long },
        ] as item}
          {@const stats = countStats(item.text)}
          <div class="bg-stone-900 border border-stone-800 rounded-xl p-4">
            <div class="flex items-center justify-between mb-2">
              <p class="text-xs font-bold text-stone-300">{item.label}</p>
              <div class="flex items-center gap-2">
                <span class="text-xxs text-stone-600">{stats.chars} {l.chars} · {stats.words} {l.words}</span>
                <button
                  type="button"
                  onclick={() => copyText(item.text, item.key)}
                  class="text-xxs text-stone-500 hover:text-violet-400 border border-stone-800 hover:border-violet-700 rounded px-2 py-0.5 transition-all"
                >
                  {copiedKey === item.key ? l.copied : l.copy}
                </button>
              </div>
            </div>
            <p class="text-sm text-stone-300 leading-relaxed whitespace-pre-line">{item.text}</p>
          </div>
        {/each}

        <button
          type="button"
          onclick={copyAll}
          class="w-full bg-stone-900 hover:bg-stone-800 border border-stone-700 text-stone-300 text-xs font-semibold py-2.5 rounded-lg transition-all"
        >
          📋 {copiedKey === 'all' ? l.copied : l.copyAll}
        </button>
      {:else}
        <div class="h-full flex flex-col items-center justify-center text-center p-8 bg-stone-900/25 border border-dashed border-stone-800 rounded-xl min-h-[300px]">
          <div class="text-4xl mb-3">📝</div>
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
