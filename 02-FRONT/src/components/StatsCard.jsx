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
      style={{
        background: "white",
        borderRadius: 14,
        padding: "20px 24px",
        display: "flex",
        alignItems: "center",
        gap: 16,
        border: "1px solid #e2e8f0",
        boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
        transition: "all 0.2s",
        cursor: clickable ? "pointer" : "default",
      }}
      onClick={clickable ? onClick : undefined}
    >
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: 12,
          background: bgColor,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        {icon}
      </div>
      <div>
        <div
          style={{
            fontSize: 24,
            fontWeight: 700,
            letterSpacing: "-0.03em",
            lineHeight: 1.1,
          }}
        >
          {value}
        </div>
        <div
          style={{
            fontSize: 12.5,
            color: "#64748b",
            fontWeight: 500,
            marginTop: 2,
          }}
        >
          {label}
        </div>
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
