<script lang="ts">
  interface Props {
    locale?: string;
    translations?: Record<string, unknown>;
  }

  let { locale = 'en', translations = {} }: Props = $props();

  const I18N_BACKUP: Record<string, Record<string, string>> = {
    zh: {
      title: 'SEO 标题生成器',
      subtitle: '生成多个 SEO 标题，实时预览 Google 搜索效果，目标 50-60 字符',
      topic: '页面主题',
      topicPlaceholder: '例如：最好的远程工作工具',
      keyword: '目标关键词',
      keywordPlaceholder: '例如：远程工作工具、效率软件',
      brand: '品牌名称 (可选)',
      brandPlaceholder: '例如：WorkSmart',
      brandPosition: '品牌位置',
      brandAfter: '品牌后置 (主题 | 品牌)',
      brandBefore: '品牌前置 (品牌 | 主题)',
      noBrand: '无品牌',
      copy: '复制',
      copied: '✓ 已复制',
      placeholderText: '输入主题和关键词，生成 SEO 优化标题并预览 Google 搜索效果。',
      disclaimer: '谷歌通常显示 50-60 字符的标题标签；超出部分会被截断。',
      charStatus_short: '偏短',
      charStatus_good: '最佳',
      charStatus_long: '可能截断',
      titleSuggestion: '标题建议',
      googlePreview: 'Google 搜索预览',
      previewUrl: 'https://example.com/your-page',
      previewDesc: '在 Google 搜索结果中，您的标题会如上显示。',
      chars: '字符',
    },
    en: {
      title: 'SEO Title Generator',
      subtitle: 'Generate optimized SEO page titles with live Google preview (50-60 char target)',
      topic: 'Page Topic',
      topicPlaceholder: 'e.g. Best remote work tools for 2025',
      keyword: 'Target Keyword',
      keywordPlaceholder: 'e.g. remote work tools, productivity apps',
      brand: 'Brand Name (optional)',
      brandPlaceholder: 'e.g. WorkSmart',
      brandPosition: 'Brand Placement',
      brandAfter: 'Brand After (Topic | Brand)',
      brandBefore: 'Brand Before (Brand | Topic)',
      noBrand: 'No Brand',
      copy: 'Copy',
      copied: '✓ Copied',
      placeholderText: 'Enter your topic and keyword to generate SEO titles with Google preview.',
      disclaimer: 'Google typically shows 50-60 characters. Titles beyond this may be truncated.',
      charStatus_short: 'Too short',
      charStatus_good: 'Optimal',
      charStatus_long: 'May truncate',
      titleSuggestion: 'Title Suggestion',
      googlePreview: 'Google Search Preview',
      previewUrl: 'https://example.com/your-page',
      previewDesc: 'Your title will appear as above in Google search results.',
      chars: 'chars',
    },
    es: {
      title: 'Generador de Títulos SEO',
      subtitle: 'Genera títulos SEO optimizados con previsualización de Google (50-60 car. objetivo)',
      topic: 'Tema de la Página',
      topicPlaceholder: 'ej. Mejores herramientas para trabajo remoto 2025',
      keyword: 'Palabra Clave Objetivo',
      keywordPlaceholder: 'ej. herramientas trabajo remoto',
      brand: 'Nombre de Marca (opcional)',
      brandPlaceholder: 'ej. WorkSmart',
      brandPosition: 'Posición de Marca',
      brandAfter: 'Marca al final (Tema | Marca)',
      brandBefore: 'Marca al inicio (Marca | Tema)',
      noBrand: 'Sin Marca',
      copy: 'Copiar',
      copied: '✓ Copiado',
      placeholderText: 'Ingresa tu tema y palabra clave para generar títulos SEO.',
      disclaimer: 'Google muestra normalmente 50-60 caracteres. Los títulos más largos pueden truncarse.',
      charStatus_short: 'Muy corto',
      charStatus_good: 'Óptimo',
      charStatus_long: 'Puede truncarse',
      titleSuggestion: 'Título Sugerido',
      googlePreview: 'Vista previa en Google',
      previewUrl: 'https://ejemplo.com/tu-pagina',
      previewDesc: 'Tu título aparecerá así en los resultados de búsqueda de Google.',
      chars: 'car.',
    },
    pt: {
      title: 'Gerador de Títulos SEO',
      subtitle: 'Gere títulos SEO otimizados com prévia do Google (alvo 50-60 car.)',
      topic: 'Tema da Página',
      topicPlaceholder: 'ex. Melhores ferramentas de trabalho remoto 2025',
      keyword: 'Palavra-chave Alvo',
      keywordPlaceholder: 'ex. ferramentas trabalho remoto',
      brand: 'Nome da Marca (opcional)',
      brandPlaceholder: 'ex. WorkSmart',
      brandPosition: 'Posição da Marca',
      brandAfter: 'Marca no final (Tema | Marca)',
      brandBefore: 'Marca no início (Marca | Tema)',
      noBrand: 'Sem Marca',
      copy: 'Copiar',
      copied: '✓ Copiado',
      placeholderText: 'Insira seu tema e palavra-chave para gerar títulos SEO.',
      disclaimer: 'Google mostra normalmente 50-60 caracteres. Títulos maiores podem ser truncados.',
      charStatus_short: 'Muito curto',
      charStatus_good: 'Ótimo',
      charStatus_long: 'Pode truncar',
      titleSuggestion: 'Título Sugerido',
      googlePreview: 'Prévia no Google',
      previewUrl: 'https://exemplo.com/sua-pagina',
      previewDesc: 'Seu título aparecerá assim nos resultados de busca do Google.',
      chars: 'car.',
    },
    ja: {
      title: 'SEOタイトル生成ツール',
      subtitle: 'Google検索結果プレビュー付きで最適なSEOタイトルを生成します（50〜60文字目安）',
      topic: 'ページのトピック',
      topicPlaceholder: '例: 2025年おすすめリモートワークツール',
      keyword: 'ターゲットキーワード',
      keywordPlaceholder: '例: リモートワーク、生産性向上ツール',
      brand: 'ブランド名（任意）',
      brandPlaceholder: '例: WorkSmart',
      brandPosition: 'ブランド位置',
      brandAfter: 'ブランドを後置（トピック | ブランド）',
      brandBefore: 'ブランドを前置（ブランド | トピック）',
      noBrand: 'ブランドなし',
      copy: 'コピー',
      copied: '✓ コピー済み',
      placeholderText: 'トピックとキーワードを入力してSEOタイトルを生成します。',
      disclaimer: 'Googleは通常50〜60文字のタイトルを表示します。超過分は省略される場合があります。',
      charStatus_short: '短すぎ',
      charStatus_good: '最適',
      charStatus_long: '省略の可能性',
      titleSuggestion: '提案タイトル',
      googlePreview: 'Google検索プレビュー',
      previewUrl: 'https://example.com/your-page',
      previewDesc: 'Googleの検索結果ではこのように表示されます。',
      chars: '文字',
    },
    fr: {
      title: 'Générateur de Titres SEO',
      subtitle: 'Générez des titres SEO optimisés avec aperçu Google (50–60 car. cibles)',
      topic: 'Sujet de la Page',
      topicPlaceholder: 'ex. Meilleurs outils de travail à distance 2025',
      keyword: 'Mot-clé Cible',
      keywordPlaceholder: 'ex. outils travail à distance',
      brand: 'Nom de Marque (optionnel)',
      brandPlaceholder: 'ex. WorkSmart',
      brandPosition: 'Position de la Marque',
      brandAfter: 'Marque à la fin (Sujet | Marque)',
      brandBefore: 'Marque au début (Marque | Sujet)',
      noBrand: 'Sans Marque',
      copy: 'Copier',
      copied: '✓ Copié',
      placeholderText: 'Saisissez votre sujet et mot-clé pour générer des titres SEO.',
      disclaimer: 'Google affiche généralement 50–60 caractères. Les titres plus longs peuvent être tronqués.',
      charStatus_short: 'Trop court',
      charStatus_good: 'Optimal',
      charStatus_long: 'Risque de troncature',
      titleSuggestion: 'Titre Suggéré',
      googlePreview: 'Aperçu Google',
      previewUrl: 'https://exemple.com/votre-page',
      previewDesc: 'Votre titre apparaîtra ainsi dans les résultats de recherche Google.',
      chars: 'car.',
    },
    de: {
      title: 'SEO-Titel-Generator',
      subtitle: 'SEO-optimierte Seitentitel mit Google-Vorschau generieren (Ziel: 50–60 Zeichen)',
      topic: 'Seitenthema',
      topicPlaceholder: 'z.B. Beste Remote-Arbeits-Tools 2025',
      keyword: 'Ziel-Schlüsselwort',
      keywordPlaceholder: 'z.B. Remote-Arbeit, Produktivitäts-Apps',
      brand: 'Markenname (optional)',
      brandPlaceholder: 'z.B. WorkSmart',
      brandPosition: 'Markenposition',
      brandAfter: 'Marke am Ende (Thema | Marke)',
      brandBefore: 'Marke am Anfang (Marke | Thema)',
      noBrand: 'Ohne Marke',
      copy: 'Kopieren',
      copied: '✓ Kopiert',
      placeholderText: 'Geben Sie Thema und Schlüsselwort ein, um SEO-Titel zu generieren.',
      disclaimer: 'Google zeigt normalerweise 50–60 Zeichen. Längere Titel könnten abgeschnitten werden.',
      charStatus_short: 'Zu kurz',
      charStatus_good: 'Optimal',
      charStatus_long: 'Kann abgeschnitten werden',
      titleSuggestion: 'Titelvorschlag',
      googlePreview: 'Google-Vorschau',
      previewUrl: 'https://beispiel.com/ihre-seite',
      previewDesc: 'Ihr Titel wird so in den Google-Suchergebnissen angezeigt.',
      chars: 'Z.',
    },
    ar: {
      title: 'مولّد عناوين SEO',
      subtitle: 'أنشئ عناوين صفحات محسّنة لمحركات البحث مع معاينة Google فورية (50-60 حرفاً)',
      topic: 'موضوع الصفحة',
      topicPlaceholder: 'مثال: أفضل أدوات العمل عن بُعد 2025',
      keyword: 'الكلمة المفتاحية الهدف',
      keywordPlaceholder: 'مثال: أدوات عمل عن بُعد',
      brand: 'اسم العلامة التجارية (اختياري)',
      brandPlaceholder: 'مثال: WorkSmart',
      brandPosition: 'موضع العلامة التجارية',
      brandAfter: 'العلامة في النهاية (الموضوع | العلامة)',
      brandBefore: 'العلامة في البداية (العلامة | الموضوع)',
      noBrand: 'بدون علامة تجارية',
      copy: 'نسخ',
      copied: '✓ تم النسخ',
      placeholderText: 'أدخل الموضوع والكلمة المفتاحية لتوليد عناوين SEO.',
      disclaimer: 'تعرض Google عادةً 50-60 حرفاً. قد يتم اقتطاع العناوين الأطول.',
      charStatus_short: 'قصير جداً',
      charStatus_good: 'مثالي',
      charStatus_long: 'قد يُقطع',
      titleSuggestion: 'العنوان المقترح',
      googlePreview: 'معاينة Google',
      previewUrl: 'https://example.com/your-page',
      previewDesc: 'سيظهر عنوانك هكذا في نتائج بحث Google.',
      chars: 'حرف',
    },
    ko: {
      title: 'SEO 제목 생성기',
      subtitle: 'Google 검색 미리보기와 함께 SEO 최적화된 페이지 제목을 생성합니다 (50-60자 목표)',
      topic: '페이지 주제',
      topicPlaceholder: '예: 2025년 최고의 원격 근무 도구',
      keyword: '목표 키워드',
      keywordPlaceholder: '예: 원격 근무 도구, 생산성 앱',
      brand: '브랜드 이름 (선택)',
      brandPlaceholder: '예: WorkSmart',
      brandPosition: '브랜드 위치',
      brandAfter: '브랜드 후미 (주제 | 브랜드)',
      brandBefore: '브랜드 선두 (브랜드 | 주제)',
      noBrand: '브랜드 없음',
      copy: '복사',
      copied: '✓ 복사됨',
      placeholderText: '주제와 키워드를 입력하여 SEO 제목을 생성하세요.',
      disclaimer: 'Google은 일반적으로 50-60자를 표시합니다. 더 긴 제목은 잘릴 수 있습니다.',
      charStatus_short: '너무 짧음',
      charStatus_good: '최적',
      charStatus_long: '잘릴 수 있음',
      titleSuggestion: '제목 제안',
      googlePreview: 'Google 검색 미리보기',
      previewUrl: 'https://example.com/your-page',
      previewDesc: 'Google 검색 결과에서 제목이 위와 같이 표시됩니다.',
      chars: '자',
    },
    ru: {
      title: 'Генератор SEO-заголовков',
      subtitle: 'Генерируйте оптимальные SEO-заголовки с превью в Google (цель 50–60 симв.)',
      topic: 'Тема страницы',
      topicPlaceholder: 'например: Лучшие инструменты для удалённой работы 2025',
      keyword: 'Целевое ключевое слово',
      keywordPlaceholder: 'например: инструменты удалённой работы',
      brand: 'Название бренда (необязательно)',
      brandPlaceholder: 'например: WorkSmart',
      brandPosition: 'Позиция бренда',
      brandAfter: 'Бренд в конце (Тема | Бренд)',
      brandBefore: 'Бренд в начале (Бренд | Тема)',
      noBrand: 'Без бренда',
      copy: 'Копировать',
      copied: '✓ Скопировано',
      placeholderText: 'Введите тему и ключевое слово для генерации SEO-заголовков.',
      disclaimer: 'Google обычно показывает 50–60 символов. Более длинные заголовки могут быть обрезаны.',
      charStatus_short: 'Слишком короткий',
      charStatus_good: 'Оптимально',
      charStatus_long: 'Может обрезаться',
      titleSuggestion: 'Предложенный заголовок',
      googlePreview: 'Превью в Google',
      previewUrl: 'https://example.com/your-page',
      previewDesc: 'Ваш заголовок будет отображаться так в результатах поиска Google.',
      chars: 'симв.',
    },
  };

  const l = $derived(I18N_BACKUP[locale] || I18N_BACKUP['en']);

  let topic = $state('');
  let keyword = $state('');
  let brand = $state('');
  let brandPosition = $state('after');
  let selectedIdx = $state(0);

  function buildTitle(base: string, br: string, pos: string): string {
    if (!br) return base;
    if (pos === 'after') return `${base} | ${br}`;
    if (pos === 'before') return `${br} | ${base}`;
    return base;
  }

  function generateTitles(topic: string, kw: string, br: string, pos: string): string[] {
    const t = topic.trim();
    if (!t) return [];
    const k = kw.trim() || t;

    const bases = [
      `${k}: ${t}`,
      `${t} – ${k} Guide`,
      `Best ${k} Tips: ${t}`,
      `${t} | ${k} Strategies`,
      `Top ${k} for ${t}`,
    ];

    return bases.map(b => buildTitle(b, br.trim(), pos));
  }

  const titles = $derived(generateTitles(topic, keyword, brand, brandPosition));
  const selectedTitle = $derived(titles[selectedIdx] || '');

  function charStatus(len: number): 'short' | 'good' | 'long' {
    if (len < 50) return 'short';
    if (len <= 60) return 'good';
    return 'long';
  }

  function statusColor(s: string): string {
    if (s === 'good') return 'text-green-400';
    if (s === 'short') return 'text-yellow-400';
    return 'text-red-400';
  }

  function barColor(s: string): string {
    if (s === 'good') return 'bg-green-500';
    if (s === 'short') return 'bg-yellow-500';
    return 'bg-red-500';
  }

  let copiedIndex = $state<number | null>(null);
  function copyTitle(text: string, idx: number) {
    navigator.clipboard.writeText(text).then(() => {
      copiedIndex = idx;
      setTimeout(() => (copiedIndex = null), 1500);
    });
  }
