"use client";

import { ButtonHTMLAttributes, forwardRef } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "fab";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "w-full bg-wine text-beige rounded-card py-[15px] font-medium active:bg-wine-light",
  secondary:
    "w-full bg-white/70 border border-beige-dark text-ink rounded-card py-[15px] font-medium",
  ghost: "text-wine font-medium",
  fab: "flex items-center justify-center w-[52px] h-[52px] rounded-full bg-wine text-beige shadow-[0_2px_8px_rgba(123,45,45,0.35)] active:bg-wine-light",
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", className = "", disabled, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled}
        className={`min-h-[44px] text-[15px] transition-colors disabled:opacity-40 disabled:pointer-events-none ${variantStyles[variant]} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
