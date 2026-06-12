"use client";

import { motion } from "framer-motion";
import { Hotel, ShoppingBag, Utensils, Wallet, Wind, Sparkles } from "lucide-react";
import type { BudgetBreakdown, PublicPersistedTrip } from "@/types";
import { pageTransition } from "@/styles/animations";
import { formatCurrencyValue } from "@/lib/currency";

const BUDGET_META = {
  accommodation: { label: "Accommodation", Icon: Hotel },
  food: { label: "Food", Icon: Utensils },
  transportation: { label: "Transportation", Icon: Wind },
  activities: { label: "Activities", Icon: Sparkles },
  shopping: { label: "Shopping", Icon: ShoppingBag },
  miscellaneous: { label: "Miscellaneous", Icon: Wallet }
} as const;

const DISPLAY_KEYS = [
  "accommodation",
  "food",
  "transportation",
  "activities",
  "shopping",
  "miscellaneous"
] satisfies Array<Exclude<keyof BudgetBreakdown, "total">>;

export function BudgetSummary({ trip }: { trip: PublicPersistedTrip }) {
  const breakdown = trip.budgetBreakdown;
  const entries = DISPLAY_KEYS.filter((key) => breakdown[key] > 0);

  return (
    <section aria-labelledby="budget-title" className="space-y-10">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#8FE3CF]">
          Budget summary
        </p>
        <h2
          id="budget-title"
          className="mt-5 text-3xl font-semibold tracking-[-0.035em] text-[#F8FAF8] sm:text-[2.8rem] sm:tracking-[-0.05em]"
        >
          Spend kept clear without feeling analytical.
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-sm leading-8 text-[#94A3B8]">
          A calmer budget view across the trip, shaped to stay readable and elegant rather than dashboard-heavy.
        </p>
      </div>

      <motion.div
        className="rounded-[1.8rem] border border-white/[0.08] bg-white/[0.035] p-6 shadow-[0_24px_64px_rgba(0,0,0,0.18)] backdrop-blur-xl sm:p-8"
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={pageTransition}
      >
        <div className="flex flex-col gap-4 border-b border-white/[0.08] pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#8FE3CF]">
              Estimated total
            </p>
            <h3 className="mt-3 break-words text-3xl font-semibold tracking-[-0.035em] text-[#F8FAF8] sm:text-4xl sm:tracking-[-0.05em]">
              {formatCurrencyValue(breakdown.total, trip.currency)}
            </h3>
          </div>
          <p className="max-w-md text-sm leading-7 text-[#94A3B8]">
            The itinerary balances stays, movement, meals, and highlights while leaving room for smaller local discoveries.
          </p>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {entries.map((key) => {
            const meta = BUDGET_META[key];
            const percentage =
              breakdown.total > 0
                ? Math.round((breakdown[key] / breakdown.total) * 100)
                : 0;

            return (
              <div
                key={key}
                className="rounded-[1.35rem] border border-white/[0.08] bg-[#0B1215]/42 p-5"
              >
                <p className="flex items-center gap-2 text-sm font-medium text-[#F8FAF8]">
                  <meta.Icon size={16} className="text-[#8FE3CF]" aria-hidden="true" />
                  {meta.label}
                </p>
                <p className="mt-3 break-words text-xl font-semibold tracking-[-0.03em] text-[#F8FAF8] sm:text-2xl sm:tracking-[-0.04em]">
                  {formatCurrencyValue(breakdown[key], trip.currency)}
                </p>
                <div
                  className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/[0.06]"
                  role="progressbar"
                  aria-label={`${meta.label} budget percentage`}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={percentage}
                >
                  <div
                    className="h-full rounded-full bg-[linear-gradient(90deg,#14B8A6,#8FE3CF)]"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <p className="mt-3 text-xs uppercase tracking-[0.18em] text-[#64748B]">
                  {percentage}% of total
                </p>
              </div>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
}
