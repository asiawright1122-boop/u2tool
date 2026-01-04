/**
 * 生成工具的多语言翻译
 * 为所有工具生成 detailed_description, usage_steps, usage_examples 的多语言版本
 */

import * as fs from 'fs';
import * as path from 'path';

const MESSAGES_DIR = path.join(__dirname, '../src/messages');
const LOCALES = ['en', 'zh', 'es', 'pt', 'ja', 'ru', 'fr', 'ar', 'de', 'ko'];

interface ToolData {
  slug: string;
  name: string;
  description: string;
  category: string;
  detailed_description?: string;
  usage_steps?: string[];
  usage_examples?: string[];
}

/**
 * 读取JSON文件
 */
function readJsonFile(filePath: string): any {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error);
    return {};
  }
}

/**
 * 写入JSON文件
 */
function writeJsonFile(filePath: string, data: any): void {
  const content = JSON.stringify(data, null, 2);
  fs.writeFileSync(filePath, content, 'utf-8');
}

/**
 * 生成工具的详细描述（基于工具名称和描述）
 */
function generateDetailedDescription(
  toolName: string,
  description: string,
  category: string,
  locale: string
): string {
  const categoryNames: Record<string, Record<string, string>> = {
    en: {
      text: 'text processing',
      encoding: 'encoding and decoding',
      generators: 'data generation',
      converters: 'format conversion',
      development: 'development',
      security: 'security',
      network: 'network',
      image: 'image processing',
      math: 'mathematics and calculations',
      charts: 'charts and visualization',
      office: 'office tools',
    },
    zh: {
      text: '文本处理',
      encoding: '编码解码',
      generators: '数据生成',
      converters: '格式转换',
      development: '开发工具',
      security: '安全工具',
      network: '网络工具',
      image: '图像处理',
      math: '数学计算',
      charts: '图表可视化',
      office: '办公工具',
    },
    es: {
      text: 'procesamiento de texto',
      encoding: 'codificación y decodificación',
      generators: 'generación de datos',
      converters: 'conversión de formato',
      development: 'desarrollo',
      security: 'seguridad',
      network: 'red',
      image: 'procesamiento de imágenes',
      math: 'matemáticas y cálculos',
      charts: 'gráficos y visualización',
      office: 'herramientas de oficina',
    },
    pt: {
      text: 'processamento de texto',
      encoding: 'codificação e decodificação',
      generators: 'geração de dados',
      converters: 'conversão de formato',
      development: 'desenvolvimento',
      security: 'segurança',
      network: 'rede',
      image: 'processamento de imagem',
      math: 'matemática e cálculos',
      charts: 'gráficos e visualização',
      office: 'ferramentas de escritório',
    },
    ja: {
      text: 'テキスト処理',
      encoding: 'エンコード・デコード',
      generators: 'データ生成',
      converters: 'フォーマット変換',
      development: '開発ツール',
      security: 'セキュリティツール',
      network: 'ネットワークツール',
      image: '画像処理',
      math: '数学計算',
      charts: 'グラフ・可視化',
      office: 'オフィスツール',
    },
    ru: {
      text: 'обработка текста',
      encoding: 'кодирование и декодирование',
      generators: 'генерация данных',
      converters: 'конвертация форматов',
      development: 'разработка',
      security: 'безопасность',
      network: 'сеть',
      image: 'обработка изображений',
      math: 'математика и вычисления',
      charts: 'графики и визуализация',
      office: 'офисные инструменты',
    },
    fr: {
      text: 'traitement de texte',
      encoding: 'encodage et décodage',
      generators: 'génération de données',
      converters: 'conversion de format',
      development: 'développement',
      security: 'sécurité',
      network: 'réseau',
      image: 'traitement d\'image',
      math: 'mathématiques et calculs',
      charts: 'graphiques et visualisation',
      office: 'outils bureautiques',
    },
    ar: {
      text: 'معالجة النص',
      encoding: 'الترميز وفك الترميز',
      generators: 'إنشاء البيانات',
      converters: 'تحويل التنسيق',
      development: 'التطوير',
      security: 'الأمان',
      network: 'الشبكة',
      image: 'معالجة الصور',
      math: 'الرياضيات والحسابات',
      charts: 'الرسوم البيانية والتصور',
      office: 'أدوات المكتب',
    },
    de: {
      text: 'Textverarbeitung',
      encoding: 'Kodierung und Dekodierung',
      generators: 'Datengenerierung',
      converters: 'Formatkonvertierung',
      development: 'Entwicklung',
      security: 'Sicherheit',
      network: 'Netzwerk',
      image: 'Bildverarbeitung',
      math: 'Mathematik und Berechnungen',
      charts: 'Diagramme und Visualisierung',
      office: 'Büro-Tools',
    },
    ko: {
      text: '텍스트 처리',
      encoding: '인코딩 및 디코딩',
      generators: '데이터 생성',
      converters: '형식 변환',
      development: '개발',
      security: '보안',
      network: '네트워크',
      image: '이미지 처리',
      math: '수학 및 계산',
      charts: '차트 및 시각화',
      office: '사무 도구',
    },
  };

  const categoryName = categoryNames[locale]?.[category] || category;
  
  const templates: Record<string, string> = {
    en: `${toolName} is a practical online tool that helps you quickly complete various tasks. Using ${toolName}, you can easily process various data without installing any software or plugins. This tool has a simple interface and is easy to use, allowing you to get started quickly and use it efficiently. Whether you are a developer, designer, or general user, ${toolName} can help you improve work efficiency. All processing is done locally in your browser, ensuring your data security and will not be uploaded to any server. Use ${toolName} immediately to experience fast, secure, and free online tool services.`,
    zh: `${toolName} 是一个实用的在线工具，可以帮助您快速完成各种任务。使用 ${toolName}，您可以轻松处理各种数据，无需安装任何软件或插件。这个工具界面简洁，操作方便，让您能够快速上手并高效使用。无论您是开发者、设计师还是普通用户，${toolName} 都能帮助您提高工作效率。所有处理都在浏览器本地完成，确保您的数据安全，不会上传到任何服务器。立即使用 ${toolName}，体验快速、安全、免费的在线工具服务。`,
    es: `${toolName} es una herramienta en línea práctica que te ayuda a completar rápidamente diversas tareas. Usando ${toolName}, puedes procesar fácilmente varios datos sin instalar ningún software o complemento. Esta herramienta tiene una interfaz simple y es fácil de usar, permitiéndote comenzar rápidamente y usarla de manera eficiente. Ya seas desarrollador, diseñador o usuario general, ${toolName} puede ayudarte a mejorar la eficiencia del trabajo. Todo el procesamiento se realiza localmente en tu navegador, garantizando la seguridad de tus datos y no se subirá a ningún servidor. Usa ${toolName} inmediatamente para experimentar servicios de herramientas en línea rápidos, seguros y gratuitos.`,
    pt: `${toolName} é uma ferramenta online prática que ajuda você a completar rapidamente várias tarefas. Usando ${toolName}, você pode processar facilmente vários dados sem instalar nenhum software ou plugin. Esta ferramenta tem uma interface simples e é fácil de usar, permitindo que você comece rapidamente e a use com eficiência. Seja você desenvolvedor, designer ou usuário geral, ${toolName} pode ajudá-lo a melhorar a eficiência do trabalho. Todo o processamento é feito localmente no seu navegador, garantindo a segurança dos seus dados e não será enviado para nenhum servidor. Use ${toolName} imediatamente para experimentar serviços de ferramentas online rápidos, seguros e gratuitos.`,
    ja: `${toolName} は、さまざまなタスクを迅速に完了するのに役立つ実用的なオンラインツールです。${toolName} を使用すると、ソフトウェアやプラグインをインストールすることなく、さまざまなデータを簡単に処理できます。このツールはシンプルなインターフェースで使いやすく、すぐに使い始めて効率的に使用できます。開発者、デザイナー、または一般ユーザーであっても、${toolName} は作業効率の向上に役立ちます。すべての処理はブラウザでローカルに実行されるため、データの安全性が確保され、サーバーにアップロードされることはありません。${toolName} をすぐに使用して、高速で安全な無料のオンラインツールサービスを体験してください。`,
    ru: `${toolName} — это практичный онлайн-инструмент, который помогает быстро выполнять различные задачи. Используя ${toolName}, вы можете легко обрабатывать различные данные без установки какого-либо программного обеспечения или плагинов. Этот инструмент имеет простой интерфейс и прост в использовании, позволяя быстро начать работу и эффективно использовать его. Независимо от того, являетесь ли вы разработчиком, дизайнером или обычным пользователем, ${toolName} может помочь вам повысить эффективность работы. Вся обработка выполняется локально в вашем браузере, обеспечивая безопасность ваших данных и не загружая их на какой-либо сервер. Используйте ${toolName} немедленно, чтобы испытать быстрые, безопасные и бесплатные онлайн-сервисы инструментов.`,
    fr: `${toolName} est un outil en ligne pratique qui vous aide à terminer rapidement diverses tâches. En utilisant ${toolName}, vous pouvez facilement traiter diverses données sans installer de logiciel ou de plugin. Cet outil a une interface simple et est facile à utiliser, vous permettant de commencer rapidement et de l'utiliser efficacement. Que vous soyez développeur, concepteur ou utilisateur général, ${toolName} peut vous aider à améliorer l'efficacité du travail. Tout le traitement est effectué localement dans votre navigateur, garantissant la sécurité de vos données et ne sera pas téléchargé sur un serveur. Utilisez ${toolName} immédiatement pour expérimenter des services d'outils en ligne rapides, sécurisés et gratuits.`,
    ar: `${toolName} هو أداة عبر الإنترنت عملية تساعدك على إكمال المهام المختلفة بسرعة. باستخدام ${toolName}، يمكنك معالجة البيانات المختلفة بسهولة دون تثبيت أي برنامج أو مكون إضافي. هذه الأداة لها واجهة بسيطة وسهلة الاستخدام، مما يسمح لك بالبدء بسرعة واستخدامها بكفاءة. سواء كنت مطورًا أو مصممًا أو مستخدمًا عامًا، يمكن لـ ${toolName} مساعدتك في تحسين كفاءة العمل. تتم جميع المعالجة محليًا في متصفحك، مما يضمن أمان بياناتك ولن يتم تحميلها على أي خادم. استخدم ${toolName} فورًا لتجربة خدمات الأدوات عبر الإنترنت السريعة والآمنة والمجانية.`,
    de: `${toolName} ist ein praktisches Online-Tool, das Ihnen hilft, verschiedene Aufgaben schnell zu erledigen. Mit ${toolName} können Sie verschiedene Daten problemlos verarbeiten, ohne Software oder Plugins zu installieren. Dieses Tool hat eine einfache Benutzeroberfläche und ist einfach zu verwenden, sodass Sie schnell loslegen und es effizient nutzen können. Egal, ob Sie Entwickler, Designer oder allgemeiner Benutzer sind, ${toolName} kann Ihnen helfen, die Arbeitseffizienz zu verbessern. Die gesamte Verarbeitung erfolgt lokal in Ihrem Browser und gewährleistet die Sicherheit Ihrer Daten und wird nicht auf einen Server hochgeladen. Verwenden Sie ${toolName} sofort, um schnelle, sichere und kostenlose Online-Tool-Dienste zu erleben.`,
    ko: `${toolName}은 다양한 작업을 빠르게 완료하는 데 도움이 되는 실용적인 온라인 도구입니다. ${toolName}을 사용하면 소프트웨어나 플러그인을 설치하지 않고도 다양한 데이터를 쉽게 처리할 수 있습니다. 이 도구는 간단한 인터페이스를 가지고 있으며 사용하기 쉬워 빠르게 시작하고 효율적으로 사용할 수 있습니다. 개발자, 디자이너 또는 일반 사용자이든 ${toolName}은 작업 효율성을 향상시키는 데 도움이 될 수 있습니다. 모든 처리는 브라우저에서 로컬로 수행되므로 데이터 보안이 보장되며 서버에 업로드되지 않습니다. ${toolName}을 즉시 사용하여 빠르고 안전하며 무료인 온라인 도구 서비스를 경험하세요.`,
  };

  return templates[locale] || templates.en;
}

