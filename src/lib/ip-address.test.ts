import { describe, expect, it } from 'vitest';

import { classifyIpAddress, isValidIpv4, isValidIpv6 } from './ip-address';

describe('IP address validation', () => {
  it.each(['8.8.8.8', '192.168.0.1', '0.0.0.0', '255.255.255.255'])(
    'accepts valid IPv4 %s',
    (input) => {
      expect(isValidIpv4(input)).toBe(true);
      expect(classifyIpAddress(input)).toBe('ipv4');
    }
  );

  it.each(['256.1.1.1', '1.2.3', '1.2.3.4.5', 'one.two.three.four'])(
    'rejects invalid IPv4 %s',
    (input) => {
      expect(isValidIpv4(input)).toBe(false);
    }
  );

  it.each(['2001:db8::1', '::1', 'fe80::abcd:1234'])('accepts valid IPv6 %s', (input) => {
    expect(isValidIpv6(input)).toBe(true);
    expect(classifyIpAddress(input)).toBe('ipv6');
  });

  it.each(['2001:::1', 'gggg::1', 'fe80::1%en0', 'not-an-ip'])(
    'rejects invalid IPv6 %s',
    (input) => {
      expect(isValidIpv6(input)).toBe(false);
      expect(classifyIpAddress(input)).toBe(null);
    }
  );
});
