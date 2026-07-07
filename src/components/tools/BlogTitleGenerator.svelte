<script lang="ts">
  interface Props {
    locale?: string;
    translations?: Record<string, unknown>;
  }

  let { locale = 'en', translations = {} }: Props = $props();

  const I18N_BACKUP: Record<string, Record<string, string>> = {
    zh: {
      title: '博客标题生成器',
      subtitle: '根据主题关键词与语气风格，一键生成 10-15 个引人点击的博客标题',
      topic: '主题 / 关键词',
      topicPlaceholder: '例如：提高工作效率的方法',
      audience: '目标受众（可选）',
      audiencePlaceholder: '例如：职场新人、创业者',
      tone: '标题风格',
      informative: '信息型 (Informative)',
      howto: '教程型 (How-to)',
      listicle: '列表型 (Listicle)',
      question: '问答型 (Question)',
      ultimateGuide: '终极指南型 (Ultimate Guide)',
      generate: '生成标题',
      copy: '复制',
      copied: '✓ 已复制',
      copyAll: '复制全部',
      copiedAll: '✓ 已全部复制',
      placeholderText: '请输入主题关键词，即可生成精彩博客标题。',
      disclaimer: '生成结果仅供参考，建议结合实际内容进行微调以确保真实性。',
      resultsTitle: '生成的标题建议',
      charCount: '字符数',
    },
    en: {
      title: 'Blog Title Generator',
      subtitle: 'Generate 10-15 compelling blog titles from a topic keyword and tone style',
      topic: 'Topic / Keyword',
      topicPlaceholder: 'e.g. productivity tips for remote workers',
      audience: 'Target Audience (optional)',
      audiencePlaceholder: 'e.g. entrepreneurs, beginners, marketers',
      tone: 'Title Style',
      informative: 'Informative',
      howto: 'How-to',
      listicle: 'Listicle',
      question: 'Question',
      ultimateGuide: 'Ultimate Guide',
      generate: 'Generate Titles',
      copy: 'Copy',
      copied: '✓ Copied',
      copyAll: 'Copy All',
      copiedAll: '✓ All Copied',
      placeholderText: 'Enter a topic keyword to generate compelling blog titles.',
      disclaimer: 'Results are AI-free template suggestions. Tweak them to match your actual content.',
      resultsTitle: 'Generated Title Suggestions',
      charCount: 'chars',
    },
    es: {
      title: 'Generador de Títulos para Blog',
      subtitle: 'Genera 10-15 títulos de blog atractivos a partir de una palabra clave y estilo',
      topic: 'Tema / Palabra clave',
      topicPlaceholder: 'ej. consejos de productividad para trabajadores remotos',
      audience: 'Audiencia objetivo (opcional)',
      audiencePlaceholder: 'ej. emprendedores, principiantes',
      tone: 'Estilo de Título',
      informative: 'Informativo',
      howto: 'Tutorial',
      listicle: 'Lista',
      question: 'Pregunta',
      ultimateGuide: 'Guía Definitiva',
      generate: 'Generar Títulos',
      copy: 'Copiar',
      copied: '✓ Copiado',
      copyAll: 'Copiar Todo',
      copiedAll: '✓ Todo Copiado',
      placeholderText: 'Ingresa un tema para generar títulos de blog atractivos.',
      disclaimer: 'Los resultados son sugerencias de plantilla. Ajústalos según tu contenido.',
      resultsTitle: 'Títulos Sugeridos',
      charCount: 'car',
    },
    pt: {
      title: 'Gerador de Títulos para Blog',
      subtitle: 'Gere 10-15 títulos de blog atraentes a partir de uma palavra-chave e estilo',
      topic: 'Tema / Palavra-chave',
      topicPlaceholder: 'ex. dicas de produtividade para trabalhadores remotos',
      audience: 'Público-alvo (opcional)',
      audiencePlaceholder: 'ex. empreendedores, iniciantes',
      tone: 'Estilo do Título',
      informative: 'Informativo',
      howto: 'Tutorial',
      listicle: 'Lista',
      question: 'Pergunta',
      ultimateGuide: 'Guia Definitivo',
      generate: 'Gerar Títulos',
      copy: 'Copiar',
      copied: '✓ Copiado',
      copyAll: 'Copiar Tudo',
      copiedAll: '✓ Tudo Copiado',
      placeholderText: 'Insira um tema para gerar títulos de blog atraentes.',
      disclaimer: 'Os resultados são sugestões de template. Ajuste-os conforme seu conteúdo.',
      resultsTitle: 'Títulos Sugeridos',
      charCount: 'car',
    },
    ja: {
      title: 'ブログタイトル生成ツール',
      subtitle: 'トピックキーワードとスタイルから10〜15個のブログタイトルを瞬時に生成します',
      topic: 'トピック / キーワード',
      topicPlaceholder: '例: リモートワークの生産性向上',
      audience: 'ターゲット読者（任意）',
      audiencePlaceholder: '例: 起業家、初心者',
      tone: 'タイトルスタイル',
      informative: '情報提供型',
      howto: 'ハウツー型',
      listicle: 'リスト型',
      question: '質問型',
      ultimateGuide: '決定版ガイド型',
      generate: 'タイトルを生成',
      copy: 'コピー',
      copied: '✓ コピー済み',
      copyAll: 'すべてコピー',
      copiedAll: '✓ すべてコピー済み',
      placeholderText: 'トピックを入力してブログタイトルを生成します。',
      disclaimer: '生成結果はテンプレートによる提案です。実際のコンテンツに合わせて調整してください。',
      resultsTitle: '生成されたタイトル案',
      charCount: '文字',
    },
    fr: {
      title: 'Générateur de Titres de Blog',
      subtitle: 'Générez 10 à 15 titres de blog percutants à partir d\'un mot-clé et d\'un style',
      topic: 'Sujet / Mot-clé',
      topicPlaceholder: 'ex. conseils de productivité pour télétravailleurs',
      audience: 'Audience cible (optionnel)',
      audiencePlaceholder: 'ex. entrepreneurs, débutants',
      tone: 'Style de Titre',
      informative: 'Informatif',
      howto: 'Tutoriel',
      listicle: 'Liste',
      question: 'Question',
      ultimateGuide: 'Guide Ultime',
      generate: 'Générer des Titres',
      copy: 'Copier',
      copied: '✓ Copié',
      copyAll: 'Tout Copier',
      copiedAll: '✓ Tout Copié',
      placeholderText: 'Saisissez un sujet pour générer des titres de blog percutants.',
      disclaimer: 'Les résultats sont des suggestions de modèle. Adaptez-les à votre contenu.',
      resultsTitle: 'Titres Suggérés',
      charCount: 'car',
    },
    de: {
      title: 'Blog-Titel-Generator',
      subtitle: 'Generieren Sie 10–15 überzeugende Blog-Titel aus einem Schlüsselwort und Stil',
      topic: 'Thema / Schlüsselwort',
      topicPlaceholder: 'z.B. Produktivitätstipps für Remote-Arbeit',
      audience: 'Zielgruppe (optional)',
      audiencePlaceholder: 'z.B. Unternehmer, Anfänger',
      tone: 'Titelstil',
      informative: 'Informativ',
      howto: 'Anleitung',
      listicle: 'Liste',
      question: 'Frage',
      ultimateGuide: 'Ultimativer Ratgeber',
      generate: 'Titel generieren',
      copy: 'Kopieren',
      copied: '✓ Kopiert',
      copyAll: 'Alle kopieren',
      copiedAll: '✓ Alle kopiert',
      placeholderText: 'Geben Sie ein Thema ein, um Blog-Titel zu generieren.',
      disclaimer: 'Ergebnisse sind Vorlagenvorschläge. Passen Sie sie an Ihren Inhalt an.',
      resultsTitle: 'Vorgeschlagene Titel',
      charCount: 'Z',
    },
    ar: {
      title: 'مولّد عناوين المدونات',
      subtitle: 'احصل على 10-15 عنواناً جذاباً للمدونة من كلمة مفتاحية وأسلوب كتابة',
      topic: 'الموضوع / الكلمة المفتاحية',
      topicPlaceholder: 'مثال: نصائح الإنتاجية للعمل عن بُعد',
      audience: 'الجمهور المستهدف (اختياري)',
      audiencePlaceholder: 'مثال: رواد الأعمال، المبتدئون',
      tone: 'أسلوب العنوان',
      informative: 'معلوماتي',
      howto: 'تعليمي',
      listicle: 'قائمة',
      question: 'سؤال',
      ultimateGuide: 'الدليل الشامل',
      generate: 'توليد العناوين',
      copy: 'نسخ',
      copied: '✓ تم النسخ',
      copyAll: 'نسخ الكل',
      copiedAll: '✓ تم نسخ الكل',
      placeholderText: 'أدخل موضوعاً لتوليد عناوين مدونات جذابة.',
      disclaimer: 'النتائج اقتراحات قوالب. يُنصح بتعديلها لتتوافق مع محتواك الفعلي.',
      resultsTitle: 'العناوين المقترحة',
      charCount: 'حرف',
    },
    ko: {
      title: '블로그 제목 생성기',
      subtitle: '주제 키워드와 스타일로 10-15개의 매력적인 블로그 제목을 생성합니다',
      topic: '주제 / 키워드',
      topicPlaceholder: '예: 재택근무 생산성 향상 팁',
      audience: '대상 독자 (선택)',
      audiencePlaceholder: '예: 창업자, 초보자',
      tone: '제목 스타일',
      informative: '정보 제공형',
      howto: '방법 안내형',
      listicle: '목록형',
      question: '질문형',
      ultimateGuide: '완벽 가이드형',
      generate: '제목 생성',
      copy: '복사',
      copied: '✓ 복사됨',
      copyAll: '전체 복사',
      copiedAll: '✓ 전체 복사됨',
      placeholderText: '주제를 입력하여 블로그 제목을 생성해보세요.',
      disclaimer: '결과는 템플릿 제안입니다. 실제 콘텐츠에 맞게 수정하세요.',
      resultsTitle: '생성된 제목 제안',
      charCount: '자',
    },
    ru: {
      title: 'Генератор заголовков блога',
      subtitle: 'Создайте 10-15 привлекательных заголовков для блога по теме и стилю',
      topic: 'Тема / Ключевое слово',
      topicPlaceholder: 'например: советы по продуктивности для удалённой работы',
      audience: 'Целевая аудитория (необязательно)',
      audiencePlaceholder: 'например: предприниматели, новички',
      tone: 'Стиль заголовка',
      informative: 'Информативный',
      howto: 'Инструкция',
      listicle: 'Список',
      question: 'Вопрос',
      ultimateGuide: 'Окончательное руководство',
      generate: 'Сгенерировать',
      copy: 'Копировать',
      copied: '✓ Скопировано',
      copyAll: 'Копировать всё',
      copiedAll: '✓ Всё скопировано',
      placeholderText: 'Введите тему, чтобы сгенерировать заголовки блога.',
      disclaimer: 'Результаты — шаблонные предложения. Адаптируйте их под свой контент.',
      resultsTitle: 'Предложенные заголовки',
      charCount: 'симв',
    },
  };

  const l = $derived(I18N_BACKUP[locale] || I18N_BACKUP['en']);

  let topic = $state('');
  let audience = $state('');
  let tone = $state('informative');

  function generateTitles(topic: string, audience: string, tone: string): string[] {
    const t = topic.trim();
    if (!t) return [];

    const aud = audience.trim();
    const audSuffix = aud ? ` for ${aud}` : '';

    const numFormulas = [5, 7, 9, 10, 12, 15, 17, 20, 25, 50];
    const n = numFormulas[Math.floor(Math.random() * 4) + 2]; // 9-17 range
    const n2 = numFormulas[Math.floor(Math.random() * 3)]; // 5-9
    const n3 = numFormulas[Math.floor(Math.random() * 3) + 2]; // 9-15

    const templates: Record<string, string[]> = {
      informative: [
        `The Complete Guide to ${t}`,
        `Everything You Need to Know About ${t}`,
        `${t}: A Comprehensive Overview`,
        `Understanding ${t}: Key Concepts Explained`,
        `The Science Behind ${t}`,
        `${t} Explained: What It Is and Why It Matters`,
        `Breaking Down ${t}: What Experts Don't Tell You`,
        `${t}: Facts, Tips & Insights${audSuffix}`,
        `The Truth About ${t} That Nobody Talks About`,
        `Why ${t} Is More Important Than You Think`,
        `${t}: Beginners, Experts & Everyone In Between`,
        `The Hidden Benefits of ${t}`,
        `Common Misconceptions About ${t} Debunked`,
        `${t}: From Theory to Practice`,
        `The Data-Driven Guide to ${t}`,
      ],
      howto: [
        `How to Master ${t} in 30 Days`,
        `How to Get Started with ${t} (Step-by-Step)`,
        `How to Improve Your ${t} Skills Today`,
        `How to Avoid the Biggest Mistakes in ${t}`,
        `How to Use ${t} to Transform Your Results`,
        `How to Build a System for ${t}${audSuffix}`,
        `How to Save Time with ${t}`,
        `How to Level Up Your ${t} Game`,
        `How to Make ${t} Work for You`,
        `How to Turn ${t} Into a Competitive Advantage`,
        `How to Go from Zero to Hero with ${t}`,
        `How to Stop Struggling with ${t}`,
        `How to Leverage ${t} Like a Pro`,
        `How to Make the Most of ${t}`,
        `How to Supercharge Your Results with ${t}`,
      ],
      listicle: [
        `${n} Proven Strategies for ${t}`,
        `${n2} Things You Didn't Know About ${t}`,
        `${n3} Essential Tips for ${t}${audSuffix}`,
        `${n} Mistakes to Avoid with ${t}`,
        `${n2} Game-Changing Tools for ${t}`,
        `${n} Ways to Improve Your ${t} Right Now`,
        `${n3} Reasons Why ${t} Will Change Your Life`,
        `${n} Habits of People Who Excel at ${t}`,
        `${n2} Quick Wins for ${t}`,
        `${n3} Secrets of Successful ${t}`,
        `${n} ${t} Tips That Actually Work`,
        `${n2} Must-Know Facts About ${t}`,
        `${n3} Powerful Techniques for ${t}`,
        `${n} Ways to Stay Consistent with ${t}`,
        `${n2} Red Flags to Watch Out for in ${t}`,
      ],
      question: [
        `Is ${t} Really Worth It?`,
        `What Nobody Tells You About ${t}`,
        `Why Is ${t} So Difficult — And How to Fix It?`,
        `Are You Making These ${t} Mistakes?`,
        `What's the Best Way to Learn ${t}?`,
        `Why Does ${t} Matter So Much${audSuffix}?`,
        `Can You Really Succeed with ${t} on Your Own?`,
        `What Would Happen If You Ignored ${t}?`,
        `How Long Does It Take to Get Good at ${t}?`,
        `Which ${t} Strategy Is Best for You?`,
        `Do You Really Understand ${t}?`,
        `What's Holding You Back from ${t}?`,
        `Why Are So Many People Failing at ${t}?`,
        `Is Your ${t} Strategy Working?`,
        `What Does a Great ${t} Approach Look Like?`,
      ],
      ultimateGuide: [
        `The Ultimate Guide to ${t}${audSuffix}`,
        `The Definitive ${t} Handbook`,
        `The Only ${t} Guide You'll Ever Need`,
        `The Complete ${t} Masterclass`,
        `The Ultimate ${t} Roadmap for Beginners`,
        `${t}: The A-to-Z Playbook`,
        `The Expert's Ultimate Guide to ${t}`,
        `Your Comprehensive ${t} Blueprint`,
        `The No-Nonsense Guide to ${t}`,
        `The Actionable ${t} Playbook`,
        `${t} Mastery: The Complete Roadmap`,
        `The Step-by-Step ${t} Success Guide`,
        `The Full ${t} Encyclopedia${audSuffix}`,
        `Mastering ${t}: A Complete Guide`,
        `The Ultimate ${t} Cheat Sheet`,
      ],
    };

    return (templates[tone] || templates['informative']).slice(0, 15);
  }

  const titles = $derived(generateTitles(topic, audience, tone));

  let copiedIndex = $state<number | null>(null);
  let copiedAll = $state(false);

  function copyTitle(text: string, idx: number) {
    navigator.clipboard.writeText(text).then(() => {
      copiedIndex = idx;
      setTimeout(() => (copiedIndex = null), 1500);
    });
  }

  function copyAllTitles() {
    if (titles.length === 0) return;
    navigator.clipboard.writeText(titles.join('\n')).then(() => {
      copiedAll = true;
      setTimeout(() => (copiedAll = false), 1800);
    });
  }
