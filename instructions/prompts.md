# CRE Covenant Monitoring Engine: Incremental Vibe Coding Prompts

---

## Tier 1: MVP 1 (Local State, Pure UI Logic & Deterministic Math)

### Prompt 1.1: Project Scaffold, Domain Types & Deterministic Math Core

```text
Act as a Principal Financial Systems Architect and Frontend Engineer. We are building the first prototype of "CovenantWatch AI," an institutional CRE (Commercial Real Estate) loan surveillance dashboard.

Stack: Next.js (App Router), TypeScript, Tailwind CSS, Lucide React icons.
Zero external APIs, zero backend servers, zero database setups. Everything must run entirely in-browser with client-side state.

1. Domain TypeScript Interfaces:
   Create a dedicated file `types/cre.ts` with strict enterprise typing:
   - `Tenant`: id, suiteId, tenantName, sqft, leaseStart (ISO string), leaseEnd (ISO string), monthlyBaseRent, status ('Active' | 'Vacant'), paymentDelinquencyDays (number).
   - `LoanCovenants`: minPhysicalOccupancyPct, minEconomicOccupancyPct, minDSCR, maxLTVPct, cashSweepDSCRThreshold, curePeriodDays.
   - `Loan`: id, loanNumber, borrowerName, propertyName, propertyType ('Office' | 'Multifamily' | 'Industrial' | 'Retail'), grossLeasableAreaSqft, originalLoanAmount, currentUPB (Unpaid Principal Balance), interestRatePct, annualDebtService, marketCapRatePct, annualOpEx, covenants (LoanCovenants), rentRoll (Tenant[]).
   - `BreachSeverity`: 'NONE' | 'SOFT_WARNING' | 'CRITICAL_BREACH' | 'CASH_SWEEP_TRIGGERED'.
   - `CovenantEvaluation`: physicalOccupancyPct, economicOccupancyPct, annualNOI, dscr, dynamicPropertyValue, dynamicLTVPct, breaches (array of objects containing covenantName, threshold, actual, severity, message), cashSweepActive, equityCureAmountRequired.

2. Deterministic Calculation Utility:
   Create `lib/cre-calculator.ts` with pure, zero-hallucination mathematical logic:
   - Physical Occupancy = (sum of active sqft / grossLeasableAreaSqft) * 100
   - Annual Gross In-Place Rent = (sum of active monthlyBaseRent) * 12
   - Delinquent Rent Annualized = sum of (monthlyBaseRent * 12) for active tenants where paymentDelinquencyDays > 30
   - Effective Gross Income (EGI) = Annual Gross In-Place Rent - Delinquent Rent Annualized
   - Economic Occupancy = (EGI / Annual Gross In-Place Rent) * 100
   - Net Operating Income (NOI) = EGI - annualOpEx
   - DSCR = NOI / annualDebtService
   - Dynamic Valuation = NOI / (marketCapRatePct / 100)
   - Dynamic LTV = (currentUPB / Dynamic Valuation) * 100
   - Equity Cure Calculation: If DSCR < minDSCR, calculate exact lump-sum principal paydown required on currentUPB to reset DSCR to target threshold.
   - Covenant Evaluator: Compares metrics against thresholds and tags breach severity.

3. Initial Mock Data:
   Create `data/mock-loans.ts` containing 3 realistic institutional assets:
   - Asset 1: Centennial Center Tower A (Office, 150,000 sqft, facing an anchor vacancy in Suite 300, triggering a critical DSCR breach and Cash Sweep).
   - Asset 2: Ironwood Logistics Hub (Industrial, 400,000 sqft, 100% occupied, prime financial health).
   - Asset 3: Apex Metro Residences (Multifamily, 120 units/95,000 sqft, minor delinquency soft warnings).

Implement these files cleanly with complete, realistic numbers and production-ready TypeScript code.

```

---

### Prompt 1.2: Portfolio Exposure Board & Watchlist UI

