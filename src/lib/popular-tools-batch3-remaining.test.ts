import { describe, expect, it } from 'vitest';
import * as fc from 'fast-check';
import {
  analyzeKeywordDensity,
  areShoeSystemsConsistent,
  convertNumberBase,
  generateTeams,
  validateNumberInput,
  type NumberBase,
} from './popular-tools-batch3-remaining';
import {
  convertShoeSize,
  getAvailableSizes,
  type Gender,
  type SizeSystem,
} from './data/shoe-sizes';

const genders: Gender[] = ['men', 'women'];
const sizeSystems: SizeSystem[] = ['us_men', 'us_women', 'uk', 'eu', 'jp', 'cn'];
const bases: NumberBase[] = [2, 8, 10, 16];

describe('popular-tools-batch3 remaining properties', () => {
  it('Property 15: Shoe Size Conversion Consistency', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...genders),
        fc.constantFrom(...sizeSystems),
        fc.constantFrom(...sizeSystems),
        (gender, fromSystem, toSystem) => {
          const sizes = getAvailableSizes(fromSystem, gender);
          for (const size of sizes) {
            const converted = convertShoeSize(size, fromSystem, toSystem, gender);
            expect(converted).not.toBeNull();

            const roundTrip = convertShoeSize(converted!, toSystem, fromSystem, gender);
            expect(roundTrip).not.toBeNull();
            expect(Math.abs(roundTrip! - size)).toBeLessThanOrEqual(1);
          }

          expect(areShoeSystemsConsistent(gender, fromSystem, toSystem)).toBe(true);
        }
      )
    );
  });

  it('Property 6: Keyword Density Sum', () => {
    fc.assert(
      fc.property(
        fc.array(fc.stringMatching(/^[A-Za-z]{3,12}$/), { minLength: 1, maxLength: 100 }),
        fc.integer({ min: 1, max: 8 }),
        fc.boolean(),
        (words, minLength, excludeCommon) => {
          const text = words.join(' ');
          const analysis = analyzeKeywordDensity(text, minLength, excludeCommon);
          expect(analysis).not.toBeNull();

          const densitySum = analysis!.results.reduce((sum, item) => sum + item.density, 0);
          expect(densitySum).toBeGreaterThanOrEqual(0);
          expect(densitySum).toBeLessThanOrEqual(100.000001);
          expect(analysis!.totalWords).toBe(words.length);
        }
      )
    );
  });

  it('counts prototype-named keywords without corrupting density', () => {
    const analysis = analyzeKeywordDensity(
      'constructor constructor prototype toString normal',
      1,
      false
    );

    expect(analysis).not.toBeNull();
    expect(analysis!.results).toEqual(
      expect.arrayContaining([
        { word: 'constructor', count: 2, density: 40 },
        { word: 'prototype', count: 1, density: 20 },
        { word: 'tostring', count: 1, density: 20 },
      ])
    );
    for (const item of analysis!.results) {
      expect(Number.isFinite(item.count)).toBe(true);
      expect(Number.isFinite(item.density)).toBe(true);
    }
  });

  it('Property 12: Number System Conversion Round Trip', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 1_000_000 }),
        fc.constantFrom(...bases),
        fc.constantFrom(...bases),
        (value, fromBase, toBase) => {
          const source = value.toString(fromBase).toUpperCase();
          expect(validateNumberInput(source, fromBase)).toBe(true);

          const converted = convertNumberBase(source, fromBase, toBase);
          const roundTrip = convertNumberBase(converted, toBase, fromBase);

          expect(roundTrip).toBe(source);
        }
      )
    );
  });

  it('Property 10: Team Generator Completeness', () => {
    fc.assert(
      fc.property(
        fc.uniqueArray(fc.string({ minLength: 1, maxLength: 20 }), { minLength: 1, maxLength: 50 }),
        fc.integer({ min: 1, max: 20 }),
        (members, requestedTeamCount) => {
          const cleanedMembers = members.map((member) => member.trim()).filter(Boolean);
          const teams = generateTeams(
            members,
            requestedTeamCount,
            [],
            'Team',
            () => 0.271828
          );

          const assignedMembers = teams.flatMap((team) => team.members);
          const uniqueAssigned = new Set(assignedMembers);
          const expectedTeamCount = cleanedMembers.length === 0
            ? 0
            : Math.min(Math.max(Math.floor(requestedTeamCount) || 1, 1), cleanedMembers.length);

          expect(teams).toHaveLength(expectedTeamCount);
          expect(uniqueAssigned.size).toBe(cleanedMembers.length);
          for (const member of cleanedMembers) {
            expect(uniqueAssigned.has(member)).toBe(true);
          }

          if (teams.length > 0) {
            const sizes = teams.map((team) => team.members.length);
            const minSize = Math.min(...sizes);
            const maxSize = Math.max(...sizes);
            expect(maxSize - minSize).toBeLessThanOrEqual(1);
          }
        }
      )
    );
  });
});
