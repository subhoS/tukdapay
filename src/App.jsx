import React, { useState, useEffect, useMemo } from 'react'
import confetti from 'canvas-confetti'
import {
  Zap,
  Divide,
  SlidersHorizontal,
  Sparkles,
  CheckCircle2,
  Copy,
  Check,
  ShieldCheck,
  MessageSquare,
  History,
  PartyPopper,
  ShoppingBag,
  Utensils,
  Fuel,
  Plus,
  Minus,
  Layers,
} from 'lucide-react'

import Navbar from './components/Navbar'
import SplitCard from './components/SplitCard'
import PolicyModal from './components/PolicyModal'
import LaunchModal from './components/LaunchModal'
import ReceiptModal from './components/ReceiptModal'
import FullscreenQrModal from './components/FullscreenQrModal'
import MdrCalculator from './components/MdrCalculator'
import DukaanMode from './components/DukaanMode'
import StoreSetupModal from './components/StoreSetupModal'
import {
  calculateSplits,
  isValidUpiId,
  formatINR,
  POPULAR_UPI_HANDLES,
} from './utils/upi'
import { soundEffects } from './utils/sound'

// Fun visual bill presets with real Lucide icons
const BILL_PRESETS = [
  { label: 'Grocery', amount: 2400, icon: ShoppingBag, color: 'text-emerald-400' },
  { label: 'Dinner', amount: 3800, icon: Utensils, color: 'text-amber-400' },
  { label: 'Fuel', amount: 2200, icon: Fuel, color: 'text-rose-400' },
  { label: 'Shopping', amount: 4500, icon: Sparkles, color: 'text-purple-400' },
]

