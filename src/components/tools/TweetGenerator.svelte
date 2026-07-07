<script lang="ts">
  interface Props {
    locale?: string;
    translations?: Record<string, unknown>;
  }

  let { locale = 'en', translations = {} }: Props = $props();

  const I18N_BACKUP: Record<string, Record<string, string>> = {
    zh: {
      title: '推文生成器',
      subtitle: '一键生成高互动推文变体，掌握 280 字符的艺术',
      topic: '主题 / 想法',
      topicPlaceholder: '例如: 分享我的早晨生产力系统',
      tone: '语气',
      professional: '专业权威',
      humorous: '幽默风趣',
      motivational: '激励人心',
      question: '提问互动',
      sharing: '分享型',
      includeHashtags: '包含话题标签',
      includeCTA: '包含行动号召 (CTA)',
      threadMode: '推文线程模式',
      threadCount: '线程推文数',
      generate: '生成推文',
      variant: '变体',
      chars: '字符',
      copyTweet: '复制',
      copied: '✓ 已复制',
      placeholderText: '输入主题和语气，生成 5 个推文变体。',
      charOk: '✓ 字数OK',
      charWarn: '接近上限',
      charOver: '已超限',
      disclaimer: '推文字符限制为 280，链接统一计为 23 字符。',
    },
    en: {
      title: 'Tweet Generator',
      subtitle: 'Generate high-engagement tweet variants and master the 280-character art',
      topic: 'Topic / Idea',
      topicPlaceholder: 'e.g. Share my morning productivity system',
      tone: 'Tone',
      professional: 'Professional',
      humorous: 'Humorous',
      motivational: 'Motivational',
      question: 'Question',
      sharing: 'Sharing',
      includeHashtags: 'Include Hashtags',
      includeCTA: 'Include CTA',
      threadMode: 'Thread Mode',
      threadCount: 'Thread Tweets',
      generate: 'Generate Tweets',
      variant: 'Variant',
      chars: 'chars',
      copyTweet: 'Copy',
      copied: '✓ Copied',
      placeholderText: 'Enter a topic and tone to generate 5 tweet variants.',
      charOk: '✓ OK',
      charWarn: 'Near limit',
      charOver: 'Over limit',
      disclaimer: 'Tweet limit is 280 characters. Links count as 23 characters.',
    },
    es: {
      title: 'Generador de Tweets',
      subtitle: 'Genera variantes de tweets con alto engagement dominando los 280 caracteres',
      topic: 'Tema / Idea',
      topicPlaceholder: 'ej. Compartir mi sistema de productividad matutina',
      tone: 'Tono',
      professional: 'Profesional',
      humorous: 'Humorístico',
      motivational: 'Motivacional',
      question: 'Pregunta',
      sharing: 'Compartir',
      includeHashtags: 'Incluir Hashtags',
      includeCTA: 'Incluir CTA',
      threadMode: 'Modo Hilo',
      threadCount: 'Tweets en el Hilo',
      generate: 'Generar Tweets',
      variant: 'Variante',
      chars: 'car.',
      copyTweet: 'Copiar',
      copied: '✓ Copiado',
      placeholderText: 'Ingrese un tema y tono para generar 5 variantes de tweets.',
      charOk: '✓ OK',
      charWarn: 'Cerca del límite',
      charOver: 'Límite superado',
      disclaimer: 'Límite de tweets: 280 caracteres. Los enlaces cuentan como 23 caracteres.',
    },
    pt: {
      title: 'Gerador de Tweets',
      subtitle: 'Gere variantes de tweets com alto engajamento dominando os 280 caracteres',
      topic: 'Tema / Ideia',
      topicPlaceholder: 'ex. Compartilhar meu sistema de produtividade matinal',
      tone: 'Tom',
      professional: 'Profissional',
      humorous: 'Humorístico',
      motivational: 'Motivacional',
      question: 'Pergunta',
      sharing: 'Compartilhar',
      includeHashtags: 'Incluir Hashtags',
      includeCTA: 'Incluir CTA',
      threadMode: 'Modo Thread',
      threadCount: 'Tweets na Thread',
      generate: 'Gerar Tweets',
      variant: 'Variante',
      chars: 'car.',
      copyTweet: 'Copiar',
      copied: '✓ Copiado',
      placeholderText: 'Insira um tema e tom para gerar 5 variantes de tweets.',
      charOk: '✓ OK',
      charWarn: 'Perto do limite',
      charOver: 'Limite excedido',
      disclaimer: 'Limite de tweets: 280 caracteres. Links contam como 23 caracteres.',
    },
    ja: {
      title: 'ツイート ジェネレーター',
      subtitle: '高エンゲージメントのツイートバリエーションを生成し、280文字の芸術をマスター',
      topic: 'テーマ / アイデア',
      topicPlaceholder: '例: 朝の生産性システムをシェア',
      tone: 'トーン',
      professional: 'プロフェッショナル',
      humorous: 'ユーモラス',
      motivational: 'モチベーショナル',
      question: '質問型',
      sharing: 'シェア型',
      includeHashtags: 'ハッシュタグを含める',
      includeCTA: 'CTAを含める',
      threadMode: 'スレッドモード',
      threadCount: 'スレッドツイート数',
      generate: 'ツイートを生成',
      variant: 'バリエーション',
      chars: '文字',
      copyTweet: 'コピー',
      copied: '✓ コピー済み',
      placeholderText: 'テーマとトーンを入力して5つのツイートバリエーションを生成します。',
      charOk: '✓ OK',
      charWarn: '上限近い',
      charOver: '上限超過',
      disclaimer: 'ツイートの上限は280文字です。リンクは23文字としてカウントされます。',
    },
    fr: {
      title: 'Générateur de Tweets',
      subtitle: 'Générez des variantes de tweets à fort engagement en maîtrisant les 280 caractères',
      topic: 'Sujet / Idée',
      topicPlaceholder: 'ex. Partager mon système de productivité matinale',
      tone: 'Ton',
      professional: 'Professionnel',
      humorous: 'Humoristique',
      motivational: 'Motivant',
      question: 'Question',
      sharing: 'Partage',
      includeHashtags: 'Inclure des Hashtags',
      includeCTA: 'Inclure un CTA',
      threadMode: 'Mode Fil',
      threadCount: 'Tweets dans le Fil',
      generate: 'Générer des Tweets',
      variant: 'Variante',
      chars: 'car.',
      copyTweet: 'Copier',
      copied: '✓ Copié',
      placeholderText: 'Entrez un sujet et un ton pour générer 5 variantes de tweets.',
      charOk: '✓ OK',
      charWarn: 'Proche de la limite',
      charOver: 'Limite dépassée',
      disclaimer: 'Limite de tweets : 280 caractères. Les liens comptent pour 23 caractères.',
    },
    de: {
      title: 'Tweet Generator',
      subtitle: 'Generiere hochwertige Tweet-Varianten und meistere die 280-Zeichen-Kunst',
      topic: 'Thema / Idee',
      topicPlaceholder: 'z.B. Mein morgendliches Produktivitätssystem teilen',
      tone: 'Ton',
      professional: 'Professionell',
      humorous: 'Humorvoll',
      motivational: 'Motivierend',
      question: 'Frage',
      sharing: 'Teilen',
      includeHashtags: 'Hashtags einschließen',
      includeCTA: 'CTA einschließen',
      threadMode: 'Thread-Modus',
      threadCount: 'Thread-Tweets',
      generate: 'Tweets generieren',
      variant: 'Variante',
      chars: 'Zeichen',
      copyTweet: 'Kopieren',
      copied: '✓ Kopiert',
      placeholderText: 'Geben Sie ein Thema und einen Ton ein, um 5 Tweet-Varianten zu generieren.',
      charOk: '✓ OK',
      charWarn: 'Nah am Limit',
      charOver: 'Limit überschritten',
      disclaimer: 'Tweet-Limit: 280 Zeichen. Links zählen als 23 Zeichen.',
    },
    ar: {
      title: 'مولد التغريدات',
      subtitle: 'أنشئ أشكالاً متعددة من التغريدات عالية التفاعل وأتقن فن 280 حرفاً',
      topic: 'الموضوع / الفكرة',
      topicPlaceholder: 'مثال: مشاركة نظام الإنتاجية الصباحي',
      tone: 'الأسلوب',
      professional: 'احترافي',
      humorous: 'فكاهي',
      motivational: 'تحفيزي',
      question: 'سؤال',
      sharing: 'مشاركة',
      includeHashtags: 'تضمين الهاشتاقات',
      includeCTA: 'تضمين CTA',
      threadMode: 'وضع الخيط',
      threadCount: 'تغريدات الخيط',
      generate: 'إنشاء التغريدات',
      variant: 'النموذج',
      chars: 'حرف',
      copyTweet: 'نسخ',
      copied: '✓ تم النسخ',
      placeholderText: 'أدخل موضوعاً وأسلوباً لإنشاء 5 أشكال من التغريدات.',
      charOk: '✓ جيد',
      charWarn: 'قريب من الحد',
      charOver: 'تجاوز الحد',
      disclaimer: 'حد التغريدة: 280 حرفاً. الروابط تُحتسب كـ 23 حرفاً.',
    },
    ko: {
      title: '트윗 생성기',
      subtitle: '고참여도 트윗 변형을 생성하고 280자의 예술을 마스터하세요',
      topic: '주제 / 아이디어',
      topicPlaceholder: '예: 아침 생산성 시스템 공유',
      tone: '어조',
      professional: '전문적',
      humorous: '유머러스',
      motivational: '동기부여',
      question: '질문형',
      sharing: '공유형',
      includeHashtags: '해시태그 포함',
      includeCTA: 'CTA 포함',
      threadMode: '스레드 모드',
      threadCount: '스레드 트윗 수',
      generate: '트윗 생성',
      variant: '변형',
      chars: '자',
      copyTweet: '복사',
      copied: '✓ 복사됨',
      placeholderText: '주제와 어조를 입력하여 5개의 트윗 변형을 생성하세요.',
      charOk: '✓ OK',
      charWarn: '한도 근접',
      charOver: '한도 초과',
      disclaimer: '트윗 한도는 280자입니다. 링크는 23자로 계산됩니다.',
    },
    ru: {
      title: 'Генератор Твитов',
      subtitle: 'Создавайте высокоэффективные варианты твитов и освойте искусство 280 символов',
      topic: 'Тема / Идея',
      topicPlaceholder: 'напр. Поделиться своей системой утренней продуктивности',
      tone: 'Тон',
      professional: 'Профессиональный',
      humorous: 'Юмористический',
      motivational: 'Мотивирующий',
      question: 'Вопрос',
      sharing: 'Поделиться',
      includeHashtags: 'Включить хэштеги',
      includeCTA: 'Включить CTA',
      threadMode: 'Режим Треда',
      threadCount: 'Твиты в Треде',
      generate: 'Генерировать твиты',
      variant: 'Вариант',
      chars: 'симв.',
      copyTweet: 'Копировать',
      copied: '✓ Скопировано',
      placeholderText: 'Введите тему и тон для генерации 5 вариантов твитов.',
      charOk: '✓ OK',
      charWarn: 'Близко к лимиту',
      charOver: 'Лимит превышен',
      disclaimer: 'Лимит твита: 280 символов. Ссылки считаются как 23 символа.',
    },
  };

  const l = $derived(I18N_BACKUP[locale] || I18N_BACKUP['en']);

  let topic = $state('');
  let tone = $state('professional');
  let includeHashtags = $state(true);
  let includeCTA = $state(false);
  let threadMode = $state(false);

  const TONE_TEMPLATES: Record<string, ((t: string, hashtags: boolean, cta: boolean) => string)[]> = {
    professional: [
      (t, h, c) => `Just shared insights on ${t}. The key takeaway: consistency beats perfection every time.${h ? ' #productivity #growth' : ''}${c ? "\n\n→ What's your approach?" : ''}`,
      (t, h, c) => `3 things I learned from ${t}:\n\n1. Start small\n2. Track progress\n3. Iterate often${h ? '\n\n#leadership #learning' : ''}${c ? '\n\nWhich resonates most?' : ''}`,
      (t, h, c) => `The truth about ${t} that nobody talks about: it's not about talent, it's about systems.${h ? ' #mindset #success' : ''}`,
      (t, h, c) => `If you're struggling with ${t}, remember: every expert was once a beginner.${h ? ' #growth #career' : ''}${c ? '\n\nSave this for later. 🔖' : ''}`,
      (t, h, c) => `Unpopular opinion: ${t} is one of the most underrated skills in 2024.${h ? '\n\n#skills #future' : ''}${c ? '\n\nAm I wrong? Drop your thoughts below 👇' : ''}`,
    ],
    humorous: [
      (t, h, c) => `Me: I have a plan for ${t}.\nAlso me at 2am: *googles everything from scratch*${h ? '\n\n#relatable #procrastination' : ''}`,
      (t, h, c) => `Hot take: ${t} is just adulting with extra steps.${h ? ' #adulting #real' : ''}${c ? '\n\nTag someone who needs to hear this 😂' : ''}`,
      (t, h, c) => `Nobody:\nAbsolutely nobody:\nMe every morning: "Today I will finally master ${t}."${h ? '\n\n#goals #wishfulthinking' : ''}`,
      (t, h, c) => `${t} tutorial: Step 1: Google it. Step 2: Stack Overflow. Step 3: Give up and ask Twitter.${h ? ' #dev #humor' : ''}`,
      (t, h, c) => `I told myself I'd spend 30 minutes on ${t}. That was 4 hours ago.${h ? ' #timeflies #hyperfocus' : ''}${c ? '\n\nAnyone else? 🙋' : ''}`,
    ],
    motivational: [
      (t, h, c) => `Your journey with ${t} is unique. Stop comparing your chapter 1 to someone's chapter 20. Keep going. 💪${h ? '\n\n#motivation #mindset' : ''}`,
      (t, h, c) => `Every day you work on ${t}, you're becoming someone your past self would be proud of.${h ? ' #growthmindset #progress' : ''}${c ? '\n\nBelieve in the process 🙌' : ''}`,
      (t, h, c) => `The best time to start ${t} was yesterday. The second best time? Right now.${h ? '\n\n#startnow #inspiration' : ''}`,
      (t, h, c) => `Success with ${t} isn't about being perfect. It's about showing up when you don't feel like it.${h ? ' #discipline #success' : ''}${c ? '\n\nDouble tap if you agree ❤️' : ''}`,
      (t, h, c) => `Reminder: You are closer to your ${t} goals than you think. Don't stop now.${h ? ' #keepgoing #believe' : ''}`,
    ],
    question: [
      (t, h, c) => `What's the ONE thing about ${t} you wish you'd learned earlier?${h ? '\n\n#learning #community' : ''}${c ? '\n\nDrop your answer below 👇' : ''}`,
      (t, h, c) => `Controversial question: Is ${t} overrated or underrated in today's world?${h ? ' #debate #opinion' : ''}`,
      (t, h, c) => `Quick poll: How long did it take you to feel confident with ${t}?\n\n□ < 1 month\n□ 1-6 months\n□ 1+ year\n□ Still waiting 😅${h ? '\n\n#poll #learning' : ''}`,
      (t, h, c) => `If you could give ONE piece of advice about ${t} to your younger self, what would it be?${h ? '\n\n#wisdom #advice' : ''}`,
      (t, h, c) => `Be honest: do you actually know how to do ${t} properly, or are you just figuring it out as you go?${h ? ' #real #honesty' : ''}${c ? '\n\nRT if relatable 😂' : ''}`,
    ],
    sharing: [
      (t, h, c) => `I've been diving deep into ${t} lately and wanted to share what I found. Thread 🧵${h ? '\n\n#knowledge #sharing' : ''}`,
      (t, h, c) => `Just published my notes on ${t}. Free for everyone — link in bio.${h ? ' #freestuff #learning' : ''}${c ? '\n\n📌 Save this post!' : ''}`,
      (t, h, c) => `A resource that completely changed how I think about ${t}. Sharing because it's too good to keep to myself.${h ? '\n\n#resources #community' : ''}`,
      (t, h, c) => `Here's my ${t} workflow that saves me 2+ hours per week. Bookmark this. 🔖${h ? '\n\n#productivity #tips' : ''}`,
      (t, h, c) => `After months of experimenting with ${t}, here's what actually works (and what doesn't).${h ? ' #honest #experience' : ''}${c ? '\n\nLet me know if you want more like this!' : ''}`,
    ],
  };

  const tweets = $derived((() => {
    const t = topic.trim();
    if (!t) return [];
    const templates = TONE_TEMPLATES[tone] || TONE_TEMPLATES['professional'];
    return templates.map(fn => fn(t, includeHashtags, includeCTA));
  })());

  const threadTweets = $derived((() => {
    if (!threadMode || !topic.trim()) return [];
    const t = topic.trim();
    return [
      `1/ Let me share everything I know about ${t}. ${includeHashtags ? '#thread' : ''}`,
      `2/ First, the fundamentals. ${t} requires understanding three core principles: consistency, clarity, and commitment.`,
      `3/ Here's the framework that works for me with ${t}:\n\n→ Start with the basics\n→ Build a system\n→ Review and iterate\n\n${includeCTA ? 'Follow for more insights. 🔔' : 'End of thread.'}`,
    ];
  })());

  let copiedIndex = $state<number | null>(null);
  function copyTweet(text: string, idx: number) {
    navigator.clipboard.writeText(text).then(() => {
      copiedIndex = idx;
      setTimeout(() => (copiedIndex = null), 1500);
    });
  }

  function charStatus(text: string) {
    const len = text.length;
    if (len > 280) return { color: 'text-red-400', bg: 'bg-red-500', label: l.charOver };
    if (len > 240) return { color: 'text-yellow-400', bg: 'bg-yellow-500', label: l.charWarn };
    return { color: 'text-emerald-400', bg: 'bg-emerald-500', label: l.charOk };
  }
