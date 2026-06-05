<script lang="ts">
  interface Props {
    locale?: string;
    translations?: Record<string, unknown>;
  }

  let { locale = 'en', translations = {} }: Props = $props();

  const I18N_BACKUP: Record<string, Record<string, string>> = {
    zh: {
      title: 'YouTube 标题生成器',
      subtitle: '生成 10 个高点击率 YouTube 标题，含 Emoji 选项与点击率技巧标注',
      videoTopic: '视频主题',
      videoTopicPlaceholder: '例如：初学者 Python 编程入门',
      keyword: '核心关键词',
      keywordPlaceholder: '例如：Python、编程、零基础',
      videoType: '视频类型',
      tutorial: '教程型 (Tutorial)',
      review: '评测型 (Review)',
      vlog: 'Vlog 日常',
      reaction: '反应/挑战型 (Reaction)',
      copy: '复制',
      copied: '✓ 已复制',
      copyAll: '复制全部',
      copiedAll: '✓ 已复制',
      placeholderText: '输入视频主题和关键词，生成高点击率 YouTube 标题。',
      disclaimer: 'YouTube 建议标题在 70 字符以内以确保完整显示。含数字、悬念词的标题通常有更高点击率。',
      chars: '字符',
      ctrTip: '点击率技巧',
      tip_number: '含数字',
      tip_curiosity: '激发好奇',
      tip_urgency: '紧迫感',
      tip_emotion: '情绪共鸣',
      tip_howto: '教程钩子',
      tip_promise: '承诺价值',
      resultsTitle: '标题建议',
    },
    en: {
      title: 'YouTube Title Generator',
      subtitle: 'Generate 10 high-CTR YouTube titles with emoji options and CTR tips',
      videoTopic: 'Video Topic',
      videoTopicPlaceholder: 'e.g. Python programming for beginners',
      keyword: 'Core Keyword',
      keywordPlaceholder: 'e.g. Python, programming, beginner',
      videoType: 'Video Type',
      tutorial: 'Tutorial',
      review: 'Review',
      vlog: 'Vlog',
      reaction: 'Reaction / Challenge',
      copy: 'Copy',
      copied: '✓ Copied',
      copyAll: 'Copy All',
      copiedAll: '✓ Copied',
      placeholderText: 'Enter your video topic and keyword to generate high-CTR YouTube titles.',
      disclaimer: 'YouTube recommends keeping titles under 70 characters for full display. Titles with numbers and curiosity gaps tend to get higher CTR.',
      chars: 'chars',
      ctrTip: 'CTR Tip',
      tip_number: 'Has Number',
      tip_curiosity: 'Curiosity Gap',
      tip_urgency: 'Urgency',
      tip_emotion: 'Emotional Hook',
      tip_howto: 'How-to Hook',
      tip_promise: 'Value Promise',
      resultsTitle: 'Title Suggestions',
    },
    es: {
      title: 'Generador de Títulos de YouTube',
      subtitle: 'Genera 10 títulos de YouTube con alta tasa de clics, opciones de emoji y consejos de CTR',
      videoTopic: 'Tema del Video',
      videoTopicPlaceholder: 'ej. Programación en Python para principiantes',
      keyword: 'Palabra Clave Principal',
      keywordPlaceholder: 'ej. Python, programación, principiante',
      videoType: 'Tipo de Video',
      tutorial: 'Tutorial',
      review: 'Reseña',
      vlog: 'Vlog',
      reaction: 'Reacción / Desafío',
      copy: 'Copiar',
      copied: '✓ Copiado',
      copyAll: 'Copiar Todo',
      copiedAll: '✓ Copiado',
      placeholderText: 'Ingresa tu tema y palabra clave para generar títulos de YouTube.',
      disclaimer: 'YouTube recomienda títulos de menos de 70 caracteres para visualización completa.',
      chars: 'car.',
      ctrTip: 'Consejo CTR',
      tip_number: 'Tiene número',
      tip_curiosity: 'Curiosidad',
      tip_urgency: 'Urgencia',
      tip_emotion: 'Gancho emocional',
      tip_howto: 'Gancho "Cómo"',
      tip_promise: 'Promesa de valor',
      resultsTitle: 'Títulos Sugeridos',
    },
    pt: {
      title: 'Gerador de Títulos do YouTube',
      subtitle: 'Gere 10 títulos de YouTube com alta CTR, opções de emoji e dicas de CTR',
      videoTopic: 'Tema do Vídeo',
      videoTopicPlaceholder: 'ex. Programação em Python para iniciantes',
      keyword: 'Palavra-chave Principal',
      keywordPlaceholder: 'ex. Python, programação, iniciante',
      videoType: 'Tipo de Vídeo',
      tutorial: 'Tutorial',
      review: 'Análise',
      vlog: 'Vlog',
      reaction: 'Reação / Desafio',
      copy: 'Copiar',
      copied: '✓ Copiado',
      copyAll: 'Copiar Tudo',
      copiedAll: '✓ Copiado',
      placeholderText: 'Insira seu tema e palavra-chave para gerar títulos do YouTube.',
      disclaimer: 'YouTube recomenda manter títulos abaixo de 70 caracteres para exibição completa.',
      chars: 'car.',
      ctrTip: 'Dica de CTR',
      tip_number: 'Tem número',
      tip_curiosity: 'Curiosidade',
      tip_urgency: 'Urgência',
      tip_emotion: 'Gancho emocional',
      tip_howto: 'Gancho "Como"',
      tip_promise: 'Promessa de valor',
      resultsTitle: 'Títulos Sugeridos',
    },
    ja: {
      title: 'YouTubeタイトル生成ツール',
      subtitle: '高CTRなYouTubeタイトルを10個、絵文字オプションとCTRヒント付きで生成します',
      videoTopic: '動画のトピック',
      videoTopicPlaceholder: '例: 初心者向けPythonプログラミング入門',
      keyword: 'コアキーワード',
      keywordPlaceholder: '例: Python、プログラミング、入門',
      videoType: '動画の種類',
      tutorial: 'チュートリアル',
      review: 'レビュー',
      vlog: 'Vlog',
      reaction: 'リアクション / チャレンジ',
      copy: 'コピー',
      copied: '✓ コピー済み',
      copyAll: 'すべてコピー',
      copiedAll: '✓ コピー済み',
      placeholderText: '動画のトピックとキーワードを入力してタイトルを生成します。',
      disclaimer: 'YouTubeは70文字以内のタイトルを推奨します。数字や好奇心を刺激するタイトルはCTRが高い傾向にあります。',
      chars: '文字',
      ctrTip: 'CTRヒント',
      tip_number: '数字あり',
      tip_curiosity: '好奇心を刺激',
      tip_urgency: '緊急性',
      tip_emotion: '感情的フック',
      tip_howto: 'ハウツーフック',
      tip_promise: '価値の約束',
      resultsTitle: 'タイトル候補',
    },
    fr: {
      title: 'Générateur de Titres YouTube',
      subtitle: 'Générez 10 titres YouTube à fort taux de clics avec emojis et conseils CTR',
      videoTopic: 'Sujet de la Vidéo',
      videoTopicPlaceholder: 'ex. Programmation Python pour débutants',
      keyword: 'Mot-clé Principal',
      keywordPlaceholder: 'ex. Python, programmation, débutant',
      videoType: 'Type de Vidéo',
      tutorial: 'Tutoriel',
      review: 'Avis / Test',
      vlog: 'Vlog',
      reaction: 'Réaction / Défi',
      copy: 'Copier',
      copied: '✓ Copié',
      copyAll: 'Tout Copier',
      copiedAll: '✓ Copié',
      placeholderText: 'Saisissez votre sujet et mot-clé pour générer des titres YouTube.',
      disclaimer: 'YouTube recommande des titres de moins de 70 caractères pour un affichage complet.',
      chars: 'car.',
      ctrTip: 'Conseil CTR',
      tip_number: 'Contient un chiffre',
      tip_curiosity: 'Curiosité',
      tip_urgency: 'Urgence',
      tip_emotion: 'Accroche émotionnelle',
      tip_howto: 'Accroche "Comment"',
      tip_promise: 'Promesse de valeur',
      resultsTitle: 'Titres Suggérés',
    },
    de: {
      title: 'YouTube-Titel-Generator',
      subtitle: 'Erstellen Sie 10 YouTube-Titel mit hoher CTR, Emoji-Optionen und CTR-Tipps',
      videoTopic: 'Videothema',
      videoTopicPlaceholder: 'z.B. Python-Programmierung für Anfänger',
      keyword: 'Haupt-Schlüsselwort',
      keywordPlaceholder: 'z.B. Python, Programmierung, Anfänger',
      videoType: 'Videotyp',
      tutorial: 'Tutorial',
      review: 'Bewertung',
      vlog: 'Vlog',
      reaction: 'Reaktion / Challenge',
      copy: 'Kopieren',
      copied: '✓ Kopiert',
      copyAll: 'Alle kopieren',
      copiedAll: '✓ Kopiert',
      placeholderText: 'Geben Sie Ihr Videothema und Schlüsselwort ein, um YouTube-Titel zu generieren.',
      disclaimer: 'YouTube empfiehlt Titel unter 70 Zeichen für vollständige Anzeige.',
      chars: 'Z.',
      ctrTip: 'CTR-Tipp',
      tip_number: 'Enthält Zahl',
      tip_curiosity: 'Neugier',
      tip_urgency: 'Dringlichkeit',
      tip_emotion: 'Emotionaler Hook',
      tip_howto: 'Anleitungs-Hook',
      tip_promise: 'Versprechen',
      resultsTitle: 'Titelvorschläge',
    },
    ar: {
      title: 'مولّد عناوين يوتيوب',
      subtitle: 'أنشئ 10 عناوين يوتيوب بنسبة نقر عالية مع خيارات الرموز التعبيرية ونصائح CTR',
      videoTopic: 'موضوع الفيديو',
      videoTopicPlaceholder: 'مثال: تعلم البرمجة بلغة Python للمبتدئين',
      keyword: 'الكلمة المفتاحية الرئيسية',
      keywordPlaceholder: 'مثال: Python، برمجة، مبتدئ',
      videoType: 'نوع الفيديو',
      tutorial: 'تعليمي',
      review: 'مراجعة',
      vlog: 'Vlog',
      reaction: 'ردود فعل / تحدي',
      copy: 'نسخ',
      copied: '✓ تم النسخ',
      copyAll: 'نسخ الكل',
      copiedAll: '✓ تم النسخ',
      placeholderText: 'أدخل موضوع الفيديو والكلمة المفتاحية لتوليد عناوين يوتيوب.',
      disclaimer: 'يوصي يوتيوب بعناوين أقل من 70 حرفاً للعرض الكامل.',
      chars: 'حرف',
      ctrTip: 'نصيحة CTR',
      tip_number: 'يحتوي رقم',
      tip_curiosity: 'إثارة الفضول',
      tip_urgency: 'الإلحاح',
      tip_emotion: 'ربط عاطفي',
      tip_howto: 'خطاف "كيف"',
      tip_promise: 'وعد بقيمة',
      resultsTitle: 'العناوين المقترحة',
    },
    ko: {
      title: 'YouTube 제목 생성기',
      subtitle: '이모지 옵션과 CTR 팁이 포함된 고클릭률 YouTube 제목 10개를 생성합니다',
      videoTopic: '동영상 주제',
      videoTopicPlaceholder: '예: 초보자를 위한 Python 프로그래밍',
      keyword: '핵심 키워드',
      keywordPlaceholder: '예: Python, 프로그래밍, 초보자',
      videoType: '동영상 유형',
      tutorial: '튜토리얼',
      review: '리뷰',
      vlog: 'Vlog',
      reaction: '반응 / 챌린지',
      copy: '복사',
      copied: '✓ 복사됨',
      copyAll: '전체 복사',
      copiedAll: '✓ 복사됨',
      placeholderText: '동영상 주제와 키워드를 입력하여 YouTube 제목을 생성하세요.',
      disclaimer: 'YouTube는 전체 표시를 위해 70자 이내의 제목을 권장합니다.',
      chars: '자',
      ctrTip: 'CTR 팁',
      tip_number: '숫자 포함',
      tip_curiosity: '호기심 유발',
      tip_urgency: '긴박감',
      tip_emotion: '감성 훅',
      tip_howto: '방법 훅',
      tip_promise: '가치 약속',
      resultsTitle: '제목 제안',
    },
    ru: {
      title: 'Генератор заголовков YouTube',
      subtitle: 'Создайте 10 заголовков YouTube с высоким CTR, вариантами emoji и советами по CTR',
      videoTopic: 'Тема видео',
      videoTopicPlaceholder: 'например: Программирование на Python для начинающих',
      keyword: 'Основное ключевое слово',
      keywordPlaceholder: 'например: Python, программирование, новичок',
      videoType: 'Тип видео',
      tutorial: 'Обучение',
      review: 'Обзор',
      vlog: 'Влог',
      reaction: 'Реакция / Вызов',
      copy: 'Копировать',
      copied: '✓ Скопировано',
      copyAll: 'Копировать всё',
      copiedAll: '✓ Скопировано',
      placeholderText: 'Введите тему видео и ключевое слово для генерации заголовков YouTube.',
      disclaimer: 'YouTube рекомендует заголовки до 70 символов для полного отображения.',
      chars: 'симв.',
      ctrTip: 'Совет по CTR',
      tip_number: 'Есть цифра',
      tip_curiosity: 'Интрига',
      tip_urgency: 'Срочность',
      tip_emotion: 'Эмоциональный крюк',
      tip_howto: 'Крюк "Как"',
      tip_promise: 'Обещание ценности',
      resultsTitle: 'Предложенные заголовки',
    },
  };

  const l = $derived(I18N_BACKUP[locale] || I18N_BACKUP['en']);

  let videoTopic = $state('');
  let keyword = $state('');
  let videoType = $state('tutorial');

  interface TitleSuggestion {
    title: string;
    tips: string[];
  }

  function generateYoutubeTitles(topic: string, kw: string, type: string): TitleSuggestion[] {
    const t = topic.trim();
    if (!t) return [];
    const k = kw.trim() || t;

    const tutorialTemplates: TitleSuggestion[] = [
      { title: `How to Master ${t} in 2025 (Step-by-Step)`, tips: ['tip_howto', 'tip_number', 'tip_urgency'] },
      { title: `${t} Tutorial for Beginners | Complete Guide`, tips: ['tip_howto', 'tip_promise'] },
      { title: `I Learned ${k} in 7 Days — Here's What Happened`, tips: ['tip_curiosity', 'tip_emotion', 'tip_number'] },
      { title: `🚀 ${t}: Everything You Need to Know`, tips: ['tip_promise'] },
      { title: `The ONLY ${t} Tutorial You'll Ever Need`, tips: ['tip_promise', 'tip_curiosity'] },
      { title: `How I Finally Mastered ${k} (And You Can Too)`, tips: ['tip_emotion', 'tip_howto'] },
      { title: `${t} in 10 Minutes — Beginner Friendly`, tips: ['tip_number', 'tip_promise', 'tip_urgency'] },
      { title: `Stop Making These ${k} Mistakes`, tips: ['tip_curiosity', 'tip_emotion'] },
      { title: `🎯 ${t} Full Course | Free for Everyone`, tips: ['tip_promise'] },
      { title: `${k} Explained Simply — No BS Tutorial`, tips: ['tip_howto', 'tip_emotion'] },
    ];

    const reviewTemplates: TitleSuggestion[] = [
      { title: `Is ${t} Worth It in 2025? Honest Review`, tips: ['tip_curiosity', 'tip_urgency'] },
      { title: `${t} Review — After 30 Days of Testing`, tips: ['tip_number', 'tip_curiosity'] },
      { title: `I Tried ${k} for a Month — Here's the Truth`, tips: ['tip_curiosity', 'tip_emotion'] },
      { title: `${t}: The Good, The Bad & The Ugly`, tips: ['tip_emotion', 'tip_curiosity'] },
      { title: `🔍 ${t} Honest Review — Watch Before You Buy`, tips: ['tip_urgency', 'tip_promise'] },
      { title: `Why I Quit ${k} (And What I Use Instead)`, tips: ['tip_curiosity', 'tip_emotion'] },
      { title: `${t} vs Alternatives — Which Wins in 2025?`, tips: ['tip_curiosity', 'tip_urgency', 'tip_number'] },
      { title: `${k} Review: 5 Things Nobody Tells You`, tips: ['tip_number', 'tip_curiosity'] },
      { title: `I Spent $500 on ${t} — Was It Worth It?`, tips: ['tip_number', 'tip_curiosity', 'tip_emotion'] },
      { title: `The Real Truth About ${k} (Unfiltered)`, tips: ['tip_curiosity', 'tip_emotion'] },
    ];

    const vlogTemplates: TitleSuggestion[] = [
      { title: `A Day in My Life as a ${t} Person`, tips: ['tip_emotion', 'tip_curiosity'] },
      { title: `My ${t} Journey — Honest & Raw`, tips: ['tip_emotion'] },
      { title: `${t} Vlog — Week 1: Everything Changed`, tips: ['tip_curiosity', 'tip_emotion'] },
      { title: `I Documented My ${k} Journey for 30 Days`, tips: ['tip_number', 'tip_curiosity'] },
      { title: `🌟 How ${t} Changed My Life`, tips: ['tip_emotion', 'tip_curiosity'] },
      { title: `Behind the Scenes of My ${t} Life`, tips: ['tip_curiosity', 'tip_emotion'] },
      { title: `Day in the Life — ${t} Edition`, tips: ['tip_curiosity'] },
      { title: `${k} Routine That Actually Works for Me`, tips: ['tip_emotion', 'tip_promise'] },
      { title: `What Nobody Tells You About ${t}`, tips: ['tip_curiosity'] },
      { title: `The Ugly Truth About My ${k} Journey`, tips: ['tip_emotion', 'tip_curiosity'] },
    ];

    const reactionTemplates: TitleSuggestion[] = [
      { title: `I Tried ${t} for the First Time — SHOCKING!`, tips: ['tip_curiosity', 'tip_emotion', 'tip_urgency'] },
      { title: `Reacting to the WORST ${k} Advice on the Internet`, tips: ['tip_curiosity', 'tip_emotion'] },
      { title: `🔥 ${t} Challenge: Can I Do It in 24 Hours?`, tips: ['tip_urgency', 'tip_curiosity', 'tip_number'] },
      { title: `I Challenged Myself to ${t} for a Week`, tips: ['tip_number', 'tip_curiosity'] },
      { title: `Trying Viral ${k} Hacks — Do They Work?`, tips: ['tip_curiosity', 'tip_urgency'] },
      { title: `${t} Challenge Gone Wrong 😱`, tips: ['tip_emotion', 'tip_curiosity'] },
      { title: `Reacting to My Old ${k} — So Embarrassing`, tips: ['tip_emotion', 'tip_curiosity'] },
      { title: `Can a Beginner Do ${t}? I Tested It`, tips: ['tip_curiosity'] },
      { title: `${k} Secrets Revealed — Experts React`, tips: ['tip_curiosity', 'tip_promise'] },
      { title: `I Let AI Plan My ${t} — Here's What Happened`, tips: ['tip_curiosity', 'tip_urgency'] },
    ];

    const map: Record<string, TitleSuggestion[]> = {
      tutorial: tutorialTemplates,
      review: reviewTemplates,
      vlog: vlogTemplates,
      reaction: reactionTemplates,
    };

    return (map[type] || tutorialTemplates).slice(0, 10);
  }

  const suggestions = $derived(generateYoutubeTitles(videoTopic, keyword, videoType));

  let copiedIndex = $state<number | null>(null);
  let copiedAll = $state(false);

  function copyTitle(text: string, idx: number) {
    navigator.clipboard.writeText(text).then(() => {
      copiedIndex = idx;
      setTimeout(() => (copiedIndex = null), 1500);
    });
  }

  function copyAll() {
    if (suggestions.length === 0) return;
    navigator.clipboard.writeText(suggestions.map(s => s.title).join('\n')).then(() => {
      copiedAll = true;
      setTimeout(() => (copiedAll = false), 1800);
    });
  }

  const tipColors: Record<string, string> = {
    tip_number: 'bg-blue-900/60 text-blue-300',
    tip_curiosity: 'bg-purple-900/60 text-purple-300',
    tip_urgency: 'bg-red-900/60 text-red-300',
    tip_emotion: 'bg-pink-900/60 text-pink-300',
    tip_howto: 'bg-emerald-900/60 text-emerald-300',
    tip_promise: 'bg-yellow-900/60 text-yellow-300',
  };
