<script lang="ts">
  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['credit-card-validator'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.credit-card-validator.${key}`;
  }

  // Types
  interface CardInfo {
  isValid: boolean;
  cardType: string;
  cardIcon: string;
  issuer: string;
  length: number;
  luhnValid: boolean;
}

  let cardNumber = $state('');

  let result = $state(null);

  // Functions
  function luhnCheck(num: string): boolean {
    const digits = num.replace(/\D/g, '');
    let sum = 0;
    let isEven = false;
    
    for (let i = digits.length - 1; i >= 0; i--) {
      let digit = parseInt(digits[i], 10);
      
      if (isEven) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }
      
      sum += digit;
      isEven = !isEven;
    }
    
    return sum % 10 === 0;
  }
  function detectCardType(num: string) {
    const digits = num.replace(/\D/g, '');
    
    for (const card of cardPatterns) {
      if (card.pattern.test(digits)) {
        return { type: card.type, icon: card.icon, issuer: card.issuer };
      }
    }
    
    return { type: 'Unknown', icon: '❓', issuer: 'Unknown' };
  }
  function validateCard() {
    const digits = cardNumber.replace(/\D/g, '');
    
    if (!digits) {
      result = null;
      return;
    }

    const cardInfo = detectCardType(digits);
    const luhnValid = luhnCheck(digits);
    const isValidLength = digits.length >= 13 && digits.length <= 19;
    
    result = {
      isValid: luhnValid && isValidLength,
      cardType: cardInfo.type,
      cardIcon: cardInfo.icon,
      issuer: cardInfo.issuer,
      length: digits.length,
      luhnValid,
    };
  }
  function formatCardNumber(value: string): string {
    const digits = value.replace(/\D/g, '');
    const groups = digits.match(/.{1,4}/g);
    return groups ? groups.join(' ') : digits;
  }
  function handleInputChange(e: Event) {
    const formatted = formatCardNumber(e.target.value);
    cardNumber = formatted;
  }

</script>


    <div class="space-y-6">
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('cardNumber')}
        </label>
        <input
          type="text"
          value={cardNumber}
          onchange={handleInputChange}
          placeholder={t('inputPlaceholder')}
          maxLength={23}
          class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono text-lg tracking-wider"
        />
      </div>

      <button
        onclick={validateCard}
        class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
      >
        {t('validate')}
      </button>

      {#if result}
<div class={`p-6 rounded-lg border-2 ${
          result.isValid 
            ? 'bg-green-50 dark:bg-green-900/20 border-green-500' 
            : 'bg-red-50 dark:bg-red-900/20 border-red-500'
        }`}>
          <div class="flex items-center gap-3 mb-4">
            <span class="text-4xl">{result.cardIcon}</span>
            <div>
              <div class="text-xl font-bold text-gray-900 dark:text-white">
                {result.cardType}
              </div>
              <div class="text-sm text-gray-600 dark:text-gray-400">
                {result.issuer}
              </div>
            </div>
            <div class={`ml-auto px-4 py-2 rounded-full font-medium ${
              result.isValid 
                ? 'bg-green-500 text-white' 
                : 'bg-red-500 text-white'
            }`}>
              {result.isValid ? t('valid') : t('invalid')}
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4 text-sm">
            <div class="p-3 bg-white dark:bg-gray-800 rounded-lg">
              <div class="text-gray-500 dark:text-gray-400">{t('luhnCheck')}</div>
              <div class={`font-medium ${result.luhnValid ? 'text-green-600' : 'text-red-600'}`}>
                {result.luhnValid ? '✓ ' + t('passed') : '✗ ' + t('failed')}
              </div>
            </div>
            <div class="p-3 bg-white dark:bg-gray-800 rounded-lg">
              <div class="text-gray-500 dark:text-gray-400">{t('digits')}</div>
              <div class="font-medium text-gray-900 dark:text-white">
                {result.length} {t('digitsCount')}
              </div>
            </div>
          </div>
        </div>
{/if}

      <div class="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
        <div class="flex items-start gap-2">
          <span class="text-yellow-600"><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg></span>
          <p class="text-sm text-yellow-800 dark:text-yellow-300">
            {t('disclaimer')}
          </p>
        </div>
      </div>

      <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <h3 class="font-medium text-gray-900 dark:text-white mb-3">{t('supportedCards')}</h3>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-2">
          {#each cardPatterns.slice(0, 8) as card (card.type)}
<div  class="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
              <span>{card.icon}</span>
              <span>{card.type}</span>
            </div>
{/each}
        </div>
      </div>
    </div>
  
