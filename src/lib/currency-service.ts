// Real-time Currency Conversion Service
// Supports automatic conversion between INR, USD, GBP, CAD, AUD, EUR

export interface CurrencyRate {
  code: string;
  name: string;
  symbol: string;
  rate: number; // Rate relative to USD
  lastUpdated: Date;
}

export interface SupportedCurrency {
  code: string;
  name: string;
  symbol: string;
  country: string;
  flag: string;
}

// Supported currencies configuration
export const SUPPORTED_CURRENCIES: Record<string, SupportedCurrency> = {
  'india': {
    code: 'INR',
    name: 'Indian Rupee',
    symbol: '₹',
    country: 'India',
    flag: '🇮🇳'
  },
  'usa': {
    code: 'USD',
    name: 'US Dollar',
    symbol: '$',
    country: 'United States',
    flag: '🇺🇸'
  },
  'uk': {
    code: 'GBP',
    name: 'British Pound',
    symbol: '£',
    country: 'United Kingdom',
    flag: '🇬🇧'
  },
  'canada': {
    code: 'CAD',
    name: 'Canadian Dollar',
    symbol: 'C$',
    country: 'Canada',
    flag: '🇨🇦'
  },
  'australia': {
    code: 'AUD',
    name: 'Australian Dollar',
    symbol: 'A$',
    country: 'Australia',
    flag: '🇦🇺'
  },
  'germany': {
    code: 'EUR',
    name: 'Euro',
    symbol: '€',
    country: 'Germany',
    flag: '🇩🇪'
  }
};

// Fallback rates (updated as of January 2025)
const FALLBACK_RATES: Record<string, number> = {
  'USD': 1.0,      // Base currency
  'INR': 86.15,    // 1 USD = 86.15 INR (more current rate)
  'GBP': 0.8142,   // 1 USD = 0.8142 GBP
  'CAD': 1.4298,   // 1 USD = 1.4298 CAD
  'AUD': 1.5864,   // 1 USD = 1.5864 AUD
  'EUR': 0.9612    // 1 USD = 0.9612 EUR
};

class CurrencyService {
  private rates: Record<string, CurrencyRate> = {};
  private lastFetch: Date | null = null;
  private readonly CACHE_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds

  constructor() {
    this.initializeFallbackRates();
  }

  private initializeFallbackRates() {
    Object.entries(FALLBACK_RATES).forEach(([code, rate]) => {
      this.rates[code] = {
        code,
        name: this.getCurrencyName(code),
        symbol: this.getCurrencySymbol(code),
        rate,
        lastUpdated: new Date()
      };
    });
  }

  private getCurrencyName(code: string): string {
    const currency = Object.values(SUPPORTED_CURRENCIES).find(c => c.code === code);
    return currency?.name || code;
  }

  private getCurrencySymbol(code: string): string {
    const currency = Object.values(SUPPORTED_CURRENCIES).find(c => c.code === code);
    return currency?.symbol || code;
  }

