interface SipLogoProps {
  showText?: boolean;
  size?: number;
}

export default function SipLogo({ showText = true, size = 32 }: SipLogoProps) {
  return (
    <div className="flex items-center gap-2.5">
      <svg
        width={size}
        height={size}
        viewBox="0 0 36 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M18 4C18 4 8 15 8 23C8 28.5228 12.4772 33 18 33C23.5228 33 28 28.5228 28 23C28 15 18 4"
          stroke="#7B2D2D"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path
          d="M14 26C14 26 16 28 18 28C20 28 22 26 22 26"
          stroke="#7B2D2D"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path
          d="M14 22V20M22 22V20"
          stroke="#7B2D2D"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>
      {showText && (
        <span className="text-[24px] font-semibold tracking-[0.04em] text-wine">
          sip
        </span>
      )}
    </div>
  );
}
