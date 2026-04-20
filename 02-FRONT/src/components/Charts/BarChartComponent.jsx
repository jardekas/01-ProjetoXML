import { useState } from "react";
import PropTypes from "prop-types";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import ChartTooltip from "./ChartTooltip";

export default function BarChartComponent({ data, legendItems }) {
  const [activeBar, setActiveBar] = useState(null);

  return (
    <div className="chart-card">
      <div className="chart-header">
        <svg
          className="chart-header-icon"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#1d4ed8"
          strokeWidth="2"
        >
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
        </svg>
        <span className="chart-header-title">Documentos por Mês</span>
      </div>
      <p className="chart-subtitle">Emissões mensais por tipo de documento</p>

      <div className="chart-legend">
        {legendItems.map(({ color, label }) => (
          <div key={label} className="chart-legend-item">
            <div className="chart-legend-color" style={{ background: color }} />
            <span className="chart-legend-label">{label}</span>
          </div>
        ))}
      </div>

      <ResponsiveContainer width="100%" height={260}>
        <BarChart
          data={data}
          barGap={4}
          barCategoryGap="28%"
          onMouseMove={(e) => {
            if (e.activeLabel) setActiveBar(e.activeLabel);
          }}
          onMouseLeave={() => setActiveBar(null)}
        >
          <CartesianGrid
            strokeDasharray="4 4"
            stroke="#f1f5f9"
            vertical={false}
          />
          <XAxis
            dataKey="mes"
            axisLine={false}
            tickLine={false}
            tick={{
              fill: "#94a3b8",
              fontSize: 12.5,
              fontFamily: "'Outfit',sans-serif",
            }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{
              fill: "#94a3b8",
              fontSize: 12,
              fontFamily: "'Outfit',sans-serif",
            }}
          />
          <Tooltip
            content={<ChartTooltip />}
            cursor={{ fill: "rgba(59,130,246,0.04)", radius: 6 }}
          />
          <Bar
            dataKey="nfe"
            name="nfe"
            fill="#1e3a5f"
            radius={[5, 5, 0, 0]}
            maxBarSize={20}
          />
          <Bar
            dataKey="nfce"
            name="nfce"
            fill="#22c55e"
            radius={[5, 5, 0, 0]}
            maxBarSize={20}
          />
          <Bar
            dataKey="cte"
            name="cte"
            fill="#f59e0b"
            radius={[5, 5, 0, 0]}
            maxBarSize={20}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

BarChartComponent.propTypes = {
  data: PropTypes.array.isRequired,
  legendItems: PropTypes.array.isRequired,
};
