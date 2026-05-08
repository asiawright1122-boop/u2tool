export interface SupportFAQItem {
  question: string;
  answer: string;
}

export interface SupportContentFallback {
  detailedDescription: string;
  usageExamples: string[];
  usageSteps: string[];
  faqs: SupportFAQItem[];
}

interface LocalizedFallbackCopy {
  chartDescription: (toolName: string) => string;
  chartUsageExamples: string[];
  chartUsageSteps: string[];
  genericDescription: (toolName: string) => string;
  genericUsageExamples: string[];
  genericUsageSteps: string[];
}

const CHART_FALLBACK_SLUGS = new Set([
  'area-chart-generator',
  'bar-chart-generator',
  'boxplot-chart-generator',
  'calendar-heatmap-generator',
  'grouped-bar-chart-generator',
  'grouped-line-chart-generator',
  'half-doughnut-chart-generator',
  'heatmap-chart-generator',
  'line-chart-generator',
  'multi-ring-chart-generator',
  'parallel-chart-generator',
  'polar-bar-chart-generator',
  'positive-negative-bar-chart-generator',
  'ring-progress-chart-generator',
  'sankey-chart-generator',
  'scatter-chart-generator',
  'stacked-area-chart-generator',
  'stacked-bar-chart-generator',
  'sunburst-chart-generator',
  'theme-river-generator',
  'timeline-chart-generator',
  'waterfall-chart-generator',
]);

const CHARTISH_FALLBACK_PATTERN =
  /(?:^|-)(chart|heatmap|pie|doughnut|sunburst|sankey|waterfall|timeline|candlestick|radar|venn|treemap|river|ring)(?:-|$)/;