```text
Act as a Lead UI/UX Product Designer specialized in institutional FinTech and private credit platforms (style archetype: Bloomberg terminal meets modern Linear/Stripe design).

Using the types and calculation engine created in Prompt 1.1, build the main portfolio dashboard view in `app/page.tsx` and modular components in `components/`:

1. Portfolio KPI Summary Ribbon (`components/PortfolioSummaryRibbon.tsx`):
   Display 4 high-density metric cards:
   - Total Monitored Exposure (Sum of current UPB across all loans, formatted as currency).
   - Weighted Average Dynamic LTV (Color-coded badge: green if <= 65%, amber if 65-75%, red if > 75%).
   - Total Active Covenant Breaches (Highlighting critical counts).
   - Capital Under Cash Sweep (Total UPB of facilities with active lockbox triggers).

2. Loan Surveillance Watchlist (`components/LoanWatchlistTable.tsx`):
   A high-density financial table showing:
   - Loan ID & Property Name / Type.
   - In-Place Physical vs. Economic Occupancy (Dual progress bar or badge comparison).
   - In-Place DSCR (with color-coded pills: Red if below covenant, Amber if within 0.05x cushion, Green if passing).
   - Dynamic LTV (Mark-to-market).
   - Covenant Status Badge ('Compliant', '30-Day Cure Notice', 'Cash Sweep Triggered').
   - Action Button: "Audit Loan" which selects that loan into active component state.

3. Visual Design System:
   - Palette: Clean financial dark palette (zinc-900 backgrounds, zinc-800 cards, subtle zinc-700 borders, crisp emerald/amber/rose accent indicators).
   - Typography: Tabular numbers (`tabular-nums`) for currency and decimal alignments.
   - Use Lucide React icons for status badges and tooltips.

Make sure clicking a row sets the active loan state so we can render loan-specific details without navigating away from the page.

```

---

### Prompt 1.3: Loan Drilldown, Rent Roll Editor & Instant Re-calculation

```text
Act as a Senior Frontend Engineer. Now build the deep-dive inspection drawer and interactive scenario simulator when a loan is selected from the portfolio watchlist.

Create `components/LoanInspectionDrawer.tsx` and `components/RentRollTable.tsx`:

1. Dual-Panel Loan Detail View:
   - Left Panel (Credit Agreement Terms): Original balance, current UPB, interest rate, annual debt service, and covenant parameter cards (`min_dscr`, `min_occupancy`, `max_ltv`, `cash_sweep_threshold`).
   - Right Panel (Live Metric Status): Trailing calculated metrics side-by-side with required thresholds, rendering delta variances (e.g., "DSCR: 1.11x | Required: 1.25x | Delta: -0.14x").

2. Interactive Rent Roll Table:
   Display the property's tenant roster with fields: Suite, Tenant Name, Square Footage, Expiration Date, Base Monthly Rent, Payment Delinquency Days, and Lease Status.
   - Provide an in-table toggle for each tenant: Toggle Status between 'Active' and 'Vacant', and adjust Delinquency Days via an inline stepper/input.
   - When any tenant's status or rent is modified, update the React state instantly.
   - The entire calculation engine (`evaluate_cre_covenants`) must recompute immediately, dynamically updating the KPI cards, LTV, DSCR, and firing/clearing the Cash Sweep alerts with zero page reload.

3. Legal Action & Equity Cure Calculator Panel:
   If the selected loan is in breach:
   - Render a prominent notification box explaining the breach condition.
   - Display the **Equity Cure Calculator**: "Borrower must inject $X,XXX,XXX to reduce principal to $XX,XXX,XXX to restore required 1.25x DSCR."
   - Add a button: "Generate Draft Default Notice" that opens a modal with a formatted formal legal letter citing the breached covenant clauses and specifying the 30-day cure deadline.

Wire everything up so the user can test default scenarios (e.g., evicting a tenant or increasing past-due days) and watch the covenants instantly trigger in the UI.

```

---

