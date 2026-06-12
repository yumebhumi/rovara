import { Bookmark, Sparkles, UserRound } from "lucide-react";
import type { ReactElement } from "react";
import { ROUTES } from "@/constants/routes";
import { clerkRouting } from "./routes";

const authCardClass =
  "border-0 bg-transparent shadow-none backdrop-blur-none";

export const clerkAppearance = {
  variables: {
    colorPrimary: "#14B8A6",
    colorForeground: "#F8FAF8",
    colorBackground: "#10191d",
    colorInputBackground: "rgba(255, 255, 255, 0.04)",
    colorInputText: "#F8FAF8",
    colorText: "#F8FAF8",
    colorTextSecondary: "rgba(148, 163, 184, 0.88)",
    colorDanger: "#f87171",
    colorSuccess: "#34d399",
    borderRadius: "1rem",
    fontFamily: "var(--font-sans), system-ui, sans-serif"
  },
  elements: {
    rootBox: "w-full max-w-none",
    cardBox: "w-full max-w-none shadow-none",
    card: `${authCardClass} w-full max-w-none rounded-none p-0`,
    pageScrollBox: "w-full max-w-none",
    header: "px-5 pt-5 pb-0 sm:px-6 sm:pt-6",
    headerTitle:
      "text-[1.85rem] font-semibold tracking-[-0.04em] text-[#F8FAF8]",
    headerSubtitle:
      "mt-1.5 text-[14px] leading-6 text-[#94A3B8]",
    socialButtonsBlockButton:
      "h-15 rounded-[1.45rem] border border-white/[0.1] bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.03))] px-6 !text-[#F8FAF8] shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_12px_28px_rgba(0,0,0,0.1)] transition-colors duration-200 hover:border-[#14B8A6]/24 hover:bg-[linear-gradient(180deg,rgba(255,255,255,0.065),rgba(255,255,255,0.035))] focus-visible:ring-2 focus-visible:ring-[#14B8A6]/20",
    socialButtonsBlockButtonText: "text-[1.18rem] font-semibold tracking-[-0.015em] !text-[#F8FAF8]",
    socialButtonsProviderIcon: "mr-2 shrink-0",
    dividerLine: "bg-white/[0.08]",
    dividerText: "text-[11px] font-semibold uppercase tracking-[0.18em] text-[#94A3B8]",
    formFieldLabel:
      "mb-2 text-[0.8rem] font-semibold uppercase tracking-[0.12em] text-[#F8FAF8]",
    formFieldInput:
      "h-16 rounded-[1.6rem] border border-white/[0.1] bg-[linear-gradient(180deg,rgba(255,255,255,0.045),rgba(255,255,255,0.025))] px-5 text-[1rem] text-[#F8FAF8] placeholder:text-[#94A3B8] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] transition-all duration-300 focus:border-[#14B8A6]/32 focus:ring-2 focus:ring-[#14B8A6]/14",
    formFieldInputShowPasswordButton:
      "text-[#94A3B8] hover:text-[#F8FAF8]",
    formFieldErrorText: "text-xs text-red-300",
    formButtonPrimary:
      "h-16 rounded-[1.6rem] border border-[#8FE3CF]/18 bg-[linear-gradient(180deg,#42ddd0_0%,#1cc7b7_48%,#14B8A6_100%)] text-[1.02rem] font-semibold text-[#F8FAF8] shadow-[0_14px_32px_rgba(20,184,166,0.16),inset_0_1px_0_rgba(255,255,255,0.18)] transition-[filter,box-shadow] duration-200 hover:brightness-[1.03] focus-visible:ring-2 focus-visible:ring-[#8FE3CF]/22",
    footer:
      "px-5 pb-4 pt-3 sm:px-6 sm:pb-5",
    footerActionText: "text-sm text-[#94A3B8]",
    footerActionLink:
      "font-medium text-[#14B8A6] transition-colors hover:text-[#8FE3CF]",
    identityPreviewText: "text-[#F8FAF8]",
    identityPreviewEditButton:
      "text-[#F8FAF8] hover:text-[#F8FAF8]",
    formResendCodeLink: "text-[#F8FAF8] hover:text-[#F8FAF8]",
    otpCodeFieldInput:
      "h-12 w-12 rounded-2xl border border-white/[0.08] bg-white/[0.03] text-[#F8FAF8] focus:border-[#14B8A6]/28 focus:ring-2 focus:ring-[#14B8A6]/14",
    alert:
      "rounded-2xl border border-white/[0.08] bg-white/[0.03] text-[#F8FAF8]",
    alertText: "text-sm text-[#F8FAF8]",
    formHeaderTitle: "text-[#F8FAF8]",
    formHeaderSubtitle: "text-[#94A3B8]",
    navbar: "hidden",
    page: "w-full gap-0",
    main: "w-full max-w-none gap-4",
    form: "w-full gap-4",
    formFieldRow: "gap-3",
    footerAction: "mt-0",
    footerActionLinkButton:
      "font-medium text-[#F8FAF8] hover:text-[#F8FAF8]",
    formFieldSuccessText: "text-emerald-300",
    identityPreviewEditButtonIcon: "text-[#94A3B8]",
    modalBackdrop: "bg-[#0B1215]/80 backdrop-blur-sm",
    socialButtons: "w-full",
    formField: "w-full",
    formFieldLabelRow: "w-full items-center justify-between gap-3",
    formFieldInputGroup: "w-full",
    formButtonRow: "w-full",
    alternativeMethods: "w-full",
    socialButtonsBlockButtonArrow: "text-[#8FE3CF]",
    footerActionTextContainer: "w-full justify-center text-center",
    footerActionLinkButtonIcon: "text-[#8FE3CF]",
    formHeader: "w-full",
    socialButtonsBlockButton__google:
      "border-white/[0.12] bg-[linear-gradient(180deg,rgba(255,255,255,0.055),rgba(255,255,255,0.03))] hover:border-[#8FE3CF]/30 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_0_0_1px_rgba(20,184,166,0.08),0_18px_42px_rgba(20,184,166,0.14)]",
    formFieldHintText:
      "rounded-full border border-white/[0.06] bg-white/[0.02] px-3 py-1 text-[0.78rem] font-medium text-[#94A3B8]"
  }
};

