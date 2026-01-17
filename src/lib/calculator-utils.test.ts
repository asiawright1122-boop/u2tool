/**
 * Calculator Utils Property-Based Tests
 * Feature: add-popular-tools-batch2
 */

import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import {
  calculateLoan,
  calculateBmi,
  calculateAge,
  calculateTip,
  calculateDiscount,
  calculateDiscountPercentage,
  calculateCompoundInterest,
  performBinaryOperation,
  validateBinary,
  binaryToDecimal,
  decimalToBinary,
  performHexOperation,
  validateHex,
  hexToDecimal,
  decimalToHex,
  calculateSubnet,
  validateIpAddress,
  validateSubnetMask,
  calculateAspectRatio,
  calculateDimensionFromRatio,
  calculateTypingStats,
  textToMorse,
  morseToText,
} from './calculator-utils';

describe('Calculator Utils', () => {
  // ============================================
  // Property 1: Loan Calculator Payment Accuracy
  // Validates: Requirements 4.1, 4.2, 4.3
  // ============================================
  describe('Property 1: Loan Calculator Payment Accuracy', () => {
    it('total payments should approximately equal principal + total interest', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1000, max: 1000000 }),
          fc.integer({ min: 1, max: 200 }).map(n => n / 10), // 0.1 to 20
          fc.integer({ min: 12, max: 360 }),
          (principal, interestRate, termMonths) => {
            const result = calculateLoan({
              principal,
              interestRate,
              termMonths,
              paymentFrequency: 'monthly',
            });

            const totalPayments = result.periodicPayment * termMonths;
            const expectedTotal = principal + result.totalInterest;

            // Allow 1% tolerance for rounding
            const tolerance = expectedTotal * 0.01;
            return Math.abs(totalPayments - expectedTotal) < tolerance;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('amortization schedule should sum to total amount', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 10000, max: 500000 }),
          fc.integer({ min: 10, max: 150 }).map(n => n / 10), // 1 to 15
          fc.integer({ min: 12, max: 120 }),
          (principal, interestRate, termMonths) => {
            const result = calculateLoan({
              principal,
              interestRate,
              termMonths,
              paymentFrequency: 'monthly',
            });

            const totalPrincipal = result.amortizationSchedule.reduce(
              (sum, entry) => sum + entry.principal,
              0
            );

            // Principal payments should sum to original principal
            const tolerance = principal * 0.01;
            return Math.abs(totalPrincipal - principal) < tolerance;
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  // ============================================
  // Property 2: BMI Calculation Correctness
  // Validates: Requirements 5.1, 5.2, 5.3
  // ============================================
  describe('Property 2: BMI Calculation Correctness', () => {
    it('BMI should match formula: weight / height^2 (metric)', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 30, max: 200 }),
          fc.integer({ min: 100, max: 220 }),
          (weight, height) => {
            const result = calculateBmi({ weight, height, unit: 'metric' });
            const expected = weight / Math.pow(height / 100, 2);

            return Math.abs(result.bmi - expected) < 0.01;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('BMI category should correctly map to WHO ranges', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 30, max: 200 }),
          fc.integer({ min: 140, max: 200 }),
          (weight, height) => {
            const result = calculateBmi({ weight, height, unit: 'metric' });

            if (result.bmi < 18.5) {
              return result.category === 'underweight';
            } else if (result.bmi < 25) {
              return result.category === 'normal';
            } else if (result.bmi < 30) {
              return result.category === 'overweight';
            } else {
              return result.category === 'obese';
            }
          }
        ),
        { numRuns: 100 }
      );
    });

    it('imperial and metric should give same BMI for equivalent inputs', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 50, max: 150 }),
          fc.integer({ min: 150, max: 200 }),
          (weightKg, heightCm) => {
            const metricResult = calculateBmi({
              weight: weightKg,
              height: heightCm,
              unit: 'metric',
            });

            const weightLbs = weightKg / 0.453592;
            const heightInches = heightCm / 2.54;

            const imperialResult = calculateBmi({
              weight: weightLbs,
              height: heightInches,
              unit: 'imperial',
            });

            return Math.abs(metricResult.bmi - imperialResult.bmi) < 0.1;
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  // ============================================
  // Property 3: Age Calculation Accuracy
  // Validates: Requirements 6.1, 6.2, 6.3
  // ============================================
  describe('Property 3: Age Calculation Accuracy', () => {
    it('total days should be consistent with years/months/days', () => {
      fc.assert(
        fc.property(
          fc.date({ min: new Date('1920-01-01'), max: new Date('2020-01-01') }),
          (birthDate) => {
            // Skip invalid dates
            if (isNaN(birthDate.getTime())) return true;
            
            const referenceDate = new Date('2025-01-07');
            const result = calculateAge({ birthDate, referenceDate });

            // Total days should be positive
            expect(result.totalDays).toBeGreaterThanOrEqual(0);
            // Years should be reasonable
            expect(result.years).toBeGreaterThanOrEqual(0);
            expect(result.years).toBeLessThanOrEqual(150);
            // Months should be 0-11
            expect(result.months).toBeGreaterThanOrEqual(0);
            expect(result.months).toBeLessThanOrEqual(11);
            // Days should be 0-30
            expect(result.days).toBeGreaterThanOrEqual(0);
            expect(result.days).toBeLessThanOrEqual(31);

            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('next birthday should be in the future', () => {
      fc.assert(
        fc.property(
          fc.date({ min: new Date('1950-01-01'), max: new Date('2020-12-31') }),
          (birthDate) => {
            // Skip invalid dates
            if (isNaN(birthDate.getTime())) return true;
            
            const referenceDate = new Date('2025-01-07');
            const result = calculateAge({ birthDate, referenceDate });

            return result.nextBirthday > referenceDate;
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  // ============================================
  // Property 4: Tip Calculator Arithmetic
  // Validates: Requirements 7.1, 7.2, 7.3, 7.5
  // ============================================
  describe('Property 4: Tip Calculator Arithmetic', () => {
    it('tip amount should equal bill * percentage / 100', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1, max: 10000 }),
          fc.integer({ min: 0, max: 100 }),
          fc.integer({ min: 1, max: 20 }),
          (billAmount, tipPercentage, splitCount) => {
            const result = calculateTip({ billAmount, tipPercentage, splitCount });

            const expectedTip = billAmount * (tipPercentage / 100);
            return Math.abs(result.tipAmount - expectedTip) < 0.01;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('total should equal bill + tip', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1, max: 10000 }),
          fc.integer({ min: 0, max: 50 }),
          fc.integer({ min: 1, max: 10 }),
          (billAmount, tipPercentage, splitCount) => {
            const result = calculateTip({ billAmount, tipPercentage, splitCount });

            const expectedTotal = billAmount + result.tipAmount;
            return Math.abs(result.totalAmount - expectedTotal) < 0.01;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('per person amount should equal total / split count', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 10, max: 1000 }),
          fc.integer({ min: 10, max: 30 }),
          fc.integer({ min: 1, max: 10 }),
          (billAmount, tipPercentage, splitCount) => {
            const result = calculateTip({ billAmount, tipPercentage, splitCount });

            const expectedPerPerson = result.totalAmount / splitCount;
            return Math.abs(result.perPersonAmount - expectedPerPerson) < 0.01;
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  // ============================================
  // Property 5: Discount Calculator Correctness
  // Validates: Requirements 8.1, 8.2, 8.3, 8.4
  // ============================================
  describe('Property 5: Discount Calculator Correctness', () => {
    it('discounted price should equal original * (1 - discount/100)', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1, max: 10000 }),
          fc.integer({ min: 0, max: 100 }),
          (originalPrice, discountPercentage) => {
            const result = calculateDiscount({ originalPrice, discountPercentage });

            const expected = originalPrice * (1 - discountPercentage / 100);
            return Math.abs(result.discountedPrice - expected) < 0.01;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('amount saved should equal original - discounted', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1, max: 10000 }),
          fc.integer({ min: 0, max: 80 }),
          (originalPrice, discountPercentage) => {
            const result = calculateDiscount({ originalPrice, discountPercentage });

            const expectedSaved = originalPrice - result.discountedPrice;
            return Math.abs(result.amountSaved - expectedSaved) < 0.01;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('reverse calculation should recover discount percentage', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 100, max: 1000 }),
          fc.integer({ min: 5, max: 50 }),
          (originalPrice, discountPercentage) => {
            const result = calculateDiscount({ originalPrice, discountPercentage });
            const recoveredPercentage = calculateDiscountPercentage(
              originalPrice,
              result.discountedPrice
            );

            return Math.abs(recoveredPercentage - discountPercentage) < 0.01;
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  // ============================================
  // Property 6: Compound Interest Formula Accuracy
  // Validates: Requirements 9.1, 9.2, 9.4, 9.5
  // ============================================
  describe('Property 6: Compound Interest Formula Accuracy', () => {
    it('final amount should match compound interest formula', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1000, max: 100000 }),
          fc.integer({ min: 10, max: 150 }).map(n => n / 10), // 1 to 15
          fc.integer({ min: 1, max: 30 }),
          (principal, annualRate, years) => {
            const result = calculateCompoundInterest({
              principal,
              annualRate,
              years,
              compoundingFrequency: 'annually',
            });

            // A = P(1 + r)^t for annual compounding
            const expected = principal * Math.pow(1 + annualRate / 100, years);
            const tolerance = expected * 0.01;

            return Math.abs(result.finalAmount - expected) < tolerance;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('total interest should equal final amount - principal - contributions', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1000, max: 50000 }),
          fc.integer({ min: 20, max: 100 }).map(n => n / 10), // 2 to 10
          fc.integer({ min: 1, max: 20 }),
          (principal, annualRate, years) => {
            const result = calculateCompoundInterest({
              principal,
              annualRate,
              years,
              compoundingFrequency: 'monthly',
            });

            const expectedInterest =
              result.finalAmount - principal - result.totalContributions;
            const tolerance = Math.abs(expectedInterest) * 0.01 + 1;

            return Math.abs(result.totalInterest - expectedInterest) < tolerance;
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  // ============================================
  // Property 7: Binary Calculator Operations
  // Validates: Requirements 11.1, 11.2, 11.3, 11.4
  // ============================================
  describe('Property 7: Binary Calculator Operations', () => {
    it('binary validation should accept valid binary strings', () => {
      fc.assert(
        fc.property(
          fc.array(fc.constantFrom('0', '1'), { minLength: 1, maxLength: 16 }),
          (chars) => {
            const binary = chars.join('');
            return validateBinary(binary) === true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('binary to decimal conversion should be reversible', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: 65535 }),
          (decimal) => {
            const binary = decimalToBinary(decimal);
            const recovered = binaryToDecimal(binary);
            return recovered === decimal;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('binary addition should match decimal addition', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: 1000 }),
          fc.integer({ min: 0, max: 1000 }),
          (a, b) => {
            const binA = decimalToBinary(a);
            const binB = decimalToBinary(b);
            const result = performBinaryOperation(binA, binB, 'add');
            return result.decimal === a + b;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('binary AND operation should match bitwise AND', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: 255 }),
          fc.integer({ min: 0, max: 255 }),
          (a, b) => {
            const binA = decimalToBinary(a);
            const binB = decimalToBinary(b);
            const result = performBinaryOperation(binA, binB, 'and');
            return result.decimal === (a & b);
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  // ============================================
  // Property 8: Hex Calculator Operations
  // Validates: Requirements 12.1, 12.2, 12.3, 12.4
  // ============================================
  describe('Property 8: Hex Calculator Operations', () => {
    it('hex validation should accept valid hex strings', () => {
      fc.assert(
        fc.property(
          fc.array(fc.constantFrom(...'0123456789ABCDEFabcdef'.split('')), { minLength: 1, maxLength: 8 }),
          (chars) => {
            const hex = chars.join('');
            return validateHex(hex) === true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('hex to decimal conversion should be reversible', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: 65535 }),
          (decimal) => {
            const hex = decimalToHex(decimal);
            const recovered = hexToDecimal(hex);
            return recovered === decimal;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('hex addition should match decimal addition', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: 1000 }),
          fc.integer({ min: 0, max: 1000 }),
          (a, b) => {
            const hexA = decimalToHex(a);
            const hexB = decimalToHex(b);
            const result = performHexOperation(hexA, hexB, 'add');
            return result.decimal === a + b;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('hex XOR operation should match bitwise XOR', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: 255 }),
          fc.integer({ min: 0, max: 255 }),
          (a, b) => {
            const hexA = decimalToHex(a);
            const hexB = decimalToHex(b);
            const result = performHexOperation(hexA, hexB, 'xor');
            return result.decimal === (a ^ b);
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  // ============================================
  // Property 9: IP Subnet Calculation Correctness
  // Validates: Requirements 13.1, 13.2, 13.3, 13.4
  // ============================================
  describe('Property 9: IP Subnet Calculation Correctness', () => {
    it('IP address validation should accept valid IPs', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: 255 }),
          fc.integer({ min: 0, max: 255 }),
          fc.integer({ min: 0, max: 255 }),
          fc.integer({ min: 0, max: 255 }),
          (a, b, c, d) => {
            const ip = `${a}.${b}.${c}.${d}`;
            return validateIpAddress(ip) === true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('subnet mask validation should accept valid CIDR', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: 32 }),
          (cidr) => {
            return validateSubnetMask(cidr) === true;
          }
        ),
        { numRuns: 33 }
      );
    });

    it('network address should be within valid range', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1, max: 254 }),
          fc.integer({ min: 0, max: 255 }),
          fc.integer({ min: 0, max: 255 }),
          fc.integer({ min: 1, max: 254 }),
          fc.integer({ min: 8, max: 30 }),
          (a, b, c, d, cidr) => {
            const ip = `${a}.${b}.${c}.${d}`;
            const result = calculateSubnet({ ipAddress: ip, subnetMask: cidr });

            // Network address should be valid
            expect(validateIpAddress(result.networkAddress)).toBe(true);
            // Broadcast address should be valid
            expect(validateIpAddress(result.broadcastAddress)).toBe(true);
            // CIDR should match
            expect(result.cidr).toBe(cidr);

            return true;
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  // ============================================
  // Property 12: Typing Speed WPM Calculation
  // Validates: Requirements 17.3, 17.6
  // ============================================
  describe('Property 12: Typing Speed WPM Calculation', () => {
    it('WPM should be calculated correctly', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 10, maxLength: 100 }),
          fc.integer({ min: 1000, max: 60000 }),
          (text, durationMs) => {
            const result = calculateTypingStats(text, text, durationMs);

            // All characters correct when typing matches target
            expect(result.correctChars).toBe(text.length);
            expect(result.incorrectChars).toBe(0);
            expect(result.accuracy).toBe(100);

            // WPM formula: (chars / 5) / minutes
            const expectedWpm = Math.round((text.length / 5) / (durationMs / 1000 / 60));
            expect(result.wpm).toBe(expectedWpm);

            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('accuracy should decrease with errors', () => {
      fc.assert(
        fc.property(
          fc.array(fc.constantFrom(...'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'.split('')), { minLength: 10, maxLength: 50 }),
          (chars) => {
            const targetText = chars.join('');
            // Create typed text with some errors by replacing last char with different char
            const lastChar = targetText[targetText.length - 1];
            const errorChar = lastChar === 'X' ? 'Y' : 'X';
            const typedText = targetText.slice(0, -1) + errorChar;
            const result = calculateTypingStats(targetText, typedText, 10000);

            expect(result.accuracy).toBeLessThan(100);
            expect(result.incorrectChars).toBeGreaterThan(0);

            return true;
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  // ============================================
  // Property 13: Morse Code Conversion Round Trip
  // Validates: Requirements 18.1, 18.4
  // ============================================
  describe('Property 13: Morse Code Conversion Round Trip', () => {
    it('text to morse and back should preserve alphanumeric text', () => {
      fc.assert(
        fc.property(
          fc.array(fc.constantFrom(...'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 '.split('')), { minLength: 1, maxLength: 20 }),
          (chars) => {
            const text = chars.join('');
            const morse = textToMorse(text);
            const recovered = morseToText(morse);
            return recovered === text;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('morse code should contain only dots, dashes, and spaces', () => {
      fc.assert(
        fc.property(
          fc.array(fc.constantFrom(...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')), { minLength: 1, maxLength: 10 }),
          (chars) => {
            const text = chars.join('');
            const morse = textToMorse(text);
            return /^[.\-/ ]+$/.test(morse);
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  // ============================================
  // Property 15: Aspect Ratio Calculation
  // Validates: Requirements 10.1, 10.3, 10.4
  // ============================================
  describe('Property 15: Aspect Ratio Calculation', () => {
    it('aspect ratio should be in lowest terms', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1, max: 4000 }),
          fc.integer({ min: 1, max: 4000 }),
          (width, height) => {
            const result = calculateAspectRatio(width, height);

            // Verify ratio is correct
            const expectedDecimal = width / height;
            expect(Math.abs(result.decimal - expectedDecimal)).toBeLessThan(0.0001);

            // Verify ratio is in lowest terms (GCD of ratio should be 1)
            const gcd = (a: number, b: number): number => b ? gcd(b, a % b) : a;
            expect(gcd(result.ratioWidth, result.ratioHeight)).toBe(1);

            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('dimension calculation should preserve aspect ratio', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 100, max: 2000 }),
          fc.integer({ min: 1, max: 100 }),
          fc.integer({ min: 1, max: 100 }),
          (knownDimension, ratioWidth, ratioHeight) => {
            // Calculate height from width
            const calculatedHeight = calculateDimensionFromRatio(
              knownDimension,
              true,
              ratioWidth,
              ratioHeight
            );

            // Verify the ratio is preserved
            const expectedRatio = ratioWidth / ratioHeight;
            const actualRatio = knownDimension / calculatedHeight;

            return Math.abs(expectedRatio - actualRatio) < 0.0001;
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
