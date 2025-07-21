import React, { createContext, useContext, useState, useEffect } from 'react';
import type { CurrencySettings, CurrencyContextType } from './types';

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }

  return context;
};

const defaultCurrencySettings: CurrencySettings = {
  symbol: '$',
  separator: 'none',
  code: 'USD',
  decimals: 2,
};

const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currencySettings, setCurrencySettingsState] = useState<CurrencySettings>(defaultCurrencySettings);

  useEffect(() => {
    const savedSettings = localStorage.getItem('currencySettings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setCurrencySettingsState(parsed);
      } catch (error) {
        console.error('Failed to parse currency settings from localStorage:', error);
      }
    }
  }, []);

  const setCurrencySettings = (settings: CurrencySettings) => {
    setCurrencySettingsState(settings);
    localStorage.setItem('currencySettings', JSON.stringify(settings));
  };

  const formatCurrency = (amount: number): string => {
    const { symbol, separator, code, decimals } = currencySettings;
    const separatorChar = separator === 'space' ? ' ' : '';
    const formattedAmount =
      decimals === 0
        ? Math.round(amount).toLocaleString('en-US')
        : amount.toLocaleString('en-US', {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals,
          });

    return `${symbol}${separatorChar}${formattedAmount} ${code}`;
  };

  return (
    <CurrencyContext.Provider
      value={{
        currencySettings,
        setCurrencySettings,
        formatCurrency,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};

export { CurrencyProvider, useCurrency };
