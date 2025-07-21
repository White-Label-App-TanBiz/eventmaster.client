import { UserRole, User as BaseUser, CurrencySettings, Language, Period } from '../types';

interface AuthContextType {
  user: BaseUser | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface CurrencyContextType {
  currencySettings: CurrencySettings;
  setCurrencySettings: (settings: CurrencySettings) => void;
  formatCurrency: (amount: number) => string;
}

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

interface PeriodContextType {
  period: Period;
  setPeriod: (period: Period) => void;
  getPeriodLabel: (period: Period) => string;
  getPeriodData: (baseData: any, period: Period) => any;
}

interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export type { UserRole, BaseUser as User, AuthContextType, CurrencySettings, CurrencyContextType, Language, LanguageContextType, Period, PeriodContextType, ThemeContextType };
