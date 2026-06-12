import { SignIn } from "@clerk/nextjs";
import { AuthShell } from "@/components/auth";
import { clerkAuthComponentProps } from "@/lib/auth";

export default function SignInPage() {
  const clerkEnabled = Boolean(
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && process.env.CLERK_SECRET_KEY
  );

  if (!clerkEnabled) {
    return (
      <AuthShell
        mode="sign-in"
        title="Welcome back to Rovara."
        description="Clerk authentication is not configured in this environment yet."
      >
        <div className="rounded-[1.7rem] border border-[#F4EDE1]/12 bg-white/6 p-8 text-center text-sm leading-7 text-[#F4EDE1]/70">
          Add your Clerk environment keys to enable sign-in, sign-up, social auth, and protected workspace access.
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      mode="sign-in"
      title="Welcome back to Rovara."
      description="Sign in to continue planning, sync your saved itineraries, and re-enter your travel cockpit."
    >
      <SignIn {...clerkAuthComponentProps} />
    </AuthShell>
  );
}
