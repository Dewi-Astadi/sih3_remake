import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Page container: max 1200px with the 8px spacing scale gutters used across
 * the public shell and homepage.
 */
export function Container({
  className,
  children,
  as: Tag = "div",
}: {
  className?: string;
  children: React.ReactNode;
  as?: "div" | "section" | "header" | "footer";
}) {
  return (
    <Tag className={cn("mx-auto w-full max-w-site px-4 sm:px-6", className)}>
      {children}
    </Tag>
  );
}
