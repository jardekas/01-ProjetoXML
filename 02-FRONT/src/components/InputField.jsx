import PropTypes from "prop-types";

export default function InputField({
  label,
  value,
  onChange,
  onFocus,
  onBlur,
  placeholder,
  type = "text",
  icon,
  focused,
  monospace = false,
  ...props
}) {
  const inputStyle = {
    width: "100%",
    background: "white",
    border: `1.5px solid ${focused ? "#1d4ed8" : "#e5e7eb"}`,
    borderRadius: 9,
    padding: icon ? "11px 14px 11px 40px" : "11px 14px",
    fontSize: 14,
    fontFamily: monospace
      ? "'JetBrains Mono', monospace"
      : "'Outfit', sans-serif",
    color: "#0f172a",
    outline: "none",
    transition: "border-color 0.2s, box-shadow 0.2s",
    boxShadow: focused ? "0 0 0 3px rgba(29,78,216,0.1)" : "none",
    boxSizing: "border-box",
  };

  return (
    <div>
      <label
        style={{
          display: "block",
          fontSize: 13,
          fontWeight: 600,
          color: "#374151",
          marginBottom: 7,
        }}
      >
        {label}
      </label>
      <div style={{ position: "relative" }}>
        {icon && (
          <span
            style={{
              position: "absolute",
              left: 12,
              top: "50%",
              transform: "translateY(-50%)",
              pointerEvents: "none",
            }}
          >
            {icon}
          </span>
        )}
        <input
          type={type}
          style={inputStyle}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
          {...props}
        />
      </div>
    </div>
  );
}

InputField.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  placeholder: PropTypes.string,
  type: PropTypes.string,
  icon: PropTypes.node,
  focused: PropTypes.bool,
  monospace: PropTypes.bool,
};
