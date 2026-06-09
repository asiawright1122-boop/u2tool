<script lang="ts">
  import { onMount } from 'svelte';
  import {
    Compass,
    Filter,
    Calendar,
    Bell,
    Download,
    Copy,
    Check,
    AlertTriangle,
    Shield,
    Heart,
    Share2,
    CalendarClock,
    Flame,
    Sparkles,
    CheckCircle,
    Info,
    Tv
  } from 'lucide-svelte';
  import scheduleData from '../../lib/data/world-cup-schedule.json';
  import { createTranslator } from '../../lib/translations';

  interface Props {
    locale: string;
    translations: any;
  }
  let props: Props = $props();

  function t(key: string, fallback?: string): string {
    return createTranslator(props.translations, props.locale, 'tools.world-cup-timezone-planner')(key, fallback);
  }

  // IANA timezone mapping configuration
  const TIMEZONES = [
    { id: 'LOCAL', name: 'Browser / Device' },
    { id: 'UTC', name: 'Coordinated Universal Time (UTC)' },
    { id: 'America/New_York', name: 'New York / Eastern (EDT, UTC-4)' },
    { id: 'America/Chicago', name: 'Dallas/Chicago / Central (CDT, UTC-5)' },
    { id: 'America/Denver', name: 'Denver / Mountain (MDT, UTC-6)' },
    { id: 'America/Vancouver', name: 'Vancouver/Seattle / Pacific (PDT, UTC-7)' },
    { id: 'America/Mexico_City', name: 'Mexico City (CST, UTC-6)' },
    { id: 'Europe/London', name: 'London / GMT (BST, UTC+1)' },
    { id: 'Europe/Paris', name: 'Paris / Central European (CEST, UTC+2)' },
    { id: 'Asia/Riyadh', name: 'Riyadh / Arabia Standard (AST, UTC+3)' },
    { id: 'Asia/Shanghai', name: 'Shanghai/Beijing (CST, UTC+8)' },
    { id: 'Asia/Tokyo', name: 'Tokyo (JST, UTC+9)' },
    { id: 'Asia/Seoul', name: 'Seoul (KST, UTC+9)' }
  ];

  // North American Stadium Name Translation Map
  const STADIUM_NAMES: Record<string, string> = {
    MEXICO_CITY: 'Estadio Azteca',
    GUADALAJARA: 'Estadio Akron',
    TORONTO: 'BMO Field',
    SOFI: 'SoFi Stadium',
    KANSAS_CITY: 'Arrowhead Stadium',
    ATLANTA: 'Mercedes-Benz Stadium',
    MIAMI: 'Hard Rock Stadium',
    BOSTON: 'Gillette Stadium',
    NEW_YORK: 'MetLife Stadium',
    PHILADELPHIA: 'Lincoln Financial Field',
    SEATTLE: 'Lumen Field',
    SAN_FRANCISCO: 'Levi\'s Stadium',
    DALLAS: 'AT&T Stadium',
    HOUSTON: 'NRG Stadium',
    MONTERREY: 'Estadio BBVA',
    VANCOUVER: 'BC Place'
  };

  // Localized UI Dictionary (10 Locales)
  const uiTranslations: Record<string, Record<string, string>> = {
    en: {
      timezoneCompassTitle: 'Timezone Sliding Compass',
      filterPanelTitle: 'Match Funnel Filter',
      selectedTeams: 'Favorite Teams',
      hostTeamsOnly: 'Hosts Only',
      hotTeamsOnly: 'Power Giants Only',
      matchStage: 'Match Stage',
      stadiumFilter: 'Host Stadiums & Cities',
      strengthFilter: 'Match Attractiveness',
      resetFilters: 'Reset Filters',
      matchStrengthHot: 'Super Clash 🌟🌟🌟',
      matchStrengthMedium: 'Heavyweight 🌟🌟',
      matchStrengthNormal: 'Regular 🌟',
      survivalIndexTitle: 'Viewing Sleep Survival Index',
      sleepDeprivedRate: 'Sleep Oil Ratio',
      survivalStatus: 'Liver Grade',
      survivalDesc: 'Health Assessment',
      webcalSyncTitle: 'Dynamic System Calendar Sync',
      generateWebcal: 'Generate Webcal Link',
      downloadIcs: 'Download Offline Calendar (.ics)',
      copyLink: 'Copy Sync Link',
      copied: 'Copied!',
      remindBefore: 'Remind Me Before Kick-off',
      remindNone: 'No reminder',
      remind15m: '15 mins',
      remind30m: '30 mins',
      remind1h: '1 hour',
      remind2h: '2 hours',
      remind6h: '6 hours',
      localTime: 'Local Time',
      venueTime: 'Venue Local',
      vs: 'VS',
      groupStage: 'Group Stage',
      knockoutStage: 'Knockout Stage',
      stadium: 'Stadium',
      kickoffTime: 'Kickoff',
      sleepStatusGolden: 'Golden (Evening)',
      sleepStatusMorning: 'Morning Glory',
      sleepStatusMidnight: 'Midnight Oil (Hardcore)',
      allTeams: 'All Teams',
      clearAll: 'Clear All',
      selectAll: 'Select All',
      quickSelect: 'Quick Selector',
      totalMatches: 'Matches',
      liverGradeLegend: 'Liver Rating',
      survivalPosterTitle: 'Viewing Survival Poster',
      teamsSelected: 'Teams Selected',
      stadiumsSelected: 'Stadiums Selected'
    },
    zh: {
      timezoneCompassTitle: '时区滑动罗盘',
      filterPanelTitle: '赛事漏斗过滤器',
      selectedTeams: '支持的国家队',
      hostTeamsOnly: '仅看东道主',
      hotTeamsOnly: '仅看豪门强队',
      matchStage: '赛事阶段',
      stadiumFilter: '举办球场与城市',
      strengthFilter: '观赛看点指数',
      resetFilters: '重置过滤器',
      matchStrengthHot: '强强对话 🌟🌟🌟',
      matchStrengthMedium: '焦点战役 🌟🌟',
      matchStrengthNormal: '常规对决 🌟',
      survivalIndexTitle: '熬夜观赛生存指数分析仪',
      sleepDeprivedRate: '爆肝负荷率',
      survivalStatus: '护肝等级',
      survivalDesc: '健康负荷评估',
      webcalSyncTitle: '动态系统日历一键订阅',
      generateWebcal: '生成 Webcal 订阅链接',
      downloadIcs: '下载离线日历文件 (.ics)',
      copyLink: '复制订阅链接',
      copied: '已复制！',
      remindBefore: '开赛前提醒设置',
      remindNone: '不提醒',
      remind15m: '15 分钟',
      remind30m: '30 分钟',
      remind1h: '1 小时',
      remind2h: '2 小时',
      remind6h: '6 小时',
      localTime: '您的本地时间',
      venueTime: '场馆当地时间',
      vs: 'VS',
      groupStage: '小组赛',
      knockoutStage: '淘汰赛',
      stadium: '球场',
      kickoffTime: '开赛时间',
      sleepStatusGolden: '黄金档 (18-24点)',
      sleepStatusMorning: '晨光档 (6-12点)',
      sleepStatusMidnight: '爆肝档 (0-6点)',
      allTeams: '所有球队',
      clearAll: '清空选择',
      selectAll: '选择全部',
      quickSelect: '快速选择',
      totalMatches: '场比赛',
      liverGradeLegend: '护肝评估',
      survivalPosterTitle: '观赛生存海报',
      teamsSelected: '已选球队',
      stadiumsSelected: '已选场馆'
    },
    es: {
      timezoneCompassTitle: 'Brújula Deslizante de Zona Horaria',
      filterPanelTitle: 'Filtro de Partidos',
      selectedTeams: 'Equipos Favoritos',
      hostTeamsOnly: 'Anfitriones Solamente',
      hotTeamsOnly: 'Solo Gigantes',
      matchStage: 'Etapa del Partido',
      stadiumFilter: 'Estadios y Ciudades Anfitrionas',
      strengthFilter: 'Atractivo del Partido',
      resetFilters: 'Restablecer Filtros',
      matchStrengthHot: 'Súper Choque 🌟🌟🌟',
      matchStrengthMedium: 'Peso Pesado 🌟🌟',
      matchStrengthNormal: 'Regular 🌟',
      survivalIndexTitle: 'Índice de Supervivencia al Sueño',
      sleepDeprivedRate: 'Relación de Trasnocho',
      survivalStatus: 'Grado del Hígado',
      survivalDesc: 'Evaluación de Salud',
      webcalSyncTitle: 'Sincronización Dinámica de Calendario',
      generateWebcal: 'Generar Enlace Webcal',
      downloadIcs: 'Descargar Calendario Offline (.ics)',
      copyLink: 'Copiar Enlace de Sincronización',
      copied: '¡Copiado!',
      remindBefore: 'Recordatorio Antes del Partido',
      remindNone: 'Sin recordatorio',
      remind15m: '15 min',
      remind30m: '30 min',
      remind1h: '1 hora',
      remind2h: '2 horas',
      remind6h: '6 horas',
      localTime: 'Hora Local',
      venueTime: 'Local del Estadio',
      vs: 'VS',
      groupStage: 'Fase de Grupos',
      knockoutStage: 'Fase Eliminatoria',
      stadium: 'Estadio',
      kickoffTime: 'Inicio',
      sleepStatusGolden: 'Dorado (Tarde/Noche)',
      sleepStatusMorning: 'Mañana de Gloria',
      sleepStatusMidnight: 'Trasnocho (Intenso)',
      allTeams: 'Todos los Equipos',
      clearAll: 'Borrar Todo',
      selectAll: 'Seleccionar Todo',
      quickSelect: 'Selector Rápido',
      totalMatches: 'Partidos',
      liverGradeLegend: 'Evaluación de Salud',
      survivalPosterTitle: 'Póster de Supervivencia',
      teamsSelected: 'Equipos Seleccionados',
      stadiumsSelected: 'Estadios Seleccionados'
    },
    pt: {
      timezoneCompassTitle: 'Bússola Deslizante de Fusos Horários',
      filterPanelTitle: 'Filtro de Partidas',
      selectedTeams: 'Seleções Favoritas',
      hostTeamsOnly: 'Apenas Anfitriões',
      hotTeamsOnly: 'Apenas Gigantes',
      matchStage: 'Fase da Partida',
      stadiumFilter: 'Estádios e Cidades-Sede',
      strengthFilter: 'Nível do Confronto',
      resetFilters: 'Redefinir Filtros',
      matchStrengthHot: 'Super Clássico 🌟🌟🌟',
      matchStrengthMedium: 'Peso Pesado 🌟🌟',
      matchStrengthNormal: 'Regular 🌟',
      survivalIndexTitle: 'Índice de Sobrevivência ao Sono',
      sleepDeprivedRate: 'Taxa de Privação de Sono',
      survivalStatus: 'Status do Fígado',
      survivalDesc: 'Avaliação de Saúde',
      webcalSyncTitle: 'Sincronização Dinâmica do Calendário',
      generateWebcal: 'Gerar Link Webcal',
      downloadIcs: 'Baixar Calendário Offline (.ics)',
      copyLink: 'Copiar Link de Sincronização',
      copied: 'Copiado!',
      remindBefore: 'Lembrete Antes do Início',
      remindNone: 'Sem lembrete',
      remind15m: '15 min',
      remind30m: '30 min',
      remind1h: '1 hora',
      remind2h: '2 horas',
      remind6h: '6 horas',
      localTime: 'Hora Local',
      venueTime: 'Local do Estádio',
      vs: 'VS',
      groupStage: 'Fase de Grupos',
      knockoutStage: 'Fase Eliminatória',
      stadium: 'Estádio',
      kickoffTime: 'Início',
      sleepStatusGolden: 'Dourado (Fim de Tarde)',
      sleepStatusMorning: 'Manhã de Glória',
      sleepStatusMidnight: 'Madrugada (Intenso)',
      allTeams: 'Todas as Seleções',
      clearAll: 'Limpar Tudo',
      selectAll: 'Selecionar Tudo',
      quickSelect: 'Seleção Rápida',
      totalMatches: 'Jogos',
      liverGradeLegend: 'Avaliação de Saúde',
      survivalPosterTitle: 'Pôster de Sobrevivência',
      teamsSelected: 'Seleções Selecionadas',
      stadiumsSelected: 'Estádios Selecionados'
    },
    ja: {
      timezoneCompassTitle: '時区（タイムゾーン）スライディングコンパス',
      filterPanelTitle: '試合日程フィルター',
      selectedTeams: '注目チーム',
      hostTeamsOnly: 'ホスト国のみ',
      hotTeamsOnly: '強豪国のみ',
      matchStage: 'ステージ',
      stadiumFilter: '開催都市＆スタジアム',
      strengthFilter: '注目度',
      resetFilters: 'フィルターをリセット',
      matchStrengthHot: '超大物対決 🌟🌟🌟',
      matchStrengthMedium: '要チェック 🌟🌟',
      matchStrengthNormal: 'レギュラー 🌟',
      survivalIndexTitle: '夜更かし観戦生存指数',
      sleepDeprivedRate: '徹夜負荷率',
      survivalStatus: '肝臓防衛レベル',
      survivalDesc: '健康負荷評価',
      webcalSyncTitle: 'ダイナミックカレンダー動的同期',
      generateWebcal: 'Webcal購読リンクを生成',
      downloadIcs: 'オフラインICSをダウンロード',
      copyLink: '同期リンクをコピー',
      copied: 'コピー完了！',
      remindBefore: '試合前アラート通知',
      remindNone: '通知なし',
      remind15m: '15分前',
      remind30m: '30分前',
      remind1h: '1時間前',
      remind2h: '2時間前',
      remind6h: '6時間前',
      localTime: 'あなたの現地時間',
      venueTime: 'スタジアム現地時間',
      vs: 'VS',
      groupStage: 'グループステージ',
      knockoutStage: '決勝トーナメント',
      stadium: 'スタジアム',
      kickoffTime: 'キックオフ',
      sleepStatusGolden: 'ゴールデンタイム (夕方・夜)',
      sleepStatusMorning: 'モーニングスター',
      sleepStatusMidnight: '徹夜観戦（ハードコア）',
      allTeams: 'すべてのチーム',
      clearAll: 'すべてクリア',
      selectAll: 'すべて選択',
      quickSelect: 'クイック選択',
      totalMatches: '試合',
      liverGradeLegend: '健康評価',
      survivalPosterTitle: '夜更かし観戦ポスター',
      teamsSelected: '選択されたチーム',
      stadiumsSelected: '選択されたスタジアム'
    },
    ru: {
      timezoneCompassTitle: 'Компас часовых поясов',
      filterPanelTitle: 'Фильтр матчей',
      selectedTeams: 'Любимые сборные',
      hostTeamsOnly: 'Только хозяева ЧМ',
      hotTeamsOnly: 'Только супергиганты',
      matchStage: 'Этап турнира',
      stadiumFilter: 'Стадионы и города',
      strengthFilter: 'Интерес к матчу',
      resetFilters: 'Сбросить фильтры',
      matchStrengthHot: 'Суперматч 🌟🌟🌟',
      matchStrengthMedium: 'Важный бой 🌟🌟',
      matchStrengthNormal: 'Обычная игра 🌟',
      survivalIndexTitle: 'Индекс выживания при просмотре',
      sleepDeprivedRate: 'Степень бессонницы',
      survivalStatus: 'Оценка печени',
      survivalDesc: 'Оценка влияния на здоровье',
      webcalSyncTitle: 'Динамическая синхронизация календаря',
      generateWebcal: 'Создать ссылку Webcal',
      downloadIcs: 'Скачать файл календаря (.ics)',
      copyLink: 'Скопировать ссылку',
      copied: 'Скопировано!',
      remindBefore: 'Напоминание о матче',
      remindNone: 'Без напоминания',
      remind15m: 'За 15 минут',
      remind30m: 'За 30 минут',
      remind1h: 'За 1 час',
      remind2h: 'За 2 часа',
      remind6h: 'За 6 часов',
      localTime: 'Местное время',
      venueTime: 'Время стадиона',
      vs: 'VS',
      groupStage: 'Групповой этап',
      knockoutStage: 'Плей-офф',
      stadium: 'Стадион',
      kickoffTime: 'Старт',
      sleepStatusGolden: 'Золотое время (Вечер)',
      sleepStatusMorning: 'Утреннее время',
      sleepStatusMidnight: 'Ночное время (Экстрим)',
      allTeams: 'Все команды',
      clearAll: 'Очистить',
      selectAll: 'Выбрать все',
      quickSelect: 'Быстрый выбор',
      totalMatches: 'Матчи',
      liverGradeLegend: 'Рейтинг здоровья',
      survivalPosterTitle: 'Постер выживания',
      teamsSelected: 'Выбрано сборных',
      stadiumsSelected: 'Выбрано стадионов'
    },
    fr: {
      timezoneCompassTitle: 'Boussole des Fuseaux Horaires',
      filterPanelTitle: 'Filtre de Matchs',
      selectedTeams: 'Équipes Favorites',
      hostTeamsOnly: 'Hôtes Uniquement',
      hotTeamsOnly: 'Grands Favoris Uniquement',
      matchStage: 'Étape de Compétition',
      stadiumFilter: 'Stades & Villes Hôtes',
      strengthFilter: 'Intérêt du Match',
      resetFilters: 'Réinitialiser les Filtres',
      matchStrengthHot: 'Choc des Géants 🌟🌟🌟',
      matchStrengthMedium: 'Grande Affiche 🌟🌟',
      matchStrengthNormal: 'Match Standard 🌟',
      survivalIndexTitle: 'Indice de Survie au Sommeil',
      sleepDeprivedRate: 'Ratio de Nuit Blanche',
      survivalStatus: 'Indice Santé Hépatique',
      survivalDesc: 'Évaluation de Santé',
      webcalSyncTitle: 'Synchronisation Calendrier Webcal',
      generateWebcal: 'Générer le Lien Webcal',
      downloadIcs: 'Télécharger le Calendrier (.ics)',
      copyLink: 'Copier le Lien de Synchro',
      copied: 'Copié !',
      remindBefore: 'Rappeler Avant le Match',
      remindNone: 'Pas de rappel',
      remind15m: '15 min',
      remind30m: '30 min',
      remind1h: '1 heure',
      remind2h: '2 heures',
      remind6h: '6 heures',
      localTime: 'Heure Locale',
      venueTime: 'Heure du Stade',
      vs: 'VS',
      groupStage: 'Phase de Groupes',
      knockoutStage: 'Phase Finale',
      stadium: 'Stade',
      kickoffTime: 'Coup d\'envoi',
      sleepStatusGolden: 'Doré (Fin de journée)',
      sleepStatusMorning: 'Matin de Gloire',
      sleepStatusMidnight: 'Nuit Blanche (Extrême)',
      allTeams: 'Toutes les Équipes',
      clearAll: 'Effacer Tout',
      selectAll: 'Tout Sélectionner',
      quickSelect: 'Sélecteur Rapide',
      totalMatches: 'Matchs',
      liverGradeLegend: 'Évaluation Santé',
      survivalPosterTitle: 'Affiche de Survie',
      teamsSelected: 'Équipes Sélectionnées',
      stadiumsSelected: 'Stades Sélectionnés'
    },
    ar: {
      timezoneCompassTitle: 'بوصلة المناطق الزمنية المنزلقة',
      filterPanelTitle: 'فلتر مسار المباريات',
      selectedTeams: 'المنتخبات المفضلة',
      hostTeamsOnly: 'المستضيفون فقط',
      hotTeamsOnly: 'العمالقة فقط',
      matchStage: 'مرحلة البطولة',
      stadiumFilter: 'الملاعب والمدن المستضيفة',
      strengthFilter: 'مستوى جاذبية المباراة',
      resetFilters: 'إعادة ضبط الفلاتر',
      matchStrengthHot: 'مواجهة كبرى 🌟🌟🌟',
      matchStrengthMedium: 'وزن ثقيل 🌟🌟',
      matchStrengthNormal: 'مباراة عادية 🌟',
      survivalIndexTitle: 'مؤشر البقاء عند السهر والترقب',
      sleepDeprivedRate: 'معدل حرمان النوم',
      survivalStatus: 'تقييم صحة الكبد',
      survivalDesc: 'التقييم الصحي',
      webcalSyncTitle: 'مزامنة ديناميكية للتقويم',
      generateWebcal: 'توليد رابط Webcal',
      downloadIcs: 'تنزيل ملف ICS للعمل دون اتصال',
      copyLink: 'نسخ رابط المزامنة',
      copied: 'تم النسخ!',
      remindBefore: 'إعداد تنبيه قبل انطلاق المباراة',
      remindNone: 'بدون تنبيه',
      remind15m: '15 دقيقة',
      remind30m: '30 دقيقة',
      remind1h: 'ساعة واحدة',
      remind2h: 'ساعتان',
      remind6h: '6 ساعات',
      localTime: 'توقيتك المحلي',
      venueTime: 'توقيت الملعب المحلي',
      vs: 'VS',
      groupStage: 'دور المجموعات',
      knockoutStage: 'الأدوار الإقصائية',
      stadium: 'الملعب',
      kickoffTime: 'وقت الانطلاق',
      sleepStatusGolden: 'الفترة الذهبية (مساءً)',
      sleepStatusMorning: 'فترة الصباح',
      sleepStatusMidnight: 'فترة السهر والترهق (شديد)',
      allTeams: 'جميع الفرق',
      clearAll: 'مسح الكل',
      selectAll: 'تحديد الكل',
      quickSelect: 'تحديد سريع',
      totalMatches: 'مباراة',
      liverGradeLegend: 'التقييم الصحي',
      survivalPosterTitle: 'ملصق البقاء على قيد الحياة',
      teamsSelected: 'الفرق المختارة',
      stadiumsSelected: 'الملاعب المختارة'
    },
    de: {
      timezoneCompassTitle: 'Zeitzonen-Schiebekompass',
      filterPanelTitle: 'Turnier-Trichterfilter',
      selectedTeams: 'Lieblingsteams',
      hostTeamsOnly: 'Nur Gastgeber',
      hotTeamsOnly: 'Nur Giganten',
      matchStage: 'Turnierphase',
      stadiumFilter: 'Stadien & Spielorte',
      strengthFilter: 'Spiel-Attraktivität',
      resetFilters: 'Filter zurücksetzen',
      matchStrengthHot: 'Superkracher 🌟🌟🌟',
      matchStrengthMedium: 'Spitzenkampf 🌟🌟',
      matchStrengthNormal: 'Standard-Match 🌟',
      survivalIndexTitle: 'Schlafmangel-Index für Nachtschwärmer',
      sleepDeprivedRate: 'Schlafentzug-Anteil',
      survivalStatus: 'Status der Leber',
      survivalDesc: 'Gesundheitsbewertung',
      webcalSyncTitle: 'Dynamische Kalendersynchronisierung',
      generateWebcal: 'Webcal-Link generieren',
      downloadIcs: 'Offline-Kalender herunterladen (.ics)',
      copyLink: 'Sync-Link kopieren',
      copied: 'Kopiert!',
      remindBefore: 'Erinnerung vor Anpfiff',
      remindNone: 'Keine Erinnerung',
      remind15m: '15 Min',
      remind30m: '30 Min',
      remind1h: '1 Std',
      remind2h: '2 Std',
      remind6h: '6 Std',
      localTime: 'Ihre Ortszeit',
      venueTime: 'Stadion-Ortszeit',
      vs: 'VS',
      groupStage: 'Gruppenphase',
      knockoutStage: 'K.-o.-Phase',
      stadium: 'Stadion',
      kickoffTime: 'Anpfiff',
      sleepStatusGolden: 'Goldene Stunde (Abend)',
      sleepStatusMorning: 'Morgenglanz',
      sleepStatusMidnight: 'Nachtschicht (Extrem)',
      allTeams: 'Alle Teams',
      clearAll: 'Alle löschen',
      selectAll: 'Alle auswählen',
      quickSelect: 'Schnellauswahl',
      totalMatches: 'Spiele',
      liverGradeLegend: 'Leber-Rating',
      survivalPosterTitle: 'Nachtwachen-Poster',
      teamsSelected: 'Ausgewählte Teams',
      stadiumsSelected: 'Ausgewählte Stadien'
    },
    ko: {
      timezoneCompassTitle: '시간대 슬라이딩 컴퍼스',
      filterPanelTitle: '경기 일정 필터링 패널',
      selectedTeams: '관심 국가대표팀',
      hostTeamsOnly: '개최국만 보기',
      hotTeamsOnly: '우승 후보 강호만 보기',
      matchStage: '토너먼트 단계',
      stadiumFilter: '개최 경기장 및 도시',
      strengthFilter: '경기 주목 지수',
      resetFilters: '필터 초기화',
      matchStrengthHot: '빅 매치 격돌 🌟🌟🌟',
      matchStrengthMedium: '주요 관심 경기 🌟🌟',
      matchStrengthNormal: '일반 경기 🌟',
      survivalIndexTitle: '밤샘 관람 수면 생존 지수',
      sleepDeprivedRate: '밤샘 피로 비율',
      survivalStatus: '간 상태 등급',
      survivalDesc: '피로 부하 상태',
      webcalSyncTitle: '원클릭 동적 캘린더 구독',
      generateWebcal: 'Webcal 구독 링크 생성',
      downloadIcs: '오프라인 캘린더 파일 다운로드 (.ics)',
      copyLink: '구독 링크 복사',
      copied: '복사 완료!',
      remindBefore: '경기 시작 전 알림 구성',
      remindNone: '알림 없음',
      remind15m: '15분 전',
      remind30m: '30분 전',
      remind1h: '1시간 전',
      remind2h: '2시간 전',
      remind6h: '6시간 전',
      localTime: '내 로컬 시간',
      venueTime: '경기장 현지 시간',
      vs: 'VS',
      groupStage: '조별리그',
      knockoutStage: '토너먼트',
      stadium: '경기장',
      kickoffTime: '시작 시간',
      sleepStatusGolden: '골든 타임 (저녁/밤)',
      sleepStatusMorning: '아침 영광',
      sleepStatusMidnight: '지옥의 밤샘 (하드코어)',
      allTeams: '모든 팀',
      clearAll: '선택 해제',
      selectAll: '전체 선택',
      quickSelect: '빠른 선택',
      totalMatches: '경기',
      liverGradeLegend: '간 건강 등급',
      survivalPosterTitle: '수면 생존 포스터',
      teamsSelected: '선택된 팀',
      stadiumsSelected: '선택된 경기장'
    }
  };

  const currentUi = $derived(uiTranslations[props.locale] || uiTranslations['en']);

  // Extract metadata dynamically from dataset to guarantee 100% data alignment
  const matches = scheduleData as any[];
  const allTeams = Array.from(
    new Set(matches.flatMap(m => [m.homeTeam, m.awayTeam]).filter(t => t && !t.startsWith('TBA')))
  ).sort();
  const allStadiums = Array.from(new Set(matches.map(m => m.stadium))).sort();

  // Host and Giant classifications
  const HOSTS = ['USA', 'CAN', 'MEX'];
  const GIANTS = ['ARG', 'BRA', 'POR', 'ENG', 'FRA', 'ESP', 'GER', 'ITA', 'NED', 'BEL', 'CRO', 'URU', 'COL', 'MAR'];

  // Svelte 5 States
  let selectedTimezone = $state('LOCAL');
  let selectedTeams = $state<string[]>([]);
  let selectedStadiums = $state<string[]>([]);
  let selectedStages = $state<string[]>(['group', 'knockout']);
  let selectedStrengths = $state<string[]>(['hot', 'medium', 'normal']);
  let alarmMinutes = $state<number>(15);
  let showCopied = $state(false);

  // Auto-detect browser timezone on mount
  onMount(() => {
    try {
      const resolved = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (resolved && TIMEZONES.some(tz => tz.id === resolved)) {
        selectedTimezone = resolved;
      } else if (resolved) {
        // Inject dynamic detected timezone if not in the default list
        TIMEZONES.unshift({ id: resolved, name: `Detected: ${resolved}` });
        selectedTimezone = resolved;
      }
    } catch (e) {
      selectedTimezone = 'UTC';
    }
  });

  // Derived effective timezone ID
  const effectiveTz = $derived(selectedTimezone === 'LOCAL' ? Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC' : selectedTimezone);

  // Helper to extract datetime properties in target timezone
  function getPartsInTz(utcTime: string, tz: string) {
    try {
      const date = new Date(utcTime);
      const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: tz,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
      const parts = formatter.formatToParts(date);
      const partMap: Record<string, string> = {};
      for (const part of parts) {
        partMap[part.type] = part.value;
      }
      return {
        year: partMap.year,
        month: partMap.month,
        day: partMap.day,
        hour: parseInt(partMap.hour, 10),
        minute: partMap.minute,
        fullFormatted: `${partMap.year}-${partMap.month}-${partMap.day} ${partMap.hour}:${partMap.minute}`
      };
    } catch (e) {
      const fallbackDate = new Date(utcTime);
      return {
        year: String(fallbackDate.getUTCFullYear()),
        month: String(fallbackDate.getUTCMonth() + 1).padStart(2, '0'),
        day: String(fallbackDate.getUTCDate()).padStart(2, '0'),
        hour: fallbackDate.getUTCHours(),
        minute: String(fallbackDate.getUTCMinutes()).padStart(2, '0'),
        fullFormatted: fallbackDate.toUTCString()
      };
    }
  }

  // Pre-calculate kickoff safety rating (Liver warning lamp)
  // 18:00 - 24:00 (18 to 23) -> Golden 🟢
  // 06:00 - 12:00 (6 to 11) -> Morning Glory 🟡
  // 00:00 - 06:00 (0 to 5) -> Midnight Oil 🔴
  // Others (12 to 17) -> Neutral/Normal 🔵 (or map to Golden/Morning appropriately)
  function getKickoffOilLevel(hour: number) {
    if (hour >= 18 && hour < 24) {
      return { level: 'golden', color: '#10B981', label: currentUi.sleepStatusGolden };
    } else if (hour >= 6 && hour < 12) {
      return { level: 'morning', color: '#F59E0B', label: currentUi.sleepStatusMorning };
    } else if (hour >= 0 && hour < 6) {
      return { level: 'midnight', color: '#EF4444', label: currentUi.sleepStatusMidnight };
    } else {
      // 12:00 - 18:00 is afternoon, quite golden and healthy!
      return { level: 'golden', color: '#10B981', label: currentUi.sleepStatusGolden };
    }
  }

  // Evaluate match strength by ELO proxy/importance
  // Hot (3 stars) -> Knockouts Finals/Semis, or group clashes between traditional Giants
  // Medium (2 stars) -> Group clashes involving at least one Giant, or other knockouts
  // Normal (1 star) -> Regular group stages
  function getMatchAttractiveness(match: any): 'hot' | 'medium' | 'normal' {
    const isKnockout = match.stage !== 'group';
    const hasGiantsCount = [match.homeTeam, match.awayTeam].filter(t => GIANTS.includes(t)).length;
    
    if ((isKnockout && ['final', 'sf', 'qf'].includes(match.stage)) || (hasGiantsCount === 2)) {
      return 'hot';
    } else if (isKnockout || hasGiantsCount >= 1) {
      return 'medium';
    } else {
      return 'normal';
    }
  }

  // Derived filter implementation
  const filteredMatches = $derived.by(() => {
    return matches.filter(match => {
      // 1. Team Filter
      if (selectedTeams.length > 0) {
        const homeMatch = selectedTeams.includes(match.homeTeam);
        const awayMatch = selectedTeams.includes(match.awayTeam);
        if (!homeMatch && !awayMatch) return false;
      }

      // 2. Stadium/Venue Filter
      if (selectedStadiums.length > 0) {
        if (!selectedStadiums.includes(match.stadium)) return false;
      }

      // 3. Stage Filter
      const isGrp = match.stage === 'group';
      if (selectedStages.length === 1) {
        if (selectedStages.includes('group') && !isGrp) return false;
        if (selectedStages.includes('knockout') && isGrp) return false;
      } else if (selectedStages.length === 0) {
        return false;
      }

      // 4. Match Attractiveness
      const strength = getMatchAttractiveness(match);
      if (!selectedStrengths.includes(strength)) return false;

      return true;
    });
  });

  // Group filtered matches by user-local timezone date to prevent CLS
  const groupedMatches = $derived.by(() => {
    const groups: Record<string, any[]> = {};
    for (const match of filteredMatches) {
      const info = getPartsInTz(match.utcTime, effectiveTz);
      const dateKey = `${info.year}-${info.month}-${info.day}`;
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push({
        ...match,
        localHour: info.hour,
        localMinute: info.minute,
        localDateStr: `${info.month}/${info.day}`,
        localTimeStr: `${String(info.hour).padStart(2, '0')}:${info.minute}`,
        strength: getMatchAttractiveness(match),
        oil: getKickoffOilLevel(info.hour)
      });
    }
    return Object.entries(groups).sort((a, b) => a[0].localeCompare(b[0]));
  });

  // Calculate Viewing Sleep Survival Index
  const survivalData = $derived.by(() => {
    const total = filteredMatches.length;
    if (total === 0) {
      return { total: 0, midnightCount: 0, ratio: 0, grade: 'S', color: '#10B981', tips: 'No match selected.' };
    }

    let midnightCount = 0;
    for (const m of filteredMatches) {
      const info = getPartsInTz(m.utcTime, effectiveTz);
      const oil = getKickoffOilLevel(info.hour);
      if (oil.level === 'midnight') {
        midnightCount++;
      }
    }

    const ratio = Math.round((midnightCount / total) * 100);

    // Humorous Liver Health Ratings (Adapting to CJK character density limitations)
    let grade = 'A';
    let color = '#10B981';
    let tips = '';

    const isCjk = ['zh', 'ja', 'ko'].includes(props.locale);

    if (ratio === 0) {
      grade = isCjk ? '养生神仙' : 'Healthy Sage';
      color = '#10B981';
      tips = isCjk 
        ? '作息完美避开所有深夜地狱档，早睡早起神清气爽！'
        : 'Zero midnight oils! Your biological clock remains perfectly aligned.';
    } else if (ratio < 25) {
      grade = isCjk ? '钢铁养生人' : 'Iron Guard';
      color = '#34D399';
      tips = isCjk
        ? '偶尔熬夜小试身手，备好保温杯和枸杞问题不大。'
        : 'Minor sleep sacrifice. Hydration and light naps will keep you going.';
    } else if (ratio < 50) {
      grade = isCjk ? '爆肝加班汪' : 'Midnight Oil-Dog';
      color = '#F59E0B';
      tips = isCjk
        ? '接近一半比赛在深夜，建议准备好咖啡，合理调休。'
        : 'Moderate liver load. Keep caffeine close and sleep in on weekends.';
    } else if (ratio < 75) {
      grade = isCjk ? '终极肝帝' : 'Liver Emperor';
      color = '#F97316';
      tips = isCjk
        ? '熬夜高达大半，这波属实是拿命看球，保护好头发！'
        : 'Extreme viewing load. Your liver is screaming, prioritize power naps!';
    } else {
      grade = isCjk ? '修仙主宰' : 'Deity of Sleep';
      color = '#EF4444';
      tips = isCjk
        ? '全天候熬夜！建议在被窝和急救中心之间反复横跳。'
        : 'Ascended beyond biological sleep! Seek medical guidance immediately!';
    }

    return {
      total,
      midnightCount,
      ratio,
      grade,
      color,
      tips
    };
  });

  // Webcal Sync URL Builder
  const webcalUrl = $derived.by(() => {
    try {
      const siteUrl = window.location.origin.replace(/^http/, 'webcal');
      const params = new URLSearchParams();
      if (selectedTeams.length > 0) params.set('teams', selectedTeams.join(','));
      if (selectedStadiums.length > 0) params.set('stadiums', selectedStadiums.join(','));
      if (alarmMinutes !== undefined) params.set('alarm', String(alarmMinutes));
      return `${siteUrl}/api/world-cup-calendar.ics?${params.toString()}`;
    } catch (e) {
      return '';
    }
  });

  // Client-side Trigger Dynamic API Endpoint ICS Download
  function handleDownloadIcs() {
    const params = new URLSearchParams();
    if (selectedTeams.length > 0) params.set('teams', selectedTeams.join(','));
    if (selectedStadiums.length > 0) params.set('stadiums', selectedStadiums.join(','));
    if (alarmMinutes !== undefined) params.set('alarm', String(alarmMinutes));
    
    const downloadUrl = `/api/world-cup-calendar.ics?${params.toString()}`;
    window.location.href = downloadUrl;
  }

  function handleCopySyncLink() {
    if (!webcalUrl) return;
    navigator.clipboard.writeText(webcalUrl).then(() => {
      showCopied = true;
      setTimeout(() => {
        showCopied = false;
      }, 3000);
    });
  }

  // Quick Selectors
  function quickSelectTeams(mode: 'all' | 'hosts' | 'giants' | 'clear') {
    if (mode === 'all') {
      selectedTeams = [...allTeams];
    } else if (mode === 'hosts') {
      selectedTeams = [...HOSTS];
    } else if (mode === 'giants') {
      selectedTeams = [...GIANTS];
    } else {
      selectedTeams = [];
    }
  }

  function quickSelectStadiums(mode: 'all' | 'clear') {
    if (mode === 'all') {
      selectedStadiums = [...allStadiums];
    } else {
      selectedStadiums = [];
    }
  }

  const isRtl = $derived(props.locale === 'ar');
</script>

<!-- Dark obsidian gold container -->
<div class="world-cup-timezone-planner-container bg-transparent text-neutral-800 dark:text-neutral-200 rounded-3xl p-6 lg:p-10 shadow-2xl relative font-sans leading-relaxed selection:bg-amber-500/20" dir={isRtl ? 'rtl' : 'ltr'}>
  
  <!-- Premium Header Banner -->
  <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b border-neutral-200 dark:border-neutral-900 pb-8 mb-8">
    <div class="space-y-2">
      <div class="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full text-xs font-mono text-amber-600 dark:text-amber-400">
        <Sparkles class="w-3.5 h-3.5" />
        2026 World Cup Timezone Compass & Webcal Synchronizer
      </div>
      <h2 class="text-3xl font-extrabold text-neutral-900 dark:text-white tracking-tight font-outfit">
        🏆 {t('name') || 'FIFA 2026 Timezone Planner'}
      </h2>
      <p class="text-sm text-neutral-500 dark:text-neutral-400 max-w-3xl">
        {t('detailed_description') || 'Convert times across 4 timezones and subscribe dynamically.'}
      </p>
    </div>
    <div class="flex items-center gap-3">
      <span class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-900 text-xs font-mono text-neutral-500 dark:text-neutral-400 shadow-inner">
        <span class="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></span>
        No Server Tracking
      </span>
    </div>
  </div>

  <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
    
    <!-- LEFT SIDEBAR: CONTROL BAY (5 columns) -->
    <div class="lg:col-span-5 space-y-6">
      
      <!-- 1. TIMEZONE SLIDING COMPASS -->
      <div class="p-6 bg-white/70 dark:bg-neutral-900/40 border border-slate-200 dark:border-neutral-900 rounded-2xl space-y-4">
        <h3 class="text-sm font-semibold text-neutral-900 dark:text-white tracking-wide flex items-center gap-2">
          <Compass class="w-4 h-4 text-[#E5C158]" />
          {currentUi.timezoneCompassTitle}
        </h3>
        
        <div class="space-y-2">
          <select
            id="timezone-select"
            bind:value={selectedTimezone}
            class="w-full px-3.5 py-2.5 bg-white dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 text-neutral-800 dark:text-neutral-200 text-sm rounded-xl focus:outline-none focus:ring-1 focus:ring-[#E5C158]/40"
          >
            {#each TIMEZONES as tz}
              <option value={tz.id}>{tz.name}</option>
            {/each}
          </select>
        </div>
      </div>

      <!-- 2. FUNNEL FILTER CHAMBER -->
      <div class="p-6 bg-white/70 dark:bg-neutral-900/40 border border-slate-200 dark:border-neutral-900 rounded-2xl space-y-6">
        <h3 class="text-sm font-semibold text-neutral-900 dark:text-white tracking-wide border-b border-neutral-200 dark:border-neutral-900 pb-3 flex items-center gap-2">
          <Filter class="w-4 h-4 text-[#E5C158]" />
          {currentUi.filterPanelTitle}
        </h3>

        <!-- Attractiveness Filter -->
        <div class="space-y-2.5">
          <span class="text-xs text-neutral-500 dark:text-neutral-400 block font-medium">{currentUi.strengthFilter}</span>
          <div class="flex flex-wrap gap-2">
            <button
              onclick={() => {
                if (selectedStrengths.includes('hot')) selectedStrengths = selectedStrengths.filter(s => s !== 'hot');
                else selectedStrengths = [...selectedStrengths, 'hot'];
              }}
              class="px-3 py-1.5 text-xs rounded-lg border transition-all font-medium flex items-center gap-1 {selectedStrengths.includes('hot') ? 'bg-amber-500/10 border-amber-500/40 text-amber-600 dark:text-amber-300 btn-filter-active' : 'bg-slate-100 dark:bg-neutral-950 border-slate-200 dark:border-neutral-850 text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white btn-filter-inactive'}"
            >
              {currentUi.matchStrengthHot}
            </button>
            <button
              onclick={() => {
                if (selectedStrengths.includes('medium')) selectedStrengths = selectedStrengths.filter(s => s !== 'medium');
                else selectedStrengths = [...selectedStrengths, 'medium'];
              }}
              class="px-3 py-1.5 text-xs rounded-lg border transition-all font-medium flex items-center gap-1 {selectedStrengths.includes('medium') ? 'bg-amber-500/10 border-amber-500/40 text-amber-600 dark:text-amber-300 btn-filter-active' : 'bg-slate-100 dark:bg-neutral-950 border-slate-200 dark:border-neutral-850 text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white btn-filter-inactive'}"
            >
              {currentUi.matchStrengthMedium}
            </button>
            <button
              onclick={() => {
                if (selectedStrengths.includes('normal')) selectedStrengths = selectedStrengths.filter(s => s !== 'normal');
                else selectedStrengths = [...selectedStrengths, 'normal'];
              }}
              class="px-3 py-1.5 text-xs rounded-lg border transition-all font-medium flex items-center gap-1 {selectedStrengths.includes('normal') ? 'bg-amber-500/10 border-amber-500/40 text-amber-600 dark:text-amber-300 btn-filter-active' : 'bg-slate-100 dark:bg-neutral-950 border-slate-200 dark:border-neutral-850 text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white btn-filter-inactive'}"
            >
              {currentUi.matchStrengthNormal}
            </button>
          </div>
        </div>

        <!-- Stage Filter -->
        <div class="space-y-2.5">
          <span class="text-xs text-neutral-500 dark:text-neutral-400 block font-medium">{currentUi.matchStage}</span>
          <div class="flex gap-2">
            <button
              onclick={() => {
                if (selectedStages.includes('group')) selectedStages = selectedStages.filter(s => s !== 'group');
                else selectedStages = [...selectedStages, 'group'];
              }}
              class="flex-1 px-3 py-1.5 text-xs rounded-lg border text-center transition-all font-medium {selectedStages.includes('group') ? 'bg-amber-500/10 border-amber-500/40 text-amber-600 dark:text-amber-300 btn-filter-active' : 'bg-slate-100 dark:bg-neutral-950 border-slate-200 dark:border-neutral-850 text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white btn-filter-inactive'}"
            >
              ⚽ {currentUi.groupStage}
            </button>
            <button
              onclick={() => {
                if (selectedStages.includes('knockout')) selectedStages = selectedStages.filter(s => s !== 'knockout');
                else selectedStages = [...selectedStages, 'knockout'];
              }}
              class="flex-1 px-3 py-1.5 text-xs rounded-lg border text-center transition-all font-medium {selectedStages.includes('knockout') ? 'bg-amber-500/10 border-amber-500/40 text-amber-600 dark:text-amber-300 btn-filter-active' : 'bg-slate-100 dark:bg-neutral-950 border-slate-200 dark:border-neutral-850 text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white btn-filter-inactive'}"
            >
              🏆 {currentUi.knockoutStage}
            </button>
          </div>
        </div>

        <!-- Teams Filter -->
        <div class="space-y-3">
          <div class="flex justify-between items-center text-xs">
            <span class="text-neutral-500 dark:text-neutral-400 font-medium">{currentUi.selectedTeams} ({selectedTeams.length})</span>
            <div class="flex items-center gap-2 text-[10px] text-neutral-500">
              <button onclick={() => quickSelectTeams('hosts')} class="btn-link hover:text-amber-400 transition-colors">{currentUi.hostTeamsOnly}</button>
              <span>|</span>
              <button onclick={() => quickSelectTeams('giants')} class="btn-link hover:text-amber-400 transition-colors">{currentUi.hotTeamsOnly}</button>
              <span>|</span>
              <button onclick={() => quickSelectTeams('clear')} class="btn-link hover:text-amber-400 transition-colors">{currentUi.clearAll}</button>
            </div>
          </div>
          <div class="grid grid-cols-4 gap-1.5 p-3 bg-white dark:bg-neutral-950/60 border border-slate-200 dark:border-neutral-900 rounded-xl max-h-40 overflow-y-auto font-mono text-[10px]">
            {#each allTeams as team}
              <label class="flex items-center gap-1.5 p-1 rounded hover:bg-slate-100 dark:hover:bg-neutral-900 cursor-pointer text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors">
                <input
                  type="checkbox"
                  value={team}
                  checked={selectedTeams.includes(team)}
                  onchange={(e) => {
                    const cb = e.target as HTMLInputElement;
                    if (cb.checked) selectedTeams = [...selectedTeams, team];
                    else selectedTeams = selectedTeams.filter(t => t !== team);
                  }}
                  class="rounded border-slate-300 dark:border-neutral-800 text-amber-500 focus:ring-0 focus:ring-offset-0 accent-amber-500 w-3 h-3"
                />
                {team}
              </label>
            {/each}
          </div>
        </div>

        <!-- Stadium Filter -->
        <div class="space-y-3">
          <div class="flex justify-between items-center text-xs">
            <span class="text-neutral-500 dark:text-neutral-400 font-medium">{currentUi.stadiumFilter} ({selectedStadiums.length})</span>
            <div class="flex items-center gap-2 text-[10px] text-neutral-500">
              <button onclick={() => quickSelectStadiums('all')} class="btn-link hover:text-amber-400 transition-colors">{currentUi.selectAll}</button>
              <span>|</span>
              <button onclick={() => quickSelectStadiums('clear')} class="btn-link hover:text-amber-400 transition-colors">{currentUi.clearAll}</button>
            </div>
          </div>
          <div class="grid grid-cols-2 gap-1.5 p-3 bg-white dark:bg-neutral-950/60 border border-slate-200 dark:border-neutral-900 rounded-xl max-h-40 overflow-y-auto text-[10px]">
            {#each allStadiums as stad}
              <label class="flex items-center gap-1.5 p-1 rounded hover:bg-slate-100 dark:hover:bg-neutral-900 cursor-pointer text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors">
                <input
                  type="checkbox"
                  value={stad}
                  checked={selectedStadiums.includes(stad)}
                  onchange={(e) => {
                    const cb = e.target as HTMLInputElement;
                    if (cb.checked) selectedStadiums = [...selectedStadiums, stad];
                    else selectedStadiums = selectedStadiums.filter(s => s !== stad);
                  }}
                  class="rounded border-slate-300 dark:border-neutral-800 text-amber-500 focus:ring-0 focus:ring-offset-0 accent-amber-500 w-3 h-3"
                />
                <span class="truncate" title={STADIUM_NAMES[stad] || stad}>{STADIUM_NAMES[stad] || stad}</span>
              </label>
            {/each}
          </div>
        </div>
      </div>

      <!-- 3. CALENDAR CONFIGURATION CHAMBER -->
      <div class="p-6 bg-white/70 dark:bg-neutral-900/40 border border-slate-200 dark:border-neutral-900 rounded-2xl space-y-6">
        <h3 class="text-sm font-semibold text-neutral-900 dark:text-white tracking-wide border-b border-neutral-200 dark:border-neutral-900 pb-3 flex items-center gap-2">
          <CalendarClock class="w-4 h-4 text-[#E5C158]" />
          {currentUi.webcalSyncTitle}
        </h3>

        <!-- Reminder Offset Selector -->
        <div class="space-y-2 text-xs">
          <label for="alarm-select" class="text-neutral-500 dark:text-neutral-400 block font-medium flex items-center gap-1.5">
            <Bell class="w-3.5 h-3.5 text-amber-500" />
            {currentUi.remindBefore}
          </label>
          <select
            id="alarm-select"
            bind:value={alarmMinutes}
            class="w-full px-3.5 py-2.5 bg-white dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 text-neutral-800 dark:text-neutral-200 rounded-xl focus:outline-none"
          >
            <option value={undefined}>{currentUi.remindNone}</option>
            <option value={15}>{currentUi.remind15m}</option>
            <option value={30}>{currentUi.remind30m}</option>
            <option value={60}>{currentUi.remind1h}</option>
            <option value={120}>{currentUi.remind2h}</option>
            <option value={360}>{currentUi.remind6h}</option>
          </select>
        </div>

        <div class="flex flex-col gap-3 pt-2">
          <!-- Webcal Sync Button -->
          <button
            onclick={handleCopySyncLink}
            class="btn-sync w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-[#E5C158] hover:bg-[#C59B27] text-neutral-950 font-extrabold text-sm rounded-xl transition-all shadow-lg active:scale-95"
          >
            {#if showCopied}
              <Check class="w-4 h-4" />
              {currentUi.copied}
            {:else}
              <Copy class="w-4 h-4" />
              {currentUi.copyLink}
            {/if}
          </button>

          <!-- ICS Download Button -->
          <button
            onclick={handleDownloadIcs}
            class="btn-download w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-white hover:bg-slate-100 dark:bg-neutral-950 dark:hover:bg-neutral-900 border border-slate-200 dark:border-neutral-800 text-neutral-850 dark:text-neutral-200 font-bold text-sm rounded-xl transition-all"
          >
            <Download class="w-4 h-4" />
            {currentUi.downloadIcs}
          </button>
        </div>
      </div>

    </div>

    <!-- RIGHT CONTENT: STATS & MATCH STREAM (7 columns) -->
    <div class="lg:col-span-7 space-y-6">
      
      <!-- 1. SLEEP SURVIVAL INDEX DASHBOARD -->
      <div class="p-6 bg-white/70 dark:bg-neutral-900/40 border border-slate-200 dark:border-neutral-900 rounded-2xl">
        <h3 class="text-sm font-semibold text-neutral-900 dark:text-white tracking-wide border-b border-slate-200 dark:border-neutral-900 pb-3 flex items-center gap-2 mb-6">
          <Flame class="w-4 h-4 text-red-500 animate-pulse" />
          {currentUi.survivalIndexTitle}
        </h3>

        <div class="flex flex-col md:flex-row items-center gap-8">
          <!-- Mini SVG Dial (Custom Ring Chart) -->
          <div class="relative w-32 h-32 flex-shrink-0">
            <svg class="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="transparent"
                class="stroke-slate-100 dark:stroke-neutral-800/80"
                stroke-width="10"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="transparent"
                stroke={survivalData.color}
                stroke-width="10"
                stroke-dasharray="251.2"
                stroke-dashoffset={251.2 - (251.2 * survivalData.ratio) / 100}
                stroke-linecap="round"
                class="transition-all duration-700 ease-out"
              />
            </svg>
            <div class="absolute inset-0 flex flex-col items-center justify-center">
              <span class="text-2xl font-black text-neutral-900 dark:text-white font-mono">{survivalData.ratio}%</span>
              <span class="text-[10px] text-neutral-500 uppercase tracking-widest">{currentUi.sleepDeprivedRate}</span>
            </div>
          </div>

          <!-- Description and Tips -->
          <div class="space-y-3 flex-1 text-center md:text-left">
            <div class="flex flex-col md:flex-row items-center md:items-baseline gap-2">
              <span class="text-xs text-neutral-500 dark:text-neutral-400 font-medium">{currentUi.survivalStatus}:</span>
              <span class="text-lg font-black tracking-wide" style="color: {survivalData.color}">
                {survivalData.grade}
              </span>
              <span class="text-[10px] text-neutral-500 font-mono">
                ({survivalData.midnightCount} / {survivalData.total} {currentUi.totalMatches})
              </span>
            </div>
            
            <div class="p-3 bg-slate-50 dark:bg-neutral-950/60 border border-slate-200 dark:border-neutral-900 rounded-xl text-xs text-neutral-700 dark:text-neutral-300">
              <span class="font-bold block text-neutral-900 dark:text-white mb-1 flex items-center justify-center md:justify-start gap-1">
                <AlertTriangle class="w-3.5 h-3.5 text-amber-550" />
                {currentUi.survivalDesc}
              </span>
              {survivalData.tips}
            </div>
          </div>
        </div>
        
        <!-- FUN PERSONALIZED POSTER CONTAINER -->
        <div class="mt-6 p-4 border border-dashed border-slate-300 dark:border-neutral-800 rounded-xl bg-slate-50/20 dark:bg-neutral-950/20 text-center relative group overflow-hidden">
          <div class="absolute -inset-x-4 -inset-y-4 bg-gradient-to-r from-amber-500/5 to-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none duration-500"></div>
          <div class="relative space-y-3">
            <h4 class="text-xs font-bold text-neutral-900 dark:text-white flex items-center justify-center gap-1">
              <Heart class="w-3.5 h-3.5 text-red-400" />
              {currentUi.survivalPosterTitle}
            </h4>
            <div class="inline-grid grid-cols-2 md:grid-cols-4 gap-4 p-3 bg-white dark:bg-neutral-950 rounded-lg text-[10px] text-neutral-500 dark:text-neutral-400 border border-slate-200 dark:border-neutral-900 shadow-sm">
              <div>
                <span class="block font-mono text-xs text-neutral-900 dark:text-white font-bold">{groupedMatches.length}d</span>
                <span>{currentUi.totalMatches}</span>
              </div>
              <div>
                <span class="block font-mono text-xs text-neutral-900 dark:text-white font-bold">{selectedTeams.length === 0 ? 'All' : selectedTeams.length}</span>
                <span>{currentUi.teamsSelected}</span>
              </div>
              <div>
                <span class="block font-mono text-xs text-neutral-900 dark:text-white font-bold">{selectedStadiums.length === 0 ? 'All' : selectedStadiums.length}</span>
                <span>{currentUi.stadiumsSelected}</span>
              </div>
              <div>
                <span class="block font-mono text-xs font-bold" style="color: {survivalData.color}">{survivalData.grade}</span>
                <span>{currentUi.liverGradeLegend}</span>
              </div>
            </div>
            <p class="text-[10px] text-neutral-500">
              💡 Tip: Take a screenshot of this section to share your tournament liver burden index with other fans!
            </p>
          </div>
        </div>

      </div>

      <!-- 2. STREAMING MATCH CARDS -->
      <div class="space-y-4">
        {#if groupedMatches.length === 0}
          <div class="p-12 bg-slate-50/50 dark:bg-neutral-900/10 border border-slate-300 dark:border-neutral-900 border-dashed rounded-2xl text-center text-neutral-500 space-y-3">
            <AlertTriangle class="w-8 h-8 mx-auto text-neutral-400 dark:text-neutral-600" />
            <p class="text-sm font-medium">{t('noResults') || 'No matches match your filter criteria.'}</p>
            <button
              onclick={() => {
                selectedTeams = [];
                selectedStadiums = [];
                selectedStages = ['group', 'knockout'];
                selectedStrengths = ['hot', 'medium', 'normal'];
              }}
              class="btn-reset px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-neutral-900 dark:hover:bg-neutral-850 text-xs font-bold rounded-lg border border-slate-200 dark:border-neutral-800 text-neutral-800 dark:text-neutral-300 transition-colors"
            >
              {currentUi.resetFilters}
            </button>
          </div>
        {:else}
          {#each groupedMatches as [dateKey, dayMatches]}
            <div class="space-y-2">
              <!-- Sticky Date Header -->
              <h4 class="text-xs font-black text-amber-600 dark:text-amber-500 font-mono tracking-wider sticky top-0 py-2 bg-white/95 dark:bg-[#070707]/95 backdrop-blur-md z-10 flex items-center gap-1.5 border-b border-slate-200 dark:border-neutral-900/60">
                <Calendar class="w-3.5 h-3.5" />
                {dateKey}
              </h4>

              <div class="grid gap-2">
                {#each dayMatches as match}
                  <!-- Match Obsidian Card -->
                  <div class="p-4 bg-white/70 dark:bg-neutral-900/20 border border-slate-250/70 dark:border-neutral-900/80 rounded-xl hover:border-slate-350 dark:hover:border-neutral-800/80 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 relative group shadow-sm">
                    <div class="space-y-2 flex-1">
                      <!-- Stage and Stadium label -->
                      <div class="flex items-center gap-2 text-[10px] text-neutral-500 font-mono">
                        <span class="px-1.5 py-0.5 bg-slate-100 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-850 rounded text-neutral-600 dark:text-neutral-400">
                          {match.stage === 'group' ? `${currentUi.groupStage} ${match.group || ''}` : `${currentUi.knockoutStage} R${match.stage === 'r32' ? '32' : match.stage === 'r16' ? '16' : match.stage.toUpperCase()}`}
                        </span>
                        <span>•</span>
                        <span class="truncate" title={STADIUM_NAMES[match.stadium] || match.stadium}>
                          📍 {match.venueCity} ({STADIUM_NAMES[match.stadium] || match.stadium})
                        </span>
                      </div>

                      <!-- Duel detail -->
                      <div class="flex items-center gap-3 text-sm font-bold text-neutral-900 dark:text-white">
                        <span class="w-12 text-left font-mono">{match.homeTeam.startsWith('TBA') ? match.homePlaceholder : match.homeTeam}</span>
                        <span class="text-xs text-neutral-500 font-normal">{currentUi.vs}</span>
                        <span class="w-12 text-left font-mono">{match.awayTeam.startsWith('TBA') ? match.awayPlaceholder : match.awayTeam}</span>
                        
                        <!-- Watch star ELO proxy -->
                        <span class="text-[10px] text-amber-550 flex items-center font-normal ml-2">
                          {#if match.strength === 'hot'}
                            🔥 🌟🌟🌟
                          {:else if match.strength === 'medium'}
                            🌟🌟
                          {:else}
                            🌟
                          {/if}
                        </span>
                      </div>
                    </div>

                    <!-- Timings and Sleep rating status -->
                    <div class="flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 border-slate-100 dark:border-neutral-900/60 pt-3 md:pt-0">
                      <!-- Live times -->
                      <div class="text-right flex flex-col justify-center">
                        <span class="text-sm font-black text-neutral-950 dark:text-white font-mono flex items-center gap-1.5 justify-end">
                          <CalendarClock class="w-3.5 h-3.5 text-neutral-400 dark:text-neutral-500" />
                          {match.localTimeStr}
                        </span>
                        <span class="text-[10px] text-neutral-500">{currentUi.localTime}</span>
                      </div>

                      <!-- Liver warning breathing status light -->
                      <div class="flex items-center gap-2">
                        <div class="w-2.5 h-2.5 rounded-full animate-pulse shadow-lg" style="background-color: {match.oil.color}; box-shadow: 0 0 8px {match.oil.color}"></div>
                        <span class="text-xs font-medium text-neutral-700 dark:text-neutral-300 min-w-16 text-right" style="color: {match.oil.color}">
                          {match.oil.label}
                        </span>
                      </div>
                    </div>
                  </div>
                {/each}
              </div>
            </div>
          {/each}
        {/if}
      </div>

    </div>

  </div>

</div>

<style>
  /* 基础通用定义 */
  .world-cup-timezone-planner-container :global(button),
  .world-cup-timezone-planner-container :global(select),
  .world-cup-timezone-planner-container :global(input),
  .world-cup-timezone-planner-container :global(option) {
    font-family: inherit;
  }

  .world-cup-timezone-planner-container :global(button) {
    box-shadow: none !important;
  }

  /* ================= 浅色模式 (Light Theme) ================= */
  .world-cup-timezone-planner-container :global(select) {
    background-color: #ffffff !important;
    color: #1e293b !important;
    border-color: #e2e8f0 !important;
  }

  .world-cup-timezone-planner-container :global(select:focus) {
    border-color: #d97706 !important;
    outline: none !important;
    box-shadow: 0 0 0 1px rgba(217, 119, 6, 0.4) !important;
  }

  .world-cup-timezone-planner-container :global(option) {
    background-color: #ffffff !important;
    color: #1e293b !important;
  }

  .world-cup-timezone-planner-container :global(input[type="checkbox"]) {
    background-color: #ffffff !important;
    border-color: #cbd5e1 !important;
    color: #d97706 !important;
  }

  .world-cup-timezone-planner-container :global(.btn-filter-active) {
    background-color: rgba(217, 119, 6, 0.08) !important;
    border-color: rgba(217, 119, 6, 0.4) !important;
    color: #b45309 !important;
  }

  .world-cup-timezone-planner-container :global(.btn-filter-inactive) {
    background-color: #f8fafc !important;
    border-color: #e2e8f0 !important;
    color: #64748b !important;
  }

  .world-cup-timezone-planner-container :global(.btn-filter-inactive:hover) {
    color: #0f172a !important;
    background-color: #f1f5f9 !important;
  }

  .world-cup-timezone-planner-container :global(.btn-link) {
    background: none !important;
    border: none !important;
    padding: 0 !important;
    color: #64748b !important;
  }
  .world-cup-timezone-planner-container :global(.btn-link:hover) {
    color: #d97706 !important;
  }

  .world-cup-timezone-planner-container :global(.btn-sync) {
    background-color: #d97706 !important;
    color: #ffffff !important;
    border: none !important;
  }
  .world-cup-timezone-planner-container :global(.btn-sync:hover) {
    background-color: #b45309 !important;
  }

  .world-cup-timezone-planner-container :global(.btn-download) {
    background-color: #ffffff !important;
    color: #1e293b !important;
    border: 1px solid #e2e8f0 !important;
  }
  .world-cup-timezone-planner-container :global(.btn-download:hover) {
    background-color: #f8fafc !important;
  }

  .world-cup-timezone-planner-container :global(.btn-reset) {
    background-color: #f1f5f9 !important;
    color: #334155 !important;
    border: 1px solid #e2e8f0 !important;
  }
  .world-cup-timezone-planner-container :global(.btn-reset:hover) {
    background-color: #e2e8f0 !important;
  }

  /* ================= 深色模式 (Dark Theme - 曜石暗金) ================= */
  :global(.dark) .world-cup-timezone-planner-container :global(select) {
    background-color: #0a0a0a !important;
    color: #e5e5e5 !important;
    border-color: #262626 !important;
  }

  :global(.dark) .world-cup-timezone-planner-container :global(select:focus) {
    border-color: #e5c158 !important;
    outline: none !important;
    box-shadow: 0 0 0 1px rgba(229, 193, 88, 0.4) !important;
  }

  :global(.dark) .world-cup-timezone-planner-container :global(option) {
    background-color: #0a0a0a !important;
    color: #e5e5e5 !important;
  }

  :global(.dark) .world-cup-timezone-planner-container :global(input[type="checkbox"]) {
    background-color: #0a0a0a !important;
    border-color: #262626 !important;
    color: #f59e0b !important;
  }

  :global(.dark) .world-cup-timezone-planner-container :global(.btn-filter-active) {
    background-color: rgba(245, 158, 11, 0.1) !important;
    border-color: rgba(245, 158, 11, 0.4) !important;
    color: #fcd34d !important;
  }

  :global(.dark) .world-cup-timezone-planner-container :global(.btn-filter-inactive) {
    background-color: #0a0a0a !important;
    border-color: #262626 !important;
    color: #a3a3a3 !important;
  }

  :global(.dark) .world-cup-timezone-planner-container :global(.btn-filter-inactive:hover) {
    color: #ffffff !important;
    background-color: #171717 !important;
  }

  :global(.dark) .world-cup-timezone-planner-container :global(.btn-link) {
    color: #737373 !important;
  }
  :global(.dark) .world-cup-timezone-planner-container :global(.btn-link:hover) {
    color: #fbbf24 !important;
  }

  :global(.dark) .world-cup-timezone-planner-container :global(.btn-sync) {
    background-color: #e5c158 !important;
    color: #0a0a0a !important;
  }
  :global(.dark) .world-cup-timezone-planner-container :global(.btn-sync:hover) {
    background-color: #c59b27 !important;
  }

  :global(.dark) .world-cup-timezone-planner-container :global(.btn-download) {
    background-color: #0a0a0a !important;
    color: #e5e5e5 !important;
    border: 1px solid #262626 !important;
  }
  :global(.dark) .world-cup-timezone-planner-container :global(.btn-download:hover) {
    background-color: #171717 !important;
  }

  :global(.dark) .world-cup-timezone-planner-container :global(.btn-reset) {
    background-color: #171717 !important;
    color: #d4d4d4 !important;
    border: 1px solid #262626 !important;
  }
  :global(.dark) .world-cup-timezone-planner-container :global(.btn-reset:hover) {
    background-color: #262626 !important;
  }
</style>
