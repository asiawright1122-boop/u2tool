export interface SupportContentFallback {
  detailedDescription: string;
  usageExamples: string[];
  usageSteps: string[];
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
  /(chart|heatmap|pie|doughnut|sunburst|sankey|waterfall|timeline|candlestick|radar|venn|treemap|river|ring)/;

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

function buildChartFallback(toolName: string, locale: string): SupportContentFallback {
  const copy = getLocalizedFallbackCopy(locale);
  return {
    detailedDescription: copy.chartDescription(toolName),
    usageSteps: copy.chartUsageSteps,
    usageExamples: copy.chartUsageExamples,
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
  };
}

function buildGenericFallback(toolName: string, locale: string): SupportContentFallback {
  const copy = getLocalizedFallbackCopy(locale);
  return {
    detailedDescription: copy.genericDescription(toolName),
    usageSteps: copy.genericUsageSteps,
    usageExamples: copy.genericUsageExamples,
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
