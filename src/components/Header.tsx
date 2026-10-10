import { Building2, FileSpreadsheet, PlusCircle, Search, Compass } from 'lucide-react';

interface HeaderProps {
  onOpenIngestion: () => void;
  onNewLoan: () => void;
  onOpenAbout: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  totalLoans: number;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenIngestion,
  onNewLoan,
  onOpenAbout,
  searchQuery,
  onSearchChange,
  totalLoans,
}) => {
  return (
    <header className="border-b border-warm-200 bg-warm-50/80 backdrop-blur-md sticky top-0 z-30 transition-all">
      {/* Top Macro Ticker Bar */}
      <div className="bg-warm-100/90 border-b border-warm-200/70 px-4 sm:px-8 py-1.5 text-xs text-warm-600 flex items-center justify-between overflow-x-auto">
        <div className="flex items-center gap-6 font-mono text-[11px] whitespace-nowrap">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-sage-500 animate-pulse"></span>
            <span className="font-semibold text-warm-800">MARKET PULSE (FRED LIVE)</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-warm-500">10Y UST (DGS10):</span>
            <span className="font-semibold text-warm-900">4.28%</span>
            <span className="text-terracotta-600 text-[10px]">▲ +4 bps</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-warm-500">SOFR 30D:</span>
            <span className="font-semibold text-warm-900">5.32%</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-warm-500">CRE Cap Rate Benchmark:</span>
            <span className="font-semibold text-warm-900">6.85%</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-warm-500">Active Facilities:</span>
            <span className="font-semibold text-warm-900">{totalLoans} Loans</span>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-3 text-[11px]">
          <button
            onClick={onOpenAbout}
            className="flex items-center gap-1 font-semibold text-sage-800 hover:text-sage-950 underline underline-offset-2 transition-colors"
          >
            <Compass className="w-3.5 h-3.5 text-sage-600" />
            <span>Learning Deck & Architecture</span>
          </button>
          <span className="text-warm-300">•</span>
          <span className="text-warm-500">Surveillance Engine v1.0</span>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-warm-800 text-warm-50 flex items-center justify-center shadow-soft">
            <Building2 className="w-6 h-6 text-sage-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-editorial text-2xl font-bold tracking-tight text-warm-900">
                CovenantWatch <span className="italic font-normal text-sage-700">AI</span>
              </h1>
              <span className="text-[10px] font-semibold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-warm-200/70 text-warm-700 border border-warm-300/60">
                CRE Debt Surveillance
              </span>
            </div>
            <p className="text-xs text-warm-500 mt-0.5">
              Continuous Rent Roll Ingestion • Mark-to-Market Valuation • Automated Remediation
            </p>
          </div>
        </div>

        {/* Action Controls & Search */}
        <div className="flex items-center flex-wrap gap-2.5">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-warm-400" />
            <input
              type="text"
              placeholder="Search properties, borrowers, loans..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-warm-200 rounded-2xl placeholder-warm-400 text-warm-800 focus:outline-none focus:ring-2 focus:ring-sage-500/30 focus:border-sage-500 transition-all shadow-soft-sm"
            />
          </div>

          <button
            onClick={onOpenAbout}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-sage-900 bg-sage-50 hover:bg-sage-100/90 border border-sage-200 rounded-2xl shadow-soft-sm transition-all active:scale-[0.98]"
          >
            <Compass className="w-3.5 h-3.5 text-sage-700" />
            <span>About & Learning Deck</span>
          </button>

          <button
            onClick={onOpenIngestion}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-warm-800 bg-warm-100 hover:bg-warm-200/80 border border-warm-200 rounded-2xl shadow-soft-sm transition-all active:scale-[0.98]"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-warm-600" />
            <span>Ingest Rent Roll</span>
          </button>

          <button
            onClick={onNewLoan}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-warm-50 bg-warm-900 hover:bg-warm-800 rounded-2xl shadow-soft transition-all active:scale-[0.98]"
          >
            <PlusCircle className="w-3.5 h-3.5 text-sage-300" />
            <span>Add Facility</span>
          </button>
        </div>
      </div>
    </header>
  );
};
