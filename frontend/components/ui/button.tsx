import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonVariantsArgs {
  variant?:
    | "default"
    | "navy"
    | "amber"
    | "outline"
    | "ghost"
    | "secondary"
    | "destructive";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
}

export function buttonVariants({
  variant = "default",
  size = "default",
  className,
}: ButtonVariantsArgs = {}): string {
  const base =
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 cursor-pointer select-none";

  const variants: Record<NonNullable<ButtonVariantsArgs["variant"]>, string> = {
    default:
      "bg-slate-900 text-white hover:bg-slate-800 shadow-sm dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200",
    navy:
      "bg-[#0f172a] text-white hover:bg-[#1e293b] shadow-sm dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200",
    amber:
      "bg-[#f59e0b] text-slate-950 font-semibold hover:bg-[#d97706] shadow-sm active:bg-amber-600",
    outline:
      "border border-input bg-background hover:bg-accent hover:text-accent-foreground shadow-sm",
    ghost: "hover:bg-accent hover:text-accent-foreground",
    secondary:
      "bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-sm",
    destructive:
      "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm",
  };

  const sizes: Record<NonNullable<ButtonVariantsArgs["size"]>, string> = {
    default: "h-9 px-4 py-2",
    sm: "h-8 rounded-md px-3 text-xs",
    lg: "h-10 rounded-md px-6 text-base",
    icon: "h-9 w-9 p-0",
  };

  return cn(
    base,
    variants[variant] || variants.default,
    sizes[size] || sizes.default,
    className
  );
}

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    ButtonVariantsArgs {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "default",
      size = "default",
      asChild = false,
      children,
      ...props
    },
    ref
  ) => {
    if (asChild && React.isValidElement(children)) {
      const child = children as React.ReactElement<{ className?: string }>;
      return React.cloneElement(child, {
        className: cn(
          buttonVariants({ variant, size, className: child.props.className }),
          className
        ),
        ...props,
      });
    }

    return (
      <button
        ref={ref}
        className={buttonVariants({ variant, size, className })}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
