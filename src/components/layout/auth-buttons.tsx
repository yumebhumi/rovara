"use client";

import Link from "next/link";
import { SignInButton } from "@clerk/nextjs";
import { ROUTES } from "@/constants/routes";
import { clerkRouting } from "@/lib/auth";
import { cn } from "@/utils/cn";

type AuthButtonsProps = {
  clerkEnabled: boolean;
  mobile?: boolean;
  onNavigate?: () => void;
};

export function AuthButtons({ clerkEnabled, mobile = false, onNavigate }: AuthButtonsProps) {
  const className = cn(
    "inline-flex items-center justify-center rounded-full border text-sm font-semibold tracking-[-0.01em]",
    "transition-[transform,box-shadow,background-color,border-color] duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8FE3CF]/30",
    "hover:-translate-y-px",
    mobile
      ? "min-h-12 w-full px-4"
      : "h-11 px-5",
    "border-[#14B8A6]/26 bg-[#14B8A6] text-[#041311] shadow-[0_10px_26px_rgba(20,184,166,0.18),inset_0_1px_0_rgba(255,255,255,0.18)]",
    "hover:bg-[#1ac7b4] hover:shadow-[0_16px_34px_rgba(20,184,166,0.22),0_0_0_1px_rgba(143,227,207,0.14)]"
  );

  if (!clerkEnabled) {
    return (
      <Link href={ROUTES.SIGN_IN} onClick={onNavigate} className={className}>
        Start Planning
      </Link>
    );
  }

  return (
    <SignInButton
      mode="modal"
      withSignUp
      fallbackRedirectUrl={clerkRouting.signInFallbackRedirectUrl}
      forceRedirectUrl={clerkRouting.signInFallbackRedirectUrl}
      signUpFallbackRedirectUrl={clerkRouting.signUpFallbackRedirectUrl}
      signUpForceRedirectUrl={clerkRouting.signUpFallbackRedirectUrl}
      oauthFlow="auto"
    >
      <button type="button" onClick={onNavigate} className={className}>
        Start Planning
      </button>
    </SignInButton>
  );
}
