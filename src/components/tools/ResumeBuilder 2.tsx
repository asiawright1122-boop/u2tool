'use client';
import { useState, useRef, useCallback, useEffect } from 'react';
import { useTranslations } from 'next-intl';

interface Experience { id: string; company: string; position: string; startDate: string; endDate: string; description: string; current: boolean; }
interface Education { id: string; school: string; degree: string; field: string; graduationDate: string; gpa?: string; }
type TemplateType = 'professional' | 'minimal' | 'creative';

export default function ResumeBuilder() {
  const t = useTranslations('tools');
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
  const [languages, setLanguages] = useState<{name: string; level: string}[]>([]);
  const [newLang, setNewLang] = useState('');
  const [newLangLevel, setNewLangLevel] = useState('Fluent');
  
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [educations, setEducations] = useState<Education[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const handlePhotoUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.size <= 5 * 1024 * 1024) {
      const reader = new FileReader();
      reader.onload = (event) => setPhoto(event.target?.result as string);
      reader.readAsDataURL(file);
    }
  }, []);

  const addSkill = () => { if (newSkill.trim()) { setSkills([...skills, { name: newSkill.trim(), level: newSkillLevel }]); setNewSkill(''); } };
  const removeSkill = (idx: number) => setSkills(skills.filter((_, i) => i !== idx));
  const addLanguage = () => { if (newLang.trim()) { setLanguages([...languages, { name: newLang.trim(), level: newLangLevel }]); setNewLang(''); } };
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
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save((name || 'resume') + '.pdf');
    } catch (error) { console.error('PDF generation failed:', error); }
  };

  const templates = [
    { id: 'professional' as const, name: t('resume.templates.professional'), icon: '💼', desc: t('resume.templates.professionalDesc') },
    { id: 'minimal' as const, name: t('resume.templates.minimal'), icon: '⚪', desc: t('resume.templates.minimalDesc') },
    { id: 'creative' as const, name: t('resume.templates.creative'), icon: '🎨', desc: t('resume.templates.creativeDesc') },
  ];

  const colors = ['#2563eb', '#059669', '#dc2626', '#7c3aed', '#ea580c', '#0891b2', '#4f46e5', '#be185d'];
  const inputClass = "w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-blue-500";
  const labelClass = "block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1";
  const sectionClass = "border border-gray-200 dark:border-gray-700 rounded-xl p-4 bg-gray-50 dark:bg-gray-800/50";
  const btnClass = "px-3 py-1.5 text-sm rounded-lg transition-colors";
  const hasContent = name || title || email || summary || experiences.length > 0;

  const renderProfessionalTemplate = () => (
    <div ref={resumeRef} className="bg-white text-gray-900 p-8" style={{ width: '210mm', minHeight: '297mm', fontFamily: 'system-ui' }}>
      <div className="flex gap-6 mb-6 pb-6 border-b-2" style={{ borderColor: accentColor }}>
        {photo && <img src={photo} alt="" className="w-24 h-24 rounded-full object-cover border-4" style={{ borderColor: accentColor }} />}
        <div className="flex-1">
          <h1 className="text-3xl font-bold" style={{ color: accentColor }}>{name}</h1>
          <p className="text-lg text-gray-600">{title}</p>
          <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-500">
            {email && <span>📧 {email}</span>}
            {phone && <span>📞 {phone}</span>}
            {location && <span>📍 {location}</span>}
            {website && <span>🌐 {website}</span>}
          </div>
        </div>
      </div>
      {summary && <div className="mb-6"><h2 className="text-lg font-bold mb-2" style={{ color: accentColor }}>Summary</h2><p className="text-sm text-gray-700">{summary}</p></div>}
      {experiences.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold mb-3" style={{ color: accentColor }}>Experience</h2>
          {experiences.map(exp => (
            <div key={exp.id} className="mb-4">
              <div className="flex justify-between"><h3 className="font-semibold">{exp.position}</h3><span className="text-sm text-gray-500">{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</span></div>
              <p className="text-sm" style={{ color: accentColor }}>{exp.company}</p>
              {exp.description && <p className="text-sm text-gray-600 mt-1">{exp.description}</p>}
            </div>
          ))}
        </div>
      )}
      {educations.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold mb-3" style={{ color: accentColor }}>Education</h2>
          {educations.map(edu => (
            <div key={edu.id} className="mb-3">
              <div className="flex justify-between"><h3 className="font-semibold">{edu.degree} {edu.field && ('in ' + edu.field)}</h3><span className="text-sm text-gray-500">{edu.graduationDate}</span></div>
              <p className="text-sm" style={{ color: accentColor }}>{edu.school}</p>
            </div>
          ))}
        </div>
      )}
      {skills.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold mb-3" style={{ color: accentColor }}>Skills</h2>
          <div className="flex flex-wrap gap-2">{skills.map((s, i) => <span key={i} className="px-3 py-1 rounded-full text-sm text-white" style={{ background: accentColor }}>{s.name}</span>)}</div>
        </div>
      )}
    </div>
  );

  const renderMinimalTemplate = () => (
    <div ref={resumeRef} className="bg-white text-gray-900 p-12" style={{ width: '210mm', minHeight: '297mm', fontFamily: 'Georgia, serif' }}>
      <div className="text-center mb-8 pb-6 border-b border-gray-200">
        {photo && <img src={photo} alt="" className="w-20 h-20 rounded-full object-cover mx-auto mb-4 grayscale" />}
        <h1 className="text-3xl font-light">{name}</h1>
        <p className="text-gray-500 mt-1">{title}</p>
        <div className="flex justify-center gap-6 mt-3 text-sm text-gray-400">
          {email && <span>{email}</span>}
          {phone && <span>{phone}</span>}
          {location && <span>{location}</span>}
        </div>
      </div>
      {summary && <p className="text-center text-sm text-gray-600 mb-8 max-w-xl mx-auto italic">{summary}</p>}
      <div className="flex gap-12">
        <div className="flex-1">
          {experiences.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xs uppercase tracking-widest text-gray-400 mb-4">Experience</h2>
              {experiences.map(exp => (
                <div key={exp.id} className="mb-4">
                  <div className="flex justify-between"><h3 className="font-medium">{exp.position}</h3><span className="text-xs text-gray-400">{exp.startDate} — {exp.current ? 'Present' : exp.endDate}</span></div>
                  <p className="text-sm text-gray-500">{exp.company}</p>
                  {exp.description && <p className="text-sm text-gray-600 mt-1">{exp.description}</p>}
                </div>
              ))}
            </div>
          )}
          {educations.length > 0 && (
            <div>
              <h2 className="text-xs uppercase tracking-widest text-gray-400 mb-4">Education</h2>
              {educations.map(edu => (
                <div key={edu.id} className="mb-3">
                  <h3 className="font-medium">{edu.degree}</h3>
                  <p className="text-sm text-gray-500">{edu.school}</p>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="w-48">
          {skills.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xs uppercase tracking-widest text-gray-400 mb-3">Skills</h2>
              <div className="space-y-1">{skills.map((s, i) => <div key={i} className="text-sm text-gray-700">{s.name}</div>)}</div>
            </div>
          )}
          {languages.length > 0 && (
            <div>
              <h2 className="text-xs uppercase tracking-widest text-gray-400 mb-3">Languages</h2>
              <div className="space-y-1">{languages.map((l, i) => <div key={i} className="text-sm text-gray-700">{l.name}</div>)}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderCreativeTemplate = () => (
    <div ref={resumeRef} className="text-gray-900" style={{ width: '210mm', minHeight: '297mm', fontFamily: 'system-ui' }}>
      <div className="text-white p-8" style={{ background: 'linear-gradient(135deg, ' + accentColor + ', ' + accentColor + 'cc)' }}>
        <div className="flex items-center gap-6">
          {photo && <img src={photo} alt="" className="w-28 h-28 rounded-2xl object-cover border-4 border-white/30" />}
          <div>
            <h1 className="text-4xl font-black">{name}</h1>
            <p className="text-xl mt-1 opacity-90">{title}</p>
            <div className="flex flex-wrap gap-3 mt-3 text-sm">
              {email && <span className="bg-white/20 px-3 py-1 rounded-full">{email}</span>}
              {phone && <span className="bg-white/20 px-3 py-1 rounded-full">{phone}</span>}
              {location && <span className="bg-white/20 px-3 py-1 rounded-full">{location}</span>}
            </div>
          </div>
        </div>
      </div>
      <div className="flex">
        <div className="flex-1 p-8 bg-white">
          {summary && <div className="mb-6"><h2 className="text-xl font-bold mb-2" style={{ color: accentColor }}>About</h2><p className="text-sm text-gray-700">{summary}</p></div>}
          {experiences.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-bold mb-4" style={{ color: accentColor }}>Experience</h2>
              {experiences.map(exp => (
                <div key={exp.id} className="mb-4 pl-4 border-l-2" style={{ borderColor: accentColor }}>
                  <div className="flex justify-between"><h3 className="font-bold">{exp.position}</h3><span className="text-xs px-2 py-1 rounded-full text-white" style={{ background: accentColor }}>{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</span></div>
                  <p className="text-sm" style={{ color: accentColor }}>{exp.company}</p>
                  {exp.description && <p className="text-sm text-gray-600 mt-1">{exp.description}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="w-64 p-6 bg-gray-900 text-white">
          {skills.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg font-bold mb-3">Skills</h2>
              <div className="space-y-2">{skills.map((s, i) => (
                <div key={i}><div className="text-sm mb-1">{s.name}</div><div className="h-2 bg-gray-700 rounded-full"><div className="h-full rounded-full" style={{ width: s.level + '%', background: accentColor }} /></div></div>
              ))}</div>
            </div>
          )}
          {educations.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg font-bold mb-3">Education</h2>
              {educations.map(edu => <div key={edu.id} className="mb-2"><div className="font-medium text-sm">{edu.degree}</div><div className="text-xs text-gray-400">{edu.school}</div></div>)}
            </div>
          )}
          {languages.length > 0 && (
            <div>
              <h2 className="text-lg font-bold mb-3">Languages</h2>
              <div className="flex flex-wrap gap-2">{languages.map((l, i) => <span key={i} className="px-2 py-1 rounded text-xs" style={{ background: accentColor }}>{l.name}</span>)}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderResumePreview = () => {
    if (!hasContent) {
      useEffect(() => {
        return () => {
          if (timerRef.current) clearTimeout(timerRef.current);
        };
      }, []);

      return (
        <div className="flex items-center justify-center h-96 text-gray-400">
          <div className="text-center">
            <div className="text-6xl mb-4">📝</div>
            <p>{t('resume.startFilling')}</p>
          </div>
        </div>
      );
    }
    if (template === 'minimal') return renderMinimalTemplate();
    if (template === 'creative') return renderCreativeTemplate();
    return renderProfessionalTemplate();
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg w-fit">
        <button onClick={() => setActiveTab('edit')} className={'px-4 py-2 rounded-md text-sm font-medium transition-colors ' + (activeTab === 'edit' ? 'bg-white dark:bg-gray-700 shadow' : 'text-gray-600 dark:text-gray-400')}>✏️ {t('resume.edit')}</button>
        <button onClick={() => setActiveTab('preview')} className={'px-4 py-2 rounded-md text-sm font-medium transition-colors ' + (activeTab === 'preview' ? 'bg-white dark:bg-gray-700 shadow' : 'text-gray-600 dark:text-gray-400')}>👁️ {t('resume.preview')}</button>
      </div>

      {activeTab === 'edit' ? (
        <div className="space-y-4">
          <div className={sectionClass}>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">🎨 {t('resume.selectTemplate')}</h3>
            <div className="grid grid-cols-3 gap-2">
              {templates.map((tpl) => (
                <button key={tpl.id} onClick={() => setTemplate(tpl.id)} className={'p-3 rounded-lg border-2 text-left transition-all ' + (template === tpl.id ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30' : 'border-gray-200 dark:border-gray-700')}>
                  <div className="text-2xl mb-1">{tpl.icon}</div>
                  <div className="font-medium text-sm">{tpl.name}</div>
                  <div className="text-xs text-gray-500">{tpl.desc}</div>
                </button>
              ))}
            </div>
            <div className="mt-4">
              <label className={labelClass}>{t('resume.accentColor')}</label>
              <div className="flex gap-2">
                {colors.map((color) => (<button key={color} onClick={() => setAccentColor(color)} className={'w-8 h-8 rounded-full border-2 ' + (accentColor === color ? 'border-gray-900 dark:border-white scale-110' : 'border-transparent')} style={{ background: color }} />))}
              </div>
            </div>
          </div>

          <div className={sectionClass}>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">👤 {t('resume.personalInfo')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className={labelClass}>{t('resume.photo')}</label>
                <div className="flex items-center gap-4">
                  {photo ? (
                    <div className="relative">
                      <img src={photo} alt="Profile" className="w-20 h-20 rounded-full object-cover" />
                      <button onClick={() => setPhoto(null)} className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs">✕</button>
                    </div>
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-2xl">👤</div>
                  )}
                  <div>
                    <input ref={fileInputRef} type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                    <button onClick={() => fileInputRef.current?.click()} className={btnClass + ' bg-blue-500 text-white hover:bg-blue-600'}>{t('resume.uploadPhoto')}</button>
                  </div>
                </div>
              </div>
              <div><label className={labelClass}>{t('resume.fullName')}</label><input type="text" value={name} onChange={(e) => setName(e.target.value)} className={inputClass} placeholder="John Doe" /></div>
              <div><label className={labelClass}>{t('resume.jobTitle')}</label><input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className={inputClass} placeholder="Software Engineer" /></div>
              <div><label className={labelClass}>{t('resume.email')}</label><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} placeholder="john@example.com" /></div>
              <div><label className={labelClass}>{t('resume.phone')}</label><input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className={inputClass} placeholder="+1 234 567 8900" /></div>
              <div><label className={labelClass}>{t('resume.location')}</label><input type="text" value={location} onChange={(e) => setLocation(e.target.value)} className={inputClass} placeholder="San Francisco, CA" /></div>
              <div><label className={labelClass}>{t('resume.website')}</label><input type="url" value={website} onChange={(e) => setWebsite(e.target.value)} className={inputClass} placeholder="https://yoursite.com" /></div>
              <div className="md:col-span-2"><label className={labelClass}>{t('resume.summary')}</label><textarea value={summary} onChange={(e) => setSummary(e.target.value)} className={inputClass + ' h-20 resize-none'} placeholder={t('resume.summaryPlaceholder')} /></div>
            </div>
          </div>

          <div className={sectionClass}>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">🛠️ {t('resume.skills')}</h3>
            <div className="flex gap-2 mb-3">
              <input type="text" value={newSkill} onChange={(e) => setNewSkill(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addSkill()} className={inputClass + ' flex-1'} placeholder={t('resume.skillName')} />
              <input type="range" min="10" max="100" value={newSkillLevel} onChange={(e) => setNewSkillLevel(Number(e.target.value))} className="w-20" />
              <span className="text-sm w-8">{newSkillLevel}%</span>
              <button onClick={addSkill} className={btnClass + ' bg-green-500 text-white'}>+</button>
            </div>
            <div className="flex flex-wrap gap-2">{skills.map((skill, idx) => (<span key={idx} className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-full text-sm">{skill.name} ({skill.level}%)<button onClick={() => removeSkill(idx)} className="hover:text-red-500">×</button></span>))}</div>
          </div>

          <div className={sectionClass}>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">🌍 {t('resume.languages')}</h3>
            <div className="flex gap-2 mb-3">
              <input type="text" value={newLang} onChange={(e) => setNewLang(e.target.value)} className={inputClass + ' flex-1'} placeholder={t('resume.languageName')} />
              <select value={newLangLevel} onChange={(e) => setNewLangLevel(e.target.value)} className={inputClass + ' w-28'}><option>Native</option><option>Fluent</option><option>Advanced</option><option>Intermediate</option><option>Basic</option></select>
              <button onClick={addLanguage} className={btnClass + ' bg-green-500 text-white'}>+</button>
            </div>
            <div className="flex flex-wrap gap-2">{languages.map((lang, idx) => (<span key={idx} className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 rounded-full text-sm">{lang.name}<button onClick={() => removeLanguage(idx)} className="hover:text-red-500">×</button></span>))}</div>
          </div>

          <div className={sectionClass}>
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">💼 {t('resume.experience')}</h3>
              <button onClick={addExperience} className={btnClass + ' bg-blue-500 text-white'}>+ {t('resume.addExperience')}</button>
            </div>
            {experiences.map((exp, idx) => (
              <div key={exp.id} className="p-4 mb-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="flex justify-between mb-3"><span className="text-sm text-gray-500">#{idx + 1}</span><button onClick={() => removeExperience(exp.id)} className="text-red-500 text-sm">🗑️</button></div>
                <div className="grid grid-cols-2 gap-3">
                  <div><label className={labelClass}>{t('resume.company')}</label><input type="text" value={exp.company} onChange={(e) => updateExperience(exp.id, 'company', e.target.value)} className={inputClass} /></div>
                  <div><label className={labelClass}>{t('resume.position')}</label><input type="text" value={exp.position} onChange={(e) => updateExperience(exp.id, 'position', e.target.value)} className={inputClass} /></div>
                  <div><label className={labelClass}>{t('resume.startDate')}</label><input type="month" value={exp.startDate} onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)} className={inputClass} /></div>
                  <div><label className={labelClass}>{t('resume.endDate')}</label><div className="flex gap-2"><input type="month" value={exp.endDate} onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)} className={inputClass} disabled={exp.current} /><label className="flex items-center gap-1 text-xs"><input type="checkbox" checked={exp.current} onChange={(e) => updateExperience(exp.id, 'current', e.target.checked)} />{t('resume.present')}</label></div></div>
                  <div className="col-span-2"><label className={labelClass}>{t('resume.description')}</label><textarea value={exp.description} onChange={(e) => updateExperience(exp.id, 'description', e.target.value)} className={inputClass + ' h-16 resize-none'} /></div>
                </div>
              </div>
            ))}
          </div>

          <div className={sectionClass}>
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">🎓 {t('resume.education')}</h3>
              <button onClick={addEducation} className={btnClass + ' bg-blue-500 text-white'}>+ {t('resume.addEducation')}</button>
            </div>
            {educations.map((edu, idx) => (
              <div key={edu.id} className="p-4 mb-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="flex justify-between mb-3"><span className="text-sm text-gray-500">#{idx + 1}</span><button onClick={() => removeEducation(edu.id)} className="text-red-500 text-sm">🗑️</button></div>
                <div className="grid grid-cols-2 gap-3">
                  <div><label className={labelClass}>{t('resume.school')}</label><input type="text" value={edu.school} onChange={(e) => updateEducation(edu.id, 'school', e.target.value)} className={inputClass} /></div>
                  <div><label className={labelClass}>{t('resume.degree')}</label><input type="text" value={edu.degree} onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)} className={inputClass} /></div>
                  <div><label className={labelClass}>{t('resume.field')}</label><input type="text" value={edu.field} onChange={(e) => updateEducation(edu.id, 'field', e.target.value)} className={inputClass} /></div>
                  <div><label className={labelClass}>{t('resume.graduationDate')}</label><input type="month" value={edu.graduationDate} onChange={(e) => updateEducation(edu.id, 'graduationDate', e.target.value)} className={inputClass} /></div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center">
            <button onClick={() => { setActiveTab('preview'); setTimeout(downloadPDF, 500); }} className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium hover:from-blue-600 hover:to-purple-700 shadow-lg">📥 {t('resume.downloadPDF')}</button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-500">{t('resume.previewHint')}</p>
            <button onClick={downloadPDF} className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">📥 {t('resume.downloadPDF')}</button>
          </div>
          <div className="overflow-auto bg-gray-200 dark:bg-gray-900 p-4 rounded-xl" style={{ maxHeight: '80vh' }}>{renderResumePreview()}</div>
        </div>
      )}
    </div>
  );
}
