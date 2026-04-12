"use client";

type TagVariant = "default" | "selected" | "category";

interface TagProps {
  children: React.ReactNode;
  variant?: TagVariant;
  onClick?: () => void;
}

const variantStyles: Record<TagVariant, string> = {
  default: "bg-beige-mid text-ink-soft",
  selected: "bg-wine text-beige border-wine",
  category: "bg-wine-pale text-wine",
};

export default function Tag({
  children,
  variant = "default",
  onClick,
}: TagProps) {
  const Component = onClick ? "button" : "span";

  return (
    <Component
      onClick={onClick}
      className={`inline-flex items-center rounded-pill px-[10px] py-[4px] text-[12px] font-medium tracking-[0.06em] ${variantStyles[variant]} ${onClick ? "cursor-pointer transition-colors" : ""}`}
    >
      {children}
    </Component>
  );
}
