/**
 * FAQ 内容系统
 * 为工具页面生成 FAQ 内容和结构化数据
 * 支持多语言、自然语言问题格式、JSON-LD 输出
 */

import { generateFAQJsonLd as generateFAQJsonLdFromSeo, type JsonLdData } from './seo';
import { getToolSpecificFAQs } from './tool-specific-faqs';

// FAQ 项目接口
export interface FAQItem {
  question: string;
  answer: string;
}

// 工具 FAQ 配置接口
export interface ToolFAQ {
  slug: string;
  faqs: Record<string, FAQItem[]>; // locale -> FAQs
}

// 问题模式前缀（用于生成自然语言问题）
const QUESTION_PATTERNS = {
  en: {
    howTo: 'How do I',
    whatIs: 'What is',
    why: 'Why should I use',
    can: 'Can I',
    is: 'Is',
  },
  zh: {
    howTo: '如何',
    whatIs: '什么是',
    why: '为什么要使用',
    can: '我可以',
    is: '这个工具是否',
  },
  es: {
    howTo: 'Cómo',
    whatIs: 'Qué es',
    why: 'Por qué debería usar',
    can: 'Puedo',
    is: 'Es',
  },
  pt: {
    howTo: 'Como',
    whatIs: 'O que é',
    why: 'Por que devo usar',
    can: 'Posso',
    is: 'É',
  },
  ja: {
    howTo: 'どのように',
    whatIs: 'とは何ですか',
    why: 'なぜ使うべきですか',
    can: 'できますか',
    is: 'ですか',
  },
  ru: {
    howTo: 'Как',
    whatIs: 'Что такое',
    why: 'Зачем использовать',
    can: 'Могу ли я',
    is: 'Является ли',
  },
  fr: {
    howTo: 'Comment',
    whatIs: 'Qu\'est-ce que',
    why: 'Pourquoi utiliser',
    can: 'Puis-je',
    is: 'Est-ce',
  },
  de: {
    howTo: 'Wie',
    whatIs: 'Was ist',
    why: 'Warum nutzen',
    can: 'Kann ich',
    is: 'Ist',
  },
  ko: {
    howTo: '어떻게',
    whatIs: '무엇인가요',
    why: '왜 사용해야 하나요',
    can: '할 수 있나요',
    is: '입니까',
  },
  ar: {
    howTo: 'كيف',
    whatIs: 'ما هو',
    why: 'لماذا استخدام',
    can: 'هل يمكنني',
    is: 'هل',
  },
} as const;


