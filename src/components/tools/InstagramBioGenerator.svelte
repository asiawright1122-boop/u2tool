<script lang="ts">
  interface Props {
    locale?: string;
    translations?: Record<string, unknown>;
  }

  let { locale = 'en', translations = {} }: Props = $props();

  const I18N_BACKUP: Record<string, Record<string, string>> = {
    zh: {
      title: 'Instagram 简介生成器',
      subtitle: '生成多种风格的 Instagram 个人简介，展示您最迷人的一面',
      name: '姓名 / 品牌名',
      namePlaceholder: '例如: 小王',
      profession: '职业 / 描述',
      professionPlaceholder: '例如: UX 设计师 & 旅行博主',
      keywords: '关键词 / 技能',
      keywordsPlaceholder: '例如: 设计、摄影、旅行',
      cta: 'CTA / 链接文字',
      ctaPlaceholder: '例如: 👇 查看我的作品集',
      emojiStyle: 'Emoji 风格',
      styleSimple: '简洁极简',
      styleProfessional: '专业权威',
      stylePersonality: '个性有趣',
      generate: '生成简介',
      charLimit: '150 字符限制',
      copy: '复制',
      copied: '✓ 已复制',
      editHint: '点击可编辑',
      placeholderText: '输入姓名与职业描述，生成 Instagram 简介。',
      disclaimer: 'Instagram 个人简介限制为 150 字符，包括表情符号。',
    },
    en: {
      title: 'Instagram Bio Generator',
      subtitle: 'Generate multiple-style Instagram bios that showcase your best self',
      name: 'Name / Brand',
      namePlaceholder: 'e.g. Alex Johnson',
      profession: 'Profession / Description',
      professionPlaceholder: 'e.g. UX Designer & Travel Blogger',
      keywords: 'Keywords / Skills',
      keywordsPlaceholder: 'e.g. design, photography, travel',
      cta: 'CTA / Link Text',
      ctaPlaceholder: 'e.g. 👇 Check my portfolio',
      emojiStyle: 'Emoji Style',
      styleSimple: 'Clean & Minimal',
      styleProfessional: 'Professional',
      stylePersonality: 'Fun & Personality',
      generate: 'Generate Bios',
      charLimit: '150 character limit',
      copy: 'Copy',
      copied: '✓ Copied',
      editHint: 'Click to edit',
      placeholderText: 'Enter your name and profession to generate Instagram bios.',
      disclaimer: 'Instagram bio limit is 150 characters, including emojis.',
    },
    es: {
      title: 'Generador de Bios de Instagram',
      subtitle: 'Genera múltiples estilos de bio para Instagram que muestren tu mejor versión',
      name: 'Nombre / Marca',
      namePlaceholder: 'ej. Alejandro García',
      profession: 'Profesión / Descripción',
      professionPlaceholder: 'ej. Diseñador UX y Blogger de Viajes',
      keywords: 'Palabras Clave / Habilidades',
      keywordsPlaceholder: 'ej. diseño, fotografía, viajes',
      cta: 'CTA / Texto del Enlace',
      ctaPlaceholder: 'ej. 👇 Ver mi portafolio',
      emojiStyle: 'Estilo de Emoji',
      styleSimple: 'Limpio y Minimalista',
      styleProfessional: 'Profesional',
      stylePersonality: 'Divertido y Personalidad',
      generate: 'Generar Bios',
      charLimit: 'Límite de 150 caracteres',
      copy: 'Copiar',
      copied: '✓ Copiado',
      editHint: 'Clic para editar',
      placeholderText: 'Ingrese su nombre y profesión para generar bios de Instagram.',
      disclaimer: 'El límite de bio de Instagram es de 150 caracteres, incluyendo emojis.',
    },
    pt: {
      title: 'Gerador de Bio do Instagram',
      subtitle: 'Gere múltiplos estilos de bio para Instagram que mostrem seu melhor lado',
      name: 'Nome / Marca',
      namePlaceholder: 'ex. Alexandre Silva',
      profession: 'Profissão / Descrição',
      professionPlaceholder: 'ex. Designer UX e Blogger de Viagens',
      keywords: 'Palavras-chave / Habilidades',
      keywordsPlaceholder: 'ex. design, fotografia, viagens',
      cta: 'CTA / Texto do Link',
      ctaPlaceholder: 'ex. 👇 Veja meu portfólio',
      emojiStyle: 'Estilo de Emoji',
      styleSimple: 'Limpo e Minimalista',
      styleProfessional: 'Profissional',
      stylePersonality: 'Divertido e Personalidade',
      generate: 'Gerar Bios',
      charLimit: 'Limite de 150 caracteres',
      copy: 'Copiar',
      copied: 'Copiado',
      editHint: 'Clique para editar',
      placeholderText: 'Insira seu nome e profissão para gerar bios do Instagram.',
      disclaimer: 'O limite de bio do Instagram é de 150 caracteres, incluindo emojis.',
    },
    ja: {
      title: 'Instagram プロフィールジェネレーター',
      subtitle: 'あなたの魅力を最大限に引き出す複数スタイルのInstagramプロフィールを生成',
      name: '名前 / ブランド名',
      namePlaceholder: '例: 田中 花子',
      profession: '職業 / 説明',
      professionPlaceholder: '例: UXデザイナー & トラベルブロガー',
      keywords: 'キーワード / スキル',
      keywordsPlaceholder: '例: デザイン、写真、旅行',
      cta: 'CTA / リンクテキスト',
      ctaPlaceholder: '例: 👇 ポートフォリオはこちら',
      emojiStyle: '絵文字スタイル',
      styleSimple: 'シンプル＆ミニマル',
      styleProfessional: 'プロフェッショナル',
      stylePersonality: '個性的＆楽しい',
      generate: 'プロフィールを生成',
      charLimit: '150文字制限',
      copy: 'コピー',
      copied: 'コピーしました',
      editHint: 'クリックで編集',
      placeholderText: '名前と職業を入力してInstagramプロフィールを生成します。',
      disclaimer: 'Instagramのプロフィール上限は絵文字を含めて150文字です。',
    },
    fr: {
      title: 'Générateur de Bio Instagram',
      subtitle: 'Générez des bios Instagram en plusieurs styles qui mettent en valeur votre personnalité',
      name: 'Nom / Marque',
      namePlaceholder: 'ex. Marie Dupont',
      profession: 'Profession / Description',
      professionPlaceholder: 'ex. Designer UX et Blogueuse Voyage',
      keywords: 'Mots-clés / Compétences',
      keywordsPlaceholder: 'ex. design, photographie, voyage',
      cta: 'CTA / Texte du Lien',
      ctaPlaceholder: 'ex. 👇 Voir mon portfolio',
      emojiStyle: 'Style Emoji',
      styleSimple: 'Épuré et Minimaliste',
      styleProfessional: 'Professionnel',
      stylePersonality: 'Fun et Personnalité',
      generate: 'Générer des Bios',
      charLimit: 'Limite de 150 caractères',
      copy: 'Copier',
      copied: 'Copié',
      editHint: 'Cliquez pour modifier',
      placeholderText: 'Entrez votre nom et profession pour générer des bios Instagram.',
      disclaimer: 'La limite de bio Instagram est de 150 caractères, emojis inclus.',
    },
    de: {
      title: 'Instagram Bio Generator',
      subtitle: 'Generiere Instagram-Bios in verschiedenen Stilen, die dein bestes Ich zeigen',
      name: 'Name / Marke',
      namePlaceholder: 'z.B. Max Mustermann',
      profession: 'Beruf / Beschreibung',
      professionPlaceholder: 'z.B. UX Designer & Reiseblogger',
      keywords: 'Schlüsselwörter / Fähigkeiten',
      keywordsPlaceholder: 'z.B. Design, Fotografie, Reisen',
      cta: 'CTA / Link-Text',
      ctaPlaceholder: 'z.B. 👇 Mein Portfolio ansehen',
      emojiStyle: 'Emoji-Stil',
      styleSimple: 'Sauber & Minimalistisch',
      styleProfessional: 'Professionell',
      stylePersonality: 'Lustig & Persönlichkeit',
      generate: 'Bios generieren',
      charLimit: '150-Zeichen-Limit',
      copy: 'Kopieren',
      copied: 'Kopiert',
      editHint: 'Klicken zum Bearbeiten',
      placeholderText: 'Geben Sie Ihren Namen und Beruf ein, um Instagram-Bios zu generieren.',
      disclaimer: 'Das Instagram-Bio-Limit beträgt 150 Zeichen, einschließlich Emojis.',
    },
    ar: {
      title: 'مولد نبذة Instagram',
      subtitle: 'أنشئ أنواعاً متعددة من نبذات Instagram التي تُبرز أفضل ما فيك',
      name: 'الاسم / العلامة التجارية',
      namePlaceholder: 'مثال: أحمد العلي',
      profession: 'المهنة / الوصف',
      professionPlaceholder: 'مثال: مصمم UX ومدوّن سياحي',
      keywords: 'كلمات مفتاحية / مهارات',
      keywordsPlaceholder: 'مثال: تصميم، تصوير، سفر',
      cta: 'CTA / نص الرابط',
      ctaPlaceholder: 'مثال: 👇 شاهد أعمالي',
      emojiStyle: 'أسلوب الإيموجي',
      styleSimple: 'نظيف ومبسط',
      styleProfessional: 'احترافي',
      stylePersonality: 'ممتع وشخصية',
      generate: 'إنشاء النبذات',
      charLimit: 'حد 150 حرفاً',
      copy: 'نسخ',
      copied: 'تم النسخ',
      editHint: 'انقر للتعديل',
      placeholderText: 'أدخل اسمك ومهنتك لإنشاء نبذات Instagram.',
      disclaimer: 'حد نبذة Instagram هو 150 حرفاً بما في ذلك الإيموجي.',
    },
    ko: {
      title: 'Instagram 소개 생성기',
      subtitle: '당신의 최고를 보여주는 다양한 스타일의 Instagram 소개를 생성하세요',
      name: '이름 / 브랜드',
      namePlaceholder: '예: 김민지',
      profession: '직업 / 설명',
      professionPlaceholder: '예: UX 디자이너 & 여행 블로거',
      keywords: '키워드 / 기술',
      keywordsPlaceholder: '예: 디자인, 사진, 여행',
      cta: 'CTA / 링크 텍스트',
      ctaPlaceholder: '예: 👇 포트폴리오 보기',
      emojiStyle: '이모지 스타일',
      styleSimple: '깔끔 & 미니멀',
      styleProfessional: '전문적',
      stylePersonality: '재미 & 개성',
      generate: '소개 생성',
      charLimit: '150자 제한',
      copy: '복사',
      copied: '✓ 복사됨',
      editHint: '클릭하여 편집',
      placeholderText: '이름과 직업을 입력하여 Instagram 소개를 생성하세요.',
      disclaimer: 'Instagram 소개 제한은 이모지 포함 150자입니다.',
    },
    ru: {
      title: 'Генератор Bio Instagram',
      subtitle: 'Создавайте Instagram-биографии в разных стилях, демонстрируя лучшее в себе',
      name: 'Имя / Бренд',
      namePlaceholder: 'напр. Анна Иванова',
      profession: 'Профессия / Описание',
      professionPlaceholder: 'напр. UX-дизайнер и тревел-блогер',
      keywords: 'Ключевые слова / Навыки',
      keywordsPlaceholder: 'напр. дизайн, фотография, путешествия',
      cta: 'CTA / Текст ссылки',
      ctaPlaceholder: 'напр. 👇 Смотри мое портфолио',
      emojiStyle: 'Стиль эмодзи',
      styleSimple: 'Чистый и минималистичный',
      styleProfessional: 'Профессиональный',
      stylePersonality: 'Веселый и с характером',
      generate: 'Генерировать Bio',
      charLimit: 'Лимит 150 символов',
      copy: 'Копировать',
      copied: 'Скопировано',
      editHint: 'Нажмите для редактирования',
      placeholderText: 'Введите ваше имя и профессию для создания Instagram-биографий.',
      disclaimer: 'Лимит bio Instagram — 150 символов, включая эмодзи.',
    },
  };

  const l = $derived(I18N_BACKUP[locale] || I18N_BACKUP['en']);

  let name = $state('');
  let profession = $state('');
  let keywords = $state('');
  let cta = $state('');
  let emojiStyle = $state('personality');

  const EMOJI_PRESETS: Record<string, { bullets: string[]; accent: string }> = {
    simple: { bullets: ['·', '·', '·'], accent: '' },
    professional: { bullets: ['▸', '✦', '›'], accent: '💼' },
    personality: { bullets: ['✨', '🌟', '💫'], accent: '🌈' },
  };

  function truncate(text: string, max: number) {
    return text.length > max ? text.slice(0, max - 1) + '…' : text;
  }

  function generateBios(n: string, p: string, kw: string, ct: string, style: string): string[] {
    const kwList = kw.split(',').map(k => k.trim()).filter(Boolean);
    const preset = EMOJI_PRESETS[style] || EMOJI_PRESETS['personality'];

    const kwStr = kwList.slice(0, 3).join(' · ');
    const kwEmoji = kwList.slice(0, 3).map((k, i) => `${preset.bullets[i % preset.bullets.length]} ${k}`).join(' ');

    const bios: string[] = [];

    // Style A: Clean & minimal
    bios.push(truncate([n && `${n} ${preset.accent}`, p, kwStr, ct].filter(Boolean).join('\n'), 150));

    // Style B: Professional
    bios.push(truncate([`${p}${n ? ` | ${n}` : ''}`, kwEmoji, ct].filter(Boolean).join('\n'), 150));

    // Style C: Personality
    const emojiMap: Record<string, string> = { design: '🎨', photo: '📸', travel: '✈️', food: '🍕', fitness: '💪', music: '🎵', tech: '💻', write: '✍️' };
    const autoEmoji = kwList.map(k => {
      const match = Object.keys(emojiMap).find(key => k.toLowerCase().includes(key));
      return match ? emojiMap[match] : '⚡';
    }).slice(0, 3).join('');

    bios.push(truncate([`${n || p} ${autoEmoji}`, `${p}`, kwStr, ct].filter(Boolean).join('\n'), 150));

    return bios;
  }

  const bios = $derived((() => {
    if (!name.trim() && !profession.trim()) return [];
    return generateBios(name.trim(), profession.trim(), keywords, cta.trim(), emojiStyle);
  })());

  let editedBios = $state<string[]>([]);
  $effect(() => {
    if (bios.length > 0) editedBios = [...bios];
  });

  const styleLabels = $derived([l.styleSimple, l.styleProfessional, l.stylePersonality]);

  let copiedIndex = $state<number | null>(null);
  function copyBio(text: string, idx: number) {
    navigator.clipboard.writeText(text).then(() => {
      copiedIndex = idx;
      setTimeout(() => (copiedIndex = null), 1500);
    });
  }

  function charColor(len: number) {
    if (len > 150) return 'text-red-400';
    if (len > 130) return 'text-yellow-400';
    return 'text-pink-400';
  }
