<script lang="ts">
  interface Props {
    locale?: string;
    translations?: Record<string, unknown>;
  }

  let { locale = 'en', translations = {} }: Props = $props();

  const I18N_BACKUP: Record<string, Record<string, string>> = {
    zh: {
      title: 'Meta 描述生成器',
      subtitle: '为您的页面生成 SEO 友好的 meta 描述，实时字符计数，目标 120-160 字符',
      pageTopic: '页面主题',
      pageTopicPlaceholder: '例如：如何提高团队远程协作效率',
      keyword: '目标关键词',
      keywordPlaceholder: '例如：远程协作、效率提升',
      cta: '行动号召 (可选)',
      ctaPlaceholder: '例如：立即了解、免费体验',
      generate: '生成描述',
      copy: '复制',
      copied: '✓ 已复制',
      placeholderText: '输入页面主题和关键词，生成高质量 meta 描述。',
      disclaimer: '建议将关键词自然融入描述，避免关键词堆砌以获得最佳 SEO 效果。',
      charStatus_short: '偏短',
      charStatus_good: '长度合适',
      charStatus_long: '过长',
      suggestion: '描述建议',
      of: '/',
      targetRange: '目标: 120–160 字符',
    },
    en: {
      title: 'Meta Description Generator',
      subtitle: 'Generate SEO-optimized meta descriptions with live character count (120-160 chars)',
      pageTopic: 'Page Topic',
      pageTopicPlaceholder: 'e.g. How to improve remote team collaboration',
      keyword: 'Target Keyword',
      keywordPlaceholder: 'e.g. remote collaboration, productivity tips',
      cta: 'Call to Action (optional)',
      ctaPlaceholder: 'e.g. Learn more, Get started free',
      generate: 'Generate Descriptions',
      copy: 'Copy',
      copied: '✓ Copied',
      placeholderText: 'Enter your page topic and keyword to generate quality meta descriptions.',
      disclaimer: 'Include your keyword naturally. Avoid keyword stuffing for best SEO results.',
      charStatus_short: 'Too Short',
      charStatus_good: 'Good Length',
      charStatus_long: 'Too Long',
      suggestion: 'Suggested Description',
      of: '/',
      targetRange: 'Target: 120–160 chars',
    },
    es: {
      title: 'Generador de Meta Descripciones',
      subtitle: 'Genera meta descripciones SEO optimizadas con contador de caracteres (120-160 car.)',
      pageTopic: 'Tema de la Página',
      pageTopicPlaceholder: 'ej. Cómo mejorar la colaboración en equipos remotos',
      keyword: 'Palabra Clave Objetivo',
      keywordPlaceholder: 'ej. colaboración remota, productividad',
      cta: 'Llamada a la Acción (opcional)',
      ctaPlaceholder: 'ej. Aprende más, Empieza gratis',
      generate: 'Generar Descripciones',
      copy: 'Copiar',
      copied: '✓ Copiado',
      placeholderText: 'Ingresa el tema y la palabra clave para generar meta descripciones.',
      disclaimer: 'Incluye tu palabra clave de forma natural para mejores resultados SEO.',
      charStatus_short: 'Muy corta',
      charStatus_good: 'Longitud correcta',
      charStatus_long: 'Muy larga',
      suggestion: 'Descripción Sugerida',
      of: '/',
      targetRange: 'Objetivo: 120–160 car.',
    },
    pt: {
      title: 'Gerador de Meta Descrições',
      subtitle: 'Gere meta descrições SEO otimizadas com contagem de caracteres (120-160 car.)',
      pageTopic: 'Tema da Página',
      pageTopicPlaceholder: 'ex. Como melhorar a colaboração de equipes remotas',
      keyword: 'Palavra-chave Alvo',
      keywordPlaceholder: 'ex. colaboração remota, dicas de produtividade',
      cta: 'Chamada para Ação (opcional)',
      ctaPlaceholder: 'ex. Saiba mais, Comece gratuitamente',
      generate: 'Gerar Descrições',
      copy: 'Copiar',
      copied: '✓ Copiado',
      placeholderText: 'Insira o tema e a palavra-chave para gerar meta descrições.',
      disclaimer: 'Inclua sua palavra-chave naturalmente para melhores resultados de SEO.',
      charStatus_short: 'Muito curta',
      charStatus_good: 'Tamanho certo',
      charStatus_long: 'Muito longa',
      suggestion: 'Descrição Sugerida',
      of: '/',
      targetRange: 'Alvo: 120–160 car.',
    },
    ja: {
      title: 'メタディスクリプション生成ツール',
      subtitle: 'SEO最適化されたmeta descriptionをリアルタイム文字数カウントで生成します（120〜160文字目安）',
      pageTopic: 'ページのトピック',
      pageTopicPlaceholder: '例: リモートチームのコラボレーション改善方法',
      keyword: 'ターゲットキーワード',
      keywordPlaceholder: '例: リモートコラボレーション、生産性向上',
      cta: 'CTA（任意）',
      ctaPlaceholder: '例: 詳しくはこちら、無料で始める',
      generate: 'ディスクリプションを生成',
      copy: 'コピー',
      copied: '✓ コピー済み',
      placeholderText: 'トピックとキーワードを入力してmeta descriptionを生成します。',
      disclaimer: 'キーワードを自然に含めてください。キーワードの詰め込みはSEOに悪影響です。',
      charStatus_short: '短すぎ',
      charStatus_good: '最適',
      charStatus_long: '長すぎ',
      suggestion: '提案されたディスクリプション',
      of: '/',
      targetRange: '目標: 120〜160文字',
    },
    fr: {
      title: 'Générateur de Meta Descriptions',
      subtitle: 'Générez des meta descriptions SEO optimisées avec compteur de caractères (120–160 car.)',
      pageTopic: 'Sujet de la Page',
      pageTopicPlaceholder: 'ex. Comment améliorer la collaboration des équipes à distance',
      keyword: 'Mot-clé Cible',
      keywordPlaceholder: 'ex. collaboration à distance, productivité',
      cta: 'Appel à l\'action (optionnel)',
      ctaPlaceholder: 'ex. En savoir plus, Démarrez gratuitement',
      generate: 'Générer des Descriptions',
      copy: 'Copier',
      copied: '✓ Copié',
      placeholderText: 'Saisissez le sujet et le mot-clé pour générer des meta descriptions.',
      disclaimer: 'Incluez votre mot-clé naturellement. Évitez le bourrage de mots-clés.',
      charStatus_short: 'Trop courte',
      charStatus_good: 'Longueur parfaite',
      charStatus_long: 'Trop longue',
      suggestion: 'Description Suggérée',
      of: '/',
      targetRange: 'Cible: 120–160 car.',
    },
    de: {
      title: 'Meta-Beschreibungs-Generator',
      subtitle: 'SEO-optimierte Meta-Beschreibungen mit Live-Zeichenzähler erstellen (120–160 Zeichen)',
      pageTopic: 'Seitenthema',
      pageTopicPlaceholder: 'z.B. Wie man die Zusammenarbeit im Remote-Team verbessert',
      keyword: 'Ziel-Schlüsselwort',
      keywordPlaceholder: 'z.B. Remote-Zusammenarbeit, Produktivitätstipps',
      cta: 'Call-to-Action (optional)',
      ctaPlaceholder: 'z.B. Mehr erfahren, Kostenlos starten',
      generate: 'Beschreibungen generieren',
      copy: 'Kopieren',
      copied: '✓ Kopiert',
      placeholderText: 'Geben Sie Thema und Schlüsselwort ein, um Meta-Beschreibungen zu generieren.',
      disclaimer: 'Schlüsselwort natürlich einbauen. Keyword-Stuffing vermeiden.',
      charStatus_short: 'Zu kurz',
      charStatus_good: 'Optimale Länge',
      charStatus_long: 'Zu lang',
      suggestion: 'Vorgeschlagene Beschreibung',
      of: '/',
      targetRange: 'Ziel: 120–160 Zeichen',
    },
    ar: {
      title: 'مولّد الوصف التعريفي (Meta Description)',
      subtitle: 'أنشئ أوصافاً تعريفية محسّنة لمحركات البحث مع عداد أحرف فوري (120-160 حرف)',
      pageTopic: 'موضوع الصفحة',
      pageTopicPlaceholder: 'مثال: كيفية تحسين التعاون في الفرق عن بُعد',
      keyword: 'الكلمة المفتاحية الهدف',
      keywordPlaceholder: 'مثال: تعاون عن بُعد، نصائح إنتاجية',
      cta: 'دعوة للعمل (اختياري)',
      ctaPlaceholder: 'مثال: اعرف أكثر، ابدأ مجاناً',
      generate: 'توليد الأوصاف',
      copy: 'نسخ',
      copied: '✓ تم النسخ',
      placeholderText: 'أدخل الموضوع والكلمة المفتاحية لتوليد أوصاف تعريفية.',
      disclaimer: 'ادمج كلمتك المفتاحية بشكل طبيعي. تجنب حشو الكلمات المفتاحية.',
      charStatus_short: 'قصير جداً',
      charStatus_good: 'طول مثالي',
      charStatus_long: 'طويل جداً',
      suggestion: 'الوصف المقترح',
      of: '/',
      targetRange: 'الهدف: 120-160 حرف',
    },
    ko: {
      title: 'Meta 설명 생성기',
      subtitle: '실시간 글자수 카운터로 SEO 최적화된 meta 설명을 생성합니다 (120-160자 목표)',
      pageTopic: '페이지 주제',
      pageTopicPlaceholder: '예: 원격 팀 협업을 개선하는 방법',
      keyword: '목표 키워드',
      keywordPlaceholder: '예: 원격 협업, 생산성 향상',
      cta: '행동 유도 문구 (선택)',
      ctaPlaceholder: '예: 자세히 알아보기, 무료로 시작',
      generate: '설명 생성',
      copy: '복사',
      copied: '✓ 복사됨',
      placeholderText: '페이지 주제와 키워드를 입력하여 meta 설명을 생성하세요.',
      disclaimer: '키워드를 자연스럽게 포함하세요. 키워드 남용은 SEO에 해롭습니다.',
      charStatus_short: '너무 짧음',
      charStatus_good: '적정 길이',
      charStatus_long: '너무 김',
      suggestion: '제안된 설명',
      of: '/',
      targetRange: '목표: 120–160자',
    },
    ru: {
      title: 'Генератор Meta-описаний',
      subtitle: 'Создайте SEO-оптимизированные мета-описания с подсчётом символов (120–160 симв.)',
      pageTopic: 'Тема страницы',
      pageTopicPlaceholder: 'например: Как улучшить сотрудничество в удалённой команде',
      keyword: 'Целевое ключевое слово',
      keywordPlaceholder: 'например: удалённое сотрудничество, советы по продуктивности',
      cta: 'Призыв к действию (необязательно)',
      ctaPlaceholder: 'например: Узнать больше, Начать бесплатно',
      generate: 'Сгенерировать',
      copy: 'Копировать',
      copied: '✓ Скопировано',
      placeholderText: 'Введите тему и ключевое слово для генерации мета-описаний.',
      disclaimer: 'Включите ключевое слово естественно. Избегайте переспама ключевыми словами.',
      charStatus_short: 'Слишком короткое',
      charStatus_good: 'Оптимальная длина',
      charStatus_long: 'Слишком длинное',
      suggestion: 'Предложенное описание',
      of: '/',
      targetRange: 'Цель: 120–160 симв.',
    },
  };

  const l = $derived(I18N_BACKUP[locale] || I18N_BACKUP['en']);

  let pageTopic = $state('');
  let keyword = $state('');
  let cta = $state('');

  function generateDescriptions(topic: string, kw: string, ctaText: string): string[] {
    const t = topic.trim();
    if (!t) return [];
    const k = kw.trim() || t;
    const c = ctaText.trim();
    const ctaPart = c ? ` ${c}.` : '';

    return [
      `${t} — discover ${k} tips, expert insights and step-by-step strategies to achieve better results.${ctaPart}`.slice(0, 160),
      `Looking for the best ${k} guide? Learn everything you need about ${t} with practical advice and proven techniques.${ctaPart}`.slice(0, 160),
      `Master ${k} today. Our comprehensive guide to ${t} covers all you need to know to succeed.${ctaPart}`.slice(0, 160),
    ];
  }

  const descriptions = $derived(generateDescriptions(pageTopic, keyword, cta));

  function charStatus(len: number): 'short' | 'good' | 'long' {
    if (len < 120) return 'short';
    if (len <= 160) return 'good';
    return 'long';
  }

  function barColor(status: string): string {
    if (status === 'good') return 'bg-green-500';
    if (status === 'short') return 'bg-yellow-500';
    return 'bg-red-500';
  }

  function barWidth(len: number): number {
    return Math.min((len / 160) * 100, 100);
  }

  let copiedIndex = $state<number | null>(null);
  function copyDesc(text: string, idx: number) {
    navigator.clipboard.writeText(text).then(() => {
      copiedIndex = idx;
      setTimeout(() => (copiedIndex = null), 1500);
    });
  }
