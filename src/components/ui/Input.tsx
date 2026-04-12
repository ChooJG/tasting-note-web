"use client";

import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = "", ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label className="text-[12px] font-medium uppercase tracking-[0.06em] text-ink-soft">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`rounded-input border-[1.5px] border-beige-dark bg-white/60 px-[14px] py-[13px] text-[15px] font-light text-ink placeholder:text-ink-muted focus:border-wine-light focus:ring-[3px] focus:ring-wine/8 focus:outline-none ${error ? "border-red-400" : ""} ${className}`}
          {...props}
        />
        {error && (
          <p className="text-[12px] text-red-500">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