/**
 * 生成使用步骤
 */
function generateUsageSteps(toolName: string, locale: string): string[] {
  const templates: Record<string, string[]> = {
    en: [
      `Open the ${toolName} tool page`,
      'Enter or paste the content you want to process in the input box',
      'Adjust tool options and settings as needed',
      'Click the process button to view the results',
      'Copy or download the processed results',
    ],
    zh: [
      `打开 ${toolName} 工具页面`,
      '在输入框中输入或粘贴您要处理的内容',
      '根据需要调整工具选项和设置',
      '点击处理按钮，查看结果',
      '复制或下载处理后的结果',
    ],
    es: [
      `Abre la página de la herramienta ${toolName}`,
      'Ingresa o pega el contenido que deseas procesar en el cuadro de entrada',
      'Ajusta las opciones y configuraciones de la herramienta según sea necesario',
      'Haz clic en el botón de procesar para ver los resultados',
      'Copia o descarga los resultados procesados',
    ],
    pt: [
      `Abra a página da ferramenta ${toolName}`,
      'Digite ou cole o conteúdo que deseja processar na caixa de entrada',
      'Ajuste as opções e configurações da ferramenta conforme necessário',
      'Clique no botão de processar para ver os resultados',
      'Copie ou baixe os resultados processados',
    ],
    ja: [
      `${toolName} ツールページを開く`,
      '入力ボックスに処理したいコンテンツを入力または貼り付けます',
      '必要に応じてツールオプションと設定を調整します',
      '処理ボタンをクリックして結果を表示します',
      '処理された結果をコピーまたはダウンロードします',
    ],
    ru: [
      `Откройте страницу инструмента ${toolName}`,
      'Введите или вставьте содержимое, которое вы хотите обработать, в поле ввода',
      'При необходимости настройте параметры и настройки инструмента',
      'Нажмите кнопку обработки, чтобы просмотреть результаты',
      'Скопируйте или загрузите обработанные результаты',
    ],
    fr: [
      `Ouvrez la page de l'outil ${toolName}`,
      'Entrez ou collez le contenu que vous souhaitez traiter dans la zone de saisie',
      'Ajustez les options et paramètres de l\'outil selon vos besoins',
      'Cliquez sur le bouton de traitement pour afficher les résultats',
      'Copiez ou téléchargez les résultats traités',
    ],
    ar: [
      `افتح صفحة أداة ${toolName}`,
      'أدخل أو الصق المحتوى الذي تريد معالجته في مربع الإدخال',
      'اضبط خيارات وإعدادات الأداة حسب الحاجة',
      'انقر فوق زر المعالجة لعرض النتائج',
      'انسخ أو قم بتنزيل النتائج المعالجة',
    ],
    de: [
      `Öffnen Sie die ${toolName}-Tool-Seite`,
      'Geben Sie den Inhalt, den Sie verarbeiten möchten, in das Eingabefeld ein oder fügen Sie ihn ein',
      'Passen Sie die Tool-Optionen und -Einstellungen nach Bedarf an',
      'Klicken Sie auf die Schaltfläche Verarbeiten, um die Ergebnisse anzuzeigen',
      'Kopieren oder laden Sie die verarbeiteten Ergebnisse herunter',
    ],
    ko: [
      `${toolName} 도구 페이지 열기`,
      '입력 상자에 처리하려는 내용을 입력하거나 붙여넣습니다',
      '필요에 따라 도구 옵션 및 설정을 조정합니다',
      '처리 버튼을 클릭하여 결과를 봅니다',
      '처리된 결과를 복사하거나 다운로드합니다',
    ],
  };

  return templates[locale] || templates.en;
}

