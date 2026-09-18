import React, { useState, useEffect } from 'react'
import QRCode from 'qrcode'
import {
  QrCode,
  ExternalLink,
  Check,
  Copy,
  Clock,
  Download,
  Maximize2,
  Zap,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react'
import { generateUpiUri, formatINR } from '../utils/upi'
import { GPayIcon, PhonePeIcon, PaytmIcon, BhimIcon } from './PaymentLogos'

export default function SplitCard({
  part,
  index,
  totalParts,
  upiId,
  payeeName,
  isPaid,
  onTogglePaid,
  activeStep,
  onFullscreenQr,
  soundEffects,
  isMuted,
}) {
  const [showQR, setShowQR] = useState(false)
  const [copied, setCopied] = useState(false)
  const [qrDataUrl, setQrDataUrl] = useState('')

  const upiUri = generateUpiUri({
    pa: upiId,
    pn: payeeName || 'Merchant',
    am: part.amount,
    tn: part.note,
  })

  // Generate QR Code dynamically
  useEffect(() => {
    if (!upiUri) return
    QRCode.toDataURL(upiUri, {
      width: 320,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#ffffff',
      },
      errorCorrectionLevel: 'M',
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error('QR generation failed:', err))
  }, [upiUri])

  const handleCopy = () => {
    soundEffects?.pop(isMuted)
    navigator.clipboard.writeText(upiUri)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownloadQR = () => {
    soundEffects?.pop(isMuted)
    if (!qrDataUrl) return
    const link = document.createElement('a')
    link.href = qrDataUrl
    link.download = `tukdapay-part-${part.partNumber}-qr.png`
    link.click()
  }

  const handleToggle = () => {
    onTogglePaid(index)
  }

  const isCurrentActive = activeStep === index

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border transition-all duration-300 ${
        isPaid
          ? 'border-emerald-300 bg-emerald-50/50 shadow-sm'
          : isCurrentActive
          ? 'border-[#00BAF2] bg-white shadow-md ring-2 ring-[#00BAF2]/30'
          : 'border-slate-200 bg-white shadow-sm'
      }`}
    >
      {/* Top Banner / Indicator */}
      <div className="flex items-center justify-between border-b border-slate-100 px-4 py-2.5 sm:px-5">
        <div className="flex items-center gap-2">
          <div
            className={`flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-bold ${
              isPaid
                ? 'bg-[#00AF71] text-white'
                : isCurrentActive
                ? 'bg-[#00BAF2] text-white'
                : 'bg-slate-100 text-slate-600'
            }`}
          >
            {part.partNumber}
          </div>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Split Payment {part.partNumber} of {totalParts}
          </span>
        </div>

        {/* Status Badge */}
        {isPaid ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800 border border-emerald-300">
            <CheckCircle2 className="h-3.5 w-3.5 text-[#00AF71]" />
            Paid
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-800 border border-amber-200">
            <Clock className="h-3.5 w-3.5 text-amber-500" />
            Pending
          </span>
        )}
      </div>

      {/* Main Body */}
      <div className="p-4 sm:p-5">
        <div className="flex items-baseline justify-between">
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#002970]">
              {formatINR(part.amount)}
            </div>
            <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
              <span>Payee:</span>
              <span className="font-mono text-slate-700 font-semibold truncate max-w-[180px] sm:max-w-none">
                {upiId || 'Direct UPI'}
              </span>
            </div>
          </div>

          {/* Zero-fee safety badge: <= 1999 is strictly zero fee; >= 2000 is chargeable tier */}
          {part.amount <= 1999 ? (
            <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-800 border border-emerald-200">
              <Zap className="h-3 w-3 text-[#00AF71]" />
              <span>≤ ₹1,999 Zero-Fee</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 rounded-lg bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-800 border border-amber-200" title="Amounts of ₹2,000 and above are subject to MDR">
              <AlertCircle className="h-3 w-3 text-amber-500" />
              <span>≥ ₹2,000 Tier</span>
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-4 grid grid-cols-2 gap-2.5">
          {/* Pay Intent Button */}
          <a
            href={upiUri || '#'}
            onClick={() => soundEffects?.pop(isMuted)}
            className={`flex items-center justify-center gap-1.5 rounded-xl py-3 px-3 text-xs font-bold transition active:scale-95 ${
              isPaid
                ? 'bg-slate-100 text-slate-400 cursor-default opacity-60'
                : 'bg-[#00BAF2] hover:bg-[#009ecf] text-white shadow-md shadow-cyan-500/20'
            }`}
          >
            <span>Open UPI App</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </a>

          {/* QR Code Toggle */}
          <button
            onClick={() => {
              soundEffects?.pop(isMuted)
              setShowQR(!showQR)
            }}
            className={`flex items-center justify-center gap-1.5 rounded-xl border py-3 px-3 text-xs font-semibold transition active:scale-95 ${
              showQR
                ? 'border-[#00BAF2] bg-sky-50 text-[#002970]'
                : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <QrCode className="h-3.5 w-3.5 text-[#00BAF2]" />
            <span>{showQR ? 'Hide QR Code' : 'Scan QR Code'}</span>
          </button>
        </div>

        {/* App Compatibility Badges */}
        <div className="mt-3 flex items-center justify-center gap-3 pt-2 border-t border-slate-100 text-[11px] text-slate-400">
          <span className="text-[10px] uppercase font-semibold text-slate-400">Supported:</span>
          <div className="flex items-center gap-2">
            <span title="Google Pay"><GPayIcon className="h-4 w-4" /></span>
            <span title="PhonePe"><PhonePeIcon className="h-4 w-4" /></span>
            <span title="Paytm"><PaytmIcon className="h-4 w-4" /></span>
            <span title="BHIM"><BhimIcon className="h-4 w-4" /></span>
          </div>
        </div>

        {/* QR Code Expansion Panel */}
        {showQR && (
          <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50/80 p-4 text-center text-slate-800 shadow-inner animate-fadeIn">
            <div className="flex flex-col items-center justify-center">
              {qrDataUrl ? (
                <img
                  src={qrDataUrl}
                  alt={`UPI QR Part ${part.partNumber}`}
                  className="h-56 w-56 rounded-xl object-contain shadow-sm border border-slate-200 bg-white p-2"
                />
              ) : (
                <div className="flex h-56 w-56 items-center justify-center text-xs text-slate-400">
                  Generating dynamic QR...
                </div>
              )}

              <div className="mt-2.5 text-center">
                <p className="text-base font-extrabold text-[#002970]">{formatINR(part.amount)}</p>
                <p className="font-mono text-xs text-slate-600 truncate max-w-[240px]">{upiId}</p>
                <p className="text-[11px] text-slate-500 mt-0.5">Point any camera or UPI scanner here</p>
              </div>

              <div className="mt-3.5 flex flex-wrap justify-center gap-2">
                <button
                  onClick={() => onFullscreenQr?.(qrDataUrl, part)}
                  className="flex items-center gap-1.5 rounded-lg bg-[#002970] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#001f57] transition active:scale-95 shadow-sm"
                >
                  <Maximize2 className="h-3.5 w-3.5" />
                  <span>Fullscreen QR</span>
                </button>

                <button
                  onClick={handleDownloadQR}
                  className="flex items-center gap-1.5 rounded-lg bg-white border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition active:scale-95 shadow-sm"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Save QR</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Checkbox: Mark as Paid */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
          <button
            onClick={handleToggle}
            className={`flex items-center gap-2 text-xs font-medium transition active:scale-95 ${
              isPaid
                ? 'text-[#00AF71] font-bold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <div
              className={`flex h-4 w-4 items-center justify-center rounded border transition ${
                isPaid
                  ? 'border-[#00AF71] bg-[#00AF71] text-white'
                  : 'border-slate-300 bg-white'
              }`}
            >
              {isPaid && <Check className="h-3 w-3 stroke-[3]" />}
            </div>
            <span>{isPaid ? 'Payment Complete' : 'Mark as Completed'}</span>
          </button>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1 text-[11px] text-slate-500 hover:text-[#002970] transition"
            title="Copy UPI link"
          >
            {copied ? <Check className="h-3 w-3 text-[#00AF71]" /> : <Copy className="h-3 w-3" />}
            <span>{copied ? 'Copied' : 'Copy Link'}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
