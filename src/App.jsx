import React, { useState, useMemo } from 'react'
import confetti from 'canvas-confetti'
import {
  Zap,
  Divide,
  SlidersHorizontal,
  CheckCircle2,
  Copy,
  Check,
  ShieldCheck,
  MessageSquare,
  History,
  PartyPopper,
  Plus,
  Minus,
  Layers,
} from 'lucide-react'

import Navbar from './components/Navbar'
import SplitCard from './components/SplitCard'
import PolicyModal from './components/PolicyModal'
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

export default function App() {
  // App Mode: 'dukaan' (Simple frictionless store mode) | 'detailed' (Advanced mode)
  const [appMode, setAppMode] = useState(() => {
    try {
      return localStorage.getItem('tukdapay_mode') || localStorage.getItem('split2k_mode') || 'dukaan'
    } catch {
      return 'dukaan'
    }
  })

  // Store Profile: saved once into localStorage for instant checkouts
  const [storeProfile, setStoreProfile] = useState(() => {
    try {
      const saved = localStorage.getItem('tukdapay_store_profile') || localStorage.getItem('split2k_store_profile')
      if (saved) {
        const parsed = JSON.parse(saved)
        return { ...parsed, isConfigured: true }
      }
    } catch {}
    return {
      storeName: '',
      upiId: '',
      isConfigured: false,
    }
  })

  const [isStoreSetupOpen, setIsStoreSetupOpen] = useState(false)

  // Dukaan Language preference: 'hi' (Hindi / Hinglish) | 'en' (English)
  const [dukaanLang, setDukaanLang] = useState(() => {
    try {
      return localStorage.getItem('tukdapay_dukaan_lang') || localStorage.getItem('split2k_dukaan_lang') || 'hi'
    } catch {
      return 'hi'
    }
  })

  // Core Form State (derived from URL params if present, else empty)
  const [amount, setAmount] = useState(() => {
    try {
      const params = new URLSearchParams(window.location.search)
      return params.get('am') || ''
    } catch {
      return ''
    }
  })

  const [upiId, setUpiId] = useState(() => {
    try {
      const params = new URLSearchParams(window.location.search)
      const urlPa = params.get('pa')
      if (urlPa) return urlPa
      const saved = localStorage.getItem('tukdapay_store_profile') || localStorage.getItem('split2k_store_profile')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (parsed?.upiId) return parsed.upiId
      }
    } catch {}
    return ''
  })

  const [payeeName, setPayeeName] = useState(() => {
    try {
      const params = new URLSearchParams(window.location.search)
      const urlPn = params.get('pn')
      if (urlPn) return urlPn
      const saved = localStorage.getItem('tukdapay_store_profile') || localStorage.getItem('split2k_store_profile')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (parsed?.storeName) return parsed.storeName
      }
    } catch {}
    return ''
  })

  const [splitMode, setSplitMode] = useState(() => {
    try {
      const params = new URLSearchParams(window.location.search)
      const urlMode = params.get('mode')
      if (urlMode && ['smart', 'halves', 'custom'].includes(urlMode)) return urlMode
    } catch {}
    return 'smart'
  })

  const [customParts, setCustomParts] = useState(() => {
    try {
      const params = new URLSearchParams(window.location.search)
      const urlParts = params.get('parts')
      if (urlParts && Number(urlParts) > 1) return Number(urlParts)
    } catch {}
    return 2
  })

  // Paid state tracking
  const [paidStatus, setPaidStatus] = useState([])

  // Audio mute state (persisted in localStorage)
  const [isMuted, setIsMuted] = useState(() => {
    try {
      return (localStorage.getItem('tukdapay_muted') || localStorage.getItem('split2k_muted')) === 'true'
    } catch {
      return false
    }
  })

  // UI Modals
  const [isPolicyOpen, setIsPolicyOpen] = useState(false)
  const [isReceiptOpen, setIsReceiptOpen] = useState(false)
  const [fullscreenQrData, setFullscreenQrData] = useState(null)
  const [copiedShare, setCopiedShare] = useState(false)

  // Recent UPI IDs in local storage
  const [recentUpiIds, setRecentUpiIds] = useState(() => {
    try {
      const saved = localStorage.getItem('tukdapay_recent_upis') || localStorage.getItem('split2k_recent_upis')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  // Calculate splits automatically
  const splits = useMemo(() => {
    const num = Number(amount) || 0
    return calculateSplits(num, splitMode, customParts)
  }, [amount, splitMode, customParts])

  // Save UPI ID to recent storage helper
  const saveRecentUpi = (id) => {
    if (!isValidUpiId(id)) return
    setRecentUpiIds((prev) => {
      const filtered = prev.filter((item) => item.toLowerCase() !== id.toLowerCase())
      const updated = [id.trim(), ...filtered].slice(0, 5)
      try {
        localStorage.setItem('tukdapay_recent_upis', JSON.stringify(updated))
      } catch {}
      return updated
    })
  }

  // Toggle Sound handler
  const handleToggleSound = () => {
    setIsMuted((prev) => {
      const next = !prev
      try {
        localStorage.setItem('tukdapay_muted', String(next))
      } catch {}
      if (prev) {
        soundEffects.pop(false)
      }
      return next
    })
  }

  // Synchronous amount & split modifications that reset paidStatus
  const handleAmountChange = (newAmount) => {
    setAmount(newAmount)
    setPaidStatus([])
  }

  const handleSplitModeChange = (newMode) => {
    soundEffects.pop(isMuted)
    setSplitMode(newMode)
    setPaidStatus([])
  }

  const handleCustomPartsChange = (updater) => {
    soundEffects.pop(isMuted)
    setCustomParts(updater)
    setPaidStatus([])
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
        const allPaidNow = splits.length > 0 && splits.every((_, idx) => updated[idx])
        if (allPaidNow) {
          soundEffects.fanfare(isMuted)
          confetti({
            particleCount: 90,
            spread: 80,
            origin: { y: 0.55 },
            colors: ['#00BAF2', '#002970', '#00AF71', '#FF9900'],
          })
        }
      }
      return updated
    })
  }

  const handleAddAmount = (addValue) => {
    soundEffects.pop(isMuted)
    const current = Number(amount) || 0
    handleAmountChange(String(current + addValue))
  }

  const handleSetAmount = (val) => {
    soundEffects.pop(isMuted)
    handleAmountChange(String(val))
  }

  const handleSelectHandle = (handle) => {
    soundEffects.pop(isMuted)
    let newUpi = ''
    if (!upiId) {
      newUpi = `user${handle}`
    } else if (upiId.includes('@')) {
      const prefix = upiId.split('@')[0]
      newUpi = `${prefix}${handle}`
    } else {
      newUpi = `${upiId}${handle}`
    }
    setUpiId(newUpi)
    saveRecentUpi(newUpi)
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
    const text = `TukdaPay UPI Payment of ${formatINR(amount)}:\nPay in ${splits.length} fee-exempt parts to ${upiId || 'merchant'}\nLink: ${shareableUrl}`
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
      localStorage.setItem('tukdapay_mode', mode)
    } catch {}
  }

  // Dukaan store profile save
  const handleSaveStoreProfile = ({ storeName, upiId: newUpi }) => {
    const updated = { storeName, upiId: newUpi, isConfigured: true }
    setStoreProfile(updated)
    setUpiId(newUpi)
    setPayeeName(storeName)
    saveRecentUpi(newUpi)
    try {
      localStorage.setItem('tukdapay_store_profile', JSON.stringify(updated))
    } catch {}
    soundEffects.pop(isMuted)
  }

  // Dukaan language setter
  const handleSetDukaanLang = (lang) => {
    setDukaanLang(lang)
    try {
      localStorage.setItem('tukdapay_dukaan_lang', lang)
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
    setPaidStatus([])
  }

  return (
    <div className="min-h-screen bg-[#F5F7FA] text-slate-800 flex flex-col font-sans">
      {/* Sticky Header */}
      <Navbar
        onOpenPolicy={() => {
          soundEffects.pop(isMuted)
          setIsPolicyOpen(true)
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
            setAmount={handleAmountChange}
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
              className="cursor-pointer rounded-2xl border border-sky-200 bg-[#E8F7FE] p-3.5 flex items-center justify-between transition hover:bg-[#DDF3FD] active:scale-95 shadow-xs"
            >
              <div className="flex items-center gap-2.5">
                <div className="rounded-xl bg-[#00BAF2]/15 p-2 text-[#00BAF2]">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#002970] flex items-center gap-1.5">
                    <span>The ₹2,000 Rule: Consumer Tax is ₹0</span>
                  </p>
                  <p className="text-[11px] text-slate-600">
                    0.4% MDR applies to select merchants. Tap to view official facts
                  </p>
                </div>
              </div>
              <span className="text-xs text-[#002970] font-bold px-2.5 py-1 bg-white border border-[#00BAF2]/20 rounded-lg shadow-xs">
                Facts
              </span>
            </div>

            {/* Amount & UPI Input Card */}
            <section className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm space-y-4">
              {/* Bill Amount Input */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Bill Amount (₹)
                  </label>
                  {Number(amount) >= 2000 && (
                    <span className="text-[11px] font-semibold text-[#00AF71] flex items-center gap-1">
                      <Zap className="h-3 w-3" />
                      <span>Auto-Splits ≤ ₹1,999</span>
                    </span>
                  )}
                </div>

                <div className="relative flex items-center">
                  <span className="absolute left-4 text-2xl font-bold text-slate-400">₹</span>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => handleAmountChange(e.target.value)}
                    placeholder="0"
                    className="w-full rounded-2xl border border-slate-300 bg-slate-50 py-3.5 pl-10 pr-4 text-3xl font-extrabold text-[#002970] placeholder-slate-400 focus:border-[#00BAF2] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00BAF2]/20 transition"
                  />
                </div>

                {/* Quick Amount Stepper Chips */}
                <div className="flex flex-wrap gap-1.5 mt-2.5">
                  <button
                    type="button"
                    onClick={() => handleAddAmount(500)}
                    className="rounded-lg border border-slate-200 bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-200 active:scale-95 transition"
                  >
                    +₹500
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAddAmount(1000)}
                    className="rounded-lg border border-slate-200 bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-200 active:scale-95 transition"
                  >
                    +₹1,000
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSetAmount(2500)}
                    className="rounded-lg border border-slate-200 bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-200 active:scale-95 transition"
                  >
                    ₹2,500
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSetAmount(3500)}
                    className="rounded-lg border border-slate-200 bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-200 active:scale-95 transition"
                  >
                    ₹3,500
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSetAmount(5000)}
                    className="rounded-lg border border-slate-200 bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-200 active:scale-95 transition"
                  >
                    ₹5,000
                  </button>
                </div>
              </div>

              {/* Payee UPI ID */}
              <div className="pt-1">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Payee UPI ID (VPA)
                  </label>
                  {upiId && (
                    <span className={`text-[11px] font-medium flex items-center gap-1 ${isValidUpiId(upiId) ? 'text-[#00AF71]' : 'text-amber-600'}`}>
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
                  onBlur={() => saveRecentUpi(upiId)}
                  placeholder="e.g. storename@okhdfcbank or 9876543210@paytm"
                  className="w-full rounded-2xl border border-slate-300 bg-slate-50 py-3 px-4 text-sm text-[#002970] placeholder-slate-400 focus:border-[#00BAF2] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00BAF2]/20 font-mono transition"
                />

                {/* Handle suggestions */}
                <div className="flex flex-wrap gap-1.5 mt-2">
                  <span className="text-[11px] text-slate-500 py-0.5">Quick bank:</span>
                  {POPULAR_UPI_HANDLES.slice(0, 5).map((handle) => (
                    <button
                      key={handle}
                      type="button"
                      onClick={() => handleSelectHandle(handle)}
                      className="rounded-md bg-slate-100 border border-slate-200 px-2 py-0.5 text-[11px] font-mono text-[#00BAF2] font-bold hover:bg-[#E8F7FE] transition"
                    >
                      {handle}
                    </button>
                  ))}
                </div>

                {/* Recent UPI IDs */}
                {recentUpiIds.length > 0 && !upiId && (
                  <div className="mt-2.5 flex items-center gap-1.5 overflow-x-auto py-1 text-xs">
                    <History className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                    <span className="text-slate-500 text-[11px] shrink-0">Recent:</span>
                    {recentUpiIds.map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => {
                          soundEffects.pop(isMuted)
                          setUpiId(item)
                        }}
                        className="shrink-0 rounded-full border border-slate-200 bg-slate-100 px-2.5 py-0.5 text-[11px] text-slate-700 hover:bg-slate-200 active:scale-95 transition"
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Payee Name Optional */}
              <div>
                <label className="text-[11px] font-semibold text-slate-500 block mb-1">
                  Merchant / Payee Name (Optional)
                </label>
                <input
                  type="text"
                  value={payeeName}
                  onChange={(e) => setPayeeName(e.target.value)}
                  placeholder="e.g. Verma General Store"
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 py-2.5 px-3 text-xs text-[#002970] placeholder-slate-400 focus:border-[#00BAF2] focus:bg-white focus:outline-none transition"
                />
              </div>

              {/* Visual Split Mode Selector */}
              <div className="pt-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">
                  Split Strategy
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {/* Smart Split Button */}
                  <button
                    type="button"
                    onClick={() => handleSplitModeChange('smart')}
                    className={`flex flex-col items-center justify-center rounded-2xl border p-3 text-center transition active:scale-95 ${
                      splitMode === 'smart'
                        ? 'border-[#002970] bg-[#002970] text-white shadow-md'
                        : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <Zap className={`h-5 w-5 mb-1 ${splitMode === 'smart' ? 'text-[#00BAF2]' : 'text-slate-400'}`} />
                    <span className="text-xs font-bold">Smart Split</span>
                    <span className={`text-[10px] font-medium mt-0.5 ${splitMode === 'smart' ? 'text-sky-200' : 'text-slate-400'}`}>
                      &lt; ₹2k Chunks
                    </span>
                  </button>

                  {/* 50 / 50 Equal Halves */}
                  <button
                    type="button"
                    onClick={() => handleSplitModeChange('halves')}
                    className={`flex flex-col items-center justify-center rounded-2xl border p-3 text-center transition active:scale-95 ${
                      splitMode === 'halves'
                        ? 'border-[#00BAF2] bg-[#00BAF2] text-white shadow-md'
                        : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <Divide className={`h-5 w-5 mb-1 ${splitMode === 'halves' ? 'text-white' : 'text-slate-400'}`} />
                    <span className="text-xs font-bold">50 / 50</span>
                    <span className={`text-[10px] font-medium mt-0.5 ${splitMode === 'halves' ? 'text-sky-100' : 'text-slate-400'}`}>
                      Equal Halves
                    </span>
                  </button>

                  {/* Custom Parts */}
                  <button
                    type="button"
                    onClick={() => handleSplitModeChange('custom')}
                    className={`flex flex-col items-center justify-center rounded-2xl border p-3 text-center transition active:scale-95 ${
                      splitMode === 'custom'
                        ? 'border-indigo-600 bg-indigo-600 text-white shadow-md'
                        : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <SlidersHorizontal className={`h-5 w-5 mb-1 ${splitMode === 'custom' ? 'text-indigo-200' : 'text-slate-400'}`} />
                    <span className="text-xs font-bold">Custom</span>
                    <span className={`text-[10px] font-medium mt-0.5 ${splitMode === 'custom' ? 'text-indigo-100' : 'text-slate-400'}`}>
                      {customParts} Parts
                    </span>
                  </button>
                </div>
              </div>

              {/* Interactive Stepper for Custom Splits */}
              {splitMode === 'custom' && (
                <div className="rounded-2xl border border-indigo-200 bg-indigo-50/70 p-3.5 flex items-center justify-between animate-fadeIn">
                  <span className="text-xs text-indigo-900 font-medium">Number of split installments:</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleCustomPartsChange((p) => Math.max(2, p - 1))}
                      className="h-8 w-8 rounded-lg bg-white border border-indigo-200 flex items-center justify-center text-indigo-900 hover:bg-indigo-100 active:scale-90 transition shadow-xs"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="font-mono text-sm font-bold text-indigo-950 px-2">{customParts}</span>
                    <button
                      type="button"
                      onClick={() => handleCustomPartsChange((p) => Math.min(8, p + 1))}
                      className="h-8 w-8 rounded-lg bg-white border border-indigo-200 flex items-center justify-center text-indigo-900 hover:bg-indigo-100 active:scale-90 transition shadow-xs"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}

            </section>

            {/* Visual Split Segment Breakdown & Progress */}
            {splits.length > 0 && (
              <section className="rounded-2xl border border-slate-200 bg-white p-4 space-y-3.5 shadow-sm">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#002970]">Payment Progress:</span>
                    <span className="text-slate-500 font-medium">
                      {paidCount} of {splits.length} Settled
                    </span>
                  </div>
                  <div className="text-[#00AF71] font-bold font-mono">
                    {formatINR(totalPaidAmount)} / {formatINR(amount)}
                  </div>
                </div>

                {/* Segmented Visualizer */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                  {splits.map((p, idx) => {
                    const paid = paidStatus[idx]
                    return (
                      <div
                        key={p.partNumber}
                        className={`rounded-xl border py-2 px-2.5 text-center transition-all duration-300 ${
                          paid
                            ? 'border-emerald-300 bg-emerald-50 text-emerald-800'
                            : 'border-slate-200 bg-slate-50 text-slate-600'
                        }`}
                      >
                        <div className="flex items-center justify-between text-[10px] font-semibold">
                          <span>Part {p.partNumber}</span>
                          {paid ? <CheckCircle2 className="h-3 w-3 text-emerald-600" /> : <span className="text-amber-600">Due</span>}
                        </div>
                        <div className={`text-xs font-bold font-mono mt-0.5 ${paid ? 'text-emerald-900' : 'text-[#002970]'}`}>
                          {formatINR(p.amount)}
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Continuous Progress Bar */}
                <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#00BAF2] to-[#002970] transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>

                {isFullyPaid && (
                  <div className="flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-300 p-3 text-xs text-emerald-800 font-semibold animate-fadeIn">
                    <PartyPopper className="h-5 w-5 shrink-0 text-emerald-600" />
                    <span>All {splits.length} split payments have been completed!</span>
                  </div>
                )}
              </section>
            )}

            {/* Split Payments List */}
            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <Layers className="h-3.5 w-3.5 text-[#00BAF2]" />
                  <span>Split QR Codes & Direct Links ({splits.length} Parts)</span>
                </h2>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyShareLink}
                    className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50 active:scale-95 shadow-xs transition"
                  >
                    {copiedShare ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3 text-slate-500" />}
                    <span>{copiedShare ? 'Copied' : 'Share Bill'}</span>
                  </button>

                  <button
                    onClick={handleShareWhatsApp}
                    className="flex items-center gap-1 rounded-lg border border-emerald-300 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 hover:bg-emerald-100 active:scale-95 shadow-xs transition"
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

        {/* Footer info & Links */}
        <footer className="pt-4 pb-8 text-center text-xs text-slate-500 space-y-3">
          <div className="flex items-center justify-center gap-4 text-slate-500 font-medium">
            <button
              onClick={() => {
                soundEffects.pop(isMuted)
                setIsPolicyOpen(true)
              }}
              className="hover:text-[#00BAF2] underline decoration-dotted transition"
            >
              Why ₹2,000? Read Policy Facts
            </button>
            <span>•</span>
            <button
              onClick={() => {
                soundEffects.pop(isMuted)
                setIsReceiptOpen(true)
              }}
              className="hover:text-[#00BAF2] underline decoration-dotted transition"
            >
              Digital Receipt
            </button>
          </div>
          <p className="text-[11px] text-slate-400">
            TukdaPay is open client-side software. Compliant with standard NPCI UPI URI specifications. No data leaves your browser.
          </p>
        </footer>

      </main>

      {/* Modals */}
      <PolicyModal
        isOpen={isPolicyOpen}
        onClose={() => setIsPolicyOpen(false)}
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

      {isStoreSetupOpen && (
        <StoreSetupModal
          isOpen={isStoreSetupOpen}
          onClose={() => setIsStoreSetupOpen(false)}
          currentStoreName={storeProfile?.storeName}
          currentUpiId={storeProfile?.upiId}
          onSave={handleSaveStoreProfile}
          onTestSoundbox={handleTestSoundbox}
        />
      )}
    </div>
  )
}
