import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Used Camera B2B Catalog",
  description: "B2B used camera catalog",
};

import { LanguageProvider } from "@/components/LanguageProvider";
import { SiteShell } from "@/components/SiteShell";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <LanguageProvider>
          <SiteShell>{children}</SiteShell>
        </LanguageProvider>
      </body>
    </html>
  );
}