  async fetchRealTimeRates(): Promise<boolean> {
    // Check if we need to fetch new rates
    if (this.lastFetch && (Date.now() - this.lastFetch.getTime()) < this.CACHE_DURATION) {
      return true; // Use cached rates
    }

    try {
      // Try multiple free APIs for better reliability
      const apis = [
        'https://api.exchangerate-api.com/v4/latest/USD',
        'https://open.er-api.com/v6/latest/USD',
        'https://api.fxratesapi.com/latest?base=USD'
      ];

      for (const apiUrl of apis) {
        try {
          // Create abort controller for timeout
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 5000);
          
          const response = await fetch(apiUrl, {
            headers: {
              'Accept': 'application/json',
            },
            signal: controller.signal
          });
          
          clearTimeout(timeoutId);

          if (!response.ok) continue;

          const data = await response.json();
          
          if (data.rates && typeof data.rates === 'object') {
            // Update rates with real-time data
            Object.entries(FALLBACK_RATES).forEach(([code]) => {
              const realRate = data.rates[code];
              if (realRate && typeof realRate === 'number') {
                this.rates[code] = {
                  code,
                  name: this.getCurrencyName(code),
                  symbol: this.getCurrencySymbol(code),
                  rate: realRate,
                  lastUpdated: new Date()
                };
              }
            });

            this.lastFetch = new Date();
            console.log('✅ Real-time currency rates updated successfully');
            return true;
          }
        } catch (apiError) {
          console.warn(`API ${apiUrl} failed:`, apiError);
          continue;
        }
      }

      console.warn('⚠️ All currency APIs failed, using fallback rates');
      return false;
    } catch (error) {
      console.error('❌ Currency rate fetch failed:', error);
      return false;
    }
  }

  getRates(): Record<string, CurrencyRate> {
    return { ...this.rates };
  }

  getRate(currencyCode: string): number {
    return this.rates[currencyCode]?.rate || FALLBACK_RATES[currencyCode] || 1;
  }

  // Convert amount from one currency to another
  convert(amount: number, fromCountry: string, toCountry: string): number {
    const fromCurrency = SUPPORTED_CURRENCIES[fromCountry];
    const toCurrency = SUPPORTED_CURRENCIES[toCountry];

    if (!fromCurrency || !toCurrency) {
      console.warn(`Currency not supported: ${fromCountry} -> ${toCountry}`);
      return amount;
    }

    const fromRate = this.getRate(fromCurrency.code);
    const toRate = this.getRate(toCurrency.code);

    // Convert to USD first, then to target currency
    const usdAmount = amount / fromRate;
    const convertedAmount = usdAmount * toRate;

    return Math.round(convertedAmount * 100) / 100; // Round to 2 decimal places
  }

  // Convert amount to USD for standardization
  convertToUSD(amount: number, fromCountry: string): number {
    return this.convert(amount, fromCountry, 'usa');
  }

  // Convert amount from USD to target currency
  convertFromUSD(usdAmount: number, toCountry: string): number {
    return this.convert(usdAmount, 'usa', toCountry);
  }

  // Get currency info for a country
  getCurrencyInfo(countryKey: string): SupportedCurrency | null {
    return SUPPORTED_CURRENCIES[countryKey] || null;
  }

  // Get all supported currencies
  getAllCurrencies(): SupportedCurrency[] {
    return Object.values(SUPPORTED_CURRENCIES);
  }

  // Format amount with proper currency symbol
  formatAmount(amount: number, countryKey: string): string {
    const currency = this.getCurrencyInfo(countryKey);
    if (!currency) return amount.toString();

    // Format with appropriate decimal places and grouping
    const formatter = new Intl.NumberFormat(this.getLocale(countryKey), {
      style: 'currency',
      currency: currency.code,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    });

    return formatter.format(amount);
  }

  private getLocale(countryKey: string): string {
    const localeMap: Record<string, string> = {
      'india': 'en-IN',
      'usa': 'en-US',
      'uk': 'en-GB',
      'canada': 'en-CA',
      'australia': 'en-AU',
      'germany': 'de-DE'
    };
    return localeMap[countryKey] || 'en-US';
  }

  // Get exchange rate display
  getExchangeRateDisplay(fromCountry: string, toCountry: string): string {
    const rate = this.convert(1, fromCountry, toCountry);
    const fromCurrency = this.getCurrencyInfo(fromCountry);
    const toCurrency = this.getCurrencyInfo(toCountry);
    
    if (!fromCurrency || !toCurrency) return '';

    return `1 ${fromCurrency.symbol} = ${rate.toFixed(4)} ${toCurrency.symbol}`;
  }

  // Initialize service and fetch rates
  async initialize(): Promise<void> {
    await this.fetchRealTimeRates();
    
    // Set up periodic rate updates (every hour)
    setInterval(() => {
      this.fetchRealTimeRates();
    }, this.CACHE_DURATION);
  }
}

// Create singleton instance
export const currencyService = new CurrencyService();

// Initialize on module load
if (typeof window !== 'undefined') {
  currencyService.initialize();
}

export default currencyService; 