</script>

<div class="tool-theme-shell p-6 rounded-2xl font-sans min-h-[400px]">
  <!-- Header -->
  <div class="flex items-center gap-3 mb-6">
    <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-700 flex items-center justify-center text-stone-950 font-black text-lg">
      🏆
    </div>
    <div>
      <h2 class="font-extrabold text-lg text-emerald-700 dark:bg-gradient-to-r dark:from-emerald-300 dark:via-emerald-100 dark:to-emerald-400 dark:bg-clip-text dark:text-transparent leading-tight">
        {l.title}
      </h2>
      <p class="text-stone-500 text-xs mt-0.5">{l.subtitle}</p>
    </div>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-12 gap-6">
    <!-- Left: Inputs -->
    <div class="md:col-span-5 space-y-4">
      <label class="block">
        <span class="text-xs text-stone-400 mb-1.5 block">{l.topic}</span>
        <input type="text" bind:value={topic} placeholder={l.topicPlaceholder}
          class="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-2 text-sm text-stone-100 focus:border-emerald-500 focus:outline-none transition-colors" />
      </label>

      <label class="block">
        <span class="text-xs text-stone-400 mb-1.5 block">{l.keyword}</span>
        <input type="text" bind:value={keyword} placeholder={l.keywordPlaceholder}
          class="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-2 text-sm text-stone-100 focus:border-emerald-500 focus:outline-none transition-colors" />
      </label>

      <label class="block">
        <span class="text-xs text-stone-400 mb-1.5 block">{l.brand}</span>
        <input type="text" bind:value={brand} placeholder={l.brandPlaceholder}
          class="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-2 text-sm text-stone-100 focus:border-emerald-500 focus:outline-none transition-colors" />
      </label>

      <div>
        <span class="text-xs text-stone-400 mb-2 block">{l.brandPosition}</span>
        <div class="grid grid-cols-1 gap-1.5">
          {#each [['after', l.brandAfter], ['before', l.brandBefore], ['none', l.noBrand]] as [val, label]}
            <button type="button" onclick={() => (brandPosition = val)}
              class="py-1.5 px-3 text-xs rounded-lg border transition-all text-left {brandPosition === val ? 'bg-emerald-950/40 border-emerald-600 text-emerald-300' : 'bg-stone-900 border-stone-800 text-stone-400 hover:border-stone-700'}">
              {label}
            </button>
          {/each}
        </div>
      </div>
    </div>

    <!-- Right: Output -->
    <div class="md:col-span-7 flex flex-col gap-4">
      {#if titles.length > 0}
        <!-- Title list -->
        <div class="space-y-2">
          {#each titles as title, idx}
            {@const st = charStatus(title.length)}
            <div onclick={() => (selectedIdx = idx)}
              class="bg-stone-900 border rounded-lg px-3 py-2.5 flex items-center gap-3 cursor-pointer transition-all {selectedIdx === idx ? 'border-emerald-600 bg-emerald-950/20' : 'border-stone-800 hover:border-stone-700'}">
              <div class="flex-1">
                <p class="text-stone-200 text-sm leading-snug">{title}</p>
                <div class="flex items-center gap-2 mt-1">
                  <div class="h-1 w-24 bg-stone-800 rounded-full overflow-hidden">
                    <div class="h-full {barColor(st)} rounded-full" style="width: {Math.min((title.length / 60) * 100, 100)}%"></div>
                  </div>
                  <span class="text-xxs {statusColor(st)} font-semibold">{title.length} {l.chars}</span>
                </div>
              </div>
              <button type="button" onclick={(e) => { e.stopPropagation(); copyTitle(title, idx); }}
                class="text-xxs px-2 py-0.5 rounded border border-stone-700 hover:border-emerald-500 text-stone-500 hover:text-emerald-400 transition-all shrink-0">
                {copiedIndex === idx ? l.copied : l.copy}
              </button>
            </div>
          {/each}
        </div>

        <!-- Google Preview -->
        {#if selectedTitle}
          <div class="bg-stone-900 border border-stone-800 rounded-xl p-4">
            <p class="text-xxs text-emerald-400 font-semibold uppercase tracking-wider mb-3">{l.googlePreview}</p>
            <div class="bg-white rounded-lg p-4">
              <p class="text-blue-700 text-base font-medium leading-snug truncate"
                style="font-family: arial, sans-serif; font-size: 18px;">
                {selectedTitle}
              </p>
              <p class="text-green-700 text-xs mt-0.5" style="font-family: arial, sans-serif;">{l.previewUrl}</p>
              <p class="text-stone-600 text-xs mt-1 leading-relaxed" style="font-family: arial, sans-serif;">
                {l.previewDesc}
              </p>
            </div>
          </div>
        {/if}
      {:else}
        <div class="flex-1 flex flex-col items-center justify-center text-center p-10 bg-stone-900/25 border border-dashed border-stone-800 rounded-xl min-h-[300px]">
          <div class="text-4xl mb-3">🏆</div>
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
