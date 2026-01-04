'use client';
import { useState, useRef, useCallback } from 'react';
import { useTranslations, useLocale } from 'next-intl';

interface Experience { id: string; company: string; position: string; startDate: string; endDate: string; description: string; current: boolean; }
interface Education { id: string; school: string; degree: string; field: string; graduationDate: string; gpa?: string; }
type TemplateType = 'professional' | 'minimal' | 'creative';
type LangLevel = 'native' | 'fluent' | 'advanced' | 'intermediate' | 'basic';
type SkillLevel = 'expert' | 'advanced' | 'intermediate' | 'beginner';
const LANG_LEVELS: LangLevel[] = ['native', 'fluent', 'advanced', 'intermediate', 'basic'];
const SKILL_LEVELS: SkillLevel[] = ['expert', 'advanced', 'intermediate', 'beginner'];
const LANG_LEVEL_LABELS: Record<string, Record<LangLevel, string>> = {
  zh: { native: '母语', fluent: '流利', advanced: '高级', intermediate: '中级', basic: '基础' },
  en: { native: 'Native', fluent: 'Fluent', advanced: 'Advanced', intermediate: 'Intermediate', basic: 'Basic' },
  ja: { native: 'ネイティブ', fluent: '流暢', advanced: '上級', intermediate: '中級', basic: '初級' },
  ko: { native: '원어민', fluent: '유창함', advanced: '고급', intermediate: '중급', basic: '초급' },
  es: { native: 'Nativo', fluent: 'Fluido', advanced: 'Avanzado', intermediate: 'Intermedio', basic: 'Básico' },
  pt: { native: 'Nativo', fluent: 'Fluente', advanced: 'Avançado', intermediate: 'Intermediário', basic: 'Básico' },
  fr: { native: 'Langue maternelle', fluent: 'Courant', advanced: 'Avancé', intermediate: 'Intermédiaire', basic: 'Débutant' },
  de: { native: 'Muttersprache', fluent: 'Fließend', advanced: 'Fortgeschritten', intermediate: 'Mittelstufe', basic: 'Grundkenntnisse' },
  ru: { native: 'Родной', fluent: 'Свободно', advanced: 'Продвинутый', intermediate: 'Средний', basic: 'Базовый' },
  ar: { native: 'لغة أم', fluent: 'طلاقة', advanced: 'متقدم', intermediate: 'متوسط', basic: 'مبتدئ' },
};
const SKILL_LEVEL_LABELS: Record<string, Record<SkillLevel, string>> = {
  zh: { expert: '专家', advanced: '熟练', intermediate: '中级', beginner: '入门' },
  en: { expert: 'Expert', advanced: 'Advanced', intermediate: 'Intermediate', beginner: 'Beginner' },
  ja: { expert: 'エキスパート', advanced: '上級', intermediate: '中級', beginner: '初級' },
  ko: { expert: '전문가', advanced: '고급', intermediate: '중급', beginner: '초급' },
  es: { expert: 'Experto', advanced: 'Avanzado', intermediate: 'Intermedio', beginner: 'Principiante' },
  pt: { expert: 'Especialista', advanced: 'Avançado', intermediate: 'Intermediário', beginner: 'Iniciante' },
  fr: { expert: 'Expert', advanced: 'Avancé', intermediate: 'Intermédiaire', beginner: 'Débutant' },
  de: { expert: 'Experte', advanced: 'Fortgeschritten', intermediate: 'Mittelstufe', beginner: 'Anfänger' },
  ru: { expert: 'Эксперт', advanced: 'Продвинутый', intermediate: 'Средний', beginner: 'Начинающий' },
  ar: { expert: 'خبير', advanced: 'متقدم', intermediate: 'متوسط', beginner: 'مبتدئ' },
};

