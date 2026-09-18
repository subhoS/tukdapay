import React, { useState, useEffect, useMemo } from 'react'
import QRCode from 'qrcode'
import confetti from 'canvas-confetti'
import {
  Store,
  QrCode,
  CheckCircle2,
  Volume2,
  VolumeX,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Edit3,
  Receipt,
  ShieldCheck,
  Check,
  Zap,
  PartyPopper,
  Clock,
  Languages,
  SlidersHorizontal,
  Delete,
  X,
  Eye,
} from 'lucide-react'
import { generateUpiUri, formatINR, isValidUpiId } from '../utils/upi'
import { GPayIcon, PhonePeIcon, PaytmIcon, BhimIcon } from './PaymentLogos'

export default function DukaanMode({
  amount,
  setAmount,
  storeProfile,
  onOpenStoreSetup,
  splits,
  paidStatus,
  onTogglePaid,
  onResetBill,
  isMuted,
  onToggleSound,
  onOpenReceipt,
  onSwitchToDetailed,
  dukaanLang,
  setDukaanLang,
  soundEffects,
}) {
  // Current active view in Dukaan mode: 'keypad' | 'counter'
  const [activeView, setActiveView] = useState('keypad')
  // Active part index being displayed in counter view
  const [activePartIndex, setActivePartIndex] = useState(0)
  // Generated QR Data URL for the active part
  const [activeQrUrl, setActiveQrUrl] = useState('')
  // Review paid parts toggle in settled view
  const [showSettledReview, setShowSettledReview] = useState(false)

  const isHindi = dukaanLang === 'hi'

  // Determine current active part safely without setState in effect
  const safePartIndex = splits.length > 0 && activePartIndex >= splits.length ? 0 : activePartIndex
  const currentPart = splits[safePartIndex] || splits[0] || null

  // Generate UPI URI for active part
  const activeUpiUri = useMemo(() => {
    if (!currentPart || !storeProfile?.upiId) return ''
    return generateUpiUri({
      pa: storeProfile.upiId,
      pn: storeProfile.storeName || 'Merchant',
      am: currentPart.amount,
      tn: `TukdaPay: Part ${currentPart.partNumber} of ${splits.length}`,
    })
  }, [currentPart, storeProfile, splits.length])

  // Generate QR code whenever active UPI URI changes
  useEffect(() => {
    if (!activeUpiUri) return
    let isCurrent = true

    QRCode.toDataURL(activeUpiUri, {
      width: 360,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#ffffff',
      },
      errorCorrectionLevel: 'M',
    })
      .then((url) => {
        if (isCurrent) setActiveQrUrl(url)
      })
      .catch((err) => console.error('Dukaan QR generation error:', err))

    return () => {
      isCurrent = false
    }
  }, [activeUpiUri])

  const qrUrlToDisplay = activeUpiUri ? activeQrUrl : ''

  const paidCount = paidStatus.filter(Boolean).length
  const isFullyPaid = splits.length > 0 && paidCount === splits.length

  // When all parts are paid while in counter view, celebrate!
  useEffect(() => {
    if (activeView === 'counter' && isFullyPaid) {
      confetti({
        particleCount: 100,
        spread: 90,
        origin: { y: 0.55 },
        colors: ['#10b981', '#14b8a6', '#3b82f6', '#f59e0b'],
      })
    }
  }, [isFullyPaid, activeView])

  // Keypad Handlers
  const handleKeypadPress = (val) => {
    soundEffects?.pop(isMuted)
    if (val === 'C') {
      setAmount('')
      return
    }

    if (val === 'backspace') {
      if (amount.length > 1) {
        setAmount(amount.slice(0, -1))
      } else {
        setAmount('')
      }
      return
    }

    if (val === '00') {
      if (amount && amount !== '0') {
        setAmount(amount + '00')
      }
      return
    }

    if (amount === '0' || !amount) {
      setAmount(val)
    } else {
      setAmount(amount + val)
    }
  }

  const handleAddAmount = (addVal) => {
    soundEffects?.pop(isMuted)
    const current = Number(amount) || 0
    setAmount(String(current + addVal))
  }

  const handleSetAmount = (val) => {
    soundEffects?.pop(isMuted)
    setAmount(String(val))
  }

  // Action to start customer counter QR view
  const handleStartSplitAndShowQr = () => {
    soundEffects?.pop(isMuted)
    if (!storeProfile?.upiId || !isValidUpiId(storeProfile.upiId) || storeProfile?.isConfigured === false) {
      onOpenStoreSetup()
      return
    }
    const num = Number(amount) || 0
    if (num <= 0) return

    // Find the first unpaid part or default to 0
    const firstUnpaid = paidStatus.findIndex((p) => !p)
    setActivePartIndex(firstUnpaid !== -1 ? firstUnpaid : 0)
    setShowSettledReview(false)
    setActiveView('counter')
  }

  // Handle Mark as Paid with Soundbox Chime & Voice
  const handleMarkCurrentPaid = () => {
    if (!currentPart) return

    const partNum = currentPart.partNumber
    const partAmount = currentPart.amount
    const isCurrentlyPaid = paidStatus[safePartIndex]

    if (!isCurrentlyPaid) {
      // Check if this action completes all payments
      const willBeFullyPaid = paidCount + 1 === splits.length

      // Play Soundbox Chime + Voice announcement
      soundEffects?.speakSoundbox({
        partNumber: partNum,
        totalParts: splits.length,
        amount: partAmount,
        isFull: willBeFullyPaid,
        language: dukaanLang,
        isMuted: isMuted,
      })

      // Notify parent with silent option so generic chime and confetti do not clash
      onTogglePaid(safePartIndex, { silent: true })

      // If not fully paid, auto-advance to next UNPAID part (skipping already-paid parts)
      if (!willBeFullyPaid) {
        let nextUnpaidIndex = -1
        for (let step = 1; step < splits.length; step++) {
          const checkIdx = (safePartIndex + step) % splits.length
          if (!paidStatus[checkIdx]) {
            nextUnpaidIndex = checkIdx
            break
          }
        }
        if (nextUnpaidIndex !== -1) {
          setTimeout(() => {
            setActivePartIndex(nextUnpaidIndex)
          }, 300)
        }
      }
    } else {
      // Unmarking
      soundEffects?.pop(isMuted)
      onTogglePaid(safePartIndex, { silent: true })
    }
  }

  // Reset bill for next customer
  const handleNextCustomer = () => {
    soundEffects?.pop(isMuted)
    onResetBill()
    setShowSettledReview(false)
    setActiveView('keypad')
    setActivePartIndex(0)
  }

  const numAmount = Number(amount) || 0

  return (
    <div className="space-y-4">
      {/* Dukaan Header Bar */}
      <div className="rounded-2xl border border-slate-200 bg-white p-3.5 shadow-sm flex items-center justify-between gap-3">
        {/* Store Profile Identity Chip */}
        <button
          type="button"
          onClick={() => {
            soundEffects?.pop(isMuted)
            onOpenStoreSetup()
          }}
          className="flex items-center gap-2.5 text-left group hover:opacity-90 transition active:scale-98"
          title="Click to edit Store Name or UPI ID"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-[#002970] border border-sky-100">
            <Store className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-bold text-[#002970] truncate max-w-[160px] sm:max-w-[220px]">
                {storeProfile?.storeName || (isHindi ? 'मेरी दुकान' : 'My Dukaan')}
              </span>
              <Edit3 className="h-3 w-3 text-slate-400 group-hover:text-[#00BAF2]" />
            </div>
            <p className="text-[11px] font-mono text-emerald-700 truncate max-w-[170px] sm:max-w-[240px]">
              {storeProfile?.isConfigured && storeProfile?.upiId
                ? storeProfile.upiId
                : isHindi
                ? 'UPI ID सेट करें (टैप करें)'
                : 'Tap to set Store UPI ID'}
            </p>
          </div>
        </button>

        {/* Quick Utilities: Soundbox & Language */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Soundbox Voice Chime Indicator */}
          <button
            type="button"
            onClick={onToggleSound}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl border text-xs font-semibold transition active:scale-95 ${
              isMuted
                ? 'border-slate-200 bg-slate-50 text-slate-400'
                : 'border-emerald-300 bg-emerald-50 text-emerald-700 shadow-sm'
            }`}
            title={isMuted ? 'Turn Soundbox Audio ON' : 'Mute Soundbox Audio'}
          >
            {isMuted ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5 text-emerald-600" />}
            <span className="hidden sm:inline">{isMuted ? 'Muted' : 'Soundbox'}</span>
          </button>

          {/* Hindi / English Language Toggle */}
          <button
            type="button"
            onClick={() => {
              soundEffects?.pop(isMuted)
              setDukaanLang(isHindi ? 'en' : 'hi')
            }}
            className="flex items-center gap-1 px-2 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-700 hover:bg-slate-100 active:scale-95 transition"
            title="Switch Language (English / हिंदी)"
          >
            <Languages className="h-3.5 w-3.5 text-[#00BAF2]" />
            <span>{isHindi ? 'हिंदी' : 'EN'}</span>
          </button>

          {/* Switch to Detailed Mode */}
          <button
            type="button"
            onClick={() => {
              soundEffects?.pop(isMuted)
              onSwitchToDetailed()
            }}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-medium text-slate-700 hover:bg-slate-100 active:scale-95 transition"
            title="Switch to Detailed Consumer Mode"
          >
            <SlidersHorizontal className="h-3.5 w-3.5 text-slate-500" />
            <span className="hidden sm:inline">Detailed</span>
          </button>
        </div>
      </div>

      {/* Setup Warning Banner if store not configured or UPI ID invalid */}
      {(!storeProfile?.isConfigured || !storeProfile?.upiId || !isValidUpiId(storeProfile.upiId)) && (
        <div
          onClick={() => {
            soundEffects?.pop(isMuted)
            onOpenStoreSetup()
          }}
          className="cursor-pointer rounded-2xl border border-amber-300 bg-amber-50 p-3.5 flex items-center justify-between transition hover:bg-amber-100/70 active:scale-98"
        >
          <div className="flex items-center gap-2.5">
            <div className="rounded-xl bg-amber-100 p-2 text-amber-700">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-amber-900">
                {isHindi ? 'दुकान का UPI ID सेट करें (Save Once)' : 'Set Up Your Dukaan UPI ID Once'}
              </p>
              <p className="text-[11px] text-amber-800">
                {isHindi
                  ? 'कस्टमर के पेमेंट आपके बैंक खाते में आने के लिए अपना UPI ID सेट करें'
                  : 'Customer payments will directly deposit to this UPI ID'}
              </p>
            </div>
          </div>
          <span className="text-xs font-bold text-amber-900 bg-amber-200/80 px-2.5 py-1 rounded-lg">
            {isHindi ? 'सेट करें' : 'Setup Now'}
          </span>
        </div>
      )}

      {/* VIEW 1: Rapid Checkout Keypad */}
      {activeView === 'keypad' && (
        <div className="space-y-4">
          {/* Main Amount Card */}
          <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm text-center space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-500 font-bold uppercase tracking-wider">
              <span>{isHindi ? 'ग्राहक बिल राशि' : 'Customer Bill Amount'}</span>
              {numAmount >= 2000 && (
                <span className="text-[#00AF71] flex items-center gap-1 font-bold">
                  <Zap className="h-3.5 w-3.5" />
                  <span>{isHindi ? 'ऑटो-स्प्लिट (≤ ₹1,999)' : 'Auto-Splits (≤ ₹1,999)'}</span>
                </span>
              )}
            </div>

            {/* Glowing Big Amount Display with Direct Input Option and Quick Clear */}
            <div className="relative flex items-center justify-center py-2">
              <span className="text-3xl sm:text-4xl font-extrabold text-[#00BAF2] mr-2">₹</span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0"
                className="w-full max-w-xs text-center text-4xl sm:text-5xl font-extrabold text-[#002970] bg-transparent border-b-2 border-slate-200 pb-1 focus:border-[#00BAF2] focus:outline-none placeholder-slate-300"
              />
              {amount && (
                <button
                  type="button"
                  onClick={() => {
                    soundEffects?.pop(isMuted)
                    setAmount('')
                  }}
                  className="ml-2 rounded-full p-2 bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition active:scale-90"
                  title="Clear amount"
                  aria-label="Clear amount"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Split Information Pill */}
            {numAmount > 0 && (
              <div className="inline-flex items-center gap-1.5 rounded-full bg-sky-50 border border-sky-200 px-3.5 py-1.5 text-xs text-[#002970] font-medium">
                <CheckCircle2 className="h-3.5 w-3.5 text-[#00AF71]" />
                <span>
                  {splits.length === 1
                    ? isHindi
                      ? `${formatINR(numAmount)} का 1 भुगतान (0% MDR टैक्स)`
                      : `Single ${formatINR(numAmount)} Payment (Zero MDR Fee)`
                    : isHindi
                    ? `${splits.length} आसान किस्तों में (< ₹2,000 प्रत्येक) • 0% MDR टैक्स`
                    : `Splits into ${splits.length} parts (< ₹2,000 each) • 0% MDR Fee`}
                </span>
              </div>
            )}

            {/* Quick Increment Chips */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => handleAddAmount(100)}
                className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 active:scale-95 transition"
              >
                +₹100
              </button>
              <button
                type="button"
                onClick={() => handleAddAmount(500)}
                className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 active:scale-95 transition"
              >
                +₹500
              </button>
              <button
                type="button"
                onClick={() => handleAddAmount(1000)}
                className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 active:scale-95 transition"
              >
                +₹1,000
              </button>
              <button
                type="button"
                onClick={() => handleSetAmount(2500)}
                className="rounded-xl border border-sky-200 bg-sky-50 px-3 py-1.5 text-xs font-semibold text-[#002970] hover:bg-sky-100 active:scale-95 transition"
              >
                ₹2,500
              </button>
              <button
                type="button"
                onClick={() => handleSetAmount(3500)}
                className="rounded-xl border border-sky-200 bg-sky-50 px-3 py-1.5 text-xs font-semibold text-[#002970] hover:bg-sky-100 active:scale-95 transition"
              >
                ₹3,500
              </button>
              <button
                type="button"
                onClick={() => handleSetAmount(5000)}
                className="rounded-xl border border-sky-200 bg-sky-50 px-3 py-1.5 text-xs font-semibold text-[#002970] hover:bg-sky-100 active:scale-95 transition"
              >
                ₹5,000
              </button>
            </div>

            {/* Tactile On-Screen Numeric Keypad for Counter Checkout */}
            <div className="grid grid-cols-12 gap-2 max-w-sm mx-auto pt-2">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
                <button
                  key={digit}
                  type="button"
                  onClick={() => handleKeypadPress(digit)}
                  className="col-span-4 flex items-center justify-center rounded-2xl py-3 text-xl font-bold border border-slate-200 bg-slate-50 text-[#002970] hover:bg-slate-100 active:scale-90 transition select-none shadow-sm"
                >
                  {digit}
                </button>
              ))}

              {/* Bottom Function Row */}
              <button
                type="button"
                onClick={() => handleKeypadPress('C')}
                className="col-span-3 flex items-center justify-center rounded-2xl py-3 text-sm font-black border border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100 active:scale-90 transition select-none shadow-sm"
                title="Clear All"
              >
                C
              </button>
              <button
                type="button"
                onClick={() => handleKeypadPress('0')}
                className="col-span-3 flex items-center justify-center rounded-2xl py-3 text-xl font-bold border border-slate-200 bg-slate-50 text-[#002970] hover:bg-slate-100 active:scale-90 transition select-none shadow-sm"
              >
                0
              </button>
              <button
                type="button"
                onClick={() => handleKeypadPress('00')}
                className="col-span-3 flex items-center justify-center rounded-2xl py-3 text-base font-bold border border-slate-200 bg-slate-50 text-[#002970] hover:bg-slate-100 active:scale-90 transition select-none shadow-sm"
                title="Add 00"
              >
                00
              </button>
              <button
                type="button"
                onClick={() => handleKeypadPress('backspace')}
                className="col-span-3 flex items-center justify-center rounded-2xl py-3 text-xl font-bold border border-slate-200 bg-slate-50 text-amber-600 hover:bg-slate-100 active:scale-90 transition select-none shadow-sm"
                title="Delete last digit"
                aria-label="Backspace"
              >
                <Delete className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* ONE BIG ACTION BUTTON: "Split & Show QR" */}
          <button
            type="button"
            disabled={numAmount <= 0}
            onClick={handleStartSplitAndShowQr}
            className={`w-full flex items-center justify-between rounded-3xl p-4 sm:p-5 text-white shadow-xl transition-all duration-300 active:scale-98 ${
              numAmount > 0
                ? 'bg-[#00BAF2] hover:bg-[#009ecf] shadow-cyan-500/25 cursor-pointer ring-1 ring-cyan-300'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-black/15 text-white">
                <QrCode className="h-6 w-6" />
              </div>
              <div className="text-left">
                <h3 className="text-base sm:text-lg font-extrabold tracking-tight">
                  {isHindi ? 'स्प्लिट करें और QR दिखाएं' : 'Split & Show Customer QR'}
                </h3>
                <p className="text-xs text-white/90">
                  {numAmount > 0
                    ? splits.length === 1
                      ? isHindi
                        ? `${formatINR(numAmount)} का 1 भाग (0% MDR टैक्स)`
                        : `${formatINR(numAmount)} in 1 part (Zero MDR Fee)`
                      : isHindi
                      ? `${formatINR(numAmount)} को ${splits.length} भागों में (प्रत्येक ≤ ₹1,999)`
                      : `${formatINR(numAmount)} in ${splits.length} parts (≤ ₹1,999 each)`
                    : isHindi
                    ? 'कृपया राशि दर्ज करें'
                    : 'Enter bill amount above'}
                </p>
              </div>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-white">
              <ArrowRight className="h-5 w-5" />
            </div>
          </button>
        </div>
      )}

      {/* VIEW 2: Customer Counter Display */}
      {activeView === 'counter' && (
        <div className="space-y-4 animate-fadeIn">
          {/* Navigation Bar back to Keypad */}
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => {
                soundEffects?.pop(isMuted)
                setActiveView('keypad')
              }}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 active:scale-95 transition shadow-sm"
            >
              <ArrowLeft className="h-4 w-4 text-[#002970]" />
              <span>{isHindi ? 'कीपैड पर लौटें' : 'Back to Keypad'}</span>
            </button>

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500">
                {isHindi ? 'कुल बिल:' : 'Total Bill:'}{' '}
                <strong className="text-[#002970] font-mono">{formatINR(amount)}</strong>
              </span>

              <button
                type="button"
                onClick={handleNextCustomer}
                className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 active:scale-95 transition shadow-sm"
                title="Reset Bill for Next Customer"
              >
                <RotateCcw className="h-3.5 w-3.5 text-slate-400" />
                <span>{isHindi ? 'नया बिल' : 'Reset'}</span>
              </button>
            </div>
          </div>

          {/* Multi-Part Step Tabs */}
          {splits.length > 1 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar sm:grid sm:grid-cols-4">
              {splits.map((part, idx) => {
                const isPaid = paidStatus[idx]
                const isCurrent = safePartIndex === idx
                return (
                  <button
                    key={part.partNumber}
                    type="button"
                    onClick={() => {
                      soundEffects?.pop(isMuted)
                      setActivePartIndex(idx)
                    }}
                    className={`shrink-0 min-w-[110px] sm:min-w-0 flex-1 rounded-2xl border p-2.5 text-center transition active:scale-95 ${
                      isPaid
                        ? 'border-emerald-300 bg-emerald-50 text-emerald-800'
                        : isCurrent
                        ? 'border-[#00BAF2] bg-sky-50 ring-2 ring-[#00BAF2]/30 shadow-sm text-[#002970]'
                        : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] font-bold">
                      <span>
                        {isHindi ? `भाग ${part.partNumber}` : `Part ${part.partNumber}`}
                      </span>
                      {isPaid ? (
                        <CheckCircle2 className="h-3.5 w-3.5 text-[#00AF71]" />
                      ) : (
                        <Clock className="h-3.5 w-3.5 text-amber-500" />
                      )}
                    </div>
                    <div className="text-xs font-extrabold font-mono mt-0.5">
                      {formatINR(part.amount)}
                    </div>
                  </button>
                )
              })}
            </div>
          )}

          {/* If All Parts are Fully Paid -> Celebratory Card */}
          {isFullyPaid && (
            <div className="rounded-3xl border border-emerald-200 bg-emerald-50/70 p-6 sm:p-8 text-center shadow-sm space-y-5 animate-fadeIn">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-[#00AF71] border-2 border-emerald-300 shadow-sm">
                <CheckCircle2 className="h-10 w-10" />
              </div>

              <div>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800 border border-emerald-300 mb-2">
                  <PartyPopper className="h-3.5 w-3.5 text-[#00AF71]" />
                  <span>{isHindi ? 'भुगतान सफल' : 'Payment Complete'}</span>
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-[#002970]">
                  {isHindi ? 'पूरा भुगतान प्राप्त हुआ!' : 'All Payments Received!'}
                </h3>
                <p className="text-sm text-slate-600 mt-1">
                  {formatINR(amount)}{' '}
                  {splits.length === 1
                    ? isHindi
                      ? 'का पूरा भुगतान प्राप्त हो गया है।'
                      : 'has been settled in full.'
                    : isHindi
                    ? `का भुगतान ${splits.length} भागों में पूरा हो गया है।`
                    : `has been settled in full across ${splits.length} parts.`}
                </p>
              </div>

              {/* Breakdown Pill */}
              <div className="rounded-2xl border border-slate-200 bg-white p-3.5 text-xs text-slate-700 space-y-1.5 shadow-sm">
                {splits.map((p) => (
                  <div key={p.partNumber} className="flex justify-between items-center font-mono">
                    <span className="text-slate-500">
                      Part {p.partNumber} ({formatINR(p.amount)}):
                    </span>
                    <span className="text-[#00AF71] font-bold flex items-center gap-1">
                      <Check className="h-3 w-3" /> Received
                    </span>
                  </div>
                ))}
              </div>

              {/* 1-Tap Next Customer CTA */}
              <div className="space-y-2.5 pt-2">
                <button
                  type="button"
                  onClick={handleNextCustomer}
                  className="w-full flex items-center justify-center gap-2 rounded-2xl bg-[#00AF71] hover:bg-[#009a63] py-4 text-base font-bold text-white shadow-lg shadow-emerald-500/25 active:scale-95 transition"
                >
                  <RotateCcw className="h-5 w-5" />
                  <span>{isHindi ? 'नया बिल / अगला ग्राहक' : 'New Bill (Next Customer)'}</span>
                </button>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      soundEffects?.pop(isMuted)
                      setShowSettledReview(!showSettledReview)
                    }}
                    className="flex-1 flex items-center justify-center gap-1.5 rounded-2xl border border-slate-200 bg-white py-3 text-xs font-semibold text-slate-700 hover:bg-slate-50 active:scale-95 transition shadow-sm"
                  >
                    <Eye className="h-4 w-4 text-[#00BAF2]" />
                    <span>
                      {showSettledReview
                        ? isHindi
                          ? 'समीक्षा बंद करें'
                          : 'Hide Review'
                        : isHindi
                        ? 'QR कोड देखें'
                        : 'Review QRs'}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      soundEffects?.pop(isMuted)
                      onOpenReceipt()
                    }}
                    className="flex-1 flex items-center justify-center gap-1.5 rounded-2xl border border-slate-200 bg-white py-3 text-xs font-semibold text-slate-700 hover:bg-slate-50 active:scale-95 transition shadow-sm"
                  >
                    <Receipt className="h-4 w-4 text-[#00BAF2]" />
                    <span>{isHindi ? 'रसीद देखें' : 'Receipt'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ACTIVE QR CODE CARD FOR CUSTOMER */}
          {(!isFullyPaid || showSettledReview) && currentPart && (
            <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-7 shadow-sm text-center space-y-4">
              {/* Step Banner */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#002970] text-white text-xs font-black">
                    {currentPart.partNumber}
                  </div>
                  <div className="text-left">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-[#002970] block">
                      {isHindi
                        ? `कदम ${currentPart.partNumber} / ${splits.length}`
                        : `Step ${currentPart.partNumber} of ${splits.length}`}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      {isHindi ? 'कस्टमर से कहें स्कैन करें' : 'Customer Scan & Pay'}
                    </span>
                  </div>
                </div>

                <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                  {formatINR(currentPart.amount)}
                </span>
              </div>

              {/* Big Scannable QR Code Canvas with High Contrast */}
              <div className="rounded-3xl bg-white p-4 shadow-md inline-block border-2 border-slate-200">
                {qrUrlToDisplay ? (
                  <img
                    src={qrUrlToDisplay}
                    alt={`Scan to Pay Part ${currentPart.partNumber}`}
                    className="h-64 w-64 sm:h-72 sm:w-72 object-contain rounded-xl"
                  />
                ) : (
                  <div className="h-64 w-64 flex items-center justify-center text-slate-400 text-xs">
                    Generating QR...
                  </div>
                )}
              </div>

              {/* Amount Callout Below QR */}
              <div>
                <div className="text-3xl font-black tracking-tight text-[#002970] font-mono">
                  {formatINR(currentPart.amount)}
                </div>
                <p className="text-xs text-slate-500 font-mono mt-0.5">
                  {storeProfile?.storeName} • {storeProfile?.upiId}
                </p>
              </div>

              {/* Supported UPI Apps Bar */}
              <div className="flex items-center justify-center gap-3 pt-1 border-t border-slate-100">
                <span className="text-[11px] text-slate-500">
                  {isHindi ? 'किसी भी UPI से:' : 'Pay using:'}
                </span>
                <div className="flex items-center gap-2">
                  <GPayIcon className="h-4 w-4" />
                  <PhonePeIcon className="h-4 w-4" />
                  <PaytmIcon className="h-4 w-4" />
                  <BhimIcon className="h-4 w-4" />
                </div>
              </div>

              {/* BIG SHOPKEEPER CONFIRMATION BUTTON WITH SOUNDBOX VOICE */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleMarkCurrentPaid}
                  className={`w-full flex items-center justify-center gap-2.5 rounded-2xl py-4 px-4 text-base font-extrabold shadow-lg transition-all duration-200 active:scale-95 ${
                    paidStatus[safePartIndex]
                      ? 'bg-emerald-50 border border-emerald-300 text-emerald-800'
                      : 'bg-[#00AF71] hover:bg-[#009a63] text-white shadow-emerald-500/25 ring-1 ring-emerald-400/40'
                  }`}
                >
                  <CheckCircle2 className="h-6 w-6 shrink-0" />
                  <span>
                    {paidStatus[safePartIndex]
                      ? isHindi
                        ? `भाग ${currentPart.partNumber} प्राप्त हो गया (Tap to Undo)`
                        : `Part ${currentPart.partNumber} Marked Paid (Tap to Undo)`
                      : isHindi
                      ? `भाग ${currentPart.partNumber} प्राप्त हुआ (${formatINR(currentPart.amount)})`
                      : `Payment ${currentPart.partNumber} Received (${formatINR(currentPart.amount)})`}
                  </span>
                </button>
                <p className="text-[11px] text-slate-500 mt-1.5 flex items-center justify-center gap-1">
                  <Volume2 className="h-3 w-3 text-[#00AF71]" />
                  <span>
                    {isHindi
                      ? 'टैप करने पर साउंडबॉक्स बोलकर बताएगा'
                      : 'Soundbox chime & voice confirmation triggers on tap'}
                  </span>
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
