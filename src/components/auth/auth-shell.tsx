"use client";

import { useEffect, useRef, type ReactNode } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ShieldCheck, WandSparkles } from "lucide-react";
import { BrandLogo } from "@/components/brand/brand-logo";
import { ROUTES } from "@/constants/routes";
import { pageTransition } from "@/styles/animations";

type AuthShellProps = {
  mode: "sign-in" | "sign-up";
  title: string;
  description: string;
  children: ReactNode;
};

const featureRows = [
  {
    title: "Secure traveler identity",
    description: "Production-grade session management and route protection with Clerk.",
    icon: ShieldCheck
  },
  {
    title: "AI planning continuity",
    description: "Keep itineraries, saved trips, and recommendations synced across sessions.",
    icon: WandSparkles
  }
];

export function AuthShell({ mode, title, description, children }: AuthShellProps) {
  const isSignIn = mode === "sign-in";
  const isSignUp = mode === "sign-up";
  const shellRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const root = shellRef.current;
    if (!root) return;

    const normalizeBrandCopy = () => {
      const baseReplacements: Array<readonly [string, string]> = [
        ["Sign in to rovara", "Sign in to Rovara"],
        ["Sign up to rovara", "Sign up to Rovara"],
        ["Sign in to roava", "Sign in to Rovara"],
        ["Sign up to roava", "Sign up to Rovara"]
      ];
      const signUpReplacements: Array<readonly [string, string]> =
        mode === "sign-up"
          ? [
              ["FIRST NAME", "FIRST NAME *"],
              ["LAST NAME", "LAST NAME *"]
            ]
          : [];
      const replacements = new Map<string, string>([
        ...baseReplacements,
        ...signUpReplacements
      ]);

      root.querySelectorAll("h1, h2, h3, p, span, div").forEach((node) => {
        const text = node.textContent?.trim();
        if (!text) return;
        const replacement = replacements.get(text);
        if (replacement) node.textContent = replacement;
      });
    };

    normalizeBrandCopy();

    const observer = new MutationObserver(() => normalizeBrandCopy());
    observer.observe(root, { childList: true, subtree: true, characterData: true });

    return () => observer.disconnect();
  }, [mode]);

  return (
    <main
      ref={shellRef}
      className={`relative flex min-h-screen items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(20,184,166,0.12),transparent_24%),linear-gradient(180deg,#0B1215_0%,#0D1519_100%)] px-4 py-6 sm:px-6 sm:py-8 ${
        isSignUp ? "lg:py-3" : "lg:py-5"
      }`}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 top-14 h-72 w-72 rounded-full bg-[#14B8A6]/10 blur-[110px]"
      />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.018)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.018)_1px,transparent_1px)] bg-[size:52px_52px]" />

      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={pageTransition}
        className={`relative mx-auto grid w-full grid-cols-1 gap-4 rounded-[2rem] border border-white/[0.08] bg-[linear-gradient(180deg,rgba(255,255,255,0.028),rgba(255,255,255,0.012))] p-4 shadow-[0_30px_110px_rgba(0,0,0,0.32)] backdrop-blur-2xl lg:grid-cols-[1.02fr_0.98fr] lg:gap-4 ${
          isSignIn ? "max-w-[68rem] lg:p-3" : isSignUp ? "max-w-[76rem] lg:p-3.5" : "max-w-[78rem] lg:p-4"
        }`}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(143,227,207,0.07),transparent_34%),radial-gradient(circle_at_10%_14%,rgba(20,184,166,0.08),transparent_24%)]"
        />

        <section
          className={`relative overflow-hidden rounded-[1.8rem] border border-white/[0.08] bg-[#10191d]/88 p-6 sm:p-8 ${
            isSignIn ? "lg:p-4.5 xl:p-5" : isSignUp ? "lg:p-4.5 xl:p-5" : "lg:p-5 xl:p-6"
          }`}
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(20,184,166,0.11),transparent_26%),linear-gradient(180deg,rgba(255,255,255,0.02),transparent_30%)]"
          />

          <div className={`relative flex h-full flex-col ${isSignIn ? "gap-3.5" : isSignUp ? "gap-3.5" : "gap-4"}`}>
            <div className={isSignIn ? "space-y-3.5" : isSignUp ? "space-y-3" : "space-y-4"}>
              <Link
                href={ROUTES.HOME}
                className="inline-flex items-center gap-3 rounded-full border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-sm font-semibold tracking-[0.24em] text-[#F8FAF8] lg:px-3.5 lg:py-1.5"
              >
                <BrandLogo
                  sizes="(max-width: 1024px) 48px, 40px"
                  className={`rounded-2xl ${
                    isSignIn ? "w-12 lg:w-10" : isSignUp ? "w-12 lg:w-10" : "w-14 lg:w-12"
                  }`}
                  priority
                />
              </Link>

              <div className={`max-w-[27rem] ${isSignIn ? "space-y-2" : isSignUp ? "space-y-2" : "space-y-2.5"}`}>
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#64748B]">
                  {mode === "sign-in" ? "Rovara Authentication" : "Create Your Account"}
                </p>
                <h1
                  className={`text-balance font-semibold leading-[0.94] tracking-[-0.055em] text-[#F8FAF8] ${
                    isSignIn
                      ? "text-[1.8rem] sm:text-[2.15rem] xl:text-[2.35rem]"
                      : isSignUp
                        ? "text-[1.9rem] sm:text-[2.2rem] xl:text-[2.45rem]"
                        : "text-[2rem] sm:text-[2.35rem] xl:text-[2.6rem]"
                  }`}
                >
                  Plan beautiful trips with a secure, premium workspace.
                </h1>
                <p
                  className={`max-w-[24rem] text-[#94A3B8] xl:max-w-[25rem] ${
                    isSignIn ? "text-[13px] leading-[1.7]" : isSignUp ? "text-[13px] leading-[1.65]" : "text-[13.5px] leading-6"
                  }`}
                >
                  {mode === "sign-in"
                    ? "Return to your travel cockpit, continue planning, and keep every itinerary synced across devices."
                    : "Create your Rovara account to unlock AI-powered itineraries, saved travel boards, and future collaborative planning."}
                </p>
              </div>

              <div className={`grid ${isSignIn ? "gap-1.5" : isSignUp ? "gap-1.5" : "gap-2"}`}>
                {featureRows.map((feature) => {
                  const Icon = feature.icon;

                  return (
                    <div
                      key={feature.title}
                      className={`rounded-[1.25rem] border border-white/[0.08] bg-white/[0.03] px-4 lg:px-3.5 ${
                        isSignIn ? "py-2" : "py-2.5"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <span
                        className={`flex shrink-0 items-center justify-center rounded-2xl border border-[#14B8A6]/16 bg-[#14B8A6]/10 text-[#D6F5EC] ${
                            isSignIn ? "h-8 w-8 lg:h-8 lg:w-8" : isSignUp ? "h-9 w-9 lg:h-8 lg:w-8" : "h-10 w-10 lg:h-9 lg:w-9"
                          }`}
                        >
                          <Icon size={16} />
                        </span>
                        <div className="space-y-1">
                          <p className="text-sm font-semibold text-[#F8FAF8]">{feature.title}</p>
                          <p className="text-[12.5px] leading-5 text-[#94A3B8]">{feature.description}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className={`grid pt-1 xl:grid-cols-[1.08fr_0.92fr] ${isSignIn ? "gap-2.5" : isSignUp ? "gap-2.5" : "gap-3"}`}>
              <div
                className={`rounded-[1.35rem] border border-white/[0.08] bg-[linear-gradient(180deg,rgba(255,255,255,0.035),rgba(255,255,255,0.02))] px-4 ${
                  isSignIn ? "py-2.5" : isSignUp ? "py-2.5" : "py-3"
                }`}
              >
                <p className="text-sm font-semibold text-[#F8FAF8]">Built for a premium workflow</p>
                <p className="mt-1.5 max-w-[27rem] text-[12.5px] leading-5 text-[#94A3B8]">
                  Luxury motion, secure sessions, social sign-in support, and a future-ready auth foundation for Rovara.
                </p>
                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  {["256-bit sessions", "AI-first planning", "Live sync"].map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-white/[0.08] bg-white/[0.03] px-2.5 py-1 text-[10.5px] font-medium text-[#CBD5E1]"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              <div className={`rounded-[1.35rem] border border-white/[0.08] bg-white/[0.03] px-4 ${isSignIn ? "py-2.5" : isSignUp ? "py-2.5" : "py-3"}`}>
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#64748B]">
                  Why Rovara
                </p>
                <p className="mt-2 text-[12.5px] leading-5 text-[#94A3B8]">
                  Designed for travelers who want intelligent planning without noise, with every decision kept calm,
                  clear, and beautifully organized.
                </p>
              </div>
            </div>

            {!isSignIn ? (
              <div className="relative min-h-[10.5rem] overflow-hidden rounded-[1.45rem] border border-white/[0.08] bg-[linear-gradient(180deg,rgba(255,255,255,0.028),rgba(255,255,255,0.012))]">
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-[radial-gradient(circle_at_18%_28%,rgba(20,184,166,0.12),transparent_22%),linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:auto,2.9rem_2.9rem,2.9rem_2.9rem]"
                />
                <div className="relative flex h-full flex-col justify-between p-3.5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#64748B]">
                        Workspace preview
                      </p>
                      <p className="mt-2 max-w-[18rem] text-[13px] leading-5 text-[#94A3B8]">
                        A quieter planning surface for routes, pacing, and smarter movement.
                      </p>
                    </div>
                    <span className="rounded-full border border-[#14B8A6]/20 bg-[#14B8A6]/10 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-[#D6F5EC]">
                      Live sync
                    </span>
                  </div>

                  <div className="relative mt-4.5">
                    <div className="absolute left-[9%] top-3 h-px w-[72%] bg-[linear-gradient(90deg,rgba(143,227,207,0.12),rgba(143,227,207,0.8),rgba(143,227,207,0.12))]" />
                    <div className="flex items-center justify-between gap-3">
                      {[
                        ["Discover", "City signals"],
                        ["Shape", "Calm pacing"],
                        ["Draft", "Day flow"],
                        ["Refine", "Live budget"]
                      ].map(([title, copy], index) => (
                        <div key={title} className="relative flex flex-col items-center text-center">
                          <span
                            className={`z-10 flex h-10 w-10 items-center justify-center rounded-full border ${
                              index === 2
                                ? "border-[#8FE3CF]/40 bg-[#14B8A6]/18 text-[#E8FFFA]"
                                : "border-white/[0.08] bg-[#111a1e] text-[#CBD5E1]"
                            } h-9 w-9 text-[10.5px] font-semibold`}
                          >
                            {index + 1}
                          </span>
                          <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#CBD5E1]">
                            {title}
                          </p>
                          <p className="mt-1 text-[11.5px] text-[#64748B]">{copy}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </section>

        <section
          className={`relative flex items-center justify-center rounded-[1.8rem] border border-white/[0.08] bg-[#10191d]/88 p-4 sm:p-5 lg:items-start lg:justify-start ${
            isSignIn ? "lg:p-3" : isSignUp ? "lg:p-3" : "lg:p-3.5"
          }`}
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(143,227,207,0.08),transparent_34%)]"
          />

          <div className="relative w-full lg:flex lg:h-full lg:flex-col">
            <div className={`relative overflow-hidden rounded-[1.8rem] border border-white/[0.08] bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.015))] p-3 sm:p-4 lg:flex lg:flex-col ${
              isSignIn ? "lg:p-2" : isSignUp ? "lg:p-2" : "lg:p-2.5"
            } [&_.cl-rootBox]:!w-full [&_.cl-rootBox]:!max-w-none [&_.cl-cardBox]:!w-full [&_.cl-cardBox]:!max-w-none [&_.cl-card]:!w-full [&_.cl-card]:!max-w-none [&_.cl-page]:!w-full [&_.cl-page]:!max-w-none [&_.cl-main]:!w-full [&_.cl-main]:!max-w-none ${
              isSignIn ? "[&_.cl-main]:!gap-3.5" : isSignUp ? "[&_.cl-main]:!gap-3.25" : "[&_.cl-main]:!gap-4"
            } [&_.cl-pageScrollBox]:!w-full [&_.cl-pageScrollBox]:!max-w-none [&_.cl-header]:!w-full [&_.cl-header]:!px-5 ${
              isSignIn ? "[&_.cl-header]:!pt-4" : isSignUp ? "[&_.cl-header]:!pt-4" : "[&_.cl-header]:!pt-5"
            } [&_.cl-header]:!pb-0 ${
              isSignIn ? "[&_.cl-headerTitle]:!text-[1.75rem]" : isSignUp ? "[&_.cl-headerTitle]:!text-[1.72rem]" : "[&_.cl-headerTitle]:!text-[1.85rem]"
            } [&_.cl-headerSubtitle]:!mt-1.5 [&_.cl-headerSubtitle]:!text-[14px] [&_.cl-form]:!w-full ${
              isSignIn ? "[&_.cl-form]:!gap-3.5" : isSignUp ? "[&_.cl-form]:!gap-3.25" : "[&_.cl-form]:!gap-4"
            } [&_.cl-socialButtons]:!w-full [&_.cl-socialButtons]:!gap-3 [&_.cl-formFieldRow]:!w-full [&_.cl-formFieldRow]:!gap-3 [&_.cl-formField]:!w-full [&_.cl-formFieldInputGroup]:!w-full [&_.cl-formButtonRow]:!w-full [&_.cl-footer]:!w-full [&_.cl-footer]:!pt-3 ${
              isSignIn ? "[&_.cl-footer]:!pb-3" : isSignUp ? "[&_.cl-footer]:!pb-3" : "[&_.cl-footer]:!pb-4"
            } [&_.cl-footerAction]:!w-full [&_.cl-footerAction]:!justify-center [&_.cl-footerAction]:!text-center [&_.cl-footerActionText]:!text-center [&_.cl-footerActionTextContainer]:!w-full [&_.cl-footerActionTextContainer]:!justify-center [&_.cl-footerActionTextContainer]:!text-center [&_.cl-socialButtonsBlockButton]:!text-[1.18rem] [&_.cl-socialButtonsBlockButtonText]:!text-[1.18rem] [&_.cl-socialButtonsBlockButtonText]:!leading-none [&_.cl-formFieldLabel]:!mb-2 ${
              isSignUp ? "[&_.cl-formFieldInput]:!h-15 [&_.cl-formFieldInput]:!min-h-15 [&_.cl-formButtonPrimary]:!h-15 [&_.cl-formButtonPrimary]:!min-h-15" : "[&_.cl-formFieldInput]:!h-16 [&_.cl-formFieldInput]:!min-h-16 [&_.cl-formButtonPrimary]:!h-16 [&_.cl-formButtonPrimary]:!min-h-16"
            } [&_.cl-formFieldInput]:!rounded-[1.6rem] [&_.cl-formFieldInput]:!text-[1.08rem] [&_.cl-formButtonPrimary]:!rounded-[1.6rem] [&_.cl-formButtonPrimary]:!text-[1.08rem] ${mode === "sign-up" ? "[&_.cl-formFieldHintText]:!hidden" : ""}`}>
              <div className={`relative rounded-[1.6rem] border border-white/[0.06] bg-[#10191d]/92 p-2 sm:p-2.5 lg:flex lg:flex-col ${
                isSignIn ? "lg:p-1.5" : isSignUp ? "lg:p-1.5" : "lg:p-2"
              }`}>
                <div className="space-y-4 lg:hidden">
                  <div className="space-y-3 text-center">
                    <Link
                      href={ROUTES.HOME}
                      className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-sm font-semibold tracking-[0.22em] text-[#F8FAF8]"
                    >
                      <BrandLogo className="w-12 rounded-2xl" />
                    </Link>
                    <div className="space-y-2">
                      <h1 className="text-3xl font-semibold tracking-[-0.04em] text-[#F8FAF8]">{title}</h1>
                      <p className="text-sm leading-7 text-[#94A3B8]">{description}</p>
                    </div>
                  </div>
                </div>

                {children}

                {mode === "sign-in" ? null : null}
              </div>
            </div>
          </div>
        </section>
      </motion.section>
    </main>
  );
}
