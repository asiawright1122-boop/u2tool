import fs from 'node:fs';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

function readTool(locale: string, slug: string): string {
  return fs.readFileSync(
    path.join(process.cwd(), 'src/messages', locale, 'tools', `${slug}.json`),
    'utf8'
  );
}

function readBaseTool(locale: string, slug: string): Record<string, unknown> {
  const base = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), 'src/messages', locale, 'base.json'), 'utf8')
  ) as { tools: Record<string, Record<string, unknown>> };
  return base.tools[slug] ?? {};
}

describe('organic search P0 content contracts', () => {
  it('aligns Korean HTML viewer metadata and support copy with the sandboxed runtime', () => {
    const metadata = readBaseTool('ko', 'html-preview');
    const content = readTool('ko', 'html-preview');

    expect(metadata.seo_title).toMatch(/HTML 뷰어 온라인/i);
    expect(metadata.seo_description).toMatch(/HTML과 CSS/);
    expect(metadata.seo_description).toMatch(/JavaScript를 실행하지/);
    expect(content).toMatch(/HTML 뷰어 온라인/i);
    expect(content).toMatch(/JavaScript 실행 환경이 아닙니다/);
  });

  it('separates Russian IP validation from geolocation lookup intent', () => {
    const content = readTool('ru', 'ip-validator');

    expect(content).toMatch(/проверка IP адреса/i);
    expect(content).toMatch(/IPv4 или IPv6/);
    expect(content).toMatch(/один адрес/i);
    expect(content).toMatch(/поиск IP адреса/i);
    expect(content).toMatch(/не обрабатывает списки адресов|не поддерживает CIDR/i);
  });

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

    expect(content).toMatch(/провер(?:яет|ку) английск(?:ий|ого) текст/i);
    expect(content).toMatch(/не проверяет русскую грамматику/i);
    expect(content).toMatch(/не использует ИИ и серверную обработку/i);
  });
});
