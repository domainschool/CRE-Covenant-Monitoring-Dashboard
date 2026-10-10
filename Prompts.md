# CRE Covenant Monitoring Engine: Incremental Prompts & Engineering Log

---

## Architecture & Versioning Overview

- **Current Stage**: Step 1 - Specification & Architecture Approval (Pre-Code Gate)
- **Design Archetype**: Soft, Organic & Editorial (Warm off-white `#FAFAF9`, charcoal/dark brown typography, sage green / terracotta / muted crimson accents, `rounded-2xl` / `rounded-3xl` radii, soft diffuse shadows, Fraunces/Newsreader serif headings + Plus Jakarta Sans body).
- **Core Technology Stack**: Vite, React 18, Strict TypeScript, Tailwind CSS, Lucide React, Recharts, pnpm.

---

## Tier 1: MVP 1 (Local State, Pure UI Logic & Deterministic Math) - COMPLETED

### Prompt 1.1: Project Scaffold, Domain Types & Deterministic Math Core
- Created strict TypeScript interfaces in `types/cre.ts` (`Tenant`, `LoanCovenants`, `Loan`, `BreachItem`, `CovenantEvaluation`, `RiskRating`).
- Implemented pure, zero-hallucination deterministic financial formulas in `lib/cre-calculator.ts` (NOI, DSCR, dynamic direct cap valuation, mark-to-market LTV, physical/economic occupancy, and deterministic equity cure paydown).
- Created multi-sector institutional mock assets in `data/mock-loans.ts` (Centennial Center Tower A, Ironwood Logistics Hub, Apex Metro Residences, The Promenade at Westlake).

### Prompt 1.2: Portfolio Exposure Board & Watchlist UI
- Created `PortfolioSummaryRibbon.tsx` with 4 high-density organic metric cards (Total Monitored Exposure, Portfolio Weighted LTV, Active Covenant Breaches, Capital Under Cash Sweep / Lockbox).
- Created `LoanWatchlistTable.tsx` with search, multi-type filtering, health status filters, live DSCR pills, dual occupancy meters, dynamic LTV deltas, and one-click loan inspection.
- Implemented the editorial design system: warm off-white `#FAFAF9`, charcoal `#1C1917` / dark brown text, sage green, terracotta, and slate accents, `rounded-2xl`/`rounded-3xl` radii, soft diffuse shadows, and Fraunces/Newsreader serif headings.

### Prompt 1.3: Loan Drilldown, Rent Roll Editor & Instant Re-calculation
- Created `LoanInspectionDrawer.tsx` (Dual-panel: credit agreement terms vs. live calculated metrics with delta variances, stress testing sliders for cap rate and OpEx).
- Created `RentRollTable.tsx` with inline tenant status toggles (Active/Vacant), delinquency selector (0 to 90+ days), and instant 0ms recalculation.
- Created `RemediationStudioModal.tsx` generating formal Borrower Default Notices, Credit Committee Risk Memos, and Equity Cure calculation worksheets with print and copy tools.
- Created `CovenantTrendsChart.tsx` (12-month historical trajectory with covenant threshold reference lines) and `LeaseRolloverChart.tsx` (lease expiration concentration risk).
- Created `AboutLearningDeckModal.tsx` containing an interactive 8-module educational curriculum & system architecture masterclass matching institutional design patterns:
  1. Problem & Core Concept (CRE debt lag to default, manual Excel processing trap, missed cash sweep windows).
  2. Required Domain Knowledge (NOI, DSCR, dynamic mark-to-market direct-cap LTV, physical vs economic occupancy, equity cures, cash sweep lockboxes).
  3. Data Pipeline & 4-Stage Architecture (Ingestion -> Normalization -> Deterministic Financial Math Core -> Surveillance State Machine).
  4. Stakeholders & User Personas (Credit Analysts, Portfolio Managers, Chief Credit Officers, Bank Regulators).
  5. Commercial Valuation & External Consulting Economics ($360,000 – $500,000+ digital agency build estimate and SaaS seat pricing).
  6. College Application & Resume Differentiation Strategy (quantifiable bullets and deep vertical risk domain advantage).
  7. AI Vibe-Coding Prompt Runway (interactive collapsible cards with copy icons for Prompts 1.1 through 3.3).
  8. Future Enhancements & Enterprise Roadmap (Live FRED feeds, multimodal OCR rent rolls, Supabase RLS multi-tenancy, e-signature portals).
- Local dev server active at `http://localhost:5173/`. Clean TypeScript build verified (`pnpm run build` exits with code 0).
