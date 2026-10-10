import { useState } from 'react';
import {
  X,
  Compass,
  BookOpen,
  Database,
  Users,
  DollarSign,
  Briefcase,
  Code2,
  Sparkles,
  Copy,
  Check,
  ChevronDown,
  ChevronRight,
  ShieldAlert,
  Layers,
  Award,
  TrendingUp,
  Cpu,
  FileCheck,
} from 'lucide-react';

interface AboutLearningDeckModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutLearningDeckModal: React.FC<AboutLearningDeckModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<number>(1);
  const [expandedPrompt, setExpandedPrompt] = useState<string | null>('prompt-1-1');
  const [copiedPromptId, setCopiedPromptId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopyPrompt = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPromptId(id);
    setTimeout(() => setCopiedPromptId(null), 2000);
  };

  const navItems = [
    { id: 1, label: '1. Problem & Core Concept', icon: Compass },
    { id: 2, label: '2. Required Domain Knowledge', icon: BookOpen },
    { id: 3, label: '3. Data Pipeline & Architecture', icon: Database },
    { id: 4, label: '4. Stakeholders & Personas', icon: Users },
    { id: 5, label: '5. Commercial Valuation & Agency Cost', icon: DollarSign },
    { id: 6, label: '6. College & Resume Strategy', icon: Briefcase },
    { id: 7, label: '7. AI Vibe-Coding Prompts', icon: Code2 },
    { id: 8, label: '8. Further Enhancements', icon: Sparkles },
  ];

  const promptsList = [
    {
      id: 'prompt-1-1',
      title: '1.1 Prompt 1.1: Project Scaffold, Domain Types & Deterministic Math Core',
      tier: 'Tier 1: MVP 1',
      content: `Act as a Principal Financial Systems Architect and Frontend Engineer. We are building the first prototype of "CovenantWatch AI," an institutional CRE (Commercial Real Estate) loan surveillance dashboard.

Stack: Vite, React, TypeScript, Tailwind CSS, Lucide React icons.
Zero external APIs, zero backend servers, zero database setups. Everything must run entirely in-browser with client-side state.

1. Domain TypeScript Interfaces:
   Create a dedicated file types/cre.ts with strict enterprise typing:
   - Tenant: id, suiteId, tenantName, sqft, leaseStart (ISO string), leaseEnd (ISO string), monthlyBaseRent, status ('Active' | 'Vacant'), paymentDelinquencyDays (number).
   - LoanCovenants: minPhysicalOccupancyPct, minEconomicOccupancyPct, minDSCR, maxLTVPct, cashSweepDSCRThreshold, curePeriodDays.
   - Loan: id, loanNumber, borrowerName, propertyName, propertyType ('Office' | 'Multifamily' | 'Industrial' | 'Retail'), grossLeasableAreaSqft, originalLoanAmount, currentUPB (Unpaid Principal Balance), interestRatePct, annualDebtService, marketCapRatePct, annualOpEx, covenants (LoanCovenants), rentRoll (Tenant[]).
   - BreachSeverity: 'NONE' | 'SOFT_WARNING' | 'CRITICAL_BREACH' | 'CASH_SWEEP_TRIGGERED'.
   - CovenantEvaluation: physicalOccupancyPct, economicOccupancyPct, annualNOI, dscr, dynamicPropertyValue, dynamicLTVPct, breaches (array of objects), cashSweepActive, equityCureAmountRequired.

2. Deterministic Calculation Utility:
   Create lib/cre-calculator.ts with pure, zero-hallucination mathematical logic:
   - Physical Occupancy = (sum of active sqft / grossLeasableAreaSqft) * 100
   - Annual Gross In-Place Rent = (sum of active monthlyBaseRent) * 12
   - Delinquent Rent Annualized = sum of (monthlyBaseRent * 12) for active tenants where paymentDelinquencyDays > 30
   - Effective Gross Income (EGI) = Annual Gross In-Place Rent - Delinquent Rent Annualized
   - Economic Occupancy = (EGI / Annual Gross In-Place Rent) * 100
   - Net Operating Income (NOI) = EGI - annualOpEx
   - DSCR = NOI / annualDebtService
   - Dynamic Valuation = NOI / (marketCapRatePct / 100)
   - Dynamic LTV = (currentUPB / Dynamic Valuation) * 100
   - Equity Cure Calculation: Calculate exact lump-sum principal paydown required on currentUPB to reset DSCR and LTV to target threshold.
   - Covenant Evaluator: Compares metrics against thresholds and tags breach severity.

3. Initial Mock Data:
   Create data/mock-loans.ts containing realistic institutional assets.`,
    },
    {
      id: 'prompt-1-2',
      title: '1.2 Prompt 1.2: Portfolio Exposure Board & Watchlist UI',
      tier: 'Tier 1: MVP 1',
      content: `Act as a Lead UI/UX Product Designer specialized in institutional FinTech and private credit platforms (style archetype: soft, organic, editorial aesthetic with warm off-white #FAFAF9 backgrounds, deep charcoal text, sage green, terracotta, and slate accents, rounded-2xl/3xl radii, and Fraunces serif headings).

Using the types and calculation engine created in Prompt 1.1, build the main portfolio dashboard view in App.tsx and modular components:

1. Portfolio KPI Summary Ribbon (components/PortfolioSummaryRibbon.tsx):
   Display 4 high-density metric cards:
   - Total Monitored Exposure (Sum of current UPB across all loans, formatted as currency).
   - Weighted Average Dynamic LTV (Color-coded badge: green if <= 65%, amber if 65-75%, red if > 75%).
   - Total Active Covenant Breaches (Highlighting critical counts).
   - Capital Under Cash Sweep (Total UPB of facilities with active lockbox triggers).

2. Loan Surveillance Watchlist (components/LoanWatchlistTable.tsx):
   A high-density financial table showing:
   - Loan ID & Property Name / Type / Borrower.
   - In-Place Physical vs. Economic Occupancy (Dual progress bar comparison).
   - In-Place DSCR (with color-coded pills: Red if below covenant, Amber if within cushion, Green if passing).
   - Dynamic LTV (Mark-to-market).
   - Covenant Status Badge ('Compliant', '30-Day Cure Notice', 'Cash Sweep Triggered').
   - Action Button: "Audit Loan" which selects that loan into active component state.`,
    },
    {
      id: 'prompt-1-3',
      title: '1.3 Prompt 1.3: Loan Drilldown, Rent Roll Editor & Instant Re-calculation',
      tier: 'Tier 1: MVP 1',
      content: `Act as a Senior Frontend Engineer. Now build the deep-dive inspection drawer and interactive scenario simulator when a loan is selected from the portfolio watchlist.

Create components/LoanInspectionDrawer.tsx and components/RentRollTable.tsx:

1. Dual-Panel Loan Detail View:
   - Left Panel (Credit Agreement Terms): Original balance, current UPB, interest rate, annual debt service, and covenant parameter cards.
   - Right Panel (Live Metric Status): Trailing calculated metrics side-by-side with required thresholds, rendering delta variances.

2. Interactive Rent Roll Table:
   Display the property's tenant roster with fields: Suite, Tenant Name, Square Footage, Expiration Date, Base Monthly Rent, Payment Delinquency Days, and Lease Status.
   - Provide an in-table toggle for each tenant: Toggle Status between 'Active' and 'Vacant', and adjust Delinquency Days via an inline stepper/select.
   - When any tenant's status or rent is modified, update the React state instantly with 0ms delay.
   - The entire calculation engine must recompute immediately, dynamically updating the KPI cards, LTV, DSCR, and firing/clearing the Cash Sweep alerts.

3. Legal Action & Equity Cure Calculator Panel:
   - Display the Equity Cure Calculator: "Borrower must inject $X,XXX,XXX to reduce principal to $XX,XXX,XXX to restore required 1.25x DSCR."
   - Add a button: "Generate Draft Default Notice" that opens a modal with a formatted formal legal letter citing the breached covenant clauses and specifying the 30-day cure deadline.`,
    },
    {
      id: 'prompt-2-1',
      title: '2.1 Prompt 2.1: Server-Side Pipeline & Live FRED Macro API Integration',
      tier: 'Tier 2: External APIs & Server Pipeline',
      content: `Act as a Senior Full-Stack Engineer and Financial Systems Integrator. Advance CovenantWatch AI from local state into a server-backed application with real-time economic feeds.

1. Secure Environment Configuration:
   Set up configuration validation checking for FRED_API_KEY (Federal Reserve Economic Data) and GEMINI_API_KEY.

2. Live Macroeconomic Data Ingestion (FRED API):
   Create a Server Route Handler api/market-data:
   - Fetch real-time market metrics from the St. Louis Fed (FRED) API:
     * 10-Year Treasury Constant Maturity Rate (Series: DGS10).
     * Commercial Real Estate Price Index / Cap Rate benchmark.
   - Implement caching (1-hour cache).
   - Fall back gracefully to institutional default constants without crashing.

3. Dynamic Mark-to-Market Valuation Engine:
   Update valuation engine so marketCapRatePct dynamically calculates based on:
   - Baseline Spread over live 10-Year Treasury yield + asset-class risk premium (e.g. Office = 10Y UST + 325 bps; Industrial = 10Y UST + 175 bps).`,
    },
    {
      id: 'prompt-2-2',
      title: '2.2 Prompt 2.2: LLM-Powered Unstructured Rent Roll & Agreement Parser',
      tier: 'Tier 2: External APIs & Server Pipeline',
      content: `Act as an AI Solutions Architect specializing in structured document extraction. Build the ingestion pipeline that allows asset managers to drop unstructured rent roll text or CSV files and normalize them against credit agreements.

1. Structured Output Schema Definition:
   Create a server route api/parse-rent-roll with strict JSON mode / structured schema:
   - tenants: Array of objects matching Tenant interface (normalized names, clean integers for sqft, base rent, lease expiries, arrears).
   - extraction_metadata: Confidence score, warnings array.

2. Document Ingestion API Handler:
   Accept raw text, unstandardized CSV string data, or OCR text from property PDFs (Yardi, MRI, RealPage).
   Strict system prompt: "You are an institutional commercial real estate credit audit agent. Parse the provided raw rent roll dump into a normalized JSON array. Strip header debris, normalize suite numbers, identify gross vs net rents, and flag delinquent amounts."

3. Ingestion Portal Component:
   Build a drag-and-drop file upload and raw text paste interface with realistic preset loaders and review table.`,
    },
    {
      id: 'prompt-2-3',
      title: '2.3 Prompt 2.3: Automated Remediation Workflow & Default Notice AI Drafter',
      tier: 'Tier 2: External APIs & Server Pipeline',
      content: `Act as a Commercial Banking Workflow Specialist. When a covenant breach is detected, the asset manager needs an automated remediation module that generates auditable notices and credit committee memos.

1. Memo Generation Endpoint:
   Create an endpoint that takes a loanId, current CovenantEvaluation, and agreement terms to draft two distinct legal documents:
   - Document A: Formal Notice of Default & Demand for Cure addressed to borrower (cites Section 8.2(b), exact mathematical shortfall, 30-day cure deadline, cash sweep lockbox diversion).
   - Document B: Internal Credit Committee Risk Memorandum (executive deterioration summary, risk rating downgrade, CECL capital reserve provisioning).

2. Interactive Notice Studio UI:
   - Tabbed viewer toggling between Default Notice, Committee Memo, and Cure Proof Worksheet.
   - Markdown/Text viewer with Copy, Print/PDF, and Servicing Portal dispatch simulation.`,
    },
    {
      id: 'prompt-3-1',
      title: '3.1 Prompt 3.1: Supabase/Postgres Persistence Layer & RLS Multi-Tenancy',
      tier: 'Tier 3: Enterprise Scaling',
      content: `Act as an Enterprise Database Architect. Write a PostgreSQL/Prisma schema with multi-tenancy:
- Organization, User (Roles: AUDITOR, CREDIT_ANALYST, PORTFOLIO_MANAGER), Loan, Covenant, RentRollSnapshot, TenantLease, CovenantAuditLog.
- Implement Row Level Security (RLS) policies ensuring analysts can only view loans within their assigned organization.
- Seed database with 12-month trailing snapshots for institutional credit funds.`,
    },
    {
      id: 'prompt-3-2',
      title: '3.2 Prompt 3.2: Analytics Visualizations & Unified Theme System',
      tier: 'Tier 3: Enterprise Scaling',
      content: `Act as a Lead Data Visualization Engineer. Build high-performance financial charts:
- 12-Month Historical Surveillance Trajectory (Dual-axis Line/Area chart for DSCR & LTV with reference lines for minimum DSCR 1.25x and cash sweep 1.15x).
- Lease Rollover Expiration Schedule (Bar chart showing square footage expiration schedule grouped by calendar year with >25% rollover risk flag).`,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-warm-950/60 backdrop-blur-md p-3 sm:p-6 overflow-y-auto">
      <div className="organic-card bg-white w-full max-w-6xl max-h-[94vh] flex flex-col shadow-soft-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 border-warm-300">
        {/* Modal Header */}
        <div className="p-5 border-b border-warm-200 bg-warm-100/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-warm-900 text-warm-50 flex items-center justify-center shadow-soft">
              <Compass className="w-5 h-5 text-sage-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-editorial text-xl font-bold text-warm-900">
                  CovenantWatch AI Learning Deck & Systems Architecture
                </h2>
                <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-sage-100 text-sage-800 border border-sage-200">
                  Domain Masterclass
                </span>
              </div>
              <p className="text-xs text-warm-500">
                A complete commercial real estate debt surveillance blueprint for engineers, product builders, and analysts.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-warm-400 hover:text-warm-700 hover:bg-warm-200 rounded-2xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dual Panel Body */}
        <div className="grid grid-cols-1 md:grid-cols-12 flex-1 overflow-hidden min-h-[580px]">
          {/* Left Navigation (4 Cols) */}
          <div className="md:col-span-4 p-4 border-r border-warm-200 bg-warm-50/70 overflow-y-auto space-y-1.5 text-xs">
            <span className="text-[11px] font-bold text-warm-500 uppercase tracking-wider px-3 mb-2 block">
              Curriculum Modules
            </span>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-left font-medium transition-all ${
                    isActive
                      ? 'bg-warm-900 text-warm-50 shadow-soft font-semibold'
                      : 'text-warm-700 hover:bg-warm-200/70 hover:text-warm-900'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 shrink-0 ${
                      isActive ? 'text-sage-300' : 'text-warm-500'
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}

            <div className="mt-6 p-4 rounded-2xl bg-white border border-warm-200 shadow-soft-sm space-y-2">
              <span className="text-[11px] font-bold text-warm-900 uppercase tracking-wider block">
                Target Architecture
              </span>
              <div className="flex items-center gap-1.5 text-[11px] text-warm-600">
                <span className="w-2 h-2 rounded-full bg-sage-500"></span>
                <span>Deterministic Math Core (0% Hallucination)</span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-warm-600">
                <span className="w-2 h-2 rounded-full bg-terracotta-500"></span>
                <span>Direct Cap Valuation Engine</span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-warm-600">
                <span className="w-2 h-2 rounded-full bg-brick-500"></span>
                <span>Automated Lockbox Cash Sweep</span>
              </div>
            </div>
          </div>

          {/* Right Content Panel (8 Cols) */}
          <div className="md:col-span-8 p-6 overflow-y-auto max-h-[75vh] space-y-6 bg-white">
            {/* TAB 1: Problem & Core Concept */}
            {activeTab === 1 && (
              <div className="space-y-5 animate-in fade-in duration-200">
                <div>
                  <div className="flex items-center gap-2 text-sage-800 font-semibold text-xs mb-1">
                    <Compass className="w-4 h-4 text-sage-600" />
                    <span>Executive Problem Statement</span>
                  </div>
                  <h3 className="font-editorial text-2xl font-bold text-warm-900">
                    The Business Problem: The "Lag to Default" in CRE Debt
                  </h3>
                  <p className="text-xs text-warm-600 mt-2 leading-relaxed">
                    Regional banks, private credit funds, and debt servicers hold hundreds of billions in commercial real estate loans. Every loan is governed by strict contractual <strong>maintenance covenants</strong> (e.g. maintaining minimum 85% occupancy, 1.25x DSCR, or max 70% LTV). However, nearly the entire industry suffers from an operational blind spot.
                  </p>
                </div>

                {/* Problem Flow Diagram */}
                <div className="p-4 rounded-3xl bg-warm-50 border border-warm-200 space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-warm-600">
                    The Problem Flow (Why Banks Lose Millions):
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-center font-medium">
                    <div className="p-3 bg-terracotta-50 border border-terracotta-200 text-terracotta-900 rounded-2xl">
                      <strong>1. Messy Roster Dump</strong>
                      <p className="text-[11px] text-terracotta-700 mt-1">
                        Borrowers email unstandardized Excel / PDF rent rolls monthly.
                      </p>
                    </div>
                    <div className="p-3 bg-amber-50 border border-amber-200 text-amber-900 rounded-2xl">
                      <strong>2. 60–90 Day Review Lag</strong>
                      <p className="text-[11px] text-amber-700 mt-1">
                        Analysts manually transcribe spreadsheets cell-by-cell.
                      </p>
                    </div>
                    <div className="p-3 bg-brick-50 border border-brick-200 text-brick-900 rounded-2xl">
                      <strong>3. Missed Mitigation Window</strong>
                      <p className="text-[11px] text-brick-700 mt-1">
                        Anchor vacates in Feb; bank discovers breach in June when cash is exhausted.
                      </p>
                    </div>
                  </div>
                </div>

                {/* The Solution */}
                <div className="p-5 rounded-3xl bg-sage-50/80 border border-sage-200 space-y-2 text-xs">
                  <h4 className="font-editorial text-base font-bold text-sage-950 flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-sage-700" />
                    <span>The Solution: Real-Time Deterministic Covenant Surveillance</span>
                  </h4>
                  <p className="text-warm-700 leading-relaxed">
                    <strong>CovenantWatch AI</strong> continuously normalizes incoming property rosters, immediately recalculates core ratios (EGI, NOI, DSCR, dynamic valuation, mark-to-market LTV), evaluates covenant triggers, and automatically executes remediation workflows (Equity Cure calculations and Lockbox Cash Sweep legal notices) the millisecond an operational threshold is violated.
                  </p>
                </div>
              </div>
            )}

            {/* TAB 2: Required Domain Knowledge */}
            {activeTab === 2 && (
              <div className="space-y-5 animate-in fade-in duration-200">
                <div>
                  <h3 className="font-editorial text-2xl font-bold text-warm-900">
                    Required Domain Knowledge & CRE Finance Principles
                  </h3>
                  <p className="text-xs text-warm-600 mt-1">
                    To build institutional banking software, engineers must master standard commercial lending concepts.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {/* Concept 1 */}
                  <div className="p-4 bg-warm-50 border border-warm-200 rounded-2xl space-y-1.5">
                    <span className="font-bold text-warm-900 text-sm block">
                      1. Net Operating Income (NOI)
                    </span>
                    <p className="text-warm-600 leading-relaxed text-[11px]">
                      <strong>NOI = Effective Gross Income (EGI) - Operating Expenses (OpEx)</strong>.
                      Excludes debt service (P+I), owner CapEx, tenant improvements, and depreciation.
                    </p>
                  </div>

                  {/* Concept 2 */}
                  <div className="p-4 bg-warm-50 border border-warm-200 rounded-2xl space-y-1.5">
                    <span className="font-bold text-warm-900 text-sm block">
                      2. Debt Service Coverage Ratio (DSCR)
                    </span>
                    <p className="text-warm-600 leading-relaxed text-[11px]">
                      <strong>DSCR = Annual In-Place NOI / Annual Debt Service</strong>. Standard benchmark is &ge; 1.25x. If DSCR falls below 1.15x, an automatic <strong>Cash Sweep</strong> is triggered.
                    </p>
                  </div>

                  {/* Concept 3 */}
                  <div className="p-4 bg-warm-50 border border-warm-200 rounded-2xl space-y-1.5">
                    <span className="font-bold text-warm-900 text-sm block">
                      3. Dynamic Mark-to-Market LTV
                    </span>
                    <p className="text-warm-600 leading-relaxed text-[11px]">
                      <strong>Dynamic Value = NOI / Market Cap Rate</strong>. <strong>Dynamic LTV = (Current UPB / Dynamic Value) &times; 100</strong>. Allows continuous valuation without paying $5k for fresh appraisals.
                    </p>
                  </div>

                  {/* Concept 4 */}
                  <div className="p-4 bg-warm-50 border border-warm-200 rounded-2xl space-y-1.5">
                    <span className="font-bold text-warm-900 text-sm block">
                      4. Physical vs. Economic Occupancy
                    </span>
                    <p className="text-warm-600 leading-relaxed text-[11px]">
                      <strong>Physical:</strong> Occupied SqFt / Total GLA. <strong>Economic:</strong> Collected Gross Cash / Gross Potential Rent. Penalizes tenant arrears (&gt;30 days past due).
                    </p>
                  </div>

                  {/* Concept 5 */}
                  <div className="p-4 bg-warm-50 border border-warm-200 rounded-2xl space-y-1.5">
                    <span className="font-bold text-warm-900 text-sm block">
                      5. Equity Cure Right
                    </span>
                    <p className="text-warm-600 leading-relaxed text-[11px]">
                      Contractual clause permitting the borrower a 30-day window to inject cash or make a lump-sum principal curtailment to restore compliant DSCR/LTV.
                    </p>
                  </div>

                  {/* Concept 6 */}
                  <div className="p-4 bg-warm-50 border border-warm-200 rounded-2xl space-y-1.5">
                    <span className="font-bold text-warm-900 text-sm block">
                      6. Cash Sweep / Lockbox Diversion
                    </span>
                    <p className="text-warm-600 leading-relaxed text-[11px]">
                      Lender seizes property bank accounts. Tenant rent is diverted straight to lender; owner distributions are frozen until compliance holds for 2 quarters.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: Data Pipeline & Architecture */}
            {activeTab === 3 && (
              <div className="space-y-5 animate-in fade-in duration-200">
                <div>
                  <h3 className="font-editorial text-2xl font-bold text-warm-900">
                    High-Level Systems Architecture & Data Flow
                  </h3>
                  <p className="text-xs text-warm-600 mt-1">
                    How data moves from raw tenant rosters to deterministic risk state machines.
                  </p>
                </div>

                {/* 4-Stage Architectural Pipeline */}
                <div className="space-y-3 text-xs">
                  <div className="p-4 bg-warm-50 border border-warm-200 rounded-2xl flex items-start gap-3.5">
                    <div className="w-8 h-8 rounded-xl bg-warm-900 text-warm-50 flex items-center justify-center font-bold shrink-0">
                      1
                    </div>
                    <div>
                      <span className="font-bold text-warm-900 text-sm">
                        Ingestion & Normalization Engine
                      </span>
                      <p className="text-warm-600 mt-0.5 leading-relaxed">
                        Accepts raw CSV/XLSX or OCR text from property managers. Normalizes column variants (`"Lessee"`, `"Unit"`, `"Rent"`, `"Arrears"`) into a clean TypeScript `Tenant[]` schema.
                      </p>
                    </div>
                  </div>

                  <div className="p-4 bg-warm-50 border border-warm-200 rounded-2xl flex items-start gap-3.5">
                    <div className="w-8 h-8 rounded-xl bg-sage-800 text-warm-50 flex items-center justify-center font-bold shrink-0">
                      2
                    </div>
                    <div>
                      <span className="font-bold text-warm-900 text-sm">
                        Deterministic Financial Calculator Core
                      </span>
                      <p className="text-warm-600 mt-0.5 leading-relaxed">
                        Pure mathematical functions (<code>lib/cre-calculator.ts</code>). Computes in-place EGI, OpEx load, NOI, DSCR, dynamic valuation, mark-to-market LTV, and exact equity cure dollar amounts with <strong>zero LLM math hallucination</strong>.
                      </p>
                    </div>
                  </div>

                  <div className="p-4 bg-warm-50 border border-warm-200 rounded-2xl flex items-start gap-3.5">
                    <div className="w-8 h-8 rounded-xl bg-terracotta-700 text-warm-50 flex items-center justify-center font-bold shrink-0">
                      3
                    </div>
                    <div>
                      <span className="font-bold text-warm-900 text-sm">
                        Covenant Surveillance & Risk State Machine
                      </span>
                      <p className="text-warm-600 mt-0.5 leading-relaxed">
                        Compares outputs against credit agreement parameters (`min_dscr`, `max_ltv`, `min_occupancy`). Classifies facility status into <code>COMPLIANT</code>, <code>SOFT_WARNING</code>, <code>CRITICAL_BREACH</code>, or <code>CASH_SWEEP_TRIGGERED</code>.
                      </p>
                    </div>
                  </div>

                  <div className="p-4 bg-warm-50 border border-warm-200 rounded-2xl flex items-start gap-3.5">
                    <div className="w-8 h-8 rounded-xl bg-brick-800 text-warm-50 flex items-center justify-center font-bold shrink-0">
                      4
                    </div>
                    <div>
                      <span className="font-bold text-warm-900 text-sm">
                        Automated Remediation & Legal Studio
                      </span>
                      <p className="text-warm-600 mt-0.5 leading-relaxed">
                        Generates formal 30-day Default Notices for borrowers and Internal Credit Committee Risk Memorandums detailing CECL reserve impacts and lockbox orders.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: Stakeholders & User Personas */}
            {activeTab === 4 && (
              <div className="space-y-5 animate-in fade-in duration-200">
                <div>
                  <h3 className="font-editorial text-2xl font-bold text-warm-900">
                    Stakeholders & User Personas
                  </h3>
                  <p className="text-xs text-warm-600 mt-1">
                    Who uses CovenantWatch AI across the institutional commercial lending lifecycle.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                  <div className="p-4 bg-warm-50 border border-warm-200 rounded-2xl space-y-2">
                    <div className="flex items-center gap-2 text-warm-900 font-bold text-sm">
                      <Users className="w-4 h-4 text-warm-700" />
                      <span>Credit Analysts & Asset Managers</span>
                    </div>
                    <p className="text-warm-600 leading-relaxed text-[11px]">
                      <strong>Role:</strong> Primary daily operators. Ingest monthly rent rolls, audit arrears, simulate tenant defaults, and review delta variances in real-time without building manual Excel models.
                    </p>
                  </div>

                  <div className="p-4 bg-warm-50 border border-warm-200 rounded-2xl space-y-2">
                    <div className="flex items-center gap-2 text-warm-900 font-bold text-sm">
                      <Briefcase className="w-4 h-4 text-sage-700" />
                      <span>Portfolio Managers / Fund Directors</span>
                    </div>
                    <p className="text-warm-600 leading-relaxed text-[11px]">
                      <strong>Role:</strong> Portfolio oversight. Track weighted average LTV, monitor capital under cash sweep, and authorize formal default notices or equity cure forbearance.
                    </p>
                  </div>

                  <div className="p-4 bg-warm-50 border border-warm-200 rounded-2xl space-y-2">
                    <div className="flex items-center gap-2 text-warm-900 font-bold text-sm">
                      <ShieldAlert className="w-4 h-4 text-terracotta-700" />
                      <span>Chief Credit Officers & Risk Committees</span>
                    </div>
                    <p className="text-warm-600 leading-relaxed text-[11px]">
                      <strong>Role:</strong> Risk governance. Evaluate CECL (Current Expected Credit Losses) reserve allocations, regulatory risk rating downgrades, and portfolio stress limits.
                    </p>
                  </div>

                  <div className="p-4 bg-warm-50 border border-warm-200 rounded-2xl space-y-2">
                    <div className="flex items-center gap-2 text-warm-900 font-bold text-sm">
                      <Award className="w-4 h-4 text-brick-700" />
                      <span>Bank Regulators & Auditors (Fed / OCC / FDIC)</span>
                    </div>
                    <p className="text-warm-600 leading-relaxed text-[11px]">
                      <strong>Role:</strong> Compliance verification. Review transparent, deterministic audit trails verifying that covenants were evaluated on time and properly classified.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 5: Commercial Valuation & Agency Economics */}
            {activeTab === 5 && (
              <div className="space-y-5 animate-in fade-in duration-200">
                <div>
                  <h3 className="font-editorial text-2xl font-bold text-warm-900">
                    Commercial Valuation & External Consulting Economics
                  </h3>
                  <p className="text-xs text-warm-600 mt-1">
                    What top-tier digital engineering firms (McKinsey, BCG Platinion, Accenture, Slalom) charge to design, architect, and deliver this vertical FinTech platform.
                  </p>
                </div>

                {/* Pricing Breakdown Table */}
                <div className="border border-warm-200 rounded-2xl overflow-hidden text-xs">
                  <table className="w-full text-left">
                    <thead className="bg-warm-100/80 text-warm-700 font-semibold uppercase text-[10px]">
                      <tr>
                        <th className="py-2.5 px-4">Phase & Deliverables</th>
                        <th className="py-2.5 px-3">Timeline</th>
                        <th className="py-2.5 px-3 text-right">Agency Cost</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-warm-100 bg-white">
                      <tr>
                        <td className="py-3 px-4">
                          <strong className="text-warm-900 block">1. Discovery & CRE Domain Architecture</strong>
                          <span className="text-warm-500 text-[11px]">
                            Credit agreement schema design, covenant logic, CECL reserve mapping
                          </span>
                        </td>
                        <td className="py-3 px-3 text-warm-600">4–6 Weeks</td>
                        <td className="py-3 px-3 text-right font-bold text-warm-900">$85,000 – $120,000</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4">
                          <strong className="text-warm-900 block">2. Editorial Design System & UI/UX</strong>
                          <span className="text-warm-500 text-[11px]">
                            High-density financial UX, typography, responsive surveillance dashboards
                          </span>
                        </td>
                        <td className="py-3 px-3 text-warm-600">3–4 Weeks</td>
                        <td className="py-3 px-3 text-right font-bold text-warm-900">$45,000 – $65,000</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4">
                          <strong className="text-warm-900 block">3. Deterministic Core & Full-Stack Engine</strong>
                          <span className="text-warm-500 text-[11px]">
                            Direct cap valuation, DSCR/LTV math, rent roll editor, remediation engine
                          </span>
                        </td>
                        <td className="py-3 px-3 text-warm-600">10–12 Weeks</td>
                        <td className="py-3 px-3 text-right font-bold text-warm-900">$180,000 – $240,000</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4">
                          <strong className="text-warm-900 block">4. QA, Compliance & Production Deployment</strong>
                          <span className="text-warm-500 text-[11px]">
                            Mathematical test suites, stress testing, security auditing, CI/CD
                          </span>
                        </td>
                        <td className="py-3 px-3 text-warm-600">4 Weeks</td>
                        <td className="py-3 px-3 text-right font-bold text-warm-900">$50,000 – $75,000</td>
                      </tr>
                      <tr className="bg-sage-50/80 font-bold">
                        <td className="py-3 px-4 text-sage-950">Total Commercial Build Value</td>
                        <td className="py-3 px-3 text-sage-900">5–7 Months</td>
                        <td className="py-3 px-3 text-right text-sage-950 font-editorial text-base">
                          $360,000 – $500,000+
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="p-4 rounded-2xl bg-warm-100/70 border border-warm-200 text-xs text-warm-700 leading-relaxed">
                  💡 <strong>SaaS Licensing Model:</strong> Institutional debt surveillance platforms (like Trepp or Moody's Analytics) command annual enterprise seat licenses ranging from <strong>$25,000 to $100,000+ per lender</strong> based on asset under management (AUM) tiers.
                </div>
              </div>
            )}

            {/* TAB 6: College Application & Resume Strategy */}
            {activeTab === 6 && (
              <div className="space-y-5 animate-in fade-in duration-200">
                <div>
                  <h3 className="font-editorial text-2xl font-bold text-warm-900">
                    College Application & Career Differentiation Strategy
                  </h3>
                  <p className="text-xs text-warm-600 mt-1">
                    Why building vertical risk infrastructure makes you stand out over generic CRUD portfolio projects.
                  </p>
                </div>

                <div className="p-5 rounded-3xl bg-warm-50 border border-warm-200 space-y-3 text-xs">
                  <h4 className="font-editorial text-base font-bold text-warm-900">
                    The Competitive Edge: Deep Vertical Domain Knowledge
                  </h4>
                  <p className="text-warm-700 leading-relaxed">
                    95% of engineering student portfolios contain basic todo lists, e-commerce stores, or weather apps. Recruiters and admissions committees at top universities (Stanford, MIT, Wharton, Columbia) look for <strong>domain depth</strong> and <strong>high-stakes business logic</strong>. Building CovenantWatch AI demonstrates that you understand banking regulations, debt covenants, and deterministic risk modeling.
                  </p>
                </div>

                {/* Ready-to-use Resume Bullets */}
                <div className="space-y-2 text-xs">
                  <span className="font-bold text-warm-900 uppercase tracking-wider block">
                    Copy-Paste Resume Bullet Points:
                  </span>
                  <div className="p-4 bg-white border border-warm-200 rounded-2xl space-y-2 font-mono text-[11px] text-warm-800">
                    <div>
                      • <strong>Architected Commercial Real Estate Debt Surveillance Engine:</strong> Engineered a deterministic React/TypeScript surveillance platform monitoring $122M+ in credit exposure, eliminating a 60–90 day review lag for lenders.
                    </div>
                    <div>
                      • <strong>Implemented Pure Mathematical Valuation Pipelines:</strong> Built zero-hallucination calculation models for in-place NOI, DSCR, dynamic direct-cap valuation, and Mark-to-Market LTV with 0ms reactive recalculation.
                    </div>
                    <div>
                      • <strong>Automated Legal Remedy Workflows:</strong> Created state machines that trigger Lockbox Cash Sweeps and compute precise Equity Cure principal curtailments with printable default notices and CECL committee memos.
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 7: AI Vibe-Coding Prompts Runway */}
            {activeTab === 7 && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-editorial text-2xl font-bold text-warm-900">
                      AI Vibe-Coding Prompt Runway
                    </h3>
                    <p className="text-xs text-warm-600 mt-0.5">
                      Click any prompt block below to review and copy the exact engineering prompts used to build this dashboard.
                    </p>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-warm-100 text-warm-700 border border-warm-200">
                    {promptsList.length} Prompts
                  </span>
                </div>

                <div className="space-y-3">
                  {promptsList.map((p) => {
                    const isExpanded = expandedPrompt === p.id;
                    const isCopied = copiedPromptId === p.id;

                    return (
                      <div
                        key={p.id}
                        className="organic-card overflow-hidden border border-warm-200 bg-white"
                      >
                        <div
                          onClick={() => setExpandedPrompt(isExpanded ? null : p.id)}
                          className="p-3.5 bg-warm-50/80 hover:bg-warm-100/80 cursor-pointer flex items-center justify-between gap-3 text-xs transition-colors"
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="px-2 py-0.5 rounded-lg bg-warm-200 text-warm-800 font-mono font-bold text-[10px]">
                              {p.tier}
                            </span>
                            <span className="font-bold text-warm-900">{p.title}</span>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCopyPrompt(p.id, p.content);
                              }}
                              className="p-1.5 hover:bg-white rounded-lg text-warm-600 hover:text-warm-900 transition-colors"
                              title="Copy prompt text"
                            >
                              {isCopied ? (
                                <Check className="w-3.5 h-3.5 text-sage-600" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                            {isExpanded ? (
                              <ChevronDown className="w-4 h-4 text-warm-400" />
                            ) : (
                              <ChevronRight className="w-4 h-4 text-warm-400" />
                            )}
                          </div>
                        </div>

                        {isExpanded && (
                          <div className="p-4 bg-warm-900 text-warm-100 font-mono text-[11px] whitespace-pre-wrap leading-relaxed overflow-x-auto max-h-72 border-t border-warm-800">
                            {p.content}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 8: Further Enhancements */}
            {activeTab === 8 && (
              <div className="space-y-5 animate-in fade-in duration-200">
                <div>
                  <h3 className="font-editorial text-2xl font-bold text-warm-900">
                    Future Roadmap & Enterprise Enhancements
                  </h3>
                  <p className="text-xs text-warm-600 mt-1">
                    Advanced capabilities to take CovenantWatch AI from MVP to multi-million dollar enterprise SaaS.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                  <div className="p-4 bg-warm-50 border border-warm-200 rounded-2xl space-y-2">
                    <div className="flex items-center gap-2 text-warm-900 font-bold text-sm">
                      <TrendingUp className="w-4 h-4 text-sage-700" />
                      <span>1. Live FRED Treasury Spread Feed</span>
                    </div>
                    <p className="text-warm-600 leading-relaxed text-[11px]">
                      Connect real-time St. Louis Fed API series (DGS10) to automatically adjust baseline cap rate spreads based on fluctuating macroeconomic bond yields.
                    </p>
                  </div>

                  <div className="p-4 bg-warm-50 border border-warm-200 rounded-2xl space-y-2">
                    <div className="flex items-center gap-2 text-warm-900 font-bold text-sm">
                      <Cpu className="w-4 h-4 text-terracotta-700" />
                      <span>2. Multimodal OCR Rent Roll Parser</span>
                    </div>
                    <p className="text-warm-600 leading-relaxed text-[11px]">
                      Ingest scanned PDF property reports and complex multi-tab Excel workbooks from Yardi Voyager and MRI Software using structured JSON mode.
                    </p>
                  </div>

                  <div className="p-4 bg-warm-50 border border-warm-200 rounded-2xl space-y-2">
                    <div className="flex items-center gap-2 text-warm-900 font-bold text-sm">
                      <Layers className="w-4 h-4 text-brick-700" />
                      <span>3. Supabase Multi-Tenancy & RLS</span>
                    </div>
                    <p className="text-warm-600 leading-relaxed text-[11px]">
                      PostgreSQL persistence with Row-Level Security separating private credit fund divisions with RBAC permissions (Analyst vs Portfolio Manager vs Auditor).
                    </p>
                  </div>

                  <div className="p-4 bg-warm-50 border border-warm-200 rounded-2xl space-y-2">
                    <div className="flex items-center gap-2 text-warm-900 font-bold text-sm">
                      <FileCheck className="w-4 h-4 text-warm-700" />
                      <span>4. E-Signature Borrower Servicing Portal</span>
                    </div>
                    <p className="text-warm-600 leading-relaxed text-[11px]">
                      Direct transmission of default cure demand letters to borrower portals with certified tracking, DocuSign integration, and automated bank lockbox routing.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-warm-200 bg-warm-100/70 flex items-center justify-between text-xs text-warm-500">
          <span>CRE Covenant Surveillance Masterclass • CovenantWatch AI</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-warm-900 hover:bg-warm-800 text-warm-50 font-medium rounded-xl transition-colors shadow-soft"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};
