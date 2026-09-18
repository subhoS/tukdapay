import React, { useState } from 'react'
import {
  Menu,
  X,
  Volume2,
  VolumeX,
  Store,
  SlidersHorizontal,
  Receipt,
  BookOpen,
  Share2,
  ShieldCheck,
  Check,
  GitFork,
  ExternalLink,
} from 'lucide-react'
import { BrandLogoFull } from './BrandLogo'
import { GitHubIcon } from './PaymentLogos'

export default function Navbar({
  appMode = 'dukaan',
  onToggleAppMode,
  isMuted = false,
  onToggleSound,
  onOpenReceipt,
  onOpenPolicy,
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [copiedShare, setCopiedShare] = useState(false)

  const handleMenuAction = (actionFn) => {
    setIsMenuOpen(false)
    actionFn?.()
  }

  const handleShareApp = async () => {
    const shareData = {
      title: 'TukdaPay — Zero-Fee UPI Splitter',
      text: 'Split any UPI merchant bill into fee-exempt sub-₹2,000 chunks with instant QR codes!',
      url: window.location.href,
    }

    if (navigator.share) {
      try {
        await navigator.share(shareData)
        setIsMenuOpen(false)
      } catch {
        // User cancelled or share failed
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href)
        setCopiedShare(true)
        setTimeout(() => {
          setCopiedShare(false)
          setIsMenuOpen(false)
        }, 1500)
      } catch {
        setIsMenuOpen(false)
      }
    }
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur-md shadow-xs transition-all">
      <div className="mx-auto flex max-w-xl items-center justify-between px-3.5 py-2.5 sm:px-4">
        
        {/* Brand & Logo */}
        <BrandLogoFull subtitle="Zero-MDR Splitter" />

        {/* Center/Right Controls: Mode Switcher + Menu */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          
          {/* Compact Tactile Mode Toggle (Paytm Navy & Cyan) */}
          <div className="flex items-center rounded-xl bg-slate-100 p-0.5 sm:p-1 border border-slate-200">
            <button
              type="button"
              onClick={() => onToggleAppMode('dukaan')}
              className={`flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-lg text-xs font-bold transition active:scale-95 ${
                appMode === 'dukaan'
                  ? 'bg-[#002970] text-white shadow-sm'
                  : 'text-slate-600 hover:text-[#002970]'
              }`}
              title="Dukaan Mode (Fast & Simple for Store Owners)"
            >
              <Store className="h-3.5 w-3.5" />
              <span>Dukaan</span>
            </button>

            <button
              type="button"
              onClick={() => onToggleAppMode('detailed')}
              className={`flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-lg text-xs font-bold transition active:scale-95 ${
                appMode === 'detailed'
                  ? 'bg-[#002970] text-white shadow-sm'
                  : 'text-slate-600 hover:text-[#002970]'
              }`}
              title="Detailed Mode (Power Splitter)"
            >
              <SlidersHorizontal className="h-3.5 w-3.5" />
              <span>Detailed</span>
            </button>
          </div>

          {/* Desktop-only Fork on GitHub link */}
          <a
            href="https://github.com/subhoS/tukdapay"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 px-2.5 py-1.5 text-xs font-bold text-[#002970] shadow-xs active:scale-95 transition"
            title="Fork this project on GitHub (by Subhadeep Datta)"
          >
            <GitHubIcon className="h-3.5 w-3.5 text-slate-800" />
            <span>Fork</span>
            <GitFork className="h-3 w-3 text-[#00BAF2]" />
          </a>

          {/* Clean Menu Button */}
          <button
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`rounded-xl p-2 border transition active:scale-95 ${
              isMenuOpen
                ? 'border-[#002970]/30 bg-[#002970]/10 text-[#002970]'
                : 'border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
            title="Open Quick Menu"
            aria-label="Navigation Menu"
          >
            {isMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>

        </div>
      </div>

      {/* Slide-Down Quick Menu Sheet */}
      {isMenuOpen && (
        <div className="border-t border-slate-200 bg-white px-4 py-4 shadow-xl animate-fadeIn">
          <div className="mx-auto max-w-xl space-y-2.5">
            
            {/* Soundbox Voice & Chime Toggle Card */}
            <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50/80 p-3">
              <div className="flex items-center gap-2.5">
                <div className={`rounded-lg p-2 ${isMuted ? 'bg-slate-200 text-slate-500' : 'bg-emerald-100 text-emerald-700 border border-emerald-200'}`}>
                  {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4 text-emerald-700" />}
                </div>
                <div>
                  <div className="text-xs font-bold text-[#002970]">
                    Soundbox Audio {isMuted ? '(Muted)' : '(Active)'}
                  </div>
                  <div className="text-[10px] text-slate-500">
                    {isMuted ? 'Voice announcements and chimes turned off' : 'Paytm-style voice & chime confirmations active'}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={onToggleSound}
                className={`flex items-center gap-1 rounded-xl px-3 py-1.5 text-xs font-bold transition active:scale-95 ${
                  isMuted
                    ? 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-100'
                    : 'bg-[#00AF71] text-white shadow-xs'
                }`}
              >
                {isMuted ? 'Unmute' : 'Mute'}
              </button>
            </div>

            <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-400 px-1 pt-1">
              <span>Actions & Utilities</span>
              <span className="text-emerald-600 flex items-center gap-1 font-semibold normal-case bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                <ShieldCheck className="h-3 w-3 text-emerald-600" />
                <span>NPCI Verified</span>
              </span>
            </div>

            {/* Menu Items Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              
              {/* Digital Receipt */}
              <button
                type="button"
                onClick={() => handleMenuAction(onOpenReceipt)}
                className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/70 p-3 text-left transition hover:bg-slate-100 active:scale-98"
              >
                <div className="rounded-lg bg-[#E8F7FE] p-2 text-[#00BAF2]">
                  <Receipt className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-800">Digital Receipt</div>
                  <div className="text-[10px] text-slate-500">View & copy slip</div>
                </div>
              </button>

              {/* Policy Facts */}
              <button
                type="button"
                onClick={() => handleMenuAction(onOpenPolicy)}
                className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/70 p-3 text-left transition hover:bg-slate-100 active:scale-98"
              >
                <div className="rounded-lg bg-amber-50 p-2 text-amber-600 border border-amber-200/60">
                  <BookOpen className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-800">Policy Truth</div>
                  <div className="text-[10px] text-slate-500">₹2,000 MDR facts</div>
                </div>
              </button>

              {/* Native App Share */}
              <button
                type="button"
                onClick={handleShareApp}
                className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/70 p-3 text-left transition hover:bg-slate-100 active:scale-98"
              >
                <div className="rounded-lg bg-sky-50 p-2 text-[#00BAF2]">
                  {copiedShare ? <Check className="h-4 w-4 text-emerald-600" /> : <Share2 className="h-4 w-4" />}
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-800">
                    {copiedShare ? 'Link Copied!' : 'Share TukdaPay'}
                  </div>
                  <div className="text-[10px] text-slate-500">
                    {copiedShare ? 'Share with anyone' : 'Send app link'}
                  </div>
                </div>
              </button>

            </div>

            {/* Open Source / Fork CTA Banner */}
            <a
              href="https://github.com/subhoS/tukdapay"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between rounded-xl border border-sky-200 bg-sky-50/70 p-3 transition hover:bg-sky-100/80 active:scale-98"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="rounded-lg bg-white p-2 text-[#002970] shadow-xs border border-sky-100">
                  <GitHubIcon className="h-4 w-4 text-[#002970]" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-[#002970] flex items-center gap-1">
                    <span>Fork this Project on GitHub</span>
                    <ExternalLink className="h-3 w-3 text-[#00BAF2]" />
                  </div>
                  <div className="text-[10px] text-slate-500 truncate">
                    Created by Subhadeep Datta (@subhoS) • 100% Free & Open Source
                  </div>
                </div>
              </div>
              <span className="shrink-0 flex items-center gap-1 rounded-lg bg-[#002970] text-white px-2.5 py-1 text-[11px] font-bold shadow-xs">
                <GitFork className="h-3 w-3 text-[#00BAF2]" />
                <span>Fork</span>
              </span>
            </a>

            {/* Footer Trust Indicator */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 px-1">
              <span>TukdaPay by <a href="https://github.com/subhoS" target="_blank" rel="noopener noreferrer" className="font-bold text-[#002970] hover:text-[#00BAF2] underline decoration-dotted">Subhadeep Datta</a></span>
              <a href="https://github.com/subhoS/tukdapay" target="_blank" rel="noopener noreferrer" className="text-slate-600 font-semibold hover:text-[#00BAF2] flex items-center gap-1">
                <GitFork className="h-3 w-3 text-[#00BAF2]" />
                <span>Fork Project</span>
              </a>
            </div>

          </div>
        </div>
      )}
    </header>
  )
}