</script>

<div class="tool-theme-shell p-6 rounded-2xl font-sans min-h-[400px]">
  <!-- Header -->
  <div class="flex items-center gap-3 mb-6">
    <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-400 to-sky-700 flex items-center justify-center text-stone-950 font-black text-lg">
      🔍
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
    <!-- Left: Inputs -->
    <div class="md:col-span-5 space-y-4">
      <label class="block">
        <span class="text-xs text-stone-400 mb-1.5 block">{l.pageTopic}</span>
        <input
          type="text"
          bind:value={pageTopic}
          placeholder={l.pageTopicPlaceholder}
          class="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-2 text-sm text-stone-100 focus:border-sky-500 focus:outline-none transition-colors"
        />
      </label>

      <label class="block">
        <span class="text-xs text-stone-400 mb-1.5 block">{l.keyword}</span>
        <input
          type="text"
          bind:value={keyword}
          placeholder={l.keywordPlaceholder}
          class="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-2 text-sm text-stone-100 focus:border-sky-500 focus:outline-none transition-colors"
        />
      </label>

      <label class="block">
        <span class="text-xs text-stone-400 mb-1.5 block">{l.cta}</span>
        <input
          type="text"
          bind:value={cta}
          placeholder={l.ctaPlaceholder}
          class="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-2 text-sm text-stone-100 focus:border-sky-500 focus:outline-none transition-colors"
        />
      </label>

      <div class="bg-stone-900/50 border border-stone-800 rounded-lg p-3 text-xxs text-stone-500 leading-relaxed">
        <div class="flex gap-3">
          <span class="flex items-center gap-1"><span class="inline-block w-2 h-2 rounded-full bg-yellow-500"></span> {l.charStatus_short} &lt;120</span>
          <span class="flex items-center gap-1"><span class="inline-block w-2 h-2 rounded-full bg-green-500"></span> {l.charStatus_good} 120-160</span>
          <span class="flex items-center gap-1"><span class="inline-block w-2 h-2 rounded-full bg-red-500"></span> {l.charStatus_long} &gt;160</span>
        </div>
      </div>
    </div>

    <!-- Right: Output -->
    <div class="md:col-span-7 flex flex-col gap-4">
      {#if descriptions.length > 0}
        {#each descriptions as desc, idx}
          {@const status = charStatus(desc.length)}
          {@const color = barColor(status)}
          <div class="bg-stone-900 border border-stone-800 rounded-xl p-4 hover:border-sky-500/30 transition-all">
            <div class="flex items-center justify-between mb-2">
              <span class="text-xxs text-sky-400 font-semibold uppercase tracking-wider">{l.suggestion} {idx + 1}</span>
              <button
                type="button"
                onclick={() => copyDesc(desc, idx)}
                class="text-xxs px-2 py-0.5 rounded border border-stone-700 hover:border-sky-500 text-stone-500 hover:text-sky-400 transition-all"
              >
                {copiedIndex === idx ? l.copied : l.copy}
              </button>
            </div>
            <p class="text-stone-200 text-sm leading-relaxed mb-3 select-all">{desc}</p>
            <!-- Character count bar -->
            <div>
              <div class="h-1.5 bg-stone-800 rounded-full overflow-hidden mb-1">
                <div class="h-full {color} rounded-full transition-all duration-300" style="width: {barWidth(desc.length)}%"></div>
              </div>
              <div class="flex justify-between text-xxs">
                <span class="{status === 'good' ? 'text-green-400' : status === 'short' ? 'text-yellow-400' : 'text-red-400'} font-semibold">
                  {l['charStatus_' + status]}
                </span>
                <span class="text-stone-600">{desc.length} {l.of} 160</span>
              </div>
            </div>
          </div>
        {/each}
      {:else}
        <div class="flex-1 flex flex-col items-center justify-center text-center p-10 bg-stone-900/25 border border-dashed border-stone-800 rounded-xl min-h-[280px]">
          <div class="text-4xl mb-3">🔍</div>
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
