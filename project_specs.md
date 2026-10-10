# Project Specification: CovenantWatch AI (CRE Covenant Monitoring Engine)

## 1. Executive Summary & Product Vision
**CovenantWatch AI** is an institutional-grade Commercial Real Estate (CRE) loan surveillance and covenant compliance platform. It bridges the gap between raw, messy monthly property tenant rosters (rent rolls) and rigorous credit agreement covenant enforcement. 

Rather than relying on delayed quarterly manual reviews (60-90 day lag), CovenantWatch AI provides real-time deterministic underwriting calculations, automated breach detection, instant mark-to-market valuations, dynamic equity cure paydown modeling, cash sweep/lockbox triggers, and AI-assisted remediation memos with legal default notices.

---

## 2. Design System & Aesthetics (Strict Specification)
Per the design directive, CovenantWatch AI adopts a **soft, organic, and editorial aesthetic**:

* **Color Palette**:
  - **Backgrounds**: Warm off-white (`#FAFAF9` / Stone-50 and `#F5F5F4` / Stone-100).
  - **Cards & Surfaces**: Clean ivory/pure warm-white with subtle organic borders (`#FFFFFF` with `#E7E5E4` / Stone-200).
  - **Typography Color**: Deep charcoal (`#1C1917` / Stone-900) and dark espresso brown (`#292524` / Stone-800) for high legibility without harsh pure black (`#000000` is strictly avoided). Secondary text in warm muted slate/charcoal (`#78716C` / Stone-500).
  - **Accent Colors**:
    * **Sage Green** (`#4D7C5B` / `#15803D` / `#DCFCE7` tint): Compliant status, healthy DSCR, positive equity cushions.
    * **Terracotta / Ochre** (`#C2410C` / `#EA580C` / `#FFEDD5` tint): Warnings, impending maturity, soft covenant cushion watch.
    * **Muted Crimson / Brick** (`#991B1B` / `#FEE2E2` tint): Critical breaches, hard default, cash sweep active.
    * **Slate / Warm Stone** (`#475569` / `#78716C`): Structural dividers, secondary tabs, metadata tags.
* **Typography**:
  - **Headings & Display**: Elegant editorial Serif font (`Fraunces` / `Newsreader` / `Playfair Display` or `serif` fallback) for all headers, KPI values, and statement titles.
  - **Body & Controls**: Highly legible modern Sans-serif (`Plus Jakarta Sans` / `Inter`) with `tabular-nums` for all financial figures, debt service figures, and percentages.
* **Shape & Elevation**:
  - **Radii**: Generous, organic curves (`rounded-2xl` for sub-elements, `rounded-3xl` for cards, modals, and tables).
  - **Shadows**: Very soft, multi-layered diffuse shadows (`box-shadow: 0 10px 25px -5px rgba(41, 37, 36, 0.04), 0 8px 10px -6px rgba(41, 37, 36, 0.03)`).
  - **Borders**: Delicate, warm hairline borders (`1px solid #E7E5E4` / Stone-200).

---

## 3. Supported User Inputs & Data Ingestion
1. **Unstructured & Structured File Ingestion**:
   - CSV / Excel table drops (raw Yardi, MRI, RealPage rent roll exports).
   - Raw text/JSON copy-paste parser for instant testing with synthetic or messy real-world formats.
   - Built-in one-click demo presets:
     * *Preset 1: Centennial Center Tower A (Office - Anchor Vacancy & DSCR Breach)*
     * *Preset 2: Ironwood Logistics Park (Industrial - 100% Occupied, Prime Compliant)*
     * *Preset 3: Apex Metro Residences (Multifamily - Rising Delinquency / Soft Warning)*
2. **Interactive Manual Overrides & Real-Time Stress Testing**:
   - Tenant lease status toggles (`Active` vs. `Vacant`).
   - Delinquency sliders / steppers (0 to 120+ days past due).
   - In-place base rent adjustments.
   - Market Capitalization Rate slider (adjusting market direct-cap rate to stress-test dynamic LTV).
   - Interest rate & OpEx shock parameters.

---

## 4. End-to-End System Workflows

### Workflow A: Ingestion & Normalization Core
- Ingests tenant roster rows: `suite_id`, `tenant_name`, `sqft`, `lease_start`, `lease_end`, `monthly_base_rent`, `status`, `payment_delinquency_days`.
- Normalizes unit square footages, detects vacant vs. active suites, aggregates gross leasable area (GLA).

### Workflow B: Deterministic Financial Valuation Engine
Pure mathematical computations executed locally with zero LLM hallucinations:
1. **Physical Occupancy (%)**:
   $$\text{Physical Occupancy} = \left(\frac{\sum \text{Active SqFt}}{\text{Gross Leasable Area (GLA)}}\right) \times 100$$
2. **Annual Gross In-Place Rent**:
   $$\text{Gross In-Place Rent} = \sum (\text{Active Monthly Base Rent} \times 12)$$
3. **Delinquent Rent Annualized**:
   $$\text{Delinquent Rent} = \sum (\text{Active Monthly Base Rent} \times 12) \quad \text{where } \text{Delinquency Days} > 30$$
4. **Effective Gross Income (EGI)**:
   $$\text{EGI} = \text{Gross In-Place Rent} - \text{Delinquent Rent Annualized}$$
5. **Economic Occupancy (%)**:
   $$\text{Economic Occupancy} = \left(\frac{\text{EGI}}{\text{Gross In-Place Rent}}\right) \times 100$$
6. **Net Operating Income (NOI)**:
   $$\text{NOI} = \text{EGI} - \text{Annual OpEx}$$
   *(Strictly excludes debt service, CapEx, depreciation, income taxes)*
