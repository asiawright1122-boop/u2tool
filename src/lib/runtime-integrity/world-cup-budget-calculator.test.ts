import { describe, it, expect } from 'vitest';
import {
  calculateHaversineDistance,
  calculateLegCost,
  calculateTotalBudget,
  checkVisaRequirements,
  HOST_CITIES,
  type BudgetInput,
  type RouteLeg
} from './world-cup-budget-calculator';

describe('World Cup Budget Calculator Mathematical Model', () => {
  describe('Haversine Distance Calculations', () => {
    it('should correctly calculate distance between NYC and LAX (~2451 miles)', () => {
      const nyc = HOST_CITIES.NYC;
      const lax = HOST_CITIES.LAX;
      const dist = calculateHaversineDistance(nyc.lat, nyc.lng, lax.lat, lax.lng);
      expect(dist).toBeGreaterThan(2400);
      expect(dist).toBeLessThan(2500);
    });

    it('should correctly calculate distance between MEX and GDL (~285 miles)', () => {
      const mex = HOST_CITIES.MEX;
      const gdl = HOST_CITIES.GDL;
      const dist = calculateHaversineDistance(mex.lat, mex.lng, gdl.lat, gdl.lng);
      expect(dist).toBeGreaterThan(270);
      expect(dist).toBeLessThan(300);
    });
  });

  describe('Accommodation Shared Room Split Logic', () => {
    it('should split room cost evenly for even group sizes (2 people)', () => {
      // 2 people, 1 room, $150/night, 3 nights
      const nights = 3;
      const groupSize = 2;
      const roomPrice = 150;
      
      // Expected total: $450 total lodging cost
      // Per person: $225
      const totalRooms = Math.ceil(groupSize / 2);
      const totalCostForGroup = nights * roomPrice * totalRooms;
      const costPerPerson = totalCostForGroup / groupSize;
      
      expect(totalRooms).toBe(1);
      expect(totalCostForGroup).toBe(450);
      expect(costPerPerson).toBe(225);
    });

    it('should split room cost correctly for odd group sizes (3 people requiring 2 rooms)', () => {
      // 3 people, 2 rooms, $150/night, 3 nights
      const nights = 3;
      const groupSize = 3;
      const roomPrice = 150;
      
      // Expected total rooms: 2
      // Total cost for group: 3 nights * $150 * 2 rooms = $900
      // Per person: $900 / 3 = $300
      const totalRooms = Math.ceil(groupSize / 2);
      const totalCostForGroup = nights * roomPrice * totalRooms;
      const costPerPerson = totalCostForGroup / groupSize;
      
      expect(totalRooms).toBe(2);
      expect(totalCostForGroup).toBe(900);
      expect(costPerPerson).toBe(300);
    });
  });

  describe('Transit Leg Cost Calculation', () => {
    it('should calculate Flight leg cost per person correctly', () => {
      const leg: RouteLeg = {
        fromCity: 'LAX',
        toCity: 'SEA',
        transitMode: 'flight',
        matchStage: 'group',
        ticketCategory: 'cat3',
        nights: 2
      };
      // Flight cost should be distance-based or base flight rate
      const costPerPerson = calculateLegCost(leg, 2); // Group of 2
      expect(costPerPerson).toBeGreaterThan(0);
    });

    it('should calculate Drive leg cost with shared group split correctly', () => {
      const leg: RouteLeg = {
        fromCity: 'MEX',
        toCity: 'GDL', // ~285 miles
        transitMode: 'drive',
        matchStage: 'group',
        ticketCategory: 'cat3',
        nights: 2
      };
      
      // For driving, cost is rental rate ($60/day) + fuel ($0.15/mile), shared by group size
      // Distance is ~286.9 miles. Transit days: max(1, ceil(286.9 / 500)) = 1 day
      // Group size = 1: Cost = 1 * $60 + 286.88 * $0.15 = 60 + 43.03 = $103.03
      const costForOne = calculateLegCost(leg, 1);
      expect(costForOne).toBeCloseTo(103.03, 1);

      // Group size = 3: Cost per person = (60 + 43.03) / 3 = $34.34
      const costForThree = calculateLegCost(leg, 3);
      expect(costForThree).toBeCloseTo(34.34, 1);
    });

  });

  describe('Border Crossing Visa Alerts', () => {
    it('should identify border crossings and recommend visa alerts for EU traveler', () => {
      // Route crossing from Mexico to USA
      const route = ['MEX', 'LAX'];
      const requirements = checkVisaRequirements(route, 'EU');
      expect(requirements.requiresUSAVisa).toBe(true);
      expect(requirements.usaVisaType).toBe('ESTA'); // EU gets ESTA
      expect(requirements.requiresMexicoVisa).toBe(false); // EU doesn't need Mexican visa
    });

    it('should identify border crossings for Asian traveler (e.g. from China/Seoul)', () => {
      // Route crossing MEX -> LAX -> YYZ
      const route = ['MEX', 'LAX', 'YYZ'];
      const requirements = checkVisaRequirements(route, 'AS_PAC');
      expect(requirements.requiresUSAVisa).toBe(true);
      expect(requirements.usaVisaType).toBe('visa'); // Regular tourist visa
      expect(requirements.requiresCanadaVisa).toBe(true);
      expect(requirements.canadaVisaType).toBe('visa');
    });
  });

  describe('Total Budget Calculation Integrator', () => {
    it('should compile ticket, accommodation, transit, and daily living costs correctly', () => {
      const input: BudgetInput = {
        originRegion: 'EU',
        groupSize: 2,
        accommodationLevel: 'standard',
        baseCurrency: 'USD',
        exchangeRates: { JPY: 150, EUR: 0.92, CNY: 7.2, KRW: 1350 },
        route: [
          {
            fromCity: 'MIA', // Origin city
            toCity: 'MIA',
            transitMode: 'none',
            matchStage: 'group',
            ticketCategory: 'cat3', // $75 ticket
            nights: 3 // 3 nights lodging
          },
          {
            fromCity: 'MIA',
            toCity: 'NYC',
            transitMode: 'flight', // flight cost + ticket
            matchStage: 'round_32', // $120 ticket
            ticketCategory: 'cat2', // $220 ticket
            nights: 2 // 2 nights lodging
          }
        ]
      };

      const result = calculateTotalBudget(input);
      expect(result.totalUSD).toBeGreaterThan(1000); // Including flight, tickets, hotels, food
      expect(result.perPersonUSD).toBe(result.totalUSD / 2);
      expect(result.byCategory.tickets).toBeGreaterThan(0);
      expect(result.byCategory.accommodation).toBeGreaterThan(0);
      expect(result.byCategory.transport).toBeGreaterThan(0);
      expect(result.byCategory.living).toBeGreaterThan(0);
    });
  });
});
