import React from 'react'
import { X, ShieldAlert, CheckCircle2, Info, Award } from 'lucide-react'

export default function PolicyModal({ isOpen, onClose }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div 
        className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl border border-white/10 bg-[#121826] p-6 shadow-2xl text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-amber-500/10 p-2.5 text-amber-400 border border-amber-500/20">
              <ShieldAlert className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">₹2,000 UPI Rule: Myth vs. Fact</h3>
              <p className="text-xs text-gray-400">Deep Regulatory Research & Official Guidelines</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 transition hover:bg-white/10 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="mt-4 space-y-4 text-sm text-gray-300">
          
          {/* Quick Truth Card */}
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4">
            <div className="flex items-center gap-2 font-semibold text-emerald-400 text-base">
              <CheckCircle2 className="h-5 w-5 shrink-0" />
              <span>The Bottom Line: Zero Tax on UPI</span>
            </div>
            <p className="mt-1.5 text-xs text-emerald-200/90 leading-relaxed">
              The Indian Government and NPCI have explicitly confirmed: <strong>There is NO tax or surcharge on consumers paying via UPI.</strong> Bank-to-bank UPI transfers remain 100% free regardless of the amount.
            </p>
          </div>

          {/* Breakdown Table */}
          <div className="rounded-xl border border-white/10 bg-black/30 p-4 space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400">What Actually Changed?</h4>
            
            <div className="space-y-2 text-xs">
              <div className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">1.</span>
                <div>
                  <strong className="text-white">0.4% MDR on Merchant Payments:</strong> NPCI introduced a Merchant Discount Rate of 0.4% for select Person-to-Merchant (P2M) transactions exceeding ₹2,000 (capped at ₹300 for ₹75,000+). <em>This is paid by the merchant, never the customer.</em>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">2.</span>
                <div>
                  <strong className="text-white">1.1% Wallet (PPI) Interchange:</strong> Payments made using Prepaid Wallets (Paytm Wallet, PhonePe Wallet, Sodexo) to merchants above ₹2,000 attract an interchange fee paid by the merchant to wallet providers.
                </div>
              </div>

              <div className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">3.</span>
                <div>
                  <strong className="text-white">Small Merchants are Exempt:</strong> Street vendors, neighborhood kirana shops, and small businesses registered under P2PM categories pay <strong>₹0 fee</strong>, even above ₹2,000.
                </div>
              </div>

              <div className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">4.</span>
                <div>
                  <strong className="text-white">The Exact ₹2,000 Cutoff Boundary:</strong> Transactions of ₹2,000 and above are subject to MDR/interchange fees. Transactions of <strong>₹1,999 or less</strong> remain completely outside the framework. SplitPe optimizes splits so every part is strictly ≤ ₹1,999.
                </div>
              </div>
            </div>
          </div>

          {/* Why Split Payments? */}
          <div className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-2">
            <h4 className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-amber-300">
              <Info className="h-4 w-4" />
              <span>Why Use SplitPe? Practical Realities</span>
            </h4>
            <ul className="list-disc list-inside space-y-1.5 text-xs text-gray-300 leading-relaxed">
              <li><strong>Avoid Informal Merchant Surcharges:</strong> Some offline shopkeepers informally ask customers to pay in two parts to avoid MDR overhead.</li>
              <li><strong>UPI Lite & Low-Value Faster Clearing:</strong> Transactions under ₹2,000 utilize high-speed low-value bank routing tiers with near-zero failure rates during peak bank server downtime.</li>
              <li><strong>Fair Bill Sharing:</strong> Easily split dining, shopping, and shared group bills into 50/50 halves or multi-part QR codes.</li>
            </ul>
          </div>

          {/* Responsible Usage Notice */}
          <div className="rounded-xl border border-blue-500/20 bg-blue-500/10 p-3.5 flex items-start gap-2.5 text-xs text-blue-200">
            <Award className="h-4 w-4 shrink-0 text-blue-400 mt-0.5" />
            <p>
              <strong>Safe & Transparent:</strong> SplitPe is designed as a convenience utility for bill-splitting and dynamic QR generation. It does not alter your bank account's annual tax reporting (SFT). Use responsibly for personal and bill-sharing needs!
            </p>
          </div>

        </div>

        {/* Footer */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-xl bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-600 active:scale-95"
          >
            Understood & Got It
          </button>
        </div>
      </div>
    </div>
  )
}
