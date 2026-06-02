export interface HostCity {
  id: string;
  name: string;
  country: 'USA' | 'CAN' | 'MEX';
  lat: number;
  lng: number;
}

export const HOST_CITIES: Record<string, HostCity> = {
  ATL: { id: 'ATL', name: 'Atlanta', country: 'USA', lat: 33.7490, lng: -84.3880 },
  BOS: { id: 'BOS', name: 'Boston', country: 'USA', lat: 42.3601, lng: -71.0589 },
  DFW: { id: 'DFW', name: 'Dallas', country: 'USA', lat: 32.7767, lng: -96.7970 },
  HOU: { id: 'HOU', name: 'Houston', country: 'USA', lat: 29.7604, lng: -95.3698 },
  MCI: { id: 'MCI', name: 'Kansas City', country: 'USA', lat: 39.0997, lng: -94.5786 },
  LAX: { id: 'LAX', name: 'Los Angeles', country: 'USA', lat: 34.0522, lng: -118.2437 },
  MIA: { id: 'MIA', name: 'Miami', country: 'USA', lat: 25.7617, lng: -80.1918 },
  NYC: { id: 'NYC', name: 'New York/New Jersey', country: 'USA', lat: 40.7128, lng: -74.0060 },
  PHL: { id: 'PHL', name: 'Philadelphia', country: 'USA', lat: 39.9526, lng: -75.1652 },
  SFO: { id: 'SFO', name: 'San Francisco', country: 'USA', lat: 37.7749, lng: -122.4194 },
  SEA: { id: 'SEA', name: 'Seattle', country: 'USA', lat: 47.6062, lng: -122.3321 },
  YYZ: { id: 'YYZ', name: 'Toronto', country: 'CAN', lat: 43.6532, lng: -79.3832 },
  YVR: { id: 'YVR', name: 'Vancouver', country: 'CAN', lat: 49.2827, lng: -123.1207 },
  GDL: { id: 'GDL', name: 'Guadalajara', country: 'MEX', lat: 20.6790, lng: -103.3496 },
  MEX: { id: 'MEX', name: 'Mexico City', country: 'MEX', lat: 19.4326, lng: -99.1332 },
  MTY: { id: 'MTY', name: 'Monterrey', country: 'MEX', lat: 25.6866, lng: -100.3161 }
};

export interface RouteLeg {
  fromCity: string;
  toCity: string;
  transitMode: 'none' | 'flight' | 'drive' | 'train';
  matchStage: 'group' | 'round_32' | 'round_16' | 'quarter' | 'semi' | 'final';
  ticketCategory: 'cat1' | 'cat2' | 'cat3' | 'cat4';
  nights: number;
}

export interface BudgetInput {
  originRegion: 'US_CAN_MEX' | 'SA' | 'EU' | 'AS_PAC' | 'AFR';
  groupSize: number;
  accommodationLevel: 'budget' | 'standard' | 'luxury';
  baseCurrency: 'USD' | 'EUR' | 'GBP' | 'CAD' | 'MXN' | 'CNY' | 'JPY' | 'KRW';
  exchangeRates?: Record<string, number>;
  route: RouteLeg[];
}

export interface VisaRequirements {
  requiresUSAVisa: boolean;
  usaVisaType: 'ESTA' | 'visa' | 'none';
  requiresCanadaVisa: boolean;
  canadaVisaType: 'eTA' | 'visa' | 'none';
  requiresMexicoVisa: boolean;
  mexicoVisaType: 'visa' | 'none';
}

// Haversine formula to compute distance in miles
export function calculateHaversineDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 3958.8; // Radius of Earth in miles
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Estimates ticket price in USD
export function getTicketPrice(
  stage: RouteLeg['matchStage'],
  category: RouteLeg['ticketCategory']
): number {
  const matrix: Record<RouteLeg['matchStage'], Record<RouteLeg['ticketCategory'], number>> = {
    group: { cat1: 250, cat2: 165, cat3: 75, cat4: 35 },
    round_32: { cat1: 350, cat2: 220, cat3: 120, cat4: 60 },
    round_16: { cat1: 350, cat2: 220, cat3: 120, cat4: 60 },
    quarter: { cat1: 500, cat2: 320, cat3: 180, cat4: 90 },
    semi: { cat1: 800, cat2: 550, cat3: 350, cat4: 180 },
    final: { cat1: 1500, cat2: 1000, cat3: 600, cat4: 300 }
  };
  return matrix[stage][category];
}