const LOCALIZED_FALLBACK_COPY: Record<string, LocalizedFallbackCopy> = {
  en: {
    chartDescription: (toolName) =>
      `${toolName} helps you turn small datasets into a shareable chart directly in your browser. You can edit labels and values, adjust the title, color theme, legend visibility, and layout controls, then review the live preview before exporting the result as PNG or SVG. It works well for quick reporting, dashboard mockups, presentations, and documentation when you need a clean visual without leaving the page.`,
    chartUsageSteps: [
      'Load the sample dataset or start with the default rows in the editor.',
      'Update the chart title, then add, remove, or rename data points and values.',
      'Adjust appearance options such as theme, legend visibility, and chart-specific layout controls.',
      'Review the live preview and refine the data until the visual matches your message.',
      'Export the finished chart as PNG or SVG for slides, docs, or sharing.',
    ],
    chartUsageExamples: [
      'Compare monthly performance across teams or channels in a presentation-ready graphic.',
      'Turn a quick spreadsheet-style list of values into a visual for product docs or internal updates.',
      'Experiment with different labels, ranges, and color themes before publishing a chart elsewhere.',
    ],
    genericDescription: (toolName) =>
      `${toolName} is designed for quick browser-based workflows where you want immediate results and a straightforward interface. Use the controls on the page to enter your data, adjust the available options, review the output, and then copy, download, or export the result when it looks right. This lightweight workflow is useful for fast checks, prototypes, and day-to-day utility tasks.`,
    genericUsageSteps: [
      'Enter or upload the source data the tool needs.',
      'Adjust the available options to match the output you want.',
      'Review the live result or preview area on the page.',
      'Refine the inputs until the output matches your goal.',
      'Copy, download, or export the final result.',
    ],
    genericUsageExamples: [
      'Prepare a quick result for a ticket, internal doc, or prototype.',
      'Validate an input or output format before using a heavier workflow.',
      'Handle a one-off task without leaving the browser or switching tools.',
    ],
  },
  zh: {
    chartDescription: (toolName) =>
      `${toolName} 可在浏览器中把小型数据集快速整理成便于分享的图表。你可以修改标签和值，调整标题、配色、图例与布局选项，并在导出 PNG 或 SVG 前先查看实时预览。它适合用于周报、演示文稿、文档和轻量级数据展示场景。`,
    chartUsageSteps: [
      '加载示例数据，或直接从编辑器中的默认行开始。',
      '更新图表标题，然后添加、删除或重命名数据点与数值。',
      '调整主题、图例显示和图表相关布局等外观选项。',
      '查看实时预览，并继续微调数据直到图表表达清晰。',
      '将最终图表导出为 PNG 或 SVG，用于幻灯片、文档或分享。',
    ],
    chartUsageExamples: [
      '在汇报中比较不同团队或渠道的月度表现。',
      '把一份简短表格数据快速转成适合文档展示的图表。',
      '在正式发布前尝试不同标签区间和配色方案。',
    ],
    genericDescription: (toolName) =>
      `${toolName} 适合需要快速得到结果的浏览器内工作流。你可以在页面中输入或上传数据，调整可用选项，查看输出结果，并在内容符合需求后复制、下载或导出。它适用于快速检查、原型验证和日常轻量工具任务。`,
    genericUsageSteps: [
      '输入或上传工具所需的源数据。',
      '调整可用选项，让输出结果更符合你的目标。',
      '查看页面中的实时结果或预览区域。',
      '继续微调输入，直到结果满足需求。',
      '复制、下载或导出最终结果。',
    ],
    genericUsageExamples: [
      '为工单、内部文档或原型准备一个快速结果。',
      '在使用更重的工作流前先验证输入或输出格式。',
      '在不切换工具的情况下完成一次性的小任务。',
    ],
  },
  ja: {
    chartDescription: (toolName) =>
      `${toolName} は、少量のデータをブラウザ上ですばやく共有しやすいチャートに変換できるツールです。ラベルや値を編集し、タイトル、配色、凡例、レイアウトを調整して、PNG または SVG として書き出す前にライブプレビューを確認できます。レポート、スライド、ドキュメント向けの軽量な可視化に向いています。`,
    chartUsageSteps: [
      'サンプルデータを読み込むか、エディタ内の既定の行から始めます。',
      'チャートのタイトルを更新し、データ項目や値を追加、削除、または名前変更します。',
      'テーマ、凡例表示、チャート固有のレイアウトなど外観オプションを調整します。',
      'ライブプレビューを確認し、伝えたい内容に合うまでデータを整えます。',
      '完成したチャートを PNG または SVG として書き出します。',
    ],
    chartUsageExamples: [
      '複数のチームやチャネルの月次実績をレポート用に比較する。',
      '短い表形式データをドキュメント向けの図に素早く変換する。',
      '公開前にラベル、範囲、配色を試しながら調整する。',
    ],
    genericDescription: (toolName) =>
      `${toolName} は、すぐに結果を得たいブラウザベースの軽量ワークフロー向けに設計されています。ページ上でデータを入力またはアップロードし、使えるオプションを調整し、出力を確認してから、必要に応じてコピー、ダウンロード、または書き出しできます。簡易チェックや試作、日常的なユーティリティ作業に適しています。`,
    genericUsageSteps: [
      'ツールに必要な元データを入力またはアップロードします。',
      '必要な出力に合わせて利用可能なオプションを調整します。',
      'ページ上の結果またはプレビュー領域を確認します。',
      '目的に合うまで入力内容を調整します。',
      '最終結果をコピー、ダウンロード、または書き出します。',
    ],
    genericUsageExamples: [
      'チケットや社内ドキュメント、試作向けに素早く結果を用意する。',
      'より重いワークフローに進む前に入出力形式を確認する。',
      'ツールを切り替えずに単発タスクを片付ける。',
    ],
  },
  ko: {
    chartDescription: (toolName) =>
      `${toolName}은 브라우저에서 작은 데이터셋을 빠르게 공유용 차트로 바꿔주는 도구입니다. 라벨과 값을 수정하고 제목, 색상 테마, 범례, 레이아웃을 조정한 뒤 PNG 또는 SVG로 내보내기 전에 실시간 미리보기를 확인할 수 있습니다. 보고서, 발표 자료, 문서용 가벼운 시각화에 잘 맞습니다.`,
    chartUsageSteps: [
      '샘플 데이터를 불러오거나 편집기의 기본 행에서 바로 시작합니다.',
      '차트 제목을 업데이트하고 데이터 항목과 값을 추가, 삭제 또는 이름 변경합니다.',
      '테마, 범례 표시, 차트별 레이아웃 같은 표시 옵션을 조정합니다.',
      '실시간 미리보기를 확인하면서 전달하려는 내용에 맞게 데이터를 다듬습니다.',
      '완성된 차트를 PNG 또는 SVG로 내보냅니다.',
    ],
    chartUsageExamples: [
      '여러 팀이나 채널의 월간 성과를 보고용 그래픽으로 비교합니다.',
      '짧은 표 형식 데이터를 문서용 시각 자료로 빠르게 전환합니다.',
      '공개 전에 라벨, 범위, 색상 테마를 바꿔 보며 테스트합니다.',
    ],
    genericDescription: (toolName) =>
      `${toolName}은 빠른 결과가 필요한 브라우저 기반 작업에 맞춰 설계되었습니다. 페이지에서 데이터를 입력하거나 업로드하고, 사용할 수 있는 옵션을 조정한 뒤, 출력 결과를 확인하고 필요하면 복사, 다운로드 또는 내보내기를 할 수 있습니다. 빠른 확인, 프로토타입 작업, 일상적인 유틸리티 작업에 적합합니다.`,
    genericUsageSteps: [
      '도구에 필요한 원본 데이터를 입력하거나 업로드합니다.',
      '원하는 결과에 맞게 사용 가능한 옵션을 조정합니다.',
      '페이지의 실시간 결과 또는 미리보기 영역을 확인합니다.',
      '목표에 맞을 때까지 입력값을 다듬습니다.',
      '최종 결과를 복사, 다운로드 또는 내보내기 합니다.',
    ],
    genericUsageExamples: [
      '티켓, 내부 문서, 프로토타입용 빠른 결과물을 준비합니다.',
      '더 큰 워크플로로 넘어가기 전에 입력 또는 출력 형식을 확인합니다.',
      '도구를 바꾸지 않고 일회성 작업을 처리합니다.',
    ],
  },
  es: {
    chartDescription: (toolName) =>
      `${toolName} te ayuda a convertir pequenos conjuntos de datos en un grafico listo para compartir directamente en el navegador. Puedes editar etiquetas y valores, ajustar el titulo, los colores, la leyenda y la disposicion, y revisar la vista previa antes de exportar el resultado como PNG o SVG. Es util para informes rapidos, presentaciones y documentacion.`,
    chartUsageSteps: [
      'Carga los datos de ejemplo o empieza con las filas predeterminadas del editor.',
      'Actualiza el titulo del grafico y luego agrega, elimina o cambia el nombre de puntos y valores.',
      'Ajusta opciones visuales como tema, leyenda y controles de disposicion del grafico.',
      'Revisa la vista previa en vivo y refina los datos hasta que el mensaje quede claro.',
      'Exporta el grafico final como PNG o SVG para diapositivas, documentos o compartir.',
    ],
    chartUsageExamples: [
      'Comparar el rendimiento mensual entre equipos o canales en un grafico listo para presentacion.',
      'Convertir una lista corta tipo hoja de calculo en un visual para documentacion o actualizaciones internas.',
      'Probar etiquetas, rangos y paletas de color antes de publicar un grafico.',
    ],
    genericDescription: (toolName) =>
      `${toolName} esta pensado para flujos de trabajo rapidos en el navegador, cuando quieres resultados inmediatos y una interfaz simple. Usa los controles de la pagina para introducir tus datos, ajustar las opciones disponibles, revisar la salida y luego copiar, descargar o exportar el resultado cuando se vea bien. Es util para comprobaciones rapidas, prototipos y tareas cotidianas.`,
    genericUsageSteps: [
      'Introduce o sube los datos de origen que necesita la herramienta.',
      'Ajusta las opciones disponibles para obtener la salida que buscas.',
      'Revisa el resultado en vivo o el area de vista previa de la pagina.',
      'Refina las entradas hasta que el resultado coincida con tu objetivo.',
      'Copia, descarga o exporta el resultado final.',
    ],
    genericUsageExamples: [
      'Preparar un resultado rapido para un ticket, un documento interno o un prototipo.',
      'Validar un formato de entrada o salida antes de pasar a un flujo de trabajo mas pesado.',
      'Resolver una tarea puntual sin salir del navegador ni cambiar de herramienta.',
    ],
  },
  pt: {
    chartDescription: (toolName) =>
      `${toolName} ajuda voce a transformar pequenos conjuntos de dados em um grafico facil de compartilhar diretamente no navegador. Voce pode editar rotulos e valores, ajustar titulo, cores, legenda e layout, e revisar a previa antes de exportar o resultado como PNG ou SVG. E uma boa opcao para relatorios rapidos, apresentacoes e documentacao.`,
    chartUsageSteps: [
      'Carregue os dados de exemplo ou comece com as linhas padrao no editor.',
      'Atualize o titulo do grafico e depois adicione, remova ou renomeie pontos e valores.',
      'Ajuste opcoes visuais como tema, legenda e controles de layout do grafico.',
      'Revise a previa em tempo real e refine os dados ate a visualizacao transmitir a mensagem certa.',
      'Exporte o grafico final como PNG ou SVG para slides, documentos ou compartilhamento.',
    ],
    chartUsageExamples: [
      'Comparar o desempenho mensal entre equipes ou canais em um grafico pronto para apresentacao.',
      'Transformar uma lista curta estilo planilha em um visual para documentacao ou atualizacoes internas.',
      'Testar rotulos, intervalos e temas de cor antes de publicar um grafico.',
    ],
    genericDescription: (toolName) =>
      `${toolName} foi pensado para fluxos de trabalho rapidos no navegador, quando voce quer resultados imediatos e uma interface simples. Use os controles da pagina para inserir seus dados, ajustar as opcoes disponiveis, revisar a saida e depois copiar, baixar ou exportar o resultado quando estiver certo. Esse fluxo leve e util para verificacoes rapidas, prototipos e tarefas do dia a dia.`,
    genericUsageSteps: [
      'Digite ou envie os dados de origem que a ferramenta precisa.',
      'Ajuste as opcoes disponiveis para obter a saida desejada.',
      'Revise o resultado em tempo real ou a area de previa na pagina.',
      'Refine as entradas ate que o resultado atenda ao seu objetivo.',
      'Copie, baixe ou exporte o resultado final.',
    ],
    genericUsageExamples: [
      'Preparar rapidamente um resultado para ticket, documento interno ou prototipo.',
      'Validar um formato de entrada ou saida antes de usar um fluxo mais pesado.',
      'Resolver uma tarefa pontual sem sair do navegador nem trocar de ferramenta.',
    ],
  },
  fr: {
    chartDescription: (toolName) =>
      `${toolName} vous aide a transformer de petits jeux de donnees en graphique partageable directement dans le navigateur. Vous pouvez modifier les libelles et les valeurs, ajuster le titre, les couleurs, la legende et la mise en page, puis verifier l apercu avant d exporter le resultat en PNG ou SVG. C est pratique pour des rapports rapides, des presentations et de la documentation.`,
    chartUsageSteps: [
      'Chargez les donnees d exemple ou commencez avec les lignes par defaut dans l editeur.',
      'Mettez a jour le titre du graphique, puis ajoutez, supprimez ou renommez les points et les valeurs.',
      'Ajustez les options visuelles comme le theme, la legende et la mise en page du graphique.',
      'Verifiez l apercu en direct et affinez les donnees jusqu a ce que le message soit clair.',
      'Exportez le graphique final en PNG ou SVG pour des slides, des documents ou le partage.',
    ],
    chartUsageExamples: [
      'Comparer les performances mensuelles entre equipes ou canaux dans un visuel pret a presenter.',
      'Transformer une courte liste de type feuille de calcul en visuel pour la documentation ou des mises a jour internes.',
      'Tester plusieurs libelles, plages et themes de couleur avant de publier un graphique.',
    ],
    genericDescription: (toolName) =>
      `${toolName} est concu pour des flux de travail rapides dans le navigateur, quand vous voulez un resultat immediat et une interface simple. Utilisez les controles de la page pour saisir vos donnees, ajuster les options disponibles, verifier le resultat, puis copier, telecharger ou exporter quand tout est correct. Ce flux leger convient aux verifications rapides, aux prototypes et aux taches utilitaires du quotidien.`,
    genericUsageSteps: [
      'Saisissez ou importez les donnees source necessaires a l outil.',
      'Ajustez les options disponibles pour obtenir le resultat souhaite.',
      'Verifiez le resultat en direct ou la zone d apercu sur la page.',
      'Affinez les entrees jusqu a ce que le resultat corresponde a votre objectif.',
      'Copiez, telechargez ou exportez le resultat final.',
    ],
    genericUsageExamples: [
      'Preparer rapidement un resultat pour un ticket, un document interne ou un prototype.',
      'Verifier un format d entree ou de sortie avant un flux de travail plus lourd.',
      'Traiter une tache ponctuelle sans quitter le navigateur ni changer d outil.',
    ],
  },
  de: {
    chartDescription: (toolName) =>
      `${toolName} hilft dir dabei, kleine Datensatze direkt im Browser in ein leicht teilbares Diagramm umzuwandeln. Du kannst Beschriftungen und Werte bearbeiten, Titel, Farben, Legende und Layout anpassen und die Vorschau prufen, bevor du das Ergebnis als PNG oder SVG exportierst. Das ist praktisch fur schnelle Berichte, Prasentationen und Dokumentation.`,
    chartUsageSteps: [
      'Lade Beispieldaten oder starte mit den Standardzeilen im Editor.',
      'Aktualisiere den Diagrammtitel und fige Datenpunkte und Werte hinzu, entferne sie oder benenne sie um.',
      'Passe Darstellungsoptionen wie Theme, Legende und diagrammspezifische Layouts an.',
      'Prufe die Live-Vorschau und verfeinere die Daten, bis die Aussage klar ist.',
      'Exportiere das fertige Diagramm als PNG oder SVG fur Folien, Dokumente oder zum Teilen.',
    ],
    chartUsageExamples: [
      'Monatliche Leistung mehrerer Teams oder Kanale in einer prasentationsreifen Grafik vergleichen.',
      'Eine kurze Tabellenliste in eine Visualisierung fur Produktdokumentation oder interne Updates umwandeln.',
      'Beschriftungen, Wertebereiche und Farbthemen testen, bevor ein Diagramm veroffentlicht wird.',
    ],
    genericDescription: (toolName) =>
      `${toolName} ist fur schnelle browserbasierte Ablaufe gedacht, wenn du sofort ein Ergebnis und eine einfache Oberflache brauchst. Nutze die Steuerelemente auf der Seite, um Daten einzugeben oder hochzuladen, Optionen anzupassen, das Ergebnis zu prufen und es anschliessend zu kopieren, herunterzuladen oder zu exportieren. Dieser leichte Ablauf eignet sich fur schnelle Checks, Prototypen und alltagliche Hilfsaufgaben.`,
    genericUsageSteps: [
      'Gib die benotigten Quelldaten ein oder lade sie hoch.',
      'Passe die verfugbaren Optionen an das gewunschte Ergebnis an.',
      'Prufe das Live-Ergebnis oder den Vorschaubereich auf der Seite.',
      'Verfeinere die Eingaben, bis das Ergebnis zu deinem Ziel passt.',
      'Kopiere, lade herunter oder exportiere das Endergebnis.',
    ],
    genericUsageExamples: [
      'Schnell ein Ergebnis fur ein Ticket, internes Dokument oder einen Prototyp vorbereiten.',
      'Ein Ein- oder Ausgabeformat prufen, bevor du in einen schwereren Workflow gehst.',
      'Eine einmalige Aufgabe erledigen, ohne den Browser oder das Werkzeug zu wechseln.',
    ],
  },
  ru: {
    chartDescription: (toolName) =>
      `${toolName} помогает быстро превратить небольшой набор данных в наглядную диаграмму прямо в браузере. Вы можете редактировать подписи и значения, менять заголовок, цвета, легенду и компоновку, а затем проверить предпросмотр перед экспортом результата в PNG или SVG. Инструмент удобен для быстрых отчетов, презентаций и документации.`,
    chartUsageSteps: [
      'Загрузите пример данных или начните с готовых строк в редакторе.',
      'Обновите заголовок диаграммы, затем добавьте, удалите или переименуйте точки и значения.',
      'Настройте оформление: тему, видимость легенды и параметры компоновки диаграммы.',
      'Проверьте предпросмотр и уточняйте данные, пока визуализация не начнет ясно передавать смысл.',
      'Экспортируйте готовую диаграмму в PNG или SVG для слайдов, документов или публикации.',
    ],
    chartUsageExamples: [
      'Сравнить ежемесячные результаты команд или каналов в графике для отчета.',
      'Быстро превратить короткий список значений в визуал для документации или внутреннего обновления.',
      'Проверить разные подписи, диапазоны и цветовые схемы перед публикацией диаграммы.',
    ],
    genericDescription: (toolName) =>
      `${toolName} рассчитан на быстрые браузерные сценарии, когда нужен понятный интерфейс и мгновенный результат. На странице можно ввести или загрузить данные, настроить доступные параметры, проверить результат, а затем скопировать, скачать или экспортировать его. Такой легкий процесс подходит для быстрых проверок, прототипов и повседневных утилитарных задач.`,
    genericUsageSteps: [
      'Введите или загрузите исходные данные, которые нужны инструменту.',
      'Настройте доступные параметры под нужный вам результат.',
      'Проверьте живой результат или область предпросмотра на странице.',
      'Уточняйте входные данные, пока результат не будет соответствовать цели.',
      'Скопируйте, скачайте или экспортируйте итоговый результат.',
    ],
    genericUsageExamples: [
      'Быстро подготовить результат для задачи, внутреннего документа или прототипа.',
      'Проверить формат входных или выходных данных перед более тяжелым процессом.',
      'Решить разовую задачу, не переходя в другой инструмент.',
    ],
  },
  ar: {
    chartDescription: (toolName) =>
      `${toolName} يساعدك على تحويل مجموعات البيانات الصغيرة إلى مخطط قابل للمشاركة مباشرة داخل المتصفح. يمكنك تعديل التسميات والقيم وضبط العنوان والالوان ووسيلة الايضاح والتخطيط ثم مراجعة المعاينة قبل تصدير النتيجة بصيغة PNG او SVG. هذا مناسب للتقارير السريعة والعروض التقديمية والتوثيق.`,
    chartUsageSteps: [
      'حمّل بيانات المثال او ابدأ من الصفوف الافتراضية داخل المحرر.',
      'حدّث عنوان المخطط ثم اضف النقاط والقيم او احذفها او اعد تسميتها.',
      'اضبط خيارات المظهر مثل النمط واظهار وسيلة الايضاح وخيارات التخطيط الخاصة بالمخطط.',
      'راجع المعاينة المباشرة وواصل تحسين البيانات حتى يصبح الرسم واضحا.',
      'صدّر المخطط النهائي بصيغة PNG او SVG لاستخدامه في الشرائح او المستندات او المشاركة.',
    ],
    chartUsageExamples: [
      'مقارنة الاداء الشهري بين الفرق او القنوات في رسم جاهز للعرض.',
      'تحويل قائمة قيم قصيرة الى شكل بصري مناسب للمستندات او التحديثات الداخلية.',
      'تجربة تسميات ونطاقات والوان مختلفة قبل نشر المخطط.',
    ],
    genericDescription: (toolName) =>
      `${toolName} مصمم لعمليات سريعة داخل المتصفح عندما تريد نتيجة فورية وواجهة مباشرة. استخدم عناصر التحكم في الصفحة لادخال البيانات او رفعها ثم اضبط الخيارات المتاحة وراجع الناتج وبعد ذلك انسخ النتيجة او نزّلها او صدّرها عند الحاجة. هذا المسار الخفيف مناسب للفحوصات السريعة والنماذج الاولية والمهام اليومية الصغيرة.`,
    genericUsageSteps: [
      'ادخل البيانات المصدرية التي تحتاجها الاداة او ارفعها.',
      'اضبط الخيارات المتاحة بحيث تطابق النتيجة ما تريد الوصول اليه.',
      'راجع النتيجة المباشرة او منطقة المعاينة في الصفحة.',
      'حسّن المدخلات حتى تطابق النتيجة هدفك.',
      'انسخ النتيجة النهائية او نزّلها او صدّرها.',
    ],
    genericUsageExamples: [
      'تحضير نتيجة سريعة لتذكرة او مستند داخلي او نموذج اولي.',
      'التحقق من صيغة ادخال او اخراج قبل الانتقال الى سير عمل اكبر.',
      'انجاز مهمة لمرة واحدة من دون مغادرة المتصفح او تبديل الادوات.',
    ],
  },
};

