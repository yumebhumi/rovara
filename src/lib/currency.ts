export const SUPPORTED_CURRENCIES = [
  "INR",
  "USD",
  "EUR",
  "GBP",
  "AED",
  "SGD",
  "JPY",
  "AUD",
  "CAD"
] as const;

export type SupportedCurrency = (typeof SUPPORTED_CURRENCIES)[number];
export type CurrencyPreference = SupportedCurrency | "auto";

export type CurrencyOption = {
  code: SupportedCurrency;
  label: string;
  locale: string;
  displayName: string;
};

export const DEFAULT_CURRENCY: SupportedCurrency = "INR";
export const DEFAULT_LOCALE = "en-IN";
export const CURRENCY_PREFERENCE_STORAGE_KEY = "rovara-currency-preference";

export const currencyOptions: CurrencyOption[] = [
  { code: "INR", label: "Indian Rupee", locale: "en-IN", displayName: "Rs." },
  { code: "USD", label: "US Dollar", locale: "en-US", displayName: "$" },
  { code: "EUR", label: "Euro", locale: "en-IE", displayName: "EUR" },
  { code: "GBP", label: "British Pound", locale: "en-GB", displayName: "GBP" },
  { code: "AED", label: "UAE Dirham", locale: "en-AE", displayName: "AED" },
  { code: "SGD", label: "Singapore Dollar", locale: "en-SG", displayName: "SGD" },
  { code: "JPY", label: "Japanese Yen", locale: "ja-JP", displayName: "JPY" },
  { code: "AUD", label: "Australian Dollar", locale: "en-AU", displayName: "AUD" },
  { code: "CAD", label: "Canadian Dollar", locale: "en-CA", displayName: "CAD" }
];

const EURO_REGIONS = new Set([
  "AT",
  "BE",
  "CY",
  "DE",
  "EE",
  "ES",
  "FI",
  "FR",
  "GR",
  "HR",
  "IE",
  "IT",
  "LT",
  "LU",
  "LV",
  "MT",
  "NL",
  "PT",
  "SI",
  "SK"
]);

const REGION_TO_CURRENCY: Partial<Record<string, SupportedCurrency>> = {
  IN: "INR",
  US: "USD",
  GB: "GBP",
  AE: "AED",
  SG: "SGD",
  JP: "JPY",
  AU: "AUD",
  CA: "CAD"
};

export function isSupportedCurrency(value: string): value is SupportedCurrency {
  return SUPPORTED_CURRENCIES.includes(value as SupportedCurrency);
}

export function resolveCurrencyOption(currency: SupportedCurrency): CurrencyOption {
  return currencyOptions.find((option) => option.code === currency) ?? currencyOptions[0];
}

function extractRegionFromLocale(locale: string) {
  try {
    const intlLocale = new Intl.Locale(locale);
    return intlLocale.region?.toUpperCase();
  } catch {
    const parts = locale.split(/[-_]/);
    return parts[1]?.toUpperCase();
  }
}

export function detectCurrencyFromLocales(locales: readonly string[]): SupportedCurrency {
  for (const locale of locales) {
    const region = extractRegionFromLocale(locale);
    if (!region) continue;
    if (EURO_REGIONS.has(region)) return "EUR";
    if (REGION_TO_CURRENCY[region]) return REGION_TO_CURRENCY[region]!;
  }

  return DEFAULT_CURRENCY;
}

export function detectCurrencyFromNavigator(): SupportedCurrency {
  if (typeof window === "undefined") return DEFAULT_CURRENCY;
  const locales = window.navigator.languages?.length
    ? window.navigator.languages
    : [window.navigator.language];
  return detectCurrencyFromLocales(locales.filter(Boolean));
}

export function parseCurrencyPreference(value: string | null | undefined): CurrencyPreference {
  if (value === "auto") return "auto";
  if (value && isSupportedCurrency(value)) return value;
  return "auto";
}

export function formatCurrencyValue(
  value: number,
  currency: SupportedCurrency = DEFAULT_CURRENCY,
  locale = resolveCurrencyOption(currency).locale
) {
  const formatter = new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 0
  });

  if (currency !== "INR") {
    return formatter.format(value);
  }

  return formatter
    .formatToParts(value)
    .map((part) => (part.type === "currency" ? "Rs." : part.value))
    .join("");
}

export function formatNumberForCurrency(
  value: number,
  currency: SupportedCurrency = DEFAULT_CURRENCY
) {
  return new Intl.NumberFormat(resolveCurrencyOption(currency).locale).format(value);
}
