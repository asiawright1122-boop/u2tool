<script lang="ts">
  import { auditHeaders } from '../../lib/security-headers-audit';

  interface Props {
    locale?: string;
    translations?: Record<string, unknown>;
  }

  let { locale = 'en', translations = {} }: Props = $props();

  const I18N_BACKUP: Record<string, Record<string, string>> = {
    zh: {
      title: 'HTTP 安全响应头检测',
      subtitle: '分析您的网站 HTTP 响应头，检测各类安全防御机制并评估安全评级',
      inputLabel: '粘贴 HTTP 响应头',
      inputPlaceholder: '在此粘贴原始响应头文本，例如:\nHTTP/2 200 OK\ncontent-type: text/html\ncontent-security-policy: default-src \'self\'',
      btnAudit: '开始审计',
      outputLabel: '审计结果报告',
      gradeLabel: '安全等级',
      scoreLabel: '安全得分',
      noData: '暂无分析数据，请在左侧粘贴响应头进行检测。',
      warningsTitle: '安全漏洞与警告',
      missingTitle: '缺失的安全头部',
      presentTitle: '配置正确的头部',
      presetsTitle: '测试样本',
      presetSecure: '优秀配置示例 (A+)',
      presetWeak: '中等/弱配置示例 (C)',
      presetNone: '无防护配置示例 (F)',
      howToFix: '如何修复？',
      nginx: 'Nginx 修复代码',
      apache: 'Apache 修复代码',
      copied: '✓ 已复制!',
      copyBtn: '复制配置',
      clearBtn: '清空'
    },
    en: {
      title: 'Security Headers Checker',
      subtitle: 'Analyze your HTTP response headers to audit safety measures and calculate your security grade',
      inputLabel: 'Paste HTTP Response Headers',
      inputPlaceholder: 'Paste raw response headers here, e.g.:\nHTTP/2 200 OK\ncontent-type: text/html\ncontent-security-policy: default-src \'self\'',
      btnAudit: 'Audit Headers',
      outputLabel: 'Audit Report',
      gradeLabel: 'Security Grade',
      scoreLabel: 'Security Score',
      noData: 'No audit data. Paste your headers on the left and run check.',
      warningsTitle: 'Security Warnings',
      missingTitle: 'Missing Security Headers',
      presentTitle: 'Properly Configured Headers',
      presetsTitle: 'Test Presets',
      presetSecure: 'Secure Config Example (A+)',
      presetWeak: 'Weak Config Example (C)',
      presetNone: 'Insecure Config Example (F)',
      howToFix: 'How to Fix?',
      nginx: 'Nginx Configuration',
      apache: 'Apache Configuration',
      copied: '✓ Copied!',
      copyBtn: 'Copy Config',
      clearBtn: 'Clear'
    },
    es: {
      title: 'Auditor de Cabeceras de Seguridad',
      subtitle: 'Analice sus cabeceras de respuesta HTTP para auditar medidas de seguridad y calcular su calificación',
      inputLabel: 'Pegue las Cabeceras de Respuesta HTTP',
      inputPlaceholder: 'Pegue las cabeceras HTTP crudas aquí, ej.:\nHTTP/2 200 OK\ncontent-security-policy: default-src \'self\'',
      btnAudit: 'Auditar Cabeceras',
      outputLabel: 'Reporte de Auditoría',
      gradeLabel: 'Calificación de Seguridad',
      scoreLabel: 'Puntuación de Seguridad',
      noData: 'Sin datos. Pegue sus cabeceras a la izquierda para comenzar.',
      warningsTitle: 'Advertencias de Seguridad',
      missingTitle: 'Cabeceras de Seguridad Faltantes',
      presentTitle: 'Cabeceras Configuradas Correctamente',
      presetsTitle: 'Plantillas de Prueba',
      presetSecure: 'Ejemplo Seguro (A+)',
      presetWeak: 'Ejemplo Débil (C)',
      presetNone: 'Ejemplo Inseguro (F)',
      howToFix: '¿Cómo solucionarlo?',
      nginx: 'Configuración Nginx',
      apache: 'Configuración Apache',
      copied: '✓ ¡Copiado!',
      copyBtn: 'Copiar Config',
      clearBtn: 'Limpiar'
    },
    pt: {
      title: 'Verificador de Cabeçalhos de Segurança',
      subtitle: 'Analise os cabeçalhos de resposta HTTP para verificar as medidas de segurança e obter uma classificação',
      inputLabel: 'Cole os Cabeçalhos de Resposta HTTP',
      inputPlaceholder: 'Cole os cabeçalhos HTTP brutos aqui, ex.:\nHTTP/2 200 OK\ncontent-security-policy: default-src \'self\'',
      btnAudit: 'Auditar Cabeçalhos',
      outputLabel: 'Relatório de Auditoria',
      gradeLabel: 'Grau de Segurança',
      scoreLabel: 'Pontuação de Segurança',
      noData: 'Nenhum dado. Cole os cabeçalhos à esquerda para auditar.',
      warningsTitle: 'Avisos de Segurança',
      missingTitle: 'Cabeçalhos de Segurança Ausentes',
      presentTitle: 'Cabeçalhos Configurados Corretamente',
      presetsTitle: 'Modelos de Teste',
      presetSecure: 'Exemplo Seguro (A+)',
      presetWeak: 'Exemplo Fraco (C)',
      presetNone: 'Exemplo Inseguro (F)',
      howToFix: 'Como corrigir?',
      nginx: 'Configuração Nginx',
      apache: 'Configuração Apache',
      copied: '✓ Copiado!',
      copyBtn: 'Copiar Config',
      clearBtn: 'Limpar'
    },
    ja: {
      title: 'セキュリティヘッダーチェッカー',
      subtitle: 'HTTPレスポンスヘッダーを分析して、セキュリティ対策を監査し、安全性評価を計算します',
      inputLabel: 'HTTPレスポンスヘッダーを貼り付け',
      inputPlaceholder: '生のレスポンスヘッダーをここに貼り付けます。例:\nHTTP/2 200 OK\ncontent-security-policy: default-src \'self\'',
      btnAudit: 'ヘッダーを監査',
      outputLabel: '監査レポート',
      gradeLabel: 'セキュリティ評価',
      scoreLabel: 'セキュリティスコア',
      noData: '監査データがありません。左側にヘッダーを貼り付けて監査を実行してください。',
      warningsTitle: 'セキュリティ警告',
      missingTitle: '不足しているセキュリティヘッダー',
      presentTitle: '正しく設定されているヘッダー',
      presetsTitle: 'テストプリセット',
      presetSecure: '安全な構成例 (A+)',
      presetWeak: '弱い構成例 (C)',
      presetNone: '危険な構成例 (F)',
      howToFix: '修正方法は？',
      nginx: 'Nginx の設定',
      apache: 'Apache の設定',
      copied: '✓ コピーしました!',
      copyBtn: '設定をコピー',
      clearBtn: 'クリア'
    },
    fr: {
      title: 'Vérificateur d\'En-têtes de Sécurité',
      subtitle: 'Analysez vos en-têtes de réponse HTTP pour auditer les mesures de sécurité et obtenir une note',
      inputLabel: 'Collez les En-têtes de Réponse HTTP',
      inputPlaceholder: 'Collez les en-têtes HTTP bruts ici, ex. :\nHTTP/2 200 OK\ncontent-security-policy: default-src \'self\'',
      btnAudit: 'Auditer les En-têtes',
      outputLabel: 'Rapport d\'Audition',
      gradeLabel: 'Note de Sécurité',
      scoreLabel: 'Score de Sécurité',
      noData: 'Aucune donnée. Collez vos en-têtes à gauche pour commencer.',
      warningsTitle: 'Avertissements de Sécurité',
      missingTitle: 'En-têtes de Sécurité Manquants',
      presentTitle: 'En-têtes Correctement Configurés',
      presetsTitle: 'Préréglages de Test',
      presetSecure: 'Exemple Sécurisé (A+)',
      presetWeak: 'Exemple Faible (C)',
      presetNone: 'Exemple Insecure (F)',
      howToFix: 'Comment corriger ?',
      nginx: 'Configuration Nginx',
      apache: 'Configuration Apache',
      copied: '✓ Copié !',
      copyBtn: 'Copier Config',
      clearBtn: 'Effacer'
    },
    de: {
      title: 'Sicherheits-Header-Prüfer',
      subtitle: 'Analysieren Sie HTTP-Antwort-Header, um Sicherheitsmaßnahmen zu prüfen und Ihre Sicherheitsstufe zu berechnen',
      inputLabel: 'HTTP-Antwort-Header einfügen',
      inputPlaceholder: 'Rohdaten der HTTP-Header hier einfügen, z.B.:\nHTTP/2 200 OK\ncontent-security-policy: default-src \'self\'',
      btnAudit: 'Header prüfen',
      outputLabel: 'Prüfbericht',
      gradeLabel: 'Sicherheitsstufe',
      scoreLabel: 'Sicherheitspunkte',
      noData: 'Keine Daten vorhanden. Fügen Sie die Header auf der linken Seite ein.',
      warningsTitle: 'Sicherheitswarnungen',
      missingTitle: 'Fehlende Sicherheitsheader',
      presentTitle: 'Richtig konfigurierte Header',
      presetsTitle: 'Test-Vorlagen',
      presetSecure: 'Sicheres Beispiel (A+)',
      presetWeak: 'Schwaches Beispiel (C)',
      presetNone: 'Unsicheres Beispiel (F)',
      howToFix: 'Wie beheben?',
      nginx: 'Nginx Konfiguration',
      apache: 'Apache Konfiguration',
      copied: '✓ Kopiert!',
      copyBtn: 'Konfiguration kopieren',
      clearBtn: 'Löschen'
    },
    ar: {
      title: 'فاحص رؤوس الأمان',
      subtitle: 'قم بتحليل رؤوس استجابة HTTP الخاصة بموقعك لتدقيق تدابير السلامة وحساب درجة الأمان الخاصة بك',
      inputLabel: 'الصق رؤوس استجابة HTTP',
      inputPlaceholder: 'الصق الرؤوس الأولية هنا، مثل:\nHTTP/2 200 OK\ncontent-security-policy: default-src \'self\'',
      btnAudit: 'تدقيق الرؤوس',
      outputLabel: 'تقرير التدقيق',
      gradeLabel: 'درجة الأمان',
      scoreLabel: 'مجموع الأمان',
      noData: 'لا توجد بيانات. الصق الرؤوس في اليسار لبدء التدقيق.',
      warningsTitle: 'تحذيرات الأمان',
      missingTitle: 'رؤوس الأمان المفقودة',
      presentTitle: 'الرؤوس المهيأة بشكل صحيح',
      presetsTitle: 'نماذج الاختبار',
      presetSecure: 'مثال تهيئة آمنة (A+)',
      presetWeak: 'مثال تهيئة ضعيفة (C)',
      presetNone: 'مثال تهيئة غير آمنة (F)',
      howToFix: 'كيف تصلح هذا؟',
      nginx: 'تكوين Nginx',
      apache: 'تكوين Apache',
      copied: '✓ تم النسخ!',
      copyBtn: 'نسخ التهيئة',
      clearBtn: 'مسح'
    },
    ko: {
      title: 'HTTP 보안 헤더 검사기',
      subtitle: 'HTTP 응답 헤더를 분석하여 활성화된 보안 장치를 진단하고 보안 등급을 매깁니다',
      inputLabel: 'HTTP 응답 헤더 붙여넣기',
      inputPlaceholder: '여기에 응답 헤더 원본을 붙여넣으세요. 예시:\nHTTP/2 200 OK\ncontent-security-policy: default-src \'self\'',
      btnAudit: '헤더 진단',
      outputLabel: '보안 진단 보고서',
      gradeLabel: '보안 등급',
      scoreLabel: '보안 점수',
      noData: '진단 데이터가 없습니다. 왼쪽 입력 칸에 응답 헤더를 붙여넣어 진단을 수행하세요.',
      warningsTitle: '보안 경고 및 취약점',
      missingTitle: '활성화되지 않은 보안 헤더',
      presentTitle: '올바르게 설정된 헤더',
      presetsTitle: '테스트 프리셋',
      presetSecure: '안전한 설정 예시 (A+)',
      presetWeak: '취약한 설정 예시 (C)',
      presetNone: '취약한 설정 예시 (F)',
      howToFix: '어떻게 조치하나요?',
      nginx: 'Nginx 설정 코드',
      apache: 'Apache 설정 코드',
      copied: '✓ 복사됨!',
      copyBtn: '설정 복사',
      clearBtn: '초기화'
    },
    ru: {
      title: 'Проверка заголовков безопасности',
      subtitle: 'Проанализируйте заголовки ответов HTTP, чтобы проверить меры безопасности и рассчитать вашу оценку',
      inputLabel: 'Вставьте заголовки ответов HTTP',
      inputPlaceholder: 'Вставьте сырые HTTP-заголовки, например:\nHTTP/2 200 OK\ncontent-security-policy: default-src \'self\'',
      btnAudit: 'Аудит заголовков',
      outputLabel: 'Отчет об аудите',
      gradeLabel: 'Класс безопасности',
      scoreLabel: 'Балл безопасности',
      noData: 'Нет данных. Вставьте заголовки слева и запустите аудит.',
      warningsTitle: 'Предупреждения безопасности',
      missingTitle: 'Отсутствующие заголовки безопасности',
      presentTitle: 'Правильно настроенные заголовки',
      presetsTitle: 'Тестовые шаблоны',
      presetSecure: 'Пример безопасных заголовков (A+)',
      presetWeak: 'Пример слабых заголовков (C)',
      presetNone: 'Пример незащищенных заголовков (F)',
      howToFix: 'Как исправить?',
      nginx: 'Конфигурация Nginx',
      apache: 'Конфигурация Apache',
      copied: '✓ Скопировано!',
      copyBtn: 'Копировать конфиг',
      clearBtn: 'Очистить'
    }
  };

  const t = (key: string): string => {
    return (translations[key] as string) || I18N_BACKUP[locale]?.[key] || I18N_BACKUP.en[key] || key;
  };

  // Raw response header inputs
  let inputHeaders = $state(
    'HTTP/2 200 OK\nServer: nginx\nDate: Fri, 05 Jun 2026 01:00:00 GMT\nContent-Type: text/html; charset=UTF-8\n' +
    'X-Frame-Options: SAMEORIGIN\nX-Content-Type-Options: nosniff\nReferrer-Policy: strict-origin-when-cross-origin'
  );

  // Derived audit report
  let auditReport = $derived.by(() => {
    return auditHeaders(inputHeaders);
  });

  // Derived list of present security headers (for the green "configured" section)
  const SECURITY_HEADER_KEYS = [
    'content-security-policy', 'strict-transport-security', 'x-frame-options',
    'x-content-type-options', 'referrer-policy', 'permissions-policy'
  ];
  let presentHeaders = $derived(
    Object.keys(auditReport.headers).filter(k => SECURITY_HEADER_KEYS.includes(k))
  );

  function selectPreset(type: 'secure' | 'weak' | 'none') {
    if (type === 'secure') {
      inputHeaders = 
        'HTTP/2 200 OK\n' +
        'Content-Security-Policy: default-src \'self\'; script-src \'self\'; object-src \'none\'\n' +
        'Strict-Transport-Security: max-age=63072000; includeSubDomains; preload\n' +
        'X-Frame-Options: DENY\n' +
        'X-Content-Type-Options: nosniff\n' +
        'Referrer-Policy: strict-origin-when-cross-origin\n' +
        'Permissions-Policy: geolocation=(), camera=()';
    } else if (type === 'weak') {
      inputHeaders = 
        'HTTP/1.1 200 OK\n' +
        'Content-Security-Policy: default-src \'self\' \'unsafe-inline\' *\n' +
        'Strict-Transport-Security: max-age=3600\n' +
        'X-Frame-Options: SAMEORIGIN\n' +
        'X-Content-Type-Options: nosniff';
    } else if (type === 'none') {
      inputHeaders = 
        'HTTP/2 200 OK\n' +
        'Content-Type: text/html; charset=utf-8\n' +
        'Server: Apache/2.4.41 (Unix)';
    }
  }

  // Repair configurations mapping helper
  const REPAIR_CONFIGS: Record<string, { nginx: string; apache: string }> = {
    'Content-Security-Policy': {
      nginx: 'add_header Content-Security-Policy "default-src \'self\';" always;',
      apache: 'Header set Content-Security-Policy "default-src \'self\';"'
    },
    'Strict-Transport-Security': {
      nginx: 'add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;',
      apache: 'Header always set Strict-Transport-Security "max-age=63072000; includeSubDomains; preload"'
    },
    'X-Frame-Options': {
      nginx: 'add_header X-Frame-Options "SAMEORIGIN" always;',
      apache: 'Header always set X-Frame-Options "SAMEORIGIN"'
    },
    'X-Content-Type-Options': {
      nginx: 'add_header X-Content-Type-Options "nosniff" always;',
      apache: 'Header always set X-Content-Type-Options "nosniff"'
    },
    'Referrer-Policy': {
      nginx: 'add_header Referrer-Policy "strict-origin-when-cross-origin" always;',
      apache: 'Header always set Referrer-Policy "strict-origin-when-cross-origin"'
    },
    'Permissions-Policy': {
      nginx: 'add_header Permissions-Policy "geolocation=(), microphone=(), camera=()" always;',
      apache: 'Header always set Permissions-Policy "geolocation=(), microphone=(), camera=()"'
    }
  };

  // Copied button feedback alerts
  let copyStates = $state<Record<string, boolean>>({});

  async function handleCopy(key: string, content: string) {
    try {
      await navigator.clipboard.writeText(content);
      copyStates[key] = true;
      setTimeout(() => {
        copyStates[key] = false;
      }, 2000);
    } catch (e) {
      console.error(e);
    }
  }

  function handleClear() {
    inputHeaders = '';
  }

  // Grade color map helper
  function getGradeColor(grade: string): string {
    if (grade.startsWith('A')) return 'text-green-500 border-green-500/30 bg-green-500/10';
    if (grade.startsWith('B')) return 'text-emerald-400 border-emerald-400/30 bg-emerald-400/10';
    if (grade.startsWith('C')) return 'text-yellow-500 border-yellow-500/30 bg-yellow-500/10';
    if (grade.startsWith('D')) return 'text-orange-500 border-orange-500/30 bg-orange-500/10';
    return 'text-red-500 border-red-500/30 bg-red-500/10';
  }
