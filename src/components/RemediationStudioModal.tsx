import React, { useState } from 'react';
import {
  X,
  Copy,
  Printer,
  Check,
  FileText,
  Send,
  ShieldCheck,
} from 'lucide-react';
import { Loan, CovenantEvaluation } from '../types/cre';
import { formatCurrency, formatPercent, formatRatio } from '../lib/cre-calculator';

interface RemediationStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  loan: Loan;
  evaluation: CovenantEvaluation;
}

export const RemediationStudioModal: React.FC<RemediationStudioModalProps> = ({
  isOpen,
  onClose,
  loan,
  evaluation,
}) => {
  const [activeTab, setActiveTab] = useState<'NOTICE' | 'MEMO' | 'CURE_WORKSHEET'>('NOTICE');
  const [cureDays, setCureDays] = useState<number>(loan.covenants.curePeriodDays || 30);
  const [copied, setCopied] = useState(false);
  const [transmitted, setTransmitted] = useState(false);
  const [customStipulation, setCustomStipulation] = useState(
    'Borrower shall furnish weekly cash management statements and an updated tenant leasing pipeline.'
  );

  if (!isOpen) return null;

  const today = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const cureDeadlineDate = new Date(Date.now() + cureDays * 24 * 3600 * 1000).toLocaleDateString(
    'en-US',
    {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }
  );

  const isCashSweep = evaluation.cashSweepActive;

  // Generate Document A: Formal Default Notice
  const defaultNoticeContent = `FORMAL NOTICE OF COVENANT DEFAULT & DEMAND FOR CURE

DATE: ${today}
VIA CERTIFIED MAIL & ELECTRONIC TRANSMISSION

TO:
${loan.borrowerName}
Attn: ${loan.borrowerContact}
Property: ${loan.propertyName}
Address: ${loan.propertyAddress}
Loan Facility No.: ${loan.loanNumber}

RE: NOTICE OF COVENANT DEFAULT PURSUANT TO CREDIT AGREEMENT SECTION 8.2 (FINANCIAL MAINTENANCE COVENANTS)

Dear Borrower:

Please be advised that FIRST NATIONAL COMMERCIAL CREDIT CORP. ("Lender") serves as administrative agent and lender under that certain Credit Agreement dated as of ${loan.originationDate} (the "Credit Agreement"), by and between Lender and ${loan.borrowerName} ("Borrower").

1. SPECIFICATION OF COVENANT DEFAULT
Pursuant to Section 8.2 of the Credit Agreement, Borrower is required to maintain ongoing operational standards as tested on the most recent surveillance period:

${evaluation.breaches
  .map(
    (b, idx) =>
      `   (${String.fromCharCode(97 + idx)}) ${b.covenantName}: Required threshold is ${
        b.threshold
      }${b.unit}. The current in-place verified performance has fallen to ${b.actual}${
        b.unit
      } (Variance: ${b.delta > 0 ? '+' : ''}${b.delta}${b.unit}).\n       Specific Breach Details: ${b.message}`
  )
  .join('\n\n')}

2. DEMAND FOR EQUITY CURE OR REMEDIATION
In accordance with Section 8.4 ("Equity Cure Rights"), Borrower has the contractual right to cure said technical event of default within ${cureDays} calendar days—no later than ${cureDeadlineDate} (the "Cure Expiration Date").

To mathematically restore full covenant compliance (minimum DSCR of ${formatRatio(
    loan.covenants.minDSCR
  )} and maximum LTV of ${formatPercent(loan.covenants.maxLTVPct, 0)}), Borrower is required to:
   (i)  Execute an immediate principal curtailment (Equity Cure) in the exact sum of ${formatCurrency(
     evaluation.equityCureRequired
   )}; OR
   (ii) Provide irrevocable supplemental cash collateral deposited into the Lender Reserve Account.

${
  isCashSweep
    ? `3. NOTICE OF CASH SWEEP & LOCKBOX ACTIVATION (HARD EVENT)
PLEASE TAKE FURTHER NOTICE that because the verified in-place DSCR of ${formatRatio(
        evaluation.dscr
      )} is below the critical threshold of ${formatRatio(
        loan.covenants.cashSweepDSCRThreshold
      )}, a CASH SWEEP EVENT PERIOD has commenced automatically. Pursuant to Section 7.3, Lender has directed the Depositary Bank to sweep all gross tenant rents directly into the Lender Controlled Account. No owner equity distributions shall occur until compliance is certified for two consecutive quarters.`
    : `3. RESERVATION OF LENDER RIGHTS & REMEDIES
If Borrower fails to effectuate the Equity Cure on or before ${cureDeadlineDate}, Lender reserves all rights under Section 10 of the Credit Agreement, including without limitation accelerating the maturity of the loan, implementing default interest (+500 bps), or initiating foreclosure.`
}

4. SPECIAL LENDER STIPULATIONS
${customStipulation}

Sincerely,

FIRST NATIONAL COMMERCIAL CREDIT CORP.
Special Asset Surveillance & Risk Management Division
`;

  // Generate Document B: Credit Committee Memo
  const committeeMemoContent = `INTERNAL CREDIT COMMITTEE RISK MEMORANDUM
CONFIDENTIAL - BANK RISK & SPECIAL ASSETS DIVISION

DATE: ${today}
TO: Senior Credit Committee & Chief Risk Officer
FROM: CRE Surveillance & Asset Management Division
SUBJECT: Surveillance Risk Downgrade & Remediation Strategy: ${loan.propertyName} (${loan.loanNumber})

1. FACILITY OVERVIEW
• Borrower: ${loan.borrowerName}
• Asset Class: ${loan.propertyType} (${loan.grossLeasableAreaSqft.toLocaleString()} GLA sqft)
• Current UPB: ${formatCurrency(loan.currentUPB)} (Original: ${formatCurrency(
    loan.originalLoanAmount
  )})
• Note Rate: ${loan.interestRatePct.toFixed(2)}% | Annual Debt Service: ${formatCurrency(
    loan.annualDebtService
  )}

2. PERFORMANCE DETERIORATION & COVENANT EVALUATION
The asset underwent continuous rent roll audit. Operational cash flows have degraded:
• In-Place Annual NOI: ${formatCurrency(evaluation.annualNOI)} (Effective Gross Income: ${formatCurrency(
    evaluation.effectiveGrossIncome
  )})
• In-Place DSCR: ${formatRatio(evaluation.dscr)} (Contractual Covenant: ${formatRatio(
    loan.covenants.minDSCR
  )} | Cash Sweep Threshold: ${formatRatio(loan.covenants.cashSweepDSCRThreshold)})
• Physical Occupancy: ${formatPercent(
    evaluation.physicalOccupancyPct,
    1
  )} | Economic Occupancy: ${formatPercent(evaluation.economicOccupancyPct, 1)}
• Mark-to-Market Property Value: ${formatCurrency(
    evaluation.dynamicPropertyValue
  )} (Cap Rate: ${loan.marketCapRatePct.toFixed(2)}%)
• Dynamic Mark-to-Market LTV: ${formatPercent(
    evaluation.dynamicLTVPct,
    1
  )} (Contractual Ceiling: ${formatPercent(loan.covenants.maxLTVPct, 0)})

3. RISK RATING RECOMMENDATION & CECL CAPITAL RESERVE IMPACT
• Recommended Regulatory Risk Rating: Downgrade to "${evaluation.recommendedRiskRating}"
• CECL Reserve Requirement: Recommended incremental loan loss reserve provisioning of ${formatCurrency(
    Math.max(500000, evaluation.equityCureRequired * 0.25)
  )}.
• Action Trigger: ${
    isCashSweep
      ? 'IMMEDIATE CASH SWEEP ACTIVATED (Lockbox cash diversion initiated).'
      : '30-Day Formal Default Notice issued with demand for equity cure.'
  }

4. RECOMMENDED REMEDIATION ACTION
Demand Borrower inject ${formatCurrency(
    evaluation.equityCureRequired
  )} as an equity cure paydown within ${cureDays} days (${cureDeadlineDate}) or proceed with enforcement.
`;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleTransmit = () => {
    setTransmitted(true);
    setTimeout(() => setTransmitted(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-warm-950/50 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="organic-card bg-white w-full max-w-4xl max-h-[92vh] flex flex-col shadow-soft-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="p-5 border-b border-warm-200 bg-warm-100/70 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-warm-900 text-warm-50 flex items-center justify-center">
              <FileText className="w-5 h-5 text-sage-300" />
            </div>
            <div>
              <h2 className="font-editorial text-xl font-bold text-warm-900">
                Remediation Studio & Legal Notice Generator
              </h2>
              <p className="text-xs text-warm-500">
                Institutional credit documentation, formal demand letters, and committee memos.
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

        {/* Tab Selection Bar & Controls */}
        <div className="px-6 py-3 border-b border-warm-200 bg-warm-50 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center bg-warm-200/80 p-1 rounded-2xl border border-warm-300/60 text-xs">
            <button
              onClick={() => setActiveTab('NOTICE')}
              className={`px-3.5 py-1.5 rounded-xl font-medium transition-all ${
                activeTab === 'NOTICE'
                  ? 'bg-white text-warm-900 shadow-soft-sm font-semibold'
                  : 'text-warm-600 hover:text-warm-900'
              }`}
            >
              Borrower Default Notice
            </button>
            <button
              onClick={() => setActiveTab('MEMO')}
              className={`px-3.5 py-1.5 rounded-xl font-medium transition-all ${
                activeTab === 'MEMO'
                  ? 'bg-white text-warm-900 shadow-soft-sm font-semibold'
                  : 'text-warm-600 hover:text-warm-900'
              }`}
            >
              Credit Committee Memo
            </button>
            <button
              onClick={() => setActiveTab('CURE_WORKSHEET')}
              className={`px-3.5 py-1.5 rounded-xl font-medium transition-all ${
                activeTab === 'CURE_WORKSHEET'
                  ? 'bg-white text-warm-900 shadow-soft-sm font-semibold'
                  : 'text-warm-600 hover:text-warm-900'
              }`}
            >
              Equity Cure Worksheet
            </button>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2 text-xs">
            <button
              onClick={() =>
                copyToClipboard(
                  activeTab === 'NOTICE' ? defaultNoticeContent : committeeMemoContent
                )
              }
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-warm-100 border border-warm-200 rounded-xl font-medium text-warm-800 shadow-soft-sm transition-all"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-sage-600" /> : <Copy className="w-3.5 h-3.5 text-warm-500" />}
              <span>{copied ? 'Copied' : 'Copy Text'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-warm-100 border border-warm-200 rounded-xl font-medium text-warm-800 shadow-soft-sm transition-all"
            >
              <Printer className="w-3.5 h-3.5 text-warm-500" />
              <span>Print Document</span>
            </button>

            <button
              onClick={handleTransmit}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-warm-900 hover:bg-warm-800 text-warm-50 rounded-xl font-medium shadow-soft transition-all"
            >
              {transmitted ? (
                <ShieldCheck className="w-3.5 h-3.5 text-sage-300" />
              ) : (
                <Send className="w-3.5 h-3.5 text-sage-300" />
              )}
              <span>{transmitted ? 'Dispatched to Servicing' : 'Transmit Notice'}</span>
            </button>
          </div>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh] space-y-4">
          {activeTab === 'NOTICE' && (
            <div className="space-y-4">
              {/* Parameter Editor Box */}
              <div className="p-4 bg-warm-100/70 border border-warm-200 rounded-2xl grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="block text-warm-600 font-medium mb-1">Cure Period Window</label>
                  <select
                    value={cureDays}
                    onChange={(e) => setCureDays(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 bg-white border border-warm-200 rounded-xl font-medium"
                  >
                    <option value={15}>15 Calendar Days (Accelerated)</option>
                    <option value={30}>30 Calendar Days (Standard)</option>
                    <option value={45}>45 Calendar Days (Extended)</option>
                    <option value={60}>60 Calendar Days (Workout)</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-warm-600 font-medium mb-1">Custom Lender Stipulation</label>
                  <input
                    type="text"
                    value={customStipulation}
                    onChange={(e) => setCustomStipulation(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-white border border-warm-200 rounded-xl"
                  />
                </div>
              </div>

              {/* Document Text View */}
              <div className="p-6 bg-warm-50/60 border border-warm-200 rounded-2xl font-mono text-xs text-warm-900 whitespace-pre-wrap leading-relaxed shadow-inner">
                {defaultNoticeContent}
              </div>
            </div>
          )}

          {activeTab === 'MEMO' && (
            <div className="p-6 bg-warm-50/60 border border-warm-200 rounded-2xl font-mono text-xs text-warm-900 whitespace-pre-wrap leading-relaxed shadow-inner">
              {committeeMemoContent}
            </div>
          )}

          {activeTab === 'CURE_WORKSHEET' && (
            <div className="space-y-4 text-xs">
              <div className="p-4 bg-warm-100/80 rounded-2xl border border-warm-200">
                <h4 className="font-editorial font-bold text-base text-warm-900">
                  Deterministic Equity Cure Formula & Mathematical Proof
                </h4>
                <p className="text-warm-600 mt-1">
                  How the required paydown is calculated without guesswork or hallucinations.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* DSCR Cure Proof */}
                <div className="p-4 bg-white border border-warm-200 rounded-2xl space-y-3">
                  <span className="font-semibold text-warm-800 uppercase tracking-wider block">
                    1. Debt Service Coverage Ratio (DSCR) Proof
                  </span>
                  <div className="space-y-1.5 font-mono text-[11px] text-warm-700 bg-warm-50 p-3 rounded-xl">
                    <div>Current Annual NOI: {formatCurrency(evaluation.annualNOI)}</div>
                    <div>Required Min DSCR: {formatRatio(loan.covenants.minDSCR)}</div>
                    <div>Max Allowable Debt Service = NOI / Min DSCR</div>
                    <div className="text-sage-700 font-semibold">
                      = {formatCurrency(evaluation.annualNOI / loan.covenants.minDSCR)}/yr
                    </div>
                    <div className="pt-2 border-t border-warm-200">
                      Target UPB for DSCR: {formatCurrency(evaluation.targetUPBForDSCR)}
                    </div>
                    <div className="text-brick-700 font-bold">
                      Paydown for DSCR = {formatCurrency(Math.max(0, loan.currentUPB - evaluation.targetUPBForDSCR))}
                    </div>
                  </div>
                </div>

                {/* LTV Cure Proof */}
                <div className="p-4 bg-white border border-warm-200 rounded-2xl space-y-3">
                  <span className="font-semibold text-warm-800 uppercase tracking-wider block">
                    2. Dynamic Mark-to-Market LTV Proof
                  </span>
                  <div className="space-y-1.5 font-mono text-[11px] text-warm-700 bg-warm-50 p-3 rounded-xl">
                    <div>Dynamic Valuation: {formatCurrency(evaluation.dynamicPropertyValue)}</div>
                    <div>Max Contract LTV: {formatPercent(loan.covenants.maxLTVPct, 0)}</div>
                    <div>Target Max UPB = Dynamic Val × Max LTV%</div>
                    <div className="text-sage-700 font-semibold">
                      = {formatCurrency(evaluation.targetUPBForLTV)}
                    </div>
                    <div className="pt-2 border-t border-warm-200">
                      Current UPB: {formatCurrency(loan.currentUPB)}
                    </div>
                    <div className="text-brick-700 font-bold">
                      Paydown for LTV = {formatCurrency(Math.max(0, loan.currentUPB - evaluation.targetUPBForLTV))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Total Summary */}
              <div className="p-5 bg-gradient-to-r from-sage-50 to-warm-100 rounded-2xl border border-sage-200 flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-sage-900 uppercase">
                    Mandatory Total Principal Curtailment
                  </span>
                  <div className="font-editorial text-2xl font-bold text-warm-900 mt-0.5 tabular-nums">
                    {formatCurrency(evaluation.equityCureRequired)}
                  </div>
                </div>
                <div className="text-right text-xs text-warm-600">
                  <span>Satisfies all maintenance covenants</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-warm-200 bg-warm-100/60 flex items-center justify-between text-xs text-warm-500">
          <span>First National Commercial Credit Corp • Surveillance Audit Trail #SWP-2026-99</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-warm-200 hover:bg-warm-300 text-warm-800 font-medium rounded-xl transition-colors"
          >
            Close Studio
          </button>
        </div>
      </div>
    </div>
  );
};
