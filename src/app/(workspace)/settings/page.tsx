import { AppSurface, PageIntro } from "@/components/shared";
import { CurrencyPreferenceCard } from "@/components/dashboard";

export default function SettingsPage() {
  return (
    <div className="space-y-12">
      <PageIntro
        eyebrow="Settings"
        title="Control the planning details that shape every budget."
        description="Choose whether Rovara should follow your browser currency automatically or stay locked to one currency across the workspace."
      />

      <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <CurrencyPreferenceCard />

        <AppSurface variant="soft" padding="md">
          <p className="rovara-card-title light:text-[#1F4E5F]">How it works</p>
          <div className="mt-5 space-y-4">
            {[
              "Auto detect uses the browser locale and updates the workspace to the currency that fits your region.",
              "Manual selection keeps budgets, charts, and trip totals in one stable currency while you plan.",
              "Destination comparisons still show local spending context separately inside the Generate Trip budget step."
            ].map((item) => (
              <div
                key={item}
                className="rounded-[1.3rem] border border-white/[0.08] bg-white/[0.03] px-4 py-4 text-sm leading-7 text-[#94A3B8] light:border-[#1F4E5F]/10 light:bg-white/75 light:text-[#1F4E5F]/68"
              >
                {item}
              </div>
            ))}
          </div>
        </AppSurface>
      </section>
    </div>
  );
}
