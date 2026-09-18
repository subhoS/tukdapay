import React, { useState } from 'react'
import { X, Copy, Check, ExternalLink, Lightbulb } from 'lucide-react'

// Clean X SVG Icon
function XLogo({ className = 'h-4 w-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 24.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

export default function LaunchModal({ isOpen, onClose }) {
  const [copied, setCopied] = useState(false)

  if (!isOpen) return null

  const tweetText = `Built & Shipped today: SplitPe

Everyone is talking about the new ₹2,000 UPI merchant rules (0.4% MDR / wallet fees).

Here is the truth:
- Consumers pay ₹0 tax (UPI bank-to-bank is 100% free)
- But offline merchants often ask for split payments to avoid MDR overhead

So I built a mobile-first app that takes any amount & UPI ID, splits it into halves or <₹2,000 chunks with dynamic QR codes & 1-tap UPI deep links.

Try it live:
#buildinpublic #UPI #FinTech #India`

  const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`

  const handleCopy = () => {
    navigator.clipboard.writeText(tweetText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fadeIn">
      <div 
        className="relative w-full max-w-lg rounded-3xl border border-white/10 bg-[#121826] p-6 shadow-2xl text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-white/10 p-2.5 text-white border border-white/20">
              <XLogo className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Ready to Ship on X Today</h3>
              <p className="text-xs text-gray-400">Viral Launch Thread & 1-Click Post</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 transition hover:bg-white/10 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tweet Preview */}
        <div className="mt-4 space-y-4">
          <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">
            Launch Thread Preview
          </label>
          
          <div className="rounded-2xl border border-white/10 bg-black/40 p-4 font-mono text-xs leading-relaxed text-gray-200 whitespace-pre-wrap selection:bg-white selection:text-black">
            {tweetText}
          </div>

          <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
            <button
              onClick={handleCopy}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 py-3 text-xs font-semibold text-white transition hover:bg-white/10 active:scale-95"
            >
              {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4 text-gray-300" />}
              <span>{copied ? 'Copied to Clipboard!' : 'Copy Tweet Text'}</span>
            </button>

            <a
              href={tweetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-white py-3 text-xs font-bold text-black shadow-lg shadow-white/10 transition hover:bg-gray-200 active:scale-95"
            >
              <XLogo className="h-4 w-4" />
              <span>Post to X</span>
              <ExternalLink className="h-3.5 w-3.5 opacity-70" />
            </a>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-xs text-gray-400 flex items-start gap-2">
            <Lightbulb className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
            <span>
              <strong>Launch Tip:</strong> Include a quick screen recording or mobile screenshot of the dynamic QR code in action for 3x higher engagement on X!
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
