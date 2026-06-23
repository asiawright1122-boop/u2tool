import { type Locale } from './i18n';
import {
  buildClusterCollectionData as factoryBuildCollectionData,
  buildClusterGroupForTool as factoryBuildGroupForTool,
  buildClusterGroups as factoryBuildGroups,
  buildClusterItemList as factoryBuildItemList,
  buildClusterItems as factoryBuildItems,
  createClusterSlugSet,
  getClusterGroupIdForSlug as factoryGetGroupIdForSlug,
  resolveClusterCopy,
} from './tool-cluster-factory';
import type {
  ToolClusterCopy,
  ToolClusterGroup,
  ToolClusterItem,
} from './tool-cluster-types';

export const securityToolClusterPath = '/tools/security-password-hash-tools';

export const securityToolClusterSlugs = [
  'password-generator',
  'password-strength',
  'totp-generator',
  'hash-generator',
  'file-hash',
  'hmac-generator',
  'text-hash-comparator',
  'checksum-verifier',
  'text-encryption',
  'string-obfuscator',
  'js-obfuscator',
  'jwt-generator',
  'jwt-decoder',
  'jwt-debugger',
  'jwt-payload-decoder',
  'csp-generator',
  'csp-header-generator',
  'sri-hash-generator',
  'security-headers-checker',
  'ssl-checker',
  'dependency-vulnerability-checker',
  'sql-injection-tester',
] as const;

export type SecurityToolClusterItem = ToolClusterItem;

export type SecurityToolClusterGroup = ToolClusterGroup<
  'password-identity' | 'hash-encryption' | 'jwt-tokens' | 'web-app-security'
>;

export type SecurityToolClusterCopy = ToolClusterCopy;

const groupSlugs: Array<{
  id: SecurityToolClusterGroup['id'];
  slugs: string[];
}> = [
  {
    id: 'password-identity',
    slugs: ['password-generator', 'password-strength', 'totp-generator'],
  },
  {
    id: 'hash-encryption',
    slugs: [
      'hash-generator',
      'file-hash',
      'hmac-generator',
      'text-hash-comparator',
      'checksum-verifier',
      'text-encryption',
      'string-obfuscator',
      'js-obfuscator',
    ],
  },
  {
    id: 'jwt-tokens',
    slugs: ['jwt-generator', 'jwt-decoder', 'jwt-debugger', 'jwt-payload-decoder'],
  },
  {
    id: 'web-app-security',
    slugs: [
      'csp-generator',
      'csp-header-generator',
      'sri-hash-generator',
      'security-headers-checker',
      'ssl-checker',
      'dependency-vulnerability-checker',
      'sql-injection-tester',
    ],
  },
];

const securityToolClusterSlugSet = createClusterSlugSet(securityToolClusterSlugs);

export function isSecurityToolClusterSlug(slug: string): boolean {
  return securityToolClusterSlugSet.has(slug);
}

export function getSecurityToolClusterGroupIdForSlug(slug: string): SecurityToolClusterGroup['id'] | null {
  return factoryGetGroupIdForSlug(groupSlugs, slug);
}

