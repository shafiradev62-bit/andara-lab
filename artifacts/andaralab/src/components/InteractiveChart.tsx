import {
  LineChart, Line, BarChart, Bar, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, ReferenceLine, ComposedChart
} from "recharts";
import { ChartDataset } from "@/lib/cms-store";
import { formatValue } from "@/lib/utils";

// Navy-to-gray professional palette — only these 6 colors allowed
export const CHART_PALETTE = [
  "#1e3a5f", // dark navy
  "#374151", // dark gray
  "#6b7280", // medium gray
  "#9ca3af", // light gray
  "#d1d5db", // lighter gray
  "#e5e7eb", // lightest gray
];

const DEFAULT_COLORS = CHART_PALETTE;

interface Props {
  dataset: ChartDataset;
  height?: number;
}

// Resolve color: use dataset.colors[i] if available, else DEFAULT_COLORS
function getColor(dataset: ChartDataset, i: number): string {
  if (dataset.colors && dataset.colors[i]) return dataset.colors[i];
  return DEFAULT_COLORS[i % DEFAULT_COLORS.length];
}

function CustomTooltip({ active, payload, label, dataset }: { active?: boolean; payload?: any[]; label?: string; dataset: ChartDataset }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-[#E5E7EB] shadow-lg px-4 py-3 rounded-sm min-w-[160px]">
      <p className="text-[12px] font-semibold text-gray-700 mb-2">{label}</p>
      {payload.map((p: any, i: number) => (
        <div key={i} className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-1.5">
            <span
              className="inline-block w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: p.color }}
            />
            <span className="text-[11.5px] text-gray-500">{p.dataKey}</span>
          </div>
          <span className="text-[12px] font-semibold text-gray-900">
            {typeof p.value === "number"
              ? formatValue(p.value, dataset.unitType, dataset.unit)
              : p.value}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function InteractiveChart({ dataset, height = 280 }: Props) {
  const dataKeys = dataset.columns.slice(1);
  const xKey = dataset.columns[0];
  const data = dataset.rows.map((r) => {
    const obj: Record<string, any> = {};
    for (const c of dataset.columns) obj[c] = r[c];
    return obj;
  });

  const commonProps = {
    data,
    margin: { top: 10, right: 10, left: 0, bottom: 0 },
  };

  const axisStyle = {
    tick: { fontSize: 11, fill: "#9CA3AF" },
    axisLine: { stroke: "#E5E7EB" },
    tickLine: false,
  };

  if (dataset.chartType === "bar") {
    return (
      <ResponsiveContainer width="100%" height={height}>
        <BarChart {...commonProps}>
          <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
          <XAxis dataKey={xKey} {...axisStyle} />
          <YAxis {...axisStyle} width={45} />
          <Tooltip content={<CustomTooltip dataset={dataset} />} cursor={{ fill: "rgba(0,0,0,0.04)" }} />
          <Legend
            wrapperStyle={{ fontSize: 11, color: "#6B7280", paddingTop: 8 }}
            iconType="circle"
            iconSize={8}
          />
          {dataKeys.map((key, i) => (
            <Bar key={key} dataKey={key} fill={getColor(dataset, i)} radius={[2, 2, 0, 0]} maxBarSize={40} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    );
  }

  if (dataset.chartType === "area") {
    return (
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart {...commonProps}>
          <defs>
            {dataKeys.map((key, i) => (
              <linearGradient key={key} id={`grad-${i}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={getColor(dataset, i)} stopOpacity={0.15} />
                <stop offset="95%" stopColor={getColor(dataset, i)} stopOpacity={0} />
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
          <XAxis dataKey={xKey} {...axisStyle} />
          <YAxis {...axisStyle} width={45} />
          <Tooltip content={<CustomTooltip dataset={dataset} />} />
          <Legend wrapperStyle={{ fontSize: 11, color: "#6B7280", paddingTop: 8 }} iconType="circle" iconSize={8} />
          {dataKeys.map((key, i) => (
            <Area
              key={key}
              type="monotone"
              dataKey={key}
              stroke={getColor(dataset, i)}
              strokeWidth={2}
              fill={`url(#grad-${i})`}
              dot={{ r: 3, strokeWidth: 0, fill: getColor(dataset, i) }}
              activeDot={{ r: 5, strokeWidth: 0 }}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    );
  }

  if (dataset.chartType === "combo") {
    // All columns except last → bars; last column → line overlay
    const barKeys = dataKeys.slice(0, -1);
    const lineKey = dataKeys[dataKeys.length - 1];
    return (
      <ResponsiveContainer width="100%" height={height}>
        <ComposedChart {...commonProps}>
          <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
          <XAxis dataKey={xKey} {...axisStyle} />
          <YAxis {...axisStyle} width={45} />
          <Tooltip content={<CustomTooltip dataset={dataset} />} cursor={{ fill: "rgba(0,0,0,0.04)" }} />
          <Legend wrapperStyle={{ fontSize: 11, color: "#6B7280", paddingTop: 8 }} iconType="circle" iconSize={8} />
          {barKeys.map((key, i) => (
            <Bar
              key={key}
              dataKey={key}
              fill={getColor(dataset, i)}
              radius={[2, 2, 0, 0]}
              maxBarSize={40}
            />
          ))}
          <Line
            key={lineKey}
            type="monotone"
            dataKey={lineKey}
            stroke={getColor(dataset, barKeys.length)}
            strokeWidth={2.5}
            dot={{ r: 3, strokeWidth: 0, fill: getColor(dataset, barKeys.length) }}
            activeDot={{ r: 5, strokeWidth: 1, stroke: "#fff" }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart {...commonProps}>
        <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
        <XAxis dataKey={xKey} {...axisStyle} />
        <YAxis {...axisStyle} width={45} />
        <Tooltip content={<CustomTooltip dataset={dataset} />} />
        <Legend wrapperStyle={{ fontSize: 11, color: "#6B7280", paddingTop: 8 }} iconType="circle" iconSize={8} />
        {dataKeys.map((key, i) => (
          <Line
            key={key}
            type="monotone"
            dataKey={key}
            stroke={getColor(dataset, i)}
            strokeWidth={2}
            dot={{ r: 3, strokeWidth: 0, fill: getColor(dataset, i) }}
            activeDot={{ r: 5, strokeWidth: 1, stroke: "#fff" }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}
