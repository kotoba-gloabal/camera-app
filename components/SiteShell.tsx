import type { ReactNode } from "react";
import { Header } from "@/components/Header";

type SiteShellProps = {
  children: ReactNode;
};

export function SiteShell({ children }: SiteShellProps) {
  return (
    <div className="min-h-screen">
      <Header />
      {children}
    </div>
  );
}
