"use client";

import { TextareaHTMLAttributes, forwardRef } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className = "", ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label className="text-[13px] font-medium text-ink-soft">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          className={`rounded-input border-[1.5px] border-beige-dark bg-white/60 px-[14px] py-[13px] text-[15px] font-light text-ink placeholder:text-ink-muted focus:border-wine-light focus:ring-[3px] focus:ring-wine/8 focus:outline-none resize-none ${error ? "border-red-400" : ""} ${className}`}
          rows={4}
          {...props}
        />
        {error && (
          <p className="text-[12px] text-red-500">{error}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

export default Textarea;
