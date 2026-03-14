import * as React from "react";
import { cn } from "../../lib/utils";

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, type = "text", ...props }, ref) => {
  return (
    <input
      ref={ref}
      type={type}
      className={cn(
        "form-input w-full rounded-xl border border-[rgba(33,42,59,0.12)] bg-white px-4 py-3 text-base shadow-sm focus:border-[var(--color-brand)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)]",
        className,
      )}
      {...props}
    />
  );
});

Input.displayName = "Input";
