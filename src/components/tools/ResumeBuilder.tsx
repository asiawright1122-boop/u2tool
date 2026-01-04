'use client';
import { useState, useRef } from 'react';
import { useTranslations, useLocale } from 'next-intl';

interface Experience { id: string; company: string; position: string; startDate: string; endDate: string; description: string; current: boolean; }
interface Education { id: string; school: string; degree: string; field: string; graduationDate: string; gpa?: string; }
type TemplateType = 'professional' | 'minimal' | 'creative';
type LangLevel = 'native' | 'fluent' | 'advanced' | 'intermediate' | 'basic';

const LANG_LEVELS: LangLevel[] = ['native', 'fluent', 'advanced', 'intermediate', 'basic'];

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
  const [skills, setSkills] = useState<{name: string; level: number}[]>([]);
  const [newSkill, setNewSkill] = useState('');
  const [newSkillLevel, setNewSkillLevel] = useState(80);
  const [languages, setLanguages] = useState<{name: string; level: LangLevel}[]>([]);
  const [newLang, setNewLang] = useState('');
  const [newLangLevel, setNewLangLevel] = useState<LangLevel>('intermediate');
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [educations, setEducations] = useState<Education[]>([]);

  const langLabels = LANG_LEVEL_LABELS[locale] || LANG_LEVEL_LABELS.en;

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setPhoto(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const addSkill = () => {
    if (newSkill.trim()) {
      setSkills([...skills, { name: newSkill.trim(), level: newSkillLevel }]);
      setNewSkill('');
      setNewSkillLevel(80);
    }
  };

  const removeSkill = (idx: number) => setSkills(skills.filter((_, i) => i !== idx));

  const addLanguage = () => {
    if (newLang.trim()) {
      setLanguages([...languages, { name: newLang.trim(), level: newLangLevel }]);
      setNewLang('');
      setNewLangLevel('intermediate');
    }
  };

  const removeLanguage = (idx: number) => setLanguages(languages.filter((_, i) => i !== idx));

  const addExperience = () => {
    setExperiences([...experiences, { id: Date.now().toString(), company: '', position: '', startDate: '', endDate: '', description: '', current: false }]);
  };

  const updateExperience = (id: string, field: keyof Experience, value: string | boolean) => {
    setExperiences(experiences.map(exp => exp.id === id ? { ...exp, [field]: value } : exp));
  };

  const removeExperience = (id: string) => setExperiences(experiences.filter(exp => exp.id !== id));

  const addEducation = () => {
    setEducations([...educations, { id: Date.now().toString(), school: '', degree: '', field: '', graduationDate: '', gpa: '' }]);
  };

  const updateEducation = (id: string, field: keyof Education, value: string) => {
    setEducations(educations.map(edu => edu.id === id ? { ...edu, [field]: value } : edu));
  };

  const removeEducation = (id: string) => setEducations(educations.filter(edu => edu.id !== id));


  const exportPDF = async () => {
    if (!resumeRef.current) return;
    const html2pdf = (await import('html2pdf.js')).default;
    html2pdf().set({
      margin: 10,
      filename: `${name || 'resume'}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    }).from(resumeRef.current).save();
  };

  const renderPreview = () => {
    const baseStyles = template === 'minimal' ? 'font-sans' : template === 'creative' ? 'font-serif' : 'font-sans';
    return (
      <div ref={resumeRef} className={`bg-white text-gray-900 p-8 min-h-[297mm] w-[210mm] mx-auto shadow-lg ${baseStyles}`} style={{ '--accent': accentColor } as React.CSSProperties}>
        <div className="flex items-start gap-6 mb-6">
          {photo && <img src={photo} alt="Photo" className="w-24 h-24 rounded-full object-cover border-4" style={{ borderColor: accentColor }} />}
          <div className="flex-1">
            <h1 className="text-3xl font-bold" style={{ color: accentColor }}>{name || t('placeholders.name')}</h1>
            <p className="text-xl text-gray-600">{title || t('placeholders.title')}</p>
            <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-500">
              {email && <span>📧 {email}</span>}
              {phone && <span>📱 {phone}</span>}
              {location && <span>📍 {location}</span>}
              {website && <span>🌐 {website}</span>}
            </div>
          </div>
        </div>
        {summary && (
          <section className="mb-6">
            <h2 className="text-lg font-semibold border-b-2 pb-1 mb-2" style={{ borderColor: accentColor, color: accentColor }}>{t('summary')}</h2>
            <p className="text-gray-700 whitespace-pre-wrap">{summary}</p>
          </section>
        )}
        {experiences.length > 0 && (
          <section className="mb-6">
            <h2 className="text-lg font-semibold border-b-2 pb-1 mb-2" style={{ borderColor: accentColor, color: accentColor }}>{t('experience')}</h2>
            {experiences.map(exp => (
              <div key={exp.id} className="mb-4">
                <div className="flex justify-between items-start">
                  <div><span className="font-semibold">{exp.position}</span> @ {exp.company}</div>
                  <span className="text-sm text-gray-500">{exp.startDate} - {exp.current ? t('present') : exp.endDate}</span>
                </div>
                <p className="text-gray-600 text-sm whitespace-pre-wrap mt-1">{exp.description}</p>
              </div>
            ))}
          </section>
        )}
        {educations.length > 0 && (
          <section className="mb-6">
            <h2 className="text-lg font-semibold border-b-2 pb-1 mb-2" style={{ borderColor: accentColor, color: accentColor }}>{t('education')}</h2>
            {educations.map(edu => (
              <div key={edu.id} className="mb-3">
                <div className="flex justify-between">
                  <div><span className="font-semibold">{edu.degree}</span> - {edu.field}</div>
                  <span className="text-sm text-gray-500">{edu.graduationDate}</span>
                </div>
                <p className="text-gray-600">{edu.school} {edu.gpa && `(GPA: ${edu.gpa})`}</p>
              </div>
            ))}
          </section>
        )}
        <div className="grid grid-cols-2 gap-6">
          {skills.length > 0 && (
            <section>
              <h2 className="text-lg font-semibold border-b-2 pb-1 mb-2" style={{ borderColor: accentColor, color: accentColor }}>{t('skills')}</h2>
              <div className="space-y-2">
                {skills.map((skill, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between text-sm"><span>{skill.name}</span><span>{skill.level}%</span></div>
                    <div className="h-2 bg-gray-200 rounded-full"><div className="h-full rounded-full" style={{ width: `${skill.level}%`, backgroundColor: accentColor }} /></div>
                  </div>
                ))}
              </div>
            </section>
          )}
          {languages.length > 0 && (
            <section>
              <h2 className="text-lg font-semibold border-b-2 pb-1 mb-2" style={{ borderColor: accentColor, color: accentColor }}>{t('languages')}</h2>
              <ul className="space-y-1">
                {languages.map((lang, idx) => (
                  <li key={idx} className="flex justify-between text-sm"><span>{lang.name}</span><span className="text-gray-500">{langLabels[lang.level]}</span></li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </div>
    );
  };


  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2 border-b border-gray-200 dark:border-gray-700 pb-4">
        <button onClick={() => setActiveTab('edit')} className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'edit' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'}`}>{t('editTab')}</button>
        <button onClick={() => setActiveTab('preview')} className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'preview' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'}`}>{t('previewTab')}</button>
        <div className="flex-1" />
        <select value={template} onChange={e => setTemplate(e.target.value as TemplateType)} className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
          <option value="professional">{t('templates.professional')}</option>
          <option value="minimal">{t('templates.minimal')}</option>
          <option value="creative">{t('templates.creative')}</option>
        </select>
        <input type="color" value={accentColor} onChange={e => setAccentColor(e.target.value)} className="w-10 h-10 rounded cursor-pointer" title={t('accentColor')} />
        <button onClick={exportPDF} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">{t('exportPDF')}</button>
      </div>

      {activeTab === 'edit' ? (
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <section className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 space-y-4">
              <h3 className="font-semibold text-gray-900 dark:text-white">{t('personalInfo')}</h3>
              <div className="flex items-center gap-4">
                <div className="relative">
                  {photo ? <img src={photo} alt="Photo" className="w-20 h-20 rounded-full object-cover" /> : <div className="w-20 h-20 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-2xl">👤</div>}
                  <input ref={fileInputRef} type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                  <button onClick={() => fileInputRef.current?.click()} className="absolute -bottom-1 -right-1 w-8 h-8 bg-blue-600 text-white rounded-full text-sm hover:bg-blue-700">📷</button>
                </div>
                <div className="flex-1 grid grid-cols-2 gap-2">
                  <input value={name} onChange={e => setName(e.target.value)} placeholder={t('placeholders.name')} className="col-span-2 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white" />
                  <input value={title} onChange={e => setTitle(e.target.value)} placeholder={t('placeholders.title')} className="col-span-2 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input value={email} onChange={e => setEmail(e.target.value)} placeholder={t('placeholders.email')} type="email" className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white" />
                <input value={phone} onChange={e => setPhone(e.target.value)} placeholder={t('placeholders.phone')} className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white" />
                <input value={location} onChange={e => setLocation(e.target.value)} placeholder={t('placeholders.location')} className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white" />
                <input value={website} onChange={e => setWebsite(e.target.value)} placeholder={t('placeholders.website')} className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white" />
              </div>
              <textarea value={summary} onChange={e => setSummary(e.target.value)} placeholder={t('summaryPlaceholder')} rows={3} className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white resize-none" />
            </section>

            <section className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 space-y-4">
              <h3 className="font-semibold text-gray-900 dark:text-white">{t('skills')}</h3>
              <div className="flex gap-2">
                <input value={newSkill} onChange={e => setNewSkill(e.target.value)} placeholder={t('addSkill')} className="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white" onKeyDown={e => e.key === 'Enter' && addSkill()} />
                <input type="range" min="10" max="100" value={newSkillLevel} onChange={e => setNewSkillLevel(Number(e.target.value))} className="w-24" />
                <span className="w-10 text-center text-gray-600 dark:text-gray-400">{newSkillLevel}%</span>
                <button onClick={addSkill} className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">+</button>
              </div>
              {skills.length === 0 ? <p className="text-gray-500 text-sm">{t('noSkills')}</p> : (
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill, idx) => (
                    <span key={idx} className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm">
                      {skill.name} ({skill.level}%)
                      <button onClick={() => removeSkill(idx)} className="ml-1 text-blue-600 dark:text-blue-400 hover:text-red-500">×</button>
                    </span>
                  ))}
                </div>
              )}
            </section>

            <section className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 space-y-4">
              <h3 className="font-semibold text-gray-900 dark:text-white">{t('languages')}</h3>
              <div className="flex gap-2">
                <input value={newLang} onChange={e => setNewLang(e.target.value)} placeholder={t('addLanguage')} className="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white" onKeyDown={e => e.key === 'Enter' && addLanguage()} />
                <select value={newLangLevel} onChange={e => setNewLangLevel(e.target.value as LangLevel)} className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
                  {LANG_LEVELS.map(lvl => <option key={lvl} value={lvl}>{langLabels[lvl]}</option>)}
                </select>
                <button onClick={addLanguage} className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">+</button>
              </div>
              {languages.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {languages.map((lang, idx) => (
                    <span key={idx} className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-sm">
                      {lang.name} - {langLabels[lang.level]}
                      <button onClick={() => removeLanguage(idx)} className="ml-1 text-green-600 dark:text-green-400 hover:text-red-500">×</button>
                    </span>
                  ))}
                </div>
              )}
            </section>
          </div>


          <div className="space-y-6">
            <section className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-gray-900 dark:text-white">{t('experience')}</h3>
                <button onClick={addExperience} className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">{t('addExperience')}</button>
              </div>
              {experiences.map(exp => (
                <div key={exp.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 space-y-2">
                  <div className="flex justify-between">
                    <input value={exp.company} onChange={e => updateExperience(exp.id, 'company', e.target.value)} placeholder={t('company')} className="flex-1 px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm" />
                    <button onClick={() => removeExperience(exp.id)} className="ml-2 text-red-500 hover:text-red-700">🗑️</button>
                  </div>
                  <input value={exp.position} onChange={e => updateExperience(exp.id, 'position', e.target.value)} placeholder={t('position')} className="w-full px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm" />
                  <div className="flex gap-2 items-center">
                    <input type="month" value={exp.startDate} onChange={e => updateExperience(exp.id, 'startDate', e.target.value)} className="flex-1 px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm" />
                    <span className="text-gray-500">-</span>
                    <input type="month" value={exp.endDate} onChange={e => updateExperience(exp.id, 'endDate', e.target.value)} disabled={exp.current} className="flex-1 px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm disabled:opacity-50" />
                    <label className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                      <input type="checkbox" checked={exp.current} onChange={e => updateExperience(exp.id, 'current', e.target.checked)} />
                      {t('present')}
                    </label>
                  </div>
                  <textarea value={exp.description} onChange={e => updateExperience(exp.id, 'description', e.target.value)} placeholder={t('jobDescription')} rows={2} className="w-full px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm resize-none" />
                </div>
              ))}
            </section>

            <section className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-gray-900 dark:text-white">{t('education')}</h3>
                <button onClick={addEducation} className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">{t('addEducation')}</button>
              </div>
              {educations.map(edu => (
                <div key={edu.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 space-y-2">
                  <div className="flex justify-between">
                    <input value={edu.school} onChange={e => updateEducation(edu.id, 'school', e.target.value)} placeholder={t('school')} className="flex-1 px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm" />
                    <button onClick={() => removeEducation(edu.id)} className="ml-2 text-red-500 hover:text-red-700">🗑️</button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input value={edu.degree} onChange={e => updateEducation(edu.id, 'degree', e.target.value)} placeholder={t('degree')} className="px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm" />
                    <input value={edu.field} onChange={e => updateEducation(edu.id, 'field', e.target.value)} placeholder={t('fieldOfStudy')} className="px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm" />
                    <input type="month" value={edu.graduationDate} onChange={e => updateEducation(edu.id, 'graduationDate', e.target.value)} className="px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm" />
                    <input value={edu.gpa || ''} onChange={e => updateEducation(edu.id, 'gpa', e.target.value)} placeholder={t('gpa')} className="px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm" />
                  </div>
                </div>
              ))}
            </section>
          </div>
        </div>
      ) : (
        <div className="overflow-auto bg-gray-100 dark:bg-gray-900 p-4 rounded-xl">
          {renderPreview()}
        </div>
      )}
    </div>
  );
}