/**
 * 生成使用示例
 */
function generateUsageExamples(toolName: string, locale: string): string[] {
  const templates: Record<string, string[]> = {
    en: [
      `Use ${toolName} to process your data`,
      'Get processing results quickly without waiting',
    ],
    zh: [
      `使用 ${toolName} 处理您的数据`,
      '快速获得处理结果，无需等待',
    ],
    es: [
      `Usa ${toolName} para procesar tus datos`,
      'Obtén resultados de procesamiento rápidamente sin esperar',
    ],
    pt: [
      `Use ${toolName} para processar seus dados`,
      'Obtenha resultados de processamento rapidamente sem esperar',
    ],
    ja: [
      `${toolName} を使用してデータを処理する`,
      '待機せずに処理結果を迅速に取得',
    ],
    ru: [
      `Используйте ${toolName} для обработки ваших данных`,
      'Быстро получайте результаты обработки без ожидания',
    ],
    fr: [
      `Utilisez ${toolName} pour traiter vos données`,
      'Obtenez rapidement les résultats du traitement sans attendre',
    ],
    ar: [
      `استخدم ${toolName} لمعالجة بياناتك`,
      'احصل على نتائج المعالجة بسرعة دون انتظار',
    ],
    de: [
      `Verwenden Sie ${toolName}, um Ihre Daten zu verarbeiten`,
      'Erhalten Sie Verarbeitungsergebnisse schnell ohne Warten',
    ],
    ko: [
      `${toolName}을 사용하여 데이터 처리`,
      '대기 없이 처리 결과를 빠르게 얻기',
    ],
  };

  return templates[locale] || templates.en;
}

