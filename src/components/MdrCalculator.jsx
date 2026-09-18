import React, { useState } from 'react'
import { Calculator, ChevronDown, ChevronUp } from 'lucide-react'
import { formatINR } from '../utils/upi'

export default function MdrCalculator({ amount, splitsCount }) {
  const [isOpen, setIsOpen] = useState(false)
  const numAmount = Number(amount) || 0

  // Calculate hypothetical MDR on single transaction
  // 0.4% MDR, capped at 300
  const singleMdr = Math.min(300, (numAmount * 0.004))
  // 1.1% Wallet interchange
  const walletInterchange = numAmount * 0.011

  // Split calculation
  const partAmount = splitsCount > 0 ? numAmount / splitsCount : numAmount
  const splitMdr = partAmount <= 1999 ? 0 : Math.min(300, partAmount * 0.004) * splitsCount
  const splitWallet = partAmount <= 1999 ? 0 : partAmount * 0.011 * splitsCount

  return (
    <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between p-4 text-left transition hover:bg-slate-50"
      >
        <div className="flex items-center gap-2.5">
          <div className="rounded-lg bg-sky-50 p-2 text-[#002970] border border-sky-100">
            <Calculator className="h-4 w-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-[#002970] flex items-center gap-1.5">
              <span>MDR & Merchant Fee Calculator</span>
              <span className="rounded bg-sky-100 px-1.5 py-0.5 text-[10px] text-[#002970] font-semibold">
                Live Stats
              </span>
            </div>
            <p className="text-[11px] text-slate-500">See why merchants ask for split payments</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-[#00AF71]">
            {numAmount >= 2000 ? `Saves merchant ${formatINR(singleMdr)}` : 'Zero Fee'}
          </span>
          {isOpen ? <ChevronUp className="h-4 w-4 text-slate-400" /> : <ChevronDown className="h-4 w-4 text-slate-400" />}
        </div>
      </button>

      {isOpen && (
        <div className="border-t border-slate-100 bg-slate-50/60 p-4 text-xs text-slate-600 space-y-3">
          <p className="text-slate-600 leading-relaxed">
            While <strong className="text-slate-800">you (the consumer) pay ₹0</strong> either way, here is what the merchant faces under NPCI regulations for a bill of <strong className="text-[#002970]">{formatINR(numAmount)}</strong>:
          </p>

          <div className="grid grid-cols-2 gap-3 pt-1">
            {/* Single Payment Column */}
            <div className="rounded-xl border border-rose-200 bg-rose-50/70 p-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700">
                Single Payment (≥ ₹2,000)
              </span>
              <div className="mt-2 space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">Consumer:</span>
                  <span className="text-[#00AF71] font-semibold">₹0 (Free)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">0.4% P2M MDR:</span>
                  <span className="text-rose-700 font-semibold">{formatINR(singleMdr)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">1.1% PPI Wallet:</span>
                  <span className="text-rose-700 font-semibold">{formatINR(walletInterchange)}</span>
                </div>
              </div>
            </div>

            {/* Split Payment Column */}
            <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                Split into {splitsCount} Parts (≤ ₹1,999 each)
              </span>
              <div className="mt-2 space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">Consumer:</span>
                  <span className="text-[#00AF71] font-semibold">₹0 (Free)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">0.4% P2M MDR:</span>
                  <span className="text-emerald-700 font-semibold">{formatINR(splitMdr)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">1.1% PPI Wallet:</span>
                  <span className="text-emerald-700 font-semibold">{formatINR(splitWallet)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="text-[11px] text-slate-500 bg-white border border-slate-200 rounded-lg p-2.5 shadow-sm">
            <strong className="text-slate-700">Note:</strong> Small Kirana merchants (P2PM) are 100% exempt from MDR regardless of amount.
          </div>
        </div>
      )}
    </div>
  )
}
