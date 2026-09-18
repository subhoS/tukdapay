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
} from 'lucide-react'
import { BrandLogoFull } from './BrandLogo'

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

        {/* Center/Right Controls: Mode Switcher + Sound + Menu */}
        <div className="flex items-center gap-2">
          
          {/* Compact Tactile Mode Toggle (Paytm Navy & Cyan) */}
          <div className="flex items-center rounded-xl bg-slate-100 p-1 border border-slate-200">
            <button
              type="button"
              onClick={() => onToggleAppMode('dukaan')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition active:scale-95 ${
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
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition active:scale-95 ${
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

          {/* Quick Sound Toggle */}
          <button
            type="button"
            onClick={onToggleSound}
            className={`rounded-xl p-2 border transition active:scale-95 ${
              isMuted
                ? 'border-slate-200 bg-slate-100 text-slate-400 hover:bg-slate-200'
                : 'border-[#00BAF2]/30 bg-[#E8F7FE] text-[#00BAF2] hover:bg-[#D3F0FC]'
            }`}
            title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
            aria-label="Sound Toggle"
          >
            {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </button>

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
            
            <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-400 px-1">
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

            {/* Footer Trust Indicator */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 px-1">
              <span>TukdaPay • Bank-to-Bank Free</span>
              <span className="text-slate-600 font-medium">Zero Consumer Tax</span>
            </div>

          </div>
        </div>
      )}
    </header>
  )
}
