import React from 'react'

/**
 * TukdaPay Official Vector Brand Logo
 * Paytm-inspired palette: Deep Navy (#002970) + Electric Cyan (#00BAF2)
 * Features dual interlocking split payment tokens forming a 'T' and Rupee ₹ division motif.
 */
export function BrandLogoMark({ className = 'h-8 w-8', glowing = true }) {
  return (
    <div className={`relative flex items-center justify-center shrink-0 ${glowing ? 'drop-shadow-[0_2px_8px_rgba(0,186,242,0.25)]' : ''}`}>
      <svg
        className={className}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="tukda-navy" x1="4" y1="4" x2="36" y2="36" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#003893" />
            <stop offset="100%" stopColor="#002970" />
          </linearGradient>
          <linearGradient id="tukda-cyan" x1="16" y1="16" x2="44" y2="44" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#00BAF2" />
            <stop offset="100%" stopColor="#0096C7" />
          </linearGradient>
          <linearGradient id="tukda-border" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#E2E8F0" />
            <stop offset="100%" stopColor="#CBD5E1" />
          </linearGradient>
        </defs>

        {/* Squircle base */}
        <rect width="48" height="48" rx="14" fill="#FFFFFF" stroke="url(#tukda-border)" strokeWidth="1.5" />

        {/* Upper Token (Navy Blue) - Horizontal bar and top half */}
        <path
          d="M12 14C12 12.3431 13.3431 11 15 11H33C34.6569 11 36 12.3431 36 14C36 15.6569 34.6569 17 33 17H27V22H18C14.6863 22 12 19.3137 12 16V14Z"
          fill="url(#tukda-navy)"
        />

        {/* Lower Token (Paytm Cyan) - Bottom split chunk */}
        <path
          d="M36 34C36 35.6569 34.6569 37 33 37H15C13.3431 37 12 35.6569 12 34C12 32.3431 13.3431 31 15 31H21V26H30C33.3137 26 36 28.6863 36 32V34Z"
          fill="url(#tukda-cyan)"
        />

        {/* Crisp split separation channel */}
        <path
          d="M32 16L16 32"
          stroke="#FFFFFF"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        <path
          d="M32 16L16 32"
          stroke="#00BAF2"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    </div>
  )
}

/**
 * Full Brand Lockup with Logo + Typography
 */
export function BrandLogoFull({ className = '', subtitle = 'Zero-Fee UPI Splitter' }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <BrandLogoMark className="h-8 w-8 sm:h-9 sm:w-9" />
      <div className="flex flex-col text-left">
        <div className="flex items-center gap-1.5 leading-none">
          <span className="text-base sm:text-lg font-black tracking-tight font-sans text-[#002970]">
            Tukda<span className="text-[#00BAF2]">Pay</span>
          </span>
          <span className="rounded-md bg-[#E8F7FE] border border-[#00BAF2]/30 px-1.5 py-0.5 text-[9px] font-extrabold text-[#00BAF2] uppercase tracking-wide">
            UPI
          </span>
        </div>
        {subtitle && (
          <span className="text-[10px] text-slate-500 font-medium tracking-tight mt-0.5">
            {subtitle}
          </span>
        )}
      </div>
    </div>
  )
}
