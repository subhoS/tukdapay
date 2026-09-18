# Contributing to TukdaPay

Thank you for your interest in contributing to **TukdaPay (टुकड़ा पे)**! TukdaPay is a public, open-source payment utility designed to keep digital commerce transparent, simple, and fee-free for consumers and small merchants across India.

---

## Code of Conduct

We are committed to providing a welcoming, inclusive, and harassment-free experience for everyone. Please be respectful, constructive, and collaborative in all discussions and contributions.

---

## How to Contribute

### 1. Fork & Clone
```bash
git clone https://github.com/subhoS/tukdapay.git
cd tukdapay
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start Local Development Server
```bash
npm run dev
```
Open `http://localhost:5173` to test live changes.

### 4. Code Standards & Architecture Guidelines
- **Strict Zero-Emoji Rule**: Never commit Unicode emojis into the codebase. Use Lucide icons (`lucide-react`) or clean inline vector SVGs for all visual indicators.
- **₹1,999 Zero-Fee Boundary**: The safe threshold `SAFE_FEE_FREE_LIMIT = 1999` in `src/utils/upi.js` must be preserved. Transactions of ₹2,000 and above trigger regulatory MDR tiers; split chunks must remain $\le ₹1,999$.
- **100% Client-Side Privacy**: Do not add server-side telemetry, external tracking databases, or cloud sync of user UPI IDs. Store profiles must remain local in `localStorage`.
- **Paytm Light Theme Consistency**: Follow the Paytm color tokens:
  - Deep Navy: `#002970`
  - Electric Cyan: `#00BAF2`
  - Merchant Green: `#00AF71`
  - Ice Light Gray: `#F5F7FA`
  - Card Surfaces: Pure White `#FFFFFF` with `border-slate-200`

### 5. Running Quality Checks
Before opening a pull request, ensure all tests, lint checks, and builds pass cleanly:
```bash
# Run unit tests
npm test

# Run Oxlint
npx oxlint

# Run production build
npm run build
```

---

## Submitting Pull Requests

1. Create a feature branch:
   ```bash
   git checkout -b feature/my-improvement
   ```
2. Commit your changes using conventional commit messages:
   ```bash
   git commit -m "feat(dukaan): add quick preset for dairy merchants"
   ```
3. Push to your fork and submit a Pull Request describing:
   - What problem your change solves
   - Steps taken to verify functionality
   - Confirmation of 0 lint errors, 0 test failures, and 0 emojis

---

## License

By contributing to TukdaPay, you agree that your contributions will be licensed under the [MIT License](LICENSE).
