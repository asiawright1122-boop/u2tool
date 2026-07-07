<script lang="ts">
  import { parseDockerRun } from '../../lib/docker-run-parser';
  import yaml from 'js-yaml';

  interface Props {
    locale?: string;
    translations?: Record<string, unknown>;
  }

  let { locale = 'en', translations = {} }: Props = $props();

  const I18N_BACKUP: Record<string, Record<string, string>> = {
    zh: {
      title: 'Docker Run 转 Compose',
      subtitle: '将复杂的 docker run 命令一键转换为标准的 docker-compose.yml 配置文件',
      inputLabel: '输入 Docker Run 命令',
      inputPlaceholder: '粘贴您的 docker run 命令，例如:\ndocker run -d --name web -p 8080:80 -v /data:/usr/share/nginx/html nginx:alpine',
      outputLabel: '生成的 Docker Compose YAML',
      copyBtn: '复制 YAML',
      copied: '✓ 已复制!',
      downloadBtn: '下载 YML',
      clearBtn: '清空',
      presetsTitle: '常用示例',
      presetNginx: 'Nginx 服务 (带端口与挂载)',
      presetPostgres: 'PostgreSQL 数据库 (带环境变量)',
      presetRedis: 'Redis 缓存 (带重启策略)'
    },
    en: {
      title: 'Docker Run to Compose',
      subtitle: 'Convert complex docker run commands to standard docker-compose.yml configuration files instantly',
      inputLabel: 'Input Docker Run Command',
      inputPlaceholder: 'Paste your docker run command here, e.g.:\ndocker run -d --name web -p 8080:80 -v /data:/usr/share/nginx/html nginx:alpine',
      outputLabel: 'Generated Docker Compose YAML',
      copyBtn: 'Copy YAML',
      copied: '✓ Copied!',
      downloadBtn: 'Download YML',
      clearBtn: 'Clear',
      presetsTitle: 'Quick Presets',
      presetNginx: 'Nginx Web (with Ports & Volumes)',
      presetPostgres: 'PostgreSQL DB (with Env Variables)',
      presetRedis: 'Redis Cache (with Restart Policy)'
    },
    es: {
      title: 'Docker Run a Compose',
      subtitle: 'Convierta comandos complejos de docker run en archivos docker-compose.yml al instante',
      inputLabel: 'Comando Docker Run',
      inputPlaceholder: 'Pegue su comando docker run, ej.:\ndocker run -d --name web -p 8080:80 -v /data:/usr/share/nginx/html nginx:alpine',
      outputLabel: 'Docker Compose YAML Generado',
      copyBtn: 'Copiar YAML',
      copied: '✓ ¡Copiado!',
      downloadBtn: 'Descargar YML',
      clearBtn: 'Limpiar',
      presetsTitle: 'Plantillas rápidas',
      presetNginx: 'Nginx Web (con puertos y volúmenes)',
      presetPostgres: 'Base de datos PostgreSQL (con variables de entorno)',
      presetRedis: 'Redis Cache (con política de reinicio)'
    },
    pt: {
      title: 'Docker Run para Compose',
      subtitle: 'Converta comandos complexos do docker run em arquivos docker-compose.yml instantaneamente',
      inputLabel: 'Comando Docker Run',
      inputPlaceholder: 'Cole seu comando docker run aqui, ex.:\ndocker run -d --name web -p 8080:80 -v /data:/usr/share/nginx/html nginx:alpine',
      outputLabel: 'Docker Compose YAML Gerado',
      copyBtn: 'Copiar YAML',
      copied: '✓ Copiado!',
      downloadBtn: 'Baixar YML',
      clearBtn: 'Limpar',
      presetsTitle: 'Modelos Rápidos',
      presetNginx: 'Nginx Web (com portas e volumes)',
      presetPostgres: 'Banco de dados PostgreSQL (com variáveis de ambiente)',
      presetRedis: 'Redis Cache (com política de reinicialização)'
    },
    ja: {
      title: 'Docker Run から Compose 変換',
      subtitle: '複雑な docker run コマンドを標準の docker-compose.yml 構成ファイルに即座に変換します',
      inputLabel: 'Docker Run コマンドを入力',
      inputPlaceholder: 'docker run コマンドを貼り付けてください。例:\ndocker run -d --name web -p 8080:80 -v /data:/usr/share/nginx/html nginx:alpine',
      outputLabel: '生成された Docker Compose YAML',
      copyBtn: 'YAML をコピー',
      copied: '✓ コピーしました!',
      downloadBtn: 'YML をダウンロード',
      clearBtn: 'クリア',
      presetsTitle: 'クイックプリセット',
      presetNginx: 'Nginx Web (ポートとボリューム付き)',
      presetPostgres: 'PostgreSQL DB (環境変数付き)',
      presetRedis: 'Redis キャッシュ (再起動ポリシー付き)'
    },
    fr: {
      title: 'Docker Run vers Compose',
      subtitle: 'Convertissez instantanément des commandes docker run complexes en fichiers docker-compose.yml',
      inputLabel: 'Commande Docker Run',
      inputPlaceholder: 'Collez votre commande docker run ici, ex. :\ndocker run -d --name web -p 8080:80 -v /data:/usr/share/nginx/html nginx:alpine',
      outputLabel: 'Docker Compose YAML Généré',
      copyBtn: 'Copier le YAML',
      copied: '✓ Copié !',
      downloadBtn: 'Télécharger YML',
      clearBtn: 'Effacer',
      presetsTitle: 'Préréglages rapides',
      presetNginx: 'Nginx Web (avec ports et volumes)',
      presetPostgres: 'Base de données PostgreSQL (avec variables d\'environnement)',
      presetRedis: 'Cache Redis (avec politique de redémarrage)'
    },
    de: {
      title: 'Docker Run zu Compose',
      subtitle: 'Konvertieren Sie komplexe docker run Befehle sofort in standardmäßige docker-compose.yml Konfigurationsdateien',
      inputLabel: 'Docker Run Befehl eingeben',
      inputPlaceholder: 'Fügen Sie Ihren docker run Befehl hier ein, z.B.:\ndocker run -d --name web -p 8080:80 -v /data:/usr/share/nginx/html nginx:alpine',
      outputLabel: 'Generiertes Docker Compose YAML',
      copyBtn: 'YAML kopieren',
      copied: '✓ Kopiert!',
      downloadBtn: 'YML herunterladen',
      clearBtn: 'Löschen',
      presetsTitle: 'Schnelle Voreinstellungen',
      presetNginx: 'Nginx Web (mit Ports und Volumes)',
      presetPostgres: 'PostgreSQL DB (mit Umgebungsvariablen)',
      presetRedis: 'Redis Cache (mit Neustart-Richtlinie)'
    },
    ar: {
      title: 'تحويل Docker Run إلى Compose',
      subtitle: 'حوّل أوامر docker run المعقدة إلى ملفات تكوين docker-compose.yml القياسية فورًا',
      inputLabel: 'أدخل أمر Docker Run',
      inputPlaceholder: 'الصق أمر docker run هنا، مثل:\ndocker run -d --name web -p 8080:80 -v /data:/usr/share/nginx/html nginx:alpine',
      outputLabel: 'ملف Docker Compose YAML المُولّد',
      copyBtn: 'نسخ YAML',
      copied: '✓ تم النسخ!',
      downloadBtn: 'تنزيل YML',
      clearBtn: 'مسح',
      presetsTitle: 'نماذج سريعة',
      presetNginx: 'ويب Nginx (مع المنافذ والمجلدات)',
      presetPostgres: 'قاعدة بيانات PostgreSQL (مع متغيرات البيئة)',
      presetRedis: 'مخزن Redis المؤقت (مع سياسة إعادة التشغيل)'
    },
    ko: {
      title: 'Docker Run을 Compose로 변환',
      subtitle: '복잡한 docker run 명령어를 표준 docker-compose.yml 설정 파일로 즉시 변환합니다',
      inputLabel: 'Docker Run 명령어 입력',
      inputPlaceholder: '여기에 docker run 명령어를 붙여넣으세요. 예시:\ndocker run -d --name web -p 8080:80 -v /data:/usr/share/nginx/html nginx:alpine',
      outputLabel: '생성된 Docker Compose YAML',
      copyBtn: 'YAML 복사',
      copied: '✓ 복사됨!',
      downloadBtn: 'YML 다운로드',
      clearBtn: '초기화',
      presetsTitle: '빠른 프리셋',
      presetNginx: 'Nginx 웹 (포트 및 볼륨 포함)',
      presetPostgres: 'PostgreSQL DB (환경 변수 포함)',
      presetRedis: 'Redis 캐시 (재시작 정책 포함)'
    },
    ru: {
      title: 'Конвертер Docker Run в Compose',
      subtitle: 'Мгновенно преобразуйте сложные команды docker run в стандартные файлы конфигурации docker-compose.yml',
      inputLabel: 'Введите команду Docker Run',
      inputPlaceholder: 'Вставьте команду docker run, например:\ndocker run -d --name web -p 8080:80 -v /data:/usr/share/nginx/html nginx:alpine',
      outputLabel: 'Сгенерированный Docker Compose YAML',
      copyBtn: 'Копировать YAML',
      copied: '✓ Скопировано!',
      downloadBtn: 'Скачать YML',
      clearBtn: 'Очистить',
      presetsTitle: 'Быстрые шаблоны',
      presetNginx: 'Nginx Web (с портами и томами)',
      presetPostgres: 'БД PostgreSQL (с переменными окружения)',
      presetRedis: 'Кэш Redis (с политикой перезапуска)'
    }
  };

  const t = (key: string): string => {
    return (translations[key] as string) || I18N_BACKUP[locale]?.[key] || I18N_BACKUP.en[key] || key;
  };

  let inputCommand = $state('docker run -d --name web-nginx -p 8080:80 -v /var/www:/usr/share/nginx/html --restart always nginx:alpine');
  let copied = $state(false);

  // Deriving parsed structure and converting to YAML
  let composeYaml = $derived.by(() => {
    try {
      const parsed = parseDockerRun(inputCommand);
      if (!parsed.image) return '';

      const serviceName = parsed.container_name || parsed.image.split(':')[0].split('/').pop() || 'web';
      
      const composeObject = {
        version: '3.8',
        services: {
          [serviceName]: {
            image: parsed.image,
            ...(parsed.container_name ? { container_name: parsed.container_name } : {}),
            ...(parsed.restart ? { restart: parsed.restart } : {}),
            ...(parsed.ports && parsed.ports.length > 0 ? { ports: parsed.ports } : {}),
            ...(parsed.volumes && parsed.volumes.length > 0 ? { volumes: parsed.volumes } : {}),
            ...(parsed.environment && Object.keys(parsed.environment).length > 0 ? { environment: parsed.environment } : {}),
            ...(parsed.env_file && parsed.env_file.length > 0 ? { env_file: parsed.env_file } : {}),
            ...(parsed.networks && parsed.networks.length > 0 ? { networks: parsed.networks } : {}),
            ...(parsed.command && parsed.command.length > 0 ? { command: parsed.command } : {}),
            ...(parsed.privileged ? { privileged: parsed.privileged } : {})
          }
        }
      };

      return yaml.dump(composeObject, { indent: 2, lineWidth: -1 });
    } catch (e) {
      return `Error generating yaml: ${(e as Error).message}`;
    }
  });

  function selectPreset(type: 'nginx' | 'postgres' | 'redis') {
    if (type === 'nginx') {
      inputCommand = 'docker run -d --name my-web-server -p 80:80 -v ./html:/usr/share/nginx/html nginx:alpine';
    } else if (type === 'postgres') {
      inputCommand = 'docker run -d --name production-db -e POSTGRES_DB=mydb -e POSTGRES_USER=admin -e POSTGRES_PASSWORD=secret_pass -p 5432:5432 postgres:15';
    } else if (type === 'redis') {
      inputCommand = 'docker run -d --name cache-redis -p 6379:6379 --restart unless-stopped redis:7-alpine redis-server --appendonly yes';
    }
  }

  async function handleCopy() {
    if (!composeYaml) return;
    try {
      await navigator.clipboard.writeText(composeYaml);
      copied = true;
      setTimeout(() => {
        copied = false;
      }, 2000);
    } catch (e) {
      console.error(e);
    }
  }

  function handleDownload() {
    if (!composeYaml) return;
    const blob = new Blob([composeYaml], { type: 'text/yaml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'docker-compose.yml';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function handleClear() {
    inputCommand = '';
  }
</script>

<div class="tool-theme-workspace min-h-screen p-4 md:p-8 flex flex-col gap-6">
  <div class="max-w-6xl mx-auto w-full flex flex-col gap-6">
    
    <!-- Header -->
    <div class="border-b border-amber-500/20 pb-4">
      <h1 class="text-2xl md:text-3xl font-bold text-amber-700 dark:bg-gradient-to-r dark:from-amber-200 dark:to-yellow-500 dark:bg-clip-text dark:text-transparent">
        {t('title')}
      </h1>
      <p class="text-stone-400 text-sm mt-1">{t('subtitle')}</p>
    </div>

    <!-- Presets -->
    <div class="bg-stone-900/60 backdrop-blur border border-stone-800 p-4 rounded-xl flex flex-col gap-3">
      <span class="text-xs font-semibold text-amber-500 uppercase tracking-wider">{t('presetsTitle')}</span>
      <div class="flex flex-wrap gap-2">
        <button 
          onclick={() => selectPreset('nginx')} 
          class="text-xs bg-stone-850 hover:bg-amber-500/10 border border-stone-700 hover:border-amber-500/30 text-stone-300 hover:text-amber-400 py-1.5 px-3 rounded-lg transition"
        >
          {t('presetNginx')}
        </button>
        <button 
          onclick={() => selectPreset('postgres')} 
          class="text-xs bg-stone-850 hover:bg-amber-500/10 border border-stone-700 hover:border-amber-500/30 text-stone-300 hover:text-amber-400 py-1.5 px-3 rounded-lg transition"
        >
          {t('presetPostgres')}
        </button>
        <button 
          onclick={() => selectPreset('redis')} 
          class="text-xs bg-stone-850 hover:bg-amber-500/10 border border-stone-700 hover:border-amber-500/30 text-stone-300 hover:text-amber-400 py-1.5 px-3 rounded-lg transition"
        >
          {t('presetRedis')}
        </button>
      </div>
    </div>

    <!-- Main Workspace -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      
      <!-- Input Panel -->
      <div class="bg-stone-900/40 border border-stone-800/80 rounded-xl p-5 flex flex-col gap-4">
        <div class="flex justify-between items-center">
          <label for="docker-run-input" class="text-sm font-semibold text-stone-300">{t('inputLabel')}</label>
          <button 
            onclick={handleClear} 
            class="text-xs text-stone-500 hover:text-stone-300 transition"
          >
            {t('clearBtn')}
          </button>
        </div>
        <textarea
          id="docker-run-input"
          bind:value={inputCommand}
          placeholder={t('inputPlaceholder')}
          class="w-full h-[240px] bg-stone-950 border border-stone-800 focus:border-amber-500/50 rounded-xl p-4 text-xs font-mono text-amber-200/90 focus:outline-none transition resize-none leading-relaxed"
        ></textarea>
      </div>

      <!-- Output Panel -->
      <div class="bg-stone-900/40 border border-stone-800/80 rounded-xl p-5 flex flex-col gap-4">
        <div class="flex justify-between items-center">
          <span class="text-sm font-semibold text-stone-300">{t('outputLabel')}</span>
          <div class="flex gap-2">
            <button 
              onclick={handleCopy} 
              disabled={!composeYaml}
              class="text-xs bg-amber-500 hover:bg-amber-400 disabled:bg-stone-800 text-stone-950 font-semibold py-1.5 px-3 rounded-lg transition cursor-pointer disabled:cursor-not-allowed"
            >
              {copied ? t('copied') : t('copyBtn')}
            </button>
            <button 
              onclick={handleDownload} 
              disabled={!composeYaml}
              class="text-xs bg-stone-800 hover:bg-stone-750 disabled:bg-stone-850 text-stone-200 border border-stone-700 py-1.5 px-3 rounded-lg transition cursor-pointer disabled:cursor-not-allowed"
            >
              {t('downloadBtn')}
            </button>
          </div>
        </div>
        <pre class="w-full h-[240px] bg-stone-950 border border-stone-800 rounded-xl p-4 text-xs font-mono text-stone-300 overflow-y-auto leading-relaxed border-l-2 border-l-amber-500">{composeYaml || ''}</pre>
      </div>

    </div>

  </div>
</div>
