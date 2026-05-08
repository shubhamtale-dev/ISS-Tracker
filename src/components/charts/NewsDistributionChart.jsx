import React, { useMemo, useState } from 'react';
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, Sector,
} from 'recharts';
import { useNews } from '../../context/NewsContext';
import { Newspaper } from 'lucide-react';

const COLORS = [
  '#3b82f6','#8b5cf6','#10b981','#f59e0b','#f43f5e',
  '#06b6d4','#84cc16','#ec4899','#f97316','#6366f1',
];

function ActiveShape(props) {
  const {
    cx, cy, innerRadius, outerRadius, startAngle, endAngle,
    fill, payload, percent, value,
  } = props;
  return (
    <g>
      <text x={cx} y={cy - 12} textAnchor="middle" fill={fill} className="text-sm font-bold">
        {payload.name}
      </text>
      <text x={cx} y={cy + 12} textAnchor="middle" fill="#94a3b8" className="text-xs">
        {value} article{value !== 1 ? 's' : ''} · {(percent * 100).toFixed(0)}%
      </text>
      <Sector
        cx={cx} cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 8}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx} cy={cy}
        innerRadius={outerRadius + 12}
        outerRadius={outerRadius + 16}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
    </g>
  );
}

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-dark-800 border border-dark-600 rounded-xl px-4 py-3 shadow-2xl">
      <p className="text-sm font-bold text-white">{payload[0].name}</p>
      <p className="text-xs text-slate-400">{payload[0].value} articles</p>
    </div>
  );
}

export default function NewsDistributionChart() {
  const { articles } = useNews();
  const [activeIndex, setActiveIndex] = useState(0);
  const [hiddenSources, setHiddenSources] = useState(new Set());

  const data = useMemo(() => {
    const counts = {};
    articles.forEach(a => {
      const src = a.source?.name || 'Unknown';
      counts[src] = (counts[src] || 0) + 1;
    });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .map(([name, value]) => ({ name, value }));
  }, [articles]);

  const visibleData = data.filter(d => !hiddenSources.has(d.name));

  const toggleSource = (name) => {
    setHiddenSources(prev => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };

  return (
    <div className="card p-5 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center">
          <Newspaper className="w-4 h-4 text-violet-600 dark:text-violet-400" />
        </div>
        <div>
          <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm">News by Source</h3>
          <p className="text-xs text-slate-400">Click legend to filter sources</p>
        </div>
      </div>

      {/* Chart */}
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              activeIndex={activeIndex}
              activeShape={<ActiveShape />}
              data={visibleData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              dataKey="value"
              onMouseEnter={(_, index) => setActiveIndex(index)}
            >
              {visibleData.map((entry, index) => (
                <Cell
                  key={entry.name}
                  fill={COLORS[data.findIndex(d => d.name === entry.name) % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Interactive legend */}
      <div className="flex flex-wrap gap-2">
        {data.map((d, i) => (
          <button
            key={d.name}
            onClick={() => toggleSource(d.name)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-all ${
              hiddenSources.has(d.name)
                ? 'opacity-40 border-slate-300 dark:border-dark-600 text-slate-400'
                : 'border-transparent text-white'
            }`}
            style={!hiddenSources.has(d.name) ? { background: COLORS[i % COLORS.length] } : {}}
          >
            <span
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ background: COLORS[i % COLORS.length] }}
            />
            {d.name}
          </button>
        ))}
      </div>
    </div>
  );
}
