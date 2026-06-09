<script lang="ts">
  interface Props {
    locale?: string;
    translations?: Record<string, unknown>;
  }

  let { locale = 'en', translations = {} }: Props = $props();

  const I18N_BACKUP: Record<string, Record<string, string>> = {
    zh: {
      title: 'Stable Diffusion Prompt 生成器',
      subtitle: '构建格式化的正面/负面提示词，包含采样参数建议',
      subject: '主题描述',
      subjectPlaceholder: '例如：一位穿着红色连衣裙的年轻女性在花园中',
      qualityWords: '画质词',
      styleWords: '风格词',
      characterWords: '人物词',
      environmentWords: '环境词',
      negativePrompt: '负面提示词（选择常用负面词）',
      samplingParams: '采样参数建议',
      steps: '采样步数',
      cfg: 'CFG 强度',
      sampler: '采样器',
      loraHint: 'LoRA / 模型提示',
      positivePromptLabel: '正面 Prompt',
      negativePromptLabel: '负面 Prompt',
      copy: '复制',
      copied: '✓ 已复制',
      copyAll: '复制全部',
      generate: '生成 Prompt',
      disclaimer: '生成的 Prompt 为参考模板，效果因模型而异。',
      placeholderText: '选择提示词组件并描述主题，点击生成。',
    },
    en: {
      title: 'Stable Diffusion Prompt Generator',
      subtitle: 'Build formatted positive/negative prompts with sampling parameter suggestions',
      subject: 'Subject Description',
      subjectPlaceholder: 'e.g. A young woman in a red dress in a garden',
      qualityWords: 'Quality Tags',
      styleWords: 'Style Tags',
      characterWords: 'Character Tags',
      environmentWords: 'Environment Tags',
      negativePrompt: 'Negative Prompt (select common negative tags)',
      samplingParams: 'Sampling Parameters',
      steps: 'Steps',
      cfg: 'CFG Scale',
      sampler: 'Sampler',
      loraHint: 'LoRA / Model Tips',
      positivePromptLabel: 'Positive Prompt',
      negativePromptLabel: 'Negative Prompt',
      copy: 'Copy',
      copied: '✓ Copied',
      copyAll: 'Copy All',
      generate: 'Generate Prompt',
      disclaimer: 'Generated prompts are reference templates. Results vary by model.',
      placeholderText: 'Select tags and describe your subject, then click Generate.',
    },
    es: {
      title: 'Generador de Prompts para Stable Diffusion',
      subtitle: 'Construye prompts positivos/negativos formateados con sugerencias de parámetros',
      subject: 'Descripción del Tema',
      subjectPlaceholder: 'ej. Una joven con vestido rojo en un jardín',
      qualityWords: 'Tags de Calidad',
      styleWords: 'Tags de Estilo',
      characterWords: 'Tags de Personaje',
      environmentWords: 'Tags de Entorno',
      negativePrompt: 'Prompt Negativo (seleccionar tags comunes)',
      samplingParams: 'Parámetros de Muestreo',
      steps: 'Pasos',
      cfg: 'Escala CFG',
      sampler: 'Muestreador',
      loraHint: 'Consejos de LoRA / Modelo',
      positivePromptLabel: 'Prompt Positivo',
      negativePromptLabel: 'Prompt Negativo',
      copy: 'Copiar',
      copied: '✓ Copiado',
      copyAll: 'Copiar Todo',
      generate: 'Generar Prompt',
      disclaimer: 'Los prompts generados son plantillas de referencia. Los resultados varían según el modelo.',
      placeholderText: 'Selecciona tags, describe tu tema y haz clic en Generar.',
    },
    pt: {
      title: 'Gerador de Prompts para Stable Diffusion',
      subtitle: 'Crie prompts positivos/negativos formatados com sugestões de parâmetros',
      subject: 'Descrição do Tema',
      subjectPlaceholder: 'ex. Uma jovem de vestido vermelho em um jardim',
      qualityWords: 'Tags de Qualidade',
      styleWords: 'Tags de Estilo',
      characterWords: 'Tags de Personagem',
      environmentWords: 'Tags de Ambiente',
      negativePrompt: 'Prompt Negativo (selecionar tags comuns)',
      samplingParams: 'Parâmetros de Amostragem',
      steps: 'Etapas',
      cfg: 'Escala CFG',
      sampler: 'Amostrador',
      loraHint: 'Dicas de LoRA / Modelo',
      positivePromptLabel: 'Prompt Positivo',
      negativePromptLabel: 'Prompt Negativo',
      copy: 'Copiar',
      copied: '✓ Copiado',
      copyAll: 'Copiar Tudo',
      generate: 'Gerar Prompt',
      disclaimer: 'Os prompts gerados são modelos de referência. Os resultados variam por modelo.',
      placeholderText: 'Selecione tags, descreva seu tema e clique em Gerar.',
    },
    ja: {
      title: 'Stable Diffusion プロンプトジェネレーター',
      subtitle: 'サンプリングパラメータ提案付きのポジティブ/ネガティブプロンプトを生成',
      subject: '被写体の説明',
      subjectPlaceholder: '例：庭でレッドドレスを着た若い女性',
      qualityWords: '品質タグ',
      styleWords: 'スタイルタグ',
      characterWords: 'キャラクタータグ',
      environmentWords: '環境タグ',
      negativePrompt: 'ネガティブプロンプト（一般的なタグを選択）',
      samplingParams: 'サンプリングパラメータ',
      steps: 'ステップ数',
      cfg: 'CFG スケール',
      sampler: 'サンプラー',
      loraHint: 'LoRA / モデルのヒント',
      positivePromptLabel: 'ポジティブプロンプト',
      negativePromptLabel: 'ネガティブプロンプト',
      copy: 'コピー',
      copied: '✓ コピー済み',
      copyAll: 'すべてコピー',
      generate: 'プロンプトを生成',
      disclaimer: '生成されたプロンプトは参考テンプレートです。モデルによって結果が異なります。',
      placeholderText: 'タグを選択して被写体を説明し、「プロンプトを生成」をクリックしてください。',
    },
    fr: {
      title: 'Générateur de Prompts Stable Diffusion',
      subtitle: 'Créez des prompts positifs/négatifs formatés avec des suggestions de paramètres',
      subject: 'Description du Sujet',
      subjectPlaceholder: 'ex. Une jeune femme en robe rouge dans un jardin',
      qualityWords: 'Tags de Qualité',
      styleWords: 'Tags de Style',
      characterWords: 'Tags de Personnage',
      environmentWords: 'Tags d\'Environnement',
      negativePrompt: 'Prompt Négatif (sélectionner les tags courants)',
      samplingParams: 'Paramètres d\'Échantillonnage',
      steps: 'Étapes',
      cfg: 'Échelle CFG',
      sampler: 'Échantillonneur',
      loraHint: 'Conseils LoRA / Modèle',
      positivePromptLabel: 'Prompt Positif',
      negativePromptLabel: 'Prompt Négatif',
      copy: 'Copier',
      copied: '✓ Copié',
      copyAll: 'Tout Copier',
      generate: 'Générer le Prompt',
      disclaimer: 'Les prompts générés sont des modèles de référence. Les résultats varient selon le modèle.',
      placeholderText: 'Sélectionnez des tags, décrivez votre sujet et cliquez sur Générer.',
    },
    de: {
      title: 'Stable-Diffusion-Prompt-Generator',
      subtitle: 'Erstellen Sie formatierte Positiv-/Negativprompts mit Sampling-Parameter-Empfehlungen',
      subject: 'Motivbeschreibung',
      subjectPlaceholder: 'z.B. Eine junge Frau in einem roten Kleid in einem Garten',
      qualityWords: 'Qualitäts-Tags',
      styleWords: 'Stil-Tags',
      characterWords: 'Charakter-Tags',
      environmentWords: 'Umgebungs-Tags',
      negativePrompt: 'Negativprompt (gängige Tags auswählen)',
      samplingParams: 'Sampling-Parameter',
      steps: 'Schritte',
      cfg: 'CFG-Skala',
      sampler: 'Sampler',
      loraHint: 'LoRA / Modell-Tipps',
      positivePromptLabel: 'Positivprompt',
      negativePromptLabel: 'Negativprompt',
      copy: 'Kopieren',
      copied: '✓ Kopiert',
      copyAll: 'Alles Kopieren',
      generate: 'Prompt Generieren',
      disclaimer: 'Generierte Prompts sind Referenzvorlagen. Ergebnisse variieren je nach Modell.',
      placeholderText: 'Wählen Sie Tags aus, beschreiben Sie Ihr Motiv und klicken Sie auf Generieren.',
    },
    ar: {
      title: 'مولّد Prompts لـ Stable Diffusion',
      subtitle: 'أنشئ Prompts إيجابية/سلبية منسقة مع اقتراحات معاملات الأخذ بالعينات',
      subject: 'وصف الموضوع',
      subjectPlaceholder: 'مثال: شابة ترتدي فستاناً أحمر في حديقة',
      qualityWords: 'وسوم الجودة',
      styleWords: 'وسوم الأسلوب',
      characterWords: 'وسوم الشخصية',
      environmentWords: 'وسوم البيئة',
      negativePrompt: 'Prompt سلبي (اختر وسوماً شائعة)',
      samplingParams: 'معاملات الأخذ بالعينات',
      steps: 'الخطوات',
      cfg: 'مقياس CFG',
      sampler: 'أداة الأخذ بالعينات',
      loraHint: 'تلميحات LoRA / النموذج',
      positivePromptLabel: 'Prompt إيجابي',
      negativePromptLabel: 'Prompt سلبي',
      copy: 'نسخ',
      copied: '✓ تم النسخ',
      copyAll: 'نسخ الكل',
      generate: 'توليد Prompt',
      disclaimer: 'الـ Prompts المولّدة هي قوالب مرجعية. تختلف النتائج حسب النموذج.',
      placeholderText: 'اختر الوسوم وصف موضوعك ثم اضغط على توليد.',
    },
    ko: {
      title: 'Stable Diffusion 프롬프트 생성기',
      subtitle: '샘플링 파라미터 제안이 포함된 포지티브/네거티브 프롬프트 생성',
      subject: '주제 설명',
      subjectPlaceholder: '예: 정원에서 빨간 드레스를 입은 젊은 여성',
      qualityWords: '품질 태그',
      styleWords: '스타일 태그',
      characterWords: '캐릭터 태그',
      environmentWords: '환경 태그',
      negativePrompt: '네거티브 프롬프트 (일반 태그 선택)',
      samplingParams: '샘플링 파라미터',
      steps: '스텝',
      cfg: 'CFG 스케일',
      sampler: '샘플러',
      loraHint: 'LoRA / 모델 팁',
      positivePromptLabel: '포지티브 프롬프트',
      negativePromptLabel: '네거티브 프롬프트',
      copy: '복사',
      copied: '✓ 복사됨',
      copyAll: '전체 복사',
      generate: '프롬프트 생성',
      disclaimer: '생성된 프롬프트는 참고 템플릿입니다. 결과는 모델마다 다릅니다.',
      placeholderText: '태그를 선택하고 주제를 설명한 후 생성 버튼을 클릭하세요.',
    },
    ru: {
      title: 'Генератор Промптов для Stable Diffusion',
      subtitle: 'Создавайте форматированные позитивные/негативные промпты с рекомендациями параметров',
      subject: 'Описание Темы',
      subjectPlaceholder: 'напр. Молодая женщина в красном платье в саду',
      qualityWords: 'Теги Качества',
      styleWords: 'Теги Стиля',
      characterWords: 'Теги Персонажа',
      environmentWords: 'Теги Окружения',
      negativePrompt: 'Негативный Промпт (выберите распространённые теги)',
      samplingParams: 'Параметры Семплирования',
      steps: 'Шаги',
      cfg: 'Шкала CFG',
      sampler: 'Сэмплер',
      loraHint: 'Советы по LoRA / Модели',
      positivePromptLabel: 'Позитивный Промпт',
      negativePromptLabel: 'Негативный Промпт',
      copy: 'Копировать',
      copied: '✓ Скопировано',
      copyAll: 'Копировать Всё',
      generate: 'Сгенерировать Промпт',
      disclaimer: 'Сгенерированные промпты являются шаблонами. Результаты зависят от модели.',
      placeholderText: 'Выберите теги, опишите тему и нажмите «Сгенерировать».',
    },
  };

  const l = $derived(I18N_BACKUP[locale] || I18N_BACKUP['en']);

  const QUALITY_TAGS = [
    'masterpiece', 'best quality', 'ultra-detailed', '8k', 'highres',
    'sharp focus', 'RAW photo', 'professional', 'absurdres', '4k resolution',
  ];

  const STYLE_TAGS = [
    'photorealistic', 'anime style', 'oil painting', 'watercolor', 'digital art',
    'concept art', 'illustration', 'cinematic', 'dramatic lighting', 'bokeh',
  ];

  const CHARACTER_TAGS = [
    '1girl', '1boy', 'beautiful face', 'detailed eyes', 'long hair',
    'short hair', 'solo', 'looking at viewer', 'smile', 'serious expression',
  ];

  const ENVIRONMENT_TAGS = [
    'outdoor', 'indoor', 'garden', 'city street', 'forest',
    'beach', 'mountain', 'cafe', 'night sky', 'sunset',
  ];

  const NEGATIVE_TAGS = [
    'bad anatomy', 'bad hands', 'missing fingers', 'extra fingers',
    'blurry', 'deformed', 'disfigured', 'ugly', 'worst quality', 'low quality',
    'normal quality', 'jpeg artifacts', 'watermark', 'username', 'signature',
    'text', 'error', 'cropped', 'out of frame', 'duplicate',
  ];

  const SAMPLER_SUGGESTIONS = [
    { name: 'DPM++ 2M Karras', steps: '20-30', cfg: '7', best: 'General purpose' },
    { name: 'Euler a', steps: '25-35', cfg: '7', best: 'Creative variety' },
    { name: 'DDIM', steps: '30-50', cfg: '7.5', best: 'Stable results' },
    { name: 'UniPC', steps: '20-25', cfg: '7', best: 'Fast generation' },
    { name: 'DPM++ SDE', steps: '20-30', cfg: '6', best: 'Fine details' },
  ];

  const LORA_HINTS = [
    '📌 For anime: Use anything-v3, counterfeitV3, or revAnimated',
    '📌 For photorealism: Use realisticVisionV5, dreamshaper, or aZovyaPhotoreal',
    '📌 For artwork: Use deliberate, dreamlike-diffusion, or openjourney',
    '📌 Add LoRA with: <lora:loraname:0.7> in positive prompt',
    '📌 Recommended LoRA weight: 0.5-0.8 for subtle effect',
  ];

  let subject = $state('');
  let selectedQuality = $state<string[]>(['masterpiece', 'best quality', 'ultra-detailed']);
  let selectedStyle = $state<string[]>(['photorealistic']);
  let selectedChar = $state<string[]>([]);
  let selectedEnv = $state<string[]>([]);
  let selectedNeg = $state<string[]>(['bad anatomy', 'bad hands', 'blurry', 'worst quality', 'low quality']);
  let selectedSampler = $state(SAMPLER_SUGGESTIONS[0]);

  let copiedKey = $state('');

  function toggleTag(arr: string[], tag: string): string[] {
    return arr.includes(tag) ? arr.filter((t) => t !== tag) : [...arr, tag];
  }

  const positivePrompt = $derived(
    [
      subject.trim(),
      ...selectedQuality,
      ...selectedStyle,
      ...selectedChar,
      ...selectedEnv,
    ]
      .filter(Boolean)
      .join(', ')
  );

  const negativePrompt = $derived(selectedNeg.join(', '));

  function copyText(text: string, key: string) {
    navigator.clipboard.writeText(text).then(() => {
      copiedKey = key;
      setTimeout(() => (copiedKey = ''), 1800);
    });
  }

  function copyAll() {
    const all = `Positive Prompt:\n${positivePrompt}\n\nNegative Prompt:\n${negativePrompt}\n\nSampler: ${selectedSampler.name}, Steps: ${selectedSampler.steps}, CFG: ${selectedSampler.cfg}`;
    copyText(all, 'all');
  }
