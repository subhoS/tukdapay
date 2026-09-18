import React from 'react'
import { Zap, BookOpen, Share2, Volume2, VolumeX, Receipt, Store, SlidersHorizontal } from 'lucide-react'

export default function Navbar({
  onOpenPolicy,
  onOpenLaunch,
  onOpenReceipt,
  isMuted,
  onToggleSound,
  appMode,
  onToggleAppMode,
}) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#0b0f17]/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-xl items-center justify-between px-4 py-2.5">
        {/* Brand & Logo with real Lucide icon */}
        <div className="flex items-center gap-2">
          <div className="relative flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-600 via-emerald-500 to-teal-400 font-bold text-white shadow-md shadow-emerald-500/30">
            <Zap className="h-4 w-4 fill-white text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-bold tracking-tight text-white">
                Split<span className="text-emerald-400">2K</span>
              </span>
              <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-1.5 py-0.2 text-[9px] font-semibold text-emerald-400 border border-emerald-500/20">
                P2M Free
              </span>
            </div>
            <p className="text-[9px] text-gray-400">NPCI Split Engine</p>
          </div>
        </div>

        {/* 1-Tap Mode Toggle: Dukaan vs Detailed */}
        <div className="flex items-center rounded-xl bg-black/50 p-1 border border-white/10">
          <button
            type="button"
            onClick={() => onToggleAppMode('dukaan')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition active:scale-95 ${
              appMode === 'dukaan'
                ? 'bg-emerald-500 text-white shadow-sm'
                : 'text-gray-400 hover:text-white'
            }`}
            title="Dukaan / Store Mode (Fast & Simple)"
          >
            <Store className="h-3.5 w-3.5" />
            <span>Dukaan</span>
          </button>
          <button
            type="button"
            onClick={() => onToggleAppMode('detailed')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition active:scale-95 ${
              appMode === 'detailed'
                ? 'bg-emerald-500 text-white shadow-sm'
                : 'text-gray-400 hover:text-white'
            }`}
            title="Detailed / Advanced Mode"
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            <span>Detailed</span>
          </button>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1 sm:gap-1.5">
          {/* Sound Toggle */}
          <button
            onClick={onToggleSound}
            className={`rounded-lg p-1.5 transition active:scale-95 border ${
              isMuted
                ? 'border-white/5 bg-white/5 text-gray-400 hover:text-gray-200'
                : 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
            }`}
            title={isMuted ? 'Turn Sound On' : 'Mute Sound'}
            aria-label="Sound Toggle"
          >
            {isMuted ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
          </button>

          {/* Digital Receipt */}
          <button
            onClick={onOpenReceipt}
            className="flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 p-1.5 sm:px-2 text-xs font-medium text-gray-200 hover:bg-white/10 transition active:scale-95"
            title="View Digital Receipt"
          >
            <Receipt className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Receipt</span>
          </button>

          {/* Policy Guide */}
          <button
            onClick={onOpenPolicy}
            className="flex items-center gap-1 rounded-lg border border-amber-500/30 bg-amber-500/10 p-1.5 sm:px-2 text-xs font-semibold text-amber-300 hover:bg-amber-500/20 transition active:scale-95"
            title="Read the ₹2000 Policy Facts"
          >
            <BookOpen className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Facts</span>
          </button>

          {/* Ship on X */}
          <button
            onClick={onOpenLaunch}
            className="flex items-center gap-1 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 px-2.5 py-1 text-xs font-bold text-white shadow-sm shadow-emerald-500/20 hover:opacity-90 transition active:scale-95"
            title="Ship on X / Share App"
          >
            <Share2 className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Ship</span>
          </button>
        </div>
      </div>
    </header>
  )
}
