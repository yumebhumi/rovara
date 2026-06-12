"use client";

import { WalletCards } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  assessBudgetRealism,
  formatAnyCurrency,
  formatSupportedCurrency,
  resolveCurrencyLabel,
  resolveDestinationBudgetProfile
} from "@/lib/trip-budget";
import {
  tripGenerationBudgetMax,
  tripGenerationBudgetMin
} from "@/lib/validations/trip-generation";
import { useCurrency } from "@/providers";

type BudgetSliderProps = {
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
  describedBy?: string;
  invalid?: boolean;
  destination?: string;
};

export function BudgetSlider({
  value,
  onChange,
  disabled = false,
  describedBy,
  invalid = false,
  destination = ""
}: BudgetSliderProps) {
  const { currency, formatCurrency } = useCurrency();
  const safeValue = Math.min(Math.max(value || 0, 0), tripGenerationBudgetMax);
  const destinationProfile = resolveDestinationBudgetProfile(destination);
  const assessment = assessBudgetRealism({
    destination,
    budget: safeValue,
    budgetCurrency: currency
  });
  const destinationCurrencyLabel = destinationProfile && safeValue > 0
    ? formatAnyCurrency(
        assessment.convertedBudget ?? destinationProfile.minimumBudget,
        destinationProfile.currencyCode,
        destinationProfile.currencyLocale
      )
    : null;
  return (
    <div className="rounded-[1.4rem] border border-white/[0.07] bg-white/[0.025] p-4 backdrop-blur-lg light:border-[#0F1720]/8 light:bg-white">
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-[1rem] border border-white/[0.08] bg-white/[0.04] text-[#D6F5EC]">
            <WalletCards size={16} aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <p className="text-[0.95rem] font-medium text-[#F8FAF8] light:text-[#0F1720]">
              Your trip budget
            </p>
            <p className="text-[0.82rem] leading-6 text-[#94A3B8] light:text-[#64748B]">
              Set the range you want Rovara to plan around.
            </p>
          </div>
        </div>
        <div className="w-fit max-w-full rounded-full border border-white/[0.08] bg-white/[0.04] px-3.5 py-1.5 text-[0.88rem] font-medium text-[#DDF9F1] light:text-[#0F1720]">
          {formatCurrency(safeValue)}
        </div>
      </div>

      <div className="space-y-[1.125rem]">
        <div className="rounded-[1.15rem] border border-white/[0.07] bg-black/10 px-4 py-4">
          <div className="mb-4">
            <span className="text-[0.82rem] font-medium tracking-[0.01em] text-[#94A3B8]">
              {resolveCurrencyLabel(currency)} total budget
            </span>
          </div>

          <div className="flex min-h-[3.8rem] min-w-0 items-center gap-3 rounded-[1rem] border border-white/[0.06] bg-white/[0.03] px-4">
            <span className="shrink-0 text-[1.05rem] font-semibold tracking-[-0.03em] text-[#D6F5EC]">
              {resolveCurrencyLabel(currency)}
            </span>
            <Input
              id="budget"
              aria-label={`${resolveCurrencyLabel(currency)} total trip budget`}
              type="text"
              min={tripGenerationBudgetMin}
              inputMode="numeric"
              value={safeValue > 0 ? String(safeValue) : ""}
              disabled={disabled}
              onChange={(event) => {
                const digits = event.target.value.replace(/[^\d]/g, "");
                onChange(digits ? Math.min(Number(digits), tripGenerationBudgetMax) : 0);
              }}
              aria-invalid={invalid}
              aria-describedby={describedBy}
              placeholder="Enter total budget"
              className="h-auto min-w-0 flex-1 border-0 bg-transparent py-0 pl-1 text-[1.2rem] font-semibold tracking-[-0.03em] text-[#F8FAF8] shadow-none focus:border-0 focus:bg-transparent focus:ring-0 focus-visible:ring-0 sm:text-[1.5rem] sm:tracking-[-0.04em]"
            />
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-[1.15rem] border border-white/[0.07] bg-white/[0.03] px-4 py-3.5">
            <p className="text-[0.8rem] font-medium tracking-[0.01em] text-[#64748B]">
              Planning in
            </p>
            <p className="mt-1.5 break-words text-sm text-[#F8FAF8]">
              {formatSupportedCurrency(safeValue || 0, currency)}
            </p>
          </div>

          <div className="rounded-[1.15rem] border border-white/[0.07] bg-white/[0.03] px-4 py-3.5">
            <p className="text-[0.8rem] font-medium tracking-[0.01em] text-[#64748B]">
              Local spend context
            </p>
            <p className="mt-1.5 break-words text-sm leading-6 text-[#F8FAF8]">
              {destinationProfile
                ? destinationCurrencyLabel
                  ? `${destinationProfile.currencyCode} • about ${destinationCurrencyLabel}`
                  : `${destinationProfile.currencyCode} • add a budget to compare local spending`
                : "Select a destination to compare local spending"}
            </p>
          </div>
        </div>

        {assessment.message ? (
          <div
            className={
              assessment.status === "low"
                ? "rounded-[1.15rem] border border-amber-400/18 bg-amber-500/8 px-4 py-3 text-sm leading-7 text-amber-100"
                : "rounded-[1.15rem] border border-[#14B8A6]/16 bg-[#14B8A6]/[0.07] px-4 py-3 text-sm leading-7 text-[#D6F5EC]"
            }
          >
            {assessment.message}
          </div>
        ) : (
          <p className="text-sm leading-7 text-[#94A3B8]">
            {destination
              ? "Rovara will compare your budget against typical trip costs for this destination."
              : "Add the destination first and Rovara will tell you whether the budget feels workable."}
          </p>
        )}
      </div>
    </div>
  );
}