## Tier 2: MVP 2 (Server Runtimes, External API Feeds & LLM Document Extraction)

### Prompt 2.1: Server-Side Pipeline, API Route Handlers & Live FRED API Integration

```text
Act as a Senior Full-Stack Engineer and Financial Systems Integrator. We are advancing "CovenantWatch AI" from local state into a server-backed application with real-time economic feeds.

1. Secure Environment Configuration:
   Set up configuration validation using Zod in `lib/env.ts` checking for:
   - `FRED_API_KEY`: Federal Reserve Economic Data API key.
   - `GEMINI_API_KEY` or `OPENAI_API_KEY`: LLM extraction provider key.

2. Live Macroeconomic Data Ingestion (FRED API):
   Create a Next.js Server Route Handler `app/api/market-data/route.ts`:
   - Fetch real-time market metrics from the St. Louis Fed (FRED) API:
     * 10-Year Treasury Constant Maturity Rate (Series: `DGS10`).
     * Commercial Real Estate Price Index / Cap Rate proxy data.
   - Implement caching using Next.js `revalidate: 3600` (1-hour cache).
   - If the API key is missing or fails, gracefully fall back to institutional default constants without crashing the app.

3. Dynamic Mark-to-Market Valuation Engine:
   Update the valuation engine so that `marketCapRatePct` is dynamically calculated based on:
   - Baseline Spread over the live 10-Year Treasury yield + asset-class specific risk premium (e.g., Office = 10Y Treasury + 325 bps; Industrial = 10Y Treasury + 175 bps).
   - Expose this endpoint to the frontend so that dynamic property valuation and LTV automatically update based on live bond market yield movements.

4. UI Loading Skeletons:
   Create skeleton loaders (`components/skeletons/DashboardSkeleton.tsx`) using Tailwind pulse animations for the summary cards, watchlist table, and market data ticker while server data resolves.

```

---

### Prompt 2.2: LLM-Powered Unstructured Rent Roll & Credit Agreement Parser

```text
Act as an AI Solutions Architect specializing in structured document extraction. We are building the ingestion pipeline that allows asset managers to drop unstructured rent roll text or CSV files and normalize them against credit agreements.

1. Structured Output Schema Definition:
   Using the official SDK (Google GenAI SDK or OpenAI SDK), create a server route `app/api/parse-rent-roll/route.ts` with strict JSON mode / structured object outputs:
   Define the target extraction schema using Zod:
   - `tenants`: Array of objects matching our `Tenant` interface (normalized tenant names, clean integers for square footage, extracted monthly base rents, computed lease expiry dates, and parsed delinquency amounts).
   - `extraction_metadata`: Confidence score, warnings array (e.g., "Ambiguous lease dates on Suite 402"), and detected currency.

2. Document Ingestion API Handler:
   The API route should accept raw text, unstandardized CSV string data, or OCR text extracted from property PDFs (like Yardi or MRI exports).
   Construct a strict system prompt:
   - "You are an institutional commercial real estate credit audit agent. Parse the provided raw rent roll dump into a normalized JSON array. Strip header debris, normalize suite numbers, identify gross vs. net rents, flag delinquent amounts, and ensure square footage sums match building gross leasable area."

3. Ingestion Portal Component (`components/IngestionModal.tsx`):
   - Build a drag-and-drop file upload and raw text paste interface.
   - Include realistic preset buttons: "Load Messy Yardi Office Export", "Load Delinquent Retail Strip Center", "Load High-Occupancy Industrial".
   - Show progressive parsing states: Uploading -> Extracting Line Items via LLM -> Validating Mathematical Balance -> Re-evaluating Portfolio Covenants.
   - Provide an interactive review table showing the raw text line side-by-side with the AI-parsed values, allowing manual overrides before committing to the dashboard state.

```

---

### Prompt 2.3: Automated Remediation Workflow & Default Notice AI Drafter

