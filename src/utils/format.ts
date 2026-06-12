import { DEFAULT_CURRENCY, formatCurrencyValue, formatNumberForCurrency, type SupportedCurrency } from "@/lib/currency";

export const formatCurrency = (value: number, currency: SupportedCurrency = DEFAULT_CURRENCY) =>
  formatCurrencyValue(value, currency);

export const formatNumber = (value: number, currency: SupportedCurrency = DEFAULT_CURRENCY) =>
  formatNumberForCurrency(value, currency);

export const capitalize = (value: string) =>
  value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();

export const truncate = (value: string, maxLength: number) =>
  value.length > maxLength ? `${value.slice(0, maxLength)}…` : value;