/**
 * 主函数
 */
function main() {
  console.log('开始生成工具的多语言翻译...\n');

  // 读取中文翻译文件作为参考
  const zhData = readJsonFile(path.join(MESSAGES_DIR, 'zh.json'));
  const tools = zhData.tools || {};

  // 为每种语言生成翻译
  for (const locale of LOCALES) {
    if (locale === 'zh') continue; // 跳过中文，因为它是参考

    console.log(`处理语言: ${locale}`);
    const localeData = readJsonFile(path.join(MESSAGES_DIR, `${locale}.json`));
    const localeTools = localeData.tools || {};

    let updated = 0;
    for (const [slug, zhTool] of Object.entries(tools)) {
      const tool = zhTool as any;
      // 确保localeTool是对象，不是字符串或其他类型
      let localeTool: any = localeTools[slug];
      if (!localeTool || typeof localeTool !== 'object' || Array.isArray(localeTool)) {
        localeTool = {};
      }

      // 获取目标语言的工具名称（优先使用目标语言的name，如果没有则使用slug格式化）
      let toolName = localeTool.name;
      if (!toolName || typeof toolName !== 'string') {
        // 如果目标语言没有name，从slug生成一个合理的名称
        toolName = slug.split('-').map(word => 
          word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
      }
      
      // 确保工具名称不包含中文字符（如果包含，则从slug生成）
      if (/[\u4e00-\u9fa5]/.test(toolName)) {
        toolName = slug.split('-').map(word => 
          word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
      }

      // 检测中文字符的函数
      const hasChinese = (text: string) => /[\u4e00-\u9fa5]/.test(text);

      // 如果中文有详细描述，但目标语言没有或包含中文，则生成
      if (tool.detailed_description) {
        if (!localeTool.detailed_description || hasChinese(localeTool.detailed_description)) {
          localeTool.detailed_description = generateDetailedDescription(
            toolName,
            localeTool.description || tool.description || '',
            tool.category || '',
            locale
          );
          updated++;
        }
      }

      // 如果中文有使用步骤，但目标语言没有或包含中文，则生成
      if (tool.usage_steps) {
        const needsUpdate = !localeTool.usage_steps || 
          (Array.isArray(localeTool.usage_steps) && localeTool.usage_steps.some((s: string) => hasChinese(s)));
        if (needsUpdate) {
          localeTool.usage_steps = generateUsageSteps(toolName, locale);
          updated++;
        }
      }

      // 如果中文有使用示例，但目标语言没有或包含中文，则生成
      if (tool.usage_examples) {
        const needsUpdate = !localeTool.usage_examples || 
          (Array.isArray(localeTool.usage_examples) && localeTool.usage_examples.some((ex: string) => hasChinese(ex)));
        if (needsUpdate) {
          localeTool.usage_examples = generateUsageExamples(toolName, locale);
          updated++;
        }
      }

      // 确保工具对象存在
      if (!localeTools[slug] || typeof localeTools[slug] !== 'object') {
        localeTools[slug] = {};
      }
      // 合并翻译内容
      localeTools[slug] = {
        ...localeTools[slug],
        ...localeTool,
      };
    }

    localeData.tools = localeTools;
    writeJsonFile(path.join(MESSAGES_DIR, `${locale}.json`), localeData);
    console.log(`  ✓ ${locale}: 更新了 ${updated} 个工具\n`);
  }

  console.log('完成！所有语言的翻译已生成。');
}

main();
