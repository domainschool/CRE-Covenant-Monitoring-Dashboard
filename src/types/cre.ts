export type PropertyType = 'Office' | 'Industrial' | 'Multifamily' | 'Retail' | 'Mixed-Use';

export type TenantStatus = 'Active' | 'Vacant';

export type BreachSeverity = 'NONE' | 'SOFT_WARNING' | 'CRITICAL_BREACH' | 'CASH_SWEEP_TRIGGERED';

export type RiskRating = 'Pass / Low Risk' | 'Special Mention' | 'Substandard / Watchlist' | 'Doubtful';

export interface Tenant {
  id: string;
  suiteId: string;
  tenantName: string;
  sqft: number;
  leaseStart: string | null;
  leaseEnd: string | null;
  monthlyBaseRent: number;
  status: TenantStatus;
  paymentDelinquencyDays: number;
  industry?: string;
  isAnchor?: boolean;
}

export interface LoanCovenants {
  minPhysicalOccupancyPct: number; // e.g. 85.0
  minEconomicOccupancyPct: number; // e.g. 80.0
  minDSCR: number;                 // e.g. 1.25
  maxLTVPct: number;               // e.g. 70.0
  cashSweepDSCRThreshold: number;  // e.g. 1.15
  curePeriodDays: number;          // e.g. 30
}

export interface HistoricalSnapshot {
  month: string; // e.g. 'Oct 2025'
  noi: number;
  dscr: number;
  ltvPct: number;
  physicalOccupancyPct: number;
  economicOccupancyPct: number;
  isBreached: boolean;
}

export interface Loan {
  id: string;
  loanNumber: string;
  borrowerName: string;
  borrowerContact: string;
  propertyName: string;
  propertyAddress: string;
  propertyType: PropertyType;
  originationDate: string;
  maturityDate: string;
  grossLeasableAreaSqft: number;
  originalLoanAmount: number;
  currentUPB: number; // Unpaid Principal Balance
  interestRatePct: number;
  annualDebtService: number; // Principal + Interest
  marketCapRatePct: number; // Baseline market cap rate
  annualOpEx: number; // Property taxes, insurance, management, CAM
  covenants: LoanCovenants;
  rentRoll: Tenant[];
  historicalSnapshots?: HistoricalSnapshot[];
}

export interface BreachItem {
  id: string;
  covenantName: string;
  covenantKey: 'DSCR' | 'LTV' | 'PHYSICAL_OCCUPANCY' | 'ECONOMIC_OCCUPANCY';
  threshold: number;
  actual: number;
  unit: string;
  severity: BreachSeverity;
  message: string;
  delta: number;
  actionRequired: string;
}

export interface CovenantEvaluation {
  // Ratios & Financials
  physicalOccupancyPct: number;
  economicOccupancyPct: number;
  occupiedSqft: number;
  totalGLA: number;
  grossInPlaceAnnualRent: number;
  delinquentAnnualRent: number;
  effectiveGrossIncome: number;
  annualNOI: number;
  annualDebtService: number;
  dscr: number;
  dynamicPropertyValue: number;
  dynamicLTVPct: number;
  originalLTVPct: number;
  
  // Breaches & Remediation
  breaches: BreachItem[];
  overallStatus: BreachSeverity;
  cashSweepActive: boolean;
  equityCureRequired: number; // In dollars to bring back into compliance
  targetUPBForDSCR: number;
  targetUPBForLTV: number;
  recommendedRiskRating: RiskRating;
  cureDaysRemaining: number;
}