function getLocalizedFallbackCopy(locale: string): LocalizedFallbackCopy {
  return LOCALIZED_FALLBACK_COPY[locale] || LOCALIZED_FALLBACK_COPY.en;
}

function isChartFallbackSlug(slug: string): boolean {
  return CHART_FALLBACK_SLUGS.has(slug) || CHARTISH_FALLBACK_PATTERN.test(slug);
}

function buildFallbackFaqs(
  toolName: string,
  locale: string,
  variant: 'chart' | 'generic'
): SupportFAQItem[] {
  if (variant === 'chart') {
    switch (locale) {
      case 'zh':
        return [
          {
            question: `${toolName} 适合什么数据？`,
            answer: `${toolName} 适合标签清晰、规模较小的数据集，例如分类对比、趋势摘要或报告中的关键指标。先保持数据简洁，再根据预览调整标题、标签和配色。`,
          },
          {
            question: `${toolName} 生成图表后应该检查什么？`,
            answer: '导出或分享前，请检查数值是否正确、标签是否容易理解、颜色对比是否清晰，以及图例和标题是否能准确说明图表含义。',
          },
        ];
      case 'ja':
        return [
          {
            question: `${toolName} にはどのようなデータが向いていますか？`,
            answer: `${toolName} は、ラベルが明確な小規模データ、カテゴリ比較、傾向の要約、レポート用の主要指標に向いています。まずデータを絞り、プレビューを見ながらタイトル、ラベル、色を調整してください。`,
          },
          {
            question: `${toolName} で作成したチャートを使う前に何を確認すべきですか？`,
            answer: '書き出しや共有の前に、値が正しいこと、ラベルが読みやすいこと、色のコントラストが十分なこと、凡例とタイトルが内容を正確に説明していることを確認してください。',
          },
        ];
      case 'ko':
        return [
          {
            question: `${toolName}에는 어떤 데이터가 적합한가요?`,
            answer: `${toolName}은 명확한 라벨이 있는 작은 데이터셋, 범주 비교, 추세 요약, 보고서용 핵심 지표에 적합합니다. 데이터를 간단히 정리한 뒤 미리보기를 보면서 제목, 라벨, 색상을 조정하세요.`,
          },
          {
            question: `${toolName}에서 만든 차트를 사용하기 전에 무엇을 확인해야 하나요?`,
            answer: '내보내거나 공유하기 전에 값이 정확한지, 라벨이 이해하기 쉬운지, 색상 대비가 충분한지, 범례와 제목이 차트의 의미를 정확히 설명하는지 확인하세요.',
          },
        ];
      case 'es':
        return [
          {
            question: `Que datos funcionan mejor en ${toolName}?`,
            answer: `${toolName} funciona mejor con conjuntos pequenos y bien etiquetados, como comparaciones por categoria, resumenes de tendencia o metricas clave para informes. Mantén los datos simples y ajusta titulo, etiquetas y colores con la vista previa.`,
          },
          {
            question: `Que debo revisar antes de usar un grafico de ${toolName}?`,
            answer: 'Antes de exportar o compartir, comprueba que los valores sean correctos, que las etiquetas se entiendan, que el contraste de color sea claro y que la leyenda y el titulo expliquen el mensaje del grafico.',
          },
        ];
      case 'pt':
        return [
          {
            question: `Que dados funcionam melhor em ${toolName}?`,
            answer: `${toolName} funciona melhor com conjuntos pequenos e bem rotulados, como comparacoes por categoria, resumos de tendencia ou metricas principais para relatorios. Mantenha os dados simples e ajuste titulo, rotulos e cores pela previa.`,
          },
          {
            question: `O que devo revisar antes de usar um grafico de ${toolName}?`,
            answer: 'Antes de exportar ou compartilhar, confira se os valores estao corretos, se os rotulos sao claros, se o contraste de cores e suficiente e se a legenda e o titulo explicam a mensagem do grafico.',
          },
        ];
      case 'fr':
        return [
          {
            question: `Quels types de donnees conviennent a ${toolName} ?`,
            answer: `${toolName} convient surtout aux petits jeux de donnees bien libelles, comme des comparaisons par categorie, des tendances resumees ou des indicateurs cles pour un rapport. Gardez les donnees simples, puis ajustez le titre, les libelles et les couleurs dans l apercu.`,
          },
          {
            question: `Que verifier avant d utiliser un graphique cree avec ${toolName} ?`,
            answer: 'Avant d exporter ou de partager, verifiez que les valeurs sont correctes, que les libelles sont lisibles, que le contraste des couleurs est clair et que la legende et le titre expliquent correctement le message.',
          },
        ];
      case 'de':
        return [
          {
            question: `Welche Daten eignen sich fur ${toolName}?`,
            answer: `${toolName} eignet sich besonders fur kleine, klar beschriftete Datensatze wie Kategorievergleiche, Trendzusammenfassungen oder Kennzahlen fur Berichte. Halte die Daten ubersichtlich und passe Titel, Labels und Farben in der Vorschau an.`,
          },
          {
            question: `Was sollte ich vor der Nutzung eines Diagramms aus ${toolName} prufen?`,
            answer: 'Prufe vor dem Export oder Teilen, ob die Werte stimmen, die Labels verstandlich sind, der Farbkontrast klar ist und Legende sowie Titel die Aussage des Diagramms korrekt erklaren.',
          },
        ];
      case 'ru':
        return [
          {
            question: `Какие данные лучше всего подходят для ${toolName}?`,
            answer: `${toolName} лучше всего подходит для небольших наборов данных с понятными подписями: сравнений по категориям, кратких трендов или ключевых показателей для отчета. Сначала упростите данные, затем настройте заголовок, подписи и цвета по предпросмотру.`,
          },
          {
            question: `Что проверить перед использованием диаграммы из ${toolName}?`,
            answer: 'Перед экспортом или публикацией проверьте корректность значений, понятность подписей, достаточный контраст цветов, а также то, что легенда и заголовок точно объясняют смысл диаграммы.',
          },
        ];
      case 'ar':
        return [
          {
            question: `ما نوع البيانات المناسب لـ ${toolName}؟`,
            answer: `${toolName} يناسب مجموعات البيانات الصغيرة ذات التسميات الواضحة مثل المقارنات حسب الفئة او ملخصات الاتجاهات او المؤشرات الرئيسية للتقارير. ابق البيانات بسيطة ثم اضبط العنوان والتسميات والالوان من خلال المعاينة.`,
          },
          {
            question: `ما الذي يجب مراجعته قبل استخدام مخطط من ${toolName}؟`,
            answer: 'قبل التصدير او المشاركة، راجع صحة القيم ووضوح التسميات وتباين الالوان، وتأكد من ان وسيلة الايضاح والعنوان يشرحان رسالة المخطط بدقة.',
          },
        ];
      default:
        return [
          {
            question: `What data works best in ${toolName}?`,
            answer: `${toolName} works best with small, clearly labeled datasets such as category comparisons, trend summaries, or key metrics for a report. Keep the data focused, then use the preview to tune the title, labels, and colors.`,
          },
          {
            question: `What should I check before using a chart from ${toolName}?`,
            answer: 'Before exporting or sharing, check that the values are correct, labels are easy to understand, color contrast is clear, and the legend and title explain the chart message accurately.',
          },
        ];
    }
  }

  switch (locale) {
    case 'zh':
      return [
        {
          question: `${toolName} 适合什么时候使用？`,
          answer: `${toolName} 适合需要在浏览器中快速完成轻量任务的场景，例如检查输入、整理输出、准备原型或处理一次性工作。`,
        },
        {
          question: `使用 ${toolName} 的结果前应该检查什么？`,
          answer: '复制、下载或导出前，请确认输入内容、选项设置和预览结果都符合你的目标；如果页面提供多种输出方式，选择最适合后续工作流的一种。',
        },
      ];
    case 'ja':
      return [
        {
          question: `${toolName} はどのような場面で使えますか？`,
          answer: `${toolName} は、入力の確認、出力の整理、プロトタイプ作成、単発作業など、ブラウザ上ですばやく軽量なタスクを処理したい場面に向いています。`,
        },
        {
          question: `${toolName} の結果を使う前に何を確認すべきですか？`,
          answer: 'コピー、ダウンロード、または書き出しの前に、入力内容、オプション設定、プレビュー結果が目的に合っているか確認してください。複数の出力方法がある場合は、次の作業に合うものを選びます。',
        },
      ];
    case 'ko':
      return [
        {
          question: `${toolName}은 언제 사용하면 좋나요?`,
          answer: `${toolName}은 입력 확인, 출력 정리, 프로토타입 준비, 일회성 작업처럼 브라우저에서 빠르게 가벼운 작업을 처리해야 할 때 적합합니다.`,
        },
        {
          question: `${toolName}의 결과를 사용하기 전에 무엇을 확인해야 하나요?`,
          answer: '복사, 다운로드 또는 내보내기 전에 입력 내용, 옵션 설정, 미리보기 결과가 목적에 맞는지 확인하세요. 여러 출력 방식이 있으면 다음 작업에 가장 알맞은 방식을 선택하세요.',
        },
      ];
    case 'es':
      return [
        {
          question: `Cuando conviene usar ${toolName}?`,
          answer: `${toolName} es util cuando necesitas resolver una tarea ligera en el navegador, como comprobar una entrada, preparar una salida, crear un prototipo o completar un trabajo puntual.`,
        },
        {
          question: `Que debo revisar antes de usar el resultado de ${toolName}?`,
          answer: 'Antes de copiar, descargar o exportar, confirma que la entrada, las opciones y la vista previa coincidan con tu objetivo. Si hay varias salidas disponibles, elige la que encaje mejor con tu siguiente flujo de trabajo.',
        },
      ];
    case 'pt':
      return [
        {
          question: `Quando devo usar ${toolName}?`,
          answer: `${toolName} e util quando voce precisa concluir uma tarefa leve no navegador, como verificar uma entrada, preparar uma saida, montar um prototipo ou resolver um trabalho pontual.`,
        },
        {
          question: `O que devo conferir antes de usar o resultado de ${toolName}?`,
          answer: 'Antes de copiar, baixar ou exportar, confirme se a entrada, as opcoes e a previa correspondem ao seu objetivo. Se houver varias saidas disponiveis, escolha a que melhor se encaixa no proximo fluxo de trabalho.',
        },
      ];
    case 'fr':
      return [
        {
          question: `Quand utiliser ${toolName} ?`,
          answer: `${toolName} est utile quand vous devez traiter une tache legere dans le navigateur, par exemple verifier une entree, preparer une sortie, creer un prototype ou terminer une action ponctuelle.`,
        },
        {
          question: `Que verifier avant d utiliser le resultat de ${toolName} ?`,
          answer: 'Avant de copier, telecharger ou exporter, verifiez que l entree, les options et l apercu correspondent a votre objectif. Si plusieurs sorties sont proposees, choisissez celle qui convient le mieux a votre prochain flux de travail.',
        },
      ];
    case 'de':
      return [
        {
          question: `Wann sollte ich ${toolName} verwenden?`,
          answer: `${toolName} ist hilfreich, wenn du eine leichte Aufgabe direkt im Browser erledigen willst, etwa Eingaben prufen, Ausgaben vorbereiten, einen Prototyp bauen oder eine einmalige Aufgabe abschliessen.`,
        },
        {
          question: `Was sollte ich vor der Nutzung des Ergebnisses aus ${toolName} prufen?`,
          answer: 'Prufe vor dem Kopieren, Herunterladen oder Exportieren, ob Eingabe, Optionen und Vorschau zu deinem Ziel passen. Wenn mehrere Ausgabewege verfugbar sind, wahle den passenden fur deinen nachsten Arbeitsschritt.',
        },
      ];
    case 'ru':
      return [
        {
          question: `Когда стоит использовать ${toolName}?`,
          answer: `${toolName} полезен, когда нужно быстро выполнить легкую задачу в браузере: проверить ввод, подготовить результат, собрать прототип или закрыть разовую работу.`,
        },
        {
          question: `Что проверить перед использованием результата из ${toolName}?`,
          answer: 'Перед копированием, скачиванием или экспортом убедитесь, что исходные данные, настройки и предпросмотр соответствуют вашей цели. Если доступно несколько вариантов вывода, выберите тот, который лучше подходит для следующего шага.',
        },
      ];
    case 'ar':
      return [
        {
          question: `متى يمكن استخدام ${toolName}؟`,
          answer: `${toolName} مفيد عندما تحتاج الى انجاز مهمة خفيفة داخل المتصفح، مثل التحقق من مدخلات او تجهيز مخرجات او اعداد نموذج اولي او انهاء عمل لمرة واحدة.`,
        },
        {
          question: `ما الذي يجب مراجعته قبل استخدام نتيجة ${toolName}؟`,
          answer: 'قبل النسخ او التنزيل او التصدير، تأكد من ان المدخلات والخيارات والمعاينة تطابق هدفك. اذا توفرت عدة صيغ اخراج، اختر الصيغة الانسب للخطوة التالية.',
        },
      ];
    default:
      return [
        {
          question: `When should I use ${toolName}?`,
          answer: `${toolName} is useful when you need to complete a lightweight browser task quickly, such as checking input, preparing output, building a prototype, or handling a one-off utility workflow.`,
        },
        {
          question: `What should I check before using the result from ${toolName}?`,
          answer: 'Before copying, downloading, or exporting, confirm that the input, options, and preview match your goal. If the page offers multiple output formats, choose the one that best fits your next workflow.',
        },
      ];
  }
}

