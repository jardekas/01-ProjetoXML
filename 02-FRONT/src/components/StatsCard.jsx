import PropTypes from "prop-types";
export default function StatsCard({
  icon,
  bgColor,
  value,
  label,
  clickable,
  onClick,
}) {
  return (
    <div
      className={`stat-card ${clickable ? "stat-card--clickable" : ""}`}
      onClick={clickable ? onClick : undefined}
    >
      <div className="stat-card__icon" style={{ background: bgColor }}>
        {icon}
      </div>
      <div>
        <div className="stat-card__value">{value}</div>
        <div className="stat-card__label">{label}</div>
      </div>
    </div>
  );
}

StatsCard.propTypes = {
  icon: PropTypes.element.isRequired,
  bgColor: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  label: PropTypes.string.isRequired,
  clickable: PropTypes.bool,
  onClick: PropTypes.func,
};
