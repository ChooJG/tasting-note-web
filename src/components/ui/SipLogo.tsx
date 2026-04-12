export default function SipLogo() {
  return (
    <div className="flex items-center gap-2.5">
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <path
          d="M16 3C16 3 7 12 7 19C7 23.97 11.03 28 16 28C20.97 28 25 23.97 25 19C25 12 16 3 16 3Z"
          fill="rgba(123,45,45,0.15)"
          stroke="#7B2D2D"
          strokeWidth="1.2"
        />
        <path
          d="M16 12C16 12 11 17.5 11 21C11 23.76 13.24 26 16 26"
          stroke="#7B2D2D"
          strokeWidth="1"
          strokeLinecap="round"
          opacity="0.5"
        />
      </svg>
      <span className="text-[24px] font-semibold tracking-[0.04em] text-wine">
        sip
      </span>
    </div>
  );
}
