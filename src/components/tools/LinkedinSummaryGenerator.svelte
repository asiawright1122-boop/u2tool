<script lang="ts">
  import {
    generateLinkedinSummary,
  } from '../../lib/linkedin-generator-helper';

  interface Props {
    locale?: string;
    translations?: Record<string, unknown>;
  }

  let { locale = 'en', translations = {} }: Props = $props();

  const I18N_BACKUP: Record<string, Record<string, string>> = {
    zh: {
      title: 'LinkedIn 个人总结生成器',
      subtitle: '生成结构清晰、引人瞩目的个人简介 (About Section)，提升个人品牌魅力',
      jobTitle: '目标/当前职位名称',
      keySkills: '核心专业技能 (逗号分隔)',
      experienceYears: '相关工作年限 (年)',
      valueProp: '核心价值主张 / 代表成就',
      valuePropPlaceholder: '例如: 曾主导跨国团队重构核心电商系统，提升性能 40%',
      tone: '文章风格调性',
      professional: '沉稳专业 (Professional)',
      creative: '创意个性 (Creative)',
      enthusiastic: '热忱积极 (Enthusiastic)',
      confident: '自信果敢 (Confident)',
      placeholderText: '请输入您的工作背景与核心技能以生成个人总结。',
      copyResult: '复制个人总结',
      copied: '✓ 已复制!',
      disclaimer: 'LinkedIn 个人总结（About）是招聘经理了解您个人经历的重要窗口，建议添加您的真实项目亮点以达到最佳效果。',
    },
    en: {
      title: 'LinkedIn Summary Generator',
      subtitle: 'Create a structured, engaging "About" section to showcase your professional story',
      jobTitle: 'Target / Current Job Title',
      keySkills: 'Key Professional Skills (comma separated)',
      experienceYears: 'Years of Experience',
      valueProp: 'Core Value Proposition / Achievement',
      valuePropPlaceholder: 'e.g. Led cross-functional teams to rebuild core platform, boosting speed by 40%',
      tone: 'Writing Tone',
      professional: 'Professional',
      creative: 'Creative',
      enthusiastic: 'Enthusiastic',
      confident: 'Confident',
      placeholderText: 'Enter your background and key skills to generate your summary.',
      copyResult: 'Copy Summary',
      copied: '✓ Copied!',
      disclaimer: 'Your LinkedIn "About" section is critical for storytelling. We recommend adding real metrics and personal milestones.',
    },
    es: {
      title: 'Generador de Resúmenes para LinkedIn',
      subtitle: 'Cree una sección "Acerca de" estructurada e interesante para mostrar su trayectoria profesional',
      jobTitle: 'Cargo Objetivo / Actual',
      keySkills: 'Habilidades Clave (separadas por comas)',
      experienceYears: 'Años de Experiencia',
      valueProp: 'Propuesta de Valor / Logro Principal',
      valuePropPlaceholder: 'ej. Lideré equipos para reconstruir la plataforma principal, mejorando velocidad en 40%',
      tone: 'Tono de Redacción',
      professional: 'Profesional',
      creative: 'Creativo',
      enthusiastic: 'Entusiasta',
      confident: 'Confiado',
      placeholderText: 'Ingrese su trayectoria y habilidades clave para generar su resumen.',
      copyResult: 'Copiar Resumen',
      copied: '¡Copiado!',
      disclaimer: 'La sección "Acerca de" es clave para contar su historia. Recomendamos agregar métricas reales y logros personales.',
    },
    pt: {
      title: 'Gerador de Resumos do LinkedIn',
      subtitle: 'Crie uma seção "Sobre" estruturada e atraente para destacar sua história profissional',
      jobTitle: 'Cargo de Interesse / Atual',
      keySkills: 'Principais Habilidades (separadas por vírgula)',
      experienceYears: 'Anos de Experiência',
      valueProp: 'Proposta de Valor / Conquista Principal',
      valuePropPlaceholder: 'ex. Liderei equipes para reconstruir a plataforma principal, melhorando velocidade em 40%',
      tone: 'Tom da Mensagem',
      professional: 'Profissional',
      creative: 'Criativo',
      enthusiastic: 'Entusiasta',
      confident: 'Confiante',
      placeholderText: 'Insira seu perfil e habilidades para gerar seu resumo.',
      copyResult: 'Copiar Resumo',
      copied: 'Copiado!',
      disclaimer: 'A seção "Sobre" é essencial para contar sua história. Recomendamos adicionar métricas reais e conquistas pessoais.',
    },
    ja: {
      title: 'LinkedIn 自己紹介文生成ツール',
      subtitle: 'キャリアストーリーを効果的にアピールする「概要 (About)」セクションを構成します',
      jobTitle: '希望する職種 / 現職',
      keySkills: 'アピールしたい専門スキル (カンマ区切り)',
      experienceYears: '関連する実務年数 (年)',
      valueProp: 'コアバリュープロポジション / 主な成果',
      valuePropPlaceholder: '例: クロスファンクショナルチームを率い、EC基盤を刷新。読込速度を40%改善',
      tone: '文章のトーン',
      professional: '誠实・プロフェッショナル (Professional)',
      creative: '独創的・クリエイティブ (Creative)',
      enthusiastic: '熱意・ポジティブ (Enthusiastic)',
      confident: '自信・アピール重視 (Confident)',
      placeholderText: '職種や経験、スキルを入力して自己紹介文を生成します。',
      copyResult: '自己紹介文をコピー',
      copied: 'コピーしました！',
      disclaimer: '「概要」欄はあなたのストーリーを語る上で重要です。具体的な数値やエピソードを盛り込むとさらに効果的です。',
    },
    fr: {
      title: 'Générateur de Résumés LinkedIn',
      subtitle: 'Créez une section « Infos » structurée et captivante pour raconter votre parcours',
      jobTitle: 'Titre de Poste Visé / Actuel',
      keySkills: 'Compétences Clés (séparées par des virgules)',
      experienceYears: 'Années d\'Expérience',
      valueProp: 'Proposition de Valeur / Réalisation',
      valuePropPlaceholder: 'ex. Direction d\'équipes pour reconstruire la plateforme centrale, +40% de vitesse',
      tone: 'Ton de Rédaction',
      professional: 'Professionnel',
      creative: 'Créatif',
      enthusiastic: 'Enthousiaste',
      confident: 'Confiant',
      placeholderText: 'Saisissez votre parcours et vos compétences clés pour générer votre résumé.',
      copyResult: 'Copiar le Résumé',
      copied: 'Copié !',
      disclaimer: 'La section « Infos » est essentielle pour valoriser votre profil. Nous vous conseillons d\'y ajouter vos réalisations concrètes.',
    },
    de: {
      title: 'LinkedIn Info-Generator',
      subtitle: 'Erstellen Sie eine strukturierte, ansprechende Profilzusammenfassung (Info-Bereich)',
      jobTitle: 'Gewünschte / Aktuelle Position',
      keySkills: 'Schlüsselkompetenzen (kommagetrennt)',
      experienceYears: 'Berufserfahrung (Jahre)',
      valueProp: 'Nutzenversprechen / Erfolg',
      valuePropPlaceholder: 'z.B. Leitung von Teams zur Modernisierung des Kernsystems, Leistungssteigerung um 40%',
      tone: 'Schreibstil',
      professional: 'Professionell',
      creative: 'Kreativ',
      enthusiastic: 'Enthusiastisch',
      confident: 'Selbstbewusst',
      placeholderText: 'Geben Sie Ihre Position und Fähigkeiten ein, um die Zusammenfassung zu generieren.',
      copyResult: 'Zusammenfassung kopieren',
      copied: 'Kopiert!',
      disclaimer: 'Ihre Zusammenfassung ist entscheidend für Ihre persönliche Marke. Passen Sie sie gerne mit individuellen Projekterfolgen an.',
    },
    ar: {
      title: 'مولد ملخصات LinkedIn',
      subtitle: 'أنشئ قسم "حول" (About) منظم وجذاب لعرض قصتك المهنية بأسلوب مقنع',
      jobTitle: 'المسمى الوظيفي المستهدف / الحالي',
      keySkills: 'المهارات المهنية الأساسية (مفصولة بفاصلة)',
      experienceYears: 'سنوات الخبرة',
      valueProp: 'القيمة المقترحة / إنجاز مميز',
      valuePropPlaceholder: 'مثال: قيادة فرق عمل لإعادة بناء النظام الأساسي وتحسين السرعة بنسبة 40%',
      tone: 'أسلوب الكتابة',
      professional: 'مهني رصين (Professional)',
      creative: 'إبداعي متميز (Creative)',
      enthusiastic: 'حماسي متقد (Enthusiastic)',
      confident: 'واثق وجريء (Confident)',
      placeholderText: 'أدخل معلوماتك المهنية ومهاراتك لإنشاء ملخص لملفك الشخصي.',
      copyResult: 'نسخ الملخص',
      copied: 'تم النسخ!',
      layoutClassic: 'نموذج أ: كلاسيكي احترافي',
      layoutOutcome: 'نموذج ب: موجه نحو القيمة',
      layoutMinimalist: 'نموذج ج: مبسط ومباشر',
      disclaimer: 'قسم "حول" في LinkedIn هو بوابتك لرواية مسيرتك. ننصح بإضافة أرقام وإنجازات حقيقية للحصول على أفضل نتيجة.',
    },
    ko: {
      title: 'LinkedIn 요약 생성기',
      subtitle: '매력적이고 구조화된 LinkedIn "요약(About)" 섹션을 구성하여 나만의 커리어 스토리를 들려주세요',
      jobTitle: '목표 / 현재 직무명',
      keySkills: '핵심 전문 기술 (쉼표로 구분)',
      experienceYears: '관련 경력 (년)',
      valueProp: '핵심 가치 제안 / 주요 성과',
      valuePropPlaceholder: '예: 크로스 펑셔널 팀을 리드하여 핵심 플랫폼 개편, 속도 40% 개선',
      tone: '자기소개서 어조',
      professional: '차분하고 전문적인 (Professional)',
      creative: '창의적이고 독특한 (Creative)',
      enthusiastic: '열정적이고 적극적인 (Enthusiastic)',
      confident: '자신감 넘치는 (Confident)',
      placeholderText: '경력 사항과 핵심 역량을 입력하여 자기소개 요약을 조합해보세요.',
      copyResult: '요약 복사',
      copied: '복사 완료!',
      disclaimer: 'LinkedIn 요약 섹션은 스토리텔링에 매우 중요한 항목입니다. 구체적인 수치와 주요 성과를 포함하면 더욱 돋보입니다.',
    },
    ru: {
      title: 'Генератор описаний LinkedIn',
      subtitle: 'Создавайте структурированный и интересный раздел "О себе" (About) для вашего профиля',
      jobTitle: 'Целевая / Текущая должность',
      keySkills: 'Ключевые навыки (через запятую)',
      experienceYears: 'Опыт работы (лет)',
      valueProp: 'Ключевое ценностное предложение / Достижение',
      valuePropPlaceholder: 'например: Руководил кросс-функциональной командой по оптимизации ядра системы, ускорив работу на 40%',
      tone: 'Тон письма',
      professional: 'Профессиональный',
      creative: 'Творческий',
      enthusiastic: 'Энтузиазм',
      confident: 'Уверенный',
      placeholderText: 'Введите информацию о вашем опыте и ключевых навыках для генерации описания.',
      copyResult: 'Скопировать описание',
      copied: 'Скопировано!',
      disclaimer: 'Раздел "О себе" очень важен для описания вашей карьеры. Мы рекомендуем добавлять реальные метрики и личные достижения.',
    },
  };

  const l = $derived(I18N_BACKUP[locale] || I18N_BACKUP['en']);

  let jobTitle = $state('');
  let keySkills = $state('');
  let experienceYears = $state('');
  let valueProp = $state('');
  let tone = $state('professional');

  const result = $derived((() => {
    const job = jobTitle.trim();
    if (!job) return null;

    const exp = parseInt(experienceYears, 10) || 0;
    const skills = keySkills.split(',').map(s => s.trim()).filter(Boolean);

    return generateLinkedinSummary({
      jobTitle: job,
      keySkills: skills.length > 0 ? skills : undefined,
      experienceYears: exp > 0 ? exp : undefined,
      valueProp: valueProp.trim() || undefined,
      tone: tone as any,
      locale,
    });
  })());

  let copied = $state(false);
  function copyResult() {
    if (!result) return;
    navigator.clipboard.writeText(result).then(() => {
      copied = true;
      setTimeout(() => (copied = false), 1800);
    });
  }