export default function ResumeBuilder() {
  const t = useTranslations('tools.resume');
  const locale = useLocale();
  const resumeRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
  const [template, setTemplate] = useState<TemplateType>('professional');
  const [photo, setPhoto] = useState<string | null>(null);
  const [accentColor, setAccentColor] = useState('#2563eb');
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [website, setWebsite] = useState('');
  const [summary, setSummary] = useState('');
  const [skills, setSkills] = useState<{name: string; level: SkillLevel}[]>([]);
  const [languages, setLanguages] = useState<{name: string; level: LangLevel}[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [educations, setEducations] = useState<Education[]>([]);

  const getLangLevelLabel = useCallback((level: LangLevel): string => (LANG_LEVEL_LABELS[locale] || LANG_LEVEL_LABELS.en)[level], [locale]);
  const getSkillLevelLabel = useCallback((level: SkillLevel): string => (SKILL_LEVEL_LABELS[locale] || SKILL_LEVEL_LABELS.en)[level], [locale]);
  const getSkillPercent = (level: SkillLevel): number => ({ expert: 100, advanced: 80, intermediate: 60, beginner: 40 }[level]);

  const handlePhotoUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.size <= 5 * 1024 * 1024) {
      const reader = new FileReader();
      reader.onload = (event) => setPhoto(event.target?.result as string);
      reader.readAsDataURL(file);
    }
  }, []);

  const removeSkill = (idx: number) => setSkills(skills.filter((_, i) => i !== idx));
  const removeLanguage = (idx: number) => setLanguages(languages.filter((_, i) => i !== idx));
  const addExperience = () => setExperiences([...experiences, { id: Date.now().toString(), company: '', position: '', startDate: '', endDate: '', description: '', current: false }]);
  const updateExperience = (id: string, field: keyof Experience, value: string | boolean) => setExperiences(experiences.map(exp => exp.id === id ? { ...exp, [field]: value } : exp));
  const removeExperience = (id: string) => setExperiences(experiences.filter(exp => exp.id !== id));
  const addEducation = () => setEducations([...educations, { id: Date.now().toString(), school: '', degree: '', field: '', graduationDate: '', gpa: '' }]);
  const updateEducation = (id: string, field: keyof Education, value: string) => setEducations(educations.map(edu => edu.id === id ? { ...edu, [field]: value } : edu));
  const removeEducation = (id: string) => setEducations(educations.filter(edu => edu.id !== id));

  const downloadPDF = async () => {
    if (!resumeRef.current) return;
    try {
      const html2canvas = (await import('html2canvas')).default;
      const jsPDF = (await import('jspdf')).default;
      const canvas = await html2canvas(resumeRef.current, { scale: 2, backgroundColor: '#ffffff', useCORS: true } as Parameters<typeof html2canvas>[1]);
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, pdfWidth, (canvas.height * pdfWidth) / canvas.width);
      pdf.save((name || 'resume') + '.pdf');
    } catch (error) { console.error('PDF generation failed:', error); }
  };

  const templates = [
    { id: 'professional' as const, name: t('templates.professional'), icon: '💼', desc: t('templates.professionalDesc') },
    { id: 'minimal' as const, name: t('templates.minimal'), icon: '⚪', desc: t('templates.minimalDesc') },
    { id: 'creative' as const, name: t('templates.creative'), icon: '🎨', desc: t('templates.creativeDesc') },
  ];
  const colors = ['#2563eb', '#059669', '#dc2626', '#7c3aed', '#ea580c', '#0891b2', '#4f46e5', '#be185d'];
  const inputClass = "w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-blue-500";
  const labelClass = "block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1";
  const sectionClass = "border border-gray-200 dark:border-gray-700 rounded-xl p-4 bg-gray-50 dark:bg-gray-800/50";
  const btnClass = "px-3 py-1.5 text-sm rounded-lg transition-colors";
  const hasContent = name || title || email || summary || experiences.length > 0;

  const renderProfessionalTemplate = () => (<div ref={resumeRef} className="bg-white text-gray-900 p-8" style={{ width: '210mm', minHeight: '297mm', fontFamily: 'system-ui' }}><div className="flex gap-6 mb-6 pb-6 border-b-2" style={{ borderColor: accentColor }}>{photo && <img src={photo} alt="" className="w-24 h-24 rounded-full object-cover border-4" style={{ borderColor: accentColor }} />}<div className="flex-1"><h1 className="text-3xl font-bold" style={{ color: accentColor }}>{name}</h1><p className="text-lg text-gray-600">{title}</p><div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-500">{email && <span>📧 {email}</span>}{phone && <span>📞 {phone}</span>}{location && <span>📍 {location}</span>}{website && <span>🌐 {website}</span>}</div></div></div>{summary && <div className="mb-6"><h2 className="text-lg font-bold mb-2" style={{ color: accentColor }}>Summary</h2><p className="text-sm text-gray-700">{summary}</p></div>}{experiences.length > 0 && <div className="mb-6"><h2 className="text-lg font-bold mb-3" style={{ color: accentColor }}>Experience</h2>{experiences.map(exp => <div key={exp.id} className="mb-4"><div className="flex justify-between"><h3 className="font-semibold">{exp.position}</h3><span className="text-sm text-gray-500">{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</span></div><p className="text-sm" style={{ color: accentColor }}>{exp.company}</p>{exp.description && <p className="text-sm text-gray-600 mt-1">{exp.description}</p>}</div>)}</div>}{educations.length > 0 && <div className="mb-6"><h2 className="text-lg font-bold mb-3" style={{ color: accentColor }}>Education</h2>{educations.map(edu => <div key={edu.id} className="mb-3"><div className="flex justify-between"><h3 className="font-semibold">{edu.degree} {edu.field && ('in ' + edu.field)}</h3><span className="text-sm text-gray-500">{edu.graduationDate}</span></div><p className="text-sm" style={{ color: accentColor }}>{edu.school}</p></div>)}</div>}{skills.length > 0 && <div className="mb-6"><h2 className="text-lg font-bold mb-3" style={{ color: accentColor }}>Skills</h2><div className="flex flex-wrap gap-2">{skills.map((s, i) => <span key={i} className="px-3 py-1 rounded-full text-sm text-white" style={{ background: accentColor }}>{s.name}</span>)}</div></div>}{languages.length > 0 && <div className="mb-6"><h2 className="text-lg font-bold mb-3" style={{ color: accentColor }}>Languages</h2><div className="flex flex-wrap gap-2">{languages.map((l, i) => <span key={i} className="px-3 py-1 rounded-full text-sm text-white" style={{ background: accentColor }}>{l.name} ({getLangLevelLabel(l.level)})</span>)}</div></div>}</div>);

  const renderMinimalTemplate = () => (<div ref={resumeRef} className="bg-white text-gray-900 p-12" style={{ width: '210mm', minHeight: '297mm', fontFamily: 'Georgia, serif' }}><div className="text-center mb-8 pb-6 border-b border-gray-200">{photo && <img src={photo} alt="" className="w-20 h-20 rounded-full object-cover mx-auto mb-4 grayscale" />}<h1 className="text-3xl font-light">{name}</h1><p className="text-gray-500 mt-1">{title}</p><div className="flex justify-center gap-6 mt-3 text-sm text-gray-400">{email && <span>{email}</span>}{phone && <span>{phone}</span>}{location && <span>{location}</span>}</div></div>{summary && <p className="text-center text-sm text-gray-600 mb-8 max-w-xl mx-auto italic">{summary}</p>}<div className="flex gap-12"><div className="flex-1">{experiences.length > 0 && <div className="mb-8"><h2 className="text-xs uppercase tracking-widest text-gray-400 mb-4">Experience</h2>{experiences.map(exp => <div key={exp.id} className="mb-4"><div className="flex justify-between"><h3 className="font-medium">{exp.position}</h3><span className="text-xs text-gray-400">{exp.startDate} — {exp.current ? 'Present' : exp.endDate}</span></div><p className="text-sm text-gray-500">{exp.company}</p>{exp.description && <p className="text-sm text-gray-600 mt-1">{exp.description}</p>}</div>)}</div>}{educations.length > 0 && <div><h2 className="text-xs uppercase tracking-widest text-gray-400 mb-4">Education</h2>{educations.map(edu => <div key={edu.id} className="mb-3"><h3 className="font-medium">{edu.degree}</h3><p className="text-sm text-gray-500">{edu.school}</p></div>)}</div>}</div><div className="w-48">{skills.length > 0 && <div className="mb-6"><h2 className="text-xs uppercase tracking-widest text-gray-400 mb-3">Skills</h2><div className="space-y-1">{skills.map((s, i) => <div key={i} className="text-sm text-gray-700">{s.name}</div>)}</div></div>}{languages.length > 0 && <div><h2 className="text-xs uppercase tracking-widest text-gray-400 mb-3">Languages</h2><div className="space-y-1">{languages.map((l, i) => <div key={i} className="text-sm text-gray-700">{l.name} - {getLangLevelLabel(l.level)}</div>)}</div></div>}</div></div></div>);

  const renderCreativeTemplate = () => (<div ref={resumeRef} className="text-gray-900" style={{ width: '210mm', minHeight: '297mm', fontFamily: 'system-ui' }}><div className="text-white p-8" style={{ background: 'linear-gradient(135deg, ' + accentColor + ', ' + accentColor + 'cc)' }}><div className="flex items-center gap-6">{photo && <img src={photo} alt="" className="w-28 h-28 rounded-2xl object-cover border-4 border-white/30" />}<div><h1 className="text-4xl font-black">{name}</h1><p className="text-xl mt-1 opacity-90">{title}</p><div className="flex flex-wrap gap-3 mt-3 text-sm">{email && <span className="bg-white/20 px-3 py-1 rounded-full">{email}</span>}{phone && <span className="bg-white/20 px-3 py-1 rounded-full">{phone}</span>}{location && <span className="bg-white/20 px-3 py-1 rounded-full">{location}</span>}</div></div></div></div><div className="flex"><div className="flex-1 p-8 bg-white">{summary && <div className="mb-6"><h2 className="text-xl font-bold mb-2" style={{ color: accentColor }}>About</h2><p className="text-sm text-gray-700">{summary}</p></div>}{experiences.length > 0 && <div className="mb-6"><h2 className="text-xl font-bold mb-4" style={{ color: accentColor }}>Experience</h2>{experiences.map(exp => <div key={exp.id} className="mb-4 pl-4 border-l-2" style={{ borderColor: accentColor }}><div className="flex justify-between"><h3 className="font-bold">{exp.position}</h3><span className="text-xs px-2 py-1 rounded-full text-white" style={{ background: accentColor }}>{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</span></div><p className="text-sm" style={{ color: accentColor }}>{exp.company}</p>{exp.description && <p className="text-sm text-gray-600 mt-1">{exp.description}</p>}</div>)}</div>}</div><div className="w-64 p-6 bg-gray-900 text-white">{skills.length > 0 && <div className="mb-6"><h2 className="text-lg font-bold mb-3">Skills</h2><div className="space-y-2">{skills.map((s, i) => <div key={i}><div className="text-sm mb-1">{s.name}</div><div className="h-2 bg-gray-700 rounded-full"><div className="h-full rounded-full" style={{ width: getSkillPercent(s.level) + '%', background: accentColor }} /></div></div>)}</div></div>}{educations.length > 0 && <div className="mb-6"><h2 className="text-lg font-bold mb-3">Education</h2>{educations.map(edu => <div key={edu.id} className="mb-2"><div className="font-medium text-sm">{edu.degree}</div><div className="text-xs text-gray-400">{edu.school}</div></div>)}</div>}{languages.length > 0 && <div><h2 className="text-lg font-bold mb-3">Languages</h2><div className="flex flex-wrap gap-2">{languages.map((l, i) => <span key={i} className="px-2 py-1 rounded text-xs" style={{ background: accentColor }}>{l.name}</span>)}</div></div>}</div></div></div>);

  const renderResumePreview = () => { if (!hasContent) return <div className="flex items-center justify-center h-96 text-gray-400"><div className="text-center"><div className="text-6xl mb-4">📝</div><p>{t('startFilling')}</p></div></div>; if (template === 'minimal') return renderMinimalTemplate(); if (template === 'creative') return renderCreativeTemplate(); return renderProfessionalTemplate(); };

  return (
    <div className="space-y-4">
      <div className="flex gap-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg w-fit">
        <button onClick={() => setActiveTab('edit')} className={'px-4 py-2 rounded-md text-sm font-medium transition-colors ' + (activeTab === 'edit' ? 'bg-white dark:bg-gray-700 shadow' : 'text-gray-600 dark:text-gray-400')}>✏️ {t('edit')}</button>
        <button onClick={() => setActiveTab('preview')} className={'px-4 py-2 rounded-md text-sm font-medium transition-colors ' + (activeTab === 'preview' ? 'bg-white dark:bg-gray-700 shadow' : 'text-gray-600 dark:text-gray-400')}>👁️ {t('preview')}</button>
      </div>
      {activeTab === 'edit' ? (
        <div className="space-y-4">
          <div className={sectionClass}>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">🎨 {t('selectTemplate')}</h3>
            <div className="grid grid-cols-3 gap-2">{templates.map((tpl) => (<button key={tpl.id} onClick={() => setTemplate(tpl.id)} className={'p-3 rounded-lg border-2 text-left transition-all ' + (template === tpl.id ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30' : 'border-gray-200 dark:border-gray-700')}><div className="text-2xl mb-1">{tpl.icon}</div><div className="font-medium text-sm">{tpl.name}</div><div className="text-xs text-gray-500">{tpl.desc}</div></button>))}</div>
            <div className="mt-4"><label className={labelClass}>{t('accentColor')}</label><div className="flex gap-2">{colors.map((color) => (<button key={color} onClick={() => setAccentColor(color)} className={'w-8 h-8 rounded-full border-2 ' + (accentColor === color ? 'border-gray-900 dark:border-white scale-110' : 'border-transparent')} style={{ background: color }} />))}</div></div>
          </div>
          <div className={sectionClass}>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">👤 {t('personalInfo')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2"><label className={labelClass}>{t('photo')}</label><div className="flex items-center gap-4">{photo ? (<div className="relative"><img src={photo} alt="Profile" className="w-20 h-20 rounded-full object-cover" /><button onClick={() => setPhoto(null)} className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs">✕</button></div>) : (<div className="w-20 h-20 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-2xl">👤</div>)}<div><input ref={fileInputRef} type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" /><button onClick={() => fileInputRef.current?.click()} className={btnClass + ' bg-blue-500 text-white hover:bg-blue-600'}>{t('uploadPhoto')}</button></div></div></div>
              <div><label className={labelClass}>{t('fullName')}</label><input type="text" value={name} onChange={(e) => setName(e.target.value)} className={inputClass} placeholder={t('placeholders.name')} /></div>
              <div><label className={labelClass}>{t('jobTitle')}</label><input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className={inputClass} placeholder={t('placeholders.title')} /></div>
              <div><label className={labelClass}>{t('email')}</label><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} placeholder={t('placeholders.email')} /></div>
              <div><label className={labelClass}>{t('phone')}</label><input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className={inputClass} placeholder={t('placeholders.phone')} /></div>
              <div><label className={labelClass}>{t('location')}</label><input type="text" value={location} onChange={(e) => setLocation(e.target.value)} className={inputClass} placeholder={t('placeholders.location')} /></div>
              <div><label className={labelClass}>{t('website')}</label><input type="url" value={website} onChange={(e) => setWebsite(e.target.value)} className={inputClass} placeholder={t('placeholders.website')} /></div>
              <div className="md:col-span-2"><label className={labelClass}>{t('summary')}</label><textarea value={summary} onChange={(e) => setSummary(e.target.value)} className={inputClass + ' h-20 resize-none'} placeholder={t('summaryPlaceholder')} /></div>
            </div>
          </div>
          <div className={sectionClass}>
            <div className="flex justify-between items-center mb-3"><h3 className="font-semibold text-gray-900 dark:text-gray-100">🛠️ {t('skills')}</h3><button onClick={() => setSkills([...skills, { name: '', level: 'intermediate' }])} className={btnClass + ' bg-blue-500 text-white'}>+ {t('addSkill')}</button></div>
            {skills.map((skill, idx) => (<div key={idx} className="p-4 mb-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"><div className="flex justify-between mb-3"><span className="text-sm text-gray-500">#{idx + 1}</span><button onClick={() => removeSkill(idx)} className="text-red-500 text-sm">🗑️</button></div><div className="space-y-3"><div><label className={labelClass}>{t('skillName')}</label><input type="text" value={skill.name} onChange={(e) => { const u = [...skills]; u[idx] = { ...u[idx], name: e.target.value }; setSkills(u); }} className={inputClass} placeholder={t('skillName')} /></div><div><label className={labelClass}>{t('skillLevel')}</label><div className="flex flex-wrap gap-2 mt-1">{SKILL_LEVELS.map((level) => (<button key={level} type="button" onClick={() => { const u = [...skills]; u[idx] = { ...u[idx], level }; setSkills(u); }} className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${skill.level === level ? 'bg-blue-500 text-white border-blue-500' : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-blue-400'}`}>{getSkillLevelLabel(level)}</button>))}</div></div></div></div>))}
            {skills.length === 0 && (<div className="text-center py-6 text-gray-400"><div className="text-3xl mb-2">🛠️</div><p className="text-sm">{t('noSkills')}</p></div>)}
          </div>
          <div className={sectionClass}>
            <div className="flex justify-between items-center mb-3"><h3 className="font-semibold text-gray-900 dark:text-gray-100">🌍 {t('languages')}</h3><button onClick={() => setLanguages([...languages, { name: '', level: 'fluent' }])} className={btnClass + ' bg-blue-500 text-white'}>+ {t('addLanguage')}</button></div>
            {languages.map((lang, idx) => (<div key={idx} className="p-4 mb-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"><div className="flex justify-between mb-3"><span className="text-sm text-gray-500">#{idx + 1}</span><button onClick={() => removeLanguage(idx)} className="text-red-500 text-sm">🗑️</button></div><div className="space-y-3"><div><label className={labelClass}>{t('languageName')}</label><input type="text" value={lang.name} onChange={(e) => { const u = [...languages]; u[idx] = { ...u[idx], name: e.target.value }; setLanguages(u); }} className={inputClass} placeholder={t('languageName')} /></div><div><label className={labelClass}>{t('proficiencyLevel')}</label><div className="flex flex-wrap gap-2 mt-1">{LANG_LEVELS.map((level) => (<button key={level} type="button" onClick={() => { const u = [...languages]; u[idx] = { ...u[idx], level }; setLanguages(u); }} className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${lang.level === level ? 'bg-purple-500 text-white border-purple-500' : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-purple-400'}`}>{getLangLevelLabel(level)}</button>))}</div></div></div></div>))}
            {languages.length === 0 && (<div className="text-center py-6 text-gray-400"><div className="text-3xl mb-2">🌍</div><p className="text-sm">{t('noLanguages')}</p></div>)}
          </div>
          <div className={sectionClass}>
            <div className="flex justify-between items-center mb-3"><h3 className="font-semibold text-gray-900 dark:text-gray-100">💼 {t('experience')}</h3><button onClick={addExperience} className={btnClass + ' bg-blue-500 text-white'}>+ {t('addExperience')}</button></div>
            {experiences.map((exp, idx) => (<div key={exp.id} className="p-4 mb-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"><div className="flex justify-between mb-3"><span className="text-sm text-gray-500">#{idx + 1}</span><button onClick={() => removeExperience(exp.id)} className="text-red-500 text-sm">🗑️</button></div><div className="grid grid-cols-2 gap-3"><div><label className={labelClass}>{t('company')}</label><input type="text" value={exp.company} onChange={(e) => updateExperience(exp.id, 'company', e.target.value)} className={inputClass} /></div><div><label className={labelClass}>{t('position')}</label><input type="text" value={exp.position} onChange={(e) => updateExperience(exp.id, 'position', e.target.value)} className={inputClass} /></div><div><label className={labelClass}>{t('startDate')}</label><input type="month" value={exp.startDate} onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)} className={inputClass} /></div><div><label className={labelClass}>{t('endDate')}</label><div className="flex gap-2"><input type="month" value={exp.endDate} onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)} className={inputClass} disabled={exp.current} /><label className="flex items-center gap-1 text-xs"><input type="checkbox" checked={exp.current} onChange={(e) => updateExperience(exp.id, 'current', e.target.checked)} />{t('present')}</label></div></div><div className="col-span-2"><label className={labelClass}>{t('description')}</label><textarea value={exp.description} onChange={(e) => updateExperience(exp.id, 'description', e.target.value)} className={inputClass + ' h-16 resize-none'} /></div></div></div>))}
          </div>
          <div className={sectionClass}>
            <div className="flex justify-between items-center mb-3"><h3 className="font-semibold text-gray-900 dark:text-gray-100">🎓 {t('education')}</h3><button onClick={addEducation} className={btnClass + ' bg-blue-500 text-white'}>+ {t('addEducation')}</button></div>
            {educations.map((edu, idx) => (<div key={edu.id} className="p-4 mb-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"><div className="flex justify-between mb-3"><span className="text-sm text-gray-500">#{idx + 1}</span><button onClick={() => removeEducation(edu.id)} className="text-red-500 text-sm">🗑️</button></div><div className="grid grid-cols-2 gap-3"><div><label className={labelClass}>{t('school')}</label><input type="text" value={edu.school} onChange={(e) => updateEducation(edu.id, 'school', e.target.value)} className={inputClass} /></div><div><label className={labelClass}>{t('degree')}</label><input type="text" value={edu.degree} onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)} className={inputClass} /></div><div><label className={labelClass}>{t('field')}</label><input type="text" value={edu.field} onChange={(e) => updateEducation(edu.id, 'field', e.target.value)} className={inputClass} /></div><div><label className={labelClass}>{t('graduationDate')}</label><input type="month" value={edu.graduationDate} onChange={(e) => updateEducation(edu.id, 'graduationDate', e.target.value)} className={inputClass} /></div></div></div>))}
          </div>
          <div className="flex justify-center"><button onClick={() => { setActiveTab('preview'); setTimeout(downloadPDF, 500); }} className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium hover:from-blue-600 hover:to-purple-700 shadow-lg">📥 {t('downloadPDF')}</button></div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex justify-between items-center"><p className="text-sm text-gray-500">{t('previewHint')}</p><button onClick={downloadPDF} className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">📥 {t('downloadPDF')}</button></div>
          <div className="overflow-auto bg-gray-200 dark:bg-gray-900 p-4 rounded-xl" style={{ maxHeight: '80vh' }}>{renderResumePreview()}</div>
        </div>
      )}
    </div>
  );
}
