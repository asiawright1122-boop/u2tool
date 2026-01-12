'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

// Sample BIC/SWIFT codes database (in production, this would be a larger database or API)
const bicDatabase: Record<string, { bankName: string; city: string; country: string; branch?: string }> = {
  'DEUTDEFF': { bankName: 'Deutsche Bank AG', city: 'Frankfurt am Main', country: 'Germany' },
  'DEUTDEFFXXX': { bankName: 'Deutsche Bank AG', city: 'Frankfurt am Main', country: 'Germany', branch: 'Head Office' },
  'COBADEFF': { bankName: 'Commerzbank AG', city: 'Frankfurt am Main', country: 'Germany' },
  'BNPAFRPP': { bankName: 'BNP Paribas', city: 'Paris', country: 'France' },
  'SOGEFRPP': { bankName: 'Société Générale', city: 'Paris', country: 'France' },
  'CRABORPP': { bankName: 'Crédit Agricole', city: 'Paris', country: 'France' },
  'BARCGB22': { bankName: 'Barclays Bank PLC', city: 'London', country: 'United Kingdom' },
  'HSBCGB2L': { bankName: 'HSBC Bank PLC', city: 'London', country: 'United Kingdom' },
  'NWBKGB2L': { bankName: 'NatWest', city: 'London', country: 'United Kingdom' },
  'LOYDGB2L': { bankName: 'Lloyds Bank', city: 'London', country: 'United Kingdom' },
  'INGBNL2A': { bankName: 'ING Bank N.V.', city: 'Amsterdam', country: 'Netherlands' },
  'ABNANL2A': { bankName: 'ABN AMRO Bank N.V.', city: 'Amsterdam', country: 'Netherlands' },
  'RABONL2U': { bankName: 'Rabobank', city: 'Utrecht', country: 'Netherlands' },
  'KREDBEBB': { bankName: 'KBC Bank NV', city: 'Brussels', country: 'Belgium' },
  'GEBABEBB': { bankName: 'BNP Paribas Fortis', city: 'Brussels', country: 'Belgium' },
  'BABOROBB': { bankName: 'Banca Comercială Română', city: 'Bucharest', country: 'Romania' },
  'UBSWCHZH': { bankName: 'UBS AG', city: 'Zurich', country: 'Switzerland' },
  'CRESCHZZ': { bankName: 'Credit Suisse', city: 'Zurich', country: 'Switzerland' },
  'UNCRITM1': { bankName: 'UniCredit S.p.A.', city: 'Milan', country: 'Italy' },
  'BCITITMM': { bankName: 'Intesa Sanpaolo', city: 'Milan', country: 'Italy' },
  'BBVAESMM': { bankName: 'BBVA', city: 'Madrid', country: 'Spain' },
  'CABOROBB': { bankName: 'CaixaBank', city: 'Barcelona', country: 'Spain' },
  'BSCHESMM': { bankName: 'Banco Santander', city: 'Madrid', country: 'Spain' },
  'CGDIPTPL': { bankName: 'Caixa Geral de Depósitos', city: 'Lisbon', country: 'Portugal' },
  'BPIPPTPL': { bankName: 'Banco BPI', city: 'Porto', country: 'Portugal' },
  'DABOROBB': { bankName: 'Danske Bank', city: 'Copenhagen', country: 'Denmark' },
  'NDEASESS': { bankName: 'Nordea Bank', city: 'Stockholm', country: 'Sweden' },
  'HANDSESS': { bankName: 'Handelsbanken', city: 'Stockholm', country: 'Sweden' },
  'DNBANOKK': { bankName: 'DNB Bank ASA', city: 'Oslo', country: 'Norway' },
  'OABOROBB': { bankName: 'Osuuspankki', city: 'Helsinki', country: 'Finland' },
  'NABOROBB': { bankName: 'Nordea Bank Finland', city: 'Helsinki', country: 'Finland' },
  'RABOROBB': { bankName: 'Raiffeisen Bank', city: 'Vienna', country: 'Austria' },
  'BKAUATWW': { bankName: 'Bank Austria', city: 'Vienna', country: 'Austria' },
  'GIBACZPX': { bankName: 'Česká spořitelna', city: 'Prague', country: 'Czech Republic' },
  'KOMBCZPP': { bankName: 'Komerční banka', city: 'Prague', country: 'Czech Republic' },
  'BRABOROBB': { bankName: 'mBank', city: 'Warsaw', country: 'Poland' },
  'PKOPPLPW': { bankName: 'PKO Bank Polski', city: 'Warsaw', country: 'Poland' },
  'OTPVHUHB': { bankName: 'OTP Bank', city: 'Budapest', country: 'Hungary' },
};

