import React, { useState } from 'react';
import {
  Building,
  AlertTriangle,
  ShieldAlert,
  CheckCircle2,
  Lock,
  ChevronRight,
  ArrowUpDown,
} from 'lucide-react';
import { Loan, CovenantEvaluation } from '../types/cre';
import { formatCurrency, formatPercent, formatRatio } from '../lib/cre-calculator';

interface LoanWatchlistTableProps {
  loans: Loan[];
  evaluations: Map<string, CovenantEvaluation>;
  selectedLoanId: string | null;
  onSelectLoan: (loanId: string) => void;
  searchQuery: string;
}

export const LoanWatchlistTable: React.FC<LoanWatchlistTableProps> = ({
  loans,
  evaluations,
  selectedLoanId,
  onSelectLoan,
  searchQuery,
}) => {
  const [propertyTypeFilter, setPropertyTypeFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'UPB' | 'DSCR' | 'LTV' | 'NAME'>('DSCR');
  const [sortAsc, setSortAsc] = useState<boolean>(true);

  // Filter loans
  const filteredLoans = loans.filter((loan) => {
    // Search query matching
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      loan.propertyName.toLowerCase().includes(q) ||
      loan.borrowerName.toLowerCase().includes(q) ||
      loan.loanNumber.toLowerCase().includes(q) ||
      loan.propertyAddress.toLowerCase().includes(q);

    if (!matchesSearch) return false;

    // Property type filter
    if (propertyTypeFilter !== 'ALL' && loan.propertyType !== propertyTypeFilter) {
      return false;
    }

    // Status filter
    const evalData = evaluations.get(loan.id);
    if (!evalData) return true;

    if (statusFilter === 'BREACH_ONLY') {
      return (
        evalData.overallStatus === 'CRITICAL_BREACH' ||
        evalData.overallStatus === 'CASH_SWEEP_TRIGGERED'
      );
    }
    if (statusFilter === 'CASH_SWEEP_ONLY') {
      return evalData.overallStatus === 'CASH_SWEEP_TRIGGERED';
    }
    if (statusFilter === 'COMPLIANT_ONLY') {
      return evalData.overallStatus === 'NONE';
    }

    return true;
  });

  // Sort loans
  filteredLoans.sort((a, b) => {
    const evalA = evaluations.get(a.id);
    const evalB = evaluations.get(b.id);
    let diff = 0;

    if (sortBy === 'UPB') {
      diff = b.currentUPB - a.currentUPB;
    } else if (sortBy === 'DSCR') {
      const dscrA = evalA ? evalA.dscr : 0;
      const dscrB = evalB ? evalB.dscr : 0;
      diff = dscrA - dscrB;
    } else if (sortBy === 'LTV') {
      const ltvA = evalA ? evalA.dynamicLTVPct : 0;
      const ltvB = evalB ? evalB.dynamicLTVPct : 0;
      diff = ltvB - ltvA;
    } else if (sortBy === 'NAME') {
      diff = a.propertyName.localeCompare(b.propertyName);
    }

    return sortAsc ? diff : -diff;
  });

  return (
    <div className="organic-card overflow-hidden mb-8">
      {/* Table Controls & Filters Header */}
      <div className="p-5 border-b border-warm-200 bg-white flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-editorial text-xl font-bold text-warm-900">
              Loan Surveillance Watchlist
            </h2>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-warm-100 text-warm-700 border border-warm-200">
              {filteredLoans.length} of {loans.length} Facilities
            </span>
          </div>
          <p className="text-xs text-warm-500 mt-0.5">
            Real-time covenant compliance, mark-to-market valuations, and lockbox trigger monitoring
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center flex-wrap gap-2 text-xs">
          <div className="flex items-center bg-warm-100 p-1 rounded-2xl border border-warm-200">
            {['ALL', 'Office', 'Industrial', 'Multifamily', 'Retail'].map((type) => (
              <button
                key={type}
                onClick={() => setPropertyTypeFilter(type)}
                className={`px-3 py-1 rounded-xl font-medium transition-all ${
                  propertyTypeFilter === type
                    ? 'bg-white text-warm-900 shadow-soft-sm font-semibold'
                    : 'text-warm-600 hover:text-warm-900'
                }`}
              >
                {type === 'ALL' ? 'All Types' : type}
              </button>
            ))}
          </div>

          <div className="flex items-center bg-warm-100 p-1 rounded-2xl border border-warm-200">
            {[
              { label: 'All Health', value: 'ALL' },
              { label: 'Breaches', value: 'BREACH_ONLY' },
              { label: 'Cash Sweeps', value: 'CASH_SWEEP_ONLY' },
              { label: 'Compliant', value: 'COMPLIANT_ONLY' },
            ].map((st) => (
              <button
                key={st.value}
                onClick={() => setStatusFilter(st.value)}
                className={`px-3 py-1 rounded-xl font-medium transition-all ${
                  statusFilter === st.value
                    ? 'bg-white text-warm-900 shadow-soft-sm font-semibold'
                    : 'text-warm-600 hover:text-warm-900'
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table View */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-warm-100/70 border-b border-warm-200 text-warm-600 font-semibold uppercase tracking-wider text-[11px]">
              <th
                className="py-3 px-5 cursor-pointer hover:text-warm-900 transition-colors"
                onClick={() => {
                  if (sortBy === 'NAME') setSortAsc(!sortAsc);
                  else {
                    setSortBy('NAME');
                    setSortAsc(true);
                  }
                }}
              >
                <div className="flex items-center gap-1">
                  <span>Facility & Borrower</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th
                className="py-3 px-4 cursor-pointer hover:text-warm-900 transition-colors"
                onClick={() => {
                  if (sortBy === 'UPB') setSortAsc(!sortAsc);
                  else {
                    setSortBy('UPB');
                    setSortAsc(false);
                  }
                }}
              >
                <div className="flex items-center gap-1">
                  <span>Exposure (UPB)</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-3 px-4">Occupancy (Phys / Econ)</th>
              <th
                className="py-3 px-4 cursor-pointer hover:text-warm-900 transition-colors"
                onClick={() => {
                  if (sortBy === 'DSCR') setSortAsc(!sortAsc);
                  else {
                    setSortBy('DSCR');
                    setSortAsc(true);
                  }
                }}
              >
                <div className="flex items-center gap-1">
                  <span>In-Place DSCR</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th
                className="py-3 px-4 cursor-pointer hover:text-warm-900 transition-colors"
                onClick={() => {
                  if (sortBy === 'LTV') setSortAsc(!sortAsc);
                  else {
                    setSortBy('LTV');
                    setSortAsc(false);
                  }
                }}
              >
                <div className="flex items-center gap-1">
                  <span>Dynamic LTV (MtM)</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-3 px-4">Covenant Status</th>
              <th className="py-3 px-5 text-right">Surveillance Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-warm-200/80 bg-white">
            {filteredLoans.map((loan) => {
              const evalData = evaluations.get(loan.id);
              const isSelected = selectedLoanId === loan.id;

              if (!evalData) return null;

              const isCashSweep = evalData.overallStatus === 'CASH_SWEEP_TRIGGERED';
              const isCriticalBreach = evalData.overallStatus === 'CRITICAL_BREACH';
              const isSoftWarning = evalData.overallStatus === 'SOFT_WARNING';

              return (
                <tr
                  key={loan.id}
                  onClick={() => onSelectLoan(loan.id)}
                  className={`cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-sage-50/70 hover:bg-sage-50'
                      : isCashSweep
                      ? 'hover:bg-brick-50/40'
                      : isCriticalBreach
                      ? 'hover:bg-terracotta-50/40'
                      : 'hover:bg-warm-50'
                  }`}
                >
                  {/* Column 1: Property & Borrower */}
                  <td className="py-3.5 px-5">
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 mt-0.5 border ${
                          isCashSweep
                            ? 'bg-brick-100 text-brick-800 border-brick-200'
                            : isCriticalBreach
                            ? 'bg-terracotta-100 text-terracotta-800 border-terracotta-200'
                            : isSoftWarning
                            ? 'bg-amber-100 text-amber-800 border-amber-200'
                            : 'bg-sage-100 text-sage-800 border-sage-200'
                        }`}
                      >
                        <Building className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-editorial font-bold text-sm text-warm-900 flex items-center gap-1.5">
                          <span>{loan.propertyName}</span>
                          <span className="font-sans font-medium text-[10px] px-2 py-0.5 rounded-full bg-warm-100 text-warm-700 border border-warm-200">
                            {loan.propertyType}
                          </span>
                        </div>
                        <div className="text-[11px] text-warm-500 flex items-center gap-2 mt-0.5">
                          <span>{loan.borrowerName}</span>
                          <span className="text-warm-300">•</span>
                          <span className="font-mono text-[10px] text-warm-400">
                            {loan.loanNumber}
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Column 2: UPB & Rate */}
                  <td className="py-3.5 px-4 tabular-nums">
                    <div className="font-semibold text-warm-900 text-sm">
                      {formatCurrency(loan.currentUPB)}
                    </div>
                    <div className="text-[11px] text-warm-500">
                      Rate: <span className="font-medium text-warm-700">{loan.interestRatePct.toFixed(2)}%</span> • {loan.grossLeasableAreaSqft.toLocaleString()} sqft
                    </div>
                  </td>

                  {/* Column 3: Physical vs Economic Occupancy */}
                  <td className="py-3.5 px-4">
                    <div className="space-y-1.5 min-w-[140px]">
                      <div className="flex justify-between text-[11px]">
                        <span className="text-warm-500">Physical:</span>
                        <span
                          className={`font-semibold tabular-nums ${
                            evalData.physicalOccupancyPct < loan.covenants.minPhysicalOccupancyPct
                              ? 'text-brick-700'
                              : 'text-warm-800'
                          }`}
                        >
                          {formatPercent(evalData.physicalOccupancyPct, 1)}
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-warm-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            evalData.physicalOccupancyPct < loan.covenants.minPhysicalOccupancyPct
                              ? 'bg-brick-600'
                              : 'bg-sage-600'
                          }`}
                          style={{ width: `${Math.min(100, evalData.physicalOccupancyPct)}%` }}
                        />
                      </div>

                      <div className="flex justify-between text-[10px] text-warm-500">
                        <span>Economic (Cash):</span>
                        <span
                          className={`font-semibold tabular-nums ${
                            evalData.economicOccupancyPct < loan.covenants.minEconomicOccupancyPct
                              ? 'text-terracotta-700'
                              : 'text-warm-700'
                          }`}
                        >
                          {formatPercent(evalData.economicOccupancyPct, 1)}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Column 4: In-Place DSCR */}
                  <td className="py-3.5 px-4 tabular-nums">
                    <div className="flex items-center gap-2">
                      <span
                        className={`organic-pill px-2.5 py-1 text-xs font-bold ${
                          isCashSweep
                            ? 'bg-brick-100 text-brick-800 border border-brick-300'
                            : isCriticalBreach
                            ? 'bg-terracotta-100 text-terracotta-800 border border-terracotta-300'
                            : isSoftWarning
                            ? 'bg-amber-100 text-amber-800 border border-amber-300'
                            : 'bg-sage-100 text-sage-800 border border-sage-300'
                        }`}
                      >
                        {formatRatio(evalData.dscr)}
                      </span>
                    </div>
                    <div className="text-[10px] text-warm-500 mt-1">
                      Req: <span className="font-semibold text-warm-700">{formatRatio(loan.covenants.minDSCR)}</span> (Sweep: {formatRatio(loan.covenants.cashSweepDSCRThreshold)})
                    </div>
                  </td>

                  {/* Column 5: Dynamic LTV */}
                  <td className="py-3.5 px-4 tabular-nums">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`font-bold text-sm ${
                          evalData.dynamicLTVPct > loan.covenants.maxLTVPct
                            ? 'text-brick-700'
                            : 'text-warm-900'
                        }`}
                      >
                        {formatPercent(evalData.dynamicLTVPct, 1)}
                      </span>
                      {evalData.dynamicLTVPct > loan.covenants.maxLTVPct && (
                        <span className="text-[10px] font-semibold text-brick-600 bg-brick-50 px-1 rounded">
                          +{(evalData.dynamicLTVPct - loan.covenants.maxLTVPct).toFixed(1)}%
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-warm-500">
                      Cap Ceiling: <span className="font-medium text-warm-700">{formatPercent(loan.covenants.maxLTVPct, 0)}</span> • Val: {formatCurrency(evalData.dynamicPropertyValue, true)}
                    </div>
                  </td>

                  {/* Column 6: Status Badge */}
                  <td className="py-3.5 px-4">
                    {isCashSweep ? (
                      <span className="organic-pill px-3 py-1 bg-brick-100 text-brick-900 border border-brick-300 text-xs font-bold">
                        <Lock className="w-3 h-3 text-brick-700 animate-pulse" />
                        Cash Sweep Active
                      </span>
                    ) : isCriticalBreach ? (
                      <span className="organic-pill px-3 py-1 bg-terracotta-100 text-terracotta-900 border border-terracotta-300 text-xs font-bold">
                        <ShieldAlert className="w-3 h-3 text-terracotta-700" />
                        30-Day Cure Notice
                      </span>
                    ) : isSoftWarning ? (
                      <span className="organic-pill px-3 py-1 bg-amber-100 text-amber-900 border border-amber-300 text-xs font-semibold">
                        <AlertTriangle className="w-3 h-3 text-amber-700" />
                        Watchlist Warning
                      </span>
                    ) : (
                      <span className="organic-pill px-3 py-1 bg-sage-50 text-sage-800 border border-sage-200 text-xs font-semibold">
                        <CheckCircle2 className="w-3 h-3 text-sage-600" />
                        Compliant
                      </span>
                    )}
                  </td>

                  {/* Column 7: Action */}
                  <td className="py-3.5 px-5 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectLoan(loan.id);
                      }}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-2xl text-xs font-semibold transition-all ${
                        isSelected
                          ? 'bg-warm-900 text-warm-50 shadow-soft-sm'
                          : 'bg-warm-100 text-warm-800 hover:bg-warm-200/80 border border-warm-200'
                      }`}
                    >
                      <span>{isSelected ? 'Inspecting' : 'Audit Loan'}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
