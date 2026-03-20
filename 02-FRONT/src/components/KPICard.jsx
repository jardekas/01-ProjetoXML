import PropTypes from "prop-types";

export default function KPICard({ label, icon, value, trend, trendUp, delay }) {
  return (
    <div
      className="stat-card"
      style={{ animation: `fadeIn 0.4s ease ${delay}s both` }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 12,
        }}
      >
        <span
          style={{
            fontSize: 12.5,
            fontWeight: 500,
            color: "#64748b",
            lineHeight: 1.3,
          }}
        >
          {label}
        </span>
        <span style={{ color: "#94a3b8", flexShrink: 0 }}>{icon}</span>
      </div>
      <div
        style={{
          fontSize: value.length > 12 ? 17 : 24,
          fontWeight: 700,
          letterSpacing: "-0.02em",
          color: "#0f172a",
          marginBottom: 8,
          lineHeight: 1.2,
        }}
      >
        {value}
      </div>
      <div
        style={{
          fontSize: 12,
          fontWeight: 500,
          color: trendUp ? "#16a34a" : "#dc2626",
          display: "flex",
          alignItems: "center",
          gap: 4,
        }}
      >
        <svg
          width="11"
          height="11"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
        >
          {trendUp ? (
            <>
              <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
              <polyline points="17 6 23 6 23 12" />
            </>
          ) : (
            <>
              <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" />
              <polyline points="17 18 23 18 23 12" />
            </>
          )}
        </svg>
        {trend}
      </div>
    </div>
  );
}

KPICard.propTypes = {
  label: PropTypes.string.isRequired,
  icon: PropTypes.node.isRequired,
  value: PropTypes.string.isRequired,
  trend: PropTypes.string.isRequired,
  trendUp: PropTypes.bool.isRequired,
  delay: PropTypes.number.isRequired,
};
