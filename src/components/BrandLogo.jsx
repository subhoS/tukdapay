import React from 'react'

/**
 * SplitPe Official Vector Brand Logo
 * Features two interlocking geometric ribbons split diagonally, forming an 'S' / Rupee motif.
 */
export function BrandLogoMark({ className = 'h-8 w-8', glowing = true }) {
  return (
    <div className={`relative flex items-center justify-center shrink-0 ${glowing ? 'drop-shadow-[0_0_12px_rgba(16,185,129,0.35)]' : ''}`}>
      <svg
        className={className}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="splitpe-grad-a" x1="4" y1="4" x2="32" y2="32" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#34d399" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>
          <linearGradient id="splitpe-grad-b" x1="16" y1="16" x2="44" y2="44" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#22d3ee" />
            <stop offset="100%" stopColor="#0d9488" />
          </linearGradient>
          <linearGradient id="splitpe-accent" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Outer squircle container */}
        <rect width="48" height="48" rx="14" fill="#0f172a" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />

        {/* Upper Ribbon: Left curved wing of the 'S' and upper split Rupee bar */}
        <path
          d="M12 15C12 12.7909 13.7909 11 16 11H34C35.1046 11 36 11.8954 36 13C36 14.1046 35.1046 15 34 15H24L29.5 21H18C14.6863 21 12 18.3137 12 15Z"
          fill="url(#splitpe-grad-a)"
        />

        {/* Lower Ribbon: Right curved wing of the 'S' and lower split Rupee diagonal */}
        <path
          d="M36 33C36 35.2091 34.2091 37 32 37H14C12.8954 37 12 36.1046 12 35C12 33.8954 12.8954 33 14 33H24L18.5 27H30C33.3137 27 36 29.6863 36 33Z"
          fill="url(#splitpe-grad-b)"
        />

        {/* Central diagonal split slash */}
        <path
          d="M31 15L17 33"
          stroke="#0f172a"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        <path
          d="M31 15L17 33"
          stroke="#ffffff"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeOpacity="0.9"
        />

        {/* Gloss highlight */}
        <rect width="48" height="48" rx="14" stroke="url(#splitpe-accent)" strokeWidth="1.5" />
      </svg>
    </div>
  )
}

/**
 * Full Brand Lockup with Logo + Typography
 */
export function BrandLogoFull({ className = '', subtitle = 'Smart UPI Splitter' }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <BrandLogoMark className="h-8 w-8 sm:h-9 sm:w-9" />
      <div className="flex flex-col text-left">
        <div className="flex items-center gap-1.5 leading-none">
          <span className="text-base sm:text-lg font-black tracking-tight text-white font-sans">
            Split<span className="text-emerald-400">Pe</span>
          </span>
          <span className="rounded-md bg-emerald-500/15 border border-emerald-500/30 px-1.5 py-0.5 text-[9px] font-extrabold text-emerald-300 uppercase tracking-wide">
            2K
          </span>
        </div>
        {subtitle && (
          <span className="text-[10px] text-gray-400 font-medium tracking-tight mt-0.5">
            {subtitle}
          </span>
        )}
      </div>
    </div>
  )
}
