import { cn } from "@/utils/cn";

export function LoadingSpinner({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn("h-5 w-5 animate-spin rounded-full border-2 border-[#F4EDE1]/22 border-t-[#2F6F73]", className)}
    />
  );
}