```text
Act as a Commercial Banking Workflow Specialist and Prompt Engineer. When a covenant breach is detected, the asset manager needs an automated remediation module that generates auditable notices and credit committee memos.

1. Server-Side Memo Generation Route (`app/api/generate-notice/route.ts`):
   Create an endpoint that takes a `loanId`, current `CovenantEvaluation` object, and credit agreement parameters.
   Use the LLM to draft two distinct institutional legal documents:
   - Document A: **Formal Notice of Default & Demand for Cure** addressed to the borrower:
     * Cites exact section references (e.g., "Section 8.2(b) - Financial Maintenance Covenants").
     * Details the exact mathematical shortfall (e.g., "DSCR decreased to 1.09x against the required 1.25x floor").
     * Formally asserts the 30-day cure deadline.
     * Details specific remedies reserved by the lender (Cash Sweep activation, Lockbox diversion, suspension of owner distributions).
   - Document B: **Internal Credit Committee Risk Memorandum**:
     * Executive summary of property performance and deterioration factors.
     * Recommended loan risk rating downgrade (e.g., from "Pass" to "Special Mention" or "Substandard").
     * Capital reserve impact under CECL (Current Expected Credit Losses).

2. Interactive Notice Studio UI (`components/NoticeStudioModal.tsx`):
   - Tabbed viewer toggling between Borrower Default Notice and Internal Credit Committee Memo.
   - Markdown viewer with one-click "Copy to Clipboard", "Export PDF/Print", and "Send to Borrower Servicing Portal" mock trigger.
   - Inline parameter editor allowing the asset manager to customize cure periods (e.g., from 30 to 45 days) or add specific lender stipulations before finalizing the memo.

```

---

## Tier 3: Scaling for Enterprises (Persistence, Data Viz, Security & Dark Mode)

### Prompt 3.1: Supabase/Postgres Persistence Layer, Prisma ORM & Row-Level Security

```text
Act as an Enterprise Database Architect and Security Engineer. We are hardening "CovenantWatch AI" for multi-tenant institutional banking compliance.

1. Relational Schema Design:
   Write a Prisma schema (`prisma/schema.prisma`) or SQL migration file for PostgreSQL/Supabase:
   - `Organization`: id, name, slug, tier, createdAt.
   - `User`: id, email, role ('PORTFOLIO_MANAGER' | 'CREDIT_ANALYST' | 'AUDITOR'), organizationId.
   - `Loan`: id, organizationId, loanNumber, borrowerName, propertyName, propertyType, grossLeasableAreaSqft, originalLoanAmount, currentUPB, interestRatePct, annualDebtService, marketCapRatePct, annualOpEx, status ('ACTIVE' | 'WATCHLIST' | 'DEFAULT' | 'PAID_OFF').
   - `Covenant`: id, loanId, minPhysicalOccupancyPct, minEconomicOccupancyPct, minDSCR, maxLTVPct, cashSweepDSCRThreshold, curePeriodDays.
   - `RentRollSnapshot`: id, loanId, snapshotMonth (DateTime), asOfDate, physicalOccupancyPct, economicOccupancyPct, annualizedNOI, calculatedDSCR, dynamicLTV, hasActiveBreach, isCashSweepTriggered.
   - `TenantLease`: id, rentRollSnapshotId, suiteId, tenantName, sqft, leaseStart, leaseEnd, monthlyBaseRent, status, paymentDelinquencyDays.
   - `CovenantAuditLog`: id, loanId, eventType ('BREACH_DETECTED' | 'CURE_NOTICE_SENT' | 'EQUITY_CURE_EXECUTED' | 'CASH_SWEEP_ACTIVATED'), payload (JSON), triggeredByUserId, timestamp.

2. Row-Level Security (RLS) & Multi-Tenancy:
   - Implement Supabase Row Level Security policies ensuring analysts can only read/write loans belonging to their assigned `organizationId`.
   - Create Prisma database seed scripts (`prisma/seed.ts`) that populate multiple enterprise organizations (e.g., "Pacific Rim Regional Bank" and "Apex Debt Fund I") with historical 12-month trailing snapshots to showcase trends over time.

3. Repository & Data Access Layer:
   - Create clean database service functions in `lib/services/loans.ts` that fetch loans with their latest evaluated snapshot and covenant thresholds.
   - Add database transactions to ensure that updating a rent roll snapshot and generating audit logs occur atomically.

```