function buildChartFallback(toolName: string, locale: string): SupportContentFallback {
  const copy = getLocalizedFallbackCopy(locale);
  return {
    detailedDescription: copy.chartDescription(toolName),
    usageSteps: copy.chartUsageSteps,
    usageExamples: copy.chartUsageExamples,
    faqs: buildFallbackFaqs(toolName, locale, 'chart'),
  };
}

function buildImageConverterFallback(toolName: string): SupportContentFallback {
  return {
    detailedDescription: `${toolName} converts local images between PNG, JPEG, and WebP in the browser. Upload an image, choose the target format, adjust quality when you need a lossy export, and compare the original with the converted preview before downloading the result. This is useful for quick asset preparation, lightweight website images, and format checks when you want a simple one-page workflow.`,
    usageSteps: [
      'Upload an image from your device to load the original preview.',
      'Choose PNG, JPEG, or WebP as the target format.',
      'If you select JPEG or WebP, adjust the quality slider to balance size and clarity.',
      'Run the conversion and compare the converted preview with the original image.',
      'Download the converted file once the result looks right.',
    ],
    usageExamples: [
      'Turn a PNG screenshot into JPEG for a lighter email attachment.',
      'Export a transparent design asset as WebP for a faster web page.',
      'Check how the same image looks across common web-friendly formats before publishing.',
    ],
    faqs: [
      {
        question: `Which formats can ${toolName} create?`,
        answer: `${toolName} is designed around common browser-friendly formats: PNG, JPEG, and WebP. Choose the format that matches the transparency, file-size, or compatibility needs of your next workflow.`,
      },
      {
        question: `What should I check before downloading from ${toolName}?`,
        answer: 'Compare the converted preview with the original image and adjust quality for JPEG or WebP exports when you need a smaller file or a clearer result.',
      },
    ],
  };
}

