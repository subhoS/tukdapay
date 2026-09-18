# TukdaPay (टुकड़ा पे)

> **Smart Zero-Fee UPI Bill Splitter & Kirana Counter POS**  
> Split transactions exceeding ₹2,000 into fee-free installments ($\le ₹1,999$), generate dynamic NPCI-compliant QR codes, and provide audio Soundbox voice feedback for small store owners.

[![License: MIT](https://img.shields.io/badge/License-MIT-002970.svg?style=for-the-badge)](LICENSE)
[![React 19](https://img.shields.io/badge/React-19-00BAF2?style=for-the-badge&logo=react&logoColor=white)](https://react.dev/)
[![Tailwind CSS v4](https://img.shields.io/badge/TailwindCSS-v4-38BDF8?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Vite 8](https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vite.dev/)
[![NPCI UPI Protocol](https://img.shields.io/badge/NPCI-UPI%20Standard-00AF71?style=for-the-badge)](https://www.npci.org.in/)
[![Zero Emojis](https://img.shields.io/badge/Design-Zero%20Emojis-002970?style=for-the-badge)](https://lucide.dev/)
[![100% Client-Side](https://img.shields.io/badge/Architecture-100%25%20Client--Side-00BAF2?style=for-the-badge)](/)

---

## What is TukdaPay?

**TukdaPay** (derived from the Indian colloquial phrase *"Bill ke tukde kar do"*) is an open-source, mobile-first payment utility crafted for India's 60M+ small merchants, kirana store owners, and consumers.

When paying bills of ₹2,000 and above, merchant discount rates (MDR) and prepaid wallet interchange fees kick in under NPCI regulations. Small merchants frequently ask customers to split payments into two parts to avoid fees and prevent bank server clearance timeouts.

TukdaPay makes this process frictionless: enter the bill amount once, and TukdaPay automatically optimizes it into compliant, fee-free parts ($\le ₹1,999$), renders high-contrast counter QR codes, and announces received payments with Paytm Soundbox-style bilingual voice confirmations.

---

## Regulatory Reality: The ₹2,000 UPI Rule

Over recent months, widespread rumors claimed that *"The Indian Government is taxing all UPI transactions over ₹2,000."*

Here is the factual regulatory breakdown based on official **NPCI circulars** and **Ministry of Finance** guidelines:

| Dimension | Regulatory Status |
| :--- | :--- |
| **Consumers (Payers)** | **100% Free — ₹0 Tax.** Bank-to-bank UPI transfers have zero surcharge or tax for customers regardless of amount. |
| **Merchant Discount Rate (MDR)** | Select Person-to-Merchant (P2M) payments $\ge ₹2,000$ attract up to **0.4% MDR** (capped at ₹300 for ₹75,000+), borne strictly by the merchant. |
| **Prepaid Wallet (PPI) Interchange** | Merchant transactions $\ge ₹2,000$ using wallets (Paytm Wallet, PhonePe Wallet, Sodexo) attract **1.1% interchange** fee paid to wallet issuers. |
| **Small Kirana Exemption** | Neighborhood vendors and small merchants registered under P2PM categories pay **₹0 fee** regardless of amount. |
| **The ₹1,999 Safe Boundary** | Transactions of **₹1,999 or less remain strictly outside** MDR and wallet interchange rules. |
| **Low-Value Clearance Tiers** | Payments under ₹2,000 route via high-speed bank settlement tiers (UPI Lite rails) with near-zero failure rates during peak bank server downtime. |

---

## Key Features

### 1. Dukaan / Counter Mode (For Kirana & Retail Merchants)
- **Save Profile Once**: Enter store name and UPI ID once. Persisted locally in `localStorage` with zero cloud tracking. Never re-type during peak customer rush.
- **Tactile POS Keypad**: Large, thumb-friendly on-screen numeric keypad with quick stepper chips (`+₹100`, `+₹500`, `+₹1,000`, `₹2,500`, `₹3,500`, `₹5,000`).
- **One Big Action Button**: 1-tap *"Split & Show Customer QR"* transitions immediately into counter view.
- **High-Contrast Counter QR Canvas**: Clean, oversized QR code display engineered for scanning across shop counters under sunlight or low shop lighting.
- **Audio Soundbox Engine**: Web Audio synthesizer chime paired with bilingual Web Speech voice confirmation:
  - *Hindi*: *"TukdaPay par ₹1,750 प्राप्त हुए"*
  - *English*: *"Received ₹1,750 on TukdaPay"*
- **Step-by-Step Auto Advancing**: Multi-part progress tabs (Part 1, Part 2, Part 3) that highlight active steps and auto-advance to unpaid installments upon payment confirmation.
- **1-Tap Next Customer Reset**: Resets counter display and returns to keypad in 1 tap.

### 2. Detailed Mode (For Consumers & Bill Sharing)
- **Flexible Split Configurations**:
  - *Smart Split*: Automatically computes minimal parts where every chunk is $\le ₹1,999$.
  - *Halves (50/50)*: Evenly divides any bill into 2 equal parts.
  - *Custom Splits*: Select 2, 3, 4, or 5 custom splits with live installment math.
- **Live MDR & Interchange Calculator**: Visual breakdown showing exact savings for merchants under NPCI regulations.
- **Direct UPI Intent Launching**: 1-tap open in any UPI application (`Google Pay`, `PhonePe`, `Paytm`, `BHIM`, `Navi`, `CRED`, `Super.money`).
- **Fullscreen QR Modal**: Expand any individual split QR code into fullscreen mode with one-click photo download.
- **Digital Receipt Generator**: Clean, printable monospace digital receipt with status breakdown and one-click clipboard copy.
- **Native Web Share**: Share split payment deep links via WhatsApp, SMS, or system share sheet.

### 3. Design & Privacy
- **Paytm Light Theme**: Palette modeled after Paytm's financial interface:
  - Deep Trustworthy Navy (`#002970`)
  - Paytm Electric Cyan (`#00BAF2`)
  - Paytm Merchant Green (`#00AF71`)
  - Ice Light Gray Surface (`#F5F7FA`)
- **Strict Zero-Emoji Policy**: 100% clean UI built exclusively with Lucide icons and vector SVGs.
- **100% Client-Side Privacy**: Zero servers, zero databases, zero cookies, zero analytics. All calculations and QR generation happen entirely inside the browser.

---

## Tech Stack

- **Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite 8](https://vite.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Iconography**: [Lucide React](https://lucide.dev/)
- **QR Generation**: [qrcode](https://www.npmjs.com/package/qrcode) (dynamic Canvas Data URLs)
- **Delight & Feedback**: [canvas-confetti](https://www.npmjs.com/package/canvas-confetti)
- **Speech & Audio**: Browser Web Speech Synthesis API & Web Audio Oscillator
- **Linter**: [Oxlint](https://oxc.rs/) (high-speed Rust-based linter)

---

## NPCI UPI Protocol Integration

TukdaPay generates standard NPCI UPI intent deep links conforming to the official specification:

```text
upi://pay?pa={upiId}&pn={payeeName}&am={partAmount}&cu=INR&tn={transactionNote}
```

- `pa`: Payee Virtual Payment Address (VPA) / UPI ID (e.g. `merchant@oksbi`).
- `pn`: Payee display name (e.g. `Verma General Store`).
- `am`: Exact split installment amount, formatted to 2 decimal places (e.g. `1750.00`).
- `cu`: Currency code, hardcoded to `INR`.
- `tn`: Transaction note (e.g. `TukdaPay: Part 1 of 2`).

---

## Getting Started

### Prerequisites
- Node.js 18.0.0 or higher
- npm, yarn, or pnpm

### 1. Clone the Repository
```bash
git clone https://github.com/subhoS/tukdapay.git
cd tukdapay
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Development Server
```bash
npm run dev
```
Open `http://localhost:5173` in your browser.

### 4. Run Automated Test Suite
```bash
npm test
```

### 5. Run Linter
```bash
npx oxlint
```

### 6. Build for Production
```bash
npm run build
```
Static production bundle will be output to `dist/`.

---

## Deployment

TukdaPay is a 100% static client-side application. It can be hosted on any static hosting provider:

### Deploy to Vercel
```bash
npx vercel --prod
```

### Deploy to Netlify
```bash
npx netlify deploy --prod --dir=dist
```

### Deploy to Cloudflare Pages
```bash
npx wrangler pages deploy dist --project-name=tukdapay
```

### Deploy to GitHub Pages
Push the `dist/` directory to your repository's `gh-pages` branch.

---

## Project Structure

```text
tukdapay/
├── public/
│   ├── favicon.svg             # Dual-token TukdaPay SVG emblem
│   └── robots.txt              # Standard crawler directives
├── src/
│   ├── components/
│   │   ├── BrandLogo.jsx       # Vector SVG emblem & wordmark
│   │   ├── DukaanMode.jsx      # Kirana counter POS view, keypad & QR
│   │   ├── FullscreenQrModal.jsx # Oversized scannable QR modal
│   │   ├── MdrCalculator.jsx   # Live NPCI MDR & interchange fee stats
│   │   ├── Navbar.jsx          # Paytm light mode navigation & controls
│   │   ├── PaymentLogos.jsx    # SVG icons for GPay, PhonePe, Paytm, BHIM
│   │   ├── PolicyModal.jsx     # Myth vs Fact regulatory breakdown
│   │   ├── ReceiptModal.jsx    # Monospace digital payment receipt
│   │   ├── SplitCard.jsx       # Individual installment split cards
│   │   └── StoreSetupModal.jsx # Dukaan profile configuration dialog
│   ├── utils/
│   │   ├── sound.js            # Soundbox chime & Web Speech synthesis
│   │   └── upi.js              # UPI validation, split algorithm & URI generator
│   ├── App.jsx                 # Main state container & detailed view
│   ├── index.css               # Tailwind CSS v4 entry point
│   └── main.jsx                # Application root mount
├── test/
│   └── test-split.js           # Automated unit test suite
├── package.json
├── vite.config.js
├── LICENSE                     # MIT License
└── README.md
```

---

## Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on code standards, the zero-emoji requirement, and pull request procedures.

---

## License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.