const groupCopy: Record<Locale, Record<SecurityToolClusterGroup['id'], { title: string; description: string }>> = {
  en: {
    'password-identity': { title: 'Passwords & Identity Codes', description: 'Generate strong passwords, check password strength, and create time-based one-time passwords.' },
    'hash-encryption': { title: 'Hash, HMAC & Encryption', description: 'Create hashes, verify checksums, compare digests, encrypt text, and obfuscate sensitive snippets.' },
    'jwt-tokens': { title: 'JWT & Token Debugging', description: 'Generate, decode, inspect, and debug JWT payloads while keeping token work in the browser.' },
    'web-app-security': { title: 'Web App Security Headers', description: 'Build CSP, SRI, SSL, security header, dependency, and injection checks for safer web deployments.' },
  },
  zh: {
    'password-identity': { title: '密码与身份验证码', description: '生成强密码、检查密码强度，并创建基于时间的一次性验证码。' },
    'hash-encryption': { title: 'Hash、HMAC 与加密', description: '生成哈希、校验 checksum、比较摘要、加密文本并混淆敏感片段。' },
    'jwt-tokens': { title: 'JWT 与令牌调试', description: '生成、解码、检查和调试 JWT payload，并尽量在浏览器内完成令牌处理。' },
    'web-app-security': { title: 'Web 应用安全头', description: '构建 CSP、SRI、SSL、安全头、依赖漏洞和注入检查，提升部署安全性。' },
  },
  ja: {
    'password-identity': { title: 'パスワードと認証コード', description: '強いパスワード、強度チェック、時間ベースのワンタイムパスワードを作成します。' },
    'hash-encryption': { title: 'Hash、HMAC、暗号化', description: 'ハッシュ作成、チェックサム検証、ダイジェスト比較、テキスト暗号化、難読化を行います。' },
    'jwt-tokens': { title: 'JWT とトークンデバッグ', description: 'JWT の生成、デコード、確認、payload デバッグをブラウザ中心で行います。' },
    'web-app-security': { title: 'Web アプリ安全ヘッダー', description: 'CSP、SRI、SSL、安全ヘッダー、依存関係、インジェクション確認を整理します。' },
  },
  ko: {
    'password-identity': { title: '비밀번호 및 인증 코드', description: '강력한 비밀번호를 만들고 강도를 확인하며 시간 기반 일회용 비밀번호를 생성합니다.' },
    'hash-encryption': { title: 'Hash, HMAC 및 암호화', description: '해시 생성, checksum 검증, digest 비교, 텍스트 암호화, 민감한 코드 난독화를 처리합니다.' },
    'jwt-tokens': { title: 'JWT 및 토큰 디버깅', description: 'JWT 생성, 디코딩, 검사, payload 디버깅을 브라우저 안에서 진행합니다.' },
    'web-app-security': { title: '웹 앱 보안 헤더', description: 'CSP, SRI, SSL, 보안 헤더, 의존성, injection 점검을 준비합니다.' },
  },
  es: {
    'password-identity': { title: 'Contrasenas y Codigos de Identidad', description: 'Genera contrasenas fuertes, revisa seguridad y crea codigos TOTP.' },
    'hash-encryption': { title: 'Hash, HMAC y Cifrado', description: 'Crea hashes, verifica checksums, compara digests, cifra texto y ofusca snippets.' },
    'jwt-tokens': { title: 'JWT y Depuracion de Tokens', description: 'Genera, decodifica, inspecciona y depura JWT desde el navegador.' },
    'web-app-security': { title: 'Headers de Seguridad Web', description: 'Prepara CSP, SRI, SSL, security headers, dependencias y pruebas de inyeccion.' },
  },
  pt: {
    'password-identity': { title: 'Senhas e Codigos de Identidade', description: 'Gere senhas fortes, avalie seguranca e crie codigos TOTP.' },
    'hash-encryption': { title: 'Hash, HMAC e Criptografia', description: 'Crie hashes, valide checksums, compare digests, cifre texto e ofusque trechos.' },
    'jwt-tokens': { title: 'JWT e Depuracao de Tokens', description: 'Gere, decodifique, inspecione e depure JWT no navegador.' },
    'web-app-security': { title: 'Headers de Seguranca Web', description: 'Monte CSP, SRI, SSL, security headers, dependencias e testes de injecao.' },
  },
  fr: {
    'password-identity': { title: 'Mots de Passe et Codes Identite', description: 'Generez des mots de passe forts, verifiez la robustesse et creez des codes TOTP.' },
    'hash-encryption': { title: 'Hash, HMAC et Chiffrement', description: 'Creez hashes, checksums, comparaisons digest, chiffrement texte et obfuscation.' },
    'jwt-tokens': { title: 'JWT et Debug Tokens', description: 'Generez, decodez, inspectez et deboguez les JWT dans le navigateur.' },
    'web-app-security': { title: 'Headers de Securite Web', description: 'Preparez CSP, SRI, SSL, headers, dependances et controles injection.' },
  },
  de: {
    'password-identity': { title: 'Passworter und Identity-Codes', description: 'Erstellen Sie starke Passworter, prüfen Sie Passwortstärke und erzeugen Sie TOTP-Codes.' },
    'hash-encryption': { title: 'Hash, HMAC und Verschlusselung', description: 'Erzeugen Sie Hashes, prüfen Sie Checksums, vergleichen Sie Digests, verschlüsseln und obfuskieren Sie Text.' },
    'jwt-tokens': { title: 'JWT und Token-Debugging', description: 'Generieren, decodieren, prüfen und debuggen Sie JWT-Payloads im Browser.' },
    'web-app-security': { title: 'Web-App Security Headers', description: 'Bauen Sie CSP, SRI, SSL, Security Headers, Dependency Checks und Injection Tests.' },
  },
  ru: {
    'password-identity': { title: 'Пароли и коды идентификации', description: 'Создавайте надежные пароли, проверяйте стойкость и генерируйте TOTP-коды.' },
    'hash-encryption': { title: 'Hash, HMAC и шифрование', description: 'Создавайте хэши, проверяйте checksums, сравнивайте digests, шифруйте текст и обфусцируйте фрагменты.' },
    'jwt-tokens': { title: 'JWT и отладка токенов', description: 'Генерируйте, декодируйте, проверяйте и отлаживайте JWT payload в браузере.' },
    'web-app-security': { title: 'Security Headers для Web', description: 'Готовьте CSP, SRI, SSL, security headers, проверки зависимостей и injection-тесты.' },
  },
  ar: {
    'password-identity': { title: 'كلمات المرور ورموز الهوية', description: 'أنشئ كلمات مرور قوية وافحص قوتها وأنشئ رموز TOTP.' },
    'hash-encryption': { title: 'Hash و HMAC والتشفير', description: 'أنشئ hashes وتحقق من checksums وقارن digests وشفر النصوص وموّه المقاطع.' },
    'jwt-tokens': { title: 'JWT وتصحيح الرموز', description: 'أنشئ وافك وافحص وصحح JWT payload داخل المتصفح.' },
    'web-app-security': { title: 'رؤوس أمان تطبيقات الويب', description: 'جهز CSP و SRI و SSL ورؤوس الأمان وفحص الاعتماديات والحقن.' },
  },
};

