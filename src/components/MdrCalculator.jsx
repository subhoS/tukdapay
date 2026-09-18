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
  const splitMdr = partAmount <= 2000 ? 0 : Math.min(300, partAmount * 0.004) * splitsCount
  const splitWallet = partAmount <= 2000 ? 0 : partAmount * 0.011 * splitsCount

  return (
    <div className="rounded-2xl border border-white/10 bg-[#121826] overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between p-4 text-left transition hover:bg-white/5"
      >
        <div className="flex items-center gap-2.5">
          <div className="rounded-lg bg-emerald-500/10 p-2 text-emerald-400">
            <Calculator className="h-4 w-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-white flex items-center gap-1.5">
              <span>MDR & Merchant Fee Calculator</span>
              <span className="rounded bg-emerald-500/20 px-1.5 py-0.2 text-[10px] text-emerald-300">
                Live Stats
              </span>
            </div>
            <p className="text-[11px] text-gray-400">See why merchants ask for split payments</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-emerald-400">
            {numAmount > 2000 ? `Saves merchant ${formatINR(singleMdr)}` : 'Zero Fee'}
          </span>
          {isOpen ? <ChevronUp className="h-4 w-4 text-gray-400" /> : <ChevronDown className="h-4 w-4 text-gray-400" />}
        </div>
      </button>

      {isOpen && (
        <div className="border-t border-white/10 bg-black/30 p-4 text-xs text-gray-300 space-y-3">
          <p className="text-gray-400 leading-relaxed">
            While <strong>you (the consumer) pay ₹0</strong> either way, here is what the merchant faces under NPCI regulations for a bill of <strong>{formatINR(numAmount)}</strong>:
          </p>

          <div className="grid grid-cols-2 gap-3 pt-1">
            {/* Single Payment Column */}
            <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400">
                Single Payment (&gt; ₹2,000)
              </span>
              <div className="mt-2 space-y-1">
                <div className="flex justify-between">
                  <span className="text-gray-400">Consumer:</span>
                  <span className="text-emerald-400 font-semibold">₹0 (Free)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">0.4% P2M MDR:</span>
                  <span className="text-rose-300 font-semibold">{formatINR(singleMdr)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">1.1% PPI Wallet:</span>
                  <span className="text-rose-300 font-semibold">{formatINR(walletInterchange)}</span>
                </div>
              </div>
            </div>

            {/* Split Payment Column */}
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                Split into {splitsCount} Parts (&lt; ₹2k each)
              </span>
              <div className="mt-2 space-y-1">
                <div className="flex justify-between">
                  <span className="text-gray-400">Consumer:</span>
                  <span className="text-emerald-400 font-semibold">₹0 (Free)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">0.4% P2M MDR:</span>
                  <span className="text-emerald-300 font-semibold">{formatINR(splitMdr)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">1.1% PPI Wallet:</span>
                  <span className="text-emerald-300 font-semibold">{formatINR(splitWallet)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="text-[11px] text-gray-400 bg-white/5 rounded-lg p-2.5">
            <strong>Note:</strong> Small Kirana merchants (P2PM) are 100% exempt from MDR regardless of amount.
          </div>
        </div>
      )}
    </div>
  )
}
