import {
  formatCurrencyValue,
  isSupportedCurrency,
  resolveCurrencyOption,
  type SupportedCurrency
} from "@/lib/currency";

type DestinationBudgetProfile = {
  keywords: string[];
  title: string;
  country: string;
  currencyCode: string;
  currencyLocale: string;
  minimumBudget: number;
};

const DESTINATION_BUDGET_PROFILES: DestinationBudgetProfile[] = [
  {
    keywords: ["tokyo", "japan"],
    title: "Tokyo",
    country: "Japan",
    currencyCode: "JPY",
    currencyLocale: "ja-JP",
    minimumBudget: 90000
  },
  {
    keywords: ["paris", "france"],
    title: "Paris",
    country: "France",
    currencyCode: "EUR",
    currencyLocale: "fr-FR",
    minimumBudget: 900
  },
  {
    keywords: ["bali", "indonesia"],
    title: "Bali",
    country: "Indonesia",
    currencyCode: "IDR",
    currencyLocale: "id-ID",
    minimumBudget: 8500000
  },
  {
    keywords: ["lisbon", "portugal"],
    title: "Lisbon",
    country: "Portugal",
    currencyCode: "EUR",
    currencyLocale: "pt-PT",
    minimumBudget: 700
  },
  {
    keywords: ["seoul", "south korea", "korea"],
    title: "Seoul",
    country: "South Korea",
    currencyCode: "KRW",
    currencyLocale: "ko-KR",
    minimumBudget: 950000
  },
  {
    keywords: ["marrakech", "morocco"],
    title: "Marrakech",
    country: "Morocco",
    currencyCode: "MAD",
    currencyLocale: "fr-MA",
    minimumBudget: 7000
  }
];

const USD_EXCHANGE_RATES: Record<string, number> = {
  USD: 1,
  INR: 83,
  EUR: 0.92,
  GBP: 0.79,
  AED: 3.67,
  SGD: 1.35,
  JPY: 157,
  AUD: 1.52,
  CAD: 1.37,
  KRW: 1380,
  IDR: 16000,
  MAD: 10
};

export function formatAnyCurrency(
  value: number,
  currencyCode: string,
  locale = "en-US"
) {
  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: currencyCode,
      maximumFractionDigits: 0
    }).format(value);
  } catch {
    return `${currencyCode} ${Math.round(value).toLocaleString(locale)}`;
  }
}

export function resolveDestinationBudgetProfile(destination: string) {
  const normalized = destination.trim().toLowerCase();

  if (!normalized) return null;

  return (
    DESTINATION_BUDGET_PROFILES.find((profile) =>
      profile.keywords.some((keyword) => normalized.includes(keyword))
    ) ?? null
  );
}

export function convertCurrencyAmount(
  amount: number,
  fromCurrency: string,
  toCurrency: string
) {
  const fromRate = USD_EXCHANGE_RATES[fromCurrency];
  const toRate = USD_EXCHANGE_RATES[toCurrency];

  if (!fromRate || !toRate) return null;

  const usdAmount = amount / fromRate;
  return usdAmount * toRate;
}

export function formatSupportedCurrency(value: number, currency: SupportedCurrency) {
  return formatCurrencyValue(value, currency, resolveCurrencyOption(currency).locale);
}

type BudgetAssessmentInput = {
  destination: string;
  budget: number;
  budgetCurrency: SupportedCurrency;
};

export function assessBudgetRealism({
  destination,
  budget,
  budgetCurrency
}: BudgetAssessmentInput) {
  const profile = resolveDestinationBudgetProfile(destination);

  if (!profile || !Number.isFinite(budget) || budget <= 0) {
    return {
      profile,
      status: "unknown" as const,
      message: null,
      convertedBudget: null
    };
  }

  const convertedBudget = convertCurrencyAmount(
    budget,
    budgetCurrency,
    profile.currencyCode
  );

  if (convertedBudget === null) {
    return {
      profile,
      status: "unknown" as const,
      message: null,
      convertedBudget: null
    };
  }

  if (convertedBudget < profile.minimumBudget) {
    const localMinimum = convertCurrencyAmount(
      profile.minimumBudget,
      profile.currencyCode,
      budgetCurrency
    );

    const localMinimumLabel =
      localMinimum !== null
        ? formatSupportedCurrency(localMinimum, budgetCurrency)
        : formatAnyCurrency(profile.minimumBudget, profile.currencyCode, profile.currencyLocale);

    return {
      profile,
      status: "low" as const,
      convertedBudget,
      message: `With the current budget, a trip to ${profile.title} is unlikely to be possible. A more workable starting point is around ${localMinimumLabel}.`
    };
  }

  return {
    profile,
    status: "ok" as const,
    convertedBudget,
    message: `This budget looks workable for ${profile.title}, based on a respectful starting estimate.`
  };
}

export function resolveCurrencyLabel(code: string) {
  if (isSupportedCurrency(code)) {
    return resolveCurrencyOption(code).displayName || code;
  }

  return code;
}