function buildPlaceholderImageFallback(toolName: string): SupportContentFallback {
  return {
    detailedDescription: `${toolName} creates simple placeholder graphics on a canvas using the size, colors, and label text you choose. It is handy for mockups, component states, ad slots, and layout testing when you need a quick visual stand-in without hunting for a real asset. After generating the preview, you can download a PNG or copy the Data URL for direct use in prototypes.`,
    usageSteps: [
      'Enter the width and height for the placeholder you need.',
      'Choose background and text colors, then add custom label text if desired.',
      'Use one of the preset sizes when you want a common banner, card, or social ratio.',
      'Generate the preview and confirm the placeholder looks right on the canvas.',
      'Download the PNG or copy the Data URL for use in code, docs, or mockups.',
    ],
    usageExamples: [
      'Create a 1200×630 social preview block while an Open Graph image is still in production.',
      'Generate card-sized placeholders for a dashboard or CMS list view.',
      'Produce quick image stand-ins for wireframes, UI tests, or design reviews.',
    ],
    faqs: buildFallbackFaqs(toolName, 'en', 'generic'),
  };
}

function buildDnsLookupFallback(toolName: string): SupportContentFallback {
  return {
    detailedDescription: `${toolName} checks common DNS record types for a domain and displays the answers returned by a public DNS-over-HTTPS endpoint. The page queries A, AAAA, CNAME, MX, NS, and TXT records, then groups the returned values with their TTLs so you can inspect current DNS data without leaving the browser. It is useful for quick troubleshooting, propagation checks, and verifying that the records you expect are visible.`,
    usageSteps: [
      'Enter a domain name in the lookup field.',
      'Run the lookup to request A, AAAA, CNAME, MX, NS, and TXT records.',
      'Review each result group and compare returned values and TTLs.',
      'Use the output to confirm current DNS answers after a change or migration.',
      'Repeat the lookup after propagation windows if you are validating an update.',
    ],
    usageExamples: [
      'Confirm that a new MX setup is visible before testing email delivery.',
      'Check whether a CNAME or TXT record has propagated after a DNS update.',
      'Inspect A and AAAA answers during a hosting move or CDN cutover.',
    ],
    faqs: [
      {
        question: `Which DNS records does ${toolName} check?`,
        answer: `${toolName} checks common record groups such as A, AAAA, CNAME, MX, NS, and TXT so you can review the current answers returned for a domain.`,
      },
      {
        question: `Why might ${toolName} show different DNS results later?`,
        answer: 'DNS answers can change as records propagate or caches expire. If you recently changed a record, repeat the lookup after the relevant TTL window.',
      },
    ],
  };
}

