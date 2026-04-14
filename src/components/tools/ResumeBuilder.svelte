<script lang="ts">
  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['resume'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.resume.${key}`;
  }

  // Types
  type TemplateType = 'professional' | 'minimal' | 'creative';
  type LangLevel = 'native' | 'fluent' | 'advanced' | 'intermediate' | 'basic';
  interface Experience { id: string; company: string; position: string; startDate: string; endDate: string; description: string; current: boolean; }
  interface Education { id: string; school: string; degree: string; field: string; graduationDate: string; gpa?: string; }
  interface ResumeSkill { name: string; level: number; }
  interface ResumeLanguage { name: string; level: LangLevel; }

  const LANG_LEVELS: LangLevel[] = ['native', 'fluent', 'advanced', 'intermediate', 'basic'];
  const PDF_MARGIN_MM = 10;

  let resumeRef = $state<HTMLDivElement | null>(null);

  let fileInputRef = $state<HTMLInputElement | null>(null);

  let activeTab = $state('edit');

  let template = $state('professional');

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

  let newLangLevel = $state('intermediate');

  let experiences = $state<Experience[]>([]);

  let educations = $state<Education[]>([]);

  // Functions
  function getLangLabel(level: LangLevel): string {
    return t(`langLevels.${level}`);
  }

  function getTemplateClasses(currentTemplate: TemplateType): string {
    switch (currentTemplate) {
      case 'minimal':
        return 'border border-gray-200';
      case 'creative':
        return 'border-l-8 border-[var(--accent)] bg-gradient-to-br from-white via-white to-slate-50';
      case 'professional':
      default:
        return 'border-t-8 border-[var(--accent)]';
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
  function removeSkill(idx: number) { return skills = skills.filter((_, i) => i !== idx); }
  function addLanguage() {
    if (newLang.trim()) {
      languages = [...languages, { name: newLang.trim(), level: newLangLevel }];
      newLang = '';
      newLangLevel = 'intermediate';
    }
  }
  function removeLanguage(idx: number) { return languages = languages.filter((_, i) => i !== idx); }
  function addExperience() {
    experiences = [...experiences, { id: Date.now().toString(), company: '', position: '', startDate: '', endDate: '', description: '', current: false }];
  }
  function updateExperience(id: string, field: keyof Experience, value: string | boolean) {
    experiences = experiences.map(exp => exp.id === id ? { ...exp, [field]: value } : exp);
  }
  function removeExperience(id: string) { return experiences = experiences.filter(exp => exp.id !== id); }
  function addEducation() {
    educations = [...educations, { id: Date.now().toString(), school: '', degree: '', field: '', graduationDate: '', gpa: '' }];
  }
  function updateEducation(id: string, field: keyof Education, value: string) {
    educations = educations.map(edu => edu.id === id ? { ...edu, [field]: value } : edu);
  }
  function removeEducation(id: string) { return educations = educations.filter(edu => edu.id !== id); }
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
<div bind:this={resumeRef} class={`bg-white text-gray-900 p-8 min-h-[297mm] w-[210mm] mx-auto shadow-lg ${getTemplateClasses(template)}`} style="--accent: {accentColor}">
        <div class="flex items-start gap-6 mb-6">
          {#if photo}
<img src={photo} alt="Photo" class="w-24 h-24 rounded-full object-cover border-4" style="border-color: {accentColor}" />
{/if}
          <div class="flex-1">
            <h1 class="text-3xl font-bold" style="color: {accentColor}">{name || t('placeholders.name')}</h1>
            <p class="text-xl text-gray-600">{title || t('placeholders.title')}</p>
            <div class="flex flex-wrap gap-4 mt-2 text-sm text-gray-500">
              {#if email}
<span><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg> {email}</span>
{/if}
              {#if phone}
<span><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><path d="M12 18h.01"/></svg> {phone}</span>
{/if}
              {#if location}
<span><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg> {location}</span>
{/if}
              {#if website}
<span><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg> {website}</span>
{/if}
            </div>
          </div>
        </div>
        {#if summary}
<section class="mb-6">
            <h2 class="text-lg font-semibold border-b-2 pb-1 mb-2" style="border-color: {accentColor}; color: {accentColor}">{t('summary')}</h2>
            <p class="text-gray-700 whitespace-pre-wrap">{summary}</p>
          </section>
{/if}
        {#if experiences.length > 0}
<section class="mb-6">
            <h2 class="text-lg font-semibold border-b-2 pb-1 mb-2" style="border-color: {accentColor}; color: {accentColor}">{t('experience')}</h2>
            {#each experiences as exp (exp.id)}
<div  class="mb-4">
                <div class="flex justify-between items-start">
                  <div><span class="font-semibold">{exp.position}</span> @ {exp.company}</div>
                  <span class="text-sm text-gray-500">{exp.startDate} - {exp.current ? t('present') : exp.endDate}</span>
                </div>
                <p class="text-gray-600 text-sm whitespace-pre-wrap mt-1">{exp.description}</p>
              </div>
{/each}
          </section>
{/if}
        {#if educations.length > 0}
<section class="mb-6">
            <h2 class="text-lg font-semibold border-b-2 pb-1 mb-2" style="border-color: {accentColor}; color: {accentColor}">{t('education')}</h2>
            {#each educations as edu (edu.id)}
<div  class="mb-3">
                <div class="flex justify-between">
                  <div><span class="font-semibold">{edu.degree}</span> - {edu.field}</div>
                  <span class="text-sm text-gray-500">{edu.graduationDate}</span>
                </div>
                <p class="text-gray-600">{edu.school} {#if edu.gpa}<span> ({t('gpa')}: {edu.gpa})</span>{/if}</p>
              </div>
{/each}
          </section>
{/if}
        <div class="grid grid-cols-2 gap-6">
          {#if skills.length > 0}
<section>
              <h2 class="text-lg font-semibold border-b-2 pb-1 mb-2" style="border-color: {accentColor}; color: {accentColor}">{t('skills')}</h2>
              <div class="space-y-2">
                {#each skills as skill, idx (idx)}
<div >
                    <div class="flex justify-between text-sm"><span>{skill.name}</span><span>{skill.level}%</span></div>
                    <div class="h-2 bg-gray-200 rounded-full"><div class="h-full rounded-full" style="width: {skill.level}%; background-color: accentColor"></div></div>
                  </div>
{/each}
              </div>
            </section>
{/if}
          {#if languages.length > 0}
<section>
              <h2 class="text-lg font-semibold border-b-2 pb-1 mb-2" style="border-color: {accentColor}; color: {accentColor}">{t('languages')}</h2>
              <ul class="space-y-1">
                {#each languages as lang, idx (idx)}
<li  class="flex justify-between text-sm"><span>{lang.name}</span><span class="text-gray-500">{getLangLabel(lang.level)}</span></li>
{/each}
              </ul>
            </section>
{/if}
        </div>
      </div>
{/snippet}


    <div class="space-y-6">
      <div class="flex flex-wrap gap-2 border-b border-gray-200 dark:border-gray-700 pb-4">
        <button onclick={() => activeTab = 'edit'} class={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'edit' ? 'bg-amber-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'}`}>{t('editTab')}</button>
        <button onclick={() => activeTab = 'preview'} class={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'preview' ? 'bg-amber-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'}`}>{t('previewTab')}</button>
        <div class="flex-1"></div>
        <select value={template} onchange={e => template = e.target.value as TemplateType} class="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
          <option value="professional">{t('templates.professional')}</option>
          <option value="minimal">{t('templates.minimal')}</option>
          <option value="creative">{t('templates.creative')}</option>
        </select>
        <input type="color" value={accentColor} onchange={e => accentColor = e.target.value} class="w-10 h-10 rounded cursor-pointer" title={t('accentColor')} />
        <button onclick={exportPDF} class="px-4 py-2 btn-success rounded-lg hover:bg-green-700 transition-colors">{t('exportPDF')}</button>
      </div>

      {#if activeTab === 'edit'}
<div class="max-w-4xl mx-auto space-y-6">
          <!-- 个人信息 -->
          <section class="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 space-y-4">
            <h3 class="font-semibold text-gray-900 dark:text-white">{t('personalInfo')}</h3>
            <div class="flex items-center gap-4">
              <div class="relative">
                {#if photo}
<img src={photo} alt="Photo" class="w-20 h-20 rounded-full object-cover" />
{:else}
<div class="w-20 h-20 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-2xl"><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></div>
{/if}
                <input bind:this={fileInputRef} type="file" accept="image/*" onchange={handlePhotoUpload} class="hidden" />
                <button onclick={() => fileInputRef?.click()} class="absolute -bottom-1 -right-1 w-8 h-8 bg-amber-600 text-white rounded-full text-sm hover:bg-amber-700"><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg></button>
              </div>
              <div class="flex-1 grid grid-cols-2 gap-2">
                <input value={name} onchange={e => name = e.target.value} placeholder={t('placeholders.name')} class="col-span-2 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white" />
                <input value={title} onchange={e => title = e.target.value} placeholder={t('placeholders.title')} class="col-span-2 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white" />
              </div>
            </div>
            <div class="grid grid-cols-2 gap-2">
              <input value={email} onchange={e => email = e.target.value} placeholder={t('placeholders.email')} type="email" class="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white" />
              <input value={phone} onchange={e => phone = e.target.value} placeholder={t('placeholders.phone')} class="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white" />
              <input value={location} onchange={e => location = e.target.value} placeholder={t('placeholders.location')} class="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white" />
              <input value={website} onchange={e => website = e.target.value} placeholder={t('placeholders.website')} class="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white" />
            </div>
            <textarea value={summary} onchange={e => summary = e.target.value} placeholder={t('summaryPlaceholder')} rows={3} class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white resize-none" />
          </section>

          <!-- 工作经历 -->
          <section class="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 space-y-4">
            <div class="flex justify-between items-center">
              <h3 class="font-semibold text-gray-900 dark:text-white">{t('experience')}</h3>
              <button onclick={addExperience} class="px-3 py-1 bg-amber-600 text-white rounded-lg text-sm hover:bg-amber-700">{t('addExperience')}</button>
            </div>
            {#each experiences as exp (exp.id)}
<div  class="border border-gray-200 dark:border-gray-700 rounded-lg p-3 space-y-2">
                <div class="flex justify-between">
                  <input bind:value={exp.company} placeholder={t('company')} class="flex-1 px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm" />
                  <button onclick={() => removeExperience(exp.id)} class="ml-2 text-red-500 hover:text-red-700"><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg></button>
                </div>
                <input bind:value={exp.position} placeholder={t('position')} class="w-full px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm" />
                <div class="flex gap-2 items-center">
                  <input type="month" bind:value={exp.startDate} class="flex-1 px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm" />
                  <span class="text-gray-500">-</span>
                  <input type="month" bind:value={exp.endDate} disabled={exp.current} class="flex-1 px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm disabled:opacity-50" />
                  <label class="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                    <input type="checkbox" checked={exp.current} onchange={e => updateExperience(exp.id, 'current', e.target.checked)} />
                    {t('present')}
                  </label>
                </div>
                <textarea bind:value={exp.description} placeholder={t('jobDescription')} rows={2} class="w-full px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm resize-none" />
              </div>
{/each}
          </section>

          <!-- 教育背景 -->
          <section class="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 space-y-4">
            <div class="flex justify-between items-center">
              <h3 class="font-semibold text-gray-900 dark:text-white">{t('education')}</h3>
              <button onclick={addEducation} class="px-3 py-1 bg-amber-600 text-white rounded-lg text-sm hover:bg-amber-700">{t('addEducation')}</button>
            </div>
            {#each educations as edu (edu.id)}
<div  class="border border-gray-200 dark:border-gray-700 rounded-lg p-3 space-y-2">
                <div class="flex justify-between">
                  <input bind:value={edu.school} placeholder={t('school')} class="flex-1 px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm" />
                  <button onclick={() => removeEducation(edu.id)} class="ml-2 text-red-500 hover:text-red-700"><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg></button>
                </div>
                <div class="grid grid-cols-2 gap-2">
                  <input bind:value={edu.degree} placeholder={t('degree')} class="px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm" />
                  <input bind:value={edu.field} placeholder={t('fieldOfStudy')} class="px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm" />
                  <input type="month" bind:value={edu.graduationDate} class="px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm" />
                  <input bind:value={edu.gpa || ''} placeholder={t('gpa')} class="px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm" />
                </div>
              </div>
{/each}
          </section>

          <!-- 技能和语言 - 并排显示 -->
          <div class="grid md:grid-cols-2 gap-6">
            <section class="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 space-y-4">
              <h3 class="font-semibold text-gray-900 dark:text-white">{t('skills')}</h3>
              <div class="flex gap-2">
                <input value={newSkill} onchange={e => newSkill = e.target.value} placeholder={t('addSkill')} class="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white" onkeydown={e => e.key === 'Enter' && addSkill()} />
                <input type="range" min="10" max="100" bind:value={newSkillLevel} class="w-24" />
                <span class="w-10 text-center text-gray-600 dark:text-gray-400">{newSkillLevel}%</span>
                <button onclick={addSkill} class="px-3 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700">+</button>
              </div>
              {#if skills.length === 0}
<p class="text-gray-500 text-sm">{t('noSkills')}</p>
{:else}
<div class="flex flex-wrap gap-2">
                  {#each skills as skill, idx (idx)}
<span  class="inline-flex items-center gap-1 px-3 py-1 bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200 rounded-full text-sm">
                      {skill.name} ({skill.level}%)
                      <button onclick={() => removeSkill(idx)} class="ml-1 text-amber-600 dark:text-amber-400 hover:text-red-500">×</button>
                    </span>
{/each}
                </div>
{/if}
            </section>

            <section class="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 space-y-4">
              <h3 class="font-semibold text-gray-900 dark:text-white">{t('languages')}</h3>
              <div class="flex gap-2">
                <input value={newLang} onchange={e => newLang = e.target.value} placeholder={t('addLanguage')} class="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white" onkeydown={e => e.key === 'Enter' && addLanguage()} />
                <select value={newLangLevel} onchange={e => newLangLevel = e.target.value as LangLevel} class="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
                  {#each LANG_LEVELS as lvl (lvl)}
<option  value={lvl}>{getLangLabel(lvl)}</option>
{/each}
                </select>
                <button onclick={addLanguage} class="px-3 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700">+</button>
              </div>
              {#if languages.length > 0}
<div class="flex flex-wrap gap-2">
                  {#each languages as lang, idx (idx)}
<span  class="inline-flex items-center gap-1 px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-sm">
                      {lang.name} - {getLangLabel(lang.level)}
                      <button onclick={() => removeLanguage(idx)} class="ml-1 text-green-600 dark:text-green-400 hover:text-red-500">×</button>
                    </span>
{/each}
                </div>
{/if}
            </section>
          </div>
        </div>
{:else}
<div class="overflow-auto bg-gray-100 dark:bg-gray-900 p-4 rounded-xl">
          {@render renderPreview()}
        </div>
{/if}
    </div>
  
