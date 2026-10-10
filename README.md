# CovenantWatch AI: Commercial Real Estate (CRE) Covenant Monitoring Dashboard

> Institutional-grade commercial real estate loan surveillance, continuous rent roll ingestion, deterministic valuation modeling, mark-to-market LTV calculations, and automated default remediation.

---

## 🏢 Executive Overview

In Commercial Real Estate debt portfolios, lenders sit on hundreds of billions in loans bound by ongoing operational covenants (e.g. maintaining $\ge 85\%$ occupancy, $\ge 1.25\text{x}$ DSCR, or $\le 70\%$ dynamic LTV). 

Traditionally, manual review of messy rent roll spreadsheets results in a **60 to 90-day lag to default**, causing lenders to miss critical contractual windows to trigger **Cash Sweeps** or demand **Equity Cures**.

**CovenantWatch AI** transforms this delayed workflow into a real-time, deterministic surveillance command center.

---

## ✨ Key Capabilities

1. **Deterministic Financial Math Core (Zero LLM Hallucinations)**:
   - In-place Net Operating Income (NOI) isolating operational cash flow.
   - Debt Service Coverage Ratio (DSCR) with cushion deltas.
   - Dynamic Mark-to-Market Valuation & LTV via direct capitalization.
   - Physical vs. Economic Occupancy (penalizing $>30$-day tenant arrears).
   - Exact Equity Cure principal paydown computation.

2. **Portfolio Surveillance Command Center**:
   - High-density KPI Ribbon: Total Monitored Exposure, Weighted Average Dynamic LTV, Active Covenant Breaches, and Capital Under Lockbox / Cash Sweep.
   - Filterable & Searchable Watchlist Table with live status pills.

3. **Dual-Panel Loan Inspection & Stress Simulator**:
   - Credit agreement contractual covenants side-by-side with live metrics.
   - Real-time Direct-Cap Rate and OpEx stress testing sliders.

4. **Interactive Rent Roll Editor (0ms Instant Recalculation)**:
   - Inline tenant switches (`Active` vs. `Vacant`) and delinquency steppers ($0$ to $90+$ days past due).
   - Instant 0ms reactive calculation feedback loop.

5. **Automated Remediation & Legal Notice Studio**:
   - Formally formatted **Notice of Default & Demand for 30-Day Cure** citing exact Credit Agreement sections.
   - Internal **Credit Committee Risk Memorandum** with CECL reserve provisions and lockbox instructions.
   - One-click copy, print/PDF export, and servicing transmission simulation.

6. **Interactive Visual Analytics (Recharts)**:
   - 12-Month Historical DSCR & LTV Trajectory with covenant floor reference lines.
   - Lease Rollover Expiration Schedule highlighting $>25\%$ GLA concentration risks.

7. **Educational Learning Deck & Masterclass**:
   - 8-module comprehensive guide covering CRE banking concepts, high-level system architecture, stakeholder personas, consulting valuation economics, and college application/resume strategy.

---

## 🛠️ Technology Stack

- **Framework**: Vite + React 18 + Strict TypeScript (`"strict": true`)
- **Styling**: Tailwind CSS (Editorial Organic Design System: `#FAFAF9` warm off-white, Fraunces serif typography, rounded-3xl radii, diffuse shadows)
- **Charts**: Recharts
- **Icons**: Lucide React
- **Package Manager**: pnpm
- **Deployment**: GitHub Pages (`gh-pages`)

---

## 🚀 Local Development Setup

```bash
# Install dependencies
pnpm install

# Start local development server
pnpm run dev

# Build for production
pnpm run build

# Deploy to GitHub Pages
pnpm run deploy
```

---

## 📄 License
MIT License. Developed for institutional CRE loan surveillance education and risk infrastructure engineering.
