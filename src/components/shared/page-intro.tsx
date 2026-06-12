import type { ReactNode } from "react";

type PageIntroProps = {
  eyebrow?: string;
  title: string;
  description: string;
  actions?: ReactNode;
};

export function PageIntro({ eyebrow, title, description, actions }: PageIntroProps) {
  return (
    <div className="flex min-w-0 flex-col gap-8 pb-10 sm:pb-12 lg:flex-row lg:items-end lg:justify-between">
      <div className="min-w-0 max-w-3xl space-y-5">
        {eyebrow ? (
          <p className="rovara-eyebrow">
            {eyebrow}
          </p>
        ) : null}
        <div className="space-y-4">
          <h1 className="rovara-page-title max-w-4xl">
            {title}
          </h1>
          <p className="rovara-body max-w-2xl">
            {description}
          </p>
        </div>
      </div>
      {actions ? <div className="flex w-full flex-wrap items-center gap-3 sm:w-auto">{actions}</div> : null}
    </div>
  );
}