// Country codes for BIC
const countryNames: Record<string, string> = {
  DE: 'Germany', FR: 'France', GB: 'United Kingdom', NL: 'Netherlands', BE: 'Belgium',
  CH: 'Switzerland', IT: 'Italy', ES: 'Spain', PT: 'Portugal', AT: 'Austria',
  DK: 'Denmark', SE: 'Sweden', NO: 'Norway', FI: 'Finland', IE: 'Ireland',
  PL: 'Poland', CZ: 'Czech Republic', HU: 'Hungary', RO: 'Romania', GR: 'Greece',
  LU: 'Luxembourg', SK: 'Slovakia', SI: 'Slovenia', HR: 'Croatia', BG: 'Bulgaria',
  EE: 'Estonia', LV: 'Latvia', LT: 'Lithuania', CY: 'Cyprus', MT: 'Malta',
};

export default function BicSwiftLookup() {
  const t = useTranslations('tools.bic-swift-lookup');

  const [bicCode, setBicCode] = useState('');
  const [result, setResult] = useState<{
    valid: boolean;
    bankCode?: string;
    countryCode?: string;
    countryName?: string;
    locationCode?: string;
    branchCode?: string;
    bankInfo?: { bankName: string; city: string; country: string; branch?: string };
    error?: string;
  } | null>(null);

  const validateBic = (bic: string): boolean => {
    // BIC format: 4 letters (bank) + 2 letters (country) + 2 alphanumeric (location) + optional 3 alphanumeric (branch)
    const bicRegex = /^[A-Z]{4}[A-Z]{2}[A-Z0-9]{2}([A-Z0-9]{3})?$/;
    return bicRegex.test(bic);
  };

  const lookup = () => {
    const cleaned = bicCode.replace(/\s/g, '').toUpperCase();

    if (!cleaned) {
      setResult({ valid: false, error: t('errors.empty') });
      return;
    }

    if (!validateBic(cleaned)) {
      setResult({ valid: false, error: t('errors.invalidFormat') });
      return;
    }

    const bankCode = cleaned.slice(0, 4);
    const countryCode = cleaned.slice(4, 6);
    const locationCode = cleaned.slice(6, 8);
    const branchCode = cleaned.length === 11 ? cleaned.slice(8, 11) : undefined;

    const countryName = countryNames[countryCode];
    if (!countryName) {
      setResult({ valid: false, error: t('errors.unknownCountry') });
      return;
    }

    // Look up in database (try with and without branch code)
    const bankInfo = bicDatabase[cleaned] || bicDatabase[cleaned.slice(0, 8)];

    setResult({
      valid: true,
      bankCode,
      countryCode,
      countryName,
      locationCode,
      branchCode,
      bankInfo,
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    setBicCode(value);
    setResult(null);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  // Group banks by country for the reference section
  const banksByCountry = Object.entries(bicDatabase).reduce((acc, [bic, info]) => {
    if (!acc[info.country]) acc[info.country] = [];
    if (!acc[info.country].find(b => b.bic.slice(0, 8) === bic.slice(0, 8))) {
      acc[info.country].push({ bic, ...info });
    }
    return acc;
  }, {} as Record<string, Array<{ bic: string; bankName: string; city: string; country: string }>>);

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('inputLabel')}
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={bicCode}
            onChange={handleInputChange}
            placeholder={t('placeholder')}
            maxLength={11}
            className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono text-lg tracking-wider"
          />
          <button
            onClick={lookup}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            {t('lookup')}
          </button>
        </div>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          {t('formatHint')}
        </p>
      </div>

      {result && (
        <div className={`p-6 rounded-xl ${
          result.valid
            ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
            : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
        }`}>
          {result.error ? (
            <div className="flex items-center gap-3">
              <span className="text-3xl text-red-500">✗</span>
              <span className="text-red-700 dark:text-red-300">{result.error}</span>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl text-green-500">✓</span>
                <span className="text-xl font-semibold text-green-700 dark:text-green-300">
                  {t('validBic')}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3 bg-white dark:bg-gray-800 rounded-lg">
                  <div className="text-sm text-gray-500 dark:text-gray-400">{t('bankCode')}</div>
                  <div className="font-mono font-medium text-gray-900 dark:text-white">
                    {result.bankCode}
                  </div>
                </div>
                <div className="p-3 bg-white dark:bg-gray-800 rounded-lg">
                  <div className="text-sm text-gray-500 dark:text-gray-400">{t('country')}</div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    {result.countryName} ({result.countryCode})
                  </div>
                </div>
                <div className="p-3 bg-white dark:bg-gray-800 rounded-lg">
                  <div className="text-sm text-gray-500 dark:text-gray-400">{t('locationCode')}</div>
                  <div className="font-mono font-medium text-gray-900 dark:text-white">
                    {result.locationCode}
                  </div>
                </div>
                <div className="p-3 bg-white dark:bg-gray-800 rounded-lg">
                  <div className="text-sm text-gray-500 dark:text-gray-400">{t('branchCode')}</div>
                  <div className="font-mono font-medium text-gray-900 dark:text-white">
                    {result.branchCode || 'XXX'} ({result.branchCode ? t('specificBranch') : t('headOffice')})
                  </div>
                </div>
              </div>

              {result.bankInfo && (
                <div className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                  <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-2">
                    {t('bankInformation')}
                  </h4>
                  <div className="space-y-1 text-gray-700 dark:text-gray-300">
                    <p><strong>{t('bankName')}:</strong> {result.bankInfo.bankName}</p>
                    <p><strong>{t('city')}:</strong> {result.bankInfo.city}</p>
                    <p><strong>{t('country')}:</strong> {result.bankInfo.country}</p>
                    {result.bankInfo.branch && (
                      <p><strong>{t('branch')}:</strong> {result.bankInfo.branch}</p>
                    )}
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                <button
                  onClick={() => copyToClipboard(bicCode.toUpperCase())}
                  className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 text-sm"
                >
                  {t('copyBic')}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* BIC Structure Explanation */}
      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
          {t('bicStructure')}
        </h3>
        <div className="grid grid-cols-4 gap-2 text-center">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded">
            <div className="font-mono font-bold text-blue-700 dark:text-blue-300">AAAA</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">{t('structure.bank')}</div>
          </div>
          <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded">
            <div className="font-mono font-bold text-green-700 dark:text-green-300">BB</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">{t('structure.country')}</div>
          </div>
          <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded">
            <div className="font-mono font-bold text-yellow-700 dark:text-yellow-300">CC</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">{t('structure.location')}</div>
          </div>
          <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded">
            <div className="font-mono font-bold text-purple-700 dark:text-purple-300">DDD</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">{t('structure.branch')}</div>
          </div>
        </div>
      </div>

      {/* Sample BIC Codes */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
          {t('sampleCodes')}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 max-h-64 overflow-y-auto">
          {Object.entries(banksByCountry).slice(0, 6).flatMap(([country, banks]) =>
            banks.slice(0, 2).map((bank) => (
              <button
                key={bank.bic}
                onClick={() => {
                  setBicCode(bank.bic);
                  setResult(null);
                }}
                className="p-2 text-left bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="font-mono text-sm font-medium text-gray-900 dark:text-white">
                  {bank.bic}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {bank.bankName}
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
