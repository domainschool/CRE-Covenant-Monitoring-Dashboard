import {
  X,
  Building,
  ShieldAlert,
  CheckCircle2,
  Lock,
  FileText,
  Sliders,
  Scale,
} from 'lucide-react';
import { Loan, CovenantEvaluation } from '../types/cre';
import { formatCurrency, formatPercent, formatRatio } from '../lib/cre-calculator';

interface LoanInspectionDrawerProps {
  loan: Loan;
  evaluation: CovenantEvaluation;
  onClose: () => void;
  onOpenRemediation: () => void;
  customCapRate: number;
  onCapRateChange: (rate: number) => void;
  customOpEx: number;
  onOpExChange: (opex: number) => void;
}

export const LoanInspectionDrawer: React.FC<LoanInspectionDrawerProps> = ({
  loan,
  evaluation,
  onClose,
  onOpenRemediation,
  customCapRate,
  onCapRateChange,
  customOpEx,
  onOpExChange,
}) => {
  const covenants = loan.covenants;
  const isCashSweep = evaluation.cashSweepActive;
  const hasBreaches = evaluation.breaches.length > 0;

  return (
    <div className="organic-card overflow-hidden mb-8 border-warm-300">
      {/* Drawer Header */}
      <div className="p-5 border-b border-warm-200 bg-warm-100/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-2xl flex items-center justify-center border shadow-soft-sm ${
              isCashSweep
                ? 'bg-brick-100 text-brick-800 border-brick-200'
                : hasBreaches
                ? 'bg-terracotta-100 text-terracotta-800 border-terracotta-200'
                : 'bg-sage-100 text-sage-800 border-sage-200'
            }`}
          >
            <Building className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-editorial text-xl font-bold text-warm-900">
                {loan.propertyName}
              </h2>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-white text-warm-800 border border-warm-200">
                {loan.propertyType}
              </span>
            </div>
            <p className="text-xs text-warm-500">
              Facility: <span className="font-mono text-warm-700">{loan.loanNumber}</span> • Borrower: <span className="font-semibold text-warm-800">{loan.borrowerName}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {hasBreaches && (
            <button
              onClick={onOpenRemediation}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-terracotta-700 hover:bg-terracotta-800 rounded-2xl shadow-soft transition-all active:scale-[0.98]"
            >
              <FileText className="w-4 h-4 text-terracotta-200" />
              <span>Remediation Studio & Default Notice</span>
            </button>
          )}
          <button
            onClick={onClose}
            className="p-2 text-warm-400 hover:text-warm-700 hover:bg-warm-200/80 rounded-2xl transition-colors"
            title="Close inspection panel"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Dual Panel Body */}
      <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-warm-200 bg-white">
        {/* Left Panel: Credit Agreement Terms & Stress Inputs (5 Cols) */}
        <div className="lg:col-span-5 p-6 space-y-6 bg-warm-50/40">
          <div>
            <h3 className="font-editorial text-base font-bold text-warm-900 flex items-center gap-2">
              <Scale className="w-4 h-4 text-warm-600" />
              <span>Credit Agreement Parameters</span>
            </h3>
            <p className="text-xs text-warm-500 mt-0.5">
              Contractual baseline terms governing loan facility covenants.
            </p>
          </div>

          {/* Core Loan Terms Grid */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-white border border-warm-200 rounded-2xl">
              <span className="text-warm-500 text-[11px]">Original Loan Balance</span>
              <div className="font-bold text-warm-900 text-sm mt-0.5 tabular-nums">
                {formatCurrency(loan.originalLoanAmount)}
              </div>
            </div>

            <div className="p-3 bg-white border border-warm-200 rounded-2xl">
              <span className="text-warm-500 text-[11px]">Current Unpaid Balance (UPB)</span>
              <div className="font-bold text-warm-900 text-sm mt-0.5 tabular-nums">
                {formatCurrency(loan.currentUPB)}
              </div>
            </div>

            <div className="p-3 bg-white border border-warm-200 rounded-2xl">
              <span className="text-warm-500 text-[11px]">Contract Interest Rate</span>
              <div className="font-bold text-warm-900 text-sm mt-0.5 tabular-nums">
                {loan.interestRatePct.toFixed(2)}% Fixed
              </div>
            </div>

            <div className="p-3 bg-white border border-warm-200 rounded-2xl">
              <span className="text-warm-500 text-[11px]">Annual Debt Service (P+I)</span>
              <div className="font-bold text-warm-900 text-sm mt-0.5 tabular-nums">
                {formatCurrency(loan.annualDebtService)}/yr
              </div>
            </div>
          </div>

          {/* Covenant Thresholds Summary */}
          <div className="p-4 bg-white border border-warm-200 rounded-3xl space-y-3">
            <span className="text-xs font-semibold text-warm-800 uppercase tracking-wider block">
              Contractual Maintenance Covenants
            </span>

            <div className="space-y-2 text-xs divide-y divide-warm-100">
              <div className="flex justify-between items-center pt-1.5">
                <span className="text-warm-600">Minimum DSCR Floor</span>
                <span className="font-bold text-warm-900 font-mono bg-warm-100 px-2 py-0.5 rounded-lg">
                  {formatRatio(covenants.minDSCR)}
                </span>
              </div>
              <div className="flex justify-between items-center pt-1.5">
                <span className="text-warm-600">Cash Sweep DSCR Lockbox</span>
                <span className="font-bold text-brick-700 font-mono bg-brick-50 px-2 py-0.5 rounded-lg border border-brick-200">
                  {formatRatio(covenants.cashSweepDSCRThreshold)}
                </span>
              </div>
              <div className="flex justify-between items-center pt-1.5">
                <span className="text-warm-600">Maximum Mark-to-Market LTV</span>
                <span className="font-bold text-warm-900 font-mono bg-warm-100 px-2 py-0.5 rounded-lg">
                  {formatPercent(covenants.maxLTVPct, 1)}
                </span>
              </div>
              <div className="flex justify-between items-center pt-1.5">
                <span className="text-warm-600">Minimum Physical Occupancy</span>
                <span className="font-bold text-warm-900 font-mono bg-warm-100 px-2 py-0.5 rounded-lg">
                  {formatPercent(covenants.minPhysicalOccupancyPct, 1)}
                </span>
              </div>
              <div className="flex justify-between items-center pt-1.5">
                <span className="text-warm-600">Contractual Cure Period</span>
                <span className="font-bold text-warm-900 font-mono bg-warm-100 px-2 py-0.5 rounded-lg">
                  {covenants.curePeriodDays} Days
                </span>
              </div>
            </div>
          </div>

          {/* Interactive Valuation Stress Controls */}
          <div className="p-4 bg-warm-100/70 border border-warm-200 rounded-3xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-warm-900 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-warm-600" />
                <span>Market Direct-Cap & OpEx Stress</span>
              </span>
              <button
                onClick={() => {
                  onCapRateChange(loan.marketCapRatePct);
                  onOpExChange(loan.annualOpEx);
                }}
                className="text-[11px] text-warm-500 hover:text-warm-800 underline"
              >
                Reset
              </button>
            </div>

            {/* Cap Rate Slider */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-warm-600">Market Cap Rate:</span>
                <span className="font-bold text-warm-900 font-mono">{customCapRate.toFixed(2)}%</span>
              </div>
              <input
                type="range"
                min={4.5}
                max={10.5}
                step={0.125}
                value={customCapRate}
                onChange={(e) => onCapRateChange(parseFloat(e.target.value))}
                className="w-full accent-sage-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-warm-400 mt-0.5">
                <span>4.50% (Tight)</span>
                <span>Baseline: {loan.marketCapRatePct}%</span>
                <span>10.50% (Distressed)</span>
              </div>
            </div>

            {/* OpEx Slider */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-warm-600">Annual OpEx:</span>
                <span className="font-bold text-warm-900 font-mono">{formatCurrency(customOpEx)}</span>
              </div>
              <input
                type="range"
                min={loan.annualOpEx * 0.7}
                max={loan.annualOpEx * 1.6}
                step={25000}
                value={customOpEx}
                onChange={(e) => onOpExChange(parseFloat(e.target.value))}
                className="w-full accent-sage-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-warm-400 mt-0.5">
                <span>-30%</span>
                <span>Baseline: {formatCurrency(loan.annualOpEx, true)}</span>
                <span>+60% Shock</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel: Live Calculated Metrics, Variances & Action Center (7 Cols) */}
        <div className="lg:col-span-7 p-6 space-y-6">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="font-editorial text-base font-bold text-warm-900">
                Live Calculated Metrics & Covenant Deltas
              </h3>
              <span
                className={`organic-pill px-3 py-1 text-xs font-bold ${
                  evaluation.recommendedRiskRating === 'Pass / Low Risk'
                    ? 'bg-sage-100 text-sage-800 border border-sage-300'
                    : evaluation.recommendedRiskRating === 'Special Mention'
                    ? 'bg-amber-100 text-amber-900 border border-amber-300'
                    : 'bg-brick-100 text-brick-900 border border-brick-300'
                }`}
              >
                Risk Rating: {evaluation.recommendedRiskRating}
              </span>
            </div>
            <p className="text-xs text-warm-500 mt-0.5">
              Instant mark-to-market calculations reflecting in-place rent collection and expense load.
            </p>
          </div>

          {/* High-Impact 4-Metric Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {/* DSCR Metric Card */}
            <div
              className={`p-4 rounded-3xl border transition-all ${
                evaluation.dscr < covenants.cashSweepDSCRThreshold
                  ? 'bg-brick-50/60 border-brick-300'
                  : evaluation.dscr < covenants.minDSCR
                  ? 'bg-terracotta-50/60 border-terracotta-300'
                  : 'bg-warm-50/60 border-warm-200'
              }`}
            >
              <div className="flex justify-between items-start text-warm-600">
                <span className="font-semibold text-warm-700">In-Place DSCR</span>
                <span
                  className={`text-[11px] font-bold px-2 py-0.5 rounded-lg ${
                    evaluation.dscr < covenants.cashSweepDSCRThreshold
                      ? 'bg-brick-200 text-brick-900'
                      : evaluation.dscr < covenants.minDSCR
                      ? 'bg-terracotta-200 text-terracotta-900'
                      : 'bg-sage-100 text-sage-800'
                  }`}
                >
                  Req: {formatRatio(covenants.minDSCR)}
                </span>
              </div>
              <div className="font-editorial text-3xl font-bold text-warm-900 mt-2 tabular-nums">
                {formatRatio(evaluation.dscr)}
              </div>
              <div className="flex items-center gap-1.5 mt-2 text-xs">
                <span
                  className={`font-semibold ${
                    evaluation.dscr >= covenants.minDSCR
                      ? 'text-sage-700'
                      : 'text-brick-700'
                  }`}
                >
                  Delta: {(evaluation.dscr - covenants.minDSCR >= 0 ? '+' : '') +
                    (evaluation.dscr - covenants.minDSCR).toFixed(2)}x
                </span>
                <span className="text-warm-400">•</span>
                <span className="text-warm-500">NOI: {formatCurrency(evaluation.annualNOI, true)}</span>
              </div>
            </div>

            {/* Dynamic Valuation & LTV */}
            <div
              className={`p-4 rounded-3xl border transition-all ${
                evaluation.dynamicLTVPct > covenants.maxLTVPct
                  ? 'bg-brick-50/60 border-brick-300'
                  : 'bg-warm-50/60 border-warm-200'
              }`}
            >
              <div className="flex justify-between items-start text-warm-600">
                <span className="font-semibold text-warm-700">Dynamic LTV (MtM)</span>
                <span
                  className={`text-[11px] font-bold px-2 py-0.5 rounded-lg ${
                    evaluation.dynamicLTVPct > covenants.maxLTVPct
                      ? 'bg-brick-200 text-brick-900'
                      : 'bg-sage-100 text-sage-800'
                  }`}
                >
                  Max: {formatPercent(covenants.maxLTVPct, 0)}
                </span>
              </div>
              <div className="font-editorial text-3xl font-bold text-warm-900 mt-2 tabular-nums">
                {formatPercent(evaluation.dynamicLTVPct, 1)}
              </div>
              <div className="flex items-center gap-1.5 mt-2 text-xs">
                <span
                  className={`font-semibold ${
                    evaluation.dynamicLTVPct <= covenants.maxLTVPct
                      ? 'text-sage-700'
                      : 'text-brick-700'
                  }`}
                >
                  Delta: {(evaluation.dynamicLTVPct - covenants.maxLTVPct > 0 ? '+' : '') +
                    (evaluation.dynamicLTVPct - covenants.maxLTVPct).toFixed(1)}%
                </span>
                <span className="text-warm-400">•</span>
                <span className="text-warm-500">Val: {formatCurrency(evaluation.dynamicPropertyValue, true)}</span>
              </div>
            </div>

            {/* Physical Occupancy */}
            <div className="p-4 rounded-3xl border border-warm-200 bg-warm-50/40">
              <div className="flex justify-between text-warm-600">
                <span className="font-semibold text-warm-700">Physical Occupancy</span>
                <span className="text-[11px] text-warm-500">Req: {formatPercent(covenants.minPhysicalOccupancyPct, 0)}</span>
              </div>
              <div className="font-editorial text-2xl font-bold text-warm-900 mt-2 tabular-nums">
                {formatPercent(evaluation.physicalOccupancyPct, 1)}
              </div>
              <div className="text-[11px] text-warm-500 mt-1">
                Occupied: {evaluation.occupiedSqft.toLocaleString()} / {evaluation.totalGLA.toLocaleString()} sqft
              </div>
            </div>

            {/* Economic Occupancy */}
            <div className="p-4 rounded-3xl border border-warm-200 bg-warm-50/40">
              <div className="flex justify-between text-warm-600">
                <span className="font-semibold text-warm-700">Economic Occupancy</span>
                <span className="text-[11px] text-warm-500">Req: {formatPercent(covenants.minEconomicOccupancyPct, 0)}</span>
              </div>
              <div className="font-editorial text-2xl font-bold text-warm-900 mt-2 tabular-nums">
                {formatPercent(evaluation.economicOccupancyPct, 1)}
              </div>
              <div className="text-[11px] text-warm-500 mt-1">
                EGI: {formatCurrency(evaluation.effectiveGrossIncome, true)} / Gross: {formatCurrency(evaluation.grossInPlaceAnnualRent, true)}
              </div>
            </div>
          </div>

          {/* Equity Cure Remediation Box */}
          {hasBreaches ? (
            <div className="p-5 rounded-3xl bg-gradient-to-br from-terracotta-50/90 to-brick-50/60 border border-terracotta-300 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-brick-700" />
                  <h4 className="font-editorial font-bold text-base text-brick-950">
                    Covenant Breach Remediation & Equity Cure
                  </h4>
                </div>
                {isCashSweep && (
                  <span className="organic-pill px-2.5 py-0.5 bg-brick-800 text-white text-[11px] font-bold">
                    <Lock className="w-3 h-3" /> Cash Sweep Triggered
                  </span>
                )}
              </div>

              <p className="text-xs text-warm-700 leading-relaxed">
                Under Credit Agreement Section 8.2, borrower has a <span className="font-semibold text-warm-900">{covenants.curePeriodDays}-day contractual cure period</span>.
                To eliminate technical default and restore compliant DSCR ({formatRatio(covenants.minDSCR)}) and LTV ({formatPercent(covenants.maxLTVPct, 0)}), the borrower must execute an immediate principal curtailment:
              </p>

              <div className="p-4 bg-white/90 rounded-2xl border border-terracotta-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div>
                  <span className="text-[11px] uppercase tracking-wider font-semibold text-terracotta-900">
                    Required Equity Cure Principal Paydown
                  </span>
                  <div className="font-editorial text-2xl font-bold text-brick-900 tabular-nums">
                    {formatCurrency(evaluation.equityCureRequired)}
                  </div>
                </div>

                <button
                  onClick={onOpenRemediation}
                  className="px-4 py-2 bg-warm-900 hover:bg-warm-800 text-warm-50 rounded-2xl text-xs font-semibold shadow-soft flex items-center gap-1.5 transition-all"
                >
                  <FileText className="w-3.5 h-3.5 text-sage-300" />
                  <span>Draft Default Notice & Memo</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="p-5 rounded-3xl bg-sage-50/80 border border-sage-200 flex items-center gap-3 text-xs text-sage-900">
              <CheckCircle2 className="w-5 h-5 text-sage-600 shrink-0" />
              <div>
                <span className="font-bold text-sm block text-sage-950">All Covenant Maintenance Floors Satisfied</span>
                This facility maintains a healthy cushion over minimum DSCR floor and dynamic LTV ceilings. No remediation required.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
