"use client";

import * as React from "react";
import { Check, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  indeterminate?: boolean;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, indeterminate, checked, onChange, disabled, ...props }, ref) => {
    const inputRef = React.useRef<HTMLInputElement | null>(null);

    React.useEffect(() => {
      if (inputRef.current) {
        inputRef.current.indeterminate = !!indeterminate;
      }
    }, [indeterminate]);

    return (
      <label
        className={cn(
          "relative inline-flex items-center justify-center select-none",
          disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"
        )}
      >
        <input
          type="checkbox"
          ref={(node) => {
            inputRef.current = node;
            if (typeof ref === "function") {
              ref(node);
            } else if (ref) {
              (ref as React.MutableRefObject<HTMLInputElement | null>).current = node;
            }
          }}
          checked={checked}
          disabled={disabled}
          onChange={onChange}
          className="peer sr-only"
          {...props}
        />
        <div
          className={cn(
            "h-4 w-4 shrink-0 rounded border border-slate-300 bg-white transition-all duration-150 flex items-center justify-center",
            "peer-focus-visible:outline-none peer-focus-visible:ring-2 peer-focus-visible:ring-slate-900 peer-focus-visible:ring-offset-2",
            (checked || indeterminate)
              ? "bg-slate-900 border-slate-900 text-white dark:bg-slate-50 dark:border-slate-50 dark:text-slate-900"
              : "hover:border-slate-400 dark:border-slate-700 dark:bg-slate-950",
            className
          )}
        >
          {indeterminate ? (
            <Minus className="h-3 w-3 stroke-[3]" />
          ) : checked ? (
            <Check className="h-3 w-3 stroke-[3]" />
          ) : null}
        </div>
      </label>
    );
  }
);

Checkbox.displayName = "Checkbox";
