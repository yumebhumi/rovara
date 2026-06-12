"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode
} from "react";
import {
  CURRENCY_PREFERENCE_STORAGE_KEY,
  DEFAULT_CURRENCY,
  currencyOptions,
  detectCurrencyFromNavigator,
  formatCurrencyValue,
  formatNumberForCurrency,
  parseCurrencyPreference,
  resolveCurrencyOption,
  type CurrencyPreference,
  type SupportedCurrency
} from "@/lib/currency";

type CurrencyContextValue = {
  currency: SupportedCurrency;
  detectedCurrency: SupportedCurrency;
  preference: CurrencyPreference;
  isAuto: boolean;
  options: typeof currencyOptions;
  setPreference: (preference: CurrencyPreference) => void;
  formatCurrency: (value: number) => string;
  formatNumber: (value: number) => string;
  selectedOption: ReturnType<typeof resolveCurrencyOption>;
};

const CurrencyContext = createContext<CurrencyContextValue>({
  currency: DEFAULT_CURRENCY,
  detectedCurrency: DEFAULT_CURRENCY,
  preference: "auto",
  isAuto: true,
  options: currencyOptions,
  setPreference: () => undefined,
  formatCurrency: (value) => formatCurrencyValue(value, DEFAULT_CURRENCY),
  formatNumber: (value) => formatNumberForCurrency(value, DEFAULT_CURRENCY),
  selectedOption: resolveCurrencyOption(DEFAULT_CURRENCY)
});

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [preference, setPreference] = useState<CurrencyPreference>(() => {
    if (typeof window === "undefined") return "auto";
    return parseCurrencyPreference(window.localStorage.getItem(CURRENCY_PREFERENCE_STORAGE_KEY));
  });
  const [detectedCurrency] = useState<SupportedCurrency>(() => {
    if (typeof window === "undefined") return DEFAULT_CURRENCY;
    return detectCurrencyFromNavigator();
  });

  useEffect(() => {
    window.localStorage.setItem(CURRENCY_PREFERENCE_STORAGE_KEY, preference);
  }, [preference]);

  const currency = preference === "auto" ? detectedCurrency : preference;

  useEffect(() => {
    document.documentElement.dataset.currency = currency;
  }, [currency]);

  const formatCurrency = useCallback(
    (value: number) => formatCurrencyValue(value, currency),
    [currency]
  );

  const formatNumber = useCallback(
    (value: number) => formatNumberForCurrency(value, currency),
    [currency]
  );

  const value = useMemo(
    () => ({
      currency,
      detectedCurrency,
      preference,
      isAuto: preference === "auto",
      options: currencyOptions,
      setPreference,
      formatCurrency,
      formatNumber,
      selectedOption: resolveCurrencyOption(currency)
    }),
    [currency, detectedCurrency, formatCurrency, formatNumber, preference]
  );

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
}

export const useCurrency = () => useContext(CurrencyContext);
