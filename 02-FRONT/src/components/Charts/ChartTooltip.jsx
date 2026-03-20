import PropTypes from "prop-types";

export default function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;

  return (
    <div
      style={{
        background: "white",
        border: "1px solid #e2e8f0",
        borderRadius: 10,
        padding: "12px 16px",
        boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
        fontFamily: "'Outfit',sans-serif",
      }}
    >
      <div
        style={{
          fontWeight: 700,
          color: "#0f172a",
          marginBottom: 8,
          fontSize: 13,
        }}
      >
        {label}
      </div>
      {payload.map((p) => (
        <div
          key={p.name}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontSize: 13,
            marginBottom: 4,
          }}
        >
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: 2,
              background: p.fill,
            }}
          />
          <span style={{ color: "#64748b" }}>{p.name.toUpperCase()}:</span>
          <span style={{ fontWeight: 600, color: "#0f172a" }}>{p.value}</span>
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
