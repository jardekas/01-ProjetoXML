import PropTypes from "prop-types";

export default function KPICard({ label, icon, value, trend, trendUp, delay }) {
  const valueClassName =
    value.length > 12
      ? "kpi-card-value kpi-card-value--large"
      : "kpi-card-value";
  const trendClassName = `kpi-card-trend ${trendUp ? "kpi-card-trend--up" : "kpi-card-trend--down"}`;

  return (
    <div
      className="stat-card"
      style={{ animation: `fadeIn 0.4s ease ${delay}s both` }}
    >
      <div className="kpi-card-header">
        <span className="kpi-card-label">{label}</span>
        <span className="kpi-card-icon">{icon}</span>
      </div>
      <div className={valueClassName}>{value}</div>
      <div className={trendClassName}>
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
