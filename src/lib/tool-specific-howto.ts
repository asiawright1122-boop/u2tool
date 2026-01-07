/**
 * 工具特定 HowTo 步骤配置
 * 为热门工具提供详细的使用步骤，用于 HowTo JSON-LD 结构化数据
 */

export interface HowToStep {
  name: string;
  text: string;
}

export interface ToolHowToConfig {
  slug: string;
  totalTime: string; // ISO 8601 duration format, e.g., "PT2M" = 2 minutes
  steps: Record<string, HowToStep[]>;
}

// 热门工具的特定 HowTo 步骤配置
export const TOOL_SPECIFIC_HOWTO: ToolHowToConfig[] = [
  // 1. JSON Formatter
  {
    slug: 'json-formatter',
    totalTime: 'PT1M',
    steps: {
      en: [
        { name: 'Open the JSON Formatter', text: 'Navigate to the JSON Formatter tool page on U2Tool.' },
        { name: 'Paste your JSON data', text: 'Copy your JSON data and paste it into the input text area on the left side.' },
        { name: 'Choose formatting options', text: 'Select your preferred indentation level (2 spaces, 4 spaces, or tabs) from the options.' },
        { name: 'Click Format', text: 'Click the "Format" button to beautify your JSON with proper indentation and syntax highlighting.' },
        { name: 'Review and copy result', text: 'Check the formatted output for any syntax errors. Click "Copy" to copy the result to your clipboard.' },
      ],
      zh: [
        { name: '打开 JSON 格式化工具', text: '在 U2Tool 上导航到 JSON 格式化工具页面。' },
        { name: '粘贴 JSON 数据', text: '复制您的 JSON 数据并粘贴到左侧的输入文本区域。' },
        { name: '选择格式化选项', text: '从选项中选择您喜欢的缩进级别（2 空格、4 空格或制表符）。' },
        { name: '点击格式化', text: '点击"格式化"按钮，使用正确的缩进和语法高亮美化您的 JSON。' },
        { name: '检查并复制结果', text: '检查格式化输出是否有语法错误。点击"复制"将结果复制到剪贴板。' },
      ],
      ja: [
        { name: 'JSONフォーマッターを開く', text: 'U2ToolのJSONフォーマッターツールページに移動します。' },
        { name: 'JSONデータを貼り付け', text: 'JSONデータをコピーして、左側の入力テキストエリアに貼り付けます。' },
        { name: 'フォーマットオプションを選択', text: 'オプションから希望のインデントレベル（2スペース、4スペース、またはタブ）を選択します。' },
        { name: 'フォーマットをクリック', text: '「フォーマット」ボタンをクリックして、適切なインデントとシンタックスハイライトでJSONを整形します。' },
        { name: '結果を確認してコピー', text: 'フォーマットされた出力に構文エラーがないか確認します。「コピー」をクリックして結果をクリップボードにコピーします。' },
      ],
      ko: [
        { name: 'JSON 포맷터 열기', text: 'U2Tool의 JSON 포맷터 도구 페이지로 이동합니다.' },
        { name: 'JSON 데이터 붙여넣기', text: 'JSON 데이터를 복사하여 왼쪽 입력 텍스트 영역에 붙여넣습니다.' },
        { name: '포맷 옵션 선택', text: '옵션에서 원하는 들여쓰기 수준(2칸, 4칸 또는 탭)을 선택합니다.' },
        { name: '포맷 클릭', text: '"포맷" 버튼을 클릭하여 적절한 들여쓰기와 구문 강조로 JSON을 정리합니다.' },
        { name: '결과 확인 및 복사', text: '포맷된 출력에 구문 오류가 없는지 확인합니다. "복사"를 클릭하여 결과를 클립보드에 복사합니다.' },
      ],
      es: [
        { name: 'Abrir el formateador JSON', text: 'Navegue a la página del formateador JSON en U2Tool.' },
        { name: 'Pegar datos JSON', text: 'Copie sus datos JSON y péguelos en el área de texto de entrada del lado izquierdo.' },
        { name: 'Elegir opciones de formato', text: 'Seleccione su nivel de sangría preferido (2 espacios, 4 espacios o tabulaciones).' },
        { name: 'Hacer clic en Formatear', text: 'Haga clic en el botón "Formatear" para embellecer su JSON con sangría y resaltado de sintaxis.' },
        { name: 'Revisar y copiar resultado', text: 'Verifique la salida formateada en busca de errores de sintaxis. Haga clic en "Copiar" para copiar el resultado.' },
      ],
      pt: [
        { name: 'Abrir o formatador JSON', text: 'Navegue até a página do formatador JSON no U2Tool.' },
        { name: 'Colar dados JSON', text: 'Copie seus dados JSON e cole na área de texto de entrada do lado esquerdo.' },
        { name: 'Escolher opções de formatação', text: 'Selecione seu nível de indentação preferido (2 espaços, 4 espaços ou tabs).' },
        { name: 'Clicar em Formatar', text: 'Clique no botão "Formatar" para embelezar seu JSON com indentação e destaque de sintaxe.' },
        { name: 'Revisar e copiar resultado', text: 'Verifique a saída formatada em busca de erros de sintaxe. Clique em "Copiar" para copiar o resultado.' },
      ],
      fr: [
        { name: 'Ouvrir le formateur JSON', text: 'Accédez à la page du formateur JSON sur U2Tool.' },
        { name: 'Coller les données JSON', text: 'Copiez vos données JSON et collez-les dans la zone de texte de saisie à gauche.' },
        { name: 'Choisir les options de formatage', text: 'Sélectionnez votre niveau d\'indentation préféré (2 espaces, 4 espaces ou tabulations).' },
        { name: 'Cliquer sur Formater', text: 'Cliquez sur le bouton "Formater" pour embellir votre JSON avec une indentation et une coloration syntaxique.' },
        { name: 'Vérifier et copier le résultat', text: 'Vérifiez la sortie formatée pour les erreurs de syntaxe. Cliquez sur "Copier" pour copier le résultat.' },
      ],
      de: [
        { name: 'JSON-Formatierer öffnen', text: 'Navigieren Sie zur JSON-Formatierer-Seite auf U2Tool.' },
        { name: 'JSON-Daten einfügen', text: 'Kopieren Sie Ihre JSON-Daten und fügen Sie sie in den Eingabetextbereich auf der linken Seite ein.' },
        { name: 'Formatierungsoptionen wählen', text: 'Wählen Sie Ihre bevorzugte Einrückungsebene (2 Leerzeichen, 4 Leerzeichen oder Tabs).' },
        { name: 'Auf Formatieren klicken', text: 'Klicken Sie auf "Formatieren", um Ihr JSON mit korrekter Einrückung und Syntaxhervorhebung zu verschönern.' },
        { name: 'Ergebnis überprüfen und kopieren', text: 'Überprüfen Sie die formatierte Ausgabe auf Syntaxfehler. Klicken Sie auf "Kopieren", um das Ergebnis zu kopieren.' },
      ],
      ru: [
        { name: 'Открыть форматтер JSON', text: 'Перейдите на страницу форматтера JSON на U2Tool.' },
        { name: 'Вставить данные JSON', text: 'Скопируйте данные JSON и вставьте их в текстовую область ввода слева.' },
        { name: 'Выбрать параметры форматирования', text: 'Выберите предпочтительный уровень отступа (2 пробела, 4 пробела или табуляции).' },
        { name: 'Нажать Форматировать', text: 'Нажмите кнопку "Форматировать", чтобы украсить JSON с правильными отступами и подсветкой синтаксиса.' },
        { name: 'Проверить и скопировать результат', text: 'Проверьте отформатированный вывод на наличие синтаксических ошибок. Нажмите "Копировать", чтобы скопировать результат.' },
      ],
      ar: [
        { name: 'فتح منسق JSON', text: 'انتقل إلى صفحة أداة منسق JSON على U2Tool.' },
        { name: 'لصق بيانات JSON', text: 'انسخ بيانات JSON الخاصة بك والصقها في منطقة نص الإدخال على الجانب الأيسر.' },
        { name: 'اختيار خيارات التنسيق', text: 'حدد مستوى المسافة البادئة المفضل لديك (مسافتان أو 4 مسافات أو علامات تبويب).' },
        { name: 'النقر على تنسيق', text: 'انقر فوق زر "تنسيق" لتجميل JSON الخاص بك بمسافة بادئة صحيحة وتمييز بناء الجملة.' },
        { name: 'مراجعة ونسخ النتيجة', text: 'تحقق من الإخراج المنسق بحثًا عن أخطاء في بناء الجملة. انقر فوق "نسخ" لنسخ النتيجة.' },
      ],
    },
  },

  // 2. Base64 Encoder/Decoder
  {
    slug: 'base64',
    totalTime: 'PT30S',
    steps: {
      en: [
        { name: 'Open Base64 Tool', text: 'Navigate to the Base64 encoder/decoder tool page on U2Tool.' },
        { name: 'Enter your text or data', text: 'Type or paste the text you want to encode or decode into the input field.' },
        { name: 'Select mode', text: 'Choose "Encode" to convert text to Base64, or "Decode" to convert Base64 back to text.' },
        { name: 'Click the action button', text: 'Click the Encode or Decode button to process your data instantly.' },
        { name: 'Copy the result', text: 'The result appears in the output area. Click "Copy" to copy it to your clipboard.' },
      ],
      zh: [
        { name: '打开 Base64 工具', text: '在 U2Tool 上导航到 Base64 编码/解码工具页面。' },
        { name: '输入文本或数据', text: '在输入框中输入或粘贴要编码或解码的文本。' },
        { name: '选择模式', text: '选择"编码"将文本转换为 Base64，或选择"解码"将 Base64 转换回文本。' },
        { name: '点击操作按钮', text: '点击编码或解码按钮立即处理您的数据。' },
        { name: '复制结果', text: '结果显示在输出区域。点击"复制"将其复制到剪贴板。' },
      ],
      ja: [
        { name: 'Base64ツールを開く', text: 'U2ToolのBase64エンコーダー/デコーダーツールページに移動します。' },
        { name: 'テキストまたはデータを入力', text: 'エンコードまたはデコードしたいテキストを入力フィールドに入力または貼り付けます。' },
        { name: 'モードを選択', text: 'テキストをBase64に変換するには「エンコード」を、Base64をテキストに戻すには「デコード」を選択します。' },
        { name: 'アクションボタンをクリック', text: 'エンコードまたはデコードボタンをクリックして、データを即座に処理します。' },
        { name: '結果をコピー', text: '結果が出力エリアに表示されます。「コピー」をクリックしてクリップボードにコピーします。' },
      ],
      ko: [
        { name: 'Base64 도구 열기', text: 'U2Tool의 Base64 인코더/디코더 도구 페이지로 이동합니다.' },
        { name: '텍스트 또는 데이터 입력', text: '인코딩하거나 디코딩할 텍스트를 입력 필드에 입력하거나 붙여넣습니다.' },
        { name: '모드 선택', text: '텍스트를 Base64로 변환하려면 "인코딩"을, Base64를 텍스트로 되돌리려면 "디코딩"을 선택합니다.' },
        { name: '작업 버튼 클릭', text: '인코딩 또는 디코딩 버튼을 클릭하여 데이터를 즉시 처리합니다.' },
        { name: '결과 복사', text: '결과가 출력 영역에 나타납니다. "복사"를 클릭하여 클립보드에 복사합니다.' },
      ],
      es: [
        { name: 'Abrir herramienta Base64', text: 'Navegue a la página del codificador/decodificador Base64 en U2Tool.' },
        { name: 'Ingresar texto o datos', text: 'Escriba o pegue el texto que desea codificar o decodificar en el campo de entrada.' },
        { name: 'Seleccionar modo', text: 'Elija "Codificar" para convertir texto a Base64, o "Decodificar" para convertir Base64 a texto.' },
        { name: 'Hacer clic en el botón de acción', text: 'Haga clic en el botón Codificar o Decodificar para procesar sus datos al instante.' },
        { name: 'Copiar el resultado', text: 'El resultado aparece en el área de salida. Haga clic en "Copiar" para copiarlo al portapapeles.' },
      ],
      pt: [
        { name: 'Abrir ferramenta Base64', text: 'Navegue até a página do codificador/decodificador Base64 no U2Tool.' },
        { name: 'Inserir texto ou dados', text: 'Digite ou cole o texto que deseja codificar ou decodificar no campo de entrada.' },
        { name: 'Selecionar modo', text: 'Escolha "Codificar" para converter texto em Base64, ou "Decodificar" para converter Base64 em texto.' },
        { name: 'Clicar no botão de ação', text: 'Clique no botão Codificar ou Decodificar para processar seus dados instantaneamente.' },
        { name: 'Copiar o resultado', text: 'O resultado aparece na área de saída. Clique em "Copiar" para copiá-lo para a área de transferência.' },
      ],
      fr: [
        { name: 'Ouvrir l\'outil Base64', text: 'Accédez à la page de l\'encodeur/décodeur Base64 sur U2Tool.' },
        { name: 'Entrer le texte ou les données', text: 'Tapez ou collez le texte que vous souhaitez encoder ou décoder dans le champ de saisie.' },
        { name: 'Sélectionner le mode', text: 'Choisissez "Encoder" pour convertir le texte en Base64, ou "Décoder" pour convertir Base64 en texte.' },
        { name: 'Cliquer sur le bouton d\'action', text: 'Cliquez sur le bouton Encoder ou Décoder pour traiter vos données instantanément.' },
        { name: 'Copier le résultat', text: 'Le résultat apparaît dans la zone de sortie. Cliquez sur "Copier" pour le copier dans le presse-papiers.' },
      ],
      de: [
        { name: 'Base64-Tool öffnen', text: 'Navigieren Sie zur Base64-Encoder/Decoder-Seite auf U2Tool.' },
        { name: 'Text oder Daten eingeben', text: 'Geben Sie den Text, den Sie kodieren oder dekodieren möchten, in das Eingabefeld ein oder fügen Sie ihn ein.' },
        { name: 'Modus auswählen', text: 'Wählen Sie "Kodieren", um Text in Base64 zu konvertieren, oder "Dekodieren", um Base64 in Text umzuwandeln.' },
        { name: 'Auf Aktionsschaltfläche klicken', text: 'Klicken Sie auf die Schaltfläche Kodieren oder Dekodieren, um Ihre Daten sofort zu verarbeiten.' },
        { name: 'Ergebnis kopieren', text: 'Das Ergebnis erscheint im Ausgabebereich. Klicken Sie auf "Kopieren", um es in die Zwischenablage zu kopieren.' },
      ],
      ru: [
        { name: 'Открыть инструмент Base64', text: 'Перейдите на страницу кодировщика/декодировщика Base64 на U2Tool.' },
        { name: 'Ввести текст или данные', text: 'Введите или вставьте текст, который хотите закодировать или декодировать, в поле ввода.' },
        { name: 'Выбрать режим', text: 'Выберите "Кодировать" для преобразования текста в Base64 или "Декодировать" для преобразования Base64 в текст.' },
        { name: 'Нажать кнопку действия', text: 'Нажмите кнопку Кодировать или Декодировать, чтобы мгновенно обработать данные.' },
        { name: 'Скопировать результат', text: 'Результат появится в области вывода. Нажмите "Копировать", чтобы скопировать его в буфер обмена.' },
      ],
      ar: [
        { name: 'فتح أداة Base64', text: 'انتقل إلى صفحة أداة ترميز/فك ترميز Base64 على U2Tool.' },
        { name: 'إدخال النص أو البيانات', text: 'اكتب أو الصق النص الذي تريد ترميزه أو فك ترميزه في حقل الإدخال.' },
        { name: 'تحديد الوضع', text: 'اختر "ترميز" لتحويل النص إلى Base64، أو "فك الترميز" لتحويل Base64 إلى نص.' },
        { name: 'النقر على زر الإجراء', text: 'انقر فوق زر الترميز أو فك الترميز لمعالجة بياناتك على الفور.' },
        { name: 'نسخ النتيجة', text: 'تظهر النتيجة في منطقة الإخراج. انقر فوق "نسخ" لنسخها إلى الحافظة.' },
      ],
    },
  },

  // 3. UUID Generator
  {
    slug: 'uuid-generator',
    totalTime: 'PT20S',
    steps: {
      en: [
        { name: 'Open UUID Generator', text: 'Navigate to the UUID Generator tool page on U2Tool.' },
        { name: 'Select UUID version', text: 'Choose the UUID version you need (v1 for time-based, v4 for random - recommended for most uses).' },
        { name: 'Set quantity', text: 'Enter the number of UUIDs you want to generate (1 to 1000).' },
        { name: 'Click Generate', text: 'Click the "Generate" button to create your UUIDs instantly.' },
        { name: 'Copy or download', text: 'Copy individual UUIDs or download all as a text file for bulk use.' },
      ],
      zh: [
        { name: '打开 UUID 生成器', text: '在 U2Tool 上导航到 UUID 生成器工具页面。' },
        { name: '选择 UUID 版本', text: '选择您需要的 UUID 版本（v1 基于时间，v4 随机 - 推荐用于大多数用途）。' },
        { name: '设置数量', text: '输入要生成的 UUID 数量（1 到 1000）。' },
        { name: '点击生成', text: '点击"生成"按钮立即创建您的 UUID。' },
        { name: '复制或下载', text: '复制单个 UUID 或下载所有 UUID 为文本文件以供批量使用。' },
      ],
      ja: [
        { name: 'UUID生成器を開く', text: 'U2ToolのUUID生成器ツールページに移動します。' },
        { name: 'UUIDバージョンを選択', text: '必要なUUIDバージョンを選択します（v1は時間ベース、v4はランダム - ほとんどの用途に推奨）。' },
        { name: '数量を設定', text: '生成したいUUIDの数を入力します（1〜1000）。' },
        { name: '生成をクリック', text: '「生成」ボタンをクリックして、UUIDを即座に作成します。' },
        { name: 'コピーまたはダウンロード', text: '個々のUUIDをコピーするか、すべてをテキストファイルとしてダウンロードして一括使用します。' },
      ],
      ko: [
        { name: 'UUID 생성기 열기', text: 'U2Tool의 UUID 생성기 도구 페이지로 이동합니다.' },
        { name: 'UUID 버전 선택', text: '필요한 UUID 버전을 선택합니다(v1은 시간 기반, v4는 무작위 - 대부분의 용도에 권장).' },
        { name: '수량 설정', text: '생성할 UUID 수를 입력합니다(1~1000).' },
        { name: '생성 클릭', text: '"생성" 버튼을 클릭하여 UUID를 즉시 만듭니다.' },
        { name: '복사 또는 다운로드', text: '개별 UUID를 복사하거나 모두 텍스트 파일로 다운로드하여 대량 사용합니다.' },
      ],
      es: [
        { name: 'Abrir generador UUID', text: 'Navegue a la página del generador UUID en U2Tool.' },
        { name: 'Seleccionar versión UUID', text: 'Elija la versión UUID que necesita (v1 basada en tiempo, v4 aleatoria - recomendada para la mayoría de usos).' },
        { name: 'Establecer cantidad', text: 'Ingrese la cantidad de UUIDs que desea generar (1 a 1000).' },
        { name: 'Hacer clic en Generar', text: 'Haga clic en el botón "Generar" para crear sus UUIDs al instante.' },
        { name: 'Copiar o descargar', text: 'Copie UUIDs individuales o descargue todos como archivo de texto para uso masivo.' },
      ],
      pt: [
        { name: 'Abrir gerador UUID', text: 'Navegue até a página do gerador UUID no U2Tool.' },
        { name: 'Selecionar versão UUID', text: 'Escolha a versão UUID que você precisa (v1 baseada em tempo, v4 aleatória - recomendada para a maioria dos usos).' },
        { name: 'Definir quantidade', text: 'Digite a quantidade de UUIDs que deseja gerar (1 a 1000).' },
        { name: 'Clicar em Gerar', text: 'Clique no botão "Gerar" para criar seus UUIDs instantaneamente.' },
        { name: 'Copiar ou baixar', text: 'Copie UUIDs individuais ou baixe todos como arquivo de texto para uso em massa.' },
      ],
      fr: [
        { name: 'Ouvrir le générateur UUID', text: 'Accédez à la page du générateur UUID sur U2Tool.' },
        { name: 'Sélectionner la version UUID', text: 'Choisissez la version UUID dont vous avez besoin (v1 basée sur le temps, v4 aléatoire - recommandée pour la plupart des usages).' },
        { name: 'Définir la quantité', text: 'Entrez le nombre d\'UUIDs que vous souhaitez générer (1 à 1000).' },
        { name: 'Cliquer sur Générer', text: 'Cliquez sur le bouton "Générer" pour créer vos UUIDs instantanément.' },
        { name: 'Copier ou télécharger', text: 'Copiez des UUIDs individuels ou téléchargez-les tous en fichier texte pour une utilisation en masse.' },
      ],
      de: [
        { name: 'UUID-Generator öffnen', text: 'Navigieren Sie zur UUID-Generator-Seite auf U2Tool.' },
        { name: 'UUID-Version auswählen', text: 'Wählen Sie die benötigte UUID-Version (v1 zeitbasiert, v4 zufällig - für die meisten Anwendungen empfohlen).' },
        { name: 'Menge festlegen', text: 'Geben Sie die Anzahl der zu generierenden UUIDs ein (1 bis 1000).' },
        { name: 'Auf Generieren klicken', text: 'Klicken Sie auf "Generieren", um Ihre UUIDs sofort zu erstellen.' },
        { name: 'Kopieren oder herunterladen', text: 'Kopieren Sie einzelne UUIDs oder laden Sie alle als Textdatei für die Massenverwendung herunter.' },
      ],
      ru: [
        { name: 'Открыть генератор UUID', text: 'Перейдите на страницу генератора UUID на U2Tool.' },
        { name: 'Выбрать версию UUID', text: 'Выберите нужную версию UUID (v1 на основе времени, v4 случайная - рекомендуется для большинства случаев).' },
        { name: 'Установить количество', text: 'Введите количество UUID, которое хотите сгенерировать (от 1 до 1000).' },
        { name: 'Нажать Сгенерировать', text: 'Нажмите кнопку "Сгенерировать", чтобы мгновенно создать UUID.' },
        { name: 'Скопировать или скачать', text: 'Скопируйте отдельные UUID или скачайте все в виде текстового файла для массового использования.' },
      ],
      ar: [
        { name: 'فتح مولد UUID', text: 'انتقل إلى صفحة أداة مولد UUID على U2Tool.' },
        { name: 'تحديد إصدار UUID', text: 'اختر إصدار UUID الذي تحتاجه (v1 قائم على الوقت، v4 عشوائي - موصى به لمعظم الاستخدامات).' },
        { name: 'تعيين الكمية', text: 'أدخل عدد UUIDs التي تريد إنشاءها (1 إلى 1000).' },
        { name: 'النقر على توليد', text: 'انقر فوق زر "توليد" لإنشاء UUIDs الخاصة بك على الفور.' },
        { name: 'نسخ أو تنزيل', text: 'انسخ UUIDs فردية أو قم بتنزيل الكل كملف نصي للاستخدام بالجملة.' },
      ],
    },
  },

  // 4. QR Code Generator
  {
    slug: 'qr-generator',
    totalTime: 'PT1M',
    steps: {
      en: [
        { name: 'Open QR Code Generator', text: 'Navigate to the QR Code Generator tool page on U2Tool.' },
        { name: 'Enter your content', text: 'Type or paste the URL, text, or data you want to encode into the input field.' },
        { name: 'Customize appearance', text: 'Adjust QR code size, colors, and error correction level. Higher error correction allows adding logos.' },
        { name: 'Generate QR code', text: 'Click "Generate" to create your QR code. It updates in real-time as you type.' },
        { name: 'Download or share', text: 'Download the QR code as PNG or SVG. Test it with your phone camera before using.' },
      ],
      zh: [
        { name: '打开二维码生成器', text: '在 U2Tool 上导航到二维码生成器工具页面。' },
        { name: '输入内容', text: '在输入框中输入或粘贴要编码的 URL、文本或数据。' },
        { name: '自定义外观', text: '调整二维码大小、颜色和纠错级别。更高的纠错级别允许添加 Logo。' },
        { name: '生成二维码', text: '点击"生成"创建二维码。输入时会实时更新。' },
        { name: '下载或分享', text: '将二维码下载为 PNG 或 SVG。使用前用手机相机测试。' },
      ],
      ja: [
        { name: 'QRコード生成器を開く', text: 'U2ToolのQRコード生成器ツールページに移動します。' },
        { name: 'コンテンツを入力', text: 'エンコードしたいURL、テキスト、またはデータを入力フィールドに入力または貼り付けます。' },
        { name: '外観をカスタマイズ', text: 'QRコードのサイズ、色、エラー訂正レベルを調整します。高いエラー訂正でロゴを追加できます。' },
        { name: 'QRコードを生成', text: '「生成」をクリックしてQRコードを作成します。入力中にリアルタイムで更新されます。' },
        { name: 'ダウンロードまたは共有', text: 'QRコードをPNGまたはSVGとしてダウンロードします。使用前にスマホカメラでテストしてください。' },
      ],
      ko: [
        { name: 'QR 코드 생성기 열기', text: 'U2Tool의 QR 코드 생성기 도구 페이지로 이동합니다.' },
        { name: '콘텐츠 입력', text: '인코딩할 URL, 텍스트 또는 데이터를 입력 필드에 입력하거나 붙여넣습니다.' },
        { name: '외관 사용자 정의', text: 'QR 코드 크기, 색상 및 오류 수정 수준을 조정합니다. 높은 오류 수정으로 로고를 추가할 수 있습니다.' },
        { name: 'QR 코드 생성', text: '"생성"을 클릭하여 QR 코드를 만듭니다. 입력하는 동안 실시간으로 업데이트됩니다.' },
        { name: '다운로드 또는 공유', text: 'QR 코드를 PNG 또는 SVG로 다운로드합니다. 사용하기 전에 휴대폰 카메라로 테스트하세요.' },
      ],
      es: [
        { name: 'Abrir generador de código QR', text: 'Navegue a la página del generador de código QR en U2Tool.' },
        { name: 'Ingresar contenido', text: 'Escriba o pegue la URL, texto o datos que desea codificar en el campo de entrada.' },
        { name: 'Personalizar apariencia', text: 'Ajuste el tamaño, colores y nivel de corrección de errores del código QR.' },
        { name: 'Generar código QR', text: 'Haga clic en "Generar" para crear su código QR. Se actualiza en tiempo real mientras escribe.' },
        { name: 'Descargar o compartir', text: 'Descargue el código QR como PNG o SVG. Pruébelo con la cámara de su teléfono antes de usar.' },
      ],
      pt: [
        { name: 'Abrir gerador de código QR', text: 'Navegue até a página do gerador de código QR no U2Tool.' },
        { name: 'Inserir conteúdo', text: 'Digite ou cole a URL, texto ou dados que deseja codificar no campo de entrada.' },
        { name: 'Personalizar aparência', text: 'Ajuste o tamanho, cores e nível de correção de erros do código QR.' },
        { name: 'Gerar código QR', text: 'Clique em "Gerar" para criar seu código QR. Atualiza em tempo real enquanto você digita.' },
        { name: 'Baixar ou compartilhar', text: 'Baixe o código QR como PNG ou SVG. Teste com a câmera do seu telefone antes de usar.' },
      ],
      fr: [
        { name: 'Ouvrir le générateur de code QR', text: 'Accédez à la page du générateur de code QR sur U2Tool.' },
        { name: 'Entrer le contenu', text: 'Tapez ou collez l\'URL, le texte ou les données que vous souhaitez encoder dans le champ de saisie.' },
        { name: 'Personnaliser l\'apparence', text: 'Ajustez la taille, les couleurs et le niveau de correction d\'erreur du code QR.' },
        { name: 'Générer le code QR', text: 'Cliquez sur "Générer" pour créer votre code QR. Il se met à jour en temps réel pendant la saisie.' },
        { name: 'Télécharger ou partager', text: 'Téléchargez le code QR en PNG ou SVG. Testez-le avec l\'appareil photo de votre téléphone avant utilisation.' },
      ],
      de: [
        { name: 'QR-Code-Generator öffnen', text: 'Navigieren Sie zur QR-Code-Generator-Seite auf U2Tool.' },
        { name: 'Inhalt eingeben', text: 'Geben Sie die URL, den Text oder die Daten, die Sie kodieren möchten, in das Eingabefeld ein.' },
        { name: 'Aussehen anpassen', text: 'Passen Sie Größe, Farben und Fehlerkorrekturstufe des QR-Codes an.' },
        { name: 'QR-Code generieren', text: 'Klicken Sie auf "Generieren", um Ihren QR-Code zu erstellen. Er aktualisiert sich in Echtzeit.' },
        { name: 'Herunterladen oder teilen', text: 'Laden Sie den QR-Code als PNG oder SVG herunter. Testen Sie ihn vor der Verwendung mit Ihrer Handykamera.' },
      ],
      ru: [
        { name: 'Открыть генератор QR-кода', text: 'Перейдите на страницу генератора QR-кода на U2Tool.' },
        { name: 'Ввести содержимое', text: 'Введите или вставьте URL, текст или данные, которые хотите закодировать, в поле ввода.' },
        { name: 'Настроить внешний вид', text: 'Настройте размер, цвета и уровень коррекции ошибок QR-кода.' },
        { name: 'Сгенерировать QR-код', text: 'Нажмите "Сгенерировать", чтобы создать QR-код. Он обновляется в реальном времени при вводе.' },
        { name: 'Скачать или поделиться', text: 'Скачайте QR-код в формате PNG или SVG. Протестируйте его камерой телефона перед использованием.' },
      ],
      ar: [
        { name: 'فتح مولد رمز QR', text: 'انتقل إلى صفحة أداة مولد رمز QR على U2Tool.' },
        { name: 'إدخال المحتوى', text: 'اكتب أو الصق عنوان URL أو النص أو البيانات التي تريد ترميزها في حقل الإدخال.' },
        { name: 'تخصيص المظهر', text: 'اضبط حجم رمز QR والألوان ومستوى تصحيح الأخطاء.' },
        { name: 'توليد رمز QR', text: 'انقر فوق "توليد" لإنشاء رمز QR الخاص بك. يتم تحديثه في الوقت الفعلي أثناء الكتابة.' },
        { name: 'تنزيل أو مشاركة', text: 'قم بتنزيل رمز QR بتنسيق PNG أو SVG. اختبره بكاميرا هاتفك قبل الاستخدام.' },
      ],
    },
  },

  // 5. Password Generator
  {
    slug: 'password-generator',
    totalTime: 'PT30S',
    steps: {
      en: [
        { name: 'Open Password Generator', text: 'Navigate to the Password Generator tool page on U2Tool.' },
        { name: 'Set password length', text: 'Use the slider or input field to set your desired password length (12+ characters recommended).' },
        { name: 'Choose character types', text: 'Select which character types to include: uppercase, lowercase, numbers, and special symbols.' },
        { name: 'Generate password', text: 'Click "Generate" to create a cryptographically secure random password.' },
        { name: 'Copy and save securely', text: 'Click "Copy" to copy the password. Store it in a password manager for safekeeping.' },
      ],
      zh: [
        { name: '打开密码生成器', text: '在 U2Tool 上导航到密码生成器工具页面。' },
        { name: '设置密码长度', text: '使用滑块或输入框设置所需的密码长度（建议 12 个以上字符）。' },
        { name: '选择字符类型', text: '选择要包含的字符类型：大写字母、小写字母、数字和特殊符号。' },
        { name: '生成密码', text: '点击"生成"创建加密安全的随机密码。' },
        { name: '复制并安全保存', text: '点击"复制"复制密码。将其存储在密码管理器中以确保安全。' },
      ],
      ja: [
        { name: 'パスワード生成器を開く', text: 'U2Toolのパスワード生成器ツールページに移動します。' },
        { name: 'パスワード長を設定', text: 'スライダーまたは入力フィールドを使用して、希望のパスワード長を設定します（12文字以上推奨）。' },
        { name: '文字タイプを選択', text: '含める文字タイプを選択：大文字、小文字、数字、特殊記号。' },
        { name: 'パスワードを生成', text: '「生成」をクリックして、暗号学的に安全なランダムパスワードを作成します。' },
        { name: 'コピーして安全に保存', text: '「コピー」をクリックしてパスワードをコピーします。パスワードマネージャーに保存して安全に保管してください。' },
      ],
      ko: [
        { name: '비밀번호 생성기 열기', text: 'U2Tool의 비밀번호 생성기 도구 페이지로 이동합니다.' },
        { name: '비밀번호 길이 설정', text: '슬라이더 또는 입력 필드를 사용하여 원하는 비밀번호 길이를 설정합니다(12자 이상 권장).' },
        { name: '문자 유형 선택', text: '포함할 문자 유형 선택: 대문자, 소문자, 숫자, 특수 기호.' },
        { name: '비밀번호 생성', text: '"생성"을 클릭하여 암호학적으로 안전한 무작위 비밀번호를 만듭니다.' },
        { name: '복사하고 안전하게 저장', text: '"복사"를 클릭하여 비밀번호를 복사합니다. 비밀번호 관리자에 저장하여 안전하게 보관하세요.' },
      ],
      es: [
        { name: 'Abrir generador de contraseñas', text: 'Navegue a la página del generador de contraseñas en U2Tool.' },
        { name: 'Establecer longitud de contraseña', text: 'Use el control deslizante para establecer la longitud deseada (se recomiendan 12+ caracteres).' },
        { name: 'Elegir tipos de caracteres', text: 'Seleccione qué tipos de caracteres incluir: mayúsculas, minúsculas, números y símbolos especiales.' },
        { name: 'Generar contraseña', text: 'Haga clic en "Generar" para crear una contraseña aleatoria criptográficamente segura.' },
        { name: 'Copiar y guardar de forma segura', text: 'Haga clic en "Copiar" para copiar la contraseña. Guárdela en un administrador de contraseñas.' },
      ],
      pt: [
        { name: 'Abrir gerador de senhas', text: 'Navegue até a página do gerador de senhas no U2Tool.' },
        { name: 'Definir comprimento da senha', text: 'Use o controle deslizante para definir o comprimento desejado (12+ caracteres recomendados).' },
        { name: 'Escolher tipos de caracteres', text: 'Selecione quais tipos de caracteres incluir: maiúsculas, minúsculas, números e símbolos especiais.' },
        { name: 'Gerar senha', text: 'Clique em "Gerar" para criar uma senha aleatória criptograficamente segura.' },
        { name: 'Copiar e salvar com segurança', text: 'Clique em "Copiar" para copiar a senha. Armazene-a em um gerenciador de senhas.' },
      ],
      fr: [
        { name: 'Ouvrir le générateur de mots de passe', text: 'Accédez à la page du générateur de mots de passe sur U2Tool.' },
        { name: 'Définir la longueur du mot de passe', text: 'Utilisez le curseur pour définir la longueur souhaitée (12+ caractères recommandés).' },
        { name: 'Choisir les types de caractères', text: 'Sélectionnez les types de caractères à inclure : majuscules, minuscules, chiffres et symboles spéciaux.' },
        { name: 'Générer le mot de passe', text: 'Cliquez sur "Générer" pour créer un mot de passe aléatoire cryptographiquement sécurisé.' },
        { name: 'Copier et sauvegarder en sécurité', text: 'Cliquez sur "Copier" pour copier le mot de passe. Stockez-le dans un gestionnaire de mots de passe.' },
      ],
      de: [
        { name: 'Passwort-Generator öffnen', text: 'Navigieren Sie zur Passwort-Generator-Seite auf U2Tool.' },
        { name: 'Passwortlänge festlegen', text: 'Verwenden Sie den Schieberegler, um die gewünschte Länge festzulegen (12+ Zeichen empfohlen).' },
        { name: 'Zeichentypen wählen', text: 'Wählen Sie die einzuschließenden Zeichentypen: Großbuchstaben, Kleinbuchstaben, Zahlen und Sonderzeichen.' },
        { name: 'Passwort generieren', text: 'Klicken Sie auf "Generieren", um ein kryptografisch sicheres Zufallspasswort zu erstellen.' },
        { name: 'Kopieren und sicher speichern', text: 'Klicken Sie auf "Kopieren", um das Passwort zu kopieren. Speichern Sie es in einem Passwort-Manager.' },
      ],
      ru: [
        { name: 'Открыть генератор паролей', text: 'Перейдите на страницу генератора паролей на U2Tool.' },
        { name: 'Установить длину пароля', text: 'Используйте ползунок для установки желаемой длины (рекомендуется 12+ символов).' },
        { name: 'Выбрать типы символов', text: 'Выберите типы символов для включения: заглавные, строчные, цифры и специальные символы.' },
        { name: 'Сгенерировать пароль', text: 'Нажмите "Сгенерировать", чтобы создать криптографически безопасный случайный пароль.' },
        { name: 'Скопировать и сохранить безопасно', text: 'Нажмите "Копировать", чтобы скопировать пароль. Сохраните его в менеджере паролей.' },
      ],
      ar: [
        { name: 'فتح مولد كلمات المرور', text: 'انتقل إلى صفحة أداة مولد كلمات المرور على U2Tool.' },
        { name: 'تعيين طول كلمة المرور', text: 'استخدم شريط التمرير لتعيين الطول المطلوب (يوصى بـ 12+ حرفًا).' },
        { name: 'اختيار أنواع الأحرف', text: 'حدد أنواع الأحرف المراد تضمينها: أحرف كبيرة وصغيرة وأرقام ورموز خاصة.' },
        { name: 'توليد كلمة المرور', text: 'انقر فوق "توليد" لإنشاء كلمة مرور عشوائية آمنة تشفيريًا.' },
        { name: 'نسخ وحفظ بأمان', text: 'انقر فوق "نسخ" لنسخ كلمة المرور. قم بتخزينها في مدير كلمات المرور للحفاظ عليها.' },
      ],
    },
  },

  // 6. Hash Generator
  {
    slug: 'hash-generator',
    totalTime: 'PT30S',
    steps: {
      en: [
        { name: 'Open Hash Generator', text: 'Navigate to the Hash Generator tool page on U2Tool.' },
        { name: 'Enter text to hash', text: 'Type or paste the text you want to hash into the input field.' },
        { name: 'Select hash algorithm', text: 'Choose your hash algorithm: MD5, SHA-1, SHA-256, SHA-512, or others.' },
        { name: 'Generate hash', text: 'The hash is generated automatically as you type, or click "Generate" to compute.' },
        { name: 'Copy the hash value', text: 'Click "Copy" to copy the hash value. Use it for verification or storage.' },
      ],
      zh: [
        { name: '打开哈希生成器', text: '在 U2Tool 上导航到哈希生成器工具页面。' },
        { name: '输入要哈希的文本', text: '在输入框中输入或粘贴要哈希的文本。' },
        { name: '选择哈希算法', text: '选择哈希算法：MD5、SHA-1、SHA-256、SHA-512 或其他。' },
        { name: '生成哈希', text: '输入时自动生成哈希，或点击"生成"进行计算。' },
        { name: '复制哈希值', text: '点击"复制"复制哈希值。用于验证或存储。' },
      ],
      ja: [
        { name: 'ハッシュ生成器を開く', text: 'U2Toolのハッシュ生成器ツールページに移動します。' },
        { name: 'ハッシュするテキストを入力', text: 'ハッシュしたいテキストを入力フィールドに入力または貼り付けます。' },
        { name: 'ハッシュアルゴリズムを選択', text: 'ハッシュアルゴリズムを選択：MD5、SHA-1、SHA-256、SHA-512など。' },
        { name: 'ハッシュを生成', text: '入力中に自動的にハッシュが生成されるか、「生成」をクリックして計算します。' },
        { name: 'ハッシュ値をコピー', text: '「コピー」をクリックしてハッシュ値をコピーします。検証や保存に使用します。' },
      ],
      ko: [
        { name: '해시 생성기 열기', text: 'U2Tool의 해시 생성기 도구 페이지로 이동합니다.' },
        { name: '해시할 텍스트 입력', text: '해시할 텍스트를 입력 필드에 입력하거나 붙여넣습니다.' },
        { name: '해시 알고리즘 선택', text: '해시 알고리즘 선택: MD5, SHA-1, SHA-256, SHA-512 등.' },
        { name: '해시 생성', text: '입력하는 동안 자동으로 해시가 생성되거나 "생성"을 클릭하여 계산합니다.' },
        { name: '해시 값 복사', text: '"복사"를 클릭하여 해시 값을 복사합니다. 검증이나 저장에 사용합니다.' },
      ],
      es: [
        { name: 'Abrir generador de hash', text: 'Navegue a la página del generador de hash en U2Tool.' },
        { name: 'Ingresar texto para hash', text: 'Escriba o pegue el texto que desea hashear en el campo de entrada.' },
        { name: 'Seleccionar algoritmo hash', text: 'Elija su algoritmo hash: MD5, SHA-1, SHA-256, SHA-512 u otros.' },
        { name: 'Generar hash', text: 'El hash se genera automáticamente mientras escribe, o haga clic en "Generar".' },
        { name: 'Copiar el valor hash', text: 'Haga clic en "Copiar" para copiar el valor hash. Úselo para verificación o almacenamiento.' },
      ],
      pt: [
        { name: 'Abrir gerador de hash', text: 'Navegue até a página do gerador de hash no U2Tool.' },
        { name: 'Inserir texto para hash', text: 'Digite ou cole o texto que deseja hashear no campo de entrada.' },
        { name: 'Selecionar algoritmo hash', text: 'Escolha seu algoritmo hash: MD5, SHA-1, SHA-256, SHA-512 ou outros.' },
        { name: 'Gerar hash', text: 'O hash é gerado automaticamente enquanto você digita, ou clique em "Gerar".' },
        { name: 'Copiar o valor hash', text: 'Clique em "Copiar" para copiar o valor hash. Use para verificação ou armazenamento.' },
      ],
      fr: [
        { name: 'Ouvrir le générateur de hash', text: 'Accédez à la page du générateur de hash sur U2Tool.' },
        { name: 'Entrer le texte à hasher', text: 'Tapez ou collez le texte que vous souhaitez hasher dans le champ de saisie.' },
        { name: 'Sélectionner l\'algorithme hash', text: 'Choisissez votre algorithme hash : MD5, SHA-1, SHA-256, SHA-512 ou autres.' },
        { name: 'Générer le hash', text: 'Le hash est généré automatiquement pendant la saisie, ou cliquez sur "Générer".' },
        { name: 'Copier la valeur hash', text: 'Cliquez sur "Copier" pour copier la valeur hash. Utilisez-la pour la vérification ou le stockage.' },
      ],
      de: [
        { name: 'Hash-Generator öffnen', text: 'Navigieren Sie zur Hash-Generator-Seite auf U2Tool.' },
        { name: 'Text zum Hashen eingeben', text: 'Geben Sie den Text, den Sie hashen möchten, in das Eingabefeld ein.' },
        { name: 'Hash-Algorithmus auswählen', text: 'Wählen Sie Ihren Hash-Algorithmus: MD5, SHA-1, SHA-256, SHA-512 oder andere.' },
        { name: 'Hash generieren', text: 'Der Hash wird automatisch während der Eingabe generiert, oder klicken Sie auf "Generieren".' },
        { name: 'Hash-Wert kopieren', text: 'Klicken Sie auf "Kopieren", um den Hash-Wert zu kopieren. Verwenden Sie ihn zur Verifizierung oder Speicherung.' },
      ],
      ru: [
        { name: 'Открыть генератор хэша', text: 'Перейдите на страницу генератора хэша на U2Tool.' },
        { name: 'Ввести текст для хэширования', text: 'Введите или вставьте текст, который хотите хэшировать, в поле ввода.' },
        { name: 'Выбрать алгоритм хэширования', text: 'Выберите алгоритм хэширования: MD5, SHA-1, SHA-256, SHA-512 или другие.' },
        { name: 'Сгенерировать хэш', text: 'Хэш генерируется автоматически при вводе или нажмите "Сгенерировать".' },
        { name: 'Скопировать значение хэша', text: 'Нажмите "Копировать", чтобы скопировать значение хэша. Используйте для проверки или хранения.' },
      ],
      ar: [
        { name: 'فتح مولد التجزئة', text: 'انتقل إلى صفحة أداة مولد التجزئة على U2Tool.' },
        { name: 'إدخال النص للتجزئة', text: 'اكتب أو الصق النص الذي تريد تجزئته في حقل الإدخال.' },
        { name: 'تحديد خوارزمية التجزئة', text: 'اختر خوارزمية التجزئة: MD5 أو SHA-1 أو SHA-256 أو SHA-512 أو غيرها.' },
        { name: 'توليد التجزئة', text: 'يتم إنشاء التجزئة تلقائيًا أثناء الكتابة، أو انقر فوق "توليد".' },
        { name: 'نسخ قيمة التجزئة', text: 'انقر فوق "نسخ" لنسخ قيمة التجزئة. استخدمها للتحقق أو التخزين.' },
      ],
    },
  },

  // 7. Regex Tester
  {
    slug: 'regex-tester',
    totalTime: 'PT2M',
    steps: {
      en: [
        { name: 'Open Regex Tester', text: 'Navigate to the Regex Tester tool page on U2Tool.' },
        { name: 'Enter your regex pattern', text: 'Type your regular expression pattern in the pattern input field.' },
        { name: 'Add test string', text: 'Enter the text you want to test against in the test string area.' },
        { name: 'Set regex flags', text: 'Select flags like g (global), i (case-insensitive), m (multiline) as needed.' },
        { name: 'View matches', text: 'Matches are highlighted in real-time. View capture groups and match details below.' },
      ],
      zh: [
        { name: '打开正则表达式测试器', text: '在 U2Tool 上导航到正则表达式测试器工具页面。' },
        { name: '输入正则表达式模式', text: '在模式输入框中输入您的正则表达式模式。' },
        { name: '添加测试字符串', text: '在测试字符串区域输入要测试的文本。' },
        { name: '设置正则表达式标志', text: '根据需要选择标志，如 g（全局）、i（不区分大小写）、m（多行）。' },
        { name: '查看匹配结果', text: '匹配项实时高亮显示。在下方查看捕获组和匹配详情。' },
      ],
      ja: [
        { name: '正規表現テスターを開く', text: 'U2Toolの正規表現テスターツールページに移動します。' },
        { name: '正規表現パターンを入力', text: 'パターン入力フィールドに正規表現パターンを入力します。' },
        { name: 'テスト文字列を追加', text: 'テスト文字列エリアにテストしたいテキストを入力します。' },
        { name: '正規表現フラグを設定', text: '必要に応じてg（グローバル）、i（大文字小文字を区別しない）、m（複数行）などのフラグを選択します。' },
        { name: 'マッチを確認', text: 'マッチはリアルタイムでハイライト表示されます。下部でキャプチャグループとマッチの詳細を確認します。' },
      ],
      ko: [
        { name: '정규식 테스터 열기', text: 'U2Tool의 정규식 테스터 도구 페이지로 이동합니다.' },
        { name: '정규식 패턴 입력', text: '패턴 입력 필드에 정규식 패턴을 입력합니다.' },
        { name: '테스트 문자열 추가', text: '테스트 문자열 영역에 테스트할 텍스트를 입력합니다.' },
        { name: '정규식 플래그 설정', text: '필요에 따라 g(전역), i(대소문자 구분 안 함), m(다중 행) 등의 플래그를 선택합니다.' },
        { name: '일치 항목 보기', text: '일치 항목이 실시간으로 강조 표시됩니다. 아래에서 캡처 그룹과 일치 세부 정보를 확인합니다.' },
      ],
      es: [
        { name: 'Abrir probador de regex', text: 'Navegue a la página del probador de regex en U2Tool.' },
        { name: 'Ingresar patrón regex', text: 'Escriba su patrón de expresión regular en el campo de entrada de patrón.' },
        { name: 'Agregar cadena de prueba', text: 'Ingrese el texto que desea probar en el área de cadena de prueba.' },
        { name: 'Establecer banderas regex', text: 'Seleccione banderas como g (global), i (insensible a mayúsculas), m (multilínea) según sea necesario.' },
        { name: 'Ver coincidencias', text: 'Las coincidencias se resaltan en tiempo real. Vea los grupos de captura y detalles de coincidencia abajo.' },
      ],
      pt: [
        { name: 'Abrir testador de regex', text: 'Navegue até a página do testador de regex no U2Tool.' },
        { name: 'Inserir padrão regex', text: 'Digite seu padrão de expressão regular no campo de entrada de padrão.' },
        { name: 'Adicionar string de teste', text: 'Digite o texto que deseja testar na área de string de teste.' },
        { name: 'Definir flags regex', text: 'Selecione flags como g (global), i (case-insensitive), m (multiline) conforme necessário.' },
        { name: 'Ver correspondências', text: 'As correspondências são destacadas em tempo real. Veja grupos de captura e detalhes de correspondência abaixo.' },
      ],
      fr: [
        { name: 'Ouvrir le testeur regex', text: 'Accédez à la page du testeur regex sur U2Tool.' },
        { name: 'Entrer le motif regex', text: 'Tapez votre motif d\'expression régulière dans le champ de saisie du motif.' },
        { name: 'Ajouter la chaîne de test', text: 'Entrez le texte que vous souhaitez tester dans la zone de chaîne de test.' },
        { name: 'Définir les drapeaux regex', text: 'Sélectionnez les drapeaux comme g (global), i (insensible à la casse), m (multiligne) selon les besoins.' },
        { name: 'Voir les correspondances', text: 'Les correspondances sont mises en évidence en temps réel. Consultez les groupes de capture et les détails ci-dessous.' },
      ],
      de: [
        { name: 'Regex-Tester öffnen', text: 'Navigieren Sie zur Regex-Tester-Seite auf U2Tool.' },
        { name: 'Regex-Muster eingeben', text: 'Geben Sie Ihr reguläres Ausdrucksmuster in das Mustereingabefeld ein.' },
        { name: 'Teststring hinzufügen', text: 'Geben Sie den Text, den Sie testen möchten, im Teststring-Bereich ein.' },
        { name: 'Regex-Flags setzen', text: 'Wählen Sie Flags wie g (global), i (Groß-/Kleinschreibung ignorieren), m (mehrzeilig) nach Bedarf.' },
        { name: 'Übereinstimmungen anzeigen', text: 'Übereinstimmungen werden in Echtzeit hervorgehoben. Sehen Sie Erfassungsgruppen und Details unten.' },
      ],
      ru: [
        { name: 'Открыть тестер regex', text: 'Перейдите на страницу тестера regex на U2Tool.' },
        { name: 'Ввести шаблон regex', text: 'Введите шаблон регулярного выражения в поле ввода шаблона.' },
        { name: 'Добавить тестовую строку', text: 'Введите текст, который хотите протестировать, в область тестовой строки.' },
        { name: 'Установить флаги regex', text: 'Выберите флаги, такие как g (глобальный), i (без учета регистра), m (многострочный) по необходимости.' },
        { name: 'Просмотреть совпадения', text: 'Совпадения выделяются в реальном времени. Просмотрите группы захвата и детали совпадений ниже.' },
      ],
      ar: [
        { name: 'فتح اختبار regex', text: 'انتقل إلى صفحة أداة اختبار regex على U2Tool.' },
        { name: 'إدخال نمط regex', text: 'اكتب نمط التعبير العادي في حقل إدخال النمط.' },
        { name: 'إضافة سلسلة اختبار', text: 'أدخل النص الذي تريد اختباره في منطقة سلسلة الاختبار.' },
        { name: 'تعيين علامات regex', text: 'حدد العلامات مثل g (عام) و i (غير حساس لحالة الأحرف) و m (متعدد الأسطر) حسب الحاجة.' },
        { name: 'عرض التطابقات', text: 'يتم تمييز التطابقات في الوقت الفعلي. اعرض مجموعات الالتقاط وتفاصيل التطابق أدناه.' },
      ],
    },
  },
];

/**
 * 获取工具特定的 HowTo 步骤
 * @param slug - 工具 slug
 * @param locale - 语言代码
 * @returns HowTo 步骤数组，如果没有特定步骤则返回 null
 */
export function getToolSpecificHowTo(
  slug: string,
  locale: string
): { steps: HowToStep[]; totalTime: string } | null {
  const config = TOOL_SPECIFIC_HOWTO.find(t => t.slug === slug);
  if (!config) return null;
  
  // 优先返回指定语言的步骤
  const steps = config.steps[locale] || config.steps['en'];
  if (!steps) return null;
  
  return {
    steps,
    totalTime: config.totalTime,
  };
}

/**
 * 检查工具是否有特定的 HowTo 步骤
 * @param slug - 工具 slug
 * @returns 是否有特定 HowTo 步骤
 */
export function hasToolSpecificHowTo(slug: string): boolean {
  return TOOL_SPECIFIC_HOWTO.some(t => t.slug === slug);
}

/**
 * 获取所有有特定 HowTo 步骤的工具 slug 列表
 * @returns 工具 slug 数组
 */
export function getToolsWithSpecificHowTo(): string[] {
  return TOOL_SPECIFIC_HOWTO.map(t => t.slug);
}
