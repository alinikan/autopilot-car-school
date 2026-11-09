export function Logo() {
  return (
    <div className="logo">
      <span>
        <svg viewBox="0 0 30 30">
          <path
            d="m7 23 8-17 8 17M11 16h8"
            fill="none"
            stroke="currentColor"
            strokeWidth="3.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      autopilot<span className="logo-dot">.</span>
    </div>
  );
}
