export type PassportCountry = 'CHN' | 'IND' | 'USA' | 'CAN' | 'MEX' | 'GBR' | 'FRA' | 'DEU' | 'JPN' | 'KOR' | 'AUS' | 'BRA' | 'ARG';

export type HeldVisa = 'US_B1B2' | 'CA_VISA' | 'SCHENGEN' | 'UK_VISA' | 'JP_VISA' | 'US_GREEN_CARD' | 'CA_PR';

export interface VisaInput {
  passportCountry: string; // ISO 3-letter code
  heldVisas: string[];
  route: string[]; // List of host city IDs: e.g. ['YVR', 'SEA', 'MEX']
}

export interface TransitLegReport {
  from: string;
  to: string;
  fromCountry: 'USA' | 'CAN' | 'MEX' | 'ORIGIN';
  toCountry: 'USA' | 'CAN' | 'MEX';
  status: 'ok' | 'warning' | 'required';
  visaRequired: string;
  description: string;
}

export interface VisaResult {
  legs: TransitLegReport[];
  overallWarnings: string[];
  checklist: string[];
}

// 16 Host Cities mapping to their countries
export const CITY_COUNTRY_MAP: Record<string, 'USA' | 'CAN' | 'MEX'> = {
  ATL: 'USA', BOS: 'USA', DFW: 'USA', HOU: 'USA', MCI: 'USA', LAX: 'USA',
  MIA: 'USA', NYC: 'USA', PHL: 'USA', SFO: 'USA', SEA: 'USA',
  YYZ: 'CAN', YVR: 'CAN',
  GDL: 'MEX', MEX: 'MEX', MTY: 'MEX'
};

// ESTA (Visa Waiver Program) eligible countries for USA entry
const USA_ESTA_COUNTRIES = new Set([
  'GBR', 'FRA', 'DEU', 'JPN', 'KOR', 'AUS', 'ESP', 'ITA', 'NLD', 'BEL', 'CHE', 'SWE', 'NOR'
]);

// Canada eTA (electronic Travel Authorization) eligible countries (direct visa-free countries)
const CAN_ETA_COUNTRIES = new Set([
  'GBR', 'FRA', 'DEU', 'JPN', 'KOR', 'AUS', 'ESP', 'ITA', 'NLD', 'BEL', 'CHE', 'SWE', 'NOR'
]);

// Canada visa expansion eTA eligibility (requires valid US visa in last 10 years or active US visa)
// Covers countries like Brazil, Mexico (partial rules apply, currently Mexicans require visas, but some can do eTA under specific constraints. We simplify: Brazil can use US visa for eTA, etc.)
const CAN_ETA_US_VISA_COUNTRIES = new Set([
  'BRA', 'PHL', 'THA', 'CRI', 'PAN'
]);

// Mexico visa-free entry countries
const MEX_VISAFREE_COUNTRIES = new Set([
  'USA', 'CAN', 'GBR', 'FRA', 'DEU', 'JPN', 'KOR', 'AUS', 'ESP', 'ITA', 'NLD', 'BEL', 'CHE', 'SWE', 'NOR', 'ARG'
]);

