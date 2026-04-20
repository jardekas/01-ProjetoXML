import PropTypes from "prop-types";

export default function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;

  return (
    <div className="chart-tooltip">
      <div className="chart-tooltip-label">{label}</div>
      {payload.map((p) => (
        <div key={p.name} className="chart-tooltip-item">
          <div className="chart-tooltip-color" style={{ background: p.fill }} />
          <span className="chart-tooltip-name">{p.name.toUpperCase()}:</span>
          <span className="chart-tooltip-value">{p.value}</span>
        </div>
      ))}
    </div>
  );
}

ChartTooltip.propTypes = {
  active: PropTypes.bool,
  payload: PropTypes.array,
  label: PropTypes.string,
};
