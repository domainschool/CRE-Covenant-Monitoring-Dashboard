import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from 'recharts';
import { Tenant } from '../../types/cre';
import { formatCurrency } from '../../lib/cre-calculator';

interface LeaseRolloverChartProps {
  tenants: Tenant[];
  totalGLA: number;
}

export const LeaseRolloverChart: React.FC<LeaseRolloverChartProps> = ({
  tenants,
  totalGLA,
}) => {
  // Aggregate square footage expiration by year
  const currentYear = new Date().getFullYear();
  const yearBuckets: { [year: string]: { sqft: number; rent: number; count: number } } = {
    [currentYear]: { sqft: 0, rent: 0, count: 0 },
    [currentYear + 1]: { sqft: 0, rent: 0, count: 0 },
    [currentYear + 2]: { sqft: 0, rent: 0, count: 0 },
    [currentYear + 3]: { sqft: 0, rent: 0, count: 0 },
    [`${currentYear + 4}+`]: { sqft: 0, rent: 0, count: 0 },
    'Vacant': { sqft: 0, rent: 0, count: 0 },
  };

  tenants.forEach((t) => {
    if (t.status === 'Vacant' || !t.leaseEnd) {
      yearBuckets['Vacant'].sqft += t.sqft;
      yearBuckets['Vacant'].count += 1;
      return;
    }

    const expYear = new Date(t.leaseEnd).getFullYear();
    if (isNaN(expYear)) {
      yearBuckets['Vacant'].sqft += t.sqft;
    } else if (expYear <= currentYear) {
      yearBuckets[currentYear].sqft += t.sqft;
      yearBuckets[currentYear].rent += t.monthlyBaseRent * 12;
      yearBuckets[currentYear].count += 1;
    } else if (expYear === currentYear + 1) {
      yearBuckets[currentYear + 1].sqft += t.sqft;
      yearBuckets[currentYear + 1].rent += t.monthlyBaseRent * 12;
      yearBuckets[currentYear + 1].count += 1;
    } else if (expYear === currentYear + 2) {
      yearBuckets[currentYear + 2].sqft += t.sqft;
      yearBuckets[currentYear + 2].rent += t.monthlyBaseRent * 12;
      yearBuckets[currentYear + 2].count += 1;
    } else if (expYear === currentYear + 3) {
      yearBuckets[currentYear + 3].sqft += t.sqft;
      yearBuckets[currentYear + 3].rent += t.monthlyBaseRent * 12;
      yearBuckets[currentYear + 3].count += 1;
    } else {
      yearBuckets[`${currentYear + 4}+`].sqft += t.sqft;
      yearBuckets[`${currentYear + 4}+`].rent += t.monthlyBaseRent * 12;
      yearBuckets[`${currentYear + 4}+`].count += 1;
    }
  });

  const chartData = Object.entries(yearBuckets).map(([year, data]) => {
    const pctOfGLA = totalGLA > 0 ? (data.sqft / totalGLA) * 100 : 0;
    return {
      year,
      sqft: data.sqft,
      rent: data.rent,
      count: data.count,
      pctOfGLA: Number(pctOfGLA.toFixed(1)),
      isHighRisk: pctOfGLA >= 25 && year !== `${currentYear + 4}+`,
    };
  });

  return (
    <div className="organic-card p-5 bg-white">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <h4 className="font-editorial text-base font-bold text-warm-900">
            Lease Rollover & Expiration Schedule
          </h4>
          <p className="text-xs text-warm-500">
            Square footage expiration timeline. Years with &gt;25% GLA expiration highlighted as rollover risk.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="w-2.5 h-2.5 rounded bg-terracotta-500"></span>
          <span className="text-warm-600 font-medium">&gt;25% GLA Risk</span>
        </div>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F5F5F4" vertical={false} />
            <XAxis
              dataKey="year"
              tick={{ fontSize: 11, fill: '#78716C' }}
              axisLine={{ stroke: '#E7E5E4' }}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: '#78716C' }}
              axisLine={{ stroke: '#E7E5E4' }}
              tickLine={false}
              tickFormatter={(v) => `${(v / 1000).toFixed(0)}k sf`}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-white p-3 rounded-2xl border border-warm-200 shadow-soft-lg text-xs space-y-1">
                      <div className="font-editorial font-bold text-warm-900 border-b border-warm-100 pb-1">
                        {label} Lease Expirations
                      </div>
                      <div className="text-warm-700">
                        Expiring GLA: <span className="font-bold">{data.sqft.toLocaleString()} sqft</span> ({data.pctOfGLA}% of building)
                      </div>
                      {data.rent > 0 && (
                        <div className="text-warm-600">
                          Expiring Rent: <span className="font-semibold text-warm-900">{formatCurrency(data.rent, true)}/yr</span>
                        </div>
                      )}
                      <div className="text-warm-500">
                        Tenants: {data.count} lease agreements
                      </div>
                      {data.isHighRisk && (
                        <div className="text-[10px] text-terracotta-800 bg-terracotta-50 px-2 py-0.5 rounded font-semibold mt-1">
                          ⚠️ Rollover Concentration Exceeds 25% Threshold
                        </div>
                      )}
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="sqft" radius={[8, 8, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={
                    entry.year === 'Vacant'
                      ? '#D6D3D1'
                      : entry.isHighRisk
                      ? '#C2410C'
                      : '#588767'
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
