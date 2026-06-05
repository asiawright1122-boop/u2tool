<script lang="ts">
  import {
    generateCoverLetter,
  } from '../../lib/cover-letter-helper';

  interface Props {
    locale?: string;
    translations?: Record<string, unknown>;
  }

  let { locale = 'en', translations = {} }: Props = $props();

  const I18N_BACKUP: Record<string, Record<string, string>> = {
    zh: {
      title: '智能求职信生成器',
      subtitle: '输入您的背景信息，快速拼装出得体、专业的求职信文案',
      candidateName: '您的姓名',
      jobTitle: '申请岗位名称',
      companyName: '目标公司',
      keySkills: '核心专业技能 (逗号分隔)',
      experienceYears: '相关工作年限 (年)',
      tone: '文案语调基调',
      professional: '沉稳专业 (Professional)',
      creative: '创意个性 (Creative)',
      enthusiastic: '热忱积极 (Enthusiastic)',
      confident: '自信果敢 (Confident)',
      placeholderText: '请输入您的个人与岗位背景信息以生成精美求职信。',
      copyResult: '复制求职信',
      copied: '✓ 已复制!',
      disclaimer: '本工具提供的文案由模板动态拼装生成，建议在投递前根据您的真实经历进行微调。',
    },
    en: {
      title: 'Cover Letter Generator',
      subtitle: 'Generate customized, compelling cover letters based on your professional background',
      candidateName: 'Your Name',
      jobTitle: 'Target Job Title',
      companyName: 'Target Company',
      keySkills: 'Key Professional Skills (comma separated)',
      experienceYears: 'Years of Experience',
      tone: 'Writing Tone',
      professional: 'Professional',
      creative: 'Creative',
      enthusiastic: 'Enthusiastic',
      confident: 'Confident',
      placeholderText: 'Enter your name, job title, and skills to generate your custom cover letter.',
      copyResult: 'Copy Cover Letter',
      copied: '✓ Copied!',
      disclaimer: 'This tool generates text templates. We recommend customizing the output to reflect your actual experience before applying.',
    },
    es: {
      title: 'Generador de Carta de Presentación',
      subtitle: 'Cree cartas de presentación convincentes y personalizadas según su trayectoria',
      candidateName: 'Su Nombre',
      jobTitle: 'Puesto Objetivo',
      companyName: 'Empresa Objetivo',
      keySkills: 'Habilidades Clave (separadas por comas)',
      experienceYears: 'Años de Experiencia',
      tone: 'Tono de Redacción',
      professional: 'Profesional',
      creative: 'Creativo',
      enthusiastic: 'Entusiasta',
      confident: 'Confiado',
      placeholderText: 'Ingrese su nombre, puesto y habilidades para generar su carta de presentación.',
      copyResult: 'Copiar Carta',
      copied: '¡Copiado!',
      disclaimer: 'Esta herramienta genera textos plantilla. Le recomendamos revisar el texto final antes de postular.',
    },
    pt: {
      title: 'Gerador de Carta de Apresentação',
      subtitle: 'Gere cartas de apresentação atraentes e personalizadas com base no seu perfil',
      candidateName: 'Seu Nome',
      jobTitle: 'Cargo de Interesse',
      companyName: 'Empresa Alvo',
      keySkills: 'Principais Habilidades (separadas por vírgula)',
      experienceYears: 'Anos de Experiência',
      tone: 'Tom da Mensagem',
      professional: 'Profissional',
      creative: 'Criativo',
      enthusiastic: 'Entusiasta',
      confident: 'Confiante',
      placeholderText: 'Insira seu nome, cargo e habilidades para gerar sua carta de apresentação.',
      copyResult: 'Copiar Carta',
      copied: 'Copiado!',
      disclaimer: 'Esta ferramenta gera templates de texto. Recomendamos adaptar a saída às suas experiências reais.',
    },
    ja: {
      title: '求職カバーレター作成ツール',
      subtitle: '経歴や応募職種を入力するだけで、適切で魅力的なカバーレターを瞬時に作成します',
      candidateName: 'お名前',
      jobTitle: '応募職種名',
      companyName: '志望企業名',
      keySkills: 'アピールしたい専門スキル (カンマ区切り)',
      experienceYears: '関連する実務年数 (年)',
      tone: '文章のトーン',
      professional: '誠実・プロフェッショナル (Professional)',
      creative: '独創的・クリエイティブ (Creative)',
      enthusiastic: '熱意・ポジティブ (Enthusiastic)',
      confident: '自信・アピール重視 (Confident)',
      placeholderText: '氏名、応募職種、スキルを入力してカバーレターを生成します。',
      copyResult: 'カバーレターをコピー',
      copied: 'コピーしました！',
      disclaimer: '本ツールは定型テンプレートを組み立てて出力します。応募前にご自身の経歴に合わせて修正してください。',
    },
    fr: {
      title: 'Générateur de Lettre de Motivation',
      subtitle: 'Générez des lettres de motivation personnalisées selon votre parcours professionnel',
      candidateName: 'Votre Nom',
      jobTitle: 'Poste Visé',
      companyName: 'Entreprise Visée',
      keySkills: 'Compétences Clés (séparées par des virgules)',
      experienceYears: 'Années d\'Expérience',
      tone: 'Ton de Rédaction',
      professional: 'Professionnel',
      creative: 'Créatif',
      enthusiastic: 'Enthousiaste',
      confident: 'Confiant',
      placeholderText: 'Saisissez votre nom, poste et compétences pour générer votre lettre de motivation.',
      copyResult: 'Copier la Lettre',
      copied: 'Copié !',
      disclaimer: 'Cet outil génère des modèles. Nous vous conseillons de personnaliser la lettre finale avant tout envoi.',
    },
    de: {
      title: 'Anschreiben-Generator',
      subtitle: 'Erstellen Sie maßgeschneiderte Bewerbungsanschreiben basierend auf Ihrem Profil',
      candidateName: 'Ihr Name',
      jobTitle: 'Gewünschte Position',
      companyName: 'Unternehmen',
      keySkills: 'Schlüsselkompetenzen (kommagetrennt)',
      experienceYears: 'Berufserfahrung (Jahre)',
      tone: 'Schreibstil',
      professional: 'Professionell',
      creative: 'Kreativ',
      enthusiastic: 'Enthusiastisch',
      confident: 'Selbstbewusst',
      placeholderText: 'Geben Sie Name, Position und Fähigkeiten ein, um Ihr Anschreiben zu generieren.',
      copyResult: 'Anschreiben kopieren',
      copied: 'Kopiert!',
      disclaimer: 'Dieses Tool generiert Textvorlagen. Wir empfehlen, den Text vor der Bewerbung an Ihre reale Erfahrung anzupassen.',
    },
    ar: {
      title: 'حاسبة رسائل التغطية (Cover Letter)',
      subtitle: 'أنشئ رسائل تغطية مخصصة ومقنعة بناءً على خلفيتك المهنية وخبراتك',
      candidateName: 'اسمك الكريم',
      jobTitle: 'المسمى الوظيفي المستهدف',
      companyName: 'الشركة المستهدفة',
      keySkills: 'المهارات الأساسية (مفصولة بفاصلة)',
      experienceYears: 'سنوات الخبرة ذات الصلة',
      tone: 'أسلوب الكتابة',
      professional: 'مهني رصين (Professional)',
      creative: 'إبداعي متميز (Creative)',
      enthusiastic: 'حماسي متقد (Enthusiastic)',
      confident: 'واثق وجريء (Confident)',
      placeholderText: 'أدخل اسمك والمسمى الوظيفي والمهارات لإنشاء رسالة التغطية المخصصة.',
      copyResult: 'نسخ الرسالة',
      copied: 'تم النسخ!',
      disclaimer: 'تولد هذه الأداة نماذج نصوص مقترحة. نوصي بتخصيص المخرج ليعبر عن خبرتك الواقعية قبل التقديم.',
    },
    ko: {
      title: '스마트 자기소개서 (커버레터) 생성기',
      subtitle: '개인 배경 정보를 입력하여 지원하려는 기업에 어울리는 맞춤형 자기소개서를 조합합니다',
      candidateName: '지원자 성명',
      jobTitle: '지원 분야 (직무)',
      companyName: '지원 대상 기업',
      keySkills: '핵심 전문 기술 (쉼표로 구분)',
      experienceYears: '관련 경력 (년)',
      tone: '자기소개서 어조',
      professional: '차분하고 전문적인 (Professional)',
      creative: '창의적이고 독특한 (Creative)',
      enthusiastic: '열정적이고 적극적인 (Enthusiastic)',
      confident: ' 자신감 넘치는 (Confident)',
      placeholderText: '성명, 지원 직무, 보유 기술 등을 입력해 맞춤형 자기소개서를 생성해보세요.',
      copyResult: '자기소개서 복사',
      copied: '복사 완료!',
      disclaimer: '본 도구는 입력한 정보를 템플릿과 조합합니다. 제출 전 실제 경험에 맞춰 다듬는 것을 권장합니다.',
    },
    ru: {
      title: 'Генератор сопроводительных писем',
      subtitle: 'Создавайте персонализированные сопроводительные письма на основе вашей биографии',
      candidateName: 'Ваше имя',
      jobTitle: 'Целевая должность',
      companyName: 'Целевая компания',
      keySkills: 'Ключевые навыки (через запятую)',
      experienceYears: 'Опыт работы (лет)',
      tone: 'Тон письма',
      professional: 'Профессиональный',
      creative: 'Творческий',
      enthusiastic: 'Энтузиазм',
      confident: 'Уверенный',
      placeholderText: 'Введите имя, должность и навыки для генерации сопроводительного письма.',
      copyResult: 'Скопировать письмо',
      copied: 'Скопировано!',
      disclaimer: 'Этот инструмент создает шаблоны. Рекомендуется адаптировать текст к реальному опыту перед отправкой.',
    },
  };

  const l = $derived(I18N_BACKUP[locale] || I18N_BACKUP['en']);

  let candidateName = $state('');
  let jobTitle = $state('');
  let companyName = $state('');
  let keySkills = $state('');
  let experienceYears = $state('');
  let tone = $state('professional');

  const result = $derived((() => {
    const name = candidateName.trim();
    const job = jobTitle.trim();

    if (!name || !job) return null;

    const exp = parseInt(experienceYears, 10) || 0;
    const skills = keySkills.split(',').map(s => s.trim()).filter(Boolean);

    return generateCoverLetter({
      candidateName: name,
      jobTitle: job,
      companyName: companyName.trim() || undefined,
      keySkills: skills.length > 0 ? skills : undefined,
      experienceYears: exp > 0 ? exp : undefined,
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
      📄
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
    <!-- Left panel: Inputs (span 5) -->
    <div class="lg:col-span-5 space-y-4">
      <label class="block">
        <span class="text-xs text-stone-400 mb-1.5 block">{l.candidateName}</span>
        <input
          type="text"
          bind:value={candidateName}
          placeholder="e.g. John Doe"
          class="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-2 text-sm text-stone-100 focus:border-amber-500 focus:outline-none transition-colors"
        />
      </label>

      <label class="block">
        <span class="text-xs text-stone-400 mb-1.5 block">{l.jobTitle}</span>
        <input
          type="text"
          bind:value={jobTitle}
          placeholder="e.g. Frontend Engineer"
          class="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-2 text-sm text-stone-100 focus:border-amber-500 focus:outline-none transition-colors"
        />
      </label>

      <label class="block">
        <span class="text-xs text-stone-400 mb-1.5 block">{l.companyName}</span>
        <input
          type="text"
          bind:value={companyName}
          placeholder="e.g. Google"
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
            placeholder="e.g. 5"
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
        <span class="text-xs text-stone-400 mb-1.5 block">{l.keySkills}</span>
        <textarea
          bind:value={keySkills}
          placeholder="e.g. React, TypeScript, Tailwind CSS"
          rows="3"
          class="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-2 text-sm text-stone-100 focus:border-amber-500 focus:outline-none transition-colors resize-none"
        ></textarea>
      </label>
    </div>

    <!-- Right panel: Document Preview (span 7) -->
    <div class="lg:col-span-7 flex flex-col justify-between space-y-4">
      {#if result}
        <div class="space-y-4 flex-1 flex flex-col">
          <!-- Textarea Paper Preview -->
          <div class="flex-1 min-h-[300px] bg-stone-900 border border-stone-850 rounded-xl p-5 font-serif text-sm text-stone-200 leading-relaxed whitespace-pre-wrap select-all relative overflow-hidden">
            <div class="absolute -right-6 -bottom-6 text-7xl opacity-5 select-none">📄</div>
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