export default function App() {
  // App Mode: 'dukaan' (Simple frictionless store mode) | 'detailed' (Advanced mode)
  const [appMode, setAppMode] = useState(() => {
    try {
      return localStorage.getItem('split2k_mode') || 'dukaan'
    } catch {
      return 'dukaan'
    }
  })

  // Store Profile: saved once into localStorage for instant checkouts
  const [storeProfile, setStoreProfile] = useState(() => {
    try {
      const saved = localStorage.getItem('split2k_store_profile')
      if (saved) {
        const parsed = JSON.parse(saved)
        return { ...parsed, isConfigured: true }
      }
    } catch {}
    return {
      storeName: 'Sharma Kirana Store',
      upiId: 'sharma@okhdfcbank',
      isConfigured: false,
    }
  })

  const [isStoreSetupOpen, setIsStoreSetupOpen] = useState(false)

  // Dukaan Language preference: 'hi' (Hindi / Hinglish) | 'en' (English)
  const [dukaanLang, setDukaanLang] = useState(() => {
    try {
      return localStorage.getItem('split2k_dukaan_lang') || 'hi'
    } catch {
      return 'hi'
    }
  })

  // Core Form State
  const [amount, setAmount] = useState('3500')
  const [upiId, setUpiId] = useState(() => {
    try {
      const saved = localStorage.getItem('split2k_store_profile')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (parsed?.upiId) return parsed.upiId
      }
    } catch {}
    return 'sharma@okhdfcbank'
  })
  const [payeeName, setPayeeName] = useState(() => {
    try {
      const saved = localStorage.getItem('split2k_store_profile')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (parsed?.storeName) return parsed.storeName
      }
    } catch {}
    return 'Sharma Kirana Store'
  })
  const [splitMode, setSplitMode] = useState('smart') // 'smart' | 'halves' | 'custom'
  const [customParts, setCustomParts] = useState(2)

  // Paid state tracking
  const [paidStatus, setPaidStatus] = useState([])

  // Audio mute state (persisted in localStorage)
  const [isMuted, setIsMuted] = useState(() => {
    try {
      return localStorage.getItem('split2k_muted') === 'true'
    } catch {
      return false
    }
  })

  // UI Modals
  const [isPolicyOpen, setIsPolicyOpen] = useState(false)
  const [isLaunchOpen, setIsLaunchOpen] = useState(false)
  const [isReceiptOpen, setIsReceiptOpen] = useState(false)
  const [fullscreenQrData, setFullscreenQrData] = useState(null)
  const [copiedShare, setCopiedShare] = useState(false)

  // Recent UPI IDs in local storage
  const [recentUpiIds, setRecentUpiIds] = useState(() => {
    try {
      const saved = localStorage.getItem('split2k_recent_upis')
      return saved ? JSON.parse(saved) : ['sharma@okhdfcbank', 'shoppe@paytm']
    } catch {
      return ['sharma@okhdfcbank', 'shoppe@paytm']
    }
  })

  // Parse URL search parameters on initial load
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search)
      const urlAm = params.get('am')
      const urlPa = params.get('pa')
      const urlPn = params.get('pn')
      const urlMode = params.get('mode')
      const urlParts = params.get('parts')

      if (urlAm) setAmount(urlAm)
      if (urlPa) setUpiId(urlPa)
      if (urlPn) setPayeeName(urlPn)
      if (urlMode && ['smart', 'halves', 'custom'].includes(urlMode)) setSplitMode(urlMode)
      if (urlParts && Number(urlParts) > 1) setCustomParts(Number(urlParts))
    } catch (e) {
      console.warn('URL parsing error:', e)
    }
  }, [])

  // Calculate splits automatically
  const splits = useMemo(() => {
    const num = Number(amount) || 0
    return calculateSplits(num, splitMode, customParts)
  }, [amount, splitMode, customParts])

  // Synchronize paid status array with splits and reset on bill amount changes
  useEffect(() => {
    setPaidStatus(new Array(splits.length).fill(false))
  }, [amount, splitMode, customParts, splits.length])

  // Save UPI ID to recent storage when valid
  useEffect(() => {
    if (isValidUpiId(upiId)) {
      setRecentUpiIds((prev) => {
        const filtered = prev.filter((id) => id.toLowerCase() !== upiId.toLowerCase())
        const updated = [upiId.trim(), ...filtered].slice(0, 5)
        try {
          localStorage.setItem('split2k_recent_upis', JSON.stringify(updated))
        } catch {
          // ignore storage quota error
        }
        return updated
      })
    }
  }, [upiId])

  // Toggle Sound handler
  const handleToggleSound = () => {
    setIsMuted((prev) => {
      const next = !prev
      try {
        localStorage.setItem('split2k_muted', String(next))
      } catch {}
      if (prev) {
        soundEffects.pop(false)
      }
      return next
    })
  }

  // Toggle paid status for an item
  const handleTogglePaid = (index, options = {}) => {
    setPaidStatus((prev) => {
      const updated = [...prev]
      const nextValue = !updated[index]
      updated[index] = nextValue

      if (!options.silent) {
        if (nextValue) {
          // Play success chime
          soundEffects.chime(isMuted)
        } else {
          soundEffects.pop(isMuted)
        }

        // Check if all are now paid
        const allPaidNow = updated.every(Boolean) && updated.length > 0
        if (allPaidNow) {
          soundEffects.fanfare(isMuted)
          confetti({
            particleCount: 90,
            spread: 80,
            origin: { y: 0.55 },
            colors: ['#10b981', '#14b8a6', '#3b82f6', '#f59e0b', '#8b5cf6'],
          })
        }
      }
      return updated
    })
  }

  // Preset Handlers
  const handleSelectPreset = (val) => {
    soundEffects.pop(isMuted)
    setAmount(String(val))
  }

  const handleAddAmount = (addValue) => {
    soundEffects.pop(isMuted)
    const current = Number(amount) || 0
    setAmount(String(current + addValue))
  }

  const handleSetAmount = (val) => {
    soundEffects.pop(isMuted)
    setAmount(String(val))
  }

  const handleSelectHandle = (handle) => {
    soundEffects.pop(isMuted)
    if (!upiId) {
      setUpiId(`user${handle}`)
    } else if (upiId.includes('@')) {
      const prefix = upiId.split('@')[0]
      setUpiId(`${prefix}${handle}`)
    } else {
      setUpiId(`${upiId}${handle}`)
    }
  }

  // Share URL Generator
  const shareableUrl = useMemo(() => {
    const url = new URL(window.location.href)
    url.searchParams.set('am', amount)
    if (upiId) url.searchParams.set('pa', upiId)
    if (payeeName) url.searchParams.set('pn', payeeName)
    url.searchParams.set('mode', splitMode)
    if (splitMode === 'custom') url.searchParams.set('parts', customParts)
    return url.toString()
  }, [amount, upiId, payeeName, splitMode, customParts])

  const handleCopyShareLink = () => {
    soundEffects.pop(isMuted)
    navigator.clipboard.writeText(shareableUrl)
    setCopiedShare(true)
    setTimeout(() => setCopiedShare(false), 2000)
  }

  const handleShareWhatsApp = () => {
    soundEffects.pop(isMuted)
    const text = `Split UPI Payment of ${formatINR(amount)}:\nPay in ${splits.length} parts to ${upiId || 'merchant'}\nLink: ${shareableUrl}`
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank')
  }

  const paidCount = paidStatus.filter(Boolean).length
  const totalPaidAmount = splits
    .filter((_, idx) => paidStatus[idx])
    .reduce((sum, p) => sum + p.amount, 0)
  const isFullyPaid = splits.length > 0 && paidCount === splits.length
  const progressPercent = splits.length > 0 ? (paidCount / splits.length) * 100 : 0

  // App Mode toggle handler
  const handleToggleAppMode = (mode) => {
    soundEffects.pop(isMuted)
    setAppMode(mode)
    try {
      localStorage.setItem('split2k_mode', mode)
    } catch {}
  }

  // Dukaan store profile save
  const handleSaveStoreProfile = ({ storeName, upiId: newUpi }) => {
    const updated = { storeName, upiId: newUpi, isConfigured: true }
    setStoreProfile(updated)
    setUpiId(newUpi)
    setPayeeName(storeName)
    try {
      localStorage.setItem('split2k_store_profile', JSON.stringify(updated))
    } catch {}
    soundEffects.pop(isMuted)
  }

  // Dukaan language setter
  const handleSetDukaanLang = (lang) => {
    setDukaanLang(lang)
    try {
      localStorage.setItem('split2k_dukaan_lang', lang)
    } catch {}
  }

  // Test soundbox
  const handleTestSoundbox = () => {
    soundEffects.speakSoundbox({
      partNumber: 1,
      totalParts: 2,
      amount: 1750,
      isFull: false,
      language: dukaanLang,
      isMuted: false,
    })
  }

  // Reset bill for next customer
  const handleResetBill = () => {
    setAmount('')
    setPaidStatus(new Array(splits.length).fill(false))
  }

  return (
    <div className="min-h-screen bg-[#0b0f17] text-gray-100 flex flex-col font-sans">
      {/* Sticky Header */}
      <Navbar
        onOpenPolicy={() => {
          soundEffects.pop(isMuted)
          setIsPolicyOpen(true)
        }}
        onOpenLaunch={() => {
          soundEffects.pop(isMuted)
          setIsLaunchOpen(true)
        }}
        onOpenReceipt={() => {
          soundEffects.pop(isMuted)
          setIsReceiptOpen(true)
        }}
        isMuted={isMuted}
        onToggleSound={handleToggleSound}
        appMode={appMode}
        onToggleAppMode={handleToggleAppMode}
      />

      {/* Main Container */}
      <main className="flex-1 w-full max-w-xl mx-auto px-4 py-6 space-y-5">
        {appMode === 'dukaan' ? (
          <DukaanMode
            amount={amount}
            setAmount={setAmount}
            storeProfile={storeProfile}
            onOpenStoreSetup={() => {
              soundEffects.pop(isMuted)
              setIsStoreSetupOpen(true)
            }}
            splits={splits}
            paidStatus={paidStatus}
            onTogglePaid={handleTogglePaid}
            onResetBill={handleResetBill}
            isMuted={isMuted}
            onToggleSound={handleToggleSound}
            onOpenReceipt={() => {
              soundEffects.pop(isMuted)
              setIsReceiptOpen(true)
            }}
            onSwitchToDetailed={() => handleToggleAppMode('detailed')}
            dukaanLang={dukaanLang}
            setDukaanLang={handleSetDukaanLang}
            soundEffects={soundEffects}
          />
        ) : (
          <>
            {/* Policy Quick Alert Banner */}
            <div 
              onClick={() => {
                soundEffects.pop(isMuted)
                setIsPolicyOpen(true)
              }}
              className="cursor-pointer rounded-2xl border border-amber-500/30 bg-amber-500/10 p-3.5 flex items-center justify-between transition hover:bg-amber-500/15 active:scale-95"
        >
          <div className="flex items-center gap-2.5">
            <div className="rounded-xl bg-amber-500/20 p-2 text-amber-400">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-semibold text-amber-200 flex items-center gap-1.5">
                <span>The ₹2,000 Rule: Consumer Tax is ₹0</span>
              </p>
              <p className="text-[11px] text-amber-300/70">
                0.4% MDR applies to select merchants. Tap to view official facts
              </p>
            </div>
          </div>
          <span className="text-xs text-amber-400 font-bold px-2.5 py-1 bg-amber-500/20 rounded-lg">
            Facts
          </span>
        </div>

        {/* Amount & UPI Input Card */}
        <section className="rounded-3xl border border-white/10 bg-[#121826]/90 p-5 sm:p-6 shadow-2xl backdrop-blur-xl space-y-4">
          
          {/* Fun Bill Presets */}
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 block mb-2">
              Quick Expense Presets
            </span>
            <div className="grid grid-cols-4 gap-2">
              {BILL_PRESETS.map((preset) => {
                const IconComponent = preset.icon
                return (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => handleSelectPreset(preset.amount)}
                    className="flex flex-col items-center justify-center rounded-xl border border-white/5 bg-white/5 py-2.5 px-2 text-center transition hover:bg-white/10 active:scale-95"
                  >
                    <IconComponent className={`h-4 w-4 ${preset.color} mb-1`} />
                    <span className="text-[11px] font-semibold text-gray-200">{preset.label}</span>
                    <span className="text-[10px] text-gray-400">{formatINR(preset.amount)}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Bill Amount Input */}
          <div className="pt-1">
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Bill Amount (₹)
              </label>
              {Number(amount) > 2000 && (
                <span className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1">
                  <Zap className="h-3 w-3" />
                  <span>Auto-Splits &lt; ₹2,000</span>
                </span>
              )}
            </div>

            <div className="relative flex items-center">
              <span className="absolute left-4 text-2xl font-bold text-gray-400">₹</span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0"
                className="w-full rounded-2xl border border-white/10 bg-black/40 py-3.5 pl-10 pr-4 text-3xl font-extrabold text-white placeholder-gray-600 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            {/* Quick Amount Stepper Chips */}
            <div className="flex flex-wrap gap-1.5 mt-2.5">
              <button
                type="button"
                onClick={() => handleAddAmount(500)}
                className="rounded-lg border border-white/5 bg-white/5 px-2.5 py-1 text-xs text-gray-300 hover:bg-white/10 active:scale-95"
              >
                +₹500
              </button>
              <button
                type="button"
                onClick={() => handleAddAmount(1000)}
                className="rounded-lg border border-white/5 bg-white/5 px-2.5 py-1 text-xs text-gray-300 hover:bg-white/10 active:scale-95"
              >
                +₹1,000
              </button>
              <button
                type="button"
                onClick={() => handleSetAmount(2500)}
                className="rounded-lg border border-white/5 bg-white/5 px-2.5 py-1 text-xs text-gray-300 hover:bg-white/10 active:scale-95"
              >
                ₹2,500
              </button>
              <button
                type="button"
                onClick={() => handleSetAmount(3500)}
                className="rounded-lg border border-white/5 bg-white/5 px-2.5 py-1 text-xs text-gray-300 hover:bg-white/10 active:scale-95"
              >
                ₹3,500
              </button>
              <button
                type="button"
                onClick={() => handleSetAmount(5000)}
                className="rounded-lg border border-white/5 bg-white/5 px-2.5 py-1 text-xs text-gray-300 hover:bg-white/10 active:scale-95"
              >
                ₹5,000
              </button>
            </div>
          </div>

          {/* Payee UPI ID */}
          <div className="pt-1">
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Payee UPI ID (VPA)
              </label>
              {upiId && (
                <span className={`text-[11px] font-medium flex items-center gap-1 ${isValidUpiId(upiId) ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {isValidUpiId(upiId) ? (
                    <>
                      <Check className="h-3 w-3" />
                      <span>Valid UPI ID</span>
                    </>
                  ) : (
                    <span>Format: username@bank</span>
                  )}
                </span>
              )}
            </div>

            <input
              type="text"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              placeholder="e.g. storename@okhdfcbank or 9876543210@paytm"
              className="w-full rounded-2xl border border-white/10 bg-black/40 py-3 px-4 text-sm text-white placeholder-gray-600 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono"
            />

            {/* Handle suggestions */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              <span className="text-[11px] text-gray-500 py-0.5">Quick bank:</span>
              {POPULAR_UPI_HANDLES.slice(0, 5).map((handle) => (
                <button
                  key={handle}
                  type="button"
                  onClick={() => handleSelectHandle(handle)}
                  className="rounded-md bg-white/5 px-2 py-0.5 text-[11px] font-mono text-emerald-400 hover:bg-white/10"
                >
                  {handle}
                </button>
              ))}
            </div>

            {/* Recent UPI IDs */}
            {recentUpiIds.length > 0 && !upiId && (
              <div className="mt-2.5 flex items-center gap-1.5 overflow-x-auto py-1 text-xs">
                <History className="h-3.5 w-3.5 text-gray-500 shrink-0" />
                <span className="text-gray-500 text-[11px] shrink-0">Recent:</span>
                {recentUpiIds.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => {
                      soundEffects.pop(isMuted)
                      setUpiId(item)
                    }}
                    className="shrink-0 rounded-full border border-white/5 bg-white/5 px-2.5 py-0.5 text-[11px] text-gray-300 hover:bg-white/10 active:scale-95"
                  >
                    {item}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Payee Name Optional */}
          <div>
            <label className="text-[11px] font-semibold text-gray-400 block mb-1">
              Merchant / Payee Name (Optional)
            </label>
            <input
              type="text"
              value={payeeName}
              onChange={(e) => setPayeeName(e.target.value)}
              placeholder="e.g. Sharma Kirana Store"
              className="w-full rounded-xl border border-white/10 bg-black/40 py-2.5 px-3 text-xs text-white placeholder-gray-600 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          {/* Fun Visual Split Mode Selector */}
          <div className="pt-2">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-2">
              Split Strategy
            </label>
            <div className="grid grid-cols-3 gap-2">
              {/* Smart Split Button */}
              <button
                type="button"
                onClick={() => {
                  soundEffects.pop(isMuted)
                  setSplitMode('smart')
                }}
                className={`flex flex-col items-center justify-center rounded-2xl border p-3 text-center transition active:scale-95 ${
                  splitMode === 'smart'
                    ? 'border-emerald-500/60 bg-emerald-500/15 text-white ring-1 ring-emerald-500/40 shadow-lg shadow-emerald-500/10'
                    : 'border-white/5 bg-white/5 text-gray-400 hover:bg-white/10'
                }`}
              >
                <Zap className={`h-5 w-5 mb-1 ${splitMode === 'smart' ? 'text-emerald-400' : 'text-gray-400'}`} />
                <span className="text-xs font-bold">Smart Split</span>
                <span className="text-[10px] text-emerald-300 font-medium mt-0.5">&lt; ₹2k Chunks</span>
              </button>

              {/* 50 / 50 Equal Halves */}
              <button
                type="button"
                onClick={() => {
                  soundEffects.pop(isMuted)
                  setSplitMode('halves')
                }}
                className={`flex flex-col items-center justify-center rounded-2xl border p-3 text-center transition active:scale-95 ${
                  splitMode === 'halves'
                    ? 'border-cyan-500/60 bg-cyan-500/15 text-white ring-1 ring-cyan-500/40 shadow-lg shadow-cyan-500/10'
                    : 'border-white/5 bg-white/5 text-gray-400 hover:bg-white/10'
                }`}
              >
                <Divide className={`h-5 w-5 mb-1 ${splitMode === 'halves' ? 'text-cyan-400' : 'text-gray-400'}`} />
                <span className="text-xs font-bold">50 / 50</span>
                <span className="text-[10px] text-cyan-300 font-medium mt-0.5">Equal Halves</span>
              </button>

              {/* Custom Parts */}
              <button
                type="button"
                onClick={() => {
                  soundEffects.pop(isMuted)
                  setSplitMode('custom')
                }}
                className={`flex flex-col items-center justify-center rounded-2xl border p-3 text-center transition active:scale-95 ${
                  splitMode === 'custom'
                    ? 'border-purple-500/60 bg-purple-500/15 text-white ring-1 ring-purple-500/40 shadow-lg shadow-purple-500/10'
                    : 'border-white/5 bg-white/5 text-gray-400 hover:bg-white/10'
                }`}
              >
                <SlidersHorizontal className={`h-5 w-5 mb-1 ${splitMode === 'custom' ? 'text-purple-400' : 'text-gray-400'}`} />
                <span className="text-xs font-bold">Custom</span>
                <span className="text-[10px] text-purple-300 font-medium mt-0.5">{customParts} Parts</span>
              </button>
            </div>
          </div>

          {/* Interactive Stepper for Custom Splits */}
          {splitMode === 'custom' && (
            <div className="rounded-2xl border border-purple-500/20 bg-purple-500/5 p-3.5 flex items-center justify-between animate-fadeIn">
              <span className="text-xs text-purple-200 font-medium">Number of split installments:</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    soundEffects.pop(isMuted)
                    setCustomParts((p) => Math.max(2, p - 1))
                  }}
                  className="h-8 w-8 rounded-lg bg-white/10 flex items-center justify-center text-white hover:bg-white/20 active:scale-90 transition"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="font-mono text-sm font-bold text-white px-2">{customParts}</span>
                <button
                  type="button"
                  onClick={() => {
                    soundEffects.pop(isMuted)
                    setCustomParts((p) => Math.min(8, p + 1))
                  }}
                  className="h-8 w-8 rounded-lg bg-white/10 flex items-center justify-center text-white hover:bg-white/20 active:scale-90 transition"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

        </section>

        {/* Visual Split Segment Breakdown & Progress */}
        {splits.length > 0 && (
          <section className="rounded-2xl border border-white/10 bg-[#121826] p-4 space-y-3.5">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="font-bold text-white">Payment Progress:</span>
                <span className="text-gray-400 font-medium">
                  {paidCount} of {splits.length} Settled
                </span>
              </div>
              <div className="text-emerald-400 font-bold font-mono">
                {formatINR(totalPaidAmount)} / {formatINR(amount)}
              </div>
            </div>

            {/* Delightful Segmented Visualizer */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
              {splits.map((p, idx) => {
                const paid = paidStatus[idx]
                return (
                  <div
                    key={p.partNumber}
                    className={`rounded-xl border py-2 px-2.5 text-center transition-all duration-300 ${
                      paid
                        ? 'border-emerald-500/50 bg-emerald-500/20 text-emerald-300'
                        : 'border-white/10 bg-white/5 text-gray-400'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] font-semibold">
                      <span>Part {p.partNumber}</span>
                      {paid ? <CheckCircle2 className="h-3 w-3 text-emerald-400" /> : <span className="text-amber-400">Due</span>}
                    </div>
                    <div className="text-xs font-bold text-white font-mono mt-0.5">
                      {formatINR(p.amount)}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Continuous Progress Bar */}
            <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            {isFullyPaid && (
              <div className="flex items-center gap-2 rounded-xl bg-emerald-500/20 border border-emerald-500/40 p-3 text-xs text-emerald-300 font-semibold animate-fadeIn">
                <PartyPopper className="h-5 w-5 shrink-0 text-emerald-400" />
                <span>All {splits.length} split payments have been completed!</span>
              </div>
            )}
          </section>
        )}

        {/* Split Payments List */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
              <Layers className="h-3.5 w-3.5 text-emerald-400" />
              <span>Split QR Codes & Direct Links ({splits.length} Parts)</span>
            </h2>
            
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyShareLink}
                className="flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-gray-300 hover:bg-white/10 active:scale-95"
              >
                {copiedShare ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                <span>{copiedShare ? 'Copied' : 'Share Bill'}</span>
              </button>

              <button
                onClick={handleShareWhatsApp}
                className="flex items-center gap-1 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-xs text-emerald-400 hover:bg-emerald-500/20 active:scale-95"
              >
                <MessageSquare className="h-3 w-3" />
                <span>WhatsApp</span>
              </button>
            </div>
          </div>

          {splits.map((part, index) => (
            <SplitCard
              key={part.partNumber}
              part={part}
              index={index}
              totalParts={splits.length}
              upiId={upiId}
              payeeName={payeeName}
              isPaid={paidStatus[index] || false}
              onTogglePaid={handleTogglePaid}
              activeStep={paidStatus.findIndex((p) => !p)}
              onFullscreenQr={(url, p) => setFullscreenQrData({ url, part: p })}
              soundEffects={soundEffects}
              isMuted={isMuted}
            />
          ))}
        </section>

        {/* Interactive MDR & Merchant Fee Comparison */}
        <MdrCalculator
          amount={amount}
          splitsCount={splits.length}
        />
        </>
        )}

        {/* Footer info & Ship Prompt */}
        <footer className="pt-4 pb-8 text-center text-xs text-gray-500 space-y-3">
          <div className="flex items-center justify-center gap-4 text-gray-400">
            <button
              onClick={() => {
                soundEffects.pop(isMuted)
                setIsPolicyOpen(true)
              }}
              className="hover:text-emerald-400 underline decoration-dotted"
            >
              Why ₹2,000? Read Policy Facts
            </button>
            <span>•</span>
            <button
              onClick={() => {
                soundEffects.pop(isMuted)
                setIsReceiptOpen(true)
              }}
              className="hover:text-emerald-400 underline decoration-dotted"
            >
              Digital Receipt
            </button>
            <span>•</span>
            <button
              onClick={() => {
                soundEffects.pop(isMuted)
                setIsLaunchOpen(true)
              }}
              className="hover:text-emerald-400 underline decoration-dotted"
            >
              Ship on X
            </button>
          </div>
          <p className="text-[11px] text-gray-600">
            SplitPe is open client-side software. Compliant with standard NPCI UPI URI specifications. No data leaves your browser.
          </p>
        </footer>

      </main>

      {/* Modals */}
      <PolicyModal
        isOpen={isPolicyOpen}
        onClose={() => setIsPolicyOpen(false)}
      />

      <LaunchModal
        isOpen={isLaunchOpen}
        onClose={() => setIsLaunchOpen(false)}
      />

      <ReceiptModal
        isOpen={isReceiptOpen}
        onClose={() => setIsReceiptOpen(false)}
        amount={amount}
        splits={splits}
        paidStatus={paidStatus}
        upiId={upiId}
        payeeName={payeeName}
      />

      <FullscreenQrModal
        isOpen={!!fullscreenQrData}
        onClose={() => setFullscreenQrData(null)}
        qrDataUrl={fullscreenQrData?.url}
        part={fullscreenQrData?.part}
        upiId={upiId}
        payeeName={payeeName}
      />

      <StoreSetupModal
        isOpen={isStoreSetupOpen}
        onClose={() => setIsStoreSetupOpen(false)}
        currentStoreName={storeProfile?.storeName}
        currentUpiId={storeProfile?.upiId}
        onSave={handleSaveStoreProfile}
        onTestSoundbox={handleTestSoundbox}
      />
    </div>
  )
}
