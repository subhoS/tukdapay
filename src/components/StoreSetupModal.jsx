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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div
        className="relative w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="rounded-2xl bg-sky-50 p-2.5 text-[#002970] border border-sky-100">
              <Store className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#002970]">Dukaan UPI Setup</h3>
              <p className="text-xs text-slate-500">Save once, never re-type during checkout</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* Store Name Input */}
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1.5 flex items-center gap-1.5">
              <Building2 className="h-3.5 w-3.5 text-[#00BAF2]" />
              <span>Shop / Business Name</span>
            </label>
            <input
              type="text"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              placeholder="e.g. Verma General Store"
              className="w-full rounded-xl border border-slate-300 bg-slate-50 py-2.5 px-3.5 text-sm text-slate-900 placeholder-slate-400 focus:border-[#00BAF2] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#00BAF2]"
            />
          </div>

          {/* Store UPI ID Input */}
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-[#00AF71]" />
                <span>Shop UPI ID (Receiving VPA)</span>
              </span>
              {upiId && (
                <span
                  className={`text-[11px] font-medium ${
                    isValidUpiId(upiId) ? 'text-[#00AF71]' : 'text-amber-600'
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
              className="w-full rounded-xl border border-slate-300 bg-slate-50 py-2.5 px-3.5 text-sm text-slate-900 font-mono placeholder-slate-400 focus:border-[#00BAF2] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#00BAF2]"
            />

            {/* Bank Handle Chips */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              <span className="text-[11px] text-slate-400 py-0.5">Quick handle:</span>
              {POPULAR_UPI_HANDLES.slice(0, 6).map((handle) => (
                <button
                  key={handle}
                  type="button"
                  onClick={() => handleHandleClick(handle)}
                  className="rounded-md bg-slate-100 border border-slate-200 px-2 py-0.5 text-[11px] font-mono text-[#002970] hover:bg-slate-200 active:scale-95 transition"
                >
                  {handle}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <p className="text-xs text-rose-600 font-medium bg-rose-50 border border-rose-200 rounded-xl p-2.5">
              {error}
            </p>
          )}

          {/* Soundbox Test Button */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-sky-100 p-1.5 text-[#002970]">
                <Volume2 className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs font-semibold text-[#002970]">Audio Soundbox</p>
                <p className="text-[11px] text-slate-500">Payment voice & chime feedback</p>
              </div>
            </div>
            <button
              type="button"
              onClick={onTestSoundbox}
              className="rounded-lg border border-sky-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-[#002970] hover:bg-sky-50 active:scale-95 transition shadow-sm"
            >
              Test Sound
            </button>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-slate-200 bg-white py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition active:scale-95 shadow-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-[#002970] py-2.5 text-xs font-bold text-white shadow-md hover:bg-[#001f57] transition active:scale-95"
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
