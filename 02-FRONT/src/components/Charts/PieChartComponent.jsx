import PropTypes from "prop-types";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

export default function PieChartComponent({ data }) {
  const CustomPieLegend = () => (
    <div className="pie-legend-custom">
      {data.map((d) => (
        <div key={d.name} className="pie-legend-item">
          <div className="pie-legend-color" style={{ background: d.color }} />
          <span className="pie-legend-label" style={{ color: d.color }}>
            {d.name} {d.value}%
          </span>
        </div>
      ))}
    </div>
  );

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
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
        <span className="chart-header-title">Distribuição por Tipo</span>
      </div>
      <p className="chart-subtitle">Participação percentual por tipo</p>

      <div className="pie-chart-wrapper">
        <ResponsiveContainer width={200} height={220}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={90}
              paddingAngle={3}
              dataKey="value"
              strokeWidth={0}
              animationBegin={0}
              animationDuration={800}
            >
              {data.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(v) => [`${v}%`]}
              contentStyle={{
                fontFamily: "'Outfit',sans-serif",
                borderRadius: 10,
                border: "1px solid #e2e8f0",
                fontSize: 13,
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        <CustomPieLegend />
      </div>

      <div className="pie-summary-bars">
        {data.map(({ name, value, color }) => (
          <div key={name} className="pie-summary-item">
            <div className="pie-summary-track">
              <div
                className="pie-summary-fill"
                style={{ width: `${value}%`, background: color }}
              />
            </div>
            <span className="pie-summary-percent">{value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

PieChartComponent.propTypes = {
  data: PropTypes.array.isRequired,
};
