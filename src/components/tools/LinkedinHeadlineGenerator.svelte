<script lang="ts">
  import {
    generateLinkedinHeadlines,
  } from '../../lib/linkedin-generator-helper';

  interface Props {
    locale?: string;
    translations?: Record<string, unknown>;
  }

  let { locale = 'en', translations = {} }: Props = $props();

  const I18N_BACKUP: Record<string, Record<string, string>> = {
    zh: {
      title: 'LinkedIn 标题生成器',
      subtitle: '快速生成高吸引力的个人 Headline，展示您的专业核心竞争力',
      jobTitle: '目标/当前职位名称',
      keySkills: '核心专业技能 (逗号分隔)',
      experienceYears: '相关工作年限 (年)',
      valueProp: '核心价值主张 / 个人亮点',
      valuePropPlaceholder: '例如: 助力企业构建高性能 Web 平台',
      tone: '语调偏好',
      professional: '沉稳专业 (Professional)',
      creative: '创意吸睛 (Creative)',
      enthusiastic: '热忱积极 (Enthusiastic)',
      confident: '自信果敢 (Confident)',
      placeholderText: '请输入职位与核心技能以生成标题。',
      copyResult: '复制此标题',
      copied: '✓ 已复制!',
      layoutClassic: '版式 A: 经典专业型',
      layoutOutcome: '版式 B: 价值驱动型',
      layoutMinimalist: '版式 C: 极简利落型',
      disclaimer: '好的 LinkedIn 标题能极大提升您的搜索曝光率，建议在此基础上结合您的独特身份进行微调。',
    },
    en: {
      title: 'LinkedIn Headline Generator',
      subtitle: 'Create compelling, searchable LinkedIn headlines to stand out to recruiters',
      jobTitle: 'Target / Current Job Title',
      keySkills: 'Key Professional Skills (comma separated)',
      experienceYears: 'Years of Experience',
      valueProp: 'Core Value Proposition / Highlight',
      valuePropPlaceholder: 'e.g. Building highly scalable web architectures',
      tone: 'Writing Tone',
      professional: 'Professional',
      creative: 'Creative',
      enthusiastic: 'Enthusiastic',
      confident: 'Confident',
      placeholderText: 'Enter your job title and key skills to generate headlines.',
      copyResult: 'Copy Headline',
      copied: '✓ Copied!',
      layoutClassic: 'Layout A: Classic & Professional',
      layoutOutcome: 'Layout B: Value-Driven',
      layoutMinimalist: 'Layout C: Minimalist & Clean',
      disclaimer: 'A well-optimized headline improves your search visibility. Adjust the output to best fit your personal brand.',
    },
    es: {
      title: 'Generador de Titulares para LinkedIn',
      subtitle: 'Cree titulares de LinkedIn atractivos y optimizados para destacar ante reclutadores',
      jobTitle: 'Cargo Objetivo / Actual',
      keySkills: 'Habilidades Clave (separadas por comas)',
      experienceYears: 'Años de Experiencia',
      valueProp: 'Propuesta de Valor Principal / Destacado',
      valuePropPlaceholder: 'ej. Creando arquitecturas web altamente escalables',
      tone: 'Tono de Redacción',
      professional: 'Profesional',
      creative: 'Creativo',
      enthusiastic: 'Entusiasta',
      confident: 'Confiado',
      placeholderText: 'Ingrese su cargo y habilidades clave para generar titulares.',
      copyResult: 'Copiar Titular',
      copied: '¡Copiado!',
      layoutClassic: 'Diseño A: Clásico y Profesional',
      layoutOutcome: 'Diseño B: Basado en Valor',
      layoutMinimalist: 'Diseño C: Minimalista y Limpio',
      disclaimer: 'Un titular optimizado mejora su visibilidad de búsqueda. Ajuste el resultado según su marca personal.',
    },
    pt: {
      title: 'Gerador de Títulos do LinkedIn',
      subtitle: 'Crie títulos atraentes e otimizados para busca para se destacar no LinkedIn',
      jobTitle: 'Cargo de Interesse / Atual',
      keySkills: 'Principais Habilidades (separadas por vírgula)',
      experienceYears: 'Anos de Experiência',
      valueProp: 'Proposta de Valor / Destaque',
      valuePropPlaceholder: 'ex. Construindo arquiteturas web altamente escaláveis',
      tone: 'Tom da Mensagem',
      professional: 'Profissional',
      creative: 'Criativo',
      enthusiastic: 'Entusiasta',
      confident: 'Confiante',
      placeholderText: 'Insira seu cargo e habilidades para gerar seus títulos.',
      copyResult: 'Copiar Título',
      copied: 'Copiado!',
      layoutClassic: 'Layout A: Clássico e Profissional',
      layoutOutcome: 'Layout B: Focado em Valor',
      layoutMinimalist: 'Layout C: Minimalista e Direto',
      disclaimer: 'Um bom título aumenta sua visibilidade nas buscas. Adapte o resultado para melhor refletir seu perfil.',
    },
    ja: {
      title: 'LinkedIn タイル生成ツール',
      subtitle: '採用担当者の目を引く、検索性の高い LinkedIn のヘッドラインを素早く作成します',
      jobTitle: '希望する職種 / 現職',
      keySkills: 'アピールしたい専門スキル (カンマ区切り)',
      experienceYears: '関連する実務年数 (年)',
      valueProp: 'コアバリュープロポジション / アピールポイント',
      valuePropPlaceholder: '例: 大規模Webアプリケーションの設計・構築',
      tone: '文章のトーン',
      professional: '誠実・プロフェッショナル (Professional)',
      creative: '独創的・クリエイティブ (Creative)',
      enthusiastic: '熱意・ポジティブ (Enthusiastic)',
      confident: '自信・アピール重視 (Confident)',
      placeholderText: '職種とアピールしたいスキルを入力してヘッドラインを生成します。',
      copyResult: 'ヘッドラインをコピー',
      copied: 'コピーしました！',
      layoutClassic: 'レイアウト A: クラシック＆プロフェッショナル',
      layoutOutcome: 'レイアウト B: バリュードリブン',
      layoutMinimalist: 'レイアウト C: ミニマリスト＆クリーン',
      disclaimer: '最適化されたヘッドラインは検索での露出を向上させます。ご自身の強みに合わせて最終調整してください。',
    },
    fr: {
      title: 'Générateur de Titres LinkedIn',
      subtitle: 'Créez des titres LinkedIn captivants et optimisés pour le référencement',
      jobTitle: 'Titre de Poste Visé / Actuel',
      keySkills: 'Compétences Clés (séparées par des virgules)',
      experienceYears: 'Années d\'Expérience',
      valueProp: 'Proposition de Valeur / Point Fort',
      valuePropPlaceholder: 'ex. Développement d\'architectures web hautement évolutives',
      tone: 'Ton de Rédaction',
      professional: 'Professionnel',
      creative: 'Créatif',
      enthusiastic: 'Enthousiaste',
      confident: 'Confiant',
      placeholderText: 'Saisissez votre poste et vos compétences clés pour générer des titres.',
      copyResult: 'Copier le Titre',
      copied: 'Copié !',
      layoutClassic: 'Format A: Classique & Professionnel',
      layoutOutcome: 'Format B: Basé sur la Valeur',
      layoutMinimalist: 'Format C: Minimaliste & Épuré',
      disclaimer: 'Un titre bien rédigé améliore votre visibilité. Personnalisez-le pour refléter au mieux votre profil.',
    },
    de: {
      title: 'LinkedIn Slogan-Generator',
      subtitle: 'Erstellen Sie ansprechende LinkedIn-Profilslogans für maximale Sichtbarkeit',
      jobTitle: 'Gewünschte / Aktuelle Position',
      keySkills: 'Schlüsselkompetenzen (kommagetrennt)',
      experienceYears: 'Berufserfahrung (Jahre)',
      valueProp: 'Nutzenversprechen / Highlight',
      valuePropPlaceholder: 'z.B. Entwicklung hochskalierbarer Webarchitekturen',
      tone: 'Schreibstil',
      professional: 'Professionell',
      creative: 'Kreativ',
      enthusiastic: 'Enthusiastisch',
      confident: 'Selbstbewusst',
      placeholderText: 'Geben Sie Ihre Position und Fähigkeiten ein, um Profilslogans zu generieren.',
      copyResult: 'Slogan kopieren',
      copied: 'Kopiert!',
      layoutClassic: 'Layout A: Klassisch & Professionell',
      layoutOutcome: 'Layout B: Nutzenorientiert',
      layoutMinimalist: 'Layout C: Minimalistisch & Klar',
      disclaimer: 'Ein optimierter Slogan erhöht Ihre Auffindbarkeit. Passen Sie die Ergebnisse an Ihre persönliche Marke an.',
    },
    ar: {
      title: 'مولد عناوين LinkedIn',
      subtitle: 'أنشئ عناوين رئيسية جذابة ومحسنة للبحث لتلفت انتباه مسؤولي التوظيف',
      jobTitle: 'المسمى الوظيفي المستهدف / الحالي',
      keySkills: 'المهارات المهنية الأساسية (مفصولة بفاصلة)',
      experienceYears: 'سنوات الخبرة',
      valueProp: 'القيمة المقترحة / ميزة أساسية',
      valuePropPlaceholder: 'مثال: بناء معمارية ويب عالية القابلية للتوسع',
      tone: 'أسلوب الكتابة',
      professional: 'مهني رصين (Professional)',
      creative: 'إبداعي متميز (Creative)',
      enthusiastic: 'حماسي متقد (Enthusiastic)',
      confident: 'واثق وجريء (Confident)',
      placeholderText: 'أدخل المسمى الوظيفي والمهارات لإنشاء عناوين لملفك الشخصي.',
      copyResult: 'نسخ العنوان',
      copied: 'تم النسخ!',
      layoutClassic: 'نموذج أ: كلاسيكي احترافي',
      layoutOutcome: 'نموذج ب: موجه نحو القيمة',
      layoutMinimalist: 'نموذج ج: مبسط ومباشر',
      disclaimer: 'العنوان الجيد يزيد من فرص ظهورك في نتائج البحث. نوصي بتعديله ليعكس هويتك المهنية بدقة.',
    },
    ko: {
      title: 'LinkedIn 헤드라인 생성기',
      subtitle: '인재 검색에 최적화된 매력적인 LinkedIn 헤드라인을 생성하여 시선을 사로잡으세요',
      jobTitle: '목표 / 현재 직무명',
      keySkills: '핵심 전문 기술 (쉼표로 구분)',
      experienceYears: '관련 경력 (년)',
      valueProp: '핵심 가치 제안 / 하이라이트',
      valuePropPlaceholder: '예: 고성능 대규모 웹 아키텍처 설계 및 구축',
      tone: '자기소개서 어조',
      professional: '차분하고 전문적인 (Professional)',
      creative: '창의적이고 독특한 (Creative)',
      enthusiastic: '열정적이고 적극적인 (Enthusiastic)',
      confident: '자신감 넘치는 (Confident)',
      placeholderText: '직무와 보유 기술을 입력해 헤드라인을 구성해보세요.',
      copyResult: '헤드라인 복사',
      copied: '복사 완료!',
      layoutClassic: '레이아웃 A: 클래식 & 프로페셔널',
      layoutOutcome: '레이아웃 B: 가치 지향형',
      layoutMinimalist: '레이아웃 C: 심플 & 클린',
      disclaimer: '최적화된 헤드라인은 검색 노출율을 크게 높여줍니다. 본인의 경험과 가치관에 맞게 미세 조정하는 것을 권장합니다.',
    },
    ru: {
      title: 'Генератор заголовков LinkedIn',
      subtitle: 'Создавайте яркие и заметные заголовки для вашего профиля в LinkedIn',
      jobTitle: 'Целевая / Текущая должность',
      keySkills: 'Ключевые навыки (через запятую)',
      experienceYears: 'Опыт работы (лет)',
      valueProp: 'Ключевое ценностное предложение',
      valuePropPlaceholder: 'например: Проектирование высокомасштабируемых веб-архитектур',
      tone: 'Тон письма',
      professional: 'Профессиональный',
      creative: 'Творческий',
      enthusiastic: 'Энтузиазм',
      confident: 'Уверенный',
      placeholderText: 'Введите должность и навыки для генерации вариантов заголовка.',
      copyResult: 'Скопировать заголовок',
      copied: 'Скопировано!',
      layoutClassic: 'Формат A: Классический профессиональный',
      layoutOutcome: 'Формат B: Ценностно-ориентированный',
      layoutMinimalist: 'Format C: Минималистичный чистый',
      disclaimer: 'Оптимизированный заголовок улучшает вашу видимость в поиске. Доработайте его под свой личный бренд.',
    },
  };

  const l = $derived(I18N_BACKUP[locale] || I18N_BACKUP['en']);

  let jobTitle = $state('');
  let keySkills = $state('');
  let experienceYears = $state('');
  let valueProp = $state('');
  let tone = $state('professional');

  const headlines = $derived((() => {
    const job = jobTitle.trim();
    if (!job) return [];

    const exp = parseInt(experienceYears, 10) || 0;
    const skills = keySkills.split(',').map(s => s.trim()).filter(Boolean);

    return generateLinkedinHeadlines({
      jobTitle: job,
      keySkills: skills.length > 0 ? skills : undefined,
      experienceYears: exp > 0 ? exp : undefined,
      valueProp: valueProp.trim() || undefined,
      tone: tone as any,
      locale,
    });
  })());

  let copiedIndex = $state<number | null>(null);
  function copyHeadline(text: string, index: number) {
    navigator.clipboard.writeText(text).then(() => {
      copiedIndex = index;
      setTimeout(() => (copiedIndex = null), 1500);
    });
  }
