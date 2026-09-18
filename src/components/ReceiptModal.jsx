import React, { useState } from 'react'
import { X, Receipt, CheckCircle2, Clock, Copy, Check } from 'lucide-react'
import { formatINR } from '../utils/upi'

export default function ReceiptModal({
  isOpen,
  onClose,
  amount,
  splits,
  paidStatus,
  upiId,
  payeeName,
}) {
  const [copied, setCopied] = useState(false)

  if (!isOpen) return null

  const now = new Date()
  const dateString = now.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
  const timeString = now.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
  })

  const paidCount = paidStatus.filter(Boolean).length
  const totalPaid = splits
    .filter((_, idx) => paidStatus[idx])
    .reduce((sum, p) => sum + p.amount, 0)
  const isFullyPaid = splits.length > 0 && paidCount === splits.length

  const receiptText = `TukdaPay Digital Receipt
============================
Merchant: ${payeeName || 'Store'} (${upiId || 'N/A'})
Date: ${dateString}, ${timeString}
Total Amount: ${formatINR(amount)}
Status: ${isFullyPaid ? 'ALL PARTS PAID' : `${paidCount}/${splits.length} Parts Paid`}
----------------------------
${splits
  .map(
    (p, i) =>
      `Part ${p.partNumber}: ${formatINR(p.amount)} [${
        paidStatus[i] ? 'PAID' : 'PENDING'
      }]`
  )
  .join('\n')}
============================
Generated via TukdaPay (Zero Fee UPI Splitter)`

  const handleCopy = () => {
    navigator.clipboard.writeText(receiptText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div
        className="relative w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="rounded-xl bg-sky-50 p-2 text-[#002970] border border-sky-100">
              <Receipt className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#002970]">Digital Payment Receipt</h3>
              <p className="text-xs text-slate-500">{dateString} • {timeString}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Paper Receipt Card with Perforated Look */}
        <div className="mt-4 rounded-2xl border border-dashed border-slate-300 bg-slate-50/80 p-4 space-y-3 font-mono text-xs text-slate-800">
          {/* Merchant Info */}
          <div className="border-b border-slate-200 pb-3">
            <div className="flex justify-between items-center text-sm font-sans font-bold text-[#002970]">
              <span>{payeeName || 'Merchant Payment'}</span>
              <span className="text-[#00AF71] font-mono">{formatINR(amount)}</span>
            </div>
            <p className="text-slate-500 text-[11px] truncate mt-0.5">{upiId || 'Direct UPI Transfer'}</p>
          </div>

          {/* Breakdown Items */}
          <div className="space-y-2 py-1">
            {splits.map((p, idx) => (
              <div key={p.partNumber} className="flex items-center justify-between text-xs">
                <span className="text-slate-600">
                  Part {p.partNumber} of {splits.length}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-[#002970] font-bold">{formatINR(p.amount)}</span>
                  {paidStatus[idx] ? (
                    <span className="inline-flex items-center gap-0.5 rounded px-1.5 py-0.5 text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      <CheckCircle2 className="h-3 w-3 text-[#00AF71]" /> Paid
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-0.5 rounded px-1.5 py-0.5 text-[10px] font-semibold bg-amber-100 text-amber-800">
                      <Clock className="h-3 w-3 text-amber-600" /> Due
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Total & Summary */}
          <div className="border-t border-slate-200 pt-3 flex justify-between items-center text-xs font-sans">
            <span className="text-slate-500">Total Settled:</span>
            <span className="font-bold text-[#00AF71] font-mono">
              {formatINR(totalPaid)} / {formatINR(amount)}
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="mt-5 flex gap-2.5">
          <button
            onClick={handleCopy}
            className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition active:scale-95 shadow-sm"
          >
            {copied ? <Check className="h-4 w-4 text-[#00AF71]" /> : <Copy className="h-4 w-4" />}
            <span>{copied ? 'Receipt Copied!' : 'Copy Receipt'}</span>
          </button>

          <button
            onClick={onClose}
            className="flex-1 rounded-xl bg-[#002970] py-2.5 text-xs font-bold text-white shadow-md hover:bg-[#001f57] transition active:scale-95"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  )
}
