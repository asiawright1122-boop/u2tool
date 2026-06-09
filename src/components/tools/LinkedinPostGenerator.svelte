<script lang="ts">
  interface Props {
    locale?: string;
    translations?: Record<string, unknown>;
  }

  let { locale = 'en', translations = {} }: Props = $props();

  const I18N_BACKUP: Record<string, Record<string, string>> = {
    zh: {
      title: 'LinkedIn 帖子生成器',
      subtitle: '生成专业 LinkedIn 帖子，建立个人品牌，扩展职业影响力',
      postTopic: '帖子主题',
      postTopicPlaceholder: '例如: 远程工作的高效协作策略',
      perspective: '个人经历 / 观点',
      perspectivePlaceholder: '例如: 我们团队从线下转型为远程后的真实心得',
      audience: '目标受众',
      audiencePlaceholder: '例如: 技术团队管理者、创业者',
      goal: '帖子目标',
      goalKnowledge: '分享知识',
      goalRecruit: '招募人才',
      goalBrand: '品牌建设',
      hookLabel: '钩子句',
      bodyLabel: '正文',
      ctaLabel: '行动号召',
      tagsLabel: '推荐标签',
      short: '简短版',
      medium: '标准版',
      long: '深度版',
      chars: '字符',
      charRecommend: '建议 1300 字符内',
      copy: '复制',
      copied: '✓ 已复制',
      placeholderText: '填写主题和观点，生成多长度 LinkedIn 帖子。',
      disclaimer: '建议在 1300 字符内，专业语气校验已启用，避免过于随意的表达。',
    },
    en: {
      title: 'LinkedIn Post Generator',
      subtitle: 'Generate professional LinkedIn posts that build your personal brand and thought leadership',
      postTopic: 'Post Topic',
      postTopicPlaceholder: 'e.g. Effective collaboration strategies for remote teams',
      perspective: 'Personal Experience / Perspective',
      perspectivePlaceholder: 'e.g. Real lessons from our team transitioning to fully remote work',
      audience: 'Target Audience',
      audiencePlaceholder: 'e.g. Tech team managers, startup founders',
      goal: 'Post Goal',
      goalKnowledge: 'Share Knowledge',
      goalRecruit: 'Recruit',
      goalBrand: 'Brand Building',
      hookLabel: 'Hook',
      bodyLabel: 'Body',
      ctaLabel: 'Call to Action',
      tagsLabel: 'Suggested Tags',
      short: 'Short',
      medium: 'Standard',
      long: 'Deep Dive',
      chars: 'chars',
      charRecommend: 'Recommended under 1300 chars',
      copy: 'Copy',
      copied: '✓ Copied',
      placeholderText: 'Fill in your topic and perspective to generate multi-length LinkedIn posts.',
      disclaimer: 'Recommended within 1300 characters for best engagement. Professional tone enforced.',
    },
    es: {
      title: 'Generador de Posts para LinkedIn',
      subtitle: 'Genera posts profesionales de LinkedIn que construyen tu marca personal',
      postTopic: 'Tema del Post',
      postTopicPlaceholder: 'ej. Estrategias de colaboración efectivas para equipos remotos',
      perspective: 'Experiencia Personal / Perspectiva',
      perspectivePlaceholder: 'ej. Lecciones reales de nuestra transición a trabajo remoto completo',
      audience: 'Audiencia Objetivo',
      audiencePlaceholder: 'ej. Gerentes de equipos tech, fundadores de startups',
      goal: 'Objetivo del Post',
      goalKnowledge: 'Compartir Conocimiento',
      goalRecruit: 'Reclutar',
      goalBrand: 'Construir Marca',
      hookLabel: 'Gancho',
      bodyLabel: 'Cuerpo',
      ctaLabel: 'Llamada a la Acción',
      tagsLabel: 'Etiquetas Sugeridas',
      short: 'Corto',
      medium: 'Estándar',
      long: 'En Profundidad',
      chars: 'car.',
      charRecommend: 'Recomendado menos de 1300 car.',
      copy: 'Copiar',
      copied: '✓ Copiado',
      placeholderText: 'Complete el tema y la perspectiva para generar posts de LinkedIn.',
      disclaimer: 'Recomendado menos de 1300 caracteres para mejor engagement. Tono profesional aplicado.',
    },
    pt: {
      title: 'Gerador de Posts do LinkedIn',
      subtitle: 'Gere posts profissionais no LinkedIn que constroem sua marca pessoal',
      postTopic: 'Tema do Post',
      postTopicPlaceholder: 'ex. Estratégias de colaboração eficazes para equipes remotas',
      perspective: 'Experiência Pessoal / Perspectiva',
      perspectivePlaceholder: 'ex. Lições reais da nossa transição para trabalho remoto total',
      audience: 'Público-Alvo',
      audiencePlaceholder: 'ex. Gerentes de equipes de tecnologia, fundadores de startups',
      goal: 'Objetivo do Post',
      goalKnowledge: 'Compartilhar Conhecimento',
      goalRecruit: 'Recrutar',
      goalBrand: 'Construir Marca',
      hookLabel: 'Gancho',
      bodyLabel: 'Corpo',
      ctaLabel: 'Chamada à Ação',
      tagsLabel: 'Tags Sugeridas',
      short: 'Curto',
      medium: 'Padrão',
      long: 'Em Profundidade',
      chars: 'car.',
      charRecommend: 'Recomendado menos de 1300 car.',
      copy: 'Copiar',
      copied: 'Copiado',
      placeholderText: 'Preencha o tema e a perspectiva para gerar posts do LinkedIn.',
      disclaimer: 'Recomendado menos de 1300 caracteres para melhor engajamento.',
    },
    ja: {
      title: 'LinkedIn 投稿ジェネレーター',
      subtitle: 'パーソナルブランドとソートリーダーシップを構築するプロのLinkedIn投稿を生成',
      postTopic: '投稿のトピック',
      postTopicPlaceholder: '例: リモートチームのための効果的なコラボレーション戦略',
      perspective: '個人的な経験 / 視点',
      perspectivePlaceholder: '例: 完全リモートへの移行から得たリアルな教訓',
      audience: 'ターゲット読者',
      audiencePlaceholder: '例: テックチームマネージャー、スタートアップ創業者',
      goal: '投稿の目的',
      goalKnowledge: '知識を共有',
      goalRecruit: '採用',
      goalBrand: 'ブランド構築',
      hookLabel: 'フック文',
      bodyLabel: '本文',
      ctaLabel: 'アクションの呼びかけ',
      tagsLabel: 'おすすめタグ',
      short: '短い',
      medium: '標準',
      long: '詳細',
      chars: '文字',
      charRecommend: '1300文字以内を推奨',
      copy: 'コピー',
      copied: 'コピーしました',
      placeholderText: 'トピックと視点を入力して複数の長さのLinkedIn投稿を生成します。',
      disclaimer: '最高のエンゲージメントには1300文字以内を推奨。プロフェッショナルなトーンが適用されます。',
    },
    fr: {
      title: 'Générateur de Posts LinkedIn',
      subtitle: 'Générez des posts LinkedIn professionnels qui renforcent votre marque personnelle',
      postTopic: 'Sujet du Post',
      postTopicPlaceholder: 'ex. Stratégies de collaboration efficaces pour les équipes distantes',
      perspective: 'Expérience Personnelle / Perspective',
      perspectivePlaceholder: 'ex. Leçons réelles de notre transition vers le travail entièrement à distance',
      audience: 'Audience Cible',
      audiencePlaceholder: 'ex. Responsables d\'équipes tech, fondateurs de startups',
      goal: 'Objectif du Post',
      goalKnowledge: 'Partager des Connaissances',
      goalRecruit: 'Recruter',
      goalBrand: 'Construction de Marque',
      hookLabel: 'Accroche',
      bodyLabel: 'Corps',
      ctaLabel: 'Appel à l\'Action',
      tagsLabel: 'Tags Suggérés',
      short: 'Court',
      medium: 'Standard',
      long: 'Approfondi',
      chars: 'car.',
      charRecommend: 'Recommandé moins de 1300 car.',
      copy: 'Copier',
      copied: 'Copié',
      placeholderText: 'Renseignez le sujet et la perspective pour générer des posts LinkedIn.',
      disclaimer: 'Recommandé sous 1300 caractères pour meilleur engagement. Ton professionnel appliqué.',
    },
    de: {
      title: 'LinkedIn Beitrags-Generator',
      subtitle: 'Generiere professionelle LinkedIn-Beiträge, die deine Marke und Meinungsführerschaft aufbauen',
      postTopic: 'Beitragsthema',
      postTopicPlaceholder: 'z.B. Effektive Kollaborationsstrategien für Remote-Teams',
      perspective: 'Persönliche Erfahrung / Perspektive',
      perspectivePlaceholder: 'z.B. Echte Erkenntnisse aus unserem Übergang zur vollständigen Remote-Arbeit',
      audience: 'Zielgruppe',
      audiencePlaceholder: 'z.B. Tech-Team-Manager, Startup-Gründer',
      goal: 'Beitragsziel',
      goalKnowledge: 'Wissen teilen',
      goalRecruit: 'Rekrutieren',
      goalBrand: 'Markenaufbau',
      hookLabel: 'Aufhänger',
      bodyLabel: 'Text',
      ctaLabel: 'Handlungsaufforderung',
      tagsLabel: 'Vorgeschlagene Tags',
      short: 'Kurz',
      medium: 'Standard',
      long: 'Ausführlich',
      chars: 'Zeichen',
      charRecommend: 'Empfohlen unter 1300 Zeichen',
      copy: 'Kopieren',
      copied: 'Kopiert',
      placeholderText: 'Geben Sie Thema und Perspektive ein, um LinkedIn-Beiträge zu generieren.',
      disclaimer: 'Empfohlen unter 1300 Zeichen für bestes Engagement. Professioneller Ton angewendet.',
    },
    ar: {
      title: 'مولد منشورات LinkedIn',
      subtitle: 'أنشئ منشورات احترافية على LinkedIn تبني علامتك الشخصية وقيادتك الفكرية',
      postTopic: 'موضوع المنشور',
      postTopicPlaceholder: 'مثال: استراتيجيات التعاون الفعال للفرق عن بعد',
      perspective: 'التجربة الشخصية / وجهة النظر',
      perspectivePlaceholder: 'مثال: دروس حقيقية من انتقال فريقنا للعمل عن بعد بالكامل',
      audience: 'الجمهور المستهدف',
      audiencePlaceholder: 'مثال: مديرو فرق التقنية، مؤسسو الشركات الناشئة',
      goal: 'هدف المنشور',
      goalKnowledge: 'مشاركة المعرفة',
      goalRecruit: 'التوظيف',
      goalBrand: 'بناء العلامة التجارية',
      hookLabel: 'الجملة الجاذبة',
      bodyLabel: 'المحتوى',
      ctaLabel: 'الدعوة للتصرف',
      tagsLabel: 'هاشتاقات مقترحة',
      short: 'قصير',
      medium: 'قياسي',
      long: 'تعمق',
      chars: 'حرف',
      charRecommend: 'يُنصح بأقل من 1300 حرف',
      copy: 'نسخ',
      copied: 'تم النسخ',
      placeholderText: 'أدخل الموضوع ووجهة نظرك لإنشاء منشورات LinkedIn بأطوال مختلفة.',
      disclaimer: 'يُنصح بأقل من 1300 حرف لأفضل تفاعل. تم تطبيق أسلوب احترافي.',
    },
    ko: {
      title: 'LinkedIn 포스트 생성기',
      subtitle: '개인 브랜드와 사상적 리더십을 구축하는 전문 LinkedIn 포스트를 생성하세요',
      postTopic: '포스트 주제',
      postTopicPlaceholder: '예: 원격 팀을 위한 효과적인 협업 전략',
      perspective: '개인 경험 / 관점',
      perspectivePlaceholder: '예: 완전 원격으로 전환하며 얻은 실제 교훈',
      audience: '타겟 독자',
      audiencePlaceholder: '예: 기술팀 관리자, 스타트업 창업자',
      goal: '포스트 목표',
      goalKnowledge: '지식 공유',
      goalRecruit: '인재 채용',
      goalBrand: '브랜드 구축',
      hookLabel: '훅 문장',
      bodyLabel: '본문',
      ctaLabel: '행동 촉구',
      tagsLabel: '추천 태그',
      short: '짧은',
      medium: '표준',
      long: '심층',
      chars: '자',
      charRecommend: '1300자 이내 권장',
      copy: '복사',
      copied: '✓ 복사됨',
      placeholderText: '주제와 관점을 입력하여 다양한 길이의 LinkedIn 포스트를 생성하세요.',
      disclaimer: '최고의 참여율을 위해 1300자 이내 권장. 전문적인 어조 적용됨.',
    },
    ru: {
      title: 'Генератор Публикаций LinkedIn',
      subtitle: 'Создавайте профессиональные публикации LinkedIn, которые строят ваш личный бренд',
      postTopic: 'Тема Публикации',
      postTopicPlaceholder: 'напр. Эффективные стратегии совместной работы для удалённых команд',
      perspective: 'Личный Опыт / Перспектива',
      perspectivePlaceholder: 'напр. Реальные уроки нашего перехода на полностью удалённую работу',
      audience: 'Целевая Аудитория',
      audiencePlaceholder: 'напр. Менеджеры технических команд, основатели стартапов',
      goal: 'Цель Публикации',
      goalKnowledge: 'Поделиться знаниями',
      goalRecruit: 'Рекрутинг',
      goalBrand: 'Построение бренда',
      hookLabel: 'Зацепка',
      bodyLabel: 'Текст',
      ctaLabel: 'Призыв к действию',
      tagsLabel: 'Предлагаемые теги',
      short: 'Короткий',
      medium: 'Стандартный',
      long: 'Подробный',
      chars: 'симв.',
      charRecommend: 'Рекомендуется до 1300 симв.',
      copy: 'Копировать',
      copied: 'Скопировано',
      placeholderText: 'Введите тему и перспективу для создания публикаций LinkedIn разной длины.',
      disclaimer: 'Рекомендуется до 1300 символов для лучшего вовлечения. Профессиональный тон применяется.',
    },
  };

  const l = $derived(I18N_BACKUP[locale] || I18N_BACKUP['en']);

  let postTopic = $state('');
  let perspective = $state('');
  let audience = $state('');
  let goal = $state('knowledge');

  const GOAL_HASHTAGS: Record<string, string[]> = {
    knowledge: ['#learning', '#insights', '#leadership', '#growth', '#knowledge'],
    recruit: ['#hiring', '#careers', '#joinus', '#talent', '#recruitment'],
    brand: ['#personalbrand', '#thoughtleadership', '#branding', '#influence', '#community'],
  };

  function buildPost(topic: string, persp: string, aud: string, gl: string, length: 'short' | 'medium' | 'long'): string {
    const tags = GOAL_HASHTAGS[gl]?.slice(0, 4).join(' ') || '';
    const audStr = aud ? ` (especially for ${aud})` : '';

    const hooks: Record<string, string[]> = {
      knowledge: [
        `After years working with ${topic}, here's what I wish I knew earlier.`,
        `The biggest misconception about ${topic}? Most people get it backwards.`,
        `I used to think ${topic} was complicated. Then I found a better framework.`,
      ],
      recruit: [
        `We're looking for someone who truly cares about ${topic}.`,
        `Great talent is hard to find. Here's what we value on our team building ${topic}.`,
        `If you're passionate about ${topic}, I'd love to connect.`,
      ],
      brand: [
        `My take on ${topic} is probably different from what you've heard.`,
        `${topic} changed how I think about building a career. Here's why.`,
        `The honest truth about ${topic} that nobody talks about.`,
      ],
    };

    const hookList = hooks[gl] || hooks['knowledge'];
    const hook = hookList[0];

    const bodies: Record<string, Record<string, string>> = {
      short: {
        knowledge: `${hook}\n\n${persp || `Here's what consistently works:\n\n→ Focus on fundamentals\n→ Iterate quickly\n→ Share openly`}\n\n${tags}`,
        recruit: `${hook}\n\n${persp || `We need someone who can:\n\n→ Think strategically\n→ Execute efficiently\n→ Collaborate authentically`}${audStr}\n\n${tags}`,
        brand: `${hook}\n\n${persp || `Most people overcomplicate it. The reality:\n\n→ Consistency beats perfection\n→ Authenticity wins long-term\n→ Relationships are the real asset`}\n\n${tags}`,
      },
      medium: {
        knowledge: `${hook}\n\n${persp || `3 things I learned about ${topic}:`}\n\n1. Start with the why, not the how\n2. Document your failures as much as your wins\n3. Teach it — nothing accelerates learning like teaching\n\nWhat would you add to this list?${audStr}\n\n${tags}`,
        recruit: `${hook}\n\nWe're building something exciting around ${topic}, and the right person makes all the difference.\n\n${persp || 'What we offer:\n→ Meaningful work with real impact\n→ Team that challenges and supports you\n→ Room to grow into your own vision'}\n\nIf this sounds like you, let's connect.${audStr}\n\n${tags}`,
        brand: `${hook}\n\n${persp || `Here's my honest take:`}\n\nMost advice on ${topic} optimizes for the short-term. What actually works is thinking in decades, not quarters.\n\nConsistency, clarity, and genuine value — that's the real playbook.\n\nWhat's your approach?${audStr}\n\n${tags}`,
      },
      long: {
        knowledge: `${hook}\n\n${persp || `I've spent years thinking about ${topic}, and here's the framework I keep coming back to:`}\n\n▸ Foundation first\nBefore optimizing anything, you need to understand the basics deeply. Surface-level knowledge breaks under pressure.\n\n▸ Build feedback loops\nThe teams and individuals who improve fastest aren't necessarily the most talented — they're the ones who get feedback fastest and iterate.\n\n▸ Share generously\nKnowledge compounds when shared. Every post, conversation, or writeup comes back in unexpected ways.\n\nThis isn't groundbreaking. But it's what actually works.${audStr}\n\nWhat's been your biggest lesson with ${topic}?\n\n${tags}`,
        recruit: `${hook}\n\n${persp || `We've been building in the ${topic} space for a while now, and we've learned a lot about what makes the right fit.`}\n\nHere's what we DON'T care about:\n→ Perfect resume\n→ Specific degrees\n→ Years of experience alone\n\nHere's what we DO care about:\n→ Intellectual curiosity\n→ Ownership mentality\n→ Track record of shipping\n→ Genuine passion for the problem\n\nWe're growing and looking for people who want to be part of something real.${audStr}\n\nDM me if this resonates. Or share this post — you never know who needs to see it.\n\n${tags}`,
        brand: `${hook}\n\n${persp || `Let me be honest about what I got wrong about ${topic} early in my career.`}\n\nI used to think it was about:\n→ Being louder\n→ Having the perfect answer\n→ Appearing confident even when I wasn't\n\nI was wrong.\n\nWhat actually builds credibility:\n→ Admitting what you don't know\n→ Showing up consistently, not perfectly\n→ Creating genuine value before extracting it\n\nThe irony? The moment I stopped trying to appear credible, I actually became more credible.\n\n${topic} rewards authenticity. It just takes longer than most people want to wait.${audStr}\n\nDoes this match your experience?\n\n${tags}`,
      },
    };

    return (bodies[length]?.[gl] || bodies[length]?.['knowledge'] || '').trim();
  }

  const posts = $derived((() => {
    if (!postTopic.trim()) return null;
    return {
      short: buildPost(postTopic.trim(), perspective.trim(), audience.trim(), goal, 'short'),
      medium: buildPost(postTopic.trim(), perspective.trim(), audience.trim(), goal, 'medium'),
      long: buildPost(postTopic.trim(), perspective.trim(), audience.trim(), goal, 'long'),
    };
  })());

  const suggestedTags = $derived(GOAL_HASHTAGS[goal] || []);

  let copiedKey = $state<string | null>(null);
  function copyPost(text: string, key: string) {
    navigator.clipboard.writeText(text).then(() => {
      copiedKey = key;
      setTimeout(() => (copiedKey = null), 1500);
    });
  }

  function charColor(len: number) {
    if (len > 1800) return 'text-red-400';
    if (len > 1300) return 'text-yellow-400';
    return 'text-blue-400';
  }
