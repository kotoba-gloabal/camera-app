import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Used Camera B2B Catalog",
  description: "B2B used camera catalog",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="antialiased">{children}</body>
    </html>
  );
}
