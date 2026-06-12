"use client";

import { ArrowRight } from "lucide-react";
import { LoadingSpinner } from "@/components/shared/loading-spinner";
import { Button } from "@/components/ui/button";

type SubmitButtonProps = {
  disabled?: boolean;
  loading?: boolean;
};

export function SubmitButton({
  disabled = false,
  loading = false
}: SubmitButtonProps) {
  return (
    <Button
      type="submit"
      size="lg"
      disabled={disabled}
      aria-label={loading ? "Generating itinerary" : "Create my journey"}
      aria-busy={loading}
      className="h-11 rounded-full border border-[#14B8A6]/24 bg-[linear-gradient(180deg,#23cab9_0%,#14B8A6_100%)] px-5 text-[0.95rem] font-semibold tracking-[-0.01em] text-[#041311] shadow-[0_10px_24px_rgba(20,184,166,0.14),inset_0_1px_0_rgba(255,255,255,0.16)] hover:bg-[linear-gradient(180deg,#2ad2c0_0%,#17c3b0_100%)] hover:shadow-[0_14px_32px_rgba(20,184,166,0.18),0_0_0_1px_rgba(143,227,207,0.12)]"
    >
      {loading ? (
        <>
          <LoadingSpinner className="h-4 w-4 border-black/20 border-t-[#041311]" />
          Generating...
        </>
      ) : (
        <>
          Create My Journey
          <ArrowRight size={16} aria-hidden="true" />
        </>
      )}
    </Button>
  );
}
