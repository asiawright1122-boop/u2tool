// generate-crypto-translations.mjs
import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

const translations = {
  zh: {
    title: '开发者密码学与哈希工具箱',
    subtitle: '瑞士私银级哑光暗金本地算法精算大屏',
    hashTab: '哈希算法 (Hash)',
    bcryptTab: '密码哈希 (bcrypt)',
    aesTab: '对称加密 (AES)',
    rsaTab: '非对称加密 (RSA)',
    benchmarkTab: '性能跑分 (Benchmark)',
    inputLabel: '原始明文输入 (Input String)',
    inputPlaceholder: '在此处输入您需要进行密码学处理的明文数据...',
    md5Label: 'MD5 哈希值',
    sha256Label: 'SHA-256 安全哈希',
    copy: '复制',
    copied: '已复制',
    bcryptCost: '计算成本 (Cost Rounds)',
    bcryptGenerate: '生成 bcrypt 哈希',
    bcryptVerifyTab: '验证哈希',
    bcryptVerifyBtn: '校验密码匹配性',
    bcryptResult: '密码与哈希匹配状态',
    aesKey: '256位密钥 (HEX 或 Base64)',
    aesEncrypt: 'AES 加密 (Encrypt)',
    aesDecrypt: 'AES 解密 (Decrypt)',
    aesOutput: '密文输出 (Ciphertext)',
    rsaGenerate: '生成 2048-bit 密钥对',
    rsaKeyPair: 'RSA 密钥对 (PEM 格式)',
    rsaSign: '数字签名 (Sign)',
    rsaVerify: '验证签名 (Verify)',
    runBenchmark: '启动算法性能跑分',
    benchmarkDesc: '测试各加密算法在当前输入下的处理耗时（微秒/μs，值越低性能越好）',
    matching: '匹配成功',
    notMatching: '匹配失败',
    verifyResultSuccess: '数字签名校验成功！数据完整且未被篡改。',
    verifyResultFail: '数字签名校验失败！签名无效或密钥不匹配。',
    decryptedOutput: '解密输出 (Decrypted)',
    rsaKeyManager: 'RSA-2048 密钥对管理器',
    generating: '生成中...',
    publicKeyLabel: '公钥 (Public Key SPKI/PEM):',
    privateKeyLabel: '私钥 (Private Key PKCS8/PEM):',
    noKeyGenerated: '暂未生成密钥对。',
    rsaSignVerifyIsland: '数字签名与验证模块',
    signPayloadBtn: '使用私钥对数据进行签名',
    payloadToVerify: '待验证数据 (Payload):',
    signatureHex: '数字签名 (Hex Signature):',
    verifySignatureBtn: '验证签名有效性',
    performanceBenchmarking: '算法性能实时跑分评测',
    benchmarkingAlgorithms: '跑分计算中...',
    generator: '生成器',
    hashOutput: '哈希密文输出:',
    clickToGenerate: '请点击上方按钮生成...',
    verifyPassword: '校验密码:',
    verifyHash: '校验哈希:',
    plaintextPayload: '明文负荷数据 (Plaintext)',
    detailed_description: '开发者密码学与哈希工具箱 —— 本地高性能哈希生成与对称/非对称加密精算套件，配备动态微秒级性能跑分图表大屏。支持MD5、SHA256、bcrypt、AES和RSA签名算法。',
    usage_steps: [
      '在输入区域输入需要加密的原始文本',
      '选择要执行的密码学算法（如 AES、RSA 或 bcrypt）',
      '根据需要输入密钥或点击生成 2048位 RSA 密钥对',
      '查看并复制处理后得到的密文、哈希值或跑分测试图表'
    ],
    usage_examples: [
      '日常开发对特定密码进行本地安全 bcrypt 快速哈希和验证',
      '为文本数据生成防篡改的 SHA-256 指纹或数字签名',
      '对比各种本地密码学算法在不同数据荷载下的微秒级性能'
    ],
    faqs: [
      {
        question: '此密码学工具箱是否收费？',
        answer: '不收费。工具箱完全在浏览器本地无限制运行，无任何计费要求。'
      },
      {
        question: '输入的数据会被上传到服务器吗？',
        answer: '绝对不会。所有的加密、解密、签名及跑分计算均在您浏览器本地通过 Web Crypto API 执行，绝对保障安全。'
      },
      {
        question: '如何获取 AES 256 位密钥？',
        answer: '我们提供了一键生成随机 256位密钥的功能，您也可以手动填入合规的 32 字节十六进制（Hex）值。'
      }
    ]
  },
  en: {
    title: 'Developer Cryptography & Hash Toolbox',
    subtitle: 'Swiss Private Banking Matte-Gold Local Cryptographic Suite',
    hashTab: 'Hashing (MD5/SHA)',
    bcryptTab: 'Password Hash (bcrypt)',
    aesTab: 'Symmetric (AES)',
    rsaTab: 'Asymmetric (RSA)',
    benchmarkTab: 'Performance (Benchmark)',
    inputLabel: 'Raw Input Text',
    inputPlaceholder: 'Type or paste plaintext to process...',
    md5Label: 'MD5 Digest',
    sha256Label: 'SHA-256 Digest',
    copy: 'Copy',
    copied: 'Copied',
    bcryptCost: 'Cost Rounds',
    bcryptGenerate: 'Generate bcrypt Hash',
    bcryptVerifyTab: 'Verify Hash',
    bcryptVerifyBtn: 'Verify Password Match',
    bcryptResult: 'Match Integrity Status',
    aesKey: '256-bit Secret Key',
    aesEncrypt: 'AES Encrypt',
    aesDecrypt: 'AES Decrypt',
    aesOutput: 'Ciphertext Output',
    rsaGenerate: 'Generate 2048-bit Key Pair',
    rsaKeyPair: 'RSA Key Pair (PEM Format)',
    rsaSign: 'Digital Sign',
    rsaVerify: 'Verify Signature',
    runBenchmark: 'Execute Performance Run',
    benchmarkDesc: 'Measures execution latency across algorithms on active payload (microseconds/µs, lower is faster)',
    matching: 'Match Successful',
    notMatching: 'Mismatch / Invalid',
    verifyResultSuccess: 'Signature Verified! Integrity is completely intact.',
    verifyResultFail: 'Verification Failed! Invalid signature or key mismatch.',
    decryptedOutput: 'Decrypted Output',
    rsaKeyManager: 'RSA-2048 Key Pair Manager',
    generating: 'Generating...',
    publicKeyLabel: 'Public Key (SPKI/PEM):',
    privateKeyLabel: 'Private Key (PKCS8/PEM):',
    noKeyGenerated: 'No key generated yet.',
    rsaSignVerifyIsland: 'RSA Signature & Verification Island',
    signPayloadBtn: 'Sign Payload with Private Key',
    payloadToVerify: 'Payload to Verify:',
    signatureHex: 'Signature (Hex):',
    verifySignatureBtn: 'Verify Signature Validity',
    performanceBenchmarking: 'Real-time Performance Benchmarking',
    benchmarkingAlgorithms: 'Benchmarking Algorithms...',
    generator: 'Generator',
    hashOutput: 'Hash Output:',
    clickToGenerate: 'Click button to generate...',
    verifyPassword: 'Verify Password:',
    verifyHash: 'Verify Hash:',
    plaintextPayload: 'Plaintext Payload',
    detailed_description: 'Developer Cryptography & Hash Toolbox — Local high-performance hash generator and encryption suite with dynamic microsecond benchmark dashboards.',
    usage_steps: [
      'Enter the raw payload string in the master input area',
      'Select the target cryptographic algorithm (such as AES, RSA, or bcrypt)',
      'Enter a custom key or trigger a 2048-bit RSA key pair generation',
      'View, compare, or copy the processed hashes, ciphertext, or benchmark metrics'
    ],
    usage_examples: [
      'Perform high-security local bcrypt hashing and matching verification in-browser',
      'Generate verifiable digital signatures or SHA-256 checksum fingerprints for payloads',
      'Benchmarking microseconds speed comparisons between various crypto functions'
    ],
    faqs: [
      {
        question: 'Is the Cryptography Toolbox free to use?',
        answer: 'Yes. The tool operates 100% free within the client browser, requiring no registration or premium fees.'
      },
      {
        question: 'Are my keys or inputs uploaded to any server?',
        answer: 'No. All computations are conducted entirely on your local machine using standard HTML5 Web Crypto APIs.'
      },
      {
        question: 'What is the RSA modulus length configured?',
        answer: 'It defaults to a highly robust 2048-bit RSASSA-PKCS1-v1_5 format, which is safe for general developer testing.'
      }
    ]
  },
  ja: {
    title: '開発者向け暗号およびハッシュツールボックス',
    subtitle: 'スイスのプライベートバンク風マットゴールド暗号スイート',
    hashTab: 'ハッシュ化 (MD5/SHA)',
    bcryptTab: 'パスワードハッシュ (bcrypt)',
    aesTab: '対称鍵暗号 (AES)',
    rsaTab: '非対称鍵暗号 (RSA)',
    benchmarkTab: 'パフォーマンス (ベンチマーク)',
    inputLabel: '入力テキスト',
    inputPlaceholder: '処理するプレーンテキストを入力または貼り付けます...',
    md5Label: 'MD5 ダイジェスト',
    sha256Label: 'SHA-256 ダイジェスト',
    copy: 'コピー',
    copied: 'コピー完了',
    bcryptCost: 'コストラウンド',
    bcryptGenerate: 'bcrypt ハッシュ生成',
    bcryptVerifyTab: 'ハッシュ確認',
    bcryptVerifyBtn: 'パスワード一致を確認',
    bcryptResult: '一致整合性ステータス',
    aesKey: '256ビット秘密鍵',
    aesEncrypt: 'AES 暗号化',
    aesDecrypt: 'AES 復号',
    aesOutput: '暗号文出力',
    rsaGenerate: '2048ビット鍵ペア生成',
    rsaKeyPair: 'RSA鍵ペア (PEM形式)',
    rsaSign: 'デジタル署名',
    rsaVerify: '署名検証',
    runBenchmark: 'ベンチマーク実行',
    benchmarkDesc: '現在のペイロードに対する各アルゴリズムの処理レイテンシを測定します（マイクロ秒/μs、低いほど高速）',
    matching: '一致成功',
    notMatching: '不一致 / 無効',
    verifyResultSuccess: '署名が検証されました！データの整合性は完全に維持されています。',
    verifyResultFail: '検証に失敗しました！無効な署名かキーの不一致です。',
    decryptedOutput: '復号出力',
    rsaKeyManager: 'RSA-2048 鍵ペアマネージャー',
    generating: '生成中...',
    publicKeyLabel: '公開鍵 (SPKI/PEM):',
    privateKeyLabel: '秘密鍵 (PKCS8/PEM):',
    noKeyGenerated: 'まだ鍵ペアは生成されていません。',
    rsaSignVerifyIsland: 'RSA署名・検証アイランド',
    signPayloadBtn: '秘密鍵でペイロードに署名する',
    payloadToVerify: '検証用ペイロード:',
    signatureHex: 'デジタル署名 (Hex):',
    verifySignatureBtn: '署名の有効性を検証する',
    performanceBenchmarking: 'リアルタイム暗号アルゴリズムベンチマーク',
    benchmarkingAlgorithms: 'ベンチマーク測定中...',
    generator: '生成器',
    hashOutput: 'ハッシュ出力:',
    clickToGenerate: '上のボタンをクリックして生成してください...',
    verifyPassword: '確認パスワード:',
    verifyHash: '確認ハッシュ:',
    plaintextPayload: 'プレーンテキストペイロード',
    detailed_description: '開発者向け暗号およびハッシュツールボックス —— ローカルでの高性能ハッシュ生成と対称/非対称暗号化を処理するスイート。マイクロ秒単位の性能ベンチマークを視覚的なグラフで表示します。',
    usage_steps: [
      'マスター入力欄に暗号化したい文字列を入力します',
      'AES、RSA、または bcrypt などの処理対象の暗号アルゴリズムを選択します',
      '秘密鍵を手動入力するか、2048ビットの RSA 鍵ペアを生成します',
      '生成されたハッシュ値、暗号文、またはマイクロ秒単位のパフォーマンス結果を確認し、コピーします'
    ],
    usage_examples: [
      'クライアントのブラウザ内で、安全にパスワードの bcrypt ハッシュ生成と検証を行います',
      'ペイロードの改ざんを防ぐための検証可能なデジタル署名や SHA-256 チェックサムを生成します',
      '様々な暗号化方式のローカルでの処理速度をマイクロ秒単位で比較測定します'
    ],
    faqs: [
      {
        question: 'この暗号化ツールボックスは無料ですか？',
        answer: 'はい。登録不要、無料でブラウザ上ですべての機能が動作します。'
      },
      {
        question: 'データや鍵が外部サーバーにアップロードされることはありますか？',
        answer: 'いいえ。すべての暗号化、署名、レイテンシ測定は Web Crypto API を利用し、ローカルで完結します。'
      },
      {
        question: 'RSAのデフォルト設定はどうなっていますか？',
        answer: '安全なテストを行うために、標準的な 2048ビットの RSASSA-PKCS1-v1_5 形式を採用しています。'
      }
    ]
  },
  ko: {
    title: '개발자용 암호화 및 해시 툴박스',
    subtitle: '스위스 프라이빗 뱅킹 스타일의 로컬 암호화 스위트',
    hashTab: '해시 (MD5/SHA)',
    bcryptTab: '비밀번호 해시 (bcrypt)',
    aesTab: '대칭키 암호화 (AES)',
    rsaTab: '비대칭키 암호화 (RSA)',
    benchmarkTab: '성능 (벤치마크)',
    inputLabel: '입력 텍스트',
    inputPlaceholder: '암호화 처리할 텍스트를 입력하거나 붙여넣으세요...',
    md5Label: 'MD5 다이제스트',
    sha256Label: 'SHA-256 다이제스트',
    copy: '복사',
    copied: '복사됨',
    bcryptCost: '비용 라운드',
    bcryptGenerate: 'bcrypt 해시 생성',
    bcryptVerifyTab: '해시 확인',
    bcryptVerifyBtn: '비밀번호 일치 확인',
    bcryptResult: '일치 상태 결과',
    aesKey: '256비트 비밀키',
    aesEncrypt: 'AES 암호화',
    aesDecrypt: 'AES 복호화',
    aesOutput: '암호문 출력',
    rsaGenerate: '2048비트 키 쌍 생성',
    rsaKeyPair: 'RSA 키 쌍 (PEM 형식)',
    rsaSign: '디지털 서명',
    rsaVerify: '서명 검증',
    runBenchmark: '벤치마크 실행',
    benchmarkDesc: '입력한 데이터에 대해 각 암호화 알고리즘의 연산 속도를 측정합니다 (마이크로초/μs, 낮을수록 빠름)',
    matching: '일치 성공',
    notMatching: '불일치 / 잘못됨',
    verifyResultSuccess: '서명 검증 완료! 데이터의 무결성이 완전히 보장됩니다.',
    verifyResultFail: '검증 실패! 유효하지 않은 서명이거나 키가 일치하지 않습니다.',
    decryptedOutput: '복호화 출력',
    rsaKeyManager: 'RSA-2048 키 쌍 관리자',
    generating: '생성 중...',
    publicKeyLabel: '공개키 (SPKI/PEM):',
    privateKeyLabel: '개인키 (PKCS8/PEM):',
    noKeyGenerated: '생성된 키 쌍이 없습니다.',
    rsaSignVerifyIsland: 'RSA 서명 및 검증 블록',
    signPayloadBtn: '개인키로 데이터 서명',
    payloadToVerify: '검증할 데이터:',
    signatureHex: '디지털 서명 (Hex):',
    verifySignatureBtn: '서명 유효성 검증',
    performanceBenchmarking: '암호화 알고리즘 실시간 성능 벤치마크',
    benchmarkingAlgorithms: '벤치마크 실행 중...',
    generator: '생성기',
    hashOutput: '해시 출력 결과:',
    clickToGenerate: '위 버튼을 클릭하여 생성하세요...',
    verifyPassword: '비밀번호 확인:',
    verifyHash: '해시 확인:',
    plaintextPayload: '일반 텍스트 데이터',
    detailed_description: '개발자용 암호화 및 해시 툴박스 —— 브라우저 로컬에서 작동하는 고성능 해시 생성 및 대칭/비대칭 암호화 연산 세트. 마이크로초 단위 알고리즘 벤치마크 차트를 실시간 제공합니다.',
    usage_steps: [
      '입력란에 암호화 처리할 원본 텍스트를 입력합니다',
      '사용할 암호화 알고리즘(AES, RSA, bcrypt 등)을 선택합니다',
      '커스텀 키를 입력하거나 2048비트 RSA 키 쌍을 생성합니다',
      '결과로 반환된 암호문, 해시값 또는 벤치마크 레이턴시 차트를 확인하고 복사합니다'
    ],
    usage_examples: [
      '웹 브라우저 로컬에서 안전하게 비밀번호 bcrypt 해싱 및 매칭 검증을 수행합니다',
      '데이터 무결성을 지키기 위한 디지털 서명 생성 및 SHA-256 체크섬 확인',
      '다양한 암호화 연산의 로컬 속도를 마이크로초 단위로 직접 비교하고 벤치마크 차트 확인'
    ],
    faqs: [
      {
        question: '이 암호화 툴박스는 무료인가요?',
        answer: '네. 로그인 및 회원가입 없이 브라우저 내에서 100% 무료로 동작합니다.'
      },
      {
        question: '입력한 데이터가 서버로 전송되나요?',
        answer: '아닙니다. 모든 암호화 연산 및 키 생성은 HTML5 Web Crypto API를 통해 사용자 PC 로컬에서 안전하게 실행됩니다.'
      },
      {
        question: 'RSA 암호화 기본 설정 강도는 어떻게 되나요?',
        answer: '개발자 테스트용으로 널리 검증된 2048비트 RSASSA-PKCS1-v1_5 포맷을 기본 제공합니다.'
      }
    ]
  },
  de: {
    title: 'Kryptografie- & Hash-Toolbox',
    subtitle: 'Schweizer Private-Banking Mattgold-Lokalsuite',
    hashTab: 'Hashing (MD5/SHA)',
    bcryptTab: 'Passworthash (bcrypt)',
    aesTab: 'Symmetrisch (AES)',
    rsaTab: 'Asymmetrisch (RSA)',
    benchmarkTab: 'Leistung (Benchmark)',
    inputLabel: 'Roh-Eingabetext',
    inputPlaceholder: 'Geben Sie Klartext zum Verarbeiten ein...',
    md5Label: 'MD5-Digest',
    sha256Label: 'SHA-256-Digest',
    copy: 'Kopieren',
    copied: 'Kopiert',
    bcryptCost: 'Kostenrunden',
    bcryptGenerate: 'bcrypt-Hash erzeugen',
    bcryptVerifyTab: 'Hash verifizieren',
    bcryptVerifyBtn: 'Passwort-Abgleich prüfen',
    bcryptResult: 'Abgleich-Status',
    aesKey: '256-Bit-Geheimschlüssel',
    aesEncrypt: 'AES verschlüsseln',
    aesDecrypt: 'AES entschlüsseln',
    aesOutput: 'Chiffretext-Ausgabe',
    rsaGenerate: '2048-Bit-Schlüsselpaar erzeugen',
    rsaKeyPair: 'RSA-Schlüsselpaar (PEM-Format)',
    rsaSign: 'Signieren',
    rsaVerify: 'Signatur prüfen',
    runBenchmark: 'Benchmark starten',
    benchmarkDesc: 'Misst die Ausführungszeit der Algorithmen auf dem aktiven Payload (Mikrosekunden/µs, niedriger ist schneller)',
    matching: 'Abgleich erfolgreich',
    notMatching: 'Keine Übereinstimmung',
    verifyResultSuccess: 'Signatur erfolgreich verifiziert! Die Datenintegrität ist vollständig gewahrt.',
    verifyResultFail: 'Signaturverifizierung fehlgeschlagen! Ungültige Signatur oder Schlüsselkonflikt.',
    decryptedOutput: 'Entschlüsselte Ausgabe',
    rsaKeyManager: 'RSA-2048-Schlüsselpaar-Manager',
    generating: 'Wird generiert...',
    publicKeyLabel: 'Öffentlicher Schlüssel (SPKI/PEM):',
    privateKeyLabel: 'Privater Schlüssel (PKCS8/PEM):',
    noKeyGenerated: 'Noch kein Schlüsselpaar generiert.',
    rsaSignVerifyIsland: 'RSA Signatur- & Verifizierungsbereich',
    signPayloadBtn: 'Payload mit privatem Schlüssel signieren',
    payloadToVerify: 'Zu prüfender Payload:',
    signatureHex: 'Signatur (Hex):',
    verifySignatureBtn: 'Signaturgültigkeit prüfen',
    performanceBenchmarking: 'Algorithmen-Leistungsbenchmark in Echtzeit',
    benchmarkingAlgorithms: 'Benchmark läuft...',
    generator: 'Generator',
    hashOutput: 'Hash-Ausgabe:',
    clickToGenerate: 'Klicken Sie auf die Schaltfläche...',
    verifyPassword: 'Passwort prüfen:',
    verifyHash: 'Hash prüfen:',
    plaintextPayload: 'Klartext-Payload',
    detailed_description: 'Entwickler-Kryptografie-Toolbox — Lokaler Hochleistungs-Hash-Generator und Verschlüsselungs-Suite mit dynamischen Benchmarks im Mikrosekundenbereich.',
    usage_steps: [
      'Geben Sie den Rohtext in den Master-Eingabebereich ein',
      'Wählen Sie den Zielalgorithmus (AES, RSA oder bcrypt)',
      'Geben Sie einen Schlüssel ein oder generieren Sie ein RSA-Schlüsselpaar',
      'Prüfen und kopieren Sie die erzeugten Hashes, Chiffretexte oder Benchmarks'
    ],
    usage_examples: [
      'Sicheres bcrypt-Hashing für Passwörter lokal im Browser ausführen',
      'Erzeugen Sie manipulationssichere SHA-256 Prüfsummen oder Signaturen',
      'Vergleichen Sie die Geschwindigkeit kryptografischer Berechnungen in Miksekunden'
    ],
    faqs: [
      {
        question: 'Ist die Kryptografie-Toolbox kostenlos?',
        answer: 'Ja, das Tool läuft komplett kostenlos und ohne Registrierung lokal in Ihrem Browser.'
      },
      {
        question: 'Werden meine Eingaben auf einen Server geladen?',
        answer: 'Nein, alle kryptografischen Berechnungen erfolgen lokal per Web Crypto API im Browser.'
      },
      {
        question: 'Wie sicher ist das generierte RSA-Schlüsselpaar?',
        answer: 'Es verwendet das bewährte 2048-Bit-Format RSASSA-PKCS1-v1_5.'
      }
    ]
  },
  es: {
    title: 'Caja de Herramientas de Criptografía',
    subtitle: 'Suite criptográfica local estilo banca privada suiza',
    hashTab: 'Hashing (MD5/SHA)',
    bcryptTab: 'Hash de contraseña (bcrypt)',
    aesTab: 'Simétrico (AES)',
    rsaTab: 'Asimétrico (RSA)',
    benchmarkTab: 'Rendimiento (Benchmark)',
    inputLabel: 'Texto de entrada',
    inputPlaceholder: 'Escriba o pegue texto plano para procesar...',
    md5Label: 'MD5 Digest',
    sha256Label: 'SHA-256 Digest',
    copy: 'Copiar',
    copied: 'Copiado',
    bcryptCost: 'Rondas de costo',
    bcryptGenerate: 'Generar hash bcrypt',
    bcryptVerifyTab: 'Verificar hash',
    bcryptVerifyBtn: 'Comprobar coincidencia',
    bcryptResult: 'Estado de coincidencia',
    aesKey: 'Clave secreta de 256 bits',
    aesEncrypt: 'Cifrar con AES',
    aesDecrypt: 'Descifrar con AES',
    aesOutput: 'Salida de texto cifrado',
    rsaGenerate: 'Generar par de claves de 2048 bits',
    rsaKeyPair: 'Par de claves RSA (formato PEM)',
    rsaSign: 'Firmar digitalmente',
    rsaVerify: 'Verificar firma',
    runBenchmark: 'Iniciar benchmark',
    benchmarkDesc: 'Mide la latencia de ejecución en microsegundos (µs) para cada algoritmo sobre la carga útil (menos es más rápido)',
    matching: 'Coincidencia exitosa',
    notMatching: 'No coincide / Inválido',
    verifyResultSuccess: '¡Firma verificada con éxito! La integridad de los datos está intacta.',
    verifyResultFail: '¡Fallo de verificación! Firma no válida o desajuste de clave.',
    decryptedOutput: 'Salida descifrada',
    rsaKeyManager: 'Gestor de pares de claves RSA-2048',
    generating: 'Generando...',
    publicKeyLabel: 'Clave pública (SPKI/PEM):',
    privateKeyLabel: 'Clave privada (PKCS8/PEM):',
    noKeyGenerated: 'No se ha generado ningún par de claves aún.',
    rsaSignVerifyIsland: 'Módulo de firma y verificación RSA',
    signPayloadBtn: 'Firmar carga útil con clave privada',
    payloadToVerify: 'Carga útil a verificar:',
    signatureHex: 'Firma (Hex):',
    verifySignatureBtn: 'Verificar validez de firma',
    performanceBenchmarking: 'Prueba de rendimiento de algoritmos en tiempo real',
    benchmarkingAlgorithms: 'Ejecutando benchmark...',
    generator: 'Generador',
    hashOutput: 'Salida de hash:',
    clickToGenerate: 'Haga clic en el botón superior...',
    verifyPassword: 'Confirmar contraseña:',
    verifyHash: 'Confirmar hash:',
    plaintextPayload: 'Carga útil de texto plano',
    detailed_description: 'Caja de herramientas de criptografía para desarrolladores: generador de hash y suite de cifrado local de alto rendimiento con gráficos de rendimiento.',
    usage_steps: [
      'Introduzca el texto sin formato en el área de entrada maestra',
      'Seleccione el algoritmo de destino (AES, RSA o bcrypt)',
      'Introduzca una clave o genere un par de claves RSA de 2048 bits',
      'Verifique y copie los hashes, textos cifrados o métricas calculadas'
    ],
    usage_examples: [
      'Realizar hashing bcrypt seguro para contraseñas de forma local en el navegador',
      'Generar firmas digitales o sumas de comprobación SHA-256 para evitar alteraciones',
      'Comparar la velocidad en microsegundos de múltiples opciones de cifrado'
    ],
    faqs: [
      {
        question: '¿La herramienta de criptografía es gratuita?',
        answer: 'Sí. Funciona de manera 100% gratuita dentro del cliente sin requerir registro.'
      },
      {
        question: '¿Se envían los datos a algún servidor?',
        answer: 'No. Todas las operaciones de cifrado se realizan en su navegador a través de la Web Crypto API.'
      },
      {
        question: '¿Qué formato de firma utiliza RSA?',
        answer: 'Utiliza el estándar de seguridad industrial RSASSA-PKCS1-v1_5 de 2048 bits.'
      }
    ]
  },
  fr: {
    title: 'Boîte à Outils Criptographique',
    subtitle: 'Suite de chiffrement locale haut de gamme style banque privée suisse',
    hashTab: 'Hachage (MD5/SHA)',
    bcryptTab: 'Hachage de mot de passe (bcrypt)',
    aesTab: 'Symétrique (AES)',
    rsaTab: 'Asymétrique (RSA)',
    benchmarkTab: 'Performance (Benchmark)',
    inputLabel: 'Texte d\'entrée brut',
    inputPlaceholder: 'Entrez ou collez le texte en clair à traiter...',
    md5Label: 'Empreinte MD5',
    sha256Label: 'Empreinte SHA-256',
    copy: 'Copier',
    copied: 'Copié',
    bcryptCost: 'Rondes de coût',
    bcryptGenerate: 'Générer le hash bcrypt',
    bcryptVerifyTab: 'Vérifier le hash',
    bcryptVerifyBtn: 'Vérifier la correspondance',
    bcryptResult: 'Statut de correspondance',
    aesKey: 'Clé secrète 256 bits',
    aesEncrypt: 'Chiffrer avec AES',
    aesDecrypt: 'Déchiffrer avec AES',
    aesOutput: 'Sortie du texte chiffré',
    rsaGenerate: 'Générer une paire de clés 2048 bits',
    rsaKeyPair: 'Paire de clés RSA (format PEM)',
    rsaSign: 'Signer numériquement',
    rsaVerify: 'Vérifier la signature',
    runBenchmark: 'Lancer le benchmark',
    benchmarkDesc: 'Mesure la latence d\'exécution des algorithmes en microsecondes (µs) sur les données actives (le plus bas est le plus rapide)',
    matching: 'Correspondance réussie',
    notMatching: 'Non correspondant / Invalide',
    verifyResultSuccess: 'Signature vérifiée avec succès ! L\'intégrité des données est préservée.',
    verifyResultFail: 'Échec de la vérification ! Signature invalide ou clé non correspondante.',
    decryptedOutput: 'Sortie déchiffrée',
    rsaKeyManager: 'Gestionnaire de paire de clés RSA-2048',
    generating: 'Génération...',
    publicKeyLabel: 'Clé publique (SPKI/PEM):',
    privateKeyLabel: 'Clé privée (PKCS8/PEM):',
    noKeyGenerated: 'Aucune clé générée pour le moment.',
    rsaSignVerifyIsland: 'Module de signature et vérification RSA',
    signPayloadBtn: 'Signer les données avec la clé privée',
    payloadToVerify: 'Données à vérifier:',
    signatureHex: 'Signature (Hex):',
    verifySignatureBtn: 'Vérifier la validité de la signature',
    performanceBenchmarking: 'Benchmark de performance des algorithmes en temps réel',
    benchmarkingAlgorithms: 'Mesure en cours...',
    generator: 'Générateur',
    hashOutput: 'Sortie du hash:',
    clickToGenerate: 'Cliquez sur le bouton ci-dessus...',
    verifyPassword: 'Confirmer mot de passe:',
    verifyHash: 'Confirmer le hash:',
    plaintextPayload: 'Données en clair',
    detailed_description: 'Boîte à outils de cryptographie pour développeurs — Générateur de hachage et suite de chiffrement local avec graphiques de performance en microsecondes.',
    usage_steps: [
      'Entrez les données à traiter dans la zone de texte principale',
      'Sélectionnez l\'algorithme souhaité (AES, RSA ou bcrypt)',
      'Définissez une clé ou générez une paire de clés RSA 2048 bits',
      'Visualisez et copiez les empreintes, textes chiffrés ou résultats de vitesse calculés'
    ],
    usage_examples: [
      'Générer un hachage bcrypt sécurisé pour mot de passe localement dans le navigateur',
      'Signer vos payloads avec une clé privée pour garantir leur non-altération',
      'Comparer les temps de calcul des fonctions de sécurité en microsecondes'
    ],
    faqs: [
      {
        question: 'Cette suite cryptographique est-elle gratuite ?',
        answer: 'Oui. Le calcul fonctionne en local sans inscription ni frais requis.'
      },
      {
        question: 'Les données ou clés sont-elles envoyées sur internet ?',
        answer: 'Non. Toutes les opérations s\'exécutent localement grâce à la Web Crypto API.'
      },
      {
        question: 'Quel standard de signature est utilisé pour RSA ?',
        answer: 'Il s\'appuie sur la norme éprouvée RSASSA-PKCS1-v1_5 de 2048 bits.'
      }
    ]
  },
  pt: {
    title: 'Caixa de Ferramentas Criptográfica',
    subtitle: 'Suite criptográfica local de alta qualidade estilo banco privado suíço',
    hashTab: 'Hashing (MD5/SHA)',
    bcryptTab: 'Hash de senha (bcrypt)',
    aesTab: 'Simétrico (AES)',
    rsaTab: 'Asimétrico (RSA)',
    benchmarkTab: 'Rendimento (Benchmark)',
    inputLabel: 'Texto de entrada bruto',
    inputPlaceholder: 'Digite ou cole texto simples para processar...',
    md5Label: 'MD5 Digest',
    sha256Label: 'SHA-256 Digest',
    copy: 'Copiar',
    copied: 'Copiado',
    bcryptCost: 'Rondas de custo',
    bcryptGenerate: 'Gerar hash bcrypt',
    bcryptVerifyTab: 'Verificar hash',
    bcryptVerifyBtn: 'Confirmar correspondência',
    bcryptResult: 'Status de correspondência',
    aesKey: 'Chave secreta de 256 bits',
    aesEncrypt: 'Criptografar AES',
    aesDecrypt: 'Descriptografar AES',
    aesOutput: 'Saída de texto criptografado',
    rsaGenerate: 'Gerar par de chaves de 2048 bits',
    rsaKeyPair: 'Par de chaves RSA (formato PEM)',
    rsaSign: 'Assinar digitalmente',
    rsaVerify: 'Verificar assinatura',
    runBenchmark: 'Iniciar benchmark',
    benchmarkDesc: 'Mede a latência de processamento em microssegundos (µs) de cada algoritmo sobre a carga útil ativa (menor é melhor)',
    matching: 'Correspondência com sucesso',
    notMatching: 'Diferente / Inválido',
    verifyResultSuccess: 'Assinatura verificada! A integridade dos dados está completamente intacta.',
    verifyResultFail: 'Falha na verificação! Assinatura inválida ou chave incorreta.',
    decryptedOutput: 'Saída descriptografada',
    rsaKeyManager: 'Gestor de par de chaves RSA-2048',
    generating: 'Gerando...',
    publicKeyLabel: 'Chave pública (SPKI/PEM):',
    privateKeyLabel: 'Chave privada (PKCS8/PEM):',
    noKeyGenerated: 'Nenhum par de chaves gerado ainda.',
    rsaSignVerifyIsland: 'Módulo de assinatura e verificação RSA',
    signPayloadBtn: 'Assinar carga útil com chave privada',
    payloadToVerify: 'Carga útil a verificar:',
    signatureHex: 'Assinatura (Hex):',
    verifySignatureBtn: 'Verificar validade da assinatura',
    performanceBenchmarking: 'Teste de rendimento em tempo real dos algoritmos',
    benchmarkingAlgorithms: 'Executando benchmark...',
    generator: 'Gerador',
    hashOutput: 'Saída de hash:',
    clickToGenerate: 'Clique no botão acima...',
    verifyPassword: 'Confirmar senha:',
    verifyHash: 'Confirmar hash:',
    plaintextPayload: 'Carga útil de texto simples',
    detailed_description: 'Caixa de ferramentas de criptografia para desenvolvedores: gerador de hash e suite de criptografia local de alto desempenho com gráficos em microssegundos.',
    usage_steps: [
      'Introduza o texto simples na caixa de texto mestra',
      'Selecione o algoritmo desejado (AES, RSA ou bcrypt)',
      'Defina uma chave ou gere um par de chaves RSA de 2048 bits',
      'Visualize e copie os hashes, textos criptografados ou métricas de velocidade'
    ],
    usage_examples: [
      'Gerar hash bcrypt seguro de senha de forma 100% local no browser',
      'Assinar payloads para evitar adulteração de dados com assinaturas digitais',
      'Comparar a latência em microssegundos de diferentes métodos de cifragem'
    ],
    faqs: [
      {
        question: 'Esta caixa de ferramentas é gratuita?',
        answer: 'Sim. As operações rodam no cliente sem qualquer tipo de conta ou taxa.'
      },
      {
        question: 'Meus dados são enviados para a rede?',
        answer: 'Não. Todas as criptografias e benchmarks rodam no navegador com a Web Crypto API.'
      },
      {
        question: 'Qual formato de assinatura o módulo RSA utiliza?',
        answer: 'Utiliza o formato RSASSA-PKCS1-v1_5 de 2048 bits.'
      }
    ]
  },
  ru: {
    title: 'Инструментарий Криптографии',
    subtitle: 'Локальный криптографический люкс премиум-класса',
    hashTab: 'Хэширование (MD5/SHA)',
    bcryptTab: 'Хэш пароля (bcrypt)',
    aesTab: 'Симметричное (AES)',
    rsaTab: 'Асимметричное (RSA)',
    benchmarkTab: 'Скорость (Бенчмарк)',
    inputLabel: 'Исходный текст',
    inputPlaceholder: 'Введите или вставьте текст для обработки...',
    md5Label: 'Хэш MD5',
    sha256Label: 'Хэш SHA-256',
    copy: 'Копировать',
    copied: 'Скопировано',
    bcryptCost: 'Раунды стоимости',
    bcryptGenerate: 'Создать хэш bcrypt',
    bcryptVerifyTab: 'Проверить хэш',
    bcryptVerifyBtn: 'Проверить совпадение',
    bcryptResult: 'Статус совпадения',
    aesKey: '256-битный секретный ключ',
    aesEncrypt: 'Зашифровать AES',
    aesDecrypt: 'Расшифровать AES',
    aesOutput: 'Зашифрованный текст (Hex)',
    rsaGenerate: 'Создать пару ключей 2048-бит',
    rsaKeyPair: 'Пара ключей RSA (PEM)',
    rsaSign: 'Подписать данные',
    rsaVerify: 'Проверить подпись',
    runBenchmark: 'Запустить бенчмарк',
    benchmarkDesc: 'Измеряет время выполнения алгоритмов на активных данных (в микросекундах/мкс, меньше — лучше)',
    matching: 'Совпадение успешно',
    notMatching: 'Не совпадает / Неверно',
    verifyResultSuccess: 'Подпись подтверждена! Целостность данных сохранена.',
    verifyResultFail: 'Ошибка проверки! Неверная подпись или несовпадение ключей.',
    decryptedOutput: 'Расшифрованные данные',
    rsaKeyManager: 'Управление ключами RSA-2048',
    generating: 'Создание...',
    publicKeyLabel: 'Открытый ключ (SPKI/PEM):',
    privateKeyLabel: 'Закрытый ключ (PKCS8/PEM):',
    noKeyGenerated: 'Пара ключей еще не создана.',
    rsaSignVerifyIsland: 'Модуль цифровой подписи и проверки RSA',
    signPayloadBtn: 'Подписать данные закрытым ключом',
    payloadToVerify: 'Данные для проверки:',
    signatureHex: 'Подпись (Hex):',
    verifySignatureBtn: 'Проверить валидность подписи',
    performanceBenchmarking: 'Тест производительности алгоритмов в реальном времени',
    benchmarkingAlgorithms: 'Вычисление бенчмарка...',
    generator: 'Генератор',
    hashOutput: 'Результат хэширования:',
    clickToGenerate: 'Нажмите кнопку выше...',
    verifyPassword: 'Проверочный пароль:',
    verifyHash: 'Проверочный хэш:',
    plaintextPayload: 'Исходные текстовые данные',
    detailed_description: 'Криптографический инструментарий разработчика — локальный генератор хэшей и шифрование с динамическими графиками производительности в микросекундах.',
    usage_steps: [
      'Введите текст в поле ввода на главной панели',
      'Выберите криптоалгоритм (AES, RSA или bcrypt)',
      'Введите секретный ключ или сгенерируйте 2048-битную пару ключей RSA',
      'Проверьте и скопируйте полученные хэши, шифротекст или графики скорости'
    ],
    usage_examples: [
      'Локальное безопасное хэширование bcrypt и сверка паролей в браузере',
      'Создание цифровых подписей или хэшей SHA-256 для предотвращения подмены данных',
      'Сравнение скорости криптографических вычислений в микросекундах'
    ],
    faqs: [
      {
        question: 'Криптографический инструментарий бесплатен?',
        answer: 'Да. Все операции выполняются локально в браузере без ограничений и оплат.'
      },
      {
        question: 'Отправляются ли мои данные на внешние сервера?',
        answer: 'Нет. Все вычисления производятся исключительно на вашем устройстве через Web Crypto API.'
      },
      {
        question: 'Какой тип подписи используется в RSA?',
        answer: 'Используется надежный отраслевой стандарт 2048-бит RSASSA-PKCS1-v1_5.'
      }
    ]
  },
  ar: {
    title: 'أدوات التشفير والمراجعة',
    subtitle: 'حزمة تشفير محلية فائقة الأداء بأسلوب الخدمات المصرفية السويسرية الخاصة',
    hashTab: 'التجزئة (MD5/SHA)',
    bcryptTab: 'تجزئة كلمة المرور (bcrypt)',
    aesTab: 'متماثل (AES)',
    rsaTab: 'غير متماثل (RSA)',
    benchmarkTab: 'قياس الأداء',
    inputLabel: 'النص المدخل الأصلي',
    inputPlaceholder: 'اكتب أو الصق النص العادي للمعالجة هنا...',
    md5Label: 'ملخص MD5',
    sha256Label: 'ملخص SHA-256',
    copy: 'نسخ',
    copied: 'تم النسخ',
    bcryptCost: 'جولات التكلفة',
    bcryptGenerate: 'توليد هاف bcrypt',
    bcryptVerifyTab: 'التحقق من الهاش',
    bcryptVerifyBtn: 'التحقق من تطابق كلمة المرور',
    bcryptResult: 'حالة تطابق التجزئة',
    aesKey: 'مفتاح سري 256 بت',
    aesEncrypt: 'تشفير AES',
    aesDecrypt: 'فك تشفير AES',
    aesOutput: 'مخرجات النص المشفر',
    rsaGenerate: 'توليد زوج مفاتيح 2048 بت',
    rsaKeyPair: 'زوج مفاتيح RSA (تنسيق PEM)',
    rsaSign: 'التوقيع الرقمي',
    rsaVerify: 'التحقق من التوقيع',
    runBenchmark: 'تشغيل قياس الأداء',
    benchmarkDesc: 'يقيس زمن انتقال التنفيذ عبر الخوارزميات على الحمولة النشطة (ميكروثانية/µs، الأقل أسرع)',
    matching: 'تم التطابق بنجاح',
    notMatching: 'غير متطابق / غير صالح',
    verifyResultSuccess: 'تم التحقق من التوقيع بنجاح! سلامة البيانات كاملة.',
    verifyResultFail: 'فشل التحقق! توقيع غير صالح أو عدم تطابق المفتاح.',
    decryptedOutput: 'المخرجات بعد فك التشفير',
    rsaKeyManager: 'إدارة زوج مفاتيح RSA-2048',
    generating: 'جاري التوليد...',
    publicKeyLabel: 'المفتاح العام (SPKI/PEM):',
    privateKeyLabel: 'المفتاح الخاص (PKCS8/PEM):',
    noKeyGenerated: 'لم يتم توليد زوج مفاتيح بعد.',
    rsaSignVerifyIsland: 'وحدة التوقيع والتحقق الرقمي RSA',
    signPayloadBtn: 'توقيع الحمولة بالمفتاح الخاص',
    payloadToVerify: 'الحمولة المراد التحقق منها:',
    signatureHex: 'التوقيع (Hex):',
    verifySignatureBtn: 'التحقق من صلاحية التوقيع',
    performanceBenchmarking: 'مقارنة أداء خوارزميات التشفير في الوقت الفعلي',
    benchmarkingAlgorithms: 'جاري تشغيل الاختبار...',
    generator: 'مولد',
    hashOutput: 'مخرجات الهاش التجزئة:',
    clickToGenerate: 'انقر فوق الزر العلوي للتوليد...',
    verifyPassword: 'تأكيد كلمة المرور:',
    verifyHash: 'تأكيد الهاش:',
    plaintextPayload: 'حمولة النص العادي',
    detailed_description: 'صندوق أدوات التشفير للمطورين - مولد تشفير وتشفير محلي عالي الأداء مع لوحات معلومات قياس أداء ديناميكية في غضون ميكروثانية مخصصة للمراجعة الفورية.',
    usage_steps: [
      'أدخل النص العادي في حقل الإدخال الرئيسي',
      'اختر خوارزمية التشفير المطلوبة (مثل AES أو RSA أو bcrypt)',
      'أدخل مفتاحًا مخصصًا أو قم بتوليد زوج مفاتيح RSA بسعة 2048 بت',
      'راجع وانسخ قيم الهاش أو النصوص المشفرة أو مخططات قياس الأداء الناتجة'
    ],
    usage_examples: [
      'توليد هاش bcrypt آمن للتحقق من تطابق كلمات المرور محليًا في المتصفح',
      'إنشاء توقيع رقمي موثوق أو هاش SHA-256 لمنع التلاعب بالبيانات',
      'مقارنة سرعة عمليات التشفير المتنوعة في الوقت الفعلي بالميكروثانية'
    ],
    faqs: [
      {
        question: 'هل أدوات التشفير مجانية للاستخدام؟',
        answer: 'نعم. تعمل الأدوات بشكل مجاني 100٪ داخل المتصفح دون الحاجة إلى أي حساب.'
      },
      {
        question: 'هل يتم رفع بياناتي إلى خوادم خارجية؟',
        answer: 'لا. تجري كافة العمليات والقياسات بأمان محليًا عبر واجهة Web Crypto API.'
      },
      {
        question: 'ما هي مواصفات زوج المفاتيح RSA الافتراضية؟',
        answer: 'يعتمد التوليد على المعيار الصناعي المعتمد 2048-بت بتنسيق RSASSA-PKCS1-v1_5.'
      }
    ]
  }
};

// 确保翻译包目录存在并输出文件
const locales = Object.keys(translations);
const baseDir = '/Users/kaka/Dev/u2tool/src/messages';

for (const locale of locales) {
  const targetDir = join(baseDir, locale, 'tools');
  mkdirSync(targetDir, { recursive: true });
  
  const targetFile = join(targetDir, 'developer-cryptography-toolbox.json');
  writeFileSync(targetFile, JSON.stringify(translations[locale], null, 2), 'utf8');
  console.log(`Generated translation file for [${locale}]: ${targetFile}`);
}

console.log('All 10 locale cryptographic translation files created successfully.');
