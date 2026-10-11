import React, { useState } from 'react';
import { Scale } from 'lucide-react';
import { ProgressLog } from '../types';

export interface MetricConfig {
  key: string;
  label: string;
  unit: string;
  color: string;
  isCustom?: boolean;
}

export interface EvolutionChartProps {
  logs: ProgressLog[];
  selectedMetrics: string[];
  metricConfigs: MetricConfig[];
  startDate?: string;
  endDate?: string;
}

export const EvolutionChart: React.FC<EvolutionChartProps> = ({ 
  logs, 
  selectedMetrics, 
  metricConfigs,
  startDate, 
  endDate 
}) => {
  const [hoveredPoint, setHoveredPoint] = useState<{
    x: number;
    y: number;
    metricLabel: string;
    val: number | string;
    unit: string;
    date: string;
    color: string;
  } | null>(null);

  if (!logs || logs.length === 0 || selectedMetrics.length === 0) return null;

  // Single point fallback
  if (logs.length === 1) {
    const single = logs[0];
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500">
        <Scale className="w-8 h-8 text-amber-500 mb-2" />
        <p className="text-sm font-bold text-slate-800 dark:text-white">Apenas 1 registo disponível ({single.date})</p>
        <p className="text-xs text-slate-400 mt-1">Peso: {single.weightKg}kg • %BF: {single.bodyFatPercent !== undefined ? `${single.bodyFatPercent}%` : '--'}</p>
        <p className="text-[11px] text-amber-500 mt-2">Adiciona uma segunda avaliação para visualizar e cruzar a curva temporal.</p>
      </div>
    );
  }

  const width = 800;
  const height = 260;
  const paddingX = 55;
  const paddingTop = 25;
  const paddingBottom = 42;
  const chartWidth = width - paddingX * 2;
  const chartHeight = height - paddingTop - paddingBottom;

  // Proportional time mapping between startDate and endDate
  const startTime = startDate ? new Date(startDate).getTime() : new Date(logs[0].date).getTime();
  const endTime = endDate ? new Date(endDate).getTime() : new Date(logs[logs.length - 1].date).getTime();
  const timeSpan = Math.max(86400000, endTime - startTime); // At least 1 day in ms

  const getX = (dateStr: string, index: number) => {
    if (logs.length <= 1) return paddingX + chartWidth / 2;
    const t = new Date(dateStr).getTime();
    if (isNaN(t)) return paddingX + (index / (logs.length - 1)) * chartWidth;
    const ratio = Math.max(0, Math.min(1, (t - startTime) / timeSpan));
    return paddingX + ratio * chartWidth;
  };

  const getMetricVal = (log: ProgressLog, mKey: string): number | undefined => {
    if (mKey === 'weight') return log.weightKg;
    if (mKey === 'bodyFat') return log.bodyFatPercent;
    if (mKey === 'muscleMass') return log.muscleMassKg !== undefined ? log.muscleMassKg : (log.weightKg * (1 - (log.bodyFatPercent || 20) / 100) * 0.55);
    if (mKey === 'waist') return log.waistCm;
    if (mKey === 'arm') return log.armCm;
    if (mKey === 'chest') return log.chestCm;
    if (mKey === 'thigh') return log.thighCm;
    if (mKey === 'hips') return log.hipsCm;
    
    // Custom metrics lookup
    if (log.customValues && log.customValues[mKey] !== undefined) {
      return log.customValues[mKey];
    }
    return undefined;
  };

  // Compute points and SVG path for each selected metric
  const seriesList = selectedMetrics.map(mKey => {
    const config = metricConfigs.find(m => m.key === mKey) || {
      key: mKey,
      label: mKey,
      unit: '',
      color: '#f59e0b'
    };

    const validLogs = logs
      .map((log, index) => ({ log, index, val: getMetricVal(log, mKey) }))
      .filter((item): item is { log: ProgressLog; index: number; val: number } => typeof item.val === 'number' && !isNaN(item.val));

    if (validLogs.length === 0) return null;

    const values = validLogs.map(item => item.val);
    const minVal = Math.floor(Math.min(...values) * 0.98);
    const maxVal = Math.ceil(Math.max(...values) * 1.02);
    const range = maxVal - minVal || 1;

    const points = validLogs.map(item => {
      const x = getX(item.log.date, item.index);
      const y = paddingTop + chartHeight - ((item.val - minVal) / range) * chartHeight;
      return {
        x,
        y,
        val: Number(item.val.toFixed(1)),
        date: item.log.date,
        metricLabel: config.label,
        unit: config.unit,
        color: config.color
      };
    });

    const pathD = points.reduce((acc, p, i) => {
      if (i === 0) return `M ${p.x} ${p.y}`;
      const prev = points[i - 1];
      const cx1 = prev.x + (p.x - prev.x) / 2;
      const cy1 = prev.y;
      const cx2 = prev.x + (p.x - prev.x) / 2;
      const cy2 = p.y;
      return `${acc} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${p.x} ${p.y}`;
    }, '');

    return {
      config,
      points,
      pathD,
      minVal,
      maxVal
    };
  }).filter((s): s is NonNullable<typeof s> => s !== null);

  return (
    <svg 
      viewBox={`0 0 ${width} ${height}`} 
      className="w-full h-full overflow-visible select-none"
      onMouseLeave={() => setHoveredPoint(null)}
    >
      {/* Background horizontal gridlines */}
      {[0, 0.33, 0.66, 1].map((pct, idx) => {
        const y = paddingTop + chartHeight * (1 - pct);
        return (
          <line 
            key={idx}
            x1={paddingX} 
            y1={y} 
            x2={width - paddingX} 
            y2={y} 
            stroke="currentColor" 
            strokeOpacity="0.08" 
            strokeDasharray="4 4"
          />
        );
      })}

      {/* Timeline Bottom Axis Range Labels */}
      <text x={paddingX} y={height - 2} textAnchor="start" className="text-[10px] font-mono fill-slate-400">
        De: {new Date(startTime).toLocaleDateString('pt-PT', { day: '2-digit', month: 'short' })}
      </text>
      <text x={width - paddingX} y={height - 2} textAnchor="end" className="text-[10px] font-mono fill-slate-400">
        Até: {new Date(endTime).toLocaleDateString('pt-PT', { day: '2-digit', month: 'short' })}
      </text>

      {/* Render each metric curve */}
      {seriesList.map((series) => (
        <g key={series.config.key}>
          {/* Curve */}
          <path
            d={series.pathD}
            fill="none"
            stroke={series.config.color}
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Points */}
          {series.points.map((p, i) => (
            <g key={`${series.config.key}-${i}`} className="cursor-pointer">
              <circle
                cx={p.x}
                cy={p.y}
                r="5"
                fill={series.config.color}
                stroke="#0f172a"
                strokeWidth="2"
                className="transition-transform hover:scale-150"
                onMouseEnter={() => setHoveredPoint(p)}
              />
            </g>
          ))}
        </g>
      ))}

      {/* Discreet Hover Indicator & Tooltip */}
      {hoveredPoint && (
        <g pointerEvents="none" className="transition-all duration-100 animate-fade-in">
          {/* Hairline vertical indicator */}
          <line
            x1={hoveredPoint.x}
            y1={paddingTop}
            x2={hoveredPoint.x}
            y2={paddingTop + chartHeight}
            stroke={hoveredPoint.color}
            strokeWidth="1.5"
            strokeDasharray="3 3"
            opacity="0.75"
          />

          {/* Floating point ring */}
          <circle
            cx={hoveredPoint.x}
            cy={hoveredPoint.y}
            r="8"
            fill="none"
            stroke={hoveredPoint.color}
            strokeWidth="2"
          />

          {/* Tooltip Card (positioned safely inside viewBox) */}
          {(() => {
            const cardW = 150;
            const cardH = 38;
            const cardX = Math.max(paddingX, Math.min(width - paddingX - cardW, hoveredPoint.x - cardW / 2));
            const cardY = Math.max(4, hoveredPoint.y - 48);

            return (
              <>
                <rect
                  x={cardX}
                  y={cardY}
                  width={cardW}
                  height={cardH}
                  rx="10"
                  fill="#09090b"
                  fillOpacity="0.95"
                  stroke={hoveredPoint.color}
                  strokeWidth="1.5"
                  filter="drop-shadow(0 4px 6px rgba(0,0,0,0.3))"
                />
                <text
                  x={cardX + cardW / 2}
                  y={cardY + 16}
                  textAnchor="middle"
                  className="text-[11px] font-black fill-white select-none"
                >
                  {hoveredPoint.metricLabel}: <tspan fill={hoveredPoint.color}>{hoveredPoint.val} {hoveredPoint.unit}</tspan>
                </text>
                <text
                  x={cardX + cardW / 2}
                  y={cardY + 29}
                  textAnchor="middle"
                  className="text-[9px] font-mono fill-slate-400 select-none"
                >
                  {new Date(hoveredPoint.date).toLocaleDateString('pt-PT', { day: '2-digit', month: 'short', year: 'numeric' })}
                </text>
              </>
            );
          })()}
        </g>
      )}
    </svg>
  );
};