</script>

<div class="bg-stone-950 text-stone-100 p-6 rounded-2xl border border-stone-800 shadow-2xl font-sans min-h-[400px]">
  <!-- Header -->
  <div class="flex items-center gap-3 mb-6">
    <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-red-400 to-red-700 flex items-center justify-center text-stone-950 font-black text-lg">
      ▶️
    </div>
    <div>
      <h2 class="font-extrabold text-lg bg-gradient-to-r from-red-300 via-red-100 to-red-400 bg-clip-text text-transparent leading-tight">
        {l.title}
      </h2>
      <p class="text-stone-500 text-xs mt-0.5">{l.subtitle}</p>
    </div>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-12 gap-6">
    <!-- Left: Inputs -->
    <div class="md:col-span-4 space-y-4">
      <label class="block">
        <span class="text-xs text-stone-400 mb-1.5 block">{l.videoTopic}</span>
        <input type="text" bind:value={videoTopic} placeholder={l.videoTopicPlaceholder}
          class="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-2 text-sm text-stone-100 focus:border-red-500 focus:outline-none transition-colors" />
      </label>

      <label class="block">
        <span class="text-xs text-stone-400 mb-1.5 block">{l.keyword}</span>
        <input type="text" bind:value={keyword} placeholder={l.keywordPlaceholder}
          class="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-2 text-sm text-stone-100 focus:border-red-500 focus:outline-none transition-colors" />
      </label>

      <div>
        <span class="text-xs text-stone-400 mb-2 block">{l.videoType}</span>
        <div class="grid grid-cols-1 gap-2">
          {#each [['tutorial', l.tutorial], ['review', l.review], ['vlog', l.vlog], ['reaction', l.reaction]] as [val, label]}
            <button type="button" onclick={() => (videoType = val)}
              class="py-2 px-3 text-xs font-semibold rounded-lg border transition-all text-left {videoType === val ? 'bg-red-950/40 border-red-600 text-red-300' : 'bg-stone-900 border-stone-800 text-stone-400 hover:border-stone-700'}">
              {label}
            </button>
          {/each}
        </div>
      </div>
    </div>

    <!-- Right: Output -->
    <div class="md:col-span-8 flex flex-col gap-3">
      {#if suggestions.length > 0}
        <div class="flex items-center justify-between mb-1">
          <span class="text-xs text-stone-400 font-semibold">{l.resultsTitle}</span>
          <button type="button" onclick={copyAll}
            class="text-xs px-3 py-1 rounded-lg border border-stone-700 bg-stone-900 hover:bg-stone-800 text-stone-300 transition-all">
            {copiedAll ? l.copiedAll : `📋 ${l.copyAll}`}
          </button>
        </div>
        <div class="space-y-2">
          {#each suggestions as s, idx}
            <div class="bg-stone-900 border border-stone-800 rounded-lg px-3 py-2.5 flex items-start gap-3 hover:border-red-500/30 transition-all group">
              <div class="flex-1 min-w-0">
                <p class="text-stone-200 text-sm leading-snug mb-1.5">{s.title}</p>
                <div class="flex flex-wrap gap-1 items-center">
                  {#each s.tips as tip}
                    <span class="text-xxs px-1.5 py-0.5 rounded {tipColors[tip] || 'bg-stone-800 text-stone-400'}">
                      {l[tip]}
                    </span>
                  {/each}
                  <span class="text-xxs text-stone-600 ml-1">{s.title.length} {l.chars}</span>
                </div>
              </div>
              <button type="button" onclick={() => copyTitle(s.title, idx)}
                class="text-xxs px-2 py-0.5 rounded border border-stone-700 hover:border-red-500 text-stone-500 hover:text-red-400 transition-all shrink-0 mt-0.5">
                {copiedIndex === idx ? l.copied : l.copy}
              </button>
            </div>
          {/each}
        </div>
      {:else}
        <div class="flex-1 flex flex-col items-center justify-center text-center p-10 bg-stone-900/25 border border-dashed border-stone-800 rounded-xl min-h-[300px]">
          <div class="text-4xl mb-3">▶️</div>
          <p class="text-xs text-stone-400 max-w-xs leading-relaxed">{l.placeholderText}</p>
        </div>
      {/if}
      <div class="text-xxs text-stone-600 text-center leading-relaxed">{l.disclaimer}</div>
    </div>
  </div>
</div>

<style>
  .text-xxs {
    font-size: 0.65rem;
  }
</style>
