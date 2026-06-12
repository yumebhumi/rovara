import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import { Providers } from "@/providers";
import { siteConfig } from "@/config/site";
import { clerkProviderConfig } from "@/lib/auth";

export const metadata: Metadata = {
  title: siteConfig.name,
  description: siteConfig.description,
  metadataBase: new URL(siteConfig.url),
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    images: [{ url: siteConfig.ogImage }]
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const clerkEnabled = Boolean(
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && process.env.CLERK_SECRET_KEY
  );

  const app = (
    <Providers>
      {children}
    </Providers>
  );

  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        {clerkEnabled ? (
          <ClerkProvider {...clerkProviderConfig}>{app}</ClerkProvider>
        ) : app}
      </body>
    </html>
  );
}
