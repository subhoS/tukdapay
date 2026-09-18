import React from 'react'

/**
 * Clean, lightweight vector SVG badges for Indian UPI apps
 */

export function GPayIcon({ className = 'h-4 w-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path
        d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z"
        fill="#4285F4"
      />
      <path
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.28v3.09C3.26 21.3 7.36 24 12 24z"
        fill="#34A853"
      />
      <path
        d="M5.27 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62H1.28C.46 8.24 0 10.06 0 12s.46 3.76 1.28 5.38l3.99-3.09z"
        fill="#FBBC05"
      />
      <path
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.36 0 3.26 2.7 1.28 6.62l3.99 3.09c.95-2.85 3.6-4.96 6.73-4.96z"
        fill="#EA4335"
      />
    </svg>
  )
}

export function PhonePeIcon({ className = 'h-4 w-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <rect width="24" height="24" rx="6" fill="#5f259f" />
      <path
        d="M16.5 7.5L10 16.5H7.5L12 10.5H8.5V8.5H16.5V7.5Z"
        fill="white"
      />
      <circle cx="15.5" cy="15.5" r="2" fill="#00D09C" />
    </svg>
  )
}

export function PaytmIcon({ className = 'h-4 w-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <rect width="24" height="24" rx="6" fill="#002E6E" />
      <path
        d="M6 8h4.5c1.4 0 2.5 1.1 2.5 2.5s-1.1 2.5-2.5 2.5H8.5v3H6V8zm2.5 3.2h2c.4 0 .7-.3.7-.7s-.3-.7-.7-.7h-2v1.4z"
        fill="#00BAF2"
      />
      <path
        d="M14 11h2.2v5H14v-5zm0-2.5h2.2v1.5H14V8.5z"
        fill="#00BAF2"
      />
    </svg>
  )
}

export function BhimIcon({ className = 'h-4 w-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <rect width="24" height="24" rx="6" fill="#0D47A1" />
      <path
        d="M8 6h5c1.7 0 3 1.3 3 3 0 .9-.4 1.7-1.1 2.2 1 .5 1.6 1.5 1.6 2.6 0 1.8-1.5 3.2-3.3 3.2H8V6zm2.2 4.4h2.7c.6 0 1-.4 1-1s-.4-1-1-1h-2.7v2zm0 4.4h2.9c.6 0 1.1-.5 1.1-1.1s-.5-1.1-1.1-1.1h-2.9v2.2z"
        fill="#FF9933"
      />
    </svg>
  )
}

export function UpiLogo({ className = 'h-4 w-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path d="M4 4l8 8-8 8" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 4l8 8-8 8" stroke="#06b6d4" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function GitHubIcon({ className = 'h-4 w-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      />
    </svg>
  )
}
