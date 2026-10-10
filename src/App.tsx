import { useState, useMemo } from 'react';
import { Header } from './components/Header';
import { PortfolioSummaryRibbon } from './components/PortfolioSummaryRibbon';
import { LoanWatchlistTable } from './components/LoanWatchlistTable';
import { LoanInspectionDrawer } from './components/LoanInspectionDrawer';
import { RentRollTable } from './components/RentRollTable';
import { CovenantTrendsChart } from './components/charts/CovenantTrendsChart';
import { LeaseRolloverChart } from './components/charts/LeaseRolloverChart';
import { RemediationStudioModal } from './components/RemediationStudioModal';
import { IngestionModal } from './components/IngestionModal';
import { AddLoanModal } from './components/AddLoanModal';
import { AboutLearningDeckModal } from './components/AboutLearningDeckModal';
import { INITIAL_MOCK_LOANS } from './data/mock-loans';
import { Loan, Tenant, CovenantEvaluation } from './types/cre';
import { evaluateCRECovenants } from './lib/cre-calculator';
import { Building2, RefreshCw } from 'lucide-react';

export function App() {
  const [loans, setLoans] = useState<Loan[]>(INITIAL_MOCK_LOANS);
  const [selectedLoanId, setSelectedLoanId] = useState<string | null>(INITIAL_MOCK_LOANS[0].id);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Stress test overrides per loan
  const [capRateOverrides, setCapRateOverrides] = useState<{ [loanId: string]: number }>({});
  const [opExOverrides, setOpExOverrides] = useState<{ [loanId: string]: number }>({});

  // Modals state
  const [isIngestionOpen, setIsIngestionOpen] = useState(false);
  const [isRemediationOpen, setIsRemediationOpen] = useState(false);
  const [isAddLoanOpen, setIsAddLoanOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  // Compute evaluations for all loans reactively
  const evaluations = useMemo(() => {
    const map = new Map<string, CovenantEvaluation>();
    loans.forEach((loan) => {
      const customCapRate = capRateOverrides[loan.id] ?? loan.marketCapRatePct;
      const customOpEx = opExOverrides[loan.id] ?? loan.annualOpEx;
      const evaluation = evaluateCRECovenants(loan, customCapRate, customOpEx);
      map.set(loan.id, evaluation);
    });
    return map;
  }, [loans, capRateOverrides, opExOverrides]);

  const selectedLoan = useMemo(() => {
    return loans.find((l) => l.id === selectedLoanId) || null;
  }, [loans, selectedLoanId]);

  const selectedEvaluation = useMemo(() => {
    if (!selectedLoan) return null;
    return evaluations.get(selectedLoan.id) || null;
  }, [selectedLoan, evaluations]);

  // Handle Tenant updates
  const handleUpdateTenant = (tenantId: string, updates: Partial<Tenant>) => {
    if (!selectedLoanId) return;

    setLoans((prevLoans) =>
      prevLoans.map((loan) => {
        if (loan.id !== selectedLoanId) return loan;

        const updatedRentRoll = loan.rentRoll.map((tenant) => {
          if (tenant.id !== tenantId) return tenant;
          return { ...tenant, ...updates };
        });

        return {
          ...loan,
          rentRoll: updatedRentRoll,
        };
      })
    );
  };

  // Handle Add Tenant
  const handleAddTenant = (newTenant: Tenant) => {
    if (!selectedLoanId) return;

    setLoans((prevLoans) =>
      prevLoans.map((loan) => {
        if (loan.id !== selectedLoanId) return loan;
        return {
          ...loan,
          rentRoll: [...loan.rentRoll, newTenant],
        };
      })
    );
  };

  // Handle Delete Tenant
  const handleDeleteTenant = (tenantId: string) => {
    if (!selectedLoanId) return;

    setLoans((prevLoans) =>
      prevLoans.map((loan) => {
        if (loan.id !== selectedLoanId) return loan;
        return {
          ...loan,
          rentRoll: loan.rentRoll.filter((t) => t.id !== tenantId),
        };
      })
    );
  };

  // Handle Ingested Rent Roll
  const handleCommitParsedRentRoll = (targetLoanId: string, parsedTenants: Tenant[]) => {
    setLoans((prevLoans) =>
      prevLoans.map((loan) => {
        if (loan.id !== targetLoanId) return loan;
        return {
          ...loan,
          rentRoll: parsedTenants,
        };
      })
    );
    setSelectedLoanId(targetLoanId);
  };

  // Handle Add New Loan Facility
  const handleAddLoan = (newLoan: Loan) => {
    setLoans((prev) => [newLoan, ...prev]);
    setSelectedLoanId(newLoan.id);
  };

  // Reset demo to initial state
  const handleResetPortfolio = () => {
    setLoans(INITIAL_MOCK_LOANS);
    setCapRateOverrides({});
    setOpExOverrides({});
    setSelectedLoanId(INITIAL_MOCK_LOANS[0].id);
  };

  return (
    <div className="min-h-screen bg-warm-50 flex flex-col selection:bg-sage-200 selection:text-sage-900">
      {/* Header */}
      <Header
        onOpenIngestion={() => setIsIngestionOpen(true)}
        onNewLoan={() => setIsAddLoanOpen(true)}
        onOpenAbout={() => setIsAboutOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        totalLoans={loans.length}
      />

      {/* Main Command Center Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-8 space-y-8">
        {/* Top Controls: Hero Welcome & Fast Reset */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-warm-200">
          <div>
            <h2 className="font-editorial text-2xl font-bold text-warm-900">
              Portfolio Surveillance Command Center
            </h2>
            <p className="text-xs text-warm-600 mt-0.5">
              Continuous monitoring of debt covenants, cash sweep triggers, and dynamic mark-to-market loan metrics.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <button
              onClick={handleResetPortfolio}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-warm-100 border border-warm-200 text-warm-700 shadow-soft-sm font-medium transition-all"
              title="Reset portfolio to baseline mock state"
            >
              <RefreshCw className="w-3.5 h-3.5 text-warm-500" />
              <span>Reset Portfolio Data</span>
            </button>
          </div>
        </div>

        {/* 1. Portfolio KPI Summary Ribbon */}
        <PortfolioSummaryRibbon loans={loans} evaluations={evaluations} />

        {/* 2. Main Watchlist Table */}
        <LoanWatchlistTable
          loans={loans}
          evaluations={evaluations}
          selectedLoanId={selectedLoanId}
          onSelectLoan={setSelectedLoanId}
          searchQuery={searchQuery}
        />

        {/* 3. Deep-Dive Loan Inspection & Simulator Section */}
        {selectedLoan && selectedEvaluation && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-sage-800 bg-sage-50 px-2.5 py-1 rounded-full border border-sage-200">
                  Active Facility Surveillance
                </span>
                <h3 className="font-editorial text-xl font-bold text-warm-900 mt-1">
                  Facility Audit: {selectedLoan.propertyName}
                </h3>
              </div>
            </div>

            {/* Dual Panel Inspection Drawer */}
            <LoanInspectionDrawer
              loan={selectedLoan}
              evaluation={selectedEvaluation}
              onClose={() => setSelectedLoanId(null)}
              onOpenRemediation={() => setIsRemediationOpen(true)}
              customCapRate={capRateOverrides[selectedLoan.id] ?? selectedLoan.marketCapRatePct}
              onCapRateChange={(val) =>
                setCapRateOverrides((prev) => ({ ...prev, [selectedLoan.id]: val }))
              }
              customOpEx={opExOverrides[selectedLoan.id] ?? selectedLoan.annualOpEx}
              onOpExChange={(val) =>
                setOpExOverrides((prev) => ({ ...prev, [selectedLoan.id]: val }))
              }
            />

            {/* Visual Analytics Charts: Trends & Lease Expiration */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <CovenantTrendsChart
                data={selectedLoan.historicalSnapshots || []}
                covenants={selectedLoan.covenants}
                propertyName={selectedLoan.propertyName}
              />

              <LeaseRolloverChart
                tenants={selectedLoan.rentRoll}
                totalGLA={selectedLoan.grossLeasableAreaSqft}
              />
            </div>

            {/* Interactive Tenant Rent Roll Editor */}
            <RentRollTable
              tenants={selectedLoan.rentRoll}
              totalGLA={selectedLoan.grossLeasableAreaSqft}
              onUpdateTenant={handleUpdateTenant}
              onAddTenant={handleAddTenant}
              onDeleteTenant={handleDeleteTenant}
              propertyName={selectedLoan.propertyName}
            />
          </div>
        )}
      </main>

      {/* Global Modals */}
      {selectedLoan && selectedEvaluation && (
        <RemediationStudioModal
          isOpen={isRemediationOpen}
          onClose={() => setIsRemediationOpen(false)}
          loan={selectedLoan}
          evaluation={selectedEvaluation}
        />
      )}

      <IngestionModal
        isOpen={isIngestionOpen}
        onClose={() => setIsIngestionOpen(false)}
        loans={loans}
        onCommitParsedRentRoll={handleCommitParsedRentRoll}
      />

      <AddLoanModal
        isOpen={isAddLoanOpen}
        onClose={() => setIsAddLoanOpen(false)}
        onAddLoan={handleAddLoan}
      />

      <AboutLearningDeckModal
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
      />

      {/* Editorial Footer */}
      <footer className="border-t border-warm-200 bg-warm-100/60 mt-16 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-warm-500">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-sage-600" />
            <span className="font-editorial font-bold text-warm-900">CovenantWatch AI</span>
            <span>• Institutional CRE Surveillance & Regulatory Compliance</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Deterministic Banking Math Engine</span>
            <span>•</span>
            <span>CECL Reserve Tracking</span>
            <span>•</span>
            <span>Zero AI Math Hallucination Guarantee</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
export default App;