// Calculates transit leg cost per person in USD
export function calculateLegCost(leg: RouteLeg, groupSize: number): number {
  if (leg.transitMode === 'none') {
    return 0;
  }

  const from = HOST_CITIES[leg.fromCity];
  const to = HOST_CITIES[leg.toCity];
  if (!from || !to) {
    return 0;
  }

  const distance = calculateHaversineDistance(from.lat, from.lng, to.lat, to.lng);

  if (leg.transitMode === 'flight') {
    // Flight cost: base $150 + $0.10 per mile
    return 150 + 0.1 * distance;
  }

  if (leg.transitMode === 'drive') {
    // Drive cost: rental rate $60/day + fuel $0.15/mile
    // Days needed: max(1, ceil(distance / 500))
    const days = Math.max(1, Math.ceil(distance / 500));
    const totalCarCost = days * 60 + distance * 0.15;
    // Shared by group size (protected against division by zero)
    const activeGroupSize = Math.max(1, groupSize);
    return totalCarCost / activeGroupSize;
  }

  if (leg.transitMode === 'train') {
    // Train/Bus: flat $50 per person
    return 50;
  }

  return 0;
}

// Checks visa requirements depending on traveler's origin and visited countries
export function checkVisaRequirements(
  routeCities: string[],
  originRegion: BudgetInput['originRegion']
): VisaRequirements {
  const visitedCountries = new Set<string>();
  routeCities.forEach((cityCode) => {
    const city = HOST_CITIES[cityCode];
    if (city) {
      visitedCountries.add(city.country);
    }
  });

  const requiresUSAVisa = visitedCountries.has('USA') && originRegion !== 'US_CAN_MEX';
  const requiresCanadaVisa = visitedCountries.has('CAN') && originRegion !== 'US_CAN_MEX';

  let usaVisaType: VisaRequirements['usaVisaType'] = 'none';
  if (requiresUSAVisa) {
    usaVisaType = originRegion === 'EU' ? 'ESTA' : 'visa';
  }

  let canadaVisaType: VisaRequirements['canadaVisaType'] = 'none';
  if (requiresCanadaVisa) {
    canadaVisaType = originRegion === 'EU' ? 'eTA' : 'visa';
  }

  let mexicoVisaType: VisaRequirements['mexicoVisaType'] = 'none';
  if (visitedCountries.has('MEX') && originRegion !== 'US_CAN_MEX') {
    mexicoVisaType = originRegion === 'EU' ? 'none' : 'visa';
  }
  const requiresMexicoVisa = mexicoVisaType !== 'none';

  return {
    requiresUSAVisa,
    usaVisaType,
    requiresCanadaVisa,
    canadaVisaType,
    requiresMexicoVisa,
    mexicoVisaType
  };
}

export function calculateTotalBudget(input: BudgetInput) {
  const groupSize = Math.max(1, input.groupSize);
  const roomRates = { budget: 60, standard: 150, luxury: 400 };
  const dailyLivingRates = { budget: 40, standard: 80, luxury: 200 };
  
  const roomRate = roomRates[input.accommodationLevel];
  const dailyLivingRate = dailyLivingRates[input.accommodationLevel];

  // International flight cost
  const intlFlightRates = {
    US_CAN_MEX: 0,
    SA: 600,
    EU: 800,
    AS_PAC: 1200,
    AFR: 1000
  };
  const intlFlightUSD = intlFlightRates[input.originRegion];

  let totalTicketsUSD = 0;
  let totalAccomodationUSD = 0;
  let totalTransportUSD = intlFlightUSD * groupSize;
  let totalNights = 0;

  // Process each leg
  input.route.forEach((leg) => {
    // Ticket cost for the group
    const ticketPricePerPerson = getTicketPrice(leg.matchStage, leg.ticketCategory);
    totalTicketsUSD += ticketPricePerPerson * groupSize;

    // Accommodation cost for the group
    // Rooms needed = ceil(groupSize / 2)
    const roomsNeeded = Math.ceil(groupSize / 2);
    totalAccomodationUSD += leg.nights * roomRate * roomsNeeded;

    // Transport cost for the group
    const transitCostPerPerson = calculateLegCost(leg, groupSize);
    totalTransportUSD += transitCostPerPerson * groupSize;

    totalNights += leg.nights;
  });

  // Daily living cost for the group
  const totalLivingUSD = totalNights * dailyLivingRate * groupSize;

  const totalUSD = totalTicketsUSD + totalAccomodationUSD + totalTransportUSD + totalLivingUSD;
  const perPersonUSD = totalUSD / groupSize;

  // Convert to target currency if rates are provided
  const rates = input.exchangeRates || {};
  const rate = input.baseCurrency === 'USD' ? 1 : (rates[input.baseCurrency] || 1);

  return {
    totalUSD,
    perPersonUSD,
    totalBase: totalUSD * rate,
    perPersonBase: perPersonUSD * rate,
    currency: input.baseCurrency,
    byCategory: {
      tickets: totalTicketsUSD,
      accommodation: totalAccomodationUSD,
      transport: totalTransportUSD,
      living: totalLivingUSD
    },
    byCategoryBase: {
      tickets: totalTicketsUSD * rate,
      accommodation: totalAccomodationUSD * rate,
      transport: totalTransportUSD * rate,
      living: totalLivingUSD * rate
    },
    totalNights,
    visaRequirements: checkVisaRequirements(
      input.route.map(r => r.toCity),
      input.originRegion
    )
  };
}
