"use client";

import { Coins, LocateFixed } from "lucide-react";
import { formatCurrencyValue } from "@/lib/currency";
import { DashboardSurface } from "./dashboard-surface";
import { Button } from "@/components/ui/button";
import { useCurrency } from "@/providers";
import { cn } from "@/utils/cn";

const featuredCurrencies = ["INR", "USD", "EUR", "GBP", "AED", "SGD"] as const;

export function CurrencyPreferenceCard() {
  const {
    currency,
    detectedCurrency,
    preference,
    setPreference,
    formatCurrency,
    options
  } = useCurrency();

  return (
    <DashboardSurface variant="soft" padding="md">
      <div className="flex items-start gap-4">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#2F6F73]/25 bg-[#2F6F73]/14 text-[#F4EDE1] light:text-[#2F6F73]">
          <Coins size={18} />
        </span>
        <div className="min-w-0">
          <p className="text-lg font-semibold text-[#F4EDE1] light:text-[#1F4E5F]">Currency display</p>
          <p className="mt-1 text-sm leading-7 text-[#F4EDE1]/58 light:text-[#1F4E5F]/62">
            Auto-detect from browser locale or lock the workspace to one currency for budget reviews.
          </p>
        </div>
      </div>

      <div className="mt-5 rounded-[1.35rem] border border-[#F4EDE1]/10 bg-white/5 p-4 light:border-[#1F4E5F]/10 light:bg-white/75">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-[#F4EDE1] light:text-[#1F4E5F]">Current currency</p>
            <p className="mt-1 text-sm text-[#F4EDE1]/58 light:text-[#1F4E5F]/58">
              {currency} · {options.find((option) => option.code === currency)?.label}
            </p>
          </div>
          <span className="rounded-full border border-[#2F6F73]/25 bg-[#2F6F73]/12 px-3 py-1 text-xs font-medium text-[#F4EDE1] light:text-[#2F6F73]">
            {formatCurrency(2400)}
          </span>
        </div>

        <div className="mt-4">
          <button
            type="button"
            onClick={() => setPreference("auto")}
            className={cn(
              "flex w-full items-start justify-between gap-3 rounded-[1.2rem] border px-4 py-3 text-left transition",
              preference === "auto"
                ? "border-[#2F6F73]/38 bg-[#2F6F73]/14 text-[#F4EDE1] shadow-[0_12px_34px_rgba(47,111,115,0.16)]"
                : "border-[#F4EDE1]/10 bg-white/5 text-[#F4EDE1]/78 hover:border-[#2F6F73]/22 hover:bg-white/8 light:border-[#1F4E5F]/10 light:bg-white/80 light:text-[#1F4E5F]/74"
            )}
          >
            <div className="flex items-start gap-3">
              <span className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-2xl border border-[#2F6F73]/25 bg-[#2F6F73]/12 text-[#F4EDE1] light:text-[#2F6F73]">
                <LocateFixed size={15} />
              </span>
              <div>
                <p className="text-sm font-medium">Auto detect</p>
                <p className="mt-1 text-xs leading-6 opacity-70">
                  Uses your browser locale. Currently resolves to {detectedCurrency}.
                </p>
              </div>
            </div>
            <span className="rounded-full border border-[#2F6F73]/22 bg-[#2F6F73]/10 px-2.5 py-1 text-[10px] font-semibold tracking-[0.16em]">
              {preference === "auto" ? "ACTIVE" : "AUTO"}
            </span>
          </button>
        </div>

        <div className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
          {featuredCurrencies.map((code) => {
            const option = options.find((item) => item.code === code)!;
            const active = preference === code;

            return (
              <Button
                key={option.code}
                type="button"
                variant="outline"
                onClick={() => setPreference(option.code)}
                className={cn(
                  "h-auto flex-col items-start rounded-[1.2rem] px-4 py-3 text-left",
                  active
                    ? "border-[#2F6F73]/38 bg-[#2F6F73]/14 text-[#F4EDE1] hover:bg-[#2F6F73]/18"
                    : "text-[#F4EDE1]/80 light:text-[#1F4E5F]"
                )}
              >
                <span className="text-sm font-semibold">{option.code}</span>
                <span className="mt-1 text-xs opacity-70">{option.label}</span>
                <span className="mt-2 text-xs opacity-60">{formatCurrencyValue(2400, option.code)}</span>
              </Button>
            );
          })}
        </div>
      </div>
    </DashboardSurface>
  );
}