</script>

<div class="bg-stone-950 text-stone-100 p-6 rounded-2xl border border-stone-800 shadow-2xl font-sans min-h-[400px]">
  <!-- Header -->
  <div class="flex items-center gap-3 mb-6">
    <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-700 flex items-center justify-center text-stone-950 font-black text-lg">
      💼
    </div>
    <div>
      <h2 class="font-extrabold text-lg bg-gradient-to-r from-amber-300 via-amber-100 to-amber-400 bg-clip-text text-transparent leading-tight">
        {l.title}
      </h2>
      <p class="text-stone-500 text-xs mt-0.5">{l.subtitle}</p>
    </div>
  </div>

  <!-- Split Grid -->
  <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
    <!-- Left Panel: Inputs -->
    <div class="lg:col-span-5 space-y-4">
      <label class="block">
        <span class="text-xs text-stone-400 mb-1.5 block">{l.jobTitle}</span>
        <input
          type="text"
          bind:value={jobTitle}
          placeholder="e.g. Full Stack Architect"
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
            placeholder="e.g. 8"
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
        <input
          type="text"
          bind:value={valueProp}
          placeholder={l.valuePropPlaceholder}
          class="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-2 text-sm text-stone-100 focus:border-amber-500 focus:outline-none transition-colors"
        />
      </label>

      <label class="block">
        <span class="text-xs text-stone-400 mb-1.5 block">{l.keySkills}</span>
        <textarea
          bind:value={keySkills}
          placeholder="e.g. TypeScript, React, System Design"
          rows="3"
          class="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-2 text-sm text-stone-100 focus:border-amber-500 focus:outline-none transition-colors resize-none"
        ></textarea>
      </label>
    </div>

    <!-- Right Panel: Output Layouts -->
    <div class="lg:col-span-7 flex flex-col justify-between space-y-4">
      {#if headlines.length > 0}
        <div class="space-y-4 flex-1 flex flex-col justify-start">
          {#each headlines as headline, idx}
            {@const layoutLabel = idx === 0 ? l.layoutClassic : idx === 1 ? l.layoutOutcome : l.layoutMinimalist}
            <div class="bg-stone-900 border border-stone-850 rounded-xl p-4 flex flex-col justify-between hover:border-amber-500/30 transition-all group">
              <div class="flex items-center justify-between mb-2">
                <span class="text-xxs text-amber-500 font-semibold tracking-wider uppercase">{layoutLabel}</span>
                <button
                  type="button"
                  onclick={() => copyHeadline(headline, idx)}
                  class="text-stone-500 hover:text-stone-300 text-xs px-2 py-0.5 rounded border border-stone-800 hover:border-stone-700 transition-all"
                >
                  {copiedIndex === idx ? l.copied : '📋'}
                </button>
              </div>
              <div class="text-stone-200 text-sm font-medium leading-relaxed font-mono select-all">
                {headline}
              </div>
            </div>
          {/each}
        </div>
      {:else}
        <!-- Placeholder Empty State -->
        <div class="h-full flex flex-col items-center justify-center text-center p-12 bg-stone-900/25 border border-dashed border-stone-850 rounded-xl">
          <div class="text-4xl mb-4">💡</div>
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