const copyByLocale: Record<Locale, SecurityToolClusterCopy> = {
  en: {
    eyebrow: 'Security workflow hub',
    h1: 'Security, Password, Hash & JWT Tools',
    title: 'Security, Password, Hash & JWT Tools',
    description: 'A focused hub for browser-side password, hash, encryption, JWT, CSP, SRI, SSL, and security header workflows.',
    seoTitle: 'Security, Password, Hash & JWT Tools',
    seoDescription: 'Free online security tools for password generation, password strength, hash generation, file hash, HMAC, checksum verification, text encryption, JWT decoder, JWT generator, CSP, SRI, SSL, and security headers.',
    intro: 'Start from the security task: create credentials, verify integrity, inspect tokens, or harden a web deployment with safer headers and checks.',
    summary: 'The cluster organizes security utilities by workflow so developers can move from a risk or token question to the right browser-side tool faster.',
    ctaLabel: 'Open security hub',
    relatedLinksTitle: 'Related security routes',
    toolCountLabel: 'tools',
    workflow: workflowFallback(),
  },
  zh: {
    eyebrow: '安全工作流中心',
    h1: '安全、密码、Hash 与 JWT 工具',
    title: '安全、密码、Hash 与 JWT 工具',
    description: '面向密码、Hash、加密、JWT、CSP、SRI、SSL 和安全头的浏览器端安全工具中心。',
    seoTitle: '安全、密码、Hash 与 JWT 工具',
    seoDescription: '免费的在线安全工具集合，覆盖密码生成、密码强度、Hash 生成、文件 Hash、HMAC、checksum 校验、文本加密、JWT 解码、JWT 生成、CSP、SRI、SSL 和安全头。',
    intro: '从安全任务开始：创建凭据、验证完整性、检查令牌，或用更安全的 Header 与检查项加固 Web 部署。',
    summary: '这个专题按安全工作流组织工具，让开发者更快从风险或令牌问题跳到合适的浏览器端工具。',
    ctaLabel: '打开安全专题',
    relatedLinksTitle: '相关安全入口',
    toolCountLabel: '个工具',
    workflow: {
      title: '安全工作流',
      items: [
        { label: '凭据', text: '生成强密码、检查密码强度，并为登录或测试创建 TOTP。', slugs: ['password-generator', 'password-strength', 'totp-generator'] },
        { label: '完整性', text: '生成 Hash/HMAC、校验文件摘要、比较文本摘要并验证 checksum。', slugs: ['hash-generator', 'file-hash', 'hmac-generator', 'checksum-verifier'] },
        { label: '令牌', text: '生成、解码和调试 JWT payload，快速定位 token 内容问题。', slugs: ['jwt-generator', 'jwt-decoder', 'jwt-debugger', 'jwt-payload-decoder'] },
        { label: '加固', text: '生成 CSP/SRI、安全头，检查 SSL、依赖漏洞和注入风险。', slugs: ['csp-generator', 'sri-hash-generator', 'security-headers-checker', 'ssl-checker'] },
      ],
    },
  },
  ja: {
    eyebrow: 'セキュリティワークフロー hub',
    h1: 'セキュリティ、パスワード、Hash、JWT ツール',
    title: 'セキュリティ、パスワード、Hash、JWT ツール',
    description: 'パスワード、Hash、暗号化、JWT、CSP、SRI、SSL、Security Header のブラウザ側ツール hub です。',
    seoTitle: 'セキュリティ、パスワード、Hash、JWT ツール',
    seoDescription: 'Password generator、password strength、hash、file hash、HMAC、checksum、text encryption、JWT decoder、JWT generator、CSP、SRI、SSL、security headers の無料ツール。',
    intro: '認証情報作成、整合性確認、トークン検査、Web デプロイのヘッダー強化から始めます。',
    summary: 'セキュリティ作業をワークフロー別に整理し、リスクやトークンの疑問から適切なツールへ早く移動できます。',
    ctaLabel: 'セキュリティ hub を開く',
    relatedLinksTitle: '関連セキュリティルート',
    toolCountLabel: 'ツール',
    workflow: workflowFallback(),
  },
  ko: {
    eyebrow: '보안 워크플로 허브',
    h1: '보안, 비밀번호, Hash 및 JWT 도구',
    title: '보안, 비밀번호, Hash 및 JWT 도구',
    description: '비밀번호, Hash, 암호화, JWT, CSP, SRI, SSL, 보안 헤더 작업을 위한 브라우저 기반 허브입니다.',
    seoTitle: '보안, 비밀번호, Hash 및 JWT 도구',
    seoDescription: '비밀번호 생성, 강도 검사, hash, file hash, HMAC, checksum, text encryption, JWT decoder, JWT generator, CSP, SRI, SSL, security headers 무료 도구.',
    intro: '자격 증명 생성, 무결성 검증, 토큰 검사, 안전한 웹 배포 헤더 강화 작업부터 시작합니다.',
    summary: '보안 유틸리티를 워크플로별로 묶어 위험이나 토큰 문제에서 적절한 브라우저 도구로 빠르게 이동합니다.',
    ctaLabel: '보안 허브 열기',
    relatedLinksTitle: '관련 보안 경로',
    toolCountLabel: '도구',
    workflow: workflowFallback(),
  },
  es: {
    eyebrow: 'Hub de seguridad',
    h1: 'Herramientas de Seguridad, Contrasenas, Hash y JWT',
    title: 'Herramientas de Seguridad, Contrasenas, Hash y JWT',
    description: 'Un hub para contrasenas, hash, cifrado, JWT, CSP, SRI, SSL y security headers en el navegador.',
    seoTitle: 'Herramientas de Seguridad, Contrasenas, Hash y JWT',
    seoDescription: 'Herramientas gratis para password generator, password strength, hash, file hash, HMAC, checksum, text encryption, JWT decoder, JWT generator, CSP, SRI, SSL y security headers.',
    intro: 'Empieza por credenciales, integridad, tokens o endurecimiento web con headers y revisiones de seguridad.',
    summary: 'El cluster organiza utilidades de seguridad por flujo para pasar de riesgo o token a la herramienta correcta.',
    ctaLabel: 'Abrir hub de seguridad',
    relatedLinksTitle: 'Rutas de seguridad relacionadas',
    toolCountLabel: 'herramientas',
    workflow: workflowFallback(),
  },
  pt: {
    eyebrow: 'Hub de seguranca',
    h1: 'Ferramentas de Seguranca, Senhas, Hash e JWT',
    title: 'Ferramentas de Seguranca, Senhas, Hash e JWT',
    description: 'Um hub para senhas, hash, criptografia, JWT, CSP, SRI, SSL e security headers no navegador.',
    seoTitle: 'Ferramentas de Seguranca, Senhas, Hash e JWT',
    seoDescription: 'Ferramentas gratis para password generator, password strength, hash, file hash, HMAC, checksum, text encryption, JWT decoder, JWT generator, CSP, SRI, SSL e security headers.',
    intro: 'Comece por credenciais, integridade, tokens ou endurecimento web com headers e verificacoes.',
    summary: 'O cluster organiza utilitarios de seguranca por fluxo para chegar rapido a ferramenta certa.',
    ctaLabel: 'Abrir hub de seguranca',
    relatedLinksTitle: 'Rotas de seguranca relacionadas',
    toolCountLabel: 'ferramentas',
    workflow: workflowFallback(),
  },
  fr: {
    eyebrow: 'Hub securite',
    h1: 'Outils Securite, Mots de Passe, Hash et JWT',
    title: 'Outils Securite, Mots de Passe, Hash et JWT',
    description: 'Un hub pour mots de passe, hash, chiffrement, JWT, CSP, SRI, SSL et security headers cote navigateur.',
    seoTitle: 'Outils Securite, Mots de Passe, Hash et JWT',
    seoDescription: 'Outils gratuits password generator, password strength, hash, file hash, HMAC, checksum, text encryption, JWT decoder, JWT generator, CSP, SRI, SSL et security headers.',
    intro: 'Partez des identifiants, de l integrite, des tokens ou du durcissement web avec headers et controles.',
    summary: 'Le cluster organise les utilitaires securite par workflow pour aller plus vite vers le bon outil.',
    ctaLabel: 'Ouvrir le hub securite',
    relatedLinksTitle: 'Parcours securite associes',
    toolCountLabel: 'outils',
    workflow: workflowFallback(),
  },
  de: {
    eyebrow: 'Security-Workflow-Hub',
    h1: 'Security, Passwort, Hash und JWT Tools',
    title: 'Security, Passwort, Hash und JWT Tools',
    description: 'Ein Hub fur Passwort-, Hash-, Verschlusselungs-, JWT-, CSP-, SRI-, SSL- und Security-Header-Workflows.',
    seoTitle: 'Security, Passwort, Hash und JWT Tools',
    seoDescription: 'Kostenlose Security-Tools fur Password Generator, Password Strength, Hash, File Hash, HMAC, Checksum, Text Encryption, JWT Decoder, JWT Generator, CSP, SRI, SSL und Security Headers.',
    intro: 'Starten Sie mit Credentials, Integritat, Token-Inspektion oder Web-Hartung mit sicheren Headers und Checks.',
    summary: 'Der Cluster ordnet Security-Utilities nach Workflow, damit Entwickler schneller das passende Browser-Tool finden.',
    ctaLabel: 'Security-Hub offnen',
    relatedLinksTitle: 'Verwandte Security-Routen',
    toolCountLabel: 'Tools',
    workflow: workflowFallback(),
  },
  ru: {
    eyebrow: 'Центр security workflow',
    h1: 'Инструменты Security, Password, Hash и JWT',
    title: 'Инструменты Security, Password, Hash и JWT',
    description: 'Хаб для паролей, hash, шифрования, JWT, CSP, SRI, SSL и security headers в браузере.',
    seoTitle: 'Инструменты Security, Password, Hash и JWT',
    seoDescription: 'Бесплатные инструменты password generator, password strength, hash, file hash, HMAC, checksum, text encryption, JWT decoder, JWT generator, CSP, SRI, SSL и security headers.',
    intro: 'Начните с credentials, проверки целостности, токенов или усиления web deployment через headers и проверки.',
    summary: 'Кластер группирует security utilities по workflow, чтобы быстрее перейти от риска или токена к нужному инструменту.',
    ctaLabel: 'Открыть security hub',
    relatedLinksTitle: 'Связанные security маршруты',
    toolCountLabel: 'инструментов',
    workflow: workflowFallback(),
  },
  ar: {
    eyebrow: 'مركز سير عمل الأمان',
    h1: 'أدوات الأمان وكلمات المرور و Hash و JWT',
    title: 'أدوات الأمان وكلمات المرور و Hash و JWT',
    description: 'مركز لمهام كلمات المرور و hash والتشفير و JWT و CSP و SRI و SSL ورؤوس الأمان داخل المتصفح.',
    seoTitle: 'أدوات الأمان وكلمات المرور و Hash و JWT',
    seoDescription: 'أدوات مجانية تشمل password generator و password strength و hash و file hash و HMAC و checksum و text encryption و JWT decoder و JWT generator و CSP و SRI و SSL و security headers.',
    intro: 'ابدأ بإنشاء الاعتمادات أو التحقق من السلامة أو فحص الرموز أو تقوية نشر الويب بالرؤوس والفحوص.',
    summary: 'ينظم هذا المركز أدوات الأمان حسب workflow للوصول بسرعة من المخاطر أو الرموز إلى الأداة المناسبة.',
    ctaLabel: 'افتح مركز الأمان',
    relatedLinksTitle: 'مسارات أمان مرتبطة',
    toolCountLabel: 'أداة',
    workflow: workflowFallback(),
  },
};