export function evaluateVisaRequirements(input: VisaInput): VisaResult {
  const { passportCountry, heldVisas, route } = input;
  const result: VisaResult = {
    legs: [],
    overallWarnings: [],
    checklist: ['Valid Passport (must have at least 6 months validity left)']
  };

  if (!route || route.length === 0) {
    return result;
  }

  const hasUSGreenCard = heldVisas.includes('US_GREEN_CARD');
  const hasCaPR = heldVisas.includes('CA_PR');
  const hasUSB1B2 = heldVisas.includes('US_B1B2');
  const hasCaVisa = heldVisas.includes('CA_VISA');
  const hasSchengen = heldVisas.includes('SCHENGEN');
  const hasUkVisa = heldVisas.includes('UK_VISA');
  const hasJpVisa = heldVisas.includes('JP_VISA');

  // We evaluate each step on the trip.
  // The first node counts as a transit from 'ORIGIN' to the first host city.
  for (let i = 0; i < route.length; i++) {
    const toCity = route[i];
    const toCountry = CITY_COUNTRY_MAP[toCity];
    if (!toCountry) continue;

    const fromCity = i === 0 ? 'ORIGIN' : route[i - 1];
    const fromCountry = i === 0 ? 'ORIGIN' : (CITY_COUNTRY_MAP[fromCity] || 'ORIGIN');

    // Skip if it is internal travel within the same country
    if (i > 0 && fromCountry === toCountry) {
      continue;
    }

    let status: TransitLegReport['status'] = 'ok';
    let visaRequired = 'None / Visa Free';
    let description = '';

    if (toCountry === 'USA') {
      if (passportCountry === 'USA') {
        visaRequired = 'None (US Citizen)';
        description = 'US passport holders can enter the United States freely without visa documents.';
      } else if (hasUSGreenCard) {
        visaRequired = 'None (US Green Card Holder)';
        description = 'Permanent residents of the US can enter freely. Ensure you carry your physical Green Card.';
      } else if (USA_ESTA_COUNTRIES.has(passportCountry)) {
        status = 'warning';
        visaRequired = 'ESTA Required';
        description = 'Eligible for Visa Waiver Program (ESTA). You must apply for an online ESTA authorization at least 72 hours before departure.';
        if (!result.checklist.includes('ESTA Travel Authorization (Approved)')) {
          result.checklist.push('ESTA Travel Authorization (Approved)');
        }
      } else {
        if (hasUSB1B2) {
          visaRequired = 'US B1/B2 Visa (Held)';
          description = 'Carry your physical passport containing the valid US B1/B2 visa sticker. Ensure EVUS registration is active for Chinese passport holders.';
          if (!result.checklist.includes('US B1/B2 Visa Sticker')) {
            result.checklist.push('US B1/B2 Visa Sticker');
          }
        } else {
          status = 'required';
          visaRequired = 'US B1/B2 Visa Required';
          description = 'You must apply for a regular US B1/B2 Visitor Visa at a US Embassy or Consulate prior to your trip.';
          if (!result.checklist.includes('US B1/B2 Visa Sticker')) {
            result.checklist.push('US B1/B2 Visa Sticker');
          }
        }
      }
    } else if (toCountry === 'CAN') {
      if (passportCountry === 'CAN') {
        visaRequired = 'None (Canada Citizen)';
        description = 'Canadian passport holders can enter Canada freely without additional border authorizations.';
      } else if (hasCaPR) {
        visaRequired = 'None (Canada PR Holder)';
        description = 'Canadian Permanent Residents can enter freely. Ensure you carry your physical PR Card.';
      } else if (passportCountry === 'USA' || hasUSGreenCard) {
        visaRequired = 'None / Visa Free';
        description = 'US Citizens and Green Card holders do not require a visa or eTA to enter Canada. Carry proof of US status.';
      } else if (CAN_ETA_COUNTRIES.has(passportCountry)) {
        status = 'warning';
        visaRequired = 'eTA Required';
        description = 'You require a Canadian eTA (Electronic Travel Authorization) if arriving by air. Apply online before your flight.';
        if (!result.checklist.includes('Canada eTA Authorization (Approved)')) {
          result.checklist.push('Canada eTA Authorization (Approved)');
        }
      } else if (CAN_ETA_US_VISA_COUNTRIES.has(passportCountry) && hasUSB1B2) {
        status = 'warning';
        visaRequired = 'eTA Required (via US Visa)';
        description = 'Eligible to apply for a Canadian eTA instead of a visitor visa because you hold an active US B1/B2 visa. Applicable for air travel.';
        if (!result.checklist.includes('Canada eTA Authorization (Approved)')) {
          result.checklist.push('Canada eTA Authorization (Approved)');
        }
      } else {
        if (hasCaVisa) {
          visaRequired = 'Canada Visa (Held)';
          description = 'Carry your passport with the valid Canadian tourist visa sticker.';
          if (!result.checklist.includes('Canada Tourist Visa Sticker')) {
            result.checklist.push('Canada Tourist Visa Sticker');
          }
        } else {
          status = 'required';
          visaRequired = 'Canada Visa Required';
          description = 'You must apply for a regular Canadian Temporary Resident Visa (TRV) before traveling to Canada.';
          if (!result.checklist.includes('Canada Tourist Visa Sticker')) {
            result.checklist.push('Canada Tourist Visa Sticker');
          }
        }
      }
    } else if (toCountry === 'MEX') {
      if (passportCountry === 'MEX') {
        visaRequired = 'None (Mexico Citizen)';
        description = 'Mexican passport holders can enter Mexico freely.';
      } else if (MEX_VISAFREE_COUNTRIES.has(passportCountry)) {
        visaRequired = 'None / Visa Free';
        description = 'Your passport qualifies for visa-free tourist entry into Mexico. Fill out the FMM form if required by your airline.';
      } else if (hasUSGreenCard || hasCaPR || hasUSB1B2 || hasCaVisa || hasSchengen || hasUkVisa || hasJpVisa) {
        visaRequired = 'None (Exempt via Held Visa)';
        description = 'Mexico exempts visa requirements for travelers holding valid, active visas or permanent residencies of the USA, Canada, Schengen Area, UK, or Japan. Carry the supporting document/visa sticker.';
        
        let exemptDoc = 'Supporting Valid Visa (US/CA/Schengen/UK/JP)';
        if (hasUSB1B2) exemptDoc = 'US B1/B2 Visa (Exemption proof)';
        else if (hasCaVisa) exemptDoc = 'Canada Visa (Exemption proof)';
        else if (hasUSGreenCard) exemptDoc = 'US Green Card (Exemption proof)';
        else if (hasCaPR) exemptDoc = 'Canada PR Card (Exemption proof)';
        
        if (!result.checklist.includes(exemptDoc)) {
          result.checklist.push(exemptDoc);
        }
      } else {
        status = 'required';
        visaRequired = 'Mexico Visa Required';
        description = 'You must apply for a Mexican Tourist Visa at a Mexican Consulate prior to travel.';
        if (!result.checklist.includes('Mexico Tourist Visa Sticker')) {
          result.checklist.push('Mexico Tourist Visa Sticker');
        }
      }
    }

    result.legs.push({
      from: fromCity,
      to: toCity,
      fromCountry,
      toCountry,
      status,
      visaRequired,
      description
    });
  }

  // Compile overall warnings
  const requiresRegularVisa = result.legs.some(leg => leg.status === 'required');
  const requiresOnlineEta = result.legs.some(leg => leg.status === 'warning');

  if (requiresRegularVisa) {
    result.overallWarnings.push('Your route requires one or more standard physical tourist visas. Embassy interviews and physical document submissions will be necessary. Book appointments early!');
  }
  if (requiresOnlineEta) {
    result.overallWarnings.push('You require electronic travel authorizations (ESTA or eTA). Make sure to submit online applications at least 3-7 days before boarding flights.');
  }

  // Double border cross warning (e.g. USA -> CAN -> USA)
  let borderCrossCount = 0;
  for (let i = 1; i < result.legs.length; i++) {
    if (result.legs[i].fromCountry !== result.legs[i].toCountry) {
      borderCrossCount++;
    }
  }
  if (borderCrossCount >= 2) {
    result.overallWarnings.push('Your itinerary involves multiple international border crossings. Ensure you have MULTIPLE-ENTRY permits to avoid being denied entry upon return.');
    if (!result.checklist.includes('Proof of Multiple-Entry rights for visas')) {
      result.checklist.push('Proof of Multiple-Entry rights for visas');
    }
  }

  // Add general tickets/accommodations items to checklist
  result.checklist.push('World Cup Match Tickets / FIFA Booking Confirmation');
  result.checklist.push('Confirmed Return or Onward Flight Tickets');
  result.checklist.push('Proof of Accommodation (Hotel / Airbnb Bookings)');

  return result;
}
