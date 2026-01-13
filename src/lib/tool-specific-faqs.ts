/**
 * 热门工具专属 FAQ 配置
 * 为 Top 10 热门工具提供定制化的 FAQ 内容
 * 包含长尾关键词，支持 5 种语言
 */

import type { FAQItem } from './faq';
import { EXTRA_TOOL_FAQS } from './tool-specific-faqs-extra';
import { EXTRA_TOOL_FAQS_2 } from './tool-specific-faqs-extra-2';
import { GEO_TOOL_FAQS } from './tool-specific-faqs-geo';
import { GEO_TOOL_FAQS_2 } from './tool-specific-faqs-geo-2';
import { GEO_TOOL_FAQS_3 } from './tool-specific-faqs-geo-3';
import { GEO_TOOL_FAQS_4 } from './tool-specific-faqs-geo-4';
import { GEO_TOOL_FAQS_5 } from './tool-specific-faqs-geo-5';
import { GEO_TOOL_FAQS_6 } from './tool-specific-faqs-geo-6';
import { GEO_TOOL_FAQS_7 } from './tool-specific-faqs-geo-7';
import { GEO_TOOL_FAQS_8 } from './tool-specific-faqs-geo-8';
import { GEO_TOOL_FAQS_9 } from './tool-specific-faqs-geo-9';
import { GEO_TOOL_FAQS_10 } from './tool-specific-faqs-geo-10';
import { GEO_TOOL_FAQS_11 } from './tool-specific-faqs-geo-11';
import { GEO_TOOL_FAQS_12 } from './tool-specific-faqs-geo-12';
import { GEO_TOOL_FAQS_13 } from './tool-specific-faqs-geo-13';
import { GEO_TOOL_FAQS_14 } from './tool-specific-faqs-geo-14';
import { GEO_TOOL_FAQS_15 } from './tool-specific-faqs-geo-15';
import { GEO_TOOL_FAQS_16 } from './tool-specific-faqs-geo-16';
import { GEO_TOOL_FAQS_17 } from './tool-specific-faqs-geo-17';
import { GEO_TOOL_FAQS_18 } from './tool-specific-faqs-geo-18';
import { GEO_TOOL_FAQS_19 } from './tool-specific-faqs-geo-19';
import { GEO_TOOL_FAQS_20 } from './tool-specific-faqs-geo-20';
import { GEO_TOOL_FAQS_21 } from './tool-specific-faqs-geo-21';
import { GEO_TOOL_FAQS_22 } from './tool-specific-faqs-geo-22';
import { GEO_TOOL_FAQS_23 } from './tool-specific-faqs-geo-23';
import { GEO_TOOL_FAQS_24 } from './tool-specific-faqs-geo-24';
import { GEO_TOOL_FAQS_25 } from './tool-specific-faqs-geo-25';
import { GEO_TOOL_FAQS_26 } from './tool-specific-faqs-geo-26';
import { GEO_TOOL_FAQS_27 } from './tool-specific-faqs-geo-27';
import { GEO_TOOL_FAQS_28 } from './tool-specific-faqs-geo-28';
import { GEO_TOOL_FAQS_29 } from './tool-specific-faqs-geo-29';
import { GEO_TOOL_FAQS_30 } from './tool-specific-faqs-geo-30';
import { GEO_TOOL_FAQS_31 } from './tool-specific-faqs-geo-31';
import { GEO_TOOL_FAQS_32 } from './tool-specific-faqs-geo-32';
import { GEO_TOOL_FAQS_33 } from './tool-specific-faqs-geo-33';
import { GEO_TOOL_FAQS_34 } from './tool-specific-faqs-geo-34';
import { GEO_TOOL_FAQS_35 } from './tool-specific-faqs-geo-35';
import { GEO_TOOL_FAQS_36 } from './tool-specific-faqs-geo-36';
import { GEO_TOOL_FAQS_37 } from './tool-specific-faqs-geo-37';
import { GEO_TOOL_FAQS_38 } from './tool-specific-faqs-geo-38';
import { GEO_TOOL_FAQS_39 } from './tool-specific-faqs-geo-39';
import { GEO_TOOL_FAQS_40 } from './tool-specific-faqs-geo-40';
import { GEO_TOOL_FAQS_41 } from './tool-specific-faqs-geo-41';
import { GEO_TOOL_FAQS_42 } from './tool-specific-faqs-geo-42';
import { GEO_TOOL_FAQS_43 } from './tool-specific-faqs-geo-43';
import { GEO_TOOL_FAQS_44 } from './tool-specific-faqs-geo-44';
import { GEO_TOOL_FAQS_45 } from './tool-specific-faqs-geo-45';
import { GEO_TOOL_FAQS_46 } from './tool-specific-faqs-geo-46';
import { GEO_TOOL_FAQS_47 } from './tool-specific-faqs-geo-47';
import { GEO_TOOL_FAQS_48 } from './tool-specific-faqs-geo-48';
import { GEO_TOOL_FAQS_49 } from './tool-specific-faqs-geo-49';
import { GEO_TOOL_FAQS_50 } from './tool-specific-faqs-geo-50';
import { GEO_TOOL_FAQS_51 } from './tool-specific-faqs-geo-51';
import { GEO_TOOL_FAQS_52 } from './tool-specific-faqs-geo-52';
import { GEO_TOOL_FAQS_53 } from './tool-specific-faqs-geo-53';
import { GEO_TOOL_FAQS_54 } from './tool-specific-faqs-geo-54';
import { GEO_TOOL_FAQS_55 } from './tool-specific-faqs-geo-55';
import { GEO_TOOL_FAQS_56 } from './tool-specific-faqs-geo-56';
import { GEO_TOOL_FAQS_57 } from './tool-specific-faqs-geo-57';