</script>

<div class="bg-stone-950 text-stone-100 p-6 rounded-2xl border border-stone-800 shadow-2xl font-sans min-h-[400px]">
  <!-- Header -->
  <div class="flex items-center gap-3 mb-6">
    <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-400 to-blue-700 flex items-center justify-center text-stone-950 font-black text-lg">
      💼
    </div>
    <div>
      <h2 class="font-extrabold text-lg bg-gradient-to-r from-blue-300 via-blue-100 to-blue-400 bg-clip-text text-transparent leading-tight">
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
        <span class="text-xs text-stone-400 mb-1.5 block">{l.postTopic}</span>
        <input type="text" bind:value={postTopic} placeholder={l.postTopicPlaceholder}
          class="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-2 text-sm text-stone-100 focus:border-blue-500 focus:outline-none transition-colors" />
      </label>

      <label class="block">
        <span class="text-xs text-stone-400 mb-1.5 block">{l.perspective}</span>
        <textarea bind:value={perspective} placeholder={l.perspectivePlaceholder} rows="3"
          class="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-2 text-sm text-stone-100 focus:border-blue-500 focus:outline-none transition-colors resize-none"></textarea>
      </label>

      <label class="block">
        <span class="text-xs text-stone-400 mb-1.5 block">{l.audience}</span>
        <input type="text" bind:value={audience} placeholder={l.audiencePlaceholder}
          class="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-2 text-sm text-stone-100 focus:border-blue-500 focus:outline-none transition-colors" />
      </label>

      <div>
        <span class="text-xs text-stone-400 mb-1.5 block">{l.goal}</span>
        <div class="grid grid-cols-3 gap-2">
          {#each [{ key: 'knowledge', label: l.goalKnowledge }, { key: 'recruit', label: l.goalRecruit }, { key: 'brand', label: l.goalBrand }] as g}
            <button type="button" onclick={() => (goal = g.key)}
              class="py-1.5 text-xxs font-bold rounded-lg border transition-all {goal === g.key ? 'bg-blue-950/40 border-blue-600 text-blue-300' : 'bg-stone-900 border-stone-800 text-stone-400 hover:border-stone-700'}">
              {g.label}
            </button>
          {/each}
        </div>
      </div>

      <div>
        <p class="text-xxs text-stone-500 mb-1.5">{l.tagsLabel}</p>
        <div class="flex flex-wrap gap-1">
          {#each suggestedTags as tag}
            <span class="bg-blue-950/40 border border-blue-800/40 text-blue-300 text-xxs px-2 py-0.5 rounded-full">{tag}</span>
          {/each}
        </div>
      </div>
    </div>

    <!-- Right Panel: Output -->
    <div class="md:col-span-7 flex flex-col gap-3">
      {#if posts}
        {#each [{ key: 'short', label: l.short }, { key: 'medium', label: l.medium }, { key: 'long', label: l.long }] as p}
          {@const text = posts[p.key as keyof typeof posts]}
          <div class="bg-stone-900 border border-stone-800 rounded-xl p-4 hover:border-blue-500/30 transition-all">
            <div class="flex items-center justify-between mb-2">
              <span class="text-xxs text-blue-400 font-semibold uppercase tracking-wide">{p.label}</span>
              <div class="flex items-center gap-2">
                <span class="{charColor(text.length)} text-xxs">{text.length} {l.chars}</span>
                {#if text.length <= 1300}
                  <span class="text-xxs text-emerald-500">✓</span>
                {:else}
                  <span class="text-xxs text-yellow-500">↑</span>
                {/if}
                <button type="button" onclick={() => copyPost(text, p.key)}
                  class="text-stone-500 hover:text-stone-300 text-xs px-2 py-0.5 rounded border border-stone-800 hover:border-stone-700 transition-all">
                  {copiedKey === p.key ? l.copied : l.copy}
                </button>
              </div>
            </div>
            <p class="text-stone-200 text-xs leading-relaxed whitespace-pre-line max-h-40 overflow-y-auto">{text}</p>
          </div>
        {/each}
      {:else}
        <div class="h-full flex flex-col items-center justify-center text-center p-10 bg-stone-900/25 border border-dashed border-stone-800 rounded-xl min-h-[280px]">
          <div class="text-4xl mb-3">💼</div>
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