export const clerkProviderConfig = {
  ...clerkRouting,
  appearance: clerkAppearance
} as const;

export const clerkAuthComponentProps = {
  appearance: clerkAppearance,
  localization: {
    signIn: {
      start: {
        title: "Sign in to Rovara"
      }
    }
  },
  routing: "path" as const,
  path: clerkRouting.signInUrl,
  signUpUrl: clerkRouting.signUpUrl,
  fallbackRedirectUrl: clerkRouting.signInFallbackRedirectUrl,
  signUpFallbackRedirectUrl: clerkRouting.signUpFallbackRedirectUrl,
  oauthFlow: "auto" as const
};

export const clerkSignUpComponentProps = {
  appearance: clerkAppearance,
  localization: {
    signUp: {
      start: {
        title: "Create your Rovara account"
      }
    }
  },
  routing: "path" as const,
  path: clerkRouting.signUpUrl,
  signInUrl: clerkRouting.signInUrl,
  fallbackRedirectUrl: clerkRouting.signUpFallbackRedirectUrl,
  signInFallbackRedirectUrl: clerkRouting.signInFallbackRedirectUrl,
  oauthFlow: "auto" as const
};

export const clerkUserButtonAppearance = {
  elements: {
    avatarBox: "h-10 w-10 rounded-2xl ring-0",
    userButtonBox: "flex-row-reverse gap-3",
    userButtonTrigger:
      "rounded-2xl border border-white/[0.08] bg-white/[0.04] px-2.5 py-1.5 !text-[#F8FAF8] shadow-none transition hover:bg-white/[0.07] focus:shadow-none light:border-[#1F4E5F]/10 light:bg-white/80 light:!text-[#1F4E5F]",
    userPreviewTextContainer: "hidden sm:flex sm:flex-col sm:items-start",
    userPreviewMainIdentifier:
      "max-w-[10rem] truncate text-sm font-medium !text-[#F8FAF8] light:!text-[#1F4E5F]",
    userPreviewSecondaryIdentifier:
      "max-w-[10rem] truncate text-xs !text-[#94A3B8] light:!text-[#1F4E5F]/52",
    userButtonPopoverCard:
      "rounded-[1.5rem] border border-white/[0.08] bg-[#10191d]/98 !text-[#F8FAF8] shadow-[0_24px_80px_rgba(3,20,19,0.42)] backdrop-blur-xl light:border-[#1F4E5F]/10 light:bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(244,237,225,0.92))] light:!text-[#1F4E5F]",
    userButtonPopoverActions: "p-2",
    userButtonPopoverActionButton:
      "rounded-xl text-sm !text-[#F8FAF8] hover:bg-white/[0.07] focus:bg-white/[0.07] light:!text-[#1F4E5F] light:hover:bg-[#1F4E5F]/[0.06]",
    userButtonPopoverActionButtonText: "!text-[#F8FAF8] light:!text-[#1F4E5F]",
    userButtonPopoverActionButtonIcon: "!text-[#8FE3CF] light:!text-[#1F4E5F]",
    userButtonPopoverActionButton__menuItem:
      "rounded-xl !text-[#F8FAF8] hover:bg-white/[0.07] focus:bg-white/[0.07]",
    userButtonPopoverActionButtonText__menuItem: "!text-[#F8FAF8]",
    userButtonPopoverActionButtonIcon__menuItem: "!text-[#8FE3CF]",
    userButtonPopoverFooter: "hidden",
    userPreviewMainIdentifierText: "!text-[#F8FAF8] light:!text-[#1F4E5F]",
    userButtonPopoverActionButton__manageAccount:
      "rounded-xl !text-[#F8FAF8] hover:bg-white/[0.07] focus:bg-white/[0.07]",
    userButtonPopoverActionButton__signOut:
      "rounded-xl !text-[#F8FAF8] hover:bg-white/[0.07] focus:bg-white/[0.07]"
  }
};

type MenuLinkConfig = {
  label: string;
  href: string;
  icon: ReactElement;
};

export const authUserMenuLinks: MenuLinkConfig[] = [
  { label: "Generate", href: ROUTES.GENERATE, icon: <Sparkles size={16} /> },
  { label: "Trips", href: ROUTES.TRIPS, icon: <Bookmark size={16} /> },
  { label: "Profile", href: ROUTES.PROFILE, icon: <UserRound size={16} /> },
];
