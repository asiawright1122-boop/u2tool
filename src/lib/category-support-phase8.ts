type PhaseEightLocale = 'ar' | 'de' | 'es' | 'fr' | 'ja' | 'ko' | 'pt';
type PhaseEightCategory = 'converters' | 'development' | 'network';

export const phaseEightPriorityClusters: Array<{ locale: PhaseEightLocale; category: PhaseEightCategory }> = [
  { locale: 'de', category: 'development' },
  { locale: 'es', category: 'development' },
  { locale: 'fr', category: 'development' },
  { locale: 'de', category: 'converters' },
  { locale: 'es', category: 'converters' },
  { locale: 'ja', category: 'converters' },
  { locale: 'ko', category: 'converters' },
  { locale: 'de', category: 'network' },
  { locale: 'fr', category: 'network' },
  { locale: 'pt', category: 'network' },
  { locale: 'ar', category: 'network' },
];

export const phaseEightSupportContent = {
  ar: {
    network: {
      eyebrow: 'للتشخيص والتحقق الشبكي',
      title: 'أدوات الشبكة لفحص DNS و SSL و IP وتحليل الطلبات',
      intro:
        'تقوى فئة الشبكة عندما تجمع بين أعمال واضحة مثل فحص DNS وشهادات SSL وتحليل الرؤوس وعناوين IP بدلاً من الاكتفاء بقائمة أدوات عامة.',
      highlightsTitle: 'أعمال شائعة في هذه الفئة',
      highlights: [
        'التحقق من DNS و SSL و WHOIS قبل إطلاق موقع أو خدمة جديدة.',
        'تحليل URL والرؤوس وسلاسل الاستعلام عند اختبار واجهات API أو الروابط.',
        'مراجعة IP والشبكات الفرعية والموقع الجغرافي عند التعامل مع البنية التحتية أو الأمان.',
      ],
      workflowsTitle: 'مسارات عمل مقترحة',
      workflows: [
        {
          title: 'فحص النطاقات والشهادات',
          description: 'افحص DNS و SSL وبيانات النطاق قبل النشر أو عند استكشاف الانقطاعات.',
          toolSlugs: ['dns-lookup', 'ssl-checker', 'whois-lookup'],
        },
        {
          title: 'تحليل الطلبات والروابط',
          description: 'راجع الرؤوس وعناصر URL وسلاسل الاستعلام أثناء الاختبار أو التكامل.',
          toolSlugs: ['url-parser', 'http-header-parser', 'url-query-string-parser'],
        },
        {
          title: 'شبكات IP والتحقق',
          description: 'تحقق من عناوين IP ونطاقات الشبكة والموقع الجغرافي في مهام التشغيل والدعم.',
          toolSlugs: ['cidr-calculator', 'ip-validator', 'ip-geolocation'],
        },
      ],
      noteTitle: 'ملاحظة الثقة',
      note:
        'هذه الفئة يجب ان تجيب مباشرة عن نوايا مثل DNS lookup و SSL checker و IP validator و URL parser بدلاً من وصف شبكي عام.',
    },
  },
  de: {
    converters: {
      eyebrow: 'Fur konkrete Umwandlungsjobs',
      title: 'Konverter fur JSON, PDF, Einheiten, Zeit und strukturierte Daten',
      intro:
        'Die Konverter-Kategorie gewinnt Reichweite, wenn sie echte Umwandlungsaufgaben abbildet: JSON in andere Formate uberfuhren, PDF aus Text erzeugen, Zeitangaben umrechnen oder strukturierte Daten fur andere Systeme vorbereiten.',
      highlightsTitle: 'Typische Suchintents',
      highlights: [
        'JSON, XML, CSV und YAML fur APIs, Datenimporte oder Dokumentation umwandeln.',
        'PDF, HTML und Markdown fur Freigaben, Export oder interne Workflows konvertieren.',
        'Zeit, Einheiten und Werte fur internationale oder technische Anwendungsfalle anpassen.',
      ],
      workflowsTitle: 'Empfohlene Umwandlungswege',
      workflows: [
        {
          title: 'Strukturierte Daten konvertieren',
          description: 'Wechsle zwischen JSON, CSV, XML und YAML fur APIs, Datenmigration und Debugging.',
          toolSlugs: ['json-to-csv', 'json-to-yaml', 'xml-to-json'],
        },
        {
          title: 'Dokumente und Markup exportieren',
          description: 'Bereite Inhalte fur PDF, HTML oder andere weitergebbare Formate vor.',
          toolSlugs: ['markdown-to-html', 'text-to-pdf', 'html-to-pdf'],
        },
        {
          title: 'Zeit, Einheiten und Werte anpassen',
          description: 'Rechne Zeitzonen, technische Einheiten und alltagliche Werte im Browser um.',
          toolSlugs: ['timezone-converter', 'unit-converter', 'metric-imperial-converter'],
        },
      ],
      noteTitle: 'SEO-Hinweis',
      note:
        'Die Kategorie sollte Intents wie JSON Converter, PDF Converter, Unit Converter und Timezone Converter klar abdecken, statt nur allgemeine Umwandlungsbegriffe zu sammeln.',
    },
    development: {
      eyebrow: 'Fur Build-, Debug- und API-Arbeit',
      title: 'Entwickler-Tools fur Regex, JSON, APIs, Formatter und Projekt-Setup',
      intro:
        'Die Entwicklungs-Kategorie ist am starksten, wenn sie konkrete Entwicklungsjobs ordnet: Regex testen, JSON validieren, APIs prufen, Formatter nutzen oder Projektdateien generieren.',
      highlightsTitle: 'Wofur diese Kategorie stark ist',
      highlights: [
        'Regex, JSON-Schema und Datenunterschiede fur Debugging und Validierung prufen.',
        'Request-, API- und Header-Workflows fur Integrationen direkt im Browser testen.',
        'Projekt- und Konfigurationsdateien fur Docker, TypeScript, ESLint und ahnliche Setups erzeugen.',
      ],
      workflowsTitle: 'Empfohlene Entwickler-Workflows',
      workflows: [
        {
          title: 'Validieren und debuggen',
          description: 'Teste Regex, JSON-Schema und Strukturunterschiede bevor Fehler in Produktion landen.',
          toolSlugs: ['regex-tester', 'json-schema-validator', 'json-diff'],
        },
        {
          title: 'API und Request-Prufung',
          description: 'Analysiere Requests, Header und Webhooks wahrend Integrationen oder Fehlersuche.',
          toolSlugs: ['curl-converter', 'request-header-builder', 'webhook-tester'],
        },
        {
          title: 'Projekt-Setup erzeugen',
          description: 'Erstelle wiederkehrende Konfigurationsdateien fur neue Projekte und Build-Setups.',
          toolSlugs: ['dockerfile-generator', 'tsconfig-generator', 'eslint-config-generator'],
        },
      ],
      noteTitle: 'Warum das hilft',
      note:
        'So trifft die Kategorie Suchanfragen wie Regex Tester, JSON Validator, API Tester, Dockerfile Generator oder TSConfig Generator deutlich praziser.',
    },
    network: {
      eyebrow: 'Fur Diagnose und Infrastrukturchecks',
      title: 'Netzwerk-Tools fur DNS, SSL, IP, Header und URL-Analyse',
      intro:
        'Netzwerkseiten ranken besser, wenn sie echte Diagnosejobs abbilden: DNS nachschlagen, SSL prufen, Header lesen, URLs zerlegen oder IP-Informationen verifizieren.',
      highlightsTitle: 'Haufige Netzwerkaufgaben',
      highlights: [
        'DNS, SSL und WHOIS fur Domains, Zertifikate und Uptime-Probleme prufen.',
        'Header, Query-Strings und URLs fur Debugging und API-Arbeit zerlegen.',
        'CIDR, IP-Validierung und Geo-IP fur Infrastruktur- und Support-Aufgaben nutzen.',
      ],
      workflowsTitle: 'Sinnvolle Netzwerk-Workflows',
      workflows: [
        {
          title: 'Domain- und Zertifikatschecks',
          description: 'Prufe DNS, SSL und WHOIS bevor du Domains umstellst oder Vorfalle analysierst.',
          toolSlugs: ['dns-lookup', 'ssl-checker', 'whois-lookup'],
        },
        {
          title: 'Request- und URL-Analyse',
          description: 'Untersuche Header, URLs und Query-Strings bei Integrationen und Support-Fallen.',
          toolSlugs: ['url-parser', 'http-header-parser', 'url-query-string-parser'],
        },
        {
          title: 'IP- und Netzbereich-Prufung',
          description: 'Validiere Adressen und Netzbereiche fur Routing, Monitoring und Standortkontrolle.',
          toolSlugs: ['cidr-calculator', 'ip-validator', 'ip-geolocation'],
        },
      ],
      noteTitle: 'Intent-Fokus',
      note:
        'Die Kategorie soll Intents wie DNS Lookup, SSL Checker, IP Validator und URL Parser direkt bedienen statt nur generische Netzwerk-Utilities zu listen.',
    },
  },
  es: {
    converters: {
      eyebrow: 'Para conversiones concretas',
      title: 'Convertidores para JSON, PDF, unidades, zonas horarias y formatos estructurados',
      intro:
        'La categoria de convertidores funciona mejor cuando cubre trabajos claros: pasar JSON a otros formatos, exportar PDF, convertir unidades o normalizar datos para APIs y documentos.',
      highlightsTitle: 'Intenciones mas comunes',
      highlights: [
        'Convertir JSON, XML, CSV y YAML para integraciones, migraciones o depuracion.',
        'Pasar texto, HTML y markdown a PDF u otros formatos compartibles.',
        'Ajustar zonas horarias, unidades y valores para trabajo internacional o tecnico.',
      ],
      workflowsTitle: 'Flujos recomendados',
      workflows: [
        {
          title: 'Transformar datos estructurados',
          description: 'Mueve datos entre JSON, CSV, XML y YAML segun el sistema o flujo que uses.',
          toolSlugs: ['json-to-csv', 'json-to-yaml', 'xml-to-json'],
        },
        {
          title: 'Exportar documentos y contenido',
          description: 'Convierte texto y marcado en formatos listos para compartir o archivar.',
          toolSlugs: ['markdown-to-html', 'text-to-pdf', 'html-to-pdf'],
        },
        {
          title: 'Ajustar tiempo y unidades',
          description: 'Resuelve cambios de zona horaria, unidades y medidas desde el navegador.',
          toolSlugs: ['timezone-converter', 'unit-converter', 'metric-imperial-converter'],
        },
      ],
      noteTitle: 'Enfoque SEO',
      note:
        'La categoria debe responder a busquedas como JSON converter, PDF converter, unit converter y timezone converter con lenguaje concreto y orientado a tareas.',
    },
    development: {
      eyebrow: 'Para depuracion, integraciones y setup',
      title: 'Herramientas de desarrollo para regex, JSON, APIs, formato de codigo y configuracion',
      intro:
        'La categoria de desarrollo gana traccion cuando ordena trabajos reales: probar regex, validar JSON, revisar APIs, formatear codigo y generar archivos de configuracion.',
      highlightsTitle: 'Trabajos que cubre mejor',
      highlights: [
        'Probar expresiones regulares, JSON Schema y diferencias entre datos antes de desplegar.',
        'Revisar peticiones, cabeceras y webhooks al integrar APIs o automatizaciones.',
        'Generar archivos de proyecto para Docker, TypeScript, ESLint y otros entornos.',
      ],
      workflowsTitle: 'Rutas recomendadas',
      workflows: [
        {
          title: 'Validacion y depuracion',
          description: 'Comprueba regex, esquemas JSON y diferencias de datos para reducir errores.',
          toolSlugs: ['regex-tester', 'json-schema-validator', 'json-diff'],
        },
        {
          title: 'Pruebas de API y peticiones',
          description: 'Analiza requests, headers y webhooks durante integraciones o soporte.',
          toolSlugs: ['curl-converter', 'request-header-builder', 'webhook-tester'],
        },
        {
          title: 'Archivos de arranque para proyectos',
          description: 'Genera configuraciones frecuentes para nuevos repositorios y flujos de build.',
          toolSlugs: ['dockerfile-generator', 'tsconfig-generator', 'eslint-config-generator'],
        },
      ],
      noteTitle: 'Por que importa',
      note:
        'Asi la pagina responde mejor a intenciones como regex tester, JSON validator, API tester, Dockerfile generator o TSConfig generator.',
    },
  },
  fr: {
    development: {
      eyebrow: 'Pour debug, integration et configuration',
      title: 'Outils de developpement pour regex, JSON, API, formatage de code et setup',
      intro:
        'La categorie developpement devient plus utile quand elle regroupe des jobs concrets: tester une regex, valider du JSON, inspecter une API, formatter du code ou generer des fichiers de configuration.',
      highlightsTitle: 'Intentions couvertes',
      highlights: [
        'Tester regex, JSON Schema et differences de donnees avant mise en production.',
        'Verifier requetes, headers et webhooks pendant les integrations.',
        'Generer des fichiers de base pour Docker, TypeScript, ESLint et autres stacks.',
      ],
      workflowsTitle: 'Parcours recommandes',
      workflows: [
        {
          title: 'Validation et debuggage',
          description: 'Controlez regex, schemas JSON et ecarts de donnees pour limiter les regressions.',
          toolSlugs: ['regex-tester', 'json-schema-validator', 'json-diff'],
        },
        {
          title: 'Inspection API et requetes',
          description: 'Analysez headers, conversions curl et webhooks pendant le developpement.',
          toolSlugs: ['curl-converter', 'request-header-builder', 'webhook-tester'],
        },
        {
          title: 'Configuration de projet',
          description: 'Creez rapidement les fichiers de configuration recurrents pour les nouveaux projets.',
          toolSlugs: ['dockerfile-generator', 'tsconfig-generator', 'eslint-config-generator'],
        },
      ],
      noteTitle: 'Signal SEO',
      note:
        'La categorie doit repondre a des recherches comme regex tester, JSON validator, API tester et generateur de configuration, pas seulement a une etiquette generique developpeur.',
    },
    network: {
      eyebrow: 'Pour diagnostic et controle reseau',
      title: 'Outils reseau pour DNS, SSL, IP, headers et analyse URL',
      intro:
        'Une bonne categorie reseau doit couvrir des taches claires: verifier DNS et SSL, lire des headers, parser des URLs et controler des informations IP.',
      highlightsTitle: 'Usages reseau frequents',
      highlights: [
        'Verifier DNS, SSL et WHOIS pour les domaines, certificats et incidents.',
        'Analyser headers, URLs et parametres de requete pendant les integrations.',
        'Controler CIDR, IP et geolocalisation pour les operations et le support.',
      ],
      workflowsTitle: 'Workflows recommandes',
      workflows: [
        {
          title: 'Controle domaine et certificat',
          description: 'Inspectez DNS, SSL et WHOIS avant un changement de domaine ou un incident.',
          toolSlugs: ['dns-lookup', 'ssl-checker', 'whois-lookup'],
        },
        {
          title: 'Analyse de requete et URL',
          description: 'Lisez les headers et les query strings pour mieux debugguer APIs et redirects.',
          toolSlugs: ['url-parser', 'http-header-parser', 'url-query-string-parser'],
        },
        {
          title: 'Verification IP et sous-reseaux',
          description: 'Validez adresses et plages reseau pour monitoring, securite et support.',
          toolSlugs: ['cidr-calculator', 'ip-validator', 'ip-geolocation'],
        },
      ],
      noteTitle: 'Pourquoi cela aide',
      note:
        'Cette couche renforce des intentions comme DNS lookup, SSL checker, IP validator et URL parser au lieu de rester sur une navigation reseau trop large.',
    },
  },
  ja: {
    converters: {
      eyebrow: '変換作業をまとめて進めたい人向け',
      title: 'JSON、PDF、単位、時刻変換を整理しやすいコンバーターツール',
      intro:
        'コンバーターカテゴリは、JSON 変換、PDF 書き出し、単位変換、タイムゾーン変換のような具体的な作業意図を見せるほど自然流入に強くなります。',
      highlightsTitle: 'このカテゴリで解決しやすい作業',
      highlights: [
        'JSON、XML、CSV、YAML を API やデータ移行向けに変換する。',
        'テキストや HTML、Markdown を PDF や共有向け形式に書き出す。',
        '単位、時刻、値の変換をブラウザだけで素早く進める。',
      ],
      workflowsTitle: '代表的な使い方',
      workflows: [
        {
          title: '構造化データの変換',
          description: 'JSON、CSV、XML、YAML を用途に応じて行き来させ、API やデータ整形に使います。',
          toolSlugs: ['json-to-csv', 'json-to-yaml', 'xml-to-json'],
        },
        {
          title: '文書とマークアップの書き出し',
          description: 'テキストやマークアップを PDF や共有しやすい形式へ変換します。',
          toolSlugs: ['markdown-to-html', 'text-to-pdf', 'html-to-pdf'],
        },
        {
          title: '時間と単位の変換',
          description: 'タイムゾーンや単位の違いをすばやく確認して、作業の手戻りを減らします。',
          toolSlugs: ['timezone-converter', 'unit-converter', 'metric-imperial-converter'],
        },
      ],
      noteTitle: '狙い',
      note:
        'カテゴリページ側でも JSON converter、PDF converter、単位変換、timezone converter といった具体キーワードを受け止める構成にします。',
    },
  },
  ko: {
    converters: {
      eyebrow: '실제 변환 작업을 빠르게 처리하기 위한 묶음',
      title: 'JSON, PDF, 단위, 시간 변환을 정리해 주는 변환 도구',
      intro:
        '변환 카테고리는 JSON 변환, PDF 내보내기, 단위 변환, 타임존 변환처럼 실제 작업 의도를 보여줄 때 더 강한 검색 신호를 만듭니다.',
      highlightsTitle: '이 카테고리에서 자주 하는 일',
      highlights: [
        'JSON, XML, CSV, YAML 데이터를 API나 이전 작업에 맞게 변환하기.',
        '텍스트, HTML, markdown 콘텐츠를 PDF나 공유용 형식으로 내보내기.',
        '시간대, 단위, 값 변환을 브라우저에서 빠르게 처리하기.',
      ],
      workflowsTitle: '추천 변환 흐름',
      workflows: [
        {
          title: '구조화 데이터 변환',
          description: 'JSON, CSV, XML, YAML을 오가며 데이터 전달과 정리를 쉽게 만듭니다.',
          toolSlugs: ['json-to-csv', 'json-to-yaml', 'xml-to-json'],
        },
        {
          title: '문서와 마크업 내보내기',
          description: '텍스트와 마크업을 PDF나 공유용 포맷으로 빠르게 바꿉니다.',
          toolSlugs: ['markdown-to-html', 'text-to-pdf', 'html-to-pdf'],
        },
        {
          title: '시간과 단위 맞추기',
          description: '타임존과 단위 차이를 확인해 국제 업무나 기술 작업에 대응합니다.',
          toolSlugs: ['timezone-converter', 'unit-converter', 'metric-imperial-converter'],
        },
      ],
      noteTitle: '의도 강화',
      note:
        'JSON converter, PDF converter, unit converter, timezone converter 같은 구체 검색 의도를 카테고리 차원에서 더 분명하게 받쳐 줍니다.',
    },
  },
  pt: {
    network: {
      eyebrow: 'Para diagnostico e verificacao',
      title: 'Ferramentas de rede para DNS, SSL, IP, cabecalhos e analise de URL',
      intro:
        'A categoria de rede fica mais util quando cobre tarefas claras: consultar DNS, verificar SSL, inspecionar cabecalhos, analisar URLs e validar informacoes de IP.',
      highlightsTitle: 'Demandas mais comuns',
      highlights: [
        'Verificar DNS, SSL e WHOIS antes de publicar, migrar ou investigar incidentes.',
        'Analisar URLs, cabecalhos e query strings durante integracoes e testes.',
        'Validar IP, CIDR e geolocalizacao para operacao, suporte e seguranca.',
      ],
      workflowsTitle: 'Fluxos recomendados',
      workflows: [
        {
          title: 'Checagem de dominio e certificado',
          description: 'Consulte DNS, SSL e WHOIS para validar dominio, certificado e configuracao publica.',
          toolSlugs: ['dns-lookup', 'ssl-checker', 'whois-lookup'],
        },
        {
          title: 'Analise de requisicao e URL',
          description: 'Leia cabecalhos, URLs e parametros para depurar APIs, redirecionamentos e links.',
          toolSlugs: ['url-parser', 'http-header-parser', 'url-query-string-parser'],
        },
        {
          title: 'Validacao de IP e sub-redes',
          description: 'Confirme enderecos, faixas e geolocalizacao em tarefas tecnicas e de suporte.',
          toolSlugs: ['cidr-calculator', 'ip-validator', 'ip-geolocation'],
        },
      ],
      noteTitle: 'Foco de busca',
      note:
        'A pagina deve responder diretamente a buscas como DNS lookup, SSL checker, IP validator e URL parser, em vez de depender de uma descricao de rede muito ampla.',
    },
  },
};
