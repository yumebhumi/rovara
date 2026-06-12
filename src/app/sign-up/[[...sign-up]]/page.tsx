import { SignUp } from "@clerk/nextjs";
import { AuthShell } from "@/components/auth";
import { clerkSignUpComponentProps } from "@/lib/auth";

export default function SignUpPage() {
  const clerkEnabled = Boolean(
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && process.env.CLERK_SECRET_KEY
  );

  if (!clerkEnabled) {
    return (
      <AuthShell
        mode="sign-up"
        title="Create your Rovara workspace."
        description="Clerk authentication is not configured in this environment yet."
      >
        <div className="rounded-[1.7rem] border border-[#F4EDE1]/12 bg-white/6 p-8 text-center text-sm leading-7 text-[#F4EDE1]/70">
          Add your Clerk environment keys to enable account creation, session handling, and protected routes.
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      mode="sign-up"
      title="Create your Rovara workspace."
      description="Set up your account to unlock AI-generated itineraries, social sign-in, and a premium travel planning dashboard."
    >
      <SignUp {...clerkSignUpComponentProps} />
    </AuthShell>
  );
}
