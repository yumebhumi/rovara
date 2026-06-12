"use client";

import { useEffect } from "react";
import { AppErrorState } from "@/components/shared";
import { ROUTES } from "@/constants/routes";

type GlobalErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

function getFriendlyErrorCopy(error: Error) {
  const message = error.message.toLowerCase();

  if (message.includes("unauthorized") || message.includes("auth") || message.includes("sign in")) {
    return {
      title: "Sign in is required.",
      description:
        "This area belongs to your private Roava account. Sign in again, then return to your saved trips or planner."
    };
  }

  if (message.includes("not found") || message.includes("invalid trip")) {
    return {
      title: "This trip could not be found.",
      description:
        "The trip link may be incomplete, deleted, or unavailable to your account."
    };
  }

  if (
    message.includes("openai") ||
    message.includes("ai") ||
    message.includes("model") ||
    message.includes("rate limit")
  ) {
    return {
      title: "Trip generation paused.",
      description:
        "The AI planning service could not complete the request. Try again in a moment or adjust the trip brief."
    };
  }

  if (
    message.includes("prisma") ||
    message.includes("database") ||
    message.includes("connection") ||
    message.includes("postgres")
  ) {
    return {
      title: "Saved trips are temporarily unavailable.",
      description:
        "Roava could not reach the trip database. Your screen is safe to retry once the connection is back."
    };
  }

  if (message.includes("fetch") || message.includes("network") || message.includes("timeout")) {
    return {
      title: "The request did not complete.",
      description:
        "Check your connection and retry. If the issue continues, return to your trips and reopen the journey."
    };
  }

  return {
    title: "Roava could not load this screen.",
    description:
      "Something interrupted the page before it could finish loading. Retry the request or return to a stable route."
  };
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    console.error("Roava route error", {
      message: error.message,
      digest: error.digest
    });
  }, [error]);

  const copy = getFriendlyErrorCopy(error);

  return (
    <AppErrorState
      title={copy.title}
      description={copy.description}
      onRetry={reset}
      primaryHref={ROUTES.TRIPS}
      primaryLabel="Back to Trips"
      secondaryHref={ROUTES.GENERATE}
      secondaryLabel="Start Planning"
    />
  );
}
