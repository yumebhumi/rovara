import type { SessionUser } from "@/lib/auth";
import { NavbarClient } from "./navbar-client";

type WorkspaceShellProps = {
  children: React.ReactNode;
  user: SessionUser;
  clerkEnabled: boolean;
};

export function WorkspaceShell({ children, user, clerkEnabled }: WorkspaceShellProps) {
  return (
    <div className="relative min-h-screen overflow-x-clip bg-[#0B1215]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_16%,rgba(20,184,166,0.12),transparent_24%),radial-gradient(circle_at_84%_10%,rgba(143,227,207,0.05),transparent_16%),linear-gradient(180deg,#0B1215_0%,#0E1519_100%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.05] [background-image:linear-gradient(rgba(248,250,248,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(248,250,248,0.08)_1px,transparent_1px)] [background-size:56px_56px]"
      />

      <div className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col px-3 pb-14 pt-3 sm:px-6 sm:pb-16 sm:pt-4 lg:px-8">
        <NavbarClient user={user} clerkEnabled={clerkEnabled} wrapperClassName="top-4 z-40" />

        <main className="min-w-0 flex-1 pt-9 sm:pt-12">{children}</main>
      </div>
    </div>
  );
}
