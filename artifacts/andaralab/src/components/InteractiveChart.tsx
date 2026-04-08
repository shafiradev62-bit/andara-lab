import {
  LineChart, Line, BarChart, Bar, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, ReferenceLine, ComposedChart
} from "recharts";
import { ChartDataset } from "@/lib/cms-store";
import { formatValue } from "@/lib/utils";
import { useLocale } from "@/lib/locale";

// Andara Lab professional palette — data visualization colors
export const CHART_PALETTE = [
  "#1a3a5c", // navy
  "#2a5a8c", // blue
  "#0d9fbf", // teal
  "#3b82f6", // bright blue
  "#f59e0b", // gold
  "#ef4444", // coral
  "#8b5cf6", // purple
  "#5b21b6", // dark purple
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

/** Get display name for a column, respecting current locale */
function getColumnLabel(dataset: ChartDataset, colKey: string): string {
  if (dataset.columnNames) {
    // columnNames order mirrors the columns array
    const idx = dataset.columns.indexOf(colKey);
    const localeNames = dataset.columnNames.en ?? dataset.columnNames.id;
    if (localeNames && localeNames[idx] !== undefined) {
      return localeNames[idx];
    }
  }
  return colKey;
}

function CustomTooltip({ active, payload, label, dataset, columnNames }: { active?: boolean; payload?: any[]; label?: string; dataset: ChartDataset; columnNames?: Record<string, string> }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-[#E5E7EB] shadow-lg px-4 py-3 rounded-sm min-w-[160px]">
      <p className="text-[12px] font-semibold text-gray-700 mb-2">{label}</p>
      {payload.map((p: any, i: number) => {
        const displayName = columnNames?.[p.dataKey] ?? p.dataKey;
        return (
          <div key={i} className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-1.5">
              <span
                className="inline-block w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: p.color }}
              />
              <span className="text-[11.5px] text-gray-500">{displayName}</span>
            </div>
            <span className="text-[12px] font-semibold text-gray-900">
              {typeof p.value === "number"
                ? formatValue(p.value, dataset.unitType, dataset.unit)
                : p.value}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export default function InteractiveChart({ dataset, height = 280 }: Props) {
  const { locale } = useLocale();
  const dataKeys = dataset.columns.slice(1);
  const xKey = dataset.columns[0];

  // Build locale-aware column names map for tooltip/legend
  const columnNameMap: Record<string, string> = {};
  for (const col of dataset.columns) {
    columnNameMap[col] = getColumnLabel(dataset, col);
  }

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
          <Tooltip content={<CustomTooltip dataset={dataset} columnNames={columnNameMap} />} cursor={{ fill: "rgba(0,0,0,0.04)" }} />
          <Legend
            formatter={(value) => columnNameMap[value] ?? value}
            wrapperStyle={{ fontSize: 11, color: "#6B7280", paddingTop: 8 }}
            iconType="circle"
            iconSize={8}
          />
          {dataKeys.map((key, i) => (
            <Bar key={key} dataKey={key} fill={getColor(dataset, i)} radius={[2, 2, 0, 0]} maxBarSize={40} name={columnNameMap[key] ?? key} />
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
          <Tooltip content={<CustomTooltip dataset={dataset} columnNames={columnNameMap} />} />
          <Legend
            formatter={(value) => columnNameMap[value] ?? value}
            wrapperStyle={{ fontSize: 11, color: "#6B7280", paddingTop: 8 }}
            iconType="circle"
            iconSize={8}
          />
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
              name={columnNameMap[key] ?? key}
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
          <Tooltip content={<CustomTooltip dataset={dataset} columnNames={columnNameMap} />} cursor={{ fill: "rgba(0,0,0,0.04)" }} />
          <Legend
            formatter={(value) => columnNameMap[value] ?? value}
            wrapperStyle={{ fontSize: 11, color: "#6B7280", paddingTop: 8 }}
            iconType="circle"
            iconSize={8}
          />
          {barKeys.map((key, i) => (
            <Bar
              key={key}
              dataKey={key}
              fill={getColor(dataset, i)}
              radius={[2, 2, 0, 0]}
              maxBarSize={40}
              name={columnNameMap[key] ?? key}
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
            name={columnNameMap[lineKey] ?? lineKey}
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
        <Tooltip content={<CustomTooltip dataset={dataset} columnNames={columnNameMap} />} />
        <Legend
          formatter={(value) => columnNameMap[value] ?? value}
          wrapperStyle={{ fontSize: 11, color: "#6B7280", paddingTop: 8 }}
          iconType="circle"
          iconSize={8}
        />
        {dataKeys.map((key, i) => (
          <Line
            key={key}
            type="monotone"
            dataKey={key}
            stroke={getColor(dataset, i)}
            strokeWidth={2}
            dot={{ r: 3, strokeWidth: 0, fill: getColor(dataset, i) }}
            name={columnNameMap[key] ?? key}
            activeDot={{ r: 5, strokeWidth: 1, stroke: "#fff" }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}
