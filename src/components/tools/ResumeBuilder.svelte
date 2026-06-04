<script lang="ts">
  import { onMount } from 'svelte';

  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const tools = translations['tools'] as Record<string, unknown> || {};
    const scope = tools['resume'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) {
      value = (value as Record<string, unknown>)?.[k];
    }
    return typeof value === 'string' ? value : `MISSING: tools.resume.${key}`;
  }

  // Types
  type TemplateType = 'professional' | 'minimal' | 'creative';
  type LangLevel = 'native' | 'fluent' | 'advanced' | 'intermediate' | 'basic';
  interface Experience {
    id: string;
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    description: string;
    current: boolean;
  }
  interface Education {
    id: string;
    school: string;
    degree: string;
    field: string;
    graduationDate: string;
    gpa?: string;
  }
  interface ResumeSkill {
    name: string;
    level: number;
  }
  interface ResumeLanguage {
    name: string;
    level: LangLevel;
  }

  const LANG_LEVELS: LangLevel[] = ['native', 'fluent', 'advanced', 'intermediate', 'basic'];
  const PDF_MARGIN_MM = 10;

  // Refs
  let resumeRef = $state<HTMLDivElement | null>(null);
  let fileInputRef = $state<HTMLInputElement | null>(null);

  // States
  let activeTab = $state('edit');
  let template = $state<TemplateType>('professional');
  let photo = $state<string | null>(null);
  let accentColor = $state('#2563eb');

  let name = $state('');
  let title = $state('');
  let email = $state('');
  let phone = $state('');
  let location = $state('');
  let website = $state('');
  let summary = $state('');

  let skills = $state<ResumeSkill[]>([]);
  let newSkill = $state('');
  let newSkillLevel = $state(80);

  let languages = $state<ResumeLanguage[]>([]);
  let newLang = $state('');
  let newLangLevel = $state<LangLevel>('intermediate');

  let experiences = $state<Experience[]>([]);
  let educations = $state<Education[]>([]);

  // Derived states
  const templateClass = $derived(getTemplateClasses(template));

  // Persistence
  let isMounted = $state(false);
  let saveTimeout: NodeJS.Timeout;

  onMount(() => {
    isMounted = true;
    try {
      const saved = localStorage.getItem('u2tool_resume_data');
      if (saved) {
        const data = JSON.parse(saved);
        if (data.template !== undefined) template = data.template;
        if (data.photo !== undefined) photo = data.photo;
        if (data.accentColor !== undefined) accentColor = data.accentColor;
        if (data.name !== undefined) name = data.name;
        if (data.title !== undefined) title = data.title;
        if (data.email !== undefined) email = data.email;
        if (data.phone !== undefined) phone = data.phone;
        if (data.location !== undefined) location = data.location;
        if (data.website !== undefined) website = data.website;
        if (data.summary !== undefined) summary = data.summary;
        if (data.skills !== undefined) skills = data.skills;
        if (data.languages !== undefined) languages = data.languages;
        if (data.experiences !== undefined) experiences = data.experiences;
        if (data.educations !== undefined) educations = data.educations;
      }
    } catch (e) {
      console.error('Failed to load resume state:', e);
    }
  });

  $effect(() => {
    // Collect dependencies
    const data = {
      template,
      photo,
      accentColor,
      name,
      title,
      email,
      phone,
      location,
      website,
      summary,
      skills: $state.snapshot(skills),
      languages: $state.snapshot(languages),
      experiences: $state.snapshot(experiences),
      educations: $state.snapshot(educations)
    };

    if (!isMounted) return;

    clearTimeout(saveTimeout);
    saveTimeout = setTimeout(() => {
      try {
        localStorage.setItem('u2tool_resume_data', JSON.stringify(data));
      } catch (e) {
        console.error('Failed to save resume state:', e);
      }
    }, 500); // 500ms debounce
  });

  // Functions
  function getLangLabel(level: LangLevel): string {
    return t(`langLevels.${level}`);
  }

  function getTemplateClasses(currentTemplate: TemplateType): string {
    switch (currentTemplate) {
      case 'minimal':
        return 'border border-gray-200/80 rounded-sm font-serif';
      case 'creative':
        return 'border-l-8 bg-gradient-to-br from-white via-white to-slate-50 border-[var(--accent)]';
      case 'professional':
      default:
        return 'border-t-[10px] border-[var(--accent)]';
    }
  }

  function handlePhotoUpload(e: Event) {
    const target = e.currentTarget as HTMLInputElement | null;
    const file = target?.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        photo = (ev.target?.result as string) || null;
      };
      reader.readAsDataURL(file);
    }
  }

  function addSkill() {
    if (newSkill.trim()) {
      skills = [...skills, { name: newSkill.trim(), level: newSkillLevel }];
      newSkill = '';
      newSkillLevel = 80;
    }
  }

  function removeSkill(idx: number) {
    skills = skills.filter((_, i) => i !== idx);
  }

  function addLanguage() {
    if (newLang.trim()) {
      languages = [...languages, { name: newLang.trim(), level: newLangLevel }];
      newLang = '';
      newLangLevel = 'intermediate';
    }
  }

  function removeLanguage(idx: number) {
    languages = languages.filter((_, i) => i !== idx);
  }

  function addExperience() {
    experiences = [
      ...experiences,
      { id: Date.now().toString(), company: '', position: '', startDate: '', endDate: '', description: '', current: false }
    ];
  }

  function removeExperience(id: string) {
    experiences = experiences.filter(exp => exp.id !== id);
  }

  function addEducation() {
    educations = [
      ...educations,
      { id: Date.now().toString(), school: '', degree: '', field: '', graduationDate: '', gpa: '' }
    ];
  }

  function removeEducation(id: string) {
    educations = educations.filter(edu => edu.id !== id);
  }

  async function exportPDF() {
    if (!resumeRef) return;
    try {
      const html2canvas = (await import('html2canvas')).default;
      const jsPDF = (await import('jspdf')).default;
      const canvas = await html2canvas(resumeRef, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        windowWidth: resumeRef.scrollWidth,
        windowHeight: resumeRef.scrollHeight,
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const contentWidth = pageWidth - PDF_MARGIN_MM * 2;
      const contentHeight = (canvas.height * contentWidth) / canvas.width;
      const pageContentHeight = pageHeight - PDF_MARGIN_MM * 2;

      for (let renderedHeight = 0; renderedHeight < contentHeight; renderedHeight += pageContentHeight) {
        if (renderedHeight > 0) {
          pdf.addPage();
        }
        pdf.addImage(
          imgData,
          'PNG',
          PDF_MARGIN_MM,
          PDF_MARGIN_MM - renderedHeight,
          contentWidth,
          contentHeight,
          undefined,
          'FAST'
        );
      }

      pdf.save(`${name.trim() || 'resume'}.pdf`);
    } catch (error) {
      console.error('Resume PDF export failed:', error);
    }
  }
</script>

{#snippet renderPreview()}
  <div bind:this={resumeRef} class="bg-white text-gray-900 p-8 min-h-[297mm] w-[210mm] mx-auto shadow-md text-sm leading-relaxed flex flex-col {templateClass}" style="--accent: {accentColor}">
    <div class="flex items-start gap-6 mb-6">
      {#if photo}
        <img src={photo} alt="Photo" class="w-24 h-24 rounded-full object-cover border-2 shadow-sm shrink-0" style="border-color: {accentColor}" />
      {/if}
      <div class="flex-1">
        <h1 class="text-3xl font-bold tracking-tight" style="color: {accentColor}">{name || t('placeholders.name')}</h1>
        <p class="text-lg font-medium text-gray-600 mt-1">{title || t('placeholders.title')}</p>
        <div class="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-xs text-gray-500 font-medium">
          {#if email}
            <span class="flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
              {email}
            </span>
          {/if}
          {#if phone}
            <span class="flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><path d="M12 18h.01"/></svg>
              {phone}
            </span>
          {/if}
          {#if location}
            <span class="flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
              {location}
            </span>
          {/if}
          {#if website}
            <span class="flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>
              {website}
            </span>
          {/if}
        </div>
      </div>
    </div>

    {#if summary}
      <section class="mb-6">
        <h2 class="text-base font-bold border-b pb-1 mb-2 uppercase tracking-wide" style="border-color: {accentColor}; color: {accentColor}">{t('summary')}</h2>
        <p class="text-gray-700 whitespace-pre-wrap leading-relaxed">{summary}</p>
      </section>
    {/if}

    {#if experiences.length > 0}
      <section class="mb-6">
        <h2 class="text-base font-bold border-b pb-1 mb-3 uppercase tracking-wide" style="border-color: {accentColor}; color: {accentColor}">{t('experience')}</h2>
        <div class="space-y-4">
          {#each experiences as exp (exp.id)}
            <div>
              <div class="flex justify-between items-baseline font-semibold text-gray-900">
                <div><span>{exp.position}</span> <span class="text-gray-400 font-normal">@</span> <span>{exp.company || '—'}</span></div>
                <span class="text-xs text-gray-500 font-medium">{exp.startDate || '—'} - {exp.current ? t('present') : (exp.endDate || '—')}</span>
              </div>
              <p class="text-gray-600 text-xs whitespace-pre-wrap mt-1.5 leading-relaxed">{exp.description}</p>
            </div>
          {/each}
        </div>
      </section>
    {/if}

    {#if educations.length > 0}
      <section class="mb-6">
        <h2 class="text-base font-bold border-b pb-1 mb-3 uppercase tracking-wide" style="border-color: {accentColor}; color: {accentColor}">{t('education')}</h2>
        <div class="space-y-3">
          {#each educations as edu (edu.id)}
            <div>
              <div class="flex justify-between items-baseline font-semibold text-gray-900">
                <div><span>{edu.degree || '—'}</span> <span class="text-gray-400 font-normal">in</span> <span>{edu.field || '—'}</span></div>
                <span class="text-xs text-gray-500 font-medium">{edu.graduationDate || '—'}</span>
              </div>
              <p class="text-gray-600 text-xs mt-1">{edu.school || '—'} {#if edu.gpa}<span>({t('gpa')}: {edu.gpa})</span>{/if}</p>
            </div>
          {/each}
        </div>
      </section>
    {/if}

    <div class="grid grid-cols-2 gap-8 mt-auto">
      {#if skills.length > 0}
        <section>
          <h2 class="text-base font-bold border-b pb-1 mb-3 uppercase tracking-wide" style="border-color: {accentColor}; color: {accentColor}">{t('skills')}</h2>
          <div class="space-y-2">
            {#each skills as skill}
              <div>
                <div class="flex justify-between text-xs font-medium text-gray-700">
                  <span>{skill.name}</span>
                  <span>{skill.level}%</span>
                </div>
                <div class="h-1.5 bg-gray-100 rounded-full mt-1 overflow-hidden">
                  <div class="h-full rounded-full transition-all duration-500" style="width: {skill.level}%; background-color: {accentColor}"></div>
                </div>
              </div>
            {/each}
          </div>
        </section>
      {/if}

      {#if languages.length > 0}
        <section>
          <h2 class="text-base font-bold border-b pb-1 mb-3 uppercase tracking-wide" style="border-color: {accentColor}; color: {accentColor}">{t('languages')}</h2>
          <ul class="space-y-1.5 text-xs text-gray-700 font-medium">
            {#each languages as lang}
              <li class="flex justify-between py-0.5 border-b border-gray-100">
                <span>{lang.name}</span>
                <span class="text-gray-500 font-normal">{getLangLabel(lang.level)}</span>
              </li>
            {/each}
          </ul>
        </section>
      {/if}
    </div>
  </div>
{/snippet}

<div class="space-y-6">
  <!-- Controls Bar -->
  <div class="flex flex-wrap gap-3 border-b border-gray-200 dark:border-gray-700/60 pb-4 items-center">
    <button onclick={() => activeTab = 'edit'}
      class="px-4 py-2 rounded-lg font-medium transition-colors {activeTab === 'edit' ? 'bg-amber-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'}">
      {t('editTab')}
    </button>
    <button onclick={() => activeTab = 'preview'}
      class="px-4 py-2 rounded-lg font-medium transition-colors {activeTab === 'preview' ? 'bg-amber-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'}">
      {t('previewTab')}
    </button>
    
    <div class="flex-1"></div>

    <div class="flex items-center gap-2">
      <select value={template} onchange={e => template = e.currentTarget.value as TemplateType}
        class="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-amber-500">
        <option value="professional">{t('templates.professional')}</option>
        <option value="minimal">{t('templates.minimal')}</option>
        <option value="creative">{t('templates.creative')}</option>
      </select>
      
      <input type="color" value={accentColor} onchange={e => accentColor = e.currentTarget.value}
        class="w-10 h-10 rounded cursor-pointer border border-gray-300 dark:border-gray-600 bg-transparent" title={t('accentColor')} />
      
      <button onclick={exportPDF}
        class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors shadow-sm">
        {t('exportPDF')}
      </button>
    </div>
  </div>

  {#if activeTab === 'edit'}
    <div class="max-w-4xl mx-auto space-y-6">
      <!-- Personal Info -->
      <section class="bg-gray-50 dark:bg-gray-800/40 border border-gray-200/60 dark:border-gray-700/50 rounded-2xl p-6 space-y-4">
        <h3 class="font-bold text-lg text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700/60 pb-2">{t('personalInfo')}</h3>
        <div class="flex items-center gap-6">
          <div class="relative shrink-0">
            {#if photo}
              <img src={photo} alt="Photo" class="w-20 h-20 rounded-full object-cover border-2 border-gray-300 dark:border-gray-600" />
            {:else}
              <div class="w-20 h-20 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-3xl text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              </div>
            {/if}
            <input bind:this={fileInputRef} type="file" accept="image/*" onchange={handlePhotoUpload} class="hidden" />
            <button onclick={() => fileInputRef?.click()}
              class="absolute -bottom-1 -right-1 w-8 h-8 bg-amber-600 text-white rounded-full text-sm hover:bg-amber-700 flex items-center justify-center shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>
            </button>
          </div>
          <div class="flex-1 grid grid-cols-2 gap-3">
            <input type="text" value={name} oninput={e => name = e.currentTarget.value} placeholder={t('placeholders.name')}
              class="col-span-2 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500" />
            <input type="text" value={title} oninput={e => title = e.currentTarget.value} placeholder={t('placeholders.title')}
              class="col-span-2 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500" />
          </div>
        </div>
        <div class="grid grid-cols-2 gap-3">
          <input type="email" value={email} oninput={e => email = e.currentTarget.value} placeholder={t('placeholders.email')}
            class="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500" />
          <input type="text" value={phone} oninput={e => phone = e.currentTarget.value} placeholder={t('placeholders.phone')}
            class="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500" />
          <input type="text" value={location} oninput={e => location = e.currentTarget.value} placeholder={t('placeholders.location')}
            class="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500" />
          <input type="text" value={website} oninput={e => website = e.currentTarget.value} placeholder={t('placeholders.website')}
            class="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500" />
        </div>
        <textarea value={summary} oninput={e => summary = e.currentTarget.value} placeholder={t('summaryPlaceholder')} rows={3}
          class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white resize-none focus:ring-2 focus:ring-amber-500" />
      </section>

      <!-- Experience -->
      <section class="bg-gray-50 dark:bg-gray-800/40 border border-gray-200/60 dark:border-gray-700/50 rounded-2xl p-6 space-y-4">
        <div class="flex justify-between items-center border-b border-gray-200 dark:border-gray-700/60 pb-2">
          <h3 class="font-bold text-lg text-gray-900 dark:text-white">{t('experience')}</h3>
          <button onclick={addExperience} class="px-3 py-1.5 bg-amber-600 text-white rounded-lg text-sm font-semibold hover:bg-amber-700 flex items-center gap-1">
            <span>+</span> {t('addExperience')}
          </button>
        </div>
        
        <div class="space-y-4">
          {#each experiences as exp, index (exp.id)}
            <div class="border border-gray-200 dark:border-gray-700/60 rounded-xl p-4 space-y-3 bg-white dark:bg-gray-900/30 relative">
              <button onclick={() => removeExperience(exp.id)}
                class="absolute top-3 right-3 text-red-500 hover:text-red-700 font-bold text-lg">
                ×
              </button>
              
              <div class="grid grid-cols-2 gap-3 pr-6">
                <input type="text" value={exp.company}
                  oninput={e => { experiences[index].company = e.currentTarget.value; }}
                  placeholder={t('company')}
                  class="px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-amber-500" />
                
                <input type="text" value={exp.position}
                  oninput={e => { experiences[index].position = e.currentTarget.value; }}
                  placeholder={t('position')}
                  class="px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-amber-500" />
              </div>
              
              <div class="flex gap-3 items-center">
                <input type="month" value={exp.startDate}
                  oninput={e => { experiences[index].startDate = e.currentTarget.value; }}
                  class="flex-1 px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-amber-500" />
                
                <span class="text-gray-500">-</span>
                
                <input type="month" value={exp.endDate}
                  oninput={e => { experiences[index].endDate = e.currentTarget.value; }}
                  disabled={exp.current}
                  class="flex-1 px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm disabled:opacity-40 focus:ring-2 focus:ring-amber-500" />
                
                <label class="flex items-center gap-1.5 text-xs font-semibold text-gray-600 dark:text-gray-400 select-none cursor-pointer">
                  <input type="checkbox" checked={exp.current}
                    onchange={e => { experiences[index].current = e.currentTarget.checked; }}
                    class="w-4 h-4 rounded text-amber-600" />
                  {t('present')}
                </label>
              </div>
              
              <textarea value={exp.description}
                oninput={e => { experiences[index].description = e.currentTarget.value; }}
                placeholder={t('jobDescription')} rows={2}
                class="w-full px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm resize-none focus:ring-2 focus:ring-amber-500" />
            </div>
          {/each}
        </div>
      </section>

      <!-- Education -->
      <section class="bg-gray-50 dark:bg-gray-800/40 border border-gray-200/60 dark:border-gray-700/50 rounded-2xl p-6 space-y-4">
        <div class="flex justify-between items-center border-b border-gray-200 dark:border-gray-700/60 pb-2">
          <h3 class="font-bold text-lg text-gray-900 dark:text-white">{t('education')}</h3>
          <button onclick={addEducation} class="px-3 py-1.5 bg-amber-600 text-white rounded-lg text-sm font-semibold hover:bg-amber-700 flex items-center gap-1">
            <span>+</span> {t('addEducation')}
          </button>
        </div>
        
        <div class="space-y-4">
          {#each educations as edu, index (edu.id)}
            <div class="border border-gray-200 dark:border-gray-700/60 rounded-xl p-4 space-y-3 bg-white dark:bg-gray-900/30 relative">
              <button onclick={() => removeEducation(edu.id)}
                class="absolute top-3 right-3 text-red-500 hover:text-red-700 font-bold text-lg">
                ×
              </button>
              
              <div class="grid grid-cols-2 gap-3 pr-6">
                <input type="text" value={edu.school}
                  oninput={e => { educations[index].school = e.currentTarget.value; }}
                  placeholder={t('school')}
                  class="px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-amber-500" />
                
                <input type="text" value={edu.degree}
                  oninput={e => { educations[index].degree = e.currentTarget.value; }}
                  placeholder={t('degree')}
                  class="px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-amber-500" />
              </div>
              
              <div class="grid grid-cols-2 gap-3">
                <input type="text" value={edu.field}
                  oninput={e => { educations[index].field = e.currentTarget.value; }}
                  placeholder={t('fieldOfStudy')}
                  class="px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-amber-500" />
                
                <div class="flex gap-2">
                  <input type="month" value={edu.graduationDate}
                    oninput={e => { educations[index].graduationDate = e.currentTarget.value; }}
                    class="flex-1 px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-amber-500" />
                  
                  <input type="text" value={edu.gpa || ''}
                    oninput={e => { educations[index].gpa = e.currentTarget.value; }}
                    placeholder={t('gpa')}
                    class="w-20 px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-amber-500" />
                </div>
              </div>
            </div>
          {/each}
        </div>
      </section>

      <!-- Skills and Languages side-by-side -->
      <div class="grid md:grid-cols-2 gap-6">
        <section class="bg-gray-50 dark:bg-gray-800/40 border border-gray-200/60 dark:border-gray-700/50 rounded-2xl p-6 space-y-4">
          <h3 class="font-bold text-lg text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700/60 pb-2">{t('skills')}</h3>
          <div class="flex gap-2 items-center">
            <input type="text" bind:value={newSkill} placeholder={t('addSkill')}
              onkeydown={e => e.key === 'Enter' && addSkill()}
              class="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-amber-500" />
            
            <input type="range" min="10" max="100" bind:value={newSkillLevel} class="w-20 h-2 bg-gray-200 rounded-lg cursor-pointer" />
            <span class="w-10 text-xs font-semibold text-gray-600 dark:text-gray-400 text-center">{newSkillLevel}%</span>
            
            <button onclick={addSkill} class="px-3 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 font-bold">+</button>
          </div>
          
          {#if skills.length === 0}
            <p class="text-gray-500 text-sm italic">{t('noSkills')}</p>
          {:else}
            <div class="flex flex-wrap gap-2">
              {#each skills as skill, idx (idx)}
                <span class="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 rounded-full text-xs font-semibold border border-amber-200 dark:border-amber-900/40">
                  {skill.name} ({skill.level}%)
                  <button onclick={() => removeSkill(idx)} class="text-amber-600 hover:text-red-500 font-bold ml-1">×</button>
                </span>
              {/each}
            </div>
          {/if}
        </section>

        <section class="bg-gray-50 dark:bg-gray-800/40 border border-gray-200/60 dark:border-gray-700/50 rounded-2xl p-6 space-y-4">
          <h3 class="font-bold text-lg text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700/60 pb-2">{t('languages')}</h3>
          <div class="flex gap-2">
            <input type="text" bind:value={newLang} placeholder={t('addLanguage')}
              onkeydown={e => e.key === 'Enter' && addLanguage()}
              class="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-amber-500" />
            
            <select bind:value={newLangLevel}
              class="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-amber-500">
              {#each LANG_LEVELS as lvl (lvl)}
                <option value={lvl}>{getLangLabel(lvl)}</option>
              {/each}
            </select>
            
            <button onclick={addLanguage} class="px-3 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 font-bold">+</button>
          </div>
          
          {#if languages.length > 0}
            <div class="flex flex-wrap gap-2">
              {#each languages as lang, idx (idx)}
                <span class="inline-flex items-center gap-1.5 px-3 py-1 bg-green-100 dark:bg-green-950/40 text-green-800 dark:text-green-300 rounded-full text-xs font-semibold border border-green-200 dark:border-green-900/40">
                  {lang.name} - {getLangLabel(lang.level)}
                  <button onclick={() => removeLanguage(idx)} class="text-green-600 hover:text-red-500 font-bold ml-1">×</button>
                </span>
              {/each}
            </div>
          {/if}
        </section>
      </div>
    </div>
  {:else}
    <div class="overflow-auto bg-gray-100 dark:bg-gray-900 p-6 rounded-2xl flex items-center justify-center border border-gray-200 dark:border-gray-800">
      {@render renderPreview()}
    </div>
  {/if}
</div>