</script>

<div class="bg-stone-950 text-stone-100 p-6 rounded-2xl border border-stone-800 shadow-2xl font-sans min-h-[400px]">
  <!-- Header -->
  <div class="flex items-center gap-3 mb-6">
    <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-400 to-rose-700 flex items-center justify-center text-stone-950 font-black text-lg">
      🖼️
    </div>
    <div>
      <h2 class="font-extrabold text-lg bg-gradient-to-r from-rose-300 via-rose-100 to-rose-400 bg-clip-text text-transparent leading-tight">
        {l.title}
      </h2>
      <p class="text-stone-500 text-xs mt-0.5">{l.subtitle}</p>
    </div>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-12 gap-5">
    <!-- Left: Tag Selection -->
    <div class="md:col-span-6 space-y-4">
      <label class="block">
        <span class="text-xs text-stone-400 mb-1.5 block">{l.subject}</span>
        <textarea
          bind:value={subject}
          placeholder={l.subjectPlaceholder}
          rows="2"
          class="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-2 text-sm text-stone-100 focus:border-rose-500 focus:outline-none transition-colors resize-none"
        ></textarea>
      </label>

      {#each [
        { label: l.qualityWords, tags: QUALITY_TAGS, selected: selectedQuality, set: (v: string[]) => (selectedQuality = v) },
        { label: l.styleWords, tags: STYLE_TAGS, selected: selectedStyle, set: (v: string[]) => (selectedStyle = v) },
        { label: l.characterWords, tags: CHARACTER_TAGS, selected: selectedChar, set: (v: string[]) => (selectedChar = v) },
        { label: l.environmentWords, tags: ENVIRONMENT_TAGS, selected: selectedEnv, set: (v: string[]) => (selectedEnv = v) },
      ] as group}
        <div>
          <p class="text-xs text-stone-400 mb-1.5">{group.label}</p>
          <div class="flex flex-wrap gap-1.5">
            {#each group.tags as tag}
              <button
                type="button"
                onclick={() => group.set(toggleTag(group.selected, tag))}
                class="py-0.5 px-2 text-xxs font-medium rounded-full border transition-all {group.selected.includes(tag) ? 'bg-rose-950/50 border-rose-600 text-rose-300' : 'bg-stone-900 border-stone-800 text-stone-400 hover:border-stone-600'}"
              >
                {tag}
              </button>
            {/each}
          </div>
        </div>
      {/each}

      <div>
        <p class="text-xs text-stone-400 mb-1.5">{l.negativePrompt}</p>
        <div class="flex flex-wrap gap-1.5">
          {#each NEGATIVE_TAGS as tag}
            <button
              type="button"
              onclick={() => (selectedNeg = toggleTag(selectedNeg, tag))}
              class="py-0.5 px-2 text-xxs font-medium rounded-full border transition-all {selectedNeg.includes(tag) ? 'bg-red-950/50 border-red-700 text-red-400' : 'bg-stone-900 border-stone-800 text-stone-400 hover:border-stone-600'}"
            >
              {tag}
            </button>
          {/each}
        </div>
      </div>
    </div>

    <!-- Right: Output + Params -->
    <div class="md:col-span-6 space-y-4">
      <!-- Positive Prompt -->
      <div class="bg-stone-900 border border-stone-800 rounded-xl p-4">
        <div class="flex items-center justify-between mb-2">
          <p class="text-xs font-bold text-rose-400">{l.positivePromptLabel}</p>
          <button
            type="button"
            onclick={() => copyText(positivePrompt, 'pos')}
            class="text-xxs text-stone-500 hover:text-rose-400 border border-stone-800 hover:border-rose-700 rounded px-2 py-0.5 transition-all"
          >
            {copiedKey === 'pos' ? l.copied : l.copy}
          </button>
        </div>
        <p class="text-xs text-stone-300 leading-relaxed font-mono break-all min-h-[40px]">
          {positivePrompt || '(no tags selected)'}
        </p>
      </div>

      <!-- Negative Prompt -->
      <div class="bg-stone-900 border border-red-900/30 rounded-xl p-4">
        <div class="flex items-center justify-between mb-2">
          <p class="text-xs font-bold text-red-400">{l.negativePromptLabel}</p>
          <button
            type="button"
            onclick={() => copyText(negativePrompt, 'neg')}
            class="text-xxs text-stone-500 hover:text-red-400 border border-stone-800 hover:border-red-800 rounded px-2 py-0.5 transition-all"
          >
            {copiedKey === 'neg' ? l.copied : l.copy}
          </button>
        </div>
        <p class="text-xs text-red-300/80 leading-relaxed font-mono break-all min-h-[40px]">
          {negativePrompt || '(none)'}
        </p>
      </div>

      <!-- Sampling Params -->
      <div class="bg-stone-900 border border-stone-800 rounded-xl p-4">
        <p class="text-xs font-bold text-stone-300 mb-3">{l.samplingParams}</p>
        <div class="space-y-1.5">
          {#each SAMPLER_SUGGESTIONS as s}
            <button
              type="button"
              onclick={() => (selectedSampler = s)}
              class="w-full text-left p-2 rounded-lg border text-xxs transition-all {selectedSampler.name === s.name ? 'bg-rose-950/30 border-rose-700' : 'bg-stone-950 border-stone-800 hover:border-stone-700'}"
            >
              <span class="font-bold text-stone-200">{s.name}</span>
              <span class="text-stone-500 ml-2">Steps: {s.steps} · CFG: {s.cfg}</span>
              <span class="text-stone-600 ml-2">({s.best})</span>
            </button>
          {/each}
        </div>
      </div>

      <!-- LoRA Hints -->
      <div class="bg-stone-900 border border-stone-800 rounded-xl p-4">
        <p class="text-xs font-bold text-stone-300 mb-2">{l.loraHint}</p>
        <ul class="space-y-1">
          {#each LORA_HINTS as hint}
            <li class="text-xxs text-stone-500 leading-relaxed">{hint}</li>
          {/each}
        </ul>
      </div>

      <button
        type="button"
        onclick={copyAll}
        class="w-full bg-gradient-to-r from-rose-600 to-rose-800 hover:from-rose-500 hover:to-rose-700 text-white text-sm font-bold py-3 px-4 rounded-xl transition-all"
      >
        📋 {copiedKey === 'all' ? l.copied : l.copyAll}
      </button>
    </div>
  </div>

  <p class="text-xxs text-stone-600 text-center mt-4">{l.disclaimer}</p>
</div>

<style>
  .text-xxs { font-size: 0.65rem; }
</style>
