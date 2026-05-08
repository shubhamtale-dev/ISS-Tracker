import React, { useMemo } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine, Area, AreaChart,
} from 'recharts';
import { useISS } from '../../context/ISSContext';
import { Zap } from 'lucide-react';

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-dark-800 border border-dark-600 rounded-xl px-4 py-3 shadow-2xl">
      <p className="text-xs text-slate-400 mb-1">{label}</p>
      <p className="text-sm font-bold text-primary-400">
        {payload[0].value?.toLocaleString()} km/h
      </p>
    </div>
  );
}

export default function SpeedChart() {
  const { speedHistory } = useISS();

  const avgSpeed = useMemo(() => {
    if (!speedHistory.length) return 0;
    return Math.round(speedHistory.reduce((s, d) => s + d.speed, 0) / speedHistory.length);
  }, [speedHistory]);

  const data = speedHistory.length > 0
    ? speedHistory
    : Array.from({ length: 10 }, (_, i) => ({
        time: `${String(i).padStart(2, '0')}:00`,
        speed: 27600 + Math.round(Math.random() * 200 - 100),
      }));

  return (
    <div className="card p-5 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
            <Zap className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm">ISS Speed History</h3>
            <p className="text-xs text-slate-400">Last {data.length} measurements</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-slate-400">Avg Speed</p>
          <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400 font-mono">
            {avgSpeed.toLocaleString()} km/h
          </p>
        </div>
      </div>

      {/* Chart */}
      <div className="h-52">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="speedGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" />
            <XAxis
              dataKey="time"
              tick={{ fontSize: 10, fill: '#94a3b8' }}
              tickLine={false}
              axisLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              tick={{ fontSize: 10, fill: '#94a3b8' }}
              tickLine={false}
              axisLine={false}
              tickFormatter={v => `${(v / 1000).toFixed(0)}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            {avgSpeed > 0 && (
              <ReferenceLine
                y={avgSpeed}
                stroke="#f59e0b"
                strokeDasharray="4 4"
                label={{ value: 'Avg', position: 'right', fontSize: 10, fill: '#f59e0b' }}
              />
            )}
            <Area
              type="monotone"
              dataKey="speed"
              stroke="#10b981"
              strokeWidth={2.5}
              fill="url(#speedGradient)"
              dot={false}
              activeDot={{ r: 5, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
