import { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export default function Card({ children, className = "", ...props }: CardProps) {
  return (
    <div
      className={`rounded-[18px] bg-white p-[18px] shadow-[0_1px_3px_rgba(30,18,8,0.06),0_4px_12px_rgba(30,18,8,0.04)] ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
