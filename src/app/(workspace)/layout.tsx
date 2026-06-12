import type { ReactNode } from "react";
import { WorkspaceShell } from "@/components/layout";
import { requireSessionUser } from "@/lib/auth/server";

export default async function WorkspaceLayout({ children }: { children: ReactNode }) {
  const user = await requireSessionUser();
  const clerkEnabled = Boolean(
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && process.env.CLERK_SECRET_KEY
  );

  return (
    <WorkspaceShell user={user} clerkEnabled={clerkEnabled}>
      {children}
    </WorkspaceShell>
  );
}
