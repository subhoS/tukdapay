/**
 * UPI Protocol and Utility Helpers for TukdaPay
 */

/**
 * Standard NPCI UPI Intent URI Generator
 * @param {Object} params
 * @param {string} params.pa - Payee VPA / UPI ID (e.g. merchant@okhdfcbank)
 * @param {string} params.pn - Payee Name (e.g. Store)
 * @param {number|string} params.am - Amount in INR (e.g. 1750.00)
 * @param {string} params.tn - Transaction Note (e.g. Part 1 of 2)
 * @param {string} [params.cu='INR'] - Currency code
 * @returns {string} Standard UPI URI
 */
export function generateUpiUri({ pa, pn = 'Merchant', am, tn = 'TukdaPay Payment', cu = 'INR' }) {
  if (!pa) return ''
  const cleanPa = pa.trim()
  const cleanPn = (pn || 'Merchant').trim()
  const numAm = Number(am) || 0
  const formattedAm = numAm.toFixed(2)
  const cleanTn = (tn || 'TukdaPay Payment').trim()

  const params = new URLSearchParams()
  params.set('pa', cleanPa)
  params.set('pn', cleanPn)
  params.set('am', formattedAm)
  params.set('cu', cu)
  params.set('tn', cleanTn)

  return `upi://pay?${params.toString()}`
}

/**
 * Validates UPI Virtual Payment Address (VPA) format
 * Common formats: username@bank, 9876543210@paytm, name.surname@okhdfcbank
 */
export function isValidUpiId(upiId) {
  if (!upiId) return false
  const upiRegex = /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/
  return upiRegex.test(upiId.trim())
}

/**
 * Format Indian Rupee currency with commas
 */
export function formatINR(amount) {
  const num = Number(amount) || 0
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
    minimumFractionDigits: Number.isInteger(num) ? 0 : 2,
  }).format(num)
}

/**
 * Threshold Limit:
 * Transactions of ₹2,000 and above are subject to the MDR/interchange framework.
 * Transactions of ₹1,999 or less are guaranteed strictly zero-fee.
 */
export const SAFE_FEE_FREE_LIMIT = 1999

/**
 * Calculate optimal split breakdown
 * @param {number} totalAmount
 * @param {'smart'|'halves'|'custom'} mode
 * @param {number} [customParts=2]
 */
export function calculateSplits(totalAmount, mode = 'smart', customParts = 2) {
  const amount = Math.max(0, Number(totalAmount) || 0)
  if (amount <= 0) return []

  let partsCount = 2

  if (mode === 'smart') {
    if (amount <= SAFE_FEE_FREE_LIMIT) {
      partsCount = 1
    } else {
      // Find minimal N such that every part is strictly <= 1999.00
      partsCount = Math.ceil(amount / SAFE_FEE_FREE_LIMIT)
    }
  } else if (mode === 'halves') {
    partsCount = 2
  } else if (mode === 'custom') {
    partsCount = Math.max(2, Math.min(10, customParts))
  }

  const basePart = Math.floor((amount / partsCount) * 100) / 100
  const remainder = Math.round((amount - basePart * partsCount) * 100) / 100

  const parts = []
  for (let i = 0; i < partsCount; i++) {
    // Distribute remaining cents to the first part
    const partAmount = i === 0 ? Number((basePart + remainder).toFixed(2)) : basePart
    parts.push({
      partNumber: i + 1,
      totalParts: partsCount,
      amount: partAmount,
      isZeroFee: partAmount <= SAFE_FEE_FREE_LIMIT,
      isUnder2000: partAmount <= SAFE_FEE_FREE_LIMIT,
      note: `TukdaPay: Part ${i + 1} of ${partsCount}`,
    })
  }

  return parts
}

/**
 * Popular UPI Handle suggestions
 */
export const POPULAR_UPI_HANDLES = [
  '@okhdfcbank',
  '@oksbi',
  '@okaxis',
  '@okicici',
  '@paytm',
  '@ybl',
  '@ibl',
  '@upi',
  '@postbank',
]
