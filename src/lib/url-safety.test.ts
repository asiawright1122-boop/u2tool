import { describe, expect, it } from 'vitest';
import { normalizeHttpUrl, normalizeWebSocketUrl, resolveHttpUrl } from './url-safety';

describe('url safety helpers', () => {
  it('normalizes http URLs and rejects unsafe protocols', () => {
    expect(normalizeHttpUrl('example.com/path').ok).toBe(true);
    expect(normalizeHttpUrl('example.com/path')).toMatchObject({
      ok: true,
      url: 'https://example.com/path',
    });
    expect(normalizeHttpUrl('http://example.com')).toMatchObject({
      ok: true,
      url: 'http://example.com/',
    });

    expect(normalizeHttpUrl('javascript:alert(1)')).toMatchObject({ ok: false });
    expect(normalizeHttpUrl('data:text/html,hello')).toMatchObject({ ok: false });
    expect(normalizeHttpUrl('https://user:pass@example.com')).toMatchObject({ ok: false });
  });

  it('normalizes websocket URLs and rejects non-websocket protocols', () => {
    expect(normalizeWebSocketUrl('socket.example.com/live')).toMatchObject({
      ok: true,
      url: 'wss://socket.example.com/live',
    });
    expect(normalizeWebSocketUrl('ws://example.com/socket')).toMatchObject({
      ok: true,
      url: 'ws://example.com/socket',
    });

    expect(normalizeWebSocketUrl('https://example.com/socket')).toMatchObject({ ok: false });
    expect(normalizeWebSocketUrl('javascript:alert(1)')).toMatchObject({ ok: false });
  });

  it('resolves relative http resources against a trusted base', () => {
    expect(resolveHttpUrl('/assets/card.png', 'https://example.com/posts/one')).toBe(
      'https://example.com/assets/card.png'
    );
    expect(resolveHttpUrl('images/card.png', 'https://example.com/posts/one')).toBe(
      'https://example.com/posts/images/card.png'
    );
    expect(resolveHttpUrl('javascript:alert(1)', 'https://example.com/posts/one')).toBe('');
  });
});