function workflowFallback(): SecurityToolClusterCopy['workflow'] {
  return {
    title: 'Security workflow',
    items: [
      { label: 'Credentials', text: 'Generate strong passwords, check password strength, and create TOTP codes for login flows.', slugs: ['password-generator', 'password-strength', 'totp-generator'] },
      { label: 'Integrity', text: 'Create hashes and HMACs, verify file digests, compare text hashes, and check checksums.', slugs: ['hash-generator', 'file-hash', 'hmac-generator', 'checksum-verifier'] },
      { label: 'Tokens', text: 'Generate, decode, inspect, and debug JWT payloads before wiring auth flows.', slugs: ['jwt-generator', 'jwt-decoder', 'jwt-debugger', 'jwt-payload-decoder'] },
      { label: 'Harden', text: 'Generate CSP and SRI, inspect SSL, check security headers, and catch common web risks.', slugs: ['csp-generator', 'sri-hash-generator', 'security-headers-checker', 'ssl-checker'] },
    ],
  };
}

export function getSecurityToolClusterCopy(locale: Locale): SecurityToolClusterCopy {
  return resolveClusterCopy(copyByLocale, locale);
}

export function buildSecurityToolClusterItems(
  locale: Locale,
  categoryNames: Record<string, string>,
  toolNames: Record<string, string>,
  toolDescriptions: Record<string, string>,
  slugs: readonly string[] = securityToolClusterSlugs
): SecurityToolClusterItem[] {
  return factoryBuildItems(locale, categoryNames, toolNames, toolDescriptions, slugs);
}