// 工具专属 FAQ 配置接口
export interface ToolSpecificFAQ {
  slug: string;
  faqs: Record<string, FAQItem[]>;
}

// 热门工具专属 FAQ 配置（前 5 个工具）
const BASE_TOOL_FAQS: ToolSpecificFAQ[] = [
  // 1. JSON Formatter
  {
    slug: 'json-formatter',
    faqs: {
      en: [
        {
          question: 'How do I format JSON online for free?',
          answer: 'Simply paste your JSON data into the input field and click Format. Our free online JSON formatter will instantly beautify and validate your JSON with proper indentation. No registration or installation required.',
        },
        {
          question: 'What is JSON formatting and why is it important?',
          answer: 'JSON formatting transforms minified or messy JSON into a readable, properly indented structure. It helps developers debug APIs, validate data structures, and improve code readability. Well-formatted JSON is essential for code reviews and documentation.',
        },
        {
          question: 'Can I validate JSON syntax with this tool?',
          answer: 'Yes, our JSON formatter automatically validates your JSON syntax. If there are errors, it will highlight the exact line and character where the problem occurs, making it easy to fix syntax issues.',
        },
        {
          question: 'Is my JSON data safe when using this formatter?',
          answer: 'Absolutely. All JSON processing happens locally in your browser using JavaScript. Your data never leaves your device and is not sent to any server, ensuring complete privacy and security.',
        },
        {
          question: 'What is the maximum JSON file size I can format?',
          answer: 'Since processing happens entirely in your browser, there is no server-side limit. However, very large files (over 10MB) may affect browser performance. For optimal results, we recommend files under 5MB.',
        },
      ],
      zh: [
        {
          question: '如何免费在线格式化 JSON？',
          answer: '只需将 JSON 数据粘贴到输入框中，点击格式化按钮。我们的免费在线 JSON 格式化工具会立即美化并验证您的 JSON，添加正确的缩进。无需注册或安装。',
        },
        {
          question: '什么是 JSON 格式化，为什么它很重要？',
          answer: 'JSON 格式化将压缩或混乱的 JSON 转换为可读的、正确缩进的结构。它帮助开发者调试 API、验证数据结构并提高代码可读性。格式良好的 JSON 对于代码审查和文档至关重要。',
        },
        {
          question: '这个工具可以验证 JSON 语法吗？',
          answer: '是的，我们的 JSON 格式化工具会自动验证 JSON 语法。如果有错误，它会高亮显示问题发生的确切行和字符位置，方便您快速修复语法问题。',
        },
        {
          question: '使用此格式化工具时我的 JSON 数据安全吗？',
          answer: '绝对安全。所有 JSON 处理都使用 JavaScript 在浏览器本地进行。您的数据永远不会离开您的设备，也不会发送到任何服务器，确保完全的隐私和安全。',
        },
        {
          question: '我可以格式化多大的 JSON 文件？',
          answer: '由于处理完全在浏览器中进行，没有服务器端限制。但是，非常大的文件（超过 10MB）可能会影响浏览器性能。为获得最佳效果，建议文件大小在 5MB 以内。',
        },
      ],
      es: [
        {
          question: '¿Cómo formatear JSON en línea gratis?',
          answer: 'Simplemente pegue sus datos JSON en el campo de entrada y haga clic en Formatear. Nuestro formateador JSON en línea gratuito embellecerá y validará instantáneamente su JSON con la sangría adecuada.',
        },
        {
          question: '¿Qué es el formateo JSON y por qué es importante?',
          answer: 'El formateo JSON transforma JSON minificado o desordenado en una estructura legible y correctamente sangrada. Ayuda a los desarrolladores a depurar APIs, validar estructuras de datos y mejorar la legibilidad del código.',
        },
        {
          question: '¿Puedo validar la sintaxis JSON con esta herramienta?',
          answer: 'Sí, nuestro formateador JSON valida automáticamente la sintaxis de su JSON. Si hay errores, resaltará la línea y el carácter exactos donde ocurre el problema.',
        },
        {
          question: '¿Mis datos JSON están seguros al usar este formateador?',
          answer: 'Absolutamente. Todo el procesamiento JSON ocurre localmente en su navegador. Sus datos nunca salen de su dispositivo y no se envían a ningún servidor.',
        },
        {
          question: '¿Cuál es el tamaño máximo de archivo JSON que puedo formatear?',
          answer: 'Como el procesamiento ocurre completamente en su navegador, no hay límite del lado del servidor. Sin embargo, archivos muy grandes (más de 10MB) pueden afectar el rendimiento del navegador.',
        },
      ],
      pt: [
        {
          question: 'Como formatar JSON online gratuitamente?',
          answer: 'Basta colar seus dados JSON no campo de entrada e clicar em Formatar. Nosso formatador JSON online gratuito irá embelezar e validar instantaneamente seu JSON com a indentação adequada.',
        },
        {
          question: 'O que é formatação JSON e por que é importante?',
          answer: 'A formatação JSON transforma JSON minificado ou desorganizado em uma estrutura legível e corretamente indentada. Ajuda desenvolvedores a depurar APIs, validar estruturas de dados e melhorar a legibilidade do código.',
        },
        {
          question: 'Posso validar a sintaxe JSON com esta ferramenta?',
          answer: 'Sim, nosso formatador JSON valida automaticamente a sintaxe do seu JSON. Se houver erros, ele destacará a linha e o caractere exatos onde o problema ocorre.',
        },
        {
          question: 'Meus dados JSON estão seguros ao usar este formatador?',
          answer: 'Absolutamente. Todo o processamento JSON acontece localmente no seu navegador. Seus dados nunca saem do seu dispositivo e não são enviados para nenhum servidor.',
        },
        {
          question: 'Qual é o tamanho máximo de arquivo JSON que posso formatar?',
          answer: 'Como o processamento acontece inteiramente no seu navegador, não há limite do lado do servidor. No entanto, arquivos muito grandes (mais de 10MB) podem afetar o desempenho do navegador.',
        },
      ],
      ja: [
        {
          question: 'JSONを無料でオンラインフォーマットするには？',
          answer: 'JSONデータを入力フィールドに貼り付けて、フォーマットボタンをクリックするだけです。無料のオンラインJSONフォーマッターが、適切なインデントでJSONを即座に整形・検証します。',
        },
        {
          question: 'JSONフォーマットとは何ですか？なぜ重要ですか？',
          answer: 'JSONフォーマットは、圧縮された乱雑なJSONを読みやすく適切にインデントされた構造に変換します。開発者がAPIをデバッグし、データ構造を検証し、コードの可読性を向上させるのに役立ちます。',
        },
        {
          question: 'このツールでJSON構文を検証できますか？',
          answer: 'はい、JSONフォーマッターは自動的にJSON構文を検証します。エラーがある場合、問題が発生した正確な行と文字を強調表示します。',
        },
        {
          question: 'このフォーマッターを使用する際、JSONデータは安全ですか？',
          answer: 'はい、完全に安全です。すべてのJSON処理はブラウザ内でローカルに行われます。データがデバイスから離れることはなく、サーバーに送信されることもありません。',
        },
        {
          question: 'フォーマットできるJSONファイルの最大サイズは？',
          answer: '処理は完全にブラウザ内で行われるため、サーバー側の制限はありません。ただし、非常に大きなファイル（10MB以上）はブラウザのパフォーマンスに影響を与える可能性があります。',
        },
      ],
    },
  },

  // 2. Base64
  {
    slug: 'base64',
    faqs: {
      en: [
        {
          question: 'How do I encode text to Base64 online?',
          answer: 'Enter your text in the input field, select "Encode" mode, and click the Encode button. The Base64 encoded result will appear instantly. You can then copy it to your clipboard with one click.',
        },
        {
          question: 'How do I decode Base64 to text?',
          answer: 'Paste your Base64 string in the input field, select "Decode" mode, and click Decode. The original text will be revealed. This works for any valid Base64 encoded string.',
        },
        {
          question: 'What is Base64 encoding used for?',
          answer: 'Base64 encoding is commonly used to embed binary data in text-based formats like JSON, XML, or HTML. It\'s essential for email attachments (MIME), data URLs, API authentication tokens, and storing binary data in databases.',
        },
        {
          question: 'Is Base64 encoding the same as encryption?',
          answer: 'No, Base64 is an encoding scheme, not encryption. It transforms data into a different format but doesn\'t provide security. Anyone can decode Base64 data. For security, use proper encryption algorithms.',
        },
        {
          question: 'Can I encode files to Base64?',
          answer: 'Yes, you can encode images, PDFs, and other files to Base64. This is useful for embedding files directly in HTML/CSS or sending binary data through text-only channels.',
        },
      ],
      zh: [
        {
          question: '如何在线将文本编码为 Base64？',
          answer: '在输入框中输入文本，选择"编码"模式，然后点击编码按钮。Base64 编码结果会立即显示。您可以一键复制到剪贴板。',
        },
        {
          question: '如何将 Base64 解码为文本？',
          answer: '将 Base64 字符串粘贴到输入框中，选择"解码"模式，然后点击解码。原始文本将被还原。这适用于任何有效的 Base64 编码字符串。',
        },
        {
          question: 'Base64 编码有什么用途？',
          answer: 'Base64 编码常用于在 JSON、XML 或 HTML 等文本格式中嵌入二进制数据。它对于电子邮件附件（MIME）、数据 URL、API 认证令牌和在数据库中存储二进制数据至关重要。',
        },
        {
          question: 'Base64 编码和加密一样吗？',
          answer: '不，Base64 是一种编码方案，不是加密。它将数据转换为不同的格式，但不提供安全性。任何人都可以解码 Base64 数据。如需安全性，请使用正确的加密算法。',
        },
        {
          question: '我可以将文件编码为 Base64 吗？',
          answer: '是的，您可以将图片、PDF 和其他文件编码为 Base64。这对于直接在 HTML/CSS 中嵌入文件或通过纯文本通道发送二进制数据非常有用。',
        },
      ],
      es: [
        {
          question: '¿Cómo codifico texto a Base64 en línea?',
          answer: 'Ingrese su texto en el campo de entrada, seleccione el modo "Codificar" y haga clic en el botón Codificar. El resultado codificado en Base64 aparecerá instantáneamente.',
        },
        {
          question: '¿Cómo decodifico Base64 a texto?',
          answer: 'Pegue su cadena Base64 en el campo de entrada, seleccione el modo "Decodificar" y haga clic en Decodificar. El texto original será revelado.',
        },
        {
          question: '¿Para qué se usa la codificación Base64?',
          answer: 'La codificación Base64 se usa comúnmente para incrustar datos binarios en formatos basados en texto como JSON, XML o HTML. Es esencial para adjuntos de correo, URLs de datos y tokens de autenticación API.',
        },
        {
          question: '¿La codificación Base64 es lo mismo que el cifrado?',
          answer: 'No, Base64 es un esquema de codificación, no cifrado. Transforma datos a un formato diferente pero no proporciona seguridad. Cualquiera puede decodificar datos Base64.',
        },
        {
          question: '¿Puedo codificar archivos a Base64?',
          answer: 'Sí, puede codificar imágenes, PDFs y otros archivos a Base64. Esto es útil para incrustar archivos directamente en HTML/CSS.',
        },
      ],
      pt: [
        {
          question: 'Como codifico texto para Base64 online?',
          answer: 'Digite seu texto no campo de entrada, selecione o modo "Codificar" e clique no botão Codificar. O resultado codificado em Base64 aparecerá instantaneamente.',
        },
        {
          question: 'Como decodifico Base64 para texto?',
          answer: 'Cole sua string Base64 no campo de entrada, selecione o modo "Decodificar" e clique em Decodificar. O texto original será revelado.',
        },
        {
          question: 'Para que é usada a codificação Base64?',
          answer: 'A codificação Base64 é comumente usada para incorporar dados binários em formatos baseados em texto como JSON, XML ou HTML. É essencial para anexos de email, URLs de dados e tokens de autenticação API.',
        },
        {
          question: 'A codificação Base64 é o mesmo que criptografia?',
          answer: 'Não, Base64 é um esquema de codificação, não criptografia. Transforma dados em um formato diferente, mas não fornece segurança. Qualquer pessoa pode decodificar dados Base64.',
        },
        {
          question: 'Posso codificar arquivos para Base64?',
          answer: 'Sim, você pode codificar imagens, PDFs e outros arquivos para Base64. Isso é útil para incorporar arquivos diretamente em HTML/CSS.',
        },
      ],
      ja: [
        {
          question: 'テキストをBase64にオンラインでエンコードするには？',
          answer: '入力フィールドにテキストを入力し、「エンコード」モードを選択して、エンコードボタンをクリックします。Base64エンコードされた結果が即座に表示されます。',
        },
        {
          question: 'Base64をテキストにデコードするには？',
          answer: 'Base64文字列を入力フィールドに貼り付け、「デコード」モードを選択して、デコードをクリックします。元のテキストが表示されます。',
        },
        {
          question: 'Base64エンコードは何に使われますか？',
          answer: 'Base64エンコードは、JSON、XML、HTMLなどのテキストベースの形式にバイナリデータを埋め込むために一般的に使用されます。メール添付、データURL、API認証トークンに不可欠です。',
        },
        {
          question: 'Base64エンコードは暗号化と同じですか？',
          answer: 'いいえ、Base64はエンコード方式であり、暗号化ではありません。データを別の形式に変換しますが、セキュリティは提供しません。誰でもBase64データをデコードできます。',
        },
        {
          question: 'ファイルをBase64にエンコードできますか？',
          answer: 'はい、画像、PDF、その他のファイルをBase64にエンコードできます。HTML/CSSに直接ファイルを埋め込むのに便利です。',
        },
      ],
    },
  },

  // 3. UUID Generator
  {
    slug: 'uuid-generator',
    faqs: {
      en: [
        {
          question: 'How do I generate a UUID online?',
          answer: 'Click the Generate button to create a new UUID instantly. You can generate multiple UUIDs at once by adjusting the quantity setting. Each UUID is guaranteed to be unique.',
        },
        {
          question: 'What is a UUID and what is it used for?',
          answer: 'UUID (Universally Unique Identifier) is a 128-bit identifier used to uniquely identify information in computer systems. It\'s commonly used for database primary keys, session IDs, API keys, and distributed systems.',
        },
        {
          question: 'What is the difference between UUID v1 and UUID v4?',
          answer: 'UUID v1 is time-based and includes the MAC address, making it traceable. UUID v4 is randomly generated and provides better privacy. Most applications use UUID v4 for its simplicity and security.',
        },
        {
          question: 'Are generated UUIDs truly unique?',
          answer: 'Yes, UUID v4 uses cryptographically secure random numbers. The probability of generating duplicate UUIDs is astronomically low (about 1 in 2^122), making collisions practically impossible.',
        },
        {
          question: 'Can I generate UUIDs in bulk?',
          answer: 'Yes, our tool supports bulk UUID generation. You can generate up to 1000 UUIDs at once, perfect for database seeding, testing, or any scenario requiring multiple unique identifiers.',
        },
      ],
      zh: [
        {
          question: '如何在线生成 UUID？',
          answer: '点击生成按钮即可立即创建新的 UUID。您可以通过调整数量设置一次生成多个 UUID。每个 UUID 都保证是唯一的。',
        },
        {
          question: '什么是 UUID，它有什么用途？',
          answer: 'UUID（通用唯一标识符）是一个 128 位标识符，用于在计算机系统中唯一标识信息。它常用于数据库主键、会话 ID、API 密钥和分布式系统。',
        },
        {
          question: 'UUID v1 和 UUID v4 有什么区别？',
          answer: 'UUID v1 基于时间并包含 MAC 地址，可追踪。UUID v4 是随机生成的，提供更好的隐私保护。大多数应用程序使用 UUID v4，因为它简单且安全。',
        },
        {
          question: '生成的 UUID 真的是唯一的吗？',
          answer: '是的，UUID v4 使用加密安全的随机数。生成重复 UUID 的概率极低（约 1/2^122），使碰撞实际上不可能发生。',
        },
        {
          question: '我可以批量生成 UUID 吗？',
          answer: '是的，我们的工具支持批量 UUID 生成。您可以一次生成多达 1000 个 UUID，非常适合数据库填充、测试或任何需要多个唯一标识符的场景。',
        },
      ],
      es: [
        {
          question: '¿Cómo genero un UUID en línea?',
          answer: 'Haga clic en el botón Generar para crear un nuevo UUID instantáneamente. Puede generar múltiples UUIDs a la vez ajustando la configuración de cantidad.',
        },
        {
          question: '¿Qué es un UUID y para qué se usa?',
          answer: 'UUID (Identificador Único Universal) es un identificador de 128 bits usado para identificar información de manera única. Se usa comúnmente para claves primarias de bases de datos, IDs de sesión y claves API.',
        },
        {
          question: '¿Cuál es la diferencia entre UUID v1 y UUID v4?',
          answer: 'UUID v1 está basado en tiempo e incluye la dirección MAC. UUID v4 se genera aleatoriamente y proporciona mejor privacidad. La mayoría de aplicaciones usan UUID v4.',
        },
        {
          question: '¿Los UUIDs generados son realmente únicos?',
          answer: 'Sí, UUID v4 usa números aleatorios criptográficamente seguros. La probabilidad de generar UUIDs duplicados es astronómicamente baja.',
        },
        {
          question: '¿Puedo generar UUIDs en masa?',
          answer: 'Sí, nuestra herramienta soporta generación masiva de UUIDs. Puede generar hasta 1000 UUIDs a la vez.',
        },
      ],
      pt: [
        {
          question: 'Como gero um UUID online?',
          answer: 'Clique no botão Gerar para criar um novo UUID instantaneamente. Você pode gerar múltiplos UUIDs de uma vez ajustando a configuração de quantidade.',
        },
        {
          question: 'O que é um UUID e para que é usado?',
          answer: 'UUID (Identificador Único Universal) é um identificador de 128 bits usado para identificar informações de forma única. É comumente usado para chaves primárias de banco de dados, IDs de sessão e chaves API.',
        },
        {
          question: 'Qual é a diferença entre UUID v1 e UUID v4?',
          answer: 'UUID v1 é baseado em tempo e inclui o endereço MAC. UUID v4 é gerado aleatoriamente e fornece melhor privacidade. A maioria das aplicações usa UUID v4.',
        },
        {
          question: 'Os UUIDs gerados são realmente únicos?',
          answer: 'Sim, UUID v4 usa números aleatórios criptograficamente seguros. A probabilidade de gerar UUIDs duplicados é astronomicamente baixa.',
        },
        {
          question: 'Posso gerar UUIDs em massa?',
          answer: 'Sim, nossa ferramenta suporta geração em massa de UUIDs. Você pode gerar até 1000 UUIDs de uma vez.',
        },
      ],
      ja: [
        {
          question: 'UUIDをオンラインで生成するには？',
          answer: '生成ボタンをクリックすると、新しいUUIDが即座に作成されます。数量設定を調整することで、一度に複数のUUIDを生成できます。',
        },
        {
          question: 'UUIDとは何ですか？何に使われますか？',
          answer: 'UUID（汎用一意識別子）は、コンピュータシステムで情報を一意に識別するために使用される128ビットの識別子です。データベースの主キー、セッションID、APIキーに一般的に使用されます。',
        },
        {
          question: 'UUID v1とUUID v4の違いは？',
          answer: 'UUID v1は時間ベースでMACアドレスを含み、追跡可能です。UUID v4はランダムに生成され、より良いプライバシーを提供します。ほとんどのアプリケーションはUUID v4を使用します。',
        },
        {
          question: '生成されたUUIDは本当にユニークですか？',
          answer: 'はい、UUID v4は暗号学的に安全な乱数を使用します。重複UUIDが生成される確率は天文学的に低いです。',
        },
        {
          question: 'UUIDを一括生成できますか？',
          answer: 'はい、当ツールは一括UUID生成をサポートしています。一度に最大1000個のUUIDを生成できます。',
        },
      ],
    },
  },

  // 4. QR Generator
  {
    slug: 'qr-generator',
    faqs: {
      en: [
        {
          question: 'How do I create a QR code online for free?',
          answer: 'Enter your URL, text, or data in the input field and click Generate. Your QR code will be created instantly. You can customize colors, size, and error correction level before downloading.',
        },
        {
          question: 'What types of data can I encode in a QR code?',
          answer: 'You can encode URLs, plain text, email addresses, phone numbers, WiFi credentials, vCards, and more. QR codes can store up to 4,296 alphanumeric characters or 7,089 numeric characters.',
        },
        {
          question: 'What is QR code error correction and which level should I use?',
          answer: 'Error correction allows QR codes to be read even when partially damaged. Level L (7%) is for clean environments, M (15%) for general use, Q (25%) for outdoor use, and H (30%) for harsh conditions or when adding logos.',
        },
        {
          question: 'Can I add a logo to my QR code?',
          answer: 'Yes, you can add a logo to the center of your QR code. Use high error correction (H level) when adding logos to ensure the code remains scannable. Keep the logo size under 30% of the QR code area.',
        },
        {
          question: 'What format should I download my QR code in?',
          answer: 'PNG is best for web use and general purposes. SVG is ideal for print materials as it scales without losing quality. Choose based on your intended use case.',
        },
      ],
      zh: [
        {
          question: '如何免费在线创建二维码？',
          answer: '在输入框中输入您的 URL、文本或数据，然后点击生成。二维码将立即创建。您可以在下载前自定义颜色、大小和纠错级别。',
        },
        {
          question: '我可以在二维码中编码哪些类型的数据？',
          answer: '您可以编码 URL、纯文本、电子邮件地址、电话号码、WiFi 凭据、vCard 等。二维码最多可存储 4,296 个字母数字字符或 7,089 个数字字符。',
        },
        {
          question: '什么是二维码纠错，我应该使用哪个级别？',
          answer: '纠错允许二维码在部分损坏时仍可读取。L 级（7%）适用于干净环境，M 级（15%）适用于一般用途，Q 级（25%）适用于户外使用，H 级（30%）适用于恶劣条件或添加 Logo 时。',
        },
        {
          question: '我可以在二维码中添加 Logo 吗？',
          answer: '是的，您可以在二维码中心添加 Logo。添加 Logo 时请使用高纠错级别（H 级）以确保代码仍可扫描。Logo 大小应保持在二维码面积的 30% 以内。',
        },
        {
          question: '我应该以什么格式下载二维码？',
          answer: 'PNG 最适合网页使用和一般用途。SVG 非常适合印刷材料，因为它可以无损缩放。根据您的预期用途选择格式。',
        },
      ],
      es: [
        {
          question: '¿Cómo creo un código QR en línea gratis?',
          answer: 'Ingrese su URL, texto o datos en el campo de entrada y haga clic en Generar. Su código QR se creará instantáneamente. Puede personalizar colores, tamaño y nivel de corrección de errores.',
        },
        {
          question: '¿Qué tipos de datos puedo codificar en un código QR?',
          answer: 'Puede codificar URLs, texto plano, direcciones de correo, números de teléfono, credenciales WiFi, vCards y más. Los códigos QR pueden almacenar hasta 4,296 caracteres alfanuméricos.',
        },
        {
          question: '¿Qué es la corrección de errores del código QR?',
          answer: 'La corrección de errores permite que los códigos QR se lean incluso cuando están parcialmente dañados. Nivel L (7%) para ambientes limpios, M (15%) para uso general, Q (25%) para exteriores, H (30%) para condiciones difíciles.',
        },
        {
          question: '¿Puedo agregar un logo a mi código QR?',
          answer: 'Sí, puede agregar un logo al centro de su código QR. Use alta corrección de errores (nivel H) al agregar logos para asegurar que el código siga siendo escaneable.',
        },
        {
          question: '¿En qué formato debo descargar mi código QR?',
          answer: 'PNG es mejor para uso web y propósitos generales. SVG es ideal para materiales impresos ya que escala sin perder calidad.',
        },
      ],
      pt: [
        {
          question: 'Como crio um código QR online gratuitamente?',
          answer: 'Digite sua URL, texto ou dados no campo de entrada e clique em Gerar. Seu código QR será criado instantaneamente. Você pode personalizar cores, tamanho e nível de correção de erros.',
        },
        {
          question: 'Que tipos de dados posso codificar em um código QR?',
          answer: 'Você pode codificar URLs, texto simples, endereços de email, números de telefone, credenciais WiFi, vCards e mais. Códigos QR podem armazenar até 4.296 caracteres alfanuméricos.',
        },
        {
          question: 'O que é correção de erros do código QR?',
          answer: 'A correção de erros permite que códigos QR sejam lidos mesmo quando parcialmente danificados. Nível L (7%) para ambientes limpos, M (15%) para uso geral, Q (25%) para uso externo, H (30%) para condições adversas.',
        },
        {
          question: 'Posso adicionar um logo ao meu código QR?',
          answer: 'Sim, você pode adicionar um logo ao centro do seu código QR. Use alta correção de erros (nível H) ao adicionar logos para garantir que o código permaneça escaneável.',
        },
        {
          question: 'Em que formato devo baixar meu código QR?',
          answer: 'PNG é melhor para uso web e propósitos gerais. SVG é ideal para materiais impressos pois escala sem perder qualidade.',
        },
      ],
      ja: [
        {
          question: 'QRコードを無料でオンライン作成するには？',
          answer: '入力フィールドにURL、テキスト、またはデータを入力し、生成をクリックします。QRコードが即座に作成されます。ダウンロード前に色、サイズ、エラー訂正レベルをカスタマイズできます。',
        },
        {
          question: 'QRコードにどのような種類のデータをエンコードできますか？',
          answer: 'URL、プレーンテキスト、メールアドレス、電話番号、WiFi認証情報、vCardなどをエンコードできます。QRコードは最大4,296文字の英数字を保存できます。',
        },
        {
          question: 'QRコードのエラー訂正とは何ですか？',
          answer: 'エラー訂正により、部分的に損傷したQRコードでも読み取れます。Lレベル（7%）はきれいな環境用、M（15%）は一般用、Q（25%）は屋外用、H（30%）は過酷な条件やロゴ追加時用です。',
        },
        {
          question: 'QRコードにロゴを追加できますか？',
          answer: 'はい、QRコードの中央にロゴを追加できます。ロゴを追加する際は、コードがスキャン可能であることを確認するために高エラー訂正（Hレベル）を使用してください。',
        },
        {
          question: 'QRコードはどの形式でダウンロードすべきですか？',
          answer: 'PNGはウェブ使用や一般的な目的に最適です。SVGは品質を損なわずにスケーリングできるため、印刷物に最適です。',
        },
      ],
    },
  },

  // 5. Password Generator
  {
    slug: 'password-generator',
    faqs: {
      en: [
        {
          question: 'How do I generate a strong password online?',
          answer: 'Select your desired password length (12+ characters recommended), choose character types (uppercase, lowercase, numbers, symbols), and click Generate. A cryptographically secure random password will be created instantly.',
        },
        {
          question: 'What makes a password strong and secure?',
          answer: 'A strong password is at least 12 characters long, includes a mix of uppercase, lowercase, numbers, and symbols, avoids dictionary words and personal information, and is unique for each account.',
        },
        {
          question: 'Are the generated passwords truly random?',
          answer: 'Yes, our generator uses the Web Crypto API\'s cryptographically secure random number generator (CSPRNG), the same technology used by security professionals and financial institutions.',
        },
        {
          question: 'Is it safe to generate passwords online?',
          answer: 'Yes, with our tool. All password generation happens locally in your browser. No passwords are transmitted over the internet or stored on any server. Your passwords remain completely private.',
        },
        {
          question: 'How long should my password be?',
          answer: 'We recommend at least 12 characters for general accounts and 16+ characters for sensitive accounts like banking or email. Longer passwords are exponentially harder to crack.',
        },
      ],
      zh: [
        {
          question: '如何在线生成强密码？',
          answer: '选择所需的密码长度（建议 12 个以上字符），选择字符类型（大写、小写、数字、符号），然后点击生成。将立即创建一个加密安全的随机密码。',
        },
        {
          question: '什么样的密码才是强密码？',
          answer: '强密码至少 12 个字符长，包含大写、小写、数字和符号的混合，避免使用字典单词和个人信息，并且每个账户使用唯一密码。',
        },
        {
          question: '生成的密码真的是随机的吗？',
          answer: '是的，我们的生成器使用 Web Crypto API 的加密安全随机数生成器（CSPRNG），这与安全专业人员和金融机构使用的技术相同。',
        },
        {
          question: '在线生成密码安全吗？',
          answer: '使用我们的工具是安全的。所有密码生成都在浏览器本地进行。没有密码通过互联网传输或存储在任何服务器上。您的密码完全保密。',
        },
        {
          question: '我的密码应该多长？',
          answer: '我们建议一般账户至少 12 个字符，敏感账户（如银行或电子邮件）16 个以上字符。更长的密码破解难度呈指数级增长。',
        },
      ],
      es: [
        {
          question: '¿Cómo genero una contraseña segura en línea?',
          answer: 'Seleccione la longitud deseada (se recomiendan 12+ caracteres), elija tipos de caracteres (mayúsculas, minúsculas, números, símbolos) y haga clic en Generar. Se creará una contraseña aleatoria criptográficamente segura.',
        },
        {
          question: '¿Qué hace que una contraseña sea fuerte y segura?',
          answer: 'Una contraseña fuerte tiene al menos 12 caracteres, incluye una mezcla de mayúsculas, minúsculas, números y símbolos, evita palabras del diccionario e información personal, y es única para cada cuenta.',
        },
        {
          question: '¿Las contraseñas generadas son realmente aleatorias?',
          answer: 'Sí, nuestro generador usa el generador de números aleatorios criptográficamente seguro (CSPRNG) de la API Web Crypto, la misma tecnología usada por profesionales de seguridad.',
        },
        {
          question: '¿Es seguro generar contraseñas en línea?',
          answer: 'Sí, con nuestra herramienta. Toda la generación de contraseñas ocurre localmente en su navegador. Ninguna contraseña se transmite por internet o se almacena en ningún servidor.',
        },
        {
          question: '¿Qué longitud debe tener mi contraseña?',
          answer: 'Recomendamos al menos 12 caracteres para cuentas generales y 16+ caracteres para cuentas sensibles como banca o correo electrónico.',
        },
      ],
      pt: [
        {
          question: 'Como gero uma senha forte online?',
          answer: 'Selecione o comprimento desejado (12+ caracteres recomendados), escolha tipos de caracteres (maiúsculas, minúsculas, números, símbolos) e clique em Gerar. Uma senha aleatória criptograficamente segura será criada.',
        },
        {
          question: 'O que torna uma senha forte e segura?',
          answer: 'Uma senha forte tem pelo menos 12 caracteres, inclui uma mistura de maiúsculas, minúsculas, números e símbolos, evita palavras do dicionário e informações pessoais, e é única para cada conta.',
        },
        {
          question: 'As senhas geradas são realmente aleatórias?',
          answer: 'Sim, nosso gerador usa o gerador de números aleatórios criptograficamente seguro (CSPRNG) da API Web Crypto, a mesma tecnologia usada por profissionais de segurança.',
        },
        {
          question: 'É seguro gerar senhas online?',
          answer: 'Sim, com nossa ferramenta. Toda a geração de senhas acontece localmente no seu navegador. Nenhuma senha é transmitida pela internet ou armazenada em qualquer servidor.',
        },
        {
          question: 'Qual deve ser o comprimento da minha senha?',
          answer: 'Recomendamos pelo menos 12 caracteres para contas gerais e 16+ caracteres para contas sensíveis como banco ou email.',
        },
      ],
      ja: [
        {
          question: '強力なパスワードをオンラインで生成するには？',
          answer: '希望のパスワード長（12文字以上推奨）を選択し、文字タイプ（大文字、小文字、数字、記号）を選択して、生成をクリックします。暗号学的に安全なランダムパスワードが即座に作成されます。',
        },
        {
          question: '強力で安全なパスワードとは？',
          answer: '強力なパスワードは少なくとも12文字で、大文字、小文字、数字、記号を組み合わせ、辞書の単語や個人情報を避け、各アカウントで一意です。',
        },
        {
          question: '生成されたパスワードは本当にランダムですか？',
          answer: 'はい、当ジェネレーターはWeb Crypto APIの暗号学的に安全な乱数生成器（CSPRNG）を使用しています。これはセキュリティ専門家や金融機関が使用するのと同じ技術です。',
        },
        {
          question: 'オンラインでパスワードを生成するのは安全ですか？',
          answer: 'はい、当ツールでは安全です。すべてのパスワード生成はブラウザ内でローカルに行われます。パスワードがインターネット経由で送信されたり、サーバーに保存されることはありません。',
        },
        {
          question: 'パスワードはどのくらいの長さにすべきですか？',
          answer: '一般的なアカウントには少なくとも12文字、銀行やメールなどの機密性の高いアカウントには16文字以上をお勧めします。',
        },
      ],
    },
  },

];

