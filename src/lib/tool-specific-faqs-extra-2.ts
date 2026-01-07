/**
 * 额外热门工具专属 FAQ 配置 - 第二批
 * 为 regex-tester, diff-checker, html-encoder, code-minifier, word-counter 等提供 FAQ
 */

import type { ToolSpecificFAQ } from './tool-specific-faqs';

// 额外 10 个热门工具的 FAQ 配置
export const EXTRA_TOOL_FAQS_2: ToolSpecificFAQ[] = [
  // 11. Regex Tester
  {
    slug: 'regex-tester',
    faqs: {
      en: [
        {
          question: 'How do I test a regular expression online?',
          answer: 'Enter your regex pattern in the pattern field and your test string in the text area. The tool will instantly highlight all matches and show capture groups.',
        },
        {
          question: 'What regex flags are supported?',
          answer: 'We support all standard JavaScript regex flags: g (global), i (case-insensitive), m (multiline), s (dotAll), u (unicode), and y (sticky).',
        },
        {
          question: 'How do I see capture groups in my regex?',
          answer: 'Use parentheses () to create capture groups. The tool displays all captured groups for each match, including named groups using (?<name>pattern) syntax.',
        },
        {
          question: 'Can I test regex for different programming languages?',
          answer: 'This tool uses JavaScript regex engine. While most patterns work across languages, some features may differ. Check language-specific documentation for edge cases.',
        },
        {
          question: 'How do I escape special characters in regex?',
          answer: 'Use backslash (\\) to escape special characters like . * + ? ^ $ { } [ ] ( ) | \\. For example, \\. matches a literal dot instead of any character.',
        },
      ],
      zh: [
        {
          question: '如何在线测试正则表达式？',
          answer: '在模式字段中输入正则表达式，在文本区域输入测试字符串。工具会立即高亮显示所有匹配项并显示捕获组。',
        },
        {
          question: '支持哪些正则表达式标志？',
          answer: '我们支持所有标准 JavaScript 正则表达式标志：g（全局）、i（不区分大小写）、m（多行）、s（dotAll）、u（unicode）和 y（粘性）。',
        },
        {
          question: '如何查看正则表达式中的捕获组？',
          answer: '使用括号 () 创建捕获组。工具会显示每个匹配的所有捕获组，包括使用 (?<name>pattern) 语法的命名组。',
        },
        {
          question: '可以测试不同编程语言的正则表达式吗？',
          answer: '此工具使用 JavaScript 正则表达式引擎。虽然大多数模式在各语言中通用，但某些功能可能有所不同。请查阅特定语言的文档了解边缘情况。',
        },
        {
          question: '如何在正则表达式中转义特殊字符？',
          answer: '使用反斜杠 (\\) 转义特殊字符，如 . * + ? ^ $ { } [ ] ( ) | \\。例如，\\. 匹配字面点而不是任意字符。',
        },
      ],
      es: [
        {
          question: '¿Cómo pruebo una expresión regular en línea?',
          answer: 'Ingrese su patrón regex en el campo de patrón y su cadena de prueba en el área de texto. La herramienta resaltará instantáneamente todas las coincidencias.',
        },
        {
          question: '¿Qué banderas de regex son compatibles?',
          answer: 'Soportamos todas las banderas estándar de JavaScript: g (global), i (insensible a mayúsculas), m (multilínea), s (dotAll), u (unicode) y y (sticky).',
        },
        {
          question: '¿Cómo veo los grupos de captura en mi regex?',
          answer: 'Use paréntesis () para crear grupos de captura. La herramienta muestra todos los grupos capturados para cada coincidencia.',
        },
        {
          question: '¿Puedo probar regex para diferentes lenguajes de programación?',
          answer: 'Esta herramienta usa el motor regex de JavaScript. Aunque la mayoría de los patrones funcionan en todos los lenguajes, algunas características pueden diferir.',
        },
        {
          question: '¿Cómo escapo caracteres especiales en regex?',
          answer: 'Use barra invertida (\\) para escapar caracteres especiales como . * + ? ^ $ { } [ ] ( ) | \\.',
        },
      ],
      pt: [
        {
          question: 'Como testo uma expressão regular online?',
          answer: 'Digite seu padrão regex no campo de padrão e sua string de teste na área de texto. A ferramenta destacará instantaneamente todas as correspondências.',
        },
        {
          question: 'Quais flags de regex são suportadas?',
          answer: 'Suportamos todas as flags padrão do JavaScript: g (global), i (case-insensitive), m (multiline), s (dotAll), u (unicode) e y (sticky).',
        },
        {
          question: 'Como vejo os grupos de captura no meu regex?',
          answer: 'Use parênteses () para criar grupos de captura. A ferramenta exibe todos os grupos capturados para cada correspondência.',
        },
        {
          question: 'Posso testar regex para diferentes linguagens de programação?',
          answer: 'Esta ferramenta usa o motor regex do JavaScript. Embora a maioria dos padrões funcione em todas as linguagens, alguns recursos podem diferir.',
        },
        {
          question: 'Como escapo caracteres especiais em regex?',
          answer: 'Use barra invertida (\\) para escapar caracteres especiais como . * + ? ^ $ { } [ ] ( ) | \\.',
        },
      ],
      ja: [
        {
          question: '正規表現をオンラインでテストするには？',
          answer: 'パターンフィールドに正規表現パターンを入力し、テキストエリアにテスト文字列を入力します。ツールは即座にすべてのマッチをハイライト表示します。',
        },
        {
          question: 'どの正規表現フラグがサポートされていますか？',
          answer: '標準のJavaScript正規表現フラグをすべてサポート：g（グローバル）、i（大文字小文字を区別しない）、m（複数行）、s（dotAll）、u（unicode）、y（sticky）。',
        },
        {
          question: '正規表現のキャプチャグループを確認するには？',
          answer: '括弧 () を使用してキャプチャグループを作成します。ツールは各マッチのすべてのキャプチャグループを表示します。',
        },
        {
          question: '異なるプログラミング言語の正規表現をテストできますか？',
          answer: 'このツールはJavaScript正規表現エンジンを使用します。ほとんどのパターンは言語間で動作しますが、一部の機能は異なる場合があります。',
        },
        {
          question: '正規表現で特殊文字をエスケープするには？',
          answer: 'バックスラッシュ (\\) を使用して . * + ? ^ $ { } [ ] ( ) | \\ などの特殊文字をエスケープします。',
        },
      ],
      ru: [
        {
          question: 'Как протестировать регулярное выражение онлайн?',
          answer: 'Введите шаблон regex в поле шаблона и тестовую строку в текстовую область. Инструмент мгновенно выделит все совпадения.',
        },
        {
          question: 'Какие флаги regex поддерживаются?',
          answer: 'Мы поддерживаем все стандартные флаги JavaScript: g (глобальный), i (без учета регистра), m (многострочный), s (dotAll), u (unicode) и y (sticky).',
        },
        {
          question: 'Как увидеть группы захвата в regex?',
          answer: 'Используйте скобки () для создания групп захвата. Инструмент отображает все захваченные группы для каждого совпадения.',
        },
        {
          question: 'Могу ли я тестировать regex для разных языков программирования?',
          answer: 'Этот инструмент использует движок regex JavaScript. Хотя большинство шаблонов работают во всех языках, некоторые функции могут отличаться.',
        },
        {
          question: 'Как экранировать специальные символы в regex?',
          answer: 'Используйте обратную косую черту (\\) для экранирования специальных символов, таких как . * + ? ^ $ { } [ ] ( ) | \\.',
        },
      ],
      fr: [
        {
          question: 'Comment tester une expression régulière en ligne ?',
          answer: 'Entrez votre motif regex dans le champ de motif et votre chaîne de test dans la zone de texte. L\'outil mettra instantanément en évidence toutes les correspondances.',
        },
        {
          question: 'Quels drapeaux regex sont pris en charge ?',
          answer: 'Nous prenons en charge tous les drapeaux JavaScript standard : g (global), i (insensible à la casse), m (multiligne), s (dotAll), u (unicode) et y (sticky).',
        },
        {
          question: 'Comment voir les groupes de capture dans mon regex ?',
          answer: 'Utilisez des parenthèses () pour créer des groupes de capture. L\'outil affiche tous les groupes capturés pour chaque correspondance.',
        },
        {
          question: 'Puis-je tester des regex pour différents langages de programmation ?',
          answer: 'Cet outil utilise le moteur regex JavaScript. Bien que la plupart des motifs fonctionnent dans tous les langages, certaines fonctionnalités peuvent différer.',
        },
        {
          question: 'Comment échapper les caractères spéciaux dans regex ?',
          answer: 'Utilisez la barre oblique inverse (\\) pour échapper les caractères spéciaux comme . * + ? ^ $ { } [ ] ( ) | \\.',
        },
      ],
      de: [
        {
          question: 'Wie teste ich einen regulären Ausdruck online?',
          answer: 'Geben Sie Ihr Regex-Muster in das Musterfeld und Ihre Testzeichenfolge in den Textbereich ein. Das Tool hebt sofort alle Übereinstimmungen hervor.',
        },
        {
          question: 'Welche Regex-Flags werden unterstützt?',
          answer: 'Wir unterstützen alle Standard-JavaScript-Flags: g (global), i (Groß-/Kleinschreibung ignorieren), m (mehrzeilig), s (dotAll), u (unicode) und y (sticky).',
        },
        {
          question: 'Wie sehe ich Erfassungsgruppen in meinem Regex?',
          answer: 'Verwenden Sie Klammern () um Erfassungsgruppen zu erstellen. Das Tool zeigt alle erfassten Gruppen für jede Übereinstimmung an.',
        },
        {
          question: 'Kann ich Regex für verschiedene Programmiersprachen testen?',
          answer: 'Dieses Tool verwendet die JavaScript-Regex-Engine. Obwohl die meisten Muster sprachübergreifend funktionieren, können einige Funktionen abweichen.',
        },
        {
          question: 'Wie escape ich Sonderzeichen in Regex?',
          answer: 'Verwenden Sie den Backslash (\\) um Sonderzeichen wie . * + ? ^ $ { } [ ] ( ) | \\ zu escapen.',
        },
      ],
      ko: [
        {
          question: '정규 표현식을 온라인에서 테스트하려면?',
          answer: '패턴 필드에 정규식 패턴을 입력하고 텍스트 영역에 테스트 문자열을 입력하세요. 도구가 즉시 모든 일치 항목을 강조 표시합니다.',
        },
        {
          question: '어떤 정규식 플래그가 지원되나요?',
          answer: '모든 표준 JavaScript 정규식 플래그를 지원합니다: g(전역), i(대소문자 구분 안 함), m(다중 행), s(dotAll), u(유니코드), y(sticky).',
        },
        {
          question: '정규식에서 캡처 그룹을 확인하려면?',
          answer: '괄호 ()를 사용하여 캡처 그룹을 만드세요. 도구는 각 일치에 대해 캡처된 모든 그룹을 표시합니다.',
        },
        {
          question: '다른 프로그래밍 언어의 정규식을 테스트할 수 있나요?',
          answer: '이 도구는 JavaScript 정규식 엔진을 사용합니다. 대부분의 패턴은 언어 간에 작동하지만 일부 기능은 다를 수 있습니다.',
        },
        {
          question: '정규식에서 특수 문자를 이스케이프하려면?',
          answer: '백슬래시 (\\)를 사용하여 . * + ? ^ $ { } [ ] ( ) | \\ 같은 특수 문자를 이스케이프하세요.',
        },
      ],
      ar: [
        {
          question: 'كيف أختبر تعبيرًا عاديًا عبر الإنترنت؟',
          answer: 'أدخل نمط regex في حقل النمط وسلسلة الاختبار في منطقة النص. ستقوم الأداة بتمييز جميع التطابقات على الفور.',
        },
        {
          question: 'ما هي علامات regex المدعومة؟',
          answer: 'ندعم جميع علامات JavaScript القياسية: g (عام)، i (غير حساس لحالة الأحرف)، m (متعدد الأسطر)، s (dotAll)، u (يونيكود)، و y (sticky).',
        },
        {
          question: 'كيف أرى مجموعات الالتقاط في regex؟',
          answer: 'استخدم الأقواس () لإنشاء مجموعات الالتقاط. تعرض الأداة جميع المجموعات الملتقطة لكل تطابق.',
        },
        {
          question: 'هل يمكنني اختبار regex للغات برمجة مختلفة؟',
          answer: 'تستخدم هذه الأداة محرك regex JavaScript. بينما تعمل معظم الأنماط عبر اللغات، قد تختلف بعض الميزات.',
        },
        {
          question: 'كيف أهرب الأحرف الخاصة في regex؟',
          answer: 'استخدم الشرطة المائلة العكسية (\\) لتهريب الأحرف الخاصة مثل . * + ? ^ $ { } [ ] ( ) | \\.',
        },
      ],
    },
  },

  // 12. Diff Checker
  {
    slug: 'diff-checker',
    faqs: {
      en: [
        {
          question: 'How do I compare two texts online?',
          answer: 'Paste your original text in the left panel and the modified text in the right panel. Click Compare to see differences highlighted with additions in green and deletions in red.',
        },
        {
          question: 'What types of differences can this tool detect?',
          answer: 'The tool detects additions, deletions, and modifications at both line and character level. It shows inline differences and side-by-side comparison views.',
        },
        {
          question: 'Can I compare code files with syntax highlighting?',
          answer: 'Yes, the diff checker supports syntax highlighting for many programming languages. Select your language from the dropdown for better readability.',
        },
        {
          question: 'How do I ignore whitespace differences?',
          answer: 'Enable the "Ignore whitespace" option to focus on meaningful content changes. This is useful when comparing code with different formatting styles.',
        },
        {
          question: 'Can I download or share the diff results?',
          answer: 'Yes, you can copy the diff output or download it as a unified diff file. The results can be shared via URL or exported for documentation.',
        },
      ],
      zh: [
        {
          question: '如何在线比较两段文本？',
          answer: '将原始文本粘贴到左侧面板，将修改后的文本粘贴到右侧面板。点击比较，差异将以绿色显示添加内容，红色显示删除内容。',
        },
        {
          question: '此工具可以检测哪些类型的差异？',
          answer: '工具可以在行级和字符级检测添加、删除和修改。它显示内联差异和并排比较视图。',
        },
        {
          question: '可以比较带语法高亮的代码文件吗？',
          answer: '是的，差异检查器支持多种编程语言的语法高亮。从下拉菜单中选择您的语言以获得更好的可读性。',
        },
        {
          question: '如何忽略空白差异？',
          answer: '启用"忽略空白"选项以专注于有意义的内容更改。这在比较具有不同格式样式的代码时很有用。',
        },
        {
          question: '可以下载或分享差异结果吗？',
          answer: '是的，您可以复制差异输出或将其下载为统一差异文件。结果可以通过 URL 分享或导出用于文档。',
        },
      ],
      es: [
        {
          question: '¿Cómo comparo dos textos en línea?',
          answer: 'Pegue su texto original en el panel izquierdo y el texto modificado en el panel derecho. Haga clic en Comparar para ver las diferencias resaltadas.',
        },
        {
          question: '¿Qué tipos de diferencias puede detectar esta herramienta?',
          answer: 'La herramienta detecta adiciones, eliminaciones y modificaciones a nivel de línea y carácter. Muestra diferencias en línea y vistas de comparación lado a lado.',
        },
        {
          question: '¿Puedo comparar archivos de código con resaltado de sintaxis?',
          answer: 'Sí, el verificador de diferencias admite resaltado de sintaxis para muchos lenguajes de programación.',
        },
        {
          question: '¿Cómo ignoro las diferencias de espacios en blanco?',
          answer: 'Active la opción "Ignorar espacios en blanco" para centrarse en los cambios de contenido significativos.',
        },
        {
          question: '¿Puedo descargar o compartir los resultados de diferencias?',
          answer: 'Sí, puede copiar la salida de diferencias o descargarla como un archivo diff unificado.',
        },
      ],
      pt: [
        {
          question: 'Como comparo dois textos online?',
          answer: 'Cole seu texto original no painel esquerdo e o texto modificado no painel direito. Clique em Comparar para ver as diferenças destacadas.',
        },
        {
          question: 'Que tipos de diferenças esta ferramenta pode detectar?',
          answer: 'A ferramenta detecta adições, exclusões e modificações em nível de linha e caractere. Mostra diferenças inline e visualizações de comparação lado a lado.',
        },
        {
          question: 'Posso comparar arquivos de código com destaque de sintaxe?',
          answer: 'Sim, o verificador de diferenças suporta destaque de sintaxe para muitas linguagens de programação.',
        },
        {
          question: 'Como ignoro diferenças de espaços em branco?',
          answer: 'Ative a opção "Ignorar espaços em branco" para focar em mudanças de conteúdo significativas.',
        },
        {
          question: 'Posso baixar ou compartilhar os resultados de diferenças?',
          answer: 'Sim, você pode copiar a saída de diferenças ou baixá-la como um arquivo diff unificado.',
        },
      ],
      ja: [
        {
          question: '2つのテキストをオンラインで比較するには？',
          answer: '左パネルに元のテキストを、右パネルに変更後のテキストを貼り付けます。比較をクリックすると、追加は緑、削除は赤でハイライト表示されます。',
        },
        {
          question: 'このツールはどのような種類の差分を検出できますか？',
          answer: 'ツールは行レベルと文字レベルの両方で追加、削除、変更を検出します。インライン差分とサイドバイサイド比較ビューを表示します。',
        },
        {
          question: 'シンタックスハイライト付きでコードファイルを比較できますか？',
          answer: 'はい、差分チェッカーは多くのプログラミング言語のシンタックスハイライトをサポートしています。',
        },
        {
          question: '空白の差分を無視するには？',
          answer: '「空白を無視」オプションを有効にして、意味のあるコンテンツの変更に集中します。',
        },
        {
          question: '差分結果をダウンロードまたは共有できますか？',
          answer: 'はい、差分出力をコピーするか、統一差分ファイルとしてダウンロードできます。',
        },
      ],
      ru: [
        {
          question: 'Как сравнить два текста онлайн?',
          answer: 'Вставьте исходный текст в левую панель, а измененный текст в правую. Нажмите «Сравнить», чтобы увидеть различия, выделенные цветом.',
        },
        {
          question: 'Какие типы различий может обнаружить этот инструмент?',
          answer: 'Инструмент обнаруживает добавления, удаления и изменения на уровне строк и символов. Показывает встроенные различия и сравнение бок о бок.',
        },
        {
          question: 'Могу ли я сравнивать файлы кода с подсветкой синтаксиса?',
          answer: 'Да, средство проверки различий поддерживает подсветку синтаксиса для многих языков программирования.',
        },
        {
          question: 'Как игнорировать различия в пробелах?',
          answer: 'Включите опцию «Игнорировать пробелы», чтобы сосредоточиться на значимых изменениях содержимого.',
        },
        {
          question: 'Могу ли я скачать или поделиться результатами сравнения?',
          answer: 'Да, вы можете скопировать вывод различий или скачать его как унифицированный diff-файл.',
        },
      ],
      fr: [
        {
          question: 'Comment comparer deux textes en ligne ?',
          answer: 'Collez votre texte original dans le panneau de gauche et le texte modifié dans le panneau de droite. Cliquez sur Comparer pour voir les différences mises en évidence.',
        },
        {
          question: 'Quels types de différences cet outil peut-il détecter ?',
          answer: 'L\'outil détecte les ajouts, suppressions et modifications au niveau des lignes et des caractères. Il affiche les différences en ligne et les vues de comparaison côte à côte.',
        },
        {
          question: 'Puis-je comparer des fichiers de code avec coloration syntaxique ?',
          answer: 'Oui, le vérificateur de différences prend en charge la coloration syntaxique pour de nombreux langages de programmation.',
        },
        {
          question: 'Comment ignorer les différences d\'espaces ?',
          answer: 'Activez l\'option « Ignorer les espaces » pour vous concentrer sur les changements de contenu significatifs.',
        },
        {
          question: 'Puis-je télécharger ou partager les résultats de différences ?',
          answer: 'Oui, vous pouvez copier la sortie des différences ou la télécharger sous forme de fichier diff unifié.',
        },
      ],
      de: [
        {
          question: 'Wie vergleiche ich zwei Texte online?',
          answer: 'Fügen Sie Ihren Originaltext im linken Panel und den geänderten Text im rechten Panel ein. Klicken Sie auf Vergleichen, um die Unterschiede hervorgehoben zu sehen.',
        },
        {
          question: 'Welche Arten von Unterschieden kann dieses Tool erkennen?',
          answer: 'Das Tool erkennt Hinzufügungen, Löschungen und Änderungen auf Zeilen- und Zeichenebene. Es zeigt Inline-Unterschiede und Seite-an-Seite-Vergleichsansichten.',
        },
        {
          question: 'Kann ich Code-Dateien mit Syntaxhervorhebung vergleichen?',
          answer: 'Ja, der Diff-Checker unterstützt Syntaxhervorhebung für viele Programmiersprachen.',
        },
        {
          question: 'Wie ignoriere ich Leerzeichen-Unterschiede?',
          answer: 'Aktivieren Sie die Option „Leerzeichen ignorieren", um sich auf bedeutsame Inhaltsänderungen zu konzentrieren.',
        },
        {
          question: 'Kann ich die Diff-Ergebnisse herunterladen oder teilen?',
          answer: 'Ja, Sie können die Diff-Ausgabe kopieren oder als vereinheitlichte Diff-Datei herunterladen.',
        },
      ],
      ko: [
        {
          question: '두 텍스트를 온라인에서 비교하려면?',
          answer: '왼쪽 패널에 원본 텍스트를, 오른쪽 패널에 수정된 텍스트를 붙여넣으세요. 비교를 클릭하면 추가는 녹색, 삭제는 빨간색으로 강조 표시됩니다.',
        },
        {
          question: '이 도구는 어떤 유형의 차이를 감지할 수 있나요?',
          answer: '도구는 줄 및 문자 수준에서 추가, 삭제 및 수정을 감지합니다. 인라인 차이와 나란히 비교 보기를 표시합니다.',
        },
        {
          question: '구문 강조 표시로 코드 파일을 비교할 수 있나요?',
          answer: '네, 차이 검사기는 많은 프로그래밍 언어에 대한 구문 강조 표시를 지원합니다.',
        },
        {
          question: '공백 차이를 무시하려면?',
          answer: '"공백 무시" 옵션을 활성화하여 의미 있는 콘텐츠 변경에 집중하세요.',
        },
        {
          question: '차이 결과를 다운로드하거나 공유할 수 있나요?',
          answer: '네, 차이 출력을 복사하거나 통합 diff 파일로 다운로드할 수 있습니다.',
        },
      ],
      ar: [
        {
          question: 'كيف أقارن نصين عبر الإنترنت؟',
          answer: 'الصق النص الأصلي في اللوحة اليسرى والنص المعدل في اللوحة اليمنى. انقر فوق مقارنة لرؤية الاختلافات المميزة.',
        },
        {
          question: 'ما أنواع الاختلافات التي يمكن لهذه الأداة اكتشافها؟',
          answer: 'تكتشف الأداة الإضافات والحذف والتعديلات على مستوى السطر والحرف. تعرض الاختلافات المضمنة وعروض المقارنة جنبًا إلى جنب.',
        },
        {
          question: 'هل يمكنني مقارنة ملفات الكود مع تمييز بناء الجملة؟',
          answer: 'نعم، يدعم مدقق الاختلافات تمييز بناء الجملة للعديد من لغات البرمجة.',
        },
        {
          question: 'كيف أتجاهل اختلافات المسافات البيضاء؟',
          answer: 'قم بتمكين خيار "تجاهل المسافات البيضاء" للتركيز على تغييرات المحتوى ذات المعنى.',
        },
        {
          question: 'هل يمكنني تنزيل أو مشاركة نتائج الاختلافات؟',
          answer: 'نعم، يمكنك نسخ مخرجات الاختلافات أو تنزيلها كملف diff موحد.',
        },
      ],
    },
  },

  // 13. HTML Encoder
  {
    slug: 'html-encoder',
    faqs: {
      en: [
        {
          question: 'How do I encode HTML entities online?',
          answer: 'Paste your text containing special characters in the input field and click Encode. Characters like <, >, &, and quotes will be converted to their HTML entity equivalents.',
        },
        {
          question: 'What is HTML encoding and why is it important?',
          answer: 'HTML encoding converts special characters to HTML entities to prevent XSS attacks and ensure proper display in web pages. It\'s essential for security and correct rendering.',
        },
        {
          question: 'How do I decode HTML entities back to text?',
          answer: 'Paste the HTML-encoded string (containing &lt;, &gt;, &amp;, etc.) and click Decode. The tool will convert entities back to their original characters.',
        },
        {
          question: 'Which characters need to be HTML encoded?',
          answer: 'Essential characters to encode: < (&lt;), > (&gt;), & (&amp;), " (&quot;), and \' (&#39;). Extended encoding includes all non-ASCII characters.',
        },
        {
          question: 'What is the difference between HTML encoding and URL encoding?',
          answer: 'HTML encoding converts characters for safe display in HTML documents. URL encoding converts characters for safe transmission in URLs. They use different escape sequences.',
        },
      ],
      zh: [
        {
          question: '如何在线编码 HTML 实体？',
          answer: '将包含特殊字符的文本粘贴到输入框中，点击编码。<、>、& 和引号等字符将被转换为对应的 HTML 实体。',
        },
        {
          question: '什么是 HTML 编码，为什么它很重要？',
          answer: 'HTML 编码将特殊字符转换为 HTML 实体，以防止 XSS 攻击并确保在网页中正确显示。它对安全性和正确渲染至关重要。',
        },
        {
          question: '如何将 HTML 实体解码回文本？',
          answer: '粘贴 HTML 编码的字符串（包含 &lt;、&gt;、&amp; 等），点击解码。工具会将实体转换回原始字符。',
        },
        {
          question: '哪些字符需要进行 HTML 编码？',
          answer: '必须编码的字符：< (&lt;)、> (&gt;)、& (&amp;)、" (&quot;) 和 \' (&#39;)。扩展编码包括所有非 ASCII 字符。',
        },
        {
          question: 'HTML 编码和 URL 编码有什么区别？',
          answer: 'HTML 编码将字符转换为在 HTML 文档中安全显示的格式。URL 编码将字符转换为在 URL 中安全传输的格式。它们使用不同的转义序列。',
        },
      ],
      es: [
        {
          question: '¿Cómo codifico entidades HTML en línea?',
          answer: 'Pegue su texto con caracteres especiales en el campo de entrada y haga clic en Codificar. Caracteres como <, >, & y comillas se convertirán a sus equivalentes de entidad HTML.',
        },
        {
          question: '¿Qué es la codificación HTML y por qué es importante?',
          answer: 'La codificación HTML convierte caracteres especiales a entidades HTML para prevenir ataques XSS y asegurar la visualización correcta en páginas web.',
        },
        {
          question: '¿Cómo decodifico entidades HTML a texto?',
          answer: 'Pegue la cadena codificada en HTML (con &lt;, &gt;, &amp;, etc.) y haga clic en Decodificar. La herramienta convertirá las entidades a sus caracteres originales.',
        },
        {
          question: '¿Qué caracteres necesitan codificación HTML?',
          answer: 'Caracteres esenciales: < (&lt;), > (&gt;), & (&amp;), " (&quot;) y \' (&#39;). La codificación extendida incluye todos los caracteres no ASCII.',
        },
        {
          question: '¿Cuál es la diferencia entre codificación HTML y URL?',
          answer: 'La codificación HTML convierte caracteres para visualización segura en documentos HTML. La codificación URL convierte caracteres para transmisión segura en URLs.',
        },
      ],
      pt: [
        {
          question: 'Como codifico entidades HTML online?',
          answer: 'Cole seu texto com caracteres especiais no campo de entrada e clique em Codificar. Caracteres como <, >, & e aspas serão convertidos para seus equivalentes de entidade HTML.',
        },
        {
          question: 'O que é codificação HTML e por que é importante?',
          answer: 'A codificação HTML converte caracteres especiais em entidades HTML para prevenir ataques XSS e garantir a exibição correta em páginas web.',
        },
        {
          question: 'Como decodifico entidades HTML para texto?',
          answer: 'Cole a string codificada em HTML (com &lt;, &gt;, &amp;, etc.) e clique em Decodificar. A ferramenta converterá as entidades para seus caracteres originais.',
        },
        {
          question: 'Quais caracteres precisam de codificação HTML?',
          answer: 'Caracteres essenciais: < (&lt;), > (&gt;), & (&amp;), " (&quot;) e \' (&#39;). A codificação estendida inclui todos os caracteres não ASCII.',
        },
        {
          question: 'Qual é a diferença entre codificação HTML e URL?',
          answer: 'A codificação HTML converte caracteres para exibição segura em documentos HTML. A codificação URL converte caracteres para transmissão segura em URLs.',
        },
      ],
      ja: [
        {
          question: 'HTMLエンティティをオンラインでエンコードするには？',
          answer: '特殊文字を含むテキストを入力フィールドに貼り付けて、エンコードをクリックします。<、>、&、引用符などの文字がHTMLエンティティに変換されます。',
        },
        {
          question: 'HTMLエンコードとは何ですか？なぜ重要ですか？',
          answer: 'HTMLエンコードは特殊文字をHTMLエンティティに変換し、XSS攻撃を防ぎ、Webページでの正しい表示を保証します。セキュリティと正しいレンダリングに不可欠です。',
        },
        {
          question: 'HTMLエンティティをテキストにデコードするには？',
          answer: 'HTMLエンコードされた文字列（&lt;、&gt;、&amp;などを含む）を貼り付けて、デコードをクリックします。ツールはエンティティを元の文字に変換します。',
        },
        {
          question: 'どの文字をHTMLエンコードする必要がありますか？',
          answer: '必須文字：< (&lt;)、> (&gt;)、& (&amp;)、" (&quot;)、\' (&#39;)。拡張エンコードにはすべての非ASCII文字が含まれます。',
        },
        {
          question: 'HTMLエンコードとURLエンコードの違いは？',
          answer: 'HTMLエンコードはHTML文書で安全に表示するために文字を変換します。URLエンコードはURLで安全に送信するために文字を変換します。異なるエスケープシーケンスを使用します。',
        },
      ],
      ru: [
        {
          question: 'Как закодировать HTML-сущности онлайн?',
          answer: 'Вставьте текст со специальными символами в поле ввода и нажмите «Кодировать». Символы <, >, & и кавычки будут преобразованы в их HTML-эквиваленты.',
        },
        {
          question: 'Что такое HTML-кодирование и почему это важно?',
          answer: 'HTML-кодирование преобразует специальные символы в HTML-сущности для предотвращения XSS-атак и обеспечения правильного отображения на веб-страницах.',
        },
        {
          question: 'Как декодировать HTML-сущности обратно в текст?',
          answer: 'Вставьте HTML-закодированную строку (содержащую &lt;, &gt;, &amp; и т.д.) и нажмите «Декодировать». Инструмент преобразует сущности обратно в исходные символы.',
        },
        {
          question: 'Какие символы нужно кодировать в HTML?',
          answer: 'Основные символы: < (&lt;), > (&gt;), & (&amp;), " (&quot;) и \' (&#39;). Расширенное кодирование включает все не-ASCII символы.',
        },
        {
          question: 'В чем разница между HTML и URL кодированием?',
          answer: 'HTML-кодирование преобразует символы для безопасного отображения в HTML-документах. URL-кодирование преобразует символы для безопасной передачи в URL.',
        },
      ],
      fr: [
        {
          question: 'Comment encoder des entités HTML en ligne ?',
          answer: 'Collez votre texte contenant des caractères spéciaux dans le champ de saisie et cliquez sur Encoder. Les caractères comme <, >, & et les guillemets seront convertis en entités HTML.',
        },
        {
          question: 'Qu\'est-ce que l\'encodage HTML et pourquoi est-il important ?',
          answer: 'L\'encodage HTML convertit les caractères spéciaux en entités HTML pour prévenir les attaques XSS et assurer un affichage correct dans les pages web.',
        },
        {
          question: 'Comment décoder les entités HTML en texte ?',
          answer: 'Collez la chaîne encodée en HTML (contenant &lt;, &gt;, &amp;, etc.) et cliquez sur Décoder. L\'outil convertira les entités en leurs caractères originaux.',
        },
        {
          question: 'Quels caractères doivent être encodés en HTML ?',
          answer: 'Caractères essentiels : < (&lt;), > (&gt;), & (&amp;), " (&quot;) et \' (&#39;). L\'encodage étendu inclut tous les caractères non-ASCII.',
        },
        {
          question: 'Quelle est la différence entre l\'encodage HTML et URL ?',
          answer: 'L\'encodage HTML convertit les caractères pour un affichage sûr dans les documents HTML. L\'encodage URL convertit les caractères pour une transmission sûre dans les URLs.',
        },
      ],
      de: [
        {
          question: 'Wie kodiere ich HTML-Entitäten online?',
          answer: 'Fügen Sie Ihren Text mit Sonderzeichen in das Eingabefeld ein und klicken Sie auf Kodieren. Zeichen wie <, >, & und Anführungszeichen werden in ihre HTML-Entitäten umgewandelt.',
        },
        {
          question: 'Was ist HTML-Kodierung und warum ist sie wichtig?',
          answer: 'HTML-Kodierung wandelt Sonderzeichen in HTML-Entitäten um, um XSS-Angriffe zu verhindern und die korrekte Anzeige auf Webseiten zu gewährleisten.',
        },
        {
          question: 'Wie dekodiere ich HTML-Entitäten zurück zu Text?',
          answer: 'Fügen Sie die HTML-kodierte Zeichenfolge (mit &lt;, &gt;, &amp; usw.) ein und klicken Sie auf Dekodieren. Das Tool wandelt Entitäten zurück in ihre ursprünglichen Zeichen.',
        },
        {
          question: 'Welche Zeichen müssen HTML-kodiert werden?',
          answer: 'Wesentliche Zeichen: < (&lt;), > (&gt;), & (&amp;), " (&quot;) und \' (&#39;). Erweiterte Kodierung umfasst alle Nicht-ASCII-Zeichen.',
        },
        {
          question: 'Was ist der Unterschied zwischen HTML- und URL-Kodierung?',
          answer: 'HTML-Kodierung wandelt Zeichen für sichere Anzeige in HTML-Dokumenten um. URL-Kodierung wandelt Zeichen für sichere Übertragung in URLs um.',
        },
      ],
      ko: [
        {
          question: 'HTML 엔티티를 온라인에서 인코딩하려면?',
          answer: '특수 문자가 포함된 텍스트를 입력 필드에 붙여넣고 인코딩을 클릭하세요. <, >, &, 따옴표 같은 문자가 HTML 엔티티로 변환됩니다.',
        },
        {
          question: 'HTML 인코딩이란 무엇이며 왜 중요한가요?',
          answer: 'HTML 인코딩은 특수 문자를 HTML 엔티티로 변환하여 XSS 공격을 방지하고 웹 페이지에서 올바르게 표시되도록 합니다. 보안과 올바른 렌더링에 필수적입니다.',
        },
        {
          question: 'HTML 엔티티를 텍스트로 디코딩하려면?',
          answer: 'HTML 인코딩된 문자열(&lt;, &gt;, &amp; 등 포함)을 붙여넣고 디코딩을 클릭하세요. 도구가 엔티티를 원래 문자로 변환합니다.',
        },
        {
          question: '어떤 문자를 HTML 인코딩해야 하나요?',
          answer: '필수 문자: < (&lt;), > (&gt;), & (&amp;), " (&quot;), \' (&#39;). 확장 인코딩에는 모든 비ASCII 문자가 포함됩니다.',
        },
        {
          question: 'HTML 인코딩과 URL 인코딩의 차이점은?',
          answer: 'HTML 인코딩은 HTML 문서에서 안전하게 표시하기 위해 문자를 변환합니다. URL 인코딩은 URL에서 안전하게 전송하기 위해 문자를 변환합니다.',
        },
      ],
      ar: [
        {
          question: 'كيف أقوم بتشفير كيانات HTML عبر الإنترنت؟',
          answer: 'الصق النص الذي يحتوي على أحرف خاصة في حقل الإدخال وانقر فوق تشفير. سيتم تحويل الأحرف مثل <، >، & والاقتباسات إلى مكافئات كيان HTML.',
        },
        {
          question: 'ما هو تشفير HTML ولماذا هو مهم؟',
          answer: 'يحول تشفير HTML الأحرف الخاصة إلى كيانات HTML لمنع هجمات XSS وضمان العرض الصحيح في صفحات الويب.',
        },
        {
          question: 'كيف أفك تشفير كيانات HTML إلى نص؟',
          answer: 'الصق السلسلة المشفرة بـ HTML (التي تحتوي على &lt;، &gt;، &amp;، إلخ) وانقر فوق فك التشفير. ستحول الأداة الكيانات إلى أحرفها الأصلية.',
        },
        {
          question: 'ما الأحرف التي تحتاج إلى تشفير HTML؟',
          answer: 'الأحرف الأساسية: < (&lt;)، > (&gt;)، & (&amp;)، " (&quot;) و \' (&#39;). يشمل التشفير الموسع جميع الأحرف غير ASCII.',
        },
        {
          question: 'ما الفرق بين تشفير HTML و URL؟',
          answer: 'يحول تشفير HTML الأحرف للعرض الآمن في مستندات HTML. يحول تشفير URL الأحرف للنقل الآمن في عناوين URL.',
        },
      ],
    },
  },

  // 14. Word Counter
  {
    slug: 'word-counter',
    faqs: {
      en: [
        {
          question: 'How do I count words in my text online?',
          answer: 'Simply paste or type your text in the input area. The tool instantly displays word count, character count (with and without spaces), sentence count, and paragraph count.',
        },
        {
          question: 'Does the word counter support multiple languages?',
          answer: 'Yes, our word counter works with all languages including English, Chinese, Japanese, Korean, Arabic, and more. It accurately counts words based on language-specific rules.',
        },
        {
          question: 'How are words counted in Chinese and Japanese text?',
          answer: 'For CJK (Chinese, Japanese, Korean) languages, each character is typically counted as one word since these languages don\'t use spaces between words.',
        },
        {
          question: 'Can I see reading time estimation?',
          answer: 'Yes, the tool calculates estimated reading time based on average reading speed (200-250 words per minute for English). This helps writers gauge content length.',
        },
        {
          question: 'Is there a character limit for the word counter?',
          answer: 'No server-side limit exists since processing happens in your browser. However, extremely long texts (millions of characters) may slow down your browser.',
        },
      ],
      zh: [
        {
          question: '如何在线统计文本字数？',
          answer: '只需在输入区域粘贴或输入文本。工具会立即显示字数、字符数（含空格和不含空格）、句子数和段落数。',
        },
        {
          question: '字数统计工具支持多种语言吗？',
          answer: '是的，我们的字数统计工具支持所有语言，包括英语、中文、日语、韩语、阿拉伯语等。它根据特定语言规则准确计数。',
        },
        {
          question: '中文和日文文本如何计算字数？',
          answer: '对于中日韩（CJK）语言，每个字符通常计为一个字，因为这些语言在词之间不使用空格。',
        },
        {
          question: '可以看到阅读时间估算吗？',
          answer: '是的，工具根据平均阅读速度（英文每分钟 200-250 词）计算预计阅读时间。这有助于作者评估内容长度。',
        },
        {
          question: '字数统计有字符限制吗？',
          answer: '由于处理在浏览器中进行，没有服务器端限制。但是，极长的文本（数百万字符）可能会减慢浏览器速度。',
        },
      ],
      es: [
        {
          question: '¿Cómo cuento palabras en mi texto en línea?',
          answer: 'Simplemente pegue o escriba su texto en el área de entrada. La herramienta muestra instantáneamente el conteo de palabras, caracteres, oraciones y párrafos.',
        },
        {
          question: '¿El contador de palabras admite varios idiomas?',
          answer: 'Sí, nuestro contador de palabras funciona con todos los idiomas incluyendo inglés, chino, japonés, coreano, árabe y más.',
        },
        {
          question: '¿Cómo se cuentan las palabras en texto chino y japonés?',
          answer: 'Para idiomas CJK (chino, japonés, coreano), cada carácter se cuenta típicamente como una palabra ya que estos idiomas no usan espacios entre palabras.',
        },
        {
          question: '¿Puedo ver la estimación del tiempo de lectura?',
          answer: 'Sí, la herramienta calcula el tiempo de lectura estimado basado en la velocidad promedio de lectura.',
        },
        {
          question: '¿Hay un límite de caracteres para el contador de palabras?',
          answer: 'No existe límite del lado del servidor ya que el procesamiento ocurre en su navegador.',
        },
      ],
      pt: [
        {
          question: 'Como conto palavras no meu texto online?',
          answer: 'Basta colar ou digitar seu texto na área de entrada. A ferramenta exibe instantaneamente a contagem de palavras, caracteres, frases e parágrafos.',
        },
        {
          question: 'O contador de palavras suporta vários idiomas?',
          answer: 'Sim, nosso contador de palavras funciona com todos os idiomas, incluindo inglês, chinês, japonês, coreano, árabe e mais.',
        },
        {
          question: 'Como as palavras são contadas em texto chinês e japonês?',
          answer: 'Para idiomas CJK (chinês, japonês, coreano), cada caractere é tipicamente contado como uma palavra, pois esses idiomas não usam espaços entre palavras.',
        },
        {
          question: 'Posso ver a estimativa de tempo de leitura?',
          answer: 'Sim, a ferramenta calcula o tempo de leitura estimado com base na velocidade média de leitura.',
        },
        {
          question: 'Há um limite de caracteres para o contador de palavras?',
          answer: 'Não existe limite do lado do servidor, pois o processamento acontece no seu navegador.',
        },
      ],
      ja: [
        {
          question: 'テキストの単語数をオンラインでカウントするには？',
          answer: '入力エリアにテキストを貼り付けるか入力するだけです。ツールは即座に単語数、文字数、文数、段落数を表示します。',
        },
        {
          question: '単語カウンターは複数の言語をサポートしていますか？',
          answer: 'はい、当ツールは英語、中国語、日本語、韓国語、アラビア語など、すべての言語で動作します。',
        },
        {
          question: '中国語と日本語のテキストはどのようにカウントされますか？',
          answer: 'CJK（中国語、日本語、韓国語）言語では、これらの言語は単語間にスペースを使用しないため、各文字は通常1単語としてカウントされます。',
        },
        {
          question: '読書時間の見積もりを見ることができますか？',
          answer: 'はい、ツールは平均読書速度に基づいて推定読書時間を計算します。',
        },
        {
          question: '単語カウンターに文字制限はありますか？',
          answer: '処理はブラウザで行われるため、サーバー側の制限はありません。',
        },
      ],
      ru: [
        {
          question: 'Как подсчитать слова в тексте онлайн?',
          answer: 'Просто вставьте или введите текст в область ввода. Инструмент мгновенно отображает количество слов, символов, предложений и абзацев.',
        },
        {
          question: 'Поддерживает ли счетчик слов несколько языков?',
          answer: 'Да, наш счетчик слов работает со всеми языками, включая английский, китайский, японский, корейский, арабский и другие.',
        },
        {
          question: 'Как подсчитываются слова в китайском и японском тексте?',
          answer: 'Для языков CJK (китайский, японский, корейский) каждый символ обычно считается одним словом, поскольку эти языки не используют пробелы между словами.',
        },
        {
          question: 'Могу ли я увидеть оценку времени чтения?',
          answer: 'Да, инструмент рассчитывает примерное время чтения на основе средней скорости чтения.',
        },
        {
          question: 'Есть ли ограничение на количество символов для счетчика слов?',
          answer: 'Ограничения на стороне сервера нет, так как обработка происходит в вашем браузере.',
        },
      ],
      fr: [
        {
          question: 'Comment compter les mots dans mon texte en ligne ?',
          answer: 'Collez ou tapez simplement votre texte dans la zone de saisie. L\'outil affiche instantanément le nombre de mots, caractères, phrases et paragraphes.',
        },
        {
          question: 'Le compteur de mots prend-il en charge plusieurs langues ?',
          answer: 'Oui, notre compteur de mots fonctionne avec toutes les langues, y compris l\'anglais, le chinois, le japonais, le coréen, l\'arabe et plus encore.',
        },
        {
          question: 'Comment les mots sont-ils comptés dans les textes chinois et japonais ?',
          answer: 'Pour les langues CJK (chinois, japonais, coréen), chaque caractère est généralement compté comme un mot car ces langues n\'utilisent pas d\'espaces entre les mots.',
        },
        {
          question: 'Puis-je voir l\'estimation du temps de lecture ?',
          answer: 'Oui, l\'outil calcule le temps de lecture estimé basé sur la vitesse de lecture moyenne.',
        },
        {
          question: 'Y a-t-il une limite de caractères pour le compteur de mots ?',
          answer: 'Il n\'y a pas de limite côté serveur car le traitement se fait dans votre navigateur.',
        },
      ],
      de: [
        {
          question: 'Wie zähle ich Wörter in meinem Text online?',
          answer: 'Fügen Sie einfach Ihren Text in den Eingabebereich ein oder tippen Sie ihn ein. Das Tool zeigt sofort die Anzahl der Wörter, Zeichen, Sätze und Absätze an.',
        },
        {
          question: 'Unterstützt der Wortzähler mehrere Sprachen?',
          answer: 'Ja, unser Wortzähler funktioniert mit allen Sprachen, einschließlich Englisch, Chinesisch, Japanisch, Koreanisch, Arabisch und mehr.',
        },
        {
          question: 'Wie werden Wörter in chinesischem und japanischem Text gezählt?',
          answer: 'Bei CJK-Sprachen (Chinesisch, Japanisch, Koreanisch) wird jedes Zeichen typischerweise als ein Wort gezählt, da diese Sprachen keine Leerzeichen zwischen Wörtern verwenden.',
        },
        {
          question: 'Kann ich die geschätzte Lesezeit sehen?',
          answer: 'Ja, das Tool berechnet die geschätzte Lesezeit basierend auf der durchschnittlichen Lesegeschwindigkeit.',
        },
        {
          question: 'Gibt es eine Zeichenbegrenzung für den Wortzähler?',
          answer: 'Es gibt keine serverseitige Begrenzung, da die Verarbeitung in Ihrem Browser erfolgt.',
        },
      ],
      ko: [
        {
          question: '텍스트의 단어 수를 온라인에서 세려면?',
          answer: '입력 영역에 텍스트를 붙여넣거나 입력하기만 하면 됩니다. 도구가 즉시 단어 수, 문자 수, 문장 수, 단락 수를 표시합니다.',
        },
        {
          question: '단어 카운터는 여러 언어를 지원하나요?',
          answer: '네, 우리의 단어 카운터는 영어, 중국어, 일본어, 한국어, 아랍어 등 모든 언어에서 작동합니다.',
        },
        {
          question: '중국어와 일본어 텍스트에서 단어는 어떻게 계산되나요?',
          answer: 'CJK(중국어, 일본어, 한국어) 언어의 경우, 이러한 언어는 단어 사이에 공백을 사용하지 않으므로 각 문자가 일반적으로 하나의 단어로 계산됩니다.',
        },
        {
          question: '읽기 시간 추정을 볼 수 있나요?',
          answer: '네, 도구는 평균 읽기 속도를 기반으로 예상 읽기 시간을 계산합니다.',
        },
        {
          question: '단어 카운터에 문자 제한이 있나요?',
          answer: '처리가 브라우저에서 이루어지므로 서버 측 제한이 없습니다.',
        },
      ],
      ar: [
        {
          question: 'كيف أحسب الكلمات في نصي عبر الإنترنت؟',
          answer: 'ما عليك سوى لصق أو كتابة النص في منطقة الإدخال. تعرض الأداة على الفور عدد الكلمات والأحرف والجمل والفقرات.',
        },
        {
          question: 'هل يدعم عداد الكلمات لغات متعددة؟',
          answer: 'نعم، يعمل عداد الكلمات لدينا مع جميع اللغات بما في ذلك الإنجليزية والصينية واليابانية والكورية والعربية وغيرها.',
        },
        {
          question: 'كيف يتم حساب الكلمات في النص الصيني والياباني؟',
          answer: 'بالنسبة للغات CJK (الصينية واليابانية والكورية)، يتم عادةً حساب كل حرف ككلمة واحدة لأن هذه اللغات لا تستخدم مسافات بين الكلمات.',
        },
        {
          question: 'هل يمكنني رؤية تقدير وقت القراءة؟',
          answer: 'نعم، تحسب الأداة وقت القراءة المقدر بناءً على متوسط سرعة القراءة.',
        },
        {
          question: 'هل هناك حد للأحرف لعداد الكلمات؟',
          answer: 'لا يوجد حد من جانب الخادم لأن المعالجة تتم في متصفحك.',
        },
      ],
    },
  },

  // 15. Markdown Preview
  {
    slug: 'markdown-preview',
    faqs: {
      en: [
        {
          question: 'How do I preview Markdown online?',
          answer: 'Type or paste your Markdown text in the editor. The preview panel shows the rendered HTML in real-time. You can toggle between edit, preview, and split view modes.',
        },
        {
          question: 'What Markdown syntax is supported?',
          answer: 'We support standard Markdown plus GitHub Flavored Markdown (GFM) including tables, task lists, strikethrough, code blocks with syntax highlighting, and more.',
        },
        {
          question: 'Can I export the rendered Markdown?',
          answer: 'Yes, you can copy the rendered HTML or download it. Some versions also support exporting to PDF for documentation purposes.',
        },
        {
          question: 'Does the preview support code syntax highlighting?',
          answer: 'Yes, code blocks with language specification (```javascript, ```python, etc.) are automatically syntax highlighted for better readability.',
        },
        {
          question: 'Can I use custom CSS for the preview?',
          answer: 'The preview uses a clean, readable default style. Some advanced versions allow custom CSS themes for different preview appearances.',
        },
      ],
      zh: [
        {
          question: '如何在线预览 Markdown？',
          answer: '在编辑器中输入或粘贴 Markdown 文本。预览面板会实时显示渲染的 HTML。您可以在编辑、预览和分屏视图模式之间切换。',
        },
        {
          question: '支持哪些 Markdown 语法？',
          answer: '我们支持标准 Markdown 以及 GitHub 风格 Markdown（GFM），包括表格、任务列表、删除线、带语法高亮的代码块等。',
        },
        {
          question: '可以导出渲染后的 Markdown 吗？',
          answer: '是的，您可以复制渲染的 HTML 或下载它。某些版本还支持导出为 PDF 用于文档目的。',
        },
        {
          question: '预览支持代码语法高亮吗？',
          answer: '是的，带有语言规范的代码块（```javascript、```python 等）会自动进行语法高亮以提高可读性。',
        },
        {
          question: '可以为预览使用自定义 CSS 吗？',
          answer: '预览使用简洁、易读的默认样式。某些高级版本允许使用自定义 CSS 主题来获得不同的预览外观。',
        },
      ],
      es: [
        {
          question: '¿Cómo previsualizo Markdown en línea?',
          answer: 'Escriba o pegue su texto Markdown en el editor. El panel de vista previa muestra el HTML renderizado en tiempo real.',
        },
        {
          question: '¿Qué sintaxis Markdown es compatible?',
          answer: 'Soportamos Markdown estándar más GitHub Flavored Markdown (GFM) incluyendo tablas, listas de tareas, tachado y bloques de código con resaltado de sintaxis.',
        },
        {
          question: '¿Puedo exportar el Markdown renderizado?',
          answer: 'Sí, puede copiar el HTML renderizado o descargarlo. Algunas versiones también admiten exportación a PDF.',
        },
        {
          question: '¿La vista previa admite resaltado de sintaxis de código?',
          answer: 'Sí, los bloques de código con especificación de lenguaje se resaltan automáticamente.',
        },
        {
          question: '¿Puedo usar CSS personalizado para la vista previa?',
          answer: 'La vista previa usa un estilo predeterminado limpio y legible. Algunas versiones avanzadas permiten temas CSS personalizados.',
        },
      ],
      pt: [
        {
          question: 'Como visualizo Markdown online?',
          answer: 'Digite ou cole seu texto Markdown no editor. O painel de visualização mostra o HTML renderizado em tempo real.',
        },
        {
          question: 'Qual sintaxe Markdown é suportada?',
          answer: 'Suportamos Markdown padrão mais GitHub Flavored Markdown (GFM) incluindo tabelas, listas de tarefas, tachado e blocos de código com destaque de sintaxe.',
        },
        {
          question: 'Posso exportar o Markdown renderizado?',
          answer: 'Sim, você pode copiar o HTML renderizado ou baixá-lo. Algumas versões também suportam exportação para PDF.',
        },
        {
          question: 'A visualização suporta destaque de sintaxe de código?',
          answer: 'Sim, blocos de código com especificação de linguagem são automaticamente destacados.',
        },
        {
          question: 'Posso usar CSS personalizado para a visualização?',
          answer: 'A visualização usa um estilo padrão limpo e legível. Algumas versões avançadas permitem temas CSS personalizados.',
        },
      ],
      ja: [
        {
          question: 'Markdownをオンラインでプレビューするには？',
          answer: 'エディタにMarkdownテキストを入力または貼り付けます。プレビューパネルはレンダリングされたHTMLをリアルタイムで表示します。',
        },
        {
          question: 'どのMarkdown構文がサポートされていますか？',
          answer: '標準MarkdownとGitHub Flavored Markdown（GFM）をサポートしています。テーブル、タスクリスト、取り消し線、シンタックスハイライト付きコードブロックなどが含まれます。',
        },
        {
          question: 'レンダリングされたMarkdownをエクスポートできますか？',
          answer: 'はい、レンダリングされたHTMLをコピーまたはダウンロードできます。一部のバージョンではPDFへのエクスポートもサポートしています。',
        },
        {
          question: 'プレビューはコードのシンタックスハイライトをサポートしていますか？',
          answer: 'はい、言語指定付きのコードブロックは自動的にシンタックスハイライトされます。',
        },
        {
          question: 'プレビューにカスタムCSSを使用できますか？',
          answer: 'プレビューはクリーンで読みやすいデフォルトスタイルを使用します。一部の高度なバージョンではカスタムCSSテーマが許可されています。',
        },
      ],
      ru: [
        {
          question: 'Как просмотреть Markdown онлайн?',
          answer: 'Введите или вставьте текст Markdown в редактор. Панель предварительного просмотра показывает отрендеренный HTML в реальном времени.',
        },
        {
          question: 'Какой синтаксис Markdown поддерживается?',
          answer: 'Мы поддерживаем стандартный Markdown плюс GitHub Flavored Markdown (GFM), включая таблицы, списки задач, зачеркивание и блоки кода с подсветкой синтаксиса.',
        },
        {
          question: 'Могу ли я экспортировать отрендеренный Markdown?',
          answer: 'Да, вы можете скопировать отрендеренный HTML или скачать его. Некоторые версии также поддерживают экспорт в PDF.',
        },
        {
          question: 'Поддерживает ли предварительный просмотр подсветку синтаксиса кода?',
          answer: 'Да, блоки кода с указанием языка автоматически подсвечиваются.',
        },
        {
          question: 'Могу ли я использовать пользовательский CSS для предварительного просмотра?',
          answer: 'Предварительный просмотр использует чистый, читаемый стиль по умолчанию. Некоторые продвинутые версии позволяют использовать пользовательские CSS-темы.',
        },
      ],
      fr: [
        {
          question: 'Comment prévisualiser Markdown en ligne ?',
          answer: 'Tapez ou collez votre texte Markdown dans l\'éditeur. Le panneau de prévisualisation affiche le HTML rendu en temps réel.',
        },
        {
          question: 'Quelle syntaxe Markdown est prise en charge ?',
          answer: 'Nous prenons en charge le Markdown standard plus GitHub Flavored Markdown (GFM) incluant les tableaux, listes de tâches, barré et blocs de code avec coloration syntaxique.',
        },
        {
          question: 'Puis-je exporter le Markdown rendu ?',
          answer: 'Oui, vous pouvez copier le HTML rendu ou le télécharger. Certaines versions prennent également en charge l\'exportation en PDF.',
        },
        {
          question: 'La prévisualisation prend-elle en charge la coloration syntaxique du code ?',
          answer: 'Oui, les blocs de code avec spécification de langage sont automatiquement colorés syntaxiquement.',
        },
        {
          question: 'Puis-je utiliser du CSS personnalisé pour la prévisualisation ?',
          answer: 'La prévisualisation utilise un style par défaut propre et lisible. Certaines versions avancées permettent des thèmes CSS personnalisés.',
        },
      ],
      de: [
        {
          question: 'Wie kann ich Markdown online in der Vorschau anzeigen?',
          answer: 'Geben Sie Ihren Markdown-Text im Editor ein oder fügen Sie ihn ein. Das Vorschaufenster zeigt das gerenderte HTML in Echtzeit an.',
        },
        {
          question: 'Welche Markdown-Syntax wird unterstützt?',
          answer: 'Wir unterstützen Standard-Markdown plus GitHub Flavored Markdown (GFM) einschließlich Tabellen, Aufgabenlisten, Durchstreichen und Codeblöcke mit Syntaxhervorhebung.',
        },
        {
          question: 'Kann ich das gerenderte Markdown exportieren?',
          answer: 'Ja, Sie können das gerenderte HTML kopieren oder herunterladen. Einige Versionen unterstützen auch den Export als PDF.',
        },
        {
          question: 'Unterstützt die Vorschau Code-Syntaxhervorhebung?',
          answer: 'Ja, Codeblöcke mit Sprachspezifikation werden automatisch syntaxhervorgehoben.',
        },
        {
          question: 'Kann ich benutzerdefiniertes CSS für die Vorschau verwenden?',
          answer: 'Die Vorschau verwendet einen sauberen, lesbaren Standardstil. Einige erweiterte Versionen erlauben benutzerdefinierte CSS-Themes.',
        },
      ],
      ko: [
        {
          question: 'Markdown을 온라인에서 미리 보려면?',
          answer: '편집기에 Markdown 텍스트를 입력하거나 붙여넣으세요. 미리보기 패널이 렌더링된 HTML을 실시간으로 표시합니다.',
        },
        {
          question: '어떤 Markdown 구문이 지원되나요?',
          answer: '표준 Markdown과 GitHub Flavored Markdown(GFM)을 지원합니다. 테이블, 작업 목록, 취소선, 구문 강조 표시가 있는 코드 블록 등이 포함됩니다.',
        },
        {
          question: '렌더링된 Markdown을 내보낼 수 있나요?',
          answer: '네, 렌더링된 HTML을 복사하거나 다운로드할 수 있습니다. 일부 버전은 PDF로 내보내기도 지원합니다.',
        },
        {
          question: '미리보기가 코드 구문 강조 표시를 지원하나요?',
          answer: '네, 언어 지정이 있는 코드 블록은 자동으로 구문 강조 표시됩니다.',
        },
        {
          question: '미리보기에 사용자 정의 CSS를 사용할 수 있나요?',
          answer: '미리보기는 깔끔하고 읽기 쉬운 기본 스타일을 사용합니다. 일부 고급 버전에서는 사용자 정의 CSS 테마를 허용합니다.',
        },
      ],
      ar: [
        {
          question: 'كيف أعاين Markdown عبر الإنترنت؟',
          answer: 'اكتب أو الصق نص Markdown في المحرر. تعرض لوحة المعاينة HTML المُصيَّر في الوقت الفعلي.',
        },
        {
          question: 'ما هي صيغة Markdown المدعومة؟',
          answer: 'ندعم Markdown القياسي بالإضافة إلى GitHub Flavored Markdown (GFM) بما في ذلك الجداول وقوائم المهام والشطب وكتل الكود مع تمييز بناء الجملة.',
        },
        {
          question: 'هل يمكنني تصدير Markdown المُصيَّر؟',
          answer: 'نعم، يمكنك نسخ HTML المُصيَّر أو تنزيله. تدعم بعض الإصدارات أيضًا التصدير إلى PDF.',
        },
        {
          question: 'هل تدعم المعاينة تمييز بناء جملة الكود؟',
          answer: 'نعم، يتم تمييز كتل الكود مع تحديد اللغة تلقائيًا.',
        },
        {
          question: 'هل يمكنني استخدام CSS مخصص للمعاينة؟',
          answer: 'تستخدم المعاينة نمطًا افتراضيًا نظيفًا وقابلاً للقراءة. تسمح بعض الإصدارات المتقدمة بسمات CSS مخصصة.',
        },
      ],
    },
  },

  // 16. Lorem Ipsum Generator
  {
    slug: 'lorem-ipsum-generator',
    faqs: {
      en: [
        {
          question: 'How do I generate Lorem Ipsum text online?',
          answer: 'Select the number of paragraphs, sentences, or words you need, then click Generate. The placeholder text will be created instantly and ready to copy.',
        },
        {
          question: 'What is Lorem Ipsum and why is it used?',
          answer: 'Lorem Ipsum is dummy text used in design and publishing since the 1500s. It helps designers focus on visual elements without being distracted by readable content.',
        },
        {
          question: 'Can I generate Lorem Ipsum in different formats?',
          answer: 'Yes, you can generate paragraphs, sentences, words, or even lists. Some versions also support HTML-formatted output with proper paragraph tags.',
        },
        {
          question: 'Is the generated text truly random?',
          answer: 'Lorem Ipsum follows a semi-random pattern based on classical Latin text. While not completely random, it provides natural-looking placeholder content.',
        },
        {
          question: 'Can I customize the Lorem Ipsum output?',
          answer: 'Yes, you can specify the exact amount of content, choose between different Lorem Ipsum variants, and select output format (plain text or HTML).',
        },
      ],
      zh: [
        {
          question: '如何在线生成 Lorem Ipsum 文本？',
          answer: '选择您需要的段落、句子或单词数量，然后点击生成。占位符文本将立即创建并准备好复制。',
        },
        {
          question: '什么是 Lorem Ipsum，为什么要使用它？',
          answer: 'Lorem Ipsum 是自 1500 年代以来在设计和出版中使用的虚拟文本。它帮助设计师专注于视觉元素，而不会被可读内容分散注意力。',
        },
        {
          question: '可以生成不同格式的 Lorem Ipsum 吗？',
          answer: '是的，您可以生成段落、句子、单词甚至列表。某些版本还支持带有适当段落标签的 HTML 格式输出。',
        },
        {
          question: '生成的文本是真正随机的吗？',
          answer: 'Lorem Ipsum 遵循基于古典拉丁文本的半随机模式。虽然不是完全随机，但它提供了看起来自然的占位符内容。',
        },
        {
          question: '可以自定义 Lorem Ipsum 输出吗？',
          answer: '是的，您可以指定确切的内容量，在不同的 Lorem Ipsum 变体之间选择，并选择输出格式（纯文本或 HTML）。',
        },
      ],
      es: [
        {
          question: '¿Cómo genero texto Lorem Ipsum en línea?',
          answer: 'Seleccione el número de párrafos, oraciones o palabras que necesita, luego haga clic en Generar. El texto de marcador de posición se creará instantáneamente.',
        },
        {
          question: '¿Qué es Lorem Ipsum y por qué se usa?',
          answer: 'Lorem Ipsum es texto ficticio usado en diseño y publicación desde los años 1500. Ayuda a los diseñadores a enfocarse en elementos visuales.',
        },
        {
          question: '¿Puedo generar Lorem Ipsum en diferentes formatos?',
          answer: 'Sí, puede generar párrafos, oraciones, palabras o incluso listas. Algunas versiones también admiten salida formateada en HTML.',
        },
        {
          question: '¿El texto generado es verdaderamente aleatorio?',
          answer: 'Lorem Ipsum sigue un patrón semi-aleatorio basado en texto latino clásico. Aunque no es completamente aleatorio, proporciona contenido de marcador de posición de aspecto natural.',
        },
        {
          question: '¿Puedo personalizar la salida de Lorem Ipsum?',
          answer: 'Sí, puede especificar la cantidad exacta de contenido y elegir entre diferentes variantes de Lorem Ipsum.',
        },
      ],
      pt: [
        {
          question: 'Como gero texto Lorem Ipsum online?',
          answer: 'Selecione o número de parágrafos, frases ou palavras que você precisa, depois clique em Gerar. O texto de espaço reservado será criado instantaneamente.',
        },
        {
          question: 'O que é Lorem Ipsum e por que é usado?',
          answer: 'Lorem Ipsum é texto fictício usado em design e publicação desde os anos 1500. Ajuda os designers a focar em elementos visuais.',
        },
        {
          question: 'Posso gerar Lorem Ipsum em diferentes formatos?',
          answer: 'Sim, você pode gerar parágrafos, frases, palavras ou até listas. Algumas versões também suportam saída formatada em HTML.',
        },
        {
          question: 'O texto gerado é verdadeiramente aleatório?',
          answer: 'Lorem Ipsum segue um padrão semi-aleatório baseado em texto latino clássico. Embora não seja completamente aleatório, fornece conteúdo de espaço reservado de aparência natural.',
        },
        {
          question: 'Posso personalizar a saída do Lorem Ipsum?',
          answer: 'Sim, você pode especificar a quantidade exata de conteúdo e escolher entre diferentes variantes de Lorem Ipsum.',
        },
      ],
      ja: [
        {
          question: 'Lorem Ipsumテキストをオンラインで生成するには？',
          answer: '必要な段落、文、または単語の数を選択し、生成をクリックします。プレースホルダーテキストが即座に作成され、コピーの準備ができます。',
        },
        {
          question: 'Lorem Ipsumとは何ですか？なぜ使用されますか？',
          answer: 'Lorem Ipsumは1500年代からデザインと出版で使用されているダミーテキストです。デザイナーが読めるコンテンツに気を取られずに視覚要素に集中するのに役立ちます。',
        },
        {
          question: '異なる形式でLorem Ipsumを生成できますか？',
          answer: 'はい、段落、文、単語、さらにはリストを生成できます。一部のバージョンでは、適切な段落タグを持つHTML形式の出力もサポートしています。',
        },
        {
          question: '生成されたテキストは本当にランダムですか？',
          answer: 'Lorem Ipsumは古典ラテン語テキストに基づく半ランダムパターンに従います。完全にランダムではありませんが、自然に見えるプレースホルダーコンテンツを提供します。',
        },
        {
          question: 'Lorem Ipsum出力をカスタマイズできますか？',
          answer: 'はい、正確なコンテンツ量を指定し、異なるLorem Ipsumバリアントから選択できます。',
        },
      ],
      ru: [
        {
          question: 'Как сгенерировать текст Lorem Ipsum онлайн?',
          answer: 'Выберите количество абзацев, предложений или слов, которые вам нужны, затем нажмите «Сгенерировать». Текст-заполнитель будет создан мгновенно.',
        },
        {
          question: 'Что такое Lorem Ipsum и зачем он используется?',
          answer: 'Lorem Ipsum — это фиктивный текст, используемый в дизайне и издательстве с 1500-х годов. Он помогает дизайнерам сосредоточиться на визуальных элементах.',
        },
        {
          question: 'Могу ли я генерировать Lorem Ipsum в разных форматах?',
          answer: 'Да, вы можете генерировать абзацы, предложения, слова или даже списки. Некоторые версии также поддерживают вывод в формате HTML.',
        },
        {
          question: 'Является ли сгенерированный текст действительно случайным?',
          answer: 'Lorem Ipsum следует полуслучайному шаблону, основанному на классическом латинском тексте. Хотя он не полностью случайный, он обеспечивает естественно выглядящий контент-заполнитель.',
        },
        {
          question: 'Могу ли я настроить вывод Lorem Ipsum?',
          answer: 'Да, вы можете указать точное количество контента и выбрать между различными вариантами Lorem Ipsum.',
        },
      ],
      fr: [
        {
          question: 'Comment générer du texte Lorem Ipsum en ligne ?',
          answer: 'Sélectionnez le nombre de paragraphes, phrases ou mots dont vous avez besoin, puis cliquez sur Générer. Le texte de remplacement sera créé instantanément.',
        },
        {
          question: 'Qu\'est-ce que Lorem Ipsum et pourquoi est-il utilisé ?',
          answer: 'Lorem Ipsum est un texte fictif utilisé dans le design et l\'édition depuis les années 1500. Il aide les designers à se concentrer sur les éléments visuels.',
        },
        {
          question: 'Puis-je générer Lorem Ipsum dans différents formats ?',
          answer: 'Oui, vous pouvez générer des paragraphes, phrases, mots ou même des listes. Certaines versions prennent également en charge la sortie formatée en HTML.',
        },
        {
          question: 'Le texte généré est-il vraiment aléatoire ?',
          answer: 'Lorem Ipsum suit un modèle semi-aléatoire basé sur un texte latin classique. Bien qu\'il ne soit pas complètement aléatoire, il fournit un contenu de remplacement d\'aspect naturel.',
        },
        {
          question: 'Puis-je personnaliser la sortie Lorem Ipsum ?',
          answer: 'Oui, vous pouvez spécifier la quantité exacte de contenu et choisir entre différentes variantes de Lorem Ipsum.',
        },
      ],
      de: [
        {
          question: 'Wie generiere ich Lorem Ipsum Text online?',
          answer: 'Wählen Sie die Anzahl der Absätze, Sätze oder Wörter, die Sie benötigen, und klicken Sie dann auf Generieren. Der Platzhaltertext wird sofort erstellt.',
        },
        {
          question: 'Was ist Lorem Ipsum und warum wird es verwendet?',
          answer: 'Lorem Ipsum ist Blindtext, der seit den 1500er Jahren im Design und Verlagswesen verwendet wird. Er hilft Designern, sich auf visuelle Elemente zu konzentrieren.',
        },
        {
          question: 'Kann ich Lorem Ipsum in verschiedenen Formaten generieren?',
          answer: 'Ja, Sie können Absätze, Sätze, Wörter oder sogar Listen generieren. Einige Versionen unterstützen auch HTML-formatierte Ausgabe.',
        },
        {
          question: 'Ist der generierte Text wirklich zufällig?',
          answer: 'Lorem Ipsum folgt einem halbzufälligen Muster basierend auf klassischem lateinischem Text. Obwohl nicht vollständig zufällig, bietet es natürlich aussehenden Platzhalterinhalt.',
        },
        {
          question: 'Kann ich die Lorem Ipsum Ausgabe anpassen?',
          answer: 'Ja, Sie können die genaue Menge an Inhalt angeben und zwischen verschiedenen Lorem Ipsum Varianten wählen.',
        },
      ],
      ko: [
        {
          question: 'Lorem Ipsum 텍스트를 온라인에서 생성하려면?',
          answer: '필요한 단락, 문장 또는 단어 수를 선택한 다음 생성을 클릭하세요. 플레이스홀더 텍스트가 즉시 생성되어 복사할 준비가 됩니다.',
        },
        {
          question: 'Lorem Ipsum이란 무엇이며 왜 사용되나요?',
          answer: 'Lorem Ipsum은 1500년대부터 디자인과 출판에서 사용된 더미 텍스트입니다. 디자이너가 읽을 수 있는 콘텐츠에 방해받지 않고 시각적 요소에 집중하는 데 도움이 됩니다.',
        },
        {
          question: '다른 형식으로 Lorem Ipsum을 생성할 수 있나요?',
          answer: '네, 단락, 문장, 단어 또는 목록을 생성할 수 있습니다. 일부 버전은 적절한 단락 태그가 있는 HTML 형식 출력도 지원합니다.',
        },
        {
          question: '생성된 텍스트는 정말 무작위인가요?',
          answer: 'Lorem Ipsum은 고전 라틴어 텍스트를 기반으로 한 반무작위 패턴을 따릅니다. 완전히 무작위는 아니지만 자연스러워 보이는 플레이스홀더 콘텐츠를 제공합니다.',
        },
        {
          question: 'Lorem Ipsum 출력을 사용자 정의할 수 있나요?',
          answer: '네, 정확한 콘텐츠 양을 지정하고 다양한 Lorem Ipsum 변형 중에서 선택할 수 있습니다.',
        },
      ],
      ar: [
        {
          question: 'كيف أولد نص Lorem Ipsum عبر الإنترنت؟',
          answer: 'حدد عدد الفقرات أو الجمل أو الكلمات التي تحتاجها، ثم انقر فوق توليد. سيتم إنشاء النص البديل على الفور.',
        },
        {
          question: 'ما هو Lorem Ipsum ولماذا يُستخدم؟',
          answer: 'Lorem Ipsum هو نص وهمي يُستخدم في التصميم والنشر منذ القرن السادس عشر. يساعد المصممين على التركيز على العناصر المرئية.',
        },
        {
          question: 'هل يمكنني توليد Lorem Ipsum بتنسيقات مختلفة؟',
          answer: 'نعم، يمكنك توليد فقرات أو جمل أو كلمات أو حتى قوائم. تدعم بعض الإصدارات أيضًا الإخراج بتنسيق HTML.',
        },
        {
          question: 'هل النص المولد عشوائي حقًا؟',
          answer: 'يتبع Lorem Ipsum نمطًا شبه عشوائي يعتمد على نص لاتيني كلاسيكي. على الرغم من أنه ليس عشوائيًا تمامًا، إلا أنه يوفر محتوى بديلاً ذو مظهر طبيعي.',
        },
        {
          question: 'هل يمكنني تخصيص إخراج Lorem Ipsum؟',
          answer: 'نعم، يمكنك تحديد الكمية الدقيقة من المحتوى والاختيار بين متغيرات Lorem Ipsum المختلفة.',
        },
      ],
    },
  },

  // 17. Cron Expression Generator
  {
    slug: 'cron-expression-generator',
    faqs: {
      en: [
        {
          question: 'How do I create a cron expression online?',
          answer: 'Use our visual interface to select the schedule frequency (minute, hour, day, month, weekday). The cron expression is generated automatically as you make selections.',
        },
        {
          question: 'What is a cron expression?',
          answer: 'A cron expression is a string of 5-6 fields that defines a schedule for running automated tasks. It specifies minute, hour, day of month, month, and day of week.',
        },
        {
          question: 'What is the format of a cron expression?',
          answer: 'Standard cron format: "minute hour day-of-month month day-of-week". For example, "0 9 * * 1" means every Monday at 9:00 AM.',
        },
        {
          question: 'Can I test if my cron expression is correct?',
          answer: 'Yes, our tool shows the next scheduled run times based on your expression. This helps verify the schedule matches your expectations.',
        },
        {
          question: 'What special characters can I use in cron?',
          answer: 'Common special characters: * (any value), , (list separator), - (range), / (step). For example, */15 means every 15 units, 1-5 means 1 through 5.',
        },
      ],
      zh: [
        {
          question: '如何在线创建 cron 表达式？',
          answer: '使用我们的可视化界面选择调度频率（分钟、小时、日、月、星期）。当您进行选择时，cron 表达式会自动生成。',
        },
        {
          question: '什么是 cron 表达式？',
          answer: 'cron 表达式是一个由 5-6 个字段组成的字符串，用于定义运行自动化任务的时间表。它指定分钟、小时、月中的日期、月份和星期几。',
        },
        {
          question: 'cron 表达式的格式是什么？',
          answer: '标准 cron 格式："分钟 小时 日 月 星期"。例如，"0 9 * * 1" 表示每周一上午 9:00。',
        },
        {
          question: '我可以测试 cron 表达式是否正确吗？',
          answer: '是的，我们的工具会根据您的表达式显示下一次计划运行时间。这有助于验证时间表是否符合您的预期。',
        },
        {
          question: '在 cron 中可以使用哪些特殊字符？',
          answer: '常见特殊字符：*（任意值）、,（列表分隔符）、-（范围）、/（步长）。例如，*/15 表示每 15 个单位，1-5 表示 1 到 5。',
        },
      ],
      es: [
        {
          question: '¿Cómo creo una expresión cron en línea?',
          answer: 'Use nuestra interfaz visual para seleccionar la frecuencia de programación. La expresión cron se genera automáticamente mientras hace selecciones.',
        },
        {
          question: '¿Qué es una expresión cron?',
          answer: 'Una expresión cron es una cadena de 5-6 campos que define un horario para ejecutar tareas automatizadas. Especifica minuto, hora, día del mes, mes y día de la semana.',
        },
        {
          question: '¿Cuál es el formato de una expresión cron?',
          answer: 'Formato cron estándar: "minuto hora día-del-mes mes día-de-la-semana". Por ejemplo, "0 9 * * 1" significa cada lunes a las 9:00 AM.',
        },
        {
          question: '¿Puedo probar si mi expresión cron es correcta?',
          answer: 'Sí, nuestra herramienta muestra los próximos tiempos de ejecución programados basados en su expresión.',
        },
        {
          question: '¿Qué caracteres especiales puedo usar en cron?',
          answer: 'Caracteres especiales comunes: * (cualquier valor), , (separador de lista), - (rango), / (paso). Por ejemplo, */15 significa cada 15 unidades.',
        },
      ],
      pt: [
        {
          question: 'Como crio uma expressão cron online?',
          answer: 'Use nossa interface visual para selecionar a frequência de agendamento. A expressão cron é gerada automaticamente conforme você faz seleções.',
        },
        {
          question: 'O que é uma expressão cron?',
          answer: 'Uma expressão cron é uma string de 5-6 campos que define um cronograma para executar tarefas automatizadas. Especifica minuto, hora, dia do mês, mês e dia da semana.',
        },
        {
          question: 'Qual é o formato de uma expressão cron?',
          answer: 'Formato cron padrão: "minuto hora dia-do-mês mês dia-da-semana". Por exemplo, "0 9 * * 1" significa toda segunda-feira às 9:00.',
        },
        {
          question: 'Posso testar se minha expressão cron está correta?',
          answer: 'Sim, nossa ferramenta mostra os próximos horários de execução programados com base na sua expressão.',
        },
        {
          question: 'Quais caracteres especiais posso usar no cron?',
          answer: 'Caracteres especiais comuns: * (qualquer valor), , (separador de lista), - (intervalo), / (passo). Por exemplo, */15 significa a cada 15 unidades.',
        },
      ],
      ja: [
        {
          question: 'cron式をオンラインで作成するには？',
          answer: 'ビジュアルインターフェースを使用してスケジュール頻度（分、時、日、月、曜日）を選択します。選択するとcron式が自動的に生成されます。',
        },
        {
          question: 'cron式とは何ですか？',
          answer: 'cron式は、自動化タスクを実行するスケジュールを定義する5-6フィールドの文字列です。分、時、日、月、曜日を指定します。',
        },
        {
          question: 'cron式のフォーマットは？',
          answer: '標準cronフォーマット：「分 時 日 月 曜日」。例えば、「0 9 * * 1」は毎週月曜日の午前9時を意味します。',
        },
        {
          question: 'cron式が正しいかテストできますか？',
          answer: 'はい、当ツールは式に基づいて次のスケジュール実行時間を表示します。',
        },
        {
          question: 'cronで使用できる特殊文字は？',
          answer: '一般的な特殊文字：*（任意の値）、,（リスト区切り）、-（範囲）、/（ステップ）。例えば、*/15は15単位ごとを意味します。',
        },
      ],
      ru: [
        {
          question: 'Как создать cron-выражение онлайн?',
          answer: 'Используйте наш визуальный интерфейс для выбора частоты расписания. Cron-выражение генерируется автоматически по мере выбора.',
        },
        {
          question: 'Что такое cron-выражение?',
          answer: 'Cron-выражение — это строка из 5-6 полей, определяющая расписание для запуска автоматизированных задач. Указывает минуту, час, день месяца, месяц и день недели.',
        },
        {
          question: 'Какой формат cron-выражения?',
          answer: 'Стандартный формат cron: «минута час день-месяца месяц день-недели». Например, «0 9 * * 1» означает каждый понедельник в 9:00.',
        },
        {
          question: 'Могу ли я проверить правильность моего cron-выражения?',
          answer: 'Да, наш инструмент показывает следующие запланированные времена запуска на основе вашего выражения.',
        },
        {
          question: 'Какие специальные символы можно использовать в cron?',
          answer: 'Распространенные специальные символы: * (любое значение), , (разделитель списка), - (диапазон), / (шаг). Например, */15 означает каждые 15 единиц.',
        },
      ],
      fr: [
        {
          question: 'Comment créer une expression cron en ligne ?',
          answer: 'Utilisez notre interface visuelle pour sélectionner la fréquence de planification. L\'expression cron est générée automatiquement au fur et à mesure de vos sélections.',
        },
        {
          question: 'Qu\'est-ce qu\'une expression cron ?',
          answer: 'Une expression cron est une chaîne de 5-6 champs qui définit un calendrier pour exécuter des tâches automatisées. Elle spécifie minute, heure, jour du mois, mois et jour de la semaine.',
        },
        {
          question: 'Quel est le format d\'une expression cron ?',
          answer: 'Format cron standard : « minute heure jour-du-mois mois jour-de-la-semaine ». Par exemple, « 0 9 * * 1 » signifie chaque lundi à 9h00.',
        },
        {
          question: 'Puis-je tester si mon expression cron est correcte ?',
          answer: 'Oui, notre outil affiche les prochaines heures d\'exécution planifiées basées sur votre expression.',
        },
        {
          question: 'Quels caractères spéciaux puis-je utiliser dans cron ?',
          answer: 'Caractères spéciaux courants : * (toute valeur), , (séparateur de liste), - (plage), / (pas). Par exemple, */15 signifie toutes les 15 unités.',
        },
      ],
      de: [
        {
          question: 'Wie erstelle ich einen Cron-Ausdruck online?',
          answer: 'Verwenden Sie unsere visuelle Oberfläche, um die Planungsfrequenz auszuwählen. Der Cron-Ausdruck wird automatisch generiert, während Sie Auswahlen treffen.',
        },
        {
          question: 'Was ist ein Cron-Ausdruck?',
          answer: 'Ein Cron-Ausdruck ist eine Zeichenfolge aus 5-6 Feldern, die einen Zeitplan für die Ausführung automatisierter Aufgaben definiert. Er gibt Minute, Stunde, Tag des Monats, Monat und Wochentag an.',
        },
        {
          question: 'Was ist das Format eines Cron-Ausdrucks?',
          answer: 'Standard-Cron-Format: „Minute Stunde Tag-des-Monats Monat Wochentag". Zum Beispiel bedeutet „0 9 * * 1" jeden Montag um 9:00 Uhr.',
        },
        {
          question: 'Kann ich testen, ob mein Cron-Ausdruck korrekt ist?',
          answer: 'Ja, unser Tool zeigt die nächsten geplanten Ausführungszeiten basierend auf Ihrem Ausdruck an.',
        },
        {
          question: 'Welche Sonderzeichen kann ich in Cron verwenden?',
          answer: 'Häufige Sonderzeichen: * (beliebiger Wert), , (Listentrennzeichen), - (Bereich), / (Schritt). Zum Beispiel bedeutet */15 alle 15 Einheiten.',
        },
      ],
      ko: [
        {
          question: 'cron 표현식을 온라인에서 만들려면?',
          answer: '시각적 인터페이스를 사용하여 일정 빈도(분, 시, 일, 월, 요일)를 선택하세요. 선택하면 cron 표현식이 자동으로 생성됩니다.',
        },
        {
          question: 'cron 표현식이란 무엇인가요?',
          answer: 'cron 표현식은 자동화된 작업을 실행하기 위한 일정을 정의하는 5-6개 필드의 문자열입니다. 분, 시, 일, 월, 요일을 지정합니다.',
        },
        {
          question: 'cron 표현식의 형식은?',
          answer: '표준 cron 형식: "분 시 일 월 요일". 예를 들어, "0 9 * * 1"은 매주 월요일 오전 9시를 의미합니다.',
        },
        {
          question: 'cron 표현식이 올바른지 테스트할 수 있나요?',
          answer: '네, 우리 도구는 표현식을 기반으로 다음 예정된 실행 시간을 표시합니다.',
        },
        {
          question: 'cron에서 사용할 수 있는 특수 문자는?',
          answer: '일반적인 특수 문자: *(모든 값), ,(목록 구분자), -(범위), /(단계). 예를 들어, */15는 15단위마다를 의미합니다.',
        },
      ],
      ar: [
        {
          question: 'كيف أنشئ تعبير cron عبر الإنترنت؟',
          answer: 'استخدم واجهتنا المرئية لتحديد تردد الجدولة. يتم إنشاء تعبير cron تلقائيًا أثناء إجراء التحديدات.',
        },
        {
          question: 'ما هو تعبير cron؟',
          answer: 'تعبير cron هو سلسلة من 5-6 حقول تحدد جدولاً لتشغيل المهام الآلية. يحدد الدقيقة والساعة ويوم الشهر والشهر ويوم الأسبوع.',
        },
        {
          question: 'ما هو تنسيق تعبير cron؟',
          answer: 'تنسيق cron القياسي: "دقيقة ساعة يوم-الشهر شهر يوم-الأسبوع". على سبيل المثال، "0 9 * * 1" يعني كل يوم اثنين الساعة 9:00 صباحًا.',
        },
        {
          question: 'هل يمكنني اختبار ما إذا كان تعبير cron صحيحًا؟',
          answer: 'نعم، تعرض أداتنا أوقات التشغيل المجدولة التالية بناءً على تعبيرك.',
        },
        {
          question: 'ما الأحرف الخاصة التي يمكنني استخدامها في cron؟',
          answer: 'الأحرف الخاصة الشائعة: * (أي قيمة)، , (فاصل قائمة)، - (نطاق)، / (خطوة). على سبيل المثال، */15 يعني كل 15 وحدة.',
        },
      ],
    },
  },
];
