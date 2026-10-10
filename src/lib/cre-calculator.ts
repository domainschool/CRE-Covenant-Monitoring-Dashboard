import { Loan, CovenantEvaluation, BreachItem, BreachSeverity, RiskRating } from '../types/cre';

/**
 * Pure deterministic financial calculator for Commercial Real Estate (CRE) loan surveillance.
 * Never relies on probabilistic LLM text generation for math.
 */

export function evaluateCRECovenants(
  loan: Loan,
  customCapRate?: number,
  customOpEx?: number
): CovenantEvaluation {
  const totalGLA = Math.max(1, loan.grossLeasableAreaSqft);
  const activeTenants = loan.rentRoll.filter((t) => t.status === 'Active');
  
  // 1. Physical Occupancy
  const occupiedSqft = activeTenants.reduce((sum, t) => sum + (t.sqft || 0), 0);
  const physicalOccupancyPct = (occupiedSqft / totalGLA) * 100;

  // 2. Gross In-Place Annual Rent
  const monthlyInPlaceRent = activeTenants.reduce((sum, t) => sum + (t.monthlyBaseRent || 0), 0);
  const grossInPlaceAnnualRent = monthlyInPlaceRent * 12;

  // 3. Delinquent Rent Annualized (> 30 days past due)
  const delinquentActiveTenants = activeTenants.filter((t) => t.paymentDelinquencyDays > 30);
  const delinquentAnnualRent = delinquentActiveTenants.reduce(
    (sum, t) => sum + (t.monthlyBaseRent || 0) * 12,
    0
  );

  // 4. Effective Gross Income (EGI)
  const effectiveGrossIncome = Math.max(0, grossInPlaceAnnualRent - delinquentAnnualRent);

  // 5. Economic Occupancy (%)
  const economicOccupancyPct =
    grossInPlaceAnnualRent > 0
      ? (effectiveGrossIncome / grossInPlaceAnnualRent) * 100
      : 0;

  // 6. Net Operating Income (NOI)
  const annualOpEx = customOpEx !== undefined ? customOpEx : loan.annualOpEx;
  const annualNOI = effectiveGrossIncome - annualOpEx;

  // 7. Debt Service Coverage Ratio (DSCR)
  const annualDebtService = Math.max(1, loan.annualDebtService);
  const dscr = annualDebtService > 0 ? annualNOI / annualDebtService : 0;

  // 8. Dynamic Mark-to-Market Valuation
  const effectiveCapRate = (customCapRate !== undefined ? customCapRate : loan.marketCapRatePct) / 100;
  const dynamicPropertyValue =
    effectiveCapRate > 0 && annualNOI > 0 ? annualNOI / effectiveCapRate : 0;

  // 9. Dynamic Mark-to-Market LTV (%)
  const currentUPB = Math.max(0, loan.currentUPB);
  const dynamicLTVPct =
    dynamicPropertyValue > 0 ? (currentUPB / dynamicPropertyValue) * 100 : 999;

  const originalAppraisedValue =
    loan.covenants.maxLTVPct > 0
      ? (loan.originalLoanAmount / (loan.covenants.maxLTVPct / 100))
      : loan.originalLoanAmount;
  const originalLTVPct =
    originalAppraisedValue > 0 ? (loan.originalLoanAmount / originalAppraisedValue) * 100 : 70;

  // 10. Covenant Evaluation & Breach Identification
  const covenants = loan.covenants;
  const breaches: BreachItem[] = [];

  // Minimum Physical Occupancy
  if (physicalOccupancyPct < covenants.minPhysicalOccupancyPct) {
    const delta = physicalOccupancyPct - covenants.minPhysicalOccupancyPct;
    breaches.push({
      id: 'breach-phys-occ',
      covenantName: 'Minimum Physical Occupancy',
      covenantKey: 'PHYSICAL_OCCUPANCY',
      threshold: covenants.minPhysicalOccupancyPct,
      actual: Number(physicalOccupancyPct.toFixed(2)),
      unit: '%',
      severity: delta < -10 ? 'CRITICAL_BREACH' : 'SOFT_WARNING',
      delta: Number(delta.toFixed(2)),
      message: `Physical occupancy of ${physicalOccupancyPct.toFixed(1)}% is below required floor of ${covenants.minPhysicalOccupancyPct.toFixed(1)}% (shortfall: ${Math.abs(delta).toFixed(1)}%).`,
      actionRequired: 'Initiate leasing audit & re-tenanting plan.',
    });
  }

  // Minimum Economic Occupancy
  if (economicOccupancyPct < covenants.minEconomicOccupancyPct) {
    const delta = economicOccupancyPct - covenants.minEconomicOccupancyPct;
    breaches.push({
      id: 'breach-econ-occ',
      covenantName: 'Minimum Economic Occupancy',
      covenantKey: 'ECONOMIC_OCCUPANCY',
      threshold: covenants.minEconomicOccupancyPct,
      actual: Number(economicOccupancyPct.toFixed(2)),
      unit: '%',
      severity: delta < -10 ? 'CRITICAL_BREACH' : 'SOFT_WARNING',
      delta: Number(delta.toFixed(2)),
      message: `Economic cash collection of ${economicOccupancyPct.toFixed(1)}% is below contractual requirement of ${covenants.minEconomicOccupancyPct.toFixed(1)}% due to rent arrears.`,
      actionRequired: 'Issue formal 10-day cure notices to delinquent tenants.',
    });
  }

  // Debt Service Coverage Ratio (DSCR) & Cash Sweep
  const isCashSweep = dscr < covenants.cashSweepDSCRThreshold;
  const isDscrBreached = dscr < covenants.minDSCR;

  if (isDscrBreached) {
    const delta = dscr - covenants.minDSCR;
    breaches.push({
      id: 'breach-dscr',
      covenantName: 'Minimum DSCR Coverage',
      covenantKey: 'DSCR',
      threshold: covenants.minDSCR,
      actual: Number(dscr.toFixed(2)),
      unit: 'x',
      severity: isCashSweep ? 'CASH_SWEEP_TRIGGERED' : 'CRITICAL_BREACH',
      delta: Number(delta.toFixed(2)),
      message: isCashSweep
        ? `DSCR at ${dscr.toFixed(2)}x breached the critical Cash Sweep threshold (${covenants.cashSweepDSCRThreshold.toFixed(2)}x). Hard lockbox diversion triggered.`
        : `DSCR at ${dscr.toFixed(2)}x is below required covenant floor of ${covenants.minDSCR.toFixed(2)}x (deficit of ${Math.abs(delta).toFixed(2)}x).`,
      actionRequired: isCashSweep
        ? 'Execute Lockbox Cash Sweep & trap all tenant rental income.'
        : 'Demand immediate borrower Equity Cure injection or principal curtailment.',
    });
  }

  // Maximum Dynamic LTV
  if (dynamicLTVPct > covenants.maxLTVPct) {
    const delta = dynamicLTVPct - covenants.maxLTVPct;
    breaches.push({
      id: 'breach-ltv',
      covenantName: 'Maximum Dynamic Mark-to-Market LTV',
      covenantKey: 'LTV',
      threshold: covenants.maxLTVPct,
      actual: Number(dynamicLTVPct.toFixed(1)),
      unit: '%',
      severity: delta > 10 ? 'CRITICAL_BREACH' : 'SOFT_WARNING',
      delta: Number(delta.toFixed(1)),
      message: `Mark-to-market dynamic LTV is ${dynamicLTVPct.toFixed(1)}%, exceeding allowable maximum ceiling of ${covenants.maxLTVPct.toFixed(1)}% by +${delta.toFixed(1)}%.`,
      actionRequired: 'Require principal paydown or supplemental collateral pledge.',
    });
  }

  // 11. Deterministic Equity Cure Calculation
  // Target UPB to satisfy LTV
  const targetUPBForLTV = dynamicPropertyValue * (covenants.maxLTVPct / 100);
  const paydownForLTV = Math.max(0, currentUPB - targetUPBForLTV);

  // Target UPB to satisfy DSCR
  // DSCR = NOI / DebtService >= minDSCR => DebtService <= NOI / minDSCR
  // Assuming loan constant K = annualDebtService / currentUPB
  const loanConstant = currentUPB > 0 ? annualDebtService / currentUPB : 0.08;
  const targetDebtService = covenants.minDSCR > 0 && annualNOI > 0 ? annualNOI / covenants.minDSCR : 0;
  const targetUPBForDSCR = loanConstant > 0 ? targetDebtService / loanConstant : 0;
  const paydownForDSCR = Math.max(0, currentUPB - targetUPBForDSCR);

  // Total required equity cure is the maximum paydown needed to cure both DSCR and LTV
  const equityCureRequired = Math.max(paydownForDSCR, paydownForLTV);

  // Overall Severity
  let overallStatus: BreachSeverity = 'NONE';
  if (isCashSweep || breaches.some((b) => b.severity === 'CASH_SWEEP_TRIGGERED')) {
    overallStatus = 'CASH_SWEEP_TRIGGERED';
  } else if (breaches.some((b) => b.severity === 'CRITICAL_BREACH')) {
    overallStatus = 'CRITICAL_BREACH';
  } else if (breaches.some((b) => b.severity === 'SOFT_WARNING')) {
    overallStatus = 'SOFT_WARNING';
  }

  // Recommended Regulatory Risk Rating
  let recommendedRiskRating: RiskRating = 'Pass / Low Risk';
  if (overallStatus === 'CASH_SWEEP_TRIGGERED' || dscr < 1.0) {
    recommendedRiskRating = 'Substandard / Watchlist';
  } else if (overallStatus === 'CRITICAL_BREACH') {
    recommendedRiskRating = 'Special Mention';
  } else if (overallStatus === 'SOFT_WARNING' || dscr < covenants.minDSCR + 0.05) {
    recommendedRiskRating = 'Special Mention';
  }

  return {
    physicalOccupancyPct: Number(physicalOccupancyPct.toFixed(2)),
    economicOccupancyPct: Number(economicOccupancyPct.toFixed(2)),
    occupiedSqft,
    totalGLA,
    grossInPlaceAnnualRent: Number(grossInPlaceAnnualRent.toFixed(2)),
    delinquentAnnualRent: Number(delinquentAnnualRent.toFixed(2)),
    effectiveGrossIncome: Number(effectiveGrossIncome.toFixed(2)),
    annualNOI: Number(annualNOI.toFixed(2)),
    annualDebtService: Number(annualDebtService.toFixed(2)),
    dscr: Number(dscr.toFixed(2)),
    dynamicPropertyValue: Number(dynamicPropertyValue.toFixed(2)),
    dynamicLTVPct: Number(dynamicLTVPct.toFixed(1)),
    originalLTVPct: Number(originalLTVPct.toFixed(1)),
    breaches,
    overallStatus,
    cashSweepActive: isCashSweep,
    equityCureRequired: Number(equityCureRequired.toFixed(2)),
    targetUPBForDSCR: Number(targetUPBForDSCR.toFixed(2)),
    targetUPBForLTV: Number(targetUPBForLTV.toFixed(2)),
    recommendedRiskRating,
    cureDaysRemaining: covenants.curePeriodDays,
  };
}

/**
 * Currency formatter helper
 */
export function formatCurrency(amount: number, compact: boolean = false): string {
  if (isNaN(amount)) return '$0';
  if (compact) {
    if (Math.abs(amount) >= 1_000_000) {
      return `$${(amount / 1_000_000).toFixed(2)}M`;
    }
    if (Math.abs(amount) >= 1_000) {
      return `$${(amount / 1_000).toFixed(0)}k`;
    }
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Percentage formatter helper
 */
export function formatPercent(value: number, decimals: number = 1): string {
  if (isNaN(value)) return '0.0%';
  return `${value.toFixed(decimals)}%`;
}

/**
 * Ratio / DSCR formatter helper
 */
export function formatRatio(value: number, decimals: number = 2): string {
  if (isNaN(value)) return '0.00x';
  return `${value.toFixed(decimals)}x`;
}