// 合并所有工具的 FAQ 配置（包含额外 5 个工具）
export const TOOL_SPECIFIC_FAQS: ToolSpecificFAQ[] = [
  ...BASE_TOOL_FAQS,
  ...EXTRA_TOOL_FAQS,
  ...EXTRA_TOOL_FAQS_2,
  ...GEO_TOOL_FAQS,
  ...GEO_TOOL_FAQS_2,
  ...GEO_TOOL_FAQS_3,
  ...GEO_TOOL_FAQS_4,
  ...GEO_TOOL_FAQS_5,
  ...GEO_TOOL_FAQS_6,
  ...GEO_TOOL_FAQS_7,
  ...GEO_TOOL_FAQS_8,
  ...GEO_TOOL_FAQS_9,
  ...GEO_TOOL_FAQS_10,
  ...GEO_TOOL_FAQS_11,
  ...GEO_TOOL_FAQS_12,
  ...GEO_TOOL_FAQS_13,
  ...GEO_TOOL_FAQS_14,
  ...GEO_TOOL_FAQS_15,
  ...GEO_TOOL_FAQS_16,
  ...GEO_TOOL_FAQS_17,
  ...GEO_TOOL_FAQS_18,
  ...GEO_TOOL_FAQS_19,
  ...GEO_TOOL_FAQS_20,
  ...GEO_TOOL_FAQS_21,
  ...GEO_TOOL_FAQS_22,
  ...GEO_TOOL_FAQS_23,
  ...GEO_TOOL_FAQS_24,
  ...GEO_TOOL_FAQS_25,
  ...GEO_TOOL_FAQS_26,
  ...GEO_TOOL_FAQS_27,
  ...GEO_TOOL_FAQS_28,
  ...GEO_TOOL_FAQS_29,
  ...GEO_TOOL_FAQS_30,
  ...GEO_TOOL_FAQS_31,
  ...GEO_TOOL_FAQS_32,
  ...GEO_TOOL_FAQS_33,
  ...GEO_TOOL_FAQS_34,
  ...GEO_TOOL_FAQS_35,
  ...GEO_TOOL_FAQS_36,
  ...GEO_TOOL_FAQS_37,
  ...GEO_TOOL_FAQS_38,
  ...GEO_TOOL_FAQS_39,
  ...GEO_TOOL_FAQS_40,
  ...GEO_TOOL_FAQS_41,
  ...GEO_TOOL_FAQS_42,
  ...GEO_TOOL_FAQS_43,
  ...GEO_TOOL_FAQS_44,
  ...GEO_TOOL_FAQS_45,
  ...GEO_TOOL_FAQS_46,
  ...GEO_TOOL_FAQS_47,
  ...GEO_TOOL_FAQS_48,
  ...GEO_TOOL_FAQS_49,
  ...GEO_TOOL_FAQS_50,
  ...GEO_TOOL_FAQS_51,
  ...GEO_TOOL_FAQS_52,
  ...GEO_TOOL_FAQS_53,
  ...GEO_TOOL_FAQS_54,
  ...GEO_TOOL_FAQS_55,
  ...GEO_TOOL_FAQS_56,
  ...GEO_TOOL_FAQS_57,
];

