<script lang="ts">
  interface Props {
    locale?: string;
    translations?: Record<string, unknown>;
  }

  let { locale = 'en', translations = {} }: Props = $props();

  const I18N_BACKUP: Record<string, Record<string, string>> = {
    zh: {
      title: 'YouTube 简介生成器',
      subtitle: '生成结构化 YouTube 视频简介：钩子+正文+SEO关键词+CTA，一键复制',
      videoTitle: '视频标题',
      videoTitlePlaceholder: '例如：Python 零基础入门完整教程',
      keywords: '关键词（逗号分隔）',
      keywordsPlaceholder: '例如：Python,编程,零基础,初学者',
      channelName: '频道名称',
      channelNamePlaceholder: '例如：CodeWithKaka',
      ctaLink: 'CTA 链接（可选）',
      ctaLinkPlaceholder: '例如：https://your-site.com/subscribe',
      generateBtn: '生成简介',
      copy: '一键复制',
      copied: '✓ 已复制',
      placeholderText: '输入视频标题、关键词和频道信息，即可生成专业 YouTube 视频简介。',
      disclaimer: 'YouTube 折叠前显示约 157 个字符的简介，确保前几行最具吸引力。',
      chars: '字符',
      firstCharsLabel: '前 157 字符（折叠显示）',
      sectionHook: '🎯 吸引眼球的开头',
      sectionBody: '📝 视频内容概述',
      sectionSeo: '🔍 相关标签',
      sectionCta: '📌 订阅与关注',
    },
    en: {
      title: 'YouTube Description Generator',
      subtitle: 'Generate structured YouTube descriptions: hook + body + SEO keywords + CTA, one-click copy',
      videoTitle: 'Video Title',
      videoTitlePlaceholder: 'e.g. Complete Python Tutorial for Beginners',
      keywords: 'Keywords (comma separated)',
      keywordsPlaceholder: 'e.g. Python, programming, tutorial, beginner',
      channelName: 'Channel Name',
      channelNamePlaceholder: 'e.g. CodeWithKaka',
      ctaLink: 'CTA Link (optional)',
      ctaLinkPlaceholder: 'e.g. https://your-site.com/subscribe',
      generateBtn: 'Generate Description',
      copy: 'Copy Description',
      copied: '✓ Copied',
      placeholderText: 'Enter your video title, keywords, and channel info to generate a professional YouTube description.',
      disclaimer: 'YouTube shows ~157 characters before "Show more". Make the first lines count!',
      chars: 'chars',
      firstCharsLabel: 'First 157 chars (shown before "Show more")',
      sectionHook: '🎯 Hook',
      sectionBody: '📝 Description',
      sectionSeo: '🔍 Tags',
      sectionCta: '📌 Subscribe & Follow',
    },
    es: {
      title: 'Generador de Descripción de YouTube',
      subtitle: 'Genera descripciones de YouTube estructuradas: gancho + cuerpo + SEO + CTA',
      videoTitle: 'Título del Video',
      videoTitlePlaceholder: 'ej. Tutorial completo de Python para principiantes',
      keywords: 'Palabras Clave (separadas por comas)',
      keywordsPlaceholder: 'ej. Python, programación, tutorial, principiante',
      channelName: 'Nombre del Canal',
      channelNamePlaceholder: 'ej. CodeWithKaka',
      ctaLink: 'Enlace CTA (opcional)',
      ctaLinkPlaceholder: 'ej. https://tu-sitio.com/suscribirse',
      generateBtn: 'Generar Descripción',
      copy: 'Copiar Descripción',
      copied: '✓ Copiado',
      placeholderText: 'Ingresa el título, palabras clave e info del canal para generar una descripción.',
      disclaimer: 'YouTube muestra ~157 caracteres antes de "Mostrar más". ¡Haz que cuenten!',
      chars: 'car.',
      firstCharsLabel: 'Primeros 157 car. (antes de "Mostrar más")',
      sectionHook: '🎯 Gancho',
      sectionBody: '📝 Descripción',
      sectionSeo: '🔍 Etiquetas',
      sectionCta: '📌 Suscribirse',
    },
    pt: {
      title: 'Gerador de Descrição do YouTube',
      subtitle: 'Gere descrições de YouTube estruturadas: gancho + corpo + SEO + CTA',
      videoTitle: 'Título do Vídeo',
      videoTitlePlaceholder: 'ex. Tutorial completo de Python para iniciantes',
      keywords: 'Palavras-chave (separadas por vírgula)',
      keywordsPlaceholder: 'ex. Python, programação, tutorial, iniciante',
      channelName: 'Nome do Canal',
      channelNamePlaceholder: 'ex. CodeWithKaka',
      ctaLink: 'Link CTA (opcional)',
      ctaLinkPlaceholder: 'ex. https://seu-site.com/inscrever',
      generateBtn: 'Gerar Descrição',
      copy: 'Copiar Descrição',
      copied: '✓ Copiado',
      placeholderText: 'Insira título, palavras-chave e info do canal para gerar uma descrição.',
      disclaimer: 'O YouTube exibe ~157 caracteres antes de "Mostrar mais". Faça contar!',
      chars: 'car.',
      firstCharsLabel: 'Primeiros 157 car. (antes de "Mostrar mais")',
      sectionHook: '🎯 Gancho',
      sectionBody: '📝 Descrição',
      sectionSeo: '🔍 Tags',
      sectionCta: '📌 Inscrever-se',
    },
    ja: {
      title: 'YouTube概要欄生成ツール',
      subtitle: '構造化されたYouTube概要欄を生成：フック+本文+SEOキーワード+CTA',
      videoTitle: '動画タイトル',
      videoTitlePlaceholder: '例: 初心者向けPython完全チュートリアル',
      keywords: 'キーワード（カンマ区切り）',
      keywordsPlaceholder: '例: Python、プログラミング、チュートリアル、入門',
      channelName: 'チャンネル名',
      channelNamePlaceholder: '例: CodeWithKaka',
      ctaLink: 'CTAリンク（任意）',
      ctaLinkPlaceholder: '例: https://your-site.com/subscribe',
      generateBtn: '概要欄を生成',
      copy: '概要欄をコピー',
      copied: '✓ コピー済み',
      placeholderText: '動画タイトル、キーワード、チャンネル情報を入力して概要欄を生成します。',
      disclaimer: 'YouTubeは「もっと見る」前に約157文字を表示します。',
      chars: '文字',
      firstCharsLabel: '最初の157文字（「もっと見る」前に表示）',
      sectionHook: '🎯 フック',
      sectionBody: '📝 説明',
      sectionSeo: '🔍 タグ',
      sectionCta: '📌 チャンネル登録',
    },
    fr: {
      title: 'Générateur de Description YouTube',
      subtitle: 'Générez des descriptions YouTube structurées: accroche + corps + SEO + CTA',
      videoTitle: 'Titre de la Vidéo',
      videoTitlePlaceholder: 'ex. Tutoriel Python complet pour débutants',
      keywords: 'Mots-clés (séparés par des virgules)',
      keywordsPlaceholder: 'ex. Python, programmation, tutoriel, débutant',
      channelName: 'Nom de la Chaîne',
      channelNamePlaceholder: 'ex. CodeWithKaka',
      ctaLink: 'Lien CTA (optionnel)',
      ctaLinkPlaceholder: 'ex. https://votre-site.com/abonnez-vous',
      generateBtn: 'Générer la Description',
      copy: 'Copier la Description',
      copied: '✓ Copié',
      placeholderText: 'Entrez le titre, mots-clés et infos de chaîne pour générer une description.',
      disclaimer: 'YouTube affiche ~157 caractères avant "Voir plus". Faites-les compter!',
      chars: 'car.',
      firstCharsLabel: 'Premiers 157 car. (avant "Voir plus")',
      sectionHook: '🎯 Accroche',
      sectionBody: '📝 Description',
      sectionSeo: '🔍 Tags',
      sectionCta: '📌 S\'abonner',
    },
    de: {
      title: 'YouTube-Beschreibungs-Generator',
      subtitle: 'Erstellen Sie strukturierte YouTube-Beschreibungen: Hook + Text + SEO + CTA',
      videoTitle: 'Videotitel',
      videoTitlePlaceholder: 'z.B. Vollständiges Python-Tutorial für Anfänger',
      keywords: 'Schlüsselwörter (kommagetrennt)',
      keywordsPlaceholder: 'z.B. Python, Programmierung, Tutorial, Anfänger',
      channelName: 'Kanalname',
      channelNamePlaceholder: 'z.B. CodeWithKaka',
      ctaLink: 'CTA-Link (optional)',
      ctaLinkPlaceholder: 'z.B. https://ihre-seite.com/abonnieren',
      generateBtn: 'Beschreibung erstellen',
      copy: 'Beschreibung kopieren',
      copied: '✓ Kopiert',
      placeholderText: 'Geben Sie Titel, Schlüsselwörter und Kanalinfo ein, um eine Beschreibung zu erstellen.',
      disclaimer: 'YouTube zeigt ~157 Zeichen vor „Mehr anzeigen". Nutzen Sie sie gut!',
      chars: 'Z.',
      firstCharsLabel: 'Erste 157 Z. (vor „Mehr anzeigen")',
      sectionHook: '🎯 Hook',
      sectionBody: '📝 Beschreibung',
      sectionSeo: '🔍 Tags',
      sectionCta: '📌 Abonnieren',
    },
    ar: {
      title: 'مولّد وصف يوتيوب',
      subtitle: 'أنشئ أوصاف يوتيوب منظمة: خطاف + محتوى + SEO + دعوة للعمل',
      videoTitle: 'عنوان الفيديو',
      videoTitlePlaceholder: 'مثال: دورة Python الكاملة للمبتدئين',
      keywords: 'الكلمات المفتاحية (مفصولة بفاصلة)',
      keywordsPlaceholder: 'مثال: Python، برمجة، تعليمي، مبتدئ',
      channelName: 'اسم القناة',
      channelNamePlaceholder: 'مثال: CodeWithKaka',
      ctaLink: 'رابط CTA (اختياري)',
      ctaLinkPlaceholder: 'مثال: https://your-site.com/subscribe',
      generateBtn: 'توليد الوصف',
      copy: 'نسخ الوصف',
      copied: '✓ تم النسخ',
      placeholderText: 'أدخل العنوان والكلمات المفتاحية ومعلومات القناة لتوليد الوصف.',
      disclaimer: 'يعرض يوتيوب ~157 حرفاً قبل "عرض المزيد". اجعل الأحرف الأولى مؤثرة!',
      chars: 'حرف',
      firstCharsLabel: 'أول 157 حرف (قبل "عرض المزيد")',
      sectionHook: '🎯 الخطاف',
      sectionBody: '📝 الوصف',
      sectionSeo: '🔍 الوسوم',
      sectionCta: '📌 الاشتراك',
    },
    ko: {
      title: 'YouTube 설명 생성기',
      subtitle: '구조화된 YouTube 동영상 설명 생성: 훅 + 본문 + SEO 키워드 + CTA',
      videoTitle: '동영상 제목',
      videoTitlePlaceholder: '예: 초보자를 위한 완전한 Python 튜토리얼',
      keywords: '키워드 (쉼표로 구분)',
      keywordsPlaceholder: '예: Python, 프로그래밍, 튜토리얼, 초보자',
      channelName: '채널 이름',
      channelNamePlaceholder: '예: CodeWithKaka',
      ctaLink: 'CTA 링크 (선택)',
      ctaLinkPlaceholder: '예: https://your-site.com/subscribe',
      generateBtn: '설명 생성',
      copy: '설명 복사',
      copied: '✓ 복사됨',
      placeholderText: '동영상 제목, 키워드, 채널 정보를 입력하여 YouTube 설명을 생성하세요.',
      disclaimer: 'YouTube는 "더 보기" 전에 약 157자를 표시합니다. 첫 줄을 강렬하게 만드세요!',
      chars: '자',
      firstCharsLabel: '첫 157자 ("더 보기" 전에 표시)',
      sectionHook: '🎯 훅',
      sectionBody: '📝 설명',
      sectionSeo: '🔍 태그',
      sectionCta: '📌 구독',
    },
    ru: {
      title: 'Генератор описания YouTube',
      subtitle: 'Создайте структурированное описание YouTube: крюк + тело + SEO + CTA',
      videoTitle: 'Название видео',
      videoTitlePlaceholder: 'например: Полный курс Python для начинающих',
      keywords: 'Ключевые слова (через запятую)',
      keywordsPlaceholder: 'например: Python, программирование, урок, новичок',
      channelName: 'Название канала',
      channelNamePlaceholder: 'например: CodeWithKaka',
      ctaLink: 'Ссылка CTA (необязательно)',
      ctaLinkPlaceholder: 'например: https://your-site.com/subscribe',
      generateBtn: 'Создать описание',
      copy: 'Скопировать описание',
      copied: '✓ Скопировано',
      placeholderText: 'Введите название, ключевые слова и инфо о канале для создания описания.',
      disclaimer: 'YouTube показывает ~157 символов до «Ещё». Используйте их с умом!',
      chars: 'симв.',
      firstCharsLabel: 'Первые 157 симв. (до «Ещё»)',
      sectionHook: '🎯 Крюк',
      sectionBody: '📝 Описание',
      sectionSeo: '🔍 Теги',
      sectionCta: '📌 Подписаться',
    },
  };

  const l = $derived(I18N_BACKUP[locale] || I18N_BACKUP['en']);

  let videoTitle = $state('');
  let keywords = $state('');
  let channelName = $state('');
  let ctaLink = $state('');

  function generateDescription(vt: string, kws: string, ch: string, cta: string): string {
    const t = vt.trim();
    if (!t) return '';

    const kwList = kws.split(',').map(k => k.trim()).filter(Boolean);
    const kwStr = kwList.map(k => `#${k.replace(/\s+/g, '')}`).join(' ');
    const ch_ = ch.trim() || 'Our Channel';
    const ctaLine = cta.trim() ? `👉 ${cta.trim()}` : '';

    const hook = `In this video, you'll learn everything about ${t}. Whether you're a complete beginner or looking to level up your skills, this is the resource for you.`;

    const body = `📌 WHAT YOU'LL LEARN IN THIS VIDEO:
• Core concepts of ${t}
• Step-by-step practical examples
• Common mistakes to avoid
• Tips from real-world experience

This tutorial is designed to be clear, concise, and actionable. No fluff — just results.`;

    const seo = kwList.length > 0
      ? `🔍 RELATED KEYWORDS:\n${kwList.slice(0, 8).join(' • ')}`
      : `🔍 TOPICS COVERED:\n${t}`;

    const ctaBlock = `📌 CONNECT WITH ${ch_.toUpperCase()}:
🔔 Subscribe for more: ${ctaLine || `https://youtube.com/c/${ch_.replace(/\s/g, '')}`}
👍 Like & Share if you found this helpful!
💬 Drop your questions in the comments below — I read every one!

${kwStr}`;

    return [hook, '', body, '', seo, '', ctaBlock].join('\n');
  }

  const description = $derived(generateDescription(videoTitle, keywords, channelName, ctaLink));
  const charCount = $derived(description.length);
  const firstChars = $derived(description.slice(0, 157));

  let copied = $state(false);
  function copyDescription() {
    if (!description) return;
    navigator.clipboard.writeText(description).then(() => {
      copied = true;
      setTimeout(() => (copied = false), 1800);
    });
  }
</script>

<div class="tool-theme-shell p-6 rounded-2xl font-sans min-h-[400px]">
  <!-- Header -->
  <div class="flex items-center gap-3 mb-6">
    <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-400 to-rose-700 flex items-center justify-center text-stone-950 font-black text-lg">
      📋
    </div>
    <div>
      <h2 class="font-extrabold text-lg text-rose-700 dark:bg-gradient-to-r dark:from-rose-300 dark:via-rose-100 dark:to-rose-400 dark:bg-clip-text dark:text-transparent leading-tight">
        {l.title}
      </h2>
      <p class="text-stone-500 text-xs mt-0.5">{l.subtitle}</p>
    </div>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-12 gap-6">
    <!-- Left: Inputs -->
    <div class="md:col-span-4 space-y-4">
      <label class="block">
        <span class="text-xs text-stone-400 mb-1.5 block">{l.videoTitle}</span>
        <input type="text" bind:value={videoTitle} placeholder={l.videoTitlePlaceholder}
          class="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-2 text-sm text-stone-100 focus:border-rose-500 focus:outline-none transition-colors" />
      </label>

      <label class="block">
        <span class="text-xs text-stone-400 mb-1.5 block">{l.keywords}</span>
        <textarea bind:value={keywords} placeholder={l.keywordsPlaceholder} rows="3"
          class="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-2 text-sm text-stone-100 focus:border-rose-500 focus:outline-none transition-colors resize-none"></textarea>
      </label>

      <label class="block">
        <span class="text-xs text-stone-400 mb-1.5 block">{l.channelName}</span>
        <input type="text" bind:value={channelName} placeholder={l.channelNamePlaceholder}
          class="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-2 text-sm text-stone-100 focus:border-rose-500 focus:outline-none transition-colors" />
      </label>

      <label class="block">
        <span class="text-xs text-stone-400 mb-1.5 block">{l.ctaLink}</span>
        <input type="text" bind:value={ctaLink} placeholder={l.ctaLinkPlaceholder}
          class="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-2 text-sm text-stone-100 focus:border-rose-500 focus:outline-none transition-colors" />
      </label>
    </div>

    <!-- Right: Output -->
    <div class="md:col-span-8 flex flex-col gap-4">
      {#if description}
        <!-- First 157 chars preview -->
        <div class="bg-rose-950/20 border border-rose-800/30 rounded-xl p-3">
          <p class="text-xxs text-rose-400 font-semibold mb-2 uppercase tracking-wider">{l.firstCharsLabel}</p>
          <p class="text-stone-300 text-xs leading-relaxed">{firstChars}{firstChars.length >= 157 ? '...' : ''}</p>
        </div>

        <!-- Full description -->
        <div class="bg-stone-900 border border-stone-800 rounded-xl p-4 flex-1">
          <div class="flex items-center justify-between mb-3">
            <span class="text-xxs text-stone-500">{charCount} {l.chars}</span>
            <button type="button" onclick={copyDescription}
              class="text-xs px-3 py-1.5 rounded-lg bg-rose-900/40 border border-rose-700 text-rose-300 hover:bg-rose-900/60 transition-all font-semibold">
              {copied ? l.copied : `📋 ${l.copy}`}
            </button>
          </div>
          <pre class="text-stone-300 text-xs leading-relaxed whitespace-pre-wrap select-all font-sans">{description}</pre>
        </div>
      {:else}
        <div class="flex-1 flex flex-col items-center justify-center text-center p-10 bg-stone-900/25 border border-dashed border-stone-800 rounded-xl min-h-[300px]">
          <div class="text-4xl mb-3">📋</div>
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
