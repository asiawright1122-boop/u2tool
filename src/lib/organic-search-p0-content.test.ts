import fs from 'node:fs';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

function readTool(locale: string, slug: string): string {
  return fs.readFileSync(
    path.join(process.cwd(), 'src/messages', locale, 'tools', `${slug}.json`),
    'utf8'
  );
}

describe('organic search P0 content contracts', () => {
  it('keeps Russian IP lookup aligned with the observed query family and real provider', () => {
    const content = readTool('ru', 'ip-lookup');

    expect(content).toMatch(/проверку IP-адреса онлайн/i);
    expect(content).toMatch(/IPv4 или IPv6/);
    expect(content).toContain('ipwho.is');
    expect(content).toMatch(/не выводит WHOIS, BGP-маршруты или reverse DNS/i);
  });

  it('explains IBAN validation failures and the MOD-97 evidence', () => {
    const content = readTool('en', 'iban-validator');

    expect(content).toContain('Why is my IBAN invalid?');
    expect(content).toContain('How does the MOD-97 checksum work?');
    expect(content).toMatch(/does not (contact banks|prove that the bank account exists)/i);
  });

  it('positions iCal as an inspector without claiming full RFC validation', () => {
    const content = readTool('en', 'ical-parser');

    expect(content).toContain('Is this a complete ICS validator?');
    expect(content).toContain('RFC 5545');
    expect(content).toMatch(/does not (certify|sync calendars)/i);
  });

  it('keeps Russian grammar search intent scoped to English input', () => {
    const content = readTool('ru', 'grammar-checker');

    expect(content).toMatch(/проверку английского текста/i);
    expect(content).toMatch(/не проверяет русскую грамматику/i);
    expect(content).toMatch(/не использует ИИ и серверную обработку/i);
  });
});