function buildImageWatermarkFallback(toolName: string): SupportContentFallback {
  return {
    detailedDescription: `${toolName} adds a text watermark to an uploaded image in the browser. You can control the watermark text, position, size, opacity, rotation, and color, then preview the result on the canvas before exporting a PNG. It is useful for branded previews, draft proofs, copyright labels, and internal review copies where you need a visible text overlay without opening a full design app.`,
    usageSteps: [
      'Upload an image from your device to load it into the preview canvas.',
      'Enter the watermark text you want to apply.',
      'Choose a placement such as center, corner, or tiled repetition.',
      'Adjust font size, opacity, rotation, and color until the overlay looks right.',
      'Download the final watermarked PNG once the preview is ready.',
    ],
    usageExamples: [
      'Add a branded draft label before sharing a mockup for feedback.',
      'Place a copyright notice in the corner of a portfolio preview image.',
      'Create tiled review watermarks for internal-only screenshots or design comps.',
    ],
    faqs: buildFallbackFaqs(toolName, 'en', 'generic'),
  };
}

function buildLoremPicsumFallback(toolName: string): SupportContentFallback {
  return {
    detailedDescription: `${toolName} helps you build placeholder image URLs from Picsum Photos with the size and options you need. You can set width and height, choose a seed or image ID, toggle grayscale, add blur, and preview the resulting image on the page. The tool also gives you a copyable image URL plus HTML and Markdown snippets, which makes it useful for prototypes, docs, and frontend testing.`,
    usageSteps: [
      'Set the width and height or choose one of the preset size buttons.',
      'Optionally add a seed or specific image ID to make the result repeatable.',
      'Toggle grayscale or adjust blur if you want a stylized placeholder.',
      'Generate the URL and confirm the preview matches your needs.',
      'Copy the direct URL, HTML snippet, or Markdown snippet for your project.',
    ],
    usageExamples: [
      'Generate repeatable placeholder images for a design system demo.',
      'Create quick Markdown-ready images for internal docs or test content.',
      'Preview different responsive image sizes before real assets are available.',
    ],
    faqs: buildFallbackFaqs(toolName, 'en', 'generic'),
  };
}

function buildGenericFallback(toolName: string, locale: string): SupportContentFallback {
  const copy = getLocalizedFallbackCopy(locale);
  return {
    detailedDescription: copy.genericDescription(toolName),
    usageSteps: copy.genericUsageSteps,
    usageExamples: copy.genericUsageExamples,
    faqs: buildFallbackFaqs(toolName, locale, 'generic'),
  };
}

export function buildSafeFallbackSupportContent(
  slug: string,
  toolName: string,
  locale: string
): SupportContentFallback {
  if (isChartFallbackSlug(slug)) {
    return buildChartFallback(toolName, locale);
  }

  if (locale !== 'en') {
    return buildGenericFallback(toolName, locale);
  }

  switch (slug) {
    case 'image-converter':
      return buildImageConverterFallback(toolName);
    case 'placeholder-image':
      return buildPlaceholderImageFallback(toolName);
    case 'dns-lookup':
      return buildDnsLookupFallback(toolName);
    case 'image-watermark':
      return buildImageWatermarkFallback(toolName);
    case 'lorem-picsum':
      return buildLoremPicsumFallback(toolName);
    default:
      return buildGenericFallback(toolName, locale);
  }
}