---

### Prompt 3.2: Middleware Route Guards, RBAC & Role-Based Workflows

```text
Act as an Enterprise Application Security Architect. Implement authentication, role-based access control (RBAC), and security route guards for our application.

1. Route Protection & Auth Middleware (`middleware.ts`):
   - Configure Next.js Middleware with Supabase Auth or NextAuth.
   - Protect all application routes under `/dashboard`, `/loans/:path*`, and `/api/:path*`.
   - Validate session tokens, redirect unauthorized users to `/login`, and inject user identity headers into API requests.

2. Role-Based Permissions Engine:
   Implement a strict RBAC policy helper `lib/permissions.ts`:
   - `AUDITOR`: Read-only access to loans, calculations, and compliance audit histories.
   - `CREDIT_ANALYST`: Permission to upload rent rolls, edit tenant lines, run scenario simulations, and draft default notices.
   - `PORTFOLIO_MANAGER`: All analyst permissions plus the exclusive authorization to formally execute covenant default notices, trigger bank lockbox/cash sweeps, and adjust property baseline cap rates.

3. UI Permission Gates (`components/auth/PermissionGate.tsx`):
   - Create a reusable wrapper component that conditionally renders or disables action buttons (e.g., disabling "Execute Cash Sweep" and showing an "Requires Portfolio Manager approval" tooltip for Analysts).
   - Build a top navigation header with user profile menu, active organization switcher, and role indicator badge.

```

---

### Prompt 3.3: Interactive Analytics Visualizations (Recharts) & Unified Dark Mode

```text
Act as a Lead Data Visualization and UX Engineer. Enhance the application with high-performance charts and a unified dark/light visual design system.

1. Interactive Time-Series Charts with Recharts:
   Create `components/charts/CovenantTrendsChart.tsx` and `components/charts/LeaseRolloverChart.tsx`:
   - Historical Covenant Surveillance Chart:
     * Render a dual-axis line/area chart tracking 12 months of historical performance for a loan.
     * Line 1: In-Place DSCR over time; overlay a static red reference line at the `min_dscr` threshold (1.25x) and an amber dashed line at the `cash_sweep` threshold (1.15x).
     * Line 2: Dynamic LTV percentage over time with a reference ceiling at `max_ltv` (70%).
     * Tooltip: Custom tooltip showing NOI, revenue, and breach annotations for that month.
   - Lease Rollover & Expiration Schedule:
     * Bar chart showing square footage expiration schedule grouped by calendar year (Current Year, +1 Year, +2 Years, +3 Years, +4+ Years).
     * Visual flag highlighting years where cumulative lease rollover exceeds 25% of total building GLA (rollover concentration risk).

2. Enterprise UX & Theme System:
   - Implement `next-themes` for a polished Dark / Light mode toggle.
   - Refine the design system with semantic color tokens:
     * Dark Mode: Slate/Zinc deep obsidian backgrounds (`#090A0F`), subtle borders (`#1E222D`), emerald accents for compliant assets, rose badges for breach events.
     * Light Mode: Crisp off-white backgrounds (`#F8FAFC`), crisp neutral slate borders, accessible high-contrast text ratios for enterprise compliance (WCAG AAA).
   - Ensure all Recharts components dynamically adapt their grid lines, axis colors, and tooltip cards to theme changes without rendering bugs.

3. Final Polish:
   - Add search, filtering (by Property Type, Risk Severity, LTV Range), and sorting to the main loan table.
   - Add CSV export functionality for compliance audit logs.
   - Confirm complete error boundaries and zero console warnings across all views.

```