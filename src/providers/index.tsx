"use client";

import type { ReactNode } from "react";
import { CurrencyProvider } from "./currency-provider";
import { ThemeProvider } from "./theme-provider";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <CurrencyProvider>{children}</CurrencyProvider>
    </ThemeProvider>
  );
}

export { ThemeProvider, useTheme } from "./theme-provider";
export { CurrencyProvider, useCurrency } from "./currency-provider";
