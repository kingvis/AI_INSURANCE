"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import currencyService, { SupportedCurrency, SUPPORTED_CURRENCIES } from '@/lib/currency-service';

export interface CurrencyValues {
  // Store values in USD as base currency for accurate conversions
  baseValues: {
    income?: number;
    savings?: number;
    netWorth?: number;
    monthlyExpenses?: number;
    debt?: number;
    emergencyFund?: number;
    targetNetWorth?: number;
    monthlySavings?: number;
    propertyValue?: number;
    retirementSavings?: number;
  };
  // Current display values in selected currency
  displayValues: {
    income?: number;
    savings?: number;
    netWorth?: number;
    monthlyExpenses?: number;
    debt?: number;
    emergencyFund?: number;
    targetNetWorth?: number;
    monthlySavings?: number;
    propertyValue?: number;
    retirementSavings?: number;
  };
}

interface CurrencyContextType {
  // Home country (user's base currency - set once)
  homeCountry: string;
  homeCurrency: SupportedCurrency | null;
  
  // Comparison country (for viewing equivalents)
  comparisonCountry: string;
  comparisonCurrency: SupportedCurrency | null;
  
  // All supported currencies
  supportedCurrencies: Record<string, SupportedCurrency>;
  
  // Values management (always stored in home currency)
  currencyValues: CurrencyValues;
  
  // Methods
  setHomeCountry: (country: string) => void;
  setComparisonCountry: (country: string) => void;
  updateValue: (key: keyof CurrencyValues['baseValues'], value: number) => void;
  
  // Conversion methods
  convertToComparison: (homeAmount: number) => number;
  formatHomeAmount: (amount: number) => string;
  formatComparisonAmount: (homeAmount: number) => string;
  getComparisonEquivalent: (homeAmount: number) => string;
  
  resetValues: () => void;
  
  // Real-time rate updates
  isLoadingRates: boolean;
  lastRateUpdate: Date | null;
  refreshRates: () => Promise<void>;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
}

interface CurrencyProviderProps {
  children: ReactNode;
  initialCountry?: string;
}