</script>

<div class="tool-theme-shell p-6 rounded-2xl font-sans min-h-[400px]">
  <!-- Header -->
  <div class="flex items-center gap-3 mb-6">
    <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-400 to-violet-700 flex items-center justify-center text-stone-950 font-black text-lg">
      ✍️
    </div>
    <div>
      <h2 class="font-extrabold text-lg text-violet-700 dark:bg-gradient-to-r dark:from-violet-300 dark:via-violet-100 dark:to-violet-400 dark:bg-clip-text dark:text-transparent leading-tight">
        {l.title}
      </h2>
      <p class="text-stone-500 text-xs mt-0.5">{l.subtitle}</p>
    </div>
  </div>

  <!-- Content Grid -->
  <div class="grid grid-cols-1 md:grid-cols-12 gap-6">
    <!-- Left: Inputs -->
    <div class="md:col-span-5 space-y-4">
      <label class="block">
        <span class="text-xs text-stone-400 mb-1.5 block">{l.topic}</span>
        <input
          type="text"
          bind:value={topic}
          placeholder={l.topicPlaceholder}
          class="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-2 text-sm text-stone-100 focus:border-violet-500 focus:outline-none transition-colors"
        />
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
        <span class="text-xs text-stone-400 mb-2 block">{l.tone}</span>
        <div class="grid grid-cols-1 gap-2">
          {#each [['informative', l.informative], ['howto', l.howto], ['listicle', l.listicle], ['question', l.question], ['ultimateGuide', l.ultimateGuide]] as [val, label]}
            <button
              type="button"
              onclick={() => (tone = val)}
              class="py-2 px-3 text-xs font-semibold rounded-lg border transition-all text-left {tone === val ? 'bg-violet-950/40 border-violet-600 text-violet-300' : 'bg-stone-900 border-stone-800 text-stone-400 hover:border-stone-700'}"
            >
              {label}
            </button>
          {/each}
        </div>
      </div>
    </div>

    <!-- Right: Output -->
    <div class="md:col-span-7 flex flex-col gap-3">
      {#if titles.length > 0}
        <div class="flex items-center justify-between mb-1">
          <span class="text-xs text-stone-400 font-semibold">{l.resultsTitle}</span>
          <button
            type="button"
            onclick={copyAllTitles}
            class="text-xs px-3 py-1 rounded-lg border border-stone-700 bg-stone-900 hover:bg-stone-800 text-stone-300 transition-all"
          >
            {copiedAll ? l.copiedAll : `📋 ${l.copyAll}`}
          </button>
        </div>
        <div class="space-y-2 flex-1">
          {#each titles as title, idx}
            <div class="bg-stone-900 border border-stone-800 rounded-lg px-4 py-3 flex items-start justify-between gap-3 hover:border-violet-500/30 transition-all group">
              <span class="text-stone-200 text-sm leading-snug flex-1">{title}</span>
              <div class="flex items-center gap-2 shrink-0">
                <span class="text-xxs text-stone-600">{title.length} {l.charCount}</span>
                <button
                  type="button"
                  onclick={() => copyTitle(title, idx)}
                  class="text-xxs px-2 py-0.5 rounded border border-stone-700 hover:border-violet-500 text-stone-500 hover:text-violet-400 transition-all"
                >
                  {copiedIndex === idx ? l.copied : l.copy}
                </button>
              </div>
            </div>
          {/each}
        </div>
      {:else}
        <div class="flex-1 flex flex-col items-center justify-center text-center p-10 bg-stone-900/25 border border-dashed border-stone-800 rounded-xl min-h-[300px]">
          <div class="text-4xl mb-3">✍️</div>
          <p class="text-xs text-stone-400 max-w-xs leading-relaxed">{l.placeholderText}</p>
        </div>
      {/if}

      <!-- Disclaimer -->
      <div class="text-xxs text-stone-600 pt-2 leading-relaxed text-center">
        {l.disclaimer}
      </div>
    </div>
  </div>
</div>

<style>
  .text-xxs {
    font-size: 0.65rem;
  }
</style>
