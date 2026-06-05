<script lang="ts">
  interface Props {
    locale?: string;
    translations?: Record<string, unknown>;
  }

  let { locale = 'en', translations = {} }: Props = $props();

  const I18N_BACKUP: Record<string, Record<string, string>> = {
    zh: {
      title: 'TikTok 标签生成器',
      subtitle: '智能生成爆款话题标签，助力内容冲上 For You 推荐页',
      topic: '内容主题 / 描述',
      topicPlaceholder: '例如: 居家健身30天挑战',
      contentType: '内容类型',
      entertainment: '娱乐搞笑',
      education: '知识科普',
      product: '产品推广',
      lifestyle: '生活方式',
      audience: '目标受众',
      audiencePlaceholder: '例如: 健身爱好者、上班族',
      viralTags: '🔥 爆款标签',
      coreTags: '🎯 核心话题',
      longTailTags: '🔍 长尾精准',
      totalTags: '标签总数',
      charCount: '字符数',
      charLimit: 'TikTok 建议 3-10 个标签，最多 2200 字符',
      copyAll: '一键复制全部标签',
      copied: '✓ 已复制!',
      placeholderText: '输入内容主题，即可智能生成 TikTok 爆款标签组合。',
      disclaimer: '建议搭配 3-5 个爆款标签 + 5-8 个精准标签，效果更佳。',
    },
    en: {
      title: 'TikTok Hashtag Generator',
      subtitle: 'Generate viral hashtag combos to boost your content on the For You Page',
      topic: 'Content Topic / Description',
      topicPlaceholder: 'e.g. 30-day home workout challenge',
      contentType: 'Content Type',
      entertainment: 'Entertainment',
      education: 'Education',
      product: 'Product',
      lifestyle: 'Lifestyle',
      audience: 'Target Audience',
      audiencePlaceholder: 'e.g. fitness lovers, office workers',
      viralTags: '🔥 Viral Tags',
      coreTags: '🎯 Core Topics',
      longTailTags: '🔍 Long-Tail Tags',
      totalTags: 'Total Tags',
      charCount: 'Characters',
      charLimit: 'TikTok recommends 3-10 hashtags, max 2200 characters',
      copyAll: 'Copy All Hashtags',
      copied: '✓ Copied!',
      placeholderText: 'Enter your content topic to generate TikTok hashtag combinations.',
      disclaimer: 'Best results: 3-5 viral tags + 5-8 niche tags. Mix popular and specific hashtags.',
    },
    es: {
      title: 'Generador de Hashtags TikTok',
      subtitle: 'Genera combinaciones de hashtags virales para impulsar tu contenido',
      topic: 'Tema / Descripción del Contenido',
      topicPlaceholder: 'ej. Reto de ejercicio en casa 30 días',
      contentType: 'Tipo de Contenido',
      entertainment: 'Entretenimiento',
      education: 'Educación',
      product: 'Producto',
      lifestyle: 'Estilo de Vida',
      audience: 'Público Objetivo',
      audiencePlaceholder: 'ej. amantes del fitness, oficinistas',
      viralTags: '🔥 Etiquetas Virales',
      coreTags: '🎯 Temas Principales',
      longTailTags: '🔍 Etiquetas de Cola Larga',
      totalTags: 'Total de Etiquetas',
      charCount: 'Caracteres',
      charLimit: 'TikTok recomienda 3-10 hashtags, máx 2200 caracteres',
      copyAll: 'Copiar Todos los Hashtags',
      copied: '¡Copiado!',
      placeholderText: 'Ingrese el tema de su contenido para generar combinaciones de hashtags.',
      disclaimer: 'Mejores resultados: 3-5 etiquetas virales + 5-8 etiquetas nicho.',
    },
    pt: {
      title: 'Gerador de Hashtags TikTok',
      subtitle: 'Gere combinações de hashtags virais para impulsionar seu conteúdo',
      topic: 'Tema / Descrição do Conteúdo',
      topicPlaceholder: 'ex. Desafio de treino em casa 30 dias',
      contentType: 'Tipo de Conteúdo',
      entertainment: 'Entretenimento',
      education: 'Educação',
      product: 'Produto',
      lifestyle: 'Estilo de Vida',
      audience: 'Público-Alvo',
      audiencePlaceholder: 'ex. amantes do fitness, trabalhadores de escritório',
      viralTags: '🔥 Tags Virais',
      coreTags: '🎯 Tópicos Principais',
      longTailTags: '🔍 Tags de Cauda Longa',
      totalTags: 'Total de Tags',
      charCount: 'Caracteres',
      charLimit: 'TikTok recomenda 3-10 hashtags, máx 2200 caracteres',
      copyAll: 'Copiar Todas as Hashtags',
      copied: 'Copiado!',
      placeholderText: 'Insira o tema do seu conteúdo para gerar combinações de hashtags.',
      disclaimer: 'Melhores resultados: 3-5 tags virais + 5-8 tags nicho.',
    },
    ja: {
      title: 'TikTok ハッシュタグ ジェネレーター',
      subtitle: 'バズるハッシュタグの組み合わせを生成して For You ページへの露出を最大化',
      topic: 'コンテンツのテーマ / 説明',
      topicPlaceholder: '例: 自宅フィットネス30日チャレンジ',
      contentType: 'コンテンツタイプ',
      entertainment: 'エンタメ',
      education: '教育・情報',
      product: '製品紹介',
      lifestyle: 'ライフスタイル',
      audience: 'ターゲット視聴者',
      audiencePlaceholder: '例: フィットネス好き、会社員',
      viralTags: '🔥 バイラルタグ',
      coreTags: '🎯 メインテーマ',
      longTailTags: '🔍 ロングテールタグ',
      totalTags: 'タグ合計数',
      charCount: '文字数',
      charLimit: 'TikTok推奨: 3〜10個のハッシュタグ、最大2200文字',
      copyAll: 'すべてのハッシュタグをコピー',
      copied: 'コピーしました！',
      placeholderText: 'コンテンツのテーマを入力して、TikTokのハッシュタグを生成します。',
      disclaimer: 'ベストな組み合わせ: バイラル3〜5個 + ニッチ5〜8個。',
    },
    fr: {
      title: 'Générateur de Hashtags TikTok',
      subtitle: 'Générez des combinaisons de hashtags viraux pour booster votre contenu',
      topic: 'Sujet / Description du Contenu',
      topicPlaceholder: 'ex. Défi fitness à domicile 30 jours',
      contentType: 'Type de Contenu',
      entertainment: 'Divertissement',
      education: 'Éducation',
      product: 'Produit',
      lifestyle: 'Style de Vie',
      audience: 'Public Cible',
      audiencePlaceholder: 'ex. amateurs de fitness, salariés',
      viralTags: '🔥 Tags Viraux',
      coreTags: '🎯 Sujets Principaux',
      longTailTags: '🔍 Tags Long Tail',
      totalTags: 'Total des Tags',
      charCount: 'Caractères',
      charLimit: 'TikTok recommande 3 à 10 hashtags, max 2200 caractères',
      copyAll: 'Copier Tous les Hashtags',
      copied: 'Copié !',
      placeholderText: 'Entrez le sujet de votre contenu pour générer des combinaisons de hashtags.',
      disclaimer: 'Meilleurs résultats : 3-5 tags viraux + 5-8 tags de niche.',
    },
    de: {
      title: 'TikTok Hashtag Generator',
      subtitle: 'Generiere virale Hashtag-Kombinationen für maximale Reichweite auf TikTok',
      topic: 'Inhaltsthema / Beschreibung',
      topicPlaceholder: 'z.B. 30-Tage-Heimtraining-Challenge',
      contentType: 'Inhaltstyp',
      entertainment: 'Unterhaltung',
      education: 'Bildung',
      product: 'Produkt',
      lifestyle: 'Lifestyle',
      audience: 'Zielgruppe',
      audiencePlaceholder: 'z.B. Fitness-Enthusiasten, Büroangestellte',
      viralTags: '🔥 Virale Tags',
      coreTags: '🎯 Hauptthemen',
      longTailTags: '🔍 Long-Tail-Tags',
      totalTags: 'Tags gesamt',
      charCount: 'Zeichen',
      charLimit: 'TikTok empfiehlt 3-10 Hashtags, max. 2200 Zeichen',
      copyAll: 'Alle Hashtags kopieren',
      copied: 'Kopiert!',
      placeholderText: 'Geben Sie Ihr Inhaltsthema ein, um Hashtag-Kombinationen zu generieren.',
      disclaimer: 'Beste Ergebnisse: 3-5 virale Tags + 5-8 Nischen-Tags.',
    },
    ar: {
      title: 'مولد هاشتاقات TikTok',
      subtitle: 'أنشئ مجموعات هاشتاق فيروسية لتعزيز محتواك على صفحة "لك"',
      topic: 'موضوع المحتوى / الوصف',
      topicPlaceholder: 'مثال: تحدي اللياقة البدنية في المنزل 30 يوماً',
      contentType: 'نوع المحتوى',
      entertainment: 'ترفيه',
      education: 'تعليم',
      product: 'منتج',
      lifestyle: 'أسلوب حياة',
      audience: 'الجمهور المستهدف',
      audiencePlaceholder: 'مثال: محبو اللياقة، موظفو المكاتب',
      viralTags: '🔥 هاشتاقات فيروسية',
      coreTags: '🎯 مواضيع رئيسية',
      longTailTags: '🔍 هاشتاقات متخصصة',
      totalTags: 'إجمالي الهاشتاقات',
      charCount: 'الأحرف',
      charLimit: 'توصي TikTok بـ 3-10 هاشتاقات، بحد أقصى 2200 حرف',
      copyAll: 'نسخ جميع الهاشتاقات',
      copied: 'تم النسخ!',
      placeholderText: 'أدخل موضوع المحتوى لإنشاء مجموعات هاشتاق لـ TikTok.',
      disclaimer: 'أفضل النتائج: 3-5 هاشتاقات فيروسية + 5-8 هاشتاقات متخصصة.',
    },
    ko: {
      title: 'TikTok 해시태그 생성기',
      subtitle: '바이럴 해시태그 조합을 생성하여 For You 페이지 노출을 극대화하세요',
      topic: '콘텐츠 주제 / 설명',
      topicPlaceholder: '예: 30일 홈 트레이닝 챌린지',
      contentType: '콘텐츠 유형',
      entertainment: '엔터테인먼트',
      education: '교육',
      product: '제품',
      lifestyle: '라이프스타일',
      audience: '타겟 시청자',
      audiencePlaceholder: '예: 피트니스 마니아, 직장인',
      viralTags: '🔥 바이럴 태그',
      coreTags: '🎯 핵심 주제',
      longTailTags: '🔍 롱테일 태그',
      totalTags: '총 태그 수',
      charCount: '글자 수',
      charLimit: 'TikTok 권장: 해시태그 3-10개, 최대 2200자',
      copyAll: '모든 해시태그 복사',
      copied: '복사 완료!',
      placeholderText: '콘텐츠 주제를 입력하면 TikTok 해시태그 조합을 생성합니다.',
      disclaimer: '최적 조합: 바이럴 3-5개 + 니치 5-8개.',
    },
    ru: {
      title: 'Генератор Хэштегов TikTok',
      subtitle: 'Генерируйте вирусные комбинации хэштегов для максимального охвата на TikTok',
      topic: 'Тема / Описание Контента',
      topicPlaceholder: 'напр. 30-дневный фитнес-челлендж дома',
      contentType: 'Тип Контента',
      entertainment: 'Развлечения',
      education: 'Образование',
      product: 'Продукт',
      lifestyle: 'Образ жизни',
      audience: 'Целевая Аудитория',
      audiencePlaceholder: 'напр. любители фитнеса, офисные работники',
      viralTags: '🔥 Вирусные теги',
      coreTags: '🎯 Основные темы',
      longTailTags: '🔍 Длинные теги',
      totalTags: 'Всего тегов',
      charCount: 'Символов',
      charLimit: 'TikTok рекомендует 3-10 хэштегов, макс. 2200 символов',
      copyAll: 'Скопировать все хэштеги',
      copied: 'Скопировано!',
      placeholderText: 'Введите тему контента для генерации хэштегов TikTok.',
      disclaimer: 'Лучшие результаты: 3-5 вирусных тега + 5-8 нишевых тегов.',
    },
  };

  const l = $derived(I18N_BACKUP[locale] || I18N_BACKUP['en']);

  let topic = $state('');
  let contentType = $state('lifestyle');
  let audience = $state('');

  const VIRAL_TAGS = ['#fyp', '#foryoupage', '#foryou', '#viral', '#trending', '#tiktok', '#explore', '#xyzbca'];

  const CONTENT_TYPE_TAGS: Record<string, string[]> = {
    entertainment: ['#funny', '#comedy', '#entertainment', '#laugh', '#lol', '#memes', '#relatable', '#skit'],
    education: ['#learnontiktok', '#edutok', '#didyouknow', '#facts', '#educational', '#learning', '#tips', '#howto'],
    product: ['#tiktokshop', '#productreview', '#unboxing', '#musthave', '#shopnow', '#deal', '#review', '#recommend'],
    lifestyle: ['#lifestyle', '#dailylife', '#vlog', '#dayinmylife', '#aesthetic', '#routine', '#life', '#vibes'],
  };

  function generateTagsFromTopic(t: string, type: string, aud: string): { core: string[]; longTail: string[] } {
    const words = t.toLowerCase().replace(/[^a-z0-9\s\u4e00-\u9fff\u3040-\u309f\u30a0-\u30ff]/g, '').split(/\s+/).filter(Boolean);
    const audWords = aud.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter(Boolean);

    const core: string[] = [];
    const longTail: string[] = [];

    // Core from topic words
    words.slice(0, 4).forEach(w => {
      if (w.length > 2) core.push(`#${w}`);
    });

    // Add content-type specific tags
    const typeTags = CONTENT_TYPE_TAGS[type] || CONTENT_TYPE_TAGS['lifestyle'];
    typeTags.slice(0, 4).forEach(t => core.push(t));

    // Long tail from combinations
    if (words.length >= 2) {
      longTail.push(`#${words.slice(0, 2).join('')}`);
    }
    if (words.length >= 1 && audWords.length >= 1) {
      longTail.push(`#${words[0]}for${audWords[0]}`);
    }
    audWords.slice(0, 2).forEach(w => {
      if (w.length > 2) longTail.push(`#${w}`);
    });
    typeTags.slice(4).forEach(t => longTail.push(t));
    if (words.length >= 1) {
      longTail.push(`#${words[0]}tips`);
      longTail.push(`#${words[0]}101`);
    }

    return {
      core: [...new Set(core)].slice(0, 8),
      longTail: [...new Set(longTail)].slice(0, 10),
    };
  }

  const generated = $derived((() => {
    if (!topic.trim()) return null;
    const { core, longTail } = generateTagsFromTopic(topic, contentType, audience);
    return { viral: VIRAL_TAGS.slice(0, 5), core, longTail };
  })());

  const allTagsText = $derived((() => {
    if (!generated) return '';
    return [...generated.viral, ...generated.core, ...generated.longTail].join(' ');
  })());

  const totalCount = $derived(generated ? generated.viral.length + generated.core.length + generated.longTail.length : 0);
  const charTotal = $derived(allTagsText.length);
  const charPct = $derived(Math.min(100, (charTotal / 2200) * 100));
  const charColor = $derived(charTotal > 1800 ? 'bg-red-500' : charTotal > 1200 ? 'bg-yellow-500' : 'bg-cyan-500');

  let copied = $state(false);
  function copyAll() {
    navigator.clipboard.writeText(allTagsText).then(() => {
      copied = true;
      setTimeout(() => (copied = false), 1800);
    });
  }
