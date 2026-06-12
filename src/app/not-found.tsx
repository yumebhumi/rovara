import { AppErrorState } from "@/components/shared";
import { ROUTES } from "@/constants/routes";

export default function NotFound() {
  return (
    <AppErrorState
      eyebrow="Route not found"
      title="This page is not available."
      description="The link may be outdated, the trip may have been removed, or the page may not exist in Roava yet."
      primaryHref={ROUTES.HOME}
      primaryLabel="Back to Home"
      secondaryHref={ROUTES.GENERATE}
      secondaryLabel="Start Planning"
    />
  );
}
