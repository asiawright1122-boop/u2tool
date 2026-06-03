import { describe, it, expect } from 'vitest';
import { evaluateVisaRequirements } from './world-cup-visa-engine';

describe('World Cup Border & Visa Assistant Rules Engine', () => {
  
  it('Scenario 1: Chinese Passport, no visas, visiting Seattle and Vancouver', () => {
    const result = evaluateVisaRequirements({
      passportCountry: 'CHN',
      heldVisas: [],
      route: ['SEA', 'YVR']
    });

    expect(result.legs).toHaveLength(2);

    // ORIGIN -> SEA (USA)
    const leg1 = result.legs[0];
    expect(leg1.toCountry).toBe('USA');
    expect(leg1.status).toBe('required');
    expect(leg1.visaRequired).toBe('US B1/B2 Visa Required');

    // SEA -> YVR (CAN)
    const leg2 = result.legs[1];
    expect(leg2.toCountry).toBe('CAN');
    expect(leg2.status).toBe('required');
    expect(leg2.visaRequired).toBe('Canada Visa Required');

    expect(result.overallWarnings).toContain('Your route requires one or more standard physical tourist visas. Embassy interviews and physical document submissions will be necessary. Book appointments early!');
    expect(result.checklist).toContain('US B1/B2 Visa Sticker');
    expect(result.checklist).toContain('Canada Tourist Visa Sticker');
  });

  it('Scenario 2: Chinese Passport, holding US B1/B2 visa, visiting Mexico City', () => {
    const result = evaluateVisaRequirements({
      passportCountry: 'CHN',
      heldVisas: ['US_B1B2'],
      route: ['MEX']
    });

    expect(result.legs).toHaveLength(1);
    const leg = result.legs[0];
    expect(leg.toCountry).toBe('MEX');
    expect(leg.status).toBe('ok');
    expect(leg.visaRequired).toBe('None (Exempt via Held Visa)');
    expect(leg.description).toContain('Mexico exempts visa requirements for travelers holding valid, active visas');

    expect(result.checklist).toContain('US B1/B2 Visa (Exemption proof)');
    expect(result.overallWarnings).toHaveLength(0);
  });

  it('Scenario 3: UK Passport, visiting New York and Toronto', () => {
    const result = evaluateVisaRequirements({
      passportCountry: 'GBR',
      heldVisas: [],
      route: ['NYC', 'YYZ']
    });

    expect(result.legs).toHaveLength(2);
    
    const leg1 = result.legs[0];
    expect(leg1.toCountry).toBe('USA');
    expect(leg1.status).toBe('warning');
    expect(leg1.visaRequired).toBe('ESTA Required');

    const leg2 = result.legs[1];
    expect(leg2.toCountry).toBe('CAN');
    expect(leg2.status).toBe('warning');
    expect(leg2.visaRequired).toBe('eTA Required');

    expect(result.overallWarnings).toContain('You require electronic travel authorizations (ESTA or eTA). Make sure to submit online applications at least 3-7 days before boarding flights.');
    expect(result.checklist).toContain('ESTA Travel Authorization (Approved)');
    expect(result.checklist).toContain('Canada eTA Authorization (Approved)');
  });

  it('Scenario 4: Brazilian Passport, holding US visa, visiting Vancouver', () => {
    const result = evaluateVisaRequirements({
      passportCountry: 'BRA',
      heldVisas: ['US_B1B2'],
      route: ['YVR']
    });

    expect(result.legs).toHaveLength(1);
    const leg = result.legs[0];
    expect(leg.toCountry).toBe('CAN');
    expect(leg.status).toBe('warning');
    expect(leg.visaRequired).toBe('eTA Required (via US Visa)');
    expect(leg.description).toContain('Eligible to apply for a Canadian eTA instead of a visitor visa');
  });

  it('Scenario 5: Multiple international border crossings (USA -> CAN -> USA)', () => {
    const result = evaluateVisaRequirements({
      passportCountry: 'CHN',
      heldVisas: ['US_B1B2', 'CA_VISA'],
      route: ['SEA', 'YVR', 'LAX']
    });

    expect(result.legs).toHaveLength(3);
    
    // Leg 1: ORIGIN -> SEA (USA)
    expect(result.legs[0].toCountry).toBe('USA');
    
    // Leg 2: SEA -> YVR (CAN)
    expect(result.legs[1].toCountry).toBe('CAN');
    
    // Leg 3: YVR -> LAX (USA)
    expect(result.legs[2].toCountry).toBe('USA');

    expect(result.overallWarnings).toContain('Your itinerary involves multiple international border crossings. Ensure you have MULTIPLE-ENTRY permits to avoid being denied entry upon return.');
    expect(result.checklist).toContain('Proof of Multiple-Entry rights for visas');
  });
});