</script>

<div class="tool-theme-shell p-6 rounded-2xl font-sans min-h-[400px]">
  <!-- Header -->
  <div class="flex items-center gap-3 mb-6">
    <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-400 to-sky-700 flex items-center justify-center text-stone-950 font-black text-lg">
      𝕏
    </div>
    <div>
      <h2 class="font-extrabold text-lg text-sky-700 dark:bg-gradient-to-r dark:from-sky-300 dark:via-sky-100 dark:to-sky-400 dark:bg-clip-text dark:text-transparent leading-tight">
        {l.title}
      </h2>
      <p class="text-stone-500 text-xs mt-0.5">{l.subtitle}</p>
    </div>
  </div>

  <!-- Content Grid -->
  <div class="grid grid-cols-1 md:grid-cols-12 gap-6">
    <!-- Left Panel: Inputs -->
    <div class="md:col-span-4 space-y-4">
      <label class="block">
        <span class="text-xs text-stone-400 mb-1.5 block">{l.topic}</span>
        <textarea
          bind:value={topic}
          placeholder={l.topicPlaceholder}
          rows="3"
          class="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-2 text-sm text-stone-100 focus:border-sky-500 focus:outline-none transition-colors resize-none"
        ></textarea>
      </label>

      <label class="block">
        <span class="text-xs text-stone-400 mb-1.5 block">{l.tone}</span>
        <select
          bind:value={tone}
          class="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-2.5 text-sm text-stone-200 cursor-pointer focus:border-sky-500 focus:outline-none transition-colors"
        >
          <option value="professional">{l.professional}</option>
          <option value="humorous">{l.humorous}</option>
          <option value="motivational">{l.motivational}</option>
          <option value="question">{l.question}</option>
          <option value="sharing">{l.sharing}</option>
        </select>
      </label>

      <div class="space-y-2">
        {#each [{ key: 'includeHashtags', label: l.includeHashtags, state: includeHashtags, set: (v: boolean) => (includeHashtags = v) }, { key: 'includeCTA', label: l.includeCTA, state: includeCTA, set: (v: boolean) => (includeCTA = v) }, { key: 'threadMode', label: l.threadMode, state: threadMode, set: (v: boolean) => (threadMode = v) }] as opt}
          <button
            type="button"
            onclick={() => opt.set(!opt.state)}
            class="w-full flex items-center justify-between px-3 py-2 rounded-lg border transition-all {opt.state ? 'bg-sky-950/40 border-sky-600 text-sky-300' : 'bg-stone-900 border-stone-800 text-stone-400 hover:border-stone-700'}"
          >
            <span class="text-xs font-medium">{opt.label}</span>
            <span class="text-xs font-bold">{opt.state ? '✓' : '○'}</span>
          </button>
        {/each}
      </div>
    </div>

    <!-- Right Panel: Output -->
    <div class="md:col-span-8 flex flex-col gap-3">
      {#if threadMode && threadTweets.length > 0}
        <div class="space-y-2">
          {#each threadTweets as tweet, idx}
            {@const st = charStatus(tweet)}
            <div class="bg-stone-900 border border-stone-800 rounded-xl p-3 hover:border-sky-500/30 transition-all group">
              <div class="flex items-center justify-between mb-2">
                <span class="text-xxs text-sky-500 font-semibold">{idx + 1}/3</span>
                <div class="flex items-center gap-2">
                  <span class="text-xxs {st.color}">{tweet.length}/280</span>
                  <button
                    type="button"
                    onclick={() => copyTweet(tweet, 100 + idx)}
                    class="text-stone-500 hover:text-stone-300 text-xs px-2 py-0.5 rounded border border-stone-800 hover:border-stone-700 transition-all"
                  >
                    {copiedIndex === 100 + idx ? l.copied : l.copyTweet}
                  </button>
                </div>
              </div>
              <div class="h-1 bg-stone-800 rounded-full mb-2 overflow-hidden">
                <div class="{st.bg} h-full rounded-full transition-all" style="width:{Math.min(100,(tweet.length/280)*100)}%"></div>
              </div>
              <p class="text-stone-200 text-xs leading-relaxed whitespace-pre-line">{tweet}</p>
            </div>
          {/each}
        </div>
      {:else if tweets.length > 0}
        <div class="space-y-2">
          {#each tweets as tweet, idx}
            {@const st = charStatus(tweet)}
            <div class="bg-stone-900 border border-stone-800 rounded-xl p-3 hover:border-sky-500/30 transition-all group">
              <div class="flex items-center justify-between mb-2">
                <span class="text-xxs text-sky-500 font-semibold">{l.variant} {idx + 1}</span>
                <div class="flex items-center gap-2">
                  <span class="text-xxs {st.color}">{tweet.length}/280 · {st.label}</span>
                  <button
                    type="button"
                    onclick={() => copyTweet(tweet, idx)}
                    class="text-stone-500 hover:text-stone-300 text-xs px-2 py-0.5 rounded border border-stone-800 hover:border-stone-700 transition-all"
                  >
                    {copiedIndex === idx ? l.copied : l.copyTweet}
                  </button>
                </div>
              </div>
              <div class="h-1 bg-stone-800 rounded-full mb-2 overflow-hidden">
                <div class="{st.bg} h-full rounded-full transition-all" style="width:{Math.min(100,(tweet.length/280)*100)}%"></div>
              </div>
              <p class="text-stone-200 text-xs leading-relaxed whitespace-pre-line">{tweet}</p>
            </div>
          {/each}
        </div>
      {:else}
        <div class="h-full flex flex-col items-center justify-center text-center p-10 bg-stone-900/25 border border-dashed border-stone-800 rounded-xl min-h-[280px]">
          <div class="text-4xl mb-3">𝕏</div>
          <p class="text-xs text-stone-400 max-w-xs leading-relaxed">{l.placeholderText}</p>
        </div>
      {/if}

      <p class="text-xxs text-stone-600 text-center leading-relaxed mt-1">{l.disclaimer}</p>
    </div>
  </div>
</div>

<style>
  .text-xxs {
    font-size: 0.65rem;
  }
</style>
