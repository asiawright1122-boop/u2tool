/**
 * 额外热门工具专属 FAQ 配置
 * 为 hash-generator, timestamp-converter, color-converter, url-encoder, jwt-decoder 提供 FAQ
 */

import type { ToolSpecificFAQ } from './tool-specific-faqs';

// 额外 5 个热门工具的 FAQ 配置
export const EXTRA_TOOL_FAQS: ToolSpecificFAQ[] = [
  // 6. Hash Generator
  {
    slug: 'hash-generator',
    faqs: {
      en: [
        {
          question: 'How do I generate MD5, SHA-1, or SHA-256 hash online?',
          answer: 'Enter your text in the input field and select the hash algorithm (MD5, SHA-1, SHA-256, SHA-512). Click Generate to instantly create the hash. You can copy the result with one click.',
        },
        {
          question: 'What is a hash and what is it used for?',
          answer: 'A hash is a fixed-size string generated from input data using a mathematical algorithm. It\'s used for password storage, data integrity verification, digital signatures, and file checksums.',
        },
        {
          question: 'Which hash algorithm should I use?',
          answer: 'For security purposes, use SHA-256 or SHA-512. MD5 and SHA-1 are considered weak for security but still useful for checksums. SHA-256 offers a good balance of security and performance.',
        },
        {
          question: 'Can I reverse a hash to get the original text?',
          answer: 'No, hash functions are one-way. You cannot reverse a hash to get the original input. This is by design for security. However, weak passwords can be found using rainbow tables or brute force.',
        },
        {
          question: 'Is my data safe when generating hashes online?',
          answer: 'Yes, all hash generation happens locally in your browser. Your data never leaves your device and is not sent to any server, ensuring complete privacy.',
        },
      ],
      zh: [
        {
          question: '如何在线生成 MD5、SHA-1 或 SHA-256 哈希？',
          answer: '在输入框中输入文本，选择哈希算法（MD5、SHA-1、SHA-256、SHA-512）。点击生成即可立即创建哈希值。您可以一键复制结果。',
        },
        {
          question: '什么是哈希，它有什么用途？',
          answer: '哈希是使用数学算法从输入数据生成的固定大小字符串。它用于密码存储、数据完整性验证、数字签名和文件校验。',
        },
        {
          question: '我应该使用哪种哈希算法？',
          answer: '出于安全目的，请使用 SHA-256 或 SHA-512。MD5 和 SHA-1 在安全性方面被认为较弱，但仍可用于校验和。SHA-256 在安全性和性能之间提供了良好的平衡。',
        },
        {
          question: '我可以反向解析哈希以获取原始文本吗？',
          answer: '不能，哈希函数是单向的。您无法反向解析哈希以获取原始输入。这是出于安全考虑的设计。但是，弱密码可以通过彩虹表或暴力破解找到。',
        },
        {
          question: '在线生成哈希时我的数据安全吗？',
          answer: '是的，所有哈希生成都在浏览器本地进行。您的数据永远不会离开您的设备，也不会发送到任何服务器，确保完全的隐私。',
        },
      ],
      es: [
        {
          question: '¿Cómo genero hash MD5, SHA-1 o SHA-256 en línea?',
          answer: 'Ingrese su texto en el campo de entrada y seleccione el algoritmo hash (MD5, SHA-1, SHA-256, SHA-512). Haga clic en Generar para crear el hash instantáneamente.',
        },
        {
          question: '¿Qué es un hash y para qué se usa?',
          answer: 'Un hash es una cadena de tamaño fijo generada a partir de datos de entrada usando un algoritmo matemático. Se usa para almacenamiento de contraseñas, verificación de integridad de datos y firmas digitales.',
        },
        {
          question: '¿Qué algoritmo hash debo usar?',
          answer: 'Para propósitos de seguridad, use SHA-256 o SHA-512. MD5 y SHA-1 se consideran débiles para seguridad pero útiles para checksums.',
        },
        {
          question: '¿Puedo revertir un hash para obtener el texto original?',
          answer: 'No, las funciones hash son unidireccionales. No puede revertir un hash para obtener la entrada original. Esto es por diseño para seguridad.',
        },
        {
          question: '¿Mis datos están seguros al generar hashes en línea?',
          answer: 'Sí, toda la generación de hash ocurre localmente en su navegador. Sus datos nunca salen de su dispositivo.',
        },
      ],
      pt: [
        {
          question: 'Como gero hash MD5, SHA-1 ou SHA-256 online?',
          answer: 'Digite seu texto no campo de entrada e selecione o algoritmo hash (MD5, SHA-1, SHA-256, SHA-512). Clique em Gerar para criar o hash instantaneamente.',
        },
        {
          question: 'O que é um hash e para que é usado?',
          answer: 'Um hash é uma string de tamanho fixo gerada a partir de dados de entrada usando um algoritmo matemático. É usado para armazenamento de senhas, verificação de integridade de dados e assinaturas digitais.',
        },
        {
          question: 'Qual algoritmo hash devo usar?',
          answer: 'Para fins de segurança, use SHA-256 ou SHA-512. MD5 e SHA-1 são considerados fracos para segurança, mas úteis para checksums.',
        },
        {
          question: 'Posso reverter um hash para obter o texto original?',
          answer: 'Não, funções hash são unidirecionais. Você não pode reverter um hash para obter a entrada original. Isso é por design para segurança.',
        },
        {
          question: 'Meus dados estão seguros ao gerar hashes online?',
          answer: 'Sim, toda a geração de hash acontece localmente no seu navegador. Seus dados nunca saem do seu dispositivo.',
        },
      ],
      ja: [
        {
          question: 'MD5、SHA-1、SHA-256ハッシュをオンラインで生成するには？',
          answer: '入力フィールドにテキストを入力し、ハッシュアルゴリズム（MD5、SHA-1、SHA-256、SHA-512）を選択します。生成をクリックすると即座にハッシュが作成されます。',
        },
        {
          question: 'ハッシュとは何ですか？何に使われますか？',
          answer: 'ハッシュは、数学的アルゴリズムを使用して入力データから生成される固定サイズの文字列です。パスワード保存、データ整合性検証、デジタル署名に使用されます。',
        },
        {
          question: 'どのハッシュアルゴリズムを使用すべきですか？',
          answer: 'セキュリティ目的にはSHA-256またはSHA-512を使用してください。MD5とSHA-1はセキュリティには弱いですが、チェックサムには有用です。',
        },
        {
          question: 'ハッシュを逆変換して元のテキストを取得できますか？',
          answer: 'いいえ、ハッシュ関数は一方向です。ハッシュを逆変換して元の入力を取得することはできません。これはセキュリティのための設計です。',
        },
        {
          question: 'オンラインでハッシュを生成する際、データは安全ですか？',
          answer: 'はい、すべてのハッシュ生成はブラウザ内でローカルに行われます。データがデバイスから離れることはありません。',
        },
      ],
    },
  },

  // 7. Timestamp Converter
  {
    slug: 'timestamp-converter',
    faqs: {
      en: [
        {
          question: 'How do I convert Unix timestamp to date online?',
          answer: 'Enter your Unix timestamp (seconds or milliseconds since 1970) in the input field. The tool will instantly convert it to a human-readable date and time in multiple formats.',
        },
        {
          question: 'What is a Unix timestamp?',
          answer: 'A Unix timestamp is the number of seconds (or milliseconds) that have elapsed since January 1, 1970 (UTC). It\'s a universal way to represent time in computing, independent of time zones.',
        },
        {
          question: 'How do I convert a date to Unix timestamp?',
          answer: 'Enter a date and time in the date picker or type it manually. The tool will convert it to Unix timestamp in both seconds and milliseconds format.',
        },
        {
          question: 'What is the difference between seconds and milliseconds timestamp?',
          answer: 'Seconds timestamp has 10 digits (e.g., 1703500800), while milliseconds has 13 digits (e.g., 1703500800000). JavaScript uses milliseconds, while many backend systems use seconds.',
        },
        {
          question: 'How do I handle timezone conversions?',
          answer: 'Unix timestamps are always in UTC. Our tool shows the converted time in your local timezone and UTC. You can also select specific timezones for conversion.',
        },
      ],
      zh: [
        {
          question: '如何在线将 Unix 时间戳转换为日期？',
          answer: '在输入框中输入 Unix 时间戳（自 1970 年以来的秒数或毫秒数）。工具会立即将其转换为多种格式的可读日期和时间。',
        },
        {
          question: '什么是 Unix 时间戳？',
          answer: 'Unix 时间戳是自 1970 年 1 月 1 日（UTC）以来经过的秒数（或毫秒数）。它是计算机中表示时间的通用方式，与时区无关。',
        },
        {
          question: '如何将日期转换为 Unix 时间戳？',
          answer: '在日期选择器中输入日期和时间，或手动输入。工具会将其转换为秒和毫秒格式的 Unix 时间戳。',
        },
        {
          question: '秒时间戳和毫秒时间戳有什么区别？',
          answer: '秒时间戳有 10 位数字（如 1703500800），毫秒有 13 位数字（如 1703500800000）。JavaScript 使用毫秒，而许多后端系统使用秒。',
        },
        {
          question: '如何处理时区转换？',
          answer: 'Unix 时间戳始终是 UTC。我们的工具会显示您本地时区和 UTC 的转换时间。您还可以选择特定时区进行转换。',
        },
      ],
      es: [
        {
          question: '¿Cómo convierto timestamp Unix a fecha en línea?',
          answer: 'Ingrese su timestamp Unix (segundos o milisegundos desde 1970) en el campo de entrada. La herramienta lo convertirá instantáneamente a fecha y hora legible.',
        },
        {
          question: '¿Qué es un timestamp Unix?',
          answer: 'Un timestamp Unix es el número de segundos (o milisegundos) transcurridos desde el 1 de enero de 1970 (UTC). Es una forma universal de representar el tiempo en computación.',
        },
        {
          question: '¿Cómo convierto una fecha a timestamp Unix?',
          answer: 'Ingrese una fecha y hora en el selector de fechas o escríbala manualmente. La herramienta la convertirá a timestamp Unix en formato de segundos y milisegundos.',
        },
        {
          question: '¿Cuál es la diferencia entre timestamp en segundos y milisegundos?',
          answer: 'El timestamp en segundos tiene 10 dígitos, mientras que en milisegundos tiene 13 dígitos. JavaScript usa milisegundos, mientras que muchos sistemas backend usan segundos.',
        },
        {
          question: '¿Cómo manejo las conversiones de zona horaria?',
          answer: 'Los timestamps Unix siempre están en UTC. Nuestra herramienta muestra el tiempo convertido en su zona horaria local y UTC.',
        },
      ],
      pt: [
        {
          question: 'Como converto timestamp Unix para data online?',
          answer: 'Digite seu timestamp Unix (segundos ou milissegundos desde 1970) no campo de entrada. A ferramenta converterá instantaneamente para data e hora legível.',
        },
        {
          question: 'O que é um timestamp Unix?',
          answer: 'Um timestamp Unix é o número de segundos (ou milissegundos) decorridos desde 1 de janeiro de 1970 (UTC). É uma forma universal de representar tempo em computação.',
        },
        {
          question: 'Como converto uma data para timestamp Unix?',
          answer: 'Digite uma data e hora no seletor de datas ou digite manualmente. A ferramenta converterá para timestamp Unix em formato de segundos e milissegundos.',
        },
        {
          question: 'Qual é a diferença entre timestamp em segundos e milissegundos?',
          answer: 'O timestamp em segundos tem 10 dígitos, enquanto em milissegundos tem 13 dígitos. JavaScript usa milissegundos, enquanto muitos sistemas backend usam segundos.',
        },
        {
          question: 'Como lido com conversões de fuso horário?',
          answer: 'Timestamps Unix estão sempre em UTC. Nossa ferramenta mostra o tempo convertido no seu fuso horário local e UTC.',
        },
      ],
      ja: [
        {
          question: 'Unixタイムスタンプを日付にオンラインで変換するには？',
          answer: '入力フィールドにUnixタイムスタンプ（1970年からの秒数またはミリ秒数）を入力します。ツールは即座に読みやすい日付と時刻に変換します。',
        },
        {
          question: 'Unixタイムスタンプとは何ですか？',
          answer: 'Unixタイムスタンプは、1970年1月1日（UTC）から経過した秒数（またはミリ秒数）です。タイムゾーンに依存しない、コンピューティングで時間を表す普遍的な方法です。',
        },
        {
          question: '日付をUnixタイムスタンプに変換するには？',
          answer: '日付ピッカーで日付と時刻を入力するか、手動で入力します。ツールは秒とミリ秒形式のUnixタイムスタンプに変換します。',
        },
        {
          question: '秒タイムスタンプとミリ秒タイムスタンプの違いは？',
          answer: '秒タイムスタンプは10桁、ミリ秒は13桁です。JavaScriptはミリ秒を使用し、多くのバックエンドシステムは秒を使用します。',
        },
        {
          question: 'タイムゾーン変換はどのように処理しますか？',
          answer: 'Unixタイムスタンプは常にUTCです。当ツールはローカルタイムゾーンとUTCで変換された時間を表示します。',
        },
      ],
    },
  },

  // 8. Color Converter
  {
    slug: 'color-converter',
    faqs: {
      en: [
        {
          question: 'How do I convert HEX to RGB color online?',
          answer: 'Enter your HEX color code (e.g., #FF5733 or FF5733) in the input field. The tool will instantly convert it to RGB, HSL, HSV, and other color formats.',
        },
        {
          question: 'What color formats are supported?',
          answer: 'Our tool supports HEX, RGB, RGBA, HSL, HSLA, HSV, CMYK, and named CSS colors. You can convert between any of these formats instantly.',
        },
        {
          question: 'How do I convert RGB to HEX?',
          answer: 'Enter your RGB values (e.g., rgb(255, 87, 51) or just 255, 87, 51). The tool will convert it to HEX and all other supported formats automatically.',
        },
        {
          question: 'What is the difference between RGB and HSL?',
          answer: 'RGB (Red, Green, Blue) defines colors by mixing light. HSL (Hue, Saturation, Lightness) is more intuitive for humans, making it easier to adjust colors by changing brightness or saturation.',
        },
        {
          question: 'Can I pick colors visually?',
          answer: 'Yes, use our color picker to select colors visually. Click anywhere on the color palette to pick a color, and all format conversions will update automatically.',
        },
      ],
      zh: [
        {
          question: '如何在线将 HEX 转换为 RGB 颜色？',
          answer: '在输入框中输入 HEX 颜色代码（如 #FF5733 或 FF5733）。工具会立即将其转换为 RGB、HSL、HSV 和其他颜色格式。',
        },
        {
          question: '支持哪些颜色格式？',
          answer: '我们的工具支持 HEX、RGB、RGBA、HSL、HSLA、HSV、CMYK 和 CSS 命名颜色。您可以在这些格式之间即时转换。',
        },
        {
          question: '如何将 RGB 转换为 HEX？',
          answer: '输入 RGB 值（如 rgb(255, 87, 51) 或 255, 87, 51）。工具会自动将其转换为 HEX 和所有其他支持的格式。',
        },
        {
          question: 'RGB 和 HSL 有什么区别？',
          answer: 'RGB（红、绿、蓝）通过混合光来定义颜色。HSL（色相、饱和度、亮度）对人类更直观，更容易通过改变亮度或饱和度来调整颜色。',
        },
        {
          question: '我可以可视化选择颜色吗？',
          answer: '是的，使用我们的颜色选择器可视化选择颜色。点击调色板上的任意位置选择颜色，所有格式转换都会自动更新。',
        },
      ],
      es: [
        {
          question: '¿Cómo convierto HEX a RGB en línea?',
          answer: 'Ingrese su código de color HEX (ej. #FF5733 o FF5733) en el campo de entrada. La herramienta lo convertirá instantáneamente a RGB, HSL, HSV y otros formatos.',
        },
        {
          question: '¿Qué formatos de color son compatibles?',
          answer: 'Nuestra herramienta soporta HEX, RGB, RGBA, HSL, HSLA, HSV, CMYK y colores CSS nombrados. Puede convertir entre cualquiera de estos formatos.',
        },
        {
          question: '¿Cómo convierto RGB a HEX?',
          answer: 'Ingrese sus valores RGB (ej. rgb(255, 87, 51) o 255, 87, 51). La herramienta lo convertirá a HEX y todos los demás formatos automáticamente.',
        },
        {
          question: '¿Cuál es la diferencia entre RGB y HSL?',
          answer: 'RGB define colores mezclando luz. HSL es más intuitivo para humanos, facilitando ajustar colores cambiando brillo o saturación.',
        },
        {
          question: '¿Puedo seleccionar colores visualmente?',
          answer: 'Sí, use nuestro selector de colores para elegir colores visualmente. Haga clic en cualquier lugar de la paleta para seleccionar un color.',
        },
      ],
      pt: [
        {
          question: 'Como converto HEX para RGB online?',
          answer: 'Digite seu código de cor HEX (ex. #FF5733 ou FF5733) no campo de entrada. A ferramenta converterá instantaneamente para RGB, HSL, HSV e outros formatos.',
        },
        {
          question: 'Quais formatos de cor são suportados?',
          answer: 'Nossa ferramenta suporta HEX, RGB, RGBA, HSL, HSLA, HSV, CMYK e cores CSS nomeadas. Você pode converter entre qualquer um desses formatos.',
        },
        {
          question: 'Como converto RGB para HEX?',
          answer: 'Digite seus valores RGB (ex. rgb(255, 87, 51) ou 255, 87, 51). A ferramenta converterá para HEX e todos os outros formatos automaticamente.',
        },
        {
          question: 'Qual é a diferença entre RGB e HSL?',
          answer: 'RGB define cores misturando luz. HSL é mais intuitivo para humanos, facilitando ajustar cores alterando brilho ou saturação.',
        },
        {
          question: 'Posso selecionar cores visualmente?',
          answer: 'Sim, use nosso seletor de cores para escolher cores visualmente. Clique em qualquer lugar da paleta para selecionar uma cor.',
        },
      ],
      ja: [
        {
          question: 'HEXをRGBにオンラインで変換するには？',
          answer: '入力フィールドにHEXカラーコード（例：#FF5733またはFF5733）を入力します。ツールは即座にRGB、HSL、HSVなどの形式に変換します。',
        },
        {
          question: 'どのカラー形式がサポートされていますか？',
          answer: '当ツールはHEX、RGB、RGBA、HSL、HSLA、HSV、CMYK、CSS名前付きカラーをサポートしています。これらの形式間で即座に変換できます。',
        },
        {
          question: 'RGBをHEXに変換するには？',
          answer: 'RGB値（例：rgb(255, 87, 51)または255, 87, 51）を入力します。ツールは自動的にHEXと他のすべての形式に変換します。',
        },
        {
          question: 'RGBとHSLの違いは何ですか？',
          answer: 'RGBは光を混ぜて色を定義します。HSLは人間にとってより直感的で、明るさや彩度を変更して色を調整しやすくなっています。',
        },
        {
          question: '視覚的に色を選択できますか？',
          answer: 'はい、カラーピッカーを使用して視覚的に色を選択できます。パレット上の任意の場所をクリックして色を選択すると、すべての形式変換が自動的に更新されます。',
        },
      ],
    },
  },

  // 9. URL Encoder
  {
    slug: 'url-encoder',
    faqs: {
      en: [
        {
          question: 'How do I URL encode text online?',
          answer: 'Paste your text in the input field and click Encode. Special characters will be converted to percent-encoded format (e.g., space becomes %20). This makes text safe for use in URLs.',
        },
        {
          question: 'What is URL encoding and why is it needed?',
          answer: 'URL encoding converts special characters to a format safe for URLs. Characters like spaces, &, =, and non-ASCII characters must be encoded to be transmitted correctly in web addresses.',
        },
        {
          question: 'How do I decode a URL-encoded string?',
          answer: 'Paste the encoded string (containing %XX sequences) in the input field and click Decode. The tool will convert it back to the original readable text.',
        },
        {
          question: 'What is the difference between encodeURI and encodeURIComponent?',
          answer: 'encodeURI encodes a complete URL, preserving characters like : / ? & =. encodeURIComponent encodes everything except letters, digits, and - _ . ~, suitable for encoding URL parameters.',
        },
        {
          question: 'Can I encode special characters like Chinese or emoji?',
          answer: 'Yes, our tool fully supports Unicode characters including Chinese, Japanese, Korean, emoji, and other special characters. They will be properly percent-encoded using UTF-8.',
        },
      ],
      zh: [
        {
          question: '如何在线进行 URL 编码？',
          answer: '将文本粘贴到输入框中，点击编码。特殊字符将被转换为百分号编码格式（如空格变为 %20）。这使文本可以安全地用于 URL。',
        },
        {
          question: '什么是 URL 编码，为什么需要它？',
          answer: 'URL 编码将特殊字符转换为 URL 安全的格式。空格、&、= 和非 ASCII 字符等必须编码才能在网址中正确传输。',
        },
        {
          question: '如何解码 URL 编码的字符串？',
          answer: '将编码字符串（包含 %XX 序列）粘贴到输入框中，点击解码。工具会将其转换回原始可读文本。',
        },
        {
          question: 'encodeURI 和 encodeURIComponent 有什么区别？',
          answer: 'encodeURI 编码完整 URL，保留 : / ? & = 等字符。encodeURIComponent 编码除字母、数字和 - _ . ~ 之外的所有内容，适合编码 URL 参数。',
        },
        {
          question: '可以编码中文或表情符号等特殊字符吗？',
          answer: '是的，我们的工具完全支持 Unicode 字符，包括中文、日文、韩文、表情符号和其他特殊字符。它们将使用 UTF-8 正确进行百分号编码。',
        },
      ],
      es: [
        {
          question: '¿Cómo codifico URL en línea?',
          answer: 'Pegue su texto en el campo de entrada y haga clic en Codificar. Los caracteres especiales se convertirán a formato codificado (ej. espacio se convierte en %20).',
        },
        {
          question: '¿Qué es la codificación URL y por qué es necesaria?',
          answer: 'La codificación URL convierte caracteres especiales a un formato seguro para URLs. Caracteres como espacios, &, = y caracteres no ASCII deben codificarse.',
        },
        {
          question: '¿Cómo decodifico una cadena codificada en URL?',
          answer: 'Pegue la cadena codificada (con secuencias %XX) en el campo de entrada y haga clic en Decodificar. La herramienta la convertirá al texto original.',
        },
        {
          question: '¿Cuál es la diferencia entre encodeURI y encodeURIComponent?',
          answer: 'encodeURI codifica una URL completa, preservando caracteres como : / ? & =. encodeURIComponent codifica todo excepto letras, dígitos y - _ . ~',
        },
        {
          question: '¿Puedo codificar caracteres especiales como chino o emoji?',
          answer: 'Sí, nuestra herramienta soporta completamente caracteres Unicode incluyendo chino, japonés, coreano, emoji y otros caracteres especiales.',
        },
      ],
      pt: [
        {
          question: 'Como codifico URL online?',
          answer: 'Cole seu texto no campo de entrada e clique em Codificar. Caracteres especiais serão convertidos para formato codificado (ex. espaço se torna %20).',
        },
        {
          question: 'O que é codificação URL e por que é necessária?',
          answer: 'A codificação URL converte caracteres especiais para um formato seguro para URLs. Caracteres como espaços, &, = e caracteres não ASCII devem ser codificados.',
        },
        {
          question: 'Como decodifico uma string codificada em URL?',
          answer: 'Cole a string codificada (com sequências %XX) no campo de entrada e clique em Decodificar. A ferramenta converterá para o texto original.',
        },
        {
          question: 'Qual é a diferença entre encodeURI e encodeURIComponent?',
          answer: 'encodeURI codifica uma URL completa, preservando caracteres como : / ? & =. encodeURIComponent codifica tudo exceto letras, dígitos e - _ . ~',
        },
        {
          question: 'Posso codificar caracteres especiais como chinês ou emoji?',
          answer: 'Sim, nossa ferramenta suporta totalmente caracteres Unicode incluindo chinês, japonês, coreano, emoji e outros caracteres especiais.',
        },
      ],
      ja: [
        {
          question: 'URLエンコードをオンラインで行うには？',
          answer: '入力フィールドにテキストを貼り付けて、エンコードをクリックします。特殊文字はパーセントエンコード形式に変換されます（例：スペースは%20になります）。',
        },
        {
          question: 'URLエンコードとは何ですか？なぜ必要ですか？',
          answer: 'URLエンコードは特殊文字をURL安全な形式に変換します。スペース、&、=、非ASCII文字などはWebアドレスで正しく送信するためにエンコードする必要があります。',
        },
        {
          question: 'URLエンコードされた文字列をデコードするには？',
          answer: 'エンコードされた文字列（%XXシーケンスを含む）を入力フィールドに貼り付けて、デコードをクリックします。ツールは元の読みやすいテキストに変換します。',
        },
        {
          question: 'encodeURIとencodeURIComponentの違いは？',
          answer: 'encodeURIは完全なURLをエンコードし、: / ? & =などの文字を保持します。encodeURIComponentは文字、数字、- _ . ~以外のすべてをエンコードします。',
        },
        {
          question: '中国語や絵文字などの特殊文字をエンコードできますか？',
          answer: 'はい、当ツールは中国語、日本語、韓国語、絵文字、その他の特殊文字を含むUnicode文字を完全にサポートしています。',
        },
      ],
    },
  },

  // 10. JWT Decoder
  {
    slug: 'jwt-decoder',
    faqs: {
      en: [
        {
          question: 'How do I decode a JWT token online?',
          answer: 'Paste your JWT token in the input field. The tool will instantly decode and display the header, payload, and signature. No server processing - everything happens in your browser.',
        },
        {
          question: 'What is a JWT and what is it used for?',
          answer: 'JWT (JSON Web Token) is a compact, URL-safe token format for securely transmitting information. It\'s commonly used for authentication, authorization, and information exchange in web applications.',
        },
        {
          question: 'What are the three parts of a JWT?',
          answer: 'A JWT has three parts separated by dots: Header (algorithm and token type), Payload (claims/data), and Signature (verification). Our tool decodes and displays each part clearly.',
        },
        {
          question: 'Can I verify JWT signatures with this tool?',
          answer: 'Our tool decodes and displays JWT contents. For signature verification, you need the secret key or public key. We show the signature but don\'t verify it to protect your security.',
        },
        {
          question: 'Is it safe to decode JWTs online?',
          answer: 'Yes, with our tool. All decoding happens locally in your browser using JavaScript. Your token never leaves your device. However, never share production tokens publicly.',
        },
      ],
      zh: [
        {
          question: '如何在线解码 JWT 令牌？',
          answer: '将 JWT 令牌粘贴到输入框中。工具会立即解码并显示头部、载荷和签名。无需服务器处理 - 一切都在浏览器中进行。',
        },
        {
          question: '什么是 JWT，它有什么用途？',
          answer: 'JWT（JSON Web Token）是一种紧凑的、URL 安全的令牌格式，用于安全传输信息。它常用于 Web 应用程序中的身份验证、授权和信息交换。',
        },
        {
          question: 'JWT 的三个部分是什么？',
          answer: 'JWT 有三个由点分隔的部分：头部（算法和令牌类型）、载荷（声明/数据）和签名（验证）。我们的工具会清晰地解码和显示每个部分。',
        },
        {
          question: '这个工具可以验证 JWT 签名吗？',
          answer: '我们的工具解码并显示 JWT 内容。签名验证需要密钥或公钥。我们显示签名但不验证它，以保护您的安全。',
        },
        {
          question: '在线解码 JWT 安全吗？',
          answer: '使用我们的工具是安全的。所有解码都使用 JavaScript 在浏览器本地进行。您的令牌永远不会离开您的设备。但是，切勿公开分享生产环境的令牌。',
        },
      ],
      es: [
        {
          question: '¿Cómo decodifico un token JWT en línea?',
          answer: 'Pegue su token JWT en el campo de entrada. La herramienta decodificará y mostrará instantáneamente el encabezado, payload y firma. Todo ocurre en su navegador.',
        },
        {
          question: '¿Qué es un JWT y para qué se usa?',
          answer: 'JWT (JSON Web Token) es un formato de token compacto y seguro para URLs para transmitir información de forma segura. Se usa comúnmente para autenticación y autorización.',
        },
        {
          question: '¿Cuáles son las tres partes de un JWT?',
          answer: 'Un JWT tiene tres partes separadas por puntos: Encabezado (algoritmo y tipo), Payload (claims/datos) y Firma (verificación). Nuestra herramienta decodifica cada parte.',
        },
        {
          question: '¿Puedo verificar firmas JWT con esta herramienta?',
          answer: 'Nuestra herramienta decodifica y muestra el contenido JWT. Para verificar firmas, necesita la clave secreta o pública. Mostramos la firma pero no la verificamos.',
        },
        {
          question: '¿Es seguro decodificar JWTs en línea?',
          answer: 'Sí, con nuestra herramienta. Toda la decodificación ocurre localmente en su navegador. Su token nunca sale de su dispositivo.',
        },
      ],
      pt: [
        {
          question: 'Como decodifico um token JWT online?',
          answer: 'Cole seu token JWT no campo de entrada. A ferramenta decodificará e exibirá instantaneamente o cabeçalho, payload e assinatura. Tudo acontece no seu navegador.',
        },
        {
          question: 'O que é um JWT e para que é usado?',
          answer: 'JWT (JSON Web Token) é um formato de token compacto e seguro para URLs para transmitir informações com segurança. É comumente usado para autenticação e autorização.',
        },
        {
          question: 'Quais são as três partes de um JWT?',
          answer: 'Um JWT tem três partes separadas por pontos: Cabeçalho (algoritmo e tipo), Payload (claims/dados) e Assinatura (verificação). Nossa ferramenta decodifica cada parte.',
        },
        {
          question: 'Posso verificar assinaturas JWT com esta ferramenta?',
          answer: 'Nossa ferramenta decodifica e exibe o conteúdo JWT. Para verificar assinaturas, você precisa da chave secreta ou pública. Mostramos a assinatura mas não a verificamos.',
        },
        {
          question: 'É seguro decodificar JWTs online?',
          answer: 'Sim, com nossa ferramenta. Toda a decodificação acontece localmente no seu navegador. Seu token nunca sai do seu dispositivo.',
        },
      ],
      ja: [
        {
          question: 'JWTトークンをオンラインでデコードするには？',
          answer: '入力フィールドにJWTトークンを貼り付けます。ツールは即座にヘッダー、ペイロード、署名をデコードして表示します。サーバー処理なし - すべてブラウザ内で行われます。',
        },
        {
          question: 'JWTとは何ですか？何に使われますか？',
          answer: 'JWT（JSON Web Token）は、情報を安全に送信するためのコンパクトでURL安全なトークン形式です。Webアプリケーションでの認証、認可、情報交換に一般的に使用されます。',
        },
        {
          question: 'JWTの3つの部分は何ですか？',
          answer: 'JWTはドットで区切られた3つの部分があります：ヘッダー（アルゴリズムとトークンタイプ）、ペイロード（クレーム/データ）、署名（検証）。当ツールは各部分を明確にデコードして表示します。',
        },
        {
          question: 'このツールでJWT署名を検証できますか？',
          answer: '当ツールはJWTの内容をデコードして表示します。署名検証には秘密鍵または公開鍵が必要です。セキュリティを保護するため、署名は表示しますが検証しません。',
        },
        {
          question: 'オンラインでJWTをデコードするのは安全ですか？',
          answer: 'はい、当ツールでは安全です。すべてのデコードはJavaScriptを使用してブラウザ内でローカルに行われます。トークンがデバイスから離れることはありません。',
        },
      ],
    },
  },
];
