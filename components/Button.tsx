import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-[#2563EB] text-white hover:bg-blue-700 shadow-sm border border-transparent",
  secondary:
    "bg-[#0F172A] text-white hover:bg-slate-800 shadow-sm border border-transparent",
  outline:
    "bg-white text-[#111827] border border-gray-200 hover:bg-gray-50 shadow-sm",
  ghost: "bg-transparent text-[#111827] hover:bg-gray-100 border border-transparent",
};

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  children: ReactNode;
};

export function Button({ variant = "primary", className = "", children, ...props }: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-lg px-4 py-2.5 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50 ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

type ButtonLinkProps = {
  href: string;
  variant?: ButtonVariant;
  className?: string;
  children: ReactNode;
};

export function ButtonLink({
  href,
  variant = "primary",
  className = "",
  children,
}: ButtonLinkProps) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center justify-center rounded-lg px-4 py-2.5 text-sm font-medium transition ${variantClasses[variant]} ${className}`}
    >
      {children}
    </Link>
  );
}
