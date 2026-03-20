import PropTypes from "prop-types";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

export default function PieChartComponent({ data }) {
  const CustomPieLegend = () => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 10,
        justifyContent: "center",
      }}
    >
      {data.map((d) => (
        <div
          key={d.name}
          style={{ display: "flex", alignItems: "center", gap: 10 }}
        >
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: 3,
              background: d.color,
              flexShrink: 0,
            }}
          />
          <span style={{ fontSize: 13.5, fontWeight: 600, color: d.color }}>
            {d.name} {d.value}%
          </span>
        </div>
      ))}
    </div>
  );

  return (
    <div className="chart-card">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 9,
          marginBottom: 6,
        }}
      >
        <svg
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
        <span
          style={{ fontSize: 17, fontWeight: 700, letterSpacing: "-0.02em" }}
        >
          Distribuição por Tipo
        </span>
      </div>
      <p style={{ margin: "0 0 20px", fontSize: 13, color: "#94a3b8" }}>
        Participação percentual por tipo
      </p>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 24,
        }}
      >
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

      {/* Summary below pie */}
      <div
        style={{
          marginTop: 18,
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        {data.map(({ name, value, color }) => (
          <div
            key={name}
            style={{ display: "flex", alignItems: "center", gap: 10 }}
          >
            <div
              style={{
                flex: 1,
                height: 6,
                borderRadius: 3,
                background: "#f1f5f9",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${value}%`,
                  height: "100%",
                  background: color,
                  borderRadius: 3,
                  transition: "width 0.8s ease",
                }}
              />
            </div>
            <span
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: "#64748b",
                minWidth: 32,
                textAlign: "right",
              }}
            >
              {value}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

PieChartComponent.propTypes = {
  data: PropTypes.array.isRequired,
};
