import PropTypes from "prop-types";

export default function ToggleSwitch({
  checked,
  onChange,
  label,
  description,
  icon,
}) {
  return (
    <div className="toggle-switch">
      <div className="toggle-switch__content">
        <div
          className={`toggle-switch__icon ${
            checked ? "toggle-switch__icon--on" : "toggle-switch__icon--off"
          }`}
        >
          {icon}
        </div>
        <div>
          <div className="toggle-switch__label">{label}</div>
          <div className="toggle-switch__description">{description}</div>
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
