import React, { useState } from 'react';
import { X, Building2, ArrowRight } from 'lucide-react';
import { Loan, PropertyType } from '../types/cre';

interface AddLoanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddLoan: (newLoan: Loan) => void;
}

export const AddLoanModal: React.FC<AddLoanModalProps> = ({
  isOpen,
  onClose,
  onAddLoan,
}) => {
  const [propertyName, setPropertyName] = useState('');
  const [borrowerName, setBorrowerName] = useState('');
  const [propertyType, setPropertyType] = useState<PropertyType>('Office');
  const [propertyAddress, setPropertyAddress] = useState('');
  const [glaSqft, setGlaSqft] = useState<number>(120000);
  const [loanAmount, setLoanAmount] = useState<number>(20000000);
  const [currentUPB, setCurrentUPB] = useState<number>(19500000);
  const [interestRate, setInterestRate] = useState<number>(6.5);
  const [annualDebtService, setAnnualDebtService] = useState<number>(1550000);
  const [marketCapRate, setMarketCapRate] = useState<number>(7.0);
  const [annualOpEx, setAnnualOpEx] = useState<number>(850000);

  // Covenants
  const [minDSCR, setMinDSCR] = useState<number>(1.25);
  const [minPhysOcc, setMinPhysOcc] = useState<number>(85.0);
  const [minEconOcc, setMinEconOcc] = useState<number>(80.0);
  const [maxLTV, setMaxLTV] = useState<number>(70.0);
  const [cashSweepDSCR, setCashSweepDSCR] = useState<number>(1.15);
  const [cureDays, setCureDays] = useState<number>(30);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!propertyName || !borrowerName) return;

    const newLoan: Loan = {
      id: `LN-${Date.now()}`,
      loanNumber: `LN-2026-${Math.floor(100 + Math.random() * 900)}-${propertyType.substring(0, 3).toUpperCase()}`,
      propertyName,
      borrowerName,
      borrowerContact: `assetmgmt@${borrowerName.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
      propertyAddress: propertyAddress || '100 Financial Center Blvd, Suite 100',
      propertyType,
      originationDate: new Date().toISOString().split('T')[0],
      maturityDate: new Date(Date.now() + 7 * 365 * 24 * 3600 * 1000).toISOString().split('T')[0],
      grossLeasableAreaSqft: Number(glaSqft),
      originalLoanAmount: Number(loanAmount),
      currentUPB: Number(currentUPB),
      interestRatePct: Number(interestRate),
      annualDebtService: Number(annualDebtService),
      marketCapRatePct: Number(marketCapRate),
      annualOpEx: Number(annualOpEx),
      covenants: {
        minDSCR: Number(minDSCR),
        minPhysicalOccupancyPct: Number(minPhysOcc),
        minEconomicOccupancyPct: Number(minEconOcc),
        maxLTVPct: Number(maxLTV),
        cashSweepDSCRThreshold: Number(cashSweepDSCR),
        curePeriodDays: Number(cureDays),
      },
      rentRoll: [
        {
          id: `t-init-1`,
          suiteId: 'Suite 100',
          tenantName: 'Primary Commercial Tenant',
          sqft: Math.round(glaSqft * 0.55),
          leaseStart: '2023-01-01',
          leaseEnd: '2028-12-31',
          monthlyBaseRent: Math.round((annualDebtService * 1.35 + annualOpEx) / 12 * 0.6),
          status: 'Active',
          paymentDelinquencyDays: 0,
          industry: 'Commercial Services',
          isAnchor: true,
        },
        {
          id: `t-init-2`,
          suiteId: 'Suite 200',
          tenantName: 'Secondary Office Tenant',
          sqft: Math.round(glaSqft * 0.35),
          leaseStart: '2024-01-01',
          leaseEnd: '2027-06-30',
          monthlyBaseRent: Math.round((annualDebtService * 1.35 + annualOpEx) / 12 * 0.4),
          status: 'Active',
          paymentDelinquencyDays: 0,
          industry: 'Professional Services',
        },
        {
          id: `t-init-3`,
          suiteId: 'Suite 300',
          tenantName: 'Available Suite',
          sqft: Math.round(glaSqft * 0.1),
          leaseStart: null,
          leaseEnd: null,
          monthlyBaseRent: 0,
          status: 'Vacant',
          paymentDelinquencyDays: 0,
          industry: 'Vacant Space',
        },
      ],
      historicalSnapshots: [
        {
          month: 'Current',
          noi: annualDebtService * 1.3,
          dscr: 1.3,
          ltvPct: 62.0,
          physicalOccupancyPct: 90.0,
          economicOccupancyPct: 90.0,
          isBreached: false,
        },
      ],
    };

    onAddLoan(newLoan);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-warm-950/50 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="organic-card bg-white w-full max-w-3xl max-h-[92vh] flex flex-col shadow-soft-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="p-5 border-b border-warm-200 bg-warm-100/70 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-warm-900 text-warm-50 flex items-center justify-center">
              <Building2 className="w-5 h-5 text-sage-300" />
            </div>
            <div>
              <h2 className="font-editorial text-xl font-bold text-warm-900">
                Originate New Loan Facility
              </h2>
              <p className="text-xs text-warm-500">
                Configure facility parameters, credit agreement covenants, and baseline operating economics.
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

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[70vh] space-y-5 text-xs">
          {/* Section 1: Property Metadata */}
          <div>
            <h3 className="font-editorial font-bold text-sm text-warm-900 mb-2.5">
              1. Property & Borrower Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-warm-700 font-medium mb-1">Property Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. One Financial Plaza"
                  value={propertyName}
                  onChange={(e) => setPropertyName(e.target.value)}
                  className="w-full px-3 py-1.5 bg-warm-50 border border-warm-200 rounded-xl"
                />
              </div>
              <div>
                <label className="block text-warm-700 font-medium mb-1">Borrower / Sponsor *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Apex Debt Fund LP"
                  value={borrowerName}
                  onChange={(e) => setBorrowerName(e.target.value)}
                  className="w-full px-3 py-1.5 bg-warm-50 border border-warm-200 rounded-xl"
                />
              </div>
              <div>
                <label className="block text-warm-700 font-medium mb-1">Property Sector</label>
                <select
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value as PropertyType)}
                  className="w-full px-3 py-1.5 bg-warm-50 border border-warm-200 rounded-xl"
                >
                  <option value="Office">Commercial Office</option>
                  <option value="Industrial">Industrial Logistics</option>
                  <option value="Multifamily">Multifamily Residential</option>
                  <option value="Retail">Retail Lifestyle Center</option>
                  <option value="Mixed-Use">Mixed-Use Commercial</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="block text-warm-700 font-medium mb-1">Property Location / Address</label>
                <input
                  type="text"
                  placeholder="e.g. 500 Market Street, San Francisco, CA"
                  value={propertyAddress}
                  onChange={(e) => setPropertyAddress(e.target.value)}
                  className="w-full px-3 py-1.5 bg-warm-50 border border-warm-200 rounded-xl"
                />
              </div>
              <div>
                <label className="block text-warm-700 font-medium mb-1">Gross Leasable Area (GLA SqFt)</label>
                <input
                  type="number"
                  required
                  min={1000}
                  value={glaSqft}
                  onChange={(e) => setGlaSqft(Number(e.target.value))}
                  className="w-full px-3 py-1.5 bg-warm-50 border border-warm-200 rounded-xl"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Loan Financial Terms */}
          <div>
            <h3 className="font-editorial font-bold text-sm text-warm-900 mb-2.5">
              2. Facility Economics & Valuation Constants
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-warm-700 font-medium mb-1">Original Loan Balance ($)</label>
                <input
                  type="number"
                  required
                  min={100000}
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(Number(e.target.value))}
                  className="w-full px-3 py-1.5 bg-warm-50 border border-warm-200 rounded-xl"
                />
              </div>
              <div>
                <label className="block text-warm-700 font-medium mb-1">Current UPB ($)</label>
                <input
                  type="number"
                  required
                  min={100000}
                  value={currentUPB}
                  onChange={(e) => setCurrentUPB(Number(e.target.value))}
                  className="w-full px-3 py-1.5 bg-warm-50 border border-warm-200 rounded-xl"
                />
              </div>
              <div>
                <label className="block text-warm-700 font-medium mb-1">Annual Debt Service ($/yr)</label>
                <input
                  type="number"
                  required
                  min={10000}
                  value={annualDebtService}
                  onChange={(e) => setAnnualDebtService(Number(e.target.value))}
                  className="w-full px-3 py-1.5 bg-warm-50 border border-warm-200 rounded-xl"
                />
              </div>
              <div>
                <label className="block text-warm-700 font-medium mb-1">Market Cap Rate (%)</label>
                <input
                  type="number"
                  required
                  step={0.1}
                  value={marketCapRate}
                  onChange={(e) => setMarketCapRate(Number(e.target.value))}
                  className="w-full px-3 py-1.5 bg-warm-50 border border-warm-200 rounded-xl"
                />
              </div>
              <div>
                <label className="block text-warm-700 font-medium mb-1">Annual OpEx ($/yr)</label>
                <input
                  type="number"
                  required
                  min={10000}
                  value={annualOpEx}
                  onChange={(e) => setAnnualOpEx(Number(e.target.value))}
                  className="w-full px-3 py-1.5 bg-warm-50 border border-warm-200 rounded-xl"
                />
              </div>
              <div>
                <label className="block text-warm-700 font-medium mb-1">Interest Rate (%)</label>
                <input
                  type="number"
                  required
                  step={0.05}
                  value={interestRate}
                  onChange={(e) => setInterestRate(Number(e.target.value))}
                  className="w-full px-3 py-1.5 bg-warm-50 border border-warm-200 rounded-xl"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Covenants */}
          <div>
            <h3 className="font-editorial font-bold text-sm text-warm-900 mb-2.5">
              3. Contractual Credit Agreement Covenants
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
              <div>
                <label className="block text-warm-700 font-medium mb-1">Min DSCR</label>
                <input
                  type="number"
                  step={0.05}
                  value={minDSCR}
                  onChange={(e) => setMinDSCR(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 bg-warm-50 border border-warm-200 rounded-xl font-mono"
                />
              </div>
              <div>
                <label className="block text-warm-700 font-medium mb-1">Cash Sweep DSCR</label>
                <input
                  type="number"
                  step={0.05}
                  value={cashSweepDSCR}
                  onChange={(e) => setCashSweepDSCR(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 bg-warm-50 border border-warm-200 rounded-xl font-mono text-brick-700 font-bold"
                />
              </div>
              <div>
                <label className="block text-warm-700 font-medium mb-1">Max LTV %</label>
                <input
                  type="number"
                  value={maxLTV}
                  onChange={(e) => setMaxLTV(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 bg-warm-50 border border-warm-200 rounded-xl font-mono"
                />
              </div>
              <div>
                <label className="block text-warm-700 font-medium mb-1">Min Phys Occ %</label>
                <input
                  type="number"
                  value={minPhysOcc}
                  onChange={(e) => setMinPhysOcc(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 bg-warm-50 border border-warm-200 rounded-xl font-mono"
                />
              </div>
              <div>
                <label className="block text-warm-700 font-medium mb-1">Min Econ Occ %</label>
                <input
                  type="number"
                  value={minEconOcc}
                  onChange={(e) => setMinEconOcc(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 bg-warm-50 border border-warm-200 rounded-xl font-mono"
                />
              </div>
              <div>
                <label className="block text-warm-700 font-medium mb-1">Cure Days</label>
                <input
                  type="number"
                  value={cureDays}
                  onChange={(e) => setCureDays(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 bg-warm-50 border border-warm-200 rounded-xl font-mono"
                />
              </div>
            </div>
          </div>

          <div className="p-4 border-t border-warm-200 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-warm-200 hover:bg-warm-300 text-warm-800 font-medium rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-warm-900 hover:bg-warm-800 text-warm-50 font-semibold rounded-xl shadow-soft flex items-center gap-1.5"
            >
              <span>Originate Facility</span>
              <ArrowRight className="w-4 h-4 text-sage-300" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
