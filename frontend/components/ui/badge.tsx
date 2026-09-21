import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?:
    | "default"
    | "navy"
    | "amber"
    | "success"
    | "emerald"
    | "outline"
    | "secondary"
    | "destructive";
}

export function badgeVariants({
  variant = "default",
  className,
}: {
  variant?: BadgeProps["variant"];
  className?: string;
} = {}): string {
  const base =
    "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2";

  const variants: Record<NonNullable<BadgeProps["variant"]>, string> = {
    default:
      "border-transparent bg-[#0f172a] text-white hover:bg-[#1e293b]",
    navy:
      "border-transparent bg-[#0f172a] text-white hover:bg-[#1e293b]",
    amber:
      "border-amber-300 bg-amber-50 text-amber-900 font-medium dark:border-amber-700 dark:bg-amber-950/40 dark:text-amber-200",
    success:
      "border-emerald-300 bg-emerald-50 text-emerald-800 font-medium dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300",
    emerald:
      "border-emerald-300 bg-emerald-50 text-emerald-800 font-medium dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300",
    secondary:
      "border-transparent bg-slate-100 text-slate-900 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-100",
    destructive:
      "border-rose-300 bg-rose-50 text-rose-800 font-medium dark:border-rose-800 dark:bg-rose-950/40 dark:text-rose-300",
    outline:
      "border-slate-300 text-slate-800 dark:border-slate-700 dark:text-slate-200",
  };

  return cn(base, variants[variant] || variants.default, className);
}

export function Badge({
  className,
  variant = "default",
  ...props
}: BadgeProps) {
  return (
    <div className={badgeVariants({ variant, className })} {...props} />
  );
}
