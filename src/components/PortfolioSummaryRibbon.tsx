import React from 'react';
import { ShieldAlert, AlertTriangle, CheckCircle2, Lock, ArrowUpRight, DollarSign, Activity } from 'lucide-react';
import { Loan, CovenantEvaluation } from '../types/cre';
import { formatCurrency, formatPercent } from '../lib/cre-calculator';

interface PortfolioSummaryRibbonProps {
  loans: Loan[];
  evaluations: Map<string, CovenantEvaluation>;
}

export const PortfolioSummaryRibbon: React.FC<PortfolioSummaryRibbonProps> = ({
  loans,
  evaluations,
}) => {
  // 1. Total Monitored Exposure
  const totalUPB = loans.reduce((acc, loan) => acc + loan.currentUPB, 0);

  // 2. Weighted Average Dynamic LTV
  let totalWeightedLTV = 0;
  let totalValidUPB = 0;
  loans.forEach((loan) => {
    const evalData = evaluations.get(loan.id);
    if (evalData && evalData.dynamicLTVPct < 200) {
      totalWeightedLTV += evalData.dynamicLTVPct * loan.currentUPB;
      totalValidUPB += loan.currentUPB;
    }
  });
  const weightedAvgLTV = totalValidUPB > 0 ? totalWeightedLTV / totalValidUPB : 0;

  // 3. Active Covenant Breaches Count
  let criticalBreachesCount = 0;
  let softWarningsCount = 0;
  let compliantCount = 0;
  let cashSweepUPB = 0;
  let cashSweepFacilitiesCount = 0;

  loans.forEach((loan) => {
    const evalData = evaluations.get(loan.id);
    if (!evalData) return;

    if (evalData.overallStatus === 'CASH_SWEEP_TRIGGERED') {
      criticalBreachesCount++;
      cashSweepUPB += loan.currentUPB;
      cashSweepFacilitiesCount++;
    } else if (evalData.overallStatus === 'CRITICAL_BREACH') {
      criticalBreachesCount++;
    } else if (evalData.overallStatus === 'SOFT_WARNING') {
      softWarningsCount++;
    } else {
      compliantCount++;
    }
  });

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {/* Card 1: Total Monitored Exposure */}
      <div className="organic-card organic-card-hover p-5 relative overflow-hidden flex flex-col justify-between">
        <div className="flex items-center justify-between text-warm-500 mb-2">
          <span className="text-xs font-semibold tracking-wider uppercase text-warm-600">
            Total Monitored Exposure
          </span>
          <div className="w-8 h-8 rounded-xl bg-warm-100 flex items-center justify-center text-warm-700">
            <DollarSign className="w-4 h-4" />
          </div>
        </div>
        <div>
          <div className="font-editorial text-3xl font-bold text-warm-900 tabular-nums">
            {formatCurrency(totalUPB, true)}
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-xs text-warm-500">
            <span className="inline-flex items-center text-sage-700 font-medium">
              <Activity className="w-3.5 h-3.5 mr-1 text-sage-600" />
              {loans.length} active facilities
            </span>
            <span className="text-warm-300">•</span>
            <span>100% evaluated</span>
          </div>
        </div>
        <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-gradient-to-br from-warm-100/50 to-warm-200/20 rounded-full blur-xl pointer-events-none" />
      </div>

      {/* Card 2: Weighted Average Dynamic LTV */}
      <div className="organic-card organic-card-hover p-5 relative overflow-hidden flex flex-col justify-between">
        <div className="flex items-center justify-between text-warm-500 mb-2">
          <span className="text-xs font-semibold tracking-wider uppercase text-warm-600">
            Portfolio Dynamic LTV
          </span>
          <div
            className={`w-8 h-8 rounded-xl flex items-center justify-center ${
              weightedAvgLTV <= 65
                ? 'bg-sage-100 text-sage-800'
                : weightedAvgLTV <= 75
                ? 'bg-terracotta-100 text-terracotta-800'
                : 'bg-brick-100 text-brick-800'
            }`}
          >
            <ArrowUpRight className="w-4 h-4" />
          </div>
        </div>
        <div>
          <div className="font-editorial text-3xl font-bold text-warm-900 tabular-nums">
            {formatPercent(weightedAvgLTV, 1)}
          </div>
          <div className="flex items-center gap-2 mt-2">
            <span
              className={`organic-pill px-2.5 py-0.5 text-xs ${
                weightedAvgLTV <= 65
                  ? 'bg-sage-50 text-sage-700 border border-sage-200'
                  : weightedAvgLTV <= 75
                  ? 'bg-terracotta-50 text-terracotta-700 border border-terracotta-200'
                  : 'bg-brick-50 text-brick-700 border border-brick-200'
              }`}
            >
              {weightedAvgLTV <= 65
                ? 'Healthy Cushion'
                : weightedAvgLTV <= 75
                ? 'Moderate Leverage'
                : 'High Risk Ceiling'}
            </span>
            <span className="text-xs text-warm-400">MtM Basis</span>
          </div>
        </div>
      </div>

      {/* Card 3: Covenant Compliance Health */}
      <div className="organic-card organic-card-hover p-5 relative overflow-hidden flex flex-col justify-between">
        <div className="flex items-center justify-between text-warm-500 mb-2">
          <span className="text-xs font-semibold tracking-wider uppercase text-warm-600">
            Active Covenant Breaches
          </span>
          <div
            className={`w-8 h-8 rounded-xl flex items-center justify-center ${
              criticalBreachesCount > 0
                ? 'bg-brick-100 text-brick-700'
                : softWarningsCount > 0
                ? 'bg-terracotta-100 text-terracotta-700'
                : 'bg-sage-100 text-sage-700'
            }`}
          >
            {criticalBreachesCount > 0 ? (
              <ShieldAlert className="w-4 h-4" />
            ) : softWarningsCount > 0 ? (
              <AlertTriangle className="w-4 h-4" />
            ) : (
              <CheckCircle2 className="w-4 h-4" />
            )}
          </div>
        </div>
        <div>
          <div className="font-editorial text-3xl font-bold text-warm-900 tabular-nums flex items-baseline gap-2">
            <span>{criticalBreachesCount}</span>
            <span className="text-sm font-sans font-normal text-warm-500">
              critical / {softWarningsCount} watchlist
            </span>
          </div>
          <div className="flex items-center gap-2 mt-2 text-xs">
            <span className="text-sage-700 font-medium">{compliantCount} Compliant</span>
            <span className="text-warm-300">•</span>
            <span className="text-brick-700 font-medium">{criticalBreachesCount} Default/Sweep</span>
          </div>
        </div>
      </div>

      {/* Card 4: Capital Under Cash Sweep */}
      <div className="organic-card organic-card-hover p-5 relative overflow-hidden flex flex-col justify-between border-terracotta-200/80 bg-gradient-to-br from-white via-white to-terracotta-50/30">
        <div className="flex items-center justify-between text-warm-500 mb-2">
          <span className="text-xs font-semibold tracking-wider uppercase text-warm-600">
            Capital Under Lockbox / Sweep
          </span>
          <div className="w-8 h-8 rounded-xl bg-terracotta-100 text-terracotta-800 flex items-center justify-center">
            <Lock className="w-4 h-4" />
          </div>
        </div>
        <div>
          <div className="font-editorial text-3xl font-bold text-warm-900 tabular-nums">
            {formatCurrency(cashSweepUPB, true)}
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-xs">
            {cashSweepFacilitiesCount > 0 ? (
              <span className="organic-pill px-2.5 py-0.5 bg-brick-100 text-brick-800 border border-brick-200 text-[11px] font-semibold">
                {cashSweepFacilitiesCount} Trapped Account{cashSweepFacilitiesCount > 1 ? 's' : ''}
              </span>
            ) : (
              <span className="organic-pill px-2.5 py-0.5 bg-sage-50 text-sage-700 border border-sage-200 text-[11px]">
                Zero Lockbox Triggers
              </span>
            )}
            <span className="text-warm-400">Cash diverted</span>
          </div>
        </div>
      </div>
    </section>
  );
};