// 通用 FAQ 模板（按分类）
const GENERIC_FAQ_TEMPLATES: Record<string, Record<string, FAQItem[]>> = {
  formatters: {
    en: [
      {
        question: 'How do I use this formatter tool?',
        answer: 'Simply paste your code or data into the input field, adjust any formatting options if needed, and click the Format button. The formatted result will appear in the output area.',
      },
      {
        question: 'What is the maximum input size supported?',
        answer: 'This tool processes data entirely in your browser, so there is no server-side limit. However, very large files may affect browser performance.',
      },
      {
        question: 'Is my data safe when using this tool?',
        answer: 'Yes, absolutely. All processing happens locally in your browser. Your data never leaves your device and is not sent to any server.',
      },
    ],
    zh: [
      {
        question: '如何使用这个格式化工具？',
        answer: '只需将代码或数据粘贴到输入框中，根据需要调整格式化选项，然后点击格式化按钮。格式化后的结果将显示在输出区域。',
      },
      {
        question: '支持的最大输入大小是多少？',
        answer: '此工具完全在浏览器中处理数据，因此没有服务器端限制。但是，非常大的文件可能会影响浏览器性能。',
      },
      {
        question: '使用此工具时我的数据安全吗？',
        answer: '是的，绝对安全。所有处理都在您的浏览器本地进行。您的数据永远不会离开您的设备，也不会发送到任何服务器。',
      },
    ],
    es: [
      {
        question: '¿Cómo uso esta herramienta de formateo?',
        answer: 'Simplemente pegue su código o datos en el campo de entrada, ajuste las opciones de formato si es necesario y haga clic en el botón Formatear. El resultado formateado aparecerá en el área de salida.',
      },
      {
        question: '¿Cuál es el tamaño máximo de entrada soportado?',
        answer: 'Esta herramienta procesa datos completamente en su navegador, por lo que no hay límite del lado del servidor. Sin embargo, los archivos muy grandes pueden afectar el rendimiento del navegador.',
      },
      {
        question: '¿Están seguros mis datos al usar esta herramienta?',
        answer: 'Sí, absolutamente. Todo el procesamiento ocurre localmente en su navegador. Sus datos nunca salen de su dispositivo y no se envían a ningún servidor.',
      },
    ],
    pt: [
      {
        question: 'Como uso esta ferramenta de formatação?',
        answer: 'Basta colar seu código ou dados no campo de entrada, ajustar as opções de formatação, se necessário, e clicar no botão Formatar. O resultado formatado aparecerá na área de saída.',
      },
      {
        question: 'Qual é o tamanho máximo de entrada suportado?',
        answer: 'Esta ferramenta processa dados inteiramente em seu navegador, portanto, não há limite do lado do servidor. No entanto, arquivos muito grandes podem afetar o desempenho do navegador.',
      },
      {
        question: 'Meus dados estão seguros ao usar esta ferramenta?',
        answer: 'Sim, concelhos. Todo o processamento ocorre localmente no seu navegador. Seus dados nunca saem do seu dispositivo e não são enviados para nenhum servidor.',
      },
    ],
    ja: [
      {
        question: 'このフォーマッタツールの使い方は？',
        answer: 'コードまたはデータを入力フィールドに貼り付け、必要に応じてフォーマットオプションを調整し、フォーマットボタンをクリックするだけです。フォーマットされた結果が出力エリアに表示されます。',
      },
      {
        question: 'サポートされている最大入力サイズは？',
        answer: 'このツールはデータを完全にブラウザで処理するため、サーバー側の制限はありません。ただし、非常に大きなファイルはブラウザのパフォーマンスに影響を与える可能性があります。',
      },
      {
        question: 'このツールを使用するとき、データは安全ですか？',
        answer: 'はい、絶対に安全です。すべての処理はブラウザ内でローカルに行われます。データがデバイスから離れることはなく、サーバーに送信されることもありません。',
      },
    ],
    ru: [
      {
        question: 'Как использовать этот инструмент форматирования?',
        answer: 'Просто вставьте свой код или данные в поле ввода, при необходимости настройте параметры форматирования и нажмите кнопку «Форматировать». Отформатированный результат появится в области вывода.',
      },
      {
        question: 'Какой максимальный размер ввода поддерживается?',
        answer: 'Этот инструмент обрабатывает данные полностью в вашем браузере, поэтому ограничения на стороне сервера нет. Однако очень большие файлы могут повлиять на производительность браузера.',
      },
      {
        question: 'Безопасны ли мои данные при использовании этого инструмента?',
        answer: 'Да, абсолютно. Вся обработка происходит локально в вашем браузере. Ваши данные никогда не покидают ваше устройство и не отправляются ни на какой сервер.',
      },
    ],
    fr: [
      {
        question: 'Comment utiliser et outil de formatage ?',
        answer: 'Collez simplement votre code ou vos données dans le champ de saisie, ajustez les options de formatage si nécessaire et cliquez sur le bouton Formater. Le résultat formaté apparaîtra dans la zone de sortie.',
      },
      {
        question: 'Quelle est la taille maximale d\'entrée prise en charge ?',
        answer: 'Cet outil traite les données entièrement dans votre navigateur, il n\'y a donc aucune limite côté serveur. Cependant, les fichiers très volumineux peuvent affecter les performances du navigateur.',
      },
      {
        question: 'Mes données sont-elles en sécurité lors de l\'utilisation de cet outil ?',
        answer: 'Oui, absolument. Tout le traitement se fait localement dans votre navigateur. Vos données ne quittent jamais votre appareil et ne sont envoyées à aucun serveur.',
      },
    ],
    de: [
      {
        question: 'Wie benutze ich dieses Formatierungswerkzeug?',
        answer: 'Fügen Sie einfach Ihren Code oder Ihre Daten in das Eingabefeld ein, passen Sie bei Bedarf die Formatierungsoptionen an und klicken Sie auf die Schaltfläche Formatieren. Das formatierte Ergebnis wird im Ausgabebereich angezeigt.',
      },
      {
        question: 'Was ist die maximal unterstützte Eingabegröße?',
        answer: 'Dieses Tool verarbeitet Daten vollständig in Ihrem Browser, daher gibt es kein serverseitiges Limit. Sehr große Dateien können jedoch die Browserleistung beeinträchtigen.',
      },
      {
        question: 'Sind meine Daten bei der Verwendung dieses Tools sicher?',
        answer: 'Ja, absolut. Die gesamte Verarbeitung erfolgt lokal in Ihrem Browser. Ihre Daten verlassen niemals Ihr Gerät und werden an keinen Server gesendet.',
      },
    ],
    ko: [
      {
        question: '이 포맷터 도구는 어떻게 사용하나요?',
        answer: '코드나 데이터를 입력 필드에 붙여넣고 필요한 경우 포맷 옵션을 조정한 다음 포맷 버튼을 클릭하기만 하면 됩니다. 포맷된 결과가 출력 영역에 나타납니다.',
      },
      {
        question: '지원되는 최대 입력 크기는 얼마인가요?',
        answer: '이 도구는 데이터를 전적으로 브라우저에서 처리하므로 서버 측 제한이 없습니다. 그러나 매우 큰 파일은 브라우저 성능에 영향을 줄 수 있습니다.',
      },
      {
        question: '이 도구를 사용할 때 내 데이터는 안전한가요?',
        answer: '네, 절대적으로 안전합니다. 모든 처리는 브라우저에서 로컬로 이루어집니다. 데이터는 장치를 떠나지 않으며 서버로 전송되지 않습니다.',
      },
    ],
    ar: [
      {
        question: 'كيف أستخدم أداة التنسيق هذه؟',
        answer: 'ما عليك سوى لصق الكود أو البيانات في حقل الإدخال، وضبط أي خيارات تنسيق إذا لزم الأمر، والنقر فوق زر التنسيق. ستظهر النتيجة المنسقة في منطقة الإخراج.',
      },
      {
        question: 'ما هو الحد الأقصى لحجم الإدخال المدعوم؟',
        answer: 'تقوم هذه الأداة بمعالجة البيانات بالكامل في متصفحك، لذلك لا يوجد حد من جانب الخادم. ومع ذلك، قد تؤثر الملفات الكبيرة جدًا على أداء المتصفح.',
      },
      {
        question: 'هل بياناتي آمنة عند استخدام هذه الأداة؟',
        answer: 'نعم، بالتأكيد. تتم جميع المعالجات محليًا في متصفحك. بياناتك لا تغادر جهازك أبدًا ولا يتم إرسالها إلى أي خادم.',
      },
    ],
  },
  encoders: {
    en: [
      {
        question: 'How do I encode or decode data with this tool?',
        answer: 'Enter your text in the input field, select encode or decode mode, and click the corresponding button. The result will be displayed instantly.',
      },
      {
        question: 'What character encoding does this tool support?',
        answer: 'This tool supports UTF-8 encoding by default, which covers most international characters and symbols.',
      },
      {
        question: 'Can I use this tool offline?',
        answer: 'Yes, once the page is loaded, you can use this tool without an internet connection as all processing happens in your browser.',
      },
    ],
    zh: [
      {
        question: '如何使用此工具编码或解码数据？',
        answer: '在输入框中输入文本，选择编码或解码模式，然后点击相应的按钮。结果将立即显示。',
      },
      {
        question: '此工具支持什么字符编码？',
        answer: '此工具默认支持 UTF-8 编码，涵盖大多数国际字符和符号。',
      },
      {
        question: '我可以离线使用此工具吗？',
        answer: '是的，页面加载后，您可以在没有互联网连接的情况下使用此工具，因为所有处理都在浏览器中进行。',
      },
    ],
    es: [
      {
        question: '¿Cómo codifico o decodifico datos con esta herramienta?',
        answer: 'Ingrese su texto en el campo de entrada, seleccione el modo de codificación o decodificación y haga clic en el botón correspondiente. El resultado se mostrará al instante.',
      },
      {
        question: '¿Qué codificación de caracteres admite esta herramienta?',
        answer: 'Esta herramienta admite la codificación UTF-8 por defecto, que cubre la mayoría de los caracteres y símbolos internacionales.',
      },
      {
        question: '¿Puedo usar esta herramienta sin conexión?',
        answer: 'Sí, una vez cargada la página, puede usar esta herramienta sin conexión a Internet, ya que todo el procesamiento ocurre en su navegador.',
      },
    ],
    pt: [
      {
        question: 'Como codificar ou decodificar dados com esta ferramenta?',
        answer: 'Insira seu texto no campo de entrada, selecione o modo de codificação ou decodificação e clique no botão correspondente. O resultado será exibido instantaneamente.',
      },
      {
        question: 'Qual codificação de caracteres esta ferramenta suporta?',
        answer: 'Esta ferramenta suporta codificação UTF-8 por padrão, que cobre a maioria dos caracteres e símbolos internacionais.',
      },
      {
        question: 'Posso usar esta ferramenta offline?',
        answer: 'Sim, uma vez que a página é carregada, você pode usar esta ferramenta sem conexão com a internet, pois todo o processamento acontece no seu navegador.',
      },
    ],
    ja: [
      {
        question: 'このツールでデータをエンコードまたはデコードするには？',
        answer: '入力フィールドにテキストを入力し、エンコードまたはデコードモードを選択して、対応するボタンをクリックします。結果はすぐに表示されます。',
      },
      {
        question: 'このツールはどの文字エンコーディングをサポートしていますか？',
        answer: 'このツールはデフォルトでUTF-8エンコーディングをサポートしており、ほとんどの国際文字と記号をカバーしています。',
      },
      {
        question: 'このツールをオフラインで使用できますか？',
        answer: 'はい、ページが読み込まれたら、すべての処理がブラウザ内で行われるため、インターネット接続なしでこのツールを使用できます。',
      },
    ],
    ru: [
      {
        question: 'Как закодировать или декодировать данные с помощью этого инструмента?',
        answer: 'Введите текст в поле ввода, выберите режим кодирования или декодирования и нажмите соответствующую кнопку. Результат будет отображен мгновенно.',
      },
      {
        question: 'Какую кодировку символов поддерживает этот инструмент?',
        answer: 'Этот инструмент по умолчанию поддерживает кодировку UTF-8, которая охватывает большинство международных символов и символов.',
      },
      {
        question: 'Могу ли я использовать этот инструмент в автономном режиме?',
        answer: 'Да, после загрузки страницы вы можете использовать этот инструмент без подключения к Интернету, так как вся обработка происходит в вашем браузере.',
      },
    ],
    fr: [
      {
        question: 'Comment encoder ou décoder des données avec cet outil ?',
        answer: 'Entrez votre texte dans le champ de saisie, sélectionnez le mode d\'encodage ou de décodage et cliquez sur le bouton correspondant. Le résultat s\'affichera instantanément.',
      },
      {
        question: 'Quel encodage de caractères cet outil prend-il en charge ?',
        answer: 'Cet outil prend en charge l\'encodage UTF-8 par défaut, qui couvre la plupart des caractères et symboles internationaux.',
      },
      {
        question: 'Puis-je utiliser cet outil hors ligne ?',
        answer: 'Oui, une fois la page chargée, vous pouvez utiliser cet outil sans connexion Internet car tout le traitement se fait dans votre navigateur.',
      },
    ],
    de: [
      {
        question: 'Wie kodiere oder dekodiere ich Daten mit diesem Werkzeug?',
        answer: 'Geben Sie Ihren Text in das Eingabefeld ein, wählen Sie den Kodierungs- oder Dekodierungsmodus und klicken Sie auf die entsprechende Schaltfläche. Das Ergebnis wird sofort angezeigt.',
      },
      {
        question: 'Welche Zeichenkodierung unterstützt dieses Werkzeug?',
        answer: 'Dieses Werkzeug unterstützt standardmäßig die UTF-8-Kodierung, die die meisten internationalen Zeichen und Symbole abdeckt.',
      },
      {
        question: 'Kann ich dieses Werkzeug offline verwenden?',
        answer: 'Ja, sobald die Seite geladen ist, können Sie dieses Werkzeug ohne Internetverbindung verwenden, da die gesamte Verarbeitung in Ihrem Browser erfolgt.',
      },
    ],
    ko: [
      {
        question: '이 도구로 데이터를 인코딩하거나 디코딩하려면 어떻게 해야 하나요?',
        answer: '입력 필드에 텍스트를 입력하고 인코딩 또는 디코딩 모드를 선택한 다음 해당 버튼을 클릭하세요. 결과가 즉시 표시됩니다.',
      },
      {
        question: '이 도구는 어떤 문자 인코딩을 지원하나요?',
        answer: '이 도구는 기본적으로 UTF-8 인코딩을 지원하며, 대부분의 국제 문자와 기호를 포함합니다.',
      },
      {
        question: '이 도구를 오프라인에서 사용할 수 있나요?',
        answer: '네, 페이지가 로드되면 모든 처리가 브라우저에서 이루어지므로 인터넷 연결 없이 이 도구를 사용할 수 있습니다.',
      },
    ],
    ar: [
      {
        question: 'كيف يمكنني تشفير أو فك تشفير البيانات باستخدام هذه الأداة؟',
        answer: 'أدخل النص الخاص بك في حقل الإدخال، وحدد وضع التشفير أو فك التشفير، وانقر فوق الزر المقابل. سيتم عرض النتيجة على الفور.',
      },
      {
        question: 'ما هو تشفير الأحرف الذي تدعمه هذه الأداة؟',
        answer: 'تدعم هذه الأداة تشفير UTF-8 بشكل افتراضي، والذي يغطي معظم الأحرف والرموز الدولية.',
      },
      {
        question: 'هل يمكنني استخدام هذه الأداة دون اتصال بالإنترنت؟',
        answer: 'نعم، بمجرد تحميل الصفحة، يمكنك استخدام هذه الأداة دون اتصال بالإنترنت لأن كل المعالجة تتم في متصفحك.',
      },
    ],
  },
  generators: {
    en: [
      {
        question: 'How do I generate data with this tool?',
        answer: 'Configure your desired options and parameters, then click the Generate button. You can copy the result or generate new data as needed.',
      },
      {
        question: 'Is the generated data unique?',
        answer: 'Yes, each generation produces unique results based on cryptographically secure random algorithms.',
      },
      {
        question: 'Can I customize the output format?',
        answer: 'Yes, most generator tools offer various customization options. Check the settings panel for available options.',
      },
    ],
    zh: [
      {
        question: '如何使用此工具生成数据？',
        answer: '配置所需的选项和参数，然后点击生成按钮。您可以复制结果或根据需要生成新数据。',
      },
      {
        question: '生成的数据是唯一的吗？',
        answer: '是的，每次生成都会基于加密安全的随机算法产生唯一的结果。',
      },
      {
        question: '我可以自定义输出格式吗？',
        answer: '是的，大多数生成器工具提供各种自定义选项。请查看设置面板了解可用选项。',
      },
    ],
    es: [
      {
        question: '¿Cómo genero datos con esta herramienta?',
        answer: 'Configure las opciones y parámetros deseados, luego haga clic en el botón Generar. Puede copiar el resultado o generar nuevos datos según sea necesario.',
      },
      {
        question: '¿Son únicos los datos generados?',
        answer: 'Sí, cada generación produce resultados únicos basados en algoritmos aleatorios criptográficamente seguros.',
      },
      {
        question: '¿Puedo personalizar el formato de salida?',
        answer: 'Sí, la mayoría de las herramientas generadoras ofrecen varias opciones de personalización. Consulte el panel de configuración para ver las opciones disponibles.',
      },
    ],
    pt: [
      {
        question: 'Como gero dados com esta ferramenta?',
        answer: 'Configure as opções e parâmetros desejados, depois clique no botão Gerar. Você pode copiar o resultado ou gerar novos dados conforme necessário.',
      },
      {
        question: 'Os dados gerados são únicos?',
        answer: 'Sim, cada geração produz resultados únicos baseados em algoritmos aleatórios criptograficamente seguros.',
      },
      {
        question: 'Posso personalizar o formato de saída?',
        answer: 'Sim, a maioria das ferramentas geradoras oferece várias opções de personalização. Verifique o painel de configurações para opções disponíveis.',
      },
    ],
    ja: [
      {
        question: 'このツールでデータを生成するには？',
        answer: '希望するオプションとパラメータを設定し、生成ボタンをクリックします。結果をコピーしたり、必要に応じて新しいデータを生成したりできます。',
      },
      {
        question: '生成されたデータはユニークですか？',
        answer: 'はい、各生成は暗号学的に安全なランダムアルゴリズムに基づいてユニークな結果を生成します。',
      },
      {
        question: '出力形式をカスタマイズできますか？',
        answer: 'はい、ほとんどのジェネレーターツールはさまざまなカスタマイズオプションを提供しています。利用可能なオプションについては設定パネルを確認してください。',
      },
    ],
    ru: [
      {
        question: 'Как сгенерировать данные с помощью этого инструмента?',
        answer: 'Настройте желаемые параметры, затем нажмите кнопку «Сгенерировать». Вы можете скопировать результат или сгенерировать новые данные по мере необходимости.',
      },
      {
        question: 'Являются ли сгенерированные данные уникальными?',
        answer: 'Да, каждая генерация дает уникальные результаты на основе криптографически стойких случайных алгоритмов.',
      },
      {
        question: 'Могу ли я настроить формат вывода?',
        answer: 'Да, большинство инструментов-генераторов предлагают различные параметры настройки. Проверьте панель настроек на наличие доступных опций.',
      },
    ],
    fr: [
      {
        question: 'Comment générer des données avec cet outil ?',
        answer: 'Configurez vos options et paramètres souhaités, puis cliquez sur le bouton Générer. Vous pouvez copier le résultat ou générer de nouvelles données selon vos besoins.',
      },
      {
        question: 'Les données générées sont-elles uniques ?',
        answer: 'Oui, chaque génération produit des résultats uniques basés sur des algorithmes aléatoires cryptographiquement sécurisés.',
      },
      {
        question: 'Puis-je personnaliser le format de sortie ?',
        answer: 'Oui, la plupart des outils générateurs offrent diverses options de personnalisation. Consultez le panneau des paramètres pour les options disponibles.',
      },
    ],
    de: [
      {
        question: 'Wie generiere ich Daten mit diesem Werkzeug?',
        answer: 'Konfigurieren Sie Ihre gewünschten Optionen und Parameter und klicken Sie dann auf die Schaltfläche Generieren. Sie können das Ergebnis kopieren oder nach Bedarf neue Daten generieren.',
      },
      {
        question: 'Sind die generierten Daten einzigartig?',
        answer: 'Ja, jede Generierung liefert einzigartige Ergebnisse basierend auf kryptographisch sicheren Zufallsalgorithmen.',
      },
      {
        question: 'Kann ich das Ausgabeformat anpassen?',
        answer: 'Ja, die meisten Generator-Tools bieten verschiedene Anpassungsoptionen. Überprüfen Sie das Einstellungsfeld auf verfügbare Optionen.',
      },
    ],
    ko: [
      {
        question: '이 도구로 데이터를 생성하려면 어떻게 해야 하나요?',
        answer: '원하는 옵션과 매개변수를 구성한 다음 생성 버튼을 클릭하세요. 결과를 복사하거나 필요에 따라 새 데이터를 생성할 수 있습니다.',
      },
      {
        question: '생성된 데이터는 고유한가요?',
        answer: '네, 각 생성은 암호학적으로 안전한 무작위 알고리즘을 기반으로 고유한 결과를 생성합니다.',
      },
      {
        question: '출력 형식을 사용자 정의할 수 있나요?',
        answer: '네, 대부분의 생성기 도구는 다양한 사용자 정의 옵션을 제공합니다. 사용 가능한 옵션은 설정 패널을 확인하세요.',
      },
    ],
    ar: [
      {
        question: 'كيف يمكنني توليد البيانات باستخدام هذه الأداة؟',
        answer: 'قم بتكوين الخيارات والمعلمات التي تريدها، ثم انقر فوق زر التوليد. يمكنك نسخ النتيجة أو توليد بيانات جديدة حسب الحاجة.',
      },
      {
        question: 'هل البيانات المولدة فريدة؟',
        answer: 'نعم، ينتج كل توليد نتائج فريدة بناءً على خوارزميات عشوائية آمنة التشفير.',
      },
      {
        question: 'هل يمكنني تخصيص تنسيق الإخراج؟',
        answer: 'نعم، توفر معظم أدوات التوليد خيارات تخصيص مختلفة. تحقق من لوحة الإعدادات للخيارات المتاحة.',
      },
    ],
  },
  converters: {
    en: [
      {
        question: 'How do I convert data between formats?',
        answer: 'Paste or upload your source data, select the target format if applicable, and click Convert. The converted result will be ready to copy or download.',
      },
      {
        question: 'What happens if my input data is invalid?',
        answer: 'The tool will display an error message indicating what went wrong. Check your input format and try again.',
      },
      {
        question: 'Can I convert large files?',
        answer: 'Yes, but performance depends on your browser and device. For very large files, consider splitting them into smaller chunks.',
      },
    ],
    zh: [
      {
        question: '如何在不同格式之间转换数据？',
        answer: '粘贴或上传源数据，如果适用请选择目标格式，然后点击转换。转换后的结果可以复制或下载。',
      },
      {
        question: '如果输入数据无效会怎样？',
        answer: '工具将显示错误消息，指出问题所在。请检查输入格式并重试。',
      },
      {
        question: '我可以转换大文件吗？',
        answer: '可以，但性能取决于您的浏览器和设备。对于非常大的文件，建议将其分成较小的块。',
      },
    ],
    es: [
      {
        question: '¿Cómo convierto datos entre formatos?',
        answer: 'Pegue o suba sus datos fuente, seleccione el formato de destino si corresponde y haga clic en Convertir. El resultado convertido estará listo para copiar o descargar.',
      },
      {
        question: '¿Qué sucede si mis datos de entrada no son válidos?',
        answer: 'La herramienta mostrará un mensaje de error indicando qué salió mal. Verifique su formato de entrada e intente nuevamente.',
      },
      {
        question: '¿Puedo convertir archivos grandes?',
        answer: 'Sí, pero el rendimiento depende de su navegador y dispositivo. Para archivos muy grandes, considere dividirlos en partes más pequeñas.',
      },
    ],
    pt: [
      {
        question: 'Como converto dados entre formatos?',
        answer: 'Cole ou carregue seus dados de origem, selecione o formato de destino se aplicável e clique em Converter. O resultado convertido estará pronto para copiar ou baixar.',
      },
      {
        question: 'O que acontece se meus dados de entrada forem inválidos?',
        answer: 'A ferramenta exibirá uma mensagem de erro indicando o que deu errado. Verifique seu formato de entrada e tente novamente.',
      },
      {
        question: 'Posso converter arquivos grandes?',
        answer: 'Sim, mas o desempenho depende do seu navegador e dispositivo. Para arquivos muito grandes, considere dividi-los em pedaços menores.',
      },
    ],
    ja: [
      {
        question: 'フォーマット間でデータを変換するには？',
        answer: 'ソースデータを貼り付けるかアップロードし、該当する場合はターゲットフォーマットを選択して変換をクリックします。変換された結果はコピーまたはダウンロードの準備ができています。',
      },
      {
        question: '入力データが無効な場合はどうなりますか？',
        answer: 'ツールは何が間違っているかを示すエラーメッセージを表示します。入力形式を確認してもう一度試してください。',
      },
      {
        question: '大きなファイルを変換できますか？',
        answer: 'はい、しかしパフォーマンスはブラウザとデバイスに依存します。非常に大きなファイルの場合は、小さなチャンクに分割することを検討してください。',
      },
    ],
    ru: [
      {
        question: 'Как конвертировать данные между форматами?',
        answer: 'Вставьте или загрузите исходные данные, выберите целевой формат, если применимо, и нажмите «Конвертировать». Конвертированный результат будет готов к копированию или скачиванию.',
      },
      {
        question: 'Что произойдет, если мои входные данные недействительны?',
        answer: 'Инструмент отобразит сообщение об ошибке с указанием того, что пошло не так. Проверьте формат ввода и попробуйте снова.',
      },
      {
        question: 'Могу ли я конвертировать большие файлы?',
        answer: 'Да, но производительность зависит от вашего браузера и устройства. Для очень больших файлов рассмотрите возможность их разбиения на более мелкие части.',
      },
    ],
    fr: [
      {
        question: 'Comment convertir des données entre les formats ?',
        answer: 'Collez ou téléchargez vos données source, sélectionnez le format cible si applicable et cliquez sur Convertir. Le résultat converti sera prêt à être copié ou téléchargé.',
      },
      {
        question: 'Que se passe-t-il si mes données d\'entrée sont invalides ?',
        answer: 'L\'outil affichera un message d\'erreur indiquant ce qui n\'a pas fonctionné. Vérifiez votre format d\'entrée et réessayez.',
      },
      {
        question: 'Puis-je convertir des fichiers volumineux ?',
        answer: 'Oui, mais les performances dépendent de votre navigateur et de votre appareil. Pour les fichiers très volumineux, envisagez de les diviser en morceaux plus petits.',
      },
    ],
    de: [
      {
        question: 'Wie konvertiere ich Daten zwischen Formaten?',
        answer: 'Fügen Sie Ihre Quelldaten ein oder laden Sie sie hoch, wählen Sie ggf. das Zielformat und klicken Sie auf Konvertieren. Das konvertierte Ergebnis steht zum Kopieren oder Herunterladen bereit.',
      },
      {
        question: 'Was passiert, wenn meine Eingabedaten ungültig sind?',
        answer: 'Das Tool zeigt eine Fehlermeldung an, die angibt, was schief gelaufen ist. Überprüfen Sie Ihr Eingabeformat und versuchen Sie es erneut.',
      },
      {
        question: 'Kann ich große Dateien konvertieren?',
        answer: 'Ja, aber die Leistung hängt von Ihrem Browser und Ihrem Gerät ab. Bei sehr großen Dateien sollten Sie erwägen, diese in kleinere Stücke aufzuteilen.',
      },
    ],
    ko: [
      {
        question: '포맷 간에 데이터를 변환하려면 어떻게 해야 하나요?',
        answer: '소스 데이터를 붙여넣거나 업로드하고, 해당되는 경우 대상 포맷을 선택한 다음 변환을 클릭하세요. 변환된 결과는 복사하거나 다운로드할 수 있습니다.',
      },
      {
        question: '입력 데이터가 유효하지 않으면 어떻게 되나요?',
        answer: '도구는 무엇이 잘못되었는지 나타내는 오류 메시지를 표시합니다. 입력 형식을 확인하고 다시 시도하세요.',
      },
      {
        question: '대용량 파일을 변환할 수 있나요?',
        answer: '네, 하지만 성능은 브라우저와 장치에 따라 다릅니다. 매우 큰 파일의 경우 더 작은 조각으로 나누는 것을 고려하세요.',
      },
    ],
    ar: [
      {
        question: 'كيف أقوم بتحويل البيانات بين التنسيقات؟',
        answer: 'الصق بيانات المصدر أو حملها، وحدد التنسيق المستهدف إذا كان ذلك ممكنًا، وانقر فوق تحويل. ستكون النتيجة المحولة جاهزة للنسخ أو التنزيل.',
      },
      {
        question: 'ماذا يحدث إذا كانت بيانات الإدخال الخاصة بي غير صالحة؟',
        answer: 'ستعرض الأداة رسالة خطأ تشير إلى الخطأ. تحقق من تنسيق الإدخال وحاول مرة أخرى.',
      },
      {
        question: 'هل يمكنني تحويل ملفات كبيرة؟',
        answer: 'نعم، ولكن الأداء يعتمد على متصفحك وجهازك. بالنسبة للملفات الكبيرة جدًا، فكر في تقسيمها إلى أجزاء أصغر.',
      },
    ],
  },
  security: {
    en: [
      {
        question: 'Is this security tool safe to use?',
        answer: 'Yes, all cryptographic operations are performed locally in your browser using standard Web Crypto APIs. No data is transmitted to external servers.',
      },
      {
        question: 'How secure are the generated passwords/keys?',
        answer: 'Generated values use cryptographically secure random number generators, making them suitable for production use.',
      },
      {
        question: 'Can I trust the encryption/hashing results?',
        answer: 'Yes, this tool uses industry-standard algorithms implemented in your browser\'s native crypto library.',
      },
    ],
    zh: [
      {
        question: '使用此安全工具安全吗？',
        answer: '是的，所有加密操作都使用标准 Web Crypto API 在浏览器本地执行。没有数据传输到外部服务器。',
      },
      {
        question: '生成的密码/密钥有多安全？',
        answer: '生成的值使用加密安全的随机数生成器，适合生产环境使用。',
      },
      {
        question: '我可以信任加密/哈希结果吗？',
        answer: '是的，此工具使用浏览器原生加密库中实现的行业标准算法。',
      },
    ],
    es: [
      {
        question: '¿Es segura esta herramienta de seguridad?',
        answer: 'Sí, todas las operaciones criptográficas se realizan localmente en su navegador utilizando API Web Crypto estándar. No se transmiten datos a servidores externos.',
      },
      {
        question: '¿Qué tan seguras son las contraseñas/claves generadas?',
        answer: 'Los valores generados utilizan generadores de números aleatorios criptográficamente seguros, lo que los hace adecuados para uso en producción.',
      },
      {
        question: '¿Puedo confiar en los resultados de cifrado/hashing?',
        answer: 'Sí, esta herramienta utiliza algoritmos estándar de la industria implementados en la biblioteca criptográfica nativa de su navegador.',
      },
    ],
    pt: [
      {
        question: 'Esta ferramenta de segurança é segura?',
        answer: 'Sim, todas as operações criptográficas são realizadas localmente no seu navegador usando APIs Web Crypto padrão. Nenhum dado é transmitido para servidores externos.',
      },
      {
        question: 'Quão seguras são as senhas/chaves geradas?',
        answer: 'Os valores gerados usam geradores de números aleatórios criptograficamente seguros, tornando-os adequados para uso em produção.',
      },
      {
        question: 'Posso confiar nos resultados de criptografia/hashing?',
        answer: 'Sim, esta ferramenta usa algoritmos padrão da indústria implementados na biblioteca de criptografia nativa do seu navegador.',
      },
    ],
    ja: [
      {
        question: 'このセキュリティツールは安全ですか？',
        answer: 'はい、すべての暗号化操作は、標準のWeb Crypto APIを使用してブラウザ内でローカルに実行されます。データは外部サーバーに送信されません。',
      },
      {
        question: '生成されたパスワード/キーはどれくらい安全ですか？',
        answer: '生成された値は暗号学的に安全な乱数生成器を使用しており、本番環境での使用に適しています。',
      },
      {
        question: '暗号化/ハッシュ結果を信頼できますか？',
        answer: 'はい、このツールはブラウザのネイティブ暗号化ライブラリに実装された業界標準のアルゴリズムを使用しています。',
      },
    ],
    ru: [
      {
        question: 'Безопасен ли этот инструмент безопасности?',
        answer: 'Да, все криптографические операции выполняются локально в вашем браузере с использованием стандартных API Web Crypto. Данные не передаются на внешние серверы.',
      },
      {
        question: 'Насколько безопасны сгенерированные пароли/ключи?',
        answer: 'Сгенерированные значения используют криптографически стойкие генераторы случайных чисел, что делает их пригодными для использования в производственной среде.',
      },
      {
        question: 'Могу ли я доверять результатам шифрования/хеширования?',
        answer: 'Да, этот инструмент использует стандартные отраслевые алгоритмы, реализованные в собственной криптографической библиотеке вашего браузера.',
      },
    ],
    fr: [
      {
        question: 'Cet outil de sécurité est-il sûr à utiliser ?',
        answer: 'Oui, toutes les opérations cryptographiques sont effectuées localement dans votre navigateur à l\'aide des API Web Crypto standard. Aucune donnée n\'est transmise à des serveurs externes.',
      },
      {
        question: 'La sécurité des mots de passe/clés générés est-elle suffisante ?',
        answer: 'Les valeurs générées utilisent des générateurs de nombres aléatoires cryptographiquement sécurisés, ce qui les rend adaptées à une utilisation en production.',
      },
      {
        question: 'Puis-je faire confiance aux résultats de chiffrement/hachage ?',
        answer: 'Oui, cet outil utilise des algorithmes standard de l\'industrie implémentés dans la bibliothèque cryptographique native de votre navigateur.',
      },
    ],
    de: [
      {
        question: 'Ist dieses Sicherheitstool sicher zu verwenden?',
        answer: 'Ja, alle kryptografischen Operationen werden lokal in Ihrem Browser unter Verwendung von Standard-Web-Crypto-APIs durchgeführt. Es werden keine Daten an externe Server übertragen.',
      },
      {
        question: 'Wie sicher sind die generierten Passwörter/Schlüssel?',
        answer: 'Generierte Werte verwenden kryptografisch sichere Zufallszahlengeneratoren, wodurch sie für den Produktionseinsatz geeignet sind.',
      },
      {
        question: 'Kann ich den Verschlüsselungs-/Hashing-Ergebnissen vertrauen?',
        answer: 'Ja, dieses Tool verwendet Industriestandard-Algorithmen, die in der nativen Kryptobibliothek Ihres Browsers implementiert sind.',
      },
    ],
    ko: [
      {
        question: '이 보안 도구는 안전한가요?',
        answer: '네, 모든 암호화 작업은 표준 Web Crypto API를 사용하여 브라우저에서 로컬로 수행됩니다. 데이터는 외부 서버로 전송되지 않습니다.',
      },
      {
        question: '생성된 비밀번호/키는 얼마나 안전한가요?',
        answer: '생성된 값은 암호학적으로 안전한 난수 생성기를 사용하므로 프로덕션 환경에서 사용하기에 적합합니다.',
      },
      {
        question: '암호화/해싱 결과를 신뢰할 수 있나요?',
        answer: '네, 이 도구는 브라우저의 기본 암호화 라이브러리에 구현된 업계 표준 알고리즘을 사용합니다.',
      },
    ],
    ar: [
      {
        question: 'هل أداة الأمان هذه آمنة للاستخدام؟',
        answer: 'نعم، يتم إجراء جميع عمليات التشفير محليًا في متصفحك باستخدام واجهات برمجة تطبيقات Web Crypto القياسية. لا يتم نقل أي بيانات إلى خوادم خارجية.',
      },
      {
        question: 'ما مدى أمان كلمات المرور/المفاتيح المولدة؟',
        answer: 'تستخدم القيم المولدة مولدات أرقام عشوائية آمنة التشفير، مما يجعلها مناسبة للاستخدام في الإنتاج.',
      },
      {
        question: 'هل يمكنني الوثوق بنتائج التشفير/التجزئة؟',
        answer: 'نعم، تستخدم هذه الأداة خوارزميات متوافقة مع معايير الصناعة والمنفذة في مكتبة التشفير الأصلية لمتصفحك.',
      },
    ],
  },
};