</script>

<div class="bg-stone-950 text-stone-100 p-6 rounded-2xl border border-stone-800 shadow-2xl font-sans min-h-[400px]">
  <!-- Header -->
  <div class="flex items-center gap-3 mb-6">
    <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-700 flex items-center justify-center text-stone-950 font-black text-lg">
      📝
    </div>
    <div>
      <h2 class="font-extrabold text-lg bg-gradient-to-r from-amber-300 via-amber-100 to-amber-400 bg-clip-text text-transparent leading-tight">
        {l.title}
      </h2>
      <p class="text-stone-500 text-xs mt-0.5">{l.subtitle}</p>
    </div>
  </div>

  <!-- Content Split Grid -->
  <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
    <!-- Left panel: Inputs -->
    <div class="lg:col-span-5 space-y-4">
      <label class="block">
        <span class="text-xs text-stone-400 mb-1.5 block">{l.jobTitle}</span>
        <input
          type="text"
          bind:value={jobTitle}
          placeholder="e.g. Solutions Architect"
          class="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-2 text-sm text-stone-100 focus:border-amber-500 focus:outline-none transition-colors"
        />
      </label>

      <div class="grid grid-cols-2 gap-3">
        <label class="block">
          <span class="text-xs text-stone-400 mb-1.5 block">{l.experienceYears}</span>
          <input
            type="number"
            bind:value={experienceYears}
            min="0"
            max="50"
            placeholder="e.g. 10"
            class="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-2 text-sm text-stone-100 focus:border-amber-500 focus:outline-none transition-colors"
          />
        </label>

        <label class="block">
          <span class="text-xs text-stone-400 mb-1.5 block">{l.tone}</span>
          <select
            bind:value={tone}
            class="w-full bg-stone-900 border border-stone-700 text-stone-200 text-xs rounded-lg px-2 py-2.5 cursor-pointer focus:border-amber-500 focus:outline-none transition-colors"
          >
            <option value="professional">{l.professional}</option>
            <option value="creative">{l.creative}</option>
            <option value="enthusiastic">{l.enthusiastic}</option>
            <option value="confident">{l.confident}</option>
          </select>
        </label>
      </div>

      <label class="block">
        <span class="text-xs text-stone-400 mb-1.5 block">{l.valueProp}</span>
        <textarea
          bind:value={valueProp}
          placeholder={l.valuePropPlaceholder}
          rows="2"
          class="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-2 text-sm text-stone-100 focus:border-amber-500 focus:outline-none transition-colors resize-none"
        ></textarea>
      </label>

      <label class="block">
        <span class="text-xs text-stone-400 mb-1.5 block">{l.keySkills}</span>
        <textarea
          bind:value={keySkills}
          placeholder="e.g. AWS, Kubernetes, Architecture Design"
          rows="3"
          class="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-2 text-sm text-stone-100 focus:border-amber-500 focus:outline-none transition-colors resize-none"
        ></textarea>
      </label>
    </div>

    <!-- Right panel: Document Preview -->
    <div class="lg:col-span-7 flex flex-col justify-between space-y-4">
      {#if result}
        <div class="space-y-4 flex-1 flex flex-col">
          <!-- Textarea Paper Preview -->
          <div class="flex-1 min-h-[300px] bg-stone-900 border border-stone-850 rounded-xl p-5 font-mono text-sm text-stone-200 leading-relaxed whitespace-pre-wrap select-all relative overflow-hidden">
            <div class="absolute -right-6 -bottom-6 text-7xl opacity-5 select-none">📝</div>
            {result}
          </div>

          <!-- Copy Button -->
          <button
            type="button"
            onclick={copyResult}
            class="w-full bg-stone-900 hover:bg-stone-850 border border-stone-800 text-stone-200 hover:text-stone-100 text-xs font-semibold py-2.5 px-4 rounded-lg transition-all flex items-center justify-center gap-2"
          >
            {#if copied}
              <span class="text-amber-400">{l.copied}</span>
            {:else}
              <span>📋 {l.copyResult}</span>
            {/if}
          </button>
        </div>
      {:else}
        <!-- Placeholder Empty State -->
        <div class="h-full flex flex-col items-center justify-center text-center p-12 bg-stone-900/25 border border-dashed border-stone-850 rounded-xl">
          <div class="text-4xl mb-4">✍️</div>
          <p class="text-xs text-stone-400 max-w-xs leading-relaxed">
            {l.placeholderText}
          </p>
        </div>
      {/if}

      <!-- Disclaimer Footer -->
      <div class="text-xxs text-stone-600 pt-4 leading-relaxed text-center">
        {l.disclaimer}
      </div>
    </div>
  </div>
</div>