export function CurrencyProvider({ children, initialCountry = 'usa' }: CurrencyProviderProps) {
  const [homeCountry, setHomeCountryState] = useState<string>(initialCountry);
  const [comparisonCountry, setComparisonCountryState] = useState<string>('india');
  const [currencyValues, setCurrencyValues] = useState<CurrencyValues>({
    baseValues: {},
    displayValues: {}
  });
  const [isLoadingRates, setIsLoadingRates] = useState(false);
  const [lastRateUpdate, setLastRateUpdate] = useState<Date | null>(null);

  const homeCurrency = SUPPORTED_CURRENCIES[homeCountry] || null;
  const comparisonCurrency = SUPPORTED_CURRENCIES[comparisonCountry] || null;

  // Convert all base values to display values when home country changes
  useEffect(() => {
    updateDisplayValues();
  }, [homeCountry]);

  const updateDisplayValues = () => {
    // Values are already in home currency format, no conversion needed for display
    setCurrencyValues(prev => ({
      ...prev,
      displayValues: { ...prev.baseValues }
    }));
  };

  const setHomeCountry = (country: string) => {
    if (SUPPORTED_CURRENCIES[country]) {
      setHomeCountryState(country);
      // Save to localStorage for persistence
      localStorage.setItem('homeCountry', country);
    }
  };

  const setComparisonCountry = (country: string) => {
    if (SUPPORTED_CURRENCIES[country]) {
      setComparisonCountryState(country);
      localStorage.setItem('comparisonCountry', country);
    }
  };

  const updateValue = (
    key: keyof CurrencyValues['baseValues'], 
    value: number
  ) => {
    // Store value directly in home currency (no conversion needed)
    setCurrencyValues(prev => ({
      baseValues: {
        ...prev.baseValues,
        [key]: value
      },
      displayValues: {
        ...prev.displayValues,
        [key]: value
      }
    }));
  };

  // Convert home currency amount to comparison currency
  const convertToComparison = (homeAmount: number): number => {
    return currencyService.convert(homeAmount, homeCountry, comparisonCountry);
  };

  // Format amount in home currency
  const formatHomeAmount = (amount: number): string => {
    return currencyService.formatAmount(amount, homeCountry);
  };

  // Format home amount as comparison currency
  const formatComparisonAmount = (homeAmount: number): string => {
    const convertedAmount = convertToComparison(homeAmount);
    return currencyService.formatAmount(convertedAmount, comparisonCountry);
  };

  // Get comparison equivalent string (e.g., "In India, your $5000 would be ₹4,15,000")
  const getComparisonEquivalent = (homeAmount: number): string => {
    const homeFormatted = formatHomeAmount(homeAmount);
    const comparisonFormatted = formatComparisonAmount(homeAmount);
    const comparisonCountryName = comparisonCurrency?.country || comparisonCountry;
    
    return `In ${comparisonCountryName}, your ${homeFormatted} would be equivalent to ${comparisonFormatted}`;
  };

  const resetValues = () => {
    setCurrencyValues({
      baseValues: {},
      displayValues: {}
    });
  };

  const refreshRates = async (): Promise<void> => {
    setIsLoadingRates(true);
    try {
      const success = await currencyService.fetchRealTimeRates();
      if (success) {
        setLastRateUpdate(new Date());
        updateDisplayValues(); // Recalculate display values with new rates
      }
    } catch (error) {
      console.error('Failed to refresh currency rates:', error);
    } finally {
      setIsLoadingRates(false);
    }
  };

  // Initialize from localStorage and fetch rates on mount
  useEffect(() => {
    const savedHomeCountry = localStorage.getItem('homeCountry');
    const savedComparisonCountry = localStorage.getItem('comparisonCountry');
    
    if (savedHomeCountry && SUPPORTED_CURRENCIES[savedHomeCountry]) {
      setHomeCountryState(savedHomeCountry);
    }
    if (savedComparisonCountry && SUPPORTED_CURRENCIES[savedComparisonCountry]) {
      setComparisonCountryState(savedComparisonCountry);
    }

    // Initial rate fetch
    refreshRates();
  }, []);

  // Auto-refresh rates every hour
  useEffect(() => {
    const interval = setInterval(refreshRates, 60 * 60 * 1000); // 1 hour
    return () => clearInterval(interval);
  }, []);

  const contextValue: CurrencyContextType = {
    homeCountry,
    homeCurrency,
    comparisonCountry,
    comparisonCurrency,
    supportedCurrencies: SUPPORTED_CURRENCIES,
    currencyValues,
    setHomeCountry,
    setComparisonCountry,
    updateValue,
    convertToComparison,
    formatHomeAmount,
    formatComparisonAmount,
    getComparisonEquivalent,
    resetValues,
    isLoadingRates,
    lastRateUpdate,
    refreshRates
  };

  return (
    <CurrencyContext.Provider value={contextValue}>
      {children}
    </CurrencyContext.Provider>
  );
}

// Hook for easy access to currency conversion in components
export function useCurrencyConverter() {
  const { formatHomeAmount, homeCurrency } = useCurrency();
  
  return {
    format: formatHomeAmount,
    currency: homeCurrency,
    symbol: homeCurrency?.symbol || '$'
  };
}

// Hook for managing specific financial values
export function useFinancialValue(key: keyof CurrencyValues['baseValues']) {
  const { currencyValues, updateValue } = useCurrency();
  
  const value = currencyValues.displayValues[key] || 0;
  const baseValue = currencyValues.baseValues[key] || 0;
  
  const setValue = (newValue: number) => {
    updateValue(key, newValue);
  };
  
  return {
    value,
    baseValue,
    setValue
  };
}

export default CurrencyContext; 