7. **Debt Service Coverage Ratio (DSCR)**:
   $$\text{DSCR} = \frac{\text{Annualized In-Place NOI}}{\text{Annual Debt Service (P+I)}}$$
8. **Dynamic Mark-to-Market Property Valuation**:
   $$\text{Dynamic Property Value} = \frac{\text{Annualized NOI}}{\text{Market Cap Rate (as decimal)}}$$
9. **Dynamic Mark-to-Market LTV (%)**:
   $$\text{Dynamic LTV} = \left(\frac{\text{Current UPB}}{\text{Dynamic Property Value}}\right) \times 100$$

### Workflow C: Covenant Compliance & Risk State Machine
Evaluates computed ratios against loan credit agreement parameters:
- `min_physical_occupancy_pct` (e.g., 85.0%)
- `min_economic_occupancy_pct` (e.g., 80.0%)
- `min_dscr` (e.g., 1.25x)
- `max_ltv_pct` (e.g., 70.0%)
- `cash_sweep_dscr_threshold` (e.g., 1.15x)
- **Status Classification**:
  - `COMPLIANT`: All ratios meet or exceed covenants with healthy cushion.
  - `WATCHLIST_WARNING`: Within 5% cushion or 30-day delinquency soft warning.
  - `CRITICAL_BREACH`: Hard covenant violation (DSCR < minDSCR, LTV > maxLTV, Occupancy < minOcc).
  - `CASH_SWEEP_ACTIVE`: DSCR < cashSweepDSCRThreshold (automatic lockbox cash trap trigger).

### Workflow D: Automated Remediation & Legal Studio
1. **Deterministic Equity Cure Computation**:
   $$\text{Target UPB} = \text{Dynamic Property Value} \times \left(\frac{\text{Max LTV \%}}{100}\right)$$
   $$\text{Required Paydown for DSCR} = \text{Current UPB} - \left(\frac{\text{NOI}}{\text{Min DSCR} \times \text{Loan Constant Rate}}\right)$$
   $$\text{Equity Cure Amount} = \max\left(0, \text{Required Principal Reduction}\right)$$
2. **Remediation Studio & Notice Drafter**:
   - Generates institutional **Formal Notice of Default & Demand for 30-Day Cure**.
   - Generates **Internal Credit Committee Risk Memo** (CECL reserve impact, risk rating downgrade, lockbox cash trap orders).
   - One-click PDF export, copy-to-clipboard, and printable legal memo view.

---

## 5. User Interface & Key Components
1. **Header & Navigation Bar**:
   - Institutional logo & title in serif editorial typography.
   - Global Macro Ticker (10Y Treasury yield, CRE Cap Rate Spreads).
   - Live Search & Property Filter buttons.
2. **Portfolio Exposure Ribbon**:
   - Total Monitored Exposure (Total UPB).
   - Portfolio-Weighted Dynamic LTV (with organic color badge).
   - Active Covenant Breach Count.
   - Capital Under Cash Sweep / Lockbox.
3. **Loan Surveillance Watchlist Table**:
   - Filterable & sortable list of all institutional facilities.
   - Dynamic indicators for Physical vs. Economic occupancy.
   - Live DSCR pill badges with cushion deltas.
   - Mark-to-market dynamic LTV vs. appraisal LTV.
   - Quick Action: "Audit & Inspect Loan".
4. **Loan Detail & Stress-Test Studio (Dual-Panel Inspection Drawer / View)**:
   - **Left Panel**: Credit Agreement Terms, baseline covenants, property specs.
   - **Right Panel**: Real-time calculated metrics side-by-side with required thresholds, live delta pill warnings.
5. **Interactive Rent Roll Roster**:
   - In-place tenant table with inline switches (Active/Vacant) and delinquency steppers.
   - Real-time recalculation feedback loop (0ms delay).
6. **Remediation & Legal Action Modal**:
   - Equity Cure paydown dollar requirement.
   - Borrower Notice of Default & Committee Memo generator with markdown and print-ready formatting.
7. **Interactive Visualizations (Recharts)**:
   - 12-Month Historical DSCR & LTV Trajectory with covenant threshold reference lines.
   - Lease Rollover Expiration Schedule highlighting multi-year rollover concentration risks.

---

## 6. Technical Stack & Tooling
- **Framework**: Vite + React 18 + TypeScript (`strict: true`).
- **Styling**: Tailwind CSS configured with custom organic color tokens, Fraunces/Playfair and Plus Jakarta Sans typography, rounded-2xl/rounded-3xl radii, and soft diffuse shadows.
- **Icons**: Lucide React.
- **Charts**: Recharts with organic palette themes.
- **Package Manager**: `pnpm`.
- **Deployment**: GitHub Pages (`gh-pages`).

---

## 7. Definition of "Done" & Quality Gates
1. **Mathematical Accuracy**: All financial metrics (NOI, DSCR, dynamic valuation, dynamic LTV, economic occupancy, equity cure amounts) match standard CRE banking formulas to the exact cent and basis point.
2. **Zero Default Styles**: Organic warm off-white palette (`#FAFAF9`), deep charcoal/espresso text (`#1C1917`), sage/terracotta/crimson/slate accents, rounded-2xl/3xl curves, soft shadows, and clean serif+sans typography.
3. **Instant Reactive State**: Editing rent roll tenant status or delinquency immediately updates portfolio metrics, loan details, charts, and breach states.
4. **Interactive Ingestion & Remediation**: Users can test CSV/text parsing, switch presets, model equity cure injections, and export formal legal default notices.
5. **Strict TypeScript & Clean Build**: `pnpm run build` succeeds with zero TypeScript errors or linter warnings.
