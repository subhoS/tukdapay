import React, { useState } from 'react'
import { X, Store, Check, Volume2, ShieldCheck, Building2 } from 'lucide-react'
import { isValidUpiId, POPULAR_UPI_HANDLES } from '../utils/upi'

export default function StoreSetupModal({
  isOpen,
  onClose,
  currentStoreName,
  currentUpiId,
  onSave,
  onTestSoundbox,
}) {
  const [storeName, setStoreName] = useState(currentStoreName || '')
  const [upiId, setUpiId] = useState(currentUpiId || '')
  const [error, setError] = useState('')

  if (!isOpen) return null

  const handleHandleClick = (handle) => {
    if (!upiId) {
      setUpiId(`merchant${handle}`)
    } else if (upiId.includes('@')) {
      const prefix = upiId.split('@')[0]
      setUpiId(`${prefix}${handle}`)
    } else {
      setUpiId(`${upiId}${handle}`)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const trimmedUpi = upiId.trim()
    const trimmedName = storeName.trim() || 'My Dukaan'

    if (!trimmedUpi) {
      setError('Please enter your store UPI ID')
      return
    }

    if (!isValidUpiId(trimmedUpi)) {
      setError('Please enter a valid UPI ID (e.g. store@oksbi or phone@paytm)')
      return
    }

    onSave({ storeName: trimmedName, upiId: trimmedUpi })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fadeIn">
      <div
        className="relative w-full max-w-md rounded-3xl border border-white/15 bg-[#121826] p-6 shadow-2xl text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="rounded-2xl bg-emerald-500/10 p-2.5 text-emerald-400 border border-emerald-500/20">
              <Store className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Dukaan UPI Setup</h3>
              <p className="text-xs text-gray-400">Save once, never re-type during checkout</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-white/10 hover:text-white transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* Store Name Input */}
          <div>
            <label className="text-xs font-semibold text-gray-300 block mb-1.5 flex items-center gap-1.5">
              <Building2 className="h-3.5 w-3.5 text-emerald-400" />
              <span>Shop / Business Name</span>
            </label>
            <input
              type="text"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              placeholder="e.g. Verma General Store"
              className="w-full rounded-xl border border-white/10 bg-black/40 py-2.5 px-3.5 text-sm text-white placeholder-gray-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          {/* Store UPI ID Input */}
          <div>
            <label className="text-xs font-semibold text-gray-300 block mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                <span>Shop UPI ID (Receiving VPA)</span>
              </span>
              {upiId && (
                <span
                  className={`text-[11px] font-medium ${
                    isValidUpiId(upiId) ? 'text-emerald-400' : 'text-amber-400'
                  }`}
                >
                  {isValidUpiId(upiId) ? 'Valid UPI ID' : 'Check format'}
                </span>
              )}
            </label>
            <input
              type="text"
              value={upiId}
              onChange={(e) => {
                setUpiId(e.target.value)
                setError('')
              }}
              placeholder="e.g. store@okhdfcbank or 9876543210@paytm"
              className="w-full rounded-xl border border-white/10 bg-black/40 py-2.5 px-3.5 text-sm text-white font-mono placeholder-gray-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />

            {/* Bank Handle Chips */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              <span className="text-[11px] text-gray-400 py-0.5">Quick handle:</span>
              {POPULAR_UPI_HANDLES.slice(0, 6).map((handle) => (
                <button
                  key={handle}
                  type="button"
                  onClick={() => handleHandleClick(handle)}
                  className="rounded-md bg-white/5 px-2 py-0.5 text-[11px] font-mono text-emerald-300 hover:bg-white/10 active:scale-95 transition"
                >
                  {handle}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <p className="text-xs text-rose-400 font-medium bg-rose-500/10 border border-rose-500/20 rounded-xl p-2.5">
              {error}
            </p>
          )}

          {/* Soundbox Test Button */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-emerald-500/20 p-1.5 text-emerald-400">
                <Volume2 className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs font-semibold text-white">Audio Soundbox</p>
                <p className="text-[11px] text-gray-400">Payment voice & chime feedback</p>
              </div>
            </div>
            <button
              type="button"
              onClick={onTestSoundbox}
              className="rounded-lg border border-emerald-500/30 bg-emerald-500/15 px-2.5 py-1.5 text-xs font-medium text-emerald-300 hover:bg-emerald-500/25 active:scale-95 transition"
            >
              Test Sound
            </button>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-white/10 bg-white/5 py-2.5 text-xs font-semibold text-gray-300 hover:bg-white/10 transition active:scale-95"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 py-2.5 text-xs font-bold text-white shadow-lg shadow-emerald-500/25 hover:opacity-95 transition active:scale-95"
            >
              <Check className="h-4 w-4" />
              <span>Save Dukaan Profile</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
