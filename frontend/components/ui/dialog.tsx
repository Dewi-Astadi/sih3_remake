"use client";

import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface DialogContextType {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const DialogContext = React.createContext<DialogContextType | undefined>(
  undefined
);

function useDialog() {
  const context = React.useContext(DialogContext);
  if (!context) {
    throw new Error("Dialog components must be used within a <Dialog />");
  }
  return context;
}

export interface DialogProps {
  children?: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function Dialog({
  children,
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
}: DialogProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : uncontrolledOpen;

  const setOpen = React.useCallback(
    (newOpen: boolean) => {
      if (!isControlled) {
        setUncontrolledOpen(newOpen);
      }
      onOpenChange?.(newOpen);
    },
    [isControlled, onOpenChange]
  );

  return (
    <DialogContext.Provider value={{ open, setOpen }}>
      {children}
    </DialogContext.Provider>
  );
}

export interface DialogTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

export const DialogTrigger = React.forwardRef<
  HTMLButtonElement,
  DialogTriggerProps
>(({ className, asChild = false, onClick, children, ...props }, ref) => {
  const { setOpen } = useDialog();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(e);
    if (!e.defaultPrevented) {
      setOpen(true);
    }
  };

  if (asChild && React.isValidElement(children)) {
    const child = children as React.ReactElement<{
      onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
      className?: string;
    }>;
    return React.cloneElement(child, {
      onClick: (e: React.MouseEvent<HTMLButtonElement>) => {
        child.props.onClick?.(e);
        handleClick(e);
      },
      className: cn(child.props.className, className),
    });
  }

  return (
    <button
      type="button"
      ref={ref}
      onClick={handleClick}
      className={className}
      {...props}
    >
      {children}
    </button>
  );
});
DialogTrigger.displayName = "DialogTrigger";

export const DialogClose = React.forwardRef<
  HTMLButtonElement,
  DialogTriggerProps
>(({ className, asChild = false, onClick, children, ...props }, ref) => {
  const { setOpen } = useDialog();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(e);
    if (!e.defaultPrevented) {
      setOpen(false);
    }
  };

  if (asChild && React.isValidElement(children)) {
    const child = children as React.ReactElement<{
      onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
      className?: string;
    }>;
    return React.cloneElement(child, {
      onClick: (e: React.MouseEvent<HTMLButtonElement>) => {
        child.props.onClick?.(e);
        handleClick(e);
      },
      className: cn(child.props.className, className),
    });
  }

  return (
    <button
      type="button"
      ref={ref}
      onClick={handleClick}
      className={className}
      {...props}
    >
      {children}
    </button>
  );
});
DialogClose.displayName = "DialogClose";

export interface DialogContentProps
  extends React.HTMLAttributes<HTMLDivElement> {
  onClose?: () => void;
}

export const DialogContent = React.forwardRef<
  HTMLDivElement,
  DialogContentProps
>(({ className, children, onClose, ...props }, ref) => {
  const { open, setOpen } = useDialog();

  React.useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        onClose?.();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [open, setOpen, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-150"
        onClick={() => {
          setOpen(false);
          onClose?.();
        }}
        aria-hidden="true"
      />

      {/* Modal Dialog Body */}
      <div
        ref={ref}
        className={cn(
          "relative z-50 w-full max-w-lg rounded-xl border border-slate-200 bg-white p-6 shadow-2xl transition-all duration-200 animate-in fade-in zoom-in-95 dark:border-slate-800 dark:bg-slate-900",
          className
        )}
        {...props}
      >
        <button
          type="button"
          onClick={() => {
            setOpen(false);
            onClose?.();
          }}
          className="absolute right-4 top-4 rounded-sm p-1 text-slate-400 opacity-70 transition-opacity hover:opacity-100 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-400 dark:hover:text-slate-200 dark:focus:ring-slate-700"
          aria-label="Tutup"
        >
          <X className="h-4 w-4" />
        </button>
        {children}
      </div>
    </div>
  );
});
DialogContent.displayName = "DialogContent";

export function DialogHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex flex-col space-y-1.5 text-left mb-4", className)}
      {...props}
    />
  );
}

export function DialogFooter({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 pt-4 border-t border-slate-100 dark:border-slate-800 mt-4",
        className
      )}
      {...props}
    />
  );
}

export function DialogTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2
      className={cn(
        "text-lg font-semibold leading-none tracking-tight text-slate-900 dark:text-slate-100",
        className
      )}
      {...props}
    />
  );
}

export function DialogDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn("text-sm text-slate-500 dark:text-slate-400 mt-1", className)}
      {...props}
    />
  );
}
