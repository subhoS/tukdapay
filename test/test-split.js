import assert from 'node:assert'
import { calculateSplits, isValidUpiId, generateUpiUri, formatINR } from '../src/utils/upi.js'
import { soundEffects } from '../src/utils/sound.js'

console.log('[TEST] Starting Split2K Unit Tests...')

// Test 1: Validation
assert.strictEqual(isValidUpiId('sharma@okhdfcbank'), true, 'Valid bank VPA should pass')
assert.strictEqual(isValidUpiId('9876543210@paytm'), true, 'Valid phone VPA should pass')
assert.strictEqual(isValidUpiId('test.user_123@ybl'), true, 'VPA with dots and underscores should pass')
assert.strictEqual(isValidUpiId('randomstring'), false, 'Invalid string without @ should fail')
assert.strictEqual(isValidUpiId('user@'), false, 'Incomplete VPA should fail')
assert.strictEqual(isValidUpiId(''), false, 'Empty VPA should fail')
console.log('[PASS] UPI Validation tests passed')

// Test 2: Smart Split logic (< 2000)
const split3500 = calculateSplits(3500, 'smart')
assert.strictEqual(split3500.length, 2, '3500 should be 2 parts')
assert.strictEqual(split3500[0].amount, 1750, 'Part 1 should be 1750')
assert.strictEqual(split3500[1].amount, 1750, 'Part 2 should be 1750')
assert(split3500[0].amount < 2000, 'Part 1 must be < 2000')
assert(split3500[1].amount < 2000, 'Part 2 must be < 2000')

const split5000 = calculateSplits(5000, 'smart')
assert.strictEqual(split5000.length, 3, '5000 should be 3 parts')
const sum5000 = split5000.reduce((s, p) => s + p.amount, 0)
assert.strictEqual(Number(sum5000.toFixed(2)), 5000, 'Sum of parts must match total exactly')
split5000.forEach(p => assert(p.amount < 2000, 'Every part must be < 2000'))

// Test 3: Edge cases (<= 2000, 0, decimals, large values)
const split1500 = calculateSplits(1500, 'smart')
assert.strictEqual(split1500.length, 1, '1500 should be 1 part')
assert.strictEqual(split1500[0].amount, 1500)

const split2000 = calculateSplits(2000, 'smart')
assert.strictEqual(split2000.length, 1, '2000 should be 1 part')

const split2001 = calculateSplits(2001, 'smart')
assert.strictEqual(split2001.length, 2, '2001 should auto-split into 2 parts')
assert(split2001[0].amount < 2000 && split2001[1].amount < 2000)

const splitZero = calculateSplits(0, 'smart')
assert.strictEqual(splitZero.length, 0, '0 amount should return empty array')

const splitNegative = calculateSplits(-500, 'smart')
assert.strictEqual(splitNegative.length, 0, 'Negative amount should return empty array')

const splitDecimal = calculateSplits(3500.50, 'smart')
assert.strictEqual(splitDecimal.length, 2)
const sumDecimal = splitDecimal.reduce((s, p) => s + p.amount, 0)
assert.strictEqual(Number(sumDecimal.toFixed(2)), 3500.50, 'Decimal amounts must sum accurately')
console.log('[PASS] Smart Split calculation & edge case tests passed')

// Test 4: Halves mode
const splitHalves = calculateSplits(2500, 'halves')
assert.strictEqual(splitHalves.length, 2)
assert.strictEqual(splitHalves[0].amount, 1250)
assert.strictEqual(splitHalves[1].amount, 1250)
console.log('[PASS] Halves split calculation tests passed')

// Test 5: URI generator
const uri = generateUpiUri({
  pa: 'shop@oksbi',
  pn: 'Sharma Store',
  am: 1750,
  tn: 'Part 1 of 2'
})
assert(uri.startsWith('upi://pay?'), 'URI must start with upi://pay?')
assert(uri.includes('pa=shop%40oksbi') || uri.includes('pa=shop@oksbi'), 'URI must include payee VPA')
assert(uri.includes('am=1750.00'), 'URI must include formatted amount')
assert(uri.includes('cu=INR'), 'URI must specify INR')
console.log('[PASS] UPI URI generation tests passed')

// Test 6: High Amount Split (< 2000 tier limit across counter)
const split100k = calculateSplits(100000, 'smart')
assert(split100k.length > 50, '100k bill should split into 51 parts under 2000')
const sum100k = split100k.reduce((s, p) => s + p.amount, 0)
assert.strictEqual(Math.round(sum100k * 100) / 100, 100000, 'Sum of 100k split parts must equal 100000 exactly')
split100k.forEach(p => assert(p.amount < 2000, 'Every part of 100k must be < 2000'))
console.log('[PASS] Large amount ₹1,00,000 split calculation tests passed')

// Test 7: Dukaan store profile configuration checks
const validProfiles = [
  { storeName: 'Sharma Kirana', upiId: 'sharma@okhdfcbank' },
  { storeName: 'Gupta Store', upiId: '9876543210@paytm' },
  { storeName: 'Super Mart', upiId: 'mart@oksbi' },
]
validProfiles.forEach(p => {
  assert(isValidUpiId(p.upiId), `UPI ID ${p.upiId} should be valid`)
  assert(p.storeName.length > 0, 'Store name should not be empty')
})

const invalidProfiles = [
  { storeName: 'Unconfigured', upiId: '' },
  { storeName: 'Bad Handle', upiId: 'nobody@' },
  { storeName: 'No At', upiId: 'invalidhandle' },
]
invalidProfiles.forEach(p => {
  assert.strictEqual(isValidUpiId(p.upiId), false, `UPI ID ${p.upiId} should be rejected`)
})
console.log('[PASS] Dukaan store profile validity tests passed')

// Test 8: Sound Effects safe invocation in non-browser / Node environment
assert.doesNotThrow(() => {
  soundEffects.pop(false)
  soundEffects.chime(false)
  soundEffects.fanfare(false)
  soundEffects.soundboxChime(false)
  soundEffects.speakSoundbox({
    partNumber: 1,
    totalParts: 2,
    amount: 1750,
    isFull: false,
    language: 'hi',
    isMuted: false,
  })
  soundEffects.speakSoundbox({
    partNumber: 2,
    totalParts: 2,
    amount: 1750,
    isFull: true,
    language: 'en',
    isMuted: false,
  })
}, 'Sound effects must safely no-op in headless/server environments')
console.log('[PASS] Sound effects safe execution tests passed')

console.log('[SUCCESS] ALL TESTS PASSED SUCCESSFULLY!')
