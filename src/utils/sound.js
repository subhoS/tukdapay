/**
 * Web Audio API synthesizer for tactile, fun sound effects
 * Zero external audio files required, runs 100% locally in browser!
 */

let audioCtx = null

function getAudioContext() {
  if (typeof window === 'undefined') return null
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext
    if (AudioContextClass) {
      audioCtx = new AudioContextClass()
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume()
  }
  return audioCtx
}

export const soundEffects = {
  // Tactile button click / pop
  pop(isMuted = false) {
    if (isMuted) return
    try {
      const ctx = getAudioContext()
      if (!ctx) return
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.type = 'sine'
      osc.frequency.setValueAtTime(450, ctx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(750, ctx.currentTime + 0.05)

      gain.gain.setValueAtTime(0.12, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06)

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.start()
      osc.stop(ctx.currentTime + 0.06)
    } catch {
      // Audio context may be restricted before user gesture
    }
  },

  // Success chime when marking part as paid
  chime(isMuted = false) {
    if (isMuted) return
    try {
      const ctx = getAudioContext()
      if (!ctx) return
      
      const now = ctx.currentTime
      const notes = [523.25, 659.25, 783.99] // C5, E5, G5 major triad

      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()

        osc.type = 'triangle'
        osc.frequency.setValueAtTime(freq, now + idx * 0.06)

        gain.gain.setValueAtTime(0.14, now + idx * 0.06)
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.25)

        osc.connect(gain)
        gain.connect(ctx.destination)

        osc.start(now + idx * 0.06)
        osc.stop(now + idx * 0.06 + 0.26)
      })
    } catch {
      // Audio context restricted
    }
  },

  // Celebratory fanfare when all parts are finished
  fanfare(isMuted = false) {
    if (isMuted) return
    try {
      const ctx = getAudioContext()
      if (!ctx) return
      
      const now = ctx.currentTime
      const melody = [
        { f: 523.25, t: 0, d: 0.12 },    // C5
        { f: 659.25, t: 0.12, d: 0.12 }, // E5
        { f: 783.99, t: 0.24, d: 0.12 }, // G5
        { f: 1046.50, t: 0.36, d: 0.4 }, // C6
      ]

      melody.forEach(({ f, t, d }) => {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()

        osc.type = 'sine'
        osc.frequency.setValueAtTime(f, now + t)

        gain.gain.setValueAtTime(0.18, now + t)
        gain.gain.exponentialRampToValueAtTime(0.001, now + t + d)

        osc.connect(gain)
        gain.connect(ctx.destination)

        osc.start(now + t)
        osc.stop(now + t + d + 0.02)
      })
    } catch {
      // Audio context restricted
    }
  },

  // Iconic Paytm / BharatPe Soundbox multi-tone chime
  soundboxChime(isMuted = false) {
    if (isMuted) return
    try {
      const ctx = getAudioContext()
      if (!ctx) return
      const now = ctx.currentTime
      
      // Resonant 4-tone ascending soundbox chime (D5 -> F#5 -> A5 -> D6)
      const chimeNotes = [
        { freq: 587.33, start: 0, dur: 0.14, gain: 0.22 },
        { freq: 739.99, start: 0.08, dur: 0.14, gain: 0.24 },
        { freq: 880.00, start: 0.16, dur: 0.18, gain: 0.26 },
        { freq: 1174.66, start: 0.24, dur: 0.35, gain: 0.28 },
      ]

      chimeNotes.forEach(({ freq, start, dur, gain: vol }) => {
        const osc = ctx.createOscillator()
        const gainNode = ctx.createGain()

        osc.type = 'triangle'
        osc.frequency.setValueAtTime(freq, now + start)

        gainNode.gain.setValueAtTime(vol, now + start)
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + start + dur)

        osc.connect(gainNode)
        gainNode.connect(ctx.destination)

        osc.start(now + start)
        osc.stop(now + start + dur + 0.02)
      })
    } catch {
      // Audio context restricted
    }
  },

  // Paytm Soundbox-style voice announcement
  speakSoundbox({
    partNumber,
    totalParts = 2,
    amount,
    isFull = false,
    language = 'hi',
    isMuted = false,
  }) {
    if (isMuted) return

    // 1. Play chime first
    if (isFull) {
      this.fanfare(false)
    } else {
      this.soundboxChime(false)
    }

    // 2. Speak announcement via SpeechSynthesis
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return

    try {
      window.speechSynthesis.cancel()

      const roundedAmt = Math.round(Number(amount) || 0)
      let phrase = ''

      if (language === 'hi') {
        if (isFull) {
          phrase = `TukdaPay par poora payment safal! Kul ${roundedAmt} rupaye prapt hue.`
        } else {
          phrase = `Part ${partNumber} of ${totalParts} prapt hua! ${roundedAmt} rupaye TukdaPay par.`
        }
      } else {
        if (isFull) {
          phrase = `Full payment complete! ${roundedAmt} rupees received on TukdaPay.`
        } else {
          phrase = `Part ${partNumber} of ${totalParts} received! ${roundedAmt} rupees on TukdaPay.`
        }
      }

      const utterance = new SpeechSynthesisUtterance(phrase)
      utterance.lang = language === 'hi' ? 'hi-IN' : 'en-IN'
      utterance.rate = 1.0
      utterance.pitch = 1.05

      const voices = window.speechSynthesis.getVoices()
      if (voices && voices.length > 0) {
        if (language === 'hi') {
          const hiVoice =
            voices.find((v) => v.lang.toLowerCase().startsWith('hi') || v.lang.toLowerCase().includes('hi-in')) ||
            voices.find((v) => v.lang.includes('IN'))
          if (hiVoice) utterance.voice = hiVoice
        } else {
          const inVoice =
            voices.find((v) => v.lang.toLowerCase().includes('en-in') || v.lang.toLowerCase().includes('en_in')) ||
            voices.find((v) => v.lang.includes('IN'))
          if (inVoice) utterance.voice = inVoice
        }
      }

      window.speechSynthesis.speak(utterance)
    } catch {
      // Speech synthesis error handled safely
    }
  },
}