// 默认通用 FAQ（当分类没有特定模板时使用）
const DEFAULT_FAQ_TEMPLATES: Record<string, FAQItem[]> = {
  en: [
    {
      question: 'How do I use this tool?',
      answer: 'Enter your data in the input area, configure any options as needed, and click the action button. Results will appear in the output area.',
    },
    {
      question: 'Is this tool free to use?',
      answer: 'Yes, this tool is completely free with no registration required. You can use it as many times as you need.',
    },
    {
      question: 'Is my data private and secure?',
      answer: 'Absolutely. All processing happens in your browser. Your data never leaves your device and is not stored anywhere.',
    },
  ],
  zh: [
    {
      question: '如何使用此工具？',
      answer: '在输入区域输入数据，根据需要配置选项，然后点击操作按钮。结果将显示在输出区域。',
    },
    {
      question: '此工具免费使用吗？',
      answer: '是的，此工具完全免费，无需注册。您可以根据需要多次使用。',
    },
    {
      question: '我的数据是否私密和安全？',
      answer: '绝对安全。所有处理都在您的浏览器中进行。您的数据永远不会离开您的设备，也不会存储在任何地方。',
    },
  ],
  es: [
    {
      question: '¿Cómo uso esta herramienta?',
      answer: 'Ingrese sus datos en el área de entrada, configure las opciones según sea necesario y haga clic en el botón de acción. Los resultados aparecerán en el área de salida.',
    },
    {
      question: '¿Es gratuita esta herramienta?',
      answer: 'Sí, esta herramienta es completamente gratuita sin necesidad de registro. Puede usarla tantas veces como necesite.',
    },
    {
      question: '¿Mis datos son privados y seguros?',
      answer: 'Absolutamente. Todo el procesamiento ocurre en su navegador. Sus datos nunca salen de su dispositivo.',
    },
  ],
  pt: [
    {
      question: 'Como uso esta ferramenta?',
      answer: 'Insira seus dados na área de entrada, configure as opções conforme necessário e clique no botão de ação. Os resultados aparecerão na área de saída.',
    },
    {
      question: 'Esta ferramenta é gratuita?',
      answer: 'Sim, esta ferramenta é completamente gratuita sem necessidade de registro. Você pode usá-la quantas vezes precisar.',
    },
    {
      question: 'Meus dados são privados e seguros?',
      answer: 'Absolutamente. Todo o processamento acontece no seu navegador. Seus dados nunca saem do seu dispositivo.',
    },
  ],
  ja: [
    {
      question: 'このツールの使い方は？',
      answer: '入力エリアにデータを入力し、必要に応じてオプションを設定し、アクションボタンをクリックします。結果は出力エリアに表示されます。',
    },
    {
      question: 'このツールは無料ですか？',
      answer: 'はい、このツールは登録不要で完全に無料です。必要なだけ何度でも使用できます。',
    },
    {
      question: 'データはプライベートで安全ですか？',
      answer: 'はい、完全に安全です。すべての処理はブラウザ内で行われます。データがデバイスから離れることはありません。',
    },
  ],
  ru: [
    {
      question: 'Как пользоваться этим инструментом?',
      answer: 'Введите данные в поле ввода, настройте параметры и нажмите кнопку действия. Результаты появятся в поле вывода.',
    },
    {
      question: 'Этот инструмент бесплатный?',
      answer: 'Да, этот инструмент полностью бесплатен и не требует регистрации. Вы можете использовать его столько раз, сколько вам нужно.',
    },
    {
      question: 'Мои данные в безопасности?',
      answer: 'Абсолютно. Вся обработка происходит в вашем браузере. Ваши данные никогда не покидают устройство.',
    },
  ],
  fr: [
    {
      question: 'Comment utiliser cet outil ?',
      answer: 'Entrez vos données dans la zone de saisie, configurez les options si nécessaire et cliquez sur le bouton d\'action. Les résultats apparaîtront dans la zone de sortie.',
    },
    {
      question: 'Cet outil est-il gratuit ?',
      answer: 'Oui, cet outil est entièrement gratuit et ne nécessite aucune inscription. Vous pouvez l\'utiliser autant de fois que nécessaire.',
    },
    {
      question: 'Mes données sont-elles privées et sécurisées ?',
      answer: 'Absolument. Tout le traitement se fait dans votre navigateur. Vos données ne quittent jamais votre appareil.',
    },
  ],
  de: [
    {
      question: 'Wie benutze ich dieses Werkzeug?',
      answer: 'Geben Sie Ihre Daten in den Eingabebereich ein, konfigurieren Sie die Optionen nach Bedarf und klicken Sie auf die Aktionsschaltfläche. Die Ergebnisse werden im Ausgabebereich angezeigt.',
    },
    {
      question: 'Ist dieses Werkzeug kostenlos?',
      answer: 'Ja, dieses Werkzeug ist völlig kostenlos und erfordert keine Registrierung. Sie können es so oft verwenden, wie Sie möchten.',
    },
    {
      question: 'Sind meine Daten privat und sicher?',
      answer: 'Absolut. Die gesamte Verarbeitung erfolgt in Ihrem Browser. Ihre Daten verlassen niemals Ihr Gerät.',
    },
  ],
  ko: [
    {
      question: '이 도구는 어떻게 사용하나요?',
      answer: '입력 영역에 데이터를 입력하고 필요한 옵션을 구성한 다음 실행 버튼을 클릭하세요. 결과가 출력 영역에 나타납니다.',
    },
    {
      question: '이 도구는 무료인가요?',
      answer: '네, 이 도구는 등록 없이 완전히 무료로 사용할 수 있습니다. 필요한 만큼 여러 번 사용할 수 있습니다.',
    },
    {
      question: '내 데이터는 안전한가요?',
      answer: '물론입니다. 모든 처리는 브라우저에서 수행됩니다. 데이터는 장치를 떠나지 않으며 어디에도 저장되지 않습니다.',
    },
  ],
  ar: [
    {
      question: 'كيف أستخدم هذه الأداة؟',
      answer: 'أدخل بياناتك في منطقة الإدخال، وقم بتكوين أي خيارات حسب الحاجة، وانقر فوق زر الإجراء. ستظهر النتائج في منطقة الإخراج.',
    },
    {
      question: 'هل هذه الأداة مجانية؟',
      answer: 'نعم، هذه الأداة مجانية تمامًا ولا تتطلب التسجيل. يمكنك استخدامها عدة مرات كما تحتاج.',
    },
    {
      question: 'هل بياناتي خاصة وآمنة؟',
      answer: 'بالتأكيد. تتم جميع المعالجات في متصفحك. بياناتك لا تغادر جهازك أبدًا ولا يتم تخزينها في أي مكان.',
    },
  ],
};