</script>

<div class="obsidian-calculator-theme min-h-screen text-stone-100 p-4 md:p-8 flex flex-col gap-6">
  <div class="max-w-6xl mx-auto w-full flex flex-col gap-6">
    
    <!-- Header -->
    <div class="border-b border-amber-500/20 pb-4 flex justify-between items-end">
      <div>
        <h1 class="text-2xl md:text-3xl font-bold bg-gradient-to-r from-amber-200 to-yellow-500 bg-clip-text text-transparent">
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

    <!-- Presets -->
    <div class="bg-stone-900/60 border border-stone-800 p-5 rounded-xl flex flex-col gap-3">
      <span class="text-xs font-semibold text-amber-500 uppercase tracking-wider">{t('presetsTitle')}</span>
      <div class="flex flex-wrap gap-2">
        <button 
          onclick={() => selectPreset('secure')} 
          class="text-xs bg-stone-850 hover:bg-amber-500/10 border border-stone-700 hover:border-amber-500/30 text-stone-300 hover:text-amber-400 py-1.5 px-3 rounded-lg transition"
        >
          {t('presetSecure')}
        </button>
        <button 
          onclick={() => selectPreset('weak')} 
          class="text-xs bg-stone-850 hover:bg-amber-500/10 border border-stone-700 hover:border-amber-500/30 text-stone-300 hover:text-amber-400 py-1.5 px-3 rounded-lg transition"
        >
          {t('presetWeak')}
        </button>
        <button 
          onclick={() => selectPreset('none')} 
          class="text-xs bg-stone-850 hover:bg-amber-500/10 border border-stone-700 hover:border-amber-500/30 text-stone-300 hover:text-amber-400 py-1.5 px-3 rounded-lg transition"
        >
          {t('presetNone')}
        </button>
      </div>
    </div>

    <!-- Workspace Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
      
      <!-- Input Panel -->
      <div class="lg:col-span-5 bg-stone-900/40 border border-stone-800 rounded-xl p-5 flex flex-col gap-4">
        <label for="headers-input" class="text-sm font-semibold text-stone-300">{t('inputLabel')}</label>
        <textarea
          id="headers-input"
          bind:value={inputHeaders}
          placeholder={t('inputPlaceholder')}
          class="w-full flex-1 min-h-[360px] bg-stone-950 border border-stone-800 focus:border-amber-500/50 rounded-xl p-4 text-xs font-mono text-stone-300 focus:outline-none transition resize-none leading-relaxed"
        ></textarea>
      </div>

      <!-- Report Panel -->
      <div class="lg:col-span-7 bg-stone-900/40 border border-stone-800 rounded-xl p-5 flex flex-col gap-5">
        <span class="text-sm font-semibold text-stone-300">{t('outputLabel')}</span>
        
        {#if !inputHeaders.trim()}
          <div class="flex-1 flex flex-col justify-center items-center py-20 text-center">
            <span class="text-stone-500 text-xs">{t('noData')}</span>
          </div>
        {:else}
          <!-- Score Dashboard -->
          <div class="grid grid-cols-2 gap-4 border-b border-stone-800/80 pb-4">
            <div class="bg-stone-950 border border-stone-800 rounded-xl p-4 flex flex-col items-center justify-center">
              <span class="text-[10px] text-stone-500 uppercase font-semibold">{t('scoreLabel')}</span>
              <span class="text-3xl font-extrabold text-amber-500 mt-1">{auditReport.score} <span class="text-xs text-stone-500">/ 100</span></span>
            </div>
            <div class="bg-stone-950 border border-stone-800 rounded-xl p-4 flex flex-col items-center justify-center">
              <span class="text-[10px] text-stone-500 uppercase font-semibold">{t('gradeLabel')}</span>
              <span class="text-3xl font-extrabold px-6 py-1 rounded-xl border mt-1 font-mono {getGradeColor(auditReport.grade)}">{auditReport.grade}</span>
            </div>
          </div>

          <!-- Bullet point Audits -->
          <div class="flex flex-col gap-5 flex-1 max-h-[460px] overflow-y-auto pr-1">
            
            <!-- Warnings -->
            {#if auditReport.warnings.length > 0}
              <div class="flex flex-col gap-2">
                <span class="text-xs font-semibold text-yellow-500 uppercase tracking-wider">{t('warningsTitle')}</span>
                <div class="flex flex-col gap-1.5">
                  {#each auditReport.warnings as warning}
                    <div class="flex gap-2 items-start bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-2.5 text-xs text-yellow-400">
                      <span>⚠️</span>
                      <span class="leading-relaxed">{warning}</span>
                    </div>
                  {/each}
                </div>
              </div>
            {/if}

            <!-- Missing security headers -->
            {#if auditReport.missing.length > 0}
              <div class="flex flex-col gap-2">
                <span class="text-xs font-semibold text-red-500 uppercase tracking-wider">{t('missingTitle')}</span>
                <div class="flex flex-col gap-3">
                  {#each auditReport.missing as item}
                    <div class="bg-red-500/5 border border-red-500/20 rounded-xl p-4 flex flex-col gap-2 relative">
                      <div class="flex justify-between items-center">
                        <span class="text-xs font-bold text-red-400 font-mono">{item}</span>
                        <span class="text-[10px] text-red-500 font-semibold uppercase">{t('howToFix')}</span>
                      </div>
                      
                      {#if REPAIR_CONFIGS[item]}
                        <div class="flex flex-col gap-2.5 mt-1">
                          <!-- Nginx box -->
                          <div class="flex flex-col gap-1 text-[10px]">
                            <div class="flex justify-between text-stone-500">
                              <span>{t('nginx')}</span>
                              <button 
                                onclick={() => handleCopy(`${item}_nginx`, REPAIR_CONFIGS[item].nginx)}
                                class="text-amber-500 hover:text-amber-400"
                              >
                                {copyStates[`${item}_nginx`] ? t('copied') : t('copyBtn')}
                              </button>
                            </div>
                            <pre class="bg-stone-950 p-2 rounded border border-stone-850 text-[10px] text-stone-300 overflow-x-auto leading-relaxed">{REPAIR_CONFIGS[item].nginx}</pre>
                          </div>

                          <!-- Apache box -->
                          <div class="flex flex-col gap-1 text-[10px]">
                            <div class="flex justify-between text-stone-500">
                              <span>{t('apache')}</span>
                              <button 
                                onclick={() => handleCopy(`${item}_apache`, REPAIR_CONFIGS[item].apache)}
                                class="text-amber-500 hover:text-amber-400"
                              >
                                {copyStates[`${item}_apache`] ? t('copied') : t('copyBtn')}
                              </button>
                            </div>
                            <pre class="bg-stone-950 p-2 rounded border border-stone-850 text-[10px] text-stone-300 overflow-x-auto leading-relaxed">{REPAIR_CONFIGS[item].apache}</pre>
                          </div>
                        </div>
                      {/if}

                    </div>
                  {/each}
                </div>
              </div>
            {/if}

            <!-- Properly Configured -->
            {#if presentHeaders.length > 0}
              <div class="flex flex-col gap-2">
                <span class="text-xs font-semibold text-green-500 uppercase tracking-wider">{t('presentTitle')}</span>
                <div class="flex flex-col gap-1.5">
                  {#each presentHeaders as headerKey}
                    <div class="flex justify-between items-center bg-green-500/5 border border-green-500/20 rounded-lg p-2.5 text-xs text-stone-300">
                      <span class="font-bold text-green-400 font-mono">{headerKey}</span>
                      <span class="text-[10px] text-stone-500 font-mono truncate max-w-[240px]">{auditReport.headers[headerKey]}</span>
                    </div>
                  {/each}
                </div>
              </div>
            {/if}

          </div>
        {/if}

      </div>

    </div>

  </div>
</div>

<style>
  .obsidian-calculator-theme {
    background-color: #0c0a09; /* stone-950 */
    font-family: 'Inter', system-ui, sans-serif;
  }
  .bg-stone-850 {
    background-color: #211f1d;
  }
</style>