export function buildSecurityToolClusterGroups(
  locale: Locale,
  categoryNames: Record<string, string>,
  toolNames: Record<string, string>,
  toolDescriptions: Record<string, string>
): SecurityToolClusterGroup[] {
  return factoryBuildGroups(locale, categoryNames, toolNames, toolDescriptions, groupSlugs, groupCopy);
}

export function buildSecurityToolClusterGroupForTool(
  locale: Locale,
  slug: string,
  categoryNames: Record<string, string>,
  toolNames: Record<string, string>,
  toolDescriptions: Record<string, string>
): SecurityToolClusterGroup | null {
  return factoryBuildGroupForTool(locale, slug, categoryNames, toolNames, toolDescriptions, groupSlugs, groupCopy);
}

export function buildSecurityToolClusterItemList(
  baseUrl: string,
  locale: Locale,
  groups: SecurityToolClusterGroup[]
): Record<string, unknown> {
  return factoryBuildItemList(baseUrl, locale, groups, getSecurityToolClusterCopy(locale).title);
}

export function buildSecurityToolClusterCollectionData(
  baseUrl: string,
  locale: Locale,
  groups: SecurityToolClusterGroup[]
): Record<string, unknown> {
  return factoryBuildCollectionData(baseUrl, locale, groups, securityToolClusterPath, getSecurityToolClusterCopy(locale));
}