/**
 * 获取工具的 FAQ 内容
 * 优先返回工具专属 FAQ，否则返回分类通用 FAQ
 * @param slug - 工具 slug
 * @param locale - 语言代码
 * @param category - 工具分类
 * @returns FAQ 项目数组
 */
export function getToolFAQs(
  slug: string,
  locale: string,
  category?: string
): FAQItem[] {
  // 首先尝试获取工具专属 FAQ
  const specificFaqs = getToolSpecificFAQs(slug, locale);
  if (specificFaqs && specificFaqs.length >= 3) {
    return specificFaqs;
  }

  // 然后尝试获取分类特定的 FAQ
  if (category && GENERIC_FAQ_TEMPLATES[category]) {
    const categoryFaqs = GENERIC_FAQ_TEMPLATES[category][locale];
    if (categoryFaqs && categoryFaqs.length >= 3) {
      return categoryFaqs;
    }
    // 回退到英文分类 FAQ
    const enCategoryFaqs = GENERIC_FAQ_TEMPLATES[category]['en'];
    if (enCategoryFaqs && enCategoryFaqs.length >= 3) {
      return enCategoryFaqs;
    }
  }

  // 回退到默认 FAQ
  return DEFAULT_FAQ_TEMPLATES[locale] || DEFAULT_FAQ_TEMPLATES['en'];
}

