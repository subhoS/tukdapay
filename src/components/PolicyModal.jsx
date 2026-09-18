import React from 'react'
import { X, ShieldAlert, CheckCircle2, Info, Award } from 'lucide-react'

export default function PolicyModal({ isOpen, onClose }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div 
        className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-amber-50 p-2.5 text-amber-600 border border-amber-200">
              <ShieldAlert className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#002970]">₹2,000 UPI Rule: Myth vs. Fact</h3>
              <p className="text-xs text-slate-500">Deep Regulatory Research & Official Guidelines</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="mt-4 space-y-4 text-sm text-slate-700">
          
          {/* Quick Truth Card */}
          <div className="rounded-xl border border-emerald-300 bg-emerald-50 p-4">
            <div className="flex items-center gap-2 font-bold text-emerald-900 text-base">
              <CheckCircle2 className="h-5 w-5 shrink-0 text-[#00AF71]" />
              <span>The Bottom Line: Zero Tax on UPI</span>
            </div>
            <p className="mt-1.5 text-xs text-emerald-900/90 leading-relaxed">
              The Indian Government and NPCI have explicitly confirmed: <strong>There is NO tax or surcharge on consumers paying via UPI.</strong> Bank-to-bank UPI transfers remain 100% free regardless of the amount.
            </p>
          </div>

          {/* Breakdown Table */}
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">What Actually Changed?</h4>
            
            <div className="space-y-2 text-xs">
              <div className="flex items-start gap-2">
                <span className="text-[#00AF71] font-bold">1.</span>
                <div>
                  <strong className="text-[#002970]">0.4% MDR on Merchant Payments:</strong> NPCI introduced a Merchant Discount Rate of 0.4% for select Person-to-Merchant (P2M) transactions exceeding ₹2,000 (capped at ₹300 for ₹75,000+). <em>This is paid by the merchant, never the customer.</em>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <span className="text-[#00AF71] font-bold">2.</span>
                <div>
                  <strong className="text-[#002970]">1.1% Wallet (PPI) Interchange:</strong> Payments made using Prepaid Wallets (Paytm Wallet, PhonePe Wallet, Sodexo) to merchants above ₹2,000 attract an interchange fee paid by the merchant to wallet providers.
                </div>
              </div>

              <div className="flex items-start gap-2">
                <span className="text-[#00AF71] font-bold">3.</span>
                <div>
                  <strong className="text-[#002970]">Small Merchants are Exempt:</strong> Street vendors, neighborhood kirana shops, and small businesses registered under P2PM categories pay <strong>₹0 fee</strong>, even above ₹2,000.
                </div>
              </div>

              <div className="flex items-start gap-2">
                <span className="text-[#00AF71] font-bold">4.</span>
                <div>
                  <strong className="text-[#002970]">The Exact ₹2,000 Cutoff Boundary:</strong> Transactions of ₹2,000 and above are subject to MDR/interchange fees. Transactions of <strong>₹1,999 or less</strong> remain completely outside the framework. TukdaPay optimizes splits so every part is strictly ≤ ₹1,999.
                </div>
              </div>
            </div>
          </div>

          {/* Why Split Payments? */}
          <div className="rounded-xl border border-sky-200 bg-sky-50/60 p-4 space-y-2">
            <h4 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#002970]">
              <Info className="h-4 w-4 text-[#00BAF2]" />
              <span>Why Use TukdaPay? Practical Realities</span>
            </h4>
            <ul className="list-disc list-inside space-y-1.5 text-xs text-slate-600 leading-relaxed">
              <li><strong>Avoid Informal Merchant Surcharges:</strong> Some offline shopkeepers informally ask customers to pay in two parts to avoid MDR overhead.</li>
              <li><strong>UPI Lite & Low-Value Faster Clearing:</strong> Transactions under ₹2,000 utilize high-speed low-value bank routing tiers with near-zero failure rates during peak bank server downtime.</li>
              <li><strong>Fair Bill Sharing:</strong> Easily split dining, shopping, and shared group bills into 50/50 halves or multi-part QR codes.</li>
            </ul>
          </div>

          {/* Responsible Usage Notice */}
          <div className="rounded-xl border border-blue-200 bg-blue-50 p-3.5 flex items-start gap-2.5 text-xs text-blue-900">
            <Award className="h-4 w-4 shrink-0 text-[#00BAF2] mt-0.5" />
            <p>
              <strong>Safe & Transparent:</strong> TukdaPay is designed as a convenience utility for bill-splitting and dynamic QR generation. It does not alter your bank account's annual tax reporting (SFT). Use responsibly for personal and bill-sharing needs!
            </p>
          </div>

        </div>

        {/* Footer */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-xl bg-[#002970] px-5 py-2.5 text-sm font-bold text-white shadow-md transition hover:bg-[#001f57] active:scale-95"
          >
            Understood & Got It
          </button>
        </div>
      </div>
    </div>
  )
}
