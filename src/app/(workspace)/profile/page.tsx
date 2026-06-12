import { Bell, Globe2, Sparkles, UserRound } from "lucide-react";
import { AppSurface, PageIntro } from "@/components/shared";
import { requireSessionUser } from "@/lib/auth/server";

export default async function ProfilePage() {
  const user = await requireSessionUser();

  return (
    <div className="space-y-12">
      <PageIntro
        eyebrow="Profile"
        title="Your planning preferences, kept simple."
        description="Rovara only needs a few signals to make itineraries feel more intentional. Keep the profile clear and easy to maintain."
      />

      <section
        aria-labelledby="profile-summary-title"
        className="grid min-w-0 gap-6 xl:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]"
      >
        <AppSurface variant="default" padding="md" glow>
          <div className="flex min-w-0 flex-col gap-4 min-[420px]:flex-row min-[420px]:items-center min-[420px]:gap-5">
            <span className="flex h-16 w-16 items-center justify-center rounded-[1.5rem] border border-[#2F6F73]/28 bg-[#2F6F73]/16 text-[#F4EDE1] light:text-[#2F6F73]">
              <UserRound size={24} aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <h2 id="profile-summary-title" className="rovara-card-title break-words light:text-[#1F4E5F]">{user.fullName}</h2>
              <p className="rovara-body-sm mt-1 break-all light:text-[#1F4E5F]/62">{user.email}</p>
            </div>
          </div>

          <div className="mt-10 space-y-4">
            {[
              { label: "Travel pace", value: "Balanced explorer", icon: Sparkles },
              { label: "Preferred regions", value: "Asia, Europe, coastal cities", icon: Globe2 },
              { label: "Notification cadence", value: "Context only", icon: Bell }
            ].map((item) => {
              const Icon = item.icon;

              return (
                <div key={item.label} className="flex flex-col gap-3 rounded-[1.35rem] border border-[#F4EDE1]/10 bg-white/5 px-4 py-4 light:border-[#1F4E5F]/10 light:bg-white/75 min-[520px]:flex-row min-[520px]:items-center min-[520px]:justify-between min-[520px]:gap-4 min-[520px]:px-5">
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[#2F6F73]/25 bg-[#2F6F73]/14 text-[#F4EDE1] light:text-[#2F6F73]">
                      <Icon size={16} aria-hidden="true" />
                    </span>
                    <span className="rovara-meta text-[#F4EDE1]/72 light:text-[#1F4E5F]/74">{item.label}</span>
                  </div>
                  <span className="break-words text-sm font-medium leading-6 text-[#F4EDE1] light:text-[#1F4E5F] min-[520px]:text-right">{item.value}</span>
                </div>
              );
            })}
          </div>
        </AppSurface>

        <div className="grid gap-5">
          {[
            {
              title: "Account",
              description: "Keep the account light. Sign in, return to saved trips, and continue where the itinerary left off."
            },
            {
              title: "Trip defaults",
              description: "Set the pace, budget comfort, and stay style Rovara should prefer when building a first draft."
            },
            {
              title: "Planning clarity",
              description: "Keep the experience calmer by limiting notifications and letting the itinerary stay the main focus."
            }
          ].map((section) => (
            <AppSurface key={section.title} variant="soft" padding="md">
              <h2 className="rovara-card-title light:text-[#1F4E5F]">{section.title}</h2>
              <p className="rovara-body-sm mt-3 text-[#F4EDE1]/58 light:text-[#1F4E5F]/62">{section.description}</p>
            </AppSurface>
          ))}
        </div>
      </section>
    </div>
  );
}