/**
 * 生成通用工具 FAQ（基于工具名称和分类）
 * @param toolName - 工具名称
 * @param category - 工具分类
 * @param locale - 语言代码
 * @returns FAQ 项目数组
 */
export function generateGenericFAQs(
  toolName: string,
  category: string,
  locale: string
): FAQItem[] {
  const patterns = QUESTION_PATTERNS[locale as keyof typeof QUESTION_PATTERNS] || QUESTION_PATTERNS.en;

  // 直接使用传入的 category 作为分类名称
  const categoryName = category;

  const faqs: FAQItem[] = [];

  // 问题 1: How to use（使用自然语言格式）
  if (locale === 'zh') {
    faqs.push({
      question: `${patterns.howTo}使用 ${toolName}？`,
      answer: `使用 ${toolName} 非常简单。只需在输入区域输入或粘贴您的数据，根据需要调整设置，然后点击处理按钮即可获得结果。`,
    });
  } else if (locale === 'ja') {
    faqs.push({
      question: `${toolName} ${patterns.howTo}使いますか？`,
      answer: `${toolName} の使用は簡単です。入力エリアにデータを入力または貼り付け、必要に応じて設定を調整し、処理ボタンをクリックするだけです。`,
    });
  } else if (locale === 'es') {
    faqs.push({
      question: `¿${patterns.howTo} usar ${toolName}?`,
      answer: `Usar ${toolName} es simple. Solo ingrese o pegue sus datos en el área de entrada, ajuste la configuración según sea necesario y haga clic en el botón de proceso.`,
    });
  } else if (locale === 'pt') {
    faqs.push({
      question: `${patterns.howTo} usar ${toolName}?`,
      answer: `Usar ${toolName} é simples. Basta inserir ou colar seus dados na área de entrada, ajustar as configurações conforme necessário e clicar no botão de processo.`,
    });
  } else if (locale === 'ru') {
    faqs.push({
      question: `${patterns.howTo} использовать ${toolName}?`,
      answer: `Использовать ${toolName} просто. Просто введите или вставьте свои данные в область ввода, настройте параметры по мере необходимости и нажмите кнопку обработки, чтобы получить результат.`,
    });
  } else if (locale === 'fr') {
    faqs.push({
      question: `${patterns.howTo} utiliser ${toolName} ?`,
      answer: `L'utilisation de ${toolName} est simple. Entrez ou collez simplement vos données dans la zone de saisie, ajustez les paramètres si nécessaire et cliquez sur le bouton de traitement pour obtenir votre résultat.`,
    });
  } else if (locale === 'de') {
    faqs.push({
      question: `${patterns.howTo} verwende ich ${toolName}?`,
      answer: `Die Verwendung von ${toolName} ist einfach. Geben Sie einfach Ihre Daten in den Eingabebereich ein oder fügen Sie sie ein, passen Sie die Einstellungen bei Bedarf an und klicken Sie auf die Schaltfläche Verarbeiten, um Ihr Ergebnis zu erhalten.`,
    });
  } else if (locale === 'ko') {
    faqs.push({
      question: `${toolName} ${patterns.howTo} 사용하나요?`,
      answer: `${toolName} 사용법은 간단합니다. 입력 영역에 데이터를 입력하거나 붙여넣고 필요한 경우 설정을 조정한 다음 처리 버튼을 클릭하여 결과를 얻으십시오.`,
    });
  } else if (locale === 'ar') {
    faqs.push({
      question: `${patterns.howTo} أستخدم ${toolName}؟`,
      answer: `استخدام ${toolName} بسيط. فقط أدخل أو الصق بياناتك في منطقة الإدخال، واضبط الإعدادات حسب الحاجة، وانقر فوق زر المعالجة للحصول على نتيجتك.`,
    });
  } else {
    faqs.push({
      question: `${patterns.howTo} use ${toolName}?`,
      answer: `Using ${toolName} is simple. Just enter or paste your data in the input area, adjust settings as needed, and click the process button to get your result.`,
    });
  }

  // 问题 2: What is（定义问题）
  if (locale === 'zh') {
    faqs.push({
      question: `${patterns.whatIs} ${toolName}？`,
      answer: `${toolName} 是一个免费的在线工具，属于 ${categoryName} 类别。它可以帮助您快速处理数据，无需安装任何软件。`,
    });
  } else if (locale === 'ja') {
    faqs.push({
      question: `${toolName} ${patterns.whatIs}`,
      answer: `${toolName} は ${categoryName} カテゴリの無料オンラインツールです。ソフトウェアをインストールすることなく、データを素早く処理できます。`,
    });
  } else if (locale === 'es') {
    faqs.push({
      question: `¿${patterns.whatIs} ${toolName}?`,
      answer: `${toolName} es una herramienta en línea gratuita en la categoría ${categoryName}. Le ayuda a procesar datos rápidamente sin instalar ningún software.`,
    });
  } else if (locale === 'pt') {
    faqs.push({
      question: `${patterns.whatIs} ${toolName}?`,
      answer: `${toolName} é uma ferramenta online gratuita na categoria ${categoryName}. Ajuda você a processar dados rapidamente sem instalar nenhum software.`,
    });
  } else if (locale === 'ru') {
    faqs.push({
      question: `${patterns.whatIs} ${toolName}?`,
      answer: `${toolName} — это бесплатный онлайн-инструмент в категории ${categoryName}. Он помогает быстро обрабатывать данные без установки какого-либо программного обеспечения.`,
    });
  } else if (locale === 'fr') {
    faqs.push({
      question: `${patterns.whatIs} ${toolName} ?`,
      answer: `${toolName} est un outil en ligne gratuit dans la catégorie ${categoryName}. Il vous aide à traiter les données rapidement sans installer de logiciel.`,
    });
  } else if (locale === 'de') {
    faqs.push({
      question: `${patterns.whatIs} ${toolName}?`,
      answer: `${toolName} ist ein kostenloses Online-Tool in der Kategorie ${categoryName}. Es hilft Ihnen, Daten schnell zu verarbeiten, ohne Software zu installieren.`,
    });
  } else if (locale === 'ko') {
    faqs.push({
      question: `${toolName} ${patterns.whatIs}?`,
      answer: `${toolName}은(는) ${categoryName} 카테고리의 무료 온라인 도구입니다. 소프트웨어를 설치하지 않고도 데이터를 빠르게 처리할 수 있습니다.`,
    });
  } else if (locale === 'ar') {
    faqs.push({
      question: `${patterns.whatIs} ${toolName}؟`,
      answer: `${toolName} هي أداة مجانية عبر الإنترنت في فئة ${categoryName}. تساعدك على معالجة البيانات بسرعة دون تثبيت أي برنامج.`,
    });
  } else {
    faqs.push({
      question: `${patterns.whatIs} ${toolName}?`,
      answer: `${toolName} is a free online tool in the ${categoryName} category. It helps you process data quickly without installing any software.`,
    });
  }

  // 问题 3: Why use（价值问题）
  if (locale === 'zh') {
    faqs.push({
      question: `${patterns.why} ${toolName}？`,
      answer: `${toolName} 完全免费、无需注册、数据在本地处理确保隐私安全。它快速、可靠，随时可用。`,
    });
  } else if (locale === 'ja') {
    faqs.push({
      question: `${toolName} を${patterns.why}`,
      answer: `${toolName} は完全無料で、登録不要、データはローカルで処理されるためプライバシーが保護されます。高速で信頼性が高く、いつでも利用可能です。`,
    });
  } else if (locale === 'es') {
    faqs.push({
      question: `¿${patterns.why} ${toolName}?`,
      answer: `${toolName} es completamente gratuito, no requiere registro y los datos se procesan localmente para garantizar la privacidad. Es rápido, confiable y siempre disponible.`,
    });
  } else if (locale === 'pt') {
    faqs.push({
      question: `${patterns.why} ${toolName}?`,
      answer: `${toolName} é completamente gratuito, não requer registro e os dados são processados localmente para garantir privacidade. É rápido, confiável e sempre disponível.`,
    });
  } else if (locale === 'ru') {
    faqs.push({
      question: `${patterns.why} ${toolName}?`,
      answer: `${toolName} полностью бесплатен, не требует регистрации и обрабатывает данные локально для обеспечения конфиденциальности. Он быстрый, надежный и всегда доступен.`,
    });
  } else if (locale === 'fr') {
    faqs.push({
      question: `${patterns.why} ${toolName} ?`,
      answer: `${toolName} est entièrement gratuit, ne nécessite aucune inscription et traite les données localement pour garantir la confidentialité. Il est rapide, fiable et toujours disponible.`,
    });
  } else if (locale === 'de') {
    faqs.push({
      question: `${patterns.why} ${toolName}?`,
      answer: `${toolName} ist völlig kostenlos, erfordert keine Registrierung und verarbeitet Daten lokal, um die Privatsphäre zu gewährleisten. Es ist schnell, zuverlässig und immer verfügbar.`,
    });
  } else if (locale === 'ko') {
    faqs.push({
      question: `${patterns.why} ${toolName}?`,
      answer: `${toolName}은(는) 완전히 무료이며 등록이 필요하지 않으며 개인 정보 보호를 위해 데이터가 로컬에서 처리됩니다. 빠르고 안정적이며 항상 사용할 수 있습니다.`,
    });
  } else if (locale === 'ar') {
    faqs.push({
      question: `${patterns.why} ${toolName}؟`,
      answer: `${toolName} مجاني تمامًا، ولا يتطلب التسجيل، ويعالج البيانات محليًا لضمان الخصوصية. إنه سريع وموثوق ومتاح دائمًا.`,
    });
  } else {
    faqs.push({
      question: `${patterns.why} ${toolName}?`,
      answer: `${toolName} is completely free, requires no registration, and processes data locally to ensure privacy. It's fast, reliable, and always available.`,
    });
  }

  return faqs;
}

