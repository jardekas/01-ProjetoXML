import PropTypes from "prop-types";

export default function ToggleSwitch({
  checked,
  onChange,
  label,
  description,
  icon,
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "14px 16px",
        background: "#f8fafc",
        borderRadius: 11,
        border: "1px solid #f1f5f9",
        marginBottom: 22,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div
          style={{
            width: 34,
            height: 34,
            borderRadius: 9,
            background: checked ? "#1e293b" : "#f1f5f9",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "background 0.3s",
          }}
        >
          {icon}
        </div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 600, color: "#0f172a" }}>
            {label}
          </div>
          <div style={{ fontSize: 12.5, color: "#94a3b8", marginTop: 1 }}>
            {description}
          </div>
        </div>
      </div>
      <button
        className="toggle-track"
        style={{ background: checked ? "#1d4ed8" : "#d1d5db" }}
        onClick={() => onChange(!checked)}
      >
        <div className="toggle-thumb" style={{ left: checked ? 23 : 3 }} />
      </button>
    </div>
  );
}

ToggleSwitch.propTypes = {
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  icon: PropTypes.node.isRequired,
};