</script>

<div class="bg-stone-950 text-stone-100 p-6 rounded-2xl border border-stone-800 shadow-2xl font-sans min-h-[400px]">
  <!-- Header -->
  <div class="flex items-center gap-3 mb-6">
    <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-cyan-700 flex items-center justify-center text-stone-950 font-black text-lg">
      🎵
    </div>
    <div>
      <h2 class="font-extrabold text-lg bg-gradient-to-r from-cyan-300 via-cyan-100 to-cyan-400 bg-clip-text text-transparent leading-tight">
        {l.title}
      </h2>
      <p class="text-stone-500 text-xs mt-0.5">{l.subtitle}</p>
    </div>
  </div>

  <!-- Content Grid -->
  <div class="grid grid-cols-1 md:grid-cols-12 gap-6">
    <!-- Left Panel: Inputs -->
    <div class="md:col-span-5 space-y-4">
      <label class="block">
        <span class="text-xs text-stone-400 mb-1.5 block">{l.topic}</span>
        <textarea
          bind:value={topic}
          placeholder={l.topicPlaceholder}
          rows="3"
          class="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-2 text-sm text-stone-100 focus:border-cyan-500 focus:outline-none transition-colors resize-none"
        ></textarea>
      </label>

      <label class="block">
        <span class="text-xs text-stone-400 mb-1.5 block">{l.contentType}</span>
        <select
          bind:value={contentType}
          class="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-2.5 text-sm text-stone-200 cursor-pointer focus:border-cyan-500 focus:outline-none transition-colors"
        >
          <option value="entertainment">{l.entertainment}</option>
          <option value="education">{l.education}</option>
          <option value="product">{l.product}</option>
          <option value="lifestyle">{l.lifestyle}</option>
        </select>
      </label>

      <label class="block">
        <span class="text-xs text-stone-400 mb-1.5 block">{l.audience}</span>
        <input
          type="text"
          bind:value={audience}
          placeholder={l.audiencePlaceholder}
          class="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-2 text-sm text-stone-100 focus:border-cyan-500 focus:outline-none transition-colors"
        />
      </label>
    </div>

    <!-- Right Panel: Output -->
    <div class="md:col-span-7 flex flex-col gap-4">
      {#if generated}
        <!-- Stats bar -->
        <div class="flex items-center justify-between text-xs text-stone-500 px-1">
          <span>{l.totalTags}: <strong class="text-cyan-400">{totalCount}</strong></span>
          <span>{l.charCount}: <strong class="{charTotal > 1800 ? 'text-red-400' : charTotal > 1200 ? 'text-yellow-400' : 'text-cyan-400'}">{charTotal}/2200</strong></span>
        </div>
        <!-- Char progress bar -->
        <div class="h-1.5 bg-stone-800 rounded-full overflow-hidden">
          <div class="{charColor} h-full rounded-full transition-all duration-300" style="width:{charPct}%"></div>
        </div>

        <!-- Viral Tags -->
        <div class="bg-stone-900/60 border border-stone-800 rounded-xl p-4">
          <p class="text-xs font-semibold text-cyan-400 mb-2">{l.viralTags}</p>
          <div class="flex flex-wrap gap-1.5">
            {#each generated.viral as tag}
              <span class="bg-cyan-950/50 border border-cyan-700/40 text-cyan-300 text-xs px-2 py-0.5 rounded-full">{tag}</span>
            {/each}
          </div>
        </div>

        <!-- Core Tags -->
        <div class="bg-stone-900/60 border border-stone-800 rounded-xl p-4">
          <p class="text-xs font-semibold text-violet-400 mb-2">{l.coreTags}</p>
          <div class="flex flex-wrap gap-1.5">
            {#each generated.core as tag}
              <span class="bg-violet-950/40 border border-violet-700/40 text-violet-300 text-xs px-2 py-0.5 rounded-full">{tag}</span>
            {/each}
          </div>
        </div>

        <!-- Long-tail Tags -->
        <div class="bg-stone-900/60 border border-stone-800 rounded-xl p-4">
          <p class="text-xs font-semibold text-emerald-400 mb-2">{l.longTailTags}</p>
          <div class="flex flex-wrap gap-1.5">
            {#each generated.longTail as tag}
              <span class="bg-emerald-950/40 border border-emerald-700/40 text-emerald-300 text-xs px-2 py-0.5 rounded-full">{tag}</span>
            {/each}
          </div>
        </div>

        <!-- Copy All -->
        <button
          type="button"
          onclick={copyAll}
          class="w-full bg-cyan-950/40 hover:bg-cyan-900/50 border border-cyan-700/50 text-cyan-300 hover:text-cyan-200 text-xs font-semibold py-2.5 px-4 rounded-lg transition-all flex items-center justify-center gap-2"
        >
          {copied ? l.copied : `📋 ${l.copyAll}`}
        </button>
      {:else}
        <div class="h-full flex flex-col items-center justify-center text-center p-10 bg-stone-900/25 border border-dashed border-stone-800 rounded-xl min-h-[240px]">
          <div class="text-4xl mb-3">🎵</div>
          <p class="text-xs text-stone-400 max-w-xs leading-relaxed">{l.placeholderText}</p>
        </div>
      {/if}

      <p class="text-xxs text-stone-600 text-center leading-relaxed">{l.charLimit}</p>
      <p class="text-xxs text-stone-600 text-center leading-relaxed">{l.disclaimer}</p>
    </div>
  </div>
</div>

<style>
  .text-xxs {
    font-size: 0.65rem;
  }
</style>
