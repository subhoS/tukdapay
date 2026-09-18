# Split2K

> **Smart UPI Bill Splitter, Dukaan Counter Mode, Dynamic QR Generator & Policy Reality Engine**  
> Built for mobile-first instant payments, compliant with NPCI UPI intent specifications (`upi://pay`).

![Split2K Banner](https://img.shields.io/badge/UPI-NPCI%20Standard-emerald?style=for-the-badge&logo=googlepay)
![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)
![Tailwind](https://img.shields.io/badge/TailwindCSS-v4-cyan?style=for-the-badge&logo=tailwindcss)
![Status](https://img.shields.io/badge/Ready_To_Ship_On_X-Live-purple?style=for-the-badge)

---

## The ₹2,000 UPI Policy: Myth vs. Reality

Over recent months, widespread rumors suggested that *“The Indian Government is imposing a tax on all UPI merchant transactions over ₹2,000.”*

Here is the factual regulatory reality researched directly from official **NPCI circulars** and **Ministry of Finance** press releases:

1. **Zero Tax on Consumers**: UPI transactions (bank-to-bank) remain **100% free** for consumers. No GST, surcharge, or government tax is levied on individual payers.
2. **0.4% Merchant Discount Rate (MDR)**: NPCI introduced a 0.4% MDR on select Person-to-Merchant (P2M) transactions exceeding ₹2,000 (capped at ₹300 for ₹75,000+). **This fee is strictly paid by the merchant**, not the customer.
3. **1.1% Wallet (PPI) Interchange**: Prepaid payment instruments (Paytm Wallet, PhonePe Wallet, Sodexo) to merchants above ₹2,000 attract up to 1.1% interchange, paid by merchants to wallet issuers.
4. **Small Merchants Exempt**: Small street vendors, kirana stores, and P2PM registered merchants pay ₹0 MDR.
5. **Why do merchants ask customers to split payments?**
   - Offline retailers sometimes ask customers to split payments into two sub-₹2,000 transactions to reduce MDR overhead.
   - Low-value transactions (< ₹2,000) also route through NPCI's high-speed low-value clearance tiers (UPI Lite rails) which boast higher success rates during peak bank downtime.
   - For dining, shopping, or group expenses, splitting high-value merchant bills into clean 50/50 halves or sub-₹2k chunks makes payments faster and easier.

---

## Features

- **Dukaan / Simple Mode**: 1-tap frictionless mode crafted for small shopkeepers, kirana stores, and dukandaars.
- **Saved Store Profile**: Shopkeeper sets store name and UPI ID once (persisted in `localStorage`); never re-types during a busy checkout rush.
- **Large On-Screen POS Keypad**: High-visibility bill input with tactile on-screen numeric keypad and quick stepper chips (+₹100, +₹500, +₹1,000).
- **One-Big-Action Button**: "Split & Show Customer QR" instantly transitions to counter display view.
- **High-Contrast Counter QR Display**: Uncluttered, high-contrast QR code canvas designed for showing across the counter to customers.
- **Paytm Soundbox-Style Audio & Voice**: Real-time Web Audio synthesizer chime and bilingual Web Speech voice confirmation ("Payment 1 prapt hua: ₹1,750 on UPI") so shopkeepers know when a part is paid without squinting at the phone.
- **Clear Visual Steps & Auto-Advancing**: Step 1 and Step 2 cues with large checkmarks and 1-tap "New Bill" reset.
- **Bilingual Helper Text**: Hinglish and English dual cues ("Customer Scan Karein", "Payment Complete").
- **Detailed Consumer Mode**: Full access to MDR calculators, 50/50 halves, custom split counts, shareable links, WhatsApp share, and digital receipts.
- **Zero Emojis**: 100% clean UI built exclusively with Lucide icons and vector SVGs.
- **NPCI-Compliant**: Generates standard `upi://pay` URI intents and dynamic QR codes client-side with zero external servers.

---

## Quick Start

### 1. Run Locally
```bash
cd split2k
npm install
npm run dev
```
Open your browser at `http://localhost:5173`.

### 2. Run Tests
```bash
npm test
```

### 3. Production Build
```bash
npm run build
```
Static production files will be generated in `dist/`.

---

## Deploy in 1-Click

Split2K is a 100% client-side, zero-backend single-page app. It can be hosted for free on any platform:

### Deploy to Vercel:
```bash
npx vercel deploy --prod
```

### Deploy to Netlify:
```bash
npx netlify deploy --prod --dir=dist
```

### Deploy to GitHub Pages:
Run `npm run build` and push the `dist/` folder to your `gh-pages` branch.

---

## X (Twitter) Launch Post Copy

```text
Built & Shipped today: Split2K

Everyone is talking about the new ₹2,000 UPI merchant rules (0.4% MDR / wallet charges).

Here is the truth:
* Consumers pay ₹0 tax (UPI bank-to-bank is 100% free)
* But some merchants ask for split payments to avoid MDR overhead

So I built a mobile-first app with a 1-tap "Dukaan Mode" for small shopkeepers:
* Save store UPI once
* Big bill keypad & 1-tap "Split & Show QR"
* Paytm Soundbox-style voice & chime confirmation
* 100% client-side, zero backend, zero emojis

Check it out: https://split2k.vercel.app
#buildinpublic #UPI #FinTech #India
```

---

## License
MIT License. Built for consumer financial transparency and payment convenience.
