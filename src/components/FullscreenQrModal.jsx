import React from 'react'
import { X, Download, QrCode, Smartphone, ShieldCheck } from 'lucide-react'
import { formatINR } from '../utils/upi'

export default function FullscreenQrModal({ isOpen, onClose, qrDataUrl, part, upiId }) {
  if (!isOpen || !qrDataUrl) return null

  const handleDownload = () => {
    const link = document.createElement('a')
    link.href = qrDataUrl
    link.download = `tukdapay-part-${part?.partNumber || 1}-qr.png`
    link.click()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fadeIn">
      <div 
        className="relative w-full max-w-sm rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 rounded-full bg-slate-100 p-2 text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition active:scale-95"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Title / Badge */}
        <div className="inline-flex items-center gap-1.5 rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-[#002970] border border-sky-200 mb-3">
          <QrCode className="h-3.5 w-3.5 text-[#00BAF2]" />
          <span>Payment {part?.partNumber} of {part?.totalParts}</span>
        </div>

        <h3 className="text-3xl font-extrabold text-[#002970]">
          {formatINR(part?.amount || 0)}
        </h3>

        <div className="mt-1 flex items-center justify-center gap-1.5 text-xs text-slate-500 font-mono">
          <ShieldCheck className="h-3.5 w-3.5 text-[#00AF71]" />
          <span className="truncate max-w-[200px]">{upiId}</span>
        </div>

        {/* White QR Box for Best Contrast & Rapid Camera Scanning */}
        <div className="mt-5 rounded-2xl bg-white p-4 shadow-md inline-block border-2 border-slate-200">
          <img
            src={qrDataUrl}
            alt="Scan QR"
            className="h-64 w-64 object-contain rounded-lg"
          />
        </div>

        <p className="mt-3 text-xs text-slate-500 flex items-center justify-center gap-1.5">
          <Smartphone className="h-3.5 w-3.5 text-slate-400" />
          <span>Scan with Google Pay, PhonePe, Paytm, or BHIM</span>
        </p>

        {/* Action Button */}
        <div className="mt-5 flex gap-2">
          <button
            onClick={handleDownload}
            className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-slate-100 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-200 transition active:scale-95"
          >
            <Download className="h-4 w-4" />
            <span>Save to Photos</span>
          </button>
          
          <button
            onClick={onClose}
            className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-[#002970] py-2.5 text-xs font-bold text-white shadow-md hover:bg-[#001f57] transition active:scale-95"
          >
            <span>Done</span>
          </button>
        </div>
      </div>
    </div>
  )
}
