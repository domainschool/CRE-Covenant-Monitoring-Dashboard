import React, { useState } from 'react';
import {
  Plus,
  Trash2,
  Check,
  X,
  Clock,
  Sparkles,
} from 'lucide-react';
import { Tenant } from '../types/cre';
import { formatCurrency } from '../lib/cre-calculator';

interface RentRollTableProps {
  tenants: Tenant[];
  totalGLA: number;
  onUpdateTenant: (tenantId: string, updates: Partial<Tenant>) => void;
  onAddTenant: (newTenant: Tenant) => void;
  onDeleteTenant: (tenantId: string) => void;
  propertyName?: string;
}

export const RentRollTable: React.FC<RentRollTableProps> = ({
  tenants,
  totalGLA,
  onUpdateTenant,
  onAddTenant,
  onDeleteTenant,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newSuite, setNewSuite] = useState('');
  const [newName, setNewName] = useState('');
  const [newSqft, setNewSqft] = useState<number>(10000);
  const [newRent, setNewRent] = useState<number>(35000);
  const [newIndustry] = useState('Commercial Tenant');

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSuite || !newName) return;

    const tenant: Tenant = {
      id: `t-custom-${Date.now()}`,
      suiteId: newSuite,
      tenantName: newName,
      sqft: Number(newSqft) || 0,
      monthlyBaseRent: Number(newRent) || 0,
      status: 'Active',
      paymentDelinquencyDays: 0,
      leaseStart: new Date().toISOString().split('T')[0],
      leaseEnd: new Date(Date.now() + 3 * 365 * 24 * 3600 * 1000).toISOString().split('T')[0],
      industry: newIndustry,
    };

    onAddTenant(tenant);
    setIsAdding(false);
    setNewSuite('');
    setNewName('');
  };

  // Quick Stress Simulations
  const simulateAnchorDefault = () => {
    const anchor = tenants.find((t) => t.isAnchor || t.sqft >= 35000);
    if (anchor) {
      onUpdateTenant(anchor.id, {
        status: anchor.status === 'Active' ? 'Vacant' : 'Active',
      });
    }
  };

  const simulateDelinquencySpike = () => {
    // Increase delinquency for active tenants by 30 days
    tenants.forEach((t) => {
      if (t.status === 'Active') {
        const nextDays = t.paymentDelinquencyDays >= 60 ? 0 : t.paymentDelinquencyDays + 35;
        onUpdateTenant(t.id, { paymentDelinquencyDays: nextDays });
      }
    });
  };

  const totalOccupiedSqft = tenants
    .filter((t) => t.status === 'Active')
    .reduce((sum, t) => sum + t.sqft, 0);

  const totalMonthlyInPlace = tenants
    .filter((t) => t.status === 'Active')
    .reduce((sum, t) => sum + t.monthlyBaseRent, 0);

  const totalDelinquentMonthly = tenants
    .filter((t) => t.status === 'Active' && t.paymentDelinquencyDays > 30)
    .reduce((sum, t) => sum + t.monthlyBaseRent, 0);

  return (
    <div className="organic-card overflow-hidden">
      {/* Header & Quick Scenarios */}
      <div className="p-5 border-b border-warm-200 bg-white flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-editorial text-lg font-bold text-warm-900">
              In-Place Property Rent Roll Roster
            </h3>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-warm-100 text-warm-700 border border-warm-200">
              {tenants.length} Suites
            </span>
          </div>
          <p className="text-xs text-warm-500 mt-0.5">
            Real-time interactive roster. Toggle statuses or adjust delinquency days to test cash flow stress.
          </p>
        </div>

        {/* Action Controls & Fast Stress Buttons */}
        <div className="flex items-center flex-wrap gap-2 text-xs">
          <button
            onClick={simulateAnchorDefault}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-terracotta-50 text-terracotta-800 border border-terracotta-200 hover:bg-terracotta-100 font-medium transition-all"
            title="Toggle largest anchor tenant between Active and Vacant"
          >
            <Sparkles className="w-3.5 h-3.5 text-terracotta-600" />
            <span>Simulate Anchor Lease Event</span>
          </button>

          <button
            onClick={simulateDelinquencySpike}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-brick-50 text-brick-800 border border-brick-200 hover:bg-brick-100 font-medium transition-all"
            title="Inject +35 days delinquency across active tenants"
          >
            <Clock className="w-3.5 h-3.5 text-brick-600" />
            <span>Simulate Delinquency Shock</span>
          </button>

          <button
            onClick={() => setIsAdding(!isAdding)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-warm-900 text-warm-50 hover:bg-warm-800 font-medium transition-all shadow-soft-sm"
          >
            <Plus className="w-3.5 h-3.5 text-sage-300" />
            <span>Add Tenant</span>
          </button>
        </div>
      </div>

      {/* Inline Add Tenant Form */}
      {isAdding && (
        <form
          onSubmit={handleAddSubmit}
          className="p-4 bg-warm-100/80 border-b border-warm-200 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 text-xs"
        >
          <div>
            <label className="block text-warm-600 font-medium mb-1">Suite / Unit</label>
            <input
              type="text"
              required
              placeholder="e.g. Suite 500"
              value={newSuite}
              onChange={(e) => setNewSuite(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-white border border-warm-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-sage-500"
            />
          </div>
          <div>
            <label className="block text-warm-600 font-medium mb-1">Tenant Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Apex Health Corp"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-white border border-warm-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-sage-500"
            />
          </div>
          <div>
            <label className="block text-warm-600 font-medium mb-1">Square Feet</label>
            <input
              type="number"
              required
              min={500}
              value={newSqft}
              onChange={(e) => setNewSqft(Number(e.target.value))}
              className="w-full px-2.5 py-1.5 bg-white border border-warm-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-sage-500"
            />
          </div>
          <div>
            <label className="block text-warm-600 font-medium mb-1">Monthly Base Rent ($)</label>
            <input
              type="number"
              required
              min={0}
              value={newRent}
              onChange={(e) => setNewRent(Number(e.target.value))}
              className="w-full px-2.5 py-1.5 bg-white border border-warm-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-sage-500"
            />
          </div>
          <div className="flex items-end gap-2">
            <button
              type="submit"
              className="flex-1 px-3 py-1.5 bg-sage-600 hover:bg-sage-700 text-white rounded-xl font-medium shadow-soft-sm"
            >
              Commit Tenant
            </button>
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-2.5 py-1.5 bg-warm-200 text-warm-700 hover:bg-warm-300 rounded-xl"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </form>
      )}

      {/* Rent Roll Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-warm-100/70 border-b border-warm-200 text-warm-600 font-semibold uppercase tracking-wider text-[11px]">
              <th className="py-2.5 px-4">Suite / Unit</th>
              <th className="py-2.5 px-4">Tenant / Industry</th>
              <th className="py-2.5 px-3">GLA SqFt</th>
              <th className="py-2.5 px-3">Lease Expiry</th>
              <th className="py-2.5 px-3">Monthly Rent</th>
              <th className="py-2.5 px-3">Delinquency (Days)</th>
              <th className="py-2.5 px-3">Lease Status</th>
              <th className="py-2.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-warm-200/80 bg-white">
            {tenants.map((t) => {
              const isActive = t.status === 'Active';
              const isDelinquent = isActive && t.paymentDelinquencyDays > 30;

              return (
                <tr
                  key={t.id}
                  className={`transition-colors ${
                    !isActive
                      ? 'bg-warm-50/70 text-warm-400'
                      : isDelinquent
                      ? 'bg-brick-50/30'
                      : 'hover:bg-warm-50'
                  }`}
                >
                  {/* Suite */}
                  <td className="py-3 px-4 font-mono font-semibold text-warm-800">
                    <div className="flex items-center gap-1.5">
                      <span>{t.suiteId}</span>
                      {t.isAnchor && (
                        <span className="text-[9px] uppercase px-1.5 py-0.2 rounded bg-warm-200 text-warm-800 font-sans font-bold">
                          Anchor
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Tenant Name */}
                  <td className="py-3 px-4">
                    <div className="font-medium text-warm-900">{t.tenantName}</div>
                    <div className="text-[11px] text-warm-500">{t.industry || 'Commercial Office'}</div>
                  </td>

                  {/* SqFt */}
                  <td className="py-3 px-3 tabular-nums font-medium text-warm-800">
                    {t.sqft.toLocaleString()} sqft
                    <div className="text-[10px] text-warm-400">
                      {((t.sqft / Math.max(1, totalGLA)) * 100).toFixed(1)}% of GLA
                    </div>
                  </td>

                  {/* Lease Expiry */}
                  <td className="py-3 px-3 font-mono text-[11px] text-warm-600">
                    {t.leaseEnd || '— (Vacant)'}
                  </td>

                  {/* Monthly Rent */}
                  <td className="py-3 px-3 tabular-nums">
                    <input
                      type="number"
                      disabled={!isActive}
                      value={t.monthlyBaseRent}
                      onChange={(e) =>
                        onUpdateTenant(t.id, { monthlyBaseRent: Math.max(0, Number(e.target.value)) })
                      }
                      className="w-24 px-2 py-1 text-xs font-semibold bg-warm-50 border border-warm-200 rounded-lg text-warm-900 focus:outline-none focus:ring-1 focus:ring-sage-500 disabled:opacity-40"
                    />
                    <div className="text-[10px] text-warm-500 mt-0.5">
                      {formatCurrency(t.monthlyBaseRent * 12, true)}/yr
                    </div>
                  </td>

                  {/* Delinquency Stepper */}
                  <td className="py-3 px-3 tabular-nums">
                    <div className="flex items-center gap-1.5">
                      <select
                        disabled={!isActive}
                        value={t.paymentDelinquencyDays}
                        onChange={(e) =>
                          onUpdateTenant(t.id, { paymentDelinquencyDays: Number(e.target.value) })
                        }
                        className={`text-xs px-2 py-1 rounded-lg border font-medium focus:outline-none focus:ring-1 ${
                          t.paymentDelinquencyDays === 0
                            ? 'bg-sage-50 text-sage-800 border-sage-200'
                            : t.paymentDelinquencyDays <= 30
                            ? 'bg-amber-50 text-amber-800 border-amber-200'
                            : 'bg-brick-100 text-brick-900 border-brick-300 font-bold animate-pulse'
                        } disabled:opacity-40`}
                      >
                        <option value={0}>0 Days (Current)</option>
                        <option value={15}>15 Days Past Due</option>
                        <option value={30}>30 Days Past Due</option>
                        <option value={45}>45 Days (Econ Loss)</option>
                        <option value={60}>60 Days (Econ Loss)</option>
                        <option value={90}>90+ Days (Default)</option>
                      </select>
                    </div>
                  </td>

                  {/* Status Toggle Switch */}
                  <td className="py-3 px-3">
                    <button
                      onClick={() =>
                        onUpdateTenant(t.id, {
                          status: isActive ? 'Vacant' : 'Active',
                          monthlyBaseRent: isActive ? 0 : t.monthlyBaseRent || 50000,
                        })
                      }
                      className={`organic-pill px-3 py-1 text-xs font-semibold transition-all ${
                        isActive
                          ? 'bg-sage-100 text-sage-800 border border-sage-300 hover:bg-sage-200'
                          : 'bg-warm-200 text-warm-700 border border-warm-300 hover:bg-warm-300'
                      }`}
                    >
                      {isActive ? (
                        <>
                          <Check className="w-3 h-3 text-sage-600" />
                          <span>Active</span>
                        </>
                      ) : (
                        <>
                          <X className="w-3 h-3 text-warm-500" />
                          <span>Vacant</span>
                        </>
                      )}
                    </button>
                  </td>

                  {/* Delete / Actions */}
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => onDeleteTenant(t.id)}
                      className="p-1.5 text-warm-400 hover:text-brick-600 hover:bg-brick-50 rounded-lg transition-colors"
                      title="Remove suite from roster"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Roster Summary Footer */}
      <div className="p-4 bg-warm-100/70 border-t border-warm-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-warm-700">
        <div className="flex items-center gap-4">
          <div>
            Occupied Space: <span className="font-semibold text-warm-900">{totalOccupiedSqft.toLocaleString()}</span> / {totalGLA.toLocaleString()} sqft ({((totalOccupiedSqft / Math.max(1, totalGLA)) * 100).toFixed(1)}%)
          </div>
          <span className="text-warm-300">•</span>
          <div>
            Total In-Place Rent: <span className="font-semibold text-warm-900">{formatCurrency(totalMonthlyInPlace)}/mo</span> ({formatCurrency(totalMonthlyInPlace * 12, true)}/yr)
          </div>
        </div>
        {totalDelinquentMonthly > 0 && (
          <div className="organic-pill px-2.5 py-1 bg-brick-100 text-brick-900 border border-brick-200 font-semibold">
            Delinquency Rent Loss: {formatCurrency(totalDelinquentMonthly * 12, true)} annualized
          </div>
        )}
      </div>
    </div>
  );
};
