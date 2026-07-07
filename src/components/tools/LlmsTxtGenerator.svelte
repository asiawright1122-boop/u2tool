<script lang="ts">
  import { generateLlmsTxt, type LlmsTxtData, type LlmsTxtItem, type LlmsTxtSection } from '../../lib/llms-txt-generator-helper';

  interface Props {
    locale?: string;
    translations?: Record<string, unknown>;
  }

  let { locale = 'en', translations = {} }: Props = $props();

  const I18N_BACKUP: Record<string, Record<string, string>> = {
    zh: {
      title: 'LLMs.txt 生成器',
      subtitle: '为您的项目生成符合规范的 llms.txt 文件，帮助 AI 爬虫更高效地阅读和理解文档结构',
      baseInfo: '项目基础信息',
      projTitle: '项目名称',
      projSummary: '项目简介 (一行字摘要)',
      projDetail: '详细说明 (支持 Markdown，可选)',
      sectionsTitle: '文档与链接分区',
      addSection: '+ 添加分区',
      sectionName: '分区名称 (例如: Core API, Getting Started)',
      addItem: '+ 添加链接',
      itemTitle: '标题',
      itemUrl: '链接 URL',
      itemType: '类型 (可选，如 docs, api)',
      itemDesc: '详细描述 (可选)',
      outputLabel: '生成的 llms.txt (Markdown)',
      copyBtn: '复制 llms.txt',
      copied: '✓ 已复制!',
      downloadBtn: '下载 llms.txt',
      clearBtn: '清空',
      removeSection: '删除分区',
      removeItem: '移除'
    },
    en: {
      title: 'LLMs.txt Generator',
      subtitle: 'Generate a standard llms.txt file for your project to help LLMs and AI agents crawl and understand your docs efficiently',
      baseInfo: 'Project Information',
      projTitle: 'Project Name',
      projSummary: 'Brief Summary (One-liner)',
      projDetail: 'Detailed Description (Markdown allowed, optional)',
      sectionsTitle: 'Sections & Links',
      addSection: '+ Add Section',
      sectionName: 'Section Name (e.g. Core API, Getting Started)',
      addItem: '+ Add Link',
      itemTitle: 'Title',
      itemUrl: 'URL',
      itemType: 'Type (e.g. docs, api, optional)',
      itemDesc: 'Description (optional)',
      outputLabel: 'Generated llms.txt',
      copyBtn: 'Copy llms.txt',
      copied: '✓ Copied!',
      downloadBtn: 'Download llms.txt',
      clearBtn: 'Clear',
      removeSection: 'Remove Section',
      removeItem: 'Remove'
    },
    es: {
      title: 'Generador LLMs.txt',
      subtitle: 'Genere un archivo llms.txt estándar para su proyecto para ayudar a los agentes de IA a rastrear su documentación',
      baseInfo: 'Información del Proyecto',
      projTitle: 'Nombre del Proyecto',
      projSummary: 'Breve Resumen (Una línea)',
      projDetail: 'Descripción Detallada (Opcional)',
      sectionsTitle: 'Secciones y Enlaces',
      addSection: '+ Añadir Sección',
      sectionName: 'Nombre de la Sección (ej. API Core, Guías)',
      addItem: '+ Añadir Enlace',
      itemTitle: 'Título',
      itemUrl: 'URL',
      itemType: 'Tipo (ej. docs, api)',
      itemDesc: 'Descripción (Opcional)',
      outputLabel: 'llms.txt Generado',
      copyBtn: 'Copiar llms.txt',
      copied: '✓ ¡Copiado!',
      downloadBtn: 'Descargar llms.txt',
      clearBtn: 'Limpiar',
      removeSection: 'Eliminar Sección',
      removeItem: 'Eliminar'
    },
    pt: {
      title: 'Gerador LLMs.txt',
      subtitle: 'Gere um arquivo llms.txt padrão para o seu projeto para ajudar os agentes de IA a ler sua documentação',
      baseInfo: 'Informações do Projeto',
      projTitle: 'Nome do Projeto',
      projSummary: 'Resumo Breve (Uma linha)',
      projDetail: 'Descrição Detalhada (Opcional)',
      sectionsTitle: 'Seções e Links',
      addSection: '+ Adicionar Seção',
      sectionName: 'Nome da Seção (ex. API Core, Tutoriais)',
      addItem: '+ Adicionar Link',
      itemTitle: 'Título',
      itemUrl: 'URL',
      itemType: 'Tipo (ex. docs, api)',
      itemDesc: 'Descrição (Opcional)',
      outputLabel: 'llms.txt Gerado',
      copyBtn: 'Copiar llms.txt',
      copied: '✓ Copiado!',
      downloadBtn: 'Baixar llms.txt',
      clearBtn: 'Limpar',
      removeSection: 'Remover Seção',
      removeItem: 'Remover'
    },
    ja: {
      title: 'LLMs.txt ジェネレーター',
      subtitle: 'AIクローラーやLLMがドキュメント構造を効率的に理解できるように、標準の llms.txt ファイルを生成します',
      baseInfo: 'プロジェクト基本情報',
      projTitle: 'プロジェクト名',
      projSummary: 'プロジェクト概要 (1行)',
      projDetail: '詳細説明 (Markdown可、任意)',
      sectionsTitle: 'セクションとリンク',
      addSection: '+ セクションを追加',
      sectionName: 'セクション名 (例: Core API, Getting Started)',
      addItem: '+ リンクを追加',
      itemTitle: 'タイトル',
      itemUrl: 'リンク URL',
      itemType: 'タイプ (任意、例: docs, api)',
      itemDesc: '詳細説明 (任意)',
      outputLabel: '生成された llms.txt',
      copyBtn: 'llms.txt をコピー',
      copied: '✓ コピーしました!',
      downloadBtn: 'llms.txt をダウンロード',
      clearBtn: 'クリア',
      removeSection: 'セクションを削除',
      removeItem: '削除'
    },
    fr: {
      title: 'Générateur LLMs.txt',
      subtitle: 'Générez un fichier llms.txt standard pour votre projet afin d\'aider les robots d\'IA à explorer votre documentation',
      baseInfo: 'Informations du Projet',
      projTitle: 'Nom du Projet',
      projSummary: 'Résumé Bref (Une ligne)',
      projDetail: 'Description Détaillée (Optionnel)',
      sectionsTitle: 'Sections et Liens',
      addSection: '+ Ajouter une Section',
      sectionName: 'Nom de la Section (ex. API Core, Guides)',
      addItem: '+ Ajouter un Lien',
      itemTitle: 'Titre',
      itemUrl: 'URL',
      itemType: 'Type (ex. docs, api)',
      itemDesc: 'Description (Optionnel)',
      outputLabel: 'llms.txt Généré',
      copyBtn: 'Copier llms.txt',
      copied: '✓ Copié !',
      downloadBtn: 'Télécharger llms.txt',
      clearBtn: 'Effacer',
      removeSection: 'Supprimer la Section',
      removeItem: 'Supprimer'
    },
    de: {
      title: 'LLMs.txt Generator',
      subtitle: 'Erstellen Sie eine standardmäßige llms.txt-Datei für Ihr Projekt, um KI-Agents das Lesen Ihrer Dokumentation zu erleichtern',
      baseInfo: 'Projektinformationen',
      projTitle: 'Projektname',
      projSummary: 'Kurzzusammenfassung (Einzeiler)',
      projDetail: 'Ausführliche Beschreibung (Optional)',
      sectionsTitle: 'Bereiche & Links',
      addSection: '+ Bereich hinzufügen',
      sectionName: 'Bereichsname (z. B. Core API, Erste Schritte)',
      addItem: '+ Link hinzufügen',
      itemTitle: 'Titel',
      itemUrl: 'URL',
      itemType: 'Typ (z. B. docs, api)',
      itemDesc: 'Beschreibung (Optional)',
      outputLabel: 'Generierte llms.txt',
      copyBtn: 'llms.txt kopieren',
      copied: '✓ Kopiert!',
      downloadBtn: 'llms.txt herunterladen',
      clearBtn: 'Löschen',
      removeSection: 'Bereich entfernen',
      removeItem: 'Entfernen'
    },
    ar: {
      title: 'مولد LLMs.txt',
      subtitle: 'أنشئ ملف llms.txt قياسيًا لمشروعك لمساعدة برامج الزحف الذكية وعملاء الذكاء الاصطناعي على قراءة مستنداتك بكفاءة',
      baseInfo: 'معلومات المشروع',
      projTitle: 'اسم المشروع',
      projSummary: 'ملخص موجز (سطر واحد)',
      projDetail: 'الوصف التفصيلي (اختياري)',
      sectionsTitle: 'الأقسام والروابط',
      addSection: '+ إضافة قسم',
      sectionName: 'اسم القسم (مثل: Core API، البدء)',
      addItem: '+ إضافة رابط',
      itemTitle: 'العنوان',
      itemUrl: 'عنوان URL',
      itemType: 'النوع (اختياري، مثل docs، api)',
      itemDesc: 'الوصف التفصيلي (اختياري)',
      outputLabel: 'ملف llms.txt المُولّد',
      copyBtn: 'نسخ llms.txt',
      copied: '✓ تم النسخ!',
      downloadBtn: 'تنزيل llms.txt',
      clearBtn: 'مسح',
      removeSection: 'إزالة القسم',
      removeItem: 'حذف'
    },
    ko: {
      title: 'LLMs.txt 생성기',
      subtitle: 'AI 에이전트와 크롤러가 프로젝트 문서를 효율적으로 탐색하고 구조를 이해할 수 있도록 표준 llms.txt 파일을 생성합니다',
      baseInfo: '프로젝트 정보',
      projTitle: '프로젝트 이름',
      projSummary: '프로젝트 요약 (한 줄)',
      projDetail: '상세 설명 (Markdown 가능, 선택 사항)',
      sectionsTitle: '섹션 및 링크',
      addSection: '+ 섹션 추가',
      sectionName: '섹션 이름 (예: Core API, Getting Started)',
      addItem: '+ 링크 추가',
      itemTitle: '제목',
      itemUrl: '링크 URL',
      itemType: '타입 (선택 사항, 예: docs, api)',
      itemDesc: '상세 설명 (선택 사항)',
      outputLabel: '생성된 llms.txt',
      copyBtn: 'llms.txt 복사',
      copied: '✓ 복사됨!',
      downloadBtn: 'llms.txt 다운로드',
      clearBtn: '초기화',
      removeSection: '섹션 삭제',
      removeItem: '삭제'
    },
    ru: {
      title: 'Генератор LLMs.txt',
      subtitle: 'Создайте стандартный файл llms.txt для вашего проекта, чтобы помочь ИИ-агентам быстрее сканировать вашу документацию',
      baseInfo: 'Информация о проекте',
      projTitle: 'Название проекта',
      projSummary: 'Краткое описание (в одну строку)',
      projDetail: 'Подробное описание (опционально, поддерживает Markdown)',
      sectionsTitle: 'Разделы и Ссылки',
      addSection: '+ Добавить раздел',
      sectionName: 'Название раздела (например, Core API, Начало работы)',
      addItem: '+ Добавить ссылку',
      itemTitle: 'Заголовок',
      itemUrl: 'Ссылка URL',
      itemType: 'Тип (опционально, например docs, api)',
      itemDesc: 'Описание (опционально)',
      outputLabel: 'Сгенерированный llms.txt',
      copyBtn: 'Копировать llms.txt',
      copied: '✓ Скопировано!',
      downloadBtn: 'Скачать llms.txt',
      clearBtn: 'Очистить',
      removeSection: 'Удалить раздел',
      removeItem: 'Удалить'
    }
  };

  const t = (key: string): string => {
    return (translations[key] as string) || I18N_BACKUP[locale]?.[key] || I18N_BACKUP.en[key] || key;
  };

  let title = $state('My Custom API');
  let summary = $state('A developer-friendly API client for advanced data transformation.');
  let detail = $state('This file lists the main documentation paths and endpoint specifications.');
  
  let sections = $state<LlmsTxtSection[]>([
    {
      title: 'Documentation',
      items: [
        { title: 'Getting Started', url: 'https://example.com/docs/intro', description: 'Quick setup and installation guides', type: 'docs' },
        { title: 'Authentication', url: 'https://example.com/docs/auth', description: 'JWT & OAuth configuration details', type: 'docs' }
      ]
    },
    {
      title: 'API Reference',
      items: [
        { title: 'Transforms Endpoint', url: 'https://example.com/api/v1/transforms', description: 'Post payloads to trigger conversions', type: 'api' }
      ]
    }
  ]);

  let copied = $state(false);

  // Deriving result using the helper
  let llmsTxtOutput = $derived.by(() => {
    return generateLlmsTxt({
      title,
      summary,
      detail,
      sections
    });
  });

  function addSection() {
    sections.push({
      title: 'New Section',
      items: []
    });
  }

  function removeSection(sIdx: number) {
    sections.splice(sIdx, 1);
  }

  function addItem(sIdx: number) {
    sections[sIdx].items.push({
      title: 'New Link',
      url: 'https://',
      description: '',
      type: ''
    });
  }

  function removeItem(sIdx: number, iIdx: number) {
    sections[sIdx].items.splice(iIdx, 1);
  }

  async function handleCopy() {
    if (!llmsTxtOutput) return;
    try {
      await navigator.clipboard.writeText(llmsTxtOutput);
      copied = true;
      setTimeout(() => {
        copied = false;
      }, 2000);
    } catch (e) {
      console.error(e);
    }
  }

  function handleDownload() {
    if (!llmsTxtOutput) return;
    const blob = new Blob([llmsTxtOutput], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'llms.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function handleClear() {
    title = '';
    summary = '';
    detail = '';
    sections = [];
  }
</script>

<div class="tool-theme-workspace min-h-screen p-4 md:p-8 flex flex-col gap-6">
  <div class="max-w-6xl mx-auto w-full flex flex-col gap-6">
    
    <!-- Header -->
    <div class="border-b border-amber-500/20 pb-4 flex justify-between items-end">
      <div>
        <h1 class="text-2xl md:text-3xl font-bold text-amber-700 dark:bg-gradient-to-r dark:from-amber-200 dark:to-yellow-500 dark:bg-clip-text dark:text-transparent">
          {t('title')}
        </h1>
        <p class="text-stone-400 text-sm mt-1">{t('subtitle')}</p>
      </div>
      <button 
        onclick={handleClear} 
        class="text-xs text-stone-500 hover:text-stone-300 border border-stone-850 hover:border-stone-700 py-1.5 px-3 rounded-lg transition"
      >
        {t('clearBtn')}
      </button>
    </div>

    <!-- Main Workspace -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
      
      <!-- Input Panel (Form Config) -->
      <div class="lg:col-span-7 flex flex-col gap-5">
        
        <!-- Base Info Card -->
        <div class="bg-stone-900/40 border border-stone-800 p-5 rounded-xl flex flex-col gap-4">
          <h2 class="text-sm font-bold text-amber-500 uppercase tracking-wider">{t('baseInfo')}</h2>
          
          <div class="flex flex-col gap-1.5">
            <label for="proj-title" class="text-xs text-stone-400">{t('projTitle')}</label>
            <input 
              id="proj-title"
              type="text" 
              bind:value={title} 
              class="w-full bg-stone-950 border border-stone-800 focus:border-amber-500/50 rounded-lg py-2 px-3 text-xs text-stone-200 focus:outline-none transition"
            />
          </div>

          <div class="flex flex-col gap-1.5">
            <label for="proj-summary" class="text-xs text-stone-400">{t('projSummary')}</label>
            <input 
              id="proj-summary"
              type="text" 
              bind:value={summary} 
              class="w-full bg-stone-950 border border-stone-800 focus:border-amber-500/50 rounded-lg py-2 px-3 text-xs text-stone-200 focus:outline-none transition"
            />
          </div>

          <div class="flex flex-col gap-1.5">
            <label for="proj-detail" class="text-xs text-stone-400">{t('projDetail')}</label>
            <textarea 
              id="proj-detail"
              bind:value={detail} 
              class="w-full bg-stone-950 border border-stone-800 focus:border-amber-500/50 rounded-lg py-2 px-3 text-xs text-stone-200 focus:outline-none transition resize-none h-[80px]"
            ></textarea>
          </div>
        </div>

        <!-- Sections & Links Manager -->
        <div class="bg-stone-900/40 border border-stone-800 p-5 rounded-xl flex flex-col gap-5">
          <div class="flex justify-between items-center border-b border-stone-800 pb-2">
            <h2 class="text-sm font-bold text-amber-500 uppercase tracking-wider">{t('sectionsTitle')}</h2>
            <button 
              onclick={addSection} 
              class="text-xs bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 py-1 px-3 rounded-lg transition"
            >
              {t('addSection')}
            </button>
          </div>

          <div class="flex flex-col gap-6 overflow-y-auto max-h-[500px] pr-1">
            {#each sections as section, sIdx}
              <div class="border border-stone-800 bg-stone-950/40 rounded-xl p-4 flex flex-col gap-3">
                <div class="flex justify-between items-center gap-4">
                  <input 
                    type="text" 
                    bind:value={section.title} 
                    placeholder={t('sectionName')}
                    class="bg-stone-950 border border-stone-800 focus:border-amber-500/50 rounded-lg py-1.5 px-3 text-xs font-semibold text-stone-200 focus:outline-none transition flex-1"
                  />
                  <button 
                    onclick={() => removeSection(sIdx)} 
                    class="text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 py-1 px-2 border border-red-500/20 rounded transition"
                  >
                    {t('removeSection')}
                  </button>
                </div>

                <!-- Section Items -->
                <div class="flex flex-col gap-3 mt-2 border-t border-stone-800/60 pt-3">
                  {#each section.items as item, iIdx}
                    <div class="bg-stone-900/30 p-3 rounded-lg border border-stone-800/40 flex flex-col gap-2 relative group">
                      
                      <!-- Title & Type & Remove button row -->
                      <div class="grid grid-cols-12 gap-2">
                        <div class="col-span-5">
                          <input 
                            type="text" 
                            bind:value={item.title} 
                            placeholder={t('itemTitle')}
                            class="w-full bg-stone-950 border border-stone-800 focus:border-amber-500/50 rounded py-1 px-2 text-[11px] text-stone-200 focus:outline-none"
                          />
                        </div>
                        <div class="col-span-4 font-mono">
                          <input 
                            type="text" 
                            bind:value={item.type} 
                            placeholder={t('itemType')}
                            class="w-full bg-stone-950 border border-stone-800 focus:border-amber-500/50 rounded py-1 px-2 text-[11px] text-amber-500 focus:outline-none"
                          />
                        </div>
                        <div class="col-span-3 flex justify-end">
                          <button 
                            onclick={() => removeItem(sIdx, iIdx)} 
                            class="text-[10px] text-stone-500 hover:text-red-400 transition"
                          >
                            {t('removeItem')}
                          </button>
                        </div>
                      </div>

                      <!-- URL row -->
                      <input 
                        type="text" 
                        bind:value={item.url} 
                        placeholder={t('itemUrl')}
                        class="w-full bg-stone-950 border border-stone-800 focus:border-amber-500/50 rounded py-1 px-2 text-[11px] text-stone-300 font-mono focus:outline-none"
                      />

                      <!-- Description row -->
                      <input 
                        type="text" 
                        bind:value={item.description} 
                        placeholder={t('itemDesc')}
                        class="w-full bg-stone-950 border border-stone-800 focus:border-amber-500/50 rounded py-1 px-2 text-[11px] text-stone-400 focus:outline-none"
                      />

                    </div>
                  {/each}

                  <button 
                    onclick={() => addItem(sIdx)} 
                    class="text-xs text-stone-400 hover:text-stone-200 border border-dashed border-stone-800 hover:border-stone-600 py-1.5 rounded-lg transition text-center"
                  >
                    {t('addItem')}
                  </button>
                </div>
              </div>
            {/each}
          </div>
        </div>

      </div>

      <!-- Output Panel (Raw Text & Preview) -->
      <div class="lg:col-span-5 flex flex-col gap-4">
        <div class="bg-stone-900/40 border border-stone-800 rounded-xl p-5 flex flex-col gap-4 h-full">
          <div class="flex justify-between items-center">
            <span class="text-sm font-semibold text-stone-300">{t('outputLabel')}</span>
            <div class="flex gap-2">
              <button 
                onclick={handleCopy} 
                disabled={!llmsTxtOutput}
                class="text-xs bg-amber-500 hover:bg-amber-400 disabled:bg-stone-850 text-stone-950 font-semibold py-1.5 px-3 rounded-lg transition cursor-pointer disabled:cursor-not-allowed"
              >
                {copied ? t('copied') : t('copyBtn')}
              </button>
              <button 
                onclick={handleDownload} 
                disabled={!llmsTxtOutput}
                class="text-xs bg-stone-800 hover:bg-stone-750 disabled:bg-stone-900 text-stone-200 border border-stone-700 py-1.5 px-3 rounded-lg transition cursor-pointer disabled:cursor-not-allowed"
              >
                {t('downloadBtn')}
              </button>
            </div>
          </div>
          <pre class="w-full flex-1 bg-stone-950 border border-stone-800 rounded-xl p-4 text-xs font-mono text-stone-300 overflow-y-auto leading-relaxed border-l-2 border-l-amber-500 min-h-[300px] lg:min-h-0">{llmsTxtOutput || ''}</pre>
        </div>
      </div>

    </div>

  </div>
</div>
