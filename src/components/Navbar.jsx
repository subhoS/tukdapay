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
} from 'lucide-react'
import { BrandLogoFull } from './BrandLogo'

export default function Navbar({
  appMode = 'dukaan',
  onToggleAppMode,
  isMuted = false,
  onToggleSound,
  onOpenReceipt,
  onOpenPolicy,
  onOpenLaunch,
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleMenuAction = (actionFn) => {
    setIsMenuOpen(false)
    actionFn?.()
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#0b0f17]/95 backdrop-blur-xl transition-all">
      <div className="mx-auto flex max-w-xl items-center justify-between px-3.5 py-2.5 sm:px-4">
        
        {/* Brand & Logo */}
        <BrandLogoFull subtitle="Smart UPI Splitter" />

        {/* Center/Right Controls: Mode Switcher + Menu Trigger */}
        <div className="flex items-center gap-2">
          
          {/* Compact Tactile Mode Toggle */}
          <div className="flex items-center rounded-xl bg-white/[0.06] p-1 border border-white/10">
            <button
              type="button"
              onClick={() => onToggleAppMode('dukaan')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition active:scale-95 ${
                appMode === 'dukaan'
                  ? 'bg-emerald-500 text-white shadow-sm shadow-emerald-500/25'
                  : 'text-gray-400 hover:text-white'
              }`}
              title="Dukaan Mode (Fast & Simple for Shopkeepers)"
            >
              <Store className="h-3.5 w-3.5" />
              <span>Dukaan</span>
            </button>

            <button
              type="button"
              onClick={() => onToggleAppMode('detailed')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition active:scale-95 ${
                appMode === 'detailed'
                  ? 'bg-emerald-500 text-white shadow-sm shadow-emerald-500/25'
                  : 'text-gray-400 hover:text-white'
              }`}
              title="Detailed Mode (Power Splitter)"
            >
              <SlidersHorizontal className="h-3.5 w-3.5" />
              <span>Detailed</span>
            </button>
          </div>

          {/* Quick Sound Toggle (Always 1-tap accessible) */}
          <button
            type="button"
            onClick={onToggleSound}
            className={`rounded-xl p-2 border transition active:scale-95 ${
              isMuted
                ? 'border-white/10 bg-white/5 text-gray-400 hover:text-white'
                : 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
            }`}
            title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
            aria-label="Sound Toggle"
          >
            {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </button>

          {/* Clean Menu Drawer Toggle Button */}
          <button
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`rounded-xl p-2 border transition active:scale-95 ${
              isMenuOpen
                ? 'border-emerald-500/40 bg-emerald-500/20 text-white'
                : 'border-white/10 bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white'
            }`}
            title="Open Quick Menu"
            aria-label="Navigation Menu"
          >
            {isMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>

        </div>
      </div>

      {/* Decluttered Slide-Down Quick Menu Sheet */}
      {isMenuOpen && (
        <div className="border-t border-white/10 bg-[#0f1523]/98 px-4 py-4 backdrop-blur-2xl animate-fadeIn">
          <div className="mx-auto max-w-xl space-y-2.5">
            
            <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-gray-400 px-1">
              <span>Quick Actions & Utilities</span>
              <span className="text-emerald-400 flex items-center gap-1 font-semibold normal-case">
                <ShieldCheck className="h-3 w-3" />
                <span>NPCI Verified</span>
              </span>
            </div>

            {/* Menu Items Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              
              {/* Digital Receipt */}
              <button
                type="button"
                onClick={() => handleMenuAction(onOpenReceipt)}
                className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-3 text-left transition hover:bg-white/10 active:scale-98"
              >
                <div className="rounded-lg bg-emerald-500/15 p-2 text-emerald-400">
                  <Receipt className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Digital Receipt</div>
                  <div className="text-[10px] text-gray-400">View & copy slip</div>
                </div>
              </button>

              {/* Policy Facts */}
              <button
                type="button"
                onClick={() => handleMenuAction(onOpenPolicy)}
                className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-3 text-left transition hover:bg-white/10 active:scale-98"
              >
                <div className="rounded-lg bg-amber-500/15 p-2 text-amber-400">
                  <BookOpen className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Policy Truth</div>
                  <div className="text-[10px] text-gray-400">₹2,000 MDR facts</div>
                </div>
              </button>

              {/* Ship on X */}
              <button
                type="button"
                onClick={() => handleMenuAction(onOpenLaunch)}
                className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-3 text-left transition hover:bg-white/10 active:scale-98"
              >
                <div className="rounded-lg bg-sky-500/15 p-2 text-sky-400">
                  <Share2 className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Share / Ship on X</div>
                  <div className="text-[10px] text-gray-400">Post update & copy</div>
                </div>
              </button>

            </div>

            {/* Footer Trust Indicator */}
            <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-gray-500 px-1">
              <span>SplitPe Engine v1.1 • Bank-to-Bank Free</span>
              <span className="text-gray-400">Zero Consumer Tax</span>
            </div>

          </div>
        </div>
      )}
    </header>
  )
}
