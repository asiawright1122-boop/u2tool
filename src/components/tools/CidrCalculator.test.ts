import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { calculateCidr } from './CidrCalculator';

/**
 * **Feature: add-new-tools, Property 7: CIDR 计算正确性**
 * *For any* 有效的 CIDR 表示法，计算出的 IP 范围应该包含正确数量的 IP 地址
 * **Validates: Requirements 7.4**
 */
describe('Property 7: CIDR Calculation Correctness', () => {
  it('should calculate correct number of total hosts', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 255 }),
        fc.integer({ min: 0, max: 255 }),
        fc.integer({ min: 0, max: 255 }),
        fc.integer({ min: 0, max: 255 }),
        fc.integer({ min: 0, max: 32 }),
        (a, b, c, d, prefix) => {
          const cidr = `${a}.${b}.${c}.${d}/${prefix}`;
          const result = calculateCidr(cidr);
          
          expect(result).not.toBeNull();
          if (result) {
            const expectedTotal = Math.pow(2, 32 - prefix);
            expect(result.totalHosts).toBe(expectedTotal);
          }
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should calculate correct usable hosts', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 32 }),
        (prefix) => {
          const cidr = `192.168.1.0/${prefix}`;
          const result = calculateCidr(cidr);
          
          expect(result).not.toBeNull();
          if (result) {
            const expectedUsable = prefix >= 31 
              ? Math.pow(2, 32 - prefix) 
              : Math.pow(2, 32 - prefix) - 2;
            expect(result.usableHosts).toBe(expectedUsable);
          }
          return true;
        }
      ),
      { numRuns: 33 }
    );
  });

  it('should have network address less than or equal to broadcast', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 255 }),
        fc.integer({ min: 0, max: 255 }),
        fc.integer({ min: 0, max: 255 }),
        fc.integer({ min: 0, max: 255 }),
        fc.integer({ min: 0, max: 32 }),
        (a, b, c, d, prefix) => {
          const cidr = `${a}.${b}.${c}.${d}/${prefix}`;
          const result = calculateCidr(cidr);
          
          if (result) {
            const networkParts = result.networkAddress.split('.').map(Number);
            const broadcastParts = result.broadcastAddress.split('.').map(Number);
            
            const networkInt = (networkParts[0] << 24) + (networkParts[1] << 16) + 
                              (networkParts[2] << 8) + networkParts[3];
            const broadcastInt = (broadcastParts[0] << 24) + (broadcastParts[1] << 16) + 
                                (broadcastParts[2] << 8) + broadcastParts[3];
            
            expect(networkInt >>> 0).toBeLessThanOrEqual(broadcastInt >>> 0);
          }
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should return null for invalid CIDR', () => {
    const invalidCidrs = [
      '256.0.0.0/24',
      '192.168.1.0/33',
      'invalid',
      '192.168.1/24',
      '192.168.1.0',
    ];

    for (const cidr of invalidCidrs) {
      expect(calculateCidr(cidr)).toBeNull();
    }
  });

  it('should calculate correct subnet mask', () => {
    const testCases = [
      { prefix: 24, mask: '255.255.255.0' },
      { prefix: 16, mask: '255.255.0.0' },
      { prefix: 8, mask: '255.0.0.0' },
      { prefix: 32, mask: '255.255.255.255' },
      { prefix: 0, mask: '0.0.0.0' },
    ];

    for (const { prefix, mask } of testCases) {
      const result = calculateCidr(`192.168.1.0/${prefix}`);
      expect(result?.subnetMask).toBe(mask);
    }
  });

  it('should have first host after network address (for prefix < 31)', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 30 }),
        (prefix) => {
          const result = calculateCidr(`192.168.1.0/${prefix}`);
          
          if (result) {
            const networkParts = result.networkAddress.split('.').map(Number);
            const firstHostParts = result.firstHost.split('.').map(Number);
            
            const networkInt = (networkParts[0] << 24) + (networkParts[1] << 16) + 
                              (networkParts[2] << 8) + networkParts[3];
            const firstHostInt = (firstHostParts[0] << 24) + (firstHostParts[1] << 16) + 
                                (firstHostParts[2] << 8) + firstHostParts[3];
            
            expect((firstHostInt >>> 0) - (networkInt >>> 0)).toBe(1);
          }
          return true;
        }
      ),
      { numRuns: 31 }
    );
  });
});