/**
 * 生成 FAQ JSON-LD 结构化数据
 * 使用 seo.ts 中的函数确保类型一致性
 * @param faqs - FAQ 项目数组
 * @returns FAQPage JSON-LD 对象
 */
export function generateFAQJsonLd(faqs: FAQItem[]): JsonLdData {
  return generateFAQJsonLdFromSeo(faqs);
}

/**
 * 将 FAQ JSON-LD 转换为字符串
 * @param jsonLd - JSON-LD 对象
 * @returns JSON 字符串
 */
export function faqJsonLdToString(jsonLd: JsonLdData): string {
  return JSON.stringify(jsonLd);
}

/**
 * 验证问题是否使用自然语言格式
 * @param question - 问题文本
 * @returns 是否为自然语言格式
 */
export function isNaturalLanguageQuestion(question: string): boolean {
  // 检查是否以常见问题词开头
  const naturalPatterns = [
    // 英文
    /^(how|what|why|when|where|who|which|can|is|are|do|does|will|would|should)/i,
    // 中文
    /^(如何|什么|为什么|何时|哪里|谁|哪个|可以|是否|怎么|怎样)/,
    // 西班牙语
    /^(cómo|qué|por qué|cuándo|dónde|quién|cuál|puede|es|son)/i,
    // 葡萄牙语
    /^(como|o que|por que|quando|onde|quem|qual|pode|é|são)/i,
    // 日语
    /^.*(どう|何|なぜ|いつ|どこ|誰|どの|できる|ですか)/,
    // 以问号结尾
    /\?$/,
    // 中文问号
    /？$/,
    // 俄语
    /^(как|что|почему|зачем|где|кто|могу|является)/i,
    // 法语
    /^(comment|quoi|pourquoi|quand|où|qui|quel|puis|est)/i,
    // 德语
    /^(wie|was|warum|wann|wo|wer|welche|kann|ist)/i,
    // 韩语
    /^(어떻게|무엇|왜|언제|어디|누가|어떤|할 수|입니까)/,
    // 阿拉伯语
    /^(كيف|ما|لماذا|متى|أين|من|أي|هل)/,
  ];

  return naturalPatterns.some(pattern => pattern.test(question));
}

/**
 * 获取 FAQ 的最小数量要求
 */
export const MIN_FAQ_COUNT = 3;

/**
 * 验证 FAQ 数组是否满足要求
 * @param faqs - FAQ 数组
 * @returns 是否满足要求
 */
export function validateFAQs(faqs: FAQItem[]): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // 检查数量
  if (faqs.length < MIN_FAQ_COUNT) {
    errors.push(`FAQ count (${faqs.length}) is less than minimum required (${MIN_FAQ_COUNT})`);
  }

  // 检查每个问题是否为自然语言格式
  faqs.forEach((faq, index) => {
    if (!isNaturalLanguageQuestion(faq.question)) {
      errors.push(`FAQ ${index + 1} question is not in natural language format: "${faq.question}"`);
    }
    if (!faq.answer || faq.answer.trim().length === 0) {
      errors.push(`FAQ ${index + 1} has empty answer`);
    }
  });

  return {
    valid: errors.length === 0,
    errors,
  };
}
