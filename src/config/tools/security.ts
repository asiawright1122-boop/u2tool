import type { Tool } from './types';

export const SECURITY_TOOLS: Tool[] = [
  { slug: 'password-generator', category: 'security', icon: 'key', component: 'PasswordGenerator', popular: true },
  { slug: 'hash-generator', category: 'security', icon: 'hash', component: 'HashGenerator', popular: true },
  { slug: 'text-encryption', category: 'security', icon: 'lock-keyhole', component: 'TextEncryption', popular: true },
  { slug: 'file-hash', category: 'security', icon: 'file-lock-2', component: 'FileHash' },
  { slug: 'hmac-generator', category: 'security', icon: 'shield-check', component: 'HmacGenerator' },
  { slug: 'password-strength', category: 'security', icon: 'shield-check', component: 'PasswordStrength' },
  { slug: 'totp-generator', category: 'security', icon: 'shield-check', component: 'TotpGenerator' },
  { slug: 'jwt-generator', category: 'security', icon: 'shield-check', component: 'JwtGenerator' },
  { slug: 'text-hash-comparator', category: 'security', icon: 'shield-check', component: 'TextHashComparator' },
  { slug: 'string-obfuscator', category: 'security', icon: 'shield-check', component: 'StringObfuscator' },
  { slug: 'js-obfuscator', category: 'security', icon: 'shield-check', component: 'JsObfuscator' },
  { slug: 'jwt-debugger', category: 'security', icon: 'shield-check', component: 'JwtDebugger' },
  { slug: 'csp-generator', category: 'security', icon: 'shield-check', component: 'CspGenerator' },
  { slug: 'sri-hash-generator', category: 'security', icon: 'shield-check', component: 'SriHashGenerator' },
  { slug: 'checksum-verifier', category: 'security', icon: 'shield-check', component: 'ChecksumVerifier' },
  { slug: 'jwt-payload-decoder', category: 'security', icon: 'shield-check', component: 'JwtPayloadDecoder' },
  { slug: 'dependency-vulnerability-checker', category: 'security', icon: 'shield-check', component: 'DependencyVulnerabilityChecker' },
  { slug: 'sql-injection-tester', category: 'security', icon: 'shield-check', component: 'SqlInjectionTester' },
  { slug: 'security-headers-checker', category: 'security', icon: 'shield-check', component: 'PopularUtilityTool', popular: true },
];