</script>

<div class="bg-stone-950 text-stone-100 p-6 rounded-2xl border border-stone-800 shadow-2xl font-sans min-h-[400px]">
  <!-- Header -->
  <div class="flex items-center gap-3 mb-6">
    <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-400 to-rose-700 flex items-center justify-center text-stone-950 font-black text-lg">
      📸
    </div>
    <div>
      <h2 class="font-extrabold text-lg bg-gradient-to-r from-pink-300 via-rose-100 to-pink-400 bg-clip-text text-transparent leading-tight">
        {l.title}
      </h2>
      <p class="text-stone-500 text-xs mt-0.5">{l.subtitle}</p>
    </div>
  </div>

  <!-- Content Grid -->
  <div class="grid grid-cols-1 md:grid-cols-12 gap-6">
    <!-- Left Panel: Inputs -->
    <div class="md:col-span-5 space-y-4">
      <div class="grid grid-cols-2 gap-3">
        <label class="block">
          <span class="text-xs text-stone-400 mb-1.5 block">{l.name}</span>
          <input type="text" bind:value={name} placeholder={l.namePlaceholder}
            class="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-2 text-sm text-stone-100 focus:border-pink-500 focus:outline-none transition-colors" />
        </label>
        <label class="block">
          <span class="text-xs text-stone-400 mb-1.5 block">{l.emojiStyle}</span>
          <select bind:value={emojiStyle}
            class="w-full bg-stone-900 border border-stone-700 rounded-lg px-2 py-2.5 text-xs text-stone-200 cursor-pointer focus:border-pink-500 focus:outline-none transition-colors">
            <option value="simple">{l.styleSimple}</option>
            <option value="professional">{l.styleProfessional}</option>
            <option value="personality">{l.stylePersonality}</option>
          </select>
        </label>
      </div>

      <label class="block">
        <span class="text-xs text-stone-400 mb-1.5 block">{l.profession}</span>
        <input type="text" bind:value={profession} placeholder={l.professionPlaceholder}
          class="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-2 text-sm text-stone-100 focus:border-pink-500 focus:outline-none transition-colors" />
      </label>

      <label class="block">
        <span class="text-xs text-stone-400 mb-1.5 block">{l.keywords}</span>
        <input type="text" bind:value={keywords} placeholder={l.keywordsPlaceholder}
          class="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-2 text-sm text-stone-100 focus:border-pink-500 focus:outline-none transition-colors" />
      </label>

      <label class="block">
        <span class="text-xs text-stone-400 mb-1.5 block">{l.cta}</span>
        <input type="text" bind:value={cta} placeholder={l.ctaPlaceholder}
          class="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-2 text-sm text-stone-100 focus:border-pink-500 focus:outline-none transition-colors" />
      </label>
    </div>

    <!-- Right Panel: Output -->
    <div class="md:col-span-7 flex flex-col gap-4">
      {#if editedBios.length > 0}
        {#each editedBios as bio, idx}
          <div class="bg-stone-900 border border-stone-800 rounded-xl p-4 hover:border-pink-500/30 transition-all">
            <div class="flex items-center justify-between mb-2">
              <span class="text-xxs text-pink-400 font-semibold">{styleLabels[idx]}</span>
              <div class="flex items-center gap-2">
                <span class="{charColor(bio.length)} text-xxs font-mono">{bio.length}/150</span>
                <button
                  type="button"
                  onclick={() => copyBio(bio, idx)}
                  class="text-stone-500 hover:text-stone-300 text-xs px-2 py-0.5 rounded border border-stone-800 hover:border-stone-700 transition-all"
                >
                  {copiedIndex === idx ? l.copied : l.copy}
                </button>
              </div>
            </div>
            <!-- Editable bio -->
            <textarea
              bind:value={editedBios[idx]}
              rows="3"
              maxlength="150"
              class="w-full bg-stone-950/60 border border-stone-800 rounded-lg px-3 py-2 text-sm text-stone-200 focus:border-pink-500 focus:outline-none transition-colors resize-none"
            ></textarea>
            <p class="text-xxs text-stone-600 mt-1">{l.editHint}</p>
          </div>
        {/each}
      {:else}
        <div class="h-full flex flex-col items-center justify-center text-center p-10 bg-stone-900/25 border border-dashed border-stone-800 rounded-xl min-h-[280px]">
          <div class="text-4xl mb-3">📸</div>
          <p class="text-xs text-stone-400 max-w-xs leading-relaxed">{l.placeholderText}</p>
        </div>
      {/if}

      <p class="text-xxs text-stone-600 text-center leading-relaxed">{l.disclaimer}</p>
    </div>
  </div>
</div>

<style>
  .text-xxs {
    font-size: 0.65rem;
  }
</style>
