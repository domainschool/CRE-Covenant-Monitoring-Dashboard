import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from 'recharts';
import { HistoricalSnapshot, LoanCovenants } from '../../types/cre';
import { formatRatio, formatPercent, formatCurrency } from '../../lib/cre-calculator';

interface CovenantTrendsChartProps {
  data: HistoricalSnapshot[];
  covenants: LoanCovenants;
  propertyName?: string;
}

export const CovenantTrendsChart: React.FC<CovenantTrendsChartProps> = ({
  data,
  covenants,
}) => {
  if (!data || data.length === 0) {
    return (
      <div className="p-8 text-center text-xs text-warm-400">
        No historical surveillance telemetry recorded for this facility.
      </div>
    );
  }

  return (
    <div className="organic-card p-5 bg-white">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <h4 className="font-editorial text-base font-bold text-warm-900">
            Surveillance Trajectory & Covenant Thresholds
          </h4>
          <p className="text-xs text-warm-500">
            Historical DSCR & Dynamic LTV against contractual maintenance floors.
          </p>
        </div>
        <div className="flex items-center gap-3 text-[11px]">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-sage-700"></span>
            <span className="text-warm-700 font-medium">In-Place DSCR</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-terracotta-600"></span>
            <span className="text-warm-700 font-medium">Dynamic LTV %</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 border-b-2 border-dashed border-brick-600"></span>
            <span className="text-brick-700 font-semibold">Breach Floor</span>
          </div>
        </div>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="dscrGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4D7C5B" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#4D7C5B" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="ltvGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#C2410C" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#C2410C" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#F5F5F4" vertical={false} />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 11, fill: '#78716C' }}
              axisLine={{ stroke: '#E7E5E4' }}
              tickLine={false}
            />
            {/* Left Axis: DSCR */}
            <YAxis
              yAxisId="left"
              domain={[0.8, 2.0]}
              tick={{ fontSize: 11, fill: '#4D7C5B' }}
              axisLine={{ stroke: '#E7E5E4' }}
              tickLine={false}
              tickFormatter={(v) => `${v.toFixed(2)}x`}
            />
            {/* Right Axis: LTV */}
            <YAxis
              yAxisId="right"
              orientation="right"
              domain={[30, 100]}
              tick={{ fontSize: 11, fill: '#C2410C' }}
              axisLine={{ stroke: '#E7E5E4' }}
              tickLine={false}
              tickFormatter={(v) => `${v}%`}
            />

            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  const item = payload[0].payload as HistoricalSnapshot;
                  return (
                    <div className="bg-white p-3 rounded-2xl border border-warm-200 shadow-soft-lg text-xs space-y-1">
                      <div className="font-editorial font-bold text-warm-900 border-b border-warm-100 pb-1">
                        {label} Snapshot
                      </div>
                      <div className="text-sage-800 font-medium">
                        DSCR: <span className="font-bold">{formatRatio(item.dscr)}</span> (Floor: {formatRatio(covenants.minDSCR)})
                      </div>
                      <div className="text-terracotta-800 font-medium">
                        Dynamic LTV: <span className="font-bold">{formatPercent(item.ltvPct, 1)}</span> (Max: {formatPercent(covenants.maxLTVPct, 0)})
                      </div>
                      <div className="text-warm-600">
                        In-Place NOI: <span className="font-medium text-warm-900">{formatCurrency(item.noi, true)}</span>
                      </div>
                      {item.isBreached && (
                        <div className="text-[10px] text-brick-700 bg-brick-50 px-2 py-0.5 rounded font-bold mt-1">
                          ⚠️ Covenant Breach Triggered
                        </div>
                      )}
                    </div>
                  );
                }
                return null;
              }}
            />

            {/* Reference Lines for Covenant Floors */}
            <ReferenceLine
              yAxisId="left"
              y={covenants.minDSCR}
              stroke="#991B1B"
              strokeDasharray="4 4"
              label={{
                value: `Min DSCR ${covenants.minDSCR}x`,
                fill: '#991B1B',
                fontSize: 10,
                position: 'insideTopLeft',
              }}
            />
            <ReferenceLine
              yAxisId="left"
              y={covenants.cashSweepDSCRThreshold}
              stroke="#EA580C"
              strokeDasharray="3 3"
              label={{
                value: `Cash Sweep ${covenants.cashSweepDSCRThreshold}x`,
                fill: '#EA580C',
                fontSize: 9,
                position: 'insideBottomLeft',
              }}
            />
            <ReferenceLine
              yAxisId="right"
              y={covenants.maxLTVPct}
              stroke="#B91C1C"
              strokeDasharray="4 4"
              label={{
                value: `Max LTV ${covenants.maxLTVPct}%`,
                fill: '#B91C1C',
                fontSize: 10,
                position: 'insideTopRight',
              }}
            />

            <Area
              yAxisId="left"
              type="monotone"
              dataKey="dscr"
              fill="url(#dscrGradient)"
              stroke="none"
            />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="dscr"
              stroke="#4D7C5B"
              strokeWidth={2.5}
              dot={{ r: 4, fill: '#4D7C5B', strokeWidth: 2, stroke: '#FFFFFF' }}
              activeDot={{ r: 6 }}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="ltvPct"
              stroke="#C2410C"
              strokeWidth={2}
              dot={{ r: 3, fill: '#C2410C', strokeWidth: 1.5, stroke: '#FFFFFF' }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