/**
 * 获取工具专属 FAQ
 * @param slug - 工具 slug
 * @param locale - 语言代码
 * @returns FAQ 项目数组，如果没有专属 FAQ 则返回 null
 */
export function getToolSpecificFAQs(
  slug: string,
  locale: string
): import('./faq').FAQItem[] | null {
  const toolFaq = TOOL_SPECIFIC_FAQS.find(t => t.slug === slug);
  if (!toolFaq) return null;
  
  // 优先返回指定语言的 FAQ
  if (toolFaq.faqs[locale]) {
    return toolFaq.faqs[locale];
  }
  
  // 回退到英文
  if (toolFaq.faqs['en']) {
    return toolFaq.faqs['en'];
  }
  
  return null;
}

/**
 * 检查工具是否有专属 FAQ
 * @param slug - 工具 slug
 * @returns 是否有专属 FAQ
 */
export function hasToolSpecificFAQs(slug: string): boolean {
  return TOOL_SPECIFIC_FAQS.some(t => t.slug === slug);
}

/**
 * 获取所有有专属 FAQ 的工具 slug 列表
 * @returns 工具 slug 数组
 */
export function getToolsWithSpecificFAQs(): string[] {
  return TOOL_SPECIFIC_FAQS.map(t => t.slug);
}
