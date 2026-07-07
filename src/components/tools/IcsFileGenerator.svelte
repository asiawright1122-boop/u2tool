<script lang="ts">
  import {
    generateIcsText,
  } from '../../lib/ics-generator-helper';

  interface Props {
    locale?: string;
    translations?: Record<string, unknown>;
  }

  let { locale = 'en', translations = {} }: Props = $props();

  // Helper to format date into 'YYYY-MM-DDTHH:mm' local string for inputs
  function formatLocalDate(date: Date): string {
    const pad = (n: number) => n.toString().padStart(2, '0');
    const y = date.getFullYear();
    const m = pad(date.getMonth() + 1);
    const d = pad(date.getDate());
    const h = pad(date.getHours());
    const min = pad(date.getMinutes());
    return `${y}-${m}-${d}T${h}:${min}`;
  }

  const defaultStart = new Date();
  defaultStart.setHours(defaultStart.getHours() + 1, 0, 0, 0); // Next hour
  const defaultEnd = new Date(defaultStart);
  defaultEnd.setHours(defaultEnd.getHours() + 1); // 1 hour duration

  let title = $state('');
  let startDate = $state(formatLocalDate(defaultStart));
  let endDate = $state(formatLocalDate(defaultEnd));
  let location = $state('');
  let description = $state('');
  let url = $state('');

  const I18N_BACKUP: Record<string, Record<string, string>> = {
    zh: {
      title: 'ICS 日历事件生成器',
      subtitle: '快速构造符合 RFC 5545 标准的 ICS 日历文件，直接双击导入系统日历',
      eventTitle: '事件标题',
      startDate: '开始时间',
      endDate: '结束时间',
      location: '活动地点 (可选)',
      description: '详细描述 (可选)',
      url: '关联网址 / 链接 (可选)',
      placeholderTitle: '例如: 项目里程碑评审会议',
      placeholderLocation: '例如: 5号会议室 或 Zoom 会议链接',
      placeholderDescription: '例如: 汇报 Phase 49 开发进度，讨论后续发布计划。',
      downloadBtn: '下载 .ics 文件',
      validationTitle: '请输入事件标题',
      validationTime: '结束时间必须晚于开始时间',
      disclaimer: '生成的 .ics 文件支持 Outlook、Apple Calendar、Google Calendar 等各大日历软件直接导入。',
    },
    en: {
      title: 'ICS File Generator',
      subtitle: 'Generate standard iCalendar (.ics) files to easily add events to Outlook, Apple, or Google Calendar',
      eventTitle: 'Event Title',
      startDate: 'Start Date & Time',
      endDate: 'End Date & Time',
      location: 'Location (Optional)',
      description: 'Description (Optional)',
      url: 'Event URL (Optional)',
      placeholderTitle: 'e.g. Project Milestone Review',
      placeholderLocation: 'e.g. Conference Room 5 or Zoom link',
      placeholderDescription: 'e.g. Presenting Phase 49 progress and coordinating next deployment milestones.',
      downloadBtn: 'Download .ics File',
      validationTitle: 'Please enter an event title',
      validationTime: 'End time must be after start time',
      disclaimer: 'The generated .ics files are fully compatible with Outlook, Google Calendar, and Apple Calendar.',
    },
    es: {
      title: 'Generador de Archivos ICS',
      subtitle: 'Cree archivos iCalendar (.ics) estándar para agregar eventos fácilmente a sus calendarios',
      eventTitle: 'Título del Evento',
      startDate: 'Fecha y Hora de Inicio',
      endDate: 'Fecha y Hora de Fin',
      location: 'Ubicación (Opcional)',
      description: 'Descripción (Opcional)',
      url: 'URL del Evento (Opcional)',
      placeholderTitle: 'ej. Revisión de Hito del Proyecto',
      placeholderLocation: 'ej. Sala de reuniones 5 o enlace de Zoom',
      placeholderDescription: 'ej. Presentación de progresos de la Fase 49 y plan de despliegue.',
      downloadBtn: 'Descargar archivo .ics',
      validationTitle: 'Ingrese un título para el evento',
      validationTime: 'La hora de fin debe ser posterior a la de inicio',
      disclaimer: 'Los archivos .ics generados son totalmente compatibles con Outlook, Google Calendar y Apple Calendar.',
    },
    pt: {
      title: 'Gerador de Arquivos ICS',
      subtitle: 'Crie arquivos iCalendar (.ics) padrão para adicionar eventos facilmente ao seu calendário',
      eventTitle: 'Título do Evento',
      startDate: 'Data e Hora de Início',
      endDate: 'Data e Hora de Término',
      location: 'Local (Opcional)',
      description: 'Descrição (Opcional)',
      url: 'URL do Evento (Opcional)',
      placeholderTitle: 'ex. Revisão de Milestone do Projeto',
      placeholderLocation: 'ex. Sala de reuniões 5 ou link do Zoom',
      placeholderDescription: 'ex. Apresentação do progresso da Fase 49 e alinhamento de deploy.',
      downloadBtn: 'Baixar arquivo .ics',
      validationTitle: 'Insira o título do evento',
      validationTime: 'A hora de término deve ser posterior à de início',
      disclaimer: 'Os arquivos .ics gerados são totalmente compatíveis com Outlook, Google Calendar e Apple Calendar.',
    },
    ja: {
      title: 'ICS カレンダーファイル生成ツール',
      subtitle: 'Outlook や Apple Calendar、Google カレンダーに直接登録できる標準 ICS ファイルを作成します',
      eventTitle: 'イベントタイトル',
      startDate: '開始日時',
      endDate: '終了日時',
      location: '開催場所 (任意)',
      description: '詳細説明 (任意)',
      url: '関連URL / リンク (任意)',
      placeholderTitle: '例: プロジェクトマイルストーンレビュー会議',
      placeholderLocation: '例: 第5会議室 または Zoom リンク',
      placeholderDescription: '例: Phase 49 の開発進捗をレビューし、今後のデプロイ計画について相談します。',
      downloadBtn: '.ics ファイルをダウンロード',
      validationTitle: 'イベントタイトルを入力してください',
      validationTime: '終了日時は開始日時よりも後の時間に設定してください',
      disclaimer: '生成された .ics ファイルは、Outlook、Google カレンダー、Apple カレンダーなどの主要なアプリに対応しています。',
    },
    fr: {
      title: 'Générateur de Fichiers ICS',
      subtitle: 'Générez des fichiers iCalendar (.ics) conformes pour ajouter des événements à vos agendas',
      eventTitle: 'Titre de l\'Événement',
      startDate: 'Date & Heure de Début',
      endDate: 'Date & Heure de Fin',
      location: 'Lieu (Optionnel)',
      description: 'Description (Optionnelle)',
      url: 'URL de l\'Événement (Optionnelle)',
      placeholderTitle: 'ex. Revue de Jalon de Projet',
      placeholderLocation: 'ex. Salle de conférence 5 ou lien Zoom',
      placeholderDescription: 'ex. Présentation des progrès de la Phase 49 et planification de la mise en production.',
      downloadBtn: 'Télécharger le fichier .ics',
      validationTitle: 'Veuillez saisir un titre d\'événement',
      validationTime: 'La date de fin doit être postérieure à la date de début',
      disclaimer: 'Les fichiers .ics générés sont compatibles avec Outlook, Google Calendar et Apple Calendar.',
    },
    de: {
      title: 'ICS-Kalenderdatei-Generator',
      subtitle: 'Erstellen Sie standardkonforme iCalendar (.ics) Dateien zum schnellen Importieren',
      eventTitle: 'Ereignistitel',
      startDate: 'Startzeitpunkt',
      endDate: 'Endzeitpunkt',
      location: 'Ort (Optional)',
      description: 'Beschreibung (Optional)',
      url: 'Event-URL (Optional)',
      placeholderTitle: 'z.B. Projekt-Review Meeting',
      placeholderLocation: 'z.B. Besprechungsraum 5 oder Zoom-Link',
      placeholderDescription: 'z.B. Präsentation der Ergebnisse von Phase 49 und Abstimmung des nächsten Deployments.',
      downloadBtn: '.ics Datei herunterladen',
      validationTitle: 'Bitte geben Sie einen Titel ein',
      validationTime: 'Die Endzeit muss nach der Startzeit liegen',
      disclaimer: 'Die erstellten .ics-Dateien sind vollständig kompatibel mit Outlook, Google Calendar und Apple Calendar.',
    },
    ar: {
      title: 'مولد ملفات ICS للتقويم',
      subtitle: 'أنشئ ملفات تقويم قياسية (.ics) لتضيف الفعاليات بسهولة لتقويم Outlook أو Apple أو Google',
      eventTitle: 'عنوان الفعالية',
      startDate: 'تاريخ ووقت البدء',
      endDate: 'تاريخ ووقت الانتهاء',
      location: 'الموقع (اختياري)',
      description: 'الوصف (اختياري)',
      url: 'رابط الفعالية (اختياري)',
      placeholderTitle: 'مثال: اجتماع مراجعة معالم المشروع',
      placeholderLocation: 'مثال: قاعة الاجتماعات رقم 5 أو رابط Zoom',
      placeholderDescription: 'مثال: عرض تقدم العمل في المرحلة 49 وتنسيق خطط الإطلاق القادمة.',
      downloadBtn: 'تحميل ملف .ics',
      validationTitle: 'يرجى إدخال عنوان الفعالية',
      validationTime: 'يجب أن يكون وقت الانتهاء بعد وقت البدء',
      disclaimer: 'الملفات المتولدة متوافقة بالكامل مع تقويمات Outlook وGoogle وApple.',
    },
    ko: {
      title: 'ICS 일정 파일 생성기',
      subtitle: '아웃룩, 구글 캘린더, 애플 캘린더에 바로 등록할 수 있는 표준 ICS 일정을 생성합니다',
      eventTitle: '일정 제목',
      startDate: '시작 시간',
      endDate: '종료 시간',
      location: '장소 (선택)',
      description: '상세 설명 (선택)',
      url: '관련 링크 / URL (선택)',
      placeholderTitle: '예: 프로젝트 마일스톤 검토 회의',
      placeholderLocation: '예: 5층 회의실 또는 Zoom 회의 링크',
      placeholderDescription: '예: Phase 49 개발 진척도를 공유하고 향후 배포 일정을 조율합니다.',
      downloadBtn: '.ics 파일 다운로드',
      validationTitle: '일정 제목을 입력해주세요',
      validationTime: '종료 시간은 시작 시간 이후여야 합니다',
      disclaimer: '생성된 .ics 파일은 아웃룩, 구글 캘린더, 애플 캘린더 등 다양한 일정 관리 소프트웨어와 호환됩니다.',
    },
    ru: {
      title: 'Генератор файлов ICS',
      subtitle: 'Создавайте стандартные файлы iCalendar (.ics) для импорта событий в Outlook, Apple или Google Calendar',
      eventTitle: 'Название события',
      startDate: 'Дата и время начала',
      endDate: 'Дата и время окончания',
      location: 'Место проведения (Опционально)',
      description: 'Описание (Опционально)',
      url: 'Ссылка на событие (Опционально)',
      placeholderTitle: 'например: Обсуждение вех проекта',
      placeholderLocation: 'например: Переговорная 5 или ссылка на Zoom',
      placeholderDescription: 'например: Презентация результатов этапа 49 и координация следующих шагов по развертыванию.',
      downloadBtn: 'Скачать файл .ics',
      validationTitle: 'Введите название события',
      validationTime: 'Время окончания должно быть позже времени начала',
      disclaimer: 'Созданные файлы .ics полностью совместимы с Outlook, Google Calendar и Apple Calendar.',
    },
  };

  const l = $derived(I18N_BACKUP[locale] || I18N_BACKUP['en']);

  let validationError = $state('');

  function triggerDownload() {
    validationError = '';
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      validationError = l.validationTitle;
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (end <= start) {
      validationError = l.validationTime;
      return;
    }

    try {
      const icsText = generateIcsText({
        title: trimmedTitle,
        description: description.trim() || undefined,
        location: location.trim() || undefined,
        startDate: start,
        endDate: end,
        url: url.trim() || undefined,
      });

      const blob = new Blob([icsText], { type: 'text/calendar;charset=utf-8;' });
      const downloadUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      
      // Sanitized filename
      const filename = trimmedTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'event';
      link.setAttribute('download', `${filename}.ics`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(downloadUrl);
    } catch (err: any) {
      validationError = err.message || 'Error generating ICS file';
    }
  }
</script>

<div class="tool-theme-shell p-6 rounded-2xl font-sans min-h-[400px]">
  <!-- Header -->
  <div class="flex items-center gap-3 mb-6">
    <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-700 flex items-center justify-center text-stone-950 font-black text-lg">
      📅
    </div>
    <div>
      <h2 class="font-extrabold text-lg text-amber-700 dark:bg-gradient-to-r dark:from-amber-300 dark:via-amber-100 dark:to-amber-400 dark:bg-clip-text dark:text-transparent leading-tight">
        {l.title}
      </h2>
      <p class="text-stone-500 text-xs mt-0.5">{l.subtitle}</p>
    </div>
  </div>

  <!-- Form & Layout -->
  <div class="max-w-2xl mx-auto space-y-4">
    <!-- Event Title -->
    <label class="block">
      <span class="text-xs text-stone-400 mb-1.5 block">{l.eventTitle} <span class="text-amber-500">*</span></span>
      <input
        type="text"
        bind:value={title}
        placeholder={l.placeholderTitle}
        class="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-2 text-sm text-stone-100 focus:border-amber-500 focus:outline-none transition-colors"
      />
    </label>

    <!-- Dates Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <label class="block">
        <span class="text-xs text-stone-400 mb-1.5 block">{l.startDate} <span class="text-amber-500">*</span></span>
        <input
          type="datetime-local"
          bind:value={startDate}
          class="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-2 text-sm text-stone-100 focus:border-amber-500 focus:outline-none transition-colors"
        />
      </label>

      <label class="block">
        <span class="text-xs text-stone-400 mb-1.5 block">{l.endDate} <span class="text-amber-500">*</span></span>
        <input
          type="datetime-local"
          bind:value={endDate}
          class="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-2 text-sm text-stone-100 focus:border-amber-500 focus:outline-none transition-colors"
        />
      </label>
    </div>

    <!-- Location & URL Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <label class="block">
        <span class="text-xs text-stone-400 mb-1.5 block">{l.location}</span>
        <input
          type="text"
          bind:value={location}
          placeholder={l.placeholderLocation}
          class="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-2 text-sm text-stone-100 focus:border-amber-500 focus:outline-none transition-colors"
        />
      </label>

      <label class="block">
        <span class="text-xs text-stone-400 mb-1.5 block">{l.url}</span>
        <input
          type="url"
          bind:value={url}
          placeholder="https://..."
          class="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-2 text-sm text-stone-100 focus:border-amber-500 focus:outline-none transition-colors"
        />
      </label>
    </div>

    <!-- Description -->
    <label class="block">
      <span class="text-xs text-stone-400 mb-1.5 block">{l.description}</span>
      <textarea
        bind:value={description}
        placeholder={l.placeholderDescription}
        rows="3"
        class="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-2 text-sm text-stone-100 focus:border-amber-500 focus:outline-none transition-colors resize-none"
      ></textarea>
    </label>

    <!-- Validation Error Alert -->
    {#if validationError}
      <div class="bg-red-950/45 border border-red-900/50 rounded-lg p-3 text-xs text-red-400 font-medium">
        ⚠️ {validationError}
      </div>
    {/if}

    <!-- Download Trigger Button -->
    <button
      type="button"
      onclick={triggerDownload}
      class="w-full bg-gradient-to-r from-amber-500 to-amber-700 hover:from-amber-400 hover:to-amber-600 text-stone-950 hover:text-stone-950 text-sm font-bold py-3 px-4 rounded-xl transition-all shadow-lg shadow-amber-900/10 flex items-center justify-center gap-2 mt-4"
    >
      📥 {l.downloadBtn}
    </button>

    <!-- Footer Disclaimer -->
    <div class="text-xxs text-stone-600 pt-6 leading-relaxed text-center">
      {l.disclaimer}
    </div>
  </div>
</div>
